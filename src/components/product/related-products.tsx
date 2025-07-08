'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Product } from '@/types'
import { getAllProducts } from '@/lib/products-data'
import { ProductCard } from './product-card'

interface RelatedProductsProps {
  currentProduct: Product
  category: string
}

export default function RelatedProducts({ currentProduct, category }: RelatedProductsProps) {
  const relatedProducts = useMemo(() => {
    const allProducts = getAllProducts()
    
    // Filter products by same category, exclude current product
    const categoryProducts = allProducts.filter(
      product => product.category.id === category && product.id !== currentProduct.id
    )
    
    // If we don't have enough products in the same category, add products from other categories
    if (categoryProducts.length < 4) {
      const otherProducts = allProducts.filter(
        product => product.category.id !== category && product.id !== currentProduct.id
      )
      return [...categoryProducts, ...otherProducts].slice(0, 4)
    }
    
    return categoryProducts.slice(0, 4)
  }, [currentProduct.id, category])

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">You might also like</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}