// ============================================================
//  data.js — Mock Data Store, Rubric Specs & Activity Headers
// ============================================================

// ── Official Activity / Category Headers (Matching User Image) ──
const ACTIVITY_HEADERS = [
  { id: 'certifications',   label: 'Certifications & Score Card', icon: '📜' },
  { id: 'projects',         label: 'Projects & Score Card',       icon: '📁' },
  { id: 'hackathons',       label: 'Coding Challenges / Hackathons', icon: '💻' },
  { id: 'leadership',       label: 'Leadership Activities',       icon: '👔' },
  { id: 'cambridge',        label: 'Cambridge Certifications',    icon: '🎓' },
  { id: 'cocurricular',     label: 'Co-Curricular Activities',    icon: '🎯' },
  { id: 'extracurricular',  label: 'Extra-Curricular Activities', icon: '🎨' },
  { id: 'sports',           label: 'Physical Fitness / Sports',   icon: '⚽' }
];

// ── Accredited Category Activity Types (Categorized, Zero Company Names, Levels & Points) ──
const CATEGORY_ACTIVITY_TYPES = {
  technical: [
    { id: 'tech_intl_win', header: 'International Level Competition — Winner / Top 3', level: 'international', points: 100, badge: 'International', icon: '🏆', activity: 'International Level · Winner / Podium Position (100 pts)' },
    { id: 'tech_nat_win',  header: 'National Level Competition — Winner / Podium',    level: 'national',      points: 75,  badge: 'National',      icon: '🥇', activity: 'National Level · Winner / Top 3 Position (75 pts)' },
    { id: 'tech_state_win',header: 'State / Zonal Level — Winner / Runner-Up',         level: 'state',         points: 50,  badge: 'State',         icon: '🥈', activity: 'State / Zonal Level · Winner / Runner-Up (50 pts)' },
    { id: 'tech_univ_win', header: 'University / Inter-College Level — Top 3 Position',level: 'university',    points: 30,  badge: 'University',    icon: '🏫', activity: 'University / Inter-College Level · Position Winner (30 pts)' },
    { id: 'tech_inst_part',header: 'Institutional / College Level Technical Event',     level: 'institutional', points: 15,  badge: 'Institutional', icon: '🏢', activity: 'Institutional / College Level · Participation (15 pts)' }
  ],
  hackathon: [
    { id: 'hack_intl_win', header: 'International Hackathon — Winner / Top 3 Finalist', level: 'international', points: 100, badge: 'International', icon: '💻', activity: 'International Level · Winner / Top 3 Finalist (100 pts)' },
    { id: 'hack_nat_win',  header: 'National Level Hackathon / Coding Challenge Winner',level: 'national',      points: 75,  badge: 'National',      icon: '🥇', activity: 'National Level · Winner / 1st Prize (75 pts)' },
    { id: 'hack_state_win',header: 'State / Regional Hackathon — Winner / Runner-Up',    level: 'state',         points: 50,  badge: 'State',         icon: '🥈', activity: 'State / Regional Level · 2nd / 3rd Position (50 pts)' },
    { id: 'hack_univ_win', header: 'University Hackathon / Coding Sprint — 1st Prize',   level: 'university',    points: 30,  badge: 'University',    icon: '⚡', activity: 'University Level · Winner / Top Rank (30 pts)' },
    { id: 'hack_part',     header: 'Hackathon Finalist / Official Active Participation', level: 'institutional', points: 15,  badge: 'Institutional', icon: '🎫', activity: 'Institutional / Inter-College · Active Participation (15 pts)' }
  ],
  paper: [
    { id: 'paper_intl_best', header: 'International Conference — Best Paper Award',       level: 'international', points: 60, badge: 'International', icon: '📑', activity: 'International Conference · Best Paper Award (60 pts)' },
    { id: 'paper_intl_pres', header: 'International Conference — Oral Paper Presentation', level: 'international', points: 50, badge: 'International', icon: '🎤', activity: 'International Conference · Paper Presented (50 pts)' },
    { id: 'paper_nat_best',  header: 'National Conference — Best Paper Award',             level: 'national',      points: 40, badge: 'National',      icon: '🥇', activity: 'National Conference · Best Paper Award (40 pts)' },
    { id: 'paper_nat_pres',  header: 'National Conference — Oral Paper Presentation',       level: 'national',      points: 30, badge: 'National',      icon: '📄', activity: 'National Conference · Paper Presented (30 pts)' },
    { id: 'paper_state_pres',header: 'State / Regional Symposium Paper Presentation',       level: 'state',         points: 25, badge: 'State',         icon: '🏙️', activity: 'State / Regional Symposium · Paper Presentation (25 pts)' },
    { id: 'paper_inst_pres', header: 'Institutional Colloquium / Poster Presentation',     level: 'institutional', points: 10, badge: 'Institutional', icon: '📋', activity: 'Institutional Level · Poster / Seminar Presentation (10 pts)' }
  ],
  publication: [
    { id: 'pub_scopus_sci',  header: 'Indexed Journal Article Publication (Q1 / Q2 / SCI)', level: 'international', points: 100, badge: 'International', icon: '📚', activity: 'International Indexed Journal (Q1/Q2/SCI) (100 pts)' },
    { id: 'pub_peer_intl',   header: 'Peer-Reviewed International Journal Publication',      level: 'international', points: 80,  badge: 'International', icon: '🌐', activity: 'Peer-Reviewed International Academic Journal (80 pts)' },
    { id: 'pub_approved_nat',header: 'Approved National Academic Journal Publication',      level: 'national',      points: 60,  badge: 'National',      icon: '🇮🇳', activity: 'National Approved Academic Journal (60 pts)' },
    { id: 'pub_conf_proc',   header: 'Conference Proceedings / Book Chapter Publication',    level: 'university',    points: 40,  badge: 'University',    icon: '📖', activity: 'Indexed Conference Proceedings / Book Chapter (40 pts)' },
    { id: 'pub_tech_report', header: 'Institutional Technical Research Monograph',          level: 'institutional', points: 20,  badge: 'Institutional', icon: '📝', activity: 'Institutional Technical Research Monograph (20 pts)' }
  ],
  patent: [
    { id: 'patent_intl_grant', header: 'International Patent Granted',                       level: 'international', points: 100, badge: 'International', icon: '💡', activity: 'International Level · Patent Granted (100 pts)' },
    { id: 'patent_nat_grant',  header: 'National Patent Granted',                            level: 'national',      points: 90,  badge: 'National',      icon: '✅', activity: 'National Level · Patent Granted (90 pts)' },
    { id: 'patent_published',  header: 'Patent Officially Published / Examination Stage',    level: 'state',         points: 60,  badge: 'State',         icon: '📋', activity: 'Official Gazette Published / Examination Requested (60 pts)' },
    { id: 'patent_filed',      header: 'Patent Application Filed / Design Registration',     level: 'institutional', points: 40,  badge: 'Institutional', icon: '📑', activity: 'Official Patent Application Filed / Design Registered (40 pts)' }
  ],
  sports: [
    { id: 'sports_intl_medal', header: 'International Games / Championship Medalist',        level: 'international', points: 100, badge: 'International', icon: '⚽', activity: 'International Championship · Medalist (100 pts)' },
    { id: 'sports_nat_medal',  header: 'National / Inter-University Championship Medalist',  level: 'national',      points: 80,  badge: 'National',      icon: '🥇', activity: 'National / Inter-University Championship · Medalist (80 pts)' },
    { id: 'sports_state_win',  header: 'State / Zonal Championship Winner / Runner-Up',      level: 'state',         points: 60,  badge: 'State',         icon: '🥈', activity: 'State / Zonal Level · Winner / Runner-Up (60 pts)' },
    { id: 'sports_univ_win',   header: 'University Annual Sports Meet — Position Winner',    level: 'university',    points: 40,  badge: 'University',    icon: '🏫', activity: 'University Annual Sports Meet · Position Winner (40 pts)' },
    { id: 'sports_inst_part',  header: 'Inter-Collegiate / Institutional Sports Tournament', level: 'institutional', points: 20,  badge: 'Institutional', icon: '🏃', activity: 'Inter-Collegiate / Institutional Sports · Participation (20 pts)' }
  ],
  cultural: [
    { id: 'cult_intl_win',  header: 'International Cultural / Youth Festival Winner',        level: 'international', points: 80, badge: 'International', icon: '🎭', activity: 'International Cultural Festival · Winner / Awardee (80 pts)' },
    { id: 'cult_nat_win',   header: 'National Youth Festival Award Winner',                  level: 'national',      points: 60, badge: 'National',      icon: '🥇', activity: 'National Youth Festival · Award Winner (60 pts)' },
    { id: 'cult_state_win', header: 'State / Inter-University Cultural Fest Winner',         level: 'state',         points: 40, badge: 'State',         icon: '🎨', activity: 'State / Inter-University Cultural Fest · Winner (40 pts)' },
    { id: 'cult_univ_win',  header: 'University Fest — 1st / 2nd / 3rd Prize',               level: 'university',    points: 25, badge: 'University',    icon: '🎪', activity: 'University Annual Fest · 1st / 2nd / 3rd Prize (25 pts)' },
    { id: 'cult_inst_part', header: 'Institutional Cultural Performance / Representation',   level: 'institutional', points: 15, badge: 'Institutional', icon: '🎫', activity: 'Institutional Cultural Performance / Participation (15 pts)' }
  ],
  entrepreneurship: [
    { id: 'ent_venture_fund', header: 'Incubated Startup / External Seed Grant Secured',     level: 'international', points: 90, badge: 'International', icon: '🚀', activity: 'Incubated Startup / External Grant Secured (90 pts)' },
    { id: 'ent_nat_pitch',    header: 'National Startup Pitch / Business Plan Winner',       level: 'national',      points: 70, badge: 'National',      icon: '🏆', activity: 'National Level Pitch / Business Plan Winner (70 pts)' },
    { id: 'ent_state_pitch',  header: 'State / Regional Innovation & Startup Winner',        level: 'state',         points: 50,  badge: 'State',         icon: '🥈', activity: 'State / Regional Startup Challenge Winner (50 pts)' },
    { id: 'ent_univ_ideathon',header: 'University Ideathon / Venture Competition Winner',    level: 'university',    points: 30,  badge: 'University',    icon: '💡', activity: 'University Ideathon / Venture Competition Winner (30 pts)' },
    { id: 'ent_prototype',    header: 'Working Prototype Exhibition / Innovation Showcase',  level: 'institutional', points: 20,  badge: 'Institutional', icon: '🛠️', activity: 'Working Prototype Exhibition / Showcase (20 pts)' }
  ],
  social: [
    { id: 'soc_nat_parade', header: 'National Republic Day Parade / National Youth Camp',    level: 'national',      points: 50, badge: 'National',      icon: '🇮🇳', activity: 'National Republic Day Parade / National Youth Camp (50 pts)' },
    { id: 'soc_state_camp', header: 'State Level NSS / Community Leadership Camp',           level: 'state',         points: 40, badge: 'State',         icon: '🤝', activity: 'State Level NSS / Leadership Camp (40 pts)' },
    { id: 'soc_dist_lead',  header: 'District / Zonal Community Outreach Lead',              level: 'state',         points: 30, badge: 'State',         icon: '🌱', activity: 'District / Zonal Outreach Lead (30 pts)' },
    { id: 'soc_univ_drive', header: 'University NSS / Social Welfare Drive Coordinator',     level: 'university',    points: 20, badge: 'University',    icon: '🩸', activity: 'University NSS / Social Welfare Drive (20 pts)' },
    { id: 'soc_inst_vol',   header: 'Institutional Social Service Project Volunteer',        level: 'institutional', points: 15, badge: 'Institutional', icon: '🎗️', activity: 'Institutional Social Service Volunteer (15 pts)' }
  ],
  certification: [
    { id: 'cert_global_pro',     header: 'Advanced / Professional Level Global Certification', level: 'international', points: 100, badge: 'International', icon: '🌐', activity: 'Advanced / Professional Level Certification (100 pts)' },
    { id: 'cert_assoc_spec',     header: 'Intermediate / Associate Level Specialization',      level: 'national',      points: 75,  badge: 'National',      icon: '📜', activity: 'Intermediate / Associate Level Certification (75 pts)' },
    { id: 'cert_proctored_gold', header: 'Proctored Examination — Elite + High Distinction',  level: 'national',      points: 60,  badge: 'National',      icon: '🥇', activity: 'Proctored Examination — Elite + High Distinction (60 pts)' },
    { id: 'cert_proctored_std',  header: 'Proctored Examination — Standard Certified Grade',  level: 'state',         points: 50,  badge: 'State',         icon: '🥈', activity: 'Proctored Examination — Standard Certified Grade (50 pts)' },
    { id: 'cert_foundational',   header: 'Foundational / Entry Level Competency Certification',level: 'university',    points: 40,  badge: 'University',    icon: '🛡️', activity: 'Foundational / Entry Level Competency Certification (40 pts)' },
    { id: 'cert_course_series',  header: 'Multi-Course Technical Specialization Series',       level: 'university',    points: 25,  badge: 'University',    icon: '📚', activity: 'Multi-Course Specialization Series (25 pts)' },
    { id: 'cert_skill_badge',    header: 'Course Completion & Verified Skill Assessment',      level: 'institutional', points: 10,  badge: 'Institutional', icon: '🏷️', activity: 'Course Completion & Verified Skill Assessment (10 pts)' }
  ]
};

