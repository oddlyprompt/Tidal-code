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
const results=[];
for(const profile of (process.env.PROFILE==='desktop'?[{name:'desktop',viewport:{width:1200,height:750}}]:[{name:'desktop',viewport:{width:1440,height:900}},{name:'mobile',viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1}])){
 const context=await browser.newContext(profile),page=await context.newPage();page.setDefaultTimeout(120000);const errors=[],failed=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});page.on('response',r=>{if(r.status()>=400)failed.push(r.url())});
 await page.goto((process.env.TEST_URL||'http://127.0.0.1:4173/')+'?qa=1'+(profile.name==='mobile'?'&mobile=1':''));
 await page.waitForFunction(()=>['ready','error'].includes(document.documentElement.dataset.status),{timeout:120000});
 const status=await page.locator('html').getAttribute('data-status');if(status==='ready'){await page.locator('#loader').waitFor({state:'hidden'});await page.evaluate(()=>window.tidal.qaPaused=true)}await page.screenshot({path:`tests/output/${profile.name}-arrival.png`});
 if(status==='ready'){
 await page.locator('#run-qa').click();const qa=JSON.parse(await page.locator('#qa-result').getAttribute('data-result'));await page.evaluate(()=>{document.querySelector('#run-qa').hidden=true;document.querySelector('#qa-result').hidden=true});await page.locator('#start').click();await page.evaluate(()=>{const app=window.tidal;app.player.cameraPose(app.rendering.camera,1/60,10,false);app.rendering.renderer.render(app.rendering.scene,app.rendering.camera)});await page.waitForTimeout(500);await page.screenshot({path:`tests/output/${profile.name}-ground.png`});
 // Renderer inspection and state manipulation are limited to the explicit development QA query.
 await page.evaluate(()=>{window.tidal.player.position.set(11,0,23);window.tidal.player.yaw=0;window.tidal.player.cameraPose(window.tidal.rendering.camera,1/60,10,false);window.tidal.rendering.renderer.render(window.tidal.rendering.scene,window.tidal.rendering.camera)});await page.waitForTimeout(400);await page.screenshot({path:`tests/output/${profile.name}-beach.png`});
 await page.evaluate(()=>{window.tidal.player.position.set(-39,0,17);window.tidal.player.yaw=0;window.tidal.player.cameraPose(window.tidal.rendering.camera,1/60,10,false);window.tidal.rendering.renderer.render(window.tidal.rendering.scene,window.tidal.rendering.camera)});await page.waitForTimeout(400);await page.screenshot({path:`tests/output/${profile.name}-tower.png`});
 await page.evaluate(()=>{window.tidal.player.position.set(6,0,27);window.tidal.player.yaw=2.2;window.tidal.player.third=true;const app=window.tidal;app.player.avatar.visible=true;app.player.avatar.position.copy(app.player.position);app.factory.animate(app.player.avatar,'idle',5);app.player.cameraPose(app.rendering.camera,1/60,10,false);app.rendering.renderer.render(app.rendering.scene,app.rendering.camera)});await page.waitForTimeout(400);await page.screenshot({path:`tests/output/${profile.name}-people.png`});
 const metrics=await page.evaluate(()=>JSON.parse(document.querySelector('#diagnostics').dataset.metrics));results.push({profile:profile.name,status,errors,failed,qa,metrics});
 }else results.push({profile:profile.name,status,errors,failed,message:await page.locator('#loading-text').textContent()});await context.close();
}
await fs.writeFile('tests/output/report.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));await browser.close();
process.exit(results.some(r=>r.status!=='ready'||r.errors.length||r.failed.length||r.qa?.some(c=>!c.pass))?1:0);
