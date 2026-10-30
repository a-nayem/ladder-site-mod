"use client";
import React from "react";
import { D, LANGS, st, tasks, byId, prog, pct, pc, refIds, parseRef, p2, lc, useStore } from "../model";
import { el, dv, sp, ic, LC, dot, bar } from "../ui";

export function PageCourses({ cid }: { cid?: string }) {
  useStore();
  const c = D.courses.find((x: any) => x.id === cid) || D.courses[0];
  const idsOf = (course: any) => { const a: any = {}; course.rows.forEach((r: any) => r[2].forEach((ref: string) => refIds(ref).forEach((id) => { a[id] = byId[id]; }))); return Object.keys(a).map((k) => a[k]); };
  const mine = idsOf(c);
  const P = prog(mine);
  const covered = c.rows.filter((r: any) => r[2].length).length;
  const head = dv("flex flex-col md:flex-row md:items-end justify-between gap-space-md",
    dv("flex flex-col",
      dv("flex items-center gap-space-xs font-label-sm text-label-sm uppercase tracking-wider text-outline mb-space-xs", sp("w-1.5 h-1.5 rounded-full bg-secondary"), sp("", "BRAC University course map")),
      el("h1", { class: "font-headline-lg text-[44px] leading-none tracking-tight text-primary font-bold" }, "Courses"),
      el("p", { class: "font-body-md text-on-surface-variant mt-space-xs" }, "Every official lecture week of your three courses, mapped to the projects that cover it.")),
    el("a", { class: "flex items-center gap-space-xs bg-surface-container-high hover:bg-surface-container-highest transition-colors px-space-md py-space-sm rounded", href: c.url, rel: "noopener", target: "_blank" }, ic("open_in_new", "text-[16px] text-secondary"), sp("font-code-stat text-code-stat text-on-surface", "bracu course page")));
  const tabs = dv("flex items-center gap-space-sm overflow-x-auto pb-space-xs", D.courses.map((x: any) => {
    const n = idsOf(x).length; const on = x.id === c.id;
    return el("a", { key: x.id, href: "#/courses/" + x.id, class: "flex items-center gap-space-sm px-space-lg py-space-sm rounded font-label-md text-label-md transition-all whitespace-nowrap " + (on ? "bg-primary text-on-primary" : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface"), "aria-current": on ? "page" : null },
      sp("font-code-stat", "CSE" + x.id), sp("", x.name.replace(/^CSE\d+ /, "")), sp("px-space-xs py-[1px] rounded font-code-stat text-label-sm " + (on ? "bg-on-primary/10" : "bg-surface-container-highest text-outline"), `${n} projects`));
  }));
  const summary = dv("grid grid-cols-1 lg:grid-cols-12 gap-space-md bg-surface-container-low rounded-xl p-space-lg",
    dv("lg:col-span-4 flex flex-col justify-between bg-surface-container p-space-lg rounded-lg",
      dv("flex items-center justify-between", sp("font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant", "weeks with a project"), sp("font-code-stat text-code-stat text-secondary px-space-xs py-[2px] rounded", `${covered}/${c.rows.length}`)),
      dv("my-space-md flex items-baseline gap-space-sm", sp("font-display-numeral text-display-numeral text-primary", String(Math.round(100 * covered / c.rows.length))), sp("font-headline-md text-headline-md text-on-surface-variant", "%"), sp("font-body-sm text-body-sm text-outline ml-space-xs", "of lecture weeks")),
      bar(100 * covered / c.rows.length, "bg-secondary", "w-full bg-surface-container-highest h-[6px] rounded overflow-hidden")),
    dv("lg:col-span-4 grid grid-cols-2 gap-space-md",
      dv("flex flex-col justify-between bg-surface-container p-space-lg rounded-lg", sp("font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant", "linked projects"),
        dv("flex items-baseline gap-space-xs my-space-sm", sp("font-display-numeral text-display-numeral text-primary", String(mine.length)), sp("font-code-stat text-code-stat text-outline", "/" + tasks.length)), sp("font-body-sm text-body-sm text-on-surface-variant", "of the main plan")),
      dv("flex flex-col justify-between bg-surface-container p-space-lg rounded-lg", sp("font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant", "done"),
        dv("flex items-baseline gap-space-xs my-space-sm", sp("font-display-numeral text-display-numeral text-py", String(P.done)), sp("font-code-stat text-code-stat text-outline", "/" + P.total)),
        dv("flex items-center justify-between", sp("font-label-sm text-label-sm text-on-surface-variant", "linked projects"), sp("font-code-stat text-code-stat text-py", pc(P) + "%")))),
    dv("lg:col-span-4 flex flex-col justify-between bg-surface-container-highest p-space-lg rounded-lg",
      dv("flex items-center gap-space-xs text-tertiary-fixed-dim", ic("warning", "text-[18px]"), sp("font-label-md text-label-md uppercase tracking-wider", "syllabus gap notice")),
      el("p", { class: "font-body-sm text-body-sm text-on-surface my-space-sm" }, c.gaps || "No gaps listed for this course."),
      dv("font-label-sm text-label-sm text-on-surface-variant pt-space-xs", c.note)));
  const rows = c.rows.map((r: any, ri: number) => {
    const chips = r[2].map((ref: string) => {
      const p = parseRef(ref);
      if (!p) return null;
      const tp = D.ladders[p.lang][p.n - 1];
      const s = prog(p.ids.map((id) => byId[id]));
      const tiers = p.tiers.length === 3 && p.tiers.join("") === "BIS" ? "" : " " + p.tiers.join(" ").toLowerCase();
      return el("a", { key: ref, class: "inline-flex items-center gap-space-xs px-space-sm py-[3px] rounded transition-colors font-label-md text-label-md " + LC[p.lang].chip, href: `#/ladder/${p.lang}/${p.n}`, title: `${s.done} of ${s.total} done` },
        dot(p.lang), sp("", `${LC[p.lang].n} ${p2(p.n)} (${lc(tp.title)}${tiers})`), s.done === s.total && ic("check", "text-[14px]"));
    });
    const ids: string[] = [].concat.apply([], r[2].map(refIds));
    const sp2 = prog(ids.map((id) => byId[id]));
    return el("tr", { key: ri, class: "hover:bg-surface-container transition-colors" },
      el("td", { class: "py-space-lg px-space-lg align-top whitespace-nowrap" }, sp("font-code-stat text-code-stat px-space-sm py-[2px] rounded " + (sp2.done ? "text-primary bg-surface-container-highest" : "text-outline bg-surface-container"), r[0])),
      el("td", { class: "py-space-lg px-space-lg align-top" }, dv("font-headline-sm text-headline-sm text-on-surface", lc(r[1]))),
      el("td", { class: "py-space-lg px-space-lg align-top" }, dv("flex flex-wrap gap-space-xs", chips)),
      el("td", { class: "py-space-lg px-space-lg align-top text-right whitespace-nowrap" },
        dv("font-code-stat text-code-stat " + (sp2.done ? "text-py" : "text-outline"), sp2.total ? `${sp2.done}/${sp2.total} done (${pc(sp2)}%)` : "no project"),
        dv("w-24 bg-surface-container-highest h-[4px] rounded ml-auto mt-space-xs overflow-hidden", el("div", { class: "h-[4px] rounded " + (sp2.done ? "bg-py" : "bg-outline"), style: "width:" + pct(sp2).toFixed(0) + "%" }))));
  });
  const table = dv("flex flex-col bg-surface-container-low rounded-xl overflow-hidden",
    dv("flex flex-wrap items-center justify-between gap-space-sm px-space-lg py-space-md bg-surface-container",
      dv("flex items-center gap-space-md", sp("font-headline-sm text-headline-sm text-primary", "Syllabus weekly schedule"), sp("font-code-stat text-code-stat text-on-surface-variant px-space-xs py-[2px] bg-surface-container-highest rounded", `${c.rows.length} weeks`)),
      dv("flex items-center gap-space-sm text-on-surface-variant font-label-sm text-label-sm", LANGS.map((L) => el("span", { key: L.k, class: "flex items-center gap-1 ml-space-sm" }, dot(L.k, "w-2 h-2"), L.name)))),
    dv("overflow-x-auto w-full", el("table", { class: "w-full text-left border-collapse" },
      el("thead", null, el("tr", { class: "bg-surface-container-high/60 text-outline font-label-sm text-label-sm uppercase tracking-wider" },
        el("th", { class: "py-space-md px-space-lg w-28" }, "Course week"), el("th", { class: "py-space-md px-space-lg" }, "Lecture topic"), el("th", { class: "py-space-md px-space-lg" }, "Built in"), el("th", { class: "py-space-md px-space-lg text-right w-48" }, "Done"))),
      el("tbody", { class: "divide-y divide-surface-container-highest/60 font-body-sm text-body-sm" }, rows))));
  return dv("flex flex-col w-full gap-space-xl", head, tabs, summary, table,
    el("p", { class: "font-body-sm text-body-sm text-on-surface-variant max-w-3xl" }, "Solve every problem by hand first. Use your tool to check the answer, never to produce it. Week numbers follow the department pages, so edit the plan if your instructor differs."));
}
