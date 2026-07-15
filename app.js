const CONFIG = {
  whatsapp: "5511999999999",
  apps: [
    { name: "JBPIX", icon: "💎", bonus: "Boas-vindas", detail: "Acesso rápido, suporte e novidades.", tags: ["Mobile", "PIX", "Suporte"], link: "#" },
    { name: "Clube da Sorte", icon: "⭐", bonus: "Destaque", detail: "Plataforma organizada e simples de acessar.", tags: ["Aplicativo", "Promoções"], link: "#" },
    { name: "Sorte Aqui", icon: "🍀", bonus: "Popular", detail: "Opção prática para os seus clientes.", tags: ["Celular", "Atendimento"], link: "#" },
    { name: "Paratodos", icon: "🎯", bonus: "Especial", detail: "Acesso direto com informações centralizadas.", tags: ["Rápido", "Online"], link: "#" },
    { name: "Brasileira", icon: "🇧🇷", bonus: "Diário", detail: "Campanhas, novidades e acesso em um só lugar.", tags: ["Campanhas", "Bônus"], link: "#" },
    { name: "Doguinho", icon: "🐶", bonus: "Novidade", detail: "Experiência otimizada para celular.", tags: ["Novo", "Mobile"], link: "#" }
  ],
  schedules: [
    { time: "09:20", name: "Rio / PT-Rio" },
    { time: "11:20", name: "Rio / PT-Rio" },
    { time: "14:20", name: "Rio / PT-Rio" },
    { time: "16:20", name: "Rio / PT-Rio" },
    { time: "18:20", name: "Look Goiás" },
    { time: "21:20", name: "Rio / Nacional" }
  ],
  results: {
    rio: { title: "Rio / PT-Rio • 11:20", rows: [["1º","8147","Elefante"],["2º","1748","Elefante"],["3º","1874","Pavão"],["4º","4871","Porco"],["5º","4718","Cachorro"]] },
    look: { title: "Look Goiás • 11:20", rows: [["1º","9013","Borboleta"],["2º","1974","Pavão"],["3º","1598","Vaca"],["4º","1549","Galo"],["5º","3472","Peru"]] },
    nacional: { title: "Nacional • 21:00", rows: [["1º","0800","Vaca"],["2º","1977","Peru"],["3º","4515","Borboleta"],["4º","1500","Vaca"],["5º","1552","Galo"]] }
  }
};

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function toast(message){
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2200);
}

function renderApps(filter=""){
  const term = filter.toLowerCase();
  const apps = CONFIG.apps.filter(app =>
    app.name.toLowerCase().includes(term) ||
    app.tags.join(" ").toLowerCase().includes(term)
  );
  $("#appGrid").innerHTML = apps.map(app => `
    <article class="app-card reveal visible">
      <div class="app-card-top">
        <div class="app-icon">${app.icon}</div>
        <span class="app-badge">${app.bonus}</span>
      </div>
      <div>
        <h3>${app.name}</h3>
        <p>${app.detail}</p>
      </div>
      <div class="app-tags">${app.tags.map(tag => `<span>${tag}</span>`).join("")}</div>
      <a class="button primary full" href="${app.link}" ${app.link !== "#" ? 'target="_blank" rel="noopener"' : ""}>Acessar aplicativo</a>
    </article>
  `).join("") || `<p style="color:var(--muted)">Nenhum aplicativo encontrado.</p>`;
}

function renderResults(key="rio"){
  const result = CONFIG.results[key];
  $("#resultTitle").textContent = result.title;
  $("#resultTable").innerHTML = result.rows.map(row => `
    <div class="result-row"><b>${row[0]}</b><strong>${row[1]}</strong><span>${row[2]}</span></div>
  `).join("");
}

function renderSchedule(){
  $("#scheduleTimeline").innerHTML = CONFIG.schedules.map(item => `
    <article class="schedule-item">
      <strong>${item.time}</strong>
      <span>${item.name}</span>
      <small>Horário programado</small>
    </article>
  `).join("");
}

