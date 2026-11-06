import * as T from "./three.js";

export function instrumentTelemetry(state) {
  return {
    speed: Math.round(state.speed * 3.6),
    altitude: Math.round(state.player.y + 2),
    verticalSpeed: Math.round(state.player.vy),
    roll: state.player.bank + state.player.roll,
    pitch: state.player.pitch,
    hull: Math.ceil(state.health),
    energy: Math.ceil(state.energy),
    load: state.flight.load,
    missileReady: state.missileCooldown <= 0,
    targets: state.enemies
      .filter((e) => !e.dead)
      .map((e) => ({ x: e.x - state.player.x, z: e.z })),
    space: state.mission.mode === "space",
  };
}

export class Cockpit {
  constructor(camera) {
    this.camera = camera;
    this.group = new T.Group();
    this.group.name = "working-cockpit";
    camera.add(this.group);
    this.frame = new T.Group();
    this.group.add(this.frame);
    this.dark = new T.MeshStandardMaterial({
      color: 0x10191e,
      metalness: 0.55,
      roughness: 0.6,
    });
    this.trim = new T.MeshStandardMaterial({
      color: 0x42515b,
      metalness: 0.8,
      roughness: 0.4,
    });
    this.canvas = document.createElement("canvas");
    this.canvas.width = 1024;
    this.canvas.height = 384;
    this.context = this.canvas.getContext("2d");
    this.texture = new T.CanvasTexture(this.canvas);
    this.texture.colorSpace = T.SRGBColorSpace;
    const display = new T.Mesh(
      new T.PlaneGeometry(2.5, 0.65),
      new T.MeshBasicMaterial({ map: this.texture, toneMapped: false }),
    );
    display.position.set(0, -0.78, -2.5);
    display.rotation.x = -0.1;
    this.group.add(display);
    const dash = new T.Mesh(new T.BoxGeometry(3.15, 0.9, 0.62), this.dark);
    dash.position.set(0, -1.02, -2.9);
    this.group.add(dash);
    // Raised glare shield and side consoles remain actual 3D surfaces.
    const lip = new T.Mesh(new T.BoxGeometry(3.25, 0.09, 0.8), this.dark);
    lip.position.set(0, -0.43, -2.9);
    this.group.add(lip);
    // Raised display bezel, fasteners and physical controls catch the cabin light.
    const bezelParts = [];
    const bezel = (g, x, y, z) => {
      g.translate(x, y, z);
      bezelParts.push(g);
    };
    for (const side of [-1, 1]) {
      bezel(new T.BoxGeometry(0.045, 0.72, 0.045), side * 1.28, -0.78, -2.48);
      bezel(
        new T.BoxGeometry(2.6, 0.035, 0.045),
        0,
        -0.78 + side * 0.36,
        -2.48,
      );
      for (let i = 0; i < 5; i++) {
        const knob = new T.CylinderGeometry(0.025, 0.025, 0.035, 12);
        knob.rotateX(Math.PI / 2);
        bezel(knob, side * (0.3 + i * 0.19), -1.17, -2.44);
      }
    }
    const controls = new T.Mesh(T.mergeGeometries(bezelParts), this.trim);
    this.group.add(controls);
    this.bezel = controls;
    bezelParts.forEach((g) => g.dispose());
    for (const side of [-1, 1]) {
      const console = new T.Mesh(new T.BoxGeometry(0.56, 0.4, 2.8), this.dark);
      console.position.set(side * 1.25, -1.15, -0.6);
      this.group.add(console);
      for (let j = 0; j < 10; j++) {
        const toggle = new T.Mesh(
          new T.BoxGeometry(0.045, 0.08, 0.07),
          j % 3 ? this.trim : new T.MeshBasicMaterial({ color: 0xb8dfc7 }),
        );
        toggle.position.set(side * 1.25, -0.91, -1.7 + j * 0.2);
        this.group.add(toggle);
      }
    }
    this.hudCanvas = document.createElement("canvas");
    this.hudCanvas.width = 512;
    this.hudCanvas.height = 320;
    this.hudTexture = new T.CanvasTexture(this.hudCanvas);
    this.hudTexture.colorSpace = T.SRGBColorSpace;
    const hud = new T.Mesh(
      new T.PlaneGeometry(1.3, 0.8),
      new T.MeshBasicMaterial({
        map: this.hudTexture,
        transparent: true,
        depthWrite: false,
        toneMapped: false,
      }),
    );
    hud.position.set(0, -0.02, -2.2);
    this.group.add(hud);
    this.display = display;
    this.dash = dash;
    this.lip = lip;
    this.hud = hud;
    this.lastUpdate = -1;
    this.setVehicle("spectre");
  }
  setVehicle(id) {
    if (this.id === id) return;
    this.id = id;
    while (this.frame.children.length) {
      const o = this.frame.children[0];
      this.frame.remove(o);
      o.geometry?.dispose();
    }
    const add = (g, x, y, z, rotation = 0) => {
      const o = new T.Mesh(g, this.trim);
      o.position.set(x, y, z);
      o.rotation.z = rotation;
      this.frame.add(o);
      return o;
    };
    if (id === "tie") {
      add(new T.TorusGeometry(1.55, 0.065, 8, 8), 0, 0.06, -2.35);
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4;
        add(
          new T.BoxGeometry(0.045, 1.1, 0.06),
          Math.cos(a) * 1.1,
          0.06 + Math.sin(a) * 1.1,
          -2.35,
          a - Math.PI / 2,
        );
      }
    } else {
      for (const side of [-1, 1]) {
        add(
          new T.BoxGeometry(0.055, 2.2, 0.08),
          side * 1.1,
          0.16,
          -1.9,
          side * 0.27,
        );
        add(
          new T.BoxGeometry(0.055, 1.5, 0.06),
          side * 0.65,
          0.25,
          -2.7,
          side * 0.45,
        );
      }
      add(new T.TorusGeometry(1.3, 0.04, 6, 48, Math.PI), 0, 0.14, -1.9);
      add(new T.BoxGeometry(0.7, 0.055, 0.06), 0, 0.925, -2.7);
      if (id === "xwing")
        add(new T.BoxGeometry(0.07, 1.8, 0.05), 0, 0.75, -2.65);
    }
  }
  update(state, active) {
    const widthScale = Math.min(1, this.camera.aspect / 1.15);
    const portrait = this.camera.aspect < 0.8;
    this.group.scale.x = widthScale;
    // Preserve the display aspect ratio in portrait and keep it above the sticks.
    this.display.scale.y = widthScale;
    this.display.position.y = portrait ? -0.39 : -0.78;
    this.bezel.scale.y = widthScale;
    this.bezel.position.y = this.display.position.y + 0.78 * widthScale;
    this.dash.scale.y = widthScale;
    this.dash.position.y = portrait ? -0.45 : -1.02;
    this.lip.position.y = portrait ? -0.22 : -0.43;
    this.hud.scale.y = widthScale;
    this.group.visible = active && state.health > 0;
    if (!this.group.visible) return;
    const now = performance.now();
    if (now - this.lastUpdate < 80) return;
    this.lastUpdate = now;
    const d = instrumentTelemetry(state);
    this.telemetry = d;
    const c = this.context,
      cyan = d.space ? "#ffba78" : "#a2efdf";
    c.fillStyle = "#080f15";
    c.fillRect(0, 0, 1024, 384);
    c.strokeStyle = "#354850";
    c.lineWidth = 3;
    c.strokeRect(8, 8, 1008, 368);
    c.fillStyle = cyan;
    c.font = "16px monospace";
    c.textAlign = "left";
    c.fillText(this.id.toUpperCase() + " / FLIGHT SYSTEMS", 28, 35);
    const gauge = (label, value, x, y) => {
      c.fillStyle = "#8bafb6";
      c.font = "16px monospace";
      c.fillText(label, x, y);
      c.fillStyle = cyan;
      c.font = "bold 38px monospace";
      c.fillText(String(value), x, y + 43);
    };
    gauge(d.space ? "VELOCITY km/h" : "IAS km/h", d.speed, 30, 90);
    gauge(d.space ? "SECTOR Y m" : "ALTITUDE m", d.altitude, 30, 200);
    gauge("HULL %", d.hull, 780, 90);
    gauge("ENERGY %", d.energy, 780, 200);
    // Artificial horizon follows the actual pitch and bank, not decorative animation.
    c.save();
    c.beginPath();
    c.arc(402, 195, 124, 0, Math.PI * 2);
    c.clip();
    c.translate(402, 195);
    c.rotate(-d.roll);
    const shift = d.pitch * 160;
    c.fillStyle = "#255a7e";
    c.fillRect(-200, -300, 400, 300 + shift);
    c.fillStyle = "#805a37";
    c.fillRect(-200, shift, 400, 300);
    c.strokeStyle = "#f4f6e8";
    c.lineWidth = 2;
    for (let i = -4; i <= 4; i++) {
      const y = shift + i * 27;
      c.beginPath();
      c.moveTo(-40, y);
      c.lineTo(40, y);
      c.stroke();
    }
    c.restore();
    c.strokeStyle = cyan;
    c.beginPath();
    c.arc(402, 195, 124, 0, Math.PI * 2);
    c.stroke();
    c.strokeStyle = "#ffd291";
    c.lineWidth = 4;
    c.beginPath();
    c.moveTo(345, 195);
    c.lineTo(385, 195);
    c.lineTo(402, 210);
    c.lineTo(419, 195);
    c.lineTo(459, 195);
    c.stroke();
    c.strokeStyle = "#2a5a52";
    c.lineWidth = 1;
    for (const r of [32, 65, 98]) {
      c.beginPath();
      c.arc(645, 195, r, 0, Math.PI * 2);
      c.stroke();
    }
    c.beginPath();
    c.moveTo(547, 195);
    c.lineTo(743, 195);
    c.moveTo(645, 97);
    c.lineTo(645, 293);
    c.stroke();
    c.fillStyle = cyan;
    c.beginPath();
    c.moveTo(645, 190);
    c.lineTo(640, 201);
    c.lineTo(650, 201);
    c.fill();
    c.fillStyle = "#ff795b";
    for (const t of d.targets) {
      c.beginPath();
      c.arc(
        645 + Math.max(-90, Math.min(90, t.x * 0.3)),
        195 + Math.max(-90, Math.min(90, t.z * 0.13)),
        4,
        0,
        Math.PI * 2,
      );
      c.fill();
    }
    c.fillStyle = cyan;
    c.font = "16px monospace";
    c.fillText(
      `V/S ${d.verticalSpeed >= 0 ? "+" : ""}${d.verticalSpeed} m/s`,
      30,
      345,
    );
    c.fillText(`${d.load.toFixed(1)} G`, 300, 345);
    c.fillText(
      d.missileReady ? "MISSILE READY" : "MISSILE RECHARGING",
      540,
      345,
    );
    c.fillText("RADAR", 610, 75);
    this.texture.needsUpdate = true;
    const h = this.hudCanvas.getContext("2d");
    h.clearRect(0, 0, 512, 320);
    h.strokeStyle = "#b8ffbd";
    h.fillStyle = "#b8ffbd";
    h.lineWidth = 2;
    h.font = "16px monospace";
    h.textAlign = "center";
    h.fillText(d.space ? "ORBITAL FLIGHT" : "FLIGHT VECTOR", 256, 32);
    h.fillText(d.speed, 45, 150);
    h.fillText(d.altitude, 460, 150);
    h.beginPath();
    h.arc(256, 160, 9, 0, Math.PI * 2);
    h.moveTo(227, 160);
    h.lineTo(247, 160);
    h.moveTo(265, 160);
    h.lineTo(285, 160);
    h.stroke();
    h.save();
    h.translate(256, 160);
    h.rotate(-d.roll);
    for (let i = -2; i <= 2; i++) {
      let y = i * 42 + d.pitch * 120;
      h.beginPath();
      h.moveTo(-65, y);
      h.lineTo(-20, y);
      h.moveTo(20, y);
      h.lineTo(65, y);
      h.stroke();
    }
    h.restore();
    this.hudTexture.needsUpdate = true;
  }
}
