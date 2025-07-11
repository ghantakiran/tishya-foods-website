import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Tishya Foods</h3>
                <p className="text-gray-400 text-sm">Health At Home!</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Premium natural foods, protein-rich products, and wholesome nutrition 
              for a healthier lifestyle. No artificial colors, dyes, or white sugars.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/products" className="hover:text-blue-400 transition-colors">Products</Link></li>
              <li><Link href="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-sm">
              <p>Email: info@tishyafoods.com</p>
              <p>Phone: +91 XXX XXX XXXX</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Tishya Foods. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}