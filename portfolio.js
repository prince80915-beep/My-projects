const menuToggle=document.getElementById("menuToggle"),nav=document.getElementById("mainNav");
if(menuToggle)menuToggle.addEventListener("click",()=>nav.classList.toggle("open"));
document.querySelectorAll("#mainNav a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));