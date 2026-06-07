'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  Shield, Search, Plus, MoreHorizontal, Pencil, Trash2, UserPlus,
  ShieldCheck, Lock, Unlock, Mail, Phone, Building2, Clock,
  ChevronDown, ChevronUp, CheckSquare, Square, Activity,
  Users, Eye, UserX, Key, AlertTriangle, Send, MonitorSmartphone,
} from 'lucide-react';
import { cn, formatDateTime, getInitials, getStatusColor } from '@/lib/helpers';
import type { SystemUser, UserRole, RoleDefinition, PermissionCategory } from '@/types';
import { PERMISSION_CATEGORIES, ALL_PERMISSIONS } from '@/types';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

// ============================================
// ROLE BADGE COLORS
// ============================================
const ROLE_COLORS: Record<UserRole, { bg: string; text: string; darkBg: string; darkText: string }> = {
  super_admin: { bg: 'bg-red-100', text: 'text-red-800', darkBg: 'dark:bg-red-900/30', darkText: 'dark:text-red-400' },
  admin: { bg: 'bg-amber-100', text: 'text-amber-800', darkBg: 'dark:bg-amber-900/30', darkText: 'dark:text-amber-400' },
  manager: { bg: 'bg-blue-100', text: 'text-blue-800', darkBg: 'dark:bg-blue-900/30', darkText: 'dark:text-blue-400' },
  cashier: { bg: 'bg-emerald-100', text: 'text-emerald-800', darkBg: 'dark:bg-emerald-900/30', darkText: 'dark:text-emerald-400' },
  viewer: { bg: 'bg-gray-100', text: 'text-gray-800', darkBg: 'dark:bg-gray-800/40', darkText: 'dark:text-gray-400' },
};

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Administrator',
  manager: 'Manager',
  cashier: 'Cashier',
  viewer: 'Viewer',
};

// ============================================
// BRANCH DATA
// ============================================
const BRANCHES = [
  { id: 'br_001', name: 'Main Street Store' },
  { id: 'br_002', name: 'Downtown Branch' },
  { id: 'br_003', name: 'Westside Mall' },
  { id: 'br_004', name: 'Harbor Plaza' },
];

// ============================================
// MOCK USERS
// ============================================
const INITIAL_USERS: SystemUser[] = [
  {
    id: 'usr_001', name: 'Alex Thompson', email: 'alex@techretail.com',
    phone: '+1-555-3001', role: 'admin', permissions: [],
    branchId: 'br_001', branchName: 'Main Street Store',
    mfaEnabled: true, isActive: true, lastLoginAt: '2026-03-04T14:30:00Z', createdAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'usr_002', name: 'Sarah Chen', email: 'sarah@techretail.com',
    phone: '+1-555-3002', role: 'super_admin', permissions: [],
    branchId: 'br_001', branchName: 'Main Street Store',
    mfaEnabled: true, isActive: true, lastLoginAt: '2026-03-04T09:15:00Z', createdAt: '2024-11-01T08:00:00Z',
  },
  {
    id: 'usr_003', name: 'Marcus Johnson', email: 'marcus@techretail.com',
    phone: '+1-555-3003', role: 'manager', permissions: [],
    branchId: 'br_002', branchName: 'Downtown Branch',
    mfaEnabled: true, isActive: true, lastLoginAt: '2026-03-04T11:45:00Z', createdAt: '2025-03-20T09:00:00Z',
  },
  {
    id: 'usr_004', name: 'Emily Rodriguez', email: 'emily@techretail.com',
    phone: '+1-555-3004', role: 'cashier', permissions: [],
    branchId: 'br_001', branchName: 'Main Street Store',
    mfaEnabled: false, isActive: true, lastLoginAt: '2026-03-03T16:20:00Z', createdAt: '2025-06-10T12:00:00Z',
  },
  {
    id: 'usr_005', name: 'David Kim', email: 'david@techretail.com',
    phone: '+1-555-3005', role: 'cashier', permissions: [],
    branchId: 'br_003', branchName: 'Westside Mall',
    mfaEnabled: false, isActive: true, lastLoginAt: '2026-03-04T08:00:00Z', createdAt: '2025-08-05T10:00:00Z',
  },
  {
    id: 'usr_006', name: 'Priya Patel', email: 'priya@techretail.com',
    phone: '+1-555-3006', role: 'manager', permissions: [],
    branchId: 'br_003', branchName: 'Westside Mall',
    mfaEnabled: true, isActive: true, lastLoginAt: '2026-03-04T13:10:00Z', createdAt: '2025-02-14T14:00:00Z',
  },
  {
    id: 'usr_007', name: 'James Wilson', email: 'james@techretail.com',
    phone: '+1-555-3007', role: 'viewer', permissions: [],
    branchId: 'br_004', branchName: 'Harbor Plaza',
    mfaEnabled: false, isActive: true, lastLoginAt: '2026-03-01T10:30:00Z', createdAt: '2025-09-01T11:00:00Z',
  },
  {
    id: 'usr_008', name: 'Lisa Martinez', email: 'lisa@techretail.com',
    phone: '+1-555-3008', role: 'cashier', permissions: [],
    branchId: 'br_002', branchName: 'Downtown Branch',
    mfaEnabled: false, isActive: false, lastLoginAt: '2026-02-15T17:45:00Z', createdAt: '2025-04-22T09:00:00Z',
  },
  {
    id: 'usr_009', name: 'Robert Chang', email: 'robert@techretail.com',
    phone: '+1-555-3009', role: 'admin', permissions: [],
    branchId: 'br_001', branchName: 'Main Street Store',
    mfaEnabled: true, isActive: true, lastLoginAt: '2026-03-04T15:00:00Z', createdAt: '2025-05-18T08:00:00Z',
  },
  {
    id: 'usr_010', name: 'Nina Okafor', email: 'nina@techretail.com',
    phone: '+1-555-3010', role: 'viewer', permissions: [],
    branchId: 'br_004', branchName: 'Harbor Plaza',
    mfaEnabled: false, isActive: false, lastLoginAt: '2026-02-28T12:00:00Z', createdAt: '2025-07-30T15:00:00Z',
  },
];

