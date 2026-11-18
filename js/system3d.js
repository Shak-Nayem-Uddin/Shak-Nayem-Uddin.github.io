// "How I build systems": a scroll-driven 3D model of an organisation as an engineered system.
// Five plates (governance, processes, supply chain, digital systems, people) start apart as a
// blueprint, then come together one by one as the reader scrolls. Each plate carries its own
// small modules, and data runs up and down the connectors once the stack is assembled.
import * as THREE from './three.module.min.js';
import { RoomEnvironment } from './RoomEnvironment.js';

const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
const SMALL = () => innerWidth < 820;

let renderer, scene, camera, rig, plates = [], posts = [], dots = [], host = null, sec = null;
let running = false, visible = false, prog = 0, shown = 0, px = 0, tx = 0, labels = [], t0 = 0;
const N_MAX = 6, W = 6, D = 4, TH = 0.16, GAP_OPEN = 2.2, GAP_SHUT = 0.85;

function rounded(w, d, r){
  const s = new THREE.Shape(), x = -w / 2, y = -d / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + d - r); s.quadraticCurveTo(x + w, y + d, x + w - r, y + d);
  s.lineTo(x + r, y + d); s.quadraticCurveTo(x, y + d, x, y + d - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

// small modules that sit on each plate, so every layer reads differently
function modules(kind, mat){
  const g = new THREE.Group(), box = (w, h, d, x, z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, h / 2, z); g.add(m); return m; };
  if (kind === 0){ // governance: three pillars of different height
    [-1.6, 0, 1.6].forEach((x, i) => box(0.55, 0.35 + i * 0.18, 0.55, x, 0));
  } else if (kind === 1){ // processes: a chain of steps joined by a rail
    for (let i = 0; i < 5; i++) box(0.62, 0.16, 0.62, -2 + i, 0);
    box(4.2, 0.05, 0.08, 0, 0);
  } else if (kind === 2){ // supply chain: crates on a path
    [[-1.8, -0.8], [-0.6, 0.6], [0.7, -0.5], [1.9, 0.7]].forEach(([x, z]) => box(0.6, 0.45, 0.6, x, z));
    box(4.6, 0.04, 0.1, 0, 0);
  } else if (kind === 3){ // digital systems: a grid of chips
    for (let i = 0; i < 5; i++) for (let j = 0; j < 3; j++) box(0.42, 0.1 + ((i + j) % 3) * 0.08, 0.42, -2 + i, -1 + j);
  } else { // people: a ring of figures around a table
    for (let i = 0; i < 9; i++){
      const a = i / 9 * Math.PI * 2, m = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.42, 16), mat);
      m.position.set(Math.cos(a) * 1.5, 0.21, Math.sin(a) * 1.05); g.add(m);
      const h = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 12), mat); h.position.set(m.position.x, 0.56, m.position.z); g.add(h);
    }
    box(1.4, 0.12, 0.8, 0, 0);
  }
  g.position.y = TH / 2 + 0.06;
  return g;
}

function build(n){
  const canvas = document.createElement('canvas');
  canvas.className = 'sys3d';
  canvas.setAttribute('aria-hidden', 'true');
  renderer = new THREE.WebGLRenderer({canvas, antialias: true, alpha: true, powerPreference: 'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, SMALL() ? 1.5 : 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  scene = new THREE.Scene();
  scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
  camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  rig = new THREE.Group();
  scene.add(rig);

  const geo = new THREE.ExtrudeGeometry(rounded(W, D, 0.35), {depth: TH, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04, bevelSegments: 3, curveSegments: 12});
  geo.rotateX(-Math.PI / 2); geo.translate(0, -TH / 2, 0);
  const edges = new THREE.EdgesGeometry(geo, 25);
  for (let i = 0; i < n; i++){
    const g = new THREE.Group();
    const glass = new THREE.MeshPhysicalMaterial({color: 0x3A1C2E, metalness: 0.25, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.1, envMapIntensity: 1.1, transparent: true, opacity: 0});
    const slab = new THREE.Mesh(geo, glass);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color: 0xF0D3E2, transparent: true, opacity: 0.9}));
    const modMat = new THREE.MeshStandardMaterial({color: 0xD6A9C0, emissive: 0x7E3A5E, emissiveIntensity: 0.35, roughness: 0.4, metalness: 0.1, transparent: true, opacity: 0});
    const mods = modules(i % 5, modMat);
    g.add(slab, line, mods);
    g.userData = {i, glass, line: line.material, mod: modMat};
    rig.add(g);
    plates.push(g);
  }
  // four connectors through the stack, with data moving along them
  const postMat = new THREE.MeshBasicMaterial({color: 0xE9C9DA, transparent: true, opacity: 0});
  const dotMat = new THREE.MeshBasicMaterial({color: 0xFFFFFF, transparent: true, opacity: 0});
  [[-W / 2 + 0.45, -D / 2 + 0.45], [W / 2 - 0.45, -D / 2 + 0.45], [-W / 2 + 0.45, D / 2 - 0.45], [W / 2 - 0.45, D / 2 - 0.45]].forEach(([x, z], k) => {
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1, 8), postMat);
    p.position.set(x, 0, z); rig.add(p); posts.push(p);
    for (let j = 0; j < 3; j++){
      const d = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 8), dotMat);
      d.userData = {x, z, off: (j / 3 + k * 0.17) % 1, dir: k % 2 ? 1 : -1};
      rig.add(d); dots.push(d);
    }
  });
  const key = new THREE.DirectionalLight(0xffffff, 1.3); key.position.set(-5, 8, 6); scene.add(key);
  const rim = new THREE.DirectionalLight(0xF0C6DA, 1.6); rim.position.set(6, 3, -6); scene.add(rim);
  const glow = new THREE.PointLight(0xD6A9C0, 12, 16, 2); glow.position.set(0, -1, 3); scene.add(glow);
  return canvas;
}

