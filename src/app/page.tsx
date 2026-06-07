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
import {
  Package as PackageIcon,
  Tag,
  Users as UsersIcon,
  Truck,
  UserCog as UserCogIcon,
  Receipt,
  BarChart3 as BarChart3Icon,
  Building2,
  Settings as SettingsIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

function PlaceholderPage({ title, icon: Icon }: { title: string; icon: React.ElementType }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
      <Icon className="h-16 w-16 text-muted-foreground/30" />
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="max-w-md text-muted-foreground">
        The {title} module is coming soon. Navigate to other sections using the sidebar.
      </p>
    </div>
  );
}

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
    case 'transactions':
      return <TransactionsPage />;
    case 'reports':
      return <ReportsPage />;
    case 'branches':
      return <SettingsPage />;
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
