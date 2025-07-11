import { Metadata } from 'next'
import { Shield, Eye, Database, Globe, Lock, User } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Privacy Policy | Tishya Foods',
  description: 'Learn how Tishya Foods protects your privacy and handles your personal data in compliance with GDPR and other privacy regulations.',
  keywords: ['privacy policy', 'data protection', 'GDPR', 'cookies', 'analytics', 'personal data']
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-8 w-8 text-orange-500" />
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge variant="outline" className="border-green-500 text-green-400">
              GDPR Compliant
            </Badge>
            <Badge variant="outline" className="border-blue-500 text-blue-400">
              Last Updated: {new Date().toLocaleDateString()}
            </Badge>
          </div>
        </div>

        {/* Quick Summary */}
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-gray-100 flex items-center gap-2">
              <Eye className="h-5 w-5 text-orange-500" />
              Quick Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-200">What We Collect</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Basic usage analytics</li>
                  <li>• Shopping cart data</li>
                  <li>• Contact information (when provided)</li>
                  <li>• Cookie preferences</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-200">Your Rights</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Access your data</li>
                  <li>• Delete your data</li>
                  <li>• Control cookie preferences</li>
                  <li>• Opt out of analytics</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Collection */}
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-gray-100 flex items-center gap-2">
              <Database className="h-5 w-5 text-orange-500" />
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-200 mb-3">Analytics & Usage Data</h4>
              <div className="bg-gray-700 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-orange-500/20 p-1 rounded">
                    <Globe className="h-4 w-4 text-orange-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-200">Website Analytics</p>
                    <p className="text-sm text-gray-400">
                      We use Google Analytics 4 to understand how visitors use our website. This includes page views, 
                      session duration, and user interactions. All data is anonymized and aggregated.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-orange-500/20 p-1 rounded">
                    <User className="h-4 w-4 text-orange-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-200">E-commerce Tracking</p>
                    <p className="text-sm text-gray-400">
                      We track product views, cart additions, and purchases to improve our product offerings 
                      and user experience. This data helps us understand customer preferences.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-200 mb-3">Personal Information</h4>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-400">
                  We only collect personal information that you voluntarily provide when:
                </p>
                <ul className="mt-2 text-sm text-gray-400 space-y-1">
                  <li>• Making a purchase (name, email, shipping address)</li>
                  <li>• Subscribing to our newsletter</li>
                  <li>• Contacting customer support</li>
                  <li>• Creating an account</li>
                </ul>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-200 mb-3">Technical Data</h4>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-400">
                  We automatically collect certain technical information:
                </p>
                <ul className="mt-2 text-sm text-gray-400 space-y-1">
                  <li>• IP address (anonymized)</li>
                  <li>• Browser type and version</li>
                  <li>• Device information</li>
                  <li>• Referrer URL</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cookies */}
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-gray-100 flex items-center gap-2">
              <Lock className="h-5 w-5 text-orange-500" />
              Cookie Usage
            </CardTitle>
            <CardDescription className="text-gray-400">
              We use cookies to enhance your experience and analyze site usage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-200 mb-3">Essential Cookies</h4>
                <div className="bg-gray-700 rounded-lg p-3">
                  <p className="text-sm text-gray-400 mb-2">
                    Required for the website to function properly:
                  </p>
                  <ul className="text-xs text-gray-400 space-y-1">
                    <li>• Session management</li>
                    <li>• Shopping cart functionality</li>
                    <li>• Security tokens</li>
                    <li>• Cookie preferences</li>
                  </ul>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-200 mb-3">Analytics Cookies</h4>
                <div className="bg-gray-700 rounded-lg p-3">
                  <p className="text-sm text-gray-400 mb-2">
                    Help us understand website usage:
                  </p>
                  <ul className="text-xs text-gray-400 space-y-1">
                    <li>• Google Analytics (_ga, _gid)</li>
                    <li>• Page view tracking</li>
                    <li>• User behavior analysis</li>
                    <li>• Performance monitoring</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
              <h4 className="font-semibold text-blue-400 mb-2">Managing Cookies</h4>
              <p className="text-sm text-gray-400">
                You can control your cookie preferences using our cookie banner or by adjusting your browser settings. 
                Note that disabling essential cookies may affect website functionality.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data Processing */}
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-gray-100">How We Use Your Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-green-500/20 p-1 rounded mt-1">
                  <span className="text-green-400 text-sm">✓</span>
                </div>
                <div>
                  <p className="font-medium text-gray-200">Improve User Experience</p>
                  <p className="text-sm text-gray-400">
                    Analyze usage patterns to enhance website functionality and content
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-green-500/20 p-1 rounded mt-1">
                  <span className="text-green-400 text-sm">✓</span>
                </div>
                <div>
                  <p className="font-medium text-gray-200">Process Orders</p>
                  <p className="text-sm text-gray-400">
                    Fulfill purchases, send order confirmations, and provide customer support
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-green-500/20 p-1 rounded mt-1">
                  <span className="text-green-400 text-sm">✓</span>
                </div>
                <div>
                  <p className="font-medium text-gray-200">Security & Fraud Prevention</p>
                  <p className="text-sm text-gray-400">
                    Protect against malicious activity and ensure secure transactions
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-gray-100">Your Data Rights</CardTitle>
            <CardDescription className="text-gray-400">
              Under GDPR and other privacy laws, you have the following rights
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="bg-gray-700 rounded-lg p-3">
                  <h4 className="font-semibold text-gray-200 mb-2">Access & Portability</h4>
                  <p className="text-sm text-gray-400">
                    Request a copy of your personal data and information about how it&apos;s processed
                  </p>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-3">
                  <h4 className="font-semibold text-gray-200 mb-2">Rectification</h4>
                  <p className="text-sm text-gray-400">
                    Correct inaccurate or incomplete personal information
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="bg-gray-700 rounded-lg p-3">
                  <h4 className="font-semibold text-gray-200 mb-2">Erasure</h4>
                  <p className="text-sm text-gray-400">
                    Request deletion of your personal data under certain circumstances
                  </p>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-3">
                  <h4 className="font-semibold text-gray-200 mb-2">Restriction</h4>
                  <p className="text-sm text-gray-400">
                    Limit how we process your personal data
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-orange-900/20 border border-orange-800 rounded-lg p-4">
              <h4 className="font-semibold text-orange-400 mb-2">How to Exercise Your Rights</h4>
              <p className="text-sm text-gray-400">
                Contact us at <a href="mailto:privacy@tishyafoods.com" className="text-orange-400 hover:text-orange-300">privacy@tishyafoods.com</a> to exercise any of these rights. 
                We&apos;ll respond within 30 days and may require identity verification.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-100">Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-400">
                If you have any questions about this privacy policy or your data rights, please contact us:
              </p>
              
              <div className="bg-gray-700 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-orange-400 font-medium">Email:</span>
                  <a href="mailto:privacy@tishyafoods.com" className="text-gray-300 hover:text-orange-400">
                    privacy@tishyafoods.com
                  </a>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-orange-400 font-medium">Data Protection Officer:</span>
                  <a href="mailto:dpo@tishyafoods.com" className="text-gray-300 hover:text-orange-400">
                    dpo@tishyafoods.com
                  </a>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-orange-400 font-medium">Response Time:</span>
                  <span className="text-gray-300">Within 30 days</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}