const authScreen=document.getElementById('authScreen'),app=document.getElementById('app');
const users=()=>JSON.parse(localStorage.getItem('learnhubUsers')||'[]');
const session=()=>JSON.parse(localStorage.getItem('learnhubSession')||'null');
const courses=[
{id:1,name:'Frontend Foundations',icon:'💻',tag:'WEB DEVELOPMENT',desc:'Build responsive pages with HTML, CSS and JavaScript.',meta:'12 lessons · Beginner',price:999},
{id:2,name:'JavaScript in Practice',icon:'⚡',tag:'JAVASCRIPT',desc:'DOM, events, LocalStorage and practical app logic.',meta:'18 lessons · Intermediate',price:1499},
{id:3,name:'UI Design Basics',icon:'🎨',tag:'DESIGN',desc:'Create clean interfaces, layouts and responsive components.',meta:'10 lessons · Beginner',price:799},
{id:4,name:'Web Project Builder',icon:'🧩',tag:'PROJECTS',desc:'Turn an idea into a multi-page working website.',meta:'14 lessons · Beginner',price:1299},
{id:5,name:'JavaScript APIs',icon:'🌐',tag:'API & DATA',desc:'Connect frontend apps to APIs with loading and error states.',meta:'15 lessons · Intermediate',price:1599},
{id:6,name:'Portfolio Mastery',icon:'🚀',tag:'CAREER',desc:'Present your original work with a professional portfolio.',meta:'8 lessons · Beginner',price:699}
];
const batches=[
{name:'Frontend Morning Batch',date:'Starts 10 Sep',time:'8:00 AM',mode:'Live + Recorded',price:1999},
{name:'JavaScript Evening Batch',date:'Starts 15 Sep',time:'7:00 PM',mode:'Live + Recorded',price:2499},
{name:'Weekend Web Builder',date:'Starts 20 Sep',time:'11:00 AM',mode:'Weekend',price:1799},
{name:'Career Project Batch',date:'Starts 28 Sep',time:'6:00 PM',mode:'Live Mentoring',price:2999}
];
const enrolled=()=>JSON.parse(localStorage.getItem('learnhubEnrollments')||'[]');
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)}
function showApp(){const s=session();if(!s){authScreen.classList.remove('hidden');app.classList.add('hidden');return}authScreen.classList.add('hidden');app.classList.remove('hidden');document.getElementById('userName').textContent=s.name;document.getElementById('profileBtn').textContent=s.name[0].toUpperCase();renderCourses();renderBatches();renderLearning()}
function renderCourses(){document.getElementById('statCourses').textContent=courses.length;document.getElementById('statBatches').textContent=batches.length;document.getElementById('courseGrid').innerHTML=courses.map(c=>`<article class="course"><div class="icon">${c.icon}</div><span class="tag">${c.tag}</span><h3>${c.name}</h3><p>${c.desc}</p><div class="meta"><span>${c.meta}</span><b>₹${c.price}</b></div><button onclick="enroll(${c.id})">Purchase & Enroll</button></article>`).join('')}
function renderBatches(){document.getElementById('batchGrid').innerHTML=batches.map((b,i)=>`<article class="batch"><span class="date">${b.date}</span><h3>${b.name}</h3><p>${b.mode} · ${b.time}</p><strong>₹${b.price}</strong><button onclick="joinBatch(${i})">View & Join Batch</button></article>`).join('')}
function renderLearning(){const list=enrolled();document.getElementById('statLearning').textContent=list.length;document.getElementById('enrolledCount').textContent=`${list.length} course${list.length===1?'':'s'}`;const box=document.getElementById('myLearning');if(!list.length){box.innerHTML='<div class="empty">You have not enrolled in a course yet. Explore the courses above to start learning.</div>';return}box.innerHTML=list.map((id,index)=>{const c=courses.find(x=>x.id===id);const progress=Math.min(25+index*17,82);return `<div class="learning-item"><div><strong>${c.name}</strong><small>${c.meta}</small><div class="progress"><i style="width:${progress}%"></i></div></div><span class="pill">${progress}% complete</span></div>`}).join('')}
window.enroll=function(id){const list=enrolled();if(!list.includes(id)){list.push(id);localStorage.setItem('learnhubEnrollments',JSON.stringify(list));toast('Course added to My Learning ✓');renderLearning()}else toast('Already enrolled in this course')};
window.joinBatch=function(i){toast(`${batches[i].name} selected — demo checkout ready`)};
window.practice=function(name){toast(`${name} opened — practice module ready`)};
document.querySelectorAll('.auth-tabs button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.auth-tabs button').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.getElementById('loginForm').classList.toggle('hidden',b.dataset.tab!=='login');document.getElementById('registerForm').classList.toggle('hidden',b.dataset.tab!=='register')});
document.getElementById('registerForm').onsubmit=e=>{e.preventDefault();const name=regName.value.trim(),email=regEmail.value.trim().toLowerCase(),password=regPassword.value;if(users().some(u=>u.email===email)){regMsg.textContent='Account already exists. Please login.';return}const list=users();list.push({name,email,password});localStorage.setItem('learnhubUsers',JSON.stringify(list));localStorage.setItem('learnhubSession',JSON.stringify({name,email}));showApp()};
document.getElementById('loginForm').onsubmit=e=>{e.preventDefault();const email=loginEmail.value.trim().toLowerCase(),password=loginPassword.value;const u=users().find(x=>x.email===email&&x.password===password);if(!u){loginMsg.textContent='Email or password is incorrect.';return}localStorage.setItem('learnhubSession',JSON.stringify({name:u.name,email:u.email}));showApp()};
document.getElementById('logout').onclick=()=>{localStorage.removeItem('learnhubSession');showApp()};
document.getElementById('profileBtn').onclick=()=>location.href='profile.html';
showApp();
