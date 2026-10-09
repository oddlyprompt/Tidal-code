import {createRequire} from 'node:module';
if(!process.env.TEST_URL)createRequire(import.meta.url)('./server.cjs');
import {chromium as playwright,devices} from '@playwright/test';
import chromium from '@sparticuz/chromium';
import fs from 'node:fs/promises';
import {createReadStream,createWriteStream,existsSync} from 'node:fs';
import {createBrotliDecompress} from 'node:zlib';
import {pipeline} from 'node:stream/promises';
import {execFileSync} from 'node:child_process';
if(!existsSync('/tmp/chromium')||(await fs.stat('/tmp/chromium')).size<1000000){await pipeline(createReadStream('node_modules/@sparticuz/chromium/bin/chromium.br'),createBrotliDecompress(),createWriteStream('/tmp/chromium'));await fs.chmod('/tmp/chromium',0o755)}
for(const pack of ['swiftshader','al2023']){if(existsSync(`node_modules/@sparticuz/chromium/bin/${pack}.tar.br`)){await pipeline(createReadStream(`node_modules/@sparticuz/chromium/bin/${pack}.tar.br`),createBrotliDecompress(),createWriteStream(`/tmp/${pack}.tar`));execFileSync('tar',['--no-same-owner','-xf',`/tmp/${pack}.tar`,'-C','/tmp'])}}
const browser=await playwright.launch({executablePath:'/tmp/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--ignore-gpu-blocklist','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'],env:{...process.env,LD_LIBRARY_PATH:'/tmp/al2023/lib:'+ (process.env.LD_LIBRARY_PATH||'')}});
await fs.mkdir('tests/output',{recursive:true});
const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1}),page=await context.newPage();page.setDefaultTimeout(120000);const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
await page.goto('http://127.0.0.1:4173/Tidal-code/?qa=1&mobile=1');await page.waitForFunction(()=>document.documentElement.dataset.status==='ready');await page.locator('#loader').waitFor({state:'hidden'});await page.evaluate(()=>{window.tidal.qaPaused=true;document.querySelector('#run-qa').hidden=true;document.querySelector('#qa-result').hidden=true});await page.locator('#start').click();
const checks=[],check=(name,pass,details)=>checks.push({name,pass,details});const cdp=await context.newCDPSession(page);
const joystick=await page.locator('#joystick').boundingBox(),jx=joystick.x+joystick.width/2,jy=joystick.y+joystick.height/2;
await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:jx,y:jy,id:1}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:jx,y:jy-36,id:1}]});
const moved=await page.evaluate(()=>{const a=window.tidal,before=a.player.position.z;for(let i=0;i<60;i++)a.player.update(1/60,i/60,a.input);return{axis:a.input.axes().y,before,after:a.player.position.z}});check('Real touch joystick moves exploration player',moved.axis>.9&&moved.after<moved.before-2,moved);
await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});check('Joystick release stops movement',await page.evaluate(()=>window.tidal.input.axes().y===0));
await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:230,y:340,id:2}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:300,y:348,id:2}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});check('Touch swipe rotates view',await page.evaluate(()=>{const a=window.tidal;a.player.update(1/60,1,a.input);return Math.abs(a.player.yaw)>.1}));
check('Gradual water entry activates swimming',await page.evaluate(()=>{const a=window.tidal;a.player.position.set(17,0,2);for(let i=0;i<180;i++)a.player.update(1/60,i/60,a.input);a.ui.update(5,30);return a.player.mode==='swim'&&a.player.position.y<0}));
const float=await page.locator('#float').boundingBox();await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:float.x+float.width/2,y:float.y+float.height/2,id:3}]});await page.waitForTimeout(600);check('Hold-to-dive submerges camera',await page.evaluate(()=>{const a=window.tidal;for(let i=0;i<180;i++)a.player.update(1/60,i/60,a.input);return a.input.dive&&a.player.cameraPose(a.rendering.camera,1/60,5,false)}));await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
for(let index=0;index<5;index++){
 await page.evaluate(index=>{const a=window.tidal,r=a.slides.rides[index];a.player.ride=null;a.player.mode='walk';a.player.third=!!r.tube;a.player.position.copy(r.launch);a.ui.update(5,30)},index);
 await page.locator('#interact').tap();check('Touch launches '+index,await page.evaluate(index=>window.tidal.player.ride?.config.id===window.tidal.slides.rides[index].id,index));
 if([1,3,4].includes(index)){
 await page.evaluate(index=>{const a=window.tidal;for(let i=0;i<4000&&a.player.ride;i++){const r=a.player.ride;if(index===4?r.phase==='flight'&&r.airborneTime>.55:r.phase==='channel'&&r.distance/r.config.length>.40)break;a.player.update(1/120,i/120,a.input)}a.player.avatar.visible=a.player.third;a.player.avatar.position.copy(a.player.position);a.player.avatar.position.y-=.55;a.player.avatar.rotation.y=Math.atan2(a.player.ride.frame.tangent.x,a.player.ride.frame.tangent.z);a.factory.animate(a.player.avatar,'ride',4);a.player.cameraPose(a.rendering.camera,1/60,4,false);a.ui.update(4,30);a.rendering.renderer.render(a.rendering.scene,a.rendering.camera)},index);
 await page.screenshot({path:`tests/output/mobile-ride-${index}.png`});
 }
 const finished=await page.evaluate(()=>{const a=window.tidal;for(let i=0;i<12000&&a.player.ride;i++)a.player.update(1/120,i/120,a.input);return{mode:a.player.mode,position:a.player.position.toArray(),completed:a.player.completed.size}});check('Player returns to swimming after ride '+index,finished.mode==='swim',finished);
}
check('No runtime or shader errors',errors.length===0,errors);
await page.evaluate(()=>{const a=window.tidal;a.player.position.set(-8,0,22);a.player.third=false;a.player.yaw=.4;a.player.pitch=0;a.player.cameraPose(a.rendering.camera,1/60,5,false);a.ui.update(5,30);a.rendering.renderer.render(a.rendering.scene,a.rendering.camera)});await page.screenshot({path:'tests/output/mobile-final.png'});
await fs.writeFile('tests/output/interactions.json',JSON.stringify(checks,null,2));console.log(JSON.stringify(checks,null,2));await browser.close();process.exit(checks.some(c=>!c.pass)?1:0);
