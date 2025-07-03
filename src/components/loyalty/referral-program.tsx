'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Share2, 
  Copy, 
  Facebook, 
  Twitter, 
  MessageCircle,
  Mail,
  Users,
  Gift,
  Coins,
  TrendingUp,
  CheckCircle,
  Clock,
  Award
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { formatPrice, cn } from '@/lib/utils'

interface ReferralStats {
  totalReferrals: number
  successfulReferrals: number
  pendingReferrals: number
  totalEarned: number
  currentMonthEarned: number
  referralRate: number
}

interface Referral {
  id: string
  friendName: string
  friendEmail: string
  status: 'pending' | 'registered' | 'first_order' | 'completed'
  dateReferred: Date
  dateCompleted?: Date
  bonusEarned: number
  friendBonus: number
}

interface ReferralTier {
  id: string
  name: string
  minReferrals: number
  bonusMultiplier: number
  specialRewards: string[]
  color: string
}

const referralTiers: ReferralTier[] = [
  {
    id: 'starter',
    name: 'Referral Starter',
    minReferrals: 0,
    bonusMultiplier: 1,
    specialRewards: ['50 bonus points per referral'],
    color: 'bg-blue-500'
  },
  {
    id: 'champion',
    name: 'Referral Champion',
    minReferrals: 5,
    bonusMultiplier: 1.2,
    specialRewards: ['60 bonus points per referral', 'Monthly surprise gift'],
    color: 'bg-purple-500'
  },
  {
    id: 'legend',
    name: 'Referral Legend',
    minReferrals: 15,
    bonusMultiplier: 1.5,
    specialRewards: ['75 bonus points per referral', 'VIP customer status', 'Exclusive events'],
    color: 'bg-gold'
  }
]

const mockStats: ReferralStats = {
  totalReferrals: 12,
  successfulReferrals: 8,
  pendingReferrals: 2,
  totalEarned: 2400,
  currentMonthEarned: 600,
  referralRate: 66.7
}

const mockReferrals: Referral[] = [
  {
    id: 'ref_001',
    friendName: 'Priya Sharma',
    friendEmail: 'priya@example.com',
    status: 'completed',
    dateReferred: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    dateCompleted: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    bonusEarned: 300,
    friendBonus: 200
  },
  {
    id: 'ref_002',
    friendName: 'Rajesh Kumar',
    friendEmail: 'rajesh@example.com',
    status: 'first_order',
    dateReferred: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    bonusEarned: 150,
    friendBonus: 200
  },
  {
    id: 'ref_003',
    friendName: 'Anita Desai',
    friendEmail: 'anita@example.com',
    status: 'pending',
    dateReferred: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    bonusEarned: 0,
    friendBonus: 0
  }
]

interface ReferralProgramProps {
  referralCode?: string
  stats?: ReferralStats
}

