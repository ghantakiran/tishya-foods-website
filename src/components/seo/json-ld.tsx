import { Product, BlogPost } from '@/types'

interface JsonLdProps {
  data: Record<string, any>
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 2)
      }}
    />
  )
}

// Organization Schema
export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://tishyafoods.com/#organization',
    name: 'Tishya Foods',
    alternateName: 'ProNatural Protein Rich Foods',
    url: 'https://tishyafoods.com',
    logo: {
      '@type': 'ImageObject',
      '@id': 'https://tishyafoods.com/#logo',
      url: 'https://tishyafoods.com/images/logo.png',
      width: 300,
      height: 100,
      caption: 'Tishya Foods Logo'
    },
    image: {
      '@type': 'ImageObject',
      '@id': 'https://tishyafoods.com/#image',
      url: 'https://tishyafoods.com/images/tishya-foods-hero.jpg',
      width: 1200,
      height: 630,
      caption: 'Tishya Foods - Natural Protein Rich Foods'
    },
    description: 'Where nature\'s goodness is lovingly crafted into the purest and most wholesome protein-rich foods. We specialize in natural, organic, and traditional food products.',
    foundingDate: '2020',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
      addressRegion: 'CA',
      addressLocality: 'San Francisco'
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+1-800-TISHYA',
        contactType: 'customer service',
        availableLanguage: ['English'],
        areaServed: 'US'
      },
      {
        '@type': 'ContactPoint',
        email: 'info@tishyafoods.com',
        contactType: 'customer support',
        availableLanguage: ['English']
      }
    ],
    sameAs: [
      'https://facebook.com/tishyafoods',
      'https://instagram.com/tishyafoods',
      'https://twitter.com/tishyafoods',
      'https://linkedin.com/company/tishyafoods'
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: 4.8,
      reviewCount: 1247,
      bestRating: 5,
      worstRating: 1
    }
  }

  return <JsonLd data={schema} />
}

// Website Schema
export function WebsiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://tishyafoods.com/#website',
    url: 'https://tishyafoods.com',
    name: 'Tishya Foods',
    alternateName: 'ProNatural Protein Rich Foods',
    description: 'Where nature\'s goodness is lovingly crafted into the purest and most wholesome protein-rich foods',
    publisher: {
      '@id': 'https://tishyafoods.com/#organization'
    },
    potentialAction: [
      {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://tishyafoods.com/products?search={search_term_string}'
        },
        'query-input': 'required name=search_term_string'
      }
    ],
    inLanguage: 'en-US'
  }

  return <JsonLd data={schema} />
}

// Enhanced Product Schema
export function ProductSchema({ product }: { product: Product }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `https://tishyafoods.com/products/${product.id}#product`,
    name: product.name,
    description: product.description,
    image: product.images?.map(image => `https://tishyafoods.com${image}`) || [
      `https://tishyafoods.com/images/products/${product.id}.jpg`
    ],
    brand: {
      '@type': 'Brand',
      '@id': 'https://tishyafoods.com/#organization',
      name: 'Tishya Foods'
    },
    manufacturer: {
      '@type': 'Organization',
      '@id': 'https://tishyafoods.com/#organization'
    },
    category: {
      '@type': 'Thing',
      name: product.category.name,
      url: `https://tishyafoods.com/products?category=${encodeURIComponent(product.category.slug)}`
    },
    sku: product.id,
    gtin: product.id, // Assuming ID can serve as GTIN for now
    offers: {
      '@type': 'Offer',
      '@id': `https://tishyafoods.com/products/${product.id}#offer`,
      price: product.price,
      priceCurrency: 'USD',
      availability: product.stock > 0 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@id': 'https://tishyafoods.com/#organization'
      },
      url: `https://tishyafoods.com/products/${product.id}`,
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'USD'
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 2,
            unitCode: 'DAY'
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 2,
            maxValue: 5,
            unitCode: 'DAY'
          }
        }
      }
    },
    aggregateRating: product.averageRating > 0 ? {
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
      sugarContent: product.nutritionalInfo.sugar ? `${product.nutritionalInfo.sugar}g` : undefined,
      sodiumContent: product.nutritionalInfo.sodium ? `${product.nutritionalInfo.sodium}mg` : undefined,
      servingSize: product.nutritionalInfo.servingSize
    } : undefined,
    additionalProperty: [
      ...(product.isOrganic ? [{
        '@type': 'PropertyValue',
        name: 'Organic',
        value: 'true'
      }] : []),
      ...(product.isVegan ? [{
        '@type': 'PropertyValue',
        name: 'Vegan',
        value: 'true'
      }] : []),
      ...(product.isGlutenFree ? [{
        '@type': 'PropertyValue',
        name: 'Gluten Free',
        value: 'true'
      }] : []),
      ...(product.isKeto ? [{
        '@type': 'PropertyValue',
        name: 'Keto Friendly',
        value: 'true'
      }] : [])
    ],
    keywords: product.tags.join(', '),
    ingredients: product.ingredients.join(', '),
    allergens: product.allergens.length > 0 ? product.allergens.join(', ') : undefined,
    ...(product.shelfLife && {
      storageRequirements: 'Store in a cool, dry place',
      shelfLife: product.shelfLife
    })
  }

  return <JsonLd data={schema} />
}

// Enhanced Article Schema for Blog Posts
export function ArticleSchema({ post }: { post: BlogPost }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `https://tishyafoods.com/blog/${post.slug}#article`,
    headline: post.title,
    description: post.excerpt,
    image: {
      '@type': 'ImageObject',
      url: `https://tishyafoods.com${post.image}`,
      width: 1200,
      height: 630,
      caption: post.title
    },
    author: {
      '@type': 'Person',
      name: post.author,
      url: `https://tishyafoods.com/authors/${post.author.toLowerCase().replace(' ', '-')}`
    },
    publisher: {
      '@id': 'https://tishyafoods.com/#organization'
    },
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://tishyafoods.com/blog/${post.slug}`
    },
    articleSection: post.category,
    keywords: post.tags.join(', '),
    wordCount: post.content.split(' ').length,
    inLanguage: 'en-US',
    about: {
      '@type': 'Thing',
      name: 'Nutrition and Healthy Eating'
    }
  }

  return <JsonLd data={schema} />
}

// FAQ Schema
export function FAQSchema({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }

  return <JsonLd data={schema} />
}