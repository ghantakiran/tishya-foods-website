import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BlogPost } from '@/components/blog/blog-post'
import { BlogProvider } from '@/contexts/blog-context'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

// This would typically fetch from your CMS or API
async function getPost(slug: string) {
  // Mock data for demonstration
  const mockPost = {
    id: '1',
    title: 'The Complete Guide to Protein-Rich Foods for Optimal Health',
    slug: slug,
    excerpt: 'Discover the essential role of protein in your diet and learn about the best natural sources for maintaining optimal health and wellness.',
    content: `
      <p>Protein is one of the three macronutrients essential for human health, alongside carbohydrates and fats. It plays a crucial role in building and repairing tissues, producing enzymes and hormones, and supporting immune function.</p>
      
      <h2>Why Protein Matters</h2>
      <p>Every cell in your body contains protein. It's used to build and repair tissues such as muscles, bones, cartilage, skin, and blood. Protein is also used to make enzymes, hormones, and other body chemicals.</p>
      
      <h3>Benefits of High-Quality Protein</h3>
      <ul>
        <li>Muscle growth and maintenance</li>
        <li>Weight management support</li>
        <li>Improved bone health</li>
        <li>Enhanced immune function</li>
        <li>Better recovery after exercise</li>
      </ul>
      
      <h2>Best Natural Protein Sources</h2>
      <p>At Tishya Foods, we focus on providing the highest quality protein-rich foods that are minimally processed and maximally nutritious.</p>
      
      <h3>Plant-Based Proteins</h3>
      <p>Plant proteins are excellent for those following vegetarian or vegan diets. Our top recommendations include:</p>
      <ul>
        <li><strong>Quinoa</strong> - A complete protein containing all nine essential amino acids</li>
        <li><strong>Lentils</strong> - Rich in protein and fiber, perfect for soups and salads</li>
        <li><strong>Chickpeas</strong> - Versatile legumes that can be used in various dishes</li>
        <li><strong>Hemp Seeds</strong> - Contains omega-3 fatty acids along with high-quality protein</li>
      </ul>
      
      <h3>Animal-Based Proteins</h3>
      <p>For those who include animal products in their diet, consider these high-quality options:</p>
      <ul>
        <li><strong>Wild-caught Fish</strong> - Rich in protein and omega-3 fatty acids</li>
        <li><strong>Free-range Eggs</strong> - Complete protein with excellent bioavailability</li>
        <li><strong>Grass-fed Dairy</strong> - High-quality protein with beneficial nutrients</li>
      </ul>
      
      <h2>How Much Protein Do You Need?</h2>
      <p>The recommended daily allowance (RDA) for protein is 0.8 grams per kilogram of body weight for sedentary adults. However, this amount may increase based on your activity level, age, and health goals.</p>
      
      <h3>Factors Affecting Protein Needs</h3>
      <ul>
        <li>Physical activity level</li>
        <li>Age and life stage</li>
        <li>Health conditions</li>
        <li>Pregnancy or breastfeeding</li>
        <li>Recovery from illness or injury</li>
      </ul>
      
      <h2>Tishya Foods' Approach to Protein</h2>
      <p>At Tishya Foods, we believe in providing protein-rich foods that are:</p>
      <ul>
        <li><strong>Triple-washed</strong> for maximum cleanliness</li>
        <li><strong>Air-dried</strong> to preserve nutritional value</li>
        <li><strong>Hand-roasted</strong> for optimal flavor</li>
        <li><strong>Finely milled</strong> for easy digestion and absorption</li>
      </ul>
      
      <p>Our commitment to quality ensures that you're getting the most nutritious and delicious protein-rich foods available.</p>
      
      <h2>Conclusion</h2>
      <p>Incorporating high-quality protein into your diet is essential for optimal health. Whether you choose plant-based or animal-based sources, focus on whole, minimally processed foods that provide complete amino acid profiles.</p>
      
      <p>Visit our product catalog to explore our range of protein-rich foods that can help you meet your nutritional goals while enjoying delicious, natural flavors.</p>
    `,
    featuredImage: '/images/blog/protein-guide.jpg',
    status: 'published' as const,
    publishedAt: '2024-01-15T10:00:00Z',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    author: {
      id: '1',
      name: 'Dr. Sarah Nutrition',
      email: 'sarah@tishyafoods.com',
      avatar: '/images/authors/sarah.jpg',
      bio: 'Nutritionist and wellness expert with over 10 years of experience in plant-based nutrition.'
    },
    categories: [
      { id: '1', name: 'Nutrition', slug: 'nutrition', description: 'All about nutrition and healthy eating' },
      { id: '2', name: 'Health', slug: 'health', description: 'Health tips and wellness advice' }
    ],
    tags: [
      { id: '1', name: 'protein', slug: 'protein', description: 'Posts about protein and amino acids' },
      { id: '2', name: 'healthy-eating', slug: 'healthy-eating', description: 'Healthy eating tips and advice' },
      { id: '3', name: 'plant-based', slug: 'plant-based', description: 'Plant-based nutrition and recipes' }
    ],
    seo: {
      metaTitle: 'The Complete Guide to Protein-Rich Foods | Tishya Foods',
      metaDescription: 'Learn about the best protein-rich foods for optimal health. Discover plant-based and animal-based protein sources, daily requirements, and quality factors.',
      focusKeyword: 'protein-rich foods'
    },
    readingTime: 8,
    viewCount: 1247,
    likeCount: 89,
    commentCount: 23,
    featured: true,
    sticky: false
  }

  if (slug !== 'complete-guide-protein-rich-foods') {
    return null
  }

  return mockPost
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    return {
      title: 'Post Not Found - Tishya Foods Blog'
    }
  }

  return {
    title: post.seo.metaTitle || post.title,
    description: post.seo.metaDescription || post.excerpt,
    keywords: [post.seo.focusKeyword, ...post.tags.map(tag => tag.name)].filter(Boolean).join(', '),
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      images: post.featuredImage ? [{ url: post.featuredImage }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.featuredImage ? [post.featuredImage] : [],
    }
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <BlogProvider>
      <BlogPost post={post} />
    </BlogProvider>
  )
}