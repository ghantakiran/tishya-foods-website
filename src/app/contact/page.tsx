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
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!formData.subject) {
      newErrors.subject = 'Please select a subject'
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      setSubmitMessage('Please correct the errors below and try again.')
      return
    }
    
    setIsSubmitting(true)
    setSubmitMessage('')
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('Form submitted:', formData)
      setSubmitMessage('Thank you for your message! We\'ll get back to you within 24 hours.')
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      })
      setErrors({})
    } catch (error) {
      setSubmitMessage('There was an error sending your message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-100 mb-6 font-montserrat">
              Get In Touch
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
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
                className="bg-gray-800 rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-all duration-300 border border-gray-700"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <info.icon className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-100 mb-2">{info.title}</h3>
                <div className="text-lg font-semibold text-blue-400 mb-3">{info.details}</div>
                <p className="text-gray-300 text-sm leading-relaxed">{info.description}</p>
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
              <div className="bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-700">
                <div className="flex items-center mb-6">
                  <MessageCircle className="h-6 w-6 text-blue-400 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-100">Send us a Message</h2>
                </div>

                {/* Form Status Messages */}
                {submitMessage && (
                  <div className={`mb-6 p-4 rounded-lg ${
                    submitMessage.includes('error') || submitMessage.includes('correct') 
                      ? 'bg-red-500/20 border border-red-500/30 text-red-400' 
                      : 'bg-green-500/20 border border-green-500/30 text-green-400'
                  }`} role="alert" aria-live="polite">
                    {submitMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  <fieldset className="border border-gray-600 rounded-lg p-4">
                    <legend className="text-lg font-semibold text-gray-100 px-2">Contact Information</legend>
                    <div className="grid md:grid-cols-2 gap-6 mt-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-100 mb-2">
                          Full Name <span className="text-red-400" aria-label="required">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          aria-invalid={errors.name ? 'true' : 'false'}
                          aria-describedby={errors.name ? 'name-error' : undefined}
                          className={`w-full px-4 py-3 bg-gray-900 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-gray-100 placeholder-gray-400 ${
                            errors.name ? 'border-red-500' : 'border-gray-600'
                          }`}
                          placeholder="Your full name"
                        />
                        {errors.name && (
                          <p id="name-error" className="mt-2 text-sm text-red-400" role="alert">
                            {errors.name}
                          </p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-100 mb-2">
                          Email Address <span className="text-red-400" aria-label="required">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          aria-invalid={errors.email ? 'true' : 'false'}
                          aria-describedby={errors.email ? 'email-error' : undefined}
                          className={`w-full px-4 py-3 bg-gray-900 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-gray-100 placeholder-gray-400 ${
                            errors.email ? 'border-red-500' : 'border-gray-600'
                          }`}
                          placeholder="your.email@example.com"
                        />
                        {errors.email && (
                          <p id="email-error" className="mt-2 text-sm text-red-400" role="alert">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>
                  </fieldset>

                  <fieldset className="border border-gray-600 rounded-lg p-4">
                    <legend className="text-lg font-semibold text-gray-100 px-2">Additional Details</legend>
                    <div className="grid md:grid-cols-2 gap-6 mt-4">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-gray-100 mb-2">
                          Phone Number <span className="text-gray-400">(optional)</span>
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-gray-100 placeholder-gray-400"
                          placeholder="+91 12345 67890"
                          aria-describedby="phone-help"
                        />
                        <p id="phone-help" className="mt-1 text-xs text-gray-400">
                          We'll use this for urgent matters or follow-up calls
                        </p>
                      </div>
                      <div>
                        <label htmlFor="subject" className="block text-sm font-semibold text-gray-100 mb-2">
                          Subject <span className="text-red-400" aria-label="required">*</span>
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          aria-invalid={errors.subject ? 'true' : 'false'}
                          aria-describedby={errors.subject ? 'subject-error' : undefined}
                          className={`w-full px-4 py-3 bg-gray-900 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-gray-100 ${
                            errors.subject ? 'border-red-500' : 'border-gray-600'
                          }`}
                        >
                          <option value="">Select a subject</option>
                          <option value="product-inquiry">Product Inquiry</option>
                          <option value="order-support">Order Support</option>
                          <option value="wholesale">Wholesale/Bulk Orders</option>
                          <option value="feedback">Feedback</option>
                          <option value="other">Other</option>
                        </select>
                        {errors.subject && (
                          <p id="subject-error" className="mt-2 text-sm text-red-400" role="alert">
                            {errors.subject}
                          </p>
                        )}
                      </div>
                    </div>
                  </fieldset>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-100 mb-2">
                      Message <span className="text-red-400" aria-label="required">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      aria-invalid={errors.message ? 'true' : 'false'}
                      aria-describedby={`message-help ${errors.message ? 'message-error' : ''}`}
                      className={`w-full px-4 py-3 bg-gray-900 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none text-gray-100 placeholder-gray-400 ${
                        errors.message ? 'border-red-500' : 'border-gray-600'
                      }`}
                      placeholder="Tell us how we can help you..."
                    />
                    <p id="message-help" className="mt-1 text-xs text-gray-400">
                      Please provide as much detail as possible. Minimum 10 characters.
                    </p>
                    {errors.message && (
                      <p id="message-error" className="mt-2 text-sm text-red-400" role="alert">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                    size="lg"
                    aria-describedby="submit-help"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
                  <p id="submit-help" className="text-xs text-gray-400 text-center mt-2">
                    We typically respond within 24 hours
                  </p>
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
              <h2 className="text-2xl font-bold text-gray-100 mb-8">Frequently Asked Questions</h2>
              
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <details className="group">
                      <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-900 transition-colors">
                        <h3 className="font-semibold text-gray-100 pr-4">{faq.question}</h3>
                        <span className="text-blue-400 group-open:rotate-180 transition-transform duration-200">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </summary>
                      <div className="px-6 pb-6">
                        <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                      </div>
                    </details>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-blue-600/20 border border-blue-500/30 rounded-lg">
                <h3 className="font-semibold text-gray-100 mb-2">Still have questions?</h3>
                <p className="text-gray-300 text-sm">
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