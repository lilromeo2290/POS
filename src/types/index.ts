// Enterprise POS System - Type Definitions

// ============================================
// AUTH & USER TYPES
// ============================================

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  role: UserRole;
  mfaEnabled: boolean;
  businessId: string;
  businessName: string;
  branchId?: string;
  branchName?: string;
}

export type UserRole = 'super_admin' | 'admin' | 'manager' | 'cashier' | 'viewer';

export interface LoginCredentials {
  email: string;
  password: string;
  mfaCode?: string;
}

// ============================================
// BUSINESS & TENANT TYPES
// ============================================

export interface Business {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone?: string;
  logo?: string;
  industry: IndustryType;
  currency: string;
  timezone: string;
  taxRate: number;
  isActive: boolean;
  subscription: Subscription;
  branches: Branch[];
  createdAt: string;
}

export type IndustryType = 'retail' | 'restaurant' | 'pharmacy' | 'electronics' | 'wholesale';

export interface Subscription {
  id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  billingCycle: 'monthly' | 'annual';
  amount: number;
  trialEndsAt?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
}

export type SubscriptionPlan = 'starter' | 'professional' | 'enterprise';
export type SubscriptionStatus = 'trial' | 'active' | 'past_due' | 'cancelled';

export interface Branch {
  id: string;
  name: string;
  code: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  isHeadOffice: boolean;
}

// ============================================
// PRODUCT & INVENTORY TYPES
// ============================================

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  description?: string;
  imageUrl?: string;
  costPrice: number;
  sellingPrice: number;
  taxRate: number;
  unit: ProductUnit;
  trackStock: boolean;
  lowStockAlert: number;
  isActive: boolean;
  categoryId: string;
  categoryName: string;
  brandId?: string;
  brandName?: string;
  stockQuantity: number;
  createdAt: string;
}

export type ProductUnit = 'piece' | 'kg' | 'liter' | 'box' | 'pack' | 'dozen';

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  parentId?: string;
  productCount: number;
  isActive: boolean;
  sortOrder: number;
}

export interface Brand {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  productCount: number;
}

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  branchId: string;
  branchName: string;
  quantity: number;
  reserved: number;
  available: number;
}

export interface StockTransfer {
  id: string;
  reference: string;
  status: 'pending' | 'approved' | 'shipped' | 'received' | 'cancelled';
  sourceBranchId: string;
  sourceBranchName: string;
  destBranchId: string;
  destBranchName: string;
  items: StockTransferItem[];
  notes?: string;
  createdAt: string;
}

export interface StockTransferItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
}

// ============================================
// POS / CART TYPES
// ============================================

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  discount: number;
  tax: number;
  total: number;
  imageUrl?: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  customerId?: string;
  customerName?: string;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export type PaymentMethod = 'cash' | 'card' | 'mobile_money' | 'bank_transfer' | 'qr' | 'split';

export interface Transaction {
  id: string;
  reference: string;
  type: 'sale' | 'refund' | 'return';
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  customerId?: string;
  customerName?: string;
  branchId: string;
  branchName: string;
  employeeId?: string;
  employeeName?: string;
  items: TransactionItem[];
  createdAt: string;
}

export interface TransactionItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
}

// ============================================
// CUSTOMER & SUPPLIER TYPES
// ============================================

export interface Customer {
  id: string;
  code: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  loyaltyPoints: number;
  creditBalance: number;
  totalSpent: number;
  totalOrders: number;
  group?: CustomerGroup;
  isActive: boolean;
  createdAt: string;
}

export type CustomerGroup = 'VIP' | 'Regular' | 'Wholesale' | 'New';

export interface Supplier {
  id: string;
  code: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  balance: number;
  isActive: boolean;
}

export interface PurchaseOrder {
  id: string;
  reference: string;
  status: 'draft' | 'sent' | 'partially_received' | 'received' | 'cancelled';
  totalAmount: number;
  supplierId: string;
  supplierName: string;
  orderDate: string;
  expectedDate?: string;
  items: PurchaseOrderItem[];
}

export interface PurchaseOrderItem {
  id: string;
  productId?: string;
  productName: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  receivedQty: number;
}

// ============================================
// EMPLOYEE TYPES
// ============================================

export interface Employee {
  id: string;
  code: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position: string;
  department?: string;
  hireDate?: string;
  salary?: number;
  isActive: boolean;
  branchId: string;
  branchName: string;
  userId?: string;
  avatar?: string;
}

export interface Shift {
  id: string;
  date: string;
  startTime: string;
  endTime?: string;
  status: 'scheduled' | 'in_progress' | 'completed';
  employeeId: string;
  employeeName: string;
}

export interface Attendance {
  id: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  note?: string;
  employeeId: string;
  employeeName: string;
}

// ============================================
// FINANCIAL / REPORTING TYPES
// ============================================

export interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  receipt?: string;
}

export interface SalesReport {
  date: string;
  revenue: number;
  cost: number;
  profit: number;
  orders: number;
  averageOrderValue: number;
}

export interface DashboardMetrics {
  totalRevenue: number;
  revenueChange: number;
  totalOrders: number;
  ordersChange: number;
  totalCustomers: number;
  customersChange: number;
  totalProfit: number;
  profitChange: number;
  lowStockItems: number;
  activeEmployees: number;
}

export interface ChartDataPoint {
  name: string;
  revenue?: number;
  orders?: number;
  profit?: number;
  customers?: number;
  [key: string]: string | number | undefined;
}

// ============================================
// NOTIFICATION TYPES
// ============================================

export interface Notification {
  id: string;
  type: 'low_stock' | 'new_order' | 'subscription' | 'payment' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// ============================================
// APP NAVIGATION
// ============================================

export type AppPage = 
  | 'dashboard' 
  | 'pos' 
  | 'inventory' 
  | 'products'
  | 'customers' 
  | 'suppliers'
  | 'employees' 
  | 'reports' 
  | 'transactions'
  | 'settings'
  | 'branches'
  | 'subscription';
