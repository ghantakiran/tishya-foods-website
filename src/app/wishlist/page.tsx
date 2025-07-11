'use client'

import { Heart, Package } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

// Mock wishlist data
const mockWishlistItems = [
  {
    id: '1',
    name: 'Premium Mixed Nuts',
    price: 299,
    image: '/products/mixed-nuts.jpg',
    category: 'Natural Foods'
  },
  {
    id: '2',
    name: 'Natural Protein Bar',
    price: 45,
    image: '/products/protein-bar.jpg',
    category: 'Protein Snacks'
  }
]

export default function WishlistPage() {
  return (
    <div className="pt-16 lg:pt-20 bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white flex items-center">
              <Heart className="mr-3 h-8 w-8 text-red-500" />
              My Wishlist
            </h1>
            <span className="text-gray-400">
              {mockWishlistItems.length} {mockWishlistItems.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          {mockWishlistItems.length === 0 ? (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="text-center py-12">
                <Package className="mx-auto h-16 w-16 text-gray-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">Your wishlist is empty</h3>
                <p className="text-gray-500 mb-6">
                  Start adding items you love to your wishlist
                </p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-colors">
                  Continue Shopping
                </button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockWishlistItems.map((item) => (
                <Card key={item.id} className="bg-gray-800 border-gray-700 overflow-hidden">
                  <div className="aspect-square relative bg-gray-700">
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-16 w-16 text-gray-500" />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {item.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-2">{item.category}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-white">
                        ₹{item.price}
                      </span>
                      <div className="flex space-x-2">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm transition-colors">
                          Add to Cart
                        </button>
                        <button className="text-red-400 hover:text-red-300 p-1">
                          <Heart className="h-5 w-5 fill-current" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}