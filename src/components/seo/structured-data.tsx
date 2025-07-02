interface StructuredDataProps {
  type: 'Organization' | 'Product' | 'Recipe' | 'Article' | 'WebSite'
  data: Record<string, unknown>
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const getStructuredData = () => {
    const baseContext = 'https://schema.org'
    
    switch (type) {
      case 'Organization':
        return {
          '@context': baseContext,
          '@type': 'Organization',
          name: 'Tishya Foods',
          alternateName: 'ProNatural Protein Rich Foods',
          url: 'https://tishyafoods.com',
          logo: 'https://tishyafoods.com/logo.png',
          description: 'Where nature\'s goodness is lovingly crafted into the purest and most wholesome protein-rich foods',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'IN',
            addressRegion: 'India',
          },
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+91-12345-67890',
            contactType: 'customer service',
            email: 'info@tishyafoods.com',
          },
          sameAs: [
            'https://instagram.com/tishyafoods',
            'https://facebook.com/tishyafoods',
          ],
          ...data,
        }
      
      case 'Product':
        return {
          '@context': baseContext,
          '@type': 'Product',
          brand: {
            '@type': 'Brand',
            name: 'Tishya Foods',
          },
          manufacturer: {
            '@type': 'Organization',
            name: 'Tishya Foods',
          },
          category: 'Health & Nutrition',
          ...data,
        }
      
      case 'Recipe':
        return {
          '@context': baseContext,
          '@type': 'Recipe',
          author: {
            '@type': 'Organization',
            name: 'Tishya Foods',
          },
          publisher: {
            '@type': 'Organization',
            name: 'Tishya Foods',
            logo: 'https://tishyafoods.com/logo.png',
          },
          ...data,
        }
      
      case 'WebSite':
        return {
          '@context': baseContext,
          '@type': 'WebSite',
          name: 'Tishya Foods',
          url: 'https://tishyafoods.com',
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: 'https://tishyafoods.com/products?search={search_term_string}',
            },
            'query-input': 'required name=search_term_string',
          },
          ...data,
        }
      
      default:
        return {
          '@context': baseContext,
          '@type': type,
          ...data,
        }
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getStructuredData()),
      }}
    />
  )
}