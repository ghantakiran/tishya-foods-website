import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";
import "../styles/mobile.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { OrganizationSchema, WebsiteSchema } from "@/components/seo/json-ld";
import { CartProvider } from "@/contexts/cart-context";
import { AuthProvider } from "@/contexts/auth-context";
import { PaymentProvider } from "@/contexts/payment-context";
import { LoadingProvider } from "@/contexts/loading-context";
import { WishlistProvider } from "@/contexts/wishlist-context";
import { AddressProvider } from "@/contexts/address-context";
import { ToastProvider } from "@/components/providers/toast-provider";
import { CriticalErrorBoundary } from "@/components/error/error-boundary";
import { NetworkStatusNotification } from "@/components/error/network-status-notification";
import { PerformanceInit } from "@/components/performance/performance-init";
import { SubscriptionProvider } from "@/contexts/subscription-context";
import { LoyaltyProvider } from "@/contexts/loyalty-context";
import { AnalyticsProvider } from "@/components/analytics/analytics-provider";
import { PageViewTracker } from "@/components/analytics/page-view-tracker";
import { PWAInit } from "@/components/pwa/pwa-init";
import { SkipNavigation } from "@/components/accessibility/skip-link";
import { ColorContrastEnhancer } from "@/components/accessibility/color-contrast-enhancer";
import { FocusManager } from "@/components/accessibility/focus-manager";
import { KeyboardNavigationEnhancer } from "@/components/accessibility/keyboard-navigation-enhancer";
import { TouchOptimizer } from "@/components/mobile/touch-optimizer";

// Dynamic imports for non-critical components
import {
  DynamicNutritionAssistant,
  DynamicPWAUpdateNotification,
  DynamicOfflineIndicator,
  DynamicAccessibilityChecker,
  DynamicBundleAnalyzer,
  DynamicPerformanceMonitor,
  DynamicCookieConsentBanner,
  DynamicEnhancedAnalyticsTracker,
  DynamicEcommerceAnalyticsTracker,
  DynamicPerformanceOptimizer,
} from "@/components/dynamic/dynamic-imports";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "Arial", "sans-serif"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Tishya Foods - ProNatural Protein Rich Foods | Health At Home!",
  description: "Where nature's goodness is lovingly crafted into the purest and most wholesome protein-rich foods. Triple-washed, air-dried, hand-roasted, and finely milled with care.",
  keywords: "protein foods, natural foods, organic, gluten-free, healthy snacks, nutrition",
  authors: [{ name: "Tishya Foods" }],
  creator: "Tishya Foods",
  openGraph: {
    title: "Tishya Foods - ProNatural Protein Rich Foods",
    description: "Where nature's goodness is lovingly crafted into the purest and most wholesome protein-rich foods.",
    url: "https://tishyafoods.com",
    siteName: "Tishya Foods",
    type: "website",
    images: [
      {
        url: "https://tishyafoods.com/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tishya Foods - Natural Protein Rich Foods",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tishya Foods - ProNatural Protein Rich Foods",
    description: "Where nature's goodness is lovingly crafted into the purest and most wholesome protein-rich foods.",
    images: ["https://tishyafoods.com/images/og-image.jpg"],
  },
  alternates: {
    canonical: "https://tishyafoods.com",
  },
  manifest: "/manifest.json",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: "cover",
  },
  themeColor: "#111827",
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Tishya Foods",
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#111827",
    "msapplication-config": "/browserconfig.xml",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <OrganizationSchema />
        <WebsiteSchema />
      </head>
      <body className={`${montserrat.variable} ${inter.variable} font-sans antialiased bg-gray-900 text-gray-100`}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main id="main-content" className="flex-1" role="main" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
