// Enterprise POS System - Mock Data

import type {
  Product, Category, Brand, Customer, Supplier, Employee,
  Transaction, Branch, Notification, DashboardMetrics,
  ChartDataPoint, InventoryItem, Expense, Shift, StockTransfer,
  PurchaseOrder, Business, Attendance
} from '@/types';

// ============================================
// BUSINESS & BRANCHES
// ============================================

export const mockBusiness: Business = {
  id: 'biz_001',
  name: 'TechRetail Pro',
  slug: 'techretail-pro',
  email: 'admin@techretail.com',
  phone: '+1-555-0100',
  industry: 'retail',
  currency: 'USD',
  timezone: 'America/New_York',
  taxRate: 8.5,
  isActive: true,
  subscription: {
    id: 'sub_001',
    plan: 'professional',
    status: 'active',
    billingCycle: 'monthly',
    amount: 99,
    currentPeriodStart: '2026-01-01',
    currentPeriodEnd: '2026-01-31',
  },
  branches: [
    { id: 'br_001', name: 'Main Street Store', code: 'MSS', address: '123 Main St', city: 'New York', phone: '+1-555-0101', email: 'main@techretail.com', isActive: true, isHeadOffice: true },
    { id: 'br_002', name: 'Mall Outlet', code: 'MLO', address: '456 Mall Blvd', city: 'Brooklyn', phone: '+1-555-0102', email: 'mall@techretail.com', isActive: true, isHeadOffice: false },
    { id: 'br_003', name: 'Downtown Branch', code: 'DTB', address: '789 Downtown Ave', city: 'Manhattan', phone: '+1-555-0103', email: 'downtown@techretail.com', isActive: true, isHeadOffice: false },
    { id: 'br_004', name: 'Airport Store', code: 'APS', address: 'JFK Airport T4', city: 'Queens', phone: '+1-555-0104', email: 'airport@techretail.com', isActive: true, isHeadOffice: false },
    { id: 'br_005', name: 'Suburban Shop', code: 'SBS', address: '321 Suburb Lane', city: 'Staten Island', phone: '+1-555-0105', email: 'suburb@techretail.com', isActive: false, isHeadOffice: false },
  ],
  createdAt: '2024-03-15',
};

// ============================================
// CATEGORIES & BRANDS
// ============================================

export const mockCategories: Category[] = [
  { id: 'cat_001', name: 'Electronics', icon: 'Smartphone', color: '#3b82f6', productCount: 45, isActive: true, sortOrder: 1 },
  { id: 'cat_002', name: 'Computers', icon: 'Laptop', color: '#8b5cf6', productCount: 32, isActive: true, sortOrder: 2 },
  { id: 'cat_003', name: 'Accessories', icon: 'Headphones', color: '#06b6d4', productCount: 67, isActive: true, sortOrder: 3 },
  { id: 'cat_004', name: 'Storage', icon: 'HardDrive', color: '#f59e0b', productCount: 23, isActive: true, sortOrder: 4 },
  { id: 'cat_005', name: 'Networking', icon: 'Wifi', color: '#10b981', productCount: 18, isActive: true, sortOrder: 5 },
  { id: 'cat_006', name: 'Gaming', icon: 'Gamepad2', color: '#ef4444', productCount: 29, isActive: true, sortOrder: 6 },
  { id: 'cat_007', name: 'Software', icon: 'Disc', color: '#6366f1', productCount: 15, isActive: true, sortOrder: 7 },
  { id: 'cat_008', name: 'Printers & Scanners', icon: 'Printer', color: '#ec4899', productCount: 11, isActive: true, sortOrder: 8 },
];

export const mockBrands: Brand[] = [
  { id: 'brand_001', name: 'Apple', productCount: 28 },
  { id: 'brand_002', name: 'Samsung', productCount: 22 },
  { id: 'brand_003', name: 'Sony', productCount: 15 },
  { id: 'brand_004', name: 'Logitech', productCount: 18 },
  { id: 'brand_005', name: 'Dell', productCount: 12 },
  { id: 'brand_006', name: 'HP', productCount: 10 },
  { id: 'brand_007', name: 'Lenovo', productCount: 9 },
  { id: 'brand_008', name: 'ASUS', productCount: 7 },
  { id: 'brand_009', name: 'Microsoft', productCount: 14 },
  { id: 'brand_010', name: 'Bose', productCount: 6 },
];

// ============================================
// PRODUCTS
// ============================================

