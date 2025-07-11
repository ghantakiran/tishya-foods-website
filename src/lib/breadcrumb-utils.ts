// Server-side utility functions to generate breadcrumb items for common pages

interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

export function generateProductBreadcrumbs(category: string, productName: string, productId: string): BreadcrumbItem[] {
  return [
    { label: 'Products', href: '/products' },
    { label: category, href: `/products?category=${encodeURIComponent(category.toLowerCase())}` },
    { label: productName, href: `/products/${productId}`, current: true }
  ]
}

export function generateBlogBreadcrumbs(category: string, postTitle: string, postSlug: string): BreadcrumbItem[] {
  return [
    { label: 'Blog', href: '/blog' },
    { label: category, href: `/blog?category=${encodeURIComponent(category.toLowerCase())}` },
    { label: postTitle, href: `/blog/${postSlug}`, current: true }
  ]
}

export function generateRecipeBreadcrumbs(recipeName: string, recipeId: string): BreadcrumbItem[] {
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

export function generateCategoryBreadcrumbs(categoryName: string): BreadcrumbItem[] {
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