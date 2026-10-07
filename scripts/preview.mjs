import { execFileSync } from 'node:child_process';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { resolve, extname, sep } from 'node:path';

const root = fileURLToPath(new URL('../',import.meta.url));
const md = await readFile(resolve(root,'README.md'),'utf8');
let rendered = execFileSync('gh',['api','markdown','--input','-'], {
  input:JSON.stringify({text:md,mode:'gfm',context:'Shivansh2207/Shivansh2207'}),encoding:'utf8',maxBuffer:5_000_000,
});
// Resolve the repository-local images against the preview server.
rendered = rendered.replace(/(src|srcset)="[^"\s]*?(assets\/[^"?]+\.svg)[^"]*"/g,'$1="/$2"');
const html=`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Shivansh / GitHub profile preview</title><style>
:root{color-scheme:dark;--bg:#0d1117;--panel:#0d1117;--border:#3d444d;--fg:#e6edf3;--link:#8bbcff}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif}body.light{color-scheme:light;--bg:#f6f8fa;--panel:#fff;--fg:#1f2328;--border:#d1d9e0;--link:#0969da}.toolbar{padding:16px;display:flex;gap:12px;justify-content:center;align-items:center;flex-wrap:wrap;font-size:13px}button{cursor:pointer;padding:7px 12px;border:1px solid var(--border);border-radius:8px;background:var(--panel);color:var(--fg)}main{max-width:900px;margin:0 auto 48px;padding:28px 32px;border:1px solid var(--border);border-radius:6px;background:var(--panel)}.file-label{font:12px monospace;color:#9198a1;padding-bottom:24px}a{color:var(--link);text-decoration:none}a:hover{text-decoration:underline}img{max-width:100%;height:auto;vertical-align:middle}p{margin:0 0 16px}picture{display:inline}pre{background:#161b22;color:#e6edf3;padding:20px;border-radius:8px;overflow:auto;font:13px/1.7 Consolas,monospace}summary{cursor:pointer;margin:18px 0}sub{font-size:12px}body.mobile main{max-width:390px;padding:16px}.note{text-align:center;font-size:12px;color:#9198a1} @media(max-width:600px){main{padding:16px;margin:0 8px 24px}.toolbar{font-size:12px}}
</style><div class="toolbar"><span>README / GitHub Markdown renderer</span><button onclick="document.body.classList.toggle('light')">Toggle light / dark</button><button onclick="document.body.classList.toggle('mobile')">Toggle narrow column</button></div><main><div class="file-label">Shivansh2207 / README.md</div>${rendered}</main><p class="note">Local layout approximation using GitHub-rendered HTML. Final appearance is verified on GitHub.</p></html>`;
await mkdir(resolve(root,'.preview'),{recursive:true});
await writeFile(resolve(root,'.preview/index.html'),html);
const types={'.svg':'image/svg+xml','.html':'text/html; charset=utf-8','.md':'text/plain; charset=utf-8'};
createServer(async(req,res)=>{
  const requested=decodeURIComponent(new URL(req.url,'http://127.0.0.1:4177').pathname);
  const target=requested==='/'?resolve(root,'.preview/index.html'):resolve(root,`.${requested}`);
  if(!target.startsWith(root.endsWith(sep)?root:root+sep) || (!requested.startsWith('/assets/') && requested!=='/' && requested!=='/docs/PROFILE.md')){res.writeHead(404).end();return;}
  try{const body=await readFile(target);res.writeHead(200,{'Content-Type':types[extname(target)]||'application/octet-stream','Cache-Control':'no-store'}).end(body);}
  catch{res.writeHead(404).end('Not found');}
}).listen(4177,'127.0.0.1',()=>console.log('Profile preview: http://127.0.0.1:4177'));