export const mockProducts: Product[] = [
  { id: 'prod_001', name: 'iPhone 15 Pro Max', sku: 'APL-IP15PM-256', barcode: '0194252709876', costPrice: 1099, sellingPrice: 1399, taxRate: 8.5, unit: 'piece', trackStock: true, lowStockAlert: 5, isActive: true, categoryId: 'cat_001', categoryName: 'Electronics', brandId: 'brand_001', brandName: 'Apple', stockQuantity: 23, createdAt: '2024-09-15' },
  { id: 'prod_002', name: 'MacBook Pro 16" M3', sku: 'APL-MBP16-M3', barcode: '0194252709877', costPrice: 2199, sellingPrice: 2799, taxRate: 8.5, unit: 'piece', trackStock: true, lowStockAlert: 3, isActive: true, categoryId: 'cat_002', categoryName: 'Computers', brandId: 'brand_001', brandName: 'Apple', stockQuantity: 8, createdAt: '2024-11-01' },
  { id: 'prod_003', name: 'Samsung Galaxy S24 Ultra', sku: 'SAM-S24U-256', barcode: '0194252709878', costPrice: 999, sellingPrice: 1299, taxRate: 8.5, unit: 'piece', trackStock: true, lowStockAlert: 5, isActive: true, categoryId: 'cat_001', categoryName: 'Electronics', brandId: 'brand_002', brandName: 'Samsung', stockQuantity: 31, createdAt: '2024-01-15' },
  { id: 'prod_004', name: 'AirPods Pro 2nd Gen', sku: 'APL-APP2', barcode: '0194252709879', costPrice: 179, sellingPrice: 249, taxRate: 8.5, unit: 'piece', trackStock: true, lowStockAlert: 10, isActive: true, categoryId: 'cat_003', categoryName: 'Accessories', brandId: 'brand_001', brandName: 'Apple', stockQuantity: 45, createdAt: '2024-09-20' },
  { id: 'prod_005', name: 'Sony WH-1000XM5', sku: 'SNY-WHM5-BK', barcode: '0194252709880', costPrice: 279, sellingPrice: 399, taxRate: 8.5, unit: 'piece', trackStock: true, lowStockAlert: 5, isActive: true, categoryId: 'cat_003', categoryName: 'Accessories', brandId: 'brand_003', brandName: 'Sony', stockQuantity: 18, createdAt: '2024-03-10' },
  { id: 'prod_006', name: 'Samsung 1TB T7 SSD', sku: 'SAM-T7-1TB', barcode: '0194252709881', costPrice: 79, sellingPrice: 129, taxRate: 8.5, unit: 'piece', trackStock: true, lowStockAlert: 8, isActive: true, categoryId: 'cat_004', categoryName: 'Storage', brandId: 'brand_002', brandName: 'Samsung', stockQuantity: 52, createdAt: '2024-04-05' },
  { id: 'prod_007', name: 'Logitech MX Master 3S', sku: 'LOG-MXM3S', barcode: '0194252709882', costPrice: 69, sellingPrice: 99, taxRate: 8.5, unit: 'piece', trackStock: true, lowStockAlert: 10, isActive: true, categoryId: 'cat_003', categoryName: 'Accessories', brandId: 'brand_004', brandName: 'Logitech', stockQuantity: 3, createdAt: '2024-05-20' },
  { id: 'prod_008', name: 'Dell XPS 15', sku: 'DEL-XPS15-I7', barcode: '0194252709883', costPrice: 1499, sellingPrice: 1899, taxRate: 8.5, unit: 'piece', trackStock: true, lowStockAlert: 3, isActive: true, categoryId: 'cat_002', categoryName: 'Computers', brandId: 'brand_005', brandName: 'Dell', stockQuantity: 6, createdAt: '2024-06-12' },
  { id: 'prod_009', name: 'PS5 Console', sku: 'SNY-PS5-DRV', barcode: '0194252709884', costPrice: 399, sellingPrice: 499, taxRate: 8.5, unit: 'piece', trackStock: true, lowStockAlert: 5, isActive: true, categoryId: 'cat_006', categoryName: 'Gaming', brandId: 'brand_003', brandName: 'Sony', stockQuantity: 2, createdAt: '2024-07-01' },
  { id: 'prod_010', name: 'Microsoft Office 365', sku: 'MSF-O365-1Y', barcode: '0194252709885', costPrice: 79, sellingPrice: 129, taxRate: 0, unit: 'piece', trackStock: false, lowStockAlert: 0, isActive: true, categoryId: 'cat_007', categoryName: 'Software', brandId: 'brand_009', brandName: 'Microsoft', stockQuantity: 999, createdAt: '2024-01-01' },
  { id: 'prod_011', name: 'iPad Air M2', sku: 'APL-IPA-M2', barcode: '0194252709886', costPrice: 549, sellingPrice: 699, taxRate: 8.5, unit: 'piece', trackStock: true, lowStockAlert: 5, isActive: true, categoryId: 'cat_001', categoryName: 'Electronics', brandId: 'brand_001', brandName: 'Apple', stockQuantity: 15, createdAt: '2024-05-10' },
  { id: 'prod_012', name: 'Bose QuietComfort Ultra', sku: 'BSE-QCU-BK', barcode: '0194252709887', costPrice: 329, sellingPrice: 449, taxRate: 8.5, unit: 'piece', trackStock: true, lowStockAlert: 4, isActive: true, categoryId: 'cat_003', categoryName: 'Accessories', brandId: 'brand_010', brandName: 'Bose', stockQuantity: 9, createdAt: '2024-02-28' },
  { id: 'prod_013', name: 'ASUS ROG Strix G16', sku: 'ASU-ROG16-I9', barcode: '0194252709888', costPrice: 1699, sellingPrice: 2199, taxRate: 8.5, unit: 'piece', trackStock: true, lowStockAlert: 2, isActive: true, categoryId: 'cat_002', categoryName: 'Computers', brandId: 'brand_008', brandName: 'ASUS', stockQuantity: 4, createdAt: '2024-08-15' },
  { id: 'prod_014', name: 'HP LaserJet Pro M404n', sku: 'HP-LJP-M404', barcode: '0194252709889', costPrice: 249, sellingPrice: 349, taxRate: 8.5, unit: 'piece', trackStock: true, lowStockAlert: 3, isActive: true, categoryId: 'cat_008', categoryName: 'Printers & Scanners', brandId: 'brand_006', brandName: 'HP', stockQuantity: 7, createdAt: '2024-04-22' },
  { id: 'prod_015', name: 'TP-Link Mesh WiFi 6E', sku: 'TPL-MESH-6E', barcode: '0194252709890', costPrice: 199, sellingPrice: 299, taxRate: 8.5, unit: 'pack', trackStock: true, lowStockAlert: 5, isActive: true, categoryId: 'cat_005', categoryName: 'Networking', brandId: 'brand_011', brandName: 'TP-Link', stockQuantity: 14, createdAt: '2024-06-05' },
  { id: 'prod_016', name: 'Logitech G Pro X Keyboard', sku: 'LOG-GPX-KB', barcode: '0194252709891', costPrice: 119, sellingPrice: 169, taxRate: 8.5, unit: 'piece', trackStock: true, lowStockAlert: 8, isActive: true, categoryId: 'cat_006', categoryName: 'Gaming', brandId: 'brand_004', brandName: 'Logitech', stockQuantity: 22, createdAt: '2024-09-08' },
  { id: 'prod_017', name: 'Samsung 4TB T7 Shield', sku: 'SAM-T7S-4TB', barcode: '0194252709892', costPrice: 249, sellingPrice: 349, taxRate: 8.5, unit: 'piece', trackStock: true, lowStockAlert: 5, isActive: true, categoryId: 'cat_004', categoryName: 'Storage', brandId: 'brand_002', brandName: 'Samsung', stockQuantity: 19, createdAt: '2024-10-12' },
  { id: 'prod_018', name: 'Apple Watch Ultra 2', sku: 'APL-AWU2', barcode: '0194252709893', costPrice: 649, sellingPrice: 799, taxRate: 8.5, unit: 'piece', trackStock: true, lowStockAlert: 3, isActive: true, categoryId: 'cat_001', categoryName: 'Electronics', brandId: 'brand_001', brandName: 'Apple', stockQuantity: 11, createdAt: '2024-09-22' },
  { id: 'prod_019', name: 'Lenovo ThinkPad X1 Carbon', sku: 'LEN-X1C-I7', barcode: '0194252709894', costPrice: 1399, sellingPrice: 1799, taxRate: 8.5, unit: 'piece', trackStock: true, lowStockAlert: 2, isActive: true, categoryId: 'cat_002', categoryName: 'Computers', brandId: 'brand_007', brandName: 'Lenovo', stockQuantity: 5, createdAt: '2024-03-18' },
  { id: 'prod_020', name: 'Xbox Series X', sku: 'MSF-XSX-1TB', barcode: '0194252709895', costPrice: 399, sellingPrice: 499, taxRate: 8.5, unit: 'piece', trackStock: true, lowStockAlert: 5, isActive: true, categoryId: 'cat_006', categoryName: 'Gaming', brandId: 'brand_009', brandName: 'Microsoft', stockQuantity: 0, createdAt: '2024-11-05' },
];

