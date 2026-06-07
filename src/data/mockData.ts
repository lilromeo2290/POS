// Enterprise POS System - Mock Data (Fresh/Empty State)

import type {
  Product, Category, Brand, Customer, Supplier, Employee,
  Transaction, Branch, Notification, DashboardMetrics,
  ChartDataPoint, InventoryItem, Expense, Shift, StockTransfer,
  PurchaseOrder, Business, Attendance, SystemUser, RoleDefinition
} from '@/types';

// ============================================
// BUSINESS & BRANCHES
// ============================================

export const mockBusiness: Business = {
  id: 'biz_001',
  name: 'My Business',
  slug: 'my-business',
  email: 'admin@mybusiness.com',
  phone: '',
  industry: 'retail',
  currency: 'USD',
  timezone: 'America/New_York',
  taxRate: 0,
  isActive: true,
  subscription: {
    id: 'sub_001',
    plan: 'starter',
    status: 'trial',
    billingCycle: 'monthly',
    amount: 0,
    currentPeriodStart: undefined,
    currentPeriodEnd: undefined,
  },
  branches: [
    { id: 'br_001', name: 'Main Branch', code: 'MAIN', isActive: true, isHeadOffice: true },
  ],
  createdAt: new Date().toISOString().split('T')[0],
};

// ============================================
// CATEGORIES & BRANDS
// ============================================

export const mockCategories: Category[] = [];

export const mockBrands: Brand[] = [];

// ============================================
// PRODUCTS
// ============================================

export const mockProducts: Product[] = [];

// ============================================
// CUSTOMERS
// ============================================

export const mockCustomers: Customer[] = [];

// ============================================
// SUPPLIERS
// ============================================

export const mockSuppliers: Supplier[] = [];

// ============================================
// EMPLOYEES
// ============================================

export const mockEmployees: Employee[] = [];

// ============================================
// TRANSACTIONS
// ============================================

export const mockTransactions: Transaction[] = [];

// ============================================
// INVENTORY
// ============================================

export const mockInventory: InventoryItem[] = [];

// ============================================
// STOCK TRANSFERS
// ============================================

export const mockStockTransfers: StockTransfer[] = [];

// ============================================
// PURCHASE ORDERS
// ============================================

export const mockPurchaseOrders: PurchaseOrder[] = [];

// ============================================
// EXPENSES
// ============================================

export const mockExpenses: Expense[] = [];

// ============================================
// SHIFTS
// ============================================

export const mockShifts: Shift[] = [];

// ============================================
// NOTIFICATIONS
// ============================================

export const mockNotifications: Notification[] = [];

// ============================================
// DASHBOARD METRICS
// ============================================

export const mockDashboardMetrics: DashboardMetrics = {
  totalRevenue: 0,
  revenueChange: 0,
  totalOrders: 0,
  ordersChange: 0,
  totalCustomers: 0,
  customersChange: 0,
  totalProfit: 0,
  profitChange: 0,
  lowStockItems: 0,
  activeEmployees: 0,
};

// ============================================
// CHART DATA
// ============================================

export const revenueChartData: ChartDataPoint[] = [];

export const salesByCategoryData: ChartDataPoint[] = [];

export const weeklySalesData: ChartDataPoint[] = [];

export const topProductsData: ChartDataPoint[] = [];

export const branchPerformanceData: ChartDataPoint[] = [];

// ============================================
// ATTENDANCE
// ============================================

export const mockAttendance: Attendance[] = [];

// ============================================
// LOYALTY ACTIVITY
// ============================================

export const mockLoyaltyActivity = [];
