import Link from "next/link";
import { Suspense } from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import { TbLink } from "react-icons/tb";

export async function getBlogs() {
    const res = await fetch(
        "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@iamstackless?api_key=jopdhsbr5b2uvz93hdgyco080f1oy0irck5lludk",
        {
            next: { revalidate: 3200 },
        }
    );
    const data = await res.json();
    return data;
}

const options = {
    year: "numeric",
    month: "long",
};

const BlogCard = ({ item }) => {
    const timeToRead = Math.ceil(item.content.split(" ").length / 200);

    const publistDate = new Date(item.pubDate).toLocaleDateString(
        "en-IN",
        options
    );

    const categories = item.categories;

    return (
        <div key={item.guid} className="p-4 my-4 rounded-md">
            <h2 className="text-xl font-medium">{item.title}</h2>

            <div className="flex flex-wrap gap-2 mt-1 text-xs cursor-pointer">
                {categories.map((category: string) => (
                    <span
                        key={category}
                        className="bg-gray-900 border-gray-800 border text-gray-100 px-2 py-1 rounded-md"
                    >
                        {category}
                    </span>
                ))}
            </div>
            <div className="text-gray-500 flex items-center">
                <p className="text-gray-500  mr-2">{publistDate}</p>
                {timeToRead} min read{" "}
                <button className="text-blue-500 0 font-medium py-2 px-4 rounded flex items-center">
                    <Link href={item.link} target="_blank" rel="noreferrer">
                        Read More
                    </Link>
                    <TbLink className="ml-1 text-md" />
                </button>
            </div>
        </div>
    );
};

export async function AllBlogs() {
    const data = await getBlogs();

    return (
        <div>
            {data.items.map((item) => (
                <BlogCard item={item} />
            ))}
        </div>
    );
}

const BlogPage = () => {
    return (
        <>
            <h1 className="text-4xl font-bold text-center w-full">Blog</h1>
            <div className="max-w-5xl lg:min-w-1024 mx-auto mt-8">
                <Suspense fallback={<div>Loading...</div>}>
                    <AllBlogs />
                </Suspense>
            </div>
        </>
    );
};

export default BlogPage;
