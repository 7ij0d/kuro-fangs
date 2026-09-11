/**
 * KURO FANGS — STORE (State, LocalStorage, Lang & Theme Manager)
 */

const FOX_SKINS = [
  {
    id: 'fox_skin_1',
    name_en: 'Classic Kuro Fox',
    name_ar: 'الثعلب الكلاسيكي',
    cost: 0,
    isFree: true,
    image: 'assets/fox_skins/fox_skin_1.jpg',
    tag_en: 'Default Mascot',
    tag_ar: 'الافتراضي - مجاناً',
    desc_en: 'The official original mascot for Kuro Fangs dental students.',
    desc_ar: 'التميمة الأصلية الرسمية المعتمدة لدفعة طب وجراحة الفم والأسنان.'
  },
  {
    id: 'fox_skin_2',
    name_en: 'Surgeon Fox',
    name_ar: 'الثعلب الجراح',
    cost: 40,
    isFree: false,
    image: 'assets/fox_skins/fox_skin_2.jpg',
    tag_en: 'Surgical & Phantom',
    tag_ar: 'جراحة وفانتوم',
    desc_en: 'Equipped with sterile surgical scrubs, gloves, and clinical precision.',
    desc_ar: 'جاهز للعمليات الجراحية في العيادات ومعامل الفانتوم بدقة متناهية.'
  },
  {
    id: 'fox_skin_3',
    name_en: 'Study Ninja Fox',
    name_ar: 'الثعلب النينجا للمذاكرة',
    cost: 45,
    isFree: false,
    image: 'assets/fox_skins/fox_skin_3.jpg',
    tag_en: 'Hyper Focus',
    tag_ar: 'تركيز فائق وسرعة',
    desc_en: 'Stealth speed and razor-sharp focus for all-night cram sessions.',
    desc_ar: 'سرعة خاطفة في إنجاز الشيتات وسحق ليلة الامتحان بتركيز نينجا لا يهدأ.'
  },
  {
    id: 'fox_skin_4',
    name_en: 'Smart Scholar Fox',
    name_ar: 'الثعلب الأكاديمي الذكي',
    cost: 50,
    isFree: false,
    image: 'assets/fox_skins/fox_skin_4.jpg',
    tag_en: 'Academic Pro',
    tag_ar: 'أكاديمي متفوق',
    desc_en: 'Armed with dental textbooks, high-yield notes, and top GPA power.',
    desc_ar: 'حامل مذكرات الأسنان والمراجع العلمية وصاحب المعدلات التراكمية العليا.'
  },
  {
    id: 'fox_skin_5',
    name_en: 'Royal Professor Fox',
    name_ar: 'الثعلب البروفيسور الملكي',
    cost: 55,
    isFree: false,
    image: 'assets/fox_skins/fox_skin_5.jpg',
    tag_en: 'Consultant Tier',
    tag_ar: 'بروفيسور استشاري',
    desc_en: 'Distinguished royal robe representing mastery of oral pathology and surgery.',
    desc_ar: 'رداء الأستاذ الجامعي الفخم وخبرة السنين في طب الفم والتشخيص المتقدم.'
  },
  {
    id: 'fox_skin_6',
    name_en: 'Cyber Night Fox',
    name_ar: 'الثعلب السايبر الليلي',
    cost: 60,
    isFree: false,
    image: 'assets/fox_skins/fox_skin_6.jpg',
    tag_en: 'Cyber Neon',
    tag_ar: 'سايبر نيون رقمي',
    desc_en: 'Futuristic neon aesthetics tuned for modern digital dentistry & CAD/CAM.',
    desc_ar: 'ثعلب رقمي مستقبلي بإضاءات نيون وتقنيات طب الأسنان الرقمية والطباعة ثلاثية الأبعاد.'
  }
];

class AppStore {
  constructor() {
    this.STORAGE_KEYS = {
      POINTS: 'kf_user_points',
      LANG: 'kf_lang',
      THEME: 'kf_theme',
      FAVORITES: 'kf_user_favorites',
      NOTES: 'kf_user_notes',
      USER_INFO: 'kf_user_info',
      OWNED_SKINS: 'kf_owned_skins',
      EQUIPPED_SKIN: 'kf_equipped_skin'
    };

    this.listeners = new Set();
    this.initDefaults();
  }

