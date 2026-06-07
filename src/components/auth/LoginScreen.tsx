'use client';

import { useState, useCallback } from 'react';
import {
  Cloud,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  Smartphone,
  ArrowLeft,
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { cn } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@/components/ui/input-otp';

type LoginStep = 'credentials' | 'mfa';

export default function LoginScreen() {
  const { login, isLoading } = useAuthStore();

  const [step, setStep] = useState<LoginStep>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
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
        // If MFA was required, login would not complete yet - but our mock always succeeds.
        // In a real app, you'd check the response to determine if MFA is needed.
      } catch {
        setError('Invalid email or password. Please try again.');
      }
    },
    [email, password, login]
  );

  const handleMfaVerify = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');

      if (mfaCode.length < 6) {
        setError('Please enter the complete 6-digit code.');
        return;
      }

      try {
        await login(email, password);
      } catch {
        setError('Invalid verification code. Please try again.');
      }
    },
    [mfaCode, email, password, login]
  );

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
      <div className="flex flex-1 items-center justify-center bg-background px-4 py-8 sm:px-6 lg:px-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Cloud className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">CloudPOS</span>
          </div>

          {step === 'credentials' ? (
            <>
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
                {error && (
                  <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                    {error}
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
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              {/* Social login buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="h-11 gap-2"
                  type="button"
                  onClick={() => {
                    setEmail('admin@techretail.com');
                    setPassword('demo1234');
                  }}
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </Button>
                <Button variant="outline" className="h-11 gap-2" type="button">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 21.99 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 21.99C7.79 22.03 6.8 20.68 5.96 19.47C4.25 16.97 2.97 12.45 4.7 9.39C5.55 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
                  </svg>
                  Apple
                </Button>
              </div>

              <p className="mt-8 text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <button className="font-semibold text-primary hover:text-primary/80">
                  Contact sales
                </button>
              </p>
            </>
          ) : (
            /* MFA Step */
            <>
              <button
                onClick={() => {
                  setStep('credentials');
                  setMfaCode('');
                  setError('');
                }}
                className="mb-6 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </button>

              <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Two-factor authentication
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>

              <form onSubmit={handleMfaVerify} className="space-y-6">
                {error && (
                  <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <div className="flex justify-center">
                  <InputOTP maxLength={6} value={mfaCode} onChange={setMfaCode}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <Button
                  type="submit"
                  className="h-11 w-full text-sm font-semibold"
                  disabled={isLoading || mfaCode.length < 6}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify'
                  )}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Didn&apos;t receive a code?{' '}
                <button className="font-semibold text-primary hover:text-primary/80">
                  Resend
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
