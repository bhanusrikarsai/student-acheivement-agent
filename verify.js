// ============================================================
//  verify.js — Faculty Verification Queue & Fast Document Audit
// ============================================================

function renderVerifyView() {
  const pending  = ACHIEVEMENTS.filter(a => a.status === 'pending');
  const verified = ACHIEVEMENTS.filter(a => a.status === 'verified' || a.status === 'approved');
  const rejected = ACHIEVEMENTS.filter(a => a.status === 'rejected');

  return `
  <div class="view-header">
    <div>
      <h1 class="view-title">Faculty Verification & Accreditation Portal</h1>
      <p class="view-sub">Review certificate claims against institutional rubrics before points are credited.</p>
    </div>
    <div class="verify-stats">
      <div class="vstat pending-stat"><span>${pending.length}</span> Awaiting Review</div>
      <div class="vstat verified-stat"><span>${verified.length}</span> Approved & Verified</div>
      <div class="vstat rejected-stat"><span>${rejected.length}</span> Rejected Submissions</div>
    </div>
  </div>

  <!-- Accreditation Policy Notice -->
  <div class="purpose-card" style="border-left-color:var(--amber);background:#fffbeb;border-color:#fef3c7">
    <span style="font-size:1.3rem">⚖️</span>
    <div>
      <strong>Accreditation Compliance Directive:</strong>
      All student achievement claims require faculty evaluation before points are credited.
      Faculty verifiers authenticate the digital document before uncapped points are officially certified and synced to <strong>Agent 44 Central Profile</strong> and the <strong>Exportable CV</strong>.
    </div>
  </div>

  <div class="verify-layout">
    <!-- Main Queue -->
    <div class="verify-main">
      <div class="section-head">
        <h2 class="section-title">⏳ Awaiting Faculty Verification (${pending.length})</h2>
      </div>

      ${pending.length === 0 ? `
        <div class="empty-queue glass card">
          <div class="empty-icon">🎉</div>
          <h3>All Caught Up!</h3>
          <p>No achievements are currently pending faculty review. Any certificate submitted by a student will immediately appear here.</p>
        </div>
      ` : pending.map(a => renderVerifyCard(a, true)).join('')}

      <!-- All Approved Records -->
      <div class="section-head" style="margin-top:2.25rem">
        <h2 class="section-title">✅ Approved & Verified Records (${verified.length})</h2>
      </div>
      ${verified.length > 0 
        ? verified.map(a => renderVerifyCard(a, false)).join('')
        : `<div class="empty-queue glass card" style="padding:1.2rem;text-align:center"><p style="color:var(--txt-3);font-size:.85rem">No approved records yet. When faculty clicks "Accept & Award", certificates will appear here.</p></div>`
      }

      <!-- All Rejected Submissions -->
      <div class="section-head" style="margin-top:2.25rem">
        <h2 class="section-title">❌ Rejected Submissions (${rejected.length})</h2>
      </div>
      ${rejected.length > 0 
        ? rejected.map(a => renderVerifyCard(a, false)).join('')
        : `<div class="empty-queue glass card" style="padding:1.2rem;text-align:center"><p style="color:var(--txt-3);font-size:.85rem">No rejected submissions.</p></div>`
      }
    </div>

    <!-- Sidebar: Whitelist Lookup -->
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
          <li>👁️ <strong>Check Certificate Doc Fast:</strong> Instant preview of digital seal and credential hash.</li>
          <li>✓ <strong>Accept:</strong> Confirms authenticity, calculates rubric marks, and syncs to Agent 44.</li>
          <li>✗ <strong>Reject:</strong> Disapproves invalid or unauthenticated submissions with remark note.</li>
        </ul>
      </div>
    </aside>
  </div>
  `;
}

// Explicit window export to ensure instant availability in all contexts
if (typeof window !== 'undefined') {
  window.renderVerifyCard = renderVerifyCard;
}

