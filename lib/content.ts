/* ============================================================
   STACKLESS FOUNDRY — all copy and data for the single page.
   The conceit: a type-foundry specimen sheet, but the typeface
   being sold is the engineer.
   ============================================================ */

export const site = {
    name: "Priyanshu Chauhan",
    brand: "PRIYANSHU",
    brandThin: " CHAUHAN",
    email: "priyanshuc.info@gmail.com",
    est: "Est. MMXX",
    tagline: "Frontend & Platform",
    current: "Coinbase IC4",
};

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
    lede: "Frontend & platform engineer — Coinbase now, Razorpay before. The specimen is spelling my other name, stackless, forty thousand grains of ink at a time. Carve it with your cursor; it heals. Everything below is cast from the same material.",
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
                text: "where the letterform was drawn — four years of fundamentals, and the first production bug shipped and fixed.",
            },
        ],
    },
];

export type Skill = { name: string; glyph: string; accent?: boolean };

export const skills: Skill[] = [
    { name: "TypeScript", glyph: "Ts", accent: true },
    { name: "JavaScript", glyph: "Js" },
    { name: "React", glyph: "Re", accent: true },
    { name: "Next.js", glyph: "Nx", accent: true },
    { name: "GraphQL", glyph: "Gq" },
    { name: "Node", glyph: "Nd" },
    { name: "Python", glyph: "Py" },
    { name: "Tailwind", glyph: "Tw" },
    { name: "Redux", glyph: "Rx" },
    { name: "AWS", glyph: "Aw", accent: true },
    { name: "Kubernetes", glyph: "K8" },
    { name: "Terraform", glyph: "Tf" },
    { name: "Docker", glyph: "Dk" },
    { name: "Supabase", glyph: "Sb" },
    { name: "MongoDB", glyph: "Mg" },
    { name: "pgvector", glyph: "Pg", accent: true },
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
        featured: true,
    },
    {
        idx: "№2",
        title: "Razorpay PaaS",
        meta: "AI-generated podcasts",
        blurb: "Pick two celebrity voices and a topic; the machine records the episode. Advanced voice synthesis behind a Next.js front.",
        stack: ["React", "Next.js", "Lambda", "Framer"],
        link: "https://razorpay.com/paas/",
    },
    {
        idx: "№3",
        title: "Anonymity",
        meta: "Radius-bound realtime chat",
        blurb: "Draw a radius, talk to whoever is inside it. Real-time anonymous messaging on the MERN stack with Redis geospatial indexes underneath.",
        stack: ["React", "Express", "Redis", "GraphQL", "MongoDB", "S3"],
        link: "http://anonymity.iamstackless.com/",
        github: "https://github.com/Priyanshu-C/ANONYMITY-FRONTEND",
    },
    {
        idx: "№4",
        title: "Buckito",
        meta: "Movie recommendations",
        blurb: "Collaborative and content-based filtering over the TMDB catalogue — MERN for the shell, FastAPI for the brain.",
        stack: ["React", "FastAPI", "Python", "Express", "Heroku"],
        link: "http://buckito.iamstackless.com/",
        github: "https://github.com/Priyanshu-C/BUCKITO",
    },
    {
        idx: "№5",
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
    para: "A frontend engineer is a workshop for pouring intent into interfaces. This one was cast in Lucknow, annealed at SRM in Chennai, then hardened over three and a half years at Razorpay — authentication for a million merchants, a design system that crosses borders, an AI that answers support tickets before humans wake up. Now it is set remote at Coinbase, drawing onboarding flows for eighty countries from a desk in India. Set it large. Give it a hard problem. Let the counters breathe.",
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
        body: "Thirty minutes, your calendar or mine. Architecture second opinions, career questions, or an argument about whether the web needs another framework.",
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
        body: "A sharp problem with a fixed scope. Frontend platforms, design systems, AI-native product builds — poured, tested, and handed over with the moulds.",
        items: [
            "Design systems & frontend platforms",
            "AI-native builds: RAG, agents, MCP",
            "Ships with tests, not promises",
        ],
        cta: {
            label: "Enquire",
            href: "mailto:priyanshuc.info@gmail.com?subject=Commission%20the%20engineer",
            filled: true,
        },
        flag: "Most poured",
    },
    {
        title: "Full-time",
        price: "Cast",
        body: "Currently set at Coinbase — IC4, Platform, remote. Not looking, but the type specimen stays on file and the long form lives on LinkedIn.",
        items: [
            "Coinbase · IC4 · Platform",
            "Remote, India",
            "The long form, on LinkedIn",
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
