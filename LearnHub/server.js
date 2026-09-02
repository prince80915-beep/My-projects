const http=require('http');
const fs=require('fs');
const path=require('path');
const crypto=require('crypto');
const root=__dirname, dataDir=path.join(root,'data'), uploadDir=path.join(root,'uploads');
fs.mkdirSync(dataDir,{recursive:true}); fs.mkdirSync(uploadDir,{recursive:true});
const files={classes:path.join(dataDir,'classes.json'),materials:path.join(dataDir,'materials.json'),questions:path.join(dataDir,'questions.json'),liveclasses:path.join(dataDir,'liveclasses.json'),users:path.join(dataDir,'users.json')};
for(const f of Object.values(files)) if(!fs.existsSync(f)) fs.writeFileSync(f,'[]');
const ADMIN_PASSWORD=process.env.LEARNHUB_ADMIN_PASSWORD||'admin123';
const tokens=new Set();
function read(k){try{return JSON.parse(fs.readFileSync(files[k],'utf8'))}catch{return []}}
function write(k,v){fs.writeFileSync(files[k],JSON.stringify(v,null,2))}
function json(res,status,obj){const body=JSON.stringify(obj);res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Access-Control-Allow-Origin':'*'});res.end(body)}
function auth(req){const h=req.headers.authorization||'';return h.startsWith('Bearer ')&&tokens.has(h.slice(7))}
function body(req){return new Promise((resolve,reject)=>{let b=[];let n=0;req.on('data',c=>{n+=c.length;if(n>25*1024*1024){req.destroy();reject(new Error('Payload too large'))}else b.push(c)});req.on('end',()=>{try{resolve(JSON.parse(Buffer.concat(b).toString('utf8')||'{}'))}catch(e){reject(e)}});req.on('error',reject)})}
function safeName(s){return String(s||'file.pdf').replace(/[^a-zA-Z0-9._-]/g,'_')}
function sendFile(res,file){fs.stat(file,(e,st)=>{if(e){res.writeHead(404);return res.end('Not found')}res.writeHead(200,{'Content-Type':mime(file),'Cache-Control':'no-cache'});fs.createReadStream(file).pipe(res)})}
function mime(f){const e=path.extname(f).toLowerCase();return {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.pdf':'application/pdf','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml'}[e]||'application/octet-stream'}
const server=http.createServer(async(req,res)=>{
  try{
    if(req.method==='OPTIONS'){res.writeHead(204,{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Content-Type, Authorization','Access-Control-Allow-Methods':'GET,POST,DELETE,OPTIONS'});return res.end()}
    const u=new URL(req.url,'http://localhost');
    if(u.pathname==='/api/admin/login'&&req.method==='POST'){const d=await body(req);if(d.password!==ADMIN_PASSWORD)return json(res,401,{error:'Invalid admin password'});const t=crypto.randomBytes(24).toString('hex');tokens.add(t);return json(res,200,{token:t})}
    if(u.pathname==='/api/content'&&req.method==='GET') return json(res,200,{classes:read('classes'),liveClasses:read('liveclasses'),materials:read('materials'),questions:read('questions')});
    if(u.pathname==='/api/classes'&&req.method==='POST'){if(!auth(req))return json(res,401,{error:'Unauthorized'});const d=await body(req);const a=read('classes');const x={id:Date.now(),title:d.title||'',subject:d.subject||'',teacher:d.teacher||'',batch:d.batch||'',video:d.video||'',desc:d.desc||'',date:new Date().toLocaleDateString('en-IN')};a.push(x);write('classes',a);return json(res,201,x)}
    if(u.pathname.startsWith('/api/classes/')&&req.method==='DELETE'){if(!auth(req))return json(res,401,{error:'Unauthorized'});const id=Number(u.pathname.split('/').pop());write('classes',read('classes').filter(x=>x.id!==id));return json(res,200,{ok:true})}
    if(u.pathname==='/api/liveclasses'&&req.method==='POST'){if(!auth(req))return json(res,401,{error:'Unauthorized'});const d=await body(req);if(!d.title||!d.start||!d.meetingUrl)return json(res,400,{error:'Title, start time and live class link are required'});if(!/^https?:\/\//i.test(String(d.meetingUrl)))return json(res,400,{error:'Live class link must start with http:// or https://'});const a=read('liveclasses');const x={id:Date.now(),title:String(d.title).trim(),subject:String(d.subject||'').trim(),teacher:String(d.teacher||'').trim(),batch:String(d.batch||'').trim(),start:String(d.start),end:String(d.end||''),meetingUrl:String(d.meetingUrl).trim(),desc:String(d.desc||'').trim(),createdAt:new Date().toISOString()};a.push(x);a.sort((m,n)=>String(m.start).localeCompare(String(n.start)));write('liveclasses',a);return json(res,201,x)}
    if(u.pathname.startsWith('/api/liveclasses/')&&req.method==='DELETE'){if(!auth(req))return json(res,401,{error:'Unauthorized'});const id=Number(u.pathname.split('/').pop());write('liveclasses',read('liveclasses').filter(x=>x.id!==id));return json(res,200,{ok:true})}
    if(u.pathname==='/api/questions'&&req.method==='POST'){if(!auth(req))return json(res,401,{error:'Unauthorized'});const d=await body(req);const a=read('questions');const x={id:Date.now(),question:d.question||'',options:Array.isArray(d.options)?d.options.slice(0,4):[],answer:Number(d.answer)||0,topic:d.topic||'General'};a.push(x);write('questions',a);return json(res,201,x)}
    if(u.pathname.startsWith('/api/questions/')&&req.method==='DELETE'){if(!auth(req))return json(res,401,{error:'Unauthorized'});const id=Number(u.pathname.split('/').pop());write('questions',read('questions').filter(x=>x.id!==id));return json(res,200,{ok:true})}
    if(u.pathname==='/api/materials'&&req.method==='POST'){if(!auth(req))return json(res,401,{error:'Unauthorized'});const d=await body(req);if(!d.base64)return json(res,400,{error:'PDF data missing'});const id=Date.now();const name=safeName(d.fileName||'study-material.pdf');const stored=`${id}-${name}`;const raw=String(d.base64).replace(/^data:application\/pdf;base64,/,'');const buf=Buffer.from(raw,'base64');if(buf.length>12*1024*1024)return json(res,413,{error:'PDF must be under 12 MB'});fs.writeFileSync(path.join(uploadDir,stored),buf);const a=read('materials');const x={id,title:d.title||name,subject:d.subject||'General',desc:d.desc||'',fileName:name,date:new Date().toLocaleDateString('en-IN'),url:`/api/pdfs/${id}`};a.push(x);write('materials',a);return json(res,201,x)}
    if(u.pathname.startsWith('/api/materials/')&&req.method==='DELETE'){if(!auth(req))return json(res,401,{error:'Unauthorized'});const id=Number(u.pathname.split('/').pop());const a=read('materials');const x=a.find(m=>m.id===id);if(x){const prefix=id+'-';for(const f of fs.readdirSync(uploadDir))if(f.startsWith(prefix))fs.rmSync(path.join(uploadDir,f),{force:true})}write('materials',a.filter(m=>m.id!==id));return json(res,200,{ok:true})}
    if(u.pathname.startsWith('/api/pdfs/')&&req.method==='GET'){const id=Number(u.pathname.split('/').pop());const x=read('materials').find(m=>m.id===id);if(!x)return json(res,404,{error:'PDF not found'});const f=fs.readdirSync(uploadDir).find(n=>n.startsWith(id+'-'));if(!f)return json(res,404,{error:'PDF file missing'});return sendFile(res,path.join(uploadDir,f))}
    // Static files. API remains protected; frontend files can be opened normally.
    let p=decodeURIComponent(u.pathname); if(p==='/'||p==='')p='/coaching.html'; const rel=p.replace(/^\/+/, ''); const file=path.resolve(root, rel); if(file!==root && !file.startsWith(root+path.sep))return res.writeHead(403).end(); sendFile(res,file);
  }catch(e){console.error(e);json(res,400,{error:e.message||'Request failed'})}
});
const PORT=process.env.PORT||3000;server.listen(PORT,()=>console.log(`LearnHub running at http://localhost:${PORT}`));
