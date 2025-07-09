'use client'

import { Shield, Award, Users, CheckCircle, Truck, RotateCcw, Lock, CreditCard, Star, Verified, Clock, Heart } from 'lucide-react'

export function TrustSignals() {
  return (
    <div className="bg-gray-900 py-8" data-testid="trust-signals">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Trust Signals */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center text-center mb-8">
          
          {/* Security Badge */}
          <div className="flex flex-col items-center space-y-2" data-testid="security-badge">
            <Shield className="w-8 h-8 text-green-400" />
            <div className="text-xs text-gray-300">
              <div className="font-semibold text-gray-100">SSL Secured</div>
              <div>256-bit encryption</div>
            </div>
          </div>

          {/* Quality Certification */}
          <div className="flex flex-col items-center space-y-2" data-testid="certification">
            <Award className="w-8 h-8 text-green-400" />
            <div className="text-xs text-gray-300">
              <div className="font-semibold text-gray-100">Quality Certified</div>
              <div>ISO 22000 Standard</div>
            </div>
          </div>

          {/* Customer Count */}
          <div className="flex flex-col items-center space-y-2" data-testid="customer-count">
            <Users className="w-8 h-8 text-green-400" />
            <div className="text-xs text-gray-300">
              <div className="font-semibold text-gray-100">10,000+</div>
              <div>Happy Customers</div>
            </div>
          </div>

          {/* Satisfaction Guarantee */}
          <div className="flex flex-col items-center space-y-2" data-testid="guarantee">
            <CheckCircle className="w-8 h-8 text-green-400" />
            <div className="text-xs text-gray-300">
              <div className="font-semibold text-gray-100">100% Natural</div>
              <div>Guarantee</div>
            </div>
          </div>

          {/* Free Shipping */}
          <div className="flex flex-col items-center space-y-2" data-testid="shipping">
            <Truck className="w-8 h-8 text-green-400" />
            <div className="text-xs text-gray-300">
              <div className="font-semibold text-gray-100">Free Shipping</div>
              <div>Orders over ₹500</div>
            </div>
          </div>

          {/* Return Policy */}
          <div className="flex flex-col items-center space-y-2" data-testid="return-policy">
            <RotateCcw className="w-8 h-8 text-green-400" />
            <div className="text-xs text-gray-300">
              <div className="font-semibold text-gray-100">30-Day Return</div>
              <div>Money Back</div>
            </div>
          </div>

        </div>

        {/* Additional Security & Trust Badges */}
        <div className="border-t border-gray-700 pt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-center text-center">
            
            {/* Payment Security */}
            <div className="flex flex-col items-center space-y-2" data-testid="payment-security">
              <Lock className="w-6 h-6 text-blue-400" />
              <div className="text-xs text-gray-400">
                <div className="font-medium text-gray-200">PCI Compliant</div>
                <div>Secure Payments</div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="flex flex-col items-center space-y-2" data-testid="payment-methods">
              <CreditCard className="w-6 h-6 text-blue-400" />
              <div className="text-xs text-gray-400">
                <div className="font-medium text-gray-200">All Cards</div>
                <div>UPI & Wallets</div>
              </div>
            </div>

            {/* Verified Reviews */}
            <div className="flex flex-col items-center space-y-2" data-testid="verified-reviews">
              <Verified className="w-6 h-6 text-blue-400" />
              <div className="text-xs text-gray-400">
                <div className="font-medium text-gray-200">Verified Reviews</div>
                <div>Real Customers</div>
              </div>
            </div>

            {/* Fast Delivery */}
            <div className="flex flex-col items-center space-y-2" data-testid="fast-delivery">
              <Clock className="w-6 h-6 text-blue-400" />
              <div className="text-xs text-gray-400">
                <div className="font-medium text-gray-200">Fast Delivery</div>
                <div>2-3 Days</div>
              </div>
            </div>

            {/* Customer Rating */}
            <div className="flex flex-col items-center space-y-2" data-testid="customer-rating">
              <Star className="w-6 h-6 text-yellow-400" />
              <div className="text-xs text-gray-400">
                <div className="font-medium text-gray-200">4.9/5 Rating</div>
                <div>2500+ Reviews</div>
              </div>
            </div>

            {/* Loved by Customers */}
            <div className="flex flex-col items-center space-y-2" data-testid="customer-love">
              <Heart className="w-6 h-6 text-red-400" />
              <div className="text-xs text-gray-400">
                <div className="font-medium text-gray-200">Loved by</div>
                <div>Families</div>
              </div>
            </div>

          </div>
        </div>

        {/* Industry Certifications */}
        <div className="border-t border-gray-700 mt-6 pt-6">
          <div className="text-center">
            <h3 className="text-sm font-semibold text-gray-200 mb-4">Certified & Trusted</h3>
            <div className="flex flex-wrap justify-center items-center gap-6 text-xs text-gray-400">
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-green-400" />
                <span>FSSAI Licensed</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span>ISO 22000:2018</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>HACCP Certified</span>
              </div>
              <div className="flex items-center space-x-2">
                <Verified className="w-4 h-4 text-blue-400" />
                <span>Google Trusted Store</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-blue-400" />
                <span>SSL Certificate</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function GuaranteeSection() {
  return (
    <div className="bg-green-900/10 border border-green-500/20 rounded-lg p-6 my-8" data-testid="guarantee-section">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-100 mb-2">
          🌿 100% Natural Guarantee
        </h3>
        <p className="text-gray-300 mb-4">
          We stand behind the quality of our products. If you&apos;re not completely satisfied 
          with your purchase, return it within 30 days for a full refund - no questions asked.
        </p>
        <div className="flex justify-center items-center space-x-6 text-sm text-gray-400">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>30-day money back guarantee</span>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-green-400" />
            <span>100% natural ingredients</span>
          </div>
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-green-400" />
            <span>Quality certified</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Customer testimonials component
export function CustomerTestimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      location: "Mumbai",
      text: "The protein snacks are amazing! My kids love them and I feel good knowing they're eating something healthy.",
      rating: 5,
      image: "/testimonials/priya.jpg"
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      location: "Delhi",
      text: "Great taste and perfect for my fitness routine. The quality is consistently excellent.",
      rating: 5,
      image: "/testimonials/rajesh.jpg"
    },
    {
      id: 3,
      name: "Anita Patel",
      location: "Bangalore",
      text: "Love the natural ingredients and traditional preparation methods. Authentic taste every time!",
      rating: 5,
      image: "/testimonials/anita.jpg"
    }
  ]

  return (
    <div className="py-12 bg-gray-900" data-testid="testimonials">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-100 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Tishya Foods for their daily nutrition needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700"
              data-testid="testimonial"
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
              <p className="text-gray-300 mb-4 italic">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-semibold text-sm">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-100">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <div className="text-gray-400 text-sm">
            ⭐ 4.9/5 average rating from 2,500+ reviews
          </div>
        </div>
      </div>
    </div>
  )
}

// Social proof numbers component
export function SocialProofNumbers() {
  return (
    <div className="bg-gray-800 py-8" data-testid="social-proof">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-green-400 mb-2">10,000+</div>
            <div className="text-gray-300 text-sm">Happy Customers</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-400 mb-2">50,000+</div>
            <div className="text-gray-300 text-sm">Products Sold</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-400 mb-2">5</div>
            <div className="text-gray-300 text-sm">Years of Excellence</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-400 mb-2">98%</div>
            <div className="text-gray-300 text-sm">Customer Satisfaction</div>
          </div>
        </div>
      </div>
    </div>
  )
}