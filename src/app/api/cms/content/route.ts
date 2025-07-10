import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { asyncHandler, ValidationError, NotFoundError } from '@/lib/error-handling'
import { ContentListParams, CMSResponse } from '@/types/cms'
import { z } from 'zod'

// Validation schema for content creation
const createContentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Invalid slug format'),
  excerpt: z.string().optional(),
  content: z.record(z.any()),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.array(z.string()).default([]),
  featuredImage: z.string().optional(),
  images: z.array(z.string()).default([]),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED']).default('DRAFT'),
  publishedAt: z.string().datetime().optional(),
  scheduledAt: z.string().datetime().optional(),
  contentTypeId: z.string().min(1, 'Content type is required'),
  categoryIds: z.array(z.string()).default([]),
  tagIds: z.array(z.string()).default([]),
})

// GET /api/cms/content - List content with filtering and pagination
export const GET = asyncHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  
  const params: ContentListParams = {
    contentTypeId: searchParams.get('contentTypeId') || undefined,
    status: searchParams.get('status')?.split(',') as any || undefined,
    authorId: searchParams.get('authorId') || undefined,
    categoryId: searchParams.get('categoryId') || undefined,
    tagId: searchParams.get('tagId') || undefined,
    search: searchParams.get('search') || undefined,
    page: parseInt(searchParams.get('page') || '1'),
    limit: Math.min(parseInt(searchParams.get('limit') || '20'), 100),
    sortBy: searchParams.get('sortBy') || 'updatedAt',
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
    include: searchParams.get('include')?.split(',') || [],
  }

  // Build where clause
  const where: any = {}
  
  if (params.contentTypeId) {
    where.contentTypeId = params.contentTypeId
  }
  
  if (params.status && params.status.length > 0) {
    where.status = { in: params.status }
  }
  
  if (params.authorId) {
    where.authorId = params.authorId
  }
  
  if (params.categoryId) {
    where.categories = {
      some: { categoryId: params.categoryId }
    }
  }
  
  if (params.tagId) {
    where.tags = {
      some: { tagId: params.tagId }
    }
  }
  
  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: 'insensitive' } },
      { excerpt: { contains: params.search, mode: 'insensitive' } },
      { metaTitle: { contains: params.search, mode: 'insensitive' } },
      { metaDescription: { contains: params.search, mode: 'insensitive' } },
    ]
  }

  // Build include clause
  const include: any = {
    contentType: true,
    author: {
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
      }
    },
  }
  
  if (params.include?.includes('categories')) {
    include.categories = {
      include: { category: true }
    }
  }
  
  if (params.include?.includes('tags')) {
    include.tags = {
      include: { tag: true }
    }
  }
  
  if (params.include?.includes('analytics')) {
    include.analytics = {
      where: {
        date: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      },
      orderBy: { date: 'desc' }
    }
  }

  // Get total count
  const total = await db.content.count({ where })

  // Get content with pagination
  const content = await db.content.findMany({
    where,
    include,
    orderBy: { [params.sortBy!]: params.sortOrder },
    skip: ((params.page || 1) - 1) * (params.limit || 20),
    take: params.limit || 20,
  })

  const pages = Math.ceil(total / (params.limit || 20))

  const response: CMSResponse = {
    data: content,
    meta: {
      total,
      page: params.page || 1,
      limit: params.limit || 20,
      pages,
      hasNext: (params.page || 1) < pages,
      hasPrev: (params.page || 1) > 1,
    }
  }

  return NextResponse.json(response)
})

// POST /api/cms/content - Create new content
export const POST = asyncHandler(async (request: NextRequest) => {
  const body = await request.json()
  
  // Validate input
  const validatedData = createContentSchema.parse(body)
  
  // TODO: Get user from authentication context
  const authorId = 'temp-user-id' // This should come from auth context
  
  // Check if content type exists
  const contentType = await db.contentType.findUnique({
    where: { id: validatedData.contentTypeId }
  })
  
  if (!contentType) {
    throw new NotFoundError('Content type')
  }
  
  // Check for slug uniqueness within content type
  const existingContent = await db.content.findFirst({
    where: {
      slug: validatedData.slug,
      contentTypeId: validatedData.contentTypeId,
    }
  })
  
  if (existingContent) {
    throw new ValidationError('Slug already exists for this content type')
  }

  // Create content
  const content = await db.content.create({
    data: {
      title: validatedData.title,
      slug: validatedData.slug,
      excerpt: validatedData.excerpt,
      content: validatedData.content,
      metaTitle: validatedData.metaTitle,
      metaDescription: validatedData.metaDescription,
      metaKeywords: validatedData.metaKeywords,
      featuredImage: validatedData.featuredImage,
      images: validatedData.images,
      status: validatedData.status,
      publishedAt: validatedData.publishedAt ? new Date(validatedData.publishedAt) : null,
      scheduledAt: validatedData.scheduledAt ? new Date(validatedData.scheduledAt) : null,
      contentTypeId: validatedData.contentTypeId,
      authorId,
      categories: {
        create: validatedData.categoryIds.map(categoryId => ({
          categoryId
        }))
      },
      tags: {
        create: validatedData.tagIds.map(tagId => ({
          tagId
        }))
      }
    },
    include: {
      contentType: true,
      author: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          avatar: true,
        }
      },
      categories: {
        include: { category: true }
      },
      tags: {
        include: { tag: true }
      }
    }
  })

  // Create initial version
  await db.contentVersion.create({
    data: {
      contentId: content.id,
      version: 1,
      title: content.title,
      data: content.content,
      authorId,
      note: 'Initial version'
    }
  })

  // Log activity
  await db.activityLog.create({
    data: {
      userId: authorId,
      action: 'create',
      entityType: 'content',
      entityId: content.id,
      entityTitle: content.title,
      details: {
        contentType: contentType.name,
        status: content.status
      }
    }
  })

  return NextResponse.json({
    data: content,
    message: 'Content created successfully'
  }, { status: 201 })
})