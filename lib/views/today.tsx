"use client";
import React, { useRef } from "react";
import { D, LANGS, LNAME, TIER, Task, st, tasks, extraList, weekTasks, prog, pct, pc, ofLang, isDone, curWeek, weekStart, addDays, parse, fmt, today, dayDiff, streak, hrs, p2, dur, lc, mins, nextTasks, DAILY_ORDER, entry, dayTotal, THR, saveHours, useStore } from "../model";
import { el, dv, sp, ic, rich, LC, dot, tierName, courseChip, tick, noteButton, noteBox, metaLine, bar, pill } from "../ui";

export function taskCode(t: Task) {
  if (TIER[t.kind]) return `T${p2(t.n)}.${p2(TIER[t.kind].rank + 1)}`;
  return t.kind === "gate" ? "G." + t.short : "CAP." + lc(t.lang);
}

export function PageToday() {
  useStore();
  const S = st();
  const cw = curWeek();
  const tg = (cw.week as number) > 4 ? D.dailyTargets.late : D.dailyTargets.early;
  const target = tg.py + tg.cpp + tg.java;
  const title = cw.week ? `Week ${cw.week} of 8` : cw.before ? `Starts in ${cw.before} ${cw.before === 1 ? "day" : "days"}` : "Plan complete";
  const range = cw.week ? `${fmt(weekStart(cw.week))} - ${fmt(addDays(weekStart(cw.week), 6))}` : `Week 1 begins ${fmt(parse(S.start))}`;
  const dayN = cw.week ? Math.min(56, dayDiff(parse(today()), parse(S.start)) + 1) : cw.over ? 56 : 0;
  const sk = streak();
  const head = el("section", { class: "flex flex-col md:flex-row md:items-end justify-between gap-space-md" },
    dv("flex flex-col gap-space-xs",
      el("h1", { class: "font-headline-lg text-headline-lg text-primary tracking-tight font-bold" }, title),
      el("p", { class: "font-body-md text-body-md text-on-surface-variant" }, `${range} • Target: ${hrs(target)}h daily (python ${hrs(tg.py)}h, c++ ${hrs(tg.cpp)}h, java ${hrs(tg.java)}h)`)),
    dv("flex items-center gap-space-sm self-start md:self-auto",
      pill("bg-surface-container-high text-on-surface", sp("w-1.5 h-1.5 rounded-full bg-secondary"), sp("font-label-md text-label-md", `Day ${dayN} of 56`)),
      pill("bg-surface-container font-code-stat text-code-stat text-on-surface-variant tabular-nums", `streak: ${sk} ${sk === 1 ? "day" : "days"}`)));
  let list: Task[] = [];
  DAILY_ORDER.forEach((k) => { list = list.concat(nextTasks(k, 2)); });
  return dv("flex flex-col w-full gap-space-xl", head, <Board now={cw.week} key="board" />,
    dv("grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start",
      dv("lg:col-span-7 flex flex-col gap-space-lg", upNext(list)),
      dv("lg:col-span-5 flex flex-col gap-space-lg", <TodayLog key="tl" />, mainBox(), extraBox())));
}

function Board({ now }: { now: number }) {
  return el("section", { class: "w-full bg-surface-container-low rounded-lg p-space-md", "aria-label": "Eight week board" },
    dv("grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-space-sm", D.weeks.map((w: any) => {
      const wt = weekTasks(w.w);
      const parts = LANGS.map((L) => ({ L, p: prog(wt.filter((t) => t.lang === L.k)) }));
      const label = `Week ${w.w}, ${fmt(weekStart(w.w))}. ` + parts.map((x) => `${x.L.name} ${x.p.done} of ${x.p.total}`).join(", ");
      const isNow = w.w === now;
      const gates = wt.filter((t) => t.kind === "gate" || t.kind === "cap");
      return el("a", { key: w.w, class: "flex flex-col justify-between p-space-sm rounded relative h-28 transition-colors hover:bg-surface-container-high " + (isNow ? "bg-surface-container-highest" : "bg-surface-container"), href: "#/weeks/" + w.w, "aria-label": label, "aria-current": isNow ? "step" : null },
        dv("flex items-center justify-between",
          sp("font-label-md text-label-md font-bold " + (isNow ? "text-primary" : "text-on-surface-variant"), "W" + w.w),
          isNow ? sp("font-label-sm text-label-sm bg-primary text-on-primary font-bold px-[4px] py-[1px] rounded-[2px] uppercase", "now")
            : sp("font-label-sm text-label-sm text-outline", gates.some((g) => g.kind === "cap") ? "caps" : gates.map((g) => lc(g.short as string)).join(" "))),
        dv("flex items-end justify-center gap-[4px] h-12 py-space-xs",
          parts.map((x) => dv("w-2 bg-surface-variant rounded-t-sm h-full flex items-end", el("div", { key: x.L.k, class: "w-full rounded-t-sm " + LC[x.L.k].bg, style: "height:" + pct(x.p).toFixed(1) + "%" })))),
        sp("font-label-sm text-label-sm truncate " + (isNow ? "text-on-surface-variant" : "text-outline"), `${fmt(weekStart(w.w))} - ${fmt(addDays(weekStart(w.w), 6))}`));
    })));
}