export function ReferralProgram({ 
  referralCode = 'TISHYA-HEALTH-2024',
  stats = mockStats 
}: ReferralProgramProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'invite' | 'track'>('overview')
  const [friendEmails, setFriendEmails] = useState('')
  const [customMessage, setCustomMessage] = useState('Hi! I\'ve been loving Tishya Foods\' natural protein products. They\'re offering you ₹200 off your first order! Check them out.')
  const [copied, setCopied] = useState(false)

  const currentTier = referralTiers.find(tier => 
    stats.successfulReferrals >= tier.minReferrals
  ) || referralTiers[0]

  const nextTier = referralTiers.find(tier => 
    tier.minReferrals > stats.successfulReferrals
  )

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareUrl = `https://tishyafoods.com?ref=${referralCode}`

  const shareToSocial = (platform: string) => {
    const message = `Check out Tishya Foods for amazing natural protein products! Use my code ${referralCode} for ₹200 off your first order.`
    
    let url = ''
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        break
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(shareUrl)}`
        break
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(message + ' ' + shareUrl)}`
        break
      case 'email':
        url = `mailto:?subject=${encodeURIComponent('Try Tishya Foods!')}&body=${encodeURIComponent(message + '\n\n' + shareUrl)}`
        break
    }
    
    if (url) {
      window.open(url, '_blank')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'first_order':
        return <Gift className="h-4 w-4 text-blue-500" />
      case 'registered':
        return <Users className="h-4 w-4 text-yellow-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-gray-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'first_order':
        return 'bg-blue-100 text-blue-800'
      case 'registered':
        return 'bg-yellow-100 text-yellow-800'
      case 'pending':
        return 'bg-gray-100 text-gray-100'
      default:
        return 'bg-gray-100 text-gray-100'
    }
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: TrendingUp },
    { id: 'invite', name: 'Invite Friends', icon: Share2 },
    { id: 'track', name: 'Track Referrals', icon: Users }
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.h1 
          className="text-3xl font-bold text-brown-800 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Refer Friends, Earn Rewards
        </motion.h1>
        <motion.p 
          className="text-brown-600 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Share the goodness of natural nutrition with your friends and family. 
          Earn points for every successful referral while helping others discover healthy eating.
        </motion.p>
      </div>

      {/* Stats Overview */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="p-6 text-center">
          <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-brown-800">{stats.totalReferrals}</div>
          <div className="text-sm text-brown-600">Total Referrals</div>
        </Card>
        
        <Card className="p-6 text-center">
          <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-brown-800">{stats.successfulReferrals}</div>
          <div className="text-sm text-brown-600">Successful</div>
        </Card>
        
        <Card className="p-6 text-center">
          <Coins className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-brown-800">{stats.totalEarned}</div>
          <div className="text-sm text-brown-600">Points Earned</div>
        </Card>
        
        <Card className="p-6 text-center">
          <TrendingUp className="h-8 w-8 text-purple-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-brown-800">{stats.referralRate}%</div>
          <div className="text-sm text-brown-600">Success Rate</div>
        </Card>
      </motion.div>

      {/* Current Tier Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={cn('p-3 rounded-full text-white', currentTier.color)}>
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-brown-800">{currentTier.name}</h3>
                <p className="text-brown-600">
                  {currentTier.bonusMultiplier}x bonus multiplier
                </p>
              </div>
            </div>
            {nextTier && (
              <div className="text-right">
                <p className="text-sm text-brown-600">
                  {nextTier.minReferrals - stats.successfulReferrals} more referrals to {nextTier.name}
                </p>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentTier.specialRewards.map((reward, index) => (
              <div key={index} className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-brown-700">{reward}</span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-600">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                  activeTab === tab.id
                    ? 'border-brown-800 text-brown-800'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-600'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* How It Works */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-brown-800 mb-4">How It Works</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-brown-800 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <h4 className="font-medium text-brown-800">Share Your Code</h4>
                  <p className="text-sm text-brown-600">Send your unique referral code to friends and family</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-brown-800 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <h4 className="font-medium text-brown-800">They Save Money</h4>
                  <p className="text-sm text-brown-600">Your friends get ₹200 off their first order</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-brown-800 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <h4 className="font-medium text-brown-800">You Earn Points</h4>
                  <p className="text-sm text-brown-600">Get 300 points when they complete their first order</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Referral Code */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-brown-800 mb-4">Your Referral Code</h3>
            <div className="flex items-center space-x-2 mb-4">
              <Input value={referralCode} readOnly className="font-mono" />
              <Button onClick={copyReferralCode} variant="outline">
                {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                onClick={() => shareToSocial('whatsapp')}
                className="flex items-center space-x-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => shareToSocial('email')}
                className="flex items-center space-x-2"
              >
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => shareToSocial('facebook')}
                className="flex items-center space-x-2"
              >
                <Facebook className="h-4 w-4" />
                <span>Facebook</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => shareToSocial('twitter')}
                className="flex items-center space-x-2"
              >
                <Twitter className="h-4 w-4" />
                <span>Twitter</span>
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {activeTab === 'invite' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-brown-800 mb-4">Invite Friends via Email</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brown-800 mb-2">
                  Friend's Email Addresses
                </label>
                <Textarea
                  value={friendEmails}
                  onChange={(e) => setFriendEmails(e.target.value)}
                  placeholder="Enter email addresses separated by commas..."
                  rows={3}
                />
                <p className="text-xs text-brown-600 mt-1">
                  Separate multiple emails with commas
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-brown-800 mb-2">
                  Personal Message
                </label>
                <Textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={4}
                />
              </div>
              
              <Button className="w-full bg-brown-800 hover:bg-brown-900">
                <Mail className="h-4 w-4 mr-2" />
                Send Invitations
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {activeTab === 'track' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-brown-800 mb-6">Your Referrals</h3>
            
            <div className="space-y-4">
              {mockReferrals.map((referral) => (
                <div key={referral.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(referral.status)}
                    <div>
                      <p className="font-medium text-brown-800">{referral.friendName}</p>
                      <p className="text-sm text-brown-600">{referral.friendEmail}</p>
                      <p className="text-xs text-brown-500">
                        Referred {referral.dateReferred.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge className={getStatusColor(referral.status)}>
                      {referral.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    {referral.bonusEarned > 0 && (
                      <p className="text-sm font-semibold text-green-600 mt-1">
                        +{referral.bonusEarned} points
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}