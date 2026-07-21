// ============================================================
// VALAVAN VENTURES — DIGITAL AGENCY EMS MOCK DATA
// ============================================================

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  HR: 'hr',
  MANAGER: 'manager',
  EMPLOYEE: 'employee',
};

export const DEPARTMENTS = [
  'Management',
  'Graphic Design',
  'Video Editing',
  'Web Design',
  'UI/UX Design',
  'WordPress Development',
  'Shopify Development',
  'SEO',
  'Social Media Marketing',
  'Sales',
  'HR',
  'Accounts',
];

export const HOLIDAYS = [
  { id: 'h1', name: 'New Year', date: '2026-01-01', type: 'national', recurring: true },
  { id: 'h2', name: 'Pongal', date: '2026-01-14', type: 'regional', recurring: true },
  { id: 'h3', name: 'Republic Day', date: '2026-01-26', type: 'national', recurring: true },
  { id: 'h4', name: 'May Day', date: '2026-05-01', type: 'national', recurring: true },
  { id: 'h5', name: 'Independence Day', date: '2026-08-15', type: 'national', recurring: true },
  { id: 'h6', name: 'Gandhi Jayanti', date: '2026-10-02', type: 'national', recurring: true },
  { id: 'h7', name: 'Diwali', date: '2026-10-20', type: 'regional', recurring: true },
  { id: 'h8', name: 'Christmas', date: '2026-12-25', type: 'national', recurring: true },
];

export const LEAVE_TYPES = [
  { id: 'earned', label: 'Earned Leave' },
  { id: 'casual', label: 'Casual Leave' },
  { id: 'sick', label: 'Sick Leave' },
  { id: 'comp_off', label: 'Comp Off' },
  { id: 'loss_of_pay', label: 'Loss Of Pay' },
  { id: 'wfh', label: 'Work From Home' },
  { id: 'emergency', label: 'Emergency Leave' },
];

export const DESIGNATIONS = [
  // Management
  'CEO', 'COO', 'CTO', 'General Manager',
  // Design
  'Graphic Designer', 'Senior Graphic Designer', 'Lead Graphic Designer',
  // Video
  'Video Editor', 'Senior Video Editor', 'Motion Graphic Designer',
  // Web Design
  'Web Designer', 'Senior Web Designer', 'Lead Web Designer',
  // UI/UX
  'UI/UX Designer', 'Senior UI/UX Designer', 'UX Researcher',
  // WordPress
  'WordPress Developer', 'Senior WordPress Developer', 'WordPress Lead',
  // Shopify
  'Shopify Developer', 'Senior Shopify Developer',
  // SEO
  'SEO Executive', 'Senior SEO Executive', 'SEO Analyst',
  // Social Media
  'Social Media Manager', 'Social Media Executive', 'Content Creator',
  // Sales
  'Sales Executive', 'Senior Sales Executive', 'Business Development Manager',
  // HR & Accounts
  'HR Executive', 'HR Manager', 'Accounts Executive', 'Finance Manager',
  // General
  'Project Manager', 'Super Admin',
];

export const EMPLOYEE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ON_LEAVE: 'on_leave',
  SUSPENDED: 'suspended',
  RESIGNED: 'resigned',
  NOTICE_PERIOD: 'notice_period',
  HALF_DAY: 'half_day',
  WFH: 'wfh',
  HOLIDAY: 'holiday',
};

