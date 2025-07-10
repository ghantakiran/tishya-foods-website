import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { stripe, formatAmountForStripe } from '@/lib/stripe'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    const [orders, total] = await Promise.all([
      db.order.findMany({
        where: { userId },
        include: {
          items: {
            include: {
              product: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      db.order.count({ where: { userId } })
    ])

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const {
      userId,
      items,
      shippingAddress,
      contactEmail,
      contactPhone,
      paymentMethod = 'card'
    } = data

    if (!userId || !items || items.length === 0 || !shippingAddress || !contactEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, items, shippingAddress, contactEmail' },
        { status: 400 }
      )
    }

    // Calculate total amount
    let totalAmount = 0
    const orderItems = []

    for (const item of items) {
      const product = await db.product.findUnique({
        where: { id: item.productId }
      })

      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 404 }
        )
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for product: ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}` },
          { status: 400 }
        )
      }

      const itemTotal = product.price * item.quantity
      totalAmount += itemTotal

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price
      })
    }

    // Create order in database
    const order = await db.order.create({
      data: {
        userId,
        totalAmount,
        shippingAddress,
        contactEmail,
        contactPhone,
        status: 'PENDING',
        items: {
          create: orderItems
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    // Create payment intent for card payments
    let paymentIntent = null
    if (paymentMethod === 'card') {
      try {
        paymentIntent = await stripe.paymentIntents.create({
          amount: totalAmount, // Amount is already in cents from database
          currency: 'usd',
          automatic_payment_methods: {
            enabled: true,
          },
          metadata: {
            orderId: order.id,
            userId,
            contactEmail
          },
        })
      } catch (stripeError) {
        console.error('Stripe payment intent creation failed:', stripeError)
        
        // Delete the order if payment intent creation fails
        await db.order.delete({
          where: { id: order.id }
        })
        
        return NextResponse.json(
          { error: 'Failed to create payment intent' },
          { status: 500 }
        )
      }
    }

    // For COD orders, mark as confirmed immediately
    if (paymentMethod === 'cod') {
      await db.order.update({
        where: { id: order.id },
        data: { status: 'CONFIRMED' }
      })
    }

    return NextResponse.json({
      order,
      paymentIntent: paymentIntent ? {
        clientSecret: paymentIntent.client_secret,
        id: paymentIntent.id
      } : null
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}