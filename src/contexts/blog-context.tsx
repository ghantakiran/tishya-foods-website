'use client'

import { createContext, useContext, useReducer, ReactNode } from 'react'
import { BlogState, BlogActions, BlogPost, BlogCategory, BlogTag, BlogComment, BlogFilters, BlogStats, Author } from '@/types/blog'
import { useAnalytics } from '@/hooks/use-analytics'

type BlogContextType = BlogState & BlogActions

const BlogContext = createContext<BlogContextType | undefined>(undefined)

type BlogAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_POSTS'; payload: BlogPost[] }
  | { type: 'SET_CATEGORIES'; payload: BlogCategory[] }
  | { type: 'SET_TAGS'; payload: BlogTag[] }
  | { type: 'SET_AUTHORS'; payload: Author[] }
  | { type: 'SET_CURRENT_POST'; payload: BlogPost | null }
  | { type: 'SET_STATS'; payload: BlogStats | null }
  | { type: 'ADD_POST'; payload: BlogPost }
  | { type: 'UPDATE_POST'; payload: BlogPost }
  | { type: 'REMOVE_POST'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: BlogCategory }
  | { type: 'UPDATE_CATEGORY'; payload: BlogCategory }
  | { type: 'REMOVE_CATEGORY'; payload: string }
  | { type: 'ADD_TAG'; payload: BlogTag }
  | { type: 'UPDATE_TAG'; payload: BlogTag }
  | { type: 'REMOVE_TAG'; payload: string }

const initialState: BlogState = {
  posts: [],
  categories: [],
  tags: [],
  authors: [],
  currentPost: null,
  stats: null,
  isLoading: false,
  error: null,
}

const blogReducer = (state: BlogState, action: BlogAction): BlogState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false }
    
    case 'SET_POSTS':
      return { ...state, posts: action.payload, isLoading: false }
    
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload }
    
    case 'SET_TAGS':
      return { ...state, tags: action.payload }
    
    case 'SET_AUTHORS':
      return { ...state, authors: action.payload }
    
    case 'SET_CURRENT_POST':
      return { ...state, currentPost: action.payload }
    
    case 'SET_STATS':
      return { ...state, stats: action.payload }
    
    case 'ADD_POST':
      return { ...state, posts: [action.payload, ...state.posts] }
    
    case 'UPDATE_POST':
      return {
        ...state,
        posts: state.posts.map(post =>
          post.id === action.payload.id ? action.payload : post
        ),
        currentPost: state.currentPost?.id === action.payload.id ? action.payload : state.currentPost
      }
    
    case 'REMOVE_POST':
      return {
        ...state,
        posts: state.posts.filter(post => post.id !== action.payload),
        currentPost: state.currentPost?.id === action.payload ? null : state.currentPost
      }
    
    case 'ADD_CATEGORY':
      return { ...state, categories: [action.payload, ...state.categories] }
    
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(cat =>
          cat.id === action.payload.id ? action.payload : cat
        )
      }
    
    case 'REMOVE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(cat => cat.id !== action.payload)
      }
    
    case 'ADD_TAG':
      return { ...state, tags: [action.payload, ...state.tags] }
    
    case 'UPDATE_TAG':
      return {
        ...state,
        tags: state.tags.map(tag =>
          tag.id === action.payload.id ? action.payload : tag
        )
      }
    
    case 'REMOVE_TAG':
      return {
        ...state,
        tags: state.tags.filter(tag => tag.id !== action.payload)
      }
    
    default:
      return state
  }
}