// ── Official Scoring Rubric Specification Table (Zero Company Names, Levels & Points) ──
const OFFICIAL_RUBRIC_SPEC = [
  // Flattened items from all accredited categories
  ...Object.entries(CATEGORY_ACTIVITY_TYPES).flatMap(([catKey, items]) =>
    items.map(item => ({ ...item, category: catKey }))
  ),
  // Legacy aliases with updated clean company-free descriptions (for backwards compatibility)
  { id: 'global_cert',        header: 'Advanced Professional Certification', activity: 'Advanced / Professional Level Certification (100 pts)', points: 100, icon: '🌐', badge: 'International', category: 'certification' },
  { id: 'assoc_cert',         header: 'Associate Level Certification',       activity: 'Intermediate / Associate Level Certification (75 pts)', points: 75,  icon: '📜', badge: 'National',      category: 'certification' },
  { id: 'nptel_gold',         header: 'Proctored Exam — Elite + Gold',       activity: 'Proctored Exam — Elite + Gold Grade (60 pts)',           points: 60,  icon: '🥇', badge: 'National',      category: 'certification' },
  { id: 'nptel_silver',       header: 'Proctored Exam — Elite + Silver',     activity: 'Proctored Exam — Elite + Silver Grade (50 pts)',         points: 50,  icon: '🥈', badge: 'State',         category: 'certification' },
  { id: 'foundational_cert',  header: 'Foundational Level Certification',    activity: 'Foundational / Entry Level Certification (40 pts)',      points: 40,  icon: '🛡️', badge: 'University',    category: 'certification' },
  { id: 'mooc_spec',          header: 'Multi-Course Specialization Series',  activity: 'Specialized Multi-Course Series (25 pts)',               points: 25,  icon: '📚', badge: 'University',    category: 'certification' },
  { id: 'skill_badge',        header: 'Course Completion & Skill Badge',     activity: 'Course Completion & Skill Assessment (10 pts)',          points: 10,  icon: '🏷️', badge: 'Institutional', category: 'certification' },
  { id: 'hackathon_winner',   header: 'Technical Competition — 1st Prize',   activity: 'Winner / 1st Prize Position (50 pts)',                   points: 50,  icon: '🏆', badge: 'National',      category: 'hackathon' },
  { id: 'hackathon_runnerup', header: 'Technical Competition — Runner-Up',   activity: 'Runner-Up / 2nd / 3rd Prize (30 pts)',                   points: 30,  icon: '🥈', badge: 'State',         category: 'hackathon' },
  { id: 'event_participation',header: 'Event Participation',                 activity: 'Official Technical Event Participation (10 pts)',        points: 10,  icon: '🎫', badge: 'Institutional', category: 'technical' },
  { id: 'ieee_paper',         header: 'Conference Paper Presentation',       activity: 'Conference Oral Paper Presentation (50 pts)',            points: 50,  icon: '📄', badge: 'International', category: 'paper' }
];

