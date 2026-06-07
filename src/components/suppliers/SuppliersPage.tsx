'use client';

import React, { useState, useMemo } from 'react';
import {
  Truck, Search, Plus, MoreHorizontal, Pencil, Trash2, Eye,
  Mail, Phone, MapPin, DollarSign, Package, FileText,
  ClipboardList, ChevronRight, X, Minus, ShoppingCart,
} from 'lucide-react';
import { mockSuppliers, mockPurchaseOrders, mockProducts } from '@/data/mockData';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/helpers';
import type { Supplier, PurchaseOrder, Product } from '@/types';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

// ============================================
// PO STATUS TAB
// ============================================
type POStatusTab = 'all' | 'draft' | 'sent' | 'received' | 'cancelled';

const poStatusConfig: Record<string, { label: string; count?: number }> = {
  all: { label: 'All' },
  draft: { label: 'Draft' },
  sent: { label: 'Sent' },
  received: { label: 'Received' },
  cancelled: { label: 'Cancelled' },
};

// ============================================
// DEFAULT FORMS
// ============================================
const defaultSupplierForm = {
  name: '', code: '', contactPerson: '', email: '', phone: '', address: '',
};

interface POItemDraft {
  productId: string;
  productName: string;
  quantity: number;
  unitCost: number;
}

const defaultPOForm = {
  supplierId: '',
  expectedDate: '',
  notes: '',
  items: [] as POItemDraft[],
};

