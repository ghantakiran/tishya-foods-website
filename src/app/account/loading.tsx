import { motion } from 'framer-motion'
import { User, Settings, Shield } from 'lucide-react'

export default function AccountLoading() {
  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header Loading */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <User className="w-12 h-12 text-blue-400" />
            </motion.div>
          </div>
          <h1 className="text-3xl font-bold text-gray-100 mb-2">
            My Account
          </h1>
          <p className="text-gray-300">
            Loading your account information...
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Loading */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-gray-800/80 rounded-2xl p-6">
                {/* Profile Picture */}
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gray-700 rounded-full mx-auto animate-pulse mb-3" />
                  <div className="h-5 bg-gray-700 rounded w-32 mx-auto animate-pulse mb-2" />
                  <div className="h-4 bg-gray-700 rounded w-24 mx-auto animate-pulse" />
                </div>
                
                {/* Navigation Menu */}
                <nav className="space-y-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-3 p-3 rounded-lg">
                      <div className="w-5 h-5 bg-gray-700 rounded animate-pulse" />
                      <div className="h-4 bg-gray-700 rounded w-24 animate-pulse" />
                    </div>
                  ))}
                </nav>
              </div>
            </motion.div>

            {/* Main Content Loading */}
            <motion.div
              className="lg:col-span-3 space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              {/* Personal Information */}
              <div className="bg-gray-800/80 rounded-2xl p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Settings className="w-5 h-5 text-blue-400" />
                  <div className="h-6 bg-gray-700 rounded w-40 animate-pulse" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 bg-gray-700 rounded w-24 animate-pulse" />
                      <div className="h-10 bg-gray-700 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 flex space-x-3">
                  <div className="h-10 bg-blue-600/50 rounded w-24 animate-pulse" />
                  <div className="h-10 bg-gray-700 rounded w-20 animate-pulse" />
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-800/80 rounded-2xl p-6">
                <div className="h-6 bg-gray-700 rounded w-32 animate-pulse mb-6" />
                
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 p-4 bg-gray-700/50 rounded-lg">
                      <div className="w-10 h-10 bg-gray-700 rounded-full animate-pulse" />
                      <div className="flex-1">
                        <div className="h-4 bg-gray-700 rounded mb-2 animate-pulse" />
                        <div className="h-3 bg-gray-700 rounded w-2/3 animate-pulse" />
                      </div>
                      <div className="h-3 bg-gray-700 rounded w-16 animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Settings */}
              <div className="bg-gray-800/80 rounded-2xl p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Shield className="w-5 h-5 text-green-400" />
                  <div className="h-6 bg-gray-700 rounded w-36 animate-pulse" />
                </div>
                
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-700 rounded animate-pulse" />
                        <div>
                          <div className="h-4 bg-gray-700 rounded w-32 mb-1 animate-pulse" />
                          <div className="h-3 bg-gray-700 rounded w-24 animate-pulse" />
                        </div>
                      </div>
                      <div className="h-6 w-12 bg-gray-700 rounded-full animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Loading Message */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center justify-center space-x-2 text-gray-400">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <User className="w-5 h-5" />
            </motion.div>
            <span>Loading your personal dashboard...</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}