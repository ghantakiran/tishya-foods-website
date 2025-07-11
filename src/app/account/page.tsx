'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Package, Heart, MapPin } from 'lucide-react'

// Mock user data
const mockUser = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  joinDate: '2023-06-15',
  totalOrders: 15,
  totalSpent: 18500,
}

const recentOrders = [
  {
    id: 'ord_001',
    date: '2024-01-15',
    status: 'delivered',
    total: 899,
    items: 3
  },
  {
    id: 'ord_002', 
    date: '2024-01-10',
    status: 'shipped',
    total: 1299,
    items: 2
  },
]

export default function AccountPage() {
  return (
    <div className="pt-16 lg:pt-20 bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">My Account</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Info */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-100 flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                <div className="space-y-2">
                  <p><strong>Name:</strong> {mockUser.name}</p>
                  <p><strong>Email:</strong> {mockUser.email}</p>
                  <p><strong>Member since:</strong> {mockUser.joinDate}</p>
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-100 flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                <div className="space-y-2">
                  <p><strong>Total Orders:</strong> {mockUser.totalOrders}</p>
                  <p><strong>Total Spent:</strong> ₹{mockUser.totalSpent.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-100">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors">
                  <Heart className="inline mr-2 h-4 w-4" />
                  Wishlist
                </button>
                <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded transition-colors">
                  <MapPin className="inline mr-2 h-4 w-4" />
                  Addresses
                </button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          <Card className="bg-gray-800 border-gray-700 mt-6">
            <CardHeader>
              <CardTitle className="text-gray-100">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
                    <div className="text-gray-300">
                      <p className="font-semibold">Order #{order.id}</p>
                      <p className="text-sm">{order.date} • {order.items} items</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">₹{order.total}</p>
                      <span className={`text-xs px-2 py-1 rounded ${
                        order.status === 'delivered' ? 'bg-green-600 text-green-100' : 'bg-blue-600 text-blue-100'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}