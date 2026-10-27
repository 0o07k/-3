// server.js - تشغيل القاموس داخل VS Code (تلفون أو لابتوب)
// بدون أي مكتبات وبدون إنترنت. الأمر:  node server.js
const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const ROOT = __dirname;
const HOST = process.env.HOST || '127.0.0.1';
const START_PORT = Number(process.env.PORT) || 3000;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
  let urlPath;
  try {
    urlPath = decodeURIComponent(req.url.split('?')[0]);
  } catch (e) {
    res.writeHead(400); return res.end('Bad request');
  }
  if (urlPath === '/') urlPath = '/index.html';

  const file = path.normalize(path.join(ROOT, urlPath));
  if (file !== ROOT && !file.startsWith(ROOT + path.sep)) {
    res.writeHead(403); return res.end('Forbidden');
  }

  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, {
      'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store'
    });
    res.end(data);
  });
});

function start(port, tries) {
  server.once('error', (e) => {
    if (e.code === 'EADDRINUSE' && tries > 0) start(port + 1, tries - 1);
    else { console.error('تعذر تشغيل الخادم:', e.message); process.exit(1); }
  });
  server.listen(port, HOST, () => {
    const url = 'http://localhost:' + port + '/';
    console.log('');
    console.log('  قاموس مصوّر يعمل الآن');
    console.log('  افتح هذا الرابط في المتصفح:  ' + url);
    console.log('  لإيقافه اضغط Ctrl+C');
    console.log('');
    if (process.platform !== 'android' && !process.argv.includes('--no-open')) {
      const cmd = process.platform === 'win32' ? 'start ""' : process.platform === 'darwin' ? 'open' : 'xdg-open';
      exec(cmd + ' ' + url, () => {});
    }
  });
}
start(START_PORT, 10);
