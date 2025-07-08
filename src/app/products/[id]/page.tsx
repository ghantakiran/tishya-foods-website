import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProductById, getAllProducts } from '@/lib/products-data'
import ProductDetailPage from '@/components/product/product-detail-page'

interface Props {
  params: { id: string }
}

export async function generateStaticParams() {
  const products = getAllProducts()
  
  return products.map((product) => ({
    id: product.id.toString(),
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProductById(params.id)
  
  if (!product) {
    return {
      title: 'Product Not Found | Tishya Foods',
    }
  }

  const productImages = product.images?.map((image, index) => ({
    url: `https://tishyafoods.com/images/products/${product.id}-${index + 1}.jpg`,
    width: 800,
    height: 600,
    alt: `${product.name} - Image ${index + 1}`,
  })) || []

  return {
    title: `${product.name} | Tishya Foods - Premium Natural Foods`,
    description: product.description,
    keywords: [
      product.name,
      product.category,
      'protein rich',
      'natural foods',
      'organic',
      ...(product.isGlutenFree ? ['gluten-free'] : []),
      ...(product.isVegan ? ['vegan'] : []),
      ...(product.isOrganic ? ['organic'] : []),
    ],
    openGraph: {
      title: `${product.name} | Tishya Foods`,
      description: product.description,
      type: 'product',
      url: `https://tishyafoods.com/products/${product.id}`,
      images: productImages.length > 0 ? productImages : [
        {
          url: 'https://tishyafoods.com/images/products/default.jpg',
          width: 800,
          height: 600,
          alt: product.name,
        }
      ],
      siteName: 'Tishya Foods',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | Tishya Foods`,
      description: product.description,
      images: productImages.length > 0 ? [productImages[0].url] : ['https://tishyafoods.com/images/products/default.jpg'],
      creator: '@tishyafoods',
    },
    alternates: {
      canonical: `https://tishyafoods.com/products/${product.id}`,
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
    other: {
      'product:price:amount': product.price.toString(),
      'product:price:currency': 'USD',
      'product:availability': product.inStock ? 'in stock' : 'out of stock',
      'product:condition': 'new',
      'product:brand': 'Tishya Foods',
      'product:category': product.category,
    },
  }
}

export default function ProductPage({ params }: Props) {
  const product = getProductById(params.id)

  if (!product) {
    notFound()
  }

  return <ProductDetailPage product={product} />
}