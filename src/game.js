import {
  AIRCRAFT,
  SPACECRAFT,
  vehicleInfo,
  vehicleSilhouette,
} from "./fleet.js";
import { SPACE_MISSIONS, updateSpaceFlight } from "./space.js";
import { UpgradeRenderer } from "./world.js";
import { createCannonBuffers } from "./cannon-audio.js";
import { groundGeometry } from "./scenery.js";
import { MeshDepthMaterial } from "./three.js";
import "./upgrades.css";
import {
  S as fi,
  m as Pe,
  W as mi,
  P as gi,
} from "./vendor/three-renderer-jLOrZHEk.js";
import {
  S as Tt,
  ac as vi,
  c6 as yt,
  ad as bt,
  I as wt,
  ae as xt,
  bZ as Ts,
  C as B,
  V as he,
  c7 as yi,
  f as bi,
  c8 as de,
  v as Ke,
  z as kt,
  G as Mt,
  c9 as ie,
  i as F,
  D as qt,
  ca as St,
  l as wi,
  cb as xi,
  j as J,
  aB as je,
  cc as Ls,
  cd as ge,
  ce as is,
  cf as ki,
  cg as He,
  ch as zs,
  ci as Cs,
  P as Is,
  cj as Ps,
  ck as gt,
  cl as Ue,
  cm as Oe,
  cn as ds,
  co as Mi,
  cp as Kt,
  k as Vt,
  cq as Si,
  aq as Ei,
  bV as Ri,
  cr as Yt,
  cs as Ai,
  B as $i,
  ct as Wt,
  cu as Ti,
  cv as Li,
  cw as _t,
  cx as us,
  by as zi,
  cy as Ci,
  cz as Ii,
} from "./vendor/three-core-DKvSsDks.js";
(function () {
  const e = document.createElement("link").relList;
  if (e && e.supports && e.supports("modulepreload")) return;
  for (const n of document.querySelectorAll('link[rel="modulepreload"]')) t(n);
  new MutationObserver((n) => {
    for (const o of n)
      if (o.type === "childList")
        for (const r of o.addedNodes)
          r.tagName === "LINK" && r.rel === "modulepreload" && t(r);
  }).observe(document, { childList: !0, subtree: !0 });
  function s(n) {
    const o = {};
    return (
      n.integrity && (o.integrity = n.integrity),
      n.referrerPolicy && (o.referrerPolicy = n.referrerPolicy),
      n.crossOrigin === "use-credentials"
        ? (o.credentials = "include")
        : n.crossOrigin === "anonymous"
          ? (o.credentials = "omit")
          : (o.credentials = "same-origin"),
      o
    );
  }
  function t(n) {
    if (n.ep) return;
    n.ep = !0;
    const o = s(n);
    fetch(n.href, o);
  }
})();
import {
  re,
  le,
  dt,
  Pi,
  Oi,
  Fi,
  Di,
  be,
  ae,
  ee,
  ue,
  Gi,
  Ni,
  Bi,
  Os,
  ji,
  Et,
  Fs,
  Fe,
  ps,
  fs,
  Hi,
  ms,
  Ui,
  Lt,
  qi,
  et,
  Ki,
  Vi,
  Rt,
  ce,
  Yi,
  Wi,
  _i,
  Xi,
  Zi,
  Ji,
  gs,
  vs,
  as,
  Ae,
  ys,
  Ot,
  Ds,
  Qi,
  it,
  ea,
  Ve,
  Ye,
  ta,
} from "./simulation.js";
const pe = new Map(),
  Ce = (i, e, s = 0) => {
    let t = Math.imul(i + s * 13, 374761393) ^ Math.imul(e + s * 7, 668265263);
    return (
      (t = Math.imul(t ^ (t >>> 13), 1274126177)),
      ((t ^ (t >>> 16)) >>> 0) / 4294967295
    );
  },
  bs = (i) => i * i * (3 - 2 * i);
function Y(i, e, s = 64, t = 0) {
  const n = Math.floor(i),
    o = Math.floor(e),
    r = bs(i - n),
    a = bs(e - o),
    c = (h, l) => Ce(((h % s) + s) % s, ((l % s) + s) % s, t);
  return (
    (c(n, o) * (1 - r) + c(n + 1, o) * r) * (1 - a) +
    (c(n, o + 1) * (1 - r) + c(n + 1, o + 1) * r) * a
  );
}
function ns(i, e, s) {
  const t = new yt(i, e, s);
  return (
    (t.wrapS = t.wrapT = bt),
    (t.magFilter = wt),
    (t.minFilter = xt),
    (t.generateMipmaps = !0),
    (t.needsUpdate = !0),
    t
  );
}
function sa(i = "azure") {
  if (pe.has(i)) return pe.get(i);
  const e = 256,
    s = new Float32Array(e * e),
    t = new Float32Array(e * e),
    n = { azure: 11, glacier: 31, canyon: 53, caldera: 79 }[i] || 11;
  for (let c = 0; c < e; c++)
    for (let h = 0; h < e; h++) {
      const l = h / e,
        d = c / e,
        u = Y(l * 8, d * 8, 8, n),
        p = Y(l * 96, d * 96, 96, n + 1),
        v = Y(l * 24 + u, d * 24 + u, 24, n + 2),
        w = Y(l * 5, d * 5, 5, n + 3),
        y = Math.abs(Y(l * 16 + u * 2, d * 16, 16, n + 4) - 0.5),
        m = Math.max(0, 1 - y / 0.045),
        b = Math.sin(d * Math.PI * 40 + u * 9) * 0.5 + 0.5;
      ((s[c * e + h] = Math.max(
        0.05,
        Math.min(
          0.98,
          0.28 +
            v * 0.32 +
            p * 0.18 +
            w * 0.24 -
            m * 0.19 +
            (i === "canyon" ? (b - 0.5) * 0.2 : 0),
        ),
      )),
        (t[c * e + h] =
          i === "glacier"
            ? 0.68 + p * 0.24
            : i === "canyon"
              ? 0.5 + p * 0.28
              : i === "caldera"
                ? 0.25 + v * 0.35 + p * 0.2
                : 0.28 + v * 0.35 + p * 0.3));
    }
  const o = new Uint8Array(e * e * 4),
    r = (c, h) => s[((h + e) % e) * e + ((c + e) % e)];
  for (let c = 0; c < e; c++)
    for (let h = 0; h < e; h++) {
      const l = (c * e + h) * 4;
      ((o[l] = r(h, c) * 255),
        (o[l + 1] = 128 + (r(h - 1, c) - r(h + 1, c)) * 240),
        (o[l + 2] = 128 + (r(h, c - 1) - r(h, c + 1)) * 240),
        (o[l + 3] = t[c * e + h] * 255));
    }
  const a = ns(o, e, e);
  return (pe.set(i, a), a);
}
function ia() {
  if (pe.has("waves")) return pe.get("waves");
  const i = 128,
    e = new Float32Array(i * i),
    s = new Uint8Array(i * i * 4);
  for (let o = 0; o < i; o++)
    for (let r = 0; r < i; r++) {
      const a = r / i,
        c = o / i;
      e[o * i + r] =
        Math.sin((a * 3 + c * 7) * Math.PI * 2 + Y(a * 4, c * 4, 4, 6) * 4) *
          0.11 +
        Math.sin((a * 9 - c * 4) * Math.PI * 2) * 0.06 +
        Y(a * 16, c * 16, 16, 9) * 0.46 +
        Y(a * 48, c * 48, 48, 2) * 0.19;
    }
  const t = (o, r) => e[((r + i) % i) * i + ((o + i) % i)];
  for (let o = 0; o < i; o++)
    for (let r = 0; r < i; r++) {
      const a = (o * i + r) * 4;
      ((s[a] = 128 + (t(r - 1, o) - t(r + 1, o)) * 190),
        (s[a + 1] = 128 + (t(r, o - 1) - t(r, o + 1)) * 190),
        (s[a + 2] = Math.max(0, Math.min(255, (t(r, o) + 0.5) * 200))),
        (s[a + 3] = Y(r / 4, o / 4, 32, 33) * 255));
    }
  const n = ns(s, i, i);
  return (pe.set("waves", n), n);
}
function aa() {
  if (pe.has("cloud")) return pe.get("cloud");
  const i = 256,
    e = 128,
    s = new Uint8Array(i * e * 4),
    t = [
      [0.22, 0.42, 0.17, 0.23],
      [0.71, 0.41, 0.19, 0.23],
      [0.39, 0.5, 0.21, 0.31],
      [0.58, 0.56, 0.2, 0.34],
      [0.47, 0.32, 0.3, 0.17],
    ];
  for (let o = 0; o < e; o++)
    for (let r = 0; r < i; r++) {
      const a = r / i,
        c = o / e,
        h = Y(a * 32, c * 32, 64, 42),
        l = (o * i + r) * 4;
      let d = 0,
        u = 0;
      for (const [v, w, y, m] of t) {
        const b = (a - v) / y,
          S = (c - w) / m,
          M = b * b + S * S,
          $ = Math.max(0, 1 - M + (h - 0.5) * 0.12);
        if ($ <= 0) continue;
        const z = Math.min(0.94, $ * 2.3),
          k = Math.sqrt(Math.max(0, 1 - M));
        ((u =
          (0.66 + 0.3 * Math.max(0, -b * 0.35 + S * 0.65 + k * 0.5)) * z +
          u * (1 - z)),
          (d = z + d * (1 - z)));
      }
      const p = d ? u / d : 1;
      ((s[l] = Math.min(255, p * 255)),
        (s[l + 1] = Math.min(255, (p + 0.015) * 255)),
        (s[l + 2] = Math.min(255, (p + 0.035) * 255)),
        (s[l + 3] = d * 236));
    }
  const n = ns(s, i, e);
  return ((n.colorSpace = Tt), (n.wrapS = n.wrapT = vi), pe.set("cloud", n), n);
}
let ut;
const na = Array.from({ length: 256 }, (i, e) =>
  Math.round(
    (e / 255 <= 0.04045
      ? e / 255 / 12.92
      : ((e / 255 + 0.055) / 1.055) ** 2.4) * 255,
  ),
);
function oa(i) {
  const e = i.getContext("2d"),
    s = e.getImageData(0, 0, i.width, i.height);
  for (let n = 0; n < s.data.length; n += 4)
    for (let o = 0; o < 3; o++) s.data[n + o] = na[s.data[n + o]];
  e.putImageData(s, 0, 0);
  const t = new yi(i);
  return (
    (t.colorSpace = bi),
    (t.wrapS = t.wrapT = bt),
    (t.minFilter = xt),
    (t.anisotropy = 1),
    t
  );
}
function Xt(i) {
  const e = document.createElement("canvas");
  return ((e.width = e.height = i), e);
}
function Zt() {
  if (ut) return ut;
  const i = Xt(512),
    e = i.getContext("2d");
  ((e.fillStyle = "#e0e3e3"), e.fillRect(0, 0, 512, 512));
  for (let l = 0; l < 8; l++)
    for (let d = -64; d < 512; d += 128) {
      const u = l * 64,
        p = d + (l % 2) * 64,
        v = 228 + Ce(d, l, 18) * 12;
      ((e.fillStyle = `rgb(${v},${v + 1},${v + 2})`),
        e.fillRect(p + 1, u + 1, 126, 62),
        (e.strokeStyle = "rgba(43,51,56,.23)"),
        (e.lineWidth = 0.7),
        e.strokeRect(p + 0.5, u + 0.5, 128, 64));
      for (let w = 7; w < 128; w += 12)
        ((e.fillStyle = "rgba(42,48,53,.27)"),
          e.fillRect(p + w, u + 3, 1, 1),
          e.fillRect(p + w, u + 60, 1, 1));
      ((e.fillStyle = "rgba(255,255,255,.24)"),
        e.fillRect(p + 2, u + 2, 123, 1),
        l % 3 === 0 &&
          ((e.strokeStyle = "rgba(70,76,80,.16)"),
          e.strokeRect(p + 35, u + 20, 32, 19)));
    }
  for (let l = 0; l < 1300; l++) {
    const d = (l * 97) % 512,
      u = (l * 193) % 512;
    ((e.fillStyle = l % 2 ? "rgba(255,255,255,.07)" : "rgba(54,64,70,.05)"),
      e.fillRect(d, u, 1, 2 + (l % 6)));
  }
  const s = e.getImageData(0, 0, 512, 512).data,
    t = new Uint8Array(256 * 256 * 4),
    n = (l, d) => s[(((d + 512) % 512) * 512 + ((l + 512) % 512)) * 4] / 255;
  for (let l = 0; l < 256; l++)
    for (let d = 0; d < 256; d++) {
      const u = (n(d * 2 - 2, l * 2) - n(d * 2 + 2, l * 2)) * 1.8,
        p = (n(d * 2, l * 2 - 2) - n(d * 2, l * 2 + 2)) * 1.8,
        v = Math.hypot(u, p, 1),
        w = (l * 256 + d) * 4;
      t.set([128 + (u / v) * 127, 128 + (p / v) * 127, 128 + 127 / v, 255], w);
    }
  const o = new yt(t, 256, 256);
  ((o.wrapS = o.wrapT = bt),
    (o.minFilter = xt),
    (o.magFilter = wt),
    (o.generateMipmaps = !0),
    (o.needsUpdate = !0));
  const r = new Uint8Array(16384 * 4);
  for (let l = 0; l < 128; l++)
    for (let d = 0; d < 128; d++) {
      const u = (l * 128 + d) * 4,
        p = 188 + Ce(d, l, 72) * 35;
      r.set([255, p, 255, 255], u);
    }
  const a = new yt(r, 128, 128);
  ((a.wrapS = a.wrapT = bt),
    (a.magFilter = wt),
    (a.minFilter = xt),
    (a.generateMipmaps = !0),
    (a.needsUpdate = !0));
  const c = Array.from({ length: 6 }, (l, d) => {
      const u = Xt(64),
        p = u.getContext("2d"),
        v = p.createLinearGradient(0, 0, 0, 64);
      return (
        v.addColorStop(0, d === 3 ? "#26353e" : "#b6d6e6"),
        v.addColorStop(0.48, "#e3ebdf"),
        v.addColorStop(0.53, "#637c81"),
        v.addColorStop(1, "#26353e"),
        (p.fillStyle = v),
        p.fillRect(0, 0, 64, 64),
        d !== 3 &&
          ((p.fillStyle = "rgba(255,247,218,.45)"), p.fillRect(6, 10, 40, 3)),
        u
      );
    }),
    h = new Ts(c);
  return (
    (h.colorSpace = Tt),
    (h.needsUpdate = !0),
    (ut = { panels: oa(i), panelNormal: o, paintRoughness: a, environment: h }),
    ut
  );
}
function ra(i) {
  const e = new B(i.sky),
    s = new B(i.horizon),
    t = new B(i.ground),
    n = new B(i.sun),
    o = new he(...i.sunDirection).normalize(),
    r = Array.from({ length: 6 }, (c, h) => {
      const l = Xt(64),
        d = l.getContext("2d"),
        u = d.createImageData(64, 64),
        p = new he(),
        v = new B();
      for (let w = 0; w < 64; w++)
        for (let y = 0; y < 64; y++) {
          const m = (y / 63) * 2 - 1,
            b = 1 - (w / 63) * 2;
          (h === 0
            ? p.set(1, b, -m)
            : h === 1
              ? p.set(-1, b, m)
              : h === 2
                ? p.set(m, 1, -b)
                : h === 3
                  ? p.set(m, -1, b)
                  : h === 4
                    ? p.set(m, b, 1)
                    : p.set(-m, b, -1),
            p.normalize(),
            v.copy(s).lerp(p.y > 0 ? e : t, Math.min(1, Math.abs(p.y) * 1.5)));
          const S = Math.pow(Math.max(0, p.dot(o)), 80) * 0.5;
          ((v.r += n.r * S),
            (v.g += n.g * S),
            (v.b += n.b * S),
            v.convertLinearToSRGB(),
            u.data.set(
              [
                Math.min(255, v.r * 255),
                Math.min(255, v.g * 255),
                Math.min(255, v.b * 255),
                255,
              ],
              (w * 64 + y) * 4,
            ));
        }
      return (d.putImageData(u, 0, 0), l);
    }),
    a = new Ts(r);
  return ((a.colorSpace = Tt), (a.needsUpdate = !0), a);
}
function la(i) {
  const e = i.attributes.position,
    s = i.attributes.normal,
    t = [];
  for (let n = 0; n < e.count; n++) {
    const o = Math.abs(s.getX(n)),
      r = Math.abs(s.getY(n)),
      a = Math.abs(s.getZ(n));
    t.push(
      (r >= o && r >= a ? e.getX(n) : o >= a ? e.getZ(n) : e.getX(n)) * 0.17,
      (r >= o && r >= a ? e.getZ(n) : e.getY(n)) * 0.17,
    );
  }
  return (i.setAttribute("uv", new de(t, 2)), i);
}
const zt =
    "vec3 displayColor(vec3 c){c=max(c,vec3(0.));c=(c*(2.51*c+.03))/(c*(2.43*c+.59)+.14);return sqrt(clamp(c,0.,1.));}",
  ca =
    zt +
    `
 uniform vec3 top;uniform vec3 horizon;uniform vec3 sunDirection;uniform vec3 sunColor;
 varying vec3 vSky;varying vec3 vSun;varying vec2 vSunOffset;
 void main(){
  vec3 ray=normalize(position);float mu=max(dot(ray,sunDirection),0.);float glow=mu*mu;glow*=glow;glow*=glow;glow*=glow;
  vSky=displayColor(mix(horizon,top,smoothstep(0.,.44,max(ray.y,0.)))+sunColor*glow*.16);vSun=displayColor(sunColor*4.);
  vec3 east=normalize(cross(sunDirection,vec3(0.,1.,0.))),up=cross(east,sunDirection);
  vSunOffset=vec2(dot(ray,east),dot(ray,up))/max(.0001,dot(ray,sunDirection));
  gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
 }`,
  ha = `varying vec3 vSky;varying vec3 vSun;varying vec2 vSunOffset;
 void main(){float disc=1.-smoothstep(.0042,.0058,length(vSunOffset));gl_FragColor=vec4(mix(vSky,vSun,disc),1.);}`,
  da =
    "varying vec3 vWorld;void main(){vec4 world=modelMatrix*vec4(position,1.);vWorld=world.xyz;gl_Position=projectionMatrix*viewMatrix*world;}",
  ua =
    zt +
    `
varying vec3 vWorld;uniform float time;uniform float distance;uniform vec3 eye;uniform vec3 waterColor;uniform vec3 fogColor;uniform vec3 skyColor;uniform vec3 sunDirection;uniform vec3 sunColor;uniform sampler2D ripple;
void main(){
 vec2 uv=vec2(vWorld.x,vWorld.z-distance)*.016+vec2(time*.008,-time*.005);
 vec4 detail=texture2D(ripple,uv)*.6+texture2D(ripple,uv*1.73+vec2(-time*.011,time*.007))*.4;vec3 view=normalize(eye-vWorld);
 float farFade=1.-smoothstep(250.,2200.,length(eye-vWorld));
 vec3 normal=normalize(vec3((detail.rg-.5)*(.19*farFade+.035),1.).xzy);
 float grazing=1.-max(dot(normal,view),0.);float fresnel=.025+.975*grazing*grazing*grazing*grazing*grazing;
 vec3 reflected=mix(fogColor,skyColor,clamp(reflect(-view,normal).y*.9,0.,1.));
 vec3 color=mix(waterColor*(.72+detail.b*.3),reflected,fresnel*.8);
 float spec=max(dot(normal,normalize(view+sunDirection)),0.);spec*=spec;spec*=spec;spec*=spec;spec*=spec;spec*=spec;spec*=spec;
 color+=sunColor*spec*(.28+detail.a*.45); color+=vec3(.01,.05,.055)*(1.-fresnel)*max(0.,normal.y)*farFade;
 color+=vec3(.035,.045,.045)*smoothstep(.91,.99,detail.b)*farFade;
 float haze=smoothstep(1300.,5200.,length(eye-vWorld));gl_FragColor=vec4(displayColor(mix(color,fogColor,haze)),1.);
}`;
function pa(i, e, s, t) {
  return new Ke({
    toneMapped: !1,
    vertexColors: !0,
    uniforms: {
      map: { value: i },
      worldDistance: e,
      sunDirection: { value: new he(...t.sunDirection).normalize() },
      sunColor: { value: new B(t.sun) },
      fogColor: { value: new B(t.fog) },
      fogDensity: { value: t.density },
    },
    vertexShader:
      zt +
      `uniform float worldDistance;uniform vec3 sunDirection;uniform vec3 sunColor;uniform vec3 fogColor;uniform float fogDensity;attribute float islandZ;attribute float cover;varying float vCover;varying float vFog;varying vec2 vUv;varying vec3 vLand;varying vec3 vHaze;
 void main(){vUv=uv;vCover=cover;vec3 p=position;p.z+=mod(mod(islandZ+worldDistance+3400.,${s}.0)+${s}.0,${s}.0)-3400.;vec4 mv=modelViewMatrix*vec4(p,1.);float direct=max(dot(normal,sunDirection),0.);vec3 ambient=mix(vec3(.29,.33,.34),vec3(.65,.77,.87),normal.y*.5+.5);vLand=displayColor(color*(ambient+sunColor*direct*1.7));vHaze=displayColor(fogColor);vFog=1.-exp(-fogDensity*fogDensity*mv.z*mv.z);gl_Position=projectionMatrix*mv;}`,
    fragmentShader: `uniform sampler2D map;uniform vec3 sunDirection;varying float vCover;varying float vFog;varying vec2 vUv;varying vec3 vLand;varying vec3 vHaze;
 void main(){vec4 surface=texture2D(map,vUv);float grain=mix(surface.r,surface.a,vCover);float relief=dot(surface.gb-vec2(.5),sunDirection.xz)*mix(.55,.13,vCover);vec3 color=vLand*(.77+grain*.39+relief);gl_FragColor=vec4(mix(color,vHaze,vFog),1.);}`,
  });
}
import {
  Ge,
  W,
  Gs,
  Ct,
  De,
  Ns,
  Bs,
  N,
  js,
  os,
  Q,
  we,
  xe,
  fa,
  ma,
} from "./profile.js";
function ga(i, e, s) {
  const t = [],
    n = [],
    o = [],
    r = [];
  for (const l of i) {
    const d = ee + 1,
      u = new Map(),
      p = [],
      v = (y) => ({
        x: ((y % d) / ee - 0.5) * l.width,
        y: l.heights[y],
        z: (Math.floor(y / d) / ue - 0.5) * l.depth,
      }),
      w = (y) => {
        const m = `${Math.round(y.x * 1e3)},${Math.round(y.z * 1e3)}`;
        return (u.has(m) || u.set(m, { ...y, edges: [] }), u.get(m));
      };
    for (let y = 0; y < ue; y++)
      for (let m = 0; m < ee; m++) {
        const b = y * d + m,
          S = b + d,
          M = S + 1,
          $ = b + 1;
        for (const z of [
          [b, S, $],
          [S, M, $],
        ]) {
          const k = z.map(v),
            T = [];
          for (let L = 0; L < 3; L++) {
            const O = k[L],
              j = k[(L + 1) % 3];
            if (O.y > be == j.y > be) continue;
            const _ = (be - O.y) / (j.y - O.y);
            T.push(w({ x: O.x + (j.x - O.x) * _, z: O.z + (j.z - O.z) * _ }));
          }
          if (T.length === 2) {
            const L = { a: T[0], b: T[1], used: !1 };
            (p.push(L), L.a.edges.push(L), L.b.edges.push(L));
          }
        }
      }
    for (const y of p) {
      if (y.used) continue;
      const m = [y.a];
      let b = y.a,
        S = y;
      for (; S; )
        ((S.used = !0),
          (b = S.a === b ? S.b : S.a),
          m.push(b),
          (S = b.edges.find((k) => !k.used)));
      const M = [m[0]];
      for (let k = 1; k < m.length - 1; k++) {
        const T = M.at(-1),
          L = m[k],
          O = m[k + 1],
          j = O.x - T.x,
          _ = O.z - T.z,
          me = Math.max(
            0,
            Math.min(
              1,
              ((L.x - T.x) * j + (L.z - T.z) * _) / (j * j + _ * _ || 1),
            ),
          );
        Math.hypot(L.x - T.x - j * me, L.z - T.z - _ * me) > 1.1 && M.push(L);
      }
      if ((M.push(m.at(-1)), M.length < 3)) continue;
      const $ = t.length / 3;
      let z = 0;
      for (let k = 0; k < M.length; k++) {
        const T = M[k],
          L = M[Math.max(0, k - 1)],
          O = M[Math.min(M.length - 1, k + 1)],
          j = Math.hypot(O.x - L.x, O.z - L.z) || 1,
          _ = -(O.z - L.z) / j,
          me = (O.x - L.x) / j;
        k && (z += Math.hypot(T.x - L.x, T.z - L.z));
        for (const se of [-1, 1]) {
          const oe = T.x + _ * se * 19,
            Re = T.z + me * se * 19;
          (t.push(
            l.x + l.cos * oe + l.sin * Re,
            be + 0.06,
            -l.sin * oe + l.cos * Re,
          ),
            n.push(z / 14, (se + 1) / 2),
            o.push(l.z));
        }
        if (k) {
          const se = $ + (k - 1) * 2,
            oe = $ + k * 2;
          r.push(se, oe, se + 1, oe, oe + 1, se + 1);
        }
      }
    }
  }
  const a = new kt();
  (a.setAttribute("position", new de(t, 3)),
    a.setAttribute("uv", new de(n, 2)),
    a.setAttribute("islandZ", new de(o, 1)),
    a.setIndex(r));
  const c = new Ke({
      toneMapped: !1,
      transparent: !0,
      depthWrite: !1,
      side: qt,
      forceSinglePass: !0,
      uniforms: {
        worldDistance: e,
        time: { value: 0 },
        shallow: { value: new B(s?.shallow || 4368032) },
      },
      vertexShader: `uniform float worldDistance;attribute float islandZ;varying vec2 vUv;varying float vDepth;void main(){vUv=uv;vec3 p=position;p.z+=mod(mod(islandZ+worldDistance+3400.,${ae}.0)+${ae}.0,${ae}.0)-3400.;vec4 mv=modelViewMatrix*vec4(p,1.);vDepth=-mv.z;gl_Position=projectionMatrix*mv;}`,
      fragmentShader:
        zt +
        "uniform float time;uniform vec3 shallow;varying vec2 vUv;varying float vDepth;void main(){float edge=abs(vUv.y*2.-1.);float fade=(1.-edge)*(1.-edge);float wash=.6+.4*sin(vUv.x*3.+time*1.4-edge*22.);float foam=(1.-smoothstep(.01,.12,edge))*wash;float alpha=max(fade*.18,foam*.5)*(1.-smoothstep(600.,2000.,vDepth));if(alpha<.005)discard;gl_FragColor=vec4(displayColor(mix(shallow,vec3(.85,.9,.88),foam*.85)),alpha);}",
    }),
    h = new F(a, c);
  return ((h.frustumCulled = !1), h);
}
class va {
  constructor(e) {
    ((this.samples = 40),
      (this.cursor = 0),
      (this.count = 0),
      (this.lastTime = -1),
      (this.history = new Float32Array(this.samples * 8)));
    const s = new kt();
    ((this.positions = new Float32Array(this.samples * 12)),
      (this.alpha = new Float32Array(this.samples * 4)),
      s.setAttribute("position", new Mt(this.positions, 3).setUsage(ie)),
      s.setAttribute("opacity", new Mt(this.alpha, 1).setUsage(ie)));
    const t = [];
    for (let a = 0; a < this.samples - 1; a++)
      for (let c = 0; c < 2; c++) {
        const h = a * 4 + c * 2,
          l = h + 4;
        t.push(h, l, h + 1, l, l + 1, h + 1);
      }
    (s.setIndex(t),
      (this.trails = new F(
        s,
        new Ke({
          transparent: !0,
          depthWrite: !1,
          side: qt,
          vertexShader:
            "attribute float opacity;varying float alpha;void main(){alpha=opacity;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
          fragmentShader:
            "varying float alpha;void main(){gl_FragColor=vec4(.86,.94,1.,alpha);}",
        }),
      )),
      (this.trails.frustumCulled = !1),
      e.add(this.trails));
    const n = [
        [0, -8.5],
        [0.9, -3],
        [7.1, 2.7],
        [6.5, 4.15],
        [1, 2.3],
        [1, 3.5],
        [3.5, 5.8],
        [3, 6.35],
        [0.5, 5.4],
        [-0.5, 5.4],
        [-3, 6.35],
        [-3.5, 5.8],
        [-1, 3.5],
        [-1, 2.3],
        [-6.5, 4.15],
        [-7.1, 2.7],
        [-0.9, -3],
      ],
      o = new St(n.map(([a, c]) => new wi(a, c))),
      r = new xi(o);
    (r.rotateX(Math.PI / 2),
      (this.shadowBase = r.attributes.position.array.slice()),
      (this.shadow = new F(
        r,
        new J({
          color: 529694,
          transparent: !0,
          opacity: 0.17,
          depthWrite: !1,
          side: qt,
          forceSinglePass: !0,
          polygonOffset: !0,
          polygonOffsetFactor: -1,
        }),
      )),
      (this.shadow.frustumCulled = !1),
      e.add(this.shadow));
  }
  reset() {
    ((this.count = 0),
      (this.cursor = 0),
      (this.lastTime = -1),
      (this.trails.visible = !1),
      (this.shadow.visible = !1));
  }
  update(e, s, t, n = { x: -400, y: 350, z: -800 }) {
    const o = e.player,
      r = e.flight,
      a = e.health > 0;
    if (
      ((e.time < this.lastTime || e.status === "ready") &&
        ((this.count = 0), (this.lastTime = -1)),
      e.status === "playing" && e.time - this.lastTime >= 1 / 30)
    ) {
      const h = this.cursor * 8,
        l = Math.max(
          e.boosting ? 0.12 : 0,
          Math.min(0.45, (r.load - 1.25) * 0.15 + Math.abs(o.rollRate) * 0.04),
        );
      for (let d = 0; d < 2; d++) {
        const u = it(o, d ? 6.8 : -6.8, 0.08, 2.8);
        this.history.set([u.x, u.y, u.z - e.distance], h + d * 3);
      }
      ((this.history[h + 6] = e.time),
        (this.history[h + 7] = l),
        (this.cursor = (this.cursor + 1) % this.samples),
        (this.count = Math.min(this.samples, this.count + 1)),
        (this.lastTime = e.time));
    }
    let c = !1;
    for (let h = 0; h < this.count; h++) {
      const l = ((this.cursor - 1 - h + this.samples) % this.samples) * 8,
        d = e.time - this.history[l + 6],
        u = this.history[l + 7] * Math.max(0, 1 - d / 1.1);
      c ||= u > 0.01;
      for (let p = 0; p < 2; p++)
        for (let v = 0; v < 2; v++) {
          const w = h * 4 + p * 2 + v,
            y = w * 3;
          ((this.positions[y] =
            this.history[l + p * 3] + (v ? 1 : -1) * (0.12 + d * 0.32)),
            (this.positions[y + 1] = this.history[l + p * 3 + 1]),
            (this.positions[y + 2] = this.history[l + p * 3 + 2] + e.distance),
            (this.alpha[w] = u));
        }
    }
    if (
      ((this.trails.visible = a && !t && c && this.count > 1),
      this.trails.visible &&
        (this.trails.geometry.setDrawRange(0, Math.max(0, this.count - 1) * 12),
        (this.trails.geometry.attributes.position.needsUpdate = !0),
        (this.trails.geometry.attributes.opacity.needsUpdate = !0)),
      (this.shadow.visible = a && s !== "low" && e.clearance < 100),
      this.shadow.visible)
    ) {
      const h = this.shadow.geometry.attributes.position;
      for (let l = 0; l < h.count; l++) {
        const d = it(o, this.shadowBase[l * 3], 0, this.shadowBase[l * 3 + 2]);
        let u = d.x,
          p = d.z;
        for (let v = 0; v < 2; v++) {
          const w = Math.max(0, d.y - Fe(u, p, e.distance, e.mission.mapId));
          ((u = d.x + (-w * n.x) / Math.max(0.12, n.y)),
            (p = d.z + (-w * n.z) / Math.max(0.12, n.y)));
        }
        h.setXYZ(l, u, Fe(u, p, e.distance, e.mission.mapId) + 0.12, p);
      }
      ((h.needsUpdate = !0),
        (this.shadow.material.opacity =
          0.2 * Math.max(0, 1 - e.clearance / 130)));
    }
  }
}
function ya(i, e) {
  const s = groundGeometry(i),
    t = 384,
    n = new He({ color: 16777215, vertexColors: true }),
    o = new ge(s, n, t),
    r = new Float32Array(t),
    a = new is(),
    c = new B();
  let h = 0;
  for (const l of Et(i))
    for (let d = 0; d < 72 && h < (l.id + 1) * 24; d++) {
      const u = (Ce(d, l.id, 41) - 0.5) * l.width * 0.78,
        p = (Ce(d, l.id, 77) - 0.5) * l.depth * 0.78,
        v = Fs(l, u, p);
      if (v < 8 || v > 150) continue;
      const w = 1.8 + Ce(d, l.id, 98) * 2.8,
        y = i === "azure",
        m = y ? w * 1.45 : w * 0.65;
      (a.position.set(
        l.x + l.cos * u + l.sin * p,
        v + m * 0.65,
        -l.sin * u + l.cos * p,
      ),
        a.rotation.set(0, d * 1.6, y ? 0 : 0.25),
        a.scale.set(w, m, w * 0.85),
        a.updateMatrix(),
        o.setMatrixAt(h, a.matrix),
        (r[h] = l.z),
        c
          .setHex(
            y
              ? 16777215
              : i === "glacier"
                ? 9016989
                : i === "canyon"
                  ? 9136455
                  : 3554109,
          )
          .multiplyScalar(0.8 + Ce(d, l.id, 19) * 0.4),
        o.setColorAt(h, c),
        h++);
    }
  return (
    s.setAttribute("islandZ", new Ls(r, 1)),
    (n.onBeforeCompile = (l) => {
      ((l.uniforms.worldDistance = e),
        (l.vertexShader =
          `uniform float worldDistance;attribute float islandZ;
` + l.vertexShader),
        (l.vertexShader = l.vertexShader.replace(
          "#include <project_vertex>",
          fi.project_vertex.replace(
            "mvPosition = instanceMatrix * mvPosition;",
            `mvPosition = instanceMatrix * mvPosition;mvPosition.z+=mod(mod(islandZ+worldDistance+3400.,${ae}.0)+${ae}.0,${ae}.0)-3400.;`,
          ),
        )));
    }),
    (n.customProgramCacheKey = () => "wrapped-ground-detail-v1"),
    (o.customDepthMaterial = new MeshDepthMaterial({ depthPacking: 3201 })),
    (o.customDepthMaterial.onBeforeCompile = n.onBeforeCompile),
    (o.customDepthMaterial.customProgramCacheKey = () =>
      "wrapped-scenery-depth-v3"),
    (o.castShadow = o.receiveShadow = true),
    (o.frustumCulled = !1),
    (o.userData.total = h),
    (o.count = h),
    o
  );
}
class ba {
  constructor(e) {
    this.particles = [];
    const s = 64,
      t = new Uint8Array(s * s * 4);
    for (let a = 0; a < s; a++)
      for (let c = 0; c < s; c++) {
        const h = Math.hypot((c / s - 0.5) * 2, (a / s - 0.5) * 2),
          l = Y(c / 9, a / 9, 64, 7) * 0.6 + Y(c / 3, a / 3, 64, 21) * 0.4,
          d = Math.max(0, 1 - h * h) * (0.35 + l * 0.65),
          u = (a * s + c) * 4;
        t.set([255, 255, 255, Math.min(255, d * d * 255)], u);
      }
    const n = new yt(t, s, s);
    ((n.magFilter = n.minFilter = wt), (n.needsUpdate = !0));
    const o = new je(1, 1);
    ((this.opacity = new Float32Array(72)),
      o.setAttribute("particleAlpha", new Ls(this.opacity, 1).setUsage(ie)));
    const r = new Ke({
      transparent: !0,
      depthWrite: !1,
      uniforms: { smoke: { value: n } },
      vertexShader:
        "attribute float particleAlpha;varying vec2 vUv;varying vec3 vTint;varying float vAlpha;void main(){vUv=uv;vTint=instanceColor;vAlpha=particleAlpha;gl_Position=projectionMatrix*modelViewMatrix*instanceMatrix*vec4(position,1.);}",
      fragmentShader:
        "uniform sampler2D smoke;varying vec2 vUv;varying vec3 vTint;varying float vAlpha;void main(){float alpha=texture2D(smoke,vUv).a*vAlpha;if(alpha<.008)discard;gl_FragColor=vec4(vTint,alpha);}",
    });
    ((this.mesh = new ge(o, r, 72)),
      this.mesh.instanceMatrix.setUsage(ie),
      this.mesh.setColorAt(0, new B()),
      (this.mesh.count = 0),
      (this.mesh.frustumCulled = !1),
      e.add(this.mesh),
      (this.dummy = new is()),
      (this.color = new B()));
  }
  burst(e, s, t, n, o = !1) {
    const r = n === "low" ? 24 : n === "high" ? 72 : 48,
      a = n === "low" ? 7 : 12;
    o && (this.particles.length = Math.min(this.particles.length, r - a));
    for (let c = 0; c < a && this.particles.length < r; c++)
      this.particles.push({
        x: e + (Math.random() - 0.5) * 3,
        y: s + (Math.random() - 0.5) * 3,
        z: t + (Math.random() - 0.5) * 3,
        vx: (Math.random() - 0.5) * 9,
        vy: 3 + Math.random() * 7,
        vz: (Math.random() - 0.5) * 9,
        age: 0,
        life: 1.2 + Math.random() * 1.8,
        size: 3 + Math.random() * 4,
        fire: c < 4,
      });
  }
  reset() {
    ((this.particles.length = 0), (this.mesh.count = 0));
  }
  update(e, s, t) {
    const n = e.status === "playing";
    if (e.status !== "paused")
      for (let o = this.particles.length - 1; o >= 0; o--) {
        const r = this.particles[o];
        if (((r.age += s), r.age > r.life)) {
          ((this.particles[o] = this.particles.at(-1)), this.particles.pop());
          continue;
        }
        ((r.x += r.vx * s),
          (r.y += r.vy * s),
          (r.z += (r.vz + (n ? e.speed : 0)) * s));
      }
    this.mesh.count = this.particles.length;
    for (let o = 0; o < this.particles.length; o++) {
      const r = this.particles[o],
        a = r.age / r.life,
        c = r.fire ? Math.max(0, 1 - r.age * 1.8) : 0;
      (this.dummy.position.set(r.x, r.y, r.z),
        this.dummy.quaternion.copy(t.quaternion),
        this.dummy.scale.setScalar(r.size * (1 + r.age * 2)),
        this.dummy.updateMatrix(),
        this.mesh.setMatrixAt(o, this.dummy.matrix),
        this.color.setRGB(0.19 + c * 0.81, 0.2 + c * 0.43, 0.21 - c * 0.13),
        this.mesh.setColorAt(o, this.color),
        (this.opacity[o] =
          Math.min(1, r.age * 18) * Math.max(0, 1 - a) * (0.5 + c * 0.4)));
    }
    this.mesh.count &&
      ((this.mesh.instanceMatrix.needsUpdate = !0),
      (this.mesh.instanceColor.needsUpdate = !0),
      (this.mesh.geometry.attributes.particleAlpha.needsUpdate = !0));
  }
}
class wa {
  constructor(e) {
    ((this.scene = new zs()),
      (this.scene.background = new B(594711)),
      (this.scene.fog = new Cs(661275, 0.009)),
      (this.camera = new Is(39, 1, 0.1, 220)),
      (this.yaw = Math.PI + 0.42),
      this.scene.add(new Ps(13101027, 1518380, 2.2)));
    const s = new gt(16771008, 3.2);
    (s.position.set(8, 22, 10), this.scene.add(s));
    const t = new gt(6411492, 2.6);
    (t.position.set(-16, 8, -20), this.scene.add(t));
    const n = new gt(11060933, 0.9);
    (n.position.set(20, 6, -2), this.scene.add(n));
    const o = new Map(),
      r = {
        floor: new Ue({ color: 1582889, shininess: 65, specular: 4611420 }),
        structure: new He({ color: 1386283 }),
        inset: new He({ color: 2505790 }),
        mark: new J({ color: 9602925 }),
        amber: new J({ color: 16039787, toneMapped: !1 }),
        light: new J({ color: 11987432, toneMapped: !1 }),
      },
      a = (d, u, p = 0, v = 0, w = 0, y = 0) => {
        (d.rotateX(y),
          d.translate(p, v, w),
          o.has(u) || o.set(u, []),
          o.get(u).push(d));
      },
      c = (d, u, p, v, w, y, m) => a(new Vt(w, y, m), d, u, p, v);
    (a(new je(180, 180), "floor", 0, 0, 0, -Math.PI / 2),
      a(new Oe(11, 11.5, 0.3, 64), "inset", 0, 0.15, 0),
      a(new ds(11.6, 11.7, 80), "amber", 0, 0.025, 0, -Math.PI / 2),
      a(new ds(9.9, 10, 64), "mark", 0, 0.315, 0, -Math.PI / 2));
    for (let d = -5; d <= 5; d++)
      (c("inset", d * 12, 0.005, -20, 0.04, 0.01, 150),
        c("inset", 0, 0.005, d * 12, 150, 0.01, 0.04));
    for (const d of [-1, 1]) {
      c("structure", d * 39, 14, -20, 2, 28, 110);
      for (const u of [-60, -35, -10, 15, 40])
        (c("inset", d * 36, 14, u, 2, 28, 1.6),
          c("structure", 0, 28, u, 74, 2, 1.6),
          c("light", d * 25, 26.9, u, 12, 0.12, 0.6));
      c("amber", d * 16, 0.03, 0, 0.12, 0.02, 55);
      for (let u = 0; u < 11; u++)
        c("mark", d * 19, 0.02, u * 4 - 24, 1.5, 0.015, 0.16);
      for (const u of [-36, -25, -14])
        (c("inset", d * 28, 1.8, u, 4, 3.6, 6),
          c("amber", d * 25.98, 2.2, u, 0.02, 0.12, 3.5));
    }
    (c("structure", 0, 13, -66, 78, 26, 2),
      c("inset", 0, 13, -64.9, 48, 22, 0.2));
    for (let d = 0; d < 12; d++)
      c("structure", 0, 2 + d * 1.8, -64.7, 46, 0.08, 0.2);
    (c("amber", -24.5, 13, -64.5, 0.22, 23, 0.2),
      c("amber", 24.5, 13, -64.5, 0.22, 23, 0.2),
      c("light", 0, 24.5, -64.5, 49, 0.25, 0.2));
    for (const [d, u] of o) {
      const p = Pe(u);
      (u.forEach((v) => v.dispose()), this.scene.add(new F(p, r[d])));
    }
    for (let d = 0; d < 3; d++) {
      const u = new F(
        new Mi(1, 40),
        new J({
          color: 133129,
          transparent: !0,
          opacity: 0.09 + d * 0.035,
          depthWrite: !1,
        }),
      );
      ((u.rotation.x = -Math.PI / 2),
        u.scale.set(6.5 - d * 1.5, 8 - d * 1.7, 1),
        u.position.set(0, 0.318 + d * 0.001, 0),
        this.scene.add(u));
    }
    this.jet = new Kt();
    for (const d of e.children) this.jet.add(d.clone());
    (this.jet.position.set(0, 3.1, 0), this.jet.rotation.set(0, this.yaw, 0));
    for (const d of this.jet.children)
      (d.name === "flame" || d.name === "innerFlame") && (d.visible = !1);
    this.gear = new Kt();
    const h = [],
      l = [];
    for (const [d, u] of [
      [0, -4],
      [-1.4, 3],
      [1.4, 3],
    ]) {
      const p = new Oe(0.07, 0.09, 2.3, 6);
      (p.translate(d, -1.5, u), h.push(p));
      const v = new Oe(0.34, 0.34, 0.28, 10);
      (v.rotateZ(Math.PI / 2), v.translate(d, -2.45, u), l.push(v));
    }
    (this.gear.add(
      new F(Pe(h), new He({ color: 10202282 })),
      new F(Pe(l), new He({ color: 725525 })),
    ),
      h.concat(l).forEach((d) => d.dispose()),
      this.jet.add(this.gear),
      this.scene.add(this.jet));
  }
  rotate(e) {
    this.yaw += Math.max(-0.2, Math.min(0.2, e * 0.008));
  }
  resetView() {
    this.yaw = Math.PI + 0.42;
  }
  render(e, s, t, n, o, draw) {
    const r = s / t,
      a = r < 0.85,
      c = !a && t < 600,
      h = a ? Math.max(1, 0.75 / r) : 1;
    ((this.camera.aspect = r),
      this.camera.position.set(19 * h, 10.5 * h, 26 * h),
      this.camera.lookAt(0, 2, 0),
      this.camera.setViewOffset(
        s,
        t,
        s * (a ? 0 : c ? 0.14 : 0.07),
        t * (a ? 0.15 : 0),
        s,
        t,
      ),
      this.camera.updateProjectionMatrix(),
      (this.jet.rotation.y = this.yaw + (o ? 0 : Math.sin(n * 0.15) * 0.018)),
      (draw || e.render.bind(e))(this.scene, this.camera));
  }
}
const At = (i) => W.find((e) => e.id === i) || W[0],
  $e = new he(),
  xa = new B(),
  pt = (i, e, s) => i + (e - i) * (1 - Math.exp(-s));
