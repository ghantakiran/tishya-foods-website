'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Package, 
  Heart, 
  MapPin, 
  CreditCard, 
  Gift, 
  Star,
  TrendingUp,
  ShoppingBag,
  Crown
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useWishlist } from '@/contexts/wishlist-context'
import { useAddress } from '@/contexts/address-context'
import { useCart } from '@/contexts/cart-context'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'

// Mock user data - in real app this would come from auth context
const mockUser = {
  id: 'user_001',
  name: 'Arjun Patel',
  email: 'arjun.patel@example.com',
  phone: '+91 98765 43210',
  joinDate: '2023-06-15',
  loyaltyTier: 'Gold',
  loyaltyPoints: 1250,
  totalOrders: 15,
  totalSpent: 18500,
  avatar: '/avatars/user-01.jpg'
}

// Mock order data
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
    items: 5
  },
  {
    id: 'ord_003',
    date: '2024-01-05',
    status: 'processing',
    total: 749,
    items: 2
  }
]

const loyaltyTiers = [
  { name: 'Bronze', minPoints: 0, color: 'bg-amber-600' },
  { name: 'Silver', minPoints: 500, color: 'bg-gray-400' },
  { name: 'Gold', minPoints: 1000, color: 'bg-yellow-500' },
  { name: 'Platinum', minPoints: 2500, color: 'bg-purple-600' }
]

export default function AccountDashboard() {
  const { items: wishlistItems } = useWishlist()
  const { addresses } = useAddress()
  const { cart } = useCart()
  const cartItems = cart?.items || []
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 18) setGreeting('Good afternoon')
    else setGreeting('Good evening')
  }, [])

  const currentTier = loyaltyTiers.find(tier => tier.name === mockUser.loyaltyTier)
  const nextTier = loyaltyTiers.find(tier => tier.minPoints > mockUser.loyaltyPoints)
  const progressToNext = nextTier 
    ? ((mockUser.loyaltyPoints - currentTier!.minPoints) / (nextTier.minPoints - currentTier!.minPoints)) * 100
    : 100

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-600'
      case 'shipped': return 'bg-blue-600'
      case 'processing': return 'bg-yellow-600'
      default: return 'bg-gray-600'
    }
  }

  const quickActions = [
    {
      title: 'Order History',
      description: 'View all your orders',
      icon: Package,
      href: '/account/orders',
      count: mockUser.totalOrders
    },
    {
      title: 'Wishlist',
      description: 'Saved items',
      icon: Heart,
      href: '/wishlist',
      count: wishlistItems.length
    },
    {
      title: 'Addresses',
      description: 'Manage delivery addresses',
      icon: MapPin,
      href: '/account/addresses',
      count: addresses.length
    },
    {
      title: 'Loyalty Program',
      description: 'Points & rewards',
      icon: Gift,
      href: '/loyalty',
      count: mockUser.loyaltyPoints
    }
  ]

  return (
    <div className="pt-20 min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-100 mb-2">
            {greeting}, {mockUser.name}! 👋
          </h1>
          <p className="text-gray-400">
            Welcome back to your account dashboard
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Overview */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-100 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Account Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-100">{mockUser.totalOrders}</div>
                    <div className="text-gray-400 text-sm">Total Orders</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-100">{formatPrice(mockUser.totalSpent)}</div>
                    <div className="text-gray-400 text-sm">Total Spent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-100">{wishlistItems.length}</div>
                    <div className="text-gray-400 text-sm">Wishlist Items</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Loyalty Status */}
            <Card className="bg-gradient-to-r from-gray-800 to-gray-700 border-gray-600">
              <CardHeader>
                <CardTitle className="text-gray-100 flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  Loyalty Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 ${currentTier?.color} rounded-full flex items-center justify-center`}>
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-100">{mockUser.loyaltyTier} Member</h3>
                    <p className="text-gray-300">{mockUser.loyaltyPoints} points available</p>
                  </div>
                </div>

                {nextTier && (
                  <div>
                    <div className="flex justify-between text-sm text-gray-300 mb-2">
                      <span>Progress to {nextTier.name}</span>
                      <span>{nextTier.minPoints - mockUser.loyaltyPoints} points to go</span>
                    </div>
                    <Progress value={progressToNext} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-gray-100 flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Recent Orders
                </CardTitle>
                <Button variant="outline" size="sm" asChild className="border-gray-600 hover:bg-gray-700">
                  <Link href="/account/orders">View All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-100">#{order.id}</span>
                          <span className="text-sm text-gray-400">
                            {new Date(order.date).toLocaleDateString()} • {order.items} items
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-100">{formatPrice(order.total)}</span>
                        <Badge className={`${getStatusColor(order.status)} text-white capitalize`}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-100">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action) => (
                  <Link key={action.title} href={action.href}>
                    <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <action.icon className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-100 text-sm">{action.title}</div>
                          <div className="text-xs text-gray-400">{action.description}</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-gray-600 text-gray-300">
                        {action.count}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* Current Cart */}
            {cartItems.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-100 flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Current Cart
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Items</span>
                      <span className="text-gray-100">{cartItems.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Subtotal</span>
                      <span className="text-gray-100">
                        {formatPrice(cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0))}
                      </span>
                    </div>
                    <Button className="w-full bg-green-600 hover:bg-green-700" asChild>
                      <Link href="/checkout">
                        Proceed to Checkout
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Account Settings */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-100">Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start border-gray-600 hover:bg-gray-700" asChild>
                  <Link href="/account/profile">
                    <User className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start border-gray-600 hover:bg-gray-700" asChild>
                  <Link href="/account/security">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Security Settings
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start border-gray-600 hover:bg-gray-700" asChild>
                  <Link href="/account/preferences">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Preferences
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}