'use client';

import AppLayout from '@/components/layout/AppLayout';
import { useNavStore } from '@/store';
import DashboardPage from '@/components/dashboard/DashboardPage';
import PosTerminal from '@/components/pos/PosTerminal';
import InventoryPage from '@/components/inventory/InventoryPage';
import CustomersPage from '@/components/customers/CustomersPage';
import EmployeesPage from '@/components/employees/EmployeesPage';
import ReportsPage from '@/components/reports/ReportsPage';
import SettingsPage from '@/components/settings/SettingsPage';
import TransactionsPage from '@/components/transactions/TransactionsPage';
import SuppliersPage from '@/components/suppliers/SuppliersPage';
import UsersPage from '@/components/users/UsersPage';

function PageContent() {
  const { currentPage } = useNavStore();

  switch (currentPage) {
    case 'dashboard':
      return <DashboardPage />;
    case 'pos':
      return <PosTerminal />;
    case 'inventory':
      return <InventoryPage />;
    case 'products':
      return <InventoryPage />;
    case 'customers':
      return <CustomersPage />;
    case 'suppliers':
      return <SuppliersPage />;
    case 'employees':
      return <EmployeesPage />;
    case 'users':
      return <UsersPage />;
    case 'transactions':
      return <TransactionsPage />;
    case 'reports':
      return <ReportsPage />;
    case 'settings':
      return <SettingsPage />;
    default:
      return <DashboardPage />;
  }
}

export default function Home() {
  return (
    <AppLayout>
      <PageContent />
    </AppLayout>
  );
}
