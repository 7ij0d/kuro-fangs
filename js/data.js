/**
 * KURO FANGS — Data Layer
 * Loads and provides access to all JSON data
 * In Phase 2, this will connect to Supabase
 */

const KF_DATA = {
  subjects: null,
  doctors: null,
  sheets: null,
  alerts: null,
  badges: null,
  questions: null,
  requirements: null,
  previous_exams: null,
  flashcards: null,

  async init() {
    try {
      const fetchJson = (url) => fetch(url).then(r => r.ok ? r.json() : null).catch(() => null);

      const [subjects, doctors, sheets, alertsData, questionsData, reqData, examsData, fcData] = await Promise.all([
        fetchJson('data/subjects.json'),
        fetchJson('data/doctors.json'),
        fetchJson('data/sheets.json'),
        fetchJson('data/alerts.json'),
        fetchJson('data/questions.json'),
        fetchJson('data/requirements.json'),
        fetchJson('data/previous_exams.json'),
        fetchJson('data/flashcards.json')
      ]);

      this.subjects       = subjects?.subjects || [];
      this.doctors        = doctors?.doctors || [];
      this.sheets         = sheets?.sheets || [];
      this.alerts         = alertsData?.alerts || [];
      this.badges         = alertsData?.badges || [];
      this.questions      = questionsData?.questions || [];
      this.requirements   = reqData?.departments || [];
      this.previous_exams = examsData?.exams || [];
      this.flashcards     = fcData?.decks || [];

      return true;
    } catch (err) {
      console.error('[KF_DATA] Failed to load data:', err);
      return false;
    }
  },

  // ── Subjects ──────────────────────────────────────────────
  getSubjects(year = 3) {
    return this.subjects.filter(s => s.year === year);
  },

  getSubjectById(id) {
    return this.subjects.find(s => s.id === id) || null;
  },

  // ── Doctors ───────────────────────────────────────────────
  getDoctorById(id) {
    return this.doctors.find(d => d.id === id) || null;
  },

  getDoctorsBySubject(subjectId) {
    return this.doctors.filter(d => d.subjects.includes(subjectId));
  },

  // ── Sheets ────────────────────────────────────────────────
  getSheetsBySubject(subjectId) {
    return this.sheets.filter(s => s.subject_id === subjectId);
  },

  getSheetsByDoctor(doctorId) {
    return this.sheets.filter(s => s.doctor_id === doctorId);
  },

  getSheetById(id) {
    return this.sheets.find(s => s.id === id) || null;
  },

  getLatestSheets(limit = 6) {
    return [...this.sheets]
      .sort((a, b) => new Date(b.date_added) - new Date(a.date_added))
      .slice(0, limit);
  },

  getMostViewedSheets(limit = 6) {
    return [...this.sheets]
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);
  },

  getExamFocusSheets() {
    return this.sheets.filter(s => s.is_exam_focus);
  },

  getSheetsByType(type) {
    return this.sheets.filter(s => s.type === type);
  },

  // Group sheets by lecture number within a subject
  getSheetsByLecture(subjectId) {
    const sheets = this.getSheetsBySubject(subjectId);
    const groups = {};
    sheets.forEach(sheet => {
      const key = `lec-${sheet.lecture_number}`;
      if (!groups[key]) {
        groups[key] = {
          lecture_number: sheet.lecture_number,
          lecture_title_ar: sheet.lecture_title_ar,
          lecture_title_en: sheet.lecture_title_en,
          date: sheet.date,
          time: sheet.time,
          doctor_id: sheet.doctor_id,
          sheets: []
        };
      }
      groups[key].sheets.push(sheet);
    });
    return Object.values(groups).sort((a, b) => a.lecture_number - b.lecture_number);
  },

  // ── Alerts ────────────────────────────────────────────────
  getAllAlerts() {
    return this.alerts || [];
  },

  getPinnedAlerts() {
    return (this.alerts || []).filter(a => a.is_pinned);
  },

  getAlertsBySubject(subjectId) {
    return (this.alerts || []).filter(a => a.subject_id === subjectId);
  },

  // ── Badges ────────────────────────────────────────────────
  getAllBadges() {
    return this.badges || [];
  },

  // ── Questions & Quizzes ───────────────────────────────────
  getQuestions(subjectId = null) {
    if (!this.questions) return [];
    if (!subjectId || subjectId === 'all') return this.questions;
    return this.questions.filter(q => q.subject_id === subjectId);
  },

  getQuestionById(id) {
    return this.questions?.find(q => q.id === id) || null;
  },

  // ── Requirements ──────────────────────────────────────────
  getRequirements() {
    return this.requirements || [];
  },

  // ── Previous Exams ────────────────────────────────────────
  getPreviousExams(subjectId = null) {
    if (!this.previous_exams) return [];
    if (!subjectId || subjectId === 'all') return this.previous_exams;
    return this.previous_exams.filter(e => e.subject_id === subjectId);
  },

  // ── Flashcards ────────────────────────────────────────────
  getFlashcardDecks(subjectId = null) {
    if (!this.flashcards) return [];
    if (!subjectId || subjectId === 'all') return this.flashcards;
    return this.flashcards.filter(d => d.subject_id === subjectId);
  },

  // ── Search ────────────────────────────────────────────────
  search(query, filters = {}) {
    const q = query.toLowerCase().trim();
    let results = [...this.sheets];

    if (q) {
      results = results.filter(s =>
        s.title_ar?.toLowerCase().includes(q) ||
        s.lecture_title_ar?.toLowerCase().includes(q) ||
        s.lecture_title_en?.toLowerCase().includes(q) ||
        s.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    if (filters.subject_id) {
      results = results.filter(s => s.subject_id === filters.subject_id);
    }

    if (filters.doctor_id) {
      results = results.filter(s => s.doctor_id === filters.doctor_id);
    }

    if (filters.type) {
      results = results.filter(s => s.available_types?.includes(filters.type));
    }

    if (filters.exam_focus) {
      results = results.filter(s => s.is_exam_focus);
    }

    if (filters.sort) {
      switch (filters.sort) {
        case 'newest':  results.sort((a,b) => new Date(b.date_added) - new Date(a.date_added)); break;
        case 'views':   results.sort((a,b) => b.views - a.views); break;
        case 'saves':   results.sort((a,b) => b.saves - a.saves); break;
        case 'importance': results.sort((a,b) => b.importance - a.importance); break;
      }
    }

    return results;
  }
};

export default KF_DATA;
