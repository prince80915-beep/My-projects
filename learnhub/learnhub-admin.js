const ADMIN_KEY='learnhubAdminToken';
const gate=document.getElementById('gate'),panel=document.getElementById('panel');
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
function logged(){return !!sessionStorage.getItem(ADMIN_KEY)}
async function openPanel(){gate.classList.add('hidden');panel.classList.remove('hidden');try{await LearnHubContent.sync()}catch(e){}renderAll()}
if(logged())openPanel();
document.getElementById('adminLogin').onsubmit=async e=>{
 e.preventDefault();
 const msg=document.getElementById('adminMsg');
 const password=document.getElementById('adminPassword').value;
 msg.textContent='Checking...';
 try{
   await LearnHubContent.adminLogin(password);
   msg.textContent='';
   openPanel();
 }catch(err){
   msg.textContent = (location.protocol==='file:')
     ? 'Server start karke dobara try karein. Password: admin123'
     : (err.message==='Invalid admin password' ? 'Incorrect admin password.' : 'Server connection error. Start LearnHub server first.');
 }
};
document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tabs button').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.getElementById(b.dataset.tab).classList.add('active')});
classForm.onsubmit=async e=>{e.preventDefault();try{await LearnHubContent.addClass({title:classTitle.value.trim(),subject:classSubject.value.trim(),teacher:classTeacher.value.trim(),batch:classBatch.value.trim(),video:classVideo.value.trim(),desc:classDesc.value.trim()});e.target.reset();renderClasses()}catch(err){alert(err.message)}};
liveForm.onsubmit=async e=>{e.preventDefault();try{if(liveEnd.value&&new Date(liveEnd.value)<=new Date(liveStart.value))throw new Error('End time must be after start time.');await LearnHubContent.addLiveClass({title:liveTitle.value.trim(),subject:liveSubject.value.trim(),teacher:liveTeacher.value.trim(),batch:liveBatch.value.trim(),start:liveStart.value,end:liveEnd.value,meetingUrl:liveUrl.value.trim(),desc:liveDesc.value.trim()});e.target.reset();renderLive()}catch(err){alert(err.message)}};
pdfForm.onsubmit=async e=>{e.preventDefault();const file=pdfFile.files[0];if(!file||file.type!=='application/pdf'){pdfMsg.textContent='Please select a PDF file.';return}try{await LearnHubContent.addPdf({title:pdfTitle.value.trim(),subject:pdfSubject.value.trim(),desc:pdfDesc.value.trim()},file);e.target.reset();pdfMsg.textContent='PDF added successfully.';renderPdfs()}catch(err){pdfMsg.textContent=err.message}};
quizForm.onsubmit=async e=>{e.preventDefault();try{await LearnHubContent.addQuestion({question:qText.value.trim(),options:[q0.value.trim(),q1.value.trim(),q2.value.trim(),q3.value.trim()],answer:Number(qAnswer.value),topic:qTopic.value.trim()||'General'});e.target.reset();renderQuiz()}catch(err){alert(err.message)}};
function renderClasses(){classList.innerHTML=LearnHubContent.classes().map(x=>`<div class="item"><div><span class="badge">${esc(x.subject)}</span><h3>${esc(x.title)}</h3><p>${esc(x.teacher||'Instructor')}${x.batch?' · '+esc(x.batch):''} · ${esc(x.desc||'')}</p></div><button onclick="removeClass(${x.id})">Delete</button></div>`).join('')||'<div class="item"><p>No classes added yet.</p></div>'}
function renderLive(){const now=Date.now();liveList.innerHTML=LearnHubContent.liveClasses().map(x=>{const st=new Date(x.start).getTime(),en=x.end?new Date(x.end).getTime():st+2*60*60*1000;const status=now>=st&&now<en?'LIVE NOW':now<st?'UPCOMING':'ENDED';return `<div class="item"><div><span class="badge">🔴 ${status}</span><h3>${esc(x.title)}</h3><p>${esc(x.subject)} · ${esc(x.teacher||'Instructor')}${x.batch?' · '+esc(x.batch):''}</p><small>${formatDateTime(x.start)}${x.end?' → '+formatDateTime(x.end):''} · ${esc(x.desc||'')}</small></div><div class="item-actions"><a class="mini-link" href="${safeUrl(x.meetingUrl)}" target="_blank" rel="noopener">Open link</a><button onclick="removeLive(${x.id})">Delete</button></div></div>`}).join('')||'<div class="item"><p>No live classes added yet.</p></div>'}
function formatDateTime(v){const d=new Date(v);return isNaN(d)?v:d.toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'short'})}
function safeUrl(v){try{const u=new URL(v,location.href);return /^https?:$/.test(u.protocol)?u.href:'#'}catch{return '#'}}

function renderPdfs(){pdfList.innerHTML=LearnHubContent.materials().map(x=>`<div class="item"><div><span class="badge">PDF · ${esc(x.subject)}</span><h3>${esc(x.title)}</h3><p>${esc(x.fileName)} · ${esc(x.desc||'')}</p></div><button onclick="removePdf(${x.id})">Delete</button></div>`).join('')||'<div class="item"><p>No PDFs added yet.</p></div>'}
function renderQuiz(){quizList.innerHTML=LearnHubContent.questions().map(x=>`<div class="item"><div><span class="badge">${esc(x.topic)}</span><h3>${esc(x.question)}</h3><p>A: ${esc(x.options[0])} · B: ${esc(x.options[1])} · C: ${esc(x.options[2])} · D: ${esc(x.options[3])}</p><small>Correct option: ${'ABCD'[x.answer]}</small></div><button onclick="removeQuestion(${x.id})">Delete</button></div>`).join('')||'<div class="item"><p>No questions added yet.</p></div>'}
async function removeClass(id){try{await LearnHubContent.delClass(id);renderClasses()}catch(e){alert(e.message)}}
async function removeLive(id){try{await LearnHubContent.delLiveClass(id);renderLive()}catch(e){alert(e.message)}}
async function removePdf(id){try{await LearnHubContent.delPdf(id);renderPdfs()}catch(e){alert(e.message)}}
async function removeQuestion(id){try{await LearnHubContent.delQuestion(id);renderQuiz()}catch(e){alert(e.message)}}
window.removeClass=removeClass;window.removeLive=removeLive;window.removePdf=removePdf;window.removeQuestion=removeQuestion;function renderAll(){renderClasses();renderLive();renderPdfs();renderQuiz()}
document.getElementById('exportData').onclick=()=>{const data={classes:LearnHubContent.classes(),materials:LearnHubContent.materials(),questions:LearnHubContent.questions()};const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='learnhub-content-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
document.getElementById('importData').onchange=()=>alert('For safety, import is disabled in the shared-backend version. Add content through the Admin panel.');
