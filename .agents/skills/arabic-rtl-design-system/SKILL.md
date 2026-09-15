---
name: arabic-rtl-design-system
description: >-
  High-end Arabic/English bidirectional UI architecture, glassmorphic medical themes,
  CSS variable design tokens, responsive mobile dental components, and micro-interactions.
---

# Arabic RTL Design System & Dental UI Skill

This skill documents design tokens, bidirectional layout rules, and medical UI patterns specialized for Libyan & Arab dental university students.

---

## 1. Bidirectional Design Tokens & Typography

### Font Hierarchy
- **Arabic Body & Headlines:** `Cairo`, `Tajawal`, or `Noto Sans Arabic` with font weights `400`, `600`, `700`, `800`.
- **Medical / Latin Terms (e.g. "Provisional Restorations", "Endodontics"):** Inter / SF Pro / Segoe UI with optical kerning.

```css
:root {
  --kf-font-ar: 'Cairo', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --kf-font-en: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  
  /* Dental Color Palette */
  --kf-primary: #0284C7;       /* Electric Clinical Cyan */
  --kf-primary-hover: #0369A1;
  --kf-accent: #38BDF8;        /* Glowing Accent */
  --kf-success: #10B981;       /* Dental Exam Pass Green */
  --kf-danger: #EF4444;        /* Critical / Laser Red */
  --kf-warning: #F59E0B;
  
  /* Dark Glass Theme */
  --kf-bg-dark: #0B0F17;
  --kf-surface-dark: #131B2A;
  --kf-border-dark: rgba(255, 255, 255, 0.08);
  --kf-glass-dark: rgba(19, 27, 42, 0.75);
}

[dir="rtl"] {
  font-family: var(--kf-font-ar);
}

[dir="ltr"] {
  font-family: var(--kf-font-en);
}
```

---

## 2. Logical CSS Properties for Zero-Friction RTL/LTR

Avoid `margin-left` or `padding-right`. Always use CSS Logical Properties:

```css
/* ✅ DO THIS: Adapts automatically when switching Arabic <-> English */
.j-btn-icon {
  margin-inline-end: 8px;
}

.j-card {
  padding-inline: 16px;
  padding-block: 12px;
  border-inline-start: 3px solid var(--kf-primary);
}
```

---

## 3. Dental Educational Components

### FDI Two-Digit Tooth Notation Badge
```html
<span class="kf-tooth-badge" title="Upper Right First Molar (Tooth 16)">
  #16 سن طاحن علوي
</span>
```

### CSS Badges & Glass Cards
```css
.kf-tooth-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(2, 132, 199, 0.12);
  border: 1px solid rgba(2, 132, 199, 0.3);
  color: var(--kf-accent);
  padding: 3px 10px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
}

.kf-glass-card {
  background: var(--kf-glass-dark);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--kf-border-dark);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
  transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.2s;
}

.kf-glass-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(2, 132, 199, 0.15);
}
```

---

## 4. Mobile Ergonomics & Touch Targets

1. **48px Minimum Hit Target:** All toolbar buttons, tabs, and drawer close buttons must have at least 44–48px effective touch target size (`min-width: 44px; min-height: 44px;`).
2. **Bottom-First Navigation on Mobile:** Primary actions (page counter, next/previous slide, tool drawer) positioned within thumb reach at the bottom edge.
