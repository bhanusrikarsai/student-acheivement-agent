// ============================================================
//  faculty.js — Agent 48: Student Achievement Agent (Faculty Hub)
//  Full Faculty View Matching University Requirements & Document
// ============================================================

let CURRENT_FACULTY_TAB = 'verify'; // 'verify' | 'inputs' | 'aggregates' | 'recognition' | 'gaps' | 'archive' | 'profile' | 'rubric'

// ── 8 Faculty Activity Header Tabs (Matching Specification) ─
const FACULTY_TABS = [
  { id: 'verify',      label: 'Verification & Rubric Queue',     icon: '⚖️', badge: 'Queue Active' },
  { id: 'inputs',      label: 'Multi-Source Inputs (7 Streams)',   icon: '📥', badge: '7 Channels' },
  { id: 'aggregates',  label: 'Dept & Batch Aggregates',         icon: '📊', badge: 'NAAC 5.3' },
  { id: 'recognition', label: 'Agent 13 Recognition Roster',     icon: '🌟', badge: 'Awards' },
  { id: 'gaps',        label: 'Participation Gap Analysis',      icon: '🚨', badge: 'Student Affairs' },
  { id: 'archive',     label: 'Evidence Archive Vault',          icon: '🗄️', badge: 'Indexed SHA-256' },
  { id: 'profile',     label: 'Agent 44 Central Sync & CVs',     icon: '👤', badge: 'Live CV' },
  { id: 'rubric',      label: 'Institutional Rubric Matrix',     icon: '📑', badge: '10 Tiers' }
];

