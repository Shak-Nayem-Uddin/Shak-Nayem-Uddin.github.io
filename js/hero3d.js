// The opening scene on the home page: three pointed arches in plum glass, nested like a doorway.
// They come in from the dark when the page opens, then turn slowly. The pointer and the scroll
// move them a little. If WebGL is not available the CSS glass shape stays in place instead.
import * as THREE from './three.module.min.js';
import { RoomEnvironment } from './RoomEnvironment.js';

const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
const SMALL = matchMedia('(max-width: 820px)').matches;

let renderer, scene, camera, group, arches = [], host = null, running = false, visible = false;
let t0 = 0, introDone = false, px = 0, py = 0, tx = 0, ty = 0, scrollK = 0;

// a pointed arch (two arcs of radius r meeting at the top), drawn as one U-shaped outline so the
// opening stays open. The apex sits at y = 0 and the sides run down by `legs`.
const W = 10, R = 0.52 * W, T = 0.28, LEGS = 30;
function archShape(w, r, t, legs){
  const rise = Math.sqrt(r * r - (r - w / 2) ** 2);
  const s = new THREE.Shape(), w2 = w - 2 * t, r2 = r - t, rise2 = Math.sqrt(r2 * r2 - (r2 - w2 / 2) ** 2);
  // outer edge: left leg up, over the top, right leg down
  s.moveTo(-w / 2, -rise - legs);
  s.lineTo(-w / 2, -rise);
  s.absarc(-w / 2 + r, -rise, r, Math.PI, Math.PI - Math.acos((r - w / 2) / r), true);
  s.absarc(w / 2 - r, -rise, r, Math.acos((r - w / 2) / r), 0, true);
  s.lineTo(w / 2, -rise - legs);
  // inner edge, back the other way
  s.lineTo(w2 / 2, -rise - legs);
  s.lineTo(w2 / 2, -rise);
  s.absarc(w2 / 2 - r2, -rise, r2, 0, Math.acos((r2 - w2 / 2) / r2), false);
  s.absarc(-w2 / 2 + r2, -rise, r2, Math.PI - Math.acos((r2 - w2 / 2) / r2), Math.PI, false);
  s.lineTo(-w2 / 2, -rise - legs);
  s.closePath();
  return s;
}

function build(){
  const canvas = document.createElement('canvas');
  canvas.className = 'hero3d';
  canvas.setAttribute('aria-hidden', 'true');
  renderer = new THREE.WebGLRenderer({canvas, antialias: true, alpha: true, powerPreference: 'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, SMALL ? 1.5 : 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x120C10, 11, 22);
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;

  camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0, 12);

  group = new THREE.Group();
  scene.add(group);

  // smoked plum glass: dark body, bright clear-coated edges
  const glass = new THREE.MeshPhysicalMaterial({
    color: 0x2C1424, metalness: 0.35, roughness: 0.24, clearcoat: 1, clearcoatRoughness: 0.06,
    sheen: 0.35, sheenColor: new THREE.Color(0xE9C9DA), envMapIntensity: 1.3, transparent: true, opacity: 1
  });
  const geo = new THREE.ExtrudeGeometry(archShape(W, R, T, LEGS), {depth: 0.5, bevelEnabled: true, bevelSize: 0.07, bevelThickness: 0.07, bevelSegments: 5, curveSegments: 64});
  geo.translate(0, 0, -0.25);
  // the same doorway three times, one behind the other, fading into the dark
  // each frame behind is enlarged so it shows just inside the one in front, like the stepped
  // frames of a carved doorway, and the opening stays clear for the text
  [0, -1.2, -2.4].forEach((z, i) => {
    const m = new THREE.Mesh(geo, glass.clone());
    m.userData = {z, i};
    m.position.z = z;
    m.scale.setScalar((12 - z) / 12 * Math.pow(0.955, i));
    group.add(m);
    arches.push(m);
  });
  const glow = new THREE.PointLight(0xD6A9C0, 30, 14, 2);
  glow.position.set(0, -1.5, -4);
  scene.add(glow);
  const key = new THREE.DirectionalLight(0xffffff, 1.1);
  key.position.set(-4, 5, 7);
  scene.add(key);
  // a warm rim from behind picks out the edges of each frame
  const rim = new THREE.DirectionalLight(0xF0C6DA, 2.2);
  rim.position.set(3, 2, -8);
  scene.add(rim);
  return canvas;
}

function size(){
  if (!host) return;
  const w = host.clientWidth, h = host.clientHeight;
  if (!w || !h) return;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  // the front doorway spans most of the width, with its point just under the top of the screen
  const vh = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)), vw = vh * camera.aspect;
  const sc = Math.min(vw * (w < 700 ? 0.97 : 1), vh * 1.9) / W;
  group.scale.setScalar(sc);
  group.position.y = vh / 2 - vh * (w < 700 ? 0.1 : 0.03);
}

const ease = k => 1 - Math.pow(1 - Math.min(1, Math.max(0, k)), 4);

function frame(now){
  if (!running) return;
  const t = (now - t0) / 1000;
  // pointer and scroll follow slowly, so the shapes drift rather than jump
  px += (tx - px) * 0.04; py += (ty - py) * 0.04;
  const r = host.getBoundingClientRect();
  scrollK = Math.max(0, Math.min(1, -r.top / Math.max(1, r.height)));

  arches.forEach(m => {
    const k = introDone ? 1 : ease((t - 0.15 - m.userData.i * 0.22) / 1.9);
    m.position.z = m.userData.z - (1 - k) * (14 + m.userData.i * 4) - scrollK * m.userData.i * 1.6;
    m.material.opacity = k * (1 - m.userData.i * 0.12);
    m.rotation.z = (1 - k) * (m.userData.i % 2 ? 0.35 : -0.35);
  });
  if (!introDone && t > 3) introDone = true;

  const idle = REDUCE ? 0 : t;
  // a slow sway, never far enough to cross the text
  group.rotation.y = Math.sin(idle * 0.14) * 0.07 + px * 0.05 + scrollK * 0.15;
  group.rotation.x = Math.sin(idle * 0.1) * 0.025 - py * 0.03;
  group.position.z = scrollK * 4;
  renderer.domElement.style.opacity = String(1 - scrollK * 0.9);

  renderer.render(scene, camera);
  if (REDUCE && introDone) { running = false; return; }
  requestAnimationFrame(frame);
}

function start(){ if (running || !visible || document.hidden) return; running = true; requestAnimationFrame(frame); }
function stop(){ running = false; }

let io = null;
function mount(el, quiet){
  if (!el) return;
  if (!renderer){
    try { el.appendChild(build()); } catch (e) { renderer = null; el.classList.add('nogl'); return; }
    t0 = performance.now();
    if (REDUCE) introDone = true;
    addEventListener('resize', size);
    addEventListener('pointermove', e => { tx = e.clientX / innerWidth * 2 - 1; ty = e.clientY / innerHeight * 2 - 1; }, {passive: true});
    document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
  } else {
    el.appendChild(renderer.domElement);
    if (quiet) introDone = true;
  }
  host = el;
  el.classList.add('gl');
  size();
  if (io) io.disconnect();
  io = new IntersectionObserver(es => { visible = es[0].isIntersecting; visible ? (size(), start()) : stop(); });
  io.observe(el);
}

window.hero3d = {mount};
if (window._hero3d) mount(window._hero3d.el, window._hero3d.quiet);
