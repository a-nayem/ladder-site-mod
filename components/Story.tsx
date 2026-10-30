"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { tasks, st, curWeek, today, dayTotal, streak, useStore } from "../lib/model";
import { createScene, SceneApi } from "../lib/scene";

const IDS = ["today", "weeks", "python", "cpp", "java", "log"];
const NAME: Record<string, string> = { py: "Python", cpp: "C++", java: "Java" };
type Ch = { label: string; focus: string; lines: string[]; body: string; cta: string; href: string };
const clip = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s);

function chapters(hydrated: boolean): Ch[] {
  if (!hydrated) {
    const f = (label: string, focus: string, href: string): Ch => ({ label, focus, lines: [label], body: "", cta: "Open " + label.toLowerCase(), href });
    return [f("Today", "all", "/today/"), f("Weeks", "week", "/weeks/"), f("Python", "py", "/ladder/py/1/"), f("C++", "cpp", "/ladder/cpp/1/"), f("Java", "java", "/ladder/java/1/"), f("Log", "all", "/log/")];
  }
  const S = st(), w = curWeek(), thr = +(S.threshold as number) || 4;
  const done = (l: any[]) => l.filter((t) => S.done[t.id]).length;
  const nextU = (l: any[]) => l.find((t) => !S.done[t.id]);
  const lang = (k: string): Ch => {
    const l = tasks.filter((t) => t.lang === k), d = done(l), nx = nextU(l);
    const topics = new Set(l.filter((t) => t.n < 99).map((t) => t.n)).size;
    return { label: NAME[k], lines: [NAME[k], d + " of " + l.length], focus: k, body: topics + " topics, plus gates and a capstone. " + (nx ? "Next up: " + clip(nx.text, 80) : "Every task is done."), cta: "Open " + NAME[k], href: "/ladder/" + k + "/1/" };
  };
  const nx = nextU(tasks);
  const wk = w.week ? tasks.filter((t) => t.week === w.week) : [];
  const dayN = w.week ? Math.floor((new Date(today()).getTime() - new Date(S.start).getTime()) / 864e5) + 1 : 0;
  const gw = tasks.filter((t) => t.kind === "gate").map((t) => t.week);
  const hrsToday = dayTotal(today());
  const sk = streak();
  return [
    { label: "Today", focus: "all", lines: w.week ? ["Day " + dayN + " of 56", "Week " + w.week + " of 8"] : w.over ? ["Plan", "complete"] : ["Starts in", (w.before || 0) + (w.before === 1 ? " day" : " days")],
      body: done(tasks) + " of " + tasks.length + " main tasks done. " + (nx ? "Next up: " + clip(nx.text, 80) : "Nothing left."), cta: "Open today", href: "/today/" },
    { label: "Weeks", focus: "week", lines: ["8 weeks", "3 languages"],
      body: (w.week ? "Week " + w.week + ": " + done(wk) + " of " + wk.length + " tasks done. " : "") + "Gates land in weeks " + Math.min(...gw) + " to " + Math.max(...gw) + " and capstones in week 8.", cta: "Open weeks", href: "/weeks/" },
    lang("py"), lang("cpp"), lang("java"),
    { label: "Log", focus: "all", lines: ["Streak", sk + (sk === 1 ? " day" : " days")], body: (Math.round(hrsToday * 10) / 10) + "h logged today. A day counts toward the streak at " + thr + "h or more.", cta: "Open log", href: "/log/" }
  ];
}