function renderFacultyDashboardView() {
  const pendingCount = ACHIEVEMENTS.filter(a => a.status === 'pending').length;
  const verifiedCount = ACHIEVEMENTS.filter(a => a.status === 'verified').length;
  const totalCount = ACHIEVEMENTS.length;
  const verificationEfficiency = totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) : 85;

  const totalInstitutionalWeight = ACHIEVEMENTS
    .filter(a => a.status === 'verified')
    .reduce((sum, a) => sum + (a.points || 0), 0);

  return `
  <!-- ╔══════════════════════════════════════════════════════════╗
       ║  FACULTY HERO: AGENT 48 DOCUMENT CONDITIONS & IDENTITY   ║
       ╚══════════════════════════════════════════════════════════╝ -->
  <div class="agent-hero glass" style="margin-bottom:1.5rem">
    <div class="hero-left">
      <div class="hero-badge-row">
        <span class="hero-tag">Agent 48 · Student Achievement Agent</span>
        <span class="accred-pill naac">NAAC SSR Criteria 5.3</span>
        <span class="accred-pill nirf">NIRF #75 Weightage</span>
        <span class="accred-pill nba">NBA Tier 1 Criteria 9</span>
      </div>

      <h1 class="hero-title">Faculty Verifier & Accreditation Intelligence Hub</h1>

      <p class="hero-desc">
        <strong>Purpose:</strong> Captures the full range of student accomplishment outside formal coursework,
        carrying substantial institutional ranking and accreditation weight across NAAC SSR, NIRF #75, and NBA Criteria.
      </p>

      <!-- Multi-User Perspective Pill -->
      <div class="hero-meta-grid">
        <div class="hero-meta-item">
          <span class="meta-label">PRIMARY USERS:</span>
          <span class="meta-val">Students · Heads of Dept (HoD) · Student Affairs · Placement Cell · IQAC</span>
        </div>
        <div class="hero-meta-item">
          <span class="meta-label">AGENT ECOSYSTEM:</span>
          <span class="meta-val">Consumes: <strong>Agents 64, 68</strong> ➔ Feeds: <strong>Agents 9, 13, 44, 49, 57, 71</strong></span>
        </div>
      </div>
    </div>

    <div class="hero-right">
      <div class="hero-iqac-seal glass-sm">
        <div class="seal-icon-wrap">
          <span class="seal-emoji">🏛️</span>
        </div>
        <div class="seal-text-wrap">
          <span class="seal-heading">IQAC PEER PORTAL</span>
          <span class="seal-sub">NAAC 'A+' · NIRF Top 75</span>
          <span class="seal-live-tag"><span class="agent-dot pulse"></span> LIVE ACCREDITATION GATE</span>
        </div>
      </div>
    </div>
  </div>

  <!-- ╔══════════════════════════════════════════════════════════╗
       ║  8 FACULTY ACTIVITY HEADER TABS (PARALLEL TO STUDENT)   ║
       ╚══════════════════════════════════════════════════════════╝ -->
  <div class="activity-tabs-container glass">
    <div class="activity-tabs-scroll" id="faculty-activity-tabs">
      ${FACULTY_TABS.map(tab => `
        <div class="activity-tab-item ${CURRENT_FACULTY_TAB === tab.id ? 'active' : ''}"
             id="ftab-${tab.id}"
             onclick="switchFacultyTab('${tab.id}')">
          <span class="activity-tab-icon">${tab.icon}</span>
          <span class="activity-tab-text">${tab.label}</span>
          ${tab.id === 'verify' && pendingCount > 0 ? `<span class="activity-tab-badge">${pendingCount}</span>` : ''}
        </div>
      `).join('')}
    </div>
  </div>

  <!-- ╔══════════════════════════════════════════════════════════╗
       ║  FACULTY REVIEW SCOPE SUB-BAR                            ║
       ╚══════════════════════════════════════════════════════════╝ -->
  <div class="academic-year-row glass">
    <div class="academic-year-pill glass-sm">
      <span>📅</span>
      <span>Faculty Review Scope: <strong>Year 3 & 4 Active Verifier Queue</strong></span>
    </div>

    <div class="academic-actions">
      <button class="academic-action-btn purple" onclick="openFacultyNominationModal()">
        <span>+</span> Nominate Student (Input #3)
      </button>
      <button class="academic-action-btn blue" onclick="openOrganiserReportModal()">
        <span>📥</span> Import Organiser Report (Input #2)
      </button>
      <button class="academic-action-btn amber" onclick="autoVerifyAll()">
        <span>⚡</span> Auto-Verify Whitelisted
      </button>
      <button class="academic-action-btn rose" onclick="switchFacultyTab('gaps')">
        <span>🚨</span> Route Gaps to Student Affairs
      </button>
      <button class="academic-action-btn emerald" onclick="exportDashboardCSV()">
        <span>📑</span> Export NAAC SSR (CSV)
      </button>
    </div>
  </div>

  <!-- ╔══════════════════════════════════════════════════════════╗
       ║  3 FACULTY SCORE & ACCREDITATION METRIC CARDS            ║
       ╚══════════════════════════════════════════════════════════╝ -->
  <div class="score-cap-grid">
    <!-- Card 1: Verification Progress (Dark Navy Frosted Glass Card) -->
    <div class="card-navy glass">
      <div class="card-navy-header">
        <span class="card-navy-badge">WORKFLOW STEP 3</span>
        <span class="card-navy-chip">NAAC Peer Audit Ready</span>
      </div>
      <div class="card-navy-title">FACULTY VERIFICATION EFFICIENCY</div>
      <div class="card-navy-score">
        ${verificationEfficiency}% <span class="card-navy-score-sub">(${verifiedCount} / ${totalCount} Verified)</span>
      </div>

      <div class="card-navy-progress-bg">
        <div class="card-navy-progress-fill" style="width: ${verificationEfficiency}%"></div>
      </div>

      <div class="card-navy-footer">
        <span>⏳ ${pendingCount} claims awaiting faculty verification</span>
        <span style="color:#34d399;font-weight:700">✓ Agent 64 Whitelist Active</span>
      </div>
    </div>

    <!-- Card 2: Total Accredited Weight -->
    <div class="card-white glass">
      <div class="card-white-title">TOTAL ACCREDITED INSTITUTIONAL WEIGHT</div>
      <div class="card-white-value">
        ${totalInstitutionalWeight} <span class="card-white-unit">pts</span>
      </div>
      <div class="card-white-sub">
        Aggregated across 5 academic departments for NAAC Criteria 5.3, NIRF Rank #75, and NBA Criteria 9 submissions.
      </div>
    </div>

    <!-- Card 3: Agent 48 Ecosystem Architecture -->
    <div class="card-white glass">
      <div class="card-white-title">AGENT 48 ECOSYSTEM ARCHITECTURE</div>
      <div class="card-cap-pill-row" style="margin-top:.6rem">
        <span class="cap-pill blue">
          📥 Consumes: Agents 64, 68
        </span>
        <span class="cap-pill purple">
          📤 Feeds: Agents 9, 13, 44, 49, 57, 71
        </span>
      </div>
      <div class="card-white-sub" style="margin-top:.85rem">
        <strong>Inputs:</strong> 7 Multi-Source Channels Active · <strong>Evidence Archive:</strong> 100% SHA-256 Indexed & Peer-Review Retrievable.
      </div>
    </div>
  </div>

  <!-- ╔══════════════════════════════════════════════════════════╗
       ║  ACTIVE FACULTY TAB CONTENT VIEWPORT                     ║
       ╚══════════════════════════════════════════════════════════╝ -->
  <div id="faculty-tab-content" style="margin-top:1.5rem">
    ${renderCurrentFacultyTabContent()}
  </div>
  `;
}

function switchFacultyTab(tabId) {
  CURRENT_FACULTY_TAB = tabId;
  document.querySelectorAll('.activity-tab-item').forEach(el => {
    el.classList.toggle('active', el.id === `ftab-${tabId}`);
  });
  const container = document.getElementById('faculty-tab-content');
  if (container) {
    container.style.opacity = '0';
    setTimeout(() => {
      container.innerHTML = renderCurrentFacultyTabContent();
      container.style.transition = 'opacity 0.2s ease';
      container.style.opacity = '1';
    }, 100);
  }
}

