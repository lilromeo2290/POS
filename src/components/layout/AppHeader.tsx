'use client';

import { useState } from 'react';
import {
  Menu,
  Bell,
  Sun,
  Moon,
  User,
  Settings,
  LogOut,
  Building2,
  Package,
  ShoppingCart,
  CreditCard,
  AlertTriangle,
  Info,
  CheckCheck,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useNavStore, useAuthStore, useNotificationStore, useBusinessStore } from '@/store';
import { cn, getInitials, formatDateTime } from '@/lib/helpers';
import type { AppPage } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const pageTitles: Record<AppPage, string> = {
  dashboard: 'Dashboard',
  pos: 'POS Terminal',
  inventory: 'Inventory',
  products: 'Products',
  customers: 'Customers',
  suppliers: 'Suppliers',
  employees: 'Employees',
  transactions: 'Transactions',
  reports: 'Reports',
  users: 'Users & Roles',
  settings: 'Settings',
  subscription: 'Subscription',
};

function getNotificationIcon(type: string) {
  switch (type) {
    case 'low_stock':
      return <Package className="h-4 w-4 text-amber-500" />;
    case 'new_order':
      return <ShoppingCart className="h-4 w-4 text-emerald-500" />;
    case 'subscription':
      return <CreditCard className="h-4 w-4 text-violet-500" />;
    case 'payment':
      return <CreditCard className="h-4 w-4 text-sky-500" />;
    case 'system':
      return <Info className="h-4 w-4 text-muted-foreground" />;
    default:
      return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
  }
}

export default function AppHeader() {
  const { currentPage, toggleSidebar } = useNavStore();
  const { user, logout } = useAuthStore();
  const { notifications, markRead, markAllRead } = useNotificationStore();
  const { business, currentBranchId, setCurrentBranch } = useBusinessStore();
  const { theme, setTheme } = useTheme();
  const [notifOpen, setNotifOpen] = useState(false);

  const pageTitle = pageTitles[currentPage] || 'Dashboard';
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const activeBranches = business.branches.filter((b) => b.isActive);
  const userInitials = user?.name ? getInitials(user.name) : 'U';

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-border bg-card/80 px-4 backdrop-blur-md sm:px-6">
      {/* Mobile sidebar toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Page title */}
      <h1 className="text-lg font-semibold text-foreground sm:text-xl">{pageTitle}</h1>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Branch selector */}
      <div className="hidden sm:block">
        <Select value={currentBranchId} onValueChange={setCurrentBranch}>
          <SelectTrigger className="h-9 w-[200px] gap-2 text-sm" size="sm">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Select branch" />
          </SelectTrigger>
          <SelectContent>
            {activeBranches.map((branch) => (
              <SelectItem key={branch.id} value={branch.id}>
                <span className="flex items-center gap-2">
                  {branch.isHeadOffice && (
                    <Badge variant="secondary" className="h-4 px-1 text-[10px]">
                      HQ
                    </Badge>
                  )}
                  {branch.name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Notifications */}
      <Popover open={notifOpen} onOpenChange={setNotifOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end" sideOffset={8}>
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h3 className="text-sm font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                onClick={markAllRead}
              >
                <CheckCheck className="mr-1 h-3 w-3" />
                Mark all read
              </Button>
            )}
          </div>
          <ScrollArea className="max-h-80">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Bell className="mb-2 h-8 w-8 opacity-50" />
                <p className="text-sm">No notifications</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {notifications.map((notif) => (
                  <button
                    key={notif.id}
                    className={cn(
                      'flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-accent',
                      !notif.isRead && 'bg-primary/5'
                    )}
                    onClick={() => markRead(notif.id)}
                  >
                    <div className="mt-0.5 shrink-0">{getNotificationIcon(notif.type)}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className={cn('truncate text-sm', !notif.isRead && 'font-semibold')}>
                          {notif.title}
                        </p>
                        {!notif.isRead && (
                          <div className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                        {notif.message}
                      </p>
                      <p className="mt-1 text-[10px] text-muted-foreground/70">
                        {formatDateTime(notif.createdAt)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>

      {/* Theme toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        aria-label="Toggle theme"
      >
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>

      {/* User menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full" aria-label="User menu">
            <Avatar className="h-9 w-9 border-2 border-primary/20">
              {user?.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
              <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-semibold leading-none">{user?.name || 'User'}</p>
              <p className="text-xs leading-none text-muted-foreground">{user?.email || ''}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => useNavStore.getState().setPage('settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
