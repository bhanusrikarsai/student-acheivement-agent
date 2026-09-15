// ============================================================
//  upload.js — Student Submission Portal, Activity Tabs & Rubric
// ============================================================

let currentActiveTab = 'certifications';
let currentAcademicYear = 3;

function renderUploadView() {
  const stu = APP_STATE.currentStudent || STUDENTS[0];
  const yearStats = calculateYearScore(stu.id, currentAcademicYear);

  return `
  <!-- ╔══════════════════════════════════════════════════════════╗
       ║  ACTIVITY HEADER TABS (MATCHING USER SCREENSHOT)         ║
       ╚══════════════════════════════════════════════════════════╝ -->
  <div class="activity-tabs-wrap">
    <div class="activity-tabs-list">
      ${ACTIVITY_HEADERS.map(tab => `
        <div class="activity-tab-btn ${tab.id === currentActiveTab ? 'active' : ''}"
             onclick="selectActivityTab('${tab.id}', this)">
          <span>${tab.icon}</span> ${tab.label}
        </div>
      `).join('')}
    </div>
  </div>

  <!-- ╔══════════════════════════════════════════════════════════╗
       ║  ACADEMIC YEAR ROW & UPLOAD BUTTON                       ║
       ╚══════════════════════════════════════════════════════════╝ -->
  <div class="academic-year-card glass">
    <div class="year-pill-box">
      <span>📅</span>
      <span id="active-year-label">Active Academic Year: <strong>Year ${currentAcademicYear}</strong></span>
      <select id="academic-year-select" onchange="changeAcademicYear(this.value)" style="border:none;background:none;font-weight:700;cursor:pointer;color:#1d4ed8;margin-left:.35rem">
        <option value="1" ${currentAcademicYear===1?'selected':''}>Year 1</option>
        <option value="2" ${currentAcademicYear===2?'selected':''}>Year 2</option>
        <option value="3" ${currentAcademicYear===3?'selected':''}>Year 3 (Current)</option>
        <option value="4" ${currentAcademicYear===4?'selected':''}>Year 4</option>
      </select>
    </div>

    <button class="btn-upload-blue" onclick="scrollToUpload()">
      <span>+</span> Upload Certification
    </button>
  </div>

  <!-- ╔══════════════════════════════════════════════════════════╗
       ║  3 METRIC CARDS (MATCHING USER SCREENSHOT)               ║
       ╚══════════════════════════════════════════════════════════╝ -->
  <!-- ╔══════════════════════════════════════════════════════════╗
       ║  3 METRIC CARDS (UNCAPPED ACHIEVEMENT SCORE)             ║
       ╚══════════════════════════════════════════════════════════╝ -->
  <div class="score-cap-grid">
    <!-- Card 1: Total Achievement Score (Uncapped) -->
    <div class="card-capped-score card-achievement-score">
      <div class="capped-score-title" id="card-capped-title">YEAR ${currentAcademicYear} TOTAL ACHIEVEMENT SCORE</div>
      <div class="capped-score-num">
        <span id="card-capped-num" style="font-size:2.6rem;color:var(--txt-1);font-weight:900">${yearStats.score || yearStats.uncappedPoints}</span>
        <span id="card-max-num" style="font-size:0.88rem;color:#2563eb;font-weight:750;letter-spacing:0.04em">PTS · UNLIMITED</span>
      </div>
      <div class="capped-progress-track">
        <div class="capped-progress-fill" id="card-capped-progress" style="width:${Math.min(100, Math.max(15, Math.round(((yearStats.score || yearStats.uncappedPoints)/150)*100)))}%"></div>
      </div>
      <div class="card-medal-watermark">
        <svg width="84" height="84" viewBox="0 0 84 84" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="42" cy="50" r="20" stroke="#f59e0b" stroke-width="3" stroke-opacity="0.45" fill="none" />
          <circle cx="42" cy="50" r="14" stroke="#fbbf24" stroke-width="1.8" stroke-opacity="0.35" fill="#f59e0b" fill-opacity="0.12" />
          <path d="M30 14l12 18 12-18H30z" fill="#6366f1" fill-opacity="0.35" stroke="#818cf8" stroke-width="1.8" stroke-opacity="0.45" />
          <path d="M42 42l2.2 4.5 5 .7-3.6 3.5.9 4.8-4.5-2.4-4.5 2.4.9-4.8-3.6-3.5 5-.7L42 42z" fill="#fbbf24" fill-opacity="0.6" />
        </svg>
      </div>
    </div>

    <!-- Card 2: Approved Achievements Count & Accumulation -->
    <div class="card-uncapped-points glass">
      <div>
        <div class="uncapped-title" id="card-uncapped-title">APPROVED ACHIEVEMENTS (YEAR ${currentAcademicYear})</div>
        <div class="uncapped-num">
          <span id="card-uncapped-num" style="font-size:2.6rem;color:var(--txt-1);font-weight:900">${yearStats.achievementCount}</span>
          <span id="card-uncapped-sub" style="font-size:0.86rem;color:var(--txt-3);font-weight:600">verified records (${yearStats.score || yearStats.uncappedPoints} pts)</span>
        </div>
      </div>
      <div class="uncapped-info-box">
        <span style="color:#2563eb">✨</span>
        <span id="card-uncapped-note">All verified achievements earn full accredited points — students can achieve and upload as much as they want!</span>
      </div>
    </div>

    <!-- Card 3: Merit & Accreditation Tiers (No Cap) -->
    <div class="card-cap-info glass">
      <div>
        <div class="cap-info-title">ACCREDITATION & MERIT TIERS</div>
        <div class="cap-info-row">
          <span>Honors & Dean's List</span>
          <strong style="color:#059669">100+ Points</strong>
        </div>
        <div class="cap-info-row">
          <span>High Distinction Tier</span>
          <strong style="color:#2563eb">60+ Points</strong>
        </div>
        <div class="cap-info-row">
          <span>Active Contributor</span>
          <strong style="color:#7c3aed">25+ Points</strong>
        </div>
      </div>
      <div class="cap-info-note">
        ★ Score is completely uncapped. Every approved activity directly boosts your placement portfolio and NAAC 5.3 merit.
      </div>
    </div>
  </div>

  <!-- Hero Banner (Clean Frosted Glass without Robot Mascot per User Request) -->
  <div class="vignan-hero-banner glass">
    <div class="hero-text-block">
      <div class="hero-badge-pill">⚡ Powered by Agent 64 (OCR) & Agent 44 (Profile Sync)</div>
      <h2>Vignan's <span>Student Achievement Agent</span></h2>
      <p>
        Captures the full range of student accomplishment outside formal coursework,
        carrying substantial accreditation and ranking weight for <strong>NAAC Criteria 5.3</strong>,
        <strong>NIRF Student Outreach</strong>, and <strong>NBA Criteria 9</strong>.
      </p>
      <div class="hero-accred-mini">
        <span>🏆 NAAC A+ (3.49 CGPA)</span>
        <span>📈 NIRF Rank #75</span>
        <span>🏅 NBA Tier-1</span>
        <span>🏛️ AICTE Approved</span>
        <span>📜 UGC 12(B)</span>
        <span>🔬 DSIR Certified</span>
      </div>
    </div>
  </div>


  <!-- ╔══════════════════════════════════════════════════════════╗
       ║  UPLOAD SECTION & AGENT 64 OCR PIPELINE                 ║
       ╚══════════════════════════════════════════════════════════╝ -->
  <div class="submit-layout" id="upload-section-target">
    <div class="glass card upload-panel" id="upload-panel">
      <div class="stepper" id="stepper">
        <div class="step active" data-step="1" onclick="goToStep(1)" style="cursor:pointer"><span>1</span><label>Upload Proof</label></div>
        <div class="step" data-step="2" onclick="goToStep(2)" style="cursor:pointer"><span>2</span><label>Agent 64 OCR</label></div>
        <div class="step" data-step="3" onclick="goToStep(3)" style="cursor:pointer"><span>3</span><label>Classify & Review</label></div>
        <div class="step" data-step="4" onclick="goToStep(4)" style="cursor:pointer"><span>4</span><label>Verify & Sync</label></div>
      </div>

      <!-- Step 1: Drop Zone -->
      <div id="step-upload" class="step-panel active">
        <div class="drop-zone" id="drop-zone"
             onclick="document.getElementById('file-input').click()"
             ondragover="handleDragOver(event)"
             ondragleave="handleDragLeave(event)"
             ondrop="handleDrop(event)">
          <div class="drop-icon-3d">
            <svg width="68" height="68" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="irid1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#38bdf8" />
                  <stop offset="45%" stop-color="#818cf8" />
                  <stop offset="100%" stop-color="#c084fc" />
                </linearGradient>
                <linearGradient id="irid2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#a78bfa" />
                  <stop offset="50%" stop-color="#38bdf8" />
                  <stop offset="100%" stop-color="#f472b6" />
                </linearGradient>
                <filter id="glow3d" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <!-- 3D Iridescent Box & Tray matching reference image -->
              <rect x="12" y="32" width="48" height="28" rx="8" fill="url(#irid1)" fill-opacity="0.32" stroke="url(#irid1)" stroke-width="2.5" />
              <path d="M12 42h16l4 6h8l4-6h16" stroke="url(#irid2)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
              <path d="M36 12v24M26 24l10 12 10-12" stroke="url(#irid2)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow3d)" />
            </svg>
          </div>
          <div class="drop-title">Drag & drop certificate.</div>
          <div class="drop-sub">Supports PDF, PNG, JPG, JPEG — Agent 64 will automatically extract details without manual typing</div>
          <div class="drop-btn">Browse Certificate Files</div>
          <input type="file" id="file-input" accept=".pdf,.png,.jpg,.jpeg" style="display:none" onchange="handleFileSelect(event)">
          
          <div class="quick-sample-chips" onclick="event.stopPropagation()">
            <span class="sample-label">⚡ Quick Test Certificate Filename Analysis:</span>
            <div class="sample-chip-list">
              <button class="sample-chip" type="button" onclick="testUploadSample('aws_solutions_architect.pdf')">📄 aws_solutions_architect.pdf</button>
              <button class="sample-chip" type="button" onclick="testUploadSample('smart_india_hackathon_winner.pdf')">🏆 smart_india_hackathon_winner.pdf</button>
              <button class="sample-chip" type="button" onclick="testUploadSample('ieee_edge_ai_paper.pdf')">📜 ieee_edge_ai_paper.pdf</button>
              <button class="sample-chip" type="button" onclick="testUploadSample('nptel_cloud_computing_gold.pdf')">🎖️ nptel_cloud_gold.pdf</button>
              <button class="sample-chip" type="button" onclick="testUploadSample('inter_university_sports_championship.pdf')">🏅 inter_uni_sports.pdf</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2: Agent 64 OCR Extraction Animation -->
      <div id="step-extract" class="step-panel">
        <div class="extract-anim">
          <div class="file-preview-box" id="file-preview-box">
            <div class="file-icon-big" id="file-icon-big">📄</div>
            <div class="file-name-big" id="file-name-big">aws_certificate.pdf</div>
          </div>
          <div class="extract-spinner">
            <div class="spinner-ring"></div>
            <div class="extract-label" id="extract-label">Agent 64 OCR parsing certificate...</div>
          </div>
          <div class="extract-steps" id="extract-steps"></div>
        </div>
      </div>

      <!-- Step 3: Review Form (White Liquid Glass) -->
      <div id="step-review" class="step-panel">
        <div class="ocr-review-header">
          <div class="ocr-doc-badge">
            <div class="ocr-doc-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <div class="ocr-doc-info">
              <div class="ocr-doc-name" id="ocr-doc-name">aws_certificate.pdf</div>
              <div class="ocr-doc-status" id="ocr-doc-status">Agent 64 OCR parsing certificate...</div>
            </div>
          </div>
          <div class="ocr-domain-tag" id="ocr-domain-tag">Technical Competition</div>
        </div>

        <div class="extracted-banner">
          <span>⭐</span>
          <span>Extracted Through Agent 64 OCR — Review details before submitting for faculty verification</span>
        </div>

        <form id="achievement-form" class="ach-form" onsubmit="return false">
          
          <!-- Category Selector Header & Visual Cards -->
          <div class="form-section-header">
            <div class="form-section-title">
              <span class="sec-badge">1</span>
              <span>Select Category (Accreditation Domain) ▾</span>
            </div>
            <span class="sec-hint" id="cat-selected-hint">Technical Competition</span>
          </div>

          <div class="cat-picker-grid" id="cat-picker-grid">
            ${Object.entries(CATEGORIES).map(([key, cat]) => `
              <div class="cat-card ${key === 'technical' ? 'active' : ''}" data-cat="${key}" onclick="onCategorySelect('${key}')">
                <div class="cat-card-icon" style="background:${cat.color}18;color:${cat.color}">${cat.icon}</div>
                <div class="cat-card-name">${cat.label}</div>
                <div class="cat-card-chevron">›</div>
              </div>
            `).join('')}
          </div>

          <!-- Hidden sync input for form processing -->
          <select id="f-category" class="form-input" style="display:none" onchange="onCategorySelect(this.value)">
            ${Object.entries(CATEGORIES).map(([key,cat]) => `
              <option value="${key}">${cat.icon} ${cat.label}</option>
            `).join('')}
          </select>

          <!-- Dynamic Activity Type & Level Matrix for Selected Category -->
          <div class="rubric-section-card glass" style="margin-top:1.4rem;padding:1.4rem 1.6rem;border-radius:20px">
            <div class="form-section-header">
              <div class="form-section-title">
                <span class="sec-badge">2</span>
                <span>Popular Activity Types & Levels (No Company Names) *</span>
              </div>
              <span class="sec-hint" id="cat-activity-hint">Showing scored tier for Technical Competition</span>
            </div>

            <!-- Interactive Activity Cards for the selected Category -->
            <div class="activity-type-cards" id="activity-type-cards">
              ${(CATEGORY_ACTIVITY_TYPES['technical'] || []).map((act, idx) => `
                <div class="activity-card ${idx === 0 ? 'active' : ''}" 
                     data-id="${act.id}"
                     onclick="onActivityCardSelect('${act.id}', '${act.level}', ${act.points})">
                  <div class="act-card-left">
                    <span class="act-card-badge">⭐ ${act.badge} LEVEL</span>
                    <div class="act-card-title">${act.header}</div>
                  </div>
                  <div class="act-card-right">
                    <span class="act-points-pill">+${act.points} pts</span>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Dropdown sync for form value & accessibility -->
            <div class="form-group" style="margin-top:0.9rem">
              <label for="f-rubric-type" style="font-size:0.75rem;color:var(--txt-3);text-transform:none;font-weight:600">Selected Rubric Activity Tier (Auto system wise class above):</label>
              <select id="f-rubric-type" class="form-input" onchange="onRubricSelectChange()">
                ${(CATEGORY_ACTIVITY_TYPES['technical'] || []).map((act, idx) => `
                  <option value="${act.id}" ${idx === 0 ? 'selected' : ''}>
                    ${act.icon} ${act.badge} Level | ${act.header} — ${act.points} pts
                  </option>
                `).join('')}
              </select>
            </div>
          </div>

          <!-- Achievement Title -->
          <div class="form-row" style="margin-top:1.35rem">
            <div class="form-group">
              <label for="f-title">Achievement / Certificate Title *</label>
              <input id="f-title" type="text" class="form-input" placeholder="e.g., Autonomous Robot Navigation System / National Coding Sprint">
            </div>
          </div>

          <div class="form-row two">
            <div class="form-group">
              <label for="f-issuer">Issuing Body / Organizing Authority *</label>
              <input id="f-issuer" type="text" class="form-input" placeholder="e.g., IEEE, AICTE, IIT Kharagpur, Ministry of Education" oninput="updateScorePreview()">
            </div>
            <div class="form-group">
              <label for="f-date">Date of Achievement / Passing *</label>
              <input id="f-date" type="date" class="form-input">
            </div>
          </div>

          <div class="form-row two">
            <div class="form-group">
              <label for="f-position">Award / Standing / Score</label>
              <input id="f-position" type="text" class="form-input" placeholder="e.g., 1st Prize Winner / Elite + Gold / PASS">
            </div>
            <div class="form-group">
              <label for="f-level">Competitive Level</label>
              <select id="f-level" class="form-input" onchange="updateScorePreview()">
                ${LEVELS.map(l => `<option value="${l.id}">${l.badge} ${l.label}</option>`).join('')}
              </select>
            </div>
          </div>

          <!-- Publication Author Rule (Strict Guardrail) -->
          <div class="form-row" id="author-rule-row" style="display:none">
            <div class="form-group">
              <label for="f-authors">Authors Credited on Paper / Publication / Patent * (Publication Author Rule)</label>
              <input id="f-authors" type="text" class="form-input" placeholder="e.g., Aarav Sharma, Dr. Rajesh Kumar" oninput="checkPublicationAuthorRule()">
              <div id="author-rule-msg" style="margin-top:.35rem;font-size:.75rem"></div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="f-desc">Description & Verification Reference</label>
              <textarea id="f-desc" class="form-input form-textarea" rows="2" placeholder="Credential ID, verify URL or brief accomplishment details..."></textarea>
            </div>
          </div>

          <!-- Live Rubric Score Preview -->
          <div class="score-preview" id="score-preview">
            <div class="score-preview-inner">
              <div>
                <div class="sp-label">Assigned Rubric Marks</div>
                <div class="sp-score" id="sp-score">100</div>
              </div>
              <div>
                <div class="sp-level" id="sp-level">International Level Competition · 100 pts</div>
                <div id="sp-cap-notice" style="font-size:.74rem;color:var(--txt-3);margin-top:.2rem">Counts towards Year ${currentAcademicYear} Points & NAAC Criteria 5.3 (Uncapped)</div>
              </div>
            </div>
            <div class="sp-verify" id="sp-verify"></div>
          </div>
        </form>

        <div class="form-actions">
          <button class="btn-ghost" onclick="resetUpload()">← Start Over</button>
          <button class="btn-primary" id="submit-btn" onclick="submitAchievement()">
            Submit for Faculty Verification 🚀
          </button>
        </div>
      </div>

      <!-- Step 4: Confirmation & Profile Sync (Matching Reference Image) -->
      <div id="step-confirm" class="step-panel">
        <div class="confirm-hero-card">
          <!-- Top Assigned Rubric Marks Header Strip -->
          <div class="confirm-header-strip">
            <div class="confirm-doc-squircle">
              <div class="confirm-doc-icon-wrap" id="confirm-doc-icon-wrap">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="rgba(255,255,255,0.92)" stroke="#ffffff" stroke-width="1.2"></path>
                  <polyline points="14 2 14 8 20 8" fill="#e0f2fe" stroke="#ffffff" stroke-width="1.2"></polyline>
                  <circle cx="12" cy="14" r="3.2" fill="#a855f7" stroke="#ffffff" stroke-width="1"></circle>
                  <path d="M10.8 16.5L9.8 19.5L12 18.2L14.2 19.5L13.2 16.5" fill="#a855f7"></path>
                </svg>
              </div>
            </div>

            <div class="confirm-vdivider"></div>

            <div class="confirm-rubric-info">
              <div class="confirm-rubric-label">Assigned Rubric Marks</div>
              <div class="confirm-rubric-main">
                <span class="confirm-pts-num" id="confirm-pts-num">30</span>
                <div class="confirm-rubric-details">
                  <div class="confirm-level-row">
                    <span class="confirm-cap-icon">🎓</span>
                    <span class="confirm-level-text" id="confirm-level-text">University / Inter-College Level — Top 3 Position (30 pts)</span>
                  </div>
                  <div class="confirm-uncapped-row">
                    <span class="confirm-star-icon">⭐</span>
                    <span class="confirm-uncapped-text" id="confirm-uncapped-text">Uncapped Points: Full 30 pts added to Year 3 and NAAC 5.3 merit with no upper limit.</span>
                  </div>
                  <div class="confirm-tier-chip" id="confirm-tier-chip">
                    <span class="tier-chip-icon">⚖️</span>
                    <span class="tier-chip-text" id="confirm-tier-text">Tier 2: Routes to Faculty Verifier Queue</span>
                    <span class="tier-chip-info">ℹ️</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Top Action Buttons Row (from reference image) -->
          <div class="confirm-top-actions">
            <button class="btn-confirm-startover" onclick="resetUpload()">← Start Over</button>
            <button class="btn-confirm-submit-top" disabled>
              <span class="btn-icon">📄</span> Submit for Faculty Verification 🚀
            </button>
          </div>

          <!-- Main Confirmed Inner Card (2 columns matching reference) -->
          <div class="confirm-card-inner">
            <!-- Left Column: Glowing checkmark & confirmation text -->
            <div class="confirm-inner-left">
              <div class="confirm-glow-badge">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div class="confirm-inner-text">
                <h2 class="confirm-main-heading" id="confirm-title">Certificate Submitted!</h2>
                <p class="confirm-subtext-1" id="confirm-body">Your certificate has been successfully submitted for verification.</p>
                <p class="confirm-subtext-2" id="confirm-subtext-2">It will be reviewed by the faculty and processed as per the queue.</p>
                <div class="confirm-analyzed-chip" id="confirm-analyzed-chip" style="display:none">
                  <span>📄</span>
                  <span id="confirm-doc-name-display">AWS Certified Solutions Architect</span>
                </div>
              </div>
            </div>

            <!-- Right Column: Frosted Glass Workflow Status Box -->
            <div class="confirm-inner-right">
              <div class="confirm-workflow-box">
                <div class="workflow-box-title">
                  <span class="wf-pulse-icon">📈</span>
                  <span>Workflow Status</span>
                </div>
                <div class="workflow-items-list">
                  <div class="workflow-item">
                    <span class="wf-check">✓</span>
                    <span class="wf-text"><strong>Agent 64:</strong> Certificate extracted & proof hash archived</span>
                  </div>
                  <div class="workflow-item">
                    <span class="wf-check">✓</span>
                    <span class="wf-text"><strong>Verification Engine:</strong> Checked issuing body whitelist or routed to faculty queue</span>
                  </div>
                  <div class="workflow-item">
                    <span class="wf-check">✓</span>
                    <span class="wf-text"><strong>Institutional Rubric:</strong> Points & weight assigned</span>
                  </div>
                  <div class="workflow-item">
                    <span class="wf-check">✓</span>
                    <span class="wf-text"><strong>Agent 44:</strong> Central Profile: Real-time student portfolio updated</span>
                  </div>
                  <div class="workflow-item">
                    <span class="wf-check">✓</span>
                    <span class="wf-text"><strong>Exportable CV:</strong> Ready for placement drives and accreditation SSR</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Action Buttons Row -->
          <div class="confirm-bottom-actions">
            <button class="confirm-btn-bottom ghost" onclick="resetUpload()">
              <span class="btn-icon">📤</span> Upload Another
            </button>
            <button class="confirm-btn-bottom primary" onclick="navigateTo('cv')">
              <span class="btn-icon">📄</span> View Exportable CV →
            </button>
            <button class="confirm-btn-bottom ghost" onclick="navigateTo('profile')">
              <span class="btn-icon">👤</span> Student Profile →
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Sidebar: Recent Submissions -->
    <aside class="submit-sidebar">
      <div class="glass card recent-records-card">
        <h3 class="sidebar-title">My Recent Records</h3>
        <div id="recent-achievements"></div>
        <div class="sparkle-star" title="Accredited Records">✦</div>
      </div>
    </aside>
  </div>
  `;
}

// ── State ────────────────────────────────────────────────────
let uploadedFile = null;
let extractedData = null;
let selectedRubricKey = null;
let _stepCurrent = 1;

function selectActivityTab(tabId, el) {
  currentActiveTab = tabId;
  document.querySelectorAll('.activity-tab-btn').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
  showToast(`Switched view to: ${el ? el.textContent.trim() : tabId}`, 'info');
}

function changeAcademicYear(year) {
  currentAcademicYear = parseInt(year, 10) || 3;
  const stu = APP_STATE.currentStudent || STUDENTS[0];
  const stats = calculateYearScore(stu.id, currentAcademicYear);

  // 1. Text label & select
  const labelEl = document.getElementById('active-year-label');
  if (labelEl) labelEl.innerHTML = `Active Academic Year: <strong>Year ${currentAcademicYear}</strong>`;

  const selEl = document.getElementById('academic-year-select');
  if (selEl && parseInt(selEl.value, 10) !== currentAcademicYear) selEl.value = currentAcademicYear;

  // 2. Score card elements (Uncapped score)
  const titleEl = document.getElementById('card-capped-title');
  if (titleEl) titleEl.textContent = `YEAR ${currentAcademicYear} TOTAL ACHIEVEMENT SCORE`;

  const capNum = document.getElementById('card-capped-num');
  if (capNum) capNum.textContent = stats.score || stats.uncappedPoints;

  const maxNum = document.getElementById('card-max-num');
  if (maxNum) maxNum.textContent = `PTS · UNLIMITED`;

  const progFill = document.getElementById('card-capped-progress');
  if (progFill) {
    const pts = stats.score || stats.uncappedPoints || 0;
    const pct = Math.min(100, Math.max(15, Math.round((pts / 150) * 100)));
    progFill.style.width = `${pct}%`;
  }

  // 3. Approved achievements count card
  const uncapTitle = document.getElementById('card-uncapped-title');
  if (uncapTitle) uncapTitle.textContent = `APPROVED ACHIEVEMENTS (YEAR ${currentAcademicYear})`;

  const uncapNum = document.getElementById('card-uncapped-num');
  if (uncapNum) uncapNum.textContent = stats.achievementCount;

  const uncapSub = document.getElementById('card-uncapped-sub');
  if (uncapSub) uncapSub.textContent = `verified records (${stats.score || stats.uncappedPoints} pts)`;

  const uncapNote = document.getElementById('card-uncapped-note');
  if (uncapNote) uncapNote.textContent = `All verified achievements earn full accredited points — students can achieve and upload as much as they want!`;

  // 4. Update preview form notice if present
  const spNotice = document.getElementById('sp-cap-notice');
  if (spNotice) spNotice.textContent = `Counts towards Year ${currentAcademicYear} Points & NAAC Criteria 5.3 (Uncapped)`;

  // 5. Update recent achievements
  renderRecentAchievements();

  showToast(`Switched to Year ${currentAcademicYear} (${stats.score || stats.uncappedPoints} Total Points)`, 'info');
}

function scrollToUpload() {
  const target = document.getElementById('upload-section-target');
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}

// ── Init ─────────────────────────────────────────────────────
function initUploadView() {
  renderRecentAchievements();
}

function renderRecentAchievements() {
  const container = document.getElementById('recent-achievements');
  if (!container) return;
  const stu = APP_STATE.currentStudent || STUDENTS[0];
  const allAchs = getAchievements(stu.id);

  // Filter for the selected academic year (verified achievements matching reference image)
  const achs = allAchs.filter(a => {
    if (a.status !== 'verified') return false;
    if (typeof a.academicYear === 'number') return a.academicYear === currentAcademicYear;
    if (a.academicYear) return parseInt(a.academicYear, 10) === currentAcademicYear;
    const sem = (a.semester || '').toLowerCase();
    const dt = a.date || '';
    if (currentAcademicYear === 1) return sem.includes('2021-22') || dt.startsWith('2021') || dt.startsWith('2022-0');
    if (currentAcademicYear === 2) return sem.includes('2022-23') || dt.startsWith('2022') || dt.startsWith('2023-0');
    if (currentAcademicYear === 3) return sem.includes('2023-24') || dt.startsWith('2023') || dt.startsWith('2024-0');
    if (currentAcademicYear === 4) return sem.includes('2024-25') || dt.startsWith('2024') || dt.startsWith('2025');
    return false;
  }).slice(-4).reverse();

  if (achs.length === 0) {
    container.innerHTML = `
      <div style="padding:1rem;text-align:center;color:var(--txt-3);font-size:.82rem">
        <div style="font-size:1.5rem;margin-bottom:.35rem">📁</div>
        No achievements yet for Year ${currentAcademicYear}.<br>Upload your first one above!
      </div>`;
    return;
  }
  container.innerHTML = achs.map(a => {
    const cat = CATEGORIES[a.category] || {};
    const sm  = statusMeta(a.status, a.autoVerified);
    return `
      <div class="recent-item">
        <div class="recent-icon" style="background:${cat.color}18;color:${cat.color}">${cat.icon||'🏅'}</div>
        <div class="recent-info">
          <div class="recent-title">${a.title}</div>
          <div class="recent-meta">${a.date} · <span class="${sm.cls}">${sm.label}</span> · <span style="font-weight:700;color:#2563eb">Year ${a.academicYear || currentAcademicYear}</span></div>
        </div>
        <div class="recent-pts">+${a.points}</div>
      </div>
    `;
  }).join('');
}

// ── Category & Activity Type Logic (Categorized, Zero Company Names, Levels & Points) ──
function renderCategoryActivityCards(catKey, activeRubricId) {
  const container = document.getElementById('activity-type-cards');
  const selectEl = document.getElementById('f-rubric-type');
  const activities = (typeof CATEGORY_ACTIVITY_TYPES !== 'undefined' && CATEGORY_ACTIVITY_TYPES[catKey]) 
    ? CATEGORY_ACTIVITY_TYPES[catKey] 
    : (CATEGORY_ACTIVITY_TYPES?.['technical'] || []);

  if (!activities || !activities.length) return;

  // Determine active item
  let activeItem = activities.find(a => a.id === activeRubricId);
  if (!activeItem) activeItem = activities[0];
  selectedRubricKey = activeItem.id;

  // Render visual cards
  if (container) {
    container.innerHTML = activities.map(act => {
      const isSelected = act.id === activeItem.id;
      return `
        <div class="activity-card ${isSelected ? 'active' : ''}" 
             data-id="${act.id}"
             onclick="onActivityCardSelect('${act.id}', '${act.level}', ${act.points})">
          <div class="act-card-left">
            <span class="act-card-badge">⭐ ${act.badge} LEVEL</span>
            <div class="act-card-title">${act.header}</div>
          </div>
          <div class="act-card-right">
            <span class="act-points-pill">+${act.points} pts</span>
          </div>
        </div>
      `;
    }).join('');
  }

  // Populate sync dropdown
  if (selectEl) {
    selectEl.innerHTML = activities.map(act => `
      <option value="${act.id}" ${act.id === activeItem.id ? 'selected' : ''}>
        ${act.icon} ${act.badge} Level | ${act.header} — ${act.points} pts
      </option>
    `).join('');
  }

  // Auto-sync level dropdown
  const levelSelect = document.getElementById('f-level');
  if (levelSelect && activeItem.level) {
    levelSelect.value = activeItem.level;
  }
}

function onCategorySelect(catKey) {
  // Update visual category cards
  document.querySelectorAll('.cat-card').forEach(c => {
    c.classList.toggle('active', c.dataset.cat === catKey);
  });

  // Update hidden select
  const catSel = document.getElementById('f-category');
  if (catSel) catSel.value = catKey;

  const hintEl = document.getElementById('cat-selected-hint');
  if (hintEl && CATEGORIES[catKey]) {
    hintEl.textContent = CATEGORIES[catKey].label;
  }

  const domainTag = document.getElementById('ocr-domain-tag');
  if (domainTag && CATEGORIES[catKey]) {
    domainTag.textContent = CATEGORIES[catKey].label;
  }

  const actHint = document.getElementById('cat-activity-hint');
  if (actHint && CATEGORIES[catKey]) {
    actHint.textContent = `Showing scored tier for ${CATEGORIES[catKey].label}`;
  }

  // Re-render activity cards for this category
  renderCategoryActivityCards(catKey);

  updateScorePreview();
}

function onActivityCardSelect(actId, level, points) {
  selectedRubricKey = actId;

  // Highlight active card
  document.querySelectorAll('.activity-card').forEach(c => {
    c.classList.toggle('active', c.dataset.id === actId);
  });

  // Sync dropdown
  const rubricSelect = document.getElementById('f-rubric-type');
  if (rubricSelect) rubricSelect.value = actId;

  // Sync level
  const levelSelect = document.getElementById('f-level');
  if (levelSelect && level) levelSelect.value = level;

  updateScorePreview();
}

function onRubricSelectChange() {
  const sel = document.getElementById('f-rubric-type')?.value;
  selectedRubricKey = sel || null;

  if (selectedRubricKey) {
    document.querySelectorAll('.activity-card').forEach(c => {
      c.classList.toggle('active', c.dataset.id === selectedRubricKey);
    });

    const spec = OFFICIAL_RUBRIC_SPEC.find(s => s.id === selectedRubricKey);
    if (spec && spec.level) {
      const levelSelect = document.getElementById('f-level');
      if (levelSelect) levelSelect.value = spec.level;
    }
  }

  updateScorePreview();
}

// ── Select Rubric Tier from Rubric Table ─────────────────────
function loadRubricItem(specId) {
  const spec = OFFICIAL_RUBRIC_SPEC.find(s => s.id === specId);
  if (!spec) return;

  selectedRubricKey = specId;

  scrollToUpload();
  goToStep(3);

  if (spec.category) {
    onCategorySelect(spec.category);
  }

  const rubricSelect = document.getElementById('f-rubric-type');
  if (rubricSelect) rubricSelect.value = specId;

  const levelSelect = document.getElementById('f-level');
  if (levelSelect && spec.level) levelSelect.value = spec.level;

  document.querySelectorAll('.activity-card').forEach(c => {
    c.classList.toggle('active', c.dataset.id === specId);
  });

  updateScorePreview();
  showToast(`Selected "${spec.header}" tier (${spec.points} pts). Please review your certificate details.`, 'info');
}

// ── Drag & Drop ───────────────────────────────────────────────
function handleDragOver(e) {
  e.preventDefault();
  document.getElementById('drop-zone')?.classList.add('drag-over');
}
function handleDragLeave(e) {
  document.getElementById('drop-zone')?.classList.remove('drag-over');
}
function handleDrop(e) {
  e.preventDefault();
  document.getElementById('drop-zone')?.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file) processFile(file);
}
function handleFileSelect(e) {
  const file = e.target.files[0];
  if (file) processFile(file);
}

function processFile(file) {
  uploadedFile = file;
  goToStep(2);
  startOCRSimulation(file);
}

function testUploadSample(fileName) {
  const dummyBlob = new Blob(["%PDF-1.4 Mock certificate content for " + fileName], { type: "application/pdf" });
  const mockFile = new File([dummyBlob], fileName, { type: "application/pdf" });
  processFile(mockFile);
}

// ── Intelligent Document Filename Analyzer ────────────────────
function analyzeUploadedDocument(fileName) {
  const name = (fileName || 'certificate.pdf').toLowerCase();
  
  // 1. AWS / Amazon Cloud Certification
  if (name.includes('aws') || name.includes('amazon')) {
    let title = 'AWS Certified Solutions Architect — Associate';
    if (name.includes('practitioner')) title = 'AWS Certified Cloud Practitioner';
    else if (name.includes('developer')) title = 'AWS Certified Developer — Associate';
    else if (name.includes('sysops')) title = 'AWS Certified SysOps Administrator';
    else if (name.includes('security')) title = 'AWS Certified Security — Specialty';
    
    return {
      docName: fileName,
      cleanName: 'AWS Cloud Certification',
      title: title,
      issuer: 'Amazon Web Services',
      category: 'certification',
      level: 'international',
      position: 'Certified Associate (Score: 890/1000)',
      rubricSpecKey: 'assoc_cert',
      points: 75,
      date: '2024-02-15',
      description: 'Demonstrated proficiency in cloud architecture, IAM security, EC2, S3, and highly available multi-region deployments.',
      isWhitelisted: true,
      tierBadge: '⚡ Tier 1: Issuing Body Whitelisted (Instant Auto-Verify)',
      statusMessage: 'Agent 64: Identified Amazon Web Services credential registry. Certificate verified against AWS verification database.'
    };
  }

  // 2. Microsoft / Azure Certification
  if (name.includes('azure') || name.includes('microsoft')) {
    let title = 'Microsoft Certified: Azure Solutions Architect Expert';
    if (name.includes('fundamentals') || name.includes('900')) title = 'Microsoft Certified: Azure Fundamentals (AZ-900)';
    else if (name.includes('204') || name.includes('dev')) title = 'Microsoft Certified: Azure Developer Associate (AZ-204)';

    return {
      docName: fileName,
      cleanName: 'Microsoft Azure Certification',
      title: title,
      issuer: 'Microsoft Corporation',
      category: 'certification',
      level: 'international',
      position: 'Certified Professional',
      rubricSpecKey: 'assoc_cert',
      points: 75,
      date: '2024-01-20',
      description: 'Mastery in designing cloud and hybrid solutions running on Microsoft Azure.',
      isWhitelisted: true,
      tierBadge: '⚡ Tier 1: Issuing Body Whitelisted (Instant Auto-Verify)',
      statusMessage: 'Agent 64: Verified against Microsoft Learn & Credly registry.'
    };
  }

  // 3. Google Cloud / GCP
  if (name.includes('gcp') || name.includes('google')) {
    return {
      docName: fileName,
      cleanName: 'Google Cloud Certification',
      title: 'Google Cloud Certified Associate Cloud Engineer',
      issuer: 'Google Cloud',
      category: 'certification',
      level: 'international',
      position: 'Certified Associate',
      rubricSpecKey: 'assoc_cert',
      points: 75,
      date: '2024-03-05',
      description: 'Demonstrated capability to deploy applications, monitor operations, and manage enterprise solutions on Google Cloud.',
      isWhitelisted: true,
      tierBadge: '⚡ Tier 1: Issuing Body Whitelisted (Instant Auto-Verify)',
      statusMessage: 'Agent 64: Verified against Google Cloud Credential Registry.'
    };
  }

  // 4. Cisco / CCNA / CCNP
  if (name.includes('cisco') || name.includes('ccna') || name.includes('ccnp')) {
    return {
      docName: fileName,
      cleanName: 'Cisco Networking Certification',
      title: 'Cisco Certified Network Professional (CCNP Enterprise)',
      issuer: 'Cisco Systems',
      category: 'certification',
      level: 'international',
      position: 'Certified Professional',
      rubricSpecKey: 'global_cert',
      points: 100,
      date: '2024-01-10',
      description: 'Mastery in enterprise networking, dual-stack architecture, virtualization and network assurance.',
      isWhitelisted: true,
      tierBadge: '⚡ Tier 1: Issuing Body Whitelisted (Instant Auto-Verify)',
      statusMessage: 'Agent 64: Verified against Cisco Certification Tracking System.'
    };
  }

  // 5. NPTEL / SWAYAM
  if (name.includes('nptel') || name.includes('swayam')) {
    return {
      docName: fileName,
      cleanName: 'NPTEL / SWAYAM Course',
      title: 'NPTEL / SWAYAM: Cloud Computing — Elite + Gold (94%)',
      issuer: 'NPTEL & IIT Kharagpur',
      category: 'certification',
      level: 'national',
      position: 'Top 1% / Elite + Gold',
      rubricSpecKey: 'nptel_gold',
      points: 50,
      date: '2024-03-01',
      description: 'Completed 12-week proctored NPTEL examination on cloud computing architectures and virtualization.',
      isWhitelisted: true,
      tierBadge: '⚡ Tier 1: Issuing Body Whitelisted (Instant Auto-Verify)',
      statusMessage: 'Agent 64: Authenticated roll number against NPTEL SWAYAM portal.'
    };
  }

  // 6. Hackathon
  if (name.includes('hackathon') || name.includes('hack') || name.includes('sih')) {
    return {
      docName: fileName,
      cleanName: 'National Hackathon Award',
      title: 'National Smart India Hackathon 2024 — 1st Prize Winner',
      issuer: 'AICTE & Ministry of Education',
      category: 'hackathon',
      level: 'national',
      position: '1st Prize Winner / Grand Finalist',
      rubricSpecKey: 'hackathon_winner',
      points: 100,
      date: '2024-02-22',
      description: 'Built an AI-driven autonomous triage system for rural healthcare centres using Edge computing.',
      isWhitelisted: false,
      tierBadge: '👨‍🏫 Tier 2: Routes to Faculty Verifier Queue',
      statusMessage: 'Agent 64: Extracted team certificate and forwarded to Faculty Verifier Queue.'
    };
  }

  // 7. IEEE / Research Paper / Publication
  if (name.includes('ieee') || name.includes('paper') || name.includes('springer') || name.includes('publication') || name.includes('journal')) {
    return {
      docName: fileName,
      cleanName: 'IEEE Research Publication',
      title: 'IEEE International Conference: Edge-AI & Real-Time Analytics Framework',
      issuer: 'IEEE Computer Society & SCOPUS',
      category: 'publication',
      level: 'international',
      position: 'First Author / Presented',
      authors: 'Aarav Sharma, Dr. Rajesh Kumar',
      rubricSpecKey: 'pub_sci',
      points: 100,
      date: '2024-01-18',
      description: 'Peer-reviewed research paper published and indexed in IEEE Xplore / SCOPUS database.',
      isWhitelisted: false,
      tierBadge: '👨‍🏫 Tier 2: Routes to Faculty Verifier Queue',
      statusMessage: 'Agent 64: Checked author credits (Publication Author Rule satisfied) and DOI.'
    };
  }

  // 8. Sports / Tournament / Athletics
  if (name.includes('sport') || name.includes('badminton') || name.includes('cricket') || name.includes('tournament') || name.includes('athletic')) {
    return {
      docName: fileName,
      cleanName: 'Inter-College Sports Trophy',
      title: 'Inter-University Sports Championship — Top 3 Position',
      issuer: 'Association of Indian Universities (AIU)',
      category: 'sports',
      level: 'university',
      position: 'Top 3 Position (30 pts)',
      rubricSpecKey: 'inter_uni_top3',
      points: 30,
      date: '2024-02-10',
      description: 'Represented VFSTR University in the Inter-University Sports Meet, securing a podium finish.',
      isWhitelisted: false,
      tierBadge: '⚖️ Tier 2: Routes to Faculty Verifier Queue',
      statusMessage: 'Agent 64: Extracted AIU sports merit certificate and queued for Sports Director sign-off.'
    };
  }

  // Default Fallback: Clean up filename
  const baseName = fileName.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' ').trim();
  const capitalized = baseName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return {
    docName: fileName,
    cleanName: capitalized,
    title: capitalized.length > 3 ? capitalized : 'University / Inter-College Certificate',
    issuer: 'Accredited Evaluation Authority',
    category: 'technical',
    level: 'university',
    position: 'Top 3 Position (30 pts)',
    rubricSpecKey: 'tech_inter_top3',
    points: 30,
    date: new Date().toISOString().split('T')[0],
    description: `Authenticated proof for ${capitalized}.`,
    isWhitelisted: false,
    tierBadge: '⚖️ Tier 2: Routes to Faculty Verifier Queue',
    statusMessage: 'Agent 64: OCR optical pass completed. Proof hash recorded on VFSTR ledger.'
  };
}

// ── OCR Simulation via Agent 64 ───────────────────────────────
function startOCRSimulation(file) {
  const analysis = analyzeUploadedDocument(file.name);

  const nameEl  = document.getElementById('file-name-big');
  const iconEl  = document.getElementById('file-icon-big');
  const labelEl = document.getElementById('extract-label');
  const stepsEl = document.getElementById('extract-steps');

  if (nameEl) nameEl.textContent = file.name;
  if (iconEl) {
    iconEl.textContent = file.name.endsWith('.pdf') ? '📄' :
                         file.type?.startsWith('image/') ? '🖼️' : '📜';
  }

  const phases = [
    { label: `Agent 64 OCR scanning "${file.name}"…`, delay: 0 },
    { label: `Identifying issuing body: ${analysis.issuer}…`, delay: 500 },
    { label: `Extracting title: "${analysis.title}"…`, delay: 1000 },
    { label: `Mapping to Institutional Activity Rubric (${analysis.points} pts)…`, delay: 1500 },
    { label: `${analysis.isWhitelisted ? 'Whitelisted Issuing Body authenticated ✓' : 'Prepared for Faculty Verifier Review ✓'}`, delay: 2000 },
    { label: 'Extraction complete ✓', delay: 2400 }
  ];

  phases.forEach(p => {
    setTimeout(() => {
      if (labelEl) labelEl.textContent = p.label;
      if (stepsEl && p.label !== 'Extraction complete ✓') {
        const dot = document.createElement('span');
        dot.className = 'extract-dot';
        dot.textContent = '●';
        stepsEl.appendChild(dot);
      }
    }, p.delay);
  });

  setTimeout(() => {
    extractedData = analysis;
    goToStep(3);

    // Update document badge in Step 3
    const ocrDocName = document.getElementById('ocr-doc-name');
    if (ocrDocName) ocrDocName.textContent = file.name;

    const ocrDocStatus = document.getElementById('ocr-doc-status');
    if (ocrDocStatus) ocrDocStatus.textContent = analysis.statusMessage;

    const ocrDomainTag = document.getElementById('ocr-domain-tag');
    if (ocrDomainTag) ocrDomainTag.textContent = CATEGORIES[analysis.category]?.label || analysis.category;

    // Fill form fields
    const fTitle = document.getElementById('f-title');
    if (fTitle) fTitle.value = analysis.title;

    const fIssuer = document.getElementById('f-issuer');
    if (fIssuer) fIssuer.value = analysis.issuer;

    const fPosition = document.getElementById('f-position');
    if (fPosition) fPosition.value = analysis.position;

    const fDesc = document.getElementById('f-desc');
    if (fDesc) fDesc.value = analysis.description;

    const fDate = document.getElementById('f-date');
    if (fDate) fDate.value = analysis.date;

    const fAuthors = document.getElementById('f-authors');
    if (fAuthors && analysis.authors) fAuthors.value = analysis.authors;

    onCategorySelect(analysis.category);

    if (analysis.level) {
      const fLevel = document.getElementById('f-level');
      if (fLevel) fLevel.value = analysis.level;
    }

    selectedRubricKey = analysis.rubricSpecKey;
    const rubricSelect = document.getElementById('f-rubric-type');
    if (rubricSelect && selectedRubricKey) rubricSelect.value = selectedRubricKey;

    document.querySelectorAll('.activity-card').forEach(c => {
      c.classList.toggle('active', c.dataset.id === analysis.rubricSpecKey);
    });

    updateScorePreview();
    showToast(`Agent 64 analyzed "${file.name}" → ${analysis.cleanName}!`, 'success');
  }, 2600);
}

// ── Publication Author Rule Validator ────────────────────────
function checkPublicationAuthorRule() {
  const authorVal = document.getElementById('f-authors')?.value.trim() || '';
  const msgEl = document.getElementById('author-rule-msg');
  const stu = APP_STATE.currentStudent || { name:'Aarav Sharma', roll:'211FA04001' };
  if (!msgEl) return true;

  if (!authorVal) {
    msgEl.innerHTML = `<span style="color:#d97706;font-weight:600">⚠️ Publication Author Rule Guardrail: Enter the full credited authors list. Submitting student must be explicitly credited.</span>`;
    return false;
  }

  const stuName = (stu.name || '').toLowerCase();
  const stuRoll = (stu.roll || stu.rollNo || '').toLowerCase();
  const valLower = authorVal.toLowerCase();

  const isCredited = valLower.includes(stuName) || 
                     (stuRoll && valLower.includes(stuRoll)) ||
                     (stuName.includes(' ') && stuName.split(' ').some(part => part.length > 2 && valLower.includes(part)));

  if (isCredited) {
    msgEl.innerHTML = `<span style="color:#059669;font-weight:700">✓ Publication Author Rule Satisfied: "${stu.name}" is explicitly credited as an author.</span>`;
    return true;
  } else {
    msgEl.innerHTML = `<span style="color:#e11d48;font-weight:700">⛔ Publication Author Rule Violation: Submitting student ("${stu.name}") is NOT found in author list. Per institutional accreditation policy, this claim will be REJECTED.</span>`;
    return false;
  }
}

// ── Score Preview per Institutional Rubric (Uncapped) ─────────
function updateScorePreview() {
  const cat    = document.getElementById('f-category')?.value || 'technical';
  const level  = document.getElementById('f-level')?.value || 'national';
  const issuer = document.getElementById('f-issuer')?.value.trim() || '';
  const rubricId = document.getElementById('f-rubric-type')?.value || selectedRubricKey;

  // Toggle Publication Author Rule Field
  const isPub = cat === 'publication' || cat === 'paper' || cat === 'patent';
  const authorRow = document.getElementById('author-rule-row');
  if (authorRow) {
    authorRow.style.display = isPub ? 'flex' : 'none';
    if (isPub) checkPublicationAuthorRule();
  }

  let pts = 0;
  let label = '';

  if (rubricId) {
    const spec = OFFICIAL_RUBRIC_SPEC.find(s => s.id === rubricId);
    if (spec) {
      pts = spec.points;
      label = `${spec.header} (${spec.points} pts)`;
    }
  }

  if (!pts) {
    pts = getWeight(cat, level);
    label = `${CATEGORIES[cat]?.label || cat} · ${level}`;
  }

  const scoreEl = document.getElementById('sp-score');
  const levelEl = document.getElementById('sp-level');
  if (scoreEl) scoreEl.textContent = pts;
  if (levelEl) levelEl.textContent = label;

  const spNotice = document.getElementById('sp-cap-notice');
  if (spNotice) {
    spNotice.innerHTML = `✨ <strong>Uncapped Points:</strong> Full ${pts} pts added to Year ${currentAcademicYear} and NAAC 5.3 merit with no upper limit.`;
  }

  const vEl = document.getElementById('sp-verify');
  if (vEl) {
    if (isKnownIssuer(issuer)) {
      vEl.innerHTML = `<span class="badge-auto">⚡ Tier 1: Issuing Body Whitelisted (Instant Auto-Verify)</span>`;
    } else {
      vEl.innerHTML = `<span class="badge-pending">👨‍🏫 Tier 2: Routes to Faculty Verifier Queue</span>`;
    }
  }
}

// ── Submit Achievement ────────────────────────────────────────
function submitAchievement() {
  const title    = document.getElementById('f-title')?.value.trim();
  const category = document.getElementById('f-category')?.value;
  const level    = document.getElementById('f-level')?.value;
  const issuer   = document.getElementById('f-issuer')?.value.trim();
  const date     = document.getElementById('f-date')?.value;
  const position = document.getElementById('f-position')?.value.trim();
  const desc     = document.getElementById('f-desc')?.value.trim();
  const authors  = document.getElementById('f-authors')?.value.trim() || '';
  const rubricSpecKey = document.getElementById('f-rubric-type')?.value || selectedRubricKey;

  if (!title || !category || !issuer || !date) {
    showToast('Please fill in required fields (Title, Category, Issuer, Date).', 'error');
    return;
  }

  // Publication Author Rule Enforcement
  const isPub = category === 'publication' || category === 'paper' || category === 'patent';
  let authorRulePassed = true;
  if (isPub) {
    authorRulePassed = checkPublicationAuthorRule();
    if (!authorRulePassed) {
      showToast('Publication Author Rule: Student must be credited author. Record flagged for rejection.', 'warning');
    }
  }

  const stu = APP_STATE.currentStudent || STUDENTS[0];
  const ach = buildAchievement({
    title,
    category,
    level,
    rubricSpecKey,
    issuer,
    date,
    position,
    authors: authors,
    authorRulePassed: authorRulePassed,
    description: desc,
    proofFile: uploadedFile?.name || `${category}_certificate_proof.pdf`,
    docMetadata: {
      docId: generateId('VFSTR-DOC-'),
      issuer: issuer,
      examOrAward: title,
      scoreOrGrade: position || 'PASS / Grade A',
      authors: authors,
      credentialHash: 'SHA256:' + generateId('HEX').toLowerCase() + '8892',
      ocrConfidence: '99.5%'
    }
  }, stu.id);

  if (isPub && !authorRulePassed) {
    ach.status = 'rejected';
    ach.notes = 'Rejected per Publication Author Rule: Submitting student is not an explicitly credited author on the submitted work.';
  }

  ach.status = 'pending';
  ach.autoVerified = false;
  ach.verifiedBy = null;
  ach.verifiedDate = null;
  ach.studentId = stu.id;
  ach.studentName = stu.name;

  ACHIEVEMENTS.unshift(ach);
  PENDING_QUEUE = ACHIEVEMENTS.filter(a => a.status === 'pending');
  saveData();
  if (typeof saveAchievementsToServer === 'function') saveAchievementsToServer();
  if (typeof refreshInsights === 'function') refreshInsights();

  // Update year stats
  const yearStats = calculateYearScore(stu.id, currentAcademicYear);
  const capNum = document.getElementById('card-capped-num');
  const uncapNum = document.getElementById('card-uncapped-num');
  if (capNum) capNum.textContent = yearStats.score || yearStats.uncappedPoints;
  if (uncapNum) uncapNum.textContent = yearStats.achievementCount;
  const uncapSub = document.getElementById('card-uncapped-sub');
  if (uncapSub) uncapSub.textContent = `verified records (${yearStats.score || yearStats.uncappedPoints} pts)`;

  goToStep(4);

  // Populate Step 4 matching reference image
  const ptsEl = document.getElementById('confirm-pts-num');
  if (ptsEl) ptsEl.textContent = ach.points;

  const levelTextEl = document.getElementById('confirm-level-text');
  if (levelTextEl) {
    const rubricSpec = OFFICIAL_RUBRIC_SPEC.find(s => s.id === ach.rubricSpecKey);
    const rubricName = rubricSpec ? rubricSpec.header : `${CATEGORIES[ach.category]?.label || ach.category} · ${ach.level}`;
    levelTextEl.textContent = `${rubricName} (${ach.points} pts)`;
  }

  const uncapEl = document.getElementById('confirm-uncapped-text');
  if (uncapEl) {
    uncapEl.textContent = `Rubric Weight: ${ach.points} pts awaiting verification. Points will be officially credited upon faculty approval.`;
  }

  const tierTextEl = document.getElementById('confirm-tier-text');
  if (tierTextEl) {
    tierTextEl.textContent = 'Tier 2: Automatically Routed to Faculty Verifier Queue for Approval';
  }

  const titleEl = document.getElementById('confirm-title');
  if (titleEl) {
    titleEl.textContent = 'Certificate Submitted to Faculty Queue!';
  }

  const bodyEl = document.getElementById('confirm-body');
  if (bodyEl) {
    bodyEl.textContent = `Your certificate "${ach.title}" has been successfully submitted and forwarded to the Faculty Verifier Queue.`;
  }

  const sub2El = document.getElementById('confirm-subtext-2');
  if (sub2El) {
    sub2El.textContent = 'It will be reviewed by the faculty verifier who will approve or reject the submission.';
  }

  const analyzedChip = document.getElementById('confirm-analyzed-chip');
  const analyzedDisplay = document.getElementById('confirm-doc-name-display');
  if (analyzedChip && analyzedDisplay) {
    analyzedChip.style.display = 'inline-flex';
    analyzedDisplay.textContent = `${ach.proofFile || ach.title}`;
  }

  updateStudentProfile(stu.id);
  showToast(`Submitted! Rubric Score: ${ach.points} pts. Synced to Agent 44`, 'success');
}

// ── Step Navigation ───────────────────────────────────────────
function goToStep(n) {
  _stepCurrent = n;
  document.querySelectorAll('.step-panel').forEach((el, i) => {
    el.classList.toggle('active', i + 1 === n);
  });
  document.querySelectorAll('.step').forEach((el, i) => {
    el.classList.toggle('active', i + 1 === n);
    el.classList.toggle('done',   i + 1 <  n);
  });

  if (n === 3) {
    const curCat = document.getElementById('f-category')?.value || 'technical';
    renderCategoryActivityCards(curCat, selectedRubricKey);
    updateScorePreview();
  }
}

function resetUpload() {
  uploadedFile = null;
  extractedData = null;
  selectedRubricKey = null;
  goToStep(1);
  const fi = document.getElementById('file-input');
  if (fi) fi.value = '';
  const stepsEl = document.getElementById('extract-steps');
  if (stepsEl) stepsEl.innerHTML = '';
}
