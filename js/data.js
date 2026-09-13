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

    try {
      const [
        subjectsRes,
        sheetsRes,
        alertsRes,
        doctorsRes,
        questionsRes,
        flashcardsRes,
        examsRes,
        reqRes
      ] = await Promise.allSettled([
        fetch('data/subjects.json').then(r => r.json()),
        fetch('data/sheets.json').then(r => r.json()),
        fetch('data/alerts.json').then(r => r.json()),
        fetch('data/doctors.json').then(r => r.json()),
        fetch('data/questions.json').then(r => r.json()),
        fetch('data/flashcards.json').then(r => r.json()),
        fetch('data/previous_exams.json').then(r => r.json()),
        fetch('data/requirements.json').then(r => r.json())
      ]);

      if (subjectsRes.status === 'fulfilled' && subjectsRes.value?.subjects) {
        this.subjects = subjectsRes.value.subjects;
      }
      if (sheetsRes.status === 'fulfilled' && sheetsRes.value?.sheets) {
        this.sheets = sheetsRes.value.sheets;
      }
      if (alertsRes.status === 'fulfilled' && alertsRes.value?.alerts) {
        this.alerts = alertsRes.value.alerts;
      }
      if (doctorsRes.status === 'fulfilled' && doctorsRes.value?.doctors) {
        this.doctors = doctorsRes.value.doctors;
      }
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
    } catch (err) {
      console.warn('Could not load all JSON files via fetch, using fallback data:', err);
    }

    const defaultSubjects = this.getDefaultSubjects();
    if (!this.subjects || this.subjects.length === 0) {
      this.subjects = defaultSubjects;
    } else {
      this.subjects.forEach(s => {
        const def = defaultSubjects.find(d => d.id === s.id);
        if (def) {
          s.doctor_name_ar = s.doctor_name_ar || null;
          s.doctor_name_en = s.doctor_name_en || null;
          s.is_popular = s.is_popular !== undefined ? s.is_popular : def.is_popular;
        }
      });
    }

    // Attach high-res cover images to each subject
    this.subjects.forEach(s => {
      s.cover_image = s.cover_image || this.subjectCovers[s.id] || `assets/covers/${s.id}.webp`;
    });

    if (!this.alerts || this.alerts.length === 0) {
      this.alerts = this.getDefaultAlerts();
    }
    if (!this.sheets || this.sheets.length === 0) {
      this.sheets = this.getDefaultSheets();
    }

    // Merge custom admin-uploaded sheets from localStorage if present
    try {
      const customSheets = JSON.parse(localStorage.getItem('kf_admin_custom_sheets') || '[]');
      if (Array.isArray(customSheets) && customSheets.length > 0) {
        customSheets.forEach(cs => {
          if (!this.sheets.some(s => s.id === cs.id)) {
            this.sheets.unshift(cs);
          }
        });
      }
    } catch (e) {}

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
    return list.filter(s => s.subject_id === subjectId);
  }

  getSheetsForSubject(subjectId) {
    return this.getSheetsBySubject(subjectId);
  }

  getRecentSheets(limit = 6) {
    const deleted = this.getDeletedSheetIds();
    return [...(this.sheets || [])].filter(s => !deleted.includes(s.id)).slice(0, limit);
  }

  getAlerts() {
    const deleted = this.getDeletedAlertIds();
    return (this.alerts || []).filter(a => !deleted.includes(a.id));
  }

  getQuestionsBySubject(subjectId) {
    if (!subjectId) return this.questions;
    return this.questions.filter(q => q.subject_id === subjectId);
  }

  getFlashcards(subjectId) {
    if (!subjectId) return this.flashcards;
    return this.flashcards.filter(f => f.subject_id === subjectId);
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

