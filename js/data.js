/**
 * KURO FANGS — DATA SERVICE
 * Dental Curriculum Data for Year 3 with Subject Cover Images
 */

class DataService {
  constructor() {
    this.subjects = [];
    this.sheets = [];
    this.alerts = [];
    this.doctors = [];
    this.questions = [];
    this.flashcards = [];
    this.previousExams = [];
    this.requirements = [];
    this.videos = [];
    this.recordings = [];
    this.notes = [];
    this.loaded = false;

    // Ultra-lightweight WebP cover banners (under ~25KB each, 600x337 at 75% quality)
    this.subjectCovers = {
      'gen-med': 'assets/covers/gen-med.webp',
      'gen-surgery': 'assets/covers/gen-surgery.webp',
      'fixed-pros': 'assets/covers/fixed-pros.webp',
      'omfs': 'assets/covers/omfs.webp',
      'oral-diseases': 'assets/covers/oral-diseases.webp',
      'endo': 'assets/covers/endo.webp',
      'omdr': 'assets/covers/omdr.webp',
      'preventive': 'assets/covers/preventive.webp',
      'cons-endo': 'assets/covers/cons-endo.webp',
      'ortho': 'assets/covers/ortho.webp',
      'pedo': 'assets/covers/pedo.webp',
      'pediatric': 'assets/covers/pediatric.webp',
      'removable-pros': 'assets/covers/removable-pros.webp'
    };

    // Official Weekly Theoretical Lectures Timetable (Tripoli Dental Faculty Official Schedule)
    this.theoryScheduleDays = [
      {
        dayIndex: 6, // Saturday
        day_ar: 'السبت', day_en: 'Saturday',
        slots: [
          { time: '08:00 - 10:00', startHour: 8, endHour: 10, code: 'MS310', subject_id: 'gen-med', subject_ar: 'الباطنة العامة', subject_en: 'General Medicine', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', color: '#0284C7' },
          { time: '10:00 - 12:00', startHour: 10, endHour: 12, code: 'MS320', subject_id: 'gen-surgery', subject_ar: 'الجراحة العامة', subject_en: 'General Surgery', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', color: '#2563EB' }
        ]
      },
      {
        dayIndex: 0, // Sunday
        day_ar: 'الأحد', day_en: 'Sunday',
        slots: [
          { time: '08:00 - 10:00', startHour: 8, endHour: 10, code: 'DS331', subject_id: 'fixed-pros', subject_ar: 'الاستعاضة السنية الثابتة 2', subject_en: 'Fixed Prosthodontics II', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', color: '#0D9488' },
          { time: '10:00 - 12:00', startHour: 10, endHour: 12, code: 'DS341', subject_id: 'omfs', subject_ar: 'جراحة الفم والوجه والفكين 1', subject_en: 'OMFS I', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', color: '#059669' }
        ]
      },
      {
        dayIndex: 1, // Monday
        day_ar: 'الإثنين', day_en: 'Monday',
        slots: [
          { time: '08:00 - 10:00', startHour: 8, endHour: 10, code: 'DS380', subject_id: 'oral-diseases', subject_ar: 'اورال باثولوجي', subject_en: 'Oral Pathology', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', color: '#D97706' },
          { time: '10:00 - 12:00', startHour: 10, endHour: 12, code: 'DS351', subject_id: 'endo', subject_ar: 'أمراض وعلاج اللثة 1', subject_en: 'Periodontology I', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', color: '#C2410C' }
        ]
      },
      {
        dayIndex: 2, // Tuesday
        day_ar: 'الثلاثاء', day_en: 'Tuesday',
        slots: [
          { time: '08:00 - 10:00', startHour: 8, endHour: 10, code: 'DS381', subject_id: 'preventive', subject_ar: 'طب الأسنان الوقائي', subject_en: 'Preventive Dentistry', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', color: '#CA8A04' },
          { time: '10:00 - 12:00', startHour: 10, endHour: 12, code: 'DS361', subject_id: 'omdr', subject_ar: 'طب الفم والتشخيص والأشعة 1', subject_en: 'Oral Diagnosis & Radiology I', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', color: '#EAB308' }
        ]
      },
      {
        dayIndex: 3, // Wednesday
        day_ar: 'الأربعاء', day_en: 'Wednesday',
        slots: [
          { time: '08:00 - 10:00', startHour: 8, endHour: 10, code: 'DS311', subject_id: 'cons-endo', subject_ar: 'العلاج التحفظي وعلاج الجذور 2', subject_en: 'Cons & Endo II', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', color: '#DB2777' },
          { time: '10:00 - 12:00', startHour: 10, endHour: 12, code: 'DS371', subject_id: 'ortho', subject_ar: 'تقويم الأسنان 1', subject_en: 'Orthodontics I', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', color: '#9333EA' },
          { time: '02:00 - 04:00', startHour: 14, endHour: 16, code: 'DS380', subject_id: 'oral-diseases', subject_ar: 'اورال باثولوجي (المحاضرة 2)', subject_en: 'Oral Pathology (Lecture 2)', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', color: '#D97706' }
        ]
      },
      {
        dayIndex: 4, // Thursday
        day_ar: 'الخميس', day_en: 'Thursday',
        slots: [
          { time: '08:00 - 10:00', startHour: 8, endHour: 10, code: 'DS321', subject_id: 'removable-pros', subject_ar: 'الاستعاضة السنية المتحركة 2', subject_en: 'Removable Prosthodontics II', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', color: '#7C3AED' },
          { time: '10:00 - 12:00', startHour: 10, endHour: 12, code: 'DS470', subject_id: 'pedo', subject_ar: 'طب أسنان الأطفال 1', subject_en: 'Pediatric Dentistry I', hall_ar: 'مدرج 2', hall_en: 'Auditorium 2', color: '#16A34A' }
        ]
      }
    ];
  }

  getTheoryScheduleForDay(dayIndex) {
    if (dayIndex === 5) {
      return {
        dayIndex: 5,
        day_ar: 'الجمعة',
        day_en: 'Friday',
        slots: [],
        isWeekend: true
      };
    }
    const day = (this.theoryScheduleDays || []).find(d => d.dayIndex === dayIndex);
    if (day) return day;
    const arDays = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const enDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return {
      dayIndex: dayIndex,
      day_ar: arDays[dayIndex] || '',
      day_en: enDays[dayIndex] || '',
      slots: [],
      isWeekend: dayIndex === 5
    };
  }

  async init() {
    if (this.loaded) return;

    // 1. Populate default subjects, sheets, and alerts synchronously for INSTANT page render (<30ms)
    const defaultSubjects = this.getDefaultSubjects();
    this.subjects = defaultSubjects;
    this.subjects.forEach(s => {
      s.cover_image = s.cover_image || this.subjectCovers[s.id] || `assets/covers/${s.id}.webp`;
    });
    this.alerts = this.getDefaultAlerts();
    this.sheets = this.getDefaultSheets();
    this.recordings = this.getDefaultRecordings();
    this.questions = this.getDefaultQuestions();
    this.flashcards = this.getDefaultFlashcards();

    // 2. Purge legacy old sheets system cache from localStorage
    try {
      ['kf_cloud_cached_sheets', 'kf_admin_custom_sheets', 'kf_sheets', 'kf_deleted_sheet_ids'].forEach(k => {
        try { localStorage.removeItem(k); } catch (err) {}
      });
    } catch (e) {}

    // 2b. Merge admin-created recordings from localStorage
    try {
      const adminRecs = JSON.parse(localStorage.getItem('kf_admin_recordings') || '[]');
      if (Array.isArray(adminRecs)) {
        adminRecs.forEach(r => {
          if (!this.recordings.some(x => x.id === r.id)) {
            this.recordings.push(r);
          }
        });
      }
    } catch (e) {}

    // 2c. Merge admin-created questions from localStorage
    try {
      const adminQs = JSON.parse(localStorage.getItem('kf_admin_questions') || '[]');
      if (Array.isArray(adminQs)) {
        adminQs.forEach(q => {
          if (!this.questions.some(x => x.id === q.id)) {
            this.questions.push(q);
          }
        });
      }
    } catch (e) {}

    this.loaded = true;

    // 3. Fire JSON sync asynchronously in background (Non-Blocking, Non-Sheets)
    setTimeout(async () => {
      try {
        const [subjectsRes, alertsRes, doctorsRes] = await Promise.allSettled([
          fetch('data/subjects.json').then(r => r.json()),
          fetch('data/alerts.json').then(r => r.json()),
          fetch('data/doctors.json').then(r => r.json())
        ]);

        if (subjectsRes.status === 'fulfilled' && subjectsRes.value?.subjects) {
          this.subjects = subjectsRes.value.subjects;
          this.subjects.forEach(s => {
            s.cover_image = s.cover_image || this.subjectCovers[s.id] || `assets/covers/${s.id}.webp`;
          });
        }
        if (alertsRes.status === 'fulfilled' && alertsRes.value?.alerts) {
          this.alerts = alertsRes.value.alerts;
        }
        if (doctorsRes.status === 'fulfilled' && doctorsRes.value?.doctors) {
          this.doctors = doctorsRes.value.doctors;
        }
      } catch (err) {
        console.warn('Background data sync note:', err);
      }
    }, 10);

    // Merge custom admin announcements from localStorage if present (legacy support)
    // These will be superseded by Supabase cloud alerts when they load
    try {
      const customAlerts = JSON.parse(localStorage.getItem('kf_admin_custom_alerts') || '[]');
      if (Array.isArray(customAlerts) && customAlerts.length > 0) {
        customAlerts.forEach(ca => {
          if (!this.alerts.some(a => a.id === ca.id)) {
            this.alerts.unshift(ca);
          }
        });
      }
    } catch (e) {}

    // Also apply locally-cached deletions on initial load (for fast first-render before cloud sync)
    // Cloud sync in background will eventually take over as source of truth
    const deletedSheetIds = this.getDeletedSheetIds();
    if (deletedSheetIds.length > 0) {
      this.sheets = (this.sheets || []).filter(s => !deletedSheetIds.includes(s.id));
    }

    const deletedAlertIds = this.getDeletedAlertIds();
    if (deletedAlertIds.length > 0) {
      this.alerts = (this.alerts || []).filter(a => !deletedAlertIds.includes(a.id));
    }

    this.loaded = true;

    // Kick off a second background sync specifically for alerts (cloud alerts are global)
    setTimeout(async () => {
      try {
        if (window.KuroCloud && typeof window.KuroCloud.fetchCloudAlerts === 'function') {
          const liveCloudAlerts = await window.KuroCloud.fetchCloudAlerts();
          if (Array.isArray(liveCloudAlerts) && liveCloudAlerts.length > 0) {
            const cloudAlertIds = new Set(liveCloudAlerts.map(a => a.id));
            const cachedCloudAlertIds = new Set(
              JSON.parse(localStorage.getItem('kf_cloud_cached_alerts') || '[]').map(a => a.id)
            );

            // Merge cloud alerts
            liveCloudAlerts.forEach(ca => {
              const idx = this.alerts.findIndex(a => a.id === ca.id);
              if (idx !== -1) { this.alerts[idx] = { ...this.alerts[idx], ...ca }; }
              else { this.alerts.unshift(ca); }
            });

            // Remove alerts deleted from cloud
            this.alerts = this.alerts.filter(a => {
              if (cloudAlertIds.has(a.id)) return true;
              if (!cachedCloudAlertIds.has(a.id)) return true;
              return false;
            });

            localStorage.setItem('kf_cloud_cached_alerts', JSON.stringify(liveCloudAlerts));
          }
        }
      } catch (err) {
        console.warn('Cloud alerts sync note:', err);
      }
    }, 500); // slight delay so sheets sync runs first
  }


  getDeletedSheetIds() {
    try {
      return JSON.parse(localStorage.getItem('kf_deleted_sheet_ids') || '[]');
    } catch (e) {
      return [];
    }
  }

  getDeletedAlertIds() {
    try {
      return JSON.parse(localStorage.getItem('kf_deleted_alert_ids') || '[]');
    } catch (e) {
      return [];
    }
  }

  getSubjects() {
    if (!this.subjects || this.subjects.length === 0) {
      this.subjects = this.getDefaultSubjects();
      this.subjects.forEach(s => {
        s.cover_image = s.cover_image || this.subjectCovers[s.id] || `assets/covers/${s.id}.webp`;
      });
    }
    return this.subjects;
  }

  getSubjectById(id) {
    const list = this.getSubjects();
    return list.find(s => s.id === id);
  }

  getSheetsBySubject(subjectId) {
    const deleted = this.getDeletedSheetIds();
    let list = (this.sheets || []).filter(s => !deleted.includes(s.id));
    if (subjectId) {
      list = list.filter(s => s.subject_id === subjectId);
    }
    // Deduplicate by ID and normalized title
    const seen = new Set();
    const cleanList = [];
    for (const s of list) {
      if (!s || !s.id || s.id === 'sh-omdr-01') continue;
      const rawTitle = s.title_en || s.title || s.title_ar || '';
      const normKey = (s.subject_id || '') + '::' + rawTitle.toLowerCase().replace(/sheet\s*\d+\s*[:\-–—]?/gi, '').replace(/الشيت\s*\d+\s*[:\-–—]?/gi, '').trim();
      if (seen.has(s.id) || (normKey.length > 5 && seen.has(normKey))) {
        continue;
      }
      seen.add(s.id);
      if (normKey.length > 5) seen.add(normKey);
      cleanList.push(s);
    }
    list = cleanList;

    // Sort by order_index ascending, then by date descending for ties
    list.sort((a, b) => {
      const oa = typeof a.order_index === 'number' ? a.order_index : 9999;
      const ob = typeof b.order_index === 'number' ? b.order_index : 9999;
      if (oa !== ob) return oa - ob;
      return (b.date || '').localeCompare(a.date || '');
    });
    return list;
  }

  getSheetsForSubject(subjectId) {
    return this.getSheetsBySubject(subjectId);
  }

  getSheetById(sheetId) {
    if (!sheetId) return null;
    if (window.PersonalLibrary && typeof window.PersonalLibrary.getFileById === 'function') {
      const personalFile = window.PersonalLibrary.getFileById(sheetId);
      if (personalFile) return personalFile;
    }
    const foundInSheets = (this.sheets || []).find(s => s.id === sheetId);
    if (foundInSheets) return foundInSheets;
    return null;
  }

  getRecentSheets(limit = 6) {
    if (window.PersonalLibrary && typeof window.PersonalLibrary.getAllFiles === 'function') {
      return window.PersonalLibrary.getAllFiles().slice(0, limit);
    }
    return [];
  }

  /**
   * Legacy syncCloudSheets stub — Old curriculum sheets system replaced by Personal Study Library
   */
  async syncCloudSheets() {
    return [];
  }

  /**
   * Update an existing sheet's properties
   * @param {string} sheetId - The sheet ID to update
   * @param {object} updates - Object with properties to merge
   * @returns {object|null} The updated sheet or null if not found
   */
  updateSheet(sheetId, updates) {
    // Update in memory
    const sheet = (this.sheets || []).find(s => s.id === sheetId);
    if (!sheet) return null;
    Object.assign(sheet, updates);

    // Also update in localStorage custom sheets
    try {
      const customSheets = JSON.parse(localStorage.getItem('kf_admin_custom_sheets') || '[]');
      const csIdx = customSheets.findIndex(s => s.id === sheetId);
      if (csIdx !== -1) {
        Object.assign(customSheets[csIdx], updates);
        localStorage.setItem('kf_admin_custom_sheets', JSON.stringify(customSheets));
      }
    } catch (e) {}

    return sheet;
  }

  /**
   * Reorder a sheet within its subject group
   * @param {string} sheetId - The sheet ID to reorder
   * @param {number} newIndex - The new 1-based order index
   */
  reorderSheet(sheetId, newIndex) {
    const sheet = (this.sheets || []).find(s => s.id === sheetId);
    if (!sheet) return;

    const subjectId = sheet.subject_id;
    const siblings = this.getSheetsBySubject(subjectId);

    // Assign new index
    sheet.order_index = newIndex;

    // Re-normalize siblings to avoid gaps
    siblings.sort((a, b) => {
      const oa = typeof a.order_index === 'number' ? a.order_index : 9999;
      const ob = typeof b.order_index === 'number' ? b.order_index : 9999;
      return oa - ob;
    });
    siblings.forEach((s, i) => {
      s.order_index = i + 1;
    });

    // Persist all sibling order changes
    try {
      const customSheets = JSON.parse(localStorage.getItem('kf_admin_custom_sheets') || '[]');
      siblings.forEach(s => {
        const csIdx = customSheets.findIndex(cs => cs.id === s.id);
        if (csIdx !== -1) {
          customSheets[csIdx].order_index = s.order_index;
        }
      });
      localStorage.setItem('kf_admin_custom_sheets', JSON.stringify(customSheets));
    } catch (e) {}
  }

  /**
   * Get the next available order index for a subject
   * @param {string} subjectId
   * @returns {number}
   */
  getNextOrderIndex(subjectId) {
    const siblings = this.getSheetsBySubject(subjectId);
    if (siblings.length === 0) return 1;
    const maxIdx = Math.max(...siblings.map(s => typeof s.order_index === 'number' ? s.order_index : 0));
    return maxIdx + 1;
  }

  getAlerts() {
    const deleted = this.getDeletedAlertIds();
    return (this.alerts || []).filter(a => !deleted.includes(a.id));
  }

  async loadDeferredData() {
    if (this._deferredLoading || this._deferredLoaded) return;
    this._deferredLoading = true;
    try {
      const cacheBust = '?v=' + Date.now();
      const [
        questionsRes,
        sheetsRes,
        flashcardsRes,
        examsRes,
        reqRes,
        recordingsRes
      ] = await Promise.allSettled([
        fetch('data/questions.json' + cacheBust).then(r => r.json()),
        fetch('data/sheets.json' + cacheBust).then(r => r.json()),
        fetch('data/flashcards.json' + cacheBust).then(r => r.json()),
        fetch('data/previous_exams.json' + cacheBust).then(r => r.json()),
        fetch('data/requirements.json' + cacheBust).then(r => r.json()),
        fetch('data/recordings.json' + cacheBust).then(r => r.json())
      ]);

      if (sheetsRes.status === 'fulfilled' && sheetsRes.value?.sheets) {
        this.sheets = sheetsRes.value.sheets;
      }
      if (questionsRes.status === 'fulfilled' && questionsRes.value?.questions) {
        this.questions = questionsRes.value.questions;
        // Clean legacy demo questions from localStorage
        try {
          const rawAdmin = localStorage.getItem('kf_admin_questions');
          if (rawAdmin) {
            let adminQs = JSON.parse(rawAdmin);
            if (Array.isArray(adminQs)) {
              // Strip out obsolete demo questions (omdr, cons-endo, or old path demo items)
              adminQs = adminQs.filter(q => q && q.id && !q.id.startsWith('q_omdr_') && !q.id.startsWith('q_cons_') && !q.id.startsWith('q_path_demo_'));
              localStorage.setItem('kf_admin_questions', JSON.stringify(adminQs));
              adminQs.forEach(q => {
                if (!this.questions.some(x => x.id === q.id)) {
                  this.questions.push(q);
                }
              });
            }
          }
        } catch (e) {}
      }
      if (flashcardsRes.status === 'fulfilled' && flashcardsRes.value?.flashcards) {
        this.flashcards = flashcardsRes.value.flashcards;
      }
      if (examsRes.status === 'fulfilled' && examsRes.value?.previous_exams) {
        this.previousExams = examsRes.value.previous_exams;
      }
      if (reqRes.status === 'fulfilled' && reqRes.value?.requirements) {
        this.requirements = reqRes.value.requirements;
      }
      if (recordingsRes.status === 'fulfilled' && recordingsRes.value?.recordings) {
        this.recordings = recordingsRes.value.recordings;
        // Re-merge admin recordings
        try {
          const adminRecs = JSON.parse(localStorage.getItem('kf_admin_recordings') || '[]');
          if (Array.isArray(adminRecs)) {
            adminRecs.forEach(r => {
              if (!this.recordings.some(x => x.id === r.id)) {
                this.recordings.push(r);
              }
            });
          }
        } catch (e) {}
      }
      this._deferredLoaded = true;
    } catch (err) {
      console.warn('Deferred datasets background fetch notice:', err);
    } finally {
      this._deferredLoading = false;
    }
  }

  getQuestionsBySubject(subjectId) {
    if (!this._deferredLoaded && !this._deferredLoading) {
      this.loadDeferredData();
    }
    if (!subjectId) return this.questions || [];
    return (this.questions || []).filter(q => q.subject_id === subjectId);
  }

  getQuestionsBySheet(sheetId) {
    if (!sheetId) return [];
    if (!this._deferredLoaded && !this._deferredLoading) {
      this.loadDeferredData();
    }
    return (this.questions || []).filter(q => q.sheet_id === sheetId);
  }

  getRecordings(subjectId) {
    if (!this._deferredLoaded && !this._deferredLoading) {
      this.loadDeferredData();
    }
    if (!subjectId) return this.recordings || [];
    return (this.recordings || []).filter(r => r.subject_id === subjectId);
  }

  getRecordingsBySheet(sheetId) {
    if (!sheetId) return [];
    const deleted = this.getDeletedSheetIds();
    if (deleted.includes(sheetId)) return [];
    return (this.recordings || []).filter(r => r.sheet_id === sheetId);
  }

  getQuestionsBySheet(sheetId) {
    if (!sheetId) return [];
    const deleted = this.getDeletedSheetIds();
    if (deleted.includes(sheetId)) return [];
    if (!this._deferredLoaded && !this._deferredLoading) {
      this.loadDeferredData();
    }
    return (this.questions || []).filter(q => q.sheet_id === sheetId);
  }

  getNotesBySheet(sheetId) {
    if (!sheetId) return '';
    try {
      return localStorage.getItem(`kf_sheet_notes_${sheetId}`) || '';
    } catch (e) {
      return '';
    }
  }

  saveNotesForSheet(sheetId, content) {
    if (!sheetId) return false;
    try {
      localStorage.setItem(`kf_sheet_notes_${sheetId}`, content || '');
      return true;
    } catch (e) {
      return false;
    }
  }

  addRecording(recording) {
    this.recordings.push(recording);
    try {
      const stored = JSON.parse(localStorage.getItem('kf_admin_recordings') || '[]');
      stored.push(recording);
      localStorage.setItem('kf_admin_recordings', JSON.stringify(stored));
    } catch (e) {}
  }

  deleteRecording(id) {
    this.recordings = this.recordings.filter(r => r.id !== id);
    try {
      const stored = JSON.parse(localStorage.getItem('kf_admin_recordings') || '[]');
      localStorage.setItem('kf_admin_recordings', JSON.stringify(stored.filter(r => r.id !== id)));
    } catch (e) {}
  }

  addQuestion(question) {
    this.questions.push(question);
    try {
      const stored = JSON.parse(localStorage.getItem('kf_admin_questions') || '[]');
      stored.push(question);
      localStorage.setItem('kf_admin_questions', JSON.stringify(stored));
    } catch (e) {}
  }

  updateQuestion(question) {
    if (!question || !question.id) return;
    const idx = (this.questions || []).findIndex(q => q.id === question.id);
    if (idx !== -1) {
      this.questions[idx] = { ...this.questions[idx], ...question };
    } else {
      this.questions.push(question);
    }
    try {
      const stored = JSON.parse(localStorage.getItem('kf_admin_questions') || '[]');
      const sIdx = stored.findIndex(q => q.id === question.id);
      if (sIdx !== -1) {
        stored[sIdx] = { ...stored[sIdx], ...question };
      } else {
        stored.push(question);
      }
      localStorage.setItem('kf_admin_questions', JSON.stringify(stored));
    } catch (e) {}
    return question;
  }

  deleteQuestion(id) {
    this.questions = this.questions.filter(q => q.id !== id);
    try {
      const stored = JSON.parse(localStorage.getItem('kf_admin_questions') || '[]');
      localStorage.setItem('kf_admin_questions', JSON.stringify(stored.filter(q => q.id !== id)));
    } catch (e) {}
  }

  getFlashcards(subjectId) {
    if (!this._deferredLoaded && !this._deferredLoading) {
      this.loadDeferredData();
    }
    if (!subjectId) return this.flashcards || [];
    return (this.flashcards || []).filter(f => f.subject_id === subjectId);
  }

  getPreviousExams(subjectId) {
    if (!this._deferredLoaded && !this._deferredLoading) {
      this.loadDeferredData();
    }
    if (!subjectId) return this.previousExams || [];
    return (this.previousExams || []).filter(e => e.subject_id === subjectId);
  }

  getRequirements(subjectId) {
    if (!this._deferredLoaded && !this._deferredLoading) {
      this.loadDeferredData();
    }
    if (!subjectId) return this.requirements || [];
    return (this.requirements || []).filter(r => r.subject_id === subjectId);
  }

  /**
   * Real dynamic statistics per subject
   * Evaluated strictly from actual data arrays
   */
  getSubjectStats(subjectId) {
    const lecturesCount = (this.sheets || []).filter(s => s.subject_id === subjectId).length;
    const examsCount = (this.previousExams || []).filter(e => e.subject_id === subjectId).length;
    const recordingsCount = (this.recordings || []).filter(r => r.subject_id === subjectId).length;
    const questionsCount = (this.questions || []).filter(q => q.subject_id === subjectId).length;
    const completedCount = window.STORE && window.STORE.getCompletedSheets 
      ? (window.STORE.getCompletedSheets(subjectId) || []).length 
      : 0;
    const progress = lecturesCount > 0 ? Math.round((completedCount / lecturesCount) * 100) : 0;

    return {
      lecturesCount,
      examsCount,
      recordingsCount,
      questionsCount,
      progress
    };
  }

  // 12 Official Dental Subjects Fallback (Academia System Enriched)
  getDefaultSubjects() {
    return [
      {
        id: 'gen-med',
        name_ar: 'الطب العام (الباطنة)',
        name_en: 'General Medicine',
        code: 'MED-301',
        doctor_name_ar: null,
        doctor_name_en: null,
        is_popular: false,
        description_ar: 'أمراض الباطنة والقلب والغدد وعلاقتها بممارسة طب الأسنان',
        description_en: 'Internal medicine, cardiovascular and systemic diseases in dental practice'
      },
      {
        id: 'gen-surgery',
        name_ar: 'الجراحة العامة',
        name_en: 'General Surgery',
        code: 'GS-301',
        doctor_name_ar: null,
        doctor_name_en: null,
        is_popular: false,
        description_ar: 'أساسيات الجراحة العامة والتعقيم والتئام الجروح والنزيف والحروق',
        description_en: 'General surgical principles, wound healing, hemostasis, and shock management'
      },
      {
        id: 'fixed-pros',
        name_ar: 'الاستعاضة السنية الثابتة 2',
        name_en: 'Fixed Prosthodontics II',
        code: 'FP-302',
        doctor_name_ar: null,
        doctor_name_en: null,
        is_popular: true,
        description_ar: 'تحضير التيجان والجسور وخطوط الإنهاء والطبعات المطاطية',
        description_en: 'Crown and bridge preparation, finish lines, and impression techniques'
      },
      {
        id: 'omfs',
        name_ar: 'جراحة الفم والوجه والفكين 1',
        name_en: 'Oral & Maxillofacial Surgery I',
        code: 'OMS-301',
        doctor_name_ar: null,
        doctor_name_en: null,
        is_popular: true,
        description_ar: 'التخدير الموضعي وتقنيات قلع الأسنان ومضاعفات القلع',
        description_en: 'Local anesthesia techniques, exodontia protocols, and surgical complications'
      },
      {
        id: 'oral-diseases',
        name_ar: 'اورال باثولوجي',
        name_en: 'Oral Pathology',
        code: 'OD-301',
        doctor_name_ar: null,
        doctor_name_en: null,
        is_popular: true,
        description_ar: 'دراسة الأمراض والآفات التي تصيب الأنسجة الفموية والأورام',
        description_en: 'Oral mucosal lesions, cysts, odontogenic tumors, and bone pathologies'
      },
      {
        id: 'endo',
        name_ar: 'علاج لب الأسنان 1 (علاج العصب)',
        name_en: 'Endodontics I',
        code: 'END-301',
        doctor_name_ar: null,
        doctor_name_en: null,
        is_popular: true,
        description_ar: 'تشخيص أمراض اللب والذروة وتنظيف وتوسيع القنوات وحشو الجذور',
        description_en: 'Pulp pathology, access cavity design, biomechanical cleaning, and obturation'
      },
      {
        id: 'omdr',
        name_ar: 'طب الفم والتشخيص والأشعة 1',
        name_en: 'OMDR I',
        code: 'OMDR-301',
        doctor_name_ar: null,
        doctor_name_en: null,
        is_popular: false,
        description_ar: 'الفحص السريري وقراءة وتفسير صور الأشعة البانورامية وتطبيقاتها',
        description_en: 'Clinical examination, panoramic radiographs, and radiographic interpretation'
      },
      {
        id: 'preventive',
        name_ar: 'طب الأسنان الوقائي',
        name_en: 'Preventive Dentistry',
        code: 'PREV-301',
        doctor_name_ar: null,
        doctor_name_en: null,
        is_popular: false,
        description_ar: 'طرق الوقاية من نخر الأسنان، الفلورايد، والمواد السادة للشقوق',
        description_en: 'Caries prevention, fluoride modalities, pit and fissure sealants, and oral hygiene'
      },
      {
        id: 'cons-endo',
        name_ar: 'العلاج التحفظي 2',
        name_en: 'Cons & Endo II',
        code: 'CONS-302',
        doctor_name_ar: null,
        doctor_name_en: null,
        is_popular: true,
        description_ar: 'حشوات الكومبوزيت المتقدمة والترميمات التجميلية للأسنان',
        description_en: 'Advanced composite restorations, amalgam techniques, and aesthetic dentistry'
      },
      {
        id: 'ortho',
        name_ar: 'تقويم الأسنان 1',
        name_en: 'Orthodontics I',
        code: 'ORTH-301',
        doctor_name_ar: null,
        doctor_name_en: null,
        is_popular: false,
        description_ar: 'تصنيف إنجل، نمو وتطور الوجه والفكين، وتشخيص سوء الإطباق',
        description_en: 'Angle classification, craniofacial growth, and malocclusion diagnostics'
      },
      {
        id: 'pediatric',
        name_ar: 'طب أسنان الأطفال 1',
        name_en: 'Pediatric Dentistry I',
        code: 'PEDO-301',
        doctor_name_ar: null,
        doctor_name_en: null,
        is_popular: false,
        description_ar: 'التعامل السلوكي مع الأطفال، تخدير الأطفال، وبتر لب الأسنان اللبنية',
        description_en: 'Behavior management, pediatric pulp therapy, and space maintainers'
      },
      {
        id: 'removable-pros',
        name_ar: 'الاستعاضة السنية المتحركة 2',
        name_en: 'Removable Prosthodontics II',
        code: 'RP-302',
        doctor_name_ar: null,
        doctor_name_en: null,
        is_popular: false,
        description_ar: 'الأطقم الجزئية المتحركة وتصميم الكروم كوبالت والروابط الإطباقية',
        description_en: 'Removable partial dentures, cobalt-chromium framework design, and clasps'
      }
    ];
  }

  
  async fetchQuestions() {
    try {
      const res = await fetch('data/questions.json?v=' + Date.now());
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.questions) && data.questions.length > 0) {
          this.questions = data.questions;
          return this.questions;
        }
      }
    } catch (e) {}
    return this.questions;
  }

  
  getDefaultQuestions() {
    return [];
  }

  getDefaultFlashcards() {
    return [];
  }

  getDefaultSheets() {
    return [
      {
        id: "sh_oral_path_caries_01",
        subject_id: "oral-diseases",
        title: "Sheet 1: Dental Caries",
        title_ar: "الشيت الأول: تسوس الأسنان",
        title_en: "Sheet 1: Dental Caries",
        doctor: "د. أسماء سلام الغرياني",
        category: "theoretical",
        pdf_url: "data/sheets/oral-pathology-7-sheets.pdf",
        page_start: 1,
        page_end: 11
      },
      {
        id: "sh_oral_path_pulp_02",
        subject_id: "oral-diseases",
        title: "Sheet 2: Disorders of Dental Pulp",
        title_ar: "الشيت الثاني: اضطرابات وأمراض لب الأسنان",
        title_en: "Sheet 2: Disorders of Dental Pulp",
        doctor: "د. عائشة أبوبكر شنان",
        category: "theoretical",
        pdf_url: "data/sheets/oral-pathology-7-sheets.pdf",
        page_start: 12,
        page_end: 27
      },
      {
        id: "sh_oral_path_periapical_03",
        subject_id: "oral-diseases",
        title: "Sheet 3: Diseases of Periapical Tissues",
        title_ar: "الشيت الثالث: أمراض الأنسجة حول الذروية",
        title_en: "Sheet 3: Diseases of Periapical Tissues",
        doctor: "د. عائشة أبوبكر شنان",
        category: "theoretical",
        pdf_url: "data/sheets/oral-pathology-7-sheets.pdf",
        page_start: 28,
        page_end: 39
      },
      {
        id: "sh_oral_path_cysts_04",
        subject_id: "oral-diseases",
        title: "Sheet 4: Cysts of the Jaw",
        title_ar: "الشيت الرابع: أكياس الفكين",
        title_en: "Sheet 4: Cysts of the Jaw",
        doctor: "د. ابتسام الديب",
        category: "theoretical",
        pdf_url: "data/sheets/oral-pathology-7-sheets.pdf",
        page_start: 40,
        page_end: 76
      },
      {
        id: "sh_oral_path_teeth_dev_05",
        subject_id: "oral-diseases",
        title: "Sheet 5: Developmental Disturbances of Teeth",
        title_ar: "الشيت الخامس: الاضطرابات التطورية للأسنان",
        title_en: "Sheet 5: Developmental Disturbances of Teeth",
        doctor: "د. هيثم الغرياني",
        category: "theoretical",
        pdf_url: "data/sheets/oral-pathology-7-sheets.pdf",
        page_start: 77,
        page_end: 94
      },
      {
        id: "sh_oral_path_oral_dev_06",
        subject_id: "oral-diseases",
        title: "Sheet 6: Developmental Disturbances of Oral & Paraoral Structures",
        title_ar: "الشيت السادس: تراكيب الفم واللسان والوجه",
        title_en: "Sheet 6: Disturbances of Oral & Paraoral Structures",
        doctor: "د. أسماء شنب",
        category: "theoretical",
        pdf_url: "data/sheets/oral-pathology-7-sheets.pdf",
        page_start: 95,
        page_end: 112
      },
      {
        id: "sh_oral_path_epithelial_tumors_07",
        subject_id: "oral-diseases",
        title: "Sheet 7: Oral Non-Odontogenic Epithelial Tumors",
        title_ar: "الشيت السابع: أورام الفم الظهارية غير سنية المنشأ",
        title_en: "Sheet 7: Oral Non-Odontogenic Epithelial Tumors",
        doctor: "د. هيثم الغرياني",
        category: "theoretical",
        pdf_url: "data/sheets/oral-pathology-7-sheets.pdf",
        page_start: 113,
        page_end: 131
      },
      {
        id: "sh_oral_path_additional_08",
        subject_id: "oral-diseases",
        title: "General Oral Pathology (Outside 7 Sheets)",
        title_ar: "الفصل الثامن: أسئلة منهج الباثولوجي التكميلي (خارج الشيتات السبعة)",
        title_en: "Chapter 8: General Oral Pathology (Outside Core Sheets)",
        doctor: "منهج الباثولوجي العام",
        category: "theoretical",
        pdf_url: "data/sheets/oral-pathology-7-sheets.pdf",
        page_start: 1,
        page_end: 131
      },
      {
        id: "sh_oral_path_unidentified_09",
        subject_id: "oral-diseases",
        title: "Academic Review Questions",
        title_ar: "الفصل التاسع: أسئلة للمراجعة الأكاديمية والسريرية",
        title_en: "Chapter 9: Academic Review Questions",
        doctor: "أسئلة سريرية للمراجعة",
        category: "theoretical",
        pdf_url: "data/sheets/oral-pathology-7-sheets.pdf",
        page_start: 1,
        page_end: 131
      }
    ];
  }

  getDefaultRecordings() {
    return [
      {
        id: "rec_oral_path_caries_01",
        sheet_id: "sh_oral_path_caries_01",
        subject_id: "oral-diseases",
        title: "تسجيل المحاضرة الأولى: Dental Caries",
        title_ar: "تسجيل المحاضرة الأولى: Dental Caries",
        title_en: "Lecture 1 Audio: Dental Caries",
        doctor: "د. أسماء سلام الغرياني",
        date: "2026-09-14",
        audio_url: "https://t.me/ravenrecords/13",
        telegram_link: "https://t.me/ravenrecords/13"
      },
      {
        id: "rec_prev_infection_control_01",
        sheet_id: "sh_prev_infection_control_01",
        subject_id: "preventive",
        title: "تسجيل المحاضرة الأولى: Dental Infection Control",
        title_ar: "تسجيل المحاضرة الأولى: Dental Infection Control",
        title_en: "Lecture 1 Audio: Dental Infection Control",
        doctor: "د. حنان عمران",
        date: "2026-09-15",
        audio_url: "https://t.me/ravenrecords/18",
        telegram_link: "https://t.me/ravenrecords/18"
      },
      {
        id: "rec_omdr_patient_evaluation_01",
        sheet_id: "sh_omdr_patient_evaluation_01",
        subject_id: "omdr",
        title: "تسجيل المحاضرة الأولى: Approach to the Evaluation of the Patient",
        title_ar: "تسجيل المحاضرة الأولى: Approach to the Evaluation of the Patient",
        title_en: "Lecture 1 Audio: Approach to the Evaluation of the Patient",
        doctor: "د. عبدالعظيم عياد قداد",
        date: "2026-09-15",
        audio_url: "https://t.me/ravenrecords/21",
        telegram_link: "https://t.me/ravenrecords/21"
      },
      {
        id: "rec_omfs_local_anesthesia_01",
        sheet_id: "sh_omfs_local_anesthesia_01",
        subject_id: "omfs",
        title: "تسجيل المحاضرة الأولى: Local Anesthesia (Part 1)",
        title_ar: "تسجيل المحاضرة الأولى: Local Anesthesia (الجزء 1 - سلايدات 1-41)",
        title_en: "Lecture 1 Audio: Local Anesthesia (Part 1 - Slides 1-41)",
        doctor: "د. هشام شمبش",
        date: "2026-09-20",
        audio_url: "https://t.me/ravenrecords/33",
        telegram_link: "https://t.me/ravenrecords/33",
        part: "Part 1 (Slides 1-41)"
      },
      {
        id: "rec_oral_path_pulp_02",
        sheet_id: "sh_oral_path_pulp_02",
        subject_id: "oral-diseases",
        title: "تسجيل المحاضرة الثانية: Diseases of Pulp & Periapical Tissues (Part 1)",
        title_ar: "تسجيل المحاضرة الثانية: أمراض اللب والأنسجة الذروية (الجزء 1)",
        title_en: "Lecture 2 Audio: Diseases of Pulp & Periapical Tissues (Part 1)",
        doctor: "د. عائشة أبوبكر شنان",
        date: "2026-09-21",
        audio_url: "https://t.me/ravenrecords/35",
        telegram_link: "https://t.me/ravenrecords/35",
        part: "Part 1"
      },
      {
        id: "rec_prev_dental_caries_02",
        sheet_id: "sh_prev_dental_caries_02",
        subject_id: "preventive",
        title: "تسجيل المحاضرة الثانية: Dental Caries",
        title_ar: "تسجيل المحاضرة الثانية: Dental Caries",
        title_en: "Lecture 2 Audio: Dental Caries",
        doctor: "د. حنان عمران",
        date: "2026-09-22",
        audio_url: "https://t.me/ravenrecords/38",
        telegram_link: "https://t.me/ravenrecords/38"
      },
      {
        id: "rec_cons_dentin_pulp_01",
        sheet_id: "sh_cons_dentin_pulp_01",
        subject_id: "cons-endo",
        title: "تسجيل المحاضرة الأولى: The Dentin-Pulp Complex",
        title_ar: "تسجيل المحاضرة الأولى: The Dentin-Pulp Complex",
        title_en: "Lecture 1 Audio: The Dentin-Pulp Complex",
        doctor: "د. آمال كشلاف",
        date: "2026-09-23",
        audio_url: "https://t.me/ravenrecords/40",
        telegram_link: "https://t.me/ravenrecords/40"
      },
      {
        id: "rec_ortho_intro_terminology_01",
        sheet_id: "sh_ortho_intro_terminology_01",
        subject_id: "ortho",
        title: "تسجيل المحاضرة الأولى: Introduction and Terminology (Part 1)",
        title_ar: "تسجيل المحاضرة الأولى: Introduction and Terminology (الجزء 1 - حتى سلايد 22)",
        title_en: "Lecture 1 Audio: Introduction and Terminology (Part 1 - Up to Slide 22)",
        doctor: "د. بسمة جنديلة",
        date: "2026-09-23",
        audio_url: "https://t.me/ravenrecords/42",
        telegram_link: "https://t.me/ravenrecords/42",
        part: "Part 1 (Slides 1-22)"
      },
      {
        id: "rec_oral_path_periapical_03",
        sheet_id: "sh_oral_path_periapical_03",
        subject_id: "oral-diseases",
        title: "تسجيل المحاضرة الثالثة: Diseases of Periapical Tissues",
        title_ar: "تسجيل المحاضرة الثالثة: أمراض الأنسجة الذروية (Diseases of Periapical Tissues)",
        title_en: "Lecture 3 Audio: Diseases of Periapical Tissues",
        doctor: "د. عائشة أبوبكر شنان",
        date: "2026-09-28",
        audio_url: "https://t.me/ravenrecords/65",
        telegram_link: "https://t.me/ravenrecords/65"
      }
    ];
  }

  exportSheetsJson() {
    const deleted = this.getDeletedSheetIds();
    const activeSheets = (this.sheets || []).filter(s => !deleted.includes(s.id));
    return JSON.stringify({ sheets: activeSheets }, null, 2);
  }

  getDefaultAlerts() {
    return [
      {
        id: 'alt_2026_01',
        type: 'urgent',
        badge_ar: 'هام جداً • تأجيل وتسجيل',
        badge_en: 'Urgent • Registration & Schedule',
        title_ar: 'إعلان هام لطلبة الدفعة 33 والطلبة التكميلي (تأجيل الامتحانات وتجديد القيد)',
        title_en: 'Important Notice for Batch 33 & Complementary Students',
        date: '2026-09-11',
        time: '07:39 PM',
        cover: 'assets/icons/faculty_logo.png',
        content_ar: '1. تمت الموافقة على دخول جميع الطلبة (دفعة 33 أو تكميلي) للامتحانات دون استثناء (مقرر واحد أو أكثر).\n2. تأجيل بداية امتحانات الدور الثاني إلى يوم الاثنين 21/09/2026.\n3. تجديد القيد للطلبة التكميلي خلال أيام: الأحد 13/09، الاثنين 14/09، الثلاثاء 15/09/2026 وتجديد الاسم بمكتب الدراسة والامتحانات.\nتنبيه: لن يُسمح بدخول الامتحان لأي طالب تكميلي ما لم يجدد قيده ويسجل اسمه.',
        publisher_ar: 'قسم الدراسة والامتحانات – كلية طب وجراحة الفم والأسنان، جامعة طرابلس'
      },
      {
        id: 'alt_2026_02',
        type: 'exam',
        badge_ar: 'امتحانات • السنة الرابعة',
        badge_en: 'Exams • Year 4',
        title_ar: 'جدول الامتحانات النهائية للدور الثاني لطلبة السنة الرابعة (2025 / 2026)',
        title_en: 'Final Exams Schedule - 2nd Round (Year 4, 2025/2026)',
        date: '2026-09-11',
        time: '07:39 PM',
        cover: 'assets/icons/faculty_logo.png',
        content_ar: 'تعلن الكلية عن مواعيد الامتحانات النهائية للدور الثاني لطلبة السنة الرابعة.\n• موعد الامتحان: من الساعة 09:00 صباحاً إلى 12:00 ظهراً.\n• المكان: تحت المسرح.\nيرجى الالتزام بالحضور قبل بداية الامتحان بوقت كافٍ.',
        publisher_ar: 'قسم الدراسة والامتحانات – كلية طب وجراحة الفم والأسنان، جامعة طرابلس'
      },
      {
        id: 'alt_2026_03',
        type: 'link',
        badge_ar: 'موقع رسمي • بوابة الطلبة',
        badge_en: 'Official Portal • Students',
        title_ar: 'إطلاق الصفحة الإلكترونية الرسمية للطلبة (tables.dentaluot.com)',
        title_en: 'Launch of Official Student Web Portal (tables.dentaluot.com)',
        date: '2026-09-11',
        time: '07:39 PM',
        cover: 'assets/icons/faculty_logo.png',
        content_ar: 'تم إطلاق الصفحة الإلكترونية الرسمية للاطلاع على الجداول الدراسية، الخطة الدراسية، النتائج، وجداول الامتحانات.\n🔗 رابط الدخول المباشر: http://tables.dentaluot.com\nيرجى اعتماد الصفحة كمصدر رسمي للمعلومات الأكاديمية.',
        publisher_ar: 'د. زياد محمد نصر (رئيس قسم الدراسة والامتحانات) – كلية طب وجراحة الفم والأسنان، جامعة طرابلس',
        url: 'http://tables.dentaluot.com'
      },
      {
        id: 'alt_2026_04',
        type: 'plan',
        badge_ar: 'الخطة الدراسية • 2026 / 2027',
        badge_en: 'Academic Plan • 2026 / 2027',
        title_ar: 'الخطة الدراسية الرسمية للعام الجامعي 2026 / 2027',
        title_en: 'Official Academic Plan for Year 2026 / 2027',
        date: '2026-09-11',
        time: '07:39 PM',
        cover: 'assets/icons/faculty_logo.png',
        content_ar: 'تنشر الكلية الخطة الدراسية المتضمنة مواعيد الدراسة والامتحانات والمراجعة الموضوعية وإعلان النتائج للعام 2026 / 2027.\nملاحظة: المواعيد المرتبطة بالمناسبات الهجرية تخضع لما يصدر عن الجهات الرسمية.',
        publisher_ar: 'قسم الدراسة والامتحانات – كلية طب وجراحة الفم والأسنان، جامعة طرابلس'
      }
    ];
  }
}

window.DATA = new DataService();

/**
 * IndexedDB PDF Storage Engine
 * Stores PDF files locally as ArrayBuffers in IndexedDB for offline access.
 * Supports up to ~50MB+ per origin (far exceeding localStorage limits).
 */
class PdfStore {
  constructor() {
    this.dbName = 'kf_pdf_store';
    this.storeName = 'pdfs';
    this.dbVersion = 1;
    this._db = null;
  }

  async _getDB() {
    if (this._db) return this._db;
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'sheetId' });
        }
      };
      request.onsuccess = (e) => {
        this._db = e.target.result;
        resolve(this._db);
      };
      request.onerror = (e) => {
        console.warn('PdfStore: IndexedDB open error', e);
        reject(e);
      };
    });
  }

  /**
   * Save a PDF or Image/Document file for a personal library item
   * @param {string} sheetId
   * @param {File|Blob} file - The File or Blob object
   * @param {object} [extraMeta] - Optional metadata (userId, fileName, fileType)
   * @returns {Promise<boolean>}
   */
  async savePdf(sheetId, file, extraMeta = {}) {
    try {
      const db = await this._getDB();
      const arrayBuffer = typeof file.arrayBuffer === 'function' ? await file.arrayBuffer() : file;
      return new Promise((resolve, reject) => {
        const tx = db.transaction(this.storeName, 'readwrite');
        const store = tx.objectStore(this.storeName);
        store.put({
          sheetId: sheetId,
          userId: extraMeta.userId || null,
          fileName: extraMeta.fileName || file.name || 'document.pdf',
          fileSize: extraMeta.fileSize || file.size || (arrayBuffer ? arrayBuffer.byteLength : 0),
          fileType: extraMeta.fileType || file.type || 'application/pdf',
          data: arrayBuffer,
          savedAt: new Date().toISOString()
        });
        tx.oncomplete = () => resolve(true);
        tx.onerror = (e) => { console.warn('PdfStore savePdf error', e); reject(e); };
      });
    } catch (e) {
      console.warn('PdfStore savePdf failed:', e);
      return false;
    }
  }

  /**
   * Get full record (including Blob & fileType) for a stored file
   * @param {string} sheetId
   * @returns {Promise<{blob: Blob, url: string, fileType: string, fileName: string, fileSize: number}|null>}
   */
  async getFileRecord(sheetId) {
    try {
      const db = await this._getDB();
      return new Promise((resolve) => {
        const tx = db.transaction(this.storeName, 'readonly');
        const store = tx.objectStore(this.storeName);
        const request = store.get(sheetId);
        request.onsuccess = () => {
          const result = request.result;
          if (result && result.data) {
            const fileType = result.fileType || 'application/pdf';
            const blob = new Blob([result.data], { type: fileType });
            resolve({
              blob,
              url: URL.createObjectURL(blob),
              fileType,
              fileName: result.fileName || 'document',
              fileSize: result.fileSize || blob.size
            });
          } else {
            resolve(null);
          }
        };
        request.onerror = () => resolve(null);
      });
    } catch (e) {
      return null;
    }
  }

  /**
   * Get a Blob URL for a stored PDF/Image
   * @param {string} sheetId
   * @returns {Promise<string|null>} Blob URL or null
   */
  async getPdfUrl(sheetId) {
    const rec = await this.getFileRecord(sheetId);
    return rec ? rec.url : null;
  }

  /**
   * Get PDF metadata (name, size, type) without creating a Blob URL
   * @param {string} sheetId
   * @returns {Promise<object|null>}
   */
  async getPdfMeta(sheetId) {
    try {
      const db = await this._getDB();
      return new Promise((resolve) => {
        const tx = db.transaction(this.storeName, 'readonly');
        const store = tx.objectStore(this.storeName);
        const request = store.get(sheetId);
        request.onsuccess = () => {
          const result = request.result;
          if (result) {
            resolve({
              fileName: result.fileName,
              fileSize: result.fileSize,
              fileType: result.fileType || 'application/pdf',
              savedAt: result.savedAt
            });
          } else {
            resolve(null);
          }
        };
        request.onerror = () => resolve(null);
      });
    } catch (e) {
      return null;
    }
  }

  async hasPdf(sheetId) {
    const meta = await this.getPdfMeta(sheetId);
    return !!meta;
  }

  async deletePdf(sheetId) {
    try {
      const db = await this._getDB();
      return new Promise((resolve) => {
        const tx = db.transaction(this.storeName, 'readwrite');
        const store = tx.objectStore(this.storeName);
        store.delete(sheetId);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      });
    } catch (e) {
      return false;
    }
  }
}

window.DATA.pdfStore = new PdfStore();

/**
 * IndexedDB Audio Storage Engine
 * Stores large audio recordings locally as ArrayBuffers in IndexedDB,
 * completely independent of the PDF binary store so recordings are safe.
 */
class AudioStore {
  constructor() {
    this.dbName = 'kf_audio_store';
    this.storeName = 'audios';
    this.dbVersion = 1;
    this._db = null;
  }

  async _getDB() {
    if (this._db) return this._db;
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'recordingId' });
        }
      };
      request.onsuccess = (e) => {
        this._db = e.target.result;
        resolve(this._db);
      };
      request.onerror = (e) => {
        console.warn('AudioStore: IndexedDB open error', e);
        reject(e);
      };
    });
  }

  async saveAudio(recordingId, fileOrBlob, meta = {}) {
    try {
      const db = await this._getDB();
      const arrayBuffer = typeof fileOrBlob.arrayBuffer === 'function'
        ? await fileOrBlob.arrayBuffer()
        : fileOrBlob;
      return new Promise((resolve, reject) => {
        const tx = db.transaction(this.storeName, 'readwrite');
        const store = tx.objectStore(this.storeName);
        store.put({
          recordingId: recordingId,
          fileName: meta.fileName || fileOrBlob.name || `${recordingId}.webm`,
          fileSize: meta.fileSize || fileOrBlob.size || (arrayBuffer ? arrayBuffer.byteLength : 0),
          fileType: meta.fileType || fileOrBlob.type || 'audio/webm',
          meta: meta,
          data: arrayBuffer,
          savedAt: new Date().toISOString()
        });
        tx.oncomplete = () => resolve(true);
        tx.onerror = (e) => { console.warn('AudioStore saveAudio error', e); reject(e); };
      });
    } catch (e) {
      console.warn('AudioStore saveAudio failed:', e);
      return false;
    }
  }

  async saveAudioBlob(recordingId, blob, meta = {}) {
    return this.saveAudio(recordingId, blob, meta);
  }

  async getAudioRecord(recordingId) {
    try {
      const db = await this._getDB();
      return new Promise((resolve) => {
        const tx = db.transaction(this.storeName, 'readonly');
        const store = tx.objectStore(this.storeName);
        const request = store.get(recordingId);
        request.onsuccess = () => {
          const result = request.result;
          if (result && result.data) {
            const fileType = result.fileType || 'audio/webm';
            const blob = new Blob([result.data], { type: fileType });
            resolve({
              blob,
              url: URL.createObjectURL(blob),
              fileType,
              fileName: result.fileName || `${recordingId}.webm`,
              fileSize: result.fileSize || blob.size,
              meta: result.meta || {},
              savedAt: result.savedAt
            });
          } else {
            resolve(null);
          }
        };
        request.onerror = () => resolve(null);
      });
    } catch (e) {
      return null;
    }
  }

  async getAudioUrl(recordingId) {
    const rec = await this.getAudioRecord(recordingId);
    return rec ? rec.url : null;
  }

  async hasAudio(recordingId) {
    try {
      const db = await this._getDB();
      return new Promise((resolve) => {
        const tx = db.transaction(this.storeName, 'readonly');
        const store = tx.objectStore(this.storeName);
        const request = store.get(recordingId);
        request.onsuccess = () => {
          resolve(!!request.result);
        };
        request.onerror = () => resolve(false);
      });
    } catch (e) {
      return false;
    }
  }

  async deleteAudio(recordingId) {
    try {
      const db = await this._getDB();
      return new Promise((resolve) => {
        const tx = db.transaction(this.storeName, 'readwrite');
        const store = tx.objectStore(this.storeName);
        store.delete(recordingId);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      });
    } catch (e) {
      return false;
    }
  }
}

