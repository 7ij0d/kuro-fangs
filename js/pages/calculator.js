/**
 * KURO FANGS — Year 3 Dental Grade & GPA Calculator
 * Coursework, Practical, Oral, Final Exam calculations and Target Grade Simulator
 */

export default async function renderCalculator(container, params) {
  const { default: KF_DATA }  = await import('../data.js');
  const { default: KF_STORE } = await import('../store.js');
  const { default: KURONI }   = await import('../kuroni.js');

  if (!KF_DATA.subjects) await KF_DATA.init();

  const subjects = KF_DATA.getSubjects(3);
  const savedGrades = KF_STORE.getCalculatorData();

  function getGradeInfo(pct) {
    if (pct >= 85) return { label: 'ممتاز (Excellent)', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.15)' };
    if (pct >= 75) return { label: 'جيد جداً (Very Good)', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)' };
    if (pct >= 65) return { label: 'جيد (Good)', color: '#eab308', bg: 'rgba(234, 179, 8, 0.15)' };
    if (pct >= 50) return { label: 'مقبول (Pass)', color: '#f97316', bg: 'rgba(249, 115, 22, 0.15)' };
    return { label: 'راسب (Fail)', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' };
  }

  function calculateOverall() {
    let totalScore = 0;
    let gradedCount = 0;

    subjects.forEach(s => {
      const g = savedGrades[s.id];
      if (g) {
        const cw = parseFloat(g.cw) || 0;
        const prac = parseFloat(g.prac) || 0;
        const oral = parseFloat(g.oral) || 0;
        const final = parseFloat(g.final) || 0;
        const total = cw + prac + oral + final;
        if (total > 0) {
          totalScore += total;
          gradedCount++;
        }
      }
    });

    const average = gradedCount > 0 ? Math.round(totalScore / gradedCount) : 0;
    return { average, gradedCount };
  }

  function renderView() {
    const { average, gradedCount } = calculateOverall();
    const overallGrade = getGradeInfo(average);

    container.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">حاسبة درجات ومعدل سنة ثالثة 🧮</h1>
        <p class="page-subtitle">حساب أعمال السنة، العملي، الشفوي، والامتحان النهائي لمحاكاة التقدير العام</p>
      </div>

      <div class="page-content animate-page-enter">

        <!-- Overall Score Card -->
        <div class="card" style="margin-bottom:var(--space-6); background:linear-gradient(135deg, var(--color-surface), var(--color-surface-sunken)); padding:var(--space-6);">
          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:var(--space-4);">
            <div>
              <div style="font-size:var(--fs-xs); color:var(--color-text-muted); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:var(--space-1);">
                المعدل العام التقديري لسنة ثالثة
              </div>
              <div style="display:flex; align-items:baseline; gap:var(--space-3);">
                <span style="font-size:var(--fs-3xl); font-weight:var(--fw-black); color:var(--color-primary-dark);">${average}%</span>
                <span class="tag" style="background:${overallGrade.bg}; color:${overallGrade.color}; font-weight:bold; font-size:var(--fs-sm);">
                  ${gradedCount > 0 ? overallGrade.label : 'أدخل الدرجات أدناه'}
                </span>
              </div>
              <div style="font-size:var(--fs-xs); color:var(--color-text-muted); margin-top:var(--space-1);">
                تم احتساب ${gradedCount} من أصل ${subjects.length} مواد
              </div>
            </div>

            <div class="kuroni-container kuroni-md">
              ${KURONI.getSVG(average >= 85 ? 'excited' : average >= 65 ? 'calm' : 'neutral')}
            </div>
          </div>
        </div>

        <!-- Target Grade Simulator Banner -->
        <div class="card" style="margin-bottom:var(--space-6); padding:var(--space-4) var(--space-5); border-left: 4px solid var(--color-primary-dark); background:var(--color-surface-sunken);">
          <div style="font-weight:var(--fw-bold); font-size:var(--fs-sm); margin-bottom:var(--space-1);">
            🎯 حاسبة الدرجة المطلوبة في الفاينل (Final Exam Target):
          </div>
          <div style="font-size:var(--fs-xs); color:var(--color-text-muted); line-height:1.5;">
            أدخل درجات أعمال سنتك والمعمل والشفوي (من 50 أو 60)، وستظهر لك المنظومة تلقائياً الدرجة المتبقية التي تحتاجها في ورقة الفاينل للوصول لتقدير (جيد جداً 75% أو ممتاز 85%).
          </div>
        </div>

        <!-- Subjects Grade Table -->
        <div style="display:flex; flex-direction:column; gap:var(--space-4);">
          ${subjects.map(s => {
            const g = savedGrades[s.id] || { cw: '', prac: '', oral: '', final: '' };
            const cw = parseFloat(g.cw) || 0;
            const prac = parseFloat(g.prac) || 0;
            const oral = parseFloat(g.oral) || 0;
            const final = parseFloat(g.final) || 0;
            const subjectTotal = cw + prac + oral + final;
            const preFinal = cw + prac + oral;
            const neededForVeryGood = Math.max(0, 75 - preFinal);
            const neededForExcellent = Math.max(0, 85 - preFinal);
            const gradeInfo = getGradeInfo(subjectTotal);

            return `
              <div class="card" style="padding:var(--space-5); border-right: 4px solid ${s.color};">
                <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:var(--space-2); margin-bottom:var(--space-4);">
                  <div style="display:flex; align-items:center; gap:var(--space-3);">
                    <span style="font-size:24px;">${s.icon}</span>
                    <div>
                      <h3 style="font-size:var(--fs-base); font-weight:var(--fw-bold); margin:0;">${s.name_ar}</h3>
                      <span style="font-size:var(--fs-xs); color:var(--color-text-muted);">${s.name_en}</span>
                    </div>
                  </div>
                  <div style="display:flex; align-items:center; gap:var(--space-2);">
                    <span style="font-size:var(--fs-lg); font-weight:var(--fw-black); color:var(--color-primary-dark);">${subjectTotal} / 100</span>
                    ${subjectTotal > 0 ? `<span class="tag" style="background:${gradeInfo.bg}; color:${gradeInfo.color}; font-size:var(--fs-xs);">${gradeInfo.label.split('(')[0]}</span>` : ''}
                  </div>
                </div>

                <!-- Input Grid -->
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap:var(--space-3); margin-bottom:var(--space-3);">
                  <div>
                    <label style="font-size:var(--fs-xs); color:var(--color-text-muted); display:block; margin-bottom:var(--space-1);">أعمال سنة / نصفي (20)</label>
                    <input type="number" min="0" max="20" class="search-bar grade-input"
                           style="padding:var(--space-2); text-align:center; font-weight:bold;"
                           placeholder="0" data-subj="${s.id}" data-field="cw" value="${g.cw || ''}" />
                  </div>
                  <div>
                    <label style="font-size:var(--fs-xs); color:var(--color-text-muted); display:block; margin-bottom:var(--space-1);">الامتحان العملي (20)</label>
                    <input type="number" min="0" max="20" class="search-bar grade-input"
                           style="padding:var(--space-2); text-align:center; font-weight:bold;"
                           placeholder="0" data-subj="${s.id}" data-field="prac" value="${g.prac || ''}" />
                  </div>
                  <div>
                    <label style="font-size:var(--fs-xs); color:var(--color-text-muted); display:block; margin-bottom:var(--space-1);">الامتحان الشفوي (10)</label>
                    <input type="number" min="0" max="10" class="search-bar grade-input"
                           style="padding:var(--space-2); text-align:center; font-weight:bold;"
                           placeholder="0" data-subj="${s.id}" data-field="oral" value="${g.oral || ''}" />
                  </div>
                  <div>
                    <label style="font-size:var(--fs-xs); color:var(--color-text-muted); display:block; margin-bottom:var(--space-1);">امتحان الفاينل (50)</label>
                    <input type="number" min="0" max="50" class="search-bar grade-input"
                           style="padding:var(--space-2); text-align:center; font-weight:bold;"
                           placeholder="0" data-subj="${s.id}" data-field="final" value="${g.final || ''}" />
                  </div>
                </div>

                <!-- Simulation hint -->
                <div style="font-size:var(--fs-xs); color:var(--color-text-muted); background:var(--color-surface-sunken); padding:var(--space-2) var(--space-3); border-radius:var(--radius-md); display:flex; justify-content:space-between; flex-wrap:wrap; gap:var(--space-2);">
                  <span>مجموع ما قبل الفاينل: <strong>${preFinal}/50</strong></span>
                  <span>المطلوب في الفاينل لـ <strong>جيد جداً</strong>: <strong style="color:#3b82f6;">${neededForVeryGood <= 50 ? `${neededForVeryGood}/50` : 'صعبة'}</strong></span>
                  <span>المطلوب لـ <strong>امتياز</strong>: <strong style="color:#22c55e;">${neededForExcellent <= 50 ? `${neededForExcellent}/50` : 'أكثر من 50'}</strong></span>
                </div>
              </div>`;
          }).join('')}
        </div>

        <div style="margin-top:var(--space-8); text-align:center;">
          <button class="btn btn-outline" id="btn-reset-grades" style="color:var(--color-text-muted); font-size:var(--fs-xs);">
            إعادة تعيين ومسح جميع الدرجات ↺
          </button>
        </div>

      </div>`;

    // Bind grade inputs
    container.querySelectorAll('.grade-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const subj = e.target.dataset.subj;
        const field = e.target.dataset.field;
        const val = e.target.value;

        const current = savedGrades[subj] || { cw: '', prac: '', oral: '', final: '' };
        current[field] = val;
        KF_STORE.setSubjectGrades(subj, current);
        renderView();
      });
    });

    document.getElementById('btn-reset-grades')?.addEventListener('click', () => {
      if (confirm('هل أنت متأكد من رغبتك في مسح الدرجات المدخلة؟')) {
        subjects.forEach(s => KF_STORE.setSubjectGrades(s.id, { cw: '', prac: '', oral: '', final: '' }));
        renderView();
      }
    });
  }

  // Initial render
  renderView();
}
