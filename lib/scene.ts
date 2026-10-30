/* three.js scene for the cinematic home page. Cube = main tasks (one block each, lit when done).
   Water, ridges and particles are scenery. Loaded on demand; callers fall back to a static backdrop. */
export type SceneDeps = {
  root: HTMLElement;
  canvas: HTMLCanvasElement;
  fallback: HTMLElement | null;
  tasks: { id: string; lang: string; week: number; kind: string }[];
  streak: () => number;
  done: () => Record<string, string>;
  week: () => number;
  reduce: boolean;
};
export type SceneApi = {
  load: (progress: (p: number) => void) => Promise<boolean>;
  setFocus: (f: string) => void;
  setPose: (i: number) => void;
  refresh: () => void;
  start: () => void;
  stop: () => void;
  destroy: () => void;
  zoom: () => void;
};
const LANGC: Record<string, number> = { py: 0xe6a93a, cpp: 0x6ea6f5, java: 0xef7d73 };

export function createScene(d: SceneDeps): SceneApi {
  const { root, canvas, reduce, tasks } = d;
  let focus = "all", poseIdx = 0;
  const api: SceneApi = {
    load: async () => false, setFocus: (f) => { focus = f; }, setPose: (i) => { poseIdx = i; },
    refresh() {}, start() {}, stop() {}, destroy() {}, zoom() {}
  };
  api.load = async (progress) => {
    let T: any;
    try { T = await import("three"); } catch (e) { return false; }
    progress(0.5);
    let renderer: any;
    try { renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" }); } catch (e) { return false; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    if (d.fallback) d.fallback.style.display = "none";
    const sc = new T.Scene(); sc.background = new T.Color(0x020a18); sc.fog = new T.FogExp2(0x041a3c, 0.012);
    const cam = new T.PerspectiveCamera(46, 1, 0.1, 200);
    const size = () => { const w = root.clientWidth, h = root.clientHeight; renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); };
    size(); window.addEventListener("resize", size);

    /* cube of task blocks */
    const GX = 6, GY = 7, GZ = 6, N = GX * GY * GZ, step = 1.0, YS = 6 / 7, S = 0.97;
    const geo = new T.BoxGeometry(S, S, S);
    const mat = new T.MeshLambertMaterial({ color: 0xffffff, emissive: 0x0a4a8a });
    const mesh = new T.InstancedMesh(geo, mat, N);
    mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);
    mesh.frustumCulled = false;
    const rmat = new T.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.18, depthWrite: false, side: T.DoubleSide });
    const refl = new T.InstancedMesh(geo, rmat, N);
    refl.instanceMatrix = mesh.instanceMatrix; refl.frustumCulled = false;
    const group = new T.Group(), rgroup = new T.Group();
    group.add(mesh); rgroup.add(refl); rgroup.scale.y = -1;
    const CY = 7.2;
    group.position.y = CY; rgroup.position.y = -CY;
    sc.add(group, rgroup);

    const pos: number[][] = [], scatter: number[][] = [];
    for (let i = 0; i < N; i++) {
      const x = i % GX, z = Math.floor(i / GX) % GZ, y = Math.floor(i / (GX * GZ));
      pos.push([(x - (GX - 1) / 2) * step, (y - (GY - 1) / 2) * step * YS, (z - (GZ - 1) / 2) * step]);
      scatter.push([pos[i][0] + (Math.random() - 0.5) * 1.6, 24 + Math.random() * 22, pos[i][2] + (Math.random() - 0.5) * 1.6]);
    }
    const col = new Float32Array(N * 3), tgt = new Float32Array(N * 3);
    mesh.instanceColor = new T.InstancedBufferAttribute(col, 3);
    refl.instanceColor = mesh.instanceColor;
    const C = new T.Color(), BASE = new T.Color(0x3fd2ff), OFF = new T.Color(0x1f9ae6), DIM = new T.Color(0x0a2552), WH = new T.Color(0xcfeaff);
    const wkN = [0, 0, 0, 0, 0, 0, 0, 0, 0], wkD = [0, 0, 0, 0, 0, 0, 0, 0, 0], gateW: Record<number, boolean> = {};
    tasks.forEach((t) => { if (t.week >= 1 && t.week <= 8) { wkN[t.week]++; } if (t.kind === "gate" || t.kind === "cap") gateW[t.week] = true; });
    function targets() {
      const dn = d.done(), w = d.week();
      wkD.fill(0); tasks.forEach((t) => { if (dn[t.id] && t.week >= 1 && t.week <= 8) wkD[t.week]++; });
      for (let i = 0; i < N; i++) {
        const t = tasks[i];
        if (!t) { C.set(0x020a18); }
        else {
          const dd = !!dn[t.id];
          const inF = focus === "all" || (focus === "week" ? t.week === w : t.lang === focus);
          if (focus === "week") C.copy(inF ? (dd ? WH : new T.Color(0x3a74c0)) : (dd ? OFF.clone().lerp(BASE, 0.5) : DIM));
          else if (focus === "all") C.copy(dd ? BASE : OFF);
          else C.copy(inF ? (dd ? new T.Color(LANGC[focus]) : new T.Color(LANGC[focus]).multiplyScalar(0.55)) : (dd ? OFF.clone().lerp(BASE, 0.35) : DIM));
        }
        tgt[i * 3] = C.r; tgt[i * 3 + 1] = C.g; tgt[i * 3 + 2] = C.b;
      }
    }
    api.setFocus = (f) => { focus = f; targets(); };
    api.refresh = targets;
    targets(); for (let i = 0; i < N * 3; i++) col[i] = tgt[i];

    /* glow billboard behind the cube */
    const gc = document.createElement("canvas"); gc.width = gc.height = 128;
    const g2 = gc.getContext("2d") as CanvasRenderingContext2D, gr = g2.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, "rgba(60,170,255,.85)"); gr.addColorStop(0.35, "rgba(30,110,230,.35)"); gr.addColorStop(1, "rgba(10,40,120,0)");
    g2.fillStyle = gr; g2.fillRect(0, 0, 128, 128);
    const glow = new T.Sprite(new T.SpriteMaterial({ map: new T.CanvasTexture(gc), transparent: true, depthWrite: false, blending: T.AdditiveBlending, opacity: 0.6 }));
    glow.scale.set(26, 26, 1); glow.position.set(0, CY, -2.5); sc.add(glow);

    /* water */
    const WG = new T.PlaneGeometry(120, 80, 100, 66); WG.rotateX(-Math.PI / 2);
    const wmat = new T.MeshPhongMaterial({ color: 0x0a3a7e, specular: 0x8fd0ff, shininess: 40, transparent: true, opacity: 0.8, flatShading: true, depthWrite: false });
    const water = new T.Mesh(WG, wmat); water.position.set(0, 0, -10); sc.add(water);
    const wp = WG.attributes.position, wBase = new Float32Array(wp.count * 2);
    for (let i = 0; i < wp.count; i++) { wBase[i * 2] = wp.getX(i); wBase[i * 2 + 1] = wp.getZ(i); }

    /* ridges */
    function ridge(side: number) {
      const g = new T.PlaneGeometry(46, 40, 46, 40); g.rotateX(-Math.PI / 2);
      const p = g.attributes.position;
      for (let i = 0; i < p.count; i++) {
        const x = p.getX(i), z = p.getZ(i), u = (x + 23) / 46;
        const slope = Math.pow(side < 0 ? 1 - u : u, 1.7) * 13;
        const n = Math.sin(x * 0.45 + z * 0.3) * 0.9 + Math.sin(z * 0.7 - x * 0.2) * 0.7 + Math.sin(x * 1.3) * 0.25;
        p.setY(i, Math.max(-0.4, slope + n * (slope * 0.12 + 0.2) - 0.6));
      }
      g.computeVertexNormals();
      const m = new T.Mesh(g, new T.MeshPhongMaterial({ color: 0x0c2a5e, specular: 0x4a8fe8, shininess: 14, flatShading: true }));
      m.position.set(side * 20, 0, -22); return m;
    }
    sc.add(ridge(-1), ridge(1));

    /* cpp shockwave ring on the water */
    const ringMat = new T.MeshBasicMaterial({ color: 0x6ea6f5, transparent: true, opacity: 0, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide });
    const ring = new T.Mesh(new T.RingGeometry(0.92, 1, 64), ringMat); ring.rotation.x = -Math.PI / 2; ring.position.set(0, 0.15, 0); sc.add(ring);

    /* weeks ribbon: 8 week segments scroll past, gates stand up as markers */
    const rib = new T.Group(); sc.add(rib);
    const segGeo = new T.BoxGeometry(2, 0.35, 1.2), gateGeo = new T.BoxGeometry(0.18, 1.6, 0.18);
    const segs: any[] = [];
    for (let w = 1; w <= 8; w++) {
      const m = new T.Mesh(segGeo, new T.MeshBasicMaterial({ color: 0x0a2552, transparent: true, opacity: 0 }));
      const g = gateW[w] ? new T.Mesh(gateGeo, new T.MeshBasicMaterial({ color: 0xcfeaff, transparent: true, opacity: 0 })) : null;
      if (g) { g.position.y = 1; m.add(g); }
      rib.add(m); segs.push({ m, g, w });
    }
    rib.position.set(0, 0.9, 13);
    let ribA = 0;
    const RIBW = 8 * 2.4;

    /* log: a column of light that grows with the streak */
    const colMat = new T.MeshBasicMaterial({ color: 0x7fd0ff, transparent: true, opacity: 0, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide });
    const column = new T.Mesh(new T.CylinderGeometry(0.45, 0.45, 1, 24, 1, true), colMat); sc.add(column);
    const base = new T.Mesh(new T.RingGeometry(0.6, 1.3, 40), colMat); base.rotation.x = -Math.PI / 2; base.position.set(-6, 0.2, 3); sc.add(base);
    column.position.set(-6, 0, 3);
    let colH = 0, colA = 0;

    sc.add(new T.AmbientLight(0x2a5cb0, 1.1)); const dl = new T.DirectionalLight(0x9fd4ff, 1.6); dl.position.set(5, 14, 16); sc.add(dl);
    const pl = new T.PointLight(0x3aa6ff, 160, 70, 1.6); pl.position.set(0, CY + 1, 2); sc.add(pl);
    [-1, 1].forEach((sd) => { const l2 = new T.PointLight(0x3fb6ff, 260, 40, 1.8); l2.position.set(sd * 11, 2.2, -7); sc.add(l2); });

    /* particles */
    const PN = 420, pg = new T.BufferGeometry(), pa = new Float32Array(PN * 3), pv: number[] = [];
    for (let i = 0; i < PN; i++) { pa[i * 3] = (Math.random() - 0.5) * 70; pa[i * 3 + 1] = Math.random() * 16; pa[i * 3 + 2] = -Math.random() * 40 + 8; pv.push(0.05 + Math.random() * 0.18); }
    pg.setAttribute("position", new T.BufferAttribute(pa, 3));
    const pts = new T.Points(pg, new T.PointsMaterial({ color: 0x8fc8ff, size: 2.2, sizeAttenuation: false, transparent: true, opacity: 0.7, depthWrite: false }));
    pts.frustumCulled = false; sc.add(pts);

    /* camera poses per chapter */
    const POSES = [
      { p: [0, 4.2, 25], l: [0, 3.4, 0], ry: 0.35 },
      { p: [11, 7, 23], l: [0, 3.8, 0], ry: 1.2 },
      { p: [-10, 4, 21], l: [0, 3.5, 0], ry: 0.2 },
      { p: [0, 3.4, 19], l: [0, 4.2, 0], ry: 2.4 },
      { p: [9, 4, 20], l: [0, 3.6, 0], ry: 3.6 },
      { p: [0, 15, 21], l: [0, 5.2, 0], ry: 0.9 }
    ];
    let pose = POSES[0], camP = new T.Vector3(0, 6, 30), camL = new T.Vector3(0, 4, 0), ry = 0, tryv = 0, mx = 0, my = 0, tmx = 0, tmy = 0;
    let fxKind = "", fxT0 = 0, fast = false, zoomed = false;
    let ringT0 = -1e9;
    api.setPose = (i) => {
      if (zoomed) return;
      const changed = i !== poseIdx;
      poseIdx = i; pose = POSES[i] || POSES[0]; tryv = pose.ry;
      const kind = ["", "", "py", "cpp", "java", ""][i] || "";
      if (kind && changed && !reduce) { fxKind = kind; fxT0 = performance.now(); if (kind === "cpp") ringT0 = performance.now(); } else if (!kind) fxKind = "";
    };
    api.zoom = () => { zoomed = true; fast = true; pose = { p: [0, CY, 4.5], l: [0, CY, 0], ry: pose.ry }; };
    api.setPose(poseIdx);
    const onMove = (e: PointerEvent) => { tmx = e.clientX / root.clientWidth - 0.5; tmy = e.clientY / root.clientHeight - 0.5; };
    root.addEventListener("pointermove", onMove, { passive: true });

    const m4 = new T.Matrix4(), q = new T.Quaternion(), sv = new T.Vector3(), pv3 = new T.Vector3();
    const t0 = performance.now();
    const bounce = (x: number) => { if (x <= 0) return 0; if (x >= 1) return 1; const n = 7.5625, d = 2.75; const y = 1 - x; if (y < 1 / d) return 1 - n * y * y; if (y < 2 / d) { const t = y - 1.5 / d; return 1 - (n * t * t + 0.75); } if (y < 2.5 / d) { const t = y - 2.25 / d; return 1 - (n * t * t + 0.9375); } const t = y - 2.625 / d; return 1 - (n * t * t + 0.984375); };
    let asm = reduce ? 1 : 0, running = false, last = performance.now(), raf = 0;
    function frame(now: number) {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const t = (now - t0) / 1000;
      if (asm < 1) asm = Math.min(1, (now - t0) / 3400);
      const A = d.done();
      for (let i = 0; i < N; i++) {
        const k = Math.min(1, Math.max(0, asm * 1.6 - (i / N) * 0.6)), e = 1 - Math.pow(1 - k, 3);
        const p = pos[i], s = scatter[i];
        let sc2 = 1;
        const tk = tasks[i];
        if (!tk) sc2 = 0; else if (!reduce && A[tk.id]) sc2 = 1 + Math.sin(t * 1.4 + i * 0.37) * 0.05;
        sc2 *= 0.25 + 0.75 * e;
        const fall = bounce(k), lat = Math.min(1, e * 1.6);
        pv3.set(s[0] + (p[0] - s[0]) * lat, s[1] + (p[1] - s[1]) * fall, s[2] + (p[2] - s[2]) * lat);
        /* language chapter effects: ripple (py), snap with shockwave (cpp), cascade (java) */
        if (fxKind && asm >= 1) {
          const fe = (now - fxT0) / 1100, rx = p[0], ry2 = p[1] + 0, rz = p[2];
          if (fxKind === "py" && fe < 1.6) { const dd = Math.sqrt(rx * rx + ry2 * ry2 + rz * rz), r0 = fe * 7, a = Math.exp(-((dd - r0) * (dd - r0)) / 1.1); const L = dd || 1; pv3.x += rx / L * a * 0.5; pv3.y += ry2 / L * a * 0.5; pv3.z += rz / L * a * 0.5; sc2 *= 1 + a * 0.3; }
          else if (fxKind === "cpp" && fe < 1) { const x0 = Math.min(1, fe / 0.55), ex = (1 - x0) * (1 - x0) * 1.5; const L = Math.sqrt(rx * rx + ry2 * ry2 + rz * rz) || 1; pv3.x += rx / L * ex; pv3.y += ry2 / L * ex; pv3.z += rz / L * ex; }
          else if (fxKind === "java" && fe < 1.8) { const ly = (p[1] / (step * YS)) + (GY - 1) / 2, tw = fe * 1.5 - ((GY - 1 - ly) / GY) * 0.9, a = tw > 0 && tw < 1 ? Math.sin(tw * Math.PI) : 0; pv3.y -= a * 0.45; sc2 *= 1 + a * 0.22; }
        }
        sv.set(sc2, sc2 * YS, sc2); q.identity();
        m4.compose(pv3, q, sv); mesh.setMatrixAt(i, m4);
        const o = i * 3, f = Math.min(1, dt * 5);
        col[o] += (tgt[o] - col[o]) * f; col[o + 1] += (tgt[o + 1] - col[o + 1]) * f; col[o + 2] += (tgt[o + 2] - col[o + 2]) * f;
      }
      mesh.instanceMatrix.needsUpdate = true; mesh.instanceColor.needsUpdate = true;
      ry += (tryv - ry) * Math.min(1, dt * 2.2);
      const spin = reduce ? 0 : Math.sin(t * 0.25) * 0.28;
      group.rotation.y = ry + spin; rgroup.rotation.y = ry + spin;
      const fl = reduce ? 0 : Math.sin(t * 0.8) * 0.18;
      group.position.y = CY + fl; rgroup.position.y = -(CY + fl);
      glow.position.y = CY + fl;
      if (!reduce) {
        for (let i = 0; i < wp.count; i++) {
          const x = wBase[i * 2], z = wBase[i * 2 + 1];
          wp.setY(i, Math.sin(x * 0.5 + t * 1.1) * 0.06 + Math.sin(z * 0.7 - t * 0.9) * 0.06 + Math.sin((x + z) * 0.25 + t * 0.6) * 0.05);
        }
        wp.needsUpdate = true; WG.computeVertexNormals();
      }
      for (let i = 0; i < PN; i++) { let y = pa[i * 3 + 1] + (reduce ? 0 : pv[i] * dt); if (y > 18) y = 0; pa[i * 3 + 1] = y; }
      pg.attributes.position.needsUpdate = true;
      mx += (tmx - mx) * Math.min(1, dt * 2); my += (tmy - my) * Math.min(1, dt * 2);
      const k = Math.min(1, dt * (fast ? 4.5 : asm < 1 ? 1.2 : 2.4));
      const px = pose.p[0] + (reduce ? 0 : mx * 1.4), py = pose.p[1] + (reduce ? 0 : -my * 0.8), pz = pose.p[2] * (cam.aspect < 0.8 ? 1.5 : 1);
      camP.x += (px - camP.x) * k; camP.y += (py - camP.y) * k; camP.z += (pz - camP.z) * k;
      camL.x += (pose.l[0] - camL.x) * k; camL.y += (pose.l[1] - camL.y) * k; camL.z += (pose.l[2] - camL.z) * k;
      cam.position.copy(camP); cam.lookAt(camL);
      /* ring */
      const re = (now - ringT0) / 1400;
      if (re >= 0 && re < 1) { const r = 2 + re * 16; ring.scale.set(r, r, 1); ringMat.opacity = (1 - re) * 0.7; } else ringMat.opacity = 0;
      /* ribbon: visible on the weeks chapter */
      const wantR = poseIdx === 1 && !zoomed ? 1 : 0; ribA += (wantR - ribA) * Math.min(1, dt * 3);
      rib.visible = ribA > 0.01;
      if (rib.visible) {
        const cw = d.week();
        segs.forEach((sg, i) => {
          let x = i * 2.4 + (reduce ? 0 : t * 0.7); x = ((x % RIBW) + RIBW) % RIBW - RIBW / 2;
          const ax = Math.abs(x), edge = 1 - Math.min(1, Math.max(0, (ax - 6) / 5.2));
          sg.m.position.x = x; sg.m.scale.set(1, 1, 1);
          const prog = wkN[sg.w] ? wkD[sg.w] / wkN[sg.w] : 0, cur2 = sg.w === cw;
          sg.m.material.color.setHex(cur2 ? 0xffffff : 0x0a2552).lerp(new T.Color(0x3fd2ff), cur2 ? 0 : prog);
          sg.m.material.opacity = ribA * edge * (cur2 ? 1 : 0.8);
          if (sg.g) { sg.g.material.opacity = ribA * edge; }
        });
      }
      /* log column */
      const wantC = poseIdx === 5 && !zoomed ? 1 : 0; colA += (wantC - colA) * Math.min(1, dt * 2);
      const targetH = 6 + Math.min(56, d.streak()) / 56 * 22;
      colH += ((wantC ? targetH : 0) - colH) * Math.min(1, dt * 1.6);
      column.visible = colA > 0.01; base.visible = column.visible;
      column.scale.y = Math.max(0.01, colH); column.position.y = colH / 2;
      colMat.opacity = colA * (0.35 + 0.1 * (reduce ? 0 : Math.sin(t * 2)));
      const lit = Object.keys(A).length / Math.max(1, tasks.length);
      glow.material.opacity = 0.32 + lit * 0.5;
      renderer.render(sc, cam);
    }
    api.start = () => { if (running) return; running = true; last = performance.now(); raf = requestAnimationFrame(frame); };
    api.stop = () => { running = false; cancelAnimationFrame(raf); };
    const vis = () => { if (document.hidden) api.stop(); else api.start(); };
    document.addEventListener("visibilitychange", vis);
    api.destroy = () => {
      api.stop();
      document.removeEventListener("visibilitychange", vis);
      window.removeEventListener("resize", size);
      root.removeEventListener("pointermove", onMove);
      sc.traverse((o: any) => { if (o.geometry) o.geometry.dispose(); if (o.material) { (Array.isArray(o.material) ? o.material : [o.material]).forEach((m: any) => { if (m.map) m.map.dispose(); m.dispose(); }); } });
      renderer.dispose();
    };
    progress(1);
    return true;
  };
  return api;
}
