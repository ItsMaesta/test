import * as THREE from 'three';
import { pm, steel, spikeMat, holeMat } from './materials.js';

export function add(parent,geo,mat,pos=[0,0,0],rot=[0,0,0],scale=[1,1,1]){
  const m=new THREE.Mesh(geo,mat);
  m.position.set(...pos);m.rotation.set(...rot);m.scale.set(...scale);
  m.castShadow=m.receiveShadow=true;parent.add(m);return m;
}
// banded metal spike on a collar
export function spike(parent,pos,dir,len=1,rad=.1,mat=spikeMat){
  const g=new THREE.Group();g.position.set(...pos);
  g.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),new THREE.Vector3(...dir).normalize());
  add(g,new THREE.CylinderGeometry(rad*1.4,rad*1.4,len*.2,12),pm(1),[0,len*.1,0]);
  add(g,new THREE.ConeGeometry(rad,len,12),mat,[0,len*.7,0]);
  add(g,new THREE.TorusGeometry(rad*1.2,rad*.3,6,14),steel,[0,len*.35,0],[Math.PI/2,0,0]);
  parent.add(g);return g;
}
export const crate=(parent,pos,size,mi,rot=[0,0,0])=>add(parent,new THREE.BoxGeometry(...size),pm(mi),pos,rot);
export function pipe(parent,pos,len,rad,rot=[0,0,0],mat=steel){
  const g=new THREE.Group();g.position.set(...pos);g.rotation.set(...rot);
  add(g,new THREE.CylinderGeometry(rad,rad,len,16),mat);
  for(const s of[-1,1])add(g,new THREE.TorusGeometry(rad*1.05,rad*.18,6,16),pm(2),[0,s*len*.45,0],[Math.PI/2,0,0]);
  parent.add(g);return g;
}
// perforated canister (like the shoulder guns in the concept)
export function vent(parent,pos,len,rad,rot){
  const g=pipe(parent,pos,len,rad,rot,pm(1));
  for(let i=0;i<8;i++)for(let a=0;a<6;a++){
    const y=(i/7-.5)*len*.7,ang=a/6*Math.PI*2+(i%2)*.5;
    const h=add(g,new THREE.CircleGeometry(rad*.12,8),holeMat,[Math.cos(ang)*rad*1.01,y,Math.sin(ang)*rad*1.01]);
    h.rotation.y=Math.PI/2-ang;
  }
  return g;
}
