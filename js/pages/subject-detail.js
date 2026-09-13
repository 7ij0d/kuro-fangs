/**
 * KURO FANGS — SUBJECT DETAIL PAGE
 * Comprehensive subject portal with tabs
 */

const SubjectDetailPage = {
  render(container, subjectId) {
    const subject = window.DATA.getSubjectById(subjectId) || window.DATA.getSubjects()[0];
    if (!subject) {
      container.innerHTML = `<div class="card" style="padding: 40px; text-align: center;">المادة غير موجودة. <a href="#/subjects" class="btn btn-primary" style="margin-top: 16px;">العودة للمواد</a></div>`;
      return;
    }

    const sheets = window.DATA.getSheetsBySubject(subject.id);
    const questions = window.DATA.getQuestionsBySubject(subject.id);
    const flashcards = window.DATA.getFlashcards(subject.id);

    container.innerHTML = `
      <div style="margin-bottom: 20px;">
        <a href="#/subjects" class="btn btn-secondary" style="font-size: 0.8rem; padding: 6px 12px; margin-bottom: 14px;">
          <i data-lucide="arrow-right" style="width: 14px; height: 14px;"></i>
          العودة لكل المواد
        </a>

        <!-- Subject Hero Card -->
        <div class="card" style="padding: 24px; border-top: 5px solid ${subject.color || 'var(--brand-primary)'}; margin-bottom: 24px;">
          <div style="display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
            <div style="display: flex; align-items: center; gap: 16px;">
              <div style="width: 56px; height: 56px; border-radius: var(--radius-md); background: ${subject.color || '#2E7D32'}15; display: flex; align-items: center; justify-content: center; font-size: 1.8rem;">
                ${subject.icon || '🦷'}
              </div>
              <div>
                <h1 style="font-size: 1.4rem; font-weight: 700; color: var(--text-primary); margin-bottom: 2px;">${subject.name_ar}</h1>
                <div style="font-size: 0.875rem; color: var(--text-muted); font-family: var(--font-mono);">${subject.name_en} — ${subject.code}</div>
              </div>
            </div>
            <div style="display: flex; gap: 8px;">
              <span class="badge badge-primary">${subject.sheet_count || 18} محاضرة</span>
              <span class="badge badge-warning">السنة الثالثة</span>
            </div>
          </div>
          <p style="margin-top: 14px; font-size: 0.9rem; color: var(--text-secondary);">${subject.description_ar}</p>
        </div>

        <!-- Content Tabs Navigation -->
        <div class="tabs-nav">
          <button class="tab-btn active" data-tab="tab-sheets">
            <i data-lucide="file-text" style="width: 16px; height: 16px; display: inline-block; vertical-align: -2px;"></i>
            المحاضرات والشيتات (${sheets.length || 6})
          </button>
          <button class="tab-btn" data-tab="tab-questions">
            <i data-lucide="help-circle" style="width: 16px; height: 16px; display: inline-block; vertical-align: -2px;"></i>
            بنك الأسئلة (${questions.length || 15})
          </button>
          <button class="tab-btn" data-tab="tab-flashcards">
            <i data-lucide="layers" style="width: 16px; height: 16px; display: inline-block; vertical-align: -2px;"></i>
            البطاقات التعليمية (${flashcards.length || 10})
          </button>
        </div>

        <!-- Tab 1: Sheets -->
        <div id="tab-sheets" class="tab-pane active">
          ${sheets.length === 0 ? (
            window.renderEmptyState
              ? window.renderEmptyState()
              : `
                <div class="empty-state-card">
                  <div class="empty-state-icon-wrap">
                    <i data-lucide="folder-open"></i>
                  </div>
                  <h3 class="empty-state-title">لا توجد محتويات مضافة حالياً</h3>
                  <p class="empty-state-subtitle">جاري رفع واستكمال الملازم والمحتوى الأكاديمي قريباً</p>
                </div>
              `
          ) : `
            <div class="recent-list-view">
              ${sheets.map(s => `
                <div class="recent-list-row">
                  <div class="recent-col-icon">
                    <i data-lucide="file-text"></i>
                  </div>
                  <div class="recent-col-type" style="display: flex; align-items: center; gap: 6px;">
                    ${s.order_index ? `<span class="badge" style="background: rgba(14, 165, 233, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); font-weight: 700; font-size: 0.72rem;">#${s.order_index}</span>` : ''}
                    <span class="badge badge-primary">${s.type || 'شيت'}</span>
                  </div>
                  <div class="recent-col-title" title="${s.title_ar || s.title || ''}">
                    ${s.title_ar || s.title || ''}
                  </div>
                  <div class="recent-col-doctor">
                    ${s.doctor_name || 'هيئة التدريس'}
                  </div>
                  <div class="recent-col-date">
                    ${s.date || '2026-09-05'}
                  </div>
                  <a href="#/sheet/${s.id}" class="recent-col-arrow" title="عرض الشيت">
                    <i data-lucide="arrow-left"></i>
                  </a>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <!-- Tab 2: Questions -->
        <div id="tab-questions" class="tab-pane" style="display: none;">
          <div class="card" style="padding: 20px;">
            <p style="margin-bottom: 16px;">مجموعة أسئلة اختيار من متعدد (MCQs) تغطي مقرر ${subject.name_ar}:</p>
            <a href="#/questions?subject=${subject.id}" class="btn btn-primary">
              <i data-lucide="play" style="width: 16px; height: 16px;"></i>
              بدء حل أسئلة هذه المادة
            </a>
          </div>
        </div>

        <!-- Tab 3: Flashcards -->
        <div id="tab-flashcards" class="tab-pane" style="display: none;">
          <div class="card" style="padding: 20px;">
            <p style="margin-bottom: 16px;">بطاقات تذكر تفاعلية سريعة لتعزيز استذكار المصطلحات والإجراءات الطبية:</p>
            <a href="#/flashcards?subject=${subject.id}" class="btn btn-primary">
              <i data-lucide="layers" style="width: 16px; height: 16px;"></i>
              بدء مراجعة البطاقات
            </a>
          </div>
        </div>
      </div>
    `;

    // Tab switching logic
    container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const targetId = btn.getAttribute('data-tab');
        container.querySelectorAll('.tab-pane').forEach(p => p.style.display = 'none');
        const targetPane = document.getElementById(targetId);
        if (targetPane) targetPane.style.display = 'block';
        if (window.lucide) window.lucide.createIcons();
      });
    });

    // Background cloud sync to pull newly published sheets for this subject
    if (window.DATA && typeof window.DATA.syncCloudSheets === 'function') {
      window.DATA.syncCloudSheets().then((newSheets) => {
        if (Array.isArray(newSheets) && newSheets.length > 0) {
          const updatedSheets = window.DATA.getSheetsBySubject(subject.id);
          const tabSheets = document.getElementById('tab-sheets');
          if (tabSheets && updatedSheets.length > 0) {
            tabSheets.innerHTML = `
              <div class="recent-list-view">
                ${updatedSheets.map(s => `
                  <div class="recent-list-row">
                    <div class="recent-col-icon">
                      <i data-lucide="file-text"></i>
                    </div>
                    <div class="recent-col-type" style="display: flex; align-items: center; gap: 6px;">
                      ${s.order_index ? `<span class="badge" style="background: rgba(14, 165, 233, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); font-weight: 700; font-size: 0.72rem;">#${s.order_index}</span>` : ''}
                      <span class="badge badge-primary">${s.type || 'شيت'}</span>
                    </div>
                    <div class="recent-col-title" title="${s.title_ar || s.title || ''}">
                      ${s.title_ar || s.title || ''}
                    </div>
                    <div class="recent-col-doctor">
                      ${s.doctor_name || 'هيئة التدريس'}
                    </div>
                    <div class="recent-col-date">
                      ${s.date || '2026-09-05'}
                    </div>
                    <a href="#/sheet/${s.id}" class="recent-col-arrow" title="عرض الشيت">
                      <i data-lucide="arrow-left"></i>
                    </a>
                  </div>
                `).join('')}
              </div>
            `;
            if (window.lucide) window.lucide.createIcons();
          }
        }
      }).catch(() => {});
    }
  }
};

window.SubjectDetailPage = SubjectDetailPage;