// ============================================
// CUSTOMERS
// ============================================

export const mockCustomers: Customer[] = [
  { id: 'cust_001', code: 'CUST-001', firstName: 'James', lastName: 'Wilson', email: 'james.w@email.com', phone: '+1-555-1001', address: '42 Oak St', city: 'New York', loyaltyPoints: 2450, creditBalance: 150, totalSpent: 12890, totalOrders: 34, group: 'VIP', isActive: true, createdAt: '2024-02-10' },
  { id: 'cust_002', code: 'CUST-002', firstName: 'Sarah', lastName: 'Chen', email: 'sarah.c@email.com', phone: '+1-555-1002', address: '88 Pine Ave', city: 'Brooklyn', loyaltyPoints: 1200, creditBalance: 0, totalSpent: 5670, totalOrders: 18, group: 'Regular', isActive: true, createdAt: '2024-03-22' },
  { id: 'cust_003', code: 'CUST-003', firstName: 'Robert', lastName: 'Martinez', email: 'robert.m@email.com', phone: '+1-555-1003', address: '15 Elm Dr', city: 'Manhattan', loyaltyPoints: 5600, creditBalance: 500, totalSpent: 34500, totalOrders: 89, group: 'VIP', isActive: true, createdAt: '2023-11-05' },
  { id: 'cust_004', code: 'CUST-004', firstName: 'Emily', lastName: 'Johnson', email: 'emily.j@email.com', phone: '+1-555-1004', loyaltyPoints: 350, creditBalance: 0, totalSpent: 1890, totalOrders: 7, group: 'New', isActive: true, createdAt: '2025-12-15' },
  { id: 'cust_005', code: 'CUST-005', firstName: 'Michael', lastName: 'Brown', email: 'michael.b@email.com', phone: '+1-555-1005', address: '301 Cedar Ln', city: 'Queens', loyaltyPoints: 3200, creditBalance: 200, totalSpent: 22100, totalOrders: 56, group: 'Wholesale', isActive: true, createdAt: '2024-01-08' },
  { id: 'cust_006', code: 'CUST-006', firstName: 'Lisa', lastName: 'Anderson', email: 'lisa.a@email.com', phone: '+1-555-1006', address: '77 Maple Ct', city: 'Staten Island', loyaltyPoints: 800, creditBalance: 0, totalSpent: 3420, totalOrders: 12, group: 'Regular', isActive: true, createdAt: '2024-06-30' },
  { id: 'cust_007', code: 'CUST-007', firstName: 'David', lastName: 'Kim', email: 'david.k@email.com', phone: '+1-555-1007', address: '510 Birch Rd', city: 'Bronx', loyaltyPoints: 4100, creditBalance: 75, totalSpent: 28750, totalOrders: 72, group: 'VIP', isActive: true, createdAt: '2023-09-12' },
  { id: 'cust_008', code: 'CUST-008', firstName: 'Anna', lastName: 'Petrov', email: 'anna.p@email.com', phone: '+1-555-1008', loyaltyPoints: 100, creditBalance: 0, totalSpent: 560, totalOrders: 3, group: 'New', isActive: true, createdAt: '2026-01-02' },
  { id: 'cust_009', code: 'CUST-009', firstName: 'Thomas', lastName: 'Lee', email: 'thomas.l@email.com', phone: '+1-555-1009', address: '220 Walnut St', city: 'Brooklyn', loyaltyPoints: 1900, creditBalance: 0, totalSpent: 9800, totalOrders: 28, group: 'Regular', isActive: true, createdAt: '2024-04-18' },
  { id: 'cust_010', code: 'CUST-010', firstName: 'Jennifer', lastName: 'Garcia', email: 'jennifer.g@email.com', phone: '+1-555-1010', address: '90 Spruce Ave', city: 'Manhattan', loyaltyPoints: 6800, creditBalance: 350, totalSpent: 42300, totalOrders: 104, group: 'Wholesale', isActive: true, createdAt: '2023-06-20' },
];

// ============================================
// SUPPLIERS
// ============================================

export const mockSuppliers: Supplier[] = [
  { id: 'sup_001', code: 'SUP-001', name: 'Apple Distributor Inc.', contactPerson: 'Mark Taylor', email: 'orders@appledist.com', phone: '+1-555-2001', address: '100 Tech Blvd, Cupertino, CA', balance: 12500, isActive: true },
  { id: 'sup_002', code: 'SUP-002', name: 'Samsung Supply Chain', contactPerson: 'Jin Park', email: 'procurement@samsungsc.com', phone: '+1-555-2002', address: '200 Samsung Way, Ridgefield, NJ', balance: 8700, isActive: true },
  { id: 'sup_003', code: 'SUP-003', name: 'Global Tech Parts', contactPerson: 'Richard Evans', email: 'sales@globaltech.com', phone: '+1-555-2003', address: '350 Commerce St, Dallas, TX', balance: 3200, isActive: true },
  { id: 'sup_004', code: 'SUP-004', name: 'Premium Audio Supply', contactPerson: 'Yuki Tanaka', email: 'orders@premaudio.com', phone: '+1-555-2004', address: '75 Sound Ave, Nashville, TN', balance: 5100, isActive: true },
  { id: 'sup_005', code: 'SUP-005', name: 'Gaming World Distributors', contactPerson: 'Chris Anderson', email: 'wholesale@gamingworld.com', phone: '+1-555-2005', address: '400 Game St, Los Angeles, CA', balance: 9800, isActive: true },
];

// ============================================
// EMPLOYEES
// ============================================

