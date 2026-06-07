'use client';

import React, { useState, useMemo } from 'react';
import {
  UserCog, Search, Plus, MoreHorizontal, Pencil, Trash2, Eye,
  Clock, Calendar, CalendarDays, Building2, Briefcase, Mail, Phone,
  Timer, LogIn, LogOut, CheckCircle2, XCircle, AlertCircle,
  ChevronLeft, ChevronRight, Users, DollarSign,
} from 'lucide-react';
import { mockEmployees, mockShifts, mockBusiness, mockAttendance } from '@/data/mockData';
import { formatCurrency, formatNumber, formatDate, formatTime, getStatusColor, getInitials } from '@/lib/helpers';
import type { Employee, Shift, Attendance } from '@/types';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

// ============================================
// DEPARTMENT COLORS
// ============================================
const departmentColors: Record<string, { bg: string; text: string; darkBg: string; darkText: string }> = {
  Management: { bg: 'bg-amber-100', text: 'text-amber-800', darkBg: 'dark:bg-amber-900/30', darkText: 'dark:text-amber-400' },
  Sales: { bg: 'bg-sky-100', text: 'text-sky-800', darkBg: 'dark:bg-sky-900/30', darkText: 'dark:text-sky-400' },
  Operations: { bg: 'bg-emerald-100', text: 'text-emerald-800', darkBg: 'dark:bg-emerald-900/30', darkText: 'dark:text-emerald-400' },
  IT: { bg: 'bg-violet-100', text: 'text-violet-800', darkBg: 'dark:bg-violet-900/30', darkText: 'dark:text-violet-400' },
  Finance: { bg: 'bg-rose-100', text: 'text-rose-800', darkBg: 'dark:bg-rose-900/30', darkText: 'dark:text-rose-400' },
};

// ============================================
// DEFAULT FORM
// ============================================
const defaultEmployeeForm = {
  firstName: '', lastName: '', email: '', phone: '',
  position: '', department: '', branch: '',
  hireDate: '', salary: '',
};

