import * as THREE from 'three';
import type { MapId } from '../sim/maps';

export interface SkyMood { top: number; horizon: number; sun: number; sunDir: THREE.Vector3; exposure: number; cloudTint: number; }

export const SKY_MOODS: Record<MapId, SkyMood> = {
  yard: { top: 0x3a7bd5, horizon: 0xbfe3f0, sun: 0xfff3d6, sunDir: new THREE.Vector3(0.45, 0.75, 0.5).normalize(), exposure: 1.0, cloudTint: 0xffffff },
  island: { top: 0x2f6fd0, horizon: 0xcfeaf2, sun: 0xfff6da, sunDir: new THREE.Vector3(-0.3, 0.8, 0.4).normalize(), exposure: 1.05, cloudTint: 0xffffff },
  neon: { top: 0x120a2e, horizon: 0xff7a3c, sun: 0xff9a5c, sunDir: new THREE.Vector3(0.2, 0.18, -0.6).normalize(), exposure: 0.95, cloudTint: 0xc9a0ff },
};

const VERT = `varying vec3 vDir; void main(){ vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const FRAG = `
varying vec3 vDir;
uniform vec3 topColor; uniform vec3 horizonColor; uniform vec3 sunDir; uniform vec3 sunColor; uniform vec3 cloudTint; uniform float cloudT;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(vec2 p){ vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y); }
float fbm(vec2 p){ float v = 0.0; float a = 0.5; for (int i = 0; i < 4; i++){ v += a * vnoise(p); p *= 2.03; a *= 0.5; } return v; }
void main(){
  vec3 d = normalize(vDir);
  float h = clamp(d.y, 0.0, 1.0);
  vec3 col = mix(horizonColor, topColor, pow(h, 0.6));
  float s = max(dot(d, normalize(sunDir)), 0.0);
  col += sunColor * (pow(s, 800.0) * 1.2 + pow(s, 8.0) * 0.12);
  if (d.y > 0.02) {
    vec2 cuv = d.xz / (d.y + 0.15);
    float cl = fbm(cuv * 1.4 + vec2(cloudT * 0.008, 0.0));
    float cover = smoothstep(0.52, 0.72, cl);
    vec3 cloudCol = mix(vec3(1.0), cloudTint, 0.35) * (0.75 + 0.45 * pow(s, 3.0));
    col = mix(col, cloudCol, cover * smoothstep(0.02, 0.2, d.y) * 0.85);
  }
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

export interface SkyRig { mesh: THREE.Mesh; mat: THREE.ShaderMaterial; setMood(m: SkyMood): void; tick(dt: number): void; }

export function makeSky(): SkyRig {
  const mat = new THREE.ShaderMaterial({
    vertexShader: VERT, fragmentShader: FRAG, side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: {
      topColor: { value: new THREE.Color(0x3a7bd5) }, horizonColor: { value: new THREE.Color(0xbfe3f0) },
      sunDir: { value: new THREE.Vector3(0.45, 0.75, 0.5).normalize() }, sunColor: { value: new THREE.Color(0xfff3d6) },
      cloudTint: { value: new THREE.Color(0xffffff) }, cloudT: { value: 0 },
    },
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(280, 16, 12), mat);
  mesh.frustumCulled = false;
  mesh.renderOrder = -10;
  return {
    mesh, mat,
    setMood(m: SkyMood) {
      (mat.uniforms.topColor.value as THREE.Color).set(m.top);
      (mat.uniforms.horizonColor.value as THREE.Color).set(m.horizon);
      (mat.uniforms.sunColor.value as THREE.Color).set(m.sun);
      (mat.uniforms.cloudTint.value as THREE.Color).set(m.cloudTint);
      (mat.uniforms.sunDir.value as THREE.Vector3).copy(m.sunDir);
    },
    tick(dt: number) { (mat.uniforms.cloudT.value as number) += dt; },
  };
}
