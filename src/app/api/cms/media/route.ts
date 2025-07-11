import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { asyncHandler, ValidationError } from '@/lib/error-handling'
import { MediaListParams, CMSResponse } from '@/types/cms'
import { getMediaFolders, getMediaStats, FOLDERS, STATS } from '@/lib/cms/media-helpers'
import { z } from 'zod'

// Validation schema for media upload metadata
const uploadMediaSchema = z.object({
  filename: z.string().min(1, 'Filename is required'),
  originalName: z.string().min(1, 'Original name is required'),
  mimeType: z.string().min(1, 'MIME type is required'),
  size: z.number().min(1, 'Size is required'),
  width: z.number().optional(),
  height: z.number().optional(),
  url: z.string().url('Valid URL is required'),
  alt: z.string().optional(),
  caption: z.string().optional(),
  description: z.string().optional(),
  mediaFolder: z.string().optional(),
  tags: z.array(z.string()).default([]),
})

// GET /api/cms/media - List media with filtering and pagination
export const GET = asyncHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  
  const params: MediaListParams = {
    mediaFolder: searchParams.get('mediaFolder') || undefined,
    mimeType: searchParams.get('mimeType')?.split(',') || undefined,
    search: searchParams.get('search') || undefined,
    page: parseInt(searchParams.get('page') || '1'),
    limit: Math.min(parseInt(searchParams.get('limit') || '20'), 100),
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
  }

  // Build where clause
  const where: any = {
    status: 'ACTIVE' // Only show active media
  }
  
  if (params.mediaFolder) {
    where.mediaFolder = params.mediaFolder
  }
  
  if (params.mimeType && params.mimeType.length > 0) {
    where.mimeType = { in: params.mimeType }
  }
  
  if (params.search) {
    where.OR = [
      { originalName: { contains: params.search, mode: 'insensitive' } },
      { alt: { contains: params.search, mode: 'insensitive' } },
      { caption: { contains: params.search, mode: 'insensitive' } },
      { description: { contains: params.search, mode: 'insensitive' } },
      { tags: { hasSome: [params.search] } },
    ]
  }

  // Get total count
  const total = await db.media.count({ where })

  // Get media with pagination
  const media = await db.media.findMany({
    where,
    include: {
      uploader: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          avatar: true,
        }
      }
    },
    orderBy: { [params.sortBy!]: params.sortOrder },
    skip: ((params.page || 1) - 1) * (params.limit || 20),
    take: params.limit || 20,
  })

  const pages = Math.ceil(total / (params.limit || 20))

  const response: CMSResponse = {
    data: media,
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

// POST /api/cms/media - Create media record (after file upload)
export const POST = asyncHandler(async (request: NextRequest) => {
  const body = await request.json()
  
  // Validate input
  const validatedData = uploadMediaSchema.parse(body)
  
  // TODO: Get user from authentication context
  const uploadedBy = 'temp-user-id' // This should come from auth context
  
  // Check if filename already exists
  const existingMedia = await db.media.findFirst({
    where: { 
      filename: validatedData.filename,
      status: 'ACTIVE'
    }
  })
  
  if (existingMedia) {
    throw new ValidationError('File with this name already exists')
  }

  // Create media record
  const media = await db.media.create({
    data: {
      filename: validatedData.filename,
      originalName: validatedData.originalName,
      mimeType: validatedData.mimeType,
      size: validatedData.size,
      width: validatedData.width,
      height: validatedData.height,
      url: validatedData.url,
      alt: validatedData.alt,
      caption: validatedData.caption,
      description: validatedData.description,
      uploadedBy,
      mediaFolder: validatedData.mediaFolder,
      tags: validatedData.tags,
      status: 'ACTIVE',
    },
    include: {
      uploader: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          avatar: true,
        }
      }
    }
  })

  // Log activity
  await db.activityLog.create({
    data: {
      userId: uploadedBy,
      action: 'upload',
      entityType: 'media',
      entityId: media.id,
      entityTitle: media.originalName,
      details: {
        mimeType: media.mimeType,
        size: media.size,
        folder: media.mediaFolder
      }
    }
  })

  return NextResponse.json({
    data: media,
    message: 'Media uploaded successfully'
  }, { status: 201 })
})


