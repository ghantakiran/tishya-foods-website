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
          name: 'slug',
          type: 'text',
          label: 'URL Slug',
          required: true,
          validation: { pattern: '^[a-z0-9-]+$' }
        },
        {
          name: 'excerpt',
          type: 'textarea',
          label: 'Excerpt',
          required: false,
          validation: { max: 500 }
        },
        {
          name: 'content',
          type: 'rich_text',
          label: 'Content',
          required: true
        },
        {
          name: 'featured_image',
          type: 'image',
          label: 'Featured Image',
          required: false
        },
        {
          name: 'categories',
          type: 'multi_select',
          label: 'Categories',
          required: false,
          ui: {
            options: [
              { label: 'Health & Nutrition', value: 'health' },
              { label: 'Recipes', value: 'recipes' },
              { label: 'Product Updates', value: 'products' },
              { label: 'Company News', value: 'news' }
            ]
          }
        },
        {
          name: 'tags',
          type: 'tags',
          label: 'Tags',
          required: false
        },
        {
          name: 'published',
          type: 'boolean',
          label: 'Published',
          required: true,
          default: false
        },
        {
          name: 'published_at',
          type: 'datetime',
          label: 'Published Date',
          required: false
        },
        {
          name: 'author',
          type: 'relation',
          label: 'Author',
          required: true
        },
        {
          name: 'seo_title',
          type: 'text',
          label: 'SEO Title',
          required: false,
          validation: { max: 60 }
        },
        {
          name: 'seo_description',
          type: 'textarea',
          label: 'SEO Description',
          required: false,
          validation: { max: 160 }
        }
      ],
      layout: {
        sections: [
          {
            title: 'Content',
            fields: ['title', 'slug', 'excerpt', 'content', 'featured_image']
          },
          {
            title: 'Categorization',
            fields: ['categories', 'tags']
          },
          {
            title: 'Publishing',
            fields: ['published', 'published_at', 'author']
          },
          {
            title: 'SEO',
            fields: ['seo_title', 'seo_description'],
            collapsible: true
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
          required: true,
          validation: { min: 1, max: 100 }
        },
        {
          name: 'slug',
          type: 'text',
          label: 'URL Slug',
          required: true,
          validation: { pattern: '^[a-z0-9-]+$' }
        },
        {
          name: 'description',
          type: 'rich_text',
          label: 'Description',
          required: true
        },
        {
          name: 'short_description',
          type: 'textarea',
          label: 'Short Description',
          required: false,
          validation: { max: 300 }
        },
        {
          name: 'price',
          type: 'number',
          label: 'Price',
          required: true,
          validation: { min: 0 }
        },
        {
          name: 'compare_price',
          type: 'number',
          label: 'Compare At Price',
          required: false,
          validation: { min: 0 }
        },
        {
          name: 'sku',
          type: 'text',
          label: 'SKU',
          required: true
        },
        {
          name: 'barcode',
          type: 'text',
          label: 'Barcode',
          required: false
        },
        {
          name: 'weight',
          type: 'number',
          label: 'Weight (grams)',
          required: false,
          validation: { min: 0 }
        },
        {
          name: 'images',
          type: 'gallery',
          label: 'Product Images',
          required: true
        },
        {
          name: 'category',
          type: 'select',
          label: 'Category',
          required: true,
          ui: {
            options: [
              { label: 'Protein Powders', value: 'protein-powders' },
              { label: 'Snacks', value: 'snacks' },
              { label: 'Supplements', value: 'supplements' },
              { label: 'Beverages', value: 'beverages' }
            ]
          }
        },
        {
          name: 'tags',
          type: 'tags',
          label: 'Tags',
          required: false
        },
        {
          name: 'nutrition_facts',
          type: 'json',
          label: 'Nutrition Facts',
          required: false
        },
        {
          name: 'ingredients',
          type: 'textarea',
          label: 'Ingredients',
          required: false
        },
        {
          name: 'allergens',
          type: 'multi_select',
          label: 'Allergens',
          required: false,
          ui: {
            options: [
              { label: 'Contains Milk', value: 'milk' },
              { label: 'Contains Soy', value: 'soy' },
              { label: 'Contains Nuts', value: 'nuts' },
              { label: 'Contains Gluten', value: 'gluten' }
            ]
          }
        },
        {
          name: 'is_featured',
          type: 'boolean',
          label: 'Featured Product',
          required: true,
          default: false
        },
        {
          name: 'is_available',
          type: 'boolean',
          label: 'Available for Purchase',
          required: true,
          default: true
        },
        {
          name: 'seo_title',
          type: 'text',
          label: 'SEO Title',
          required: false,
          validation: { max: 60 }
        },
        {
          name: 'seo_description',
          type: 'textarea',
          label: 'SEO Description',
          required: false,
          validation: { max: 160 }
        }
      ],
      layout: {
        sections: [
          {
            title: 'Basic Information',
            fields: ['name', 'slug', 'description', 'short_description']
          },
          {
            title: 'Pricing & Inventory',
            fields: ['price', 'compare_price', 'sku', 'barcode', 'weight']
          },
          {
            title: 'Media',
            fields: ['images']
          },
          {
            title: 'Categorization',
            fields: ['category', 'tags']
          },
          {
            title: 'Product Details',
            fields: ['nutrition_facts', 'ingredients', 'allergens']
          },
          {
            title: 'Settings',
            fields: ['is_featured', 'is_available']
          },
          {
            title: 'SEO',
            fields: ['seo_title', 'seo_description'],
            collapsible: true
          }
        ]
      }
    }
  },

  recipe: {
    name: 'recipe',
    displayName: 'Recipes',
    description: 'Recipe content',
    isSystem: true,
    schema: {
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Recipe Title',
          required: true,
          validation: { min: 1, max: 100 }
        },
        {
          name: 'slug',
          type: 'text',
          label: 'URL Slug',
          required: true,
          validation: { pattern: '^[a-z0-9-]+$' }
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          required: true,
          validation: { max: 500 }
        },
        {
          name: 'featured_image',
          type: 'image',
          label: 'Featured Image',
          required: true
        },
        {
          name: 'prep_time',
          type: 'number',
          label: 'Prep Time (minutes)',
          required: true,
          validation: { min: 0 }
        },
        {
          name: 'cook_time',
          type: 'number',
          label: 'Cook Time (minutes)',
          required: true,
          validation: { min: 0 }
        },
        {
          name: 'servings',
          type: 'number',
          label: 'Servings',
          required: true,
          validation: { min: 1 }
        },
        {
          name: 'difficulty',
          type: 'select',
          label: 'Difficulty Level',
          required: true,
          ui: {
            options: [
              { label: 'Easy', value: 'easy' },
              { label: 'Medium', value: 'medium' },
              { label: 'Hard', value: 'hard' }
            ]
          }
        },
        {
          name: 'ingredients',
          type: 'json',
          label: 'Ingredients',
          required: true
        },
        {
          name: 'instructions',
          type: 'json',
          label: 'Instructions',
          required: true
        },
        {
          name: 'nutrition_info',
          type: 'json',
          label: 'Nutrition Information',
          required: false
        },
        {
          name: 'related_products',
          type: 'relation',
          label: 'Related Products',
          required: false
        },
        {
          name: 'tags',
          type: 'tags',
          label: 'Tags',
          required: false
        },
        {
          name: 'published',
          type: 'boolean',
          label: 'Published',
          required: true,
          default: false
        }
      ],
      layout: {
        sections: [
          {
            title: 'Basic Information',
            fields: ['title', 'slug', 'description', 'featured_image']
          },
          {
            title: 'Recipe Details',
            fields: ['prep_time', 'cook_time', 'servings', 'difficulty']
          },
          {
            title: 'Recipe Content',
            fields: ['ingredients', 'instructions', 'nutrition_info']
          },
          {
            title: 'Related Content',
            fields: ['related_products', 'tags']
          },
          {
            title: 'Publishing',
            fields: ['published']
          }
        ]
      }
    }
  }
}