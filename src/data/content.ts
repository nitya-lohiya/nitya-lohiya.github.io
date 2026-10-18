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
  positioning:
    'CS + Statistics at UIUC. I build LLM pipelines, fine-tuned models, and the APIs and interfaces that put them to work.',
} as const;

export const bio: string[] = [
  'Hi, I’m Nitya. I’m a CS + Statistics student at UIUC, and the parts of a system I like building most are the ones that have to be right: the model, the data underneath it, and the API that serves it.',
  'At ITQAN Academy I turned a Grade 6 math curriculum into a knowledge graph. An LLM pulls out the concepts and prerequisites, then SHACL rules, an NLI model, and PyKEEN embeddings check its work, because one wrong prerequisite edge sends a student down the wrong path. At IDX Exchange I built a React + Express + MySQL app over 53,000 property records and used EXPLAIN ANALYZE to tune composite indexes until the main filtered search ran in under a millisecond.',
  'The Statistics half of my degree shows up everywhere. The recommender I designed at ITQAN stacks Bayesian Knowledge Tracing, a Hidden Markov model, and a contextual bandit, and the email classifier my ACM team shipped falls back to rules whenever BERT is less than 70% sure. Knowing when a model is unsure is a big part of what makes it safe to use, and it’s the problem I want to keep working on: why AI systems fail, and how to make them reliable.',
  'I also TA for CS 124, which mostly means helping people read their first stack trace. When I’m not coding, I’m usually dancing (ten-plus years of Bharatanatyam) or out on a trail.',
];

export const quickFacts = [
  { label: 'School', value: 'University of Illinois Urbana-Champaign' },
  { label: 'Degree', value: 'B.S. Computer Science + Statistics' },
  { label: 'Focus', value: 'LLM systems, applied ML, full-stack engineering' },
  { label: 'Based in', value: 'Champaign-Urbana, IL' },
];

/** "What I build" strip under the hero: one technical focus area per card, each backed by real work. */
export const focusAreas = [
  {
    area: 'LLM + knowledge-graph pipelines',
    metric: '119',
    metricLabel: 'concepts, validated three ways',
    detail: 'Schema-constrained EDC extraction with LangChain + Ollama, checked by SHACL, NLI, and PyKEEN embeddings.',
    href: '#exp-itqan',
  },
  {
    area: 'Fine-tuned transformers',
    metric: '96%',
    metricLabel: 'test accuracy, 3 classes',
    detail: 'bert-base-uncased fine-tuned with AdamW and a linear LR schedule, behind a confidence-gated rule layer.',
    href: '#project-email-classifier',
  },
  {
    area: 'Full-stack + SQL performance',
    metric: '2.3→0.9ms',
    metricLabel: 'filtered search over 53K rows',
    detail: 'Express 5 + mysql2 REST API, composite indexes profiled with EXPLAIN ANALYZE, React 19 frontend.',
    href: '#exp-idx',
  },
  {
    area: 'Async Python APIs',
    metric: '8',
    metricLabel: 'FastAPI endpoints, deployed',
    detail: 'Pydantic v2 models, concurrent npm lookups with httpx + asyncio.gather, Gemini behind strict error handling.',
    href: '#project-osli',
  },
];

