const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// ── Zero-Dependency .env Loader ───────────────────────────────
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    try {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split(/\r?\n/).forEach(line => {
        line = line.trim();
        if (!line || line.startsWith('#')) return;
        const eqIdx = line.indexOf('=');
        if (eqIdx > 0) {
          const key = line.substring(0, eqIdx).trim();
          const val = line.substring(eqIdx + 1).trim();
          if (process.env[key] === undefined) {
            process.env[key] = val;
          }
        }
      });
    } catch (e) {
      console.warn('Notice: Could not parse .env file:', e.message);
    }
  }
}
loadEnv();

const PORT = parseInt(process.env.PORT, 10) || 5000;
const HOST = '0.0.0.0';
const ROOT_DIR = __dirname;
const DATA_DIR = path.join(ROOT_DIR, 'data');
const DB_FILE = path.join(DATA_DIR, 'achievements.json');

// ── Server-Side Private Secrets (Loaded Strictly from process.env / .env) ──
const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || '';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
const VFSTR_AUTH_TOKEN = process.env.VFSTR_AUTH_TOKEN || '';

if (!RESEND_API_KEY) {
  console.warn('⚠️  RESEND_API_KEY is not set — email notifications will be simulated or fail. Provide it in .env or cloud environment.');
}

// Ensure data folder and achievements file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf8');
}

// ── MIME Types ────────────────────────────────────────────────
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.pdf':  'application/pdf',
  '.txt':  'text/plain; charset=utf-8',
  '.woff2':'font/woff2',
  '.woff': 'font/woff',
  '.ttf':  'font/ttf'
};

// ── Security Headers ──────────────────────────────────────────
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

// ── In-Memory Rate Limiter (Anti-Abuse for Email / Writes) ─────
const rateLimitMap = new Map();
function isRateLimited(ip, maxRequests = 20, windowMs = 60000) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, resetTime: now + windowMs };
  if (now > entry.resetTime) {
    entry.count = 1;
    entry.resetTime = now + windowMs;
    rateLimitMap.set(ip, entry);
    return false;
  }
  entry.count += 1;
  rateLimitMap.set(ip, entry);
  return entry.count > maxRequests;
}

// Clean up old rate limit entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 300000);

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-User-Role',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    ...SECURITY_HEADERS
  });
  res.end(JSON.stringify(data));
}

function parseBody(req, callback) {
  let body = '';
  req.on('data', chunk => {
    body += chunk;
    if (body.length > 1e7) { // 10MB limit
      req.destroy();
    }
  });
  req.on('end', () => {
    try {
      const parsed = body ? JSON.parse(body) : {};
      callback(null, parsed);
    } catch (e) {
      callback(e, null);
    }
  });
}

