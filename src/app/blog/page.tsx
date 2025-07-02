import { Metadata } from 'next'
import { BlogProvider } from '@/contexts/blog-context'
import { BlogList } from '@/components/blog/blog-list'
import { BlogFilters } from '@/components/blog/blog-filters'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, TrendingUp, Calendar, Users } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog - Tishya Foods | Nutrition, Health & Wellness',
  description: 'Discover expert insights on nutrition, health, and wellness. Learn about protein-rich foods, sustainable farming, healthy recipes, and wellness tips from our nutrition experts.',
  keywords: 'nutrition blog, health tips, wellness advice, protein foods, healthy eating, plant-based nutrition, sustainable farming, food science',
  openGraph: {
    title: 'Blog - Tishya Foods | Nutrition, Health & Wellness',
    description: 'Expert insights on nutrition, health, and wellness from Tishya Foods.',
    type: 'website',
    images: [{ url: '/images/blog/blog-hero.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - Tishya Foods | Nutrition, Health & Wellness',
    description: 'Expert insights on nutrition, health, and wellness from Tishya Foods.',
    images: ['/images/blog/blog-hero.jpg'],
  }
}

const blogStats = [
  {
    icon: BookOpen,
    label: 'Articles Published',
    value: '120+',
    description: 'Expert-written content'
  },
  {
    icon: Users,
    label: 'Expert Authors',
    value: '8',
    description: 'Nutrition specialists'
  },
  {
    icon: TrendingUp,
    label: 'Monthly Readers',
    value: '50K+',
    description: 'Growing community'
  },
  {
    icon: Calendar,
    label: 'Updated',
    value: 'Weekly',
    description: 'Fresh content regularly'
  }
]

const featuredCategories = [
  {
    id: '1',
    name: 'Nutrition',
    slug: 'nutrition',
    description: 'Science-backed nutrition guidance',
    postCount: 24,
    color: '#10B981'
  },
  {
    id: '2',
    name: 'Health',
    slug: 'health',
    description: 'Holistic health and wellness',
    postCount: 18,
    color: '#3B82F6'
  },
  {
    id: '4',
    name: 'Recipes',
    slug: 'recipes',
    description: 'Healthy and delicious recipes',
    postCount: 15,
    color: '#F59E0B'
  },
  {
    id: '3',
    name: 'Sustainability',
    slug: 'sustainability',
    description: 'Sustainable food practices',
    postCount: 12,
    color: '#059669'
  }
]

export default function BlogPage() {
  return (
    <BlogProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Nutrition & Wellness
                <span className="block text-primary">Knowledge Hub</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Discover expert insights on nutrition, health, and sustainable living. 
                Our team of nutrition specialists shares science-backed advice to help you make informed choices about your health and wellness.
              </p>
              
              {/* Blog Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {blogStats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-3">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-sm font-medium text-gray-700 mb-1">{stat.label}</div>
                    <div className="text-xs text-gray-500">{stat.description}</div>
                  </div>
                ))}
              </div>

              {/* Featured Categories */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {featuredCategories.map((category) => (
                  <Link key={category.id} href={`/blog/category/${category.slug}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                      <CardContent className="p-4 text-center">
                        <div 
                          className="w-12 h-12 rounded-lg mx-auto mb-3 flex items-center justify-center"
                          style={{ backgroundColor: `${category.color}20` }}
                        >
                          <div 
                            className="w-6 h-6 rounded"
                            style={{ backgroundColor: category.color }}
                          />
                        </div>
                        <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {category.description}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          {category.postCount} articles
                        </Badge>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <BlogFilters 
                  filters={{}}
                  categories={featuredCategories}
                  tags={[]}
                  onFilterChange={() => {}}
                  onClear={() => {}}
                />
              </div>
            </div>

            {/* Blog Posts */}
            <div className="lg:col-span-3">
              <BlogList />
            </div>
          </div>
        </div>

        {/* Newsletter CTA */}
        <div className="bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">
                Stay Updated with Our Latest Articles
              </h2>
              <p className="text-primary-foreground/80 mb-8">
                Get weekly nutrition tips, health insights, and exclusive content delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500"
                />
                <Button 
                  variant="secondary" 
                  className="px-8 py-3 bg-white text-primary hover:bg-gray-100"
                >
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-primary-foreground/60 mt-4">
                No spam, unsubscribe anytime. We respect your privacy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </BlogProvider>
  )
}