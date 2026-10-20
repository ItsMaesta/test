import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { buildBeast } from './beast.js';
import { eyeMat } from './materials.js';

const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
document.body.appendChild(renderer.domElement);

const scene=new THREE.Scene();
scene.background=new THREE.Color(0x55595c);
scene.fog=new THREE.Fog(0x55595c,18,40);
const camera=new THREE.PerspectiveCamera(42,innerWidth/innerHeight,.1,100);
camera.position.set(8,4.5,11);
const controls=new OrbitControls(camera,renderer.domElement);
controls.target.set(0,3,0);controls.enableDamping=true;controls.autoRotate=true;controls.autoRotateSpeed=1.2;
addEventListener('dblclick',()=>controls.autoRotate=!controls.autoRotate);

scene.add(new THREE.HemisphereLight(0xcfd8e0,0x40382a,1.2));
const key=new THREE.DirectionalLight(0xffe2b0,3);key.position.set(6,10,5);key.castShadow=true;
key.shadow.mapSize.set(2048,2048);Object.assign(key.shadow.camera,{left:-10,right:10,top:10,bottom:-10});
scene.add(key);
const rim=new THREE.DirectionalLight(0x7aa0ff,1.5);rim.position.set(-8,4,-6);scene.add(rim);

const floor=new THREE.Mesh(new THREE.CircleGeometry(30,64),new THREE.MeshStandardMaterial({color:0x5b5d5e,roughness:1}));
floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;scene.add(floor);

const B=buildBeast();
scene.add(B.beast);
// plant the feet on the floor
B.beast.updateMatrixWorld(true);
B.beast.position.y=-new THREE.Box3().setFromObject(B.beast).min.y;

const clock=new THREE.Clock();
function frame(){
  const t=clock.getElapsedTime();
  B.fan.rotation.y=-t*6;
  B.body.position.y=B.baseY+Math.sin(t*1.6)*.04;
  B.head.rotation.y=Math.sin(t*.7)*.12;
  B.arms[0].rotation.x=.4+Math.sin(t*1.6)*.05;
  B.arms[1].rotation.x=.4-Math.sin(t*1.6)*.05;
  B.segs.forEach((g,i)=>g.rotation.y=Math.sin(i*.45+t*1.2)*.22);
  eyeMat.emissiveIntensity=2.5+Math.sin(t*3);
  controls.update();
  renderer.render(scene,camera);
  requestAnimationFrame(frame);
}
frame();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
