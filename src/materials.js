import * as T from "./three.js";
import { photographicTerrain, photographicBlend } from "./visual-assets.js";

const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const smooth = (a, b, x) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
export function hash(x, y, z = 0) {
  let n =
    Math.imul(x + 17, 374761393) ^
    Math.imul(y + 31, 668265263) ^
    Math.imul(z + 7, 1442695041);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
}
function noise(x, y, z = 0, period = 0) {
  const ix = Math.floor(x),
    iy = Math.floor(y),
    iz = Math.floor(z);
  const fx = smooth(0, 1, x - ix),
    fy = smooth(0, 1, y - iy),
    fz = smooth(0, 1, z - iz);
  const at = (a, b, c) =>
    hash(
      period ? ((a % period) + period) % period : a,
      period ? ((b % period) + period) % period : b,
      c,
    );
  const plane = (k) =>
    (at(ix, iy, k) * (1 - fx) + at(ix + 1, iy, k) * fx) * (1 - fy) +
    (at(ix, iy + 1, k) * (1 - fx) + at(ix + 1, iy + 1, k) * fx) * fy;
  return plane(iz) * (1 - fz) + plane(iz + 1) * fz;
}
function fbm(x, y, z, octaves = 5) {
  let value = 0,
    amplitude = 0.5,
    total = 0;
  for (let i = 0; i < octaves; i++) {
    value += noise(x, y, z) * amplitude;
    total += amplitude;
    x *= 2.03;
    y *= 2.03;
    z *= 2.03;
    amplitude *= 0.5;
  }
  return value / total;
}
function texture(data, width, height, color = false) {
  const t = new T.DataTexture(data, width, height);
  t.wrapS = t.wrapT = T.RepeatWrapping;
  t.magFilter = T.LinearFilter;
  t.minFilter = T.LinearMipmapLinearFilter;
  t.generateMipmaps = true;
  t.anisotropy = 8;
  if (color) t.colorSpace = T.SRGBColorSpace;
  t.needsUpdate = true;
  return t;
}
const palettes = {
  azure: [
    [75, 94, 46],
    [112, 108, 95],
    [174, 160, 121],
  ],
  glacier: [
    [210, 226, 233],
    [92, 109, 121],
    [130, 151, 157],
  ],
  canyon: [
    [170, 110, 67],
    [145, 86, 51],
    [185, 149, 104],
  ],
  caldera: [
    [67, 75, 54],
    [65, 61, 57],
    [80, 75, 66],
  ],
};
const surfaces = new Map();
export function surfaceTextures(mapId = "azure") {
  if (surfaces.has(mapId)) return surfaces.get(mapId);
  const colors = palettes[mapId] || palettes.azure,
    size = 512;
  const layers = colors.slice(0, 2).map((base, layer) => {
    const bytes = new Uint8Array(size * size * 4);
    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++) {
        const u = x / size,
          v = y / size;
        const broad = noise(u * 8, v * 8, layer + 3, 8);
        const grains = noise(u * 128, v * 128, 11, 128);
        const detail = noise(u * 32, v * 32, 4, 32);
        const vein = Math.abs(noise(u * 16, v * 16, 6, 16) - 0.5);
        const crack = 1 - smooth(0.012, 0.055, vein);
        const strata = Math.sin(v * Math.PI * 48 + broad * 8) * 0.5 + 0.5;
        let height = layer
          ? 0.22 + detail * 0.46 + grains * 0.2 - crack * 0.19
          : 0.25 + detail * 0.3 + grains * 0.24;
        if (mapId === "canyon" && layer) height += strata * 0.15;
        if (mapId === "glacier" && !layer)
          height = 0.5 + grains * 0.12 + broad * 0.1;
        const light =
          0.66 + broad * 0.35 + height * 0.4 - (layer ? crack * 0.15 : 0);
        const i = (y * size + x) * 4;
        for (let c = 0; c < 3; c++)
          bytes[i + c] = clamp(base[c] * light + (grains - 0.5) * 11, 0, 255);
        bytes[i + 3] = clamp(height) * 255; // independent linear relief channel
      }
    return texture(bytes, size, size, true);
  });
  const result = {
    ground: layers[0],
    rock: layers[1],
    shore: new T.Color(...colors[2].map((v) => v / 255)).convertSRGBToLinear(),
  };
  surfaces.set(mapId, result);
  return result;
}

