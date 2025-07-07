import { Product } from '@/types/product'
import { CartItem } from '@/types'

export const createCartItemFromProduct = (product: Product, quantity = 1): CartItem => ({
  productId: product.id,
  name: product.name,
  price: product.price,
  image: product.images[0] || '/images/placeholder.jpg',
  quantity,
  variant: product.variants && product.variants[0] ? { size: product.variants[0].value } : undefined,
  nutritionalInfo: {
    protein: product.nutritionalInfo?.protein || 0,
    calories: product.nutritionalInfo?.calories || 0,
    servingSize: product.nutritionalInfo?.servingSize || '100g',
  },
})

export const calculateCartTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0)
}

export const getCartItemCount = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.quantity, 0)
}

export const findCartItem = (items: CartItem[], productId: string, variant?: any): CartItem | undefined => {
  return items.find(item => 
    item.productId === productId && 
    JSON.stringify(item.variant) === JSON.stringify(variant)
  )
}