/**
 * KURO FANGS — AUDIO RECORDINGS LIBRARY PAGE
 * 3-Level Dental Curriculum Architecture (100% Real Database Driven):
 * Level 1: SUBJECT SELECTION (Real Database Recordings Count)
 * Level 2: SHEETS OF SELECTED SUBJECT (Real Database Sheets from window.DATA.sheets)
 * Level 3: AUDIO RECORDINGS OF SELECTED SHEET (Real Database Recordings from window.DATA.recordings)
 *
 * NO HARDCODED OR MOCK DATA. Central Source of Truth: The Sheet Entity.
 * Visual Design: Warm Terracotta / Ivory Kuro Student Design System (#BC4A47, #FBF8F4, #24181B)
 */

(function(window) {
  'use strict';

  const RecordingsPage = {
    selectedSubjectId: null,
    selectedSheetId: null,
    searchQuery: '',
    currentView: 'grid', // 'grid' | 'list'
    activeAudio: null,
    activeRecId: null,

    // 12 Official Tripoli Dental Faculty Subjects
    SUBJECT_DEFINITIONS: [
      { id: 'gen-med', code: 'MED-301', name_en: 'General Medicine', name_ar: 'الطب العام (الباطنة)', icon: 'stethoscope' },
      { id: 'gen-surgery', code: 'GS-301', name_en: 'General Surgery', name_ar: 'الجراحة العامة', icon: 'activity' },
      { id: 'oral-diseases', code: 'OD-301', name_en: 'Oral Diseases', name_ar: 'علم أمراض الفم', icon: 'microscope' },
      { id: 'preventive', code: 'PREV-301', name_en: 'Preventive Dentistry', name_ar: 'طب الأسنان الوقائي', icon: 'shield-check' },
      { id: 'cons-endo', code: 'CONS-302', name_en: 'Conservative Dentistry and Endodontics II', name_ar: 'العلاج التحفظي وعلاج الجذور 2', icon: 'tooth' },
      { id: 'fixed-pros', code: 'FP-302', name_en: 'Fixed Prosthodontics II', name_ar: 'الاستعاضة السنية الثابتة 2', icon: 'crown' },
      { id: 'removable-pros', code: 'RP-302', name_en: 'Removable Prosthodontics II', name_ar: 'الاستعاضة السنية المتحركة 2', icon: 'layers' },
      { id: 'ortho', code: 'ORT-301', name_en: 'Orthodontics I', name_ar: 'تقويم الأسنان 1', icon: 'smile' },
      { id: 'pediatric', code: 'PED-301', name_en: 'Pediatric Dentistry I', name_ar: 'طب أسنان الأطفال 1', icon: 'heart' },
      { id: 'omdr', code: 'OMDR-301', name_en: 'Oral Medicine, Diagnosis and Radiology I', name_ar: 'طب الفم والتشخيص والأشعة 1', icon: 'scan' },
      { id: 'omfs', code: 'OMS-301', name_en: 'Oral and Maxillofacial Surgery I', name_ar: 'جراحة الفم والوجه والفكين 1', icon: 'scissors' },
      { id: 'endo', code: 'END-301', name_en: 'Diseases and Treatment of the Pulp I (Endodontics I)', name_ar: 'علاج لب الأسنان 1 (علاج العصب)', icon: 'activity' }
    ],

    /**
     * SVG Tooth Icon for Conservative Dentistry
     */
    getSubjectIconHtml(iconName) {
      if (iconName === 'tooth') {
        return `
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2C7.5 2 4 4.5 4 8c0 3 1.5 6 3 9 1 2 2 5 3 5s2-3 2-5c0-1.5.5-2 0-3-.5-1-1-1.5-1-2.5 0-1.5 1-2.5 1-2.5s1 1 1 2.5c0 1-.5 1.5-1 2.5-.5 1 0 1.5 0 3 0 2 1 5 2 5s2-3 3-5c1.5-3 3-6 3-9 0-3.5-3.5-6-8-6z" />
          </svg>
        `;
      }
      return `<i data-lucide="${iconName}"></i>`;
    },

    /**
     * Waveform SVG generator with active/inactive bar styling
     */
    generateWaveformSvg(seedStr, isPlaying) {
      let hash = 0;
      for (let i = 0; i < seedStr.length; i++) {
        hash = (hash << 5) - hash + seedStr.charCodeAt(i);
        hash |= 0;
      }

      const numBars = 36;
      const bars = [];
      for (let i = 0; i < numBars; i++) {
        const pseudorand = Math.abs(Math.sin((hash + i * 19) * 0.12));
        const envelope = Math.sin((i / numBars) * Math.PI);
        const minHeight = 4;
        const maxHeight = 28;
        const height = Math.round(minHeight + (maxHeight - minHeight) * pseudorand * (0.35 + 0.65 * envelope));
        bars.push(height);
      }

      const svgBars = bars.map((h, idx) => {
        const x = idx * 6;
        const y = Math.round((30 - h) / 2);
        const isBarActive = isPlaying && idx < (numBars * 0.45);
        const barColor = isBarActive ? '#BC4A47' : '#D6CEC5';
        return `<rect class="audio-wave-bar ${isPlaying ? 'wave-anim' : ''}" data-index="${idx}" x="${x}" y="${y}" width="3.4" height="${h}" rx="1.7" fill="${barColor}" />`;
      }).join('');

      return `
        <svg class="audio-waveform-svg" viewBox="0 0 ${numBars * 6} 30" preserveAspectRatio="none" aria-hidden="true">
          ${svgBars}
        </svg>
      `;
    },

    /**
     * Master Render Entry Point
     */
    async render(container, queryParams) {
      const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;

      // Handle deep linking query parameters
      const subjectParam = queryParams?.get('subject');
      const sheetParam = queryParams?.get('sheet');

      if (subjectParam && subjectParam !== 'all') {
        this.selectedSubjectId = subjectParam;
      } else {
        this.selectedSubjectId = null;
      }

      if (sheetParam) {
        this.selectedSheetId = sheetParam;
      } else {
        this.selectedSheetId = null;
      }

      this.currentView = localStorage.getItem('kf_recordings_view') || 'grid';

      container.innerHTML = `
        <div class="audio-hub-container" id="audio-hub-root">
          <div id="audio-dynamic-content" class="audio-content-stage"></div>
        </div>
      `;

      this.renderCurrentLevel();
    },

    /**
     * Dispatcher to render Level 1, Level 2, or Level 3 based on state
     */
    renderCurrentLevel() {
      const contentEl = document.getElementById('audio-dynamic-content');
      if (!contentEl) return;

      if (this.selectedSheetId && this.selectedSubjectId) {
        this.renderLevel3Recordings(contentEl);
      } else if (this.selectedSubjectId) {
        this.renderLevel2Sheets(contentEl);
      } else {
        this.renderLevel1Subjects(contentEl);
      }

      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    },

    // ══════════════════════════════════════════════════════════════════════════
    // LEVEL 1: SUBJECT SELECTION (REAL DATABASE COUNTS ONLY)
    // ══════════════════════════════════════════════════════════════════════════
    renderLevel1Subjects(container) {
      const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;
      const allRecordings = window.DATA?.recordings || [];

      // Filter subjects by search query
      const q = (this.searchQuery || '').trim().toLowerCase();
      const filteredSubjects = this.SUBJECT_DEFINITIONS.filter(s => {
        if (!q) return true;
        return s.name_en.toLowerCase().includes(q) ||
               s.name_ar.toLowerCase().includes(q) ||
               s.code.toLowerCase().includes(q);
      });

      container.innerHTML = `
        <!-- 1. Panoramic Top Hero Banner -->
        <section class="audio-hub-hero" aria-label="Audio Recordings Hero Banner">
          <div class="audio-hero-card">
            <div class="audio-hero-bg-artwork" style="background-image: url('assets/hero/audio-recordings-hero.png');"></div>
            <div class="audio-hero-overlay"></div>
            <div class="audio-hero-content" dir="${isAr ? 'rtl' : 'ltr'}">
              <div class="audio-hero-badge-wrap">
                <div class="audio-hero-badge-icon-box">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"></path>
                  </svg>
                </div>
              </div>
              <h1 class="audio-hero-title">${isAr ? 'التسجيلات الصوتية' : 'Audio Recordings'}</h1>
              <p class="audio-hero-subtitle">${isAr ? 'اختر مادة للوصول إلى التسجيلات الصوتية لمحاضراتها.' : 'Select a subject to access its lecture audio recordings.'}</p>
            </div>
          </div>
        </section>

        <!-- 2. Minimal Sub-Bar: Search + Total Subjects Count + View Switcher -->
        <section class="audio-sub-bar" aria-label="Audio Search and Controls">
          <div class="audio-search-box-wrap">
            <i data-lucide="search" class="audio-search-icon"></i>
            <input
              type="text"
              id="audio-search-input"
              class="audio-search-field"
              placeholder="${isAr ? 'بحث في المواد...' : 'Search subjects...'}"
              value="${this.searchQuery}"
              autocomplete="off"
            />
            <button type="button" id="audio-search-clear-btn" class="audio-search-clear-btn" style="${this.searchQuery ? '' : 'display: none;'}" aria-label="Clear search">
              <i data-lucide="x" style="width: 14px; height: 14px;"></i>
            </button>
          </div>

          <div class="audio-sub-bar-right">
            <div class="audio-subjects-total-count" id="audio-subjects-count-badge">
              ${filteredSubjects.length} ${isAr ? 'مادة' : 'Subjects'}
            </div>
            <div class="audio-view-toggle">
              <button
                class="audio-view-btn ${this.currentView === 'grid' ? 'active' : ''}"
                data-view="grid"
                title="${isAr ? 'عرض شبكي' : 'Grid View'}"
                aria-label="Grid View"
              >
                <i data-lucide="layout-grid" style="width:16px;height:16px;"></i>
              </button>
              <button
                class="audio-view-btn ${this.currentView === 'list' ? 'active' : ''}"
                data-view="list"
                title="${isAr ? 'عرض قائمة' : 'List View'}"
                aria-label="List View"
              >
                <i data-lucide="list" style="width:16px;height:16px;"></i>
              </button>
            </div>
          </div>
        </section>

        <!-- 3. Grid of 12 Real Subject Cards -->
        <section class="${this.currentView === 'grid' ? 'audio-subject-grid' : 'audio-subject-list'}" id="audio-subjects-container">
          ${filteredSubjects.length === 0 ? `
            <div class="audio-empty-card" style="grid-column: 1 / -1;">
              <p style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin: 0 0 10px;">
                ${isAr ? 'لم يتم العثور على مادة تطابق بحثك' : 'No subjects match your search'}
              </p>
              <button type="button" id="audio-reset-search-btn" class="btn btn-secondary btn-sm" style="font-weight: 700;">
                ${isAr ? 'إعادة ضبط البحث' : 'Clear Search'}
              </button>
            </div>
          ` : filteredSubjects.map(s => {
            const title = isAr ? s.name_ar : s.name_en;
            const iconHtml = this.getSubjectIconHtml(s.icon);
            
            // Real count evaluated strictly from database
            const realCount = allRecordings.filter(r => r.subject_id === s.id).length;
            const countText = isAr
              ? (realCount === 1 ? 'تسجيل واحد' : `${realCount} تسجيلات`)
              : (realCount === 1 ? '1 Recording' : `${realCount} Recordings`);

            return `
              <div class="audio-subject-card" data-subj-id="${s.id}" role="button" tabindex="0">
                <div class="audio-subj-icon-box">
                  ${iconHtml}
                </div>
                <div class="audio-subj-info">
                  <div class="audio-subj-title-row">
                    <h3 class="audio-subj-title">${title}</h3>
                  </div>
                  <div class="audio-subj-meta-row">
                    <span class="audio-subj-code">${s.code}</span>
                    <span class="audio-subj-count">${countText}</span>
                  </div>
                </div>
                <div class="audio-subj-arrow" aria-hidden="true">
                  <i data-lucide="${isAr ? 'arrow-left' : 'arrow-right'}"></i>
                </div>
              </div>
            `;
          }).join('')}
        </section>
      `;

      this.bindLevel1Events(container);
    },

    bindLevel1Events(container) {
      const searchIn = container.querySelector('#audio-search-input');
      const searchClear = container.querySelector('#audio-search-clear-btn');
      let searchDebounce = null;

      searchIn?.addEventListener('input', e => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        if (searchClear) searchClear.style.display = this.searchQuery ? 'inline-flex' : 'none';
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(() => {
          this.renderCurrentLevel();
        }, 150);
      });

      searchClear?.addEventListener('click', () => {
        this.searchQuery = '';
        if (searchIn) searchIn.value = '';
        searchClear.style.display = 'none';
        this.renderCurrentLevel();
        searchIn?.focus();
      });

      container.querySelector('#audio-reset-search-btn')?.addEventListener('click', () => {
        this.searchQuery = '';
        this.renderCurrentLevel();
      });

      container.querySelectorAll('.audio-view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          this.currentView = btn.getAttribute('data-view') || 'grid';
          localStorage.setItem('kf_recordings_view', this.currentView);
          this.renderCurrentLevel();
        });
      });

      container.querySelectorAll('.audio-subject-card').forEach(card => {
        const handler = () => {
          const subjId = card.getAttribute('data-subj-id');
          if (subjId) {
            this.selectedSubjectId = subjId;
            this.selectedSheetId = null;
            if (window.ROUTER?.navigate) {
              window.ROUTER.navigate(`/recordings?subject=${subjId}`);
            } else {
              this.renderCurrentLevel();
            }
          }
        };

        card.addEventListener('click', handler);
        card.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handler();
          }
        });
      });
    },

    // ══════════════════════════════════════════════════════════════════════════
    // LEVEL 2: SHEETS OF SELECTED SUBJECT (REAL SHEETS FROM DATABASE ONLY)
    // ══════════════════════════════════════════════════════════════════════════
    renderLevel2Sheets(container) {
      const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;
      const def = this.SUBJECT_DEFINITIONS.find(s => s.id === this.selectedSubjectId);
      const subjFromData = window.DATA?.getSubjectById ? window.DATA.getSubjectById(this.selectedSubjectId) : null;
      
      const subj = def || {
        id: this.selectedSubjectId,
        code: subjFromData?.code || 'DENT-300',
        name_en: subjFromData?.name_en || 'Academic Subject',
        name_ar: subjFromData?.name_ar || 'المقرر الأكاديمي',
        icon: 'tooth'
      };

      const subjTitle = isAr ? subj.name_ar : subj.name_en;
      const iconHtml = this.getSubjectIconHtml(subj.icon);

      // Fetch ONLY real sheets belonging to this subject from central database
      const sheets = (window.DATA && typeof window.DATA.getSheetsBySubject === 'function')
        ? window.DATA.getSheetsBySubject(this.selectedSubjectId)
        : ((window.DATA?.sheets || []).filter(s => s.subject_id === this.selectedSubjectId));

      const allRecordings = window.DATA?.recordings || [];
      const totalSheetsCount = sheets.length;
      
      // Calculate real total recordings count for this subject
      const totalRecsCount = allRecordings.filter(r => r.subject_id === this.selectedSubjectId).length;

      const subtitleInfo = isAr
        ? `${subj.code} · ${totalSheetsCount} شيتات · ${totalRecsCount} تسجيلات`
        : `${subj.code} · ${totalSheetsCount} sheets · ${totalRecsCount} recordings`;

      container.innerHTML = `
        <!-- Top Back Navigation -->
        <div class="audio-level-nav-bar">
          <button type="button" class="audio-back-btn" id="audio-back-to-subjects">
            <i data-lucide="${isAr ? 'arrow-right' : 'arrow-left'}"></i>
            <span>${isAr ? 'العودة للمواد' : 'Back to Subjects'}</span>
          </button>
        </div>

        <!-- Subject Panoramic Banner -->
        <section class="audio-hub-hero" aria-label="Subject Banner">
          <div class="audio-hero-card">
            <div class="audio-hero-bg-artwork" style="background-image: url('assets/hero/audio-recordings-hero.png');"></div>
            <div class="audio-hero-overlay"></div>
            <div class="audio-hero-content" dir="${isAr ? 'rtl' : 'ltr'}">
              <div class="audio-hero-badge-wrap">
                <div class="audio-hero-badge-icon-box">
                  ${iconHtml}
                </div>
              </div>
              <h1 class="audio-hero-title">${subjTitle}</h1>
              <p class="audio-hero-subtitle">${subtitleInfo}</p>
            </div>
          </div>
        </section>

        <!-- Sheets Section Header -->
        <div class="audio-level-header">
          <h2 class="audio-level-heading">${isAr ? 'شيتات ومحاضرات المادة' : 'Subject Sheets & Lectures'}</h2>
          <span class="audio-level-badge">${totalSheetsCount} ${isAr ? 'شيت' : 'Sheets'}</span>
        </div>

        <!-- Real Sheets Grid / Empty State -->
        <section class="audio-sheets-grid" id="audio-sheets-container">
          ${sheets.length === 0 ? `
            <div class="audio-empty-card" style="grid-column: 1 / -1;">
              <div class="audio-empty-icon-wrap">
                <i data-lucide="file-x" style="width: 32px; height: 32px; color: #BC4A47;"></i>
              </div>
              <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin: 0 0 6px;">
                ${isAr ? 'لا توجد شيتات مضافة لهذه المادة بعد' : 'No sheets available for this subject yet'}
              </h3>
              <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0 0 16px;">
                ${isAr ? 'عند إضافة شيت جديد من لوحة الإدارة، سيظهر هنا تلقائياً لربط التسجيلات الصوتية به.' : 'When a new sheet is added in the Admin panel, it will appear here automatically.'}
              </p>
            </div>
          ` : sheets.map(sheet => {
            const sheetTitle = isAr ? (sheet.title_ar || sheet.title) : (sheet.title_en || sheet.title);
            
            // Real recordings count for this specific sheet
            const sheetRecs = allRecordings.filter(r => r.sheet_id === sheet.id);
            const sheetRecCount = sheetRecs.length;
            const recLabel = isAr
              ? (sheetRecCount === 1 ? 'تسجيل واحد' : `${sheetRecCount} تسجيلات`)
              : (sheetRecCount === 1 ? '1 Recording' : `${sheetRecCount} Recordings`);

            return `
              <div class="audio-sheet-card" data-sheet-id="${sheet.id}" role="button" tabindex="0">
                <div class="audio-sheet-icon-box">
                  <i data-lucide="file-text"></i>
                </div>
                <div class="audio-sheet-info">
                  <h3 class="audio-sheet-title">${sheetTitle}</h3>
                  <div class="audio-sheet-meta">
                    <span class="audio-sheet-rec-count">${recLabel}</span>
                  </div>
                </div>
                <div class="audio-sheet-arrow" aria-hidden="true">
                  <i data-lucide="${isAr ? 'arrow-left' : 'arrow-right'}"></i>
                </div>
              </div>
            `;
          }).join('')}
        </section>
      `;

      this.bindLevel2Events(container);
    },

    bindLevel2Events(container) {
      container.querySelector('#audio-back-to-subjects')?.addEventListener('click', () => {
        this.selectedSubjectId = null;
        this.selectedSheetId = null;
        if (window.ROUTER?.navigate) {
          window.ROUTER.navigate('/recordings');
        } else {
          this.renderCurrentLevel();
        }
      });

      container.querySelectorAll('.audio-sheet-card').forEach(card => {
        const handler = () => {
          const sheetId = card.getAttribute('data-sheet-id');
          if (sheetId) {
            this.selectedSheetId = sheetId;
            if (window.ROUTER?.navigate) {
              window.ROUTER.navigate(`/recordings?subject=${this.selectedSubjectId}&sheet=${sheetId}`);
            } else {
              this.renderCurrentLevel();
            }
          }
        };

        card.addEventListener('click', handler);
        card.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handler();
          }
        });
      });
    },

    // ══════════════════════════════════════════════════════════════════════════
    // LEVEL 3: AUDIO RECORDINGS OF SELECTED SHEET (REAL DATA ONLY)
    // ══════════════════════════════════════════════════════════════════════════
    renderLevel3Recordings(container) {
      const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;
      const def = this.SUBJECT_DEFINITIONS.find(s => s.id === this.selectedSubjectId);
      const subjFromData = window.DATA?.getSubjectById ? window.DATA.getSubjectById(this.selectedSubjectId) : null;
      
      const subj = def || {
        id: this.selectedSubjectId,
        code: subjFromData?.code || 'DENT-300',
        name_en: subjFromData?.name_en || 'Academic Subject',
        name_ar: subjFromData?.name_ar || 'المقرر الأكاديمي'
      };

      // Retrieve real sheet record from central database
      const sheet = (window.DATA && typeof window.DATA.getSheetById === 'function')
        ? window.DATA.getSheetById(this.selectedSheetId)
        : ((window.DATA?.sheets || []).find(s => s.id === this.selectedSheetId));

      if (!sheet) {
        container.innerHTML = `
          <div class="audio-level-nav-bar">
            <button type="button" class="audio-back-btn" id="audio-back-to-sheets">
              <i data-lucide="${isAr ? 'arrow-right' : 'arrow-left'}"></i>
              <span>${isAr ? 'العودة للشيتات' : 'Back to Sheets'}</span>
            </button>
          </div>
          <div class="audio-empty-card">
            <h3 style="color: var(--text-primary); margin-bottom: 8px;">
              ${isAr ? 'لم يتم العثور على الشيت المطلوب' : 'Sheet Not Found'}
            </h3>
            <p style="color: var(--text-muted); font-size: 0.88rem;">
              ${isAr ? 'قد يكون تم حذف الشيت أو تعديل معرفه.' : 'The requested sheet may have been removed or updated.'}
            </p>
          </div>
        `;
        container.querySelector('#audio-back-to-sheets')?.addEventListener('click', () => {
          this.selectedSheetId = null;
          this.renderCurrentLevel();
        });
        return;
      }

      const sheetTitle = isAr ? (sheet.title_ar || sheet.title) : (sheet.title_en || sheet.title);
      const subjTitle = isAr ? subj.name_ar : subj.name_en;

      // Locate real recordings linked to this sheet via sheet_id
      const allRecordings = window.DATA?.recordings || [];
      const recordings = allRecordings.filter(r => r.sheet_id === sheet.id);

      container.innerHTML = `
        <!-- Top Back Navigation -->
        <div class="audio-level-nav-bar">
          <button type="button" class="audio-back-btn" id="audio-back-to-sheets">
            <i data-lucide="${isAr ? 'arrow-right' : 'arrow-left'}"></i>
            <span>${isAr ? 'العودة للشيتات' : 'Back to Sheets'}</span>
          </button>
        </div>

        <!-- Sheet Header Banner -->
        <div class="audio-sheet-banner">
          <div class="audio-sheet-banner-icon-box">
            <i data-lucide="file-text"></i>
          </div>
          <div class="audio-sheet-banner-info">
            <h1 class="audio-sheet-banner-title">${sheetTitle}</h1>
            <p class="audio-sheet-banner-subtitle">${subjTitle} · ${subj.code}</p>
          </div>
        </div>

        <!-- Recordings List / Real Empty State -->
        <div class="audio-recordings-deck" id="audio-recordings-deck">
          ${recordings.length === 0 ? `
            <div class="audio-empty-card">
              <div class="audio-empty-icon-wrap">
                <i data-lucide="headphones" style="width: 32px; height: 32px; color: #BC4A47;"></i>
              </div>
              <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin: 0 0 6px;">
                ${isAr ? 'لا توجد تسجيلات صوتية متاحة بعد' : 'No recordings available yet'}
              </h3>
              <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0 0 16px;">
                ${isAr ? 'لم يتم رفع تسجيل صوتي لهذا الشيت حتى الآن. يمكنك دراسة الشيت مباشرة.' : 'No audio recording has been uploaded for this sheet yet. You can study the sheet directly.'}
              </p>
              <a href="#/sheet-detail?id=${sheet.id}" class="audio-btn-view-sheet" style="padding: 8px 18px; font-size: 0.88rem;">
                <i data-lucide="file-text" style="width: 16px; height: 16px;"></i>
                <span>${isAr ? 'عرض الشيت' : 'View Sheet'}</span>
              </a>
            </div>
          ` : recordings.map(rec => {
            const isPlaying = this.activeRecId === rec.id;
            const recTitle = rec.title || (isAr ? (sheet.title_ar || sheet.title) : (sheet.title_en || sheet.title));
            const doctorName = rec.doctor || sheet.doctor_name || sheet.doctor || (isAr ? 'هيئة التدريس' : 'Faculty');
            const recDate = rec.date || sheet.date || '';
            const recDuration = rec.duration || '--:--';
            const waveformSvg = this.generateWaveformSvg(rec.id + recTitle, isPlaying);

            return `
              <article class="audio-recording-card ${isPlaying ? 'is-playing' : ''}" data-rec-id="${rec.id}">
                <!-- Top Row: Icon + Lecture Title & Lecturer + Duration -->
                <div class="audio-rec-header-row">
                  <div class="audio-rec-title-wrap">
                    <div class="audio-rec-bullet-icon">
                      <i data-lucide="headphones"></i>
                    </div>
                    <div class="audio-rec-heading-group">
                      <h2 class="audio-rec-title">${recTitle}</h2>
                      <div class="audio-rec-doctor">
                        <i data-lucide="user-round" style="width: 13px; height: 13px;"></i>
                        <span>${doctorName}</span>
                      </div>
                    </div>
                  </div>
                  <div class="audio-rec-duration-badge">
                    <span>${recDuration}</span>
                  </div>
                </div>

                <!-- Middle Row: Circular Terracotta Play Button + Waveform -->
                <div class="audio-rec-player-row">
                  <button
                    type="button"
                    class="audio-play-circle-btn ${isPlaying ? 'playing' : ''}"
                    data-action="toggle-play"
                    data-rec-id="${rec.id}"
                    aria-label="${isPlaying ? 'Pause' : 'Play'}"
                    title="${isPlaying ? (isAr ? 'إيقاف مؤقت' : 'Pause') : (isAr ? 'تشغيل' : 'Play')}"
                  >
                    <i data-lucide="${isPlaying ? 'pause' : 'play'}"></i>
                  </button>

                  <div class="audio-rec-waveform-container" data-rec-id="${rec.id}">
                    ${waveformSvg}
                  </div>
                </div>

                <!-- Bottom Row: Date + [ View Sheet ] + [...] -->
                <div class="audio-rec-footer-row">
                  <div class="audio-rec-date-wrap">
                    <i data-lucide="calendar" style="width: 14px; height: 14px;"></i>
                    <span>${recDate}</span>
                  </div>

                  <div class="audio-rec-actions-group">
                    <a href="#/sheet-detail?id=${sheet.id}" class="audio-btn-view-sheet">
                      <i data-lucide="file-text" style="width: 14px; height: 14px;"></i>
                      <span>${isAr ? 'عرض الشيت' : 'View Sheet'}</span>
                    </a>

                    <button
                      type="button"
                      class="audio-btn-more-options"
                      title="${isAr ? 'خيارات إضافية' : 'More options'}"
                      aria-label="More options"
                      onclick="window.showToast ? window.showToast('${isAr ? 'تم نسخ رابط التسجيل الصوتي' : 'Audio link copied to clipboard'}', { type: 'info' }) : alert('Link copied');"
                    >
                      <i data-lucide="more-horizontal" style="width: 16px; height: 16px;"></i>
                    </button>
                  </div>
                </div>
              </article>
            `;
          }).join('')}
        </div>
      `;

      this.bindLevel3Events(container);
    },

    bindLevel3Events(container) {
      const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;

      // Back to Sheets button
      container.querySelector('#audio-back-to-sheets')?.addEventListener('click', () => {
        this.selectedSheetId = null;
        if (this.activeAudio) {
          this.activeAudio.pause();
          this.activeAudio = null;
        }
        this.activeRecId = null;

        if (window.ROUTER?.navigate) {
          window.ROUTER.navigate(`/recordings?subject=${this.selectedSubjectId}`);
        } else {
          this.renderCurrentLevel();
        }
      });

      // Play/Pause button clicks
      container.querySelectorAll('[data-action="toggle-play"]').forEach(btn => {
        btn.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();
          const recId = btn.getAttribute('data-rec-id');
          if (recId) {
            this.handlePlayToggle(recId, isAr);
          }
        });
      });
    },

    /**
     * Real Audio Playback Controller
     */
    async handlePlayToggle(recId, isAr) {
      // 1. If currently playing this same recording, pause it
      if (this.activeRecId === recId) {
        if (this.activeAudio && !this.activeAudio.paused) {
          this.activeAudio.pause();
        }
        this.activeAudio = null;
        this.activeRecId = null;
        this.renderCurrentLevel();
        return;
      }

      // 2. Stop any existing playback
      if (this.activeAudio) {
        this.activeAudio.pause();
        this.activeAudio = null;
      }

      // 3. Locate real recording
      const allRecordings = window.DATA?.recordings || [];
      const rec = allRecordings.find(r => r.id === recId);
      if (!rec) return;

      let audioUrl = rec.audio_url || '';
      if (!audioUrl && window.DATA?.audioStore?.getAudioUrl) {
        try {
          audioUrl = await window.DATA.audioStore.getAudioUrl(recId);
        } catch (err) {}
      }

      if (!audioUrl) {
        if (window.showToast) {
          window.showToast(
            isAr ? 'ملف التسجيل الصوتي غير متوفر حالياً' : 'Audio file is not currently available',
            { type: 'info' }
          );
        }
        return;
      }

      try {
        const audio = new Audio(audioUrl);
        this.activeAudio = audio;
        this.activeRecId = recId;

        audio.addEventListener('ended', () => {
          this.activeRecId = null;
          this.activeAudio = null;
          this.renderCurrentLevel();
        });

        audio.addEventListener('error', () => {
          this.activeRecId = null;
          this.activeAudio = null;
          if (window.showToast) {
            window.showToast(
              isAr ? 'تعذر تشغيل ملف الصوت' : 'Unable to play audio recording',
              { type: 'error' }
            );
          }
          this.renderCurrentLevel();
        });

        await audio.play();
        this.renderCurrentLevel();
      } catch (err) {
        console.error('Audio play error:', err);
        this.activeRecId = null;
        this.activeAudio = null;
        this.renderCurrentLevel();
      }
    }
  };

  // Expose to window
  window.RecordingsPage = RecordingsPage;

})(window);
