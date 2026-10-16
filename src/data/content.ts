/**
 * All site copy lives here. Edit this file to update the site; components only render it.
 *
 * Anything still missing is marked `[ADD: ...]` in a comment. Empty strings are hidden by
 * the UI, so the live site never shows a placeholder to a visitor.
 */

export const profile = {
  name: 'Nitya Lohiya',
  role: 'CS + Statistics @ UIUC',
  location: 'Champaign-Urbana, IL',
  email: 'nlohiya2@illinois.edu',
  github: 'https://github.com/nitya-lohiya',
  linkedin: '', // [ADD: LinkedIn URL, e.g. https://www.linkedin.com/in/your-handle]
  photo: '', // [ADD: drop a photo in /public (e.g. /nitya.jpg) and put its path here]
  resume: '/Nitya_Lohiya_Resume.pdf',

  // Alternatives: "Software that makes someone's day a little easier."
  //               "I build for the people on the other side of the screen."
  tagline: 'I build technology that makes people’s lives better.',
  positioning:
    'I’m a CS + Statistics student at UIUC working across full-stack engineering, applied machine learning, and LLM systems. Every project I take on starts with the people it’s for.',
} as const;

export const bio: string[] = [
  'Hi, I’m Nitya. I study Computer Science and Statistics at UIUC, and I build technology to make people’s lives a little better: a student getting the lesson they’re actually ready for, a family getting a fair shot at an after-school spot, a student club finally getting found.',
  'I like owning the whole path, from the data and the model to the backend and the interface someone uses. Lately that has meant knowledge graphs and recommendation engines for adaptive learning, full-stack web platforms, and fine-tuned language models.',
  'The question I keep coming back to is why AI systems fail, and what it takes to make them reliable enough to deserve people’s trust. Along the way I’ve led a six-person engineering team and mentor intro CS students as a course assistant.',
  'Away from a keyboard, I’ve practiced Bharatanatyam for more than ten years, and I’m always up for a hike or somewhere I haven’t been yet.',
];

export const quickFacts = [
  { label: 'School', value: 'University of Illinois Urbana-Champaign' },
  { label: 'Degree', value: 'B.S. Computer Science + Statistics' },
  { label: 'Focus', value: 'Full-stack, applied ML, reliable LLM systems' },
  { label: 'Based in', value: 'Champaign-Urbana, IL' },
];

/** "Who I build for" strip under the hero. Each entry points at the work that serves them. */
export const audiences = [
  {
    who: 'Students in Egypt & the Middle East',
    what: 'A learning platform that knows which concept each student is ready for next.',
    href: '#exp-itqan',
  },
  {
    who: 'Families at a Chicago elementary school',
    what: 'A fairer way to hand out after-school spots, starting with the kids who need them most.',
    href: '#exp-nobe',
  },
  {
    who: '100+ student organizations at UIUC',
    what: 'One place for students to discover them, instead of scattered posts and spreadsheets.',
    href: '#project-rso-connect',
  },
  {
    who: 'People with food allergies',
    what: 'Recipe ideas that start from what they can’t eat.',
    href: '#project-spoonbot',
  },
];

export const education = {
  school: 'University of Illinois Urbana-Champaign',
  degree: 'B.S. in Computer Science and Statistics',
  honors: ['GPA 3.8', "Dean's List"],
  coursework: [
    'Data Structures & Algorithms (CS 225)',
    'Discrete Structures (CS 173)',
    'Software Design Lab',
    'Data Science',
    'Advanced Statistics & Probability',
    'Linear Algebra with Computational Applications',
    'Multivariable Calculus',
    'CS I (Java) & CS II (C++)',
  ],
};

/**
 * The skill vocabulary the skill lens filters on. Experience and projects list a subset of
 * these ids in `skills`; a test fails if an id is used that is not defined here.
 */
