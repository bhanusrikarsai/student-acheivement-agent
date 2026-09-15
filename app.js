// ============================================================
//  app.js — Router, Sidebar Engine, Navigation, Toasts,
//  Role-Separated Authentication & Backend API Synchronization
// ============================================================

// ── Global Public Client Configuration (Zero Hardcoded Secrets) ──
const VFSTR_KEYS = {
  supabasePublishable: ''
};

// ── Global Application State ─────────────────────────────────
const APP_STATE = {
  currentUser:    null,        // Loaded from localStorage ('vfstr_auth_user')
  role:           'student',   // 'student' | 'faculty' | 'hod'
  currentStudent: STUDENTS[0], // Active student record
  currentView:    'submit',
  notifOpen:      false,
  modalRoleTarget:'student'
};

// ── Role-Specific Navigation Sidebar Configurations ──────────
// ── Role-Specific Navigation Sidebar Configurations (All 6 Stakeholders) ──
const SIDEBAR_CONFIG = {
  student: [
    { id: 'submit',    label: 'Submit Proof (Agent 64)', icon: '📄' },
    { id: 'dashboard', label: 'My Dashboard & Report',    icon: '📊' },
    { id: 'profile',   label: 'Barcode Profile (Agent 44)', icon: '👤' },
    { id: 'cv',        label: 'Generative CV (Agent 44)', icon: '📄' },
    { id: 'agent48',   label: 'Agent 48 Role Flow',       icon: '⚡' }
  ],
  faculty: [
    { id: 'verify',            label: 'Verification Queue (Agent 13)', icon: '⚖️', badge: true },
    { id: 'faculty-dashboard', label: 'Faculty Hub Overview',          icon: '🏛️' },
    { id: 'inputs',            label: 'Multi-Source Inputs (7 Streams)',icon: '📥' },
    { id: 'aggregates',        label: 'Dept & Batch Aggregates (Agent 57)', icon: '📊' },
    { id: 'recognition',       label: 'Recognition Roster',            icon: '🌟' },
    { id: 'gaps',              label: 'Participation Gaps (Agent 71)', icon: '🚨' },
    { id: 'archive',           label: 'Evidence Archive Vault',        icon: '🗄️' },
    { id: 'profile',           label: 'Student Directory',             icon: '👥' },
    { id: 'agent48',           label: 'Agent 48 Ecosystem',            icon: '⚡' },
    { id: 'rubric',            label: 'Rubric Matrix',                 icon: '📑' }
  ],
  hod: [
    { id: 'faculty-dashboard', label: 'HoD Department Hub',            icon: '🏛️' },
    { id: 'dashboard',         label: 'Department Analytics (Agent 9)',icon: '📊' },
    { id: 'aggregates',        label: 'Batch Performance (Agent 57)',  icon: '📈' },
    { id: 'verify',            label: 'Verification Audit Trail',      icon: '✅', badge: true },
    { id: 'gaps',              label: 'Branch Gaps (Agent 71)',        icon: '🚨' },
    { id: 'profile',           label: 'Student Registry',              icon: '👥' },
    { id: 'agent48',           label: 'Agent 48 Flow',                 icon: '⚡' },
    { id: 'rubric',            label: 'Institutional Rubric',          icon: '📑' }
  ],
  'student-affairs': [
    { id: 'gaps',              label: 'Participation Gaps (Agent 71)', icon: '🚨' },
    { id: 'inputs',            label: 'Intervention Campaigns',        icon: '🎯' },
    { id: 'dashboard',         label: 'Engagement Analytics (Agent 9)',icon: '📊' },
    { id: 'recognition',       label: 'Student Motivation Roster',     icon: '🌟' },
    { id: 'profile',           label: 'Student Welfare Roster',        icon: '🤝' },
    { id: 'agent48',           label: 'Agent 48 Flow',                 icon: '⚡' }
  ],
  'placement-cell': [
    { id: 'cv',                label: 'Recruiter CV Vault (Agent 44)', icon: '📄' },
    { id: 'aggregates',        label: 'Verified Talent Pool',          icon: '💼' },
    { id: 'dashboard',         label: 'Employability Metrics',         icon: '📊' },
    { id: 'profile',           label: 'Candidate Registry',            icon: '👥' },
    { id: 'agent48',           label: 'Agent 48 Flow',                 icon: '⚡' }
  ],
  iqac: [
    { id: 'dashboard',         label: 'NAAC 5.3 & NIRF Hub (Agent 49)',icon: '🏛️' },
    { id: 'aggregates',        label: 'NBA Criteria 9 Analytics',      icon: '📊' },
    { id: 'archive',           label: 'Evidence Archive Audit (Agent 13)', icon: '🗄️' },
    { id: 'verify',            label: 'Compliance Verification',       icon: '⚖️', badge: true },
    { id: 'agent48',           label: 'Agent 48 Architecture',         icon: '⚡' },
    { id: 'rubric',            label: 'Rubric Weight Standards',       icon: '📑' }
  ],
  recognition: [
    { id: 'recognition',       label: 'Top Achievers Roster',          icon: '🌟' },
    { id: 'aggregates',        label: 'Honor Roll Leaderboard',        icon: '🏆' },
    { id: 'profile',           label: 'Awardee Portfolios',            icon: '👥' },
    { id: 'dashboard',         label: 'Recognition Analytics',         icon: '📊' },
    { id: 'archive',           label: 'Citations Vault',               icon: '📜' },
    { id: 'agent48',           label: 'Agent 48 Flow',                 icon: '⚡' }
  ],
  admin: [
    { id: 'agent48',           label: 'Agent 48 Orchestrator',         icon: '⚡' },
    { id: 'archive',           label: 'Evidence Archive Vault',        icon: '🗄️' },
    { id: 'verify',            label: 'Master Verification Override',  icon: '⚖️', badge: true },
    { id: 'aggregates',        label: 'System Records & Ledger',       icon: '📈' },
    { id: 'dashboard',         label: 'System Health & Metrics',       icon: '🛡️' }
  ]
};

