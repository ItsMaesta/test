import * as THREE from 'three';
import { add, spike, crate, pipe } from './helpers.js';
import { pm, skinMat, skinMatTail, boneMat } from './materials.js';

export function buildArms(body){
  return [-1,1].map(s=>{
    const sh=new THREE.Group();sh.position.set(s*1.9,.5,1.1);sh.rotation.set(.4,0,s*.25);body.add(sh);
    add(sh,new THREE.SphereGeometry(.65,24,16),pm(1));
    add(sh,new THREE.CylinderGeometry(.45,.35,1.9,16),skinMat,[0,-1,0]);
    const el=new THREE.Group();el.position.set(0,-1.9,0);el.rotation.x=-.7;sh.add(el);
    add(el,new THREE.SphereGeometry(.38,16,12),skinMat);
    add(el,new THREE.CylinderGeometry(.38,.3,1.7,16),skinMat,[0,-.85,0]);
    crate(el,[0,-.7,.2],[.9,1.2,.9],s>0?3:0);
    spike(el,[0,-1.7,0],[0,-1,.2],1.6,.1);
    for(let i=0;i<3;i++)add(el,new THREE.ConeGeometry(.07,.3,6),boneMat,[(i-1)*.13,-1.75,.15],[Math.PI,0,0]);
    pipe(sh,[s*.5,-.8,-.4],1.3,.1);
    return sh;
  });
}

export function buildLegs(beast,bodyY){
  [-1,1].forEach(s=>{
    const hip=new THREE.Group();hip.position.set(s*1.3,-1.5+bodyY,.2);beast.add(hip);
    add(hip,new THREE.SphereGeometry(.9,24,18),skinMat,[0,0,0],[0,0,0],[1,1.1,1.1]);
    add(hip,new THREE.CylinderGeometry(.8,.5,1.6,16),skinMat,[s*.15,-.8,.3],[-.5,0,0]);
    crate(hip,[s*.55,-.4,.4],[.5,1.4,1.3],s>0?6:9);
    crate(hip,[s*.1,-.2,1],[.9,.9,.4],s>0?0:3);
    const knee=new THREE.Group();knee.position.set(s*.15,-1.5,.75);hip.add(knee);
    add(knee,new THREE.SphereGeometry(.45,16,12),pm(1));
    add(knee,new THREE.CylinderGeometry(.42,.28,1.8,14),skinMat,[0,-.75,-.55],[.6,0,0]);
    pipe(knee,[s*.4,-.7,-.5],1.7,.1,[.6,0,0]);
    const foot=new THREE.Group();foot.position.set(0,-1.45,-1.1);knee.add(foot);
    add(foot,new THREE.BoxGeometry(.9,.35,1.2),skinMat,[0,0,.2]);
    for(let i=-1;i<=1;i++){
      add(foot,new THREE.CylinderGeometry(.14,.18,.9,10),skinMat,[i*.32,-.05,.95],[Math.PI/2,0,i*.15]);
      add(foot,new THREE.ConeGeometry(.12,.55,8),boneMat,[i*.34,-.1,1.55],[Math.PI/2+.4,0,0]);
    }
    add(foot,new THREE.ConeGeometry(.1,.5,8),boneMat,[0,0,-.5],[-Math.PI/2-.3,0,0]);
  });
}

// tail: chained segments ending in a spiked mace
export function buildTail(body){
  const tail=new THREE.Group();tail.position.set(0,-1.2,-2.2);body.add(tail);
  const segs=[];const N=18;
  for(let i=0;i<N;i++){
    const t=i/N,r=.62*(1-t)+.12;
    const g=new THREE.Group();
    add(g,new THREE.CylinderGeometry(r*.85,r,.55,14),skinMatTail,[0,0,-.28],[Math.PI/2,0,0]);
    add(g,new THREE.TorusGeometry(r*.95,.07,6,16),pm(i),[0,0,-.02]);
    spike(g,[0,r*.85,-.28],[0,1,-.3],.5*(1-t)+.25,.05);
    if(i%3===0)add(g,new THREE.BoxGeometry(r*1.5,.12,.3),pm(i+1),[0,r+.04,-.28]);
    segs.push(g);
  }
  let parent=tail;
  segs.forEach((g,i)=>{g.position.z=i?-.55:0;g.rotation.x=i<5?-.08:.1;parent.add(g);parent=g;});
  const mace=new THREE.Group();mace.position.set(0,0,-.9);parent.add(mace);
  add(mace,new THREE.SphereGeometry(.62,24,18),pm(2));
  for(let i=0;i<22;i++){
    const phi=Math.acos(1-2*(i+.5)/22),th=Math.PI*(1+Math.sqrt(5))*i;
    const d=[Math.sin(phi)*Math.cos(th),Math.cos(phi),Math.sin(phi)*Math.sin(th)];
    spike(mace,d.map(v=>v*.55),d,.75,.07);
  }
  tail.rotation.x=.55;
  return segs;
}
