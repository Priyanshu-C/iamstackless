import {
    backgroundClassesForTags,
    techIcons,
    techStackColors,
    techStackMapping,
} from "../app/(all-routes)/projects/data";

const getTagColor = (tag: string): string => {
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
    tag: string;
    activeTags: string[];
    setActiveTags: React.Dispatch<React.SetStateAction<string[]>>;
}): JSX.Element => {
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
        ? backgroundClassesForTags[`active-${tagColor}`]
        : backgroundClassesForTags[tagColor];

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

const TagsSelector = ({
    tags,
    activeTags,
    setActiveTags,
}: {
    tags: string[];
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
