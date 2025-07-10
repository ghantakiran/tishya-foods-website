import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'
import { headers } from 'next/headers'
import Stripe from 'stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set')
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    )
  }

  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      console.error('No stripe-signature header found')
      return NextResponse.json(
        { error: 'No signature found' },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    console.log('Received webhook event:', event.type)

    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent)
        break
      
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object as Stripe.PaymentIntent)
        break
      
      case 'payment_intent.canceled':
        await handlePaymentCanceled(event.data.object as Stripe.PaymentIntent)
        break
      
      case 'charge.dispute.created':
        await handleChargeDispute(event.data.object as Stripe.Dispute)
        break
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment succeeded:', paymentIntent.id)
  
  try {
    const orderId = paymentIntent.metadata.orderId
    
    if (orderId) {
      // Update order status to confirmed
      await db.order.update({
        where: { id: orderId },
        data: { 
          status: 'CONFIRMED',
          updatedAt: new Date()
        }
      })

      // Update product inventory (reduce stock)
      const order = await db.order.findUnique({
        where: { id: orderId },
        include: { items: true }
      })

      if (order) {
        for (const item of order.items) {
          await db.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity
              }
            }
          })
        }
      }

      console.log(`Order ${orderId} confirmed and inventory updated`)
    }
  } catch (error) {
    console.error('Error updating order after payment success:', error)
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment failed:', paymentIntent.id)
  
  try {
    const orderId = paymentIntent.metadata.orderId
    
    if (orderId) {
      await db.order.update({
        where: { id: orderId },
        data: { 
          status: 'CANCELLED',
          updatedAt: new Date()
        }
      })
      
      console.log(`Order ${orderId} cancelled due to payment failure`)
    }
  } catch (error) {
    console.error('Error updating order after payment failure:', error)
  }
}

async function handlePaymentCanceled(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment canceled:', paymentIntent.id)
  
  try {
    const orderId = paymentIntent.metadata.orderId
    
    if (orderId) {
      await db.order.update({
        where: { id: orderId },
        data: { 
          status: 'CANCELLED',
          updatedAt: new Date()
        }
      })
      
      console.log(`Order ${orderId} cancelled`)
    }
  } catch (error) {
    console.error('Error updating order after payment cancellation:', error)
  }
}

async function handleChargeDispute(dispute: Stripe.Dispute) {
  console.log('Charge dispute created:', dispute.id)
  
  // Handle dispute - notify admin, update order status, etc.
  try {
    const chargeId = dispute.charge as string
    console.log(`Dispute for charge ${chargeId}: ${dispute.reason}`)
    
    // You could implement additional logic here like:
    // - Send email notification to admin
    // - Update order status
    // - Log dispute for review
  } catch (error) {
    console.error('Error handling charge dispute:', error)
  }
}