export const mockEmployees: Employee[] = [
  { id: 'emp_001', code: 'EMP-001', firstName: 'Alex', lastName: 'Thompson', email: 'alex.t@techretail.com', phone: '+1-555-3001', position: 'Store Manager', department: 'Management', hireDate: '2023-01-15', salary: 65000, isActive: true, branchId: 'br_001', branchName: 'Main Street Store' },
  { id: 'emp_002', code: 'EMP-002', firstName: 'Maria', lastName: 'Rodriguez', email: 'maria.r@techretail.com', phone: '+1-555-3002', position: 'Senior Cashier', department: 'Sales', hireDate: '2023-03-20', salary: 38000, isActive: true, branchId: 'br_001', branchName: 'Main Street Store' },
  { id: 'emp_003', code: 'EMP-003', firstName: 'Kevin', lastName: 'Nguyen', email: 'kevin.n@techretail.com', phone: '+1-555-3003', position: 'Sales Associate', department: 'Sales', hireDate: '2023-07-01', salary: 32000, isActive: true, branchId: 'br_002', branchName: 'Mall Outlet' },
  { id: 'emp_004', code: 'EMP-004', firstName: 'Rachel', lastName: 'Green', email: 'rachel.g@techretail.com', phone: '+1-555-3004', position: 'Inventory Manager', department: 'Operations', hireDate: '2023-02-10', salary: 52000, isActive: true, branchId: 'br_001', branchName: 'Main Street Store' },
  { id: 'emp_005', code: 'EMP-005', firstName: 'Derek', lastName: 'Williams', email: 'derek.w@techretail.com', phone: '+1-555-3005', position: 'Cashier', department: 'Sales', hireDate: '2024-01-05', salary: 30000, isActive: true, branchId: 'br_002', branchName: 'Mall Outlet' },
  { id: 'emp_006', code: 'EMP-006', firstName: 'Sophia', lastName: 'Patel', email: 'sophia.p@techretail.com', phone: '+1-555-3006', position: 'Branch Manager', department: 'Management', hireDate: '2023-05-15', salary: 62000, isActive: true, branchId: 'br_003', branchName: 'Downtown Branch' },
  { id: 'emp_007', code: 'EMP-007', firstName: 'Jordan', lastName: 'Taylor', email: 'jordan.t@techretail.com', phone: '+1-555-3007', position: 'Sales Associate', department: 'Sales', hireDate: '2024-03-01', salary: 31000, isActive: true, branchId: 'br_003', branchName: 'Downtown Branch' },
  { id: 'emp_008', code: 'EMP-008', firstName: 'Emma', lastName: 'Davis', email: 'emma.d@techretail.com', phone: '+1-555-3008', position: 'Cashier', department: 'Sales', hireDate: '2024-06-15', salary: 28000, isActive: true, branchId: 'br_004', branchName: 'Airport Store' },
  { id: 'emp_009', code: 'EMP-009', firstName: 'Lucas', lastName: 'Martin', email: 'lucas.m@techretail.com', phone: '+1-555-3009', position: 'IT Support', department: 'IT', hireDate: '2023-09-01', salary: 55000, isActive: true, branchId: 'br_001', branchName: 'Main Street Store' },
  { id: 'emp_010', code: 'EMP-010', firstName: 'Olivia', lastName: 'Brown', email: 'olivia.b@techretail.com', phone: '+1-555-3010', position: 'Accountant', department: 'Finance', hireDate: '2023-04-20', salary: 58000, isActive: true, branchId: 'br_001', branchName: 'Main Street Store' },
];

// ============================================
// TRANSACTIONS
// ============================================