function renderCurrentFacultyTabContent() {
  switch (CURRENT_FACULTY_TAB) {
    case 'verify':      return renderFacultyVerificationTab();
    case 'inputs':      return renderFacultyInputsTab();
    case 'aggregates':  return renderFacultyAggregatesTab();
    case 'recognition': return renderFacultyRecognitionTab();
    case 'gaps':        return renderFacultyGapsTab();
    case 'archive':     return renderFacultyArchiveTab();
    case 'profile':     return renderFacultyProfileTab();
    case 'rubric':      return renderFacultyRubricTab();
    default:            return renderFacultyVerificationTab();
  }
}

// ── Tab 1: Verification Queue (Workflow 3 & 4) ────────────────
function renderFacultyVerificationTab() {
  const pending  = ACHIEVEMENTS.filter(a => a.status === 'pending');
  const verified = ACHIEVEMENTS.filter(a => a.status === 'verified' || a.status === 'approved');
  const rejected = ACHIEVEMENTS.filter(a => a.status === 'rejected');

  return `
  <div class="glass-purpose-strip amber">
    <span class="purpose-strip-icon">⚖️</span>
    <div class="purpose-strip-text">
      <strong>Workflow Step 3 Compliance Directive:</strong>
      All student certificate submissions automatically route here to the Faculty Verifier Queue.
      Faculty must evaluate and approve or reject each submission before points are accredited to NAAC Criteria 5.3.
    </div>
  </div>

  <!-- Real-time Verification Stat Counters (Pending, Approved, Rejected) -->
  <div class="verify-stats" style="margin-bottom:1.25rem">
    <div class="vstat pending-stat"><span>${pending.length}</span> Awaiting Review</div>
    <div class="vstat verified-stat"><span>${verified.length}</span> Approved & Verified</div>
    <div class="vstat rejected-stat"><span>${rejected.length}</span> Rejected Records</div>
  </div>

  <div class="verify-layout">
    <div class="verify-main">
      <!-- Section 1: Pending Submissions -->
      <div class="section-head">
        <h2 class="section-title">⏳ Awaiting Faculty Verification (${pending.length})</h2>
      </div>

      ${pending.length === 0 ? `
        <div class="empty-queue glass card">
          <div class="empty-icon">🎉</div>
          <h3>All Caught Up!</h3>
          <p>No achievements are currently pending faculty review. Any certificate submitted by a student will immediately appear here.</p>
        </div>
      ` : pending.map(a => (typeof window !== 'undefined' && typeof window.renderVerifyCard === 'function' ? window.renderVerifyCard(a, true) : '')).join('')}

      <!-- Section 2: Approved & Verified Records -->
      <div class="section-head" style="margin-top:2.25rem">
        <h2 class="section-title">✅ Approved & Verified Records (${verified.length})</h2>
      </div>
      ${verified.length === 0 ? `
        <div class="empty-queue glass card" style="padding:1.25rem">
          <p style="color:var(--txt-3);font-size:.85rem">No approved achievements yet. Once faculty clicks "Accept & Award", records appear here.</p>
        </div>
      ` : verified.map(a => (typeof window !== 'undefined' && typeof window.renderVerifyCard === 'function' ? window.renderVerifyCard(a, false) : '')).join('')}

      <!-- Section 3: Rejected Submissions -->
      <div class="section-head" style="margin-top:2.25rem">
        <h2 class="section-title">❌ Rejected Submissions (${rejected.length})</h2>
      </div>
      ${rejected.length === 0 ? `
        <div class="empty-queue glass card" style="padding:1.25rem">
          <p style="color:var(--txt-3);font-size:.85rem">No rejected submissions.</p>
        </div>
      ` : rejected.map(a => (typeof window !== 'undefined' && typeof window.renderVerifyCard === 'function' ? window.renderVerifyCard(a, false) : '')).join('')}
    </div>

    <!-- Sidebar Whitelist & Protocol -->
    <aside class="verify-sidebar">
      <div class="glass card">
        <h3 class="sidebar-title">🔍 Issuing Authority Whitelist</h3>
        <p class="sidebar-sub">Check if an organization is recognized for automated verification.</p>
        <div class="issuer-search">
          <input id="issuer-check-input" type="text" class="form-input" placeholder="e.g., Google, IEEE, AICTE" oninput="checkIssuer()">
        </div>
        <div class="issuer-result" id="issuer-result"></div>
        <div class="known-issuers-list">
          <div class="sidebar-sub" style="margin-bottom:.5rem;font-weight:700">Pre-authenticated Bodies:</div>
          ${KNOWN_ISSUERS.slice(0,16).map(i => `<span class="issuer-tag">${i}</span>`).join('')}
        </div>
      </div>

      <div class="glass card" style="margin-top:1.25rem">
        <h3 class="sidebar-title">📋 Verifier Actions Protocol</h3>
        <ul class="guide-list">
          <li>👁️ <strong>Check Certificate Doc Fast:</strong> Instant inspection of digital seal and credential hash.</li>
          <li>✓ <strong>Accept:</strong> Confirms authenticity, calculates rubric marks, and syncs to Agent 44.</li>
          <li>✗ <strong>Reject:</strong> Disapproves invalid claims with automated feedback to student.</li>
        </ul>
      </div>
    </aside>
  </div>
  `;
}