function updateCountdown(){
  const now = new Date();
  let next;
  for(const item of CONFIG.schedules){
    const [h,m] = item.time.split(":").map(Number);
    const date = new Date();
    date.setHours(h,m,0,0);
    if(date > now){ next = {...item,date}; break; }
  }
  if(!next){
    const first = CONFIG.schedules[0];
    const [h,m] = first.time.split(":").map(Number);
    const date = new Date();
    date.setDate(date.getDate()+1);
    date.setHours(h,m,0,0);
    next = {...first,date};
  }
  const diff = next.date - now;
  const h = String(Math.floor(diff/3600000)).padStart(2,"0");
  const m = String(Math.floor((diff%3600000)/60000)).padStart(2,"0");
  const s = String(Math.floor((diff%60000)/1000)).padStart(2,"0");
  $("#nextDrawName").textContent = `${next.name} • ${next.time}`;
  $("#countdown").textContent = `${h}:${m}:${s}`;
}

function randomNumber(digits){
  return String(Math.floor(Math.random() * (10 ** digits))).padStart(digits,"0");
}

$("#appSearch").addEventListener("input",e=>renderApps(e.target.value));

$$(".result-option").forEach(button => button.addEventListener("click",()=>{
  $$(".result-option").forEach(x=>x.classList.remove("active"));
  button.classList.add("active");
  renderResults(button.dataset.result);
}));

$("#refreshResults").addEventListener("click",()=>{
  const active = $(".result-option.active").dataset.result;
  renderResults(active);
  toast("Resultados atualizados.");
});

$$(".tool-tab").forEach(tab=>tab.addEventListener("click",()=>{
  $$(".tool-tab").forEach(x=>x.classList.remove("active"));
  $$(".tool-panel").forEach(x=>x.classList.remove("active"));
  tab.classList.add("active");
  $("#" + tab.dataset.tool).classList.add("active");
}));

$("#calculateButton").addEventListener("click",()=>{
  const value = Number($("#betValue").value || 0);
  const multiplier = Number($("#multiplier").value);
  $("#calculationResult").textContent = (value * multiplier).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
});

$("#generateGuesses").addEventListener("click",()=>{
  const quantity = Number($("#guessQuantity").value);
  const digits = Number($("#guessDigits").value);
  const values = new Set();
  while(values.size < quantity) values.add(randomNumber(digits));
  $("#generatedNumbers").innerHTML = [...values].map(v=>`<span>${v}</span>`).join("");
});

const templates = {
  convite: app => `Olá! Conheça o ${app || "nosso aplicativo"}: acesso fácil pelo celular, atendimento rápido e informações organizadas em um só lugar. Fale comigo para receber o link.`,
  bonus: app => `Atenção! O ${app || "aplicativo"} está com uma condição especial. Consulte as regras, jogue com responsabilidade e fale comigo para saber mais.`,
  resultado: app => `Resultado atualizado no portal ${app || "Kelly Menezes JB"}. Acesse para conferir as informações organizadas por horário.`,
  bomdia: app => `Bom dia! Que hoje seja um dia leve, produtivo e cheio de boas decisões. Confira as novidades do ${app || "portal Kelly Menezes JB"}.`
};

$("#generateMessage").addEventListener("click",()=>{
  $("#generatedMessage").value = templates[$("#messageType").value]($("#messageApp").value.trim());
});

$("#copyMessage").addEventListener("click",async()=>{
  const text = $("#generatedMessage").value;
  if(!text) return toast("Crie uma mensagem primeiro.");
  await navigator.clipboard.writeText(text);
  toast("Mensagem copiada.");
});

$$("[data-copy]").forEach(button=>button.addEventListener("click",async()=>{
  await navigator.clipboard.writeText(button.dataset.copy);
  toast("Números copiados.");
}));

$("#vipForm").addEventListener("submit",e=>{
  e.preventDefault();
  const ok = $("#vipUser").value === "vip" && $("#vipPassword").value === "1234";
  $("#vipMessage").textContent = ok ? "Acesso demonstrativo liberado." : "Usuário ou senha incorretos.";
  $("#vipMessage").style.color = ok ? "var(--green)" : "var(--danger)";
});

const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting) entry.target.classList.add("visible")});
},{threshold:.06});

function init(){
  renderApps();
  renderResults();
  renderSchedule();
  $("#currentYear").textContent = new Date().getFullYear();
  $("#todayDate").textContent = new Date().toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit",year:"2-digit"});
  const text = encodeURIComponent("Olá, Kelly! Vim pelo portal e gostaria de informações.");
  $("#whatsappMain").href = `https://wa.me/${CONFIG.whatsapp}?text=${text}`;
  updateCountdown();
  setInterval(updateCountdown,1000);
  $$(".reveal").forEach(el=>observer.observe(el));
}
init();
