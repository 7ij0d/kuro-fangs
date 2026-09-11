/**
 * KURO FANGS — STORE (State & LocalStorage Manager)
 * Year 3 Dental SaaS Platform
 */

class AppStore {
  constructor() {
    this.STORAGE_KEYS = {
      POINTS: 'kf_user_points',
      FAVORITES: 'kf_user_favorites',
      NOTES: 'kf_user_notes',
      QUIZ_SCORES: 'kf_quiz_scores',
      CALC_DATA: 'kf_calc_data',
      NOTIF_READ: 'kf_notif_read',
      USER_INFO: 'kf_user_info'
    };

    this.listeners = new Set();
    this.initDefaults();
  }

  initDefaults() {
    if (localStorage.getItem(this.STORAGE_KEYS.POINTS) === null) {
      localStorage.setItem(this.STORAGE_KEYS.POINTS, '25'); // Default 25 points as specified
    }
    if (!localStorage.getItem(this.STORAGE_KEYS.FAVORITES)) {
      localStorage.setItem(this.STORAGE_KEYS.FAVORITES, JSON.stringify([]));
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
        title: 'السنة الثالثة — طب الأسنان',
        avatarText: 'ك'
      }));
    }
  }

  // Subscribe to changes
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

  // User info
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
      this.addPoints(2); // reward for bookmarking
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

  // GPA Calculator data
  getCalculatorData() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.CALC_DATA)) || {};
    } catch {
      return {};
    }
  }

  saveCalculatorData(data) {
    localStorage.setItem(this.STORAGE_KEYS.CALC_DATA, JSON.stringify(data));
    this.notify('calc_saved', data);
  }
}

// Global Store Instance
window.STORE = new AppStore();
