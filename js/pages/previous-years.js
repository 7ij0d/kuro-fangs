/**
 * KURO FANGS — Previous Years Exam Bank
 * Past exam papers, midterms, finals and model answers for Year 3 Dentistry
 */

export default async function renderPreviousYears(container, params) {
  const { default: KF_DATA }  = await import('../data.js');
  const { default: KURONI }   = await import('../kuroni.js');

  if (!KF_DATA.previous_exams) await KF_DATA.init();

  const exams = KF_DATA.getPreviousExams();
  const subjects = KF_DATA.getSubjects(3);
  let filterSubject = 'all';

  function renderView() {
    const filtered = filterSubject === 'all' 
      ? exams 
      : exams.filter(e => e.subject_id === filterSubject);

    container.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">بنك أسئلة السنوات السابقة 📅</h1>
        <p class="page-subtitle">تجميعات امتحانات النصفي والنهائي المعتمدة لجامعة طرابلس مع الحلول النموذجية</p>
      </div>

      <div class="page-content animate-page-enter">

        <!-- Subject Filter Pills -->
        <div style="display:flex; gap:var(--space-2); overflow-x:auto; padding-bottom:var(--space-3); margin-bottom:var(--space-6);">
          <button class="btn btn-sm ${filterSubject === 'all' ? 'btn-primary' : 'btn-outline'}" data-filter="all" style="border-radius:var(--radius-xl);">
            الكل (${exams.length})
          </button>
          ${subjects.map(s => {
            const count = exams.filter(e => e.subject_id === s.id).length;
            if (count === 0) return '';
            return `
              <button class="btn btn-sm ${filterSubject === s.id ? 'btn-primary' : 'btn-outline'}" data-filter="${s.id}" style="border-radius:var(--radius-xl); white-space:nowrap;">
                ${s.icon} ${s.name_ar} (${count})
              </button>`;
          }).join('')}
        </div>

        <!-- Exams Grid -->
        <div style="display:flex; flex-direction:column; gap:var(--space-5);">
          ${filtered.map((ex, idx) => {
            const subj = KF_DATA.getSubjectById(ex.subject_id);

            return `
              <div class="card hover-lift animate-card-reveal stagger-${idx + 1}" style="padding:var(--space-6); border-right: 5px solid ${subj?.color || 'var(--color-primary-dark)'};">
                <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:var(--space-3); margin-bottom:var(--space-3);">
                  <div style="display:flex; align-items:center; gap:var(--space-3);">
                    <span style="font-size:28px;">${subj?.icon || '📄'}</span>
                    <div>
                      <h2 style="font-size:var(--fs-lg); font-weight:var(--fw-bold); margin:0;">
                        ${ex.subject_name} — ${ex.type}
                      </h2>
                      <div style="font-size:var(--fs-xs); color:var(--color-text-muted); margin-top:var(--space-1);">
                        عام ${ex.year} • ${ex.semester} • عدد الأسئلة: ${ex.questions_count} سؤال
                      </div>
                    </div>
                  </div>

                  <div style="display:flex; align-items:center; gap:var(--space-2);">
                    ${ex.tags.map(t => `<span class="tag ${t === 'فاينل' ? 'tag-exam' : 'tag-neutral'}">${t}</span>`).join('')}
                  </div>
                </div>

                <p style="font-size:var(--fs-sm); color:var(--color-text); margin-bottom:var(--space-4); line-height:1.6;">
                  ${ex.summary}
                </p>

                <!-- Sample Solved Highlights -->
                ${ex.sample_questions && ex.sample_questions.length > 0 ? `
                  <div style="background:var(--color-surface-sunken); padding:var(--space-4); border-radius:var(--radius-lg); margin-bottom:var(--space-4);">
                    <div style="font-weight:var(--fw-bold); font-size:var(--fs-xs); color:var(--color-primary-dark); margin-bottom:var(--space-2);">
                      ⭐ أبرز الأسئلة والنقاط المكررة في الامتحان:
                    </div>
                    <ul style="margin:0; padding-right:var(--space-4); font-size:var(--fs-xs); color:var(--color-text-muted); line-height:1.7;">
                      ${ex.sample_questions.map(sq => `<li>${sq}</li>`).join('')}
                    </ul>
                  </div>` : ''}

                <!-- Actions -->
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:var(--space-3); pt:var(--space-2);">
                  <span style="font-size:var(--fs-xs); color:var(--color-text-muted);">
                    ✓ متاح للجميع مجاناً
                  </span>
                  <div style="display:flex; gap:var(--space-2);">
                    <button class="btn btn-sm btn-primary" onclick="ROUTER.navigate('/quizzes')">
                      اختبر نفسك في أسئلة هذه المادة ✍️
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="ROUTER.navigate('/subjects/${ex.subject_id}')">
                      عرض شيتات المادة
                    </button>
                  </div>
                </div>

              </div>`;
          }).join('')}
        </div>

      </div>`;

    // Bind filters
    container.querySelectorAll('[data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        filterSubject = btn.dataset.filter;
        renderView();
      });
    });
  }

  // Initial render
  renderView();
}
