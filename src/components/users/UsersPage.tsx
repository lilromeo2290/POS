'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Shield, Search, Plus, MoreHorizontal, Pencil, Trash2, UserPlus,
  ShieldCheck, Lock, Unlock, Mail, Phone, Building2, Clock,
  ChevronDown, ChevronUp, CheckSquare, Square, Activity,
  Users, Eye, UserX, Key, AlertTriangle, Send, MonitorSmartphone,
  LayoutDashboard, ShoppingCart, Package, Truck, UserCog,
  Receipt, BarChart3, Settings,
} from 'lucide-react';
import { cn, formatDateTime, getInitials, getStatusColor } from '@/lib/helpers';
import type { SystemUser, UserRole, RoleDefinition, PermissionCategory } from '@/types';
import { PERMISSION_CATEGORIES, ALL_PERMISSIONS } from '@/types';
import { useUserStore } from '@/store/userStore';

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
// DASHBOARD SECTIONS
// ============================================
const DASHBOARD_SECTIONS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30', border: 'border-emerald-300 dark:border-emerald-700', permissions: ['dashboard.view', 'dashboard.analytics'] },
  { id: 'pos', label: 'POS Terminal', icon: ShoppingCart, color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-100 dark:bg-sky-900/30', border: 'border-sky-300 dark:border-sky-700', permissions: ['pos.access', 'pos.refund', 'pos.discount', 'pos.hold'] },
  { id: 'inventory', label: 'Inventory & Products', icon: Package, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-100 dark:bg-violet-900/30', border: 'border-violet-300 dark:border-violet-700', permissions: ['inventory.view', 'inventory.create', 'inventory.edit', 'inventory.delete', 'inventory.transfer', 'inventory.adjust'] },
  { id: 'customers', label: 'Customers', icon: Users, color: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-100 dark:bg-pink-900/30', border: 'border-pink-300 dark:border-pink-700', permissions: ['customers.view', 'customers.create', 'customers.edit', 'customers.delete', 'customers.credit'] },
  { id: 'suppliers', label: 'Suppliers', icon: Truck, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30', border: 'border-orange-300 dark:border-orange-700', permissions: ['suppliers.view', 'suppliers.create', 'suppliers.edit', 'suppliers.purchase_orders'] },
  { id: 'employees', label: 'Employees', icon: UserCog, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-100 dark:bg-cyan-900/30', border: 'border-cyan-300 dark:border-cyan-700', permissions: ['employees.view', 'employees.create', 'employees.edit', 'employees.schedule', 'employees.salary'] },
  { id: 'users', label: 'Users & Roles', icon: Shield, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', border: 'border-red-300 dark:border-red-700', permissions: ['users.view', 'users.create', 'users.edit', 'users.delete', 'users.roles'] },
  { id: 'transactions', label: 'Transactions', icon: Receipt, color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-100 dark:bg-teal-900/30', border: 'border-teal-300 dark:border-teal-700', permissions: ['transactions.view', 'transactions.refund', 'transactions.export'] },
  { id: 'reports', label: 'Reports', icon: BarChart3, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30', border: 'border-amber-300 dark:border-amber-700', permissions: ['reports.view', 'reports.sales', 'reports.financial', 'reports.export'] },
  { id: 'settings', label: 'Settings', icon: Settings, color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-800/40', border: 'border-gray-300 dark:border-gray-600', permissions: ['settings.view', 'settings.edit', 'settings.billing', 'settings.integrations'] },
];

// ============================================
// ROLE DEFAULT SECTIONS
// ============================================
const ROLE_DEFAULT_SECTIONS: Record<UserRole, string[]> = {
  super_admin: DASHBOARD_SECTIONS.map(s => s.id),
  admin: DASHBOARD_SECTIONS.map(s => s.id),
  manager: ['dashboard', 'pos', 'inventory', 'customers', 'suppliers', 'employees', 'transactions', 'reports', 'settings'],
  cashier: ['dashboard', 'pos', 'inventory', 'customers', 'transactions', 'reports'],
  viewer: ['dashboard', 'inventory', 'customers', 'suppliers', 'transactions', 'reports', 'settings'],
};

// ============================================
// HELPER: SECTIONS ↔ PERMISSIONS
// ============================================
function sectionsToPermissions(sectionIds: string[]): string[] {
  return sectionIds.flatMap(id => {
    const section = DASHBOARD_SECTIONS.find(s => s.id === id);
    return section ? section.permissions : [];
  });
}

function permissionsToSections(permissions: string[]): string[] {
  return DASHBOARD_SECTIONS.filter(section =>
    section.permissions.some(p => permissions.includes(p))
  ).map(s => s.id);
}

// ============================================
// BRANCH DATA
// ============================================
const BRANCHES = [
  { id: 'br_001', name: 'Main Branch' },
];

// ============================================
// MOCK ROLES
// ============================================
const INITIAL_ROLES: RoleDefinition[] = [
  {
    id: 'role_sa', name: 'super_admin', label: 'Super Admin',
    description: 'Full system access with all permissions. Can manage all settings, billing, and integrations.',
    color: 'red', permissions: ALL_PERMISSIONS.map((p) => p.id), userCount: 0,
  },
  {
    id: 'role_admin', name: 'admin', label: 'Administrator',
    description: 'Administrative access with most permissions except billing and integration management.',
    color: 'amber',
    permissions: ALL_PERMISSIONS.filter((p) => !['settings.billing', 'settings.integrations'].includes(p.id)).map((p) => p.id),
    userCount: 1,
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
    userCount: 0,
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
    userCount: 0,
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
    userCount: 0,
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

const INITIAL_ACTIVITY_LOG: ActivityLogEntry[] = [];

// ============================================
// DEFAULT FORM
// ============================================
const defaultInviteForm = {
  name: '', email: '', phone: '', password: 'password123', role: 'cashier' as UserRole, branch: '', sendInviteEmail: true,
  sections: [...ROLE_DEFAULT_SECTIONS.cashier],
};

const defaultEditForm = {
  role: 'cashier' as UserRole, branch: '', mfaEnabled: false, isActive: true,
  sections: [] as string[],
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
// DASHBOARD ACCESS SECTION COMPONENT
// ============================================
function DashboardAccessGrid({
  sections: selectedSections,
  onSectionsChange,
  disabled,
  role,
}: {
  sections: string[];
  onSectionsChange: (sections: string[]) => void;
  disabled?: boolean;
  role: UserRole;
}) {
  const isAdminRole = role === 'admin' || role === 'super_admin';
  const allSelected = DASHBOARD_SECTIONS.length === selectedSections.length;
  const noneSelected = selectedSections.length === 0;

  const toggleSection = (sectionId: string) => {
    if (isAdminRole || disabled) return;
    const updated = selectedSections.includes(sectionId)
      ? selectedSections.filter(s => s !== sectionId)
      : [...selectedSections, sectionId];
    onSectionsChange(updated);
  };

  const toggleAll = () => {
    if (isAdminRole || disabled) return;
    if (allSelected) {
      onSectionsChange([]);
    } else {
      onSectionsChange(DASHBOARD_SECTIONS.map(s => s.id));
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-semibold">Dashboard Access</Label>
          <p className="text-xs text-muted-foreground">Assign which parts of the system this user can access</p>
        </div>
        {!isAdminRole && (
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={toggleAll}
            disabled={disabled}
          >
            {allSelected ? 'Deselect All' : 'Select All'}
          </Button>
        )}
      </div>

      {isAdminRole && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 dark:border-amber-700 dark:bg-amber-950/30">
          <Lock className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
            {role === 'super_admin' ? 'Super Admin' : 'Admin'} has full access to all sections
          </span>
        </div>
      )}

      <div className={cn(
        'grid grid-cols-2 gap-2',
        isAdminRole && 'opacity-60 pointer-events-none'
      )}>
        {DASHBOARD_SECTIONS.map((section) => {
          const isChecked = isAdminRole || selectedSections.includes(section.id);
          const Icon = section.icon;

          return (
            <label
              key={section.id}
              className={cn(
                'flex items-center gap-2.5 rounded-lg border p-2.5 cursor-pointer transition-all duration-150',
                isChecked
                  ? cn(section.border, section.bg, 'shadow-sm')
                  : 'border-border bg-background hover:bg-muted/50',
                !isChecked && 'opacity-50'
              )}
            >
              <Checkbox
                checked={isChecked}
                onCheckedChange={() => toggleSection(section.id)}
                disabled={isAdminRole || disabled}
                className="shrink-0"
              />
              <div className={cn(
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-md',
                isChecked ? section.bg : 'bg-muted'
              )}>
                <Icon className={cn('h-3.5 w-3.5', isChecked ? section.color : 'text-muted-foreground')} />
              </div>
              <span className={cn(
                'text-xs font-medium truncate',
                isChecked ? 'text-foreground' : 'text-muted-foreground'
              )}>
                {section.label}
              </span>
            </label>
          );
        })}
      </div>

      {!isAdminRole && (
        <p className="text-xs text-muted-foreground">
          {selectedSections.length} of {DASHBOARD_SECTIONS.length} sections selected
        </p>
      )}
    </div>
  );
}

// ============================================
// USERS PAGE COMPONENT
// ============================================
export default function UsersPage() {
  // ============================================
  // STATE
  // ============================================
  const { users: storeUsers, addUser: storeAddUser, updateUser: storeUpdateUser, removeUser: storeRemoveUser } = useUserStore();
  const [localUsers, setLocalUsers] = useState<SystemUser[]>([]);

  // Sync with store on mount and when store changes
  useEffect(() => {
    setLocalUsers([...storeUsers]);
  }, [storeUsers]);

  const users = localUsers;

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
    setInviteForm({ ...defaultInviteForm, sections: [...ROLE_DEFAULT_SECTIONS.cashier] });
    setIsInviteDialogOpen(true);
  };

  const handleInviteUser = () => {
    if (!inviteForm.name || !inviteForm.email) return;
    const branchObj = BRANCHES.find((b) => b.id === inviteForm.branch);
    const permissions = sectionsToPermissions(inviteForm.sections);
    const newUser: SystemUser = {
      id: `usr_${Date.now()}`,
      name: inviteForm.name,
      email: inviteForm.email,
      phone: inviteForm.phone || undefined,
      role: inviteForm.role,
      permissions,
      branchId: inviteForm.branch || 'br_001',
      branchName: branchObj?.name || 'Main Branch',
      mfaEnabled: false,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    // Add to shared store (with password for login)
    storeAddUser(newUser, inviteForm.password || 'password123');
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
      sections: permissionsToSections(user.permissions),
    });
    setIsEditDialogOpen(true);
  };

  const handleEditUser = () => {
    if (!editingUser) return;
    const branchObj = BRANCHES.find((b) => b.id === editForm.branch);
    const permissions = sectionsToPermissions(editForm.sections);
    const updates: Partial<SystemUser> = {
      role: editForm.role,
      branchId: editForm.branch || editingUser.branchId,
      branchName: branchObj?.name || editingUser.branchName,
      mfaEnabled: editForm.mfaEnabled,
      isActive: editForm.isActive,
      permissions,
    };
    // Update in shared store
    storeUpdateUser(editingUser.id, updates);
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
      storeUpdateUser(deletingUser.id, { isActive: false });
    } else {
      // Permanently delete from shared store
      storeRemoveUser(deletingUser.id);
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
  // HELPER: Get user section count for table display
  // ============================================
  const getUserSectionInfo = useCallback((user: SystemUser) => {
    const userSections = permissionsToSections(user.permissions);
    const isAdmin = user.role === 'admin' || user.role === 'super_admin';
    if (isAdmin) {
      return { count: DASHBOARD_SECTIONS.length, sections: DASHBOARD_SECTIONS.map(s => s.label), isAdmin: true };
    }
    return {
      count: userSections.length,
      sections: userSections.map(id => DASHBOARD_SECTIONS.find(s => s.id === id)?.label || id),
      isAdmin: false,
    };
  }, []);

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
                  <TableHead className="hidden lg:table-cell">Dashboard Access</TableHead>
                  <TableHead className="hidden md:table-cell text-center">MFA</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden xl:table-cell">Last Login</TableHead>
                  <TableHead className="w-[50px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
                      No users found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => {
                    const sectionInfo = getUserSectionInfo(user);
                    return (
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
                        <TableCell className="hidden lg:table-cell">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge
                                variant="secondary"
                                className={cn(
                                  'cursor-default text-xs gap-1',
                                  sectionInfo.isAdmin
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800/40 dark:text-slate-300'
                                )}
                              >
                                {sectionInfo.isAdmin && <Lock className="h-3 w-3" />}
                                {sectionInfo.count} section{sectionInfo.count !== 1 ? 's' : ''}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="max-w-[220px]">
                              <p className="font-semibold mb-1">Dashboard Access</p>
                              <div className="space-y-0.5">
                                {sectionInfo.sections.map((s, i) => (
                                  <div key={i} className="text-xs">{s}</div>
                                ))}
                              </div>
                            </TooltipContent>
                          </Tooltip>
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
                    );
                  })
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
        <DialogContent className="sm:max-w-[580px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" /> Invite User
            </DialogTitle>
            <DialogDescription>
              Send an invitation to a new team member
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(90vh-140px)]">
            <div className="grid gap-4 py-4 pr-4">
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
              <div className="space-y-2">
                <Label htmlFor="invite-password">Login Password</Label>
                <Input
                  id="invite-password"
                  type="text"
                  value={inviteForm.password}
                  onChange={(e) => setInviteForm({ ...inviteForm, password: e.target.value })}
                  placeholder="Set login password"
                />
                <p className="text-[10px] text-muted-foreground">This password will be used to sign in. Default: password123</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invite-role">Role</Label>
                  <Select
                    value={inviteForm.role}
                    onValueChange={(v) => {
                      const newRole = v as UserRole;
                      setInviteForm({
                        ...inviteForm,
                        role: newRole,
                        sections: [...ROLE_DEFAULT_SECTIONS[newRole]],
                      });
                    }}
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

              {/* Dashboard Access Section */}
              <DashboardAccessGrid
                sections={inviteForm.sections}
                onSectionsChange={(sections) => setInviteForm({ ...inviteForm, sections })}
                role={inviteForm.role}
              />

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
          </ScrollArea>
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
        <DialogContent className="sm:max-w-[580px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5" /> Edit User
            </DialogTitle>
            <DialogDescription>
              Update access and settings for {editingUser?.name}
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <ScrollArea className="max-h-[calc(90vh-140px)]">
              <div className="grid gap-4 py-4 pr-4">
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
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{editingUser.name}</p>
                    <p className="text-xs text-muted-foreground">{editingUser.email}</p>
                  </div>
                  {getRoleBadge(editingUser.role)}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-role">Role</Label>
                    <Select
                      value={editForm.role}
                      onValueChange={(v) => {
                        const newRole = v as UserRole;
                        const isAdminRole = newRole === 'admin' || newRole === 'super_admin';
                        setEditForm({
                          ...editForm,
                          role: newRole,
                          sections: isAdminRole
                            ? DASHBOARD_SECTIONS.map(s => s.id)
                            : [...ROLE_DEFAULT_SECTIONS[newRole]],
                        });
                      }}
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

                {/* Dashboard Access Section */}
                <DashboardAccessGrid
                  sections={editForm.sections}
                  onSectionsChange={(sections) => setEditForm({ ...editForm, sections })}
                  role={editForm.role}
                />

                {/* Section Access Summary */}
                <div className="rounded-lg border bg-muted/20 p-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Access Summary</p>
                  <div className="flex flex-wrap gap-1.5">
                    {editForm.sections.map((sectionId) => {
                      const section = DASHBOARD_SECTIONS.find(s => s.id === sectionId);
                      if (!section) return null;
                      const Icon = section.icon;
                      return (
                        <Badge
                          key={sectionId}
                          variant="secondary"
                          className={cn('text-[10px] gap-1', section.bg, section.color)}
                        >
                          <Icon className="h-2.5 w-2.5" />
                          {section.label}
                        </Badge>
                      );
                    })}
                    {editForm.sections.length === 0 && (
                      <span className="text-xs text-muted-foreground">No sections selected</span>
                    )}
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
            </ScrollArea>
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
