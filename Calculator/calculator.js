
"use strict";
const display=document.getElementById("display"), historyBtn=document.getElementById("historyBtn");
let history=JSON.parse(localStorage.getItem("calculatorHistory")||"[]");
function add(v){
 if(v==="AC"){display.value="";return}
 if(v==="⌫"){display.value=display.value.slice(0,-1);return}
 if(v==="%"){if(display.value)display.value=String(Number(display.value)/100);return}
 if(v==="√"){if(display.value)display.value=String(Math.sqrt(Number(display.value)));return}
 if(v==="x²"){if(display.value)display.value=String(Number(display.value)**2);return}
 if(v==="1/x"){if(display.value)display.value=String(1/Number(display.value));return}
 if(v==="+/−"){if(display.value)display.value=String(Number(display.value)*-1);return}
 if(v==="="){calculate();return}
 if(v==="−")v="-"; if(v==="×")v="*"; if(v==="÷")v="/";
 display.value+=v;
}
function calculate(){
 if(!display.value)return;
 try{
  const expression=display.value;
  if(!/^[0-9+\-*/().\s]+$/.test(expression.replace(/×|÷/g,"")))throw Error();
  const result=Function('"use strict";return ('+expression.replace(/×/g,"*").replace(/÷/g,"/")+')')();
  if(!Number.isFinite(result))throw Error();
  history.push(expression+" = "+result);if(history.length>30)history.shift();localStorage.setItem("calculatorHistory",JSON.stringify(history));display.value=result;
 }catch(e){display.value="Error";setTimeout(()=>display.value="",800)}
}
document.querySelectorAll(".buttons button").forEach(b=>b.addEventListener("click",()=>add(b.textContent.trim())));
historyBtn.addEventListener("click",()=>alert(history.length?"Calculation History:\n\n"+history.join("\n"):"No History"));