// ============================================
// MOCK ROLES
// ============================================
const INITIAL_ROLES: RoleDefinition[] = [
  {
    id: 'role_sa', name: 'super_admin', label: 'Super Admin',
    description: 'Full system access with all permissions. Can manage all settings, billing, and integrations.',
    color: 'red', permissions: ALL_PERMISSIONS.map((p) => p.id), userCount: 1,
  },
  {
    id: 'role_admin', name: 'admin', label: 'Administrator',
    description: 'Administrative access with most permissions except billing and integration management.',
    color: 'amber',
    permissions: ALL_PERMISSIONS.filter((p) => !['settings.billing', 'settings.integrations'].includes(p.id)).map((p) => p.id),
    userCount: 2,
  },
  {
    id: 'role_mgr', name: 'manager', label: 'Manager',
    description: 'Branch manager with access to POS, inventory, employees, and reports for their branch.',
    color: 'blue',
    permissions: [
      'dashboard.view', 'dashboard.analytics',
      'pos.access', 'pos.refund', 'pos.discount', 'pos.hold',
      'inventory.view', 'inventory.create', 'inventory.edit', 'inventory.transfer', 'inventory.adjust',
      'customers.view', 'customers.create', 'customers.edit', 'customers.credit',
      'suppliers.view',
      'employees.view', 'employees.create', 'employees.edit', 'employees.schedule', 'employees.salary',
      'transactions.view', 'transactions.refund',
      'reports.view', 'reports.sales', 'reports.financial',
      'users.view',
      'settings.view',
    ],
    userCount: 2,
  },
  {
    id: 'role_cash', name: 'cashier', label: 'Cashier',
    description: 'Point-of-sale access with basic transaction processing and customer lookup capabilities.',
    color: 'emerald',
    permissions: [
      'dashboard.view',
      'pos.access', 'pos.discount', 'pos.hold',
      'inventory.view',
      'customers.view', 'customers.create',
      'transactions.view',
      'reports.view',
    ],
    userCount: 3,
  },
  {
    id: 'role_view', name: 'viewer', label: 'Viewer',
    description: 'Read-only access to dashboards, reports, and basic information. No edit capabilities.',
    color: 'gray',
    permissions: [
      'dashboard.view',
      'inventory.view',
      'customers.view',
      'suppliers.view',
      'transactions.view',
      'reports.view', 'reports.sales',
      'settings.view',
    ],
    userCount: 2,
  },
];

// ============================================
// ACTIVITY LOG ENTRY TYPE
// ============================================
interface ActivityLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  ipAddress: string;
}