// ── Rubric Weights ──────────────────────────────────────────
const RUBRIC = {
  technical:       { international:100, national:75, state:50, university:30, institutional:15 },
  hackathon:       { international:100, national:75, state:50, university:30, institutional:15 },
  paper:           { international:60,  national:40, state:25, university:15, institutional:10 },
  publication:     { international:100, national:80, state:60, university:40, institutional:20 },
  patent:          { granted:100, published:60 },
  sports:          { international:100, national:80, state:60, university:40, institutional:20 },
  cultural:        { international:80,  national:60, state:40, university:25, institutional:15 },
  entrepreneurship:{ international:90,  national:70, state:50, university:30, institutional:20 },
  social:          { international:50,  national:40, state:30, university:20, institutional:15 },
  certification:   { international:100, national:75, state:50, university:40, institutional:10 }
};

// ── Category Metadata ───────────────────────────────────────
const CATEGORIES = {
  technical:        { label:'Technical Competition', icon:'🏆', color:'#7c3aed', gradient:'linear-gradient(135deg,#7c3aed,#4f46e5)' },
  hackathon:        { label:'Hackathon & Coding',    icon:'💻', color:'#2563eb', gradient:'linear-gradient(135deg,#2563eb,#06b6d4)' },
  paper:            { label:'Paper Presentation',    icon:'📄', color:'#0891b2', gradient:'linear-gradient(135deg,#0891b2,#0284c7)' },
  publication:      { label:'Publication / Research',icon:'📚', color:'#059669', gradient:'linear-gradient(135deg,#059669,#047857)' },
  patent:           { label:'Patent (Granted/Filed)',icon:'💡', color:'#d97706', gradient:'linear-gradient(135deg,#d97706,#b45309)' },
  sports:           { label:'Sports / Athletics',    icon:'⚽', color:'#dc2626', gradient:'linear-gradient(135deg,#dc2626,#b91c1c)' },
  cultural:         { label:'Cultural Activities',   icon:'🎭', color:'#db2777', gradient:'linear-gradient(135deg,#db2777,#be185d)' },
  entrepreneurship: { label:'Entrepreneurship',      icon:'🚀', color:'#ea580c', gradient:'linear-gradient(135deg,#ea580c,#c2410c)' },
  social:           { label:'Social Service / NSS',  icon:'🤝', color:'#6d28d9', gradient:'linear-gradient(135deg,#6d28d9,#4338ca)' },
  certification:    { label:'Industry Certification',icon:'🎓', color:'#0d9488', gradient:'linear-gradient(135deg,#0d9488,#0f766e)' }
};

