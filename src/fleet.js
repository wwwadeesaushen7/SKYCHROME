import * as T from "./three.js";

export const AIRCRAFT = Object.freeze([
  {
    id: "spectre",
    name: "F/A–27 Spectre",
    role: "Stealth multirole",
    detail: "Twin engines · diamond wings · canted twin tails",
    number: "01",
  },
  {
    id: "kestrel",
    name: "F–19 Kestrel",
    role: "Delta interceptor",
    detail: "Single engine · delta wing · forward canards",
    number: "02",
  },
  {
    id: "thunderbolt",
    name: "A–12 Thunderbolt",
    role: "Close air support",
    detail: "Straight wings · twin engine pods · heavy nose cannon",
    number: "03",
  },
]);
export const SPACECRAFT = Object.freeze([
  {
    id: "xwing",
    name: "T–65 X-wing",
    role: "Alliance starfighter",
    detail: "Four laser cannons · split S-foils · astromech",
    number: "04",
  },
  {
    id: "tie",
    name: "TIE fighter",
    role: "Imperial starfighter",
    detail: "Twin ion engines · hexagonal solar panels",
    number: "05",
  },
]);
export const vehicleInfo = (id) =>
  [...AIRCRAFT, ...SPACECRAFT].find((v) => v.id === id) || AIRCRAFT[0];

export function vehicleSilhouette(id) {
  const shapes = {
    spectre:
      '<path d="M60 8 69 44 104 77 80 74 71 68 74 96 62 89 58 89 46 96 49 68 40 74 16 77 51 44Z"/>',
    kestrel:
      '<path d="M60 6 65 37 80 44 66 47 105 89 65 83 63 99 57 99 55 83 15 89 54 47 40 44 55 37Z"/>',
    thunderbolt:
      '<path d="M56 8 64 8 67 48 108 52 108 64 67 65 66 80 86 85 86 94 63 92 60 101 57 92 34 94 34 85 54 80 53 65 12 64 12 52 53 48Z"/><rect x="44" y="66" width="9" height="24"/><rect x="67" y="66" width="9" height="24"/>',
    xwing:
      '<path d="M58 6 62 6 67 50 103 62 103 75 68 68 66 98 54 98 52 68 17 75 17 62 53 50Z"/><path d="M15 32h4v54h-4zm86 0h4v54h-4zM39 50h9v38h-9zm33 0h9v38h-9z"/>',
    tie: '<path d="M9 25 24 8 34 25 34 85 24 102 9 85ZM86 25 96 8 111 25 111 85 96 102 86 85Z"/><circle cx="60" cy="55" r="19"/><path d="M30 51h60v8H30z"/>',
  };
  return `<svg viewBox="0 0 120 110" aria-hidden="true" fill="currentColor">${shapes[id] || shapes.spectre}</svg>`;
}

