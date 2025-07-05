'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Card } from '@/components/ui/card'
import { User, Settings, Heart, Zap, Target, Trophy } from 'lucide-react'

interface UserPreferencesProps {
  onSave?: (preferences: any) => void
}

interface Preferences {
  dietary: string[]
  goals: string[]
  interests: string[]
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
  display: {
    theme: string
    layout: string
    fontSize: string
  }
}

const dietaryOptions = [
  { id: 'vegetarian', label: 'Vegetarian', icon: '🌱' },
  { id: 'vegan', label: 'Vegan', icon: '🌿' },
  { id: 'gluten-free', label: 'Gluten Free', icon: '🌾' },
  { id: 'high-protein', label: 'High Protein', icon: '💪' },
  { id: 'low-carb', label: 'Low Carb', icon: '🥗' },
  { id: 'organic', label: 'Organic Only', icon: '🌱' },
  { id: 'no-nuts', label: 'Nut Free', icon: '🚫' },
  { id: 'dairy-free', label: 'Dairy Free', icon: '🥛' }
]

const goalOptions = [
  { id: 'weight-loss', label: 'Weight Loss', icon: <Target className="w-4 h-4" /> },
  { id: 'muscle-gain', label: 'Muscle Gain', icon: <Zap className="w-4 h-4" /> },
  { id: 'general-health', label: 'General Health', icon: <Heart className="w-4 h-4" /> },
  { id: 'fitness', label: 'Fitness & Performance', icon: <Trophy className="w-4 h-4" /> }
]

const interestOptions = [
  'Protein Snacks', 'Natural Foods', 'Supplements', 'Recipe Ideas', 
  'Nutrition Tips', 'Fitness Advice', 'Meal Planning', 'Weight Management'
]

