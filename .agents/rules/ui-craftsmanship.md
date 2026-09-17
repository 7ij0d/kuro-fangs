# UI/UX Craftsmanship & Anti-AI-Slop Directives

Every interface created or modified in Kuro Fangs MUST adhere to world-class product design engineering standards (Linear / Raycast / Apple grade) and strictly avoid recognizable AI tropes.

## 1. Absolute Bans (Anti-AI Slop)
- NO repetitive 3-column card grids with icons in colored circles.
- NO uncoordinated purple/violet neon glows on dark backgrounds.
- NO arbitrary 20px+ rounded corners on inputs and data tables.
- NO cluttered inline CSS styles (`style="..."`) inside markup or JS templates. Use semantic classes.
- NO clunky browser-default dialogs or oversized centered alert modals. Use slide-out command drawers or crisp, compact dialogs.

## 2. Kuro Fangs Visual Standards
- **Palette**: Deep Obsidian (`#0B0E14`), Crisp Clean Slate (`#F8FAFC`), layered surfaces with double-border elevation (`box-shadow: inset 0 1px 0 rgba(255,255,255,0.08)`).
- **Typography**: IBM Plex Sans Arabic for Arabic, Inter for Latin, with optical kerning and tabular numbers (`font-variant-numeric: tabular-nums`).
- **Tactile Micro-Interactions**: Mechanical button press states (`transform: scale(0.98)`), spring transition curves (`cubic-bezier(0.16, 1, 0.3, 1)`), live pulse status indicators.
- **RTL/LTR Precision**: Never hardcode `left`/`right`. Use CSS logical properties (`margin-inline`, `padding-inline`, `inset-inline`).