function Ne(i, e, s = 0.12) {
  const t = new St();
  (i.forEach(([o, r], a) => (a ? t.lineTo(o, r) : t.moveTo(o, r))),
    t.closePath());
  const n = new _t(t, {
    depth: s,
    bevelEnabled: !0,
    bevelSegments: 1,
    steps: 1,
    bevelSize: 0.035,
    bevelThickness: 0.035,
  });
  return (n.rotateX(Math.PI / 2), new F(n, e));
}
function Hs(i = !1, e = "arctic") {
  const s = new Kt(),
    t = i
      ? new Ue({ color: 7172984, shininess: 45 })
      : new Ti({
          color: At(e).body,
          metalness: 0.48,
          roughness: 0.4,
          envMapIntensity: 1.25,
        }),
    n = new Ue({ color: 6449003, shininess: 32, specular: 6120037 }),
    o = new Ue({
      color: i ? 16736844 : At(e).accent,
      emissive: 0,
      shininess: 65,
    }),
    r = i
      ? new Ue({ color: 1320493, shininess: 150 })
      : new Li({
          color: 2308933,
          metalness: 0.45,
          roughness: 0.13,
          clearcoat: 1,
          clearcoatRoughness: 0.08,
          envMapIntensity: 1.7,
        });
  if (!i) {
    const y = Zt();
    ((t.map = y.panels),
      (t.normalMap = y.panelNormal),
      t.normalScale.set(0.24, 0.24),
      (t.roughnessMap = y.paintRoughness));
  }
  const a = [
      [-8.5, 0.025, 0.025],
      [-5.2, 0.55, 0.48],
      [-2.6, 0.86, 0.65],
      [0.8, 1.1, 0.63],
      [3.5, 1.02, 0.43],
      [5.4, 0.78, 0.35],
    ],
    c = [],
    h = [];
  for (const [y, m, b] of a)
    for (let S = 0; S < 12; S++) {
      const M = (S / 12) * Math.PI * 2;
      c.push(Math.cos(M) * m, Math.sin(M) * b, y);
    }
  for (let y = 0; y < a.length - 1; y++)
    for (let m = 0; m < 12; m++) {
      const b = y * 12 + m,
        S = y * 12 + ((m + 1) % 12),
        M = (y + 1) * 12 + m,
        $ = (y + 1) * 12 + ((m + 1) % 12);
      h.push(b, M, S, S, M, $);
    }
  const l = new kt();
  (l.setAttribute("position", new de(c, 3)),
    l.setIndex(h),
    l.computeVertexNormals(),
    s.add(new F(l, t)));
  for (const y of [-1, 1]) {
    const m = Ne(
      [
        [y * 0.7, -3.2],
        [y * 7.1, 2.7],
        [y * 6.5, 4.15],
        [y * 1, 2.3],
      ],
      t,
    );
    s.add(m);
    const b = Ne(
      [
        [y * 5.1, 1.15],
        [y * 5.55, 1.56],
        [y * 5.15, 3.65],
        [y * 4.7, 3.44],
      ],
      o,
      0.018,
    );
    ((b.position.y = 0.07), s.add(b));
    const S = Ne(
      [
        [y * 0.7, 3.5],
        [y * 3.5, 5.8],
        [y * 3.05, 6.35],
        [y * 0.7, 5.35],
      ],
      t,
    );
    ((S.position.y = 0.25), s.add(S));
    const M = new St();
    (M.moveTo(2.1, 0),
      M.lineTo(4.2, 3.1),
      M.lineTo(5.4, 3.1),
      M.lineTo(5.9, 0),
      M.closePath());
    const $ = new _t(M, { depth: 0.11, bevelEnabled: !1 });
    $.rotateY(-Math.PI / 2);
    const z = new F($, t);
    ((z.rotation.z = y * -0.19), z.position.set(y * 0.95, 0.35, 0), s.add(z));
    const k = new St();
    (k.moveTo(4.1, 2.4),
      k.lineTo(4.35, 2.75),
      k.lineTo(5.45, 2.75),
      k.lineTo(5.5, 2.4),
      k.closePath());
    const T = new _t(k, { depth: 0.13, bevelEnabled: !1 });
    T.rotateY(-Math.PI / 2);
    const L = new F(T, o);
    (L.rotation.copy(z.rotation), L.position.copy(z.position), s.add(L));
    const O = Ne(
      [
        [y * 2.3, 2.35],
        [y * 5.8, 3.35],
        [y * 5.55, 3.7],
        [y * 2.1, 2.75],
      ],
      n,
      0.02,
    );
    (O.geometry.translate(0, 0, -2.7),
      O.position.set(0, 0.075, 2.7),
      i || ((O.name = "aileron"), (O.userData.side = y)),
      s.add(O));
    const j = Ne(
      [
        [y * 0.75, -3.1],
        [y * 7.05, 2.75],
        [y * 6.9, 2.87],
        [y * 0.8, -2.8],
      ],
      n,
      0.01,
    );
    ((j.position.y = 0.09), s.add(j));
    const _ = new F(new Oe(0.49, 0.55, 4.8, 16), t);
    ((_.rotation.x = Math.PI / 2),
      _.position.set(y * 0.67, -0.23, 3.2),
      s.add(_));
    const me = new F(new Oe(0.4, 0.49, 0.7, 16, 1, !0), n);
    ((me.rotation.x = Math.PI / 2),
      me.position.set(y * 0.67, -0.23, 5.7),
      s.add(me));
    const se = new F(new Vt(0.6, 0.55, 1.6), n);
    (se.position.set(y * 0.88, -0.32, -0.65), s.add(se));
    const oe = new F(
      new Wt(0.105, 6, 5),
      new J({ color: y < 0 ? 16733518 : 7012279 }),
    );
    (oe.position.set(y * 6.8, 0.08, 2.8), s.add(oe));
    const Re = new F(
      new us(0.34, 3.4, 10, 1, !0),
      new J({
        color: i ? 16745784 : 16758380,
        transparent: !0,
        opacity: 0.8,
        depthWrite: !1,
        blending: zi,
      }),
    );
    ((Re.rotation.x = Math.PI / 2),
      Re.position.set(y * 0.67, -0.23, 7.05),
      (Re.name = "flame"),
      s.add(Re));
    const ht = new F(new us(0.16, 2.2, 8), new J({ color: 11785215 }));
    ((ht.rotation.x = Math.PI / 2),
      ht.position.set(y * 0.67, -0.23, 6.6),
      (ht.name = "innerFlame"),
      s.add(ht));
    const Pt = new F(new Oe(0.08, 0.14, 2.5, 8), t);
    ((Pt.rotation.x = Math.PI / 2),
      Pt.position.set(y * 3.4, -0.44, 1),
      s.add(Pt));
  }
  if (!i) {
    const y = Ne(
      [
        [-0.65, 1.5],
        [0.65, 1.5],
        [0.65, 3.2],
        [-0.65, 3.2],
      ],
      n,
      0.04,
    );
    (y.geometry.translate(0, 0, -1.5),
      y.position.set(0, 0.69, 1.5),
      (y.name = "airbrake"),
      s.add(y));
  }
  const d = new F(new Wt(1, 20, 12), r);
  (d.scale.set(0.58, 0.68, 1.95), d.position.set(0, 0.62, -2.3), s.add(d));
  const u = new F(new Yt(0.58, 0.045, 5, 20, Math.PI), t);
  ((u.rotation.y = Math.PI / 2),
    u.scale.set(1, 1, 1.12),
    u.position.set(0, 0.65, -1.1),
    s.add(u));
  const p = new F(new Vt(0.12, 0.06, 4.3), o);
  (p.position.set(0, 0.66, 1), s.add(p));
  const v = [];
  for (const y of [-1, 1])
    for (const m of [2, 3.7, 5.3]) {
      const b = m * 0.88 - 3.7;
      v.push(y * m, 0.1, b, y * (m - 0.4), 0.1, b + 2.8);
    }
  for (const y of [-1, 1]) v.push(y * 1, 0.65, -2.5, y * 1, 0.52, 3.2);
  const w = new kt();
  (w.setAttribute("position", new de(v, 3)),
    s.add(
      new Ci(w, new Ii({ color: 4215899, transparent: !0, opacity: 0.24 })),
    ));
  for (const y of [t, n, o, r]) {
    const m = s.children.filter(
      (M) =>
        M.isMesh &&
        M.material === y &&
        !["aileron", "airbrake"].includes(M.name),
    );
    if (m.length < 2) continue;
    const b = m.map((M) => {
        M.updateMatrix();
        const $ = M.geometry.index
          ? M.geometry.toNonIndexed()
          : M.geometry.clone();
        return (
          $.deleteAttribute("uv"),
          $.applyMatrix4(M.matrix),
          i ? $ : la($)
        );
      }),
      S = Pe(b);
    if ((b.forEach((M) => M.dispose()), S)) {
      !i &&
        y === t &&
        (S.setIndex(
          Array.from({ length: S.attributes.position.count }, (M, $) => $),
        ),
        S.computeTangents());
      for (const M of m) (s.remove(M), M.geometry.dispose());
      s.add(new F(S, y));
    }
  }
  return ((s.userData.metal = t), (s.userData.accent = o), s);
}
const Be = {
  low: { pixels: 48e4, dpr: 1, clouds: 6, particles: 35 },
  balanced: { pixels: 144e4, dpr: 1.5, clouds: 14, particles: 60 },
  high: { pixels: 384e4, dpr: 2, clouds: 24, particles: 90 },
};
function ka() {
  const i = Hs(!0),
    e = [],
    s = new Set();
  for (const n of i.children) {
    if (!n.isMesh) continue;
    n.updateMatrix();
    const o = (
      n.geometry.index ? n.geometry.toNonIndexed() : n.geometry.clone()
    ).applyMatrix4(n.matrix);
    o.deleteAttribute("uv");
    const r = n.material.color,
      a = new Float32Array(o.attributes.position.count * 3);
    for (let c = 0; c < a.length; c += 3)
      ((a[c] = r.r), (a[c + 1] = r.g), (a[c + 2] = r.b));
    (o.setAttribute("color", new Mt(a, 3)), e.push(o));
  }
  const t = Pe(e);
  e.forEach((n) => n.dispose());
  for (const n of i.children)
    (n.geometry?.dispose(), n.material && s.add(n.material));
  return (s.forEach((n) => n.dispose()), t);
}
class Ma {
  constructor(e, s) {
    ((this.container = e),
      (this.mapId = "azure"),
      (this.settings = s),
      (this.resolutionScale = 1),
      (this.particles = []),
      (this.dummy = new is()),
      (this.direction = new he()),
      (this.zAxis = new he(0, 0, 1)),
      (this.raycaster = new Si()),
      (this.aimPlane = new Ei(new he(0, 0, 1), 240)),
      (this.aimResult = new he()),
      (this.needsRender = !0),
      (this.renderer = new mi({
        antialias: !0,
        alpha: !1,
        powerPreference: "high-performance",
        stencil: !1,
      })),
      this.renderer.setClearColor(10736856),
      (this.renderer.outputColorSpace = Tt),
      (this.renderer.toneMapping = Ri),
      (this.renderer.toneMappingExposure = 0.92),
      e.appendChild(this.renderer.domElement),
      this.renderer.domElement.setAttribute(
        "aria-label",
        "3D flight over the Azure archipelago",
      ),
      (this.scene = new zs()),
      (this.scene.fog = new Cs(10932176, 75e-5)),
      (this.camera = new Is(53, 1, 1, 6e3)),
      this.camera.position.set(-8, 51, 32),
      (this.hemisphere = new Ps(13164018, 3422768, 1.25)),
      this.scene.add(this.hemisphere),
      (this.sunLight = new gt(16772571, 2.5)),
      this.sunLight.position.set(-0.45, 0.38, -0.81),
      this.scene.add(this.sunLight),
      (this.reflections = new Map()),
      (this.pmrem = new gi(this.renderer)),
      (this.hangarEnvironment = this.pmrem.fromCubemap(Zt().environment)),
      this.buildSky(),
      this.buildOcean(),
      this.buildIslands(),
      this.buildClouds(),
      (this.combat = new ba(this.scene)),
      (this.effects = new va(this.scene)),
      (this.jet = Hs(!1, s.finish)),
      this.scene.add(this.jet),
      (this.hangar = new wa(this.jet)),
      (this.hangar.scene.environment = this.hangarEnvironment.texture),
      (this.flames = this.jet.children.filter(
        (r) => r.name === "flame" || r.name === "innerFlame",
      )),
      (this.ailerons = this.jet.children.filter((r) => r.name === "aileron")),
      (this.airbrake = this.jet.children.find((r) => r.name === "airbrake")),
      (this.gates = new ge(
        new Yt(13, 0.105, 4, 40),
        new J({ color: 11849380, toneMapped: !1 }),
        6,
      )),
      this.gates.instanceMatrix.setUsage(ie),
      (this.gates.frustumCulled = !1),
      this.scene.add(this.gates),
      (this.scanBeacon = new ge(
        new Yt(28, 0.22, 4, 40),
        new J({ color: 7857663, toneMapped: !1 }),
        3,
      )),
      this.scanBeacon.instanceMatrix.setUsage(ie),
      (this.scanBeacon.frustumCulled = !1),
      (this.scanBeacon.count = 0),
      this.scene.add(this.scanBeacon),
      (this.enemies = new ge(
        ka(),
        new Ue({ vertexColors: !0, shininess: 50, specular: 7829367 }),
        10,
      )),
      this.enemies.instanceMatrix.setUsage(ie),
      (this.enemies.frustumCulled = !1),
      (this.enemies.count = 0),
      this.scene.add(this.enemies));
    const t = new Oe(0.12, 0.12, 5, 4);
    (t.rotateX(Math.PI / 2),
      (this.projectileBatches = [12517119, 16770721, 16740687].map((r) => {
        const a = new ge(t, new J({ color: r, toneMapped: !1 }), 100);
        return (
          a.instanceMatrix.setUsage(ie),
          (a.frustumCulled = !1),
          (a.count = 0),
          this.scene.add(a),
          a
        );
      })),
      (this.particleMesh = new ge(
        new Ai(0.5, 0),
        new J({ vertexColors: !1 }),
        100,
      )),
      this.particleMesh.instanceMatrix.setUsage(ie),
      (this.particleMesh.frustumCulled = !1),
      (this.particleMesh.count = 0),
      this.scene.add(this.particleMesh),
      (this.particleColors = [16771493, 16750393, 16735017, 9361613].map(
        (r) => new B(r),
      )));
    const n = this.renderer.getContext(),
      o = n.getExtension("WEBGL_debug_renderer_info");
    ((this.softwareRenderer = o
      ? /swiftshader|llvmpipe|software/i.test(
          n.getParameter(o.UNMASKED_RENDERER_WEBGL),
        )
      : !1),
      (this.resizeObserver = new ResizeObserver(() => this.resize())),
      this.resizeObserver.observe(e),
      this.applySettings(s),
      this.resize());
    this.upgrades = new UpgradeRenderer(this, Zt(), At);
  }
  buildSky() {
    const e = new Ke({
      toneMapped: !1,
      side: $i,
      depthWrite: !1,
      uniforms: {
        top: { value: new B(2255276) },
        horizon: { value: new B(13097189) },
        sunDirection: { value: new he(-0.45, 0.38, -0.81).normalize() },
        sunColor: { value: new B(16772571) },
      },
      vertexShader: ca,
      fragmentShader: ha,
    });
    ((this.sky = new F(new Wt(5500, 32, 20), e)),
      (this.sky.renderOrder = 20),
      this.scene.add(this.sky));
  }
  buildOcean() {
    ((this.ocean = new F(
      new je(16e3, 16e3),
      new Ke({
        toneMapped: !1,
        uniforms: {
          time: { value: 0 },
          distance: { value: 0 },
          eye: { value: this.camera.position },
          waterColor: { value: new B(474201) },
          fogColor: { value: new B(10270925) },
          skyColor: { value: new B(2255276) },
          sunDirection: { value: this.sunLight.position },
          sunColor: { value: this.sunLight.color },
          ripple: { value: ia() },
        },
        vertexShader: da,
        fragmentShader: ua,
      }),
    )),
      (this.ocean.renderOrder = 10),
      (this.ocean.rotation.x = -Math.PI / 2),
      (this.ocean.position.y = be),
      this.scene.add(this.ocean));
  }
  buildIslands() {
    const e = [],
      s = Ye(this.mapId),
      t = s.land.map((r) => new B(r));
    for (const r of Et(this.mapId)) {
      const a = new je(r.width, r.depth, ee, ue);
      a.rotateX(-Math.PI / 2);
      const c = a.attributes.position,
        h = [],
        l = new Float32Array(c.count);
      for (let u = 0; u < c.count; u++) {
        const p = c.getX(u),
          v = c.getZ(u),
          w = r.heights[u];
        c.setY(u, w);
        const y = w / r.height,
          m = t[0].clone().lerp(t[1], Math.min(1, Math.max(0, w / 12)));
        (y > 0.25 && m.lerp(t[2], Math.min(1, (y - 0.25) * 2)),
          y > 0.6 && m.lerp(t[3], Math.min(1, (y - 0.6) * 3)),
          m.multiplyScalar(
            0.8 + Y(p * 0.018 + 31, v * 0.018 + 41, 64, r.id) * 0.32,
          ),
          h.push(m.r, m.g, m.b),
          (l[u] = r.z),
          a.attributes.uv.setXY(u, (p + r.x) * 0.045, (v + r.z) * 0.045));
      }
      a.computeVertexNormals();
      const d = a.attributes.normal;
      for (let u = 0; u < c.count; u++) {
        const p = Math.max(0, Math.min(1, (0.9 - d.getY(u)) * 2.1)),
          v = new B().fromArray(h, u * 3),
          w = t[this.mapId === "glacier" ? 1 : 2];
        (v.lerp(w, p * 0.7),
          c.getY(u) < 2 && v.multiplyScalar(0.7),
          v.toArray(h, u * 3));
      }
      (a.setAttribute(
        "cover",
        new de(
          Array.from({ length: c.count }, (u, p) =>
            Math.max(0, Math.min(1, (d.getY(p) - 0.48) * 2)),
          ),
          1,
        ),
      ),
        a.setAttribute("color", new de(h, 3)),
        a.setAttribute("islandZ", new Mt(l, 1)),
        a.computeVertexNormals(),
        a.rotateY(r.angle),
        a.translate(r.x, 0, 0));
      for (let u = 0; u < c.count; u++)
        a.attributes.uv.setXY(
          u,
          c.getX(u) * 0.033,
          (c.getZ(u) + r.z + c.getY(u) * 1.5) * 0.033,
        );
      e.push(a);
    }
    this.worldDistance = { value: 0 };
    const n = pa(sa(this.mapId), this.worldDistance, ae, s);
    ((this.terrain = new F(Pe(e), n)),
      (this.terrain.frustumCulled = !1),
      this.scene.add(this.terrain),
      (this.shoreline = ga(Et(this.mapId), this.worldDistance, s)),
      this.scene.add(this.shoreline),
      (this.detailMesh = ya(this.mapId, this.worldDistance)),
      (this.detailMesh.count =
        this.settings.quality === "low"
          ? 0
          : Math.min(
              this.detailMesh.userData.total,
              this.settings.quality === "high" ? 256 : 160,
            )),
      this.scene.add(this.detailMesh),
      e.forEach((r) => r.dispose()));
    const o = [];
    for (let r = 0; r < 3; r++) {
      const a = new je(6700, 1100, 192, 24);
      a.rotateX(-Math.PI / 2);
      const c = a.attributes.position,
        h = [];
      for (let l = 0; l < c.count; l++) {
        const d = c.getX(l),
          u = c.getZ(l),
          p = Y(d * 0.002 + 15, r * 3, 64, 17),
          v = Y(d * 0.009 + 21, r * 7, 64, 39),
          w =
            this.mapId === "glacier"
              ? 700
              : this.mapId === "canyon"
                ? 360
                : 470;
        let y =
          (w * (0.32 + p * 0.8) + v * 140) * Math.max(0, 1 - Math.abs(u) / 600);
        (this.mapId === "canyon" && (y = Math.min(y, w * 0.8)),
          c.setY(l, y - 45));
        const m = t[2].clone().lerp(new B(s.fog), 0.2 + r * 0.2);
        (this.mapId === "glacier" && y > 400 && m.lerp(t[3], 0.65),
          h.push(m.r, m.g, m.b));
      }
      (a.setAttribute("color", new de(h, 3)),
        a.computeVertexNormals(),
        a.translate(0, 0, -3400 - r * 650),
        o.push(a));
    }
    ((this.peaks = new F(Pe(o), new He({ vertexColors: !0 }))),
      this.scene.add(this.peaks),
      o.forEach((r) => r.dispose()));
  }
  buildClouds() {
    ((this.clouds = []),
      (this.cloudMesh = new ge(
        new je(1, 1),
        new J({
          map: aa(),
          color: 16777215,
          transparent: !0,
          depthWrite: !1,
          alphaTest: 0.04,
          fog: !0,
        }),
        24,
      )),
      this.cloudMesh.instanceMatrix.setUsage(ie),
      (this.cloudMesh.frustumCulled = !1),
      this.scene.add(this.cloudMesh));
    for (let e = 0; e < 24; e++)
      this.clouds.push({
        x: Math.sin(e * 2.4) * 1600,
        y: 420 + (e % 4) * 95,
        z: -1300 - ((e * 307) % 2700),
        width: 500 + (e % 3) * 120,
        height: 150 + (e % 3) * 35,
      });
  }
  resize() {
    const e = this.container.clientWidth,
      s = this.container.clientHeight;
    if (!e || !s) return;
    ((this.viewWidth = e), (this.viewHeight = s));
    const t = Be[this.settings.quality] || Be.low,
      n =
        Math.min(
          window.devicePixelRatio || 1,
          t.dpr,
          Math.sqrt(t.pixels / (e * s)),
        ) * this.resolutionScale;
    (this.renderer.setPixelRatio(n),
      this.renderer.setSize(e, s, !1),
      (this.camera.aspect = e / s),
      this.camera.updateProjectionMatrix(),
      (this.needsRender = !0));
  }
  adapt(e) {
    if (this.settings.adaptiveResolution !== !0) {
      ((this.fastSamples = 0),
        this.resolutionScale !== 1 &&
          ((this.resolutionScale = 1), this.resize()));
      return;
    }
    e < 52 && this.resolutionScale > 0.5
      ? ((this.resolutionScale = Math.max(
          0.5,
          this.resolutionScale * (e < 28 ? 0.72 : 0.86),
        )),
        this.resize(),
        (this.fastSamples = 0))
      : e > 58
        ? ((this.fastSamples = (this.fastSamples || 0) + 1),
          this.fastSamples >= 18 &&
            this.resolutionScale < 1 &&
            ((this.resolutionScale = Math.min(1, this.resolutionScale + 0.05)),
            this.resize(),
            (this.fastSamples = 0)))
        : (this.fastSamples = 0);
  }
  applySettings(e) {
    this.upgrades?.configure(e);
    const s =
      this.settings?.quality !== e.quality ||
      this.settings?.adaptiveResolution !== e.adaptiveResolution;
    ((this.settings = { ...e }),
      (s || e.adaptiveResolution !== !0) &&
        ((this.resolutionScale = 1), (this.fastSamples = 0)));
    const t = this.jet.userData.metal,
      n = e.quality === "high" ? Zt().panelNormal : null;
    (t.normalMap !== n && ((t.normalMap = n), (t.needsUpdate = !0)),
      this.jet.userData.metal.color.set(At(e.finish).body),
      this.jet.userData.accent.color.set(At(e.finish).accent),
      (this.detailMesh.count =
        e.quality === "low"
          ? 0
          : Math.min(
              this.detailMesh.userData.total,
              e.quality === "high" ? 256 : 160,
            )),
      (this.cloudMesh.count = (Be[e.quality] || Be.low).clouds),
      this.resize());
  }
  setPalette(e, s = "azure") {
    const t = Ye(s),
      n = e === "sunset" && t.id === "azure";
    if (this.mapId !== t.id) {
      for (const c of [
        this.terrain,
        this.peaks,
        this.shoreline,
        this.detailMesh,
      ])
        c &&
          (this.scene.remove(c),
          c.geometry.dispose(),
          c.material.dispose(),
          c.customDepthMaterial?.dispose());
      ((this.mapId = t.id), this.buildIslands());
    }
    const o = n ? 5006729 : t.sky,
      r = n ? 14464413 : t.horizon;
    (this.sky.material.uniforms.top.value.setHex(o),
      this.sky.material.uniforms.horizon.value.setHex(r),
      this.sunLight.color.setHex(n ? 16761751 : t.sun),
      this.sunLight.position.set(...t.sunDirection).normalize(),
      n &&
        ((this.sunLight.position.y = 0.18), this.sunLight.position.normalize()),
      this.sky.material.uniforms.sunDirection.value
        .copy(this.sunLight.position)
        .normalize(),
      this.sky.material.uniforms.sunColor.value.copy(this.sunLight.color),
      this.hemisphere.groundColor.setHex(t.ground),
      this.scene.fog.color.setHex(t.fog),
      (this.scene.fog.density = t.density),
      this.ocean.material.uniforms.waterColor.value.setHex(t.water),
      this.ocean.material.uniforms.fogColor.value.setHex(t.fog),
      this.ocean.material.uniforms.skyColor.value.setHex(o),
      this.cloudMesh.material.color.setHex(
        this.mapId === "caldera" ? 16766653 : 16777215,
      ),
      this.terrain.material.uniforms.sunDirection.value.copy(
        this.sky.material.uniforms.sunDirection.value,
      ),
      this.terrain.material.uniforms.sunColor.value.copy(this.sunLight.color));
    const a = t.id + (n ? "-sunset" : "");
    if (!this.reflections.has(a)) {
      const c = ra({
        ...t,
        sky: o,
        horizon: r,
        sun: this.sunLight.color.getHex(),
        sunDirection: this.sunLight.position.toArray(),
      });
      (this.reflections.set(a, this.pmrem.fromCubemap(c)), c.dispose());
    }
    ((this.scene.environment = this.reflections.get(a).texture),
      this.renderer.domElement.setAttribute(
        "aria-label",
        `3D flight over ${t.name}`,
      ),
      (this.needsRender = !0));
  }
  burst(e, s, t, n = 22, o = !1, r = !1) {
    !o &&
      n >= 22 &&
      (this.combat.burst(e, s, t, this.settings.quality, r),
      (n = Math.ceil(n * 0.4)));
    const a = (Be[this.settings.quality] || Be.low).particles;
    r &&
      (this.particles.length = Math.min(
        this.particles.length,
        a - Math.min(n, Math.ceil(a * 0.65)),
      ));
    for (let c = 0; c < n && this.particles.length < a; c++)
      this.particles.push({
        x: e,
        y: s,
        z: t,
        vx: (Math.random() - 0.5) * (r ? 45 : 30),
        vy: (Math.random() - 0.3) * 30,
        vz: (Math.random() - 0.5) * 30,
        life: 0.6 + Math.random() * 0.65,
        color: o ? 3 : c % 3,
        size: o ? 0.65 : r ? 0.55 : 0.35,
      });
  }
  reset() {
    (this.combat.reset(),
      this.effects.reset(),
      (this.enemies.count = 0),
      (this.scanBeacon.count = 0),
      this.projectileBatches.forEach((e) => (e.count = 0)),
      (this.particles.length = 0),
      (this.particleMesh.count = 0),
      (this.needsRender = !0));
  }
  render(e, s, t, n = !1, o = !1) {
    this.upgrades?.prepare(e, n);
    if (((this.lastScene = n ? "hangar" : "flight"), n)) {
      (this.hangar.render(
        this.renderer,
        this.viewWidth,
        this.viewHeight,
        t,
        this.settings.reduceMotion,
        (scene, camera) => this.upgrades.draw(scene, camera, e, true),
      ),
        (this.frameNumber = (this.frameNumber || 0) + 1),
        (this.needsRender = !1));
      return;
    }
    const r = e.status === "playing",
      a = e.player,
      c = n ? t * 14 : e.distance,
      h = this.dummy;
    ((this.lastPlayerX = a.x),
      (this.lastPlayerY = a.y),
      (this.worldDistance.value = c),
      (this.ocean.material.uniforms.time.value = e.time),
      (this.ocean.material.uniforms.distance.value = c),
      (this.ocean.position.z = this.camera.position.z - 3e3),
      this.jet.position.set(a.x, a.y + (n ? Math.sin(t * 0.6) * 0.35 : 0), 0),
      this.jet.rotation.set(
        a.pitch,
        a.yaw || 0,
        a.bank + (a.roll || 0) + (n ? Math.sin(t * 0.22) * 0.06 : 0),
      ),
      (this.jet.visible = !o && e.health > 0));
    const l = Math.max(0, (e.flight.thrust - 12.15) / 32);
    for (const m of this.flames)
      ((m.scale.y = (0.2 + l * 2.5) * (1 + Math.sin(t * 51) * 0.07)),
        m.name === "flame" && (m.material.opacity = 0.18 + l * 0.48));
    for (const m of this.ailerons)
      m.rotation.x =
        m.userData.side * (a.rollRate * 0.12 + a.bank * 0.35) - a.pitch * 0.25;
    ((this.airbrake.rotation.x = -e.flight.airbrake * 0.95),
      (this.shoreline.material.uniforms.time.value = e.time),
      this.effects.update(e, this.settings.quality, o, this.sunLight.position));
    const d =
        r && e.invincible > 0.45 && !this.settings.reduceMotion
          ? Math.sin(t * 90) * 0.025
          : 0,
      u = this.camera.aspect < 1.2;
    o
      ? (this.camera.position.set(a.x, a.y + 1.8, -6),
        this.camera.lookAt(a.x, a.y + 1.8, -240))
      : n
        ? ((this.camera.position.x = pt(
            this.camera.position.x,
            a.x + (u ? -2.5 : -8),
            s * 3,
          )),
          (this.camera.position.y = pt(
            this.camera.position.y,
            a.y + 13,
            s * 3,
          )),
          (this.camera.position.z = pt(
            this.camera.position.z,
            u ? 39 : 32,
            s * 3,
          )),
          this.camera.lookAt(a.x + (u ? -5.5 : -14), a.y - 3, -100))
        : (this.camera.position.set(a.x + d, a.y + 8, 37),
          this.camera.lookAt(a.x, a.y + 3, -180));
    const p = e.boosting && !this.settings.reduceMotion ? 58 : 53,
      v = pt(this.camera.fov, p, s * 3);
    (Math.abs(v - this.camera.fov) > 0.001 &&
      ((this.camera.fov = v), this.camera.updateProjectionMatrix()),
      this.camera.updateMatrixWorld(),
      this.combat.update(e, s, this.camera));
    for (let m = 0; m < this.cloudMesh.count; m++) {
      const b = this.clouds[m];
      (h.position.set(
        b.x,
        b.y,
        ((((b.z + c * 0.4 + 3500) % 4e3) + 4e3) % 4e3) - 3500,
      ),
        h.quaternion.copy(this.camera.quaternion),
        h.scale.set(b.width, b.height, 1),
        h.updateMatrix(),
        this.cloudMesh.setMatrixAt(m, h.matrix));
    }
    ((this.cloudMesh.instanceMatrix.needsUpdate = !0), h.scale.set(1, 1, 1));
    let w = 0;
    h.scale.setScalar((e.mission.gateRadius || 12.8) / 12.8);
    for (const m of e.rings)
      m.active !== !1 &&
        (h.position.set(m.x, m.y, m.z),
        h.rotation.set(0, 0, t * 0.06),
        h.updateMatrix(),
        this.gates.setMatrixAt(w++, h.matrix));
    ((this.gates.count = w),
      (this.gates.instanceMatrix.needsUpdate = !0),
      h.scale.set(1, 1, 1),
      (this.scanBeacon.count =
        e.scan && e.stageScans < (e.stage?.scans || 0) ? 3 : 0));
    for (let m = 0; m < this.scanBeacon.count; m++)
      (h.position.set(e.scan.x, e.scan.y, e.scan.z + (m - 1) * 200),
        h.rotation.set(0, 0, 0),
        h.updateMatrix(),
        this.scanBeacon.setMatrixAt(m, h.matrix));
    (this.scanBeacon.count && (this.scanBeacon.instanceMatrix.needsUpdate = !0),
      (this.enemies.count = e.enemies.length));
    for (let m = 0; m < e.enemies.length; m++) {
      const b = e.enemies[m];
      (h.position.set(b.x, b.y, b.z),
        h.rotation.set(
          b.ai ? b.pitch : 0,
          b.ai ? b.yaw : Math.PI,
          b.ai
            ? b.bank
            : Math.sin(e.time * (b.frequency || 1) + b.phase) * 0.25,
        ),
        h.updateMatrix(),
        this.enemies.setMatrixAt(m, h.matrix),
        this.enemies.setColorAt(m, xa.setHex(b.ace ? 16765329 : 16777215)));
    }
    ((this.enemies.instanceMatrix.needsUpdate = !0),
      this.enemies.count && (this.enemies.instanceColor.needsUpdate = !0));
    const y = [0, 0, 0];
    for (const m of e.bullets) {
      const b = m.missile ? 1 : 0;
      (h.position.set(m.x, m.y, m.z),
        h.quaternion.setFromUnitVectors(
          this.zAxis,
          this.direction.set(m.vx, m.vy, m.vz).normalize(),
        ),
        h.scale.setScalar(m.missile ? 1.8 : 1),
        h.updateMatrix(),
        this.projectileBatches[b].setMatrixAt(y[b]++, h.matrix));
    }
    for (const m of e.hostileBullets)
      (h.position.set(m.x, m.y, m.z),
        h.quaternion.setFromUnitVectors(
          this.zAxis,
          this.direction.set(m.vx, m.vy, m.vz).normalize(),
        ),
        h.scale.setScalar(1),
        h.updateMatrix(),
        this.projectileBatches[2].setMatrixAt(y[2]++, h.matrix));
    for (let m = 0; m < 3; m++)
      ((this.projectileBatches[m].count = y[m]),
        y[m] && (this.projectileBatches[m].instanceMatrix.needsUpdate = !0));
    if (e.status !== "paused")
      for (let m = this.particles.length - 1; m >= 0; m--) {
        const b = this.particles[m];
        if (((b.life -= s), b.life <= 0)) {
          ((this.particles[m] = this.particles[this.particles.length - 1]),
            this.particles.pop());
          continue;
        }
        ((b.x += b.vx * s),
          (b.y += b.vy * s),
          (b.z += (b.vz + (r ? e.speed : 0)) * s));
      }
    (h.quaternion.identity(),
      (this.particleMesh.count = this.particles.length));
    for (let m = 0; m < this.particles.length; m++) {
      const b = this.particles[m];
      (h.position.set(b.x, b.y, b.z),
        h.scale.setScalar(b.life * b.size),
        h.updateMatrix(),
        this.particleMesh.setMatrixAt(m, h.matrix),
        this.particleMesh.setColorAt(m, this.particleColors[b.color]));
    }
    (this.particles.length &&
      ((this.particleMesh.instanceMatrix.needsUpdate = !0),
      (this.particleMesh.instanceColor.needsUpdate = !0)),
      this.upgrades?.update(e, o, t),
      this.upgrades.draw(this.scene, this.camera, e),
      (this.frameNumber = (this.frameNumber || 0) + 1),
      (this.needsRender = !1));
  }
  aimAt(e, s) {
    return (
      this.raycaster.setFromCamera({ x: e, y: s }, this.camera),
      this.raycaster.ray.intersectPlane(this.aimPlane, this.aimResult)
    );
  }
  project(e, s, t) {
    return (
      $e.set(e, s, t).project(this.camera),
      {
        x: ($e.x * 0.5 + 0.5) * this.viewWidth,
        y: (-0.5 * $e.y + 0.5) * this.viewHeight,
        visible:
          $e.z < 1 &&
          $e.z > -1 &&
          Math.abs($e.x) < 0.96 &&
          Math.abs($e.y) < 0.91,
      }
    );
  }
}
function rs(i) {
  return () => (
    (i = (Math.imul(i, 1664525) + 1013904223) >>> 0),
    i / 2147483648 - 1
  );
}
function Sa(i, e = 0.92) {
  let s = 0;
  for (const t of i) s = Math.max(s, Math.abs(t));
  for (let t = 0; t < i.length; t++) i[t] *= e / (s || 1);
}
function Ea(i) {
  const e = i.sampleRate,
    s = {};
  for (const [t, n, o] of [
    ["explosion", 1.65, 8721],
    ["missile", 0.75, 391],
    ["impact", 0.12, 617],
  ]) {
    const r = i.createBuffer(1, Math.ceil(e * n), e),
      a = r.getChannelData(0),
      c = rs(o);
    let h = 0,
      l = 0,
      d = 0,
      u = 0;
    for (let p = 0; p < a.length; p++) {
      const v = p / e,
        w = c();
      ((h += (w - h) * (t === "impact" ? 0.48 : 0.07)), (l += (h - l) * 0.012));
      let y;
      if (t === "explosion") {
        const m = (1 - v / 0.045) * Math.exp(-v / 0.045),
          b = (w - h) * Math.exp(-v * 60) * 0.48,
          S =
            (h * 2.7 + l * 4 + Math.sin(2 * Math.PI * 47 * v) * 0.12) *
            Math.exp(-v * 4.8),
          M =
            (w - h) *
            (0.12 * Math.exp(-Math.abs(v - 0.085) * 45) +
              0.07 * Math.exp(-Math.abs(v - 0.23) * 26));
        y = m * 0.42 + b + S + M;
      } else if (t === "missile")
        y =
          (h * 2.1 + (w - h) * 0.14) *
            Math.sin(Math.PI * Math.min(1, v / n)) ** 0.65 *
            0.55 +
          (w - h) * Math.exp(-v * 65) * 0.4 +
          l * 0.8 * Math.exp(-v * 4);
      else {
        y = (w - h) * Math.exp(-v * 90) * 0.55;
        for (const [m, b] of [
          [730, 0.16],
          [1469, 0.1],
          [2813, 0.08],
          [4379, 0.04],
        ])
          y +=
            Math.sin(v * Math.PI * 2 * m) * Math.exp(-v * (40 + m * 0.008)) * b;
      }
      ((u = y - d + 0.995 * u),
        (d = y),
        (a[p] =
          Math.tanh(u * 1.6) *
          (1 - Math.exp(-v * 4200)) *
          Math.min(1, (a.length - 1 - p) / (e * 0.025))));
    }
    (Sa(a), (s[t] = r));
  }
  return s;
}
function Ra(i) {
  const e = i.sampleRate,
    s = i.createBuffer(2, e * 3, e);
  for (let t = 0; t < 2; t++) {
    const n = s.getChannelData(t),
      o = rs(907 + t * 17);
    let r = 0,
      a = 0;
    for (let h = 0; h < n.length; h++) {
      const l = h / e,
        d = o();
      ((r += (d - r) * 0.045), (a += (r - a) * 0.004));
      const u =
        0.8 +
        0.15 * Math.sin(l * Math.PI * 2 * 27) +
        0.05 * Math.sin(l * Math.PI * 2 * 43);
      n[h] = Math.tanh((r * 2 + a * 3.2 + d * 0.09) * u) * 0.7;
    }
    const c = Math.min(2048, Math.floor(e * 0.04));
    for (let h = 0; h < c; h++) {
      const l = h / (c - 1);
      n[n.length - c + h] = n[n.length - c + h] * (1 - l) + n[h] * l;
    }
  }
  return s;
}
function Aa(i) {
  const e = i.sampleRate,
    s = i.createBuffer(2, Math.ceil(e * 0.65), e);
  for (let t = 0; t < 2; t++) {
    const n = s.getChannelData(t),
      o = rs(114 + t * 97);
    let r = 0;
    for (let a = 0; a < n.length; a++) {
      const c = a / e;
      ((r += (o() - r) * 0.25),
        (n[a] = c < 0.028 ? 0 : r * Math.exp(-c * 12) * 0.15));
    }
    for (const [a, c] of [
      [0.071, 0.18],
      [0.139, 0.1],
      [0.237, 0.05],
    ])
      n[Math.round((a + t * 0.005) * e)] += c;
  }
  return s;
}
const $a = 50 * 1024 * 1024,
  Ta = ["lobby", "match"];
