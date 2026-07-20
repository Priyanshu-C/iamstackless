/* ============================================================
   STACKLESS FOUNDRY — all copy and data for the single page.
   The conceit: a type-foundry specimen sheet, but the typeface
   being sold is the engineer.
   ============================================================ */

export const site = {
    name: "Priyanshu Chauhan",
    brand: "PRIYANSHU CHAUHAN",
    email: "priyanshuc.info@gmail.com",
};

export const navLinks = [
    { name: "Record", href: "#record" },
    { name: "Toolkit", href: "#toolkit" },
    { name: "Projects", href: "#projects" },
    { name: "Writing", href: "#writing" },
];

export const socials = [
    { name: "GitHub", link: "https://github.com/Priyanshu-C" },
    { name: "LinkedIn", link: "https://www.linkedin.com/in/priyanshu--chauhan/" },
    { name: "Medium", link: "https://medium.com/@iamstackless" },
    { name: "X", link: "https://twitter.com/iamstackless" },
];

export const HERO_GLYPHS = "IAMSTACKLESS".split("");

export const hero = {
    kicker: "Code is matter —",
    kickerEm: "a living specimen",
    kickerRest: ", frontend cut №1",
    h1Top: "Priyanshu",
    h1Accent: "Chauhan.",
    lede: "Frontend & platform engineer — Coinbase now, Razorpay before. The specimen above is forty thousand particles of ink spelling stackless, the name I ship under. Drag your cursor through it; it heals every time.",
    hint: "move over the letter to carve it · click to recast",
    hudMeta: "Stackless · 144pt · Black",
    hudFig: "Pc — №1",
};

export type RecordEntry = {
    company: string;
    weight: number;
    weightName: string;
    role: string;
    dates: string;
    location: string;
    bullets: { lead: string; text: string }[];
};

export const record: RecordEntry[] = [
    {
        company: "Coinbase",
        weight: 900,
        weightName: "Black · 900",
        role: "Software Engineer IC4 · Platform",
        dates: "Sep 2024 — Present",
        location: "Remote, India",
        bullets: [
            {
                lead: "Architected modular onboarding:",
                text: "a plug-and-play flow adopted across multiple Coinbase products, scaling to users in 80+ countries.",
            },
            {
                lead: "Led core vendor migration:",
                text: "spearheaded the company-wide migration of the ID-verification infrastructure used across the entire platform.",
            },
            {
                lead: "Improved deployment stability:",
                text: "built an internal end-to-end testing workflow that intercepts defects before they reach production.",
            },
            {
                lead: "Drove compliance initiatives:",
                text: "multiple time-critical compliance projects, 100% on-time delivery.",
            },
            {
                lead: "Scaled the design system:",
                text: "partnered with cross-functional design teams on the Coinbase Design System.",
            },
        ],
    },
    {
        company: "Razorpay",
        weight: 700,
        weightName: "Bold · 700",
        role: "Senior Frontend Engineer · Platform",
        dates: "May 2021 — Sep 2024",
        location: "Bangalore, India",
        bullets: [
            {
                lead: "Architected unified authentication:",
                text: "co-built the auth service serving 1M+ monthly merchants across India and Malaysia — decoupled API layer, Module Federation, GraphQL, Next.js, AWS.",
            },
            {
                lead: "Drove AI-led developer experience:",
                text: "led architecture and deployment of R.A.Y, a RAG support chatbot over vector-embedded docs, cutting support tickets by 11%.",
            },
            {
                lead: "Accelerated time-to-market:",
                text: "spearheaded a Framer migration with A/B testing and behaviour analytics, cutting page-creation TAT by 85% — seven days to one.",
            },
            {
                lead: "Improved product conversion:",
                text: "built a dashboard Demo Mode that lifted MTU conversion by 6%.",
            },
            {
                lead: "Scaled design-system architecture:",
                text: "engineered the multi-currency core of the Blade Design System for uniform cross-border UX.",
            },
        ],
    },
    {
        company: "SRM University",
        weight: 300,
        weightName: "Light · 300",
        role: "B.Tech, Information Technology · GPA 85.5%",
        dates: "2016 — 2020",
        location: "Chennai, India",
        bullets: [
            {
                lead: "First cut:",
                text: "four years of fundamentals — data structures by day, side projects after midnight.",
            },
        ],
    },
];