// ── Tab 2: Multi-Source Inputs (7 Streams) ────────────────────
function renderFacultyInputsTab() {
  return `
  <div class="glass-purpose-strip blue">
    <span class="purpose-strip-icon">📥</span>
    <div class="purpose-strip-text">
      <strong>Agent 48 Inputs Specification:</strong>
      Captures outside-coursework records across 7 discrete streams: Student submissions with proof, Event organiser reports,
      Faculty nominations, Competition & Hackathon results, Sports and Cultural records, Agent 68 certification data, and Publication records.
    </div>
  </div>

  <div class="inputs-grid">
    ${MULTI_INPUT_STREAMS.map(s => `
      <div class="glass card input-stream-card" style="border-top:4px solid ${s.color}">
        <div class="input-card-top">
          <div class="input-card-brand">
            <span class="input-stream-icon">${s.icon}</span>
            <div>
              <div class="input-channel-tag" style="color:${s.color}">INPUT CHANNEL #${s.num}</div>
              <h3 class="input-stream-title">${s.title}</h3>
            </div>
          </div>
          <span class="badge" style="background:${s.color}15;color:${s.color};border:1px solid ${s.color}35">${s.badge}</span>
        </div>

        <p class="input-stream-desc">
          ${s.desc}
        </p>

        <div class="input-card-footer">
          <span class="input-count-stat">
            <strong>${s.count}</strong> Active Records
          </span>
          <button class="btn-tiny glass-btn" onclick="handleInputChannelAction('${s.id}')">
            Manage Channel ➔
          </button>
        </div>
      </div>
    `).join('')}
  </div>
  `;
}

function handleInputChannelAction(channelId) {
  if (channelId === 'stream_faculty') {
    openFacultyNominationModal();
  } else if (channelId === 'stream_organiser') {
    openOrganiserReportModal();
  } else if (channelId === 'stream_student') {
    switchFacultyTab('verify');
    showToast('Viewing student-submitted claims awaiting faculty verification', 'info');
  } else {
    showToast(`Channel active: ${channelId}. Data synced with Agent 48 Central Registry.`, 'info');
  }
}