class La {
  async open() {
    if (!globalThis.indexedDB)
      throw new Error("This browser cannot retain music files.");
    return (
      this.connection ||
        (this.connection = new Promise((e, s) => {
          const t = indexedDB.open("skychrome-music-v1", 1);
          ((t.onupgradeneeded = () => {
            t.result.objectStoreNames.contains("tracks") ||
              t.result.createObjectStore("tracks", { keyPath: "slot" });
          }),
            (t.onsuccess = () => e(t.result)),
            (t.onerror = () => s(t.error)),
            (t.onblocked = () =>
              s(
                new Error("Close other game tabs and retry saving your music."),
              )));
        }).catch((e) => {
          throw ((this.connection = null), e);
        })),
      this.connection
    );
  }
  async read(e) {
    const s = await this.open();
    return new Promise((t, n) => {
      const o = s.transaction("tracks").objectStore("tracks").get(e);
      ((o.onsuccess = () => t(o.result || null)),
        (o.onerror = () => n(o.error)));
    });
  }
  async write(e, s) {
    if (!Ta.includes(e)) throw new Error("Unknown music slot.");
    const t = await this.open();
    return new Promise((n, o) => {
      const r = t.transaction("tracks", "readwrite");
      (r
        .objectStore("tracks")
        .put({ slot: e, blob: s, name: s.name.slice(0, 120), type: s.type }),
        (r.oncomplete = () => n()),
        (r.onerror = () => o(r.error)),
        (r.onabort = () =>
          o(r.error || new Error("Music could not be saved."))));
    });
  }
  async remove(e) {
    const s = await this.open();
    return new Promise((t, n) => {
      const o = s.transaction("tracks", "readwrite");
      (o.objectStore("tracks").delete(e),
        (o.oncomplete = () => t()),
        (o.onerror = () => n(o.error)),
        (o.onabort = () => n(o.error)));
    });
  }
}
async function za(i) {
  if (!i || i.size === 0)
    throw new Error("Choose an audio file that contains music.");
  if (i.size > $a) throw new Error("Choose a music file under 50 MB.");
  if (
    !/\.(mp3|wav|ogg|oga|m4a|aac|flac|webm|opus)$/i.test(i.name) &&
    !i.type.startsWith("audio/")
  )
    throw new Error("Choose an audio file such as MP3, WAV, OGG or M4A.");
  const e = URL.createObjectURL(i),
    s = new Audio();
  s.preload = "metadata";
  try {
    return (
      await new Promise((t, n) => {
        const o = setTimeout(
          () =>
            n(
              new Error(
                "This file could not be read. Try an MP3 or another audio file.",
              ),
            ),
          8e3,
        );
        ((s.onloadedmetadata = () => {
          (clearTimeout(o),
            Number.isFinite(s.duration) && s.duration > 0
              ? t()
              : n(new Error("This file does not contain playable audio.")));
        }),
          (s.onerror = () => {
            (clearTimeout(o),
              n(
                new Error(
                  "This browser cannot play that file. Try MP3, WAV, OGG or M4A.",
                ),
              ));
          }),
          (s.src = e));
      }),
      e
    );
  } catch (t) {
    throw (URL.revokeObjectURL(e), t);
  } finally {
    (s.pause(), s.removeAttribute("src"), s.load());
  }
}
const Ft = (i, e, s) => Math.max(e, Math.min(s, i));
function Ia(i, e) {
  const s = (i.x ?? e?.player.x ?? 0) - (e?.player.x || 0),
    t = (i.y ?? e?.player.y ?? 0) - (e?.player.y || 0),
    n = i.z || 0,
    o = Math.hypot(s, t, n),
    r = o ? ((i.vx || 0) * s + (i.vy || 0) * t + (i.vz || 0) * n) / o : 0;
  return {
    pan: Ft(s / Math.max(35, Math.abs(n) * 0.3), -0.95, 0.95),
    gain: i.player ? 1 : 1 / (1 + o / 180),
    doppler: Ft(343 / (343 + r), 0.65, 1.65),
    endPan: Ft((s + (i.vx || 0) * 0.65) / 90, -0.95, 0.95),
  };
}
function Pa(i) {
  const e = i.sampleRate,
    s = i.createBuffer(1, e * 2, e),
    t = s.getChannelData(0);
  let n = 9973,
    o = 0,
    r = 0;
  for (let a = 0; a < t.length; a++) {
    n = (Math.imul(n, 1664525) + 1013904223) >>> 0;
    const c = n / 2147483648 - 1,
      h = a / e;
    ((o += (c - o) * 0.065), (r += (o - r) * 0.006));
    const l =
        (c * 0.17 + o * 1.35 + r * 2.5) *
        (1 +
          Math.sin(h * Math.PI * 2 * 31) * 0.1 +
          Math.sin(h * Math.PI * 2 * 47) * 0.06),
      d =
        Math.sin(h * Math.PI * 2 * 173 + o * 0.9) * 0.018 +
        Math.sin(h * Math.PI * 2 * 347) * 0.011 +
        Math.sin(h * Math.PI * 2 * 691) * 0.007;
    t[a] = Math.tanh(l + d) * 0.72;
  }
  for (let a = 0; a < 1024; a++) {
    const c = a / 1023;
    t[t.length - 1024 + a] = t[t.length - 1024 + a] * (1 - c) + t[a] * c;
  }
  return s;
}
const tt = (i, e = 0, s = 1) =>
    Math.max(e, Math.min(s, Number.isFinite(i) ? i : e)),
  Dt = {
    lobby: { name: "Blue Horizon · Ambient", path: "audio/lobby-theme.mp3" },
    match: { name: "Afterburn · Combat", path: "audio/match-theme.mp3" },
  };
