'use client';

import React, { useState, useMemo } from 'react';
import {
  Users, Search, Plus, MoreHorizontal, Pencil, Trash2, Eye,
  Crown, UserCheck, Package, UserPlus, Star, Gift, TrendingUp,
  Award, ChevronRight, Mail, Phone, MapPin, ShoppingBag, Wallet,
} from 'lucide-react';
import { mockCustomers, mockBusiness, mockLoyaltyActivity } from '@/data/mockData';
import { formatCurrency, formatNumber, formatDate, getStatusColor, getInitials } from '@/lib/helpers';
import type { Customer, CustomerGroup } from '@/types';

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
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';

// ============================================
// GROUP CONFIG
// ============================================
const groupConfig: Record<CustomerGroup, { label: string; icon: React.ElementType; color: string; bg: string; text: string; darkBg: string; darkText: string }> = {
  VIP: { label: 'VIP', icon: Crown, color: '#f59e0b', bg: 'bg-amber-100', text: 'text-amber-800', darkBg: 'dark:bg-amber-900/30', darkText: 'dark:text-amber-400' },
  Regular: { label: 'Regular', icon: UserCheck, color: '#3b82f6', bg: 'bg-sky-100', text: 'text-sky-800', darkBg: 'dark:bg-sky-900/30', darkText: 'dark:text-sky-400' },
  Wholesale: { label: 'Wholesale', icon: Package, color: '#8b5cf6', bg: 'bg-violet-100', text: 'text-violet-800', darkBg: 'dark:bg-violet-900/30', darkText: 'dark:text-violet-400' },
  New: { label: 'New', icon: UserPlus, color: '#10b981', bg: 'bg-emerald-100', text: 'text-emerald-800', darkBg: 'dark:bg-emerald-900/30', darkText: 'dark:text-emerald-400' },
};

// ============================================
// LOYALTY TIERS
// ============================================
const loyaltyTiers = [
  { name: 'Bronze', min: 0, max: 500, color: '#b45309', bg: 'bg-orange-100 dark:bg-orange-900/20', icon: '🥉' },
  { name: 'Silver', min: 501, max: 2000, color: '#6b7280', bg: 'bg-gray-200 dark:bg-gray-700/30', icon: '🥈' },
  { name: 'Gold', min: 2001, max: 5000, color: '#d97706', bg: 'bg-amber-100 dark:bg-amber-900/20', icon: '🥇' },
  { name: 'Platinum', min: 5001, max: Infinity, color: '#7c3aed', bg: 'bg-violet-100 dark:bg-violet-900/20', icon: '💎' },
];

// ============================================
// DEFAULT FORM
// ============================================
const defaultCustomerForm = {
  firstName: '', lastName: '', email: '', phone: '',
  address: '', city: '', group: 'New' as CustomerGroup, notes: '',
};

