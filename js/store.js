/**
 * KURO FANGS — STORE (State, LocalStorage, Lang & Theme Manager)
 */

class AppStore {
  constructor() {
    this.STORAGE_KEYS = {
      POINTS: 'kf_user_points',
      LANG: 'kf_lang',
      THEME: 'kf_theme',
      FAVORITES: 'kf_user_favorites',
      NOTES: 'kf_user_notes',
      USER_INFO: 'kf_user_info'
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
}

window.STORE = new AppStore();
