'use client';

import React, { useState, useMemo } from 'react';
import {
  Receipt, Search, Filter, CreditCard, Banknote, Smartphone,
  Building2, QrCode, ArrowUpDown, ArrowUp, ArrowDown, Eye,
  RotateCcw, Printer, Calendar, Package, DollarSign, TrendingUp,
  ChevronLeft, ChevronRight, MoreHorizontal, X,
} from 'lucide-react';
import { mockTransactions } from '@/data/mockData';
import { formatCurrency, formatDateTime, getStatusColor } from '@/lib/helpers';
import type { Transaction } from '@/types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';

// ============================================
// TYPE CONFIG
// ============================================
type DateRange = 'today' | 'this_week' | 'this_month' | 'custom';
type StatusFilter = 'all' | 'completed' | 'pending' | 'cancelled' | 'refunded';
type TypeFilter = 'all' | 'sale' | 'refund' | 'return';

const typeConfig: Record<string, { label: string; className: string }> = {
  sale: { label: 'Sale', className: 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400' },
  refund: { label: 'Refund', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
  return: { label: 'Return', className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
};

const paymentMethodConfig: Record<string, { label: string; icon: React.ElementType; className: string }> = {
  cash: { label: 'Cash', icon: Banknote, className: 'text-emerald-600 dark:text-emerald-400' },
  card: { label: 'Card', icon: CreditCard, className: 'text-sky-600 dark:text-sky-400' },
  mobile_money: { label: 'Mobile', icon: Smartphone, className: 'text-violet-600 dark:text-violet-400' },
  bank_transfer: { label: 'Transfer', icon: Building2, className: 'text-amber-600 dark:text-amber-400' },
  qr: { label: 'QR', icon: QrCode, className: 'text-rose-600 dark:text-rose-400' },
  split: { label: 'Split', icon: Receipt, className: 'text-teal-600 dark:text-teal-400' },
};

// ============================================
// SORT ICON COMPONENT (outside render)
// ============================================
function SortIcon({ field, sortField, sortDir }: { field: 'date' | 'total' | 'reference'; sortField: string; sortDir: 'asc' | 'desc' }) {
  if (sortField !== field) return <ArrowUpDown className="ml-1 h-3.5 w-3.5 text-muted-foreground/50" />;
  return sortDir === 'asc' ? <ArrowUp className="ml-1 h-3.5 w-3.5" /> : <ArrowDown className="ml-1 h-3.5 w-3.5" />;
}

// ============================================
// PAYMENT ICON COMPONENT (outside render)
// ============================================
function PaymentIcon({ method }: { method: string }) {
  const cfg = paymentMethodConfig[method];
  if (!cfg) return <CreditCard className="h-4 w-4 text-muted-foreground" />;
  const Icon = cfg.icon;
  return <Icon className={`h-4 w-4 ${cfg.className}`} />;
}

// ============================================
// TRANSACTIONS PAGE COMPONENT
// ============================================
export default function TransactionsPage() {
  const [transactions] = useState<Transaction[]>([...mockTransactions]);

  // Filter states
  const [dateRange, setDateRange] = useState<DateRange>('this_month');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Sort state
  const [sortField, setSortField] = useState<'date' | 'total' | 'reference'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Detail dialog
  const [viewingTxn, setViewingTxn] = useState<Transaction | null>(null);

  // ============================================
  // FILTERED & SORTED DATA
  // ============================================
  const filtered = useMemo(() => {
    let result = [...transactions];

    // Date range filter
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (dateRange === 'today') {
      result = result.filter((t) => new Date(t.createdAt) >= today);
    } else if (dateRange === 'this_week') {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      result = result.filter((t) => new Date(t.createdAt) >= weekStart);
    } else if (dateRange === 'this_month') {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      result = result.filter((t) => new Date(t.createdAt) >= monthStart);
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((t) => t.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      result = result.filter((t) => t.type === typeFilter);
    }

    // Payment method filter
    if (paymentFilter !== 'all') {
      result = result.filter((t) => t.paymentMethod === paymentFilter);
    }

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.reference.toLowerCase().includes(q) ||
          t.customerName?.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'date') {
        cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortField === 'total') {
        cmp = a.totalAmount - b.totalAmount;
      } else {
        cmp = a.reference.localeCompare(b.reference);
      }
      return sortDir === 'desc' ? -cmp : cmp;
    });

    return result;
  }, [transactions, dateRange, statusFilter, typeFilter, paymentFilter, search, sortField, sortDir]);

  // ============================================
  // SUMMARY METRICS
  // ============================================
  const summary = useMemo(() => {
    const sales = filtered.filter((t) => t.type === 'sale' && t.status === 'completed');
    const refunds = filtered.filter((t) => t.type === 'refund' || t.type === 'return');
    const totalSalesAmt = sales.reduce((s, t) => s + t.totalAmount, 0);
    const totalRefundAmt = refunds.reduce((s, t) => s + Math.abs(t.totalAmount), 0);
    const netRevenue = totalSalesAmt - totalRefundAmt;
    const avgOrder = sales.length > 0 ? totalSalesAmt / sales.length : 0;
    return {
      salesCount: sales.length,
      totalSales: totalSalesAmt,
      refundCount: refunds.length,
      totalRefunds: totalRefundAmt,
      netRevenue,
      avgOrderValue: avgOrder,
    };
  }, [filtered]);

  // ============================================
  // PAGINATION
  // ============================================
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  // ============================================
  // SORT HANDLER
  // ============================================
  const handleSort = (field: 'date' | 'total' | 'reference') => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  // ============================================
  // CLEAR FILTERS
  // ============================================
  const hasActiveFilters = statusFilter !== 'all' || typeFilter !== 'all' || paymentFilter !== 'all' || search !== '' || dateRange !== 'this_month';
  const clearFilters = () => {
    setStatusFilter('all');
    setTypeFilter('all');
    setPaymentFilter('all');
    setSearch('');
    setDateRange('this_month');
    setPage(1);
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
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Transaction Management</h1>
            <p className="text-sm text-muted-foreground">View and manage all sales, refunds, and returns</p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 dark:bg-emerald-950/30">
              <Receipt className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">{filtered.length} Records</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 sm:p-6 space-y-4">
        {/* ============================================ */}
        {/* FILTERS BAR */}
        {/* ============================================ */}
        <div className="flex flex-col gap-3 rounded-lg border bg-card p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-1">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters</span>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" className="ml-auto h-7 gap-1 text-xs" onClick={clearFilters}>
                <X className="h-3 w-3" /> Clear
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {/* Date Range */}
            <Select value={dateRange} onValueChange={(v) => { setDateRange(v as DateRange); setPage(1); }}>
              <SelectTrigger className="w-full">
                <Calendar className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="this_week">This Week</SelectItem>
                <SelectItem value="this_month">This Month</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v as StatusFilter); setPage(1); }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>

            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v as TypeFilter); setPage(1); }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="sale">Sale</SelectItem>
                <SelectItem value="refund">Refund</SelectItem>
                <SelectItem value="return">Return</SelectItem>
              </SelectContent>
            </Select>

            {/* Payment Method Filter */}
            <Select value={paymentFilter} onValueChange={(v) => { setPaymentFilter(v); setPage(1); }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="mobile_money">Mobile Money</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Reference or customer..."
                className="pl-8"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* SUMMARY CARDS */}
        {/* ============================================ */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Card className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                  <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground truncate">Total Sales</p>
                  <p className="text-lg font-bold truncate">{formatCurrency(summary.totalSales)}</p>
                  <p className="text-xs text-muted-foreground">{summary.salesCount} transaction{summary.salesCount !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <RotateCcw className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground truncate">Total Refunds</p>
                  <p className="text-lg font-bold truncate">{formatCurrency(summary.totalRefunds)}</p>
                  <p className="text-xs text-muted-foreground">{summary.refundCount} transaction{summary.refundCount !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-100 dark:bg-sky-900/30">
                  <TrendingUp className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground truncate">Net Revenue</p>
                  <p className="text-lg font-bold truncate">{formatCurrency(summary.netRevenue)}</p>
                  <p className="text-xs text-muted-foreground">After refunds</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                  <Package className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground truncate">Avg. Order Value</p>
                  <p className="text-lg font-bold truncate">{formatCurrency(summary.avgOrderValue)}</p>
                  <p className="text-xs text-muted-foreground">Per completed sale</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ============================================ */}
        {/* TRANSACTIONS TABLE */}
        {/* ============================================ */}
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <button className="inline-flex items-center font-medium" onClick={() => handleSort('reference')}>
                    Reference <SortIcon field="reference" sortField={sortField} sortDir={sortDir} />
                  </button>
                </TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="hidden md:table-cell">Customer</TableHead>
                <TableHead className="hidden lg:table-cell">Branch</TableHead>
                <TableHead className="hidden xl:table-cell">Items</TableHead>
                <TableHead className="hidden sm:table-cell">Payment</TableHead>
                <TableHead>
                  <button className="inline-flex items-center font-medium" onClick={() => handleSort('total')}>
                    Total <SortIcon field="total" sortField={sortField} sortDir={sortDir} />
                  </button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <button className="inline-flex items-center font-medium" onClick={() => handleSort('date')}>
                    Date/Time <SortIcon field="date" sortField={sortField} sortDir={sortDir} />
                  </button>
                </TableHead>
                <TableHead className="w-[50px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
                    No transactions found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((txn) => {
                  const tc = typeConfig[txn.type] || typeConfig.sale;
                  const pmc = paymentMethodConfig[txn.paymentMethod];
                  return (
                    <TableRow
                      key={txn.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setViewingTxn(txn)}
                    >
                      <TableCell>
                        <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium">{txn.reference}</code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={tc.className}>{tc.label}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">
                        {txn.customerName || <span className="text-muted-foreground">Walk-in</span>}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                        {txn.branchName}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell text-sm text-muted-foreground">
                        {txn.items.length} item{txn.items.length !== 1 ? 's' : ''}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-1.5">
                          <PaymentIcon method={txn.paymentMethod} />
                          <span className="text-xs text-muted-foreground">{pmc?.label || txn.paymentMethod}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-sm">
                        <span className={txn.totalAmount < 0 ? 'text-red-600 dark:text-red-400' : ''}>
                          {formatCurrency(txn.totalAmount)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getStatusColor(txn.status)}>
                          {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDateTime(txn.createdAt)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setViewingTxn(txn); }}>
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            {txn.type === 'sale' && txn.status === 'completed' && (
                              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                <RotateCcw className="mr-2 h-4 w-4" /> Refund
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                              <Printer className="mr-2 h-4 w-4" /> Print Receipt
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

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Showing {((page - 1) * pageSize) + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length} transactions
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={p === page ? 'default' : 'outline'}
                size="icon"
                className="h-8 w-8 text-xs"
                onClick={() => setPage(p)}
              >
                {p}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages || totalPages === 0}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* TRANSACTION DETAIL DIALOG */}
      {/* ============================================ */}
      <Dialog open={!!viewingTxn} onOpenChange={(open) => !open && setViewingTxn(null)}>
        <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
          {viewingTxn && (() => {
            const txn = viewingTxn;
            const tc = typeConfig[txn.type] || typeConfig.sale;
            const pmc = paymentMethodConfig[txn.paymentMethod];
            return (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Receipt className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <DialogTitle className="text-lg">Transaction {txn.reference}</DialogTitle>
                      <DialogDescription className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className={tc.className}>{tc.label}</Badge>
                        <Badge variant="secondary" className={getStatusColor(txn.status)}>
                          {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                        </Badge>
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-4 mt-2">
                  {/* Transaction Info */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground mb-0.5">Customer</p>
                      <p className="font-medium">{txn.customerName || 'Walk-in Customer'}</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground mb-0.5">Branch</p>
                      <p className="font-medium">{txn.branchName}</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground mb-0.5">Cashier</p>
                      <p className="font-medium">{txn.employeeName || '—'}</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground mb-0.5">Date & Time</p>
                      <p className="font-medium">{formatDateTime(txn.createdAt)}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Items */}
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Items ({txn.items.length})</h4>
                    <div className="rounded-lg border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead className="text-center">Qty</TableHead>
                            <TableHead className="text-right hidden sm:table-cell">Unit Price</TableHead>
                            <TableHead className="text-right hidden sm:table-cell">Discount</TableHead>
                            <TableHead className="text-right hidden sm:table-cell">Tax</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {txn.items.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="text-sm font-medium">{item.productName}</TableCell>
                              <TableCell className="text-center text-sm">{item.quantity}</TableCell>
                              <TableCell className="text-right text-sm hidden sm:table-cell">{formatCurrency(item.unitPrice)}</TableCell>
                              <TableCell className="text-right text-sm hidden sm:table-cell">{formatCurrency(item.discountAmount)}</TableCell>
                              <TableCell className="text-right text-sm hidden sm:table-cell">{formatCurrency(item.taxAmount)}</TableCell>
                              <TableCell className="text-right text-sm font-medium">{formatCurrency(item.totalAmount)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  <Separator />

                  {/* Payment & Totals */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Payment Details */}
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Payment Details</h4>
                      <div className="rounded-lg bg-muted/50 p-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <PaymentIcon method={txn.paymentMethod} />
                          <span className="text-sm font-medium">{pmc?.label || txn.paymentMethod}</span>
                        </div>
                      </div>
                    </div>

                    {/* Totals */}
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Totals</h4>
                      <div className="rounded-lg bg-muted/50 p-3 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span className="font-medium">{formatCurrency(txn.subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Discount</span>
                          <span className="font-medium text-red-600 dark:text-red-400">-{formatCurrency(txn.discountAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tax</span>
                          <span className="font-medium">{formatCurrency(txn.taxAmount)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-base">
                          <span className="font-semibold">Total</span>
                          <span className="font-bold">{formatCurrency(txn.totalAmount)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0 mt-2">
                  {txn.type === 'sale' && txn.status === 'completed' && (
                    <Button variant="outline" className="gap-1.5" onClick={() => setViewingTxn(null)}>
                      <RotateCcw className="h-4 w-4" /> Refund
                    </Button>
                  )}
                  <Button className="gap-1.5" onClick={() => setViewingTxn(null)}>
                    <Printer className="h-4 w-4" /> Print Receipt
                  </Button>
                </DialogFooter>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