// ── Levels ──────────────────────────────────────────────────
const LEVELS = [
  { id:'international', label:'International / Global', badge:'🌍', tier:5 },
  { id:'national',      label:'National / Inter-Univ', badge:'🇮🇳', tier:4 },
  { id:'state',         label:'State Level',           badge:'🏙️', tier:3 },
  { id:'university',    label:'University Level',      badge:'🏫', tier:2 },
  { id:'institutional', label:'Institutional / College', badge:'🏢', tier:1 },
  { id:'granted',       label:'Granted',               badge:'✅', tier:5 },
  { id:'published',     label:'Published / Filed',     badge:'📋', tier:4 }
];

// ── Known Issuers ───────────────────────────────────────────
const KNOWN_ISSUERS = [
  'google','coursera','microsoft','oracle','cisco','ibm','amazon','aws',
  'hackerrank','codechef','leetcode','topcoder','geeksforgeeks',
  'ieee','acm','springer','elsevier','wiley',
  'nasscom','aicte','ugc','mhrd',
  'national sports federation','aiu','bcci','aiff',
  'nptel','swayam','udemy','edx','linkedin','red hat'
];

// ── Departments ─────────────────────────────────────────────
const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Information Technology',
  'MBA',
  'MCA'
];

// ── Students ─────────────────────────────────────────────────
let STUDENTS = [
  {
    id: 'STU001',
    name: 'Aarav Sharma',
    roll: '211FA04001',
    dept: 'Computer Science & Engineering',
    batch: '2021-25',
    year: 'Year 3',
    email: 'aarav.sharma@vignan.ac.in',
    phone: '9848012345',
    cgpa: 8.92,
    avatar: '👨‍💻'
  },
  {
    id: 'STU002',
    name: 'Priya Nair',
    roll: '211FA05042',
    dept: 'Electronics & Communication',
    batch: '2021-25',
    year: 'Year 3',
    email: 'priya.nair@vignan.ac.in',
    phone: '9848012346',
    cgpa: 8.65,
    avatar: '👩‍🔬'
  },
  {
    id: 'STU003',
    name: 'Rohan Verma',
    roll: '221MB01015',
    dept: 'MBA',
    batch: '2022-24',
    year: 'Year 2',
    email: 'rohan.verma@vignan.ac.in',
    phone: '9848012347',
    cgpa: 8.10,
    avatar: '👨‍💼'
  },
  {
    id: 'STU004',
    name: 'Ananya Patel',
    roll: '211FA08033',
    dept: 'Mechanical Engineering',
    batch: '2021-25',
    year: 'Year 3',
    email: 'ananya.patel@vignan.ac.in',
    phone: '9848012348',
    cgpa: 8.78,
    avatar: '👩‍🏭'
  },
  {
    id: 'STU005',
    name: 'Kiran Rao',
    roll: '221FA04018',
    dept: 'Computer Science & Engineering',
    batch: '2022-26',
    year: 'Year 2',
    email: 'kiran.rao@vignan.ac.in',
    phone: '9848012349',
    cgpa: 9.35,
    avatar: '🧑‍🎓'
  }
];