export const mockTransactions: Transaction[] = [
  { id: 'txn_001', reference: 'TXN-2026-0001', type: 'sale', status: 'completed', subtotal: 2798, discountAmount: 100, taxAmount: 229.83, totalAmount: 2927.83, paymentMethod: 'card', customerId: 'cust_001', customerName: 'James Wilson', branchId: 'br_001', branchName: 'Main Street Store', employeeId: 'emp_002', employeeName: 'Maria Rodriguez', items: [{ id: 'ti_001', productId: 'prod_002', productName: 'MacBook Pro 16" M3', quantity: 1, unitPrice: 2799, discountAmount: 100, taxAmount: 229.83, totalAmount: 2928.83 }], createdAt: '2026-06-07T14:30:00Z' },
  { id: 'txn_002', reference: 'TXN-2026-0002', type: 'sale', status: 'completed', subtotal: 1648, discountAmount: 0, taxAmount: 140.08, totalAmount: 1788.08, paymentMethod: 'cash', customerId: 'cust_003', customerName: 'Robert Martinez', branchId: 'br_001', branchName: 'Main Street Store', employeeId: 'emp_002', employeeName: 'Maria Rodriguez', items: [{ id: 'ti_002', productId: 'prod_011', productName: 'iPad Air M2', quantity: 1, unitPrice: 699, discountAmount: 0, taxAmount: 59.42, totalAmount: 758.42 }, { id: 'ti_003', productId: 'prod_004', productName: 'AirPods Pro 2nd Gen', quantity: 1, unitPrice: 249, discountAmount: 0, taxAmount: 21.17, totalAmount: 270.17 }, { id: 'ti_004', productId: 'prod_018', productName: 'Apple Watch Ultra 2', quantity: 1, unitPrice: 799, discountAmount: 0, taxAmount: 67.92, totalAmount: 866.92 }], createdAt: '2026-06-07T15:15:00Z' },
  { id: 'txn_003', reference: 'TXN-2026-0003', type: 'sale', status: 'completed', subtotal: 1299, discountAmount: 50, taxAmount: 106.17, totalAmount: 1355.17, paymentMethod: 'card', customerId: 'cust_005', customerName: 'Michael Brown', branchId: 'br_002', branchName: 'Mall Outlet', employeeId: 'emp_003', employeeName: 'Kevin Nguyen', items: [{ id: 'ti_005', productId: 'prod_003', productName: 'Samsung Galaxy S24 Ultra', quantity: 1, unitPrice: 1299, discountAmount: 50, taxAmount: 106.17, totalAmount: 1355.17 }], createdAt: '2026-06-07T16:00:00Z' },
  { id: 'txn_004', reference: 'TXN-2026-0004', type: 'sale', status: 'completed', subtotal: 398, discountAmount: 0, taxAmount: 33.83, totalAmount: 431.83, paymentMethod: 'mobile_money', branchId: 'br_003', branchName: 'Downtown Branch', employeeId: 'emp_007', employeeName: 'Jordan Taylor', items: [{ id: 'ti_006', productId: 'prod_005', productName: 'Sony WH-1000XM5', quantity: 1, unitPrice: 399, discountAmount: 0, taxAmount: 33.83, totalAmount: 432.83 }], createdAt: '2026-06-07T17:20:00Z' },
  { id: 'txn_005', reference: 'TXN-2026-0005', type: 'sale', status: 'completed', subtotal: 998, discountAmount: 0, taxAmount: 84.83, totalAmount: 1082.83, paymentMethod: 'card', customerId: 'cust_007', customerName: 'David Kim', branchId: 'br_001', branchName: 'Main Street Store', employeeId: 'emp_002', employeeName: 'Maria Rodriguez', items: [{ id: 'ti_007', productId: 'prod_005', productName: 'Sony WH-1000XM5', quantity: 1, unitPrice: 399, discountAmount: 0, taxAmount: 33.83, totalAmount: 432.83 }, { id: 'ti_008', productId: 'prod_006', productName: 'Samsung 1TB T7 SSD', quantity: 1, unitPrice: 129, discountAmount: 0, taxAmount: 10.97, totalAmount: 139.97 }, { id: 'ti_009', productId: 'prod_007', productName: 'Logitech MX Master 3S', quantity: 1, unitPrice: 99, discountAmount: 0, taxAmount: 8.42, totalAmount: 107.42 }, { id: 'ti_010', productId: 'prod_016', productName: 'Logitech G Pro X Keyboard', quantity: 1, unitPrice: 169, discountAmount: 0, taxAmount: 14.37, totalAmount: 183.37 }], createdAt: '2026-06-07T18:45:00Z' },
  { id: 'txn_006', reference: 'TXN-2026-0006', type: 'refund', status: 'refunded', subtotal: -249, discountAmount: 0, taxAmount: -21.17, totalAmount: -270.17, paymentMethod: 'card', customerId: 'cust_001', customerName: 'James Wilson', branchId: 'br_001', branchName: 'Main Street Store', employeeId: 'emp_002', employeeName: 'Maria Rodriguez', items: [{ id: 'ti_011', productId: 'prod_004', productName: 'AirPods Pro 2nd Gen', quantity: -1, unitPrice: 249, discountAmount: 0, taxAmount: -21.17, totalAmount: -270.17 }], createdAt: '2026-06-06T10:30:00Z' },
  { id: 'txn_007', reference: 'TXN-2026-0007', type: 'sale', status: 'completed', subtotal: 2199, discountAmount: 200, taxAmount: 169.92, totalAmount: 2168.92, paymentMethod: 'card', customerId: 'cust_009', customerName: 'Thomas Lee', branchId: 'br_003', branchName: 'Downtown Branch', employeeId: 'emp_007', employeeName: 'Jordan Taylor', items: [{ id: 'ti_012', productId: 'prod_013', productName: 'ASUS ROG Strix G16', quantity: 1, unitPrice: 2199, discountAmount: 200, taxAmount: 169.92, totalAmount: 2168.92 }], createdAt: '2026-06-06T11:00:00Z' },
  { id: 'txn_008', reference: 'TXN-2026-0008', type: 'sale', status: 'completed', subtotal: 448, discountAmount: 0, taxAmount: 38.08, totalAmount: 486.08, paymentMethod: 'cash', branchId: 'br_004', branchName: 'Airport Store', employeeId: 'emp_008', employeeName: 'Emma Davis', items: [{ id: 'ti_013', productId: 'prod_004', productName: 'AirPods Pro 2nd Gen', quantity: 1, unitPrice: 249, discountAmount: 0, taxAmount: 21.17, totalAmount: 270.17 }, { id: 'ti_014', productId: 'prod_006', productName: 'Samsung 1TB T7 SSD', quantity: 1, unitPrice: 129, discountAmount: 0, taxAmount: 10.97, totalAmount: 139.97 }], createdAt: '2026-06-06T14:20:00Z' },
  { id: 'txn_009', reference: 'TXN-2026-0009', type: 'sale', status: 'pending', subtotal: 799, discountAmount: 0, taxAmount: 67.92, totalAmount: 866.92, paymentMethod: 'card', customerId: 'cust_002', customerName: 'Sarah Chen', branchId: 'br_002', branchName: 'Mall Outlet', employeeId: 'emp_005', employeeName: 'Derek Williams', items: [{ id: 'ti_015', productId: 'prod_018', productName: 'Apple Watch Ultra 2', quantity: 1, unitPrice: 799, discountAmount: 0, taxAmount: 67.92, totalAmount: 866.92 }], createdAt: '2026-06-08T09:10:00Z' },
  { id: 'txn_010', reference: 'TXN-2026-0010', type: 'sale', status: 'cancelled', subtotal: 1399, discountAmount: 0, taxAmount: 118.92, totalAmount: 1517.92, paymentMethod: 'card', customerId: 'cust_004', customerName: 'Emily Johnson', branchId: 'br_001', branchName: 'Main Street Store', employeeId: 'emp_002', employeeName: 'Maria Rodriguez', items: [{ id: 'ti_016', productId: 'prod_001', productName: 'iPhone 15 Pro Max', quantity: 1, unitPrice: 1399, discountAmount: 0, taxAmount: 118.92, totalAmount: 1517.92 }], createdAt: '2026-06-05T13:45:00Z' },
  { id: 'txn_011', reference: 'TXN-2026-0011', type: 'return', status: 'completed', subtotal: -399, discountAmount: 0, taxAmount: -33.92, totalAmount: -432.92, paymentMethod: 'cash', customerId: 'cust_006', customerName: 'Lisa Anderson', branchId: 'br_003', branchName: 'Downtown Branch', employeeId: 'emp_007', employeeName: 'Jordan Taylor', items: [{ id: 'ti_017', productId: 'prod_005', productName: 'Sony WH-1000XM5', quantity: -1, unitPrice: 399, discountAmount: 0, taxAmount: -33.92, totalAmount: -432.92 }], createdAt: '2026-06-05T16:30:00Z' },
  { id: 'txn_012', reference: 'TXN-2026-0012', type: 'sale', status: 'completed', subtotal: 1899, discountAmount: 100, taxAmount: 153.43, totalAmount: 1952.43, paymentMethod: 'bank_transfer', customerId: 'cust_010', customerName: 'Jennifer Garcia', branchId: 'br_001', branchName: 'Main Street Store', employeeId: 'emp_002', employeeName: 'Maria Rodriguez', items: [{ id: 'ti_018', productId: 'prod_008', productName: 'Dell XPS 15', quantity: 1, unitPrice: 1899, discountAmount: 100, taxAmount: 153.43, totalAmount: 1952.43 }], createdAt: '2026-06-04T10:15:00Z' },
  { id: 'txn_013', reference: 'TXN-2026-0013', type: 'sale', status: 'pending', subtotal: 499, discountAmount: 0, taxAmount: 42.42, totalAmount: 541.42, paymentMethod: 'cash', branchId: 'br_004', branchName: 'Airport Store', employeeId: 'emp_008', employeeName: 'Emma Davis', items: [{ id: 'ti_019', productId: 'prod_009', productName: 'PS5 Console', quantity: 1, unitPrice: 499, discountAmount: 0, taxAmount: 42.42, totalAmount: 541.42 }], createdAt: '2026-06-08T11:30:00Z' },
  { id: 'txn_014', reference: 'TXN-2026-0014', type: 'sale', status: 'completed', subtotal: 648, discountAmount: 0, taxAmount: 55.08, totalAmount: 703.08, paymentMethod: 'mobile_money', customerId: 'cust_008', customerName: 'Anna Petrov', branchId: 'br_001', branchName: 'Main Street Store', employeeId: 'emp_002', employeeName: 'Maria Rodriguez', items: [{ id: 'ti_020', productId: 'prod_012', productName: 'Bose QuietComfort Ultra', quantity: 1, unitPrice: 449, discountAmount: 0, taxAmount: 38.17, totalAmount: 487.17 }, { id: 'ti_021', productId: 'prod_007', productName: 'Logitech MX Master 3S', quantity: 1, unitPrice: 99, discountAmount: 0, taxAmount: 8.42, totalAmount: 107.42 }, { id: 'ti_022', productId: 'prod_006', productName: 'Samsung 1TB T7 SSD', quantity: 1, unitPrice: 129, discountAmount: 0, taxAmount: 10.97, totalAmount: 139.97 }], createdAt: '2026-06-04T15:00:00Z' },
  { id: 'txn_015', reference: 'TXN-2026-0015', type: 'sale', status: 'completed', subtotal: 299, discountAmount: 0, taxAmount: 25.42, totalAmount: 324.42, paymentMethod: 'cash', branchId: 'br_002', branchName: 'Mall Outlet', employeeId: 'emp_003', employeeName: 'Kevin Nguyen', items: [{ id: 'ti_023', productId: 'prod_015', productName: 'TP-Link Mesh WiFi 6E', quantity: 1, unitPrice: 299, discountAmount: 0, taxAmount: 25.42, totalAmount: 324.42 }], createdAt: '2026-06-03T12:00:00Z' },
];

