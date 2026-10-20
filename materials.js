import * as THREE from 'three';
import { skinTexture, armorTexture, bumpTexture, steelTexture } from './textures.js';

const steelMap = steelTexture();
export const skinMat = new THREE.MeshStandardMaterial({map:skinTexture([3,3]),roughness:.85,bumpMap:bumpTexture(4),bumpScale:2});
export const skinMatTail = new THREE.MeshStandardMaterial({map:skinTexture([6,1]),roughness:.85,bumpMap:bumpTexture(4),bumpScale:2});
const plates = [1,2,3,4,5,6].map((n,i)=>new THREE.MeshStandardMaterial({
  map:armorTexture(['brass','dark','rust'][i%3],n*7+i),roughness:.55,metalness:.6,bumpMap:bumpTexture(n),bumpScale:1.5}));
export const steel = new THREE.MeshStandardMaterial({map:steelMap,roughness:.4,metalness:.9});
export const spikeMat = new THREE.MeshStandardMaterial({color:0x8a877c,map:steelMap,roughness:.35,metalness:.95});
export const boneMat = new THREE.MeshStandardMaterial({color:0xb7ad82,roughness:.7});
export const eyeMat = new THREE.MeshStandardMaterial({color:0xff1010,emissive:0xff0000,emissiveIntensity:3});
export const glowMat = new THREE.MeshStandardMaterial({color:0xff7a1a,emissive:0xff5500,emissiveIntensity:2});
export const holeMat = new THREE.MeshBasicMaterial({color:0x080604});
export const pm = i => plates[((i%plates.length)+plates.length)%plates.length];
