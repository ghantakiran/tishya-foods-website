'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  FileText,
  Clock
} from 'lucide-react'
import { Content, ContentStatus } from '@/types/cms'

// Mock data - will be replaced with real API calls
const mockContent: Content[] = [
  {
    id: '1',
    title: 'The Health Benefits of Organic Protein Bars',
    slug: 'health-benefits-organic-protein-bars',
    excerpt: 'Discover why organic protein bars are the perfect snack for health-conscious individuals...',
    content: {},
    status: 'PUBLISHED' as ContentStatus,
    publishedAt: new Date('2024-01-15'),
    contentTypeId: 'blog_post',
    contentType: {
      id: 'blog_post',
      name: 'blog_post',
      displayName: 'Blog Posts',
      description: 'Blog articles and posts',
      schema: { fields: [] },
      isSystem: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    authorId: 'user1',
    author: {
      id: 'user1',
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      emailVerified: true,
      role: 'AUTHOR' as any,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    categories: [],
    tags: [],
    versions: [],
    analytics: [],
    metaKeywords: [],
    images: [],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Sustainable Snacking: Our Environmental Commitment',
    slug: 'sustainable-snacking-environmental-commitment',
    excerpt: 'Learn about our dedication to sustainable practices and environmental responsibility...',
    content: {},
    status: 'DRAFT' as ContentStatus,
    contentTypeId: 'blog_post',
    contentType: {
      id: 'blog_post',
      name: 'blog_post',
      displayName: 'Blog Posts',
      description: 'Blog articles and posts',
      schema: { fields: [] },
      isSystem: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    authorId: 'user2',
    author: {
      id: 'user2',
      email: 'jane@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      emailVerified: true,
      role: 'EDITOR' as any,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    categories: [],
    tags: [],
    versions: [],
    analytics: [],
    metaKeywords: [],
    images: [],
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-14'),
  },
  {
    id: '3',
    title: 'Chocolate Protein Energy Bar',
    slug: 'chocolate-protein-energy-bar',
    excerpt: 'Rich, delicious chocolate protein bar packed with natural ingredients...',
    content: {},
    status: 'PUBLISHED' as ContentStatus,
    publishedAt: new Date('2024-01-08'),
    contentTypeId: 'product',
    contentType: {
      id: 'product',
      name: 'product',
      displayName: 'Products',
      description: 'E-commerce products',
      schema: { fields: [] },
      isSystem: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    authorId: 'user1',
    author: {
      id: 'user1',
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      emailVerified: true,
      role: 'AUTHOR' as any,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    categories: [],
    tags: [],
    versions: [],
    analytics: [],
    metaKeywords: [],
    images: [],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-08'),
  },
]

const statusColors = {
  DRAFT: 'bg-gray-500',
  PUBLISHED: 'bg-green-500',
  SCHEDULED: 'bg-blue-500',
  ARCHIVED: 'bg-yellow-500',
  TRASH: 'bg-red-500',
}

const statusLabels = {
  DRAFT: 'Draft',
  PUBLISHED: 'Published',
  SCHEDULED: 'Scheduled',
  ARCHIVED: 'Archived',
  TRASH: 'Trash',
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export default function ContentListPage() {
  const [content, setContent] = useState<Content[]>(mockContent)
  const [filteredContent, setFilteredContent] = useState<Content[]>(mockContent)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [loading, setLoading] = useState(false)

  // Filter content based on search and filters
  useEffect(() => {
    let filtered = content

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter)
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(item => item.contentType.name === typeFilter)
    }

    setFilteredContent(filtered)
  }, [content, searchTerm, statusFilter, typeFilter])

  const handleStatusChange = (contentId: string, newStatus: ContentStatus) => {
    setContent(prev => prev.map(item =>
      item.id === contentId ? { ...item, status: newStatus } : item
    ))
  }

  const handleDelete = (contentId: string) => {
    if (window.confirm('Are you sure you want to move this content to trash?')) {
      handleStatusChange(contentId, 'TRASH')
    }
  }

  // Get unique content types for filter
  const contentTypes = Array.from(new Set(content.map(item => item.contentType)))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Content</h1>
          <p className="text-gray-400">Manage all your content in one place</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Bulk Actions
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Content
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
                <SelectItem value="TRASH">Trash</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48 bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {contentTypes.map(type => (
                  <SelectItem key={type.id} value={type.name}>
                    {type.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Content Table */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">
            Content ({filteredContent.length})
          </CardTitle>
          <CardDescription className="text-gray-400">
            {filteredContent.length} {filteredContent.length === 1 ? 'item' : 'items'} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Title</TableHead>
                  <TableHead className="text-gray-300">Type</TableHead>
                  <TableHead className="text-gray-300">Author</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Published</TableHead>
                  <TableHead className="text-gray-300">Modified</TableHead>
                  <TableHead className="text-gray-300 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContent.map((item) => (
                  <TableRow key={item.id} className="border-gray-700">
                    <TableCell>
                      <div className="space-y-1">
                        <Link
                          href={`/admin/content/${item.id}`}
                          className="font-medium text-white hover:text-blue-400 transition-colors"
                        >
                          {item.title}
                        </Link>
                        {item.excerpt && (
                          <p className="text-sm text-gray-400 truncate max-w-md">
                            {item.excerpt}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-gray-800 text-gray-300">
                        <FileText className="h-3 w-3 mr-1" />
                        {item.contentType.displayName}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-300">
                          {item.author.firstName} {item.author.lastName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${statusColors[item.status]} text-white`}>
                        {statusLabels[item.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2 text-gray-300">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>
                          {item.publishedAt ? formatDate(item.publishedAt) : '-'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2 text-gray-300">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{formatDate(item.updatedAt)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                          <DropdownMenuLabel className="text-gray-300">Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-gray-700" />
                          <DropdownMenuItem className="text-gray-300 hover:bg-gray-700">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-gray-300 hover:bg-gray-700">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-gray-700" />
                          <DropdownMenuItem 
                            className="text-red-400 hover:bg-gray-700"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Move to Trash
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredContent.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No content found</h3>
              <p className="text-gray-400 mb-4">
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by creating your first piece of content'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && typeFilter === 'all' && (
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Content
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}