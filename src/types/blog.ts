export type BlogPostStatus = 'draft' | 'published' | 'scheduled' | 'archived'

export interface Author {
  id: string
  name: string
  email: string
  avatar?: string
  bio?: string
  socialLinks?: {
    twitter?: string
    linkedin?: string
    website?: string
  }
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description?: string
  color?: string
  icon?: string
  parentId?: string
  postCount?: number
}

export interface BlogTag {
  id: string
  name: string
  slug: string
  description?: string
  color?: string
  postCount?: number
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage?: string
  status: BlogPostStatus
  publishedAt?: string
  scheduledAt?: string
  createdAt: string
  updatedAt: string
  author: Author
  categories: BlogCategory[]
  tags: BlogTag[]
  seo: {
    metaTitle?: string
    metaDescription?: string
    focusKeyword?: string
    canonicalUrl?: string
  }
  readingTime: number
  viewCount: number
  likeCount: number
  commentCount: number
  featured: boolean
  sticky: boolean
}

export interface BlogComment {
  id: string
  postId: string
  author: {
    name: string
    email: string
    avatar?: string
    website?: string
  }
  content: string
  parentId?: string
  status: 'pending' | 'approved' | 'spam' | 'trash'
  createdAt: string
  updatedAt: string
  replies?: BlogComment[]
  likeCount: number
  isAuthorReply: boolean
}

export interface BlogStats {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  totalViews: number
  totalComments: number
  topCategories: Array<{
    category: BlogCategory
    postCount: number
  }>
  topTags: Array<{
    tag: BlogTag
    postCount: number
  }>
  recentActivity: Array<{
    type: 'post_published' | 'comment_added' | 'post_viewed'
    description: string
    timestamp: string
    relatedId?: string
  }>
}

export interface ContentBlock {
  id: string
  type: 'paragraph' | 'heading' | 'image' | 'video' | 'quote' | 'code' | 'list' | 'table' | 'embed'
  content: any
  order: number
}

export interface BlogFilters {
  search?: string
  category?: string
  tag?: string
  author?: string
  status?: BlogPost['status']
  featured?: boolean
  dateFrom?: string
  dateTo?: string
  sortBy?: 'createdAt' | 'publishedAt' | 'title' | 'viewCount'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface BlogState {
  posts: BlogPost[]
  categories: BlogCategory[]
  tags: BlogTag[]
  authors: Author[]
  currentPost: BlogPost | null
  stats: BlogStats | null
  isLoading: boolean
  error: string | null
}

export interface BlogActions {
  // Posts
  fetchPosts: (filters?: BlogFilters) => Promise<void>
  fetchPost: (slug: string) => Promise<BlogPost | null>
  createPost: (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => Promise<BlogPost>
  updatePost: (id: string, updates: Partial<BlogPost>) => Promise<BlogPost>
  deletePost: (id: string) => Promise<void>
  publishPost: (id: string) => Promise<void>
  schedulePost: (id: string, scheduledAt: string) => Promise<void>
  toggleFeatured: (id: string) => Promise<void>
  
  // Categories
  fetchCategories: () => Promise<void>
  createCategory: (category: Omit<BlogCategory, 'id'>) => Promise<BlogCategory>
  updateCategory: (id: string, updates: Partial<BlogCategory>) => Promise<BlogCategory>
  deleteCategory: (id: string) => Promise<void>
  
  // Tags
  fetchTags: () => Promise<void>
  createTag: (tag: Omit<BlogTag, 'id'>) => Promise<BlogTag>
  updateTag: (id: string, updates: Partial<BlogTag>) => Promise<BlogTag>
  deleteTag: (id: string) => Promise<void>
  
  // Comments
  fetchComments: (postId: string) => Promise<BlogComment[]>
  addComment: (comment: Omit<BlogComment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<BlogComment>
  moderateComment: (id: string, status: BlogComment['status']) => Promise<void>
  deleteComment: (id: string) => Promise<void>
  
  // Analytics
  incrementViewCount: (postId: string) => Promise<void>
  toggleLike: (postId: string) => Promise<void>
  
  // Stats
  fetchStats: () => Promise<void>
}