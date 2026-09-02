(function(){
  const API_BASE = (location.protocol === 'file:') ? 'http://localhost:3000' : '';
  const api = (url) => API_BASE + url;

  const read = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key) || fallback); }
    catch { return JSON.parse(fallback); }
  };
  const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));

  const classes = () => read('learnhubClasses', '[]');
  const liveClasses = () => read('learnhubLiveClasses', '[]');
  const materials = () => read('learnhubMaterials', '[]');
  const questions = () => read('learnhubQuestions', '[]');

  async function sync(){
    const r = await fetch(api('/api/content'), {cache:'no-store'});
    if(!r.ok) throw new Error('Backend unavailable');
    const d = await r.json();
    save('learnhubClasses', d.classes || []);
    save('learnhubLiveClasses', d.liveClasses || []);
    save('learnhubMaterials', d.materials || []);
    save('learnhubQuestions', d.questions || []);
    return d;
  }

  async function adminLogin(password){
    const r = await fetch(api('/api/admin/login'), {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({password})
    });
    if(!r.ok){
      let d={}; try { d=await r.json(); } catch {}
      throw new Error(d.error || 'Invalid admin password');
    }
    const d=await r.json();
    sessionStorage.setItem('learnhubAdminToken', d.token);
    return d;
  }

  const token = () => sessionStorage.getItem('learnhubAdminToken') || '';

  async function adminFetch(url, opts={}){
    opts.headers = Object.assign(
      {'Content-Type':'application/json','Authorization':'Bearer '+token()},
      opts.headers || {}
    );
    const r = await fetch(api(url), opts);
    if(!r.ok){
      let d={}; try { d=await r.json(); } catch {}
      throw new Error(d.error || 'Request failed');
    }
    return r.json();
  }

  async function addClass(x){
    const v=await adminFetch('/api/classes',{method:'POST',body:JSON.stringify(x)});
    await sync(); return v;
  }
  async function delClass(id){
    await adminFetch('/api/classes/'+id,{method:'DELETE'}); await sync();
  }
  async function addLiveClass(x){
    const v=await adminFetch('/api/liveclasses',{method:'POST',body:JSON.stringify(x)});
    await sync(); return v;
  }
  async function delLiveClass(id){
    await adminFetch('/api/liveclasses/'+id,{method:'DELETE'}); await sync();
  }
  async function addQuestion(x){
    const v=await adminFetch('/api/questions',{method:'POST',body:JSON.stringify(x)});
    await sync(); return v;
  }
  async function delQuestion(id){
    await adminFetch('/api/questions/'+id,{method:'DELETE'}); await sync();
  }
  async function addPdf(meta,file){
    if(file.size>12*1024*1024) throw new Error('PDF must be under 12 MB');
    const base64=await new Promise((resolve,reject)=>{
      const reader=new FileReader();
      reader.onload=()=>resolve(reader.result);
      reader.onerror=reject;
      reader.readAsDataURL(file);
    });
    const v=await adminFetch('/api/materials',{
      method:'POST',
      body:JSON.stringify({...meta,fileName:file.name,base64})
    });
    await sync(); return v;
  }
  async function delPdf(id){
    await adminFetch('/api/materials/'+id,{method:'DELETE'}); await sync();
  }
  function pdfUrl(id){ return api('/api/pdfs/'+encodeURIComponent(id)); }

  window.LearnHubContent={
    classes, liveClasses, materials, questions, save, sync, adminLogin,
    addClass, delClass, addLiveClass, delLiveClass, addQuestion, delQuestion, addPdf, delPdf, pdfUrl,
    getPdf:async id=>{
      const r=await fetch(pdfUrl(id));
      if(!r.ok) return null;
      return {blob:await r.blob(),name:(materials().find(x=>x.id===id)||{}).fileName||'study-material.pdf'};
    },
    putPdf:async()=>{}
  };

  sync().catch(()=>{});
})();
