import { db } from './db'
import { products } from './products-data'
import bcrypt from 'bcryptjs'

export async function seedDatabase() {
  try {
    console.log('Starting database seeding...')

    // Create product categories
    const categories = [
      {
        name: 'Protein Powders',
        slug: 'protein-powders',
        description: 'High-quality protein powders for muscle building and recovery',
        image: '/categories/protein-powders.jpg'
      },
      {
        name: 'Natural Foods',
        slug: 'natural-foods',
        description: 'Wholesome natural foods rich in protein',
        image: '/categories/natural-foods.jpg'
      },
      {
        name: 'Supplements',
        slug: 'supplements',
        description: 'Nutritional supplements for optimal health',
        image: '/categories/supplements.jpg'
      },
      {
        name: 'Healthy Snacks',
        slug: 'healthy-snacks',
        description: 'Nutritious snacks for on-the-go energy',
        image: '/categories/healthy-snacks.jpg'
      }
    ]

    // Clear existing data
    await db.orderItem.deleteMany()
    await db.order.deleteMany()
    await db.cartItem.deleteMany()
    await db.cart.deleteMany()
    await db.review.deleteMany()
    await db.product.deleteMany()
    await db.productCategory.deleteMany()
    await db.user.deleteMany()

    console.log('Cleared existing data')

    // Create categories
    const createdCategories = await Promise.all(
      categories.map(category =>
        db.productCategory.create({
          data: category
        })
      )
    )

    console.log(`Created ${createdCategories.length} categories`)

    // Create a default category mapping
    const categoryMap: Record<string, string> = {
      'protein-powders': createdCategories[0].id,
      'natural-foods': createdCategories[1].id,
      'supplements': createdCategories[2].id,
      'healthy-snacks': createdCategories[3].id
    }

    // Map product categories
    const getCategoryId = (productName: string): string => {
      const name = productName.toLowerCase()
      if (name.includes('protein') || name.includes('whey') || name.includes('isolate')) {
        return categoryMap['protein-powders']
      } else if (name.includes('millet') || name.includes('quinoa') || name.includes('natural')) {
        return categoryMap['natural-foods']
      } else if (name.includes('supplement') || name.includes('vitamin')) {
        return categoryMap['supplements']
      } else {
        return categoryMap['healthy-snacks']
      }
    }

    // Create products from existing data
    const createdProducts = await Promise.all(
      products.map(product =>
        db.product.create({
          data: {
            name: product.name,
            description: product.description,
            price: Math.round(product.price * 100), // Convert to cents
            categoryId: getCategoryId(product.name),
            images: product.images,
            ingredients: product.ingredients,
            isGlutenFree: product.isGlutenFree,
            isVegan: product.isVegan,
            isOrganic: product.isOrganic,
            stock: Math.floor(Math.random() * 100) + 10, // Random stock between 10-110
            featured: product.featured,
            protein: (product as any).nutrition?.protein || 0,
            carbs: (product as any).nutrition?.carbs || 0,
            fat: (product as any).nutrition?.fat || 0,
            fiber: (product as any).nutrition?.fiber || 0,
            calories: (product as any).nutrition?.calories || 0,
            servingSize: (product as any).nutrition?.servingSize || '100g'
          }
        })
      )
    )

    console.log(`Created ${createdProducts.length} products`)

    // Create sample reviews
    const sampleReviews = [
      { customerName: 'Sarah Johnson', rating: 5, comment: 'Excellent quality and taste! Highly recommended.', verified: true },
      { customerName: 'Mike Chen', rating: 4, comment: 'Good product, fast shipping. Will order again.', verified: true },
      { customerName: 'Emily Davis', rating: 5, comment: 'Love the organic quality. Perfect for my fitness goals.', verified: true },
      { customerName: 'David Wilson', rating: 4, comment: 'Great value for money. Tastes amazing!', verified: false },
      { customerName: 'Lisa Anderson', rating: 5, comment: 'Best protein powder I have tried. Clean ingredients.', verified: true }
    ]

    // Add reviews to random products
    const reviewPromises = []
    for (const product of createdProducts) {
      const numReviews = Math.floor(Math.random() * 3) + 1 // 1-3 reviews per product
      for (let i = 0; i < numReviews; i++) {
        const randomReview = sampleReviews[Math.floor(Math.random() * sampleReviews.length)]
        reviewPromises.push(
          db.review.create({
            data: {
              ...randomReview,
              productId: product.id,
              helpful: Math.floor(Math.random() * 20)
            }
          })
        )
      }
    }

    await Promise.all(reviewPromises)
    console.log(`Created ${reviewPromises.length} reviews`)

    // Hash passwords for test users
    const testPassword = await bcrypt.hash('password123', 12)
    const adminPassword = await bcrypt.hash('admin123', 12)

    // Create a test user
    const testUser = await db.user.create({
      data: {
        email: 'test@tishyafoods.com',
        firstName: 'Test',
        lastName: 'User',
        phone: '+1234567890',
        password: testPassword,
        emailVerified: true,
        role: 'CUSTOMER'
      }
    })

    // Create cart for test user
    await db.cart.create({
      data: {
        userId: testUser.id
      }
    })

    console.log('Created test user and cart')

    // Create admin user
    const adminUser = await db.user.create({
      data: {
        email: 'admin@tishyafoods.com',
        firstName: 'Admin',
        lastName: 'User',
        phone: '+1234567891',
        password: adminPassword,
        emailVerified: true,
        role: 'ADMIN'
      }
    })

    await db.cart.create({
      data: {
        userId: adminUser.id
      }
    })

    console.log('Created admin user and cart')

    console.log('Database seeding completed successfully!')

    return {
      categories: createdCategories.length,
      products: createdProducts.length,
      reviews: reviewPromises.length,
      users: 2
    }
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  }
}

// Helper function to run seeding
export async function runSeed() {
  try {
    const result = await seedDatabase()
    console.log('Seeding results:', result)
    process.exit(0)
  } catch (error) {
    console.error('Seeding failed:', error)
    process.exit(1)
  }
}