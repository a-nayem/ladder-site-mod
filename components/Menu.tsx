"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { D, LANGS, tasks, extraList, ofLang, prog, st, curWeek, streak, hrs, dayTotal, lc, useStore } from "../lib/model";
import { el, dv, sp, ic, dot, LC } from "../lib/ui";

const ON = "flex items-center justify-between px-space-md py-space-sm transition-colors bg-primary text-on-primary font-label-md text-label-md rounded";
const OFF = "flex items-center justify-between px-space-md py-space-sm rounded font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors";
function item(on: boolean, href: string, lead: any, label: string, count?: string, cn?: string) {
  return (
    <Link key={href} href={href} className={on ? ON : OFF} aria-current={on ? "page" : undefined}>
      <span className="flex items-center gap-space-sm">{lead}<span>{label}</span></span>
      {count ? <span className={on ? "font-code-stat text-code-stat tabular-nums px-space-xs py-[1px] bg-surface-container rounded text-on-surface-variant" : cn || "font-code-stat text-code-stat tabular-nums text-on-surface-variant"}>{count}</span> : null}
    </Link>
  );
}
function group(title: string, ...items: any[]) {
  return dv("flex flex-col gap-[2px]", dv("px-space-md py-space-xs font-label-sm text-label-sm text-outline uppercase tracking-wider", title), el("nav", { class: "flex flex-col gap-[2px]" }, ...items));
}

export function Menu() {
  useStore();
  const path = usePathname() || "/";
  const [open, setOpen] = useState(false);
  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    document.querySelectorAll("[data-menu][aria-controls]").forEach((b) => b.setAttribute("aria-expanded", open ? "true" : "false"));
    if (open) { const c = document.querySelector<HTMLElement>("#rail .hx-close"); if (c) c.focus({ preventScroll: true }); }
    return () => { document.body.classList.remove("menu-open"); };
  }, [open]);
  useEffect(() => {
    const click = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest && t.closest("[data-menu]")) { setOpen((o) => !o); return; }
    };
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("click", click); document.addEventListener("keydown", key);
    return () => { document.removeEventListener("click", click); document.removeEventListener("keydown", key); };
  }, []);

  const S = st();
  const seg = path.split("/").filter(Boolean);
  const page = seg[0] || "";
  const a = seg[1];
  const cnt = (list: { id: string }[]) => { const p = prog(list); return `${p.done}/${p.total}`; };
  const cw = curWeek();
  const lg = Object.keys(S.log);
  const avg = lg.length ? hrs(lg.reduce((x, k) => x + dayTotal(k), 0) / lg.length) : "0";
  return (
    <aside id="rail" className="hx-panel" aria-label="Menu" aria-hidden={open ? undefined : true}>
      <div className="flex flex-col flex-1 min-h-0">
        <div className="p-space-lg flex flex-col gap-space-xs">
          <div className="flex items-center justify-between">
            <Link className="flex items-center gap-space-sm" href="/"><img alt="" src="/favicon.svg" className="h-8 w-8" /><span className="font-headline-md text-headline-md tracking-tight text-primary">ladder</span></Link>
            <button type="button" className="hx-close" data-menu="1" aria-label="Close menu">Close</button>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider px-space-xs py-[2px] bg-surface-container-highest rounded">{cw.week ? "w" + cw.week : cw.over ? "done" : "soon"}</span>
          </div>
          <div className="font-label-sm text-label-sm text-on-surface-variant">python, c++ and java in 8 weeks</div>
        </div>
        <div className="overflow-y-auto flex-1 px-space-md py-space-xs space-y-space-lg">
          <nav className="flex flex-col gap-[2px]">
            {item(page === "today", "/today/", ic("today", "text-[16px]"), "today", prog(tasks).done + "")}
            {item(page === "weeks", "/weeks/", ic("date_range", "text-[16px]"), "weeks", "8w", "font-label-sm text-label-sm text-on-surface-variant")}
          </nav>
          {group("main plan", LANGS.map((L) => item(page === "ladder" && a === L.k, "/ladder/" + L.k + "/", dot(L.k, "w-2 h-2"), LC[L.k].n, cnt(ofLang(L.k)))))}
          {group("courses", D.courses.map((c: any, i: number) => item(page === "courses" && (a ? a === c.id : i === 0), "/courses/" + c.id + "/", ic(["account_tree", "memory", "terminal"][i] || "account_tree", "text-[16px]"), lc(c.name))))}
          {group("extra steps", item(page === "extras", "/extras/", ic("route", "text-[16px]"), "roadmap.sh skills", cnt(extraList)))}
          {group("tools",
            item(page === "log", "/log/", ic("list_alt", "text-[16px]"), "log", lg.length + "d", "font-label-sm text-label-sm text-on-surface-variant"),
            item(page === "guide", "/guide/", ic("info", "text-[16px]"), "guide"),
            item(page === "data", "/data/", ic("sync_alt", "text-[16px]"), "data", "json", "font-label-sm text-label-sm text-on-surface-variant"))}
        </div>
      </div>
      <div className="p-space-md bg-surface-container flex flex-col gap-space-xs">
        <div className="flex items-center justify-between font-label-sm text-label-sm"><span className="text-on-surface font-medium">{`streak: ${streak()} ${streak() === 1 ? "day" : "days"}`}</span><span className="font-code-stat text-code-stat tabular-nums text-on-surface-variant">{avg}h/d avg</span></div>
        <div className="flex items-center gap-space-xs pt-space-xs font-label-sm text-label-sm text-on-surface-variant"><span className="w-1.5 h-1.5 rounded-full bg-secondary" /><span>saved in this browser</span></div>
      </div>
    </aside>
  );
}
