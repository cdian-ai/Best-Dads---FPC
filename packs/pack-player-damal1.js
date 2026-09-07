/* The deck player that drove Damal 1. Retired with it on 7 September 2026. */

/* ---------- Language pack player ----------
   Adds the Fulfulde course to Notice Me by ADDING ONLY. Nothing in index.html
   is edited except the two script tags that load this and the pack data.

   How it plugs in:
   - the course is pushed into CURRICULUM as a subject, so marking, the ladder,
     the tutor rules and the milestone bonus all work with no new code;
   - a set finished in the player calls markObjective(..., "covered") — the same
     call the Practised button makes, and the one a child is already allowed to make;
   - points therefore follow the app's existing rule: covered is worth nothing,
     and finishing a whole section raises the milestone a parent confirms.
     See NOTE_ON_POINTS at the foot of this file before changing that.
*/
(function(){
  if(!window.FULFULDE_M1) return;
  const PACK  = window.FULFULDE_M1;
  const AUDIO = window.FULFULDE_M1_AUDIO || {};
  const VIDEO = window.FULFULDE_M1_VIDEO || {};

  /* Pack text is authored, not typed by a family — but a future pack from
     Peeral could carry an ampersand or a quote, so it goes through the app's
     own escaper like everything else. */
  const esc = s => (typeof escapeHtml==="function") ? escapeHtml(s) : String(s);

  /* ---------- audio ---------- */
  const ASCII={bh:'ɓ',dh:'ɗ',yh:'ƴ',nh:'ŋ',ny:'ñ',q:'’'};
  function norm(n){
    let s=String(n).replace(/\.[a-z0-9]+$/i,'').trim().toLowerCase()
      .replace(/[_\-\s]+/g,'').replace(/\d+$/,'').replace(/['\u2018\u2019\u02bc`]/g,'’');
    if(s.endsWith('’')) s='’'+s.slice(0,-1);
    return s.replace(/mb|nd|ng|nj|bh|dh|yh|nh|ny/g,m=>ASCII[m]||m);
  }
  const SOUND=new Map();
  Object.keys(AUDIO).forEach(f=>SOUND.set(norm(f),AUDIO[f]));
  const has=f=>SOUND.has(norm(f));
  /* Local files win. Drive is the stop-gap until the mp3s ship with the app. */
  const SRC=[
    v => v.indexOf('/')>=0 ? v : 'audio/ff/ff-'+v+'.mp3',
    v => 'https://drive.usercontent.google.com/download?id='+v+'&export=download',
    v => 'https://drive.google.com/uc?export=download&id='+v
  ];
  const player=new Audio(); let tok=0;
  function speak(form, after){
    const v=SOUND.get(norm(form));
    if(!v){ after&&after(); return; }
    const mine=++tok; let k = v.indexOf('/')>=0 ? 0 : 1;
    (function go(){
      player.pause(); player.src=SRC[k](v); player.currentTime=0;
      player.onended=()=>{ if(mine===tok) after&&after(); };
      player.onerror=()=>{ if(mine===tok && ++k<SRC.length) go(); };
      player.play().catch(()=>{ if(mine===tok && ++k<SRC.length) go(); });
    })();
  }

  /* ---------- sets ----------
     A set is one level: five syllables of a row, or four of anything else.
     Small enough for a three-year-old to finish in one sitting. */
  /* ALL_SETS is built from every item in the pack, whether or not a clip exists
     yet. That fixes the objective ids for good: when the missing recordings
     land, sets become playable without a single id shifting under a mark
     already made. PLAYABLE is the subset the player can actually run today. */
  const ALL_SETS=[];
  PACK.sections.forEach(sec=>{
    if(!sec.items.length) return;
    if(sec.kind==='grid'){
      const rows={};
      sec.items.forEach(i=>(rows[i.r]=rows[i.r]||[]).push(i));
      Object.keys(rows).forEach(r=>ALL_SETS.push({
        sec:sec.id, secTitle:sec.title, secTitleEn:sec.title_en,
        name:r.startsWith('(')?'Vowels alone':r, items:rows[r]}));
    }else{
      for(let n=0;n<sec.items.length;n+=4)
        ALL_SETS.push({sec:sec.id, secTitle:sec.title, secTitleEn:sec.title_en,
          name:(n/4+1)+'', items:sec.items.slice(n,n+4)});
    }
  });
  const ready = s => s.items.every(i=>has(i.f));
  const SETS = ALL_SETS.filter(ready);

  /* ---------- as a curriculum subject ----------
     One strand per pack section, one objective per set. Gives us the ladder,
     covered/secure, tutor permissions and the milestone bonus for free. */
  const SECTION_IDS=[...new Set(ALL_SETS.map(s=>s.sec))];
  const SUBJECT={
    subject:"fulfulde", icon:"\u{1f4d7}", name:"Fulfulde \u2014 Janngu Fulfulde 1",
    strands: SECTION_IDS.map(sid=>{
      const mine=ALL_SETS.filter(s=>s.sec===sid);
      return {
        id:sid.replace(/\./g,'-'),
        name:mine[0].secTitle+" \u2014 "+mine[0].secTitleEn,
        blurb:"From "+PACK.title+" by "+PACK.author+" ("+PACK.publisher+").",
        milestone:"Finished "+mine[0].secTitle,
        objectives:mine.map(s=>[s.items.map(i=>i.f).join("  ")])
      };
    })
  };
  /* Kept as a subject object so marking, permissions and progress reads still
     work, but no longer pushed onto CURRICULUM. The course tracks itself; a
     ladder shadowing it was a second record of the same thing, and two records
     of one truth eventually disagree. */
  window.FULFULDE_SUBJECT = SUBJECT;
  try{
    if(typeof CURRICULUM!=="undefined"){
      const at=CURRICULUM.findIndex(x=>x.subject==="fulfulde");
      if(at>=0) CURRICULUM.splice(at,1);
    }
  }catch(e){}

  const objIdFor=set=>{
    const strand=SUBJECT.strands.find(st=>st.id===set.sec.replace(/\./g,'-'));
    const i=ALL_SETS.filter(s=>s.sec===set.sec).indexOf(set);
    return "fulfulde."+strand.id+"."+(i+1);
  };

  /* ---------- screen ---------- */
  /* Same template as the puzzle decks: white paper, the app's own ink, one
     accent. The dark green board came from the earlier Qaida prototype and made
     this the only screen in the app that went dark. */
  const CSS=`
  body.overlay-open .tabbar{display:none!important}
  #packScreen{position:fixed;inset:0;z-index:300;background:#f7f8fc;color:#243044;display:flex;
    flex-direction:column;font-family:inherit}
  #packScreen.hidden{display:none}
  .pk-top{display:flex;align-items:center;gap:12px;padding:16px 18px 4px;max-width:600px;width:100%;margin:0 auto}
  .pk-x{width:44px;height:44px;border-radius:14px;background:#eceef6;border:0;color:#5a6478;
    font-size:17px;cursor:pointer;flex:none}
  .pk-beads{display:flex;gap:7px;flex:1;justify-content:center;flex-wrap:wrap}
  .pk-bead{width:9px;height:9px;border-radius:99px;background:#dfe2ee;transition:.25s}
  .pk-bead.done{background:#5b63d8}
  .pk-bead.now{background:#243044;transform:scale(1.5)}
  .pk-task{text-align:center;font-size:14.5px;font-weight:600;color:#6a7086;padding:14px 24px 2px;min-height:24px}
  .pk-stage{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;
    gap:14px;padding:10px 20px 30px;min-height:0;width:100%;max-width:600px;margin:0 auto;overflow-y:auto}
  .pk-stage>*{flex:0 0 auto;margin-left:auto;margin-right:auto}
  .pk-bottom{padding:10px 20px calc(26px + env(safe-area-inset-bottom));max-width:600px;width:100%;margin:0 auto}
  .pk-next{width:100%;border:0;border-radius:18px;padding:17px;font-size:19px;font-weight:700;
    background:#5b63d8;color:#fff;cursor:pointer}
  .pk-next:disabled{background:#e7e9f3;color:#a8adc4}
  .pk-card{background:#fff;border:1px solid #e6e8f0;border-radius:28px;position:relative;
    display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;
    box-shadow:0 8px 24px rgba(36,48,68,.08);cursor:pointer;text-align:center;color:#243044;
    transition:transform .18s}
  .pk-card:active{transform:scale(.97)}
  .pk-hero{width:100%;max-width:330px;aspect-ratio:1/1.05;font-size:clamp(74px,25vw,124px);
    font-weight:800;letter-spacing:-.02em}
  .pk-pick{aspect-ratio:1/1;font-size:clamp(40px,13vw,64px);border-radius:24px;font-weight:800}
  .pk-say{animation:pkpop .45s cubic-bezier(.2,.9,.3,1.4)}
  @keyframes pkpop{0%{transform:scale(1)}40%{transform:scale(1.12)}100%{transform:scale(1)}}
  .pk-right{border-color:#8fd6a4;box-shadow:0 0 0 3px #cdefe2}
  .pk-wrong{opacity:.32}
  .pk-ear{position:absolute;bottom:14px;font-size:22px;opacity:.35}
  .pk-heard::after{content:'\\2605';position:absolute;top:14px;right:20px;font-size:20px;color:#e0b13c}
  .pk-g3{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;width:100%;max-width:360px}
  .pk-g2{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;width:100%;max-width:340px}
  .pk-vow{display:flex;gap:9px;margin-top:16px;justify-content:center}
  .pk-v{width:56px;height:56px;border-radius:18px;background:#eceef6;color:#5a6478;font-size:26px;
    font-weight:800;display:grid;place-items:center;cursor:pointer;transition:.18s}
  .pk-v.on{background:#5b63d8;color:#fff;transform:scale(1.1)}
  .pk-slots{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-bottom:18px}
  .pk-slot{min-width:78px;height:82px;border-radius:20px;border:3px dashed #d6d9ea;display:grid;
    place-items:center;font-size:30px;font-weight:800;color:#243044}
  .pk-slot.full{border-style:solid;border-color:#5b63d8}
  .pk-bank{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
  .pk-chip{padding:15px 19px;border-radius:18px;font-size:26px;font-weight:800;color:#fff;
    background:#5b63d8;box-shadow:0 5px 0 #464ead;cursor:pointer}
  .pk-chip.gone{opacity:.25;pointer-events:none}
  .pk-word{font-size:32px;font-weight:800;text-align:center;margin-top:14px;min-height:40px}
  .pk-menu{padding:8px 18px 40px;align-items:stretch;justify-content:flex-start}
  .pk-tile{display:flex;gap:13px;align-items:center;background:#fff;border:1px solid #e6e8f0;
    border-radius:18px;padding:14px;margin-bottom:9px;cursor:pointer;width:100%;
    box-shadow:0 2px 8px rgba(36,48,68,.05)}
  .pk-tile .pk-ic{width:46px;height:46px;border-radius:14px;flex:none;display:grid;place-items:center;
    font-size:19px;font-weight:800;background:#eceef6;color:#5b63d8}
  .pk-tile h3{font-size:16px;margin:0;font-weight:700}
  .pk-tile p{margin:2px 0 0;font-size:12px;color:#8a90a6;line-height:1.4}
  .pk-tile .go{color:#c4c8d8;font-size:19px;font-weight:800}
  .pk-vbox{background:#eceef6;border-radius:20px;aspect-ratio:16/9;display:grid;place-items:center;
    border:2px dashed #d6d9ea;margin-bottom:18px;font-size:34px;color:#8a90a6}
  .pk-vbox iframe{width:100%;height:100%;border:0;border-radius:20px}
  .pk-win{text-align:center;padding:18px}
  .pk-star{font-size:76px}
  .pk-sm{background:#fff;color:#5a6478;border:1px solid #e6e8f0;border-radius:16px;padding:15px;
    font-size:15.5px;font-weight:650;cursor:pointer;width:100%;margin-top:10px}
  @media (prefers-reduced-motion:reduce){#packScreen *{animation:none!important;transition:none!important}}
  `;
  const style=document.createElement('style'); style.textContent=CSS; document.head.appendChild(style);

  const el=document.createElement('div');
  el.id='packScreen'; el.className='hidden';
  el.innerHTML=`
    <div class="pk-top"><button class="pk-x ovx" id="pkQuit" aria-label="Back">\u2190</button>
      <div class="pk-beads" id="pkBeads"></div><div style="width:38px"></div></div>
    <div class="pk-task" id="pkTask"></div>
    <div class="pk-stage" id="pkStage"></div>
    <div class="pk-bottom"><button class="pk-next" id="pkNext" disabled>Next</button></div>`;
  document.body.appendChild(el);
  if(el.setAttribute){
    el.setAttribute("role","dialog");
  el.setAttribute("aria-modal","true");
  el.setAttribute("aria-label","Fulfulde practice");
  }

  /* Escape on a keyboard, and the Android back button, both close the overlay.
     Without the history entry, back leaves the app instead of leaving the
     activity, which on a phone feels like a crash.
     Guarded: this runs at load, and an add-on that throws here loses its card
     on the Learn screen — which has caught me out twice already. */
  try{
    /* This screen shows and hides with the "hidden" class, not "on" like the
       other two. Testing for "on" here meant Escape and the Android back button
       never fired, which is most of what "I am locked in" felt like. */
    const isOpen = () => !el.classList.contains("hidden");
    if(document.addEventListener) document.addEventListener("keydown", e=>{
      if(e.key==="Escape" && isOpen()) close();
    });
    if(window.addEventListener) window.addEventListener("popstate", ()=>{
      if(isOpen()) close(true);
    });
  }catch(e){ console.warn("overlay key/back wiring", e); }

  const COL=['#ff8c69','#4ec3b0','#7b8cf0','#f2a03d','#e56ba0'];
  const $=i=>document.getElementById(i);
  const shuffle=a=>a.map(x=>[Math.random(),x]).sort((p,q)=>p[0]-q[0]).map(p=>p[1]);
  const VOW=['a','e','i','o','u'];
  const PAIRS=[['b','ɓ'],['d','ɗ'],['y','ƴ'],['n','ŋ'],['n','ñ'],['ng','ŋ'],['mb','m']];

  let view='menu', act=null, set=null, step=0, heard=new Set(), st={};

  let prevOverflow="";
  function open(){ view='menu'; el.classList.remove('hidden');
    prevOverflow=document.body.style.overflow;
    document.body.style.overflow='hidden';
    document.body.classList.add('overlay-open');
    draw(); }
  function close(fromBack){ el.classList.add('hidden');
    document.body.style.overflow=prevOverflow||'';
    document.body.classList.remove('overlay-open');
                    if(typeof render==='function') render(); }
  window.openFulfulde=open;
  /* The course keeps its own record. This hands Learn a read-only view of it,
     so the topic list can live on the shelf beside maths and science instead
     of only inside a full-screen overlay that feels like leaving the app. */
  window.fulfuldeSections=function(member){
    const prog=(member && member.progress) || {};
    return SUBJECT.strands.map(st=>{
      const sets=ALL_SETS.filter(x=>x.sec.replace(/\./g,'-')===st.id);
      const ids=sets.map((x,i)=>"fulfulde."+st.id+"."+(i+1));
      return { id:st.id, name:st.name,
               total:sets.length,
               done:ids.filter(k=>prog[k]).length };
    });
  };
  window.openFulfuldeAt=function(sectionId){
    open();
    try{
      const st=SUBJECT.strands.find(x=>x.id===sectionId);
      if(st && typeof pickSection==="function") pickSection(sectionId);
    }catch(e){}
  };

  function child(){
    try{ return (typeof activeChild==='function' && activeChild())
              || (typeof sessionMember==='function' && sessionMember()) || null; }
    catch(e){ return null; }
  }
  function coveredIds(){
    const c=child(); const out=new Set();
    if(c && c.progress) Object.keys(c.progress).forEach(k=>{
      if(k.indexOf('fulfulde.')===0) out.add(k); });
    return out;
  }

  function draw(){
    $('pkTask').textContent=''; $('pkNext').classList.add('hidden');
    $('pkBeads').innerHTML='';
    const stage=$('pkStage'); stage.className='pk-stage pk-menu'; stage.innerHTML='';
    const done=coveredIds();
    let h=`<div style="font-size:22px;font-weight:800;margin:2px 0 2px">${esc(PACK.title)}</div>
           <div style="font-size:13px;color:#a8c8c5;margin-bottom:16px">${esc(PACK.subtitle)} \u00b7 ${esc(PACK.author)}</div>`;
    SECTION_IDS.forEach((sid,n)=>{
      const mine=ALL_SETS.filter(s=>s.sec===sid);
      const playable=mine.filter(ready);
      const fin=mine.filter(s=>done.has(objIdFor(s))).length;
      const off=!playable.length;
      h+=`<div class="pk-tile" data-sec="${sid}" style="${off?'opacity:.45':''}">
        <div class="pk-ic" style="background:${COL[n%5]}">${n+1}</div>
        <div style="flex:1"><h3>${esc(mine[0].secTitle)}</h3>
          <p>${esc(mine[0].secTitleEn)} \u00b7 ${off
            ? 'waiting on recordings'
            : playable.length+' of '+mine.length+' sets ready \u00b7 '+fin+' done'}</p></div>
        <div style="font-weight:800">${off?'':'\u203a'}</div></div>`;
    });
    stage.innerHTML=h;
    stage.querySelectorAll('.pk-tile').forEach(t=>{
      const any=ALL_SETS.filter(s=>s.sec===t.dataset.sec).some(ready);
      if(any) t.onclick=()=>video(t.dataset.sec);
    });
  }

  function video(sid){
    const mine=ALL_SETS.filter(s=>s.sec===sid).filter(ready);
    const stage=$('pkStage'); stage.className='pk-stage pk-menu';
    const v=VIDEO[sid];
    stage.innerHTML=`
      <div class="pk-vbox">${v?`<iframe src="${v}" allow="fullscreen" allowfullscreen></iframe>`:'\u25b6'}</div>
      <div style="font-size:21px;font-weight:800">${esc(mine[0].secTitle)}</div>
      <p style="color:#bcd6d3;font-size:14px;line-height:1.5;margin:6px 0 22px">
        ${v?'Watch, then have a go yourself.':'Video not linked yet \u2014 go straight to practice.'}</p>
      <button class="pk-next" id="pkGo" style="position:static">My turn! \u2192</button>
      <button class="pk-sm" id="pkBack" style="width:100%;margin-top:12px">Back</button>`;
    $('pkGo').onclick=()=>{
      const done=coveredIds();
      const next=mine.find(s=>!done.has(objIdFor(s))) || mine[0];
      begin(next, 0);
    };
    $('pkBack').onclick=draw;
  }

  /* activity order is a difficulty ladder, not a shuffle */
  const ORDER=['meet','find','swap','odd','build'];
  function begin(s, ai){
    set=s; act=ORDER[ai % ORDER.length]; step=0; heard=new Set(); st={ai:ai};
    if(act==='build' && !buildable().length) act='meet';
    $('pkNext').classList.remove('hidden');
    render_();
  }
  function buildable(){
    return [['ñale',['ña','le']],['koɗo',['ko','ɗo']],['galo',['ga','lo']],
            ['limu',['li','mu']],['nanu',['na','nu']],['beɗi',['be','ɗi']]]
           .filter(w=>w[1].every(has));
  }
  function beads(n,at){
    $('pkBeads').innerHTML=Array.from({length:n},(_,i)=>
      `<div class="pk-bead${i<at?' done':''}${i===at?' now':''}"></div>`).join('');
  }
  const LEN=()=>act==='build'?Math.min(4,buildable().length):set.items.length;

  function render_(){
    const stage=$('pkStage'); stage.className='pk-stage'; stage.innerHTML='';
    $('pkNext').disabled=true;
    $('pkNext').textContent = step===LEN()-1 ? 'Finish' : 'Next';
    beads(LEN(), step);
    ({meet:meet,find:find,swap:swapV,odd:odd,build:build})[act](stage);
  }

  function meet(stage){
    $('pkTask').textContent='Tap the card to hear it';
    const f=set.items[step].f;
    const c=document.createElement('div');
    c.className='pk-card pk-hero'; c.style.background=COL[step%5];
    c.innerHTML=f+'<div class="pk-ear">\u{1f442}</div>';
    c.onclick=()=>{ c.classList.remove('pk-say'); void c.offsetWidth; c.classList.add('pk-say','pk-heard');
      speak(f); $('pkTask').textContent='Now you say it!'; $('pkNext').disabled=false; };
    stage.appendChild(c);
  }
  function find(stage){
    const target=set.items[step].f;
    const opts=shuffle([target, ...shuffle(set.items.map(i=>i.f).filter(x=>x!==target)).slice(0,2)]);
    $('pkTask').textContent='Listen\u2026 then tap what you heard';
    const w=document.createElement('div'); w.className='pk-g3';
    opts.forEach((f,n)=>{
      const c=document.createElement('div');
      c.className='pk-card pk-pick'; c.style.background=COL[n%5]; c.textContent=f;
      c.onclick=()=>{
        if(f===target){ c.classList.add('pk-right'); speak(f);
          [...w.children].forEach(o=>{ if(o!==c) o.classList.add('pk-wrong'); });
          $('pkTask').textContent='Yes! '+f; $('pkNext').disabled=false;
        } else { c.classList.add('pk-wrong'); speak(target); }
      };
      w.appendChild(c);
    });
    stage.appendChild(w);
    const again=document.createElement('button');
    again.className='pk-sm'; again.style.marginTop='16px'; again.textContent='\u{1f50a} Again';
    again.onclick=()=>speak(target); stage.appendChild(again);
    setTimeout(()=>speak(target), 380);
  }
  function swapV(stage){
    const cons=set.items[step].r && set.items[step].r!=='(vowel alone)'
      ? set.items[step].r : set.items[step].f.slice(0,-1);
    const done=new Set();
    $('pkTask').textContent='Tap each vowel \u2014 hear how it changes';
    const box=document.createElement('div');
    const card=document.createElement('div');
    card.className='pk-card pk-hero'; card.style.cssText='background:'+COL[step%5]+';max-width:250px';
    card.textContent=cons+'a';
    const vs=document.createElement('div'); vs.className='pk-vow';
    VOW.forEach(v=>{
      const b=document.createElement('div'); b.className='pk-v'; b.textContent=v;
      b.onclick=()=>{
        vs.querySelectorAll('.pk-v').forEach(o=>o.classList.remove('on'));
        b.classList.add('on'); card.textContent=cons+v;
        card.classList.remove('pk-say'); void card.offsetWidth; card.classList.add('pk-say');
        speak(cons+v); done.add(v);
        if(done.size===VOW.length){ $('pkNext').disabled=false; $('pkTask').textContent='All five!'; }
      };
      vs.appendChild(b);
    });
    box.appendChild(card); box.appendChild(vs); stage.appendChild(box);
  }
  function odd(stage){
    const usable=PAIRS.filter(p=>VOW.some(v=>has(p[0]+v)&&has(p[1]+v)));
    const p=usable[step%usable.length];
    const v=shuffle(VOW.filter(v=>has(p[0]+v)&&has(p[1]+v)))[0];
    const same=p[0]+v, diff=p[1]+v;
    $('pkTask').textContent='Three are the same. Find the different one.';
    const cards=shuffle([diff,same,same,same]);
    const oddAt=cards.indexOf(diff);
    const w=document.createElement('div'); w.className='pk-g2';
    cards.forEach((f,n)=>{
      const c=document.createElement('div');
      c.className='pk-card pk-pick'; c.style.background=COL[step%5]; c.textContent=f;
      c.onclick=()=>{ speak(f);
        if(n===oddAt){ c.classList.add('pk-right');
          $('pkTask').textContent=diff+' is the odd one'; $('pkNext').disabled=false; }
        else c.classList.add('pk-wrong'); };
      w.appendChild(c);
    });
    stage.appendChild(w);
  }
  function build(stage){
    const list=buildable();
    const [word,parts]=list[step%list.length];
    $('pkTask').textContent='Tap the pieces in order';
    const slots=document.createElement('div'); slots.className='pk-slots';
    parts.forEach(()=>{ const s=document.createElement('div'); s.className='pk-slot'; slots.appendChild(s); });
    const bank=document.createElement('div'); bank.className='pk-bank';
    const out=document.createElement('div'); out.className='pk-word';
    let at=0;
    shuffle([...parts]).forEach(p=>{
      const chip=document.createElement('div'); chip.className='pk-chip';
      chip.style.background=COL[Math.floor(Math.random()*5)]; chip.textContent=p;
      chip.onclick=()=>{
        if(p!==parts[at]){ speak(p); return; }
        const s=slots.children[at]; s.textContent=p; s.classList.add('full');
        s.style.background=chip.style.background; chip.classList.add('gone');
        speak(p); at++;
        if(at===parts.length){ out.textContent=word; $('pkTask').textContent='You made a word!';
          $('pkNext').disabled=false; }
      };
      bank.appendChild(chip);
    });
    const box=document.createElement('div');
    box.appendChild(slots); box.appendChild(bank); box.appendChild(out);
    stage.appendChild(box);
  }

  /* Guarded: if the screen markup ever fails to mount, an unguarded handler
     here would throw and take the whole add-on down, including the Learn card. */
  const nextBtn=$('pkNext'), quitBtn=$('pkQuit');
  if(nextBtn) nextBtn.onclick=()=>{ step++; if(step<LEN()) render_(); else done_(); };
  if(quitBtn) quitBtn.onclick=close;

  async function done_(){
    const c=child();
    const objId=objIdFor(set);
    let saved=false;
    if(c && typeof markObjective==='function'){
      try{ saved = await markObjective(c.id, objId, "covered"); }catch(e){ console.warn('pack mark failed', e); }
    }
    const stage=$('pkStage'); stage.className='pk-stage pk-menu';
    $('pkBeads').innerHTML=''; $('pkTask').textContent=''; $('pkNext').classList.add('hidden');
    const mine=ALL_SETS.filter(s=>s.sec===set.sec).filter(ready);
    const i=mine.indexOf(set);
    const nextAct=(st.ai+1)%ORDER.length;
    stage.innerHTML=`<div class="pk-win">
      <div class="pk-star">\u2b50</div>
      <div style="font-size:26px;font-weight:800;margin:8px 0 4px">You did it!</div>
      <p style="color:#bcd6d3;margin:0 0 6px">${set.items.map(i=>i.f).join('  \u00b7  ')}</p>
      <p style="color:#8fb4b0;font-size:12.5px;margin:0 0 20px">
        ${saved?'Marked as practised on your Learn page.':'Practice saved when you\u2019re back online.'}</p>
      <button class="pk-next" id="pkMore" style="position:static">Another way \u2192</button>
      <button class="pk-sm" id="pkNextSet" style="width:100%;margin-top:10px">Next set</button>
      <button class="pk-sm" id="pkHome" style="width:100%;margin-top:10px;background:transparent">Finish</button>
    </div>`;
    $('pkMore').onclick=()=>begin(set, nextAct);
    $('pkNextSet').onclick=()=>begin(mine[(i+1)%mine.length], 0);
    $('pkHome').onclick=()=>{ draw(); };
  }

  /* ---------- the way in ----------
     Wraps learnScreenHTML rather than editing it, so an app update that changes
     that function does not silently drop the course. */
  /* Registers rather than wraps. The Learn screen decides where the doors go
     and puts them above the subject grid; the pack only says what its own
     door says. registerLearnExtra already restricts these to the child's own
     Learn tab, so the course cannot appear twice on a parent's Progress panel. */
  if(typeof registerLearnExtra==='function'){
    registerLearnExtra({ order:10, html(c){
      const done=coveredIds().size;
      return `<button type="button" class="docard lang" onclick="openFulfulde()">
        <span class="doglyph" aria-hidden="true">\u{1f4d7}</span>
        <span class="domain"><span class="doname">${esc(PACK.title)}</span>
          <span class="dosub">${SETS.length} of ${ALL_SETS.length} sets ready \u00b7 ${done} practised \u00b7 tap to start</span></span>
        <span class="dochev" aria-hidden="true">\u203a</span></button>`;
    }});
  }
})();

/* NOTE_ON_POINTS
   Notice Me's rule is that marking is worth nothing and only a finished strand
   pays (MILESTONE_BONUS, confirmed by a parent). The course follows it: a set
   finished marks "covered" — no points — and finishing a section raises the
   normal milestone prompt.

   If you want points per set instead, the loop to watch is a child replaying
   the same five cards for a payout. Award first completion only, and keep it
   far below MILESTONE_BONUS. The hook is done_() above, right after the
   markObjective call. */

