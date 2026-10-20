import * as THREE from 'three';
import { add, spike, crate, pipe, vent } from './helpers.js';
import { pm, skinMat, steel, spikeMat, boneMat, eyeMat, glowMat } from './materials.js';
import { buildArms, buildLegs, buildTail } from './limbs.js';

export function buildBeast(){
  const beast=new THREE.Group();
  const body=new THREE.Group();beast.add(body);
  body.rotation.x=.18;body.position.set(0,4.1,0);

  // torso + belly
  add(body,new THREE.SphereGeometry(1.7,48,32),skinMat,[0,0,0],[0,0,0],[1.1,1.15,1.35]);
  add(body,new THREE.SphereGeometry(1.2,32,24),skinMat,[0,-.7,.6],[0,0,0],[1.2,1.1,1.1]);

  // back harness
  const back=new THREE.Group();back.position.set(0,.6,-.3);body.add(back);
  add(back,new THREE.BoxGeometry(2.8,.5,3.4),pm(1),[0,1,0]);
  add(back,new THREE.CylinderGeometry(1.6,1.9,1.6,10),pm(3),[0,.5,-.1],[0,Math.PI/10,0]);
  const fanHouse=new THREE.Group();fanHouse.position.set(0,1.75,.5);fanHouse.rotation.x=-.3;back.add(fanHouse);
  add(fanHouse,new THREE.CylinderGeometry(1.15,1.15,.9,32),pm(0));
  add(fanHouse,new THREE.TorusGeometry(1.1,.14,10,40),steel,[0,.46,0],[Math.PI/2,0,0]);
  const fan=new THREE.Group();fan.position.y=.4;fanHouse.add(fan);
  for(let i=0;i<8;i++)add(fan,new THREE.BoxGeometry(.18,.05,1),steel,[Math.cos(i*Math.PI/4)*.5,0,Math.sin(i*Math.PI/4)*.5],[0,-i*Math.PI/4,.3]);
  add(fan,new THREE.CylinderGeometry(.22,.22,.12,16),pm(2));

  crate(back,[-1.7,.6,.4],[1,1.6,2.2],0,[0,0,.12]);
  crate(back,[1.7,.6,.4],[1,1.6,2.2],3,[0,0,-.12]);
  crate(back,[-1.6,1.5,-1],[.9,.9,1.2],6,[0,0,.4]);
  crate(back,[1.6,1.5,-1],[.9,.9,1.2],9,[0,0,-.4]);
  crate(back,[0,1.6,-1.6],[1.6,.9,1],12,[.3,0,0]);
  for(const s of[-1,1]){
    vent(back,[s*1.3,2.1,1.5],2.1,.28,[Math.PI/2.6,0,s*.15]);
    pipe(back,[s*.8,2.3,1.9],1.5,.18,[Math.PI/2.2,0,0]);
  }
  pipe(back,[2.1,.8,-1.2],2.4,.22,[0,0,.9]);
  pipe(back,[-2.1,.8,-1.2],2.4,.22,[0,0,-.9]);
  const sp=[[-1.5,1.9,-1.5],[1.5,1.9,-1.5],[-.7,2.4,-2],[.7,2.4,-2],[-2.1,1.3,.2],[2.1,1.3,.2],[0,2.5,-1],[-1,2.6,.3],[1,2.6,.3]];
  sp.forEach((p,i)=>spike(back,p,[p[0]*.45,1.2,p[2]*.7-.5],2.2+(i%3)*.6,.17+(i%2)*.04));
  for(const s of[-1,1])add(back,new THREE.TorusGeometry(.5,.07,8,24,Math.PI),glowMat,[s*1,.9,-1.82]);

  // chest rig + hips
  add(body,new THREE.TorusGeometry(1.55,.18,10,40),pm(1),[0,-.4,.2],[Math.PI/2.1,0,0],[1.1,1.3,1]);
  for(let i=0;i<9;i++){
    const a=-.9+i*.22;
    add(body,new THREE.CapsuleGeometry(.1,.4,4,10),spikeMat,[Math.sin(a)*1.5,-.1,Math.cos(a)*1.75]);
  }
  for(const s of[-1,1]){
    crate(body,[s*1.5,-1.4,.5],[1.2,1.3,1.5],s>0?0:3,[0,0,s*.1]);
    crate(body,[s*1.4,-.5,1.5],[.7,.9,.5],s>0?6:9);
    pipe(body,[s*1.2,-1.4,1.4],1.4,.12);
  }
  add(body,new THREE.BoxGeometry(1.4,1,.6),pm(4),[0,-1.5,1.5]);

  // head
  const head=new THREE.Group();head.position.set(0,.85,2.1);head.rotation.x=.2;body.add(head);
  add(head,new THREE.SphereGeometry(.7,32,24),skinMat,[0,0,0],[0,0,0],[1,.9,1.2]);
  add(head,new THREE.CylinderGeometry(.28,.5,1.2,16),skinMat,[0,-.12,.95],[Math.PI/2,0,0],[1.1,1,.8]);
  add(head,new THREE.BoxGeometry(.7,.18,1.1),skinMat,[0,-.5,.8],[.1,0,0]);
  for(let i=0;i<6;i++)for(const s of[-1,1]){
    add(head,new THREE.ConeGeometry(.04,.2,6),boneMat,[s*.24,-.38,.4+i*.17],[Math.PI,0,0]);
    add(head,new THREE.ConeGeometry(.035,.17,6),boneMat,[s*.22,-.28,.45+i*.16]);
  }
  for(const s of[-1,1]){
    add(head,new THREE.SphereGeometry(.12,16,12),eyeMat,[s*.42,.2,.5]);
    add(head,new THREE.BoxGeometry(.32,.08,.35),pm(1),[s*.42,.35,.5],[0,s*.2,-s*.3]);
    add(head,new THREE.ConeGeometry(.1,.7,8),boneMat,[s*.55,.55,-.1],[-.5,0,-s*.6]);
  }
  add(head,new THREE.BoxGeometry(.8,.12,1),pm(2),[0,.62,.1],[.15,0,0]);
  spike(head,[0,.6,-.4],[0,.4,-1],1.1,.08);
  const eyeLight=new THREE.PointLight(0xff2200,6,6);eyeLight.position.set(0,.2,.8);head.add(eyeLight);
  pipe(head,[.95,.1,-.2],1.2,.14,[Math.PI/2,0,0],pm(3));

  const arms=buildArms(body);
  buildLegs(beast,body.position.y);
  const segs=buildTail(body);
  return {beast,body,head,arms,fan,segs,baseY:body.position.y};
}
