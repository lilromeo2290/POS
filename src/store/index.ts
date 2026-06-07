// Enterprise POS System - Global State Store

import { create } from 'zustand';
import type {
  AppPage, AuthUser, CartItem, Cart, Product, Notification,
  Category, Brand, InventoryItem, StockTransfer, PurchaseOrder, Supplier, UserRole
} from '@/types';
import {
  mockBusiness, mockProducts, mockNotifications, mockDashboardMetrics,
  mockCategories, mockBrands, mockInventory, mockStockTransfers,
  mockPurchaseOrders, mockSuppliers
} from '@/data/mockData';
import { ALL_PERMISSIONS } from '@/types';

// ============================================
// AUTH STORE
// ============================================

// ============================================
// DEMO ACCOUNTS (email → user profile)
// ============================================
const DEMO_ACCOUNTS: Record<string, Omit<AuthUser, 'id'> & { password: string; permissions: string[] }> = {
  'admin@techretail.com': {
    password: 'admin123',
    name: 'Alex Thompson',
    email: 'admin@techretail.com',
    phone: '+1-555-3001',
    role: 'admin',
    mfaEnabled: false,
    businessId: 'biz_001',
    businessName: 'TechRetail Pro',
    branchId: 'br_001',
    branchName: 'Main Street Store',
    permissions: ALL_PERMISSIONS.filter(p => !['settings.billing', 'settings.integrations'].includes(p.id)).map(p => p.id),
  },
  'super@techretail.com': {
    password: 'super123',
    name: 'Sarah Chen',
    email: 'super@techretail.com',
    phone: '+1-555-3002',
    role: 'super_admin',
    mfaEnabled: false,
    businessId: 'biz_001',
    businessName: 'TechRetail Pro',
    branchId: 'br_001',
    branchName: 'Main Street Store',
    permissions: ALL_PERMISSIONS.map(p => p.id),
  },
  'manager@techretail.com': {
    password: 'manager123',
    name: 'Marcus Johnson',
    email: 'manager@techretail.com',
    phone: '+1-555-3003',
    role: 'manager',
    mfaEnabled: false,
    businessId: 'biz_001',
    businessName: 'TechRetail Pro',
    branchId: 'br_002',
    branchName: 'Mall Outlet',
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
  },
  'cashier@techretail.com': {
    password: 'cashier123',
    name: 'Emily Rodriguez',
    email: 'cashier@techretail.com',
    phone: '+1-555-3004',
    role: 'cashier',
    mfaEnabled: false,
    businessId: 'biz_001',
    businessName: 'TechRetail Pro',
    branchId: 'br_001',
    branchName: 'Main Street Store',
    permissions: [
      'dashboard.view',
      'pos.access', 'pos.discount', 'pos.hold',
      'inventory.view',
      'customers.view', 'customers.create',
      'transactions.view',
      'reports.view',
    ],
  },
  'viewer@techretail.com': {
    password: 'viewer123',
    name: 'James Wilson',
    email: 'viewer@techretail.com',
    phone: '+1-555-3007',
    role: 'viewer',
    mfaEnabled: false,
    businessId: 'biz_001',
    businessName: 'TechRetail Pro',
    branchId: 'br_003',
    branchName: 'Downtown Branch',
    permissions: [
      'dashboard.view',
      'inventory.view',
      'customers.view',
      'suppliers.view',
      'transactions.view',
      'reports.view', 'reports.sales',
      'settings.view',
    ],
  },
};

export { DEMO_ACCOUNTS };

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  permissions: string[];
  loginError: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  permissions: [],
  loginError: null,
  login: async (email: string, password: string) => {
    set({ isLoading: true, loginError: null });
    await new Promise(resolve => setTimeout(resolve, 600));

    const account = DEMO_ACCOUNTS[email.toLowerCase().trim()];
    if (!account || account.password !== password) {
      set({ isLoading: false, loginError: 'Invalid email or password. Please try again.' });
      return;
    }

    set({
      isAuthenticated: true,
      isLoading: false,
      loginError: null,
      permissions: account.permissions,
      user: {
        id: `usr_${Date.now()}`,
        email: account.email,
        name: account.name,
        phone: account.phone,
        role: account.role,
        mfaEnabled: account.mfaEnabled,
        businessId: account.businessId,
        businessName: account.businessName,
        branchId: account.branchId,
        branchName: account.branchName,
      },
    });
  },
  logout: () => set({ user: null, isAuthenticated: false, permissions: [], loginError: null }),
  hasPermission: (permission: string) => {
    const { user, permissions } = get();
    if (!user) return false;
    if (user.role === 'super_admin') return true;
    return permissions.includes(permission);
  },
}));

