import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://tishyafoods.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/products',
          '/products/*',
          '/about',
          '/contact',
          '/recipes',
          '/recipes/*',
          '/blog',
          '/blog/*',
          '/nutrition',
          '/compare',
          '/subscription',
          '/loyalty',
          '/recommendations',
          '/wishlist',
          '/account',
          '/css/',
          '/js/',
          '/_next/static/',
        ],
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/checkout/success',
          '/checkout/cancel',
          '/checkout/webhook',
          '/account/orders/*',
          '/account/addresses/*',
          '/*.json$',
          '/private/',
        ],
        crawlDelay: 1,
      },
      // Special rules for specific crawlers
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/products',
          '/products/*',
          '/about',
          '/contact',
          '/recipes',
          '/recipes/*',
          '/blog',
          '/blog/*',
          '/nutrition',
          '/_next/static/',
        ],
        disallow: [
          '/admin/',
          '/api/',
          '/checkout/success',
          '/checkout/cancel',
          '/account/orders/*',
          '/account/addresses/*',
        ],
        crawlDelay: 1,
      },
      {
        userAgent: 'Bingbot',
        allow: [
          '/',
          '/products',
          '/products/*',
          '/about',
          '/contact',
          '/recipes',
          '/recipes/*',
          '/blog',
          '/blog/*',
          '/nutrition',
        ],
        disallow: [
          '/admin/',
          '/api/',
          '/checkout/*',
          '/account/*',
        ],
        crawlDelay: 2,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}