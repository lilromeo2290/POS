'use client';

import { useState } from 'react';
import {
  Building2,
  CreditCard,
  DollarSign,
  Shield,
  Bell,
  Plug,
  Save,
  Plus,
  Edit,
  Power,
  Upload,
  Check,
  X,
  Crown,
  Star,
  Zap,
  ChevronRight,
  Lock,
  Smartphone,
  Monitor,
  Globe,
  Mail,
  MessageSquare,
  AlertTriangle,
  Clock,
  LogOut,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { mockBusiness } from '@/data/mockData';
import { formatCurrency, formatDate, cn } from '@/lib/helpers';

// ============================================
// MOCK DATA FOR SETTINGS
// ============================================
const activeSessions = [
  { id: 'sess_01', device: 'Chrome on MacBook Pro', ip: '192.168.1.105', lastActive: '2 minutes ago', current: true },
  { id: 'sess_02', device: 'Safari on iPhone 15', ip: '192.168.1.42', lastActive: '15 minutes ago', current: false },
  { id: 'sess_03', device: 'Firefox on Windows PC', ip: '10.0.0.88', lastActive: '2 hours ago', current: false },
  { id: 'sess_04', device: 'Chrome on iPad', ip: '192.168.1.78', lastActive: '1 day ago', current: false },
];

const auditLog = [
  { id: 'al_01', action: 'Updated product pricing', user: 'Alex Thompson', timestamp: '2026-06-07T18:30:00Z', type: 'update' },
  { id: 'al_02', action: 'Created new branch: Airport Store', user: 'Alex Thompson', timestamp: '2026-06-07T14:15:00Z', type: 'create' },
  { id: 'al_03', action: 'Processed refund TXN-2026-0006', user: 'Maria Rodriguez', timestamp: '2026-06-06T10:30:00Z', type: 'refund' },
  { id: 'al_04', action: 'Modified employee salary', user: 'Alex Thompson', timestamp: '2026-06-05T16:00:00Z', type: 'update' },
  { id: 'al_05', action: 'Stock adjustment: iPhone 15 Pro Max', user: 'Rachel Green', timestamp: '2026-06-05T09:45:00Z', type: 'update' },
  { id: 'al_06', action: 'User login from new device', user: 'Alex Thompson', timestamp: '2026-06-04T08:20:00Z', type: 'auth' },
  { id: 'al_07', action: 'Exported financial report', user: 'Olivia Brown', timestamp: '2026-06-03T17:10:00Z', type: 'export' },
];

const billingHistory = [
  { id: 'bill_01', date: '2026-06-01', amount: 99, status: 'paid', invoice: 'INV-2026-006' },
  { id: 'bill_02', date: '2026-05-01', amount: 99, status: 'paid', invoice: 'INV-2026-005' },
  { id: 'bill_03', date: '2026-04-01', amount: 99, status: 'paid', invoice: 'INV-2026-004' },
  { id: 'bill_04', date: '2026-03-01', amount: 99, status: 'paid', invoice: 'INV-2026-003' },
  { id: 'bill_05', date: '2026-02-01', amount: 99, status: 'paid', invoice: 'INV-2026-002' },
  { id: 'bill_06', date: '2026-01-01', amount: 99, status: 'paid', invoice: 'INV-2026-001' },
];

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    branches: 1,
    users: 3,
    features: ['Basic POS', 'Inventory tracking', 'Sales reports', 'Email support', 'Single branch'],
    current: false,
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 99,
    branches: 5,
    users: 15,
    features: ['Advanced POS', 'Multi-branch support', 'Full analytics', 'Priority support', 'API access', 'Custom receipts', 'Employee management'],
    current: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 249,
    branches: 50,
    users: 100,
    features: ['Everything in Professional', 'Unlimited branches', 'Dedicated account manager', 'Custom integrations', 'SLA guarantee', 'Advanced security', 'White-label option', 'Audit logs'],
    current: false,
  },
];

