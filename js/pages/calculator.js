/**
 * KURO FANGS — GPA CALCULATOR PAGE
 * Interactive Grade & GPA Simulator for 12 Dental Subjects
 */

const CalculatorPage = {
  render(container) {
    const subjects = window.DATA.getSubjects();
    const savedData = window.STORE.getCalculatorData();

    container.innerHTML = `
      <div class="page-title-bar">
        <div class="page-title-group">
          <h1>
            <i data-lucide="calculator" style="color: var(--brand-primary); width: 26px; height: 26px;"></i>
            حاسبة المعدل التراكمي والفصلي
          </h1>
          <p>احسب وحاكي معدلك الأكاديمي لجميع المواد الـ 12 لسنة ثالثة طب الأسنان بدقة تامة</p>
        </div>
      </div>

      <div class="calc-grid">
        <!-- Subjects Input Box -->
        <div class="calc-box">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="font-size: 1.05rem;">درجات المواد الـ 12</h3>
            <button id="btn-calc-reset" class="btn btn-secondary" style="font-size: 0.775rem; padding: 4px 10px;">
              تصفير الدرجات
            </button>
          </div>

          <div style="display: flex; flex-direction: column;">
            <div class="calc-subject-row" style="font-weight: 700; color: var(--text-muted); font-size: 0.8rem; border-bottom: 2px solid var(--border-subtle);">
              <span>المادة</span>
              <span style="text-align: center;">التقدير / الدرجة</span>
              <span style="text-align: center;">النقاط (GPA)</span>
            </div>

            ${subjects.map((s, idx) => {
              const defaultScore = savedData[s.id] !== undefined ? savedData[s.id] : 85;
              return `
                <div class="calc-subject-row" data-id="${s.id}">
                  <div>
                    <div style="font-weight: 600; font-size: 0.875rem; color: var(--text-primary);">${s.name_ar}</div>
                    <div style="font-size: 0.725rem; color: var(--text-muted);">${s.code}</div>
                  </div>
                  <div style="text-align: center;">
                    <input type="number" min="0" max="100" class="calc-input" data-subject="${s.id}" value="${defaultScore}" style="width: 70px; text-align: center; padding: 6px;" />
                  </div>
                  <div style="text-align: center; font-weight: 700; color: var(--brand-primary); font-size: 0.9rem;" id="points-${s.id}">
                    ${(defaultScore / 25).toFixed(2)}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Result Box -->
        <div>
          <div class="calc-result-box">
            <span style="font-size: 0.875rem; opacity: 0.9;">المعدل التراكمي المقدر (GPA)</span>
            <div class="calc-gpa-number" id="final-gpa-display">3.50</div>
            <div style="font-size: 1.1rem; font-weight: 700; margin-bottom: 6px;" id="final-rating-display">ممتاز (Excellent)</div>
            <div style="font-size: 0.825rem; opacity: 0.85;">النسبة المئوية: <span id="final-percentage-display">87.5%</span></div>

            <button id="btn-save-calc" class="btn" style="background: #FFFFFF; color: var(--brand-primary); width: 100%; margin-top: 24px; font-weight: 700;">
              <i data-lucide="save" style="width: 16px; height: 16px;"></i>
              حفظ النتيجة في ملفي
            </button>
          </div>

          <div class="card" style="margin-top: 16px; padding: 18px; font-size: 0.8rem; color: var(--text-secondary);">
            <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">ملاحظات التقييم:</div>
            <p>• الامتياز: 85% فما فوق (3.4+ GPA)</p>
            <p>• جيد جداً: 75% إلى 84% (3.0 - 3.39 GPA)</p>
            <p>• جيد: 65% إلى 74% (2.5 - 2.99 GPA)</p>
            <p>• مقبول: 50% إلى 64% (2.0 - 2.49 GPA)</p>
          </div>
        </div>
      </div>
    `;

    const calculate = () => {
      let total = 0;
      let count = 0;
      const inputs = container.querySelectorAll('.calc-input');
      const dataToSave = {};

      inputs.forEach(inp => {
        const val = Math.min(100, Math.max(0, parseFloat(inp.value) || 0));
        const subId = inp.getAttribute('data-subject');
        dataToSave[subId] = val;
        total += val;
        count++;

        const pointEl = document.getElementById(`points-${subId}`);
        if (pointEl) {
          pointEl.textContent = (val / 25).toFixed(2);
        }
      });

      const avg = count > 0 ? (total / count) : 0;
      const gpa = ((avg / 100) * 4).toFixed(2);

      const gpaEl = document.getElementById('final-gpa-display');
      const pctEl = document.getElementById('final-percentage-display');
      const rateEl = document.getElementById('final-rating-display');

      if (gpaEl) gpaEl.textContent = gpa;
      if (pctEl) pctEl.textContent = `${avg.toFixed(1)}%`;
      if (rateEl) {
        if (avg >= 85) rateEl.textContent = 'ممتاز (Excellent)';
        else if (avg >= 75) rateEl.textContent = 'جيد جداً (Very Good)';
        else if (avg >= 65) rateEl.textContent = 'جيد (Good)';
        else if (avg >= 50) rateEl.textContent = 'مقبول (Pass)';
        else rateEl.textContent = 'راسب (Needs Improvement)';
      }

      return dataToSave;
    };

    container.querySelectorAll('.calc-input').forEach(inp => {
      inp.addEventListener('input', calculate);
    });

    const resetBtn = document.getElementById('btn-calc-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        container.querySelectorAll('.calc-input').forEach(inp => inp.value = 85);
        calculate();
      });
    }

    const saveBtn = document.getElementById('btn-save-calc');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const currentData = calculate();
        window.STORE.saveCalculatorData(currentData);
        window.STORE.addPoints(5);
        alert('تم حفظ تقديراتك بنجاح وحصلت على +5 نقاط!');
      });
    }

    calculate();
  }
};

window.CalculatorPage = CalculatorPage;