export const mockUsers = [
  {
    id: 'u1', employeeId: 'EMP-1001',
    name: 'Valavan', email: 'Valavan', password: 'Valavan@123',
    role: ROLES.SUPER_ADMIN, department: 'Management', designation: 'Founder',
    joinDate: '2020-01-10', phone: '+91 98765 43210', location: 'Chennai, Tamil Nadu',
    performanceScore: 98, attendancePercent: 99, status: EMPLOYEE_STATUS.ACTIVE,
    leaveBalance: { sick: 10, casual: 12, earned: 15, loss_of_pay: 0, comp_off: 0, emergency: 2 },
  },
  {
    id: 'u2', employeeId: 'EMP-1002',
    name: 'Saranya', email: 'Saranya', password: 'Saranya@123',
    role: ROLES.EMPLOYEE, department: 'Management', designation: 'Director',
    joinDate: '2021-02-15', phone: '+91 87654 32109', location: 'Chennai, Tamil Nadu',
    performanceScore: 95, attendancePercent: 96, status: EMPLOYEE_STATUS.ACTIVE,
    leaveBalance: { sick: 8, casual: 10, earned: 12, loss_of_pay: 0, comp_off: 0, emergency: 2 },
  },
  {
    id: 'u3', employeeId: 'EMP-1003',
    name: 'Ganapathy', email: 'Ganapathy', password: 'Ganapathy@123',
    role: ROLES.ADMIN, department: 'Management', designation: 'CEO',
    joinDate: '2021-05-20', phone: '+91 76543 21098', location: 'Chennai, Tamil Nadu',
    performanceScore: 97, attendancePercent: 98, status: EMPLOYEE_STATUS.ACTIVE,
    leaveBalance: { sick: 8, casual: 10, earned: 12, loss_of_pay: 0, comp_off: 0, emergency: 2 },
  },
  {
    id: 'u4', employeeId: 'EMP-1004',
    name: 'Vithiya', email: 'Vithiya', password: 'Vithiya@123',
    role: ROLES.EMPLOYEE, department: 'Marketing', designation: 'Performance Marketer',
    joinDate: '2022-01-10', phone: '+91 65432 10987', location: 'Chennai, Tamil Nadu',
    performanceScore: 92, attendancePercent: 94, status: EMPLOYEE_STATUS.ACTIVE,
    leaveBalance: { sick: 6, casual: 8, earned: 10, loss_of_pay: 0, comp_off: 0, emergency: 2 },
  },
  {
    id: 'u5', employeeId: 'EMP-1005',
    name: 'Soban', email: 'Soban', password: 'Soban@123',
    role: ROLES.EMPLOYEE, department: 'Web Design', designation: 'Senior Web Designer',
    joinDate: '2022-03-15', phone: '+91 54321 09876', location: 'Chennai, Tamil Nadu',
    performanceScore: 88, attendancePercent: 91, status: EMPLOYEE_STATUS.ACTIVE,
    leaveBalance: { sick: 6, casual: 8, earned: 10, loss_of_pay: 0, comp_off: 0, emergency: 2 },
  },
  {
    id: 'u6', employeeId: 'EMP-1006',
    name: 'Suganesh', email: 'Suganesh', password: 'Suganesh@123',
    role: ROLES.EMPLOYEE, department: 'Graphic Design', designation: 'Senior Graphic Designer',
    joinDate: '2022-06-01', phone: '+91 43210 98765', location: 'Chennai, Tamil Nadu',
    performanceScore: 89, attendancePercent: 92, status: EMPLOYEE_STATUS.ACTIVE,
    leaveBalance: { sick: 6, casual: 8, earned: 10, loss_of_pay: 0, comp_off: 0, emergency: 2 },
  },
  {
    id: 'u7', employeeId: 'EMP-1007',
    name: 'Vicky R', email: 'VickyR', password: 'VickyR@123',
    role: ROLES.EMPLOYEE, department: 'Video Editing', designation: 'Senior Video Editor',
    joinDate: '2022-08-20', phone: '+91 32109 87654', location: 'Chennai, Tamil Nadu',
    performanceScore: 91, attendancePercent: 93, status: EMPLOYEE_STATUS.ACTIVE,
    leaveBalance: { sick: 6, casual: 8, earned: 10, loss_of_pay: 0, comp_off: 0, emergency: 2 },
  },
  {
    id: 'u8', employeeId: 'EMP-1008',
    name: 'Jaya Suriya S', email: 'JayaSuriya', password: 'JayaSuriya@123',
    role: ROLES.EMPLOYEE, department: 'Accounts', designation: 'Accounting Manager',
    joinDate: '2023-01-15', phone: '+91 21098 76543', location: 'Chennai, Tamil Nadu',
    performanceScore: 94, attendancePercent: 97, status: EMPLOYEE_STATUS.ACTIVE,
    leaveBalance: { sick: 6, casual: 8, earned: 10, loss_of_pay: 0, comp_off: 0, emergency: 2 },
  },
  {
    id: 'u9', employeeId: 'EMP-1009',
    name: 'RP Kiran Kumar', email: 'RPKiranKumar', password: 'RPKiranKumar@123',
    role: ROLES.EMPLOYEE, department: 'Management', designation: 'Brand Specialist',
    joinDate: '2023-04-10', phone: '+91 10987 65432', location: 'Chennai, Tamil Nadu',
    performanceScore: 87, attendancePercent: 89, status: EMPLOYEE_STATUS.ACTIVE,
    leaveBalance: { sick: 6, casual: 8, earned: 10, loss_of_pay: 0, comp_off: 0, emergency: 2 },
  },
  {
    id: 'u10', employeeId: 'EMP-1010',
    name: 'Nandha Kumar', email: 'Nandha', password: 'Nandha@123',
    role: ROLES.ADMIN, department: 'Management', designation: 'Service Manager',
    joinDate: '2023-06-05', phone: '+91 99887 76655', location: 'Chennai, Tamil Nadu',
    performanceScore: 93, attendancePercent: 95, status: EMPLOYEE_STATUS.ACTIVE,
    leaveBalance: { sick: 6, casual: 8, earned: 10, loss_of_pay: 0, comp_off: 0, emergency: 2 },
  },
  {
    id: 'u11', employeeId: 'EMP-1011',
    name: 'Sundhar', email: 'Sundhar', password: 'Sundhar@123',
    role: ROLES.EMPLOYEE, department: 'Management', designation: 'Success Manager',
    joinDate: '2023-09-12', phone: '+91 88776 65544', location: 'Chennai, Tamil Nadu',
    performanceScore: 85, attendancePercent: 88, status: EMPLOYEE_STATUS.ACTIVE,
    leaveBalance: { sick: 6, casual: 8, earned: 10, loss_of_pay: 0, comp_off: 0, emergency: 2 },
  },
  {
    id: 'u12', employeeId: 'EMP-1012',
    name: 'Vicky M', email: 'VickyM', password: 'VickyM@123',
    role: ROLES.EMPLOYEE, department: 'Video Editing', designation: 'Video Editor',
    joinDate: '2023-11-20', phone: '+91 77665 54433', location: 'Chennai, Tamil Nadu',
    performanceScore: 86, attendancePercent: 90, status: EMPLOYEE_STATUS.ACTIVE,
    leaveBalance: { sick: 6, casual: 8, earned: 10, loss_of_pay: 0, comp_off: 0, emergency: 2 },
  },
  {
    id: 'u13', employeeId: 'EMP-1013',
    name: 'Akash', email: 'Akash', password: 'Akash@123',
    role: ROLES.EMPLOYEE, department: 'Video Editing', designation: 'Video Editor',
    joinDate: '2024-01-05', phone: '+91 66554 43322', location: 'Chennai, Tamil Nadu',
    performanceScore: 82, attendancePercent: 85, status: EMPLOYEE_STATUS.ACTIVE,
    leaveBalance: { sick: 6, casual: 8, earned: 10, loss_of_pay: 0, comp_off: 0, emergency: 2 },
  },
];

