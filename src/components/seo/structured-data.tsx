interface StructuredDataProps {
  type: 'Organization' | 'Product' | 'Recipe' | 'Article' | 'WebSite' | 'LocalBusiness' | 'FAQPage'
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
          logo: {
            '@type': 'ImageObject',
            url: 'https://tishyafoods.com/images/logo.png',
            width: 300,
            height: 100
          },
          image: 'https://tishyafoods.com/images/tishya-foods-hero.jpg',
          description: 'Where nature\'s goodness is lovingly crafted into the purest and most wholesome protein-rich foods. We specialize in natural, organic, and traditional food products.',
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
          foundingDate: '2020',
          numberOfEmployees: '50-100',
          industry: 'Food & Beverage',
          keywords: 'natural foods, protein-rich foods, organic foods, traditional foods, sprouted grains',
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
          description: 'Premium protein-rich natural foods crafted with care',
          inLanguage: 'en-US',
          copyrightYear: new Date().getFullYear(),
          copyrightHolder: {
            '@type': 'Organization',
            name: 'Tishya Foods'
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
          mainEntity: {
            '@type': 'Organization',
            name: 'Tishya Foods'
          },
          ...data,
        }

      case 'LocalBusiness':
        return {
          '@context': baseContext,
          '@type': 'LocalBusiness',
          '@id': 'https://tishyafoods.com/#business',
          name: 'Tishya Foods',
          description: 'Premium natural food retailer specializing in protein-rich, organic products',
          url: 'https://tishyafoods.com',
          image: 'https://tishyafoods.com/images/store-front.jpg',
          telephone: '+1-800-TISHYA',
          email: 'info@tishyafoods.com',
          address: {
            '@type': 'PostalAddress',
            streetAddress: '123 Health Street',
            addressLocality: 'San Francisco',
            addressRegion: 'CA',
            postalCode: '94102',
            addressCountry: 'US'
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 37.7749,
            longitude: -122.4194
          },
          openingHoursSpecification: [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              opens: '09:00',
              closes: '17:00'
            }
          ],
          paymentAccepted: 'Cash, Credit Card, PayPal, Apple Pay, Google Pay',
          currenciesAccepted: 'USD',
          priceRange: '$',
          ...data,
        }

      case 'FAQPage':
        return {
          '@context': baseContext,
          '@type': 'FAQPage',
          mainEntity: Array.isArray((data as any)?.questions) ? (data as any).questions.map((faq: any) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer
            }
          })) : [],
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