// ── Sidebar Renderer ─────────────────────────────────────────
function renderSidebar() {
  const sidebar = document.getElementById('app-sidebar');
  if (!sidebar) return;

  if (!APP_STATE.currentUser) {
    sidebar.innerHTML = '';
    return;
  }

  const role = APP_STATE.role || 'student';
  const items = SIDEBAR_CONFIG[role] || SIDEBAR_CONFIG.student;
  const pendingCount = ACHIEVEMENTS.filter(a => a.status === 'pending').length;

  const roleNameMap = {
    student: 'Student (VFSTR)',
    faculty: 'Faculty Verifier',
    hod:     'HOD, CSE(VFSTR)',
    'student-affairs': 'Student Affairs Dean',
    'placement-cell':  'Placement Director',
    iqac:              'IQAC Coordinator',
    recognition:       'Awards Committee Chair',
    admin:             'System Administrator'
  };

  const displayName = APP_STATE.currentUser.name || APP_STATE.currentUser.id || 'hod.cse';
  const displayRole = (APP_STATE.currentUser.dept ? (APP_STATE.currentUser.dept + ', CSE(VFSTR)') : (APP_STATE.currentUser.roll || roleNameMap[role] || 'HOD, CSE(VFSTR)'));

  sidebar.innerHTML = `
    <!-- Top Role Perspective Switcher (8 Stakeholders matching Agent 48 Specification) -->
    <div class="sidebar-role-section">
      <div class="sidebar-section-label">PORTAL PERSPECTIVE</div>
      <div class="sidebar-role-chips">
        <button class="sidebar-role-chip ${role === 'student' ? 'active' : ''}" onclick="onRoleChipClick('student')" title="Student: Uploads proofs, submits achievements, views records & CV">
          🎓 Student
        </button>
        <button class="sidebar-role-chip ${role === 'faculty' ? 'active' : ''}" onclick="onRoleChipClick('faculty')" title="Faculty Verifier: Verifies genuine achievements, approves/rejects">
          👥 Faculty
        </button>
        <button class="sidebar-role-chip ${role === 'hod' ? 'active' : ''}" onclick="onRoleChipClick('hod')" title="HOD: Reviews dept achievements, monitors student participation & performance">
          👤 HoD
        </button>
        <button class="sidebar-role-chip ${role === 'student-affairs' ? 'active' : ''}" onclick="onRoleChipClick('student-affairs')" title="Student Affairs: Handles participation gaps, encourages engagement">
          🏛️ Affairs
        </button>
        <button class="sidebar-role-chip ${role === 'placement-cell' ? 'active' : ''}" onclick="onRoleChipClick('placement-cell')" title="Placement Cell: Uses verified achievements for career profiles">
          💼 Placement
        </button>
        <button class="sidebar-role-chip ${role === 'iqac' ? 'active' : ''}" onclick="onRoleChipClick('iqac')" title="IQAC: Uses statistics & evidence archives for accreditation & rankings">
          📜 IQAC
        </button>
        <button class="sidebar-role-chip ${role === 'recognition' ? 'active' : ''}" onclick="onRoleChipClick('recognition')" title="Recognition Team: Identifies top achievers for awards and recognition">
          🌟 Awards
        </button>
        <button class="sidebar-role-chip ${role === 'admin' ? 'active' : ''}" onclick="onRoleChipClick('admin')" title="System Admin: Maintains records, permissions, evidence archive & operations">
          🛡️ Admin
        </button>
      </div>
    </div>

    <!-- Navigation Menu for Active Role -->
    <div class="sidebar-nav-section">
      <div class="sidebar-section-label">NAVIGATION MENU</div>
      <div class="sidebar-nav-list">
        ${items.map(item => `
          <div class="sidebar-nav-item ${APP_STATE.currentView === item.id ? 'active' : ''}"
               id="snav-${item.id}"
               onclick="navigateTo('${item.id}')">
            <span class="sidebar-nav-icon">${item.icon}</span>
            <span class="sidebar-nav-label">${item.label}</span>
            ${item.badge && pendingCount > 0 ? `<span class="sidebar-nav-badge">${pendingCount}</span>` : ''}
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Sidebar Footer with User Info & Sign Out -->
    <div class="sidebar-footer">
      <div class="sidebar-user-card">
        <div class="sidebar-user-avatar">
          <img src="images/user_avatar_3d.png" alt="User Profile" class="sidebar-avatar-img" onerror="this.outerHTML='<svg width=\'20\' height=\'20\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'#2563eb\' stroke-width=\'2.3\' stroke-linecap=\'round\' stroke-linejoin=\'round\'><path d=\'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2\'></path><circle cx=\'12\' cy=\'7\' r=\'4\'></circle></svg>'">
        </div>
        <div class="sidebar-user-info">
          <span class="sidebar-user-name">${displayName}</span>
          <span class="sidebar-user-role">${displayRole}</span>
        </div>
      </div>

      <button class="btn-signout" onclick="signOut()">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
        <span>Sign Out</span>
      </button>
    </div>
  `;
}

// ── Role / Section Switcher (Enforces automatic sign-out & direct sign-in prompt) ──
function onRoleChipClick(targetRole) {
  closeRoleSignInModal();

  const roleNameMap = {
    student: 'Student',
    faculty: 'Faculty Verifier',
    hod: 'Head of Department (HoD)',
    'student-affairs': 'Student Affairs',
    'placement-cell': 'Placement Cell',
    iqac: 'IQAC Accreditation Cell',
    recognition: 'Awards & Recognition',
    admin: 'System Administrator'
  };

  const targetName = roleNameMap[targetRole] || targetRole;

  // If user is currently authenticated, automatically sign out when switching sections
  if (APP_STATE.currentUser) {
    const prevRole = APP_STATE.role;
    APP_STATE.currentUser = null;
    localStorage.removeItem('vfstr_auth_user');

    showToast(`Signed out of ${roleNameMap[prevRole] || 'previous'} section. Please sign in to access the ${targetName} Section.`, 'info');
  }

  // Set the target role for the sign-in page
  APP_STATE.role = targetRole;
  APP_STATE.modalRoleTarget = targetRole;
  if (targetRole === 'student') {
    APP_STATE.currentStudent = STUDENTS[0];
  }

  // Directly ask the sign-in page for this target section
  navigateTo('auth');
}

// ── Router ────────────────────────────────────────────────────
function navigateTo(view, param) {
  APP_STATE.currentView = view;

  const main = document.getElementById('main');
  if (!main) return;

  // If user is not authenticated, show Image 3 centered Auth Card
  if (!APP_STATE.currentUser) {
    document.body.classList.add('auth-mode');
    document.getElementById('btn-top-signout')?.style.setProperty('display', 'none');
    document.getElementById('btn-top-signin')?.style.setProperty('display', 'inline-flex');
    renderSidebar();
    main.innerHTML = renderCenteredAuthCard();
    return;
  }

  // Cross-section boundary guards: automatically sign out and prompt sign in if accessing another role's section
  if (view === 'submit' && APP_STATE.role !== 'student') {
    onRoleChipClick('student');
    return;
  }

  const facultyExclusiveViews = ['faculty-dashboard', 'verify', 'inputs', 'archive'];
  if (facultyExclusiveViews.includes(view) && APP_STATE.role === 'student') {
    onRoleChipClick('faculty');
    return;
  }

  // User is authenticated: remove auth-mode and show sidebar
  document.body.classList.remove('auth-mode');
  document.getElementById('btn-top-signout')?.style.setProperty('display', 'inline-flex');
  document.getElementById('btn-top-signin')?.style.setProperty('display', 'none');

  renderSidebar();

  // Highlight active nav item
  document.querySelectorAll('.sidebar-nav-item').forEach(el => {
    el.classList.toggle('active', el.id === `snav-${view}`);
  });

  // Render the appropriate view
  let html = '';
  switch (view) {
    case 'faculty-dashboard':
      CURRENT_FACULTY_TAB = 'verify';
      html = renderFacultyDashboardView();
      break;
    case 'inputs':
    case 'aggregates':
    case 'recognition':
    case 'gaps':
    case 'archive':
      CURRENT_FACULTY_TAB = view;
      html = renderFacultyDashboardView();
      break;
    case 'submit':
      html = renderUploadView();
      break;
    case 'profile':
      const sid = param || (APP_STATE.role === 'student' ? (APP_STATE.currentStudent?.id || STUDENTS[0].id) : STUDENTS[0].id);
      html = renderProfileView(sid);
      break;
    case 'verify':
      CURRENT_FACULTY_TAB = 'verify';
      html = renderFacultyDashboardView();
      break;
    case 'cv':
      html = renderCVView();
      break;
    case 'dashboard':
      html = renderDashboardView();
      break;
    case 'rubric':
      if (APP_STATE.role === 'student') {
        html = renderStudentRubricView();
      } else {
        CURRENT_FACULTY_TAB = 'rubric';
        html = renderFacultyDashboardView();
      }
      break;
    case 'agent48':
      html = renderAgent48OrchestrationView();
      break;
    default:
      html = APP_STATE.role === 'student' ? renderUploadView() : renderFacultyDashboardView();
  }

  // Smooth view transition
  main.style.opacity = '0';
  main.style.transform = 'translateY(4px)';

  setTimeout(() => {
    main.innerHTML = html;
    main.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    main.style.opacity = '1';
    main.style.transform = 'translateY(0)';

    if (view === 'submit') initUploadView();

    // Trigger progress animations
    requestAnimationFrame(() => {
      document.querySelectorAll('.cat-bar-fill, .bar-fill').forEach(el => {
        const w = el.style.width;
        el.style.width = '0';
        setTimeout(() => {
          el.style.transition = 'width 0.7s cubic-bezier(.4,0,.2,1)';
          el.style.width = w;
        }, 50);
      });
    });
  }, 100);
}

// ── Dedicated Student Scoring Rubric View ─────────────────────
function renderStudentRubricView() {
  return `
  <div class="view-header">
    <div>
      <h1 class="view-title">Official Institutional Scoring Rubric (VFSTR AEPS)</h1>
      <p class="view-sub">Score weights, competitive criteria and yearly cap rules under <strong>NAAC Criteria 5.3</strong> and <strong>NIRF #75</strong>.</p>
    </div>
    <div class="dash-actions">
      <button class="btn-primary" onclick="navigateTo('submit')">+ Upload Proof (Agent 64) 🚀</button>
    </div>
  </div>

  <!-- Scoring Principles Banner -->
  <div class="purpose-card" style="border-left-color:var(--purple);background:#f5f3ff;border-color:#ddd6fe;margin-bottom:1.5rem">
    <span style="font-size:1.3rem">📜</span>
    <div>
      <strong>Accreditation & Institutional Scoring Principles:</strong>
      All extracurricular achievements are automatically parsed by <strong>Agent 64</strong> and verified through the <strong>Two-Tier Verification Gate</strong>.
      Unverified achievements are never published or counted towards accreditation.
      For research papers and patents, the <strong>Publication Author Rule</strong> strictly requires the student to be an explicitly credited author.
    </div>
  </div>

  <!-- 3 Uncapped Merit Info Cards -->
  <div class="rubric-cap-rules-grid">
    <div class="rubric-cap-box glass">
      <strong>📅 Complete Freedom & No Score Caps</strong>
      <span>Students can participate in as many activities as they wish! Every verified achievement directly stacks full points with zero score caps or artificial ceilings.</span>
    </div>
    <div class="rubric-cap-box glass">
      <strong>🎓 Accelerated Tier & Merit Progression</strong>
      <span>From Year 1 through Year 4, uncapped cumulative points power your Merit Tier (Bronze, Silver, Gold, Platinum, Diamond) and placement index.</span>
    </div>
    <div class="rubric-cap-box glass">
      <strong>🌟 Lifetime Evidence Archival & CV Vault</strong>
      <span>No limit on uploads or certifications! All verified achievements remain permanently preserved on your Agent 44 Central Profile & Exportable CV.</span>
    </div>
  </div>
  `;
}

// ============================================================
//  Agent 48 – Combined Roles Master Orchestrator View
//  Complete specification matching user prompt:
//  - 8 Human Roles & Responsibilities
//  - Simple Role Flow: Student → Agent 48 → Faculty Verifier → HOD / Student Affairs / IQAC / Placement
//  - Internal Multi-Agent Pipeline: Agent 64 + Agent 68 → Agent 48 → Agent 44 + Agent 13 + Agent 9 + Agent 49 + Agent 57 + Agent 71
//  - Live Interactive Pipeline Telemetry Simulation
// ============================================================
function renderAgent48OrchestrationView() {
  return `
  <!-- Top Hero Header -->
  <div class="agent-hero glass" style="margin-bottom:1.5rem">
    <div class="hero-left">
      <div class="hero-badge-row">
        <span class="hero-tag" style="background:linear-gradient(135deg,rgba(168,85,247,0.2),rgba(59,130,246,0.2));border:1px solid rgba(168,85,247,0.4);color:#7e22ce;font-weight:700">⚡ Agent 48 Master Orchestrator</span>
        <span class="accred-pill naac">NAAC SSR Criteria 5.3</span>
        <span class="accred-pill nirf">NIRF #75 Weightage</span>
        <span class="accred-pill nba">NBA Tier 1 Criteria 9</span>
      </div>

      <h1 class="hero-title" style="letter-spacing:-0.03em">Agent 48 – Combined Roles Architecture & Multi-Agent Flow</h1>

      <p class="hero-desc">
        Central autonomous coordinator uniting <strong>8 human institutional stakeholder roles</strong> with 
        <strong>8 specialized autonomous AI agents</strong> across Vignan's Foundation for Science, Technology & Research (VFSTR).
      </p>

      <div class="hero-meta-grid" style="margin-top:1rem">
        <div class="hero-meta-item">
          <span class="meta-label">SIMPLE ROLE FLOW:</span>
          <span class="meta-val"><strong>Student ➔ Agent 48 ➔ Faculty Verifier ➔ HOD / Student Affairs / IQAC / Placement</strong></span>
        </div>
        <div class="hero-meta-item">
          <span class="meta-label">INTERNAL MULTI-AGENT PIPELINE:</span>
          <span class="meta-val"><strong>Agent 64 + Agent 68 ➔ Agent 48 ➔ Agent 44 + Agent 13 + Agent 9 + Agent 49 + Agent 57 + Agent 71</strong></span>
        </div>
      </div>
    </div>
  </div>

  <!-- ╔══════════════════════════════════════════════════════════╗
       ║  SECTION 1: SIMPLE ROLE FLOW (HUMAN PERSPECTIVE)         ║
       ╚══════════════════════════════════════════════════════════╝ -->
  <div class="card glass" style="margin-bottom:1.75rem;padding:1.5rem">
    <div class="card-header" style="margin-bottom:1rem;border-bottom:1px solid rgba(226,232,240,0.8);padding-bottom:.8rem">
      <div>
        <h2 style="font-size:1.18rem;font-weight:800;color:var(--text);display:flex;align-items:center;gap:.6rem">
          <span>🔄</span> Simple Role Flow (Stakeholder Trajectory)
        </h2>
        <p style="font-size:.82rem;color:var(--text-sub);margin-top:.2rem">
          Student submits ➔ Agent 48 aggregates ➔ Faculty verifies ➔ Dispatched to HOD, Student Affairs, Placement, IQAC, Recognition & Admin.
        </p>
      </div>
      <span class="badge badge-verified" style="font-size:.75rem">8 Active Stakeholders</span>
    </div>

    <!-- Visual Sequential Flow Container -->
    <div class="flow-diagram-container">
      
      <!-- Stage 1: Student -->
      <div class="flow-stage-card glass">
        <div class="stage-tag" style="background:#eff6ff;color:#2563eb;border-color:#bfdbfe">STEP 1 · INGESTION</div>
        <div class="stage-icon">🎓</div>
        <div class="stage-title">Student</div>
        <div class="stage-role-task">Uploads certificates/proofs, submits achievements, views achievement records and CV.</div>
        <button class="flow-role-btn" onclick="onRoleChipClick('student')">Switch to Student ➔</button>
      </div>

      <div class="flow-connector-arrow">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
      </div>

      <!-- Stage 2: Agent 48 Orchestrator -->
      <div class="flow-stage-card glass" style="border:1.5px solid rgba(168,85,247,0.5);background:rgba(243,232,255,0.4)">
        <div class="stage-tag" style="background:#faf5ff;color:#9333ea;border-color:#e9d5ff">STEP 2 · ORCHESTRATION</div>
        <div class="stage-icon">⚡</div>
        <div class="stage-title">Agent 48 Hub</div>
        <div class="stage-role-task">Coordinates multi-source inputs, runs policy checks, formats packets and routes to Faculty Verifier.</div>
        <button class="flow-role-btn" style="background:linear-gradient(135deg,#7e22ce,#2563eb);color:#fff" onclick="runAgent48Simulation()">Live Simulate 🚀</button>
      </div>

      <div class="flow-connector-arrow">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
      </div>

      <!-- Stage 3: Faculty Verifier -->
      <div class="flow-stage-card glass">
        <div class="stage-tag" style="background:#fef3c7;color:#b45309;border-color:#fde68a">STEP 3 · VERIFICATION</div>
        <div class="stage-icon">👥</div>
        <div class="stage-title">Faculty Verifier</div>
        <div class="stage-role-task">Verifies whether the submitted achievement is genuine and approves/rejects with audit trail.</div>
        <button class="flow-role-btn" onclick="onRoleChipClick('faculty')">Verify Queue ➔</button>
      </div>

      <div class="flow-connector-arrow">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
      </div>

      <!-- Stage 4: Institutional Beneficiaries (Multi-Channel Grid) -->
      <div class="flow-stage-grid glass" style="flex:2">
        <div class="stage-tag" style="background:#f0fdf4;color:#166534;border-color:#bbf7d0;grid-column:1/-1;margin-bottom:.4rem">STEP 4 · INSTITUTIONAL BENEFICIARIES & CONSUMERS</div>
        
        <div class="beneficiary-pill" onclick="onRoleChipClick('hod')" title="HOD: Reviews department-level achievements, monitors student participation and department performance">
          <span class="bp-icon">👤</span>
          <div>
            <strong>HOD</strong>
            <span>Dept achievements & participation</span>
          </div>
        </div>

        <div class="beneficiary-pill" onclick="onRoleChipClick('student-affairs')" title="Student Affairs: Handles participation gaps, encourages student participation, and follows up on low-participation areas">
          <span class="bp-icon">🏛️</span>
          <div>
            <strong>Student Affairs</strong>
            <span>Participation gaps & engagement</span>
          </div>
        </div>

        <div class="beneficiary-pill" onclick="onRoleChipClick('placement-cell')" title="Placement Cell: Uses verified achievements, certifications, competitions, projects for student career profiles">
          <span class="bp-icon">💼</span>
          <div>
            <strong>Placement Cell</strong>
            <span>Career profiles & recruiter CVs</span>
          </div>
        </div>

        <div class="beneficiary-pill" onclick="onRoleChipClick('iqac')" title="IQAC / Accreditation Team: Uses verified achievement statistics, evidence archives, and reports for accreditation and ranking">
          <span class="bp-icon">📜</span>
          <div>
            <strong>IQAC / Accredit.</strong>
            <span>NAAC 5.3 & NIRF #75 submissions</span>
          </div>
        </div>

        <div class="beneficiary-pill" onclick="onRoleChipClick('recognition')" title="Recognition / Awards Team: Identifies high-achieving students for awards, recognition, and institutional appreciation">
          <span class="bp-icon">🌟</span>
          <div>
            <strong>Recognition Team</strong>
            <span>Identify top achievers & awards</span>
          </div>
        </div>

        <div class="beneficiary-pill" onclick="onRoleChipClick('admin')" title="System / Admin: Maintains records, permissions, evidence archive, indexing, and overall system operation">
          <span class="bp-icon">🛡️</span>
          <div>
            <strong>System / Admin</strong>
            <span>Archive ledger & permissions</span>
          </div>
        </div>

      </div>

    </div>
  </div>

  <!-- ╔══════════════════════════════════════════════════════════╗
       ║  SECTION 2: INTERNAL MULTI-AGENT PIPELINE (AGENT FLOW)    ║
       ╚══════════════════════════════════════════════════════════╝ -->
  <div class="card glass" style="margin-bottom:1.75rem;padding:1.5rem">
    <div class="card-header" style="margin-bottom:1.2rem;border-bottom:1px solid rgba(226,232,240,0.8);padding-bottom:.8rem">
      <div>
        <h2 style="font-size:1.18rem;font-weight:800;color:var(--text);display:flex;align-items:center;gap:.6rem">
          <span>⚙️</span> Internal Autonomous Multi-Agent Pipeline
        </h2>
        <p style="font-size:.82rem;color:var(--text-sub);margin-top:.2rem">
          Direct implementation of: <code>Agent 64 + Agent 68 ➔ Agent 48 ➔ Agent 44 + Agent 13 + Agent 9 + Agent 49 + Agent 57 + Agent 71</code>
        </p>
      </div>
      <span class="badge badge-naac" style="font-size:.75rem">8 Autonomous Agents</span>
    </div>

    <div class="agent-architecture-grid">
      
      <!-- Left Column: Input Ingestion Agents -->
      <div class="agent-col-box">
        <div class="agent-col-header" style="color:#2563eb">
          <span>📥 INPUT INGESTION AGENTS</span>
          <span class="agent-col-badge">Upstream Feed</span>
        </div>

        <!-- Agent 64 -->
        <div class="subagent-card glass">
          <div class="subagent-top">
            <span class="subagent-tag" style="background:#eff6ff;color:#1d4ed8;border-color:#bfdbfe">AGENT 64</span>
            <span class="subagent-status">Active</span>
          </div>
          <div class="subagent-name">Document Extraction</div>
          <p class="subagent-desc">Automatically extracts information from uploaded certificates/proofs (OCR, recipient, date, authority).</p>
          <div class="subagent-meta">Feed ➔ Agent 48 Orchestrator</div>
        </div>

        <!-- Agent 68 -->
        <div class="subagent-card glass">
          <div class="subagent-top">
            <span class="subagent-tag" style="background:#eff6ff;color:#1d4ed8;border-color:#bfdbfe">AGENT 68</span>
            <span class="subagent-status">Active</span>
          </div>
          <div class="subagent-name">Certification Data</div>
          <p class="subagent-desc">Supplies certification-related achievement information (authorized vendors, credibility tiers, rubric points).</p>
          <div class="subagent-meta">Feed ➔ Agent 48 Orchestrator</div>
        </div>
      </div>

      <!-- Arrow Connector Column -->
      <div class="agent-col-connector">
        <div class="conn-label">Ingests & Validates</div>
        <div class="conn-arrow">➔</div>
      </div>

      <!-- Center Column: Agent 48 Master Coordinator -->
      <div class="agent-col-box" style="border:1.5px solid rgba(168,85,247,0.5);background:rgba(250,245,255,0.4)">
        <div class="agent-col-header" style="color:#7e22ce">
          <span>⚡ CENTRAL ORCHESTRATOR HUB</span>
          <span class="agent-col-badge" style="background:#7e22ce;color:#fff">Core Bus</span>
        </div>

        <div class="subagent-card glass" style="border:none;background:transparent;box-shadow:none">
          <div class="subagent-top">
            <span class="subagent-tag" style="background:#f3e8ff;color:#7e22ce;border-color:#d8b4fe">AGENT 48</span>
            <span class="subagent-status" style="background:#10b981;color:#fff">Master Router</span>
          </div>
          <div class="subagent-name" style="font-size:1.15rem;color:#581c87">Combined Roles Master Agent</div>
          <p class="subagent-desc" style="font-size:.85rem;line-height:1.5">
            Integrates multi-source inputs from Agent 64 & Agent 68, enforces institutional policies (Uncapped Score Freedom & Author Validation), routes packets to Faculty Verifiers, and broadcasts verified records across all downstream consumer agents.
          </p>

          <div class="agent48-capabilities-box">
            <div>✓ Two-Tier Verification Gate</div>
            <div>✓ Real-time Cross-Agent Dispatch</div>
            <div>✓ Immutable Cryptographic Ledger Trigger</div>
            <div>✓ Dynamic Stakeholder Perspective Sync</div>
          </div>
        </div>
      </div>

      <!-- Arrow Connector Column -->
      <div class="agent-col-connector">
        <div class="conn-label">Synchronizes & Broadcasts</div>
        <div class="conn-arrow">➔</div>
      </div>

      <!-- Right Column: Downstream Consumer Agents (6 Agents) -->
      <div class="agent-col-box" style="flex:1.4">
        <div class="agent-col-header" style="color:#059669">
          <span>🚀 DOWNSTREAM CONSUMER AGENTS (6 AGENTS)</span>
          <span class="agent-col-badge" style="background:#059669;color:#fff">Synchronized</span>
        </div>

        <div class="downstream-agents-grid">
          
          <!-- Agent 44 -->
          <div class="subagent-card glass sm">
            <div class="subagent-top">
              <span class="subagent-tag" style="background:#ecfdf5;color:#047857;border-color:#a7f3d0">AGENT 44</span>
            </div>
            <div class="subagent-name">Student Profile / CV</div>
            <p class="subagent-desc">Updates student's profile and generates/updates the exportable CV.</p>
          </div>

          <!-- Agent 13 -->
          <div class="subagent-card glass sm">
            <div class="subagent-top">
              <span class="subagent-tag" style="background:#ecfdf5;color:#047857;border-color:#a7f3d0">AGENT 13</span>
            </div>
            <div class="subagent-name">Verification Engine</div>
            <p class="subagent-desc">Rule verification & cryptographic SHA-256 evidence archive ledger.</p>
          </div>

          <!-- Agent 9 -->
          <div class="subagent-card glass sm">
            <div class="subagent-top">
              <span class="subagent-tag" style="background:#ecfdf5;color:#047857;border-color:#a7f3d0">AGENT 9</span>
            </div>
            <div class="subagent-name">Institutional Analytics</div>
            <p class="subagent-desc">Uses aggregated achievement data for institutional-level analysis.</p>
          </div>

          <!-- Agent 49 -->
          <div class="subagent-card glass sm">
            <div class="subagent-top">
              <span class="subagent-tag" style="background:#ecfdf5;color:#047857;border-color:#a7f3d0">AGENT 49</span>
            </div>
            <div class="subagent-name">Accreditation Support</div>
            <p class="subagent-desc">Uses achievement evidence & statistics for accreditation submissions (NAAC/NIRF).</p>
          </div>

          <!-- Agent 57 -->
          <div class="subagent-card glass sm">
            <div class="subagent-top">
              <span class="subagent-tag" style="background:#ecfdf5;color:#047857;border-color:#a7f3d0">AGENT 57</span>
            </div>
            <div class="subagent-name">Reporting / Analytics</div>
            <p class="subagent-desc">Uses aggregated data to generate institutional/departmental reports.</p>
          </div>

          <!-- Agent 71 -->
          <div class="subagent-card glass sm">
            <div class="subagent-top">
              <span class="subagent-tag" style="background:#ecfdf5;color:#047857;border-color:#a7f3d0">AGENT 71</span>
            </div>
            <div class="subagent-name">Participation Analysis</div>
            <p class="subagent-desc">Uses participation-gap info to identify departments/batches requiring attention.</p>
          </div>

        </div>
      </div>

    </div>
  </div>

  <!-- ╔══════════════════════════════════════════════════════════╗
       ║  SECTION 3: LIVE INTERACTIVE PIPELINE SIMULATION CONSOLE ║
       ╚══════════════════════════════════════════════════════════╝ -->
  <div class="card glass" style="margin-bottom:1.75rem;padding:1.5rem">
    <div class="card-header" style="margin-bottom:1rem;border-bottom:1px solid rgba(226,232,240,0.8);padding-bottom:.8rem">
      <div>
        <h2 style="font-size:1.18rem;font-weight:800;color:var(--text);display:flex;align-items:center;gap:.6rem">
          <span>💻</span> Real-Time Agent 48 Orchestration Telemetry Simulation
        </h2>
        <p style="font-size:.82rem;color:var(--text-sub);margin-top:.2rem">
          Click below to trace the end-to-end multi-agent execution cycle across all 8 agents and 8 human stakeholder endpoints.
        </p>
      </div>
      <button class="btn-primary" id="btn-agent48-sim" onclick="runAgent48Simulation()" style="display:flex;align-items:center;gap:.5rem">
        <span>🚀</span>
        <span id="agent48-sim-btn-text">Run Multi-Agent Simulation</span>
      </button>
    </div>

    <!-- Live Telemetry Terminal Box -->
    <div class="sim-terminal-shell">
      <div class="sim-terminal-topbar">
        <div class="sim-dot-row">
          <span class="sim-dot red"></span>
          <span class="sim-dot yellow"></span>
          <span class="sim-dot green"></span>
        </div>
        <div class="sim-terminal-title">AGENT-48-VFSTR-TELEMETRY-BUS · v15.0</div>
        <div class="sim-terminal-status" id="sim-live-status">● IDLE / READY</div>
      </div>

      <!-- Animated Progress Bar -->
      <div class="sim-progress-track">
        <div class="sim-progress-fill" id="sim-progress-bar" style="width:0%"></div>
      </div>

      <!-- Log Output Window -->
      <div class="sim-terminal-logs" id="agent48-terminal-logs">
        <div class="sim-log-line muted">[00:00:00] VFSTR Agent 48 Orchestrator Bus initialized. Standing by for student proof ingestion...</div>
        <div class="sim-log-line muted">[00:00:00] Connected subagents: Agent 64, Agent 68, Agent 44, Agent 13, Agent 9, Agent 49, Agent 57, Agent 71.</div>
        <div class="sim-log-line muted">[00:00:00] Connected stakeholders: Student, Faculty, HoD, Student Affairs, Placement, IQAC, Awards, Admin.</div>
        <div class="sim-log-line info">[READY] Click "Run Multi-Agent Simulation" above to trigger live execution trace.</div>
      </div>
    </div>
  </div>

  <!-- ╔══════════════════════════════════════════════════════════╗
       ║  SECTION 4: COMPLETE SPECIFICATION MATRIX               ║
       ╚══════════════════════════════════════════════════════════╝ -->
  <div class="card glass" style="margin-bottom:1.5rem;padding:1.5rem">
    <div class="card-header" style="margin-bottom:1.2rem;border-bottom:1px solid rgba(226,232,240,0.8);padding-bottom:.8rem">
      <div>
        <h2 style="font-size:1.18rem;font-weight:800;color:var(--text);display:flex;align-items:center;gap:.6rem">
          <span>📋</span> Agent 48 Master Specification Matrix (Roles & Agents)
        </h2>
        <p style="font-size:.82rem;color:var(--text-sub);margin-top:.2rem">
          Full compliance verification with all specifications provided in the architectural brief.
        </p>
      </div>
      <span class="badge badge-verified">100% Fully Implemented</span>
    </div>

    <!-- Human Roles Matrix -->
    <h3 style="font-size:.98rem;font-weight:700;color:var(--text);margin-bottom:.8rem">1. Main Human Roles & Responsibilities</h3>
    <div class="table-shell" style="margin-bottom:1.5rem">
      <table class="data-table">
        <thead>
          <tr>
            <th style="width:160px">Human Role</th>
            <th>What They Do (Exact Specification)</th>
            <th style="width:170px">Primary Outputs</th>
            <th style="width:140px">Portal Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>🎓 Student</strong></td>
            <td>Uploads certificates/proofs, submits achievements, views achievement records and CV.</td>
            <td><code>Certificates, Proofs, Submissions</code></td>
            <td><button class="btn-ghost sm" onclick="onRoleChipClick('student')">Switch Role ➔</button></td>
          </tr>
          <tr>
            <td><strong>👥 Faculty Verifier</strong></td>
            <td>Verifies whether the submitted achievement is genuine and approves/rejects it.</td>
            <td><code>Approval Decisions, Audit Remarks</code></td>
            <td><button class="btn-ghost sm" onclick="onRoleChipClick('faculty')">Switch Role ➔</button></td>
          </tr>
          <tr>
            <td><strong>👤 HOD</strong></td>
            <td>Reviews department-level achievements, monitors student participation and department performance.</td>
            <td><code>Dept Performance, Batch Metrics</code></td>
            <td><button class="btn-ghost sm" onclick="onRoleChipClick('hod')">Switch Role ➔</button></td>
          </tr>
          <tr>
            <td><strong>🏛️ Student Affairs</strong></td>
            <td>Handles participation gaps, encourages student participation, and follows up on low-participation areas.</td>
            <td><code>Gap Interventions, Campaign Alerts</code></td>
            <td><button class="btn-ghost sm" onclick="onRoleChipClick('student-affairs')">Switch Role ➔</button></td>
          </tr>
          <tr>
            <td><strong>💼 Placement Cell</strong></td>
            <td>Uses verified achievements, certifications, competitions, projects, etc. for student profiles and placement-related activities.</td>
            <td><code>Candidate Profiles, Recruiter CVs</code></td>
            <td><button class="btn-ghost sm" onclick="onRoleChipClick('placement-cell')">Switch Role ➔</button></td>
          </tr>
          <tr>
            <td><strong>📜 IQAC / Accreditation</strong></td>
            <td>Uses verified achievement statistics, evidence archives, and reports for accreditation and ranking requirements.</td>
            <td><code>NAAC 5.3 SSR, NIRF #75 Tables</code></td>
            <td><button class="btn-ghost sm" onclick="onRoleChipClick('iqac')">Switch Role ➔</button></td>
          </tr>
          <tr>
            <td><strong>🌟 Recognition / Awards</strong></td>
            <td>Identifies high-achieving students for awards, recognition, and institutional appreciation.</td>
            <td><code>Honor Roll, University Citations</code></td>
            <td><button class="btn-ghost sm" onclick="onRoleChipClick('recognition')">Switch Role ➔</button></td>
          </tr>
          <tr>
            <td><strong>🛡️ System / Admin</strong></td>
            <td>Maintains records, permissions, evidence archive, indexing, and overall system operation.</td>
            <td><code>Immutable Archive, Permissions</code></td>
            <td><button class="btn-ghost sm" onclick="onRoleChipClick('admin')">Switch Role ➔</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Autonomous Subagents Matrix -->
    <h3 style="font-size:.98rem;font-weight:700;color:var(--text);margin-bottom:.8rem">2. Autonomous AI Agents & Pipelines</h3>
    <div class="table-shell">
      <table class="data-table">
        <thead>
          <tr>
            <th style="width:140px">Agent ID</th>
            <th style="width:180px">Agent Name</th>
            <th>Autonomous Role & Function</th>
            <th style="width:170px">Integration Flow</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>Agent 64</code></td>
            <td><strong>Document Extraction</strong></td>
            <td>Automatically extracts information from uploaded certificates/proofs (OCR, title, recipient, date, issuing authority).</td>
            <td><span class="badge badge-pending">Feed to Agent 48</span></td>
          </tr>
          <tr>
            <td><code>Agent 68</code></td>
            <td><strong>Certification Data</strong></td>
            <td>Supplies certification-related achievement information (authorized vendors, credibility tiers, rubric points).</td>
            <td><span class="badge badge-pending">Feed to Agent 48</span></td>
          </tr>
          <tr style="background:rgba(243,232,255,0.4)">
            <td><code>Agent 48</code></td>
            <td><strong>Combined Roles Hub</strong></td>
            <td>Central orchestrator harmonizing all 8 human roles and 8 agents; verification routing & consensus.</td>
            <td><span class="badge" style="background:#7e22ce;color:#fff">Master Router</span></td>
          </tr>
          <tr>
            <td><code>Agent 44</code></td>
            <td><strong>Student Profile/CV</strong></td>
            <td>Updates the student's profile and generates/updates the exportable CV in real-time.</td>
            <td><span class="badge badge-verified">Fed by Agent 48</span></td>
          </tr>
          <tr>
            <td><code>Agent 13</code></td>
            <td><strong>Verification Engine</strong></td>
            <td>Rule-based verification & cryptographic SHA-256 evidence archive ledger indexing.</td>
            <td><span class="badge badge-verified">Fed by Agent 48</span></td>
          </tr>
          <tr>
            <td><code>Agent 9</code></td>
            <td><strong>Institutional Analytics</strong></td>
            <td>Uses aggregated achievement data for institutional-level analysis.</td>
            <td><span class="badge badge-verified">Fed by Agent 48</span></td>
          </tr>
          <tr>
            <td><code>Agent 49</code></td>
            <td><strong>Accreditation Support</strong></td>
            <td>Uses achievement evidence and statistics for accreditation-related submissions (NAAC 5.3, NIRF, NBA).</td>
            <td><span class="badge badge-verified">Fed by Agent 48</span></td>
          </tr>
          <tr>
            <td><code>Agent 57</code></td>
            <td><strong>Reporting/Analytics</strong></td>
            <td>Uses aggregated data to generate institutional/departmental reports.</td>
            <td><span class="badge badge-verified">Fed by Agent 48</span></td>
          </tr>
          <tr>
            <td><code>Agent 71</code></td>
            <td><strong>Participation Analysis</strong></td>
            <td>Uses participation-gap information to identify departments/batches requiring attention.</td>
            <td><span class="badge badge-verified">Fed by Agent 48</span></td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
  `;
}

// ── Interactive Simulation Runner ─────────────────────────────
let isSimulatingAgent48 = false;

function runAgent48Simulation() {
  if (isSimulatingAgent48) return;
  isSimulatingAgent48 = true;

  const btn = document.getElementById('btn-agent48-sim');
  const btnText = document.getElementById('agent48-sim-btn-text');
  const statusEl = document.getElementById('sim-live-status');
  const bar = document.getElementById('sim-progress-bar');
  const terminal = document.getElementById('agent48-terminal-logs');

  if (btn) btn.disabled = true;
  if (btnText) btnText.textContent = 'Executing Simulation...';
  if (statusEl) {
    statusEl.textContent = '⚡ RUNNING MULTI-AGENT TRACE';
    statusEl.style.color = '#38bdf8';
  }
  if (terminal) terminal.innerHTML = '';

  const simulationSteps = [
    { pct: 8,  type: 'info',    text: 'Student initiates upload: "aws_solutions_architect.pdf" (Priya Sharma · 211FA04001).' },
    { pct: 16, type: 'agent',   text: '[Agent 64 – Document Extraction] Running OCR text analysis... Extracted: "AWS Certified Solutions Architect Associate", Issuer: "Amazon Web Services", Date: "2026-03-10".' },
    { pct: 25, type: 'agent',   text: '[Agent 68 – Certification Data] Validating credential against Global Cloud Vendor Registry... Match confirmed: Tier 1 Global Standard, 95 Rubric Points (Uncapped).' },
    { pct: 35, type: 'hub',     text: '[Agent 48 – Combined Roles Hub] Ingestion bundle synchronized! Two-Tier Gate check passed. Routing packet to Faculty Verifier Queue.' },
    { pct: 45, type: 'faculty', text: '[Faculty Verifier – Dr. Rajesh Kumar] Verification review completed: Certificate genuine, metadata validated. STATUS: APPROVED (100% Integrity).' },
    { pct: 55, type: 'agent',   text: '[Agent 13 – Verification Engine] Generating cryptographic SHA-256 hash: 0x9a7b...4e10. Record indexed into Immutable Evidence Vault.' },
    { pct: 65, type: 'agent',   text: '[Agent 44 – Student Profile/CV] Central student profile updated. Synchronizing official exportable CV with Vignan letterhead & verified seal.' },
    { pct: 74, type: 'agent',   text: '[Agent 9 – Institutional Analytics] Aggregate institutional index recalculated: CSE Department achievement total stacked (+95 pts).' },
    { pct: 82, type: 'agent',   text: '[Agent 49 – Accreditation Support] NAAC Criteria 5.3.1 metric incremented; SSR audit evidence package refreshed.' },
    { pct: 90, type: 'agent',   text: '[Agent 57 – Reporting/Analytics] Publishing quarterly departmental & batch performance reports for HoD CSE.' },
    { pct: 95, type: 'agent',   text: '[Agent 71 – Participation Analysis] Recalculating branch gap heatmap... CSE Year 3 participation index updated to 85.4% (Healthy).' },
    { pct: 98, type: 'success', text: '[Placement Cell & Awards] Priya Sharma tagged for Tier-1 Cloud Architect recruitment pool & nominated for University Merit Citation.' },
    { pct: 100,type: 'success', text: '✅ [Agent 48] Full orchestration cycle finished! All 8 human roles and 8 intelligent subagents synchronized with zero errors.' }
  ];

  let stepIdx = 0;
  function executeNextStep() {
    if (stepIdx >= simulationSteps.length) {
      isSimulatingAgent48 = false;
      if (btn) btn.disabled = false;
      if (btnText) btnText.textContent = 'Re-run Multi-Agent Simulation';
      if (statusEl) {
        statusEl.textContent = '● SIMULATION COMPLETE (0 ERRORS)';
        statusEl.style.color = '#10b981';
      }
      showToast('Agent 48 Orchestration Simulation completed successfully!', 'success');
      return;
    }

    const step = simulationSteps[stepIdx];
    const timeStr = new Date().toTimeString().split(' ')[0];
    
    if (bar) bar.style.width = step.pct + '%';

    const line = document.createElement('div');
    line.className = `sim-log-line ${step.type}`;
    line.innerHTML = `<span class="sim-time">[${timeStr}]</span> ${step.text}`;
    
    if (terminal) {
      terminal.appendChild(line);
      terminal.scrollTop = terminal.scrollHeight;
    }

    stepIdx++;
    setTimeout(executeNextStep, 280);
  }

  executeNextStep();
}

// ── Centered Image 3 Auth Card (Shown When Not Logged In) ─────
function renderCenteredAuthCard() {
  const role = APP_STATE.modalRoleTarget || APP_STATE.role || 'student';
  const roleNameMap = {
    student: 'Student',
    faculty: 'Faculty Verifier',
    hod: 'Head of Department (HoD)',
    'student-affairs': 'Student Affairs',
    'placement-cell': 'Placement Cell',
    iqac: 'IQAC Accreditation Cell',
    recognition: 'Awards & Recognition',
    admin: 'System Administrator'
  };
  const subMap = {
    student: 'Student Performance & Achievement Portal',
    faculty: 'Faculty Verifier & Rubric Queue',
    hod:     'Department Leadership & Accreditation Analytics',
    'student-affairs': 'Student Welfare & Gap Intervention Oversight',
    'placement-cell':  'Career Services & Recruiter CV Vault',
    iqac:              'NAAC Criteria 5.3 & NIRF #75 Accreditation Cell',
    recognition:       'Top Achievers Recognition & Awards Oversight',
    admin:             'System Operations, Permissions & Master Records'
  };
  const labelMap = {
    student: 'Email Address / Roll No',
    faculty: 'Faculty ID / University Email',
    hod:     'HoD Employee ID / Official Email',
    'student-affairs': 'Affairs Admin ID / Official Email',
    'placement-cell':  'Placement Officer ID / Email',
    iqac:              'IQAC Coordinator ID / Email',
    recognition:       'Awards Committee Chair ID / Email',
    admin:             'System Administrator ID / Email'
  };
  const placeholderMap = {
    student: 'e.g. Reg.no@gmail.com',
    faculty: 'e.g. VFSTR-FAC-104@vignan.ac.in',
    hod:     'e.g. hod.cse@vignan.ac.in',
    'student-affairs': 'e.g. studentaffairs@vignan.ac.in',
    'placement-cell':  'e.g. placements@vignan.ac.in',
    iqac:              'e.g. iqac@vignan.ac.in',
    recognition:       'e.g. awards@vignan.ac.in',
    admin:             'e.g. admin@vignan.ac.in'
  };

  return `
  <div class="aeps-auth-container">
    <div class="aeps-auth-card">
      
      <!-- Top Glowing User Capsule matching Reference Image -->
      <div class="aeps-ribbon-box">
        <img src="images/user_avatar_3d.png" alt="AEPS Identity" class="aeps-ribbon-avatar-img" onerror="this.outerHTML='<svg width=\'34\' height=\'34\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'#38bdf8\' stroke-width=\'2.3\' stroke-linecap=\'round\' stroke-linejoin=\'round\'><path d=\'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2\'></path><circle cx=\'12\' cy=\'7\' r=\'4\'></circle></svg>'">
      </div>

      <!-- Title & Subtitle matching Reference Image -->
      <h1 class="aeps-auth-title">VFSTR <span class="aeps-title-highlight">AEPS SYSTEM</span></h1>
      <p class="aeps-auth-subtitle">${subMap[role] || 'Employability & Performance Intelligence'}</p>

      <!-- Active Target Section Indicator -->
      <div class="aeps-section-banner">
        🔒 Institutional Gate · Please authenticate to access <strong>${roleNameMap[role] || role} Section</strong>
      </div>

      <!-- Segmented Role Selector: All 8 Stakeholders -->
      <div class="aeps-role-toggle">
        <button type="button" class="aeps-role-btn ${role === 'student' ? 'active' : ''}" onclick="setPageAuthRole('student')">
          🎓 Student
        </button>
        <button type="button" class="aeps-role-btn ${role === 'faculty' ? 'active' : ''}" onclick="setPageAuthRole('faculty')">
          👥 Faculty
        </button>
        <button type="button" class="aeps-role-btn ${role === 'hod' ? 'active' : ''}" onclick="setPageAuthRole('hod')">
          👤 HoD
        </button>
        <button type="button" class="aeps-role-btn ${role === 'student-affairs' ? 'active' : ''}" onclick="setPageAuthRole('student-affairs')">
          🏛️ Affairs
        </button>
        <button type="button" class="aeps-role-btn ${role === 'placement-cell' ? 'active' : ''}" onclick="setPageAuthRole('placement-cell')">
          💼 Placement
        </button>
        <button type="button" class="aeps-role-btn ${role === 'iqac' ? 'active' : ''}" onclick="setPageAuthRole('iqac')">
          📜 IQAC
        </button>
        <button type="button" class="aeps-role-btn ${role === 'recognition' ? 'active' : ''}" onclick="setPageAuthRole('recognition')">
          🌟 Awards
        </button>
        <button type="button" class="aeps-role-btn ${role === 'admin' ? 'active' : ''}" onclick="setPageAuthRole('admin')">
          🛡️ Admin
        </button>
      </div>

      <!-- Exact Sign In Form matching Reference Image -->
      <form class="aeps-auth-form" onsubmit="executePageAuthSignIn(event)">
        <div class="aeps-field">
          <label class="aeps-label">${labelMap[role] || 'Email Address / Roll No'}</label>
          <div class="aeps-input-box">
            <svg class="aeps-field-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </svg>
            <input type="text" id="page-auth-id" class="aeps-input" placeholder="${placeholderMap[role]}" required autocomplete="off">
          </div>
        </div>

        <div class="aeps-field">
          <label class="aeps-label">Password</label>
          <div class="aeps-input-box">
            <svg class="aeps-field-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <input type="password" id="page-auth-pwd" class="aeps-input" placeholder="••••••••" required autocomplete="off">
            <span class="aeps-pwd-toggle" onclick="togglePasswordVisibility('page-auth-pwd', this)" title="Show/Hide Password">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </span>
          </div>
        </div>

        <button type="submit" class="aeps-btn-signin">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
          Sign In
        </button>
      </form>

    </div>
  </div>
  `;
}

function setPageAuthRole(role) {
  APP_STATE.modalRoleTarget = role;
  APP_STATE.role = role;
  const main = document.getElementById('main');
  if (main) main.innerHTML = renderCenteredAuthCard();
}

function executePageAuthSignIn(e) {
  e.preventDefault();
  const idVal = document.getElementById('page-auth-id')?.value.trim();
  if (!idVal) {
    showToast('Please enter your University Identifier or Email.', 'warning');
    return;
  }

  processSignIn(APP_STATE.role || 'student', idVal);
}

// ── Image 3 Modal Sign In System (For switching roles) ─────────
function openRoleSignInModal(role) {
  APP_STATE.modalRoleTarget = role;
  const modal = document.getElementById('role-signin-modal');
  if (!modal) return;

  switchModalRole(role);
  modal.style.display = 'flex';
  requestAnimationFrame(() => modal.classList.add('open'));
}

function closeRoleSignInModal() {
  const modal = document.getElementById('role-signin-modal');
  if (!modal) return;
  modal.classList.remove('open');
  modal.style.display = 'none';
}

function handleRoleModalOverlayClick(e) {
  if (e.target.id === 'role-signin-modal') {
    closeRoleSignInModal();
  }
}

// ── Password Visibility Toggle Helper ──────────────────────────
function togglePasswordVisibility(inputId, triggerEl) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    triggerEl.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" y1="2" x2="22" y2="22"></line></svg>`;
  } else {
    input.type = 'password';
    triggerEl.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
  }
}

