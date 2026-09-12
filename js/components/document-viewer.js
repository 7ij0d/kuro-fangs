/**
 * KURO FANGS — JNOTES INTERACTIVE NOTE STUDIO & DEDICATED SHEET READER
 * Features Mark Pen Settings (Straight line drawing, Bottom display, Add to pen-box),
 * Line Weight Thickness Slider (0.1mm - 3.0mm), Right Vertical Pen Box,
 * Mobile Touch Drawing, Straight-line Snap, and Instant Auto-Save on Every Action.
 */

const DocumentViewer = {
  currentDoc: null,
  isOpen: false,

  init() {
    // Document viewer initialization
  },

  download(doc) {
    window.STORE.addPoints(10);
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;
    const title = doc?.title || doc?.title_ar || doc?.title_en || 'Provisional Restoration & Temporization';
    const msg = isAr 
      ? `تم بدء تنزيل الشيت بنجاح! (+10 نقاط أكاديمية) — [${title}]`
      : `Download started! (+10 pts earned) — [${title}]`;
    window.showToast(msg, { type: 'success', points: 10 });
  },

  generateDocHTML(doc, isAr) {
    const docId = doc.id || 'sh-fixed-provisional';
    const title = doc.title || (isAr ? doc.title_ar : doc.title_en) || 'Provisional Restoration & Temporization';
    const doctor = doc.doctor_name || 'Dr. Hala Alhawij';
    const university = doc.university || 'University of Tripoli - School of Dentistry';
    const year = doc.year || '2025-2026';

    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=3.0, user-scalable=yes" />
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=IBM+Plex+Sans+Arabic:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --brand: #0284C7;
      --brand-dark: #0369A1;
      --paper-bg: #FFFFFF;
      --bg: #12131F;
      --text: #0F172A;
      --text-sub: #475569;
      --highlight-color: rgba(254, 240, 138, 0.6);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      font-family: 'IBM Plex Sans Arabic', 'Inter', sans-serif;
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.6;
      width: 100vw;
      height: 100vh;
      height: 100dvh;
      min-height: 100vh;
      max-height: 100dvh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      user-select: none;
      -webkit-user-select: none;
      -webkit-touch-callout: none;
    }

    /* JNotes Standalone Professional Header Toolbar */
    .jnotes-top-bar {
      height: 56px;
      background: #181926;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 14px;
      gap: 10px;
      z-index: 99999;
      position: relative;
      pointer-events: auto !important;
      flex-shrink: 0;
      user-select: none;
      overflow-x: auto;
      scrollbar-width: none;
    }

    .jnotes-top-bar::-webkit-scrollbar {
      display: none;
    }

    /* Left Section: Exit & Title */
    .jnotes-left-section {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }

    .jtool-exit-btn {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #F8FAFC;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 0.775rem;
      font-weight: 700;
      cursor: pointer !important;
      pointer-events: auto !important;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
    }

    .jtool-exit-btn:hover {
      background: rgba(239, 68, 68, 0.15);
      border-color: #EF4444;
      color: #EF4444;
    }

    .jnotes-title-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      max-width: 280px;
    }

    .jnotes-badge {
      background: rgba(2, 132, 199, 0.2);
      color: #38BDF8;
      border: 1px solid rgba(255, 255, 255, 0.4);
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 0.72rem;
      font-weight: 800;
      white-space: nowrap;
    }

    .jnotes-title-text {
      color: #E2E8F0;
      font-size: 0.825rem;
      font-weight: 700;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Center Section: Tools */
    .jnotes-center-section {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
      pointer-events: auto !important;
    }

    .jnotes-tool-segmented {
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 3px 6px;
      gap: 3px;
      pointer-events: auto !important;
    }

    .jtool-icon-btn {
      background: transparent;
      border: none;
      color: #94A3B8;
      width: 30px;
      height: 30px;
      border-radius: 8px;
      cursor: pointer !important;
      pointer-events: auto !important;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
    }

    .jtool-icon-btn:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #F8FAFC;
    }

    .jnotes-divider {
      width: 1px;
      height: 20px;
      background: rgba(255, 255, 255, 0.12);
      margin: 0 4px;
    }

    .jtool-btn {
      background: transparent;
      border: 1px solid transparent;
      color: #94A3B8;
      padding: 5px 9px;
      border-radius: 8px;
      font-size: 0.775rem;
      font-weight: 700;
      cursor: pointer !important;
      pointer-events: auto !important;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      transition: all 0.15s ease;
      user-select: none;
      position: relative;
    }

    .jtool-btn:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #F8FAFC;
    }

    .jtool-btn.active {
      background: #0284C7 !important;
      color: #FFFFFF !important;
      border-color: rgba(255, 255, 255, 0.25) !important;
      box-shadow: 0 0 12px rgba(2, 132, 199, 0.5);
    }

    /* Right Section */
    .jnotes-right-section {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }

    .auto-save-pill {
      background: rgba(16, 185, 129, 0.12);
      color: #34D399;
      border: 1px solid rgba(16, 185, 129, 0.25);
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 0.725rem;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: opacity 0.3s ease;
    }

    .auto-save-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #34D399;
      box-shadow: 0 0 8px #34D399;
    }

    .jnotes-page-nav-pill {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      padding: 2px 6px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: #E2E8F0;
      font-size: 0.75rem;
      font-weight: 800;
    }

    .page-nav-arrow {
      background: transparent;
      border: none;
      color: #94A3B8;
      width: 22px;
      height: 22px;
      border-radius: 6px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
    }

    .page-nav-arrow:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #FFF;
    }

    .jtool-download-btn {
      background: #0284C7;
      color: #FFFFFF;
      border-color: #0284C7;
    }

    .jtool-download-btn:hover {
      background: #0369A1;
      color: #FFFFFF;
    }

    /* Page Index Sliding Overlay Drawer (Matching Spec) */
    .jnotes-sidebar-index {
      position: absolute;
      right: 0;
      top: 56px;
      height: calc(100vh - 56px);
      width: 280px;
      background: #181926;
      border-left: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: -8px 0 35px rgba(0, 0, 0, 0.6);
      transform: translateX(100%);
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 9000;
      display: flex;
      flex-direction: column;
    }

    .jnotes-sidebar-index.open {
      transform: translateX(0);
    }

    .drawer-backdrop {
      position: absolute;
      inset: 0;
      top: 56px;
      background: rgba(0, 0, 0, 0.45);
      backdrop-filter: blur(3px);
      z-index: 8990;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.25s ease;
    }

    .drawer-backdrop.open {
      opacity: 1;
      pointer-events: auto;
    }

    /* Right Vertical Floating Pen Dock (Matching Spec) */
    .jnotes-vertical-dock {
      position: fixed;
      right: 14px;
      top: 76px;
      z-index: 8000;
      background: rgba(24, 25, 38, 0.94);
      backdrop-filter: blur(14px);
      border-radius: 26px;
      padding: 10px 8px;
      box-shadow: 0 12px 35px rgba(0, 0, 0, 0.45);
      display: flex;
      flex-direction: column;
      gap: 10px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      align-items: center;
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease;
    }

    /* Automatically retract dock when drawer opens so it NEVER collides */
    .jnotes-vertical-dock.dock-retracted {
      transform: translateX(90px);
      opacity: 0;
      pointer-events: none;
    }

    .dock-preset-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 2px solid rgba(255, 255, 255, 0.16);
      background: #1F2133;
      color: #F8FAFC;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 0.65rem;
      font-weight: 800;
      cursor: pointer;
      transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
      position: relative;
      user-select: none;
    }

    .dock-preset-btn:hover {
      transform: scale(1.1);
      border-color: #38BDF8;
    }

    .dock-preset-btn.active {
      transform: scale(1.15);
      border-color: #0284C7 !important;
      box-shadow: 0 0 12px rgba(2, 132, 199, 0.6);
      background: #25283D;
    }

    .dock-preset-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      margin-top: 1px;
    }

    /* Delete X icon badge on dock preset */
    .dock-delete-btn {
      position: absolute;
      top: -4px;
      left: -4px;
      width: 16px;
      height: 16px;
      background: #EF4444;
      color: #FFFFFF;
      border-radius: 50%;
      font-size: 0.6rem;
      font-weight: 900;
      line-height: 16px;
      text-align: center;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
      opacity: 0;
      transform: scale(0.6);
      transition: opacity 0.15s ease, transform 0.15s ease;
      z-index: 5;
    }

    .dock-preset-btn:hover .dock-delete-btn {
      opacity: 1;
      transform: scale(1);
    }

    @media (hover: none) {
      .dock-delete-btn {
        opacity: 0.85;
        transform: scale(0.85);
      }
    }

    /* 24-Color Palette Swatches */
    .palette-swatch-btn {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      border: 2px solid transparent;
      cursor: pointer !important;
      pointer-events: auto !important;
      transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    }

    .palette-swatch-btn:hover {
      transform: scale(1.15);
      z-index: 2;
    }

    .palette-swatch-btn.active {
      transform: scale(1.18);
      border-color: #0284C7 !important;
      box-shadow: 0 0 10px rgba(2, 132, 199, 0.6);
    }

    .palette-swatch-btn.active::after {
      content: '✓';
      color: #FFFFFF;
      font-size: 0.75rem;
      font-weight: 900;
      text-shadow: 0 1px 3px rgba(0,0,0,0.9);
    }

    /* JNotes Popups */
    .jnotes-popup-card {
      position: absolute;
      top: 60px;
      background: #FFFFFF;
      color: #0F172A;
      border-radius: 14px;
      padding: 16px 18px;
      box-shadow: 0 15px 40px rgba(0,0,0,0.45);
      z-index: 9600;
      width: 280px;
      border: 1px solid #E2E8F0;
      display: none;
      animation: popupZoom 0.18s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes popupZoom {
      from { opacity: 0; transform: scale(0.92) translateY(-6px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }

    .jnotes-popup-card.open {
      display: block;
    }

    .popup-title {
      font-size: 0.85rem;
      font-weight: 800;
      color: #0F172A;
      margin-bottom: 12px;
      text-align: center;
    }

    .popup-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      font-size: 0.8rem;
    }

    .popup-toggle-switch {
      position: relative;
      width: 38px;
      height: 20px;
      background: #CBD5E1;
      border-radius: 20px;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .popup-toggle-switch.on {
      background: #0284C7;
    }

    .popup-toggle-switch::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      background: #FFF;
      border-radius: 50%;
      top: 2px;
      left: 2px;
      transition: transform 0.2s ease;
    }

    .popup-toggle-switch.on::after {
      transform: translateX(18px);
    }

    .btn-add-penbox {
      width: 100%;
      background: #F8FAFC;
      border: 1px solid #CBD5E1;
      border-radius: 8px;
      padding: 8px;
      font-size: 0.775rem;
      font-weight: 700;
      color: #0284C7;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      margin-top: 8px;
    }

    .btn-add-penbox:hover {
      background: #EFF6FF;
      border-color: #0284C7;
    }

    /* 2-Panel Note Studio UI Overhaul Styles */
    .jnotes-active-tool-pill {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.14);
      color: #F8FAFC;
      padding: 5px 12px;
      border-radius: 12px;
      font-size: 0.775rem;
      font-weight: 700;
      cursor: pointer !important;
      pointer-events: auto !important;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.15s ease;
      user-select: none;
    }

    .jnotes-active-tool-pill:hover, .jnotes-active-tool-pill.active {
      background: rgba(2, 132, 199, 0.2);
      border-color: #0284C7;
      color: #38BDF8;
    }

    .jnotes-active-tool-pill .tool-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      border: 1.5px solid rgba(255, 255, 255, 0.5);
      flex-shrink: 0;
    }

    /* Collapsible Floating Side Tool Panel */
    #jnotes-tools-panel {
      position: fixed;
      left: 16px;
      top: 68px;
      width: 320px;
      max-width: calc(100vw - 32px);
      max-height: calc(100dvh - 84px);
      overflow-y: auto;
      z-index: 99995;
      background: #1E2030;
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 16px;
      box-shadow: 0 16px 45px rgba(0, 0, 0, 0.6);
      padding: 16px;
      color: #F8FAFC;
      display: none;
      flex-direction: column;
      gap: 14px;
      direction: rtl;
      scrollbar-width: thin;
      pointer-events: auto !important;
    }

    #jnotes-tools-panel.open {
      display: flex;
      animation: panelPop 0.18s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes panelPop {
      from { opacity: 0; transform: translateY(-8px) scale(0.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .panel-section-title {
      font-size: 0.8rem;
      font-weight: 800;
      color: #94A3B8;
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .panel-tool-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 6px;
    }

    .panel-tool-btn {
      background: #25283D;
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #CBD5E1;
      border-radius: 10px;
      padding: 8px 4px;
      font-size: 0.775rem;
      font-weight: 700;
      cursor: pointer !important;
      pointer-events: auto !important;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      transition: all 0.15s ease;
    }

    .panel-tool-btn:hover {
      background: #2D304A;
      color: #FFF;
      border-color: rgba(255, 255, 255, 0.2);
    }

    .panel-tool-btn.active {
      background: #0284C7 !important;
      border-color: #38BDF8 !important;
      color: #FFF !important;
      box-shadow: 0 0 12px rgba(2, 132, 199, 0.5);
    }

    .panel-chips-row {
      display: flex;
      gap: 6px;
      margin-top: 8px;
    }

    .thickness-chip {
      flex: 1;
      background: #25283D;
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #94A3B8;
      border-radius: 6px;
      padding: 5px 0;
      font-size: 0.725rem;
      font-weight: 700;
      text-align: center;
      cursor: pointer !important;
      pointer-events: auto !important;
      transition: all 0.15s ease;
    }

    .thickness-chip:hover {
      background: #2D304A;
      color: #FFF;
    }

    .thickness-chip.active {
      background: rgba(2, 132, 199, 0.3) !important;
      border-color: #0284C7 !important;
      color: #38BDF8 !important;
      font-weight: 800;
    }

    .panel-palette-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 6px;
      direction: ltr;
    }

    .paper-theme-row {
      display: flex;
      gap: 6px;
    }

    .paper-theme-btn {
      flex: 1;
      background: #25283D;
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #CBD5E1;
      border-radius: 8px;
      padding: 7px 2px;
      font-size: 0.725rem;
      font-weight: 700;
      cursor: pointer !important;
      pointer-events: auto !important;
      text-align: center;
      transition: all 0.15s ease;
    }

    .paper-theme-btn:hover {
      background: #2D304A;
      color: #FFF;
    }

    .paper-theme-btn.active {
      background: rgba(2, 132, 199, 0.25) !important;
      border-color: #0284C7 !important;
      color: #38BDF8 !important;
    }

    .panel-actions-row {
      display: flex;
      gap: 6px;
      align-items: center;
    }

    .panel-action-btn {
      flex: 1;
      background: #25283D;
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #CBD5E1;
      border-radius: 8px;
      padding: 7px 6px;
      font-size: 0.75rem;
      font-weight: 700;
      cursor: pointer !important;
      pointer-events: auto !important;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      transition: all 0.15s ease;
    }

    .panel-action-btn:hover {
      background: #2D304A;
      color: #FFF;
      border-color: rgba(255, 255, 255, 0.2);
    }

    .panel-action-btn-danger {
      color: #F87171;
      border-color: rgba(239, 68, 68, 0.25);
      background: rgba(239, 68, 68, 0.1);
    }

    .panel-action-btn-danger:hover {
      background: rgba(239, 68, 68, 0.2);
      border-color: #EF4444;
      color: #FFF;
    }

    /* Swatches Color Dots */
    .jnotes-color-dots {
      display: flex;
      align-items: center;
      gap: 4px;
      margin: 0 4px;
      padding: 0 6px;
      border-left: 1px solid rgba(255, 255, 255, 0.12);
      border-right: 1px solid rgba(255, 255, 255, 0.12);
    }

    .color-dot {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 2px solid transparent;
      cursor: pointer !important;
      pointer-events: auto !important;
      transition: transform 0.15s ease;
    }

    .color-dot:hover, .color-dot.active {
      transform: scale(1.2);
      border-color: #FFFFFF;
    }

    .sidebar-header {
      padding: 14px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      color: #F8FAFC;
      font-size: 0.85rem;
      font-weight: 700;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .sidebar-thumbnails-list {
      flex: 1;
      overflow-y: auto;
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .thumb-card {
      background: #232536;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: all 0.15s ease;
    }

    .thumb-card:hover {
      background: #2D3045;
      border-color: rgba(255, 255, 255, 0.2);
    }

    .thumb-card.active {
      border-color: #0284C7;
      background: rgba(2, 132, 199, 0.2);
    }

    .thumb-num {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #0284C7;
      color: #FFF;
      font-size: 0.725rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .thumb-info h5 {
      color: #F8FAFC;
      font-size: 0.75rem;
      font-weight: 700;
    }

    .thumb-info p {
      color: #94A3B8;
      font-size: 0.675rem;
    }

    /* Main Viewport Workspace */
    .jnotes-workspace {
      flex: 1;
      display: flex;
      height: calc(100vh - 56px);
      height: calc(100dvh - 56px);
      max-height: calc(100dvh - 56px);
      overflow: hidden;
      position: relative;
    }

    .jnotes-viewport {
      flex: 1;
      height: 100%;
      max-height: 100%;
      overflow-y: auto;
      padding: 24px 14px 80px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
      scroll-behavior: smooth;
      background: #12131F;
      -webkit-overflow-scrolling: touch;
    }

    /* Paper Theme Modes (Default White, Warm Sepia, Dark Night) */
    body.paper-theme-white {
      --paper-bg: #FFFFFF;
      --paper-text: #0F172A;
      --paper-sub: #475569;
      --paper-border: rgba(0, 0, 0, 0.08);
      --paper-callout-bg: #EFF6FF;
      --paper-callout-border: #93C5FD;
    }
    body.paper-theme-sepia {
      --paper-bg: #FBF0D9;
      --paper-text: #451A03;
      --paper-sub: #78350F;
      --paper-border: rgba(120, 53, 15, 0.2);
      --paper-callout-bg: #FEF3C7;
      --paper-callout-border: #FCD34D;
    }
    body.paper-theme-dark {
      --paper-bg: #1E1E2D;
      --paper-text: #F8FAFC;
      --paper-sub: #94A3B8;
      --paper-border: rgba(255, 255, 255, 0.12);
      --paper-callout-bg: #27283D;
      --paper-callout-border: #38BDF8;
    }

    /* Pages Wrapper for Smooth Zoom Scaling */
    .jnotes-pages-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
      transform-origin: top center;
      transition: transform 0.15s cubic-bezier(0.16, 1, 0.3, 1);
      width: 100%;
    }

    /* Zoom Controls Segment in Toolbar */
    .jnotes-zoom-group {
      display: inline-flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      padding: 2px 4px;
      gap: 2px;
    }

    .doc-page {
      background: var(--paper-bg, #FFFFFF);
      color: var(--paper-text, #0F172A);
      border: 1px solid var(--paper-border, rgba(0, 0, 0, 0.08));
      width: 100%;
      max-width: 840px;
      min-height: 1100px;
      border-radius: 6px;
      box-shadow: 0 15px 45px rgba(0, 0, 0, 0.45);
      padding: 44px 50px;
      position: relative;
      user-select: text;
      direction: ltr;
      text-align: left;
      transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease;
    }

    /* Dark Paper Theme Overrides */
    body.paper-theme-dark .doc-page h1,
    body.paper-theme-dark .doc-page h2,
    body.paper-theme-dark .doc-page h3,
    body.paper-theme-dark .doc-page h4,
    body.paper-theme-dark .title-main,
    body.paper-theme-dark .title-sub,
    body.paper-theme-dark .section-title {
      color: #F8FAFC !important;
    }

    body.paper-theme-dark .doc-page p,
    body.paper-theme-dark .doc-page li,
    body.paper-theme-dark .page-header span,
    body.paper-theme-dark .page-footer span,
    body.paper-theme-dark .meta-center p {
      color: #CBD5E1 !important;
    }

    body.paper-theme-dark .agenda-box,
    body.paper-theme-dark .clinical-callout {
      background: var(--paper-callout-bg) !important;
      border-color: var(--paper-callout-border) !important;
      color: #F8FAFC !important;
    }

    /* Sepia Paper Theme Overrides */
    body.paper-theme-sepia .doc-page h1,
    body.paper-theme-sepia .doc-page h2,
    body.paper-theme-sepia .doc-page h3,
    body.paper-theme-sepia .doc-page h4,
    body.paper-theme-sepia .title-main,
    body.paper-theme-sepia .title-sub,
    body.paper-theme-sepia .section-title {
      color: #451A03 !important;
    }

    body.paper-theme-sepia .doc-page p,
    body.paper-theme-sepia .doc-page li,
    body.paper-theme-sepia .page-header span,
    body.paper-theme-sepia .page-footer span,
    body.paper-theme-sepia .meta-center p {
      color: #78350F !important;
    }

    body.paper-theme-sepia .agenda-box,
    body.paper-theme-sepia .clinical-callout {
      background: var(--paper-callout-bg) !important;
      border-color: var(--paper-callout-border) !important;
      color: #451A03 !important;
    }

    /* Touch Canvas Overlay */
    .canvas-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 10;
      touch-action: none;
    }

    .canvas-overlay.pen-active {
      pointer-events: auto !important;
    }

    .canvas-overlay.cursor-text {
      cursor: text !important;
    }

    /* Translucent Highlighted Elements */
    p.highlighted, li.highlighted, h3.highlighted {
      background-color: var(--highlight-color) !important;
      border-radius: 4px;
      padding: 2px 4px;
    }

    /* Floating Text Box Notes (JNotes Text Tool) */
    .jnotes-text-note {
      position: absolute;
      min-width: 170px;
      max-width: 320px;
      background: rgba(255, 255, 255, 0.97);
      border: 1.5px solid #0284C7;
      border-radius: 8px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
      z-index: 25;
      padding: 6px 8px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      animation: notePop 0.15s ease-out;
      pointer-events: auto;
      text-align: right;
      direction: rtl;
    }

    @keyframes notePop {
      from { opacity: 0; transform: scale(0.92); }
      to { opacity: 1; transform: scale(1); }
    }

    body.paper-theme-dark .jnotes-text-note {
      background: rgba(30, 30, 45, 0.96);
      color: #F8FAFC;
      border-color: #38BDF8;
    }

    body.paper-theme-sepia .jnotes-text-note {
      background: rgba(254, 246, 235, 0.98);
      color: #451A03;
      border-color: #B45309;
    }

    .jnotes-text-note-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.7rem;
      font-weight: 700;
      color: #64748B;
      user-select: none;
      cursor: move;
      padding-bottom: 3px;
      border-bottom: 1px dashed rgba(100, 116, 139, 0.25);
    }

    .jnotes-text-note textarea {
      width: 100%;
      min-height: 44px;
      max-height: 220px;
      border: none;
      outline: none;
      background: transparent;
      font-family: inherit;
      font-size: 0.825rem;
      line-height: 1.45;
      color: inherit;
      resize: both;
    }

    .jnotes-text-note-del {
      cursor: pointer;
      color: #EF4444;
      font-size: 0.75rem;
      font-weight: bold;
      padding: 0 4px;
      border-radius: 4px;
      transition: background 0.15s ease;
    }

    .jnotes-text-note-del:hover {
      background: rgba(239, 68, 68, 0.15);
    }

    /* Page Typography */
    .page-header {
      border-bottom: 2px solid #0284C7;
      padding-bottom: 10px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .page-header h4 {
      color: #0284C7;
      font-size: 0.85rem;
      font-weight: 800;
      text-transform: uppercase;
    }

    .page-header span {
      font-size: 0.75rem;
      color: var(--text-sub);
    }

    h1.title-main {
      font-size: 2.2rem;
      font-weight: 900;
      color: #0284C7;
      margin-top: 80px;
      margin-bottom: 10px;
      text-align: center;
    }

    h2.title-sub {
      font-size: 1.4rem;
      font-weight: 800;
      color: #0369A1;
      text-align: center;
      margin-bottom: 40px;
    }

    .meta-center {
      text-align: center;
      font-size: 0.95rem;
      color: var(--text-sub);
      margin-bottom: 40px;
    }

    .agenda-box {
      background: #F0F9FF;
      border: 1px solid #BAE6FD;
      border-radius: 10px;
      padding: 20px;
      margin-top: 24px;
    }

    .section-title {
      font-size: 1.1rem;
      font-weight: 800;
      color: #0F172A;
      margin: 20px 0 10px;
      padding-bottom: 4px;
      border-bottom: 1.5px solid #0284C7;
    }

    .bullet-list {
      list-style-type: none;
      padding-left: 0;
      margin-bottom: 14px;
    }

    .bullet-list li {
      position: relative;
      padding-left: 18px;
      margin-bottom: 8px;
      font-size: 0.9rem;
    }

    .bullet-list li::before {
      content: "•";
      color: #0284C7;
      font-size: 1.3rem;
      position: absolute;
      left: 0;
      top: -3px;
    }

    .table-spec {
      width: 100%;
      border-collapse: collapse;
      margin: 14px 0 20px;
      font-size: 0.85rem;
    }

    .table-spec th, .table-spec td {
      border: 1px solid #CBD5E1;
      padding: 8px 12px;
      text-align: left;
    }

    .table-spec th {
      background: #0284C7;
      color: #FFF;
      font-weight: 700;
    }

    .clinical-callout {
      background: #FFFBEB;
      border-left: 4px solid #F59E0B;
      padding: 12px 16px;
      border-radius: 0 8px 8px 0;
      margin: 16px 0;
      font-size: 0.85rem;
      color: #78350F;
    }

    .page-footer {
      position: absolute;
      bottom: 18px;
      left: 50px;
      right: 50px;
      display: flex;
      justify-content: space-between;
      font-size: 0.7rem;
      color: var(--text-sub);
      border-top: 1px solid #E2E8F0;
      padding-top: 8px;
    }
  </style>
</head>
<body>

  <!-- JNotes Standalone Professional Header Toolbar -->
  <div class="jnotes-top-bar">
    <!-- LEFT: Exit Button & Title / Subject Badge -->
    <div class="jnotes-left-section">
      <button class="jtool-exit-btn" id="btn-exit-studio" onclick="exitStudio()" title="العودة لقائمة الشيتات بالمنصة">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        <span>العودة للمنصة</span>
      </button>

      <div class="jnotes-title-pill">
        <span class="jnotes-badge">${doc.subject_name || 'Fixed Prosthodontics'}</span>
        <span class="jnotes-title-text" title="${title}">${title}</span>
      </div>
    </div>

    <!-- CENTER: Clean 2-Panel Center Navigation & Active Tool Indicator Badge -->
    <div class="jnotes-center-section">
      <!-- Page Navigation Pill -->
      <div class="jnotes-page-nav-pill">
        <button class="page-nav-arrow" onclick="prevPage()" title="الصفحة السابقة">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
        <span id="page-counter-num">1 / 16</span>
        <button class="page-nav-arrow" onclick="nextPage()" title="الصفحة التالية">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
      </div>

      <!-- Active Tool Indicator Badge (Clicks to open floating side tools panel) -->
      <button class="jnotes-active-tool-pill" id="active-tool-pill" onclick="toggleSideToolsPanel(event)" title="انقر لفتح صندوق الأدوات والأقلام">
        <span class="tool-dot" id="active-tool-dot" style="background: #0F172A;"></span>
        <span id="active-tool-label">قراءة</span>
        <span style="font-size: 0.725rem; opacity: 0.85;">⚙️</span>
      </button>
    </div>

    <!-- RIGHT: Sleek 2-Panel Action Controls -->
    <div class="jnotes-right-section">
      <!-- Auto Save Badge -->
      <span class="auto-save-pill" id="auto-save-badge">
        <span class="auto-save-dot"></span>
        <span>تم الحفظ تلقائياً</span>
      </span>

      <!-- Tools Drawer Toggle Button -->
      <button class="jtool-btn" id="btn-toggle-tools-panel" onclick="toggleSideToolsPanel(event)" title="الأقلام والأدوات">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
        <span>الأقلام والأدوات</span>
      </button>

      <!-- Page Index Drawer Button -->
      <button id="btn-toggle-index" class="jtool-btn" onclick="toggleSidebar()" title="عرض فهرس الصفحات المصغرة">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="M14 9h4"/><path d="M14 15h4"/></svg>
        <span>فهرس الصفحات</span>
      </button>

      <!-- Discussion Trigger Button -->
      <button id="btn-toggle-discussion-studio" class="jtool-btn" onclick="toggleDiscussionDrawer()" title="المناقشات والأسئلة">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
        <span>مناقشة</span>
      </button>

      <!-- Fullscreen Toggle Button -->
      <button id="btn-toggle-fullscreen" class="jtool-btn" onclick="toggleFullscreenMode()" title="وضع ملء الشاشة">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
        <span id="fullscreen-btn-label">شاشة كاملة</span>
      </button>

      <!-- Download Button -->
      <button class="jtool-btn jtool-download-btn" onclick="downloadDoc()" title="تنزيل نسخة PDF إلى جهازك">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        <span>تنزيل PDF</span>
      </button>
    </div>
  </div>

  <!-- Collapsible Floating Side Tool Panel (Matching Spec) -->
  <div id="jnotes-tools-panel">
    <!-- Panel Header -->
    <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 8px;">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 1.1rem;">🛠️</span>
        <h3 style="font-size: 0.875rem; font-weight: 800; margin: 0; color: #F8FAFC;">صندوق الأقلام والأدوات</h3>
      </div>
      <button onclick="toggleSideToolsPanel(event)" style="background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.12); color: #F8FAFC; width: 26px; height: 26px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.9rem;" title="إغلاق اللوحة">✕</button>
    </div>

    <!-- SECTION 1: أنماط الرسم والأدوات (Drawing Modes) -->
    <div>
      <div class="panel-section-title">
        <span>نمط الأداة</span>
        <span id="active-tool-mode-badge" style="color: #38BDF8; font-size: 0.725rem;">قراءة</span>
      </div>
      <div class="panel-tool-grid">
        <button class="panel-tool-btn active" id="ptool-pan" onclick="setTool('pan')" title="وضع القراءة والتنقل">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>
          <span>قراءة</span>
        </button>
        <button class="panel-tool-btn" id="ptool-pen" onclick="setTool('pen')" title="قلم الملاحظات والتدوين">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
          <span>قلم</span>
        </button>
        <button class="panel-tool-btn" id="ptool-highlighter" onclick="setTool('highlighter')" title="تظليل نصوص وملاحظات">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 11-6 6v3h3l6-6"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/></svg>
          <span>تظليل</span>
        </button>
        <button class="panel-tool-btn" id="ptool-eraser" onclick="setTool('eraser')" title="ممحاة التظليلات والرسومات">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/></svg>
          <span>ممحاة</span>
        </button>
        <button class="panel-tool-btn" id="ptool-text" onclick="setTool('text')" title="إضافة ملاحظة نصية بالكيبورد">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
          <span>نص</span>
        </button>
        <button class="panel-tool-btn" id="ptool-straight" onclick="toggleStraightLineSetting()" title="الرسم بخط مستقيم">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><circle cx="5" cy="12" r="2" fill="currentColor"/><circle cx="19" cy="12" r="2" fill="currentColor"/></svg>
          <span>مسطرة</span>
        </button>
      </div>
    </div>

    <!-- SECTION 2: سمك الخط (Line Weight & Quick Chips) -->
    <div>
      <div class="panel-section-title">
        <span>سمك الخط</span>
        <strong id="slider-val-text" style="color: #38BDF8;">0.8mm</strong>
      </div>
      <input type="range" id="line-weight-slider" min="0.1" max="3.0" step="0.1" value="0.8" style="width: 100%; accent-color: #0284C7; cursor: pointer;" oninput="updateLineWeight(this.value)" />
      <div class="panel-chips-row">
        <div class="thickness-chip" onclick="updateLineWeight('0.3')">0.3mm</div>
        <div class="thickness-chip" onclick="updateLineWeight('0.5')">0.5mm</div>
        <div class="thickness-chip active" id="chip-0.8" onclick="updateLineWeight('0.8')">0.8mm</div>
        <div class="thickness-chip" onclick="updateLineWeight('1.2')">1.2mm</div>
        <div class="thickness-chip" onclick="updateLineWeight('2.0')">2.0mm</div>
      </div>
    </div>

    <!-- SECTION 3: لوحة الألوان الأكاديمية (24 Color Swatches + Custom Picker) -->
    <div>
      <div class="panel-section-title">
        <span>لوحة الألوان (24 لون)</span>
        <span id="current-color-preview-pill" style="width: 18px; height: 18px; border-radius: 50%; border: 2px solid #CBD5E1; background: #0F172A; display: inline-block;"></span>
      </div>
      <div class="panel-palette-grid" id="palette-grid-24"></div>
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: 10px; padding-top: 8px; border-top: 1px solid rgba(255, 255, 255, 0.08);">
        <label for="jnotes-color-input" style="font-size: 0.775rem; font-weight: 700; color: #94A3B8; display: flex; align-items: center; gap: 6px; cursor: pointer;">
          <span>لون مخصص:</span>
          <input type="color" id="jnotes-color-input" value="#0F172A" style="width: 28px; height: 28px; border: none; border-radius: 6px; cursor: pointer; background: transparent; padding: 0;" oninput="setCustomColor(this.value)" />
        </label>
        <input type="text" id="jnotes-hex-input" maxlength="7" value="#0F172A" style="width: 80px; font-family: monospace; font-size: 0.75rem; padding: 4px 6px; border: 1px solid rgba(255,255,255,0.15); border-radius: 6px; text-transform: uppercase; text-align: center; color: #F8FAFC; background: #232536; font-weight: 700;" onchange="setCustomColor(this.value)" />
      </div>
    </div>

    <!-- SECTION 4: نمط الورق (Paper Theme Modes) -->
    <div>
      <div class="panel-section-title">
        <span>نمط الورق</span>
        <span id="paper-theme-label" style="color: #38BDF8; font-size: 0.725rem;">ورق أبيض</span>
      </div>
      <div class="paper-theme-row">
        <button class="paper-theme-btn active" id="ptheme-white" onclick="applyPaperTheme('white')">⚪ أبيض</button>
        <button class="paper-theme-btn" id="ptheme-sepia" onclick="applyPaperTheme('sepia')">📜 دافئ</button>
        <button class="paper-theme-btn" id="ptheme-dark" onclick="applyPaperTheme('dark')">🌙 ليلي</button>
      </div>
    </div>

    <!-- SECTION 5: إجراءات الملاحظات (Actions & Options) -->
    <div>
      <div class="panel-section-title">
        <span>الإجراءات السريعة</span>
      </div>
      <div class="panel-actions-row" style="margin-bottom: 6px;">
        <button class="panel-action-btn" id="btn-panel-undo" onclick="undoAction()" title="تراجع">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
          <span>تراجع</span>
        </button>
        <button class="panel-action-btn" id="btn-panel-redo" onclick="redoAction()" title="إعادة">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/></svg>
          <span>إعادة</span>
        </button>
      </div>
      <div class="panel-actions-row" style="margin-bottom: 6px;">
        <button class="panel-action-btn" onclick="zoomIn()" title="تكبير">➕ تكبير</button>
        <button class="panel-action-btn" onclick="resetZoom()" title="الحجم الأصلي"><span id="zoom-val-text">100%</span></button>
        <button class="panel-action-btn" onclick="zoomOut()" title="تصغير">➖ تصغير</button>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; background: #25283D; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 7px 10px; margin-bottom: 6px; font-size: 0.775rem;">
        <span>إبراز النص فوق التظليل (Multiply)</span>
        <div class="popup-toggle-switch on" id="toggle-bottom-display" onclick="toggleBottomDisplaySetting()" style="width: 32px; height: 18px;"></div>
      </div>
      <button class="panel-action-btn panel-action-btn-danger" style="width: 100%; margin-bottom: 6px;" onclick="clearCurrentPageStrokes()" title="مسح كافة الرسومات على الصفحة الحالية">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
        <span>مسح رسومات الصفحة الحالية</span>
      </button>
      <button class="panel-action-btn" style="width: 100%; color: #38BDF8; border-color: rgba(56, 189, 248, 0.25); background: rgba(2, 132, 199, 0.12);" onclick="addToPenBox()">
        <span>➕ حفظ القلم الحالي في القائمة السريعة</span>
      </button>
    </div>
  </div>

  <!-- Right Vertical Floating Pen Dock (Matching Spec) -->
  <div class="jnotes-vertical-dock" id="jnotes-vertical-dock">
    <!-- Rendered dynamically by renderVerticalDock() -->
  </div>

  <!-- Sliding Overlay Page Index Drawer (Matching Spec) -->
  <div class="drawer-backdrop" id="drawer-backdrop" onclick="closeSidebar()"></div>
  <div class="jnotes-sidebar-index" id="jnotes-sidebar-index">
    <div class="sidebar-header">
      <div style="display: flex; align-items: center; gap: 8px;">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="M14 9h4"/><path d="M14 15h4"/></svg>
        <span>فهرس الشرائح (16)</span>
      </div>
      <button class="jtool-icon-btn" onclick="closeSidebar()" title="إغلاق الفهرس" style="color: #94A3B8;">✕</button>
    </div>
    <div class="sidebar-thumbnails-list">
      ${Array.from({length: 16}, (_, i) => `
        <div class="thumb-card ${i === 0 ? 'active' : ''}" onclick="selectPageAndCloseDrawer(${i + 1})">
          <div class="thumb-num">${i + 1}</div>
          <div class="thumb-info">
            <h5>صفحة ${i + 1}</h5>
            <p>Dental Lecture Slide ${i + 1}</p>
          </div>
        </div>
      `).join('')}
    </div>
  </div>

  <!-- Workspace Container -->
  <div class="jnotes-workspace">

    <!-- Main Scrollable Paper Viewport -->
    <div class="jnotes-viewport" id="jnotes-viewport">
      <div class="jnotes-pages-wrapper" id="jnotes-pages-wrapper">

      <!-- PAGE 1 -->
      <div class="doc-page" id="page-1" data-page="1">
        <canvas class="canvas-overlay" id="canvas-1"></canvas>
        <div class="page-header">
          <h4>Fixed Prosthodontics II • Lecture Handout</h4>
          <span>${university}</span>
        </div>

        <h1 class="title-main">ROTARY DENTAL INSTRUMENTS & PROVISIONAL RESTORATIONS</h1>
        <h2 class="title-sub">CLINICAL PROTOCOLS & CONTEMPORARY TECHNIQUES</h2>

        <div class="meta-center">
          <p><strong>${doctor}</strong></p>
          <p>Department of Fixed Prosthodontics</p>
          <p>${university} • Academic Year ${year}</p>
        </div>

        <div class="agenda-box">
          <h3>LECTURE AGENDA & CORE MODULES</h3>
          <ul class="bullet-list">
            <li><strong>Module 1:</strong> Rotary Cutting Instruments, Burs & Diamond Abrasives</li>
            <li><strong>Module 2:</strong> Definition & Requirements of Provisional Restorations</li>
            <li><strong>Module 3:</strong> Classification of Provisional Restorations & Preformed Crowns</li>
            <li><strong>Module 4:</strong> Direct vs. Indirect Fabrication Protocols & Vacuum Shells</li>
            <li><strong>Module 5:</strong> Comparative Analysis of Restorative Resins & Provisional Cements</li>
            <li><strong>Module 6:</strong> Pontic Design, Clinical Troubleshooting, and Exam Review</li>
          </ul>
        </div>

        <div class="page-footer">
          <span>Dr. Hala Alhawij | Fixed Prosthodontics II</span>
          <span>Page 1 of 16</span>
        </div>
      </div>

      <!-- PAGE 2: EXACT CONTENT FROM SCREENSHOTS 1 & 2 -->
      <div class="doc-page" id="page-2" data-page="2">
        <canvas class="canvas-overlay" id="canvas-2"></canvas>
        <div class="page-header">
          <h4>Module 1: Rotary Instruments</h4>
          <span>Provisional Restoration & Temporization</span>
        </div>

        <h3 class="section-title">BUR CUTTING ANGLES & TAPERED FISSURE BURS</h3>
        <p style="margin-bottom: 12px;"><strong>Rake Angle Classifications:</strong></p>
        <ul class="bullet-list">
          <li><strong>A = Positive Rake Angle:</strong> Increases cutting efficiency in soft structures.</li>
          <li><strong>B = Radial or Neutral Rake Angle:</strong> Standard balanced cutting mechanism.</li>
          <li><strong>C = Negative Rake Angle:</strong> Increases blade strength for hard metal/enamel reduction.</li>
        </ul>

        <div class="clinical-callout">
          <strong>Tapered Fissure Bur:</strong> A common bur used in fixed prosthesis preparation. Used for:
          <ul class="bullet-list" style="margin-top: 8px;">
            <li>Adding additional retentive features in complete/partial crowns (grooves or boxes).</li>
            <li>Finishing (smoothing) prepared axial walls.</li>
            <li>Preparing proximal boxes, bevels, and occlusal reduction in Class II inlays.</li>
          </ul>
        </div>

        <h3 class="section-title">DIAMOND ABRASIVES IN FIXED PROSTHODONTICS</h3>
        <p style="margin-bottom: 12px;">The second major category of rotary dental cutting instruments involves abrasive rather than blade cutting. The mechanism of abrasion is a grinding operation.</p>
        <p style="margin-bottom: 14px;"><strong>Abrasion:</strong> The wearing away of a substance or structure (such as the skin or the teeth) through an unusual or abnormal mechanical process.</p>

        <p><strong>Structure of Diamond Instruments:</strong></p>
        <p>Diamond instruments consist of three parts: a metal blank, the powdered diamond abrasive, and a metallic bonding material that holds the diamond powder onto the blank.</p>

        <div class="page-footer">
          <span>Dr. Hala Alhawij | Fixed Prosthodontics II</span>
          <span>Page 2 of 16</span>
        </div>
      </div>

      <!-- PAGES 3 TO 16 -->
      ${Array.from({length: 14}, (_, idx) => {
        const pNum = idx + 3;
        return `
          <div class="doc-page" id="page-${pNum}" data-page="${pNum}">
            <canvas class="canvas-overlay" id="canvas-${pNum}"></canvas>
            <div class="page-header">
              <h4>Module ${pNum - 1}: Clinical Section</h4>
              <span>Provisional Restoration & Temporization</span>
            </div>

            <h3 class="section-title">SECTION ${pNum - 1}: CLINICAL PROTOCOLS & CORE PRINCIPLES</h3>
            <p style="margin-bottom: 14px;">Detailed clinical procedures, tissue protection guidelines, and restorative margin management protocols established by Dr. Hala Alhawij for Year 3 Dental Students.</p>

            <ul class="bullet-list">
              <li>Pulp vitality maintenance and dentinal tubule sealing.</li>
              <li>Margin emergence profile adaptation to prevent soft tissue recession.</li>
              <li>Occlusal clearance verification and interproximal contact point stabilization.</li>
            </ul>

            <div class="clinical-callout">
              <strong>EXAM HIGHLIGHT:</strong> Ensure precise cervical margin finishing before cementation to maintain healthy periodontium.
            </div>

            <div class="page-footer">
              <span>Dr. Hala Alhawij | Fixed Prosthodontics II</span>
              <span>Page ${pNum} of 16</span>
            </div>
          </div>
        `;
      }).join('')}
      </div> <!-- /#jnotes-pages-wrapper -->
    </div>
  </div>

  <!-- JNotes Interactive Canvas Engine, Popups, Straight Line Snap & Auto-Save Script -->
  <script>
    (function() {
    const docId = "${docId}";
    let currentTool = 'pan'; // pan, pen, highlighter, eraser, note
    let currentColor = '#0F172A';
    let currentStroke = 4.0; // 0.8mm
    let straightLineMode = false;
    let isStraightLine = false;
    let bottomDisplayMode = true;

    let isDrawing = false;
    let startX = 0;
    let startY = 0;
    let strokes = {}; // pageNum -> array of stroke paths
    let zoomLevel = 1.0;
    let currentPaperTheme = 'white';
    let textNotes = {}; // pageNum -> array of { id, x, y, text, color }
    let actionHistory = []; // Enhanced Undo/Redo history
    let redoStack = [];

    // Zoom Controls (0.6x to 2.5x)
    window.zoomIn = function() {
      window.setZoom(Math.min(2.5, Math.round((zoomLevel + 0.15) * 100) / 100));
    };

    window.zoomOut = function() {
      window.setZoom(Math.max(0.6, Math.round((zoomLevel - 0.15) * 100) / 100));
    };

    window.resetZoom = function() {
      window.setZoom(1.0);
    };

    window.setZoom = function(val) {
      zoomLevel = Math.max(0.6, Math.min(2.5, Math.round(val * 100) / 100));
      const wrapper = document.getElementById('jnotes-pages-wrapper');
      if (wrapper) {
        wrapper.style.transform = 'scale(' + zoomLevel + ')';
        if (zoomLevel > 1) {
          const extraH = wrapper.offsetHeight * (zoomLevel - 1);
          wrapper.style.marginBottom = extraH + 'px';
        } else {
          wrapper.style.marginBottom = '0px';
        }
      }
      const txt = document.getElementById('zoom-val-text');
      if (txt) txt.textContent = Math.round(zoomLevel * 100) + '%';
    };

    // Paper Theme Toggle (White / Sepia / Dark)
    const paperThemeConfigs = {
      white: { label: 'ورق أبيض', cls: 'paper-theme-white' },
      sepia: { label: 'ورق دافئ', cls: 'paper-theme-sepia' },
      dark: { label: 'ورق ليلي', cls: 'paper-theme-dark' }
    };

    window.cyclePaperTheme = function() {
      if (currentPaperTheme === 'white') {
        window.applyPaperTheme('sepia');
      } else if (currentPaperTheme === 'sepia') {
        window.applyPaperTheme('dark');
      } else {
        window.applyPaperTheme('white');
      }
    };

    window.applyPaperTheme = function(theme) {
      if (!paperThemeConfigs[theme]) theme = 'white';
      currentPaperTheme = theme;

      document.body.classList.remove('paper-theme-white', 'paper-theme-sepia', 'paper-theme-dark');
      document.body.classList.add(paperThemeConfigs[theme].cls);

      const lbl = document.getElementById('paper-theme-label');
      if (lbl) lbl.textContent = paperThemeConfigs[theme].label;

      try {
        localStorage.setItem('kf_jnotes_paper_theme', theme);
      } catch(e) {}
    };

    function initPaperTheme() {
      try {
        const saved = localStorage.getItem('kf_jnotes_paper_theme') || 'white';
        window.applyPaperTheme(saved);
      } catch(e) {
        window.applyPaperTheme('white');
      }
    }

    // Clear Current Page Drawings
    window.clearCurrentPageStrokes = function() {
      const pNum = currentPage;
      const prevStrokes = strokes[pNum] ? [...strokes[pNum]] : [];
      const prevNotes = textNotes[pNum] ? [...textNotes[pNum]] : [];

      if (prevStrokes.length === 0 && prevNotes.length === 0) {
        if (window.parent && window.parent.showToast) {
          window.parent.showToast('الصفحة ' + pNum + ' لا تحتوي على رسومات للمسح ℹ️', { type: 'info' });
        }
        return;
      }

      actionHistory.push({
        type: 'clear_page',
        pageNum: pNum,
        strokes: prevStrokes,
        textNotes: prevNotes
      });
      redoStack = [];

      strokes[pNum] = [];
      textNotes[pNum] = [];

      const pageEl = document.getElementById('page-' + pNum);
      if (pageEl) {
        pageEl.querySelectorAll('.jnotes-text-note').forEach(n => n.remove());
        pageEl.querySelectorAll('.highlighted').forEach(h => h.classList.remove('highlighted'));
      }

      redrawCanvas(pNum);
      triggerAutoSave();

      if (window.parent && window.parent.showToast) {
        window.parent.showToast('تم مسح كافة الرسومات والملاحظات من الصفحة ' + pNum + ' 🗑️', { type: 'success' });
      }
    };

    // Text Box Note Tool (Floating Note Cards)
    function handleCanvasClick(e, canvas, pageNum) {
      if (currentTool !== 'text') return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = Math.max(10, Math.min(canvas.width - 220, (e.clientX - rect.left) * scaleX));
      const y = Math.max(10, Math.min(canvas.height - 120, (e.clientY - rect.top) * scaleY));
      createTextNote(pageNum, x, y);
    }

    function createTextNote(pageNum, x, y, initialText = '', noteId = null) {
      const id = noteId || ('note_' + Date.now() + '_' + Math.floor(Math.random() * 1000));
      if (!textNotes[pageNum]) textNotes[pageNum] = [];

      let noteObj = textNotes[pageNum].find(n => n.id === id);
      if (!noteObj) {
        noteObj = {
          id: id,
          x: Math.round(x),
          y: Math.round(y),
          text: initialText,
          color: currentColor || '#0284C7'
        };
        textNotes[pageNum].push(noteObj);
        actionHistory.push({ type: 'add_text_note', pageNum: pageNum, noteId: id, note: noteObj });
        redoStack = [];
      }

      renderTextNoteDOM(pageNum, noteObj, true);
      triggerAutoSave();
    }

    function renderTextNoteDOM(pageNum, noteObj, shouldFocus = false) {
      const pageEl = document.getElementById('page-' + pageNum);
      if (!pageEl) return;

      let el = document.getElementById('dom-' + noteObj.id);
      if (!el) {
        el = document.createElement('div');
        el.id = 'dom-' + noteObj.id;
        el.className = 'jnotes-text-note';
        el.style.left = noteObj.x + 'px';
        el.style.top = noteObj.y + 'px';
        el.style.borderColor = noteObj.color || '#0284C7';

        el.innerHTML = '<div class="jnotes-text-note-header">'
          + '<span style="display:flex;align-items:center;gap:5px;">'
          + '<span style="width:8px;height:8px;border-radius:50%;background:' + (noteObj.color || '#0284C7') + ';display:inline-block;"></span>'
          + '<span>ملاحظة</span>'
          + '</span>'
          + '<span class="jnotes-text-note-del" title="حذف الملاحظة" onclick="deleteTextNote(\'' + pageNum + '\', \'' + noteObj.id + '\')">✕</span>'
          + '</div>'
          + '<textarea placeholder="اكتب ملاحظتك هنا...">' + (noteObj.text || '') + '</textarea>';

        pageEl.appendChild(el);

        const ta = el.querySelector('textarea');
        ta.addEventListener('input', () => {
          noteObj.text = ta.value;
          triggerAutoSave();
        });

        ta.addEventListener('blur', () => {
          if (!noteObj.text || noteObj.text.trim() === '') {
            deleteTextNote(pageNum, noteObj.id);
          }
        });

        const header = el.querySelector('.jnotes-text-note-header');
        header.addEventListener('mousedown', (e) => startDragNote(e, el, pageNum, noteObj));
      } else {
        el.style.left = noteObj.x + 'px';
        el.style.top = noteObj.y + 'px';
        const ta = el.querySelector('textarea');
        if (ta && ta.value !== noteObj.text) ta.value = noteObj.text || '';
      }

      if (shouldFocus) {
        const ta = el.querySelector('textarea');
        if (ta) setTimeout(() => ta.focus(), 50);
      }
    }

    window.deleteTextNote = function(pageNum, id) {
      if (textNotes[pageNum]) {
        const idx = textNotes[pageNum].findIndex(n => n.id === id);
        if (idx !== -1) {
          const removed = textNotes[pageNum].splice(idx, 1)[0];
          actionHistory.push({ type: 'del_text_note', pageNum: pageNum, note: removed });
          redoStack = [];
        }
      }
      const domEl = document.getElementById('dom-' + id);
      if (domEl) domEl.remove();
      triggerAutoSave();
    };

    function renderAllTextNotes() {
      document.querySelectorAll('.jnotes-text-note').forEach(el => el.remove());
      Object.keys(textNotes).forEach(pageNum => {
        const list = textNotes[pageNum] || [];
        list.forEach(note => renderTextNoteDOM(pageNum, note, false));
      });
    }

    function startDragNote(e, el, pageNum, noteObj) {
      if (e.target.classList.contains('jnotes-text-note-del')) return;
      e.preventDefault();
      const page = document.getElementById('page-' + pageNum);
      if (!page) return;
      const startMouseX = e.clientX;
      const startMouseY = e.clientY;
      const origX = noteObj.x;
      const origY = noteObj.y;

      function onMouseMove(moveEv) {
        const scale = zoomLevel || 1.0;
        const dx = (moveEv.clientX - startMouseX) / scale;
        const dy = (moveEv.clientY - startMouseY) / scale;
        noteObj.x = Math.max(0, Math.min(page.offsetWidth - 170, origX + dx));
        noteObj.y = Math.max(0, Math.min(page.offsetHeight - 50, origY + dy));
        el.style.left = noteObj.x + 'px';
        el.style.top = noteObj.y + 'px';
      }

      function onMouseUp() {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        triggerAutoSave();
      }

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }

    // Standalone Navigation & Exit Bar
    window.exitStudio = function() {
      if (window.Router && typeof window.Router.navigate === 'function') {
        window.Router.navigate('/sheets');
      } else if (window.parent && window.parent.Router && typeof window.parent.Router.navigate === 'function') {
        window.parent.Router.navigate('/sheets');
      } else if (window.parent) {
        window.parent.location.hash = '#/sheets';
      } else {
        window.location.hash = '#/sheets';
      }
    };

    window.downloadDoc = function() {
      const docObj = (window.DocumentViewer && window.DocumentViewer.currentDoc) || { id: docId, title: "${title}" };
      if (window.DocumentViewer && typeof window.DocumentViewer.download === 'function') {
        window.DocumentViewer.download(docObj);
      } else if (window.parent && window.parent.DocumentViewer) {
        window.parent.DocumentViewer.download(docObj);
      } else {
        alert('جاري تنزيل ملف PDF...');
      }
    };

    window.toggleDiscussionDrawer = function() {
      if (window.SheetDetailPage && typeof window.SheetDetailPage.openDiscussion === 'function') {
        window.SheetDetailPage.openDiscussion();
      } else if (window.parent && window.parent.SheetDetailPage && typeof window.parent.SheetDetailPage.openDiscussion === 'function') {
        window.parent.SheetDetailPage.openDiscussion();
      } else if (window.parent) {
        window.parent.postMessage({ type: 'TOGGLE_DISCUSSION' }, '*');
      } else {
        const btn = document.getElementById('btn-toggle-discussion');
        if (btn) btn.click();
      }
    };

    // Fullscreen Viewport Mode (Web Fullscreen API)
    window.toggleFullscreenMode = function() {
      const doc = (window.parent && window.parent.document) ? window.parent.document : document;
      const rootEl = doc.documentElement;

      if (!doc.fullscreenElement && !document.fullscreenElement) {
        if (rootEl.requestFullscreen) {
          rootEl.requestFullscreen().catch(() => {
            if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {});
          });
        } else if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
      } else {
        if (doc.exitFullscreen) {
          doc.exitFullscreen().catch(() => {
            if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
          });
        } else if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
      }
    };

    function updateFullscreenBtn() {
      const isFs = !!(document.fullscreenElement || (window.parent && window.parent.document.fullscreenElement));
      const lbl = document.getElementById('fullscreen-btn-label');
      if (lbl) lbl.textContent = isFs ? 'تصغير الشاشة' : 'شاشة كاملة';
    }
    document.addEventListener('fullscreenchange', updateFullscreenBtn);
    try {
      if (window.parent) window.parent.document.addEventListener('fullscreenchange', updateFullscreenBtn);
    } catch(e) {}

    // 24 Academic Presets Color Palette
    const ACADEMIC_COLORS = [
      '#0F172A', '#334155', '#64748B', '#1E3A8A', '#0284C7', '#0EA5E9',
      '#0D9488', '#14532D', '#16A34A', '#10B981', '#84CC16', '#FEF08A',
      '#FDE047', '#F59E0B', '#F97316', '#DC2626', '#EF4444', '#E11D48',
      '#EC4899', '#7E22CE', '#A855F7', '#C084FC', '#78350F', '#451A03'
    ];

    function initColorPalette() {
      const grid = document.getElementById('palette-grid-24');
      if (!grid) return;
      grid.innerHTML = ACADEMIC_COLORS.map(function(c) {
        const activeCls = c.toLowerCase() === currentColor.toLowerCase() ? 'active' : '';
        return '<div class="palette-swatch-btn ' + activeCls + '" data-color="' + c + '" style="background: ' + c + ';" onclick="setCustomColor(\'' + c + '\')" title="' + c + '"></div>';
      }).join('');
    }

    window.toggleColorPaletteMenu = function(e) {
      if (e) e.stopPropagation();
      const pc = document.getElementById('popup-colors');
      const pt = document.getElementById('popup-thickness');
      const pm = document.getElementById('popup-markpen');
      if (pt) pt.classList.remove('open');
      if (pm) pm.classList.remove('open');
      if (pc) {
        const isOpen = pc.classList.toggle('open');
        if (isOpen) {
          const btn = document.getElementById('btn-toggle-colors');
          if (btn) {
            const r = btn.getBoundingClientRect();
            pc.style.left = Math.max(10, Math.min(window.innerWidth - 330, r.left - 120)) + 'px';
          }
        }
      }
    };

    window.setCustomColor = function(val) {
      if (!val) return;
      if (!val.startsWith('#') && !val.startsWith('rgb')) val = '#' + val;
      window.setColor(val);
      const colorPicker = document.getElementById('jnotes-color-input');
      const hexInput = document.getElementById('jnotes-hex-input');
      const preview = document.getElementById('current-color-preview-pill');
      if (colorPicker && val.startsWith('#')) colorPicker.value = val;
      if (hexInput) hexInput.value = val.toUpperCase();
      if (preview) preview.style.background = val;

      document.querySelectorAll('.palette-swatch-btn').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-color').toLowerCase() === val.toLowerCase());
      });
    };

    // Right Vertical Pen Dock Presets Management
    function getDefaultDockPresets() {
      return [
        { id: 'p_black', tool: 'pen', color: '#0F172A', strokeWidth: 2.5, label: '0.5', name: 'قلم أسود 0.5' },
        { id: 'p_blue', tool: 'pen', color: '#0284C7', strokeWidth: 3.5, label: '0.7', name: 'قلم أزرق 0.7' },
        { id: 'p_red', tool: 'pen', color: '#EF4444', strokeWidth: 4.0, label: '0.8', name: 'قلم أحمر 0.8' },
        { id: 'p_yellow_hl', tool: 'highlighter', color: '#FEF08A', strokeWidth: 16, label: '0.5', name: 'تظليل أصفر 0.5' }
      ];
    }

    function getDockPresets() {
      try {
        const raw = localStorage.getItem('kf_vertical_dock_presets');
        if (raw) {
          const list = JSON.parse(raw);
          if (Array.isArray(list) && list.length > 0) return list;
        }
      } catch(e) {}
      const def = getDefaultDockPresets();
      try { localStorage.setItem('kf_vertical_dock_presets', JSON.stringify(def)); } catch(e) {}
      return def;
    }

    function saveDockPresets(presets) {
      localStorage.setItem('kf_vertical_dock_presets', JSON.stringify(presets));
    }

    window.deleteDockPreset = function(e, id) {
      if (e) e.stopPropagation();
      let presets = getDockPresets().filter(p => p.id !== id);
      saveDockPresets(presets);
      renderVerticalDock();
      if (window.parent && window.parent.showToast) {
        window.parent.showToast('تم حذف القلم من القائمة الرأسية 🗑️', { type: 'info' });
      }
    };

    window.applyDockPreset = function(id) {
      const presets = getDockPresets();
      const p = presets.find(item => item.id === id);
      if (!p) return;

      window.setColor(p.color);
      currentStroke = p.strokeWidth;
      window.setTool(p.tool);
      window.updateLineWeight(p.label);

      document.querySelectorAll('.dock-preset-btn').forEach(b => {
        b.classList.toggle('active', b.id === 'dock-btn-' + id);
      });
    };

    function renderVerticalDock() {
      const dock = document.getElementById('jnotes-vertical-dock');
      if (!dock) return;

      const presets = getDockPresets();
      let html = presets.map(function(p, idx) {
        const activeCls = idx === 0 ? 'active' : '';
        const titleText = p.name || (p.label + 'mm ' + p.tool);
        return '<div class="dock-preset-btn ' + activeCls + '" id="dock-btn-' + p.id + '" onclick="applyDockPreset(\'' + p.id + '\')" title="' + titleText + '">'
          + '<span class="dock-delete-btn" onclick="deleteDockPreset(event, \'' + p.id + '\')" title="حذف القلم">✕</span>'
          + '<span>' + p.label + '</span>'
          + '<div class="dock-preset-dot" style="background: ' + p.color + ';"></div>'
          + '</div>';
      }).join('');

      html += '<div class="dock-preset-btn" onclick="addToPenBox()" title="إضافة القلم الحالي للقائمة المفضلة">'
        + '<span style="font-size: 0.85rem; color: #38BDF8;">➕</span>'
        + '</div>';

      dock.innerHTML = html;
    }

    window.addToPenBox = function() {
      let presets = getDockPresets();
      const mmVal = (currentStroke / 5).toFixed(1);
      const existing = presets.find(p => p.tool === currentTool && p.color.toLowerCase() === currentColor.toLowerCase() && Math.abs(p.strokeWidth - currentStroke) < 0.5);
      if (!existing) {
        presets.push({
          id: 'p_' + Date.now(),
          tool: currentTool,
          color: currentColor,
          strokeWidth: currentStroke,
          label: mmVal,
          name: (currentTool === 'highlighter' ? 'تظليل' : 'قلم') + ' ' + mmVal
        });
        saveDockPresets(presets);
        renderVerticalDock();
        if (window.parent && window.parent.showToast) {
          window.parent.showToast('تمت إضافة القلم لقائمة الأقلام المفضلة على اليمين! 🖊️', { type: 'success' });
        }
      } else {
        if (window.parent && window.parent.showToast) {
          window.parent.showToast('هذا القلم مضاف مسبقاً في القائمة! ✓', { type: 'info' });
        }
      }
      document.getElementById('popup-markpen')?.classList.remove('open');
    };

    // Collapsible Floating Side Tool Panel Controls (2-Panel UI)
    window.toggleSideToolsPanel = function(e) {
      if (e) e.stopPropagation();
      const panel = document.getElementById('jnotes-tools-panel');
      const btn = document.getElementById('btn-toggle-tools-panel');
      const pill = document.getElementById('active-tool-pill');
      if (panel) {
        const isOpen = panel.classList.toggle('open');
        if (btn) btn.classList.toggle('active', isOpen);
        if (pill) pill.classList.toggle('active', isOpen);
        if (isOpen) {
          window.closeSidebar();
        }
      }
    };

    window.closeSideToolsPanel = function() {
      const panel = document.getElementById('jnotes-tools-panel');
      const btn = document.getElementById('btn-toggle-tools-panel');
      const pill = document.getElementById('active-tool-pill');
      if (panel) panel.classList.remove('open');
      if (btn) btn.classList.remove('active');
      if (pill) pill.classList.remove('active');
    };

    window.updateActiveToolBadge = function() {
      const labelEl = document.getElementById('active-tool-label');
      const dotEl = document.getElementById('active-tool-dot');
      const modeBadge = document.getElementById('active-tool-mode-badge');
      const mmVal = (currentStroke / 5).toFixed(1);

      const toolNames = {
        pan: 'قراءة',
        pen: 'قلم ' + mmVal + 'mm',
        highlighter: 'تظليل ' + mmVal + 'mm',
        eraser: 'ممحاة',
        text: 'نص'
      };

      const name = toolNames[currentTool] || 'قراءة';
      if (labelEl) labelEl.textContent = name;
      if (modeBadge) modeBadge.textContent = name;

      if (dotEl) {
        if (currentTool === 'pen' || currentTool === 'highlighter' || currentTool === 'text') {
          dotEl.style.display = 'inline-block';
          dotEl.style.background = currentColor;
        } else if (currentTool === 'eraser') {
          dotEl.style.display = 'inline-block';
          dotEl.style.background = '#EF4444';
        } else {
          dotEl.style.display = 'inline-block';
          dotEl.style.background = '#94A3B8';
        }
      }
    };

    window.updateLineWeight = function(val) {
      currentStroke = parseFloat(val) * 5; // 0.1mm (0.5px) to 3.0mm (15px)
      const text = document.getElementById('slider-val-text');
      const slider = document.getElementById('line-weight-slider');
      if (text) text.textContent = val + 'mm';
      if (slider) slider.value = val;

      document.querySelectorAll('.thickness-chip').forEach(chip => {
        chip.classList.toggle('active', chip.textContent.trim() === val + 'mm');
      });

      if (typeof window.updateActiveToolBadge === 'function') {
        window.updateActiveToolBadge();
      }
    };

    window.toggleStraightLineSetting = function() {
      straightLineMode = !straightLineMode;
      isStraightLine = straightLineMode;
      const btn = document.getElementById('ptool-straight') || document.getElementById('tool-straight-toggle');
      if (btn) btn.classList.toggle('active', straightLineMode);
      const sw = document.getElementById('toggle-straight-line');
      if (sw) sw.classList.toggle('on', straightLineMode);
    };

    window.toggleBottomDisplaySetting = function() {
      bottomDisplayMode = !bottomDisplayMode;
      const sw = document.getElementById('toggle-bottom-display');
      if (sw) sw.classList.toggle('on', bottomDisplayMode);
    };

    // Close floating side tools panel on click outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#jnotes-tools-panel') && !e.target.closest('#btn-toggle-tools-panel') && !e.target.closest('#active-tool-pill')) {
        window.closeSideToolsPanel();
      }
    });

    // Enhanced Single-Action Undo / Redo Engine
    window.undoAction = function() {
      if (actionHistory.length > 0) {
        const action = actionHistory.pop();
        redoStack.push(action);

        if (action.type === 'stroke') {
          const pageStrokes = strokes[action.pageNum] || [];
          const idx = pageStrokes.lastIndexOf(action.stroke);
          if (idx !== -1) {
            pageStrokes.splice(idx, 1);
          } else {
            pageStrokes.pop();
          }
          redrawCanvas(action.pageNum);
        } else if (action.type === 'clear_page') {
          strokes[action.pageNum] = action.strokes ? [...action.strokes] : [];
          textNotes[action.pageNum] = action.textNotes ? [...action.textNotes] : [];
          redrawCanvas(action.pageNum);
          renderAllTextNotes();
        } else if (action.type === 'add_text_note') {
          if (textNotes[action.pageNum]) {
            textNotes[action.pageNum] = textNotes[action.pageNum].filter(n => n.id !== action.noteId);
          }
          document.getElementById('dom-' + action.noteId)?.remove();
        } else if (action.type === 'del_text_note') {
          if (!textNotes[action.pageNum]) textNotes[action.pageNum] = [];
          textNotes[action.pageNum].push(action.note);
          renderTextNoteDOM(action.pageNum, action.note, false);
        }

        triggerAutoSave();
      } else {
        // Fallback: pop last stroke from current page
        if (strokes[currentPage] && strokes[currentPage].length > 0) {
          const popped = strokes[currentPage].pop();
          redoStack.push({ type: 'stroke', pageNum: currentPage, stroke: popped });
          redrawCanvas(currentPage);
          triggerAutoSave();
        }
      }
    };

    window.redoAction = function() {
      if (redoStack.length > 0) {
        const action = redoStack.pop();
        actionHistory.push(action);

        if (action.type === 'stroke') {
          if (!strokes[action.pageNum]) strokes[action.pageNum] = [];
          strokes[action.pageNum].push(action.stroke);
          redrawCanvas(action.pageNum);
        } else if (action.type === 'clear_page') {
          strokes[action.pageNum] = [];
          textNotes[action.pageNum] = [];
          const pageEl = document.getElementById('page-' + action.pageNum);
          if (pageEl) {
            pageEl.querySelectorAll('.jnotes-text-note').forEach(n => n.remove());
          }
          redrawCanvas(action.pageNum);
        } else if (action.type === 'add_text_note') {
          if (!textNotes[action.pageNum]) textNotes[action.pageNum] = [];
          textNotes[action.pageNum].push(action.note);
          renderTextNoteDOM(action.pageNum, action.note, false);
        } else if (action.type === 'del_text_note') {
          if (textNotes[action.pageNum]) {
            textNotes[action.pageNum] = textNotes[action.pageNum].filter(n => n.id !== action.note.id);
          }
          document.getElementById('dom-' + action.note.id)?.remove();
        }

        triggerAutoSave();
      }
    };

    // Page Navigation & Thumbnail Drawer Controls
    let currentPage = 1;
    const totalPages = 16;

    window.prevPage = function() {
      if (currentPage > 1) {
        window.scrollToPage(currentPage - 1);
      }
    };

    window.nextPage = function() {
      if (currentPage < totalPages) {
        window.scrollToPage(currentPage + 1);
      }
    };

    window.scrollToPage = function(pageNum) {
      currentPage = pageNum;
      const pageEl = document.getElementById('page-' + pageNum);
      if (pageEl) {
        pageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        document.querySelectorAll('.thumb-card').forEach((c, idx) => {
          c.classList.toggle('active', idx + 1 === pageNum);
        });
        updateCounterPill(pageNum);
      }
    };

    function updateCounterPill(pageNum) {
      currentPage = pageNum;
      const pill = document.getElementById('page-counter-num');
      if (pill) pill.textContent = pageNum + ' / ' + totalPages;
    }

    window.toggleSidebar = function() {
      const sb = document.getElementById('jnotes-sidebar-index');
      const backdrop = document.getElementById('drawer-backdrop');
      const dock = document.getElementById('jnotes-vertical-dock');
      if (sb) {
        const isOpen = sb.classList.toggle('open');
        if (backdrop) backdrop.classList.toggle('open', isOpen);
        if (dock) dock.classList.toggle('dock-retracted', isOpen);
      }
    };

    window.closeSidebar = function() {
      const sb = document.getElementById('jnotes-sidebar-index');
      const backdrop = document.getElementById('drawer-backdrop');
      const dock = document.getElementById('jnotes-vertical-dock');
      if (sb) sb.classList.remove('open');
      if (backdrop) backdrop.classList.remove('open');
      if (dock) dock.classList.remove('dock-retracted');
    };

    window.selectPageAndCloseDrawer = function(pageNum) {
      window.scrollToPage(pageNum);
      window.closeSidebar();
    };

    window.setTool = function(tool) {
      currentTool = tool;

      if (tool === 'pen') {
        // Pen MUST default to freehand smooth drawing without ruler snap!
        isStraightLine = false;
        straightLineMode = false;
        const btnStraight = document.getElementById('ptool-straight') || document.getElementById('tool-straight-toggle');
        if (btnStraight) btnStraight.classList.remove('active');
        const sw = document.getElementById('toggle-straight-line');
        if (sw) sw.classList.remove('on');

        if (currentStroke > 6) {
          window.updateLineWeight('0.8'); // 4px
        }
      } else if (tool === 'highlighter') {
        if (currentStroke < 8) {
          window.updateLineWeight('1.6'); // 16px
        }
      }

      document.querySelectorAll('.panel-tool-btn').forEach(b => {
        if (b.id === 'ptool-' + tool) b.classList.add('active');
        else if (b.id && b.id !== 'ptool-straight') {
          b.classList.remove('active');
        }
      });

      document.querySelectorAll('.jtool-btn').forEach(b => {
        if (b.id === 'tool-' + tool) b.classList.add('active');
        else if (b.id && b.id.startsWith('tool-') && b.id !== 'tool-straight-toggle' && b.id !== 'btn-toggle-fullscreen' && b.id !== 'btn-toggle-colors' && b.id !== 'btn-paper-theme' && b.id !== 'btn-clear-page' && b.id !== 'btn-toggle-tools-panel') {
          b.classList.remove('active');
        }
      });

      document.querySelectorAll('.canvas-overlay').forEach(c => {
        const isActive = tool === 'pen' || tool === 'highlighter' || tool === 'eraser' || tool === 'text';
        c.classList.toggle('pen-active', isActive);
        c.classList.toggle('cursor-text', tool === 'text');
      });

      if (typeof window.updateActiveToolBadge === 'function') {
        window.updateActiveToolBadge();
      }
    };

    window.setColor = function(color) {
      currentColor = color;
      document.documentElement.style.setProperty('--highlight-color', color);
      document.querySelectorAll('.color-dot').forEach(d => {
        d.classList.toggle('active', d.getAttribute('data-color').toLowerCase() === color.toLowerCase());
      });
      document.querySelectorAll('.palette-swatch-btn').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-color').toLowerCase() === color.toLowerCase());
      });
      const preview = document.getElementById('current-color-preview-pill');
      if (preview) preview.style.background = color;
      const hexInput = document.getElementById('jnotes-hex-input');
      if (hexInput && color.startsWith('#')) hexInput.value = color.toUpperCase();
      const colorPicker = document.getElementById('jnotes-color-input');
      if (colorPicker && color.startsWith('#')) colorPicker.value = color;

      if (typeof window.updateActiveToolBadge === 'function') {
        window.updateActiveToolBadge();
      }
    };

    window.applyPreset = function(color, strokeWidth, tool) {
      window.setColor(color);
      currentStroke = strokeWidth;
      window.setTool(tool);
    };

    function ensureCanvasSize(canvas, page) {
      if (!canvas || !page) return;
      const w = page.offsetWidth || 800;
      const h = page.offsetHeight || 1100;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }

    // Canvas Touch & Drawing Engine
    function initCanvases() {
      document.querySelectorAll('.doc-page').forEach(page => {
        const pageNum = page.getAttribute('data-page');
        const canvas = document.getElementById('canvas-' + pageNum);
        if (!canvas) return;

        ensureCanvasSize(canvas, page);

        const ctx = canvas.getContext('2d');
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Mouse Events
        canvas.onmousedown = (e) => startDraw(e, canvas, pageNum, page);
        canvas.onmousemove = (e) => draw(e, canvas, pageNum);
        canvas.onmouseup = () => stopDraw(pageNum);
        canvas.onmouseleave = () => stopDraw(pageNum);
        canvas.onclick = (e) => handleCanvasClick(e, canvas, pageNum);

        // Flawless Mobile Touch Events (prevent touch scroll when drawing!)
        canvas.addEventListener('touchstart', (e) => {
          if (currentTool === 'pan') return;
          e.preventDefault();
          startDraw(e.touches[0], canvas, pageNum, page);
        }, { passive: false });

        canvas.addEventListener('touchmove', (e) => {
          if (currentTool === 'pan') return;
          e.preventDefault();
          draw(e.touches[0], canvas, pageNum);
        }, { passive: false });

        canvas.addEventListener('touchend', (e) => {
          if (currentTool === 'pan') return;
          e.preventDefault();
          stopDraw(pageNum);
        }, { passive: false });
      });
    }

    function startDraw(e, canvas, pageNum, page) {
      if (currentTool !== 'pen' && currentTool !== 'highlighter' && currentTool !== 'eraser') return;
      if (page) ensureCanvasSize(canvas, page);
      isDrawing = true;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      startX = (e.clientX - rect.left) * scaleX;
      startY = (e.clientY - rect.top) * scaleY;

      if (!strokes[pageNum]) strokes[pageNum] = [];

      if (currentTool === 'eraser') {
        eraseAt(pageNum, startX, startY);
      } else {
        const isHl = currentTool === 'highlighter';
        const strokeW = isHl 
          ? Math.max(14, currentStroke) 
          : Math.min(6, Math.max(1.5, currentStroke));

        strokes[pageNum].push({
          tool: currentTool,
          color: currentColor,
          strokeWidth: strokeW,
          isStraight: isStraightLine,
          isStraightLine: isStraightLine,
          bottomDisplay: bottomDisplayMode,
          points: [{ x: startX, y: startY }]
        });
      }
    }

    function draw(e, canvas, pageNum) {
      if (!isDrawing) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;

      if (currentTool === 'eraser') {
        eraseAt(pageNum, x, y);
      } else {
        const currStrokes = strokes[pageNum];
        if (currStrokes && currStrokes.length > 0) {
          const st = currStrokes[currStrokes.length - 1];
          if (st.isStraight || st.isStraightLine) {
            // Straight line drawing mode (horizontal and vertical snap)
            const dx = Math.abs(x - startX);
            const dy = Math.abs(y - startY);
            let targetX = x;
            let targetY = y;
            if (dy < 20 || dy <= dx * 0.25) {
              targetY = startY; // Perfect horizontal snap for highlighting lines of text
            } else if (dx < 20 || dx <= dy * 0.25) {
              targetX = startX; // Vertical snap
            }
            st.points = [{ x: startX, y: startY }, { x: targetX, y: targetY }];
          } else {
            st.points.push({ x, y });
          }
          redrawCanvas(pageNum);
        }
      }
    }

    function stopDraw(pageNum) {
      if (isDrawing) {
        isDrawing = false;
        const pageStrokes = strokes[pageNum];
        if (pageStrokes && pageStrokes.length > 0) {
          const lastSt = pageStrokes[pageStrokes.length - 1];
          actionHistory.push({ type: 'stroke', pageNum: pageNum, stroke: lastSt });
          redoStack = [];
        }
        triggerAutoSave();
      }
    }

    function eraseAt(pageNum, x, y) {
      if (!strokes[pageNum]) return;
      const radius = 25;
      strokes[pageNum] = strokes[pageNum].filter(st => {
        return !st.points.some(p => Math.hypot(p.x - x, p.y - y) < radius);
      });
      redrawCanvas(pageNum);
    }

    function redrawCanvas(pageNum) {
      const canvas = document.getElementById('canvas-' + pageNum);
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const pageStrokes = strokes[pageNum] || [];
      pageStrokes.forEach(st => {
        if (st.points.length < 2) return;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(st.points[0].x, st.points[0].y);

        for (let i = 1; i < st.points.length; i++) {
          ctx.lineTo(st.points[i].x, st.points[i].y);
        }

        if (st.tool === 'highlighter') {
          ctx.globalCompositeOperation = st.bottomDisplay !== false ? 'multiply' : 'source-over';
          ctx.globalAlpha = 0.55;
          ctx.lineCap = 'square';
          ctx.lineJoin = 'round';
          ctx.strokeStyle = st.color;
          ctx.lineWidth = st.strokeWidth || 16;
        } else {
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = 1.0;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.strokeStyle = st.color;
          ctx.lineWidth = st.strokeWidth || 2.5;
        }

        ctx.stroke();
        ctx.restore();
      });
    }

    // Text Element Highlight Click
    document.querySelectorAll('.doc-page p, .doc-page li, .doc-page h3').forEach((el, idx) => {
      el.setAttribute('data-idx', idx);
      el.addEventListener('click', (e) => {
        if (currentTool === 'highlighter') {
          el.classList.toggle('highlighted');
          triggerAutoSave();
        } else if (currentTool === 'eraser') {
          el.classList.remove('highlighted');
          triggerAutoSave();
        }
      });
    });

    // Undo / Redo Handlers
    document.getElementById('btn-undo')?.addEventListener('click', () => {
      window.undoAction();
    });
    document.getElementById('btn-redo')?.addEventListener('click', () => {
      window.redoAction();
    });

    // Auto-Save Trigger
    function triggerAutoSave() {
      const highlights = [];
      document.querySelectorAll('.highlighted').forEach(el => {
        highlights.push(parseInt(el.getAttribute('data-idx'), 10));
      });

      const data = {
        docId: docId,
        highlights: highlights,
        strokes: strokes,
        textNotes: textNotes,
        updatedAt: new Date().toISOString()
      };

      try {
        localStorage.setItem('kf_doc_annotations_' + docId, JSON.stringify(data));
      } catch (e) {}

      const badge = document.getElementById('auto-save-badge');
      if (badge) {
        badge.style.opacity = '1';
        setTimeout(() => { badge.style.opacity = '0.7'; }, 1500);
      }
    }

    // Load Saved Annotations
    function loadSavedAnnotations() {
      try {
        const saved = localStorage.getItem('kf_doc_annotations_' + docId);
        if (!saved) return;
        const data = JSON.parse(saved);

        if (Array.isArray(data.highlights)) {
          const allTextEls = document.querySelectorAll('.doc-page p, .doc-page li, .doc-page h3');
          data.highlights.forEach(idx => {
            if (allTextEls[idx]) allTextEls[idx].classList.add('highlighted');
          });
        }

        if (data.strokes) {
          strokes = data.strokes;
          Object.keys(strokes).forEach(pNum => redrawCanvas(pNum));
        }

        if (data.textNotes) {
          textNotes = data.textNotes;
          renderAllTextNotes();
        }
      } catch (e) {}
    }

    // Scroll Page Counter
    const viewport = document.getElementById('jnotes-viewport');
    if (viewport) {
      viewport.addEventListener('scroll', () => {
        const pages = document.querySelectorAll('.doc-page');
        pages.forEach((p, idx) => {
          const rect = p.getBoundingClientRect();
          if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
            updateCounterPill(idx + 1);
            document.querySelectorAll('.thumb-card').forEach((c, cIdx) => {
              c.classList.toggle('active', cIdx === idx);
            });
          }
        });
      });
    }

    function updateCounterPill(pageNum) {
      currentPage = pageNum;
      const counterEl = document.getElementById('page-counter-num');
      if (counterEl) counterEl.textContent = pageNum + ' / ' + totalPages;
    }

    // Immediate initialization for srcdoc iframe environments
    initCanvases();
    initColorPalette();
    renderVerticalDock();
    initPaperTheme();
    loadSavedAnnotations();

    window.addEventListener('DOMContentLoaded', () => {
      initCanvases();
      initColorPalette();
      renderVerticalDock();
      initPaperTheme();
      loadSavedAnnotations();
    });
    window.addEventListener('resize', initCanvases);
    setTimeout(() => {
      initCanvases();
      initColorPalette();
      renderVerticalDock();
      initPaperTheme();
      loadSavedAnnotations();
    }, 200);
    })();
  </script>
