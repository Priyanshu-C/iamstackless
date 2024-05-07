import Link from "next/link";
import Footer from "../../components/Footer";
import NavBar from "../../components/NavBar";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-between p-4">
            <div className="max-w-5xl relative lg:px-8 flex min-h-screen flex-col items-start justify-start p-4">
                <NavBar />
                {children}
            </div>
            <Footer />
        </div>
    );
}
