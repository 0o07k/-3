/* app.js - منطق القاموس والواجهة (يعتمد على data.js) */
const cats=["الكل",...new Set(W.map(w=>w[3]))];
let cur="الكل";
const $=id=>document.getElementById(id);
const ALPHA=[
["A","إيه","ay","Apple","تفاحة","🍎"],["B","بي","bee","Ball","كرة","⚽"],["C","سي","see","Cat","قطة","🐱"],
["D","دي","dee","Dog","كلب","🐶"],["E","إي","ee","Elephant","فيل","🐘"],["F","إف","eff","Fish","سمكة","🐟"],
["G","جي","jee","Grapes","عنب","🍇"],["H","إتش","aitch","House","بيت","🏠"],["I","آي","eye","Ice cream","آيس كريم","🍦"],
["J","جاي","jay","Juice","عصير","🧃"],["K","كاي","kay","Key","مفتاح","🔑"],["L","إل","ell","Lion","أسد","🦁"],
["M","إم","em","Moon","قمر","🌙"],["N","إن","en","Nose","أنف","👃"],["O","أو","oh","Orange","برتقالة","🍊"],
["P","بي","pee","Pizza","بيتزا","🍕"],["Q","كيو","cue","Queen","ملكة","👸"],["R","آر","are","Rabbit","أرنب","🐰"],
["S","إس","ess","Sun","شمس","☀️"],["T","تي","tee","Tree","شجرة","🌳"],["U","يو","you","Umbrella","مظلة","☂️"],
["V","في","vee","Violin","كمان","🎻"],["W","دبليو","double you","Watermelon","بطيخ","🍉"],["X","إكس","ex","X-ray","أشعة سينية","🩻"],
["Y","واي","why","Yacht","يخت","🛥️"],["Z","زد","zee","Zebra","حمار وحشي","🦓"]
];
function renderAlpha(){
  $("count").textContent=ALPHA.length+" حرفاً";
  $("list").innerHTML=ALPHA.map(a=>`
    <div class="card al">
      <div class="big">${a[0]}${a[0].toLowerCase()}</div>
      <div class="nm">${a[1]}</div>
      <div class="emo">${a[5]}</div>
      <div class="en"><b>${a[0]}</b>${a[3].slice(1)}</div>
      <div class="ar">${a[4]}</div>
      <div class="btns">
        <button data-say="${a[2]}">🔊 الحرف</button>
        <button data-en="${a[3]}">🔊 الكلمة</button>
      </div>
    </div>`).join("");
}
function speak(text,lang){
  try{
    if(!("speechSynthesis" in window)){alert("النطق غير مدعوم في هذا المتصفح");return;}
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text);
    u.lang=lang;u.rate=0.85;
    speechSynthesis.speak(u);
  }catch(e){}
}
function renderCats(){
$("cats").innerHTML=cats.map(c=>`<button class="${c===cur?'on':''}" data-c="${c}">${c} · ${CATEN[c]||c}</button>`).join("");
}
function render(){
  $("list").className=mode==="alpha"?"alg":"";if(mode==="match"){renderMatch();return;}if(mode==="alpha"){renderAlpha2();return;}
  if(mode==="type"){$("count").textContent="";renderQuiz();return;}
  const q=$("q").value.trim().toLowerCase();
  const items=W.filter(w=>(cur==="الكل"||w[3]===cur)&&(!q||w[0].includes(q)||w[1].includes(q)));
  $("count").textContent=items.length+" كلمة";
  $("list").innerHTML=items.length?items.map(w=>`
    <div class="card">
      <div class="emo">${w[2]}</div>
      <div class="en">${w[0]}</div>
      
      <div class="btns">
        <button data-en="${w[0]}">🔊 EN</button>
        <button data-mic="${w[0]}">🎤 انطق</button>
      </div>
    </div>`).join(""):'<div class="empty">لا توجد نتائج</div>';
}
$("cats").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;cur=b.dataset.c;renderCats();render();});
$("q").addEventListener("input",render);
$("list").addEventListener("click",e=>{
  const b=e.target.closest("button");if(!b)return;
  if(b.dataset.en)speak(b.dataset.en,"en-US");
  if(b.dataset.ar)speak(b.dataset.ar,"ar-SA");
  if(b.dataset.say)speak(b.dataset.say,"en-US");
});
let mode="view",target=null,ok=0,tot=0;
function newQ(){
  const pool=W.filter(w=>cur==="الكل"||w[3]===cur);
  target=pool[Math.floor(Math.random()*pool.length)];
}
function checkAnsOld(){
  const v=($("ans").value||"").trim().toLowerCase();
  if(!v)return;
  tot++;
  const good=v===target[0].toLowerCase();
  if(good)ok++;
  $("fb").innerHTML=good?'<div style="color:#16a34a;margin-top:10px">✅ صحيح!</div>':'<div style="color:#dc2626;margin-top:10px">❌ الإجابة الصحيحة: <b>'+target[0]+'</b></div>';
  $("score").textContent="النتيجة: "+ok+" / "+tot;updPg();
}
function renderQuizOld(){
  if(!target||(cur!=="الكل"&&target[3]!==cur))newQ();
  $("list").innerHTML='<div class="card quiz"><div class="emo">'+target[2]+'</div><div class="en" style="font-size:22px">'+target[0]+'</div><input id="ans" placeholder="اكتب الكلمة بالإنجليزية" autocomplete="off" autocapitalize="off" spellcheck="false"><div class="btns"><button id="chk">تحقق</button><button id="nxt">التالي</button><button id="spk">🔊 استماع</button><button id="mic">🎤 انطق</button></div><div id="fb"></div><div class="count" id="score">النتيجة: '+ok+' / '+tot+'</div></div>';
  $("ans").focus();
}
function setMode(m){
  mode=m;
  $("modeBtn").textContent=mode==="type"?"📖 عرض الكلمات":"✍️ تدريب الكتابة";
  $("alphaBtn").textContent=mode==="alpha"?"📖 عرض الكلمات":"🔤 الحروف الإنجليزية";$("matchBtn").textContent=mode==="match"?"📖 عرض الكلمات":"🧩 تطابق الكلمات";
  target=null;ok=0;tot=0;
  const v=mode==="view";
  $("q").style.display=v?"":"none";
  $("cats").style.display=v?"":"none";
  render();
}
$("modeBtn").addEventListener("click",()=>setMode(mode==="type"?"view":"type"));
$("alphaBtn").addEventListener("click",()=>setMode(mode==="alpha"?"view":"alpha"));
$("list").addEventListener("click",e=>{
  if(e.target.id==="chk")checkAns();
  if(e.target.id==="nxt"){newQ();renderQuiz();}
  if(e.target.id==="spk")speak(target[0],"en-US");
});
$("list").addEventListener("keydown",e=>{if(e.target.id==="ans"&&e.key==="Enter")checkAns();});
renderCats();render();
let choice="";
(function(){const f=$("ff"),r=Math.random;for(let i=0;i<32;i++){const e=document.createElement("i"),z=3+r()*4;e.className="ff";e.style.cssText=`left:${r()*100}%;top:${r()*100}%;width:${z}px;height:${z}px;--dx:${(r()-.5)*160}px;--dy:${(r()-.5)*200}px;--t:${6+r()*9}s;animation-delay:-${r()*10}s`;f.appendChild(e);}})();
function openApp(m){navSet(m==="type"?"practice":"home");const l=$("land");l.classList.add("out");$("app").classList.remove("hide");setMode(m||"view");setTimeout(()=>{l.style.display="none"},550);}
$("land").addEventListener("click",e=>{const o=e.target.closest(".opt");if(!o)return;choice=o.dataset.m;document.querySelectorAll(".opt").forEach(x=>x.classList.toggle("sel",x===o));openApp(choice);});


