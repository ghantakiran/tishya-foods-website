'use client'

import { motion } from 'framer-motion'
import { Instagram, Heart, MessageCircle, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface InstagramPost {
  id: string
  imageUrl: string
  caption: string
  likes: number
  comments: number
  timestamp: string
  postUrl: string
  hashtags: string[]
}

const mockPosts: InstagramPost[] = [
  {
    id: '1',
    imageUrl: '/api/placeholder/400/400',
    caption: 'Starting the day right with our Protein Power Smoothie Bowl! 🌟 Packed with 25g of plant-based protein and topped with fresh berries. Perfect fuel for your morning workout! 💪',
    likes: 234,
    comments: 18,
    timestamp: '2 hours ago',
    postUrl: 'https://instagram.com/tishyafoods/p/1',
    hashtags: ['#TishyaFoods', '#ProteinSmoothie', '#HealthyBreakfast', '#PlantBased'],
  },
  {
    id: '2',
    imageUrl: '/api/placeholder/400/400',
    caption: 'Behind the scenes: Our organic farmers hand-picking the finest ingredients for your health! 🌱 From farm to your table, we ensure every step maintains the natural goodness.',
    likes: 189,
    comments: 12,
    timestamp: '1 day ago',
    postUrl: 'https://instagram.com/tishyafoods/p/2',
    hashtags: ['#OrganicFarming', '#FarmToTable', '#NaturalGoodness', '#TishyaFoods'],
  },
  {
    id: '3',
    imageUrl: '/api/placeholder/400/400',
    caption: 'Customer spotlight! ⭐ "My kids absolutely love the Protein Chips - they don\'t even know they\'re eating something so nutritious!" - Thanks for sharing, Sarah! 💕',
    likes: 156,
    comments: 23,
    timestamp: '2 days ago',
    postUrl: 'https://instagram.com/tishyafoods/p/3',
    hashtags: ['#CustomerLove', '#ProteinChips', '#HealthySnacks', '#KidsApproved'],
  },
  {
    id: '4',
    imageUrl: '/api/placeholder/400/400',
    caption: 'Recipe Sunday! 👩‍🍳 Try our 15-minute Protein Dosa with instant sambar. Traditional taste, modern nutrition. Recipe link in bio! 🔗',
    likes: 278,
    comments: 31,
    timestamp: '3 days ago',
    postUrl: 'https://instagram.com/tishyafoods/p/4',
    hashtags: ['#RecipeSunday', '#ProteinDosa', '#TraditionalFood', '#QuickRecipes'],
  },
  {
    id: '5',
    imageUrl: '/api/placeholder/400/400',
    caption: 'Triple-washed, air-dried, hand-roasted with love ❤️ Our traditional process preserves every nutrient while creating the perfect texture and flavor.',
    likes: 203,
    comments: 15,
    timestamp: '4 days ago',
    postUrl: 'https://instagram.com/tishyafoods/p/5',
    hashtags: ['#TraditionalProcess', '#QualityFirst', '#NaturalGoodness', '#TishyaFoods'],
  },
  {
    id: '6',
    imageUrl: '/api/placeholder/400/400',
    caption: 'Workout fuel that tastes amazing! 🏃‍♀️ Our Biotin Bites are perfect pre or post-exercise. Healthy hair, skin, and nails are just a bonus! ✨',
    likes: 167,
    comments: 9,
    timestamp: '5 days ago',
    postUrl: 'https://instagram.com/tishyafoods/p/6',
    hashtags: ['#BiotinBites', '#WorkoutFuel', '#HealthySnacks', '#BeautyFromWithin'],
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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
}

export default function InstagramFeed() {
  const formatHashtags = (hashtags: string[]) => {
    return hashtags.map((tag, index) => (
      <span key={tag} className="text-primary-600 hover:text-primary-700 cursor-pointer">
        {index > 0 ? ' ' : ''}{tag}
      </span>
    ))
  }

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
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full mb-4">
            <Instagram className="h-4 w-4" />
            <span className="text-sm font-semibold">@tishyafoods</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brown-800 mb-4 font-montserrat">
            Follow Our Journey
          </h2>
          <p className="text-lg text-brown-600 max-w-2xl mx-auto">
            Join our community on Instagram for daily inspiration, recipes, and behind-the-scenes glimpses of our natural food journey
          </p>
        </motion.div>

        {/* Instagram Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {mockPosts.map((post) => (
            <motion.div
              key={post.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              {/* Post Image */}
              <div className="relative aspect-square bg-gradient-to-br from-primary-100 to-primary-200 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-brown-800 font-bold text-lg text-center px-4">
                    {post.caption.split(' ').slice(0, 3).join(' ')}...
                  </span>
                </div>
                
                {/* Hover Overlay */}
                <motion.div
                  className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  <div className="text-white text-center">
                    <div className="flex items-center justify-center space-x-6 mb-4">
                      <div className="flex items-center space-x-2">
                        <Heart className="h-5 w-5 fill-current" />
                        <span className="font-semibold">{post.likes}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MessageCircle className="h-5 w-5" />
                        <span className="font-semibold">{post.comments}</span>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on Instagram
                    </Button>
                  </div>
                </motion.div>
              </div>

              {/* Post Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Heart className="h-4 w-4" />
                      <span className="text-sm font-semibold">{post.likes}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm font-semibold">{post.comments}</span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{post.timestamp}</span>
                </div>

                <p className="text-brown-700 text-sm leading-relaxed mb-3 line-clamp-3">
                  {post.caption}
                </p>

                <div className="text-sm">
                  {formatHashtags(post.hashtags)}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Follow CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0"
            >
              <Instagram className="mr-2 h-5 w-5" />
              Follow @tishyafoods
            </Button>
            <Button variant="outline" size="lg">
              Share Your Tishya Moment
            </Button>
          </div>
          
          <p className="text-brown-600 mt-4 text-sm">
            Tag us in your healthy creations for a chance to be featured! Use #TishyaFoods #HealthAtHome
          </p>
        </motion.div>

        {/* User Generated Content Prompt */}
        <motion.div
          className="mt-16 bg-white rounded-2xl p-8 shadow-lg text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h3 className="text-2xl font-bold text-brown-800 mb-4">Share Your Healthy Journey</h3>
          <p className="text-brown-600 mb-6 max-w-2xl mx-auto">
            We love seeing how our community uses Tishya Foods products! Share your recipes, 
            meal prep ideas, and healthy lifestyle moments with us.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📸</span>
              </div>
              <h4 className="font-semibold text-brown-800 mb-2">1. Take a Photo</h4>
              <p className="text-sm text-brown-600">Capture your delicious Tishya Foods creation</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🏷️</span>
              </div>
              <h4 className="font-semibold text-brown-800 mb-2">2. Tag Us</h4>
              <p className="text-sm text-brown-600">Use @tishyafoods and #HealthAtHome in your post</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⭐</span>
              </div>
              <h4 className="font-semibold text-brown-800 mb-2">3. Get Featured</h4>
              <p className="text-sm text-brown-600">Your post might be featured on our page!</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}