'use client';

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  ShoppingCart,
  UserPlus,
  BarChart3,
  CreditCard,
  Banknote,
  Smartphone,
  AlertTriangle,
  Clock,
  Shield,
  Eye,
  UserCog,
  LayoutDashboard,
  Star,
  CheckCircle2,
  Timer,
  Wallet,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  mockDashboardMetrics,
  revenueChartData,
  salesByCategoryData,
  weeklySalesData,
  topProductsData,
  branchPerformanceData,
  mockProducts,
  mockTransactions,
} from '@/data/mockData';
import { formatCurrency, formatNumber, formatDateTime, cn, getInitials } from '@/lib/helpers';
import { useNavStore, useAuthStore } from '@/store';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// ============================================
// CHART COLORS
// ============================================
const CHART_COLORS = [
  '#10b981',
  '#3b82f6',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
  '#ec4899',
  '#f97316',
];

// ============================================
// CUSTOM TOOLTIP COMPONENTS
// ============================================
function RevenueTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string; color: string }>; label?: string }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-lg border bg-background px-3 py-2 shadow-md">
      <p className="mb-1 text-xs font-medium text-muted-foreground">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-semibold" style={{ color: entry.color }}>
          {entry.dataKey === 'revenue' ? 'Revenue' : entry.dataKey === 'profit' ? 'Profit' : entry.dataKey}:{' '}
          {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  );
}

function WeeklyTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string; color: string }>; label?: string }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-lg border bg-background px-3 py-2 shadow-md">
      <p className="mb-1 text-xs font-medium text-muted-foreground">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-semibold" style={{ color: entry.color }}>
          {entry.dataKey === 'revenue' ? 'Revenue' : 'Orders'}: {entry.dataKey === 'revenue' ? formatCurrency(entry.value) : entry.value}
        </p>
      ))}
    </div>
  );
}

function PieTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { fill: string } }> }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-lg border bg-background px-3 py-2 shadow-md">
      <p className="text-sm font-semibold" style={{ color: payload[0].payload.fill }}>
        {payload[0].name}
      </p>
      <p className="text-sm text-muted-foreground">{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

// ============================================
// PAYMENT METHOD ICON HELPER
// ============================================
function PaymentIcon({ method }: { method: string }) {
  switch (method) {
    case 'card':
      return <CreditCard className="h-3.5 w-3.5" />;
    case 'cash':
      return <Banknote className="h-3.5 w-3.5" />;
    case 'mobile_money':
      return <Smartphone className="h-3.5 w-3.5" />;
    default:
      return <CreditCard className="h-3.5 w-3.5" />;
  }
}

// ============================================
// ROLE-BASED GREETING
// ============================================
function RoleGreeting({ userName, role }: { userName: string; role: string }) {
  const hour = new Date().getHours();
  let greeting = 'Good evening';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 18) greeting = 'Good afternoon';

  const roleLabel: Record<string, string> = {
    super_admin: 'Super Admin',
    admin: 'Administrator',
    manager: 'Branch Manager',
    cashier: 'Cashier',
    viewer: 'Observer',
  };

  const roleColor: Record<string, string> = {
    super_admin: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30',
    admin: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30',
    manager: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30',
    cashier: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30',
    viewer: 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/40',
  };

  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
      <div>
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
          {greeting}, {userName.split(' ')[0]}!
        </h2>
        <p className="text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening at your business today
        </p>
      </div>
      <Badge className={cn('self-start text-xs font-semibold', roleColor[role] || roleColor.viewer)}>
        {roleLabel[role] || role}
      </Badge>
    </div>
  );
}

