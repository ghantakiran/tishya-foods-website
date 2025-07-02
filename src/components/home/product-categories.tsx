'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const categories = [
  {
    id: 1,
    name: "Sweet Protein Treats",
    description: "Guilt-free nutritional treats that perfectly balance taste and health",
    image: "/api/placeholder/400/300",
    color: "from-pink-100 to-pink-200",
    products: ["Biotin Bites", "Nutty Fruit Bites", "Protein Sweet Treats"],
  },
  {
    id: 2,
    name: "Protein Rich Natural Foods",
    description: "Protein shakes, instant porridge mixes, curry & spice mixes, dosa/crepe mixes",
    image: "/api/placeholder/400/300",
    color: "from-green-100 to-green-200",
    products: ["Protein Shakes", "Instant Porridge", "Curry Mixes", "Dosa Mixes"],
  },
  {
    id: 3,
    name: "Savory Protein Treats",
    description: "Nutrient-packed options supporting your active lifestyle",
    image: "/api/placeholder/400/300",
    color: "from-orange-100 to-orange-200",
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
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brown-800 mb-4 font-montserrat">
            Product Categories
          </h2>
          <p className="text-lg text-brown-600 max-w-2xl mx-auto">
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
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
                {/* Category Image */}
                <div className={`h-48 bg-gradient-to-br ${category.color} relative overflow-hidden`}>
                  <motion.div
                    className="absolute inset-0 bg-brown-800/5 flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-brown-800 font-bold text-2xl font-montserrat">
                      {category.name.split(' ')[0]}
                    </div>
                  </motion.div>
                </div>

                {/* Category Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-brown-800 mb-3 group-hover:text-primary-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-brown-600 mb-4 leading-relaxed">
                    {category.description}
                  </p>

                  {/* Product List */}
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-brown-700 mb-2">Popular Products:</p>
                    <div className="flex flex-wrap gap-1">
                      {category.products.map((product, index) => (
                        <span
                          key={index}
                          className="inline-block bg-primary-100 text-brown-700 text-xs px-2 py-1 rounded-full"
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
                      className="flex-1 group-hover:bg-brown-800 group-hover:text-white group-hover:border-brown-800 transition-all duration-300"
                    >
                      Explore
                      <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </Button>
                    <Button 
                      variant="ghost"
                      size="sm"
                      className="text-xs px-2"
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
          <Button size="lg" className="group">
            View All Products
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}