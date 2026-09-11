/**
 * KURO FANGS — QUESTION BANK PAGE
 */

const QuestionsPage = {
  render(container) {
    const subjects = window.DATA.getSubjects();
    const questions = [
      { id: 'bq-1', subject_id: 'omfs', subject_name: 'جراحة الفم والفكين 1', text: 'ما هو الإجراء الفوري الأول عند حدوث إغماء وعائي مبهمي (Vasovagal Syncope) لعيادة الأسنان؟', answer: 'وضع المريض في وضعية ترندلنبورغ (Trendelenburg position) برفع الساقين أعلى من مستوى الرأس لضمان تدفق الدم إلى الدماغ وإيقاف أي علاج فوراً.', tags: ['تخدير', 'طوارئ'] },
      { id: 'bq-2', subject_id: 'fixed-pros', subject_name: 'التركيبات الثابتة 2', text: 'ما هي الوظيفة الأساسية للـ Bevel في خط الإنهاء الخاص بالتيجان المعدنية أو الخزفية المعدنية؟', answer: 'تأمين إغلاق حوافي دقيق (Marginal fit) وحماية طبقة المينا غير المدعومة وتقليل سمك طبقة الإسمنت الملتصق عند الحافة.', tags: ['تحضير', 'حواف'] },
      { id: 'bq-3', subject_id: 'endo', subject_name: 'علاج العصب 1', text: 'ما الفرق بين الـ Overextension والـ Overfilling في حشو قنوات الجذور؟', answer: 'الـ Overfilling يعني أن القناة محشوة بشكل ثلاثي الأبعاد جيد مع خروج بسيط للطور الذروي، بينما الـ Overextension يعني تجاوز الحشوة لذروة الجذر دون إحكام سد القناة من الداخل.', tags: ['حشو الجذور', 'أشعة'] },
      { id: 'bq-4', subject_id: 'oral-diseases', subject_name: 'علم أمراض الفم', text: 'ما هو التعريف الدقيق لآفة الكريات البيضاء الفموية (Leukoplakia)؟', answer: 'بقعة أو صفيحة بيضاء على الغشاء المخاطي الفموي لا يمكن مسحها ولا يمكن تشخيصها سريرياً أو نسيجياً كأي مرض آخر محدد، وتعتبر آفة محتملة الخباثة (Potentially malignant).', tags: ['أورام', 'أمراض الفم'] }
    ];

    let filterSubject = 'all';

    const renderList = () => {
      const filtered = filterSubject === 'all' ? questions : questions.filter(q => q.subject_id === filterSubject);
      const listEl = document.getElementById('questions-list');
      if (!listEl) return;

      listEl.innerHTML = filtered.map(q => `
        <div class="card" style="padding: 20px; margin-bottom: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <span class="badge badge-primary">${q.subject_name}</span>
            <div style="display: flex; gap: 4px;">
              ${q.tags.map(t => `<span class="badge badge-gray">#${t}</span>`).join('')}
            </div>
          </div>
          <h3 style="font-size: 1rem; color: var(--text-primary); margin-bottom: 12px; line-height: 1.5;">${q.text}</h3>
          
          <div style="border-top: 1px solid var(--border-subtle); padding-top: 12px; margin-top: 12px;">
            <button class="btn btn-soft toggle-answer-btn" data-id="${q.id}" style="font-size: 0.775rem; padding: 4px 10px;">
              <i data-lucide="eye" style="width: 14px; height: 14px;"></i>
              إظهار الإجابة النموذجية
            </button>
            <div id="ans-${q.id}" style="display: none; margin-top: 12px; padding: 12px 14px; border-radius: var(--radius-sm); background: #F8FAFC; border-right: 3px solid var(--brand-primary); font-size: 0.85rem; color: var(--text-secondary);">
              <strong style="color: var(--brand-primary);">الإجابة:</strong> ${q.answer}
            </div>
          </div>
        </div>
      `).join('');

      if (window.lucide) window.lucide.createIcons();

      container.querySelectorAll('.toggle-answer-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          const ansEl = document.getElementById(`ans-${id}`);
          if (ansEl) {
            const isHidden = ansEl.style.display === 'none';
            ansEl.style.display = isHidden ? 'block' : 'none';
            btn.innerHTML = isHidden 
              ? '<i data-lucide="eye-off" style="width: 14px; height: 14px;"></i> إخفاء الإجابة'
              : '<i data-lucide="eye" style="width: 14px; height: 14px;"></i> إظهار الإجابة النموذجية';
            if (window.lucide) window.lucide.createIcons();
          }
        });
      });
    };

    container.innerHTML = `
      <div class="page-title-bar">
        <div class="page-title-group">
          <h1>
            <i data-lucide="help-circle" style="color: var(--brand-primary); width: 26px; height: 26px;"></i>
            بنك الأسئلة التفاعلي
          </h1>
          <p>أسئلة امتحانية مقالية واختيارية مع شروحاتها وحلولها النموذجية</p>
        </div>
      </div>

      <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 12px; margin-bottom: 16px;">
        <button class="btn btn-primary q-filter" data-id="all" style="font-size: 0.8rem; padding: 6px 14px;">
          جميع المواد
        </button>
        ${subjects.map(s => `
          <button class="btn btn-secondary q-filter" data-id="${s.id}" style="font-size: 0.8rem; padding: 6px 14px; white-space: nowrap;">
            ${s.name_ar}
          </button>
        `).join('')}
      </div>

      <div id="questions-list"></div>
    `;

    renderList();

    container.querySelectorAll('.q-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.q-filter').forEach(b => b.className = 'btn btn-secondary q-filter');
        btn.className = 'btn btn-primary q-filter';
        filterSubject = btn.getAttribute('data-id');
        renderList();
      });
    });
  }
};

window.QuestionsPage = QuestionsPage;
