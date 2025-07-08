import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nutrition & Health Blog | Tishya Foods - Expert Tips & Recipes',
  description: 'Discover expert nutrition tips, healthy recipes, and wellness insights from Tishya Foods. Learn about protein-rich foods, natural ingredients, and sustainable eating.',
  keywords: [
    'nutrition blog',
    'health blog',
    'protein recipes',
    'healthy eating',
    'natural foods blog',
    'wellness tips',
    'nutrition science',
    'food education',
    'healthy lifestyle',
    'sustainable eating'
  ],
  openGraph: {
    title: 'Nutrition & Health Blog | Tishya Foods',
    description: 'Expert nutrition tips, healthy recipes, and wellness insights.',
    type: 'website',
    url: 'https://tishyafoods.com/blog',
    images: [
      {
        url: 'https://tishyafoods.com/images/og-blog.jpg',
        width: 1200,
        height: 630,
        alt: 'Tishya Foods Blog - Nutrition & Health',
      }
    ],
    siteName: 'Tishya Foods',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nutrition & Health Blog | Tishya Foods',
    description: 'Expert nutrition tips, healthy recipes, and wellness insights.',
    images: ['https://tishyafoods.com/images/og-blog.jpg'],
    creator: '@tishyafoods',
  },
  alternates: {
    canonical: 'https://tishyafoods.com/blog',
    types: {
      'application/rss+xml': [
        { url: '/blog/feed.xml', title: 'Tishya Foods Blog RSS Feed' },
      ],
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}