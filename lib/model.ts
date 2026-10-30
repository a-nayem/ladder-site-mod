"use client";
import { useSyncExternalStore } from "react";
import { DATA as D } from "../data/data";

export { D };
export const KEY = "ladder-tracker-v1";
export const LANGS = [
  { k: "py", name: "Python" },
  { k: "cpp", name: "C++" },
  { k: "java", name: "Java" }
] as const;
export const LNAME: Record<string, string> = { py: "Python", cpp: "C++", java: "Java", ai: "AI Engineer" };
export const TIER: Record<string, { name: string; mins: number; lvl: number; rank: number }> = {
  L: { name: "Lesson", mins: 20, lvl: 0, rank: 0 },
  B: { name: "Beginner", mins: 30, lvl: 1, rank: 1 },
  I: { name: "Intermediate", mins: 60, lvl: 2, rank: 2 },
  S: { name: "Senior", mins: 90, lvl: 3, rank: 3 }
};
export const TAGNAME: Record<string, string> = { "220": "CSE220", "250": "CSE250", "320": "CSE320", all: "All courses", skill: "Skill" };
export const DAILY_ORDER = ["cpp", "py", "java"];
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/* ---------- state (same localStorage schema as the earlier versions) ---------- */
export type State = { v: number; start: string; theme: string; done: Record<string, string>; notes: Record<string, string>; log: Record<string, any>; threshold?: number };
export function blank(): State {
  return { v: 1, start: D.startDefault, theme: "dark", done: {}, notes: {}, log: {} };
}
function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const o = Object.assign(blank(), JSON.parse(raw));
      o.done = o.done || {}; o.notes = o.notes || {}; o.log = o.log || {};
      return o;
    }
  } catch (e) { /* storage blocked: run in memory */ }
  return blank();
}
let S: State = blank();
let version = 0;
let hydrated = false;
const listeners = new Set<() => void>();
export const st = () => S;
export const isHydrated = () => hydrated;
export function setState(next: State) { S = next; }
export function emit() { version++; listeners.forEach((l) => l()); }
export function save(notify = true) {
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ }
  if (notify) emit();
}
export function applyTheme() {
  if (typeof document !== "undefined") document.documentElement.setAttribute("data-theme", S.theme === "light" ? "light" : "dark");
}
export function hydrate() {
  if (hydrated) return;
  S = load(); hydrated = true; applyTheme(); emit();
}
export function useStore() {
  useSyncExternalStore((cb) => { listeners.add(cb); return () => { listeners.delete(cb); }; }, () => version, () => 0);
  return { S, hydrated };
}

/* transient UI state shared by the views */
export const ui: any = { open: {}, notes: {}, hideDone: false, detail: true, seen: {}, msg: "", filter: "all", logDate: "", wipe: "" };

/* ---------- dates ---------- */
export const pad = (n: number) => (n < 10 ? "0" : "") + n;
export const iso = (d: Date) => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
export const parse = (s: string) => { const p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2], 12); };
export const addDays = (d: Date, n: number) => { const x = new Date(d.getTime()); x.setDate(x.getDate() + n); return x; };
export const today = () => iso(new Date());
export const fmt = (d: Date) => d.getDate() + " " + MON[d.getMonth()];
export const weekStart = (w: number) => addDays(parse(S.start), (w - 1) * 7);
export const dayDiff = (a: Date, b: Date) => Math.round((a.getTime() - b.getTime()) / 864e5);
export function curWeek(): { week: number; before?: number; over?: boolean } {
  const diff = dayDiff(parse(today()), parse(S.start));
  if (diff < 0) return { week: 0, before: -diff };
  if (diff >= 56) return { week: 0, over: true };
  return { week: Math.floor(diff / 7) + 1 };
}