export const education = {
  school: 'University of Illinois Urbana-Champaign',
  degree: 'B.S. in Computer Science and Statistics',
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
    tech: [
      'Python',
      'LangChain',
      'Ollama',
      'EDC extraction',
      'SHACL',
      'NLI',
      'PyKEEN',
      'pyBKT',
      'Hidden Markov models',
      'Contextual bandits',
      'Neo4j',
    ],
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
      'Built a full-stack listings platform over 53,122 RETS-standard property records: a React 19 + Vite frontend, an Express 5 REST API, and MySQL 8 running in Docker.',
      'Designed REST endpoints for filtered, paginated search (city, ZIP, price range, beds, baths) using LIMIT/OFFSET with a COUNT query for page totals, plus property-detail and open-house endpoints.',
      'Hardened the API with parameterized queries through a mysql2 connection pool, strict query-parameter validation that returns 400s on bad input, and environment-based configuration.',
      'Profiled queries with EXPLAIN ANALYZE and added composite indexes, cutting the main filtered search from 2.3 ms to 0.9 ms and the pagination count from 5.6 ms to 3.6 ms, and rewrote city matching into a sargable form that can use an index.',
      'Built the UI with React Router: filters, pagination, a detail page with an image gallery and map, open-house schedules, and favorites synced across pages through useSyncExternalStore backed by localStorage.',
      'Tested both layers: Jest + Supertest for the API routes, and Vitest + React Testing Library for components and hooks.',
    ],
    tech: [
      'JavaScript',
      'React 19',
      'React Router',
      'Vite',
      'Node.js',
      'Express 5',
      'mysql2',
      'MySQL 8',
      'Docker',
      'Jest',
      'Supertest',
      'Vitest',
    ],
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
      'The system pairs a family-facing sign-up form and an admin dashboard with a Spring Boot backend and a tiered lottery engine that prioritizes students by need and carries unplaced students into the next round.',
      'The draw is seeded, so every round is reproducible and a disputed placement can be audited, and the engine is unit-tested with JUnit.',
      'Designed around student-privacy law (FERPA and SOPPA): no third-party analytics, synthetic data only in development, and student information kept out of logs.',
      // [ADD: one bullet on what YOU personally built, e.g. which tickets or screens you own]
    ],
    tech: ['Java', 'Spring Boot', 'Maven', 'PostgreSQL', 'JUnit', 'JavaScript', 'HTML/CSS', 'Git'],
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
      // [ADD: your specific contribution, the stack, and 1–2 more bullets]
    ],
    tech: ['Recommendation systems', 'Personalization'], // [ADD: the actual stack]
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
      'Led a 6-person team: wrote the product spec, split the work into data, model, API, and frontend tracks, and led the software design of a production-ready full-stack ML app.',
      'Built the data pipeline from a HuggingFace email dataset (10,780 training and 2,697 test emails), mapping 6 source categories into High, Medium, and Low priority.',
      'Fine-tuned bert-base-uncased (110M parameters) with PyTorch and HuggingFace Transformers: AdamW at a 2e-5 learning rate with a linear schedule, batch size 16, and 128-token inputs, reaching 96% test accuracy across all priority classes in 3 epochs.',
      'Served the model through FastAPI with single and batch classification endpoints and softmax confidence scores, plus a rule layer: security emails (verification codes, password resets) always go to High, and keyword and sender rules apply only when BERT’s confidence drops below 0.70.',
      'Connected live inboxes through Gmail OAuth endpoints and a React + Vite frontend that sorts email into priority columns.',
    ],
    tech: [
      'Python',
      'PyTorch',
      'HuggingFace Transformers',
      'bert-base-uncased',
      'Pandas',
      'scikit-learn',
      'FastAPI',
      'Gmail API (OAuth)',
      'React',
      'Vite',
    ],
    skills: ['python', 'ml', 'pytorch', 'fastapi', 'rest', 'react', 'data-pipelines', 'fullstack'],
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
      'Guide 30+ students through Java assignments, helping them read compiler errors and stack traces, trace their code, and fix bugs on their own.',
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
  caseStudy: { problem: string; built: string; decisions: string[]; outcome: string };
};