// ============================================
// CASHIER DASHBOARD - Simplified view
// ============================================
function CashierDashboard() {
  const { setPage } = useNavStore();
  const { user } = useAuthStore();
  const metrics = mockDashboardMetrics;

  // Today's sales (from data)
  const todaySales = 0;
  const todayOrders = 0;
  const todayRefunds = 0;

  // Recent transactions for this cashier's branch
  const recentTransactions = [...mockTransactions]
    .filter(t => t.branchId === user?.branchId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  // Low stock at this branch
  const branchProducts = mockProducts.filter(p => p.trackStock && p.stockQuantity <= p.lowStockAlert).slice(0, 3);

  const quickActions = [
    { label: 'New Sale', icon: ShoppingCart, page: 'pos' as const, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30 hover:bg-emerald-200 dark:hover:bg-emerald-900/50' },
    { label: 'Hold Orders', icon: Timer, page: 'pos' as const, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-900/50' },
    { label: 'Customers', icon: Users, page: 'customers' as const, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-100 dark:bg-violet-900/30 hover:bg-violet-200 dark:hover:bg-violet-900/50' },
    { label: 'Inventory', icon: Package, page: 'inventory' as const, color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-100 dark:bg-sky-900/30 hover:bg-sky-200 dark:hover:bg-sky-900/50' },
  ];

  return (
    <div className="space-y-6">
      <RoleGreeting userName={user?.name || 'Cashier'} role={user?.role || 'cashier'} />

      {/* Cashier Stats - Focused on today's activity */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="relative overflow-hidden border-l-4 border-l-emerald-500">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent" />
          <CardContent className="relative p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Today&apos;s Sales</p>
                <p className="text-2xl font-bold tracking-tight">{formatCurrency(todaySales)}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1 text-sm">
              <ArrowUpRight className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="font-medium text-emerald-600 dark:text-emerald-400">8.5%</span>
              <span className="text-muted-foreground">vs yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-sky-500">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 to-transparent" />
          <CardContent className="relative p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Orders Today</p>
                <p className="text-2xl font-bold tracking-tight">{todayOrders}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 dark:bg-sky-900/30">
                <ShoppingBag className="h-5 w-5 text-sky-600 dark:text-sky-400" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-sky-500" />
              <span>Avg. {formatCurrency(todayOrders > 0 ? todaySales / todayOrders : 0)} per order</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-amber-500">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent" />
          <CardContent className="relative p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Refunds Today</p>
                <p className="text-2xl font-bold tracking-tight">{todayRefunds}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <Wallet className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              Your branch: <span className="font-medium text-foreground">{user?.branchName}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions - Prominent for cashiers */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
          <CardDescription>Start a sale or look up information</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-4 pb-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.label}
                variant="outline"
                className="h-auto flex-col gap-2.5 py-5 transition-all"
                onClick={() => setPage(action.page)}
              >
                <div className={cn('flex h-12 w-12 items-center justify-center rounded-lg', action.bg)}>
                  <Icon className={cn('h-6 w-6', action.color)} />
                </div>
                <span className="text-sm font-medium">{action.label}</span>
              </Button>
            );
          })}
        </CardContent>
      </Card>

      {/* Recent Transactions + Low Stock */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-semibold">Recent Transactions</CardTitle>
              <CardDescription>At your branch</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-xs" onClick={() => setPage('transactions')}>
              View All
            </Button>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="space-y-3">
              {recentTransactions.map((txn) => {
                const isRefund = txn.type === 'refund';
                return (
                  <div key={txn.id} className="flex items-center gap-3 rounded-lg border px-3 py-2.5">
                    <div className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full',
                      isRefund ? 'bg-red-100 dark:bg-red-900/30' : 'bg-emerald-100 dark:bg-emerald-900/30'
                    )}>
                      {isRefund ? (
                        <ArrowDownRight className="h-4 w-4 text-red-600 dark:text-red-400" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{txn.customerName || 'Walk-in'}</p>
                      <p className="text-xs text-muted-foreground">{txn.reference}</p>
                    </div>
                    <div className="text-right">
                      <p className={cn('text-sm font-semibold', isRefund && 'text-red-600 dark:text-red-400')}>
                        {isRefund ? '-' : ''}{formatCurrency(Math.abs(txn.totalAmount))}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <PaymentIcon method={txn.paymentMethod} />
                        <span className="capitalize">{txn.paymentMethod.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock at branch */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <CardTitle className="text-base font-semibold">Low Stock Alerts</CardTitle>
            </div>
            <CardDescription>Items that need restocking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 pb-4">
            {branchProducts.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">All stock levels are healthy</p>
            ) : (
              branchProducts.map((product) => {
                const isOutOfStock = product.stockQuantity === 0;
                return (
                  <div
                    key={product.id}
                    className={cn(
                      'flex items-center gap-3 rounded-lg border px-3 py-2.5',
                      isOutOfStock
                        ? 'border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/20'
                        : 'border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-900/20'
                    )}
                  >
                    <Package className={cn('h-4 w-4', isOutOfStock ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400')} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{isOutOfStock ? 'Out of stock' : `${product.stockQuantity} remaining`}</p>
                    </div>
                    <Badge variant={isOutOfStock ? 'destructive' : 'secondary'} className="text-xs">
                      {isOutOfStock ? 'Out' : 'Low'}
                    </Badge>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ============================================
// VIEWER DASHBOARD - Read-only metrics
// ============================================
function ViewerDashboard() {
  const { user } = useAuthStore();
  const metrics = mockDashboardMetrics;
  const recentTransactions = [...mockTransactions]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const statCards = [
    { title: 'Total Revenue', value: formatCurrency(metrics.totalRevenue), change: metrics.revenueChange, icon: DollarSign, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30', borderAccent: 'border-l-emerald-500' },
    { title: 'Total Orders', value: formatNumber(metrics.totalOrders), change: metrics.ordersChange, icon: ShoppingBag, color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-100 dark:bg-sky-900/30', borderAccent: 'border-l-sky-500' },
    { title: 'Total Customers', value: formatNumber(metrics.totalCustomers), change: metrics.customersChange, icon: Users, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-100 dark:bg-violet-900/30', borderAccent: 'border-l-violet-500' },
    { title: 'Total Profit', value: formatCurrency(metrics.totalProfit), change: metrics.profitChange, icon: TrendingUp, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30', borderAccent: 'border-l-amber-500' },
  ];

  return (
    <div className="space-y-6">
      <RoleGreeting userName={user?.name || 'Viewer'} role={user?.role || 'viewer'} />

      {/* Read-only notice */}
      <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 dark:border-blue-800 dark:bg-blue-950/30">
        <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <p className="text-sm text-blue-700 dark:text-blue-300">
          You have read-only access. Contact an administrator to request edit permissions.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const isPositive = stat.change >= 0;
          return (
            <Card key={stat.title} className={cn('relative overflow-hidden border-l-4', stat.borderAccent)}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                  </div>
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', stat.bg)}>
                    <Icon className={cn('h-5 w-5', stat.color)} />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1 text-sm">
                  {isPositive ? (
                    <ArrowUpRight className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-600 dark:text-red-400" />
                  )}
                  <span className={cn('font-medium', isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400')}>
                    {Math.abs(stat.change)}%
                  </span>
                  <span className="text-muted-foreground">vs last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts - Revenue + Category breakdown */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold">Revenue Overview</CardTitle>
              <CardDescription>Monthly revenue &amp; profit trend</CardDescription>
            </div>
            <Badge variant="secondary">2026</Badge>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChartData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="viewerRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="viewerProfitGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} className="fill-muted-foreground" />
                  <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} className="fill-muted-foreground" />
                  <Tooltip content={<RevenueTooltip />} />
                  <Legend verticalAlign="top" height={36} formatter={(value: string) => (
                    <span className="text-xs font-medium text-foreground">{value === 'revenue' ? 'Revenue' : 'Profit'}</span>
                  )} />
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} fill="url(#viewerRevenueGradient)" />
                  <Area type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={2} fill="url(#viewerProfitGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Sales by Category</CardTitle>
            <CardDescription>Revenue breakdown</CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={salesByCategoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="revenue" nameKey="name" stroke="none">
                    {salesByCategoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5">
              {salesByCategoryData.map((entry, index) => {
                const total = salesByCategoryData.reduce((sum, d) => sum + (d.revenue || 0), 0);
                const pct = total > 0 ? ((entry.revenue || 0) / total * 100).toFixed(1) : '0';
                return (
                  <div key={entry.name} className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} />
                    <span className="truncate text-xs text-muted-foreground">{entry.name}</span>
                    <span className="ml-auto text-xs font-medium">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions - Read-only */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-semibold">Recent Transactions</CardTitle>
            <CardDescription>View-only transaction history</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground">Reference</th>
                  <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground">Customer</th>
                  <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground">Amount</th>
                  <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground">Payment</th>
                  <th className="pb-2 text-xs font-medium text-muted-foreground">Branch</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((txn) => {
                  const isRefund = txn.type === 'refund';
                  return (
                    <tr key={txn.id} className="border-b last:border-0">
                      <td className="py-2.5 pr-4">
                        <span className="text-sm font-medium">{txn.reference}</span>
                        {isRefund && <Badge variant="destructive" className="ml-2 text-[10px] px-1.5 py-0">Refund</Badge>}
                      </td>
                      <td className="py-2.5 pr-4 text-sm text-muted-foreground">{txn.customerName || 'Walk-in'}</td>
                      <td className="py-2.5 pr-4">
                        <span className={cn('text-sm font-semibold', isRefund && 'text-red-600 dark:text-red-400')}>
                          {isRefund ? '-' : ''}{formatCurrency(Math.abs(txn.totalAmount))}
                        </span>
                      </td>
                      <td className="py-2.5 pr-4">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <PaymentIcon method={txn.paymentMethod} />
                          <span className="capitalize">{txn.paymentMethod.replace('_', ' ')}</span>
                        </div>
                      </td>
                      <td className="py-2.5 text-sm text-muted-foreground">{txn.branchName}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================
// MANAGER DASHBOARD - Branch-focused
// ============================================
function ManagerDashboard() {
  const { user } = useAuthStore();
  const { setPage } = useNavStore();
  const metrics = mockDashboardMetrics;

  // Branch-specific data
  const branchTxns = mockTransactions.filter(t => t.branchId === user?.branchId);
  const branchRevenue = branchTxns.reduce((sum, t) => sum + (t.type === 'sale' ? t.totalAmount : 0), 0);
  const branchOrders = branchTxns.filter(t => t.type === 'sale').length;

  const lowStockProducts = mockProducts.filter(p => p.trackStock && p.stockQuantity <= p.lowStockAlert);
  const recentTransactions = [...mockTransactions]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const quickActions = [
    { label: 'New Sale', icon: ShoppingCart, page: 'pos' as const, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30 hover:bg-emerald-200 dark:hover:bg-emerald-900/50' },
    { label: 'Inventory', icon: Package, page: 'inventory' as const, color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-100 dark:bg-sky-900/30 hover:bg-sky-200 dark:hover:bg-sky-900/50' },
    { label: 'Employees', icon: UserCog, page: 'employees' as const, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-100 dark:bg-violet-900/30 hover:bg-violet-200 dark:hover:bg-violet-900/50' },
    { label: 'Reports', icon: BarChart3, page: 'reports' as const, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-900/50' },
  ];

  const statCards = [
    { title: 'Branch Revenue', value: formatCurrency(branchRevenue), icon: DollarSign, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30', borderAccent: 'border-l-emerald-500', gradient: 'from-emerald-500/10 to-transparent' },
    { title: 'Branch Orders', value: String(branchOrders), icon: ShoppingBag, color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-100 dark:bg-sky-900/30', borderAccent: 'border-l-sky-500', gradient: 'from-sky-500/10 to-transparent' },
    { title: 'Active Customers', value: formatNumber(metrics.totalCustomers), change: metrics.customersChange, icon: Users, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-100 dark:bg-violet-900/30', borderAccent: 'border-l-violet-500', gradient: 'from-violet-500/10 to-transparent' },
    { title: 'Low Stock Items', value: String(lowStockProducts.length), icon: AlertTriangle, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30', borderAccent: 'border-l-amber-500', gradient: 'from-amber-500/10 to-transparent' },
  ];

  return (
    <div className="space-y-6">
      <RoleGreeting userName={user?.name || 'Manager'} role={user?.role || 'manager'} />

      {/* Branch indicator */}
      <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 dark:border-blue-800 dark:bg-blue-950/30">
        <Star className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Viewing data for <span className="font-semibold">{user?.branchName}</span> branch
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className={cn('relative overflow-hidden border-l-4 transition-shadow hover:shadow-md', stat.borderAccent)}>
              <div className={cn('absolute inset-0 bg-gradient-to-br', stat.gradient)} />
              <CardContent className="relative p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                  </div>
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', stat.bg)}>
                    <Icon className={cn('h-5 w-5', stat.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Revenue Chart + Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold">Revenue Overview</CardTitle>
              <CardDescription>Monthly revenue &amp; profit for the past year</CardDescription>
            </div>
            <Badge variant="secondary">2026</Badge>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChartData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="mgrRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="mgrProfitGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} className="fill-muted-foreground" />
                  <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} className="fill-muted-foreground" />
                  <Tooltip content={<RevenueTooltip />} />
                  <Legend verticalAlign="top" height={36} formatter={(value: string) => (
                    <span className="text-xs font-medium text-foreground">{value === 'revenue' ? 'Revenue' : 'Profit'}</span>
                  )} />
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} fill="url(#mgrRevenueGradient)" />
                  <Area type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={2} fill="url(#mgrProfitGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
            <CardDescription>Frequently used shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 pb-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button key={action.label} variant="outline" className="h-auto flex-col gap-2.5 py-5 transition-all" onClick={() => setPage(action.page)}>
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', action.bg)}>
                    <Icon className={cn('h-5 w-5', action.color)} />
                  </div>
                  <span className="text-xs font-medium">{action.label}</span>
                </Button>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions + Low Stock */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-semibold">Recent Transactions</CardTitle>
              <CardDescription>Latest 5 transactions</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-xs" onClick={() => setPage('transactions')}>View All</Button>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground">Reference</th>
                    <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground">Customer</th>
                    <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground">Amount</th>
                    <th className="pb-2 text-xs font-medium text-muted-foreground">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((txn) => {
                    const isRefund = txn.type === 'refund';
                    return (
                      <tr key={txn.id} className="border-b last:border-0">
                        <td className="py-2.5 pr-4">
                          <span className="text-sm font-medium">{txn.reference}</span>
                          {isRefund && <Badge variant="destructive" className="ml-2 text-[10px] px-1.5 py-0">Refund</Badge>}
                        </td>
                        <td className="py-2.5 pr-4 text-sm text-muted-foreground">{txn.customerName || 'Walk-in'}</td>
                        <td className="py-2.5 pr-4">
                          <span className={cn('text-sm font-semibold', isRefund && 'text-red-600 dark:text-red-400')}>
                            {isRefund ? '-' : ''}{formatCurrency(Math.abs(txn.totalAmount))}
                          </span>
                        </td>
                        <td className="py-2.5">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatDateTime(txn.createdAt)}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <CardTitle className="text-base font-semibold">Low Stock Alerts</CardTitle>
            </div>
            <CardDescription>{lowStockProducts.length} items below threshold</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 pb-4">
            {lowStockProducts.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">All stock levels are healthy</p>
            ) : (
              <div className="max-h-64 space-y-2 overflow-y-auto">
                {lowStockProducts.map((product) => {
                  const isOutOfStock = product.stockQuantity === 0;
                  return (
                    <div key={product.id} className={cn(
                      'flex items-center gap-3 rounded-lg border px-3 py-2.5',
                      isOutOfStock ? 'border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/20' : 'border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-900/20'
                    )}>
                      <Package className={cn('h-4 w-4', isOutOfStock ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400')} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{isOutOfStock ? 'Out of stock' : `${product.stockQuantity} remaining`}</p>
                      </div>
                      <Badge variant={isOutOfStock ? 'destructive' : 'secondary'} className="text-xs">{isOutOfStock ? 'Out' : 'Low'}</Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ============================================
// ADMIN / SUPER ADMIN DASHBOARD - Full view
// ============================================
function AdminDashboard() {
  const { user } = useAuthStore();
  const { setPage } = useNavStore();
  const metrics = mockDashboardMetrics;

  const lowStockProducts = mockProducts.filter(p => p.trackStock && p.stockQuantity <= p.lowStockAlert);
  const recentTransactions = [...mockTransactions]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  const totalCategoryRevenue = salesByCategoryData.reduce((sum, d) => sum + (d.revenue || 0), 0);

  const statCards = [
    { title: 'Total Revenue', value: formatCurrency(metrics.totalRevenue), change: metrics.revenueChange, icon: DollarSign, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30', gradient: 'from-emerald-500/10 to-transparent', borderAccent: 'border-l-emerald-500' },
    { title: 'Total Orders', value: formatNumber(metrics.totalOrders), change: metrics.ordersChange, icon: ShoppingBag, color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-100 dark:bg-sky-900/30', gradient: 'from-sky-500/10 to-transparent', borderAccent: 'border-l-sky-500' },
    { title: 'Total Customers', value: formatNumber(metrics.totalCustomers), change: metrics.customersChange, icon: Users, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-100 dark:bg-violet-900/30', gradient: 'from-violet-500/10 to-transparent', borderAccent: 'border-l-violet-500' },
    { title: 'Total Profit', value: formatCurrency(metrics.totalProfit), change: metrics.profitChange, icon: TrendingUp, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30', gradient: 'from-amber-500/10 to-transparent', borderAccent: 'border-l-amber-500' },
  ];

  const quickActions = [
    { label: 'New Sale', icon: ShoppingCart, page: 'pos' as const, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30 hover:bg-emerald-200 dark:hover:bg-emerald-900/50' },
    { label: 'Add Product', icon: Package, page: 'products' as const, color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-100 dark:bg-sky-900/30 hover:bg-sky-200 dark:hover:bg-sky-900/50' },
    { label: 'Add Customer', icon: UserPlus, page: 'customers' as const, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-100 dark:bg-violet-900/30 hover:bg-violet-200 dark:hover:bg-violet-900/50' },
    { label: 'View Reports', icon: BarChart3, page: 'reports' as const, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-900/50' },
  ];

  return (
    <div className="space-y-6">
      <RoleGreeting userName={user?.name || 'Admin'} role={user?.role || 'admin'} />

      {/* Top Stats Cards Row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const isPositive = stat.change >= 0;
          return (
            <Card key={stat.title} className={cn('relative overflow-hidden border-l-4 transition-shadow hover:shadow-md', stat.borderAccent)}>
              <div className={cn('absolute inset-0 bg-gradient-to-br', stat.gradient)} />
              <CardContent className="relative p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                  </div>
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', stat.bg)}>
                    <Icon className={cn('h-5 w-5', stat.color)} />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1 text-sm">
                  {isPositive ? (
                    <ArrowUpRight className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-600 dark:text-red-400" />
                  )}
                  <span className={cn('font-medium', isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400')}>
                    {Math.abs(stat.change)}%
                  </span>
                  <span className="text-muted-foreground">vs last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Revenue Chart + Pie Chart */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold">Revenue Overview</CardTitle>
              <CardDescription>Monthly revenue &amp; profit for the past year</CardDescription>
            </div>
            <Badge variant="secondary">2026</Badge>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChartData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="adminRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="adminProfitGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} className="fill-muted-foreground" />
                  <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} className="fill-muted-foreground" />
                  <Tooltip content={<RevenueTooltip />} />
                  <Legend verticalAlign="top" height={36} formatter={(value: string) => (
                    <span className="text-xs font-medium text-foreground">{value === 'revenue' ? 'Revenue' : 'Profit'}</span>
                  )} />
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} fill="url(#adminRevenueGradient)" />
                  <Area type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={2} fill="url(#adminProfitGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Sales by Category</CardTitle>
            <CardDescription>Revenue breakdown</CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={salesByCategoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="revenue" nameKey="name" stroke="none">
                    {salesByCategoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5">
              {salesByCategoryData.map((entry, index) => {
                const pct = totalCategoryRevenue > 0 ? ((entry.revenue || 0) / totalCategoryRevenue * 100).toFixed(1) : '0';
                return (
                  <div key={entry.name} className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} />
                    <span className="truncate text-xs text-muted-foreground">{entry.name}</span>
                    <span className="ml-auto text-xs font-medium">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Sales + Top Products */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold">Weekly Sales</CardTitle>
              <CardDescription>Revenue per day this week</CardDescription>
            </div>
            <Badge variant="outline" className="text-xs">This Week</Badge>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklySalesData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} className="fill-muted-foreground" />
                  <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(v: number) => `$${(v / 1000).toFixed(1)}k`} className="fill-muted-foreground" />
                  <Tooltip content={<WeeklyTooltip />} />
                  <Bar dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={48} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Top Products</CardTitle>
            <CardDescription>Best selling items this month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pb-4">
            {topProductsData.map((product, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-bold text-muted-foreground">
                  {i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.sales} units sold</p>
                </div>
                <span className="text-sm font-semibold">{formatCurrency(product.revenue)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Branch Performance + Low Stock */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Branch Performance</CardTitle>
            <CardDescription>Revenue distribution by branch</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pb-4">
            {branchPerformanceData.map((branch, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{branch.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{formatCurrency(branch.revenue)}</span>
                    <Badge variant="secondary" className="text-xs font-semibold">{branch.percentage}%</Badge>
                  </div>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${branch.percentage}%`, backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <CardTitle className="text-base font-semibold">Low Stock Alerts</CardTitle>
            </div>
            <CardDescription>{lowStockProducts.length} items below threshold</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 pb-4">
            {lowStockProducts.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">All stock levels are healthy</p>
            ) : (
              <div className="max-h-64 space-y-2 overflow-y-auto">
                {lowStockProducts.map((product) => {
                  const isOutOfStock = product.stockQuantity === 0;
                  const isCritical = product.stockQuantity > 0 && product.stockQuantity <= product.lowStockAlert / 2;
                  return (
                    <div key={product.id} className={cn(
                      'flex items-center gap-3 rounded-lg border px-3 py-2.5',
                      isOutOfStock ? 'border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/20'
                        : isCritical ? 'border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/20'
                        : 'border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-900/20'
                    )}>
                      <Package className={cn('h-4 w-4', isOutOfStock || isCritical ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400')} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{isOutOfStock ? 'Out of stock' : `${product.stockQuantity} remaining`}</p>
                      </div>
                      <Badge variant={isOutOfStock ? 'destructive' : 'secondary'} className={cn(
                        'text-xs',
                        !isOutOfStock && isCritical ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          : !isOutOfStock && !isCritical ? 'text-amber-700 dark:text-amber-400' : ''
                      )}>
                        {isOutOfStock ? 'Out' : isCritical ? 'Critical' : 'Low'}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions + Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-semibold">Recent Transactions</CardTitle>
              <CardDescription>Latest 5 transactions</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-xs" onClick={() => setPage('transactions')}>View All</Button>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground">Reference</th>
                    <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground">Customer</th>
                    <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground">Amount</th>
                    <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground">Payment</th>
                    <th className="pb-2 text-xs font-medium text-muted-foreground">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((txn) => {
                    const isRefund = txn.type === 'refund';
                    return (
                      <tr key={txn.id} className="border-b last:border-0">
                        <td className="py-2.5 pr-4">
                          <span className="text-sm font-medium">{txn.reference}</span>
                          {isRefund && <Badge variant="destructive" className="ml-2 text-[10px] px-1.5 py-0">Refund</Badge>}
                        </td>
                        <td className="py-2.5 pr-4 text-sm text-muted-foreground">{txn.customerName || 'Walk-in'}</td>
                        <td className="py-2.5 pr-4">
                          <span className={cn('text-sm font-semibold', isRefund && 'text-red-600 dark:text-red-400')}>
                            {isRefund ? '-' : ''}{formatCurrency(Math.abs(txn.totalAmount))}
                          </span>
                        </td>
                        <td className="py-2.5 pr-4">
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <PaymentIcon method={txn.paymentMethod} />
                            <span className="capitalize">{txn.paymentMethod.replace('_', ' ')}</span>
                          </div>
                        </td>
                        <td className="py-2.5">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatDateTime(txn.createdAt)}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
            <CardDescription>Frequently used shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 pb-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button key={action.label} variant="outline" className="h-auto flex-col gap-2.5 py-5 transition-all" onClick={() => setPage(action.page)}>
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', action.bg)}>
                    <Icon className={cn('h-5 w-5', action.color)} />
                  </div>
                  <span className="text-xs font-medium">{action.label}</span>
                </Button>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ============================================
// MAIN DASHBOARD COMPONENT - Routes by role
// ============================================
export default function DashboardPage() {
  const { user } = useAuthStore();

  // Route to the appropriate dashboard based on user role
  switch (user?.role) {
    case 'cashier':
      return <CashierDashboard />;
    case 'viewer':
      return <ViewerDashboard />;
    case 'manager':
      return <ManagerDashboard />;
    case 'admin':
    case 'super_admin':
    default:
      return <AdminDashboard />;
  }
}
