"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { HERO_GLYPHS, hero } from "@/lib/content";

/* ============================================================
   STACKLESS FOUNDRY — particle typography specimen
   A glyph is rendered to an offscreen 2D canvas; its opaque
   pixels become 3D particle targets. Morphing = re-sampling
   targets and easing each particle to its new home with a
   per-particle stagger. The cursor is a 3D repeller that
   pushes particles off the glyph plane; releasing lets them heal.
   Ported from the Glyph Foundry reference build.
   ============================================================ */

type EngineApi = {
    selectGlyph: (i: number) => void;
    setAuto: (v: boolean) => void;
};

const MORPH_MS = 1400;
// quicker cadence than the reference's 4200ms so the word actually reads
const AUTO_MS = 3000;
const REPEL_R = 3.0;
const REPEL_STR = 2.6;
const PLANE_W = 20;
const SAMPLE_W = 320;
const SAMPLE_H = 320;

export default function ParticleHero() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const posterRef = useRef<HTMLDivElement>(null);
    const hudGlyphRef = useRef<HTMLSpanElement>(null);
    const hudCountRef = useRef<HTMLSpanElement>(null);
    const hudStateRef = useRef<HTMLSpanElement>(null);
    const hintRef = useRef<HTMLParagraphElement>(null);
    const apiRef = useRef<EngineApi | null>(null);

    const [activeIdx, setActiveIdx] = useState(0);
    const [auto, setAutoState] = useState(true);

    useEffect(() => {
        const canvas = canvasRef.current;
        const poster = posterRef.current;
        const hudGlyph = hudGlyphRef.current;
        const hudCount = hudCountRef.current;
        const hudState = hudStateRef.current;
        const hint = hintRef.current;
        if (!canvas || !poster) return;

        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        // next/font exposes the real (mangled) family name via this CSS var
        const frauncesFamily =
            getComputedStyle(document.documentElement)
                .getPropertyValue("--font-fraunces")
                .trim() || "Georgia, serif";

        function fallback() {
            if (!canvas || !poster) return;
            canvas.style.display = "none";
            poster.style.display = "block";
            poster.style.background =
                "radial-gradient(120% 90% at 50% 45%, #e9e1d3 0%, #f2ece1 70%)";
            const big = document.createElement("div");
            big.textContent = HERO_GLYPHS[0];
            Object.assign(big.style, {
                position: "absolute",
                inset: "0",
                display: "grid",
                placeItems: "center",
                fontFamily: frauncesFamily,
                fontWeight: "900",
                fontSize: "min(60vh,60vw)",
                color: "#17140f",
                zIndex: "2",
            });
            poster.appendChild(big);
        }

        let renderer: THREE.WebGLRenderer;
        try {
            renderer = new THREE.WebGLRenderer({
                canvas,
                antialias: true,
                alpha: true,
            });
            const gl = renderer.getContext();
            if (!gl) throw new Error("no gl");
        } catch (e) {
            fallback();
            return;
        }

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);

        const scene = new THREE.Scene();
        // orthographic-ish perspective for a flat specimen feel with subtle depth
        const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
        camera.position.set(0, 0, 26);

        const PALETTE = {
            ink: new THREE.Color("#17140f"),
            soft: new THREE.Color("#4a443b"),
            vermilion: new THREE.Color("#e3402a"),
        };

        /* ---------- glyph sampling ---------- */
        const off = document.createElement("canvas");
        off.width = SAMPLE_W;
        off.height = SAMPLE_H;
        const octx = off.getContext("2d", { willReadFrequently: true })!;

        function sampleGlyph(ch: string) {
            octx.clearRect(0, 0, SAMPLE_W, SAMPLE_H);
            octx.fillStyle = "#000";
            octx.textAlign = "center";
            octx.textBaseline = "middle";
            // heavy display weight for dense, readable coverage
            const size =
                ch === "&" || ch === "@"
                    ? Math.round(SAMPLE_H * 0.72)
                    : Math.round(SAMPLE_H * 0.82);
            octx.font = `900 ${size}px ${frauncesFamily}`;
            octx.fillText(ch, SAMPLE_W / 2, SAMPLE_H / 2 + SAMPLE_H * 0.02);

            const data = octx.getImageData(0, 0, SAMPLE_W, SAMPLE_H).data;
            const pts: number[] = [];
            const step = 2; // pixel stride -> particle density
            for (let y = 0; y < SAMPLE_H; y += step) {
                for (let x = 0; x < SAMPLE_W; x += step) {
                    const a = data[(y * SAMPLE_W + x) * 4 + 3];
                    if (a > 128) {
                        // jitter within the cell so edges don't look gridded
                        const jx = x + (Math.random() - 0.5) * step;
                        const jy = y + (Math.random() - 0.5) * step;
                        pts.push(
                            (jx / SAMPLE_W - 0.5) * PLANE_W,
                            -(jy / SAMPLE_H - 0.5) * PLANE_W
                        );
                    }
                }
            }
            return pts;
        }

        /* ---------- particle system ---------- */
        let PARTICLES = 42000;
        if (window.innerWidth < 700) PARTICLES = 24000;

        const positions = new Float32Array(PARTICLES * 3);
        const targets = new Float32Array(PARTICLES * 3);
        const homeZ = new Float32Array(PARTICLES);
        const velocities = new Float32Array(PARTICLES * 3);
        const colors = new Float32Array(PARTICLES * 3);
        const seeds = new Float32Array(PARTICLES);

        for (let i = 0; i < PARTICLES; i++) {
            const r = 14 + Math.random() * 10;
            const th = Math.random() * Math.PI * 2;
            positions[i * 3] = Math.cos(th) * r;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 24;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
            homeZ[i] = (Math.random() - 0.5) * 1.0;
            seeds[i] = Math.random();
            // color: mostly ink, a scatter of soft, ~7% vermilion accent
            const roll = Math.random();
            const c =
                roll < 0.07
                    ? PALETTE.vermilion
                    : roll < 0.32
                    ? PALETTE.soft
                    : PALETTE.ink;
            colors[i * 3] = c.r;
            colors[i * 3 + 1] = c.g;
            colors[i * 3 + 2] = c.b;
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

        function dotTexture() {
            const s = 64;
            const c = document.createElement("canvas");
            c.width = c.height = s;
            const g = c.getContext("2d")!;
            const grad = g.createRadialGradient(
                s / 2, s / 2, 0,
                s / 2, s / 2, s / 2
            );
            grad.addColorStop(0, "rgba(255,255,255,1)");
            grad.addColorStop(0.5, "rgba(255,255,255,0.85)");
            grad.addColorStop(1, "rgba(255,255,255,0)");
            g.fillStyle = grad;
            g.beginPath();
            g.arc(s / 2, s / 2, s / 2, 0, Math.PI * 2);
            g.fill();
            return new THREE.CanvasTexture(c);
        }

        const tex = dotTexture();
        const mat = new THREE.PointsMaterial({
            size: 0.115,
            map: tex,
            vertexColors: true,
            transparent: true,
            opacity: 0.95,
            depthWrite: false,
            sizeAttenuation: true,
            // normal blending on transparent paper reads as ink
            blending: THREE.NormalBlending,
        });

        const points = new THREE.Points(geo, mat);
        scene.add(points);

        /* ---------- state ---------- */
        let morphStart = 0;
        let morphing = false;
        let idx = 0;
        let auto = !reduceMotion;
        let autoTimer = 0;
        let raf = 0;
        let disposed = false;

        function setTargets(ch: string) {
            const pts = sampleGlyph(ch);
            const n = pts.length / 2;
            if (n === 0) return;
            for (let i = 0; i < PARTICLES; i++) {
                const s = (i % n) * 2;
                targets[i * 3] = pts[s];
                targets[i * 3 + 1] = pts[s + 1];
                targets[i * 3 + 2] = homeZ[i];
            }
            if (hudGlyph) hudGlyph.textContent = ch;
            if (hudState) hudState.textContent = "settling";
            morphStart = performance.now();
            morphing = true;
        }

        function selectGlyph(i: number) {
            idx = (i + HERO_GLYPHS.length) % HERO_GLYPHS.length;
            setTargets(HERO_GLYPHS[idx]);
            setActiveIdx(idx);
            autoTimer = performance.now();
        }
        function advance() {
            selectGlyph(idx + 1);
        }

        apiRef.current = {
            selectGlyph,
            setAuto: (v: boolean) => {
                auto = v;
                autoTimer = performance.now();
            },
        };

        /* ---------- cursor as 3D repeller ---------- */
        const pointer = new THREE.Vector2(-10, -10);
        let pointerActive = false;
        const ndc = new THREE.Vector2();
        const raycaster = new THREE.Raycaster();
        const glyphPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        const cursorWorld = new THREE.Vector3(999, 999, 0);

        function updateCursorWorld() {
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            ndc.x = ((pointer.x - rect.left) / rect.width) * 2 - 1;
            ndc.y = -((pointer.y - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(ndc, camera);
            raycaster.ray.intersectPlane(glyphPlane, cursorWorld);
        }

        let hinted = false;
        function hideHint() {
            if (!hinted && hint) {
                hinted = true;
                hint.style.opacity = "0";
            }
        }

        const onPointerMove = (e: PointerEvent) => {
            pointer.set(e.clientX, e.clientY);
            pointerActive = true;
            hideHint();
        };
        const onPointerLeave = () => {
            pointerActive = false;
            cursorWorld.set(999, 999, 0);
        };

        /* click to recast (advance glyph) + a ripple pulse from the click point */
        let pulse = 0;
        const pulseCenter = new THREE.Vector3();
        const onClick = () => {
            updateCursorWorld();
            pulseCenter.copy(cursorWorld);
            pulse = 1;
            advance();
            hideHint();
        };

        canvas.addEventListener("pointermove", onPointerMove);
        canvas.addEventListener("pointerleave", onPointerLeave);
        canvas.addEventListener("click", onClick);

        /* ---------- resize ---------- */
        function resize() {
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            const w = Math.max(rect.width, 1);
            const h = Math.max(rect.height, 1);
            renderer.setSize(w, h, false);
            camera.aspect = w / h;
            // fit the glyph: pull camera so PLANE_W fits with margin
            const vFov = (camera.fov * Math.PI) / 180;
            const needed = (PLANE_W * 0.62) / Math.tan(vFov / 2);
            camera.position.z = Math.max(
                needed,
                needed * (w < h ? 1.0 : 0.86)
            );
            camera.updateProjectionMatrix();
        }
        window.addEventListener("resize", resize);
        resize();

        function easeInOut(t: number) {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }

        /* ---------- main loop ---------- */
        if (hudCount) hudCount.textContent = PARTICLES.toLocaleString();
        selectGlyph(0);

        let last = performance.now();
        let idleRot = 0;

        function tick(now: number) {
            if (disposed) return;
            raf = requestAnimationFrame(tick);
            if (document.hidden) {
                last = now;
                return;
            }
            const dt = Math.min((now - last) / 1000, 0.05);
            last = now;

            if (pointerActive) updateCursorWorld();

            // morph progress (per-particle stagger via seed)
            const gp = morphing
                ? Math.min((now - morphStart) / MORPH_MS, 1)
                : 1;
            if (morphing && gp >= 1) {
                morphing = false;
                if (hudState)
                    hudState.textContent = pointerActive ? "carving" : "cast";
            }

            const pos = geo.attributes.position.array as Float32Array;
            const cx = cursorWorld.x,
                cy = cursorWorld.y;
            const withinCursor = pointerActive && Math.abs(cx) < 40;
            let carving = false;

            for (let i = 0; i < PARTICLES; i++) {
                const ix = i * 3;
                // staggered local progress: particles with higher seed start later
                let lp = 1;
                if (morphing) {
                    const start = seeds[i] * 0.42; // up to 42% of window as delay
                    lp = easeInOut(
                        THREE.MathUtils.clamp((gp - start) / (1 - 0.42), 0, 1)
                    );
                }

                const tx = targets[ix],
                    ty = targets[ix + 1],
                    tz = targets[ix + 2];

                const dx = tx - pos[ix];
                const dy = ty - pos[ix + 1];
                const dz = tz - pos[ix + 2];

                // during morph, pull harder scaled by local progress; strong hold at rest
                const pull = morphing ? 0.06 + 0.22 * lp : 0.2;
                velocities[ix] += dx * pull;
                velocities[ix + 1] += dy * pull;
                velocities[ix + 2] += dz * pull;

                // cursor repel (3D, off the plane) — carve holes
                if (withinCursor) {
                    const rx = pos[ix] - cx;
                    const ry = pos[ix + 1] - cy;
                    const d2 = rx * rx + ry * ry;
                    if (d2 < REPEL_R * REPEL_R) {
                        const d = Math.sqrt(d2) + 0.0001;
                        const f = 1 - d / REPEL_R;
                        velocities[ix] += (rx / d) * f * REPEL_STR;
                        velocities[ix + 1] += (ry / d) * f * REPEL_STR;
                        velocities[ix + 2] +=
                            f * f * REPEL_STR * 1.8 * (seeds[i] > 0.5 ? 1 : -1);
                        carving = true;
                    }
                }

                // click ripple: a short outward shove from the click point
                if (pulse > 0.01) {
                    const rx = pos[ix] - pulseCenter.x;
                    const ry = pos[ix + 1] - pulseCenter.y;
                    const d = Math.sqrt(rx * rx + ry * ry) + 0.0001;
                    if (d < 8) {
                        const f = pulse * (1 - d / 8) * 0.9;
                        velocities[ix] += (rx / d) * f;
                        velocities[ix + 1] += (ry / d) * f;
                        velocities[ix + 2] += (Math.random() - 0.5) * f * 1.4;
                    }
                }

                // integrate + damping (heal spring returns them). High damping ->
                // crisp rest state (dots, not comet trails); looser during a morph.
                const damp = morphing ? 0.8 : 0.68;
                velocities[ix] *= damp;
                velocities[ix + 1] *= damp;
                velocities[ix + 2] *= damp * 0.96;
                pos[ix] += velocities[ix];
                pos[ix + 1] += velocities[ix + 1];
                pos[ix + 2] += velocities[ix + 2];
            }

            geo.attributes.position.needsUpdate = true;
            if (pulse > 0.01) pulse *= 0.86;

            if (!morphing && hudState) {
                hudState.textContent = carving ? "carving" : "cast";
            }

            // subtle idle breathing rotation of the whole cloud
            if (!reduceMotion) {
                idleRot += dt * 0.06;
                points.rotation.y = Math.sin(idleRot) * 0.05;
                points.rotation.x = Math.cos(idleRot * 0.7) * 0.02;
            }

            // auto-cast timer
            if (auto && now - autoTimer > AUTO_MS && !morphing) {
                advance();
            }

            renderer.render(scene, camera);
        }

        /* wait a beat for the webfont so the first raster is the real Fraunces */
        document.fonts
            .load(`900 100px ${frauncesFamily}`)
            .then(() => {
                if (!disposed) selectGlyph(idx);
            })
            .catch(() => {});

        raf = requestAnimationFrame(tick);

        return () => {
            disposed = true;
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", resize);
            canvas.removeEventListener("pointermove", onPointerMove);
            canvas.removeEventListener("pointerleave", onPointerLeave);
            canvas.removeEventListener("click", onClick);
            apiRef.current = null;
            scene.remove(points);
            geo.dispose();
            mat.dispose();
            tex.dispose();
            renderer.dispose();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggleAuto = () => {
        const next = !auto;
        setAutoState(next);
        apiRef.current?.setAuto(next);
    };

    return (
        <section className="hero" id="specimen">
            <canvas id="scene" ref={canvasRef} aria-hidden="true" />
            <div className="hero-poster" ref={posterRef} aria-hidden="true" />

            <div className="hero-overlay">
                <div className="hero-kicker">
                    <span className="kick-dot" aria-hidden="true" />
                    <span>
                        {hero.kicker} <em>{hero.kickerEm}</em>
                        {hero.kickerRest}
                    </span>
                </div>
                <h1 className="hero-h1">
                    <span className="h1-line">{hero.h1Top}</span>
                    <span className="h1-line h1-accent">{hero.h1Accent}</span>
                </h1>
                <p className="hero-lede">{hero.lede}</p>
            </div>

            <div className="specimen-hud" aria-hidden="true">
                <div className="hud-block hud-tl">
                    <span className="hud-cap">Now casting</span>
                    <span className="hud-glyph" ref={hudGlyphRef}>
                        {HERO_GLYPHS[0]}
                    </span>
                </div>
                <div className="hud-block hud-tr">
                    <span className="hud-cap">Particles</span>
                    <span className="hud-val" ref={hudCountRef}>
                        —
                    </span>
                </div>
                <div className="hud-block hud-bl">
                    <span className="hud-cap">State</span>
                    <span className="hud-val" ref={hudStateRef}>
                        settling
                    </span>
                </div>
                <div className="hud-block hud-br">
                    <span className="hud-cap">{hero.hudMeta}</span>
                    <span className="hud-val hud-fig">{hero.hudFig}</span>
                </div>
            </div>

            <div
                className="specimen-controls"
                role="group"
                aria-label="Choose the specimen glyph"
            >
                {/* the letters read I AM / STACKLESS */}
                {[HERO_GLYPHS.slice(0, 3), HERO_GLYPHS.slice(3)].map(
                    (row, r) => (
                        <div className="glyph-row" key={r}>
                            {row.map((g, k) => {
                                const i = r * 3 + k;
                                return (
                                    <button
                                        key={`${g}-${i}`}
                                        className={`glyph-btn${
                                            i === activeIdx
                                                ? " is-active"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            apiRef.current?.selectGlyph(i)
                                        }
                                    >
                                        {g}
                                    </button>
                                );
                            })}
                        </div>
                    )
                )}
                <div className="controls-foot">
                    <button
                        className="glyph-btn glyph-btn--wide"
                        aria-pressed={auto}
                        onClick={toggleAuto}
                    >
                        <span className="auto-tick" aria-hidden="true" />{" "}
                        auto-cast
                    </button>
                </div>
            </div>

            <p className="hero-hint" ref={hintRef}>
                {hero.hint}
            </p>
        </section>
    );
}
