'use client';

import React, { useState, useMemo } from 'react';
import {
  Package, Search, Plus, MoreHorizontal, Pencil, Trash2, Eye,
  FolderOpen, Palette, LayoutGrid,
  Warehouse, ArrowUpDown, ArrowRight, ChevronDown,
  Truck, FileText, AlertTriangle,
  Smartphone, Laptop, Headphones, HardDrive, Wifi, Gamepad2, Disc, Printer,
} from 'lucide-react';
import { useInventoryStore } from '@/store';
import { formatCurrency, getStatusColor } from '@/lib/helpers';
import type { Product, Category, StockTransfer, PurchaseOrder } from '@/types';

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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

// ============================================
// ICON MAP FOR CATEGORIES
// ============================================
const iconMap: Record<string, React.ElementType> = {
  Smartphone, Laptop, Headphones, HardDrive, Wifi, Gamepad2, Disc, Printer,
  Package, FolderOpen,
};

// ============================================
// PRODUCT FORM DEFAULT
// ============================================
const defaultProductForm: {
  name: string; sku: string; barcode: string; categoryId: string; brandId: string;
  costPrice: string; sellingPrice: string; taxRate: string; unit: Product['unit'];
  trackStock: boolean; lowStockAlert: string; description: string;
} = {
  name: '', sku: '', barcode: '', categoryId: '', brandId: '',
  costPrice: '', sellingPrice: '', taxRate: '8.5', unit: 'piece',
  trackStock: true, lowStockAlert: '5', description: '',
};