export const projects: Project[] = [
  {
    id: 'email-classifier',
    title: 'Gmail BERT Email Classifier',
    summary: 'A fine-tuned BERT model that sorts a live Gmail inbox into High, Medium, and Low priority, served through FastAPI.',
    description:
      'bert-base-uncased fine-tuned to 96% test accuracy on 2,697 held-out emails, wrapped in a confidence-gated rule layer and a FastAPI service with single, batch, and Gmail endpoints, plus a React + Vite inbox UI.',
    audience: 'Anyone whose inbox buries the emails that actually matter.',
    role: 'Project Manager, team of 6',
    context: 'ACM SIG AI @ UIUC · Spring 2026',
    stack: [
      'Python',
      'PyTorch',
      'HuggingFace Transformers',
      'bert-base-uncased',
      'FastAPI',
      'Pydantic',
      'Gmail API (OAuth)',
      'React',
      'Vite',
      'Pandas',
    ],
    skills: ['python', 'ml', 'pytorch', 'fastapi', 'rest', 'react', 'data-pipelines', 'fullstack'],
    links: [{ label: 'Code', href: 'https://github.com/nitya-lohiya/Personalized-Email_Classifier' }],
    featured: true,
    caseStudy: {
      problem:
        'Inboxes mix one-time passcodes and security alerts with promotions and social pings, and keyword filters miss context. Filing a verification code as low priority is the mistake that actually hurts.',
      built:
        'A data pipeline that maps a HuggingFace email dataset (10,780 training and 2,697 test emails) from 6 categories into 3 priorities, a fine-tuned bert-base-uncased classifier, a FastAPI service with /predict, /classify_batch, and Gmail OAuth endpoints, and a React + Vite UI that sorts a live inbox into priority columns.',
      decisions: [
        'Fine-tuned a pretrained bert-base-uncased (110M parameters) instead of training from scratch: AdamW at a 2e-5 learning rate, a linear schedule, batch size 16, 128-token inputs, and 3 epochs.',
        'Layered rules on top of BERT without replacing it. Security signals (verification codes, password resets, account-security senders) always route to High, while softer keyword and sender rules only break ties when BERT’s softmax confidence is below 0.70. Every prediction records whether it came from BERT or a rule.',
        'Validated at the API edge: empty text returns a 400, batches are capped at 100 emails, and each response reports per-email latency.',
        'Requested read-only Gmail access (gmail.readonly) through OAuth, and fetched messages in parallel with a thread pool before classifying them.',
      ],
      outcome: '96% test accuracy across all three priority classes in 3 epochs, running end to end from a Gmail inbox to a sorted priority view.',
    },
  },
  {
    id: 'osli',
    title: 'OSLI: Open-Source License Intelligence',
    summary: 'A deployed FastAPI service that scores license risk and resolves conflicts across npm dependencies.',
    description:
      '8 endpoints across discovery, risk & compliance, and developer tooling, combining the SPDX license list, live npm registry data, and Gemini 1.5 Flash. Deployed on Render with interactive Swagger docs.',
    audience: 'Developers who want to ship without walking into a licensing problem.',
    role: 'Developer, HackIllinois team',
    context: 'HackIllinois · Feb 2026',
    stack: ['Python', 'FastAPI', 'Pydantic v2', 'httpx', 'asyncio', 'Gemini 1.5 Flash', 'SPDX', 'Render'],
    skills: ['python', 'fastapi', 'rest', 'llm'],
    links: [
      { label: 'Code', href: 'https://github.com/nitya-lohiya/Open-Source-License-API' },
      { label: 'API docs', href: 'https://open-source-license-api.onrender.com/docs' },
    ],
    featured: true,
    caseStudy: {
      problem:
        'License conflicts hide deep in dependency trees. A single copyleft package can block a release, and most developers never read the licenses they ship.',
      built:
        'A FastAPI app with Pydantic v2 request and response models, an in-memory SPDX license index loaded at startup through FastAPI’s lifespan hook, httpx for npm registry calls, and Gemini for library search, risk analysis, conflict resolution, and license-header generation.',
      decisions: [
        'Kept the cheap checks deterministic: license IDs are validated against SPDX, and compatibility checks run against a hand-built compatibility matrix, so only open-ended questions go to the LLM.',
        'Batch audits fire every npm lookup concurrently with asyncio.gather(return_exceptions=True), so one broken package becomes a WARN row instead of failing the whole audit.',
        'Ran the blocking Gemini SDK through asyncio.to_thread so it never stalls the event loop, stripped markdown fences from replies, and mapped malformed JSON to a 502 and a missing API key to a 503.',
        'Normalized npm’s inconsistent license metadata (a string, an object, or an array) into a single license ID before scoring.',
      ],
      outcome: 'Built and deployed during HackIllinois 2026, live on Render with Swagger docs.',
    },
  },
  {
    id: 'rso-connect',
    title: 'RSO Connect',
    summary: 'A cross-platform Flutter app for discovering 100+ UIUC student organizations and their events.',
    description:
      'One Dart codebase targeting iOS, Android, web, and desktop: sign-in, an RSO directory, in-app membership applications, a "My RSOs" page, and a unified event calendar.',
    audience: 'UIUC students looking for their people, and the clubs trying to reach them.',
    role: 'Developer, team of 5',
    context: 'Dec 2025',
    stack: ['Flutter', 'Dart', 'ChangeNotifier', 'Syncfusion Calendar', 'table_calendar', 'Git'],
    skills: ['dart', 'flutter'],
    links: [{ label: 'Code', href: 'https://github.com/nitya-lohiya/RSO-Connect-Project' }],
    featured: true,
    caseStudy: {
      problem:
        'Student organizations advertised across Instagram, group chats, and spreadsheets, so students missed events and clubs struggled to be found.',
      built:
        'A Flutter app with a sign-in flow, an RSO directory, membership application forms, a "My RSOs" view, and a calendar built on Syncfusion’s Flutter calendar that aggregates events from every RSO a student joins.',
      decisions: [
        'Centralized event state in a singleton CalendarManager (a ChangeNotifier), so the calendar re-renders the moment a student joins an RSO or an event is added.',
        'Rebuilt the calendar from the student’s joined RSOs instead of keeping a separate copy, so events can’t drift out of sync with memberships.',
        'Chose Flutter so one codebase ships to every platform.',
        'Ran post-launch user research with real students and iterated on features like calendar integration to improve retention and usability.',
      ],
      outcome: 'Shipped to real student users, with 100+ RSOs on one platform.',
    },
  },
  {
    id: 'spoonbot',
    title: 'SpoonBot',
    summary: 'An allergy-aware recipe chatbot built on the Spoonacular API and Gemini.',
    description:
      'A Streamlit app that turns allergy checkboxes into Spoonacular complexSearch queries, fetches full recipe details for each hit, and falls back to a streaming Gemini 2.5 Flash chat for general cooking questions.',
    audience: 'People with food allergies who are tired of checking every ingredient by hand.',
    role: 'Developer',
    context: 'Oct 2025',
    stack: ['Python', 'Streamlit', 'Spoonacular API', 'Gemini 2.5 Flash', 'requests', 'JSON'],
    skills: ['python', 'llm', 'rest'],
    links: [{ label: 'Code', href: 'https://github.com/nitya-lohiya/SpoonBot' }],
    caseStudy: {
      problem: 'Recipe search ignores allergies, so people with intolerances end up screening every ingredient list by hand.',
      built:
        'A Streamlit chat UI with sidebar allergy filters, a Spoonacular integration (complexSearch, then a per-recipe information call), and a Gemini chat session for everything that isn’t a recipe request.',
      decisions: [
        'Mapped the selected allergies straight onto Spoonacular’s intolerances parameter, so unsafe recipes are filtered out by the API instead of after the fact.',
        'Parsed Spoonacular’s nested JSON (extendedIngredients, analyzedInstructions) into clean ingredient lists and numbered steps.',
        'Routed recipe requests to Spoonacular and everything else to Gemini, streaming Gemini’s replies so answers appear as they generate.',
        'Kept the conversation in st.session_state so chat history survives Streamlit’s reruns.',
      ],
      outcome: 'A working chatbot that returns three allergy-safe recipes per request, with full ingredients and steps.',
    },
  },
  {
    id: 'travel-planner',
    title: 'AI Travel Planner',
    summary: 'An agentic, cost-optimizing trip planner for budget-conscious college students.',
    description:
      'An LLM agent that grounds its plans in retrieval-augmented generation and real-time flight and hotel APIs, optimizing a trip around a student’s budget.',
    audience: 'College students who want to travel without blowing their budget.',
    role: 'Team member, CS 222', // [ADD: the part you own]
    context: 'CS 222 · Fall 2026',
    stack: ['Python', 'LLM agents', 'RAG', 'Flight APIs', 'Hotel APIs'], // [ADD: confirm the exact stack]
    skills: ['llm', 'rest'],
    links: [], // [ADD: repo link when ready]
    status: 'In progress',
    caseStudy: {
      problem:
        'Planning a cheap trip means juggling flight sites, hotel sites, and spreadsheets, and an LLM on its own will make up prices.',
      built:
        'In progress: an agent that calls real-time flight and hotel APIs and uses retrieval-augmented generation to ground its recommendations.',
      decisions: [
        'Ground every recommendation in live API data and retrieved context rather than the model’s memory, since prices change daily.',
        'Optimize for the total cost of the trip under a student’s budget, not just the cheapest single flight.',
      ],
      outcome: 'Under active development as a CS 222 team project.',
    },
  },
  {
    id: 'food-rec',
    title: 'Food Recommendation Pipeline',
    summary: 'A scikit-learn Random Forest recommender backed by a Supabase PostgreSQL schema.',
    description:
      'A team ML pipeline that stores its data in a relational PostgreSQL schema on Supabase and trains a scikit-learn Random Forest classifier on it to make food recommendations.',
    audience: 'Diners deciding what to eat next.', // [ADD: confirm who this was for]
    role: 'Team member', // [ADD: what you personally built]
    context: 'Team project',
    stack: ['Python', 'scikit-learn', 'Random Forest', 'Supabase', 'PostgreSQL', 'SQL'],
    skills: ['python', 'ml', 'sql', 'databases', 'data-pipelines'],
    links: [], // [ADD: repo link]
    caseStudy: {
      problem: 'Recommending food well means learning from structured data about items and preferences, not hard-coded rules.',
      built:
        'A Supabase-hosted PostgreSQL schema that holds the data, and a scikit-learn Random Forest classifier trained on it to produce recommendations.',
      decisions: [
        'Kept the data in a relational schema so training and serving read from one source of truth.',
        'Used a Random Forest, an ensemble of decision trees that handles mixed feature types and exposes feature importances.',
      ],
      outcome: 'A working end-to-end pipeline from database to trained model.', // [ADD: accuracy or other results]
    },
  },
];