function wing(points, material, thickness = 0.16) {
  const shape = new T.Shape();
  points.forEach(([x, z], i) => (i ? shape.lineTo(x, z) : shape.moveTo(x, z)));
  shape.closePath();
  const g = new T.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.035,
    bevelThickness: 0.025,
  });
  g.rotateX(Math.PI / 2);
  return new T.Mesh(g, material);
}
function loft(stations, material) {
  // Smooth station interpolation preserves each airframe's proportions while
  // removing the six straight fuselage sections of the earlier models.
  const original = stations;
  stations = [];
  const cubic = (a, b, c, d, t) =>
    0.5 *
    (2 * b +
      (-a + c) * t +
      (2 * a - 5 * b + 4 * c - d) * t * t +
      (-a + 3 * b - 3 * c + d) * t * t * t);
  for (let i = 0; i < original.length - 1; i++)
    for (let j = 0; j < 4; j++) {
      const t = j / 4,
        p0 = original[Math.max(0, i - 1)],
        p1 = original[i],
        p2 = original[i + 1],
        p3 = original[Math.min(original.length - 1, i + 2)];
      stations.push(
        p1.map((_, k) =>
          k
            ? Math.max(0.018, cubic(p0[k], p1[k], p2[k], p3[k], t))
            : cubic(p0[k], p1[k], p2[k], p3[k], t),
        ),
      );
    }
  stations.push(original.at(-1));
  const pos = [],
    indices = [],
    segments = 40;
  for (const [z, w, h] of stations)
    for (let j = 0; j < segments; j++) {
      const a = (j / segments) * Math.PI * 2;
      pos.push(Math.cos(a) * w, Math.sin(a) * h, z);
    }
  for (let i = 0; i < stations.length - 1; i++)
    for (let j = 0; j < segments; j++) {
      const a = i * segments + j,
        b = i * segments + ((j + 1) % segments),
        c = a + segments,
        d = b + segments;
      indices.push(a, c, b, b, c, d);
    }
  const g = new T.BufferGeometry();
  g.setAttribute("position", new T.Float32BufferAttribute(pos, 3));
  g.setIndex(indices);
  g.computeVertexNormals();
  // Planar panel UVs give separate paint finishes the same physical detailing.
  const uv = [];
  for (let i = 0; i < pos.length; i += 3)
    uv.push(pos[i] * 0.2, pos[i + 2] * 0.15);
  g.setAttribute("uv", new T.Float32BufferAttribute(uv, 2));
  return new T.Mesh(g, material);
}
export function createVehicle(id, paint, textures) {
  const root = new T.Group();
  root.name = id;
  const metal = new T.MeshPhysicalMaterial({
    color: paint.body,
    metalness: 0.22,
    roughness: 0.42,
    clearcoat: 0.28,
    clearcoatRoughness: 0.27,
    map: textures?.panels || null,
    roughnessMap: textures?.paintRoughness || null,
  });
  const accent = new T.MeshStandardMaterial({
    color: paint.accent,
    metalness: 0.5,
    roughness: 0.4,
  });
  const dark = new T.MeshStandardMaterial({
    color: 0x18212a,
    metalness: 0.65,
    roughness: 0.5,
  });
  const chrome = new T.MeshStandardMaterial({
    color: 0x84939a,
    metalness: 0.85,
    roughness: 0.3,
  });
  const glass = new T.MeshPhysicalMaterial({
    color: 0x809eaa,
    metalness: 0,
    roughness: 0.08,
    clearcoat: 1,
    transparent: id !== "tie",
    opacity: id === "tie" ? 1 : 0.67,
    depthWrite: id === "tie",
    ior: 1.5,
  });
  const glow = new T.MeshBasicMaterial({
    color: id === "tie" ? 0x78ff92 : 0x79caff,
    toneMapped: false,
    transparent: true,
    opacity: 0.86,
    depthWrite: false,
    blending: 2,
  });
  glow.color.multiplyScalar(3.2);
  const heatMetal = new T.MeshStandardMaterial({
    color: 0x706051,
    metalness: 0.85,
    roughness: 0.46,
  });
  const pilotMaterial = new T.MeshStandardMaterial({
    color: 0x3f4940,
    roughness: 0.86,
  });
  const add = (g, m, x = 0, y = 0, z = 0) => {
    const o = new T.Mesh(g, m);
    o.position.set(x, y, z);
    root.add(o);
    return o;
  };
  const box = (m, x, y, z, w, h, d) =>
    add(new T.BoxGeometry(w, h, d), m, x, y, z);
  const tube = (m, x, y, z, r1, r2, len) => {
    const o = add(new T.CylinderGeometry(r1, r2, len, 20), m, x, y, z);
    o.rotation.x = Math.PI / 2;
    return o;
  };
  const fin = (x, z, slant = 0, size = 1) => {
    const o = wing(
      [
        [0, 0],
        [0, -2.5],
        [2.8, -0.7],
        [2.3, 1.5],
      ],
      metal,
      0.12,
    );
    o.rotation.z = Math.PI / 2 + slant;
    o.position.set(x, 0.4, z);
    o.scale.setScalar(size);
    root.add(o);
    return o;
  };
  const nozzle = (x, y, z, r = 0.55) => {
    tube(heatMetal, x, y, z, r, r * 0.92, 0.7);
    tube(dark, x, y, z + 0.39, r * 0.8, r * 0.8, 0.05);
    const flame = tube(glow, x, y, z + 0.6, r * 0.61, 0.05, 1.2);
    flame.name = "innerFlame";
    for (let j = 0; j < 12; j++) {
      const a = (j / 12) * Math.PI * 2;
      box(dark, x + Math.cos(a) * r, y + Math.sin(a) * r, z, 0.025, 0.04, 0.65);
    }
    for (let j = 0; j < 3; j++) {
      const ring = add(
        new T.TorusGeometry(r * (0.76 - j * 0.11), 0.025, 5, 24),
        heatMetal,
        x,
        y,
        z + 0.1 - j * 0.13,
      );
    }
  };
  const canopy = (x, y, z, w, h, d) => {
    const o = add(new T.SphereGeometry(1, 40, 28), glass, x, y, z);
    o.scale.set(w, h, d);
    const frame = add(new T.TorusGeometry(w, 0.045, 5, 32), dark, x, y, z);
    frame.rotation.x = Math.PI / 2;
    frame.scale.y = d / w;
    for (const end of [-1, 1]) {
      const arch = add(
        new T.TorusGeometry(w * 0.86, 0.027, 5, 28, Math.PI),
        metal,
        x,
        y - 0.08,
        z + end * d * 0.52,
      );
      arch.scale.y = h / w;
    }
    box(dark, x, y - 0.2, z + 0.45, w * 0.85, h * 0.9, 0.38);
    const helmet = add(
      new T.SphereGeometry(0.21, 20, 12),
      pilotMaterial,
      x,
      y + 0.19,
      z + 0.1,
    );
    const visor = add(
      new T.SphereGeometry(0.215, 16, 10, 0, Math.PI),
      dark,
      x,
      y + 0.2,
      z + 0.08,
    );
    visor.rotation.y = Math.PI;
    box(pilotMaterial, x, y - 0.13, z + 0.13, 0.36, 0.4, 0.28);
  };
  const addWing = (pts, y = 0) => {
    const o = wing(pts, metal);
    o.position.y = y;
    root.add(o);
    return o;
  };
  if (id === "tie") {
    add(new T.SphereGeometry(1.8, 32, 24), metal);
    const front = add(
      new T.CylinderGeometry(1.35, 1.35, 0.1, 8),
      glass,
      0,
      0,
      -1.84,
    );
    front.rotation.x = Math.PI / 2;
    const ring = add(
      new T.TorusGeometry(1.35, 0.09, 6, 8),
      chrome,
      0,
      0,
      -1.91,
    );
    for (let j = 0; j < 8; j++) {
      const a = (j * Math.PI) / 4;
      const spoke = box(
        chrome,
        Math.cos(a) * 0.72,
        Math.sin(a) * 0.72,
        -1.94,
        1.5,
        0.055,
        0.05,
      );
      spoke.rotation.z = a;
    }
    for (const side of [-1, 1]) {
      const arm = tube(chrome, side * 3.1, 0, 0, 0.38, 0.5, 3.2);
      arm.rotation.set(0, 0, Math.PI / 2);
      const panel = add(
        new T.CylinderGeometry(4.7, 4.7, 0.22, 6),
        dark,
        side * 4.5,
        0,
        0,
      );
      panel.rotation.z = Math.PI / 2;
      const rim = add(
        new T.TorusGeometry(4.7, 0.14, 6, 6),
        metal,
        side * 4.63,
        0,
        0,
      );
      rim.rotation.y = Math.PI / 2;
      for (let j = 0; j < 6; j++) {
        const a = (j * Math.PI) / 3;
        const spar = box(
          chrome,
          side * 4.65,
          Math.sin(a) * 2.35,
          Math.cos(a) * 2.35,
          0.15,
          0.11,
          4.7,
        );
        spar.rotation.x = -a;
      }
      for (let j = -3; j <= 3; j++)
        box(
          metal,
          side * 4.66,
          j * 0.85,
          0,
          0.025,
          0.025,
          6.8 - Math.abs(j) * 0.8,
        );
      tube(glow, side * 0.65, -0.6, -1.8, 0.1, 0.1, 0.45);
      nozzle(side * 0.55, 0.1, 1.5, 0.24);
    }
  } else if (id === "xwing") {
    root.add(
      loft(
        [
          [-9, 0.05, 0.08],
          [-7, 0.45, 0.35],
          [-3, 0.7, 0.65],
          [2, 0.8, 0.7],
          [5, 0.65, 0.6],
        ],
        metal,
      ),
    );
    canopy(0, 0.65, -2, 0.65, 0.6, 1.7);
    box(accent, 0, 0.45, -6, 0.12, 0.025, 3.8);
    const droid = add(new T.SphereGeometry(0.43, 16, 12), chrome, 0, 1.05, 1.1);
    box(accent, 0, 1.19, 0.76, 0.25, 0.18, 0.1);
    for (const side of [-1, 1])
      for (const up of [-1, 1]) {
        const w = addWing(
          [
            [side * 0.6, -1.5],
            [side * 6, -0.5],
            [side * 6, 2],
            [side * 0.6, 3.4],
          ],
          up * 0.35,
        );
        w.rotation.z = side * up * 0.22;
        const y = up * 1.3;
        tube(chrome, side * 1.65, up * 0.7, 1.7, 0.5, 0.6, 4.5);
        nozzle(side * 1.65, up * 0.7, 4, 0.48);
        tube(dark, side * 6, y, -2, 0.12, 0.16, 6.7);
        tube(chrome, side * 6, y, -5.2, 0.06, 0.08, 1.3);
        box(accent, side * 4.6, up * 0.95, 0.5, 1.3, 0.1, 2.1);
      }
  } else {
    const delta = id === "kestrel",
      attack = id === "thunderbolt";
    root.add(
      loft(
        [
          [-8.7, 0.03, 0.03],
          [-6.6, 0.42, 0.42],
          [-4, 0.75, 0.65],
          [-1, attack ? 1 : 1.1, 0.8],
          [2, delta ? 0.85 : 1.15, 0.65],
          [5.7, delta ? 0.58 : 0.82, 0.45],
        ],
        metal,
      ),
    );
    canopy(0, 0.72, -3.3, 0.68, 0.75, 1.65);
    box(accent, 0, 0.65, -6, 0.13, 0.045, 2.4);
    for (const side of [-1, 1]) {
      const pts = attack
        ? [
            [side * 0.8, -0.7],
            [side * 8, -0.3],
            [side * 8, 1.5],
            [side * 1, 2.1],
          ]
        : delta
          ? [
              [side * 0.7, -4],
              [side * 7, 4],
              [side * 0.7, 4.8],
            ]
          : [
              [side * 0.8, -3],
              [side * 6.8, 1.7],
              [side * 5.8, 3.2],
              [side * 0.9, 1.9],
            ];
      addWing(pts, attack ? -0.15 : 0);
      const stripe = box(
        accent,
        side * (attack ? 5 : 4),
        0.07,
        attack ? 0.7 : 1.8,
        0.35,
        0.05,
        attack ? 1.5 : 2.3,
      );
      if (delta) {
        addWing(
          [
            [side * 0.65, -4.3],
            [side * 2.8, -3.3],
            [side * 2, -2.4],
            [side * 0.6, -2.8],
          ],
          0.35,
        );
      } else {
        addWing(
          [
            [side * 0.7, 3.8],
            [side * 3.7, 4.5],
            [side * 3.5, 5.5],
            [side * 0.7, 5.5],
          ],
          0.45,
        );
        fin(
          side * (attack ? 2.3 : 1.1),
          4.3,
          side * (attack ? 0 : 0.25),
          attack ? 0.72 : 1,
        );
      }
      if (attack) {
        tube(metal, side * 2, 1.1, 3, 0.8, 0.9, 4);
        tube(dark, side * 2, 1.1, 1, 0.7, 0.7, 0.12);
        nozzle(side * 2, 1.1, 5, 0.75);
      } else if (!delta) {
        tube(dark, side * 1, -0.15, -0.5, 0.48, 0.6, 3.5);
        nozzle(side * 0.78, -0.1, 5.8);
      }
      // Hardpoints, rails, missiles and separate movable control surfaces.
      for (const x of attack ? [3.4, 5.5, 6.8] : [3.5, 5.2]) {
        box(dark, side * x, -0.35, 1, 0.15, 0.5, 1.2);
        tube(chrome, side * x, -0.72, 0.3, 0.1, 0.16, 2.8);
        tube(dark, side * x, -0.72, -1.35, 0.11, 0, 0.5);
        box(dark, side * x, -0.72, 1.45, 0.54, 0.035, 0.35);
        box(dark, side * x, -0.72, 1.45, 0.035, 0.54, 0.35);
      }
      const aileron = box(
        metal,
        side * (attack ? 6.1 : 5),
        0,
        attack ? 1.45 : 3,
        2,
        0.08,
        0.5,
      );
      aileron.name = "aileron";
      aileron.userData.side = side;
      const nav = add(
        new T.SphereGeometry(0.085, 6, 4),
        new T.MeshBasicMaterial({ color: side < 0 ? 0xff3b39 : 0x7cffad }),
        side * (attack ? 8 : 6.5),
        0.12,
        1.5,
      );
      for (let j = 0; j < 4; j++)
        box(dark, side * 0.82, 0.1, -1.5 + j * 0.25, 0.06, 0.4, 0.07);
    }
    if (delta) {
      fin(0, 3.8, 0, 1.1);
      tube(dark, 0, -0.7, -1, 0.55, 0.48, 2);
      nozzle(0, 0, 5.8, 0.62);
    }
    if (attack) {
      for (let j = 0; j < 7; j++) {
        const a = (j / 7) * Math.PI * 2;
        tube(
          dark,
          Math.cos(a) * 0.13,
          -0.28 + Math.sin(a) * 0.13,
          -8,
          0.045,
          0.045,
          1.8,
        );
      }
    }
    const brake = box(metal, 0, 0.68, 1.4, 0.8, 0.07, 1.3);
    brake.name = "airbrake";
  }
  if (!root.children.find((o) => o.name === "airbrake")) {
    const brake = new T.Group();
    brake.name = "airbrake";
    root.add(brake);
  }
  // Merge only static geometry by material. Keep moving parts separately addressable.
  const groups = new Map();
  for (const mesh of [...root.children]) {
    if (!mesh.isMesh || mesh.name) continue;
    mesh.updateMatrix();
    const g = mesh.geometry.index
      ? mesh.geometry.toNonIndexed()
      : mesh.geometry.clone();
    g.applyMatrix4(mesh.matrix);
    const uv = [];
    for (let j = 0; j < g.attributes.position.count; j++) {
      const p = g.attributes.position,
        n = g.attributes.normal;
      const nx = Math.abs(n.getX(j)),
        ny = Math.abs(n.getY(j)),
        nz = Math.abs(n.getZ(j));
      if (ny >= nx && ny >= nz) uv.push(p.getX(j) * 0.2, p.getZ(j) * 0.15);
      else if (nx >= nz) uv.push(p.getZ(j) * 0.15, p.getY(j) * 0.25);
      else uv.push(p.getX(j) * 0.2, p.getY(j) * 0.25);
    }
    g.setAttribute("uv", new T.Float32BufferAttribute(uv, 2));
    if (!groups.has(mesh.material)) groups.set(mesh.material, []);
    groups.get(mesh.material).push(g);
    root.remove(mesh);
    mesh.geometry.dispose();
  }
  for (const [mat, geometries] of groups) {
    const g = T.mergeGeometries(geometries);
    root.add(new T.Mesh(g, mat));
    geometries.forEach((g) => g.dispose());
  }
  root.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = !o.material.isMeshBasicMaterial;
      o.receiveShadow = true;
    }
  });
  root.userData = { metal, accent, vehicleId: id };
  return root;
}
export function disposeVehicle(root) {
  const materials = new Set(),
    geometries = new Set();
  root.traverse((o) => {
    if (o.geometry) geometries.add(o.geometry);
    if (o.material) materials.add(o.material);
  });
  geometries.forEach((g) => g.dispose());
  materials.forEach((m) => m.dispose());
}