// ============================================
// INVENTORY PAGE COMPONENT
// ============================================
export default function InventoryPage() {
  const {
    products, categories, brands, inventory, stockTransfers,
    purchaseOrders, suppliers,
    addProduct, updateProduct, deleteProduct,
    addCategory, updateCategory, deleteCategory,
    adjustStock, addStockTransfer, addPurchaseOrder,
  } = useInventoryStore();

  const branches = useMemo(() => {
    const branchMap = new Map<string, string>();
    inventory.forEach((inv) => branchMap.set(inv.branchId, inv.branchName));
    return Array.from(branchMap.entries()).map(([id, name]) => ({ id, name }));
  }, [inventory]);

  // ===== PRODUCTS TAB STATE =====
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState(defaultProductForm);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // ===== CATEGORIES TAB STATE =====
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', icon: 'Package', color: '#3b82f6' });
  const [isDeleteCategoryOpen, setIsDeleteCategoryOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  // ===== STOCK LEVELS TAB STATE =====
  const [stockSearch, setStockSearch] = useState('');
  const [stockBranchFilter, setStockBranchFilter] = useState('all');
  const [isAdjustStockOpen, setIsAdjustStockOpen] = useState(false);
  const [adjustForm, setAdjustForm] = useState({
    inventoryId: '', type: 'add' as 'add' | 'subtract', quantity: '', reason: '',
  });

  // ===== TRANSFERS TAB STATE =====
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [transferForm, setTransferForm] = useState({
    sourceBranchId: '', destBranchId: '', items: [] as { productId: string; productName: string; quantity: number }[],
    notes: '',
  });
  const [transferItemProduct, setTransferItemProduct] = useState('');
  const [transferItemQty, setTransferItemQty] = useState('');

  // ===== PURCHASE ORDERS TAB STATE =====
  const [isPODialogOpen, setIsPODialogOpen] = useState(false);
  const [poForm, setPoForm] = useState({
    supplierId: '',
    items: [] as { productId: string; productName: string; quantity: number; unitCost: number }[],
  });
  const [poItemProduct, setPoItemProduct] = useState('');
  const [poItemQty, setPoItemQty] = useState('');
  const [poItemCost, setPoItemCost] = useState('');

  // ============================================
  // FILTERED DATA
  // ============================================
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = productSearch === '' ||
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.sku.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.brandName?.toLowerCase().includes(productSearch.toLowerCase());
      const matchCategory = productCategoryFilter === 'all' || p.categoryId === productCategoryFilter;
      return matchSearch && matchCategory;
    });
  }, [products, productSearch, productCategoryFilter]);

  const filteredInventory = useMemo(() => {
    return inventory.filter((inv) => {
      const matchSearch = stockSearch === '' ||
        inv.productName.toLowerCase().includes(stockSearch.toLowerCase()) ||
        inv.sku.toLowerCase().includes(stockSearch.toLowerCase());
      const matchBranch = stockBranchFilter === 'all' || inv.branchId === stockBranchFilter;
      return matchSearch && matchBranch;
    });
  }, [inventory, stockSearch, stockBranchFilter]);

  // ============================================
  // PRODUCT HELPERS
  // ============================================
  const getProductStatus = (product: Product) => {
    if (!product.trackStock) return 'active';
    if (product.stockQuantity === 0) return 'out_of_stock';
    if (product.stockQuantity <= product.lowStockAlert) return 'low_stock';
    return 'in_stock';
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; className: string }> = {
      in_stock: { label: 'In Stock', className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
      low_stock: { label: 'Low Stock', className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
      out_of_stock: { label: 'Out of Stock', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
      active: { label: 'Active', className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
    };
    const c = config[status] || { label: status, className: 'bg-gray-100 text-gray-800' };
    return <Badge variant="secondary" className={c.className}>{c.label}</Badge>;
  };

  const getStockLevelColor = (available: number, quantity: number) => {
    if (quantity === 0) return 'text-red-600 dark:text-red-400 font-semibold';
    if (available <= 5) return 'text-amber-600 dark:text-amber-400 font-semibold';
    return 'text-emerald-600 dark:text-emerald-400 font-semibold';
  };

  const getStockLevelBg = (available: number, quantity: number) => {
    if (quantity === 0) return 'bg-red-50 dark:bg-red-950/20';
    if (available <= 5) return 'bg-amber-50 dark:bg-amber-950/20';
    return '';
  };

  // ============================================
  // PRODUCT DIALOG HANDLERS
  // ============================================
  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm(defaultProductForm);
    setIsProductDialogOpen(true);
  };

  const openEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      sku: product.sku,
      barcode: product.barcode || '',
      categoryId: product.categoryId,
      brandId: product.brandId || '',
      costPrice: String(product.costPrice),
      sellingPrice: String(product.sellingPrice),
      taxRate: String(product.taxRate),
      unit: product.unit,
      trackStock: product.trackStock,
      lowStockAlert: String(product.lowStockAlert),
      description: product.description || '',
    });
    setIsProductDialogOpen(true);
  };

  const handleSaveProduct = () => {
    const cat = categories.find((c) => c.id === productForm.categoryId);
    const brd = brands.find((b) => b.id === productForm.brandId);
    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: productForm.name,
        sku: productForm.sku,
        barcode: productForm.barcode || undefined,
        categoryId: productForm.categoryId,
        categoryName: cat?.name || '',
        brandId: productForm.brandId || undefined,
        brandName: brd?.name || undefined,
        costPrice: Number(productForm.costPrice),
        sellingPrice: Number(productForm.sellingPrice),
        taxRate: Number(productForm.taxRate),
        unit: productForm.unit,
        trackStock: productForm.trackStock,
        lowStockAlert: Number(productForm.lowStockAlert),
        description: productForm.description || undefined,
      });
    } else {
      const newProduct: Product = {
        id: `prod_${Date.now()}`,
        name: productForm.name,
        sku: productForm.sku,
        barcode: productForm.barcode || undefined,
        categoryId: productForm.categoryId,
        categoryName: cat?.name || '',
        brandId: productForm.brandId || undefined,
        brandName: brd?.name || undefined,
        costPrice: Number(productForm.costPrice),
        sellingPrice: Number(productForm.sellingPrice),
        taxRate: Number(productForm.taxRate),
        unit: productForm.unit,
        trackStock: productForm.trackStock,
        lowStockAlert: Number(productForm.lowStockAlert),
        isActive: true,
        stockQuantity: 0,
        description: productForm.description || undefined,
        createdAt: new Date().toISOString(),
      };
      addProduct(newProduct);
    }
    setIsProductDialogOpen(false);
  };

  const handleDeleteProduct = () => {
    if (deletingProduct) {
      deleteProduct(deletingProduct.id);
      setIsDeleteDialogOpen(false);
      setDeletingProduct(null);
    }
  };

  // ============================================
  // CATEGORY DIALOG HANDLERS
  // ============================================
  const openAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({ name: '', icon: 'Package', color: '#3b82f6' });
    setIsCategoryDialogOpen(true);
  };

  const openEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCategoryForm({ name: cat.name, icon: cat.icon || 'Package', color: cat.color || '#3b82f6' });
    setIsCategoryDialogOpen(true);
  };

  const handleSaveCategory = () => {
    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: categoryForm.name,
        icon: categoryForm.icon,
        color: categoryForm.color,
      });
    } else {
      const newCat: Category = {
        id: `cat_${Date.now()}`,
        name: categoryForm.name,
        icon: categoryForm.icon,
        color: categoryForm.color,
        productCount: 0,
        isActive: true,
        sortOrder: categories.length + 1,
      };
      addCategory(newCat);
    }
    setIsCategoryDialogOpen(false);
  };

  const handleDeleteCategory = () => {
    if (deletingCategory) {
      deleteCategory(deletingCategory.id);
      setIsDeleteCategoryOpen(false);
      setDeletingCategory(null);
    }
  };

  // ============================================
  // STOCK ADJUSTMENT HANDLERS
  // ============================================
  const handleAdjustStock = () => {
    const qty = Number(adjustForm.quantity);
    if (!qty || !adjustForm.inventoryId) return;
    const adjustment = adjustForm.type === 'add' ? qty : -qty;
    adjustStock(adjustForm.inventoryId, adjustment);
    setIsAdjustStockOpen(false);
    setAdjustForm({ inventoryId: '', type: 'add', quantity: '', reason: '' });
  };

  // ============================================
  // TRANSFER HANDLERS
  // ============================================
  const addTransferItem = () => {
    const prod = products.find((p) => p.id === transferItemProduct);
    if (!prod || !Number(transferItemQty)) return;
    setTransferForm((prev) => ({
      ...prev,
      items: [...prev.items, { productId: prod.id, productName: prod.name, quantity: Number(transferItemQty) }],
    }));
    setTransferItemProduct('');
    setTransferItemQty('');
  };

  const removeTransferItem = (idx: number) => {
    setTransferForm((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== idx) }));
  };

  const handleSaveTransfer = () => {
    if (!transferForm.sourceBranchId || !transferForm.destBranchId || transferForm.items.length === 0) return;
    const sourceBranch = branches.find((b) => b.id === transferForm.sourceBranchId);
    const destBranch = branches.find((b) => b.id === transferForm.destBranchId);
    const newTransfer: StockTransfer = {
      id: `st_${Date.now()}`,
      reference: `STR-2026-${String(stockTransfers.length + 1).padStart(4, '0')}`,
      status: 'pending',
      sourceBranchId: transferForm.sourceBranchId,
      sourceBranchName: sourceBranch?.name || '',
      destBranchId: transferForm.destBranchId,
      destBranchName: destBranch?.name || '',
      items: transferForm.items.map((item, idx) => ({
        id: `sti_${Date.now()}_${idx}`,
        ...item,
      })),
      notes: transferForm.notes || undefined,
      createdAt: new Date().toISOString().split('T')[0],
    };
    addStockTransfer(newTransfer);
    setIsTransferDialogOpen(false);
    setTransferForm({ sourceBranchId: '', destBranchId: '', items: [], notes: '' });
  };

  // ============================================
  // PURCHASE ORDER HANDLERS
  // ============================================
  const addPOItem = () => {
    const prod = products.find((p) => p.id === poItemProduct);
    if (!prod || !Number(poItemQty) || !Number(poItemCost)) return;
    setPoForm((prev) => ({
      ...prev,
      items: [...prev.items, {
        productId: prod.id,
        productName: prod.name,
        quantity: Number(poItemQty),
        unitCost: Number(poItemCost),
      }],
    }));
    setPoItemProduct('');
    setPoItemQty('');
    setPoItemCost('');
  };

  const removePOItem = (idx: number) => {
    setPoForm((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== idx) }));
  };

  const handleSavePO = () => {
    if (!poForm.supplierId || poForm.items.length === 0) return;
    const supplier = suppliers.find((s) => s.id === poForm.supplierId);
    const totalAmount = poForm.items.reduce((sum, item) => sum + item.quantity * item.unitCost, 0);
    const newPO: PurchaseOrder = {
      id: `po_${Date.now()}`,
      reference: `PO-2026-${String(purchaseOrders.length + 1).padStart(4, '0')}`,
      status: 'draft',
      totalAmount,
      supplierId: poForm.supplierId,
      supplierName: supplier?.name || '',
      orderDate: new Date().toISOString().split('T')[0],
      items: poForm.items.map((item, idx) => ({
        id: `poi_${Date.now()}_${idx}`,
        ...item,
        totalCost: item.quantity * item.unitCost,
        receivedQty: 0,
      })),
    };
    addPurchaseOrder(newPO);
    setIsPODialogOpen(false);
    setPoForm({ supplierId: '', items: [] });
  };

  // ============================================
  // SUMMARY STATS
  // ============================================
  const totalProducts = products.length;
  const lowStockCount = products.filter((p) => p.trackStock && p.stockQuantity > 0 && p.stockQuantity <= p.lowStockAlert).length;
  const outOfStockCount = products.filter((p) => p.trackStock && p.stockQuantity === 0).length;
  const totalCategories = categories.length;

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b bg-background px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Inventory Management</h1>
            <p className="text-sm text-muted-foreground">Manage products, stock levels, transfers, and purchase orders</p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 dark:bg-emerald-950/30">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">{totalProducts} Products</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-1 dark:bg-amber-950/30">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              <span className="text-amber-700 dark:text-amber-400 font-medium">{lowStockCount} Low</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-md bg-red-50 px-2.5 py-1 dark:bg-red-950/30">
              <div className="h-2 w-2 rounded-full bg-red-500" />
              <span className="text-red-700 dark:text-red-400 font-medium">{outOfStockCount} Out</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="products" className="flex flex-1 flex-col overflow-hidden">
        <div className="border-b px-4 sm:px-6">
          <TabsList className="h-10 w-full justify-start gap-0 bg-transparent p-0">
            <TabsTrigger
              value="products"
              className="relative h-10 rounded-none border-b-2 border-transparent px-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <Package className="mr-1.5 h-4 w-4" />
              <span className="hidden sm:inline">Products</span>
              <Badge variant="secondary" className="ml-1.5 h-5 min-w-[20px] px-1 text-xs">{totalProducts}</Badge>
            </TabsTrigger>
            <TabsTrigger
              value="categories"
              className="relative h-10 rounded-none border-b-2 border-transparent px-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <FolderOpen className="mr-1.5 h-4 w-4" />
              <span className="hidden sm:inline">Categories</span>
              <Badge variant="secondary" className="ml-1.5 h-5 min-w-[20px] px-1 text-xs">{totalCategories}</Badge>
            </TabsTrigger>
            <TabsTrigger
              value="stock"
              className="relative h-10 rounded-none border-b-2 border-transparent px-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <Warehouse className="mr-1.5 h-4 w-4" />
              <span className="hidden sm:inline">Stock Levels</span>
            </TabsTrigger>
            <TabsTrigger
              value="transfers"
              className="relative h-10 rounded-none border-b-2 border-transparent px-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <ArrowRight className="mr-1.5 h-4 w-4" />
              <span className="hidden sm:inline">Transfers</span>
              <Badge variant="secondary" className="ml-1.5 h-5 min-w-[20px] px-1 text-xs">{stockTransfers.length}</Badge>
            </TabsTrigger>
            <TabsTrigger
              value="purchase-orders"
              className="relative h-10 rounded-none border-b-2 border-transparent px-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <FileText className="mr-1.5 h-4 w-4" />
              <span className="hidden sm:inline">Purchase Orders</span>
              <Badge variant="secondary" className="ml-1.5 h-5 min-w-[20px] px-1 text-xs">{purchaseOrders.length}</Badge>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ============================================ */}
        {/* TAB 1: PRODUCTS */}
        {/* ============================================ */}
        <TabsContent value="products" className="flex-1 overflow-auto p-4 sm:p-6">
          {/* Search / Filter Bar */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-8"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                />
              </div>
              <Select value={productCategoryFilter} onValueChange={setProductCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={openAddProduct} className="gap-1.5">
              <Plus className="h-4 w-4" /> Add Product
            </Button>
          </div>

          {/* Products Table */}
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[220px]">Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="hidden lg:table-cell">Brand</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-center">Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                      No products found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => {
                    const status = getProductStatus(product);
                    return (
                      <TableRow key={product.id} className={getStockLevelBg(
                        product.stockQuantity - (inventory.find((i) => i.productId === product.id)?.reserved || 0),
                        product.stockQuantity,
                      )}>
                        <TableCell>
                          <div className="font-medium">{product.name}</div>
                          {product.barcode && (
                            <div className="text-xs text-muted-foreground">{product.barcode}</div>
                          )}
                        </TableCell>
                        <TableCell>
                          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{product.sku}</code>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline" className="text-xs">{product.categoryName}</Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-muted-foreground">
                          {product.brandName || '-'}
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(product.costPrice)}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(product.sellingPrice)}</TableCell>
                        <TableCell className="text-center">
                          <span className={getStockLevelColor(
                            product.stockQuantity - (inventory.find((i) => i.productId === product.id)?.reserved || 0),
                            product.stockQuantity,
                          )}>
                            {product.trackStock ? product.stockQuantity : '∞'}
                          </span>
                        </TableCell>
                        <TableCell>{getStatusBadge(status)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setViewingProduct(product)}>
                                <Eye className="mr-2 h-4 w-4" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEditProduct(product)}>
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() => { setDeletingProduct(product); setIsDeleteDialogOpen(true); }}
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

          {/* Product count */}
          <div className="mt-3 text-xs text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </TabsContent>

        {/* ============================================ */}
        {/* TAB 2: CATEGORIES */}
        {/* ============================================ */}
        <TabsContent value="categories" className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Product Categories</h2>
            <Button onClick={openAddCategory} className="gap-1.5">
              <Plus className="h-4 w-4" /> Add Category
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((cat) => {
              const IconComp = iconMap[cat.icon || 'Package'] || Package;
              return (
                <Card key={cat.id} className="group relative overflow-hidden transition-shadow hover:shadow-md">
                  <div
                    className="h-1.5 w-full"
                    style={{ backgroundColor: cat.color || '#3b82f6' }}
                  />
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-lg"
                          style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                        >
                          <IconComp className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{cat.name}</h3>
                          <p className="text-sm text-muted-foreground">{cat.productCount} products</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditCategory(cat)}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => { setDeletingCategory(cat); setIsDeleteCategoryOpen(true); }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        <Palette className="mr-1 h-3 w-3" style={{ color: cat.color }} />
                        {cat.color}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Sort: {cat.sortOrder}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* ============================================ */}
        {/* TAB 3: STOCK LEVELS */}
        {/* ============================================ */}
        <TabsContent value="stock" className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search inventory..."
                  className="pl-8"
                  value={stockSearch}
                  onChange={(e) => setStockSearch(e.target.value)}
                />
              </div>
              <Select value={stockBranchFilter} onValueChange={setStockBranchFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
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
            <Button onClick={() => setIsAdjustStockOpen(true)} className="gap-1.5">
              <ArrowUpDown className="h-4 w-4" /> Adjust Stock
            </Button>
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="hidden md:table-cell">Branch</TableHead>
                  <TableHead className="text-center">In Stock</TableHead>
                  <TableHead className="text-center">Reserved</TableHead>
                  <TableHead className="text-center">Available</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      No inventory records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInventory.map((inv) => (
                    <TableRow key={inv.id} className={getStockLevelBg(inv.available, inv.quantity)}>
                      <TableCell className="font-medium">{inv.productName}</TableCell>
                      <TableCell>
                        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{inv.sku}</code>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">{inv.branchName}</TableCell>
                      <TableCell className="text-center">{inv.quantity}</TableCell>
                      <TableCell className="text-center text-muted-foreground">{inv.reserved}</TableCell>
                      <TableCell className="text-center">
                        <span className={getStockLevelColor(inv.available, inv.quantity)}>
                          {inv.available}
                        </span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {inv.quantity === 0 ? (
                          <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Out of Stock</Badge>
                        ) : inv.available <= 5 ? (
                          <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">Low Stock</Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">Good</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-3 text-xs text-muted-foreground">
            Showing {filteredInventory.length} inventory records
          </div>
        </TabsContent>

        {/* ============================================ */}
        {/* TAB 4: TRANSFERS */}
        {/* ============================================ */}
        <TabsContent value="transfers" className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Stock Transfers</h2>
            <Button onClick={() => setIsTransferDialogOpen(true)} className="gap-1.5">
              <Plus className="h-4 w-4" /> New Transfer
            </Button>
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead className="hidden sm:table-cell">From</TableHead>
                  <TableHead className="hidden sm:table-cell">To</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="w-[50px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stockTransfers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      No stock transfers found.
                    </TableCell>
                  </TableRow>
                ) : (
                  stockTransfers.map((st) => (
                    <TableRow key={st.id}>
                      <TableCell>
                        <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium">{st.reference}</code>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{st.sourceBranchName}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-1">
                          <ArrowRight className="h-3 w-3 text-muted-foreground" />
                          {st.destBranchName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">{st.items.length} item{st.items.length !== 1 ? 's' : ''}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getStatusColor(st.status)}>
                          {st.status.charAt(0).toUpperCase() + st.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">{st.createdAt}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" /> View Details
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
        </TabsContent>

        {/* ============================================ */}
        {/* TAB 5: PURCHASE ORDERS */}
        {/* ============================================ */}
        <TabsContent value="purchase-orders" className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Purchase Orders</h2>
            <Button onClick={() => setIsPODialogOpen(true)} className="gap-1.5">
              <Plus className="h-4 w-4" /> New PO
            </Button>
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="hidden md:table-cell">Order Date</TableHead>
                  <TableHead className="hidden lg:table-cell">Expected</TableHead>
                  <TableHead className="w-[50px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchaseOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      No purchase orders found.
                    </TableCell>
                  </TableRow>
                ) : (
                  purchaseOrders.map((po) => (
                    <TableRow key={po.id}>
                      <TableCell>
                        <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium">{po.reference}</code>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{po.supplierName}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getStatusColor(po.status)}>
                          {po.status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(po.totalAmount)}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">{po.orderDate}</TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground">{po.expectedDate || '-'}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" /> Mark as Sent
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
        </TabsContent>
      </Tabs>

      {/* ============================================ */}
      {/* DIALOGS */}
      {/* ============================================ */}

      {/* Add/Edit Product Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>
              {editingProduct ? 'Update product information below.' : 'Fill in the details to create a new product.'}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <Label htmlFor="prod-name">Product Name *</Label>
                  <Input id="prod-name" value={productForm.name} onChange={(e) => setProductForm((f) => ({ ...f, name: e.target.value }))} placeholder="Product name" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <Label htmlFor="prod-sku">SKU *</Label>
                  <Input id="prod-sku" value={productForm.sku} onChange={(e) => setProductForm((f) => ({ ...f, sku: e.target.value }))} placeholder="e.g. APL-IP15PM-256" />
                </div>
              </div>
              <div>
                <Label htmlFor="prod-barcode">Barcode</Label>
                <Input id="prod-barcode" value={productForm.barcode} onChange={(e) => setProductForm((f) => ({ ...f, barcode: e.target.value }))} placeholder="EAN/UPC barcode" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category *</Label>
                  <Select value={productForm.categoryId} onValueChange={(v) => setProductForm((f) => ({ ...f, categoryId: v }))}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Brand</Label>
                  <Select value={productForm.brandId} onValueChange={(v) => setProductForm((f) => ({ ...f, brandId: v }))}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select brand" /></SelectTrigger>
                    <SelectContent>
                      {brands.map((brd) => (
                        <SelectItem key={brd.id} value={brd.id}>{brd.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="prod-cost">Cost Price *</Label>
                  <Input id="prod-cost" type="number" value={productForm.costPrice} onChange={(e) => setProductForm((f) => ({ ...f, costPrice: e.target.value }))} placeholder="0.00" />
                </div>
                <div>
                  <Label htmlFor="prod-price">Selling Price *</Label>
                  <Input id="prod-price" type="number" value={productForm.sellingPrice} onChange={(e) => setProductForm((f) => ({ ...f, sellingPrice: e.target.value }))} placeholder="0.00" />
                </div>
                <div>
                  <Label htmlFor="prod-tax">Tax Rate %</Label>
                  <Input id="prod-tax" type="number" value={productForm.taxRate} onChange={(e) => setProductForm((f) => ({ ...f, taxRate: e.target.value }))} placeholder="8.5" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Unit</Label>
                  <Select value={productForm.unit} onValueChange={(v) => setProductForm((f) => ({ ...f, unit: v as Product['unit'] } as typeof defaultProductForm))}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="piece">Piece</SelectItem>
                      <SelectItem value="kg">Kilogram</SelectItem>
                      <SelectItem value="liter">Liter</SelectItem>
                      <SelectItem value="box">Box</SelectItem>
                      <SelectItem value="pack">Pack</SelectItem>
                      <SelectItem value="dozen">Dozen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="prod-lowstock">Low Stock Alert</Label>
                  <Input id="prod-lowstock" type="number" value={productForm.lowStockAlert} onChange={(e) => setProductForm((f) => ({ ...f, lowStockAlert: e.target.value }))} placeholder="5" />
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <Label htmlFor="prod-track" className="cursor-pointer">Track Stock</Label>
                  <p className="text-xs text-muted-foreground">Enable inventory tracking for this product</p>
                </div>
                <Switch id="prod-track" checked={productForm.trackStock} onCheckedChange={(v) => setProductForm((f) => ({ ...f, trackStock: v }))} />
              </div>
              <div>
                <Label htmlFor="prod-desc">Description</Label>
                <Textarea id="prod-desc" value={productForm.description} onChange={(e) => setProductForm((f) => ({ ...f, description: e.target.value }))} placeholder="Product description..." className="min-h-[80px]" />
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProductDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSaveProduct}
              disabled={!productForm.name || !productForm.sku || !productForm.categoryId || !productForm.costPrice || !productForm.sellingPrice}
            >
              {editingProduct ? 'Save Changes' : 'Create Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Product Details Dialog */}
      <Dialog open={!!viewingProduct} onOpenChange={() => setViewingProduct(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{viewingProduct?.name}</DialogTitle>
            <DialogDescription>Product Details</DialogDescription>
          </DialogHeader>
          {viewingProduct && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">SKU</span>
                  <p className="font-mono text-xs mt-0.5">{viewingProduct.sku}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Barcode</span>
                  <p className="font-mono text-xs mt-0.5">{viewingProduct.barcode || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Category</span>
                  <p className="font-medium mt-0.5">{viewingProduct.categoryName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Brand</span>
                  <p className="font-medium mt-0.5">{viewingProduct.brandName || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Cost Price</span>
                  <p className="font-medium mt-0.5">{formatCurrency(viewingProduct.costPrice)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Selling Price</span>
                  <p className="font-medium mt-0.5">{formatCurrency(viewingProduct.sellingPrice)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Margin</span>
                  <p className="font-medium mt-0.5">
                    {formatCurrency(viewingProduct.sellingPrice - viewingProduct.costPrice)}
                    <span className="text-xs text-muted-foreground ml-1">
                      ({((viewingProduct.sellingPrice - viewingProduct.costPrice) / viewingProduct.costPrice * 100).toFixed(1)}%)
                    </span>
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Tax Rate</span>
                  <p className="font-medium mt-0.5">{viewingProduct.taxRate}%</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Stock Quantity</span>
                  <p className={`font-medium mt-0.5 ${getStockLevelColor(viewingProduct.stockQuantity, viewingProduct.stockQuantity)}`}>
                    {viewingProduct.trackStock ? viewingProduct.stockQuantity : 'Unlimited'}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Low Stock Alert</span>
                  <p className="font-medium mt-0.5">{viewingProduct.lowStockAlert}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Unit</span>
                  <p className="font-medium mt-0.5 capitalize">{viewingProduct.unit}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status</span>
                  <div className="mt-0.5">{getStatusBadge(getProductStatus(viewingProduct))}</div>
                </div>
              </div>
              {viewingProduct.description && (
                <>
                  <Separator />
                  <div className="text-sm">
                    <span className="text-muted-foreground">Description</span>
                    <p className="mt-1">{viewingProduct.description}</p>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Product Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{deletingProduct?.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Category Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
            <DialogDescription>
              {editingCategory ? 'Update category details.' : 'Create a new product category.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div>
              <Label htmlFor="cat-name">Category Name *</Label>
              <Input id="cat-name" value={categoryForm.name} onChange={(e) => setCategoryForm((f) => ({ ...f, name: e.target.value }))} placeholder="Category name" />
            </div>
            <div>
              <Label>Icon</Label>
              <Select value={categoryForm.icon} onValueChange={(v) => setCategoryForm((f) => ({ ...f, icon: v }))}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(iconMap).map(([name, _]) => (
                    <SelectItem key={name} value={name}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="cat-color">Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={categoryForm.color}
                  onChange={(e) => setCategoryForm((f) => ({ ...f, color: e.target.value }))}
                  className="h-9 w-12 cursor-pointer rounded border"
                />
                <Input
                  value={categoryForm.color}
                  onChange={(e) => setCategoryForm((f) => ({ ...f, color: e.target.value }))}
                  className="flex-1"
                />
              </div>
            </div>
            {categoryForm.name && (
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground mb-2">Preview</p>
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${categoryForm.color}15`, color: categoryForm.color }}
                  >
                    {React.createElement(iconMap[categoryForm.icon] || Package, { className: 'h-4 w-4' })}
                  </div>
                  <span className="font-medium">{categoryForm.name}</span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveCategory} disabled={!categoryForm.name}>
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Category Confirmation Dialog */}
      <Dialog open={isDeleteCategoryOpen} onOpenChange={setIsDeleteCategoryOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{deletingCategory?.name}</strong>? Products in this category will not be deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteCategoryOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteCategory}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Adjust Stock Dialog */}
      <Dialog open={isAdjustStockOpen} onOpenChange={setIsAdjustStockOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Adjust Stock</DialogTitle>
            <DialogDescription>Add or subtract stock quantity for a product at a specific branch.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div>
              <Label>Inventory Item *</Label>
              <Select value={adjustForm.inventoryId} onValueChange={(v) => setAdjustForm((f) => ({ ...f, inventoryId: v }))}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select item" /></SelectTrigger>
                <SelectContent>
                  {inventory.map((inv) => (
                    <SelectItem key={inv.id} value={inv.id}>
                      {inv.productName} ({inv.branchName}) - Stock: {inv.quantity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Adjustment Type *</Label>
              <Select value={adjustForm.type} onValueChange={(v) => setAdjustForm((f) => ({ ...f, type: v as 'add' | 'subtract' }))}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">Add Stock (+)</SelectItem>
                  <SelectItem value="subtract">Subtract Stock (-)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="adjust-qty">Quantity *</Label>
              <Input id="adjust-qty" type="number" min="1" value={adjustForm.quantity} onChange={(e) => setAdjustForm((f) => ({ ...f, quantity: e.target.value }))} placeholder="Enter quantity" />
            </div>
            <div>
              <Label htmlFor="adjust-reason">Reason</Label>
              <Select onValueChange={(v) => setAdjustForm((f) => ({ ...f, reason: v }))}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select reason" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="received">Goods Received</SelectItem>
                  <SelectItem value="returned">Customer Return</SelectItem>
                  <SelectItem value="damaged">Damaged/Write-off</SelectItem>
                  <SelectItem value="correction">Stock Correction</SelectItem>
                  <SelectItem value="count">Stock Count Adjustment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAdjustStockOpen(false)}>Cancel</Button>
            <Button onClick={handleAdjustStock} disabled={!adjustForm.inventoryId || !Number(adjustForm.quantity)}>
              Apply Adjustment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Transfer Dialog */}
      <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>New Stock Transfer</DialogTitle>
            <DialogDescription>Create a new stock transfer between branches.</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Source Branch *</Label>
                  <Select value={transferForm.sourceBranchId} onValueChange={(v) => setTransferForm((f) => ({ ...f, sourceBranchId: v }))}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="From" /></SelectTrigger>
                    <SelectContent>
                      {branches.map((b) => (
                        <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Destination Branch *</Label>
                  <Select value={transferForm.destBranchId} onValueChange={(v) => setTransferForm((f) => ({ ...f, destBranchId: v }))}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="To" /></SelectTrigger>
                    <SelectContent>
                      {branches.filter((b) => b.id !== transferForm.sourceBranchId).map((b) => (
                        <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Separator />
              <div>
                <Label className="text-sm font-medium">Add Items</Label>
                <div className="mt-2 flex gap-2">
                  <Select value={transferItemProduct} onValueChange={setTransferItemProduct}>
                    <SelectTrigger className="flex-1"><SelectValue placeholder="Select product" /></SelectTrigger>
                    <SelectContent>
                      {products.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    className="w-20"
                    value={transferItemQty}
                    onChange={(e) => setTransferItemQty(e.target.value)}
                  />
                  <Button variant="outline" size="icon" onClick={addTransferItem} disabled={!transferItemProduct || !Number(transferItemQty)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {transferForm.items.length > 0 && (
                <div className="space-y-2">
                  {transferForm.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded-md border px-3 py-2">
                      <div>
                        <p className="text-sm font-medium">{item.productName}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeTransferItem(idx)}>
                        <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <div>
                <Label htmlFor="transfer-notes">Notes</Label>
                <Textarea id="transfer-notes" value={transferForm.notes} onChange={(e) => setTransferForm((f) => ({ ...f, notes: e.target.value }))} placeholder="Optional notes..." />
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTransferDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveTransfer} disabled={!transferForm.sourceBranchId || !transferForm.destBranchId || transferForm.items.length === 0}>
              Create Transfer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Purchase Order Dialog */}
      <Dialog open={isPODialogOpen} onOpenChange={setIsPODialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>New Purchase Order</DialogTitle>
            <DialogDescription>Create a new purchase order for a supplier.</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="grid gap-4 py-2">
              <div>
                <Label>Supplier *</Label>
                <Select value={poForm.supplierId} onValueChange={(v) => setPoForm((f) => ({ ...f, supplierId: v }))}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Select supplier" /></SelectTrigger>
                  <SelectContent>
                    {suppliers.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div>
                <Label className="text-sm font-medium">Add Items</Label>
                <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                  <Select value={poItemProduct} onValueChange={(v) => {
                    setPoItemProduct(v);
                    const prod = products.find((p) => p.id === v);
                    if (prod) setPoItemCost(String(prod.costPrice));
                  }}>
                    <SelectTrigger className="flex-1"><SelectValue placeholder="Select product" /></SelectTrigger>
                    <SelectContent>
                      {products.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input type="number" min="1" placeholder="Qty" className="w-20" value={poItemQty} onChange={(e) => setPoItemQty(e.target.value)} />
                  <Input type="number" min="0" placeholder="Unit Cost" className="w-28" value={poItemCost} onChange={(e) => setPoItemCost(e.target.value)} />
                  <Button variant="outline" size="icon" onClick={addPOItem} disabled={!poItemProduct || !Number(poItemQty) || !Number(poItemCost)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {poForm.items.length > 0 && (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-center">Qty</TableHead>
                        <TableHead className="text-right">Unit Cost</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="w-[40px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {poForm.items.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="text-sm">{item.productName}</TableCell>
                          <TableCell className="text-center">{item.quantity}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.unitCost)}</TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(item.quantity * item.unitCost)}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removePOItem(idx)}>
                              <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-semibold">Total</TableCell>
                        <TableCell className="text-right font-bold">
                          {formatCurrency(poForm.items.reduce((sum, item) => sum + item.quantity * item.unitCost, 0))}
                        </TableCell>
                        <TableCell />
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPODialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSavePO} disabled={!poForm.supplierId || poForm.items.length === 0}>
              Create Purchase Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
