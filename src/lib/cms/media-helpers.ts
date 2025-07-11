import { db } from '@/lib/db'

// Default media folders
export const FOLDERS = [
  { id: 'products', name: 'Products', path: '/products' },
  { id: 'blog', name: 'Blog', path: '/blog' },
  { id: 'general', name: 'General', path: '/general' }
]

// Media statistics structure
export const STATS = {
  totalFiles: 0,
  totalSize: 0,
  typeBreakdown: [],
  recentUploads: []
}

// Helper function to get media folder structure
export async function getMediaFolders() {
  // Get unique media folders from existing media files
  const folderStats = await db.media.groupBy({
    by: ['mediaFolder'],
    where: { 
      status: 'ACTIVE',
      mediaFolder: { not: null }
    },
    _count: { id: true }
  })

  // Combine with default folders
  const defaultFolders = FOLDERS.map(folder => ({
    id: folder.id,
    name: folder.name,
    path: folder.path,
    parentId: null,
    mediaCount: folderStats.find(stat => stat.mediaFolder === folder.path)?._count.id || 0
  }))

  return defaultFolders
}

// Helper function to get media stats
export async function getMediaStats() {
  const stats = await db.media.aggregate({
    where: { status: 'ACTIVE' },
    _count: { id: true },
    _sum: { size: true }
  })

  const typeStats = await db.media.groupBy({
    by: ['mimeType'],
    where: { status: 'ACTIVE' },
    _count: { id: true },
    _sum: { size: true }
  })

  const recentMedia = await db.media.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: {
      id: true,
      filename: true,
      mimeType: true,
      size: true,
      createdAt: true
    }
  })

  return {
    totalFiles: stats._count.id || 0,
    totalSize: stats._sum.size || 0,
    typeBreakdown: typeStats.map(stat => ({
      type: stat.mimeType,
      count: stat._count.id,
      size: stat._sum.size || 0
    })),
    recentUploads: recentMedia
  }
}