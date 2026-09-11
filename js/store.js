/**
 * KURO FANGS — STORE (LOCK-IN EDITION)
 * Manages State, Streaks, Points, Favorites, Notes & Lock-in Sessions
 */

class AppStore {
  constructor() {
    this.STORAGE_KEYS = {
      POINTS: 'kf_user_points',
      STREAK: 'kf_user_streak',
      LAST_STREAK_DATE: 'kf_last_streak_date',
      LAST_SHEET: 'kf_last_sheet',
      FAVORITES: 'kf_user_favorites',
      NOTES: 'kf_user_notes',
      USER_INFO: 'kf_user_info'
    };

    this.listeners = new Set();
    this.initDefaults();
  }

  initDefaults() {
    if (localStorage.getItem(this.STORAGE_KEYS.POINTS) === null) {
      localStorage.setItem(this.STORAGE_KEYS.POINTS, '25');
    }
    if (localStorage.getItem(this.STORAGE_KEYS.STREAK) === null) {
      localStorage.setItem(this.STORAGE_KEYS.STREAK, '1'); // 1 day streak
    }
    if (!localStorage.getItem(this.STORAGE_KEYS.LAST_SHEET)) {
      localStorage.setItem(this.STORAGE_KEYS.LAST_SHEET, JSON.stringify({
        id: 'sh-1',
        title: 'Local Anesthesia Techniques & Landmarks',
        subject_name: 'جراحة الفم والوجه والفكين 1',
        doctor_name: 'د. يوسف التاجوري',
        progress: 65
      }));
    }
    if (!localStorage.getItem(this.STORAGE_KEYS.FAVORITES)) {
      localStorage.setItem(this.STORAGE_KEYS.FAVORITES, JSON.stringify([
        { id: 'sh-1', title: 'Local Anesthesia Techniques & Landmarks', type: 'sheet', subject_name: 'جراحة الفم 1' },
        { id: 'sh-2', title: 'Preparation of Full Veneer Crown', type: 'sheet', subject_name: 'التركيبات الثابتة 2' }
      ]));
    }
    if (!localStorage.getItem(this.STORAGE_KEYS.NOTES)) {
      localStorage.setItem(this.STORAGE_KEYS.NOTES, JSON.stringify([
        {
          id: 'note-1',
          title: 'ملاحظات هامة في التخدير الموضعي',
          content: 'التركيز على جرعات الليدوكايين مع الأدرينالين 1:80,000 وتجنب الحقن الوريدي المباشر.',
          subjectId: 'omfs',
          date: '2026-09-08'
        }
      ]));
    }
    if (!localStorage.getItem(this.STORAGE_KEYS.USER_INFO)) {
      localStorage.setItem(this.STORAGE_KEYS.USER_INFO, JSON.stringify({
        name: 'طالب كورو',
        title: 'السنة الثالثة — طب وجراحة الفم والأسنان',
        avatarText: 'ك'
      }));
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

  // Study Streak (From Lock-in sidebar footer)
  getStreak() {
    return parseInt(localStorage.getItem(this.STORAGE_KEYS.STREAK) || '1', 10);
  }

  recordStreak() {
    const today = new Date().toISOString().split('T')[0];
    const lastDate = localStorage.getItem(this.STORAGE_KEYS.LAST_STREAK_DATE);
    if (lastDate !== today) {
      const streak = this.getStreak() + 1;
      localStorage.setItem(this.STORAGE_KEYS.STREAK, streak.toString());
      localStorage.setItem(this.STORAGE_KEYS.LAST_STREAK_DATE, today);
      this.addPoints(15);
      this.notify('streak_updated', streak);
      return streak;
    }
    return this.getStreak();
  }

  // Last opened sheet for "CONTINUE STUDYING" card
  getLastSheet() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.LAST_SHEET));
    } catch {
      return null;
    }
  }

  setLastSheet(sheet) {
    localStorage.setItem(this.STORAGE_KEYS.LAST_SHEET, JSON.stringify(sheet));
    this.notify('last_sheet_changed', sheet);
  }

  // User Info
  getUserInfo() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.USER_INFO)) || {
        name: 'طالب كورو',
        title: 'السنة الثالثة — طب الأسنان',
        avatarText: 'ك'
      };
    } catch {
      return { name: 'طالب كورو', title: 'السنة الثالثة — طب الأسنان', avatarText: 'ك' };
    }
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
}

window.STORE = new AppStore();