// ============================================
// EMPLOYEES PAGE COMPONENT
// ============================================
export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([...mockEmployees]);
  const [shifts, setShifts] = useState<Shift[]>([...mockShifts]);
  const [attendance, setAttendance] = useState<Attendance[]>([...mockAttendance]);

  // Tab 1 state: Employees
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [branchFilter, setBranchFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);
  const [employeeForm, setEmployeeForm] = useState(defaultEmployeeForm);

  // Tab 2 state: Shifts
  const [isShiftDialogOpen, setIsShiftDialogOpen] = useState(false);
  const [shiftForm, setShiftForm] = useState({
    employeeId: '', date: '', startTime: '', endTime: '',
  });

  // Tab 3 state: Attendance
  const [clockInEmployeeId, setClockInEmployeeId] = useState('');
  const [clockOutEmployeeId, setClockOutEmployeeId] = useState('');

  // ============================================
  // DERIVED DATA
  // ============================================
  const departments = useMemo(() => {
    const depts = new Set(employees.map((e) => e.department).filter(Boolean) as string[]);
    return Array.from(depts).sort();
  }, [employees]);

  const branches = useMemo(() => {
    const branchMap = new Map<string, string>();
    employees.forEach((e) => branchMap.set(e.branchId, e.branchName));
    return Array.from(branchMap.entries()).map(([id, name]) => ({ id, name }));
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((e) => {
      const matchSearch = search === '' ||
        `${e.firstName} ${e.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        e.email.toLowerCase().includes(search.toLowerCase()) ||
        e.code.toLowerCase().includes(search.toLowerCase()) ||
        e.position.toLowerCase().includes(search.toLowerCase());
      const matchDept = deptFilter === 'all' || e.department === deptFilter;
      const matchBranch = branchFilter === 'all' || e.branchId === branchFilter;
      return matchSearch && matchDept && matchBranch;
    });
  }, [employees, search, deptFilter, branchFilter]);

  // Today's shifts
  const todayShifts = useMemo(() => {
    const today = '2026-06-08';
    return shifts.filter((s) => s.date === today);
  }, [shifts]);

  // Week view data
  const weekDays = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, i) => {
      const date = new Date('2026-06-08');
      date.setDate(date.getDate() - date.getDay() + i + 1);
      const dateStr = date.toISOString().split('T')[0];
      const dayShifts = shifts.filter((s) => s.date === dateStr);
      return { day, date: dateStr, shifts: dayShifts };
    });
  }, [shifts]);

  // Today's attendance
  const todayAttendance = useMemo(() => {
    const today = '2026-06-08';
    return attendance.filter((a) => a.date === today);
  }, [attendance]);

  // Monthly summary
  const monthlyStats = useMemo(() => {
    const totalRecords = attendance.length;
    const onTime = attendance.filter((a) => {
      const clockInTime = new Date(a.clockIn);
      return clockInTime.getHours() < 9 || (clockInTime.getHours() === 9 && clockInTime.getMinutes() === 0);
    }).length;
    const late = attendance.filter((a) => {
      const clockInTime = new Date(a.clockIn);
      return clockInTime.getHours() > 9 || (clockInTime.getHours() === 9 && clockInTime.getMinutes() > 0);
    }).length;
    const completed = attendance.filter((a) => a.clockOut).length;
    const avgHours = attendance
      .filter((a) => a.clockOut)
      .reduce((sum, a) => {
        const diff = (new Date(a.clockOut!).getTime() - new Date(a.clockIn).getTime()) / (1000 * 60 * 60);
        return sum + diff;
      }, 0) / Math.max(completed, 1);
    return { totalRecords, onTime, late, completed, avgHours: avgHours.toFixed(1) };
  }, [attendance]);

  // ============================================
  // EMPLOYEE DIALOG HANDLERS
  // ============================================
  const openAddEmployee = () => {
    setEditingEmployee(null);
    setEmployeeForm(defaultEmployeeForm);
    setIsAddDialogOpen(true);
  };

  const openEditEmployee = (emp: Employee) => {
    setEditingEmployee(emp);
    setEmployeeForm({
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      phone: emp.phone || '',
      position: emp.position,
      department: emp.department || '',
      branch: emp.branchId,
      hireDate: emp.hireDate || '',
      salary: emp.salary ? String(emp.salary) : '',
    });
    setIsAddDialogOpen(true);
  };

  const handleSaveEmployee = () => {
    const branchObj = mockBusiness.branches.find((b) => b.id === employeeForm.branch);
    if (editingEmployee) {
      setEmployees((prev) =>
        prev.map((e) =>
          e.id === editingEmployee.id
            ? {
                ...e,
                firstName: employeeForm.firstName,
                lastName: employeeForm.lastName,
                email: employeeForm.email,
                phone: employeeForm.phone || undefined,
                position: employeeForm.position,
                department: employeeForm.department || undefined,
                branchId: employeeForm.branch || e.branchId,
                branchName: branchObj?.name || e.branchName,
                hireDate: employeeForm.hireDate || undefined,
                salary: employeeForm.salary ? Number(employeeForm.salary) : undefined,
              }
            : e
        )
      );
    } else {
      const newEmployee: Employee = {
        id: `emp_${Date.now()}`,
        code: `EMP-${String(employees.length + 1).padStart(3, '0')}`,
        firstName: employeeForm.firstName,
        lastName: employeeForm.lastName,
        email: employeeForm.email,
        phone: employeeForm.phone || undefined,
        position: employeeForm.position,
        department: employeeForm.department || undefined,
        branchId: employeeForm.branch || 'br_001',
        branchName: branchObj?.name || 'Main Street Store',
        hireDate: employeeForm.hireDate || undefined,
        salary: employeeForm.salary ? Number(employeeForm.salary) : undefined,
        isActive: true,
      };
      setEmployees((prev) => [...prev, newEmployee]);
    }
    setIsAddDialogOpen(false);
  };

  const handleDeleteEmployee = () => {
    if (deletingEmployee) {
      setEmployees((prev) => prev.filter((e) => e.id !== deletingEmployee.id));
      setIsDeleteDialogOpen(false);
      setDeletingEmployee(null);
    }
  };

  // ============================================
  // SHIFT DIALOG HANDLERS
  // ============================================
  const handleSaveShift = () => {
    const emp = employees.find((e) => e.id === shiftForm.employeeId);
    if (!emp || !shiftForm.date || !shiftForm.startTime || !shiftForm.endTime) return;
    const newShift: Shift = {
      id: `sh_${Date.now()}`,
      date: shiftForm.date,
      startTime: `${shiftForm.date}T${shiftForm.startTime}:00Z`,
      endTime: `${shiftForm.date}T${shiftForm.endTime}:00Z`,
      status: 'scheduled',
      employeeId: emp.id,
      employeeName: `${emp.firstName} ${emp.lastName}`,
    };
    setShifts((prev) => [...prev, newShift]);
    setIsShiftDialogOpen(false);
    setShiftForm({ employeeId: '', date: '', startTime: '', endTime: '' });
  };

  // ============================================
  // ATTENDANCE HANDLERS
  // ============================================
  const handleClockIn = () => {
    if (!clockInEmployeeId) return;
    const emp = employees.find((e) => e.id === clockInEmployeeId);
    if (!emp) return;
    const now = new Date();
    const newAtt: Attendance = {
      id: `att_${Date.now()}`,
      date: now.toISOString().split('T')[0],
      clockIn: now.toISOString(),
      employeeId: emp.id,
      employeeName: `${emp.firstName} ${emp.lastName}`,
    };
    setAttendance((prev) => [...prev, newAtt]);
    setClockInEmployeeId('');
  };

  const handleClockOut = () => {
    if (!clockOutEmployeeId) return;
    setAttendance((prev) => {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      return prev.map((a) => {
        if (a.employeeId === clockOutEmployeeId && a.date === today && !a.clockOut) {
          return { ...a, clockOut: now.toISOString() };
        }
        return a;
      });
    });
    setClockOutEmployeeId('');
  };

  // ============================================
  // HELPERS
  // ============================================
  const getDeptBadge = (dept?: string) => {
    if (!dept) return <Badge variant="secondary">—</Badge>;
    const cfg = departmentColors[dept] || { bg: 'bg-gray-100', text: 'text-gray-800', darkBg: 'dark:bg-gray-900/30', darkText: 'dark:text-gray-400' };
    return (
      <Badge variant="secondary" className={`${cfg.bg} ${cfg.text} ${cfg.darkBg} ${cfg.darkText}`}>
        {dept}
      </Badge>
    );
  };

  const getDuration = (clockIn: string, clockOut?: string) => {
    const start = new Date(clockIn);
    const end = clockOut ? new Date(clockOut) : new Date();
    const diffMs = end.getTime() - start.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m`;
  };

  const getAttendanceStatus = (clockIn: string, clockOut?: string) => {
    const clockInTime = new Date(clockIn);
    if (!clockOut) {
      return { label: 'In Progress', className: 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400' };
    }
    if (clockInTime.getHours() > 9 || (clockInTime.getHours() === 9 && clockInTime.getMinutes() > 0)) {
      return { label: 'Late', className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' };
    }
    return { label: 'On Time', className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' };
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b bg-background px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Employee Management</h1>
            <p className="text-sm text-muted-foreground">Manage employees, shifts, and attendance</p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 dark:bg-emerald-950/30">
              <Users className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">{employees.filter((e) => e.isActive).length} Active</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-md bg-sky-50 px-2.5 py-1 dark:bg-sky-950/30">
              <Clock className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
              <span className="text-sky-700 dark:text-sky-400 font-medium">{todayShifts.length} On Shift</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="employees" className="flex flex-1 flex-col overflow-hidden">
        <div className="border-b px-4 sm:px-6">
          <TabsList className="h-10 w-full justify-start gap-0 bg-transparent p-0">
            <TabsTrigger
              value="employees"
              className="relative h-10 rounded-none border-b-2 border-transparent px-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <UserCog className="mr-1.5 h-4 w-4" />
              <span className="hidden sm:inline">Employees</span>
              <Badge variant="secondary" className="ml-1.5 h-5 min-w-[20px] px-1 text-xs">{employees.length}</Badge>
            </TabsTrigger>
            <TabsTrigger
              value="shifts"
              className="relative h-10 rounded-none border-b-2 border-transparent px-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <Clock className="mr-1.5 h-4 w-4" />
              <span className="hidden sm:inline">Shifts</span>
            </TabsTrigger>
            <TabsTrigger
              value="attendance"
              className="relative h-10 rounded-none border-b-2 border-transparent px-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <CalendarDays className="mr-1.5 h-4 w-4" />
              <span className="hidden sm:inline">Attendance</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ============================================ */}
        {/* TAB 1: EMPLOYEES */}
        {/* ============================================ */}
        <TabsContent value="employees" className="flex-1 overflow-auto p-4 sm:p-6">
          {/* Search / Filter Bar */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
                  className="pl-8"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={deptFilter} onValueChange={setDeptFilter}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="All Depts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={branchFilter} onValueChange={setBranchFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="All Branches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {branches.map((b) => (
                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={openAddEmployee} className="gap-1.5">
              <Plus className="h-4 w-4" /> Add Employee
            </Button>
          </div>

          {/* Employees Table */}
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Employee</TableHead>
                  <TableHead className="hidden lg:table-cell">Code</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead className="hidden sm:table-cell">Department</TableHead>
                  <TableHead className="hidden lg:table-cell">Branch</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                      No employees found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((emp) => (
                    <TableRow
                      key={emp.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setViewingEmployee(emp)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                              {getInitials(`${emp.firstName} ${emp.lastName}`)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{emp.firstName} {emp.lastName}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{emp.code}</code>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                        {emp.email}
                      </TableCell>
                      <TableCell className="text-sm">{emp.position}</TableCell>
                      <TableCell className="hidden sm:table-cell">{getDeptBadge(emp.department)}</TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                        {emp.branchName}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getStatusColor(emp.isActive ? 'active' : 'cancelled')}>
                          {emp.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setViewingEmployee(emp); }}>
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openEditEmployee(emp); }}>
                              <Pencil className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={(e) => { e.stopPropagation(); setDeletingEmployee(emp); setIsDeleteDialogOpen(true); }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-3 text-xs text-muted-foreground">
            Showing {filteredEmployees.length} of {employees.length} employees
          </div>
        </TabsContent>

        {/* ============================================ */}
        {/* TAB 2: SHIFTS */}
        {/* ============================================ */}
        <TabsContent value="shifts" className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Today&apos;s Shifts</h2>
              <p className="text-sm text-muted-foreground">{todayShifts.length} shifts scheduled for today</p>
            </div>
            <Button onClick={() => setIsShiftDialogOpen(true)} className="gap-1.5">
              <Plus className="h-4 w-4" /> Schedule Shift
            </Button>
          </div>

          {/* Today's Shifts List */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-6">
            {todayShifts.length === 0 ? (
              <div className="sm:col-span-2 lg:col-span-3 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                No shifts scheduled for today
              </div>
            ) : (
              todayShifts.map((shift) => {
                const emp = employees.find((e) => e.id === shift.employeeId);
                return (
                  <Card key={shift.id} className="transition-shadow hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="text-sm bg-primary/10 text-primary">
                            {getInitials(shift.employeeName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{shift.employeeName}</p>
                          <p className="text-xs text-muted-foreground">{emp?.position || 'Employee'}</p>
                        </div>
                        <Badge variant="secondary" className={getStatusColor(shift.status)}>
                          {shift.status === 'in_progress' ? 'In Progress' : shift.status.charAt(0).toUpperCase() + shift.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(shift.startTime)} — {shift.endTime ? formatTime(shift.endTime) : '—'}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          {/* Week View Summary */}
          <div>
            <h3 className="text-base font-semibold mb-3">Week Overview</h3>
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((dayInfo) => (
                <div key={dayInfo.day} className="rounded-lg border p-2 text-center">
                  <p className="text-xs font-medium text-muted-foreground mb-1">{dayInfo.day}</p>
                  <p className="text-sm font-bold mb-2">{new Date(dayInfo.date).getDate()}</p>
                  <div className="space-y-1">
                    {dayInfo.shifts.length === 0 ? (
                      <p className="text-[10px] text-muted-foreground">—</p>
                    ) : (
                      dayInfo.shifts.map((s) => (
                        <div
                          key={s.id}
                          className="rounded px-1 py-0.5 text-[10px] font-medium bg-primary/10 text-primary truncate"
                          title={`${s.employeeName} ${formatTime(s.startTime)}`}
                        >
                          {s.employeeName.split(' ')[0]}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ============================================ */}
        {/* TAB 3: ATTENDANCE */}
        {/* ============================================ */}
        <TabsContent value="attendance" className="flex-1 overflow-auto p-4 sm:p-6">
          {/* Clock In/Out Controls */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card className="border-emerald-200 dark:border-emerald-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <LogIn className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="font-semibold">Clock In</h3>
                </div>
                <div className="flex gap-2">
                  <Select value={clockInEmployeeId} onValueChange={setClockInEmployeeId}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.filter((e) => e.isActive).map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.firstName} {emp.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleClockIn} disabled={!clockInEmployeeId} className="bg-emerald-600 hover:bg-emerald-700 gap-1.5">
                    <LogIn className="h-4 w-4" /> Clock In
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="border-rose-200 dark:border-rose-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <LogOut className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                  <h3 className="font-semibold">Clock Out</h3>
                </div>
                <div className="flex gap-2">
                  <Select value={clockOutEmployeeId} onValueChange={setClockOutEmployeeId}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.filter((e) => e.isActive).map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.firstName} {emp.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleClockOut} disabled={!clockOutEmployeeId} variant="destructive" className="gap-1.5">
                    <LogOut className="h-4 w-4" /> Clock Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Today's Attendance */}
          <div className="mb-6">
            <h3 className="text-base font-semibold mb-3">Today&apos;s Attendance</h3>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead className="text-center">Clock In</TableHead>
                    <TableHead className="text-center">Clock Out</TableHead>
                    <TableHead className="text-center">Duration</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todayAttendance.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        No attendance records for today
                      </TableCell>
                    </TableRow>
                  ) : (
                    todayAttendance.map((att) => {
                      const status = getAttendanceStatus(att.clockIn, att.clockOut);
                      return (
                        <TableRow key={att.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-7 w-7">
                                <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                                  {getInitials(att.employeeName)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-sm">{att.employeeName}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center text-sm">{formatTime(att.clockIn)}</TableCell>
                          <TableCell className="text-center text-sm">
                            {att.clockOut ? formatTime(att.clockOut) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center text-sm font-medium">
                            {getDuration(att.clockIn, att.clockOut)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={status.className}>{status.label}</Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Monthly Summary */}
          <div>
            <h3 className="text-base font-semibold mb-3">Monthly Summary</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{monthlyStats.onTime}</p>
                  <p className="text-sm text-muted-foreground">On Time</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <AlertCircle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{monthlyStats.late}</p>
                  <p className="text-sm text-muted-foreground">Late</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Timer className="h-8 w-8 text-sky-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{monthlyStats.avgHours}h</p>
                  <p className="text-sm text-muted-foreground">Avg Hours</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Calendar className="h-8 w-8 text-violet-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{monthlyStats.totalRecords}</p>
                  <p className="text-sm text-muted-foreground">Total Records</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* ============================================ */}
      {/* ADD/EDIT EMPLOYEE DIALOG */}
      {/* ============================================ */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[540px]">
          <DialogHeader>
            <DialogTitle>{editingEmployee ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
            <DialogDescription>
              {editingEmployee ? 'Update employee information' : 'Add a new employee to the system'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emp-firstName">First Name</Label>
                <Input
                  id="emp-firstName"
                  value={employeeForm.firstName}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, firstName: e.target.value })}
                  placeholder="First name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emp-lastName">Last Name</Label>
                <Input
                  id="emp-lastName"
                  value={employeeForm.lastName}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, lastName: e.target.value })}
                  placeholder="Last name"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emp-email">Email</Label>
                <Input
                  id="emp-email"
                  type="email"
                  value={employeeForm.email}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                  placeholder="email@techretail.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emp-phone">Phone</Label>
                <Input
                  id="emp-phone"
                  value={employeeForm.phone}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, phone: e.target.value })}
                  placeholder="+1-555-0000"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emp-position">Position</Label>
                <Input
                  id="emp-position"
                  value={employeeForm.position}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, position: e.target.value })}
                  placeholder="Job title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emp-department">Department</Label>
                <Select
                  value={employeeForm.department}
                  onValueChange={(v) => setEmployeeForm({ ...employeeForm, department: v })}
                >
                  <SelectTrigger id="emp-department">
                    <SelectValue placeholder="Select dept" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Management">Management</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emp-branch">Branch</Label>
                <Select
                  value={employeeForm.branch}
                  onValueChange={(v) => setEmployeeForm({ ...employeeForm, branch: v })}
                >
                  <SelectTrigger id="emp-branch">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockBusiness.branches.filter((b) => b.isActive).map((b) => (
                      <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="emp-hireDate">Hire Date</Label>
                <Input
                  id="emp-hireDate"
                  type="date"
                  value={employeeForm.hireDate}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, hireDate: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="emp-salary">Salary</Label>
              <Input
                id="emp-salary"
                type="number"
                value={employeeForm.salary}
                onChange={(e) => setEmployeeForm({ ...employeeForm, salary: e.target.value })}
                placeholder="Annual salary"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEmployee} disabled={!employeeForm.firstName || !employeeForm.lastName || !employeeForm.email}>
              {editingEmployee ? 'Save Changes' : 'Add Employee'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ============================================ */}
      {/* EMPLOYEE DETAIL DIALOG */}
      {/* ============================================ */}
      <Dialog open={!!viewingEmployee} onOpenChange={(open) => !open && setViewingEmployee(null)}>
        <DialogContent className="sm:max-w-[560px]">
          {viewingEmployee && (() => {
            const e = viewingEmployee;
            return (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-14 w-14">
                      <AvatarFallback className="text-lg bg-primary/10 text-primary">
                        {getInitials(`${e.firstName} ${e.lastName}`)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <DialogTitle className="text-xl">{e.firstName} {e.lastName}</DialogTitle>
                      <DialogDescription className="flex items-center gap-2 mt-1">
                        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{e.code}</code>
                        {getDeptBadge(e.department)}
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-4 mt-2">
                  {/* Contact Info */}
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{e.email}</span>
                    </div>
                    {e.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{e.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span>{e.position}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span>{e.branchName}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Employment Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Hire Date</span>
                      </div>
                      <p className="text-sm font-bold">{e.hireDate ? formatDate(e.hireDate) : 'N/A'}</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Salary</span>
                      </div>
                      <p className="text-sm font-bold">{e.salary ? formatCurrency(e.salary) : 'N/A'}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Additional Info */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Department</span>
                      <span>{e.department || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Branch</span>
                      <span>{e.branchName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <Badge variant="secondary" className={getStatusColor(e.isActive ? 'active' : 'cancelled')}>
                        {e.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tenure</span>
                      <span className="font-medium">
                        {e.hireDate
                          ? `${Math.floor((Date.now() - new Date(e.hireDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25))} yr${Math.floor((Date.now() - new Date(e.hireDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25)) !== 1 ? 's' : ''}`
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* ============================================ */}
      {/* DELETE CONFIRMATION DIALOG */}
      {/* ============================================ */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Delete Employee</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {deletingEmployee?.firstName} {deletingEmployee?.lastName}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteEmployee}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ============================================ */}
      {/* SCHEDULE SHIFT DIALOG */}
      {/* ============================================ */}
      <Dialog open={isShiftDialogOpen} onOpenChange={setIsShiftDialogOpen}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle>Schedule Shift</DialogTitle>
            <DialogDescription>Create a new shift schedule for an employee</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="shift-employee">Employee</Label>
              <Select value={shiftForm.employeeId} onValueChange={(v) => setShiftForm({ ...shiftForm, employeeId: v })}>
                <SelectTrigger id="shift-employee">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.filter((e) => e.isActive).map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName} — {emp.position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="shift-date">Date</Label>
              <Input
                id="shift-date"
                type="date"
                value={shiftForm.date}
                onChange={(e) => setShiftForm({ ...shiftForm, date: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="shift-start">Start Time</Label>
                <Input
                  id="shift-start"
                  type="time"
                  value={shiftForm.startTime}
                  onChange={(e) => setShiftForm({ ...shiftForm, startTime: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shift-end">End Time</Label>
                <Input
                  id="shift-end"
                  type="time"
                  value={shiftForm.endTime}
                  onChange={(e) => setShiftForm({ ...shiftForm, endTime: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsShiftDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveShift} disabled={!shiftForm.employeeId || !shiftForm.date || !shiftForm.startTime || !shiftForm.endTime}>
              Schedule Shift
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