class Oa {
  constructor() {
    ((this.settings = {
      muted: !1,
      volume: 0.35,
      sfxVolume: 0.85,
      musicEnabled: !0,
      musicVolume: 0.4,
    }),
      (this.mode = "deck"),
      (this.voices = new Set()),
      (this.onchange = () => {}),
      (this.library = new La()),
      (this.lastUpdate = 0),
      (this.preview = null),
      (this.cannonBursts = 0),
      (this.lastCannonTime = -1 / 0),
      (this.tracks = Object.fromEntries(
        Object.entries(Dt).map(([e, s]) => {
          const t = new Audio();
          return (
            (t.loop = !0),
            (t.preload = "none"),
            (t.src = new URL(`./${s.path}`, location.href).href),
            [
              e,
              {
                player: t,
                name: s.name,
                custom: !1,
                persisted: !1,
                url: null,
                status: "Built-in theme",
                generation: 0,
              },
            ]
          );
        }),
      )),
      this.restoreMusic());
  }
  async restoreMusic() {
    for (const e of ["lobby", "match"]) {
      const s = this.tracks[e],
        t = s.generation;
      try {
        const n = await this.library.read(e);
        n?.blob &&
          t === s.generation &&
          this.replaceTrack(e, URL.createObjectURL(n.blob), n.name, !0, !0);
      } catch {}
    }
    this.onchange();
  }
  init() {
    try {
      if (!this.context) {
        const e = window.AudioContext || window.webkitAudioContext;
        if (!e) return;
        const s = (this.context = new e()),
          t = (this.master = s.createGain()),
          n = s.createDynamicsCompressor();
        ((n.threshold.value = -9),
          (n.knee.value = 12),
          (n.ratio.value = 12),
          (n.attack.value = 0.003),
          (n.release.value = 0.18),
          (t.gain.value = 0),
          t.connect(n),
          (this.analyser = s.createAnalyser()),
          (this.analyser.fftSize = 256),
          (this.meter = new Float32Array(256)),
          n.connect(this.analyser),
          this.analyser.connect(s.destination),
          (this.fx = s.createGain()),
          this.fx.connect(t),
          (this.engineBus = s.createGain()),
          this.engineBus.connect(this.fx),
          (this.music = s.createGain()),
          (this.musicDuck = s.createGain()),
          this.music.connect(this.musicDuck),
          this.musicDuck.connect(t),
          (this.weaponBus = s.createGain()),
          (this.weaponAnalyser = s.createAnalyser()),
          (this.weaponAnalyser.fftSize = 256),
          (this.weaponMeter = new Float32Array(256)),
          this.weaponBus.connect(this.weaponAnalyser),
          this.weaponAnalyser.connect(this.fx),
          (this.cannonBuffers = createCannonBuffers(s)),
          (this.combatBuffers = Ea(s)),
          (this.reverb = s.createConvolver()),
          (this.reverb.normalize = !1),
          (this.reverb.buffer = Aa(s)),
          (this.reverbGain = s.createGain()),
          (this.reverbGain.gain.value = 0),
          this.weaponBus.connect(this.reverb),
          this.reverb.connect(this.reverbGain),
          this.reverbGain.connect(this.fx),
          (this.afterburner = s.createBufferSource()),
          (this.afterburner.buffer = Ra(s)),
          (this.afterburner.loop = !0),
          (this.afterburner.loopStart = 0.04),
          (this.afterburnerGain = s.createGain()),
          (this.afterburnerGain.gain.value = 0),
          (this.afterburnerFilter = s.createBiquadFilter()),
          (this.afterburnerFilter.type = "lowpass"),
          (this.afterburnerFilter.frequency.value = 2800),
          this.afterburner.connect(this.afterburnerFilter),
          this.afterburnerFilter.connect(this.afterburnerGain),
          this.afterburnerGain.connect(this.engineBus),
          this.afterburner.start(),
          (this.echo = s.createDelay(0.5)),
          (this.echo.delayTime.value = 0.13),
          (this.echoFeedback = s.createGain()),
          (this.echoFeedback.gain.value = 0.14),
          (this.echoWet = s.createGain()),
          (this.echoWet.gain.value = 0.12));
        const o = s.createBiquadFilter();
        ((o.type = "lowpass"),
          (o.frequency.value = 1700),
          this.weaponBus.connect(this.echo),
          this.echo.connect(o),
          o.connect(this.echoWet),
          this.echoWet.connect(this.fx),
          o.connect(this.echoFeedback),
          this.echoFeedback.connect(this.echo),
          (this.noise = s.createBuffer(1, s.sampleRate * 2, s.sampleRate)));
        const r = this.noise.getChannelData(0);
        let a = 0;
        for (let l = 0; l < r.length; l++)
          ((a = (a + Math.random() * 2 - 1) / 1.04), (r[l] = a * 0.24));
        for (let l = 0; l < 1024; l++) {
          const d = l / 1023;
          r[r.length - 1024 + l] = r[r.length - 1024 + l] * (1 - d) + r[l] * d;
        }
        ((this.engineFilter = s.createBiquadFilter()),
          (this.engineFilter.type = "lowpass"),
          (this.engineFilter.Q.value = 0.7),
          (this.engineGain = s.createGain()),
          (this.engineGain.gain.value = 0),
          this.engineFilter.connect(this.engineGain),
          this.engineGain.connect(this.engineBus),
          (this.engineNoise = s.createBufferSource()),
          (this.engineNoise.buffer = Pa(s)),
          (this.engineNoise.loop = !0),
          (this.engineNoise.loopStart = 1024 / s.sampleRate),
          this.engineNoise.connect(this.engineFilter),
          this.engineNoise.start(),
          (this.turbine = s.createOscillator()),
          (this.turbine.type = "sine"),
          (this.turbine.frequency.value = 120),
          (this.turbineGain = s.createGain()),
          (this.turbineGain.gain.value = 0),
          this.turbine.connect(this.turbineGain),
          this.turbineGain.connect(this.engineBus),
          this.turbine.start(),
          (this.rumble = s.createOscillator()),
          (this.rumble.type = "triangle"),
          (this.rumble.frequency.value = 45),
          (this.rumbleGain = s.createGain()),
          (this.rumbleGain.gain.value = 0),
          this.rumble.connect(this.rumbleGain),
          this.rumbleGain.connect(this.engineBus),
          this.rumble.start(),
          (this.windFilter = s.createBiquadFilter()),
          (this.windFilter.type = "highpass"),
          (this.windFilter.frequency.value = 1500),
          (this.windGain = s.createGain()),
          (this.windGain.gain.value = 0),
          this.windFilter.connect(this.windGain),
          this.windGain.connect(this.engineBus));
        const c = s.createBufferSource();
        ((c.buffer = this.noise),
          (c.loop = !0),
          (c.loopStart = 1024 / s.sampleRate),
          c.connect(this.windFilter),
          c.start(0, 0.4),
          (this.ambientFilter = s.createBiquadFilter()),
          (this.ambientFilter.type = "bandpass"),
          (this.ambientFilter.Q.value = 0.45),
          (this.ambientGain = s.createGain()),
          (this.ambientGain.gain.value = 0),
          this.ambientFilter.connect(this.ambientGain),
          this.ambientGain.connect(this.engineBus));
        const h = s.createBufferSource();
        ((h.buffer = this.noise),
          (h.loop = !0),
          (h.loopStart = 1024 / s.sampleRate),
          (h.playbackRate.value = 0.6),
          h.connect(this.ambientFilter),
          h.start(0, 0.8));
        for (const l of Object.values(this.tracks))
          ((l.gain = s.createGain()),
            (l.gain.gain.value = 0),
            s.createMediaElementSource(l.player).connect(l.gain),
            l.gain.connect(this.music));
      }
      (this.context.resume().catch(() => {}),
        this.applyVolumes(),
        this.syncMusic());
    } catch {
      this.unavailable = !0;
    }
  }
  ramp(e, s, t = 0.12) {
    e &&
      (e.cancelScheduledValues(this.context.currentTime),
      e.setTargetAtTime(s, this.context.currentTime, t));
  }
  set(e) {
    ((this.settings = { ...this.settings, ...e }),
      this.applyVolumes(),
      this.syncMusic());
  }
  applyVolumes() {
    if (!this.context) return;
    const e = this.settings;
    (this.ramp(this.master.gain, e.muted ? 0 : tt(e.volume)),
      this.ramp(this.fx.gain, tt(e.sfxVolume)),
      this.ramp(this.music.gain, tt(e.musicVolume)));
  }
  setMode(e) {
    this.mode !== e &&
      (clearTimeout(this.previewTimer),
      (this.preview = null),
      (this.mode = e),
      this.syncMusic());
  }
  syncMusic() {
    if (!this.context) return;
    const e = this.settings,
      s =
        e.musicEnabled &&
        !e.muted &&
        e.volume > 0 &&
        e.musicVolume > 0 &&
        !document.hidden,
      t = this.preview || (this.mode === "deck" ? "lobby" : "match");
    this.activeTrack = t;
    for (const [n, o] of Object.entries(this.tracks)) {
      clearTimeout(o.pauseTimer);
      const r = s && n === t;
      (this.ramp(
        o.gain.gain,
        r
          ? this.mode === "paused" || this.mode === "crashed"
            ? 0.3
            : this.mode === "result"
              ? 0.55
              : 1
          : 0,
        0.35,
      ),
        r &&
          o.player.paused &&
          !o.pending &&
          ((o.pending = !0),
          o.player
            .play()
            .then(() => {
              o.status = o.custom
                ? o.persisted
                  ? "Saved on this device"
                  : "This session only"
                : "Built-in theme";
            })
            .catch((a) => {
              a.name === "NotAllowedError"
                ? (o.status = "Tap or click to start music")
                : a.name !== "AbortError" &&
                  (o.status =
                    "Music could not play. Choose another file or use the default.");
            })
            .finally(() => {
              ((o.pending = !1), this.onchange());
            })),
        r ||
          (s
            ? (o.pauseTimer = setTimeout(() => o.player.pause(), 1400))
            : o.player.pause()));
    }
    this.onchange();
  }
  update(e, s, t = !1) {
    this.spaceMode = s?.mission.mode === "space";
    if ((this.setMode(e), !this.context)) return;
    const n = this.context.currentTime;
    if (n - this.lastUpdate < 0.08) return;
    this.lastUpdate = n;
    const o = e === "playing" && n - this.lastCannonTime < 0.2;
    (this.ramp(this.engineBus.gain, o ? 0.55 : 1, o ? 0.025 : 0.18),
      this.ramp(this.musicDuck.gain, o ? 0.6 : 1, o ? 0.025 : 0.25));
    const r = tt(((s?.flight?.thrust || 12.15) - 12.15) / 32),
      a = e === "playing",
      c = tt((s?.speed || 90) / 160),
      h = !!s?.boosting;
    ((this.engineRPM = a ? Math.round(55 + c * 25 + r * 20) : 0),
      this.ramp(this.engineGain.gain, a ? 0.28 + r * 0.17 : 0, 0.18),
      this.ramp(
        this.engineFilter.frequency,
        (t ? 700 : 1e3) + c * 1600 + (h ? 1400 : 0),
        0.2,
      ),
      this.ramp(this.turbine.frequency, 430 + c * 290 + r * 410, 0.25),
      this.ramp(this.turbineGain.gain, a ? 0.011 : 0, 0.2),
      this.ramp(this.rumble.frequency, 42 + c * 32 + (h ? 14 : 0), 0.2),
      this.ramp(this.rumbleGain.gain, a ? 0.035 : 0, 0.2),
      this.ramp(
        this.windGain.gain,
        a && !this.spaceMode
          ? (t ? 0.05 : 0.12) * c +
              (t ? 0.02 : 0.05) * (s?.flight?.airbrake || 0)
          : 0,
        0.2,
      ),
      this.ramp(
        this.engineNoise.playbackRate,
        0.7 + c * 0.55 + (h ? 0.12 : 0),
        0.35,
      ),
      this.ramp(this.afterburnerGain.gain, a ? r * (t ? 0.22 : 0.38) : 0, 0.15),
      this.ramp(this.afterburnerFilter.frequency, t ? 950 : 2700, 0.25),
      this.ramp(this.afterburner.playbackRate, 0.85 + r * 0.3, 0.4),
      this.ramp(
        this.weaponBus.gain,
        ["playing", "crashed", "result"].includes(e) ? 1 : 0,
        0.07,
      ));
    const l = Ye(s?.mission.mapId),
      d = { azure: 900, glacier: 1700, canyon: 550, caldera: 110 }[l.id];
    ((this.environment = this.spaceMode
      ? "Ion drive · sealed cockpit"
      : l.ambient),
      this.ramp(this.ambientFilter.frequency, d),
      this.ramp(
        this.ambientGain.gain,
        a && !this.spaceMode
          ? (t ? 0.018 : 0.05) * (1 + Math.sin((s?.time || 0) * 0.37) * 0.2)
          : 0,
        a ? 0.4 : 0.12,
      ),
      this.ramp(
        this.reverbGain.gain,
        a ? (l.id === "canyon" ? 0.16 : l.id === "glacier" ? 0.1 : 0.035) : 0,
        0.1,
      ),
      this.ramp(
        this.echoWet.gain,
        l.id === "canyon" ? 0.22 : l.id === "glacier" ? 0.16 : 0.08,
        0.3,
      ),
      this.ramp(this.echo.delayTime, l.id === "canyon" ? 0.23 : 0.13, 0.3),
      a &&
        h &&
        !this.wasBoosting &&
        this.sampleVoice(this.combatBuffers.missile, {
          gain: 0.14,
          rate: 0.75,
        }),
      (this.wasBoosting = a && h),
      a &&
        s?.flight?.stall > 0.15 &&
        n - (this.lastStallWarning || 0) > 0.85 &&
        ((this.lastStallWarning = n),
        this.voice({ freq: 420, end: 280, duration: 0.22, gain: 0.065 })),
      a &&
        s?.clearance < 18 &&
        n - (this.lastWarning || 0) > 1.8 &&
        ((this.lastWarning = n),
        this.voice({ freq: 880, end: 620, duration: 0.16, gain: 0.045 })));
  }
  position(e, s) {
    return Ia(e, s);
  }
  cannon({ pan: e = 0, gain: s = 1, enemy: t = !1 } = {}) {
    if (
      !this.context ||
      this.context.state !== "running" ||
      this.settings.muted ||
      this.settings.volume === 0 ||
      this.settings.sfxVolume === 0 ||
      this.voices.size >= 24
    )
      return;
    const n = this.context,
      o = n.createBufferSource(),
      r = n.createGain(),
      a = n.createStereoPanner();
    ((o.buffer =
      this.cannonBuffers[this.cannonBursts % this.cannonBuffers.length]),
      (o.playbackRate.value = t ? 0.9 : 1),
      (r.gain.value = s * (t ? 0.3 : 0.8)),
      (a.pan.value = t ? e : this.cannonBursts % 2 ? -0.12 : 0.12),
      o.connect(r),
      r.connect(a),
      a.connect(this.weaponBus),
      this.voices.add(o),
      (o.onended = () => {
        (o.disconnect(), r.disconnect(), a.disconnect(), this.voices.delete(o));
      }),
      this.cannonBursts++,
      t || (this.lastCannonTime = n.currentTime),
      o.start());
  }
  voice({
    noise: e = !1,
    freq: s = 100,
    end: t = 50,
    duration: n = 0.2,
    gain: o = 0.1,
    pan: r = 0,
    endPan: a = r,
    filter: c = 3e3,
    highpass: h = !1,
    weapon = false,
  }) {
    if (
      !this.context ||
      this.settings.muted ||
      this.settings.sfxVolume === 0 ||
      this.voices.size >= 24
    )
      return;
    const l = this.context,
      d = l.currentTime,
      u = e ? l.createBufferSource() : l.createOscillator(),
      p = l.createGain(),
      v = l.createBiquadFilter(),
      w = l.createStereoPanner();
    (e
      ? (u.buffer = this.noise)
      : ((u.type = "sine"),
        u.frequency.setValueAtTime(s, d),
        u.frequency.exponentialRampToValueAtTime(Math.max(15, t), d + n)),
      (v.type = h ? "highpass" : "lowpass"),
      (v.frequency.value = c),
      w.pan.setValueAtTime(r, d),
      w.pan.linearRampToValueAtTime(a, d + n),
      p.gain.setValueAtTime(1e-4, d),
      p.gain.exponentialRampToValueAtTime(Math.max(2e-4, o), d + 0.006),
      p.gain.exponentialRampToValueAtTime(1e-4, d + n),
      u.connect(v),
      v.connect(p),
      p.connect(w),
      w.connect(weapon ? this.weaponBus : this.fx),
      this.voices.add(u),
      (u.onended = () => {
        (u.disconnect(),
          v.disconnect(),
          p.disconnect(),
          w.disconnect(),
          this.voices.delete(u));
      }),
      u.start(d),
      u.stop(d + n + 0.01));
  }
  sampleVoice(
    e,
    {
      gain: s = 0.5,
      pan: t = 0,
      endPan: n = t,
      rate: o = 1,
      endRate: r = o,
      duration: a = 0,
      attack: c = 0.003,
    } = {},
  ) {
    if (
      !this.context ||
      !e ||
      this.context.state !== "running" ||
      this.settings.muted ||
      this.settings.sfxVolume === 0 ||
      this.voices.size >= 24
    )
      return;
    const h = this.context,
      l = h.currentTime,
      d = h.createBufferSource(),
      u = h.createGain(),
      p = h.createStereoPanner(),
      v = a || e.duration / Math.max(0.4, o);
    ((d.buffer = e),
      d.playbackRate.setValueAtTime(o, l),
      d.playbackRate.linearRampToValueAtTime(r, l + v),
      u.gain.setValueAtTime(0, l),
      u.gain.linearRampToValueAtTime(s, l + c),
      u.gain.setTargetAtTime(1e-4, l + v * 0.55, v * 0.14),
      p.pan.setValueAtTime(t, l),
      p.pan.linearRampToValueAtTime(n, l + v),
      d.connect(u),
      u.connect(p),
      p.connect(this.weaponBus),
      this.voices.add(d),
      (d.onended = () => {
        (d.disconnect(), u.disconnect(), p.disconnect(), this.voices.delete(d));
      }),
      d.start(),
      d.stop(l + v + 0.02));
  }
  event(e, s) {
    if (
      s?.mission.mode === "space" &&
      ["shoot", "enemyShoot"].includes(e.type)
    ) {
      const position = this.position(e, s);
      this.voice({
        freq: e.type === "shoot" ? 1400 : 850,
        end: 85,
        duration: 0.18,
        gain: 0.17 * position.gain,
        pan: position.pan,
        weapon: true,
      });
      this.cannonBursts++;
      if (this.context && e.type === "shoot")
        this.lastCannonTime = this.context.currentTime;
      return;
    }
    const { pan: t, gain: n, doppler: o, endPan: r } = this.position(e, s),
      a = e.type;
    a === "shoot"
      ? this.cannon()
      : a === "enemyShoot"
        ? this.cannon({ pan: t, gain: n, enemy: !0 })
        : a === "missile"
          ? this.sampleVoice(this.combatBuffers?.missile, {
              gain: 0.65,
              pan: t,
            })
          : a === "explosion"
            ? this.sampleVoice(this.combatBuffers?.explosion, {
                gain: 1.1 * n,
                pan: t,
                rate: e.player ? 0.8 : 0.94 + (this.cannonBursts % 3) * 0.04,
              })
            : a === "hit"
              ? this.sampleVoice(this.combatBuffers?.impact, {
                  gain: 0.45 * n,
                  pan: t,
                })
              : a === "damage"
                ? this.sampleVoice(this.combatBuffers?.impact, {
                    gain: 0.55,
                    rate: 0.6,
                  })
                : a === "flyby"
                  ? this.sampleVoice(this.engineNoise?.buffer, {
                      gain: 0.75 * n,
                      pan: t,
                      endPan: r,
                      rate: 1.25 * o,
                      endRate: 0.68,
                      duration: 1.1,
                      attack: 0.08,
                    })
                  : (a === "ring" ||
                      a === "stage" ||
                      a === "scan" ||
                      a === "contract") &&
                    this.voice({
                      freq: a === "scan" ? 784 : a === "ring" ? 660 : 523,
                      end: 1046,
                      duration: 0.24,
                      gain: 0.07,
                    });
  }
  async importTrack(e, s) {
    const t = this.tracks[e],
      n = ++t.generation;
    ((t.status = "Checking audio file…"), this.onchange());
    let o;
    try {
      if (((o = await za(s)), n !== t.generation)) {
        URL.revokeObjectURL(o);
        return;
      }
      let r = !0;
      try {
        await this.library.write(e, s);
      } catch {
        r = !1;
      }
      if (n !== t.generation) {
        URL.revokeObjectURL(o);
        return;
      }
      return (this.replaceTrack(e, o, s.name, !0, r), r);
    } catch (r) {
      throw (
        n === t.generation && ((t.status = r.message), this.onchange()),
        r
      );
    }
  }
  replaceTrack(e, s, t, n, o) {
    const r = this.tracks[e],
      a = r.url;
    (r.player.pause(),
      (r.pending = !1),
      (r.player.src = s),
      r.player.load(),
      Object.assign(r, {
        url: n ? s : null,
        name: t,
        custom: n,
        persisted: o,
        status: n
          ? o
            ? "Saved on this device"
            : "This session only · storage unavailable"
          : "Built-in theme",
      }),
      a && URL.revokeObjectURL(a),
      this.syncMusic(),
      this.onchange());
  }
  async resetTrack(e) {
    const s = this.tracks[e];
    ++s.generation;
    let t = !0;
    try {
      await this.library.remove(e);
    } catch {
      t = !1;
    }
    (this.replaceTrack(
      e,
      new URL(`./${Dt[e].path}`, location.href).href,
      Dt[e].name,
      !1,
      !1,
    ),
      t ||
        ((s.status = "Default restored for this session · storage unavailable"),
        this.onchange()));
  }
  previewTrack(e) {
    return this.settings.muted ||
      !this.settings.musicEnabled ||
      this.settings.musicVolume === 0 ||
      this.settings.volume === 0
      ? !1
      : (this.init(),
        clearTimeout(this.previewTimer),
        (this.preview = e),
        this.syncMusic(),
        (this.previewTimer = setTimeout(() => {
          ((this.preview = null), this.syncMusic());
        }, 1e4)),
        !0);
  }
  visibility() {
    if (document.hidden) {
      for (const e of Object.values(this.tracks)) e.player.pause();
      this.context?.suspend().catch(() => {});
    } else (this.context?.resume().catch(() => {}), this.syncMusic());
  }
  getState() {
    let e = 0;
    this.analyser &&
      (this.analyser.getFloatTimeDomainData(this.meter),
      (e = Math.sqrt(
        this.meter.reduce((t, n) => t + n * n, 0) / this.meter.length,
      )));
    let s = 0;
    return (
      this.weaponAnalyser &&
        (this.weaponAnalyser.getFloatTimeDomainData(this.weaponMeter),
        (s = Math.sqrt(
          this.weaponMeter.reduce((t, n) => t + n * n, 0) /
            this.weaponMeter.length,
        ))),
      {
        ready: !!this.context,
        context: this.context?.state || "locked",
        mode: this.mode,
        engineRPM: this.engineRPM || 0,
        environment: this.environment || "Coastal wind",
        soundDesign: "rotary-cannon-v4",
        cannonDesign: "dry-rotary-60rps",
        afterburnerLevel: this.afterburnerGain?.gain.value || 0,
        combatSamples: !!this.combatBuffers,
        voices: this.voices.size,
        rms: e,
        weaponRms: s,
        cannonBursts: this.cannonBursts,
        engineDuck: this.engineBus?.gain.value ?? 1,
        musicDuck: this.musicDuck?.gain.value ?? 1,
        musicEnabled: this.settings.musicEnabled,
        musicVolume: this.settings.musicVolume,
        activeTrack: this.activeTrack || "lobby",
        tracks: Object.fromEntries(
          Object.entries(this.tracks).map(([t, n]) => [
            t,
            {
              name: n.name,
              custom: n.custom,
              persisted: n.persisted,
              status: n.status,
              playing: !n.player.paused,
              time: n.player.currentTime,
              ready: n.player.readyState,
            },
          ]),
        ),
      }
    );
  }
}
function Fa(i) {
  return `
  <section class="music-settings" aria-label="Sound and music">
    <div class="setting-row"><div><strong>Sound effects volume</strong><small>Jet engines, wind, weapons and nearby aircraft</small></div><input type="range" id="sfx-volume" aria-label="Sound effects volume" min="0" max="100" value="${i.sfxVolume * 100}"><span id="sfx-volume-value">${Math.round(i.sfxVolume * 100)}%</span></div>
    <label class="setting-row"><div><strong>Background music</strong><small>Ambient music in the lobby; a different combat theme in matches</small></div><input class="toggle" type="checkbox" id="music-toggle" ${i.musicEnabled ? "checked" : ""}></label>
    <div class="setting-row"><div><strong>Music volume</strong><small>Independent of aircraft and combat effects</small></div><input type="range" id="music-volume" aria-label="Music volume" min="0" max="100" value="${i.musicVolume * 100}"><span id="music-volume-value">${Math.round(i.musicVolume * 100)}%</span></div>
    <div class="music-section-heading"><strong>Your soundtrack</strong><span>OPTIONAL · LOCAL FILES</span></div>
    <p class="music-note">Choose a different song for the lobby and the match. Files stay in this browser and are never uploaded. Up to 50 MB per track; MP3, WAV, OGG, M4A and other browser-supported audio.</p>
    ${["lobby", "match"].map((e) => `<div class="music-track-card" data-music-slot="${e}"><div class="music-track-title"><span>${e === "lobby" ? "01 / LOBBY" : "02 / MATCH"}</span><strong id="${e}-track-name"></strong><small id="${e}-track-status" role="status"></small></div><div class="music-track-actions"><label class="music-file-button" for="${e}-music-file">Choose file<input type="file" id="${e}-music-file" accept="audio/*,.mp3,.wav,.ogg,.oga,.m4a,.aac,.flac,.opus,.webm"></label><button class="music-preview-button" id="${e}-music-preview">Preview 10s</button><button class="music-default-button" id="${e}-music-reset">Use default</button></div></div>`).join("")}
    <p class="music-note">Music starts after your first click or tap. Pausing lowers the match music; hidden tabs go silent. Custom tracks are specific to this device and are not included in player backups.</p>
  </section>`;
}
function Da(i, e, s, t) {
  const n = (o) => document.querySelector(o);
  ((n("#sfx-volume").oninput = (o) => {
    (i.init(),
      (e.sfxVolume = +o.target.value / 100),
      (n("#sfx-volume-value").textContent = `${o.target.value}%`),
      s());
  }),
    (n("#music-volume").oninput = (o) => {
      (i.init(),
        (e.musicVolume = +o.target.value / 100),
        (n("#music-volume-value").textContent = `${o.target.value}%`),
        s());
    }),
    (n("#music-toggle").onchange = (o) => {
      (i.init(), (e.musicEnabled = o.target.checked), s());
    }));
  for (const o of ["lobby", "match"]) {
    const r = n(`#${o}-music-file`),
      a = n(`#${o}-music-reset`);
    ((r.onchange = async () => {
      const c = r.files[0];
      if (c) {
        (i.init(), (r.disabled = !0));
        try {
          const h = await i.importTrack(o, c);
          t(
            h
              ? "Music saved on this device."
              : "Music loaded for this session; browser storage is unavailable.",
          );
        } catch (h) {
          t(h.message);
        } finally {
          ((r.disabled = !1), (r.value = ""));
        }
      }
    }),
      (n(`#${o}-music-preview`).onclick = () => {
        i.previewTrack(o) ||
          t("Enable sound and music, then raise their volumes to preview.");
      }),
      (a.onclick = async () => {
        a.disabled = !0;
        try {
          (await i.resetTrack(o), t("Built-in music restored."));
        } catch (c) {
          t(c.message);
        } finally {
          a.disabled = !1;
        }
      }));
  }
  Us(i);
}
function Us(i) {
  for (const [e, s] of Object.entries(i.tracks)) {
    const t = document.getElementById(`${e}-track-name`),
      n = document.getElementById(`${e}-track-status`);
    (t && (t.textContent = s.name), n && (n.textContent = s.status));
  }
}
import { Ga } from "./profile.js";
const Na = "modulepreload",
  Ba = function (i, e) {
    return new URL(i, e).href;
  },
  ws = {},
  ja = function (e, s, t) {
    let n = Promise.resolve();
    if (s && s.length > 0) {
      let h = function (l) {
        return Promise.all(
          l.map((d) =>
            Promise.resolve(d).then(
              (u) => ({ status: "fulfilled", value: u }),
              (u) => ({ status: "rejected", reason: u }),
            ),
          ),
        );
      };
      const r = document.getElementsByTagName("link"),
        a = document.querySelector("meta[property=csp-nonce]"),
        c = a?.nonce || a?.getAttribute("nonce");
      n = h(
        s.map((l) => {
          if (((l = Ba(l, t)), l in ws)) return;
          ws[l] = !0;
          const d = l.endsWith(".css"),
            u = d ? '[rel="stylesheet"]' : "";
          if (t)
            for (let v = r.length - 1; v >= 0; v--) {
              const w = r[v];
              if (w.href === l && (!d || w.rel === "stylesheet")) return;
            }
          else if (document.querySelector(`link[href="${l}"]${u}`)) return;
          const p = document.createElement("link");
          if (
            ((p.rel = d ? "stylesheet" : Na),
            d || (p.as = "script"),
            (p.crossOrigin = ""),
            (p.href = l),
            c && p.setAttribute("nonce", c),
            document.head.appendChild(p),
            d)
          )
            return new Promise((v, w) => {
              (p.addEventListener("load", v),
                p.addEventListener("error", () =>
                  w(new Error(`Unable to preload CSS for ${l}`)),
                ));
            });
        }),
      );
    }
    function o(r) {
      const a = new Event("vite:preloadError", { cancelable: !0 });
      if (((a.payload = r), window.dispatchEvent(a), !a.defaultPrevented))
        throw r;
    }
    return n.then((r) => {
      for (const a of r || []) a.status === "rejected" && o(a.reason);
      return e().catch(o);
    });
  };
