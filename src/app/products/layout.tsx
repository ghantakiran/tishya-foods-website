import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Premium Protein-Rich Foods | Tishya Foods Product Catalog',
  description: 'Discover our extensive collection of premium protein-rich, natural foods. From sprouted grains to traditional flours, find the perfect healthy ingredients for your diet.',
  keywords: [
    'protein rich foods',
    'natural foods',
    'organic foods',
    'sprouted grains',
    'traditional flours',
    'healthy ingredients',
    'gluten-free products',
    'vegan protein',
    'nutrition',
    'health foods'
  ],
  openGraph: {
    title: 'Premium Protein-Rich Foods | Tishya Foods',
    description: 'Discover our extensive collection of premium protein-rich, natural foods. From sprouted grains to traditional flours.',
    type: 'website',
    url: 'https://tishyafoods.com/products',
    images: [
      {
        url: 'https://tishyafoods.com/images/og-products.jpg',
        width: 1200,
        height: 630,
        alt: 'Tishya Foods Product Collection',
      }
    ],
    siteName: 'Tishya Foods',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Premium Protein-Rich Foods | Tishya Foods',
    description: 'Discover our extensive collection of premium protein-rich, natural foods.',
    images: ['https://tishyafoods.com/images/og-products.jpg'],
    creator: '@tishyafoods',
  },
  alternates: {
    canonical: 'https://tishyafoods.com/products',
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

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}