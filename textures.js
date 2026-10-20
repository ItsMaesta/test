import * as THREE from 'three';

function rng(seed){let s=seed;return()=>((s=(s*16807)%2147483647)-1)/2147483646;}
function canvasTex(w,h,draw,repeat){
  const c=document.createElement('canvas');c.width=w;c.height=h;
  draw(c.getContext('2d'),w,h);
  const t=new THREE.CanvasTexture(c);
  t.wrapS=t.wrapT=THREE.RepeatWrapping;
  if(repeat)t.repeat.set(repeat[0],repeat[1]);
  t.colorSpace=THREE.SRGBColorSpace;
  t.anisotropy=8;
  return t;
}
function noise(g,w,h,n,alpha,r){
  for(let i=0;i<n;i++){
    const v=r()>.5?255:0;
    g.fillStyle=`rgba(${v},${v},${v},${alpha*r()})`;
    g.fillRect(r()*w,r()*h,1+r()*3,1+r()*3);
  }
}

// reptile skin: olive scales, dark grooves, grime blotches
export function skinTexture(repeat){
  return canvasTex(512,512,(g,w,h)=>{
    const r=rng(7);
    g.fillStyle='#6d6a2f';g.fillRect(0,0,w,h);
    const s=32;
    for(let y=0;y<h/s+1;y++)for(let x=0;x<w/s+1;x++){
      const cx=x*s+(y%2)*s/2,cy=y*s;
      g.fillStyle=`hsl(${55+r()*15},${35+r()*15}%,${38+r()*22}%)`;
      g.strokeStyle='rgba(25,20,5,.85)';g.lineWidth=2.5;
      g.beginPath();g.moveTo(cx-s/2+2,cy);g.quadraticCurveTo(cx,cy-s/2,cx+s/2-2,cy);
      g.quadraticCurveTo(cx+s/2,cy+s*.7,cx,cy+s*.85);g.quadraticCurveTo(cx-s/2,cy+s*.7,cx-s/2+2,cy);
      g.fill();g.stroke();
    }
    for(let i=0;i<40;i++){
      g.fillStyle=`rgba(20,15,0,${.05+r()*.08})`;
      g.beginPath();g.arc(r()*w,r()*h,20+r()*50,0,7);g.fill();
    }
    noise(g,w,h,4000,.25,r);
  },repeat);
}

// armor: rusted brass/iron with seams, rivets, painted X crates, hazard stripes, stencils
export function armorTexture(kind,seed){
  return canvasTex(512,512,(g,w,h)=>{
    const r=rng(seed);
    const base=kind==='brass'?[120,98,50]:kind==='dark'?[62,56,44]:[96,84,58];
    g.fillStyle=`rgb(${base})`;g.fillRect(0,0,w,h);
    for(let i=0;i<120;i++){
      g.fillStyle=`rgba(${100+r()*60},${40+r()*30},10,${.04+r()*.1})`;
      g.beginPath();g.ellipse(r()*w,r()*h,10+r()*60,5+r()*40,r()*3,0,7);g.fill();
    }
    g.strokeStyle='rgba(15,10,5,.9)';g.lineWidth=4;
    g.strokeRect(6,6,w-12,h-12);
    g.beginPath();g.moveTo(0,h/2);g.lineTo(w,h/2);g.moveTo(w/2,0);g.lineTo(w/2,h);g.stroke();
    g.lineWidth=1.5;g.strokeStyle='rgba(255,230,160,.25)';
    g.strokeRect(10,10,w-20,h-20);
    for(const [px,py] of [[0,0],[1,0],[0,1],[1,1],[.5,0],[.5,1],[0,.5],[1,.5],[.5,.5]]){
      const x=24+px*(w-48),y=24+py*(h-48);
      g.fillStyle='#2a2217';g.beginPath();g.arc(x+1.5,y+1.5,7,0,7);g.fill();
      g.fillStyle='#a58f5a';g.beginPath();g.arc(x,y,6,0,7);g.fill();
      g.fillStyle='rgba(255,255,220,.5)';g.beginPath();g.arc(x-2,y-2,2,0,7);g.fill();
    }
    g.save();g.translate(w/2,h/2);g.globalAlpha=.85;
    if(seed%3===0){
      g.strokeStyle='#1c1710';g.lineWidth=14;
      g.strokeRect(-120,-120,240,240);
      g.beginPath();g.moveTo(-120,-120);g.lineTo(120,120);g.moveTo(120,-120);g.lineTo(-120,120);g.stroke();
    }else if(seed%3===1){
      g.beginPath();g.rect(-200,-50,400,100);g.clip();
      g.fillStyle='#c9a521';g.fillRect(-200,-50,400,100);
      g.fillStyle='#17140e';
      for(let i=-10;i<10;i++){g.beginPath();g.moveTo(i*40,-50);g.lineTo(i*40+20,-50);g.lineTo(i*40-10,50);g.lineTo(i*40-30,50);g.fill();}
    }else{
      g.fillStyle='#1c1710';g.font='bold 90px Impact, Arial';g.textAlign='center';
      g.fillText('W-'+(10+seed%89),0,-30);
      g.beginPath();g.arc(0,70,40,0,7);g.fill();
      g.fillStyle='#a8452b';g.beginPath();g.arc(-15,64,8,0,7);g.arc(15,64,8,0,7);g.fill();
    }
    g.restore();
    for(let i=0;i<150;i++){
      g.strokeStyle=`rgba(${r()>.5?'210,200,160':'20,15,10'},${.15+r()*.3})`;g.lineWidth=1;
      const x=r()*w,y=r()*h;g.beginPath();g.moveTo(x,y);g.lineTo(x+(r()-.5)*50,y+(r()-.5)*50);g.stroke();
    }
    for(let i=0;i<60;i++){
      g.fillStyle='rgba(60,25,8,.25)';g.fillRect(r()*w,r()*h,2+r()*2,20+r()*70);
    }
    noise(g,w,h,6000,.3,r);
  });
}

export function bumpTexture(seed){
  return canvasTex(256,256,(g,w,h)=>{
    const r=rng(seed);g.fillStyle='#808080';g.fillRect(0,0,w,h);noise(g,w,h,5000,.6,r);
  },[2,2]);
}

export function steelTexture(){
  return canvasTex(256,256,(g,w,h)=>{
    const r=rng(99);g.fillStyle='#3b3a36';g.fillRect(0,0,w,h);
    for(let i=0;i<h;i+=2){g.fillStyle=`rgba(255,255,255,${r()*.08})`;g.fillRect(0,i,w,1);}
    for(let i=0;i<60;i++){g.fillStyle=`rgba(130,60,20,${r()*.2})`;g.beginPath();g.arc(r()*w,r()*h,r()*18,0,7);g.fill();}
    noise(g,w,h,2000,.3,r);
  },[2,2]);
}
