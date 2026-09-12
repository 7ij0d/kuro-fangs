/**
 * KURO FANGS — DEDICATED FULL-PAGE SHEET & LECTURE EXPERIENCE
 * Full-page dedicated workspace route for each individual sheet, featuring complete metadata,
 * native JNotes interactive document studio, audio summary player, and student discussion board.
 */

const SheetDetailPage = {
  render(container, sheetIdOrQuery, maybeQuery) {
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;
    const t = (k) => window.I18N ? window.I18N.t(k) : k;

    // Handle both /sheet/:id and /sheet-detail?id=...
    let targetId = typeof sheetIdOrQuery === 'string' ? sheetIdOrQuery : null;
    if (!targetId && sheetIdOrQuery instanceof URLSearchParams) {
      targetId = sheetIdOrQuery.get('id');
    }
    if (!targetId && maybeQuery instanceof URLSearchParams) {
      targetId = maybeQuery.get('id');
    }

    const sheets = window.DATA?.sheets || [];
    const subjects = window.DATA?.getSubjects() || [];

    let sheet = sheets.find(s => s.id === targetId);

    // If target is sh-fixed-provisional or not found, fallback to Dr. Hala Alhawij sheet
    if (!sheet || targetId === 'sh-fixed-provisional') {
      sheet = {
        id: 'sh-fixed-provisional',
        subject_id: 'fixed-pros',
        title: 'Provisional Restoration & Temporization (التركيبات المؤقتة وطرق إعدادها)',
        title_ar: 'Provisional Restoration & Temporization (التركيبات المؤقتة وطرق إعدادها)',
        title_en: 'Provisional Restoration & Temporization',
        subject_name: isAr ? 'الاستعاضة السنية الثابتة 2' : 'Fixed Prosthodontics II',
        doctor_name: isAr ? 'د. هالة الحويج (Dr. Hala Alhawij)' : 'Dr. Hala Alhawij',
        university: 'University of Tripoli - School of Dentistry',
        year: '2025-2026',
        pages: 16,
        size: '2.8 MB',
        date: '2026-09-11',
        type: 'PDF Sheet',
        sections_count: 16
      };
    }

    // Normalize metadata
    const title = sheet.title || (isAr ? sheet.title_ar : sheet.title_en);
    const subjectName = sheet.subject_name || (isAr ? 'الاستعاضة السنية الثابتة' : 'Fixed Prosthodontics');
    const doctorName = sheet.doctor_name || (isAr ? 'د. هالة الحويج' : 'Dr. Hala Alhawij');
    const pages = sheet.pages || 16;
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

    if (comments.length === 0) {
      comments = [
        {
          id: 'c1',
          author: 'طالبة طب أسنان - دفعة 2026',
          time: 'منذ ساعتين',
          text: 'سؤال في صفحة 2: ماهو الفرق بين Positive Rake Angle و Negative Rake Angle في أجهزة القطع Rotatory burs؟',
          reply: 'إجابة د. هالة: الـ Positive يزيد كفاءة القطع في الأنسجة اللينة، والـ Negative يزيد قوة الشفرة في حفر المينا والمعادن!'
        }
      ];
    }

    // Generate HTML for the JNotes reader
    const srcDocHTML = window.DocumentViewer 
      ? window.DocumentViewer.generateDocHTML(sheet, isAr)
      : '';

    container.innerHTML = `
      <div class="sheet-studio-fullscreen" style="width: 100vw; height: 100vh; background: #12131F; position: fixed; top: 0; left: 0; z-index: 99999; margin: 0; padding: 0; overflow: hidden;">
        <iframe id="page-dedicated-iframe" style="width: 100%; height: 100%; border: none; display: block;" title="${title}" sandbox="allow-scripts allow-same-origin allow-popups allow-modals"></iframe>
      </div>
    `;

    // Load iframe content
    const iframeEl = document.getElementById('page-dedicated-iframe');
    if (iframeEl && srcDocHTML) {
      iframeEl.srcdoc = srcDocHTML;
    }
  }
};

window.SheetDetailPage = SheetDetailPage;
