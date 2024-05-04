import { HoverEffect } from "@/ui/card-hover-effect";
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
    techStack: JSX.Element[];
};

export const projects: Project[] = [
    {
        title: "ANONYMITY",
        description:
            "ANONYMITY is a real-time messaging app using MERN stack and Redis for geospatial features. Users set a radius to connect with nearby individuals for spontaneous chats.",
        link: "https://anonymity.iamstackless.com/",
        github: "https://github.com/Priyanshu-C/ANONYMITY-FRONTEND",
        image: "/images/projects/anonymity.webp",
        techStack: [
            <SiReact size="1.5em" key="react" />,
            <SiRedux size="1.5em" key="redux" />,
            <SiExpress size="1.5em" key="express" />,
            <SiRedis size="1.5em" key="redis" />,
            <SiGraphql size="1.5em" key="graphql" />,
        ],
    },
    {
        title: "BUCKITO",
        description:
            "Buckito is an advanced movie recommendation site, using MERN stack and FastAPI microservices. It accesses a vast TMDB database of 10,000+ movies to provide personalized suggestions in real-time, employing collaborative and content-based filtering.",
        link: "https://buckito.iamstackless.com/",
        github: "https://github.com/Priyanshu-C/BUCKITO",
        image: "/images/projects/buckito.webp",
        techStack: [
            <SiReact size="1.5em" key="react" />,
            <SiRedux size="1.5em" key="redux" />,
            <SiExpress size="1.5em" key="express" />,
            <SiGraphql size="1.5em" key="graphql" />,
            <SiHeroku size="1.5em" key="heroku" />,
            <SiFastapi size="1.5em" key="fastapi" />,
        ],
    },
];

export function Projects() {
    return (
        <div className="flex min-h-screen flex-col items-start justify-start p-4">
            <h1 className="text-4xl font-bold text-center ml-10">Projects</h1>
            <div className="max-w-5xl mx-auto px-8">
                <HoverEffect items={projects} />
            </div>
        </div>
    );
}

export default Projects;
