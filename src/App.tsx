import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Map,
  Bot,
  Calendar,
  Code2,
  FolderGit2,
  Users,
  Library,
  Wrench,
  Trophy,
  Award,
  Settings,
  Shield,
  BarChart3,
  Plus,
  Search,
  ExternalLink,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  Sparkles,
  Send,
  GitBranch,
  Moon,
  Sun,
  Menu,
  X,
  ChevronRight,
  ThumbsUp,
  Pin,
  Brain,
  RefreshCw,
  Compass,
  Flag,
  Cpu,
  ClipboardCheck,
  LifeBuoy,
  Presentation,
  ShieldCheck,
  Repeat,
  LogOut,
  HelpCircle,
  Rocket
} from 'lucide-react';
import { supabase, CLOUD } from './lib/supabase';

// ============================================================================
// INITIAL SEED DATA (SELF-CONTAINED IN-MEMORY + LOCALSTORAGE PERSISTENCE)
// ============================================================================
const STORAGE_KEY = 'dev_growth_hub_state_v2';

const INITIAL_PROFILE = {
  fullName: 'Amara Okafor',
  username: 'amara-dev',
  bio: 'Frontend & Full-Stack builder focusing on accessible React interfaces, TypeScript architecture, and clean Git workflows.',
  field: 'Frontend Development',
  skillLevel: 'Intermediate Beginner',
  languages: ['JavaScript (ES2024)', 'TypeScript', 'HTML5/CSS3', 'SQL'],
  frameworks: ['React', 'Next.js', 'Tailwind CSS', 'Node.js'],
  interests: ['Design Systems', 'Async State & Performance', 'Developer Tooling'],
  githubUrl: 'https://github.com/amara-okafor-dev',
  portfolioUrl: 'https://amaraokafor.dev',
  linkedinUrl: 'https://linkedin.com/in/amara-okafor-dev',
  streakDays: 11,
  notifications: {
    announcements: true,
    deadlines: true,
    reviewFeedback: true,
    weeklyCheckIn: true
  }
};

const INITIAL_COURSES = [
  {
    id: 'course-1',
    title: 'Full-Stack React, TypeScript & Modern Patterns',
    platform: 'Frontend Masters',
    url: 'https://frontendmasters.com',
    instructor: 'Steve Kinney',
    field: 'Frontend Development',
    skillLevel: 'Intermediate',
    goals: 'Build production-grade React apps with strict TypeScript, custom hooks, and zero race conditions.',
    targetDate: '2026-12-10',
    progress: 65,
    currentTopic: 'Custom Hooks & State Synchronization',
    weeklyTarget: 'Complete Custom Hooks module & pass verification quiz',
    lastStudied: 'Today',
    notes: 'Derived state should be computed during render instead of synced via useEffect. Always clean up timers and AbortControllers.',
    modules: [
      { id: 'm-1', title: 'Component Composition & Render Purity', completed: true },
      { id: 'm-2', title: 'TypeScript Props, Generics & Discriminated Unions', completed: true },
      { id: 'm-3', title: 'Custom Hooks & State Synchronization', completed: false },
      { id: 'm-4', title: 'Performance Profiling, Memoization & Testing', completed: false }
    ]
  },
  {
    id: 'course-2',
    title: 'CS50x: Introduction to Computer Science',
    platform: 'edX',
    url: 'https://cs50.harvard.edu/x',
    instructor: 'David J. Malan',
    field: 'Computer Science',
    skillLevel: 'Beginner',
    goals: 'Strengthen algorithmic thinking, memory models, and asymptotic complexity.',
    targetDate: '2026-12-22',
    progress: 50,
    currentTopic: 'Data Structures: Hash Tables & Tries',
    weeklyTarget: 'Finish Week 5 problem set',
    lastStudied: 'Yesterday',
    notes: 'Hash tables trade extra memory for O(1) average lookup speed when collisions are handled cleanly.',
    modules: [
      { id: 'm-21', title: 'Week 1–2: C, Arrays & Big-O Notation', completed: true },
      { id: 'm-22', title: 'Week 3–4: Algorithms & Memory Pointers', completed: true },
      { id: 'm-23', title: 'Week 5: Data Structures & Hash Tables', completed: false },
      { id: 'm-24', title: 'Week 6–7: Python & Relational SQL', completed: false }
    ]
  }
];

const ROADMAPS_CATALOG = [
  {
    id: 'rm-frontend',
    title: 'Frontend Developer',
    field: 'Frontend Development',
    officialUrl: 'https://roadmap.sh/frontend',
    summary: 'Step-by-step path covering semantic HTML, modern CSS, JavaScript internals, React, TypeScript, testing, and web performance.',
    topics: [
      { id: 'fe-1', name: 'Semantic HTML & Accessibility (ARIA)' },
      { id: 'fe-2', name: 'Modern CSS Layouts (Flexbox, Grid, Responsive)' },
      { id: 'fe-3', name: 'JavaScript Event Loop, Closures & Promises' },
      { id: 'fe-4', name: 'Git & GitHub Collaborative Pull Requests' },
      { id: 'fe-5', name: 'React Component Architecture & Custom Hooks' },
      { id: 'fe-6', name: 'TypeScript Type Narrowing & Generics' },
      { id: 'fe-7', name: 'Automated Testing (Vitest & Testing Library)' },
      { id: 'fe-8', name: 'Web Security (XSS, CSRF, CSP) & Core Web Vitals' }
    ]
  },
  {
    id: 'rm-backend',
    title: 'Backend Developer',
    field: 'Backend Development',
    officialUrl: 'https://roadmap.sh/backend',
    summary: 'APIs, relational databases, authentication, caching, message queues, containerization, and system reliability.',
    topics: [
      { id: 'be-1', name: 'HTTP/HTTPS, RESTful Design & Status Codes' },
      { id: 'be-2', name: 'Relational Databases, Indexing & SQL Queries' },
      { id: 'be-3', name: 'Authentication (JWT, Sessions, OAuth2)' },
      { id: 'be-4', name: 'Caching Strategies (Redis) & Rate Limiting' },
      { id: 'be-5', name: 'Integration Testing & CI/CD Pipelines' }
    ]
  },
  {
    id: 'rm-fullstack',
    title: 'Full Stack Developer',
    field: 'Full Stack Development',
    officialUrl: 'https://roadmap.sh/full-stack',
    summary: 'End-to-end web product engineering combining frontend interactivity, backend APIs, database modeling, and cloud deployment.',
    topics: [
      { id: 'fs-1', name: 'Frontend React/Next.js Architecture' },
      { id: 'fs-2', name: 'Node.js / Python API Servers & Validation' },
      { id: 'fs-3', name: 'PostgreSQL Schema Design & Migrations' },
      { id: 'fs-4', name: 'End-to-End Auth & Role-Based Permissions' },
      { id: 'fs-5', name: 'Docker, Cloud Deployment & Observability' }
    ]
  },
  {
    id: 'rm-ai',
    title: 'AI & LLM Engineer',
    field: 'AI & Machine Learning',
    officialUrl: 'https://roadmap.sh/ai-engineer',
    summary: 'Building reliable AI-powered software with embeddings, RAG pipelines, structured outputs, evals, and guardrails.',
    topics: [
      { id: 'ai-1', name: 'LLM APIs, Tokenization & Prompt Engineering' },
      { id: 'ai-2', name: 'Structured JSON Outputs & Function Calling' },
      { id: 'ai-3', name: 'Embeddings & Retrieval-Augmented Generation (RAG)' },
      { id: 'ai-4', name: 'Hallucination Detection, Evals & Safety' }
    ]
  }
];

const INITIAL_ROADMAP_PROGRESS = {
  'fe-1': { status: 'Completed', notes: 'Practiced landmark elements and keyboard focus management.', struggling: false },
  'fe-2': { status: 'Completed', notes: 'Comfortable with CSS Grid auto-fit and mobile-first breakpoints.', struggling: false },
  'fe-3': { status: 'Currently Learning', notes: 'Reviewing microtask vs macrotask ordering in async chains.', struggling: true },
  'fe-4': { status: 'Completed', notes: 'Resolved multi-file merge conflicts cleanly.', struggling: false },
  'fe-5': { status: 'Currently Learning', notes: 'Building reusable useDebounce hook with cleanup.', struggling: false },
  'fe-6': { status: 'Not Started', notes: '', struggling: true },
  'fe-7': { status: 'Not Started', notes: '', struggling: false },
  'fe-8': { status: 'Not Started', notes: '', struggling: false }
};

const INITIAL_QUIZZES = [
  {
    id: 'quiz-1',
    title: 'React Hooks, Render Lifecycle & State Purity',
    courseId: 'course-1',
    topic: 'Custom Hooks & State Synchronization',
    field: 'Frontend Development',
    difficulty: 'Intermediate',
    mandatory: true,
    deadline: '2026-11-19',
    durationMinutes: 10,
    questions: [
      {
        id: 'q-101',
        type: 'mcq',
        topic: 'Derived State',
        prompt: 'You have `items` in state and need `filteredItems` based on `searchQuery`. What is the cleanest React architecture?',
        code: `const [items, setItems] = useState([]);\nconst [searchQuery, setSearchQuery] = useState('');`,
        options: [
          'Store `filteredItems` in a second `useState` and sync it inside `useEffect`',
          'Compute `const filteredItems = items.filter(...)` directly during render (or wrap in `useMemo` if expensive)',
          'Mutate `items` inside an `onChange` handler',
          'Use `useLayoutEffect` to update `filteredItems` synchronously'
        ],
        answer: 'Compute `const filteredItems = items.filter(...)` directly during render (or wrap in `useMemo` if expensive)',
        explanation: 'Derived values should be computed during render rather than duplicated in state via `useEffect`, avoiding extra render passes and stale synchronization bugs.'
      },
      {
        id: 'q-102',
        type: 'code_output',
        topic: 'JavaScript Event Loop',
        prompt: 'What exact order is logged to the console when this snippet runs?',
        code: `console.log('1');\nsetTimeout(() => console.log('2'), 0);\nPromise.resolve().then(() => console.log('3'));\nconsole.log('4');`,
        options: ['1, 2, 3, 4', '1, 4, 3, 2', '1, 4, 2, 3', '1, 3, 4, 2'],
        answer: '1, 4, 3, 2',
        explanation: 'Synchronous logs (1, 4) run first on the call stack. Microtasks (Promise.then -> 3) drain completely before the next macrotask (setTimeout -> 2).'
      },
      {
        id: 'q-103',
        type: 'find_error',
        topic: 'Effect Cleanup & Race Conditions',
        prompt: 'Identify the primary bug in this data-fetching effect when `userId` changes rapidly:',
        code: `useEffect(() => {\n  fetch(\`/api/users/\${userId}\`)\n    .then(res => res.json())\n    .then(data => setProfile(data));\n}, [userId]);`,
        options: [
          'Missing `AbortController` or ignore flag cleanup, allowing slow older requests to overwrite newer state',
          '`fetch` cannot be called inside `useEffect`',
          '`userId` should be omitted from the dependency array',
          '`res.json()` is synchronous and throws an error'
        ],
        answer: 'Missing `AbortController` or ignore flag cleanup, allowing slow older requests to overwrite newer state',
        explanation: 'Without aborting or ignoring stale responses in the cleanup function, out-of-order network responses cause race conditions.'
      },
      {
        id: 'q-104',
        type: 'true_false',
        topic: 'Custom Hooks',
        prompt: 'True or False: Calling two instances of a custom hook `useDebounce()` in the same component shares the same underlying `useState` memory slot.',
        code: '',
        options: ['True', 'False'],
        answer: 'False',
        explanation: 'Custom hooks reuse stateful logic, NOT state itself. Each call to a custom hook gets completely isolated state.'
      },
      {
        id: 'q-105',
        type: 'fill_blank',
        topic: 'Custom Hooks Cleanup',
        prompt: 'Complete the cleanup return statement in `useDebounce` so pending timers do not fire after unmount: `return () => _____(timerId);`',
        code: `useEffect(() => {\n  const timerId = setTimeout(() => setDebounced(value), delay);\n  return () => _____(timerId);\n}, [value, delay]);`,
        options: [],
        answer: 'clearTimeout',
        explanation: '`clearTimeout(timerId)` cancels the scheduled timer whenever `value`/`delay` changes or the component unmounts.'
      }
    ]
  },
  {
    id: 'quiz-2',
    title: 'Memory, Pointers & Big-O Foundations (CS50)',
    courseId: 'course-2',
    topic: 'Data Structures: Hash Tables & Tries',
    field: 'Computer Science',
    difficulty: 'Beginner',
    mandatory: false,
    deadline: '2026-11-25',
    durationMinutes: 8,
    questions: [
      {
        id: 'q-201',
        type: 'mcq',
        topic: 'Asymptotic Complexity',
        prompt: 'Looking up a key in a well-distributed hash table takes what average time complexity?',
        code: '',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        answer: 'O(1)',
        explanation: 'A hash function maps keys directly to bucket indices in constant average time O(1).'
      },
      {
        id: 'q-202',
        type: 'true_false',
        topic: 'Reference Equality',
        prompt: 'True or False: In JavaScript, `{ id: 1 } === { id: 1 }` evaluates to `true` because both objects contain identical key-value pairs.',
        code: '',
        options: ['True', 'False'],
        answer: 'False',
        explanation: 'Objects are compared by heap memory reference, not structural value.'
      }
    ]
  }
];

const INITIAL_QUIZ_ATTEMPTS = [
  {
    id: 'att-1',
    quizId: 'quiz-1',
    quizTitle: 'React Hooks, Render Lifecycle & State Purity',
    date: 'Nov 12, 2026',
    score: 4,
    total: 5,
    percentage: 80,
    weakTopics: ['JavaScript Event Loop'],
    strongTopics: ['Derived State', 'Effect Cleanup & Race Conditions', 'Custom Hooks'],
    missedQuestionIds: ['q-102']
  }
];

const INITIAL_WEEKLY_ACTIVITIES = [
  { id: 'wa-mon', day: 'MONDAY', theme: 'LEARN AND PLAN', title: 'Submit Weekly Learning Targets & Study Custom Hooks', deadline: 'Mon 20:00', completed: true, description: 'Continue individual courses, break down weekly objectives, and review shared architecture topic.' },
  { id: 'wa-tue', day: 'TUESDAY', theme: 'PRACTICE', title: 'Complete Adaptive Hooks Quiz & Debounced Search Kata', deadline: 'Tue 21:00', completed: true, description: 'Apply recently learned concepts through practical coding exercises without relying on copy-pasted code.' },
  { id: 'wa-wed', day: 'WEDNESDAY', theme: 'KNOWLEDGE SHARING', title: 'Attend Event Loop Lightning Demo & Share Takeaway', deadline: 'Wed 18:00', completed: true, description: 'Explain concepts to peers, ask questions about blockers, and document discoveries.' },
  { id: 'wa-thu', day: 'THURSDAY', theme: 'BUILD AND COLLABORATE', title: 'Pair Feature Sprint on OpenPulse Command Palette', deadline: 'Thu 22:00', completed: false, description: 'Collaborate on feature branches, link issues, and keep commits atomic.' },
  { id: 'wa-fri', day: 'FRIDAY', theme: 'SUBMISSION DAY', title: 'Open Pull Request & Submit Challenge Solution', deadline: 'Fri 18:00', completed: false, description: 'Share GitHub repository links, explain trade-offs, and flag any incomplete edge cases.' },
  { id: 'wa-sat', day: 'SATURDAY', theme: 'REVIEW AND IMPROVE', title: 'Peer Code Review on Assigned Buddy PR', deadline: 'Sat 17:00', completed: false, description: 'Review teammate PRs constructively, test edge cases locally, and suggest cleaner patterns.' },
  { id: 'wa-sun', day: 'SUNDAY', theme: 'WEEKLY CHECK-IN', title: 'Submit 7-Prompt Accountability Reflection Report', deadline: 'Sun 20:00', completed: false, description: 'Audit what you planned vs learned, record blockers, and set next week’s focus.' }
];

const INITIAL_CHALLENGES = [
  {
    id: 'ch-1',
    title: 'Debounced Search Input with AbortController',
    category: 'Frontend',
    difficulty: 'Intermediate',
    deadline: '2026-11-20',
    technologies: ['React', 'TypeScript', 'Fetch API'],
    description: 'Build a reusable `useDebouncedSearch` hook that delays API queries by 300ms and cancels stale in-flight requests.',
    objectives: ['Prevent stale network race conditions', 'Clean up timers and AbortControllers on unmount', 'Handle loading, empty, and error states cleanly'],
    status: 'In Progress',
    submission: {
      repoUrl: 'https://github.com/amara-okafor-dev/cmd-k-palette',
      explanation: 'Implemented custom useDebounce hook and wired AbortController signal into fetch effect.',
      difficulties: 'Writing unit test assertions for fake timers in Vitest.',
      usedAi: 'Yes — For concept hints & debugging',
      aiVerification: 'Verified AbortError handling manually in Chrome DevTools Slow 3G throttling.',
      feedback: ''
    }
  },
  {
    id: 'ch-2',
    title: 'Git Multi-Branch Merge Conflict Rescue Lab',
    category: 'Git and GitHub',
    difficulty: 'Beginner',
    deadline: '2026-11-15',
    technologies: ['Git', 'GitHub CLI', 'Markdown'],
    description: 'Resolve a three-way merge conflict between two feature branches modifying shared configuration and utility files.',
    objectives: ['Inspect conflict markers accurately', 'Preserve both features without regressions', 'Open a clean PR summary'],
    status: 'Completed',
    submission: {
      repoUrl: 'https://github.com/amara-okafor-dev/git-conflict-lab/pull/1',
      explanation: 'Resolved divergent imports in config.ts and verified build passes.',
      difficulties: '',
      usedAi: 'No — Written 100% independently',
      aiVerification: 'Ran git diff and test suite locally.',
      feedback: 'Clean commit history and clear PR description. Approved!'
    }
  },
  {
    id: 'ch-3',
    title: 'Rate-Limited REST API Middleware',
    category: 'Backend',
    difficulty: 'Intermediate',
    deadline: '2026-11-24',
    technologies: ['Node.js', 'TypeScript', 'HTTP'],
    description: 'Implement a sliding-window in-memory rate limiter middleware returning standard 429 Retry-After headers.',
    objectives: ['Understand sliding window timestamps', 'Return accurate HTTP headers', 'Write automated boundary tests'],
    status: 'Not Started',
    submission: null
  }
];

const INITIAL_PROJECTS = [
  {
    id: 'proj-1',
    name: 'OpenPulse — Developer Telemetry & Standup CLI + Web',
    status: 'Active',
    sdlcStage: '7. Development',
    deadline: '2026-12-15',
    repoUrl: 'https://github.com/dev-growth-hub/openpulse',
    description: 'Lightweight engineering standup and PR readiness tracker built collaboratively by the cohort.',
    problemStatement: 'Junior teams lose visibility into blockers between weekly meetings.',
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    members: ['Amara Okafor (Frontend)', 'Tunde Bakare (Backend)', 'Chidinma Eze (Full Stack)', 'David Mensah (Lead)'],
    milestones: [
      { id: 'pm-1', title: 'Database Schema & Auth Endpoints', done: true },
      { id: 'pm-2', title: 'Accessible Command Palette & Board UI', done: true },
      { id: 'pm-3', title: 'End-to-End Integration & Staging Deploy', done: false }
    ],
    tasks: [
      { id: 'pt-1', title: 'Design responsive project board layout', assignee: 'Amara Okafor', status: 'Completed' },
      { id: 'pt-2', title: 'Implement keyboard focus trap on modal close', assignee: 'Amara Okafor', status: 'In Review' },
      { id: 'pt-3', title: 'Build paginated standup feed endpoint', assignee: 'Tunde Bakare', status: 'In Progress' },
      { id: 'pt-4', title: 'Write Playwright smoke tests for auth flow', assignee: 'Chidinma Eze', status: 'To Do' }
    ]
  },
  {
    id: 'proj-2',
    name: 'DocuGuard — AI Output Citation & Hallucination Checker',
    status: 'Planning',
    sdlcStage: '4. Requirements',
    deadline: '2027-01-12',
    repoUrl: 'https://github.com/dev-growth-hub/docuguard',
    description: 'Browser and CLI utility that cross-verifies package names and API signatures mentioned in LLM snippets.',
    problemStatement: 'Developers waste hours debugging hallucinated library methods from unverified AI responses.',
    technologies: ['Python', 'FastAPI', 'React', 'AST Parsing'],
    members: ['Kwame Boateng (AI/ML)', 'Amara Okafor (Frontend)', 'David Mensah (Lead)'],
    milestones: [
      { id: 'pm-21', title: 'Problem Discovery & Requirements Spec', done: true },
      { id: 'pm-22', title: 'AST Import Extractor Prototype', done: false }
    ],
    tasks: [
      { id: 'pt-21', title: 'Define supported npm & PyPI registry checks', assignee: 'Kwame Boateng', status: 'In Progress' },
      { id: 'pt-22', title: 'Wireframe side-by-side diff annotation UI', assignee: 'Amara Okafor', status: 'To Do' }
    ]
  }
];

const SDLC_STAGES = [
  '1. Ideation',
  '2. Research',
  '3. Planning',
  '4. Requirements',
  '5. UI/UX Design',
  '6. Architecture',
  '7. Development',
  '8. Testing',
  '9. Deployment',
  '10. Retrospective'
];

const INITIAL_PRESENTATIONS = [
  {
    id: 'pres-1',
    title: 'Demystifying the JavaScript Event Loop & Microtask Queue',
    presenter: 'Amara Okafor',
    topic: 'JavaScript Internals',
    type: 'Knowledge-Sharing Session',
    dateTime: 'Wednesday, Nov 18 • 17:00 WAT',
    description: 'Live walkthrough visualizing Call Stack, Web APIs, Microtask Queue, and Macrotask Queue with interactive debugging examples.',
    resourceUrl: 'https://github.com/amara-okafor-dev/event-loop-visualizer',
    attendees: ['Amara Okafor', 'Tunde Bakare', 'Chidinma Eze', 'David Mensah']
  },
  {
    id: 'pres-2',
    title: 'PostgreSQL Indexing & Query Execution Plans in Practice',
    presenter: 'Tunde Bakare',
    topic: 'Backend & Databases',
    type: 'Live Coding Workshop',
    dateTime: 'Friday, Nov 20 • 16:30 WAT',
    description: 'Hands-on workshop profiling slow queries with EXPLAIN ANALYZE and designing composite B-Tree indexes.',
    resourceUrl: 'https://github.com/dev-growth-hub/sql-perf-workshop',
    attendees: ['Tunde Bakare', 'Kwame Boateng', 'David Mensah']
  }
];

