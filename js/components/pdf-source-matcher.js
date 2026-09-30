/**
 * KURO FANGS — PDF SOURCE MATCHER ENGINE
 * High-precision text anchoring & verified bounding-box resolution
 * Priority: Exact Anchor -> Normalized Text -> Surrounding Text -> Verified Box Fallback
 * CRITICAL RULE: NO GUESSING, NO FAKE HIGHLIGHTS.
 */

(function (window) {
  'use strict';

  const PdfSourceMatcher = {
    /**
     * Normalize text for robust cross-PDF comparisons:
     * - Case-insensitive
     * - Unicode quotes, dashes and punctuation normalization
     * - Collapses arbitrary whitespace & line-breaks into a single space
     */
    normalizeText(str) {
      if (!str || typeof str !== 'string') return '';
      return str
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[\u2018\u2019`]/g, "'")
        .replace(/[\u201C\u201D«»]/g, '"')
        .replace(/[\u2013\u2014\u2212]/g, '-')
        .replace(/[^\w\s\-'"]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    },

    /**
     * Clean text without removing standard characters (for exact matching)
     */
    cleanWhitespace(str) {
      if (!str || typeof str !== 'string') return '';
      return str.replace(/\r?\n|\r/g, ' ').replace(/\s+/g, ' ').trim();
    },

    /**
     * Match a question source reference against a PDF page's extracted items.
     * @param {Object} pageData - { items: [{str, x, y, w, h}], fullText: string }
     * @param {Object} sourceRef - Question source reference schema
     * @param {number} targetPage - Page number being inspected
     * @returns {Object} Resolution result: { verified: boolean, rects, bounds, ... }
     */
    matchSourceInPage(pageData, sourceRef, targetPage) {
      if (!sourceRef) {
        return { verified: false, status: 'unresolved', reason: 'No source reference provided' };
      }

      const refPage = parseInt(sourceRef.page_number || sourceRef.page || sourceRef.page_ref, 10);
      if (refPage && targetPage && refPage !== targetPage) {
        return {
          verified: false,
          status: 'unresolved',
          reason: `Target page mismatch (source: ${refPage}, current: ${targetPage})`
        };
      }

      if (!pageData || !Array.isArray(pageData.items) || pageData.items.length === 0) {
        // If bounding box was pre-verified and explicitly provided
        if (sourceRef.verification_status === 'verified' && sourceRef.bounding_box) {
          const bb = sourceRef.bounding_box;
          return {
            verified: true,
            page: targetPage,
            sourceType: sourceRef.source_type || 'exact',
            rects: [{ x: bb.x, y: bb.y, w: bb.width || bb.w, h: bb.height || bb.h }],
            bounds: { x: bb.x, y: bb.y, w: bb.width || bb.w, h: bb.height || bb.h },
            matchedText: sourceRef.source_text || '',
            confidence: sourceRef.confidence || 0.9,
            matchMethod: 'verified_bounding_box'
          };
        }
        return { verified: false, status: 'unresolved', reason: 'No text items on page' };
      }

      const items = pageData.items;

      // Extract candidate texts to search for
      const primaryText = sourceRef.source_text || sourceRef.quote_ref || sourceRef.text || '';
      const anchorText = sourceRef.text_anchor || '';
      const normSpecified = sourceRef.source_text_normalized || sourceRef.normalized_text || '';

      const candidates = [];
      if (anchorText) candidates.push({ text: anchorText, type: 'anchor', weight: 1.0 });
      if (primaryText) candidates.push({ text: primaryText, type: 'primary', weight: 0.95 });
      if (normSpecified) candidates.push({ text: normSpecified, type: 'specified_norm', weight: 0.9 });

      // ── PRIORITY 1 & 2: Sliding-Window Text Match across consecutive items ──
      for (const cand of candidates) {
        const rawTarget = this.cleanWhitespace(cand.text);
        const normTarget = this.normalizeText(cand.text);
        if (!normTarget || normTarget.length < 5) continue;

        // Build combined text with offset tracking
        let combinedNorm = '';
        let combinedRaw = '';
        const offsets = [];

        items.forEach((it, idx) => {
          const itRaw = (it.str || '').trim();
          if (!itRaw) return;
          const itNorm = this.normalizeText(itRaw);
          if (!itNorm) return;

          const startNorm = combinedNorm.length ? combinedNorm.length + 1 : 0;
          combinedNorm += (combinedNorm.length ? ' ' : '') + itNorm;
          const endNorm = combinedNorm.length;

          const startRaw = combinedRaw.length ? combinedRaw.length + 1 : 0;
          combinedRaw += (combinedRaw.length ? ' ' : '') + itRaw;
          const endRaw = combinedRaw.length;

          offsets.push({
            idx,
            it,
            startNorm,
            endNorm,
            startRaw,
            endRaw
          });
        });

        // 1. Exact case-sensitive match in combinedRaw
        let matchPos = combinedRaw.indexOf(rawTarget);
        let matchMethod = 'exact_text';

        // 2. Normalized match in combinedNorm
        if (matchPos === -1) {
          matchPos = combinedNorm.indexOf(normTarget);
          matchMethod = 'normalized_text';
        }

        // 3. Substring anchor match (if primary string is long, test key anchor chunks)
        if (matchPos === -1 && normTarget.length > 40) {
          const sentences = normTarget.split(/[.;:]/).map(s => s.trim()).filter(s => s.length >= 25);
          for (const s of sentences) {
            const subPos = combinedNorm.indexOf(s);
            if (subPos !== -1) {
              matchPos = subPos;
              matchMethod = 'surrounding_anchor_chunk';
              break;
            }
          }
        }

        if (matchPos !== -1) {
          const isNorm = matchMethod.startsWith('normalized') || matchMethod.startsWith('surrounding');
          const targetLen = isNorm ? normTarget.length : rawTarget.length;
          const matchEnd = matchPos + targetLen;

          const matchedOffsets = offsets.filter(o => {
            const s = isNorm ? o.startNorm : o.startRaw;
            const e = isNorm ? o.endNorm : o.endRaw;
            return s < matchEnd && e > matchPos;
          });

          if (matchedOffsets.length > 0) {
            const matchedItems = matchedOffsets.map(o => o.it);
            const lineRects = this.mergeAdjacentItemRects(matchedItems);
            const bounds = this.computeUnionBounds(lineRects);

            return {
              verified: true,
              page: targetPage,
              sourceType: sourceRef.source_type || 'exact',
              rects: lineRects,
              bounds: bounds,
              matchedText: matchedItems.map(i => i.str).join(' '),
              confidence: cand.weight,
              matchMethod: matchMethod
            };
          }
        }
      }

      // ── PRIORITY 4: Pre-verified Bounding Box Fallback ──
      if (sourceRef.verification_status === 'verified' && sourceRef.bounding_box) {
        const bb = sourceRef.bounding_box;
        const rect = {
          x: bb.x,
          y: bb.y,
          w: bb.width || bb.w,
          h: bb.height || bb.h
        };
        return {
          verified: true,
          page: targetPage,
          sourceType: sourceRef.source_type || 'exact',
          rects: [rect],
          bounds: rect,
          matchedText: sourceRef.source_text || '',
          confidence: sourceRef.confidence || 0.88,
          matchMethod: 'verified_bounding_box'
        };
      }

      // ── UNRESOLVED: Critical Rule: NEVER GUESS, NEVER FAKE HIGHLIGHT ──
      return {
        verified: false,
        page: targetPage,
        sourceType: sourceRef.source_type || 'exact',
        status: 'unresolved',
        reason: 'Exact or normalized source text could not be verified on this sheet page'
      };
    },

    /**
     * Merge items on the same or adjacent vertical lines into clean horizontal highlight bars
     */
    mergeAdjacentItemRects(items) {
      if (!items || items.length === 0) return [];

      // Sort items top-to-bottom, left-to-right
      const sorted = [...items].sort((a, b) => {
        if (Math.abs(a.y - b.y) > 6) return a.y - b.y;
        return a.x - b.x;
      });

      const lines = [];
      let currentLine = null;

      sorted.forEach(it => {
        const itRect = {
          x: it.x,
          y: it.y,
          w: Math.max(16, it.w),
          h: Math.max(12, it.h)
        };

        if (!currentLine) {
          currentLine = { ...itRect };
          lines.push(currentLine);
          return;
        }

        // Check if on same horizontal text line (within 8px vertical difference)
        const isSameLine = Math.abs(itRect.y - currentLine.y) <= 8;
        const isNearHorizontal = itRect.x <= currentLine.x + currentLine.w + 24;

        if (isSameLine && isNearHorizontal) {
          const newRight = Math.max(currentLine.x + currentLine.w, itRect.x + itRect.w);
          currentLine.w = newRight - currentLine.x;
          currentLine.h = Math.max(currentLine.h, itRect.h);
          currentLine.y = Math.min(currentLine.y, itRect.y);
        } else {
          currentLine = { ...itRect };
          lines.push(currentLine);
        }
      });

      // Add a slight horizontal & vertical breathing room for luxury high-end highlighter feel
      return lines.map(r => ({
        x: Math.max(0, r.x - 2),
        y: Math.max(0, r.y - 1),
        w: r.w + 4,
        h: r.h + 2
      }));
    },

    /**
     * Compute union bounding box enclosing all line rects
     */
    computeUnionBounds(rects) {
      if (!rects || rects.length === 0) {
        return { x: 40, y: 140, w: 640, h: 60 };
      }
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;

      rects.forEach(r => {
        if (r.x < minX) minX = r.x;
        if (r.y < minY) minY = r.y;
        if (r.x + r.w > maxX) maxX = r.x + r.w;
        if (r.y + r.h > maxY) maxY = r.y + r.h;
      });

      return {
        x: Math.max(0, minX),
        y: Math.max(0, minY),
        w: Math.max(20, maxX - minX),
        h: Math.max(16, maxY - minY)
      };
    }
  };

  window.PdfSourceMatcher = PdfSourceMatcher;
})(window);