const TH=["navy","white","black"];let ti=0;
try{ti=Math.max(0,TH.indexOf(localStorage.getItem("dictTheme")))}catch(e){}
function setTheme(i){ti=i;document.documentElement.dataset.t=TH[i];document.querySelectorAll(".thm").forEach(b=>b.textContent="💡 اللون");try{localStorage.setItem("dictTheme",TH[i])}catch(e){}}
document.querySelectorAll(".thm").forEach(b=>b.addEventListener("click",()=>setTheme((ti+1)%TH.length)));setTheme(ti);
$("lamp").addEventListener("click",()=>{const l=$("lamp");l.classList.remove("fl");void l.getBoundingClientRect();l.classList.add("fl");setTheme((ti+1)%TH.length);});
function listen(){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition,fb=$("fb");
  if(!SR){fb.innerHTML='<div style="color:#f59e0b;margin-top:10px">المتصفح لا يدعم التعرف على الصوت. جرّب Chrome</div>';return;}
  if(lock)return;
  const r=new SR(),n=s=>s.toLowerCase().replace(/[^a-z0-9 ]/g,"").replace(/\s+/g," ").trim();
  r.lang="en-US";r.maxAlternatives=5;r.interimResults=false;
  $("mic").classList.add("rec");
  r.onresult=e=>{
    const alts=[...e.results[0]].map(a=>n(a.transcript)),t=n(target[0]);
    const hit=alts.some(a=>a===t||a===n("a "+t)||a===n("an "+t)||a===n("the "+t));
    $("ans").value=hit?target[0]:(e.results[0][0].transcript||"");
    checkAns();
  };
  r.onerror=e=>{fb.innerHTML='<div style="color:#f59e0b;margin-top:10px">'+(e.error==="not-allowed"||e.error==="service-not-allowed"?"اسمح للمتصفح باستخدام الميكروفون":"لم أسمعك، حاول مرة أخرى")+'</div>';};
  r.onend=()=>{const m=$("mic");if(m)m.classList.remove("rec");};
  try{r.start();}catch(err){}
}
$("list").addEventListener("click",e=>{if(e.target.id==="mic")listen();});
function listenCard(b){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){alert("المتصفح لا يدعم التعرف على الصوت. جرّب Chrome");return;}
  const n=s=>s.toLowerCase().replace(/[^a-z0-9 ]/g,"").replace(/\s+/g," ").trim(),t=n(b.dataset.mic),r=new SR();
  r.lang="en-US";r.maxAlternatives=5;r.interimResults=false;
  const done=x=>{b.textContent=x;setTimeout(()=>{b.textContent="🎤 انطق"},2200);};
  b.textContent="🎙️ تكلّم...";
  r.onresult=e=>{const hit=[...e.results[0]].some(a=>{const s=n(a.transcript);return s===t||s===n("a "+t)||s===n("an "+t)||s===n("the "+t);});done(hit?"✅ صحيح":"❌ أعد المحاولة");};
  r.onerror=e=>done(e.error==="not-allowed"||e.error==="service-not-allowed"?"اسمح بالميكروفون":"لم أسمعك");
  try{r.start();}catch(err){}
}
$("list").addEventListener("click",e=>{const b=e.target.closest("button");if(b&&b.dataset.mic)listenCard(b);});
let mt={lvl:0,score:0,sel:null,done:0,sec:0,wrong:0,pairs:[],iv:null,busy:false};
function mtPick(n){const pool=W.filter(w=>!/[ -]/.test(w[0])&&w[0].length<=9&&w[2]),out=[],seen=new Set();let g=0;
  while(out.length<n&&g++<3000){const w=pool[Math.floor(Math.random()*pool.length)];if(seen.has(w[2])||out.some(o=>o[0].toLowerCase()===w[0].toLowerCase()))continue;seen.add(w[2]);out.push(w);}
  return out;}