export const skillTaxonomy = [
  {
    group: 'Languages',
    skills: [
      { id: 'python', label: 'Python' },
      { id: 'javascript', label: 'JavaScript / TS' },
      { id: 'java', label: 'Java' },
      { id: 'sql', label: 'SQL' },
      { id: 'dart', label: 'Dart' },
    ],
  },
  {
    group: 'Building',
    skills: [
      { id: 'fullstack', label: 'Full-stack' },
      { id: 'react', label: 'React' },
      { id: 'node', label: 'Node / Express' },
      { id: 'fastapi', label: 'FastAPI' },
      { id: 'rest', label: 'REST APIs' },
      { id: 'flutter', label: 'Flutter' },
      { id: 'docker', label: 'Docker' },
    ],
  },
  {
    group: 'Intelligence & data',
    skills: [
      { id: 'llm', label: 'LLM systems' },
      { id: 'ml', label: 'Applied ML' },
      { id: 'pytorch', label: 'PyTorch' },
      { id: 'knowledge-graphs', label: 'Knowledge graphs' },
      { id: 'data-pipelines', label: 'Data pipelines' },
      { id: 'statistics', label: 'Statistics' },
      { id: 'databases', label: 'Databases' },
    ],
  },
] as const;

export type SkillId = (typeof skillTaxonomy)[number]['skills'][number]['id'];

/** Nodes in the interactive hero graph. Each one is a skill the lens can switch on. */
export const heroSkills: SkillId[] = ['fullstack', 'ml', 'llm', 'statistics', 'data-pipelines', 'knowledge-graphs'];

export type Experience = {
  id: string;
  role: string;
  org: string;
  orgNote?: string;
  dates: string;
  location: string;
  audience: string;
  points: string[];
  tech: string[];
  skills: SkillId[];
  link?: string;
  current?: boolean;
};

