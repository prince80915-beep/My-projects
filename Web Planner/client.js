
(function(){
"use strict";
function get(id){return document.getElementById(id)}
function submitRequest(){
 const data={
  clientName:get("clientName").value.trim(),businessName:get("businessName").value.trim(),
  mobile:get("mobile").value.trim(),email:get("email").value.trim(),
  projectType:get("projectType").value,pages:get("pages").value,
  mainColor:get("mainColor").value,backgroundColor:get("backgroundColor").value,
  design:get("design").value,budget:get("budget").value,reference:get("reference").value.trim(),
  message:get("message").value.trim(),features:[...document.querySelectorAll('.checkbox-grid input:checked')].map(x=>x.value),
  date:new Date().toLocaleString()
 };
 if(!data.clientName||!data.mobile||!data.email||!data.projectType){
   alert("Please fill Client Name, Mobile, Email and Project Type."); return;
 }
 if(!/^[0-9+\-\s]{8,15}$/.test(data.mobile)){alert("Please enter a valid mobile number.");return}
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)){alert("Please enter a valid email address.");return}
 let list=[];try{list=JSON.parse(localStorage.getItem("clientRequests")||"[]")}catch(e){list=[]}
 if(!Array.isArray(list))list=[];list.push(data);
 localStorage.setItem("clientRequests",JSON.stringify(list));
 const result=get("result");result.innerHTML='<div class="success-message"><h2>✅ Requirement Submitted!</h2><p>Thank you, <strong>'+escapeHtml(data.clientName)+'</strong>. Your requirement has been saved.</p><p>Opening Admin Panel...</p></div>';
 const btn=get("submitBtn");btn.disabled=true;btn.textContent="✅ Submitted";
 setTimeout(()=>location.href="index2.html",900);
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
window.submitRequest=submitRequest;
document.addEventListener("DOMContentLoaded",()=>{const b=get("submitBtn");if(b)b.addEventListener("click",submitRequest)})
})();
