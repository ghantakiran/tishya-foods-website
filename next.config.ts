import type { NextConfig } from "next";

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      'lucide-react', 
      'framer-motion', 
      '@radix-ui/react-dialog', 
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-accordion',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-avatar',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-popover',
      '@radix-ui/react-progress',
      '@radix-ui/react-radio-group',
      '@radix-ui/react-select',
      '@radix-ui/react-separator',
      '@radix-ui/react-slider',
      '@radix-ui/react-switch',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toast',
      '@radix-ui/react-tooltip',
      '@radix-ui/react-label',
      'recharts',
      'react-hook-form',
      'react-hot-toast',
      'react-intersection-observer',
      'use-debounce',
      'cmdk',
      'date-fns',
      'fuse.js',
      'zustand'
    ],
    webpackBuildWorker: true,
    optimizeCss: true,
    optimizeServerReact: true,
    gzipSize: true,
    // Development performance optimizations
    ...(process.env.NODE_ENV === 'development' && {
      turbopack: true,
      webVitalsAttribution: ['CLS', 'LCP'],
      optimisticClientCache: true,
      forceSwcTransforms: true,
      swcTraceProfiling: true,
      instrumentationHook: true,
      typedRoutes: true,
      esmExternals: 'loose',
      // Enable faster refresh
      adjustFontFallbacks: false,
      // Reduce build time
      cacheLife: {
        default: {
          stale: 300,
          revalidate: 900
        }
      }
    })
  },
  
  // Server external packages
  serverExternalPackages: ['sharp'],
  
  // Turbopack configuration
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js'
      }
    }
  },
  
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Development optimizations
    if (dev) {
      // Faster development builds
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
      }
      
      // Faster transpilation in development
      config.optimization = {
        ...config.optimization,
        usedExports: false,
        sideEffects: false,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
      }
      
      // Disable source maps in development for faster builds
      config.devtool = false
      
      // Faster TypeScript checking
      config.resolve.alias = {
        ...config.resolve.alias,
        'react/jsx-runtime': require.resolve('react/jsx-runtime'),
      }
      
      // Enable webpack build profiling
      if (process.env.WEBPACK_PROFILE) {
        const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
        const smp = new SpeedMeasurePlugin()
        return smp.wrap(config)
      }
    } else {
      // Production optimizations
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: 30,
          maxAsyncRequests: 30,
          cacheGroups: {
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
              enforce: true,
            },
            analytics: {
              test: /[\\/]node_modules[\\/](gtag|ga-gtag|analytics|tracking)[\\/]/,
              name: 'analytics',
              chunks: 'all',
              priority: 20,
            },
            ui: {
              test: /[\\/]node_modules[\\/](@radix-ui|framer-motion|lucide-react)[\\/]/,
              name: 'ui-libs',
              chunks: 'all',
              priority: 15,
            },
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: 'react',
              chunks: 'all',
              priority: 30,
            },
            next: {
              test: /[\\/]node_modules[\\/]next[\\/]/,
              name: 'next',
              chunks: 'all',
              priority: 25,
            },
            utilities: {
              test: /[\\/]src[\\/](lib|utils|hooks)[\\/]/,
              name: 'utilities',
              chunks: 'all',
              priority: 5,
            },
            styles: {
              test: /\.(css|scss|sass)$/,
              name: 'styles',
              chunks: 'all',
              priority: 20,
              enforce: true,
            }
          }
        },
        moduleIds: 'deterministic',
        chunkIds: 'deterministic',
      }
    }
    
    // SVG optimization
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    })
    
    // Add performance budgets for production
    if (!dev) {
      config.performance = {
        maxAssetSize: 512000, // 500KB
        maxEntrypointSize: 512000, // 500KB
        hints: 'warning'
      }
    }
    
    return config
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year cache for images
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    domains: ['localhost', 'tishyafoods.com', 'images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(self), usb=(), screen-wake-lock=(), accelerometer=(), gyroscope=(), magnetometer=(), bluetooth=(), midi=(), ambient-light-sensor=(), document-domain=()'
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none'
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups'
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin'
          },
          {
            key: 'Origin-Agent-Cluster',
            value: '?1'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' 'nonce-${Math.random().toString(36).substring(2, 15)}' https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com https://cdnjs.cloudflare.com https://js.stripe.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https://images.unsplash.com https://api.placeholder.com https://via.placeholder.com https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com https://q.stripe.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://api.placeholder.com https://api.stripe.com https://checkout.stripe.com wss: ws:",
              "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self' https://checkout.stripe.com",
              "frame-ancestors 'none'",
              "manifest-src 'self'",
              "media-src 'self' data: blob:",
              "worker-src 'self' blob:",
              "child-src 'self' blob:",
              "upgrade-insecure-requests",
              "block-all-mixed-content"
            ].join('; ')
          },
        ],
      },
      // Cache optimization headers for static assets
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // 1 year cache for Next.js static assets
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, stale-while-revalidate=86400', // 30 days with 1 day stale
          },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // 1 year cache for fonts
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate', // No cache for API routes
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/placeholder/:path*',
        destination: 'https://via.placeholder.com/:path*',
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