/* ---------- task model ---------- */
export type Task = { id: string; kind: string; lang: string; n: number; week: number; text: string; tag: string; topic?: any; label?: string; uses?: string; mins?: number; short?: string };
export const tasks: Task[] = [];
export const byId: Record<string, Task> = {};
const add = (t: Task) => { tasks.push(t); byId[t.id] = t; };
function parseTag(s: string) {
  const m = /^\[(\w+)\]\s*(.*)$/.exec(s);
  return m ? { tag: m[1], text: m[2] } : { tag: "", text: s };
}
function weekOf(lang: string, n: number) {
  for (const w of D.weeks) { const r = w[lang]; if (n >= r[0] && n <= r[1]) return w.w; }
  return 0;
}
LANGS.forEach((L) => {
  D.ladders[L.k].forEach((tp: any) => {
    const wk = weekOf(L.k, tp.n);
    add({ id: `${L.k}.${tp.n}.L`, kind: "L", lang: L.k, n: tp.n, week: wk, text: tp.lesson, tag: "", topic: tp });
    ["B", "I", "S"].forEach((k, i) => {
      const pt = parseTag(tp.p[i]);
      add({ id: `${L.k}.${tp.n}.${k}`, kind: k, lang: L.k, n: tp.n, week: wk, text: pt.text, tag: pt.tag, topic: tp });
    });
  });
});
D.gates.forEach((g: any) => {
  const pt = parseTag(g.text);
  add({ id: "gate." + g.id, kind: "gate", lang: g.lang, n: 99, week: g.week, text: pt.text, tag: pt.tag, label: "Gate " + g.id, uses: g.uses, mins: 150, short: g.id });
});
D.capstones.forEach((c: any) => {
  const pt = parseTag(c.text);
  add({ id: "cap." + c.id, kind: "cap", lang: c.lang, n: 100, week: c.week, text: pt.text, tag: pt.tag, label: "Capstone", mins: 480, short: "Cap" });
});
export const kindRank = (t: Task) => (TIER[t.kind] ? TIER[t.kind].rank : t.kind === "gate" ? 4 : 5);

export type Extra = { id: string; road: string; group: string; title: string; note: string };
export const extraList: Extra[] = [];
D.extras.forEach((r: any) => r.groups.forEach((g: any) => g.items.forEach((it: any) => {
  extraList.push({ id: `x.${r.key}.${it[0]}`, road: r.key, group: g.title, title: it[1], note: it[2] });
})));

export const isDone = (id: string) => !!S.done[id];
export function prog(list: { id: string }[]) {
  let d = 0;
  list.forEach((t) => { if (S.done[t.id]) d++; });
  return { done: d, total: list.length };
}
export const pct = (p: { done: number; total: number }) => (p.total ? (100 * p.done) / p.total : 0);
export const pc = (p: { done: number; total: number }) => Math.round(pct(p));
export const ofLang = (k: string) => tasks.filter((t) => t.lang === k);
export const weekTasks = (w: number) => tasks.filter((t) => t.week === w);
export const topicTasks = (lang: string, n: number) => tasks.filter((t) => t.lang === lang && t.n === n);
export function toggle(id: string) {
  if (S.done[id]) delete S.done[id]; else S.done[id] = today();
  save();
}

/* ---------- hours ---------- */
export const THR = () => +(S.threshold as number) || 4;
export const entry = (k: string) => S.log[k];
export const dayTotal = (k: string) => { const e = entry(k); return e ? (+e.py || 0) + (+e.cpp || 0) + (+e.java || 0) : 0; };
export function streak() {
  let d = parse(today()), n = 0;
  if (dayTotal(iso(d)) < THR()) d = addDays(d, -1);
  while (dayTotal(iso(d)) >= THR()) { n++; d = addDays(d, -1); }
  return n;
}
export const hrs = (n: number) => (Math.round(n * 10) / 10).toString();
export const p2 = (n: number) => (n < 10 ? "0" : "") + n;
export const dur = (m: number) => (m >= 60 ? Math.floor(m / 60) + "h" + (m % 60 ? " " + (m % 60) + "m" : "") : m + "m");
export const lc = (s: string) => String(s).toLowerCase();
export const mins = (t: Task) => t.mins || TIER[t.kind].mins;
export function nextTasks(lang: string, n: number) {
  return tasks.filter((t) => t.lang === lang && !isDone(t.id))
    .sort((a, b) => a.week - b.week || a.n - b.n || kindRank(a) - kindRank(b)).slice(0, n);
}
export function readNum(v: string) { const x = parseFloat(v); return isNaN(x) || x < 0 ? 0 : Math.min(x, 24); }
export function saveHours(key: string, v: { py: string; cpp: string; java: string }, note: string) {
  const rec = { py: readNum(v.py), cpp: readNum(v.cpp), java: readNum(v.java), note: note.trim() };
  if (!rec.py && !rec.cpp && !rec.java && !rec.note) delete S.log[key]; else S.log[key] = rec;
  save();
}

/* ---------- course refs ---------- */
const LK: Record<string, string> = { Py: "py", C: "cpp", J: "java" };
export function parseRef(r: string) {
  const m = /^(Py|C|J)\s*(\d+)\s*([BIS](?:\s+[BIS])*)?$/.exec(r);
  if (!m) return null;
  const lang = LK[m[1]];
  const tiers = m[3] ? m[3].split(/\s+/) : ["B", "I", "S"];
  return { lang, n: +m[2], ids: tiers.map((k) => `${lang}.${m[2]}.${k}`), tiers };
}
export function refIds(ref: string) { const p = parseRef(ref); return p ? p.ids : []; }
