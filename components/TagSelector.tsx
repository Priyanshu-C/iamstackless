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

const TagsSelector = ({ tags, activeTags, setActiveTags }) => {
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
