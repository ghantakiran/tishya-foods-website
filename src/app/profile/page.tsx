import { UserPreferences } from '@/components/personalization/user-preferences'

export default function ProfilePage() {
  return (
    <div className="pt-16 lg:pt-20 bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UserPreferences />
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Your Profile - Tishya Foods',
  description: 'Manage your preferences and personalize your Tishya Foods experience',
}