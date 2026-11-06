import * as T from "./three.js";

// One geometry per instanced tree/rock keeps repeated scenery inexpensive.
export function groundGeometry(mapId) {
  const parts = [];
  function add(g, color, x = 0, y = 0, z = 0) {
    g.translate(x, y, z);
    const colors = new Float32Array(g.attributes.position.count * 3);
    const tint = new T.Color(color);
    for (let i = 0; i < colors.length; i += 3) {
      colors[i] = tint.r;
      colors[i + 1] = tint.g;
      colors[i + 2] = tint.b;
    }
    g.setAttribute("color", new T.Float32BufferAttribute(colors, 3));
    parts.push(g.index ? g.toNonIndexed() : g);
    if (g.index) g.dispose();
  }
  if (mapId === "azure") {
    add(new T.CylinderGeometry(0.065, 0.1, 1.05, 7), 0x72604a, 0, -0.15);
    for (let i = 0; i < 7; i++) {
      const a = i * 2.4;
      const g = new T.SphereGeometry(0.46 + (i % 3) * 0.045, 10, 7);
      const p = g.attributes.position;
      for (let v = 0; v < p.count; v++) {
        const x = p.getX(v),
          y = p.getY(v),
          z = p.getZ(v);
        const s = 1 + Math.sin(x * 27 + z * 19) * Math.cos(y * 21) * 0.12;
        p.setXYZ(v, x * s, y * s * 0.85, z * s);
      }
      g.computeVertexNormals();
      add(
        g,
        [0x486438, 0x526d3b, 0x3f5930][i % 3],
        Math.cos(a) * 0.37,
        0.2 + (i % 3) * 0.25,
        Math.sin(a) * 0.37,
      );
    }
  } else {
    const g = new T.IcosahedronGeometry(1, 2),
      p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i),
        y = p.getY(i),
        z = p.getZ(i);
      const s = 0.85 + 0.15 * Math.sin(x * 7 + z * 4) * Math.cos(y * 9);
      p.setXYZ(i, x * s, y * s, z * s);
    }
    g.computeVertexNormals();
    add(g, 0xffffff);
  }
  const merged = T.mergeGeometries(parts);
  parts.forEach((g) => g.dispose());
  return merged;
}

export function orbitalStation() {
  const group = new T.Group(),
    metal = [],
    panels = [],
    lights = [];
  const add = (list, g, x = 0, y = 0, z = 0, angle = 0) => {
    g.rotateZ(angle);
    g.translate(x, y, z);
    list.push(g.index ? g.toNonIndexed() : g);
    if (g.index) g.dispose();
  };
  add(metal, new T.TorusGeometry(120, 8, 12, 96));
  const hub = new T.CylinderGeometry(21, 21, 95, 20);
  hub.rotateX(Math.PI / 2);
  add(metal, hub);
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    add(
      metal,
      new T.BoxGeometry(106, 5, 6),
      Math.cos(a) * 65,
      Math.sin(a) * 65,
      0,
      a,
    );
    add(
      metal,
      new T.BoxGeometry(24, 15, 24),
      Math.cos(a) * 120,
      Math.sin(a) * 120,
      0,
      a,
    );
    add(
      lights,
      new T.BoxGeometry(12, 2, 1),
      Math.cos(a) * 120,
      Math.sin(a) * 120,
      13,
      a,
    );
  }
  for (const side of [-1, 1]) {
    add(metal, new T.BoxGeometry(180, 6, 5), side * 210);
    for (const y of [-36, 36]) {
      add(panels, new T.BoxGeometry(150, 48, 2), side * 210, y);
      for (let i = -4; i <= 4; i++)
        add(metal, new T.BoxGeometry(0.8, 48, 2.5), side * 210 + i * 17, y);
      for (let i = -2; i <= 2; i++)
        add(metal, new T.BoxGeometry(150, 0.6, 2.5), side * 210, y + i * 11);
    }
  }
  for (const [parts, material] of [
    [
      metal,
      new T.MeshStandardMaterial({
        color: 0x8a969c,
        metalness: 0.65,
        roughness: 0.43,
      }),
    ],
    [
      panels,
      new T.MeshStandardMaterial({
        color: 0x142942,
        metalness: 0.55,
        roughness: 0.28,
      }),
    ],
    [
      lights,
      new T.MeshBasicMaterial({
        color: new T.Color(0x9ad6ff).multiplyScalar(3),
      }),
    ],
  ]) {
    group.add(new T.Mesh(T.mergeGeometries(parts), material));
    parts.forEach((g) => g.dispose());
  }
  group.rotation.set(0.1, -0.22, 0.18);
  group.position.set(-950, 200, -2400);
  return group;
}
