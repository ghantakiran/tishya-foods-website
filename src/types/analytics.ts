// Analytics and tracking type definitions

export interface AnalyticsItem {
  item_id: string;
  item_name: string;
  category: string;
  quantity: number;
  price: number;
  item_brand?: string;
  item_category2?: string;
  item_category3?: string;
  item_variant?: string;
}

export interface CheckoutItem extends AnalyticsItem {
  coupon?: string;
}

export interface EcommerceData {
  transaction_id?: string;
  value: number;
  currency?: string;
  items: AnalyticsItem[];
  coupon?: string;
  shipping?: number;
  tax?: number;
}

export interface UserActionData {
  element_id?: string;
  element_text?: string;
  element_type?: string;
  page_section?: string;
  additional_data?: Record<string, unknown>;
}

export interface EngagementData {
  value: number;
  duration?: number;
  percentage?: number;
}

export interface SearchFilters {
  category?: string;
  price_range?: string;
  brand?: string;
  rating?: number;
  in_stock?: boolean;
  [key: string]: string | number | boolean | undefined;
}

export interface AnalyticsConfig {
  googleAnalytics?: {
    measurementId: string;
    config: {
      anonymize_ip: boolean;
      allow_google_signals: boolean;
      allow_ad_personalization_signals: boolean;
    };
  };
  customAnalytics?: {
    apiEndpoint: string;
    config: {
      batchSize: number;
      batchTimeout: number;
    };
  };
  enableConsoleLogging?: boolean;
}