// ============================================
// INVENTORY
// ============================================

export const mockInventory: InventoryItem[] = [
  { id: 'inv_001', productId: 'prod_001', productName: 'iPhone 15 Pro Max', sku: 'APL-IP15PM-256', branchId: 'br_001', branchName: 'Main Street Store', quantity: 23, reserved: 2, available: 21 },
  { id: 'inv_002', productId: 'prod_002', productName: 'MacBook Pro 16" M3', sku: 'APL-MBP16-M3', branchId: 'br_001', branchName: 'Main Street Store', quantity: 8, reserved: 1, available: 7 },
  { id: 'inv_003', productId: 'prod_009', productName: 'PS5 Console', sku: 'SNY-PS5-DRV', branchId: 'br_001', branchName: 'Main Street Store', quantity: 2, reserved: 0, available: 2 },
  { id: 'inv_004', productId: 'prod_007', productName: 'Logitech MX Master 3S', sku: 'LOG-MXM3S', branchId: 'br_001', branchName: 'Main Street Store', quantity: 3, reserved: 0, available: 3 },
  { id: 'inv_005', productId: 'prod_020', productName: 'Xbox Series X', sku: 'MSF-XSX-1TB', branchId: 'br_001', branchName: 'Main Street Store', quantity: 0, reserved: 0, available: 0 },
  { id: 'inv_006', productId: 'prod_003', productName: 'Samsung Galaxy S24 Ultra', sku: 'SAM-S24U-256', branchId: 'br_002', branchName: 'Mall Outlet', quantity: 31, reserved: 3, available: 28 },
  { id: 'inv_007', productId: 'prod_011', productName: 'iPad Air M2', sku: 'APL-IPA-M2', branchId: 'br_002', branchName: 'Mall Outlet', quantity: 15, reserved: 1, available: 14 },
  { id: 'inv_008', productId: 'prod_005', productName: 'Sony WH-1000XM5', sku: 'SNY-WHM5-BK', branchId: 'br_003', branchName: 'Downtown Branch', quantity: 18, reserved: 2, available: 16 },
  { id: 'inv_009', productId: 'prod_006', productName: 'Samsung 1TB T7 SSD', sku: 'SAM-T7-1TB', branchId: 'br_001', branchName: 'Main Street Store', quantity: 52, reserved: 5, available: 47 },
  { id: 'inv_010', productId: 'prod_004', productName: 'AirPods Pro 2nd Gen', sku: 'APL-APP2', branchId: 'br_001', branchName: 'Main Street Store', quantity: 45, reserved: 4, available: 41 },
];

// ============================================
// STOCK TRANSFERS
// ============================================

export const mockStockTransfers: StockTransfer[] = [
  { id: 'st_001', reference: 'STR-2026-0001', status: 'approved', sourceBranchId: 'br_001', sourceBranchName: 'Main Street Store', destBranchId: 'br_002', destBranchName: 'Mall Outlet', items: [{ id: 'sti_001', productId: 'prod_001', productName: 'iPhone 15 Pro Max', quantity: 5 }, { id: 'sti_002', productId: 'prod_004', productName: 'AirPods Pro 2nd Gen', quantity: 10 }], notes: 'Monthly restock for Mall Outlet', createdAt: '2026-06-05' },
  { id: 'st_002', reference: 'STR-2026-0002', status: 'shipped', sourceBranchId: 'br_001', sourceBranchName: 'Main Street Store', destBranchId: 'br_003', destBranchName: 'Downtown Branch', items: [{ id: 'sti_003', productId: 'prod_005', productName: 'Sony WH-1000XM5', quantity: 8 }], createdAt: '2026-06-06' },
  { id: 'st_003', reference: 'STR-2026-0003', status: 'pending', sourceBranchId: 'br_002', sourceBranchName: 'Mall Outlet', destBranchId: 'br_004', destBranchName: 'Airport Store', items: [{ id: 'sti_004', productId: 'prod_006', productName: 'Samsung 1TB T7 SSD', quantity: 15 }, { id: 'sti_005', productId: 'prod_007', productName: 'Logitech MX Master 3S', quantity: 8 }], createdAt: '2026-06-07' },
];

// ============================================
// PURCHASE ORDERS
// ============================================