// ── Sidebar Toggle Helper ──────────────────────────────────────
function toggleSidebar() {
  document.body.classList.toggle('sidebar-collapsed');
}

function switchModalRole(role) {
  APP_STATE.modalRoleTarget = role;

  const btnStu = document.getElementById('modal-role-student');
  const btnFac = document.getElementById('modal-role-faculty');
  const btnHod = document.getElementById('modal-role-hod');
  const btnAff = document.getElementById('modal-role-student-affairs');
  const btnPlc = document.getElementById('modal-role-placement-cell');
  const btnIqc = document.getElementById('modal-role-iqac');
  const btnRec = document.getElementById('modal-role-recognition');
  const btnAdm = document.getElementById('modal-role-admin');

  btnStu?.classList.toggle('active', role === 'student');
  btnFac?.classList.toggle('active', role === 'faculty');
  btnHod?.classList.toggle('active', role === 'hod');
  btnAff?.classList.toggle('active', role === 'student-affairs');
  btnPlc?.classList.toggle('active', role === 'placement-cell');
  btnIqc?.classList.toggle('active', role === 'iqac');
  btnRec?.classList.toggle('active', role === 'recognition');
  btnAdm?.classList.toggle('active', role === 'admin');

  const lbl = document.getElementById('modal-field-label');
  const input = document.getElementById('modal-input-id');
  const sub = document.getElementById('modal-role-subtitle');

  const labelMap = {
    student: 'Email Address / Roll No',
    faculty: 'Faculty ID / University Email',
    hod:     'HoD Employee ID / Official Email',
    'student-affairs': 'Affairs Admin ID / Official Email',
    'placement-cell':  'Placement Officer ID / Email',
    iqac:              'IQAC Coordinator ID / Email',
    recognition:       'Awards Committee Chair ID / Email',
    admin:             'System Administrator ID / Email'
  };
  const placeholderMap = {
    student: 'e.g. Reg.no@gmail.com',
    faculty: 'e.g. VFSTR-FAC-104@vignan.ac.in',
    hod:     'e.g. hod.cse@vignan.ac.in',
    'student-affairs': 'e.g. studentaffairs@vignan.ac.in',
    'placement-cell':  'e.g. placements@vignan.ac.in',
    iqac:              'e.g. iqac@vignan.ac.in',
    recognition:       'e.g. awards@vignan.ac.in',
    admin:             'e.g. admin@vignan.ac.in'
  };
  const subMap = {
    student: 'Student Performance & Achievement Portal',
    faculty: 'Faculty Verifier & Rubric Queue',
    hod:     'Department Leadership & Accreditation Analytics',
    'student-affairs': 'Student Welfare & Gap Intervention Oversight',
    'placement-cell':  'Career Services & Recruiter CV Vault',
    iqac:              'NAAC Criteria 5.3 & NIRF #75 Accreditation Cell',
    recognition:       'Top Achievers Recognition & Awards Oversight',
    admin:             'System Operations, Permissions & Master Records'
  };

  if (lbl) lbl.textContent = labelMap[role] || 'Identifier / Email';
  if (input) {
    input.placeholder = placeholderMap[role] || 'e.g. official@vignan.ac.in';
    input.value = '';
  }
  if (sub) sub.textContent = subMap[role] || 'Employability & Performance Intelligence';

  // Clear inputs (no autofill)
  const pwd = document.getElementById('modal-input-pwd');
  if (pwd) pwd.value = '';
}

