// ============================================================
//  cv.js — Exportable CV Generator with Vignan's Accreditation
// ============================================================

function renderCVView() {
  const stu   = APP_STATE.currentStudent || STUDENTS[0];
  const achs  = getAchievements(stu.id).filter(a => a.status === 'verified');
  const total = getTotalScore(stu.id);

  return `
  <div class="view-header">
    <div>
      <h1 class="view-title">Exportable Curriculum Vitae</h1>
      <p class="view-sub">Official achievement-enriched CV synchronized with Agent 44 Central Profile.</p>
    </div>
    <div class="cv-actions">
      <button class="btn-ghost" onclick="navigateTo('profile')">← Back to Profile</button>
      <button class="btn-primary" onclick="exportCV()">🖨️ Print / Download Official CV (PDF)</button>
    </div>
  </div>

  <div class="cv-preview-shell">
    <div class="glass card cv-toolbar">
      <div style="display:flex;align-items:center;gap:.6rem">
        <span style="font-size:1.1rem">📜</span>
        <span>CV Preview — <strong>${stu.name}</strong> (${stu.roll})</span>
      </div>
      <div style="display:flex;gap:.75rem;align-items:center">
        <span class="cv-verified-note">✓ Synced to Agent 44 Profile</span>
        <span class="accred-pill naac">NAAC A+ Verified</span>
      </div>
    </div>

    <div class="cv-paper" id="cv-paper">
      ${buildCVHTML(stu, achs, total)}
    </div>
  </div>
  `;
}