function size(){
  if (!host) return;
  const w = host.clientWidth, h = host.clientHeight;
  if (!w || !h) return;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  aim(0);
}

// the camera moves in as the stack comes together, so the finished system fills the stage
function aim(k){
  const far = (camera.aspect < 0.9 ? 25 : 19) * (1 - 0.22 * k);
  camera.position.set(0, far * 0.55, far);
  camera.lookAt(0, 0, 0);
}

const clamp = v => Math.max(0, Math.min(1, v));
const ease = k => 1 - Math.pow(1 - clamp(k), 3);

function frame(now){
  if (!running) return;
  const t = (now - t0) / 1000, n = plates.length;
  if (sec){
    const r = sec.getBoundingClientRect(), total = Math.max(1, sec.offsetHeight - innerHeight);
    prog += (clamp(-r.top / total) - prog) * 0.12;
  }
  px += (tx - px) * 0.04;
  const p = REDUCE ? 1 : prog;
  // 0 to 0.12 blueprint, then each plate settles in its own slice, then the stack turns
  const span = 0.7 / n;
  let active = 0;
  plates.forEach((g, i) => {
    const k = ease((p - 0.1 - i * span) / span);
    if (p > 0.1 + i * span) active = i;
    const gap = GAP_OPEN + (GAP_SHUT - GAP_OPEN) * k;
    g.position.y = ((n - 1) / 2 - i) * gap;
    g.position.x = (1 - k) * (i % 2 ? 0.6 : -0.6);
    g.userData.glass.opacity = 0.15 + 0.8 * k;
    g.userData.mod.opacity = 0.25 + 0.75 * k;
    g.userData.line.opacity = 0.9 - 0.45 * k;
    g.userData.mod.emissiveIntensity = i === active && p < 0.85 ? 0.9 : 0.35;
  });
  const done = ease((p - 0.78) / 0.15), height = (n - 1) * (GAP_OPEN + (GAP_SHUT - GAP_OPEN) * ease((p - 0.1) / 0.7)) + 0.6;
  posts.forEach(m => { m.scale.y = height; m.material.opacity = 0.2 + 0.6 * done; });
  dots.forEach(d => {
    const u = ((t * 0.25 * d.userData.dir + d.userData.off) % 1 + 1) % 1;
    d.position.set(d.userData.x, (u - 0.5) * height, d.userData.z);
    d.material.opacity = done;
  });
  rig.rotation.y = -0.65 + p * 1.1 + (REDUCE ? 0 : Math.sin(t * 0.2) * 0.04) + px * 0.06;
  rig.rotation.x = 0;
  aim(ease((p - 0.55) / 0.4));
  renderer.render(scene, camera);

  const li = Math.min(n - 1, Math.max(0, Math.floor((p - 0.1) / span)));
  const which = p < 0.08 ? -1 : (p > 0.9 ? -2 : li);
  if (which !== shown){ shown = which; labels.forEach((l, i) => l.classList.toggle('on', which === -2 || i === which)); sec.classList.toggle('all', which === -2); }
  if (REDUCE){ running = false; return; }
  requestAnimationFrame(frame);
}

function start(){ if (running || !visible || document.hidden) return; running = true; requestAnimationFrame(frame); }
function stop(){ running = false; }

let io = null;
function mount(el){
  if (!el) return;
  const n = Math.min(N_MAX, el.parentNode.querySelectorAll('.sys-list li').length) || 5;
  if (!renderer){
    try { el.appendChild(build(n)); } catch (e) { renderer = null; el.closest('.sys').classList.add('nogl'); return; }
    t0 = performance.now();
    addEventListener('resize', size);
    addEventListener('pointermove', e => { tx = e.clientX / innerWidth * 2 - 1; }, {passive: true});
    document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
  } else {
    el.appendChild(renderer.domElement);
  }
  host = el; sec = el.closest('.sys'); shown = null;
  labels = Array.prototype.slice.call(sec.querySelectorAll('.sys-list li'));
  sec.classList.add('gl');
  size();
  if (io) io.disconnect();
  io = new IntersectionObserver(es => { visible = es[0].isIntersecting; visible ? (size(), start()) : stop(); }, {rootMargin: '100px'});
  io.observe(sec);
}

window.sys3d = {mount};
if (window._sys3d) mount(window._sys3d);