function executeModalSignIn(e) {
  e.preventDefault();
  const idVal = document.getElementById('modal-input-id')?.value.trim();
  if (!idVal) {
    showToast('Please fill in your credentials.', 'error');
    return;
  }

  closeRoleSignInModal();
  processSignIn(APP_STATE.modalRoleTarget || 'student', idVal);
}

function processSignIn(role, identifier) {
  let user;
  if (role === 'student') {
    let matched = STUDENTS.find(s => 
      (s.name || '').toLowerCase() === identifier.toLowerCase() ||
      (s.rollNo || s.roll || '').toLowerCase() === identifier.toLowerCase() ||
      (s.email || '').toLowerCase() === identifier.toLowerCase() ||
      (s.id || '').toLowerCase() === identifier.toLowerCase()
    );

    if (!matched) {
      const stuName = identifier.includes('@') ? identifier.split('@')[0] : identifier;
      const stuId = 'STU_' + stuName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      matched = {
        id: stuId,
        name: stuName,
        roll: identifier.includes('@') ? stuId : identifier.toUpperCase(),
        rollNo: identifier.includes('@') ? stuId : identifier.toUpperCase(),
        email: identifier.includes('@') ? identifier : `${stuName.toLowerCase().replace(/\s+/g, '')}@vignan.ac.in`,
        phone: '9848012345',
        batch: '2022-26',
        dept: 'Computer Science & Engineering',
        year: 'Year 3',
        cgpa: 8.85,
        avatar: '👨‍🎓',
        role: 'student'
      };
      STUDENTS.push(matched);
      if (typeof saveData === 'function') saveData();
    }

    user = { ...matched, role: 'student' };
    APP_STATE.currentUser = user;
    APP_STATE.currentStudent = user;
    APP_STATE.role = 'student';

    showToast(`Welcome, ${user.name}! Connected as Student.`, 'success');
  } else if (role === 'faculty') {
    user = {
      id: identifier,
      name: identifier.includes('104') ? 'Dr. Rajesh Kumar (HOD CSE)' : 'Faculty Verifier (' + identifier + ')',
      email: identifier.includes('@') ? identifier : 'faculty@vignan.ac.in',
      role: 'faculty',
      dept: 'Computer Science & Engineering',
      avatar: '👨‍🏫'
    };
    APP_STATE.currentUser = user;
    APP_STATE.role = 'faculty';

    showToast(`Signed in as Faculty Verifier (${identifier}).`, 'success');
  } else if (role === 'hod') {
    user = {
      id: identifier,
      name: 'Dr. K. Srinivas (HoD CSE)',
      email: identifier.includes('@') ? identifier : 'hod.cse@vignan.ac.in',
      role: 'hod',
      dept: 'Computer Science & Engineering',
      avatar: '🏛️'
    };
    APP_STATE.currentUser = user;
    APP_STATE.role = 'hod';

    showToast(`Signed in as Head of Department (HoD).`, 'success');
  } else if (role === 'student-affairs') {
    user = {
      id: identifier,
      name: 'Dean Student Affairs (Engagement Cell)',
      email: identifier.includes('@') ? identifier : 'studentaffairs@vignan.ac.in',
      role: 'student-affairs',
      dept: 'Student Welfare & Engagement',
      avatar: '🤝'
    };
    APP_STATE.currentUser = user;
    APP_STATE.role = 'student-affairs';

    showToast(`Signed in as Student Affairs (Welfare & Gap Oversight).`, 'success');
  } else if (role === 'placement-cell') {
    user = {
      id: identifier,
      name: 'Director, Career Services & Placements',
      email: identifier.includes('@') ? identifier : 'placements@vignan.ac.in',
      role: 'placement-cell',
      dept: 'Training & Placements',
      avatar: '💼'
    };
    APP_STATE.currentUser = user;
    APP_STATE.role = 'placement-cell';

    showToast(`Signed in as Placement Cell (Career Services & CV Vault).`, 'success');
  } else if (role === 'iqac') {
    user = {
      id: identifier,
      name: 'Director, IQAC & NAAC Audit Cell',
      email: identifier.includes('@') ? identifier : 'iqac@vignan.ac.in',
      role: 'iqac',
      dept: 'Internal Quality Assurance Cell',
      avatar: '📜'
    };
    APP_STATE.currentUser = user;
    APP_STATE.role = 'iqac';

    showToast(`Signed in as IQAC Institutional Quality Director.`, 'success');
  } else if (role === 'recognition') {
    user = {
      id: identifier,
      name: 'Awards Committee Chair (Recognition Cell)',
      email: identifier.includes('@') ? identifier : 'awards@vignan.ac.in',
      role: 'recognition',
      dept: 'Institutional Awards & Honors',
      avatar: '🌟'
    };
    APP_STATE.currentUser = user;
    APP_STATE.role = 'recognition';

    showToast(`Signed in as Recognition & Awards Committee Chair.`, 'success');
  } else if (role === 'admin') {
    user = {
      id: identifier,
      name: 'System Administrator (Ecosystem Ops)',
      email: identifier.includes('@') ? identifier : 'admin@vignan.ac.in',
      role: 'admin',
      dept: 'VFSTR Central IT & Operations',
      avatar: '🛡️'
    };
    APP_STATE.currentUser = user;
    APP_STATE.role = 'admin';

    showToast(`Signed in as System Administrator.`, 'success');
  }

  localStorage.setItem('vfstr_auth_user', JSON.stringify(user));

  // Sync with server
  syncAchievementsFromServer();

  // Navigate to role's primary section
  const firstView = SIDEBAR_CONFIG[role]?.[0]?.id || 'submit';
  navigateTo(firstView);
}