export const experience: Experience[] = [
  {
    id: 'itqan',
    // The build brief calls this "Educational Technology Developer"; the resume uses the title below.
    role: 'AI/ML Software Engineer Intern',
    org: 'ITQAN Academy',
    orgNote: 'ATLAS Internship Program',
    dates: 'May 2026 – Present',
    location: 'Champaign, IL',
    current: true,
    audience:
      'Students in Egypt and the Middle East learning math on a free, Khan Academy–inspired adaptive platform, with Professor Adam Osman.',
    points: [
      'Built an LLM-based knowledge-graph pipeline using schema-based Extract–Define–Canonicalize (EDC) extraction with LangChain and locally hosted models through Ollama, turning raw curriculum content into canonical concepts and prerequisite relations.',
      'Mapped 119 concepts across 13 units of the Grade 6 Egyptian math curriculum, then extended the graph to the Indian NCERT and US Grade 6 curricula.',
      'Validated the graph in layers: SHACL shape constraints for structure, natural language inference (NLI) to check extracted relations against the source text, and PyKEEN knowledge-graph embeddings to flag anomalous edges.',
      'Cleaned, validated, and organized the graph data into an algorithm-ready dataset for the downstream recommendation engine.',
      'Designed a three-layer adaptive recommendation architecture (Bayesian Knowledge Tracing with pyBKT, Hidden Markov modeling, and a contextual-bandit strategy) that personalizes learning paths from learner interaction data.',
    ],
    tech: ['Python', 'LangChain', 'Ollama', 'SHACL', 'NLI', 'PyKEEN', 'pyBKT', 'Neo4j', 'Knowledge graphs'],
    skills: ['python', 'llm', 'ml', 'knowledge-graphs', 'data-pipelines', 'statistics', 'databases'],
  },
  {
    id: 'idx',
    role: 'Software Development Engineer Intern',
    org: 'IDX Exchange',
    dates: 'June – August 2026',
    location: 'Remote',
    audience: 'People browsing homes and open houses, who need listings that load fast and stay accurate.',
    points: [
      'Built a full-stack real estate listings platform end to end, serving RETS-standard property and open-house data from a MySQL 8 database through a Node.js/Express REST API to a React (Vite) frontend.',
      'Developed the Express backend with a mysql2 connection pool and environment-based configuration, exposing REST endpoints that query and serve property and open-house records.',
      'Built the React frontend to fetch and render live property listings from the API.',
      'Containerized MySQL with Docker so the whole stack runs the same way on any machine.',
    ],
    tech: ['JavaScript', 'React', 'Vite', 'Node.js', 'Express', 'REST APIs', 'mysql2', 'MySQL 8', 'SQL', 'Docker'],
    skills: ['javascript', 'react', 'node', 'rest', 'sql', 'databases', 'docker', 'fullstack'],
    link: 'https://github.com/nitya-lohiya/IDX-Exchange-SDE-s26',
  },
  {
    id: 'nobe',
    role: 'Software Developer',
    org: 'National Organization for Business and Engineering',
    orgNote: 'NOBE Tech Committee',
    dates: 'Fall 2026 – Present',
    location: 'Champaign, IL',
    current: true,
    audience: 'Families and staff at a Chicago public elementary school.',
    points: [
      'Building, as part of a consulting team, an after-school program lottery system that replaces a Google Form → spreadsheet → manual-draw workflow.',
      'The system pairs a family-facing sign-up form and an admin dashboard with a tiered lottery engine that prioritizes students by need and carries unplaced students into the next round.',
      'Designed around student-privacy law (FERPA and SOPPA): no third-party analytics, synthetic data only in development, and student information kept out of logs.',
      'Work runs on an Agile cadence with weekly scrums, GitHub Issues, and branch-based pull requests.',
      // [ADD: one bullet on what YOU personally built, e.g. which tickets or screens you own]
    ],
    tech: ['Java', 'Spring Boot', 'PostgreSQL', 'JavaScript', 'HTML/CSS', 'JUnit', 'Git'],
    skills: ['java', 'javascript', 'sql', 'databases', 'fullstack'],
  },
  {
    id: 'illini-media',
    role: 'Software Developer',
    org: 'Illini Media Company',
    orgNote: 'The Daily Illini, WPGU 107.1, Illio, and more',
    dates: '2026 – Present',
    location: 'Champaign, IL',
    current: true,
    audience: 'Readers of The Daily Illini, UIUC’s independent student newspaper.',
    points: [
      'On the dev team building a personalized "For You" article feed for The Daily Illini website, so readers find the stories they care about.',
      // [ADD: your specific contribution, plus 1–2 more bullets]
    ],
    tech: ['Recommendation systems'], // [ADD: the actual stack]
    skills: ['ml'],
  },
  {
    id: 'acm',
    role: 'Project Manager',
    org: 'ACM SIG AI & Data Analytics @ UIUC',
    dates: 'Feb – May 2026',
    location: 'Champaign, IL',
    audience: 'Anyone whose inbox buries the emails that actually matter.',
    points: [
      'Led a 6-person team end to end: wrote the product spec, broke the work into tasks, delegated across model and API tracks, and owned software design through to a production-ready full-stack ML application.',
      'Fine-tuned a BERT-base transformer (110M parameters) with PyTorch and HuggingFace Transformers for multi-class email priority classification.',
      'Reached 96% test accuracy across all priority classes within 3 training epochs.',
      'Architected a production REST API in FastAPI with 5 endpoints for single and batch email classification.',
    ],
    tech: ['Python', 'PyTorch', 'HuggingFace Transformers', 'BERT', 'FastAPI', 'REST APIs'],
    skills: ['python', 'ml', 'pytorch', 'fastapi', 'rest', 'fullstack'],
    link: 'https://github.com/nitya-lohiya/Personalized-Email_Classifier',
  },
  {
    id: 'cs124',
    role: 'Course Assistant, CS 124',
    org: 'Siebel School of Computing and Data Science',
    dates: 'Jan 2026 – Present',
    location: 'Champaign, IL',
    current: true,
    audience: '30+ students taking their first programming course at UIUC.',
    points: [
      'Guide 30+ students through Java assignments, helping them read errors, trace their code, and fix bugs on their own.',
      'Break abstract CS concepts into concrete steps, and explain technical material clearly to students from non-technical backgrounds.',
    ],
    tech: ['Java', 'Debugging', 'Technical communication'],
    skills: ['java'],
  },
  {
    id: 'syrma',
    role: 'Software Engineer Intern',
    org: 'Syrma Johari MedTech',
    orgNote: 'Medical device design & manufacturing',
    dates: 'May – July 2025',
    location: 'Rajasthan, India',
    audience: 'Engineers testing medical devices, where reliable results matter.',
    points: [
      'Engineered automated Python data pipelines to ingest, clean, and analyze medical-device testing data, replacing manual analysis workflows.',
      'Cut evaluation turnaround time by about 30%.',
      'Validated embedded software for microcontroller-driven prototypes, finding and resolving defects to improve reliability and meet performance benchmarks.',
    ],
    tech: ['Python', 'Pandas', 'NumPy', 'Data pipelines', 'Embedded testing'],
    skills: ['python', 'data-pipelines'],
  },
];

