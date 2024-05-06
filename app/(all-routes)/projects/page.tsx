"use client";
import { HoverEffect } from "@/ui/card-hover-effect";
import { useEffect, useState } from "react";
import { tags, projects, techIcons } from "./data";
import TagsSelector from "../../../components/TagSelector";

export type Projects = {
    title: string;
    description: string;
    link: string;
    github: string;
    image: string;
    techStack: (keyof typeof techIcons)[];
};

export function Projects() {
    const [activeTags, setActiveTags] = useState<string[]>([]);
    const [filteredProjects, setFilteredProjects] =
        useState<Projects[]>(projects);

    useEffect(() => {
        if (activeTags.length === 0) {
            setFilteredProjects(projects);
        } else {
            setFilteredProjects(
                projects.filter((project) =>
                    project.techStack.some((tech) => activeTags.includes(tech))
                )
            );
        }
    }, [activeTags]);

    return (
        <>
            <h1 className="text-4xl font-bold text-center">Projects</h1>
            <div className="flex items-center mt-8 justify-center">
                <p className="text-3xl text-center mr-2">#</p>
                <TagsSelector
                    tags={tags}
                    activeTags={activeTags}
                    setActiveTags={setActiveTags}
                />
            </div>
            <div className="max-w-5xl mx-auto ">
                <HoverEffect items={filteredProjects} />
            </div>
        </>
    );
}

export default Projects;