function renderMatch(){
  clearInterval(mt.iv);
  mt.pairs=mtPick(Math.min(4+mt.lvl,8));mt.done=0;mt.sec=0;mt.wrong=0;mt.sel=null;mt.busy=false;
  const t=[];mt.pairs.forEach((w,i)=>{t.push({i,k:"p",t:w[2]});t.push({i,k:"w",t:w[0]});});
  for(let a=t.length-1;a>0;a--){const b=Math.floor(Math.random()*(a+1));[t[a],t[b]]=[t[b],t[a]];}
  $("count").textContent="";
  $("list").innerHTML=`<div class="mt"><div class="mtH"><span>المستوى <b>${mt.lvl+1}</b></span><span>⏱ <b id="mtT">0:00</b></span><span>⭐ <b id="mtS">${mt.score}</b></span></div><div class="mtB" id="mtB" style="grid-template-columns:repeat(${t.length>8?4:3},1fr)">${t.map((x,n)=>`<button class="mtile ${x.k}" data-i="${x.i}" data-k="${x.k}" style="animation-delay:${n*60}ms">${x.k==="p"?`<span class="mte">${x.t}</span>`:x.t}</button>`).join("")}</div><div class="mtF"><button class="go" id="mtN">🔄 إعادة اللعبة</button></div></div>`;
  mt.iv=setInterval(()=>{if(mode!=="match"||!$("mtT")){clearInterval(mt.iv);return;}mt.sec++;$("mtT").textContent=Math.floor(mt.sec/60)+":"+String(mt.sec%60).padStart(2,"0");},1000);
}
function mtWin(){
  clearInterval(mt.iv);const bonus=Math.max(0,40-mt.sec);mt.score+=bonus;let best=0;
  try{best=Math.max(+localStorage.getItem("dictMatchBest")||0,mt.score);localStorage.setItem("dictMatchBest",best);}catch(e){best=mt.score;}
  mt.lvl=mt.wrong<=2?Math.min(mt.lvl+1,4):(mt.wrong>5?Math.max(mt.lvl-1,0):mt.lvl);
  $("mtB").innerHTML=`<div class="mtW"><div style="font-size:60px">🎉</div><h3>أحسنت!</h3><p>الوقت ${Math.floor(mt.sec/60)}:${String(mt.sec%60).padStart(2,"0")} · الأخطاء ${mt.wrong} · مكافأة السرعة +${bonus}</p><p>⭐ ${mt.score} &nbsp; 🏆 ${best}</p><button class="go" id="mtNext">المستوى التالي ←</button></div>`;
}
$("matchBtn").addEventListener("click",()=>setMode(mode==="match"?"view":"match"));
$("list").addEventListener("click",e=>{
  if(mode!=="match")return;
  if(e.target.closest("#mtN")){mt.score=0;mt.lvl=0;renderMatch();return;}
  if(e.target.closest("#mtNext")){renderMatch();return;}
  const b=e.target.closest(".mtile");if(!b||b.disabled||mt.busy)return;
  if(!mt.sel){mt.sel=b;b.classList.add("sel");return;}
  if(mt.sel===b){b.classList.remove("sel");mt.sel=null;return;}
  const a=mt.sel;mt.sel=null;mt.busy=true;a.classList.remove("sel");
  if(a.dataset.i===b.dataset.i&&a.dataset.k!==b.dataset.k){
    a.classList.add("ok");b.classList.add("ok");a.disabled=true;b.disabled=true;
    mt.score+=10;mt.done++;$("mtS").textContent=mt.score;speak(mt.pairs[+a.dataset.i][0],"en-US");
    setTimeout(()=>{a.classList.add("gone");b.classList.add("gone");mt.busy=false;if(mt.done===mt.pairs.length)mtWin();},600);
  }else{
    a.classList.add("bad");b.classList.add("bad");mt.wrong++;mt.score=Math.max(0,mt.score-2);$("mtS").textContent=mt.score;
    setTimeout(()=>{a.classList.remove("bad");b.classList.remove("bad");mt.busy=false;},550);
  }
});
const ICO={chk:'<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#3a2300" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg>',spk:'<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#3a2300" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/><path d="M19 6a8.5 8.5 0 0 1 0 12"/></svg>',nxt:'<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#3a2300" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15M13 6l6 6-6 6"/></svg>',mic:'<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#3a2300" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>'};
function updPg(){const n=Math.min(tot,10),b=$("pgi");if(b){b.style.width=n*10+"%";$("pgt").textContent="التقدم: "+n+" / 10";}}
function renderQuiz(){
  if(!target||(cur!=="الكل"&&target[3]!==cur))newQ();
  if(tot>=10){$("list").innerHTML=`<div class="qz"><div class="qf"><div class="qi" style="text-align:center"><div class="qe" style="font-size:80px">🏆</div><h2 class="qw" style="font-size:30px">أحسنت!</h2><p>أجبت صح على ${ok} من 10</p><button class="go" id="nr">جولة جديدة</button></div></div></div>`;return;}
  const w=target[0],n=Math.min(tot,10),mask=w.split("").map((c,i)=>(c===" "||i===0||i===w.length-1)?c:"_").join(" ");
  $("list").innerHTML=`<div class="qz"><h2 class="qw">${w}</h2><div class="qa">${target[1]}</div><div class="qf"><div class="qi">
  <div class="qp"><div class="qe">${target[2]}</div><div class="ped"></div></div>
  <input id="ans" placeholder="اكتب الكلمة بالإنجليزية" autocomplete="off" autocapitalize="off" spellcheck="false">
  <div class="cbs"><div class="cbw"><button class="cb" id="mic">${ICO.mic}</button><span>انطق</span></div><div class="cbw"><button class="cb" id="nxt">${ICO.nxt}</button><span>التالي</span></div><div class="cbw"><button class="cb" id="spk">${ICO.spk}</button><span>استماع</span></div><div class="cbw"><button class="cb" id="chk">${ICO.chk}</button><span>تحقق</span></div></div>
  <div id="fb"></div>
  <div class="pg"><i id="pgi" style="width:${n*10}%"></i><b id="pgt">التقدم: ${n} / 10</b></div>
  <div class="hn"><div class="hs">📜</div><div><b class="ht">تلميحات</b><div class="hw">${mask}</div><small>تبدأ بحرف ${w[0].toUpperCase()} · ${w.replace(/ /g,"").length} حروف · ${(((typeof window!=="undefined"&&window.CATEN)||(typeof CATEN!=="undefined"&&CATEN)||{})[target[3]])||target[3]}</small></div></div>
  <div class="qfoot">🔓 تعلّم مع كل كلمة</div><div id="score" class="sc">النتيجة: ${ok} / ${tot}</div></div></div></div>`;
  const a=$("ans");if(a)a.focus();
}
$("list").addEventListener("click",e=>{if(e.target.id==="nr"){ok=0;tot=0;newQ();renderQuiz();}});
const GOAL=20,DW=[["serendipity","/ˌser.ənˈdɪp.ə.ti/","اكتشاف غير متوقع سعيد"],["resilience","/rɪˈzɪl.i.əns/","المرونة والقدرة على التعافي"],["ephemeral","/ɪˈfem.ər.əl/","زائل، قصير الأمد"],["eloquent","/ˈel.ə.kwənt/","بليغ، فصيح"],["curiosity","/ˌkjʊr.iˈɑː.sə.ti/","فضول"],["wanderlust","/ˈwɑːn.dɚ.lʌst/","شغف السفر"],["luminous","/ˈluː.mə.nəs/","مضيء، متألق"],["tranquil","/ˈtræŋ.kwɪl/","هادئ، ساكن"],["courage","/ˈkɝː.ɪdʒ/","شجاعة"],["gratitude","/ˈɡræt.ə.tuːd/","امتنان"],["harmony","/ˈhɑːr.mə.ni/","انسجام"],["radiant","/ˈreɪ.di.ənt/","مشرق، متألق"],["perseverance","/ˌpɝː.səˈvɪr.əns/","المثابرة"],["horizon","/həˈraɪ.zən/","أفق"],["melody","/ˈmel.ə.di/","لحن"],["whisper","/ˈwɪs.pɚ/","همس"],["journey","/ˈdʒɝː.ni/","رحلة"],["ambition","/æmˈbɪʃ.ən/","طموح"],["sincere","/sɪnˈsɪr/","صادق"],["adventure","/ədˈven.tʃɚ/","مغامرة"]];
function getStats(){try{return JSON.parse(localStorage.getItem("dictStats")||"{}")}catch(e){return{}}}
function today(){return new Date().toISOString().slice(0,10)}
function bump(){const s=getStats(),d=today();if(s.d!==d){const y=new Date(Date.now()-864e5).toISOString().slice(0,10);s.streak=s.d===y?(s.streak||0)+1:1;s.d=d;s.n=0;}s.n=(s.n||0)+1;s.total=(s.total||0)+1;try{localStorage.setItem("dictStats",JSON.stringify(s))}catch(e){}refreshHome();}
function refreshHome(){const s=getStats(),n=s.d===today()?(s.n||0):0;$("dayN").textContent=n;$("arcP").setAttribute("stroke-dasharray",(Math.min(n,GOAL)/GOAL*132)+" 132");}
function navSet(k){document.querySelectorAll("#nav [data-n]").forEach(b=>b.classList.toggle("on",b.dataset.n===k));}
function setHi(){let n="";try{n=localStorage.getItem("dictName")||""}catch(e){}$("hi").textContent=n?"أهلاً "+n+" 👋":"";}
function showSheet(k){
  const s=getStats(),n=s.d===today()?(s.n||0):0,b=$("sbody");
  if(k==="stats")b.innerHTML=`<h3>📊 إحصائياتي</h3><div class="r"><span>كلمات اليوم</span><b>${n} / ${GOAL}</b></div><div class="r"><span>إجمالي الإجابات الصحيحة</span><b>${s.total||0}</b></div><div class="r"><span>أيام متتالية</span><b>${s.streak||0}</b></div><div class="r"><span>كلمات القاموس</span><b>${W.length}</b></div>`;
  else{let nm="";try{nm=localStorage.getItem("dictName")||""}catch(e){}b.innerHTML=`<h3>👤 الملف الشخصي</h3><input id="pn" placeholder="اسمك" value="${nm.replace(/"/g,"")}"><button class="go" id="pnS">حفظ</button><button class="thm" style="margin-top:12px" id="pnT">💡 تغيير اللون</button>`;}
  $("sheet").classList.remove("hide");
}
$("land").addEventListener("click",e=>{
  const f=e.target.closest("[data-d]");if(f){speak($("dwW").textContent,f.dataset.d);return;}
  const g=e.target.closest("[data-go]");if(!g)return;
  if(g.dataset.go==="stats")showSheet("stats");else openApp(g.dataset.go);
});
$("nav").addEventListener("click",e=>{const b=e.target.closest("[data-n]");if(!b)return;const k=b.dataset.n;if(k==="home")$("home").click();else if(k==="practice")openApp("type");else{navSet(k);showSheet(k);}});
$("sheet").addEventListener("click",e=>{
  const id=e.target.id;
  if(id==="sx"||e.target===$("sheet")){$("sheet").classList.add("hide");navSet($("land").style.display==="none"?"home":"home");}
  if(id==="pnS"){try{localStorage.setItem("dictName",$("pn").value.trim())}catch(x){}setHi();$("sheet").classList.add("hide");navSet("home");}
  if(id==="pnT")setTheme((ti+1)%TH.length);
});
$("hLamp").addEventListener("click",()=>setTheme((ti+1)%TH.length));
$("hSearch").addEventListener("click",()=>{openApp("view");setTimeout(()=>$("q").focus(),600);});
$("hShare").addEventListener("click",()=>{const u=location.href;if(navigator.share){navigator.share({title:"قاموس مصوّر",url:u}).catch(()=>{});}else if(navigator.clipboard){navigator.clipboard.writeText(u).then(()=>alert("تم نسخ الرابط")).catch(()=>{});}});
(function(){const d=DW[Math.floor(Date.now()/864e5)%DW.length];$("dwW").textContent=d[0][0].toUpperCase()+d[0].slice(1);$("dwI").textContent=d[1];$("dwA").textContent=d[2];$("wc").textContent=W.length+" كلمة مصورة";refreshHome();setHi();})();
let pl=0;
function altW(L,main){const o=[];for(const w of W){if(w[0].length<=9&&!/ /.test(w[0])&&w[0][0].toUpperCase()===L&&w[0].toLowerCase()!==main.toLowerCase()&&!o.some(x=>x[0]===w[0])){o.push(w);if(o.length===2)break;}}return o;}
function renderAlpha2(){
  $("count").textContent=ALPHA.length+" حرفاً";
  const pad=`<div class="card pc"><h4>Practice Mode</h4><p>تدرب على كتابة حرفك الأول</p><div class="cv"><canvas id="cv" width="320" height="130"></canvas><span id="cvh">Draw ${ALPHA[pl][0]} ✏️</span></div><div class="btns"><button id="pcPrev">◀</button><button id="pcClr">🧽 مسح</button><button id="pcNext">▶</button></div></div>`;
  $("list").innerHTML=pad+ALPHA.map(a=>{
    const L=a[0],ex=altW(L,a[3]);
    return `<div class="card ac"><div class="acTop"><b class="aa">${L}${L.toLowerCase()}</b><span class="flg"><button data-sp="${a[3]}|en-US">🇺🇸</button><button data-sp="${a[3]}|en-GB">🇬🇧</button><button data-say="${a[2]}">🔈</button></span></div>
<div class="acMid"><div class="tr"><i>${L}</i><i>${L.toLowerCase()}</i></div><div class="cn"><div class="emo">${a[5]}</div><div class="w">${a[3]}</div><div class="ar">${a[4]}</div></div><div class="ex">${ex.map(w=>`<div><span>${w[2]}</span><small>${w[0]}</small></div>`).join("")}</div></div>
<div class="btns"><button data-say="${a[2]}">🔊 الحرف</button><button class="hl" data-en="${a[3]}">🔊 الكلمة</button></div></div>`;}).join("");
  const c=$("cv"),x=c.getContext("2d");x.lineWidth=7;x.lineCap="round";x.lineJoin="round";x.strokeStyle="#0b1730";let d=false;
  const p=e=>{const r=c.getBoundingClientRect();return [(e.clientX-r.left)*c.width/r.width,(e.clientY-r.top)*c.height/r.height];};
  c.onpointerdown=e=>{d=true;c.setPointerCapture(e.pointerId);const q=p(e);x.beginPath();x.moveTo(q[0],q[1]);$("cvh").style.opacity=0;};
  c.onpointermove=e=>{if(!d)return;const q=p(e);x.lineTo(q[0],q[1]);x.stroke();};
  c.onpointerup=()=>{d=false;};
}
$("list").addEventListener("click",e=>{
  const sp=e.target.closest("[data-sp]");if(sp){const q=sp.dataset.sp.split("|");speak(q[0],q[1]);return;}
  const id=e.target.id;
  if(id==="pcClr"||id==="pcPrev"||id==="pcNext"){
    if(id==="pcPrev")pl=(pl+25)%26;if(id==="pcNext")pl=(pl+1)%26;
    const c=$("cv");c.getContext("2d").clearRect(0,0,c.width,c.height);$("cvh").style.opacity=1;$("cvh").textContent="Draw "+ALPHA[pl][0]+" ✏️";
  }
});
let tries=0,lastT=null,lock=false;
function checkAns(){
  if(lock)return;
  const v=($("ans").value||"").trim().toLowerCase();
  if(!v)return;
  if(lastT!==target){tries=0;lastT=target;}
  const fb=$("fb"),good=v===target[0].toLowerCase();
  const go=ms=>{lock=true;setTimeout(()=>{lock=false;if(mode!=="type")return;newQ();renderQuiz();},ms);};
  if(good){ok++;tot++;bump();fb.innerHTML='<div style="color:#16a34a;margin-top:10px">✅ صحيح! الكلمة التالية...</div>';$("score").textContent="النتيجة: "+ok+" / "+tot;updPg();go(900);return;}
  tries++;
  if(tries>=3){tot++;fb.innerHTML='<div style="color:#dc2626;margin-top:10px">❌ انتهت المحاولات. الإجابة: <b>'+target[0]+'</b></div>';$("score").textContent="النتيجة: "+ok+" / "+tot;updPg();go(2000);return;}
  fb.innerHTML='<div style="color:#f59e0b;margin-top:10px">❌ خطأ. المحاولة '+tries+' من 3</div>';
  $("ans").value="";$("ans").focus();
}
$("home").addEventListener("click",()=>{navSet("home");const l=$("land");l.style.display="";l.offsetWidth;l.classList.remove("out");$("app").classList.add("hide");});
