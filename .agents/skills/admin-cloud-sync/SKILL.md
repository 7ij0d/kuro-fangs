---
name: admin-cloud-sync
description: >-
  Cloud storage integrations (Cloudflare R2, Supabase, GitHub Releases), Telegram bot
  notification dispatchers, binary PDF page counter, and batch sheet migrations.
---

# Admin Cloud Sync & Automation Skill

This skill provides backend automation and cloud synchronization patterns for the Kuro Fangs administration system.

---

## 1. Binary PDF Page Counter (Zero-Dependency)

To automatically count PDF pages during upload without parsing overhead or heavy dependencies:

```javascript
async function detectPdfPageCount(file) {
  const arrayBuffer = await file.slice(0, Math.min(file.size, 1024 * 1024 * 4)).arrayBuffer();
  const text = new TextDecoder('latin1').decode(arrayBuffer);
  
  // Method A: Match /Type /Pages /Count N
  const countMatches = text.match(/\/Count\s+(\d+)/g);
  if (countMatches && countMatches.length > 0) {
    let maxCount = 0;
    countMatches.forEach(m => {
      const num = parseInt(m.replace(/\/Count\s+/, ''), 10);
      if (num > maxCount && num < 1000) maxCount = num;
    });
    if (maxCount > 0) return maxCount;
  }

  // Method B: Match /Type /Page objects
  const pageMatches = text.match(/\/Type\s*\/Page[^s]/g);
  if (pageMatches && pageMatches.length > 0) {
    return pageMatches.length;
  }

  return 1;
}
```

---

## 2. Multi-Channel Notification Dispatcher

### Telegram Bot Dispatcher
```javascript
async function notifyTelegramNewSheet(sheetData, botToken, chatId) {
  const text = `
📚 *شيت دراسي جديد متاح الآن!*
🔹 *العنوان:* ${sheetData.title}
👨‍⚕️ *الدكتور:* ${sheetData.doctor_name || 'قسم الأسنان'}
📖 *عدد الصفحات:* ${sheetData.pages} صفحة
🔗 *الرابط:* https://kurofangs.id.ly/#/sheet/${sheetData.id}
  `.trim();

  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown'
      })
    });
  } catch (e) {
    console.warn('Telegram notification failed:', e);
  }
}
```

### Discord Webhook Dispatcher
```javascript
async function notifyDiscordNewSheet(sheetData, webhookUrl) {
  const payload = {
    embeds: [{
      title: `🦷 جديد: ${sheetData.title}`,
      description: `تمت إضافة شيت دراسي جديد بواسطة د. ${sheetData.doctor_name}`,
      color: 0x0284C7,
      fields: [
        { name: 'عدد الصفحات', value: `${sheetData.pages}`, inline: true },
        { name: 'المادة', value: sheetData.subject_name || 'طب أسنان', inline: true }
      ],
      url: `https://kurofangs.id.ly/#/sheet/${sheetData.id}`
    }]
  };

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (e) {
    console.warn('Discord webhook failed:', e);
  }
}
```

---

## 3. GitHub API Direct Content Commit (Zero-Backend)

To save new sheets directly into `data/sheets.json` hosted on GitHub Pages:

```javascript
async function commitNewSheetToGitHub(newSheet, githubToken, repo = '7ij0d/kuro-fangs') {
  const path = 'data/sheets.json';
  const getUrl = `https://api.github.com/repos/${repo}/contents/${path}`;

  // 1. Get current file sha and content
  const res = await fetch(getUrl, {
    headers: { Authorization: `Bearer ${githubToken}`, Accept: 'application/vnd.github.v3+json' }
  });
  const fileData = await res.json();
  const currentContent = JSON.parse(atob(fileData.content));

  // 2. Append new sheet
  currentContent.unshift(newSheet);
  const updatedContentBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(currentContent, null, 2))));

  // 3. Commit update
  const putRes = await fetch(getUrl, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${githubToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: `feat(sheets): add ${newSheet.title}`,
      content: updatedContentBase64,
      sha: fileData.sha
    })
  });

  return putRes.ok;
}
```