export type Skill = { name: string; glyph: string; accent?: boolean };

export const skills: Skill[] = [
    { name: "TypeScript", glyph: "Ts", accent: true },
    { name: "JavaScript", glyph: "Js", accent: true },
    { name: "React", glyph: "Re", accent: true },
    { name: "Next.js", glyph: "Nx" },
    { name: "GraphQL", glyph: "Gq", accent: true },
    { name: "Node", glyph: "Nd" },
    { name: "Python", glyph: "Py" },
    { name: "Tailwind", glyph: "Tw" },
    { name: "Redux", glyph: "Rx", accent: true },
    { name: "AWS", glyph: "Aw", accent: true },
    { name: "Kubernetes", glyph: "K8" },
    { name: "Terraform", glyph: "Tf" },
    { name: "Docker", glyph: "Dk" },
    { name: "Supabase", glyph: "Sb" },
    { name: "MongoDB", glyph: "Mg" },
    { name: "pgvector", glyph: "Pg" },
    { name: "OpenAI", glyph: "Oa" },
    { name: "Claude", glyph: "Cl", accent: true },
    { name: "RAG", glyph: "Rg" },
    { name: "MCP", glyph: "Mc" },
    { name: "Playwright", glyph: "Pw" },
    { name: "Jest", glyph: "Je" },
    { name: "Framer", glyph: "Fr" },
    { name: "Three.js", glyph: "3j" },
];

export type Project = {
    idx: string;
    title: string;
    meta: string;
    blurb: string;
    bullets?: { lead: string; text: string }[];
    stack: string[];
    link?: string;
    github?: string;
    featured?: boolean;
};

export const projects: Project[] = [
    {
        idx: "№1",
        title: "Callbacked",
        meta: "AI job-search copilot",
        blurb: "One job posting in, three artifacts out. Capture a role from anywhere — extension, paste, or PDF — and get a scored fit with receipts, a tailored résumé, an outreach note and a cover letter, kept on one board next to the job they belong to.",
        bullets: [
            {
                lead: "Durable AI pipeline:",
                text: "an Inngest step function — match, tailor, audit, outreach — with memoized credit spends so retries never double-charge, per-user concurrency, and append-only ledgers where balance is just SUM(delta).",
            },
            {
                lead: "Zero-hallucination contract:",
                text: "five Claude agents bound to one rule — the résumé is the only source of facts, the job description only lends vocabulary — cross-checked by a deterministic ATS keyword audit that knows React from Reactive.",
            },
            {
                lead: "Capture from anywhere:",
                text: "a Manifest V3 extension with zero host permissions — activeTab plus hashed bearer tokens — feeding résumés re-rendered on demand from structured JSON via react-pdf. Next 16, Neon, Drizzle, Clerk.",
            },
        ],
        stack: ["Next.js", "Claude", "Inngest", "Neon", "Drizzle", "Clerk"],
        link: "https://callbacked.iamstackless.com/",
        featured: true,
    },
    {
        idx: "№2",
        title: "Mentorflow",
        meta: "AI-native mentorship platform",
        blurb: "Mentorship with the clerical work removed. The machine listens, writes the minutes, tracks the goals, and books the next session.",
        bullets: [
            {
                lead: "Session intelligence:",
                text: "a Whisper + Claude pipeline auto-generates summaries, action items and goal updates from call recordings — backed by an eval harness with confidence-based fallbacks.",
            },
            {
                lead: "RAG-powered retrieval:",
                text: "pgvector embedding similarity replaces keyword search for mentor matching; a scoped RAG assistant recalls your own history in natural language.",
            },
            {
                lead: "Agentic platform:",
                text: "Model Context Protocol exposes Calendar and goal-tracking as tools for autonomous scheduling — Server Actions, RSC, React Query, Clerk.",
            },
        ],
        stack: ["Next.js", "Supabase", "Claude", "pgvector", "MCP", "Clerk"],
        link: "https://mentorflow.iamstackless.com/",
    },
    {
        idx: "№3",
        title: "Razorpay PaaS",
        meta: "April Fools' — Podcast-as-a-Service",
        blurb: "An April Fools' prank we shipped for real: pick two celebrity voices and a topic, and AI records the podcast episode. Built on Framer with a voice-synthesis backend.",
        stack: ["React", "Next.js", "Lambda", "Framer"],
        link: "https://razorpay.com/paas/",
    },
    {
        idx: "№4",
        title: "Anonymity",
        meta: "Radius-bound realtime chat",
        blurb: "Draw a radius, talk to whoever is inside it. Real-time anonymous messaging on the MERN stack with Redis geospatial indexes underneath.",
        stack: ["React", "Express", "Redis", "GraphQL", "MongoDB", "S3"],
        link: "http://anonymity.iamstackless.com/",
        github: "https://github.com/Priyanshu-C/ANONYMITY-FRONTEND",
    },
    {
        idx: "№5",
        title: "Buckito",
        meta: "Movie recommendations",
        blurb: "Collaborative and content-based filtering over the TMDB catalogue — MERN for the shell, FastAPI for the brain.",
        stack: ["React", "FastAPI", "Python", "Express", "Heroku"],
        link: "http://buckito.iamstackless.com/",
        github: "https://github.com/Priyanshu-C/BUCKITO",
    },
    {
        idx: "№6",
        title: "Stackless",
        meta: "This very site",
        blurb: "Forty-two thousand particles pretending to be a portfolio. Paper, ink, one vermilion accent. View source — the foundry is open.",
        stack: ["Next.js", "Three.js", "TypeScript"],
        link: "https://iamstackless.com",
        github: "https://github.com/Priyanshu-C/iamstackless",
    },
];