const INITIAL_ACTIVITY_LOG: ActivityLogEntry[] = [
  { id: 'log_001', timestamp: '2026-03-04T15:30:00Z', userId: 'usr_002', userName: 'Sarah Chen', action: 'Login', resource: 'Authentication', ipAddress: '192.168.1.10' },
  { id: 'log_002', timestamp: '2026-03-04T15:15:00Z', userId: 'usr_001', userName: 'Alex Thompson', action: 'Update', resource: 'User Profile', ipAddress: '192.168.1.22' },
  { id: 'log_003', timestamp: '2026-03-04T14:50:00Z', userId: 'usr_003', userName: 'Marcus Johnson', action: 'Create', resource: 'Purchase Order', ipAddress: '192.168.2.15' },
  { id: 'log_004', timestamp: '2026-03-04T14:30:00Z', userId: 'usr_009', userName: 'Robert Chang', action: 'Login', resource: 'Authentication', ipAddress: '192.168.1.18' },
  { id: 'log_005', timestamp: '2026-03-04T14:10:00Z', userId: 'usr_006', userName: 'Priya Patel', action: 'Refund', resource: 'Transaction #TXN-2026-0042', ipAddress: '192.168.3.8' },
  { id: 'log_006', timestamp: '2026-03-04T13:45:00Z', userId: 'usr_002', userName: 'Sarah Chen', action: 'Update', resource: 'Role: Cashier', ipAddress: '192.168.1.10' },
  { id: 'log_007', timestamp: '2026-03-04T13:20:00Z', userId: 'usr_004', userName: 'Emily Rodriguez', action: 'Create', resource: 'Sale #TXN-2026-0098', ipAddress: '192.168.1.30' },
  { id: 'log_008', timestamp: '2026-03-04T12:55:00Z', userId: 'usr_005', userName: 'David Kim', action: 'Create', resource: 'Sale #TXN-2026-0097', ipAddress: '192.168.3.12' },
  { id: 'log_009', timestamp: '2026-03-04T12:30:00Z', userId: 'usr_003', userName: 'Marcus Johnson', action: 'Update', resource: 'Inventory: Wireless Mouse', ipAddress: '192.168.2.15' },
  { id: 'log_010', timestamp: '2026-03-04T11:45:00Z', userId: 'usr_001', userName: 'Alex Thompson', action: 'Invite', resource: 'User: nina@techretail.com', ipAddress: '192.168.1.22' },
  { id: 'log_011', timestamp: '2026-03-04T11:00:00Z', userId: 'usr_006', userName: 'Priya Patel', action: 'Update', resource: 'Employee Schedule', ipAddress: '192.168.3.8' },
  { id: 'log_012', timestamp: '2026-03-04T10:30:00Z', userId: 'usr_009', userName: 'Robert Chang', action: 'Export', resource: 'Sales Report', ipAddress: '192.168.1.18' },
  { id: 'log_013', timestamp: '2026-03-04T10:00:00Z', userId: 'usr_002', userName: 'Sarah Chen', action: 'Update', resource: 'Business Settings', ipAddress: '192.168.1.10' },
  { id: 'log_014', timestamp: '2026-03-04T09:15:00Z', userId: 'usr_003', userName: 'Marcus Johnson', action: 'Login', resource: 'Authentication', ipAddress: '192.168.2.15' },
  { id: 'log_015', timestamp: '2026-03-04T09:00:00Z', userId: 'usr_004', userName: 'Emily Rodriguez', action: 'Login', resource: 'Authentication', ipAddress: '192.168.1.30' },
  { id: 'log_016', timestamp: '2026-03-04T08:45:00Z', userId: 'usr_005', userName: 'David Kim', action: 'Login', resource: 'Authentication', ipAddress: '192.168.3.12' },
  { id: 'log_017', timestamp: '2026-03-03T17:30:00Z', userId: 'usr_001', userName: 'Alex Thompson', action: 'Deactivate', resource: 'User: Lisa Martinez', ipAddress: '192.168.1.22' },
  { id: 'log_018', timestamp: '2026-03-03T16:00:00Z', userId: 'usr_006', userName: 'Priya Patel', action: 'Create', resource: 'Customer: VIP Group', ipAddress: '192.168.3.8' },
  { id: 'log_019', timestamp: '2026-03-03T14:20:00Z', userId: 'usr_009', userName: 'Robert Chang', action: 'Update', resource: 'Role: Manager', ipAddress: '192.168.1.18' },
  { id: 'log_020', timestamp: '2026-03-03T12:00:00Z', userId: 'usr_002', userName: 'Sarah Chen', action: 'Export', resource: 'Financial Report', ipAddress: '192.168.1.10' },
];

// ============================================
// DEFAULT FORM
// ============================================
const defaultInviteForm = {
  name: '', email: '', phone: '', role: 'cashier' as UserRole, branch: '', sendInviteEmail: true,
};

const defaultEditForm = {
  role: 'cashier' as UserRole, branch: '', mfaEnabled: false, isActive: true,
};

// ============================================
// HELPER: ACTION TYPE COLOR
// ============================================
const ACTION_COLORS: Record<string, string> = {
  Login: 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400',
  Logout: 'bg-gray-100 text-gray-800 dark:bg-gray-800/40 dark:text-gray-400',
  Create: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  Update: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  Delete: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  Refund: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  Export: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  Invite: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
  Deactivate: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400',
};

