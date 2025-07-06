# 🎫 GitHub Issue Templates for Tishya Foods Website

Copy and paste these detailed issue templates directly into GitHub Issues.

---

## ISSUE #1 - CRITICAL

**Title:** 🚨 CRITICAL: Missing Next.js App Router error.tsx files causing poor error handling

**Labels:** `bug`, `critical`, `next.js`, `app-router`, `error-handling`, `ux`

**Issue Body:**
```markdown
## 🚨 Critical Issue: Missing Error Handling in App Router

### Problem Description
The application is missing critical `error.tsx` files in the app router directory structure, which means route-specific errors are not being handled properly. This leads to poor user experience when errors occur on specific pages.

### Current State Analysis
- ❌ No `error.tsx` files found in any app routes
- ❌ Route-specific errors fall back to global error boundary only  
- ❌ No contextual error pages for different sections
- ❌ Poor error recovery experience for users

### Impact Assessment
- **User Experience**: Users see generic error messages instead of helpful, contextual ones
- **Business Impact**: Potential loss of customers due to poor error handling
- **Developer Experience**: Difficult to debug route-specific issues
- **SEO Impact**: Search engines may index error states incorrectly

### Required Implementation

#### 1. Global Error Handler (`src/app/error.tsx`)
```tsx
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home, MessageCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
    // Send to error tracking service
    if (typeof window !== 'undefined') {
      window.gtag?.('event', 'exception', {
        description: error.message,
        fatal: false,
      })
    }
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full text-center p-8 bg-gray-800 rounded-lg border border-gray-700">
        <AlertTriangle className="mx-auto h-16 w-16 text-red-500 mb-6" />
        <h1 className="text-2xl font-bold text-gray-100 mb-4">Oops! Something went wrong</h1>
        <p className="text-gray-400 mb-6">
          We apologize for the inconvenience. Please try refreshing the page or return to our homepage.
        </p>
        
        <div className="space-y-3">
          <Button onClick={reset} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/contact'}>
              <MessageCircle className="mr-2 h-4 w-4" />
              Report Issue
            </Button>
          </div>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          Error ID: {error.digest || Date.now().toString(36)}
        </div>
      </div>
    </div>
  )
}
```

#### 2. Route-Specific Error Handlers Needed
- `src/app/products/error.tsx` - E-commerce specific errors
- `src/app/blog/error.tsx` - Content-specific errors  
- `src/app/checkout/error.tsx` - Payment/checkout errors
- `src/app/admin/error.tsx` - Admin panel errors
- `src/app/compare/error.tsx` - Comparison tool errors

### Implementation Steps
- [ ] Create global error handler with proper styling
- [ ] Implement route-specific error pages with contextual messaging
- [ ] Add error tracking and reporting functionality
- [ ] Test error scenarios across all routes
- [ ] Integrate with monitoring services (Sentry/LogRocket)
- [ ] Add error recovery mechanisms where applicable

### Acceptance Criteria
- [ ] All major routes have appropriate error handling
- [ ] Error pages match site design and branding
- [ ] Errors are properly logged and tracked
- [ ] Users have clear recovery options
- [ ] Error messages are helpful and actionable
- [ ] Error tracking is integrated with analytics

### Testing Requirements
- [ ] Test JavaScript errors on each route
- [ ] Test network failures and API errors
- [ ] Test invalid route parameters
- [ ] Test error recovery functionality
- [ ] Validate error tracking integration

### Priority: 🔴 Critical
### Estimated Effort: 2-3 days
### Components Affected: All app routes
```

---

## ISSUE #2 - CRITICAL

**Title:** 🚨 CRITICAL: Build configuration suppressing TypeScript and ESLint errors in production

**Labels:** `bug`, `critical`, `build`, `typescript`, `eslint`, `technical-debt`

