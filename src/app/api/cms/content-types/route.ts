import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { asyncHandler, ValidationError } from '@/lib/error-handling'
import { BUILT_IN_CONTENT_TYPES } from '@/lib/cms/content-types'
import { z } from 'zod'

// Validation schema for content type creation
const createContentTypeSchema = z.object({
  name: z.string().min(1, 'Name is required').regex(/^[a-z_]+$/, 'Name must be lowercase with underscores only'),
  displayName: z.string().min(1, 'Display name is required'),
  description: z.string().optional(),
  schema: z.object({
    fields: z.array(z.object({
      name: z.string(),
      type: z.enum(['text', 'textarea', 'rich_text', 'number', 'boolean', 'date', 'datetime', 'email', 'url', 'image', 'gallery', 'select', 'multi_select', 'tags', 'relation', 'json']),
      label: z.string(),
      description: z.string().optional(),
      required: z.boolean().optional(),
      default: z.any().optional(),
      validation: z.object({
        min: z.number().optional(),
        max: z.number().optional(),
        pattern: z.string().optional(),
        custom: z.string().optional(),
      }).optional(),
      ui: z.object({
        placeholder: z.string().optional(),
        helpText: z.string().optional(),
        options: z.array(z.object({
          label: z.string(),
          value: z.union([z.string(), z.number()]),
          description: z.string().optional(),
        })).optional(),
        multiple: z.boolean().optional(),
        searchable: z.boolean().optional(),
        widget: z.string().optional(),
      }).optional(),
    })),
    layout: z.object({
      sections: z.array(z.object({
        title: z.string(),
        fields: z.array(z.string()),
        collapsible: z.boolean().optional(),
        columns: z.number().optional(),
      })),
      sidebar: z.object({
        fields: z.array(z.string()),
        width: z.number().optional(),
      }).optional(),
    }).optional(),
    validation: z.object({
      required: z.array(z.string()).optional(),
      unique: z.array(z.string()).optional(),
      custom: z.record(z.string()).optional(),
    }).optional(),
  }),
  apiEndpoint: z.string().optional(),
})

// GET /api/cms/content-types - List all content types
export const GET = asyncHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const includeStats = searchParams.get('includeStats') === 'true'

  const contentTypes = await db.contentType.findMany({
    orderBy: { displayName: 'asc' },
    include: includeStats ? {
      _count: {
        select: { contents: true }
      }
    } : undefined
  })

  return NextResponse.json({ data: contentTypes })
})

// POST /api/cms/content-types - Create new content type
export const POST = asyncHandler(async (request: NextRequest) => {
  const body = await request.json()
  
  // Validate input
  const validatedData = createContentTypeSchema.parse(body)
  
  // Check if content type name already exists
  const existingContentType = await db.contentType.findUnique({
    where: { name: validatedData.name }
  })
  
  if (existingContentType) {
    throw new ValidationError('Content type name already exists')
  }

  // Validate schema structure
  const fieldNames = validatedData.schema.fields.map(f => f.name)
  const uniqueFieldNames = new Set(fieldNames)
  
  if (fieldNames.length !== uniqueFieldNames.size) {
    throw new ValidationError('Field names must be unique within a content type')
  }

  // Create content type
  const contentType = await db.contentType.create({
    data: {
      name: validatedData.name,
      displayName: validatedData.displayName,
      description: validatedData.description,
      schema: validatedData.schema,
      apiEndpoint: validatedData.apiEndpoint,
      isSystem: false, // User-created content types are not system types
    }
  })

  // TODO: Log activity when authentication is implemented
  // await db.activityLog.create({
  //   data: {
  //     userId: authorId,
  //     action: 'create',
  //     entityType: 'content_type',
  //     entityId: contentType.id,
  //     entityTitle: contentType.displayName,
  //   }
  // })

  return NextResponse.json({
    data: contentType,
    message: 'Content type created successfully'
  }, { status: 201 })
})

