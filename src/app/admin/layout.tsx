'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { 
  LayoutDashboard, 
  FileText, 
  Image, 
  Users, 
  Settings, 
  Menu,
  ChevronDown,
  Home,
  Package,
  MessageSquare,
  BarChart3,
  Shield,
  LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdminLayoutProps {
  children: React.ReactNode
}

interface NavItem {
  title: string
  href?: string
  icon: React.ComponentType<{ className?: string }>
  children?: NavItem[]
}

const navigation: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Content',
    icon: FileText,
    children: [
      { title: 'All Content', href: '/admin/content', icon: FileText },
      { title: 'Blog Posts', href: '/admin/content/blog-posts', icon: FileText },
      { title: 'Products', href: '/admin/content/products', icon: Package },
      { title: 'Recipes', href: '/admin/content/recipes', icon: FileText },
      { title: 'Content Types', href: '/admin/content-types', icon: FileText },
    ],
  },
  {
    title: 'Media',
    href: '/admin/media',
    icon: Image,
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Comments',
    href: '/admin/comments',
    icon: MessageSquare,
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
]

interface SidebarProps {
  className?: string
  onItemClick?: () => void
}

function Sidebar({ className, onItemClick }: SidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>(['Content'])

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const renderNavItem = (item: NavItem, level = 0) => {
    const isActive = item.href === pathname
    const isExpanded = expandedItems.includes(item.title)
    const hasChildren = item.children && item.children.length > 0

    return (
      <div key={item.title}>
        <div className="relative">
          {item.href ? (
            <Link
              href={item.href}
              onClick={onItemClick}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-800',
                level > 0 && 'ml-6',
                isActive && 'bg-gray-800 text-white'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ) : (
            <button
              onClick={() => toggleExpanded(item.title)}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-800',
                level > 0 && 'ml-6'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
              {hasChildren && (
                <ChevronDown 
                  className={cn(
                    'ml-auto h-4 w-4 transition-transform',
                    isExpanded && 'rotate-180'
                  )} 
                />
              )}
            </button>
          )}
        </div>
        
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children!.map(child => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn('flex h-full w-64 flex-col border-r border-gray-700 bg-gray-900', className)}>
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-gray-700 px-6">
        <Link href="/admin" className="flex items-center space-x-2">
          <Package className="h-6 w-6 text-green-500" />
          <span className="text-lg font-semibold text-white">Tishya CMS</span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-2">
          {navigation.map(item => renderNavItem(item))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-gray-700 p-4">
        <div className="space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-800"
          >
            <Home className="h-4 w-4" />
            View Site
          </Link>
          
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-800">
            <Shield className="h-4 w-4" />
            Admin Profile
          </button>
          
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-400 transition-all hover:bg-gray-800">
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Mobile Sidebar */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="fixed left-4 top-4 z-50 lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <Sidebar onItemClick={() => {}} />
            </SheetContent>
          </Sheet>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="h-16 border-b border-gray-700 bg-gray-900">
            <div className="flex h-full items-center justify-between px-6">
              <div className="flex items-center space-x-4">
                <div className="lg:hidden">
                  {/* Mobile menu button space - handled by Sheet above */}
                </div>
                <h1 className="text-xl font-semibold text-white">
                  Content Management System
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm">
                  <Shield className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}