const INITIAL_POSTS = [
  {
    id: 'post-1',
    author: 'David Mensah',
    role: 'Admin / Team Leader',
    category: 'Announcement',
    pinned: true,
    timestamp: '2 hours ago',
    title: 'Friday Submission & Peer PR Review Expectations',
    content: 'Remember: every Friday PR must include a short explanation of what you tested, any edge cases remaining, and what you verified if you used AI tools.',
    likes: 14,
    comments: [
      { id: 'c-1', author: 'Amara Okafor', text: 'Updated my Command Palette PR template with test verification notes!' }
    ]
  },
  {
    id: 'post-2',
    author: 'Tunde Bakare',
    role: 'Backend Developer',
    category: 'Discovery',
    pinned: false,
    timestamp: 'Yesterday',
    title: 'Why EXPLAIN ANALYZE saved our search endpoint 340ms',
    content: 'Adding a composite index on (team_id, created_at DESC) eliminated a sequential scan on 120k rows. Happy to walk anyone through reading query plans.',
    likes: 9,
    comments: []
  }
];

const INITIAL_RESOURCES = [
  { id: 'res-1', title: 'React Official Docs — Synchronizing with Effects', category: 'Frontend Development', type: 'Documentation', url: 'https://react.dev/learn/synchronizing-with-effects', addedBy: 'David Mensah', description: 'Essential guide on when NOT to use useEffect and how to write proper cleanup functions.' },
  { id: 'res-2', title: 'Pro Git Book — Branching & Merging Internals', category: 'Git and GitHub', type: 'Book / Guide', url: 'https://git-scm.com/book/en/v2', addedBy: 'Amara Okafor', description: 'Deep dive into commits, branches, rebasing, and conflict resolution.' },
  { id: 'res-3', title: 'MDN Web Docs — Event Loop & Concurrency Model', category: 'Programming', type: 'Documentation', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop', addedBy: 'Chidinma Eze', description: 'Clear reference explaining stack, heap, microtasks, and macrotasks.' },
  { id: 'res-4', title: 'OWASP Top 10 Web Application Security Risks', category: 'Cybersecurity', type: 'Guide', url: 'https://owasp.org/www-project-top-ten/', addedBy: 'David Mensah', description: 'Practical checklist for securing APIs, inputs, and authentication flows.' }
];

const INITIAL_GIT_LEVELS = [
  { level: 1, title: 'Create Repositories & Atomic Commits', desc: 'Initialize repos, stage specific hunks, write imperative commit messages, and maintain clean .gitignore.', completed: true, evidence: 'Verified via github.com/amara-okafor-dev' },
  { level: 2, title: 'Create Feature Branches & Push Changes', desc: 'Branch cleanly from updated main using feat/ and fix/ naming conventions.', completed: true, evidence: 'Verified in OpenPulse & cmd-k-palette' },
  { level: 3, title: 'Open Well-Documented Pull Requests', desc: 'Draft PRs explaining problem statement, architectural trade-offs, and test verification.', completed: true, evidence: 'PR #1 merged on git-conflict-lab' },
  { level: 4, title: 'Review Teammates’ Code Constructively', desc: 'Inspect diffs for edge cases, readability, and security before approving.', completed: false, evidence: 'Pending 1 peer PR review on OpenPulse' },
  { level: 5, title: 'Resolve Multi-File Merge Conflicts', desc: 'Rebase/merge divergent branches cleanly while preserving test suites.', completed: true, evidence: 'Completed Git Merge Conflict Rescue Lab' },
  { level: 6, title: 'Collaborate on Shared Team Repositories', desc: 'Coordinate multi-contributor releases, issue linking, and CI status checks.', completed: false, evidence: 'In progress on OpenPulse v1 release' }
];

const INITIAL_AI_LITERACY = [
  { id: 'ail-1', stage: 'Stage 1: Structured Prompting & Mental Models', desc: 'Ask AI for step-by-step breakdowns, trade-offs, and Socratic hints instead of full code dumps.', completed: true },
  { id: 'ail-2', stage: 'Stage 2: AI-Assisted Research & Debugging', desc: 'Provide stack traces, minimal reproductions, and constraints to isolate root causes.', completed: true },
  { id: 'ail-3', stage: 'Stage 3: Line-by-Line Code Evaluation', desc: 'Audit every AI-suggested function for edge cases, state mutations, and unnecessary complexity.', completed: true },
  { id: 'ail-4', stage: 'Stage 4: Detecting Hallucinations & Outdated APIs', desc: 'Cross-check library signatures, package versions, and claims against official documentation.', completed: false },
  { id: 'ail-5', stage: 'Stage 5: Privacy, Secrets & Security Auditing', desc: 'Never paste API keys, credentials, or private user records into prompts; validate auth rules manually.', completed: false },
  { id: 'ail-6', stage: 'Stage 6: Responsible Co-Building & Attribution', desc: 'Document AI assistance transparently in submissions along with what you verified and modified.', completed: false }
];

const INITIAL_HELP_REQUESTS = [
  {
    id: 'help-1',
    author: 'Amara Okafor',
    field: 'Frontend Development',
    target: 'Assigned Mentor',
    status: 'Being Helped',
    createdAt: '3 hours ago',
    goal: 'Restore keyboard focus back to the trigger button when the Command Palette modal closes via Escape.',
    attempted: 'Stored `document.activeElement` in a `useRef` inside `useEffect`, but cleanup runs after unmount when the trigger ref is null.',
    errorOrCode: `useEffect(() => {\n  const prev = document.activeElement;\n  return () => prev?.focus();\n}, [isOpen]);`,
    helpNeeded: 'Clarification on effect timing so focus restoration works reliably without race conditions.',
    responses: [
      {
        id: 'hr-1',
        responder: 'David Mensah (Mentor)',
        text: 'Good catch! Capture `previousFocusRef.current = document.activeElement` inside the `if (isOpen)` branch, and call `previousFocusRef.current?.focus()` in the `else` branch when `isOpen` flips to `false`.'
      }
    ]
  },
  {
    id: 'help-2',
    author: 'Chidinma Eze',
    field: 'Full Stack Development',
    target: 'Frontend Group',
    status: 'Open',
    createdAt: '1 hour ago',
    goal: 'Type a generic `useFetch<T>(url)` hook in TypeScript without `any` casts.',
    attempted: 'Added `<T>` to the function signature, but `useState<T>(null)` throws a type mismatch error.',
    errorOrCode: `Type 'null' is not assignable to type 'T'.`,
    helpNeeded: 'How to properly union `T | null` in initial state.',
    responses: []
  }
];

const MEASURABLE_MILESTONES = [
  { id: 'ms-dev-1', title: 'Understands Programming & CS Fundamentals', criteria: 'Complete 2+ core modules & pass Fundamentals assessment', demonstrated: true, evidence: 'CS50 Modules 1–2 + Memory & Big-O Quiz (100%)' },
  { id: 'ms-dev-2', title: 'Can Independently Build Responsive Web Interfaces', criteria: 'Complete HTML/CSS/React roadmap checkpoints & ship UI build', demonstrated: true, evidence: 'Frontend Roadmap fe-1..fe-3 + OpenPulse Grid Layout' },
  { id: 'ms-dev-3', title: 'Can Work with Git Branches & Resolve Merge Conflicts', criteria: 'Reach Git Collaboration Level 5 with verified PR', demonstrated: true, evidence: 'Git Merge Conflict Rescue Lab PR #1 Approved' },
  { id: 'ms-dev-4', title: 'Can Consume APIs & Handle Async Race Conditions', criteria: 'Score >=80% on Hooks/Async Quiz & submit Debounced Search challenge', demonstrated: true, evidence: 'React Hooks Quiz (80%) + AbortController Implementation' },
  { id: 'ms-dev-5', title: 'Can Review Teammates’ Pull Requests Constructively', criteria: 'Complete Git Level 4 peer code review on active team repo', demonstrated: false, evidence: 'Requires 1 verified PR review on OpenPulse' },
  { id: 'ms-dev-6', title: 'Can Independently Debug & Write Automated Tests', criteria: 'Complete Testing roadmap topic & merge test suite PR', demonstrated: false, evidence: 'In progress: Command Palette Vitest suite' },
  { id: 'ms-dev-7', title: 'Can Build & Deploy a Full-Stack Collaborative Product', criteria: 'Complete all 10 SDLC stages on a team project', demonstrated: false, evidence: 'OpenPulse currently at Stage 7 (Development)' }
];

const TEAM_ROSTER = [
  { id: 'tm-1', name: 'Amara Okafor', role: 'Member', field: 'Frontend Development', level: 'Intermediate Beginner', coursePct: 58, quizAvg: 80, gitLevel: 4, status: 'On Track', partner: 'Tunde Bakare', mentor: 'David Mensah' },
  { id: 'tm-2', name: 'Tunde Bakare', role: 'Member', field: 'Backend Development', level: 'Intermediate', coursePct: 74, quizAvg: 88, gitLevel: 5, status: 'Excelling', partner: 'Amara Okafor', mentor: 'David Mensah' },
  { id: 'tm-3', name: 'Chidinma Eze', role: 'Member', field: 'Full Stack Development', level: 'Beginner', coursePct: 41, quizAvg: 70, gitLevel: 3, status: 'Needs Support', partner: 'Kwame Boateng', mentor: 'David Mensah' },
  { id: 'tm-4', name: 'Kwame Boateng', role: 'Member', field: 'AI & Machine Learning', level: 'Intermediate', coursePct: 68, quizAvg: 85, gitLevel: 4, status: 'On Track', partner: 'Chidinma Eze', mentor: 'David Mensah' },
  { id: 'tm-5', name: 'David Mensah', role: 'Admin / Team Leader', field: 'Full Stack & Architecture', level: 'Senior Lead', coursePct: 100, quizAvg: 96, gitLevel: 6, status: 'Mentor', partner: 'Cohort Lead', mentor: '—' }
];

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================
// ============================================================================
// SHARED UI (module level so React doesn't remount them on every render)
// ============================================================================
const DarkCtx = createContext(false);

const Badge = ({ children, variant = 'neutral' }: { children: React.ReactNode; variant?: 'neutral' | 'success' | 'warning' | 'danger' | 'info' }) => {
  const dark = useContext(DarkCtx);
  const styles = {
    neutral: dark ? 'bg-[#222222] text-[#D4D4D4] border-[#333333]' : 'bg-[#F3F3F3] text-[#333333] border-[#D8D8E2]',
    success: `bg-emerald-500/10 ${dark ? 'text-emerald-300' : 'text-emerald-700'} border-emerald-500/30`,
    warning: `bg-amber-500/10 ${dark ? 'text-amber-300' : 'text-amber-700'} border-amber-500/30`,
    danger: `bg-rose-500/10 ${dark ? 'text-rose-300' : 'text-rose-700'} border-rose-500/30`,
    info: `bg-sky-500/10 ${dark ? 'text-sky-300' : 'text-sky-700'} border-sky-500/30`
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${styles[variant]}`}>
      {children}
    </span>
  );
};

const ProgressBar = ({ value }: { value: number }) => {
  const dark = useContext(DarkCtx);
  return (
    <div className={`w-full h-1.5 rounded-full overflow-hidden ${dark ? 'bg-[#34343F]' : 'bg-[#EAEAEA]'}`}>
      <div
        className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-indigo-500 to-violet-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
};


const ADMIN_SITE = (import.meta as any).env?.VITE_APP_MODE === 'admin';
const MEMBER_SITE_URL: string | undefined = (import.meta as any).env?.VITE_MEMBER_SITE_URL;
const ADMIN_CODE: string | undefined = (import.meta as any).env?.VITE_ADMIN_CODE;

const TOUR_MEMBER = [
  { hub: 'home', tab: 'dashboard', title: 'Welcome aboard 👋', body: 'This quick tour takes about 30 seconds. The app has just 5 areas, shown in the menu. Home is your starting point: your streak, what to do next, and topics worth revisiting.' },
  { hub: 'learn', tab: 'courses', title: 'Learn', body: 'Track your courses, follow a roadmap, take quizzes and chat with the AI Mentor. Log what you studied each day so your streak and progress stay up to date.' },
  { hub: 'build', tab: 'challenges', title: 'Build', body: 'Practice with weekly challenges, run projects through the 10 stages, and prepare for hackathons. This is where learning turns into real work.' },
  { hub: 'community-hub', tab: 'pairing-help', title: 'Get help, any time', body: 'Stuck on something? Open Get Help to post a blocker and the community or a mentor will jump in. Resources and demo days live here too.' },
  { hub: 'me', tab: 'progress', title: 'Track your growth', body: 'See your readiness profile and weekly reports here, and update your profile in Settings. You can replay this tour any time from the menu. Have fun! 🚀' }
];
const TOUR_ADMIN = [
  { hub: 'a-overview', tab: 'admin-dashboard', title: 'Team lead view 👋', body: 'Overview shows how your members are doing: activity, progress and who might need a nudge.' },
  { hub: 'a-support', tab: 'admin-help', title: 'Support', body: 'Answer blockers in the Help Desk and plan the week in Schedule.' },
  { hub: 'a-content', tab: 'admin-quizzes', title: 'Content', body: 'Manage quizzes, challenges, projects and events from this one area.' },
  { hub: 'a-resources', tab: 'resources', title: 'Resources', body: 'Curate the shared library your members learn from. You can replay this tour from the menu.' }
];

const LoginScreen = ({ onLogin }: { onLogin: (u: { name: string; email: string; isAdmin: boolean }) => void }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [err, setErr] = useState('');
  const field = 'w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/60';
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setErr('Please tell us your name.');
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setErr('Please enter a valid email.');
    if (ADMIN_SITE && ADMIN_CODE && code !== ADMIN_CODE) return setErr('That team lead code isn’t right.');
    onLogin({ name: name.trim(), email: email.trim(), isAdmin: ADMIN_SITE });
  };
  return (
    <div className={`hub-root ${ADMIN_SITE ? 'admin-theme' : ''} min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600`}>
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-slate-900">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold mb-5"><Rocket className="w-6 h-6" /></div>
        <h1 className="text-2xl font-semibold tracking-tight">{ADMIN_SITE ? 'Admin Console' : 'Developer Growth Hub'}</h1>
        <p className="text-sm text-slate-600 mt-1.5 mb-6">{ADMIN_SITE ? 'For team leads. Sign in to manage the community.' : 'Learn, build and grow with your community. Sign in to get started.'}</p>
        <form onSubmit={submit} className="space-y-3">
          <input className={field} placeholder="Your name" value={name} onChange={e => setName(e.target.value)} autoComplete="name" />
          <input className={field} placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
          {ADMIN_SITE && ADMIN_CODE && <input className={field} placeholder="Team lead code" type="password" value={code} onChange={e => setCode(e.target.value)} />}
          {err && <p role="alert" className="text-sm text-rose-600">{err}</p>}
          <button type="submit" className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition cursor-pointer">Get started</button>
        </form>
      </div>
    </div>
  );
};

const TourCard = ({ step, index, total, onNext, onBack, onSkip, dark }: any) => (
  <div role="dialog" aria-label="Tutorial" className={`fixed z-[60] bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 w-[min(92vw,28rem)] rounded-2xl shadow-2xl border p-5 ${dark ? 'bg-[#16161F] border-[#2E2E3E] text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
    <div className="flex items-center justify-between mb-1">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-500">Step {index + 1} of {total}</span>
      <button onClick={onSkip} className="text-xs opacity-60 hover:opacity-100 cursor-pointer">Skip tour</button>
    </div>
    <h2 className="text-lg font-semibold">{step.title}</h2>
    <p className="text-sm mt-1.5 opacity-75 leading-relaxed">{step.body}</p>
    <div className="flex items-center justify-between mt-4">
      <div className="flex gap-1.5">{Array.from({ length: total }).map((_, i) => <span key={i} className={`h-1.5 rounded-full transition-all ${i === index ? 'w-5 bg-indigo-500' : 'w-1.5 bg-slate-300'}`} />)}</div>
      <div className="flex gap-2">
        {index > 0 && <button onClick={onBack} className="px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-300/60 cursor-pointer">Back</button>}
        <button onClick={onNext} className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 cursor-pointer">{index === total - 1 ? 'Finish' : 'Next'}</button>
      </div>
    </div>
  </div>
);


// Which pieces of state are private to each member vs shared by the whole community
const PERSONAL_KEYS = ['profile','courses','selectedRoadmapId','roadmapProgress','quizAttempts','gitLevels','aiLiteracy','dailyLogs','weeklyReports','diagnosticResult','pairingState','hackathon','onboarded'];
const SHARED_KEYS = ['quizzes','weeklyActivities','challenges','projects','presentations','posts','resources','helpRequests','teamRoster'];

// What a brand-new member starts with (no one else's sample data)
export const blankPersonal = (name = '', hk: any = { checklist: [] }) => ({
  profile: { ...INITIAL_PROFILE, fullName: name, username: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), bio: '', field: '', skillLevel: 'Beginner', languages: [], frameworks: [], interests: [], githubUrl: '', portfolioUrl: '', linkedinUrl: '', streakDays: 0 },
  courses: [], selectedRoadmapId: 'rm-frontend', roadmapProgress: {}, quizAttempts: [], dailyLogs: [], weeklyReports: [],
  gitLevels: INITIAL_GIT_LEVELS.map(g => ({ ...g, completed: false, evidence: '' })),
  aiLiteracy: INITIAL_AI_LITERACY.map(a => ({ ...a, completed: false })),
  diagnosticResult: { completed: false, field: '', recommendedLevel: '', strengths: [], weaknesses: [], planSummary: '' },
  pairingState: { partnerName: '', partnerField: '', assignedMentor: '', joinedGroups: [], pairExercise: '' },
  hackathon: { ...hk, teamName: '', idea: '', repoUrl: '', checklist: (hk.checklist || []).map((c: any) => ({ ...c, done: false })) },
  onboarded: false
});

const NotAuthorized = ({ onSignOut }: { onSignOut: () => void }) => (
  <div className="hub-root admin-theme min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600">
    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-slate-900 text-center">
      <h1 className="text-xl font-semibold">This site is for team leads</h1>
      <p className="text-sm text-slate-600 mt-2">Your account doesn’t have admin access. Ask an admin to promote you, or use the member site.</p>
      <div className="flex gap-2 justify-center mt-5">
        {MEMBER_SITE_URL && <a href={MEMBER_SITE_URL} className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold">Go to member site</a>}
        <button onClick={onSignOut} className="px-4 py-2 rounded-xl border border-slate-300 text-sm font-medium cursor-pointer">Sign out</button>
      </div>
    </div>
  </div>
);

const LoadingScreen = ({ error }: { error?: boolean }) => (
  <div className={`hub-root ${ADMIN_SITE ? 'admin-theme' : ''} min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-white p-4 text-center`}>
    {error ? (
      <div><p className="font-semibold">We couldn’t load your data.</p><p className="text-sm opacity-80 mt-1">Check your connection and try again.</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 rounded-xl bg-white text-indigo-700 text-sm font-semibold cursor-pointer">Retry</button></div>
    ) : <p className="text-sm animate-pulse">Loading your hub…</p>}
  </div>
);

const AuthScreen = () => {
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);
  const field = 'w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/60';
  const validEmail = () => /^\S+@\S+\.\S+$/.test(email.trim());
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(''); setInfo('');
    if (mode === 'up' && !name.trim()) return setErr('Please tell us your name.');
    if (!validEmail()) return setErr('Please enter a valid email.');
    if (password.length < 6) return setErr('Password needs at least 6 characters.');
    setBusy(true);
    const res: any = mode === 'up'
      ? await supabase!.auth.signUp({ email: email.trim(), password, options: { data: { full_name: name.trim() }, emailRedirectTo: window.location.origin } })
      : await supabase!.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (res.error) return setErr(res.error.message);
    if (mode === 'up' && !res.data?.session) setInfo('Check your email to confirm your account, then sign in.');
  };
  const magicLink = async () => {
    setErr(''); setInfo('');
    if (!validEmail()) return setErr('Enter your email first.');
    const { error } = await supabase!.auth.signInWithOtp({ email: email.trim(), options: { emailRedirectTo: window.location.origin } });
    error ? setErr(error.message) : setInfo('We emailed you a sign-in link. It also works if you forgot your password.');
  };
  return (
    <div className={`hub-root ${ADMIN_SITE ? 'admin-theme' : ''} min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600`}>
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-slate-900">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-5"><Rocket className="w-6 h-6" /></div>
        <h1 className="text-2xl font-semibold tracking-tight">{ADMIN_SITE ? 'Admin Console' : mode === 'in' ? 'Welcome back' : 'Join the community'}</h1>
        <p className="text-sm text-slate-600 mt-1.5 mb-6">{ADMIN_SITE ? 'Team leads only' : 'Developer Growth Hub'}</p>
        <form onSubmit={submit} className="space-y-3">
          {mode === 'up' && <input className={field} placeholder="Your name" value={name} onChange={e => setName(e.target.value)} autoComplete="name" />}
          <input className={field} placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
          <input className={field} placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete={mode === 'in' ? 'current-password' : 'new-password'} />
          {err && <p role="alert" className="text-sm text-rose-600">{err}</p>}
          {info && <p role="status" className="text-sm text-emerald-600">{info}</p>}
          <button type="submit" disabled={busy} className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-semibold transition cursor-pointer">{busy ? 'One moment…' : mode === 'in' ? 'Sign in' : 'Create account'}</button>
        </form>
        <div className="flex items-center justify-between mt-4 text-sm">
          {ADMIN_SITE ? <span className="text-slate-600">Ask an existing admin for access</span> : <button onClick={() => { setMode(mode === 'in' ? 'up' : 'in'); setErr(''); setInfo(''); }} className="text-indigo-600 font-medium cursor-pointer">{mode === 'in' ? 'New here? Sign up' : 'Have an account? Sign in'}</button>}
          <button onClick={magicLink} className="text-slate-500 hover:text-slate-800 cursor-pointer">Email me a link</button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  // Load persisted state safely from localStorage if available
  const loadSaved = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      // Cloud mode keeps only UI preferences on the device; real data lives in Supabase
      return parsed && CLOUD ? { darkMode: parsed.darkMode, activeTab: parsed.activeTab } : parsed;
    } catch {
      return null;
    }
  };
  const saved = loadSaved();

  // Theme, Role & Navigation State
  const [darkMode, setDarkMode] = useState(saved?.darkMode ?? false);
  const [role, setRole] = useState(ADMIN_SITE ? 'admin' : 'member'); // each site has one fixed role
  const [activeTab, setActiveTab] = useState(ADMIN_SITE ? 'admin-dashboard' : (saved?.activeTab ?? 'dashboard'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [user, setUser] = useState<{ id?: string; name: string; email: string; isAdmin: boolean } | null>(saved?.user ?? null);
  const [authReady, setAuthReady] = useState(!CLOUD);
  const [hydrated, setHydrated] = useState(!CLOUD);
  const [loadError, setLoadError] = useState(false);
  const [onboarded, setOnboarded] = useState<boolean>(saved?.onboarded ?? false);
  const [tourStep, setTourStep] = useState<number | null>(null);

  // Core Workspace State
  const [profile, setProfile] = useState(saved?.profile ?? INITIAL_PROFILE);
  const [courses, setCourses] = useState(saved?.courses ?? INITIAL_COURSES);
  const [selectedRoadmapId, setSelectedRoadmapId] = useState(saved?.selectedRoadmapId ?? 'rm-frontend');
  const [roadmapProgress, setRoadmapProgress] = useState(saved?.roadmapProgress ?? INITIAL_ROADMAP_PROGRESS);
  const [quizzes, setQuizzes] = useState(saved?.quizzes ?? INITIAL_QUIZZES);
  const [quizAttempts, setQuizAttempts] = useState(saved?.quizAttempts ?? INITIAL_QUIZ_ATTEMPTS);
  const [weeklyActivities, setWeeklyActivities] = useState(saved?.weeklyActivities ?? INITIAL_WEEKLY_ACTIVITIES);
  const [challenges, setChallenges] = useState(saved?.challenges ?? INITIAL_CHALLENGES);
  const [projects, setProjects] = useState(saved?.projects ?? INITIAL_PROJECTS);
  const [presentations, setPresentations] = useState(saved?.presentations ?? INITIAL_PRESENTATIONS);
  const [posts, setPosts] = useState(saved?.posts ?? INITIAL_POSTS);
  const [resources, setResources] = useState(saved?.resources ?? INITIAL_RESOURCES);
  const [gitLevels, setGitLevels] = useState(saved?.gitLevels ?? INITIAL_GIT_LEVELS);
  const [aiLiteracy, setAiLiteracy] = useState(saved?.aiLiteracy ?? INITIAL_AI_LITERACY);
  const [helpRequests, setHelpRequests] = useState(saved?.helpRequests ?? INITIAL_HELP_REQUESTS);
  const [teamRoster, setTeamRoster] = useState(saved?.teamRoster ?? TEAM_ROSTER);

  const [dailyLogs, setDailyLogs] = useState(saved?.dailyLogs ?? [
    { id: 'dl-1', date: 'Today', module: 'Custom Hooks & State Synchronization', summary: 'Built reusable useDebounce hook and tested rapid input cancellation with AbortController.', repoLink: 'https://github.com/amara-okafor-dev/cmd-k-palette' }
  ]);

  const [weeklyReports, setWeeklyReports] = useState(saved?.weeklyReports ?? [
    {
      id: 'rep-1',
      weekEnding: '2026-11-08',
      memberName: 'Amara Okafor',
      planned: 'Finish React state lifecycle module and complete Git conflict challenge.',
      learned: 'Learned how React batches state updates and when to avoid useEffect for derived values.',
      modulesCompleted: '2 modules in Full-Stack React & TypeScript',
      built: 'Built Command Palette keyboard navigation prototype.',
      challenges: 'Handling focus trap cleanup cleanly.',
      struggled: 'Microtask vs macrotask execution order in complex async chains.',
      nextWeekGoal: 'Master custom hooks and submit Command Palette PR.',
      evidenceUrl: 'https://github.com/amara-okafor-dev/cmd-k-palette'
    }
  ]);

  const [diagnosticResult, setDiagnosticResult] = useState(saved?.diagnosticResult ?? {
    completed: true,
    field: 'Frontend Development',
    recommendedLevel: 'Intermediate Beginner',
    strengths: ['Semantic HTML/CSS', 'React Component Composition', 'Git Branching'],
    weaknesses: ['JavaScript Event Loop', 'TypeScript Generics', 'Automated Unit Testing'],
    planSummary: 'Focus next 2 weeks on custom hooks, async cleanup, and Vitest before moving into Next.js full-stack patterns.'
  });

  const [pairingState, setPairingState] = useState(saved?.pairingState ?? {
    partnerName: 'Tunde Bakare',
    partnerField: 'Backend Development',
    assignedMentor: 'David Mensah',
    joinedGroups: ['Frontend', 'AI/ML'],
    pairExercise: 'Connect Amara’s Command Palette frontend search input to Tunde’s rate-limited REST search endpoint with AbortController.'
  });

  const [hackathon, setHackathon] = useState(saved?.hackathon ?? {
    name: 'Lagos CivicTech & DevTools Buildathon 2026',
    date: 'Dec 05 – Dec 07, 2026',
    teamName: 'PulseBuilders',
    idea: 'Offline-first clinic triage & queue estimator with SMS fallback.',
    repoUrl: 'https://github.com/dev-growth-hub/civic-triage-hackathon',
    checklist: [
      { id: 'hk-1', stage: '1. Problem Identification', done: true },
      { id: 'hk-2', stage: '2. User & Domain Research', done: true },
      { id: 'hk-3', stage: '3. Solution Ideation', done: true },
      { id: 'hk-4', stage: '4. Technical Architecture Plan', done: true },
      { id: 'hk-5', stage: '5. Team Role Assignment', done: true },
      { id: 'hk-6', stage: '6. Core MVP Development', done: false },
      { id: 'hk-7', stage: '7. Edge-Case Testing & Bug Bash', done: false },
      { id: 'hk-8', stage: '8. Pitch Deck & Live Demo Script', done: false },
      { id: 'hk-9', stage: '9. Production Deployment & Submission', done: false }
    ]
  });

  // Save changes to localStorage
  useEffect(() => {
    if (CLOUD) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ darkMode, activeTab })); } catch {}
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        darkMode, role, activeTab, profile, courses, selectedRoadmapId,
        roadmapProgress, quizzes, quizAttempts, weeklyActivities, challenges,
        projects, presentations, posts, resources, gitLevels, aiLiteracy,
        helpRequests, teamRoster, dailyLogs, weeklyReports, diagnosticResult,
        pairingState, hackathon, user, onboarded
      }));
    } catch {
      // Ignore storage quota errors in sandboxed iframes
    }
  }, [
    darkMode, role, activeTab, profile, courses, selectedRoadmapId,
    roadmapProgress, quizzes, quizAttempts, weeklyActivities, challenges,
    projects, presentations, posts, resources, gitLevels, aiLiteracy,
    helpRequests, teamRoster, dailyLogs, weeklyReports, diagnosticResult,
    pairingState, hackathon, user, onboarded
  ]);

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const notify = (msg) => {
    setToastMessage(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMessage(''), 3400);
  };

  // ============================================================================
  // SUPABASE: sign-in session, load, save, and live updates
  // ============================================================================
  useEffect(() => { if (ADMIN_SITE) document.title = 'Admin Console · Developer Growth Hub'; }, []);
  const synced = useRef<Record<string, string | undefined>>({});
  const stateMap: Record<string, [any, (v: any) => void]> = {
    profile: [profile, setProfile], courses: [courses, setCourses],
    selectedRoadmapId: [selectedRoadmapId, setSelectedRoadmapId], roadmapProgress: [roadmapProgress, setRoadmapProgress],
    quizAttempts: [quizAttempts, setQuizAttempts], gitLevels: [gitLevels, setGitLevels], aiLiteracy: [aiLiteracy, setAiLiteracy],
    dailyLogs: [dailyLogs, setDailyLogs], weeklyReports: [weeklyReports, setWeeklyReports],
    diagnosticResult: [diagnosticResult, setDiagnosticResult], pairingState: [pairingState, setPairingState],
    hackathon: [hackathon, setHackathon], onboarded: [onboarded, setOnboarded],
    quizzes: [quizzes, setQuizzes], weeklyActivities: [weeklyActivities, setWeeklyActivities],
    challenges: [challenges, setChallenges], projects: [projects, setProjects],
    presentations: [presentations, setPresentations], posts: [posts, setPosts],
    resources: [resources, setResources], helpRequests: [helpRequests, setHelpRequests],
    teamRoster: [teamRoster, setTeamRoster]
  };
  const stateRef = useRef(stateMap);
  stateRef.current = stateMap;

  // 1) Who is signed in? (role comes from the database, never from the browser)
  useEffect(() => {
    if (!supabase) return;
    const load = async (session: any) => {
      if (!session) { setUser(null); setAuthReady(true); return; }
      const { data: p } = await supabase.from('profiles').select('full_name,role').eq('id', session.user.id).maybeSingle();
      setUser({
        id: session.user.id,
        name: p?.full_name || session.user.user_metadata?.full_name || session.user.email,
        email: session.user.email,
        isAdmin: p?.role === 'admin'
      });
      setAuthReady(true);
    };
    supabase.auth.getSession().then(({ data }) => load(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => { setTimeout(() => load(session), 0); });
    return () => sub.subscription.unsubscribe();
  }, []);

  // 2) Load this member's data and the community's data once after sign-in
  useEffect(() => {
    if (!supabase || !user?.id || (ADMIN_SITE && !user.isAdmin)) return;
    let cancelled = false;
    (async () => {
      const [mine, shared] = await Promise.all([
        supabase.from('member_state').select('state').eq('user_id', user.id).maybeSingle(),
        supabase.from('shared_state').select('key,value')
      ]);
      if (cancelled) return;
      if (mine.error || shared.error) { setLoadError(true); return; }
      const m = stateRef.current;
      const base: any = mine.data?.state ?? {};
      const blank: any = blankPersonal(user.name, m.hackathon[0]);
      const mineObj: any = {};
      PERSONAL_KEYS.forEach(k => { mineObj[k] = base[k] ?? blank[k]; m[k][1](mineObj[k]); });
      synced.current.__mine = mine.data ? JSON.stringify(mineObj) : undefined;
      const have = new Set<string>();
      (shared.data || []).forEach((r: any) => {
        have.add(r.key);
        if (m[r.key]) { synced.current[r.key] = JSON.stringify(r.value); m[r.key][1](r.value); }
      });
      // Empty community: the first admin to sign in uploads the starter content
      SHARED_KEYS.filter(k => !have.has(k)).forEach(k => { synced.current[k] = user.isAdmin ? undefined : JSON.stringify(m[k][0]); });
      setHydrated(true);
      if (!base.onboarded) {
        setActiveTab(ADMIN_SITE ? 'admin-dashboard' : 'dashboard');
        setTourStep(0);
      }
    })();
    return () => { cancelled = true; };
  }, [user?.id]);

  // 3) Save changes (debounced). Private data goes to member_state, community data to shared_state.
  useEffect(() => {
    if (!supabase || !user?.id || !hydrated) return;
    const t = setTimeout(async () => {
      const m = stateRef.current;
      const mineJson = JSON.stringify(Object.fromEntries(PERSONAL_KEYS.map(k => [k, m[k][0]])));
      if (mineJson !== synced.current.__mine) {
        const { error } = await supabase.from('member_state').upsert({ user_id: user.id, state: JSON.parse(mineJson), updated_at: new Date().toISOString() });
        if (error) notify('Couldn’t save your progress. We’ll retry on your next change.');
        else synced.current.__mine = mineJson;
      }
      for (const k of SHARED_KEYS) {
        const json = JSON.stringify(m[k][0]);
        if (json === synced.current[k]) continue;
        const { error } = await supabase.from('shared_state').upsert({ key: k, value: m[k][0], updated_by: user.id, updated_at: new Date().toISOString() });
        if (!error) synced.current[k] = json;
        else if (error.code === '42501') { synced.current[k] = json; notify('Only team leads can change that section.'); }
      }
    }, 800);
    return () => clearTimeout(t);
  }, [hydrated, user?.id, ...Object.values(stateMap).map(([v]) => v)]);

  // 4) Live updates from other members
  useEffect(() => {
    if (!supabase || !user?.id || !hydrated) return;
    const ch = supabase.channel('shared-state').on('postgres_changes', { event: '*', schema: 'public', table: 'shared_state' }, (payload: any) => {
      const r = payload.new;
      if (!r?.key || !stateRef.current[r.key]) return;
      const json = JSON.stringify(r.value);
      if (synced.current[r.key] === json) return;
      synced.current[r.key] = json;
      stateRef.current[r.key][1](r.value);
    }).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [hydrated, user?.id]);

  // ============================================================================
  // DESIGN SYSTEM TOKENS (MONOCHROMATIC LINEAR / VERCEL / GITHUB AESTHETIC)
  // ============================================================================
  const bgClass = darkMode ? 'bg-[#0B0B12]' : 'bg-[#F5F6FB]';
  const cardClass = darkMode
    ? 'bg-[#121212] border border-[#34343F] rounded-2xl shadow-sm'
    : 'bg-white border border-[#D8D8E2] rounded-2xl shadow-sm';
  const subtleBgClass = darkMode ? 'bg-[#181818]' : 'bg-[#F8F8F8]';
  const borderClass = darkMode ? 'border-[#34343F]' : 'border-[#D8D8E2]';
  const textPrimary = darkMode ? 'text-[#F5F5F5]' : 'text-[#111111]';
  const textSecondary = darkMode ? 'text-[#C4C4D0]' : 'text-[#52525B]';
  const inputClass = `w-full px-3.5 py-2 text-sm rounded-lg border ${borderClass} ${
    darkMode ? 'bg-[#161616] text-white placeholder-[#52525B]' : 'bg-white text-[#111111] placeholder-[#999999]'
  } focus:outline-none focus:ring-2 focus:ring-indigo-500/60`;
  const btnPrimary = `inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition cursor-pointer ${
    'bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm'
  }`;
  const btnSecondary = `inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg border ${borderClass} transition cursor-pointer ${
    darkMode ? 'bg-[#161616] text-[#F5F5F5] hover:bg-[#222222]' : 'bg-white text-[#111111] hover:bg-[#F3F3F3]'
  }`;

  // ============================================================================
  // COMPUTED METRICS ACROSS CONNECTED SYSTEMS
  // ============================================================================
  const selectedRoadmap = ROADMAPS_CATALOG.find(r => r.id === selectedRoadmapId) || ROADMAPS_CATALOG[0];
  const overallCourseProgress = courses.length
    ? Math.round(courses.reduce((acc, c) => acc + c.progress, 0) / courses.length)
    : 0;

  const roadmapCompletedCount = selectedRoadmap.topics.filter(
    t => roadmapProgress[t.id]?.status === 'Completed'
  ).length;
  const roadmapPct = Math.round((roadmapCompletedCount / selectedRoadmap.topics.length) * 100);

  const weakTopicsList = Array.from(new Set([
    ...(quizAttempts[0]?.weakTopics || []),
    ...selectedRoadmap.topics.filter(t => roadmapProgress[t.id]?.struggling).map(t => t.name)
  ]));

  // ============================================================================
  // NAVIGATION CONFIGURATION
  // ============================================================================
  const memberNav = [
    { id: 'home', label: 'Home', icon: LayoutDashboard, tabs: [
      { id: 'dashboard', label: 'Dashboard' }
    ]},
    { id: 'learn', label: 'Learn', icon: BookOpen, tabs: [
      { id: 'courses', label: 'Courses & Logs' },
      { id: 'roadmaps', label: 'Roadmaps' },
      { id: 'quizzes', label: 'Quizzes' },
      { id: 'ai-mentor', label: 'AI Mentor' },
      { id: 'my-learning', label: 'Insights' }
    ]},
    { id: 'build', label: 'Build', icon: Code2, tabs: [
      { id: 'challenges', label: 'Challenges' },
      { id: 'projects', label: 'Projects' },
      { id: 'hackathons', label: 'Hackathons' },
      { id: 'weekly', label: 'Weekly Plan' }
    ]},
    { id: 'community-hub', label: 'Community', icon: Users, tabs: [
      { id: 'community', label: 'Feed & Demos' },
      { id: 'pairing-help', label: 'Get Help' },
      { id: 'resources', label: 'Resources' },
      { id: 'devtools', label: 'Git & AI Skills' }
    ]},
    { id: 'me', label: 'Me', icon: Award, tabs: [
      { id: 'progress', label: 'Growth Plan' },
      { id: 'profile', label: 'Profile & Settings' }
    ]}
  ];

  const adminNav = [
    { id: 'a-overview', label: 'Overview', icon: Shield, tabs: [
      { id: 'admin-dashboard', label: 'Team Overview' }
    ]},
    { id: 'a-support', label: 'Support', icon: LifeBuoy, tabs: [
      { id: 'admin-help', label: 'Help Desk' },
      { id: 'admin-weekly', label: 'Weekly Schedule' }
    ]},
    { id: 'a-content', label: 'Content', icon: ClipboardCheck, tabs: [
      { id: 'admin-quizzes', label: 'Quiz Bank' },
      { id: 'admin-challenges', label: 'Challenges' },
      { id: 'admin-projects', label: 'Projects' },
      { id: 'admin-community', label: 'Events' }
    ]},
    { id: 'a-resources', label: 'Resources', icon: Library, tabs: [
      { id: 'resources', label: 'Library' }
    ]}
  ];

  const currentNav = role === 'admin' ? adminNav : memberNav;
  // Old saved tab ids (or a tab from the other role) fall back to the first page instead of breaking
  const activeHub = currentNav.find(h => h.tabs.some(t => t.id === activeTab)) ?? currentNav[0];
  const safeTab = activeHub.tabs.some(t => t.id === activeTab) ? activeTab : activeHub.tabs[0].id;

  useEffect(() => { window.scrollTo({ top: 0 }); }, [safeTab]);

  const handleRoleSwitch = (nextRole) => {
    setRole(nextRole);
    setActiveTab(nextRole === 'admin' ? 'admin-dashboard' : 'dashboard');
    notify(`Switched workspace view to ${nextRole === 'admin' ? 'Admin / Team Leader' : 'Team Member'}`);
  };

  // ============================================================================
  // AI SOCRATIC MENTOR CHAT STATE & ENGINE
  // ============================================================================
  const [mentorMessages, setMentorMessages] = useState([
    {
      id: 'msg-1',
      sender: 'mentor',
      text: `Welcome back, ${INITIAL_PROFILE.fullName}. I have your current learning context loaded: **${INITIAL_PROFILE.field}** (${INITIAL_PROFILE.skillLevel}), active module **"${INITIAL_COURSES[0].currentTopic}"**, and your flagged focus area on **JavaScript Event Loop / Microtask ordering**.\n\nInstead of giving away finished answers, I will break concepts down step by step and check your understanding along the way. What would you like to tackle right now—debugging a snippet, quizzing your weak topic, or planning your next PR?`
    }
  ]);
  const [mentorInput, setMentorInput] = useState('');

  const generateSocraticResponse = (userPrompt) => {
    const q = userPrompt.toLowerCase();
    const activeCourse = courses[0];

    if (q.includes('event loop') || q.includes('promise') || q.includes('microtask') || q.includes('settimeout')) {
      return `Let’s break down the **JavaScript Event Loop** step by step using a mental model:\n\n1. **Call Stack (Synchronous):** Runs line-by-line immediately until empty.\n2. **Microtask Queue (High Priority):** Holds \`.then()\` callbacks and \`queueMicrotask\`. JavaScript drains *every* microtask before touching timers.\n3. **Macrotask Queue (Task Queue):** Holds \`setTimeout\`, \`setInterval\`, and DOM events.\n\n**Check for Understanding:** Suppose you schedule \`setTimeout(fnA, 0)\` and inside a resolved Promise \`.then()\` you schedule *another* \`Promise.resolve().then(fnB)\`. Does \`fnB\` run before or after \`fnA\`? Reply with your reasoning!`;
    }

    if (q.includes('hook') || q.includes('useeffect') || q.includes('abort') || q.includes('debounce')) {
      return `Great—since you're currently studying **"${activeCourse?.currentTopic}"**, let's look at why cleanup matters:\n\nWhen a user types \`"re"\` then \`"react"\` quickly, two network requests may be in flight. If the first request resolves *after* the second one, stale data overwrites the UI.\n\n**Hint (Before Code):**\n- Inside \`useEffect\`, instantiate \`const controller = new AbortController();\`, pass \`{ signal: controller.signal }\` to \`fetch\`, and return \`() => controller.abort()\`. \n\n**Your Turn:** What error name does \`fetch\` throw when \`controller.abort()\` cancels it, and how should your \`catch\` block avoid treating that cancellation as a user-facing crash?`;
    }

    if (q.includes('stuck') || q.includes('error') || q.includes('bug') || q.includes('focus')) {
      return `Let’s debug this systematically without jumping straight to a full rewrite:\n\n1. **Isolate the trigger:** Confirm the exact state transition when the bug occurs.\n2. **Check lifecycle timing:** In React, cleanup functions inside \`useEffect(() => () => cleanup, [dep])\` capture variables from the *previous* render.\n3. **Verify:** Log the value right before the transition.\n\nShare the 5–10 lines where your state changes, and tell me what you *expected* the variable to hold vs what it actually logged.`;
    }

    return `Connecting this to your **${profile.field}** path and active course (**${activeCourse?.title}**):\n\n1. **Concept Breakdown:** Start by defining the inputs, state transitions, and edge cases (empty, loading, error) before writing implementation code.\n2. **Next Concrete Step:** Since you scored **${quizAttempts[0]?.percentage || 80}%** on your recent Hooks quiz with a gap in **${weakTopicsList[0] || 'Async Edge Cases'}**, try explaining in 2 sentences how you would test that behavior independently.\n\nWould you like a **hint on your current challenge**, a **2-question concept check**, or a **code review** of a snippet you wrote?`;
  };

  const handleSendMentorMessage = (overrideText) => {
    const text = (overrideText ?? mentorInput).trim();
    if (!text) return;
    const userMsg = { id: `u-${Date.now()}`, sender: 'user', text };
    const replyText = generateSocraticResponse(text);
    const botMsg = { id: `m-${Date.now() + 1}`, sender: 'mentor', text: replyText };
    setMentorMessages(prev => [...prev, userMsg, botMsg]);
    if (!overrideText) setMentorInput('');
  };

  // ============================================================================
  // 1. MEMBER DASHBOARD
  // ============================================================================
  const renderMemberDashboard = () => {
    const latestCourse = courses[0];
    const latestAttempt = quizAttempts[0];
    const openBlockers = helpRequests.filter(h => h.status !== 'Resolved');
    const nextMilestone = MEASURABLE_MILESTONES.find(m => !m.demonstrated);

    return (
      <div className="space-y-6">
        {/* Top Welcome & Philosophy Strip */}
        <div className={`${cardClass} p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4`}>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <Badge variant="neutral">{profile.field}</Badge>
              <Badge variant="info">{diagnosticResult.recommendedLevel}</Badge>
              <Badge variant="success">{profile.streakDays}-Day Streak</Badge>
              <Badge variant="neutral">Buddy: {pairingState.partnerName}</Badge>
            </div>
            <h1 className={`text-2xl font-semibold tracking-tight ${textPrimary}`}>
              Welcome back, {profile.fullName}
            </h1>
            <p className={`text-xs font-medium tracking-wider mt-1 ${textSecondary}`}>
              LEARN → PRACTISE → BUILD → COLLABORATE → REVIEW → GROW
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <button onClick={() => setActiveTab('quizzes')} className={btnPrimary}>
              <ClipboardCheck className="w-4 h-4" /> Take Adaptive Quiz
            </button>
            <button onClick={() => setActiveTab('pairing-help')} className={btnSecondary}>
              <LifeBuoy className="w-4 h-4" /> I’m Stuck ({openBlockers.length})
            </button>
            <button onClick={() => setActiveTab('ai-mentor')} className={btnSecondary}>
              <Bot className="w-4 h-4" /> AI Mentor
            </button>
          </div>
        </div>

        {/* 4 Core Growth Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`${cardClass} p-5`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-medium uppercase tracking-wider ${textSecondary}`}>Course Progress</span>
              <BookOpen className={`w-4 h-4 ${textSecondary}`} />
            </div>
            <div className={`text-2xl font-semibold mt-2 ${textPrimary}`}>{overallCourseProgress}%</div>
            <p className={`text-xs mt-1 ${textSecondary}`}>{courses.length} custom courses • {dailyLogs.length} daily logs</p>
            <div className="mt-3"><ProgressBar value={overallCourseProgress} /></div>
          </div>

          <div className={`${cardClass} p-5`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-medium uppercase tracking-wider ${textSecondary}`}>Quiz Mastery</span>
              <ClipboardCheck className={`w-4 h-4 ${textSecondary}`} />
            </div>
            <div className={`text-2xl font-semibold mt-2 ${textPrimary}`}>
              {latestAttempt ? `${latestAttempt.percentage}%` : 'Ready'}
            </div>
            <p className={`text-xs mt-1 ${textSecondary}`}>{quizAttempts.length} assessments completed</p>
            <div className="mt-3"><ProgressBar value={latestAttempt?.percentage || 0} /></div>
          </div>

          <div className={`${cardClass} p-5`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-medium uppercase tracking-wider ${textSecondary}`}>Roadmap & Git Level</span>
              <GitBranch className={`w-4 h-4 ${textSecondary}`} />
            </div>
            <div className={`text-2xl font-semibold mt-2 ${textPrimary}`}>
              {roadmapPct}% • L{gitLevels.filter(g => g.completed).length}
            </div>
            <p className={`text-xs mt-1 ${textSecondary}`}>{selectedRoadmap.title}</p>
            <div className="mt-3"><ProgressBar value={roadmapPct} /></div>
          </div>

          <div className={`${cardClass} p-5`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-medium uppercase tracking-wider ${textSecondary}`}>Verified Milestones</span>
              <Award className={`w-4 h-4 ${textSecondary}`} />
            </div>
            <div className={`text-2xl font-semibold mt-2 ${textPrimary}`}>
              {MEASURABLE_MILESTONES.filter(m => m.demonstrated).length}/{MEASURABLE_MILESTONES.length}
            </div>
            <p className={`text-xs mt-1 truncate ${textSecondary}`}>Next: {nextMilestone?.title || 'All Achieved'}</p>
            <div className="mt-3">
              <button onClick={() => setActiveTab('progress')} className={`text-xs font-medium underline cursor-pointer ${textPrimary}`}>
                View Readiness Profile →
              </button>
            </div>
          </div>
        </div>

        {/* Continue Where You Left Off + Weak Topics & Action Queue */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={`${cardClass} p-6 flex flex-col justify-between space-y-4`}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-semibold uppercase tracking-wider ${textSecondary}`}>
                  Continue Where You Left Off & Today’s Goal
                </span>
                <Badge variant="neutral">Last active {latestCourse?.lastStudied || 'Today'}</Badge>
              </div>
              {latestCourse && (
                <div className={`p-4 rounded-xl border ${borderClass} ${subtleBgClass}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className={`text-xs font-medium ${textSecondary}`}>{latestCourse.platform}</span>
                      <h3 className={`text-base font-semibold mt-0.5 ${textPrimary}`}>{latestCourse.title}</h3>
                      <p className={`text-xs mt-1.5 ${textSecondary}`}>
                        Studying: <strong className={textPrimary}>{latestCourse.currentTopic}</strong>
                      </p>
                    </div>
                    <span className={`text-sm font-semibold ${textPrimary}`}>{latestCourse.progress}%</span>
                  </div>
                  <div className="mt-3"><ProgressBar value={latestCourse.progress} /></div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                    <span className={`text-xs ${textSecondary}`}>Goal: {latestCourse.weeklyTarget}</span>
                    <button onClick={() => setActiveTab('courses')} className={btnPrimary}>
                      Log Study & Resume <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-4">
                <div className={`text-xs font-semibold uppercase tracking-wider mb-2 ${textSecondary}`}>
                  Weak Topics Flagged for Revision
                </div>
                {weakTopicsList.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {weakTopicsList.map((wt, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveTab('quizzes')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300 cursor-pointer"
                      >
                        <AlertCircle className="w-3.5 h-3.5" /> {wt} — Practice Quiz →
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className={`text-xs ${textSecondary}`}>No weak topics flagged.</p>
                )}
              </div>
            </div>
          </div>

          <div className={`${cardClass} p-6 flex flex-col justify-between space-y-4`}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span className={`text-xs font-semibold uppercase tracking-wider ${textSecondary}`}>
                    Recommended Next Steps & Upcoming Session
                  </span>
                </div>
              </div>
              <div className="space-y-2.5">
                {[
                  `Retake the 1 missed question on "${quizAttempts[0]?.weakTopics[0] || 'JavaScript Event Loop'}" to solidify microtask queue mastery.`,
                  `Complete your Thursday pair sprint with ${pairingState.partnerName} on OpenPulse Command Palette.`,
                  `Review 1 teammate Pull Request on OpenPulse to unlock Git Collaboration Level 4.`
                ].map((step, idx) => (
                  <div key={idx} className={`p-3 rounded-lg border ${borderClass} ${subtleBgClass} flex items-start gap-3`}>
                    <div className={`w-5 h-5 rounded-full border ${borderClass} flex items-center justify-center text-[11px] font-semibold shrink-0 mt-0.5 ${textPrimary}`}>
                      {idx + 1}
                    </div>
                    <p className={`text-xs leading-relaxed ${textPrimary}`}>{step}</p>
                  </div>
                ))}
              </div>

              {presentations[0] && (
                <div className={`mt-4 p-3.5 rounded-xl border ${borderClass} flex items-center justify-between gap-3`}>
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="info">Upcoming Demo</Badge>
                      <span className={`text-xs ${textSecondary}`}>{presentations[0].dateTime}</span>
                    </div>
                    <h4 className={`text-xs font-semibold mt-1 ${textPrimary}`}>{presentations[0].title}</h4>
                  </div>
                  <button onClick={() => setActiveTab('community')} className={btnSecondary}>Details</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // 2. COURSE & ROADMAP INTELLIGENCE ENGINE
  // ============================================================================
  const renderMyLearningEngine = () => {
    const activeCourse = courses[0];
    const covered = selectedRoadmap.topics.filter(t => roadmapProgress[t.id]?.status === 'Completed');
    const inProgress = selectedRoadmap.topics.filter(t => roadmapProgress[t.id]?.status === 'Currently Learning');
    const gaps = selectedRoadmap.topics.filter(t => !roadmapProgress[t.id] || roadmapProgress[t.id]?.status === 'Not Started');

    return (
      <div className="space-y-6">
        <div className={`${cardClass} p-6`}>
          <Badge variant="info">Course & Roadmap Intelligence Engine</Badge>
          <h1 className={`text-2xl font-semibold mt-2 ${textPrimary}`}>Syllabus-to-Roadmap Gap Analysis</h1>
          <p className={`text-sm mt-1 ${textSecondary}`}>
            Compares your active course (<strong>{activeCourse?.title}</strong>) against <strong>{selectedRoadmap.title}</strong> to distinguish passive video watching from demonstrated skill mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className={`${cardClass} p-5 space-y-3`}>
            <div className="flex items-center justify-between">
              <h3 className={`text-sm font-semibold ${textPrimary}`}>1. Roadmap Topics Covered</h3>
              <Badge variant="success">{covered.length} Verified</Badge>
            </div>
            <div className="space-y-2">
              {covered.map(t => (
                <div key={t.id} className={`p-2.5 rounded-lg border ${borderClass} ${subtleBgClass} text-xs ${textPrimary}`}>
                  ✓ {t.name}
                </div>
              ))}
            </div>
          </div>

          <div className={`${cardClass} p-5 space-y-3`}>
            <div className="flex items-center justify-between">
              <h3 className={`text-sm font-semibold ${textPrimary}`}>2. Currently Building</h3>
              <Badge variant="info">{inProgress.length} Active</Badge>
            </div>
            <div className="space-y-2">
              {inProgress.map(t => (
                <div key={t.id} className={`p-2.5 rounded-lg border ${borderClass} ${subtleBgClass} text-xs space-y-1`}>
                  <div className={`font-medium ${textPrimary}`}>{t.name}</div>
                  <div className={textSecondary}>{roadmapProgress[t.id]?.notes}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={`${cardClass} p-5 space-y-3`}>
            <div className="flex items-center justify-between">
              <h3 className={`text-sm font-semibold ${textPrimary}`}>3. Syllabus Blind Spots</h3>
              <Badge variant="warning">{gaps.length} Gaps</Badge>
            </div>
            <p className={`text-xs ${textSecondary}`}>Topics required by your roadmap that need dedicated practice:</p>
            <div className="space-y-2">
              {gaps.map(t => (
                <div key={t.id} className={`p-2.5 rounded-lg border ${borderClass} ${subtleBgClass} text-xs flex items-center justify-between gap-2`}>
                  <span className={textPrimary}>{t.name}</span>
                  <button
                    onClick={() => {
                      setQuizGeneratorContext({ courseId: activeCourse?.id || 'course-1', topic: t.name, difficulty: 'Intermediate' });
                      setActiveTab('quizzes');
                    }}
                    className="underline font-medium shrink-0 cursor-pointer"
                  >
                    Quiz →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // 3. COURSES & DAILY PRACTICAL SUBMISSIONS
  // ============================================================================
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [newCourseForm, setNewCourseForm] = useState({
    title: '',
    platform: 'Udemy',
    customPlatform: '',
    url: '',
    instructor: '',
    field: 'Frontend Development',
    skillLevel: 'Beginner',
    goals: '',
    targetDate: '2026-12-30',
    modulesText: 'Module 1: Core Foundations\nModule 2: Practical Implementation\nModule 3: Capstone Build'
  });

  const handleRegisterCourse = (e) => {
    e.preventDefault();
    if (!newCourseForm.title.trim()) return;
    const modules = newCourseForm.modulesText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)
      .map((title, i) => ({ id: `mod-${Date.now()}-${i}`, title, completed: false }));

    const created = {
      id: `course-${Date.now()}`,
      title: newCourseForm.title.trim(),
      platform: newCourseForm.platform === 'Other' && newCourseForm.customPlatform.trim()
        ? newCourseForm.customPlatform.trim()
        : newCourseForm.platform,
      url: newCourseForm.url.trim() || 'https://developer.mozilla.org',
      instructor: newCourseForm.instructor.trim() || 'Self-Paced',
      field: newCourseForm.field,
      skillLevel: newCourseForm.skillLevel,
      goals: newCourseForm.goals.trim() || 'Master fundamentals and apply in real projects.',
      targetDate: newCourseForm.targetDate,
      progress: 0,
      currentTopic: modules[0]?.title || 'Getting Started',
      weeklyTarget: 'Complete first module and log daily build',
      lastStudied: 'Just added',
      notes: '',
      modules: modules.length ? modules : [{ id: `mod-${Date.now()}`, title: 'Module 1: Overview', completed: false }]
    };

    setCourses([created, ...courses]);
    setShowAddCourseModal(false);
    setNewCourseForm({
      title: '', platform: 'Udemy', customPlatform: '', url: '', instructor: '',
      field: 'Frontend Development', skillLevel: 'Beginner', goals: '', targetDate: '2026-12-30',
      modulesText: 'Module 1: Core Foundations\nModule 2: Practical Implementation\nModule 3: Capstone Build'
    });
    notify(`Registered custom course: ${created.title}`);
  };

  const toggleCourseModule = (courseId, moduleId) => {
    setCourses(courses.map(c => {
      if (c.id !== courseId) return c;
      const nextModules = c.modules.map(m => m.id === moduleId ? { ...m, completed: !m.completed } : m);
      const completedCount = nextModules.filter(m => m.completed).length;
      const nextProgress = Math.round((completedCount / nextModules.length) * 100);
      const nextCurrent = nextModules.find(m => !m.completed)?.title || 'All Modules Completed';
      return { ...c, modules: nextModules, progress: nextProgress, currentTopic: nextCurrent, lastStudied: 'Today' };
    }));
  };

  const renderCoursesView = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-semibold ${textPrimary}`}>Personalized Course Management & Daily Logs</h1>
          <p className={`text-sm mt-1 ${textSecondary}`}>
            Register courses from any platform, track syllabus modules, launch module quizzes, and log daily practical code.
          </p>
        </div>
        <button onClick={() => setShowAddCourseModal(true)} className={btnPrimary}>
          <Plus className="w-4 h-4" /> Register Custom Course
        </button>
      </div>

      {/* Daily Practical Coding Submission Strip */}
      <div className={`${cardClass} p-5`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
          <div>
            <Badge variant="info">Learning → Building Pipeline</Badge>
            <h3 className={`text-base font-semibold mt-1 ${textPrimary}`}>Daily Practical Coding Submission</h3>
          </div>
          <span className={`text-xs ${textSecondary}`}>Feeds directly into your Sunday Report & Readiness Evidence</span>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target;
            const summary = form.summary.value.trim();
            const repoLink = form.repoLink.value.trim();
            if (!summary) return;
            const entry = {
              id: `dl-${Date.now()}`,
              date: 'Today',
              module: courses[0]?.currentTopic || 'Self-Directed Study',
              summary,
              repoLink
            };
            setDailyLogs([entry, ...dailyLogs]);
            form.reset();
            notify('Daily practical coding log recorded!');
          }}
          className="grid grid-cols-1 md:grid-cols-12 gap-3"
        >
          <input
            name="summary"
            type="text"
            required
            placeholder="What did you code, test, or debug today after studying your lesson?"
            className={`${inputClass} md:col-span-6`}
          />
          <input
            name="repoLink"
            type="url"
            placeholder="GitHub commit / gist / sandbox URL (optional)"
            className={`${inputClass} md:col-span-4`}
          />
          <button type="submit" className={`${btnPrimary} md:col-span-2`}>Log Build</button>
        </form>
        {dailyLogs.length > 0 && (
          <div className="mt-3 space-y-1.5">
            {dailyLogs.slice(0, 3).map(dl => (
              <div key={dl.id} className={`text-xs px-3 py-2 rounded-lg ${subtleBgClass} border ${borderClass} flex flex-wrap items-center justify-between gap-2`}>
                <span className={textPrimary}><strong>{dl.date} ({dl.module}):</strong> {dl.summary}</span>
                {dl.repoLink && (
                  <a href={dl.repoLink} target="_blank" rel="noopener noreferrer" className="underline font-medium">
                    Evidence Link →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Course Cards */}
      <div className="space-y-5">
        {courses.map(course => (
          <div key={course.id} className={`${cardClass} p-6`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="neutral">{course.platform}</Badge>
                  <Badge variant="info">{course.skillLevel}</Badge>
                  <span className={`text-xs ${textSecondary}`}>Target: {course.targetDate}</span>
                </div>
                <h2 className={`text-lg font-semibold ${textPrimary}`}>{course.title}</h2>
                <p className={`text-xs ${textSecondary}`}>Instructor: {course.instructor} • Field: {course.field}</p>
                <p className={`text-xs leading-relaxed ${textSecondary}`}>{course.goals}</p>

                <div className="pt-1">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className={textSecondary}>Overall Completion</span>
                    <span className={`font-semibold ${textPrimary}`}>{course.progress}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={course.progress}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setCourses(courses.map(c => c.id === course.id ? { ...c, progress: val, lastStudied: 'Today' } : c));
                    }}
                    className="w-full accent-[#111111] dark:accent-white cursor-pointer"
                  />
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-1 ${textSecondary}`}>Personal Study Notes</label>
                  <textarea
                    rows={2}
                    value={course.notes}
                    onChange={e => setCourses(courses.map(c => c.id === course.id ? { ...c, notes: e.target.value } : c))}
                    placeholder="Key mental models, edge cases, or commands..."
                    className={inputClass}
                  />
                </div>

                <a href={course.url} target="_blank" rel="noopener noreferrer" className={btnSecondary}>
                  Open Course Provider <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="lg:col-span-7">
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`text-sm font-semibold ${textPrimary}`}>
                    Syllabus Modules ({course.modules.filter(m => m.completed).length}/{course.modules.length} Completed)
                  </h3>
                  <span className={`text-xs ${textSecondary}`}>Toggle completion or generate module quiz</span>
                </div>
                <div className="space-y-2">
                  {course.modules.map(mod => (
                    <div
                      key={mod.id}
                      className={`p-3 rounded-lg border ${borderClass} ${subtleBgClass} flex flex-wrap items-center justify-between gap-3`}
                    >
                      <button
                        onClick={() => toggleCourseModule(course.id, mod.id)}
                        className="flex items-center gap-3 text-left flex-1 cursor-pointer"
                      >
                        {mod.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Circle className={`w-4 h-4 shrink-0 ${textSecondary}`} />
                        )}
                        <span className={`text-sm ${mod.completed ? 'line-through opacity-60' : ''} ${textPrimary}`}>
                          {mod.title}
                        </span>
                      </button>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setQuizGeneratorContext({ courseId: course.id, topic: mod.title, difficulty: course.skillLevel });
                            setActiveTab('quizzes');
                          }}
                          className={`text-xs px-2.5 py-1 rounded-md border ${borderClass} hover:opacity-80 cursor-pointer ${textPrimary}`}
                        >
                          Quiz Module
                        </button>
                        <Badge variant={mod.completed ? 'success' : 'neutral'}>
                          {mod.completed ? 'Done' : 'Pending'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Course Modal */}
      {showAddCourseModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`${cardClass} w-full max-w-xl p-6 max-h-[90vh] overflow-y-auto space-y-4`}>
            <div className="flex items-center justify-between pb-3 border-b border-[#D8D8E2] dark:border-[#34343F]">
              <h3 className={`text-lg font-semibold ${textPrimary}`}>Register Custom Course</h3>
              <button onClick={() => setShowAddCourseModal(false)} className="cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleRegisterCourse} className="space-y-3.5">
              <div>
                <label className={`block text-xs font-medium mb-1 ${textSecondary}`}>Course Title *</label>
                <input type="text" required value={newCourseForm.title} onChange={e => setNewCourseForm({ ...newCourseForm, title: e.target.value })} placeholder="e.g., Full-Stack Next.js & PostgreSQL" className={inputClass} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${textSecondary}`}>Learning Platform</label>
                  <select value={newCourseForm.platform} onChange={e => setNewCourseForm({ ...newCourseForm, platform: e.target.value })} className={inputClass}>
                    <option value="Udemy">Udemy</option>
                    <option value="Coursera">Coursera</option>
                    <option value="YouTube">YouTube</option>
                    <option value="freeCodeCamp">freeCodeCamp</option>
                    <option value="Codecademy">Codecademy</option>
                    <option value="edX">edX</option>
                    <option value="The Odin Project">The Odin Project</option>
                    <option value="Other">Other (Custom Platform)</option>
                  </select>
                </div>
                {newCourseForm.platform === 'Other' ? (
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${textSecondary}`}>Custom Platform Name</label>
                    <input type="text" value={newCourseForm.customPlatform} onChange={e => setNewCourseForm({ ...newCourseForm, customPlatform: e.target.value })} placeholder="e.g., Frontend Masters" className={inputClass} />
                  </div>
                ) : (
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${textSecondary}`}>Instructor (Optional)</label>
                    <input type="text" value={newCourseForm.instructor} onChange={e => setNewCourseForm({ ...newCourseForm, instructor: e.target.value })} className={inputClass} />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${textSecondary}`}>Course URL</label>
                  <input type="url" value={newCourseForm.url} onChange={e => setNewCourseForm({ ...newCourseForm, url: e.target.value })} placeholder="https://..." className={inputClass} />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${textSecondary}`}>Target Completion Date</label>
                  <input type="date" value={newCourseForm.targetDate} onChange={e => setNewCourseForm({ ...newCourseForm, targetDate: e.target.value })} className={inputClass} />
                </div>
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${textSecondary}`}>Learning Goals</label>
                <input type="text" value={newCourseForm.goals} onChange={e => setNewCourseForm({ ...newCourseForm, goals: e.target.value })} placeholder="What do you want to build after this course?" className={inputClass} />
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${textSecondary}`}>Syllabus Modules (One per line)</label>
                <textarea rows={3} value={newCourseForm.modulesText} onChange={e => setNewCourseForm({ ...newCourseForm, modulesText: e.target.value })} className={inputClass} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddCourseModal(false)} className={btnSecondary}>Cancel</button>
                <button type="submit" className={btnPrimary}>Save Course</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  // ============================================================================
  // 4. AI-POWERED QUIZ & ASSESSMENT SYSTEM + DIAGNOSTIC PLACEMENT
  // ============================================================================
  const [quizGeneratorContext, setQuizGeneratorContext] = useState({
    courseId: INITIAL_COURSES[0].id,
    topic: INITIAL_COURSES[0].currentTopic,
    difficulty: 'Intermediate'
  });
  const [activeQuizSession, setActiveQuizSession] = useState(null);
  const [showDiagnosticModal, setShowDiagnosticModal] = useState(false);
  const [diagAnswers, setDiagAnswers] = useState({
    experience: '6–12 months',
    q1: 'AbortController & Effect Cleanup',
    codeTask: ''
  });

  useEffect(() => {
    if (!activeQuizSession || !activeQuizSession.timed || activeQuizSession.result || activeQuizSession.secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setActiveQuizSession(prev => {
        if (!prev || prev.result) return prev;
        if (prev.secondsLeft <= 1) {
          clearInterval(timer);
          return { ...prev, secondsLeft: 0 };
        }
        return { ...prev, secondsLeft: prev.secondsLeft - 1 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [activeQuizSession?.timed, activeQuizSession?.result]);

  const startQuizSession = (quiz, timed = false, onlyQuestionIds = null) => {
    const filteredQuestions = onlyQuestionIds
      ? quiz.questions.filter(q => onlyQuestionIds.includes(q.id))
      : quiz.questions;
    setActiveQuizSession({
      quiz: { ...quiz, questions: filteredQuestions.length ? filteredQuestions : quiz.questions },
      currentIdx: 0,
      answers: {},
      flagged: {},
      timed,
      secondsLeft: (quiz.durationMinutes || 10) * 60,
      reviewing: false,
      result: null
    });
  };

  const handleGenerateContextualQuiz = () => {
    const course = courses.find(c => c.id === quizGeneratorContext.courseId) || courses[0];
    const topicName = quizGeneratorContext.topic.trim() || course?.currentTopic || 'Core Engineering';
    const newQuiz = {
      id: `quiz-${Date.now()}`,
      title: `${topicName} — Targeted Verification Quiz`,
      courseId: course?.id || 'course-1',
      topic: topicName,
      field: profile.field,
      difficulty: quizGeneratorContext.difficulty,
      mandatory: false,
      deadline: 'Self-Paced',
      durationMinutes: 8,
      questions: [
        {
          id: `gq-${Date.now()}-1`,
          type: 'mcq',
          topic: topicName,
          prompt: `When implementing "${topicName}" in ${profile.field}, which engineering practice prevents subtle state and concurrency bugs?`,
          code: `// Context: ${course?.title}\n// Module: ${topicName}`,
          options: [
            'Isolate side effects, clean up subscriptions/timers on unmount, and test boundary inputs',
            'Synchronize derived values using multiple chained useEffect hooks',
            'Skip error boundaries and rely on happy-path manual testing',
            'Mutate shared objects directly across sibling components'
          ],
          answer: 'Isolate side effects, clean up subscriptions/timers on unmount, and test boundary inputs',
          explanation: 'Clean lifecycle management and boundary testing prevent stale state and memory leaks.'
        },
        {
          id: `gq-${Date.now()}-2`,
          type: 'find_error',
          topic: `${topicName} — Debugging`,
          prompt: 'Spot the flaw in this asynchronous state update pattern:',
          code: `async function loadItems() {\n  const res = await fetch('/api/items');\n  setItems(res.json());\n}`,
          options: [
            '`res.json()` returns a Promise and must be awaited (`await res.json()`)',
            '`fetch` must be wrapped in `new Promise()`',
            '`setItems` cannot be called inside an `async` function',
            'HTTP GET requests require a JSON body'
          ],
          answer: '`res.json()` returns a Promise and must be awaited (`await res.json()`)',
          explanation: 'Passing an unresolved Promise into `setItems` sets state to a Promise object rather than the parsed array.'
        },
        {
          id: `gq-${Date.now()}-3`,
          type: 'true_false',
          topic: `${topicName} — Verification`,
          prompt: 'True or False: Scoring 100% on a conceptual quiz eliminates the need to write tests or build a practical exercise for that topic.',
          code: '',
          options: ['True', 'False'],
          answer: 'False',
          explanation: 'Quizzes assess conceptual understanding; practical coding exercises and tests prove real implementation fluency.'
        }
      ]
    };

    setQuizzes([newQuiz, ...quizzes]);
    notify(`Generated tailored ${quizGeneratorContext.difficulty} quiz on "${topicName}"!`);
  };

  const submitQuizAttempt = () => {
    if (!activeQuizSession) return;
    const { quiz, answers } = activeQuizSession;
    let score = 0;
    const weakTopics = [];
    const strongTopics = [];
    const missedQuestionIds = [];

    quiz.questions.forEach(q => {
      const userAns = (answers[q.id] || '').trim().toLowerCase();
      const expected = (q.answer || '').trim().toLowerCase();
      const isCorrect = userAns === expected;
      if (isCorrect) {
        score += 1;
        if (!strongTopics.includes(q.topic)) strongTopics.push(q.topic);
      } else {
        missedQuestionIds.push(q.id);
        if (!weakTopics.includes(q.topic)) weakTopics.push(q.topic);
      }
    });

    const percentage = Math.round((score / quiz.questions.length) * 100);
    const attemptRecord = {
      id: `att-${Date.now()}`,
      quizId: quiz.id,
      quizTitle: quiz.title,
      date: 'Today',
      score,
      total: quiz.questions.length,
      percentage,
      weakTopics,
      strongTopics,
      missedQuestionIds
    };

    setQuizAttempts([attemptRecord, ...quizAttempts]);
    setActiveQuizSession({ ...activeQuizSession, reviewing: false, result: attemptRecord });
    notify(`Assessment graded: ${percentage}% (${score}/${quiz.questions.length})`);
  };

  const renderQuizzesAndDiagnosticView = () => {
    if (activeQuizSession) {
      const { quiz, currentIdx, answers, flagged, timed, secondsLeft, reviewing, result } = activeQuizSession;
      const currentQ = quiz.questions[currentIdx];

      if (result) {
        return (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className={`${cardClass} p-6`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#D8D8E2] dark:border-[#34343F]">
                <div>
                  <Badge variant={result.percentage >= 75 ? 'success' : 'warning'}>Assessment Completed</Badge>
                  <h1 className={`text-2xl font-semibold mt-2 ${textPrimary}`}>{quiz.title}</h1>
                  <p className={`text-sm mt-1 ${textSecondary}`}>
                    Score: <strong>{result.score} / {result.total} ({result.percentage}%)</strong>
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.missedQuestionIds.length > 0 && (
                    <button onClick={() => startQuizSession(quiz, false, result.missedQuestionIds)} className={btnPrimary}>
                      <Repeat className="w-4 h-4" /> Retake Missed Questions ({result.missedQuestionIds.length})
                    </button>
                  )}
                  <button onClick={() => setActiveQuizSession(null)} className={btnSecondary}>
                    Back to Assessments
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                <div className={`p-4 rounded-xl border ${borderClass} ${subtleBgClass}`}>
                  <div className={`text-xs font-semibold uppercase ${textSecondary}`}>Topics Understood</div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {result.strongTopics.length
                      ? result.strongTopics.map(t => <Badge key={t} variant="success">{t}</Badge>)
                      : <span className={`text-xs ${textSecondary}`}>Review explanations below</span>}
                  </div>
                </div>
                <div className={`p-4 rounded-xl border ${borderClass} ${subtleBgClass}`}>
                  <div className={`text-xs font-semibold uppercase ${textSecondary}`}>Topics Requiring Revision</div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {result.weakTopics.length
                      ? result.weakTopics.map(t => <Badge key={t} variant="danger">{t}</Badge>)
                      : <Badge variant="success">None — Solid Mastery!</Badge>}
                  </div>
                </div>
              </div>

              <div className="space-y-4 mt-6">
                <h3 className={`text-base font-semibold ${textPrimary}`}>Detailed Answer Explanations</h3>
                {quiz.questions.map((q, idx) => {
                  const userAns = answers[q.id] || '(No answer submitted)';
                  const correct = userAns.trim().toLowerCase() === q.answer.trim().toLowerCase();
                  return (
                    <div key={q.id} className={`p-4 rounded-xl border ${borderClass} ${subtleBgClass} space-y-2`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-semibold ${textPrimary}`}>Q{idx + 1} • {q.topic}</span>
                        <Badge variant={correct ? 'success' : 'danger'}>{correct ? 'Correct' : 'Needs Review'}</Badge>
                      </div>
                      <p className={`text-sm font-medium ${textPrimary}`}>{q.prompt}</p>
                      {q.code && (
                        <pre className={`p-3 rounded-lg text-xs font-mono overflow-x-auto border ${borderClass} ${darkMode ? 'bg-[#0D0D0D]' : 'bg-white'} ${textPrimary}`}>
                          {q.code}
                        </pre>
                      )}
                      <div className="text-xs space-y-1">
                        <div><span className={textSecondary}>Your Answer:</span> <strong className={textPrimary}>{userAns}</strong></div>
                        {!correct && <div><span className={textSecondary}>Expected Answer:</span> <strong className="text-emerald-600">{q.answer}</strong></div>}
                        <p className={`pt-1 ${textSecondary}`}><strong>Explanation:</strong> {q.explanation}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className={`${cardClass} p-6 space-y-5`}>
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#D8D8E2] dark:border-[#34343F]">
              <div>
                <Badge variant="info">{quiz.difficulty} • {quiz.topic}</Badge>
                <h2 className={`text-lg font-semibold mt-1 ${textPrimary}`}>{quiz.title}</h2>
              </div>
              <div className="flex items-center gap-3">
                {timed && (
                  <Badge variant={secondsLeft < 60 ? 'danger' : 'warning'}>
                    <Clock className="w-3.5 h-3.5" /> {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')}
                  </Badge>
                )}
                <button onClick={() => setActiveQuizSession(null)} className={btnSecondary}>Exit</button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {quiz.questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setActiveQuizSession({ ...activeQuizSession, reviewing: false, currentIdx: idx })}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                    currentIdx === idx && !reviewing
                      ? (darkMode ? 'bg-white text-black border-white' : 'bg-[#111111] text-white border-[#111111]')
                      : flagged[q.id]
                        ? 'border-amber-500 text-amber-600'
                        : answers[q.id]
                          ? 'border-emerald-500/50 bg-emerald-500/10'
                          : `${borderClass} ${textSecondary}`
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => setActiveQuizSession({ ...activeQuizSession, reviewing: true })}
                className={`ml-auto text-xs font-medium underline cursor-pointer ${textPrimary}`}
              >
                Review Before Submit ({Object.keys(answers).length}/{quiz.questions.length} Answered)
              </button>
            </div>

            {reviewing ? (
              <div className="space-y-4 py-2">
                <h3 className={`text-base font-semibold ${textPrimary}`}>Review Answers Before Submission</h3>
                <div className="space-y-2">
                  {quiz.questions.map((q, idx) => (
                    <div key={q.id} className={`p-3 rounded-lg border ${borderClass} ${subtleBgClass} flex items-center justify-between text-xs`}>
                      <div>
                        <strong className={textPrimary}>Question {idx + 1}:</strong>{' '}
                        <span className={textSecondary}>{answers[q.id] || 'Unanswered'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {flagged[q.id] && <Badge variant="warning">Flagged</Badge>}
                        <button
                          onClick={() => setActiveQuizSession({ ...activeQuizSession, reviewing: false, currentIdx: idx })}
                          className="underline font-medium cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-3 pt-3">
                  <button onClick={() => setActiveQuizSession({ ...activeQuizSession, reviewing: false })} className={btnSecondary}>
                    Continue Editing
                  </button>
                  <button onClick={submitQuizAttempt} className={btnPrimary}>
                    Submit Quiz for Grading
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium ${textSecondary}`}>
                    Question {currentIdx + 1} of {quiz.questions.length} ({currentQ.type.replace('_', ' ')})
                  </span>
                  <button
                    onClick={() => setActiveQuizSession({
                      ...activeQuizSession,
                      flagged: { ...flagged, [currentQ.id]: !flagged[currentQ.id] }
                    })}
                    className={`text-xs inline-flex items-center gap-1 cursor-pointer ${flagged[currentQ.id] ? 'text-amber-600 font-semibold' : textSecondary}`}
                  >
                    <Flag className="w-3.5 h-3.5" /> {flagged[currentQ.id] ? 'Flagged' : 'Flag Question'}
                  </button>
                </div>

                <h3 className={`text-base font-semibold leading-relaxed ${textPrimary}`}>{currentQ.prompt}</h3>

                {currentQ.code && (
                  <pre className={`p-4 rounded-xl text-xs font-mono overflow-x-auto border ${borderClass} ${subtleBgClass} ${textPrimary}`}>
                    {currentQ.code}
                  </pre>
                )}

                {currentQ.options && currentQ.options.length > 0 ? (
                  <div className="space-y-2.5">
                    {currentQ.options.map((opt, i) => {
                      const selected = answers[currentQ.id] === opt;
                      return (
                        <button
                          key={i}
                          onClick={() => setActiveQuizSession({
                            ...activeQuizSession,
                            answers: { ...answers, [currentQ.id]: opt }
                          })}
                          className={`w-full text-left p-3.5 rounded-xl border text-sm transition cursor-pointer ${
                            selected
                              ? (darkMode ? 'bg-white text-black border-white font-medium' : 'bg-[#111111] text-white border-[#111111] font-medium')
                              : `${borderClass} ${subtleBgClass} ${textPrimary}`
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div>
                    <label className={`block text-xs font-medium mb-1.5 ${textSecondary}`}>
                      Enter your exact answer or code completion:
                    </label>
                    <input
                      type="text"
                      value={answers[currentQ.id] || ''}
                      onChange={e => setActiveQuizSession({
                        ...activeQuizSession,
                        answers: { ...answers, [currentQ.id]: e.target.value }
                      })}
                      placeholder="Type your answer..."
                      className={`${inputClass} font-mono`}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-[#D8D8E2] dark:border-[#34343F]">
                  <button
                    disabled={currentIdx === 0}
                    onClick={() => setActiveQuizSession({ ...activeQuizSession, currentIdx: currentIdx - 1 })}
                    className={btnSecondary}
                  >
                    Previous
                  </button>
                  {currentIdx < quiz.questions.length - 1 ? (
                    <button
                      onClick={() => setActiveQuizSession({ ...activeQuizSession, currentIdx: currentIdx + 1 })}
                      className={btnPrimary}
                    >
                      Next Question
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveQuizSession({ ...activeQuizSession, reviewing: true })}
                      className={btnPrimary}
                    >
                      Review & Submit
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className={`${cardClass} p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4`}>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="success">Diagnostic Placement: {diagnosticResult.recommendedLevel}</Badge>
              <Badge variant="neutral">{diagnosticResult.field}</Badge>
            </div>
            <h1 className={`text-2xl font-semibold mt-2 ${textPrimary}`}>Quizzes, Adaptive Assessments & Skill Placement</h1>
            <p className={`text-sm mt-1 max-w-2xl ${textSecondary}`}>
              Generate targeted assessments from your active courses and modules, practice missed questions, or retake your field placement diagnostic.
            </p>
          </div>
          <button onClick={() => setShowDiagnosticModal(true)} className={btnSecondary}>
            <Compass className="w-4 h-4" /> Retake Skill Diagnostic
          </button>
        </div>

        <div className={`${cardClass} p-6`}>
          <h2 className={`text-base font-semibold mb-1 ${textPrimary}`}>AI Context-Aware Quiz Generator</h2>
          <p className={`text-xs mb-4 ${textSecondary}`}>
            Generates questions directly tied to your registered course syllabus and current module.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <select
              value={quizGeneratorContext.courseId}
              onChange={e => {
                const c = courses.find(x => x.id === e.target.value);
                setQuizGeneratorContext({ ...quizGeneratorContext, courseId: e.target.value, topic: c?.currentTopic || '' });
              }}
              className={inputClass}
            >
              {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
            <input
              type="text"
              value={quizGeneratorContext.topic}
              onChange={e => setQuizGeneratorContext({ ...quizGeneratorContext, topic: e.target.value })}
              placeholder="Specific module or concept..."
              className={inputClass}
            />
            <select
              value={quizGeneratorContext.difficulty}
              onChange={e => setQuizGeneratorContext({ ...quizGeneratorContext, difficulty: e.target.value })}
              className={inputClass}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            <button onClick={handleGenerateContextualQuiz} className={btnPrimary}>
              <Sparkles className="w-4 h-4" /> Generate Quiz
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <h2 className={`text-base font-semibold ${textPrimary}`}>Assigned & Course-Linked Quizzes</h2>
            {quizzes.map(q => (
              <div key={q.id} className={`${cardClass} p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={q.mandatory ? 'warning' : 'neutral'}>{q.mandatory ? 'Mandatory' : 'Practice'}</Badge>
                    <Badge variant="info">{q.difficulty}</Badge>
                    <span className={`text-xs ${textSecondary}`}>{q.questions.length} Questions • Due {q.deadline}</span>
                  </div>
                  <h3 className={`text-base font-semibold ${textPrimary}`}>{q.title}</h3>
                  <p className={`text-xs ${textSecondary}`}>Topic: {q.topic}</p>
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  <button onClick={() => startQuizSession(q, false)} className={btnPrimary}>
                    Untimed Practice
                  </button>
                  <button onClick={() => startQuizSession(q, true)} className={btnSecondary}>
                    <Clock className="w-3.5 h-3.5" /> Timed ({q.durationMinutes}m)
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-5 space-y-4">
            <h2 className={`text-base font-semibold ${textPrimary}`}>Assessment History & Adaptive Review</h2>
            {quizAttempts.map(att => (
              <div key={att.id} className={`${cardClass} p-5 space-y-3`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${textSecondary}`}>{att.date}</span>
                  <Badge variant={att.percentage >= 75 ? 'success' : 'warning'}>{att.score}/{att.total} ({att.percentage}%)</Badge>
                </div>
                <h4 className={`text-sm font-semibold ${textPrimary}`}>{att.quizTitle}</h4>
                {att.weakTopics.length > 0 && (
                  <div className="text-xs text-amber-600 dark:text-amber-400">
                    Weak Topic Detected: <strong>{att.weakTopics.join(', ')}</strong>
                  </div>
                )}
                {att.missedQuestionIds?.length > 0 && (
                  <button
                    onClick={() => {
                      const targetQ = quizzes.find(x => x.id === att.quizId);
                      if (targetQ) startQuizSession(targetQ, false, att.missedQuestionIds);
                    }}
                    className={btnSecondary}
                  >
                    <Repeat className="w-3.5 h-3.5" /> Practice Missed Questions ({att.missedQuestionIds.length})
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {showDiagnosticModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className={`${cardClass} w-full max-w-xl p-6 space-y-4`}>
              <div className="flex items-center justify-between pb-3 border-b border-[#D8D8E2] dark:border-[#34343F]">
                <h3 className={`text-lg font-semibold ${textPrimary}`}>Field Skill Diagnostic & Placement</h3>
                <button onClick={() => setShowDiagnosticModal(false)} className="cursor-pointer"><X className="w-5 h-5" /></button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const level = diagAnswers.experience === '1+ years' ? 'Intermediate' : 'Intermediate Beginner';
                  setDiagnosticResult({
                    completed: true,
                    field: profile.field,
                    recommendedLevel: level,
                    strengths: ['Core Syntax & Git Basics', diagAnswers.q1],
                    weaknesses: ['Async Concurrency Edge Cases', 'Automated Testing'],
                    planSummary: `Calibrated for ${level} in ${profile.field}. Prioritize practical challenges and PR reviews.`
                  });
                  setShowDiagnosticModal(false);
                  notify(`Diagnostic complete! Recommended placement: ${level}`);
                }}
                className="space-y-4"
              >
                <div>
                  <label className={`block text-xs font-medium mb-1 ${textSecondary}`}>Prior Coding Experience in {profile.field}</label>
                  <select value={diagAnswers.experience} onChange={e => setDiagAnswers({ ...diagAnswers, experience: e.target.value })} className={inputClass}>
                    <option value="0–3 months">0–3 months (Foundational)</option>
                    <option value="6–12 months">6–12 months (Building basic apps)</option>
                    <option value="1+ years">1+ years (Comfortable with frameworks & APIs)</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${textSecondary}`}>Conceptual Check: How do you prevent race conditions in async UI fetches?</label>
                  <select value={diagAnswers.q1} onChange={e => setDiagAnswers({ ...diagAnswers, q1: e.target.value })} className={inputClass}>
                    <option value="AbortController & Effect Cleanup">AbortController & Effect Cleanup</option>
                    <option value="Debouncing alone">Debouncing alone</option>
                    <option value="Not sure yet">Not sure yet</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${textSecondary}`}>Practical Check: Write an arrow function returning even numbers from `arr`</label>
                  <input
                    type="text"
                    placeholder="const evens = arr => arr.filter(n => n % 2 === 0);"
                    value={diagAnswers.codeTask}
                    onChange={e => setDiagAnswers({ ...diagAnswers, codeTask: e.target.value })}
                    className={`${inputClass} font-mono`}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowDiagnosticModal(false)} className={btnSecondary}>Cancel</button>
                  <button type="submit" className={btnPrimary}>Calibrate Growth Plan</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ============================================================================
  // 5. ROADMAPS (ROADMAP.SH INTEGRATION + INDEPENDENT CHECKLIST)
  // ============================================================================
  const renderRoadmapsView = () => {
    const cycleStatus = (topicId) => {
      const order = ['Not Started', 'Currently Learning', 'Completed'];
      const curr = roadmapProgress[topicId]?.status || 'Not Started';
      const next = order[(order.indexOf(curr) + 1) % order.length];
      setRoadmapProgress({
        ...roadmapProgress,
        [topicId]: { ...(roadmapProgress[topicId] || { notes: '', struggling: false }), status: next }
      });
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className={`text-2xl font-semibold ${textPrimary}`}>Developer Roadmaps (Roadmap.sh Reference)</h1>
            <p className={`text-sm mt-1 ${textSecondary}`}>
              Explore official Roadmap.sh paths and maintain your independent skill checklist, notes, and struggle flags.
            </p>
          </div>
          <a href={selectedRoadmap.officialUrl} target="_blank" rel="noopener noreferrer" className={btnPrimary}>
            Open Official {selectedRoadmap.title} on Roadmap.sh <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Roadmap Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {ROADMAPS_CATALOG.map(rm => {
            const active = rm.id === selectedRoadmapId;
            return (
              <button
                key={rm.id}
                onClick={() => setSelectedRoadmapId(rm.id)}
                className={`p-4 rounded-xl border text-left transition cursor-pointer ${
                  active
                    ? (darkMode ? 'bg-white text-black border-white' : 'bg-[#111111] text-white border-[#111111]')
                    : `${cardClass} ${textPrimary}`
                }`}
              >
                <div className="text-[11px] opacity-75">{rm.field}</div>
                <div className="text-sm font-semibold mt-0.5">{rm.title}</div>
              </button>
            );
          })}
        </div>

        {/* Selected Roadmap Topics Checklist */}
        <div className={`${cardClass} p-6 space-y-4`}>
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#D8D8E2] dark:border-[#34343F]">
            <div>
              <h2 className={`text-lg font-semibold ${textPrimary}`}>{selectedRoadmap.title} — Personal Checklist</h2>
              <p className={`text-xs mt-1 ${textSecondary}`}>{selectedRoadmap.summary}</p>
            </div>
            <div className="text-right">
              <div className={`text-lg font-semibold ${textPrimary}`}>{roadmapPct}%</div>
              <div className={`text-xs ${textSecondary}`}>{roadmapCompletedCount}/{selectedRoadmap.topics.length} Topics</div>
            </div>
          </div>

          <div className="space-y-3">
            {selectedRoadmap.topics.map(topic => {
              const state = roadmapProgress[topic.id] || { status: 'Not Started', notes: '', struggling: false };
              return (
                <div key={topic.id} className={`p-4 rounded-xl border ${borderClass} ${subtleBgClass} space-y-2.5`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => cycleStatus(topic.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border cursor-pointer ${
                          state.status === 'Completed'
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                            : state.status === 'Currently Learning'
                              ? 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30'
                              : `${borderClass} ${textSecondary}`
                        }`}
                      >
                        {state.status} ↻
                      </button>
                      <span className={`text-sm font-semibold ${textPrimary}`}>{topic.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setRoadmapProgress({
                          ...roadmapProgress,
                          [topic.id]: { ...state, struggling: !state.struggling }
                        })}
                        className={`px-2.5 py-1 rounded-lg text-xs border cursor-pointer ${
                          state.struggling
                            ? 'border-amber-500 bg-amber-500/15 text-amber-700 dark:text-amber-300 font-medium'
                            : `${borderClass} ${textSecondary}`
                        }`}
                      >
                        {state.struggling ? '⚠ Flagged Struggling' : 'Flag Difficulty'}
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('ai-mentor');
                          handleSendMentorMessage(`Can you break down the roadmap topic "${topic.name}" step by step for my ${profile.skillLevel} level?`);
                        }}
                        className={btnSecondary}
                      >
                        Ask AI Mentor
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={state.notes}
                    onChange={e => setRoadmapProgress({
                      ...roadmapProgress,
                      [topic.id]: { ...state, notes: e.target.value }
                    })}
                    placeholder="Add personal study notes or key takeaways for this topic..."
                    className={inputClass}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // 6. AI PERSONAL LEARNING MENTOR (SOCRATIC CONTEXT-AWARE CHAT)
  // ============================================================================
  const renderAiMentorView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Context Sidebar */}
      <div className={`${cardClass} p-5 lg:col-span-4 space-y-4 h-fit`}>
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          <h2 className={`text-base font-semibold ${textPrimary}`}>Loaded Learner Context</h2>
        </div>
        <p className={`text-xs leading-relaxed ${textSecondary}`}>
          Your mentor uses your active profile, syllabus, quiz gaps, and struggle flags to guide you step-by-step without dumping copy-paste answers.
        </p>
        <div className={`p-3.5 rounded-xl border ${borderClass} ${subtleBgClass} space-y-2 text-xs`}>
          <div><span className={textSecondary}>Field & Level:</span> <strong className={textPrimary}>{profile.field} • {profile.skillLevel}</strong></div>
          <div><span className={textSecondary}>Active Course:</span> <strong className={textPrimary}>{courses[0]?.title}</strong></div>
          <div><span className={textSecondary}>Current Topic:</span> <strong className={textPrimary}>{courses[0]?.currentTopic}</strong></div>
          <div><span className={textSecondary}>Weak Topics:</span> <strong className="text-amber-600 dark:text-amber-400">{weakTopicsList.join(', ') || 'None'}</strong></div>
        </div>
        <div className="space-y-2">
          <div className={`text-xs font-semibold uppercase tracking-wider ${textSecondary}`}>Quick Socratic Prompts</div>
          {[
            'Quiz me on JavaScript Event Loop microtasks vs setTimeout',
            'Give me a hint on cleaning up AbortController in useEffect',
            'Help me debug focus restoration when a modal closes'
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMentorMessage(prompt)}
              className={`w-full text-left p-2.5 rounded-lg border ${borderClass} ${subtleBgClass} text-xs hover:opacity-80 cursor-pointer ${textPrimary}`}
            >
              “{prompt}”
            </button>
          ))}
        </div>
      </div>

      {/* Chat Interface */}
      <div className={`${cardClass} lg:col-span-8 flex flex-col h-[620px]`}>
        <div className={`p-4 border-b ${borderClass} flex items-center justify-between`}>
          <div>
            <h3 className={`text-sm font-semibold ${textPrimary}`}>Private AI Technical Mentor</h3>
            <span className={`text-xs ${textSecondary}`}>Socratic Guidance Mode • Private to {profile.fullName}</span>
          </div>
          <Badge variant="success">Context Synced</Badge>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {mentorMessages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed whitespace-pre-line ${
                  msg.sender === 'user'
                    ? ('bg-indigo-600 text-white')
                    : `${subtleBgClass} border ${borderClass} ${textPrimary}`
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMentorMessage();
          }}
          className={`p-4 border-t ${borderClass} flex gap-2`}
        >
          <input
            type="text"
            value={mentorInput}
            onChange={e => setMentorInput(e.target.value)}
            placeholder="Ask a conceptual question, paste a snippet you wrote, or request a hint..."
            className={inputClass}
          />
          <button type="submit" className={btnPrimary}>
            <Send className="w-4 h-4" /> Send
          </button>
        </form>
      </div>
    </div>
  );

  // ============================================================================
  // 7. TEAM PAIRING & "I'M STUCK" BLOCKER HELP DESK
  // ============================================================================
  const [newBlockerForm, setNewBlockerForm] = useState({
    goal: '',
    attempted: '',
    errorOrCode: '',
    helpNeeded: '',
    target: 'Assigned Mentor'
  });
  const [blockerReplyDrafts, setBlockerReplyDrafts] = useState({});

  const renderPairingAndHelpDeskView = () => {
    const techGroups = ['Frontend', 'Backend', 'AI/ML', 'Cybersecurity', 'UI/UX', 'Mobile', 'DevOps'];

    return (
      <div className="space-y-6">
        <div>
          <h1 className={`text-2xl font-semibold ${textPrimary}`}>Team Pairing, Technical Groups & “I’m Stuck” Help Desk</h1>
          <p className={`text-sm mt-1 ${textSecondary}`}>
            Collaborate with your assigned buddy, join cross-functional technical circles, and raise structured blocker requests.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className={`${cardClass} p-6 lg:col-span-6 space-y-4`}>
            <div className="flex items-center justify-between">
              <Badge variant="info">Active Buddy & Mentor Pairing</Badge>
              {role === 'admin' && (
                <button
                  onClick={() => {
                    const nextPartner = pairingState.partnerName === 'Tunde Bakare' ? 'Kwame Boateng' : 'Tunde Bakare';
                    setPairingState({ ...pairingState, partnerName: nextPartner });
                    notify(`Rotated learning partner to ${nextPartner}`);
                  }}
                  className={btnSecondary}
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Rotate Partner
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className={`p-3.5 rounded-xl border ${borderClass} ${subtleBgClass}`}>
                <span className={textSecondary}>Learning Partner</span>
                <div className={`text-sm font-semibold mt-1 ${textPrimary}`}>{pairingState.partnerName}</div>
                <div className={textSecondary}>{pairingState.partnerField}</div>
              </div>
              <div className={`p-3.5 rounded-xl border ${borderClass} ${subtleBgClass}`}>
                <span className={textSecondary}>Assigned Senior Mentor</span>
                <div className={`text-sm font-semibold mt-1 ${textPrimary}`}>{pairingState.assignedMentor}</div>
                <div className={textSecondary}>Code Review & Architecture</div>
              </div>
            </div>

            <div className={`p-3.5 rounded-xl border ${borderClass} text-xs space-y-1`}>
              <div className={`font-semibold ${textPrimary}`}>Assigned Pair Collaboration Exercise</div>
              <p className={textSecondary}>{pairingState.pairExercise}</p>
            </div>
          </div>

          <div className={`${cardClass} p-6 lg:col-span-6 space-y-4`}>
            <div>
              <Badge variant="neutral">Technical Interest Groups</Badge>
              <h3 className={`text-base font-semibold mt-1.5 ${textPrimary}`}>Explore Multiple Tracks Alongside Your Primary Field</h3>
              <p className={`text-xs mt-1 ${textSecondary}`}>Toggle groups to collaborate on cross-stack challenges.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {techGroups.map(grp => {
                const joined = pairingState.joinedGroups.includes(grp);
                return (
                  <button
                    key={grp}
                    onClick={() => {
                      const nextGroups = joined
                        ? pairingState.joinedGroups.filter(g => g !== grp)
                        : [...pairingState.joinedGroups, grp];
                      setPairingState({ ...pairingState, joinedGroups: nextGroups });
                    }}
                    className={`px-3.5 py-2 rounded-lg text-xs font-medium border transition cursor-pointer ${
                      joined
                        ? (darkMode ? 'bg-white text-black border-white' : 'bg-[#111111] text-white border-[#111111]')
                        : `${borderClass} ${textSecondary}`
                    }`}
                  >
                    {joined ? `✓ ${grp}` : `+ Join ${grp}`}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newBlockerForm.goal.trim() || !newBlockerForm.attempted.trim()) return;
              const created = {
                id: `help-${Date.now()}`,
                author: profile.fullName,
                field: profile.field,
                target: newBlockerForm.target,
                status: 'Open',
                createdAt: 'Just now',
                ...newBlockerForm,
                responses: []
              };
              setHelpRequests([created, ...helpRequests]);
              setNewBlockerForm({ goal: '', attempted: '', errorOrCode: '', helpNeeded: '', target: 'Assigned Mentor' });
              notify(`Help request routed to ${created.target}`);
              if (created.target === 'AI Mentor') {
                setActiveTab('ai-mentor');
                handleSendMentorMessage(`I'm stuck! Goal: ${created.goal}. Attempted: ${created.attempted}. Error/Code: ${created.errorOrCode}. Guide me step by step.`);
              }
            }}
            className={`${cardClass} p-6 lg:col-span-5 space-y-3.5`}
          >
            <div className="flex items-center gap-2">
              <LifeBuoy className="w-5 h-5" />
              <h2 className={`text-base font-semibold ${textPrimary}`}>Raise an “I’m Stuck” Blocker</h2>
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1 ${textSecondary}`}>Route Request To</label>
              <select value={newBlockerForm.target} onChange={e => setNewBlockerForm({ ...newBlockerForm, target: e.target.value })} className={inputClass}>
                <option value="Assigned Mentor">Assigned Mentor ({pairingState.assignedMentor})</option>
                <option value="Learning Partner">Learning Partner ({pairingState.partnerName})</option>
                <option value="AI Mentor">AI Personal Mentor (Immediate Guidance)</option>
                <option value="Frontend Group">Technical Group</option>
              </select>
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1 ${textSecondary}`}>1. What are you trying to achieve? *</label>
              <input type="text" required value={newBlockerForm.goal} onChange={e => setNewBlockerForm({ ...newBlockerForm, goal: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1 ${textSecondary}`}>2. What have you already attempted? *</label>
              <textarea rows={2} required value={newBlockerForm.attempted} onChange={e => setNewBlockerForm({ ...newBlockerForm, attempted: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1 ${textSecondary}`}>3. Error message or code snippet</label>
              <textarea rows={2} value={newBlockerForm.errorOrCode} onChange={e => setNewBlockerForm({ ...newBlockerForm, errorOrCode: e.target.value })} className={`${inputClass} font-mono`} />
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1 ${textSecondary}`}>4. Specific assistance needed</label>
              <input type="text" value={newBlockerForm.helpNeeded} onChange={e => setNewBlockerForm({ ...newBlockerForm, helpNeeded: e.target.value })} className={inputClass} />
            </div>
            <button type="submit" className={`${btnPrimary} w-full`}>Submit Blocker Request</button>
          </form>

          <div className="lg:col-span-7 space-y-4">
            <h2 className={`text-base font-semibold ${textPrimary}`}>Team Help Desk Queue ({helpRequests.length})</h2>
            {helpRequests.map(hr => (
              <div key={hr.id} className={`${cardClass} p-5 space-y-3`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={hr.status === 'Resolved' ? 'success' : hr.status === 'Being Helped' ? 'info' : 'warning'}>
                      {hr.status}
                    </Badge>
                    <Badge variant="neutral">To: {hr.target}</Badge>
                    <span className={`text-xs ${textSecondary}`}>{hr.author} • {hr.createdAt}</span>
                  </div>
                  <select
                    value={hr.status}
                    onChange={e => setHelpRequests(helpRequests.map(item => item.id === hr.id ? { ...item, status: e.target.value } : item))}
                    className={`${inputClass} !w-auto text-xs py-1`}
                  >
                    <option value="Open">Open</option>
                    <option value="Being Helped">Being Helped</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                <h3 className={`text-sm font-semibold ${textPrimary}`}>Goal: {hr.goal}</h3>
                <p className={`text-xs ${textSecondary}`}><strong>Attempted:</strong> {hr.attempted}</p>
                {hr.errorOrCode && (
                  <pre className={`p-2.5 rounded-lg text-xs font-mono overflow-x-auto border ${borderClass} ${subtleBgClass} ${textPrimary}`}>
                    {hr.errorOrCode}
                  </pre>
                )}

                {hr.responses.map(resp => (
                  <div key={resp.id} className={`p-3 rounded-lg border ${borderClass} ${subtleBgClass} text-xs`}>
                    <strong className={textPrimary}>{resp.responder}:</strong> <span className={textSecondary}>{resp.text}</span>
                  </div>
                ))}

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Add a guiding hint or follow-up explanation..."
                    value={blockerReplyDrafts[hr.id] || ''}
                    onChange={e => setBlockerReplyDrafts({ ...blockerReplyDrafts, [hr.id]: e.target.value })}
                    className={inputClass}
                  />
                  <button
                    onClick={() => {
                      const txt = (blockerReplyDrafts[hr.id] || '').trim();
                      if (!txt) return;
                      setHelpRequests(helpRequests.map(item => {
                        if (item.id !== hr.id) return item;
                        return {
                          ...item,
                          status: item.status === 'Open' ? 'Being Helped' : item.status,
                          responses: [...item.responses, { id: `hr-${Date.now()}`, responder: role === 'admin' ? 'David Mensah' : profile.fullName, text: txt }]
                        };
                      }));
                      setBlockerReplyDrafts({ ...blockerReplyDrafts, [hr.id]: '' });
                    }}
                    className={btnSecondary}
                  >
                    Reply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // 8. WEEKLY ROUTINE (MON–SUN) & SUNDAY 7-PROMPT ACCOUNTABILITY REPORT
  // ============================================================================
  const [newActForm, setNewActForm] = useState({ day: 'MONDAY', theme: 'LEARN AND PLAN', title: '', deadline: 'Mon 20:00', description: '' });
  const [reportDraft, setReportDraft] = useState({
    planned: '', learned: '', modulesCompleted: '', built: '', challenges: '', struggled: '', nextWeekGoal: '', evidenceUrl: ''
  });

  const renderWeeklyRoutineView = () => {
    const doneCount = weeklyActivities.filter(a => a.completed).length;
    const pct = Math.round((doneCount / weeklyActivities.length) * 100);

    return (
      <div className="space-y-6">
        <div className={`${cardClass} p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
          <div>
            <h1 className={`text-2xl font-semibold ${textPrimary}`}>Structured Weekly Learning Routine (Mon–Sun)</h1>
            <p className={`text-sm mt-1 ${textSecondary}`}>
              Consistent weekly rhythm turning study into daily practice, collaboration, code review, and Sunday reflection.
            </p>
          </div>
          <div className="text-right">
            <div className={`text-xl font-semibold ${textPrimary}`}>{doneCount}/{weeklyActivities.length} ({pct}%)</div>
            <div className={`text-xs ${textSecondary}`}>Weekly Routine Completion</div>
          </div>
        </div>

        {role === 'admin' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newActForm.title.trim()) return;
              setWeeklyActivities([...weeklyActivities, { id: `wa-${Date.now()}`, ...newActForm, completed: false }]);
              setNewActForm({ day: 'MONDAY', theme: 'LEARN AND PLAN', title: '', deadline: 'Mon 20:00', description: '' });
              notify('Published new weekly routine activity!');
            }}
            className={`${cardClass} p-5 grid grid-cols-1 md:grid-cols-12 gap-3`}
          >
            <select value={newActForm.day} onChange={e => setNewActForm({ ...newActForm, day: e.target.value })} className={`${inputClass} md:col-span-2`}>
              {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <input type="text" required placeholder="Activity title..." value={newActForm.title} onChange={e => setNewActForm({ ...newActForm, title: e.target.value })} className={`${inputClass} md:col-span-4`} />
            <input type="text" placeholder="Instructions..." value={newActForm.description} onChange={e => setNewActForm({ ...newActForm, description: e.target.value })} className={`${inputClass} md:col-span-4`} />
            <button type="submit" className={`${btnPrimary} md:col-span-2`}>Publish Activity</button>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {weeklyActivities.map(act => (
            <div key={act.id} className={`${cardClass} p-5 flex items-start justify-between gap-3`}>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="neutral">{act.day} — {act.theme}</Badge>
                  <span className={`text-xs ${textSecondary}`}>Due {act.deadline}</span>
                </div>
                <h3 className={`text-sm font-semibold ${act.completed ? 'line-through opacity-60' : ''} ${textPrimary}`}>{act.title}</h3>
                <p className={`text-xs leading-relaxed ${textSecondary}`}>{act.description}</p>
              </div>
              <button
                onClick={() => setWeeklyActivities(weeklyActivities.map(a => a.id === act.id ? { ...a, completed: !a.completed } : a))}
                className={act.completed ? btnSecondary : btnPrimary}
              >
                {act.completed ? 'Done ✓' : 'Complete'}
              </button>
            </div>
          ))}
        </div>

        {/* Sunday 7-Prompt Accountability Check-In */}
        <div className={`${cardClass} p-6 space-y-4`}>
          <div>
            <Badge variant="info">Sunday Weekly Accountability Check-In</Badge>
            <h2 className={`text-lg font-semibold mt-1 ${textPrimary}`}>7-Prompt Engineering Reflection & Evidence</h2>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!reportDraft.learned.trim()) return;
              const entry = {
                id: `rep-${Date.now()}`,
                weekEnding: '2026-11-15',
                memberName: profile.fullName,
                ...reportDraft
              };
              setWeeklyReports([entry, ...weeklyReports]);
              setReportDraft({ planned: '', learned: '', modulesCompleted: '', built: '', challenges: '', struggled: '', nextWeekGoal: '', evidenceUrl: '' });
              notify('Sunday Weekly Accountability Report submitted!');
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-3.5"
          >
            <input type="text" placeholder="1. What did you plan to learn this week?" value={reportDraft.planned} onChange={e => setReportDraft({ ...reportDraft, planned: e.target.value })} className={inputClass} />
            <input type="text" required placeholder="2. What did you actually learn? *" value={reportDraft.learned} onChange={e => setReportDraft({ ...reportDraft, learned: e.target.value })} className={inputClass} />
            <input type="text" placeholder="3. What course modules did you complete?" value={reportDraft.modulesCompleted} onChange={e => setReportDraft({ ...reportDraft, modulesCompleted: e.target.value })} className={inputClass} />
            <input type="text" placeholder="4. What did you build or practise?" value={reportDraft.built} onChange={e => setReportDraft({ ...reportDraft, built: e.target.value })} className={inputClass} />
            <input type="text" placeholder="5. What challenges did you encounter?" value={reportDraft.challenges} onChange={e => setReportDraft({ ...reportDraft, challenges: e.target.value })} className={inputClass} />
            <input type="text" placeholder="6. What did you struggle to understand?" value={reportDraft.struggled} onChange={e => setReportDraft({ ...reportDraft, struggled: e.target.value })} className={inputClass} />
            <input type="text" placeholder="7. What do you want to accomplish next week?" value={reportDraft.nextWeekGoal} onChange={e => setReportDraft({ ...reportDraft, nextWeekGoal: e.target.value })} className={inputClass} />
            <input type="url" placeholder="Evidence URL (GitHub PR / Demo Link)" value={reportDraft.evidenceUrl} onChange={e => setReportDraft({ ...reportDraft, evidenceUrl: e.target.value })} className={inputClass} />
            <div className="md:col-span-2 flex justify-end">
              <button type="submit" className={btnPrimary}>Submit Sunday Check-In</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // ============================================================================
  // 9. CHALLENGES & CODING ASSIGNMENTS (WITH RESPONSIBLE AI REFLECTION)
  // ============================================================================
  const [challengeFilter, setChallengeFilter] = useState('All');
  const [activeSubmissionChallenge, setActiveSubmissionChallenge] = useState(null);
  const [submissionForm, setSubmissionForm] = useState({
    repoUrl: '',
    explanation: '',
    difficulties: '',
    status: 'Submitted',
    usedAi: 'Yes — For concept hints & debugging',
    aiVerification: ''
  });

  const renderChallengesView = () => {
    const filtered = challengeFilter === 'All'
      ? challenges
      : challenges.filter(c => c.category === challengeFilter || c.difficulty === challengeFilter);

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className={`text-2xl font-semibold ${textPrimary}`}>Practical Coding Challenges & Submissions</h1>
            <p className={`text-sm mt-1 ${textSecondary}`}>
              Apply concepts in real repositories, document trade-offs, and reflect responsibly on any AI assistance used.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {['All', 'Frontend', 'Backend', 'Git and GitHub', 'Beginner', 'Intermediate'].map(f => (
              <button
                key={f}
                onClick={() => setChallengeFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer ${
                  challengeFilter === f
                    ? (darkMode ? 'bg-white text-black border-white' : 'bg-[#111111] text-white border-[#111111]')
                    : `${borderClass} ${textSecondary}`
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filtered.map(ch => (
            <div key={ch.id} className={`${cardClass} p-6 flex flex-col justify-between space-y-4`}>
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="neutral">{ch.category}</Badge>
                    <Badge variant="info">{ch.difficulty}</Badge>
                  </div>
                  <Badge variant={ch.status === 'Completed' ? 'success' : ch.status === 'In Progress' || ch.status === 'Submitted' ? 'warning' : 'neutral'}>
                    {ch.status}
                  </Badge>
                </div>
                <h2 className={`text-lg font-semibold ${textPrimary}`}>{ch.title}</h2>
                <p className={`text-xs leading-relaxed ${textSecondary}`}>{ch.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {ch.technologies.map(t => <Badge key={t} variant="neutral">{t}</Badge>)}
                </div>
                {ch.submission?.feedback && (
                  <div className={`p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-700 dark:text-emerald-300`}>
                    <strong>Reviewer Feedback:</strong> {ch.submission.feedback}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#D8D8E2] dark:border-[#34343F] flex items-center justify-between">
                <span className={`text-xs ${textSecondary}`}>Due {ch.deadline}</span>
                <button
                  onClick={() => {
                    setActiveSubmissionChallenge(ch);
                    setSubmissionForm({
                      repoUrl: ch.submission?.repoUrl || '',
                      explanation: ch.submission?.explanation || '',
                      difficulties: ch.submission?.difficulties || '',
                      status: ch.status === 'Not Started' ? 'Submitted' : ch.status,
                      usedAi: ch.submission?.usedAi || 'Yes — For concept hints & debugging',
                      aiVerification: ch.submission?.aiVerification || ''
                    });
                  }}
                  className={btnPrimary}
                >
                  {ch.submission ? 'Update Submission' : 'Attempt & Submit'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {activeSubmissionChallenge && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className={`${cardClass} w-full max-w-xl p-6 max-h-[90vh] overflow-y-auto space-y-4`}>
              <div className="flex items-center justify-between pb-3 border-b border-[#D8D8E2] dark:border-[#34343F]">
                <h3 className={`text-lg font-semibold ${textPrimary}`}>Submit Solution: {activeSubmissionChallenge.title}</h3>
                <button onClick={() => setActiveSubmissionChallenge(null)} className="cursor-pointer"><X className="w-5 h-5" /></button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setChallenges(challenges.map(c => c.id === activeSubmissionChallenge.id ? {
                    ...c,
                    status: submissionForm.status,
                    submission: { ...submissionForm, feedback: c.submission?.feedback || '' }
                  } : c));
                  setActiveSubmissionChallenge(null);
                  notify('Challenge submission & AI reflection saved!');
                }}
                className="space-y-3.5"
              >
                <div>
                  <label className={`block text-xs font-medium mb-1 ${textSecondary}`}>GitHub Repository / PR URL *</label>
                  <input type="url" required value={submissionForm.repoUrl} onChange={e => setSubmissionForm({ ...submissionForm, repoUrl: e.target.value })} placeholder="https://github.com/..." className={inputClass} />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${textSecondary}`}>Implementation Explanation *</label>
                  <textarea rows={2} required value={submissionForm.explanation} onChange={e => setSubmissionForm({ ...submissionForm, explanation: e.target.value })} placeholder="Explain your approach and how you tested it..." className={inputClass} />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${textSecondary}`}>Difficulties / Incomplete Areas (Optional)</label>
                  <textarea rows={2} value={submissionForm.difficulties} onChange={e => setSubmissionForm({ ...submissionForm, difficulties: e.target.value })} placeholder="Explain blockers if submitting partial work..." className={inputClass} />
                </div>
                <div className={`p-3.5 rounded-xl border ${borderClass} ${subtleBgClass} space-y-2.5`}>
                  <div className={`text-xs font-semibold ${textPrimary}`}>Responsible AI Usage Reflection (Optional)</div>
                  <select value={submissionForm.usedAi} onChange={e => setSubmissionForm({ ...submissionForm, usedAi: e.target.value })} className={inputClass}>
                    <option value="No — Written 100% independently">No — Written 100% independently</option>
                    <option value="Yes — For concept hints & debugging">Yes — For concept hints & debugging</option>
                    <option value="Yes — Generated boilerplate & refactored manually">Yes — Generated boilerplate & refactored manually</option>
                  </select>
                  <input
                    type="text"
                    placeholder="What did you verify, modify, or learn from any AI assistance?"
                    value={submissionForm.aiVerification}
                    onChange={e => setSubmissionForm({ ...submissionForm, aiVerification: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setActiveSubmissionChallenge(null)} className={btnSecondary}>Cancel</button>
                  <button type="submit" className={btnPrimary}>Save Submission</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ============================================================================
  // 10. PROJECTS & 10-STAGE SOFTWARE DEVELOPMENT LIFECYCLE (SDLC)
  // ============================================================================
  const [selectedProjectId, setSelectedProjectId] = useState(INITIAL_PROJECTS[0].id);

  const renderProjectsView = () => {
    const activeProject = projects.find(p => p.id === selectedProjectId) || projects[0];
    const currentStageIdx = SDLC_STAGES.indexOf(activeProject.sdlcStage);
    const taskColumns = ['To Do', 'In Progress', 'In Review', 'Completed'];

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className={`text-2xl font-semibold ${textPrimary}`}>Collaborative Projects & 10-Stage SDLC</h1>
            <p className={`text-sm mt-1 ${textSecondary}`}>
              Build real-world team products across the complete 10-stage lifecycle with Kanban task ownership.
            </p>
          </div>
          <div className="flex gap-2">
            {projects.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedProjectId(p.id)}
                className={p.id === activeProject.id ? btnPrimary : btnSecondary}
              >
                {p.name.split('—')[0].trim()}
              </button>
            ))}
          </div>
        </div>

        <div className={`${cardClass} p-6 space-y-5`}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="success">{activeProject.status}</Badge>
                <Badge variant="info">{activeProject.sdlcStage}</Badge>
                <span className={`text-xs ${textSecondary}`}>Target Release: {activeProject.deadline}</span>
              </div>
              <h2 className={`text-xl font-semibold mt-2 ${textPrimary}`}>{activeProject.name}</h2>
              <p className={`text-xs mt-1 ${textSecondary}`}>{activeProject.description}</p>
            </div>
            <a href={activeProject.repoUrl} target="_blank" rel="noopener noreferrer" className={btnSecondary}>
              GitHub Repository <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* 10-Stage SDLC Interactive Pipeline */}
          <div>
            <div className={`text-xs font-semibold uppercase tracking-wider mb-2 ${textSecondary}`}>
              10-Stage Software Development Lifecycle (Click to Advance Phase)
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SDLC_STAGES.map((stage, idx) => {
                const isDone = idx < currentStageIdx;
                const isCurrent = idx === currentStageIdx;
                return (
                  <button
                    key={stage}
                    onClick={() => {
                      setProjects(projects.map(p => p.id === activeProject.id ? { ...p, sdlcStage: stage } : p));
                      notify(`Project moved to ${stage}`);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                      isCurrent
                        ? (darkMode ? 'bg-white text-black border-white' : 'bg-[#111111] text-white border-[#111111]')
                        : isDone
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                          : `${borderClass} ${textSecondary}`
                    }`}
                  >
                    {stage}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Kanban Task Board */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {taskColumns.map(col => {
              const colTasks = activeProject.tasks.filter(t => t.status === col);
              return (
                <div key={col} className={`p-3.5 rounded-xl border ${borderClass} ${subtleBgClass} space-y-2.5`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold ${textPrimary}`}>{col}</span>
                    <Badge variant="neutral">{colTasks.length}</Badge>
                  </div>
                  {colTasks.map(task => (
                    <div key={task.id} className={`${cardClass} p-3 space-y-2`}>
                      <p className={`text-xs font-medium ${textPrimary}`}>{task.title}</p>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className={textSecondary}>{task.assignee}</span>
                        <select
                          value={task.status}
                          onChange={e => {
                            const nextStatus = e.target.value;
                            setProjects(projects.map(p => {
                              if (p.id !== activeProject.id) return p;
                              return {
                                ...p,
                                tasks: p.tasks.map(t => t.id === task.id ? { ...t, status: nextStatus } : t)
                              };
                            }));
                          }}
                          className={`border ${borderClass} rounded px-1.5 py-0.5 bg-transparent ${textPrimary}`}
                        >
                          {taskColumns.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // 11. TECHNICAL PRESENTATIONS, WORKSHOPS & COMMUNITY
  // ============================================================================
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');

  const renderCommunityView = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-semibold ${textPrimary}`}>Technical Presentations, Workshops & Community</h1>
          <p className={`text-sm mt-1 ${textSecondary}`}>
            Schedule knowledge-sharing demos, RSVP to workshops, and share engineering discoveries.
          </p>
        </div>
        <button
          onClick={() => {
            const newPres = {
              id: `pres-${Date.now()}`,
              title: `Lightning Demo: ${courses[0]?.currentTopic || 'Clean React Architecture'}`,
              presenter: role === 'admin' ? 'David Mensah' : profile.fullName,
              topic: profile.field,
              type: 'Member Knowledge Demo',
              dateTime: 'Next Wednesday • 17:00 WAT',
              description: 'Live walkthrough, code examples, and peer Q&A.',
              resourceUrl: profile.githubUrl,
              attendees: [profile.fullName]
            };
            setPresentations([newPres, ...presentations]);
            notify('Proposed new technical presentation session!');
          }}
          className={btnPrimary}
        >
          <Plus className="w-4 h-4" /> Propose Presentation
        </button>
      </div>

      {/* Upcoming Technical Presentations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {presentations.map(pres => {
          const attending = pres.attendees.includes(profile.fullName);
          return (
            <div key={pres.id} className={`${cardClass} p-5 flex flex-col justify-between space-y-3`}>
              <div>
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="info">{pres.type}</Badge>
                  <span className={`text-xs ${textSecondary}`}>{pres.dateTime}</span>
                </div>
                <h3 className={`text-base font-semibold mt-2 ${textPrimary}`}>{pres.title}</h3>
                <p className={`text-xs mt-1 ${textSecondary}`}>Presenter: <strong>{pres.presenter}</strong> • {pres.topic}</p>
                <p className={`text-xs mt-2 leading-relaxed ${textSecondary}`}>{pres.description}</p>
              </div>
              <div className="pt-3 border-t border-[#D8D8E2] dark:border-[#34343F] flex items-center justify-between">
                <span className={`text-xs ${textSecondary}`}>{pres.attendees.length} Attending</span>
                <button
                  onClick={() => setPresentations(presentations.map(p => {
                    if (p.id !== pres.id) return p;
                    return {
                      ...p,
                      attendees: attending ? p.attendees.filter(a => a !== profile.fullName) : [...p.attendees, profile.fullName]
                    };
                  }))}
                  className={attending ? btnSecondary : btnPrimary}
                >
                  {attending ? 'Attending ✓' : 'RSVP / Attend'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Community Discussion Composer & Feed */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!newPostTitle.trim() || !newPostContent.trim()) return;
          setPosts([{
            id: `post-${Date.now()}`,
            author: role === 'admin' ? 'David Mensah' : profile.fullName,
            role: role === 'admin' ? 'Admin / Team Leader' : profile.field,
            category: role === 'admin' ? 'Announcement' : 'Discovery',
            pinned: role === 'admin',
            timestamp: 'Just now',
            title: newPostTitle.trim(),
            content: newPostContent.trim(),
            likes: 1,
            comments: []
          }, ...posts]);
          setNewPostTitle('');
          setNewPostContent('');
          notify('Published post to community!');
        }}
        className={`${cardClass} p-5 space-y-3`}
      >
        <h3 className={`text-sm font-semibold ${textPrimary}`}>
          {role === 'admin' ? 'Publish Pinned Team Announcement' : 'Share a Discovery, Question, or Demo'}
        </h3>
        <input type="text" placeholder="Headline..." value={newPostTitle} onChange={e => setNewPostTitle(e.target.value)} className={inputClass} />
        <textarea rows={2} placeholder="Write your technical takeaway or question..." value={newPostContent} onChange={e => setNewPostContent(e.target.value)} className={inputClass} />
        <div className="flex justify-end">
          <button type="submit" className={btnPrimary}>Publish Post</button>
        </div>
      </form>

      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className={`${cardClass} p-5 space-y-2.5`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {post.pinned && <Badge variant="warning"><Pin className="w-3 h-3" /> Pinned</Badge>}
                <Badge variant="neutral">{post.category}</Badge>
                <span className={`text-xs font-medium ${textPrimary}`}>{post.author}</span>
                <span className={`text-xs ${textSecondary}`}>• {post.timestamp}</span>
              </div>
              <button
                onClick={() => setPosts(posts.map(p => p.id === post.id ? { ...p, likes: p.likes + 1 } : p))}
                className={`${btnSecondary} !py-1 !px-2.5`}
              >
                <ThumbsUp className="w-3.5 h-3.5" /> {post.likes}
              </button>
            </div>
            <h4 className={`text-base font-semibold ${textPrimary}`}>{post.title}</h4>
            <p className={`text-xs leading-relaxed ${textSecondary}`}>{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );

  // ============================================================================
  // 12. GIT 6-LEVEL PROGRESSION & RESPONSIBLE AI LITERACY
  // ============================================================================
  const renderDevToolsView = () => (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-semibold ${textPrimary}`}>Git 6-Level Progression & Responsible AI Literacy</h1>
        <p className={`text-sm mt-1 ${textSecondary}`}>
          Master collaborative version control and learn to use AI tools responsibly without losing core problem-solving independence.
        </p>
      </div>

      <div className={`${cardClass} p-6 space-y-4`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <Badge variant="info">6-Level Git & GitHub Mastery Track</Badge>
            <h2 className={`text-lg font-semibold mt-1 ${textPrimary}`}>Collaborative Version Control Progression</h2>
          </div>
          <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className={btnSecondary}>
            GitHub Profile <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gitLevels.map(lvl => (
            <div
              key={lvl.level}
              onClick={() => setGitLevels(gitLevels.map(g => g.level === lvl.level ? { ...g, completed: !g.completed } : g))}
              className={`p-4 rounded-xl border ${borderClass} ${lvl.completed ? subtleBgClass : ''} cursor-pointer space-y-2`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold uppercase ${textPrimary}`}>Level {lvl.level}</span>
                <Badge variant={lvl.completed ? 'success' : 'neutral'}>{lvl.completed ? 'Verified' : 'In Progress'}</Badge>
              </div>
              <h3 className={`text-sm font-semibold ${textPrimary}`}>{lvl.title}</h3>
              <p className={`text-xs leading-relaxed ${textSecondary}`}>{lvl.desc}</p>
              <div className={`text-[11px] font-medium ${textSecondary}`}>{lvl.evidence}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={`${cardClass} p-6 space-y-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5" />
            <h2 className={`text-lg font-semibold ${textPrimary}`}>6-Stage Responsible AI Engineering Literacy</h2>
          </div>
          <Badge variant="warning">{aiLiteracy.filter(a => a.completed).length}/{aiLiteracy.length} Completed</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {aiLiteracy.map(stage => (
            <button
              key={stage.id}
              onClick={() => setAiLiteracy(aiLiteracy.map(s => s.id === stage.id ? { ...s, completed: !s.completed } : s))}
              className={`text-left p-4 rounded-xl border ${borderClass} ${subtleBgClass} flex items-start gap-3 cursor-pointer`}
            >
              {stage.completed
                ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                : <Circle className={`w-4 h-4 shrink-0 mt-0.5 ${textSecondary}`} />}
              <div>
                <h4 className={`text-sm font-semibold ${textPrimary}`}>{stage.stage}</h4>
                <p className={`text-xs mt-1 leading-relaxed ${textSecondary}`}>{stage.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ============================================================================
  // 13. RESOURCES LIBRARY & HACKATHON READINESS
  // ============================================================================
  const [resSearch, setResSearch] = useState('');
  const renderResourcesView = () => {
    const filtered = resources.filter(r =>
      r.title.toLowerCase().includes(resSearch.toLowerCase()) ||
      r.category.toLowerCase().includes(resSearch.toLowerCase())
    );
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className={`text-2xl font-semibold ${textPrimary}`}>Curated Engineering Resources Library</h1>
            <p className={`text-sm mt-1 ${textSecondary}`}>Vetted documentation, architecture guides, and reference books.</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className={`w-4 h-4 absolute left-3.5 top-2.5 ${textSecondary}`} />
            <input type="text" placeholder="Search resources..." value={resSearch} onChange={e => setResSearch(e.target.value)} className={`${inputClass} pl-10`} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(res => (
            <div key={res.id} className={`${cardClass} p-5 flex flex-col justify-between space-y-3`}>
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="neutral">{res.category}</Badge>
                  <Badge variant="info">{res.type}</Badge>
                </div>
                <h3 className={`text-base font-semibold mt-2 ${textPrimary}`}>{res.title}</h3>
                <p className={`text-xs mt-1 leading-relaxed ${textSecondary}`}>{res.description}</p>
              </div>
              <div className="pt-2 flex items-center justify-between text-xs">
                <span className={textSecondary}>Added by {res.addedBy}</span>
                <a href={res.url} target="_blank" rel="noopener noreferrer" className={btnSecondary}>
                  Open Resource <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderHackathonsView = () => {
    const doneCount = hackathon.checklist.filter(i => i.done).length;
    const pct = Math.round((doneCount / hackathon.checklist.length) * 100);
    return (
      <div className="space-y-6">
        <div className={`${cardClass} p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4`}>
          <div>
            <Badge variant="success">Team: {hackathon.teamName} • {hackathon.date}</Badge>
            <h1 className={`text-2xl font-semibold mt-2 ${textPrimary}`}>{hackathon.name}</h1>
            <p className={`text-sm mt-1 ${textSecondary}`}>{hackathon.idea}</p>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-semibold ${textPrimary}`}>{pct}% Ready</div>
            <div className={`text-xs ${textSecondary}`}>{doneCount}/{hackathon.checklist.length} Stages Complete</div>
          </div>
        </div>

        <div className={`${cardClass} p-6 space-y-3`}>
          <h2 className={`text-base font-semibold ${textPrimary}`}>9-Stage Hackathon Readiness Checklist</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {hackathon.checklist.map(item => (
              <button
                key={item.id}
                onClick={() => setHackathon({
                  ...hackathon,
                  checklist: hackathon.checklist.map(c => c.id === item.id ? { ...c, done: !c.done } : c)
                })}
                className={`p-3.5 rounded-xl border ${borderClass} ${subtleBgClass} flex items-center gap-3 text-left cursor-pointer`}
              >
                {item.done ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <Circle className={`w-4 h-4 shrink-0 ${textSecondary}`} />}
                <span className={`text-xs font-medium ${item.done ? 'line-through opacity-60' : ''} ${textPrimary}`}>{item.stage}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // 14. INDIVIDUAL GROWTH PLAN & 10-COMPETENCY DEVELOPER READINESS
  // ============================================================================
  const renderProgressAndReportsView = () => {
    const competencies = [
      { name: 'Programming Knowledge', level: 'Proficient', evidence: `${courses.length} active courses + CS50 & React assessments` },
      { name: 'Problem-Solving', level: 'Developing', evidence: `${challenges.filter(c => c.status === 'Completed').length} challenges solved + daily debugging logs` },
      { name: 'Technical Research', level: 'Proficient', evidence: 'Roadmap.sh topic notes & official documentation audits' },
      { name: 'AI Literacy', level: 'Developing', evidence: `${aiLiteracy.filter(a => a.completed).length}/6 Responsible AI stages + Socratic mentor usage` },
      { name: 'Git & GitHub', level: 'Proficient', evidence: `Level ${gitLevels.filter(g => g.completed).length}/6 verified + Merge Conflict Rescue PR` },
      { name: 'Software Development', level: 'Developing', evidence: `OpenPulse SDLC (${projects[0]?.sdlcStage})` },
      { name: 'Testing & Debugging', level: 'Focus Area', evidence: 'Building Vitest suite & AbortController race-condition guards' },
      { name: 'Communication', level: 'Proficient', evidence: `${weeklyReports.length} Sunday reports + scheduled Event Loop presentation` },
      { name: 'Collaboration', level: 'Proficient', evidence: `Active buddy pairing with ${pairingState.partnerName} & PR workflows` },
      { name: 'Independent Learning', level: 'Proficient', evidence: `${profile.streakDays}-day self-directed learning streak` }
    ];

    return (
      <div className="space-y-6">
        <div>
          <h1 className={`text-2xl font-semibold ${textPrimary}`}>Individual Growth Plan & 10-Competency Readiness</h1>
          <p className={`text-sm mt-1 ${textSecondary}`}>
            Holistic engineering readiness backed by concrete evidence—never reduced to a single arbitrary vanity number.
          </p>
        </div>

        <div className={`${cardClass} p-6 grid grid-cols-1 lg:grid-cols-12 gap-6`}>
          <div className="lg:col-span-5 space-y-3">
            <Badge variant="info">Personalised Individual Growth Plan</Badge>
            <h2 className={`text-lg font-semibold ${textPrimary}`}>{profile.fullName} — {profile.field}</h2>
            <p className={`text-xs leading-relaxed ${textSecondary}`}>{diagnosticResult.planSummary}</p>
            <div className={`p-3.5 rounded-xl border ${borderClass} ${subtleBgClass} space-y-1.5 text-xs`}>
              <div><span className={textSecondary}>Diagnostic Placement:</span> <strong className={textPrimary}>{diagnosticResult.recommendedLevel}</strong></div>
              <div><span className={textSecondary}>Core Strengths:</span> <span className={textPrimary}>{diagnosticResult.strengths.join(', ')}</span></div>
              <div><span className={textSecondary}>Target Gaps:</span> <span className={textPrimary}>{diagnosticResult.weaknesses.join(', ')}</span></div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <h3 className={`text-sm font-semibold mb-3 ${textPrimary}`}>10-Competency Developer Readiness Evidence</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {competencies.map((comp, i) => (
                <div key={i} className={`p-3 rounded-lg border ${borderClass} ${subtleBgClass}`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-xs font-semibold ${textPrimary}`}>{i + 1}. {comp.name}</span>
                    <Badge variant={comp.level === 'Proficient' ? 'success' : comp.level === 'Developing' ? 'info' : 'warning'}>
                      {comp.level}
                    </Badge>
                  </div>
                  <p className={`text-[11px] mt-1 ${textSecondary}`}>{comp.evidence}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`${cardClass} p-6 space-y-4`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-base font-semibold ${textPrimary}`}>Measurable Evidence-Backed Developer Milestones</h2>
              <p className={`text-xs ${textSecondary}`}>Awarded strictly through verified quizzes, PRs, and practical demonstrations.</p>
            </div>
            <Badge variant="neutral">
              {MEASURABLE_MILESTONES.filter(m => m.demonstrated).length} / {MEASURABLE_MILESTONES.length} Demonstrated
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {MEASURABLE_MILESTONES.map(ms => (
              <div key={ms.id} className={`p-4 rounded-xl border ${borderClass} ${ms.demonstrated ? subtleBgClass : ''}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-sm font-semibold ${textPrimary}`}>{ms.title}</span>
                  <Badge variant={ms.demonstrated ? 'success' : 'neutral'}>{ms.demonstrated ? 'Demonstrated' : 'Next Target'}</Badge>
                </div>
                <p className={`text-xs mt-1 ${textSecondary}`}>Criteria: {ms.criteria}</p>
                <p className={`text-xs mt-1.5 font-medium ${textPrimary}`}>Evidence: {ms.evidence}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // 15. PROFILE & SETTINGS
  // ============================================================================
  const renderProfileView = () => (
    <div className="max-w-3xl space-y-6">
      <div className={`${cardClass} p-6 space-y-4`}>
        <h1 className={`text-xl font-semibold ${textPrimary}`}>Developer Profile & Portfolio Links</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={`block text-xs font-medium mb-1 ${textSecondary}`}>Full Name</label>
            <input type="text" value={profile.fullName} onChange={e => setProfile({ ...profile, fullName: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={`block text-xs font-medium mb-1 ${textSecondary}`}>Primary Development Field</label>
            <select value={profile.field} onChange={e => setProfile({ ...profile, field: e.target.value })} className={inputClass}>
              <option value="Frontend Development">Frontend Development</option>
              <option value="Backend Development">Backend Development</option>
              <option value="Full Stack Development">Full Stack Development</option>
              <option value="AI & Machine Learning">AI & Machine Learning</option>
              <option value="DevOps & Cloud">DevOps & Cloud</option>
              <option value="Cybersecurity">Cybersecurity</option>
            </select>
          </div>
          <div>
            <label className={`block text-xs font-medium mb-1 ${textSecondary}`}>GitHub Profile URL</label>
            <input type="url" value={profile.githubUrl} onChange={e => setProfile({ ...profile, githubUrl: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={`block text-xs font-medium mb-1 ${textSecondary}`}>Portfolio URL</label>
            <input type="url" value={profile.portfolioUrl} onChange={e => setProfile({ ...profile, portfolioUrl: e.target.value })} className={inputClass} />
          </div>
        </div>
        <div>
          <label className={`block text-xs font-medium mb-1 ${textSecondary}`}>Developer Biography</label>
          <textarea rows={2} value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} className={inputClass} />
        </div>
        <div className="flex justify-end">
          <button onClick={() => notify('Developer profile updated!')} className={btnPrimary}>Save Profile</button>
        </div>
      </div>
    </div>
  );

  // ============================================================================
  // ADMIN VIEWS: OVERVIEW, TEAM ROSTER, QUESTION BANK & ANALYTICS
  // ============================================================================
  const [adminNewQ, setAdminNewQ] = useState({
    quizId: INITIAL_QUIZZES[0].id,
    type: 'mcq',
    topic: '',
    prompt: '',
    code: '',
    optionsText: 'Option A\nOption B\nOption C\nOption D',
    answer: 'Option A',
    explanation: ''
  });

  const renderAdminDashboard = () => {
    const openBlockers = helpRequests.filter(h => h.status !== 'Resolved').length;
    return (
      <div className="space-y-6">
        <div className={`${cardClass} p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
          <div>
            <Badge variant="warning">Admin / Team Leader Control Center</Badge>
            <h1 className={`text-2xl font-semibold mt-2 ${textPrimary}`}>Cohort Engineering Oversight & Accountability</h1>
            <p className={`text-sm mt-1 ${textSecondary}`}>
              Monitor member progress, triage blocker requests, manage assessments, and review challenge PRs.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setActiveTab('admin-quizzes')} className={btnPrimary}>Manage Quiz Bank</button>
            <button onClick={() => setActiveTab('admin-help')} className={btnSecondary}>Help Desk ({openBlockers})</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`${cardClass} p-5`}>
            <span className={`text-xs uppercase ${textSecondary}`}>Active Team Members</span>
            <div className={`text-2xl font-semibold mt-1 ${textPrimary}`}>{teamRoster.length}</div>
            <p className={`text-xs mt-1 text-emerald-600`}>100% weekly check-in rate</p>
          </div>
          <div className={`${cardClass} p-5`}>
            <span className={`text-xs uppercase ${textSecondary}`}>Team Quiz Average</span>
            <div className={`text-2xl font-semibold mt-1 ${textPrimary}`}>83.8%</div>
            <p className={`text-xs mt-1 ${textSecondary}`}>Top gap: Async Event Loop</p>
          </div>
          <div className={`${cardClass} p-5`}>
            <span className={`text-xs uppercase ${textSecondary}`}>Open “I’m Stuck” Tickets</span>
            <div className={`text-2xl font-semibold mt-1 ${textPrimary}`}>{openBlockers}</div>
            <p className={`text-xs mt-1 text-amber-600`}>1 awaiting group mentor reply</p>
          </div>
          <div className={`${cardClass} p-5`}>
            <span className={`text-xs uppercase ${textSecondary}`}>Active SDLC Projects</span>
            <div className={`text-2xl font-semibold mt-1 ${textPrimary}`}>{projects.length}</div>
            <p className={`text-xs mt-1 ${textSecondary}`}>OpenPulse in Stage 7 Dev</p>
          </div>
        </div>

        {/* Team Roster & Progress Table */}
        <div className={`${cardClass} p-6 overflow-x-auto`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-base font-semibold ${textPrimary}`}>Member Progress & Pairing Matrix</h2>
            <span className={`text-xs ${textSecondary}`}>
              <ShieldCheck className="w-3.5 h-3.5 inline mr-1 text-emerald-600" />
              Private AI Mentor chats remain strictly private to each member
            </span>
          </div>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b ${borderClass} ${textSecondary}`}>
                <th className="pb-2.5 font-medium">Member</th>
                <th className="pb-2.5 font-medium">Field & Placement</th>
                <th className="pb-2.5 font-medium">Course %</th>
                <th className="pb-2.5 font-medium">Quiz Avg</th>
                <th className="pb-2.5 font-medium">Git Level</th>
                <th className="pb-2.5 font-medium">Buddy Partner</th>
                <th className="pb-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8D8E2] dark:divide-[#34343F]">
              {teamRoster.map(m => (
                <tr key={m.id}>
                  <td className={`py-3 font-semibold ${textPrimary}`}>{m.name}</td>
                  <td className={`py-3 ${textSecondary}`}>{m.field} ({m.level})</td>
                  <td className={`py-3 ${textPrimary}`}>{m.coursePct}%</td>
                  <td className={`py-3 ${textPrimary}`}>{m.quizAvg}%</td>
                  <td className={`py-3 ${textPrimary}`}>Level {m.gitLevel}/6</td>
                  <td className={`py-3 ${textSecondary}`}>{m.partner}</td>
                  <td className="py-3">
                    <Badge variant={m.status === 'Needs Support' ? 'warning' : 'success'}>{m.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderAdminQuizBankView = () => (
    <div className="space-y-6">
      <div className={`${cardClass} p-6`}>
        <Badge variant="warning">Admin Assessment & Question Bank Manager</Badge>
        <h1 className={`text-2xl font-semibold mt-2 ${textPrimary}`}>Curate Question Bank & Team Knowledge Gaps</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!adminNewQ.prompt.trim()) return;
            const opts = adminNewQ.type === 'fill_blank'
              ? []
              : adminNewQ.optionsText.split('\n').map(s => s.trim()).filter(Boolean);
            const newQuestion = {
              id: `aq-${Date.now()}`,
              type: adminNewQ.type,
              topic: adminNewQ.topic.trim() || 'Core Engineering',
              prompt: adminNewQ.prompt.trim(),
              code: adminNewQ.code,
              options: opts,
              answer: adminNewQ.answer.trim(),
              explanation: adminNewQ.explanation.trim() || 'Verified against official documentation.'
            };
            setQuizzes(quizzes.map(q => q.id === adminNewQ.quizId ? { ...q, questions: [...q.questions, newQuestion] } : q));
            setAdminNewQ({ ...adminNewQ, prompt: '', code: '', explanation: '' });
            notify('Added question to quiz bank!');
          }}
          className={`${cardClass} p-6 lg:col-span-6 space-y-3.5`}
        >
          <h2 className={`text-base font-semibold ${textPrimary}`}>Add Question to Assessment Bank</h2>
          <div className="grid grid-cols-2 gap-3">
            <select value={adminNewQ.quizId} onChange={e => setAdminNewQ({ ...adminNewQ, quizId: e.target.value })} className={inputClass}>
              {quizzes.map(q => <option key={q.id} value={q.id}>{q.title}</option>)}
            </select>
            <select value={adminNewQ.type} onChange={e => setAdminNewQ({ ...adminNewQ, type: e.target.value })} className={inputClass}>
              <option value="mcq">Multiple Choice</option>
              <option value="code_output">Code Output Prediction</option>
              <option value="find_error">Find-the-Error</option>
              <option value="true_false">True / False</option>
              <option value="fill_blank">Fill-in-the-Blank</option>
            </select>
          </div>
          <input type="text" placeholder="Topic Tag (e.g., Async Error Handling)" value={adminNewQ.topic} onChange={e => setAdminNewQ({ ...adminNewQ, topic: e.target.value })} className={inputClass} />
          <textarea rows={2} required placeholder="Question Prompt *" value={adminNewQ.prompt} onChange={e => setAdminNewQ({ ...adminNewQ, prompt: e.target.value })} className={inputClass} />
          <textarea rows={2} placeholder="Code Snippet (Optional)" value={adminNewQ.code} onChange={e => setAdminNewQ({ ...adminNewQ, code: e.target.value })} className={`${inputClass} font-mono`} />
          {adminNewQ.type !== 'fill_blank' && (
            <textarea rows={3} placeholder="Options (One per line)" value={adminNewQ.optionsText} onChange={e => setAdminNewQ({ ...adminNewQ, optionsText: e.target.value })} className={inputClass} />
          )}
          <div className="grid grid-cols-2 gap-3">
            <input type="text" required placeholder="Exact Correct Answer *" value={adminNewQ.answer} onChange={e => setAdminNewQ({ ...adminNewQ, answer: e.target.value })} className={inputClass} />
            <input type="text" placeholder="Explanation" value={adminNewQ.explanation} onChange={e => setAdminNewQ({ ...adminNewQ, explanation: e.target.value })} className={inputClass} />
          </div>
          <button type="submit" className={`${btnPrimary} w-full`}>Save to Question Bank</button>
        </form>

        <div className="lg:col-span-6 space-y-4">
          <div className={`${cardClass} p-6 space-y-3`}>
            <h2 className={`text-base font-semibold ${textPrimary}`}>Active Assessments</h2>
            {quizzes.map(q => (
              <div key={q.id} className={`p-4 rounded-xl border ${borderClass} ${subtleBgClass} flex items-center justify-between gap-3`}>
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant={q.mandatory ? 'warning' : 'neutral'}>{q.mandatory ? 'Mandatory' : 'Optional'}</Badge>
                    <span className={`text-xs ${textSecondary}`}>{q.questions.length} questions</span>
                  </div>
                  <h4 className={`text-sm font-semibold mt-1 ${textPrimary}`}>{q.title}</h4>
                </div>
                <button
                  onClick={() => setQuizzes(quizzes.map(item => item.id === q.id ? { ...item, mandatory: !item.mandatory } : item))}
                  className={btnSecondary}
                >
                  Toggle Mandatory
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ============================================================================
  // VIEW ROUTER
  // ============================================================================
  const renderContent = () => {
    switch (safeTab) {
      case 'dashboard': return renderMemberDashboard();
      case 'my-learning': return renderMyLearningEngine();
      case 'courses': return renderCoursesView();
      case 'quizzes': return renderQuizzesAndDiagnosticView();
      case 'roadmaps': return renderRoadmapsView();
      case 'ai-mentor': return renderAiMentorView();
      case 'pairing-help':
      case 'admin-help': return renderPairingAndHelpDeskView();
      case 'weekly':
      case 'admin-weekly': return renderWeeklyRoutineView();
      case 'challenges':
      case 'admin-challenges': return renderChallengesView();
      case 'projects':
      case 'admin-projects': return renderProjectsView();
      case 'community':
      case 'admin-community': return renderCommunityView();
      case 'devtools': return renderDevToolsView();
      case 'resources': return renderResourcesView();
      case 'hackathons': return renderHackathonsView();
      case 'progress': return renderProgressAndReportsView();
      case 'profile': return renderProfileView();
      case 'admin-dashboard': return renderAdminDashboard();
      case 'admin-quizzes': return renderAdminQuizBankView();
      default: return renderMemberDashboard();
    }
  };

  const tourSteps = role === 'admin' ? TOUR_ADMIN : TOUR_MEMBER;
  const tourHub = tourStep !== null ? tourSteps[tourStep]?.hub : null;
  const goTour = (i: number) => { setTourStep(i); setActiveTab(tourSteps[i].tab); };
  const endTour = () => { setTourStep(null); if (!onboarded) setOnboarded(true); };
  const startTour = () => { setMobileMenuOpen(false); goTour(0); };
  const handleLogin = (u: { name: string; email: string; isAdmin: boolean }) => {
    setUser(u);
    setProfile({ ...profile, fullName: u.name });
    const r = u.isAdmin ? 'admin' : 'member';
    setRole(r);
    setActiveTab(u.isAdmin ? 'admin-dashboard' : 'dashboard');
    if (!onboarded) { setTourStep(0); }
  };
  const handleLogout = async () => {
    if (supabase) { await supabase.auth.signOut(); window.location.reload(); return; }
    setUser(null); setTourStep(null); setRole('member'); setActiveTab('dashboard');
  };
  const firstName = (user?.name || profile.fullName || '').split(' ')[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  if (CLOUD && !authReady) return <LoadingScreen />;
  if (!user) return CLOUD ? <AuthScreen /> : <LoginScreen onLogin={handleLogin} />;
  if (CLOUD && ADMIN_SITE && !user.isAdmin) return <NotAuthorized onSignOut={handleLogout} />;
  if (CLOUD && !hydrated) return <LoadingScreen error={loadError} />;

  const activeBtn = 'bg-indigo-600 text-white';

  return (
    <DarkCtx.Provider value={darkMode}>
    <div className={`hub-root ${ADMIN_SITE ? 'admin-theme' : ''} ${darkMode ? 'dark' : ''} min-h-screen flex ${bgClass} ${textPrimary} font-sans antialiased`}>
      {toastMessage && (
        <div role="status" className={`fixed bottom-20 lg:bottom-5 right-5 z-50 px-4 py-2.5 rounded-xl shadow-lg text-xs font-medium border ${
          darkMode ? 'bg-white text-black border-white' : 'bg-[#111111] text-white border-[#111111]'
        }`}>
          {toastMessage}
        </div>
      )}

      {/* Desktop sidebar: one entry per hub */}
      <aside className={`hidden lg:flex lg:w-56 lg:flex-col lg:fixed lg:inset-y-0 border-r ${borderClass} ${darkMode ? 'bg-[#0E0E0E]' : 'bg-white'}`}>
        <div className={`p-5 border-b ${borderClass} flex items-center gap-2.5`}>
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${activeBtn}`}>DG</div>
          <div>
            <div className="text-sm font-semibold tracking-tight">{ADMIN_SITE ? 'Admin Console' : 'Developer Growth Hub'}</div>
            <div className={`text-[10px] ${textSecondary}`}>{ADMIN_SITE ? 'Team lead' : 'Member'}</div>
          </div>
        </div>

        <nav aria-label="Main" className="flex-1 overflow-y-auto p-3 space-y-1">
          {currentNav.map(hub => {
            const Icon = hub.icon;
            const isActive = hub.id === activeHub.id;
            return (
              <button
                key={hub.id}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => setActiveTab(hub.tabs[0].id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${hub.id === tourHub ? 'ring-2 ring-indigo-400 animate-pulse ' : ''}${
                  isActive ? activeBtn : `${textSecondary} hover:opacity-80`
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{hub.label}</span>
              </button>
            );
          })}
        </nav>

        <div className={`p-3.5 border-t ${borderClass} space-y-2.5`}>
          <button onClick={() => setDarkMode(!darkMode)} className={`${btnSecondary} w-full`}>
            {darkMode ? <><Sun className="w-3.5 h-3.5" /> Light mode</> : <><Moon className="w-3.5 h-3.5" /> Dark mode</>}
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={startTour} className={btnSecondary}><HelpCircle className="w-3.5 h-3.5" /> Tour</button>
            <button onClick={handleLogout} className={btnSecondary}><LogOut className="w-3.5 h-3.5" /> Sign out</button>
          </div>
          <p className={`text-[11px] truncate ${textSecondary}`}>{user.name}</p>
        </div>
      </aside>

      <div className="flex-1 lg:pl-56 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className={`lg:hidden sticky top-0 z-30 px-4 py-3 border-b ${borderClass} ${darkMode ? 'bg-[#0E0E0E]' : 'bg-white'} flex items-center justify-between`}>
          <span className="text-sm font-semibold">{ADMIN_SITE ? 'Admin Console' : 'Developer Growth Hub'}</span>
          <div className="flex items-center gap-2">
            <button aria-label="Toggle theme" onClick={() => setDarkMode(!darkMode)} className="p-2 cursor-pointer">
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button aria-label="Replay tutorial" onClick={startTour} className="p-2 cursor-pointer"><HelpCircle className="w-4 h-4" /></button>
            <button aria-label="Sign out" onClick={handleLogout} className="p-2 cursor-pointer"><LogOut className="w-4 h-4" /></button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 max-w-6xl w-full mx-auto">
          {/* Sub-tabs: only shown when the hub has more than one page */}
          {activeHub.tabs.length > 1 && (
            <div role="tablist" className={`flex gap-1 overflow-x-auto mb-6 p-1 rounded-xl border ${borderClass} ${subtleBgClass} w-fit max-w-full`}>
              {activeHub.tabs.map(t => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={t.id === safeTab}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                    t.id === safeTab ? activeBtn : textSecondary
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}
          {safeTab === 'dashboard' && role === 'member' && (
            <div className="mb-6 rounded-3xl p-6 sm:p-8 text-white bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 shadow-lg">
              <p className="text-sm opacity-80">{greeting}</p>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mt-1">Hey {firstName}, ready to level up?</h1>
              <p className="text-sm opacity-90 mt-2">🔥 {profile.streakDays}-day streak · {overallCourseProgress}% through your courses</p>
              <div className="flex flex-wrap gap-2 mt-5">
                <button onClick={() => setActiveTab('courses')} className="px-4 py-2 rounded-xl bg-white text-indigo-700 text-sm font-semibold cursor-pointer hover:bg-indigo-50">Log today’s study</button>
                <button onClick={() => setActiveTab('ai-mentor')} className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-sm font-medium cursor-pointer">Ask AI Mentor</button>
                <button onClick={() => setActiveTab('pairing-help')} className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-sm font-medium cursor-pointer">I’m stuck</button>
              </div>
            </div>
          )}
          {renderContent()}
        </main>
      </div>

      {tourStep !== null && (
        <TourCard dark={darkMode} step={tourSteps[tourStep]} index={tourStep} total={tourSteps.length}
          onBack={() => goTour(Math.max(0, tourStep - 1))}
          onNext={() => (tourStep >= tourSteps.length - 1 ? endTour() : goTour(tourStep + 1))}
          onSkip={endTour} />
      )}

      {/* Mobile bottom bar */}
      <nav aria-label="Main" className={`lg:hidden fixed bottom-0 inset-x-0 z-40 border-t ${borderClass} ${darkMode ? 'bg-[#0E0E0E]' : 'bg-white'} grid`} style={{ gridTemplateColumns: `repeat(${currentNav.length}, minmax(0, 1fr))` }}>
        {currentNav.map(hub => {
          const Icon = hub.icon;
          const isActive = hub.id === activeHub.id;
          return (
            <button
              key={hub.id}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => setActiveTab(hub.tabs[0].id)}
              className={`flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium cursor-pointer ${hub.id === tourHub ? 'bg-indigo-500/20 ' : ''}${isActive ? textPrimary : textSecondary}`}
            >
              <Icon className={`w-5 h-5 ${isActive ? '' : 'opacity-70'}`} />
              {hub.label}
            </button>
          );
        })}
      </nav>
    </div>
    </DarkCtx.Provider>
  );
}
