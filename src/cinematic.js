import * as T from "./three.js";

const fullscreenVertex = `varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`;
const common = `varying vec2 vUv;uniform sampler2D source;uniform vec2 texel;`;
const extract =
  common +
  `
void main(){vec3 c=texture2D(source,vUv).rgb;float l=max(max(c.r,c.g),c.b);float knee=clamp((l-.65)/1.3,0.,1.);gl_FragColor=vec4(c*knee*knee*.38,1.);}`;
const blur =
  common +
  `uniform vec2 direction;
void main(){vec3 c=texture2D(source,vUv).rgb*.227027;
 c+=(texture2D(source,vUv+direction*texel*1.384615).rgb+texture2D(source,vUv-direction*texel*1.384615).rgb)*.316216;
 c+=(texture2D(source,vUv+direction*texel*3.230769).rgb+texture2D(source,vUv-direction*texel*3.230769).rgb)*.070270;gl_FragColor=vec4(c,1.);}`;
const composite =
  common +
  `
uniform sampler2D bloom,depthMap,clouds;uniform float nearPlane,farPlane,exposure,bloomStrength,cloudEnabled,aoStrength;
float viewDepth(vec2 uv){float z=texture2D(depthMap,uv).r;return nearPlane*farPlane/(farPlane-z*(farPlane-nearPlane));}
vec3 aces(vec3 x){return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.);}
void main(){
 vec3 c=texture2D(source,vUv).rgb;float d=viewDepth(vUv);float occlusion=0.;
 if(d<1800.){for(int i=0;i<8;i++){float a=float(i)*.785398;vec2 off=vec2(cos(a),sin(a))*texel*clamp(240./max(d,1.),2.,10.);
 float nd=viewDepth(clamp(vUv+off,vec2(0.),vec2(1.)));float delta=d-nd;
 occlusion+=smoothstep(.04,.6,delta)*(1.-smoothstep(1.,max(2.,d*.06),delta));}}
 c*=1.-occlusion*.055*aoStrength;
 vec4 cloud=texture2D(clouds,vUv)*cloudEnabled;c=mix(c,cloud.rgb,cloud.a);
 c+=texture2D(bloom,vUv).rgb*bloomStrength*(1.-cloud.a*.8);
 c=aces(c*exposure);
 // Subtle photographic contrast and warm highlights/cool shadows, no blur over HUD.
 float l=dot(c,vec3(.2126,.7152,.0722));c=mix(vec3(l),c,1.035);
 c+=vec3(-.004,.001,.006)*(1.-l)+vec3(.006,.003,-.002)*l*l;
 float edge=dot(vUv-.5,vUv-.5);c*=1.-edge*.12;
 gl_FragColor=vec4(max(c,vec3(0.)),1.);
 #include <colorspace_fragment>
}`;
const cloudShader = `varying vec2 vUv;uniform sampler2D noiseMap,depthMap;
uniform mat4 invProjection,cameraWorld;uniform vec3 eye,sunDirection,sunColor;
uniform float time,distance,nearPlane,farPlane,steps;
float n3(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);vec2 uv=(i.xy+vec2(37.,17.)*i.z+f.xy+.5)/256.;vec2 v=texture2D(noiseMap,uv).rg;return mix(v.x,v.y,f.z);}
float density(vec3 p){float h=(p.y-320.)/330.;float shape=smoothstep(0.,.16,h)*(1.-smoothstep(.5,1.,h));
 vec3 q=vec3(p.x,p.y*1.3,p.z-distance)*.0037+vec3(time*.0018,0.,time*.0007);
 float weather=n3(q*vec3(.36,0.,.36)+31.);float n=n3(q)*.55+n3(q*2.09)*.28+n3(q*4.17)*.12+n3(q*8.31)*.05;
 return smoothstep(.53,.72,n+weather*.08)*shape;}
void main(){vec4 ray4=invProjection*vec4(vUv*2.-1.,1.,1.);vec3 camRay=normalize(ray4.xyz/ray4.w);vec3 ray=normalize(mat3(cameraWorld)*camRay);
 if(ray.y<=.015){gl_FragColor=vec4(0.);return;}
 float start=max(0.,(320.-eye.y)/ray.y),end=min(13000.,(650.-eye.y)/ray.y);
 float z=texture2D(depthMap,vUv).r;float vd=nearPlane*farPlane/(farPlane-z*(farPlane-nearPlane));end=min(end,vd/max(.001,-camRay.z));
 if(end<=start){gl_FragColor=vec4(0.);return;}
 float dt=(end-start)/steps;float trans=1.;vec3 accum=vec3(0.);
 float jitter=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.54);
 float silver=pow(max(dot(ray,sunDirection),0.),10.);
 for(int i=0;i<40;i++){if(float(i)>=steps||trans<.025)break;
  vec3 p=eye+ray*(start+(float(i)+jitter)*dt);float den=density(p);
  if(den>.002){float light=exp(-density(p+sunDirection*45.)*1.8-density(p+sunDirection*100.)*1.1);
   vec3 color=mix(vec3(.23,.29,.36),sunColor*(.95+silver*.55),light);
   float fog=1.-exp(-length(p-eye)*.000055);color=mix(color,vec3(.39,.52,.64),fog*.5);
   float alpha=1.-exp(-den*dt*.014);accum+=trans*alpha*color;trans*=1.-alpha;}}
 float alpha=1.-trans;gl_FragColor=vec4(accum/max(alpha,.001),alpha);}`;

