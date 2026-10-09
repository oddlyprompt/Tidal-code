import * as THREE from 'three';
export const V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z);
export const clamp=THREE.MathUtils.clamp;
export const lerp=THREE.MathUtils.lerp;
let seed=43892;export const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
export const range=(a,b)=>a+(b-a)*rand();
export const pools=[
{id:'wave',name:'Crescent Beach',x:17,z:-1,rx:23,rz:23,depth:3.2,beach:true},
{id:'lagoon',name:'The Quiet Lagoon',x:34,z:32,rx:12,rz:9,depth:1.7},
{id:'splash',name:'Little Tides',x:-19,z:32,rx:11,rz:8,depth:.35},
{id:'landing',name:'Slide Runout',x:-17,z:1,rx:10,rz:9,depth:1.7},
{id:'cannon',name:'Cannon Cove',x:11,z:-37,rx:13,rz:8,depth:4.6}
];
export function poolAt(x,z){return pools.find(p=>((x-p.x)/p.rx)**2+((z-p.z)/p.rz)**2<1)}
export function poolBottom(p,x,z){const r=Math.hypot((x-p.x)/p.rx,(z-p.z)/p.rz);if(p.beach){const shoreline=p.z+p.rz*Math.sqrt(Math.max(0,1-((x-p.x)/p.rx)**2));return -clamp((shoreline-z)*.14-.05,0,p.depth)}return -p.depth*clamp((1-r)*8,0,1)}
export function waveHeight(x,z,t,on=true){const p=poolAt(x,z);if(!p)return 0;if(p.id==='wave'){let depth=-poolBottom(p,x,z),amp=Math.min(depth*.24,.38)*(on?(.65+.35*Math.sin(t*.07)**2):.12);return .03+amp*Math.sin(z*.48-t*1.65)+.032*Math.sin(x*1.9-z*1.1+t*2)}return .025+.025*Math.sin(z*1.3+x*.8+t*1.1)}
export const rideDefinitions=[
{id:'serpent',name:'The Serpent',tag:'OPEN BODY SLIDE',color:0x2aafa0,radius:.95,deck:14,friction:.11,maxSpeed:14,nodes:[[-31,14,-29],[-27,13.6,-29],[-18,12,-24],[-13,10,-16],[-23,8.5,-13],[-29,6.5,-7],[-22,4.5,-3],[-13,2,-6],[-10,.3,-2]]},
{id:'blackout',name:'Blackout',tag:'ENCLOSED · DARK TUNNEL',color:0x544275,radius:1.05,deck:16,closed:true,friction:.08,maxSpeed:17,nodes:[[-31,16,-25],[-39,15.4,-25],[-46,14,-29],[-48,12.2,-18],[-42,9.8,-12],[-44,7.3,-4],[-43,5.5,10],[-35,2,16],[-24,.3,0]]},
{id:'vertigo',name:'Vertigo',tag:'22 M · DROP CAPSULE',color:0xf58264,radius:.82,deck:22,drop:true,friction:.045,maxSpeed:27,nodes:[[-30,22,-33],[-26,22,-33],[-24,20,-33],[-23,12,-33],[-22,4,-32],[-20,1.2,-29],[-18,.5,-23],[-18,.3,-9]]},
{id:'vortex',name:'The Vortex',tag:'INFLATABLE TUBE RIDE',color:0xe5b547,radius:1.6,deck:18,tube:true,friction:.08,maxSpeed:18,nodes:[[-31,18,-18],[-25,17.4,-18],[-15,16,-10],[-20,13.7,-3],[-31,11.5,-4],[-36,9,-12],[-38,6.2,-16],[-34,6,4],[-29,5,10],[-22,.3,8]]},
{id:'cannon',name:'The Cannon',tag:'22 M · AIRBORNE LAUNCH',color:0x4f95be,radius:1.1,deck:22,jump:true,friction:.035,maxSpeed:30,nodes:[[-27,22,-22],[-22,21.8,-22],[-17,17,-28],[-13,7,-34],[-9,2.1,-39],[-5,2.2,-39],[-2,3.6,-39],[0,4.6,-39]]}
];