function buildCVHTML(stu, achs, total) {
  const grouped = {};
  Object.keys(CATEGORIES).forEach(k => { grouped[k] = []; });
  achs.forEach(a => { if (grouped[a.category]) grouped[a.category].push(a); });

  const nonEmpty = Object.entries(grouped).filter(([,v]) => v.length > 0);

  return `
    <div class="cv-doc">
      <!-- University Letterhead Header -->
      <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:2px solid #0f172a;padding-bottom:1rem;margin-bottom:1.5rem">
        <div style="display:flex;align-items:center;gap:1rem">
          <img src="images/vignan_logo.png" alt="Vignan University" style="height:52px;width:auto">
          <div>
            <div style="font-size:1.1rem;font-weight:900;color:#c0392b;letter-spacing:-.02em">VIGNAN'S UNIVERSITY</div>
            <div style="font-size:.72rem;color:#475569;font-weight:600">Foundation for Science, Technology & Research (Deemed to be University)</div>
            <div style="font-size:.68rem;color:#64748b">NAAC Accredited 'A+' Grade · NIRF Rank 75 · NBA Tier-1</div>
          </div>
        </div>
        <div style="text-align:right">
          <div style="font-size:.72rem;font-weight:800;color:#6d28d9;background:#f5f3ff;padding:.25rem .6rem;border-radius:99px;display:inline-block;border:1px solid #ddd6fe">
            AGENT 44 VERIFIED PORTFOLIO
          </div>
          <div style="font-size:.68rem;color:#64748b;margin-top:.3rem">Ref: VFSTR/ACH/${stu.roll}/2024</div>
        </div>
      </div>

      <!-- Candidate Profile -->
      <div class="cv-header">
        <div class="cv-name-block">
          <h1 class="cv-name">${stu.name || 'Student Candidate'}</h1>
          <div class="cv-sub-info"><strong>${stu.roll || stu.rollNo || '211FA04001'}</strong> · ${stu.dept || 'Computer Science & Engineering'} · Batch of ${stu.batch || '2021-25'}</div>
          <div class="cv-contact">📧 ${stu.email || 'student@vignan.ac.in'} · 📱 +91 ${stu.phone || '9848012345'} · CGPA: <strong>${stu.cgpa || 8.85} / 10.0</strong></div>
        </div>
        <div class="cv-score-block">
          <div class="cv-score-num">${total}</div>
          <div class="cv-score-lbl">Institutional<br>Achievement Points</div>
          <div class="cv-cgpa">${achs.length} Verified Records</div>
        </div>
      </div>

      <div class="cv-divider"></div>

      <!-- Verified Summary Breakdown -->
      <div class="cv-section">
        <div class="cv-section-title">CO-CURRICULAR & EXTRACURRICULAR SUMMARY</div>
        <div class="cv-summary-chips">
          ${Object.entries(CATEGORIES).map(([k,c]) => {
            const n = (grouped[k]||[]).length;
            if (n === 0) return '';
            return `<span class="cv-chip" style="border-color:${c.color};color:${c.color}">${c.icon} ${n} ${c.label}</span>`;
          }).join('')}
        </div>
      </div>

      <!-- Categorized Achievement Details -->
      ${nonEmpty.map(([key, catAchs]) => {
        const cat = CATEGORIES[key];
        return `
          <div class="cv-section">
            <div class="cv-section-title" style="border-left-color:${cat.color}">${cat.icon} ${cat.label.toUpperCase()}</div>
            ${catAchs.sort((a,b) => new Date(b.date)-new Date(a.date)).map(a => {
              const lvl = LEVELS.find(l => l.id === a.level) || { label:a.level, badge:'' };
              return `
                <div class="cv-entry">
                  <div class="cv-entry-left">
                    <div class="cv-entry-title">${a.title}</div>
                    <div class="cv-entry-meta">
                      <strong>${a.issuer || ''}</strong>
                      ${a.position ? ' · ' + a.position : ''}
                      · <span>${lvl.badge} ${lvl.label} Level</span>
                      · <em style="color:#059669">Verified by ${a.verifiedBy || 'Institution'}</em>
                    </div>
                    ${a.description ? `<div class="cv-entry-desc">${a.description}</div>` : ''}
                    ${a.doi ? `<div class="cv-entry-doi">DOI: ${a.doi}</div>` : ''}
                    ${a.patentNo ? `<div class="cv-entry-doi">Patent Application: ${a.patentNo}</div>` : ''}
                  </div>
                  <div class="cv-entry-right">
                    <div class="cv-entry-date">${a.date}</div>
                    <div class="cv-entry-pts" style="color:${cat.color}">+${a.points} pts</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `;
      }).join('')}

      <!-- Official Verification Stamp Footer -->
      <div class="cv-footer" style="align-items:center">
        <div>
          <div><strong>Student Achievement Agent & Agent 44 Digital Authentication</strong></div>
          <div style="font-size:.68rem;color:#64748b">Verified for Placement Drive, Higher Education, and NAAC SSR Criteria 5.3 Audit</div>
        </div>
        <div style="text-align:right">
          <div style="font-weight:700;color:#059669">✓ AUTHENTICATED RECORD</div>
          <div style="font-size:.68rem;color:#64748b">Issue Date: ${new Date().toLocaleDateString('en-IN', {year:'numeric',month:'short',day:'numeric'})}</div>
        </div>
      </div>
    </div>
  `;
}

function exportCV() {
  const cvPaper = document.getElementById('cv-paper');
  if (!cvPaper) return;

  const style = document.createElement('style');
  style.id    = 'print-override';
  style.textContent = `
    @media print {
      body > *:not(.main) { display: none !important; }
      .top-accred-bar, .topbar, .main-nav, .view-header, .cv-toolbar,
      .cv-actions, .bg-orbs, .toast-container { display: none !important; }
      .main { padding: 0 !important; max-width: 100% !important; margin: 0 !important; }
      .cv-preview-shell { padding: 0 !important; }
      .cv-paper { box-shadow: none !important; border: none !important; border-radius: 0 !important; }
      .cv-doc { padding: 15mm !important; }
      @page { margin: 0; size: A4 portrait; }
    }
  `;
  document.head.appendChild(style);
  window.print();
  setTimeout(() => {
    const s = document.getElementById('print-override');
    if (s) s.remove();
  }, 1000);
}
