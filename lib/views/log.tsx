"use client";
import React, { useState, useEffect } from "react";
import { D, LANGS, st, save, ui, emit, today, parse, iso, addDays, fmt, dayDiff, curWeek, THR, entry, dayTotal, streak, hrs, lc, readNum, saveHours, useStore } from "../model";
import { el, dv, sp, ic, LC, dot, pill } from "../ui";

const DOW = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

function Form({ dk, t }: { dk: string; t: string }) {
  const S = st();
  const e = entry(dk) || {};
  const tg = curWeek().week > 4 ? D.dailyTargets.late : D.dailyTargets.early;
  const init = () => ({ py: e.py ? String(e.py) : "", cpp: e.cpp ? String(e.cpp) : "", java: e.java ? String(e.java) : "", note: e.note || "" });
  const [f, setF] = useState(init);
  useEffect(() => { setF(init()); }, [dk, JSON.stringify(e)]);
  const total = readNum(f.py) + readNum(f.cpp) + readNum(f.java);
  const bump = (l: "py" | "cpp" | "java", d: number) => { const nv = Math.max(0, Math.min(24, readNum(f[l]) + d)); setF({ ...f, [l]: nv ? nv.toFixed(1) : "" }); };
  const stepper = (l: "py" | "cpp" | "java") => {
    const btn = (txt: string, d: number, lbl: string) => el("button", { type: "button", class: "w-9 h-9 flex items-center justify-center bg-surface-container-highest hover:bg-surface-bright text-on-surface rounded font-code-stat text-code-stat font-bold select-none", "aria-label": lbl, onclick: () => bump(l, d) }, txt);
    return dv("flex flex-col gap-space-xs bg-surface-container p-space-md rounded-lg",
      dv("flex items-center justify-between", sp("flex items-center gap-space-xs", dot(l, "w-2 h-2"), sp("font-label-md text-label-md uppercase " + LC[l].tx, LC[l].n + " hours")), sp("font-label-sm text-label-sm text-outline", `target ${hrs(tg[l])}h`)),
      dv("flex items-center gap-space-xs", btn("−", -0.5, "Less " + LC[l].n),
        <input className="flex-1 min-w-0 h-9 px-space-md bg-surface-variant text-primary font-code-stat text-code-stat text-center rounded outline-none focus:ring-1 focus:ring-primary" id={"lh-" + l} type="number" min="0" max="24" step="0.5" placeholder="0.0" aria-label={LC[l].n + " hours"} value={f[l]} onChange={(ev) => setF({ ...f, [l]: ev.target.value })} />,
        btn("+", 0.5, "More " + LC[l].n)));
  };
  const dnum = dayDiff(parse(dk), parse(S.start)) + 1;
  return el("section", { class: "bg-surface-container-low rounded-xl p-space-lg flex flex-col gap-space-lg scroll-mt-24", id: "log-form" },
    dv("flex flex-col sm:flex-row sm:items-center justify-between pb-space-sm gap-space-sm",
      dv("flex flex-wrap items-center gap-space-sm", ic("edit_calendar", "text-[18px] text-primary"), el("h2", { class: "font-headline-sm text-headline-sm text-primary uppercase tracking-wide" }, "log entry"),
        <input type="date" id="ld" value={dk} className="bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm rounded px-space-sm py-[2px] outline-none focus:ring-1 focus:ring-primary" aria-label="Log date" onChange={(ev) => { if (ev.target.value) { ui.logDate = ev.target.value; emit(); } }} />,
        sp("font-label-sm text-label-sm text-on-surface-variant", dk === t ? "today" : "", dnum >= 1 && dnum <= 56 ? (dk === t ? " (day " : "day ") + dnum + (dk === t ? ")" : "") : "")),
      dv("flex items-center gap-space-xs", sp("font-label-sm text-label-sm uppercase text-outline", "computed session:"), el("span", { id: "computed-total", class: "font-code-stat text-code-stat text-primary px-space-sm py-[2px] bg-surface-container rounded font-bold" }, hrs(total) + " hours"))),
    dv("grid grid-cols-1 md:grid-cols-3 gap-space-md", ...(["py", "cpp", "java"] as const).map((l) => <React.Fragment key={l}>{stepper(l)}</React.Fragment>)),
    dv("flex flex-col sm:flex-row gap-space-md items-stretch sm:items-center",
      dv("flex-1 flex items-center bg-surface-container rounded-lg px-space-md h-10 focus-within:ring-1 focus-within:ring-primary", ic("terminal", "text-[16px] text-outline mr-space-sm select-none"),
        <input className="w-full bg-transparent text-primary font-body-sm text-body-sm placeholder:text-outline outline-none" id="ln-log" type="text" placeholder="log technical focus, chapters read or tickets resolved" aria-label="Note" value={f.note} onChange={(ev) => setF({ ...f, note: ev.target.value })} />),
      el("button", { type: "button", class: "h-10 px-space-xl bg-primary text-on-primary font-label-md text-label-md font-bold uppercase tracking-wider rounded-lg hover:opacity-90 active:opacity-80 transition-opacity flex items-center justify-center gap-space-xs select-none", onclick: () => saveHours(dk, f, f.note) }, ic("done", "text-[18px]"), sp("", "save day entry"))));
}

