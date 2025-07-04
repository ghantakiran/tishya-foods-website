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
    <section 
      data-testid="hero-section" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900"
    >
      {/* Optimized Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(34,197,94,0.3),rgba(16,185,129,0.2),rgba(5,150,105,0.1))]"></div>
        <div className="absolute inset-0 bg-[conic-gradient(from_45deg_at_50%_50%,rgba(34,197,94,0.1),rgba(16,185,129,0.05),rgba(5,150,105,0.1))]"></div>
      </div>
      {/* Performance-optimized Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      
      {/* Organic Color Accents */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-40 right-20 w-40 h-40 bg-gradient-to-br from-lime-400 to-emerald-500 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full blur-2xl opacity-15 animate-pulse delay-2000"></div>

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
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-lime-500/20 to-emerald-500/20 backdrop-blur-sm border border-lime-400/30 text-lime-200 px-4 py-2 rounded-full text-sm font-medium shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Star className="h-4 w-4 text-yellow-400" />
              <span>ProNatural Protein Rich Foods</span>
            </motion.div>

            {/* Main Headlines */}
            <div className="space-y-4">
              <motion.h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight font-montserrat"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Health At{' '}
                <span className="bg-gradient-to-r from-lime-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent relative">
                  Home!
                  <motion.div
                    className="absolute -bottom-2 left-0 w-full h-3 bg-gradient-to-r from-lime-500/30 to-emerald-500/30 -z-10 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  />
                </span>
              </motion.h1>

              <motion.p
                className="text-xl sm:text-2xl text-emerald-100 max-w-2xl"
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
                <div key={index} className="flex items-center space-x-2 text-emerald-100 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 backdrop-blur-sm px-3 py-2 rounded-full border border-emerald-400/20">
                  <feature.icon className="h-5 w-5 text-orange-400" />
                  <span className="font-medium">{feature.text}</span>
                </div>
              ))}
            </motion.div>

            {/* Process Description */}
            <motion.p
              className="text-emerald-200 max-w-lg leading-relaxed"
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
              <Button 
                data-testid="cta-button"
                size="lg" 
                className="group bg-gradient-to-r from-lime-500 to-emerald-500 hover:from-lime-600 hover:to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105"
              >
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-emerald-400/50 text-emerald-100 hover:bg-emerald-400/10 hover:border-emerald-400 hover:text-emerald-100 bg-transparent backdrop-blur-sm transition-all duration-300 hover:scale-105">
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
                <div className="text-2xl font-bold bg-gradient-to-r from-lime-400 to-emerald-400 bg-clip-text text-transparent">1000+</div>
                <div className="text-sm text-emerald-200">Happy Customers</div>
              </div>
              <div className="w-px h-10 bg-emerald-600/40"></div>
              <div className="text-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">100%</div>
                <div className="text-sm text-emerald-200">Natural Ingredients</div>
              </div>
              <div className="w-px h-10 bg-emerald-600/40"></div>
              <div className="text-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">50+</div>
                <div className="text-sm text-emerald-200">Product Varieties</div>
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
              {/* Optimized Hero Visual */}
              <motion.div
                className="aspect-square rounded-3xl shadow-2xl relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-500 to-teal-600"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 1, 0, -1, 0] 
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
              >
                {/* CSS-only food illustration */}
                <div className="w-full h-full relative flex items-center justify-center">
                  {/* Food bowl illustration using CSS */}
                  <div className="relative">
                    {/* Bowl base */}
                    <div className="w-48 h-32 bg-gradient-to-b from-orange-100 to-orange-200 rounded-b-full border-4 border-orange-300 shadow-inner"></div>
                    
                    {/* Food items */}
                    <div className="absolute top-2 left-8 w-8 h-8 bg-green-400 rounded-full shadow-md"></div>
                    <div className="absolute top-4 right-12 w-6 h-6 bg-red-400 rounded-full shadow-md"></div>
                    <div className="absolute top-6 left-16 w-10 h-6 bg-yellow-400 rounded-full shadow-md"></div>
                    <div className="absolute top-3 right-8 w-7 h-7 bg-purple-400 rounded-full shadow-md"></div>
                    <div className="absolute top-8 left-12 w-8 h-4 bg-orange-400 rounded-full shadow-md"></div>
                    
                    {/* Steam effect */}
                    <div className="absolute -top-4 left-20 w-1 h-8 bg-white opacity-60 rounded-full animate-pulse"></div>
                    <div className="absolute -top-6 left-24 w-1 h-6 bg-white opacity-40 rounded-full animate-pulse delay-300"></div>
                    <div className="absolute -top-5 left-28 w-1 h-7 bg-white opacity-50 rounded-full animate-pulse delay-600"></div>
                  </div>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                
                {/* Brand overlay */}
                <div className="absolute bottom-6 left-6 right-6 text-center">
                  <div className="text-white font-bold text-3xl font-montserrat drop-shadow-lg bg-black/20 backdrop-blur-sm rounded-xl py-3 px-4">
                    Tishya Foods
                  </div>
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                className="absolute -top-4 -right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                Protein Rich
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg"
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
              >
                All Natural
              </motion.div>
              
              {/* Additional floating berry-colored badge */}
              <motion.div
                className="absolute top-1/2 -left-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg"
                animate={{ x: [0, -3, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              >
                Organic
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
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--emerald-600)" />
              <stop offset="50%" stopColor="var(--emerald-500)" />
              <stop offset="100%" stopColor="var(--teal-600)" />
            </linearGradient>
          </defs>
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="url(#waveGradient)"
          />
        </motion.svg>
      </div>
    </section>
  )
}