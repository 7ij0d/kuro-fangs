---
name: pwa-offline-studio
description: >-
  Production service worker strategies, IndexedDB multi-gigabyte document storage,
  cache invalidation, offline-first study mode, and iOS/Android home-screen installability.
---

# PWA & Offline Document Studio Skill

This skill provides the architectural foundation for turning Kuro Fangs into a high-performance offline Progressive Web Application (PWA), allowing dental students to study and annotate sheets anywhere, even without an internet connection.

---

## 1. Service Worker Architecture (`sw.js`)

### Cache Strategies by Asset Type
1. **Core App Shell (HTML, CSS, JS):** Stale-While-Revalidate with versioned cache name (`kf-shell-v1`).
2. **Metadata Catalogs (`data/*.json`):** Network-First with cache fallback to ensure newly added sheets appear promptly.
3. **PDF Documents & Blobs:** Cache-First or IndexedDB blob store.

```javascript
const CACHE_NAME = 'kuro-fangs-shell-v2';
const APP_SHELL = [
  '/',
  '/index.html',
  '/css/main.css',
  '/css/components.css',
  '/css/responsive.css',
  '/js/app.js',
  '/js/data.js',
  '/js/i18n.js',
  '/js/components/document-viewer.js',
  '/js/components/toast.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Stale-While-Revalidate for app assets
  if (url.origin === location.origin && !url.pathname.startsWith('/api/')) {
    e.respondWith(
      caches.match(e.request).then((cached) => {
        const networked = fetch(e.request)
          .then((response) => {
            if (response.status === 200) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
            }
            return response;
          })
          .catch(() => cached);
        return cached || networked;
      })
    );
  }
});
```

---

## 2. IndexedDB Multi-Gigabyte PDF Store (`kf_pdf_store`)

To store 100+ megabytes of dental lecture slide PDFs without quota errors:

```javascript
class LocalPdfStore {
  constructor(dbName = 'kf_pdf_database', storeName = 'pdf_blobs') {
    this.dbName = dbName;
    this.storeName = storeName;
    this.db = null;
  }

  async init() {
    if (this.db) return this.db;
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this.dbName, 1);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
      req.onsuccess = () => {
        this.db = req.result;
        resolve(this.db);
      };
      req.onerror = () => reject(req.error);
    });
  }

  async savePdf(id, arrayBufferOrBlob) {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      const req = store.put(arrayBufferOrBlob, id);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  }

  async getPdfUrl(id) {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      const req = store.get(id);
      req.onsuccess = () => {
        if (!req.result) return resolve(null);
        const blob = req.result instanceof Blob ? req.result : new Blob([req.result], { type: 'application/pdf' });
        resolve(URL.createObjectURL(blob));
      };
      req.onerror = () => reject(req.error);
    });
  }
}
```

---

## 3. iOS & Android Home-Screen Install Prompt

```javascript
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showPwaInstallBanner();
});

function triggerInstall() {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then((choice) => {
    if (choice.outcome === 'accepted') {
      console.log('User accepted PWA installation');
    }
    deferredPrompt = null;
  });
}
```