export function terrainMaterial(previous, worldDistance, mapId) {
  const maps = surfaceTextures(mapId);
  const photo = photographicTerrain(mapId);
  const mat = new T.MeshStandardMaterial({
    roughness: 0.9,
    map: maps.ground,
    metalness: 0,
  });
  mat.name = "Terrain · photographic PBR / triplanar / wet shoreline";
  // Keep the existing palette interface used by the four map selectors.
  mat.uniforms = { ...previous.uniforms, map: { value: maps.ground } };
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, {
      worldDistance,
      rockMap: { value: maps.rock },
      groundMap: { value: maps.ground },
      shoreColor: { value: maps.shore },
      photoRock: { value: photo.rock },
      photoGround: { value: photo.ground },
      photoNormal: { value: photo.normal },
      photoRough: { value: photo.rough },
      photoSand: { value: photo.sand },
      photoBlend: photographicBlend,
      surfaceTint: {
        value: new T.Color(
          ...(mapId === "canyon"
            ? [1.25, 0.72, 0.42]
            : mapId === "caldera"
              ? [0.38, 0.4, 0.36]
              : mapId === "azure"
                ? [0.7, 0.78, 0.7]
                : [1, 1, 1]),
        ),
      },
    });
    shader.vertexShader =
      "uniform float worldDistance; attribute float islandZ; varying vec3 surfacePosition; varying vec3 surfaceNormal;\n" +
      shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      `
      #include <begin_vertex>
      surfacePosition = vec3(position.x, position.y, position.z + islandZ);
      surfaceNormal = normal;
      transformed.z += mod(mod(islandZ + worldDistance + 3400., 3900.) + 3900., 3900.) - 3400.;
    `,
    );
    shader.fragmentShader =
      `uniform sampler2D groundMap; uniform sampler2D rockMap; uniform vec3 shoreColor;
      uniform sampler2D photoRock, photoGround, photoNormal, photoRough, photoSand;uniform float photoBlend;uniform vec3 surfaceTint;
      varying vec3 surfacePosition; varying vec3 surfaceNormal;
      vec4 triplanar(sampler2D tex, vec3 p, vec3 w) {
        return texture2D(tex, p.yz) * w.x + texture2D(tex, p.xz) * w.y + texture2D(tex, p.xy) * w.z;
      }\n` + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <map_fragment>",
      `
      vec3 weights = pow(abs(normalize(surfaceNormal)), vec3(4.));
      weights /= max(dot(weights, vec3(1.)), .001);
      vec4 rock = triplanar(rockMap, surfacePosition * .038, weights);
      vec4 ground = texture2D(groundMap, surfacePosition.xz * .07);
      vec3 photoStone=triplanar(photoRock,surfacePosition*.038,weights).rgb;
      photoStone=mix(photoStone,triplanar(photoRock,surfacePosition*.013+vec3(.31,.73,.19),weights).rgb,.38);
      rock.rgb=mix(rock.rgb,photoStone*surfaceTint,photoBlend);
      vec3 photoSoil=mix(texture2D(photoGround,surfacePosition.xz*.07).rgb,texture2D(photoGround,surfacePosition.xz*.019+vec2(.37,.61)).rgb,.3);
      ground.rgb=mix(ground.rgb,photoSoil*surfaceTint*.7,photoBlend);
      float cliff = 1. - smoothstep(.52, .86, normalize(surfaceNormal).y);
      vec4 surface = mix(ground, rock, cliff);
      float shore = 1. - smoothstep(.5, 7., surfacePosition.y);
      float wet = 1. - smoothstep(-1., 2.8, surfacePosition.y);
      vec3 sand = mix(shoreColor * (.68 + ground.a * .5),texture2D(photoSand,surfacePosition.xz*.09).rgb*surfaceTint,photoBlend);
      float macro = texture2D(groundMap, surfacePosition.xz * .002).a;
      float drainage=texture2D(groundMap,surfacePosition.xz*.008).a;
      diffuseColor.rgb *= mix(surface.rgb, sand, shore) * (.65 + macro * .6 + drainage*.12) * (1. - wet * .32);
      float relief = mix(ground.a * .22, rock.a * .8, cliff) * (1. - shore * .6) * (1.-photoBlend*.88);
    `,
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <roughnessmap_fragment>",
      `
      #include <roughnessmap_fragment>
      roughnessFactor = mix(mix(clamp(.82 + surface.a * .15, .6, 1.),clamp(triplanar(photoRough,surfacePosition*.06,weights).g,.35,1.),photoBlend*cliff), .28, wet);
    `,
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <normal_fragment_maps>",
      `
      #include <normal_fragment_maps>
      vec3 sigmaX = dFdx(-vViewPosition), sigmaY = dFdy(-vViewPosition);
      vec3 r1 = cross(sigmaY, normal), r2 = cross(normal, sigmaX);
      float determinant = dot(sigmaX, r1);
      normal = normalize(abs(determinant) * normal - sign(determinant) * (dFdx(relief) * r1 + dFdy(relief) * r2));
      vec3 nx=texture2D(photoNormal,surfacePosition.yz*.038).xyz*2.-1.;
      vec3 ny=texture2D(photoNormal,surfacePosition.xz*.038).xyz*2.-1.;
      vec3 nz=texture2D(photoNormal,surfacePosition.xy*.038).xyz*2.-1.;
      vec3 perturb=vec3(0.,nx.x,nx.y)*weights.x+vec3(ny.x,0.,ny.y)*weights.y+vec3(nz.x,nz.y,0.)*weights.z;
      normal=normalize(normal+mat3(viewMatrix)*perturb*photoBlend*(.18+cliff*.4));
    `,
    );
  };
  mat.customProgramCacheKey = () => "skychrome-layered-pbr-3.1";
  return mat;
}