export const mockProjects = [
  {
    id: 'p1',
    name: 'Valavan Academy Website',
    client: 'Internal',
    description: 'Full website design and development for Valavan Academy — online learning platform for digital skills.',
    status: 'active',
    priority: 'high',
    startDate: '2026-04-01',
    deadline: '2026-08-31',
    progress: 62,
    assignedEmployees: ['u3', 'u5', 'u6'],
    color: '#2563EB',
    taskStats: { total: 18, completed: 11, pending: 5, overdue: 2 },
  },
  {
    id: 'p2',
    name: 'Pixel Panther Brand Identity',
    client: 'Pixel Panther Studio',
    description: 'Complete brand identity design — logo, color palette, typography, brand guidelines and social media kit.',
    status: 'active',
    priority: 'high',
    startDate: '2026-05-15',
    deadline: '2026-07-30',
    progress: 78,
    assignedEmployees: ['u4'],
    color: '#7C3AED',
    taskStats: { total: 10, completed: 8, pending: 2, overdue: 0 },
  },
  {
    id: 'p3',
    name: 'Ambur Bags E-Commerce',
    client: 'Ambur Leather Works',
    description: 'Shopify e-commerce store for premium leather bags — product pages, payment integration, shipping setup.',
    status: 'active',
    priority: 'high',
    startDate: '2026-06-01',
    deadline: '2026-08-15',
    progress: 45,
    assignedEmployees: ['u6', 'u10'],
    color: '#059669',
    taskStats: { total: 14, completed: 6, pending: 6, overdue: 2 },
  },
  {
    id: 'p4',
    name: 'Chennai Taste SEO Campaign',
    client: 'Chennai Taste Restaurant',
    description: 'End-to-end SEO strategy and social media campaign for a restaurant chain — targeting local search and food delivery.',
    status: 'active',
    priority: 'medium',
    startDate: '2026-06-10',
    deadline: '2026-09-10',
    progress: 30,
    assignedEmployees: ['u7', 'u8'],
    color: '#D97706',
    taskStats: { total: 12, completed: 4, pending: 7, overdue: 1 },
  },
  {
    id: 'p5',
    name: 'KudzuTech UI/UX Redesign',
    client: 'KudzuTech Solutions',
    description: 'Full UI/UX redesign of a SaaS dashboard — wireframes, prototyping, user testing and final handoff.',
    status: 'active',
    priority: 'medium',
    startDate: '2026-07-01',
    deadline: '2026-09-30',
    progress: 20,
    assignedEmployees: ['u5'],
    color: '#DC2626',
    taskStats: { total: 8, completed: 2, pending: 6, overdue: 0 },
  },
  {
    id: 'p6',
    name: 'Valavan Ventures EMS',
    client: 'Internal',
    description: 'Internal Employee Management System for Valavan Ventures — HR, attendance, tasks, payroll, and team communication.',
    status: 'active',
    priority: 'high',
    startDate: '2026-01-15',
    deadline: '2026-12-31',
    progress: 70,
    assignedEmployees: ['u1', 'u3'],
    color: '#0EA5E9',
    taskStats: { total: 20, completed: 14, pending: 4, overdue: 2 },
  },
];

export const TASK_STATUS = {
  ASSIGNED: 'assigned',
  WORKING: 'working',
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
  CHANGES_NEEDED: 'changes_needed',
};

export const PRIORITY = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