class Ha {
  constructor(e, s = () => {}) {
    ((this.store = e),
      (this.onstate = s),
      (this.client = null),
      (this.user = null),
      (this.status = "loading"),
      (this.revision = 0),
      (this.conflict = null),
      (this.suppress = !1),
      (this.saving = !1),
      (this.timer = null),
      (this.epoch = 0));
  }
  emit(e, s = "") {
    ((this.status = e), (this.message = s), this.onstate(this));
  }
  meta(e = this.user) {
    try {
      return JSON.parse(
        this.store.storage.getItem(`skychrome-cloud:${e?.id}`) || "{}",
      );
    } catch {
      return {};
    }
  }
  saveMeta(e) {
    try {
      this.store.storage.setItem(
        `skychrome-cloud:${this.user.id}`,
        JSON.stringify({ revision: this.revision, dirty: e }),
      );
    } catch {}
  }
  async init() {
    try {
      const e = new URL("./account-config.json", location.href),
        s = await (await fetch(e, { cache: "no-store" })).json();
      if (!s.supabaseUrl || !s.supabasePublishableKey) {
        this.emit("disabled");
        return;
      }
      if (new URL(s.supabaseUrl).protocol !== "https:")
        throw new Error("The account service must use HTTPS.");
      const { createClient: t } = await ja(
        async () => {
          const { createClient: r } = await import(
            "./vendor/index-6u7WIUD-.js"
          );
          return { createClient: r };
        },
        [],
        import.meta.url,
      );
      ((this.client = t(s.supabaseUrl, s.supabasePublishableKey, {
        auth: {
          flowType: "pkce",
          detectSessionInUrl: !0,
          persistSession: !0,
          autoRefreshToken: !0,
        },
      })),
        this.client.auth.onAuthStateChange((r, a) => {
          r === "SIGNED_OUT"
            ? queueMicrotask(() => this.useGuest())
            : a?.user &&
              a.user.id !== this.user?.id &&
              queueMicrotask(() => this.useAccount(a.user));
        }));
      const { data: n, error: o } = await this.client.auth.getSession();
      if (o) throw o;
      (n.session?.user
        ? await this.useAccount(n.session.user)
        : this.emit("guest"),
        window.addEventListener("online", () => this.flush()),
        window.addEventListener("focus", () => {
          this.user && this.meta().dirty && this.flush();
        }));
    } catch (e) {
      this.emit(
        "error",
        e.message ||
          "Account service could not start. Your device save is available.",
      );
    }
  }
  redirect() {
    return `${location.origin}${location.pathname}`;
  }
  async email(e) {
    if (!this.client)
      throw new Error(
        "Online accounts have not been activated on this website.",
      );
    const { error: s } = await this.client.auth.signInWithOtp({
      email: e,
      options: { emailRedirectTo: this.redirect() },
    });
    if (s) throw s;
  }
  async oauth(e) {
    if (!["google", "facebook"].includes(e) || !this.client)
      throw new Error("This login provider is unavailable.");
    const { error: s } = await this.client.auth.signInWithOAuth({
      provider: e,
      options: {
        redirectTo: this.redirect(),
        scopes: e === "facebook" ? "email" : void 0,
      },
    });
    if (s) throw s;
  }
  async useAccount(e) {
    if (this.user?.id === e.id) return;
    const s = ++this.epoch;
    ((this.user = e), (this.conflict = null), this.emit("loading"));
    const t = this.meta(e),
      n = this.store.read(e.id);
    this.revision = t.revision || 0;
    const { data: o, error: r } = await this.client
      .from("player_saves")
      .select("progress,revision")
      .eq("player_id", e.id)
      .maybeSingle();
    if (s === this.epoch) {
      this.suppress = !0;
      try {
        if (r) {
          (this.store.switchOwner(e.id, n),
            this.saveMeta(!0),
            this.emit(
              "offline",
              "Cloud save is unavailable. Progress will stay on this device until sync succeeds.",
            ));
          return;
        }
        if (o && t.dirty && o.revision !== this.revision) {
          ((this.conflict = {
            local: n,
            cloud: Q(o.progress),
            cloudRevision: o.revision,
          }),
            this.store.switchOwner(e.id, n),
            this.emit("conflict"));
          return;
        }
        ((this.revision = o?.revision || 0),
          this.store.switchOwner(e.id, o && !t.dirty ? Q(o.progress) : n));
        const a = !o || !!t.dirty || this.store.dirty;
        (this.saveMeta(a), this.emit(a ? "pending" : "synced"));
      } catch (a) {
        (this.store.switchOwner(e.id, n), this.emit("error", a.message));
        return;
      } finally {
        this.suppress = !1;
      }
      this.meta().dirty && this.schedule();
    }
  }
  useGuest() {
    (++this.epoch,
      clearTimeout(this.timer),
      (this.user = null),
      (this.conflict = null),
      (this.suppress = !0),
      this.store.switchOwner("guest"),
      (this.suppress = !1),
      this.emit(this.client ? "guest" : "disabled"));
  }
  changed() {
    if (!(!this.user || this.suppress)) {
      if ((this.saveMeta(!0), this.conflict)) {
        ((this.conflict.local = Q(this.store.profile)), this.emit("conflict"));
        return;
      }
      (this.emit("pending"), this.schedule());
    }
  }
  schedule() {
    (clearTimeout(this.timer),
      (this.timer = setTimeout(() => this.flush(), 1e3)));
  }
  async flush() {
    if (
      !this.user ||
      !this.client ||
      this.conflict ||
      this.saving ||
      !this.meta().dirty
    )
      return;
    const e = this.user.id,
      s = this.epoch,
      t = JSON.stringify(this.store.profile);
    ((this.saving = !0), this.emit("saving"));
    try {
      const { data: n, error: o } = await this.client.rpc(
        "save_player_progress",
        { expected_revision: this.revision, payload: JSON.parse(t) },
      );
      if (s !== this.epoch) return;
      if (o) {
        if (o.code === "40001" || o.message?.includes("SAVE_CONFLICT")) {
          const a = await this.client
            .from("player_saves")
            .select("progress,revision")
            .eq("player_id", e)
            .single();
          if (s !== this.epoch) return;
          if (a.error) throw a.error;
          ((this.conflict = {
            local: Q(this.store.profile),
            cloud: Q(a.data.progress),
            cloudRevision: a.data.revision,
          }),
            this.emit("conflict"));
          return;
        }
        throw o;
      }
      this.revision = Number(n);
      const r = JSON.stringify(this.store.profile) !== t;
      (this.saveMeta(r),
        this.emit(r ? "pending" : "synced"),
        r && this.schedule());
    } catch {
      s === this.epoch &&
        this.emit(
          "offline",
          "Could not reach cloud saves. Your progress is saved on this device; retry when online.",
        );
    } finally {
      ((this.saving = !1),
        s !== this.epoch && this.user && this.meta().dirty && this.schedule());
    }
  }
  resolve(e) {
    if (!this.conflict) return;
    const s = this.conflict;
    ((this.revision = s.cloudRevision),
      (this.conflict = null),
      (this.suppress = !0),
      this.store.switchOwner(this.user.id, e === "cloud" ? s.cloud : s.local),
      (this.suppress = !1));
    const t = e !== "cloud" || this.store.dirty;
    (this.saveMeta(t),
      this.emit(t ? "pending" : "synced"),
      t && this.schedule());
  }
  importGuest() {
    if (!this.user || this.conflict)
      throw new Error(
        "Resolve your cloud save before importing another profile.",
      );
    this.store.change(this.store.read("guest"));
  }
  async signOut() {
    await this.flush();
    const { error: e } = await this.client.auth.signOut({ scope: "local" });
    if (e) throw e;
    this.useGuest();
  }
  freshAccount() {
    return os();
  }
}
function Ua({
  store: i,
  accounts: e,
  icon: s,
  escapeHTML: t,
  showModal: n,
  closeModal: o,
  selectMission: r,
  openAircraft: a,
  canChangePlayer: c,
  toast: h,
}) {
  const l = (b) => document.querySelector(b);
  function d() {
    const b = i.profile,
      S = we(b),
      M = Object.keys(b.levels).length;
    (n(
      "100 LEVEL CAMPAIGN",
      `${M} down. A whole sky ahead.`,
      `<p class="modal-description">Complete every stage’s combat and route objectives to unlock the next level. Levels 1–5 have one stage; levels 6–20 have two. Later operations build up to five mixed stages across four maps: patrol, low routes, recon scans and marked aces. Later levels add tougher pilots, faster attacks and tighter gates. Earn up to three stars: complete the objectives, keep at least 50% hull, and finish within 65% of the timer. Replay any unlocked level.</p><div class="campaign-map">${Gs.map(
        ($, z) =>
          `<section class="chapter"><div class="chapter-heading"><h3>${String(z + 1).padStart(2, "0")} / ${$}</h3><span>${z * 10 + 1}–${z * 10 + 10}</span></div><div class="level-grid">${Ct.slice(
            z * 10,
            z * 10 + 10,
          )
            .map(
              (k) =>
                `<button data-level="${k.level}" class="level-tile ${b.levels[k.level] ? "completed" : k.level === S ? "current" : "locked"}" ${k.level > S ? "disabled" : ""} aria-label="Level ${k.level}, ${k.level > S ? "locked" : b.levels[k.level] ? b.levels[k.level].stars + " stars" : "unlocked"}"><strong>${String(k.level).padStart(2, "0")}</strong><small>${b.levels[k.level] ? "★".repeat(b.levels[k.level].stars) : k.level > S ? "LOCKED" : "READY"}</small>${W.some((T) => T.level === k.level) ? "<i>GIFT</i>" : ""}</button>`,
            )
            .join("")}</div></section>`,
      ).join("")}</div>`,
    ),
      document.querySelectorAll("[data-level]").forEach(
        ($) =>
          ($.onclick = () => {
            if (!c()) {
              h(
                "Return to the flight deck before choosing a different mission.",
              );
              return;
            }
            (r(`campaign-${$.dataset.level}`), o());
          }),
      ));
  }
  function u() {
    const b = i.profile,
      S = De(b.rankPoints),
      M = Ns(b.rankPoints);
    (n(
      "RANKED SORTIES · AI OPPONENTS",
      "Rise through the ranks.",
      `<div class="rank-hero" style="--rank-color:${S.color}">${s("shield")}<div><small>CURRENT RANK</small><h3>${S.name}</h3><strong>${b.rankPoints.toLocaleString()} RP</strong></div></div><p class="modal-description">Operations with 3–5 varied stages against AI pilots. Complete every displayed combat, route, scan and marked-ace objective to win; a running timer never awards victory. Win for 120–150 RP; a defeat, crash, abandoned match, or interrupted ranked flight costs up to 45 RP. Difficulty scales with your current rank. Campaign and quick flights do not change RP.</p><p class="rank-next">${M ? `${M.points - b.rankPoints} RP to ${M.name}` : "Legend achieved. The sky knows your name."} · Best: ${De(b.peakRankPoints).name}</p><div class="rank-ladder">${Ge.map(
        ($) => {
          const z = W.find((T) => T.rank === $.id),
            k = b.peakRankPoints >= $.points;
          return `<div class="rank-row ${S.id === $.id ? "current" : ""}" style="--rank-color:${$.color}"><span class="rank-emblem">${s(k ? "shield" : "target")}</span><div><strong>${$.name}</strong><small>${$.points.toLocaleString()} RP${z ? " · " + z.name : " · Your first wings"}</small></div><span>${k ? "REACHED" : z ? "SKIN GIFT" : ""}</span></div>`;
        },
      ).join(
        "",
      )}</div><button class="secondary-button" id="rank-hangar">${s("plane")} Explore skin rewards ${s("arrow")}</button>`,
    ),
      (l("#rank-hangar").onclick = a));
  }
  const p = () =>
    i.error ||
    {
      disabled: "Saved on this device",
      loading: "Connecting accounts…",
      guest: "Guest · saved on this device",
      synced: "Cloud save up to date",
      pending: "Saved on device · sync queued",
      saving: "Saving to cloud…",
      offline: "Saved on device · cloud offline",
      conflict: "Two saves need your choice",
      error: "Saved on device · accounts unavailable",
    }[e.status] ||
    "Saved on this device";
  function v() {
    const b = i.profile,
      S = De(b.rankPoints);
    ((l("#pilot-name").textContent = b.name),
      (l("#pilot-rank").textContent = S.name.toUpperCase()),
      (l("#pilot-rp").textContent = `${b.rankPoints.toLocaleString()} RP`),
      (l("#campaign-count").textContent =
        `${Object.keys(b.levels).length} / 100`),
      (l("#skin-count").textContent =
        `${W.filter((M) => xe(b, M)).length} / ${W.length} skins`),
      (l("#best-score").textContent = Math.max(
        0,
        ...b.history.map((M) => M.score),
      ).toLocaleString()),
      (l("#log-count").textContent = b.history.length),
      (l("#account-button").firstChild.textContent = (e.user, "P1")),
      w());
  }
  function w() {
    ((l("#save-state").textContent = p()),
      l("#account-sync-state") && (l("#account-sync-state").textContent = p()));
    const b = l("#account-content");
    b &&
      (b.dataset.owner !== (e.user?.id || "guest") ||
        b.dataset.conflict !== String(!!e.conflict)) &&
      y();
  }
  function y() {
    if (!c()) {
      h(
        "Finish this flight or return to the deck before changing accounts or saves.",
      );
      return;
    }
    const b = i.profile,
      S = !!e.client,
      M = e.user;
    n(
      "PILOT PROFILE",
      M ? "Welcome back, pilot." : "Your next chapter starts here.",
      `<div id="account-content" data-owner="${t(M?.id || "guest")}" data-conflict="${!!e.conflict}"><div class="account-status"><span class="live-dot"></span><span id="account-sync-state" role="status">${t(p())}</span></div>${e.message ? `<p class="account-notice">${t(e.message)}</p>` : ""}${e.conflict ? `<div class="save-conflict"><h3>Choose the save to keep</h3><p>Another device changed your cloud save. Nothing will be overwritten until you choose. Export a backup below if you want to keep this device’s version first.</p><button class="secondary-button" id="keep-cloud">Use cloud · ${Object.keys(e.conflict.cloud.levels).length} levels · ${e.conflict.cloud.rankPoints} RP</button><button class="secondary-button" id="keep-local">Use this device · ${Object.keys(b.levels).length} levels · ${b.rankPoints} RP</button></div>` : ""}
      ${M ? `<p class="signed-in">SIGNED IN AS <strong>${t(M.email || "Pilot")}</strong></p><p class="modal-description">Levels, stars, RP, skins, equipped finish, and your last 30 flights save to your account. Your graphics and controls stay specific to this device.</p><div class="account-actions"><button class="secondary-button" id="sync-save">${s("reset")} Sync now</button><button class="secondary-button" id="sign-out">Sign out</button></div>` : `<p class="modal-description">${S ? "Sign in to keep your progress across devices. Guest progress stays separate; you can bring it into your account after signing in." : "Online accounts have not been activated on this website yet. Play as a guest, save on this device, and export a backup below."}</p><div class="login-options"><button class="provider-button" id="google-login" ${S ? "" : "disabled"}><span class="provider-logo google-logo">G</span>Continue with Google ${s("arrow")}</button><button class="provider-button" id="facebook-login" ${S ? "" : "disabled"}><span class="provider-logo facebook-logo">f</span>Continue with Facebook ${s("arrow")}</button></div><form id="email-login"><label for="login-email">Gmail / email login link</label><div class="email-field"><input type="email" id="login-email" name="email" autocomplete="email" placeholder="pilot@gmail.com" required maxlength="254" ${S ? "" : "disabled"}><button type="submit" ${S ? "" : "disabled"}>Send link</button></div><small>No password needed. Open the link in this browser.</small></form>`}
      <p class="account-feedback" id="account-feedback" role="status"></p>
      <form id="pilot-name-form"><label for="pilot-name-input">Pilot callsign</label><div class="email-field"><input id="pilot-name-input" value="${t(b.name)}" maxlength="24" required autocomplete="nickname"><button type="submit">Save</button></div></form>
      <div class="profile-stats"><div><strong>${b.stats.flights}</strong><small>FLIGHTS</small></div><div><strong>${b.stats.wins}</strong><small>VICTORIES</small></div><div><strong>${b.xp.toLocaleString()}</strong><small>XP EARNED</small></div></div>
      <div class="backup-section"><strong>Keep your progress safe</strong><p>Guest saves belong to this browser. Export a backup before clearing browser data or changing devices. Importing replaces the current player’s progress.</p><div class="account-actions"><button class="secondary-button" id="export-save">Export backup</button><label class="secondary-button import-label" for="import-save">Import backup<input type="file" id="import-save" accept="application/json,.json"></label></div>${M ? '<button class="text-button" id="bring-guest">Bring guest progress into this account</button>' : ""}</div></div>`,
    );
    const $ = (k) => {
        l("#account-feedback") && (l("#account-feedback").textContent = k);
      },
      z = async (k, T) => {
        k.disabled = !0;
        try {
          await T();
        } catch (L) {
          $(L.message || "Could not complete that action. Please try again.");
        } finally {
          k.isConnected && (k.disabled = !1);
        }
      };
    (l("#google-login") &&
      (l("#google-login").onclick = (k) =>
        z(k.currentTarget, () => e.oauth("google"))),
      l("#facebook-login") &&
        (l("#facebook-login").onclick = (k) =>
          z(k.currentTarget, () => e.oauth("facebook"))),
      l("#email-login") &&
        (l("#email-login").onsubmit = (k) => {
          k.preventDefault();
          const T = l("#login-email").value.trim();
          z(k.target.querySelector("button"), async () => {
            (await e.email(T),
              $(
                "Check your inbox for your sign-in link. Open it in this browser. If it does not arrive, check spam and try again later.",
              ));
          });
        }),
      (l("#pilot-name-form").onsubmit = (k) => {
        (k.preventDefault(),
          i.change({ ...i.profile, name: l("#pilot-name-input").value }),
          $("Callsign saved."));
      }),
      l("#sync-save") &&
        (l("#sync-save").onclick = (k) => z(k.currentTarget, () => e.flush())),
      l("#sign-out") &&
        (l("#sign-out").onclick = (k) => z(k.currentTarget, () => e.signOut())),
      (l("#export-save").onclick = () => {
        const k = URL.createObjectURL(
            new Blob([i.export()], { type: "application/json" }),
          ),
          T = document.createElement("a");
        ((T.href = k),
          (T.download = "skychrome-player-backup.json"),
          T.click(),
          setTimeout(() => URL.revokeObjectURL(k), 1e3),
          $("Backup download requested. Keep it somewhere safe."));
      }),
      (l("#import-save").onchange = async (k) => {
        const T = k.target.files[0];
        if (T)
          try {
            if (T.size > 262144)
              throw new Error(
                "This backup is too large. Choose a Skychrome player backup under 256 KB.",
              );
            const L = await T.text(),
              O = JSON.parse(L);
            if (O.game !== "SKYCHROME")
              throw new Error("Choose a Skychrome player backup.");
            const j = Q(O.profile);
            m("Import this backup?", j, () => i.import(L));
          } catch (L) {
            $(L.message);
          }
      }),
      l("#bring-guest") &&
        (l("#bring-guest").onclick = () =>
          m("Use your guest save?", i.read("guest"), () => e.importGuest())),
      l("#keep-cloud") &&
        (l("#keep-cloud").onclick = () => {
          (e.resolve("cloud"), v());
        }),
      l("#keep-local") &&
        (l("#keep-local").onclick = () => {
          (e.resolve("local"), v());
        }));
  }
  function m(b, S, M) {
    (n(
      "REPLACE PLAYER SAVE",
      b,
      `<p class="modal-description">This replaces the current player’s progress with ${Object.keys(S.levels).length} completed levels, ${S.rankPoints} RP, and ${W.filter(($) => xe(S, $)).length} skins. Export your current backup first if you want to keep it. Account changes will also sync to the cloud.</p><div class="modal-actions"><button class="secondary-button" id="cancel-import">Cancel</button><button class="launch-button" id="confirm-import"><span>Replace progress</span>${s("check")}</button></div>`,
    ),
      (l("#cancel-import").onclick = y),
      (l("#confirm-import").onclick = () => {
        try {
          (M(), r(`campaign-${we(i.profile)}`), y(), h("Player save loaded."));
        } catch ($) {
          (h($.message), y());
        }
      }));
  }
  return {
    openCampaign: d,
    openRanks: u,
    openAccount: y,
    updateProfileUI: v,
    updateAccountStatus: w,
  };
}
import { DEFAULT_KEYS as Jt, normalizeKeys as qa } from "./controls.js";
const at = (i, e, s) => Math.max(e, Math.min(s, Number.isFinite(i) ? i : e)),
  xs = Object.freeze({
    sensitivity: 1,
    deadzone: 0.12,
    aimFire: !0,
    tracking: !0,
    leftHanded: !1,
    size: 1,
  });
