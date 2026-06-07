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

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  permissions: string[];
  branchId?: string;
  branchName?: string;
  mfaEnabled: boolean;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export interface RoleDefinition {
  id: string;
  name: string;
  label: string;
  description: string;
  color: string;
  permissions: string[];
  userCount: number;
}

export type PermissionCategory =
  | 'dashboard'
  | 'pos'
  | 'inventory'
  | 'customers'
  | 'suppliers'
  | 'employees'
  | 'transactions'
  | 'reports'
  | 'settings'
  | 'users';

export interface Permission {
  id: string;
  name: string;
  label: string;
  description: string;
  category: PermissionCategory;
}

export const PERMISSION_CATEGORIES: { id: PermissionCategory; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'pos', label: 'POS Terminal' },
  { id: 'inventory', label: 'Inventory' },
  { id: 'customers', label: 'Customers' },
  { id: 'suppliers', label: 'Suppliers' },
  { id: 'employees', label: 'Employees' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'reports', label: 'Reports' },
  { id: 'users', label: 'Users & Roles' },
  { id: 'settings', label: 'Settings' },
];

export const ALL_PERMISSIONS: Permission[] = [
  // Dashboard
  { id: 'dashboard.view', name: 'dashboard.view', label: 'View Dashboard', description: 'Access the main dashboard', category: 'dashboard' },
  { id: 'dashboard.analytics', name: 'dashboard.analytics', label: 'View Analytics', description: 'Access detailed analytics and insights', category: 'dashboard' },
  // POS
  { id: 'pos.access', name: 'pos.access', label: 'Access POS', description: 'Use the POS terminal', category: 'pos' },
  { id: 'pos.refund', name: 'pos.refund', label: 'Process Refunds', description: 'Issue refunds on transactions', category: 'pos' },
  { id: 'pos.discount', name: 'pos.discount', label: 'Apply Discounts', description: 'Apply discounts to sales', category: 'pos' },
  { id: 'pos.hold', name: 'pos.hold', label: 'Hold Orders', description: 'Place orders on hold', category: 'pos' },
  // Inventory
  { id: 'inventory.view', name: 'inventory.view', label: 'View Inventory', description: 'View inventory and products', category: 'inventory' },
  { id: 'inventory.create', name: 'inventory.create', label: 'Add Products', description: 'Create new products and categories', category: 'inventory' },
  { id: 'inventory.edit', name: 'inventory.edit', label: 'Edit Products', description: 'Modify existing products', category: 'inventory' },
  { id: 'inventory.delete', name: 'inventory.delete', label: 'Delete Products', description: 'Remove products from catalog', category: 'inventory' },
  { id: 'inventory.transfer', name: 'inventory.transfer', label: 'Stock Transfers', description: 'Create and manage stock transfers', category: 'inventory' },
  { id: 'inventory.adjust', name: 'inventory.adjust', label: 'Adjust Stock', description: 'Adjust stock levels manually', category: 'inventory' },
  // Customers
  { id: 'customers.view', name: 'customers.view', label: 'View Customers', description: 'View customer list and details', category: 'customers' },
  { id: 'customers.create', name: 'customers.create', label: 'Add Customers', description: 'Create new customer records', category: 'customers' },
  { id: 'customers.edit', name: 'customers.edit', label: 'Edit Customers', description: 'Modify customer information', category: 'customers' },
  { id: 'customers.delete', name: 'customers.delete', label: 'Delete Customers', description: 'Remove customer records', category: 'customers' },
  { id: 'customers.credit', name: 'customers.credit', label: 'Manage Credit', description: 'Adjust customer credit balances', category: 'customers' },
  // Suppliers
  { id: 'suppliers.view', name: 'suppliers.view', label: 'View Suppliers', description: 'View supplier list and details', category: 'suppliers' },
  { id: 'suppliers.create', name: 'suppliers.create', label: 'Add Suppliers', description: 'Create new supplier records', category: 'suppliers' },
  { id: 'suppliers.edit', name: 'suppliers.edit', label: 'Edit Suppliers', description: 'Modify supplier information', category: 'suppliers' },
  { id: 'suppliers.purchase_orders', name: 'suppliers.purchase_orders', label: 'Manage POs', description: 'Create and manage purchase orders', category: 'suppliers' },
  // Employees
  { id: 'employees.view', name: 'employees.view', label: 'View Employees', description: 'View employee list and details', category: 'employees' },
  { id: 'employees.create', name: 'employees.create', label: 'Add Employees', description: 'Create new employee records', category: 'employees' },
  { id: 'employees.edit', name: 'employees.edit', label: 'Edit Employees', description: 'Modify employee information', category: 'employees' },
  { id: 'employees.schedule', name: 'employees.schedule', label: 'Manage Schedules', description: 'Manage shifts and attendance', category: 'employees' },
  { id: 'employees.salary', name: 'employees.salary', label: 'View Salaries', description: 'Access salary information', category: 'employees' },
  // Transactions
  { id: 'transactions.view', name: 'transactions.view', label: 'View Transactions', description: 'View transaction history', category: 'transactions' },
  { id: 'transactions.refund', name: 'transactions.refund', label: 'Refund Transactions', description: 'Process transaction refunds', category: 'transactions' },
  { id: 'transactions.export', name: 'transactions.export', label: 'Export Transactions', description: 'Export transaction data', category: 'transactions' },
  // Reports
  { id: 'reports.view', name: 'reports.view', label: 'View Reports', description: 'Access reports dashboard', category: 'reports' },
  { id: 'reports.sales', name: 'reports.sales', label: 'Sales Reports', description: 'View sales reports', category: 'reports' },
  { id: 'reports.financial', name: 'reports.financial', label: 'Financial Reports', description: 'View financial reports', category: 'reports' },
  { id: 'reports.export', name: 'reports.export', label: 'Export Reports', description: 'Export report data', category: 'reports' },
  // Users & Roles
  { id: 'users.view', name: 'users.view', label: 'View Users', description: 'View user list and details', category: 'users' },
  { id: 'users.create', name: 'users.create', label: 'Add Users', description: 'Create new user accounts', category: 'users' },
  { id: 'users.edit', name: 'users.edit', label: 'Edit Users', description: 'Modify user information and roles', category: 'users' },
  { id: 'users.delete', name: 'users.delete', label: 'Delete Users', description: 'Deactivate or remove user accounts', category: 'users' },
  { id: 'users.roles', name: 'users.roles', label: 'Manage Roles', description: 'Create and edit roles and permissions', category: 'users' },
  // Settings
  { id: 'settings.view', name: 'settings.view', label: 'View Settings', description: 'Access settings page', category: 'settings' },
  { id: 'settings.edit', name: 'settings.edit', label: 'Edit Settings', description: 'Modify business settings', category: 'settings' },
  { id: 'settings.billing', name: 'settings.billing', label: 'Manage Billing', description: 'Access and modify billing/subscription', category: 'settings' },
  { id: 'settings.integrations', name: 'settings.integrations', label: 'Manage Integrations', description: 'Configure third-party integrations', category: 'settings' },
];

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
  | 'users'
  | 'reports' 
  | 'transactions'
  | 'settings'
  | 'subscription';