function sendEmailNotification(toEmail, studentName, title, status, points, notes, callback) {
  if (!RESEND_API_KEY) {
    return callback(new Error('RESEND_API_KEY is not configured on the server.'), null);
  }

  const isApproved = status === 'verified' || status === 'approved';
  const subject = isApproved 
    ? `✅ VFSTR AEPS: Achievement Approved (+${points} Pts) - ${title}`
    : `⚠️ VFSTR AEPS: Action Required on Certificate - ${title}`;

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
      <div style="border-bottom: 2px solid #1e3a8a; padding-bottom: 12px; margin-bottom: 20px;">
        <h2 style="color: #1e3a8a; margin: 0;">Vignan's Foundation for Science, Technology & Research</h2>
        <p style="color: #64748b; font-size: 12px; margin: 4px 0 0 0;">VFSTR AEPS · Student Achievement Verification System (NAAC Criteria 5.3)</p>
      </div>

      <p style="font-size: 15px; color: #1e293b;">Dear <strong>${studentName || 'Student'}</strong>,</p>
      
      <p style="font-size: 14px; color: #334155;">
        Your submitted achievement record has been evaluated by the Faculty Verification Committee:
      </p>

      <div style="background: ${isApproved ? '#f0fdf4' : '#fff1f2'}; border: 1px solid ${isApproved ? '#bbf7d0' : '#fecdd3'}; border-radius: 8px; padding: 16px; margin: 16px 0;">
        <div style="font-size: 16px; font-weight: bold; color: ${isApproved ? '#15803d' : '#be123c'}; margin-bottom: 8px;">
          ${isApproved ? '🎉 Status: APPROVED & VERIFIED' : '❌ Status: REJECTED / NEEDS REVISION'}
        </div>
        <div style="font-size: 14px; color: #0f172a; margin-bottom: 4px;"><strong>Achievement:</strong> ${title}</div>
        <div style="font-size: 14px; color: #0f172a; margin-bottom: 4px;"><strong>Institutional Weight Awarded:</strong> ${isApproved ? `+${points} Points` : '0 Points'}</div>
        ${notes ? `<div style="font-size: 13px; color: #475569; margin-top: 8px;"><strong>Verifier Notes:</strong> ${notes}</div>` : ''}
      </div>

      <p style="font-size: 13px; color: #64748b;">
        This record has been indexed with SHA-256 evidence verification for NAAC SSR, NIRF #75 ranking, and NBA criteria.
      </p>

      <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #f1f5f9; font-size: 11px; color: #94a3b8; text-align: center;">
        Vignan Deemed to be University · Vadlamudi, Guntur · Internal Quality Assurance Cell (IQAC)
      </div>
    </div>
  `;

  const recipient = (toEmail && typeof toEmail === 'string' && toEmail.includes('@'))
    ? toEmail.trim()
    : 'delivered@resend.dev';

  const payload = JSON.stringify({
    from: RESEND_FROM_EMAIL,
    to: [recipient],
    subject: subject,
    html: htmlContent
  });

  const req = https.request({
    hostname: 'api.resend.com',
    path: '/emails',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  }, (res) => {
    let responseBody = '';
    res.on('data', d => responseBody += d);
    res.on('end', () => {
      if (typeof callback === 'function') {
        callback(null, { statusCode: res.statusCode, response: responseBody });
      }
    });
  });

  req.on('error', (err) => {
    if (typeof callback === 'function') {
      callback(err, null);
    }
  });

  req.write(payload);
  req.end();
}

// Roles allowed to change an achievement's verification status
const VERIFIER_ROLES = ['faculty', 'hod', 'iqac', 'placement-cell', 'student-affairs'];

function sanitizeIncomingAchievements(incomingArray, existingArray, role) {
  const isVerifier = VERIFIER_ROLES.includes((role || '').toLowerCase());
  const existingById = {};
  existingArray.forEach(a => { existingById[a.id] = a; });

  return incomingArray.map(incoming => {
    const prev = existingById[incoming.id];
    if (!prev) {
      if (!isVerifier) {
        return { ...incoming, status: 'pending', autoVerified: false, verifiedBy: null, verifiedDate: null };
      }
      return incoming;
    }
    if (prev.status !== incoming.status && !isVerifier) {
      return prev;
    }
    return incoming;
  });
}

// ── Resource Protection Guard (Blocks Private Files / Directories) ──
function isForbiddenResource(cleanPath) {
  const lower = cleanPath.toLowerCase();
  
  // Explicit blocked files & paths
  const blockedPatterns = [
    /^\/\.env/i,               // .env, .env.local, .env.production, etc.
    /^\/\.git/i,               // Git internal files
    /^\/\.agents/i,            // Internal agent configs
    /^\/\.gemini/i,            // Internal ide/brain folders
    /^\/\.vscode/i,            // VSCode configurations
    /^\/server\.js/i,          // Server source code
    /^\/package(-lock)?\.json/i, // Package configuration
    /^\/data\//i,              // Raw database files (must use /api/achievements)
    /\.(md|markdown|sh|bat|cmd|ps1|log|tmp|bak|yaml|yml)$/i // Internal scripts, docs, configs
  ];

  for (const pattern of blockedPatterns) {
    if (pattern.test(cleanPath)) return true;
  }

  // Any hidden dotfile (starts with /.)
  if (cleanPath.startsWith('/.') || cleanPath.includes('/.')) {
    return true;
  }

  return false;
}

// ── Allowed Static Assets Whitelist ───────────────────────────
function isWhitelistedPublicAsset(cleanPath) {
  const allowedPrefixes = ['/css/', '/js/', '/images/'];
  const allowedExact = ['/favicon.ico', '/robots.txt', '/index.html'];

  if (allowedExact.includes(cleanPath)) return true;
  for (const prefix of allowedPrefixes) {
    if (cleanPath.startsWith(prefix)) return true;
  }
  return false;
}

// ── HTTP Server Request Handler ───────────────────────────────
const server = http.createServer((req, res) => {
  const clientIp = req.socket.remoteAddress || '127.0.0.1';

  // 1. CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-User-Role',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
      ...SECURITY_HEADERS
    });
    res.end();
    return;
  }

  // 2. Parse URL path safely
  const parsedUrl = req.url.split('?')[0];
  let reqPath = decodeURI(parsedUrl);

  // Normalize path & prevent path traversal
  const cleanPath = path.posix.normalize(reqPath);

  // ── 3. STRICT RESOURCE PROTECTION FIREWALL ────────────────────
  if (isForbiddenResource(cleanPath)) {
    res.writeHead(403, { 
      'Content-Type': 'application/json; charset=utf-8',
      ...SECURITY_HEADERS 
    });
    res.end(JSON.stringify({
      error: '403 Forbidden',
      message: 'Access to internal server resources, environment secrets, and backend files is strictly forbidden.'
    }));
    return;
  }

  // Canonical Clean URL: Redirect explicit /index.html requests to /
  if (cleanPath === '/index.html') {
    const query = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
    res.writeHead(302, {
      'Location': '/' + query,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      ...SECURITY_HEADERS
    });
    res.end();
    return;
  }

  // ── 4. API ENDPOINTS ──────────────────────────────────────────

  // Health Check Endpoint (For Cloud Deployments / Load Balancers)
  if (cleanPath === '/api/health' && req.method === 'GET') {
    sendJSON(res, 200, {
      status: 'healthy',
      service: 'VFSTR Student Achievement Agent',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
      resendConfigured: !!RESEND_API_KEY
    });
    return;
  }

  // Safe Public Config Endpoint
  if (cleanPath === '/api/config' && req.method === 'GET') {
    sendJSON(res, 200, {
      supabasePublishableKey: SUPABASE_PUBLISHABLE_KEY,
      resendEnabled: !!RESEND_API_KEY,
      college: "Vignan's Foundation for Science, Technology & Research (VFSTR)",
      accreditations: ["NAAC A+ (3.49 CGPA)", "NIRF #73", "NBA Tier 1", "AICTE Approved"]
    });
    return;
  }

  // Achievements Endpoint
  if (cleanPath === '/api/achievements') {
    if (req.method === 'GET') {
      try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        sendJSON(res, 200, JSON.parse(data || '[]'));
      } catch (e) {
        sendJSON(res, 500, { error: 'Failed to read achievements', details: e.message });
      }
      return;
    }

    if (req.method === 'POST') {
      if (isRateLimited(clientIp, 60, 60000)) {
        sendJSON(res, 429, { error: 'Too many achievement submissions. Please wait a moment.' });
        return;
      }

      parseBody(req, (err, newAch) => {
        if (err || !newAch) {
          sendJSON(res, 400, { error: 'Invalid JSON payload' });
          return;
        }
        try {
          let achievements = [];
          if (fs.existsSync(DB_FILE)) {
            achievements = JSON.parse(fs.readFileSync(DB_FILE, 'utf8') || '[]');
          }

          if (Array.isArray(newAch)) {
            const role = req.headers['x-user-role'] || '';
            achievements = sanitizeIncomingAchievements(newAch, achievements, role);
          } else {
            const role = req.headers['x-user-role'] || '';
            const isVerifier = VERIFIER_ROLES.includes((role || '').toLowerCase());
            const existingIdx = achievements.findIndex(a => a.id === newAch.id);

            if (existingIdx >= 0) {
              const prev = achievements[existingIdx];
              if (prev.status !== newAch.status && !isVerifier) {
                newAch = prev;
              }
              achievements[existingIdx] = { ...prev, ...newAch };
            } else {
              if (!isVerifier) {
                newAch = { ...newAch, status: 'pending', autoVerified: false, verifiedBy: null, verifiedDate: null };
              }
              achievements.unshift(newAch);
            }
          }

          fs.writeFileSync(DB_FILE, JSON.stringify(achievements, null, 2), 'utf8');
          sendJSON(res, 200, { success: true, count: achievements.length, data: newAch });
        } catch (e) {
          sendJSON(res, 500, { error: 'Failed to save achievement', details: e.message });
        }
      });
      return;
    }
  }

  // Email Notification Endpoint (Resend)
  if (cleanPath === '/api/email/send' && req.method === 'POST') {
    if (isRateLimited(clientIp, 15, 60000)) {
      sendJSON(res, 429, { error: 'Email rate limit exceeded. Please wait a moment before sending more notifications.' });
      return;
    }

    parseBody(req, (err, body) => {
      if (err || !body) {
        sendJSON(res, 400, { error: 'Invalid body' });
        return;
      }
      const { toEmail, studentName, title, status, points, notes } = body;
      sendEmailNotification(toEmail, studentName, title, status, points, notes, (emailErr, emailRes) => {
        if (emailErr) {
          sendJSON(res, 500, { success: false, error: emailErr.message });
        } else {
          sendJSON(res, 200, { success: true, resendStatus: emailRes.statusCode, data: emailRes.response });
        }
      });
    });
    return;
  }

  // ── 5. STATIC ASSETS & SPA ROUTING ────────────────────────────

  // Handle nested SPA paths requesting assets
  let staticPath = cleanPath;
  if (staticPath.includes('/css/'))    staticPath = staticPath.substring(staticPath.indexOf('/css/'));
  if (staticPath.includes('/js/'))     staticPath = staticPath.substring(staticPath.indexOf('/js/'));
  if (staticPath.includes('/images/')) staticPath = staticPath.substring(staticPath.indexOf('/images/'));

  let ext = path.extname(staticPath).toLowerCase();
  const isDirectAsset = isWhitelistedPublicAsset(staticPath);

  // If requesting root or non-asset SPA path, serve index.html with text/html Content-Type
  if (!ext || staticPath === '/' || staticPath === '') {
    staticPath = '/index.html';
    ext = '.html';
  }

  const filePath = path.normalize(path.join(ROOT_DIR, staticPath));

  // Double check directory containment
  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8', ...SECURITY_HEADERS });
    res.end('403 Forbidden');
    return;
  }

  // Check file existence
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Return 404 for missing static assets (prevent leaking index.html for dead image/js/css links)
      if (ext && ext !== '.html' && isDirectAsset) {
        res.writeHead(404, { 
          'Content-Type': 'text/plain; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          ...SECURITY_HEADERS
        });
        res.end(`404 Not Found: Asset '${staticPath}' does not exist.`);
        return;
      }

      // Fallback to index.html for Single Page App client routing
      const indexPath = path.join(ROOT_DIR, 'index.html');
      fs.readFile(indexPath, (readErr, content) => {
        if (readErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8', ...SECURITY_HEADERS });
          res.end('404 Not Found');
          return;
        }
        res.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8',
          'Content-Disposition': 'inline',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Access-Control-Allow-Origin': '*',
          ...SECURITY_HEADERS
        });
        res.end(content);
      });
      return;
    }

    // Serve allowed static asset with correct Content-Type, inline disposition, and security headers
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const cacheControl = (ext === '.html') 
      ? 'no-cache, no-store, must-revalidate'
      : 'public, max-age=86400, must-revalidate';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Disposition': 'inline',
      'Cache-Control': cacheControl,
      'Access-Control-Allow-Origin': '*',
      ...SECURITY_HEADERS
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} is already in use by another running process.`);
    console.error(`👉 Solution: Stop the existing process on port ${PORT} or specify a different port:`);
    console.error(`   PORT=3001 npm start\n`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
  }
});

server.listen(PORT, () => {
  console.log(`\n=============================================================`);
  console.log(`  🎓 VFSTR Student Achievement Verification Agent Server`);
  console.log(`  🌐 Localhost URL:      http://localhost:${PORT}/`);
  console.log(`  🔗 Local IP URL:       http://127.0.0.1:${PORT}/`);
  console.log(`  🔒 Security Shield:    ACTIVE (Protected .env, server.js, data/)`);
  console.log(`  📧 Resend Notifier:    ${RESEND_API_KEY ? 'CONFIGURED (Active)' : 'DISABLED (Simulated)'}`);
  console.log(`  🚀 Health Endpoint:    http://localhost:${PORT}/api/health`);
  console.log(`=============================================================\n`);
});
