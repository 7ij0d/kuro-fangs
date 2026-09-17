---
name: elite-frontend-design
description: >-
  World-class frontend design craftsmanship, anti-AI-slop principles, bespoke UI engineering,
  high-density dashboard patterns, and Linear/Raycast-grade micro-interactions for modern web apps.
---

# Elite Frontend Design & Anti-AI-Slop Engineering Guide

This skill enforces world-class digital product design and eliminates the generic, instantly recognizable "AI-generated template" aesthetic. Follow these principles when designing web applications, admin portals, dashboards, and landing pages.

---

## 1. The Anti-AI Manifesto (What to BAN)

Standard AI outputs suffer from repetitive, soulless design patterns ("AI Slop"). When designing UI, **strictly avoid**:

| AI Cliché Pattern | Why It Looks Cheap & Obvious | The Elite Alternative |
| :--- | :--- | :--- |
| **Monotonous Dark Purple / Cyan Glowing Cards** | Default Tailwind/ChatGPT SaaS trope used on 10,000 generic templates. | **Rich Obsidian, Slate & Warm Neutral Depth**: Layered shades (`#090B10`, `#11141D`, `#181D29`) with intentional brand accents. |
| **3 Identical Card Grids with Floating Icons** | Formulaic, repetitive, and lacks hierarchy. | **Asymmetric Bento Grids & Data-Dense Layouts**: Primary actions dominate, secondary tools stay accessible, metrics feel live. |
| **Excessive `backdrop-filter: blur(20px)` Everywhere** | Causes GPU lag and washes out content readability. | **Subtle 1px Borders & Inset Highlights**: Use crisp semi-transparent borders with subtle depth (`box-shadow: inset 0 1px 0 rgba(255,255,255,0.06)`). |
| **Gigantic 20px+ Radius on Everything** | Childish, bubble-like appearance that ruins enterprise credibility. | **Hierarchical Radii**: Outer containers `12px-14px`, inner cards `8px-10px`, inputs/buttons `6px-8px`, badges `9999px`. |
| **Clunky Centered Alert Popups** | Jarring interruptive UX from the 2010s. | **Slide-out Command Drawers or Inline Action Bars**: Fast, non-blocking, and ergonomically superior. |
| **Inline CSS Styles Scattered in JS** | Unmaintainable, inconsistent margins, un-themeable. | **Semantic CSS Design Tokens & Scoped Utility Classes**. |

---

## 2. Typographic Precision & Pairing

Typographic hierarchy separates amateur templates from bespoke software products:

### Font Pairing Standards
- **Primary Latin Font:** `Inter`, `Plus Jakarta Sans`, or `Geist` with negative letter-spacing for large titles (`letter-spacing: -0.025em`).
- **Primary Arabic Font:** `IBM Plex Sans Arabic`, `Readex Pro`, or `Cairo` with tuned line heights (`line-height: 1.6 - 1.7`).
- **Monospace / Metric Data:** `JetBrains Mono`, `Geist Mono`, or `Fira Code` with tabular figures (`font-variant-numeric: tabular-nums`).

### Micro-Typography Rules
```css
/* Display Titles */
.elite-heading-xl {
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 750;
  letter-spacing: -0.03em;
  line-height: 1.15;
  color: var(--text-primary);
}

/* Category & Section Overline Labels */
.elite-overline {
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
}

/* Tabular Numbers for Metrics */
.elite-metric-num {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-feature-settings: "tnum" 1;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
}
```

---

## 3. Surface Depth, Layering & The "Linear Border" Technique

High-end interfaces feel physical and tactile without relying on heavy skeuomorphism.

### The Double-Border Elevation Recipe
Instead of a simple flat border or harsh drop shadow, use layered inset highlights:

```css
.elite-panel {
  background: var(--surface-card, #131722);
  border: 1px solid rgba(255, 255, 255, 0.07);
  box-shadow: 
    0 0 0 1px rgba(0, 0, 0, 0.4),
    0 4px 16px -2px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  transition: border-color 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease;
}

.elite-panel:hover {
  border-color: rgba(255, 255, 255, 0.14);
  box-shadow: 
    0 0 0 1px rgba(0, 0, 0, 0.5),
    0 8px 24px -4px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.12);
}
```

---

## 4. Modern Admin Dashboard UX (Linear & Raycast Inspired)

An admin portal must look like an executive command center, not a student homework project:

### 1. Unified Control Bar
- Quick breadcrumb navigation with live status indicator.
- Search input with keyboard shortcut hint (`Cmd+K` or `/`).
- Quick actions grouped cleanly in a pill bar with subtle divider lines.

### 2. High-Density Data Tables
- Sticky headers with subtle background blur.
- Row hover with soft background highlight (`background: rgba(255, 255, 255, 0.02)`).
- Status badges featuring live pulse dots:
```html
<span class="status-pill status-active">
  <span class="pulse-dot"></span>
  <span>نشط (Active)</span>
</span>
```
```css
.pulse-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10B981;
  box-shadow: 0 0 8px #10B981;
  animation: pulse-ring 2s infinite cubic-bezier(0.4, 0, 0.6, 1);
}

@keyframes pulse-ring {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.85); }
}
```

### 3. Tactile Button Engineering
Never build flat buttons with simple hover colors. Give them mechanical tactile feel:
```css
.elite-btn-primary {
  background: linear-gradient(180deg, #BE123C 0%, #9F1239 100%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 
    0 1px 2px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
  color: #FFFFFF;
  font-weight: 600;
  border-radius: 8px;
  padding: 8px 16px;
  transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.elite-btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 
    0 4px 12px rgba(190, 18, 60, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.elite-btn-primary:active {
  transform: translateY(1px) scale(0.985);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}
```

---

## 5. Micro-Interactions & Performance Invariants

1. **Spring Transitions:** Use `cubic-bezier(0.16, 1, 0.3, 1)` for smooth, friction-less movement instead of generic `ease` or `linear`.
2. **Accessible Contrast:** High contrast text ratio (minimum 4.5:1 for body, 3:1 for headers).
3. **Empty States with Character:** Never display a blank white/gray box. Use purposeful empty states with an actionable button and clean iconography.
4. **Logical CSS for Arabic/English (RTL/LTR):** Always use `margin-inline-start`, `padding-inline`, `border-inline-end` to guarantee native bi-directional rendering.
