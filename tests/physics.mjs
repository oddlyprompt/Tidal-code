import * as THREE from '../vendor/three.module.js';
import {Environment} from '../src/environment.js';
import {mats} from '../src/materials.js';
import {rideDefinitions,V} from '../src/config.js';
import {Ride} from '../src/slides.js';
for(const k of ['fabric','white','teal','metal','wood'])mats[k]=new THREE.MeshStandardMaterial();
const env=Object.create(Environment.prototype);env.solids=[];env.surfaces=[];env.stairRoute=[];env.mesh=()=>{};env.board=()=>{};env.tower();
let failed=false;
for(const def of rideDefinitions){const r={...def,curve:new THREE.CatmullRomCurve3(def.nodes.map(n=>V(...n)),false,'centripetal')};r.length=r.curve.getLength();r.launch=r.curve.getPointAt(0);r.exit=r.curve.getPointAt(1);const route=env.accessRoute(r);let y=0,last=route[0],blocked=[];for(const target of route.slice(1)){const n=Math.ceil(last.distanceTo(target)/.035);for(let i=1;i<=n;i++){const p=last.clone().lerp(target,i/n),floor=env.floor(p.x,p.z,y);if(env.blocked(p.x,p.z,floor))blocked.push({p:p.toArray(),floor,colliders:env.solids.filter(s=>p.x>s.min.x-.25&&p.x<s.max.x+.25&&p.z>s.min.z-.25&&p.z<s.max.z+.25&&floor+.95>s.min.y&&floor+.1<s.max.y)});y=floor}last=target}console.log(def.name,'height',y,'blocked',blocked.length,JSON.stringify(blocked.slice(0,1)));if(blocked.length)failed=true;
}
process.exitCode=failed?1:0;
// Drive the real exploration controller up every access route with fixed time steps.
const {Player}=await import('../src/player.js');globalThis.localStorage={getItem:()=>null,setItem:()=>{}};
for(const def of rideDefinitions){const r={...def,curve:new THREE.CatmullRomCurve3(def.nodes.map(n=>V(...n)),false,'centripetal')};r.launch=r.curve.getPointAt(0);const route=env.accessRoute(r),scene=new THREE.Scene();const p=new Player(env,{nearby:()=>undefined},{on:true,splash:()=>{}},scene);p.position.copy(route[0]);const input={look:{x:0,y:0},keys:{},axes:()=>({x:0,y:0})};let total=0,stuck=false;for(const target of route.slice(1)){let n=0;while(Math.hypot(p.position.x-target.x,p.position.z-target.z)>.09&&n++<5000){const dx=target.x-p.position.x,dz=target.z-p.position.z,len=Math.hypot(dx,dz);input.axes=()=>({x:dx/len,y:-dz/len});p.update(1/120,total/120,input);total++}if(n>=5000){stuck=true;break}}console.log(def.name,'actual player route',stuck?'BLOCKED':'PASS',p.position.toArray(),total/120+'s');if(stuck||Math.abs(p.position.y-def.deck)>.3)failed=true;
}
process.exitCode=failed?1:0;
