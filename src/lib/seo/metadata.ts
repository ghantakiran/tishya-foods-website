import { Metadata } from 'next'
import { Product, BlogPost } from '@/types'

const baseUrl = 'https://tishyafoods.com'
const siteName = 'Tishya Foods'
const siteDescription = 'Where nature\'s goodness is lovingly crafted into the purest and most wholesome protein-rich foods'

interface MetadataOptions {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  price?: number
  currency?: string
  availability?: string
  brand?: string
  category?: string
}

export function generateMetadata({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  price,
  currency = 'USD',
  availability,
  brand = 'Tishya Foods',
  category
}: MetadataOptions): Metadata {
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl
  const ogImage = image ? `${baseUrl}${image}` : `${baseUrl}/opengraph-image`

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: [
      'tishya foods',
      'natural foods',
      'protein rich',
      'organic',
      'healthy eating',
      'nutrition',
      ...keywords
    ],
    authors: author ? [{ name: author }] : [{ name: 'Tishya Foods Team' }],
    creator: 'Tishya Foods',
    publisher: 'Tishya Foods',
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: fullUrl
    },
    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      siteName,
      locale: 'en_US',
      type: type === 'product' ? 'website' : type,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(author && { authors: [author] }),
      ...(section && { section })
    },
    twitter: {
      card: 'summary_large_image',
      site: '@tishyafoods',
      creator: author ? `@${author.toLowerCase().replace(' ', '')}` : '@tishyafoods',
      title: fullTitle,
      description,
      images: [ogImage]
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
      }
    },
    other: {
      'og:image:alt': title,
      'og:image:type': 'image/png',
      'og:image:width': '1200',
      'og:image:height': '630',
      ...(price && { 'product:price:amount': price.toString() }),
      ...(currency && { 'product:price:currency': currency }),
      ...(availability && { 'product:availability': availability }),
      ...(brand && { 'product:brand': brand }),
      ...(category && { 'product:category': category })
    }
  }

  return metadata
}

export function generateProductMetadata(product: Product): Metadata {
  const keywords = [
    product.name.toLowerCase(),
    product.category.name.toLowerCase(),
    ...product.tags.map(tag => tag.toLowerCase()),
    ...product.ingredients.slice(0, 5).map(ingredient => ingredient.toLowerCase()),
    'protein rich',
    'natural',
    'organic'
  ]

  return generateMetadata({
    title: product.name,
    description: product.description,
    keywords,
    image: product.images[0],
    url: `/products/${product.id}`,
    type: 'product',
    price: product.price,
    availability: product.stock > 0 ? 'in stock' : 'out of stock',
    category: product.category.name
  })
}

export function generateBlogMetadata(post: BlogPost): Metadata {
  const keywords = [
    post.category.toLowerCase(),
    ...post.tags.map(tag => tag.toLowerCase()),
    'nutrition',
    'health',
    'wellness',
    'food'
  ]

  return generateMetadata({
    title: post.title,
    description: post.excerpt,
    keywords,
    image: post.image,
    url: `/blog/${post.slug}`,
    type: 'article',
    publishedTime: post.publishedAt,
    author: post.author,
    section: post.category
  })
}

export function generateCategoryMetadata(categoryName: string, type: 'products' | 'blog' = 'products'): Metadata {
  const description = type === 'products' 
    ? `Explore our ${categoryName.toLowerCase()} collection of natural, protein-rich foods crafted by Tishya Foods`
    : `Read the latest articles about ${categoryName.toLowerCase()} from Tishya Foods nutrition experts`

  return generateMetadata({
    title: `${categoryName} ${type === 'products' ? 'Products' : 'Articles'}`,
    description,
    keywords: [categoryName.toLowerCase(), type, 'nutrition', 'healthy'],
    url: `/${type}?category=${encodeURIComponent(categoryName.toLowerCase())}`
  })
}

export const defaultMetadata: Metadata = generateMetadata({
  title: siteName,
  description: siteDescription,
  keywords: ['natural foods', 'protein rich', 'organic', 'healthy eating', 'nutrition']
})