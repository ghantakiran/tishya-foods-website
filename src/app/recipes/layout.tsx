import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Healthy Protein-Rich Recipes | Tishya Foods Recipe Collection',
  description: 'Explore our collection of delicious, healthy recipes using Tishya Foods products. High-protein, natural ingredient recipes for every meal.',
  keywords: [
    'healthy recipes',
    'protein recipes',
    'natural food recipes',
    'organic recipes',
    'high protein meals',
    'nutritious recipes',
    'sprouted grain recipes',
    'traditional flour recipes',
    'gluten-free recipes',
    'vegan recipes'
  ],
  openGraph: {
    title: 'Healthy Protein-Rich Recipes | Tishya Foods',
    description: 'Delicious, healthy recipes using premium natural ingredients.',
    type: 'website',
    url: 'https://tishyafoods.com/recipes',
    images: [
      {
        url: 'https://tishyafoods.com/images/og-recipes.jpg',
        width: 1200,
        height: 630,
        alt: 'Tishya Foods Recipe Collection',
      }
    ],
    siteName: 'Tishya Foods',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Healthy Protein-Rich Recipes | Tishya Foods',
    description: 'Delicious, healthy recipes using premium natural ingredients.',
    images: ['https://tishyafoods.com/images/og-recipes.jpg'],
    creator: '@tishyafoods',
  },
  alternates: {
    canonical: 'https://tishyafoods.com/recipes',
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

export default function RecipesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}