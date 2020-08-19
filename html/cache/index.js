var CacheType;
(function (CacheType) {
    CacheType["MEMORY"] = "memory";
    CacheType["STORAGE"] = "storage";
})(CacheType || (CacheType = {}));
const empty = () => { };
const emptyAdapter = {
    get: empty,
    set: empty,
    clear: empty,
    remove: empty
};
const localStorageAdapter = {
    get(key) {
        const str = localStorage.getItem(key);
        return JSON.parse(str);
    },
    set(key, value) {
        const str = JSON.stringify(value);
        localStorage.setItem(key, str);
    },
    clear() {
        localStorage.clear();
    },
    remove(key) {
        localStorage.removeItem(key);
    }
};
class UCache {
    constructor(opt) {
        this.opt = Object.assign({ type: CacheType.MEMORY }, opt);
        this.db = this.getDBInstance();
        this.runtimeDB = new Map();
    }
    static uniq(name) {
        const uid = Math.random().toString(16).substr(2, 8);
        return `${name}:${uid}`;
    }
    getDBInstance() {
        const type = this.opt.type;
        if (type === CacheType.STORAGE) {
            return localStorageAdapter;
        }
        return emptyAdapter;
    }
    toData(data, opt = {}) {
        return Object.assign(Object.assign({}, opt), { ts: new Date().getTime(), data });
    }
    get(key) {
        const exist = this.runtimeDB.has(key);
        const data = exist ? this.runtimeDB.get(key) : this.db.get(key);
        const now = new Date().getTime();
        if (!data) {
            return;
        }
        const expireTime = data.expireTime || this.opt.expireTime || 0;
        if (expireTime) {
            const expired = now - data.ts > expireTime;
            if (expired) {
                return;
            }
        }
        return data.data;
    }
    set(key, value) {
        const data = this.toData(value);
        this.runtimeDB.set(key, data);
        this.db.set(key, data);
    }
    remove(key) {
        this.runtimeDB.delete(key);
        this.db.remove(key);
    }
    clear() {
        this.runtimeDB.clear();
        this.db.clear();
    }
}
window.addEventListener('load', () => {
    const cache = new UCache({ type: CacheType.MEMORY });
    const uniqKey = UCache.uniq('uniq');
    console.log(cache);
    console.log(uniqKey, 'is', cache.get(uniqKey));
    cache.set(uniqKey, 123);
    console.log(uniqKey, 'is', cache.get(uniqKey));
    const cache2 = new UCache({ type: CacheType.STORAGE });
    const uniqKey1 = 'uniq';
    console.log(cache2);
    console.log(uniqKey1, 'is', cache2.get(uniqKey1));
    cache2.set(uniqKey1, 123);
    console.log(uniqKey1, 'is', cache2.get(uniqKey1));
});
export {};
