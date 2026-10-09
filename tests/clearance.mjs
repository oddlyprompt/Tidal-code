import * as THREE from 'three';
import {rideDefinitions} from '../src/config.js';
const rs=rideDefinitions.map(r=>({...r,c:new THREE.CatmullRomCurve3(r.nodes.map(n=>new THREE.Vector3(...n)),false,'centripetal')}));
for(let a=0;a<5;a++)for(let b=a+1;b<5;b++){let closest=[99];for(let i=15;i<290;i++)for(let j=15;j<290;j++){let p=rs[a].c.getPointAt(i/300),q=rs[b].c.getPointAt(j/300);q.y+=rs[b].radius;p.y+=rs[a].radius;let d=p.distanceTo(q);if(d<closest[0])closest=[d,i/300,j/300,p.toArray(),q.toArray()]};const required=rs[a].radius+rs[b].radius+.3;console.log(rs[a].id,rs[b].id,'clearance',closest[0].toFixed(2),'required',required);if(closest[0]<required)throw new Error('Intersecting ride channels')}
