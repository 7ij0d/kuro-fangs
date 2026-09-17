// Tiny zero-dependency development server for the static Kuro Fangs app.
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const mime = {
  '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.wasm': 'application/wasm',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.pdf': 'application/pdf',
  '.ftl': 'text/plain; charset=utf-8', '.map': 'application/json; charset=utf-8',
  '.ttf': 'font/ttf'
};

http.createServer((req, res) => {
  const requested = decodeURIComponent((req.url || '/').split('?')[0]);
  const relative = requested === '/' ? 'index.html' : requested.replace(/^[/\\]+/, '');
  const file = path.resolve(root, relative);
  if (!file.startsWith(root + path.sep) && file !== path.join(root, 'index.html')) {
    res.writeHead(403).end('Forbidden'); return;
  }
  fs.readFile(file, (error, content) => {
    if (error) { res.writeHead(error.code === 'ENOENT' ? 404 : 500).end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': mime[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(content);
  });
}).listen(3300, () => console.log('Kuro Fangs running at http://localhost:3300'));
