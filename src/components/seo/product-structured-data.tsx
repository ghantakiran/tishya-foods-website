import { Product } from '@/types'

interface ProductStructuredDataProps {
  product: Product
}

export function ProductStructuredData({ product }: ProductStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images?.map(image => `https://tishyafoods.com${image}`) || [
      `https://tishyafoods.com/images/products/${product.id}.jpg`
    ],
    brand: {
      '@type': 'Brand',
      name: 'Tishya Foods'
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Tishya Foods',
      url: 'https://tishyafoods.com'
    },
    category: product.category,
    sku: product.id,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: product.stock > 0 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Tishya Foods'
      },
      url: `https://tishyafoods.com/products/${product.id}`,
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    aggregateRating: product.averageRating ? {
      '@type': 'AggregateRating',
      ratingValue: product.averageRating,
      ratingCount: product.reviewCount || 1,
      bestRating: 5,
      worstRating: 1
    } : undefined,
    nutrition: product.nutritionalInfo ? {
      '@type': 'NutritionInformation',
      calories: product.nutritionalInfo.calories ? `${product.nutritionalInfo.calories} calories` : undefined,
      proteinContent: product.nutritionalInfo.protein ? `${product.nutritionalInfo.protein}g` : undefined,
      carbohydrateContent: product.nutritionalInfo.carbs ? `${product.nutritionalInfo.carbs}g` : undefined,
      fatContent: product.nutritionalInfo.fat ? `${product.nutritionalInfo.fat}g` : undefined,
      fiberContent: product.nutritionalInfo.fiber ? `${product.nutritionalInfo.fiber}g` : undefined,
      sugarContent: product.nutritionalInfo.sugar ? `${product.nutritionalInfo.sugar}g` : undefined
    } : undefined,
    additionalProperty: [
      ...(product.isOrganic ? [{
        '@type': 'PropertyValue',
        name: 'Organic',
        value: 'true'
      }] : []),
      ...(product.isGlutenFree ? [{
        '@type': 'PropertyValue',
        name: 'Gluten Free',
        value: 'true'
      }] : []),
      ...(product.isVegan ? [{
        '@type': 'PropertyValue',
        name: 'Vegan',
        value: 'true'
      }] : [])
    ]
  }

  // Remove undefined properties
  const cleanStructuredData = JSON.parse(JSON.stringify(structuredData))

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanStructuredData) }}
    />
  )
}

// Product list structured data
interface ProductListStructuredDataProps {
  products: Product[]
  category?: string
}

export function ProductListStructuredData({ products, category }: ProductListStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: category ? `${category} Products` : 'Tishya Foods Products',
    description: category 
      ? `Premium ${category.toLowerCase()} products from Tishya Foods`
      : 'Premium protein-rich natural foods from Tishya Foods',
    url: category 
      ? `https://tishyafoods.com/products/category/${category.toLowerCase()}`
      : 'https://tishyafoods.com/products',
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.images?.[0] || `/images/products/${product.id}.jpg`,
        url: `https://tishyafoods.com/products/${product.id}`,
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: 'USD',
          availability: product.stock > 0 
            ? 'https://schema.org/InStock' 
            : 'https://schema.org/OutOfStock'
        }
      }
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}