const display = `vec3 displayColor(vec3 c){c=max(c,vec3(0.));c=(c*(2.51*c+.03))/(c*(2.43*c+.59)+.14);return sqrt(clamp(c,0.,1.));}`;
const glslNoise = `
float hash21(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n2(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash21(i),hash21(i+vec2(1.,0.)),f.x),mix(hash21(i+vec2(0.,1.)),hash21(i+vec2(1.)),f.x),f.y);}
float f2(vec2 p){return n2(p)*.57+n2(p*2.03)*.28+n2(p*4.09)*.15;}`;
export function upgradeSky(material) {
  Object.assign(material.uniforms, {
    time: { value: 0 },
    detail: { value: 1 },
  });
  material.vertexShader = `varying vec3 skyRay;void main(){skyRay=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
  material.fragmentShader =
    display +
    glslNoise +
    `
    varying vec3 skyRay; uniform vec3 top,horizon,sunDirection,sunColor; uniform float time,detail;
    void main(){
      vec3 ray=normalize(skyRay);float altitude=max(ray.y,0.);float mu=dot(ray,sunDirection);
      vec3 color=mix(horizon,top,pow(smoothstep(0.,.85,altitude),.42));
      float mie=.006/pow(max(.02,1.04-1.02*mu),1.25);
      color+=sunColor*(mie*.6+pow(max(mu,0.),12.)*.07);
      if(detail>.5 && ray.y>.025){
        vec2 p=ray.xz/(ray.y+.15)*1.65+vec2(time*.0015,0.);
        float cirrus=smoothstep(.55,.78,f2(p*vec2(.6,2.8)+f2(p*2.)))*smoothstep(.02,.22,ray.y);
        color=mix(color,sunColor*.55+vec3(.35,.4,.45),cirrus*.23);
      }
      float disc=smoothstep(.99994,.999975,mu);color=mix(color,sunColor*5.,disc);
      gl_FragColor=vec4(displayColor(color),1.);
    }`;
  material.needsUpdate = true;
}

const waves = `
float waveHeight(vec2 p,float t){return sin(dot(p,vec2(.047,.019))-t*1.16)*.38+sin(dot(p,vec2(-.031,.061))-t*1.47)*.21+sin(dot(p,vec2(.12,.075))-t*2.1)*.08;}
vec2 waveSlope(vec2 p,float t){return cos(dot(p,vec2(.047,.019))-t*1.16)*vec2(.047,.019)*.38+cos(dot(p,vec2(-.031,.061))-t*1.47)*vec2(-.031,.061)*.21+cos(dot(p,vec2(.12,.075))-t*2.1)*vec2(.12,.075)*.08;}`;
export function upgradeWater(material) {
  material.vertexShader =
    waves +
    `
    uniform float time,distance;varying vec3 vWorld;
    void main(){vec4 world=modelMatrix*vec4(position,1.);world.y+=waveHeight(vec2(world.x,world.z-distance),time);vWorld=world.xyz;gl_Position=projectionMatrix*viewMatrix*world;}`;
  material.fragmentShader =
    display +
    waves +
    `
    varying vec3 vWorld;uniform float time,distance;uniform vec3 eye,waterColor,fogColor,skyColor,sunDirection,sunColor;uniform sampler2D ripple;
    void main(){
      vec2 p=vec2(vWorld.x,vWorld.z-distance);float range=length(eye-vWorld);
      float nearDetail=1.-smoothstep(180.,2100.,range);
      vec4 a=texture2D(ripple,p*.021+vec2(time*.012,-time*.008));
      vec4 b=texture2D(ripple,p*.049+vec2(-time*.008,time*.017));
      vec2 slope=waveSlope(p,time)+(a.rg+b.gr-.5*2.)*(.15*nearDetail+.018);
      vec3 normal=normalize(vec3(-slope.x,1.,-slope.y));vec3 view=normalize(eye-vWorld);
      float fresnel=.02+.98*pow(1.-max(dot(normal,view),0.),5.);
      vec3 reflection=mix(fogColor,skyColor,smoothstep(-.05,.65,reflect(-view,normal).y));
      vec3 color=mix(waterColor*(.65+a.b*.2)+vec3(.002,.02,.024)*nearDetail,reflection,fresnel);
      float nh=max(dot(normal,normalize(view+sunDirection)),0.);
      float rough=mix(.24,.11,nearDetail),a2=pow(rough,4.);
      float spec=a2/(3.14159*pow(nh*nh*(a2-1.)+1.,2.));
      color+=sunColor*min(spec*.018,2.8)*smoothstep(-.05,.12,sunDirection.y);
      float foam=smoothstep(.88,.99,a.b*b.b)*nearDetail;
      color=mix(color,vec3(.57,.65,.64),foam*.28);
      float haze=1.-exp(-range*range*.000000095);
      gl_FragColor=vec4(displayColor(mix(color,fogColor,haze)),1.);
    }`;
  material.needsUpdate = true;
}

export function planetTextures(width = 1024, height = 512) {
  const albedo = new Uint8Array(width * height * 4),
    relief = albedo.slice(),
    clouds = albedo.slice(),
    roughness = albedo.slice(),
    cities = albedo.slice();
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const latitude = (y / (height - 1) - 0.5) * Math.PI,
        longitude = (x / (width - 1)) * Math.PI * 2;
      const dx = Math.cos(latitude) * Math.cos(longitude),
        dy = Math.sin(latitude),
        dz = Math.cos(latitude) * Math.sin(longitude);
      const n = fbm(dx * 3.6 + 7, dy * 3.6 + 11, dz * 3.6 + 3);
      const mountains = fbm(dx * 24 + 20, dy * 24, dz * 24, 3);
      const land = smooth(0.49, 0.535, n),
        ice = smooth(0.78, 0.94, Math.abs(dy) + n * 0.1);
      const desert =
        smooth(0.25, 0.55, Math.abs(dy)) *
        (1 - smooth(0.55, 0.7, Math.abs(dy))) *
        smooth(0.46, 0.62, n);
      let c = [9 + mountains * 8, 30 + mountains * 24, 61 + mountains * 31];
      const ground = [
        35 + mountains * 52 + desert * 83,
        55 + mountains * 57 + desert * 46,
        29 + mountains * 30 + desert * 31,
      ];
      c = c.map(
        (v, k) =>
          (v * (1 - land) + ground[k] * land) * (1 - ice) +
          [211, 225, 233][k] * ice,
      );
      const warp = fbm(dx * 7 + 80, dy * 7 + 40, dz * 7 + 60, 3);
      const cloud =
        smooth(
          0.51,
          0.71,
          fbm(dx * 13 + warp * 1.8 + 30, dy * 13 + warp * 0.7, dz * 13, 4),
        ) * 0.85;
      const city =
        land *
        (1 - ice) *
        smooth(0.48, 0.53, n) *
        (1 - smooth(0.55, 0.62, n)) *
        (mountains > 0.63 ? 1 : 0);
      const i = (y * width + x) * 4;
      albedo.set([...c, 255], i);
      relief.set(
        [
          128 + land * mountains * 85,
          128 + land * mountains * 85,
          128 + land * mountains * 85,
          255,
        ],
        i,
      );
      roughness.set([0, land * 220 + (1 - land) * 65, 0, 255], i);
      clouds.set([235, 241, 247, cloud * 255], i);
      cities.set([city * 255, city * 170, city * 65, 255], i);
    }
  return {
    map: texture(albedo, width, height, true),
    bumpMap: texture(relief, width, height),
    roughnessMap: texture(roughness, width, height),
    clouds: texture(clouds, width, height, true),
    cities: texture(cities, width, height, true),
  };
}

export function nebulaTexture() {
  const w = 1024,
    h = 512,
    data = new Uint8Array(w * h * 4);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const u = (x / (w - 1)) * Math.PI * 2,
        v = (y / (h - 1)) * Math.PI;
      const dx = Math.sin(v) * Math.cos(u),
        dy = Math.cos(v),
        dz = Math.sin(v) * Math.sin(u);
      const dust = fbm(dx * 7 + 40, dy * 7 + 18, dz * 7 + 9, 4);
      const band = Math.exp(-Math.pow((dy + dx * 0.25 - dz * 0.12) * 4.2, 2));
      const glow = Math.pow(Math.max(0, dust - 0.27), 2) * band;
      data.set(
        [2 + glow * 44, 3 + glow * 58, 7 + glow * 100, 255],
        (y * w + x) * 4,
      );
    }
  return texture(data, w, h, true);
}
