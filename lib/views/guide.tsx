"use client";
import React, { useEffect } from "react";
import { D, p2, lc } from "../model";
import { el, dv, sp } from "../ui";

export function PageGuide() {
  useEffect(() => {
    const go = () => { const id = location.hash.replace(/^#/, ""); const n = id && document.getElementById(id); if (n) n.scrollIntoView({ block: "start" }); };
    go(); window.addEventListener("hashchange", go); return () => window.removeEventListener("hashchange", go);
  }, []);
  const head = dv("flex flex-col gap-space-xs pb-space-lg",
    dv("flex items-center gap-space-sm text-on-surface-variant font-label-sm text-label-sm", sp("", "plan reference"), sp("w-1 h-1 rounded-full bg-outline-variant"), sp("", `${D.guide.length} sections`)),
    el("h1", { class: "font-headline-lg text-headline-lg text-primary tracking-tight font-semibold" }, "Guide"),
    el("p", { class: "font-body-md text-body-md text-on-surface-variant max-w-3xl" }, "The method, the daily rhythm and every rule from the plan, in one place."));
  const strip = dv("grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-space-xs p-space-xs bg-surface-container-low rounded-lg",
    D.guide.map((g: any, i: number) => el("a", { key: g.id, class: "px-space-md py-space-sm rounded font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors flex items-center justify-between gap-space-sm", href: "#/guide/" + g.id },
      sp("truncate", lc(g.title)), sp("font-code-stat text-code-stat tabular-nums text-outline", p2(i + 1)))));
  const secs = D.guide.map((g: any, i: number) => el("section", { key: g.id, class: "flex flex-col gap-space-md bg-surface-container-low p-space-lg rounded-xl scroll-mt-24", id: "g-" + g.id },
    dv("flex items-center gap-space-sm pb-space-xs", sp("font-code-stat text-code-stat tabular-nums px-space-xs py-[2px] bg-surface-container-highest text-primary rounded", p2(i + 1)), el("h2", { class: "font-headline-md text-headline-md text-primary tracking-tight" }, g.title)),
    el("div", { class: "guide-prose", html: g.html })));
  return dv("flex flex-col w-full gap-space-xl max-w-6xl mx-auto", head, strip, secs);
}
