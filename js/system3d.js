// "How I build systems": a few thousand points of light that rebuild themselves, as the reader
// scrolls, into each part of the work: the buildings under construction, the supply chain,
// the data systems, the team, and finally the institution as one running system.
// The shape for each step is picked from its label in the sheet (see shapeFor below).
import * as THREE from './three.module.min.js';

const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
const SMALL = () => innerWidth < 820;

let renderer, scene, camera, pts, mat, host = null, sec = null, labels = [], targets = [];
let running = false, visible = false, prog = 0, shown = null, seg = -1, px = 0, py = 0, tx = 0, ty = 0, t0 = 0, N = 6000;

// ---------- shapes: each returns N points (x, y, z) roughly inside an 8 x 5 x 5 box
const R = Math.random;
function fill(N, parts){
  // parts: [{w: weight, f: () => [x, y, z]}]; the points are shared out by weight
  const out = new Float32Array(N * 3), tot = parts.reduce((a, p) => a + p.w, 0);
  let i = 0;
  parts.forEach((p, k) => {
    const n = k === parts.length - 1 ? N - i : Math.round(N * p.w / tot);
    for (let j = 0; j < n && i < N; j++, i++){ const v = p.f(); out[i * 3] = v[0]; out[i * 3 + 1] = v[1]; out[i * 3 + 2] = v[2]; }
  });
  return out;
}
const lerp = (a, b, t) => a + (b - a) * t;
function edge(a, b){ return () => { const t = R(); return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]; }; }
function ball(c, r){ return () => { const a = R() * 6.283, b = Math.acos(2 * R() - 1), q = r * Math.cbrt(R()); return [c[0] + q * Math.sin(b) * Math.cos(a), c[1] + q * Math.cos(b), c[2] + q * Math.sin(b) * Math.sin(a)]; }; }
function boxEdges(cx, cy, cz, w, h, d){
  const x0 = cx - w / 2, x1 = cx + w / 2, y0 = cy, y1 = cy + h, z0 = cz - d / 2, z1 = cz + d / 2, e = [];
  [[x0, z0], [x1, z0], [x1, z1], [x0, z1]].forEach(([x, z], k, arr) => {
    const [nx, nz] = arr[(k + 1) % 4], len = Math.hypot(nx - x, nz - z);
    e.push({w: len, f: edge([x, y0, z], [nx, y0, nz])}, {w: len, f: edge([x, y1, z], [nx, y1, nz])}, {w: h, f: edge([x, y0, z], [x, y1, z])});
  });
  return e;
}