window.DATA.audioStore = new AudioStore();

/**
 * ============================================================================
 * PERSONAL STUDY LIBRARY & AUDIO RECORDINGS ENGINE (window.PersonalLibrary)
 * Strictly isolated per user account (userId).
 * Starts completely empty (GoodNotes / Notability style) with zero default files.
 * ============================================================================
 */
class PersonalLibraryService {
  constructor() {
    this.FOLDER_COLORS = [
      { id: 'sky', hex: '#0ea5e9', bg: 'rgba(14, 165, 233, 0.14)', border: 'rgba(14, 165, 233, 0.35)', labelAr: 'أزرق سماوي', labelEn: 'Sky Blue' },
      { id: 'emerald', hex: '#10b981', bg: 'rgba(16, 185, 129, 0.14)', border: 'rgba(16, 185, 129, 0.35)', labelAr: 'أخضر زمردي', labelEn: 'Emerald' },
      { id: 'amber', hex: '#f59e0b', bg: 'rgba(245, 158, 11, 0.14)', border: 'rgba(245, 158, 11, 0.35)', labelAr: 'كهرماني', labelEn: 'Amber' },
      { id: 'rose', hex: '#f43f5e', bg: 'rgba(244, 63, 94, 0.14)', border: 'rgba(244, 63, 94, 0.35)', labelAr: 'وردي ياقوتي', labelEn: 'Rose' },
      { id: 'violet', hex: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.14)', border: 'rgba(139, 92, 246, 0.35)', labelAr: 'بنفسجي', labelEn: 'Violet' },
      { id: 'teal', hex: '#14b8a6', bg: 'rgba(20, 184, 166, 0.14)', border: 'rgba(20, 184, 166, 0.35)', labelAr: 'فيروزي طبي', labelEn: 'Medical Teal' },
      { id: 'indigo', hex: '#6366f1', bg: 'rgba(99, 102, 241, 0.14)', border: 'rgba(99, 102, 241, 0.35)', labelAr: 'نيلي عميق', labelEn: 'Indigo' },
      { id: 'slate', hex: '#64748b', bg: 'rgba(100, 116, 139, 0.14)', border: 'rgba(100, 116, 139, 0.35)', labelAr: 'رمادي صخري', labelEn: 'Slate' }
    ];

    this.FOLDER_ICONS = [
      'folder', 'book-open', 'microscope', 'stethoscope', 'activity',
      'brain', 'pill', 'syringe', 'shield-check', 'Sparkles', 'layers', 'archive'
    ];
  }