export const mockTasks = [
  {
    id: 't1',
    title: 'Logo Design — Pixel Panther Studio',
    project: 'p2',
    priority: PRIORITY.CRITICAL,
    status: TASK_STATUS.UNDER_REVIEW,
    assignedTo: 'u4',
    assignedBy: 'u3',
    deadline: '2026-07-20',
    description: 'Design 3 logo concepts for Pixel Panther Studio. Deliverables: Primary logo, icon-only version, horizontal version. Format: AI, EPS, PNG, SVG. Style: Modern, tech-forward with a playful twist.',
    estimatedHours: 20,
    actualHours: 18,
    checklist: [
      { id: 'c1', text: 'Client brief analysis', done: true },
      { id: 'c2', text: 'Mood board creation', done: true },
      { id: 'c3', text: 'Logo concept sketches (3 variants)', done: true },
      { id: 'c4', text: 'High-fidelity mockup', done: true },
      { id: 'c5', text: 'Export all formats (AI, EPS, PNG, SVG)', done: false },
    ],
    comments: [
      { id: 'cm1', userId: 'u3', text: 'Looking good! Please also prepare a dark background version.', timestamp: '2026-07-17T10:00:00Z' },
      { id: 'cm2', userId: 'u4', text: 'Sure, will add the dark version in the final package.', timestamp: '2026-07-17T10:45:00Z' },
    ],
    attachments: ['pixel_panther_logo_v2.fig'],
    revisionHistory: [
      { version: 1, note: 'Initial concept submitted', date: '2026-07-14T14:00:00Z' },
    ],
    timeline: [
      { id: 'tl1', action: 'created', userId: 'u3', timestamp: '2026-07-08T09:00:00Z' },
      { id: 'tl2', action: 'assigned', userId: 'u3', targetId: 'u4', timestamp: '2026-07-08T09:05:00Z' },
      { id: 'tl3', action: 'started', userId: 'u4', timestamp: '2026-07-09T10:00:00Z' },
      { id: 'tl4', action: 'submitted', userId: 'u4', timestamp: '2026-07-14T14:00:00Z' },
    ],
    progress: 80,
    tags: ['branding', 'logo', 'design'],
    createdAt: '2026-07-08T09:00:00Z',
  },
  {
    id: 't2',
    title: 'Homepage UI Design — Valavan Academy',
    project: 'p1',
    priority: PRIORITY.HIGH,
    status: TASK_STATUS.WORKING,
    assignedTo: 'u5',
    assignedBy: 'u3',
    deadline: '2026-07-25',
    description: 'Design the homepage for Valavan Academy website. Must include hero section, course listing cards, testimonials, and CTA sections. Deliver Figma file with all components.',
    estimatedHours: 16,
    actualHours: 8,
    checklist: [
      { id: 'c6', text: 'Wireframe all sections', done: true },
      { id: 'c7', text: 'Create style guide (colors, fonts, spacing)', done: true },
      { id: 'c8', text: 'Design hero section', done: true },
      { id: 'c9', text: 'Design course listing cards', done: false },
      { id: 'c10', text: 'Design testimonials section', done: false },
      { id: 'c11', text: 'Design CTA and footer', done: false },
    ],
    comments: [],
    attachments: [],
    revisionHistory: [],
    timeline: [
      { id: 'tl5', action: 'created', userId: 'u3', timestamp: '2026-07-10T10:00:00Z' },
      { id: 'tl6', action: 'assigned', userId: 'u3', targetId: 'u5', timestamp: '2026-07-10T10:05:00Z' },
      { id: 'tl7', action: 'started', userId: 'u5', timestamp: '2026-07-11T09:30:00Z' },
    ],
    progress: 45,
    tags: ['ui-design', 'web', 'figma'],
    createdAt: '2026-07-10T10:00:00Z',
  },
  {
    id: 't3',
    title: 'Product Page Development — Ambur Bags',
    project: 'p3',
    priority: PRIORITY.HIGH,
    status: TASK_STATUS.ASSIGNED,
    assignedTo: 'u10',
    assignedBy: 'u3',
    deadline: '2026-07-28',
    description: 'Build the Shopify product pages for Ambur Leather Bags. Include product image gallery, size selector, quantity picker, reviews section, and related products. Ensure mobile responsiveness.',
    estimatedHours: 24,
    actualHours: 0,
    checklist: [
      { id: 'c12', text: 'Review Shopify theme structure', done: false },
      { id: 'c13', text: 'Build product image gallery', done: false },
      { id: 'c14', text: 'Implement variant selector', done: false },
      { id: 'c15', text: 'Add reviews section', done: false },
      { id: 'c16', text: 'Mobile responsiveness testing', done: false },
    ],
    comments: [],
    attachments: [],
    revisionHistory: [],
    timeline: [
      { id: 'tl8', action: 'created', userId: 'u3', timestamp: '2026-07-15T11:00:00Z' },
      { id: 'tl9', action: 'assigned', userId: 'u3', targetId: 'u10', timestamp: '2026-07-15T11:05:00Z' },
    ],
    progress: 0,
    tags: ['shopify', 'ecommerce', 'development'],
    createdAt: '2026-07-15T11:00:00Z',
  },
  {
    id: 't4',
    title: 'On-Page SEO Optimization — Chennai Taste',
    project: 'p4',
    priority: PRIORITY.MEDIUM,
    status: TASK_STATUS.WORKING,
    assignedTo: 'u7',
    assignedBy: 'u3',
    deadline: '2026-07-22',
    description: 'Perform complete on-page SEO audit and optimization for all 15 pages of the Chennai Taste website. Deliverables: SEO audit report, optimized meta tags, structured data markup, internal linking strategy.',
    estimatedHours: 12,
    actualHours: 7,
    checklist: [
      { id: 'c17', text: 'Keyword research and mapping', done: true },
      { id: 'c18', text: 'Title tags & meta descriptions', done: true },
      { id: 'c19', text: 'Header tag optimization (H1/H2/H3)', done: true },
      { id: 'c20', text: 'Image alt text & compression', done: false },
      { id: 'c21', text: 'Structured data (Schema.org)', done: false },
      { id: 'c22', text: 'Internal linking audit', done: false },
    ],
    comments: [
      { id: 'cm3', userId: 'u7', text: 'Keyword mapping done. Starting on-page changes now.', timestamp: '2026-07-16T14:00:00Z' },
    ],
    attachments: [],
    revisionHistory: [],
    timeline: [
      { id: 'tl10', action: 'created', userId: 'u3', timestamp: '2026-07-12T09:00:00Z' },
      { id: 'tl11', action: 'assigned', userId: 'u3', targetId: 'u7', timestamp: '2026-07-12T09:05:00Z' },
      { id: 'tl12', action: 'started', userId: 'u7', timestamp: '2026-07-13T10:00:00Z' },
    ],
    progress: 50,
    tags: ['seo', 'on-page', 'optimization'],
    createdAt: '2026-07-12T09:00:00Z',
  },
  {
    id: 't5',
    title: 'Brand Style Guide — Pixel Panther',
    project: 'p2',
    priority: PRIORITY.HIGH,
    status: TASK_STATUS.APPROVED,
    assignedTo: 'u4',
    assignedBy: 'u3',
    deadline: '2026-07-10',
    description: 'Create a comprehensive brand style guide for Pixel Panther Studio. Cover logo usage, color palette, typography, iconography, business card, and letterhead templates.',
    estimatedHours: 14,
    actualHours: 13,
    checklist: [
      { id: 'c23', text: 'Logo usage guidelines', done: true },
      { id: 'c24', text: 'Color palette documentation', done: true },
      { id: 'c25', text: 'Typography system', done: true },
      { id: 'c26', text: 'Iconography rules', done: true },
      { id: 'c27', text: 'Business card template', done: true },
      { id: 'c28', text: 'PDF export & delivery', done: true },
    ],
    comments: [
      { id: 'cm4', userId: 'u3', text: 'Excellent work Arun! Client is very happy. Approved!', timestamp: '2026-07-09T17:00:00Z' },
    ],
    attachments: ['pixel_panther_brand_guide.pdf'],
    revisionHistory: [],
    timeline: [
      { id: 'tl13', action: 'created', userId: 'u3', timestamp: '2026-07-01T09:00:00Z' },
      { id: 'tl14', action: 'started', userId: 'u4', timestamp: '2026-07-02T10:00:00Z' },
      { id: 'tl15', action: 'submitted', userId: 'u4', timestamp: '2026-07-08T16:00:00Z' },
      { id: 'tl16', action: 'approved', userId: 'u3', timestamp: '2026-07-09T17:00:00Z' },
    ],
    progress: 100,
    tags: ['branding', 'style-guide', 'design'],
    createdAt: '2026-07-01T09:00:00Z',
  },
  {
    id: 't6',
    title: 'Instagram Reel Scripts — Chennai Taste',
    project: 'p4',
    priority: PRIORITY.MEDIUM,
    status: TASK_STATUS.CHANGES_NEEDED,
    assignedTo: 'u8',
    assignedBy: 'u3',
    deadline: '2026-07-18',
    description: 'Write scripts for 8 Instagram Reels promoting Chennai Taste restaurant. Themes: Behind the scenes, chef recipes, customer stories, festival specials. Each script: max 60 seconds spoken.',
    estimatedHours: 8,
    actualHours: 6,
    checklist: [
      { id: 'c29', text: 'Research trending reel formats', done: true },
      { id: 'c30', text: 'Write 8 scripts', done: true },
      { id: 'c31', text: 'Add visual direction notes', done: false },
      { id: 'c32', text: 'Client review & revisions', done: false },
    ],
    comments: [
      { id: 'cm5', userId: 'u8', text: 'Scripts completed! Please review.', timestamp: '2026-07-16T15:00:00Z' },
      { id: 'cm6', userId: 'u3', text: 'Scripts 3 and 7 need to be more energetic — add more punchy hooks in the opening 3 seconds.', timestamp: '2026-07-17T09:30:00Z' },
    ],
    attachments: [],
    revisionHistory: [
      { version: 1, note: 'First draft submitted', date: '2026-07-16T15:00:00Z' },
    ],
    timeline: [
      { id: 'tl17', action: 'created', userId: 'u3', timestamp: '2026-07-10T10:00:00Z' },
      { id: 'tl18', action: 'started', userId: 'u8', timestamp: '2026-07-11T09:00:00Z' },
      { id: 'tl19', action: 'submitted', userId: 'u8', timestamp: '2026-07-16T15:00:00Z' },
      { id: 'tl20', action: 'changes_requested', userId: 'u3', timestamp: '2026-07-17T09:30:00Z' },
    ],
    progress: 55,
    tags: ['social-media', 'content', 'scripts'],
    createdAt: '2026-07-10T10:00:00Z',
  },
  {
    id: 't7',
    title: 'Shopify Theme Customization — Ambur Bags',
    project: 'p3',
    priority: PRIORITY.HIGH,
    status: TASK_STATUS.WORKING,
    assignedTo: 'u6',
    assignedBy: 'u3',
    deadline: '2026-07-30',
    description: 'Customize the Dawn Shopify theme for Ambur Leather Bags. Custom sections: hero banner slider, product categories grid, testimonials, Instagram feed integration, and newsletter popup.',
    estimatedHours: 20,
    actualHours: 10,
    checklist: [
      { id: 'c33', text: 'Theme setup and configuration', done: true },
      { id: 'c34', text: 'Hero banner slider section', done: true },
      { id: 'c35', text: 'Product categories grid', done: false },
      { id: 'c36', text: 'Testimonials section', done: false },
      { id: 'c37', text: 'Instagram feed integration', done: false },
      { id: 'c38', text: 'Newsletter popup', done: false },
    ],
    comments: [],
    attachments: [],
    revisionHistory: [],
    timeline: [
      { id: 'tl21', action: 'created', userId: 'u3', timestamp: '2026-07-14T09:00:00Z' },
      { id: 'tl22', action: 'started', userId: 'u6', timestamp: '2026-07-15T10:00:00Z' },
    ],
    progress: 35,
    tags: ['shopify', 'theme', 'development'],
    createdAt: '2026-07-14T09:00:00Z',
  },
  {
    id: 't8',
    title: 'Wireframes — KudzuTech SaaS Dashboard',
    project: 'p5',
    priority: PRIORITY.MEDIUM,
    status: TASK_STATUS.SUBMITTED,
    assignedTo: 'u5',
    assignedBy: 'u3',
    deadline: '2026-07-18',
    description: 'Create low-fidelity and mid-fidelity wireframes for the KudzuTech SaaS dashboard — 8 key screens: Overview, Analytics, Users, Billing, Reports, Settings, Notifications, and Help Center.',
    estimatedHours: 10,
    actualHours: 9,
    checklist: [
      { id: 'c39', text: 'Information architecture', done: true },
      { id: 'c40', text: 'Low-fi wireframes (8 screens)', done: true },
      { id: 'c41', text: 'Mid-fi wireframes with annotations', done: true },
      { id: 'c42', text: 'Figma prototype (click-through)', done: true },
    ],
    comments: [
      { id: 'cm7', userId: 'u5', text: 'All 8 wireframes completed with clickable prototype. Ready for review!', timestamp: '2026-07-17T16:30:00Z' },
    ],
    attachments: ['kudzutech_wireframes_v1.fig'],
    revisionHistory: [],
    timeline: [
      { id: 'tl23', action: 'created', userId: 'u3', timestamp: '2026-07-07T09:00:00Z' },
      { id: 'tl24', action: 'started', userId: 'u5', timestamp: '2026-07-08T10:00:00Z' },
      { id: 'tl25', action: 'submitted', userId: 'u5', timestamp: '2026-07-17T16:30:00Z' },
    ],
    progress: 95,
    tags: ['wireframes', 'ux', 'saas'],
    createdAt: '2026-07-07T09:00:00Z',
  },
  {
    id: 't9',
    title: 'YouTube Thumbnail Design Pack — Valavan Academy',
    project: 'p1',
    priority: PRIORITY.LOW,
    status: TASK_STATUS.ASSIGNED,
    assignedTo: 'u4',
    assignedBy: 'u3',
    deadline: '2026-07-31',
    description: 'Design 10 YouTube thumbnail templates for Valavan Academy channel. Themes: Course announcements, tutorial videos, free class promotions. Size: 1280x720px. Style: Bold text, vibrant colors, instructor photo cutout.',
    estimatedHours: 8,
    actualHours: 0,
    checklist: [
      { id: 'c43', text: 'Reference 5 successful edu-channels for inspiration', done: false },
      { id: 'c44', text: 'Create 3 base template styles', done: false },
      { id: 'c45', text: 'Design 10 thumbnail variations', done: false },
      { id: 'c46', text: 'Export as PSD + PNG', done: false },
    ],
    comments: [],
    attachments: [],
    revisionHistory: [],
    timeline: [
      { id: 'tl26', action: 'created', userId: 'u3', timestamp: '2026-07-17T11:00:00Z' },
      { id: 'tl27', action: 'assigned', userId: 'u3', targetId: 'u4', timestamp: '2026-07-17T11:05:00Z' },
    ],
    progress: 0,
    tags: ['design', 'youtube', 'thumbnails'],
    createdAt: '2026-07-17T11:00:00Z',
  },
  {
    id: 't10',
    title: 'Social Media Content Calendar — August 2026',
    project: 'p4',
    priority: PRIORITY.MEDIUM,
    status: TASK_STATUS.WORKING,
    assignedTo: 'u8',
    assignedBy: 'u3',
    deadline: '2026-07-20',
    description: 'Plan and create the complete social media content calendar for Chennai Taste for August 2026. Platforms: Instagram, Facebook, X (Twitter). 31 days of content: posts, stories, reels schedule.',
    estimatedHours: 6,
    actualHours: 3,
    checklist: [
      { id: 'c47', text: 'Identify August festivals & food days', done: true },
      { id: 'c48', text: 'Plan 31-day content themes', done: true },
      { id: 'c49', text: 'Write captions for all posts', done: false },
      { id: 'c50', text: 'Create content calendar Google Sheet', done: false },
    ],
    comments: [],
    attachments: [],
    revisionHistory: [],
    timeline: [
      { id: 'tl28', action: 'created', userId: 'u3', timestamp: '2026-07-14T10:00:00Z' },
      { id: 'tl29', action: 'started', userId: 'u8', timestamp: '2026-07-14T14:00:00Z' },
    ],
    progress: 40,
    tags: ['social-media', 'content-calendar', 'marketing'],
    createdAt: '2026-07-14T10:00:00Z',
  },
];

