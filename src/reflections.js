import * as T from "./three.js";

export class WaterReflection {
  constructor(owner) {
    this.owner = owner;
    this.camera = new T.PerspectiveCamera();
    this.target = new T.WebGLRenderTarget(640, 384, { type: T.HalfFloatType });
    this.matrix = new T.Matrix4();
    this.direction = new T.Vector3();
    this.look = new T.Vector3();
    this.plane = new T.Plane(new T.Vector3(0, 1, 0), 2);
    const m = owner.ocean.material;
    Object.assign(m.uniforms, {
      reflectionMap: { value: this.target.texture },
      reflectionMatrix: { value: this.matrix },
      reflectionStrength: { value: 0 },
    });
    m.vertexShader =
      "uniform mat4 reflectionMatrix;varying vec4 reflectedPosition;\n" +
      m.vertexShader;
    m.vertexShader = m.vertexShader.replace(
      "vWorld=world.xyz;",
      "vWorld=world.xyz;reflectedPosition=reflectionMatrix*world;",
    );
    m.fragmentShader =
      "uniform sampler2D reflectionMap;uniform float reflectionStrength;varying vec4 reflectedPosition;\n" +
      m.fragmentShader;
    m.fragmentShader = m.fragmentShader.replace(
      "vec3 color=mix(waterColor",
      `if(reflectionStrength>.5){
      vec2 ruv=reflectedPosition.xy/reflectedPosition.w+slope*.07*(.35+nearDetail*.65);
      float border=smoothstep(0.,.035,ruv.x)*smoothstep(0.,.035,ruv.y)*(1.-smoothstep(.965,1.,ruv.x))*(1.-smoothstep(.965,1.,ruv.y));
      vec2 spread=vec2(.0025,.001)*(1.+nearDetail);
      vec3 reflected=texture2D(reflectionMap,clamp(ruv+spread,vec2(.001),vec2(.999))).rgb;
      reflected+=texture2D(reflectionMap,clamp(ruv-spread,vec2(.001),vec2(.999))).rgb;
      reflected+=texture2D(reflectionMap,clamp(ruv+spread*vec2(-1.,1.),vec2(.001),vec2(.999))).rgb;
      reflected+=texture2D(reflectionMap,clamp(ruv+spread*vec2(1.,-1.),vec2(.001),vec2(.999))).rgb;
      reflection=mix(reflection,reflected*.25,border*.72);
    }vec3 color=mix(waterColor`,
    );
    m.needsUpdate = true;
    this.frame = 0;
  }
  render(enabled) {
    const o = this.owner;
    o.ocean.material.uniforms.reflectionStrength.value = enabled ? 1 : 0;
    if (!enabled) return;
    if (this.frame++ % 2) return;
    const src = o.camera,
      c = this.camera;
    c.copy(src);
    c.position.copy(src.position);
    c.position.y = -4 - src.position.y;
    src.getWorldDirection(this.direction);
    this.look.copy(src.position).add(this.direction);
    this.look.y = -4 - this.look.y;
    c.up.set(0, -1, 0);
    c.lookAt(this.look);
    c.updateMatrixWorld();
    // Oblique near-plane clipping removes underwater geometry from the reflection.
    const clip = this.plane.clone().applyMatrix4(c.matrixWorldInverse),
      n = clip.normal,
      p = c.projectionMatrix.elements;
    const qx = (Math.sign(n.x) + p[8]) / p[0],
      qy = (Math.sign(n.y) + p[9]) / p[5],
      qw = (1 + p[10]) / p[14];
    const scale = 2 / (n.x * qx + n.y * qy - n.z + clip.constant * qw);
    p[2] = n.x * scale;
    p[6] = n.y * scale;
    p[10] = n.z * scale + 1 - 0.0003;
    p[14] = clip.constant * scale;
    c.projectionMatrixInverse.copy(c.projectionMatrix).invert();
    this.matrix
      .set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1)
      .multiply(c.projectionMatrix)
      .multiply(c.matrixWorldInverse);
    const hidden = [o.ocean, o.shoreline, o.upgrades.cockpit.group];
    const visibility = hidden.map((x) => x.visible);
    hidden.forEach((x) => (x.visible = false));
    const prior = o.renderer.getRenderTarget();
    try {
      o.renderer.setRenderTarget(this.target);
      o.renderer.render(o.scene, c);
    } finally {
      hidden.forEach((x, i) => (x.visible = visibility[i]));
      o.renderer.setRenderTarget(prior);
    }
  }
  dispose() {
    this.target.dispose();
  }
}
