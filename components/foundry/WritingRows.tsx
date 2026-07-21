import { getBlogs } from "@/lib/blogs";

const dateFmt: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
};

export default async function WritingRows() {
    const items = await getBlogs();

    if (!items.length) {
        return (
            <p className="post-empty">
                The press is quiet; proofs live on{" "}
                <a
                    href="https://medium.com/@iamstackless"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "var(--vermilion)" }}
                >
                    Medium →
                </a>
            </p>
        );
    }

    return (
        <>
            <div>
                {items.map((item) => {
                    const readMins = Math.ceil(
                        item.content.split(" ").length / 200
                    );
                    const date = new Date(item.pubDate).toLocaleDateString(
                        "en-IN",
                        dateFmt
                    );
                    return (
                        <a
                            className="post-row"
                            href={item.link}
                            target="_blank"
                            rel="noreferrer"
                            key={item.guid}
                        >
                            <span className="post-meta">
                                {date} · {readMins} min
                            </span>
                            <span className="post-title">{item.title}</span>
                            <span className="post-arrow">Read →</span>
                        </a>
                    );
                })}
            </div>
            <a
                className="sheet-more"
                href="https://medium.com/@iamstackless"
                target="_blank"
                rel="noreferrer"
            >
                All proofs on Medium →
            </a>
        </>
    );
}
