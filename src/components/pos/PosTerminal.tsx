'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  Search,
  ScanBarcode,
  Plus,
  Minus,
  Trash2,
  X,
  UserCircle,
  Banknote,
  CreditCard,
  Smartphone,
  Building2,
  QrCode,
  Receipt,
  Printer,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Loader2,
  Package,
} from 'lucide-react';
import { usePosStore } from '@/store';
import { mockProducts, mockCategories, mockCustomers } from '@/data/mockData';
import { formatCurrency } from '@/lib/helpers';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { Product, PaymentMethod } from '@/types';

// ============================================
// PAYMENT METHOD CONFIG
// ============================================

const paymentMethods: { value: PaymentMethod; label: string; icon: React.ElementType }[] = [
  { value: 'cash', label: 'Cash', icon: Banknote },
  { value: 'card', label: 'Card', icon: CreditCard },
  { value: 'mobile_money', label: 'Mobile Money', icon: Smartphone },
  { value: 'bank_transfer', label: 'Bank Transfer', icon: Building2 },
  { value: 'qr', label: 'QR Pay', icon: QrCode },
];

// ============================================
// PRODUCT CARD
// ============================================

function ProductCard({ product, onAdd }: { product: Product; onAdd: (p: Product) => void }) {
  const isLowStock = product.trackStock && product.stockQuantity > 0 && product.stockQuantity <= product.lowStockAlert;
  const isOutOfStock = product.trackStock && product.stockQuantity === 0;

  return (
    <button
      onClick={() => !isOutOfStock && onAdd(product)}
      disabled={isOutOfStock}
      className={`group relative flex flex-col items-start gap-1.5 rounded-xl border bg-card p-3 text-left transition-all duration-150
        ${isOutOfStock
          ? 'cursor-not-allowed opacity-50'
          : 'cursor-pointer hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-500/10 active:scale-[0.97] dark:hover:border-emerald-700'
        }`}
    >
      {/* Product icon / visual */}
      <div className="flex w-full items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
          <Package className="h-4 w-4" />
        </div>
        {product.trackStock && (
          <Badge
            variant={isOutOfStock ? 'destructive' : isLowStock ? 'destructive' : 'secondary'}
            className={`text-[10px] px-1.5 py-0 ${
              isLowStock && !isOutOfStock ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800' : ''
            } ${isOutOfStock ? '' : ''}`}
          >
            {isOutOfStock ? 'Out' : isLowStock ? 'Low' : product.stockQuantity}
          </Badge>
        )}
      </div>

      {/* Product name */}
      <p className="w-full truncate text-sm font-medium leading-tight text-foreground">
        {product.name}
      </p>

      {/* SKU */}
      <p className="text-[11px] text-muted-foreground">{product.sku}</p>

      {/* Price */}
      <p className="mt-auto text-base font-bold text-emerald-600 dark:text-emerald-400">
        {formatCurrency(product.sellingPrice)}
      </p>
    </button>
  );
}

// ============================================
// CART ITEM ROW
// ============================================

function CartItemRow({
  item,
  onUpdateQuantity,
  onUpdateDiscount,
  onRemove,
}: {
  item: import('@/types').CartItem;
  onUpdateQuantity: (id: string, qty: number) => void;
  onUpdateDiscount: (id: string, discount: number) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border bg-card p-3 transition-all">
      {/* Top row: name + remove */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium leading-tight">{item.name}</p>
          <p className="text-[11px] text-muted-foreground">{formatCurrency(item.price)} each</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
          onClick={() => onRemove(item.id)}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Bottom row: qty controls + discount + line total */}
      <div className="flex items-center gap-2">
        {/* Quantity controls */}
        <div className="flex items-center rounded-md border bg-background">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-none rounded-l-md"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="flex h-8 w-9 items-center justify-center border-x text-sm font-semibold">
            {item.quantity}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-none rounded-r-md"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        {/* Discount input */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-muted-foreground">Disc:</span>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={item.discount || ''}
            onChange={(e) => onUpdateDiscount(item.id, parseFloat(e.target.value) || 0)}
            className="h-8 w-16 border-dashed text-xs text-center"
            placeholder="0.00"
          />
        </div>

        {/* Line total */}
        <p className="ml-auto text-sm font-bold text-foreground">
          {formatCurrency(item.price * item.quantity - item.discount + item.tax)}
        </p>
      </div>
    </div>
  );
}

// ============================================
// CHECKOUT MODAL
// ============================================

