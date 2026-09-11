/**
 * KURO FANGS — DATA SERVICE
 * Loads and provides curriculum data for Year 3 Dentistry
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
    this.loaded = false;
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

    // Fallback if subjects empty (guarantees the 12 dental subjects are always available)
    if (!this.subjects || this.subjects.length === 0) {
      this.subjects = this.getDefaultSubjects();
    }
    if (!this.alerts || this.alerts.length === 0) {
      this.alerts = this.getDefaultAlerts();
    }
    if (!this.sheets || this.sheets.length === 0) {
      this.sheets = this.getDefaultSheets();
    }

    this.loaded = true;
  }

  getSubjects() {
    return this.subjects;
  }

  getSubjectById(id) {
    return this.subjects.find(s => s.id === id);
  }

  getSheetsBySubject(subjectId) {
    return this.sheets.filter(s => s.subject_id === subjectId);
  }

  getRecentSheets(limit = 6) {
    return [...this.sheets].slice(0, limit);
  }

  getAlerts() {
    return this.alerts;
  }

  getQuestionsBySubject(subjectId) {
    if (!subjectId) return this.questions;
    return this.questions.filter(q => q.subject_id === subjectId);
  }

  getFlashcards(subjectId) {
    if (!subjectId) return this.flashcards;
    return this.flashcards.filter(f => f.subject_id === subjectId);
  }

  // 12 Official Dental Subjects Fallback
  getDefaultSubjects() {
    return [
      { id: 'gen-med', name_ar: 'الطب العام (الباطنة)', name_en: 'General Medicine', code: 'MED-301', color: '#0284C7', icon: '💊', sheet_count: 20, description_ar: 'أمراض الباطنة والقلب والغدد الصماء وعلاقتها بصحة الفم وممارسة طب الأسنان' },
      { id: 'gen-surgery', name_ar: 'الجراحة العامة', name_en: 'General Surgery', code: 'GS-301', color: '#EA580C', icon: '⚕️', sheet_count: 22, description_ar: 'أساسيات الجراحة العامة، التعقيم، التئام الجروح، النزيف، الصدمة، والحروق' },
      { id: 'fixed-pros', name_ar: 'الاستعاضة السنية الثابتة 2', name_en: 'Fixed Prosthodontics II', code: 'FP-302', color: '#7C3AED', icon: '👑', sheet_count: 18, description_ar: 'تحضير التيجان والجسور، خطوط الإنهاء، الطبعات المطاطية، والتركيبات الثابتة' },
      { id: 'omfs', name_ar: 'جراحة الفم والوجه والفكين 1', name_en: 'Oral & Maxillofacial Surgery I', code: 'OMS-301', color: '#2563EB', icon: '🔪', sheet_count: 16, description_ar: 'التخدير الموضعي، تقنيات قلع الأسنان، مضاعفات القلع، والعدوى السنية' },
      { id: 'oral-diseases', name_ar: 'علم أمراض الفم', name_en: 'Oral Diseases / Pathology', code: 'OD-301', color: '#DB2777', icon: '🔬', sheet_count: 24, description_ar: 'دراسة الأمراض والآفات التي تصيب الأنسجة الفموية، الأورام، والآفات المخاطية' },
      { id: 'endo', name_ar: 'علاج لب الأسنان 1 (علاج العصب)', name_en: 'Endodontics I', code: 'END-301', color: '#DC2626', icon: '⚡', sheet_count: 16, description_ar: 'تشخيص أمراض اللب والذروة، فتح الحجرة اللبية، تنظيف وتوسيع القنوات، وحشو الجذور' },
      { id: 'omdr', name_ar: 'طب الفم والتشخيص والأشعة 1', name_en: 'OMDR I', code: 'OMDR-301', color: '#0D9488', icon: '🩻', sheet_count: 19, description_ar: 'الفحص السريري، أخذ السيرة المرضية، قراءة وتفسير صور الأشعة الفموية وتطبيقاتها' },
      { id: 'preventive', name_ar: 'طب الأسنان الوقائي', name_en: 'Preventive Dentistry', code: 'PREV-301', color: '#059669', icon: '🛡️', sheet_count: 14, description_ar: 'طرق الوقاية من نخر الأسنان، الفلورايد، المواد السادة للشقوق، وصحة الفم المجتمعية' },
      { id: 'cons-endo', name_ar: 'العلاج التحفظي 2', name_en: 'Cons & Endo II', code: 'CONS-302', color: '#D97706', icon: '✨', sheet_count: 20, description_ar: 'حشوات الكومبوزيت المتقدمة، حشوات الأملغم، التثبيت بالبراغي، والترميمات التجميلية' },
      { id: 'ortho', name_ar: 'تقويم الأسنان 1', name_en: 'Orthodontics I', code: 'ORTH-301', color: '#4F46E5', icon: '📐', sheet_count: 15, description_ar: 'تصنيف إنجل، نمو وتطور الوجه والفكين، تشخيص سوء الإطباق، والأجهزة التقويمية' },
      { id: 'pediatric', name_ar: 'طب أسنان الأطفال 1', name_en: 'Pediatric Dentistry I', code: 'PEDO-301', color: '#EC4899', icon: '🧸', sheet_count: 15, description_ar: 'التعامل السلوكي مع الأطفال، تخدير الأطفال، بتر وحشو لب الأسنان اللبنية وحافظات المسافة' },
      { id: 'removable-pros', name_ar: 'الاستعاضة السنية المتحركة 2', name_en: 'Removable Prosthodontics II', code: 'RP-302', color: '#0891B2', icon: '🦷', sheet_count: 17, description_ar: 'الأطقم الجزئية المتحركة، تصميم الكروم كوبالت، والروابط والخطافات الإطباقية' }
    ];
  }

  getDefaultAlerts() {
    return [
      {
        id: 'alt-1',
        title: 'تحديد موعد الامتحان النصفي — جراحة الفم والفكين 1',
        message: 'تم تحديد الامتحان النصفي يوم الأحد 25 أكتوبر في المدرج الرئيسي الساعة 10:00 صباحاً.',
        type: 'urgent',
        created_at: 'منذ يومين'
      },
      {
        id: 'alt-2',
        title: 'رفع شيت المحاضرة الخامسة: علم أمراض الفم',
        message: 'تمت إضافة شيت "Benign Odontogenic Tumors" مع التسجيل الصوتي والملاحظات الهامة.',
        type: 'info',
        created_at: 'منذ 3 ساعات'
      }
    ];
  }

  getDefaultSheets() {
    return [
      { id: 'sh-1', title: 'Local Anesthesia Techniques & Landmarks', subject_id: 'omfs', subject_name: 'جراحة الفم والفكين 1', doctor_name: 'د. يوسف التاجوري', date: '2026-09-09', type: 'شيت محاضرة', file_type: 'PDF' },
      { id: 'sh-2', title: 'Preparation of Full Veneer Crown', subject_id: 'fixed-pros', subject_name: 'الاستعاضة السنية الثابتة 2', doctor_name: 'د. نادية عبدالحميد', date: '2026-09-08', type: 'ملخص عملي', file_type: 'PDF' },
      { id: 'sh-3', title: 'Pulp and Periapical Pathosis', subject_id: 'endo', subject_name: 'علاج العصب 1', doctor_name: 'د. خالد الصالح', date: '2026-09-07', type: 'شيت محاضرة', file_type: 'PDF' },
      { id: 'sh-4', title: 'Cardiovascular Diseases in Dental Practice', subject_id: 'gen-med', subject_name: 'الطب العام', doctor_name: 'د. سارة المنصوري', date: '2026-09-05', type: 'مذكرة دراسية', file_type: 'PDF' },
      { id: 'sh-5', title: 'Angle Classification & Malocclusion Analysis', subject_id: 'ortho', subject_name: 'تقويم الأسنان 1', doctor_name: 'د. طارق السنوسي', date: '2026-09-04', type: 'شيت محاضرة', file_type: 'PDF' },
      { id: 'sh-6', title: 'White & Red Lesions of Oral Mucosa', subject_id: 'oral-diseases', subject_name: 'علم أمراض الفم', doctor_name: 'د. أحمد المهدي', date: '2026-09-02', type: 'مذكرة تلخيص', file_type: 'PDF' }
    ];
  }
}

window.DATA = new DataService();
