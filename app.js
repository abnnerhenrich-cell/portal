import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, collection, query, orderBy, limit, getDocs, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const CFG = window.PORTAL_CONFIG;
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const DEMO = {
  apps: [
    {name:"JBPIX",icon:"💎",badge:"Boas-vindas",detail:"Acesso rápido, suporte e novidades.",tags:["Mobile","PIX","Suporte"],link:"#"},
    {name:"Clube da Sorte",icon:"⭐",badge:"Destaque",detail:"Plataforma organizada e simples.",tags:["Aplicativo","Promoções"],link:"#"},
    {name:"Sorte Aqui",icon:"🍀",badge:"Popular",detail:"Opção prática para seus clientes.",tags:["Celular","Atendimento"],link:"#"},
    {name:"Paratodos",icon:"🎯",badge:"Especial",detail:"Acesso direto e centralizado.",tags:["Rápido","Online"],link:"#"},
    {name:"Brasileira",icon:"🇧🇷",badge:"Diário",detail:"Campanhas e novidades.",tags:["Campanhas","Bônus"],link:"#"},
    {name:"Doguinho",icon:"🐶",badge:"Novidade",detail:"Experiência otimizada para celular.",tags:["Novo","Mobile"],link:"#"}
  ],
  results: {
    rio:{title:"Rio / PT-Rio • 11:20",rows:[["1º","8147","Elefante"],["2º","1748","Elefante"],["3º","1874","Pavão"],["4º","4871","Porco"],["5º","4718","Cachorro"]]},
    look:{title:"Look Goiás • 11:20",rows:[["1º","9013","Borboleta"],["2º","1974","Pavão"],["3º","1598","Vaca"],["4º","1549","Galo"],["5º","3472","Peru"]]},
    nacional:{title:"Nacional • 21:00",rows:[["1º","0800","Vaca"],["2º","1977","Peru"],["3º","4515","Borboleta"],["4º","1500","Vaca"],["5º","1552","Galo"]]}
  },
  publicPosts:[
    {label:"BICHO DO DIA",title:"Pavão",text:"Destaque demonstrativo do dia.",numbers:["1973","1974","1975","1976"]},
    {label:"CRUZ DO DIA",title:"8 • 4 • 7 • 1",text:"Combinações organizadas para consulta rápida.",numbers:["8147","1748","1874","4718"]},
    {label:"MENSAGEM",title:"Foco e organização",text:"Use apenas valores que não comprometam o seu orçamento.",numbers:[]}
  ],
  vipPosts:[
    {label:"EXCLUSIVO",title:"Palpite VIP 1",text:"Conteúdo reservado para membros.",numbers:["9013","7814","4515","7116"]},
    {label:"EXCLUSIVO",title:"Palpite VIP 2",text:"Atualização especial da noite.",numbers:["1973","1974","1975","1976"]},
    {label:"ANÁLISE",title:"Resumo do dia",text:"Espaço para análise e observações exclusivas.",numbers:["1597","1598","1599","1500"]}
  ],
  notices:[
    {title:"Aviso importante",text:"Confira sempre os horários antes do fechamento."},
    {title:"Conteúdo atualizado",text:"Os materiais VIP podem ser alterados pelo painel administrativo."}
  ],
  files:[
    {title:"Tabela de horários",text:"Arquivo demonstrativo.",url:"#"},
    {title:"Guia de aplicativos",text:"Material para os clientes.",url:"#"}
  ],
  schedules:[["09:20","Rio / PT-Rio"],["11:20","Rio / PT-Rio"],["14:20","Rio / PT-Rio"],["16:20","Rio / PT-Rio"],["18:20","Look Goiás"],["21:20","Rio / Nacional"]]
};

let activeResult = "rio";
let liveResults = {...DEMO.results};

