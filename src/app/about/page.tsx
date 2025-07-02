'use client'

import { motion } from 'framer-motion'
import { Leaf, Heart, Award, Users, Target, Globe } from 'lucide-react'

const milestones = [
  {
    year: '2018',
    title: 'Founded with Vision',
    description: 'Started with a mission to provide pure, wholesome protein-rich foods to families across India.',
  },
  {
    year: '2019',
    title: 'Organic Partnership',
    description: 'Established direct partnerships with organic farmers to ensure quality and fair trade practices.',
  },
  {
    year: '2020',
    title: 'Product Innovation',
    description: 'Developed our signature triple-washing, air-drying, and hand-roasting process.',
  },
  {
    year: '2022',
    title: 'National Reach',
    description: 'Expanded distribution across India with 50+ product varieties and 1000+ happy customers.',
  },
  {
    year: '2024',
    title: 'Digital Transformation',
    description: 'Launched modern e-commerce platform to better serve health-conscious families nationwide.',
  },
]

const values = [
  {
    icon: Leaf,
    title: 'Natural & Pure',
    description: 'We believe in keeping ingredients simple, natural, and free from artificial additives.',
  },
  {
    icon: Heart,
    title: 'Health First',
    description: 'Every product is crafted with nutrition and wellness at the forefront of our minds.',
  },
  {
    icon: Award,
    title: 'Quality Excellence',
    description: 'Our meticulous process ensures every product meets the highest standards of quality.',
  },
  {
    icon: Users,
    title: 'Family Focused',
    description: 'We create products that bring families together around healthy, delicious meals.',
  },
  {
    icon: Target,
    title: 'Mission Driven',
    description: 'Committed to making healthy nutrition accessible and affordable for everyone.',
  },
  {
    icon: Globe,
    title: 'Sustainable Future',
    description: 'Supporting sustainable farming practices and environmental responsibility.',
  },
]

const team = [
  {
    name: 'Founder & CEO',
    role: 'Visionary Leader',
    description: 'Passionate about transforming how families approach nutrition and wellness.',
    image: '/api/placeholder/300/300',
  },
  {
    name: 'Head of Quality',
    role: 'Quality Assurance',
    description: 'Ensures every product meets our strict standards for purity and nutrition.',
    image: '/api/placeholder/300/300',
  },
  {
    name: 'Nutrition Expert',
    role: 'Product Development',
    description: 'Develops innovative recipes that balance taste, nutrition, and health benefits.',
    image: '/api/placeholder/300/300',
  },
]

export default function AboutPage() {
  return (
    <div className="pt-20 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-50 to-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-brown-800 mb-6 font-montserrat">
              Our Story
            </h1>
            <p className="text-xl sm:text-2xl text-brown-600 mb-8 leading-relaxed">
              Where nature&apos;s goodness is lovingly crafted into the purest and 
              most wholesome protein-rich foods for your family&apos;s health and happiness.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-brown-800 mb-2">1000+</div>
                <div className="text-brown-600">Happy Families</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-brown-800 mb-2">50+</div>
                <div className="text-brown-600">Product Varieties</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-brown-800 mb-2">100%</div>
                <div className="text-brown-600">Natural Ingredients</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-brown-800 mb-6 font-montserrat">
                Our Mission
              </h2>
              <p className="text-lg text-brown-600 mb-6 leading-relaxed">
                To provide families with access to pure, wholesome, protein-rich foods that 
                support health and wellness without compromising on taste or convenience. 
                We believe that everyone deserves nutrition that nourishes both body and soul.
              </p>
              <p className="text-lg text-brown-600 leading-relaxed">
                Through our meticulous triple-washing, air-drying, hand-roasting, and fine 
                milling process, we preserve the natural goodness of every ingredient while 
                creating products that fit seamlessly into modern family life.
              </p>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="aspect-square bg-gradient-to-br from-primary-200 to-primary-300 rounded-3xl flex items-center justify-center shadow-2xl">
                <div className="text-brown-800 font-bold text-2xl font-montserrat text-center">
                  Health<br />At Home!
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-brown-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-brown-800 mb-4 font-montserrat">
              Our Journey
            </h2>
            <p className="text-lg text-brown-600 max-w-2xl mx-auto">
              From a small vision to serving families across India with premium natural foods
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-primary-300 hidden lg:block"></div>

            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                className="relative flex items-center mb-12 lg:mb-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className={`lg:w-1/2 ${index % 2 === 0 ? 'lg:pr-12 lg:text-right' : 'lg:pl-12 lg:ml-auto'}`}>
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <div className="text-primary-600 font-bold text-lg mb-2">{milestone.year}</div>
                    <h3 className="text-xl font-bold text-brown-800 mb-3">{milestone.title}</h3>
                    <p className="text-brown-600 leading-relaxed">{milestone.description}</p>
                  </div>
                </div>

                {/* Timeline Dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary-500 rounded-full border-4 border-white shadow-lg hidden lg:block"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-brown-800 mb-4 font-montserrat">
              Our Core Values
            </h2>
            <p className="text-lg text-brown-600 max-w-2xl mx-auto">
              The principles that guide every decision we make and every product we create
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
                  <value.icon className="h-8 w-8 text-brown-800" />
                </div>
                <h3 className="text-xl font-bold text-brown-800 mb-3">{value.title}</h3>
                <p className="text-brown-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-brown-800 mb-4 font-montserrat">
              Meet Our Team
            </h2>
            <p className="text-lg text-brown-600 max-w-2xl mx-auto">
              The passionate individuals behind Tishya Foods&apos; commitment to excellence
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-24 h-24 bg-gradient-to-br from-primary-200 to-primary-300 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-brown-800 font-bold text-lg">TF</span>
                </div>
                <h3 className="text-xl font-bold text-brown-800 mb-2">{member.name}</h3>
                <div className="text-primary-600 font-semibold mb-4">{member.role}</div>
                <p className="text-brown-600 leading-relaxed">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-brown-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 font-montserrat">
              Join Our Healthy Family
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Experience the difference that pure, wholesome ingredients can make 
              in your family&apos;s health and happiness.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary-500 text-brown-800 px-8 py-3 rounded-lg font-semibold hover:bg-primary-400 transition-colors">
                Shop Our Products
              </button>
              <button className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-brown-800 transition-colors">
                Contact Us
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}