function todayRow(t: Task) {
  const L = LC[t.lang];
  const done = isDone(t.id);
  const info: any[] = [];
  if (TIER[t.kind]) info.push(el("a", { class: "hover:underline", href: `#/ladder/${t.lang}/${t.n}` }, `${LNAME[t.lang].toLowerCase()} topic ${p2(t.n)}`));
  else info.push(sp("", lc(t.label as string)));
  info.push(sp("", dur(mins(t))));
  const cc = courseChip(t.tag);
  if (cc) info.push(cc);
  info.push(noteButton(t.id));
  return dv("group flex items-start gap-space-md p-space-md bg-surface-container rounded hover:bg-surface-container-high transition-colors",
    el("div", { class: "mt-[2px]" }, tick(t.id, `${LNAME[t.lang]} ${tierName(t)}: ${t.text}`, t.lang)),
    dv("flex flex-col flex-1 min-w-0 gap-[3px]",
      dv("flex items-center gap-space-xs",
        sp("inline-flex items-center gap-space-xs px-space-xs py-[1px] bg-surface-container-highest rounded text-label-sm font-label-sm " + L.tx, dot(t.lang), L.n),
        sp("font-label-sm text-label-sm text-on-surface-variant uppercase", tierName(t))),
      sp("font-body-md text-body-md font-medium leading-snug break-words " + (done ? "text-on-surface-variant line-through" : "text-on-surface"), rich(t.text)),
      metaLine(info), noteBox(t.id)),
    sp("font-code-stat text-code-stat text-outline tabular-nums text-right flex-shrink-0", taskCode(t)));
}
function upNext(list: Task[]) {
  return el("section", { class: "bg-surface-container-low rounded-lg p-space-lg flex flex-col gap-space-md", "aria-labelledby": "upH" },
    dv("flex items-center justify-between pb-space-sm",
      dv("flex flex-col", el("h2", { id: "upH", class: "font-headline-md text-headline-md text-primary tracking-tight" }, "Up next"), sp("font-body-sm text-body-sm text-on-surface-variant", "Next 2 undone tasks per language")),
      sp("font-code-stat text-code-stat text-on-surface-variant tabular-nums", `${list.length} actionable`)),
    dv("flex flex-col gap-[2px]", !list.length ? sp("font-body-md text-on-surface-variant py-space-lg", "Every main task is done.") : null, list.map((t) => <React.Fragment key={t.id}>{todayRow(t)}</React.Fragment>)));
}

/* hours panel on Today. Inputs are uncontrolled and remount when the saved record changes. */
function TodayLog() {
  const k = today(), e = entry(k) || {};
  const tot = dayTotal(k);
  const r = { py: useRef<HTMLInputElement>(null), cpp: useRef<HTMLInputElement>(null), java: useRef<HTMLInputElement>(null) };
  const note = useRef<HTMLTextAreaElement>(null);
  const sig = JSON.stringify(e);
  const input = (lang: "py" | "cpp" | "java", label: string) => dv("flex flex-col gap-space-xs",
    el("label", { class: "font-label-sm text-label-sm flex items-center gap-[4px] " + LC[lang].tx, for: "lh-" + lang }, dot(lang), LC[lang].n),
    dv("relative flex items-center bg-surface-container rounded focus-within:ring-1 focus-within:ring-primary",
      <input key={lang + sig} ref={r[lang]} id={"lh-" + lang} className="w-full bg-transparent px-space-sm py-[6px] font-code-stat text-code-stat text-primary tabular-nums focus:outline-none min-w-0" type="number" min="0" max="24" step="0.5" placeholder="0.0" aria-label={label + " hours"} defaultValue={e[lang] ? e[lang] : ""} />,
      sp("font-label-sm text-label-sm text-outline pr-space-xs", "h")));
  const status = tot ? `${hrs(tot)}h logged (streak needs >= ${hrs(THR())}h)` : `nothing logged yet (streak needs >= ${hrs(THR())}h)`;
  return el("section", { class: "bg-surface-container-low rounded-lg p-space-lg flex flex-col gap-space-md", "aria-labelledby": "hrsH" },
    dv("flex items-center justify-between", el("h2", { id: "hrsH", class: "font-headline-md text-headline-md text-primary" }, "Hours today"), sp("font-label-sm text-label-sm text-on-surface-variant uppercase", "daily log")),
    dv("grid grid-cols-3 gap-space-sm", input("py", "Python"), input("cpp", "C++"), input("java", "Java")),
    dv("flex flex-col gap-space-xs", el("label", { class: "font-label-sm text-label-sm text-on-surface-variant", for: "ln" }, "Log notes"),
      <textarea key={"n" + sig} ref={note} id="ln" className="w-full bg-surface-container rounded p-space-sm font-body-sm text-body-sm text-primary placeholder-outline resize-none focus:outline-none focus:ring-1 focus:ring-primary" rows={2} placeholder="what you built or read today" defaultValue={e.note || ""} />),
    dv("flex flex-col gap-space-xs pt-space-xs",
      el("button", { class: "w-full py-[8px] px-space-md bg-primary hover:opacity-90 active:opacity-80 text-on-primary font-label-md text-label-md rounded flex items-center justify-center gap-space-xs transition-opacity", type: "button",
        onclick: () => saveHours(k, { py: r.py.current?.value || "", cpp: r.cpp.current?.value || "", java: r.java.current?.value || "" }, note.current?.value || "") }, ic("save", "text-[16px]"), sp("", "Save hours")),
      sp("font-label-sm text-label-sm text-on-surface-variant text-center tabular-nums", status)));
}

