/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    async redirects() {
        return [
            { source: "/projects", destination: "/#projects", permanent: true },
            { source: "/about", destination: "/#story", permanent: true },
            { source: "/blog", destination: "/#writing", permanent: true },
            { source: "/resume", destination: "/#commission", permanent: true },
        ];
    },
};

export default nextConfig;
