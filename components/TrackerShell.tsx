"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore, st, today, dayTotal, hrs, tasks, prog } from "../lib/model";

const NAV: [string, string, string][] = [["today", "Today", "/today/"], ["weeks", "Weeks", "/weeks/"], ["ladder", "Ladder", "/ladder/py/1/"], ["courses", "Courses", "/courses/220/"], ["extras", "Extra steps", "/extras/"], ["log", "Log", "/log/"]];

export function TrackerShell({ children }: { children: React.ReactNode }) {
  const { hydrated } = useStore();
  const path = usePathname() || "/";
  const page = path.split("/").filter(Boolean)[0] || "";
  const done = hydrated ? prog(tasks).done : 0;
  const [shownDone, setShownDone] = useState(0);
  useEffect(() => {
    if (!hydrated) return;
    if (done <= shownDone || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setShownDone(done); return; }
    const t = setTimeout(() => setShownDone(done), 640); /* count up when the flying tick lands */
    return () => clearTimeout(t);
  }, [done, hydrated]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const h = document.documentElement;
    if (h.getAttribute("data-zoom") === "out") { h.setAttribute("data-zoom", "in"); setTimeout(() => h.removeAttribute("data-zoom"), 900); }
  }, []);
  const fl = (h: string, t: string) => <Link href={h}>{t}</Link>;
  return (
    <>
      <header id="top" className="fixed top-0 left-0 right-0 z-40">
        <div className="hx-bar">
          <Link href="/" className="hx-mark" aria-label="Ladder intro">Ladder</Link>
          <nav className="hx-nav" aria-label="Primary">
            {NAV.map(([k, label, h]) => <Link key={k} href={h} className={"hx-l" + (page === k ? " on" : "")} aria-current={page === k ? "page" : undefined}>{label}</Link>)}
          </nav>
          <div className="hx-right">
            <span className="hx-count" title="main tasks done"><i className="hx-sq" /><span>{shownDone}/{tasks.length}</span></span>
            <span className="hx-chip">{hydrated ? hrs(dayTotal(today())) : "0"}h today</span>
            <button type="button" className="hx-menu" data-menu="1" aria-expanded="false" aria-controls="rail"><span className="hx-pip" /><span>Menu</span></button>
          </div>
        </div>
      </header>
      <main id="app" tabIndex={-1} className="outline-none">
        <div className="max-w-[1180px] mx-auto p-space-xl max-sm:p-space-md">
          {hydrated ? children : <div className="min-h-[70vh]" aria-busy="true" />}
        </div>
        <footer className="hx-foot max-w-[1180px] mx-auto px-space-xl max-sm:px-space-md pb-space-xl">
          <div className="hx-cta">
            <div><h2 className="hx-ft">Log today&apos;s hours</h2><p className="hx-fp">A day counts toward the streak at {hydrated ? +(st().threshold as number) || 4 : 4}h or more. Everything stays in this browser.</p></div>
            <Link href="/log/" className="hx-bev"><span className="hx-pip" /><span>Open log</span></Link>
          </div>
          <nav className="hx-links" aria-label="Resources">{fl("/", "Intro")}{fl("/guide/", "Guide")}{fl("/data/", "Data")}{fl("/extras/", "Extra steps")}{fl("/courses/220/", "Courses")}{fl("/weeks/", "Weeks")}</nav>
          <p className="hx-fp">Ladder, an 8 week Python, C++ and Java plan alongside CSE220, CSE250 and CSE320.</p>
        </footer>
      </main>
    </>
  );
}
