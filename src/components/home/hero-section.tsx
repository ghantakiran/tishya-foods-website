'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Star, Leaf, Shield, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'

const features = [
  {
    icon: Leaf,
    text: "All Natural",
  },
  {
    icon: Shield,
    text: "Gluten Free",
  },
  {
    icon: Heart,
    text: "No Preservatives",
  },
]

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('/grain-pattern.svg')] bg-repeat"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            className="space-y-8 text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center space-x-2 bg-gray-800 border border-primary-600 text-primary-400 px-4 py-2 rounded-full text-sm font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Star className="h-4 w-4 text-accent-500" />
              <span>ProNatural Protein Rich Foods</span>
            </motion.div>

            {/* Main Headlines */}
            <div className="space-y-4">
              <motion.h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-100 leading-tight font-montserrat"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Health At{' '}
                <span className="text-primary-400 relative">
                  Home!
                  <motion.div
                    className="absolute -bottom-2 left-0 w-full h-3 bg-primary-600/20 -z-10"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  />
                </span>
              </motion.h1>

              <motion.p
                className="text-xl sm:text-2xl text-gray-300 max-w-2xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Where nature&apos;s goodness is lovingly crafted into the purest and 
                most wholesome protein-rich foods
              </motion.p>
            </div>

            {/* Features */}
            <motion.div
              className="flex flex-wrap justify-center lg:justify-start gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 text-gray-300">
                  <feature.icon className="h-5 w-5 text-accent-500" />
                  <span className="font-medium">{feature.text}</span>
                </div>
              ))}
            </motion.div>

            {/* Process Description */}
            <motion.p
              className="text-gray-300 max-w-lg leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Triple-washed, air-dried, hand-roasted, and fine milled with care. 
              Sourced directly from organic farmers with simple and natural preparation.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Button size="lg" className="group">
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="flex items-center justify-center lg:justify-start space-x-6 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-100">1000+</div>
                <div className="text-sm text-gray-300">Happy Customers</div>
              </div>
              <div className="w-px h-10 bg-gray-600"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-100">100%</div>
                <div className="text-sm text-gray-300">Natural Ingredients</div>
              </div>
              <div className="w-px h-10 bg-gray-600"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-100">50+</div>
                <div className="text-sm text-gray-300">Product Varieties</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Image/3D Element */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative w-full max-w-lg mx-auto">
              {/* Placeholder for product image or 3D element */}
              <motion.div
                className="aspect-square bg-gradient-to-br from-primary-200 to-primary-300 rounded-3xl shadow-2xl flex items-center justify-center"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 2, 0, -2, 0] 
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
              >
                <div className="text-gray-100 font-bold text-4xl font-montserrat">
                  Tishya
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                className="absolute -top-4 -right-4 bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                Protein Rich
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4 bg-gray-900 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg"
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
              >
                All Natural
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <motion.svg
          viewBox="0 0 1440 120"
          fill="none"
          className="w-full h-24"
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="#111827"
          />
        </motion.svg>
      </div>
    </section>
  )
}