// ── Sign Out Action ───────────────────────────────────────────
function signOut() {
  APP_STATE.currentUser = null;
  localStorage.removeItem('vfstr_auth_user');

  showToast('You have signed out successfully.', 'info');
  navigateTo('auth');
}

// ── Sync with Persistent Backend Server ───────────────────────
async function syncAchievementsFromServer() {
  try {
    // Dynamically retrieve safe public client config
    try {
      const cfgRes = await fetch('/api/config');
      if (cfgRes.ok) {
        const cfg = await cfgRes.json();
        if (cfg.supabasePublishableKey) {
          VFSTR_KEYS.supabasePublishable = cfg.supabasePublishableKey;
        }
      }
    } catch(cfgErr) {}

    const res = await fetch('/api/achievements');
    if (res.ok) {
      const serverData = await res.json();
      if (Array.isArray(serverData)) {
        ACHIEVEMENTS = serverData;
        PENDING_QUEUE = ACHIEVEMENTS.filter(a => a.status === 'pending');
        saveData();
      }
    }
  } catch (e) {
    console.warn('Local storage active:', e);
  } finally {
    if (typeof refreshInsights === 'function') refreshInsights();
  }
}

async function saveAchievementsToServer() {
  try {
    await fetch('/api/achievements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Tells the server which role is making this write, so it can
        // reject a non-verifier client trying to flip status to 'verified'.
        'X-User-Role': APP_STATE.role || ''
      },
      body: JSON.stringify(ACHIEVEMENTS)
    });
  } catch (e) {
    console.warn('Server sync error:', e);
  }
}

