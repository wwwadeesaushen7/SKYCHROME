import * as T from "./three.js";
import { createVehicle, disposeVehicle, AIRCRAFT } from "./fleet.js";
import { Cockpit } from "./cockpit.js";

const hash = (x, y) => {
  let n = Math.imul(x + 17, 374761393) ^ Math.imul(y + 31, 668265263);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
};
function noise(x, y) {
  const ix = Math.floor(x),
    iy = Math.floor(y),
    fx = x - ix,
    fy = y - iy,
    s = fx * fx * (3 - 2 * fx),
    t = fy * fy * (3 - 2 * fy);
  return (
    (hash(ix, iy) * (1 - s) + hash(ix + 1, iy) * s) * (1 - t) +
    (hash(ix, iy + 1) * (1 - s) + hash(ix + 1, iy + 1) * s) * t
  );
}
let groundTexture;
function reliefTexture() {
  if (groundTexture) return groundTexture;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 512;
  const c = canvas.getContext("2d"),
    image = c.createImageData(512, 512);
  for (let y = 0; y < 512; y++)
    for (let x = 0; x < 512; x++) {
      const value =
        135 +
        noise(x / 16, y / 16) * 45 +
        noise(x / 4, y / 4) * 35 +
        hash(x, y) * 24;
      image.data.set([value, value, value, 255], (y * 512 + x) * 4);
    }
  c.putImageData(image, 0, 0);
  groundTexture = new T.CanvasTexture(canvas);
  groundTexture.wrapS = groundTexture.wrapT = T.RepeatWrapping;
  groundTexture.anisotropy = 8;
  return groundTexture;
}
export class UpgradeRenderer {
  constructor(owner, textures, paintFor) {
    this.owner = owner;
    this.textures = textures;
    this.paintFor = paintFor;
    this.cockpit = new Cockpit(owner.camera);
    owner.camera.near = 0.05;
    owner.camera.updateProjectionMatrix();
    owner.scene.add(owner.camera);
    this.shadowSun = new T.DirectionalLight(0xfff4d8, 1.8);
    this.shadowSun.castShadow = true;
    const shadow = this.shadowSun.shadow;
    shadow.mapSize.set(2048, 2048);
    shadow.camera.left = shadow.camera.bottom = -100;
    shadow.camera.right = shadow.camera.top = 100;
    shadow.camera.near = 1;
    shadow.camera.far = 900;
    shadow.bias = -0.00015;
    shadow.normalBias = 0.18;
    shadow.radius = 3;
    owner.scene.add(this.shadowSun, this.shadowSun.target);
    owner.sunLight.intensity = 1.1;
    owner.renderer.shadowMap.enabled = true;
    owner.renderer.shadowMap.type = 2;
    this.enemyModels = [];
    this.spaceGroup = new T.Group();
    this.spaceBackground = new T.Color(0x02040c);
    this.spaceGroup.visible = false;
    owner.scene.add(this.spaceGroup);
    this.buildSpace();
    this.configure(owner.settings);
    this.enhanceTerrain();
  }
  enhanceTerrain() {
    const r = this.owner;
    if (r.terrain === this.lastTerrain) return;
    this.lastTerrain = r.terrain;
    const previous = r.terrain.material;
    const material = new T.MeshStandardMaterial({
      vertexColors: true,
      map: reliefTexture(),
      bumpMap: reliefTexture(),
      bumpScale: 0.8,
      roughness: 0.95,
      metalness: 0.02,
    });
    material.uniforms = {
      ...previous.uniforms,
      map: { value: reliefTexture() },
    };
    material.onBeforeCompile = (shader) => {
      shader.uniforms.worldDistance = r.worldDistance;
      shader.vertexShader =
        "uniform float worldDistance; attribute float islandZ;\n" +
        shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\n transformed.z += mod(mod(islandZ+worldDistance+3400.,3900.)+3900.,3900.)-3400.;",
      );
    };
    material.customProgramCacheKey = () => "skychrome-terrain-2.8";
    r.terrain.material = material;
    r.terrain.receiveShadow = true;
    previous.dispose();
  }
  configure(settings) {
    this.settings = settings;
    const r = this.owner,
      high = settings.quality === "high";
    r.renderer.shadowMap.enabled = settings.quality !== "low";
    const size = high ? 2048 : 1024;
    if (this.shadowSun.shadow.mapSize.x !== size) {
      this.shadowSun.shadow.mapSize.set(size, size);
      this.shadowSun.shadow.map?.dispose();
      this.shadowSun.shadow.map = null;
    }
    this.setVehicle(
      this.space
        ? settings.spacecraft || "xwing"
        : settings.aircraft || "spectre",
    );
  }
  setVehicle(id) {
    if (id === this.id) return;
    this.id = id;
    const r = this.owner,
      old = r.jet,
      jet = createVehicle(
        id,
        this.paintFor(this.settings.finish),
        this.textures,
      );
    r.scene.remove(old);
    r.jet = jet;
    r.scene.add(jet);
    for (const child of [...r.hangar.jet.children])
      if (child !== r.hangar.gear) r.hangar.jet.remove(child);
    for (const child of jet.children) {
      const clone = child.clone();
      if (["flame", "innerFlame"].includes(clone.name)) clone.visible = false;
      r.hangar.jet.add(clone);
    }
    r.hangar.gear.visible = !["xwing", "tie"].includes(id);
    r.flames = jet.children.filter((o) =>
      ["flame", "innerFlame"].includes(o.name),
    );
    r.ailerons = jet.children.filter((o) => o.name === "aileron");
    r.airbrake = jet.children.find((o) => o.name === "airbrake");
    disposeVehicle(old);
    this.cockpit.setVehicle(id);
    r.needsRender = true;
    for (const enemy of this.enemyModels) {
      r.scene.remove(enemy);
      disposeVehicle(enemy);
    }
    this.enemyModels = [];
    for (let i = 0; i < 4; i++) {
      const enemyId = this.space
        ? id === "tie"
          ? "xwing"
          : "tie"
        : AIRCRAFT[(i + 1) % AIRCRAFT.length].id;
      const enemy = createVehicle(
        enemyId,
        { body: this.space ? "#aeb6bd" : "#697a87", accent: "#c96743" },
        this.textures,
      );
      enemy.visible = false;
      this.enemyModels.push(enemy);
      r.scene.add(enemy);
    }
  }
  setOperation(space) {
    const changed = this.space !== space;
    this.space = space;
    if (changed)
      this.setVehicle(
        space
          ? this.settings.spacecraft || "xwing"
          : this.settings.aircraft || "spectre",
      );
    const r = this.owner;
    for (const object of [
      r.sky,
      r.ocean,
      r.terrain,
      r.peaks,
      r.shoreline,
      r.detailMesh,
      r.cloudMesh,
    ])
      object.visible = !space;
    this.spaceGroup.visible = space;
    r.scene.background = space ? this.spaceBackground : null;
    r.scene.fog.density = space ? 0 : this.fogDensity || 0.00075;
    this.shadowSun.intensity = space ? 2.2 : 1.8;
    r.projectileBatches[0].material.color.set(
      space ? (this.id === "tie" ? 0x63ff84 : 0xff6555) : 0xbeffff,
    );
    r.projectileBatches[2].material.color.set(
      space ? (this.id === "tie" ? 0xff6555 : 0x63ff84) : 0xff706f,
    );
    r.renderer.domElement.setAttribute(
      "aria-label",
      space
        ? "3D space combat with X-wings and TIE fighters"
        : `3D flight over ${r.mapId}`,
    );
  }
  buildSpace() {
    const dummy = new T.Object3D();
    this.stars = new T.InstancedMesh(
      new T.SphereGeometry(1, 4, 3),
      new T.MeshBasicMaterial({
        color: 0xd8eaff,
        fog: false,
        toneMapped: false,
      }),
      1400,
    );
    for (let i = 0; i < 1400; i++) {
      const theta = hash(i, 1) * Math.PI * 2,
        u = hash(i, 2) * 2 - 1,
        r = 2800;
      dummy.position.set(
        Math.sqrt(1 - u * u) * Math.cos(theta) * r,
        u * r,
        Math.sqrt(1 - u * u) * Math.sin(theta) * r,
      );
      dummy.scale.setScalar(0.6 + hash(i, 3) * 2.2);
      dummy.updateMatrix();
      this.stars.setMatrixAt(i, dummy.matrix);
    }
    this.stars.frustumCulled = false;
    this.spaceGroup.add(this.stars);
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const c = canvas.getContext("2d"),
      image = c.createImageData(1024, 512);
    for (let y = 0; y < 512; y++)
      for (let x = 0; x < 1024; x++) {
        const n = noise(x / 90, y / 65) + noise(x / 28, y / 24) * 0.35,
          cloud =
            noise(x / 70 + 60, y / 24) * 0.65 + noise(x / 18, y / 10) * 0.35;
        let color =
          n > 0.69
            ? [52 + n * 36, 91 + n * 40, 68 + n * 12]
            : [10, 40 + n * 22, 73 + n * 42];
        if (cloud > 0.69)
          color = color.map(
            (v) => v * (1 - (cloud - 0.69) * 2) + 225 * (cloud - 0.69) * 2,
          );
        if (y < 30 || y > 480) color = [188, 211, 221];
        image.data.set([...color, 255], (y * 1024 + x) * 4);
      }
    c.putImageData(image, 0, 0);
    const tex = new T.CanvasTexture(canvas);
    tex.colorSpace = T.SRGBColorSpace;
    this.planet = new T.Mesh(
      new T.SphereGeometry(850, 64, 48),
      new T.MeshStandardMaterial({ map: tex, roughness: 0.85 }),
    );
    this.planet.position.set(1250, -400, -2900);
    this.planet.rotation.z = 0.28;
    this.spaceGroup.add(this.planet);
    const atmosphere = new T.Mesh(
      new T.SphereGeometry(875, 48, 32),
      new T.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: T.BackSide,
        uniforms: {},
        vertexShader:
          "varying vec3 n; varying vec3 v;void main(){vec4 p=modelViewMatrix*vec4(position,1.);n=normalize(normalMatrix*normal);v=normalize(-p.xyz);gl_Position=projectionMatrix*p;}",
        fragmentShader:
          "varying vec3 n;varying vec3 v;void main(){float a=pow(1.-abs(dot(normalize(n),normalize(v))),3.);gl_FragColor=vec4(.16,.48,1.,a*.6);}",
      }),
    );
    atmosphere.position.copy(this.planet.position);
    this.spaceGroup.add(atmosphere);
    const rockGeometry = new T.IcosahedronGeometry(1, 1),
      positions = rockGeometry.attributes.position;
    for (let j = 0; j < positions.count; j++) {
      const scale = 0.8 + hash(j, 7) * 0.4;
      positions.setXYZ(
        j,
        positions.getX(j) * scale,
        positions.getY(j) * scale,
        positions.getZ(j) * scale,
      );
    }
    rockGeometry.computeVertexNormals();
    this.rocks = new T.InstancedMesh(
      rockGeometry,
      new T.MeshStandardMaterial({ color: 0x676775, roughness: 0.96 }),
      90,
    );
    this.rocks.frustumCulled = false;
    this.spaceGroup.add(this.rocks);
    this.dummy = dummy;
    // Very distant sun and orbital station are scenery outside the combat corridor.
    const sun = new T.Mesh(
      new T.SphereGeometry(45, 16, 12),
      new T.MeshBasicMaterial({ color: 0xffe5bc, toneMapped: false }),
    );
    sun.position.set(-1900, 900, -3200);
    this.spaceGroup.add(sun);
    const station = new T.Group();
    station.position.set(-950, 200, -2400);
    const ring = new T.Mesh(
      new T.TorusGeometry(120, 10, 8, 64),
      new T.MeshStandardMaterial({
        color: 0x87939e,
        metalness: 0.7,
        roughness: 0.45,
      }),
    );
    station.add(ring);
    for (const x of [-1, 1]) {
      const panel = new T.Mesh(
        new T.BoxGeometry(150, 45, 4),
        new T.MeshStandardMaterial({
          color: 0x354965,
          metalness: 0.6,
          roughness: 0.5,
        }),
      );
      panel.position.set(x * 185, 0, 0);
      station.add(panel);
    }
    this.spaceGroup.add(station);
  }
  prepare(state, deck) {
    const r = this.owner;
    this.enhanceTerrain();
    if (!this.space) this.fogDensity = r.scene.fog.density || this.fogDensity;
    this.setOperation(state.mission.mode === "space");
    this.cockpit.group.visible = !deck && this.cockpit.group.visible;
  }
  update(state, cockpit, time) {
    const r = this.owner,
      p = state.player;
    this.cockpit.update(state, cockpit);
    r.enemies.visible = false;
    this.enemyModels.forEach((model, i) => {
      const e = state.enemies[i];
      model.visible = !!e;
      if (!e) return;
      model.position.set(e.x, e.y, e.z);
      model.rotation.set(e.pitch || 0, e.yaw ?? Math.PI, e.bank || 0);
    });
    this.shadowSun.position
      .copy(r.sunLight.position)
      .multiplyScalar(350)
      .add(new T.Vector3(p.x, p.y, 0));
    this.shadowSun.target.position.set(p.x, 0, 0);
    this.shadowSun.target.updateMatrixWorld();
    this.shadowSun.color.copy(r.sunLight.color);
    if (this.space) {
      r.effects.shadow.visible = false;
      r.effects.trails.visible = false;
      this.stars.position.copy(r.camera.position);
      this.planet.rotation.y = time * 0.004;
      for (let i = 0; i < 90; i++) {
        this.dummy.position.set(
          (i % 2 ? -1 : 1) * (680 + hash(i, 4) * 1000),
          -200 + hash(i, 5) * 900,
          ((hash(i, 6) * 4000 + state.distance * 0.55) % 4400) - 3700,
        );
        this.dummy.rotation.set(i * 0.3, i * 0.7 + time * 0.015, i * 0.8);
        this.dummy.scale.setScalar(4 + hash(i, 9) * 25);
        this.dummy.updateMatrix();
        this.rocks.setMatrixAt(i, this.dummy.matrix);
      }
      this.rocks.instanceMatrix.needsUpdate = true;
    }
  }
}
