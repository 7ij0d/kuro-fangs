/**
 * KURO FANGS — PERSONAL STUDY LIBRARY (Library / المكتبة الدراسية)
 * Minimalist Modern UI matching the KURO FANGS Burgundy & Warm Cream Design System
 * - Real Folders Grid with 3-dots menu, drag-and-drop reorder, and file drop targets
 * - Recent Files (last 3 opened files with "View All ->" toggle) & real Page 1 PDF thumbnails
 * - Full CRUD: Create/Rename/Delete Folders, Import PDFs & Images, Move/Rename/Delete Files
 * - Grid View & List View switcher + live instant search
 */

window.SheetsPage = {
  currentFolderId: null, // null = Root Library
  searchQuery: '',
  viewMode: 'grid', // 'grid' | 'list'
  showAllFiles: false, // false = show last 3 in Recent Files; true = show all
  isUploading: false,
  uploadStatusText: '',
  draggedItem: null, // { type: 'folder' | 'file', id: string }
  openMenuId: null, // currently open 3-dots menu id
  _thumbQueueRunning: false,

  async render(containerOrParams = {}, maybeParams = {}) {
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;
    const isDomEl = Boolean(containerOrParams && containerOrParams.nodeType === 1);
    const container = isDomEl
      ? containerOrParams
      : (document.getElementById('app') || document.getElementById('main-content') || document.querySelector('.main-content'));
    if (!container) return;

    const rawParams = isDomEl ? (maybeParams || {}) : (containerOrParams || {});
    const folderParam = typeof rawParams.get === 'function' ? rawParams.get('folder') : rawParams.folder;
    if (folderParam !== undefined && folderParam !== null) {
      this.currentFolderId = folderParam || null;
    }

    // Verify currentFolderId still exists
    if (this.currentFolderId && window.PersonalLibrary && !window.PersonalLibrary.getFolderById(this.currentFolderId)) {
      this.currentFolderId = null;
    }

    this.injectStyles();
    this.renderWorkspace(container, isAr);
  },

  formatFileTimestamp(file, isAr) {
    const raw = file.lastOpenedAt || file.updatedAt || file.createdAt || file.date;
    if (!raw) return isAr ? 'اليوم' : 'Today';
    const d = new Date(raw);
    if (isNaN(d.getTime())) return String(raw);

    const now = new Date();
    const isSameDay = (a, b) =>
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    const timeStr = d.toLocaleTimeString(isAr ? 'ar-EG' : 'en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    if (isSameDay(d, now)) {
      return isAr ? `اليوم، ${timeStr}` : `Today, ${timeStr}`;
    }
    if (isSameDay(d, yesterday)) {
      return isAr ? `أمس، ${timeStr}` : `Yesterday, ${timeStr}`;
    }

    const dateStr = d.toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
      month: 'short',
      day: 'numeric'
    });
    return `${dateStr}, ${timeStr}`;
  },

  formatDisplayFileName(file) {
    const rawTitle = String(file.title || file.name || 'Document').trim();
    const isImage = file.fileKind === 'image';
    if (isImage) return rawTitle;
    if (/\.pdf$/i.test(rawTitle)) return rawTitle;
    return `${rawTitle}.pdf`;
  },

  getFolderSvg(colorHex = '#8B1D2C', fillLight = '#F2DCE0', fillFront = '#F6E5E8', width = 40, height = 32) {
    return `
      <svg width="${width}" height="${height}" viewBox="0 0 46 38" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M3 9C3 6.79086 4.79086 5 7 5H17.3431C18.404 5 19.4214 5.42143 20.1716 6.17157L22.8284 8.82843C23.5786 9.57857 24.596 10 25.6569 10H39C41.2091 10 43 11.7909 43 14V31C43 33.2091 41.2091 35 39 35H7C4.79086 35 3 33.2091 3 31V9Z" fill="${fillLight}" stroke="${colorHex}" stroke-width="2.2" stroke-linejoin="round"/>
        <path d="M3 14.5H43V31C43 33.2091 41.2091 35 39 35H7C4.79086 35 3 33.2091 3 31V14.5Z" fill="${fillFront}" stroke="${colorHex}" stroke-width="2.2" stroke-linejoin="round"/>
      </svg>
    `;
  },

  renderWorkspace(container, isAr) {
    const lib = window.PersonalLibrary;
    if (!lib) {
      container.innerHTML = `<div style="padding:48px;text-align:center;">Loading Library...</div>`;
      return;
    }

    const isSearching = this.searchQuery.trim().length > 0;
    const breadcrumbs = this.currentFolderId ? lib.getFolderBreadcrumbs(this.currentFolderId) : [];
    const currentFolder = this.currentFolderId ? lib.getFolderById(this.currentFolderId) : null;

    let folders = [];
    let filesToDisplay = [];
    let totalFilesInView = 0;

    if (isSearching) {
      const res = lib.searchLibrary(this.searchQuery);
      folders = res.folders;
      filesToDisplay = res.files;
      totalFilesInView = res.files.length;
    } else if (currentFolder) {
      folders = lib.getFoldersByParent(this.currentFolderId);
      const folderFiles = lib.getFilesByFolder(this.currentFolderId);
      filesToDisplay = folderFiles;
      totalFilesInView = folderFiles.length;
    } else {
      // Root Library: Show Root Folders + Recent Files (or All Files if View All is active)
      folders = lib.getFoldersByParent(null);
      const allFiles = lib.getAllFiles().slice().sort((a, b) => {
        const tA = new Date(a.lastOpenedAt || a.updatedAt || a.createdAt || 0).getTime();
        const tB = new Date(b.lastOpenedAt || b.updatedAt || b.createdAt || 0).getTime();
        return tB - tA;
      });
      totalFilesInView = allFiles.length;
      filesToDisplay = this.showAllFiles ? allFiles : allFiles.slice(0, 3);
    }

    container.innerHTML = `
      <div class="lib-page-shell" id="psl-dropzone-root" dir="${isAr ? 'rtl' : 'ltr'}">
        
        <!-- OS File Drag & Drop Overlay -->
        <div class="lib-os-drop-overlay" id="psl-os-drop-overlay">
          <div class="lib-os-drop-box">
            <div class="lib-os-drop-icon">
              ${this.getFolderSvg('#8B1D2C', '#F2DCE0', '#F6E5E8', 52, 42)}
            </div>
            <h3>${isAr ? 'أفلت الملفات هنا لإضافتها إلى مكتبتك' : 'Drop files here to import into your library'}</h3>
            <p>${currentFolder
              ? (isAr ? `سيتم حفظ الملفات داخل "${this.escapeHtml(currentFolder.name)}"` : `Files will be imported into "${this.escapeHtml(currentFolder.name)}"`)
              : (isAr ? 'يدعم ملفات PDF والصور (يمكنك رفع عدة ملفات دفعة واحدة)' : 'Supports PDF and images (Multi-file upload supported)')
            }</p>
          </div>
        </div>

        <!-- 1. LIBRARY HEADER (Directly on page background — No heavy wrapper box) -->
        <header class="lib-page-header">
          <div class="lib-header-left">
            <div class="lib-header-icon-wrap">
              ${this.getFolderSvg('#8B1D2C', '#F2DCE0', '#F6E5E8', 46, 38)}
            </div>
            <div class="lib-header-titles">
              ${currentFolder ? `
                <nav class="lib-breadcrumbs" aria-label="Breadcrumb">
                  <button type="button" class="lib-crumb-link" data-crumb-folder="">
                    ${isAr ? 'المكتبة' : 'Library'}
                  </button>
                  ${breadcrumbs.map((b, idx) => `
                    <span class="lib-crumb-sep">/</span>
                    <button type="button" class="lib-crumb-link ${idx === breadcrumbs.length - 1 ? 'current' : ''}" data-crumb-folder="${b.id}">
                      ${this.escapeHtml(b.name)}
                    </button>
                  `).join('')}
                </nav>
              ` : ''}
              <h1 class="lib-main-title">
                ${currentFolder ? this.escapeHtml(currentFolder.name) : (isAr ? 'المكتبة' : 'Library')}
              </h1>
              <p class="lib-main-subtitle">
                ${currentFolder
                  ? (isAr ? 'ملفاتك ومجلداتك الفرعية في هذا المجلد.' : 'Your study files in this folder.')
                  : (isAr ? 'ملفاتك الدراسية في مكان واحد.' : 'Your study files in one place.')
                }
              </p>
            </div>
          </div>

          <div class="lib-header-actions">
            <button type="button" class="lib-btn lib-btn-new-folder" id="psl-btn-new-folder">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              <span>${isAr ? 'مجلد جديد' : 'New Folder'}</span>
            </button>

            <button type="button" class="lib-btn lib-btn-import" id="psl-btn-import-files">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <span>${isAr ? 'استيراد ملفات' : 'Import Files'}</span>
            </button>
            <input type="file" id="psl-file-input" multiple accept=".pdf,application/pdf,image/png,image/jpeg,image/webp,image/gif,image/svg+xml" style="display:none;" />
          </div>
        </header>

        <!-- Upload Progress Banner -->
        ${this.isUploading ? `
          <div class="lib-upload-banner">
            <div class="lib-spinner"></div>
            <span>${this.escapeHtml(this.uploadStatusText || (isAr ? 'جاري استيراد الملفات...' : 'Importing files...'))}</span>
          </div>
        ` : ''}

        <!-- 2. SEARCH BAR & VIEW SWITCHER CONTAINER -->
        <div class="lib-search-container">
          <div class="lib-search-field-wrap">
            <svg class="lib-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              type="search"
              id="psl-search-input"
              class="lib-search-input"
              value="${this.escapeHtml(this.searchQuery)}"
              placeholder="${isAr ? 'ابحث في الملفات أو المجلدات...' : 'Search files or folders...'}"
              autocomplete="off"
            />
            ${this.searchQuery ? `
              <button type="button" id="psl-search-clear" class="lib-search-clear" title="${isAr ? 'مسح' : 'Clear'}">✕</button>
            ` : ''}
          </div>

          <div class="lib-view-toggle" role="group" aria-label="View Mode">
            <button type="button" class="lib-view-btn ${this.viewMode === 'grid' ? 'active' : ''}" data-view="grid" title="${isAr ? 'عرض شبكي' : 'Grid View'}" aria-label="Grid View">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>
            </button>
            <button type="button" class="lib-view-btn ${this.viewMode === 'list' ? 'active' : ''}" data-view="list" title="${isAr ? 'عرض قائمة' : 'List View'}" aria-label="List View">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            </button>
          </div>
        </div>

        <!-- 3. FOLDERS SECTION -->
        ${(!currentFolder || folders.length > 0) ? `
          <section class="lib-section">
            <div class="lib-section-header">
              <h2 class="lib-section-title">
                ${currentFolder && !isSearching
                  ? (isAr ? 'المجلدات الفرعية' : 'Subfolders')
                  : (isAr ? 'المجلدات' : 'Folders')
                }
                <span class="lib-section-count">(${folders.length})</span>
              </h2>
            </div>

            ${folders.length === 0 ? `
              <div class="lib-empty-inline-card" id="psl-empty-btn-folder">
                <div class="lib-empty-inline-icon">
                  ${this.getFolderSvg('#8B1D2C', '#F2DCE0', '#F6E5E8', 34, 28)}
                </div>
                <div class="lib-empty-inline-text">
                  <strong>${isAr ? 'لا توجد مجلدات بعد' : 'No folders yet'}</strong>
                  <span>${isAr ? 'اضغط هنا لإنشاء أول مجلد دراسي لك وتنظيم ملفاتك.' : 'Click here to create your first study folder and organize your files.'}</span>
                </div>
              </div>
            ` : `
              <div class="lib-folders-grid ${this.viewMode === 'list' ? 'list-mode' : ''}" id="psl-folders-grid">
                ${folders.map(folder => this.renderFolderCard(folder, lib, isAr)).join('')}
              </div>
            `}
          </section>
        ` : ''}

        <!-- 4. RECENT FILES / FOLDER FILES SECTION -->
        <section class="lib-section">
          <div class="lib-section-header">
            <h2 class="lib-section-title">
              ${isSearching
                ? `${isAr ? 'نتائج الملفات' : 'Matching Files'} <span class="lib-section-count">(${filesToDisplay.length})</span>`
                : currentFolder
                  ? `${isAr ? 'الملفات' : 'Files'} <span class="lib-section-count">(${filesToDisplay.length})</span>`
                  : (this.showAllFiles
                      ? `${isAr ? 'جميع الملفات' : 'All Files'} <span class="lib-section-count">(${totalFilesInView})</span>`
                      : (isAr ? 'الملفات الأخيرة' : 'Recent Files'))
              }
            </h2>

            ${(!currentFolder && !isSearching && totalFilesInView > 0) ? `
              <button type="button" class="lib-view-all-btn" id="psl-toggle-view-all">
                <span>${this.showAllFiles ? (isAr ? 'عرض الأحدث فقط' : 'Show Recent') : (isAr ? 'عرض الكل' : 'View All')}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="${isAr ? 'transform:scaleX(-1);' : ''}"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
            ` : ''}
          </div>

          ${filesToDisplay.length === 0 ? `
            <div class="lib-empty-files-card" id="psl-empty-files-dropzone">
              <div class="lib-empty-files-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8B1D2C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
              </div>
              <div class="lib-empty-files-text">
                <strong>${isSearching
                  ? (isAr ? 'لا توجد ملفات مطابقة للبحث' : 'No matching files found')
                  : (isAr ? 'لا توجد ملفات مرفوعة بعد' : 'No study files imported yet')
                }</strong>
                <span>${isSearching
                  ? (isAr ? 'جرب البحث بكلمات أخرى.' : 'Try searching with a different keyword.')
                  : (isAr ? 'اضغط هنا أو على زر Import Files لرفع ملفات PDF أو الصور من جهازك.' : 'Click here or press Import Files to upload PDFs or images from your device.')
                }</span>
              </div>
            </div>
          ` : `
            <div class="lib-files-grid ${this.viewMode === 'list' ? 'list-mode' : ''}" id="psl-files-grid">
              ${filesToDisplay.map(file => this.renderFileCard(file, lib, isAr)).join('')}
            </div>
          `}
        </section>
      </div>
    `;

    this.bindEvents(container, isAr);
    this.hydrateMissingThumbnails(filesToDisplay);
  },

  renderFolderCard(folder, lib, isAr) {
    const counts = lib.getFolderCounts(folder.id);
    const countNum = counts.totalFilesCount || 0;
    const filesLabel = isAr
      ? `${countNum} ${countNum === 1 ? 'ملف' : 'ملفات'}`
      : `${countNum} ${countNum === 1 ? 'file' : 'files'}`;

    return `
      <div
        class="lib-folder-card"
        draggable="true"
        data-folder-id="${folder.id}"
      >
        <button
          type="button"
          class="lib-dots-btn"
          data-folder-dots="${folder.id}"
          title="${isAr ? 'خيارات المجلد' : 'Folder options'}"
          aria-label="Folder options"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
        </button>

        <div class="lib-dots-menu" id="lib-folder-menu-${folder.id}">
          <button type="button" class="lib-dots-item" data-open-folder="${folder.id}">
            <span>📂</span>
            <span>${isAr ? 'فتح المجلد' : 'Open Folder'}</span>
          </button>
          <button type="button" class="lib-dots-item" data-edit-folder="${folder.id}">
            <span>✏️</span>
            <span>${isAr ? 'إعادة التسمية' : 'Rename Folder'}</span>
          </button>
          <button type="button" class="lib-dots-item danger" data-delete-folder="${folder.id}">
            <span>🗑️</span>
            <span>${isAr ? 'حذف المجلد' : 'Delete Folder'}</span>
          </button>
        </div>

        <div class="lib-folder-card-body" data-open-folder="${folder.id}">
          <div class="lib-folder-icon">
            ${this.getFolderSvg('#8B1D2C', '#F2DCE0', '#F6E5E8', 40, 32)}
          </div>
          <div class="lib-folder-info">
            <h3 class="lib-folder-name" title="${this.escapeHtml(folder.name)}">${this.escapeHtml(folder.name)}</h3>
            <span class="lib-folder-meta">${filesLabel}</span>
          </div>
        </div>
      </div>
    `;
  },

  renderFileCard(file, lib, isAr) {
    const isImage = file.fileKind === 'image';
    const displayName = this.formatDisplayFileName(file);
    const timeLabel = this.formatFileTimestamp(file, isAr);

    return `
      <div
        class="lib-file-card"
        draggable="true"
        data-file-id="${file.id}"
      >
        <div class="lib-file-preview" data-open-file="${file.id}">
          <span class="lib-file-type-badge">${isImage ? 'IMG' : 'PDF'}</span>
          <div class="lib-file-thumb-sheet">
            ${file.thumbnail ? `
              <img
                id="psl-thumb-img-${file.id}"
                src="${file.thumbnail}"
                alt="${this.escapeHtml(displayName)}"
                loading="lazy"
              />
            ` : `
              <img
                id="psl-thumb-img-${file.id}"
                src=""
                alt="${this.escapeHtml(displayName)}"
                style="display:none;"
              />
              <div class="lib-file-thumb-fallback" id="psl-thumb-fallback-${file.id}">
                <div class="lib-fallback-lines">
                  <span class="l-title"></span>
                  <span class="l-row"></span>
                  <span class="l-row short"></span>
                  <span class="l-row"></span>
                  <span class="l-row med"></span>
                </div>
              </div>
            `}
          </div>
        </div>

        <div class="lib-file-footer">
          <div class="lib-file-meta-wrap" data-open-file="${file.id}">
            <h3 class="lib-file-name" title="${this.escapeHtml(displayName)}">${this.escapeHtml(displayName)}</h3>
            <span class="lib-file-date">${this.escapeHtml(timeLabel)}</span>
          </div>

          <div class="lib-file-dots-wrap">
            <button
              type="button"
              class="lib-dots-btn"
              data-file-dots="${file.id}"
              title="${isAr ? 'خيارات الملف' : 'File options'}"
              aria-label="File options"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
            </button>

            <div class="lib-dots-menu file-menu" id="lib-file-menu-${file.id}">
              <button type="button" class="lib-dots-item" data-open-file="${file.id}">
                <span>📖</span>
                <span>${isAr ? 'فتح الملف' : 'Open File'}</span>
              </button>
              <button type="button" class="lib-dots-item" data-rename-file="${file.id}">
                <span>✏️</span>
                <span>${isAr ? 'إعادة التسمية' : 'Rename File'}</span>
              </button>
              <button type="button" class="lib-dots-item" data-move-file="${file.id}">
                <span>📁</span>
                <span>${isAr ? 'نقل إلى مجلد' : 'Move to Folder'}</span>
              </button>
              <button type="button" class="lib-dots-item danger" data-delete-file="${file.id}">
                <span>🗑️</span>
                <span>${isAr ? 'حذف الملف' : 'Delete File'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  async hydrateMissingThumbnails(files) {
    if (!Array.isArray(files) || files.length === 0 || !window.pdfjsLib || !window.DATA?.pdfStore) return;
    if (this._thumbQueueRunning) return;
    this._thumbQueueRunning = true;

    try {
      for (const file of files) {
        if (!file || file.thumbnail || file.fileKind === 'image') continue;
        try {
          const rec = await window.DATA.pdfStore.getPdfRecord(file.id);
          const blob = rec?.blob;
          if (!blob) continue;
          const ab = await blob.arrayBuffer();
          const loadingTask = window.pdfjsLib.getDocument({ data: ab });
          const pdfDoc = await loadingTask.promise;
          const page1 = await pdfDoc.getPage(1);
          const vp = page1.getViewport({ scale: 0.45 });
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, Math.round(vp.width));
          canvas.height = Math.max(1, Math.round(vp.height));
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          await page1.render({ canvasContext: ctx, viewport: vp }).promise;
          const dataUrl = canvas.toDataURL('image/webp', 0.78);
          if (dataUrl) {
            window.PersonalLibrary?.updateFile(file.id, { thumbnail: dataUrl, pages: pdfDoc.numPages || file.pages || 1 });
            const imgEl = document.getElementById(`psl-thumb-img-${file.id}`);
            const fbEl = document.getElementById(`psl-thumb-fallback-${file.id}`);
            if (imgEl) {
              imgEl.src = dataUrl;
              imgEl.style.display = 'block';
            }
            if (fbEl) {
              fbEl.style.display = 'none';
            }
          }
        } catch (e) {}
      }
    } finally {
      this._thumbQueueRunning = false;
    }
  },

  bindEvents(container, isAr) {
    const lib = window.PersonalLibrary;
    const fileInput = container.querySelector('#psl-file-input');

    // Close any open 3-dots menu on outside click
    const closeAllMenus = () => {
      container.querySelectorAll('.lib-dots-menu.open').forEach(m => m.classList.remove('open'));
    };

    if (!window._libOutsideClickBound) {
      window._libOutsideClickBound = true;
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.lib-dots-btn') && !e.target.closest('.lib-dots-menu')) {
          document.querySelectorAll('.lib-dots-menu.open').forEach(m => m.classList.remove('open'));
        }
      });
    }

    // 1. Trigger File Upload Dialog
    const triggerUpload = () => fileInput?.click();
    container.querySelector('#psl-btn-import-files')?.addEventListener('click', triggerUpload);
    container.querySelector('#psl-empty-files-dropzone')?.addEventListener('click', () => {
      if (!this.searchQuery.trim()) triggerUpload();
    });

    fileInput?.addEventListener('change', async (e) => {
      const filesList = Array.from(e.target.files || []);
      fileInput.value = '';
      if (filesList.length > 0) {
        await this.handleImportFiles(filesList, container, isAr);
      }
    });

    // 2. OS File Drag & Drop onto Workspace
    const dropRoot = container.querySelector('#psl-dropzone-root');
    const dropOverlay = container.querySelector('#psl-os-drop-overlay');
    let dragCounter = 0;

    dropRoot?.addEventListener('dragenter', (e) => {
      if (e.dataTransfer && Array.from(e.dataTransfer.types || []).includes('Files')) {
        e.preventDefault();
        dragCounter++;
        dropOverlay?.classList.add('active');
      }
    });

    dropRoot?.addEventListener('dragover', (e) => {
      if (e.dataTransfer && Array.from(e.dataTransfer.types || []).includes('Files')) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
      }
    });

    dropRoot?.addEventListener('dragleave', (e) => {
      if (e.dataTransfer && Array.from(e.dataTransfer.types || []).includes('Files')) {
        dragCounter = Math.max(0, dragCounter - 1);
        if (dragCounter === 0) {
          dropOverlay?.classList.remove('active');
        }
      }
    });

    dropRoot?.addEventListener('drop', async (e) => {
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        e.preventDefault();
        dragCounter = 0;
        dropOverlay?.classList.remove('active');
        const droppedFiles = Array.from(e.dataTransfer.files);
        await this.handleImportFiles(droppedFiles, container, isAr);
      }
    });

    // 3. Create Folder Button
    const triggerNewFolder = () => this.openFolderModal({ mode: 'create', parentId: this.currentFolderId, container, isAr });
    container.querySelector('#psl-btn-new-folder')?.addEventListener('click', triggerNewFolder);
    container.querySelector('#psl-empty-btn-folder')?.addEventListener('click', triggerNewFolder);

    // 4. Breadcrumb Navigation + Drop File onto Breadcrumb
    container.querySelectorAll('[data-crumb-folder]').forEach(btn => {
      btn.addEventListener('click', () => {
        const fid = btn.getAttribute('data-crumb-folder') || null;
        this.currentFolderId = fid;
        this.searchQuery = '';
        this.renderWorkspace(container, isAr);
      });

      btn.addEventListener('dragover', (e) => {
        if (this.draggedItem && this.draggedItem.type === 'file') {
          e.preventDefault();
          btn.classList.add('drop-target');
        }
      });
      btn.addEventListener('dragleave', () => btn.classList.remove('drop-target'));
      btn.addEventListener('drop', (e) => {
        btn.classList.remove('drop-target');
        if (this.draggedItem && this.draggedItem.type === 'file') {
          e.preventDefault();
          const targetFolderId = btn.getAttribute('data-crumb-folder') || null;
          lib.moveFile(this.draggedItem.id, targetFolderId);
          this.draggedItem = null;
          window.showToast?.(isAr ? 'تم نقل الملف بنجاح' : 'File moved successfully', { type: 'success' });
          this.renderWorkspace(container, isAr);
        }
      });
    });

    // 5. Search Input
    const searchInput = container.querySelector('#psl-search-input');
    searchInput?.addEventListener('input', (e) => {
      this.searchQuery = e.target.value;
      const pos = e.target.selectionStart;
      this.renderWorkspace(container, isAr);
      const nextInput = container.querySelector('#psl-search-input');
      if (nextInput) {
        nextInput.focus();
        try { nextInput.setSelectionRange(pos, pos); } catch (err) {}
      }
    });

    container.querySelector('#psl-search-clear')?.addEventListener('click', () => {
      this.searchQuery = '';
      this.renderWorkspace(container, isAr);
    });

    // 6. View Mode Toggle (Grid / List) & View All Recent Files Toggle
    container.querySelectorAll('[data-view]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.viewMode = btn.getAttribute('data-view') || 'grid';
        this.renderWorkspace(container, isAr);
      });
    });

    container.querySelector('#psl-toggle-view-all')?.addEventListener('click', () => {
      this.showAllFiles = !this.showAllFiles;
      this.renderWorkspace(container, isAr);
    });

    // 7. Three-Dots Menus for Folders & Files
    container.querySelectorAll('[data-folder-dots]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const fid = btn.getAttribute('data-folder-dots');
        const menu = container.querySelector(`#lib-folder-menu-${fid}`);
        const wasOpen = menu?.classList.contains('open');
        closeAllMenus();
        if (menu && !wasOpen) menu.classList.add('open');
      });
    });

    container.querySelectorAll('[data-file-dots]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const fileId = btn.getAttribute('data-file-dots');
        const menu = container.querySelector(`#lib-file-menu-${fileId}`);
        const wasOpen = menu?.classList.contains('open');
        closeAllMenus();
        if (menu && !wasOpen) menu.classList.add('open');
      });
    });

    // 8. Folder Actions (Open, Rename, Delete, Drag & Drop Reorder, Drop File onto Folder)
    container.querySelectorAll('[data-open-folder]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const fid = el.getAttribute('data-open-folder');
        if (fid) {
          this.currentFolderId = fid;
          this.searchQuery = '';
          this.renderWorkspace(container, isAr);
        }
      });
    });

    container.querySelectorAll('[data-edit-folder]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeAllMenus();
        const fid = btn.getAttribute('data-edit-folder');
        const folder = lib.getFolderById(fid);
        if (folder) {
          this.openFolderModal({ mode: 'edit', folder, container, isAr });
        }
      });
    });

    container.querySelectorAll('[data-delete-folder]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeAllMenus();
        const fid = btn.getAttribute('data-delete-folder');
        const folder = lib.getFolderById(fid);
        if (folder) {
          this.openDeleteFolderModal(folder, container, isAr);
        }
      });
    });

    // Folder Drag & Drop (Reordering folders OR dropping a file onto a folder)
    const folderCards = Array.from(container.querySelectorAll('.lib-folder-card'));
    folderCards.forEach(card => {
      const fid = card.getAttribute('data-folder-id');
      card.addEventListener('dragstart', (e) => {
        this.draggedItem = { type: 'folder', id: fid };
        card.classList.add('dragging');
        if (e.dataTransfer) {
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', fid);
        }
      });

      card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
        this.draggedItem = null;
      });

      card.addEventListener('dragover', (e) => {
        if (!this.draggedItem) return;
        if (this.draggedItem.type === 'folder' && this.draggedItem.id !== fid) {
          e.preventDefault();
          card.classList.add('drag-over');
        } else if (this.draggedItem.type === 'file') {
          e.preventDefault();
          card.classList.add('drop-target');
        }
      });

      card.addEventListener('dragleave', () => {
        card.classList.remove('drag-over', 'drop-target');
      });

      card.addEventListener('drop', (e) => {
        card.classList.remove('drag-over', 'drop-target');
        if (!this.draggedItem) return;
        e.preventDefault();
        e.stopPropagation();

        if (this.draggedItem.type === 'file') {
          lib.moveFile(this.draggedItem.id, fid);
          this.draggedItem = null;
          window.showToast?.(isAr ? 'تم نقل الملف إلى المجلد بنجاح' : 'File moved into folder', { type: 'success' });
          this.renderWorkspace(container, isAr);
        } else if (this.draggedItem.type === 'folder' && this.draggedItem.id !== fid) {
          const ids = folderCards.map(c => c.getAttribute('data-folder-id'));
          const fromIdx = ids.indexOf(this.draggedItem.id);
          const toIdx = ids.indexOf(fid);
          if (fromIdx !== -1 && toIdx !== -1) {
            ids.splice(fromIdx, 1);
            ids.splice(toIdx, 0, this.draggedItem.id);
            lib.reorderFolders(this.currentFolderId, ids);
            this.draggedItem = null;
            this.renderWorkspace(container, isAr);
          }
        }
      });
    });

    // 9. File Actions (Open in PDF Reader, Move, Rename, Delete, Drag & Drop)
    container.querySelectorAll('[data-open-file]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        closeAllMenus();
        const fileId = el.getAttribute('data-open-file');
        if (fileId) {
          this.openFileInReader(fileId);
        }
      });
    });

    container.querySelectorAll('[data-move-file]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeAllMenus();
        const fileId = btn.getAttribute('data-move-file');
        const file = lib.getFileById(fileId);
        if (file) this.openMoveFileModal(file, container, isAr);
      });
    });

    container.querySelectorAll('[data-rename-file]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeAllMenus();
        const fileId = btn.getAttribute('data-rename-file');
        const file = lib.getFileById(fileId);
        if (file) this.openRenameFileModal(file, container, isAr);
      });
    });

    container.querySelectorAll('[data-delete-file]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeAllMenus();
        const fileId = btn.getAttribute('data-delete-file');
        const file = lib.getFileById(fileId);
        if (file) this.openDeleteFileModal(file, container, isAr);
      });
    });

    // File Drag & Drop (for moving onto folders or reordering inside a folder)
    const fileCards = Array.from(container.querySelectorAll('.lib-file-card'));
    fileCards.forEach(card => {
      const fileId = card.getAttribute('data-file-id');
      card.addEventListener('dragstart', (e) => {
        this.draggedItem = { type: 'file', id: fileId };
        card.classList.add('dragging');
        if (e.dataTransfer) {
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', fileId);
        }
      });

      card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
        this.draggedItem = null;
      });

      card.addEventListener('dragover', (e) => {
        if (this.draggedItem && this.draggedItem.type === 'file' && this.draggedItem.id !== fileId) {
          e.preventDefault();
          card.classList.add('drag-over');
        }
      });

      card.addEventListener('dragleave', () => {
        card.classList.remove('drag-over');
      });

      card.addEventListener('drop', (e) => {
        card.classList.remove('drag-over');
        if (this.draggedItem && this.draggedItem.type === 'file' && this.draggedItem.id !== fileId) {
          e.preventDefault();
          e.stopPropagation();
          const ids = fileCards.map(c => c.getAttribute('data-file-id'));
          const fromIdx = ids.indexOf(this.draggedItem.id);
          const toIdx = ids.indexOf(fileId);
          if (fromIdx !== -1 && toIdx !== -1) {
            ids.splice(fromIdx, 1);
            ids.splice(toIdx, 0, this.draggedItem.id);
            lib.reorderFiles(this.currentFolderId, ids);
            this.draggedItem = null;
            this.renderWorkspace(container, isAr);
          }
        }
      });
    });
  },

  async handleImportFiles(filesList, container, isAr) {
    const lib = window.PersonalLibrary;
    if (!lib || !filesList || filesList.length === 0) return;

    this.isUploading = true;
    const importedFiles = [];

    for (let i = 0; i < filesList.length; i++) {
      const f = filesList[i];
      this.uploadStatusText = isAr
        ? `جاري استيراد (${i + 1}/${filesList.length}): ${f.name}...`
        : `Importing (${i + 1}/${filesList.length}): ${f.name}...`;
      this.renderWorkspace(container, isAr);

      try {
        const saved = await lib.importFile(f, this.currentFolderId);
        if (saved) importedFiles.push(saved);
      } catch (err) {
        console.error('File import error:', err);
      }
    }

    this.isUploading = false;
    this.uploadStatusText = '';
    this.renderWorkspace(container, isAr);

    if (importedFiles.length === 1) {
      window.showToast?.(
        isAr ? `تم استيراد "${importedFiles[0].title}" بنجاح!` : `Imported "${importedFiles[0].title}"!`,
        { type: 'success' }
      );
      this.openFileInReader(importedFiles[0].id);
    } else if (importedFiles.length > 1) {
      window.showToast?.(
        isAr ? `تم استيراد ${importedFiles.length} ملفات بنجاح!` : `Imported ${importedFiles.length} files!`,
        { type: 'success' }
      );
    }
  },

  openFileInReader(fileId) {
    if (window.PersonalLibrary) {
      window.PersonalLibrary.updateFile(fileId, { lastOpenedAt: new Date().toISOString() });
    }
    if (window.ROUTER && typeof window.ROUTER.navigate === 'function') {
      window.ROUTER.navigate(`/sheet-detail?id=${encodeURIComponent(fileId)}`);
    } else {
      window.location.hash = `#/sheet-detail?id=${encodeURIComponent(fileId)}`;
    }
  },

  // ==================== MODALS ====================

  openFolderModal({ mode = 'create', folder = null, parentId = null, container, isAr }) {
    const lib = window.PersonalLibrary;
    document.getElementById('psl-modal-backdrop')?.remove();

    const initialName = folder ? folder.name : '';

    const backdrop = document.createElement('div');
    backdrop.id = 'psl-modal-backdrop';
    backdrop.className = 'lib-modal-backdrop';
    backdrop.dir = isAr ? 'rtl' : 'ltr';

    backdrop.innerHTML = `
      <div class="lib-modal-card">
        <div class="lib-modal-header">
          <h3>
            ${this.getFolderSvg('#8B1D2C', '#F2DCE0', '#F6E5E8', 24, 20)}
            <span>${mode === 'edit'
              ? (isAr ? 'إعادة تسمية المجلد' : 'Rename Folder')
              : (parentId ? (isAr ? 'إنشاء مجلد فرعي جديد' : 'New Subfolder') : (isAr ? 'إنشاء مجلد جديد' : 'New Folder'))
            }</span>
          </h3>
          <button type="button" class="lib-modal-close" id="psl-modal-close">✕</button>
        </div>

        <form id="psl-folder-form" class="lib-modal-body">
          <div class="lib-field">
            <label>${isAr ? 'اسم المجلد' : 'Folder Name'}</label>
            <input
              type="text"
              id="psl-folder-name-input"
              class="lib-input"
              value="${this.escapeHtml(initialName)}"
              placeholder="${isAr ? 'مثال: Conservative, Fixed Prostho, Pathology...' : 'e.g., Conservative, Fixed Prostho, Pathology...'}"
              required
              autofocus
            />
          </div>

          <div class="lib-modal-footer">
            <button type="button" class="lib-btn lib-btn-new-folder" id="psl-modal-cancel">
              ${isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button type="submit" class="lib-btn lib-btn-import">
              <span>${mode === 'edit' ? (isAr ? 'حفظ' : 'Save') : (isAr ? 'إنشاء المجلد' : 'Create Folder')}</span>
            </button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(backdrop);

    const closeModal = () => backdrop.remove();
    backdrop.querySelector('#psl-modal-close')?.addEventListener('click', closeModal);
    backdrop.querySelector('#psl-modal-cancel')?.addEventListener('click', closeModal);
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) closeModal(); });

    backdrop.querySelector('#psl-folder-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameVal = backdrop.querySelector('#psl-folder-name-input')?.value.trim();
      if (!nameVal) return;

      if (mode === 'edit' && folder) {
        lib.updateFolder(folder.id, { name: nameVal });
        window.showToast?.(isAr ? 'تم تحديث اسم المجلد' : 'Folder renamed', { type: 'success' });
      } else {
        lib.createFolder({ name: nameVal, parentId, color: 'rose', icon: 'folder' });
        window.showToast?.(isAr ? 'تم إنشاء المجلد بنجاح' : 'Folder created', { type: 'success' });
      }
      closeModal();
      this.renderWorkspace(container, isAr);
    });
  },

  openDeleteFolderModal(folder, container, isAr) {
    const lib = window.PersonalLibrary;
    const counts = lib.getFolderCounts(folder.id);
    document.getElementById('psl-modal-backdrop')?.remove();

    const backdrop = document.createElement('div');
    backdrop.id = 'psl-modal-backdrop';
    backdrop.className = 'lib-modal-backdrop';
    backdrop.dir = isAr ? 'rtl' : 'ltr';

    backdrop.innerHTML = `
      <div class="lib-modal-card">
        <div class="lib-modal-header">
          <h3 style="color:#B91C1C;">
            <span>${isAr ? 'حذف المجلد' : 'Delete Folder'}</span>
          </h3>
          <button type="button" class="lib-modal-close" id="psl-modal-close">✕</button>
        </div>
        <div class="lib-modal-body">
          <p style="margin:0 0 12px;color:#23191B;font-weight:700;">
            ${isAr ? `هل أنت متأكد من حذف مجلد "${this.escapeHtml(folder.name)}"؟` : `Are you sure you want to delete "${this.escapeHtml(folder.name)}"?`}
          </p>
          ${counts.totalFilesCount > 0 ? `
            <p style="margin:0 0 16px;font-size:0.86rem;color:#6E6264;line-height:1.5;">
              ${isAr
                ? `يحتوي هذا المجلد على ${counts.totalFilesCount} ملف. يمكنك الاحتفاظ بالملفات ونقلها للمكتبة الرئيسية أو حذف المجلد مع ملفاته.`
                : `This folder contains ${counts.totalFilesCount} file(s). You can keep the files or delete everything.`}
            </p>
          ` : ''}
          <div class="lib-modal-footer" style="flex-wrap:wrap;">
            <button type="button" class="lib-btn lib-btn-new-folder" id="psl-modal-cancel">${isAr ? 'إلغاء' : 'Cancel'}</button>
            ${counts.totalFilesCount > 0 ? `
              <button type="button" class="lib-btn lib-btn-new-folder" id="psl-btn-keep-files">
                ${isAr ? 'حذف المجلد والاحتفاظ بالملفات' : 'Keep Files'}
              </button>
            ` : ''}
            <button type="button" class="lib-btn lib-btn-import" id="psl-btn-confirm-delete" style="background:#B91C1C;border-color:#B91C1C;">
              <span>${isAr ? 'حذف نهائي' : 'Delete'}</span>
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);

    const closeModal = () => backdrop.remove();
    backdrop.querySelector('#psl-modal-close')?.addEventListener('click', closeModal);
    backdrop.querySelector('#psl-modal-cancel')?.addEventListener('click', closeModal);
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) closeModal(); });

    backdrop.querySelector('#psl-btn-keep-files')?.addEventListener('click', async () => {
      await lib.deleteFolder(folder.id, { deleteFiles: false });
      closeModal();
      window.showToast?.(isAr ? 'تم حذف المجلد والاحتفاظ بالملفات' : 'Folder deleted, files kept', { type: 'success' });
      this.renderWorkspace(container, isAr);
    });

    backdrop.querySelector('#psl-btn-confirm-delete')?.addEventListener('click', async () => {
      await lib.deleteFolder(folder.id, { deleteFiles: true });
      closeModal();
      window.showToast?.(isAr ? 'تم حذف المجلد' : 'Folder deleted', { type: 'success' });
      this.renderWorkspace(container, isAr);
    });
  },

  openMoveFileModal(file, container, isAr) {
    const lib = window.PersonalLibrary;
    const allFolders = lib.getAllFolders();
    document.getElementById('psl-modal-backdrop')?.remove();

    const buildFolderPathLabel = (fld) => {
      const crumbs = lib.getFolderBreadcrumbs(fld.id);
      return crumbs.map(c => c.name).join(' / ');
    };

    const backdrop = document.createElement('div');
    backdrop.id = 'psl-modal-backdrop';
    backdrop.className = 'lib-modal-backdrop';
    backdrop.dir = isAr ? 'rtl' : 'ltr';

    backdrop.innerHTML = `
      <div class="lib-modal-card">
        <div class="lib-modal-header">
          <h3>
            ${this.getFolderSvg('#8B1D2C', '#F2DCE0', '#F6E5E8', 24, 20)}
            <span>${isAr ? 'نقل الملف إلى مجلد' : 'Move File to Folder'}</span>
          </h3>
          <button type="button" class="lib-modal-close" id="psl-modal-close">✕</button>
        </div>

        <form id="psl-move-form" class="lib-modal-body">
          <div class="lib-field">
            <label>${isAr ? `اختر المجلد للملف "${this.escapeHtml(file.title)}"` : `Select destination folder for "${this.escapeHtml(file.title)}"`}</label>
            <select id="psl-move-target-select" class="lib-input">
              <option value="" ${!file.folderId ? 'selected' : ''}>${isAr ? 'المكتبة الرئيسية (بدون مجلد)' : 'Root Library'}</option>
              ${allFolders.map(fld => `
                <option value="${fld.id}" ${file.folderId === fld.id ? 'selected' : ''}>
                  ${this.escapeHtml(buildFolderPathLabel(fld))}
                </option>
              `).join('')}
            </select>
          </div>
          <div class="lib-modal-footer">
            <button type="button" class="lib-btn lib-btn-new-folder" id="psl-modal-cancel">${isAr ? 'إلغاء' : 'Cancel'}</button>
            <button type="submit" class="lib-btn lib-btn-import">
              <span>${isAr ? 'نقل الملف' : 'Move File'}</span>
            </button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(backdrop);

    const closeModal = () => backdrop.remove();
    backdrop.querySelector('#psl-modal-close')?.addEventListener('click', closeModal);
    backdrop.querySelector('#psl-modal-cancel')?.addEventListener('click', closeModal);
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) closeModal(); });

    backdrop.querySelector('#psl-move-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const targetId = backdrop.querySelector('#psl-move-target-select')?.value || null;
      lib.moveFile(file.id, targetId);
      closeModal();
      window.showToast?.(isAr ? 'تم نقل الملف بنجاح' : 'File moved successfully', { type: 'success' });
      this.renderWorkspace(container, isAr);
    });
  },

  openRenameFileModal(file, container, isAr) {
    const lib = window.PersonalLibrary;
    document.getElementById('psl-modal-backdrop')?.remove();

    const backdrop = document.createElement('div');
    backdrop.id = 'psl-modal-backdrop';
    backdrop.className = 'lib-modal-backdrop';
    backdrop.dir = isAr ? 'rtl' : 'ltr';

    backdrop.innerHTML = `
      <div class="lib-modal-card">
        <div class="lib-modal-header">
          <h3>
            <span>${isAr ? 'إعادة تسمية الملف' : 'Rename File'}</span>
          </h3>
          <button type="button" class="lib-modal-close" id="psl-modal-close">✕</button>
        </div>
        <form id="psl-rename-file-form" class="lib-modal-body">
          <div class="lib-field">
            <label>${isAr ? 'اسم الملف' : 'File Name'}</label>
            <input type="text" id="psl-rename-input" class="lib-input" value="${this.escapeHtml(file.title)}" required autofocus />
          </div>
          <div class="lib-modal-footer">
            <button type="button" class="lib-btn lib-btn-new-folder" id="psl-modal-cancel">${isAr ? 'إلغاء' : 'Cancel'}</button>
            <button type="submit" class="lib-btn lib-btn-import">${isAr ? 'حفظ' : 'Save'}</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(backdrop);

    const closeModal = () => backdrop.remove();
    backdrop.querySelector('#psl-modal-close')?.addEventListener('click', closeModal);
    backdrop.querySelector('#psl-modal-cancel')?.addEventListener('click', closeModal);
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) closeModal(); });

    backdrop.querySelector('#psl-rename-file-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = backdrop.querySelector('#psl-rename-input')?.value.trim();
      if (val) {
        lib.updateFile(file.id, { title: val });
        window.showToast?.(isAr ? 'تم تحديث اسم الملف' : 'File renamed', { type: 'success' });
      }
      closeModal();
      this.renderWorkspace(container, isAr);
    });
  },

  openDeleteFileModal(file, container, isAr) {
    const lib = window.PersonalLibrary;
    document.getElementById('psl-modal-backdrop')?.remove();

    const backdrop = document.createElement('div');
    backdrop.id = 'psl-modal-backdrop';
    backdrop.className = 'lib-modal-backdrop';
    backdrop.dir = isAr ? 'rtl' : 'ltr';

    backdrop.innerHTML = `
      <div class="lib-modal-card">
        <div class="lib-modal-header">
          <h3 style="color:#B91C1C;">
            <span>${isAr ? 'حذف الملف' : 'Delete File'}</span>
          </h3>
          <button type="button" class="lib-modal-close" id="psl-modal-close">✕</button>
        </div>
        <div class="lib-modal-body">
          <p style="margin:0 0 16px;color:#23191B;font-weight:600;">
            ${isAr ? `هل أنت متأكد من حذف "${this.escapeHtml(file.title)}"؟` : `Are you sure you want to delete "${this.escapeHtml(file.title)}"?`}
          </p>
          <div class="lib-modal-footer">
            <button type="button" class="lib-btn lib-btn-new-folder" id="psl-modal-cancel">${isAr ? 'إلغاء' : 'Cancel'}</button>
            <button type="button" class="lib-btn lib-btn-import" id="psl-confirm-delete-file" style="background:#B91C1C;border-color:#B91C1C;">
              ${isAr ? 'حذف الملف' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);

    const closeModal = () => backdrop.remove();
    backdrop.querySelector('#psl-modal-close')?.addEventListener('click', closeModal);
    backdrop.querySelector('#psl-modal-cancel')?.addEventListener('click', closeModal);
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) closeModal(); });

    backdrop.querySelector('#psl-confirm-delete-file')?.addEventListener('click', async () => {
      await lib.deleteFile(file.id, { keepRecordings: false });
      closeModal();
      window.showToast?.(isAr ? 'تم حذف الملف' : 'File deleted', { type: 'success' });
      this.renderWorkspace(container, isAr);
    });
  },

  escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  },

  injectStyles() {
    let style = document.getElementById('psl-personal-library-styles');
    if (!style) {
      style = document.createElement('style');
      style.id = 'psl-personal-library-styles';
      document.head.appendChild(style);
    }
    style.textContent = `
      /* ==========================================================================
         KURO FANGS — MINIMALIST MODERN LIBRARY REDESIGN (v29.0)
         Matches Reference Visual Direction: Warm Off-White (#FCFBF8), Burgundy (#8B1D2C),
         Clean White Cards (#FFFFFF), Soft Borders (#EFEAE1), Zero Clutter
         ========================================================================== */
      .lib-page-shell {
        max-width: 1240px;
        margin: 0 auto;
        padding: 12px 28px 96px;
        position: relative;
        min-height: calc(100vh - 80px);
        color: #23191B;
        font-family: 'Inter', 'IBM Plex Sans Arabic', sans-serif;
      }

      /* 1. PAGE HEADER (Directly on page background, no bounding box) */
      .lib-page-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        margin-bottom: 24px;
        flex-wrap: wrap;
      }

      .lib-header-left {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .lib-header-icon-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .lib-header-titles {
        display: flex;
        flex-direction: column;
        gap: 3px;
      }

      .lib-breadcrumbs {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
        margin-bottom: 2px;
      }

      .lib-crumb-link {
        background: none;
        border: none;
        padding: 2px 6px;
        border-radius: 6px;
        font-size: 0.8rem;
        font-weight: 600;
        color: #7A6E70;
        cursor: pointer;
        font-family: inherit;
      }

      .lib-crumb-link:hover,
      .lib-crumb-link.drop-target {
        background: #F2DCE0;
        color: #8B1D2C;
      }

      .lib-crumb-link.current {
        color: #8B1D2C;
        font-weight: 700;
      }

      .lib-crumb-sep {
        color: #B8AEB0;
        font-size: 0.78rem;
      }

      .lib-main-title {
        font-size: clamp(1.65rem, 2.3vw, 2.05rem);
        font-weight: 800;
        color: #23191B;
        margin: 0;
        line-height: 1.15;
        letter-spacing: -0.02em;
      }

      .lib-main-subtitle {
        font-size: 0.92rem;
        color: #6E6264;
        margin: 0;
        font-weight: 450;
      }

      .lib-header-actions {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
      }

      .lib-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        height: 44px;
        padding: 0 20px;
        border-radius: 12px;
        font-size: 0.9rem;
        font-weight: 650;
        cursor: pointer;
        font-family: inherit;
        transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
        white-space: nowrap;
      }

      .lib-btn:active {
        transform: scale(0.98);
      }

      .lib-btn-new-folder {
        background: #FFFFFF;
        color: #23191B;
        border: 1px solid #DED7CD;
        box-shadow: 0 1px 3px rgba(35, 25, 27, 0.03);
      }

      .lib-btn-new-folder:hover {
        background: #F9F6F0;
        border-color: #C7BEB2;
      }

      .lib-btn-import {
        background: #8B1D2C;
        color: #FFFFFF;
        border: 1px solid #7A1826;
        box-shadow: 0 4px 12px rgba(139, 29, 44, 0.18);
      }

      .lib-btn-import:hover {
        background: #7A1826;
      }

      /* 2. SEARCH BAR & VIEW SWITCHER CONTAINER */
      .lib-search-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        background: #FFFFFF;
        border: 1px solid #EFEAE1;
        border-radius: 16px;
        padding: 10px 14px;
        margin-bottom: 28px;
        box-shadow: 0 2px 10px rgba(35, 25, 27, 0.02);
      }

      .lib-search-field-wrap {
        position: relative;
        display: flex;
        align-items: center;
        flex: 1;
        max-width: 720px;
        background: #F4F2EE;
        border-radius: 11px;
        height: 42px;
        padding: 0 14px;
        gap: 10px;
        border: 1px solid transparent;
        transition: border-color 0.16s ease, background 0.16s ease;
      }

      .lib-search-field-wrap:focus-within {
        background: #FFFFFF;
        border-color: #D8C7CA;
      }

      .lib-search-icon {
        color: #6E6264;
        flex-shrink: 0;
      }

      .lib-search-input {
        width: 100%;
        border: none;
        background: transparent;
        color: #23191B;
        font-size: 0.9rem;
        font-family: inherit;
        outline: none;
      }

      .lib-search-input::placeholder {
        color: #7A6E70;
      }

      .lib-search-clear {
        background: none;
        border: none;
        color: #7A6E70;
        cursor: pointer;
        font-size: 0.85rem;
        padding: 2px 4px;
      }

      .lib-view-toggle {
        display: inline-flex;
        align-items: center;
        border: 1px solid #EDE7DE;
        border-radius: 11px;
        overflow: hidden;
        background: #FFFFFF;
        flex-shrink: 0;
      }

      .lib-view-btn {
        width: 42px;
        height: 38px;
        border: none;
        background: transparent;
        color: #6E6264;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.15s ease;
      }

      .lib-view-btn + .lib-view-btn {
        border-inline-start: 1px solid #EDE7DE;
      }

      .lib-view-btn.active {
        background: #F3DCE0;
        color: #8B1D2C;
      }

      /* 3. SECTIONS (Folders & Recent Files) */
      .lib-section {
        margin-bottom: 30px;
      }

      .lib-section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 14px;
      }

      .lib-section-title {
        font-size: 1.2rem;
        font-weight: 800;
        color: #23191B;
        margin: 0;
        display: inline-flex;
        align-items: baseline;
        gap: 6px;
        letter-spacing: -0.01em;
      }

      .lib-section-count {
        font-weight: 500;
        color: #7A6E70;
        font-size: 1.1rem;
      }

      .lib-view-all-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: none;
        border: none;
        color: #7A1C2C;
        font-size: 0.9rem;
        font-weight: 700;
        cursor: pointer;
        padding: 4px 6px;
        border-radius: 8px;
        font-family: inherit;
        transition: background 0.15s ease;
      }

      .lib-view-all-btn:hover {
        background: rgba(139, 29, 44, 0.06);
      }

      /* 4. FOLDERS GRID & CARDS */
      .lib-folders-grid {
        display: grid;
        grid-template-columns: repeat(6, minmax(0, 1fr));
        gap: 14px;
      }

      @media (max-width: 1280px) {
        .lib-folders-grid {
          grid-template-columns: repeat(auto-fill, minmax(175px, 1fr));
        }
      }

      .lib-folders-grid.list-mode {
        grid-template-columns: 1fr;
        gap: 10px;
      }

      .lib-folder-card {
        position: relative;
        background: #FFFFFF;
        border: 1px solid #EFEAE1;
        border-radius: 16px;
        padding: 18px 16px 16px;
        box-shadow: 0 3px 12px rgba(35, 25, 27, 0.025);
        transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.18s ease, box-shadow 0.18s ease;
        cursor: pointer;
        user-select: none;
      }

      .lib-folder-card:hover {
        transform: translateY(-2px);
        border-color: #DFC8CC;
        box-shadow: 0 8px 20px rgba(35, 25, 27, 0.05);
      }

      .lib-folder-card.drag-over,
      .lib-folder-card.drop-target {
        border: 2px dashed #8B1D2C;
        background: #FDF7F8;
        transform: scale(1.02);
      }

      .lib-folder-card-body {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .lib-folders-grid.list-mode .lib-folder-card {
        padding: 14px 18px;
      }

      .lib-folders-grid.list-mode .lib-folder-card-body {
        flex-direction: row;
        align-items: center;
        gap: 14px;
        padding-inline-end: 32px;
      }

      .lib-folder-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      .lib-folder-info {
        width: 100%;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 3px;
      }

      .lib-folder-name {
        font-size: 0.96rem;
        font-weight: 750;
        color: #23191B;
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .lib-folder-meta {
        font-size: 0.82rem;
        color: #7A6E70;
        font-weight: 500;
      }

      .lib-folder-card > .lib-dots-btn {
        position: absolute;
        top: 10px;
        inset-inline-end: 8px;
      }

      .lib-folders-grid.list-mode .lib-folder-card > .lib-dots-btn {
        top: 50%;
        transform: translateY(-50%);
      }

      /* 5. RECENT FILES GRID & CARDS */
      .lib-files-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 320px));
        gap: 18px;
      }

      @media (max-width: 1024px) {
        .lib-files-grid {
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        }
      }

      .lib-files-grid.list-mode {
        grid-template-columns: 1fr;
        gap: 10px;
      }

      .lib-file-card {
        position: relative;
        background: #FFFFFF;
        border: 1px solid #EFEAE1;
        border-radius: 16px;
        padding: 14px;
        box-shadow: 0 3px 12px rgba(35, 25, 27, 0.025);
        transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.18s ease, box-shadow 0.18s ease;
        display: flex;
        flex-direction: column;
      }

      .lib-file-card:hover {
        transform: translateY(-2px);
        border-color: #DFC8CC;
        box-shadow: 0 10px 24px rgba(35, 25, 27, 0.06);
      }

      .lib-file-preview {
        position: relative;
        height: 138px;
        border-radius: 12px;
        background: #FAF8F5;
        border: 1px solid #F1ECE3;
        padding: 10px 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        cursor: pointer;
      }

      .lib-file-type-badge {
        position: absolute;
        top: 8px;
        inset-inline-start: 8px;
        z-index: 2;
        background: #7A1C2C;
        color: #FFFFFF;
        font-size: 0.68rem;
        font-weight: 800;
        padding: 3px 9px;
        border-radius: 6px;
        letter-spacing: 0.03em;
      }

      .lib-file-thumb-sheet {
        width: 100%;
        height: 100%;
        background: #FFFFFF;
        border: 1px solid #EAE4DA;
        border-radius: 6px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .lib-file-thumb-sheet img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: top center;
        display: block;
      }

      .lib-file-thumb-fallback {
        width: 100%;
        height: 100%;
        padding: 14px;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .lib-fallback-lines {
        display: flex;
        flex-direction: column;
        gap: 7px;
      }

      .lib-fallback-lines span {
        display: block;
        height: 5px;
        border-radius: 3px;
        background: #EFEAE1;
      }

      .lib-fallback-lines .l-title {
        width: 55%;
        height: 7px;
        background: #E5CDD1;
        margin-bottom: 3px;
      }

      .lib-fallback-lines .l-row.short { width: 65%; }
      .lib-fallback-lines .l-row.med { width: 80%; }

      .lib-file-footer {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 8px;
        margin-top: 12px;
        padding-top: 2px;
      }

      .lib-file-meta-wrap {
        min-width: 0;
        flex: 1;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        gap: 3px;
      }

      .lib-file-name {
        font-size: 0.95rem;
        font-weight: 750;
        color: #23191B;
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .lib-file-date {
        font-size: 0.8rem;
        color: #7A6E70;
        font-weight: 450;
      }

      .lib-file-dots-wrap {
        position: relative;
        flex-shrink: 0;
      }

      /* List Mode for Files */
      .lib-files-grid.list-mode .lib-file-card {
        flex-direction: row;
        align-items: center;
        gap: 16px;
        padding: 10px 16px;
      }

      .lib-files-grid.list-mode .lib-file-preview {
        width: 96px;
        height: 64px;
        padding: 4px 8px;
        flex-shrink: 0;
      }

      .lib-files-grid.list-mode .lib-file-footer {
        margin-top: 0;
        flex: 1;
        align-items: center;
      }

      /* 6. THREE-DOTS BUTTON & CONTEXT MENU */
      .lib-dots-btn {
        width: 28px;
        height: 28px;
        border-radius: 8px;
        border: none;
        background: transparent;
        color: #6E6264;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background 0.15s ease, color 0.15s ease;
      }

      .lib-dots-btn:hover {
        background: #F4F1EC;
        color: #23191B;
      }

      .lib-dots-menu {
        position: absolute;
        top: 36px;
        inset-inline-end: 8px;
        z-index: 60;
        min-width: 165px;
        background: #FFFFFF;
        border: 1px solid #EAE2D6;
        border-radius: 12px;
        padding: 6px;
        box-shadow: 0 12px 28px rgba(35, 25, 27, 0.12);
        display: none;
        flex-direction: column;
        gap: 2px;
      }

      .lib-dots-menu.file-menu {
        top: auto;
        bottom: 34px;
        inset-inline-end: 0;
      }

      .lib-dots-menu.open {
        display: flex;
      }

      .lib-dots-item {
        display: flex;
        align-items: center;
        gap: 9px;
        width: 100%;
        padding: 8px 10px;
        border: none;
        background: transparent;
        border-radius: 8px;
        font-size: 0.82rem;
        font-weight: 600;
        color: #23191B;
        cursor: pointer;
        text-align: start;
        font-family: inherit;
      }

      .lib-dots-item:hover {
        background: #F6F2EC;
      }

      .lib-dots-item.danger {
        color: #B91C1C;
      }

      .lib-dots-item.danger:hover {
        background: #FEF2F2;
      }

      /* 7. EMPTY STATES & UPLOAD BANNER */
      .lib-empty-inline-card,
      .lib-empty-files-card {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 20px 22px;
        background: #FFFFFF;
        border: 1px dashed #DFD7CC;
        border-radius: 16px;
        cursor: pointer;
        transition: border-color 0.16s ease, background 0.16s ease;
      }

      .lib-empty-inline-card:hover,
      .lib-empty-files-card:hover {
        border-color: #8B1D2C;
        background: #FDFBFA;
      }

      .lib-empty-inline-text,
      .lib-empty-files-text {
        display: flex;
        flex-direction: column;
        gap: 3px;
      }

      .lib-empty-inline-text strong,
      .lib-empty-files-text strong {
        font-size: 0.95rem;
        color: #23191B;
      }

      .lib-empty-inline-text span,
      .lib-empty-files-text span {
        font-size: 0.83rem;
        color: #7A6E70;
      }

      .lib-upload-banner {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 16px;
        border-radius: 12px;
        background: #F9EBEE;
        border: 1px solid #E5C2C8;
        color: #8B1D2C;
        font-weight: 700;
        font-size: 0.86rem;
        margin-bottom: 18px;
      }

      .lib-spinner {
        width: 16px;
        height: 16px;
        border: 2.2px solid rgba(139, 29, 44, 0.25);
        border-top-color: #8B1D2C;
        border-radius: 50%;
        animation: libSpin 0.75s linear infinite;
      }

      @keyframes libSpin {
        to { transform: rotate(360deg); }
      }

      /* OS Drop Overlay */
      .lib-os-drop-overlay {
        position: fixed;
        inset: 0;
        z-index: 9999;
        background: rgba(252, 251, 248, 0.9);
        backdrop-filter: blur(8px);
        display: none;
        align-items: center;
        justify-content: center;
        padding: 24px;
      }

      .lib-os-drop-overlay.active {
        display: flex;
      }

      .lib-os-drop-box {
        border: 2px dashed #8B1D2C;
        background: #FFFFFF;
        border-radius: 20px;
        padding: 44px 36px;
        text-align: center;
        max-width: 480px;
        color: #23191B;
        box-shadow: 0 20px 44px rgba(35, 25, 27, 0.08);
      }

      .lib-os-drop-icon {
        margin-bottom: 14px;
      }

      /* 8. MODALS */
      .lib-modal-backdrop {
        position: fixed;
        inset: 0;
        z-index: 10000;
        background: rgba(35, 25, 27, 0.42);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
      }

      .lib-modal-card {
        width: 100%;
        max-width: 440px;
        background: #FFFFFF;
        border: 1px solid #EAE2D6;
        border-radius: 18px;
        box-shadow: 0 24px 48px rgba(35, 25, 27, 0.16);
        overflow: hidden;
      }

      .lib-modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 20px;
        border-bottom: 1px solid #F1ECE3;
      }

      .lib-modal-header h3 {
        margin: 0;
        font-size: 1rem;
        font-weight: 800;
        color: #23191B;
        display: flex;
        align-items: center;
        gap: 9px;
      }

      .lib-modal-close {
        background: none;
        border: none;
        color: #7A6E70;
        font-size: 1rem;
        cursor: pointer;
      }

      .lib-modal-body {
        padding: 20px;
      }

      .lib-field {
        margin-bottom: 16px;
      }

      .lib-field label {
        display: block;
        font-size: 0.82rem;
        font-weight: 700;
        color: #4A3B3E;
        margin-bottom: 7px;
      }

      .lib-input {
        width: 100%;
        padding: 10px 13px;
        border-radius: 10px;
        border: 1px solid #DED7CD;
        background: #FAF8F5;
        color: #23191B;
        font-size: 0.9rem;
        font-family: inherit;
        outline: none;
      }

      .lib-input:focus {
        border-color: #8B1D2C;
        background: #FFFFFF;
      }

      .lib-modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 18px;
      }

      /* 9. DARK MODE COMPATIBILITY */
      [data-theme="dark"] .lib-page-shell,
      [data-theme="kuro-dark"] .lib-page-shell {
        color: #F4F1EA;
      }
      [data-theme="dark"] .lib-main-title,
      [data-theme="kuro-dark"] .lib-main-title,
      [data-theme="dark"] .lib-section-title,
      [data-theme="kuro-dark"] .lib-section-title,
      [data-theme="dark"] .lib-folder-name,
      [data-theme="kuro-dark"] .lib-folder-name,
      [data-theme="dark"] .lib-file-name,
      [data-theme="kuro-dark"] .lib-file-name {
        color: #F4F1EA;
      }
      [data-theme="dark"] .lib-search-container,
      [data-theme="kuro-dark"] .lib-search-container,
      [data-theme="dark"] .lib-folder-card,
      [data-theme="kuro-dark"] .lib-folder-card,
      [data-theme="dark"] .lib-file-card,
      [data-theme="kuro-dark"] .lib-file-card,
      [data-theme="dark"] .lib-btn-new-folder,
      [data-theme="kuro-dark"] .lib-btn-new-folder,
      [data-theme="dark"] .lib-empty-inline-card,
      [data-theme="kuro-dark"] .lib-empty-inline-card,
      [data-theme="dark"] .lib-empty-files-card,
      [data-theme="kuro-dark"] .lib-empty-files-card,
      [data-theme="dark"] .lib-modal-card,
      [data-theme="kuro-dark"] .lib-modal-card,
      [data-theme="dark"] .lib-dots-menu,
      [data-theme="kuro-dark"] .lib-dots-menu {
        background: #1B1924;
        border-color: rgba(255, 255, 255, 0.09);
        color: #F4F1EA;
      }
      [data-theme="dark"] .lib-search-field-wrap,
      [data-theme="kuro-dark"] .lib-search-field-wrap,
      [data-theme="dark"] .lib-file-preview,
      [data-theme="kuro-dark"] .lib-file-preview {
        background: #13111A;
        border-color: rgba(255, 255, 255, 0.07);
      }
      [data-theme="dark"] .lib-search-input,
      [data-theme="kuro-dark"] .lib-search-input {
        color: #F4F1EA;
      }

      /* 10. RESPONSIVE DESIGN (iPad, Tablet, Mobile — Zero Horizontal Overflow) */
      @media (max-width: 767px) {
        .lib-page-shell {
          padding: 12px 14px 92px;
        }
        .lib-page-header {
          flex-direction: column;
          align-items: stretch;
          gap: 14px;
          margin-bottom: 18px;
        }
        .lib-header-actions {
          width: 100%;
        }
        .lib-header-actions .lib-btn {
          flex: 1;
          height: 42px;
          padding: 0 12px;
          font-size: 0.84rem;
        }
        .lib-search-container {
          padding: 8px 10px;
          gap: 10px;
          margin-bottom: 22px;
        }
        .lib-folders-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }
        .lib-folder-card {
          padding: 14px 12px;
        }
        .lib-files-grid {
          grid-template-columns: 1fr;
          gap: 12px;
        }
      }
    `;
  }
};
