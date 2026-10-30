"use client";
import React, { useState } from "react";
import { st, setState, blank, save, applyTheme, ui, emit, tasks, extraList, prog, streak, THR, today, useStore } from "../model";
import { el, dv, sp, ic } from "../ui";

function download(name: string, text: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type: "application/json" })); a.download = name;
  document.body.append(a); a.click(); a.remove();
}
function card(title: string, right: any, ...k: any[]) {
  return dv("bg-surface-container-low rounded-lg p-space-lg flex flex-col gap-space-lg",
    dv("flex flex-col sm:flex-row sm:items-center justify-between pb-space-sm gap-space-sm", dv("flex items-center gap-space-sm", sp("w-2 h-2 rounded-full bg-secondary"), el("h2", { class: "font-headline-sm text-headline-sm text-primary" }, title)), right), ...k);
}

export function PageData() {
  useStore();
  const S = st();
  const [wipe, setWipe] = useState("");
  const P = prog(tasks), X = prog(extraList);
  const size = (JSON.stringify(S).length / 1024).toFixed(1);
  const ok = wipe === "CONFIRM RESET";
  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const rd = new FileReader();
    rd.onload = () => {
      try {
        const o = JSON.parse(rd.result as string);
        if (!o || typeof o !== "object" || typeof o.done !== "object") throw new Error("bad");
        const n: any = Object.assign(blank(), o); n.done = n.done || {}; n.notes = n.notes || {}; n.log = n.log || {};
        setState(n); save(false); applyTheme(); ui.msg = "Imported " + Object.keys(n.done).length + " finished tasks."; emit();
      } catch (er) { ui.msg = "That file is not a progress export."; emit(); }
    };
    rd.readAsText(f);
    e.target.value = "";
  };
  const btnCls = "h-[36px] px-space-md font-label-md text-label-md rounded flex items-center justify-center gap-space-xs transition-colors w-full ";
  const backup = card("backup & synchronization", sp("px-space-sm py-[2px] bg-surface-container rounded font-label-sm text-label-sm text-on-surface-variant tabular-nums", `storage: browser localstorage • size: ${size} kb`),
    dv("grid grid-cols-1 md:grid-cols-2 gap-space-md",
      dv("p-space-md bg-surface-container rounded flex flex-col justify-between gap-space-md",
        dv("flex flex-col gap-space-xs", sp("font-label-md text-label-md text-primary", "export snapshot"), el("p", { class: "font-body-sm text-body-sm text-on-surface-variant" }, "download your complete state: task completions, logged hours, notes and the start date.")),
        el("button", { type: "button", class: btnCls + "bg-primary hover:opacity-90 text-on-primary", onclick: () => download("ladder-progress-" + today() + ".json", JSON.stringify(S, null, 2)) }, ic("download", "text-[16px]"), sp("", "export json backup"))),
      dv("p-space-md bg-surface-container rounded flex flex-col justify-between gap-space-md",
        dv("flex flex-col gap-space-xs", dv("flex items-center justify-between", sp("font-label-md text-label-md text-primary", "import snapshot"), sp("font-label-sm text-label-sm text-error font-medium", "destructive")), el("p", { class: "font-body-sm text-body-sm text-on-surface-variant" }, "overwrites the progress stored in this browser. checks the file before applying.")),
        <label className={btnCls + "bg-surface-container-high hover:bg-surface-variant text-on-surface cursor-pointer focus-within:ring-2 focus-within:ring-primary"} htmlFor="imp">{ic("upload_file", "text-[16px]")}<span>select backup file</span><input type="file" accept="application/json,.json" id="imp" className="hidden" onChange={onFile} /></label>)),
    el("p", { class: "font-label-sm text-label-sm text-secondary", role: "status" }, ui.msg),
    dv("flex flex-col gap-space-xs",
      dv("flex items-center justify-between", sp("font-label-sm text-label-sm text-on-surface-variant", "state snapshot preview"), sp("font-code-stat text-code-stat text-on-surface-variant", "json format 1")),
      el("div", { class: "p-space-md bg-surface-container-lowest rounded overflow-x-auto max-h-48 font-code-stat text-code-stat text-on-surface-variant leading-relaxed select-all" }, el("pre", { class: "m-0" }, JSON.stringify({ v: S.v, start: S.start, streak: streak(), main_tasks_done: P.done, extra_steps_done: X.done, days_logged: Object.keys(S.log).length, notes: Object.keys(S.notes).length }, null, 2)))));

  const inCls = "h-[36px] px-space-md bg-surface-container text-on-surface rounded font-code-stat text-code-stat focus:outline-none focus:bg-surface-container-high transition-colors";
  const field = (label: string, id: string, input: any, help: string) => dv("flex flex-col gap-space-xs", el("label", { class: "font-label-sm text-label-sm text-on-surface-variant", for: id }, label), input, sp("font-body-sm text-body-sm text-on-surface-variant", help));
  const cycle = card("study cycle configuration", sp("font-label-sm text-label-sm text-on-surface-variant", "applies at once"),
    dv("grid grid-cols-1 md:grid-cols-2 gap-space-md",
      field("cycle start date", "sd", <input key={S.start} type="date" id="sd" defaultValue={S.start} className={inCls} onChange={(e) => { if (e.target.value) { S.start = e.target.value; save(); } }} />, "anchor point for week 1 of the timeline"),
      field("daily streak threshold (hours)", "thr", <input key={THR()} type="number" id="thr" min="1" max="16" step="0.5" defaultValue={String(THR())} className={inCls} onChange={(e) => { const x = parseFloat(e.target.value); if (x >= 1 && x <= 16) { S.threshold = x; save(); } }} />, "minimum hours in a day to keep the streak")));

  const cur = S.theme === "light" ? "light" : "dark";
  const seg = (label: string, val: string) => el("button", { type: "button", class: "px-space-md py-space-xs rounded font-label-sm text-label-sm " + (cur === val ? "bg-surface-variant text-primary" : "text-on-surface-variant hover:text-on-surface"), "aria-pressed": cur === val ? "true" : "false", onclick: () => { S.theme = val; save(); applyTheme(); } }, label);
  const theme = card("theme & display", sp("font-label-sm text-label-sm text-on-surface-variant", "client local"),
    dv("p-space-md bg-surface-container rounded flex items-center justify-between",
      dv("flex flex-col", sp("font-label-md text-label-md text-primary", "color scheme"), sp("font-body-sm text-body-sm text-on-surface-variant", "dark is the default")),
      dv("flex items-center gap-[2px] bg-surface-container-lowest p-[3px] rounded", seg("dark", "dark"), seg("light", "light"))));

  const danger = dv("bg-surface-container-low rounded-lg p-space-lg flex flex-col gap-space-lg",
    dv("flex items-center justify-between pb-space-sm", dv("flex items-center gap-space-xs", ic("warning", "text-error text-[18px]"), el("h2", { class: "font-headline-sm text-headline-sm text-error" }, "danger zone")), sp("font-label-sm text-label-sm text-error font-medium", "irreversible")),
    dv("flex flex-col gap-space-md",
      dv("p-space-md bg-surface-container rounded flex flex-col gap-space-sm", dv("flex flex-col", sp("font-label-md text-label-md text-primary", "reset task progress"), sp("font-body-sm text-body-sm text-on-surface-variant", "clears every tick but keeps your logged hours and notes.")),
        el("button", { type: "button", class: "h-[34px] px-space-md bg-surface-container-high hover:bg-surface-variant text-on-surface font-label-md text-label-md rounded self-start transition-colors", onclick: () => { if (window.confirm("Clear all task ticks? Hours and notes stay.")) { S.done = {}; ui.msg = "Task progress reset."; save(); } } }, "reset task progress")),
      dv("p-space-md bg-error-container/20 rounded flex flex-col gap-space-md",
        dv("flex flex-col gap-space-xs", sp("font-label-md text-label-md text-error", "erase all local data"), el("p", { class: "font-body-sm text-body-sm text-on-surface-variant" }, "removes ticks, notes, hours and settings from this browser. export a backup first.")),
        dv("flex flex-col gap-space-xs", el("label", { class: "font-label-sm text-label-sm text-on-surface-variant", for: "wipe" }, "type ", sp("font-code-stat text-error select-all", "CONFIRM RESET"), " to unlock erase"),
          <input id="wipe" autoComplete="off" placeholder="CONFIRM RESET" className="h-[36px] px-space-md bg-surface-container-lowest text-primary rounded font-code-stat text-code-stat focus:outline-none focus:ring-1 focus:ring-error transition-colors" value={wipe} onChange={(e) => setWipe(e.target.value)} />,
          <button type="button" id="hard" disabled={!ok} className={"h-[36px] px-space-md font-label-md text-label-md rounded flex items-center justify-center gap-space-xs transition-colors " + (ok ? "bg-error-container text-error hover:opacity-90 cursor-pointer" : "bg-surface-container-high text-outline cursor-not-allowed")} onClick={() => { if (ok) { setState(blank()); setWipe(""); ui.msg = "All local data erased."; save(); applyTheme(); } }}>{ic("delete_forever", "text-[16px]")}<span>erase local database</span></button>))));

  const foot = dv("mt-space-lg p-space-md bg-surface-container-low rounded-lg flex flex-col sm:flex-row items-center justify-between gap-space-md",
    dv("flex items-center gap-space-md font-body-sm text-body-sm text-on-surface-variant", sp("flex items-center gap-space-xs", ic("verified_user", "text-[16px] text-secondary"), sp("", "zero telemetry")), sp("", "·"), sp("font-code-stat text-code-stat tabular-nums", `${P.total} main tasks • ${X.total} extra steps`)),
    dv("flex items-center gap-space-sm font-label-sm text-label-sm text-on-surface-variant", sp("w-1.5 h-1.5 rounded-full bg-secondary"), sp("", "all state stored in this browser")));

  return dv("flex flex-col w-full gap-space-lg max-w-[1400px] mx-auto",
    dv("flex flex-col gap-space-xs pb-space-md",
      dv("flex items-baseline gap-space-md", el("h1", { class: "font-headline-lg text-headline-lg tracking-tight text-primary" }, "data & settings"), sp("font-code-stat text-code-stat text-on-surface-variant tabular-nums", "client side, works offline")),
      el("p", { class: "font-body-md text-body-md text-on-surface-variant max-w-2xl" }, "local storage persistence, json backups, the cycle start date and display preferences.")),
    dv("grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start",
      dv("lg:col-span-7 flex flex-col gap-gutter-desktop", backup, cycle),
      dv("lg:col-span-5 flex flex-col gap-gutter-desktop", theme, danger)),
    foot);
}
