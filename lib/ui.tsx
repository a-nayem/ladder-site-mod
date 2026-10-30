"use client";
import React from "react";
import Link from "next/link";
import { D, LNAME, TAGNAME, TIER, Task, isDone, st, toggle, ui, emit, save, lc, tasks } from "./model";

/* Tiny element helper so the views read like the original markup. Every call returns a real React element. */
type Props = Record<string, any> | null;
function flat(a: any[], out: any[] = []): any[] {
  a.forEach((c) => { if (Array.isArray(c)) flat(c, out); else if (c !== null && c !== undefined && c !== false) out.push(c); });
  return out;
}
const EVT: Record<string, string> = { onclick: "onClick", onchange: "onChange", oninput: "onInput" };
const ATTR: Record<string, string> = { class: "className", for: "htmlFor", autocomplete: "autoComplete", tabindex: "tabIndex", rowspan: "rowSpan", colspan: "colSpan" };

/* "#/ladder/py/3" style routes become real paths */
export function href(h: string): string {
  if (!h || h[0] !== "#") return h;
  const p = h.replace(/^#\/?/, "");
  if (!p || p === "story") return "/";
  const parts = p.split("/");
  if (parts[0] === "weeks" && parts[1]) return "/weeks/#week-" + parts[1];
  if (parts[0] === "guide" && parts[1]) return "/guide/#g-" + parts[1];
  return "/" + parts.join("/") + "/";
}
let k = 0;
export function el(tag: string, props?: Props, ...kids: any[]): React.ReactElement {
  const p: Record<string, any> = {};
  if (props) {
    for (const key of Object.keys(props)) {
      const v = props[key];
      if (v === null || v === undefined || v === false) continue;
      if (key === "text") { kids = [v]; continue; }
      if (key === "html") { p.dangerouslySetInnerHTML = { __html: v }; continue; }
      if (key === "style" && typeof v === "string") {
        const o: Record<string, string> = {};
        v.split(";").forEach((d) => { const i = d.indexOf(":"); if (i > 0) o[d.slice(0, i).trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = d.slice(i + 1).trim(); });
        p.style = o; continue;
      }
      if (EVT[key]) { p[EVT[key]] = v; continue; }
      if (key === "value" && (tag === "input" || tag === "textarea")) { p.defaultValue = v; continue; }
      if (key === "rel" && v === "noopener") { p.rel = "noopener noreferrer"; continue; }
      p[ATTR[key] || key] = v === true ? "" : v;
    }
  }
  const children = flat(kids).map((c) => (typeof c === "object" && c !== null && !c.type && !Array.isArray(c) ? String(c) : c));
  if (tag === "a" && p.href && typeof p.href === "string" && p.href[0] === "#") {
    p.href = href(p.href);
    return React.createElement(Link as any, { ...p, key: p.key ?? undefined }, ...children);
  }
  return React.createElement(tag, p, ...children);
}
export const dv = (cls: string | null, ...c: any[]) => el("div", { class: cls }, ...c);
export const sp = (cls: string | null, ...c: any[]) => el("span", { class: cls }, ...c);
export const ic = (n: string, cls?: string) => el("span", { class: "material-symbols-outlined " + (cls || ""), "aria-hidden": "true" }, n);
export const sep = () => sp("", "•");

export function rich(s: string) {
  return s.split("`").map((part, i) => (i % 2 ? el("code", { class: "font-code-stat text-code-stat text-primary bg-surface-container-highest px-space-xs py-[1px] rounded", key: i }, part) : React.createElement(React.Fragment, { key: i }, part)));
}

/* language styling: every class is written out in full so Tailwind keeps it */
export const LC: Record<string, { n: string; bg: string; tx: string; chip: string; fill: string }> = {
  py: { n: "python", bg: "bg-py", tx: "text-py", chip: "bg-py/15 text-py hover:bg-py/25", fill: "bg-py" },
  cpp: { n: "c++", bg: "bg-cpp", tx: "text-cpp", chip: "bg-cpp/15 text-cpp hover:bg-cpp/25", fill: "bg-cpp" },
  java: { n: "java", bg: "bg-java", tx: "text-java", chip: "bg-java/15 text-java hover:bg-java/25", fill: "bg-java" },
  ai: { n: "ai engineer", bg: "bg-ai", tx: "text-ai", chip: "bg-ai/15 text-ai hover:bg-ai/25", fill: "bg-ai" }
};
const TIERN: Record<string, string> = { L: "lesson", B: "beginner", I: "intermediate", S: "senior" };
const TIERC: Record<string, string> = { B: "text-secondary", I: "text-secondary-fixed", S: "text-tertiary-fixed-dim", gate: "text-tertiary-fixed-dim", cap: "text-tertiary-fixed-dim" };
export const dot = (lang: string, cls?: string) => sp((cls || "w-1.5 h-1.5") + " rounded-full flex-shrink-0 " + LC[lang].bg);
export const tierColor = (t: Task) => (t.kind === "L" ? LC[t.lang].tx : TIERC[t.kind]);
export const tierName = (t: Task) => (TIER[t.kind] ? TIERN[t.kind] : t.kind === "gate" ? lc(t.label as string) : "capstone");
export const tagName = (tg: string) => (TAGNAME[tg] ? lc(TAGNAME[tg]) : "");
export function courseChip(tag: string) {
  const n = tagName(tag);
  return n ? sp("font-code-stat text-code-stat text-primary", n.toUpperCase().replace("ALL COURSES", "all courses").replace("SKILL", "skill")) : null;
}

export function Tick({ id, label, lang, small }: { id: string; label: string; lang: string; small?: boolean }) {
  const done = isDone(id);
  const size = small ? "w-[18px] h-[18px] rounded" : "w-[22px] h-[22px] rounded-[6px]";
  return (
    <label className={"relative flex items-center justify-center shrink-0 cursor-pointer transition-colors focus-within:ring-2 focus-within:ring-primary " + size + " " + (done ? LC[lang].bg : "bg-surface-variant hover:bg-surface-bright")}>
      <input type="checkbox" className="tick absolute inset-0 w-full h-full opacity-0 cursor-pointer" aria-label={label} data-id={id} data-lang={lang} checked={done} onChange={() => toggle(id)} />
      {ic("check", (small ? "text-[14px] " : "text-[16px] ") + "leading-none select-none " + (done ? "text-surface-container-lowest font-bold" : "text-transparent"))}
    </label>
  );
}
export const tick = (id: string, label: string, lang: string, small?: boolean) => <Tick key={"t" + id} id={id} label={label} lang={lang} small={small} />;

export function noteButton(id: string) {
  return el("button", {
    class: "link text-secondary hover:underline font-label-sm text-label-sm", type: "button", "aria-expanded": ui.notes[id] ? "true" : "false",
    onclick: () => { ui.notes[id] = !ui.notes[id]; emit(); }
  }, st().notes[id] ? "edit note" : "add note");
}
export function noteBox(id: string) {
  if (!ui.notes[id]) return null;
  return el("textarea", {
    class: "w-full mt-space-xs bg-surface-container-lowest rounded p-space-sm font-body-sm text-body-sm text-primary placeholder-outline resize-y focus:outline-none focus:ring-1 focus:ring-primary", rows: "2", "aria-label": "Note",
    placeholder: "repo link, what you learned, what to redo", key: "nb" + id, defaultValue: st().notes[id] || "",
    onInput: (e: any) => { const S = st(); if (e.target.value.trim()) S.notes[id] = e.target.value; else delete S.notes[id]; save(false); }
  });
}
export function metaLine(items: any[]) {
  const out: any[] = [];
  items.filter(Boolean).forEach((x, i) => { if (i) out.push(React.createElement(React.Fragment, { key: "s" + i }, sep())); out.push(React.createElement(React.Fragment, { key: "i" + i }, x)); });
  return dv("flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm mt-[2px] flex-wrap", out);
}
export function bar(valuePct: number, fillCls: string, trackCls: string) {
  return el("div", { class: trackCls, role: "presentation" }, el("div", { class: "h-full " + fillCls, style: "width:" + Math.max(0, Math.min(100, valuePct)).toFixed(1) + "%" }));
}
export const pill = (cls: string, ...k: any[]) => el("div", { class: "flex items-center gap-space-xs px-space-md py-space-xs rounded " + cls }, ...k);
export { D, LNAME, tasks };
