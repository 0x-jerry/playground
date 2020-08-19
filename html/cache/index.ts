export interface UCacheConfig {
  type?: CacheType
  expireTime?: number
}

interface UCacheDataConfig {
  expireTime?: number
}

interface UCacheData<T = any> extends UCacheDataConfig {
  ts: number
  data: T
}

export interface DatabaseAdapter {
  get(key: string): UCacheData
  set(key: string, value: UCacheData): void
  clear(): void
  remove(key: string): void
}

enum CacheType {
  MEMORY = 'memory',
  STORAGE = 'storage'
}

const empty = (): any => {}

const emptyAdapter: DatabaseAdapter = {
  get: empty,
  set: empty,
  clear: empty,
  remove: empty
}

const localStorageAdapter: DatabaseAdapter = {
  get(key: string) {
    const str = localStorage.getItem(key)
    return JSON.parse(str)
  },
  set(key, value) {
    const str = JSON.stringify(value)
    localStorage.setItem(key, str)
  },
  clear() {
    localStorage.clear()
  },
  remove(key) {
    localStorage.removeItem(key)
  }
}

class UCache {
  static uniq(name: string) {
    const uid = Math.random().toString(16).substr(2, 8)
    return `${name}:${uid}`
  }

  opt: UCacheConfig

  runtimeDB: Map<string, UCacheData>
  db: DatabaseAdapter

  constructor(opt: UCacheConfig) {
    this.opt = Object.assign({ type: CacheType.MEMORY }, opt)

    this.db = this.getDBInstance()

    this.runtimeDB = new Map()
  }

  private getDBInstance(): DatabaseAdapter {
    const type = this.opt.type

    if (type === CacheType.STORAGE) {
      return localStorageAdapter
    }

    return emptyAdapter
  }

  private toData<T>(data: T, opt: UCacheDataConfig = {}): UCacheData<T> {
    return {
      ...opt,
      ts: new Date().getTime(),
      data
    }
  }

  get<T = any>(key: string): T | undefined {
    const exist = this.runtimeDB.has(key)
    const data: UCacheData = exist ? this.runtimeDB.get(key) : this.db.get(key)
    const now = new Date().getTime()

    if (!data) {
      return
    }

    const expireTime = data.expireTime || this.opt.expireTime || 0

    if (expireTime) {
      const expired = now - data.ts > expireTime
      if (expired) {
        return
      }
    }

    return data.data
  }

  set(key: string, value: any) {
    const data = this.toData(value)
    this.runtimeDB.set(key, data)
    this.db.set(key, data)
  }

  remove(key: string) {
    this.runtimeDB.delete(key)
    this.db.remove(key)
  }

  clear() {
    this.runtimeDB.clear()
    this.db.clear()
  }
}

window.addEventListener('load', () => {
  const cache = new UCache({ type: CacheType.MEMORY })
  const uniqKey = UCache.uniq('uniq')

  console.log(cache)
  console.log(uniqKey, 'is', cache.get(uniqKey))
  cache.set(uniqKey, 123)
  console.log(uniqKey, 'is', cache.get(uniqKey))

  const cache2 = new UCache({ type: CacheType.STORAGE })
  const uniqKey1 = 'uniq'

  console.log(cache2)
  console.log(uniqKey1, 'is', cache2.get(uniqKey1))
  cache2.set(uniqKey1, 123)
  console.log(uniqKey1, 'is', cache2.get(uniqKey1))
})