export const mockPurchaseOrders: PurchaseOrder[] = [
  { id: 'po_001', reference: 'PO-2026-0001', status: 'sent', totalAmount: 35970, supplierId: 'sup_001', supplierName: 'Apple Distributor Inc.', orderDate: '2026-06-01', expectedDate: '2026-06-15', items: [{ id: 'poi_001', productId: 'prod_001', productName: 'iPhone 15 Pro Max', quantity: 10, unitCost: 1099, totalCost: 10990, receivedQty: 0 }, { id: 'poi_002', productId: 'prod_004', productName: 'AirPods Pro 2nd Gen', quantity: 30, unitCost: 179, totalCost: 5370, receivedQty: 0 }, { id: 'poi_003', productId: 'prod_002', productName: 'MacBook Pro 16" M3', quantity: 5, unitCost: 2199, totalCost: 10995, receivedQty: 0 }, { id: 'poi_004', productId: 'prod_011', productName: 'iPad Air M2', quantity: 10, unitCost: 549, totalCost: 5490, receivedQty: 0 }] },
  { id: 'po_002', reference: 'PO-2026-0002', status: 'draft', totalAmount: 14940, supplierId: 'sup_002', supplierName: 'Samsung Supply Chain', orderDate: '2026-06-07', expectedDate: '2026-06-21', items: [{ id: 'poi_005', productId: 'prod_003', productName: 'Samsung Galaxy S24 Ultra', quantity: 8, unitCost: 999, totalCost: 7992, receivedQty: 0 }, { id: 'poi_006', productId: 'prod_006', productName: 'Samsung 1TB T7 SSD', quantity: 40, unitCost: 79, totalCost: 3160, receivedQty: 0 }, { id: 'poi_007', productId: 'prod_017', productName: 'Samsung 4TB T7 Shield', quantity: 10, unitCost: 249, totalCost: 2490, receivedQty: 0 }] },
  { id: 'po_003', reference: 'PO-2026-0003', status: 'received', totalAmount: 8370, supplierId: 'sup_003', supplierName: 'Global Tech Parts', orderDate: '2026-05-15', expectedDate: '2026-05-30', items: [{ id: 'poi_008', productId: 'prod_005', productName: 'Sony WH-1000XM5', quantity: 15, unitCost: 279, totalCost: 4185, receivedQty: 15 }, { id: 'poi_009', productId: 'prod_016', productName: 'Logitech G Pro X Keyboard', quantity: 20, unitCost: 119, totalCost: 2380, receivedQty: 20 }, { id: 'poi_010', productId: 'prod_007', productName: 'Logitech MX Master 3S', quantity: 15, unitCost: 69, totalCost: 1035, receivedQty: 15 }] },
  { id: 'po_004', reference: 'PO-2026-0004', status: 'cancelled', totalAmount: 6750, supplierId: 'sup_004', supplierName: 'Premium Audio Supply', orderDate: '2026-05-20', expectedDate: '2026-06-05', items: [{ id: 'poi_011', productId: 'prod_012', productName: 'Bose QuietComfort Ultra', quantity: 10, unitCost: 329, totalCost: 3290, receivedQty: 0 }, { id: 'poi_012', productId: 'prod_005', productName: 'Sony WH-1000XM5', quantity: 10, unitCost: 279, totalCost: 2790, receivedQty: 0 }] },
  { id: 'po_005', reference: 'PO-2026-0005', status: 'partially_received', totalAmount: 12940, supplierId: 'sup_005', supplierName: 'Gaming World Distributors', orderDate: '2026-05-25', expectedDate: '2026-06-10', items: [{ id: 'poi_013', productId: 'prod_009', productName: 'PS5 Console', quantity: 10, unitCost: 399, totalCost: 3990, receivedQty: 5 }, { id: 'poi_014', productId: 'prod_020', productName: 'Xbox Series X', quantity: 15, unitCost: 399, totalCost: 5985, receivedQty: 8 }, { id: 'poi_015', productId: 'prod_016', productName: 'Logitech G Pro X Keyboard', quantity: 25, unitCost: 119, totalCost: 2975, receivedQty: 25 }] },
];

// ============================================
// EXPENSES
// ============================================

export const mockExpenses: Expense[] = [
  { id: 'exp_001', category: 'Rent', description: 'Monthly store rent - Main Street', amount: 4500, date: '2026-06-01' },
  { id: 'exp_002', category: 'Utilities', description: 'Electricity bill - May', amount: 890, date: '2026-06-03' },
  { id: 'exp_003', category: 'Salaries', description: 'Staff salaries - June payroll', amount: 18500, date: '2026-06-01' },
  { id: 'exp_004', category: 'Marketing', description: 'Google Ads campaign', amount: 1200, date: '2026-06-05' },
  { id: 'exp_005', category: 'Maintenance', description: 'HVAC repair', amount: 650, date: '2026-06-04' },
  { id: 'exp_006', category: 'Insurance', description: 'Business liability insurance', amount: 380, date: '2026-06-01' },
  { id: 'exp_007', category: 'Office Supplies', description: 'Printer paper and toner', amount: 245, date: '2026-06-02' },
  { id: 'exp_008', category: 'Software', description: 'POS system subscription', amount: 99, date: '2026-06-01' },
];

// ============================================
// SHIFTS
// ============================================

export const mockShifts: Shift[] = [
  { id: 'sh_001', date: '2026-06-08', startTime: '2026-06-08T08:00:00Z', endTime: '2026-06-08T16:00:00Z', status: 'in_progress', employeeId: 'emp_002', employeeName: 'Maria Rodriguez' },
  { id: 'sh_002', date: '2026-06-08', startTime: '2026-06-08T09:00:00Z', endTime: '2026-06-08T17:00:00Z', status: 'in_progress', employeeId: 'emp_003', employeeName: 'Kevin Nguyen' },
  { id: 'sh_003', date: '2026-06-08', startTime: '2026-06-08T10:00:00Z', endTime: '2026-06-08T18:00:00Z', status: 'scheduled', employeeId: 'emp_007', employeeName: 'Jordan Taylor' },
  { id: 'sh_004', date: '2026-06-08', startTime: '2026-06-08T12:00:00Z', endTime: '2026-06-08T20:00:00Z', status: 'scheduled', employeeId: 'emp_005', employeeName: 'Derek Williams' },
  { id: 'sh_005', date: '2026-06-08', startTime: '2026-06-08T08:00:00Z', endTime: '2026-06-08T16:00:00Z', status: 'in_progress', employeeId: 'emp_008', employeeName: 'Emma Davis' },
];

// ============================================
// NOTIFICATIONS
// ============================================

export const mockNotifications: Notification[] = [
  { id: 'notif_001', type: 'low_stock', title: 'Low Stock Alert', message: 'PS5 Console is below minimum stock level (2 remaining)', isRead: false, createdAt: '2026-06-07T10:00:00Z' },
  { id: 'notif_002', type: 'low_stock', title: 'Out of Stock', message: 'Xbox Series X is now out of stock', isRead: false, createdAt: '2026-06-07T09:30:00Z' },
  { id: 'notif_003', type: 'new_order', title: 'New Order', message: 'Large order placed by Robert Martinez ($3,450)', isRead: true, createdAt: '2026-06-07T15:15:00Z' },
  { id: 'notif_004', type: 'subscription', title: 'Subscription Renewal', message: 'Your Professional plan renews in 5 days', isRead: false, createdAt: '2026-06-06T08:00:00Z' },
  { id: 'notif_005', type: 'system', title: 'System Update', message: 'POS system updated to v2.4.1', isRead: true, createdAt: '2026-06-05T02:00:00Z' },
  { id: 'notif_006', type: 'payment', title: 'Payment Received', message: 'Invoice #INV-0042 paid by Jennifer Garcia', isRead: true, createdAt: '2026-06-04T14:20:00Z' },
];

// ============================================
// DASHBOARD METRICS
// ============================================

export const mockDashboardMetrics: DashboardMetrics = {
  totalRevenue: 287650,
  revenueChange: 12.5,
  totalOrders: 1247,
  ordersChange: 8.3,
  totalCustomers: 3842,
  customersChange: 15.2,
  totalProfit: 89430,
  profitChange: 9.8,
  lowStockItems: 3,
  activeEmployees: 10,
};

// ============================================
// CHART DATA
// ============================================

