"use client";

import ProjectCards from "@/components/ProjectCards";
import { useEffect, useState } from "react";
import { tags, projects, ProjectsType } from "./data";
import TagsSelector from "../../../components/TagSelector";

export function Projects() {
    const [activeTags, setActiveTags] = useState<string[]>([]);
    const [filteredProjects, setFilteredProjects] =
        useState<ProjectsType[]>(projects);

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
                <ProjectCards items={filteredProjects} />
            </div>
        </>
    );
}

export default Projects;