function Ka(i = {}) {
  return (
    (!i || typeof i != "object") && (i = {}),
    {
      sensitivity: at(Number(i.sensitivity ?? 1), 0.5, 2),
      deadzone: at(Number(i.deadzone ?? 0.12), 0.04, 0.3),
      aimFire: typeof i.aimFire == "boolean" ? i.aimFire : !0,
      tracking: typeof i.tracking == "boolean" ? i.tracking : !0,
      leftHanded: i.leftHanded === !0,
      size: at(Number(i.size ?? 1), 0.85, 1.2),
    }
  );
}
function Va(i, e, s, t = 0.12) {
  const n = i / Math.max(1, s),
    o = -e / Math.max(1, s),
    r = Math.hypot(n, o);
  if (!Number.isFinite(r) || r <= t) return { x: 0, y: 0 };
  const a = Math.min(1, (r - t) / (1 - t));
  return { x: (n / r) * a, y: (o / r) * a };
}
function Ya(i, e, s, t, n, o) {
  const r = Math.hypot(e.x, e.y),
    a = Math.pow(Math.min(1, r), 0.65),
    c = 2.1 * t.sensitivity * Math.min(0.05, Math.max(0, s)),
    h = Math.min(n, o);
  return {
    x: at(i.x + (e.x * a * c * h) / Math.max(1, n), -0.86, 0.86),
    y: at(i.y + (e.y * a * c * h) / Math.max(1, o), -0.72, 0.72),
  };
}
function D(i, e) {
  const s = String(e);
  i.textContent !== s && (i.textContent = s);
}
function Wa(i, e) {
  i.innerHTML !== e && (i.innerHTML = e);
}
function Le(i, e, s) {
  i.style[e] !== s && (i.style[e] = s);
}
const ks = "skychrome-touch-v1";
class _a {
  constructor({
    stage: e,
    controls: s,
    touch: t,
    getMode: n,
    getScene: o,
    getSim: r,
    openOptions: a,
    pause: c,
  }) {
    if (
      ((this.enabled = matchMedia("(pointer:coarse)").matches),
      (this.stage = e),
      (this.controls = s),
      (this.touch = t),
      (this.getMode = n),
      (this.getScene = o),
      (this.getSim = r),
      (this.settings = { ...xs }),
      (this.aim = { x: 0, y: 0 }),
      (this.aimStick = { x: 0, y: 0 }),
      (this.pointers = new Map()),
      (this.owners = new Map()),
      (this.lockId = null),
      (this.lastTime = 0),
      (this.output = { x: 0, y: 0 }),
      !this.enabled)
    )
      return;
    try {
      this.settings = Ka(JSON.parse(localStorage.getItem(ks)));
    } catch {}
    (document.documentElement.classList.add("touch-device"),
      (s.innerHTML = `<div class="joystick mobile-stick" id="joystick" role="group" aria-label="Flight stick: drag to steer"><div class="joystick-knob" id="joystick-knob"></div><span>STEER</span></div>
   <div class="mobile-stick aim-stick" id="aim-stick" role="group" aria-label="Aim stick: drag to aim"><div class="joystick-knob" id="aim-knob"></div><span id="aim-stick-label">AIM + FIRE</span></div>
   <div class="touch-roll-controls"><button id="touch-brake" aria-label="Hold airbrake">⊟<small>BRAKE</small></button><button id="touch-roll-left" aria-label="Roll jet left">↶<small>ROLL</small></button><button id="touch-roll-right" aria-label="Roll jet right">↷<small>ROLL</small></button></div>
   <div class="touch-actions"><button id="touch-boost" aria-label="Boost">⇧<small>BOOST</small></button><button id="touch-fire" class="touch-fire" aria-label="Fire cannon">⊕<small>FIRE</small></button><button id="touch-missile" aria-label="Fire missile">↟<small id="touch-missile-label">MISSILE</small></button></div>
   <div class="touch-commands"><button id="touch-lock" aria-label="Track or switch enemy target" aria-pressed="false">◎<small id="touch-lock-label">LOCK</small></button><button id="touch-center" aria-label="Center gun sight">⌖<small>CENTER</small></button><button id="touch-camera" aria-label="Switch camera view">◉<small>VIEW</small></button></div>
   <div class="touch-status" id="touch-status" role="status">MANUAL AIM</div>`),
      (this.$ = (l) => document.getElementById(l)),
      this.stick("joystick", "joystick-knob", "steer"),
      this.stick("aim-stick", "aim-knob", "aim"));
    for (const [l, d] of [
      ["touch-brake", "brake"],
      ["touch-fire", "fire"],
      ["touch-boost", "boost"],
      ["touch-missile", "missile"],
      ["touch-roll-left", "rollLeft"],
      ["touch-roll-right", "rollRight"],
    ])
      this.hold(l, d);
    ((this.$("touch-lock").onclick = () => this.cycleTarget()),
      (this.$("touch-center").onclick = () => {
        ((this.lockId = null), (this.aim = { x: 0, y: 0 }), this.update(!0));
      }));
    const h = document.createElement("button");
    ((h.id = "touch-options"),
      (h.className = "glass-button"),
      h.setAttribute("aria-label", "Touch control settings"),
      (h.textContent = "☷"),
      (h.onclick = a),
      e.querySelector(".stage-tools").prepend(h),
      window.addEventListener("orientationchange", () => {
        (this.reset(), n() === "playing" && c());
      }),
      this.applySettings());
  }
  applySettings() {
    this.enabled &&
      (this.stage.style.setProperty("--touch-scale", this.settings.size),
      this.controls.classList.toggle("left-handed", this.settings.leftHanded),
      (this.$("aim-stick-label").textContent = this.settings.aimFire
        ? "AIM + FIRE"
        : "AIM"),
      (this.$("touch-lock").hidden = !this.settings.tracking),
      this.settings.tracking || (this.lockId = null));
  }
  save() {
    try {
      localStorage.setItem(ks, JSON.stringify(this.settings));
    } catch {}
    this.applySettings();
  }
  setMode(e) {
    this.enabled &&
      (document.documentElement.classList.toggle("mobile-flight", e !== "deck"),
      e !== "playing" && this.reset());
  }
  bindPointer(e, s, t) {
    (e.addEventListener("contextmenu", (o) => o.preventDefault()),
      e.addEventListener("pointerdown", (o) => {
        this.getMode() !== "playing" ||
          this.owners.has(e) ||
          o.pointerType === "mouse" ||
          (o.preventDefault(),
          this.pointers.set(o.pointerId, { element: e, onRelease: t }),
          this.owners.set(e, o.pointerId),
          e.setPointerCapture(o.pointerId),
          e.classList.add("pressed"),
          s(o));
      }),
      e.addEventListener("pointermove", (o) => {
        this.owners.get(e) === o.pointerId && (o.preventDefault(), s(o));
      }));
    const n = (o) => {
      this.owners.get(e) === o.pointerId &&
        (this.pointers.delete(o.pointerId),
        this.owners.delete(e),
        e.classList.remove("pressed"),
        t());
    };
    for (const o of ["pointerup", "pointercancel", "lostpointercapture"])
      e.addEventListener(o, n);
  }
  stick(e, s, t) {
    const n = this.$(e),
      o = this.$(s);
    let r = null;
    this.bindPointer(
      n,
      (a) => {
        const c =
            a.type === "pointerdown" || !r
              ? (r = n.getBoundingClientRect())
              : r,
          h = c.width * 0.37,
          l = Va(
            a.clientX - c.left - c.width / 2,
            a.clientY - c.top - c.height / 2,
            h,
            this.settings.deadzone,
          );
        ((o.style.transform = `translate(calc(-50% + ${l.x * h * 0.8}px),calc(-50% - ${l.y * h * 0.8}px))`),
          t === "steer"
            ? ((this.touch.x = l.x), (this.touch.y = l.y))
            : ((this.aimStick = l),
              (this.aimHeld = !0),
              Math.hypot(l.x, l.y) > 0.2 && (this.lockId = null)));
      },
      () => {
        ((r = null),
          (o.style.transform = "translate(-50%,-50%)"),
          t === "steer"
            ? ((this.touch.x = 0), (this.touch.y = 0))
            : ((this.aimStick = { x: 0, y: 0 }), (this.aimHeld = !1)));
      },
    );
  }
  hold(e, s) {
    this.bindPointer(
      this.$(e),
      () => {
        this.touch[s] = !0;
      },
      () => {
        this.touch[s] = !1;
      },
    );
  }
  reset() {
    for (const [e, { element: s, onRelease: t }] of this.pointers) {
      (this.owners.delete(s), s.classList.remove("pressed"), t());
      try {
        s.hasPointerCapture(e) && s.releasePointerCapture(e);
      } catch {}
    }
    (this.pointers.clear(),
      this.owners.clear(),
      (this.aimHeld = !1),
      (this.aimStick = { x: 0, y: 0 }),
      (this.touch.x = 0),
      (this.touch.y = 0),
      (this.touch.fire = !1),
      (this.touch.boost = !1),
      (this.touch.brake = !1),
      (this.touch.missile = !1),
      (this.touch.rollLeft = !1),
      (this.touch.rollRight = !1),
      (this.lastTime = 0));
  }
  start() {
    (this.reset(), (this.aim = { x: 0, y: 0 }), (this.lockId = null));
  }
  candidates() {
    const e = this.getSim(),
      s = this.getScene();
    return s
      ? e.enemies
          .filter((t) => !t.dead && t.z < -35 && t.z > -600)
          .map((t) => {
            const n = Ds(
                { x: e.player.x, y: e.player.y, z: -8 },
                t,
                e.time,
                450,
                e.speed,
              ),
              o = s.project(n.x, n.y, n.z);
            return {
              enemy: t,
              point: o,
              x: (o.x / s.viewWidth) * 2 - 1,
              y: 1 - (o.y / s.viewHeight) * 2,
            };
          })
          .filter(
            (t) =>
              t.point.visible && Math.abs(t.x) < 0.86 && Math.abs(t.y) < 0.72,
          )
      : [];
  }
  cycleTarget() {
    if (!this.settings.tracking || this.getMode() !== "playing") return;
    const e = this.candidates();
    if (!e.length) {
      ((this.lockId = null),
        (this.noticeUntil = performance.now() + 1800),
        (this.$("touch-status").textContent =
          "NO TARGET IN VIEW · STEER TOWARD A HOSTILE"),
        this.update(!0));
      return;
    }
    ((this.noticeUntil = 0),
      this.lockId !== null
        ? (e.sort((s, t) => s.enemy.id - t.enemy.id),
          (this.lockId =
            e[
              (e.findIndex((s) => s.enemy.id === this.lockId) + 1) % e.length
            ].enemy.id))
        : (e.sort(
            (s, t) =>
              Math.hypot(s.x - this.aim.x, s.y - this.aim.y) -
              Math.hypot(t.x - this.aim.x, t.y - this.aim.y),
          ),
          (this.lockId = e[0].enemy.id)),
      this.update(!0));
  }
  read(e) {
    const s = this.getScene(),
      t = this.lastTime
        ? Math.min(0.05, Math.max(0, (e - this.lastTime) / 1e3))
        : 1 / 60;
    ((this.lastTime = e),
      Math.hypot(this.aimStick.x, this.aimStick.y) > 0.2 &&
        (this.lockId = null));
    const n =
      this.lockId === null
        ? null
        : this.candidates().find((r) => r.enemy.id === this.lockId);
    if (n) {
      const r = 1 - Math.exp(-t * 14);
      ((this.aim.x += (n.x - this.aim.x) * r),
        (this.aim.y += (n.y - this.aim.y) * r));
    } else
      ((this.lockId = null),
        (this.aim = Ya(
          this.aim,
          this.aimStick,
          t,
          this.settings,
          s.viewWidth,
          s.viewHeight,
        )));
    const o = s.aimAt(this.aim.x, this.aim.y);
    return (
      o &&
        ((this.output.x = o.x - s.lastPlayerX),
        (this.output.y = o.y - s.lastPlayerY)),
      {
        aimOffset: this.output,
        fire: this.touch.fire || !!(this.settings.aimFire && this.aimHeld),
      }
    );
  }
  update(e = !1) {
    if (!this.enabled || this.getMode() !== "playing") return;
    const s = performance.now();
    if (!e && s - (this.lastUI || 0) < 100) return;
    this.lastUI = s;
    const t = this.getSim(),
      n = this.lockId !== null;
    (this.$("touch-lock").setAttribute("aria-pressed", n),
      D(this.$("touch-lock-label"), n ? "NEXT" : "LOCK"),
      (!this.noticeUntil || performance.now() > this.noticeUntil) &&
        D(
          this.$("touch-status"),
          n
            ? "TRACKING · DRAG AIM TO RELEASE"
            : this.settings.leftHanded
              ? this.settings.aimFire
                ? "LEFT AIM + FIRE · RIGHT STEER"
                : "LEFT AIM · RIGHT STEER"
              : this.settings.aimFire
                ? "LEFT STEER · RIGHT AIM + FIRE"
                : "LEFT STEER · RIGHT AIM",
        ));
    const o = Math.ceil(t.missileCooldown);
    (D(this.$("touch-missile-label"), o ? `${o}s` : "MISSILE"),
      this.$("touch-missile").classList.toggle("recharging", o > 0),
      this.$("touch-boost").classList.toggle("recharging", t.boostLocked));
  }
  settingsMarkup() {
    if (!this.enabled) return "";
    const e = this.settings;
    return `<section class="touch-settings"><div class="setting-label"><strong>Mobile controls</strong><span>Saved on this phone</span></div><p class="modal-description">By default, the left stick steers and the right stick aims and fires. Left-handed layout swaps their sides. Release to keep your aim. LOCK follows a visible enemy's lead; drag the aim stick to take over. Use CENTER to reset the sight. Hold BRAKE to slow down; release and use BOOST if the stall warning appears.</p>
  <div class="setting-row"><div><strong>Aim sensitivity</strong><small>Slower movement gives finer aiming</small></div><input id="touch-sensitivity" aria-label="Touch aim sensitivity" type="range" min="50" max="200" step="5" value="${e.sensitivity * 100}"><span id="touch-sensitivity-value">${e.sensitivity.toFixed(2)}×</span></div>
  <div class="setting-row"><div><strong>Stick dead zone</strong><small>Ignore small accidental thumb movements</small></div><input id="touch-deadzone" aria-label="Touch stick dead zone" type="range" min="4" max="30" value="${e.deadzone * 100}"><span id="touch-deadzone-value">${Math.round(e.deadzone * 100)}%</span></div>
  <div class="setting-row"><div><strong>Control size</strong><small>Resize both sticks for your hands</small></div><input id="touch-size" aria-label="Touch control size" type="range" min="85" max="120" step="5" value="${e.size * 100}"><span id="touch-size-value">${Math.round(e.size * 100)}%</span></div>
  ${[
    [
      "aimFire",
      "touch-aim-fire",
      "Aim and fire",
      "Fire while the right stick is held; the FIRE button also works",
    ],
    [
      "tracking",
      "touch-tracking",
      "Target tracking",
      "LOCK tracks a visible enemy; NEXT switches targets",
    ],
    [
      "leftHanded",
      "touch-handed",
      "Left-handed layout",
      "Swap aiming and steering sides",
    ],
  ]
    .map(
      ([s, t, n, o]) =>
        `<label class="setting-row"><div><strong>${n}</strong><small>${o}</small></div><input class="toggle" id="${t}" type="checkbox" ${e[s] ? "checked" : ""}></label>`,
    )
    .join("")}
  <button class="secondary-button" id="touch-reset">Reset mobile controls</button></section>`;
  }
  bindSettings() {
    if (this.enabled) {
      for (const [e, s] of [
        ["sensitivity", "touch-sensitivity"],
        ["deadzone", "touch-deadzone"],
        ["size", "touch-size"],
      ]) {
        const t = this.$(s);
        t &&
          (t.oninput = () => {
            ((this.settings[e] = +t.value / 100),
              (this.$(`${s}-value`).textContent =
                e === "sensitivity"
                  ? `${this.settings[e].toFixed(2)}×`
                  : `${t.value}%`),
              this.save());
          });
      }
      for (const [e, s] of [
        ["aimFire", "touch-aim-fire"],
        ["tracking", "touch-tracking"],
        ["leftHanded", "touch-handed"],
      ]) {
        const t = this.$(s);
        t &&
          (t.onchange = () => {
            ((this.settings[e] = t.checked), this.save());
          });
      }
      this.$("touch-reset") &&
        (this.$("touch-reset").onclick = () => {
          ((this.settings = { ...xs }), this.save());
          for (const [e, s] of [
            ["sensitivity", "touch-sensitivity"],
            ["deadzone", "touch-deadzone"],
            ["size", "touch-size"],
          ])
            ((this.$(s).value = this.settings[e] * 100),
              this.$(s).dispatchEvent(new Event("input")));
          for (const [e, s] of [
            ["aimFire", "touch-aim-fire"],
            ["tracking", "touch-tracking"],
            ["leftHanded", "touch-handed"],
          ])
            this.$(s).checked = this.settings[e];
        });
    }
  }
  getState() {
    return {
      enabled: this.enabled,
      settings: { ...this.settings },
      aim: { ...this.aim },
      steer: { x: this.touch.x, y: this.touch.y },
      aimHeld: !!this.aimHeld,
      pointers: this.pointers.size,
      lockId: this.lockId,
    };
  }
}
function Xa({ icon: i, openAircraft: e, getMode: s, getScene: t, toast: n }) {
  const o = (b) => document.querySelector(b);
  document.body.classList.add("game-lobby");
  const r = o("#briefing-panel"),
    a = document.createElement("div"),
    c = document.createElement("div");
  ((a.className = "lobby-briefing-scroll"),
    (c.className = "lobby-playbar"),
    a.append(
      o("#mode-content"),
      o("#quick-missions"),
      o(".briefing-detail"),
      o(".aircraft-card"),
    ),
    c.append(o("#launch-button"), o(".launch-note")),
    r.append(a, c),
    (o("#deck-nav").textContent = "PLAY"),
    (o("#manual-nav").innerHTML = `GUIDE ${i("chevron")}`));
  const h = document.createElement("button");
  ((h.id = "hangar-nav"),
    (h.className = "nav-link"),
    (h.textContent = "HANGAR"),
    (h.onclick = e),
    o("#deck-nav").after(h));
  const l = document.createElement("button");
  ((l.id = "lobby-fullscreen"),
    (l.className = "icon-button"),
    l.setAttribute("aria-label", "Toggle lobby fullscreen"),
    (l.innerHTML = i("full")),
    o(".header-actions").prepend(l),
    (l.onclick = async () => {
      try {
        document.fullscreenElement
          ? await document.exitFullscreen()
          : document.documentElement.requestFullscreen
            ? await document.documentElement.requestFullscreen()
            : n(
                "Your browser already uses the full available lobby area. Native fullscreen is unavailable.",
              );
      } catch {
        n("Your browser could not enter fullscreen.");
      }
    }));
  const d = () =>
    document.body.classList.toggle(
      "game-root-flight",
      s() !== "deck" && document.fullscreenElement === document.documentElement,
    );
  (document.addEventListener("fullscreenchange", d),
    (o(".brand-caption").textContent = "AIR COMBAT"),
    (o(".panel-heading .eyebrow").textContent = "DEPLOYMENT"),
    (r.querySelector("h2").textContent = "Choose your operation"),
    (r.querySelector(".panel-subtitle").textContent =
      "Your aircraft is ready. The sky is waiting."),
    (o("#launch-button").innerHTML =
      `<span>${i("play")} PLAY</span><span class="play-arrow">${i("arrow")}</span>`),
    (o(".launch-note").innerHTML =
      '<span class="live-dot"></span> SOLO OPERATIONS · PROGRESS AUTOSAVES'),
    (o("#scene-caption").innerHTML =
      '<span class="tiny-label">MULTIROLE STEALTH FIGHTER</span><h2>F/A–27 <span>SPECTRE</span></h2><p id="lobby-finish">ARCTIC WHITE</p><span class="scene-coordinate">HANGAR 07 / AIRCRAFT READY</span>'));
  const u = document.createElement("div");
  ((u.className = "lobby-inspect"),
    (u.innerHTML = `<span>DRAG AIRCRAFT TO INSPECT</span><button id="reset-hangar-view" aria-label="Reset hangar camera">${i("reset")}</button>`),
    o("#flight-stage").append(u),
    (o("#reset-hangar-view").onclick = () => {
      (t()?.hangar.resetView(), t() && (t().needsRender = !0));
    }));
  const p = document.createElement("div");
  ((p.className = "lobby-bay"),
    (p.innerHTML =
      "<span>SC / FLIGHT COMMAND</span><strong>07</strong><small>READY TO DEPLOY</small>"),
    o("#flight-stage").append(p),
    (o(".controls-info .eyebrow").textContent = "CONTROLS"),
    (o(".performance-info .eyebrow").textContent = "GRAPHICS"),
    (o(".best-info .eyebrow").textContent = "PERSONAL BEST"));
  let v = null,
    w = 0;
  const y = o("#world");
  (y.addEventListener("pointerdown", (b) => {
    s() !== "deck" ||
      v !== null ||
      (b.preventDefault(),
      (v = b.pointerId),
      (w = b.clientX),
      y.setPointerCapture(v));
  }),
    y.addEventListener("pointermove", (b) => {
      v !== b.pointerId ||
        s() !== "deck" ||
        (t()?.hangar.rotate(b.clientX - w),
        (w = b.clientX),
        t() && (t().needsRender = !0));
    }));
  const m = (b) => {
    v === b.pointerId && (v = null);
  };
  for (const b of ["pointerup", "pointercancel", "lostpointercapture"])
    y.addEventListener(b, m);
  return {
    setMode(b) {
      (document.body.classList.toggle("game-lobby", b === "deck"),
        document.body.classList.toggle(
          "game-root-flight",
          b !== "deck" &&
            document.fullscreenElement === document.documentElement,
        ),
        (v = null));
    },
    update(b, S) {
      const M = W.find(($) => $.id === S.equipped) || W[0];
      o("#lobby-finish").textContent = M.name.toUpperCase();
    },
  };
}
const Ms = {
    plane: '<path d="m12 2 2.5 7L22 16l-8-2-2 8-2-8-8 2 7.5-7Z"/>',
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    chevron: '<path d="m9 5 7 7-7 7"/>',
    sound:
      '<path d="m11 5-6 4H2v6h3l6 4V5Z"/><path d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
    mute: '<path d="m11 5-6 4H2v6h3l6 4V5Zm5 4 6 6m0-6-6 6"/>',
    settings:
      '<path d="m9 3 1-1h4l1 1 1 3 3 1 2 3v4l-2 3-3 1-1 3-1 1h-4l-1-1-1-3-3-1-2-3v-4l2-3 3-1Z"/><circle cx="12" cy="12" r="3"/>',
    full: '<path d="M8 3H3v5m13-5h5v5M3 16v5h5m8 0h5v-5"/>',
    target:
      '<circle cx="12" cy="12" r="7"/><path d="M12 1v6m0 10v6M1 12h6m10 0h6"/>',
    mountain: '<path d="m2 20 7-14 5 9 3-6 5 11H2Zm4-8 3 2 2-1"/>',
    shield:
      '<path d="m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6l9-4Z"/><path d="m8 12 3 3 5-6"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    play: '<path d="m8 4 12 8-12 8V4Z"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
    bolt: '<path d="m13 2-9 12h7l-1 8 10-12h-7l1-8Z"/>',
    trophy:
      '<path d="M7 3h10v7a5 5 0 0 1-10 0V3ZM7 5H3v3a4 4 0 0 0 4 4m10-7h4v3a4 4 0 0 1-4 4m-5 3v6m-5 0h10"/>',
    keys: '<rect x="2" y="5" width="20" height="14" rx="3"/><path d="M6 9h1m4 0h1m4 0h1M6 13h1m4 0h1m4 0h1m-9 3h8"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v1"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    check: '<path d="m5 12 4 4L20 5"/>',
    reset: '<path d="M3 10a9 9 0 1 1 2 8M3 3v7h7"/>',
    headphones:
      '<path d="M3 14v-2a9 9 0 0 1 18 0v2M3 12h4v9H5a2 2 0 0 1-2-2v-7Zm18 0h-4v9h2a2 2 0 0 0 2-2v-7Z"/>',
  },
  A = (i, e = "") =>
    `<svg class="icon ${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${Ms[i] || Ms.plane}</svg>`,
  g = (i) => document.querySelector(i),
  qs = (i, e) => {
    try {
      return JSON.parse(localStorage.getItem(i)) ?? e;
    } catch {
      return e;
    }
  },
  Ks = (i, e) => {
    try {
      localStorage.setItem(i, JSON.stringify(e));
    } catch {}
  },
  Vs = Jt,
  Za = {
    quality:
      navigator.deviceMemory && navigator.deviceMemory <= 4
        ? "low"
        : "balanced",
    adaptiveResolution: !1,
    volume: 0.35,
    muted: !1,
    sfxVolume: 0.85,
    musicEnabled: !0,
    musicVolume: 0.4,
    reduceMotion: !1,
    assist: !0,
    finish: "arctic",
    aircraft: "spectre",
    spacecraft: "xwing",
    keys: { ...Vs },
  };
let E = { ...Za, ...qs("skychrome-settings", {}) };
E.keys = qa(E.keys, E.controlsVersion);
E.controlsVersion = 3;
if (!AIRCRAFT.some((v) => v.id === E.aircraft)) E.aircraft = "spectre";
if (!SPACECRAFT.some((v) => v.id === E.spacecraft)) E.spacecraft = "xwing";
E.adaptiveResolution = E.adaptiveResolution === !0;
const P = new Ga();
let ot = P.profile.history,
  x = Ct[we(P.profile) - 1],
  f = new ea(x),
  R,
  q = new Oa();
E.finish = P.profile.equipped;
let Gt = null,
  Ie = Ye(qs("skychrome-map", "azure")).id,
  Te = "campaign",
  $t = null,
  Qt = !1,
  Nt = !1,
  Bt = !1,
  We = !1;
