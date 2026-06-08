'use client';

import { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { useNavStore, useAuthStore } from '@/store';
import { cn } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import AppSidebar from '@/components/layout/AppSidebar';
import AppHeader from '@/components/layout/AppHeader';
import LoginScreen from '@/components/auth/LoginScreen';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { sidebarOpen, toggleSidebar } = useNavStore();
  const { isAuthenticated } = useAuthStore();

  // Reset to dashboard when authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      useNavStore.getState().setPage('dashboard');
    }
  }, [isAuthenticated]);

  // Close mobile sidebar on route/page change
  const handleCloseSidebar = useCallback(() => {
    if (sidebarOpen) {
      toggleSidebar();
    }
  }, [sidebarOpen, toggleSidebar]);

  // Close sidebar when clicking overlay on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <AppSidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={handleCloseSidebar}
            aria-hidden="true"
          />
          {/* Sidebar content */}
          <div className="relative z-50 flex h-full w-64 animate-in slide-in-from-left duration-300">
            <AppSidebar />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-3 z-50 text-muted-foreground hover:text-foreground lg:hidden"
              onClick={handleCloseSidebar}
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
