"use client";
import React from "react";
import { D, LANGS, LNAME, st, tasks, weekTasks, prog, pct, pc, isDone, curWeek, weekStart, addDays, parse, fmt, streak, p2, dur, lc, mins, useStore } from "../model";
import { el, dv, sp, ic, rich, LC, dot, courseChip, tick, noteButton, noteBox, sep, bar, pill } from "../ui";

export function PageWeeks() {
  useStore();
  const S = st();
  const cw = curWeek();
  const P = prog(tasks);
  const head = dv("flex flex-col gap-space-md pb-space-xl",
    dv("flex flex-col md:flex-row md:items-end justify-between gap-space-md",
      dv("flex flex-col gap-space-xs",
        el("h1", { class: "font-headline-lg text-[44px] leading-none tracking-tight font-bold text-primary" }, "Weeks"),
        el("p", { class: "font-body-md text-body-md text-on-surface-variant" }, `Eight weeks from ${fmt(parse(S.start))}. Each topic is a lesson plus three projects. Gates replace the Friday rebuild day.`)),
      dv("flex items-center gap-space-xs flex-wrap",
        pill("bg-surface-container-high text-on-surface font-code-stat text-code-stat tabular-nums", sp("w-2 h-2 rounded-full bg-secondary"), sp("", "8 weeks"), sp("text-outline", "/"), sp("", "56 days"), sp("text-outline", "/"), sp("", `${P.total} main tasks`), sp("text-outline", "/"), sp("", "3 capstones")))),
    dv("grid grid-cols-4 md:grid-cols-8 gap-space-xs pt-space-xs", D.weeks.map((w: any) => {
      const p = prog(weekTasks(w.w));
      return el("div", { key: w.w, class: "flex flex-col gap-space-xs" }, bar(pct(p), "bg-primary", "h-1.5 w-full bg-surface-container-highest rounded-sm overflow-hidden"),
        sp("font-label-sm text-label-sm font-code-stat tabular-nums " + (p.done > 0 ? "text-primary" : "text-outline"), `w${p2(w.w)} ${pc(p)}%`));
    })));

  const cards = D.weeks.map((w: any) => {
    const wt = weekTasks(w.w);
    const p = prog(wt);
    const isNow = w.w === cw.week;
    const gt = wt.filter((t) => t.kind === "gate" || t.kind === "cap");
    const isCap = gt.some((t) => t.kind === "cap");
    const lanes = LANGS.map((L) => {
      const r = w[L.k];
      const lp = prog(wt.filter((t) => t.lang === L.k));
      const topics: any[] = [];
      for (let n = r[0]; n <= r[1]; n++) {
        const tp = D.ladders[L.k][n - 1];
        topics.push(el("a", { key: n, class: "flex items-center gap-space-xs bg-surface-container-high hover:bg-surface-container-highest transition-colors px-space-sm py-[3px] rounded", href: `#/ladder/${L.k}/${n}`, "aria-label": `${L.name} topic ${n}: ${tp.title}` },
          sp("font-body-sm text-body-sm text-on-surface", `${p2(n)}. ${tp.title}`),
          dv("flex items-center gap-[2px] ml-space-xs", ["L", "B", "I", "S"].map((k) => isDone(`${L.k}.${n}.${k}`)
            ? <span key={k} className={"w-3.5 h-3.5 rounded-[2px] flex items-center justify-center text-[10px] text-surface font-bold " + LC[L.k].bg}>✓</span>
            : <span key={k} className="w-3.5 h-3.5 rounded-[2px] bg-surface-container-highest" />))));
      }
      return dv("flex flex-col md:flex-row md:items-center justify-between p-space-sm bg-surface-container-low rounded gap-space-sm " + (isNow ? "" : "bg-surface-container"),
        dv("flex items-center gap-space-sm min-w-[100px]", dot(L.k, "w-2 h-2"), sp("font-label-md text-label-md text-on-surface", L.name)),
        dv("flex flex-wrap items-center gap-space-md flex-1", topics),
        sp("font-code-stat text-code-stat tabular-nums text-right " + (lp.done ? LC[L.k].tx : "text-on-surface-variant"), `${lp.done}/${lp.total}`));
    });
    let gateBlock: any = null;
    if (isCap) {
      gateBlock = dv("grid grid-cols-1 md:grid-cols-3 gap-space-sm", gt.map((t) => dv("flex flex-col gap-space-xs p-space-md bg-surface-container-high rounded",
        dv("flex items-center justify-between", dv("flex items-center gap-space-sm", dot(t.lang, "w-2 h-2"), sp("font-label-sm text-label-sm uppercase tracking-wider font-semibold " + LC[t.lang].tx, "capstone " + lc(LNAME[t.lang]))), tick(t.id, "Capstone " + LNAME[t.lang] + ": " + t.text, t.lang)),
        sp("font-body-sm text-body-sm text-on-surface", rich(t.text)), dv("flex items-center gap-space-sm", noteButton(t.id)), noteBox(t.id))));
    } else if (gt.length) {
      gateBlock = gt.map((t) => dv("flex flex-col gap-space-xs bg-surface-container-high p-space-md rounded",
        dv("flex items-center gap-space-sm", tick(t.id, lc(t.label as string) + ": " + t.text, t.lang), ic("verified", "text-[16px] text-tertiary-fixed-dim"),
          sp("font-label-sm text-label-sm uppercase tracking-wider text-outline", "milestone:"), sp("font-body-sm text-body-sm text-primary font-medium " + (isDone(t.id) ? "line-through text-on-surface-variant" : ""), `${t.label}: `, rich(t.text))),
        dv("pl-[30px] flex items-center gap-space-sm font-body-sm text-body-sm text-on-surface-variant", sp("", "uses " + lc(t.uses as string)), sep(), sp("", dur(mins(t))), courseChip(t.tag) && sep(), courseChip(t.tag), sep(), noteButton(t.id)),
        noteBox(t.id) && dv("pl-[30px]", noteBox(t.id))));
    }
    return el("article", { key: w.w, class: "relative rounded-[10px] p-space-lg flex flex-col gap-space-md " + (isNow ? "bg-surface-container" : "bg-surface-container-low hover:bg-surface-container transition-colors"), id: "week-" + w.w },
      isNow ? dv("absolute top-0 left-0 right-0 h-[3px] bg-surface-container-highest rounded-t-[10px] overflow-hidden", el("div", { class: "h-full bg-primary", style: "width:" + pct(p).toFixed(1) + "%" })) : null,
      dv("flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pt-space-xs",
        dv("flex items-center gap-space-sm",
          sp("px-space-xs py-[1px] font-label-sm text-label-sm rounded uppercase tracking-wider font-semibold " + (isNow ? "bg-primary text-on-primary" : isCap ? "bg-secondary-container text-on-secondary-container" : "bg-surface-container-highest text-on-surface-variant"), isNow ? "now" : isCap ? "capstones" : "w" + p2(w.w)),
          el("h2", { class: "font-headline-md text-headline-md text-primary" }, `Week ${w.w} • ${fmt(weekStart(w.w))} - ${fmt(addDays(weekStart(w.w), 6))}`)),
        dv("flex items-center gap-space-sm", sp("font-code-stat text-code-stat tabular-nums text-on-surface", `${p.done} of ${p.total} tasks done`), sp("px-space-xs py-[2px] bg-surface-container-highest rounded font-code-stat text-code-stat tabular-nums text-secondary font-semibold", pc(p) + "%"))),
      dv("flex flex-col gap-space-sm", lanes), gateBlock,
      dv("flex flex-col md:flex-row md:items-center gap-space-sm bg-surface-container-high p-space-md rounded",
        sp("font-label-sm text-label-sm uppercase tracking-wider text-outline", "course payoff:"), sp("font-body-sm text-body-sm text-on-surface-variant", w.payoff)));
  });
  const X = prog(tasks);
  const foot = dv("flex flex-col sm:flex-row items-center justify-between py-space-xl text-on-surface-variant gap-space-md",
    dv("flex items-center gap-space-sm", ic("sync", "text-[16px]"), sp("font-body-sm text-body-sm", "Every project is mapped to CSE220, CSE250 and CSE320 on the Courses page.")),
    dv("flex items-center gap-space-lg font-code-stat text-code-stat tabular-nums", sp("", `Completed: ${X.done}`), sp("text-outline", "/"), sp("", `Remaining: ${X.total - X.done}`), sp("text-outline", "/"), sp("text-primary", `Streak: ${streak()} d`)));
  return dv("flex flex-col w-full", head, dv("flex flex-col gap-space-lg", cards), foot);
}
