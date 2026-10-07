import { execFileSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { generateSnakeAnimation } from 'generate-snake-animation';

const username = 'Shivansh2207';
// GitHub Actions provides GITHUB_TOKEN; locally, reuse the signed-in GitHub CLI.
// The credential stays in memory and is never written to an asset or log.
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || execFileSync('gh', ['auth', 'token'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const headers = { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'shivansh-profile' };
async function api(path, body) {
  const response = await fetch(`https://api.github.com${path}`, { headers, ...(body ? { method: 'POST', body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`GitHub ${path}: HTTP ${response.status}`);
  const json = await response.json();
  if (json.errors?.length) throw new Error(`GitHub GraphQL: ${json.errors.map(e => e.message).join('; ')}`);
  return json;
}
async function publicRepos() {
  const repos = [];
  for(let page=1;;page++) {
    const batch = await api(`/users/${username}/repos?per_page=100&type=owner&page=${page}`);
    repos.push(...batch.filter(repo => !repo.private));
    if(batch.length < 100) return repos;
  }
}
const [repos,graph] = await Promise.all([
  publicRepos(),
  api('/graphql', { query: `query { user(login: "${username}") { contributionsCollection { contributionCalendar { totalContributions weeks { contributionDays { date contributionCount } } } } } }` }),
]);
const calendar = graph.data?.user?.contributionsCollection?.contributionCalendar;
if(!calendar?.weeks?.length) throw new Error('GitHub returned no contribution calendar. Existing assets have been preserved.');
const esc = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const text = (x,y,value,size=15,color='#a1aaba',extra='') => `<text x="${x}" y="${y}" fill="${color}" font-size="${size}" ${extra}>${esc(value)}</text>`;
const mono = (x,y,value,size=12,color='#a1aaba',extra='') => text(x,y,value,size,color,`font-family="Consolas,monospace" ${extra}`);
const stamp = new Date().toISOString().slice(0,10);
const totals = calendar.weeks.map(w => w.contributionDays.reduce((sum,d) => sum+d.contributionCount,0));
const maximum = Math.max(1,...totals);
const barStep = 1120/totals.length;
let bars = '';
for(const [i,total] of totals.entries()) {
  const height = Math.max(3,(total/maximum)*112);
  const date = calendar.weeks[i].contributionDays[0].date;
  bars += `<rect x="${(40+i*barStep).toFixed(2)}" y="${(312-height).toFixed(2)}" width="${(barStep-5).toFixed(2)}" height="${height.toFixed(2)}" rx="3" fill="${total ? (i===totals.length-1?'#a899ff':'#c8ff62'):'#26303e'}"><title>Week of ${date}: ${total} contributions</title></rect>`;
}
const metrics = [
  [calendar.totalContributions,'CONTRIBUTIONS','LAST 12 MONTHS'],
  [repos.length,'PUBLIC REPOS','OWNED REPOSITORIES'],
  [calendar.weeks.flatMap(w=>w.contributionDays).filter(d=>d.contributionCount>0).length,'ACTIVE DAYS','LAST 12 MONTHS'],
  [Math.max(...totals),'BEST WEEK','CONTRIBUTIONS / WEEK'],
];
let numbers = '';
for(const [i,[value,label,note]] of metrics.entries()) {
  const x=40+i*290;
  numbers+=text(x,90,Number(value).toLocaleString('en-US'),52,i===0?'#c8ff62':'#f2f5ec','font-weight="800" letter-spacing="-2"')+mono(x,118,label,12,'#f2f5ec')+mono(x,140,note,10);
  if(i<3) numbers+=`<path d="M${x+252} 46v100" stroke="#26303e"/>`;
}
const signal = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="382" viewBox="0 0 1200 382" role="img" aria-label="GitHub activity snapshot for ${username}" font-family="Arial,Helvetica,sans-serif">
<title>GitHub activity snapshot — ${stamp}</title><desc>Contributions in GitHub's rolling twelve-month calendar, public owned repositories, active contribution days, and the highest weekly contribution count. Bars show contributions per week; edge weeks may be partial.</desc>
<rect x="1" y="1" width="1198" height="380" rx="24" fill="#090c12" stroke="#26303e"/>
${numbers}<path d="M40 167H1160" stroke="#26303e"/>
${mono(40,189,'WEEKLY CONTRIBUTION FREQUENCY',11)}${mono(1160,189,`PEAK WEEK / ${maximum===1 && !totals.some(Boolean)?0:Math.max(...totals)}`,11,'#a1aaba','text-anchor="end"')}
${bars}${mono(40,343,calendar.weeks[0].contributionDays[0].date,11)}${mono(1160,343,`SNAPSHOT ${stamp} UTC`,11,'#a1aaba','text-anchor="end"')}
</svg>\n`;

let mobileNumbers = '';
for(const [i,[value,label,note]] of metrics.entries()) {
  const x=28+(i%2)*295; const y=92+Math.floor(i/2)*145;
  mobileNumbers+=text(x,y,Number(value).toLocaleString('en-US'),55,i===0?'#c8ff62':'#f2f5ec','font-weight="800"')+mono(x,y+30,label,17,'#f2f5ec')+mono(x,y+54,note,12);
}
const signalMobile = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="510" viewBox="0 0 600 510" role="img" aria-label="GitHub activity snapshot for ${username}" font-family="Arial,Helvetica,sans-serif"><title>GitHub activity snapshot — ${stamp}</title><rect x="1" y="1" width="598" height="508" rx="24" fill="#090c12" stroke="#26303e"/>${mobileNumbers}<path d="M28 319H572" stroke="#26303e"/>${mono(28,350,'WEEKLY CONTRIBUTIONS',17)}<g transform="translate(9 255) scale(.485)">${bars}</g>${mono(28,474,`SNAPSHOT ${stamp} UTC`,17)}</svg>\n`;

const draw = (dark) => ({
  colorDots: dark ? {1:'#344728',2:'#627b38',3:'#96be48',4:'#c8ff62'} : {1:'#dcebbd',2:'#b4d978',3:'#7cad3a',4:'#527e1b'},
  colorEmpty: dark ? '#161e29' : '#e9edf2',
  colorDotBorder: dark ? '#26303e' : '#d3dae2',
  colorSnake: dark ? '#a899ff' : '#7354d2',
  sizeCell: 16, sizeDot: 12, sizeDotBorderRadius: 3,
});
const snakes = await generateSnakeAnimation(
  {platform:'github',username,githubToken:token},
  [false,true].map(dark=>({format:'svg',drawOptions:draw(dark),animationOptions:{stepDurationMs:100,frameByStep:1}})),
);
if(snakes.some(svg=>typeof svg!=='string' || !svg.includes('<svg'))) throw new Error('Snake generation failed. Existing assets have been preserved.');
// SVG animation remains visible without JS; stop motion for visitors requesting it.
const reducedMotion = '<style>@media(prefers-reduced-motion:reduce){*{animation:none!important}}</style>';
const files = [
  ['github-signal.svg',signal],
  ['github-signal-mobile.svg',signalMobile],
  ['contribution-snake.svg',snakes[0].replace('</svg>',`${reducedMotion}</svg>`)+'\n'],
  ['contribution-snake-dark.svg',snakes[1].replace('</svg>',`${reducedMotion}</svg>`)+'\n'],
];
const assets = fileURLToPath(new URL('../assets/',import.meta.url));
await mkdir(assets,{recursive:true});
await Promise.all(files.map(([name,content])=>writeFile(`${assets}/${name}`,content)));
console.log(`Refreshed ${username}: ${calendar.totalContributions} contributions, ${repos.length} public repos, and two snake themes. Snapshot ${stamp}.`);