// ── Achievements Database with Document Proof Metadata ────────
let ACHIEVEMENTS = [];

// ── Pending Verification Queue ───────────────────────────────
let PENDING_QUEUE = [];

// ── Notifications ────────────────────────────────────────────
let NOTIFICATIONS = [
  { id:'N1', type:'info',    title:'2 Achievements Awaiting Faculty Review', body:'Google Cloud Professional & State Hackathon Runner-Up pending.', time:'10 mins ago', read:false },
  { id:'N2', type:'success', title:'NPTEL Elite + Gold Verified!',            body:'Dr. Meena Iyer approved Deep Learning certification (+60 pts).', time:'1 hr ago',    read:false },
  { id:'N3', type:'info',    title:'Agent 44 Central Profile Synced',         body:'Curriculum Vitae has been refreshed with accredited records.', time:'1 day ago',   read:false },
  { id:'N4', type:'warning', title:'Participation Gap Identified (Mech)',     body:'Mechanical Engineering Year 3 has 0 patent filings. Routed to Student Affairs.', time:'2 hrs ago', read:false },
  { id:'N5', type:'success', title:'Agent 13 Recognition Roster Updated',     body:'Aarav Sharma nominated for Chancellor\'s Gold Medal.', time:'3 hrs ago', read:false }
];

// ── Agent 48: 7 Multi-Source Input Channels (From Specification) ─
const MULTI_INPUT_STREAMS = [
  {
    id: 'stream_student',
    num: '1',
    title: 'Student-Submitted Records with Proof',
    desc: 'Individual claims uploaded with digital certificates, verified via Agent 64 OCR.',
    icon: '🧑‍🎓',
    count: 24,
    badge: 'Agent 64 OCR Active',
    color: '#2563eb'
  },
  {
    id: 'stream_organiser',
    num: '2',
    title: 'Event Organiser Reports',
    desc: 'Official master reports ingested from university fests, hackathons, and symposiums.',
    icon: '📋',
    count: 12,
    badge: 'Batch Ingest Ready',
    color: '#059669'
  },
  {
    id: 'stream_faculty',
    num: '3',
    title: 'Faculty Nominations',
    desc: 'Direct nominations submitted by professors and research supervisors for exceptional student work.',
    icon: '👨‍🏫',
    count: 8,
    badge: 'Faculty Endorsed',
    color: '#7c3aed'
  },
  {
    id: 'stream_hackathons',
    num: '4',
    title: 'Competition & Hackathon Results',
    desc: 'Verified award rosters from SIH, ACM ICPC, AP State Hackathon, and code summits.',
    icon: '💻',
    count: 18,
    badge: 'Direct API Verified',
    color: '#0891b2'
  },
  {
    id: 'stream_sports_cultural',
    num: '5',
    title: 'Sports & Cultural Records',
    desc: 'AIU Inter-University, State Games, National Youth Festival athletic and fine-arts records.',
    icon: '⚽',
    count: 15,
    badge: 'Sports Cell Validated',
    color: '#dc2626'
  },
  {
    id: 'stream_agent68',
    num: '6',
    title: 'Certification Data from Agent 68',
    desc: 'Automated digital credential feed from AWS, Coursera, NPTEL, Microsoft, and Google.',
    icon: '🎓',
    count: 42,
    badge: 'Agent 68 Stream Live',
    color: '#d97706'
  },
  {
    id: 'stream_publications',
    num: '7',
    title: 'Publication Records (Student Co-Authors)',
    desc: 'IEEE Xplore, Scopus, Springer, and UGC CARE papers where students are listed authors.',
    icon: '📚',
    count: 9,
    badge: 'Scopus / DOI Indexed',
    color: '#4f46e5'
  }
];

// ── Agent 48: Participation Gap Analysis (Workflow Step 8) ──────
let PARTICIPATION_GAPS = [];

// ── Agent 48: High-Achieving Students for Agent 13 (Step 7) ──────
let AGENT13_RECOGNITIONS = [];

// ── Agent 48 Workflow Step 6 & 8: LIVE computation (not fixtures) ──
// These read the actual ACHIEVEMENTS/STUDENTS arrays every time so the
// lists update the moment a record is submitted, verified, or rejected.