  /**
   * Resolve the active user's unique identifier so every student's library is 100% isolated.
   */
  getCurrentUserId() {
    try {
      const u = window.AUTH && typeof window.AUTH.getUser === 'function' ? window.AUTH.getUser() : null;
      if (u) {
        const raw = String(u.id || u.student_id || u.email || u.username || 'user').trim().toLowerCase();
        return raw.replace(/[^a-z0-9_\-@\.]/g, '_');
      }
      const savedSession = localStorage.getItem('kf_session');
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed && (parsed.id || parsed.student_id || parsed.email)) {
          return String(parsed.id || parsed.student_id || parsed.email).trim().toLowerCase().replace(/[^a-z0-9_\-@\.]/g, '_');
        }
      }
    } catch (e) {}
    return 'guest_local';
  }

  _storageKey() {
    return `kf_personal_library_v1_${this.getCurrentUserId()}`;
  }

  _recordingsKey() {
    return `kf_personal_recordings_v1_${this.getCurrentUserId()}`;
  }

  _loadState() {
    try {
      const raw = localStorage.getItem(this._storageKey());
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          return {
            folders: Array.isArray(parsed.folders) ? parsed.folders : [],
            files: Array.isArray(parsed.files) ? parsed.files : []
          };
        }
      }
    } catch (e) {
      console.warn('PersonalLibrary _loadState error:', e);
    }
    return { folders: [], files: [] };
  }

  _saveState(state) {
    try {
      localStorage.setItem(this._storageKey(), JSON.stringify({
        folders: Array.isArray(state.folders) ? state.folders : [],
        files: Array.isArray(state.files) ? state.files : [],
        updatedAt: new Date().toISOString()
      }));
      window.dispatchEvent(new CustomEvent('kf-library-updated'));
    } catch (e) {
      console.warn('PersonalLibrary _saveState error:', e);
    }
  }

  // ==================== FOLDERS SYSTEM ====================

  getAllFolders() {
    const state = this._loadState();
    return state.folders.sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
  }

  getFoldersByParent(parentId = null) {
    const normParent = parentId || null;
    return this.getAllFolders().filter(f => (f.parentId || null) === normParent);
  }

  getFolderById(folderId) {
    if (!folderId) return null;
    return this.getAllFolders().find(f => f.id === folderId) || null;
  }

  getFolderBreadcrumbs(folderId) {
    const crumbs = [];
    const all = this.getAllFolders();
    let curr = all.find(f => f.id === folderId);
    const visited = new Set();
    while (curr && !visited.has(curr.id)) {
      visited.add(curr.id);
      crumbs.unshift(curr);
      curr = curr.parentId ? all.find(f => f.id === curr.parentId) : null;
    }
    return crumbs;
  }

  getFolderCounts(folderId) {
    const state = this._loadState();
    const subfolders = state.folders.filter(f => (f.parentId || null) === folderId);
    const directFiles = state.files.filter(f => (f.folderId || null) === folderId);

    // Also compute total recursive files count inside subfolders
    const countRecursiveFiles = (fid, seen = new Set()) => {
      if (seen.has(fid)) return 0;
      seen.add(fid);
      let total = state.files.filter(f => (f.folderId || null) === fid).length;
      const children = state.folders.filter(f => (f.parentId || null) === fid);
      for (const ch of children) {
        total += countRecursiveFiles(ch.id, seen);
      }
      return total;
    };

    return {
      subfoldersCount: subfolders.length,
      directFilesCount: directFiles.length,
      totalFilesCount: countRecursiveFiles(folderId)
    };
  }

  createFolder({ name, parentId = null, color = 'sky', icon = 'folder' }) {
    const cleanName = String(name || '').trim();
    if (!cleanName) return null;
    const state = this._loadState();
    const siblings = state.folders.filter(f => (f.parentId || null) === (parentId || null));
    const maxOrder = siblings.reduce((m, f) => Math.max(m, typeof f.orderIndex === 'number' ? f.orderIndex : 0), -1);
    const folder = {
      id: `fld_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      userId: this.getCurrentUserId(),
      name: cleanName,
      parentId: parentId || null,
      color: color || 'sky',
      icon: icon || 'folder',
      orderIndex: maxOrder + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    state.folders.push(folder);
    this._saveState(state);
    return folder;
  }

  updateFolder(folderId, updates = {}) {
    const state = this._loadState();
    const idx = state.folders.findIndex(f => f.id === folderId);
    if (idx === -1) return null;

    // Prevent circular parent assignment
    if (updates.parentId !== undefined && updates.parentId !== null) {
      if (updates.parentId === folderId) return state.folders[idx];
      const crumbs = this.getFolderBreadcrumbs(updates.parentId);
      if (crumbs.some(c => c.id === folderId)) return state.folders[idx];
    }

    state.folders[idx] = {
      ...state.folders[idx],
      ...(updates.name !== undefined ? { name: String(updates.name).trim() || state.folders[idx].name } : {}),
      ...(updates.color !== undefined ? { color: updates.color } : {}),
      ...(updates.icon !== undefined ? { icon: updates.icon } : {}),
      ...(updates.parentId !== undefined ? { parentId: updates.parentId || null } : {}),
      updatedAt: new Date().toISOString()
    };
    this._saveState(state);
    return state.folders[idx];
  }

  reorderFolders(parentId = null, orderedFolderIds = []) {
    const state = this._loadState();
    const normParent = parentId || null;
    const orderMap = new Map();
    orderedFolderIds.forEach((id, i) => orderMap.set(id, i));
    state.folders.forEach(f => {
      if ((f.parentId || null) === normParent && orderMap.has(f.id)) {
        f.orderIndex = orderMap.get(f.id);
      }
    });
    this._saveState(state);
  }

  async deleteFolder(folderId, { deleteFiles = true } = {}) {
    const state = this._loadState();
    const target = state.folders.find(f => f.id === folderId);
    if (!target) return false;

    // Collect all descendant folder IDs
    const folderIdsToRemove = new Set([folderId]);
    let added = true;
    while (added) {
      added = false;
      for (const f of state.folders) {
        if (f.parentId && folderIdsToRemove.has(f.parentId) && !folderIdsToRemove.has(f.id)) {
          folderIdsToRemove.add(f.id);
          added = true;
        }
      }
    }

    if (deleteFiles) {
      const filesToRemove = state.files.filter(fl => folderIdsToRemove.has(fl.folderId));
      for (const fl of filesToRemove) {
        if (window.DATA?.pdfStore) {
          await window.DATA.pdfStore.deletePdf(fl.id).catch(() => {});
        }
      }
      state.files = state.files.filter(fl => !folderIdsToRemove.has(fl.folderId));
    } else {
      // Move files to parent folder of deleted folder
      state.files.forEach(fl => {
        if (folderIdsToRemove.has(fl.folderId)) {
          fl.folderId = target.parentId || null;
        }
      });
    }

    state.folders = state.folders.filter(f => !folderIdsToRemove.has(f.id));
    this._saveState(state);
    return true;
  }

  // ==================== FILES SYSTEM ====================

  getAllFiles() {
    const state = this._loadState();
    return state.files.sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
  }

  getFilesByFolder(folderId = null) {
    const normFolder = folderId || null;
    return this.getAllFiles().filter(f => (f.folderId || null) === normFolder);
  }

  getFileById(fileId) {
    if (!fileId) return null;
    const state = this._loadState();
    const found = state.files.find(f => f.id === fileId);
    if (!found) return null;
    // Normalize properties so sheet-detail.js has everything it expects
    const folder = found.folderId ? state.folders.find(fl => fl.id === found.folderId) : null;
    return {
      ...found,
      title_ar: found.title || found.name,
      title_en: found.title || found.name,
      subject_id: found.folderId || 'personal-library',
      subject_name_ar: folder ? folder.name : 'المكتبة الشخصية',
      subject_code: found.fileKind === 'image' ? 'IMAGE' : 'PDF',
      pages: found.pages || 1,
      pages_count: found.pages || 1,
      pdf_source: 'indexeddb'
    };
  }

  formatFileSize(bytes) {
    const b = Number(bytes) || 0;
    if (b < 1024) return `${b} B`;
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
    return `${(b / (1024 * 1024)).toFixed(2)} MB`;
  }

  /**
   * Inspect a PDF or Image File to extract page count and optional thumbnail data URL
   */
  async inspectUploadedFile(file) {
    const mime = (file.type || '').toLowerCase();
    const ext = (file.name || '').split('.').pop().toLowerCase();
    const isImage = mime.startsWith('image/') || ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'svg'].includes(ext);
    const isPdf = mime === 'application/pdf' || ext === 'pdf';

    if (isImage) {
      const thumb = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const img = new Image();
          img.onload = () => {
            try {
              const canvas = document.createElement('canvas');
              const maxDim = 260;
              const scale = Math.min(1, maxDim / Math.max(img.width || 1, img.height || 1));
              canvas.width = Math.max(1, Math.round((img.width || 200) * scale));
              canvas.height = Math.max(1, Math.round((img.height || 260) * scale));
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              resolve(canvas.toDataURL('image/webp', 0.75));
            } catch (e) {
              resolve(null);
            }
          };
          img.onerror = () => resolve(null);
          img.src = reader.result;
        };
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
      });
      return { pages: 1, fileKind: 'image', thumbnail: thumb };
    }

    if (isPdf && window.pdfjsLib) {
      try {
        const ab = await file.arrayBuffer();
        const loadingTask = window.pdfjsLib.getDocument({ data: ab });
        const pdfDoc = await loadingTask.promise;
        const numPages = pdfDoc.numPages || 1;
        let thumbnail = null;
        try {
          const page1 = await pdfDoc.getPage(1);
          const vp = page1.getViewport({ scale: 0.35 });
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, Math.round(vp.width));
          canvas.height = Math.max(1, Math.round(vp.height));
          const ctx = canvas.getContext('2d');
          await page1.render({ canvasContext: ctx, viewport: vp }).promise;
          thumbnail = canvas.toDataURL('image/webp', 0.72);
        } catch (thumbErr) {}
        return { pages: numPages, fileKind: 'pdf', thumbnail };
      } catch (e) {
        // Fallback binary regex page count if pdfjsLib isn't loaded yet
        try {
          const ab = await file.arrayBuffer();
          const text = new TextDecoder('latin1').decode(ab.slice(0, Math.min(ab.byteLength, 2 * 1024 * 1024)));
          const matches = text.match(/\/Type\s*\/Page\b/g);
          const count = matches ? Math.max(1, matches.length) : 1;
          return { pages: count, fileKind: 'pdf', thumbnail: null };
        } catch (e2) {}
      }
    }

    return { pages: 1, fileKind: isPdf ? 'pdf' : (isImage ? 'image' : 'document'), thumbnail: null };
  }

  /**
   * Import a File from the student's device into the Personal Study Library
   */
  async importFile(file, folderId = null) {
    if (!file) return null;
    const userId = this.getCurrentUserId();
    const fileId = `plf_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    const info = await this.inspectUploadedFile(file);
    const savedOk = await window.DATA.pdfStore.savePdf(fileId, file, {
      userId,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type || (info.fileKind === 'pdf' ? 'application/pdf' : 'application/octet-stream')
    });
    if (!savedOk) {
      throw new Error('Failed to store file in local IndexedDB');
    }

    const state = this._loadState();
    const normFolder = folderId || null;
    const siblings = state.files.filter(f => (f.folderId || null) === normFolder);
    const maxOrder = siblings.reduce((m, f) => Math.max(m, typeof f.orderIndex === 'number' ? f.orderIndex : 0), -1);

    const cleanTitle = String(file.name || 'ملف دراسي').replace(/\.[^.]+$/, '');
    const record = {
      id: fileId,
      userId,
      folderId: normFolder,
      title: cleanTitle,
      name: file.name,
      fileType: file.type || (info.fileKind === 'pdf' ? 'application/pdf' : 'image/png'),
      fileKind: info.fileKind,
      sizeBytes: file.size || 0,
      size: this.formatFileSize(file.size || 0),
      pages: info.pages || 1,
      pages_count: info.pages || 1,
      thumbnail: info.thumbnail || null,
      orderIndex: maxOrder + 1,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastOpenedAt: null,
      lastPage: 1,
      studyTimeSec: 0,
      completedPages: []
    };

    state.files.push(record);
    this._saveState(state);
    return this.getFileById(fileId);
  }

  updateFile(fileId, updates = {}) {
    const state = this._loadState();
    const idx = state.files.findIndex(f => f.id === fileId);
    if (idx === -1) return null;
    state.files[idx] = {
      ...state.files[idx],
      ...(updates.title !== undefined ? { title: String(updates.title).trim() || state.files[idx].title } : {}),
      ...(updates.folderId !== undefined ? { folderId: updates.folderId || null } : {}),
      ...(updates.pages !== undefined ? { pages: updates.pages, pages_count: updates.pages } : {}),
      ...(updates.lastOpenedAt !== undefined ? { lastOpenedAt: updates.lastOpenedAt } : {}),
      ...(updates.lastPage !== undefined ? { lastPage: updates.lastPage } : {}),
      ...(updates.thumbnail !== undefined ? { thumbnail: updates.thumbnail } : {}),
      ...(updates.studyTimeSec !== undefined ? { studyTimeSec: updates.studyTimeSec } : {}),
      ...(updates.completedPages !== undefined ? { completedPages: updates.completedPages } : {}),
      updatedAt: new Date().toISOString()
    };
    this._saveState(state);
    return this.getFileById(fileId);
  }

  moveFile(fileId, targetFolderId = null) {
    const state = this._loadState();
    const idx = state.files.findIndex(f => f.id === fileId);
    if (idx === -1) return null;
    const normFolder = targetFolderId || null;
    const siblings = state.files.filter(f => (f.folderId || null) === normFolder && f.id !== fileId);
    const maxOrder = siblings.reduce((m, f) => Math.max(m, typeof f.orderIndex === 'number' ? f.orderIndex : 0), -1);
    state.files[idx].folderId = normFolder;
    state.files[idx].orderIndex = maxOrder + 1;
    state.files[idx].updatedAt = new Date().toISOString();
    this._saveState(state);
    return this.getFileById(fileId);
  }

  reorderFiles(folderId = null, orderedFileIds = []) {
    const state = this._loadState();
    const normFolder = folderId || null;
    const orderMap = new Map();
    orderedFileIds.forEach((id, i) => orderMap.set(id, i));
    state.files.forEach(f => {
      if ((f.folderId || null) === normFolder && orderMap.has(f.id)) {
        f.orderIndex = orderMap.get(f.id);
      }
    });
    this._saveState(state);
  }

  async deleteFile(fileId, { keepRecordings = true } = {}) {
    const state = this._loadState();
    const exists = state.files.some(f => f.id === fileId);
    if (!exists) return false;
    state.files = state.files.filter(f => f.id !== fileId);
    this._saveState(state);

    if (window.DATA?.pdfStore) {
      await window.DATA.pdfStore.deletePdf(fileId).catch(() => {});
    }

    if (!keepRecordings) {
      const recs = this.getRecordingsForFile(fileId);
      for (const r of recs) {
        await this.deleteRecording(r.id);
      }
    }
    return true;
  }

  searchLibrary(query = '') {
    const q = String(query || '').trim().toLowerCase();
    if (!q) {
      return { folders: [], files: [] };
    }
    const folders = this.getAllFolders().filter(f => (f.name || '').toLowerCase().includes(q));
    const files = this.getAllFiles().filter(f =>
      (f.title || '').toLowerCase().includes(q) ||
      (f.name || '').toLowerCase().includes(q)
    );
    return { folders, files };
  }

  // ==================== FILE-LINKED AUDIO RECORDINGS SYSTEM ====================

  _loadRecordings() {
    try {
      const raw = localStorage.getItem(this._recordingsKey());
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  }

  _saveRecordings(list) {
    try {
      localStorage.setItem(this._recordingsKey(), JSON.stringify(Array.isArray(list) ? list : []));
      window.dispatchEvent(new CustomEvent('kf-recordings-updated'));
    } catch (e) {
      console.warn('PersonalLibrary _saveRecordings error:', e);
    }
  }

  getRecordingsForFile(fileId, { sortBy = 'date' } = {}) {
    if (!fileId) return [];
    const list = this._loadRecordings().filter(r => r && r.fileId === fileId);
    if (sortBy === 'page') {
      list.sort((a, b) => {
        const pa = a.mode === 'page' ? (a.pageNumber || 1) : 0;
        const pb = b.mode === 'page' ? (b.pageNumber || 1) : 0;
        if (pa !== pb) return pa - pb;
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
    } else {
      // Default sort by newest date first
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }
    return list;
  }

  getRecordingsForPage(fileId, pageNumber) {
    return this.getRecordingsForFile(fileId, { sortBy: 'date' }).filter(
      r => r.mode === 'page' && Number(r.pageNumber) === Number(pageNumber)
    );
  }

  async saveRecording({
    id,
    fileId,
    fileName,
    name,
    mode = 'page', // 'page' | 'document'
    pageNumber = 1,
    pageTimestamps = [], // [{ page: 1, timeSec: 0, label: 'Page 1' }, ...]
    durationSec = 0,
    mimeType = 'audio/webm',
    blob
  }) {
    const recId = id || `arec_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    if (blob && window.DATA?.audioStore) {
      await window.DATA.audioStore.saveAudioBlob(recId, blob, {
        fileId,
        fileName,
        name,
        mode,
        pageNumber,
        durationSec,
        fileType: mimeType
      });
    }

    const list = this._loadRecordings();
    const existingIdx = list.findIndex(r => r.id === recId);
    const nowIso = new Date().toISOString();
    const record = {
      id: recId,
      userId: this.getCurrentUserId(),
      fileId,
      fileName: fileName || '',
      name: String(name || '').trim() || (mode === 'page' ? `تسجيل صفحة ${pageNumber}` : 'تسجيل المحاضرة كاملة'),
      mode: mode === 'document' ? 'document' : 'page',
      pageNumber: Number(pageNumber) || 1,
      pageTimestamps: Array.isArray(pageTimestamps) ? pageTimestamps : [],
      durationSec: Math.max(0, Math.round(Number(durationSec) || 0)),
      mimeType: mimeType || 'audio/webm',
      sizeBytes: blob ? blob.size : 0,
      createdAt: existingIdx !== -1 ? list[existingIdx].createdAt : nowIso,
      updatedAt: nowIso
    };

    if (existingIdx !== -1) {
      list[existingIdx] = record;
    } else {
      list.unshift(record);
    }
    this._saveRecordings(list);
    return record;
  }

  renameRecording(recordingId, newName) {
    const clean = String(newName || '').trim();
    if (!clean) return null;
    const list = this._loadRecordings();
    const idx = list.findIndex(r => r.id === recordingId);
    if (idx === -1) return null;
    list[idx].name = clean;
    list[idx].updatedAt = new Date().toISOString();
    this._saveRecordings(list);
    return list[idx];
  }

  async deleteRecording(recordingId) {
    const list = this._loadRecordings();
    const filtered = list.filter(r => r.id !== recordingId);
    this._saveRecordings(filtered);
    if (window.DATA?.audioStore) {
      await window.DATA.audioStore.deleteAudio(recordingId).catch(() => {});
    }
    return true;
  }

  async downloadRecording(recordingId) {
    const list = this._loadRecordings();
    const meta = list.find(r => r.id === recordingId);
    if (!window.DATA?.audioStore) return false;
    const audioRec = await window.DATA.audioStore.getAudioRecord(recordingId);
    if (!audioRec || !audioRec.url) return false;

    const ext = (audioRec.fileType || '').includes('mp4') ? 'm4a'
      : (audioRec.fileType || '').includes('ogg') ? 'ogg'
      : (audioRec.fileType || '').includes('wav') ? 'wav' : 'webm';
    const safeName = (meta?.name || 'recording').replace(/[\\/:*?"<>|]+/g, '_');
    const a = document.createElement('a');
    a.href = audioRec.url;
    a.download = `${safeName}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(audioRec.url), 5000);
    return true;
  }
}

window.PersonalLibrary = new PersonalLibraryService();

/**
 * Modern Empty State UI Helper
 * Renders consistent empty state card across platform
 */
window.renderEmptyState = function(customTitle, customSubtitle, icon = 'folder-open') {
  const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;
  const title = customTitle || (isAr ? 'لا توجد محتويات مضافة حالياً' : 'No contents available yet');
  const subtitle = customSubtitle || (isAr ? 'جاري رفع واستكمال المحتوى الأكاديمي المعتمد من الكلية.' : 'Handouts and academic curriculum materials will be uploaded soon.');

  return `
    <div class="kf-panel" style="text-align: center; padding: 42px 24px; max-width: 560px; margin: 30px auto; border-radius: 14px;">
      <div style="width: 52px; height: 52px; margin: 0 auto 16px; border-radius: 12px; background: rgba(2, 132, 199, 0.08); border: 1px solid rgba(2, 132, 199, 0.2); display: flex; align-items: center; justify-content: center; color: var(--brand-accent);">
        <i data-lucide="${icon}" style="width: 24px; height: 24px;"></i>
      </div>
      <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin-bottom: 6px;">${title}</h3>
      <p style="font-size: 0.835rem; color: var(--text-secondary); max-width: 440px; margin: 0 auto 20px; line-height: 1.55;">${subtitle}</p>
      <div style="display: flex; justify-content: center; gap: 10px;">
        <a href="#/sheets" class="btn btn-primary btn-sm" style="font-weight: 700; gap: 6px; padding: 7px 16px;">
          <i data-lucide="file-text" style="width: 14px; height: 14px;"></i>
          <span>${isAr ? 'تصفح الشيتات المتاحة' : 'Browse Sheets'}</span>
        </a>
        <a href="#/" class="btn btn-secondary btn-sm" style="font-weight: 600; padding: 7px 16px;">
          <span>${isAr ? 'الرئيسية' : 'Home'}</span>
        </a>
      </div>
    </div>
  `;
};