function CheckoutModal() {
  const {
    cart,
    isCheckoutOpen,
    setCheckoutOpen,
    setPaymentMethod,
    completeSale,
  } = usePosStore();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('cash');
  const [cashReceived, setCashReceived] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCardProcessing, setIsCardProcessing] = useState(false);

  const totalDue = cart.totalAmount;
  const change = cashReceived ? Math.max(0, parseFloat(cashReceived) - totalDue) : 0;
  const isCashSufficient = cashReceived ? parseFloat(cashReceived) >= totalDue : false;

  const handleMethodChange = useCallback(
    (method: PaymentMethod) => {
      setSelectedMethod(method);
      setPaymentMethod(method);
      setCashReceived('');
      setIsCardProcessing(false);
    },
    [setPaymentMethod]
  );

  const handleCompleteSale = useCallback(async () => {
    if (selectedMethod === 'card') {
      setIsCardProcessing(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsCardProcessing(false);
    }
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    completeSale();
    setIsProcessing(false);
    setCashReceived('');
  }, [selectedMethod, completeSale]);

  const handleClose = useCallback(() => {
    setCheckoutOpen(false);
    setCashReceived('');
    setIsCardProcessing(false);
  }, [setCheckoutOpen]);

  return (
    <Dialog open={isCheckoutOpen} onOpenChange={setCheckoutOpen}>
      <DialogContent className="sm:max-w-md" showCloseButton={!isProcessing && !isCardProcessing}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <CreditCard className="h-5 w-5 text-emerald-600" />
            Checkout
          </DialogTitle>
          <DialogDescription>Choose a payment method and complete the sale.</DialogDescription>
        </DialogHeader>

        {/* Amount Due */}
        <div className="rounded-xl bg-emerald-50 p-4 text-center dark:bg-emerald-950/30">
          <p className="text-sm text-emerald-600 dark:text-emerald-400">Amount Due</p>
          <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">
            {formatCurrency(totalDue)}
          </p>
        </div>

        {/* Payment Method Selection */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Payment Method</p>
          <RadioGroup
            value={selectedMethod}
            onValueChange={(v) => handleMethodChange(v as PaymentMethod)}
            className="grid grid-cols-2 gap-2"
          >
            {paymentMethods.map((pm) => {
              const Icon = pm.icon;
              return (
                <label
                  key={pm.value}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition-all
                    ${
                      selectedMethod === pm.value
                        ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500 dark:border-emerald-600 dark:bg-emerald-950/30 dark:ring-emerald-600'
                        : 'hover:bg-accent'
                    }`}
                >
                  <RadioGroupItem value={pm.value} className="sr-only" />
                  <Icon className={`h-4 w-4 ${selectedMethod === pm.value ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`} />
                  <span className={`text-sm font-medium ${selectedMethod === pm.value ? 'text-emerald-700 dark:text-emerald-300' : ''}`}>
                    {pm.label}
                  </span>
                </label>
              );
            })}
          </RadioGroup>
        </div>

        {/* Cash-specific: change calculator */}
        {selectedMethod === 'cash' && (
          <div className="space-y-3 rounded-lg border p-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Cash Received</label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={cashReceived}
                onChange={(e) => setCashReceived(e.target.value)}
                placeholder="0.00"
                className="h-12 text-lg font-semibold text-center"
                autoFocus
              />
              {/* Quick cash amounts */}
              <div className="flex flex-wrap gap-1.5">
                {[20, 50, 100, 200, 500].map((amt) => (
                  <Button
                    key={amt}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => setCashReceived(String(amt))}
                  >
                    ${amt}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs font-semibold"
                  onClick={() => setCashReceived(String(Math.ceil(totalDue)))}
                >
                  Exact
                </Button>
              </div>
            </div>
            {cashReceived && parseFloat(cashReceived) > 0 && (
              <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                <span className="text-sm text-muted-foreground">Change</span>
                <span
                  className={`text-xl font-bold ${
                    isCashSufficient ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'
                  }`}
                >
                  {isCashSufficient ? formatCurrency(change) : 'Insufficient'}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Card processing animation */}
        {selectedMethod === 'card' && isCardProcessing && (
          <div className="flex flex-col items-center gap-3 rounded-lg border p-6">
            <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
            <p className="text-sm font-medium">Processing card payment...</p>
            <p className="text-xs text-muted-foreground">Please wait or insert/tap card</p>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isProcessing || isCardProcessing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCompleteSale}
            disabled={
              isProcessing ||
              isCardProcessing ||
              (selectedMethod === 'cash' && !isCashSufficient) ||
              cart.items.length === 0
            }
            className="bg-emerald-600 text-white hover:bg-emerald-700 min-w-[140px]"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Complete Sale
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================
// RECEIPT MODAL
// ============================================

function ReceiptModal() {
  const {
    cart,
    isReceiptOpen,
    setReceiptOpen,
    lastTransactionRef,
    clearCart,
  } = usePosStore();

  const handleNewSale = useCallback(() => {
    clearCart();
    setReceiptOpen(false);
  }, [clearCart, setReceiptOpen]);

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Dialog open={isReceiptOpen} onOpenChange={setReceiptOpen}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto" showCloseButton>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Receipt className="h-5 w-5 text-emerald-600" />
            Sale Complete
          </DialogTitle>
          <DialogDescription>Your transaction has been processed successfully.</DialogDescription>
        </DialogHeader>

        {/* Receipt */}
        <div className="rounded-xl border bg-white p-5 text-foreground dark:bg-gray-950 print:border-0">
          {/* Store header */}
          <div className="text-center">
            <h3 className="text-lg font-bold">TechRetail Pro</h3>
            <p className="text-xs text-muted-foreground">123 Main St, New York</p>
            <p className="text-xs text-muted-foreground">+1-555-0100</p>
          </div>

          <Separator className="my-3" />

          {/* Transaction info */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date:</span>
              <span>{dateStr}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time:</span>
              <span>{timeStr}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ref:</span>
              <span className="font-mono font-semibold">{lastTransactionRef || 'N/A'}</span>
            </div>
            {cart.customerName && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Customer:</span>
                <span>{cart.customerName}</span>
              </div>
            )}
          </div>

          <Separator className="my-3" />

          {/* Items */}
          <div className="space-y-2">
            {cart.items.map((item) => (
              <div key={item.id} className="space-y-0.5">
                <div className="flex justify-between text-sm">
                  <span className="truncate max-w-[65%]">{item.name}</span>
                  <span className="font-medium">
                    {formatCurrency(item.price * item.quantity - item.discount + item.tax)}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>
                    {item.quantity} x {formatCurrency(item.price)}
                    {item.discount > 0 && ` - ${formatCurrency(item.discount)} disc`}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-3" />

          {/* Totals */}
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(cart.subtotal)}</span>
            </div>
            {cart.discountAmount > 0 && (
              <div className="flex justify-between text-amber-600 dark:text-amber-400">
                <span>Discount</span>
                <span>-{formatCurrency(cart.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span>{formatCurrency(cart.taxAmount)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-emerald-600 dark:text-emerald-400">
                {formatCurrency(cart.totalAmount)}
              </span>
            </div>
          </div>

          <Separator className="my-3" />

          {/* Payment method */}
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Paid via</span>
            <span className="capitalize font-medium">
              {cart.paymentMethod.replace('_', ' ')}
            </span>
          </div>

          {/* Thank you */}
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Thank you for your purchase!
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => window.print()} className="gap-1.5">
            <Printer className="h-4 w-4" />
            Print Receipt
          </Button>
          <Button
            onClick={handleNewSale}
            className="bg-emerald-600 text-white hover:bg-emerald-700 gap-1.5"
            size="lg"
          >
            <ShoppingBag className="h-4 w-4" />
            New Sale
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================
// CUSTOMER PICKER POPOVER
// ============================================

function CustomerPicker() {
  const { cart, setCartCustomer } = usePosStore();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return mockCustomers;
    const q = search.toLowerCase();
    return mockCustomers.filter(
      (c) =>
        c.firstName.toLowerCase().includes(q) ||
        c.lastName.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.phone?.includes(q)
    );
  }, [search]);

  const handleSelect = useCallback(
    (id: string, name: string) => {
      setCartCustomer(id, name);
      setIsOpen(false);
      setSearch('');
    },
    [setCartCustomer]
  );

  const handleRemove = useCallback(() => {
    setCartCustomer('', '');
  }, [setCartCustomer]);

  return (
    <div className="relative">
      {cart.customerName ? (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 dark:border-emerald-800 dark:bg-emerald-950/30">
          <UserCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300 truncate max-w-[120px]">
            {cart.customerName}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 text-muted-foreground hover:text-destructive"
            onClick={handleRemove}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-muted-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          <UserCircle className="h-4 w-4" />
          <span className="text-xs">Add Customer</span>
        </Button>
      )}

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 w-72 rounded-lg border bg-popover p-2 shadow-lg">
          <Input
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 text-xs mb-2"
            autoFocus
          />
          <ScrollArea className="max-h-48">
            <div className="space-y-0.5">
              {filtered.length === 0 ? (
                <p className="px-2 py-3 text-center text-xs text-muted-foreground">
                  No customers found
                </p>
              ) : (
                filtered.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleSelect(c.id, `${c.firstName} ${c.lastName}`)}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-accent transition-colors"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[10px] font-semibold">
                      {c.firstName[0]}
                      {c.lastName[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">
                        {c.firstName} {c.lastName}
                      </p>
                      <p className="text-muted-foreground">{c.phone || c.email}</p>
                    </div>
                    <Badge variant="secondary" className="text-[9px] px-1">
                      {c.group}
                    </Badge>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
          <Button
            variant="ghost"
            size="sm"
            className="mt-1 w-full text-xs"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}

// ============================================
// MAIN POS TERMINAL
// ============================================

export default function PosTerminal() {
  const {
    cart,
    searchQuery,
    selectedCategory,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateDiscount,
    clearCart,
    setSearchQuery,
    setSelectedCategory,
    setCheckoutOpen,
  } = usePosStore();

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    let products = mockProducts.filter((p) => p.isActive);

    if (selectedCategory !== 'all') {
      products = products.filter((p) => p.categoryId === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.barcode?.toLowerCase().includes(q) ||
          p.brandName?.toLowerCase().includes(q)
      );
    }

    return products;
  }, [searchQuery, selectedCategory]);

  const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="flex h-[calc(100vh-5.5rem)] gap-0 overflow-hidden -m-4 sm:-m-6">
      {/* ============================================ */}
      {/* LEFT SIDE - Product Grid (60%) */}
      {/* ============================================ */}
      <div className="flex w-[60%] flex-col border-r bg-background">
        {/* Search Bar */}
        <div className="border-b p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products or scan barcode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 pl-11 pr-10 text-base rounded-xl border-muted bg-muted/30 focus-visible:bg-background transition-colors"
            />
            <ScanBarcode className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/50" />
          </div>
        </div>

        {/* Category Filter */}
        <div className="border-b px-3 py-2">
          <ScrollArea className="w-full">
            <div className="flex gap-1.5 pb-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                All
              </button>
              {mockCategories
                .filter((c) => c.isActive)
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
            </div>
          </ScrollArea>
        </div>

        {/* Product Grid */}
        <ScrollArea className="flex-1">
          <div className="p-3">
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Package className="h-12 w-12 text-muted-foreground/20" />
                <p className="mt-3 text-sm font-medium text-muted-foreground">No products found</p>
                <p className="text-xs text-muted-foreground/70">Try adjusting your search or category filter</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onAdd={addToCart} />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* ============================================ */}
      {/* RIGHT SIDE - Cart (40%) */}
      {/* ============================================ */}
      <div className="flex w-[40%] flex-col bg-muted/20">
        {/* Cart Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-emerald-600" />
            <h2 className="text-base font-bold">Current Sale</h2>
            {itemCount > 0 && (
              <Badge className="bg-emerald-600 text-white text-[10px] px-1.5">
                {itemCount}
              </Badge>
            )}
          </div>
          {cart.items.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-destructive gap-1"
              onClick={clearCart}
            >
              <Trash2 className="h-3 w-3" />
              Clear
            </Button>
          )}
        </div>

        {/* Customer Selection */}
        <div className="border-b px-4 py-2">
          <CustomerPicker />
        </div>

        {/* Cart Items List */}
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-2">
            {cart.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground/15" />
                <p className="mt-3 text-sm font-medium text-muted-foreground">Cart is empty</p>
                <p className="text-xs text-muted-foreground/70">Click products to add them here</p>
              </div>
            ) : (
              cart.items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onUpdateDiscount={updateDiscount}
                  onRemove={removeFromCart}
                />
              ))
            )}
          </div>
        </ScrollArea>

        {/* Cart Summary & Actions */}
        {cart.items.length > 0 && (
          <div className="border-t bg-background">
            {/* Summary */}
            <div className="space-y-1.5 px-4 pt-3 pb-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(cart.subtotal)}</span>
              </div>
              {cart.discountAmount > 0 && (
                <div className="flex items-center justify-between text-sm text-amber-600 dark:text-amber-400">
                  <span>Discount</span>
                  <span>-{formatCurrency(cart.discountAmount)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatCurrency(cart.taxAmount)}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">TOTAL</span>
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(cart.totalAmount)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 p-3 pt-0">
              <Button
                variant="outline"
                className="flex-1 gap-1.5 h-12"
                onClick={() => {
                  // Hold order - just clear cart for demo
                  clearCart();
                }}
              >
                <Clock className="h-4 w-4" />
                Hold
              </Button>
              <Button
                className="flex-[2] gap-2 h-12 bg-emerald-600 text-white hover:bg-emerald-700 text-base font-bold shadow-lg shadow-emerald-600/20"
                onClick={() => setCheckoutOpen(true)}
              >
                <CreditCard className="h-5 w-5" />
                Charge {formatCurrency(cart.totalAmount)}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <CheckoutModal />
      <ReceiptModal />
    </div>
  );
}