export const revenueChartData: ChartDataPoint[] = [
  { name: 'Jan', revenue: 18500, orders: 85, profit: 5800 },
  { name: 'Feb', revenue: 22300, orders: 96, profit: 7100 },
  { name: 'Mar', revenue: 19800, orders: 89, profit: 6200 },
  { name: 'Apr', revenue: 25600, orders: 112, profit: 8400 },
  { name: 'May', revenue: 28100, orders: 124, profit: 9200 },
  { name: 'Jun', revenue: 31200, orders: 138, profit: 10500 },
  { name: 'Jul', revenue: 29400, orders: 128, profit: 9800 },
  { name: 'Aug', revenue: 33500, orders: 145, profit: 11200 },
  { name: 'Sep', revenue: 30800, orders: 134, profit: 10100 },
  { name: 'Oct', revenue: 35200, orders: 152, profit: 11800 },
  { name: 'Nov', revenue: 42100, orders: 178, profit: 14200 },
  { name: 'Dec', revenue: 48900, orders: 205, profit: 16500 },
];

export const salesByCategoryData: ChartDataPoint[] = [
  { name: 'Electronics', revenue: 125400 },
  { name: 'Computers', revenue: 89200 },
  { name: 'Accessories', revenue: 45600 },
  { name: 'Gaming', revenue: 34100 },
  { name: 'Storage', revenue: 18900 },
  { name: 'Software', revenue: 12400 },
  { name: 'Networking', revenue: 8700 },
  { name: 'Printers', revenue: 5800 },
];

export const weeklySalesData: ChartDataPoint[] = [
  { name: 'Mon', revenue: 4200, orders: 18 },
  { name: 'Tue', revenue: 3800, orders: 15 },
  { name: 'Wed', revenue: 5100, orders: 22 },
  { name: 'Thu', revenue: 4600, orders: 19 },
  { name: 'Fri', revenue: 6200, orders: 28 },
  { name: 'Sat', revenue: 7800, orders: 35 },
  { name: 'Sun', revenue: 5400, orders: 24 },
];

export const topProductsData = [
  { name: 'iPhone 15 Pro Max', sales: 156, revenue: 218244 },
  { name: 'MacBook Pro 16" M3', sales: 42, revenue: 117558 },
  { name: 'AirPods Pro 2nd Gen', sales: 189, revenue: 47061 },
  { name: 'Samsung Galaxy S24 Ultra', sales: 98, revenue: 127302 },
  { name: 'iPad Air M2', sales: 67, revenue: 46833 },
];

export const branchPerformanceData = [
  { name: 'Main Street Store', revenue: 142500, orders: 520, percentage: 49.5 },
  { name: 'Mall Outlet', revenue: 78200, orders: 310, percentage: 27.2 },
  { name: 'Downtown Branch', revenue: 45800, orders: 247, percentage: 15.9 },
  { name: 'Airport Store', revenue: 21150, orders: 170, percentage: 7.4 },
];

// ============================================
// ATTENDANCE
// ============================================

export const mockAttendance: Attendance[] = [
  { id: 'att_001', date: '2026-06-08', clockIn: '2026-06-08T08:02:00Z', clockOut: '2026-06-08T16:05:00Z', employeeId: 'emp_002', employeeName: 'Maria Rodriguez' },
  { id: 'att_002', date: '2026-06-08', clockIn: '2026-06-08T09:10:00Z', clockOut: undefined, employeeId: 'emp_003', employeeName: 'Kevin Nguyen' },
  { id: 'att_003', date: '2026-06-08', clockIn: '2026-06-08T08:00:00Z', clockOut: '2026-06-08T16:02:00Z', employeeId: 'emp_008', employeeName: 'Emma Davis' },
  { id: 'att_004', date: '2026-06-08', clockIn: '2026-06-08T07:55:00Z', clockOut: '2026-06-08T15:58:00Z', employeeId: 'emp_001', employeeName: 'Alex Thompson' },
  { id: 'att_005', date: '2026-06-08', clockIn: '2026-06-08T09:30:00Z', clockOut: undefined, employeeId: 'emp_007', employeeName: 'Jordan Taylor' },
  { id: 'att_006', date: '2026-06-07', clockIn: '2026-06-07T08:05:00Z', clockOut: '2026-06-07T16:10:00Z', employeeId: 'emp_002', employeeName: 'Maria Rodriguez' },
  { id: 'att_007', date: '2026-06-07', clockIn: '2026-06-07T08:58:00Z', clockOut: '2026-06-07T17:05:00Z', employeeId: 'emp_003', employeeName: 'Kevin Nguyen' },
  { id: 'att_008', date: '2026-06-07', clockIn: '2026-06-07T08:00:00Z', clockOut: '2026-06-07T16:00:00Z', employeeId: 'emp_001', employeeName: 'Alex Thompson' },
  { id: 'att_009', date: '2026-06-06', clockIn: '2026-06-06T08:00:00Z', clockOut: '2026-06-06T16:30:00Z', employeeId: 'emp_002', employeeName: 'Maria Rodriguez' },
  { id: 'att_010', date: '2026-06-06', clockIn: '2026-06-06T09:00:00Z', clockOut: '2026-06-06T17:15:00Z', employeeId: 'emp_005', employeeName: 'Derek Williams' },
];

// ============================================
// LOYALTY ACTIVITY
// ============================================

export const mockLoyaltyActivity = [
  { id: 'la_001', type: 'earned' as const, customerId: 'cust_003', customerName: 'Robert Martinez', points: 450, description: 'Purchase - TXN-2026-0002', date: '2026-06-07T15:15:00Z' },
  { id: 'la_002', type: 'earned' as const, customerId: 'cust_001', customerName: 'James Wilson', points: 120, description: 'Purchase - TXN-2026-0001', date: '2026-06-07T14:30:00Z' },
  { id: 'la_003', type: 'redeemed' as const, customerId: 'cust_007', customerName: 'David Kim', points: 500, description: 'Redeemed for $5 discount', date: '2026-06-07T12:00:00Z' },
  { id: 'la_004', type: 'earned' as const, customerId: 'cust_005', customerName: 'Michael Brown', points: 200, description: 'Purchase - TXN-2026-0003', date: '2026-06-07T16:00:00Z' },
  { id: 'la_005', type: 'earned' as const, customerId: 'cust_010', customerName: 'Jennifer Garcia', points: 680, description: 'Wholesale order #WO-0142', date: '2026-06-06T10:30:00Z' },
  { id: 'la_006', type: 'redeemed' as const, customerId: 'cust_003', customerName: 'Robert Martinez', points: 1000, description: 'Redeemed for $10 discount', date: '2026-06-06T09:15:00Z' },
  { id: 'la_007', type: 'earned' as const, customerId: 'cust_009', customerName: 'Thomas Lee', points: 350, description: 'Purchase - TXN-2026-0007', date: '2026-06-06T11:00:00Z' },
  { id: 'la_008', type: 'bonus' as const, customerId: 'cust_001', customerName: 'James Wilson', points: 250, description: 'VIP bonus - Anniversary reward', date: '2026-06-05T08:00:00Z' },
];
