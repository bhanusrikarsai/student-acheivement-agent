// ============================================================
//  profile.js — Student Profile View & Agent 44 Integration
// ============================================================

function renderProfileView(studentId) {
  const stu  = getStudent(studentId || (APP_STATE.currentStudent && APP_STATE.currentStudent.id) || STUDENTS[0].id);
  const achs = getAchievements(stu.id);
  const totalScore = getTotalScore(stu.id);
  const verified   = achs.filter(a => a.status === 'verified');
  const pending    = achs.filter(a => a.status === 'pending');
  const radarData  = getRadarData(stu.id);

  // Compute badge tier
  const tier = totalScore >= 300 ? { label:'Platinum 🏆', cls:'tier-platinum' }
             : totalScore >= 200 ? { label:'Gold 🥇',     cls:'tier-gold' }
             : totalScore >= 100 ? { label:'Silver 🥈',   cls:'tier-silver' }
             : totalScore >= 50  ? { label:'Bronze 🥉',   cls:'tier-bronze' }
                                 : { label:'Emerging 🌱', cls:'tier-emerging' };

  return `
  <div class="view-header">
    <div>
      <h1 class="view-title">Student Achievement Profile</h1>
      <p class="view-sub">Comprehensive portfolio synchronized in real-time with <strong>Agent 44 Central Profile</strong>.</p>
    </div>
    <div class="profile-btns">
      <button class="btn-ghost" onclick="navigateTo('cv')">📄 Export CV (PDF)</button>
      ${APP_STATE.role !== 'student' ? `
        <select class="form-input" id="student-selector" style="width:230px" onchange="navigateTo('profile',this.value)">
          ${STUDENTS.map(s => `<option value="${s.id}" ${s.id===stu.id?'selected':''}>${s.name} (${s.roll})</option>`).join('')}
        </select>
      ` : ''}
    </div>
  </div>

  <div class="profile-layout">
    <!-- Profile Header Card -->
    <div class="glass card profile-hero">
      <div class="profile-hero-bg"></div>
      <div class="profile-hero-content">
        <div class="profile-avatar-wrap">
          <div class="profile-avatar">${stu.avatar}</div>
          <div class="profile-tier ${tier.cls}">${tier.label}</div>
        </div>
        <div class="profile-info">
          <h2 class="profile-name">${stu.name}</h2>
          <div class="profile-meta-row">
            <span class="profile-meta-item">🎓 <strong>Roll:</strong> ${stu.roll}</span>
            <span class="profile-meta-item">🏛️ <strong>Dept:</strong> ${stu.dept}</span>
            <span class="profile-meta-item">📅 <strong>Batch:</strong> ${stu.batch}</span>
            <span class="profile-meta-item">⭐ <strong>CGPA:</strong> ${stu.cgpa}</span>
          </div>
          <div class="profile-score-row">
            <div class="score-pill">
              <span class="score-num" style="color:var(--purple-l)">${totalScore}</span>
              <span class="score-label">Verified Pts</span>
            </div>
            <div class="score-pill">
              <span class="score-num" style="color:var(--emerald)">${verified.length}</span>
              <span class="score-label">Verified</span>
            </div>
            <div class="score-pill">
              <span class="score-num" style="color:var(--blue)">${pending.length}</span>
              <span class="score-label">Pending</span>
            </div>
            <div class="score-pill">
              <span class="score-num">${Object.keys(CATEGORIES).filter(c => achs.some(a=>a.category===c)).length}</span>
              <span class="score-label">Categories</span>
            </div>
          </div>
        </div>
        <div class="profile-sync-badge">
          <span class="agent-dot pulse"></span>
          <span>Synced with <strong>Agent 44</strong></span>
        </div>
      </div>
    </div>

    <div class="profile-body">
      <!-- Left: Charts & Categories -->
      <div class="profile-left">
        <!-- Radar Chart -->
        <div class="glass card">
          <h3 class="card-title">Accomplishment Radar (6 Dimensions)</h3>
          <div class="radar-container">
            ${buildRadarSVG(radarData)}
          </div>
          <div class="radar-legend">
            ${radarData.map(d => `
              <div class="radar-leg-item">
                <span class="radar-leg-dot" style="background:var(--purple-l)"></span>
                <span>${d.axis.charAt(0).toUpperCase()+d.axis.slice(1)}</span>
                <span class="radar-leg-val">${d.score} pts</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Category Breakdown -->
        <div class="glass card" style="margin-top:1rem">
          <h3 class="card-title">Rubric Distribution by Category</h3>
          <div class="cat-breakdown">
            ${Object.entries(CATEGORIES).map(([key,cat]) => {
              const catAchs = achs.filter(a => a.category === key && a.status === 'verified');
              const catScore = catAchs.reduce((s,a)=>s+a.points,0);
              if (catScore === 0 && catAchs.length === 0) return '';
              return `
                <div class="cat-bar-item">
                  <div class="cat-bar-header">
                    <span>${cat.icon} ${cat.label}</span>
                    <span style="color:${cat.color}"><strong>${catScore}</strong> pts</span>
                  </div>
                  <div class="cat-bar-track">
                    <div class="cat-bar-fill" style="width:${Math.min(100, Math.round((catScore/300)*100))}%; background:${cat.gradient}"></div>
                  </div>
                  <div class="cat-bar-sub">${catAchs.length} verified accomplishment${catAchs.length>1?'s':''}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- Right: Timeline -->
      <div class="profile-right">
        <div class="glass card">
          <div class="timeline-header">
            <h3 class="card-title">Achievement Timeline & Records</h3>
            <div class="filter-tabs" id="timeline-filter">
              <button class="filter-tab active" onclick="filterTimeline('all',this)">All</button>
              <button class="filter-tab" onclick="filterTimeline('verified',this)">Verified</button>
              <button class="filter-tab" onclick="filterTimeline('pending',this)">Pending</button>
            </div>
          </div>
          <div class="timeline" id="timeline">
            ${renderTimeline(achs)}
          </div>
        </div>
      </div>
    </div>
  </div>
  `;
}

// ── Radar SVG (Crisp for White UI) ────────────────────────────
function buildRadarSVG(data) {
  const cx = 150, cy = 150, r = 105;
  const n = data.length;
  const angles = data.map((_,i) => (i * 2 * Math.PI / n) - Math.PI / 2);

  // Grid circles
  const gridLevels = [0.25, 0.5, 0.75, 1.0];
  const gridCircles = gridLevels.map(lvl => {
    const pts = angles.map(a => [cx + r*lvl*Math.cos(a), cy + r*lvl*Math.sin(a)]);
    return `<polygon points="${pts.map(p=>p.join(',')).join(' ')}" fill="none" stroke="#e2e8f0" stroke-width="1.2"/>`;
  }).join('');

  // Axes & Labels
  const axes = angles.map((a, i) => {
    const x = cx + r * Math.cos(a);
    const y = cy + r * Math.sin(a);
    const lx = cx + (r + 22) * Math.cos(a);
    const ly = cy + (r + 22) * Math.sin(a);
    const labels = ['Technical','Sports','Cultural','Research','Entrepr.','Social'];
    return `
      <line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#cbd5e1" stroke-width="1.2"/>
      <text x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="middle" fill="#475569" font-size="10" font-weight="600" font-family="Inter,sans-serif">${labels[i]||''}</text>
    `;
  }).join('');

  // Data polygon
  const dataPts = data.map((d,i) => {
    const pct = Math.max(0.1, d.pct / 100);
    return [cx + r * pct * Math.cos(angles[i]), cy + r * pct * Math.sin(angles[i])];
  });
  const polygon = `<polygon points="${dataPts.map(p=>p.join(',')).join(' ')}"
    fill="rgba(109,40,217,0.18)" stroke="#6d28d9" stroke-width="2.5"
    stroke-linejoin="round"/>`;

  // Data points
  const dots = dataPts.map((p,i) => `
    <circle cx="${p[0]}" cy="${p[1]}" r="4.5" fill="#6d28d9" stroke="#ffffff" stroke-width="2"/>
    <title>${data[i].axis}: ${data[i].score} pts (${data[i].pct}%)</title>
  `).join('');

  return `
    <svg width="300" height="300" viewBox="0 0 300 300" class="radar-svg">
      ${gridCircles}
      ${axes}
      ${polygon}
      ${dots}
    </svg>
  `;
}

// ── Timeline ───────────────────────────────────────────────────
function renderTimeline(achs, filter = 'all') {
  const sorted = [...achs]
    .filter(a => filter === 'all' || a.status === filter)
    .sort((a,b) => new Date(b.date) - new Date(a.date));

  if (sorted.length === 0) return `<p class="empty-msg">No achievements match this filter.</p>`;

  return sorted.map(a => {
    const cat = CATEGORIES[a.category] || { icon:'🏅', color:'#888', label:a.category };
    const sm  = statusMeta(a.status, a.autoVerified);
    const lvl = LEVELS.find(l => l.id === a.level) || { badge:'—', label:a.level };
    return `
      <div class="timeline-item" data-status="${a.status}">
        <div class="timeline-dot" style="border-color:${cat.color}40;color:${cat.color}">
          <span>${cat.icon}</span>
        </div>
        <div class="timeline-content">
          <div class="tl-top">
            <span class="tl-cat" style="color:${cat.color}">${cat.label}</span>
            <span class="${sm.cls}">${sm.label}</span>
          </div>
          <div class="tl-title">${a.title}</div>
          <div class="tl-meta">
            <span><strong>Level:</strong> ${lvl.badge} ${lvl.label}</span>
            <span><strong>Issuer:</strong> ${a.issuer || '—'}</span>
            <span><strong>Date:</strong> ${a.date}</span>
            <span class="tl-pts">+${a.points} pts</span>
          </div>
          ${a.description ? `<p class="tl-desc">${a.description}</p>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function filterTimeline(filter, btn) {
  document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const stu  = APP_STATE.currentStudent || STUDENTS[0];
  const achs = getAchievements(stu.id);
  const el   = document.getElementById('timeline');
  if (el) el.innerHTML = renderTimeline(achs, filter);
}

// ── Agent 44 Hook ─────────────────────────────────────────────
function updateStudentProfile(studentId) {
  console.log(`[Agent 44] Student Central Profile updated for ${studentId}`);
}
