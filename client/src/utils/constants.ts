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
  resumeUrl: '/siddharth-resume.pdf',
};

export const NAV_LINKS = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'resume', label: 'Resume' },
  { id: 'contact', label: 'Contact' },
];

export const STATS = [
  { value: 220, suffix: '+', label: 'LeetCode Problems' },
  { value: 1728, suffix: '', label: 'Peak LC Rating' },
  { value: 3, suffix: '%', label: 'Top Global Rank' },
  { value: 2, suffix: '+', label: 'Internships' },
];

export const CURRENTLY_BUILDING = [
  'Real-time collaboration flows with shared cursors, rooms, and low-latency sync.',
  'Clean React + TypeScript interfaces that stay responsive under heavier state updates.',
  'Backend systems that are easier to debug, test, and evolve as projects grow.',
] as const;

export const CURRENTLY_LEARNING = [
  'System design tradeoffs for scaling multi-user applications beyond the happy path.',
  'Performance profiling across network, rendering, and database bottlenecks.',
  'Stronger testing discipline around integration boundaries and production-like scenarios.',
] as const;

export const ENGINEERING_WINS = [
  {
    title: 'Architecture mindset',
    description:
      'I break products into clear frontend, API, and data concerns so features can ship quickly without turning into tightly coupled code.',
  },
  {
    title: 'Performance focus',
    description:
      'I care about measurable speed improvements, from API response time and database tuning to bundle weight and meaningful paint.',
  },
  {
    title: 'Execution under real usage',
    description:
      'Projects are built with practical concerns in mind: concurrency, validation, observability, and maintainable debugging paths.',
  },
] as const;

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

export interface DesignProject {
  id: number;
  title: string;
  description: string;
  tags: string[];
  figmaUrl: string;
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
    githubUrl: 'https://github.com/sid1651/RealTimeCodeEditor.git',
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
    githubUrl: 'https://github.com/sid1651/Estia-Stay---Hotel-Booking-Website.git',
    featured: true,
    highlights: [
      'Built a full-stack booking system handling 200+ API calls/day with secure authentication and optimized DB queries',
      'Implemented unit testing, server-side validation, and debugging processes to maintain 99.8% uptime',
      'Developed owner dashboards with analytics and automated image uploads using Multer + Cloudinary',
    ],
  },
];

export const DESIGN_PROJECTS: DesignProject[] = [
  {
    id: 1,
    title: 'Mobile App Design',
    description:
      'A polished mobile UI concept focused on clear hierarchy, smooth interactions, and a modern app-like visual system.',
    tags: ['Figma', 'Mobile UI', 'Prototype'],
    figmaUrl:
      'https://www.figma.com/make/VkUTUgN0dHygCl9U6foGI3/Mobile-app-design?t=h8zv7jcIwX3M7hR4-20&fullscreen=1',
    featured: true,
    highlights: [
      'Designed mobile-first flows with attention to navigation clarity and visual rhythm',
      'Explored component consistency across screens to keep the interface cohesive',
      'Used motion-friendly layouts that can translate well into frontend implementation',
    ],
  },
  {
    id: 2,
    title: 'Animated Testimonial Cards',
    description:
      'An interactive testimonial card concept built to showcase motion, storytelling, and high-end presentation details.',
    tags: ['Figma', 'Motion Design', 'UI Cards'],
    figmaUrl:
      'https://www.figma.com/make/ibeZxZVed4SNc2RvkghOvc/Animated-Testimonial-Cards?t=xJn3NbKYtIoagXHC-20&fullscreen=1',
    featured: true,
    highlights: [
      'Created a presentation-ready card system with expressive animation cues',
      'Balanced readability with strong visual personality for portfolio-style showcasing',
      'Focused on reusable layout patterns that can be implemented cleanly on the web',
    ],
  },
  {
    id: 3,
    title: 'Use Reference Image Only',
    description:
      'A Figma Make concept focused on transforming a visual reference into a polished interface while preserving the source image direction.',
    tags: ['Figma', 'Reference UI', 'Visual Design'],
    figmaUrl:
      'https://www.figma.com/make/OeQgkRI3wNunYqUuQKJ0gq/Use-Reference-Image-Only?t=CdtoeY44PPZHEyre-20&fullscreen=1',
    featured: false,
    highlights: [
      'Built a reference-led design exploration with close attention to visual matching',
      'Used the provided image direction as the main design constraint for layout decisions',
      'Refined spacing, hierarchy, and presentation details for portfolio showcasing',
    ],
  },
  {
    id: 4,
    title: 'Replicate Page Design',
    description:
      'A Figma Make page replication project focused on matching an existing visual direction with careful layout, spacing, and interface polish.',
    tags: ['Figma', 'Page Design', 'UI Replication'],
    figmaUrl:
      'https://www.figma.com/make/I4aznPq4OFmqFa7erGcICo/Replicate-Page-Design?t=OGTB3AAL2GMWevMk-20&fullscreen=1',
    featured: false,
    highlights: [
      'Replicated a page layout with attention to visual hierarchy and spacing accuracy',
      'Translated the reference direction into a clean, portfolio-ready interface',
      'Focused on consistency across typography, structure, and presentation details',
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
  },
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
];

export const SOCIAL_LINKS = [
  { name: 'GitHub', url: 'https://github.com/sid1651', icon: 'github' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/narva-siddharth', icon: 'linkedin' },
  { name: 'LeetCode', url: 'https://leetcode.com/u/badmintonplayer/', icon: 'leetcode' },
];