export const minis = [
    { name: "Todo", link: "/minis/todo" },
    { name: "Tic-tac-toe", link: "/minis/tictactoe" },
    { name: "Confluence sidebar", link: "/minis/confluence-sidebar" },
];

export const story = {
    para: "I grew up in Lucknow and learned to code at SRM in Chennai, where I shipped my first production bug — and my first fix for it. Three and a half years at Razorpay taught me scale: authentication for a million merchants, a design system that crosses borders, an AI assistant answering support tickets before the support team woke up. Now I work remote at Coinbase, building onboarding flows used in eighty-plus countries. Give me a hard problem and room to work; the type sets itself.",
};

export type ContactTier = {
    title: string;
    price: string;
    body: string;
    items: string[];
    cta: { label: string; href: string; filled?: boolean };
    flag?: string;
};

export const contactTiers: ContactTier[] = [
    {
        title: "Coffee",
        price: "$0",
        body: "Thirty minutes, your calendar or mine. Second opinions on architecture, career questions, or a friendly argument about whether the web needs another framework.",
        items: [
            "Frontend & platform architecture",
            "Mentorship, career chat",
            "No slides, ever",
        ],
        cta: {
            label: "Say hello",
            href: "mailto:priyanshuc.info@gmail.com?subject=Coffee%20%E2%98%95",
        },
    },
    {
        title: "Contract",
        price: "Let's talk",
        body: "A sharp problem with a fixed scope. Frontend platforms, design systems, AI-native product builds — delivered tested and documented, with everything you need to run it without me.",
        items: [
            "Design systems & frontend platforms",
            "AI-native builds: RAG, agents, MCP",
            "Ships with tests, not promises",
        ],
        cta: {
            label: "Enquire",
            href: "mailto:priyanshuc.info@gmail.com?subject=Contract%20enquiry",
            filled: true,
        },
        flag: "Most popular",
    },
    {
        title: "Full-time",
        price: "Taken",
        body: "Currently at Coinbase — IC4, Platform, remote. Not actively looking, but I always read my mail. The full history lives on LinkedIn.",
        items: [
            "Coinbase · IC4 · Platform",
            "Remote, India",
            "Full history on LinkedIn",
        ],
        cta: {
            label: "LinkedIn",
            href: "https://www.linkedin.com/in/priyanshu--chauhan/",
        },
    },
];

export const footer = {
    mark: "STACKLESS — Priyanshu Chauhan, cast in ink and light.",
    credit: "Set in Fraunces & Space Grotesk · Recast MMXXVI",
};
