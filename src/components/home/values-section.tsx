'use client'

import { motion } from 'framer-motion'
import { Leaf, Shield, Heart, Award, Truck, Users } from 'lucide-react'

const values = [
  {
    icon: Leaf,
    title: "100% Natural",
    description: "No artificial colors, dyes, or white sugars. Just pure, wholesome ingredients sourced directly from organic farmers.",
  },
  {
    icon: Shield,
    title: "Gluten-Free",
    description: "All our products are naturally gluten-free, making them safe for everyone to enjoy without compromise.",
  },
  {
    icon: Heart,
    title: "No Preservatives",
    description: "We believe in keeping things simple and natural. Our foods are preservative-free for your health and peace of mind.",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description: "Triple-washed, air-dried, hand-roasted, and fine milled with care. Every step is crafted for excellence.",
  },
  {
    icon: Truck,
    title: "Direct Sourcing",
    description: "We work directly with organic farmers to ensure the highest quality ingredients and fair trade practices.",
  },
  {
    icon: Users,
    title: "Family First",
    description: "Our products are made with families in mind - nutritious, delicious, and enjoyed by all generations.",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

export default function ValuesSection() {
  return (
    <section className="py-20 bg-brown-50">
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
            Our Values & Promise
          </h2>
          <p className="text-lg text-brown-600 max-w-2xl mx-auto">
            Every product we create embodies our commitment to quality, health, and natural goodness
          </p>
        </motion.div>

        {/* Values Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {values.map((value, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              {/* Icon */}
              <motion.div
                className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-200 transition-colors"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <value.icon className="h-8 w-8 text-brown-800" />
              </motion.div>

              {/* Content */}
              <h3 className="text-xl font-bold text-brown-800 mb-3 group-hover:text-primary-600 transition-colors">
                {value.title}
              </h3>
              <p className="text-brown-600 leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Process Section */}
        <motion.div
          className="mt-20 bg-white rounded-3xl p-8 lg:p-12 shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-brown-800 mb-4 font-montserrat">
              Our Craft Process
            </h3>
            <p className="text-brown-600 max-w-2xl mx-auto">
              Every step in our process is designed to preserve the natural goodness and enhance the nutritional value
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Triple Washing", description: "Thoroughly cleaned to remove all impurities" },
              { step: "02", title: "Air Drying", description: "Naturally dried to preserve nutrients" },
              { step: "03", title: "Hand Roasting", description: "Carefully roasted for optimal flavor" },
              { step: "04", title: "Fine Milling", description: "Precisely ground for perfect texture" },
            ].map((process, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="w-16 h-16 bg-brown-800 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {process.step}
                </div>
                <h4 className="text-lg font-semibold text-brown-800 mb-2">{process.title}</h4>
                <p className="text-brown-600 text-sm">{process.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}