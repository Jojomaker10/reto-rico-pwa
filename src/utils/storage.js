// Secure storage using window.storage (IndexedDB for PWA)
// NO localStorage - PWA compatible storage

const DB_NAME = 'reto-rico-storage'
const DB_VERSION = 1
const STORE_NAME = 'auth-store'

class SecureStorage {
  constructor() {
    this.db = null
    this.initPromise = null
  }

  async init() {
    if (this.initPromise) return this.initPromise
    
    this.initPromise = new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        reject(new Error('IndexedDB not supported'))
        return
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve(this.db)
      }

      request.onupgradeneeded = (event) => {
        const db = event.target.result
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME)
        }
      }
    })

    return this.initPromise
  }

  async setItem(key, value) {
    await this.init()
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.put(value, key)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async getItem(key) {
    await this.init()
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.get(key)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  }

  async removeItem(key) {
    await this.init()
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.delete(key)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async clear() {
    await this.init()
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.clear()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }
}

// Create singleton instance
const secureStorage = new SecureStorage()

export default secureStorage