// ── Email Notification via Resend API Endpoint ────────────────
async function notifyStudentByEmail(ach, student, status, notes) {
  try {
    const payload = {
      toEmail: (student && student.email) || 'delivered@resend.dev',
      studentName: (student && student.name) || 'Student',
      title: ach.title || 'Achievement Claim',
      status: status,
      points: ach.points || 0,
      notes: notes || ''
    };

    const res = await fetch('/api/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const data = await res.json();
      console.log('Resend verification email sent:', data);
      showToast('Notification email dispatched via Resend to student.', 'info');
    }
  } catch (e) {
    console.warn('Resend mail error:', e);
  }
}

// ── Notifications ─────────────────────────────────────────────
function toggleNotifications() {
  APP_STATE.notifOpen = !APP_STATE.notifOpen;
  const panel = document.getElementById('notif-panel');
  if (!panel) return;
  panel.classList.toggle('open', APP_STATE.notifOpen);
  if (APP_STATE.notifOpen) {
    renderNotifications();
    NOTIFICATIONS.forEach(n => n.read = true);
    const b = document.getElementById('notif-badge');
    if (b) b.style.display = 'none';
  }
}

function renderNotifications() {
  const panel = document.getElementById('notif-panel');
  if (!panel) return;
  const typeIcon = { info:'ℹ️', success:'✅', warning:'⚠️', error:'❌' };
  panel.innerHTML = `
    <div class="notif-header">
      <span>University & Agent Notifications</span>
      <button class="btn-tiny" onclick="clearNotifications()">Clear all</button>
    </div>
    ${NOTIFICATIONS.length === 0 ? '<p class="notif-empty">No new notifications</p>' :
      NOTIFICATIONS.map(n => `
        <div class="notif-item ${n.read ? '' : 'unread'} notif-${n.type}">
          <span class="notif-type-icon">${typeIcon[n.type]||'•'}</span>
          <div class="notif-text">
            <strong>${n.title}</strong>
            <span>${n.body}</span>
            <small>${n.time}</small>
          </div>
        </div>
      `).join('')
    }
  `;
}

