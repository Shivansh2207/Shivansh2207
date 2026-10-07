import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const assets = fileURLToPath(new URL('../assets/', import.meta.url));
await mkdir(assets, { recursive: true });
const C = { bg: '#090c12', panel: '#10151e', line: '#26303e', white: '#f2f5ec', muted: '#a1aaba', lime: '#c8ff62', violet: '#a899ff', cyan: '#77e1df' };
const esc = s => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const txt = (x,y,s,size=18,color=C.white,extra='') => `<text x="${x}" y="${y}" fill="${color}" font-size="${size}" ${extra}>${esc(s)}</text>`;
const mono = (x,y,s,size=13,color=C.muted,extra='') => txt(x,y,s,size,color,`font-family="Consolas, 'Liberation Mono', monospace" ${extra}`);
const base = (w,h,title,content) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(title)}" font-family="Arial,Helvetica,sans-serif">
<title>${esc(title)}</title>
<style>.heavy{font-weight:900;letter-spacing:-5px}.orbit{transform-box:fill-box;transform-origin:center;animation:orbit 32s linear infinite}.reverse{animation-direction:reverse;animation-duration:45s}.breathe{animation:breathe 4s ease-in-out infinite}.cursor{animation:cursor 1.3s steps(1) infinite}.flow{stroke-dasharray:6 12;animation:flow 4s linear infinite}.float{animation:float 7s ease-in-out infinite}@keyframes orbit{to{transform:rotate(360deg)}}@keyframes breathe{50%{opacity:.35}}@keyframes cursor{50%{opacity:0}}@keyframes flow{to{stroke-dashoffset:-72}}@keyframes float{50%{transform:translateY(-8px)}}@media(prefers-reduced-motion:reduce){.orbit,.breathe,.cursor,.flow,.float{animation:none!important}}</style>
${content}</svg>\n`;
const save = (name,w,h,title,body) => writeFile(`${assets}/${name}.svg`,base(w,h,title,body));
const panel=(w,h)=>`<rect x="1" y="1" width="${w-2}" height="${h-2}" rx="24" fill="${C.bg}" stroke="${C.line}"/>`;

let grid = '';
for(let x=690;x<1200;x+=40) grid+=`<path d="M${x} 88V450" stroke="${C.line}" opacity=".38"/>`;
for(let y=90;y<455;y+=40) grid+=`<path d="M680 ${y}H1180" stroke="${C.line}" opacity=".38"/>`;
await save('hero',1200,580,'Shivansh Vyas | Software with a pulse',`
<defs><radialGradient id="aura"><stop stop-color="#a899ff" stop-opacity=".15"/><stop offset="1" stop-color="#a899ff" stop-opacity="0"/></radialGradient><linearGradient id="ring"><stop stop-color="${C.lime}"/><stop offset=".5" stop-color="${C.violet}"/><stop offset="1" stop-color="${C.cyan}"/></linearGradient><clipPath id="clip"><rect x="1" y="1" width="1198" height="578" rx="24"/></clipPath></defs>
${panel(1200,580)}<g clip-path="url(#clip)">${grid}<circle cx="930" cy="280" r="265" fill="url(#aura)"/>
<path d="M40 72H1160" stroke="${C.line}"/>
${mono(42,44,'SV / SOFTWARE WITH A PULSE',14,C.lime)}${mono(1157,44,'WEB  /  MOBILE  /  FULL STACK',13,C.muted,'text-anchor="end"')}
${mono(46,128,'DEVELOPER. BUILDER. PERPETUALLY CURIOUS.',13,C.muted)}
${txt(40,230,'SHIVANSH',100,C.white,'class="heavy"')}
${txt(40,337,'VYAS',118,C.lime,'class="heavy"')}<rect class="cursor" x="367" y="319" width="57" height="12" fill="${C.lime}"/>
${txt(46,390,'Ideas into interfaces.',26,C.white,'font-weight="600"')}
${txt(46,426,'Interfaces into real things.',26,C.muted)}
<g transform="translate(934 273)">
<circle r="172" fill="none" stroke="${C.line}"/><circle r="159" fill="none" stroke="${C.violet}" opacity=".28" stroke-dasharray="2 10"/>
<g class="orbit"><circle r="142" fill="none" stroke="url(#ring)" stroke-width="2" stroke-dasharray="165 52 12 52"/><circle cy="-142" r="7" fill="${C.lime}"/></g>
<g class="orbit reverse"><ellipse rx="119" ry="49" fill="none" stroke="${C.violet}" stroke-width="1.4" transform="rotate(-35)"/><ellipse rx="119" ry="49" fill="none" stroke="${C.cyan}" stroke-width="1.4" transform="rotate(35)"/></g>
<path d="M-46-46 0-72 46-46v92L0 72-46 46Z" fill="${C.panel}" stroke="${C.lime}" stroke-width="2"/>
${txt(0,15,'SV',40,C.white,'font-weight="900" text-anchor="middle" letter-spacing="-3"')}
<path d="M-196 0h18m356 0h18M0-196v18m0 356v18" stroke="${C.muted}"/>
</g>
<rect x="792" y="438" width="284" height="32" rx="16" fill="${C.panel}" stroke="${C.line}"/><circle class="breathe" cx="812" cy="454" r="4" fill="${C.lime}"/>${mono(828,459,'ALWAYS BUILDING SOMETHING',12,C.lime)}
<path d="M40 492H1160" stroke="${C.line}"/>${mono(44,532,'~ / shivansh',16,C.violet)}${mono(220,532,'$ ship --web --mobile --full-stack',16,C.white)}<rect class="cursor" x="612" y="518" width="9" height="18" fill="${C.lime}"/>
${mono(1155,532,'IDEA → BUILD → ITERATE',12,C.muted,'text-anchor="end"')}</g>`);

for(const [slug,label,accent] of [['work','GITHUB',true],['linkedin','LINKEDIN',false],['email','LET’S TALK',false]]) {
  await save(`button-${slug}`,240,54,label,`<rect x="1" y="1" width="238" height="52" rx="12" fill="${accent?C.lime:C.panel}" stroke="${accent?C.lime:C.line}"/>${mono(22,33,label,14,accent?C.bg:C.white,'font-weight="700"')}${txt(213,34,'↗',22,accent?C.bg:C.lime,'text-anchor="middle"')}`);
}

for(const [slug,num,label,meta] of [['about','01','BEHIND THE PIXELS','A QUICK INTRO'],['arcade','02','THE SIDE QUEST','INSERT CURIOSITY'],['stack','03','THE TOOLKIT','TOOLS I REACH FOR'],['activity','04','PROOF OF LIFE','THE GITHUB SIGNAL']]) {
 await save(`heading-${slug}`,1200,72,label,`<rect x="0" y="0" width="1200" height="72" rx="12" fill="${C.bg}"/>${mono(22,43,num,15,C.lime)}${txt(65,44,label,22,C.white,'font-weight="800" letter-spacing="1"')}<path d="M415 36H931" stroke="${C.line}"/>${mono(1175,42,meta,12,C.muted,'text-anchor="end"')}`);
 await save(`heading-${slug}-mobile`,600,72,label,`<rect width="600" height="72" rx="12" fill="${C.bg}"/>${mono(22,45,num,20,C.lime)}${txt(70,45,label,26,C.white,'font-weight="800" letter-spacing="1"')}`);
}

const stackRows=[['INTERFACE',C.lime,['TypeScript','JavaScript','React','Next.js','Tailwind','Vite']],['MOBILE + DATA',C.violet,['React Native','Expo','Node.js','Express','MongoDB','Firebase']],['WORKFLOW',C.cyan,['Git','GitHub','Figma','ESLint','Vercel','Firestore']]];
let stack=panel(1200,304);
for(const [i,[label,color,items]] of stackRows.entries()){
 const y=36+i*91; stack+=mono(26,y+27,label,12,color);
 for(const [j,item] of items.entries()){const x=214+j*158;stack+=`<rect x="${x}" y="${y}" width="145" height="54" rx="12" fill="${C.panel}" stroke="${C.line}"/><circle cx="${x+14}" cy="${y+27}" r="3" fill="${color}"/>${txt(x+28,y+33,item,item==='React Native'?14:15,C.white,'font-weight="600"')}`;}
}
await save('stack',1200,304,'The toolkit',stack);
await save('footer',1200,254,'Have a wild idea? Let’s make it real.',`${panel(1200,254)}
<path d="M929 0 810 254m185-254L876 254m185-254L942 254m185-254L1008 254m185-254L1074 254" stroke="${C.line}"/>
${mono(34,42,'NEXT UP / YOUR IDEA',13,C.lime)}${txt(31,110,'HAVE A WILD IDEA?',49,C.white,'font-weight="900" letter-spacing="-2"')}${txt(31,169,'Let’s make it real.',45,C.lime,'font-weight="800" letter-spacing="-1"')}${mono(34,219,'shivanshvyas2207@gmail.com',16,C.muted)}
<circle cx="1061" cy="126" r="60" fill="${C.lime}"/><path d="M1039 148 1082 105m-43 0h43v43" stroke="${C.bg}" stroke-width="5" fill="none"/>`);
await save('hero-mobile',600,666,'Shivansh Vyas | Software with a pulse',`${panel(600,666)}
${mono(30,45,'SV / SOFTWARE WITH A PULSE',17,C.lime)}<path d="M30 70H570" stroke="${C.line}"/>
${mono(30,110,'WEB / MOBILE / FULL STACK',17,C.muted)}
${txt(24,198,'SHIVANSH',79,C.white,'class="heavy"')}${txt(24,291,'VYAS',103,C.lime,'class="heavy"')}<rect class="cursor" x="319" y="280" width="45" height="10" fill="${C.lime}"/>
${txt(30,346,'Ideas into interfaces.',27,C.white,'font-weight="600"')}${txt(30,384,'Interfaces into real things.',27,C.muted)}
<g transform="translate(450 490)"><g class="orbit"><circle r="79" fill="none" stroke="${C.violet}" stroke-width="2" stroke-dasharray="45 12"/><ellipse rx="80" ry="32" fill="none" stroke="${C.lime}" transform="rotate(-30)"/></g>${txt(0,12,'SV',34,C.white,'font-weight="800" text-anchor="middle"')}</g>
${mono(30,470,'DEVELOPER.',18,C.white)}${mono(30,502,'BUILDER.',18,C.white)}${mono(30,534,'PERPETUALLY CURIOUS.',18,C.lime)}
<path d="M30 587H570" stroke="${C.line}"/>${mono(30,630,'$ ship --web --mobile',21,C.white)}<rect class="cursor" x="302" y="612" width="11" height="23" fill="${C.lime}"/>`);
let mobileStack=panel(600,584);
for(const [i,[label,color,items]] of stackRows.entries()){
 const y=33+i*188;mobileStack+=mono(24,y,label,18,color);
 for(const [j,item] of items.entries()) {const x=24+(j%3)*188;const top=y+20+Math.floor(j/3)*64;mobileStack+=`<rect x="${x}" y="${top}" width="174" height="52" rx="10" fill="${C.panel}" stroke="${C.line}"/>${txt(x+14,top+33,item,19,C.white,'font-weight="600"')}`;}
}
await save('stack-mobile',600,584,'The toolkit',mobileStack);
await save('footer-mobile',600,300,'Have a wild idea? Let’s make it real.',`${panel(600,300)}${mono(28,42,'NEXT UP / YOUR IDEA',17,C.lime)}${txt(26,101,'HAVE A WILD IDEA?',37,C.white,'font-weight="900" letter-spacing="-1"')}${txt(26,153,'Let’s make it real.',38,C.lime,'font-weight="800"')}<path d="M28 185H572" stroke="${C.line}"/>${mono(28,226,'shivanshvyas2207@gmail.com',19,C.muted)}${txt(540,260,'↗',38,C.lime)}`);
const pixel=(rows,color,size=5)=>rows.map((row,y)=>[...row].map((v,x)=>v==='1'?`<rect x="${x*size}" y="${y*size}" width="${size}" height="${size}" fill="${color}"/>`:'').join('')).join('');
const ship=pixel(['00001000000000','00001110000000','11111111100000','01111111111000','11111111111111','01111111111000','11111111100000','00001110000000','00001000000000'],C.lime);
const bug=pixel(['01000010','00100100','01111110','11011011','11111111','10100101','10100101','00100100'],'#ff7a90');
async function arcade(mobile){
 const w=mobile?600:1200,h=mobile?604:446,top=mobile?174:126,bottom=h-74,sceneH=bottom-top;
 let stars='';
 for(let i=0;i<38;i++){const x=30+(i*127)%(w-60),y=top+15+(i*43)%(sceneH-30);stars+=`<rect x="${x}" y="${y}" width="${i%5===0?3:2}" height="2" fill="${i%5===0?C.violet:C.muted}" opacity="${i%3===0?.5:.2}"/>`;}
 let enemies='';
 for(let i=0;i<4;i++){const y=top+30+(i%3)*(sceneH-85)/3;enemies+=`<g transform="translate(${w-70} ${y})"><g class="enemy enemy-${i}">${bug}</g></g>`;}
 const left=mobile?66:120,sy=top+sceneH/2-22;
 await save(mobile?'arcade-mobile':'arcade',w,h,'README Arcade | Bugs incoming. Ship anyway.',`
 <defs><clipPath id="arena"><rect x="22" y="${top}" width="${w-44}" height="${sceneH}" rx="16"/></clipPath></defs>
 <style>.player{animation:dodge 6s ease-in-out infinite}.enemy{animation:invade 12s linear infinite}.enemy-0{animation-delay:-1s}.enemy-1{animation-delay:-8s}.enemy-2{animation-delay:-5s}.enemy-3{animation-delay:-10.5s}.bolt{animation:shoot 2.4s linear infinite}.bolt-2{animation-delay:-.8s}.bolt-3{animation-delay:-1.6s}@keyframes invade{from{transform:translateX(70px)}to{transform:translateX(-${w}px)}}@keyframes dodge{0%,100%{transform:translateY(0)}25%{transform:translateY(-42px)}75%{transform:translateY(42px)}}@keyframes shoot{from{transform:translateX(0);opacity:0}8%,88%{opacity:1}to{transform:translateX(${w-left}px);opacity:0}}@media(prefers-reduced-motion:reduce){.player,.enemy,.bolt{animation:none!important}}</style>
 ${panel(w,h)}${mono(28,35,'README ARCADE',mobile?16:13,C.cyan)}${mono(w-28,35,'AUTOPLAY / LOOP',mobile?14:12,C.muted,'text-anchor="end"')}
 ${mobile?`${txt(26,95,'BUGS INCOMING.',40,C.white,'font-weight="900" letter-spacing="-1"')}${txt(26,144,'SHIP ANYWAY.',40,C.lime,'font-weight="900" letter-spacing="-1"')}`:`${txt(28,92,'BUGS INCOMING.',42,C.white,'font-weight="900" letter-spacing="-1"')}${txt(470,92,'SHIP ANYWAY.',42,C.lime,'font-weight="900" letter-spacing="-1"')}`}
 <rect x="22" y="${top}" width="${w-44}" height="${sceneH}" rx="16" fill="${C.panel}" stroke="${C.line}"/>
 <g clip-path="url(#arena)">${stars}<path d="M22 ${top+sceneH/2}H${w-22}" stroke="${C.line}" stroke-dasharray="3 10"/>
 ${enemies}<g transform="translate(${left} ${sy})"><g class="player"><path class="breathe" d="M-8 12-34 22-8 33Z" fill="${C.violet}"/>${ship}
 <g transform="translate(75 20)"><rect class="bolt" width="19" height="4" rx="2" fill="${C.cyan}"/><rect class="bolt bolt-2" width="19" height="4" rx="2" fill="${C.cyan}"/><rect class="bolt bolt-3" width="19" height="4" rx="2" fill="${C.cyan}"/></g></g></g>
 ${mono(40,bottom-16,'PLAYER 01 / SHIVANSH',mobile?15:11,C.lime)}${mono(w-40,bottom-16,'[ STILL BUILDING ]',mobile?13:11,C.violet,'text-anchor="end"')}</g>
 ${mono(28,h-28,'$ keep_building()',mobile?20:16,C.white)}<rect class="cursor" x="${mobile?245:204}" y="${h-45}" width="10" height="20" fill="${C.lime}"/>${mono(w-28,h-28,mobile?'↓ PRESS START':'THE SIDE QUEST IS BELOW ↓',mobile?16:12,C.muted,'text-anchor="end"')}`);
}
await arcade(false);
await arcade(true);
console.log('Built the original SVG profile artwork, arcade, and mobile layouts.');
