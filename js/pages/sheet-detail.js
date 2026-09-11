/**
 * KURO FANGS — SHEET DETAIL PAGE
 */

const SheetDetailPage = {
  render(container, sheetId) {
    const sheets = window.DATA.sheets;
    const sheet = sheets.find(s => s.id === sheetId) || window.DATA.getDefaultSheets()[0];
    const isFav = window.STORE.isFavorite(sheet.id, 'sheet');

    container.innerHTML = `
      <div style="margin-bottom: 20px;">
        <a href="#/sheets" class="btn btn-secondary" style="font-size: 0.8rem; padding: 6px 12px; margin-bottom: 16px;">
          <i data-lucide="arrow-right" style="width: 14px; height: 14px;"></i>
          العودة لكل المحاضرات
        </a>

        <div class="card" style="padding: 28px; margin-bottom: 24px;">
          <div style="display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
            <div>
              <span class="badge badge-primary" style="margin-bottom: 8px;">${sheet.type || 'شيت محاضرة'}</span>
              <h1 style="font-size: 1.4rem; font-weight: 700; color: var(--text-primary); margin-bottom: 6px;">${sheet.title}</h1>
              <p style="font-size: 0.875rem; color: var(--text-secondary);">
                المادة: <strong>${sheet.subject_name || 'طب الأسنان'}</strong> | الدكتور: <strong>${sheet.doctor_name || 'هيئة التدريس'}</strong> | التاريخ: <strong>${sheet.date || '2026-09-08'}</strong>
              </p>
            </div>

            <div style="display: flex; gap: 10px; align-items: center;">
              <button id="btn-toggle-fav" class="btn ${isFav ? 'btn-soft' : 'btn-secondary'}">
                <i data-lucide="bookmark" style="width: 16px; height: 16px; fill: ${isFav ? 'currentColor' : 'none'};"></i>
                <span id="fav-text">${isFav ? 'محفوظ في المفضلة' : 'حفظ بالمفضلة'}</span>
              </button>
              <button id="btn-download-sheet" class="btn btn-primary">
                <i data-lucide="download" style="width: 16px; height: 16px;"></i>
                تحميل الملف (PDF)
              </button>
            </div>
          </div>
        </div>

        <!-- Sheet PDF Preview Mockup -->
        <div class="card" style="padding: 40px; text-align: center; background: #FAFBF9;">
          <div style="width: 64px; height: 64px; border-radius: 50%; background: #E8F5E9; color: #2E7D32; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
            <i data-lucide="file-check" style="width: 32px; height: 32px;"></i>
          </div>
          <h3 style="font-size: 1.1rem; margin-bottom: 6px;">معاينة ملف المحاضرة متاحة للتحميل المباشر</h3>
          <p style="max-width: 460px; margin: 0 auto 20px; font-size: 0.85rem;">
            تمت مراجعة هذا الشيت وتدقيقه وفق مفردات منهج السنة الثالثة لطب وجراحة الفم والأسنان.
          </p>
          <button class="btn btn-primary" onclick="window.showToast(window.I18N ? (window.I18N.getLang() === 'ar' ? 'تم بدء تحميل الملف بنجاح!' : 'File download started!') : 'تم بدء تحميل الملف بنجاح!', { type: 'success' });">
            <i data-lucide="download" style="width: 16px; height: 16px;"></i>
            تحميل الشيت كاملاً (High Quality PDF)
          </button>
        </div>
      </div>
    `;

    // Favorite toggle listener
    const favBtn = document.getElementById('btn-toggle-fav');
    if (favBtn) {
      favBtn.addEventListener('click', () => {
        const added = window.STORE.toggleFavorite({
          id: sheet.id,
          title: sheet.title,
          type: 'sheet',
          subject_name: sheet.subject_name
        });
        const favText = document.getElementById('fav-text');
        if (added) {
          favBtn.className = 'btn btn-soft';
          if (favText) favText.textContent = 'محفوظ في المفضلة';
        } else {
          favBtn.className = 'btn btn-secondary';
          if (favText) favText.textContent = 'حفظ بالمفضلة';
        }
        if (window.lucide) window.lucide.createIcons();
      });
    }

    const downloadBtn = document.getElementById('btn-download-sheet');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        window.STORE.addPoints(10);
        window.showToast(window.I18N ? (window.I18N.getLang() === 'ar' ? 'تم تحميل المحاضرة بنجاح!' : 'Lecture downloaded successfully!') : 'تم تحميل المحاضرة بنجاح!', { type: 'success', points: 10 });
      });
    }
  }
};

window.SheetDetailPage = SheetDetailPage;