const generateMockAttendance = () => {
  const records = [];
  const today = new Date();
  let idCounter = 1;
  const statuses = ['present', 'present', 'present', 'present', 'late', 'absent', 'half_day', 'wfh'];
  
  mockUsers.forEach(user => {
    // Generate 60 days of data for better monthly reporting
    for (let i = 0; i < 60; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      // Handle Sundays as weekly holiday
      if (d.getDay() === 0) {
        records.push({
          id: `a${idCounter++}`,
          userId: user.id,
          date: dateStr,
          status: 'sunday_holiday',
          checkIn: null,
          checkOut: null,
          workingHours: 0,
          workedMins: 0,
          lateMinutes: 0,
          earlyMins: 0,
          overtimeMins: 0,
          remarks: 'Weekly Holiday',
          source: 'Biometric Import',
          updatedBy: 'System',
          updatedTime: new Date().toISOString(),
        });
        continue;
      }
      
      let status = statuses[Math.floor(Math.random() * statuses.length)];
      // Force Sneha (u10) to be on leave (she has ON_LEAVE status)
      if (user.id === 'u10' && i === 0) status = 'absent';
      
      let checkIn = null;
      let checkOut = null;
      let workingHours = 0;
      let workedMins = 0;
      let lateMinutes = 0;
      let earlyMins = 0;
      let overtimeMins = 0;
      
      let inH = 9;
      let inM = Math.floor(Math.random() * 20) + 40;
      let outH = 18;
      let outM = Math.floor(Math.random() * 30);
      
      if (status === 'present' || status === 'wfh') {
        if (Math.random() > 0.5) {
          inH = 10;
          inM = Math.floor(Math.random() * 11);
          status = 'on_time';
        } else {
          status = 'early';
        }
      } else if (status === 'late') {
        inH = 10;
        inM = Math.floor(Math.random() * 45) + 11;
      } else if (status === 'half_day') {
        inH = 10;
        inM = Math.floor(Math.random() * 11);
        outH = 14;
        outM = Math.floor(Math.random() * 30) + 30;
      } else if (status === 'absent') {
        inH = null;
      }
      
      if (inH !== null) {
        checkIn = `${String(inH).padStart(2, '0')}:${String(inM).padStart(2, '0')}`;
        checkOut = `${String(outH).padStart(2, '0')}:${String(outM).padStart(2, '0')}`;
        
        const inTotalMins = (inH * 60) + inM;
        const outTotalMins = (outH * 60) + outM;
        
        workedMins = outTotalMins - inTotalMins;
        workingHours = +(workedMins / 60).toFixed(2);
        
        if (inTotalMins < 600) {
          earlyMins = 600 - inTotalMins;
          status = 'early';
        } else if (inTotalMins <= 610) {
          status = 'on_time';
        } else {
          lateMinutes = inTotalMins - 610;
          status = 'late';
        }
        
        if (outTotalMins > 1080) {
          overtimeMins = outTotalMins - 1080;
        }
      }
      
      records.push({
        id: `a${idCounter++}`,
        userId: user.id,
        date: dateStr,
        status,
        checkIn,
        checkOut,
        workingHours,
        workedMins,
        lateMinutes,
        earlyMins,
        overtimeMins,
        remarks: status === 'late' ? 'Traffic delay' : '',
        source: 'Biometric Import',
        updatedBy: 'System',
        updatedTime: new Date().toISOString(),
      });
    }
  });
  return records;
};

