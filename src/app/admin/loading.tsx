import { motion } from 'framer-motion'
import { Shield, BarChart, Database, Settings } from 'lucide-react'

export default function AdminLoading() {
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
              <Shield className="w-12 h-12 text-purple-400" />
            </motion.div>
          </div>
          <h1 className="text-3xl font-bold text-gray-100 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-300">
            Loading system overview and analytics...
          </p>
        </motion.div>

        {/* Stats Cards Loading */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {[
            { icon: BarChart, color: 'text-blue-400' },
            { icon: Database, color: 'text-green-400' },
            { icon: Settings, color: 'text-orange-400' },
            { icon: Shield, color: 'text-purple-400' }
          ].map((item, index) => (
            <motion.div
              key={index}
              className="bg-gray-800/80 rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <div className="flex items-center justify-between mb-4">
                <item.icon className={`w-8 h-8 ${item.color}`} />
                <div className="h-4 bg-gray-700 rounded w-12 animate-pulse" />
              </div>
              <div className="h-8 bg-gray-700 rounded w-20 animate-pulse mb-2" />
              <div className="h-4 bg-gray-700 rounded w-full animate-pulse" />
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            {/* Analytics Chart */}
            <div className="bg-gray-800/80 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="h-6 bg-gray-700 rounded w-40 animate-pulse" />
                <div className="h-8 bg-gray-700 rounded w-24 animate-pulse" />
              </div>
              <div className="h-64 bg-gray-700 rounded-lg animate-pulse relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600/30 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "linear"
                  }}
                />
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-gray-800/80 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="h-6 bg-gray-700 rounded w-32 animate-pulse" />
                <div className="flex space-x-2">
                  <div className="h-8 bg-gray-700 rounded w-20 animate-pulse" />
                  <div className="h-8 bg-gray-700 rounded w-16 animate-pulse" />
                </div>
              </div>
              
              {/* Table Headers */}
              <div className="grid grid-cols-4 gap-4 mb-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-700 rounded animate-pulse" />
                ))}
              </div>
              
              {/* Table Rows */}
              {[...Array(6)].map((_, i) => (
                <div key={i} className="grid grid-cols-4 gap-4 mb-3">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="h-6 bg-gray-700 rounded animate-pulse" />
                  ))}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            className="lg:col-span-1 space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            {/* Quick Actions */}
            <div className="bg-gray-800/80 rounded-2xl p-6">
              <div className="h-6 bg-gray-700 rounded w-28 animate-pulse mb-4" />
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-10 bg-gray-700 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-800/80 rounded-2xl p-6">
              <div className="h-6 bg-gray-700 rounded w-32 animate-pulse mb-4" />
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse" />
                    <div className="flex-1 space-y-1">
                      <div className="h-3 bg-gray-700 rounded animate-pulse" />
                      <div className="h-3 bg-gray-700 rounded w-2/3 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Status */}
            <div className="bg-gray-800/80 rounded-2xl p-6">
              <div className="h-6 bg-gray-700 rounded w-28 animate-pulse mb-4" />
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="h-4 bg-gray-700 rounded w-20 animate-pulse" />
                    <div className="w-6 h-6 bg-gray-700 rounded-full animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Loading Message */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center justify-center space-x-2 text-gray-400">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Database className="w-5 h-5" />
            </motion.div>
            <span>Loading dashboard data and system metrics...</span>
          </div>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
            <Shield className="w-4 h-4" />
            <span>Secure admin session • All actions logged</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}