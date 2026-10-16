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

  // Alternatives: "From the database to the model to the button you click."
  //               "Full-stack apps and AI systems, built to actually help people."
  tagline: 'I build software end to end, and I care whether people can trust it.',
  positioning:
    'A CS + Statistics student who builds full-stack apps and AI/ML systems, from real estate listing platforms to knowledge-graph learning tools.',
  currently: 'building a "For You" article feed at Illini Media and an after-school lottery system with NOBE.',
} as const;

export const bio: string[] = [
  "Hi, I'm Nitya. I study Computer Science and Statistics at UIUC, and my favorite projects are the ones I get to build all the way through: the database, the model, and the interface someone actually clicks on.",
  "Lately that has meant a real estate listings platform at IDX Exchange, a BERT email classifier my team pushed to 96% accuracy, and a schema-constrained knowledge graph that maps a whole Grade 6 math curriculum for an adaptive learning platform. I've also led a team as a project manager and helped intro CS students untangle their first Java bugs.",
  "The question I keep coming back to is why AI systems fail, and what it takes to make them reliable enough to deserve people's trust.",
  "Away from a keyboard, I've practiced Bharatanatyam for more than ten years, and I'm always up for a hike or somewhere I haven't been yet.",
];

export const quickFacts = [
  { label: 'School', value: 'University of Illinois Urbana-Champaign' },
  { label: 'Degree', value: 'B.S. Computer Science + Statistics' },
  { label: 'Focus', value: 'Full-stack, applied ML, reliable LLM systems' },
];

