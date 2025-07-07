'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, MapPin, Phone, Home, Briefcase, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAddress, type Address } from '@/contexts/address-context'

interface AddressFormData {
  label: string
  fullName: string
  phoneNumber: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  pincode: string
  landmark: string
  isDefault: boolean
  type: 'shipping' | 'billing' | 'both'
}

const initialFormData: AddressFormData = {
  label: 'Home',
  fullName: '',
  phoneNumber: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  pincode: '',
  landmark: '',
  isDefault: false,
  type: 'both'
}

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal'
]

export default function AddressesPage() {
  const { addresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAddress()
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [formData, setFormData] = useState<AddressFormData>(initialFormData)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const handleInputChange = (field: keyof AddressFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingAddress) {
      updateAddress(editingAddress.id, formData)
      setEditingAddress(null)
    } else {
      addAddress(formData)
    }
    
    setFormData(initialFormData)
    setShowAddForm(false)
  }

  const handleEdit = (address: Address) => {
    setFormData({
      label: address.label,
      fullName: address.fullName,
      phoneNumber: address.phoneNumber,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      landmark: address.landmark || '',
      isDefault: address.isDefault,
      type: address.type
    })
    setEditingAddress(address)
    setShowAddForm(true)
  }

  const handleDelete = (id: string) => {
    deleteAddress(id)
    setDeleteConfirm(null)
  }

  const handleCancel = () => {
    setFormData(initialFormData)
    setEditingAddress(null)
    setShowAddForm(false)
  }

  const getLabelIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case 'home': return <Home className="h-4 w-4" />
      case 'work': return <Briefcase className="h-4 w-4" />
      default: return <MapPin className="h-4 w-4" />
    }
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-100">Saved Addresses</h1>
            <p className="text-gray-300 mt-2">Manage your delivery addresses</p>
          </div>
          
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Address
          </Button>
        </div>

        {/* Address Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-100">
                    {editingAddress ? 'Edit Address' : 'Add New Address'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Address Label */}
                      <div>
                        <Label htmlFor="label" className="text-gray-300">Address Label</Label>
                        <Select value={formData.label} onValueChange={(value) => handleInputChange('label', value)}>
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-100">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Home">Home</SelectItem>
                            <SelectItem value="Work">Work</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Address Type */}
                      <div>
                        <Label htmlFor="type" className="text-gray-300">Address Type</Label>
                        <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value as 'shipping' | 'billing' | 'both')}>
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-100">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="shipping">Shipping Only</SelectItem>
                            <SelectItem value="billing">Billing Only</SelectItem>
                            <SelectItem value="both">Shipping & Billing</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <div>
                        <Label htmlFor="fullName" className="text-gray-300">Full Name *</Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          className="bg-gray-700 border-gray-600 text-gray-100"
                          required
                        />
                      </div>

                      {/* Phone Number */}
                      <div>
                        <Label htmlFor="phoneNumber" className="text-gray-300">Phone Number *</Label>
                        <Input
                          id="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                          className="bg-gray-700 border-gray-600 text-gray-100"
                          required
                        />
                      </div>
                    </div>

                    {/* Address Line 1 */}
                    <div>
                      <Label htmlFor="addressLine1" className="text-gray-300">Address Line 1 *</Label>
                      <Input
                        id="addressLine1"
                        value={formData.addressLine1}
                        onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-gray-100"
                        placeholder="Flat, House no, Building, Company, Apartment"
                        required
                      />
                    </div>

                    {/* Address Line 2 */}
                    <div>
                      <Label htmlFor="addressLine2" className="text-gray-300">Address Line 2</Label>
                      <Input
                        id="addressLine2"
                        value={formData.addressLine2}
                        onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-gray-100"
                        placeholder="Area, Colony, Street, Sector, Village"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* City */}
                      <div>
                        <Label htmlFor="city" className="text-gray-300">City *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className="bg-gray-700 border-gray-600 text-gray-100"
                          required
                        />
                      </div>

                      {/* State */}
                      <div>
                        <Label htmlFor="state" className="text-gray-300">State *</Label>
                        <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-100">
                            <SelectValue placeholder="Select State" />
                          </SelectTrigger>
                          <SelectContent>
                            {indianStates.map(state => (
                              <SelectItem key={state} value={state}>{state}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Pincode */}
                      <div>
                        <Label htmlFor="pincode" className="text-gray-300">Pincode *</Label>
                        <Input
                          id="pincode"
                          value={formData.pincode}
                          onChange={(e) => handleInputChange('pincode', e.target.value)}
                          className="bg-gray-700 border-gray-600 text-gray-100"
                          required
                        />
                      </div>
                    </div>

                    {/* Landmark */}
                    <div>
                      <Label htmlFor="landmark" className="text-gray-300">Landmark</Label>
                      <Input
                        id="landmark"
                        value={formData.landmark}
                        onChange={(e) => handleInputChange('landmark', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-gray-100"
                        placeholder="Nearby famous shop, mall, temple etc."
                      />
                    </div>

                    {/* Default Address Checkbox */}
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isDefault"
                        checked={formData.isDefault}
                        onChange={(e) => handleInputChange('isDefault', e.target.checked)}
                        className="rounded border-gray-600 bg-gray-700"
                      />
                      <Label htmlFor="isDefault" className="text-gray-300">
                        Make this my default address
                      </Label>
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-3 pt-4">
                      <Button type="submit" className="bg-green-600 hover:bg-green-700">
                        {editingAddress ? 'Update Address' : 'Save Address'}
                      </Button>
                      <Button type="button" variant="outline" onClick={handleCancel} className="border-gray-600 hover:bg-gray-700">
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Address List */}
        {addresses.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="text-center py-16">
              <MapPin className="h-16 w-16 mx-auto mb-4 text-gray-600" />
              <h3 className="text-xl font-semibold text-gray-100 mb-2">
                No addresses saved
              </h3>
              <p className="text-gray-400 mb-6">
                Add your first address to make checkout faster
              </p>
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Address
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {addresses.map((address) => (
                <motion.div
                  key={address.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-gray-800 border-gray-700 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          {getLabelIcon(address.label)}
                          <span className="font-semibold text-gray-100">{address.label}</span>
                          {address.isDefault && (
                            <Badge className="bg-green-600">
                              <Star className="h-3 w-3 mr-1" />
                              Default
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(address)}
                            className="p-2 hover:bg-gray-700"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteConfirm(address.id)}
                            className="p-2 hover:bg-gray-700 text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2 text-gray-300">
                        <p className="font-medium text-gray-100">{address.fullName}</p>
                        <p className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {address.phoneNumber}
                        </p>
                        <div className="text-sm">
                          <p>{address.addressLine1}</p>
                          {address.addressLine2 && <p>{address.addressLine2}</p>}
                          {address.landmark && <p>Near {address.landmark}</p>}
                          <p>{address.city}, {address.state} - {address.pincode}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <Badge variant="outline" className="border-gray-600 text-gray-300">
                          {address.type === 'both' ? 'Shipping & Billing' : 
                           address.type === 'shipping' ? 'Shipping' : 'Billing'}
                        </Badge>
                        
                        {!address.isDefault && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDefaultAddress(address.id)}
                            className="text-green-400 hover:text-green-300"
                          >
                            Set as Default
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() => setDeleteConfirm(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-800 rounded-lg p-6 max-w-md mx-4"
              >
                <h3 className="text-lg font-semibold text-gray-100 mb-4">
                  Delete Address
                </h3>
                <p className="text-gray-300 mb-6">
                  Are you sure you want to delete this address? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 border-gray-600 hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(deleteConfirm)}
                    className="flex-1"
                  >
                    Delete
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}