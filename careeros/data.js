/* Pathwise — static catalog: careers, skills, opportunities, learning, quizzes.
 * All figures (salaries, companies, listings) are ILLUSTRATIVE SEED DATA for the
 * prototype. Production replaces this with the Opportunity Graph service. */
const CareerData = {
  CITIES: ['Hyderabad', 'Bengaluru', 'Pune', 'Chennai', 'Mumbai', 'Delhi NCR'],
  STAGES: [
    ['student', 'Student', 'Still in college, figuring things out'],
    ['explorer', 'Explorer', 'Trying to find the right direction'],
    ['learner', 'Learner', 'Learning skills actively'],
    ['builder', 'Builder', 'Building projects'],
    ['intern', 'Intern', 'Looking for or doing an internship'],
    ['fresher', 'Fresher', 'Looking for a first job'],
    ['professional', 'Professional', 'Growing or switching careers'],
  ],
  LEVELS: ['', 'Beginner', 'Basic', 'Working', 'Strong', 'Expert'],

  SKILLS: ['Python', 'Java', 'SQL', 'JavaScript', 'TypeScript', 'React', 'CSS', 'Git', 'Data Structures',
    'System Design', 'APIs', 'Machine Learning', 'Deep Learning', 'PyTorch', 'MLOps', 'NLP', 'Statistics',
    'Excel', 'Power BI', 'Figma', 'UI Design', 'User Research'],

  // skills: [name, required level 1-5, importance weight]
  CAREERS: {
    ai: {
      title: 'AI Engineer', blurb: 'Build models and ship intelligent products', enjoy: 'Building AI and ML things',
      skills: [['Python', 4, 3], ['Machine Learning', 3, 3], ['Statistics', 3, 2], ['PyTorch', 3, 2], ['Deep Learning', 3, 2], ['SQL', 2, 1], ['Git', 2, 1], ['MLOps', 2, 1]],
      project: 'Image classification app with a trained and evaluated model',
      demand: ['Bengaluru', 'Hyderabad', 'Pune'], companies: 'AI product startups, SaaS firms, research labs',
      path: [
        [0, 'Learn ML foundations, build 2 projects', 'Python, Statistics, scikit-learn, PyTorch basics', 'Self-study + projects', 'No salary'],
        [1, 'AI / ML internship', 'Model training, evaluation, data pipelines', 'Internship', 'Rs 20k–40k / month'],
        [2, 'Junior AI Engineer', 'Deep learning, deployment, MLOps basics', '0–1 yr experience', 'Rs 6–14 LPA'],
        [4, 'AI Engineer', 'Production ML, system design, mentoring', '2–3 yrs experience', 'Rs 14–30 LPA'],
      ],
    },
    data: {
      title: 'Data Analyst', blurb: 'Turn data into decisions', enjoy: 'Finding insights in data',
      skills: [['SQL', 4, 3], ['Excel', 4, 2], ['Power BI', 3, 2], ['Statistics', 3, 2], ['Python', 3, 2]],
      project: 'End-to-end sales dashboard with a written insights summary',
      demand: ['Hyderabad', 'Bengaluru', 'Mumbai'], companies: 'Fintech, retail, consulting, analytics firms',
      path: [
        [0, 'Master SQL + a BI tool, build 2 dashboards', 'SQL, Excel, Power BI, basic statistics', 'Self-study + projects', 'No salary'],
        [1, 'Analytics internship', 'Reporting, cleaning data, stakeholder updates', 'Internship', 'Rs 15k–25k / month'],
        [2, 'Data Analyst', 'Python, experimentation, storytelling', '0–1 yr experience', 'Rs 4–8 LPA'],
        [4, 'Senior Analyst', 'Ownership of metrics, mentoring, domain depth', '2–4 yrs experience', 'Rs 9–18 LPA'],
      ],
    },
    frontend: {
      title: 'Frontend Developer', blurb: 'Craft fast, delightful interfaces', enjoy: 'Making interfaces people love',
      skills: [['JavaScript', 4, 3], ['React', 4, 3], ['CSS', 3, 2], ['TypeScript', 3, 2], ['Git', 2, 1], ['APIs', 2, 1]],
      project: 'A responsive React app that consumes a real API, deployed publicly',
      demand: ['Bengaluru', 'Pune', 'Hyderabad'], companies: 'Product startups, agencies, SaaS companies',
      path: [
        [0, 'Learn modern JS, React and TypeScript; ship 2 apps', 'JavaScript, React, CSS, TypeScript', 'Self-study + projects', 'No salary'],
        [1, 'Frontend internship', 'Component design, API integration, code review', 'Internship', 'Rs 15k–30k / month'],
        [2, 'Junior Frontend Developer', 'Testing, performance, accessibility', '0–1 yr experience', 'Rs 5–10 LPA'],
        [4, 'Frontend Developer', 'Architecture, design systems, mentoring', '2–3 yrs experience', 'Rs 10–22 LPA'],
      ],
    },
    backend: {
      title: 'Software Engineer', blurb: 'Build the systems products run on', enjoy: 'Solving logic and systems problems',
      skills: [['Data Structures', 3, 3], ['Python', 3, 2], ['SQL', 3, 2], ['APIs', 3, 2], ['Git', 2, 1], ['System Design', 2, 2]],
      project: 'A REST API with auth, a database and tests, deployed',
      demand: ['Hyderabad', 'Bengaluru', 'Chennai'], companies: 'Product companies, services firms, startups',
      path: [
        [0, 'Strengthen DSA, build an API project', 'Data Structures, SQL, APIs, Git', 'Self-study + projects', 'No salary'],
        [1, 'Engineering internship / apprenticeship', 'Real codebases, code review, testing', 'Internship', 'Rs 18k–35k / month'],
        [2, 'Software Engineer (Fresher)', 'System design basics, ownership of features', '0–1 yr experience', 'Rs 6–12 LPA'],
        [4, 'Software Engineer II', 'Design, reliability, mentoring', '2–3 yrs experience', 'Rs 12–28 LPA'],
      ],
    },
    ux: {
      title: 'Product Designer', blurb: 'Design products people understand and love', enjoy: 'Designing experiences',
      skills: [['Figma', 4, 3], ['UI Design', 3, 3], ['User Research', 3, 2], ['CSS', 2, 1]],
      project: 'A case study: research, flows, hi-fi prototype, usability test results',
      demand: ['Bengaluru', 'Mumbai', 'Pune'], companies: 'Product startups, design studios, agencies',
      path: [
        [0, 'Learn Figma + research, publish 2 case studies', 'Figma, UI Design, User Research', 'Self-study + projects', 'No salary'],
        [1, 'Design internship', 'Wireframes, prototypes, usability testing', 'Internship', 'Rs 12k–25k / month'],
        [2, 'Junior Product Designer', 'End-to-end design, collaboration with engineers', '0–1 yr experience', 'Rs 4–9 LPA'],
        [4, 'Product Designer', 'Product strategy, design systems', '2–4 yrs experience', 'Rs 10–24 LPA'],
      ],
    },
  },
  RELATED: { 'ai|data': 0.6, 'ai|backend': 0.5, 'data|backend': 0.4, 'backend|frontend': 0.5, 'frontend|ux': 0.5, 'data|frontend': 0.2 },

  // Learning catalog placeholders — titles describe what to learn, not specific vendors.
  LEARN: {
    Python: ['Python fundamentals: data types, functions, files', 'Practice: 30 small problems', 'Python for data work (pandas)'],
    SQL: ['SQL basics: SELECT, JOIN, GROUP BY', 'Practice: window functions and CTEs', 'Query a messy real dataset'],
    Statistics: ['Descriptive stats and distributions', 'Hypothesis testing in plain language', 'A/B test case study'],
    'Machine Learning': ['ML foundations: regression and classification', 'scikit-learn hands-on', 'Model evaluation and overfitting'],
    PyTorch: ['Tensors and autograd basics', 'Train a small neural network', 'Fine-tune a pretrained model'],
    'Deep Learning': ['Neural network fundamentals', 'CNNs for images', 'Transformers explained'],
    MLOps: ['Packaging a model as an API', 'Experiment tracking basics', 'Deploying a model container'],
    'Power BI': ['Power BI interface and data modelling', 'DAX essentials', 'Build a dashboard from a CSV'],
    Excel: ['Formulas and lookups', 'Pivot tables', 'Dashboards in Excel'],
    JavaScript: ['Modern JavaScript (ES6+)', 'Async, fetch and promises', 'DOM and events'],
    TypeScript: ['TypeScript basics for JS developers', 'Typing React components', 'Generics in practice'],
    React: ['React components, props and state', 'Hooks in depth', 'Build and deploy a small app'],
    CSS: ['Flexbox and Grid', 'Responsive design', 'CSS architecture'],
    Git: ['Git basics: commit, branch, merge', 'Pull requests workflow', 'Resolving conflicts'],
    APIs: ['REST principles', 'Build a CRUD API', 'Auth and error handling'],
    'Data Structures': ['Arrays, hashing, stacks, queues', 'Trees and graphs', 'Daily problem practice'],
    'System Design': ['Systems design 101: scaling basics', 'Caching and databases', 'Design a URL shortener'],
    Java: ['Java fundamentals and OOP', 'Collections and streams', 'Build a Spring REST service'],
    NLP: ['Text preprocessing and embeddings', 'Build a text classifier', 'Intro to LLM applications'],
    Figma: ['Figma frames, components, auto layout', 'Prototyping flows', 'Build a mini design system'],
    'UI Design': ['Visual hierarchy and typography', 'Design a mobile screen set', 'Accessibility basics'],
    'User Research': ['Interviewing users', 'Usability testing', 'Synthesising findings'],
  },
  LEARN_HOURS: [6, 10, 14],

  // type: job | internship | apprenticeship | freelance | project | hackathon | competition | campus
  // skills: [name, required level, must-have]
  OPPS: [
    { id: 'o1', type: 'job', title: 'Junior AI Engineer', company: { name: 'NeuraLoop', verified: true, hiring: 'Active: 14 hires in 12 mo' }, career: 'ai', city: 'Bengaluru', remote: true, pay: 'Rs 8–14 LPA', skills: [['Python', 4, 1], ['Machine Learning', 3, 1], ['PyTorch', 3, 0], ['SQL', 2, 0], ['Git', 2, 0]], desc: 'Work on recommendation models with a small ML team. Fresh graduates with strong projects welcome.', contact: 'careers@neuraloop.example' },
    { id: 'o2', type: 'internship', title: 'AI Intern', company: { name: 'Vectorly Labs', verified: true, hiring: 'Active: 6 interns this year' }, career: 'ai', city: 'Hyderabad', remote: false, pay: 'Rs 25k–35k / month', skills: [['Python', 3, 1], ['Machine Learning', 2, 1], ['Statistics', 2, 0], ['Git', 2, 0]], desc: '6-month internship on NLP features. Mentored by two senior engineers. PPO possible.', contact: 'interns@vectorly.example' },
    { id: 'o3', type: 'job', title: 'Data Analyst (Fresher)', company: { name: 'Finlytic', verified: true, hiring: 'Active: 9 hires in 12 mo' }, career: 'data', city: 'Hyderabad', remote: false, pay: 'Rs 5–8 LPA', skills: [['SQL', 4, 1], ['Excel', 3, 1], ['Power BI', 3, 0], ['Statistics', 2, 0], ['Python', 2, 0]], desc: 'Own weekly business reporting for a lending product. Training provided on our BI stack.', contact: 'talent@finlytic.example' },
    { id: 'o4', type: 'internship', title: 'Business Analytics Intern', company: { name: 'RetailGrid', verified: true, hiring: 'Active: 4 interns this year' }, career: 'data', city: 'Remote', remote: true, pay: 'Rs 15k–20k / month', skills: [['Excel', 3, 1], ['SQL', 3, 1], ['Power BI', 2, 0]], desc: 'Support category managers with sales analysis. Flexible hours for students.', contact: 'hr@retailgrid.example' },
    { id: 'o5', type: 'job', title: 'Frontend Developer', company: { name: 'Pixelcraft', verified: true, hiring: 'Active: 11 hires in 12 mo' }, career: 'frontend', city: 'Pune', remote: true, pay: 'Rs 6–10 LPA', skills: [['JavaScript', 4, 1], ['React', 4, 1], ['TypeScript', 3, 0], ['CSS', 3, 0], ['Git', 2, 0]], desc: 'Build the web app for a design-collaboration product used by 40k teams.', contact: 'jobs@pixelcraft.example' },
    { id: 'o6', type: 'internship', title: 'Frontend Intern', company: { name: 'Lumio', verified: true, hiring: 'Active: 5 interns this year' }, career: 'frontend', city: 'Remote', remote: true, pay: 'Rs 20k–25k / month', skills: [['JavaScript', 3, 1], ['React', 2, 1], ['CSS', 3, 0]], desc: 'Ship real UI features in a small product team. Weekly mentoring.', contact: 'careers@lumio.example' },
    { id: 'o7', type: 'job', title: 'Software Engineer — Fresher', company: { name: 'Orbitron Systems', verified: true, hiring: 'Active: 22 hires in 12 mo' }, career: 'backend', city: 'Hyderabad', remote: true, pay: 'Rs 6–10 LPA', skills: [['Python', 3, 1], ['Data Structures', 3, 1], ['Git', 2, 0], ['SQL', 2, 0], ['System Design', 2, 0], ['React', 2, 0]], desc: 'Join a platform team building internal developer tools. Rotational onboarding.', contact: 'campus@orbitron.example' },
    { id: 'o8', type: 'apprenticeship', title: 'Backend Apprentice', company: { name: 'CloudNest', verified: true, hiring: 'Active: 8 apprentices this year' }, career: 'backend', city: 'Chennai', remote: false, pay: 'Rs 18k–22k / month', skills: [['Java', 3, 1], ['SQL', 3, 0], ['Git', 2, 0], ['APIs', 2, 0]], desc: '12-month paid apprenticeship with structured learning and a conversion path to full-time.', contact: 'apprentice@cloudnest.example' },
    { id: 'o9', type: 'internship', title: 'UX Design Intern', company: { name: 'Studio Kite', verified: true, hiring: 'Active: 3 interns this year' }, career: 'ux', city: 'Mumbai', remote: true, pay: 'Rs 12k–18k / month', skills: [['Figma', 3, 1], ['UI Design', 3, 1], ['User Research', 2, 0]], desc: 'Work on mobile app redesigns for consumer brands.', contact: 'design@studiokite.example' },
    { id: 'o10', type: 'freelance', title: 'Build dashboards for a D2C brand', company: { name: 'Bloomcart', verified: true, hiring: 'Active: 3 freelancers engaged' }, career: 'data', city: 'Remote', remote: true, pay: 'Rs 15k–25k / project', skills: [['Excel', 3, 1], ['Power BI', 3, 0], ['SQL', 2, 1]], desc: 'Two-week paid project: build a sales and inventory dashboard from CSV exports.', contact: 'projects@bloomcart.example' },
    { id: 'o11', type: 'project', title: 'Build a resume-parsing prototype', company: { name: 'Hiresight', verified: true, hiring: 'Startup · 2 student projects hired' }, career: 'ai', city: 'Remote', remote: true, pay: 'Portfolio + certificate; top builders interviewed', skills: [['Python', 3, 1], ['NLP', 2, 0], ['APIs', 2, 0]], desc: 'Prototype that extracts skills from resumes. Mentor reviews every milestone. Strong submissions get a hiring conversation.', contact: 'builders@hiresight.example' },
    { id: 'o12', type: 'project', title: 'Open source: add charts to a data CLI', company: { name: 'OpenTabulate (community)', verified: true, hiring: 'Open-source community' }, career: 'data', city: 'Remote', remote: true, pay: 'Open-source contribution', skills: [['Python', 3, 1], ['Git', 2, 1], ['Statistics', 2, 0]], desc: 'Good first issue: add histogram and boxplot output. Maintainers review within a week.', contact: 'github discussions' },
    { id: 'o13', type: 'project', title: 'Redesign a landing page for an NGO', company: { name: 'Seva Digital', verified: true, hiring: 'Non-profit · design partner' }, career: 'frontend', city: 'Remote', remote: true, pay: 'Portfolio + reference letter', skills: [['CSS', 3, 1], ['React', 2, 0], ['Figma', 2, 0]], desc: 'Real users, real traffic. Ship a responsive, accessible redesign.', contact: 'hello@sevadigital.example' },
    { id: 'o14', type: 'hackathon', title: 'Smart India Hackathon (annual)', company: { name: 'National hackathon', verified: true, hiring: 'Nationwide' }, career: null, city: 'Multiple', remote: false, pay: 'Prizes + recognition', skills: [['Python', 2, 0], ['JavaScript', 2, 0], ['Git', 2, 0]], desc: 'Team-based problem statements from ministries and industry. Results become verified career evidence.', contact: 'official portal' },
    { id: 'o15', type: 'hackathon', title: 'Build for Bharat — AI Sprint', company: { name: 'DevCircle', verified: true, hiring: 'Community event' }, career: 'ai', city: 'Hyderabad', remote: true, pay: 'Prizes + interviews with sponsors', skills: [['Python', 3, 1], ['Machine Learning', 2, 0], ['APIs', 2, 0]], desc: '48-hour hackathon on AI for local-language apps. Teams of up to 4.', contact: 'team@devcircle.example' },
    { id: 'o16', type: 'competition', title: 'Data Storytelling Challenge', company: { name: 'Analytics Guild', verified: true, hiring: 'Community competition' }, career: 'data', city: 'Remote', remote: true, pay: 'Certificates + sponsor visibility', skills: [['Excel', 2, 0], ['Power BI', 2, 0], ['SQL', 2, 1]], desc: 'Turn a public dataset into a story and a dashboard. Judged by practising analysts.', contact: 'guild@analytics.example' },
    { id: 'o17', type: 'campus', title: 'Hyderabad Colleges Joint Placement Drive', company: { name: 'Placement consortium', verified: true, hiring: '12 companies attending' }, career: 'backend', city: 'Hyderabad', remote: false, pay: 'Rs 4–9 LPA (varies)', skills: [['Data Structures', 2, 1], ['SQL', 2, 0], ['Python', 2, 0]], desc: 'Pooled drive for final-year students across partner colleges.', contact: 'tpo@consortium.example' },
    { id: 'o18', type: 'internship', title: 'Data Analyst Intern', company: { name: 'Quantara', verified: true, hiring: 'Active: 7 interns this year' }, career: 'data', city: 'Bengaluru', remote: true, pay: 'Rs 18k–25k / month', skills: [['SQL', 3, 1], ['Excel', 3, 0], ['Python', 2, 0], ['Power BI', 2, 0]], desc: 'Embedded in the growth team. Weekly reviews, real stakeholders.', contact: 'interns@quantara.example' },
    // --- Scam samples (the fraud shield should catch these) ---
    { id: 'x1', type: 'internship', title: 'Data Entry Intern — Work From Home, 100% Placement Guarantee', company: { name: 'SkillBridge Careers', verified: false, hiring: 'No hiring history' }, career: null, city: 'Remote', remote: true, pay: 'Rs 30,000 / month', skills: [], desc: 'Limited seats! Pay Rs 2,999 registration fee and training kit fee (refundable). Guaranteed placement, no interview. Contact on WhatsApp now.', contact: 'whatsapp +91-98xxxxxx00 / skillbridge.careers@gmail.com' },
    { id: 'x2', type: 'job', title: 'Software Trainee — 40 LPA, No Experience Needed', company: { name: 'GlobalTech Hiring Desk', verified: false, hiring: 'No hiring history' }, career: null, city: 'Remote', remote: true, pay: 'Rs 40 LPA', skills: [], desc: 'Immediate joining. Security deposit of Rs 5,000 required before offer letter. No interview, selection guaranteed. Telegram us.', contact: 'telegram @globaltech_hr' },
  ],

  QUIZ: {
    Python: [['What does len([1,2,3][1:]) return?', ['1', '2', '3', 'Error'], 1], ['Which of these is mutable?', ['tuple', 'str', 'list', 'int'], 2], ['What is {x % 2 for x in range(5)}?', ['[0,1,0,1,0]', '{0, 1}', '{0, 1, 2}', 'Error'], 1]],
    SQL: [['Which clause filters groups after aggregation?', ['WHERE', 'HAVING', 'GROUP BY', 'ORDER BY'], 1], ['Which join keeps all rows from the left table?', ['INNER JOIN', 'LEFT JOIN', 'CROSS JOIN', 'SELF JOIN'], 1], ['How does COUNT(column) differ from COUNT(*)?', ['It is faster', 'It ignores NULLs in that column', 'It counts distinct values', 'It counts only numbers'], 1]],
    JavaScript: [['What does typeof null return?', ['"null"', '"undefined"', '"object"', '"number"'], 2], ['What does [1,2,3].map(x => x * 2) do?', ['Mutates the original array', 'Returns a new array [2,4,6]', 'Returns 12', 'Returns undefined'], 1], ['What is "5" === 5?', ['true', 'false', 'TypeError', 'undefined'], 1]],
    React: [['Which hook adds local state to a function component?', ['useEffect', 'useRef', 'useState', 'useMemo'], 2], ['Why do list items need keys?', ['For styling', 'To help React identify which items changed', 'To sort them', 'They do not'], 1], ['Props are…', ['Mutable state', 'Read-only inputs from a parent', 'Global variables', 'Event handlers only'], 1]],
    Excel: [['Which function looks up a value in the first column and returns another column?', ['SUMIF', 'VLOOKUP', 'COUNTA', 'TRIM'], 1], ['Which is an absolute reference?', ['A1', 'A$1', '$A$1', '[A1]'], 2], ['PivotTables are used to…', ['Summarise and group data', 'Spell-check', 'Encrypt files', 'Draw shapes'], 0]],
    Statistics: [['What is the median of [1, 2, 3, 4, 100]?', ['3', '22', '4', '2.5'], 0], ['A p-value below 0.05 conventionally suggests…', ['The null hypothesis is proven', 'Evidence against the null hypothesis', 'The effect is large', 'No effect'], 1], ['Standard deviation measures…', ['Central tendency', 'Spread of data', 'Sample size', 'Correlation'], 1]],
  },

  INTERVIEW: {
    behavioral: [
      ['Tell me about a time you worked in a team and faced a disagreement.', ['team', 'disagree', 'resolved', 'listened', 'result', 'outcome']],
      ['Describe a project you are proud of. What was your specific contribution?', ['built', 'i', 'result', 'users', 'learned', 'challenge']],
      ['Tell me about a time you failed or made a mistake. What did you do next?', ['mistake', 'learned', 'fixed', 'next', 'improved', 'feedback']],
    ],
    hr: [
      ['Tell me about yourself.', ['student', 'skills', 'project', 'interested', 'looking', 'goal']],
      ['Why do you want this role?', ['interest', 'learn', 'skills', 'contribute', 'team', 'growth']],
      ['Where do you see yourself in three years?', ['grow', 'skills', 'responsibility', 'learn', 'contribute', 'team']],
    ],
    technical: {
      ai: [['Explain overfitting and two ways to reduce it.', ['overfit', 'training', 'validation', 'regularization', 'data', 'dropout', 'cross']], ['How would you evaluate a classifier on imbalanced data?', ['precision', 'recall', 'f1', 'imbalanced', 'accuracy', 'roc']], ['Walk me through training a model from raw data to evaluation.', ['split', 'clean', 'features', 'train', 'validate', 'metric']]],
      data: [['How would you find the top 3 products by revenue per month in SQL?', ['group', 'sum', 'rank', 'window', 'order', 'partition']], ['Revenue dropped 15% last week. How do you investigate?', ['segment', 'compare', 'trend', 'hypothesis', 'data', 'cause']], ['What makes a good dashboard?', ['audience', 'metric', 'simple', 'decision', 'clarity', 'filter']]],
      frontend: [['Explain how React decides what to re-render.', ['state', 'props', 'virtual', 'render', 'diff', 'key']], ['How do you make a page load faster?', ['bundle', 'lazy', 'image', 'cache', 'performance', 'code']], ['What is the difference between flexbox and grid?', ['one-dimensional', 'two-dimensional', 'row', 'column', 'layout', 'grid']]],
      backend: [['How does a hash map work and what is its average lookup time?', ['hash', 'bucket', 'collision', 'o(1)', 'key', 'array']], ['Design a URL shortener at a high level.', ['database', 'hash', 'cache', 'redirect', 'scale', 'id']], ['What is the difference between SQL and NoSQL databases?', ['schema', 'relational', 'scale', 'transactions', 'document', 'join']]],
      ux: [['Walk me through your design process on a recent project.', ['research', 'user', 'wireframe', 'prototype', 'test', 'iterate']], ['How do you decide what to cut when time is short?', ['priority', 'user', 'impact', 'effort', 'goal', 'tradeoff']], ['How would you test whether a new flow works?', ['usability', 'users', 'task', 'metric', 'observe', 'feedback']]],
    },
  },

  FIRST_NAMES: ['Aarav', 'Ananya', 'Rohan', 'Diya', 'Vihaan', 'Isha', 'Karthik', 'Meera', 'Arjun', 'Sana', 'Nikhil', 'Priya', 'Aditya', 'Neha', 'Siddharth', 'Kavya', 'Rahul', 'Tanvi', 'Manav', 'Riya'],
  LAST_INITIALS: 'ABCDGJKMNPRSTV'.split(''),
};
if (typeof module !== 'undefined' && module.exports) module.exports = CareerData; else window.CareerData = CareerData;
