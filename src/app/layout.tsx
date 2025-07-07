import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import NutritionAssistant from "@/components/ai/nutrition-assistant";
import { StructuredData } from "@/components/seo/structured-data";
import { CartProvider } from "@/contexts/cart-context";
import { AuthProvider } from "@/contexts/auth-context";
import { PaymentProvider } from "@/contexts/payment-context";
import { LoadingProvider } from "@/contexts/loading-context";
import { WishlistProvider } from "@/contexts/wishlist-context";
import { AddressProvider } from "@/contexts/address-context";
import { ToastProvider } from "@/components/providers/toast-provider";
import { ErrorBoundary } from "@/components/error/error-boundary";
import { PerformanceInit } from "@/components/performance/performance-init";
import { SubscriptionProvider } from "@/contexts/subscription-context";
import { LoyaltyProvider } from "@/contexts/loyalty-context";
import { AnalyticsProvider } from "@/components/analytics/analytics-provider";
import { PageViewTracker } from "@/components/analytics/page-view-tracker";
import { PWAInit } from "@/components/pwa/pwa-init";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
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
    maximumScale: 1,
    userScalable: false,
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
        <StructuredData 
          type="Organization" 
          data={{}} 
        />
        <StructuredData 
          type="WebSite" 
          data={{}} 
        />
      </head>
      <body className={`${montserrat.variable} ${inter.variable} font-sans antialiased bg-gray-900 text-gray-100`}>
        <PWAInit>
          <ErrorBoundary>
            <LoadingProvider>
              <AuthProvider>
                <CartProvider>
                  <WishlistProvider>
                    <AddressProvider>
                      <PaymentProvider>
                        <SubscriptionProvider>
                          <LoyaltyProvider>
                            <AnalyticsProvider
                          config={{
                            googleAnalytics: {
                              measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '',
                              config: {
                                anonymize_ip: true,
                                allow_google_signals: false,
                                allow_ad_personalization_signals: false
                              }
                            },
                            customAnalytics: {
                              apiEndpoint: '/api/analytics/events',
                              config: {
                                batchSize: 10,
                                batchTimeout: 5000
                              }
                            },
                            enableConsoleLogging: process.env.NODE_ENV === 'development'
                          }}
                        >
                          <PageViewTracker />
                          {/* Skip Navigation Links for Accessibility */}
                          <a 
                            href="#main-content" 
                            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Skip to main content"
                          >
                            Skip to main content
                          </a>
                          <a 
                            href="#main-navigation" 
                            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-40 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Skip to navigation"
                          >
                            Skip to navigation
                          </a>
                          <div className="flex flex-col min-h-screen">
                            <Header />
                            <main id="main-content" className="flex-1" role="main" tabIndex={-1}>
                              {children}
                            </main>
                            <Footer />
                          </div>
                          <NutritionAssistant />
                          <ToastProvider />
                          <PerformanceInit>
                            <></>
                          </PerformanceInit>
                            </AnalyticsProvider>
                          </LoyaltyProvider>
                        </SubscriptionProvider>
                      </PaymentProvider>
                    </AddressProvider>
                  </WishlistProvider>
                </CartProvider>
              </AuthProvider>
            </LoadingProvider>
          </ErrorBoundary>
        </PWAInit>
      </body>
    </html>
  );
}
