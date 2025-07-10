import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const product = await db.product.findUnique({
      where: { id },
      include: {
        category: true,
        reviews: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Calculate average rating
    const averageRating = product.reviews.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
      : 0

    const productWithRating = {
      ...product,
      averageRating,
      reviewCount: product.reviews.length
    }

    return NextResponse.json(productWithRating)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()

    const {
      name,
      description,
      price,
      categoryId,
      images,
      ingredients,
      isGlutenFree,
      isVegan,
      isOrganic,
      stock,
      featured,
      protein,
      carbs,
      fat,
      fiber,
      calories,
      servingSize
    } = data

    const updateData: any = {}

    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (price !== undefined) updateData.price = Math.round(price * 100)
    if (categoryId !== undefined) updateData.categoryId = categoryId
    if (images !== undefined) updateData.images = images
    if (ingredients !== undefined) updateData.ingredients = ingredients
    if (isGlutenFree !== undefined) updateData.isGlutenFree = isGlutenFree
    if (isVegan !== undefined) updateData.isVegan = isVegan
    if (isOrganic !== undefined) updateData.isOrganic = isOrganic
    if (stock !== undefined) updateData.stock = stock
    if (featured !== undefined) updateData.featured = featured
    if (protein !== undefined) updateData.protein = protein
    if (carbs !== undefined) updateData.carbs = carbs
    if (fat !== undefined) updateData.fat = fat
    if (fiber !== undefined) updateData.fiber = fiber
    if (calories !== undefined) updateData.calories = calories
    if (servingSize !== undefined) updateData.servingSize = servingSize

    const product = await db.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        reviews: true
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await db.product.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}