'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

const contactInfo = [
  {
    icon: Mail,
    title: 'Email Us',
    details: 'info@tishyafoods.com',
    description: 'Send us an email and we\'ll get back to you within 24 hours',
  },
  {
    icon: Phone,
    title: 'Call Us',
    details: '+91 12345 67890',
    description: 'Speak with our customer service team Monday to Friday',
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    details: 'India',
    description: 'Our production facility and headquarters',
  },
  {
    icon: Clock,
    title: 'Business Hours',
    details: 'Mon - Fri: 9AM - 6PM',
    description: 'Weekend support available via email',
  },
]

const faqs = [
  {
    question: 'What makes Tishya Foods products different?',
    answer: 'Our products are made through a unique process of triple-washing, air-drying, hand-roasting, and fine milling. We source directly from organic farmers and use no artificial preservatives, colors, or white sugars.',
  },
  {
    question: 'Are your products suitable for people with dietary restrictions?',
    answer: 'Yes! All our products are naturally gluten-free, and many are vegan. We clearly label all ingredients and nutritional information to help you make informed choices.',
  },
  {
    question: 'How should I store Tishya Foods products?',
    answer: 'Store in a cool, dry place away from direct sunlight. Once opened, transfer to an airtight container and consume within the recommended timeframe on the packaging.',
  },
  {
    question: 'Do you offer bulk or wholesale pricing?',
    answer: 'Yes, we offer special pricing for bulk orders and wholesale customers. Please contact us directly to discuss your requirements.',
  },
  {
    question: 'What is your return policy?',
    answer: 'We offer a 100% satisfaction guarantee. If you\'re not completely happy with your purchase, contact us within 30 days for a full refund or replacement.',
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Form submitted:', formData)
    alert('Thank you for your message! We\'ll get back to you soon.')
    
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    })
    setIsSubmitting(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-brown-800 mb-6 font-montserrat">
              Get In Touch
            </h1>
            <p className="text-xl text-brown-600 leading-relaxed">
              Have questions about our products or need help with your order? 
              We&apos;re here to help! Reach out to our friendly customer service team.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <info.icon className="h-8 w-8 text-brown-800" />
                </div>
                <h3 className="text-xl font-bold text-brown-800 mb-2">{info.title}</h3>
                <div className="text-lg font-semibold text-primary-600 mb-3">{info.details}</div>
                <p className="text-brown-600 text-sm leading-relaxed">{info.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & FAQ */}
      <section className="pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <MessageCircle className="h-6 w-6 text-primary-600 mr-3" />
                  <h2 className="text-2xl font-bold text-brown-800">Send us a Message</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-brown-800 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-brown-800 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-brown-800 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors"
                        placeholder="+91 12345 67890"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-semibold text-brown-800 mb-2">
                        Subject *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors"
                      >
                        <option value="">Select a subject</option>
                        <option value="product-inquiry">Product Inquiry</option>
                        <option value="order-support">Order Support</option>
                        <option value="wholesale">Wholesale/Bulk Orders</option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-brown-800 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full group"
                    size="lg"
                  >
                    {isSubmitting ? (
                      'Sending...'
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>

            {/* FAQ Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-2xl font-bold text-brown-800 mb-8">Frequently Asked Questions</h2>
              
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <details className="group">
                      <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                        <h3 className="font-semibold text-brown-800 pr-4">{faq.question}</h3>
                        <span className="text-primary-600 group-open:rotate-180 transition-transform duration-200">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </summary>
                      <div className="px-6 pb-6">
                        <p className="text-brown-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    </details>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-primary-100 rounded-lg">
                <h3 className="font-semibold text-brown-800 mb-2">Still have questions?</h3>
                <p className="text-brown-600 text-sm">
                  Can&apos;t find the answer you&apos;re looking for? Feel free to reach out to our 
                  customer service team using the contact form or any of the methods above.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}