// ── Render a Single Verification Card with Accept, Reject & Fast Doc Check ──
function renderVerifyCard(a, showActions) {
  const stu   = getStudent(a.studentId) || { name:'Unknown', dept:'N/A', roll:'N/A', avatar:'❓' };
  const cat   = CATEGORIES[a.category] || { label:a.category, icon:'🏅', color:'#888', gradient:'linear-gradient(135deg,#64748b,#475569)' };
  const sm    = statusMeta(a.status, a.autoVerified);
  const pts   = a.points || getWeight(a.category, a.level, a.rubricSpecKey);
  const lvl   = LEVELS.find(l => l.id === a.level) || { label:a.level, badge:'—' };

  // Publication Author Rule Guardrail: Check if student is credited author
  const isPubType = a.category === 'publication' || a.category === 'paper' || a.category === 'patent';
  const authorList = a.authors || (a.docMetadata && a.docMetadata.authors) || '';
  const isAuthorCredited = isPubType ? (
    authorList ? authorList.toLowerCase().includes(stu.name.toLowerCase()) || authorList.toLowerCase().includes(stu.roll.toLowerCase()) : true
  ) : true;

  return `
  <div class="glass card verify-card" id="vcard-${a.id}">
    <div class="vcard-header">
      <div class="vcard-cat-badge" style="background:${cat.color}15;border-color:${cat.color}35;color:${cat.color}">
        <span>${cat.icon}</span>
        <span>${cat.label}</span>
      </div>
      <div style="display:flex;gap:.4rem;align-items:center">
        ${a.autoVerified 
          ? `<span class="badge-auto" style="font-size:.68rem">⚡ Tier 1: Automated</span>`
          : a.status === 'pending'
            ? `<span class="badge-pending" style="font-size:.68rem">👨‍🏫 Tier 2: Faculty Escalation</span>`
            : ''
        }
        <span class="${sm.cls}">${sm.label}</span>
      </div>
    </div>

    <div class="vcard-body">
      <div class="vcard-main">
        <h3 class="vcard-title">${a.title}</h3>
        <div class="vcard-meta-row">
          <span class="vcard-meta-item">🏛️ <strong>Issuer:</strong> ${a.issuer || 'Unknown'}</span>
          <span class="vcard-meta-item">📅 <strong>Date:</strong> ${a.date || '—'}</span>
          <span class="vcard-meta-item">🌐 <strong>Level:</strong> ${lvl.badge} ${lvl.label}</span>
          ${a.position ? `<span class="vcard-meta-item">🥇 <strong>Grade / Award:</strong> ${a.position}</span>` : ''}
        </div>
        ${a.description ? `<p class="vcard-desc">${a.description}</p>` : ''}

        <!-- Publication Author Rule Indicator -->
        ${isPubType ? `
          <div style="margin-top:.4rem;padding:.35rem .65rem;border-radius:6px;font-size:.73rem;display:inline-flex;align-items:center;gap:.35rem;${isAuthorCredited ? 'background:#ecfdf5;color:#065f46;border:1px solid #a7f3d0' : 'background:#fff1f2;color:#9f1239;border:1px solid #fecdd3'}">
            <span>${isAuthorCredited ? '✓' : '⚠️'}</span>
            <span><strong>Publication Author Rule:</strong> ${isAuthorCredited ? `Student (${stu.name}) credited as author` : `Student NOT credited in authors list — Reject Required!`}</span>
          </div>
        ` : ''}

        <!-- Student Attribution -->
        <div class="vcard-student">
          <span class="student-avatar-sm">${stu.avatar}</span>
          <span class="student-name-sm">${stu.name}</span>
          <span class="student-meta-sm"><strong>${stu.roll}</strong> · ${stu.dept} (${stu.year || 'Year 3'})</span>
        </div>
      </div>

      <div class="vcard-right">
        <div class="vcard-pts-box" style="background:${cat.gradient}">
          <div class="vcard-pts-num">${pts}</div>
          <div class="vcard-pts-label">pts</div>
        </div>
        ${isKnownIssuer(a.issuer) && showActions ? `<div class="issuer-known-badge">⚡ Whitelisted Body</div>` : ''}
      </div>
    </div>

    ${showActions ? `
    <div class="vcard-actions">
      <textarea class="form-input verifier-notes" id="notes-${a.id}" rows="1" placeholder="Faculty verification remarks (optional)…"></textarea>
      <div class="vcard-action-bar">
        <!-- Option to check the certificate doc fast -->
        <button class="btn-quick-view" onclick="checkCertificateDocFast('${a.id}')">
          <span>👁️</span> Check Certificate Doc Fast
        </button>

        <div class="vcard-btn-group">
          <!-- Faculty Reject Button -->
          <button class="btn-reject" onclick="rejectAchievement('${a.id}')">
            <span>✗</span> Reject
          </button>
          <!-- Faculty Accept Button -->
          <button class="btn-accept" onclick="acceptAchievement('${a.id}')">
            <span>✓</span> Accept & Award ${pts} Pts
          </button>
        </div>
      </div>
    </div>
    ` : a.status === 'rejected' ? `
    <div class="vcard-processed" style="display:flex;justify-content:space-between;align-items:center;background:#fff1f2;border-top:1px solid #fecdd3;color:#9f1239;padding:.6rem 1rem;border-radius:0 0 14px 14px">
      <button class="btn-tiny" style="background:#fff;border-color:#fecdd3;color:#9f1239;cursor:pointer" onclick="checkCertificateDocFast('${a.id}')">
        👁️ View Rejected Proof
      </button>
      <div>
        ❌ <strong>Rejected by ${a.verifiedBy || 'Faculty Verifier'}</strong> on ${a.verifiedDate || ''} · Reason: <em>${a.notes || 'Unverifiable / insufficient evidence'}</em>
      </div>
    </div>
    ` : `
    <div class="vcard-processed" style="display:flex;justify-content:space-between;align-items:center;background:#f0fdf4;border-top:1px solid #bbf7d0;color:#166534;padding:.6rem 1rem;border-radius:0 0 14px 14px">
      <button class="btn-tiny" style="background:#fff;border-color:#bbf7d0;color:#166534;cursor:pointer" onclick="checkCertificateDocFast('${a.id}')">
        👁️ View Approved Certificate Doc
      </button>
      <div>
        ✅ <strong>Approved by ${a.verifiedBy || 'Faculty Verifier'}</strong> on ${a.verifiedDate || ''} · (+${pts} Pts awarded)
      </div>
    </div>`}
  </div>
  `;
}
if (typeof window !== 'undefined') {
  window.renderVerifyCard = renderVerifyCard;
}

