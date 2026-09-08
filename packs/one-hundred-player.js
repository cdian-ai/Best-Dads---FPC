/* ---------- One Hundred: the door, and the ledger ----------
   Same arrangement as the Fulfulde course. Each of the two KS2 courses is a
   whole app served from cdian-ai.github.io; this file opens one in a frame,
   tells it which child is using it, listens for what it reports back, and
   writes those marks through markObjective like every other objective.

   Same origin, so the two can talk. The course keeps its own record, which
   means there is still only one record \u2014 a tracker that guessed at a course's
   progress would be a second version of the truth, and two versions
   eventually disagree. */
(function(){
  const P = window.ONE_HUNDRED;
  if(!P) return;

  const SUBJECTS = {};
  Object.keys(P).forEach(key=>{
    const pack=P[key];
    const subj = {
      subject: pack.subject, icon:"\u{1f4af}", name: pack.title,
      strands: pack.sections.map(sec=>({
        id: sec.id.replace(/\./g,'-'),
        name: sec.title,
        blurb: sec.blurb||"",
        milestone: "Finished "+sec.title,
        objectives: sec.items.map(it=>[it.f+(it.e?"  \u00b7  "+it.e:"")])
      }))
    };
    SUBJECTS[key]=subj;
    try{
      if(typeof CURRICULUM!=="undefined"){
        const at=CURRICULUM.findIndex(x=>x.subject===pack.subject);
        if(at>=0) CURRICULUM.splice(at,1);
      }
    }catch(e){}
  });
  window.ONE_HUNDRED_SUBJECTS = SUBJECTS;

  /* subtopic id in a course  ->  objective id in Notice Me */
  const OBJ={};
  Object.keys(P).forEach(key=>{
    OBJ[key]={};
    P[key].sections.forEach(sec=>{
      const sid=sec.id.replace(/\./g,'-');
      sec.items.forEach((it,i)=>{ OBJ[key][it.id]=P[key].subject+"."+sid+"."+(i+1); });
    });
  });

  function child(){
    try{
      if(typeof currentMember==="function"){ const m=currentMember(); if(m) return m; }
      if(typeof viewChildId!=="undefined" && typeof memberById==="function") return memberById(viewChildId);
    }catch(e){}
    return null;
  }
  function covered(key){
    const c=child(), out=new Set(), pre=P[key].subject+".";
    if(c&&c.progress) Object.keys(c.progress).forEach(k=>{ if(k.indexOf(pre)===0) out.add(k); });
    return out;
  }

  let marking=false;
  async function take(key, ids){
    if(marking) return; marking=true;
    try{
      const c=child(); if(!c||typeof markObjective!=="function") return;
      const have=covered(key);
      for(const s of ids){
        const obj=OBJ[key][s];
        if(!obj||have.has(obj)) continue;
        try{ await markObjective(c.id,obj,"covered"); }catch(e){ console.warn("mark failed",s,e); }
      }
      if(typeof render==="function") render();
    } finally { marking=false; }
  }
  window.addEventListener("message", function(ev){
    if(!ev||!ev.data||ev.data.app!=="one-hundred") return;
    if(ev.origin!==location.origin) return;
    const key=ev.data.course;
    if(!key||!P[key]) return;
    if(ev.data.type==="progress" && Array.isArray(ev.data.done)) take(key, ev.data.done);
  });

  const CSS=`
  .ohwrap{position:fixed;inset:0;z-index:9000;background:#EEF0FA;display:flex;flex-direction:column}
  .ohbar{display:flex;align-items:center;gap:10px;padding:10px 12px;background:#fff;
    border-bottom:1px solid #e4e7f2;flex:0 0 auto}
  .ohbar b{font-size:15px;color:#243044;flex:1 1 auto;text-align:left}
  .ohbar button{border:0;border-radius:12px;padding:9px 14px;font:inherit;font-weight:700;
    background:#eceefe;color:#2b2e73;cursor:pointer}
  .ohfr{flex:1 1 auto;width:100%;border:0;display:block}`;
  let el=null, prevOverflow="";
  function open(key){
    const pack=P[key]; if(!pack||el) return;
    if(!document.getElementById('ohcss')){
      const s=document.createElement('style'); s.id='ohcss'; s.textContent=CSS; document.head.appendChild(s);
    }
    el=document.createElement('div');
    el.className='ohwrap'; el.setAttribute('role','dialog'); el.setAttribute('aria-modal','true');
    el.innerHTML=`<div class="ohbar"><button type="button" id="ohClose">\u2039 Back</button>
      <b>${pack.title}</b></div>
      <iframe class="ohfr" id="ohFrame" src="${pack.app}" title="${pack.title}" allow="autoplay"></iframe>`;
    document.body.appendChild(el);
    prevOverflow=document.body.style.overflow;
    document.body.style.overflow='hidden'; document.body.classList.add('overlay-open');
    document.getElementById('ohClose').onclick=close;
    /* tell the course who is using it, so it does not ask */
    const f=document.getElementById('ohFrame');
    f.addEventListener('load',function(){
      try{
        const c=child();
        if(c&&c.name) f.contentWindow.postMessage({app:"one-hundred",type:"who",name:c.name},location.origin);
      }catch(e){}
    });
    try{ history.pushState({oh:1},''); }catch(e){}
    window.addEventListener('popstate',onPop);
    document.addEventListener('keydown',onKey);
  }
  function onKey(e){ if(e.key==='Escape') close(); }
  function onPop(){ if(el) close(true); }
  function close(fromPop){
    if(!el) return;
    window.removeEventListener('popstate',onPop);
    document.removeEventListener('keydown',onKey);
    el.remove(); el=null;
    document.body.style.overflow=prevOverflow||'';
    document.body.classList.remove('overlay-open');
    if(!fromPop){ try{ history.back(); }catch(e){} }
    if(typeof render==='function') render();
  }
  window.openOneHundred=open;

  window.oneHundredSections=function(member,key){
    const prog=(member&&member.progress)||{}, pack=P[key];
    return pack.sections.map(sec=>{
      const sid=sec.id.replace(/\./g,'-');
      const ids=sec.items.map((it,i)=>pack.subject+"."+sid+"."+(i+1));
      return {id:sid,name:sec.title,total:ids.length,done:ids.filter(k=>prog[k]).length};
    });
  };

  if(typeof registerLearnExtra==='function'){
    registerLearnExtra({ order:11, html(c){
      return Object.keys(P).map(key=>{
        const total=Object.keys(OBJ[key]).length, done=covered(key).size;
        return `<button type="button" class="docard lang" onclick="openOneHundred('${key}')">
          <span class="doglyph" aria-hidden="true">\u{1f4af}</span>
          <span class="domain"><span class="doname">${P[key].title}</span>
          <span class="dosub">${done} of ${total} subtopics</span></span></button>`;
      }).join("");
    }});
  }
})();