export type Project = {
  id: string;
  title: string;
  summary: string;
  description: string;
  audience: string;
  role: string;
  context: string;
  stack: string[];
  skills: SkillId[];
  links: { label: string; href: string }[];
  status?: 'In progress';
  featured?: boolean;
  caseStudy?: { problem: string; built: string; decisions: string[]; outcome: string };
};

export const projects: Project[] = [
  {
    id: 'rso-connect',
    title: 'RSO Connect',
    summary: 'One place to discover 100+ UIUC student organizations and their events.',
    description:
      'A cross-platform Flutter app that replaces scattered Instagram posts and spreadsheets with a single discovery platform and a unified event calendar.',
    audience: 'UIUC students looking for their people, and the clubs trying to reach them.',
    role: 'Developer, team of 5',
    context: 'Dec 2025',
    stack: ['Flutter', 'Dart', 'Firebase', 'Git'],
    skills: ['dart', 'flutter', 'databases'],
    links: [{ label: 'Code', href: 'https://github.com/nitya-lohiya/RSO-Connect-Project' }],
    featured: true,
    caseStudy: {
      problem:
        'Student organizations advertised across Instagram, group chats, and spreadsheets, so students missed events and clubs struggled to be found.',
      built:
        'A cross-platform Flutter + Firebase app that centralizes 100+ RSOs, with a real-time event aggregation system that syncs each organization’s events into one calendar.',
      decisions: [
        'Chose Flutter so one codebase ships to both iOS and Android.',
        'Aggregated decentralized event data into a single unified calendar instead of linking out to each club.',
        'Ran post-launch user research with real students and iterated on features like calendar integration to improve retention and usability.',
      ],
      outcome: 'Shipped to real student users, with 100+ RSOs on a single platform.',
    },
  },
  {
    id: 'osli',
    title: 'OSLI: Open-Source License Intelligence',
    summary: 'An API that scores license risk and resolves conflicts across npm dependencies.',
    description:
      'A production-grade REST API with 8 endpoints for license risk scoring, dependency auditing, compatibility checks, and Gemini-powered conflict resolution, built on live npm registry data.',
    audience: 'Developers who want to ship without walking into a licensing problem.',
    role: 'Developer',
    context: 'HackIllinois · Feb 2026',
    stack: ['Python', 'FastAPI', 'Gemini', 'SPDX', 'async HTTP'],
    skills: ['python', 'fastapi', 'rest', 'llm'],
    links: [{ label: 'Code', href: 'https://github.com/nitya-lohiya/Open-Source-License-API' }],
    featured: true,
    caseStudy: {
      problem: 'License conflicts hide deep in dependency trees, and most developers never read the licenses they ship.',
      built:
        'A FastAPI service with 8 endpoints that pulls live package data from the npm registry, scores license risk against SPDX identifiers, and uses Gemini to explain and resolve conflicts.',
      decisions: [
        'Fetched registry data with async HTTP requests so audits of many packages stay fast.',
        'Added error handling and validation for edge cases such as missing or malformed license data.',
        'Split the API into focused endpoints for risk scoring, dependency auditing, compatibility checks, and AI conflict resolution.',
      ],
      outcome: 'Built and deployed during HackIllinois 2026.',
    },
  },
  {
    id: 'spoonbot',
    title: 'SpoonBot',
    summary: 'An allergy-friendly recipe recommender chatbot.',
    description:
      'A Streamlit app that maps a user’s allergy constraints to dynamic Spoonacular API queries, then uses Google Gemini to parse complex JSON into clean, structured recipes.',
    audience: 'People with food allergies who are tired of checking every ingredient by hand.',
    role: 'Developer',
    context: 'Oct 2025',
    stack: ['Python', 'Streamlit', 'Gemini', 'Spoonacular API', 'JSON'],
    skills: ['python', 'llm', 'rest'],
    links: [{ label: 'Code', href: 'https://github.com/nitya-lohiya/SpoonBot' }],
  },
  {
    id: 'travel-planner',
    title: 'AI Travel Planner',
    summary: 'An agentic, cost-optimizing trip planner for budget-conscious college students.',
    description:
      'Combines retrieval-augmented generation with real-time flight and hotel APIs to plan trips around a student budget.',
    audience: 'College students who want to travel without blowing their budget.',
    role: 'Team member, CS 222',
    context: 'CS 222 · Fall 2026',
    stack: ['RAG', 'LLM agents', 'Flight & hotel APIs'],
    skills: ['llm', 'rest'],
    links: [], // [ADD: repo link when ready]
    status: 'In progress',
  },
  {
    id: 'food-rec',
    title: 'Food Recommendation Pipeline',
    summary: 'A Random Forest classifier that recommends food, backed by a Postgres schema.',
    description: 'A team ML pipeline that trains a scikit-learn Random Forest on data stored in a Supabase PostgreSQL schema.',
    audience: 'Diners deciding what to eat next.', // [ADD: confirm who this was for]
    role: 'Team member', // [ADD: what you personally built]
    context: 'Team project',
    stack: ['Python', 'scikit-learn', 'Supabase', 'PostgreSQL', 'SQL'],
    skills: ['python', 'ml', 'sql', 'databases'],
    links: [], // [ADD: repo link]
  },
  {
    id: 'portfolio',
    title: 'This Portfolio',
    summary: 'The site you are on, built and tested like a production app.',
    description:
      'React + TypeScript with a skill-lens feature, a Vitest + Testing Library suite, and a GitHub Actions pipeline that checks every pull request and deploys main to GitHub Pages.',
    audience: 'Anyone who wants to see how I work, not just what I list.',
    role: 'Designer & developer',
    context: 'Oct 2026',
    stack: ['React', 'TypeScript', 'Vite', 'Vitest', 'GitHub Actions'],
    skills: ['javascript', 'react'],
    links: [{ label: 'Code', href: 'https://github.com/nitya-lohiya/nitya-lohiya.github.io' }],
  },
];

