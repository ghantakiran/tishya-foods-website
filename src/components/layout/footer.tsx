import Link from 'next/link'
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react'
import { GuaranteeSection } from '@/components/trust/trust-signals'
import { AccessibleImage } from '@/components/accessibility/accessible-image'
import { Landmark } from '@/components/accessibility/landmark'

const footerSections = [
  {
    title: 'Products',
    links: [
      { name: 'Sweet Protein Treats', href: '/products/sweet-treats' },
      { name: 'Protein Rich Natural Foods', href: '/products/natural-foods' },
      { name: 'Savory Protein Treats', href: '/products/savory-treats' },
      { name: 'All Products', href: '/products' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Process', href: '/process' },
      { name: 'Quality Promise', href: '/quality' },
      { name: 'Careers', href: '/careers' },
    ],
  },
  {
    title: 'Support',
    links: [
      { name: 'Contact Us', href: '/contact' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Shipping Info', href: '/shipping' },
      { name: 'Returns', href: '/returns' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { name: 'Recipes', href: '/recipes' },
      { name: 'Nutrition Guide', href: '/nutrition' },
      { name: 'Blog', href: '/blog' },
      { name: 'Press', href: '/press' },
    ],
  },
]

export default function Footer() {
  return (
    <Landmark role="contentinfo">
      <footer id="footer" className="bg-gray-800 text-gray-100">
      {/* Guarantee Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <GuaranteeSection />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-4">
              <div className="relative w-12 h-12">
                <AccessibleImage
                  src="/logo.png"
                  alt="Tishya Foods Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-gray-100 font-bold text-lg font-montserrat">
                  Tishya Foods
                </span>
                <span className="text-green-400 text-xs -mt-1">
                  Health At Home!
                </span>
              </div>
            </Link>
            <p className="text-gray-100 mb-6 max-w-sm">
              Where nature&apos;s goodness is lovingly crafted into the purest and most 
              wholesome protein-rich foods. Triple-washed, air-dried, hand-roasted, 
              and finely milled with care.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://instagram.com/tishyafoods" 
                className="text-gray-200 hover:text-green-400 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded-md p-1" 
                data-testid="social-link" 
                aria-label="Follow us on Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://facebook.com/tishyafoods" 
                className="text-gray-200 hover:text-green-400 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded-md p-1" 
                data-testid="social-link" 
                aria-label="Follow us on Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com/tishyafoods" 
                className="text-gray-200 hover:text-green-400 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded-md p-1" 
                data-testid="social-link" 
                aria-label="Follow us on Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <nav key={section.title} aria-labelledby={`footer-${section.title.toLowerCase()}`}>
              <h3 id={`footer-${section.title.toLowerCase()}`} className="text-gray-50 font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-200 hover:text-green-400 transition-colors text-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded-md"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-600 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-green-400" aria-hidden="true" />
              <a 
                href="mailto:info@tishyafoods.com" 
                className="text-gray-200 hover:text-green-400 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded-md"
              >
                info@tishyafoods.com
              </a>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-green-400" aria-hidden="true" />
              <a 
                href="tel:+911234567890" 
                className="text-gray-200 hover:text-green-400 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded-md"
              >
                +91 12345 67890
              </a>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-green-400" aria-hidden="true" />
              <span className="text-gray-200">India</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-600 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">
            © {new Date().getFullYear()} Tishya Foods. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-300 hover:text-green-400 text-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded-md">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-300 hover:text-green-400 text-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded-md">
              Terms of Service
            </Link>
            <Link href="/sitemap" className="text-gray-300 hover:text-green-400 text-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded-md">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
    </Landmark>
  )
}