// ============================================================
//  dashboard.js — IQAC / HoD Analytics Dashboard View
//  Accreditation Criteria 5.3 & NIRF Metrics Engine
// ============================================================

function renderDashboardView() {
  const leaderboard = getLeaderboard();
  const catDist     = getCategoryDistribution();
  const deptStats   = getDeptStats();
  const semTrend    = getSemesterTrend();
  const totalStudents = STUDENTS.length;
  const totalAchs    = ACHIEVEMENTS.filter(a => a.status === 'verified').length;
  const avgScore     = totalStudents > 0
    ? Math.round(leaderboard.reduce((s,l) => s + l.total, 0) / totalStudents) : 0;
  const topCat = catDist[0]?.cat || 'N/A';

  return `
  <div class="view-header">
    <div>
      <h1 class="view-title">Accreditation & IQAC Analytics Hub</h1>
      <p class="view-sub">University-wide student accomplishment metrics formatted for <strong>NAAC Criteria 5.3</strong>, <strong>NIRF</strong>, and <strong>NBA Criteria 9</strong>.</p>
    </div>
    <div class="dash-actions">
      <button class="btn-ghost" onclick="exportDashboardCSV()">📥 Export NAAC SSR (CSV)</button>
      <span class="agent-badge"><span class="agent-dot pulse"></span>Agent 44 Synced</span>
    </div>
  </div>

  <!-- Accreditation Summary Banner -->
  <div class="purpose-card" style="border-left-color:var(--vignan-blue);background:#eff6ff;border-color:#dbeafe">
    <span style="font-size:1.3rem">🏛️</span>
    <div>
      <strong>Internal Quality Assurance Cell (IQAC) Weighting:</strong>
      Institutional ranking rubrics assign substantial weight to verified student achievements in Hackathons, Publications, Patents, Sports, and Cultural competitions. All records below are authenticated against issuing body registers.
    </div>
  </div>

  <!-- KPI Cards -->
  <div class="kpi-grid">
    <div class="kpi-card glass" style="--kpi-accent:#6d28d9">
      <div class="kpi-icon">👥</div>
      <div class="kpi-num">${totalStudents}</div>
      <div class="kpi-label">Registered Students</div>
      <div class="kpi-sub">Profiled in Agent 44</div>
    </div>
    <div class="kpi-card glass" style="--kpi-accent:#2563eb">
      <div class="kpi-icon">🏅</div>
      <div class="kpi-num">${totalAchs}</div>
      <div class="kpi-label">Verified Records</div>
      <div class="kpi-sub">${ACHIEVEMENTS.filter(a=>a.status==='pending').length} pending review</div>
    </div>
    <div class="kpi-card glass" style="--kpi-accent:#059669">
      <div class="kpi-icon">⭐</div>
      <div class="kpi-num">${avgScore}</div>
      <div class="kpi-label">Avg. Rubric Score</div>
      <div class="kpi-sub">institutional weight pts</div>
    </div>
    <div class="kpi-card glass" style="--kpi-accent:#d97706">
      <div class="kpi-icon">${CATEGORIES[topCat]?.icon || '🏆'}</div>
      <div class="kpi-num">${catDist[0]?.count || 0}</div>
      <div class="kpi-label">Dominant Category</div>
      <div class="kpi-sub">${CATEGORIES[topCat]?.label || 'N/A'}</div>
    </div>
  </div>

  <!-- Charts Row -->
  <div class="charts-row">
    <!-- Semester Trend Line -->
    <div class="glass card chart-card chart-wide">
      <h3 class="card-title">Points Trend Across Academic Semesters</h3>
      <div class="chart-wrap" id="line-chart-wrap">
        ${buildLineChart(semTrend)}
      </div>
    </div>

    <!-- Category Donut -->
    <div class="glass card chart-card">
      <h3 class="card-title">Category Distribution</h3>
      <div class="donut-wrap">
        ${buildDonutChart(catDist)}
      </div>
    </div>
  </div>

  <!-- Dept Bar + Leaderboard -->
  <div class="bottom-row">
    <!-- Department Bar Chart -->
    <div class="glass card dept-card">
      <h3 class="card-title">Department-wise Achievement Scores</h3>
      <div class="bar-chart-wrap">
        ${buildBarChart(deptStats)}
      </div>
    </div>

    <!-- Leaderboard -->
    <div class="glass card lb-card">
      <h3 class="card-title">🏆 Top Student Performers</h3>
      <div class="lb-list">
        ${leaderboard.map((entry, idx) => {
          const medal = idx===0?'🥇':idx===1?'🥈':idx===2?'🥉':'  ';
          return `
            <div class="lb-row" onclick="navigateTo('profile','${entry.student.id}')">
              <span class="lb-rank">${medal} #${idx+1}</span>
              <span class="lb-avatar">${entry.student.avatar}</span>
              <div class="lb-info">
                <span class="lb-name">${entry.student.name}</span>
                <span class="lb-dept">${entry.student.dept.split(' ')[0]}</span>
              </div>
              <div class="lb-right">
                <span class="lb-score">${entry.total} pts</span>
                <span class="lb-count">${entry.count} verified</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  </div>

  <!-- Full Achievement Registry -->
  <div class="glass card" style="margin-top:1.5rem">
    <div class="reg-header">
      <div>
        <h3 class="card-title" style="margin-bottom:.2rem">📋 University Achievement Registry (NAAC 5.3)</h3>
        <p style="font-size:.76rem;color:var(--txt-3)">Central institutional database of outside-coursework student accomplishments</p>
      </div>
      <div class="reg-filters">
        <select class="form-input sm" id="reg-cat" onchange="filterRegistry()">
          <option value="">All Categories</option>
          ${Object.entries(CATEGORIES).map(([k,c]) => `<option value="${k}">${c.icon} ${c.label}</option>`).join('')}
        </select>
        <select class="form-input sm" id="reg-status" onchange="filterRegistry()">
          <option value="">All Statuses</option>
          <option value="verified">Verified</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
        <select class="form-input sm" id="reg-dept" onchange="filterRegistry()">
          <option value="">All Departments</option>
          ${DEPARTMENTS.map(d => `<option value="${d}">${d}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="registry-table-wrap">
      <table class="registry-table" id="registry-table">
        <thead>
          <tr>
            <th>Student</th><th>Achievement Title</th><th>Category</th><th>Level</th><th>Points</th><th>Status</th><th>Date</th>
          </tr>
        </thead>
        <tbody id="registry-body">
          ${buildRegistryRows(ACHIEVEMENTS)}
        </tbody>
      </table>
    </div>
  </div>
  `;
}

// ── Line Chart SVG (White UI) ─────────────────────────────────
function buildLineChart(data) {
  const W = 520, H = 200, PAD = { top:20, right:20, bottom:40, left:50 };
  const iW = W - PAD.left - PAD.right;
  const iH = H - PAD.top  - PAD.bottom;

  const vals   = data.map(d => d.points);
  const maxVal = Math.max(...vals, 1);
  const xStep  = iW / (data.length - 1);

  const toX = i  => PAD.left + i * xStep;
  const toY = v  => PAD.top  + iH - (v / maxVal) * iH;

  const pts = data.map((d,i) => `${toX(i)},${toY(d.points)}`).join(' ');

  // Area fill
  const areaFirst = `${PAD.left},${PAD.top+iH}`;
  const areaLast  = `${PAD.left + (data.length-1)*xStep},${PAD.top+iH}`;
  const areaPath  = `${areaFirst} ${pts} ${areaLast}`;

  const gradId = 'lineGradWhite';

  const xLabels = data.map((d,i) => {
    if (i % 2 !== 0) return '';
    const shortSem = d.semester.replace(' 20','\'').replace('-','–');
    return `<text x="${toX(i)}" y="${H - 8}" text-anchor="middle" fill="#64748b" font-size="9.5" font-weight="600" font-family="Inter,sans-serif">${shortSem}</text>`;
  }).join('');

  const yLines = [0.25, 0.5, 0.75, 1].map(pct => {
    const y = toY(maxVal * pct);
    return `
      <line x1="${PAD.left}" y1="${y}" x2="${W-PAD.right}" y2="${y}" stroke="#e2e8f0" stroke-dasharray="4,4"/>
      <text x="${PAD.left-8}" y="${y+4}" text-anchor="end" fill="#64748b" font-size="9" font-weight="600" font-family="Inter,sans-serif">${Math.round(maxVal*pct)}</text>
    `;
  }).join('');

  const dots = data.map((d,i) => d.points > 0 ? `
    <circle cx="${toX(i)}" cy="${toY(d.points)}" r="4.5" fill="#6d28d9" stroke="#ffffff" stroke-width="2">
      <title>${d.semester}: ${d.points} pts</title>
    </circle>
  ` : '').join('');

  return `
    <svg width="100%" viewBox="0 0 ${W} ${H}" class="line-svg">
      <defs>
        <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#6d28d9" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="#6d28d9" stop-opacity="0.01"/>
        </linearGradient>
      </defs>
      ${yLines}
      <polygon points="${areaPath}" fill="url(#${gradId})"/>
      <polyline points="${pts}" fill="none" stroke="#6d28d9" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
      ${dots}
      ${xLabels}
    </svg>
  `;
}

// ── Donut Chart SVG (White UI) ────────────────────────────────
function buildDonutChart(data) {
  if (data.length === 0) return `<p class="empty-msg">No data yet.</p>`;

  const cx = 120, cy = 120, R = 80, r = 50;
  const total = data.reduce((s,d) => s + d.count, 0);
  let startAngle = -Math.PI / 2;

  const arcs = data.map(d => {
    const sweep = (d.count / total) * 2 * Math.PI;
    const x1 = cx + R * Math.cos(startAngle);
    const y1 = cy + R * Math.sin(startAngle);
    const endAngle = startAngle + sweep;
    const x2 = cx + R * Math.cos(endAngle);
    const y2 = cy + R * Math.sin(endAngle);
    const xi1 = cx + r * Math.cos(endAngle);
    const yi1 = cy + r * Math.sin(endAngle);
    const xi2 = cx + r * Math.cos(startAngle);
    const yi2 = cy + r * Math.sin(startAngle);
    const large = sweep > Math.PI ? 1 : 0;
    const path = `M${x1},${y1} A${R},${R},0,${large},1,${x2},${y2} L${xi1},${yi1} A${r},${r},0,${large},0,${xi2},${yi2} Z`;
    startAngle = endAngle;
    return { path, color: d.meta?.color || '#888', label: d.meta?.label || d.cat, count: d.count };
  });

  const legend = data.slice(0,6).map(d => `
    <div class="donut-leg-item">
      <span class="donut-leg-dot" style="background:${d.meta?.color||'#888'}"></span>
      <span class="donut-leg-label">${d.meta?.icon||''} ${d.meta?.label||d.cat}</span>
      <span class="donut-leg-val">${d.count}</span>
    </div>
  `).join('');

  return `
    <div class="donut-inner">
      <svg width="240" height="240" viewBox="0 0 240 240">
        ${arcs.map(a => `<path d="${a.path}" fill="${a.color}" opacity="0.95"><title>${a.label}: ${a.count}</title></path>`).join('')}
        <circle cx="${cx}" cy="${cy}" r="${r-2}" fill="#ffffff"/>
        <text x="${cx}" y="${cy-6}"  text-anchor="middle" fill="#0f172a" font-size="22" font-weight="900" font-family="Inter,sans-serif">${total}</text>
        <text x="${cx}" y="${cy+14}" text-anchor="middle" fill="#64748b" font-size="10" font-weight="600" font-family="Inter,sans-serif">Verified</text>
      </svg>
      <div class="donut-legend">${legend}</div>
    </div>
  `;
}

// ── Horizontal Bar Chart ──────────────────────────────────────
function buildBarChart(data) {
  if (data.length === 0) return `<p class="empty-msg">No data yet.</p>`;
  const maxPts = Math.max(...data.map(d => d.points), 1);

  return data.map((d, i) => {
    const pct = Math.round((d.points / maxPts) * 100);
    const shortDept = d.dept.split(' ').map(w => w[0]).join('').toUpperCase();
    const colors = ['#6d28d9','#2563eb','#059669','#d97706','#e11d48','#0891b2','#7c3aed','#ea580c'];
    const color = colors[i % colors.length];

    return `
      <div class="bar-row">
        <span class="bar-dept-label" title="${d.dept}">${shortDept}</span>
        <div class="bar-track">
          <div class="bar-fill" style="width:${pct}%;background:${color}">
            <span class="bar-fill-pts">${d.points}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ── Helpers for Registry & Leaderboard ────────────────────────
function getLeaderboard() {
  const map = {};
  STUDENTS.forEach(s => map[s.id] = { student:s, total:0, count:0 });
  ACHIEVEMENTS.filter(a => a.status === 'verified').forEach(a => {
    if (map[a.studentId]) {
      map[a.studentId].total += (a.points || 0);
      map[a.studentId].count += 1;
    }
  });
  return Object.values(map).sort((a,b) => b.total - a.total);
}

function buildRegistryRows(achs) {
  if (achs.length === 0) {
    return `<tr><td colspan="7" class="empty-msg" style="text-align:center">No records match criteria.</td></tr>`;
  }
  return achs.map(a => {
    const stu = getStudent(a.studentId) || { name:'Unknown', roll:'—', dept:'—' };
    const cat = CATEGORIES[a.category] || { label:a.category, icon:'🏅' };
    const lvl = LEVELS.find(l => l.id === a.level) || { label:a.level, badge:'—' };
    const sm  = statusMeta(a.status, a.autoVerified);

    return `
      <tr class="reg-row" onclick="navigateTo('profile','${a.studentId}')" style="cursor:pointer">
        <td>
          <div class="reg-student">
            <strong>${stu.name}</strong>
            <span class="reg-dept">${stu.roll} · ${stu.dept}</span>
          </div>
        </td>
        <td>
          <div class="reg-title" title="${a.title}">${a.title}</div>
          <small style="color:var(--txt-3)">${a.issuer || ''}</small>
        </td>
        <td><span>${cat.icon}</span> ${cat.label}</td>
        <td>${lvl.badge} ${lvl.label}</td>
        <td><strong class="reg-pts">+${a.points}</strong></td>
        <td><span class="${sm.cls}">${sm.label}</span></td>
        <td style="color:var(--txt-3)">${a.date}</td>
      </tr>
    `;
  }).join('');
}

function filterRegistry() {
  const cat    = document.getElementById('reg-cat')?.value;
  const status = document.getElementById('reg-status')?.value;
  const dept   = document.getElementById('reg-dept')?.value;

  const filtered = ACHIEVEMENTS.filter(a => {
    const stu = getStudent(a.studentId);
    if (cat && a.category !== cat) return false;
    if (status && a.status !== status) return false;
    if (dept && stu?.dept !== dept) return false;
    return true;
  });

  const tbody = document.getElementById('registry-body');
  if (tbody) tbody.innerHTML = buildRegistryRows(filtered);
}

function exportDashboardCSV() {
  const headers = ['Student Name', 'Roll No', 'Department', 'Achievement Title', 'Category', 'Level', 'Points', 'Status', 'Verified By', 'Date'];
  const rows = ACHIEVEMENTS.map(a => {
    const stu = getStudent(a.studentId) || {};
    return [
      `"${stu.name || ''}"`,
      `"${stu.roll || ''}"`,
      `"${stu.dept || ''}"`,
      `"${a.title || ''}"`,
      `"${a.category || ''}"`,
      `"${a.level || ''}"`,
      a.points || 0,
      `"${a.status || ''}"`,
      `"${a.verifiedBy || ''}"`,
      `"${a.date || ''}"`
    ].join(',');
  });

  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type:'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `Vignan_NAAC_Student_Achievements_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('NAAC Criteria 5.3 SSR CSV Exported!', 'success');
}