export const mockAttendance = generateMockAttendance();

export const liveTimeline = [
  { id: 'lt1', userId: 'u2', time: '09:52', action: 'Checked In' },
  { id: 'lt2', userId: 'u4', time: '09:38', action: 'Checked In' },
  { id: 'lt3', userId: 'u5', time: '10:05', action: 'Checked In' },
  { id: 'lt4', userId: 'u7', time: '10:02', action: 'Checked In' },
  { id: 'lt5', userId: 'u8', time: '09:48', action: 'Checked In' },
];

export const mockLeaves = [
  {
    id: 'l1',
    userId: 'u10',
    type: 'earned',
    fromDate: '2026-07-14',
    toDate: '2026-07-20',
    days: 5,
    reason: 'Personal medical procedure and recovery',
    status: 'approved',
    approvedBy: 'u2',
    appliedAt: '2026-07-10T11:00:00Z',
    comments: 'Take care and get well soon!',
  },
  {
    id: 'l2',
    userId: 'u6',
    type: 'casual',
    fromDate: '2026-07-25',
    toDate: '2026-07-25',
    days: 1,
    reason: 'Personal work',
    status: 'pending',
    approvedBy: null,
    appliedAt: '2026-07-17T10:00:00Z',
    comments: '',
  },
  {
    id: 'l3',
    userId: 'u9',
    type: 'casual',
    fromDate: '2026-07-22',
    toDate: '2026-07-22',
    days: 1,
    reason: 'Family function',
    status: 'approved',
    approvedBy: 'u2',
    appliedAt: '2026-07-15T10:00:00Z',
    comments: 'Enjoy!',
  },
  {
    id: 'l4',
    userId: 'u7',
    type: 'sick',
    fromDate: '2026-07-21',
    toDate: '2026-07-21',
    days: 1,
    reason: 'Fever',
    status: 'pending',
    approvedBy: null,
    appliedAt: '2026-07-18T08:00:00Z',
    comments: '',
  },
];

