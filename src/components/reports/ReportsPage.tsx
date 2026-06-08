'use client';

import { useState } from 'react';
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
  TrendingUp,
  TrendingDown,
  FileText,
  Download,
  Printer,
  Package,
  AlertTriangle,
  Plus,
  FileSpreadsheet,
  FileDown,
  File,
  Calendar,
  Receipt,
  PiggyBank,
  BarChart3,
  Archive,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  mockTransactions,
  mockExpenses,
  mockProducts,
  revenueChartData,
} from '@/data/mockData';
import { formatCurrency, formatNumber, formatDate, cn } from '@/lib/helpers';

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
// DERIVED DATA
// ============================================

const salesTransactions = mockTransactions.filter((t) => t.type === 'sale' && t.status === 'completed');

const totalRevenue = salesTransactions.reduce((s, t) => s + t.subtotal, 0);
const totalDiscounts = salesTransactions.reduce((s, t) => s + t.discountAmount, 0);
const totalTax = salesTransactions.reduce((s, t) => s + t.taxAmount, 0);
const totalSalesAmount = salesTransactions.reduce((s, t) => s + t.totalAmount, 0);
const totalCost = salesTransactions.reduce((s, t) =>
  s + t.items.reduce((cost, item) => {
    const product = mockProducts.find((p) => p.id === item.productId);
    return cost + (product ? product.costPrice * Math.abs(item.quantity) : 0);
  }, 0), 0);
const grossProfit = totalRevenue - totalCost;
const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

// Revenue vs Cost chart data from revenueChartData
const revenueCostChartData = revenueChartData.map((d) => ({
  name: d.name,
  revenue: d.revenue || 0,
  cost: Math.round((d.revenue || 0) * 0.65),
  profit: d.profit || 0,
}));

// Daily sales breakdown
const dailySalesData = [
  { date: 'Jun 1', revenue: 4250, orders: 8, avgOrder: 531.25, profit: 1488 },
  { date: 'Jun 2', revenue: 3890, orders: 6, avgOrder: 648.33, profit: 1362 },
  { date: 'Jun 3', revenue: 5120, orders: 10, avgOrder: 512.0, profit: 1792 },
  { date: 'Jun 4', revenue: 3750, orders: 7, avgOrder: 535.71, profit: 1313 },
  { date: 'Jun 5', revenue: 6280, orders: 12, avgOrder: 523.33, profit: 2198 },
  { date: 'Jun 6', revenue: 5430, orders: 9, avgOrder: 603.33, profit: 1901 },
  { date: 'Jun 7', revenue: 7190, orders: 14, avgOrder: 513.57, profit: 2517 },
];

// Tax data
const taxRates = [
  { rate: '8.5%', taxableAmount: totalRevenue - totalDiscounts, taxCollected: totalTax },
  { rate: '0%', taxableAmount: 2500, taxCollected: 0 },
];

const taxByPeriodData = [
  { name: 'Jan', tax: 1573 },
  { name: 'Feb', tax: 1896 },
  { name: 'Mar', tax: 1683 },
  { name: 'Apr', tax: 2176 },
  { name: 'May', tax: 2389 },
  { name: 'Jun', tax: 2652 },
  { name: 'Jul', tax: 2499 },
  { name: 'Aug', tax: 2848 },
  { name: 'Sep', tax: 2618 },
  { name: 'Oct', tax: 2992 },
  { name: 'Nov', tax: 3579 },
  { name: 'Dec', tax: 4157 },
];

// Expense data
const totalExpenses = mockExpenses.reduce((s, e) => s + e.amount, 0);
const expenseByCategory = mockExpenses.reduce<Record<string, number>>((acc, e) => {
  acc[e.category] = (acc[e.category] || 0) + e.amount;
  return acc;
}, {});
const expensePieData = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }));

// Inventory data
const inventoryValue = mockProducts.reduce((s, p) => s + p.costPrice * p.stockQuantity, 0);
const inventoryByCategory = mockProducts.reduce<Record<string, { qty: number; value: number }>>((acc, p) => {
  if (!acc[p.categoryName]) acc[p.categoryName] = { qty: 0, value: 0 };
  acc[p.categoryName].qty += p.stockQuantity;
  acc[p.categoryName].value += p.costPrice * p.stockQuantity;
  return acc;
}, {});
const lowStockProducts = mockProducts.filter((p) => p.trackStock && p.stockQuantity <= p.lowStockAlert);

// ============================================
// CUSTOM TOOLTIP
// ============================================
function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string; color: string }>; label?: string }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-lg border bg-background px-3 py-2 shadow-md">
      <p className="mb-1 text-xs font-medium text-muted-foreground">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-semibold" style={{ color: entry.color }}>
          {entry.dataKey === 'revenue' ? 'Revenue' : entry.dataKey === 'cost' ? 'Cost' : entry.dataKey === 'profit' ? 'Profit' : entry.dataKey}:{' '}
          {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  );
}

function PieTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { fill: string } }> }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-lg border bg-background px-3 py-2 shadow-md">
      <p className="text-sm font-semibold" style={{ color: payload[0].payload.fill }}>{payload[0].name}</p>
      <p className="text-sm text-muted-foreground">{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

function BarTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string; color: string }>; label?: string }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-lg border bg-background px-3 py-2 shadow-md">
      <p className="mb-1 text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-emerald-600">Tax: {formatCurrency(payload[0].value)}</p>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('this_month');
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [exportReportType, setExportReportType] = useState('sales');
  const [newExpense, setNewExpense] = useState({ category: '', description: '', amount: '', date: '' });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Financial Reports & Analytics</h1>
          <p className="text-sm text-muted-foreground">Comprehensive business insights and financial reporting</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="sales" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-auto gap-1">
          <TabsTrigger value="sales" className="text-xs sm:text-sm">
            <BarChart3 className="mr-1.5 h-4 w-4 hidden sm:inline" />
            Sales
          </TabsTrigger>
          <TabsTrigger value="tax" className="text-xs sm:text-sm">
            <Receipt className="mr-1.5 h-4 w-4 hidden sm:inline" />
            Tax
          </TabsTrigger>
          <TabsTrigger value="expenses" className="text-xs sm:text-sm">
            <PiggyBank className="mr-1.5 h-4 w-4 hidden sm:inline" />
            Expenses
          </TabsTrigger>
          <TabsTrigger value="inventory" className="text-xs sm:text-sm">
            <Archive className="mr-1.5 h-4 w-4 hidden sm:inline" />
            Inventory
          </TabsTrigger>
          <TabsTrigger value="export" className="text-xs sm:text-sm col-span-2 sm:col-span-1">
            <FileDown className="mr-1.5 h-4 w-4 hidden sm:inline" />
            Export
          </TabsTrigger>
        </TabsList>

        {/* ============================================ */}
        {/* TAB 1: SALES REPORTS                        */}
        {/* ============================================ */}
        <TabsContent value="sales" className="space-y-6">
          {/* Date Range Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            {['today', 'this_week', 'this_month', 'custom'].map((range) => (
              <Button
                key={range}
                variant={dateRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDateRange(range)}
                className="capitalize"
              >
                {range.replace('_', ' ')}
              </Button>
            ))}
          </div>

          {/* Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Card className="border-l-4 border-l-emerald-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <p className="mt-1 text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                    <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="h-3 w-3" />
                  <span className="font-medium">+12.5%</span>
                  <span className="text-muted-foreground">vs last period</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Cost</p>
                    <p className="mt-1 text-2xl font-bold">{formatCurrency(totalCost)}</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                    <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <span>~65% of revenue</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-sky-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Gross Profit</p>
                    <p className="mt-1 text-2xl font-bold">{formatCurrency(grossProfit)}</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 dark:bg-sky-900/30">
                    <TrendingUp className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs text-sky-600 dark:text-sky-400">
                  <TrendingUp className="h-3 w-3" />
                  <span className="font-medium">+9.8%</span>
                  <span className="text-muted-foreground">vs last period</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-amber-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Profit Margin</p>
                    <p className="mt-1 text-2xl font-bold">{profitMargin.toFixed(1)}%</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                    <DollarSign className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="h-3 w-3" />
                  <span className="font-medium">+2.1%</span>
                  <span className="text-muted-foreground">improvement</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue vs Cost Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Revenue vs Cost</CardTitle>
              <CardDescription>Monthly comparison for the past year</CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueCostChartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="salesRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="salesCostGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend verticalAlign="top" height={36} formatter={(value: string) => (
                      <span className="text-xs font-medium text-foreground">
                        {value === 'revenue' ? 'Revenue' : value === 'cost' ? 'Cost' : 'Profit'}
                      </span>
                    )} />
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} fill="url(#salesRevenueGrad)" />
                    <Area type="monotone" dataKey="cost" stroke="#ef4444" strokeWidth={2} fill="url(#salesCostGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Daily Sales Breakdown Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Daily Sales Breakdown</CardTitle>
              <CardDescription>Detailed daily performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                      <TableHead className="text-right">Orders</TableHead>
                      <TableHead className="text-right">Avg Order Value</TableHead>
                      <TableHead className="text-right">Profit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dailySalesData.map((row) => (
                      <TableRow key={row.date}>
                        <TableCell className="font-medium">{row.date}</TableCell>
                        <TableCell className="text-right">{formatCurrency(row.revenue)}</TableCell>
                        <TableCell className="text-right">{row.orders}</TableCell>
                        <TableCell className="text-right">{formatCurrency(row.avgOrder)}</TableCell>
                        <TableCell className="text-right font-medium text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(row.profit)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================ */}
        {/* TAB 2: TAX REPORTS                          */}
        {/* ============================================ */}
        <TabsContent value="tax" className="space-y-6">
          {/* Tax Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="border-l-4 border-l-violet-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Tax Collected</p>
                    <p className="mt-1 text-2xl font-bold">{formatCurrency(totalTax)}</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/30">
                    <Receipt className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-sky-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Taxable Amount</p>
                    <p className="mt-1 text-2xl font-bold">{formatCurrency(totalRevenue - totalDiscounts)}</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 dark:bg-sky-900/30">
                    <DollarSign className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-amber-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Effective Tax Rate</p>
                    <p className="mt-1 text-2xl font-bold">8.5%</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                    <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tax by Period Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Tax Collected by Period</CardTitle>
              <CardDescription>Monthly tax collection overview</CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={taxByPeriodData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(v: number) => `$${(v / 1000).toFixed(1)}k`} />
                    <Tooltip content={<BarTooltip />} />
                    <Bar dataKey="tax" fill="#8b5cf6" radius={[6, 6, 0, 0]} maxBarSize={48} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Tax Breakdown Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Tax Breakdown by Rate</CardTitle>
              <CardDescription>Detailed tax collection by rate category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tax Rate</TableHead>
                      <TableHead className="text-right">Taxable Amount</TableHead>
                      <TableHead className="text-right">Tax Collected</TableHead>
                      <TableHead className="text-right">% of Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {taxRates.map((row) => (
                      <TableRow key={row.rate}>
                        <TableCell>
                          <Badge variant="outline" className="font-mono">{row.rate}</Badge>
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(row.taxableAmount)}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(row.taxCollected)}</TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {totalTax > 0 ? ((row.taxCollected / totalTax) * 100).toFixed(1) : '0'}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================ */}
        {/* TAB 3: EXPENSE REPORTS                      */}
        {/* ============================================ */}
        <TabsContent value="expenses" className="space-y-6">
          {/* Total Expenses Card + Add Button */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Card className="border-l-4 border-l-red-500 flex-1 max-w-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                    <p className="mt-1 text-2xl font-bold">{formatCurrency(totalExpenses)}</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                    <PiggyBank className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Dialog open={addExpenseOpen} onOpenChange={setAddExpenseOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Expense</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="exp-category">Category</Label>
                    <Select value={newExpense.category} onValueChange={(v) => setNewExpense({ ...newExpense, category: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {['Rent', 'Utilities', 'Salaries', 'Marketing', 'Maintenance', 'Insurance', 'Office Supplies', 'Software', 'Other'].map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exp-desc">Description</Label>
                    <Input id="exp-desc" placeholder="Enter description" value={newExpense.description} onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="exp-amount">Amount ($)</Label>
                      <Input id="exp-amount" type="number" placeholder="0.00" value={newExpense.amount} onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="exp-date">Date</Label>
                      <Input id="exp-date" type="date" value={newExpense.date} onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })} />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={() => setAddExpenseOpen(false)}>Add Expense</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Expense by Category Pie + Table */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Expense by Category</CardTitle>
                <CardDescription>Breakdown of spending</CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expensePieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={95}
                        paddingAngle={3}
                        dataKey="value"
                        nameKey="name"
                        stroke="none"
                      >
                        {expensePieData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<PieTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5">
                  {expensePieData.map((entry, index) => {
                    const pct = totalExpenses > 0 ? ((entry.value / totalExpenses) * 100).toFixed(1) : '0';
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

            {/* Expense Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Expense Details</CardTitle>
                <CardDescription>All recorded expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockExpenses.map((expense) => (
                        <TableRow key={expense.id}>
                          <TableCell>
                            <Badge variant="outline">{expense.category}</Badge>
                          </TableCell>
                          <TableCell className="max-w-[150px] truncate">{expense.description}</TableCell>
                          <TableCell className="text-right font-medium text-red-600 dark:text-red-400">
                            {formatCurrency(expense.amount)}
                          </TableCell>
                          <TableCell className="text-muted-foreground">{formatDate(expense.date)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ============================================ */}
        {/* TAB 4: INVENTORY VALUATION                  */}
        {/* ============================================ */}
        <TabsContent value="inventory" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="border-l-4 border-l-emerald-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Inventory Value</p>
                    <p className="mt-1 text-2xl font-bold">{formatCurrency(inventoryValue)}</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                    <Package className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-sky-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total SKUs</p>
                    <p className="mt-1 text-2xl font-bold">{mockProducts.length}</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 dark:bg-sky-900/30">
                    <Archive className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Low Stock Items</p>
                    <p className="mt-1 text-2xl font-bold">{lowStockProducts.length}</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Inventory by Category + Low Stock Warnings */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Category Breakdown */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Inventory by Category</CardTitle>
                <CardDescription>Stock value distribution across categories</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pb-4">
                {Object.entries(inventoryByCategory)
                  .sort(([, a], [, b]) => b.value - a.value)
                  .map(([category, data], i) => {
                    const pct = inventoryValue > 0 ? ((data.value / inventoryValue) * 100).toFixed(1) : '0';
                    return (
                      <div key={category} className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                            <span className="font-medium">{category}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-muted-foreground">{data.qty} units</span>
                            <span className="font-medium">{formatCurrency(data.value)}</span>
                            <Badge variant="secondary" className="text-xs font-semibold">{pct}%</Badge>
                          </div>
                        </div>
                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%`, backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </CardContent>
            </Card>

            {/* Low Stock Warnings */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <CardTitle className="text-base font-semibold">Low Stock Warnings</CardTitle>
                </div>
                <CardDescription>{lowStockProducts.length} items need attention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 pb-4">
                <div className="max-h-72 space-y-2 overflow-y-auto">
                  {lowStockProducts.map((product) => {
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
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Inventory Valuation Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Inventory Valuation Detail</CardTitle>
              <CardDescription>Complete stock and cost breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead className="text-right">Stock Qty</TableHead>
                      <TableHead className="text-right">Cost Price</TableHead>
                      <TableHead className="text-right">Total Value</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockProducts
                      .filter((p) => p.trackStock)
                      .sort((a, b) => (b.costPrice * b.stockQuantity) - (a.costPrice * a.stockQuantity))
                      .map((product) => {
                        const totalValue = product.costPrice * product.stockQuantity;
                        const isLow = product.stockQuantity <= product.lowStockAlert;
                        return (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell className="font-mono text-xs text-muted-foreground">{product.sku}</TableCell>
                            <TableCell className="text-right">
                              <span className={cn(isLow && 'font-semibold text-red-600 dark:text-red-400')}>
                                {product.stockQuantity}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">{formatCurrency(product.costPrice)}</TableCell>
                            <TableCell className="text-right font-medium">{formatCurrency(totalValue)}</TableCell>
                            <TableCell>
                              {isLow ? (
                                <Badge variant="destructive" className="text-xs">
                                  {product.stockQuantity === 0 ? 'Out of Stock' : 'Low Stock'}
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                  In Stock
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================ */}
        {/* TAB 5: EXPORT                               */}
        {/* ============================================ */}
        <TabsContent value="export" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Generate Report</CardTitle>
              <CardDescription>Configure and export your reports in various formats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Export Format Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Export Format</Label>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { id: 'pdf', label: 'PDF Report', icon: FileText, desc: 'Professional formatted report' },
                    { id: 'excel', label: 'Excel Spreadsheet', icon: FileSpreadsheet, desc: 'Editable spreadsheet format' },
                    { id: 'csv', label: 'CSV File', icon: File, desc: 'Raw data for import' },
                  ].map((format) => {
                    const Icon = format.icon;
                    const isSelected = exportFormat === format.id;
                    return (
                      <button
                        key={format.id}
                        onClick={() => setExportFormat(format.id)}
                        className={cn(
                          'flex flex-col items-center gap-2 rounded-lg border-2 p-4 text-center transition-all hover:shadow-sm',
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-900/20'
                            : 'border-muted hover:border-muted-foreground/30'
                        )}
                      >
                        <Icon className={cn('h-8 w-8', isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground')} />
                        <div>
                          <p className={cn('text-sm font-medium', isSelected ? 'text-emerald-700 dark:text-emerald-300' : '')}>{format.label}</p>
                          <p className="text-xs text-muted-foreground">{format.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {/* Report Type Selector */}
              <div className="space-y-2">
                <Label htmlFor="report-type" className="text-sm font-medium">Report Type</Label>
                <Select value={exportReportType} onValueChange={setExportReportType}>
                  <SelectTrigger id="report-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales Report</SelectItem>
                    <SelectItem value="tax">Tax Report</SelectItem>
                    <SelectItem value="expense">Expense Report</SelectItem>
                    <SelectItem value="inventory">Inventory Valuation</SelectItem>
                    <SelectItem value="all">Complete Financial Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Date Range</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="start-date" className="text-xs text-muted-foreground">Start Date</Label>
                    <Input id="start-date" type="date" defaultValue="2026-06-01" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="end-date" className="text-xs text-muted-foreground">End Date</Label>
                    <Input id="end-date" type="date" defaultValue="2026-06-07" />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Generate Button */}
              <div className="flex items-center justify-end gap-3">
                <Button variant="outline">Preview</Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Download className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