export const skills = [
  { group: 'Languages', items: ['Python', 'Java', 'C++', 'JavaScript / TypeScript', 'SQL', 'Dart', 'HTML/CSS'] },
  {
    group: 'Web & full-stack',
    items: ['React', 'React Router', 'Vite', 'Node.js', 'Express', 'FastAPI', 'Pydantic', 'REST APIs', 'Flutter', 'Streamlit'],
  },
  {
    group: 'ML & AI',
    items: [
      'PyTorch',
      'HuggingFace Transformers',
      'BERT fine-tuning',
      'scikit-learn',
      'LangChain',
      'Ollama',
      'RAG',
      'NLI',
      'PyKEEN',
      'pyBKT',
    ],
  },
  {
    group: 'Data & infra',
    items: ['MySQL', 'PostgreSQL', 'Supabase', 'Firebase', 'Neo4j', 'SHACL', 'Docker', 'Pandas', 'NumPy', 'Git', 'GitHub Actions'],
  },
  { group: 'Testing', items: ['Jest', 'Supertest', 'Vitest', 'React Testing Library', 'JUnit'] },
  {
    group: 'Statistics',
    items: ['Probability', 'Statistical inference', 'Hypothesis testing', 'MLE', 'Bayesian Knowledge Tracing', 'Hidden Markov models'],
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

/**
 * The hike. Every section is a stop on the trail, from the trailhead (the hero) to the summit
 * (contact). Elevations are made up, but they rise with the page; Champaign really does sit
 * at about 740 ft.
 */
export const trail = [
  { id: 'top', label: 'Start', stop: 'Trailhead', elevation: 740 },
  { id: 'about', label: 'About', stop: 'First switchback', elevation: 1180 },
  { id: 'experience', label: 'Experience', stop: 'The climb', elevation: 2460 },
  { id: 'projects', label: 'Projects', stop: 'Side trails', elevation: 3120 },
  { id: 'skills', label: 'Skills', stop: 'Gear check', elevation: 3580 },
  { id: 'resume', label: 'Resume', stop: 'Trail map', elevation: 3940 },
  { id: 'contact', label: 'Contact', stop: 'Summit', elevation: 4410 },
] as const;

/**
 * Handwritten margin notes. Short and plain, the way I'd scribble them in a trail journal.
 * [EDIT: rewrite any of these in your own words]
 */
export const notes = {
  hero: 'pick a skill, I’ll show you the trail',
  lens: 'these are trail blazes. follow one!',
  itqan: '119 concepts, each one checked three ways',
  idx: 'indexes matter: 2.3 ms → 0.9 ms',
  projects: 'the side trails are where I try new gear',
  contact: 'you made it to the summit. say hi!',
};
