import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { asyncHandler, ValidationError, NotFoundError } from '@/lib/error-handling'
import { z } from 'zod'

// Validation schema for content updates
const updateContentSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Invalid slug format').optional(),
  excerpt: z.string().optional(),
  content: z.record(z.any()).optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.array(z.string()).optional(),
  featuredImage: z.string().optional(),
  images: z.array(z.string()).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED']).optional(),
  publishedAt: z.string().datetime().optional().nullable(),
  scheduledAt: z.string().datetime().optional().nullable(),
  categoryIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
  versionNote: z.string().optional(),
})

interface RouteParams {
  params: { id: string }
}

// GET /api/cms/content/[id] - Get single content item
export const GET = asyncHandler(async (request: NextRequest, { params }: RouteParams) => {
  const { searchParams } = new URL(request.url)
  const includeVersions = searchParams.get('includeVersions') === 'true'
  const includeAnalytics = searchParams.get('includeAnalytics') === 'true'

  const content = await db.content.findUnique({
    where: { id: params.id },
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
      },
      versions: includeVersions ? {
        orderBy: { version: 'desc' },
        take: 10,
        include: {
          author: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              avatar: true,
            }
          }
        }
      } : false,
      analytics: includeAnalytics ? {
        where: {
          date: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        },
        orderBy: { date: 'desc' }
      } : false,
    }
  })

  if (!content) {
    throw new NotFoundError('Content')
  }

  return NextResponse.json({ data: content })
})

// PUT /api/cms/content/[id] - Update content
export const PUT = asyncHandler(async (request: NextRequest, { params }: RouteParams) => {
  const body = await request.json()
  
  // Validate input
  const validatedData = updateContentSchema.parse(body)
  
  // TODO: Get user from authentication context
  const authorId = 'temp-user-id' // This should come from auth context
  
  // Check if content exists
  const existingContent = await db.content.findUnique({
    where: { id: params.id },
    include: {
      versions: {
        orderBy: { version: 'desc' },
        take: 1
      }
    }
  })
  
  if (!existingContent) {
    throw new NotFoundError('Content')
  }
  
  // Check for slug uniqueness if slug is being updated
  if (validatedData.slug && validatedData.slug !== existingContent.slug) {
    const slugExists = await db.content.findFirst({
      where: {
        slug: validatedData.slug,
        contentTypeId: existingContent.contentTypeId,
        id: { not: params.id }
      }
    })
    
    if (slugExists) {
      throw new ValidationError('Slug already exists for this content type')
    }
  }

  // Prepare update data
  const updateData: any = {}
  
  if (validatedData.title) updateData.title = validatedData.title
  if (validatedData.slug) updateData.slug = validatedData.slug
  if (validatedData.excerpt !== undefined) updateData.excerpt = validatedData.excerpt
  if (validatedData.content) updateData.content = validatedData.content
  if (validatedData.metaTitle !== undefined) updateData.metaTitle = validatedData.metaTitle
  if (validatedData.metaDescription !== undefined) updateData.metaDescription = validatedData.metaDescription
  if (validatedData.metaKeywords) updateData.metaKeywords = validatedData.metaKeywords
  if (validatedData.featuredImage !== undefined) updateData.featuredImage = validatedData.featuredImage
  if (validatedData.images) updateData.images = validatedData.images
  if (validatedData.status) updateData.status = validatedData.status
  if (validatedData.publishedAt !== undefined) {
    updateData.publishedAt = validatedData.publishedAt ? new Date(validatedData.publishedAt) : null
  }
  if (validatedData.scheduledAt !== undefined) {
    updateData.scheduledAt = validatedData.scheduledAt ? new Date(validatedData.scheduledAt) : null
  }

  // Handle category updates
  if (validatedData.categoryIds) {
    // Delete existing categories and create new ones
    await db.categoryContent.deleteMany({
      where: { contentId: params.id }
    })
    
    updateData.categories = {
      create: validatedData.categoryIds.map(categoryId => ({
        categoryId
      }))
    }
  }

  // Handle tag updates
  if (validatedData.tagIds) {
    // Delete existing tags and create new ones
    await db.tagContent.deleteMany({
      where: { contentId: params.id }
    })
    
    updateData.tags = {
      create: validatedData.tagIds.map(tagId => ({
        tagId
      }))
    }
  }

  // Update content
  const content = await db.content.update({
    where: { id: params.id },
    data: updateData,
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

  // Create new version if content has changed
  const latestVersion = existingContent.versions[0]
  const currentVersion = latestVersion ? latestVersion.version + 1 : 1
  
  await db.contentVersion.create({
    data: {
      contentId: content.id,
      version: currentVersion,
      title: content.title,
      data: content.content,
      authorId,
      note: validatedData.versionNote || `Version ${currentVersion}`
    }
  })

  // Log activity
  await db.activityLog.create({
    data: {
      userId: authorId,
      action: 'update',
      entityType: 'content',
      entityId: content.id,
      entityTitle: content.title,
      details: {
        changes: Object.keys(validatedData),
        version: currentVersion
      }
    }
  })

  return NextResponse.json({
    data: content,
    message: 'Content updated successfully'
  })
})

// DELETE /api/cms/content/[id] - Delete content (soft delete to TRASH status)
export const DELETE = asyncHandler(async (request: NextRequest, { params }: RouteParams) => {
  // TODO: Get user from authentication context
  const authorId = 'temp-user-id' // This should come from auth context
  
  const content = await db.content.findUnique({
    where: { id: params.id },
    select: { id: true, title: true, status: true }
  })
  
  if (!content) {
    throw new NotFoundError('Content')
  }

  // Soft delete by moving to TRASH status
  const updatedContent = await db.content.update({
    where: { id: params.id },
    data: { status: 'TRASH' }
  })

  // Log activity
  await db.activityLog.create({
    data: {
      userId: authorId,
      action: 'delete',
      entityType: 'content',
      entityId: content.id,
      entityTitle: content.title,
      details: {
        previousStatus: content.status
      }
    }
  })

  return NextResponse.json({
    message: 'Content moved to trash successfully'
  })
})