function computeHighAchievers(minPts = 100) {
  return STUDENTS.map(s => {
    const totalPts = getTotalScore(s.id);
    const verified = getAchievements(s.id)
      .filter(a => a.status === 'verified')
      .sort((a, b) => (b.points || 0) - (a.points || 0));
    const top = verified[0];
    const tag = totalPts >= 250
      ? { honorTag: "Chancellor's Gold Medal Finalist", agent13Nomination: "Dean's Honor Roll (Tier 1)", awardPill: '₹25,000 Institutional Fellowship' }
      : totalPts >= 180
      ? { honorTag: 'Best All-Rounder Candidate', agent13Nomination: 'Sports Excellence Citation', awardPill: 'VFSTR Blazer of Honor' }
      : { honorTag: 'Young Researcher Citation', agent13Nomination: 'Academic Distinction Badge', awardPill: 'Agent 13 Merit Grant' };
    return {
      id: 'REC_' + s.id,
      studentId: s.id,
      name: s.name,
      roll: s.roll,
      dept: s.dept,
      year: s.year,
      totalPts,
      topAchievement: top ? top.title : 'No verified achievements yet',
      ...tag,
      syncedToAgent13: false
    };
  })
  .filter(r => r.totalPts >= minPts)
  .sort((a, b) => b.totalPts - a.totalPts);
}

function computeParticipationGaps(minRatePct = 25) {
  const gaps = [];
  const catKeys = Object.keys(CATEGORIES);

  DEPARTMENTS.forEach(dept => {
    const deptStudents = STUDENTS.filter(s => s.dept === dept);
    if (deptStudents.length === 0) return;

    catKeys.forEach(cat => {
      const participantIds = new Set(
        ACHIEVEMENTS.filter(a => a.status === 'verified' && a.category === cat).map(a => a.studentId)
      );
      const deptParticipants = deptStudents.filter(s => participantIds.has(s.id)).length;
      const rate = (deptParticipants / deptStudents.length) * 100;

      if (rate < minRatePct) {
        gaps.push({
          id: `GAP_${dept.replace(/\s+/g, '')}_${cat}`,
          dept,
          batch: `${deptStudents[0].batch} (${deptStudents[0].year})`,
          category: cat,
          participationRate: rate.toFixed(1) + '%',
          details: `${deptParticipants} of ${deptStudents.length} tracked ${dept} students have a verified ${CATEGORIES[cat].label} record.`,
          severity: rate === 0 ? 'Critical Gap' : rate < 10 ? 'Moderate Gap' : 'Attention Needed',
          severityClass: rate === 0 ? 'gap-critical' : rate < 10 ? 'gap-moderate' : 'gap-attention',
          actionNeeded: `Organize a ${CATEGORIES[cat].label} awareness/enrollment drive for ${dept}`,
          routedToStudentAffairs: false,
          dateFlagged: new Date().toISOString().split('T')[0]
        });
      }
    });
  });

  return gaps.sort((a, b) => parseFloat(a.participationRate) - parseFloat(b.participationRate));
}

// Recompute PARTICIPATION_GAPS and AGENT13_RECOGNITIONS from live data,
// while preserving any routed/synced flags a faculty member already set.
function refreshInsights() {
  const prevGapFlags = {};
  (PARTICIPATION_GAPS || []).forEach(g => { prevGapFlags[g.id] = g.routedToStudentAffairs; });
  const prevRecFlags = {};
  (AGENT13_RECOGNITIONS || []).forEach(r => { prevRecFlags[r.id] = r.syncedToAgent13; });

  PARTICIPATION_GAPS = computeParticipationGaps().map(g => ({
    ...g,
    routedToStudentAffairs: prevGapFlags[g.id] || false
  }));

  AGENT13_RECOGNITIONS = computeHighAchievers().map(r => ({
    ...r,
    syncedToAgent13: prevRecFlags[r.id] || false
  }));
}

// ── Agent 48: Evidence Archive (Workflow Step 9) ─────────────────
let EVIDENCE_ARCHIVE = [
  {
    docId: 'VFSTR-DOC-SIH-9921',
    achId: 'ACH001',
    studentName: 'Aarav Sharma',
    roll: '211FA04001',
    dept: 'CSE',
    title: 'Smart India Hackathon 2023 — 1st Prize Winner',
    category: 'hackathon',
    issuer: 'AICTE & MoE Govt of India',
    date: '2023-09-15',
    points: 50,
    credentialHash: 'SHA256:7f92b49c01ad283e74c8',
    ocrConfidence: '99.2%',
    archivedStatus: 'Authenticated & Indexed'
  },
  {
    docId: 'AWS-CERT-SAA-2023-8812',
    achId: 'ACH002',
    studentName: 'Aarav Sharma',
    roll: '211FA04001',
    dept: 'CSE',
    title: 'AWS Certified Solutions Architect — Associate',
    category: 'certification',
    issuer: 'Amazon Web Services',
    date: '2023-11-10',
    points: 75,
    credentialHash: 'SHA256:4a12ec89bf204910dc78',
    ocrConfidence: '99.8%',
    archivedStatus: 'Authenticated & Indexed'
  },
  {
    docId: 'NPTEL23CS88S192801',
    achId: 'ACH003',
    studentName: 'Aarav Sharma',
    roll: '211FA04001',
    dept: 'CSE',
    title: 'NPTEL SWAYAM: Deep Learning — Elite + Gold',
    category: 'certification',
    issuer: 'NPTEL & IIT Madras',
    date: '2023-10-25',
    points: 60,
    credentialHash: 'SHA256:d812048fc2019a820b12',
    ocrConfidence: '99.5%',
    archivedStatus: 'Authenticated & Indexed'
  },
  {
    docId: 'MS-AZ104-2023-4410',
    achId: 'ACH006',
    studentName: 'Priya Nair',
    roll: '211FA05042',
    dept: 'ECE',
    title: 'Microsoft Azure Administrator (AZ-104) Associate',
    category: 'certification',
    issuer: 'Microsoft',
    date: '2023-08-20',
    points: 75,
    credentialHash: 'SHA256:39d01f891024ba9180f1',
    ocrConfidence: '99.9%',
    archivedStatus: 'Authenticated & Indexed'
  },
  {
    docId: 'AIU-ATH-2023-SILVER-100M',
    achId: 'ACH007',
    studentName: 'Priya Nair',
    roll: '211FA05042',
    dept: 'ECE',
    title: 'All India Inter-University Athletics — Silver (100m)',
    category: 'sports',
    issuer: 'Association of Indian Universities',
    date: '2023-12-05',
    points: 50,
    credentialHash: 'SHA256:77291048ca0194e819f0',
    ocrConfidence: '99.0%',
    archivedStatus: 'Authenticated & Indexed'
  }
];

