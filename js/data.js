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
    this.summaries = [];
    this.videos = [];
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

    // 2. Merge cached cloud sheets & local custom admin sheets instantly
    try {
      ['kf_cloud_cached_sheets', 'kf_admin_custom_sheets'].forEach(k => {
        try {
          const raw = localStorage.getItem(k);
          if (raw && raw.includes('sh-fixed-provisional')) {
            const parsed = JSON.parse(raw).filter(s => s && s.id !== 'sh-fixed-provisional');
            localStorage.setItem(k, JSON.stringify(parsed));
          }
        } catch (err) {}
      });

      const cachedCloudSheets = JSON.parse(localStorage.getItem('kf_cloud_cached_sheets') || '[]');
      if (Array.isArray(cachedCloudSheets) && cachedCloudSheets.length > 0) {
        cachedCloudSheets.forEach(cs => {
          const idx = this.sheets.findIndex(s => s.id === cs.id);
          if (idx !== -1) {
            this.sheets[idx] = { ...this.sheets[idx], ...cs };
          } else {
            this.sheets.push(cs);
          }
        });
      }
      const customSheets = JSON.parse(localStorage.getItem('kf_admin_custom_sheets') || '[]');
      if (Array.isArray(customSheets) && customSheets.length > 0) {
        customSheets.forEach(cs => {
          if (!this.sheets.some(s => s.id === cs.id)) {
            this.sheets.unshift(cs);
          }
        });
      }
    } catch (e) {}

    this.loaded = true;

    // 3. Fire JSON & Cloud sync asynchronously in background (Non-Blocking)
    setTimeout(async () => {
      try {
        const [subjectsRes, sheetsRes, alertsRes, doctorsRes] = await Promise.allSettled([
          fetch('data/subjects.json').then(r => r.json()),
          fetch('data/sheets.json').then(r => r.json()),
          fetch('data/alerts.json').then(r => r.json()),
          fetch('data/doctors.json').then(r => r.json())
        ]);

        if (subjectsRes.status === 'fulfilled' && subjectsRes.value?.subjects) {
          this.subjects = subjectsRes.value.subjects;
          this.subjects.forEach(s => {
            s.cover_image = s.cover_image || this.subjectCovers[s.id] || `assets/covers/${s.id}.webp`;
          });
        }
        if (sheetsRes.status === 'fulfilled' && Array.isArray(sheetsRes.value?.sheets) && sheetsRes.value.sheets.length > 0) {
          sheetsRes.value.sheets.forEach(s => {
            if (!this.sheets.some(existing => existing.id === s.id)) {
              this.sheets.push(s);
            }
          });
        }
        if (alertsRes.status === 'fulfilled' && alertsRes.value?.alerts) {
          this.alerts = alertsRes.value.alerts;
        }
        if (doctorsRes.status === 'fulfilled' && doctorsRes.value?.doctors) {
          this.doctors = doctorsRes.value.doctors;
        }

        // Live Central Cloud Sync from Supabase in background
        if (window.KuroCloud && typeof window.KuroCloud.fetchCloudSheets === 'function') {
          const liveCloudSheets = await window.KuroCloud.fetchCloudSheets();
          if (Array.isArray(liveCloudSheets) && liveCloudSheets.length > 0) {
            liveCloudSheets.forEach(cs => {
              const idx = this.sheets.findIndex(s => s.id === cs.id);
              if (idx !== -1) {
                this.sheets[idx] = { ...this.sheets[idx], ...cs };
              } else {
                this.sheets.push(cs);
              }
            });
            localStorage.setItem('kf_cloud_cached_sheets', JSON.stringify(liveCloudSheets));
          }
        }
      } catch (err) {
        console.warn('Background data sync note:', err);
      }
    }, 10);
    // Merge custom admin announcements from localStorage if present
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

    // Filter out permanently deleted items stored by admin
    const deletedSheetIds = this.getDeletedSheetIds();
    if (deletedSheetIds.length > 0) {
      this.sheets = (this.sheets || []).filter(s => !deletedSheetIds.includes(s.id));
    }

    const deletedAlertIds = this.getDeletedAlertIds();
    if (deletedAlertIds.length > 0) {
      this.alerts = (this.alerts || []).filter(a => !deletedAlertIds.includes(a.id));
    }

    this.loaded = true;
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
    return this.subjects;
  }

  getSubjectById(id) {
    return this.subjects.find(s => s.id === id);
  }

  getSheetsBySubject(subjectId) {
    const deleted = this.getDeletedSheetIds();
    let list = (this.sheets || []).filter(s => !deleted.includes(s.id));
    if (!subjectId) return list;
    list = list.filter(s => s.subject_id === subjectId);
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

  getRecentSheets(limit = 6) {
    const deleted = this.getDeletedSheetIds();
    return [...(this.sheets || [])].filter(s => !deleted.includes(s.id)).slice(0, limit);
  }

  /**
   * Synchronize sheets live from central Supabase database
   * Can be invoked on route changes or when refreshing data
   */
  async syncCloudSheets() {
    try {
      if (window.KuroCloud && typeof window.KuroCloud.fetchCloudSheets === 'function') {
        const liveCloudSheets = await window.KuroCloud.fetchCloudSheets();
        if (Array.isArray(liveCloudSheets) && liveCloudSheets.length > 0) {
          const deleted = this.getDeletedSheetIds();
          liveCloudSheets.forEach(cs => {
            if (deleted.includes(cs.id)) return;
            const idx = this.sheets.findIndex(s => s.id === cs.id);
            if (idx !== -1) {
              this.sheets[idx] = { ...this.sheets[idx], ...cs };
            } else {
              this.sheets.push(cs);
            }
          });
          localStorage.setItem('kf_cloud_cached_sheets', JSON.stringify(liveCloudSheets));
          return liveCloudSheets;
        }
      }
    } catch (e) {
      console.warn('Live syncCloudSheets note:', e);
    }
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
      const [
        questionsRes,
        flashcardsRes,
        examsRes,
        reqRes
      ] = await Promise.allSettled([
        fetch('data/questions.json').then(r => r.json()),
        fetch('data/flashcards.json').then(r => r.json()),
        fetch('data/previous_exams.json').then(r => r.json()),
        fetch('data/requirements.json').then(r => r.json())
      ]);

      if (questionsRes.status === 'fulfilled' && questionsRes.value?.questions) {
        this.questions = questionsRes.value.questions;
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
    const summariesCount = (this.summaries || []).filter(s => s.subject_id === subjectId).length;
    const examsCount = (this.previousExams || []).filter(e => e.subject_id === subjectId).length;
    const completedCount = window.STORE && window.STORE.getCompletedSheets 
      ? (window.STORE.getCompletedSheets(subjectId) || []).length 
      : 0;
    const progress = lecturesCount > 0 ? Math.round((completedCount / lecturesCount) * 100) : 0;

    return {
      lecturesCount,
      summariesCount,
      examsCount,
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
        name_ar: 'علم أمراض الفم',
        name_en: 'Oral Diseases / Pathology',
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

  getDefaultSheets() {
    return [];
  }

  /**
   * Export all currently active sheets as a formatted JSON string
   * ready for data/sheets.json or GitHub API commit
   */
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
   * Save a PDF file for a sheet
   * @param {string} sheetId
   * @param {File} file - The PDF File object
   * @returns {Promise<boolean>}
   */
  async savePdf(sheetId, file) {
    try {
      const db = await this._getDB();
      const arrayBuffer = await file.arrayBuffer();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(this.storeName, 'readwrite');
        const store = tx.objectStore(this.storeName);
        store.put({
          sheetId: sheetId,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
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
   * Get a Blob URL for a stored PDF
   * @param {string} sheetId
   * @returns {Promise<string|null>} Blob URL or null
   */
  async getPdfUrl(sheetId) {
    try {
      const db = await this._getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(this.storeName, 'readonly');
        const store = tx.objectStore(this.storeName);
        const request = store.get(sheetId);
        request.onsuccess = () => {
          const result = request.result;
          if (result && result.data) {
            const blob = new Blob([result.data], { type: result.fileType || 'application/pdf' });
            resolve(URL.createObjectURL(blob));
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
   * Get PDF metadata (name, size) without loading the full file
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
            resolve({ fileName: result.fileName, fileSize: result.fileSize, savedAt: result.savedAt });
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
   * Check if a PDF is stored for a sheet
   * @param {string} sheetId
   * @returns {Promise<boolean>}
   */
  async hasPdf(sheetId) {
    const meta = await this.getPdfMeta(sheetId);
    return !!meta;
  }

  /**
   * Delete a stored PDF
   * @param {string} sheetId
   * @returns {Promise<boolean>}
   */
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
 * Modern Empty State UI Helper
 * Renders consistent empty state card across platform
 */
window.renderEmptyState = function(customTitle, customSubtitle, icon = 'folder-open') {
  const isAr = window.I18N ? window.I18N.getLang() === 'ar' : true;
  const title = customTitle || (isAr ? 'لا توجد محتويات مضافة حالياً' : 'No contents available yet');
  const subtitle = customSubtitle || (isAr ? 'جاري رفع واستكمال الملازم والمحتوى الأكاديمي قريباً' : 'Handouts and academic curriculum materials will be uploaded soon.');

  return `
    <div class="empty-state-card">
      <div class="empty-state-icon-wrap">
        <i data-lucide="${icon}"></i>
      </div>
      <h3 class="empty-state-title">${title}</h3>
      <p class="empty-state-subtitle">${subtitle}</p>
    </div>
  `;
};

