'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, MapPin, Phone, Home, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Mock addresses data
const mockAddresses = [
  {
    id: 'addr_001',
    label: 'Home',
    fullName: 'John Doe',
    phoneNumber: '+91 98765 43210',
    addressLine1: '123 Main Street',
    addressLine2: 'Apartment 4B',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    landmark: 'Near Central Mall',
    isDefault: true,
    type: 'both' as const
  },
  {
    id: 'addr_002',
    label: 'Office',
    fullName: 'John Doe',
    phoneNumber: '+91 98765 43210',
    addressLine1: '456 Business Park',
    addressLine2: 'Building A, Floor 5',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411001',
    landmark: 'IT Park',
    isDefault: false,
    type: 'shipping' as const
  }
]

export default function AddressesPage() {
  const [addresses] = useState(mockAddresses)
  const [isAddingNew, setIsAddingNew] = useState(false)

  return (
    <div className="pt-16 lg:pt-20 bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white flex items-center">
              <MapPin className="mr-3 h-8 w-8 text-blue-500" />
              My Addresses
            </h1>
            <Button 
              onClick={() => setIsAddingNew(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Address
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <Card key={address.id} className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-gray-100 flex items-center">
                      {address.label === 'Home' ? (
                        <Home className="mr-2 h-5 w-5" />
                      ) : (
                        <Briefcase className="mr-2 h-5 w-5" />
                      )}
                      {address.label}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      {address.isDefault && (
                        <Badge variant="secondary" className="bg-blue-600 text-white">
                          Default
                        </Badge>
                      )}
                      <Badge variant="outline" className="border-gray-600 text-gray-300">
                        {address.type === 'both' ? 'Shipping & Billing' : 
                         address.type === 'shipping' ? 'Shipping' : 'Billing'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-gray-300">
                    <p className="font-semibold text-white">{address.fullName}</p>
                    <p className="flex items-center mt-1">
                      <Phone className="mr-2 h-4 w-4 text-gray-500" />
                      {address.phoneNumber}
                    </p>
                  </div>
                  
                  <div className="text-gray-400 text-sm leading-relaxed">
                    <p>{address.addressLine1}</p>
                    {address.addressLine2 && <p>{address.addressLine2}</p>}
                    <p>{address.city}, {address.state} {address.pincode}</p>
                    {address.landmark && <p>Landmark: {address.landmark}</p>}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        <Edit2 className="mr-1 h-3 w-3" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
                        <Trash2 className="mr-1 h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                    {!address.isDefault && (
                      <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                        Set as Default
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {addresses.length === 0 && (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="text-center py-12">
                <MapPin className="mx-auto h-16 w-16 text-gray-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No addresses saved</h3>
                <p className="text-gray-500 mb-6">
                  Add your first address to make checkout faster
                </p>
                <Button 
                  onClick={() => setIsAddingNew(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Address
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}