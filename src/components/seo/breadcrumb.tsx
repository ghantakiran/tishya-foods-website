'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  // Generate JSON-LD structured data for breadcrumbs
  const generateBreadcrumbStructuredData = () => {
    const itemListElement = items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href ? `https://tishyafoods.com${item.href}` : undefined
    }))

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement
    }
  }

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbStructuredData())
        }}
      />
      
      {/* Breadcrumb Navigation */}
      <nav 
        aria-label="Breadcrumb" 
        className={`flex items-center space-x-2 text-sm ${className}`}
      >
        <ol className="flex items-center space-x-2">
          {/* Home link */}
          <li>
            <Link 
              href="/" 
              className="text-gray-400 hover:text-gray-200 transition-colors"
              aria-label="Home"
            >
              <Home className="w-4 h-4" />
            </Link>
          </li>
          
          {items.map((item, index) => (
            <li key={index} className="flex items-center space-x-2">
              <ChevronRight className="w-4 h-4 text-gray-500" aria-hidden="true" />
              
              {item.current || !item.href ? (
                <span 
                  className={`${
                    item.current 
                      ? 'text-gray-100 font-medium' 
                      : 'text-gray-400'
                  }`}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link 
                  href={item.href}
                  className="text-gray-400 hover:text-gray-200 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}

// Utility functions to generate breadcrumb items for common pages
export function generateProductBreadcrumbs(category: string, productName: string, productId: string) {
  return [
    { label: 'Products', href: '/products' },
    { label: category, href: `/products?category=${encodeURIComponent(category.toLowerCase())}` },
    { label: productName, href: `/products/${productId}`, current: true }
  ]
}

export function generateBlogBreadcrumbs(category: string, postTitle: string, postSlug: string) {
  return [
    { label: 'Blog', href: '/blog' },
    { label: category, href: `/blog?category=${encodeURIComponent(category.toLowerCase())}` },
    { label: postTitle, href: `/blog/${postSlug}`, current: true }
  ]
}

export function generateRecipeBreadcrumbs(recipeName: string, recipeId: string) {
  return [
    { label: 'Recipes', href: '/recipes' },
    { label: recipeName, href: `/recipes/${recipeId}`, current: true }
  ]
}

export function generateAccountBreadcrumbs(section?: string): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [{ label: 'My Account', href: '/account' }]
  if (section) {
    items.push({ label: section, current: true })
  } else {
    items[0].current = true
  }
  return items
}

export function generateCategoryBreadcrumbs(categoryName: string) {
  return [
    { label: 'Products', href: '/products' },
    { label: categoryName, current: true }
  ]
}

// Legacy object export for backward compatibility
export const generateBreadcrumbs = {
  product: generateProductBreadcrumbs,
  blog: generateBlogBreadcrumbs,
  recipe: generateRecipeBreadcrumbs,
  account: generateAccountBreadcrumbs,
  category: generateCategoryBreadcrumbs
}