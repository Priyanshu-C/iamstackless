import { Suspense } from "react";
import ParticleHero from "@/components/foundry/ParticleHero";
import Topbar from "@/components/foundry/Topbar";
import {
    ContactCards,
    Foot,
    ProjectSpecimens,
    RecordSheet,
    SkillGrid,
    StoryPara,
} from "@/components/foundry/Sections";
import WritingRows from "@/components/foundry/WritingRows";

export default function Home() {
    return (
        <div className="foundry">
            <div className="grain" aria-hidden="true" />
            <Topbar />
            <main>
                <ParticleHero />
                <RecordSheet />
                <SkillGrid />
                <ProjectSpecimens />
                <StoryPara />
                <section className="sheet" id="writing">
                    <div className="sheet-head">
                        <div className="sheet-title">
                            <span className="sheet-idx">05</span>
                            <h2>Proofs</h2>
                        </div>
                        <p className="sheet-sub">
                            Pulled from the press at Medium — long-form notes
                            on the craft, still smelling of ink.
                        </p>
                    </div>
                    <Suspense
                        fallback={
                            <p className="post-empty">Inking the press…</p>
                        }
                    >
                        <WritingRows />
                    </Suspense>
                </section>
                <ContactCards />
            </main>
            <Foot />
        </div>
    );
}
