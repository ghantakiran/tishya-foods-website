// Global type declarations for the Tishya Foods website

// Google Analytics gtag function
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
  
  function gtag(...args: any[]): void;
}

// Extend Node process for environment variables
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_GA_MEASUREMENT_ID: string;
    NODE_ENV: 'development' | 'production' | 'test';
  }
}

export {};