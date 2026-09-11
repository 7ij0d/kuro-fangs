/**
 * KURO FANGS — DEDICATED FULL-PAGE SHEET & LECTURE EXPERIENCE
 * Full-page dedicated route for each individual sheet, featuring complete metadata,
 * JNotes interactive document studio with top tool controls, audio summary player, and student discussion board.
 */

const SheetDetailPage = {
  currentAudioPlaying: false,
  audioTimer: null,
  audioDuration: 275, // 4 minutes 35 seconds
  audioCurrentTime: 0,
  audioPlaybackRate: 1.0,

  render(container, sheetIdOrQuery, maybeQuery) {
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;

    // Handle both /sheet/:id, /sheet-detail?id=..., and hash fallback
    let targetId = typeof sheetIdOrQuery === 'string' ? sheetIdOrQuery : null;
    if (!targetId && sheetIdOrQuery instanceof URLSearchParams) {
      targetId = sheetIdOrQuery.get('id');
    }
    if (!targetId && maybeQuery instanceof URLSearchParams) {
      targetId = maybeQuery.get('id');
    }
    if (!targetId && window.location.hash) {
      const match = window.location.hash.match(/[?&]id=([^&]+)/);
      if (match) targetId = decodeURIComponent(match[1]);
    }

    const sheets = window.DATA?.sheets || [];
    let sheet = sheets.find(s => s.id === targetId);

    // Fallback to Dr. Hala Alhawij Fixed Prosthodontics sheet if not found or target is sh-fixed-provisional
    if (!sheet || targetId === 'sh-fixed-provisional') {
      sheet = {
        id: 'sh-fixed-provisional',
        subject_id: 'fixed-pros',
        title: 'Provisional Restoration & Temporization (التركيبات المؤقتة وطرق إعدادها)',
        title_ar: 'Provisional Restoration & Temporization (التركيبات المؤقتة وطرق إعدادها)',
        title_en: 'Provisional Restoration & Temporization',
        subject_name: isAr ? 'الاستعاضة السنية الثابتة 2' : 'Fixed Prosthodontics II',
        doctor_name: isAr ? 'د. هالة الحويج (Dr. Hala Alhawij)' : 'Dr. Hala Alhawij',
        university: 'University of Tripoli - Faculty of Dentistry',
        year: '2025-2026',
        pages: 17,
        size: '2.8 MB',
        date: '2026-09-11',
        type: 'PDF Sheet',
        sections_count: 17,
        topics: [
          'المتطلبات البيولوجية والميكانيكية والجمالية',
          'التيجان مسبقة الصنع (الألمنيوم والبوليكاربونات والأسيتات)',
          'التقنيات السريرية المباشرة وغير المباشرة',
          'مقارنة مواد الريزن PMMA و PEMA و Bis-Acryl المركب',
          'تحذير الإيوجينول المهم وتأثيره على بلمرة الأسمنت الرابط',
          'بروتوكول إنهاء وتلميع حواف اللثة والملف البيولوجي الظاهر',
          'المضاعفات السريرية وحلول انفصال أو كسر التيجان المؤقتة'
        ]
      };
    }

    // Normalize metadata
    const title = sheet.title || (isAr ? sheet.title_ar : sheet.title_en) || 'Provisional Restoration & Temporization';
    const subjectName = sheet.subject_name || (isAr ? 'الاستعاضة السنية الثابتة 2' : 'Fixed Prosthodontics II');
    const doctorName = sheet.doctor_name || (isAr ? 'د. هالة الحويج (Dr. Hala Alhawij)' : 'Dr. Hala Alhawij');
    const universityName = sheet.university || (isAr ? 'جامعة طرابلس • كلية طب وجراحة الفم والأسنان' : 'University of Tripoli • Faculty of Dentistry');
    const pages = sheet.pages || 17;
    const size = sheet.size || '2.8 MB';
    const date = sheet.date || '2026-09-11';
    const fileType = sheet.type || 'PDF Sheet';
    const isFav = window.STORE ? window.STORE.isFavorite(sheet.id, 'sheet') : false;

    // Load saved comments for this sheet
    const commentsKey = 'kf_sheet_comments_' + sheet.id;
    let comments = [];
    try {
      comments = JSON.parse(localStorage.getItem(commentsKey) || '[]');
    } catch (e) {
      comments = [];
    }

    // Default sample Q&A if empty
    if (comments.length === 0) {
      comments = [
        {
          id: 'c1',
          author: isAr ? 'طالبة طب أسنان — الدفعة 33' : 'Dental Student — Batch 33',
          category: isAr ? 'سؤال امتحانات مهم' : 'Exam High-Yield',
          time: isAr ? 'منذ ساعتين' : '2 hours ago',
          text: isAr 
            ? 'سؤال في صفحة 15 بخصوص Eugenol: لماذا يمنع استخدام أسمنت ZOE قبل لصق التيجان النهائية بالريزن؟'
            : 'Question on Page 15: Why is ZOE temporary cement strictly contraindicated before permanent resin bonding?',
          reply: isAr 
            ? 'إجابة د. هالة الحويج (أستاذة المادة): لأن الإيوجينول مركب فينولي (Phenolic radical scavenger) يعيق بلمرة الجذور الحرة Free-radical polymerization للأسمنت الرابط، مما يخفض قوة الالتصاق بنسبة تصل إلى 50% ويؤدي للفشل السريري! البديل هو استخدام Non-Eugenol zinc oxide.'
            : 'Dr. Hala Alhawij: Eugenol is a phenolic radical scavenger that chemically inhibits the free-radical polymerization of permanent adhesive resin cements, decreasing bond strength by up to 50%. Always use Non-Eugenol temporary cement!',
          likes: 6
        },
        {
          id: 'c2',
          author: isAr ? 'طالب سريري — عيادات الفانتوم' : 'Clinical Student — Phantom Lab',
          category: isAr ? 'تطبيق سريري' : 'Clinical Tip',
          time: isAr ? 'منذ 5 ساعات' : '5 hours ago',
          text: isAr 
            ? 'في صفحة 10 عند استخدام تيجان البوليكاربونات، متى يجب إزالة التاج من فم المريض أثناء تصلب الريزن؟'
            : 'On Page 10 for Polycarbonate crowns, at what exact stage must the crown be removed from the preparation?',
          reply: isAr 
            ? 'إجابة المعيد السريري: يجب إزالته فور وصول الأكريل إلى المرحلة المطاطية (Rubbery Stage) لمنع انحباسه في مناطق التقعر (Undercuts) وتجنب انتقال الحرارة المرتفعة إلى لب السن.'
            : 'Teaching Assistant: Must be removed immediately when the resin enters the rubbery stage (2-3 mins) to prevent locking into undercuts and prevent pulpal thermal injury.',
          likes: 4
        }
      ];
      try {
        localStorage.setItem(commentsKey, JSON.stringify(comments));
      } catch (e) {}
    }

    // Generate HTML for the embedded JNotes reader
    const srcDocHTML = window.DocumentViewer 
      ? window.DocumentViewer.generateDocHTML(sheet, isAr)
      : '';

    container.innerHTML = `
      <div class="sheet-detail-page-wrapper">
        
        <!-- Top Breadcrumb & Faculty Verification Bar -->
        <div class="sheet-detail-back-bar" style="margin-bottom: 18px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <a href="#/sheets" class="btn btn-secondary btn-sm" style="display: inline-flex; align-items: center; gap: 8px;">
            <i data-lucide="${isAr ? 'arrow-right' : 'arrow-left'}" style="width: 15px; height: 15px;"></i>
            <span>${isAr ? 'العودة لقائمة المحاضرات والملازم' : 'Back to All Handouts'}</span>
          </a>

          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <span class="sheet-type-pill" style="background: rgba(2, 132, 199, 0.15); color: #0284C7; border: 1px solid rgba(2, 132, 199, 0.3); padding: 5px 12px; border-radius: 8px; font-size: 0.8rem; font-weight: 800;">
              ${subjectName}
            </span>
            <span class="sheet-verified-pill" style="background: rgba(16, 185, 129, 0.15); color: #10B981; border: 1px solid rgba(16, 185, 129, 0.3); padding: 5px 12px; border-radius: 8px; font-size: 0.8rem; font-weight: 800; display: inline-flex; align-items: center; gap: 6px;">
              <i data-lucide="check-circle" style="width: 14px; height: 14px;"></i>
              <span>${isAr ? 'نسخة معتمدة ومحققة 2025-2026' : 'Official Syllabus 2025-2026'}</span>
            </span>
          </div>
        </div>

        <!-- Sheet Dedicated Metadata & Summary Card -->
        <div class="sheet-modern-card" style="margin-bottom: 24px;">
          <div class="sheet-card-top">
            <div class="sheet-badge-group">
              <span class="sheet-type-pill">
                <img src="assets/icons/sheets_cat.png" alt="Sheet" style="width: 18px; height: 18px; border-radius: 50%; object-fit: cover;" />
                ${fileType}
              </span>
              <span style="font-size: 0.825rem; color: var(--text-muted); font-weight: 700;">
                ${universityName}
              </span>
            </div>
            <h1 class="sheet-main-title" style="font-size: 1.65rem; margin-top: 8px; margin-bottom: 10px; line-height: 1.4;">${title}</h1>
            <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 14px;">
              ${isAr ? 'قسم الاستعاضة السنية الثابتة • السنة الثالثة طب وجراحة الفم والأسنان • شيت دراسي شامل للامتحانات النظرية والسريرية' : 'Department of Fixed Prosthodontics • Year 3 Dental Surgery • Comprehensive theoretical and clinical exam syllabus'}
            </p>
          </div>

          <!-- Metadata row -->
          <div class="sheet-card-meta-row" style="margin-top: 8px; margin-bottom: 18px;">
            <div class="sheet-meta-item" title="${isAr ? 'عدد الصفحات' : 'Pages'}">
              <i data-lucide="book-open"></i>
              <span><strong>${pages}</strong> ${isAr ? 'صفحة شاملة' : 'pages'}</span>
            </div>
            <div class="sheet-meta-item" title="${isAr ? 'حجم الملف' : 'Size'}">
              <i data-lucide="hard-drive"></i>
              <span><strong>${size}</strong> ${isAr ? '(PDF عالي الدقة)' : '(HD PDF)'}</span>
            </div>
            <div class="sheet-meta-item" title="${isAr ? 'أستاذة المادة' : 'Lecturer'}">
              <i data-lucide="user-check"></i>
              <span>${isAr ? 'أستاذة المادة:' : 'Lecturer:'} <strong>${doctorName}</strong></span>
            </div>
            <div class="sheet-meta-item" title="${isAr ? 'تاريخ النشر' : 'Published'}">
              <i data-lucide="calendar"></i>
              <span>${date}</span>
            </div>
          </div>

          <!-- Key Syllabus Topics -->
          ${sheet.topics && sheet.topics.length ? `
            <div style="margin-bottom: 18px; padding: 12px 16px; background: var(--bg-surface-subtle); border-radius: 10px; border: 1px solid var(--border-subtle);">
              <div style="font-size: 0.8rem; font-weight: 800; color: var(--brand-primary); margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                <i data-lucide="list-checks" style="width: 15px; height: 15px;"></i>
                <span>${isAr ? 'المحاور الأكاديمية والسريرية في هذا الشيت:' : 'Key Clinical & Academic Topics:'}</span>
              </div>
              <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                ${sheet.topics.map(topic => `
                  <span style="background: rgba(2, 132, 199, 0.08); border: 1px solid rgba(2, 132, 199, 0.2); color: var(--text-primary); font-size: 0.775rem; font-weight: 600; padding: 3px 10px; border-radius: 6px;">
                    • ${topic}
                  </span>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Action Buttons Bar -->
          <div class="sheet-card-actions-row">
            <div class="dual-buttons-group">
              <button id="btn-download-doc-page" class="btn btn-primary btn-action-download">
                <i data-lucide="download" style="width: 16px; height: 16px;"></i>
                <span>${isAr ? 'تنزيل الشيت بصيغة PDF (+10 نقاط)' : 'Download PDF (+10 pts)'}</span>
              </button>

              <button id="btn-audio-summary" class="btn btn-secondary" style="gap: 8px; border-color: rgba(2, 132, 199, 0.4);">
                <i data-lucide="headphones" style="width: 16px; height: 16px; color: #0284C7;"></i>
                <span id="audio-summary-label">${isAr ? 'استماع للملخص الصوتي الذكي' : 'Audio Lecture Summary'}</span>
              </button>
            </div>

            <button id="btn-fav-sheet-page" class="btn btn-secondary btn-sm btn-fav-action">
              <i data-lucide="bookmark" style="width: 15px; height: 15px; fill: ${isFav ? 'currentColor' : 'none'};"></i>
              <span id="fav-label-page">${isFav ? (isAr ? 'في المحفوظات' : 'Saved') : (isAr ? 'حفظ الشيت' : 'Bookmark')}</span>
            </button>
          </div>
        </div>

        <!-- Interactive Audio Lecture Summary Bar (Expandable / Toggleable) -->
        <div id="audio-player-wrap" class="audio-lecture-player-wrap" style="display: none;">
          <div class="audio-header-row">
            <div class="audio-title-wrap">
              <div class="audio-equalizer-bars" id="audio-eq-bars">
                <div class="audio-eq-bar"></div>
                <div class="audio-eq-bar"></div>
                <div class="audio-eq-bar"></div>
                <div class="audio-eq-bar"></div>
                <div class="audio-eq-bar"></div>
              </div>
              <div>
                <h4 style="font-size: 0.95rem; font-weight: 800; color: #F8FAFC; margin-bottom: 2px;">
                  ${isAr ? '🎧 الملخص الصوتي الأكاديمي الذكي • د. هالة الحويج' : '🎧 AI Academic Audio Summary • Dr. Hala Alhawij'}
                </h4>
                <p style="font-size: 0.775rem; color: #94A3B8;">
                  ${isAr ? 'تلخيص صوتي مركز لأهم المحاور الامتحانية والسريرية للاستعاضة المؤقتة' : 'Focused audio summary of core exam & clinical pearls for provisional restorations'}
                </p>
              </div>
            </div>

            <span style="font-size: 0.75rem; background: rgba(2, 132, 199, 0.25); color: #38BDF8; padding: 3px 9px; border-radius: 6px; font-weight: 800;">
              AI AUDIO • 04:35
            </span>
          </div>

          <div class="audio-controls-row">
            <button id="btn-audio-toggle-play" class="btn-audio-play-circle" title="${isAr ? 'تشغيل / إيقاف' : 'Play / Pause'}">
              <i data-lucide="play" id="audio-play-icon" style="width: 18px; height: 18px; margin-left: 2px;"></i>
            </button>

            <div class="audio-scrubber-wrap">
              <span id="audio-time-current" style="font-size: 0.75rem; color: #F8FAFC; font-weight: 700; min-width: 40px;">00:00</span>
              <input type="range" id="audio-progress-slider" class="audio-slider" min="0" max="275" value="0" />
              <span id="audio-time-total" style="font-size: 0.75rem; color: #94A3B8; font-weight: 700; min-width: 40px;">04:35</span>
            </div>

            <button id="btn-audio-speed" class="audio-speed-btn" title="${isAr ? 'تغيير سرعة الصوت' : 'Playback Speed'}">1.0x</button>
          </div>
        </div>

        <!-- JNotes Interactive Reader Studio Workspace (Embedded Directly in Page) -->
        <div id="jnotes-studio-container" class="card" style="padding: 0; overflow: hidden; border-radius: 16px; border: 1px solid var(--border-subtle); margin-bottom: 28px; box-shadow: 0 15px 45px rgba(0,0,0,0.3);">
          
          <!-- Top Tool Controls Bar (Pen, Translucent Highlighter, Eraser, Sticky Notes, Color Swatches, Stroke width) -->
          <div class="jnotes-studio-toolbar">
            
            <!-- Tools Group -->
            <div class="jnotes-tools-group">
              <button class="jnotes-tool-btn active" data-tool="highlighter" id="jnotes-tool-highlighter" title="${isAr ? 'قلم التظليل الفسفوري الشفاف' : 'Translucent Highlighter'}">
                <span>🖍️</span>
                <span>${isAr ? 'تظليل شفاف' : 'Highlighter'}</span>
              </button>

              <button class="jnotes-tool-btn" data-tool="pen" id="jnotes-tool-pen" title="${isAr ? 'قلم الرسم والتعليم اليدوي' : 'Drawing Pen'}">
                <span>✏️</span>
                <span>${isAr ? 'قلم رسم' : 'Pen'}</span>
              </button>

              <button class="jnotes-tool-btn" data-tool="eraser" id="jnotes-tool-eraser" title="${isAr ? 'ممحاة التعديلات والرسومات' : 'Eraser'}">
                <span>🧹</span>
                <span>${isAr ? 'ممحاة' : 'Eraser'}</span>
              </button>

              <button class="jnotes-tool-btn" data-tool="note" id="jnotes-tool-note" title="${isAr ? 'إضافة ملاحظة لاصقة مثبتة' : 'Sticky Notes'}">
                <span>📝</span>
                <span>${isAr ? 'ملاحظة' : 'Sticky Note'}</span>
              </button>
            </div>

            <div class="jnotes-divider"></div>

            <!-- Color Swatches Group -->
            <div class="jnotes-swatches-group" title="${isAr ? 'لوحة الألوان' : 'Color Swatches'}">
              <span class="jnotes-group-label">${isAr ? 'اللون:' : 'Color:'}</span>
              <button class="jnotes-swatch-dot active" data-color="#FEF08A" style="background: #FEF08A;" title="${isAr ? 'أصفر فسفوري' : 'Yellow'}"></button>
              <button class="jnotes-swatch-dot" data-color="#E11D48" style="background: #E11D48;" title="${isAr ? 'أحمر جراحي' : 'Crimson'}"></button>
              <button class="jnotes-swatch-dot" data-color="#0284C7" style="background: #0284C7;" title="${isAr ? 'أزرق سريري' : 'Blue'}"></button>
              <button class="jnotes-swatch-dot" data-color="#10B981" style="background: #10B981;" title="${isAr ? 'أخضر أكاديمي' : 'Green'}"></button>
              <button class="jnotes-swatch-dot" data-color="#8B5CF6" style="background: #8B5CF6;" title="${isAr ? 'بنفسجي' : 'Violet'}"></button>
            </div>

            <div class="jnotes-divider"></div>

            <!-- Stroke Width Selector Group -->
            <div class="jnotes-width-group" title="${isAr ? 'سُمك الخط' : 'Stroke Width'}">
              <span class="jnotes-group-label">${isAr ? 'السُمك:' : 'Width:'}</span>
              <button class="jnotes-width-btn" data-width="2" title="2px">
                <span class="width-indicator" style="width: 4px; height: 4px;"></span>
                <span>2px</span>
              </button>
              <button class="jnotes-width-btn active" data-width="4" title="4px">
                <span class="width-indicator" style="width: 7px; height: 7px;"></span>
                <span>4px</span>
              </button>
              <button class="jnotes-width-btn" data-width="8" title="8px">
                <span class="width-indicator" style="width: 10px; height: 10px;"></span>
                <span>8px</span>
              </button>
            </div>

            <div class="jnotes-divider"></div>

            <!-- Action Buttons: Save, Clear, Fullscreen, Print -->
            <div class="jnotes-actions-group">
              <button id="jnotes-save-btn" class="jnotes-action-btn save-btn" title="${isAr ? 'حفظ التعديلات في حسابي (+5 نقاط)' : 'Save to Account (+5 pts)'}">
                💾 <span id="jnotes-save-label">${isAr ? 'حفظ بحسابي (+5)' : 'Save (+5)'}</span>
              </button>

              <button id="jnotes-clear-btn" class="jnotes-action-btn clear-btn" title="${isAr ? 'مسح التعديلات' : 'Clear All'}">
                🧹 <span>${isAr ? 'مسح' : 'Clear'}</span>
              </button>

              <button id="jnotes-fullscreen-btn" class="jnotes-action-btn icon-only" title="${isAr ? 'ملء الشاشة' : 'Fullscreen'}">
                <i data-lucide="maximize-2" style="width: 14px; height: 14px;"></i>
              </button>

              <button id="jnotes-print-btn" class="jnotes-action-btn icon-only" title="${isAr ? 'طباعة' : 'Print'}">
                <i data-lucide="printer" style="width: 14px; height: 14px;"></i>
              </button>
            </div>
          </div>

          <!-- Embedded Studio Frame -->
          <div id="jnotes-iframe-wrapper" style="width: 100%; height: 850px; background: #12131F; position: relative;">
            <iframe id="page-dedicated-iframe" style="width: 100%; height: 100%; border: none; display: block;" title="${title}" sandbox="allow-scripts allow-same-origin allow-popups"></iframe>
          </div>
        </div>

        <!-- Student Discussion & Q&A Board -->
        <div class="card" style="padding: 24px; margin-bottom: 35px; border-radius: 16px; border: 1px solid var(--border-subtle);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px; flex-wrap: wrap; gap: 8px;">
            <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary); display: flex; align-items: center; gap: 8px;">
              <i data-lucide="message-square" style="width: 20px; height: 20px; color: var(--brand-primary);"></i>
              <span>${isAr ? 'مجتمع الطلبة والمناقشات الأكاديمية حول الشيت' : 'Student Q&A & Academic Discussion'}</span>
            </h3>
            <span style="font-size: 0.8rem; background: rgba(2, 132, 199, 0.12); color: #0284C7; padding: 4px 10px; border-radius: 20px; font-weight: 800;" id="comments-count-pill">
              ${comments.length} ${isAr ? 'ملاحظة ومناقشة' : 'discussions'}
            </span>
          </div>

          <!-- Add Question Form -->
          <div style="background: var(--bg-surface-subtle); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 16px; margin-bottom: 22px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
              <input type="text" id="input-qa-name" class="form-control" placeholder="${isAr ? 'اسمك (أو اترك فارغاً كطالب طب أسنان)...' : 'Your name...'}" style="padding: 8px 12px; font-size: 0.85rem;" />
              <select id="select-qa-category" class="form-control" style="padding: 8px 12px; font-size: 0.85rem;">
                <option value="${isAr ? 'سؤال امتحانات' : 'Exam Question'}">${isAr ? '🎯 سؤال امتحانات' : '🎯 Exam Question'}</option>
                <option value="${isAr ? 'تطبيق سريري' : 'Clinical Tip'}">${isAr ? '🦷 تطبيق سريري وفانتوم' : '🦷 Clinical Tip'}</option>
                <option value="${isAr ? 'استفسار عن صفحة' : 'Page Inquiry'}">${isAr ? '📖 استفسار عن صفحة محددة' : '📖 Page Inquiry'}</option>
                <option value="${isAr ? 'ملاحظة عامة' : 'General Remark'}">${isAr ? '💡 ملاحظة عامة' : '💡 General Remark'}</option>
              </select>
            </div>

            <textarea id="input-new-comment" class="form-control" rows="3" placeholder="${isAr ? 'اكتب استفسارك، سؤالك الامتحاني، أو ملاحظتك الأكاديمية حول هذا الشيت...' : 'Write your question, exam query, or note about this handout...'}" style="width: 100%; padding: 10px 14px; font-size: 0.875rem; margin-bottom: 10px; resize: vertical;"></textarea>
            
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.75rem; color: var(--text-muted);">
                💡 ${isAr ? 'تحصل على +5 نقاط أكاديمية عند المشاركة الهادفة' : 'Earn +5 pts for academic participation'}
              </span>
              <button id="btn-post-comment" class="btn btn-primary" style="padding: 8px 20px;">
                <i data-lucide="send" style="width: 15px; height: 15px;"></i>
                <span>${isAr ? 'إرسال الاستفسار (+5 نقاط)' : 'Post Question (+5 pts)'}</span>
              </button>
            </div>
          </div>

          <!-- Comments List -->
          <div id="comments-list-box" style="display: flex; flex-direction: column; gap: 14px;">
            ${comments.map(c => `
              <div class="qa-comment-card" data-id="${c.id}">
                <div class="qa-header-meta">
                  <div class="qa-user-info">
                    <div class="qa-user-avatar">
                      ${c.author.substring(0, 1)}
                    </div>
                    <div>
                      <div class="qa-author-name">${c.author}</div>
                      <div style="font-size: 0.725rem; color: var(--text-muted);">${c.time}</div>
                    </div>
                  </div>
                  <span class="qa-tag-badge">${c.category || (isAr ? 'سؤال دراسي' : 'Academic')}</span>
                </div>

                <p class="qa-body-text">${c.text}</p>

                ${c.reply ? `
                  <div class="qa-doctor-reply-box">
                    <div class="qa-doctor-header">
                      <i data-lucide="check-circle" style="width: 14px; height: 14px;"></i>
                      <span>${isAr ? 'إجابة معتمدة' : 'Verified Faculty Response'}</span>
                    </div>
                    <div class="qa-doctor-text">
                      ${c.reply}
                    </div>
                  </div>
                ` : ''}

                <div class="qa-actions-row">
                  <button class="btn-helpful-like" data-id="${c.id}" title="${isAr ? 'تصويت كإجابة مفيدة' : 'Mark helpful'}">
                    <span>👍</span>
                    <span>${isAr ? 'مفيد' : 'Helpful'}</span>
                    <strong class="like-count">(${c.likes || 0})</strong>
                  </button>

                  <button class="btn btn-sm btn-delete-qa" data-id="${c.id}" style="background: transparent; border: none; color: var(--text-muted); cursor: pointer; font-size: 0.75rem;" title="${isAr ? 'حذف' : 'Delete'}">
                    <i data-lucide="trash-2" style="width: 13px; height: 13px;"></i>
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    `;

    // Initialize Lucide icons
    if (window.lucide) window.lucide.createIcons();

    // Load iframe content
    const iframeEl = document.getElementById('page-dedicated-iframe');
    if (iframeEl && srcDocHTML) {
      iframeEl.srcdoc = srcDocHTML;
    }

    // Connect JNotes Reader Studio Top Controls
    SheetDetailPage.initStudioControls(iframeEl, isAr);

    // Connect Audio Lecture Summary Player
    SheetDetailPage.initAudioSummary(sheet, isAr);

    // Download PDF Button
    const downloadBtn = document.getElementById('btn-download-doc-page');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        if (window.DocumentViewer) {
          window.DocumentViewer.download(sheet);
        } else {
          window.STORE.addPoints(10);
          window.showToast(isAr ? 'تم بدء التنزيل بنجاح (+10 نقاط)' : 'Download started (+10 pts)', { type: 'success', points: 10 });
        }
      });
    }

    // Favorite button
    const favBtn = document.getElementById('btn-fav-sheet-page');
    if (favBtn) {
      favBtn.addEventListener('click', () => {
        const added = window.STORE.toggleFavorite({
          id: sheet.id,
          title: title,
          type: 'sheet',
          subject_name: subjectName
        });
        const favLabel = document.getElementById('fav-label-page');
        if (added) {
          favBtn.classList.add('active');
          if (favLabel) favLabel.textContent = isAr ? 'في المحفوظات' : 'Saved';
          window.showToast(isAr ? 'تمت إضافة الشيت للمحفوظات' : 'Added to favorites', { type: 'success' });
        } else {
          favBtn.classList.remove('active');
          if (favLabel) favLabel.textContent = isAr ? 'حفظ الشيت' : 'Bookmark';
        }
        if (window.lucide) window.lucide.createIcons();
      });
    }

    // Post Comment in Discussion Board
    const postBtn = document.getElementById('btn-post-comment');
    const inputEl = document.getElementById('input-new-comment');
    const nameInput = document.getElementById('input-qa-name');
    const catSelect = document.getElementById('select-qa-category');

    if (postBtn && inputEl) {
      postBtn.addEventListener('click', () => {
        const val = inputEl.value.trim();
        if (!val) {
          window.showToast(isAr ? 'يرجى كتابة نص السؤال أو المناقشة.' : 'Please write your question first.', { type: 'warning' });
          return;
        }

        const authorName = nameInput && nameInput.value.trim() 
          ? nameInput.value.trim() 
          : (isAr ? 'طالب طب أسنان (الدفعة 33)' : 'Dental Student (Batch 33)');

        const newComment = {
          id: 'c_' + Date.now(),
          author: authorName,
          category: catSelect ? catSelect.value : (isAr ? 'سؤال دراسي' : 'Academic'),
          time: isAr ? 'الآن' : 'Just now',
          text: val,
          likes: 0
        };

        comments.unshift(newComment);
        try {
          localStorage.setItem(commentsKey, JSON.stringify(comments));
        } catch (e) {}

        if (window.STORE && typeof window.STORE.addPoints === 'function') {
          window.STORE.addPoints(5);
        }
        window.showToast(isAr ? 'تم نشر استفسارك بنجاح في مجتمع الطلبة! (+5 نقاط)' : 'Question posted! (+5 pts)', { type: 'success', points: 5 });

        // Re-render
        SheetDetailPage.render(container, sheetIdOrQuery, maybeQuery);
      });
    }

    // Helpful like button & delete button handlers
    container.querySelectorAll('.btn-helpful-like').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const cid = btn.getAttribute('data-id');
        const comm = comments.find(c => c.id === cid);
        if (comm) {
          comm.likes = (comm.likes || 0) + 1;
          try {
            localStorage.setItem(commentsKey, JSON.stringify(comments));
          } catch (e) {}
          btn.classList.add('voted');
          const countEl = btn.querySelector('.like-count');
          if (countEl) countEl.textContent = `(${comm.likes})`;
          window.showToast(isAr ? 'شكراً على تقييمك للإجابة!' : 'Thank you for your feedback!', { type: 'info' });
        }
      });
    });

    container.querySelectorAll('.btn-delete-qa').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const cid = btn.getAttribute('data-id');
        comments = comments.filter(c => c.id !== cid);
        try {
          localStorage.setItem(commentsKey, JSON.stringify(comments));
        } catch (e) {}
        window.showToast(isAr ? 'تم حذف السؤال.' : 'Deleted.', { type: 'info' });
        SheetDetailPage.render(container, sheetIdOrQuery, maybeQuery);
      });
    });
  },

  initStudioControls(iframeEl, isAr) {
    if (!iframeEl) return;

    // Tool switching buttons
    const toolBtns = document.querySelectorAll('.jnotes-tool-btn');
    toolBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tool = btn.getAttribute('data-tool');
        toolBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (iframeEl.contentWindow && typeof iframeEl.contentWindow.setStudioTool === 'function') {
          iframeEl.contentWindow.setStudioTool(tool);
        }
      });
    });

    // Color swatches
    const swatchBtns = document.querySelectorAll('.jnotes-swatch-dot');
    swatchBtns.forEach(dot => {
      dot.addEventListener('click', () => {
        const color = dot.getAttribute('data-color');
        swatchBtns.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');

        if (iframeEl.contentWindow && typeof iframeEl.contentWindow.setStudioColor === 'function') {
          iframeEl.contentWindow.setStudioColor(color);
        }
      });
    });

    // Stroke width buttons
    const widthBtns = document.querySelectorAll('.jnotes-width-btn');
    widthBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const width = btn.getAttribute('data-width');
        widthBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (iframeEl.contentWindow && typeof iframeEl.contentWindow.setStudioWidth === 'function') {
          iframeEl.contentWindow.setStudioWidth(width);
        }
      });
    });

    // Save Annotations Button
    const saveBtn = document.getElementById('jnotes-save-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        if (iframeEl.contentWindow && typeof iframeEl.contentWindow.saveAnnotations === 'function') {
          iframeEl.contentWindow.saveAnnotations();
          if (window.STORE && typeof window.STORE.addPoints === 'function') {
            window.STORE.addPoints(5);
          }
          window.showToast(
            isAr ? 'تم حفظ جميع التعديلات والرسومات والملاحظات في حسابك بنجاح! (+5 نقاط)' : 'All notes, drawings & highlights saved to your account! (+5 pts)',
            { type: 'success', points: 5 }
          );

          const saveLabel = document.getElementById('jnotes-save-label');
          if (saveLabel) {
            const orig = saveLabel.textContent;
            saveLabel.textContent = isAr ? '✅ تم الحفظ!' : '✅ Saved!';
            setTimeout(() => { saveLabel.textContent = orig; }, 2000);
          }
        }
      });
    }

    // Clear Annotations Button
    const clearBtn = document.getElementById('jnotes-clear-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (iframeEl.contentWindow && typeof iframeEl.contentWindow.clearAnnotations === 'function') {
          iframeEl.contentWindow.clearAnnotations();
          window.showToast(isAr ? 'تم مسح كافة التعديلات والملاحظات بنجاح.' : 'All annotations cleared.', { type: 'info' });
        }
      });
    }

    // Fullscreen Toggle
    const fsBtn = document.getElementById('jnotes-fullscreen-btn');
    const studioContainer = document.getElementById('jnotes-studio-container');
    if (fsBtn && studioContainer) {
      fsBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          studioContainer.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      });
    }

    // Print Button
    const printBtn = document.getElementById('jnotes-print-btn');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        if (iframeEl.contentWindow) {
          iframeEl.contentWindow.focus();
          iframeEl.contentWindow.print();
        }
      });
    }
  },

  initAudioSummary(sheet, isAr) {
    const audioBtn = document.getElementById('btn-audio-summary');
    const playerWrap = document.getElementById('audio-player-wrap');
    const togglePlayBtn = document.getElementById('btn-audio-toggle-play');
    const playIcon = document.getElementById('audio-play-icon');
    const eqBars = document.getElementById('audio-eq-bars');
    const slider = document.getElementById('audio-progress-slider');
    const timeCurr = document.getElementById('audio-time-current');
    const speedBtn = document.getElementById('btn-audio-speed');

    let isPlaying = false;
    let timer = null;
    let currentTime = 0;
    const totalTime = SheetDetailPage.audioDuration;
    let speed = 1.0;

    function formatTime(s) {
      const m = Math.floor(s / 60);
      const sec = Math.floor(s % 60);
      return (m < 10 ? '0' : '') + m + ':' + (sec < 10 ? '0' : '') + sec;
    }

    function togglePlay() {
      isPlaying = !isPlaying;

      if (isPlaying) {
        if (playIcon) playIcon.setAttribute('data-lucide', 'pause');
        if (eqBars) eqBars.classList.add('playing');

        // Play synthetic voice summary via Web Speech API if supported
        if ('speechSynthesis' in window && currentTime === 0) {
          window.speechSynthesis.cancel();
          const summarySpeech = isAr 
            ? 'مرحباً بكم في الملخص الصوتي الأكاديمي لمحاضرة دكتورة هالة الحويج في قسم الاستعاضة السنية الثابتة. تتناول المحاضرة التركيبات المؤقتة وأهميتها البيولوجية والميكانيكية. أولاً، المتطلبات البيولوجية لحماية اللب وصحة اللثة، وثانياً التيجان مسبقة الصنع والتقنيات السريرية، ومقارنة مواد الأكريل والريزن، وأهم تحذير امتحاني: تجنب أسمنت الزنك إيوجينول قبل التركيب النهائي بالريزن.'
            : 'Welcome to the academic audio lecture summary for Provisional Restoration by Dr. Hala Alhawij, Faculty of Dentistry.';
          const utterance = new SpeechSynthesisUtterance(summarySpeech);
          utterance.lang = isAr ? 'ar-SA' : 'en-US';
          utterance.rate = speed;
          window.speechSynthesis.speak(utterance);
        }

        // Award points once
        if (currentTime === 0 && window.STORE && typeof window.STORE.addPoints === 'function') {
          window.STORE.addPoints(5);
          window.showToast(isAr ? 'استماع للملخص الصوتي الأكاديمي (+5 نقاط)!' : 'Listening to Audio Summary (+5 pts)!', { type: 'success', points: 5 });
        }

        timer = setInterval(() => {
          currentTime += speed;
          if (currentTime >= totalTime) {
            currentTime = 0;
            togglePlay();
          }
          if (slider) slider.value = currentTime;
          if (timeCurr) timeCurr.textContent = formatTime(currentTime);
        }, 1000);

      } else {
        if (playIcon) playIcon.setAttribute('data-lucide', 'play');
        if (eqBars) eqBars.classList.remove('playing');
        if (timer) clearInterval(timer);
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      }

      if (window.lucide) window.lucide.createIcons();
    }

    if (audioBtn && playerWrap) {
      audioBtn.addEventListener('click', () => {
        if (playerWrap.style.display === 'none') {
          playerWrap.style.display = 'flex';
          togglePlay();
        } else {
          togglePlay();
        }
      });
    }

    if (togglePlayBtn) {
      togglePlayBtn.addEventListener('click', togglePlay);
    }

    if (slider) {
      slider.addEventListener('input', () => {
        currentTime = parseInt(slider.value, 10);
        if (timeCurr) timeCurr.textContent = formatTime(currentTime);
      });
    }

    if (speedBtn) {
      speedBtn.addEventListener('click', () => {
        if (speed === 1.0) speed = 1.25;
        else if (speed === 1.25) speed = 1.5;
        else if (speed === 1.5) speed = 2.0;
        else speed = 1.0;

        speedBtn.textContent = speed + 'x';
        if (isPlaying) {
          // restart interval with new speed
          clearInterval(timer);
          timer = setInterval(() => {
            currentTime += speed;
            if (currentTime >= totalTime) {
              currentTime = 0;
              togglePlay();
            }
            if (slider) slider.value = currentTime;
            if (timeCurr) timeCurr.textContent = formatTime(currentTime);
          }, 1000);
        }
      });
    }
  }
};

window.SheetDetailPage = SheetDetailPage;
