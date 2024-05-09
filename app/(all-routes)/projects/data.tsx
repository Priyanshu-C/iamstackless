import { AiFillOpenAI } from "react-icons/ai";
import { FiFramer } from "react-icons/fi";
import { RiNextjsLine } from "react-icons/ri";
import {
    SiExpress,
    SiFastapi,
    SiGraphql,
    SiHeroku,
    SiJavascript,
    SiPython,
    SiReact,
    SiRedis,
    SiRedux,
    SiSass,
} from "react-icons/si";
import { TbLambda } from "react-icons/tb";

export type ProjectsType = {
    title: string;
    description: string;
    link: string;
    github?: string;
    image: string;
    techStack: (keyof typeof techIcons)[];
};

export const TECH_STACK_ENUM = {
    react: "React",
    next: "Next",
    redux: "Redux",
    express: "Express",
    redis: "Redis",
    graphql: "GraphQL",
    heroku: "Heroku",
    fastapi: "FastAPI",
    sass: "Sass",
    python: "Python",
    javascript: "JavaScript",
    lambda: "Lambda",
    framer: "Framer",
    openAI: "OpenAI",
};

export const techIcons: Record<keyof typeof TECH_STACK_ENUM, JSX.Element> = {
    next: <RiNextjsLine size="1.5em" />,
    react: <SiReact size="1.5em" />,
    redux: <SiRedux size="1.5em" />,
    express: <SiExpress size="1.5em" />,
    redis: <SiRedis size="1.5em" />,
    graphql: <SiGraphql size="1.5em" />,
    heroku: <SiHeroku size="1.5em" />,
    fastapi: <SiFastapi size="1.5em" />,
    sass: <SiSass size="1.5em" />,
    python: <SiPython size="1.5em" />,
    javascript: <SiJavascript size="1.5em" />,
    lambda: <TbLambda size="1.5em" />,
    framer: <FiFramer size="1.5em" />,
    openAI: <AiFillOpenAI size="1.5em" />,
};

export const techStackMapping: Record<string, string[]> = {
    FE: ["react", "next", "redux", "javascript", "framer"],
    Styles: ["sass"],
    BE: ["express", "fastapi", "graphql", "python", "openAI"],
    DB: ["redis"],
    Deployment: ["heroku", "lambda"],
};

export const techStackColors = {
    FE: "teal",
    Styles: "pink",
    BE: "blue",
    DB: "yellow",
    Deployment: "purple",
    Others: "gray",
} as const;

export type TechStackColors =
    (typeof techStackColors)[keyof typeof techStackColors];

export const backgroundClassesForTags = {
    teal: "bg-teal-200 hover:bg-teal-300 text-teal-800",
    "active-teal": "bg-teal-950 text-white",
    blue: "bg-blue-200 hover:bg-blue-300 text-blue-800",
    "active-blue": "bg-blue-950 text-white",
    yellow: "bg-yellow-200 hover:bg-yellow-300 text-yellow-800",
    "active-yellow": "bg-yellow-950 text-white",
    purple: "bg-purple-200 hover:bg-purple-300 text-purple-800",
    "active-purple": "bg-purple-950 text-white",
    gray: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    "active-gray": "bg-gray-950 text-white",
    pink: "bg-pink-200 hover:bg-pink-300 text-pink-800",
    "active-pink": "bg-pink-950 text-white",
};

export const projects: ProjectsType[] = [
    {
        title: "ANONYMITY",
        description:
            "ANONYMITY is a real-time messaging app using MERN stack and Redis for geospatial features. Users set a radius to connect with nearby individuals for spontaneous chats.",
        link: "https://anonymity.iamstackless.com/",
        github: "https://github.com/Priyanshu-C/ANONYMITY-FRONTEND",
        image: "/images/projects/anonymity.webp",
        techStack: [
            "react",
            "redux",
            "express",
            "redis",
            "graphql",
            "sass",
            "javascript",
        ],
    },
    {
        title: "BUCKITO",
        description:
            "BUCKITO: MERN & FastAPI powers real-time, personalized movie recommendations from a vast TMDB database using collaborative and content-based filtering.",
        link: "https://buckito.iamstackless.com/",
        github: "https://github.com/Priyanshu-C/BUCKITO",
        image: "/images/projects/buckito.webp",
        techStack: [
            "react",
            "redux",
            "express",
            "fastapi",
            "sass",
            "javascript",
            "heroku",
            "python",
        ],
    },
    {
        title: "RAZORPAY PAAS",
        description:
            "Razorpay's PAAS platform enables users to create AI-generated podcasts by selecting two celebrities and a topic. Advanced voice synthesis technology ensures a realistic and personalized listening experience.",
        link: "https://razorpay.com/paas/",
        image: "/images/projects/razorpay-paas.png",
        techStack: [
            "react",
            "next",
            "framer",
            "javascript",
            "lambda",
            "openAI",
        ],
    },
];

export const tags = Object.keys(techStackMapping).reduce(
    (arr, cur) => arr.concat(techStackMapping[cur]),
    []
);