// ============================================
// USERS PAGE COMPONENT
// ============================================
export default function UsersPage() {
  // ============================================
  // STATE
  // ============================================
  const [users, setUsers] = useState<SystemUser[]>([...INITIAL_USERS]);
  const [roles, setRoles] = useState<RoleDefinition[]>(INITIAL_ROLES.map((r) => ({ ...r, permissions: [...r.permissions] })));
  const [activityLog] = useState<ActivityLogEntry[]>([...INITIAL_ACTIVITY_LOG]);

  // Tab 1: Users
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<SystemUser | null>(null);
  const [inviteForm, setInviteForm] = useState({ ...defaultInviteForm });
  const [editForm, setEditForm] = useState({ ...defaultEditForm });

  // Tab 2: Roles & Permissions
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [rolePermissionDrafts, setRolePermissionDrafts] = useState<Record<string, string[]>>({});
  const [isCreateRoleDialogOpen, setIsCreateRoleDialogOpen] = useState(false);
  const [newRoleForm, setNewRoleForm] = useState({ name: '', label: '', description: '', color: 'blue' as string });

  // Tab 3: Activity Log
  const [logUserFilter, setLogUserFilter] = useState('all');
  const [logActionFilter, setLogActionFilter] = useState('all');

  // ============================================
  // DERIVED DATA
  // ============================================
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch = search === '' ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchRole = roleFilter === 'all' || u.role === roleFilter;
      const matchStatus = statusFilter === 'all' ||
        (statusFilter === 'active' && u.isActive) ||
        (statusFilter === 'inactive' && !u.isActive);
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const actionTypes = useMemo(() => {
    const actions = new Set(activityLog.map((l) => l.action));
    return Array.from(actions).sort();
  }, [activityLog]);

  const filteredActivityLog = useMemo(() => {
    return activityLog.filter((l) => {
      const matchUser = logUserFilter === 'all' || l.userId === logUserFilter;
      const matchAction = logActionFilter === 'all' || l.action === logActionFilter;
      return matchUser && matchAction;
    });
  }, [activityLog, logUserFilter, logActionFilter]);

  const activeUserCount = useMemo(() => users.filter((u) => u.isActive).length, [users]);

  // ============================================
  // ROLE BADGE HELPER
  // ============================================
  const getRoleBadge = useCallback((role: UserRole) => {
    const cfg = ROLE_COLORS[role];
    return (
      <Badge variant="secondary" className={cn(cfg.bg, cfg.text, cfg.darkBg, cfg.darkText, 'font-medium')}>
        {ROLE_LABELS[role]}
      </Badge>
    );
  }, []);

  // ============================================
  // TAB 1: INVITE USER
  // ============================================
  const openInviteDialog = () => {
    setInviteForm({ ...defaultInviteForm });
    setIsInviteDialogOpen(true);
  };

  const handleInviteUser = () => {
    if (!inviteForm.name || !inviteForm.email) return;
    const branchObj = BRANCHES.find((b) => b.id === inviteForm.branch);
    const newUser: SystemUser = {
      id: `usr_${Date.now()}`,
      name: inviteForm.name,
      email: inviteForm.email,
      phone: inviteForm.phone || undefined,
      role: inviteForm.role,
      permissions: [],
      branchId: inviteForm.branch || 'br_001',
      branchName: branchObj?.name || 'Main Street Store',
      mfaEnabled: false,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, newUser]);
    setIsInviteDialogOpen(false);
  };

  // ============================================
  // TAB 1: EDIT USER
  // ============================================
  const openEditDialog = (user: SystemUser) => {
    setEditingUser(user);
    setEditForm({
      role: user.role,
      branch: user.branchId || '',
      mfaEnabled: user.mfaEnabled,
      isActive: user.isActive,
    });
    setIsEditDialogOpen(true);
  };

  const handleEditUser = () => {
    if (!editingUser) return;
    const branchObj = BRANCHES.find((b) => b.id === editForm.branch);
    setUsers((prev) =>
      prev.map((u) =>
        u.id === editingUser.id
          ? {
              ...u,
              role: editForm.role,
              branchId: editForm.branch || u.branchId,
              branchName: branchObj?.name || u.branchName,
              mfaEnabled: editForm.mfaEnabled,
              isActive: editForm.isActive,
            }
          : u
      )
    );
    setIsEditDialogOpen(false);
    setEditingUser(null);
  };

  // ============================================
  // TAB 1: DELETE / DEACTIVATE
  // ============================================
  const openDeleteDialog = (user: SystemUser) => {
    setDeletingUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteUser = () => {
    if (!deletingUser) return;
    if (deletingUser.isActive) {
      // Deactivate instead of delete
      setUsers((prev) =>
        prev.map((u) => (u.id === deletingUser.id ? { ...u, isActive: false } : u))
      );
    } else {
      // Permanently remove
      setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
    }
    setIsDeleteDialogOpen(false);
    setDeletingUser(null);
  };

  // ============================================
  // TAB 2: ROLE PERMISSIONS
  // ============================================
  const getRolePermissions = useCallback(
    (roleId: string) => {
      if (rolePermissionDrafts[roleId]) return rolePermissionDrafts[roleId];
      const role = roles.find((r) => r.id === roleId);
      return role?.permissions || [];
    },
    [roles, rolePermissionDrafts]
  );

  const togglePermission = useCallback(
    (roleId: string, permissionId: string) => {
      const current = getRolePermissions(roleId);
      const updated = current.includes(permissionId)
        ? current.filter((p) => p !== permissionId)
        : [...current, permissionId];
      setRolePermissionDrafts((prev) => ({ ...prev, [roleId]: updated }));
    },
    [getRolePermissions]
  );

  const toggleCategoryAll = useCallback(
    (roleId: string, category: PermissionCategory) => {
      const current = getRolePermissions(roleId);
      const categoryPerms = ALL_PERMISSIONS.filter((p) => p.category === category).map((p) => p.id);
      const allChecked = categoryPerms.every((p) => current.includes(p));
      let updated: string[];
      if (allChecked) {
        updated = current.filter((p) => !categoryPerms.includes(p));
      } else {
        updated = [...new Set([...current, ...categoryPerms])];
      }
      setRolePermissionDrafts((prev) => ({ ...prev, [roleId]: updated }));
    },
    [getRolePermissions]
  );

  const saveRolePermissions = useCallback(
    (roleId: string) => {
      const draft = rolePermissionDrafts[roleId];
      if (!draft) return;
      setRoles((prev) =>
        prev.map((r) => (r.id === roleId ? { ...r, permissions: [...draft] } : r))
      );
      setRolePermissionDrafts((prev) => {
        const copy = { ...prev };
        delete copy[roleId];
        return copy;
      });
    },
    [rolePermissionDrafts]
  );

  const hasUnsavedChanges = useCallback(
    (roleId: string) => {
      return roleId in rolePermissionDrafts;
    },
    [rolePermissionDrafts]
  );

  // Create Custom Role
  const handleCreateRole = () => {
    if (!newRoleForm.label) return;
    const newRole: RoleDefinition = {
      id: `role_${Date.now()}`,
      name: newRoleForm.name || newRoleForm.label.toLowerCase().replace(/\s+/g, '_'),
      label: newRoleForm.label,
      description: newRoleForm.description,
      color: newRoleForm.color,
      permissions: [],
      userCount: 0,
    };
    setRoles((prev) => [...prev, newRole]);
    setIsCreateRoleDialogOpen(false);
    setNewRoleForm({ name: '', label: '', description: '', color: 'blue' });
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
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Users &amp; Roles</h1>
            <p className="text-sm text-muted-foreground">Manage user accounts, roles, and permissions</p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 dark:bg-emerald-950/30">
              <Users className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-medium text-emerald-700 dark:text-emerald-400">{activeUserCount} Active</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-1 dark:bg-amber-950/30">
              <Shield className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              <span className="font-medium text-amber-700 dark:text-amber-400">{roles.length} Roles</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="users" className="flex flex-1 flex-col overflow-hidden">
        <div className="border-b px-4 sm:px-6">
          <TabsList className="h-10 w-full justify-start gap-0 bg-transparent p-0">
            <TabsTrigger
              value="users"
              className="relative h-10 rounded-none border-b-2 border-transparent px-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <Users className="mr-1.5 h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
              <Badge variant="secondary" className="ml-1.5 h-5 min-w-[20px] px-1 text-xs">{users.length}</Badge>
            </TabsTrigger>
            <TabsTrigger
              value="roles"
              className="relative h-10 rounded-none border-b-2 border-transparent px-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <Shield className="mr-1.5 h-4 w-4" />
              <span className="hidden sm:inline">Roles &amp; Permissions</span>
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="relative h-10 rounded-none border-b-2 border-transparent px-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <Activity className="mr-1.5 h-4 w-4" />
              <span className="hidden sm:inline">Activity Log</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ============================================ */}
        {/* TAB 1: USERS */}
        {/* ============================================ */}
        <TabsContent value="users" className="flex-1 overflow-auto p-4 sm:p-6">
          {/* Search / Filter Bar */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  className="pl-8"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {Object.entries(ROLE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={openInviteDialog} className="gap-1.5">
              <UserPlus className="h-4 w-4" /> Invite User
            </Button>
          </div>

          {/* Users Table */}
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">User</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden sm:table-cell">Branch</TableHead>
                  <TableHead className="hidden md:table-cell text-center">MFA</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden xl:table-cell">Last Login</TableHead>
                  <TableHead className="w-[50px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                      No users found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className={cn(
                              'text-xs',
                              ROLE_COLORS[user.role].bg,
                              ROLE_COLORS[user.role].text,
                              ROLE_COLORS[user.role].darkBg,
                              ROLE_COLORS[user.role].darkText
                            )}>
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="font-medium truncate">{user.name}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                        {user.email}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                        {user.phone || '—'}
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="h-3.5 w-3.5" />
                          <span className="truncate">{user.branchName || '—'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-center">
                        {user.mfaEnabled ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Lock className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mx-auto" />
                            </TooltipTrigger>
                            <TooltipContent>MFA Enabled</TooltipContent>
                          </Tooltip>
                        ) : (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Unlock className="h-4 w-4 text-muted-foreground mx-auto" />
                            </TooltipTrigger>
                            <TooltipContent>MFA Disabled</TooltipContent>
                          </Tooltip>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getStatusColor(user.isActive ? 'active' : 'cancelled')}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell text-muted-foreground text-xs">
                        {user.lastLoginAt ? formatDateTime(user.lastLoginAt) : 'Never'}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(user)}>
                              <Pencil className="mr-2 h-4 w-4" /> Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEditDialog(user)}>
                              <Key className="mr-2 h-4 w-4" /> Manage Access
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => openDeleteDialog(user)}
                            >
                              {user.isActive ? (
                                <>
                                  <UserX className="mr-2 h-4 w-4" /> Deactivate
                                </>
                              ) : (
                                <>
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete Permanently
                                </>
                              )}
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
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </TabsContent>

        {/* ============================================ */}
        {/* TAB 2: ROLES & PERMISSIONS */}
        {/* ============================================ */}
        <TabsContent value="roles" className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Roles &amp; Permissions</h2>
              <p className="text-sm text-muted-foreground">Define access levels for each role</p>
            </div>
            <Button onClick={() => setIsCreateRoleDialogOpen(true)} className="gap-1.5">
              <Plus className="h-4 w-4" /> Create Custom Role
            </Button>
          </div>

          {/* Role Cards Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
            {roles.map((role) => {
              const colorCfg = ROLE_COLORS[role.name as UserRole] || ROLE_COLORS.viewer;
              const isSelected = selectedRoleId === role.id;
              const permCount = getRolePermissions(role.id).length;
              const userCount = users.filter((u) => u.role === role.name).length;
              const unsaved = hasUnsavedChanges(role.id);

              return (
                <Card
                  key={role.id}
                  className={cn(
                    'cursor-pointer transition-all duration-200 hover:shadow-md',
                    isSelected && 'ring-2 ring-primary'
                  )}
                  onClick={() => setSelectedRoleId(isSelected ? null : role.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-lg',
                          colorCfg.bg, colorCfg.darkBg
                        )}>
                          <Shield className={cn('h-5 w-5', colorCfg.text, colorCfg.darkText)} />
                        </div>
                        <div>
                          <CardTitle className="text-base">{role.label}</CardTitle>
                          <Badge variant="secondary" className={cn(
                            'mt-0.5 text-[10px]', colorCfg.bg, colorCfg.text, colorCfg.darkBg, colorCfg.darkText
                          )}>
                            {role.name}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {unsaved && (
                          <Badge variant="outline" className="text-[10px] border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-400">
                            Unsaved
                          </Badge>
                        )}
                        {isSelected ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="mb-3 text-xs line-clamp-2">
                      {role.description}
                    </CardDescription>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        <span>{userCount} user{userCount !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>{permCount} permission{permCount !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Expanded Permissions Section */}
          {selectedRoleId && (
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {roles.find((r) => r.id === selectedRoleId)?.label} Permissions
                    </CardTitle>
                    <CardDescription>
                      Toggle individual permissions or select/deselect entire categories
                    </CardDescription>
                  </div>
                  {hasUnsavedChanges(selectedRoleId) && (
                    <Button onClick={() => saveRolePermissions(selectedRoleId)} className="gap-1.5">
                      <ShieldCheck className="h-4 w-4" /> Save Changes
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="max-h-[500px]">
                  <div className="space-y-4">
                    {PERMISSION_CATEGORIES.map((category) => {
                      const categoryPerms = ALL_PERMISSIONS.filter((p) => p.category === category.id);
                      const currentPerms = getRolePermissions(selectedRoleId);
                      const checkedCount = categoryPerms.filter((p) => currentPerms.includes(p.id)).length;
                      const allChecked = checkedCount === categoryPerms.length;
                      const noneChecked = checkedCount === 0;

                      return (
                        <div key={category.id} className="rounded-lg border p-4">
                          {/* Category Header */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-sm">{category.label}</h4>
                              <Badge variant="secondary" className="text-xs">
                                {checkedCount}/{categoryPerms.length}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => toggleCategoryAll(selectedRoleId, category.id)}
                              >
                                {allChecked ? 'Deselect All' : 'Select All'}
                              </Button>
                            </div>
                          </div>

                          {/* Permission Checkboxes */}
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                            {categoryPerms.map((perm) => {
                              const isChecked = currentPerms.includes(perm.id);
                              return (
                                <label
                                  key={perm.id}
                                  className={cn(
                                    'flex items-center gap-2 rounded-md border p-2.5 cursor-pointer transition-colors',
                                    isChecked
                                      ? 'border-primary/30 bg-primary/5 dark:bg-primary/10'
                                      : 'border-border hover:bg-muted/50'
                                  )}
                                >
                                  <Checkbox
                                    checked={isChecked}
                                    onCheckedChange={() => togglePermission(selectedRoleId, perm.id)}
                                  />
                                  <div className="min-w-0">
                                    <div className="text-sm font-medium truncate">{perm.label}</div>
                                    <div className="text-xs text-muted-foreground truncate">{perm.description}</div>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ============================================ */}
        {/* TAB 3: ACTIVITY LOG */}
        {/* ============================================ */}
        <TabsContent value="activity" className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Activity Log</h2>
              <p className="text-sm text-muted-foreground">Track user actions and system events</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Select value={logUserFilter} onValueChange={setLogUserFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="All Users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={logActionFilter} onValueChange={setLogActionFilter}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="All Actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  {actionTypes.map((a) => (
                    <SelectItem key={a} value={a}>{a}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead className="hidden md:table-cell">Resource</TableHead>
                  <TableHead className="hidden lg:table-cell">IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivityLog.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No activity log entries found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredActivityLog.map((entry) => (
                    <TableRow key={entry.id} className="hover:bg-muted/50">
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {formatDateTime(entry.timestamp)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                              {getInitials(entry.userName)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-sm">{entry.userName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={cn(ACTION_COLORS[entry.action] || ACTION_COLORS.Update)}>
                          {entry.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {entry.resource}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-xs text-muted-foreground font-mono">
                        <div className="flex items-center gap-1.5">
                          <MonitorSmartphone className="h-3.5 w-3.5" />
                          {entry.ipAddress}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-3 text-xs text-muted-foreground">
            Showing {filteredActivityLog.length} of {activityLog.length} entries
          </div>
        </TabsContent>
      </Tabs>

      {/* ============================================ */}
      {/* INVITE USER DIALOG */}
      {/* ============================================ */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" /> Invite User
            </DialogTitle>
            <DialogDescription>
              Send an invitation to a new team member
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="invite-name">Full Name</Label>
              <Input
                id="invite-name"
                value={inviteForm.name}
                onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                placeholder="Enter full name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invite-email">Email</Label>
                <Input
                  id="invite-email"
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  placeholder="user@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invite-phone">Phone</Label>
                <Input
                  id="invite-phone"
                  value={inviteForm.phone}
                  onChange={(e) => setInviteForm({ ...inviteForm, phone: e.target.value })}
                  placeholder="+1-555-0000"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invite-role">Role</Label>
                <Select
                  value={inviteForm.role}
                  onValueChange={(v) => setInviteForm({ ...inviteForm, role: v as UserRole })}
                >
                  <SelectTrigger id="invite-role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ROLE_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="invite-branch">Branch</Label>
                <Select
                  value={inviteForm.branch}
                  onValueChange={(v) => setInviteForm({ ...inviteForm, branch: v })}
                >
                  <SelectTrigger id="invite-branch">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {BRANCHES.map((b) => (
                      <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="invite-send-email" className="text-sm font-medium">Send invitation email</Label>
                <p className="text-xs text-muted-foreground">User will receive a setup link via email</p>
              </div>
              <Switch
                id="invite-send-email"
                checked={inviteForm.sendInviteEmail}
                onCheckedChange={(v) => setInviteForm({ ...inviteForm, sendInviteEmail: v })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleInviteUser}
              disabled={!inviteForm.name || !inviteForm.email}
              className="gap-1.5"
            >
              <Send className="h-4 w-4" /> Send Invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ============================================ */}
      {/* EDIT USER DIALOG */}
      {/* ============================================ */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5" /> Edit User
            </DialogTitle>
            <DialogDescription>
              Update access and settings for {editingUser?.name}
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <div className="grid gap-4 py-4">
              {/* User Info Summary */}
              <div className="flex items-center gap-3 rounded-lg border p-3 bg-muted/30">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className={cn(
                    'text-sm',
                    ROLE_COLORS[editingUser.role].bg,
                    ROLE_COLORS[editingUser.role].text,
                    ROLE_COLORS[editingUser.role].darkBg,
                    ROLE_COLORS[editingUser.role].darkText
                  )}>
                    {getInitials(editingUser.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{editingUser.name}</p>
                  <p className="text-xs text-muted-foreground">{editingUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-role">Role</Label>
                  <Select
                    value={editForm.role}
                    onValueChange={(v) => setEditForm({ ...editForm, role: v as UserRole })}
                  >
                    <SelectTrigger id="edit-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ROLE_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-branch">Branch</Label>
                  <Select
                    value={editForm.branch}
                    onValueChange={(v) => setEditForm({ ...editForm, branch: v })}
                  >
                    <SelectTrigger id="edit-branch">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BRANCHES.map((b) => (
                        <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="edit-mfa" className="text-sm font-medium flex items-center gap-1.5">
                    <Lock className="h-4 w-4" /> MFA Enabled
                  </Label>
                  <p className="text-xs text-muted-foreground">Require multi-factor authentication on login</p>
                </div>
                <Switch
                  id="edit-mfa"
                  checked={editForm.mfaEnabled}
                  onCheckedChange={(v) => setEditForm({ ...editForm, mfaEnabled: v })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="edit-active" className="text-sm font-medium flex items-center gap-1.5">
                    <Eye className="h-4 w-4" /> Active Status
                  </Label>
                  <p className="text-xs text-muted-foreground">Deactivated users cannot log in</p>
                </div>
                <Switch
                  id="edit-active"
                  checked={editForm.isActive}
                  onCheckedChange={(v) => setEditForm({ ...editForm, isActive: v })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditUser} className="gap-1.5">
              <ShieldCheck className="h-4 w-4" /> Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ============================================ */}
      {/* DELETE / DEACTIVATE CONFIRMATION */}
      {/* ============================================ */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              {deletingUser?.isActive ? 'Deactivate User' : 'Delete User Permanently'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deletingUser?.isActive ? (
                <>
                  Are you sure you want to deactivate <strong>{deletingUser?.name}</strong>?
                  They will lose access to the system immediately. You can reactivate them later.
                </>
              ) : (
                <>
                  Are you sure you want to permanently delete <strong>{deletingUser?.name}</strong>?
                  This action cannot be undone and all associated data will be removed.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingUser(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deletingUser?.isActive ? 'Deactivate' : 'Delete Permanently'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ============================================ */}
      {/* CREATE CUSTOM ROLE DIALOG */}
      {/* ============================================ */}
      <Dialog open={isCreateRoleDialogOpen} onOpenChange={setIsCreateRoleDialogOpen}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" /> Create Custom Role
            </DialogTitle>
            <DialogDescription>
              Define a new role with a custom set of permissions
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-role-label">Role Name</Label>
              <Input
                id="new-role-label"
                value={newRoleForm.label}
                onChange={(e) => setNewRoleForm({ ...newRoleForm, label: e.target.value })}
                placeholder="e.g. Shift Supervisor"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-role-name">Role Identifier</Label>
              <Input
                id="new-role-name"
                value={newRoleForm.name}
                onChange={(e) => setNewRoleForm({ ...newRoleForm, name: e.target.value })}
                placeholder="Auto-generated from name"
              />
              <p className="text-xs text-muted-foreground">Lowercase, underscores. Leave blank to auto-generate.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-role-desc">Description</Label>
              <Input
                id="new-role-desc"
                value={newRoleForm.description}
                onChange={(e) => setNewRoleForm({ ...newRoleForm, description: e.target.value })}
                placeholder="Brief description of this role"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-role-color">Color</Label>
              <Select
                value={newRoleForm.color}
                onValueChange={(v) => setNewRoleForm({ ...newRoleForm, color: v })}
              >
                <SelectTrigger id="new-role-color">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="red">Red</SelectItem>
                  <SelectItem value="amber">Amber</SelectItem>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="emerald">Emerald</SelectItem>
                  <SelectItem value="gray">Gray</SelectItem>
                  <SelectItem value="violet">Violet</SelectItem>
                  <SelectItem value="sky">Sky</SelectItem>
                  <SelectItem value="rose">Rose</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateRoleDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateRole} disabled={!newRoleForm.label} className="gap-1.5">
              <Shield className="h-4 w-4" /> Create Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
