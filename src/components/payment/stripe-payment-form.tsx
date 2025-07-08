'use client'

import React, { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
// import { useToast } from '@/hooks/use-toast'
import { Loader2, CreditCard, Shield, Lock } from 'lucide-react'
import { getStripePublishableKey } from '@/lib/stripe'

// Initialize Stripe
const stripePromise = loadStripe(getStripePublishableKey())

interface PaymentFormProps {
  amount: number
  currency: string
  onSuccess: (paymentIntent: any) => void
  onError: (error: string) => void
  metadata?: Record<string, string>
}

function PaymentForm({ amount, currency, onSuccess, onError, metadata }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  // const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  useEffect(() => {
    // Create payment intent when component mounts
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/payments/create-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount,
            currency,
            metadata,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to create payment intent')
        }

        setClientSecret(data.clientSecret)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to initialize payment'
        onError(errorMessage)
        console.log('Payment Error', errorMessage)
        // toast({
        //   title: 'Payment Error',
        //   description: errorMessage,
        //   variant: 'destructive',
        // })
      }
    }

    createPaymentIntent()
  }, [amount, currency, metadata, onError])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements || !clientSecret) {
      return
    }

    setLoading(true)

    const cardElement = elements.getElement(CardElement)

    if (!cardElement) {
      setLoading(false)
      return
    }

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: 'Customer', // In real app, get from form
          },
        },
      })

      if (error) {
        throw new Error(error.message || 'Payment failed')
      }

      if (paymentIntent?.status === 'succeeded') {
        onSuccess(paymentIntent)
        console.log('Payment Successful', 'Your payment has been processed successfully.')
        // toast({
        //   title: 'Payment Successful',
        //   description: 'Your payment has been processed successfully.',
        // })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed'
      onError(errorMessage)
      console.log('Payment Failed', errorMessage)
      // toast({
      //   title: 'Payment Failed',
      //   description: errorMessage,
      //   variant: 'destructive',
      // })
    } finally {
      setLoading(false)
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#f3f4f6',
        backgroundColor: '#1f2937',
        '::placeholder': {
          color: '#9ca3af',
        },
        iconColor: '#6b7280',
      },
      invalid: {
        color: '#ef4444',
        iconColor: '#ef4444',
      },
    },
    hidePostalCode: false,
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-5 h-5 text-blue-400" />
          <span className="text-gray-200 font-medium">Card Details</span>
        </div>
        
        <div className="bg-gray-700 border border-gray-600 rounded p-3">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Shield className="w-4 h-4" />
        <span>Your payment information is encrypted and secure</span>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Lock className="w-4 h-4" />
        <span>SSL secured checkout powered by Stripe</span>
      </div>

      <Button
        type="submit"
        disabled={!stripe || loading || !clientSecret}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        size="lg"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing Payment...
          </>
        ) : (
          `Pay ${new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
          }).format(amount)}`
        )}
      </Button>

      <div className="text-xs text-gray-500 text-center">
        By completing your purchase, you agree to our Terms of Service and Privacy Policy.
      </div>
    </form>
  )
}

export function StripePaymentForm(props: PaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  )
}