function toast(msg){const el=$("#toast");el.textContent=msg;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2200)}
function renderApps(term=""){const t=term.toLowerCase();const arr=DEMO.apps.filter(a=>a.name.toLowerCase().includes(t)||a.tags.join(" ").toLowerCase().includes(t));$("#appGrid").innerHTML=arr.map(a=>`<article class="app-card"><div class="app-top"><div class="app-icon">${a.icon}</div><span class="badge">${a.badge}</span></div><div><h3>${a.name}</h3><p>${a.detail}</p></div><div class="tags">${a.tags.map(x=>`<span>${x}</span>`).join("")}</div><a class="btn primary full" href="${a.link}">Acessar aplicativo</a></article>`).join("")}
function renderResult(){const r=liveResults[activeResult]||DEMO.results[activeResult];$("#resultTitle").textContent=r.title;$("#resultTable").innerHTML=r.rows.map(x=>`<div class="result-row"><b>${x[0]}</b><strong>${x[1]}</strong><span>${x[2]}</span></div>`).join("")}
function renderPosts(target,data){$(target).innerHTML=data.map(p=>`<article class="post-card"><small>${p.label||"CONTEÚDO"}</small><h3>${p.title}</h3><p>${p.text||""}</p><div class="numbers">${(p.numbers||[]).map(n=>`<span>${n}</span>`).join("")}</div></article>`).join("")}
function renderNotices(data){$("#vipNotices").innerHTML=data.map(n=>`<article class="notice-item"><strong>${n.title}</strong><p>${n.text}</p></article>`).join("")}
function renderFiles(data){$("#vipFiles").innerHTML=data.map(f=>`<article class="file-item"><div><strong>${f.title}</strong><p>${f.text||""}</p></div><a href="${f.url||"#"}" target="_blank">Abrir</a></article>`).join("")}
function updateTime(){const now=new Date();let next;for(const [time,name] of DEMO.schedules){const [h,m]=time.split(":").map(Number);const d=new Date();d.setHours(h,m,0,0);if(d>now){next={time,name,date:d};break}}if(!next){const [time,name]=DEMO.schedules[0];const [h,m]=time.split(":").map(Number);const d=new Date();d.setDate(d.getDate()+1);d.setHours(h,m,0,0);next={time,name,date:d}}const diff=next.date-now;$("#nextDrawName").textContent=`${next.name} • ${next.time}`;$("#countdown").textContent=[Math.floor(diff/3600000),Math.floor((diff%3600000)/60000),Math.floor((diff%60000)/1000)].map(v=>String(v).padStart(2,"0")).join(":")}
function markUpdated(){const now=new Date();$("#lastUpdate").textContent=now.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}

function normalizeFirestoreResult(doc){
  const d=doc.data();
  const key=(d.loteria||d.tipo||"").toLowerCase().includes("look")?"look":(d.loteria||d.tipo||"").toLowerCase().includes("nacional")?"nacional":"rio";
  const premios=d.premios||d.resultados||[];
  const rows=Array.isArray(premios)&&premios.length?premios.slice(0,5).map((p,i)=>[`${i+1}º`,String(p.milhar||p.numero||p).padStart(4,"0"),p.bicho||p.animal||""]):[1,2,3,4,5].map((n,i)=>[`${n}º`,String(d[`premio${n}`]||d[`${n}premio`]||"0000"),d[`bicho${n}`]||""]);
  return {key,title:`${d.loteria||d.tipo||key} • ${d.horario||""}`,rows,ts:d.timestamp||d.createdAt||null};
}

async function connectFirebase(){
  if(!CFG.firebase.enabled){$("#connectionStatus").textContent="Modo demonstração";return}
  try{
    const app=initializeApp(CFG.firebase);
    const db=getFirestore(app);
    const q=query(collection(db,CFG.collections.results),orderBy("timestamp","desc"),limit(20));
    onSnapshot(q,snap=>{
      const newest={};
      snap.forEach(doc=>{const r=normalizeFirestoreResult(doc);if(!newest[r.key])newest[r.key]=r});
      liveResults={...liveResults,...Object.fromEntries(Object.entries(newest).map(([k,v])=>[k,{title:v.title,rows:v.rows}]))};
      renderResult();markUpdated();$("#connectionStatus").textContent="Conectado ao Firestore";
    },err=>{$("#connectionStatus").textContent="Erro na conexão";console.error(err)});
  }catch(err){$("#connectionStatus").textContent="Erro na configuração";console.error(err)}
}

function renderImportantNotice(){
  const notices=JSON.parse(localStorage.getItem("portal_vip_notices")||"null")||DEMO.notices;
  const important=notices.find(n=>n.important===true);
  const bar=$("#importantNoticeBar");
  if(!bar)return;
  const dismissed=sessionStorage.getItem("dismissedImportantNotice");
  if(important&&String(important.id||important.title)!==dismissed){
    $("#importantNoticeTitle").textContent=important.title||"Aviso importante";
    $("#importantNoticeText").textContent=important.text||"";
    bar.dataset.noticeId=String(important.id||important.title);
    bar.classList.remove("hidden");
  }else bar.classList.add("hidden");
}

function loadLocalContent(){
  const publicPosts=JSON.parse(localStorage.getItem("portal_public_posts")||"null")||DEMO.publicPosts;
  const vipPosts=JSON.parse(localStorage.getItem("portal_vip_posts")||"null")||DEMO.vipPosts;
  const notices=JSON.parse(localStorage.getItem("portal_vip_notices")||"null")||DEMO.notices;
  const files=JSON.parse(localStorage.getItem("portal_vip_files")||"null")||DEMO.files;
  renderPosts("#publicPosts",publicPosts);renderPosts("#vipPosts",vipPosts);renderNotices(notices);renderFiles(files);renderImportantNotice();
}