export default function Story() {
  const { hydrated } = useStore();
  const CH = chapters(hydrated);
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fbRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SceneApi | null>(null);
  const [cur, setCur] = useState(0);
  const [shown, setShown] = useState(0);
  const [copyCls, setCopyCls] = useState("");
  const [pct, setPct] = useState(0);
  const [ready, setReady] = useState(false);
  const [snd, setSnd] = useState(false);
  const curRef = useRef(0), readyRef = useRef(false), chRef = useRef(CH);
  chRef.current = CH;
  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* zoom into the cube, then open the page */
  const nav = (e: React.MouseEvent<HTMLElement>) => {
    const a = (e.target as HTMLElement).closest("a") as HTMLAnchorElement | null;
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
    const hrefv = a.getAttribute("href") || "";
    if (hrefv[0] !== "/" || hrefv === "/") return;
    e.preventDefault();
    if (reduce) { router.push(hrefv); return; }
    document.documentElement.setAttribute("data-zoom", "out");
    sceneRef.current?.zoom();
    setTimeout(() => router.push(hrefv), 650);
  };
  useEffect(() => { document.documentElement.removeAttribute("data-zoom"); }, []);

  const go = useCallback((i: number) => {
    i = Math.max(0, Math.min(IDS.length - 1, i));
    const sec = document.getElementById("chapter-" + IDS[i]);
    if (sec) sec.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, [reduce]);

  /* page scroll is owned by the story container */
  useEffect(() => { document.documentElement.style.overflow = "hidden"; return () => { document.documentElement.style.overflow = ""; }; }, []);

  /* active chapter from an IntersectionObserver, no wheel hijack */
  useEffect(() => {
    const root = rootRef.current as HTMLElement;
    const secs = Array.from(root.querySelectorAll(".st-sec"));
    const set = (i: number) => {
      if (i === curRef.current) return;
      curRef.current = i; setCur(i);
      try { history.replaceState(null, "", "#" + IDS[i]); } catch (e) { /* ignore */ }
    };
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { const i = secs.indexOf(e.target); if (i >= 0) set(i); } }), { root, threshold: 0.5 });
    secs.forEach((s) => io.observe(s));
    const h = location.hash.replace(/^#/, "");
    const di = IDS.indexOf(h);
    if (di > 0) { secs[di].scrollIntoView({ block: "start" }); curRef.current = di; setCur(di); setShown(di); }
    const key = (e: KeyboardEvent) => {
      if (/INPUT|TEXTAREA|SELECT/.test((e.target as HTMLElement).tagName || "")) return;
      if (["ArrowDown", "ArrowRight", "PageDown"].includes(e.key)) { e.preventDefault(); go(curRef.current + 1); }
      if (["ArrowUp", "ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); go(curRef.current - 1); }
    };
    window.addEventListener("keydown", key);
    return () => { io.disconnect(); window.removeEventListener("keydown", key); };
  }, [go]);

  /* copy swap */
  useEffect(() => {
    if (!ready) return;
    if (reduce) { setShown(cur); setCopyCls("in"); return; }
    setCopyCls("out");
    const t = setTimeout(() => { setShown(cur); setCopyCls("in"); }, 210);
    return () => clearTimeout(t);
  }, [cur, ready, reduce]);

  /* scene focus and pose follow the chapter and the data */
  const sig = hydrated ? Object.keys(st().done).length + ":" + st().start : "x";
  useEffect(() => { const s = sceneRef.current; if (s) { s.setFocus(CH[cur].focus); s.setPose(cur); } }, [cur, sig]); // eslint-disable-line react-hooks/exhaustive-deps

  /* loader + scene boot (3.5s fallback so it never blocks) */
  useEffect(() => {
    if (!hydrated) return;
    let target = 10, shownP = 0, on = true, raf = 0, dead = false;
    const root = rootRef.current as HTMLElement;
    const finish = () => { if (!on) return; on = false; setPct(100); setTimeout(() => { if (!dead) { readyRef.current = true; setReady(true); } }, reduce ? 0 : 450); };
    const loop = () => {
      if (!on) return;
      shownP += (target - shownP) * 0.12 + 0.2; if (shownP > target) shownP = target;
      setPct(Math.round(shownP));
      if (shownP >= 99.5 && target >= 100) { finish(); return; }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const fb = setTimeout(() => { target = 100; }, 3500);
    const scene = createScene({ root, canvas: canvasRef.current as HTMLCanvasElement, fallback: fbRef.current, tasks: tasks as any, streak: () => streak(), done: () => st().done, week: () => curWeek().week as number, reduce });
    sceneRef.current = scene;
    (async () => {
      try { await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]); } catch (e) { /* ignore */ }
      target = Math.max(target, 30);
      const ok = await scene.load((p) => { target = Math.max(target, 30 + p * 60); });
      if (dead) return;
      if (ok) { scene.setFocus(chRef.current[curRef.current].focus); scene.setPose(curRef.current); scene.start(); }
      target = 100;
    })();
    return () => { dead = true; on = false; cancelAnimationFrame(raf); clearTimeout(fb); scene.destroy(); sceneRef.current = null; };
  }, [hydrated, reduce]);

  /* frame outline */
  const [box, setBox] = useState({ w: 0, h: 0 });
  useEffect(() => { const f = () => setBox({ w: rootRef.current?.clientWidth || 0, h: rootRef.current?.clientHeight || 0 }); f(); window.addEventListener("resize", f); return () => window.removeEventListener("resize", f); }, []);
  const fx = 36, fy = 34, fc = 28, { w, h } = box;
  const fd = w ? `M${fx + fc} ${fy}H${w - fx - fc}L${w - fx} ${fy + fc}V${h - fy - fc}L${w - fx - fc} ${h - fy}H${fx + fc}L${fx} ${h - fy - fc}V${fy + fc}Z` : "";

  /* sound: opt in, quiet drone */
  const ac = useRef<{ ctx: AudioContext; master: GainNode } | null>(null);
  const toggleSound = () => {
    const on = !snd; setSnd(on);
    try {
      if (on && !ac.current) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
        const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 420; lp.connect(master);
        [55, 82.4, 110.2, 164.9].forEach((f, i) => { const o = ctx.createOscillator(); o.type = "sine"; o.frequency.value = f * (1 + i * 0.0015); const g = ctx.createGain(); g.gain.value = 0.5 / (i + 1); o.connect(g); g.connect(lp); o.start(); });
        const lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = 0.07; lg.gain.value = 0.012; lfo.connect(lg); lg.connect(master.gain); lfo.start();
        ac.current = { ctx, master };
      }
      const a = ac.current;
      if (a) { if (on) a.ctx.resume(); a.master.gain.cancelScheduledValues(a.ctx.currentTime); a.master.gain.linearRampToValueAtTime(on ? 0.05 : 0, a.ctx.currentTime + 0.8); }
    } catch (e) { ac.current = null; }
  };
  useEffect(() => () => { try { ac.current?.ctx.close(); } catch (e) { /* ignore */ } }, []);

  const c = CH[shown];
  return (
    <div id="story" ref={rootRef} onClick={nav}>
      <div className="st-spacer">
        {CH.map((x, i) => (
          <section key={IDS[i]} className="st-sec" id={"chapter-" + IDS[i]} aria-labelledby={"h-" + IDS[i]}>
            <h2 id={"h-" + IDS[i]} className="sr">{x.label + (hydrated ? ": " + x.lines.join(", ") : "")}</h2>
            <p className="sr">{x.body}</p>
          </section>
        ))}
      </div>
      <div className="st-stage">
        <h1 className="sr">Ladder, an 8 week Python, C++ and Java study plan</h1>
        <div className="st-fallback" ref={fbRef} />
        <canvas className="st-canvas" ref={canvasRef} aria-hidden="true" />
        <div className="st-shade" />
        <svg className="st-frame" aria-hidden="true"><path d={fd} /></svg>
        <header className="st-top">
          <Link className="st-mark" href="/" aria-label="Ladder intro">Ladder</Link>
          <nav className="st-nav lab" aria-label="Tracker">
            <button type="button" className="bevel lab st-menu" data-menu="1" aria-expanded="false" aria-controls="rail"><span className="pip" /><span>Menu</span></button>
            <Link className="l" href="/today/">Today</Link><Link className="l" href="/weeks/">Weeks</Link><Link className="l" href="/courses/220/">Courses</Link><Link className="l" href="/log/">Log</Link>
            <Link className="bevel solid lab" href="/today/"><span className="pip" /><span>Open tracker</span></Link>
          </nav>
        </header>
        <ul className="st-chap lab" aria-label="Chapters">
          {CH.map((x, i) => <li key={i}><button type="button" aria-current={i === cur ? "true" : "false"} onClick={() => go(i)}>{x.label}</button></li>)}
        </ul>
        <section className={"st-copy " + copyCls} aria-label="Chapter">
          <div className="st-txt" aria-hidden="true">
            <div className="st-kick lab">{c.label}</div>
            <div className="st-h">{c.lines.map((t, i) => <span className="st-line" key={i}>{t}</span>)}</div>
            <p className="st-p">{c.body}</p>
          </div>
          <div className="st-cta"><Link className="bevel lab" href={c.href}><span className="pip" /><span>{c.cta}</span></Link></div>
        </section>
        <div className="st-bar lab">
          <button className="snd" type="button" aria-pressed={snd} onClick={toggleSound}><span className="sl">{snd ? "Sound on" : "Sound off"}</span></button>
          <div className="mid"><span>Scroll to explore</span></div>
          <div className="right st-pn"><button type="button" className="pv" aria-label="Previous chapter" onClick={() => go(cur - 1)}>Prev.</button><button type="button" className="nx" aria-label="Next chapter" onClick={() => go(cur + 1)}>Next</button></div>
        </div>
        <div className={"st-load" + (ready ? " done" : "")} role="status">
          <div className="st-pct">{pct}%</div>
          <div className="st-segs" aria-hidden="true">{Array.from({ length: 10 }, (_, i) => <i key={i} className={i < Math.floor(pct / 10) ? "on" : ""} />)}</div>
          <div className="lab st-ll">{pct >= 100 ? "Ready to explore" : "Loading"}</div>
        </div>
      </div>
    </div>
  );
}
