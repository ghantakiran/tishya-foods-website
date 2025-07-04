'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: "Sushmitha",
    rating: 5,
    comment: "I absolutely love the protein chips, protein murukulu, and sweet bites! They're the perfect healthy snack that actually tastes amazing. The quality is outstanding and I can feel good about what I'm eating.",
    verified: true,
  },
  {
    id: 2,
    name: "Ana Mixson",
    rating: 5,
    comment: "As a busy mom, I appreciate having healthy options that my whole family enjoys. Tishya Foods products are made with clean ingredients and no artificial additives. My kids love them!",
    verified: true,
  },
  {
    id: 3,
    name: "Nina Roloff",
    rating: 5,
    comment: "These protein-rich foods have become a staple in my fitness routine. The plant-based options are perfect for muscle building and recovery. Highly recommend for anyone serious about their health!",
    verified: true,
  },
  {
    id: 4,
    name: "Rayabarapu Pulla Rao",
    rating: 5,
    comment: "The instant mixes are so convenient and taste just like homemade. My grandmother was impressed with the traditional flavors. Easy to prepare and enjoyed by all generations in our family.",
    verified: true,
  },
  {
    id: 5,
    name: "Deepa Peddamail",
    rating: 5,
    comment: "I use these products in so many different ways - from quick breakfasts to elaborate dinner preparations. The versatility and consistent quality make them a must-have in my kitchen.",
    verified: true,
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

export default function Testimonials() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-earth-800 mb-4 font-montserrat">
            What Our Customers Say
          </h2>
          <p className="text-lg text-earth-600 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have made Tishya Foods part of their healthy lifestyle
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              className="bg-earth-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 relative"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 left-6">
                <div className="bg-primary-500 rounded-full p-2">
                  <Quote className="h-4 w-4 text-earth-800" />
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4 pt-2">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-accent-500 fill-current" />
                ))}
              </div>

              {/* Comment */}
              <p className="text-cream-200 mb-6 leading-relaxed">
                &quot;{testimonial.comment}&quot;
              </p>

              {/* Customer Info */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-cream-100">{testimonial.name}</p>
                  {testimonial.verified && (
                    <p className="text-sm text-primary-600 flex items-center mt-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                      Verified Customer
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-earth-800 mb-2">4.9</div>
            <div className="text-earth-600">Average Rating</div>
            <div className="flex justify-center mt-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-accent-500 fill-current" />
              ))}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-earth-800 mb-2">1000+</div>
            <div className="text-earth-600">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-earth-800 mb-2">500+</div>
            <div className="text-earth-600">Reviews</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-earth-800 mb-2">95%</div>
            <div className="text-earth-600">Repeat Customers</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}