// ── OCR Mock Templates ───────────────────────────────────────
const OCR_TEMPLATES = [
  {
    title: 'AWS Certified Solutions Architect — Associate',
    issuer: 'Amazon Web Services',
    category: 'certification',
    level: 'international',
    position: 'Certified',
    rubricSpecKey: 'assoc_cert',
    date: '2024-02-15',
    description: 'Demonstrated knowledge of architecting secure, robust applications on AWS technologies.'
  },
  {
    title: 'Cisco Certified Network Professional (CCNP Enterprise)',
    issuer: 'Cisco Systems',
    category: 'certification',
    level: 'international',
    position: 'Certified Professional',
    rubricSpecKey: 'global_cert',
    date: '2024-01-10',
    description: 'Mastery in enterprise networking, dual-stack architecture, virtualization and network assurance.'
  },
  {
    title: 'NPTEL / SWAYAM: Cloud Computing — Elite + Gold (94%)',
    issuer: 'NPTEL & IIT Kharagpur',
    category: 'certification',
    level: 'national',
    position: 'Top 1% / Elite + Gold',
    rubricSpecKey: 'nptel_gold',
    date: '2024-03-01',
    description: 'Completed 12-week proctored NPTEL exam on distributed architectures and virtualization.'
  },
  {
    title: 'National Robotics Hackathon 2024 — 1st Prize Winner',
    issuer: 'AICTE & IEEE Robotics Society',
    category: 'hackathon',
    level: 'national',
    position: '1st Prize / Winner',
    rubricSpecKey: 'hackathon_winner',
    date: '2024-02-22',
    description: 'Designed an autonomous warehouse navigation robot with ROS2 and LiDAR point-cloud mapping.'
  },
  {
    title: 'DeepLearning.AI TensorFlow Developer Specialization',
    issuer: 'Coursera & DeepLearning.AI',
    category: 'certification',
    level: 'international',
    position: 'Specialization Completed',
    rubricSpecKey: 'mooc_spec',
    date: '2024-01-28',
    description: 'Four-course series covering computer vision, NLP, time series and TensorFlow model deployment.'
  }
];

// ── Academic Semesters ───────────────────────────────────────
const SEMESTERS = [
  'Odd 2021-22', 'Even 2021-22',
  'Odd 2022-23', 'Even 2022-23',
  'Odd 2023-24', 'Even 2023-24',
  'Odd 2024-25', 'Even 2024-25'
];

// ── Helpers ───────────────────────────────────────────────────
function getStudent(id) {
  return STUDENTS.find(s => s.id === id) || STUDENTS[0];
}

function getAchievements(studentId) {
  return ACHIEVEMENTS.filter(a => a.studentId === studentId && a.status !== 'rejected');
}

function getTotalScore(studentId) {
  return getAchievements(studentId)
    .filter(a => a.status === 'verified')
    .reduce((sum, a) => sum + (a.points || 0), 0);
}

function getCategoryScore(studentId, cat) {
  return getAchievements(studentId)
    .filter(a => a.category === cat && a.status === 'verified')
    .reduce((sum, a) => sum + (a.points || 0), 0);
}

// Year scoring calculation (Uncapped — a student can do as much as he/she wants, no upper limit)
function calculateYearScore(studentId, year = 3) {
  const targetYear = parseInt(year, 10) || 3;
  
  // Filter achievements belonging to target student and target year
  const allVerified = getAchievements(studentId).filter(a => a.status === 'verified');
  
  const yearAchs = allVerified.filter(a => {
    if (typeof a.academicYear === 'number') {
      return a.academicYear === targetYear;
    }
    if (a.academicYear) {
      return parseInt(a.academicYear, 10) === targetYear;
    }
    // Fallback: match by semester or date
    const sem = (a.semester || '').toLowerCase();
    const dt  = a.date || '';
    if (targetYear === 1) return sem.includes('2021-22') || dt.startsWith('2021') || dt.startsWith('2022-0');
    if (targetYear === 2) return sem.includes('2022-23') || dt.startsWith('2022') || dt.startsWith('2023-0');
    if (targetYear === 3) return sem.includes('2023-24') || dt.startsWith('2023') || dt.startsWith('2024-0');
    if (targetYear === 4) return sem.includes('2024-25') || dt.startsWith('2024') || dt.startsWith('2025');
    return false;
  });

  const totalPoints = yearAchs.reduce((sum, a) => sum + (a.points || 0), 0);

  return {
    year: `Year ${targetYear}`,
    score: totalPoints,
    cappedScore: totalPoints, // unconstrained, aliases totalPoints for backwards compatibility
    maxScore: null,           // removed max score constraint per user request
    uncappedPoints: totalPoints,
    achievementCount: yearAchs.length,
    unlimited: true
  };
}