**Issue Body:**
```markdown
## 🚨 Critical Build Configuration Issue

### Problem Description
The Next.js configuration is currently set to ignore TypeScript and ESLint errors during builds, which is masking real issues and creating significant technical debt.

### Current Configuration Issues
**File:** `next.config.ts` (Lines 4-10)
```typescript
// ❌ CRITICAL ISSUES
eslint: {
  ignoreDuringBuilds: true,  // This hides ESLint errors
},
typescript: {
  ignoreBuildErrors: true,   // This hides TypeScript errors
},
```

### Impact Assessment
- **Code Quality**: Hidden bugs and type errors in production
- **Maintainability**: Poor code quality and technical debt accumulation
- **Runtime Stability**: Potential runtime errors that could have been caught at build time
- **Developer Experience**: Developers unaware of code quality issues
- **Business Risk**: Production failures due to undetected errors

### Required Actions

#### 1. Immediate Fix
```typescript
// ✅ CORRECTED CONFIGURATION
const nextConfig: NextConfig = {
  // Remove these dangerous flags:
  // eslint: { ignoreDuringBuilds: true },     // ❌ REMOVE
  // typescript: { ignoreBuildErrors: true }, // ❌ REMOVE
  
  // Keep the good configurations:
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  // ... rest of config
}
```

#### 2. Error Resolution Process
1. **Phase 1**: Remove ignore flags and identify all errors
2. **Phase 2**: Fix TypeScript errors systematically
3. **Phase 3**: Fix ESLint warnings and errors
4. **Phase 4**: Implement pre-commit hooks to prevent regression

### Implementation Plan

#### Phase 1: Error Discovery (Day 1)
- [ ] Remove `ignoreDuringBuilds: true`
- [ ] Remove `ignoreBuildErrors: true`
- [ ] Run build and document all errors
- [ ] Categorize errors by severity and module

#### Phase 2: TypeScript Fixes (Days 2-3)
- [ ] Fix type definition errors
- [ ] Add proper type annotations
- [ ] Resolve import/export type issues
- [ ] Update component prop types

#### Phase 3: ESLint Fixes (Days 3-4)
- [ ] Fix accessibility warnings
- [ ] Resolve unused variable warnings
- [ ] Fix React hooks dependency warnings
- [ ] Address code style issues

#### Phase 4: Prevention (Day 5)
- [ ] Set up pre-commit hooks with Husky
- [ ] Configure GitHub Actions for build validation
- [ ] Add TypeScript strict mode gradually
- [ ] Document coding standards

### Quality Gates
- [ ] Build passes without errors
- [ ] All TypeScript errors resolved
- [ ] ESLint warnings under acceptable threshold
- [ ] Pre-commit hooks prevent bad commits
- [ ] CI/CD pipeline validates code quality

### Risk Mitigation
- **Development Impact**: Work on feature branch to avoid blocking development
- **Rollback Plan**: Keep current config as backup until all errors fixed
- **Testing**: Comprehensive testing after each phase
- **Communication**: Regular updates on progress

### Priority: 🔴 Critical
### Estimated Effort: 3-5 days
### Risk Level: High (but necessary for long-term stability)
```

---

## ISSUE #3 - HIGH PRIORITY

**Title:** 🚨 Missing loading.tsx files causing poor loading experience

**Labels:** `enhancement`, `high`, `next.js`, `app-router`, `ux`, `loading-states`

**Issue Body:**
```markdown
## Missing Loading States in App Router

### Problem Description
The application lacks proper loading states for different routes using Next.js App Router loading.tsx convention. This results in sudden content jumps and poor user experience during navigation.

### Current State
- ❌ No `loading.tsx` files in app directory
- ❌ Users see blank pages during route transitions
- ❌ No loading indicators for slow network conditions
- ❌ Poor perceived performance

### Impact on User Experience
- **Navigation Feel**: Abrupt transitions between pages
- **Perceived Performance**: Site feels slower than it actually is
- **User Feedback**: No indication that something is happening
- **Accessibility**: Screen readers don't announce loading states

### Required Implementation

#### 1. Global Loading (`src/app/loading.tsx`)
```tsx
import { LoadingSkeleton } from '@/components/loading/loading-skeleton'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingSkeleton />
      </div>
    </div>
  )
}
```

#### 2. Products Loading (`src/app/products/loading.tsx`)
```tsx
import { Skeleton } from '@/components/ui/skeleton'