</body>
</html>`;
  },

  renderStudio(container, doc, isAr) {
    if (!container) return;
    this.currentDoc = doc || this.currentDoc || {};
    const fullHTML = this.generateDocHTML(this.currentDoc, isAr);

    // Ensure dedicated JNotes styles are injected once in head
    if (!document.getElementById('jnotes-studio-styles')) {
      const styleMatch = fullHTML.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
      if (styleMatch) {
        const styleEl = document.createElement('style');
        styleEl.id = 'jnotes-studio-styles';
        styleEl.textContent = styleMatch[1];
        document.head.appendChild(styleEl);
      }
    }

    // Extract body HTML (excluding <script>)
    const bodyMatch = fullHTML.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const bodyContent = bodyMatch ? bodyMatch[1] : fullHTML;
    const scriptMatch = bodyContent.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
    const markupOnly = bodyContent.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');

    // Render directly into container DOM (Eliminates sandboxed iframe!)
    container.innerHTML = markupOnly;

    // Execute script logic directly in primary document window context
    if (scriptMatch && scriptMatch[1]) {
      const scriptEl = document.createElement('script');
      scriptEl.textContent = scriptMatch[1];
      document.body.appendChild(scriptEl);
      scriptEl.remove();
    }
  },

  render(container, doc, isAr) {
    return this.renderStudio(container, doc, isAr);
  }
};

window.DocumentViewer = DocumentViewer;