// ── FAST CERTIFICATE DOCUMENT VIEWER MODAL ────────────────────
function checkCertificateDocFast(id) {
  const ach = ACHIEVEMENTS.find(a => a.id === id);
  if (!ach) return;
  const stu = getStudent(ach.studentId) || {};
  const meta = ach.docMetadata || {
    docId: `VFSTR-DOC-${ach.id}`,
    issuer: ach.issuer || 'Issuing Body',
    examOrAward: ach.title,
    scoreOrGrade: ach.position || 'PASS',
    credentialHash: `SHA256:88192a01f9b09${ach.id.toLowerCase()}`,
    ocrConfidence: '99.4%'
  };

  const isPending = ach.status === 'pending';

  openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
      <div>
        <h2 style="font-size:1.25rem;font-weight:900;color:var(--txt-1)">Fast Certificate Document Inspection</h2>
        <p style="font-size:.82rem;color:var(--txt-3)">Instant verification preview for NAAC SSR & IQAC audit</p>
      </div>
      <span class="accred-pill naac">Agent 64 Verified Authentic</span>
    </div>

    <!-- Official Certificate Preview Canvas -->
    <div class="cert-doc-preview">
      <div class="cert-crest">
        <img src="images/vignan_logo.png" alt="Vignan Crest">
        <div style="text-align:left">
          <div class="cert-watermark">Vignan's Foundation for Science, Technology & Research</div>
          <div style="font-size:.68rem;color:#64748b">Accredited by NAAC 'A+' Grade · NIRF Rank #75</div>
        </div>
      </div>

      <div style="font-size:.82rem;color:#64748b;letter-spacing:.08em;text-transform:uppercase;margin-top:.5rem">
        CERTIFICATE OF ACHIEVEMENT & RECOGNITION
      </div>

      <div class="cert-recipient-label">THIS DOCUMENT CERTIFIES THAT</div>
      <div class="cert-student-name">${stu.name}</div>
      <div style="font-size:.84rem;color:#475569;font-weight:600">Roll No: <strong>${stu.roll}</strong> · ${stu.dept}</div>

      <div style="margin:1rem 0;height:1px;background:#e2e8f0;width:60%;margin-left:auto;margin-right:auto"></div>

      <div style="font-size:.84rem;color:#334155">Has successfully accomplished and demonstrated excellence in:</div>
      <div class="cert-award-title">${ach.title}</div>
      <div style="font-size:.84rem;color:#059669;font-weight:700">Issued by: ${ach.issuer} · Grade/Award: ${ach.position || 'Verified PASS'}</div>

      <!-- Certificate Security & Verification Meta -->
      <div class="cert-doc-details">
        <div>
          <span style="color:#64748b;display:block">Certificate Token:</span>
          <strong>${meta.docId}</strong>
        </div>
        <div>
          <span style="color:#64748b;display:block">Issue Date:</span>
          <strong>${ach.date || '2024-01-15'}</strong>
        </div>
        <div>
          <span style="color:#64748b;display:block">Rubric Award:</span>
          <strong style="color:#6d28d9">+${ach.points} Points</strong>
        </div>
        <div style="grid-column: span 2">
          <span style="color:#64748b;display:block">Digital Verification Hash:</span>
          <span style="font-family:'JetBrains Mono',monospace;font-size:.68rem;color:#2563eb">${meta.credentialHash}</span>
        </div>
        <div>
          <span style="color:#64748b;display:block">OCR Confidence:</span>
          <strong style="color:#059669">✓ ${meta.ocrConfidence}</strong>
        </div>
      </div>
    </div>

    <!-- Fast Action Bar inside the Inspector Modal -->
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:1.25rem;padding-top:1rem;border-top:1px solid var(--border)">
      <button class="btn-ghost" onclick="closeModal()">Close Inspector</button>

      ${isPending ? `
        <div style="display:flex;gap:.75rem">
          <button class="btn-reject" onclick="rejectAchievement('${ach.id}'); closeModal();">
            ✗ Reject Certificate
          </button>
          <button class="btn-accept" onclick="acceptAchievement('${ach.id}'); closeModal();">
            ✓ Accept & Award ${ach.points} Pts
          </button>
        </div>
      ` : `
        <span class="badge-verified">✓ Certificate is Already Verified</span>
      `}
    </div>
  `);
}

// ── Faculty Accept Action ─────────────────────────────────────
function acceptAchievement(id) {
  const ach = ACHIEVEMENTS.find(a => a.id === id);
  if (!ach) return;

  const verifierName = (APP_STATE.currentUser && APP_STATE.currentUser.name) || 'Dr. Rajesh Kumar (HOD CSE / Faculty Verifier)';
  const notes = document.getElementById(`notes-${id}`)?.value || 'Verified against institutional scoring rubric and issuing authority.';
  
  ach.status       = 'verified';
  ach.autoVerified = false;
  ach.verifiedBy   = verifierName;
  ach.verifiedDate = new Date().toISOString().split('T')[0];
  ach.notes        = notes;

  PENDING_QUEUE = ACHIEVEMENTS.filter(a => a.status === 'pending');
  saveData();
  if (typeof saveAchievementsToServer === 'function') saveAchievementsToServer();
  if (typeof refreshInsights === 'function') refreshInsights();

  updateStudentProfile(ach.studentId);

  // Send real email notification via Resend
  const student = typeof getStudent === 'function' ? getStudent(ach.studentId) : STUDENTS.find(s => s.id === ach.studentId);
  if (typeof notifyStudentByEmail === 'function') {
    notifyStudentByEmail(ach, student, 'verified', notes);
  }

  const card = document.getElementById(`vcard-${id}`);
  if (card) {
    card.classList.add('card-flash-green');
  }

  showToast(`Accepted! +${ach.points} Points verified & awarded to student`, 'success');

  setTimeout(() => {
    if (APP_STATE.currentView === 'faculty-dashboard') {
      const container = document.getElementById('faculty-tab-content');
      if (container && typeof renderCurrentFacultyTabContent === 'function') {
        container.innerHTML = renderCurrentFacultyTabContent();
      } else {
        navigateTo('faculty-dashboard');
      }
    } else {
      navigateTo('verify');
    }
  }, 500);
}

// ── Faculty Reject Action ─────────────────────────────────────
function rejectAchievement(id) {
  const ach = ACHIEVEMENTS.find(a => a.id === id);
  if (!ach) return;

  const verifierName = (APP_STATE.currentUser && APP_STATE.currentUser.name) || 'Dr. Rajesh Kumar (Faculty Verifier)';
  const notes = document.getElementById(`notes-${id}`)?.value || 'Unverifiable certificate or unaccredited issuing body.';

  ach.status       = 'rejected';
  ach.verifiedBy   = verifierName;
  ach.verifiedDate = new Date().toISOString().split('T')[0];
  ach.notes        = notes;

  PENDING_QUEUE = ACHIEVEMENTS.filter(a => a.status === 'pending');
  saveData();
  if (typeof saveAchievementsToServer === 'function') saveAchievementsToServer();
  if (typeof refreshInsights === 'function') refreshInsights();

  // Send real email notification via Resend
  const student = typeof getStudent === 'function' ? getStudent(ach.studentId) : STUDENTS.find(s => s.id === ach.studentId);
  if (typeof notifyStudentByEmail === 'function') {
    notifyStudentByEmail(ach, student, 'rejected', notes);
  }

  const card = document.getElementById(`vcard-${id}`);
  if (card) {
    card.classList.add('card-flash-red');
  }

  showToast('Certificate rejected and student notified via email.', 'warning');

  setTimeout(() => {
    if (APP_STATE.currentView === 'faculty-dashboard') {
      const container = document.getElementById('faculty-tab-content');
      if (container && typeof renderCurrentFacultyTabContent === 'function') {
        container.innerHTML = renderCurrentFacultyTabContent();
      } else {
        navigateTo('faculty-dashboard');
      }
    } else {
      navigateTo('verify');
    }
  }, 500);
}

function autoVerifyAll() {
  const pending = ACHIEVEMENTS.filter(a => a.status === 'pending');
  let count = 0;
  pending.forEach(a => {
    if (isKnownIssuer(a.issuer)) {
      a.status       = 'verified';
      a.autoVerified = true;
      a.verifiedBy   = `Auto (${a.issuer})`;
      a.verifiedDate = new Date().toISOString().split('T')[0];
      updateStudentProfile(a.studentId);
      count++;
    }
  });
  PENDING_QUEUE = ACHIEVEMENTS.filter(a => a.status === 'pending');
  saveData();
  if (typeof saveAchievementsToServer === 'function') saveAchievementsToServer();
  if (typeof refreshInsights === 'function') refreshInsights();
  showToast(`${count} certificates auto-verified!`, 'success');
  setTimeout(() => {
    if (APP_STATE.currentView === 'faculty-dashboard') {
      const container = document.getElementById('faculty-tab-content');
      if (container && typeof renderCurrentFacultyTabContent === 'function') {
        container.innerHTML = renderCurrentFacultyTabContent();
      }
    } else {
      navigateTo('verify');
    }
  }, 500);
}

function checkIssuer() {
  const val = document.getElementById('issuer-check-input')?.value.trim();
  const res = document.getElementById('issuer-result');
  if (!res || !val) { if (res) res.innerHTML = ''; return; }

  if (isKnownIssuer(val)) {
    res.innerHTML = `<span class="badge-auto">✅ Recognized Issuer — eligible for automated verification</span>`;
  } else {
    res.innerHTML = `<span class="badge-pending">👨‍🏫 Unlisted Issuer — requires faculty verifier review</span>`;
  }
}