export const mockPayslips = [
  {
    id: 'ps1',
    userId: 'u4',
    month: 'June 2026',
    basicSalary: 42000,
    hra: 10500,
    allowances: 3000,
    deductions: 4200,
    netSalary: 51300,
    status: 'paid',
    generatedAt: '2026-07-01T10:00:00Z',
  },
  {
    id: 'ps2',
    userId: 'u4',
    month: 'May 2026',
    basicSalary: 42000,
    hra: 10500,
    allowances: 3000,
    deductions: 4200,
    netSalary: 51300,
    status: 'paid',
    generatedAt: '2026-06-01T10:00:00Z',
  },
  {
    id: 'ps3',
    userId: 'u5',
    month: 'June 2026',
    basicSalary: 38000,
    hra: 9500,
    allowances: 2500,
    deductions: 3800,
    netSalary: 46200,
    status: 'paid',
    generatedAt: '2026-07-01T10:00:00Z',
  },
  {
    id: 'ps4',
    userId: 'u6',
    month: 'June 2026',
    basicSalary: 40000,
    hra: 10000,
    allowances: 2800,
    deductions: 4000,
    netSalary: 48800,
    status: 'paid',
    generatedAt: '2026-07-01T10:00:00Z',
  },
];

export const mockNotifications = [
  {
    id: 'n1',
    userId: 'u4',
    type: 'task_assigned',
    title: 'New Task Assigned',
    message: 'YouTube Thumbnail Design Pack — Valavan Academy has been assigned to you.',
    read: false,
    createdAt: '2026-07-17T11:05:00Z',
    link: '/tasks',
  },
  {
    id: 'n2',
    userId: 'u4',
    type: 'task_approved',
    title: 'Task Approved! 🎉',
    message: 'Your submission "Brand Style Guide — Pixel Panther" has been approved by Kiran.',
    read: false,
    createdAt: '2026-07-09T17:00:00Z',
    link: '/tasks',
  },
  {
    id: 'n3',
    userId: 'u5',
    type: 'task_assigned',
    title: 'New Task Assigned',
    message: 'Homepage UI Design — Valavan Academy has been assigned to you.',
    read: true,
    createdAt: '2026-07-10T10:05:00Z',
    link: '/tasks',
  },
  {
    id: 'n4',
    userId: 'u5',
    type: 'payslip',
    title: 'Payslip Ready',
    message: 'Your June 2026 payslip is ready for download.',
    read: true,
    createdAt: '2026-07-01T10:00:00Z',
    link: '/payslips',
  },
  {
    id: 'n5',
    userId: 'u3',
    type: 'task_submitted',
    title: 'Task Submitted for Review',
    message: 'Preethi Balaji submitted "Wireframes — KudzuTech SaaS Dashboard" for your review.',
    read: false,
    createdAt: '2026-07-17T16:30:00Z',
    link: '/tasks',
  },
  {
    id: 'n6',
    userId: 'u3',
    type: 'leave_request',
    title: 'Leave Request',
    message: 'Manoj Selvan has applied for 1 day casual leave on July 25.',
    read: false,
    createdAt: '2026-07-17T10:00:00Z',
    link: '/leaves',
  },
  {
    id: 'n7',
    userId: 'u8',
    type: 'changes_needed',
    title: 'Changes Requested',
    message: 'Kiran Prabhu requested changes on "Instagram Reel Scripts — Chennai Taste".',
    read: false,
    createdAt: '2026-07-17T09:30:00Z',
    link: '/tasks',
  },
];

export const mockChats = [
  {
    id: 'ch1',
    type: 'group',
    name: 'Design Team',
    members: ['u1', 'u3', 'u4', 'u5'],
    avatar: null,
    pinned: true,
    favorites: ['u3'],
    messages: [
      { id: 'm1', senderId: 'u3', text: 'Team, Pixel Panther logo review is scheduled for 3 PM today. Please be ready.', timestamp: '2026-07-18T09:00:00Z', readBy: ['u4', 'u5'], reactions: { '👍': ['u4'] } },
      { id: 'm2', senderId: 'u4', text: 'Got it! I\'ll prepare the presentation with all 3 variants.', timestamp: '2026-07-18T09:10:00Z', readBy: ['u3', 'u5'] },
      { id: 'm3', senderId: 'u5', text: 'I\'ll join from the Figma link. Should I share the wireframes too?', timestamp: '2026-07-18T09:15:00Z', readBy: ['u3'] },
      { id: 'm4', senderId: 'u3', text: 'Yes please — share KudzuTech wireframes as well. Good work Preethi!', timestamp: '2026-07-18T09:20:00Z', readBy: [] },
    ],
  },
  {
    id: 'ch2',
    type: 'direct',
    name: 'Kiran Prabhu',
    members: ['u3', 'u4'],
    avatar: null,
    pinned: false,
    favorites: [],
    messages: [
      { id: 'm5', senderId: 'u3', text: 'Arun, how are the Pixel Panther thumbnails coming along?', timestamp: '2026-07-17T16:00:00Z', readBy: ['u4'] },
      { id: 'm6', senderId: 'u4', text: 'Almost done! Dark background version is looking great.', timestamp: '2026-07-17T16:20:00Z', readBy: ['u3'] },
      { id: 'm7', senderId: 'u3', text: 'Perfect. Client is expecting delivery by EOD tomorrow.', timestamp: '2026-07-17T16:25:00Z', readBy: [] },
    ],
  },
  {
    id: 'ch3',
    type: 'group',
    name: 'SEO & Social Media',
    members: ['u1', 'u3', 'u7', 'u8'],
    avatar: null,
    pinned: false,
    favorites: ['u8'],
    messages: [
      { id: 'm8', senderId: 'u8', text: 'Chennai Taste August content calendar is 60% done. Scripts almost ready!', timestamp: '2026-07-18T10:00:00Z', readBy: ['u7'] },
      { id: 'm9', senderId: 'u7', text: 'Great! I\'ve finished the keyword mapping. Sharing the doc now.', timestamp: '2026-07-18T10:30:00Z', readBy: ['u8'], reactions: { '🔥': ['u8'] } },
    ],
  },
  {
    id: 'ch4',
    type: 'direct',
    name: 'Riya Sharma',
    members: ['u2', 'u5'],
    avatar: null,
    pinned: true,
    favorites: ['u5'],
    messages: [
      { id: 'm10', senderId: 'u2', text: 'Hi Preethi! Please submit your June timesheet before EOD.', timestamp: '2026-07-15T11:00:00Z', readBy: ['u5'] },
      { id: 'm11', senderId: 'u5', text: 'Done Riya! Submitted just now.', timestamp: '2026-07-15T11:30:00Z', readBy: ['u2'] },
    ],
  },
  {
    id: 'ch5',
    type: 'group',
    name: 'Dev Team',
    members: ['u3', 'u6', 'u10'],
    avatar: null,
    pinned: false,
    favorites: [],
    messages: [
      { id: 'm12', senderId: 'u3', text: 'Manoj, please update me on the Ambur Bags hero slider progress.', timestamp: '2026-07-17T14:00:00Z', readBy: ['u6'] },
      { id: 'm13', senderId: 'u6', text: 'Hero slider is done and tested on mobile. Working on the product categories grid next.', timestamp: '2026-07-17T14:30:00Z', readBy: ['u3'], reactions: { '✅': ['u3'] } },
    ],
  },
];

