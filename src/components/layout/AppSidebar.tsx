'use client';

import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Tag,
  Users,
  Truck,
  UserCog,
  Receipt,
  BarChart3,
  Settings,
  Cloud,
  ChevronsLeft,
  ChevronsRight,
  LogOut,
} from 'lucide-react';
import { useNavStore, useAuthStore } from '@/store';
import { cn, getInitials } from '@/lib/helpers';
import type { AppPage } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface NavItem {
  id: AppPage;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'pos', label: 'POS Terminal', icon: ShoppingCart },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'products', label: 'Products', icon: Tag },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'suppliers', label: 'Suppliers', icon: Truck },
  { id: 'employees', label: 'Employees', icon: UserCog },
  { id: 'transactions', label: 'Transactions', icon: Receipt },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function AppSidebar() {
  const { currentPage, setPage, sidebarCollapsed, toggleCollapsed, sidebarOpen } = useNavStore();
  const { user, logout } = useAuthStore();

  const userInitials = user?.name ? getInitials(user.name) : 'U';

  const roleLabel = (() => {
    if (!user?.role) return '';
    const map: Record<string, string> = {
      super_admin: 'Super Admin',
      admin: 'Administrator',
      manager: 'Manager',
      cashier: 'Cashier',
      viewer: 'Viewer',
    };
    return map[user.role] || user.role;
  })();

  return (
    <aside
      className={cn(
        'relative flex h-full flex-col border-r border-border bg-card transition-all duration-300 ease-in-out',
        sidebarCollapsed ? 'w-[68px]' : 'w-64',
        !sidebarOpen && 'hidden lg:flex'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex h-16 shrink-0 items-center border-b border-border px-4',
        sidebarCollapsed ? 'justify-center' : 'gap-3'
      )}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Cloud className="h-5 w-5" />
        </div>
        {!sidebarCollapsed && (
          <div className="flex flex-col overflow-hidden">
            <span className="text-lg font-bold tracking-tight text-foreground">CloudPOS</span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Enterprise</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-3">
        <nav className="flex flex-col gap-1 px-3" role="navigation" aria-label="Main navigation">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            const Icon = item.icon;

            const linkContent = (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={cn(
                  'group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  isActive
                    ? 'bg-primary/10 text-primary dark:bg-primary/20'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  sidebarCollapsed && 'justify-center px-0'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 shrink-0 transition-colors',
                    isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-accent-foreground'
                  )}
                />
                {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                {isActive && !sidebarCollapsed && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </button>
            );

            if (sidebarCollapsed) {
              return (
                <Tooltip key={item.id} delayDuration={0}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right" sideOffset={8}>
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return linkContent;
          })}
        </nav>
      </ScrollArea>

      {/* Bottom section */}
      <div className="shrink-0 border-t border-border">
        {/* Collapse toggle */}
        <div className={cn('flex px-3 py-2', sidebarCollapsed ? 'justify-center' : 'justify-end')}>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={toggleCollapsed}
                aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {sidebarCollapsed ? (
                  <ChevronsRight className="h-4 w-4" />
                ) : (
                  <ChevronsLeft className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={8}>
              {sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            </TooltipContent>
          </Tooltip>
        </div>

        <Separator />

        {/* User info */}
        <div className={cn('flex items-center gap-3 p-3', sidebarCollapsed && 'justify-center px-0')}>
          <Avatar className="h-9 w-9 shrink-0 border-2 border-primary/20">
            {user?.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
            <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          {!sidebarCollapsed && (
            <div className="flex flex-1 items-center justify-between overflow-hidden">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{user?.name || 'User'}</p>
                <p className="truncate text-xs text-muted-foreground">{roleLabel}</p>
              </div>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={logout}
                    aria-label="Sign out"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}>
                  Sign out
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
