import * as T from "./three.js";
import { terrainNoise } from "./terrain-shape.js";

export function blastEnvelope(age) {
  return Math.max(0, 1 - age / 0.45) ** 3;
}

// The preserved renderer supports point lights, but the original core bundle
// omitted their constructor. This unshadowed light supplies that small interface.
class BlastLight extends T.Object3D {
  constructor() {
    super();
    this.isLight = this.isPointLight = true;
    this.type = "PointLight";
    this.color = new T.Color(0xffba72);
    this.intensity = 0;
    this.distance = 150;
    this.decay = 2;
  }
}
const vertex = `attribute float particleAlpha;varying vec2 vUv;varying vec3 vTint;varying float vAlpha;
void main(){vUv=uv;vTint=instanceColor;vAlpha=particleAlpha;gl_Position=projectionMatrix*modelViewMatrix*instanceMatrix*vec4(position,1.);}`;
const display = `vec3 displayColor(vec3 c){c=max(c,vec3(0.));return sqrt(clamp((c*(2.51*c+.03))/(c*(2.43*c+.59)+.14),0.,1.));}`;

export class CombatEffects {
  constructor(scene) {
    this.particles = [];
    this.blasts = [];
    this.space = false;
    const size = 128,
      data = new Uint8Array(size * size * 4);
    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++) {
        const u = x / size,
          v = y / size;
        const broad = terrainNoise(u * 8, v * 8, 81);
        const detail = terrainNoise(u * 29, v * 29, 91);
        const radius = Math.hypot((u - 0.5) * 2, (v - 0.5) * 2);
        const density = Math.max(0, 1 - radius ** 2 + (broad - 0.5) * 0.55);
        data.set(
          [
            broad * 255,
            detail * 255,
            255,
            Math.min(1, density ** 2 * (0.55 + detail * 0.45)) * 255,
          ],
          (y * size + x) * 4,
        );
      }
    this.texture = new T.DataTexture(data, size, size);
    this.texture.minFilter = this.texture.magFilter = T.LinearFilter;
    this.texture.needsUpdate = true;
    this.mesh = this.batch(
      128,
      `uniform sampler2D smoke;${display}
varying vec2 vUv;varying vec3 vTint;varying float vAlpha;
void main(){vec4 n=texture2D(smoke,vUv);float a=n.a*vAlpha;if(a<.006)discard;
gl_FragColor=vec4(displayColor(vTint*(.72+n.r*.45)),a);}`,
      { smoke: { value: this.texture } },
    );
    this.shockwaves = this.batch(
      8,
      `${display}varying vec2 vUv;varying vec3 vTint;varying float vAlpha;
void main(){float r=length(vUv-.5)*2.;float a=(1.-smoothstep(.012,.045,abs(r-.82)))*vAlpha;
if(a<.003)discard;gl_FragColor=vec4(displayColor(vTint),a);}`,
    );
    this.light = new BlastLight();
    scene.add(this.mesh, this.shockwaves, this.light);
    this.dummy = new T.Object3D();
    this.color = new T.Color();
  }
  batch(count, fragmentShader, uniforms = {}) {
    const geometry = new T.PlaneGeometry(1, 1);
    geometry.setAttribute(
      "particleAlpha",
      new T.InstancedBufferAttribute(new Float32Array(count), 1).setUsage(
        35048,
      ),
    );
    const material = new T.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
    });
    const mesh = new T.InstancedMesh(geometry, material, count);
    mesh.instanceMatrix.setUsage(35048);
    mesh.setColorAt(0, new T.Color());
    mesh.count = 0;
    mesh.frustumCulled = false;
    return mesh;
  }
  burst(x, y, z, quality, player = false) {
    const budget = quality === "high" ? 128 : quality === "low" ? 32 : 80;
    const count = quality === "low" ? 10 : 22;
    if (player)
      this.particles.length = Math.min(this.particles.length, budget - count);
    if (this.blasts.length === 8) this.blasts.shift();
    this.blasts.push({ x, y, z, age: 0, scale: player ? 1.45 : 1 });
    for (let i = 0; i < count && this.particles.length < budget; i++) {
      const a = Math.random() * Math.PI * 2,
        vertical = Math.random() * 2 - 1;
      const radial = Math.sqrt(1 - vertical * vertical),
        velocity = 6 + Math.random() * 12;
      this.particles.push({
        x,
        y,
        z,
        vx: Math.cos(a) * radial * velocity,
        vy: vertical * velocity,
        vz: Math.sin(a) * radial * velocity,
        age: 0,
        life: this.space ? 1.3 + Math.random() : 2.4 + Math.random() * 2,
        size: 3 + Math.random() * 3,
        angle: a,
        spin: Math.random() - 0.5,
        fire: i < 9,
        space: this.space,
      });
    }
  }
  reset() {
    this.particles.length = this.blasts.length = 0;
    this.mesh.count = this.shockwaves.count = 0;
    this.light.intensity = 0;
  }
  update(state, dt, camera) {
    this.space = state.mission.mode === "space";
    const delta = state.status === "paused" ? 0 : dt;
    const scroll = state.status === "playing" ? state.speed : 0;
    for (const p of this.particles) {
      p.age += delta;
      const damping = Math.exp(-delta * (p.space ? 0.25 : 1.3));
      p.vx *= damping;
      p.vz *= damping;
      p.vy = p.vy * damping + (p.space ? 0 : 5 * delta);
      p.x += p.vx * delta;
      p.y += p.vy * delta;
      p.z += (p.vz + scroll) * delta;
    }
    this.particles = this.particles.filter((p) => p.age < p.life);
    this.mesh.count = this.particles.length;
    this.particles.forEach((p, i) => {
      const hot = p.fire ? Math.max(0, 1 - p.age / 0.65) : 0;
      this.dummy.position.set(p.x, p.y, p.z);
      this.dummy.quaternion.copy(camera.quaternion);
      this.dummy.rotateZ(p.angle + p.age * p.spin);
      this.dummy.scale.setScalar(p.size * (1 + p.age * 1.5));
      this.dummy.updateMatrix();
      this.mesh.setMatrixAt(i, this.dummy.matrix);
      this.color.setRGB(
        0.07 + hot * 5.5,
        0.085 + hot * hot * 2.2,
        0.1 + hot ** 4 * 0.6,
      );
      this.mesh.setColorAt(i, this.color);
      this.mesh.geometry.attributes.particleAlpha.setX(
        i,
        Math.min(1, p.age * 25) * (1 - p.age / p.life) * (0.65 + hot * 0.25),
      );
    });
    this.light.intensity = 0;
    for (const blast of this.blasts) {
      blast.age += delta;
      blast.z += scroll * delta;
    }
    this.blasts = this.blasts.filter((b) => b.age < 0.75);
    this.shockwaves.count = this.blasts.length;
    this.blasts.forEach((b, i) => {
      this.dummy.position.set(b.x, b.y, b.z);
      this.dummy.quaternion.copy(camera.quaternion);
      this.dummy.scale.setScalar((3 + b.age * 100) * b.scale);
      this.dummy.updateMatrix();
      this.shockwaves.setMatrixAt(i, this.dummy.matrix);
      this.shockwaves.setColorAt(i, this.color.setRGB(1.3, 0.85, 0.42));
      this.shockwaves.geometry.attributes.particleAlpha.setX(
        i,
        (1 - b.age / 0.75) ** 2 * 0.18,
      );
      const energy = blastEnvelope(b.age) * 6500 * b.scale;
      if (energy > this.light.intensity) {
        this.light.position.set(b.x, b.y, b.z);
        this.light.intensity = energy;
      }
    });
    for (const mesh of [this.mesh, this.shockwaves])
      if (mesh.count) {
        mesh.instanceMatrix.needsUpdate = mesh.instanceColor.needsUpdate = true;
        mesh.geometry.attributes.particleAlpha.needsUpdate = true;
      }
  }
}
