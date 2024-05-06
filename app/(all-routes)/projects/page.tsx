"use client";
import { HoverEffect } from "@/ui/card-hover-effect";
import { useState } from "react";
import {
    SiExpress,
    SiFastapi,
    SiGraphql,
    SiHeroku,
    SiReact,
    SiRedis,
    SiRedux,
} from "react-icons/si";

export type Project = {
    title: string;
    description: string;
    link: string;
    github: string;
    image: string;
    techStack: (keyof typeof techIcons)[];
};

export const techIcons: Record<string, JSX.Element> = {
    react: <SiReact size="1.5em" />,
    redux: <SiRedux size="1.5em" />,
    express: <SiExpress size="1.5em" />,
    redis: <SiRedis size="1.5em" />,
    graphql: <SiGraphql size="1.5em" />,
    heroku: <SiHeroku size="1.5em" />,
    fastapi: <SiFastapi size="1.5em" />,
};

export const projects: Project[] = [
    {
        title: "ANONYMITY",
        description:
            "ANONYMITY is a real-time messaging app using MERN stack and Redis for geospatial features. Users set a radius to connect with nearby individuals for spontaneous chats.",
        link: "https://anonymity.iamstackless.com/",
        github: "https://github.com/Priyanshu-C/ANONYMITY-FRONTEND",
        image: "/images/projects/anonymity.webp",
        techStack: ["react", "redux", "express", "redis", "graphql"],
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
            "graphql",
            "heroku",
            "fastapi",
        ],
    },
];

const techStackMapping: Record<string, string[]> = {
    FE: ["react", "redux"],
    BE: ["express", "fastapi"],
    DB: ["redis"],
    Deployment: ["heroku"],
    Others: ["graphql"],
};

const techStackColors = {
    FE: "teal",
    BE: "green",
    DB: "yellow",
    Deployment: "purple",
    Others: "gray",
};

const allTags = Object.keys(techStackMapping).reduce(
    (arr, cur) => arr.concat(techStackMapping[cur]),
    []
);

const getTagColor = (tag: string): string => {
    for (const key in techStackMapping) {
        if (techStackMapping[key].includes(tag)) {
            return techStackColors[key];
        }
    }
};

const TagBadge = ({ tag, activeTags, setActiveTags }) => {
    const isActive = activeTags.includes(tag);
    const tagColor = getTagColor(tag);

    const onTagClick = () => {
        setActiveTags(
            isActive
                ? activeTags.filter(
                      (activeTag: string): boolean => activeTag !== tag
                  )
                : [...activeTags, tag]
        );
    };

    const backgroundColor = isActive
        ? `bg-${tagColor}-100`
        : `bg-${tagColor}-400`;

    return (
        <div
            onClick={onTagClick}
            className={`flex px-2 py-1 text-sm rounded-md text-black cursor-pointer ${backgroundColor}`}
        >
            {tag}
            <span className={`ml-1 flex items-center text-xs`}>
                {techIcons[tag]}
            </span>
        </div>
    );
};

const Tags = ({ activeTags, setActiveTags }) => {
    return (
        <div className="flex flex-wrap gap-2 mt-6">
            {allTags.map((tag) => (
                <TagBadge
                    key={tag}
                    tag={tag}
                    activeTags={activeTags}
                    setActiveTags={setActiveTags}
                />
            ))}
        </div>
    );
};

export function Projects() {
    const [activeTags, setActiveTags] = useState<string[]>([]);

    return (
        <div className="max-w-5xl lg:px-8 flex min-h-screen flex-col items-start justify-start p-4">
            <h1 className="text-4xl font-bold text-center">Projects</h1>
            <Tags activeTags={activeTags} setActiveTags={setActiveTags} />
            <div className="max-w-5xl mx-auto ">
                <HoverEffect items={projects} />
            </div>
        </div>
    );
}

export default Projects;