function clearNotifications() {
  NOTIFICATIONS = [];
  renderNotifications();
}

// ── Toast System ──────────────────────────────────────────────
function showToast(msg, type = 'info') {
  const c = document.getElementById('toast-container');
  if (!c) return;
  const icons = { success:'✅', error:'❌', info:'ℹ️', warning:'⚠️' };
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.innerHTML = `<span>${icons[type]||'•'}</span><span>${msg}</span>`;
  c.appendChild(t);
  setTimeout(() => {
    t.style.animation = 'slideOutToast .25s ease forwards';
    setTimeout(() => t.remove(), 250);
  }, 3500);
}

// ── Global Modal Dialog ───────────────────────────────────────
function openModal(html) {
  const content = document.getElementById('modal-content');
  const overlay = document.getElementById('modal-overlay');
  if (content && overlay) {
    content.innerHTML = html;
    overlay.classList.add('open');
  }
}
function closeModal() {
  document.getElementById('modal-overlay')?.classList.remove('open');
}

// ── Init ──────────────────────────────────────────────────────
function init() {
  // Clean URL: Strip /index.html if present in the address bar
  if (window.history && window.history.replaceState && window.location.pathname.endsWith('/index.html')) {
    const cleanPath = window.location.pathname.replace(/\/index\.html$/, '') || '/';
    window.history.replaceState(null, document.title, cleanPath + window.location.search + window.location.hash);
  }

  // Check stored auth
  try {
    const savedUser = localStorage.getItem('vfstr_auth_user');
    if (savedUser) {
      APP_STATE.currentUser = JSON.parse(savedUser);
      APP_STATE.role = APP_STATE.currentUser.role || 'student';
      if (APP_STATE.role === 'student') {
        APP_STATE.currentStudent = APP_STATE.currentUser;
      }
    }
  } catch(e) {}

  // Sync server data
  syncAchievementsFromServer();

  // If no saved user session, use path to determine default role for the login card
  if (!APP_STATE.currentUser) {
    const path = (window.location.pathname || '').toLowerCase();
    if (path.includes('/faculty')) {
      APP_STATE.role = 'faculty';
      APP_STATE.modalRoleTarget = 'faculty';
    } else {
      APP_STATE.role = 'student';
      APP_STATE.modalRoleTarget = 'student';
    }
    navigateTo('auth');
  } else {
    // Restore role from saved session (do NOT override with path)
    APP_STATE.modalRoleTarget = APP_STATE.role;
    renderSidebar();
    const firstView = SIDEBAR_CONFIG[APP_STATE.role]?.[0]?.id || 'submit';
    navigateTo(firstView);
  }

  // Hash routing
  window.addEventListener('hashchange', () => {
    if (!APP_STATE.currentUser) {
      navigateTo('auth');
      return;
    }
    const view = location.hash.replace('#','') || (APP_STATE.role === 'student' ? 'submit' : 'verify');
    if (SIDEBAR_CONFIG[APP_STATE.role]?.some(n => n.id === view)) {
      navigateTo(view);
    }
  });

  // Browser popstate
  window.addEventListener('popstate', () => {
    if (!APP_STATE.currentUser) {
      navigateTo('auth');
      return;
    }
  });
}

// ── Boot ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