  initDefaults() {
    // 1. Theme (Default: Clean Light)
    if (!localStorage.getItem(this.STORAGE_KEYS.THEME)) {
      localStorage.setItem(this.STORAGE_KEYS.THEME, 'light');
    }

    // 2. Language (Default: English)
    if (!localStorage.getItem(this.STORAGE_KEYS.LANG)) {
      localStorage.setItem(this.STORAGE_KEYS.LANG, 'en');
    }

    // 3. Points
    if (localStorage.getItem(this.STORAGE_KEYS.POINTS) === null) {
      localStorage.setItem(this.STORAGE_KEYS.POINTS, '25');
    }

    // 4. Favorites
    if (!localStorage.getItem(this.STORAGE_KEYS.FAVORITES)) {
      localStorage.setItem(this.STORAGE_KEYS.FAVORITES, JSON.stringify([
        { id: 'sh-1', title: 'Local Anesthesia Techniques & Landmarks', type: 'sheet', subject_name: 'OMFS I' },
        { id: 'sh-2', title: 'Preparation of Full Veneer Crown', type: 'sheet', subject_name: 'Fixed Pros II' }
      ]));
    }

    // 5. Notes
    if (!localStorage.getItem(this.STORAGE_KEYS.NOTES)) {
      localStorage.setItem(this.STORAGE_KEYS.NOTES, JSON.stringify([
        {
          id: 'note-1',
          title: 'Local Anesthesia Dosages',
          content: 'Lidocaine 2% max 4.4 mg/kg with epinephrine 1:80,000. Avoid intravascular injection.',
          subjectId: 'omfs',
          date: '2026-09-08'
        }
      ]));
    }

    // 6. User Info
    if (!localStorage.getItem(this.STORAGE_KEYS.USER_INFO)) {
      localStorage.setItem(this.STORAGE_KEYS.USER_INFO, JSON.stringify({
        name: 'Kuro Student',
        title: 'Year 3 Dental Student',
        avatarText: 'K'
      }));
    }

    // 7. Fox Mascot Skins Hub
    if (!localStorage.getItem(this.STORAGE_KEYS.OWNED_SKINS)) {
      localStorage.setItem(this.STORAGE_KEYS.OWNED_SKINS, JSON.stringify(['fox_skin_1']));
    }
    if (!localStorage.getItem(this.STORAGE_KEYS.EQUIPPED_SKIN)) {
      localStorage.setItem(this.STORAGE_KEYS.EQUIPPED_SKIN, 'fox_skin_1');
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify(event, payload) {
    this.listeners.forEach(cb => {
      try { cb(event, payload); } catch (e) { console.error(e); }
    });
  }

  // Theme (Light / Dark)
  getTheme() {
    return localStorage.getItem(this.STORAGE_KEYS.THEME) || 'light';
  }

  setTheme(theme) {
    if (theme !== 'light' && theme !== 'dark') theme = 'light';
    localStorage.setItem(this.STORAGE_KEYS.THEME, theme);
    document.documentElement.setAttribute('data-theme', theme);
    this.notify('theme_changed', theme);
    return theme;
  }

  toggleTheme() {
    const current = this.getTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    return this.setTheme(next);
  }

  // Points
  getPoints() {
    return parseInt(localStorage.getItem(this.STORAGE_KEYS.POINTS) || '25', 10);
  }

  addPoints(amount) {
    const current = this.getPoints();
    const updated = Math.max(0, current + amount);
    localStorage.setItem(this.STORAGE_KEYS.POINTS, updated.toString());
    this.notify('points_changed', updated);
    return updated;
  }

  // Favorites
  getFavorites() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.FAVORITES)) || [];
    } catch {
      return [];
    }
  }

  isFavorite(id, type = 'sheet') {
    const favs = this.getFavorites();
    return favs.some(f => f.id === id && f.type === type);
  }

  toggleFavorite(item) {
    let favs = this.getFavorites();
    const idx = favs.findIndex(f => f.id === item.id && f.type === item.type);
    if (idx >= 0) {
      favs.splice(idx, 1);
    } else {
      favs.push({ ...item, addedAt: new Date().toISOString() });
      this.addPoints(2);
    }
    localStorage.setItem(this.STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
    this.notify('favorites_changed', favs);
    return idx < 0;
  }

  // Notes
  getNotes() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.NOTES)) || [];
    } catch {
      return [];
    }
  }

  saveNote(note) {
    const notes = this.getNotes();
    if (!note.id) {
      note.id = 'note_' + Date.now();
      note.date = new Date().toISOString().split('T')[0];
      notes.unshift(note);
      this.addPoints(5);
    } else {
      const idx = notes.findIndex(n => n.id === note.id);
      if (idx >= 0) notes[idx] = note;
      else notes.unshift(note);
    }
    localStorage.setItem(this.STORAGE_KEYS.NOTES, JSON.stringify(notes));
    this.notify('notes_changed', notes);
    return note;
  }

  deleteNote(id) {
    let notes = this.getNotes();
    notes = notes.filter(n => n.id !== id);
    localStorage.setItem(this.STORAGE_KEYS.NOTES, JSON.stringify(notes));
    this.notify('notes_changed', notes);
  }

  getUserInfo() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.USER_INFO)) || {
        name: 'Kuro Student',
        title: 'Year 3 Dental Student',
        avatarText: 'K'
      };
    } catch {
      return { name: 'Kuro Student', title: 'Year 3 Dental Student', avatarText: 'K' };
    }
  }

  getCalculatorData() {
    try {
      return JSON.parse(localStorage.getItem('kf_calc_data')) || {};
    } catch {
      return {};
    }
  }

  saveCalculatorData(data) {
    localStorage.setItem('kf_calc_data', JSON.stringify(data));
    this.notify('calc_saved', data);
  }

  // ==========================================================================
  // FOX MASCOT SKINS HUB (6 MASCOT CHARACTERS & REWARDS)
  // ==========================================================================
  getFoxSkins() {
    return FOX_SKINS;
  }

  getSkinById(id) {
    return FOX_SKINS.find(s => s.id === id) || FOX_SKINS[0];
  }

  getOwnedSkins() {
    try {
      const owned = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.OWNED_SKINS)) || ['fox_skin_1'];
      if (!owned.includes('fox_skin_1')) owned.unshift('fox_skin_1');
      return owned;
    } catch {
      return ['fox_skin_1'];
    }
  }

  isSkinOwned(id) {
    if (id === 'fox_skin_1') return true;
    return this.getOwnedSkins().includes(id);
  }

  getEquippedSkin() {
    return localStorage.getItem(this.STORAGE_KEYS.EQUIPPED_SKIN) || 'fox_skin_1';
  }

  getEquippedSkinData() {
    const id = this.getEquippedSkin();
    return this.getSkinById(id);
  }

  unlockSkin(skinId) {
    const skin = this.getSkinById(skinId);
    if (!skin) return { success: false, reason: 'not_found' };

    if (this.isSkinOwned(skinId)) {
      this.equipSkin(skinId);
      return { success: true, alreadyOwned: true, skin };
    }

    const currentPoints = this.getPoints();
    if (currentPoints < skin.cost) {
      return { success: false, reason: 'insufficient_points', needed: skin.cost - currentPoints, skin };
    }

    // Deduct points
    this.addPoints(-skin.cost);

    // Add to owned skins
    const owned = this.getOwnedSkins();
    if (!owned.includes(skinId)) {
      owned.push(skinId);
      localStorage.setItem(this.STORAGE_KEYS.OWNED_SKINS, JSON.stringify(owned));
    }

    // Auto-equip unlocked skin
    this.equipSkin(skinId);

    this.notify('skin_unlocked', skin);
    this.notify('skins_changed', { owned: this.getOwnedSkins(), equipped: skinId });
    return { success: true, skin };
  }

  equipSkin(skinId) {
    if (!this.isSkinOwned(skinId)) return false;
    localStorage.setItem(this.STORAGE_KEYS.EQUIPPED_SKIN, skinId);
    const skin = this.getSkinById(skinId);

    if (typeof window.updateGlobalMascotAvatars === 'function') {
      window.updateGlobalMascotAvatars();
    }

    this.notify('skin_equipped', skin);
    this.notify('skins_changed', { owned: this.getOwnedSkins(), equipped: skinId });
    return true;
  }
}

window.STORE = new AppStore();