export const highlights = [
  { value: '96%', label: 'test accuracy on a fine-tuned BERT email classifier' },
  { value: '119', label: 'curriculum concepts mapped in a knowledge graph' },
  { value: '6', label: 'person engineering team led as project manager' },
  { value: '30+', label: 'intro CS students mentored as a course assistant' },
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

export type Experience = {
  id: string;
  role: string;
  org: string;
  orgNote?: string;
  dates: string;
  location: string;
  points: string[];
  tags: string[];
  link?: string;
  current?: boolean;
};

export const experience: Experience[] = [
  {
    id: 'itqan',
    // The build brief calls this "Educational Technology Developer"; the resume says the title below.
    role: 'AI/ML Software Engineer Intern',
    org: 'ITQAN Academy',
    orgNote: 'ATLAS Internship Program',
    dates: 'May 2026 – Present',
    location: 'Champaign, IL',
    current: true,
    points: [
      'Working with Professor Adam Osman on a free, Khan Academy–inspired adaptive learning platform for students in Egypt and the Middle East.',
      'Built a schema-constrained knowledge-graph pipeline (EDC-style extraction with LangChain + Ollama, SHACL validation, NLI checks, PyKEEN anomaly detection) covering 119 concepts across 13 units of the Grade 6 Egyptian math curriculum.',
      'Extended the graph to the Indian NCERT and US Grade 6 curricula, and cleaned and validated it into an algorithm-ready dataset.',
      'Designed a three-layer recommendation architecture (Bayesian Knowledge Tracing with pyBKT, Hidden Markov modeling, contextual bandits) for personalized learning paths.',
    ],
    tags: ['LangChain', 'Ollama', 'SHACL', 'PyKEEN', 'pyBKT', 'Neo4j'],
  },
  {
    id: 'idx',
    role: 'Software Development Engineer Intern',
    org: 'IDX Exchange',
    dates: 'June – August 2026',
    location: 'Remote',
    points: [
      'Built a full-stack real estate listings platform serving RETS-standard property and open-house data from MySQL 8 through a Node.js/Express REST API to a React (Vite) frontend.',
      'Developed the Express backend with a mysql2 connection pool and environment-based configuration.',
      'Containerized MySQL with Docker for a reproducible local development environment.',
    ],
    tags: ['React', 'Vite', 'Node.js', 'Express', 'MySQL 8', 'Docker'],
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
    points: [
      "Part of a consulting team building an after-school program lottery system for a Chicago public elementary school, replacing a manual Google Form and spreadsheet workflow.",
      'The system pairs a family sign-up form and an admin dashboard with a tiered, seeded lottery engine, built with student-privacy requirements (FERPA/SOPPA) in mind.',
      // [ADD: one bullet on what YOU personally built, e.g. which tickets or screens you own]
    ],
    tags: ['Java', 'Spring Boot', 'PostgreSQL', 'JavaScript', 'JUnit'],
  },
  {
    id: 'illini-media',
    role: 'Software Developer',
    org: 'Illini Media Company',
    orgNote: 'The Daily Illini, WPGU 107.1, and more',
    dates: '2026 – Present',
    location: 'Champaign, IL',
    current: true,
    points: [
      'On the dev team building a personalized "For You" article feed for The Daily Illini website.',
      // [ADD: your specific contribution and stack once you have it]
    ],
    tags: ['Recommendation systems'],
  },
  {
    id: 'acm',
    role: 'Project Manager',
    org: 'ACM SIG AI & Data Analytics @ UIUC',
    dates: 'Feb – May 2026',
    location: 'Champaign, IL',
    points: [
      'Led a 6-person team, owning the product spec, task delegation, and software design for a full-stack ML application.',
      'Fine-tuned a BERT-base model (110M parameters) for multi-class email classification, reaching 96% test accuracy within 3 epochs.',
      'Architected a FastAPI service with 5 endpoints for single and batch classification.',
    ],
    tags: ['PyTorch', 'HuggingFace', 'BERT', 'FastAPI'],
    link: 'https://github.com/nitya-lohiya/Personalized-Email_Classifier',
  },
  {
    id: 'cs124',
    role: 'Course Assistant, CS 124',
    org: 'Siebel School of Computing and Data Science',
    dates: 'Jan 2026 – Present',
    location: 'Champaign, IL',
    current: true,
    points: [
      'Guide 30+ students through Java assignments in UIUC’s intro CS course, breaking abstract concepts into steps they can debug on their own.',
    ],
    tags: ['Java', 'Teaching'],
  },
  {
    id: 'syrma',
    role: 'Software Engineer Intern',
    org: 'Syrma Johari MedTech',
    orgNote: 'Medical device design & manufacturing',
    dates: 'May – July 2025',
    location: 'Rajasthan, India',
    points: [
      'Engineered automated Python pipelines to ingest, clean, and analyze medical device testing data, cutting evaluation turnaround by about 30%.',
      'Validated embedded software for microcontroller-driven prototypes, finding and resolving defects to meet performance benchmarks.',
    ],
    tags: ['Python', 'Pandas', 'Embedded testing'],
  },
];

/**
 * The skill vocabulary the project explorer filters on. Each project lists a subset of these
 * ids in `skills`; a test fails if a project uses an id that is not defined here.
 */
export const skillTaxonomy = [
  {
    group: 'Languages',
    skills: [
      { id: 'python', label: 'Python' },
      { id: 'javascript', label: 'JavaScript' },
      { id: 'java', label: 'Java' },
      { id: 'dart', label: 'Dart' },
      { id: 'sql', label: 'SQL' },
    ],
  },
  {
    group: 'Building',
    skills: [
      { id: 'react', label: 'React' },
      { id: 'node', label: 'Node / Express' },
      { id: 'fastapi', label: 'FastAPI' },
      { id: 'flutter', label: 'Flutter' },
      { id: 'rest', label: 'REST APIs' },
      { id: 'docker', label: 'Docker' },
    ],
  },
  {
    group: 'Intelligence & data',
    skills: [
      { id: 'llm', label: 'LLMs' },
      { id: 'ml', label: 'Machine learning' },
      { id: 'pytorch', label: 'PyTorch' },
      { id: 'knowledge-graphs', label: 'Knowledge graphs' },
      { id: 'databases', label: 'Databases' },
      { id: 'leadership', label: 'Team leadership' },
    ],
  },
] as const;

export type SkillId = (typeof skillTaxonomy)[number]['skills'][number]['id'];

export type Project = {
  id: string;
  title: string;
  summary: string;
  description: string;
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
    id: 'itqan-kg',
    title: 'Curriculum Knowledge Graph',
    summary: 'A schema-constrained knowledge graph that powers an adaptive learning platform.',
    description:
      'An LLM pipeline that reads curriculum content and turns it into a validated graph of concepts and prerequisites, so a recommendation engine can decide what a student should learn next.',
    role: 'AI/ML Software Engineer Intern, ITQAN Academy',
    context: 'ATLAS Internship · 2026',
    stack: ['LangChain', 'Ollama', 'SHACL', 'NLI', 'PyKEEN', 'pyBKT', 'Neo4j', 'Python'],
    skills: ['python', 'llm', 'knowledge-graphs', 'ml', 'databases'],
    links: [],
    featured: true,
    caseStudy: {
      problem:
        'An adaptive platform can only recommend the next lesson if it knows how concepts depend on each other, and free-form LLM output is too inconsistent to build that map on.',
      built:
        'An Extract–Define–Canonicalize pipeline with LangChain and Ollama, plus a Bayesian Knowledge Tracing engine (pyBKT) that reads learner interactions against the graph.',
      decisions: [
        'Constrained extraction to a schema, so every concept and relation has a defined shape before it enters the graph.',
        'Layered the checks: SHACL for structure, natural language inference for meaning, and PyKEEN embeddings to flag anomalous edges.',
        'Kept the graph curriculum-agnostic so it could extend beyond the original syllabus.',
      ],
      outcome:
        '119 concepts across 13 units of the Grade 6 Egyptian math curriculum, extended to Indian NCERT and US Grade 6, delivered as an algorithm-ready dataset.',
    },
  },
  {
    id: 'idx',
    title: 'IDX Real Estate Platform',
    summary: 'A full-stack listings app serving RETS-standard property and open-house data.',
    description:
      'A React frontend that fetches live listings from a Node/Express REST API backed by MySQL 8, with the database containerized so anyone can spin it up locally.',
    role: 'Software Development Engineer Intern',
    context: 'IDX Exchange · Summer 2026',
    stack: ['React', 'Vite', 'Node.js', 'Express', 'mysql2', 'MySQL 8', 'Docker'],
    skills: ['javascript', 'react', 'node', 'rest', 'sql', 'databases', 'docker'],
    links: [{ label: 'Code', href: 'https://github.com/nitya-lohiya/IDX-Exchange-SDE-s26' }],
    featured: true,
    caseStudy: {
      problem:
        'Property and open-house records in the RETS standard needed to reach a browser quickly and reliably, from a database that every developer could run the same way.',
      built:
        'Express REST endpoints over a mysql2 connection pool, a React (Vite) UI that renders listings from the API, and a Dockerized MySQL 8 instance.',
      decisions: [
        'Used a connection pool instead of per-request connections, so concurrent requests reuse database connections.',
        'Moved configuration into environment variables, keeping credentials out of the code.',
        'Containerized the database for a reproducible local setup.',
      ],
      outcome: 'A working end-to-end listings platform, from SQL tables to rendered property cards.',
    },
  },
  {
    id: 'email-classifier',
    title: 'Gmail BERT Email Classifier',
    summary: 'A fine-tuned BERT model that sorts email by priority, served through FastAPI.',
    description:
      'A production-style ML app that classifies incoming email into priority classes, with single and batch endpoints for the frontend to call.',
    role: 'Project Manager, team of 6',
    context: 'ACM SIG AI @ UIUC · Spring 2026',
    stack: ['Python', 'PyTorch', 'HuggingFace', 'BERT', 'FastAPI'],
    skills: ['python', 'ml', 'pytorch', 'fastapi', 'rest', 'leadership'],
    links: [{ label: 'Code', href: 'https://github.com/nitya-lohiya/Personalized-Email_Classifier' }],
    featured: true,
    caseStudy: {
      problem: 'Inboxes mix urgent and ignorable mail, and keyword rules miss context.',
      built:
        'A BERT-base (110M parameter) classifier fine-tuned with PyTorch and HuggingFace, behind a FastAPI service with 5 endpoints for single and batch classification.',
      decisions: [
        'Fine-tuned a pretrained transformer rather than training from scratch, so the model starts out understanding language.',
        'Exposed batch classification alongside single requests for bulk inbox processing.',
        'As PM, owned the spec and split work across six people so model and API work could run in parallel.',
      ],
      outcome: '96% test accuracy across all priority classes within 3 training epochs.',
    },
  },
  {
    id: 'osli',
    title: 'OSLI: Open-Source License Intelligence',
    summary: 'An API that scores license risk and resolves conflicts across npm dependencies.',
    description:
      'Built at HackIllinois: 8 endpoints for license risk scoring, dependency auditing, compatibility checks, and Gemini-powered conflict resolution, using live npm registry data.',
    role: 'Developer',
    context: 'HackIllinois · Feb 2026',
    stack: ['Python', 'FastAPI', 'Gemini', 'SPDX', 'async HTTP'],
    skills: ['python', 'fastapi', 'rest', 'llm'],
    links: [{ label: 'Code', href: 'https://github.com/nitya-lohiya/Open-Source-License-API' }],
  },
  {
    id: 'rso-connect',
    title: 'RSO Connect',
    summary: 'One place to discover 100+ UIUC student organizations and their events.',
    description:
      'A cross-platform Flutter app that replaces scattered Instagram posts and spreadsheets, with a real-time system that syncs RSO events into one calendar. We ran post-launch user research and iterated on features like calendar integration.',
    role: 'Developer, team of 5',
    context: 'Dec 2025',
    stack: ['Flutter', 'Dart', 'Firebase', 'Git'],
    skills: ['dart', 'flutter', 'databases'],
    links: [{ label: 'Code', href: 'https://github.com/nitya-lohiya/RSO-Connect-Project' }],
  },
  {
    id: 'nobe-lottery',
    title: 'After-School Lottery System',
    summary: 'A fair, auditable lottery that places elementary students into after-school programs.',
    description:
      'A NOBE consulting project replacing a manual spreadsheet lottery with a family sign-up form, an admin dashboard, and a seeded, tiered lottery engine that prioritizes the students who need a spot most.',
    role: 'Software Developer, NOBE Tech', // [ADD: your specific contribution]
    context: 'NOBE · Fall 2026',
    stack: ['Java', 'Spring Boot', 'PostgreSQL', 'JavaScript', 'JUnit'],
    skills: ['java', 'javascript', 'sql', 'databases'],
    links: [],
    status: 'In progress',
  },
  {
    id: 'travel-planner',
    title: 'AI Travel Planner',
    summary: 'An agentic, cost-optimizing trip planner for budget-conscious college students.',
    description:
      'Combines retrieval-augmented generation with real-time flight and hotel APIs to plan trips around a student budget.',
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
    description:
      'A team ML pipeline that trains a scikit-learn Random Forest on data stored in a Supabase PostgreSQL schema.',
    role: 'Team member', // [ADD: what you personally built]
    context: 'Team project',
    stack: ['Python', 'scikit-learn', 'Supabase', 'PostgreSQL'],
    skills: ['python', 'ml', 'sql', 'databases'],
    links: [], // [ADD: repo link]
  },
  {
    id: 'spoonbot',
    title: 'SpoonBot',
    summary: 'An allergy-friendly recipe recommender chatbot.',
    description:
      'A Streamlit app that turns a conversation about allergies into Spoonacular API queries, then uses Google Gemini to parse complex JSON into clean, structured recipes.',
    role: 'Developer',
    context: 'Oct 2025',
    stack: ['Python', 'Streamlit', 'Gemini', 'Spoonacular API'],
    skills: ['python', 'llm', 'rest'],
    links: [{ label: 'Code', href: 'https://github.com/nitya-lohiya/SpoonBot' }],
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
  { id: 'hiking', title: 'Hiking', text: 'Happiest on a trail, or anywhere I have not been yet.' },
  { id: 'music', title: 'Music', text: 'Always something playing while I build.' }, // [ADD: a genre or artist, if you'd like]
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
