
"use strict";
let clients=[];
document.addEventListener("DOMContentLoaded",loadClients);
function readClients(){try{const x=JSON.parse(localStorage.getItem("clientRequests")||"[]");return Array.isArray(x)?x:[]}catch(e){return []}}
function esc(s){return String(s??"-").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function loadClients(){
 clients=readClients();
 const list=document.getElementById("clientList"),empty=document.getElementById("emptyMessage");
 document.getElementById("totalClients").textContent=clients.length;
 document.getElementById("websiteProjects").textContent=clients.filter(x=>x.projectType==="Website"||x.projectType==="Website + App").length;
 document.getElementById("appProjects").textContent=clients.filter(x=>x.projectType==="Mobile App"||x.projectType==="Website + App").length;
 document.getElementById("latestBudget").textContent=clients.length?(clients[clients.length-1].budget||"₹0"):"₹0";
 list.innerHTML="";
 if(!clients.length){empty.style.display="block";return} empty.style.display="none";
 clients.forEach((c,i)=>{
  const card=document.createElement("article");card.className="client-card";
  const features=(c.features||[]).map(x=>`<span class="feature-tag">${esc(x)}</span>`).join("")||"<span>-</span>";
  card.innerHTML=`<div class="client-card-header"><div><h2>👤 ${esc(c.clientName||"Client")} <small>#${i+1}</small></h2><small>${esc(c.date||"")}</small></div><button class="delete-btn" onclick="deleteClient(${i})">🗑️ Delete</button></div>
  <div class="detail-grid">
  ${row("Business",c.businessName)}${row("Mobile",c.mobile)}${row("Email",c.email)}${row("Project Type",c.projectType)}${row("Total Pages",c.pages)}${row("Design Style",c.design)}${row("Main Colour",c.mainColor)}${row("Background Colour",c.backgroundColor)}${row("Budget",c.budget)}${row("Reference Website",c.reference)}
  </div><div class="features-box"><strong>⚙️ Features</strong><div>${features}</div></div>
  <div class="detail-row message-row"><strong>📝 Requirement</strong><span>${esc(c.message||"-")}</span></div>`;
  list.appendChild(card);
 });
}
function row(label,value){return `<div class="detail-row"><strong>${esc(label)}</strong><span>${esc(value||"-")}</span></div>`}
function deleteClient(i){if(!confirm("Delete this client requirement?"))return;clients.splice(i,1);localStorage.setItem("clientRequests",JSON.stringify(clients));loadClients()}
function clearAll(){if(!clients.length){alert("No requirements to clear.");return}if(!confirm("Delete ALL client requirements?"))return;localStorage.removeItem("clientRequests");loadClients()}
function searchClients(){const q=(document.getElementById("searchInput").value||"").toLowerCase().trim();document.querySelectorAll(".client-card").forEach(c=>c.style.display=c.textContent.toLowerCase().includes(q)?"":"none")}
window.deleteClient=deleteClient;window.clearAll=clearAll;window.searchClients=searchClients;
window.addEventListener("storage",e=>{if(e.key==="clientRequests")loadClients()});
setInterval(()=>{if(JSON.stringify(clients)!==JSON.stringify(readClients()))loadClients()},1000);
