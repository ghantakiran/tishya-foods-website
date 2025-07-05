// Global type declarations for the Tishya Foods website

// Google Analytics gtag function
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
  
  function gtag(...args: unknown[]): void;
}

// Environment variables are automatically typed by Next.js

export {};