const SHAPES = {
  cloud(N){ return fill(N, [{w: 1, f: () => { const r = 7 + R() * 7, a = R() * 6.283, b = Math.acos(2 * R() - 1); return [r * Math.sin(b) * Math.cos(a), r * Math.cos(b) * 0.6, r * Math.sin(b) * Math.sin(a)]; }}]); },

  // the mosque (prayer hall, dome, minaret) beside an eleven-storey academic building, on a site grid
  building(N){
    const parts = [];
    boxEdges(-1.4, -2, 0, 3, 1.5, 2.2).forEach(p => parts.push(p));
    parts.push({w: 7, f: () => { const a = R() * 6.283, b = R() * 1.5708, r = 1.05; return [-1.4 + r * Math.cos(b) * Math.cos(a), -0.5 + r * Math.sin(b), r * Math.cos(b) * Math.sin(a)]; }});
    boxEdges(-3.3, -2, -0.8, 0.4, 3.6, 0.4).forEach(p => parts.push(p));
    parts.push({w: 1, f: () => { const t = R(), a = R() * 6.283, r = 0.24 * (1 - t); return [-3.3 + r * Math.cos(a), 1.6 + t * 0.7, -0.8 + r * Math.sin(a)]; }});
    boxEdges(1.9, -2, 0.2, 1.5, 4.4, 1.5).forEach(p => parts.push(p));
    for (let f = 1; f < 11; f++){ const y = -2 + f * 0.4; parts.push({w: 1.5, f: edge([1.15, y, 0.95], [2.65, y, 0.95])}, {w: 1.5, f: edge([2.65, y, -0.55], [2.65, y, 0.95])}); }
    for (let g = -4; g <= 4; g++) parts.push({w: 1.1, f: edge([g, -2, -2.4], [g, -2, 2.4])});
    for (let g = -2; g <= 2; g++) parts.push({w: 1.3, f: edge([-4, -2, g * 1.2], [4, -2, g * 1.2])});
    return fill(N, parts);
  },

  // three vendors feed a comparative statement, then a purchase order, then delivery
  chain(N){
    const nodes = [[-3.6, 1.1, -0.8], [-3.6, 0, 0.7], [-3.6, -1.1, -0.3], [-1.2, 0, 0], [1.2, 0, 0], [3.6, 0, 0]], parts = [];
    nodes.forEach((c, k) => parts.push({w: k > 2 ? 5 : 3, f: ball(c, k > 2 ? 0.5 : 0.3)}));
    [[0, 3], [1, 3], [2, 3], [3, 4], [4, 5]].forEach(([a, b]) => parts.push({w: 4, f: () => {
      const t = R(), A = nodes[a], B = nodes[b], j = 0.07;
      return [lerp(A[0], B[0], t) + (R() - 0.5) * j, lerp(A[1], B[1], t) + Math.sin(t * Math.PI) * 0.4 + (R() - 0.5) * j, lerp(A[2], B[2], t) + (R() - 0.5) * j];
    }}));
    nodes.slice(3).forEach(([x, y, z]) => parts.push({w: 3, f: () => { const a = R() * 6.283; return [x + Math.cos(a) * 0.95, y + Math.sin(a) * 0.95, z + (R() - 0.5) * 0.04]; }}));
    return fill(N, parts);
  },

  // a 3D bar chart: twelve months by three measures, with a trend line above
  bars(N){
    const parts = [], H = [0.9, 1.2, 1.1, 1.6, 1.5, 2, 1.8, 2.3, 2.6, 2.4, 3, 3.3];
    H.forEach((h, i) => [0, 1, 2].forEach(r => {
      const x = -3.3 + i * 0.6, z = -0.8 + r * 0.8, hh = h * (1 - r * 0.22);
      parts.push({w: hh * 1.4, f: () => [x + (R() - 0.5) * 0.3, -2 + R() * hh, z + (R() - 0.5) * 0.3]});
    }));
    for (let g = 0; g <= 12; g++) parts.push({w: 0.7, f: edge([-3.6 + g * 0.6, -2, -1.4], [-3.6 + g * 0.6, -2, 1.4])});
    parts.push({w: 2.5, f: () => { const t = R(); return [-3.3 + t * 6.6, -0.6 + t * 2.6 + Math.sin(t * 9) * 0.12, 1.5]; }});
    return fill(N, parts);
  },

  // a team: ten people around a centre, each linked to the centre and to the next person
  people(N){
    const parts = [], P = [];
    for (let i = 0; i < 10; i++){ const a = i / 10 * 6.283; P.push([Math.cos(a) * 3, Math.sin(a * 2) * 0.35, Math.sin(a) * 2.2]); }
    P.forEach(([x, y, z]) => {
      parts.push({w: 3, f: ball([x, y + 0.6, z], 0.2)});
      parts.push({w: 4, f: () => { const t = R(), a = R() * 6.283, r = 0.08 + t * 0.28; return [x + r * Math.cos(a), y + 0.3 - t * 0.75, z + r * Math.sin(a)]; }});
    });
    parts.push({w: 6, f: ball([0, 0, 0], 0.5)});
    P.forEach((p, i) => { parts.push({w: 1.6, f: edge([0, 0, 0], p)}); parts.push({w: 1.2, f: edge(p, P[(i + 1) % 10])}); });
    return fill(N, parts);
  },

  // the institution: a core with three orbits, everything connected
  sphere(N){
    const parts = [{w: 10, f: () => { const a = R() * 6.283, b = Math.acos(2 * R() - 1), r = 1.9; return [r * Math.sin(b) * Math.cos(a), r * Math.cos(b), r * Math.sin(b) * Math.sin(a)]; }}];
    [[0.3, 0], [1.2, 1], [-0.9, 2]].forEach(([tilt, k]) => parts.push({w: 4, f: () => {
      const a = R() * 6.283, r = 2.9 + k * 0.35, x = Math.cos(a) * r, z = Math.sin(a) * r;
      return [x, z * Math.sin(tilt) + (R() - 0.5) * 0.06, z * Math.cos(tilt)];
    }}));
    return fill(N, parts);
  }
};
function shapeFor(label){
  const l = label.toLowerCase();
  if (/build|struct|infra|construct|site/.test(l)) return 'building';
  if (/supply|procure|chain|vendor|purchas/.test(l)) return 'chain';
  if (/digital|data|dashboard|tech/.test(l)) return 'bars';
  if (/people|team|staff|\bhr\b/.test(l)) return 'people';
  return 'sphere';
}

// ---------- drawing: each point moves from its place in one shape to its place in the next
const VS = `
uniform float uT, uTime, uSize, uPR;
attribute vec3 aB; attribute vec4 aR;
varying float vGlow;
void main(){
  float t = clamp((uT - aR.x * 0.35) / 0.65, 0.0, 1.0);
  t = t * t * (3.0 - 2.0 * t);
  vec3 p = mix(position, aB, t);
  p += (aR.yzw - 0.5) * 1.8 * sin(t * 3.14159);
  p += vec3(sin(uTime * 0.6 + aR.y * 40.0), cos(uTime * 0.5 + aR.z * 40.0), sin(uTime * 0.4 + aR.w * 40.0)) * 0.025;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * uPR * (0.6 + aR.x * 0.9) * (10.0 / -mv.z);
  vGlow = aR.w;
}`;
const FS = `
uniform vec3 uA, uB;
varying float vGlow;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float r = dot(c, c);
  if (r > 0.25) discard;
  gl_FragColor = vec4(mix(uA, uB, step(0.86, vGlow)), smoothstep(0.25, 0.0, r) * 0.9);
}`;