function BlogProviderInner({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(blogReducer, initialState)
  const analytics = useAnalytics()

  // Posts
  const fetchPosts = async (filters?: BlogFilters) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const queryParams = new URLSearchParams()
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString())
          }
        })
      }

      const response = await fetch(`/api/blog/posts?${queryParams}`)
      if (!response.ok) throw new Error('Failed to fetch posts')
      
      const data = await response.json()
      dispatch({ type: 'SET_POSTS', payload: data.posts || [] })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to fetch posts' })
      analytics.trackAPIError('/api/blog/posts', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  const fetchPost = async (slug: string): Promise<BlogPost | null> => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const response = await fetch(`/api/blog/posts/${slug}`)
      if (!response.ok) {
        if (response.status === 404) return null
        throw new Error('Failed to fetch post')
      }
      
      const post = await response.json()
      dispatch({ type: 'SET_CURRENT_POST', payload: post })
      return post
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to fetch post' })
      analytics.trackAPIError(`/api/blog/posts/${slug}`, error instanceof Error ? error.message : 'Unknown error')
      return null
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const createPost = async (postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost> => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const response = await fetch('/api/blog/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      })
      
      if (!response.ok) throw new Error('Failed to create post')
      
      const post = await response.json()
      dispatch({ type: 'ADD_POST', payload: post })
      
      analytics.trackUserAction('form_submit', {
        element_type: 'blog_post_form',
        additional_data: {
          post_title: post.title,
          post_status: post.status,
          categories: post.categories.map((c: BlogCategory) => c.name).join(', ')
        }
      })
      
      return post
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to create post' })
      analytics.trackAPIError('/api/blog/posts', error instanceof Error ? error.message : 'Unknown error')
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const updatePost = async (id: string, updates: Partial<BlogPost>): Promise<BlogPost> => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const response = await fetch(`/api/blog/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      
      if (!response.ok) throw new Error('Failed to update post')
      
      const post = await response.json()
      dispatch({ type: 'UPDATE_POST', payload: post })
      
      analytics.trackUserAction('form_submit', {
        element_type: 'blog_post_edit_form',
        additional_data: {
          post_id: id,
          updated_fields: Object.keys(updates).join(', ')
        }
      })
      
      return post
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update post' })
      analytics.trackAPIError(`/api/blog/posts/${id}`, error instanceof Error ? error.message : 'Unknown error')
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const deletePost = async (id: string) => {
    try {
      const response = await fetch(`/api/blog/posts/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to delete post')
      
      dispatch({ type: 'REMOVE_POST', payload: id })
      
      analytics.trackUserAction('click', {
        element_type: 'delete_button',
        additional_data: {
          post_id: id,
          action: 'delete_post'
        }
      })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to delete post' })
      analytics.trackAPIError(`/api/blog/posts/${id}`, error instanceof Error ? error.message : 'Unknown error')
      throw error
    }
  }

  const publishPost = async (id: string) => {
    await updatePost(id, { status: 'published', publishedAt: new Date().toISOString() })
  }

  const schedulePost = async (id: string, scheduledAt: string) => {
    await updatePost(id, { status: 'scheduled', scheduledAt })
  }

  const toggleFeatured = async (id: string) => {
    const post = state.posts.find(p => p.id === id)
    if (post) {
      await updatePost(id, { featured: !post.featured })
    }
  }

  // Categories
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/blog/categories')
      if (!response.ok) throw new Error('Failed to fetch categories')
      
      const categories = await response.json()
      dispatch({ type: 'SET_CATEGORIES', payload: categories })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to fetch categories' })
    }
  }

  const createCategory = async (categoryData: Omit<BlogCategory, 'id'>): Promise<BlogCategory> => {
    try {
      const response = await fetch('/api/blog/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData)
      })
      
      if (!response.ok) throw new Error('Failed to create category')
      
      const category = await response.json()
      dispatch({ type: 'ADD_CATEGORY', payload: category })
      return category
    } catch (error) {
      analytics.trackAPIError('/api/blog/categories', error instanceof Error ? error.message : 'Unknown error')
      throw error
    }
  }

  const updateCategory = async (id: string, updates: Partial<BlogCategory>): Promise<BlogCategory> => {
    try {
      const response = await fetch(`/api/blog/categories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      
      if (!response.ok) throw new Error('Failed to update category')
      
      const category = await response.json()
      dispatch({ type: 'UPDATE_CATEGORY', payload: category })
      return category
    } catch (error) {
      analytics.trackAPIError(`/api/blog/categories/${id}`, error instanceof Error ? error.message : 'Unknown error')
      throw error
    }
  }

  const deleteCategory = async (id: string) => {
    try {
      const response = await fetch(`/api/blog/categories/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to delete category')
      
      dispatch({ type: 'REMOVE_CATEGORY', payload: id })
    } catch (error) {
      analytics.trackAPIError(`/api/blog/categories/${id}`, error instanceof Error ? error.message : 'Unknown error')
      throw error
    }
  }

  // Tags
  const fetchTags = async () => {
    try {
      const response = await fetch('/api/blog/tags')
      if (!response.ok) throw new Error('Failed to fetch tags')
      
      const tags = await response.json()
      dispatch({ type: 'SET_TAGS', payload: tags })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to fetch tags' })
    }
  }

  const createTag = async (tagData: Omit<BlogTag, 'id'>): Promise<BlogTag> => {
    try {
      const response = await fetch('/api/blog/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tagData)
      })
      
      if (!response.ok) throw new Error('Failed to create tag')
      
      const tag = await response.json()
      dispatch({ type: 'ADD_TAG', payload: tag })
      return tag
    } catch (error) {
      analytics.trackAPIError('/api/blog/tags', error instanceof Error ? error.message : 'Unknown error')
      throw error
    }
  }

  const updateTag = async (id: string, updates: Partial<BlogTag>): Promise<BlogTag> => {
    try {
      const response = await fetch(`/api/blog/tags/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      
      if (!response.ok) throw new Error('Failed to update tag')
      
      const tag = await response.json()
      dispatch({ type: 'UPDATE_TAG', payload: tag })
      return tag
    } catch (error) {
      analytics.trackAPIError(`/api/blog/tags/${id}`, error instanceof Error ? error.message : 'Unknown error')
      throw error
    }
  }

  const deleteTag = async (id: string) => {
    try {
      const response = await fetch(`/api/blog/tags/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to delete tag')
      
      dispatch({ type: 'REMOVE_TAG', payload: id })
    } catch (error) {
      analytics.trackAPIError(`/api/blog/tags/${id}`, error instanceof Error ? error.message : 'Unknown error')
      throw error
    }
  }

  // Comments
  const fetchComments = async (postId: string): Promise<BlogComment[]> => {
    try {
      const response = await fetch(`/api/blog/posts/${postId}/comments`)
      if (!response.ok) throw new Error('Failed to fetch comments')
      
      return await response.json()
    } catch (error) {
      analytics.trackAPIError(`/api/blog/posts/${postId}/comments`, error instanceof Error ? error.message : 'Unknown error')
      return []
    }
  }

  const addComment = async (commentData: Omit<BlogComment, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogComment> => {
    try {
      const response = await fetch(`/api/blog/posts/${commentData.postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentData)
      })
      
      if (!response.ok) throw new Error('Failed to add comment')
      
      const comment = await response.json()
      
      analytics.trackUserAction('form_submit', {
        element_type: 'comment_form',
        additional_data: {
          post_id: commentData.postId,
          is_reply: !!commentData.parentId
        }
      })
      
      return comment
    } catch (error) {
      analytics.trackAPIError(`/api/blog/posts/${commentData.postId}/comments`, error instanceof Error ? error.message : 'Unknown error')
      throw error
    }
  }

  const moderateComment = async (id: string, status: BlogComment['status']) => {
    try {
      const response = await fetch(`/api/blog/comments/${id}/moderate`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      
      if (!response.ok) throw new Error('Failed to moderate comment')
      
      analytics.trackUserAction('click', {
        element_type: 'moderate_button',
        additional_data: {
          comment_id: id,
          new_status: status
        }
      })
    } catch (error) {
      analytics.trackAPIError(`/api/blog/comments/${id}/moderate`, error instanceof Error ? error.message : 'Unknown error')
      throw error
    }
  }

  const deleteComment = async (id: string) => {
    try {
      const response = await fetch(`/api/blog/comments/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to delete comment')
      
      analytics.trackUserAction('click', {
        element_type: 'delete_button',
        additional_data: {
          comment_id: id,
          action: 'delete_comment'
        }
      })
    } catch (error) {
      analytics.trackAPIError(`/api/blog/comments/${id}`, error instanceof Error ? error.message : 'Unknown error')
      throw error
    }
  }

  // Analytics
  const incrementViewCount = async (postId: string) => {
    try {
      await fetch(`/api/blog/posts/${postId}/view`, {
        method: 'POST'
      })
      
      analytics.trackEngagement('time_on_page', {
        value: 1
      })
    } catch {
      // Silently fail for view tracking
    }
  }

  const toggleLike = async (postId: string) => {
    try {
      const response = await fetch(`/api/blog/posts/${postId}/like`, {
        method: 'POST'
      })
      
      if (!response.ok) throw new Error('Failed to toggle like')
      
      analytics.trackUserAction('click', {
        element_type: 'like_button',
        additional_data: {
          post_id: postId
        }
      })
    } catch (error) {
      analytics.trackAPIError(`/api/blog/posts/${postId}/like`, error instanceof Error ? error.message : 'Unknown error')
      throw error
    }
  }

  // Stats
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/blog/stats')
      if (!response.ok) throw new Error('Failed to fetch stats')
      
      const stats = await response.json()
      dispatch({ type: 'SET_STATS', payload: stats })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to fetch stats' })
    }
  }

  const value: BlogContextType = {
    ...state,
    fetchPosts,
    fetchPost,
    createPost,
    updatePost,
    deletePost,
    publishPost,
    schedulePost,
    toggleFeatured,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    fetchTags,
    createTag,
    updateTag,
    deleteTag,
    fetchComments,
    addComment,
    moderateComment,
    deleteComment,
    incrementViewCount,
    toggleLike,
    fetchStats,
  }

  return (
    <BlogContext.Provider value={value}>
      {children}
    </BlogContext.Provider>
  )
}

export function BlogProvider({ children }: { children: ReactNode }) {
  return <BlogProviderInner>{children}</BlogProviderInner>
}

export function useBlog() {
  const context = useContext(BlogContext)
  if (context === undefined) {
    throw new Error('useBlog must be used within a BlogProvider')
  }
  return context
}