// ============================================
// CUSTOMERS PAGE COMPONENT
// ============================================
export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([...mockCustomers]);

  // Tab 1 state
  const [search, setSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);
  const [customerForm, setCustomerForm] = useState(defaultCustomerForm);

  // ============================================
  // FILTERED DATA
  // ============================================
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchSearch = search === '' ||
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase()) ||
        c.phone?.includes(search) ||
        c.code.toLowerCase().includes(search.toLowerCase());
      const matchGroup = groupFilter === 'all' || c.group === groupFilter;
      return matchSearch && matchGroup;
    });
  }, [customers, search, groupFilter]);

  // ============================================
  // GROUP STATS
  // ============================================
  const groupStats = useMemo(() => {
    const groups: CustomerGroup[] = ['VIP', 'Regular', 'Wholesale', 'New'];
    return groups.map((g) => {
      const members = customers.filter((c) => c.group === g);
      const count = members.length;
      const totalRevenue = members.reduce((s, c) => s + c.totalSpent, 0);
      const avgSpend = count > 0 ? totalRevenue / count : 0;
      return { group: g, count, avgSpend, totalRevenue };
    });
  }, [customers]);

  // ============================================
  // LOYALTY STATS
  // ============================================
  const loyaltyStats = useMemo(() => {
    const totalIssued = mockLoyaltyActivity
      .filter((a) => a.type === 'earned' || a.type === 'bonus')
      .reduce((s, a) => s + a.points, 0);
    const totalRedeemed = mockLoyaltyActivity
      .filter((a) => a.type === 'redeemed')
      .reduce((s, a) => s + a.points, 0);
    const activeMembers = customers.filter((c) => c.loyaltyPoints > 0).length;
    return { totalIssued, totalRedeemed, activeMembers };
  }, [customers]);

  // ============================================
  // DIALOG HANDLERS
  // ============================================
  const openAddCustomer = () => {
    setEditingCustomer(null);
    setCustomerForm(defaultCustomerForm);
    setIsAddDialogOpen(true);
  };

  const openEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setCustomerForm({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || '',
      city: customer.city || '',
      group: customer.group || 'New',
      notes: '',
    });
    setIsAddDialogOpen(true);
  };

  const handleSaveCustomer = () => {
    if (editingCustomer) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === editingCustomer.id
            ? { ...c, ...customerForm }
            : c
        )
      );
    } else {
      const newCustomer: Customer = {
        id: `cust_${Date.now()}`,
        code: `CUST-${String(customers.length + 1).padStart(3, '0')}`,
        firstName: customerForm.firstName,
        lastName: customerForm.lastName,
        email: customerForm.email || undefined,
        phone: customerForm.phone || undefined,
        address: customerForm.address || undefined,
        city: customerForm.city || undefined,
        loyaltyPoints: 0,
        creditBalance: 0,
        totalSpent: 0,
        totalOrders: 0,
        group: customerForm.group,
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setCustomers((prev) => [...prev, newCustomer]);
    }
    setIsAddDialogOpen(false);
  };

  const handleDeleteCustomer = () => {
    if (deletingCustomer) {
      setCustomers((prev) => prev.filter((c) => c.id !== deletingCustomer.id));
      setIsDeleteDialogOpen(false);
      setDeletingCustomer(null);
    }
  };

  // ============================================
  // HELPERS
  // ============================================
  const getTierForPoints = (points: number) => {
    return loyaltyTiers.find((t) => points >= t.min && points <= t.max) || loyaltyTiers[0];
  };

  const getGroupBadge = (group?: CustomerGroup) => {
    if (!group) return <Badge variant="secondary">—</Badge>;
    const cfg = groupConfig[group];
    return (
      <Badge variant="secondary" className={`${cfg.bg} ${cfg.text} ${cfg.darkBg} ${cfg.darkText} gap-1`}>
        <cfg.icon className="h-3 w-3" />
        {cfg.label}
      </Badge>
    );
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
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Customer Management</h1>
            <p className="text-sm text-muted-foreground">Manage customers, groups, and loyalty programs</p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5 rounded-md bg-sky-50 px-2.5 py-1 dark:bg-sky-950/30">
              <Users className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
              <span className="text-sky-700 dark:text-sky-400 font-medium">{customers.length} Customers</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-1 dark:bg-amber-950/30">
              <Star className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              <span className="text-amber-700 dark:text-amber-400 font-medium">{loyaltyStats.activeMembers} Loyalty</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="customers" className="flex flex-1 flex-col overflow-hidden">
        <div className="border-b px-4 sm:px-6">
          <TabsList className="h-10 w-full justify-start gap-0 bg-transparent p-0">
            <TabsTrigger
              value="customers"
              className="relative h-10 rounded-none border-b-2 border-transparent px-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <Users className="mr-1.5 h-4 w-4" />
              <span className="hidden sm:inline">Customers</span>
              <Badge variant="secondary" className="ml-1.5 h-5 min-w-[20px] px-1 text-xs">{customers.length}</Badge>
            </TabsTrigger>
            <TabsTrigger
              value="groups"
              className="relative h-10 rounded-none border-b-2 border-transparent px-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <UserCheck className="mr-1.5 h-4 w-4" />
              <span className="hidden sm:inline">Groups</span>
            </TabsTrigger>
            <TabsTrigger
              value="loyalty"
              className="relative h-10 rounded-none border-b-2 border-transparent px-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <Award className="mr-1.5 h-4 w-4" />
              <span className="hidden sm:inline">Loyalty</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ============================================ */}
        {/* TAB 1: CUSTOMERS LIST */}
        {/* ============================================ */}
        <TabsContent value="customers" className="flex-1 overflow-auto p-4 sm:p-6">
          {/* Search / Filter Bar */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers..."
                  className="pl-8"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={groupFilter} onValueChange={setGroupFilter}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="All Groups" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Groups</SelectItem>
                  <SelectItem value="VIP">VIP</SelectItem>
                  <SelectItem value="Regular">Regular</SelectItem>
                  <SelectItem value="Wholesale">Wholesale</SelectItem>
                  <SelectItem value="New">New</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={openAddCustomer} className="gap-1.5">
              <Plus className="h-4 w-4" /> Add Customer
            </Button>
          </div>

          {/* Customers Table */}
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[160px]">Customer</TableHead>
                  <TableHead className="hidden lg:table-cell">Code</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden sm:table-cell">Phone</TableHead>
                  <TableHead>Group</TableHead>
                  <TableHead className="text-right hidden md:table-cell">Points</TableHead>
                  <TableHead className="text-right hidden lg:table-cell">Spent</TableHead>
                  <TableHead className="text-right hidden xl:table-cell">Orders</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
                      No customers found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer) => {
                    const tier = getTierForPoints(customer.loyaltyPoints);
                    return (
                      <TableRow
                        key={customer.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => setViewingCustomer(customer)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                {getInitials(`${customer.firstName} ${customer.lastName}`)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{customer.firstName} {customer.lastName}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{customer.code}</code>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                          {customer.email || '—'}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                          {customer.phone || '—'}
                        </TableCell>
                        <TableCell>{getGroupBadge(customer.group)}</TableCell>
                        <TableCell className="text-right hidden md:table-cell">
                          <span className="text-sm">{formatNumber(customer.loyaltyPoints)}</span>
                        </TableCell>
                        <TableCell className="text-right hidden lg:table-cell font-medium">
                          {formatCurrency(customer.totalSpent)}
                        </TableCell>
                        <TableCell className="text-right hidden xl:table-cell text-muted-foreground">
                          {customer.totalOrders}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={getStatusColor(customer.isActive ? 'active' : 'cancelled')}>
                            {customer.isActive ? 'Active' : 'Inactive'}
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
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setViewingCustomer(customer); }}>
                                <Eye className="mr-2 h-4 w-4" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openEditCustomer(customer); }}>
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={(e) => { e.stopPropagation(); setDeletingCustomer(customer); setIsDeleteDialogOpen(true); }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-3 text-xs text-muted-foreground">
            Showing {filteredCustomers.length} of {customers.length} customers
          </div>
        </TabsContent>

        {/* ============================================ */}
        {/* TAB 2: CUSTOMER GROUPS */}
        {/* ============================================ */}
        <TabsContent value="groups" className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Customer Groups</h2>
            <p className="text-sm text-muted-foreground">Overview of customer segments and their performance</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {groupStats.map(({ group, count, avgSpend, totalRevenue }) => {
              const cfg = groupConfig[group];
              const IconComp = cfg.icon;
              return (
                <Card key={group} className="group relative overflow-hidden transition-shadow hover:shadow-md">
                  <div className="h-1.5 w-full" style={{ backgroundColor: cfg.color }} />
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-xl"
                        style={{ backgroundColor: `${cfg.color}15`, color: cfg.color }}
                      >
                        <IconComp className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{cfg.label}</h3>
                        <p className="text-sm text-muted-foreground">{count} customer{count !== 1 ? 's' : ''}</p>
                      </div>
                    </div>

                    <Separator className="my-3" />

                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Avg. Spend</span>
                        <span className="text-sm font-semibold">{formatCurrency(avgSpend)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Revenue</span>
                        <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(totalRevenue)}</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Badge className={`${cfg.bg} ${cfg.text} ${cfg.darkBg} ${cfg.darkText}`}>
                        {cfg.label} Tier
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Group comparison table */}
          <div className="mt-6 rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Group</TableHead>
                  <TableHead className="text-center">Customers</TableHead>
                  <TableHead className="text-right">Avg Spend</TableHead>
                  <TableHead className="text-right">Total Revenue</TableHead>
                  <TableHead className="text-right">% of Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupStats.map(({ group, count, avgSpend, totalRevenue }) => {
                  const totalAll = groupStats.reduce((s, g) => s + g.totalRevenue, 0);
                  const pct = totalAll > 0 ? ((totalRevenue / totalAll) * 100).toFixed(1) : '0';
                  const cfg = groupConfig[group];
                  return (
                    <TableRow key={group}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: cfg.color }} />
                          <span className="font-medium">{cfg.label}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{count}</TableCell>
                      <TableCell className="text-right">{formatCurrency(avgSpend)}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(totalRevenue)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Progress value={Number(pct)} className="h-2 w-16" />
                          <span className="text-sm text-muted-foreground w-12 text-right">{pct}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* ============================================ */}
        {/* TAB 3: LOYALTY PROGRAM */}
        {/* ============================================ */}
        <TabsContent value="loyalty" className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Loyalty Program</h2>
            <p className="text-sm text-muted-foreground">Track points, tiers, and member activity</p>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                    <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Points Issued</p>
                    <p className="text-2xl font-bold">{formatNumber(loyaltyStats.totalIssued)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/30">
                    <Gift className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Points Redeemed</p>
                    <p className="text-2xl font-bold">{formatNumber(loyaltyStats.totalRedeemed)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 dark:bg-sky-900/30">
                    <Users className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Members</p>
                    <p className="text-2xl font-bold">{loyaltyStats.activeMembers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Loyalty Tiers */}
          <div className="mb-6">
            <h3 className="text-base font-semibold mb-3">Loyalty Tiers</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {loyaltyTiers.map((tier) => {
                const members = customers.filter((c) => c.loyaltyPoints >= tier.min && c.loyaltyPoints <= tier.max);
                return (
                  <Card key={tier.name} className={`${tier.bg} border-0`}>
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">{tier.icon}</span>
                        <div>
                          <h4 className="font-bold text-lg">{tier.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {tier.min}{tier.max === Infinity ? '+' : ` - ${tier.max}`} points
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{members.length} members</span>
                        <Badge variant="outline" className="text-xs">
                          <ChevronRight className="h-3 w-3 mr-1" />
                          {tier.min}{tier.max === Infinity ? '+' : ` - ${tier.max}`}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h3 className="text-base font-semibold mb-3">Recent Activity</h3>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Points</TableHead>
                    <TableHead className="hidden md:table-cell">Description</TableHead>
                    <TableHead className="hidden sm:table-cell">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockLoyaltyActivity.map((activity) => {
                    const typeConfig = {
                      earned: { label: 'Earned', className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
                      redeemed: { label: 'Redeemed', className: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400' },
                      bonus: { label: 'Bonus', className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
                    };
                    const tc = typeConfig[activity.type];
                    return (
                      <TableRow key={activity.id}>
                        <TableCell>
                          <Badge variant="secondary" className={tc.className}>{tc.label}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{activity.customerName}</TableCell>
                        <TableCell className="text-right font-semibold">
                          {activity.type === 'redeemed' ? '-' : '+'}{activity.points}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                          {activity.description}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                          {formatDate(activity.date)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* ============================================ */}
      {/* ADD/EDIT CUSTOMER DIALOG */}
      {/* ============================================ */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>{editingCustomer ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
            <DialogDescription>
              {editingCustomer ? 'Update customer information' : 'Add a new customer to the system'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={customerForm.firstName}
                  onChange={(e) => setCustomerForm({ ...customerForm, firstName: e.target.value })}
                  placeholder="First name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={customerForm.lastName}
                  onChange={(e) => setCustomerForm({ ...customerForm, lastName: e.target.value })}
                  placeholder="Last name"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerForm.email}
                  onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={customerForm.phone}
                  onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                  placeholder="+1-555-0000"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={customerForm.address}
                onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
                placeholder="Street address"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={customerForm.city}
                  onChange={(e) => setCustomerForm({ ...customerForm, city: e.target.value })}
                  placeholder="City"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="group">Group</Label>
                <Select
                  value={customerForm.group}
                  onValueChange={(v) => setCustomerForm({ ...customerForm, group: v as CustomerGroup })}
                >
                  <SelectTrigger id="group">
                    <SelectValue placeholder="Select group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VIP">VIP</SelectItem>
                    <SelectItem value="Regular">Regular</SelectItem>
                    <SelectItem value="Wholesale">Wholesale</SelectItem>
                    <SelectItem value="New">New</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={customerForm.notes}
                onChange={(e) => setCustomerForm({ ...customerForm, notes: e.target.value })}
                placeholder="Additional notes..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveCustomer} disabled={!customerForm.firstName || !customerForm.lastName}>
              {editingCustomer ? 'Save Changes' : 'Add Customer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ============================================ */}
      {/* CUSTOMER DETAIL DIALOG */}
      {/* ============================================ */}
      <Dialog open={!!viewingCustomer} onOpenChange={(open) => !open && setViewingCustomer(null)}>
        <DialogContent className="sm:max-w-[600px]">
          {viewingCustomer && (() => {
            const c = viewingCustomer;
            const tier = getTierForPoints(c.loyaltyPoints);
            return (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="text-base bg-primary/10 text-primary">
                        {getInitials(`${c.firstName} ${c.lastName}`)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <DialogTitle className="text-xl">{c.firstName} {c.lastName}</DialogTitle>
                      <DialogDescription className="flex items-center gap-2 mt-1">
                        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{c.code}</code>
                        {getGroupBadge(c.group)}
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-4 mt-2">
                  {/* Contact Info */}
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {c.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{c.email}</span>
                      </div>
                    )}
                    {c.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{c.phone}</span>
                      </div>
                    )}
                    {(c.address || c.city) && (
                      <div className="flex items-center gap-2 text-sm sm:col-span-2">
                        <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span>{[c.address, c.city].filter(Boolean).join(', ')}</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Total Spent</span>
                      </div>
                      <p className="text-lg font-bold">{formatCurrency(c.totalSpent)}</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <Star className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Loyalty Points</span>
                      </div>
                      <p className="text-lg font-bold">{formatNumber(c.loyaltyPoints)}</p>
                      <Badge variant="outline" className="text-xs mt-1" style={{ borderColor: tier.color, color: tier.color }}>
                        {tier.icon} {tier.name}
                      </Badge>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Credit Balance</span>
                      </div>
                      <p className="text-lg font-bold">{formatCurrency(c.creditBalance)}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Purchase History Summary */}
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Purchase Summary</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Orders</span>
                        <span className="font-medium">{c.totalOrders}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Avg Order Value</span>
                        <span className="font-medium">{formatCurrency(c.totalOrders > 0 ? c.totalSpent / c.totalOrders : 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Member Since</span>
                        <span className="font-medium">{formatDate(c.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <Badge variant="secondary" className={getStatusColor(c.isActive ? 'active' : 'cancelled')}>
                          {c.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
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
            <DialogTitle>Delete Customer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {deletingCustomer?.firstName} {deletingCustomer?.lastName}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteCustomer}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
