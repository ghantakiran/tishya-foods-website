import { Metadata } from 'next'
import { CheckoutFlow } from '@/features/checkout/checkout-flow'

export const metadata: Metadata = {
  title: 'Checkout - Tishya Foods',
  description: 'Complete your order securely with multiple payment options',
  robots: 'noindex, nofollow' // Prevent indexing of checkout pages
}

export default function CheckoutPage() {
  return <CheckoutFlow />
}