function build(){
  N = SMALL() ? 4000 : 7000;
  const canvas = document.createElement('canvas');
  canvas.className = 'sys3d';
  canvas.setAttribute('aria-hidden', 'true');
  renderer = new THREE.WebGLRenderer({canvas, antialias: false, alpha: true, powerPreference: 'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, 3, 13);
  camera.lookAt(0, -0.2, 0);
  const g = new THREE.BufferGeometry(), rnd = new Float32Array(N * 4);
  for (let i = 0; i < N * 4; i++) rnd[i] = R();
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3));
  g.setAttribute('aB', new THREE.BufferAttribute(new Float32Array(N * 3), 3));
  g.setAttribute('aR', new THREE.BufferAttribute(rnd, 4));
  mat = new THREE.ShaderMaterial({
    vertexShader: VS, fragmentShader: FS, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: {uT: {value: 0}, uTime: {value: 0}, uSize: {value: SMALL() ? 3.2 : 2.9}, uPR: {value: renderer.getPixelRatio()},
      uA: {value: new THREE.Color(0xC98DAD)}, uB: {value: new THREE.Color(0xFFFFFF)}}
  });
  pts = new THREE.Points(g, mat);
  pts.frustumCulled = false;
  scene.add(pts);
  return canvas;
}

function setSeg(k){
  if (k === seg) return;
  seg = k;
  const a = targets[Math.min(k, targets.length - 1)], b = targets[Math.min(k + 1, targets.length - 1)];
  pts.geometry.attributes.position.array.set(a); pts.geometry.attributes.position.needsUpdate = true;
  pts.geometry.attributes.aB.array.set(b); pts.geometry.attributes.aB.needsUpdate = true;
}

function size(){
  if (!host) return;
  const w = host.clientWidth, h = host.clientHeight;
  if (!w || !h) return;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.position.set(0, 3, w / h < 0.9 ? 21 : 13);
  camera.lookAt(0, -0.2, 0);
  camera.updateProjectionMatrix();
}

const clamp = v => Math.max(0, Math.min(1, v));
function frame(now){
  if (!running) return;
  const t = (now - t0) / 1000, n = labels.length;
  if (sec){ const r = sec.getBoundingClientRect(), total = Math.max(1, sec.offsetHeight - innerHeight); prog += (clamp(-r.top / total) - prog) * 0.1; }
  px += (tx - px) * 0.05; py += (ty - py) * 0.05;
  // one stretch of scroll per step: the first 60% changes the shape, the rest holds it to be read
  const p = REDUCE ? 1 : prog, x = Math.min(n - 0.0001, p * n), k = Math.floor(x), f = x - k;
  setSeg(k);
  mat.uniforms.uT.value = REDUCE ? 1 : Math.min(1, f / 0.6);
  mat.uniforms.uTime.value = t;
  pts.rotation.y = (REDUCE ? 0 : Math.sin(t * 0.12) * 0.45) + px * 0.25 - 0.3;
  pts.rotation.x = py * 0.08;
  renderer.render(scene, camera);
  const which = p > 0.985 ? -2 : k;
  if (which !== shown){ shown = which; labels.forEach((l, i) => l.classList.toggle('on', which === -2 || i === which)); sec.classList.toggle('all', which === -2); }
  if (REDUCE){ running = false; return; }
  requestAnimationFrame(frame);
}

function start(){ if (running || !visible || document.hidden) return; running = true; requestAnimationFrame(frame); }
function stop(){ running = false; }

let io = null;
function mount(el){
  if (!el) return;
  if (!renderer){
    try { el.appendChild(build()); } catch (e) { renderer = null; el.closest('.sys').classList.add('nogl'); return; }
    t0 = performance.now();
    addEventListener('resize', size);
    addEventListener('pointermove', e => { tx = e.clientX / innerWidth * 2 - 1; ty = e.clientY / innerHeight * 2 - 1; }, {passive: true});
    document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
  } else {
    el.appendChild(renderer.domElement);
  }
  host = el; sec = el.closest('.sys'); shown = null; seg = -1;
  labels = Array.prototype.slice.call(sec.querySelectorAll('.sys-list li'));
  targets = [SHAPES.cloud(N)].concat(labels.map(l => SHAPES[shapeFor((l.querySelector('b') || l).textContent)](N)));
  sec.classList.add('gl');
  size();
  if (io) io.disconnect();
  io = new IntersectionObserver(es => { visible = es[0].isIntersecting; visible ? (size(), start()) : stop(); }, {rootMargin: '100px'});
  io.observe(sec);
}

window.sys3d = {mount};
if (window._sys3d) mount(window._sys3d);
