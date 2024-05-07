import Link from "next/link";
import { useRouter } from "next/router";
import Footer from "../../components/Footer";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-between p-4">
            <div className="max-w-5xl relative lg:px-8 flex min-h-screen flex-col items-start justify-start p-4">
                {children}
                <div className="absolute top-4 right-4 transform -translate-x-1/2 flex">
                    <BackToHome />
                </div>
            </div>
            <Footer />
        </div>
    );
}

const BackToHome = () => {
    return (
        <Link href="/" className="flex items-center justify-center">
            <img
                src="./images/hero-image.webp"
                alt="Hero Image"
                className="w-12 h-12 bg-clip-border bg-gradient-to-b from-white/80 to-white/70 border-2 border-transparent rounded-lg drop-shadow-2xl"
            />
        </Link>
    );
};