export const mockAnnouncements = [
  {
    id: 'an1',
    title: 'Q3 Incentive Bonus Announcement',
    content: 'We are excited to announce that all employees who complete their Q3 targets (July–September 2026) will receive a performance bonus of 10% of their monthly salary, credited with the September payslip. Keep up the great work!',
    postedBy: 'u1',
    postedAt: '2026-07-16T10:00:00Z',
    priority: 'high',
    category: 'HR',
    pinned: true,
    expiryDate: '2026-09-30T00:00:00Z',
  },
  {
    id: 'an2',
    title: 'New Project Management Process',
    content: 'Starting August 1st, 2026, all client projects must follow the updated workflow: Task Assignment → Accepted → In Progress → Submitted → Review → Approved. All project updates must be logged in the EMS task system. No WhatsApp updates for official deliverables.',
    postedBy: 'u3',
    postedAt: '2026-07-14T10:00:00Z',
    priority: 'high',
    category: 'Operations',
    pinned: true,
  },
  {
    id: 'an3',
    title: 'Agency Portfolio Update — July 2026',
    content: 'Our portfolio has been updated with 4 new case studies: Pixel Panther Brand Identity, Ambur Bags E-Commerce Store, Chennai Taste Social Campaign, and KudzuTech UI Redesign. Great work team! Let\'s keep delivering excellence.',
    postedBy: 'u1',
    postedAt: '2026-07-10T09:00:00Z',
    priority: 'medium',
    category: 'Company Updates',
    pinned: false,
  },
  {
    id: 'an4',
    title: 'Work From Home Policy Update',
    content: 'Employees may request WFH for up to 2 days per week with prior approval from their Project Manager. WFH requests must be submitted by 8 PM the previous evening via the Leave Management module in EMS.',
    postedBy: 'u2',
    postedAt: '2026-07-05T10:00:00Z',
    priority: 'medium',
    category: 'HR',
    pinned: false,
  },
];

export const mockActivityFeed = [
  { id: 'act1', userId: 'u3', action: 'Approved Leave for Sneha Pillai (Earned Leave – 5 days)', timestamp: '2026-07-10T11:30:00Z', type: 'leave' },
  { id: 'act2', userId: 'u5', action: 'Submitted "Wireframes — KudzuTech SaaS Dashboard" for review', timestamp: '2026-07-17T16:30:00Z', type: 'task' },
  { id: 'act3', userId: 'u3', action: 'Assigned "YouTube Thumbnail Design Pack" to Arun Kumar', timestamp: '2026-07-17T11:05:00Z', type: 'task' },
  { id: 'act4', userId: 'u3', action: 'Requested changes on "Instagram Reel Scripts" by Deepika Menon', timestamp: '2026-07-17T09:30:00Z', type: 'task' },
  { id: 'act5', userId: 'u3', action: 'Approved "Brand Style Guide — Pixel Panther" by Arun Kumar', timestamp: '2026-07-09T17:00:00Z', type: 'task' },
  { id: 'act6', userId: 'u2', action: 'Generated payslips for all employees — June 2026', timestamp: '2026-07-01T10:00:00Z', type: 'payroll' },
];

export const attendanceChartData = [
  { day: 'Mon', present: 8, late: 1, absent: 1 },
  { day: 'Tue', present: 9, late: 0, absent: 1 },
  { day: 'Wed', present: 7, late: 2, absent: 1 },
  { day: 'Thu', present: 8, late: 1, absent: 1 },
  { day: 'Fri', present: 8, late: 1, absent: 1 },
  { day: 'Sat', present: 5, late: 0, absent: 5 },
];

export const taskCompletionData = [
  { month: 'Feb', completed: 6, pending: 4 },
  { month: 'Mar', completed: 9, pending: 3 },
  { month: 'Apr', completed: 11, pending: 5 },
  { month: 'May', completed: 13, pending: 4 },
  { month: 'Jun', completed: 15, pending: 3 },
  { month: 'Jul', completed: 7, pending: 6 },
];

export const projectProgressData = [
  { name: 'Valavan Academy', progress: 62 },
  { name: 'Pixel Panther Brand', progress: 78 },
  { name: 'Ambur Bags E-comm', progress: 45 },
  { name: 'Chennai Taste SEO', progress: 30 },
  { name: 'KudzuTech UI/UX', progress: 20 },
];