// ============================================
// SUPPLIERS PAGE COMPONENT
// ============================================
export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([...mockSuppliers]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([...mockPurchaseOrders]);

  // ============================================
  // SUPPLIERS TAB STATE
  // ============================================
  const [supplierSearch, setSupplierSearch] = useState('');
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [viewingSupplier, setViewingSupplier] = useState<Supplier | null>(null);
  const [isDeleteSupplierOpen, setIsDeleteSupplierOpen] = useState(false);
  const [deletingSupplier, setDeletingSupplier] = useState<Supplier | null>(null);
  const [supplierForm, setSupplierForm] = useState(defaultSupplierForm);

  // ============================================
  // PURCHASE ORDERS TAB STATE
  // ============================================
  const [poStatusTab, setPOStatusTab] = useState<POStatusTab>('all');
  const [isAddPOOpen, setIsAddPOOpen] = useState(false);
  const [viewingPO, setViewingPO] = useState<PurchaseOrder | null>(null);
  const [poForm, setPOForm] = useState(defaultPOForm);

  // ============================================
  // FILTERED SUPPLIERS
  // ============================================
  const filteredSuppliers = useMemo(() => {
    if (!supplierSearch) return suppliers;
    const q = supplierSearch.toLowerCase();
    return suppliers.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.contactPerson?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.phone?.includes(q)
    );
  }, [suppliers, supplierSearch]);

  // ============================================
  // FILTERED PURCHASE ORDERS
  // ============================================
  const filteredPOs = useMemo(() => {
    if (poStatusTab === 'all') return purchaseOrders;
    if (poStatusTab === 'received') {
      return purchaseOrders.filter((po) => po.status === 'received' || po.status === 'partially_received');
    }
    return purchaseOrders.filter((po) => po.status === poStatusTab);
  }, [purchaseOrders, poStatusTab]);

  // PO status counts
  const poCounts = useMemo(() => {
    const counts: Record<string, number> = { all: purchaseOrders.length };
    for (const po of purchaseOrders) {
      const key = po.status === 'partially_received' ? 'received' : po.status;
      counts[key] = (counts[key] || 0) + 1;
    }
    return counts;
  }, [purchaseOrders]);

  // ============================================
  // SUPPLIER DIALOG HANDLERS
  // ============================================
  const openAddSupplier = () => {
    setEditingSupplier(null);
    setSupplierForm(defaultSupplierForm);
    setIsAddSupplierOpen(true);
  };

  const openEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setSupplierForm({
      name: supplier.name,
      code: supplier.code,
      contactPerson: supplier.contactPerson || '',
      email: supplier.email || '',
      phone: supplier.phone || '',
      address: supplier.address || '',
    });
    setIsAddSupplierOpen(true);
  };

  const handleSaveSupplier = () => {
    if (editingSupplier) {
      setSuppliers((prev) =>
        prev.map((s) =>
          s.id === editingSupplier.id
            ? { ...s, ...supplierForm }
            : s
        )
      );
    } else {
      const newSupplier: Supplier = {
        id: `sup_${Date.now()}`,
        code: supplierForm.code,
        name: supplierForm.name,
        contactPerson: supplierForm.contactPerson || undefined,
        email: supplierForm.email || undefined,
        phone: supplierForm.phone || undefined,
        address: supplierForm.address || undefined,
        balance: 0,
        isActive: true,
      };
      setSuppliers((prev) => [...prev, newSupplier]);
    }
    setIsAddSupplierOpen(false);
  };

  const handleDeleteSupplier = () => {
    if (deletingSupplier) {
      setSuppliers((prev) => prev.filter((s) => s.id !== deletingSupplier.id));
      setIsDeleteSupplierOpen(false);
      setDeletingSupplier(null);
    }
  };

  // ============================================
  // PURCHASE ORDER DIALOG HANDLERS
  // ============================================
  const openAddPO = () => {
    setPOForm({
      supplierId: '',
      expectedDate: '',
      notes: '',
      items: [],
    });
    setIsAddPOOpen(true);
  };

  const addPOItem = () => {
    setPOForm((prev) => ({
      ...prev,
      items: [...prev.items, { productId: '', productName: '', quantity: 1, unitCost: 0 }],
    }));
  };

  const updatePOItem = (index: number, field: keyof POItemDraft, value: string | number) => {
    setPOForm((prev) => {
      const items = [...prev.items];
      items[index] = { ...items[index], [field]: value };
      // Auto-fill product name when product is selected
      if (field === 'productId') {
        const product = mockProducts.find((p) => p.id === value);
        if (product) {
          items[index].productName = product.name;
          items[index].unitCost = product.costPrice;
        }
      }
      return { ...prev, items };
    });
  };

  const removePOItem = (index: number) => {
    setPOForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const poFormTotal = useMemo(() => {
    return poForm.items.reduce((sum, item) => sum + item.quantity * item.unitCost, 0);
  }, [poForm.items]);

  const handleSavePO = () => {
    const supplier = suppliers.find((s) => s.id === poForm.supplierId);
    const newPO: PurchaseOrder = {
      id: `po_${Date.now()}`,
      reference: `PO-2026-${String(purchaseOrders.length + 1).padStart(4, '0')}`,
      status: 'draft',
      totalAmount: poFormTotal,
      supplierId: poForm.supplierId,
      supplierName: supplier?.name || 'Unknown',
      orderDate: new Date().toISOString().split('T')[0],
      expectedDate: poForm.expectedDate || undefined,
      items: poForm.items.map((item, idx) => ({
        id: `poi_new_${idx}`,
        productId: item.productId || undefined,
        productName: item.productName,
        quantity: item.quantity,
        unitCost: item.unitCost,
        totalCost: item.quantity * item.unitCost,
        receivedQty: 0,
      })),
    };
    setPurchaseOrders((prev) => [...prev, newPO]);
    setIsAddPOOpen(false);
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
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Supplier Management</h1>
            <p className="text-sm text-muted-foreground">Manage suppliers and purchase orders</p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 dark:bg-emerald-950/30">
              <Truck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">{suppliers.length} Suppliers</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-md bg-sky-50 px-2.5 py-1 dark:bg-sky-950/30">
              <ClipboardList className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
              <span className="text-sky-700 dark:text-sky-400 font-medium">{purchaseOrders.length} POs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="suppliers" className="flex flex-1 flex-col overflow-hidden">
        <div className="border-b px-4 sm:px-6">
          <TabsList className="h-10 w-full justify-start gap-0 bg-transparent p-0">
            <TabsTrigger
              value="suppliers"
              className="relative h-10 rounded-none border-b-2 border-transparent px-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <Truck className="mr-1.5 h-4 w-4" />
              <span className="hidden sm:inline">Suppliers</span>
              <Badge variant="secondary" className="ml-1.5 h-5 min-w-[20px] px-1 text-xs">{suppliers.length}</Badge>
            </TabsTrigger>
            <TabsTrigger
              value="purchase_orders"
              className="relative h-10 rounded-none border-b-2 border-transparent px-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <ClipboardList className="mr-1.5 h-4 w-4" />
              <span className="hidden sm:inline">Purchase Orders</span>
              <Badge variant="secondary" className="ml-1.5 h-5 min-w-[20px] px-1 text-xs">{purchaseOrders.length}</Badge>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ============================================ */}
        {/* TAB 1: SUPPLIERS */}
        {/* ============================================ */}
        <TabsContent value="suppliers" className="flex-1 overflow-auto p-4 sm:p-6">
          {/* Search / Add Bar */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search suppliers..."
                className="pl-8"
                value={supplierSearch}
                onChange={(e) => setSupplierSearch(e.target.value)}
              />
            </div>
            <Button onClick={openAddSupplier} className="gap-1.5">
              <Plus className="h-4 w-4" /> Add Supplier
            </Button>
          </div>

          {/* Suppliers Table */}
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Contact Person</TableHead>
                  <TableHead className="hidden lg:table-cell">Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Phone</TableHead>
                  <TableHead className="text-right hidden sm:table-cell">Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                      No suppliers found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSuppliers.map((supplier) => (
                    <TableRow
                      key={supplier.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setViewingSupplier(supplier)}
                    >
                      <TableCell>
                        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{supplier.code}</code>
                      </TableCell>
                      <TableCell className="font-medium">{supplier.name}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {supplier.contactPerson || '—'}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                        {supplier.email || '—'}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                        {supplier.phone || '—'}
                      </TableCell>
                      <TableCell className="text-right hidden sm:table-cell font-medium text-sm">
                        {formatCurrency(supplier.balance)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getStatusColor(supplier.isActive ? 'active' : 'cancelled')}>
                          {supplier.isActive ? 'Active' : 'Inactive'}
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
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setViewingSupplier(supplier); }}>
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openEditSupplier(supplier); }}>
                              <Pencil className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={(e) => { e.stopPropagation(); setDeletingSupplier(supplier); setIsDeleteSupplierOpen(true); }}
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
            Showing {filteredSuppliers.length} of {suppliers.length} suppliers
          </div>
        </TabsContent>

        {/* ============================================ */}
        {/* TAB 2: PURCHASE ORDERS */}
        {/* ============================================ */}
        <TabsContent value="purchase_orders" className="flex-1 overflow-auto p-4 sm:p-6">
          {/* Status Tabs & Add Button */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-1 overflow-x-auto">
              {(Object.keys(poStatusConfig) as POStatusTab[]).map((key) => (
                <Button
                  key={key}
                  variant={poStatusTab === key ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 gap-1 text-xs shrink-0"
                  onClick={() => setPOStatusTab(key)}
                >
                  {poStatusConfig[key].label}
                  {poCounts[key] !== undefined && (
                    <Badge variant="secondary" className="ml-1 h-4 min-w-[16px] px-1 text-[10px]">
                      {poCounts[key]}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
            <Button onClick={openAddPO} className="gap-1.5 shrink-0">
              <Plus className="h-4 w-4" /> New Purchase Order
            </Button>
          </div>

          {/* PO Table */}
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead className="hidden sm:table-cell">Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right hidden md:table-cell">Total Amount</TableHead>
                  <TableHead className="hidden lg:table-cell">Order Date</TableHead>
                  <TableHead className="hidden lg:table-cell">Expected Date</TableHead>
                  <TableHead className="w-[50px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPOs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                      No purchase orders found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPOs.map((po) => (
                    <TableRow
                      key={po.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setViewingPO(po)}
                    >
                      <TableCell>
                        <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium">{po.reference}</code>
                      </TableCell>
                      <TableCell className="font-medium text-sm">{po.supplierName}</TableCell>
                      <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                        {po.items.length} item{po.items.length !== 1 ? 's' : ''}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getStatusColor(po.status === 'partially_received' ? 'shipped' : po.status)}>
                          {po.status === 'partially_received' ? 'Partial' : po.status.charAt(0).toUpperCase() + po.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right hidden md:table-cell font-medium text-sm">
                        {formatCurrency(po.totalAmount)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                        {formatDate(po.orderDate)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                        {po.expectedDate ? formatDate(po.expectedDate) : '—'}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => { e.stopPropagation(); setViewingPO(po); }}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-3 text-xs text-muted-foreground">
            Showing {filteredPOs.length} of {purchaseOrders.length} purchase orders
          </div>
        </TabsContent>
      </Tabs>

      {/* ============================================ */}
      {/* ADD/EDIT SUPPLIER DIALOG */}
      {/* ============================================ */}
      <Dialog open={isAddSupplierOpen} onOpenChange={setIsAddSupplierOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>{editingSupplier ? 'Edit Supplier' : 'Add Supplier'}</DialogTitle>
            <DialogDescription>
              {editingSupplier ? 'Update supplier information' : 'Add a new supplier to the system'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sup-name">Name</Label>
                <Input
                  id="sup-name"
                  value={supplierForm.name}
                  onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
                  placeholder="Supplier name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sup-code">Code</Label>
                <Input
                  id="sup-code"
                  value={supplierForm.code}
                  onChange={(e) => setSupplierForm({ ...supplierForm, code: e.target.value })}
                  placeholder="SUP-XXX"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sup-contact">Contact Person</Label>
              <Input
                id="sup-contact"
                value={supplierForm.contactPerson}
                onChange={(e) => setSupplierForm({ ...supplierForm, contactPerson: e.target.value })}
                placeholder="Full name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sup-email">Email</Label>
                <Input
                  id="sup-email"
                  type="email"
                  value={supplierForm.email}
                  onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })}
                  placeholder="orders@supplier.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sup-phone">Phone</Label>
                <Input
                  id="sup-phone"
                  value={supplierForm.phone}
                  onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
                  placeholder="+1-555-0000"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sup-address">Address</Label>
              <Textarea
                id="sup-address"
                value={supplierForm.address}
                onChange={(e) => setSupplierForm({ ...supplierForm, address: e.target.value })}
                placeholder="Full address"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddSupplierOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveSupplier} disabled={!supplierForm.name || !supplierForm.code}>
              {editingSupplier ? 'Save Changes' : 'Add Supplier'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ============================================ */}
      {/* SUPPLIER DETAIL DIALOG */}
      {/* ============================================ */}
      <Dialog open={!!viewingSupplier} onOpenChange={(open) => !open && setViewingSupplier(null)}>
        <DialogContent className="sm:max-w-[560px]">
          {viewingSupplier && (() => {
            const s = viewingSupplier;
            const supplierPOs = purchaseOrders.filter((po) => po.supplierId === s.id);
            const totalPOAmount = supplierPOs.reduce((sum, po) => sum + po.totalAmount, 0);
            return (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <Truck className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <DialogTitle className="text-xl">{s.name}</DialogTitle>
                      <DialogDescription className="flex items-center gap-2 mt-1">
                        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{s.code}</code>
                        <Badge variant="secondary" className={getStatusColor(s.isActive ? 'active' : 'cancelled')}>
                          {s.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-4 mt-2">
                  {/* Contact Info */}
                  <div className="space-y-2">
                    {s.contactPerson && (
                      <div className="flex items-center gap-2 text-sm">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span>{s.contactPerson}</span>
                      </div>
                    )}
                    {s.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{s.email}</span>
                      </div>
                    )}
                    {s.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{s.phone}</span>
                      </div>
                    )}
                    {s.address && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span>{s.address}</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Balance</span>
                      </div>
                      <p className="text-lg font-bold">{formatCurrency(s.balance)}</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <ClipboardList className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Orders</span>
                      </div>
                      <p className="text-lg font-bold">{supplierPOs.length}</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Total POs</span>
                      </div>
                      <p className="text-lg font-bold">{formatCurrency(totalPOAmount)}</p>
                    </div>
                  </div>

                  {/* Recent POs for this supplier */}
                  {supplierPOs.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Recent Purchase Orders</h4>
                        <div className="space-y-2">
                          {supplierPOs.slice(0, 3).map((po) => (
                            <div
                              key={po.id}
                              className="flex items-center justify-between rounded-lg border p-2.5 text-sm cursor-pointer hover:bg-muted/50"
                              onClick={() => { setViewingSupplier(null); setTimeout(() => setViewingPO(po), 150); }}
                            >
                              <div className="flex items-center gap-2">
                                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{po.reference}</code>
                                <Badge variant="secondary" className={getStatusColor(po.status === 'partially_received' ? 'shipped' : po.status)}>
                                  {po.status === 'partially_received' ? 'Partial' : po.status.charAt(0).toUpperCase() + po.status.slice(1)}
                                </Badge>
                              </div>
                              <span className="font-medium">{formatCurrency(po.totalAmount)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* ============================================ */}
      {/* DELETE SUPPLIER DIALOG */}
      {/* ============================================ */}
      <Dialog open={isDeleteSupplierOpen} onOpenChange={setIsDeleteSupplierOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Delete Supplier</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{deletingSupplier?.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteSupplierOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteSupplier}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ============================================ */}
      {/* NEW PURCHASE ORDER DIALOG */}
      {/* ============================================ */}
      <Dialog open={isAddPOOpen} onOpenChange={setIsAddPOOpen}>
        <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Purchase Order</DialogTitle>
            <DialogDescription>Create a new purchase order for a supplier</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Supplier Select */}
            <div className="space-y-2">
              <Label>Supplier</Label>
              <Select
                value={poForm.supplierId}
                onValueChange={(v) => setPOForm({ ...poForm, supplierId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.filter((s) => s.isActive).map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      <div className="flex items-center gap-2">
                        <Truck className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{s.name}</span>
                        <code className="text-xs text-muted-foreground">({s.code})</code>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Expected Date */}
            <div className="space-y-2">
              <Label>Expected Delivery Date</Label>
              <Input
                type="date"
                value={poForm.expectedDate}
                onChange={(e) => setPOForm({ ...poForm, expectedDate: e.target.value })}
              />
            </div>

            <Separator />

            {/* Items */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-base font-semibold">Order Items</Label>
                <Button variant="outline" size="sm" className="gap-1" onClick={addPOItem}>
                  <Plus className="h-3.5 w-3.5" /> Add Item
                </Button>
              </div>

              {poForm.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-8 text-center">
                  <Package className="h-8 w-8 text-muted-foreground/30 mb-2" />
                  <p className="text-sm text-muted-foreground">No items added yet</p>
                  <p className="text-xs text-muted-foreground">Click &quot;Add Item&quot; to start building the order</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {poForm.items.map((item, idx) => (
                    <div key={idx} className="rounded-lg border p-3">
                      <div className="flex items-start gap-2">
                        <div className="flex-1 grid grid-cols-1 gap-2 sm:grid-cols-4">
                          <div className="sm:col-span-2 space-y-1">
                            <Label className="text-xs text-muted-foreground">Product</Label>
                            <Select
                              value={item.productId}
                              onValueChange={(v) => updatePOItem(idx, 'productId', v)}
                            >
                              <SelectTrigger className="h-9 text-sm">
                                <SelectValue placeholder="Select product" />
                              </SelectTrigger>
                              <SelectContent>
                                {mockProducts.map((p) => (
                                  <SelectItem key={p.id} value={p.id}>
                                    <span className="text-sm">{p.name}</span>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Quantity</Label>
                            <Input
                              type="number"
                              min={1}
                              className="h-9 text-sm"
                              value={item.quantity}
                              onChange={(e) => updatePOItem(idx, 'quantity', parseInt(e.target.value) || 0)}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Unit Cost</Label>
                            <Input
                              type="number"
                              min={0}
                              step={0.01}
                              className="h-9 text-sm"
                              value={item.unitCost}
                              onChange={(e) => updatePOItem(idx, 'unitCost', parseFloat(e.target.value) || 0)}
                            />
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 shrink-0 text-muted-foreground hover:text-red-600"
                          onClick={() => removePOItem(idx)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                      {item.productId && (
                        <div className="mt-2 flex justify-end">
                          <span className="text-xs text-muted-foreground">
                            Line total: <span className="font-medium">{formatCurrency(item.quantity * item.unitCost)}</span>
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={poForm.notes}
                onChange={(e) => setPOForm({ ...poForm, notes: e.target.value })}
                placeholder="Additional notes..."
                rows={2}
              />
            </div>

            {/* Grand Total */}
            {poForm.items.length > 0 && (
              <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                <span className="font-semibold">Grand Total</span>
                <span className="text-lg font-bold">{formatCurrency(poFormTotal)}</span>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddPOOpen(false)}>Cancel</Button>
            <Button onClick={handleSavePO} disabled={!poForm.supplierId || poForm.items.length === 0}>
              Create Purchase Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ============================================ */}
      {/* PO DETAIL DIALOG */}
      {/* ============================================ */}
      <Dialog open={!!viewingPO} onOpenChange={(open) => !open && setViewingPO(null)}>
        <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
          {viewingPO && (() => {
            const po = viewingPO;
            const supplier = suppliers.find((s) => s.id === po.supplierId);
            const totalReceived = po.items.reduce((s, i) => s + i.receivedQty, 0);
            const totalOrdered = po.items.reduce((s, i) => s + i.quantity, 0);
            return (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <DialogTitle className="text-lg">Purchase Order {po.reference}</DialogTitle>
                      <DialogDescription className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className={getStatusColor(po.status === 'partially_received' ? 'shipped' : po.status)}>
                          {po.status === 'partially_received' ? 'Partially Received' : po.status.charAt(0).toUpperCase() + po.status.slice(1)}
                        </Badge>
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-4 mt-2">
                  {/* PO Info */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground mb-0.5">Supplier</p>
                      <p className="font-medium">{po.supplierName}</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground mb-0.5">Order Date</p>
                      <p className="font-medium">{formatDate(po.orderDate)}</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground mb-0.5">Expected Date</p>
                      <p className="font-medium">{po.expectedDate ? formatDate(po.expectedDate) : '—'}</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground mb-0.5">Receiving Progress</p>
                      <p className="font-medium">{totalReceived} / {totalOrdered} items</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Items with received quantities */}
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Items ({po.items.length})</h4>
                    <div className="rounded-lg border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead className="text-center">Ordered</TableHead>
                            <TableHead className="text-center hidden sm:table-cell">Received</TableHead>
                            <TableHead className="text-right hidden sm:table-cell">Unit Cost</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {po.items.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="text-sm font-medium">{item.productName}</TableCell>
                              <TableCell className="text-center text-sm">{item.quantity}</TableCell>
                              <TableCell className="text-center text-sm hidden sm:table-cell">
                                <span className={item.receivedQty === item.quantity ? 'text-emerald-600 dark:text-emerald-400 font-medium' : item.receivedQty > 0 ? 'text-amber-600 dark:text-amber-400 font-medium' : 'text-muted-foreground'}>
                                  {item.receivedQty}
                                </span>
                              </TableCell>
                              <TableCell className="text-right text-sm hidden sm:table-cell">{formatCurrency(item.unitCost)}</TableCell>
                              <TableCell className="text-right text-sm font-medium">{formatCurrency(item.totalCost)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  <Separator />

                  {/* Total */}
                  <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                    <span className="font-semibold">Total Amount</span>
                    <span className="text-xl font-bold">{formatCurrency(po.totalAmount)}</span>
                  </div>

                  {/* Supplier Contact */}
                  {supplier && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Supplier Contact</h4>
                        <div className="space-y-1.5 text-sm">
                          {supplier.contactPerson && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Package className="h-3.5 w-3.5" /> {supplier.contactPerson}
                            </div>
                          )}
                          {supplier.email && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Mail className="h-3.5 w-3.5" /> {supplier.email}
                            </div>
                          )}
                          {supplier.phone && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Phone className="h-3.5 w-3.5" /> {supplier.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