// ============================================
// NAVIGATION STORE
// ============================================

interface NavState {
  currentPage: AppPage;
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  setPage: (page: AppPage) => void;
  toggleSidebar: () => void;
  toggleCollapsed: () => void;
}

export const useNavStore = create<NavState>((set) => ({
  currentPage: 'dashboard' as AppPage,
  sidebarOpen: true,
  sidebarCollapsed: false,
  setPage: (page) => set({ currentPage: page }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleCollapsed: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
}));

// ============================================
// POS / CART STORE
// ============================================

interface PosState {
  cart: Cart;
  searchQuery: string;
  selectedCategory: string;
  isCheckoutOpen: boolean;
  isReceiptOpen: boolean;
  lastTransactionRef: string | null;
  addToCart: (product: Product) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateDiscount: (itemId: string, discount: number) => void;
  clearCart: () => void;
  setCartCustomer: (id: string, name: string) => void;
  setPaymentMethod: (method: Cart['paymentMethod']) => void;
  setCartNotes: (notes: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setCheckoutOpen: (open: boolean) => void;
  setReceiptOpen: (open: boolean) => void;
  completeSale: () => string;
}

const emptyCart: Cart = {
  items: [],
  subtotal: 0,
  discountAmount: 0,
  taxAmount: 0,
  totalAmount: 0,
  paymentMethod: 'cash',
};

function recalcCart(items: CartItem[]): Pick<Cart, 'items' | 'subtotal' | 'discountAmount' | 'taxAmount' | 'totalAmount'> {
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const discountAmount = items.reduce((s, i) => s + i.discount, 0);
  const taxable = subtotal - discountAmount;
  const taxAmount = items.reduce((s, i) => s + i.tax, 0);
  const totalAmount = subtotal - discountAmount + taxAmount;
  return { items, subtotal, discountAmount, taxAmount, totalAmount };
}

export const usePosStore = create<PosState>((set, get) => ({
  cart: { ...emptyCart },
  searchQuery: '',
  selectedCategory: 'all',
  isCheckoutOpen: false,
  isReceiptOpen: false,
  lastTransactionRef: null,

  addToCart: (product) => set((state) => {
    const existing = state.cart.items.find(i => i.productId === product.id);
    let items: CartItem[];
    if (existing) {
      items = state.cart.items.map(i =>
        i.id === existing.id
          ? { ...i, quantity: i.quantity + 1, total: (i.price * (i.quantity + 1)) - i.discount + i.tax }
          : i
      );
    } else {
      const tax = product.sellingPrice * (product.taxRate / 100);
      const newItem: CartItem = {
        id: `cart_${Date.now()}_${product.id}`,
        productId: product.id,
        name: product.name,
        sku: product.sku,
        price: product.sellingPrice,
        quantity: 1,
        discount: 0,
        tax,
        total: product.sellingPrice + tax,
      };
      items = [...state.cart.items, newItem];
    }
    return { cart: { ...state.cart, ...recalcCart(items) } };
  }),

  removeFromCart: (itemId) => set((state) => {
    const items = state.cart.items.filter(i => i.id !== itemId);
    return { cart: { ...state.cart, ...recalcCart(items) } };
  }),

  updateQuantity: (itemId, quantity) => set((state) => {
    if (quantity <= 0) {
      const items = state.cart.items.filter(i => i.id !== itemId);
      return { cart: { ...state.cart, ...recalcCart(items) } };
    }
    const items = state.cart.items.map(i => {
      if (i.id !== itemId) return i;
      const tax = (i.price * quantity) * (8.5 / 100);
      return { ...i, quantity, tax, total: (i.price * quantity) - i.discount + tax };
    });
    return { cart: { ...state.cart, ...recalcCart(items) } };
  }),

  updateDiscount: (itemId, discount) => set((state) => {
    const items = state.cart.items.map(i => {
      if (i.id !== itemId) return i;
      return { ...i, discount, total: (i.price * i.quantity) - discount + i.tax };
    });
    return { cart: { ...state.cart, ...recalcCart(items) } };
  }),

  clearCart: () => set({ cart: { ...emptyCart }, lastTransactionRef: null }),
  setCartCustomer: (id, name) => set((s) => ({ cart: { ...s.cart, customerId: id, customerName: name } })),
  setPaymentMethod: (method) => set((s) => ({ cart: { ...s.cart, paymentMethod: method } })),
  setCartNotes: (notes) => set((s) => ({ cart: { ...s.cart, notes } })),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setCheckoutOpen: (open) => set({ isCheckoutOpen: open }),
  setReceiptOpen: (open) => set({ isReceiptOpen: open }),

  completeSale: () => {
    const ref = `TXN-2026-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;
    set({ lastTransactionRef: ref, isCheckoutOpen: false, isReceiptOpen: true });
    return ref;
  },
}));

// ============================================
// NOTIFICATION STORE
// ============================================

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [...mockNotifications],
  get unreadCount() {
    return get().notifications.filter(n => !n.isRead).length;
  },
  markRead: (id) => set((s) => ({
    notifications: s.notifications.map(n => n.id === id ? { ...n, isRead: true } : n),
  })),
  markAllRead: () => set((s) => ({
    notifications: s.notifications.map(n => ({ ...n, isRead: true })),
  })),
}));

// ============================================
// BUSINESS STORE
// ============================================

interface BusinessState {
  business: typeof mockBusiness;
  currentBranchId: string;
  setCurrentBranch: (id: string) => void;
}

export const useBusinessStore = create<BusinessState>((set) => ({
  business: mockBusiness,
  currentBranchId: 'br_001',
  setCurrentBranch: (id) => set({ currentBranchId: id }),
}));

// ============================================
// INVENTORY STORE
// ============================================

interface InventoryState {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  inventory: InventoryItem[];
  stockTransfers: StockTransfer[];
  purchaseOrders: PurchaseOrder[];
  suppliers: Supplier[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: Category) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  adjustStock: (inventoryId: string, adjustment: number) => void;
  addStockTransfer: (transfer: StockTransfer) => void;
  addPurchaseOrder: (po: PurchaseOrder) => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  products: [...mockProducts],
  categories: [...mockCategories],
  brands: [...mockBrands],
  inventory: [...mockInventory],
  stockTransfers: [...mockStockTransfers],
  purchaseOrders: [...mockPurchaseOrders],
  suppliers: [...mockSuppliers],

  addProduct: (product) => set((s) => ({ products: [...s.products, product] })),
  updateProduct: (id, updates) => set((s) => ({
    products: s.products.map((p) => p.id === id ? { ...p, ...updates } : p),
  })),
  deleteProduct: (id) => set((s) => ({
    products: s.products.filter((p) => p.id !== id),
  })),

  addCategory: (category) => set((s) => ({ categories: [...s.categories, category] })),
  updateCategory: (id, updates) => set((s) => ({
    categories: s.categories.map((c) => c.id === id ? { ...c, ...updates } : c),
  })),
  deleteCategory: (id) => set((s) => ({
    categories: s.categories.filter((c) => c.id !== id),
  })),

  adjustStock: (inventoryId, adjustment) => set((s) => ({
    inventory: s.inventory.map((inv) => {
      if (inv.id !== inventoryId) return inv;
      const newQty = Math.max(0, inv.quantity + adjustment);
      const newAvailable = Math.max(0, newQty - inv.reserved);
      return { ...inv, quantity: newQty, available: newAvailable };
    }),
  })),

  addStockTransfer: (transfer) => set((s) => ({
    stockTransfers: [...s.stockTransfers, transfer],
  })),

  addPurchaseOrder: (po) => set((s) => ({
    purchaseOrders: [...s.purchaseOrders, po],
  })),
}));
