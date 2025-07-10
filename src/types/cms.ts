import { 
  ContentStatus, 
  MediaStatus, 
  CommentStatus, 
  SubmissionStatus, 
  ActivityLevel,
  UserRole 
} from '@prisma/client'

// ===============================
// Core CMS Types
// ===============================

export interface ContentType {
  id: string
  name: string
  displayName: string
  description?: string
  schema: ContentSchema
  apiEndpoint?: string
  isSystem: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ContentSchema {
  fields: ContentField[]
  layout?: LayoutConfig
  validation?: ValidationRules
}

export interface ContentField {
  name: string
  type: FieldType
  label: string
  description?: string
  required?: boolean
  default?: any
  validation?: FieldValidation
  ui?: FieldUIConfig
}

export type FieldType = 
  | 'text'
  | 'textarea' 
  | 'rich_text'
  | 'number'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'email'
  | 'url'
  | 'image'
  | 'gallery'
  | 'select'
  | 'multi_select'
  | 'tags'
  | 'relation'
  | 'json'

export interface FieldValidation {
  min?: number
  max?: number
  pattern?: string
  custom?: string // Custom validation function name
}

export interface FieldUIConfig {
  placeholder?: string
  helpText?: string
  options?: SelectOption[]
  multiple?: boolean
  searchable?: boolean
  widget?: string
}

export interface SelectOption {
  label: string
  value: string | number
  description?: string
}

export interface LayoutConfig {
  sections: LayoutSection[]
  sidebar?: SidebarConfig
}

export interface LayoutSection {
  title: string
  fields: string[]
  collapsible?: boolean
  columns?: number
}

export interface SidebarConfig {
  fields: string[]
  width?: number
}

export interface ValidationRules {
  required?: string[]
  unique?: string[]
  custom?: Record<string, string>
}

// ===============================
// Content Types
// ===============================

export interface Content {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: Record<string, any>
  metaTitle?: string
  metaDescription?: string
  metaKeywords: string[]
  featuredImage?: string
  images: string[]
  status: ContentStatus
  publishedAt?: Date
  scheduledAt?: Date
  contentTypeId: string
  contentType: ContentType
  authorId: string
  author: User
  categories: Category[]
  tags: Tag[]
  versions: ContentVersion[]
  analytics: ContentAnalytics[]
  createdAt: Date
  updatedAt: Date
}

export interface ContentVersion {
  id: string
  contentId: string
  version: number
  title: string
  data: Record<string, any>
  authorId: string
  author: User
  note?: string
  createdAt: Date
}

export interface ContentAnalytics {
  id: string
  contentId: string
  views: number
  uniqueViews: number
  likes: number
  shares: number
  comments: number
  engagement: number
  date: Date
}

// ===============================
// Taxonomy Types
// ===============================

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  parent?: Category
  children: Category[]
  contentCount?: number
  createdAt: Date
  updatedAt: Date
}

export interface Tag {
  id: string
  name: string
  slug: string
  description?: string
  color?: string
  contentCount?: number
  createdAt: Date
  updatedAt: Date
}

// ===============================
// Media Types
// ===============================

export interface Media {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  width?: number
  height?: number
  url: string
  alt?: string
  caption?: string
  description?: string
  metadata?: MediaMetadata
  uploadedBy: string
  uploader: User
  mediaFolder?: string
  tags: string[]
  status: MediaStatus
  usageCount: number
  createdAt: Date
  updatedAt: Date
}

export interface MediaMetadata {
  exif?: Record<string, any>
  colors?: string[]
  blurhash?: string
  optimization?: {
    webp?: string
    avif?: string
    thumbnails?: Record<string, string>
  }
}

export interface MediaFolder {
  name: string
  path: string
  parent?: string
  children?: MediaFolder[]
  mediaCount?: number
}

// ===============================
// Comment Types
// ===============================

export interface Comment {
  id: string
  contentId?: string
  parentId?: string
  parent?: Comment
  replies: Comment[]
  authorId?: string
  author?: User
  name: string
  email: string
  website?: string
  content: string
  status: CommentStatus
  isSpam: boolean
  likes: number
  ipAddress?: string
  userAgent?: string
  createdAt: Date
  updatedAt: Date
}

// ===============================
// Settings Types
// ===============================

export interface Setting {
  id: string
  key: string
  value: any
  type: SettingType
  group: string
  label: string
  description?: string
  isPublic: boolean
  validation?: Record<string, any>
  updatedBy: string
  updater: User
  createdAt: Date
  updatedAt: Date
}

export type SettingType = 
  | 'string'
  | 'number'
  | 'boolean'
  | 'json'
  | 'image'
  | 'rich_text'
  | 'select'
  | 'multi_select'

// ===============================
// Form Types
// ===============================

export interface FormSubmission {
  id: string
  formType: string
  data: Record<string, any>
  email?: string
  name?: string
  status: SubmissionStatus
  notes?: string
  handled: boolean
  handledBy?: string
  handler?: User
  ipAddress?: string
  userAgent?: string
  referrer?: string
  createdAt: Date
  updatedAt: Date
}

// ===============================
// Activity Log Types
// ===============================

export interface ActivityLog {
  id: string
  userId?: string
  user?: User
  action: string
  entityType: string
  entityId: string
  entityTitle?: string
  details?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  level: ActivityLevel
  createdAt: Date
}

// ===============================
// User Types (Extended)
// ===============================

export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  emailVerified: boolean
  role: UserRole
  avatar?: string
  bio?: string
  socialLinks?: SocialLinks
  isActive: boolean
  lastLoginAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface SocialLinks {
  twitter?: string
  linkedin?: string
  github?: string
  website?: string
  instagram?: string
  facebook?: string
}

// ===============================
// API Types
// ===============================

export interface CMSResponse<T = any> {
  data: T
  meta?: ResponseMeta
  error?: string
}

export interface ResponseMeta {
  total?: number
  page?: number
  limit?: number
  pages?: number
  hasNext?: boolean
  hasPrev?: boolean
}

export interface ContentListParams {
  contentTypeId?: string
  status?: ContentStatus[]
  authorId?: string
  categoryId?: string
  tagId?: string
  search?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  include?: string[]
}

export interface MediaListParams {
  mediaFolder?: string
  mimeType?: string[]
  search?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// ===============================
// Dashboard Types
// ===============================

export interface DashboardStats {
  content: {
    total: number
    published: number
    draft: number
    scheduled: number
  }
  media: {
    total: number
    totalSize: number
    images: number
    documents: number
  }
  users: {
    total: number
    active: number
    newThisMonth: number
  }
  engagement: {
    totalViews: number
    totalComments: number
    totalLikes: number
    avgEngagement: number
  }
}

export interface ContentPerformance {
  contentId: string
  title: string
  views: number
  engagement: number
  publishedAt: Date
  trend: 'up' | 'down' | 'stable'
}

// ===============================
// Workflow Types
// ===============================

export interface WorkflowStep {
  id: string
  name: string
  description?: string
  requiredRole: UserRole[]
  actions: WorkflowAction[]
}

export interface WorkflowAction {
  type: 'approve' | 'reject' | 'request_changes' | 'publish' | 'archive'
  label: string
  description?: string
  requiresNote?: boolean
}

export interface ContentWorkflow {
  id: string
  contentId: string
  currentStep: number
  steps: WorkflowStep[]
  history: WorkflowHistory[]
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  createdAt: Date
  updatedAt: Date
}

export interface WorkflowHistory {
  stepId: string
  action: string
  userId: string
  user: User
  note?: string
  createdAt: Date
}