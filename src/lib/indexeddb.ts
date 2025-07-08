interface DBSchema {
  cart: {
    key: string
    value: {
      id: string
      productId: string
      name: string
      price: number
      quantity: number
      image: string
      variant?: {
        size?: string
        flavor?: string
      }
      timestamp: number
    }
  }
  orders: {
    key: string
    value: {
      id: string
      orderNumber: string
      status: string
      items: any[]
      total: number
      createdAt: string
      timestamp: number
    }
  }
  products: {
    key: string
    value: {
      id: string
      name: string
      description: string
      price: number
      image: string
      category: any
      inStock: boolean
      timestamp: number
    }
  }
  sync_queue: {
    key: string
    value: {
      id: string
      type: 'cart_update' | 'order_create' | 'user_action'
      data: any
      timestamp: number
      attempts: number
      lastAttempt?: number
    }
  }
  user_preferences: {
    key: string
    value: {
      key: string
      value: any
      timestamp: number
    }
  }
}

class IndexedDBManager {
  private dbName = 'TishyaFoodsDB'
  private version = 2
  private db: IDBDatabase | null = null

  async init(): Promise<IDBDatabase> {
    if (this.db) return this.db

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve(this.db)
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        if (!db.objectStoreNames.contains('cart')) {
          const cartStore = db.createObjectStore('cart', { keyPath: 'id' })
          cartStore.createIndex('productId', 'productId')
          cartStore.createIndex('timestamp', 'timestamp')
        }

        if (!db.objectStoreNames.contains('orders')) {
          const ordersStore = db.createObjectStore('orders', { keyPath: 'id' })
          ordersStore.createIndex('status', 'status')
          ordersStore.createIndex('timestamp', 'timestamp')
        }

        if (!db.objectStoreNames.contains('products')) {
          const productsStore = db.createObjectStore('products', { keyPath: 'id' })
          productsStore.createIndex('category', 'category.name')
          productsStore.createIndex('timestamp', 'timestamp')
        }

        if (!db.objectStoreNames.contains('sync_queue')) {
          const syncStore = db.createObjectStore('sync_queue', { keyPath: 'id' })
          syncStore.createIndex('type', 'type')
          syncStore.createIndex('timestamp', 'timestamp')
          syncStore.createIndex('attempts', 'attempts')
        }

        if (!db.objectStoreNames.contains('user_preferences')) {
          const prefsStore = db.createObjectStore('user_preferences', { keyPath: 'key' })
          prefsStore.createIndex('timestamp', 'timestamp')
        }
      }
    })
  }

  async getStore(storeName: keyof DBSchema, mode: IDBTransactionMode = 'readonly') {
    const db = await this.init()
    const transaction = db.transaction([storeName], mode)
    return transaction.objectStore(storeName)
  }

  async get<T extends keyof DBSchema>(
    storeName: T,
    key: string
  ): Promise<DBSchema[T]['value'] | undefined> {
    try {
      const store = await this.getStore(storeName)
      return new Promise((resolve, reject) => {
        const request = store.get(key)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error(`Error getting from ${storeName}:`, error)
      return undefined
    }
  }

  async set<T extends keyof DBSchema>(
    storeName: T,
    value: DBSchema[T]['value']
  ): Promise<boolean> {
    try {
      const store = await this.getStore(storeName, 'readwrite')
      return new Promise((resolve, reject) => {
        const request = store.put(value)
        request.onsuccess = () => resolve(true)
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error(`Error setting in ${storeName}:`, error)
      return false
    }
  }

  async delete<T extends keyof DBSchema>(
    storeName: T,
    key: string
  ): Promise<boolean> {
    try {
      const store = await this.getStore(storeName, 'readwrite')
      return new Promise((resolve, reject) => {
        const request = store.delete(key)
        request.onsuccess = () => resolve(true)
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error(`Error deleting from ${storeName}:`, error)
      return false
    }
  }

  async getAll<T extends keyof DBSchema>(
    storeName: T,
    limit?: number
  ): Promise<DBSchema[T]['value'][]> {
    try {
      const store = await this.getStore(storeName)
      return new Promise((resolve, reject) => {
        const request = limit ? store.getAll(undefined, limit) : store.getAll()
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error(`Error getting all from ${storeName}:`, error)
      return []
    }
  }

  async clear<T extends keyof DBSchema>(storeName: T): Promise<boolean> {
    try {
      const store = await this.getStore(storeName, 'readwrite')
      return new Promise((resolve, reject) => {
        const request = store.clear()
        request.onsuccess = () => resolve(true)
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error(`Error clearing ${storeName}:`, error)
      return false
    }
  }

  async getByIndex<T extends keyof DBSchema>(
    storeName: T,
    indexName: string,
    value: any
  ): Promise<DBSchema[T]['value'][]> {
    try {
      const store = await this.getStore(storeName)
      const index = store.index(indexName)
      return new Promise((resolve, reject) => {
        const request = index.getAll(value)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error(`Error getting by index from ${storeName}:`, error)
      return []
    }
  }

  async count<T extends keyof DBSchema>(storeName: T): Promise<number> {
    try {
      const store = await this.getStore(storeName)
      return new Promise((resolve, reject) => {
        const request = store.count()
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error(`Error counting ${storeName}:`, error)
      return 0
    }
  }

  async addToSyncQueue(type: 'cart_update' | 'order_create' | 'user_action', data: any): Promise<boolean> {
    const queueItem = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      data,
      timestamp: Date.now(),
      attempts: 0
    }
    return this.set('sync_queue', queueItem)
  }

  async processSyncQueue(): Promise<void> {
    try {
      const queueItems = await this.getAll('sync_queue')
      const pendingItems = queueItems
        .filter(item => item.attempts < 3)
        .sort((a, b) => a.timestamp - b.timestamp)

      for (const item of pendingItems) {
        try {
          await this.processSyncItem(item)
          await this.delete('sync_queue', item.id)
        } catch (error) {
          console.error('Failed to sync item:', error)
          
          item.attempts++
          item.lastAttempt = Date.now()
          
          if (item.attempts >= 3) {
            console.warn(`Sync item ${item.id} failed after 3 attempts, removing from queue`)
            await this.delete('sync_queue', item.id)
          } else {
            await this.set('sync_queue', item)
          }
        }
      }
    } catch (error) {
      console.error('Error processing sync queue:', error)
    }
  }

  private async processSyncItem(item: any): Promise<void> {
    switch (item.type) {
      case 'cart_update':
        await fetch('/api/cart/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.data)
        })
        break
      
      case 'order_create':
        await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.data)
        })
        break
      
      case 'user_action':
        await fetch('/api/analytics/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.data)
        })
        break
      
      default:
        throw new Error(`Unknown sync type: ${item.type}`)
    }
  }

  async getOfflineStats() {
    try {
      const [cartCount, productsCount, ordersCount] = await Promise.all([
        this.count('cart'),
        this.count('products'),
        this.count('orders')
      ])

      const lastSync = await this.get('user_preferences', 'lastSync')

      return {
        cartItems: cartCount,
        favorites: productsCount,
        recentProducts: productsCount,
        lastSync: lastSync?.value || null
      }
    } catch (error) {
      console.error('Error getting offline stats:', error)
      return {
        cartItems: 0,
        favorites: 0,
        recentProducts: 0,
        lastSync: null
      }
    }
  }

  async updateLastSync(): Promise<void> {
    await this.set('user_preferences', {
      key: 'lastSync',
      value: new Date().toISOString(),
      timestamp: Date.now()
    })
  }

  async cleanup(): Promise<void> {
    try {
      const cutoffTime = Date.now() - (7 * 24 * 60 * 60 * 1000) // 7 days

      const stores: (keyof DBSchema)[] = ['cart', 'orders', 'products', 'sync_queue', 'user_preferences']
      
      for (const storeName of stores) {
        const items = await this.getAll(storeName)
        for (const item of items) {
          if (item.timestamp < cutoffTime) {
            await this.delete(storeName, item.id || item.key)
          }
        }
      }
    } catch (error) {
      console.error('Error during cleanup:', error)
    }
  }
}

export const indexedDB = new IndexedDBManager()

export const initializeOfflineData = async () => {
  try {
    await indexedDB.init()
    console.log('IndexedDB initialized successfully')
  } catch (error) {
    console.error('Failed to initialize IndexedDB:', error)
  }
}

export const syncOfflineData = async () => {
  try {
    if (navigator.onLine) {
      await indexedDB.processSyncQueue()
      await indexedDB.updateLastSync()
      console.log('Offline data synced successfully')
    }
  } catch (error) {
    console.error('Failed to sync offline data:', error)
  }
}

export const getOfflineStats = () => indexedDB.getOfflineStats()

export default indexedDB