const lt = new Ha(P, () => Ja()),
  ls = (i) =>
    String(i).replace(
      /[&<>"']/g,
      (e) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[e],
    );
let C = "deck",
  _e = !1,
  Ss = 0,
  G = new Set(),
  ve = 0,
  nt = 0,
  jt = 0,
  st = 0,
  vt = 0,
  Ht = 60,
  ye = null,
  Ys = null;
const V = { x: 0, y: 0, fire: !1, boost: !1, missile: !1, assist: E.assist },
  U = {
    x: 0,
    y: 0,
    rollLeft: !1,
    rollRight: !1,
    fire: !1,
    boost: !1,
    brake: !1,
    missile: !1,
  };
let Es,
  qe = null,
  rt = 0,
  ft = 0;
const H = { active: !1, x: 0, y: 0, fire: !1 },
  Ut = { x: 0, y: 0 };
g("#app").innerHTML = `
<header class="header">
  <a class="brand" href="./" aria-label="Skychrome flight deck"><span class="brand-mark">${A("plane")}</span><span>SKYCHROME<span class="brand-caption">OWN THE HORIZON</span></span></a>
  <nav class="nav" aria-label="Main navigation"><button class="nav-link active" id="deck-nav">Flight deck</button><button class="nav-link" id="log-nav">Mission log <span class="nav-count" id="log-count">${ot.length}</span></button><button class="nav-link" id="manual-nav">Flight manual ${A("chevron")}</button></nav>
  <div class="header-actions"><span class="online"><i></i> ALL SYSTEMS ONLINE</span><span class="header-separator"></span><button class="icon-button" id="sound-button" aria-label="Mute audio">${A("sound")}</button><button class="icon-button" id="settings-button" aria-label="Open settings">${A("settings")}</button><button class="pilot-avatar" id="account-button" aria-label="Player account">P1<span></span></button></div>
</header>
<main class="page">
  <section class="page-intro"><div><div class="eyebrow">A LITTLE ALTITUDE. A LOT OF FREEDOM.</div><h1 id="page-title">Ready for takeoff<span>?</span></h1></div><div class="session-info"><span class="live-dot"></span><span>FLIGHT DECK <b>/</b> <strong id="mode-label">STANDBY</strong></span><span class="session-tag">v3.0.0</span></div></section>
  <div class="progress-strip"><button id="profile-button"><span class="live-dot"></span><strong id="pilot-name">Spectre</strong><span id="save-state">Saved on this device</span></button><button id="rank-button"><span id="pilot-rank">CADET</span><strong id="pilot-rp">0 RP</strong></button><button id="campaign-button"><span>CAMPAIGN</span><strong id="campaign-count">0 / 100</strong></button><button id="skins-button"><span>HANGAR</span><strong id="skin-count">3 / 21 skins</strong></button></div>
  <div class="flight-layout">
    <section class="flight-stage" id="flight-stage" aria-label="Flight simulator">
      <div id="world" class="world"></div>
      <div class="scene-vignette"></div>
      <div class="stage-top"><div class="location"><span class="location-pin"></span><span id="region-label">AZURE ARCHIPELAGO</span><small>24° 18′ N &nbsp; 76° 32′ W</small></div><div class="compass"><span>285</span><span>300</span><b>NW</b><span>330</span><span>345</span><i>⌄</i></div><div class="stage-tools"><span class="quality-pill"><i></i><span id="fps">60</span> FPS</span><button class="glass-button hidden" id="stage-pause" aria-label="Pause flight">${A("pause")}</button><button class="glass-button" id="fullscreen-button" aria-label="Toggle fullscreen">${A("full")}</button></div></div>
      <div class="scene-caption" id="scene-caption"><span class="tiny-label">FREEDOM, AT FULL THROTTLE.</span><h2>Own the<br>horizon<span>.</span></h2><p>Your next adventure is cleared for takeoff.</p><span class="scene-coordinate">SC—027 &nbsp; / &nbsp; 09:41:08 ZULU</span></div>
      <div class="aircraft-label" id="aircraft-label"><span class="aircraft-dot"></span><div><strong>F/A–27 SPECTRE</strong><small>MULTIROLE STEALTH FIGHTER</small></div><span class="label-line"></span></div>
      <div class="reticle hidden" id="reticle"><span></span><i></i></div><div class="lead-marker hidden" id="lead-marker" aria-label="Target lead indicator"></div><div class="ground-warning hidden" id="ground-warning">PULL UP · LOW ALTITUDE</div>
      <div id="target-marker" class="target-marker hidden"><span>HOSTILE</span><i></i><small id="target-distance"></small><div class="target-hull"><i id="target-hull-bar"></i></div><small id="target-hull-label"></small></div>
      <div class="flight-hud hidden" id="flight-hud"><div class="compact-status" id="compact-status"></div><div class="stage-objectives hidden" id="stage-objectives"><span id="stage-heading"></span><strong id="stage-goals"></strong><small id="stage-special"></small><small id="contract-status"></small><div class="stage-progress-track"><i id="stage-progress-fill"></i></div></div><div class="flight-data" id="flight-data"></div><div class="flight-warning hidden" id="flight-warning" role="status"></div><div class="roll-readout" id="roll-readout">ROLL 0° · Q / E</div><div class="hud-left"><small>AIRSPEED</small><strong id="speed">324</strong><span>KM/H</span><div class="hud-ticks"></div></div><div class="hud-right"><small>ALTITUDE</small><strong id="altitude">40</strong><span>METERS</span><div class="hud-ticks"></div></div><div class="hud-bottom"><div><small>HULL INTEGRITY <span id="health-value">100%</span></small><div class="hud-meter"><i id="health-bar"></i></div></div><div class="boost-meter"><small>AFTERBURNER <span id="energy-value">100%</span></small><div class="hud-meter"><i id="energy-bar"></i></div></div></div></div>
      <div class="stage-bottom" id="stage-bottom"><span class="weather">${A("mountain")} <span>27°C <b>·</b> CLEAR SKIES <b>·</b> WIND 8 KT</span></span><div class="view-buttons"><button class="view-button active" id="chase-view" aria-label="Chase camera">CHASE · V</button><button class="view-button" id="cockpit-view" aria-label="First person camera">COCKPIT · V</button></div><span class="render-label"><i></i> LIVE IN-GAME FOOTAGE</span></div>
      <div class="touch-controls hidden" id="touch-controls"><div class="joystick" id="joystick" aria-label="Drag to steer"><div class="joystick-knob" id="joystick-knob"></div><span>STEER</span></div><div class="touch-roll-controls"><button id="touch-roll-left" aria-label="Roll jet left">↶<small>Q</small></button><button id="touch-roll-right" aria-label="Roll jet right">↷<small>E</small></button></div><div class="touch-actions"><button class="touch-boost" id="touch-boost" aria-label="Boost">${A("bolt")}</button><button class="touch-fire" id="touch-fire" aria-label="Fire cannon">${A("target")}</button><button id="touch-missile" aria-label="Fire missile">F</button></div></div>
      <div class="flight-message" id="flight-message" role="status"></div>
      <div class="scan-marker hidden" id="scan-marker"><span>RECON CORRIDOR</span></div><div class="damage-flash" id="damage-flash"></div>
      <div class="stage-overlay hidden" id="stage-overlay"></div>
      <div class="loading-screen" id="loading"><span class="loading-mark">${A("plane")}</span><strong>Preparing your airspace</strong><small>Warming up flight systems…</small></div>
    </section>
    <aside class="mission-panel" id="mission-panel">
      <div id="briefing-panel"><div class="panel-heading"><span class="eyebrow">FLIGHT BRIEFING</span><span class="panel-number">01 — 03</span></div><h2>Choose your horizon.</h2><p class="panel-subtitle">One aircraft. Endless possibilities.</p>
        <div class="flight-mode-tabs" role="group" aria-label="Game mode"><button data-flight-mode="campaign" class="selected" aria-pressed="true">Campaign</button><button data-flight-mode="ranked" aria-pressed="false">Ranked</button><button data-flight-mode="quick" aria-pressed="false">Quick flight</button><button data-flight-mode="space" aria-pressed="false">Space</button></div><div id="mode-content"></div>
        <div id="quick-missions" class="mission-list hidden" role="group" aria-label="Choose mission">${as.map((i, e) => `<button class="mission-card ${e === 0 ? "selected" : ""}" data-mission="${i.id}" aria-pressed="${e === 0}"><span class="mission-thumb thumb-${i.id}">${A(e === 0 ? "mountain" : e === 1 ? "target" : "plane")}</span><span class="mission-card-text"><strong>${i.name}</strong><small>${i.type}</small></span><span class="mission-radio"></span></button>`).join("")}<div class="theatre-selector" role="group" aria-label="Choose map"><span class="eyebrow">SELECT THEATRE · 4 MAPS</span><div class="theatre-grid">${Ve.map((i) => `<button class="theatre-card theatre-${i.id}" data-map="${i.id}" aria-pressed="${i.id === Ie}"><i></i><strong>${i.name}</strong><small>${i.tag}</small></button>`).join("")}</div></div></div>
        <div class="briefing-detail"><div class="mission-meta"><span class="difficulty" id="difficulty">ROOKIE</span><span id="mission-duration">${A("clock")} 3 MIN</span></div><p id="mission-description">${x.description}</p><div class="objectives-preview" id="objectives-preview"><span>${A("target")} 4 hostiles</span><span class="gate-icon">◎ <span>5 flight gates</span></span></div></div>
        <div class="aircraft-card"><div class="aircraft-card-top"><span class="eyebrow">YOUR AIRCRAFT</span><button id="aircraft-button">Customize ${A("chevron")}</button></div><div class="aircraft-details"><span class="aircraft-outline">${A("plane")}</span><div><strong>F/A–27 Spectre</strong><small>TWIN-ENGINE · MULTIROLE</small></div><span class="aircraft-tier">01</span></div></div>
        <button class="launch-button" id="launch-button"><span>${A("plane")} Launch mission</span>${A("arrow")}</button><p class="launch-note"><span class="live-dot"></span> Launches in fullscreen · Progress autosaves</p>
      </div>
      <div id="active-panel" class="hidden"><div class="panel-heading"><span class="eyebrow">MISSION IN PROGRESS</span><span class="live-dot"></span></div><h2 id="active-mission-name">Azure Horizon</h2><p class="panel-subtitle" id="active-mission-type">Coastal patrol</p><div class="mission-timer"><span id="timer">03:00</span><small>TIME REMAINING</small></div><div class="objective-list"><div id="kills-objective">${A("target")}<div><span>Eliminate hostiles</span><strong id="kills-progress">0 / 4</strong><div class="objective-track"><i id="kills-bar"></i></div></div></div><div id="rings-objective">${A("mountain")}<div><span>Fly through gates</span><strong id="rings-progress">0 / 5</strong><div class="objective-track"><i id="rings-bar"></i></div></div></div></div><div class="score-panel"><small>MISSION SCORE</small><strong id="score">000000</strong><span id="missile-status">Homing missile ready <kbd>F</kbd></span></div><div class="pilot-tip">${A("info")}<p id="pilot-tip">Mouse aims · click or Space fires. Q / E rolls · F missile. Complete all stage objectives. Ground contact and aircraft collisions are fatal.</p></div><button class="secondary-button" id="pause-button">${A("pause")} Pause flight <kbd>P</kbd></button><button class="text-button return-button" id="return-button">Return to flight deck</button></div>
    </aside>
  </div>
  <section class="info-row" aria-label="Flight information">
    <button class="info-card controls-info" id="controls-card"><span class="info-icon">${A("keys")}</span><div><span class="eyebrow">YOU’RE IN CONTROL</span><div class="keys-summary"><span><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> Steer</span><span><kbd>SPACE</kbd> Fire</span><span><kbd>⇧</kbd> Boost</span></div></div><span class="info-link">All controls ${A("arrow")}</span></button>
    <button class="info-card performance-info" id="performance-card"><span class="info-icon">${A("bolt")}</span><div><span class="eyebrow">BIG SKIES. SMALL FOOTPRINT.</span><p>Detailed worlds. Scalable performance.</p></div><span class="performance-badge" id="quality-badge">BALANCED</span></button>
    <button class="info-card best-info" id="best-card"><span class="info-icon">${A("trophy")}</span><div><span class="eyebrow">YOUR PERSONAL BEST</span><p><strong id="best-score">${Math.max(0, ...ot.map((i) => i.score)).toLocaleString()}</strong> <span>PTS</span></p></div>${A("chevron")}</button>
  </section>
  <footer><span>DESIGNED FOR THE LOVE OF FLIGHT.</span><span class="footer-message">${A("headphones")} Headphones on. World off.</span><span>SKYCHROME <b>©</b> ${new Date().getFullYear()}</span></footer>
</main>
<dialog id="modal"><div id="modal-body"></div></dialog>
<div class="toast" id="toast" role="status"></div>
`;
const cs = Xa({
    icon: A,
    openAircraft: ct,
    getMode: () => C,
    getScene: () => R,
    toast: ne,
  }),
  K = new _a({
    stage: g("#flight-stage"),
    controls: g("#touch-controls"),
    touch: U,
    getMode: () => C,
    getScene: () => R,
    getSim: () => f,
    openOptions: ci,
    pause: fe,
  }),
  {
    openCampaign: Ws,
    openRanks: _s,
    openAccount: Xs,
    updateProfileUI: Zs,
    updateAccountStatus: Ja,
  } = Ua({
    store: P,
    accounts: lt,
    icon: A,
    escapeHTML: ls,
    showModal: Ee,
    closeModal: ke,
    selectMission: Se,
    openAircraft: ct,
    canChangePlayer: () => C === "deck",
    toast: ne,
  });
function Z() {
  updateVehicleUI();
  (cs.update(x, P.profile),
    Ks("skychrome-settings", E),
    q.set(E),
    R?.applySettings(E),
    Qa(),
    Qs(),
    (g(".keys-summary").innerHTML =
      `<span>${["up", "left", "down", "right"].map((i) => `<kbd>${te(E.keys[i])}</kbd>`).join("")} Steer</span><span><kbd>${te(E.keys.fire)}</kbd> Fire</span><span><kbd>${te(E.keys.boost)}</kbd> Boost</span>`));
}
function Js() {
  const i = E.quality[0].toUpperCase() + E.quality.slice(1),
    e = Math.round((R?.resolutionScale ?? 1) * 100);
  return E.adaptiveResolution
    ? `${i} preset · Automatic resolution: ${e}%`
    : `${i} preset · Fixed resolution: 100%`;
}
function Qs() {
  const i = Math.round((R?.resolutionScale ?? 1) * 100);
  g("#quality-badge").textContent =
    `${E.quality.toUpperCase()} · ${E.adaptiveResolution ? `AUTO ${i}%` : "FIXED"}`;
  const e = g("#graphics-status");
  e && (e.textContent = Js());
}
function Qa() {
  ((g("#sound-button").innerHTML = A(E.muted ? "mute" : "sound")),
    g("#sound-button").setAttribute(
      "aria-label",
      E.muted ? "Unmute audio" : "Mute audio",
    ));
}
function ne(i) {
  ((g("#toast").textContent = i),
    g("#toast").classList.add("show"),
    clearTimeout(Es),
    (Es = setTimeout(() => g("#toast").classList.remove("show"), 3e3)));
}
function ze(i) {
  const e = g("#flight-message");
  ((e.textContent = i),
    e.classList.add("show"),
    clearTimeout(e.timeout),
    (e.timeout = setTimeout(() => e.classList.remove("show"), 2400)));
}
function Se(i) {
  let e =
    SPACE_MISSIONS.find((o) => o.id === i) ||
    as.find((o) => o.id === i) ||
    Ct.find((o) => o.id === i) ||
    (i === "ranked" ? Bs(P.profile.rankPoints) : null);
  if (!e || e.level > we(P.profile)) return;
  (e.mode || (e = { ...e, mapId: Ie, region: Ye(Ie).region }),
    (x = e),
    (Te = e.mode || "quick"),
    f.reset(x, x.seed || 127),
    R?.reset(),
    R?.setPalette(x.palette, x.mapId),
    R?.upgrades.setOperation(x.mode === "space"),
    document.querySelectorAll("[data-mission]").forEach((o) => {
      (o.classList.toggle("selected", o.dataset.mission === i),
        o.setAttribute("aria-pressed", o.dataset.mission === i));
    }),
    document.querySelectorAll("[data-flight-mode]").forEach((o) => {
      (o.classList.toggle("selected", o.dataset.flightMode === Te),
        o.setAttribute("aria-pressed", o.dataset.flightMode === Te));
    }),
    g("#quick-missions").classList.toggle("hidden", Te !== "quick"),
    (g(".panel-number").textContent = x.level
      ? `${String(x.level).padStart(2, "0")} — 100`
      : Te === "ranked"
        ? "RP LADDER"
        : "FREE SORTIES"),
    (g("#difficulty").textContent = x.difficulty),
    (g("#difficulty").className = `difficulty ${i}`),
    (g("#mission-duration").innerHTML =
      `${A("clock")} ${x.duration ? `${Math.floor(x.duration / 60)} MIN LIMIT` : "NO LIMIT"}`),
    (g("#mission-description").textContent = x.description),
    (g("#objectives-preview").innerHTML =
      i === "free"
        ? `<span>${A("shield")} Peaceful airspace</span>`
        : `<span>${A("target")} ${x.kills} hostiles</span>${x.rings ? `<span class="gate-icon">◎ <span>${x.rings} flight gates</span></span>` : ""}`),
    (g("#region-label").textContent = x.region),
    (g(".weather span").textContent =
      x.mode === "space"
        ? "ORBITAL SECTOR · INERTIAL THRUSTERS"
        : Ye(x.mapId).weather),
    document.querySelectorAll("[data-map]").forEach((o) => {
      (o.classList.toggle("selected", o.dataset.map === Ie),
        o.setAttribute("aria-pressed", o.dataset.map === Ie));
    }));
  const s = P.profile,
    t = De(s.rankPoints),
    n = Ns(s.rankPoints);
  ((g("#mode-content").innerHTML =
    Te === "campaign"
      ? `<div class="mode-summary"><small>100 LEVEL CAMPAIGN · ~${Math.round(x.expectedSeconds / 60)} MIN</small><strong>${ls(x.name)}</strong><p>${s.levels[x.level] ? "★".repeat(s.levels[x.level].stars) + " · Replay to improve your stars" : `${x.stages.length} stages · Complete all objectives to advance.`}</p><button id="browse-levels">View all levels ${A("arrow")}</button></div>`
      : Te === "ranked"
        ? `<div class="mode-summary ranked-summary" style="--rank-color:${t.color}"><small>AI OPERATIONS · ${x.stages?.length || 1} STAGES · ~${Math.round(x.expectedSeconds / 60)} MIN</small><strong>${t.name} <span>${s.rankPoints} RP</span></strong><div class="rank-track"><i style="width:${n ? ((s.rankPoints - t.points) / (n.points - t.points)) * 100 : 100}%"></i></div><p>${n ? `${n.points - s.rankPoints} RP to ${n.name}` : "Highest rank reached. Keep your wings sharp."}</p><button id="view-ranks">Rank rewards ${A("arrow")}</button></div>`
        : ""),
    g("#browse-levels") && (g("#browse-levels").onclick = Ws),
    g("#view-ranks") && (g("#view-ranks").onclick = _s),
    cs.update(x, P.profile));
  updateVehicleUI();
  document.body.classList.toggle("space-operation", Te === "space");
  if (Te === "space") {
    g("#mode-content").innerHTML =
      `<div class="space-brief"><span class="eyebrow">STAR WARS · SPACE COMBAT</span><h3>Beyond the atmosphere.</h3><p>X-wings and TIE fighters in a separate orbital operation.</p><div class="space-missions">${SPACE_MISSIONS.map((m) => `<button data-space-mission="${m.id}" class="secondary-button ${x.id === m.id ? "selected" : ""}" aria-pressed="${x.id === m.id}">${m.name}</button>`).join("")}</div></div>`;
    document
      .querySelectorAll("[data-space-mission]")
      .forEach((b) => (b.onclick = () => Se(b.dataset.spaceMission)));
  }
}
function ei(i) {
  Se(
    i === "space"
      ? "space-patrol"
      : i === "campaign"
        ? `campaign-${we(P.profile)}`
        : i === "ranked"
          ? "ranked"
          : "azure",
  );
}
function Ze(i) {
  (cs.setMode(i),
    K.setMode(i),
    q.setMode(i),
    C !== i && ((st = 0), (vt = 0), (ve = 0)),
    (C = i));
  const e = i === "deck";
  (g("#briefing-panel").classList.toggle("hidden", !e),
    g("#active-panel").classList.toggle("hidden", e),
    g("#scene-caption").classList.toggle("hidden", !e),
    g("#aircraft-label").classList.toggle("hidden", !e),
    g("#flight-hud").classList.toggle("hidden", e),
    g("#stage-pause").classList.toggle(
      "hidden",
      e || i === "result" || i === "crashed",
    ),
    g("#reticle").classList.toggle("hidden", i !== "playing"),
    g("#touch-controls").classList.toggle("hidden", i !== "playing"),
    g("#lead-marker").classList.add("hidden"),
    g("#scan-marker").classList.add("hidden"),
    g("#ground-warning").classList.add("hidden"),
    g("#flight-warning").classList.add("hidden"),
    g("#flight-stage").classList.toggle("is-playing", !e),
    g("#flight-stage").classList.toggle("is-flying", i === "playing"),
    (g("#page-title").innerHTML = e
      ? "Ready for takeoff<span>?</span>"
      : "The sky is yours<span>.</span>"),
    (g("#mode-label").textContent = e
      ? "STANDBY"
      : i === "paused"
        ? "PAUSED"
        : "AIRBORNE"),
    e &&
      (g("#stage-overlay").classList.add("hidden"),
      g("#target-marker").classList.add("hidden"),
      g("#flight-message").classList.remove("show")));
}
async function ti() {
  if (document.fullscreenElement) return !0;
  if (!g("#flight-stage").requestFullscreen) return !1;
  try {
    return (await g("#flight-stage").requestFullscreen(), !0);
  } catch {
    return !1;
  }
}
async function es() {
  if (!R || Nt) return;
  if (lt.status === "loading") {
    ne("Restoring your player save. Launch again in a moment.");
    return;
  }
  ((Nt = !0), (We = !0), q.init());
  const i = await ti();
  ((We = !1),
    (Nt = !1),
    x.mode === "ranked" && (x = Bs(P.profile.rankPoints)),
    (qe = null),
    (rt = 0),
    (H.active = !1),
    (H.fire = !1),
    ($t = js()),
    (Qt = !1),
    x.mode === "ranked" && P.beginRanked($t),
    f.reset(x, x.seed || 127),
    (f.contract = x.id === "free" ? null : Ki(Gt)),
    (Gt = f.contract?.id || Gt),
    f.start(),
    R.reset(),
    R.setPalette(x.palette, x.mapId),
    G.clear(),
    Je(),
    K.enabled && K.start(),
    (_e = !1),
    g("#flight-stage").classList.remove("cockpit-active"),
    g("#stage-objectives").classList.toggle("hidden", !f.stage),
    ri(),
    (nt = 0),
    Ze("playing"),
    R.resize(),
    Qe(),
    (g("#active-mission-name").textContent = x.name),
    (g("#active-mission-type").textContent = x.type),
    g("#kills-objective").classList.toggle("hidden", x.id === "free"),
    g("#rings-objective").classList.toggle(
      "hidden",
      x.id !== "free" && !x.rings,
    ),
    g("#stage-overlay").classList.add("hidden"),
    g("#flight-stage").focus({ preventScroll: !0 }),
    !i &&
      innerWidth <= 760 &&
      g("#flight-stage").scrollIntoView({
        behavior: "instant",
        block: "start",
      }),
    ze(
      i
        ? x.id === "free"
          ? "You are cleared for free flight. Enjoy the view."
          : x.mode === "ranked"
            ? "Ranked sortie active · AI opponents · Good hunting."
            : x.level
              ? `LEVEL ${x.level} · Cleared for takeoff.`
              : "Mission active. Good hunting, Spectre."
        : "Fullscreen unavailable. Your flight is ready in this window.",
    ),
    ts());
}
function fe() {
  C === "playing" &&
    (f.pause(),
    Ze("paused"),
    G.clear(),
    Je(),
    ai(
      "FLIGHT PAUSED",
      "A moment above it all.",
      f.stage
        ? `Stage ${f.stageIndex + 1} / ${f.stages.length} · ${f.stageKills}/${f.stage.kills} hostiles · ${f.stageRings}/${f.stage.rings} gates. Complete every stage to pass.`
        : "Your flight will be right here.",
      `<button class="launch-button" id="resume-button"><span>${A("play")} Resume flight</span>${A("arrow")}</button><button class="secondary-button" id="pause-settings">${A("settings")} Flight settings</button><button class="text-button" id="pause-exit">Return to flight deck</button>`,
    ),
    (g("#resume-button").onclick = si),
    (g("#pause-settings").onclick = () => It()),
    (g("#pause-exit").onclick = () => hs()),
    g("#resume-button").focus({ preventScroll: !0 }));
}
async function si() {
  if (C !== "paused" || Bt) return;
  ((Bt = !0), (We = !0));
  const i = g("#resume-button");
  i && (i.disabled = !0);
  try {
    if ((q.init(), await ti(), C !== "paused")) return;
    (f.resume(),
      Ze("playing"),
      R.resize(),
      Qe(),
      g("#stage-overlay").classList.add("hidden"),
      (ve = 0),
      (nt = 0),
      g("#flight-stage").focus({ preventScroll: !0 }));
  } finally {
    ((We = !1), (Bt = !1), i?.isConnected && (i.disabled = !1));
  }
}
function ii() {
  (Ze("deck"),
    (qe = null),
    (rt = 0),
    (H.active = !1),
    (H.fire = !1),
    q.update("deck", f),
    document.fullscreenElement && document.exitFullscreen().catch(() => {}),
    f.reset(x),
    R.reset(),
    G.clear(),
    Je(),
    Se(x.id));
}
function hs() {
  (C === "playing" && fe(),
    Ee(
      "RETURN TO BASE",
      "Leave this flight?",
      `<p class="modal-description">Your flight will be saved. Leaving a ranked sortie counts as a defeat (up to −45 RP). Campaign levels only unlock after a victory.</p><div class="modal-actions"><button class="secondary-button" id="stay-flight">Keep flying</button><button class="launch-button" id="confirm-exit"><span>Return to deck</span>${A("arrow")}</button></div>`,
    ),
    (g("#stay-flight").onclick = () => ke()),
    (g("#confirm-exit").onclick = () => {
      (ni("practice"), ke(), ii());
    }));
}
function ai(i, e, s, t) {
  ((g("#stage-overlay").innerHTML =
    `<div class="overlay-card"><span class="overlay-emblem">${A(f.status === "won" ? "trophy" : f.status === "lost" ? "shield" : "plane")}</span><span class="eyebrow">${i}</span><h2>${e}</h2><p>${s}</p>${t}</div>`),
    g("#stage-overlay").classList.remove("hidden"));
}
function ni(i) {
  return Qt || !$t
    ? { rewards: [], rp: 0, stars: 0 }
    : ((Qt = !0),
      f.time < 1 && x.mode !== "ranked"
        ? { rewards: [], rp: 0, stars: 0 }
        : P.record({
            id: $t,
            mode: x.mode || "quick",
            level: x.level,
            mission: x.name,
            score: f.score,
            kills: f.kills,
            rings: f.ringsCollected,
            time: Math.round(f.time),
            health: f.health,
            result: i,
          }));
}
function en(i) {
  if (!i.won && i.reason !== "Mission time expired") {
    ((qe = i),
      (rt = 1.1),
      Ze("crashed"),
      G.clear(),
      Je(),
      (H.fire = !1),
      g("#target-marker").classList.add("hidden"),
      (g("#mode-label").textContent = "AIRCRAFT LOST"),
      ze(i.reason.toUpperCase()));
    return;
  }
  oi(i);
}
function oi(i) {
  const e = ni(i.won ? "complete" : "lost");
  (Ze("result"),
    G.clear(),
    Je(),
    (g("#mode-label").textContent = i.won ? "MISSION COMPLETE" : "DEBRIEF"),
    ai(
      i.won ? "MISSION COMPLETE" : "FLIGHT DEBRIEF",
      i.won
        ? "Beautifully flown."
        : i.reason === "Mid-air collision"
          ? "Mid-air collision."
          : i.reason === "Terrain impact"
            ? "Terrain impact."
            : i.reason === "Water impact"
              ? "Water impact."
              : i.reason === "Aircraft lost"
                ? "Every ace starts here."
                : "Time to regroup.",
      i.won
        ? "Objectives secured. The horizon is yours."
        : i.reason === "Mid-air collision"
          ? "Both aircraft were destroyed on impact. Keep separation from hostiles."
          : i.reason === "Terrain impact" || i.reason === "Water impact"
            ? "Your aircraft struck the surface. Watch your altitude and pull up earlier."
            : i.reason === "Aircraft lost"
              ? "Your aircraft took critical damage. Take another shot."
              : "The operation window has closed. Fly again to complete your objectives.",
      `${x.mode === "ranked" ? `<div class="progress-result">${e.rp >= 0 ? "+" : ""}${e.rp} RP · ${De(P.profile.rankPoints).name} · ${P.profile.rankPoints} RP</div>` : e.stars ? `<div class="progress-result">${"★".repeat(e.stars)}${"☆".repeat(3 - e.stars)} · Level ${x.level} complete</div>` : ""}${e.rewards.map((s) => `<div class="reward-toast"><i style="--swatch:${s.body};--accent:${s.accent}">${A("plane")}</i><span>NEW SKIN UNLOCKED<strong>${s.name}</strong></span></div>`).join("")}${f.contractBonus ? `<div class="contract-result">${f.contract.name} completed · +${f.contractBonus} bonus points</div>` : ""}<div class="result-stats"><div><strong>${f.score.toLocaleString()}</strong><small>POINTS</small></div><div><strong>${f.kills}</strong><small>HOSTILES</small></div><div><strong>${f.ringsCollected}</strong><small>GATES</small></div></div>${i.won && x.level && x.level < 100 ? `<button class="launch-button" id="next-level-button"><span>Next level · ${x.level + 1}</span>${A("arrow")}</button>` : ""}<button class="${i.won && x.level && x.level < 100 ? "secondary-button" : "launch-button"}" id="retry-button"><span>${A("reset")} Fly again</span>${A("arrow")}</button><button class="text-button" id="result-deck">Return to flight deck</button>`,
    ),
    g("#next-level-button") &&
      (g("#next-level-button").onclick = () => {
        (Se(`campaign-${x.level + 1}`), es());
      }),
    (g("#retry-button").onclick = es),
    (g("#result-deck").onclick = ii),
    g("#retry-button").focus({ preventScroll: !0 }));
}
function ri() {
  (g("#chase-view").classList.toggle("active", !_e),
    g("#cockpit-view").classList.toggle("active", _e));
}
function li(i) {
  document.querySelector("#flight-stage").classList.toggle("cockpit-active", i);
  ((_e = i),
    (H.active = !1),
    K.enabled && K.start(),
    (R.needsRender = !0),
    ri());
}
function Ee(i, e, s) {
  (C === "playing" && fe(), (Ys = document.activeElement));
  const t = g("#modal");
  (document.fullscreenElement &&
    !document.fullscreenElement.contains(t) &&
    document.fullscreenElement.append(t),
    (g("#modal-body").innerHTML =
      `<div class="modal-heading"><div><span class="eyebrow">${i}</span><h2>${e}</h2></div><button class="icon-button" id="close-modal" aria-label="Close dialog">${A("close")}</button></div>${s}`),
    t.open || t.showModal(),
    (g("#close-modal").onclick = ke));
}
function ke() {
  ((ye = null), g("#modal").close(), Ys?.focus({ preventScroll: !0 }));
}
g("#modal").addEventListener("click", (i) => {
  if (i.target === g("#modal")) {
    const e = i.target.getBoundingClientRect();
    (i.clientX < e.left ||
      i.clientX > e.right ||
      i.clientY < e.top ||
      i.clientY > e.bottom) &&
      ke();
  }
});
g("#modal").addEventListener("close", () => (ye = null));
function It() {
  (Ee(
    "TUNE YOUR EXPERIENCE",
    "Flight settings",
    `
  <p class="modal-description">Beautiful skies, at your pace. Settings save on this device.</p>
  <div class="setting-label"><strong>Graphics quality</strong><span id="quality-description">${Rs(E.quality)}</span></div>
  <div class="quality-options">${["low", "balanced", "high"].map((i) => `<button class="quality-option ${E.quality === i ? "selected" : ""}" data-quality="${i}" aria-pressed="${E.quality === i}">${A(i === "low" ? "bolt" : i === "balanced" ? "mountain" : "plane")}<strong>${i === "low" ? "Low" : i === "balanced" ? "Balanced" : "High"}</strong><small>${i === "low" ? "Battery saver" : i === "balanced" ? "Everyday flying" : "16 GB PC + GPU"}</small></button>`).join("")}</div>
  <label class="setting-row"><div><strong>Automatic resolution</strong><small>Allow lower sharpness to improve FPS. Off locks your selected preset.</small></div><input class="toggle" type="checkbox" id="adaptive-toggle" ${E.adaptiveResolution ? "checked" : ""}/></label>
  <p class="graphics-status" id="graphics-status" role="status">${Js()}</p>
  <button class="secondary-button" id="fps-boost">${A("bolt")} Boost FPS · Low + Automatic resolution</button>
  <div class="setting-row"><div><strong>Master volume</strong><small>Overall level for music and sound effects</small></div><input type="range" id="volume" aria-label="Master volume" min="0" max="100" value="${E.volume * 100}" /><span id="volume-value">${Math.round(E.volume * 100)}%</span></div>
  <label class="setting-row"><div><strong>Sound enabled</strong><small>Layered jet roar, turbine whine, wind, cannons and spatial flybys</small></div><input class="toggle" type="checkbox" id="sound-toggle" ${E.muted ? "" : "checked"}/></label>
  ${Fa(E)}
  ${K.settingsMarkup()}
  <label class="setting-row"><div><strong>Flight assist</strong><small>Aligns new shots with nearby targets; rounds fly straight</small></div><input class="toggle" type="checkbox" id="assist-toggle" ${E.assist ? "checked" : ""}/></label>
  <label class="setting-row"><div><strong>Reduced motion</strong><small>Disable camera shake and boost zoom</small></div><input class="toggle" type="checkbox" id="motion-toggle" ${E.reduceMotion ? "checked" : ""}/></label>
  <div class="settings-footnote">${A("info")} Low, Balanced, and High stay fixed. Automatic resolution changes sharpness only when you enable it. High may run at a lower frame rate on slower hardware.${R?.softwareRenderer ? " Software rendering detected: enable browser hardware acceleration for better performance." : ""}</div>
  <button class="secondary-button" id="settings-controls">${A("keys")} Configure controls ${A("arrow")}</button>`,
  ),
    document.querySelectorAll("[data-quality]").forEach(
      (i) =>
        (i.onclick = () => {
          ((E.quality = i.dataset.quality),
            (E.adaptiveResolution = !1),
            (g("#adaptive-toggle").checked = !1),
            Z(),
            document.querySelectorAll("[data-quality]").forEach((e) => {
              (e.classList.toggle("selected", e === i),
                e.setAttribute("aria-pressed", e === i));
            }),
            (g("#quality-description").textContent = Rs(E.quality)));
        }),
    ),
    Da(q, E, Z, ne),
    K.bindSettings(),
    (g("#fps-boost").onclick = () => {
      ((E.quality = "low"),
        (E.adaptiveResolution = !0),
        Z(),
        It(),
        ne("FPS boost enabled: Low graphics with Automatic resolution."));
    }),
    (g("#adaptive-toggle").onchange = (i) => {
      ((E.adaptiveResolution = i.target.checked), Z());
    }),
    (g("#volume").oninput = (i) => {
      ((E.volume = +i.target.value / 100),
        (g("#volume-value").textContent = `${i.target.value}%`),
        Z());
    }),
    (g("#sound-toggle").onchange = (i) => {
      ((E.muted = !i.target.checked), q.init(), Z());
    }),
    (g("#assist-toggle").onchange = (i) => {
      ((E.assist = i.target.checked), Z());
    }),
    (g("#motion-toggle").onchange = (i) => {
      ((E.reduceMotion = i.target.checked), Z());
    }),
    (g("#settings-controls").onclick = Xe));
}
function ci() {
  (Ee("TOUCH FLIGHT SYSTEM", "Your thumbs. Your flight.", K.settingsMarkup()),
    K.bindSettings());
}
function Rs(i) {
  return i === "low"
    ? "Lower resolution and no shadow maps for slower devices."
    : i === "high"
      ? "Photographic materials, volumetric clouds, water reflections, bloom and detailed shadows. Highest visual quality."
      : "Photographic materials, soft lighting and clouds with reduced scenery and reflections.";
}
const te = (i) =>
  ({
    Space: "SPACE",
    ShiftLeft: "L SHIFT",
    ShiftRight: "R SHIFT",
    ArrowUp: "↑",
    ArrowDown: "↓",
    ArrowLeft: "←",
    ArrowRight: "→",
    Escape: "ESC",
  })[i] || i.replace("Key", "").replace("Digit", "");
function Xe() {
  if (K.enabled) {
    ci();
    return;
  }
  (Ee(
    "FLIGHT SCHOOL",
    "Make yourself at home.",
    `<p class="modal-description">Move the mouse to aim; hold left click or Space to fire. WASD / arrows steer in the jet’s current roll orientation. Hold Q / E to roll left / right; release to return smoothly to level flight. The aiming camera stays level. Hold B for the airbrake. Tight turns and climbs use speed; release the brake and boost to recover from a stall. Click a key below to remap. Touchscreens use the flight stick and action buttons.</p><div class="controls-grid">${Object.entries(
      {
        up: "Pitch up",
        down: "Pitch down",
        left: "Steer left",
        right: "Steer right",
        rollLeft: "Roll left",
        rollRight: "Roll right",
        fire: "Fire cannon",
        boost: "Afterburner",
        brake: "Airbrake (hold)",
        camera: "Switch camera",
        missile: "Homing missile",
        pause: "Pause / resume",
      },
    )
      .map(
        ([i, e]) =>
          `<div><span>${e}</span><button class="key-bind" data-bind="${i}" aria-label="Remap ${e}">${te(E.keys[i])}</button></div>`,
      )
      .join(
        "",
      )}</div><div class="manual-note"><span>${A("info")}</span><p><b>Fly the green gates</b> to restore hull and boost. Aim at the lead diamond ahead of a moving target. Green sights indicate flight assist. ${te(E.keys.missile)} launches a homing missile at your selected target; it recharges in 7 seconds. Ground impacts and aircraft collisions destroy your jet.</p></div><div class="modal-actions"><button class="secondary-button" id="reset-controls">${A("reset")} Reset keys</button><button class="launch-button" id="controls-done"><span>Ready to fly</span>${A("check")}</button></div>`,
  ),
    document.querySelectorAll("[data-bind]").forEach(
      (i) =>
        (i.onclick = () => {
          ((ye = i.dataset.bind),
            document
              .querySelectorAll("[data-bind]")
              .forEach((e) => e.classList.remove("listening")),
            i.classList.add("listening"),
            (i.textContent = "PRESS KEY…"));
        }),
    ),
    (g("#reset-controls").onclick = () => {
      ((E.keys = { ...Vs }), Z(), Xe());
    }),
    (g("#controls-done").onclick = ke));
}
function tn() {
  (Ee(
    "THE PILOT’S HANDBOOK",
    "A little flight school.",
    `<p class="modal-description">An assisted combat flight game inspired by the original SKY CHROME Python game. Lift, drag and momentum now shape every manoeuvre.</p><div class="manual-sections"><div><span>01</span><div><h3>Find your line.</h3><p>Press V to switch between chase and a working 3D cockpit. Speed, altitude, attitude, radar, hull and energy instruments follow the simulation. Space mode uses inertial thrusters with no ground or aerodynamic stall. Use WASD or arrow keys to steer. Your jet builds momentum: climbs and hard turns bleed airspeed, while dives regain it. The instruments show actual simulated km/h and metres. G is load, V/S is climb rate, and AGL is clearance above the surface. Hold ${te(E.keys.brake)} to extend the airbrake. Below 195 km/h the wings begin losing lift; release the brake, level out and boost to recover. Sustained rolls also lose altitude. Hold ${te(E.keys.rollLeft)} / ${te(E.keys.rollRight)} to roll through 360°. Release to return smoothly to level flight; steering follows your bank while the aiming camera stays level. Follow the glowing green gates; each one earns 250 points and replenishes hull and boost.</p></div></div><div><span>02</span><div><h3>Own the engagement.</h3><p>Move the mouse to aim. Hold left click or Space to fire straight, converging cannon rounds. Aim at the target lead diamond; green sights indicate a nearby assisted shot. ${te(E.keys.missile)} launches a missile at your selected hostile. Each kill earns 500 points.</p></div></div><div><span>03</span><div><h3>Pick your pace.</h3><p>Hold Shift to engage afterburners. Watch your energy: empty tanks must recharge to 25%. Complete every displayed objective to win. Blue recon corridors require staying aligned at cruise speed until scanning completes; missed passes are replaced. Gold aircraft are marked aces. Terrain runs use lower gates. A fresh optional contract awards bonus points on victory. The time limit is a failure deadline, never a win condition. Press P or Escape to pause. Use Open Horizon for peaceful practice. Watch your clearance: hitting an island or the ocean destroys your aircraft. A collision with a hostile destroys both jets.</p></div></div></div><button class="secondary-button" id="manual-controls">${A("keys")} View & customize controls ${A("arrow")}</button><p class="modal-description"><a href="./credits.html" target="_blank" rel="noopener">Visual credits &amp; licenses</a></p>`,
  ),
    (g("#manual-controls").onclick = Xe));
}
function hi() {
  (Ee(
    "YOUR FLIGHT HISTORY",
    "Every flight tells a story.",
    `${ot.length ? `<div class="log-list">${ot.map((i) => `<div class="log-row"><span class="log-icon ${i.result}">${A(i.result === "complete" ? "trophy" : "plane")}</span><div><strong>${ls(i.mission)}</strong><small>${new Date(i.date).toLocaleDateString(void 0, { month: "short", day: "numeric" })} · ${i.kills} hostiles · ${i.rings} gates</small></div><div class="log-score"><strong>${i.score.toLocaleString()}</strong><small>${i.result === "complete" ? "COMPLETE" : i.result === "practice" ? "PRACTICE" : "FLIGHT ENDED"}</small></div></div>`).join("")}</div>` : `<div class="empty-log">${A("plane")}<h3>Your story starts in the sky.</h3><p>Complete a flight to see your scores and mission history here.</p><button class="launch-button" id="log-start"><span>Back to flight deck</span>${A("arrow")}</button></div>`}<p class="log-note">Your last 30 flights are included in your player save.</p>`,
  ),
    g("#log-start") && (g("#log-start").onclick = ke));
}
function updateVehicleUI() {
  const info = vehicleInfo(Te === "space" ? E.spacecraft : E.aircraft);
  const title = g("#scene-caption h2");
  if (title) title.textContent = info.name;
  const role = g("#scene-caption .tiny-label");
  if (role) role.textContent = info.role.toUpperCase();
  const name = g(".aircraft-details strong");
  if (name) name.textContent = info.name;
  const detail = g(".aircraft-details small");
  if (detail) detail.textContent = info.role.toUpperCase();
  const tier = g(".aircraft-tier");
  if (tier) tier.textContent = info.number;
}
function ct() {
  const i = P.profile;
  (Ee(
    "REWARD HANGAR",
    "Your wings. Your style.",
    `<p class="modal-description">Choose your airframe, then choose its paint. Aircraft selection is independent of paint rewards and keeps existing campaign balance.</p><h3 class="hangar-section">${Te === "space" ? "Spacecraft" : "Aircraft"}</h3><div class="vehicle-grid">${(Te === "space" ? SPACECRAFT : AIRCRAFT).map((v) => `<button data-vehicle="${v.id}" class="vehicle-card ${(Te === "space" ? E.spacecraft : E.aircraft) === v.id ? "selected" : ""}" aria-pressed="${(Te === "space" ? E.spacecraft : E.aircraft) === v.id}"><span class="vehicle-silhouette ${v.id}">${vehicleSilhouette(v.id)}</span><small>${v.role}</small><strong>${v.name}</strong><span>${v.detail}</span></button>`).join("")}</div><h3 class="hangar-section">Paint & rewards · 21 finishes</h3><p class="modal-description">Earn exclusive finishes by completing campaign milestones and reaching ranks. All skins are cosmetic. Unlocked rank rewards stay yours after a defeat.</p><div class="skin-grid">${W.map(
      (e) => {
        const s = xe(i, e);
        return `<button data-finish="${e.id}" class="skin-card ${E.finish === e.id ? "selected" : ""} ${s ? "" : "locked"}" aria-pressed="${E.finish === e.id}" ${s ? "" : "disabled"}><span class="skin-preview" style="--swatch:${e.body};--accent:${e.accent}">${A("plane")}</span><strong>${e.name}</strong><small>${s ? (E.finish === e.id ? "EQUIPPED" : "UNLOCKED") : fa(e)}</small></button>`;
      },
    ).join(
      "",
    )}</div><button class="launch-button" id="aircraft-done"><span>Aircraft ready</span>${A("check")}</button>`,
  ),
    document.querySelectorAll("[data-finish]").forEach(
      (e) =>
        (e.onclick = () => {
          const s = W.find((t) => t.id === e.dataset.finish);
          !s ||
            !xe(P.profile, s) ||
            (P.change({ ...P.profile, equipped: s.id }), ct());
        }),
    ),
    (g("#aircraft-done").onclick = ke));
  document.querySelectorAll("[data-vehicle]").forEach(
    (button) =>
      (button.onclick = () => {
        if (C !== "deck") {
          ne("Return to the flight deck to change aircraft.");
          return;
        }
        if (Te === "space") E.spacecraft = button.dataset.vehicle;
        else E.aircraft = button.dataset.vehicle;
        Z();
        ct();
      }),
  );
}
const I = Object.fromEntries(
    [
      "#altitude",
      "#compact-status",
      "#energy-bar",
      "#energy-value",
      "#flight-data",
      "#flight-warning",
      "#ground-warning",
      "#health-bar",
      "#health-value",
      "#kills-bar",
      "#kills-progress",
      "#missile-status",
      "#rings-bar",
      "#rings-progress",
      "#roll-readout",
      "#score",
      "#speed",
      "#stage-goals",
      "#stage-heading",
      "#stage-special",
      "#contract-status",
      "#stage-objectives",
      "#stage-progress-fill",
      "#timer",
      ".mission-timer small",
    ].map((i) => [i, g(i)]),
  ),
  di = new ResizeObserver(() => {
    const i = I["#stage-objectives"];
    if (!i.offsetHeight) return;
    const e = g("#flight-stage"),
      s = `${i.offsetTop + i.offsetHeight}px`;
    e.style.getPropertyValue("--objectives-bottom") !== s &&
      e.style.setProperty("--objectives-bottom", s);
  });
di.observe(I["#stage-objectives"]);
di.observe(g("#flight-stage"));
function ts() {
  (D(I["#speed"], Math.round(f.speed * 3.6)),
    D(I["#altitude"], Math.max(0, Math.round(f.player.y - be))),
    D(I["#health-value"], `${Math.ceil(f.health)}%`),
    D(I["#energy-value"], `${Math.ceil(f.energy)}%`),
    Le(I["#health-bar"], "width", `${f.health}%`),
    Le(I["#health-bar"], "background", f.health < 30 ? "#ff8b6b" : ""),
    Le(I["#energy-bar"], "width", `${f.energy}%`));
  const i = f.stages ? f.objectiveKills : f.kills,
    e = f.stages ? f.objectiveRings : f.ringsCollected;
  (D(I["#score"], String(f.score).padStart(6, "0")),
    D(
      I["#compact-status"],
      `${x.level ? `L${x.level} · ` : x.mode === "ranked" ? "RANKED · " : ""}${x.id === "free" ? `${f.ringsCollected} GATES · ${String(f.score).padStart(6, "0")} PTS` : `TOTAL ${i}/${x.kills} HOSTILES · ${e}/${x.rings} GATES`} · ${Math.floor(f.time / 60)}:${String(Math.floor(f.time % 60)).padStart(2, "0")}`,
    ),
    D(I["#kills-progress"], `${i} / ${x.kills}`),
    D(
      I["#rings-progress"],
      x.id === "free" ? `${f.ringsCollected} GATES` : `${e} / ${x.rings}`,
    ),
    Le(I["#kills-bar"], "width", `${Math.min(100, (i / x.kills) * 100) || 0}%`),
    Le(
      I["#rings-bar"],
      "width",
      `${x.rings ? Math.min(100, (e / x.rings) * 100) : 100}%`,
    ),
    I["#stage-objectives"].classList.toggle("hidden", !f.stage));
  const s = f.stage ? I["#stage-objectives"] : g("#flight-hud");
  if (
    (I["#compact-status"].parentElement !== s && s.append(I["#compact-status"]),
    f.stage)
  ) {
    (D(
      I["#stage-heading"],
      `STAGE ${f.stageIndex + 1} / ${f.stages.length} · ${f.stage.name.toUpperCase()}`,
    ),
      D(
        I["#stage-goals"],
        `HOSTILES ${f.stageKills}/${f.stage.kills} · GATES ${f.stageRings}/${f.stage.rings}`,
      ));
    const o = f.stage.scans
      ? `RECON ${f.stageScans}/${f.stage.scans} · ${Math.round(((f.scan?.progress || 0) / (f.scan?.required || 1)) * 100)}% · Hold inside the blue corridor; use cruise speed`
      : f.stage.aces
        ? `MARKED ACE ${f.stageAces}/${f.stage.aces} · Hunt the gold aircraft`
        : f.stage.kind === "precision"
          ? "TERRAIN RUN · Follow the low route; watch your clearance"
          : "PATROL · Secure this sector";
    (D(I["#stage-special"], o),
      D(
        I["#contract-status"],
        f.contract
          ? `BONUS ${f.contract.name.toUpperCase()} · ${f.contract.description} · +${f.contract.bonus}`
          : "",
      ));
    const r =
      f.stage.kills +
      f.stage.rings +
      (f.stage.scans || 0) * 3 +
      (f.stage.aces || 0);
    Le(
      I["#stage-progress-fill"],
      "width",
      `${((f.stageKills + f.stageRings + f.stageScans * 3 + f.stageAces) / r) * 100}%`,
    );
  }
  D(
    I["#flight-data"],
    `${f.flight.load.toFixed(1)} G · V/S ${f.player.vy >= 0 ? "+" : ""}${Math.round(f.player.vy)} m/s · ${x.mode === "space" ? "INERTIAL THRUSTERS" : `AGL ${Math.max(0, Math.round(f.clearance))} m`}`,
  );
  const t =
    x.mode === "space"
      ? f.flight.airbrake > 0.2
        ? "RETRO THRUSTERS"
        : ""
      : f.flight.stall > 0.15
        ? "STALL · RELEASE BRAKE & BOOST"
        : f.speed < 62
          ? "LOW AIRSPEED · BUILD SPEED"
          : f.flight.airbrake > 0.2
            ? "AIRBRAKE DEPLOYED"
            : "";
  (D(I["#flight-warning"], t),
    I["#flight-warning"].classList.toggle("hidden", !t || C !== "playing"),
    D(
      I["#roll-readout"],
      `ROLL ${Math.round(((f.player.roll + f.player.bank) * 180) / Math.PI)}° · ${te(E.keys.rollLeft)} / ${te(E.keys.rollRight)}`,
    ));
  const n = x.duration
    ? Math.max(0, Math.ceil(x.duration - f.time))
    : Math.floor(f.time);
  (D(
    I["#timer"],
    `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`,
  ),
    D(
      I[".mission-timer small"],
      x.duration ? "TIME REMAINING" : "TIME IN THE SKY",
    ),
    Wa(
      I["#missile-status"],
      f.missileCooldown > 0
        ? `Missile recharging <strong>${Math.ceil(f.missileCooldown)}s</strong>`
        : `Homing missile ready <kbd>${te(E.keys.missile)}</kbd>`,
    ),
    I["#ground-warning"].classList.toggle(
      "hidden",
      C !== "playing" || f.clearance >= 20,
    ));
}
const X = {
  reticle: g("#reticle"),
  target: g("#target-marker"),
  targetLabel: g("#target-marker span"),
  distance: g("#target-distance"),
  lead: g("#lead-marker"),
  hull: g("#target-hull-bar"),
  hullLabel: g("#target-hull-label"),
};
let As = 0,
  $s = null;
function mt(i, e) {
  i.style.transform = `translate3d(${e.x.toFixed(1)}px,${e.y.toFixed(1)}px,0) translate(-50%,-50%)`;
}
function sn() {
  if (C !== "playing") return;
  K.update();
  const i = g("#scan-marker");
  if (f.scan && f.stageScans < (f.stage?.scans || 0)) {
    const s = R.project(f.scan.x, f.scan.y, f.scan.z);
    (i.classList.toggle("hidden", !s.visible), mt(i, s));
  } else i.classList.add("hidden");
  (mt(X.reticle, R.project(f.aim.x, f.aim.y, f.aim.z)),
    X.reticle.classList.toggle("is-locked", f.assistLocked));
  let e = f.enemies.find((s) => s.id === f.targetId);
  if (!e) for (const s of f.enemies) s.z < -15 && (!e || s.z > e.z) && (e = s);
  if (e) {
    const s = R.project(e.x, e.y, e.z);
    (X.target.classList.toggle("hidden", !s.visible),
      mt(X.target, s),
      X.target.classList.toggle("is-locked", f.assistLocked));
    const t = performance.now();
    if (t - As >= 100 || $s !== e.id) {
      ((As = t),
        ($s = e.id),
        D(
          X.targetLabel,
          e.ace ? "MARKED ACE" : f.assistLocked ? "IN SIGHTS" : "HOSTILE",
        ),
        D(X.distance, `${Math.round(Math.abs(e.z) * 10)} M`));
      const n = Math.max(
        0,
        Math.ceil((e.hp / (e.maxHP || x.enemyHP || 16)) * 100),
      );
      (Le(X.hull, "width", `${n}%`),
        D(X.hullLabel, `${e.roleName || "HOSTILE"} · HULL ${n}%`));
    }
  } else X.target.classList.add("hidden");
  if (f.leadPoint) {
    const s = R.project(f.leadPoint.x, f.leadPoint.y, f.leadPoint.z);
    (X.lead.classList.toggle("hidden", !s.visible), mt(X.lead, s));
  } else X.lead.classList.add("hidden");
}
function Je() {
  (K.reset(),
    Object.assign(U, {
      x: 0,
      y: 0,
      rollLeft: !1,
      rollRight: !1,
      fire: !1,
      boost: !1,
      brake: !1,
      missile: !1,
    }),
    (g("#joystick-knob").style.transform = "translate(-50%,-50%)"));
}
if (!K.enabled) {
  let i = function (n, o) {
      const r = g(n);
      r.addEventListener("pointerdown", (a) => {
        (a.preventDefault(), r.setPointerCapture(a.pointerId), (U[o] = !0));
      });
      for (const a of ["pointerup", "pointercancel", "lostpointercapture"])
        r.addEventListener(a, () => (U[o] = !1));
    },
    t = function (n) {
      if (e !== n.pointerId) return;
      const o = s.getBoundingClientRect(),
        r = (n.clientX - o.left - o.width / 2) / 35,
        a = (n.clientY - o.top - o.height / 2) / 35,
        c = Math.max(1, Math.hypot(r, a));
      ((U.x = r / c),
        (U.y = -a / c),
        (g("#joystick-knob").style.transform =
          `translate(calc(-50% + ${U.x * 30}px),calc(-50% + ${-U.y * 30}px))`));
    };
  (i("#touch-fire", "fire"),
    i("#touch-boost", "boost"),
    i("#touch-missile", "missile"),
    i("#touch-roll-left", "rollLeft"),
    i("#touch-roll-right", "rollRight"));
  let e = null;
  const s = g("#joystick");
  (s.addEventListener("pointerdown", (n) => {
    (n.preventDefault(),
      (e = n.pointerId),
      s.setPointerCapture(n.pointerId),
      t(n));
  }),
    s.addEventListener("pointermove", t));
  for (const n of ["pointerup", "pointercancel", "lostpointercapture"])
    s.addEventListener(n, () => {
      ((e = null),
        (U.x = 0),
        (U.y = 0),
        (g("#joystick-knob").style.transform = "translate(-50%,-50%)"));
    });
}
window.addEventListener("keydown", (i) => {
  if (ye) {
    if ((i.preventDefault(), i.code === "Escape")) {
      ((ye = null), Xe());
      return;
    }
    if (
      ["Tab", "MetaLeft", "MetaRight", "ControlLeft", "ControlRight"].includes(
        i.code,
      )
    ) {
      ne("Choose a letter, number, arrow, Space, or Shift.");
      return;
    }
    if (Object.entries(E.keys).find(([s, t]) => t === i.code && s !== ye)) {
      ne("That key is already assigned. Choose another.");
      return;
    }
    ((E.keys[ye] = i.code), (ye = null), Z(), Xe());
    return;
  }
  if (!g("#modal").open) {
    if (
      (C !== "deck" &&
        [
          "Space",
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
          "Tab",
        ].includes(i.code) &&
        i.code !== "Tab" &&
        i.preventDefault(),
      !i.repeat && (i.code === E.keys.pause || i.code === "Escape"))
    ) {
      C === "playing"
        ? (i.preventDefault(), fe())
        : C === "paused" && (i.preventDefault(), si());
      return;
    }
    if (!i.repeat && i.code === E.keys.camera && C !== "deck") {
      i.preventDefault();
      li(!_e);
      return;
    }
    G.add(i.code);
  }
});
window.addEventListener("keyup", (i) => G.delete(i.code));
window.addEventListener("blur", () => {
  We ||
    (G.clear(), (H.active = !1), (H.fire = !1), Je(), C === "playing" && fe());
});
document.addEventListener("visibilitychange", () => {
  (q.visibility(), document.hidden && C === "playing" && fe(), (ve = 0));
});
function an() {
  const i = E.keys;
  if (
    ((V.x =
      (G.has(i.right) || G.has("ArrowRight") ? 1 : 0) -
      (G.has(i.left) || G.has("ArrowLeft") ? 1 : 0) +
      U.x),
    (V.y =
      (G.has(i.up) || G.has("ArrowUp") ? 1 : 0) -
      (G.has(i.down) || G.has("ArrowDown") ? 1 : 0) +
      U.y),
    (V.roll =
      (G.has(i.rollLeft) || U.rollLeft ? 1 : 0) -
      (G.has(i.rollRight) || U.rollRight ? 1 : 0)),
    (V.fire = G.has(i.fire) || U.fire || H.fire),
    (V.boost =
      G.has(i.boost) ||
      (G.has("ShiftRight") && i.boost === "ShiftLeft") ||
      U.boost),
    (V.missile = G.has(i.missile) || U.missile),
    (V.brake = G.has(i.brake) || U.brake),
    (V.assist = E.assist),
    K.enabled)
  ) {
    const e = K.read(performance.now());
    ((V.aimOffset = e.aimOffset), (V.fire = V.fire || e.fire));
    return;
  }
  if (H.active) {
    const e = R.aimAt(H.x, H.y);
    e
      ? ((Ut.x = e.x - R.lastPlayerX),
        (Ut.y = e.y - R.lastPlayerY),
        (V.aimOffset = Ut))
      : (V.aimOffset = null);
  } else V.aimOffset = null;
}
const Me = g("#flight-stage");
let ss;
function Qe() {
  ss = Me.getBoundingClientRect();
}
new ResizeObserver(Qe).observe(Me);
window.addEventListener("scroll", Qe, { passive: !0 });
window.addEventListener("resize", Qe, { passive: !0 });
function ui(i) {
  const e = ss || (ss = Me.getBoundingClientRect());
  ((H.x = ((i.clientX - e.left) / e.width) * 2 - 1),
    (H.y = 1 - ((i.clientY - e.top) / e.height) * 2),
    (H.active = !0));
}
Me.addEventListener("pointermove", (i) => {
  i.pointerType === "mouse" &&
    C === "playing" &&
    !i.target.closest("button") &&
    ui(i);
});
Me.addEventListener("pointerdown", (i) => {
  i.pointerType !== "mouse" ||
    i.button !== 0 ||
    C !== "playing" ||
    i.target.closest("button") ||
    (i.preventDefault(),
    ui(i),
    (H.fire = !0),
    Me.setPointerCapture(i.pointerId));
});
for (const i of ["pointerup", "pointercancel", "lostpointercapture"])
  Me.addEventListener(i, () => (H.fire = !1));
Me.addEventListener("pointerleave", () => {
  ((H.fire = !1), (H.active = !1));
});
g("#deck-nav").onclick = () => {
  C !== "deck" ? hs() : window.scrollTo({ top: 0, behavior: "smooth" });
};
g("#log-nav").onclick = hi;
g("#manual-nav").onclick = tn;
g("#controls-card").onclick = Xe;
g("#settings-button").onclick = It;
g("#performance-card").onclick = It;
g("#best-card").onclick = hi;
g("#aircraft-button").onclick = ct;
g("#launch-button").onclick = es;
g("#pause-button").onclick = fe;
g("#stage-pause").onclick = fe;
g("#return-button").onclick = hs;
g("#sound-button").onclick = () => {
  ((E.muted = !E.muted),
    q.init(),
    Z(),
    ne(E.muted ? "Audio muted" : "Audio enabled"));
};
g("#chase-view").onclick = () => li(!1);
g("#cockpit-view").onclick = () => li(!0);
if (g("#touch-camera")) g("#touch-camera").onclick = () => li(!_e);
g("#fullscreen-button").onclick = async () => {
  try {
    document.fullscreenElement
      ? await document.exitFullscreen()
      : g("#flight-stage").requestFullscreen
        ? await g("#flight-stage").requestFullscreen()
        : ne("Fullscreen is not supported by this browser.");
  } catch {
    ne("Your browser could not enter fullscreen.");
  }
};
document.addEventListener("fullscreenchange", () => {
  (document.fullscreenElement ||
    (g("#flight-stage").contains(g("#modal")) &&
      document.body.append(g("#modal")),
    C === "playing" && !We && fe()),
    R?.resize(),
    Qe());
});
document
  .querySelectorAll("[data-mission]")
  .forEach((i) => (i.onclick = () => Se(i.dataset.mission)));
document.querySelectorAll("[data-map]").forEach(
  (i) =>
    (i.onclick = () => {
      ((Ie = i.dataset.map), Ks("skychrome-map", Ie), Se(x.id));
    }),
);
document
  .querySelectorAll("[data-flight-mode]")
  .forEach((i) => (i.onclick = () => ei(i.dataset.flightMode)));
g("#account-button").onclick = Xs;
g("#profile-button").onclick = Xs;
g("#rank-button").onclick = _s;
g("#campaign-button").onclick = Ws;
g("#skins-button").onclick = ct;
P.onchange = () => {
  ((ot = P.profile.history),
    (E.finish = P.profile.equipped),
    Z(),
    Zs(),
    lt.changed(),
    C === "deck" && (x.level > we(P.profile) ? ei("campaign") : Se(x.id)));
};
q.onchange = () => Us(q);
for (const i of ["pointerdown", "keydown"])
  window.addEventListener(
    i,
    () => {
      (!q.context || q.context.state !== "running") && q.init();
    },
    { passive: !0 },
  );
g("#flight-stage").tabIndex = 0;
Z();
Se(x.id);
Zs();
lt.init();
function pi(i) {
  if ((requestAnimationFrame(pi), !R)) return;
  if (document.hidden) {
    ve = 0;
    return;
  }
  ve || (ve = i);
  const e = (i - ve) / 1e3,
    s = Math.min(e, 0.1);
  if (((ve = i), (Ss += s), (ft += s), C === "playing")) {
    (an(), (nt += s));
    let o = 0;
    for (; nt >= 1 / 60 && o < 6; ) (f.update(1 / 60, V), (nt -= 1 / 60), o++);
    for (const r of f.drainEvents())
      (q.event(r, f),
        r.type === "surfaceHit" && R.burst(r.x, r.y, r.z, 2, !0),
        (r.type === "explosion" || r.type === "hit") &&
          R.burst(
            r.x,
            r.y,
            r.z,
            r.player ? 40 : r.type === "explosion" ? 24 : 4,
            !1,
            r.player,
          ),
        r.type === "stage" &&
          (ze(`STAGE ${r.number} / ${r.total} · ${r.name.toUpperCase()}`),
          ts()),
        r.type === "scan" &&
          ze("RECON COMPLETE · +600 · Continue your objectives"),
        r.type === "scanMissed" && ze("RECON PASS MISSED · New corridor ahead"),
        r.type === "contract" && ze(`${r.name} · +${r.bonus} BONUS`),
        r.type === "ring" &&
          (R.burst(r.x, r.y, r.z, 14, !0),
          ze("GATE CLEARED  +250  ·  Hull & boost restored")),
        r.type === "damage" &&
          (g("#damage-flash").classList.remove("flash"),
          g("#damage-flash").offsetWidth,
          g("#damage-flash").classList.add("flash")),
        r.type === "finish" && en(r));
  }
  if (C === "crashed" && ((rt -= s), rt <= 0 && qe)) {
    const o = qe;
    ((qe = null), oi(o));
  }
  q.update(C, f, _e);
  const t = C === "playing";
  ((st += e),
    (t ||
      C === "crashed" ||
      R.needsRender ||
      (C !== "paused" &&
        (R.particles.length > 0 || R.combat.particles.length > 0)) ||
      (C === "deck" && ft >= 1 / 30)) &&
      (R.render(f, Math.min(ft, 0.1), Ss, C === "deck", _e),
      (ft = 0),
      vt++,
      sn()),
    st >= 1.25 &&
      ((Ht = Math.round(vt / st)),
      D(g("#fps"), C === "paused" ? "—" : Ht),
      t && R.adapt(Ht),
      Qs(),
      (vt = 0),
      (st = 0)),
    (jt += s),
    jt > 0.1 && (C !== "deck" && C !== "paused" && ts(), (jt = 0)));
}
try {
  ((R = new Ma(g("#world"), E)),
    R.setPalette(x.palette, x.mapId),
    R.render(f, 0.016, 0, !0),
    g("#loading").classList.add("hidden"),
    requestAnimationFrame(pi));
} catch (i) {
  (console.error("Flight renderer could not start:", i),
    (g("#loading").innerHTML =
      `${A("info")}<strong>We couldn’t initialize 3D graphics.</strong><small>Enable hardware acceleration and reload in a WebGL-compatible browser.</small><button class="secondary-button" id="reload-button">Reload flight systems</button>`),
    (g("#reload-button").onclick = () => location.reload()),
    (g("#launch-button").disabled = !0));
}
Object.defineProperty(window, "__SKYCHROME__", {
  value: {
    getState: () => ({
      version: "3.0.0",
      vehicle: R?.jet.userData.vehicleId,
      cameraView: _e ? "cockpit" : "chase",
      instruments: R?.upgrades.cockpit.telemetry || null,
      operationMode: x.mode || "quick",
      mapId: x.mapId || "azure",
      contract: f.contract
        ? {
            ...f.contract,
            bonusAwarded: f.contractBonus,
            cannonKills: f.cannonKills,
            boostGates: f.boostGates,
            missedGates: f.missedGates,
          }
        : null,
      touchControls: K.getState(),
      mode: C,
      status: f.status,
      reason: f.reason,
      time: f.time,
      speed: f.speed,
      flight: { ...f.flight },
      clearance: f.clearance,
      aim: { ...f.aim },
      targetId: f.targetId,
      assistLocked: f.assistLocked,
      score: f.score,
      kills: f.kills,
      rings: f.ringsCollected,
      health: f.health,
      energy: f.energy,
      player: { ...f.player },
      bullets: f.bullets.length,
      enemyAircraft: f.enemies.map((i) => ({
        id: i.id,
        x: i.x,
        y: i.y,
        z: i.z,
        vx: i.vx,
        vy: i.vy,
        vz: i.vz,
        hp: i.hp,
        maxHP: i.maxHP,
        role: i.roleName,
        state: i.state,
        bank: i.bank,
      })),
      enemies: f.enemies.length,
      enemyLimit: f.enemyLimit,
      enemySpawnInterval: f.spawnInterval,
      audio: q.getState(),
      shots: f.shots,
      mission: x.id,
      operation: {
        stages: f.stages?.length || 1,
        stage: f.stageIndex + 1,
        completedStages: f.completedStages,
        stageName: f.stage?.name || "",
        stageKind: f.stage?.kind || "patrol",
        stageScans: f.stageScans,
        scansGoal: f.stage?.scans || 0,
        stageAces: f.stageAces,
        acesGoal: f.stage?.aces || 0,
        scan: f.scan ? { ...f.scan } : null,
        stageKills: f.stageKills,
        stageRings: f.stageRings,
        killsGoal: f.stage?.kills ?? x.kills,
        ringsGoal: f.stage?.rings ?? x.rings,
        objectiveKills: f.stages ? f.objectiveKills : f.kills,
        objectiveRings: f.stages ? f.objectiveRings : f.ringsCollected,
        totalKills: x.kills,
        totalRings: x.rings,
        duration: x.duration,
        gateRadius: x.gateRadius || 12.8,
        gateSpacing: x.gateSpacing || 300,
        nextGate:
          f.rings
            .filter((i) => i.active !== !1 && i.z < 0)
            .sort((i, e) => e.z - i.z)[0] || null,
      },
      profile: {
        completedLevels: Object.keys(P.profile.levels).length,
        unlockedLevel: we(P.profile),
        rankPoints: P.profile.rankPoints,
        rank: De(P.profile.rankPoints).id,
        skins: W.filter((i) => xe(P.profile, i)).map((i) => i.id),
        equipped: P.profile.equipped,
      },
      accountStatus: lt.status,
      fullscreen: !!document.fullscreenElement,
      quality: E.quality,
      adaptiveResolution: E.adaptiveResolution,
      render: R
        ? {
            scene: R.lastScene,
            shadows: R.renderer.shadowMap.enabled,
            spaceVisible: R.upgrades.spaceGroup.visible,
            cockpitVisible: R.upgrades.cockpit.group.visible,
            enemyVehicles: R.upgrades.enemyModels
              .filter((m) => m.visible)
              .map((m) => m.userData.vehicleId),
            mapId: R.mapId,
            textured: !!R.terrain.material.uniforms?.map?.value,
            terrainShader: R.terrain.material.name,
            assets: { ...R.upgrades.assets },
            cinematic: R.upgrades.cinematic.active || false,
            volumetricClouds: R.upgrades.cinematic.cloudsActive || false,
            planarReflection:
              R.ocean.material.uniforms.reflectionStrength.value > 0.5,
            photographedLighting: !!R.upgrades.lighting.outdoor,
            shadowResolution: R.upgrades.shadowSun.shadow.mapSize.x,
            renderBuffer: {
              width: R.upgrades.cinematic.target.width,
              height: R.upgrades.cinematic.target.height,
              samples: R.upgrades.cinematic.target.samples,
            },
            waterVertices: R.ocean.geometry.attributes.position.count,
            planetRelief: !!R.upgrades.planet.material.bumpMap,
            planetClouds: R.upgrades.planetClouds.visible,
            spaceAmbient: R.hemisphere.intensity,
            physicallyBased: R.jet.userData.metal.isMeshStandardMaterial === !0,
            environmentReflections: !!R.scene.environment,
            groundDetails: R.detailMesh.count,
            smokeParticles: R.combat.particles.length,
            hangarYaw: R.hangar.yaw,
            jetRoll: R.jet.rotation.z,
            jetYaw: R.jet.rotation.y,
            airbrakeAngle: R.airbrake.rotation.x,
            wingTrails: R.effects.trails.visible,
            trailSamples: R.effects.count,
            shorelineVertices: R.shoreline.geometry.attributes.position.count,
            groundShadow: R.effects.shadow.visible,
            oceanDistance: R.ocean.material.uniforms.distance.value,
            cameraRoll: R.camera.rotation.z,
            frames: R.frameNumber || 0,
            calls: R.renderer.info.render.calls,
            triangles: R.renderer.info.render.triangles,
            textures: R.renderer.info.memory.textures,
            geometries: R.renderer.info.memory.geometries,
            width: R.renderer.domElement.width,
            height: R.renderer.domElement.height,
            resolutionScale: R.resolutionScale,
            software: R.softwareRenderer,
            enemyInstances: R.enemies.count,
            particles: R.particles.length,
          }
        : null,
    }),
  },
  writable: !1,
});

import "./style.css";