function mainBox() {
  const P = prog(tasks);
  const per = LANGS.map((L) => {
    const p = prog(ofLang(L.k));
    const gate = tasks.filter((t) => t.lang === L.k && t.kind === "gate" && !isDone(t.id)).sort((a, b) => a.week - b.week)[0];
    return dv("flex flex-col gap-[3px]", 
      dv("flex items-center justify-between font-label-sm text-label-sm", sp(LC[L.k].tx + " font-medium", LC[L.k].n), sp("font-code-stat text-code-stat tabular-nums text-on-surface", `${p.done} of ${p.total} tasks (${pc(p)}%)`)),
      bar(pct(p), LC[L.k].fill, "w-full h-[4px] bg-surface-variant rounded-full overflow-hidden"),
      sp("font-label-sm text-label-sm text-on-surface-variant", gate ? `next gate: ${lc(gate.label as string)} in week ${gate.week}` : "all gates cleared"));
  });
  const G = prog(tasks.filter((t) => t.kind === "gate")), C = prog(tasks.filter((t) => t.kind === "cap"));
  return el("section", { class: "bg-surface-container-low rounded-lg p-space-lg flex flex-col gap-space-md", "aria-labelledby": "mainH" },
    dv("flex items-center justify-between", el("h2", { id: "mainH", class: "font-headline-md text-headline-md text-primary" }, "Main plan"), sp("font-label-sm text-label-sm text-on-surface-variant uppercase", "progress")),
    dv("flex items-baseline gap-space-sm", sp("font-display-numeral text-display-numeral text-primary", String(P.done)), sp("font-body-md text-body-md text-on-surface-variant", `of ${P.total} tasks (${pc(P)}%)`)),
    el("div", { class: "w-full h-[6px] bg-surface-variant rounded-full flex overflow-hidden", role: "img", "aria-label": `Main plan ${P.done} of ${P.total}` },
      LANGS.map((L) => el("div", { key: L.k, class: "h-full " + LC[L.k].bg, style: `width:${(100 * prog(ofLang(L.k)).done / P.total).toFixed(2)}%` }))),
    dv("flex flex-col gap-space-sm pt-space-xs", per),
    dv("flex items-center justify-between pt-space-sm bg-surface-container-high p-space-sm rounded font-label-sm text-label-sm text-on-surface-variant",
      sp("", "gates: ", el("strong", { class: "text-on-surface font-code-stat font-normal" }, `${G.done} of ${G.total} cleared`)), sp("", "•"),
      sp("", "capstones: ", el("strong", { class: "text-on-surface font-code-stat font-normal" }, `${C.done} of ${C.total} done`))));
}
function extraBox() {
  const P = prog(extraList);
  return el("section", { class: "bg-surface-container rounded-lg p-space-lg flex flex-col gap-space-sm opacity-90", "aria-labelledby": "extraH" },
    dv("flex items-center justify-between",
      dv("flex items-center gap-space-xs", ic("route", "text-[16px] text-outline"), el("h2", { id: "extraH", class: "font-headline-sm text-headline-sm text-on-surface" }, `${P.total} extra steps from roadmap.sh`)),
      sp("font-label-sm text-label-sm text-outline uppercase", "optional")),
    el("p", { class: "font-body-sm text-body-sm text-on-surface-variant" }, D.extras.map((r: any) => LC[r.key].n + " " + prog(extraList.filter((x) => x.road === r.key)).total).join(" • ")),
    bar(pct(P), "bg-secondary", "w-full h-[4px] bg-surface-variant rounded-full overflow-hidden opacity-60 my-[2px]"),
    dv("flex items-center justify-between pt-space-xs font-label-sm text-label-sm",
      sp("text-on-surface-variant font-code-stat tabular-nums", `${P.done} of ${P.total} completed • non-blocking`),
      el("a", { class: "text-secondary hover:underline flex items-center gap-[2px]", href: "#/extras" }, sp("", "view extra steps"), ic("chevron_right", "text-[12px]"))));
}
