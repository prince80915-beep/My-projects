(() => {
  const defaults = [
    {title:'Ember Roasted Vegetables', detail:'₹420'},
    {title:'Wild Mushroom Risotto', detail:'₹560'},
    {title:'Charred Paneer Steak', detail:'₹520'},
    {title:'Ember Chocolate Tart', detail:'₹320'}
  ];
  const get = key => { try { const v=JSON.parse(localStorage.getItem(key)||'[]'); return Array.isArray(v)?v:[]; } catch { return []; } };
  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  function render(){
    const menu=[...defaults,...get('restaurantMenu')];
    document.getElementById('menuGrid').innerHTML=menu.map(x=>{const d=String(x.detail||''); return `<article class="dish"><div><h3>${esc(x.title||x.name)}</h3><p>${esc(x.description||'Chef selected dish.')}</p></div><b>${esc(d)}</b></article>`}).join('');
    const offers=get('restaurantOffers');
    const area=document.getElementById('offersArea');
    area.innerHTML=offers.length?`<section class="section"><span class="eyebrow">SPECIAL OFFERS</span><h2>Today's offers.</h2><div class="menu">${offers.map(x=>`<article class="dish"><div><h3>${esc(x.title||x.name)}</h3><p>Special offer from the restaurant.</p></div><b>${esc(x.detail||'Offer')}</b></article>`).join('')}</div></section>`:'';
  }
  render();
  window.addEventListener('storage',e=>{if(e.key==='restaurantMenu'||e.key==='restaurantOffers')render()});
  setInterval(render,1500);
})();
