/**
 * KURO FANGS — Academic Year Grouping for subject grids (Recordings & Questions)
 * Year 3: General Medicine, General Surgery, Oral Pathology
 * Year 4: all remaining subjects
 */
window.KFYearGroups = {
  THIRD_YEAR_IDS: ['gen-med', 'gen-surgery', 'oral-diseases'],

  yearOf(subject) {
    return this.THIRD_YEAR_IDS.includes(subject && subject.id) ? 3 : 4;
  },

  // Returns a full-width section heading when `subject` starts a new year group, otherwise ''.
  headingFor(subject, idx, list, isAr) {
    const year = this.yearOf(subject);
    if (idx > 0 && this.yearOf(list[idx - 1]) === year) return '';
    const label = year === 3
      ? (isAr ? 'مواد سنة ثالثة' : 'Third Year Subjects')
      : (isAr ? 'مواد سنة رابعة' : 'Fourth Year Subjects');
    return `<div class="kf-year-heading" role="heading" aria-level="2"><span>${label}</span></div>`;
  }
};
