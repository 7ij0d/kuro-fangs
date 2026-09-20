/**
 * KURO FANGS — HIGH-FIDELITY STRUCTURED SHEET TEXT ENGINE
 * Reconstructs visual layout, headings, paragraphs, and lists from PDF text items.
 * Built for elite dental education sheet reading and study note export.
 */
(function(window) {
  'use strict';

  /**
   * Cleans and normalizes raw text string
   */
  function cleanText(str) {
    if (!str) return '';
    return str
      .replace(/[\u200B-\u200D\uFEFF]/g, '') // remove zero-width spaces
      .replace(/\s+/g, ' '); // collapse internal whitespace
  }

  /**
   * Extracts and reconstructs structured text from a single PDFPageProxy
   * @param {Object} page PDF.js page proxy
   * @param {Object} options { pageNum, totalPages, sheetTitle, isAr }
   * @returns {Promise<string>} Formatted text string
   */
  async function extractPageText(page, options) {
    options = options || {};
    const textContent = await page.getTextContent({
      normalizeWhitespace: true,
      disableCombineTextItems: false
    });

    const items = textContent.items || [];
    if (items.length === 0) {
      return '';
    }

    // 1. Map items with coordinates and dimensions
    const mapped = [];
    for (const item of items) {
      const text = cleanText(item.str);
      if (!text || !text.trim()) continue;

      const tx = item.transform || [1, 0, 0, 1, 0, 0];
      const fontSize = Math.hypot(tx[0], tx[1]) || item.height || 12;
      const x = tx[4] || 0;
      const y = tx[5] || 0; // In PDF space, higher Y = higher on visual page
      const width = item.width || (text.length * fontSize * 0.5);
      const height = item.height || fontSize;

      mapped.push({
        text: text.trim(),
        rawText: text,
        x: x,
        y: y,
        fontSize: fontSize,
        width: width,
        height: height,
        dir: item.dir || 'ltr',
        fontName: item.fontName || ''
      });
    }

    if (mapped.length === 0) return '';

    // Calculate median font size for body text detection
    const fontSizes = mapped.map(function(m) { return m.fontSize; }).sort(function(a, b) { return a - b; });
    const medianFontSize = fontSizes[Math.floor(fontSizes.length / 2)] || 12;

    // 2. Sort items descending by Y (top of visual page to bottom)
    // Secondary sort by X (left to right)
    mapped.sort(function(a, b) {
      const diffY = b.y - a.y;
      if (Math.abs(diffY) > 3.5) {
        return diffY; // higher Y first
      }
      return a.x - b.x; // left to right
    });

    // 3. Cluster items into visual lines (Y-bucketing)
    const lines = [];
    let currentLine = null;

    for (const item of mapped) {
      if (!currentLine) {
        currentLine = {
          y: item.y,
          fontSize: item.fontSize,
          items: [item]
        };
        continue;
      }

      // Check vertical distance to current line
      const verticalDiff = Math.abs(currentLine.y - item.y);
      const tolerance = Math.max(3.5, item.fontSize * 0.35);

      if (verticalDiff <= tolerance) {
        // Same line
        currentLine.items.push(item);
        currentLine.fontSize = Math.max(currentLine.fontSize, item.fontSize);
      } else {
        // New line
        lines.push(currentLine);
        currentLine = {
          y: item.y,
          fontSize: item.fontSize,
          items: [item]
        };
      }
    }
    if (currentLine && currentLine.items.length > 0) {
      lines.push(currentLine);
    }

    // 4. Build text for each line by sorting items horizontally and inserting spaces
    const processedLines = [];
    for (const line of lines) {
      // Sort items by X ascending
      line.items.sort(function(a, b) { return a.x - b.x; });

      let lineText = '';
      let prevItem = null;

      for (const item of line.items) {
        if (!prevItem) {
          lineText = item.text;
        } else {
          const gap = item.x - (prevItem.x + prevItem.width);
          const spaceThreshold = Math.max(2, item.fontSize * 0.2);

          // If there is a visible gap between words
          if (gap > spaceThreshold && !lineText.endsWith(' ') && !item.text.startsWith(' ')) {
            lineText += ' ' + item.text;
          } else {
            lineText += (item.text.startsWith(' ') || lineText.endsWith(' ') ? '' : ' ') + item.text;
          }
        }
        prevItem = item;
      }

      lineText = lineText.trim();
      if (lineText) {
        processedLines.push({
          text: lineText,
          y: line.y,
          fontSize: line.fontSize
        });
      }
    }

    if (processedLines.length === 0) return '';

    // 5. Structure reconstruction: detect headings, paragraphs, and list items
    const outputParagraphs = [];
    let currentParagraph = [];

    // Helper: is this line a bullet/numbered list?
    const isListItem = function(txt) {
      return /^(\s*[-•*▪▫►✓]\s+|\s*\d+[\.\)]\s+|\s*[a-zA-Z][\.\)]\s+|\s*\([0-9a-zA-Z]+\)\s+)/.test(txt);
    };

    // Helper: is this line a heading?
    const isHeading = function(lineObj) {
      if (lineObj.fontSize >= medianFontSize * 1.25) return true;
      if (lineObj.text.length < 65 && lineObj.fontSize >= medianFontSize * 1.1) return true;
      return false;
    };

    for (let i = 0; i < processedLines.length; i++) {
      const line = processedLines[i];
      const prevLine = i > 0 ? processedLines[i - 1] : null;

      if (!prevLine) {
        if (isHeading(line)) {
          outputParagraphs.push('### ' + line.text);
        } else {
          currentParagraph.push(line.text);
        }
        continue;
      }

      const verticalGap = prevLine.y - line.y;
      const normalLineHeight = Math.max(prevLine.fontSize, medianFontSize) * 1.35;
      const isLargeGap = verticalGap > normalLineHeight * 1.6;

      if (isHeading(line)) {
        // Flush existing paragraph
        if (currentParagraph.length > 0) {
          outputParagraphs.push(currentParagraph.join('\n'));
          currentParagraph = [];
        }
        outputParagraphs.push('### ' + line.text);
      } else if (isListItem(line.text)) {
        // Bullet item gets its own line
        if (currentParagraph.length > 0) {
          outputParagraphs.push(currentParagraph.join('\n'));
          currentParagraph = [];
        }
        currentParagraph.push(line.text);
      } else if (isLargeGap) {
        // Paragraph break
        if (currentParagraph.length > 0) {
          outputParagraphs.push(currentParagraph.join('\n'));
          currentParagraph = [];
        }
        currentParagraph.push(line.text);
      } else {
        // Continuation of current paragraph or list
        currentParagraph.push(line.text);
      }
    }

    if (currentParagraph.length > 0) {
      outputParagraphs.push(currentParagraph.join('\n'));
    }

    return outputParagraphs.join('\n\n').trim();
  }

  /**
   * Extracts structured text from the entire document
   * @param {Object} pdfDoc PDF.js document proxy
   * @param {Object} options { sheetTitle, onProgress }
   * @returns {Promise<string>}
   */
  async function extractDocumentText(pdfDoc, options) {
    options = options || {};
    const numPages = pdfDoc.numPages || 1;
    const title = options.sheetTitle || 'شيت دراسي';
    const pagesText = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      if (typeof options.onProgress === 'function') {
        options.onProgress(pageNum, numPages);
      }
      try {
        const page = await pdfDoc.getPage(pageNum);
        const pageText = await extractPageText(page, {
          pageNum: pageNum,
          totalPages: numPages,
          sheetTitle: title
        });

        pagesText.push({
          pageNum: pageNum,
          text: pageText || '(صفحة فارغة أو تحتوي رسومات ومخططات فقط)'
        });
      } catch (err) {
        console.warn('Error extracting page ' + pageNum + ':', err);
        pagesText.push({
          pageNum: pageNum,
          text: '[تعذر قراءة نصوص صفحة ' + pageNum + ']'
        });
      }
    }

    // Assemble final formatted document
    const separator = '━'.repeat(45);
    const sections = pagesText.map(function(p) {
      return separator + '\n📄 ' + title + ' — صفحة (' + p.pageNum + ' من ' + numPages + ')\n' + separator + '\n\n' + p.text;
    });

    const header = '📘 ' + title + '\nعدد الصفحات: ' + numPages + '\nتم النسخ والتنسيق بواسطة: منصة كورو فانغز (Kuro Fangs)\n\n';
    return header + sections.join('\n\n\n');
  }

  /**
   * Copies text to clipboard with modern Clipboard API and fallback
   * @param {string} text 
   * @returns {Promise<boolean>}
   */
  async function copyToClipboard(text) {
    if (!text) return false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        if (window.SoundFX) window.SoundFX.play('copy');
        return true;
      }
    } catch (e) {
      console.warn('Clipboard API failed, trying fallback...', e);
    }

    // Fallback using textarea
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.top = '-9999px';
      textarea.style.left = '-9999px';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      if (success && window.SoundFX) window.SoundFX.play('copy');
      return success;
    } catch (err) {
      console.error('All copy methods failed:', err);
      return false;
    }
  }

  window.SheetCopyEngine = {
    extractPageText: extractPageText,
    extractDocumentText: extractDocumentText,
    copyToClipboard: copyToClipboard
  };
})(typeof window !== 'undefined' ? window : this);
