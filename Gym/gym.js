(() => {
  const defaultsPrograms = [
    {title:'Strength', detail:'Progressive training plans built around compound movements and measurable results.'},
    {title:'Conditioning', detail:'High-energy sessions designed to improve stamina, mobility and everyday performance.'},
    {title:'Personal Training', detail:'One-to-one coaching with a practical plan tailored to your goals.'}
  ];
  const defaultsPlans = [
    {title:'Starter', detail:'₹999 /month · Gym access · Basic workout plan · Locker access'},
    {title:'Pro', detail:'₹1,799 /month · Unlimited access · Trainer guidance · Progress tracking'},
    {title:'Elite', detail:'₹2,999 /month · Personal trainer · Custom plan · Nutrition guidance'}
  ];
  const get = key => { try { const v=JSON.parse(localStorage.getItem(key)||'[]'); return Array.isArray(v)?v:[]; } catch { return []; } };
  const esc = v => String(v ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  function render(){
    const programs=[...defaultsPrograms,...get('gymPrograms')];
    const plans=[...defaultsPlans,...get('gymPlans')];
    document.getElementById('programsGrid').innerHTML=programs.map((x,i)=>`<article class="card"><b>${String(i+1).padStart(2,'0')}</b><h3>${esc(x.title||x.name)}</h3><p>${esc(x.detail||x.description||'Training program')}</p></article>`).join('');
    document.getElementById('plansGrid').innerHTML=plans.map(x=>{const d=String(x.detail||''); const parts=d.split(' /month'); const price=parts[0]; const rest=parts.length>1?parts.slice(1).join(' /month'):d; return `<article class="plan"><h3>${esc(x.title||x.name)}</h3><div class="price">${esc(price)}${parts.length>1?'<span> /month</span>':''}</div><p style="color:#aab1bd;line-height:1.7">${esc(rest)}</p></article>`}).join('');
  }
  render();
  window.addEventListener('storage', e=>{if(e.key==='gymPrograms'||e.key==='gymPlans')render()});
  setInterval(render,1500);
})();