export function PageLog() {
  useStore();
  const S = st();
  const t = today();
  if (!ui.logDate) ui.logDate = t;
  const dk = ui.logDate;
  const keys = Object.keys(S.log).sort().reverse();
  const tot = keys.reduce((a, k) => a + dayTotal(k), 0);
  const thr = THR();
  const head = dv("flex flex-col md:flex-row md:items-end justify-between gap-space-md",
    dv("flex flex-col gap-space-xs",
      el("h1", { class: "font-headline-lg text-primary tracking-tight font-bold", style: "font-size:2.75rem;line-height:2.75rem;font-weight:750" }, "study log"),
      el("p", { class: "font-body-md text-body-md text-on-surface-variant" }, `hours per language, streak discipline and the 56 day heat map. A day counts toward the streak at ${hrs(thr)}h or more.`)),
    dv("flex flex-wrap items-center gap-space-xs",
      pill("bg-surface-container-high text-on-surface", sp("w-1.5 h-1.5 rounded-full bg-secondary"), sp("font-label-sm text-label-sm uppercase text-outline", "streak"), sp("font-code-stat text-code-stat text-primary font-bold", `${streak()} ${streak() === 1 ? "day" : "days"}`)),
      pill("bg-surface-container-high text-on-surface", sp("font-label-sm text-label-sm uppercase text-outline", "total"), sp("font-code-stat text-code-stat text-primary font-bold", hrs(tot) + "h")),
      pill("bg-surface-container-high text-on-surface", sp("font-label-sm text-label-sm uppercase text-outline", "average"), sp("font-code-stat text-code-stat text-primary font-bold", (keys.length ? hrs(tot / keys.length) : "0") + "h/day")),
      pill("bg-surface-container-highest text-on-surface", sp("font-label-sm text-label-sm uppercase text-outline", "target"), sp("font-code-stat text-code-stat text-secondary font-bold", `>= ${hrs(thr)}h/day`))));

  const tNow = parse(t);
  const heatRows: any[] = [];
  heatRows.push(el("div", { key: "h", class: "grid grid-cols-[48px_repeat(8,1fr)] gap-space-xs items-center" }, sp(""), [1, 2, 3, 4, 5, 6, 7, 8].map((w) => <span key={w} className="font-label-sm text-label-sm text-outline text-center">{"w" + w}</span>)));
  for (let d = 0; d < 7; d++) {
    const cells: any[] = [];
    for (let w = 0; w < 8; w++) {
      const day = addDays(parse(S.start), w * 7 + d);
      const k = iso(day), h = dayTotal(k);
      const cls = h <= 0 ? "bg-heat0 text-outline" : h < 2 ? "bg-heat1 text-on-surface" : h < thr ? "bg-heat2 text-primary" : "bg-heat3 text-heat3t";
      cells.push(el("div", { key: w, class: "h-10 rounded flex items-center justify-center font-code-stat text-code-stat font-bold " + cls + (k === t ? " outline outline-2 outline-primary" : "") + (day > tNow ? " opacity-60" : ""), title: `${fmt(day)}: ${hrs(h)}h` }, h > 0 ? hrs(h) : ""));
    }
    heatRows.push(el("div", { key: d, class: "grid grid-cols-[48px_repeat(8,1fr)] gap-space-xs items-center" }, sp("font-label-sm text-label-sm text-outline uppercase", DOW[addDays(parse(S.start), d).getDay()]), cells));
  }
  const first = parse(S.start), last = addDays(first, 55);
  const legend = dv("flex flex-wrap items-center justify-between gap-space-sm pt-space-sm font-label-sm text-label-sm text-on-surface-variant",
    dv("flex items-center gap-space-sm", sp("text-outline uppercase", "scale"),
      [["bg-heat0", "0h"], ["bg-heat1", "under 2h"], ["bg-heat2", `2h to ${hrs(thr)}h`], ["bg-heat3", `${hrs(thr)}h or more (streak)`]].map((x) => el("span", { key: x[0], class: "flex items-center gap-[4px]" }, sp("w-4 h-4 rounded-sm " + x[0]), x[1]))),
    sp("", `${streak()} consecutive qualifying ${streak() === 1 ? "day" : "days"}`));
  const heatPanel = el("section", { class: "bg-surface-container-low rounded-xl p-space-lg flex flex-col gap-space-md" },
    dv("flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs",
      dv("flex items-center gap-space-sm", ic("grid_view", "text-[18px] text-primary"), el("h2", { class: "font-headline-sm text-headline-sm text-primary uppercase tracking-wide" }, "56 day cadence heat map")),
      dv("font-label-sm text-label-sm text-on-surface-variant", "span: ", sp("font-code-stat text-code-stat text-primary", `${lc(fmt(first))} - ${lc(fmt(last))}`))),
    dv("overflow-x-auto w-full py-space-xs", dv("flex flex-col gap-space-xs min-w-[560px]", heatRows)), legend);

  const rowCls = "grid grid-cols-[130px_100px_1fr_150px] items-center px-space-md";
  const ledger = el("section", { class: "bg-surface-container-low rounded-xl p-space-lg flex flex-col gap-space-md" },
    dv("flex items-center justify-between", dv("flex items-center gap-space-sm", ic("history", "text-[18px] text-primary"), el("h2", { class: "font-headline-sm text-headline-sm text-primary uppercase tracking-wide" }, "session ledger")), sp("font-label-sm text-label-sm text-outline uppercase", `${keys.length} logged of 56 days`)),
    !keys.length ? sp("font-body-md text-on-surface-variant py-space-md", "No entries yet. Save today's hours above.") :
      dv("overflow-x-auto", dv("flex flex-col gap-space-xs min-w-[560px]",
        dv(rowCls + " py-space-xs font-label-sm text-label-sm text-outline uppercase bg-surface-container-lowest rounded", sp("", "date / day"), sp("", "hours"), sp("", "note"), sp("text-right", "status")),
        keys.map((k) => {
          const en = S.log[k], total = dayTotal(k), dn = dayDiff(parse(k), parse(S.start)) + 1;
          const q = total >= thr;
          return el("div", { key: k, class: rowCls + " py-space-md bg-surface-container rounded-lg hover:bg-surface-container-high transition-colors" },
            dv("flex flex-col", sp("font-headline-sm text-headline-sm text-primary", lc(fmt(parse(k)))), sp("font-label-sm text-label-sm " + (k === t ? "text-secondary font-medium" : "text-outline"), k === t ? "today" + (dn >= 1 && dn <= 56 ? " (day " + dn + ")" : "") : dn >= 1 && dn <= 56 ? "day " + dn : k)),
            dv("flex flex-col", sp("font-code-stat text-code-stat text-primary font-bold", hrs(total) + "h"), sp("font-label-sm text-label-sm text-outline tabular-nums", `p${hrs(+en.py || 0)} c${hrs(+en.cpp || 0)} j${hrs(+en.java || 0)}`)),
            dv("pr-space-md", el("p", { class: "font-body-sm text-body-sm text-on-surface truncate", title: en.note || "" }, en.note || "")),
            dv("flex items-center justify-end gap-space-sm",
              q ? sp("font-label-sm text-label-sm px-space-sm py-[2px] bg-surface-container-highest text-primary font-semibold rounded flex items-center gap-space-xs", sp("w-1.5 h-1.5 rounded-full bg-primary"), "qualifying")
                : sp("font-label-sm text-label-sm px-space-sm py-[2px] bg-surface-container-highest text-on-surface-variant rounded", k === t ? "in progress" : "below target"),
              el("button", { type: "button", class: "font-label-sm text-label-sm px-space-sm py-[2px] bg-primary text-on-primary rounded font-bold uppercase hover:opacity-90", onclick: () => { ui.logDate = k; emit(); setTimeout(() => { const fm = document.getElementById("log-form"); if (fm) fm.scrollIntoView({ block: "start" }); }, 0); } }, "edit"),
              el("button", { type: "button", class: "text-outline hover:text-error transition-colors flex", "aria-label": "Delete entry " + k, onclick: () => { delete S.log[k]; save(); } }, ic("delete_forever", "text-[18px]"))));
        }))));
  return dv("flex flex-col w-full gap-space-xl", head, <Form key={dk} dk={dk} t={t} />, heatPanel, ledger);
}
