"use client";
import React from "react";
import { D, st, extraList, prog, pct, pc, isDone, parse, fmt, ui, emit, lc, useStore } from "../model";
import { el, dv, sp, ic, LC, dot, bar, tick, noteButton, noteBox } from "../ui";

export function PageExtras({ road }: { road?: string }) {
  useStore();
  const S = st();
  const sel = D.extras.find((r: any) => r.key === road);
  const P = prog(extraList);
  const head = dv("flex flex-col md:flex-row md:items-end justify-between gap-space-md",
    dv("flex flex-col gap-space-xs",
      dv("flex items-center gap-space-sm", el("h1", { class: "font-headline-lg text-headline-lg text-primary tracking-tight" }, "extra steps"), sp("px-space-xs py-[2px] bg-surface-container-high text-on-surface-variant font-code-stat text-code-stat rounded", "supplementary track")),
      el("p", { class: "font-body-sm text-body-sm text-on-surface-variant" }, `curated supplementary skills from roadmap.sh • ${P.total} items • they never block the main plan`)),
    dv("flex flex-col items-end gap-[3px] self-start md:self-auto",
      dv("flex items-center gap-space-xs", sp("font-label-sm text-label-sm text-outline", "aggregate completion"), sp("font-code-stat text-code-stat tabular-nums text-primary font-semibold", `${P.done} of ${P.total} completed (${pc(P)}%)`)),
      bar(pct(P), "bg-secondary", "w-48 h-[6px] bg-surface-container rounded-[2px] overflow-hidden")));
  const tabCls = (on: boolean) => "text-left p-space-md rounded transition-colors flex flex-col gap-space-xs " + (on ? "bg-surface-container-high text-primary" : "bg-surface-container text-on-surface hover:bg-surface-container-high");
  const aiP = prog(extraList.filter((x) => x.road === "ai"));
  const tabs = dv("grid grid-cols-2 lg:grid-cols-4 gap-space-sm",
    el("a", { key: "all", href: "#/extras", class: tabCls(!sel) + " col-span-2 lg:col-span-4", "aria-current": !sel ? "page" : null },
      dv("flex items-center justify-between", sp("font-label-md text-label-md", "all domains"), sp("font-code-stat text-code-stat tabular-nums text-on-surface-variant", `${P.total} total`))),
    ["py", "cpp", "java"].map((k) => {
      const p = prog(extraList.filter((x) => x.road === k));
      return el("a", { key: k, href: "#/extras/" + k, class: tabCls(!!sel && sel.key === k), "aria-current": sel && sel.key === k ? "page" : null },
        dv("flex items-center justify-between", dv("flex items-center gap-space-xs", dot(k, "w-2 h-2"), sp("font-label-md text-label-md", LC[k].n)), sp("font-code-stat text-code-stat tabular-nums text-on-surface-variant", `${p.done}/${p.total}`)),
        bar(pct(p), LC[k].fill, "w-full h-1 bg-surface-container-lowest rounded-full overflow-hidden mt-1"));
    }),
    el("a", { key: "ai", href: "#/extras/ai", class: tabCls(!!sel && sel.key === "ai") + " col-span-2 lg:col-span-4 !flex-row items-center justify-between", "aria-current": sel && sel.key === "ai" ? "page" : null },
      dv("flex items-center gap-space-sm", dot("ai", "w-2 h-2"), sp("font-label-md text-label-md", "ai engineer track"), sp("font-label-sm text-label-sm text-outline", "llms, rag, agents and deployment")),
      dv("flex items-center gap-space-md", bar(pct(aiP), LC.ai.fill, "w-32 h-1 bg-surface-container-lowest rounded-full overflow-hidden hidden sm:block"), sp("font-code-stat text-code-stat tabular-nums text-on-surface-variant", `${aiP.done}/${aiP.total}`))));
  const lab = "flex items-center gap-space-xs cursor-pointer select-none hover:text-on-surface transition-colors";
  const tool = dv("flex flex-wrap items-center justify-between gap-space-sm py-space-xs px-space-md bg-surface-container-low rounded text-on-surface-variant font-label-sm text-label-sm",
    dv("flex items-center gap-space-md",
      <label className={lab} htmlFor="hd"><input type="checkbox" id="hd" className="w-4 h-4 rounded accent-current" checked={!!ui.hideDone} onChange={(e) => { ui.hideDone = e.target.checked; emit(); }} /><span>hide completed</span></label>,
      sp("text-surface-variant", "•"),
      <label className={lab} htmlFor="dt"><input type="checkbox" id="dt" className="w-4 h-4 rounded accent-current" checked={!!ui.detail} onChange={(e) => { ui.detail = e.target.checked; emit(); }} /><span>show step detail</span></label>),
    dv("flex items-center gap-space-xs font-code-stat text-code-stat tabular-nums text-outline", ic("history", "text-[14px]"), sp("", "source: roadmap.sh")));
  const cards = D.extras.filter((r: any) => !sel || r.key === sel.key).map((r: any) => {
    const items = extraList.filter((x) => x.road === r.key);
    const p = prog(items);
    let shown = 0;
    const groups = r.groups.map((g: any) => {
      const rows = items.filter((x) => x.group === g.title && !(ui.hideDone && isDone(x.id)));
      if (!rows.length) return null;
      shown += rows.length;
      return el("div", { key: g.title, class: "flex flex-col gap-space-xs" },
        sp("font-label-sm text-label-sm text-outline uppercase tracking-wider pt-space-sm", lc(g.title)),
        dv("flex flex-col gap-space-xs", rows.map((x) => {
          const done = isDone(x.id);
          return el("div", { key: x.id, class: "flex items-start gap-space-md p-space-sm rounded hover:bg-surface-container transition-colors" },
            el("div", { class: "mt-[2px]" }, tick(x.id, x.title, r.key, true)),
            dv("flex-1 flex flex-col min-w-0",
              sp("font-body-md text-body-md break-words " + (done ? "text-on-surface-variant line-through" : "text-on-surface"), x.title),
              ui.detail && el("p", { class: "font-body-sm text-body-sm text-on-surface-variant mt-[2px]" }, x.note),
              dv("flex items-center gap-space-sm mt-space-xs font-label-sm text-label-sm", done && sp("text-outline", "done " + lc(fmt(parse(S.done[x.id])))), noteButton(x.id)),
              noteBox(x.id)));
        })));
    });
    return el("section", { key: r.key, class: "card flex flex-col bg-surface-container-low rounded p-space-lg gap-space-md", "aria-label": LC[r.key].n + " extras" },
      dv("flex items-center justify-between pb-space-xs",
        dv("flex items-center gap-space-sm", dot(r.key, "w-2.5 h-2.5"), el("h2", { class: "font-headline-sm text-headline-sm text-primary" }, LC[r.key].n + " extras"),
          el("a", { class: "font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface px-space-xs py-[1px] bg-surface-container rounded", href: r.url, rel: "noopener", target: "_blank" }, "roadmap.sh/" + r.url.split("/").pop())),
        sp("font-code-stat text-code-stat tabular-nums text-on-surface-variant", `${p.done} of ${p.total} (${pc(p)}%)`)),
      groups, !shown && sp("font-body-md text-on-surface-variant py-space-md", "Every step here is finished."));
  });
  return dv("flex flex-col w-full gap-space-lg", head, tabs, tool, dv("grid grid-cols-1 " + (sel ? "" : "lg:grid-cols-2 ") + "gap-space-lg", cards));
}
