import { useEffect } from "react";
import HeroSection from "../components/HeroSection";
import SecondFold from "../components/SecondFold";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between">
            <HeroSection />
            {/* <SecondFold /> */}
        </main>
    );
}
