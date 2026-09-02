function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
function get(key,def=[]){try{let x=JSON.parse(localStorage.getItem(key));return x??def}catch{return def}}
function set(key,v){localStorage.setItem(key,JSON.stringify(v))}
function renderList(key,id){const el=document.getElementById(id);if(!el)return;const a=get(key,[]);el.innerHTML=a.length?a.map((x,i)=>`<div class="item"><div><b>${esc(x.title||x.name||('Item '+(i+1)))}</b><div class="muted">${esc(x.detail||x.description||'Saved item')}</div></div><button onclick="removeItem('${key}',${i})">Delete</button></div>`).join(''):'<div class="muted">No items yet.</div>'}
function removeItem(key,i){const a=get(key,[]);a.splice(i,1);set(key,a);location.reload()}
function addItem(key,titleId,detailId){const t=document.getElementById(titleId)?.value.trim();const d=document.getElementById(detailId)?.value.trim();if(!t)return alert('Title required');const a=get(key,[]);a.push({title:t,detail:d});set(key,a);location.reload()}
function stat(key,id){const e=document.getElementById(id);if(e)e.textContent=get(key,[]).length}
