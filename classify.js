// ============================================================
//  classify.js — Category, Level & Rubric Weight Logic
// ============================================================

/**
 * Calculate points for an achievement based on the rubric or official spec.
 */
function getWeight(category, level, rubricSpecKey) {
  if (rubricSpecKey) {
    const spec = OFFICIAL_RUBRIC_SPEC.find(s => s.id === rubricSpecKey);
    if (spec) return spec.points;
  }
  const rubricEntry = RUBRIC[category];
  if (!rubricEntry) return 10;
  return rubricEntry[level] || 10;
}

/**
 * Determine if an issuer is on the auto-verify whitelist.
 */
function isKnownIssuer(issuer) {
  if (!issuer) return false;
  const lc = issuer.toLowerCase();
  return KNOWN_ISSUERS.some(k => lc.includes(k));
}

/**
 * Derive a verification status for a newly submitted achievement.
 * Returns { autoVerified: bool, status: 'verified'|'pending', verifiedBy: string }
 */
function determineVerification(achievement) {
  // All student-submitted certificates automatically route to Faculty Verifier Queue for approval
  return {
    autoVerified: false,
    status: 'pending',
    verifiedBy: null,
    verifiedDate: null
  };
}

/**
 * Build a full achievement object from form data.
 */
function buildAchievement(formData, studentId) {
  const { category, level, rubricSpecKey } = formData;
  let points = 0;
  if (rubricSpecKey) {
    const spec = OFFICIAL_RUBRIC_SPEC.find(s => s.id === rubricSpecKey);
    if (spec) points = spec.points;
  }
  if (!points) {
    points = getWeight(category, level);
  }
  const verif    = determineVerification(formData);
  const semester = detectSemester(formData.date);

  return {
    id:            generateId('ACH'),
    studentId,
    category:      category || 'certification',
    level:         level || 'national',
    rubricSpecKey: rubricSpecKey || null,
    title:         formData.title       || '',
    issuer:        formData.issuer      || '',
    position:      formData.position    || '',
    date:          formData.date        || new Date().toISOString().split('T')[0],
    description:   formData.description || '',
    points,
    semester,
    proofFile:     formData.proofFile   || `${category || 'achievement'}_proof.pdf`,
    docMetadata:   formData.docMetadata || {
      docId: generateId('VFSTR-DOC-'),
      issuer: formData.issuer || 'Issuing Body',
      examOrAward: formData.title,
      scoreOrGrade: formData.position || 'Verified',
      credentialHash: 'SHA256:' + generateId('HASH').toLowerCase() + '0928a',
      ocrConfidence: '99.4%'
    },
    ...verif
  };
}

/**
 * Guess which academic semester a date falls in.
 */
function detectSemester(dateStr) {
  if (!dateStr) return 'Odd 2023-24';
  const d = new Date(dateStr);
  const month = d.getMonth() + 1;
  const year  = d.getFullYear();
  const acYear = month >= 6 ? `${year}-${(year+1).toString().slice(2)}` : `${year-1}-${year.toString().slice(2)}`;
  const term = month >= 6 ? 'Odd' : 'Even';
  return `${term} ${acYear}`;
}

/**
 * Get a color/class for a verification status badge.
 */
function statusMeta(status, autoVerified) {
  if (status === 'verified' && autoVerified) return { label:'Auto-Verified ✓', cls:'badge-auto' };
  if (status === 'verified')                 return { label:'Approved ✓',       cls:'badge-verified' };
  if (status === 'rejected')                 return { label:'Rejected ✗',       cls:'badge-rejected' };
  return { label:'Pending Review', cls:'badge-pending' };
}

/**
 * Compute per-category radar data (0-100 normalised scale) for a student.
 */
function getRadarData(studentId) {
  const axes = ['technical', 'sports', 'cultural', 'publication', 'entrepreneurship', 'social'];
  const maxes = { technical:375, sports:300, cultural:225, publication:300, entrepreneurship:270, social:150 };

  return axes.map(axis => {
    let score = 0;
    if (axis === 'technical') {
      score = ['technical','hackathon','paper','certification'].reduce(
        (s, c) => s + getCategoryScore(studentId, c), 0
      );
    } else if (axis === 'publication') {
      score = ['publication','patent'].reduce(
        (s, c) => s + getCategoryScore(studentId, c), 0
      );
    } else {
      score = getCategoryScore(studentId, axis);
    }
    const pct = Math.min(100, Math.round((score / (maxes[axis] || 100)) * 100));
    return { axis, score, pct };
  });
}

/**
 * Compute semester-wise totals for line chart (IQAC).
 */
function getSemesterTrend() {
  const map = {};
  SEMESTERS.forEach(s => map[s] = 0);
  ACHIEVEMENTS.filter(a => a.status === 'verified').forEach(a => {
    const sem = a.semester || 'Odd 2023-24';
    if (map[sem] !== undefined) map[sem] += a.points;
  });
  return SEMESTERS.map(s => ({ semester: s, points: map[s] }));
}

/**
 * Category distribution for donut chart.
 */
function getCategoryDistribution() {
  const map = {};
  ACHIEVEMENTS.filter(a => a.status === 'verified').forEach(a => {
    map[a.category] = (map[a.category] || 0) + 1;
  });
  return Object.entries(map)
    .map(([cat, count]) => ({ cat, count, meta: CATEGORIES[cat] }))
    .sort((a,b) => b.count - a.count);
}

/**
 * Department-wise achievement totals for bar chart.
 */
function getDeptStats() {
  const map = {};
  DEPARTMENTS.forEach(d => map[d] = 0);
  ACHIEVEMENTS.filter(a => a.status === 'verified').forEach(a => {
    const stu = getStudent(a.studentId);
    if (stu && map[stu.dept] !== undefined) {
      map[stu.dept] += a.points;
    }
  });
  return Object.entries(map).map(([dept, points]) => ({ dept, points }));
}
