'use client'

import { motion } from 'framer-motion'
import { Sparkles, Target, Brain, Zap, Heart } from 'lucide-react'
import ProductRecommendations from '@/components/ai/product-recommendations'

export default function RecommendationsPage() {
  return (
    <div className="pt-20 min-h-screen bg-earth-900">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-earth-800 to-primary-600 text-white px-4 py-2 rounded-full mb-6">
              <Brain className="h-4 w-4" />
              <span className="text-sm font-semibold">AI-Powered Nutrition</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-cream-100 mb-6 font-montserrat">
              Personalized Product Recommendations
            </h1>
            <p className="text-xl sm:text-2xl text-cream-300 mb-8 leading-relaxed">
              Let our AI nutrition expert analyze your goals and preferences to recommend 
              the perfect Tishya Foods products for your unique health journey.
            </p>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="w-16 h-16 bg-earth-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-cream-100 mb-2">Goal-Based Matching</h3>
                <p className="text-cream-300">
                  Products matched to your specific health and fitness goals
                </p>
              </motion.div>

              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-cream-100" />
                </div>
                <h3 className="text-xl font-bold text-cream-100 mb-2">Smart Analysis</h3>
                <p className="text-cream-300">
                  Advanced AI considers your lifestyle, diet, and preferences
                </p>
              </motion.div>

              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="w-16 h-16 bg-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-cream-100 mb-2">Instant Results</h3>
                <p className="text-cream-300">
                  Get personalized recommendations in under 2 minutes
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Recommendation Engine */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <ProductRecommendations />
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-earth-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-cream-100 mb-4 font-montserrat">
              How Our AI Works
            </h2>
            <p className="text-lg text-cream-300 max-w-2xl mx-auto">
              Our intelligent recommendation system uses advanced algorithms to match you with the perfect products
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Analyze Your Goals',
                description: 'We understand your health objectives, from weight management to muscle building',
                icon: Target,
              },
              {
                step: '02',
                title: 'Consider Your Lifestyle',
                description: 'Activity level, age, and daily routine all factor into our recommendations',
                icon: Zap,
              },
              {
                step: '03',
                title: 'Match Dietary Needs',
                description: 'Vegan, gluten-free, organic preferences are perfectly matched',
                icon: Heart,
              },
              {
                step: '04',
                title: 'Generate Perfect Match',
                description: 'Get products with detailed explanations of why they\'re perfect for you',
                icon: Sparkles,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-earth-800 rounded-3xl flex items-center justify-center mx-auto">
                    <item.icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-cream-100 font-bold text-sm">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-cream-100 mb-3">{item.title}</h3>
                <p className="text-cream-300 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-cream-100 mb-6 font-montserrat">
                Why Choose AI Recommendations?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-earth-800 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-cream-100 mb-1">Scientifically Backed</h3>
                    <p className="text-cream-300">Our algorithms are based on nutritional science and dietary research</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-earth-800 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-cream-100 mb-1">Personalized Results</h3>
                    <p className="text-cream-300">No two recommendations are the same - every suggestion is tailored to you</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-earth-800 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-cream-100 mb-1">Save Time & Money</h3>
                    <p className="text-cream-300">Stop guessing which products to buy - get exactly what works for your goals</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-earth-800 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-cream-100 mb-1">Continuous Learning</h3>
                    <p className="text-cream-300">Our AI gets smarter with every recommendation, improving accuracy over time</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="aspect-square bg-gradient-to-br from-earth-800 to-primary-600 rounded-3xl flex items-center justify-center shadow-2xl">
                <div className="text-center text-white">
                  <Brain className="h-16 w-16 mx-auto mb-4" />
                  <div className="text-2xl font-bold mb-2">Smart Nutrition</div>
                  <div className="text-primary-200">Powered by AI</div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <motion.div
                className="absolute -top-4 -right-4 bg-earth-800 rounded-full p-3 shadow-lg"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sparkles className="h-6 w-6 text-cream-100" />
              </motion.div>
              
              <motion.div
                className="absolute -bottom-4 -left-4 bg-primary-500 rounded-full p-3 shadow-lg"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              >
                <Target className="h-6 w-6 text-cream-100" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

