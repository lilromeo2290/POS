'use client';

import { useState, useCallback } from 'react';
import {
  Cloud,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  Smartphone,
  Shield,
  UserCog,
  User,
  Eye as ViewIcon,
} from 'lucide-react';
import { useAuthStore, DEMO_ACCOUNTS } from '@/store';
import { cn, getInitials } from '@/lib/helpers';
import type { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// ============================================
// ROLE STYLING CONFIG
// ============================================
const ROLE_STYLES: Record<string, { icon: React.ElementType; color: string; bg: string; border: string; badge: string; darkBg: string; darkBorder: string }> = {
  super_admin: {
    icon: Shield,
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-950/30',
    border: 'border-red-200 dark:border-red-800',
    badge: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
    darkBg: 'hover:bg-red-100 dark:hover:bg-red-950/50',
    darkBorder: '',
  },
  admin: {
    icon: ShieldCheck,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-200 dark:border-amber-800',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    darkBg: 'hover:bg-amber-100 dark:hover:bg-amber-950/50',
    darkBorder: '',
  },
  manager: {
    icon: UserCog,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-200 dark:border-blue-800',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    darkBg: 'hover:bg-blue-100 dark:hover:bg-blue-950/50',
    darkBorder: '',
  },
  cashier: {
    icon: User,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-200 dark:border-emerald-800',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    darkBg: 'hover:bg-emerald-100 dark:hover:bg-emerald-950/50',
    darkBorder: '',
  },
  viewer: {
    icon: ViewIcon,
    color: 'text-gray-600 dark:text-gray-400',
    bg: 'bg-gray-50 dark:bg-gray-950/30',
    border: 'border-gray-200 dark:border-gray-800',
    badge: 'bg-gray-100 text-gray-800 dark:bg-gray-800/40 dark:text-gray-300',
    darkBg: 'hover:bg-gray-100 dark:hover:bg-gray-950/50',
    darkBorder: '',
  },
};

// Demo accounts in a nice order
const DEMO_ACCOUNT_LIST = [
  { email: 'super@techretail.com', label: 'Super Admin', role: 'super_admin' as UserRole },
  { email: 'admin@techretail.com', label: 'Administrator', role: 'admin' as UserRole },
  { email: 'manager@techretail.com', label: 'Manager', role: 'manager' as UserRole },
  { email: 'cashier@techretail.com', label: 'Cashier', role: 'cashier' as UserRole },
  { email: 'viewer@techretail.com', label: 'Viewer', role: 'viewer' as UserRole },
];

export default function LoginScreen() {
  const { login, isLoading, loginError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');

      if (!email.trim() || !password.trim()) {
        setError('Please enter your email and password.');
        return;
      }

      try {
        await login(email, password);
      } catch {
        setError('Invalid email or password. Please try again.');
      }
    },
    [email, password, login]
  );

  const handleDemoLogin = useCallback(
    async (demoEmail: string) => {
      const account = DEMO_ACCOUNTS[demoEmail];
      if (!account) return;
      setEmail(demoEmail);
      setPassword(account.password);
      setError('');
      try {
        await login(demoEmail, account.password);
      } catch {
        setError('Login failed. Please try again.');
      }
    },
    [login]
  );

  const displayError = error || loginError;

  return (
    <div className="flex min-h-screen">
      {/* Left side - Branded illustration */}
      <div className="relative hidden flex-1 items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 lg:flex">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Floating decorative circles */}
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute left-1/3 top-1/4 h-48 w-48 rounded-full bg-white/5 blur-2xl" />

        <div className="relative z-10 flex max-w-md flex-col items-center px-8 text-center">
          {/* Logo */}
          <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 shadow-2xl backdrop-blur-sm">
            <Cloud className="h-10 w-10 text-white" />
          </div>

          <h2 className="mb-3 text-3xl font-bold tracking-tight text-white">CloudPOS</h2>
          <p className="mb-8 text-lg font-medium text-white/80">Enterprise Point of Sale</p>

          <div className="space-y-4 text-white/70">
            <div className="flex items-center gap-3 rounded-xl bg-white/10 px-5 py-3 backdrop-blur-sm">
              <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-300" />
              <span className="text-sm">Bank-grade security & encryption</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white/10 px-5 py-3 backdrop-blur-sm">
              <Smartphone className="h-5 w-5 shrink-0 text-cyan-300" />
              <span className="text-sm">Works on any device, anywhere</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white/10 px-5 py-3 backdrop-blur-sm">
              <Cloud className="h-5 w-5 shrink-0 text-teal-300" />
              <span className="text-sm">Real-time cloud synchronization</span>
            </div>
          </div>

          <p className="mt-10 text-xs text-white/40">Trusted by 2,500+ businesses worldwide</p>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-4 py-8 sm:px-6 lg:px-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Cloud className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">CloudPOS</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Error message */}
            {displayError && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {displayError}
              </div>
            )}

            {/* Email field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={isLoading}
                className="h-11"
              />
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  className="text-xs font-medium text-primary hover:text-primary/80"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  disabled={isLoading}
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
                disabled={isLoading}
              />
              <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground">
                Remember me for 30 days
              </Label>
            </div>

            {/* Sign in button */}
            <Button
              type="submit"
              className="h-11 w-full text-sm font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Demo accounts</span>
            </div>
          </div>

          {/* Demo Account Cards */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {DEMO_ACCOUNT_LIST.map((demo) => {
              const account = DEMO_ACCOUNTS[demo.email];
              const style = ROLE_STYLES[demo.role];
              const Icon = style.icon;
              return (
                <Card
                  key={demo.email}
                  className={cn(
                    'cursor-pointer border transition-all duration-200 hover:shadow-md',
                    style.border,
                    style.darkBg
                  )}
                  onClick={() => handleDemoLogin(demo.email)}
                >
                  <CardContent className="flex items-center gap-3 p-3">
                    <Avatar className="h-9 w-9 shrink-0">
                      <AvatarFallback className={cn('text-xs font-semibold', style.bg, style.color)}>
                        {getInitials(account.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{account.name}</p>
                      <div className="flex items-center gap-1.5">
                        <Icon className={cn('h-3 w-3', style.color)} />
                        <span className={cn('text-[11px] font-medium', style.color)}>{demo.label}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Click any demo account above to sign in with that role. Each role has different access levels and dashboard views.
          </p>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <button className="font-semibold text-primary hover:text-primary/80">
              Contact sales
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
