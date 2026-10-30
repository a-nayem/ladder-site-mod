"use client";
import React, { useEffect } from "react";
import { D, LANGS, LNAME, TIER, Task, st, tasks, extraList, prog, pct, pc, ofLang, topicTasks, isDone, parse, fmt, hrs, p2, dur, lc, mins, nextTasks, ui, emit, useStore } from "../model";
import { el, dv, sp, ic, rich, LC, dot, tierColor, tierName, tagName, courseChip, tick, noteButton, noteBox, sep, bar } from "../ui";
import { PageToday } from "./today";

const topicMins = (tt: Task[]) => tt.reduce((a, t) => a + mins(t), 0);

export function PageLadder({ lang, n }: { lang: string; n?: number }) {
  useStore();
  const S = st();
  useEffect(() => { if (n) { const x = document.getElementById(`topic-${lang}-${n}`); if (x) x.scrollIntoView({ block: "start" }); } }, [lang, n]);
  const L = LANGS.find((x) => x.k === lang);
  if (!L) return <PageToday />;
  const list = D.ladders[lang];
  if (!ui.seen[lang]) {
    ui.seen[lang] = true;
    const first = list.find((tp: any) => topicTasks(lang, tp.n).some((t) => !isDone(t.id)));
    if (first) ui.open[lang + "." + first.n] = true;
  }
  if (n && ui.openedFromRoute !== lang + n) { ui.openedFromRoute = lang + n; ui.open[lang + "." + n] = true; }
  const P = prog(ofLang(lang));
  const all = ofLang(lang);
  const touched = list.filter((tp: any) => topicTasks(lang, tp.n).some((t) => isDone(t.id))).length;
  const ng = nextTasks(lang, 1)[0];
  const nextId = ng ? ng.id : "";
  const nextGate = tasks.filter((t) => t.lang === lang && t.kind === "gate" && !isDone(t.id)).sort((a, b) => a.week - b.week)[0];
  const totalMin = all.reduce((a, t) => a + mins(t), 0);
  const head = dv("flex flex-col gap-space-md mb-space-xl",
    dv("flex flex-col md:flex-row md:items-end justify-between gap-space-md",
      dv("flex items-center gap-space-md", dot(lang, "w-3.5 h-3.5"), el("h1", { class: "font-headline-lg text-headline-lg tracking-tight text-primary" }, LC[lang].n),
        sp("font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant bg-surface-container-high px-space-xs py-[2px] rounded", "main track")),
      dv("flex items-center gap-space-sm font-label-md text-label-md text-on-surface-variant", sp("", `${list.length} topics`), sp("text-outline-variant", "•"), sp("", "20 min lesson plus 3 projects each"))),
    dv("flex flex-wrap items-center justify-between gap-y-space-xs text-on-surface-variant font-label-md text-label-md",
      dv("flex flex-wrap items-center gap-x-space-sm",
        sp("text-primary font-code-stat text-code-stat tabular-nums", `${P.done} of ${P.total} tasks complete (${pc(P)}%)`), sp("text-outline-variant", "•"),
        sp("", `${touched} of ${list.length} topics touched`), nextGate && sp("text-outline-variant", "•"),
        nextGate && sp("text-secondary", `${lc(nextGate.label as string)} target: w${nextGate.week}`)),
      sp("font-code-stat text-code-stat tabular-nums text-outline", `total track weight: ${hrs(totalMin / 60)} hrs`)),
    dv("w-full h-[6px] bg-surface-container-high rounded p-[1.5px] flex items-center", el("div", { class: "h-[3px] rounded-sm transition-all duration-300 " + LC[lang].bg, style: "width:" + pct(P).toFixed(2) + "%" })));

  const hasTag = (tp: any, tg: string) => topicTasks(lang, tp.n).some((t) => t.tag === tg);
  const gt = tasks.filter((t) => t.lang === lang && (t.kind === "gate" || t.kind === "cap")).sort((a, b) => a.week - b.week);
  const filters: [string, string, (tp: any) => boolean][] = [["all", `all topics (${list.length})`, () => true]];
  ["220", "250", "320"].forEach((c) => { const k = list.filter((tp: any) => hasTag(tp, c)).length; if (k) filters.push([c, `cse${c} mapped (${k})`, (tp) => hasTag(tp, c)]); });
  filters.push(["incomplete", `incomplete only (${list.filter((tp: any) => topicTasks(lang, tp.n).some((t) => !isDone(t.id))).length})`, (tp) => topicTasks(lang, tp.n).some((t) => !isDone(t.id))]);
  filters.push(["gates", `gates & capstones (${gt.length})`, () => false]);
  if (!filters.some((f) => f[0] === ui.filter)) ui.filter = "all";
  const active = filters.find((f) => f[0] === ui.filter) as any;
  const bar2 = dv("flex flex-col sm:flex-row sm:items-center justify-between gap-space-md py-space-sm mb-space-lg bg-surface-container-low px-space-md rounded",
    dv("flex flex-wrap items-center gap-space-xs", filters.map((f) => el("button", { key: f[0], type: "button", class: "px-space-md h-8 rounded font-label-md text-label-md transition-colors " + (f[0] === ui.filter ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant hover:text-on-surface"), "aria-pressed": f[0] === ui.filter ? "true" : "false", onclick: () => { ui.filter = f[0]; emit(); } }, f[1]))),
    dv("flex items-center gap-space-xs self-end sm:self-auto font-label-sm text-label-sm",
      el("button", { type: "button", class: "px-space-sm h-7 rounded bg-surface-container-high text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors", onclick: () => { list.forEach((tp: any) => { ui.open[lang + "." + tp.n] = true; }); emit(); } }, "expand all"),
      el("button", { type: "button", class: "px-space-sm h-7 rounded bg-surface-container-high text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors", onclick: () => { list.forEach((tp: any) => { ui.open[lang + "." + tp.n] = false; }); emit(); } }, "collapse all")));

  const items = list.filter((tp: any) => active[2](tp)).map((tp: any) => {
    const key = lang + "." + tp.n;
    const open = !!ui.open[key];
    const tt = topicTasks(lang, tp.n);
    const tp2 = prog(tt);
    const tags: string[] = [];
    tt.forEach((t) => { if (t.tag && tags.indexOf(t.tag) < 0) tags.push(t.tag); });
    const head2 = el("button", { type: "button", class: "w-full text-left flex items-center justify-between p-space-lg cursor-pointer hover:bg-surface-container-high transition-colors select-none " + (open ? "bg-surface-container-high" : "bg-surface-container"), "aria-expanded": open ? "true" : "false", "aria-controls": "p-" + key, onclick: () => { ui.open[key] = !ui.open[key]; emit(); } },
      dv("flex items-center gap-space-md min-w-0 pr-space-md",
        sp("font-display-numeral text-[1.75rem] leading-none tabular-nums shrink-0 font-bold " + LC[lang].tx, p2(tp.n)),
        dv("flex flex-col gap-[3px] min-w-0",
          sp("font-headline-sm text-headline-sm text-primary truncate", lc(tp.title)),
          dv("flex flex-wrap items-center gap-space-xs",
            tags.map((tg) => <span key={tg} className="h-[22px] px-space-xs flex items-center gap-[4px] rounded bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wide">{tg === "220" || tg === "250" || tg === "320" ? dot(lang) : null}{tagName(tg)}</span>),
            sp("font-code-stat text-code-stat text-outline text-[12px] tabular-nums", dur(topicMins(tt)) + " total")))),
      dv("flex items-center gap-space-lg shrink-0",
        dv("hidden md:flex flex-col items-end gap-[3px]", sp("font-code-stat text-code-stat tabular-nums " + (tp2.done === tp2.total ? LC[lang].tx : "text-on-surface-variant"), `${tp2.done}/${tp2.total} done`), sp("font-label-sm text-label-sm text-outline", `${pc(tp2)}% complete`)),
        dv("flex items-center gap-[3px] p-[3px] bg-surface-container-highest rounded", tt.map((t) => <span key={t.id} className={"w-2.5 h-2.5 rounded-[1px] " + (isDone(t.id) ? LC[lang].bg : t.id === nextId ? "bg-secondary" : "bg-surface-variant")} />)),
        sp("hidden sm:inline font-label-sm text-label-sm uppercase tracking-wider px-space-xs py-[2px] bg-surface-container-highest text-on-surface-variant rounded", "week " + tt[0].week),
        ic("expand_more", "text-outline text-[20px] transition-transform duration-200 " + (open ? "rotate-180" : ""))));
    return el("div", { key: key, class: "topic rounded-xl overflow-hidden bg-surface-container" + (open ? " open" : ""), id: `topic-${lang}-${tp.n}` }, head2,
      open ? el("div", { class: "bg-surface-container-low p-space-lg flex flex-col gap-space-sm", id: "p-" + key },
        dv("flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm pb-space-xs", sp("", "sub-tasks breakdown"), sp("font-code-stat text-code-stat tabular-nums", `target: ${topicMins(tt)} min total`)),
        dv("flex flex-col gap-[2px]", tt.map((t) => <React.Fragment key={t.id}>{ladderRow(t, t.id === nextId)}</React.Fragment>))) : null);
  });
  const xp = extraList.filter((x) => x.road === lang);
  return dv("flex flex-col w-full", head, bar2,
    dv("flex flex-col gap-space-md mb-space-xl", items, !items.length && ui.filter !== "gates" ? sp("font-body-md text-on-surface-variant", "No topics match this filter.") : null),
    gt.length ? dv("flex flex-col gap-space-md",
      dv("flex items-center justify-between", dv("flex items-center gap-space-sm", ic("flag", "text-[20px] " + LC[lang].tx), el("h2", { class: "font-headline-md text-headline-md text-primary" }, "major gates and capstones")), sp("font-label-sm text-label-sm text-outline uppercase tracking-wider", "verification requirements")),
      dv("grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-space-md", gt.map((t) => <React.Fragment key={t.id}>{gateCard(t)}</React.Fragment>))) : null,
    el("a", { class: "mt-space-xl font-body-sm text-body-sm text-secondary hover:underline self-start", href: "#/extras/" + lang }, `${prog(xp).done} of ${xp.length} extra steps from roadmap.sh for ${LNAME[lang]}`));
}

function ladderRow(t: Task, isNext: boolean) {
  const S = st();
  const done = isDone(t.id);
  const cc = courseChip(t.tag);
  return dv("flex items-start sm:items-center justify-between gap-space-md p-space-md bg-surface-container rounded hover:bg-surface-container-high transition-colors",
    dv("flex items-start sm:items-center gap-space-md min-w-0 flex-1",
      el("div", { class: "mt-0.5 sm:mt-0" }, tick(t.id, `${LNAME[t.lang]} ${tierName(t)}: ${t.text}`, t.lang)),
      dv("flex flex-col gap-[2px] min-w-0 flex-1",
        dv("flex flex-wrap items-center gap-space-xs",
          sp("font-label-sm text-label-sm px-space-xs py-[1px] bg-surface-container-highest rounded " + tierColor(t), tierName(t) + (t.kind === "B" || t.kind === "I" || t.kind === "S" ? " project" : "")),
          sp("font-body-md text-body-md font-medium break-words " + (done ? "text-on-surface-variant line-through" : "text-primary"), rich(t.text)),
          isNext && sp("font-label-sm text-label-sm px-space-xs py-[1px] bg-secondary-container text-on-secondary-container rounded font-bold", "next up")),
        dv("flex items-center gap-space-sm font-body-sm text-body-sm text-on-surface-variant", cc, cc && sep(), noteButton(t.id)),
        noteBox(t.id))),
    dv("flex items-center gap-space-md shrink-0 font-code-stat text-code-stat text-outline tabular-nums",
      sp("", mins(t) + " min"),
      sp("text-[12px] hidden md:inline " + (done ? "text-on-surface-variant" : isNext ? "text-secondary" : "text-outline"), done ? "completed " + lc(fmt(parse(S.done[t.id]))) : isNext ? "queued" : "pending")));
}
function usesProg(t: Task) {
  const m = t.uses && /^(Python|C\+\+|Java) (\d+) to (\d+)$/.exec(t.uses);
  const list = m ? tasks.filter((x) => TIER[x.kind] && x.lang === t.lang && x.n >= +m[2] && x.n <= +m[3]) : tasks.filter((x) => TIER[x.kind] && x.lang === t.lang);
  return prog(list);
}
function gateCard(t: Task) {
  const done = isDone(t.id);
  const up = usesProg(t);
  return dv("p-space-lg rounded-xl bg-surface-container flex flex-col justify-between gap-space-lg",
    dv("flex flex-col gap-space-sm",
      dv("flex items-center justify-between",
        sp("font-label-sm text-label-sm uppercase tracking-wider font-bold " + (t.kind === "cap" ? "text-secondary" : LC[t.lang].tx), lc(t.label as string)),
        dv("flex items-center gap-space-sm", sp("font-label-sm text-label-sm text-outline", "week " + t.week), tick(t.id, lc(t.label as string) + ": " + t.text, t.lang))),
      sp("font-body-md text-body-md break-words " + (done ? "text-on-surface-variant line-through" : "text-primary"), rich(t.text)),
      dv("flex items-center gap-space-sm font-body-sm text-body-sm text-on-surface-variant", sp("", dur(mins(t))), courseChip(t.tag) && sep(), courseChip(t.tag), sep(), noteButton(t.id)), noteBox(t.id)),
    dv("flex flex-col gap-space-xs pt-space-xs bg-surface-container-low p-space-sm rounded",
      dv("flex items-center justify-between font-label-sm text-label-sm", sp("text-outline", "prerequisite progress"), sp("font-code-stat text-code-stat text-outline tabular-nums", `${up.done} / ${up.total} tasks`)),
      bar(pct(up), "bg-secondary", "w-full h-1 bg-surface-variant rounded overflow-hidden"),
      sp("font-label-sm text-label-sm text-outline", t.uses ? "uses " + lc(t.uses) : "needs every main task of this language")));
}
