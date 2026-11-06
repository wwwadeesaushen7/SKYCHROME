import * as T from "./three.js";
import { createVehicle, disposeVehicle, AIRCRAFT } from "./fleet.js";
import { Cockpit } from "./cockpit.js";

import {
  hash,
  surfaceTextures,
  terrainMaterial,
  upgradeSky,
  upgradeWater,
  planetTextures,
  nebulaTexture,
} from "./materials.js";

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
    upgradeSky(owner.sky.material);
    upgradeWater(owner.ocean.material);
    this.configure(owner.settings);
    this.enhanceTerrain();
  }
  enhanceTerrain() {
    const r = this.owner;
    if (r.terrain === this.lastTerrain) return;
    this.lastTerrain = r.terrain;
    const previous = r.terrain.material;
    const material = terrainMaterial(previous, r.worldDistance, r.mapId);
    r.terrain.material = material;
    r.terrain.receiveShadow = true;
    previous.dispose();
  }
  configure(settings) {
    this.settings = settings;
    const r = this.owner,
      high = settings.quality === "high";
    const segments = high ? 192 : settings.quality === "low" ? 48 : 128;
    if (segments !== this.waterSegments) {
      r.ocean.geometry.dispose();
      r.ocean.geometry = new T.PlaneGeometry(16000, 16000, segments, segments);
      this.waterSegments = segments;
    }
    r.sky.material.uniforms.detail.value = settings.quality === "low" ? 0 : 1;
    this.planetClouds.visible = settings.quality !== "low";
    this.stars.count = high ? 1400 : settings.quality === "low" ? 700 : 1100;
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
    r.hemisphere.intensity = space ? 0.16 : 0.95;
    r.scene.environmentIntensity = space ? 0.16 : 0.65;
    r.sunLight.intensity = space ? 2.4 : 1.1;
    if (space) {
      r.sunLight.position.set(-0.62, 0.38, 0.68).normalize();
      r.sunLight.color.setHex(0xffecd5);
    }
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
    const maps = planetTextures();
    this.planet = new T.Mesh(
      new T.SphereGeometry(850, 96, 64),
      new T.MeshStandardMaterial({
        map: maps.map,
        bumpMap: maps.bumpMap,
        bumpScale: 5,
        roughnessMap: maps.roughnessMap,
        roughness: 1,
        metalness: 0.06,
        emissiveMap: maps.cities,
        emissive: 0xffb65d,
        emissiveIntensity: 0.5,
      }),
    );
    this.planet.material.onBeforeCompile = (shader) => {
      shader.uniforms.planetSun = { value: this.owner.sunLight.position };
      shader.vertexShader =
        "varying vec3 planetNormal;\n" + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\nplanetNormal = mat3(modelMatrix) * normal;",
      );
      shader.fragmentShader =
        "varying vec3 planetNormal;uniform vec3 planetSun;\n" +
        shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <emissivemap_fragment>",
        "#include <emissivemap_fragment>\ntotalEmissiveRadiance *= 1. - smoothstep(-.15,.12,dot(normalize(planetNormal),planetSun));",
      );
    };
    this.planet.material.customProgramCacheKey = () => "orbital-day-night-v2.9";
    this.planet.position.set(1050, -280, -2500);
    this.planet.rotation.z = 0.28;
    this.spaceGroup.add(this.planet);
    this.planetClouds = new T.Mesh(
      new T.SphereGeometry(857, 80, 56),
      new T.MeshStandardMaterial({
        map: maps.clouds,
        transparent: true,
        depthWrite: false,
        roughness: 1,
        opacity: 0.9,
      }),
    );
    this.planetClouds.position.copy(this.planet.position);
    this.planetClouds.rotation.z = 0.28;
    this.spaceGroup.add(this.planetClouds);
    const atmosphere = new T.Mesh(
      new T.SphereGeometry(879, 64, 48),
      new T.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: T.BackSide,
        uniforms: { sun: { value: this.owner.sunLight.position } },
        vertexShader:
          "varying vec3 n;varying vec3 v;varying vec3 wn;void main(){vec4 p=modelViewMatrix*vec4(position,1.);n=normalize(normalMatrix*normal);wn=mat3(modelMatrix)*normal;v=normalize(-p.xyz);gl_Position=projectionMatrix*p;}",
        fragmentShader:
          "varying vec3 n;varying vec3 v;varying vec3 wn;uniform vec3 sun;void main(){float rim=pow(1.-abs(dot(normalize(n),normalize(v))),3.5);float daylight=smoothstep(-.4,.5,dot(normalize(wn),sun));gl_FragColor=vec4(mix(vec3(.07,.16,.4),vec3(.22,.56,1.),daylight),rim*(.15+daylight*.65));}",
      }),
    );
    atmosphere.position.copy(this.planet.position);
    this.spaceGroup.add(atmosphere);
    this.nebula = new T.Mesh(
      new T.SphereGeometry(5000, 48, 24),
      new T.MeshBasicMaterial({
        map: nebulaTexture(),
        side: T.BackSide,
        depthWrite: false,
        fog: false,
        toneMapped: false,
      }),
    );
    this.nebula.renderOrder = -10;
    this.spaceGroup.add(this.nebula);
    const rockGeometry = new T.IcosahedronGeometry(1, 3),
      positions = rockGeometry.attributes.position;
    for (let j = 0; j < positions.count; j++) {
      // Hash coordinates, not vertex indices: coincident vertices must stay
      // coincident so the deformed rock has no cracks between triangles.
      const scale =
        0.88 +
        hash(
          Math.round(positions.getX(j) * 700),
          Math.round(positions.getY(j) * 700),
          Math.round(positions.getZ(j) * 700),
        ) *
          0.2;
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
      new T.MeshStandardMaterial({
        color: 0xb7aaa0,
        map: surfaceTextures("caldera").rock,
        bumpMap: surfaceTextures("caldera").rock,
        bumpScale: 0.16,
        roughness: 0.94,
      }),
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
    sun.position.set(-2400, 1500, 2600);
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
    r.sky.material.uniforms.time.value = time;
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
      this.nebula.position.copy(r.camera.position);
      this.planetClouds.rotation.y = time * 0.0055 + 0.04;
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