// ── Tab 3: Dept & Batch Aggregates (Workflow 6) ───────────────
function renderFacultyAggregatesTab() {
  const deptStats = getDeptStats();
  const catDist   = getCategoryDistribution();

  return `
  <div class="glass-purpose-strip emerald">
    <span class="purpose-strip-icon">📊</span>
    <div class="purpose-strip-text">
      <strong>Workflow Step 6 Specification:</strong>
      Aggregate by department, batch, and category, and generate the achievement statistics required for accreditation and ranking submissions (NAAC SSR Criteria 5.3 & NIRF).
    </div>
  </div>

  <div class="charts-row">
    <div class="glass card chart-card chart-wide">
      <h3 class="card-title">Department-wise Achievement Scores (NAAC 5.3)</h3>
      <div class="bar-chart-wrap" style="margin-top:1rem">
        ${buildBarChart(deptStats)}
      </div>
    </div>

    <div class="glass card chart-card">
      <h3 class="card-title">10 Category Distribution</h3>
      <div class="donut-wrap" style="margin-top:.5rem">
        ${buildDonutChart(catDist)}
      </div>
    </div>
  </div>

  <!-- Detailed Department Aggregates Table -->
  <div class="glass card" style="margin-top:1.5rem">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;flex-wrap:wrap;gap:.75rem">
      <div>
        <h3 class="card-title">Departmental & Batch Summary Roster</h3>
        <p style="font-size:.78rem;color:var(--txt-3)">Official aggregates prepared for IQAC committee review</p>
      </div>
      <button class="btn-sm btn-ghost" onclick="exportDashboardCSV()">📥 Download NAAC SSR Criteria 5.3 CSV</button>
    </div>

    <div class="registry-table-wrap">
      <table class="registry-table">
        <thead>
          <tr>
            <th>Academic Department</th>
            <th>Batch / Year</th>
            <th>Verified Records</th>
            <th>Total Rubric Points</th>
            <th>Top Activity</th>
            <th>NAAC Status</th>
          </tr>
        </thead>
        <tbody>
          ${deptStats.map(d => `
            <tr>
              <td><strong>${d.dept}</strong></td>
              <td>Batch 2021-25 (Year 3)</td>
              <td><span class="badge-verified">${d.count} verified</span></td>
              <td><strong style="color:var(--purple);font-size:.95rem">${d.points} pts</strong></td>
              <td>${d.topCat ? `${CATEGORIES[d.topCat]?.icon||'🏅'} ${CATEGORIES[d.topCat]?.label||d.topCat}` : 'General Tech'}</td>
              <td><span class="accred-pill naac">SSR Validated</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>
  `;
}

// ── Tab 4: Agent 13 Recognition Roster (Workflow 7) ───────────
function renderFacultyRecognitionTab() {
  return `
  <div class="glass-purpose-strip gold">
    <span class="purpose-strip-icon">🌟</span>
    <div class="purpose-strip-text">
      <strong>Workflow Step 7 Specification:</strong>
      Identify high-achieving students for recognition and for <strong>Agent 13 (University Awards & Honors Committee)</strong>.
      Top achievers are automatically selected based on institutional rubric weight and national accolades.
    </div>
  </div>

  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;flex-wrap:wrap;gap:.75rem">
    <div>
      <h2 style="font-size:1.15rem;font-weight:900;color:var(--txt-1)">Candidate Honor Roll (Dean's List & Medals)</h2>
      <p style="font-size:.82rem;color:var(--txt-3)">Shortlisted for Chancellor's Gold Medal, Dean's Honors, and Agent 13 Grants</p>
    </div>
    <button class="academic-action-btn emerald" onclick="pushAllToAgent13()">
      🚀 Dispatch All Candidates to Agent 13
    </button>
  </div>

  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:1.25rem">
    ${AGENT13_RECOGNITIONS.map(r => `
      <div class="glass card recognition-card">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:.75rem">
          <div>
            <span class="badge-honor-tag">
              ${r.honorTag}
            </span>
            <h3 style="font-size:1.05rem;font-weight:900;color:var(--txt-1)">${r.name}</h3>
            <div style="font-size:.8rem;color:var(--txt-3)">${r.roll} · ${r.dept} (${r.year})</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:1.35rem;font-weight:900;color:var(--purple)">${r.totalPts}</div>
            <div style="font-size:.65rem;color:var(--txt-3);text-transform:uppercase;font-weight:800">Rubric Pts</div>
          </div>
        </div>

        <div class="recognition-basis-box">
          <div style="font-size:.72rem;font-weight:700;color:#64748b">PRIMARY RECOGNITION BASIS:</div>
          <div style="font-size:.84rem;font-weight:700;color:#0f172a;margin-top:.2rem">${r.topAchievement}</div>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;padding-top:.75rem;border-top:1px solid rgba(226, 232, 240, 0.7)">
          <span style="font-size:.78rem;font-weight:700;color:#059669">🎖️ ${r.awardPill}</span>
          ${r.syncedToAgent13 ? `
            <span class="badge-verified" style="font-size:.72rem">✓ Synced to Agent 13</span>
          ` : `
            <button class="btn-tiny" onclick="showToast('Candidate synced to Agent 13 database','success')" style="background:#2563eb;color:#fff;border:none;cursor:pointer;border-radius:6px">
              Sync to Agent 13
            </button>
          `}
        </div>
      </div>
    `).join('')}
  </div>
  `;
}

// ── Tab 5: Participation Gap Analysis (Workflow 8) ────────────
function renderFacultyGapsTab() {
  return `
  <div class="glass-purpose-strip rose">
    <span class="purpose-strip-icon">🚨</span>
    <div class="purpose-strip-text">
      <strong>Workflow Step 8 Specification:</strong>
      Identify participation gaps, for example departments or batches with negligible participation in a category,
      and route to <strong>Student Affairs</strong> for remediation.
    </div>
  </div>

  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;flex-wrap:wrap;gap:.75rem">
    <div>
      <h2 style="font-size:1.15rem;font-weight:900;color:var(--txt-1)">Flagged Departmental Participation Gaps</h2>
      <p style="font-size:.82rem;color:var(--txt-3)">Automated anomaly detection across batches and outside-coursework categories</p>
    </div>
    <span class="hero-tag" style="background:#ffe4e6;color:#be123c;border:1px solid #fecdd3">
      ${PARTICIPATION_GAPS.filter(g => !g.routedToStudentAffairs).length} Unrouted Gaps Flagged
    </span>
  </div>

  <div class="gap-list" style="display:flex;flex-direction:column;gap:1rem">
    ${PARTICIPATION_GAPS.map(gap => `
      <div class="glass card gap-item-card" style="border-left:5px solid ${gap.severity==='Critical Gap'?'#e11d48':'#d97706'}">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:.75rem">
          <div>
            <div style="display:flex;align-items:center;gap:.6rem;margin-bottom:.3rem">
              <span class="badge" style="background:${gap.severity==='Critical Gap'?'#fee2e2':'#fef3c7'};color:${gap.severity==='Critical Gap'?'#991b1b':'#92400e'};font-weight:800;border:1px solid ${gap.severity==='Critical Gap'?'#fecaca':'#fde68a'}">
                ${gap.severity}
              </span>
              <span style="font-size:.82rem;color:var(--txt-3)">Flagged on: ${gap.dateFlagged}</span>
            </div>
            <h3 style="font-size:1.05rem;font-weight:800;color:var(--txt-1)">
              ${gap.dept} — ${gap.batch}
            </h3>
            <p style="font-size:.84rem;color:var(--txt-2);margin-top:.3rem">
              <strong>Category:</strong> ${CATEGORIES[gap.category]?.icon||'🏅'} ${CATEGORIES[gap.category]?.label || gap.category} ·
              Participation Rate: <span style="color:#e11d48;font-weight:800">${gap.participationRate}</span>
            </p>
            <p style="font-size:.82rem;color:#64748b;margin-top:.2rem">${gap.details}</p>
          </div>

          <div style="text-align:right">
            <div style="font-size:.78rem;font-weight:700;color:var(--txt-3);margin-bottom:.4rem">Recommended Remediation:</div>
            <div class="gap-remediation-box">
              ${gap.actionNeeded}
            </div>

            ${gap.routedToStudentAffairs ? `
              <span class="badge-verified">✓ Routed to Student Affairs Office</span>
            ` : `
              <button class="academic-action-btn rose" onclick="routeGapToStudentAffairs('${gap.id}'); switchFacultyTab('gaps');">
                🚨 Route to Student Affairs
              </button>
            `}
          </div>
        </div>
      </div>
    `).join('')}
  </div>
  `;
}

// ── Tab 6: Evidence Archive (Workflow 9) ───────────────────────
function renderFacultyArchiveTab() {
  return `
  <div class="glass-purpose-strip purple">
    <span class="purpose-strip-icon">🗄️</span>
    <div class="purpose-strip-text">
      <strong>Workflow Step 9 Specification:</strong>
      Maintain the evidence archive with certificates indexed and retrievable.
      Every verified accomplishment is cryptographically indexed with SHA-256 hashes and issuing body tokens for peer accreditation reviews.
    </div>
  </div>

  <div class="glass card">
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;margin-bottom:1.25rem">
      <div>
        <h2 style="font-size:1.15rem;font-weight:900;color:var(--txt-1)">Central Evidence Archive Registry</h2>
        <p style="font-size:.82rem;color:var(--txt-3)">Search and retrieve digital proofs across all batches</p>
      </div>
      <div style="display:flex;gap:.6rem;align-items:center">
        <input type="text" id="archive-search-box" class="form-input" placeholder="Search by student, token, or issuer..." style="width:260px" oninput="searchArchiveTable()">
      </div>
    </div>

    <div class="registry-table-wrap">
      <table class="registry-table" id="archive-table">
        <thead>
          <tr>
            <th>Document Token</th>
            <th>Student</th>
            <th>Achievement Title</th>
            <th>Category</th>
            <th>Issuing Body</th>
            <th>SHA-256 Hash</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody id="archive-table-body">
          ${EVIDENCE_ARCHIVE.map(e => `
            <tr>
              <td><span class="mono-token">${e.docId}</span></td>
              <td><strong>${e.studentName}</strong><br><small style="color:var(--txt-3)">${e.roll} · ${e.dept}</small></td>
              <td>${e.title}</td>
              <td>${CATEGORIES[e.category]?.icon||'🏅'} ${CATEGORIES[e.category]?.label||e.category}</td>
              <td>${e.issuer}</td>
              <td><span class="mono-hash">${e.credentialHash.substring(0,18)}...</span></td>
              <td>
                <button class="btn-tiny glass-btn" onclick="checkCertificateDocFast('${e.achId}')">
                  👁️ Inspect Fast
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>
  `;
}

function searchArchiveTable() {
  const query = document.getElementById('archive-search-box')?.value.toLowerCase() || '';
  const tbody = document.getElementById('archive-table-body');
  if (!tbody) return;

  const filtered = EVIDENCE_ARCHIVE.filter(e =>
    e.studentName.toLowerCase().includes(query) ||
    e.docId.toLowerCase().includes(query) ||
    e.issuer.toLowerCase().includes(query) ||
    e.title.toLowerCase().includes(query) ||
    e.roll.toLowerCase().includes(query)
  );

  tbody.innerHTML = filtered.map(e => `
    <tr>
      <td><span class="mono-token">${e.docId}</span></td>
      <td><strong>${e.studentName}</strong><br><small style="color:var(--txt-3)">${e.roll} · ${e.dept}</small></td>
      <td>${e.title}</td>
      <td>${CATEGORIES[e.category]?.icon||'🏅'} ${CATEGORIES[e.category]?.label||e.category}</td>
      <td>${e.issuer}</td>
      <td><span class="mono-hash">${e.credentialHash.substring(0,18)}...</span></td>
      <td>
        <button class="btn-tiny glass-btn" onclick="checkCertificateDocFast('${e.achId}')">
          👁️ Inspect Fast
        </button>
      </td>
    </tr>
  `).join('');
}

// ── Tab 7: Agent 44 Profile & Live CV Sync (Workflow 5) ────────
function renderFacultyProfileTab() {
  return `
  <div class="glass-purpose-strip cyan">
    <span class="purpose-strip-icon">👤</span>
    <div class="purpose-strip-text">
      <strong>Workflow Step 5 Specification:</strong>
      Update the student profile in <strong>Agent 44</strong> and generate the student's exportable curriculum vitae.
      Faculty can review live student portfolios and download verified NAAC-compliant resumes.
    </div>
  </div>

  <div class="glass card">
    <h2 style="font-size:1.15rem;font-weight:900;color:var(--txt-1);margin-bottom:.5rem">Agent 44 Student Registry & Exportable CVs</h2>
    <p style="font-size:.82rem;color:var(--txt-3);margin-bottom:1.25rem">Click any student to inspect their live verified profile or export their curriculum vitae</p>

    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1rem">
      ${STUDENTS.map(s => {
        const achs = getAchievements(s.id);
        const verifiedAchs = achs.filter(a => a.status === 'verified');
        const totalPts = verifiedAchs.reduce((sum, a) => sum + (a.points || 0), 0);
        return `
          <div class="glass card student-roster-card">
            <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:.75rem">
              <span style="font-size:2rem">${s.avatar}</span>
              <div>
                <h3 style="font-size:.95rem;font-weight:800;color:var(--txt-1)">${s.name}</h3>
                <div style="font-size:.76rem;color:var(--txt-3)">${s.roll} · ${s.dept.split(' ')[0]}</div>
              </div>
            </div>
            <div class="student-roster-score-box">
              <span style="font-size:.78rem;font-weight:700;color:#64748b">Verified Score:</span>
              <strong style="color:var(--purple)">${totalPts} pts (${verifiedAchs.length} items)</strong>
            </div>
            <div style="display:flex;gap:.5rem">
              <button class="academic-action-btn purple" style="flex:1;justify-content:center" onclick="navigateTo('profile','${s.id}')">
                👤 Profile
              </button>
              <button class="academic-action-btn blue" style="flex:1;justify-content:center" onclick="APP_STATE.currentStudent = getStudent('${s.id}'); navigateTo('cv');">
                📄 View CV
              </button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  </div>
  `;
}

// ── Tab 8: Institutional Rubric Matrix (Workflow 4) ───────────
function renderFacultyRubricTab() {
  return `
  <div class="glass-purpose-strip indigo">
    <span class="purpose-strip-icon">📑</span>
    <div class="purpose-strip-text">
      <strong>Workflow Step 4 Specification:</strong>
      Assign a level and weight per the institutional rubric.
      Below is the official 10-tier scoring matrix applied during automated Agent 64 parsing and faculty verification.
    </div>
  </div>

  <div class="rubric-table-card glass card">
    <div class="rubric-table-header">
      <div>
        <h3 class="card-title">Official Accredited Scoring Rubric (Categorized by Domain)</h3>
        <p class="rubric-table-sub">Zero company names · Authorized scoring weights & competitive levels per NAAC Criteria 5.3 & AICTE specifications</p>
      </div>
      <div style="display:flex;gap:.5rem;align-items:center">
        <span class="accred-pill aicte">AICTE Approved</span>
        <span class="accred-pill" style="background:#ecfdf5;color:#047857;border-color:#a7f3d0">NAAC 5.3 Aligned</span>
      </div>
    </div>

    <!-- Category Filter Bar for Faculty -->
    <div class="rubric-filter-bar" style="display:flex;gap:.45rem;flex-wrap:wrap;margin:1rem 0 1.25rem">
      <button class="rubric-filter-btn active" onclick="filterFacultyRubric('all', this)">All Categories (${OFFICIAL_RUBRIC_SPEC.length})</button>
      ${Object.entries(CATEGORIES).map(([k, c]) => `
        <button class="rubric-filter-btn" onclick="filterFacultyRubric('${k}', this)">
          ${c.icon} ${c.label}
        </button>
      `).join('')}
    </div>

    <div class="table-responsive">
      <table class="official-rubric-table" id="faculty-rubric-table">
        <thead>
          <tr>
            <th>Accreditation Category</th>
            <th>Activity Type & Description</th>
            <th style="text-align:right">Rubric Points</th>
            <th style="text-align:center">Competitive Level</th>
          </tr>
        </thead>
        <tbody>
          ${OFFICIAL_RUBRIC_SPEC.map(spec => `
            <tr data-cat="${spec.category || 'all'}">
              <td>
                <div class="spec-header-cell">
                  <span class="spec-icon">${spec.icon}</span>
                  <span class="spec-name">${CATEGORIES[spec.category]?.label || spec.category || spec.header}</span>
                </div>
              </td>
              <td>
                <div style="font-weight:700;color:var(--txt-1);font-size:.86rem;margin-bottom:.2rem">${spec.header}</div>
                <div class="spec-activity-desc">${spec.activity}</div>
              </td>
              <td style="text-align:right">
                <span class="spec-points-badge">+${spec.points} pts</span>
              </td>
              <td style="text-align:center">
                <span class="spec-tier-chip">${spec.badge} Level</span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>
  `;
}

function filterFacultyRubric(catKey, el) {
  document.querySelectorAll('.rubric-filter-btn').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');

  const rows = document.querySelectorAll('#faculty-rubric-table tbody tr');
  rows.forEach(r => {
    if (catKey === 'all' || r.dataset.cat === catKey) {
      r.style.display = '';
    } else {
      r.style.display = 'none';
    }
  });
}

// ── Modals: Faculty Nomination & Organiser Report Ingest ───────
function openFacultyNominationModal() {
  openModal(`
    <div style="margin-bottom:1rem">
      <h2 style="font-size:1.25rem;font-weight:900;color:var(--txt-1)">Faculty Student Nomination (Input #3)</h2>
      <p style="font-size:.82rem;color:var(--txt-3)">Submit an official faculty endorsement for outstanding outside-coursework achievements</p>
    </div>

    <div style="display:flex;flex-direction:column;gap:1rem">
      <div>
        <label class="form-label">Select Student *</label>
        <select id="nom-student" class="form-input">
          ${STUDENTS.map(s => `<option value="${s.id}">${s.name} (${s.roll}) — ${s.dept}</option>`).join('')}
        </select>
      </div>

      <div>
        <label class="form-label">Achievement Title / Citation *</label>
        <input type="text" id="nom-title" class="form-input" placeholder="e.g., IEEE Student Project Excellence Award 2024" value="National Autonomous Drone Challenge — 1st Place">
      </div>

      <div class="form-row two">
        <div>
          <label class="form-label">Category *</label>
          <select id="nom-category" class="form-input">
            <option value="technical">Technical Competition</option>
            <option value="hackathon">Hackathon</option>
            <option value="publication">Publication</option>
            <option value="patent">Patent</option>
            <option value="sports">Sports</option>
            <option value="cultural">Cultural</option>
            <option value="social">Social Service</option>
          </select>
        </div>
        <div>
          <label class="form-label">Rubric Points to Award *</label>
          <select id="nom-points" class="form-input">
            <option value="100">100 pts (Global / Premier Tier)</option>
            <option value="75">75 pts (National / State 1st)</option>
            <option value="50" selected>50 pts (Hackathon / Tech Winner)</option>
            <option value="30">30 pts (Runner-Up / State Level)</option>
            <option value="10">10 pts (Event Participation)</option>
          </select>
        </div>
      </div>

      <div>
        <label class="form-label">Faculty Endorsement Remarks *</label>
        <textarea id="nom-justification" class="form-input" rows="2" placeholder="Faculty verification rationale...">Verified prototype implementation and competition proof. Nominated for immediate credit towards NAAC Criteria 5.3.</textarea>
      </div>

      <div style="display:flex;justify-content:flex-end;gap:.75rem;margin-top:1rem">
        <button class="btn-ghost" onclick="closeModal()">Cancel</button>
        <button class="academic-action-btn purple" onclick="submitNominationForm()">
          ✓ Confirm Faculty Nomination
        </button>
      </div>
    </div>
  `);
}

function submitNominationForm() {
  const sId = document.getElementById('nom-student')?.value;
  const title = document.getElementById('nom-title')?.value;
  const cat = document.getElementById('nom-category')?.value;
  const pts = document.getElementById('nom-points')?.value;
  const just = document.getElementById('nom-justification')?.value;

  if (!title) {
    showToast('Please enter an achievement title', 'warning');
    return;
  }

  submitFacultyNomination(sId, title, cat, 'national', pts, just);
  closeModal();
  switchFacultyTab('verify');
}

function openOrganiserReportModal() {
  openModal(`
    <div style="margin-bottom:1rem">
      <h2 style="font-size:1.25rem;font-weight:900;color:var(--txt-1)">Batch Ingest: Event Organiser Report (Input #2)</h2>
      <p style="font-size:.82rem;color:var(--txt-3)">Import competition master lists directly into Agent 48 to bypass individual student form filing</p>
    </div>

    <div style="display:flex;flex-direction:column;gap:1rem">
      <div>
        <label class="form-label">Event Name / Code *</label>
        <input type="text" class="form-input" value="Vignan Mahotsav 2024 National Hackathon">
      </div>

      <div class="form-row two">
        <div>
          <label class="form-label">Organising Department *</label>
          <select class="form-input">
            <option>Computer Science & Engineering</option>
            <option>Electronics & Communication</option>
            <option>Student Affairs (Cultural & Sports)</option>
          </select>
        </div>
        <div>
          <label class="form-label">Total Student Awardees *</label>
          <input type="text" class="form-input" value="14 Students Shortlisted">
        </div>
      </div>

      <div style="border:2px dashed #93c5fd;padding:1.75rem;text-align:center;border-radius:14px;background:rgba(239,246,255,0.6);backdrop-filter:blur(10px)">
        <div style="font-size:2.2rem;margin-bottom:.4rem">📄</div>
        <div style="font-weight:800;font-size:.92rem;color:#1e3a8a">Upload Master Result Excel / PDF (Agent 64 OCR)</div>
        <div style="font-size:.78rem;color:var(--txt-3);margin-top:.25rem">Drag & drop Mahotsav_2024_Results.xlsx or click to browse</div>
      </div>

      <div style="display:flex;justify-content:flex-end;gap:.75rem;margin-top:1rem">
        <button class="btn-ghost" onclick="closeModal()">Cancel</button>
        <button class="academic-action-btn emerald" onclick="closeModal(); showToast('Ingested 14 student achievement records from Organiser Master Sheet!','success');">
          ⚡ Ingest & Auto-Index
        </button>
      </div>
    </div>
  `);
}
