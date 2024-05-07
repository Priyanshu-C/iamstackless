import {
    backgroundClassesForTags,
    TECH_STACK_ENUM,
    techIcons,
    TechStackColors,
    techStackColors,
    techStackMapping,
} from "../app/(all-routes)/projects/data";

const getTagColor = (tag: string): TechStackColors => {
    for (const key in techStackMapping) {
        if (techStackMapping[key].includes(tag)) {
            return techStackColors[key];
        }
    }

    return "gray";
};

const TagBadge = ({
    tag,
    activeTags,
    setActiveTags,
}: {
    tag: keyof typeof TECH_STACK_ENUM;
    activeTags: string[];
    setActiveTags: React.Dispatch<React.SetStateAction<string[]>>;
}): JSX.Element => {
    const isActive = activeTags.includes(tag);
    const tagColor: TechStackColors = getTagColor(tag);

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
        ? backgroundClassesForTags[`active-${tagColor}`]
        : backgroundClassesForTags[tagColor];

    return (
        <div
            onClick={onTagClick}
            className={`flex px-2 py-1 text-sm rounded-md text-black cursor-pointer ${backgroundColor}`}
        >
            <span className={`mr-1 flex items-center text-xs`}>
                {techIcons[tag]}
            </span>
            {TECH_STACK_ENUM[tag]}
        </div>
    );
};

const TagsSelector = ({
    tags,
    activeTags,
    setActiveTags,
}: {
    tags: (keyof typeof TECH_STACK_ENUM)[];
    activeTags: string[];
    setActiveTags: React.Dispatch<React.SetStateAction<string[]>>;
}): JSX.Element => {
    return (
        <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
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

export default TagsSelector;
