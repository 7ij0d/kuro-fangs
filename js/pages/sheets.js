/**
 * KURO FANGS — PERSONAL STUDY LIBRARY (المكتبة الدراسية الشخصية)
 * GoodNotes / Notability-Grade Personal Workspace (#/sheets)
 * - 100% Private per User Account (Zero default/admin sheets, zero hardcoded subjects/doctors)
 * - Nested Folders & Subfolders with Custom Colors, Icons & Breadcrumb Navigation
 * - Drag & Drop Reordering for Folders and Files + Drag File onto Folder to Move
 * - Multi-File Device Import (PDFs, Images, Handouts) stored in IndexedDB
 * - Instant launch into the Integrated Study Reader & Audio Recording Studio (#/sheet-detail)
 */

window.SheetsPage = {
  currentFolderId: null, // null = Root Library
  searchQuery: '',
  viewMode: 'grid', // 'grid' | 'list'
  sortBy: 'custom', // 'custom' | 'date' | 'name' | 'pages'
  isUploading: false,
  uploadStatusText: '',
  draggedItem: null, // { type: 'folder' | 'file', id: string }

  async render(containerOrParams = {}, maybeParams = {}) {
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;
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

  renderWorkspace(container, isAr) {
    const lib = window.PersonalLibrary;
    if (!lib) {
      container.innerHTML = `<div style="padding:48px;text-align:center;">Loading Personal Library...</div>`;
      return;
    }

    const user = window.AUTH && typeof window.AUTH.getUser === 'function' ? window.AUTH.getUser() : null;
    const userName = user ? (user.name || user.username || (isAr ? 'طالب' : 'Student')) : (isAr ? 'طالب' : 'Student');

    const isSearching = this.searchQuery.trim().length > 0;
    const breadcrumbs = this.currentFolderId ? lib.getFolderBreadcrumbs(this.currentFolderId) : [];
    const currentFolder = this.currentFolderId ? lib.getFolderById(this.currentFolderId) : null;

    let folders = [];
    let files = [];

    if (isSearching) {
      const res = lib.searchLibrary(this.searchQuery);
      folders = res.folders;
      files = res.files;
    } else {
      folders = lib.getFoldersByParent(this.currentFolderId);
      files = lib.getFilesByFolder(this.currentFolderId);
    }

    // Apply file sorting if not custom order
    if (this.sortBy === 'name') {
      files = [...files].sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    } else if (this.sortBy === 'date') {
      files = [...files].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (this.sortBy === 'pages') {
      files = [...files].sort((a, b) => (b.pages || 1) - (a.pages || 1));
    }

    const allFoldersCount = lib.getAllFolders().length;
    const allFilesCount = lib.getAllFiles().length;

    container.innerHTML = `
      <div class="psl-shell page-enter" id="psl-dropzone-root" dir="${isAr ? 'rtl' : 'ltr'}">
        
        <!-- Drag & Drop Full-Screen Overlay when dragging files from OS -->
        <div class="psl-os-drop-overlay" id="psl-os-drop-overlay">
          <div class="psl-os-drop-box">
            <div class="psl-os-drop-icon">
              <i data-lucide="upload-cloud" style="width:44px;height:44px;"></i>
            </div>
            <h3>${isAr ? 'أفلت الملفات هنا لإضافتها إلى مكتبتك' : 'Drop files here to import into your library'}</h3>
            <p>${currentFolder
              ? (isAr ? `سيتم حفظ الملفات مباشرة داخل مجلد "${this.escapeHtml(currentFolder.name)}"` : `Files will be imported directly into "${this.escapeHtml(currentFolder.name)}"`)
              : (isAr ? 'يدعم ملفات PDF والصور والملازم الدراسية (يمكنك رفع عدة ملفات دفعة واحدة)' : 'Supports PDF, Images, and study handouts (Multi-file upload supported)')
            }</p>
          </div>
        </div>

        <!-- Top Studio Header -->
        <header class="psl-header">
          <div class="psl-header-main">
            <div class="psl-brand-row">
              <div class="psl-brand-badge">
                <i data-lucide="library" style="width:18px;height:18px;"></i>
                <span>${isAr ? 'المكتبة الدراسية الشخصية' : 'PERSONAL STUDY LIBRARY'}</span>
              </div>
              <span class="psl-privacy-pill" title="${isAr ? 'ملفاتك ومجلداتك خاصة بحسابك فقط' : 'Your files and folders are strictly private to your account'}">
                <i data-lucide="shield-check" style="width:13px;height:13px;"></i>
                <span>${isAr ? `مساحة خاصة • ${this.escapeHtml(userName)}` : `Private Workspace • ${this.escapeHtml(userName)}`}</span>
              </span>
            </div>

            <h1 class="psl-title">
              ${currentFolder ? this.escapeHtml(currentFolder.name) : (isAr ? 'مكتبتي الدراسية' : 'My Study Library')}
            </h1>
            <p class="psl-subtitle">
              ${currentFolder
                ? (isAr ? 'نظم ملفاتك، أنشئ مجلدات فرعية، أو افتح أي ملف للدراسة والتسجيل الصوتي المباشر.' : 'Organize your files, create subfolders, or open any file to study and record audio.')
                : (isAr ? 'مساحة عملك الخاصة على غرار GoodNotes — أنشئ مجلداتك الخاصة، ارفع ملفاتك، وادرس مع نظام التسجيل الصوتي المدمج.' : 'Your GoodNotes-style study workspace — create custom folders, import PDFs & images, and study with integrated audio recording.')
              }
            </p>

            <div class="psl-stats-strip">
              <div class="psl-stat-chip">
                <i data-lucide="folder" style="width:14px;height:14px;"></i>
                <span><strong>${allFoldersCount}</strong> ${isAr ? 'مجلد' : 'Folders'}</span>
              </div>
              <div class="psl-stat-chip">
                <i data-lucide="file-text" style="width:14px;height:14px;"></i>
                <span><strong>${allFilesCount}</strong> ${isAr ? 'ملف دراسي' : 'Study Files'}</span>
              </div>
            </div>
          </div>

          <div class="psl-header-actions">
            <button type="button" class="psl-btn psl-btn-secondary" id="psl-btn-new-folder">
              <i data-lucide="folder-plus" style="width:17px;height:17px;"></i>
              <span>${currentFolder
                ? (isAr ? 'مجلد فرعي جديد' : 'New Subfolder')
                : (isAr ? 'إنشاء مجلد جديد' : 'New Folder')
              }</span>
            </button>

            <button type="button" class="psl-btn psl-btn-primary" id="psl-btn-import-files">
              <i data-lucide="upload" style="width:17px;height:17px;"></i>
              <span>${isAr ? 'رفع ملفات (PDF / صور)' : 'Import Files'}</span>
            </button>
            <input type="file" id="psl-file-input" multiple accept=".pdf,application/pdf,image/png,image/jpeg,image/webp,image/gif,image/svg+xml" style="display:none;" />
          </div>
        </header>

        <!-- Upload Progress Banner -->
        ${this.isUploading ? `
          <div class="psl-upload-banner">
            <div class="psl-spinner"></div>
            <span>${this.escapeHtml(this.uploadStatusText || (isAr ? 'جاري استيراد ومعالجة الملفات...' : 'Importing and processing files...'))}</span>
          </div>
        ` : ''}

        <!-- Toolbar: Breadcrumbs + Search + Sort & View Switcher -->
        <div class="psl-toolbar">
          <nav class="psl-breadcrumbs" aria-label="Breadcrumb">
            <button type="button" class="psl-crumb ${!this.currentFolderId ? 'active' : ''}" data-crumb-folder="">
              <i data-lucide="home" style="width:15px;height:15px;"></i>
              <span>${isAr ? 'المكتبة الرئيسية' : 'Root Library'}</span>
            </button>
            ${breadcrumbs.map((b, idx) => `
              <span class="psl-crumb-sep"><i data-lucide="${isAr ? 'chevron-left' : 'chevron-right'}" style="width:14px;height:14px;"></i></span>
              <button type="button" class="psl-crumb ${idx === breadcrumbs.length - 1 ? 'active' : ''}" data-crumb-folder="${b.id}">
                <span>${this.escapeHtml(b.name)}</span>
              </button>
            `).join('')}
          </nav>

          <div class="psl-toolbar-controls">
            <!-- Search Input -->
            <div class="psl-search-box">
              <i data-lucide="search" class="psl-search-icon" style="width:15px;height:15px;"></i>
              <input
                type="search"
                id="psl-search-input"
                class="psl-search-input"
                value="${this.escapeHtml(this.searchQuery)}"
                placeholder="${isAr ? 'ابحث عن مجلد أو ملف...' : 'Search folders or files...'}"
              />
              ${this.searchQuery ? `
                <button type="button" id="psl-search-clear" class="psl-search-clear" title="${isAr ? 'مسح البحث' : 'Clear'}">✕</button>
              ` : ''}
            </div>

            <!-- Sort Selector -->
            <select id="psl-sort-select" class="psl-select" title="${isAr ? 'ترتيب الملفات' : 'Sort files'}">
              <option value="custom" ${this.sortBy === 'custom' ? 'selected' : ''}>${isAr ? 'ترتيب مخصص (سحب وإفلات)' : 'Custom Order (Drag & Drop)'}</option>
              <option value="date" ${this.sortBy === 'date' ? 'selected' : ''}>${isAr ? 'الأحدث إضافة' : 'Newest First'}</option>
              <option value="name" ${this.sortBy === 'name' ? 'selected' : ''}>${isAr ? 'الاسم (أ - ي)' : 'Name (A - Z)'}</option>
              <option value="pages" ${this.sortBy === 'pages' ? 'selected' : ''}>${isAr ? 'عدد الصفحات' : 'Page Count'}</option>
            </select>

            <!-- View Mode Toggle -->
            <div class="psl-view-toggle">
              <button type="button" class="psl-view-btn ${this.viewMode === 'grid' ? 'active' : ''}" data-view="grid" title="${isAr ? 'عرض شبكي' : 'Grid View'}">
                <i data-lucide="grid" style="width:15px;height:15px;"></i>
              </button>
              <button type="button" class="psl-view-btn ${this.viewMode === 'list' ? 'active' : ''}" data-view="list" title="${isAr ? 'عرض قائمة' : 'List View'}">
                <i data-lucide="list" style="width:15px;height:15px;"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Main Workspace Content -->
        <div class="psl-content">
          ${folders.length === 0 && files.length === 0 ? this.renderEmptyWorkspace(isAr, currentFolder, isSearching) : `
            
            <!-- FOLDERS SECTION -->
            ${folders.length > 0 ? `
              <section class="psl-section">
                <div class="psl-section-header">
                  <div class="psl-section-title">
                    <i data-lucide="folders" style="width:17px;height:17px;color:var(--brand-accent,#0ea5e9);"></i>
                    <h2>${currentFolder && !isSearching
                      ? (isAr ? 'المجلدات الفرعية' : 'Subfolders')
                      : (isAr ? 'المجلدات الدراسية' : 'Study Folders')
                    }</h2>
                    <span class="psl-count-pill">${folders.length}</span>
                  </div>
                  <span class="psl-drag-hint">
                    <i data-lucide="move" style="width:13px;height:13px;"></i>
                    <span>${isAr ? 'اسحب المجلدات لإعادة ترتيبها أو أفلت ملفاً فوق مجلد لنقله' : 'Drag folders to reorder or drop a file onto a folder to move it'}</span>
                  </span>
                </div>

                <div class="psl-folders-grid ${this.viewMode === 'list' ? 'list-mode' : ''}" id="psl-folders-grid">
                  ${folders.map(folder => this.renderFolderCard(folder, lib, isAr)).join('')}
                </div>
              </section>
            ` : ''}

            <!-- FILES SECTION -->
            <section class="psl-section">
              <div class="psl-section-header">
                <div class="psl-section-title">
                  <i data-lucide="file-stack" style="width:17px;height:17px;color:#10b981;"></i>
                  <h2>${currentFolder && !isSearching
                    ? (isAr ? `ملفات "${this.escapeHtml(currentFolder.name)}"` : `Files in "${this.escapeHtml(currentFolder.name)}"`)
                    : (isAr ? 'الملفات والمحاضرات' : 'Study Files & Handouts')
                  }</h2>
                  <span class="psl-count-pill">${files.length}</span>
                </div>
                <div style="display:flex;align-items:center;gap:10px;">
                  <button type="button" class="psl-btn-inline-upload" id="psl-btn-inline-upload">
                    <i data-lucide="plus-circle" style="width:14px;height:14px;"></i>
                    <span>${isAr ? 'إضافة ملفات هنا' : 'Add files here'}</span>
                  </button>
                </div>
              </div>

              ${files.length === 0 ? `
                <div class="psl-folder-empty-dropzone" id="psl-empty-files-dropzone">
                  <i data-lucide="file-plus-2" style="width:28px;height:28px;color:var(--text-muted);margin-bottom:8px;"></i>
                  <p>${isAr ? 'لا توجد ملفات في هذا المستوى بعد — اضغط لرفع ملفات PDF أو صور أو اسحبها إلى هنا' : 'No files in this folder yet — click to import PDFs or images or drag them here'}</p>
                </div>
              ` : `
                <div class="psl-files-grid ${this.viewMode === 'list' ? 'list-mode' : ''}" id="psl-files-grid">
                  ${files.map(file => this.renderFileCard(file, lib, isAr)).join('')}
                </div>
              `}
            </section>
          `}
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
    this.bindEvents(container, isAr);
  },

  renderEmptyWorkspace(isAr, currentFolder, isSearching) {
    if (isSearching) {
      return `
        <div class="psl-empty-state">
          <div class="psl-empty-icon">
            <i data-lucide="search-x" style="width:36px;height:36px;"></i>
          </div>
          <h3>${isAr ? 'لا توجد نتائج مطابقة لبحثك' : 'No matching folders or files'}</h3>
          <p>${isAr ? 'جرب البحث بكلمات أخرى أو امسح مربع البحث للعودة لمكتبتك.' : 'Try another search term or clear the search filter.'}</p>
        </div>
      `;
    }

    return `
      <div class="psl-empty-state" id="psl-empty-workspace-card">
        <div class="psl-empty-icon">
          <i data-lucide="${currentFolder ? 'folder-open' : 'sparkles'}" style="width:38px;height:38px;"></i>
        </div>
        <h3>
          ${currentFolder
            ? (isAr ? `مجلد "${this.escapeHtml(currentFolder.name)}" فارغ حالياً` : `"${this.escapeHtml(currentFolder.name)}" is currently empty`)
            : (isAr ? 'مساحة دراستك الشخصية جاهزة للتنظيم' : 'Your Personal Study Workspace is Ready')
          }
        </h3>
        <p>
          ${currentFolder
            ? (isAr ? 'يمكنك إنشاء مجلدات فرعية داخل هذا المجلد (مثل: المراجعات، العمل العملي) أو رفع ملفات PDF والصور مباشرة من جهازك.' : 'Create subfolders inside this folder or import PDFs and images directly from your device.')
            : (isAr ? 'لا توجد مواد أو ملفات مفروضة مسبقاً. أنشئ مجلداتك الخاصة بالمواد التي تدرسها (مثل: Oral Pathology) وارفع ملفاتك ومحاضراتك لتبدأ الدراسة والتدوين والتسجيل الصوتي.' : 'No pre-imposed subjects or files. Create your own folders (e.g., Oral Pathology) and import your lecture PDFs & images to annotate and record audio.')
          }
        </p>

        <div class="psl-empty-actions">
          <button type="button" class="psl-btn psl-btn-primary" id="psl-empty-btn-import">
            <i data-lucide="upload-cloud" style="width:18px;height:18px;"></i>
            <span>${isAr ? 'رفع ملفات من جهازك (PDF / صور)' : 'Import Files from Device'}</span>
          </button>
          <button type="button" class="psl-btn psl-btn-secondary" id="psl-empty-btn-folder">
            <i data-lucide="folder-plus" style="width:18px;height:18px;"></i>
            <span>${currentFolder ? (isAr ? 'إنشاء مجلد فرعي' : 'Create Subfolder') : (isAr ? 'إنشاء مجلد جديد' : 'Create New Folder')}</span>
          </button>
        </div>

        <div class="psl-empty-features">
          <div class="psl-feature-pill">
            <i data-lucide="pen-tool" style="width:14px;height:14px;"></i>
            <span>${isAr ? 'قلم، تظليل، أشكال، وملاحظات' : 'Pen, Highlighter, Shapes & Notes'}</span>
          </div>
          <div class="psl-feature-pill">
            <i data-lucide="mic" style="width:14px;height:14px;"></i>
            <span>${isAr ? 'تسجيل صوتي لكل صفحة أو للملف بالكامل' : 'Page & Full-Document Audio Recording'}</span>
          </div>
          <div class="psl-feature-pill">
            <i data-lucide="lock" style="width:14px;height:14px;"></i>
            <span>${isAr ? 'محفوظ محلياً وخاص بحسابك 100%' : '100% Private to Your Account'}</span>
          </div>
        </div>
      </div>
    `;
  },

  renderFolderCard(folder, lib, isAr) {
    const colorObj = lib.FOLDER_COLORS.find(c => c.id === folder.color) || lib.FOLDER_COLORS[0];
    const counts = lib.getFolderCounts(folder.id);
    const filesLabel = isAr
      ? `${counts.totalFilesCount} ${counts.totalFilesCount === 1 ? 'ملف' : 'ملفات'}`
      : `${counts.totalFilesCount} ${counts.totalFilesCount === 1 ? 'file' : 'files'}`;
    const subLabel = counts.subfoldersCount > 0
      ? (isAr ? ` • ${counts.subfoldersCount} مجلد فرعي` : ` • ${counts.subfoldersCount} subfolder${counts.subfoldersCount > 1 ? 's' : ''}`)
      : '';

    return `
      <div
        class="psl-folder-card"
        draggable="true"
        data-folder-id="${folder.id}"
        style="--fld-color:${colorObj.hex};--fld-bg:${colorObj.bg};--fld-border:${colorObj.border};"
      >
        <div class="psl-folder-card-body" data-open-folder="${folder.id}">
          <div class="psl-folder-icon-wrap">
            <i data-lucide="${folder.icon || 'folder'}" style="width:24px;height:24px;"></i>
          </div>
          <div class="psl-folder-info">
            <h3 class="psl-folder-name">${this.escapeHtml(folder.name)}</h3>
            <div class="psl-folder-meta">
              <span>${filesLabel}${subLabel}</span>
            </div>
          </div>
        </div>

        <div class="psl-folder-actions">
          <button type="button" class="psl-icon-btn" data-edit-folder="${folder.id}" title="${isAr ? 'تعديل اسم ولون المجلد' : 'Edit Folder'}">
            <i data-lucide="edit-3" style="width:14px;height:14px;"></i>
          </button>
          <button type="button" class="psl-icon-btn danger" data-delete-folder="${folder.id}" title="${isAr ? 'حذف المجلد' : 'Delete Folder'}">
            <i data-lucide="trash-2" style="width:14px;height:14px;"></i>
          </button>
        </div>
      </div>
    `;
  },

  renderFileCard(file, lib, isAr) {
    const recs = lib.getRecordingsForFile(file.id);
    const recsCount = recs.length;
    const isImage = file.fileKind === 'image';
    const pagesCount = file.pages || 1;
    const lastPage = file.lastPage || 1;
    const progressPct = pagesCount > 1 ? Math.min(100, Math.round((lastPage / pagesCount) * 100)) : (file.lastOpenedAt ? 100 : 0);

    return `
      <div
        class="psl-file-card"
        draggable="true"
        data-file-id="${file.id}"
      >
        <div class="psl-file-thumb" data-open-file="${file.id}">
          ${file.thumbnail ? `
            <img src="${file.thumbnail}" alt="${this.escapeHtml(file.title)}" loading="lazy" />
          ` : `
            <div class="psl-file-thumb-placeholder">
              <i data-lucide="${isImage ? 'image' : 'file-text'}" style="width:34px;height:34px;"></i>
              <span>${isImage ? 'IMG' : 'PDF'}</span>
            </div>
          `}
          <div class="psl-file-badges">
            <span class="psl-file-badge type">${isImage ? (isAr ? 'صورة' : 'IMG') : `${pagesCount} ${isAr ? 'ص' : 'p'}`}</span>
            ${recsCount > 0 ? `
              <span class="psl-file-badge audio" title="${isAr ? 'يحتوي على تسجيلات صوتية' : 'Has audio recordings'}">
                <i data-lucide="mic" style="width:11px;height:11px;"></i>
                <span>${recsCount}</span>
              </span>
            ` : ''}
          </div>
          <div class="psl-file-hover-cta">
            <span><i data-lucide="book-open" style="width:15px;height:15px;"></i> ${isAr ? 'فتح للدراسة والتسجيل' : 'Open in Study Reader'}</span>
          </div>
        </div>

        <div class="psl-file-body">
          <div class="psl-file-main" data-open-file="${file.id}">
            <h3 class="psl-file-title" title="${this.escapeHtml(file.title)}">${this.escapeHtml(file.title)}</h3>
            <div class="psl-file-submeta">
              <span>${file.size || ''}</span>
              <span>•</span>
              <span>${file.date || ''}</span>
              ${file.lastOpenedAt ? `
                <span>•</span>
                <span style="color:var(--brand-accent,#38bdf8);">${isAr ? `صفحة ${lastPage}` : `P.${lastPage}`}</span>
              ` : ''}
            </div>
          </div>

          ${progressPct > 0 ? `
            <div class="psl-file-progress" title="${isAr ? `تقدم القراءة: ${progressPct}%` : `Study progress: ${progressPct}%`}">
              <div class="psl-file-progress-bar" style="width:${progressPct}%;"></div>
            </div>
          ` : ''}

          <div class="psl-file-actions">
            <button type="button" class="psl-file-open-btn" data-open-file="${file.id}">
              <i data-lucide="play" style="width:13px;height:13px;"></i>
              <span>${isAr ? 'دراسة' : 'Study'}</span>
            </button>
            <div class="psl-file-icon-actions">
              <button type="button" class="psl-icon-btn" data-move-file="${file.id}" title="${isAr ? 'نقل إلى مجلد آخر' : 'Move to Folder'}">
                <i data-lucide="folder-input" style="width:14px;height:14px;"></i>
              </button>
              <button type="button" class="psl-icon-btn" data-rename-file="${file.id}" title="${isAr ? 'إعادة تسمية الملف' : 'Rename File'}">
                <i data-lucide="edit-2" style="width:14px;height:14px;"></i>
              </button>
              <button type="button" class="psl-icon-btn danger" data-delete-file="${file.id}" title="${isAr ? 'حذف الملف' : 'Delete File'}">
                <i data-lucide="trash-2" style="width:14px;height:14px;"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  bindEvents(container, isAr) {
    const lib = window.PersonalLibrary;
    const fileInput = container.querySelector('#psl-file-input');

    // 1. Trigger File Upload Dialog
    const triggerUpload = () => fileInput?.click();
    container.querySelector('#psl-btn-import-files')?.addEventListener('click', triggerUpload);
    container.querySelector('#psl-empty-btn-import')?.addEventListener('click', triggerUpload);
    container.querySelector('#psl-btn-inline-upload')?.addEventListener('click', triggerUpload);
    container.querySelector('#psl-empty-files-dropzone')?.addEventListener('click', triggerUpload);

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

    // 4. Breadcrumb Navigation (and Drop File onto Breadcrumb to Move Up!)
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

    // 6. Sort & View Mode
    container.querySelector('#psl-sort-select')?.addEventListener('change', (e) => {
      this.sortBy = e.target.value;
      this.renderWorkspace(container, isAr);
    });

    container.querySelectorAll('[data-view]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.viewMode = btn.getAttribute('data-view') || 'grid';
        this.renderWorkspace(container, isAr);
      });
    });

    // 7. Folder Actions (Open, Edit, Delete, Drag & Drop Reorder, Drop File onto Folder)
    container.querySelectorAll('[data-open-folder]').forEach(el => {
      el.addEventListener('click', () => {
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
        const fid = btn.getAttribute('data-delete-folder');
        const folder = lib.getFolderById(fid);
        if (folder) {
          this.openDeleteFolderModal(folder, container, isAr);
        }
      });
    });

    // Folder Drag & Drop (Reordering folders OR dropping a file onto a folder)
    const folderCards = Array.from(container.querySelectorAll('.psl-folder-card'));
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
          // Move file into this folder!
          lib.moveFile(this.draggedItem.id, fid);
          this.draggedItem = null;
          window.showToast?.(isAr ? 'تم نقل الملف إلى المجلد بنجاح' : 'File moved into folder', { type: 'success' });
          this.renderWorkspace(container, isAr);
        } else if (this.draggedItem.type === 'folder' && this.draggedItem.id !== fid) {
          // Reorder folders
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

    // 8. File Actions (Open in PDF Reader, Move, Rename, Delete, Drag & Drop Reorder)
    container.querySelectorAll('[data-open-file]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const fileId = el.getAttribute('data-open-file');
        if (fileId) {
          this.openFileInReader(fileId);
        }
      });
    });

    container.querySelectorAll('[data-move-file]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const fileId = btn.getAttribute('data-move-file');
        const file = lib.getFileById(fileId);
        if (file) this.openMoveFileModal(file, container, isAr);
      });
    });

    container.querySelectorAll('[data-rename-file]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const fileId = btn.getAttribute('data-rename-file');
        const file = lib.getFileById(fileId);
        if (file) this.openRenameFileModal(file, container, isAr);
      });
    });

    container.querySelectorAll('[data-delete-file]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const fileId = btn.getAttribute('data-delete-file');
        const file = lib.getFileById(fileId);
        if (file) this.openDeleteFileModal(file, container, isAr);
      });
    });

    // File Drag & Drop Reordering inside Folder
    const fileCards = Array.from(container.querySelectorAll('.psl-file-card'));
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
            this.sortBy = 'custom';
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
    let importedFiles = [];

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
        isAr ? `تم استيراد "${importedFiles[0].title}" بنجاح! جاري فتح القارئ...` : `Imported "${importedFiles[0].title}"! Opening reader...`,
        { type: 'success' }
      );
      this.openFileInReader(importedFiles[0].id);
    } else if (importedFiles.length > 1) {
      window.showToast?.(
        isAr ? `تم استيراد ${importedFiles.length} ملفات بنجاح إلى مكتبتك!` : `Successfully imported ${importedFiles.length} files!`,
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

    let selectedColor = folder ? folder.color : 'sky';
    let selectedIcon = folder ? folder.icon : 'folder';
    const initialName = folder ? folder.name : '';

    const backdrop = document.createElement('div');
    backdrop.id = 'psl-modal-backdrop';
    backdrop.className = 'psl-modal-backdrop';
    backdrop.dir = isAr ? 'rtl' : 'ltr';

    backdrop.innerHTML = `
      <div class="psl-modal-card">
        <div class="psl-modal-header">
          <h3>
            <i data-lucide="${mode === 'edit' ? 'edit-3' : 'folder-plus'}" style="width:19px;height:19px;color:var(--brand-accent,#0ea5e9);"></i>
            <span>${mode === 'edit'
              ? (isAr ? 'تعديل المجلد' : 'Edit Folder')
              : (parentId ? (isAr ? 'إنشاء مجلد فرعي جديد' : 'Create New Subfolder') : (isAr ? 'إنشاء مجلد دراسي جديد' : 'Create Study Folder'))
            }</span>
          </h3>
          <button type="button" class="psl-modal-close" id="psl-modal-close">✕</button>
        </div>

        <form id="psl-folder-form" class="psl-modal-body">
          <div class="psl-field">
            <label>${isAr ? 'اسم المجلد' : 'Folder Name'}</label>
            <input
              type="text"
              id="psl-folder-name-input"
              class="psl-input"
              value="${this.escapeHtml(initialName)}"
              placeholder="${isAr ? 'مثال: Oral Pathology، المراجعات، المحاضرات...' : 'e.g., Oral Pathology, Reviews, Lectures...'}"
              required
              autofocus
            />
          </div>

          <div class="psl-field">
            <label>${isAr ? 'لون المجلد' : 'Folder Color'}</label>
            <div class="psl-color-grid" id="psl-color-grid">
              ${lib.FOLDER_COLORS.map(c => `
                <button
                  type="button"
                  class="psl-color-swatch ${c.id === selectedColor ? 'active' : ''}"
                  data-color-id="${c.id}"
                  style="--swatch-color:${c.hex};"
                  title="${isAr ? c.labelAr : c.labelEn}"
                ></button>
              `).join('')}
            </div>
          </div>

          <div class="psl-field">
            <label>${isAr ? 'أيقونة المجلد' : 'Folder Icon'}</label>
            <div class="psl-icon-grid" id="psl-icon-grid">
              ${lib.FOLDER_ICONS.map(ic => `
                <button
                  type="button"
                  class="psl-icon-choice ${ic === selectedIcon ? 'active' : ''}"
                  data-icon-id="${ic}"
                >
                  <i data-lucide="${ic}" style="width:18px;height:18px;"></i>
                </button>
              `).join('')}
            </div>
          </div>

          <div class="psl-modal-footer">
            <button type="button" class="psl-btn psl-btn-secondary" id="psl-modal-cancel">
              ${isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button type="submit" class="psl-btn psl-btn-primary">
              <i data-lucide="check" style="width:16px;height:16px;"></i>
              <span>${mode === 'edit' ? (isAr ? 'حفظ التغييرات' : 'Save Changes') : (isAr ? 'إنشاء المجلد' : 'Create Folder')}</span>
            </button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(backdrop);
    if (window.lucide) window.lucide.createIcons();

    const closeModal = () => backdrop.remove();
    backdrop.querySelector('#psl-modal-close')?.addEventListener('click', closeModal);
    backdrop.querySelector('#psl-modal-cancel')?.addEventListener('click', closeModal);
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) closeModal(); });

    backdrop.querySelectorAll('[data-color-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedColor = btn.getAttribute('data-color-id');
        backdrop.querySelectorAll('[data-color-id]').forEach(b => b.classList.toggle('active', b === btn));
      });
    });

    backdrop.querySelectorAll('[data-icon-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedIcon = btn.getAttribute('data-icon-id');
        backdrop.querySelectorAll('[data-icon-id]').forEach(b => b.classList.toggle('active', b === btn));
      });
    });

    backdrop.querySelector('#psl-folder-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameVal = backdrop.querySelector('#psl-folder-name-input')?.value.trim();
      if (!nameVal) return;

      if (mode === 'edit' && folder) {
        lib.updateFolder(folder.id, { name: nameVal, color: selectedColor, icon: selectedIcon });
        window.showToast?.(isAr ? 'تم تحديث المجلد بنجاح' : 'Folder updated', { type: 'success' });
      } else {
        lib.createFolder({ name: nameVal, parentId, color: selectedColor, icon: selectedIcon });
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
    backdrop.className = 'psl-modal-backdrop';
    backdrop.dir = isAr ? 'rtl' : 'ltr';

    backdrop.innerHTML = `
      <div class="psl-modal-card" style="max-width:440px;">
        <div class="psl-modal-header">
          <h3 style="color:#ef4444;">
            <i data-lucide="alert-triangle" style="width:19px;height:19px;"></i>
            <span>${isAr ? 'حذف المجلد' : 'Delete Folder'}</span>
          </h3>
          <button type="button" class="psl-modal-close" id="psl-modal-close">✕</button>
        </div>
        <div class="psl-modal-body">
          <p style="margin:0 0 12px;color:var(--text-primary);font-weight:600;">
            ${isAr ? `هل أنت متأكد من حذف مجلد "${this.escapeHtml(folder.name)}"؟` : `Are you sure you want to delete "${this.escapeHtml(folder.name)}"?`}
          </p>
          ${counts.totalFilesCount > 0 ? `
            <p style="margin:0 0 16px;font-size:0.84rem;color:var(--text-secondary);line-height:1.5;">
              ${isAr
                ? `يحتوي هذا المجلد على ${counts.totalFilesCount} ملف. يمكنك نقل الملفات إلى المستوى الأعلى أو حذف المجلد مع ملفاته.`
                : `This folder contains ${counts.totalFilesCount} file(s). You can keep the files by moving them up, or delete everything.`}
            </p>
          ` : ''}
          <div class="psl-modal-footer" style="flex-wrap:wrap;">
            <button type="button" class="psl-btn psl-btn-secondary" id="psl-modal-cancel">${isAr ? 'إلغاء' : 'Cancel'}</button>
            ${counts.totalFilesCount > 0 ? `
              <button type="button" class="psl-btn psl-btn-secondary" id="psl-btn-keep-files" style="border-color:rgba(14,165,233,0.4);color:#38bdf8;">
                ${isAr ? 'حذف المجلد والاحتفاظ بالملفات' : 'Delete Folder & Keep Files'}
              </button>
            ` : ''}
            <button type="button" class="psl-btn psl-btn-danger" id="psl-btn-confirm-delete">
              <i data-lucide="trash-2" style="width:15px;height:15px;"></i>
              <span>${isAr ? 'حذف نهائي' : 'Delete All'}</span>
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);
    if (window.lucide) window.lucide.createIcons();

    const closeModal = () => backdrop.remove();
    backdrop.querySelector('#psl-modal-close')?.addEventListener('click', closeModal);
    backdrop.querySelector('#psl-modal-cancel')?.addEventListener('click', closeModal);

    backdrop.querySelector('#psl-btn-keep-files')?.addEventListener('click', async () => {
      await lib.deleteFolder(folder.id, { deleteFiles: false });
      closeModal();
      window.showToast?.(isAr ? 'تم حذف المجلد ونقل ملفاته للمستوى الأعلى' : 'Folder deleted and files kept', { type: 'success' });
      this.renderWorkspace(container, isAr);
    });

    backdrop.querySelector('#psl-btn-confirm-delete')?.addEventListener('click', async () => {
      await lib.deleteFolder(folder.id, { deleteFiles: true });
      closeModal();
      window.showToast?.(isAr ? 'تم حذف المجلد بنجاح' : 'Folder deleted', { type: 'success' });
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
    backdrop.className = 'psl-modal-backdrop';
    backdrop.dir = isAr ? 'rtl' : 'ltr';

    backdrop.innerHTML = `
      <div class="psl-modal-card" style="max-width:460px;">
        <div class="psl-modal-header">
          <h3>
            <i data-lucide="folder-input" style="width:19px;height:19px;color:var(--brand-accent,#0ea5e9);"></i>
            <span>${isAr ? 'نقل الملف إلى مجلد آخر' : 'Move File to Folder'}</span>
          </h3>
          <button type="button" class="psl-modal-close" id="psl-modal-close">✕</button>
        </div>

        <form id="psl-move-form" class="psl-modal-body">
          <p style="margin:0 0 12px;font-size:0.86rem;color:var(--text-secondary);">
            ${isAr ? `اختر الوجهة الجديدة للملف "${this.escapeHtml(file.title)}":` : `Select destination folder for "${this.escapeHtml(file.title)}":`}
          </p>
          <div class="psl-field">
            <select id="psl-move-target-select" class="psl-input">
              <option value="" ${!file.folderId ? 'selected' : ''}>🏠 ${isAr ? 'المكتبة الرئيسية (خارج المجلدات)' : 'Root Library'}</option>
              ${allFolders.map(fld => `
                <option value="${fld.id}" ${file.folderId === fld.id ? 'selected' : ''}>
                  📁 ${this.escapeHtml(buildFolderPathLabel(fld))}
                </option>
              `).join('')}
            </select>
          </div>
          <div class="psl-modal-footer">
            <button type="button" class="psl-btn psl-btn-secondary" id="psl-modal-cancel">${isAr ? 'إلغاء' : 'Cancel'}</button>
            <button type="submit" class="psl-btn psl-btn-primary">
              <i data-lucide="check" style="width:15px;height:15px;"></i>
              <span>${isAr ? 'نقل الملف' : 'Move File'}</span>
            </button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(backdrop);
    if (window.lucide) window.lucide.createIcons();

    const closeModal = () => backdrop.remove();
    backdrop.querySelector('#psl-modal-close')?.addEventListener('click', closeModal);
    backdrop.querySelector('#psl-modal-cancel')?.addEventListener('click', closeModal);

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
    backdrop.className = 'psl-modal-backdrop';
    backdrop.dir = isAr ? 'rtl' : 'ltr';

    backdrop.innerHTML = `
      <div class="psl-modal-card" style="max-width:440px;">
        <div class="psl-modal-header">
          <h3>
            <i data-lucide="edit-2" style="width:18px;height:18px;color:var(--brand-accent,#0ea5e9);"></i>
            <span>${isAr ? 'إعادة تسمية الملف' : 'Rename File'}</span>
          </h3>
          <button type="button" class="psl-modal-close" id="psl-modal-close">✕</button>
        </div>
        <form id="psl-rename-file-form" class="psl-modal-body">
          <div class="psl-field">
            <label>${isAr ? 'الاسم الجديد للملف' : 'New File Title'}</label>
            <input type="text" id="psl-rename-input" class="psl-input" value="${this.escapeHtml(file.title)}" required autofocus />
          </div>
          <div class="psl-modal-footer">
            <button type="button" class="psl-btn psl-btn-secondary" id="psl-modal-cancel">${isAr ? 'إلغاء' : 'Cancel'}</button>
            <button type="submit" class="psl-btn psl-btn-primary">${isAr ? 'حفظ الاسم' : 'Save'}</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(backdrop);
    if (window.lucide) window.lucide.createIcons();

    const closeModal = () => backdrop.remove();
    backdrop.querySelector('#psl-modal-close')?.addEventListener('click', closeModal);
    backdrop.querySelector('#psl-modal-cancel')?.addEventListener('click', closeModal);

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
    const recs = lib.getRecordingsForFile(file.id);
    document.getElementById('psl-modal-backdrop')?.remove();

    const backdrop = document.createElement('div');
    backdrop.id = 'psl-modal-backdrop';
    backdrop.className = 'psl-modal-backdrop';
    backdrop.dir = isAr ? 'rtl' : 'ltr';

    backdrop.innerHTML = `
      <div class="psl-modal-card" style="max-width:440px;">
        <div class="psl-modal-header">
          <h3 style="color:#ef4444;">
            <i data-lucide="trash-2" style="width:19px;height:19px;"></i>
            <span>${isAr ? 'حذف الملف الدراسي' : 'Delete Study File'}</span>
          </h3>
          <button type="button" class="psl-modal-close" id="psl-modal-close">✕</button>
        </div>
        <div class="psl-modal-body">
          <p style="margin:0 0 12px;color:var(--text-primary);font-weight:600;">
            ${isAr ? `هل تريد حذف "${this.escapeHtml(file.title)}"؟` : `Delete "${this.escapeHtml(file.title)}"?`}
          </p>
          ${recs.length > 0 ? `
            <div style="padding:10px 12px;border-radius:10px;background:rgba(245,158,11,0.12);border:1px solid rgba(245,158,11,0.3);color:#fbbf24;font-size:0.82rem;margin-bottom:14px;">
              🎙️ ${isAr
                ? `يوجد ${recs.length} تسجيل صوتي مرتبط بهذا الملف. التسجيلات محفوظة بشكل مستقل ولن تضيع إلا إذا اخترت حذفها أيضاً.`
                : `There are ${recs.length} audio recording(s) linked to this file.`}
            </div>
          ` : ''}
          <div class="psl-modal-footer">
            <button type="button" class="psl-btn psl-btn-secondary" id="psl-modal-cancel">${isAr ? 'إلغاء' : 'Cancel'}</button>
            <button type="button" class="psl-btn psl-btn-danger" id="psl-confirm-delete-file">
              ${isAr ? 'حذف الملف' : 'Delete File'}
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);
    if (window.lucide) window.lucide.createIcons();

    const closeModal = () => backdrop.remove();
    backdrop.querySelector('#psl-modal-close')?.addEventListener('click', closeModal);
    backdrop.querySelector('#psl-modal-cancel')?.addEventListener('click', closeModal);

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
    if (document.getElementById('psl-personal-library-styles')) return;
    const style = document.createElement('style');
    style.id = 'psl-personal-library-styles';
    style.textContent = `
      .psl-shell {
        max-width: 1320px;
        margin: 0 auto;
        padding: 20px 20px 90px;
        position: relative;
        min-height: calc(100vh - 90px);
      }

      /* OS Drag Overlay */
      .psl-os-drop-overlay {
        position: fixed;
        inset: 0;
        z-index: 9999;
        background: rgba(9, 13, 22, 0.85);
        backdrop-filter: blur(10px);
        display: none;
        align-items: center;
        justify-content: center;
        padding: 24px;
      }
      .psl-os-drop-overlay.active {
        display: flex;
      }
      .psl-os-drop-box {
        border: 2px dashed #38bdf8;
        background: rgba(14, 165, 233, 0.08);
        border-radius: 20px;
        padding: 48px 36px;
        text-align: center;
        max-width: 520px;
        color: #f8fafc;
      }
      .psl-os-drop-icon {
        width: 76px;
        height: 76px;
        border-radius: 20px;
        background: rgba(14, 165, 233, 0.16);
        color: #38bdf8;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 16px;
      }

      /* Header */
      .psl-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 20px;
        padding: 26px 28px;
        border-radius: 18px;
        background: linear-gradient(145deg, rgba(17, 24, 39, 0.92), rgba(11, 15, 25, 0.96));
        border: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 16px 36px rgba(0, 0, 0, 0.28);
        margin-bottom: 18px;
        flex-wrap: wrap;
      }
      [data-theme="light"], [data-theme="kuro"] .psl-header {
        background: linear-gradient(145deg, #ffffff, #f8fafc);
        border-color: rgba(15, 23, 42, 0.09);
        box-shadow: 0 10px 28px rgba(15, 23, 42, 0.05);
      }
      .psl-brand-row {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
        margin-bottom: 10px;
      }
      .psl-brand-badge {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        padding: 5px 12px;
        border-radius: 8px;
        background: rgba(14, 165, 233, 0.14);
        border: 1px solid rgba(14, 165, 233, 0.3);
        color: #38bdf8;
        font-size: 0.76rem;
        font-weight: 800;
        letter-spacing: 0.03em;
      }
      .psl-privacy-pill {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 4px 10px;
        border-radius: 8px;
        background: rgba(16, 185, 129, 0.12);
        border: 1px solid rgba(16, 185, 129, 0.28);
        color: #34d399;
        font-size: 0.75rem;
        font-weight: 700;
      }
      .psl-title {
        font-size: clamp(1.35rem, 2.4vw, 1.85rem);
        font-weight: 800;
        color: var(--text-primary, #f8fafc);
        margin: 0 0 6px;
      }
      .psl-subtitle {
        font-size: 0.88rem;
        color: var(--text-secondary, #94a3b8);
        margin: 0 0 14px;
        max-width: 680px;
        line-height: 1.55;
      }
      .psl-stats-strip {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
      }
      .psl-stat-chip {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 5px 12px;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.07);
        font-size: 0.78rem;
        color: var(--text-secondary, #cbd5e1);
      }
      [data-theme="light"], [data-theme="kuro"] .psl-stat-chip {
        background: #f1f5f9;
        border-color: #e2e8f0;
        color: #334155;
      }
      .psl-header-actions {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
      }

      /* Buttons */
      .psl-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 10px 18px;
        border-radius: 10px;
        font-size: 0.85rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
        border: 1px solid transparent;
        font-family: inherit;
      }
      .psl-btn:active {
        transform: scale(0.98);
      }
      .psl-btn-primary {
        background: linear-gradient(135deg, #0284c7, #0ea5e9);
        color: #ffffff;
        border-color: rgba(56, 189, 248, 0.4);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 6px 18px rgba(2, 132, 199, 0.32);
      }
      .psl-btn-primary:hover {
        filter: brightness(1.08);
      }
      .psl-btn-secondary {
        background: rgba(255, 255, 255, 0.05);
        color: var(--text-primary, #f8fafc);
        border-color: rgba(255, 255, 255, 0.12);
      }
      [data-theme="light"], [data-theme="kuro"] .psl-btn-secondary {
        background: #f1f5f9;
        color: #0f172a;
        border-color: #cbd5e1;
      }
      .psl-btn-secondary:hover {
        border-color: #38bdf8;
      }
      .psl-btn-danger {
        background: #ef4444;
        color: #ffffff;
      }

      /* Upload Banner */
      .psl-upload-banner {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 18px;
        border-radius: 12px;
        background: rgba(14, 165, 233, 0.14);
        border: 1px solid rgba(56, 189, 248, 0.35);
        color: #38bdf8;
        font-weight: 700;
        font-size: 0.86rem;
        margin-bottom: 16px;
      }
      .psl-spinner {
        width: 18px;
        height: 18px;
        border: 2.5px solid rgba(56, 189, 248, 0.25);
        border-top-color: #38bdf8;
        border-radius: 50%;
        animation: pslSpin 0.75s linear infinite;
      }
      @keyframes pslSpin {
        to { transform: rotate(360deg); }
      }

      /* Toolbar */
      .psl-toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 14px;
        padding: 12px 16px;
        border-radius: 14px;
        background: var(--bg-card, rgba(17, 24, 39, 0.75));
        border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.08));
        margin-bottom: 22px;
        flex-wrap: wrap;
      }
      .psl-breadcrumbs {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
      }
      .psl-crumb {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 11px;
        border-radius: 8px;
        background: transparent;
        border: 1px solid transparent;
        color: var(--text-secondary, #94a3b8);
        font-size: 0.83rem;
        font-weight: 600;
        cursor: pointer;
        font-family: inherit;
        transition: all 0.15s ease;
      }
      .psl-crumb:hover, .psl-crumb.drop-target {
        background: rgba(14, 165, 233, 0.12);
        color: #38bdf8;
        border-color: rgba(56, 189, 248, 0.35);
      }
      .psl-crumb.active {
        background: rgba(14, 165, 233, 0.14);
        color: var(--text-primary, #f8fafc);
        border-color: rgba(14, 165, 233, 0.3);
        font-weight: 800;
      }
      .psl-crumb-sep {
        color: var(--text-muted, #64748b);
        display: inline-flex;
      }

      .psl-toolbar-controls {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
        flex: 1;
        justify-content: flex-end;
      }
      .psl-search-box {
        position: relative;
        min-width: 230px;
        max-width: 340px;
        flex: 1;
      }
      .psl-search-icon {
        position: absolute;
        inset-inline-start: 11px;
        top: 50%;
        transform: translateY(-50%);
        color: var(--text-muted, #64748b);
        pointer-events: none;
      }
      .psl-search-input {
        width: 100%;
        padding: 8px 30px 8px 34px;
        border-radius: 9px;
        border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.1));
        background: rgba(0, 0, 0, 0.2);
        color: var(--text-primary, #f8fafc);
        font-size: 0.83rem;
        font-family: inherit;
      }
      [data-theme="light"], [data-theme="kuro"] .psl-search-input {
        background: #f8fafc;
        border-color: #cbd5e1;
        color: #0f172a;
      }
      .psl-search-input:focus {
        outline: none;
        border-color: #0ea5e9;
      }
      .psl-search-clear {
        position: absolute;
        inset-inline-end: 8px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: var(--text-muted, #94a3b8);
        cursor: pointer;
        font-size: 0.8rem;
      }
      .psl-select {
        padding: 8px 12px;
        border-radius: 9px;
        border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.1));
        background: rgba(0, 0, 0, 0.22);
        color: var(--text-primary, #f8fafc);
        font-size: 0.8rem;
        font-family: inherit;
        cursor: pointer;
      }
      [data-theme="light"], [data-theme="kuro"] .psl-select {
        background: #f8fafc;
        border-color: #cbd5e1;
        color: #0f172a;
      }
      .psl-view-toggle {
        display: inline-flex;
        border-radius: 9px;
        border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.1));
        overflow: hidden;
      }
      .psl-view-btn {
        padding: 7px 10px;
        background: transparent;
        border: none;
        color: var(--text-secondary, #94a3b8);
        cursor: pointer;
        display: inline-flex;
        align-items: center;
      }
      .psl-view-btn.active {
        background: rgba(14, 165, 233, 0.18);
        color: #38bdf8;
      }

      /* Sections */
      .psl-section {
        margin-bottom: 28px;
      }
      .psl-section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 14px;
        gap: 10px;
        flex-wrap: wrap;
      }
      .psl-section-title {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .psl-section-title h2 {
        font-size: 1.05rem;
        font-weight: 800;
        margin: 0;
        color: var(--text-primary, #f8fafc);
      }
      .psl-count-pill {
        padding: 2px 9px;
        border-radius: 999px;
        background: rgba(14, 165, 233, 0.14);
        color: #38bdf8;
        font-size: 0.75rem;
        font-weight: 800;
      }
      .psl-drag-hint {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-size: 0.75rem;
        color: var(--text-muted, #64748b);
      }
      .psl-btn-inline-upload {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        border-radius: 8px;
        background: rgba(16, 185, 129, 0.12);
        border: 1px solid rgba(16, 185, 129, 0.3);
        color: #34d399;
        font-size: 0.78rem;
        font-weight: 700;
        cursor: pointer;
        font-family: inherit;
      }

      /* Folders Grid */
      .psl-folders-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 14px;
      }
      .psl-folders-grid.list-mode {
        grid-template-columns: 1fr;
      }
      .psl-folder-card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 15px 16px;
        border-radius: 14px;
        background: var(--bg-card, rgba(17, 24, 39, 0.85));
        border: 1px solid var(--fld-border, rgba(14, 165, 233, 0.3));
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
        transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
        cursor: pointer;
      }
      .psl-folder-card:hover {
        transform: translateY(-2px);
        border-color: var(--fld-color, #0ea5e9);
        box-shadow: 0 10px 24px rgba(0, 0, 0, 0.22);
      }
      .psl-folder-card.drag-over, .psl-folder-card.drop-target {
        border: 2px dashed var(--fld-color, #38bdf8);
        background: var(--fld-bg);
        transform: scale(1.02);
      }
      .psl-folder-card-body {
        display: flex;
        align-items: center;
        gap: 12px;
        flex: 1;
        min-width: 0;
      }
      .psl-folder-icon-wrap {
        width: 46px;
        height: 46px;
        border-radius: 12px;
        background: var(--fld-bg);
        border: 1px solid var(--fld-border);
        color: var(--fld-color);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .psl-folder-info {
        min-width: 0;
        flex: 1;
      }
      .psl-folder-name {
        font-size: 0.95rem;
        font-weight: 800;
        color: var(--text-primary, #f8fafc);
        margin: 0 0 3px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .psl-folder-meta {
        font-size: 0.76rem;
        color: var(--text-secondary, #94a3b8);
      }
      .psl-folder-actions {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      /* Files Grid */
      .psl-files-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
        gap: 16px;
      }
      .psl-files-grid.list-mode {
        grid-template-columns: 1fr;
      }
      .psl-files-grid.list-mode .psl-file-card {
        flex-direction: row;
        align-items: center;
      }
      .psl-files-grid.list-mode .psl-file-thumb {
        width: 90px;
        height: 76px;
        flex-shrink: 0;
      }
      .psl-file-card {
        display: flex;
        flex-direction: column;
        border-radius: 14px;
        background: var(--bg-card, rgba(17, 24, 39, 0.88));
        border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.08));
        overflow: hidden;
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .psl-file-card:hover {
        transform: translateY(-3px);
        border-color: rgba(56, 189, 248, 0.45);
        box-shadow: 0 14px 30px rgba(0, 0, 0, 0.28);
      }
      .psl-file-card.drag-over {
        border: 2px dashed #38bdf8;
      }
      .psl-file-thumb {
        position: relative;
        height: 156px;
        background: linear-gradient(145deg, #0f172a, #1e293b);
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        cursor: pointer;
      }
      .psl-file-thumb img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .psl-file-thumb-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        color: #38bdf8;
        font-weight: 800;
        font-size: 0.75rem;
      }
      .psl-file-badges {
        position: absolute;
        top: 8px;
        inset-inline-start: 8px;
        display: flex;
        gap: 6px;
      }
      .psl-file-badge {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 3px 8px;
        border-radius: 6px;
        font-size: 0.7rem;
        font-weight: 800;
        backdrop-filter: blur(8px);
      }
      .psl-file-badge.type {
        background: rgba(15, 23, 42, 0.82);
        color: #e2e8f0;
        border: 1px solid rgba(255, 255, 255, 0.12);
      }
      .psl-file-badge.audio {
        background: rgba(239, 68, 68, 0.88);
        color: #ffffff;
      }
      .psl-file-hover-cta {
        position: absolute;
        inset: 0;
        background: rgba(9, 13, 22, 0.72);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.18s ease;
        color: #ffffff;
        font-size: 0.82rem;
        font-weight: 700;
      }
      .psl-file-thumb:hover .psl-file-hover-cta {
        opacity: 1;
      }
      .psl-file-hover-cta span {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 7px 14px;
        border-radius: 9px;
        background: #0284c7;
      }

      .psl-file-body {
        padding: 13px 14px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        flex: 1;
      }
      .psl-file-main {
        cursor: pointer;
      }
      .psl-file-title {
        font-size: 0.9rem;
        font-weight: 800;
        color: var(--text-primary, #f8fafc);
        margin: 0 0 4px;
        line-height: 1.35;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .psl-file-submeta {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.73rem;
        color: var(--text-muted, #94a3b8);
        flex-wrap: wrap;
      }
      .psl-file-progress {
        height: 4px;
        border-radius: 99px;
        background: rgba(255, 255, 255, 0.08);
        overflow: hidden;
      }
      .psl-file-progress-bar {
        height: 100%;
        background: linear-gradient(90deg, #0ea5e9, #10b981);
      }
      .psl-file-actions {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-top: auto;
        padding-top: 8px;
        border-top: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.06));
      }
      .psl-file-open-btn {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 5px 12px;
        border-radius: 7px;
        background: rgba(14, 165, 233, 0.14);
        border: 1px solid rgba(14, 165, 233, 0.3);
        color: #38bdf8;
        font-size: 0.76rem;
        font-weight: 800;
        cursor: pointer;
        font-family: inherit;
      }
      .psl-file-open-btn:hover {
        background: #0284c7;
        color: #ffffff;
      }
      .psl-file-icon-actions {
        display: flex;
        align-items: center;
        gap: 3px;
      }
      .psl-icon-btn {
        width: 28px;
        height: 28px;
        border-radius: 7px;
        border: 1px solid transparent;
        background: transparent;
        color: var(--text-secondary, #94a3b8);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .psl-icon-btn:hover {
        background: rgba(255, 255, 255, 0.07);
        color: var(--text-primary, #f8fafc);
      }
      .psl-icon-btn.danger:hover {
        background: rgba(239, 68, 68, 0.14);
        color: #ef4444;
      }

      /* Empty State */
      .psl-empty-state {
        text-align: center;
        padding: 56px 24px;
        border-radius: 18px;
        background: var(--bg-card, rgba(17, 24, 39, 0.65));
        border: 1.5px dashed var(--border-subtle, rgba(255, 255, 255, 0.14));
        max-width: 680px;
        margin: 24px auto;
      }
      .psl-empty-icon {
        width: 72px;
        height: 72px;
        border-radius: 18px;
        background: rgba(14, 165, 233, 0.12);
        border: 1px solid rgba(14, 165, 233, 0.28);
        color: #38bdf8;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 18px;
      }
      .psl-empty-state h3 {
        font-size: 1.25rem;
        font-weight: 800;
        color: var(--text-primary, #f8fafc);
        margin: 0 0 8px;
      }
      .psl-empty-state p {
        font-size: 0.88rem;
        color: var(--text-secondary, #94a3b8);
        max-width: 520px;
        margin: 0 auto 24px;
        line-height: 1.6;
      }
      .psl-empty-actions {
        display: flex;
        justify-content: center;
        gap: 12px;
        flex-wrap: wrap;
        margin-bottom: 24px;
      }
      .psl-empty-features {
        display: flex;
        justify-content: center;
        gap: 10px;
        flex-wrap: wrap;
      }
      .psl-feature-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 5px 11px;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.04);
        color: var(--text-secondary, #94a3b8);
        font-size: 0.76rem;
      }
      .psl-folder-empty-dropzone {
        padding: 36px 20px;
        border-radius: 14px;
        border: 1.5px dashed var(--border-subtle, rgba(255, 255, 255, 0.14));
        text-align: center;
        cursor: pointer;
        color: var(--text-secondary, #94a3b8);
        font-size: 0.85rem;
        transition: all 0.18s ease;
      }
      .psl-folder-empty-dropzone:hover {
        border-color: #38bdf8;
        background: rgba(14, 165, 233, 0.05);
      }

      /* Modals */
      .psl-modal-backdrop {
        position: fixed;
        inset: 0;
        z-index: 10000;
        background: rgba(9, 13, 22, 0.78);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
      }
      .psl-modal-card {
        width: 100%;
        max-width: 480px;
        border-radius: 16px;
        background: var(--bg-card, #111827);
        border: 1px solid rgba(255, 255, 255, 0.12);
        box-shadow: 0 24px 48px rgba(0, 0, 0, 0.5);
        overflow: hidden;
      }
      [data-theme="light"], [data-theme="kuro"] .psl-modal-card {
        background: #ffffff;
        border-color: #e2e8f0;
      }
      .psl-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        border-bottom: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.08));
      }
      .psl-modal-header h3 {
        margin: 0;
        font-size: 1rem;
        font-weight: 800;
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--text-primary, #f8fafc);
      }
      .psl-modal-close {
        background: none;
        border: none;
        color: var(--text-muted, #94a3b8);
        font-size: 1rem;
        cursor: pointer;
      }
      .psl-modal-body {
        padding: 20px;
      }
      .psl-field {
        margin-bottom: 16px;
      }
      .psl-field label {
        display: block;
        font-size: 0.8rem;
        font-weight: 700;
        color: var(--text-secondary, #cbd5e1);
        margin-bottom: 7px;
      }
      .psl-input {
        width: 100%;
        padding: 10px 13px;
        border-radius: 9px;
        border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.14));
        background: rgba(0, 0, 0, 0.25);
        color: var(--text-primary, #f8fafc);
        font-size: 0.88rem;
        font-family: inherit;
      }
      [data-theme="light"], [data-theme="kuro"] .psl-input {
        background: #f8fafc;
        border-color: #cbd5e1;
        color: #0f172a;
      }
      .psl-color-grid {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }
      .psl-color-swatch {
        width: 32px;
        height: 32px;
        border-radius: 9px;
        background: var(--swatch-color);
        border: 2.5px solid transparent;
        cursor: pointer;
        transition: transform 0.15s ease;
      }
      .psl-color-swatch.active {
        border-color: #ffffff;
        box-shadow: 0 0 0 2px var(--swatch-color);
        transform: scale(1.1);
      }
      .psl-icon-grid {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 8px;
      }
      .psl-icon-choice {
        height: 38px;
        border-radius: 9px;
        border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.1));
        background: rgba(255, 255, 255, 0.03);
        color: var(--text-secondary, #94a3b8);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
      .psl-icon-choice.active {
        background: rgba(14, 165, 233, 0.18);
        border-color: #0ea5e9;
        color: #38bdf8;
      }
      .psl-modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 18px;
      }

      @media (max-width: 640px) {
        .psl-shell { padding: 14px 12px 84px; }
        .psl-header { padding: 18px 16px; }
        .psl-header-actions { width: 100%; }
        .psl-header-actions .psl-btn { flex: 1; }
        .psl-files-grid { grid-template-columns: repeat(auto-fill, minmax(165px, 1fr)); gap: 12px; }
        .psl-file-thumb { height: 125px; }
      }
    `;
    document.head.appendChild(style);
  }
};
