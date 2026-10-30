/* Completion feedback built on three.js (loaded on first use).
   Flat squares in the language colour burst from the tick you just checked. Gates and capstones burst bigger.
   Does nothing under prefers-reduced-motion or when WebGL is unavailable. */
const COL: Record<string, number> = { py: 0xe6a93a, cpp: 0x6ea6f5, java: 0xef7d73, ai: 0xc084fc };
let T: any, renderer: any, scene: any, cam: any, running = false, bursts: any[] = [], flyers: any[] = [], dead = false, installed = false;

async function boot() {
  if (T || dead) return !dead;
  try {
    T = await import("three");
    renderer = new T.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "low-power" });
    renderer.setClearColor(0x000000, 0);
    const c = renderer.domElement as HTMLCanvasElement;
    c.setAttribute("aria-hidden", "true");
    c.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:95";
    document.body.appendChild(c);
    scene = new T.Scene();
    size();
    window.addEventListener("resize", size);
    return true;
  } catch (e) { dead = true; return false; }
}
function size() {
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(w, h, false);
  cam = new T.OrthographicCamera(0, w, 0, h, -10, 10);
}
function burst(x: number, y: number, color: number, big: boolean) {
  const n = big ? 72 : 20, g = new T.BufferGeometry();
  const pos = new Float32Array(n * 3), vel: number[][] = [];
  for (let i = 0; i < n; i++) {
    const ring = big && i % 2 ? 1.7 : 1;
    const a = (i / n) * Math.PI * 2 + Math.random() * 0.4;
    const sp = (big ? 170 : 80) * ring * (0.7 + Math.random() * 0.5);
    vel.push([Math.cos(a) * sp, Math.sin(a) * sp]);
  }
  g.setAttribute("position", new T.BufferAttribute(pos, 3));
  const m = new T.PointsMaterial({ color, size: big ? 7 : 5, sizeAttenuation: false, transparent: true, depthTest: false });
  const p = new T.Points(g, m);
  p.frustumCulled = false;
  scene.add(p);
  bursts.push({ p, g, m, pos, vel, x, y, t0: performance.now(), life: big ? 900 : 620 });
  if (!running) { running = true; requestAnimationFrame(tick); }
}
function fly(x: number, y: number, color: number, tx: number, ty: number, el: Element | null) {
  const m = new T.MeshBasicMaterial({ color, transparent: true, depthTest: false });
  const mesh = new T.Mesh(new T.PlaneGeometry(1, 1), m);
  mesh.position.set(x, y, 1); mesh.scale.set(18, 18, 1); scene.add(mesh);
  flyers.push({ mesh, m, x, y, tx, ty, color, el, t0: performance.now(), life: 680 });
  if (!running) { running = true; requestAnimationFrame(tick); }
}
function tick(now: number) {
  flyers = flyers.filter((f) => {
    const t = (now - f.t0) / f.life;
    if (t >= 1) {
      scene.remove(f.mesh); f.mesh.geometry.dispose(); f.m.dispose();
      if (f.el) { f.el.classList.remove("land"); void (f.el as HTMLElement).offsetWidth; f.el.classList.add("land"); window.dispatchEvent(new CustomEvent("ladder:land")); }
      burst(f.tx, f.ty, f.color, false);
      return false;
    }
    const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const cx = f.x + (f.tx - f.x) * 0.25, cy = Math.min(f.y, f.ty) - 140;
    const a = (1 - e) * (1 - e), b = 2 * (1 - e) * e, c = e * e;
    f.mesh.position.x = a * f.x + b * cx + c * f.tx; f.mesh.position.y = a * f.y + b * cy + c * f.ty;
    const sc = 18 - 10 * e; f.mesh.scale.set(sc, sc, 1); f.mesh.rotation.z = e * 3.14;
    return true;
  });
  bursts = bursts.filter((b) => {
    const t = (now - b.t0) / b.life;
    if (t >= 1) { scene.remove(b.p); b.g.dispose(); b.m.dispose(); return false; }
    const e = 1 - Math.pow(1 - t, 3), drop = 60 * t * t;
    for (let i = 0; i < b.vel.length; i++) { b.pos[i * 3] = b.x + b.vel[i][0] * e; b.pos[i * 3 + 1] = b.y + b.vel[i][1] * e + drop; }
    b.g.attributes.position.needsUpdate = true;
    b.m.opacity = 1 - t * t;
    return true;
  });
  renderer.render(scene, cam);
  if (bursts.length || flyers.length) requestAnimationFrame(tick); else { running = false; renderer.clear(); }
}
function langOf(lang: string, id: string) {
  if (COL[lang]) return lang;
  const p = id.split(".");
  return p[0] === "cap" ? p[1] : p[0];
}
export function installBurst() {
  if (installed || typeof document === "undefined") return;
  installed = true;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  document.addEventListener("change", async (ev) => {
    const i = ev.target as HTMLInputElement;
    if (!i || !i.classList || !i.classList.contains("tick") || !i.checked || reduce.matches) return;
    const id = i.getAttribute("data-id") || "", lang = i.getAttribute("data-lang") || "";
    if (!id) return;
    const r = (i.parentElement || i).getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    if (!(await boot())) return;
    const big = id.startsWith("gate.") || id.startsWith("cap.");
    const col = COL[langOf(lang, id)] || 0xe5e2e1;
    const target = document.querySelector(".hx-count");
    if (big || !target) burst(x, y, col, big);
    if (target) { const tr = target.getBoundingClientRect(); fly(x, y, col, tr.left + 14, tr.top + tr.height / 2, target); }
  }, true);
}