function generateId(prefix) {
  return prefix + Date.now().toString(36).toUpperCase();
}

// ── Agent 48 Action Handlers ──────────────────────────────────
function routeGapToStudentAffairs(gapId) {
  const gap = PARTICIPATION_GAPS.find(g => g.id === gapId);
  if (gap) {
    gap.routedToStudentAffairs = true;
    NOTIFICATIONS.unshift({
      id: generateId('NOTIF_GAP_'),
      type: 'warning',
      title: `Gap Routed: ${gap.dept} (${gap.batch})`,
      body: `Category: ${gap.category.toUpperCase()} gap flagged. Action: ${gap.actionNeeded}`,
      time: 'Just now',
      read: false
    });
    if (typeof showToast === 'function') {
      showToast(`Routed to Student Affairs: ${gap.dept} (${gap.category})`, 'success');
    }
  }
}

function pushAllToAgent13() {
  AGENT13_RECOGNITIONS.forEach(r => r.syncedToAgent13 = true);
  NOTIFICATIONS.unshift({
    id: generateId('NOTIF_A13_'),
    type: 'success',
    title: 'Agent 13 Synced with Recognition Roster',
    body: `${AGENT13_RECOGNITIONS.length} high-achieving student portfolios dispatched to Awards Committee.`,
    time: 'Just now',
    read: false
  });
  if (typeof showToast === 'function') {
    showToast(`Dispatched ${AGENT13_RECOGNITIONS.length} candidate files to Agent 13 Awards Committee!`, 'success');
  }
}

function submitFacultyNomination(studentId, title, category, level, points, justification) {
  const stu = getStudent(studentId);
  const newAch = {
    id: generateId('ACH_FAC_'),
    studentId: stu.id,
    category: category || 'technical',
    level: level || 'national',
    title: title || 'Faculty Nominated Research Achievement',
    issuer: 'VFSTR Faculty Board & Department Council',
    position: 'Nominated & Approved',
    rubricSpecKey: 'hackathon_winner',
    points: parseInt(points, 10) || 50,
    date: new Date().toISOString().split('T')[0],
    description: justification || 'Nominated directly by faculty supervisor for outstanding outside-coursework contribution.',
    status: 'verified',
    verifiedBy: 'Dr. Rajesh Kumar (Faculty Verifier)',
    verifiedDate: new Date().toISOString().split('T')[0],
    autoVerified: false,
    semester: 'Even 2023-24',
    proofFile: 'Faculty_Nomination_Docket.pdf',
    docMetadata: {
      docId: `VFSTR-NOM-${Date.now().toString(36).toUpperCase()}`,
      issuer: 'VFSTR Academic Council',
      examOrAward: title,
      scoreOrGrade: 'Faculty Endorsed',
      credentialHash: `SHA256:fac902${Date.now()}`,
      ocrConfidence: '100% (Faculty Certified)'
    }
  };

  ACHIEVEMENTS.unshift(newAch);
  saveData();
  if (typeof saveAchievementsToServer === 'function') saveAchievementsToServer();
  refreshInsights();

  if (typeof showToast === 'function') {
    showToast(`Faculty nomination confirmed for ${stu.name} (+${newAch.points} pts)!`, 'success');
  }
  return newAch;
}

// ── Save / Load (localStorage) ───────────────────────────────
function saveData() {
  try {
    localStorage.setItem('vignan_achievements_v2', JSON.stringify(ACHIEVEMENTS));
    localStorage.setItem('vignan_students_v2',     JSON.stringify(STUDENTS));
  } catch(e) {}
}

function loadData() {
  try {
    const rawAch = localStorage.getItem('vignan_achievements_v2');
    if (rawAch) {
      const parsed = JSON.parse(rawAch);
      if (Array.isArray(parsed)) {
        ACHIEVEMENTS = parsed;
        PENDING_QUEUE = ACHIEVEMENTS.filter(a => a.status === 'pending');
      }
    }
    const rawStu = localStorage.getItem('vignan_students_v2');
    if (rawStu) {
      const parsedStu = JSON.parse(rawStu);
      if (Array.isArray(parsedStu) && parsedStu.length > 0) {
        STUDENTS = parsedStu;
      }
    }
  } catch(e) {}
}

function clearAllData() {
  ACHIEVEMENTS = [];
  PENDING_QUEUE = [];
  try {
    localStorage.removeItem('vignan_achievements_v2');
    localStorage.removeItem('vfstr_auth_user');
  } catch(e) {}
  saveData();
  if (typeof saveAchievementsToServer === 'function') {
    saveAchievementsToServer();
  }
  refreshInsights();
  if (typeof showToast === 'function') {
    showToast('All achievement records and cache have been cleared.', 'info');
  }
}

if (typeof window !== 'undefined') {
  window.clearAllData = clearAllData;
  window.loadData = loadData;
}

loadData();