export const skills = [
  { group: 'Languages', items: ['Python', 'Java', 'C++', 'JavaScript / TypeScript', 'SQL', 'Dart', 'HTML/CSS'] },
  { group: 'Web & full-stack', items: ['React', 'Vite', 'Node.js', 'Express', 'FastAPI', 'REST APIs', 'Flutter', 'Streamlit'] },
  {
    group: 'ML & AI',
    items: ['PyTorch', 'HuggingFace Transformers', 'scikit-learn', 'LangChain', 'RAG', 'LLM applications', 'PyKEEN', 'pyBKT'],
  },
  { group: 'Data & infra', items: ['MySQL', 'PostgreSQL', 'Supabase', 'Firebase', 'Neo4j', 'Docker', 'Pandas', 'NumPy', 'Git'] },
  { group: 'Statistics', items: ['Probability', 'Statistical inference', 'Hypothesis testing', 'MLE'] },
  { group: 'Also', items: ['Product & project management', 'Technical mentoring'] },
];

export const beyond = [
  {
    id: 'dance',
    title: 'Bharatanatyam',
    text: 'Over ten years of classical Indian dance. I care about the art form and its history, and about how it gets commodified.',
  },
  { id: 'hiking', title: 'Hiking', text: 'Happiest on a trail, or anywhere I haven’t been yet.' },
  { id: 'music', title: 'Music', text: 'A big part of my everyday life.' }, // [ADD: a genre or artist, if you'd like]
  {
    id: 'book',
    title: 'A first book',
    text: 'The Fault in Our Stars was the first book I read cover to cover, and it stayed with me.',
  },
];

export const navLinks = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'resume', label: 'Resume' },
  { id: 'contact', label: 'Contact' },
];
