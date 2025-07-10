import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { asyncHandler, ValidationError } from '@/lib/error-handling'
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

// Built-in content type schemas
export const BUILT_IN_CONTENT_TYPES = {
  blog_post: {
    name: 'blog_post',
    displayName: 'Blog Posts',
    description: 'Blog articles and posts',
    isSystem: true,
    schema: {
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          required: true,
          validation: { min: 1, max: 200 }
        },
        {
          name: 'content',
          type: 'rich_text',
          label: 'Content',
          required: true,
          ui: { helpText: 'Main blog post content' }
        },
        {
          name: 'excerpt',
          type: 'textarea',
          label: 'Excerpt',
          ui: { placeholder: 'Brief summary of the post...' },
          validation: { max: 500 }
        },
        {
          name: 'readTime',
          type: 'number',
          label: 'Read Time (minutes)',
          default: 5
        },
        {
          name: 'author',
          type: 'relation',
          label: 'Author',
          ui: { searchable: true }
        }
      ],
      layout: {
        sections: [
          {
            title: 'Content',
            fields: ['title', 'content', 'excerpt']
          },
          {
            title: 'Metadata',
            fields: ['readTime', 'author']
          }
        ]
      }
    }
  },
  product: {
    name: 'product',
    displayName: 'Products',
    description: 'E-commerce products',
    isSystem: true,
    schema: {
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Product Name',
          required: true
        },
        {
          name: 'description',
          type: 'rich_text',
          label: 'Description',
          required: true
        },
        {
          name: 'price',
          type: 'number',
          label: 'Price',
          required: true,
          validation: { min: 0 }
        },
        {
          name: 'originalPrice',
          type: 'number',
          label: 'Original Price',
          validation: { min: 0 }
        },
        {
          name: 'sku',
          type: 'text',
          label: 'SKU',
          ui: { placeholder: 'Stock keeping unit' }
        },
        {
          name: 'stock',
          type: 'number',
          label: 'Stock Quantity',
          default: 0,
          validation: { min: 0 }
        },
        {
          name: 'weight',
          type: 'number',
          label: 'Weight (g)',
          validation: { min: 0 }
        },
        {
          name: 'ingredients',
          type: 'tags',
          label: 'Ingredients',
          ui: { helpText: 'Add ingredients one by one' }
        },
        {
          name: 'allergens',
          type: 'multi_select',
          label: 'Allergens',
          ui: {
            options: [
              { label: 'Gluten', value: 'gluten' },
              { label: 'Dairy', value: 'dairy' },
              { label: 'Nuts', value: 'nuts' },
              { label: 'Soy', value: 'soy' },
              { label: 'Eggs', value: 'eggs' }
            ]
          }
        },
        {
          name: 'nutritionalInfo',
          type: 'json',
          label: 'Nutritional Information',
          ui: { widget: 'nutrition-editor' }
        },
        {
          name: 'certifications',
          type: 'multi_select',
          label: 'Certifications',
          ui: {
            options: [
              { label: 'Organic', value: 'organic' },
              { label: 'Non-GMO', value: 'non-gmo' },
              { label: 'Fair Trade', value: 'fair-trade' },
              { label: 'Vegan', value: 'vegan' },
              { label: 'Gluten-Free', value: 'gluten-free' }
            ]
          }
        }
      ],
      layout: {
        sections: [
          {
            title: 'Basic Information',
            fields: ['name', 'description', 'price', 'originalPrice']
          },
          {
            title: 'Inventory',
            fields: ['sku', 'stock', 'weight']
          },
          {
            title: 'Product Details',
            fields: ['ingredients', 'allergens', 'nutritionalInfo', 'certifications']
          }
        ]
      }
    }
  },
  recipe: {
    name: 'recipe',
    displayName: 'Recipes',
    description: 'Cooking recipes and instructions',
    isSystem: true,
    schema: {
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Recipe Title',
          required: true
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          required: true
        },
        {
          name: 'prepTime',
          type: 'text',
          label: 'Prep Time',
          ui: { placeholder: 'e.g., 15 minutes' }
        },
        {
          name: 'cookTime',
          type: 'text',
          label: 'Cook Time',
          ui: { placeholder: 'e.g., 30 minutes' }
        },
        {
          name: 'servings',
          type: 'number',
          label: 'Servings',
          default: 4,
          validation: { min: 1 }
        },
        {
          name: 'difficulty',
          type: 'select',
          label: 'Difficulty',
          ui: {
            options: [
              { label: 'Easy', value: 'easy' },
              { label: 'Medium', value: 'medium' },
              { label: 'Hard', value: 'hard' }
            ]
          }
        },
        {
          name: 'cuisine',
          type: 'text',
          label: 'Cuisine Type',
          ui: { placeholder: 'e.g., Italian, Asian, Mediterranean' }
        },
        {
          name: 'ingredients',
          type: 'json',
          label: 'Ingredients',
          ui: { widget: 'ingredient-list' }
        },
        {
          name: 'instructions',
          type: 'json',
          label: 'Instructions',
          ui: { widget: 'step-list' }
        },
        {
          name: 'nutrition',
          type: 'json',
          label: 'Nutritional Information',
          ui: { widget: 'nutrition-editor' }
        }
      ],
      layout: {
        sections: [
          {
            title: 'Basic Information',
            fields: ['title', 'description', 'cuisine']
          },
          {
            title: 'Timing & Difficulty',
            fields: ['prepTime', 'cookTime', 'servings', 'difficulty']
          },
          {
            title: 'Recipe Details',
            fields: ['ingredients', 'instructions', 'nutrition']
          }
        ]
      }
    }
  }
}