const integrations = {
  payment: [
    { id: 'int_01', name: 'Stripe', description: 'Accept card payments online and in-store', connected: true, logo: '💳' },
    { id: 'int_02', name: 'Paystack', description: 'African payment processing platform', connected: false, logo: '🟣' },
    { id: 'int_03', name: 'Flutterwave', description: 'Pan-African payment gateway', connected: false, logo: '🟠' },
  ],
  accounting: [
    { id: 'int_04', name: 'QuickBooks', description: 'Sync invoices and financial data', connected: false, logo: '🟢' },
    { id: 'int_05', name: 'Xero', description: 'Cloud-based accounting integration', connected: false, logo: '🔵' },
  ],
  ecommerce: [
    { id: 'int_06', name: 'Shopify', description: 'Sync products and orders with Shopify', connected: false, logo: '🟢' },
    { id: 'int_07', name: 'WooCommerce', description: 'Connect your WordPress store', connected: false, logo: '🟣' },
  ],
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function SettingsPage() {
  const [generalForm, setGeneralForm] = useState({
    name: mockBusiness.name,
    email: mockBusiness.email,
    phone: mockBusiness.phone || '',
    industry: mockBusiness.industry,
    currency: mockBusiness.currency,
    timezone: mockBusiness.timezone,
    taxRate: String(mockBusiness.taxRate),
  });
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [addBranchOpen, setAddBranchOpen] = useState(false);
  const [newBranch, setNewBranch] = useState({ name: '', code: '', address: '', city: '', phone: '', email: '' });

  // Notification preferences
  const [notifPrefs, setNotifPrefs] = useState({
    lowStock: { email: true, sms: false, push: true },
    newOrders: { email: true, sms: false, push: true },
    subscription: { email: true, sms: false, push: false },
    payment: { email: true, sms: true, push: false },
    system: { email: true, sms: false, push: false },
  });

  const toggleNotif = (category: string, channel: 'email' | 'sms' | 'push') => {
    setNotifPrefs((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [channel]: !prev[category as keyof typeof prev][channel],
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings & Configuration</h1>
        <p className="text-sm text-muted-foreground">Manage your business settings, subscription, and integrations</p>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto gap-1">
          <TabsTrigger value="general" className="text-xs sm:text-sm">
            <Building2 className="mr-1.5 h-4 w-4 hidden sm:inline" />
            General
          </TabsTrigger>
          <TabsTrigger value="branches" className="text-xs sm:text-sm">
            <Globe className="mr-1.5 h-4 w-4 hidden sm:inline" />
            Branches
          </TabsTrigger>
          <TabsTrigger value="subscription" className="text-xs sm:text-sm">
            <CreditCard className="mr-1.5 h-4 w-4 hidden sm:inline" />
            Plan
          </TabsTrigger>
          <TabsTrigger value="security" className="text-xs sm:text-sm">
            <Shield className="mr-1.5 h-4 w-4 hidden sm:inline" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs sm:text-sm">
            <Bell className="mr-1.5 h-4 w-4 hidden sm:inline" />
            Alerts
          </TabsTrigger>
          <TabsTrigger value="integrations" className="text-xs sm:text-sm col-span-3 lg:col-span-1">
            <Plug className="mr-1.5 h-4 w-4 hidden sm:inline" />
            Integrations
          </TabsTrigger>
        </TabsList>

        {/* ============================================ */}
        {/* TAB 1: GENERAL                              */}
        {/* ============================================ */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Business Information</CardTitle>
              <CardDescription>Update your business details and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="biz-name">Business Name</Label>
                  <Input id="biz-name" value={generalForm.name} onChange={(e) => setGeneralForm({ ...generalForm, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="biz-email">Email Address</Label>
                  <Input id="biz-email" type="email" value={generalForm.email} onChange={(e) => setGeneralForm({ ...generalForm, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="biz-phone">Phone Number</Label>
                  <Input id="biz-phone" value={generalForm.phone} onChange={(e) => setGeneralForm({ ...generalForm, phone: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="biz-industry">Industry</Label>
                  <Select value={generalForm.industry} onValueChange={(v) => setGeneralForm({ ...generalForm, industry: v })}>
                    <SelectTrigger id="biz-industry">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="restaurant">Restaurant</SelectItem>
                      <SelectItem value="pharmacy">Pharmacy</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="wholesale">Wholesale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="biz-currency">Currency</Label>
                  <Select value={generalForm.currency} onValueChange={(v) => setGeneralForm({ ...generalForm, currency: v })}>
                    <SelectTrigger id="biz-currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="NGN">NGN - Nigerian Naira</SelectItem>
                      <SelectItem value="KES">KES - Kenyan Shilling</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="biz-timezone">Timezone</Label>
                  <Select value={generalForm.timezone} onValueChange={(v) => setGeneralForm({ ...generalForm, timezone: v })}>
                    <SelectTrigger id="biz-timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      <SelectItem value="Europe/London">London (GMT)</SelectItem>
                      <SelectItem value="Africa/Lagos">Lagos (WAT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="biz-tax">Default Tax Rate (%)</Label>
                  <Input id="biz-tax" type="number" step="0.1" value={generalForm.taxRate} onChange={(e) => setGeneralForm({ ...generalForm, taxRate: e.target.value })} />
                </div>
              </div>

              <Separator />

              {/* Logo Upload */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Business Logo</Label>
                <div className="flex items-center gap-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/50">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xl font-bold">
                        {generalForm.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Logo
                    </Button>
                    <p className="text-xs text-muted-foreground">PNG, JPG up to 2MB. Recommended 200x200px.</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-end border-t pt-6">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* ============================================ */}
        {/* TAB 2: BRANCHES                             */}
        {/* ============================================ */}
        <TabsContent value="branches" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Branch Management</h3>
              <p className="text-sm text-muted-foreground">{mockBusiness.branches.length} branches registered</p>
            </div>
            <Dialog open={addBranchOpen} onOpenChange={setAddBranchOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Branch
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Branch</DialogTitle>
                  <DialogDescription>Create a new branch location for your business</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="br-name">Branch Name</Label>
                      <Input id="br-name" placeholder="e.g., Westside Store" value={newBranch.name} onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="br-code">Branch Code</Label>
                      <Input id="br-code" placeholder="e.g., WSS" maxLength={3} value={newBranch.code} onChange={(e) => setNewBranch({ ...newBranch, code: e.target.value.toUpperCase() })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="br-address">Address</Label>
                    <Input id="br-address" placeholder="Street address" value={newBranch.address} onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="br-city">City</Label>
                      <Input id="br-city" placeholder="City" value={newBranch.city} onChange={(e) => setNewBranch({ ...newBranch, city: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="br-phone">Phone</Label>
                      <Input id="br-phone" placeholder="+1-555-0000" value={newBranch.phone} onChange={(e) => setNewBranch({ ...newBranch, phone: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="br-email">Email</Label>
                    <Input id="br-email" type="email" placeholder="branch@techretail.com" value={newBranch.email} onChange={(e) => setNewBranch({ ...newBranch, email: e.target.value })} />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={() => setAddBranchOpen(false)} className="bg-emerald-600 hover:bg-emerald-700">Create Branch</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {mockBusiness.branches.map((branch) => (
              <Card key={branch.id} className={cn('transition-shadow hover:shadow-md', !branch.isActive && 'opacity-60')}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 dark:bg-sky-900/30">
                        <Building2 className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-semibold">{branch.name}</CardTitle>
                        <p className="text-xs font-mono text-muted-foreground">{branch.code}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {branch.isHeadOffice && (
                        <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-[10px] px-1.5">
                          <Crown className="mr-1 h-3 w-3" />
                          HQ
                        </Badge>
                      )}
                      <Badge
                        variant="secondary"
                        className={cn(
                          'text-[10px] px-1.5',
                          branch.isActive
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        )}
                      >
                        {branch.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 pb-4">
                  {branch.address && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Globe className="h-3 w-3" />
                      <span>{branch.address}{branch.city ? `, ${branch.city}` : ''}</span>
                    </div>
                  )}
                  {branch.phone && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Smartphone className="h-3 w-3" />
                      <span>{branch.phone}</span>
                    </div>
                  )}
                  {branch.email && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span>{branch.email}</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t pt-3 gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="mr-1.5 h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      'flex-1',
                      branch.isActive
                        ? 'hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/20 dark:hover:text-red-400'
                        : 'hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400'
                    )}
                  >
                    <Power className="mr-1.5 h-3 w-3" />
                    {branch.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ============================================ */}
        {/* TAB 3: SUBSCRIPTION                         */}
        {/* ============================================ */}
        <TabsContent value="subscription" className="space-y-6">
          {/* Current Plan */}
          <Card className="border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-900/10">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                    <Star className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold">Professional Plan</h3>
                      <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Current</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(99)}/month &middot; Renews on {formatDate(mockBusiness.subscription.currentPeriodEnd || '2026-01-31')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Branches Used</p>
                    <p className="text-sm font-medium">4 / 5</p>
                  </div>
                  <Progress value={80} className="w-24" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plan Comparison */}
          <div className="grid gap-4 sm:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={cn(
                  'relative transition-shadow hover:shadow-md',
                  plan.current && 'border-2 border-emerald-500 shadow-sm'
                )}
              >
                {plan.current && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-emerald-600 text-white px-3">Current Plan</Badge>
                  </div>
                )}
                <CardHeader className="text-center pt-6">
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    {plan.id === 'starter' && <Zap className="h-5 w-5 text-amber-600" />}
                    {plan.id === 'professional' && <Star className="h-5 w-5 text-sky-600" />}
                    {plan.id === 'enterprise' && <Crown className="h-5 w-5 text-violet-600" />}
                  </div>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">/mo</span>
                  </div>
                  <div className="mt-2 flex justify-center gap-4 text-xs text-muted-foreground">
                    <span>{plan.branches} {plan.branches === 1 ? 'branch' : 'branches'}</span>
                    <span>{plan.users} users</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 pb-4">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="border-t pt-4">
                  {plan.current ? (
                    <Button variant="outline" className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : plan.price < 99 ? (
                    <Button variant="outline" className="w-full">
                      Downgrade
                    </Button>
                  ) : (
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                      Upgrade
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Billing History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Billing History</CardTitle>
              <CardDescription>Recent invoice history</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billingHistory.map((bill) => (
                    <TableRow key={bill.id}>
                      <TableCell className="font-medium font-mono text-sm">{bill.invoice}</TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(bill.date)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(bill.amount)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs">
                          {bill.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-xs">Download</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="justify-center border-t pt-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">
                    Cancel Subscription
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will downgrade your account at the end of the current billing period. You will lose access to Professional features on {formatDate(mockBusiness.subscription.currentPeriodEnd || '2026-01-31')}. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-600 hover:bg-red-700">Yes, Cancel</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* ============================================ */}
        {/* TAB 4: SECURITY                             */}
        {/* ============================================ */}
        <TabsContent value="security" className="space-y-6">
          {/* Password Change */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Change Password</CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-pw">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current-pw"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordForm.current}
                    onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                    placeholder="Enter current password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </Button>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="new-pw">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new-pw"
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordForm.new}
                      onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                      placeholder="Enter new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-pw">Confirm New Password</Label>
                  <Input
                    id="confirm-pw"
                    type="password"
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              {passwordForm.new && passwordForm.confirm && passwordForm.new !== passwordForm.confirm && (
                <p className="text-xs text-red-600 dark:text-red-400">Passwords do not match</p>
              )}
            </CardContent>
            <CardFooter className="justify-end border-t pt-4">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Lock className="mr-2 h-4 w-4" />
                Update Password
              </Button>
            </CardFooter>
          </Card>

          {/* MFA Toggle */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Multi-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/30">
                    <Shield className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Authenticator App</p>
                    <p className="text-xs text-muted-foreground">
                      {mfaEnabled ? 'MFA is enabled on your account' : 'Enable MFA for enhanced security'}
                    </p>
                  </div>
                </div>
                <Switch checked={mfaEnabled} onCheckedChange={setMfaEnabled} />
              </div>
              {mfaEnabled && (
                <div className="mt-4 rounded-lg border bg-muted/50 p-4">
                  <p className="text-sm font-medium">Setup Instructions:</p>
                  <ol className="mt-2 space-y-1 text-xs text-muted-foreground list-decimal list-inside">
                    <li>Download an authenticator app (Google Authenticator, Authy, etc.)</li>
                    <li>Scan the QR code that will be displayed</li>
                    <li>Enter the 6-digit verification code to confirm setup</li>
                  </ol>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Active Sessions</CardTitle>
              <CardDescription>Manage your active login sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                        {session.device.includes('iPhone') || session.device.includes('iPad') ? (
                          <Smartphone className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Monitor className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{session.device}</p>
                          {session.current && (
                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[10px] px-1.5">
                              Current
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          IP: {session.ip} &middot; {session.lastActive}
                        </p>
                      </div>
                    </div>
                    {!session.current && (
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">
                        <LogOut className="mr-1.5 h-3 w-3" />
                        Revoke
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Audit Log */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Audit Log</CardTitle>
              <CardDescription>Recent actions tracked in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-72 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLog.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium text-sm">{log.action}</TableCell>
                        <TableCell className="text-muted-foreground">{log.user}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(log.timestamp)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              'text-[10px]',
                              log.type === 'create' && 'border-emerald-300 text-emerald-700 dark:border-emerald-700 dark:text-emerald-400',
                              log.type === 'update' && 'border-sky-300 text-sky-700 dark:border-sky-700 dark:text-sky-400',
                              log.type === 'refund' && 'border-red-300 text-red-700 dark:border-red-700 dark:text-red-400',
                              log.type === 'auth' && 'border-violet-300 text-violet-700 dark:border-violet-700 dark:text-violet-400',
                              log.type === 'export' && 'border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-400',
                            )}
                          >
                            {log.type}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================ */}
        {/* TAB 5: NOTIFICATIONS                        */}
        {/* ============================================ */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Notification Preferences</CardTitle>
              <CardDescription>Choose how and when you want to be notified</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Header Row */}
                <div className="grid grid-cols-4 gap-4 border-b pb-3">
                  <div className="col-span-1" />
                  <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    Email
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <MessageSquare className="h-3.5 w-3.5" />
                    SMS
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Bell className="h-3.5 w-3.5" />
                    Push
                  </div>
                </div>

                {/* Low Stock Alerts */}
                <div className="grid grid-cols-4 gap-4 items-center">
                  <div className="col-span-1 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <div>
                      <p className="text-sm font-medium">Low Stock Alerts</p>
                      <p className="text-xs text-muted-foreground">When items are running low</p>
                    </div>
                  </div>
                  <div className="flex justify-center"><Switch checked={notifPrefs.lowStock.email} onCheckedChange={() => toggleNotif('lowStock', 'email')} /></div>
                  <div className="flex justify-center"><Switch checked={notifPrefs.lowStock.sms} onCheckedChange={() => toggleNotif('lowStock', 'sms')} /></div>
                  <div className="flex justify-center"><Switch checked={notifPrefs.lowStock.push} onCheckedChange={() => toggleNotif('lowStock', 'push')} /></div>
                </div>

                <Separator />

                {/* New Orders */}
                <div className="grid grid-cols-4 gap-4 items-center">
                  <div className="col-span-1 flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-emerald-500" />
                    <div>
                      <p className="text-sm font-medium">New Orders</p>
                      <p className="text-xs text-muted-foreground">When a new order is placed</p>
                    </div>
                  </div>
                  <div className="flex justify-center"><Switch checked={notifPrefs.newOrders.email} onCheckedChange={() => toggleNotif('newOrders', 'email')} /></div>
                  <div className="flex justify-center"><Switch checked={notifPrefs.newOrders.sms} onCheckedChange={() => toggleNotif('newOrders', 'sms')} /></div>
                  <div className="flex justify-center"><Switch checked={notifPrefs.newOrders.push} onCheckedChange={() => toggleNotif('newOrders', 'push')} /></div>
                </div>

                <Separator />

                {/* Subscription Reminders */}
                <div className="grid grid-cols-4 gap-4 items-center">
                  <div className="col-span-1 flex items-center gap-2">
                    <Crown className="h-4 w-4 text-violet-500" />
                    <div>
                      <p className="text-sm font-medium">Subscription Reminders</p>
                      <p className="text-xs text-muted-foreground">Renewal and billing alerts</p>
                    </div>
                  </div>
                  <div className="flex justify-center"><Switch checked={notifPrefs.subscription.email} onCheckedChange={() => toggleNotif('subscription', 'email')} /></div>
                  <div className="flex justify-center"><Switch checked={notifPrefs.subscription.sms} onCheckedChange={() => toggleNotif('subscription', 'sms')} /></div>
                  <div className="flex justify-center"><Switch checked={notifPrefs.subscription.push} onCheckedChange={() => toggleNotif('subscription', 'push')} /></div>
                </div>

                <Separator />

                {/* Payment Alerts */}
                <div className="grid grid-cols-4 gap-4 items-center">
                  <div className="col-span-1 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-sky-500" />
                    <div>
                      <p className="text-sm font-medium">Payment Alerts</p>
                      <p className="text-xs text-muted-foreground">Payment received or failed</p>
                    </div>
                  </div>
                  <div className="flex justify-center"><Switch checked={notifPrefs.payment.email} onCheckedChange={() => toggleNotif('payment', 'email')} /></div>
                  <div className="flex justify-center"><Switch checked={notifPrefs.payment.sms} onCheckedChange={() => toggleNotif('payment', 'sms')} /></div>
                  <div className="flex justify-center"><Switch checked={notifPrefs.payment.push} onCheckedChange={() => toggleNotif('payment', 'push')} /></div>
                </div>

                <Separator />

                {/* System Updates */}
                <div className="grid grid-cols-4 gap-4 items-center">
                  <div className="col-span-1 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <div>
                      <p className="text-sm font-medium">System Updates</p>
                      <p className="text-xs text-muted-foreground">Platform updates and maintenance</p>
                    </div>
                  </div>
                  <div className="flex justify-center"><Switch checked={notifPrefs.system.email} onCheckedChange={() => toggleNotif('system', 'email')} /></div>
                  <div className="flex justify-center"><Switch checked={notifPrefs.system.sms} onCheckedChange={() => toggleNotif('system', 'sms')} /></div>
                  <div className="flex justify-center"><Switch checked={notifPrefs.system.push} onCheckedChange={() => toggleNotif('system', 'push')} /></div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-end border-t pt-4">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Save className="mr-2 h-4 w-4" />
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* ============================================ */}
        {/* TAB 6: INTEGRATIONS                         */}
        {/* ============================================ */}
        <TabsContent value="integrations" className="space-y-6">
          {/* Payment Gateways */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Payment Gateways</CardTitle>
              <CardDescription>Connect payment processors to accept payments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {integrations.payment.map((integration) => (
                <div key={integration.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-2xl">
                      {integration.logo}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{integration.name}</p>
                        {integration.connected && (
                          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[10px] px-1.5">
                            Connected
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{integration.description}</p>
                    </div>
                  </div>
                  <Button
                    variant={integration.connected ? 'outline' : 'default'}
                    size="sm"
                    className={cn(
                      !integration.connected && 'bg-emerald-600 hover:bg-emerald-700',
                      integration.connected && 'text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20'
                    )}
                  >
                    {integration.connected ? (
                      <>
                        <X className="mr-1.5 h-3.5 w-3.5" />
                        Disconnect
                      </>
                    ) : (
                      <>
                        <Plug className="mr-1.5 h-3.5 w-3.5" />
                        Connect
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Accounting Software */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Accounting Software</CardTitle>
              <CardDescription>Sync financial data with your accounting tools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {integrations.accounting.map((integration) => (
                <div key={integration.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-2xl">
                      {integration.logo}
                    </div>
                    <div>
                      <p className="font-medium">{integration.name}</p>
                      <p className="text-xs text-muted-foreground">{integration.description}</p>
                    </div>
                  </div>
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                    <Plug className="mr-1.5 h-3.5 w-3.5" />
                    Connect
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* E-Commerce Platforms */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">E-Commerce Platforms</CardTitle>
              <CardDescription>Connect your online stores for seamless sync</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {integrations.ecommerce.map((integration) => (
                <div key={integration.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-2xl">
                      {integration.logo}
                    </div>
                    <div>
                      <p className="font-medium">{integration.name}</p>
                      <p className="text-xs text-muted-foreground">{integration.description}</p>
                    </div>
                  </div>
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                    <Plug className="mr-1.5 h-3.5 w-3.5" />
                    Connect
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
