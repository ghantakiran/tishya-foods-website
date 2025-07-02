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
import { ToastProvider } from "@/components/providers/toast-provider";
import { ErrorBoundary } from "@/components/error/error-boundary";

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
  },
  twitter: {
    card: "summary_large_image",
    title: "Tishya Foods - ProNatural Protein Rich Foods",
    description: "Where nature's goodness is lovingly crafted into the purest and most wholesome protein-rich foods.",
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
      <body className={`${montserrat.variable} ${inter.variable} font-sans antialiased`}>
        <ErrorBoundary>
          <LoadingProvider>
            <AuthProvider>
              <CartProvider>
                <PaymentProvider>
                  <Header />
                  <main className="min-h-screen">
                    {children}
                  </main>
                  <Footer />
                  <NutritionAssistant />
                  <ToastProvider />
                </PaymentProvider>
              </CartProvider>
            </AuthProvider>
          </LoadingProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