export default function ProductsLoading() {
  return (
    <div className="pt-20 min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header skeleton */}
        <div className="text-center mb-12">
          <Skeleton className="h-12 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        {/* Filters skeleton */}
        <div className="bg-gray-800 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <Skeleton className="h-10 lg:col-span-2" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>
        </div>

        {/* Products grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-2xl p-6">
              <Skeleton className="h-48 w-full mb-4" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-4 w-24 mb-4" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

### Required Files List
- [ ] `src/app/loading.tsx` - Global loading state
- [ ] `src/app/products/loading.tsx` - Product browsing
- [ ] `src/app/blog/loading.tsx` - Blog content loading  
- [ ] `src/app/checkout/loading.tsx` - Checkout process
- [ ] `src/app/compare/loading.tsx` - Product comparison
- [ ] `src/app/admin/loading.tsx` - Admin dashboard
- [ ] `src/app/recommendations/loading.tsx` - AI recommendations

### Enhanced Loading Skeleton Component
Create `src/components/loading/page-loading-skeleton.tsx`:
```tsx
import { Skeleton } from '@/components/ui/skeleton'

interface PageLoadingSkeletonProps {
  showHeader?: boolean
  showSidebar?: boolean
  contentRows?: number
}

export function PageLoadingSkeleton({
  showHeader = true,
  showSidebar = false,
  contentRows = 6
}: PageLoadingSkeletonProps) {
  return (
    <div className="space-y-6">
      {showHeader && (
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
      )}
      
      <div className={`grid gap-6 ${showSidebar ? 'grid-cols-4' : 'grid-cols-1'}`}>
        {showSidebar && (
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-32 w-full" />
          </div>
        )}
        
        <div className={showSidebar ? 'col-span-3' : 'col-span-1'}>
          <div className="space-y-4">
            {Array.from({ length: contentRows }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
```

### Implementation Steps
- [ ] Create global loading component
- [ ] Implement route-specific loading states
- [ ] Add skeleton components for different content types
- [ ] Test loading states with slow network simulation
- [ ] Ensure accessibility compliance for loading states
- [ ] Add loading animations and transitions

### Acceptance Criteria
- [ ] All major routes have loading states
- [ ] Loading skeletons match actual content structure
- [ ] Smooth transitions between loading and loaded states
- [ ] Accessibility features (aria-label, role) included
- [ ] Loading states work on slow networks
- [ ] No layout shift when content loads

### Priority: 🟡 High
### Estimated Effort: 1-2 days
### Dependencies: Skeleton UI components
```

---

## ISSUE #4 - MEDIUM PRIORITY

**Title:** 🛒 E-commerce functionality gaps - Missing real payment integration and database

**Labels:** `feature`, `medium`, `e-commerce`, `payment`, `database`, `stripe`

**Issue Body:**
```markdown
## E-commerce Functionality Gaps

### Problem Description
The website has comprehensive e-commerce UI components but lacks the backend infrastructure for real e-commerce functionality. This creates a disconnect between the polished frontend and missing core business functionality.

### Current State Analysis
- ✅ Beautiful e-commerce UI components
- ✅ Shopping cart functionality (frontend only)
- ✅ Product display and filtering
- ❌ No real payment processing
- ❌ No product database (using mock data)
- ❌ No order management system
- ❌ No user authentication backend
- ❌ No inventory management

### Missing Core Components

#### 1. Payment Integration
**Current:** Mock payment flows
**Required:** 
- Stripe payment processing
- Multiple payment methods (cards, UPI, wallets)
- Payment confirmation and receipts
- Refund processing
- Payment security compliance

#### 2. Product Database
**Current:** Static mock data in `/lib/products-data.ts`
**Required:**
- PostgreSQL/MongoDB product database
- Product CRUD operations
- Image storage and management
- Inventory tracking
- Product variants and options

#### 3. Order Management
**Current:** No order processing
**Required:**
- Order creation and tracking
- Order status updates
- Email notifications
- Order history for users
- Admin order management

#### 4. User Authentication
**Current:** Frontend auth context only
**Required:**
- User registration and login
- JWT/session management
- User profiles and preferences
- Password reset functionality
- Social login options

### Technical Implementation Plan

#### Phase 1: Database Setup (Week 1)
```bash
# Set up Prisma with PostgreSQL
npm install prisma @prisma/client
npx prisma init
```

**Schema Design:**
```prisma
// prisma/schema.prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  orders    Order[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Product {
  id          String      @id @default(cuid())
  name        String
  description String
  price       Float
  images      String[]
  category    Category    @relation(fields: [categoryId], references: [id])
  categoryId  String
  inventory   Int
  orderItems  OrderItem[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

model Order {
  id         String      @id @default(cuid())
  userId     String
  user       User        @relation(fields: [userId], references: [id])
  items      OrderItem[]
  total      Float
  status     OrderStatus
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
}

enum OrderStatus {
  PENDING
  CONFIRMED
  SHIPPED
  DELIVERED
  CANCELLED
}
```

#### Phase 2: Payment Integration (Week 2)
```typescript
// lib/stripe.ts
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

// API route: app/api/payment/create-intent/route.ts
export async function POST(request: Request) {
  const { amount, currency = 'inr' } = await request.json()
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // Convert to paisa
    currency,
    metadata: {
      integration_check: 'accept_a_payment',
    },
  })
  
  return Response.json({
    client_secret: paymentIntent.client_secret,
  })
}
```

#### Phase 3: Authentication System (Week 3)
```typescript
// Using NextAuth.js v5
// auth.config.ts
import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { getUserByEmail } from '@/lib/auth-utils'
import bcrypt from 'bcryptjs'

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials
        const user = await getUserByEmail(email as string)
        
        if (!user || !user.password) return null
        
        const isValid = await bcrypt.compare(password as string, user.password)
        if (!isValid) return null
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      },
    }),
  ],
} satisfies NextAuthConfig
```

### API Endpoints Required

#### Product Management
- `GET /api/products` - List products with filtering
- `GET /api/products/[id]` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/[id]` - Update product (admin)
- `DELETE /api/products/[id]` - Delete product (admin)

#### Order Management
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/[id]` - Get order details
- `PUT /api/orders/[id]/status` - Update order status (admin)

#### Payment Processing
- `POST /api/payment/create-intent` - Create payment intent
- `POST /api/payment/confirm` - Confirm payment
- `POST /api/payment/webhook` - Handle Stripe webhooks

### Environment Variables Needed
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/tishyafoods"

# Stripe
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Email (for notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

### Implementation Steps
- [ ] Set up PostgreSQL database
- [ ] Create Prisma schema and migrations
- [ ] Implement user authentication with NextAuth
- [ ] Set up Stripe payment processing
- [ ] Create API endpoints for products and orders
- [ ] Implement order management system
- [ ] Add email notifications
- [ ] Set up admin dashboard for order management
- [ ] Add inventory tracking
- [ ] Implement product image upload

### Acceptance Criteria
- [ ] Users can create accounts and log in
- [ ] Real products are stored in database
- [ ] Shopping cart persists across sessions
- [ ] Payment processing works with real Stripe account
- [ ] Orders are created and tracked
- [ ] Email confirmations are sent
- [ ] Admin can manage products and orders
- [ ] Inventory is properly tracked
- [ ] Payment security standards are met

### Priority: 🟠 Medium
### Estimated Effort: 2-3 weeks
### Dependencies: Database setup, Stripe account, Email service
```

---

## Additional Issue Templates Available

I have detailed templates ready for the remaining issues:

5. **PWA Implementation incomplete** (📱 Mobile App Features)
6. **SEO optimization incomplete** (📈 Search Engine Optimization)
7. **Accessibility improvements** (♿ WCAG 2.1 AA Compliance)
8. **Mobile experience optimization** (📱 Touch & Responsive)
9. **Analytics implementation incomplete** (📊 Tracking & Insights)
10. **Content Management System missing** (📝 CMS Integration)
11. **Security headers incomplete** (🔒 Security Hardening)
12. **Performance optimization** (⚡ Speed & Core Web Vitals)
13. **Test coverage incomplete** (🧪 Testing Infrastructure)
14. **Development environment improvements** (🛠️ Developer Experience)

Would you like me to provide the detailed templates for the remaining issues as well?

### Quick Action Items for Immediate Implementation:

1. **Copy Issue #1** (Critical Error Handling) - Create this GitHub issue first
2. **Copy Issue #2** (Build Configuration) - Address immediately  
3. **Copy Issue #3** (Loading States) - Quick UX improvement

Each template is ready to paste directly into GitHub Issues with proper formatting, labels, and implementation details.