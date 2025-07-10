'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const categories = [
  {
    id: 1,
    name: "Sweet Protein Treats",
    description: "Guilt-free nutritional treats that perfectly balance taste and health",
    image: "https://images.unsplash.com/photo-1599599810694-57a2ca9f5a94?w=400&h=300&fit=crop&crop=center",
    color: "from-berry-500 to-berry-600",
    products: ["Biotin Bites", "Nutty Fruit Bites", "Protein Sweet Treats"],
  },
  {
    id: 2,
    name: "Protein Rich Natural Foods",
    description: "Protein shakes, instant porridge mixes, curry & spice mixes, dosa/crepe mixes",
    image: "https://images.unsplash.com/photo-1599599810694-57a2ca9f5a94?w=400&h=300&fit=crop&crop=center",
    color: "from-primary-500 to-fresh-600",
    products: ["Protein Shakes", "Instant Porridge", "Curry Mixes", "Dosa Mixes"],
  },
  {
    id: 3,
    name: "Savory Protein Treats",
    description: "Nutrient-packed options supporting your active lifestyle",
    image: "https://images.unsplash.com/photo-1599599810694-57a2ca9f5a94?w=400&h=300&fit=crop&crop=center",
    color: "from-citrus-500 to-accent-600",
    products: ["Protein Chips", "Protein Murukulu", "Instant Sambar Mix"],
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
}

export default function ProductCategories() {
  return (
    <section className="py-20 bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-100 mb-4 font-montserrat">
            Product Categories
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Discover our range of protein-rich foods crafted from the finest natural ingredients
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {categories.map((category) => (
            <motion.div
              key={category.id}
              className="group cursor-pointer"
              variants={itemVariants}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-gray-700/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-600">
                {/* Category Image */}
                <div className={`h-48 bg-gradient-to-br ${category.color} relative overflow-hidden`}>
                  <motion.div
                    className="absolute inset-0 bg-white/10 flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-gray-100 font-bold text-2xl font-montserrat drop-shadow-lg bg-gray-800/50 px-4 py-2 rounded-lg backdrop-blur-sm">
                      {category.name.split(' ')[0]}
                    </div>
                  </motion.div>
                </div>

                {/* Category Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-100 mb-3 group-hover:text-green-400 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {category.description}
                  </p>

                  {/* Product List */}
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-gray-200 mb-2">Popular Products:</p>
                    <div className="flex flex-wrap gap-1">
                      {category.products.map((product, index) => (
                        <span
                          key={index}
                          className="inline-block bg-green-900/50 text-green-200 text-xs px-2 py-1 rounded-full border border-green-600"
                        >
                          {product}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      className="flex-1 group-hover:bg-green-600 group-hover:text-white group-hover:border-green-600 transition-all duration-300 border-green-500 text-green-400"
                    >
                      Explore
                      <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </Button>
                    <Button 
                      variant="ghost"
                      size="sm"
                      className="text-xs px-2 text-gray-400 hover:text-gray-200 hover:bg-gray-600"
                      onClick={() => window.location.href = '/compare'}
                    >
                      Compare
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Products CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Button 
            size="lg" 
            className="group bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl border-0 font-semibold"
          >
            View All Products
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}