// ============================================================
// Portfolio Data — Narava Venkat Siddharth
// ============================================================

export const PERSONAL = {
  name: 'Narava Venkat Siddharth',
  firstName: 'Siddharth',
  lastName: 'Narava',
  title: 'Full Stack Developer',
  tagline: 'Building scalable, reliable applications with clean code and a passion for performance optimization.',
  bio: 'Full-stack developer with hands-on experience in building scalable and reliable applications using React, Node.js, Express, and MongoDB. Strong understanding of software design principles, object-oriented programming (OOP), debugging, testing, and documentation. Experienced with Docker-based containerization and Agile collaboration. Passionate about writing clean code, performance optimization, and continuous improvement.',
  email: 'siddharthnarva@gmail.com',
  phone: '+91 7415646775',
  location: 'India',
  availability: 'Open to opportunities',
  education: {
    degree: 'B.Tech in Computer Science and Engineering',
    university: 'Bennett University (The Times Group)',
    period: '2022 – 2026',
  },
};

export const NAV_LINKS = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

export const STATS = [
  { value: 220, suffix: '+', label: 'LeetCode Problems' },
  { value: 1728, suffix: '', label: 'Peak LC Rating' },
  { value: 3, suffix: '%', label: 'Top Global Rank' },
  { value: 2, suffix: '+', label: 'Internships' },
];

export interface Skill {
  name: string;
  icon: string;
  level: number; // 0-100
  category: 'languages' | 'frameworks' | 'databases' | 'tools';
}

export const SKILLS: Skill[] = [
  // Languages
  { name: 'JavaScript (ES6+)', icon: '🟨', level: 90, category: 'languages' },
  { name: 'TypeScript', icon: '📘', level: 85, category: 'languages' },
  { name: 'C++', icon: '⚙️', level: 88, category: 'languages' },
  { name: 'C#', icon: '🟣', level: 75, category: 'languages' },
  // Frameworks & Libraries
  { name: 'React', icon: '⚛️', level: 92, category: 'frameworks' },
  { name: 'Node.js', icon: '🟢', level: 88, category: 'frameworks' },
  { name: 'Express.js', icon: '🚀', level: 85, category: 'frameworks' },
  { name: '.NET', icon: '🔷', level: 75, category: 'frameworks' },
  // Databases
  { name: 'MongoDB', icon: '🍃', level: 85, category: 'databases' },
  { name: 'MySQL', icon: '🐬', level: 80, category: 'databases' },
  { name: 'Redis', icon: '🔴', level: 72, category: 'databases' },
  // Tools & Platforms
  { name: 'Git', icon: '📦', level: 90, category: 'tools' },
  { name: 'Docker', icon: '🐳', level: 78, category: 'tools' },
  { name: 'AWS', icon: '☁️', level: 72, category: 'tools' },
  { name: 'Postman', icon: '📮', level: 85, category: 'tools' },
  { name: 'Vercel', icon: '▲', level: 82, category: 'tools' },
  { name: 'Figma', icon: '🎯', level: 75, category: 'tools' },
  { name: 'VS Code', icon: '💻', level: 92, category: 'tools' },
];

export const SKILL_CATEGORIES = [
  { id: 'languages', label: 'Languages', color: 'var(--accent-1)' },
  { id: 'frameworks', label: 'Frameworks', color: 'var(--accent-2)' },
  { id: 'databases', label: 'Databases', color: 'var(--accent-3)' },
  { id: 'tools', label: 'Tools', color: 'var(--accent-4)' },
] as const;

export interface Project {
  id: number;
  title: string;
  description: string;
  category: 'web' | 'mobile' | 'design';
  tags: string[];
  image: string;
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  highlights: string[];
}

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Kodikos – Collaborative Code Editor',
    description: 'A real-time collaborative IDE enabling multi-user code synchronization with sub-100ms latency, shared cursor tracking, and live room-based session management.',
    category: 'web',
    tags: ['React', 'Node.js', 'Socket.io', 'CodeMirror', 'Piston API'],
    image: '',
    liveUrl: 'https://kodikos.onrender.com/',
    githubUrl: 'https://github.com/sid1651',
    featured: true,
    highlights: [
      'Architected real-time collaboration with Socket.io enabling multi-user code sync with sub-100ms latency',
      'Integrated CodeMirror (HTML/CSS/JS) and Piston API for cloud-based backend code execution with live terminal feedback',
      'Built community workspace with persistent room management, in-editor group chat, and shared code snippets for 50+ concurrent users',
    ],
  },
  {
    id: 2,
    title: 'Estia Stay – Hotel Booking Platform',
    description: 'A full-stack hotel booking system handling 200+ API calls per day with secure authentication, optimized DB queries, and owner dashboards with analytics.',
    category: 'web',
    tags: ['React', 'Node.js', 'MongoDB', 'Multer', 'Cloudinary'],
    image: '',
    liveUrl: 'https://estiastay.vercel.app',
    githubUrl: 'https://github.com/sid1651',
    featured: true,
    highlights: [
      'Built a full-stack booking system handling 200+ API calls/day with secure authentication and optimized DB queries',
      'Implemented unit testing, server-side validation, and debugging processes to maintain 99.8% uptime',
      'Developed owner dashboards with analytics and automated image uploads using Multer + Cloudinary',
    ],
  },
];

export interface Experience {
  id: number;
  company: string;
  role: string;
  period: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

export const EXPERIENCES: Experience[] = [
  {
    id: 1,
    company: 'BWays Tecno Solution',
    role: 'Full Stack Developer Intern',
    period: 'Jan 2026 — Mar 2026',
    description: 'Developed RESTful APIs and responsive frontend interfaces for an inventory management system.',
    achievements: [
      'Developed RESTful APIs using .NET and SQL Server for inventory management — products, orders, and users',
      'Built responsive frontend with React + TypeScript: Admin Panel, Warehouse Dashboard, User & Order Management',
      'Collaborated in cross-functional Agile team with sprint planning, stand-ups, and code reviews',
    ],
    technologies: ['React', 'TypeScript', '.NET', 'SQL Server'],
  },
  {
    id: 2,
    company: 'HKNA PVT Solution',
    role: 'Full Stack Developer Intern',
    period: 'Sep 2025 — Dec 2025',
    description: 'Developed and maintained RESTful APIs and responsive frontends, achieving significant performance improvements.',
    achievements: [
      'Reduced average API response time by 35% through query optimization and indexing',
      'Improved first meaningful paint and page load time by ~40% via code-splitting and lazy loading',
      'Used Git and Agile workflows for collaboration, code reviews, and progress tracking',
    ],
    technologies: ['Node.js', 'Express', 'MongoDB', 'React', 'Git'],
  },
  {
    id: 3,
    company: 'Bennett University',
    role: 'B.Tech in Computer Science and Engineering',
    period: '2022 — 2026',
    description: 'Undergraduate degree focusing on core computer science concepts and software engineering.',
    achievements: [
      'Core Concepts: Data Structures & Algorithms, OOP, DBMS, System Design, CI/CD',
      'Competitive Programming (LeetCode): Solved 220+ problems with a peak rating of 1728 (Top 3% globally)',
    ],
    technologies: ['C++', 'Python', 'Algorithms', 'System Design'],
  }
];

export const SOCIAL_LINKS = [
  { name: 'GitHub', url: 'https://github.com/sid1651', icon: 'github' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/narva-siddharth', icon: 'linkedin' },
  { name: 'LeetCode', url: 'https://leetcode.com/u/badmintonplayer/', icon: 'leetcode' },
];