export function UserPreferences({ onSave }: UserPreferencesProps) {
  const [preferences, setPreferences] = useState<Preferences>({
    dietary: [],
    goals: [],
    interests: [],
    notifications: {
      email: true,
      push: false,
      sms: false
    },
    display: {
      theme: 'dark',
      layout: 'grid',
      fontSize: 'medium'
    }
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadPreferences()
  }, [])

  const loadPreferences = () => {
    try {
      const savedPreferences = localStorage.getItem('user_preferences')
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences))
      }
    } catch (error) {
      console.error('Failed to load preferences:', error)
    }
  }

  const handleDietaryChange = (optionId: string, checked: boolean) => {
    setPreferences(prev => ({
      ...prev,
      dietary: checked 
        ? [...prev.dietary, optionId]
        : prev.dietary.filter(id => id !== optionId)
    }))
  }

  const handleGoalChange = (goalId: string, checked: boolean) => {
    setPreferences(prev => ({
      ...prev,
      goals: checked 
        ? [...prev.goals, goalId]
        : prev.goals.filter(id => id !== goalId)
    }))
  }

  const handleInterestChange = (interest: string, checked: boolean) => {
    setPreferences(prev => ({
      ...prev,
      interests: checked 
        ? [...prev.interests, interest]
        : prev.interests.filter(i => i !== interest)
    }))
  }

  const handleNotificationChange = (type: keyof typeof preferences.notifications, checked: boolean) => {
    setPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: checked
      }
    }))
  }

  const handleDisplayChange = (setting: keyof typeof preferences.display, value: string) => {
    setPreferences(prev => ({
      ...prev,
      display: {
        ...prev.display,
        [setting]: value
      }
    }))
  }

  const savePreferences = async () => {
    try {
      setSaving(true)
      
      // Save to localStorage
      localStorage.setItem('user_preferences', JSON.stringify(preferences))
      
      // Also save user interests for recommendation engine
      localStorage.setItem('user_interests', JSON.stringify(
        preferences.interests.map(i => i.toLowerCase().replace(/\s+/g, '-'))
      ))
      
      // Call parent callback if provided
      if (onSave) {
        onSave(preferences)
      }
      
      // Show success message (you could replace this with a toast notification)
      alert('Preferences saved successfully!')
      
    } catch (error) {
      console.error('Failed to save preferences:', error)
      alert('Failed to save preferences. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8" data-testid="user-preferences">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <User className="w-8 h-8 text-green-400 mr-3" />
          <h1 className="text-3xl font-bold text-gray-100">Your Preferences</h1>
        </div>
        <p className="text-gray-400">
          Customize your experience to get personalized recommendations and content
        </p>
      </div>

      {/* Dietary Preferences */}
      <Card className="p-6 bg-gray-800 border-gray-700">
        <h2 className="text-xl font-semibold text-gray-100 mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2 text-green-400" />
          Dietary Preferences
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {dietaryOptions.map((option) => (
            <label 
              key={option.id} 
              className="flex items-center space-x-3 p-3 rounded-lg border border-gray-600 hover:border-green-400 transition-colors cursor-pointer"
              data-testid="dietary-preference"
            >
              <Checkbox
                checked={preferences.dietary.includes(option.id)}
                onCheckedChange={(checked) => handleDietaryChange(option.id, checked as boolean)}
              />
              <span className="text-lg">{option.icon}</span>
              <span className="text-gray-200 text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </Card>

      {/* Health Goals */}
      <Card className="p-6 bg-gray-800 border-gray-700">
        <h2 className="text-xl font-semibold text-gray-100 mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-green-400" />
          Health Goals
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goalOptions.map((goal) => (
            <label 
              key={goal.id} 
              className="flex items-center space-x-3 p-4 rounded-lg border border-gray-600 hover:border-green-400 transition-colors cursor-pointer"
              data-testid="health-goal"
            >
              <Checkbox
                checked={preferences.goals.includes(goal.id)}
                onCheckedChange={(checked) => handleGoalChange(goal.id, checked as boolean)}
              />
              <div className="text-green-400">{goal.icon}</div>
              <span className="text-gray-200">{goal.label}</span>
            </label>
          ))}
        </div>
      </Card>

      {/* Interests */}
      <Card className="p-6 bg-gray-800 border-gray-700">
        <h2 className="text-xl font-semibold text-gray-100 mb-4 flex items-center">
          <Heart className="w-5 h-5 mr-2 text-green-400" />
          Content Interests
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {interestOptions.map((interest) => (
            <label 
              key={interest} 
              className="flex items-center space-x-2 p-2 rounded-lg border border-gray-600 hover:border-green-400 transition-colors cursor-pointer"
              data-testid="content-interest"
            >
              <Checkbox
                checked={preferences.interests.includes(interest)}
                onCheckedChange={(checked) => handleInterestChange(interest, checked as boolean)}
              />
              <span className="text-gray-200 text-sm">{interest}</span>
            </label>
          ))}
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6 bg-gray-800 border-gray-700">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">
          Notification Preferences
        </h2>
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <Checkbox
              checked={preferences.notifications.email}
              onCheckedChange={(checked) => handleNotificationChange('email', checked as boolean)}
            />
            <span className="text-gray-200">Email notifications for new products and offers</span>
          </label>
          <label className="flex items-center space-x-3">
            <Checkbox
              checked={preferences.notifications.push}
              onCheckedChange={(checked) => handleNotificationChange('push', checked as boolean)}
            />
            <span className="text-gray-200">Push notifications for order updates</span>
          </label>
          <label className="flex items-center space-x-3">
            <Checkbox
              checked={preferences.notifications.sms}
              onCheckedChange={(checked) => handleNotificationChange('sms', checked as boolean)}
            />
            <span className="text-gray-200">SMS notifications for delivery updates</span>
          </label>
        </div>
      </Card>

      {/* Display Settings */}
      <Card className="p-6 bg-gray-800 border-gray-700">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">
          Display Settings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-200 mb-2">Theme</label>
            <select 
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200"
              value={preferences.display.theme}
              onChange={(e) => handleDisplayChange('theme', e.target.value)}
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="auto">Auto</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-200 mb-2">Layout</label>
            <select 
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200"
              value={preferences.display.layout}
              onChange={(e) => handleDisplayChange('layout', e.target.value)}
            >
              <option value="grid">Grid</option>
              <option value="list">List</option>
              <option value="compact">Compact</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-200 mb-2">Font Size</label>
            <select 
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200"
              value={preferences.display.fontSize}
              onChange={(e) => handleDisplayChange('fontSize', e.target.value)}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="text-center">
        <Button 
          onClick={savePreferences}
          disabled={saving}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
          data-testid="save-preferences"
        >
          {saving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </div>
  )
}

export default UserPreferences