$$(".result-tabs button").forEach(b=>b.addEventListener("click",()=>{$$(".result-tabs button").forEach(x=>x.classList.remove("active"));b.classList.add("active");activeResult=b.dataset.result;renderResult()}));
$("#manualRefresh").addEventListener("click",()=>{renderResult();loadLocalContent();markUpdated();toast("Portal atualizado.")});
$$(".tool-tabs button").forEach(b=>b.addEventListener("click",()=>{$$(".tool-tabs button").forEach(x=>x.classList.remove("active"));$$(".tool-panel").forEach(x=>x.classList.remove("active"));b.classList.add("active");$("#"+b.dataset.panel).classList.add("active")}));
$("#calculateButton").addEventListener("click",()=>{$("#calculationResult").textContent=(Number($("#betValue").value||0)*Number($("#multiplier").value)).toLocaleString("pt-BR",{style:"currency",currency:"BRL"})});
$("#vipLoginButton").addEventListener("click",()=>{const ok=$("#vipUser").value==="vip"&&$("#vipPassword").value==="1234";if(ok){$("#vipLoginBox").classList.add("hidden");$("#vipDashboard").classList.remove("hidden");sessionStorage.setItem("vip","1");$("#vipMessage").textContent=""}else{$("#vipMessage").textContent="Usuário ou senha incorretos.";$("#vipMessage").style.color="var(--danger)"}});
$("#vipLogout").addEventListener("click",()=>{sessionStorage.removeItem("vip");$("#vipDashboard").classList.add("hidden");$("#vipLoginBox").classList.remove("hidden")});
$$(".vip-nav button").forEach(b=>b.addEventListener("click",()=>{$$(".vip-nav button").forEach(x=>x.classList.remove("active"));$$(".vip-panel").forEach(x=>x.classList.remove("active"));b.classList.add("active");$("#"+b.dataset.vipPanel).classList.add("active")}));


function createMilhar(start,end,avoid){
  for(let attempt=0;attempt<5000;attempt++){
    let middle="";
    const fixedStart=(start||"").replace(/\D/g,"").slice(0,2);
    const fixedEnd=(end||"").replace(/\D/g,"").slice(0,2);
    const remaining=4-fixedStart.length-fixedEnd.length;
    if(remaining<0)return null;
    for(let i=0;i<remaining;i++)middle+=Math.floor(Math.random()*10);
    const value=(fixedStart+middle+fixedEnd).padStart(4,"0").slice(-4);
    if(avoid){const counts={};for(const ch of value)counts[ch]=(counts[ch]||0)+1;if(Math.max(...Object.values(counts))>2)continue;}
    return value;
  }
  return null;
}
function generateMilhares(){
  const qty=Number($("#milharQuantity").value);const end=$("#milharEnding").value;const start=$("#milharStart").value;const avoid=$("#avoidRepeatedDigits").checked;
  if(start.replace(/\D/g,"").length+end.replace(/\D/g,"").length>4){toast("Início e final juntos não podem passar de 4 dígitos.");return;}
  const set=new Set();let guard=0;while(set.size<qty&&guard<20000){const n=createMilhar(start,end,avoid);if(n)set.add(n);guard++;}
  const arr=[...set];$("#milharResults").innerHTML=arr.length?arr.map(n=>`<span class="milhar-chip">${n}</span>`).join(""):'<span class="empty-state">Não foi possível gerar com esses filtros. Tente remover algum filtro.</span>';
}
$("#generateMilhares").addEventListener("click",generateMilhares);
$("#copyMilhares").addEventListener("click",async()=>{const nums=$$("#milharResults .milhar-chip").map(x=>x.textContent);if(!nums.length){toast("Gere os milhares primeiro.");return;}await navigator.clipboard.writeText(nums.join(" "));toast("Milhares copiados.");});
if($("#closeImportantNotice"))$("#closeImportantNotice").addEventListener("click",()=>{const bar=$("#importantNoticeBar");sessionStorage.setItem("dismissedImportantNotice",bar.dataset.noticeId||"");bar.classList.add("hidden")});

renderResult();loadLocalContent();updateTime();markUpdated();setInterval(updateTime,1000);setInterval(()=>{renderResult();loadLocalContent();markUpdated()},(CFG.refreshIntervalSeconds||60)*1000);connectFirebase();
if(sessionStorage.getItem("vip")==="1"){$("#vipLoginBox").classList.add("hidden");$("#vipDashboard").classList.remove("hidden")}
$("#whatsappMain").href=`https://wa.me/${CFG.whatsapp}?text=${encodeURIComponent("Olá, Kelly! Vim pelo portal e gostaria de informações.")}`;