function cloudNoise() {
  const bytes = new Uint8Array(256 * 256 * 4);
  let seed = 81723;
  const values = new Uint8Array(256 * 256);
  for (let i = 0; i < values.length; i++) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    values[i] = seed >>> 24;
  }
  for (let y = 0; y < 256; y++)
    for (let x = 0; x < 256; x++) {
      const i = (y * 256 + x) * 4;
      bytes[i] = values[y * 256 + x];
      bytes[i + 1] = values[((y + 17) % 256) * 256 + ((x + 37) % 256)];
      bytes[i + 3] = 255;
    }
  const t = new T.DataTexture(bytes, 256, 256);
  t.wrapS = t.wrapT = T.RepeatWrapping;
  t.magFilter = t.minFilter = T.LinearFilter;
  t.needsUpdate = true;
  return t;
}

export class CinematicRenderer {
  constructor(owner) {
    this.owner = owner;
    this.renderer = owner.renderer;
    this.supported = this.renderer.extensions.has("EXT_color_buffer_float");
    this.hdr = { value: 0 };
    this.seen = new WeakSet();
    this.size = new T.Vector2();
    this.scene = new T.Scene();
    this.camera = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.quad = new T.Mesh(new T.PlaneGeometry(2, 2));
    this.quad.frustumCulled = false;
    this.scene.add(this.quad);
    const options = {
      type: T.HalfFloatType,
      depthBuffer: false,
      minFilter: T.LinearFilter,
      magFilter: T.LinearFilter,
    };
    this.target = new T.WebGLRenderTarget(1, 1, {
      ...options,
      depthBuffer: true,
    });
    this.target.depthTexture = new T.DepthTexture(1, 1);
    this.target.samples = 4;
    this.bloomA = new T.WebGLRenderTarget(1, 1, options);
    this.bloomB = new T.WebGLRenderTarget(1, 1, options);
    this.cloudTarget = new T.WebGLRenderTarget(1, 1, options);
    const make = (fragmentShader, uniforms) =>
      new T.ShaderMaterial({
        vertexShader: fullscreenVertex,
        fragmentShader,
        uniforms,
        depthTest: false,
        depthWrite: false,
        toneMapped: false,
      });
    this.extract = make(extract, {
      source: { value: null },
      texel: { value: new T.Vector2() },
    });
    this.blur = make(blur, {
      source: { value: null },
      texel: { value: new T.Vector2() },
      direction: { value: new T.Vector2() },
    });
    this.cloud = make(cloudShader, {
      noiseMap: { value: cloudNoise() },
      depthMap: { value: this.target.depthTexture },
      invProjection: { value: new T.Matrix4() },
      cameraWorld: { value: new T.Matrix4() },
      eye: { value: new T.Vector3() },
      sunDirection: { value: owner.sunLight.position },
      sunColor: { value: owner.sunLight.color },
      time: { value: 0 },
      distance: { value: 0 },
      nearPlane: { value: 0.05 },
      farPlane: { value: 6000 },
      steps: { value: 28 },
    });
    this.composite = make(composite, {
      source: { value: this.target.texture },
      bloom: { value: this.bloomA.texture },
      depthMap: { value: this.target.depthTexture },
      clouds: { value: this.cloudTarget.texture },
      texel: { value: new T.Vector2() },
      nearPlane: { value: 0.05 },
      farPlane: { value: 6000 },
      exposure: { value: 0.92 },
      bloomStrength: { value: 0.2 },
      cloudEnabled: { value: 0 },
      aoStrength: { value: 1 },
    });
    this.configure(owner.settings);
  }
  configure(settings) {
    this.quality = settings.quality;
    this.enabled = this.supported && settings.quality !== "low";
  }
  prepareMaterials(scene) {
    scene.traverse((o) => {
      for (const m of o.material
        ? Array.isArray(o.material)
          ? o.material
          : [o.material]
        : []) {
        if (this.seen.has(m)) continue;
        this.seen.add(m);
        if (
          m.isShaderMaterial &&
          m.fragmentShader.includes("vec3 displayColor(vec3 c)")
        ) {
          m.uniforms.cinematicHdr = this.hdr;
          m.fragmentShader =
            "uniform float cinematicHdr;\n" +
            m.fragmentShader.replace(
              "vec3 displayColor(vec3 c){",
              "vec3 displayColor(vec3 c){if(cinematicHdr>.5)return c;",
            );
          m.needsUpdate = true;
        }
      }
    });
  }
  pass(material, target) {
    this.quad.material = material;
    this.renderer.setRenderTarget(target);
    this.renderer.render(this.scene, this.camera);
  }
  draw(
    scene,
    camera,
    { space = false, hangar = false, time = 0, distance = 0, beforeScene } = {},
  ) {
    this.prepareMaterials(scene);
    this.hdr.value = this.enabled ? 1 : 0;
    this.active = this.enabled;
    this.cloudsActive = this.enabled && !space && !hangar;
    if (!this.enabled) {
      this.renderer.setRenderTarget(null);
      this.renderer.render(scene, camera);
      return;
    }
    this.renderer.getDrawingBufferSize(this.size);
    const w = this.size.x,
      h = this.size.y;
    if (this.target.width !== w || this.target.height !== h) {
      this.target.setSize(w, h);
      this.bloomA.setSize(Math.max(1, w >> 2), Math.max(1, h >> 2));
      this.bloomB.setSize(Math.max(1, w >> 2), Math.max(1, h >> 2));
      this.cloudTarget.setSize(
        Math.max(1, Math.ceil(w / 2)),
        Math.max(1, Math.ceil(h / 2)),
      );
    }
    const previousAuto = this.renderer.info.autoReset;
    this.renderer.info.autoReset = false;
    this.renderer.info.reset();
    try {
      beforeScene?.();
      this.renderer.setRenderTarget(this.target);
      this.renderer.render(scene, camera);
      if (this.cloudsActive) {
        const u = this.cloud.uniforms;
        u.invProjection.value.copy(camera.projectionMatrixInverse);
        u.cameraWorld.value.copy(camera.matrixWorld);
        u.eye.value.copy(camera.position);
        u.time.value = time;
        u.distance.value = distance;
        u.nearPlane.value = camera.near;
        u.farPlane.value = camera.far;
        u.steps.value = this.quality === "high" ? 40 : 20;
        this.pass(this.cloud, this.cloudTarget);
      }
      this.extract.uniforms.source.value = this.target.texture;
      this.pass(this.extract, this.bloomA);
      this.blur.uniforms.texel.value.set(
        1 / this.bloomA.width,
        1 / this.bloomA.height,
      );
      this.blur.uniforms.direction.value.set(1, 0);
      this.blur.uniforms.source.value = this.bloomA.texture;
      this.pass(this.blur, this.bloomB);
      this.blur.uniforms.direction.value.set(0, 1);
      this.blur.uniforms.source.value = this.bloomB.texture;
      this.pass(this.blur, this.bloomA);
      const u = this.composite.uniforms;
      u.nearPlane.value = camera.near;
      u.farPlane.value = camera.far;
      u.texel.value.set(1 / w, 1 / h);
      u.cloudEnabled.value = this.cloudsActive ? 1 : 0;
      u.bloomStrength.value = space ? 0.28 : hangar ? 0.12 : 0.18;
      u.aoStrength.value = hangar ? 1.2 : 1;
      u.exposure.value = this.renderer.toneMappingExposure;
      this.pass(this.composite, null);
    } finally {
      this.renderer.setRenderTarget(null);
      this.renderer.info.autoReset = previousAuto;
      this.hdr.value = 0;
    }
  }
  dispose() {
    for (const x of [
      this.target,
      this.bloomA,
      this.bloomB,
      this.cloudTarget,
      this.extract,
      this.blur,
      this.cloud,
      this.composite,
    ])
      x.dispose();
    this.cloud.uniforms.noiseMap.value.dispose();
    this.quad.geometry.dispose();
  }
}
