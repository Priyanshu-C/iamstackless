export type BlogItem = {
    title: string;
    pubDate: string;
    link: string;
    categories: string[];
    content: string;
    guid: string;
};

export async function getBlogs(): Promise<BlogItem[]> {
    try {
        const res = await fetch(
            "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@iamstackless?api_key=jopdhsbr5b2uvz93hdgyco080f1oy0irck5lludk",
            {
                next: { revalidate: 3200 },
            }
        );
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data?.items) ? data.items : [];
    } catch {
        return [];
    }
}
