import {renderMarkdown,stableMarkdownPrefix,expandSourceCitations} from './markdown.js?v=3.0.11';
const app=document.getElementById('app');
const icons={
  sparkle:'<path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z"/><path d="m19 18 .8 1.8L22 20.5l-2.2.7L19 23l-.8-1.8-2.2-.7 2.2-.7L19 18ZM5 1l.8 1.8L8 3.5l-2.2.7L5 6l-.8-1.8L2 3.5l2.2-.7L5 1Z"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10Z"/>',
  chat:'<path d="M21 11.5a8.3 8.3 0 0 1-8.8 8.3 10 10 0 0 1-3.1-.7L3 21l1.9-5.2a8.3 8.3 0 0 1-1.9-5.3A8.6 8.6 0 0 1 12 2a8.7 8.7 0 0 1 9 9.5Z"/>',
  folder:'<path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/>',
  search:'<circle cx="10.8" cy="10.8" r="7.2"/><path d="m16.2 16.2 4.7 4.7"/>',settings:'<path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.1.1-1.9 1.9-.1-.1A1.7 1.7 0 0 0 16 18.44a1.7 1.7 0 0 0-1.1 1.57V21h-2.8v-.99A1.7 1.7 0 0 0 11 18.44a1.7 1.7 0 0 0-1.88.34l-.1.1-1.9-1.9.1-.1A1.7 1.7 0 0 0 7.56 15 1.7 1.7 0 0 0 6 13.9H5v-2.8h1A1.7 1.7 0 0 0 7.56 10a1.7 1.7 0 0 0-.34-1.88l-.1-.1 1.9-1.9.1.1A1.7 1.7 0 0 0 11 6.56 1.7 1.7 0 0 0 12.1 5V4h2.8v1a1.7 1.7 0 0 0 1.1 1.56 1.7 1.7 0 0 0 1.88-.34l.1-.1 1.9 1.9-.1.1A1.7 1.7 0 0 0 19.44 10 1.7 1.7 0 0 0 21 11.1h1v2.8h-1A1.7 1.7 0 0 0 19.4 15Z" transform="translate(-1.5,-.5)"/>',
  chevron:'<path d="m6 9 6 6 6-6"/>',right:'<path d="m9 18 6-6-6-6"/>',arrow:'<path d="M12 19V5m-7 7 7-7 7 7"/>',arrowRight:'<path d="M5 12h14m-7-7 7 7-7 7"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a16 16 0 0 1 0 18M12 3a16 16 0 0 0 0 18"/>',
  paperclip:'<path d="m20 11.5-7.6 7.6a5 5 0 0 1-7.1-7.1l8.5-8.5a3.5 3.5 0 0 1 5 5l-8.5 8.5a2 2 0 0 1-2.8-2.8l7.6-7.6"/>',
  command:'<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M9 9h6v6H9z"/>',
  cpu:'<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 9h6v6H9zM9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m-4 6h4m12-6h4m-4 6h4"/>',
  menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',more:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  edit:'<path d="m15 5 4 4M4 20l4.6-1 11-11a2.8 2.8 0 0 0-4-4l-11 11L4 20Z"/>',trash:'<path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3"/>',
  x:'<path d="M5 5 19 19M19 5 5 19"/>',copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
  file:'<path d="M7 2h7l5 5v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"/><path d="M14 2v6h5M9 13h6m-6 4h6"/>',
  code:'<path d="m8 8-4 4 4 4m8-8 4 4-4 4m-3-12-2 20"/>',
  bulb:'<path d="M9 18h6m-5 4h4M9 15c-1.8-1.1-3-3.1-3-5.3a6 6 0 0 1 12 0c0 2.2-1.2 4.2-3 5.3v2H9v-2Z"/>',
  book:'<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5A2.5 2.5 0 0 0 4 22V4.5ZM4 18.5A2.5 2.5 0 0 1 6.5 16H20"/>',
  download:'<path d="M12 3v12m-5-5 5 5 5-5M4 17v3h16v-3"/>',
  external:'<path d="M14 4h6v6m0-6-9 9M20 13v7H4V4h7"/>',
  check:'<path d="m4 12 5 5L20 6"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 10v6m0-9v.2"/>',
  spark:'<path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2Z"/>',
  stop:'<rect x="7" y="7" width="10" height="10" rx="2"/>',
  terminal:'<path d="m4 7 5 5-5 5M12 17h8"/>',graduation:'<path d="m2 9 10-5 10 5-10 5-10-5Zm4 4v5c3.5 2.7 8.5 2.7 12 0v-5M22 9v8"/>',gamepad:'<rect x="3" y="7" width="18" height="12" rx="5"/><path d="M7 13h5M9.5 10.5v5M16 12h.01M18 15h.01"/>',briefcase:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',heart:'<path d="M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.7l-1.1-1.1a5.5 5.5 0 1 0-7.8 7.8L12 22l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',monitor:'<rect x="2" y="3" width="20" height="15" rx="2"/><path d="M8 22h8m-4-4v4"/>',rocket:'<path d="M5 15c2-6 6-10 15-12 0 9-4 13-10 15l-5-3Zm2 2-3 3m9-13 4 4"/>',database:'<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 4 18 4 18 0V5M3 12c0 4 18 4 18 0"/>',music:'<path d="M9 18V5l12-2v13M9 8l12-2"/><ellipse cx="6" cy="18" rx="3" ry="2"/><ellipse cx="18" cy="16" rx="3" ry="2"/>',palette:'<path d="M12 3a9 9 0 1 0 0 18h2a2 2 0 0 0 1-4 2 2 0 0 1-1-3h3a4 4 0 0 0 4-4c0-4-4-7-9-7Z"/><circle cx="7" cy="11" r="1"/><circle cx="11" cy="7" r="1"/>',shield:'<path d="M12 2 4 5v7c0 5 3.5 8 8 10 4.5-2 8-5 8-10V5l-8-3Z"/>',wrench:'<path d="M21 7a6 6 0 0 1-8 7L6 21l-3-3 7-7a6 6 0 0 1 7-8l-4 4 4 4 4-4Z"/>',
  'dollar':'<circle cx="12" cy="12" r="9"/><path d="M15 8c-.6-1-1.7-1.5-3.2-1.5-2 0-3.3 1-3.3 2.5 0 1.6 1.7 2.3 3.5 2.8 2.1.6 3.5 1.3 3.5 3.1 0 1.6-1.5 2.6-3.5 2.6-1.7 0-3-.7-3.6-1.8M12 5v14"/>',
  'smartphone':'<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M10 18h4"/>',
  'pen-tool':'<path d="m12 19 7-7 3 3-7 7-3-3ZM13 5l6 6M5 13 2 16l6 6 3-3M12 2l10 10-3 3L9 5l3-3Z"/>',
  'braces':'<path d="M8 3H7a2 2 0 0 0-2 2v5c0 1.2-.7 2-2 2 1.3 0 2 .8 2 2v5a2 2 0 0 0 2 2h1M16 3h1a2 2 0 0 1 2 2v5c0 1.2.7 2 2 2-1.3 0-2 .8-2 2v5a2 2 0 0 1-2 2h-1"/>',
  'popcorn':'<path d="M5 9h14l-2 12H7L5 9Zm2 0-2-3a3 3 0 0 1 4-4 3 3 0 0 1 5 0 3 3 0 0 1 5 4l-2 3M9 10l1 10m4-10-1 10"/>',
  'swords':'<path d="M3 3l7 7m4 4 7 7M3 21l7-7m4-4 7-7M5 5l4-2 4 6-3 3-5-7Zm14 14-4 2-4-6 3-3 5 7Z"/>',
  'stethoscope':'<path d="M5 4v7a6 6 0 0 0 12 0V4M3 4h4m8 0h4M11 17v1a4 4 0 0 0 8 0v-3"/><circle cx="19" cy="12" r="2"/>',
  'snowflake':'<path d="M12 2v20M4 7l16 10M20 7 4 17M9 4l3 3 3-3M9 20l3-3 3 3M3 10l4 1-1 4M21 10l-4 1 1 4"/>',
  'flower':'<path d="M12 21c-3-3-5-6-5-10 4 0 6 3 5 7 0-5 2-7 5-7 0 4-2 7-5 10Zm0-7c-3-3-4-6 0-11 4 5 3 8 0 11ZM3 15c4-2 6-2 9 6-5 .5-8-1-9-6Zm18 0c-4-2-6-2-9 6 5 .5 8-1 9-6Z"/>',
  'chart':'<path d="M4 20h16M7 17v-5m5 5V8m5 9V4"/>',
  'hourglass':'<path d="M5 3h14M5 21h14M7 3v4c0 2 2 4 5 5-3 1-5 3-5 5v4m10-18v4c0 2-2 4-5 5 3 1 5 3 5 5v4"/>',
  'dumbbell':'<path d="m6 7 11 10M4 5l3-3 4 4-3 3-4-4Zm9 13 3-3 4 4-3 3-4-4ZM2 8l3-3m14 14 3-3"/>',
  'notebook':'<rect x="5" y="2" width="15" height="20" rx="2"/><path d="M9 6h7m-7 4h7m-7 4h5M3 6h4M3 11h4M3 16h4"/>',
  'scale':'<path d="M12 3v18M5 21h14M5 7h14M12 3l2 4M6 7l-4 7h8L6 7Zm12 0-4 7h8l-4-7Z"/>',
  'plane':'<path d="m22 2-8 20-3-9-9-3 20-8ZM11 13l4-4"/>',
  'paw':'<circle cx="7" cy="6" r="1.6"/><circle cx="12" cy="4" r="1.6"/><circle cx="17" cy="6" r="1.6"/><circle cx="20" cy="11" r="1.6"/><path d="M12 10c-2 0-4 3-6 5a3.5 3.5 0 0 0 4 5 5 5 0 0 1 4 0 3.5 3.5 0 0 0 4-5c-2-2-4-5-6-5Z"/>',
  'flask':'<path d="M9 2h6M10 2v7L4 19a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3L14 9V2M7 16h10"/>',
  'shield-half':'<path d="M12 2 4 5v7c0 5 3.5 8 8 10 4.5-2 8-5 8-10V5l-8-3ZM12 2v20"/>',
  'basket':'<path d="M4 10h16l-2 11H6L4 10Zm4 0 4-7 4 7M8 14v4m4-4v4m4-4v4"/>',
  'list-checks':'<path d="m3 7 2 2 3-4M11 7h10M3 17l2 2 3-4M11 17h10"/>',
  refresh:'<path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.5 9a7 7 0 0 1 12-3L20 12M4 12l2.5 6a7 7 0 0 0 12-3"/>'
};
function icon(name,size=18){return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]||icons.sparkle}</svg>`;}
const logoSvg=()=>`<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><circle cx="24" cy="24" r="4.8" fill="#fff"/><ellipse cx="24" cy="24" rx="18" ry="8.4" stroke="#fff" stroke-width="2.3" transform="rotate(-37 24 24)"/><ellipse cx="24" cy="24" rx="18" ry="8.4" stroke="#fff" stroke-width="2.3" transform="rotate(46 24 24)"/><circle cx="38.5" cy="13" r="2.3" fill="#fff"/></svg>`;
const esc=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const urlSafe=s=>{try{const u=new URL(s);return ['https:','http:'].includes(u.protocol)?u.href:'#';}catch{return '#';}};
const when=s=>{try{return new Intl.DateTimeFormat('it-IT',{day:'numeric',month:'short'}).format(new Date(s));}catch{return ''}};
// Il frontend GitHub Pages non contiene credenziali. La chiave e' salvata solo
// nel browser personale dell'utente dopo averla inserita esplicitamente.
const NEXA_LOCAL_API='http://127.0.0.1:4173';
let nexaPrivateToken='';
const localApiUrl=url=>url.startsWith('/api/')?NEXA_LOCAL_API+url:url;
const localApiHeaders=(more={})=>({'Content-Type':'application/json','X-Nexa-Token':nexaPrivateToken,...more});
const fetchJSON=async(url,opts={})=>{
  const r=await fetch(localApiUrl(url),{...opts,headers:localApiHeaders(opts.headers)});
  let v={};try{v=await r.json();}catch{}
  if(!r.ok)throw Error(v.error||`HTTP ${r.status}`);
  return v;
};
const write=(url,method,payload)=>fetchJSON(url,{method,body:JSON.stringify(payload)});
let data={settings:{},projects:[],chats:[]},connection={online:false,models:[]};
let ui={pluginDialog:null,choiceSelections:{},choiceCustoms:{},projectFlyoutId:null,modelPanel:false,iconPicker:false,iconSearch:'',view:'home',chatId:null,projectId:null,draft:'',recentCollapsed:localStorage.getItem('nexa-recents-hidden')==='1',files:[],modelId:localStorage.getItem('nexa-model')||'',streaming:false,streamText:'',streamSources:[],streamStatus:'',streamWeb:null,webTest:null,error:'',modal:null,drawer:false,settingsDraft:null,query:'',menu:null,sidebar:false,followOutput:true};
let typingChatId=null,typingChars=0,typingLastTick=0,typingTimer=null,messageReveal=null,revealTimer=null;let jobs=[];let jobsSnapshot='';let settingsTimer=null;let settingsSaves=Promise.resolve();let projectTimer=null;let projectSaves=Promise.resolve();
const sortedChats=()=>[...data.chats].sort((a,b)=>new Date(b.updatedAt)-new Date(a.updatedAt));
const currentChat=()=>data.chats.find(x=>x.id===ui.chatId);
const activeJob=id=>jobs.find(j=>j.chatId===id&&['queued','running'].includes(j.state));
function hydrateJob(){const j=activeJob(ui.chatId);if(typingChatId!==ui.chatId){typingChatId=ui.chatId;typingChars=0;typingLastTick=0;}ui.streaming=Boolean(j);ui.streamText=j?.text||'';ui.streamSources=j?.sources||[];ui.streamStatus=j?.status||'';ui.streamWeb=j?.webInfo||null;if(j)ui.error='';}
function setModelFavicon(){if(typeof document.createElement!=='function'||!document.head?.appendChild)return;const name=ui.modelId||'NEXA';const base=/gpt[-_]?oss|openai|gpt-/i.test(name)?'GPT':/llama|meta/i.test(name)?'L':/qwen/i.test(name)?'Q':/mistral/i.test(name)?'M':/gemma|google/i.test(name)?'G':'AI';const accent=(typeof getComputedStyle==='function'?getComputedStyle(document.documentElement).getPropertyValue('--accent').trim():'')||'#9589ff';const graphic=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect x="2" y="2" width="60" height="60" rx="16" fill="#161b24"/><circle cx="32" cy="32" r="24" fill="none" stroke="${accent}" stroke-width="3"/><text x="32" y="38" text-anchor="middle" font-family="Arial,sans-serif" font-weight="bold" font-size="${base==='GPT'?17:25}" fill="#fff">${base}</text></svg>`;let link=document.querySelector('link[rel="icon"]');if(!link){link=document.createElement('link');link.rel='icon';document.head.appendChild(link);}link.href='data:image/svg+xml,'+encodeURIComponent(graphic);}
const currentProject=()=>data.projects.find(x=>x.id===ui.projectId);
const projectHistory=id=>sortedChats().filter(c=>c.projectId===id&&(c.messages?.some(m=>m.role==='user')||c.title!=='Nuova conversazione'));
const isEmptyProjectChat=c=>Boolean(c?.projectId&&!c.messages?.some(m=>m.role==='user'));
function countChats(id){return data.chats.filter(c=>c.projectId===id).length;}
function toast(message,bad=false){const stack=document.getElementById('toast-stack');if(!stack)return;const el=document.createElement('div');el.className='toast'+(bad?' error':'');el.innerHTML=icon(bad?'info':'check',16)+'<span>'+esc(message)+'</span>';stack.appendChild(el);setTimeout(()=>el.remove(),4800);}
async function refresh(renderNow=true){data=await fetchJSON('/api/state');if(renderNow)render();}
async function refreshModels(showToast=false){connection=await fetchJSON('/api/models');if(!connection.models.some(m=>m.id===ui.modelId))ui.modelId=connection.models[0]?.id||'';localStorage.setItem('nexa-model',ui.modelId);setModelFavicon();render();if(showToast)toast(connection.online?`${connection.models.length} modello/i disponibili in LM Studio`:'Impossibile connettersi a LM Studio',!connection.online);}
// La palette segue il selettore di riferimento: 8 colori e icone SVG monocromatiche.
const PROJECT_COLORS=[
  {id:'neutral',label:'Grigio',hex:'#B9B7B2'},
  {id:'red',label:'Rosso',hex:'#FF5F63'},
  {id:'orange',label:'Arancione',hex:'#FF8849'},
  {id:'yellow',label:'Giallo',hex:'#FFD44D'},
  {id:'green',label:'Verde',hex:'#39C982'},
  {id:'blue',label:'Blu',hex:'#2997FF'},
  {id:'purple',label:'Viola',hex:'#AD75F4'},
  {id:'pink',label:'Rosa',hex:'#F080B4'}
];
const PROJECT_COLOR_ALIASES={indigo:'neutral',violet:'purple',teal:'green',amber:'yellow'};
const ACCENT_OPTIONS=[['default','Default'],['neutral','Grigio'],['red','Rosso'],['orange','Arancione'],['yellow','Giallo'],['green','Verde'],['blue','Blu'],['violet','Viola'],['rose','Rosa']];
const ACCENT_IDS=ACCENT_OPTIONS.map(([id])=>id);
const normalizedProjectColor=value=>PROJECT_COLOR_ALIASES[value]||value;
const PROJECT_ICONS=[
  'folder','dollar','smartphone','graduation','edit','pen-tool','braces','terminal',
  'music','popcorn','swords','palette','stethoscope','snowflake','flower','briefcase',
  'chart','hourglass','dumbbell','notebook','scale','globe','plane','gamepad',
  'wrench','paw','flask','shield-half','heart','basket',
  'code','cpu','rocket','sparkle','book','bulb','monitor','settings','database','search','file','shield'
];
const PROJECT_ICON_LABELS={folder:'Cartella',dollar:'Finanze',smartphone:'Telefono',graduation:'Istruzione',edit:'Matita',
 'pen-tool':'Disegno',braces:'Programmazione',terminal:'Terminale',music:'Musica',popcorn:'Cinema',swords:'Giochi',palette:'Arte',
 stethoscope:'Salute',snowflake:'Fiocco di neve',flower:'Fiore',briefcase:'Lavoro',chart:'Grafico',hourglass:'Clessidra',
 dumbbell:'Sport',notebook:'Appunti',scale:'Giustizia',globe:'Web',plane:'Viaggi',gamepad:'Videogiochi',wrench:'Strumenti',
 paw:'Animali',flask:'Scienza','shield-half':'Sicurezza',heart:'Cuore',basket:'Acquisti',code:'Codice',cpu:'AI',
 rocket:'Razzo',sparkle:'Scintille',book:'Libro',bulb:'Idea',monitor:'Monitor',settings:'Impostazioni',
 database:'Database',search:'Ricerca',file:'File',shield:'Protezione'};
const oldIcon=p=>({ '💻':'terminal','🧠':'cpu','🎮':'gamepad','🛡️':'shield','🚀':'rocket','🎨':'palette','📚':'book','🌐':'globe','🔧':'wrench','💡':'bulb','⚙️':'settings','📁':'folder','📊':'database'}[p?.emoji]||'folder');
function projectGlyph(p,size=18){return icon(PROJECT_ICONS.includes(p?.icon)?p.icon:oldIcon(p),size);}
function projectIcon(p){return `<span class="project-glyph" style="--project-color:${projectColor(p?.color)}">${projectGlyph(p,17)}</span>`;}
function projectColor(v){return PROJECT_COLORS.find(c=>c.id===normalizedProjectColor(v))?.hex||PROJECT_COLORS[5].hex;}
function projectIconMatches(name,query){const term=String(query||'').trim().toLocaleLowerCase('it');return !term||name.includes(term)||PROJECT_ICON_LABELS[name].toLocaleLowerCase('it').includes(term);}
function roundedSelect(name,value,options){const found=options.find(([k])=>k===value)||options[0];return `<div class="rounded-select"><input type="hidden" name="${esc(name)}" value="${esc(value||found?.[0]||'')}"><button type="button" class="rounded-select-trigger" data-action="toggle-select" aria-expanded="false"><span class="rounded-select-label">${esc(found?.[1]||'Seleziona')}</span>${icon('chevron',15)}</button><div class="rounded-select-popover" hidden>${options.map(([k,label])=>`<button type="button" data-action="choose-select" data-field="${esc(name)}" data-value="${esc(k)}" class="rounded-option ${k===value?'chosen':''}">${esc(label)}${k===value?icon('check',15):''}</button>`).join('')}</div></div>`;}
function modelPicker(){return `<div class="model-control"><button type="button" class="model-pill" data-action="toggle-model-panel" aria-expanded="${ui.modelPanel}" aria-controls="model-panel" title="Modello e comportamento">${icon('cpu',15)}<span>${esc(ui.modelId||'Scegli un modello')}</span>${icon('chevron',13)}</button></div>`;}
// Render the panel at document level: the home scroll container otherwise clips it.
function renderModelPanel(){if(!ui.modelPanel)return '';const s=ui.settingsDraft||data.settings||{};const chatModels=connection.models.filter(m=>!/embedding|embed-|rerank/i.test(m.id));return `<div class="model-panel model-panel-portal" id="model-panel" role="dialog" aria-label="Modello e comportamento"><div class="model-panel-title">Scegli un modello</div><div class="model-list">${chatModels.length?chatModels.map(m=>`<button type="button" class="model-option ${ui.modelId===m.id?'chosen':''}" data-action="choose-model" data-id="${esc(m.id)}">${icon('cpu',15)}<span>${esc(m.id)}</span>${ui.modelId===m.id?icon('check',15):''}</button>`).join(''):'<p class="field-hint">Avvia LM Studio per selezionare un modello conversazionale.</p>'}</div><div class="model-panel-title model-divider">Ricerca Web</div><div class="web-mode-row"><span class="web-mode-label">${icon('globe',16)}<span>Accesso a Internet</span></span><div class="web-mode-options" role="group" aria-label="Ricerca Web"><button type="button" data-action="set-web-mode" data-value="off" class="web-mode-option ${s.webEnabled===false?'active':''}" aria-pressed="${s.webEnabled===false}">OFF</button><button type="button" data-action="set-web-mode" data-value="on" class="web-mode-option ${s.webEnabled!==false?'active':''}" aria-pressed="${s.webEnabled!==false}">ON</button></div></div><p class="web-mode-hint">${s.webEnabled===false?'Ricerca disattivata: NEXA non invia le tue domande ai motori di ricerca.':'Ricerca attiva: NEXA consulta Internet prima delle risposte e invia la domanda al motore Web configurato.'}</p><div class="model-panel-title model-divider">Comportamento del modello</div><div class="field"><label>Ragionamento</label>${roundedSelect('reasoningEffort',s.reasoningEffort||'default',[['default','Predefinito'],['low','Basso'],['medium','Medio'],['high','Alto']])}<div class="field-hint">Con GPT-OSS usa la Responses API di LM Studio.</div></div><div class="field"><label class="temperature-row">Temperatura <strong id="temp-value">${Number(s.temperature??.7).toFixed(1)}</strong></label><input class="model-config" name="temperature" type="range" min="0" max="2" step="0.1" value="${s.temperature??.7}"></div><div class="field"><label>Prompt di sistema generale</label><textarea class="model-config" name="systemPrompt" rows="3">${esc(s.systemPrompt||'')}</textarea></div></div>`;}
function positionModelPanel(){const panel=document.getElementById('model-panel'),anchor=document.querySelector('.model-pill');if(!panel||!anchor)return;const r=anchor.getBoundingClientRect();const width=Math.min(360,window.innerWidth-24);const left=Math.max(12,Math.min(window.innerWidth-width-12,r.right-width));panel.style.width=`${width}px`;panel.style.left=`${left}px`;const aboveSpace=Math.max(0,r.top-20),belowSpace=Math.max(0,window.innerHeight-r.bottom-20);const preferAbove=aboveSpace>=Math.min(440,panel.scrollHeight+12)||aboveSpace>=belowSpace;const room=Math.max(100,(preferAbove?aboveSpace:belowSpace));const maxHeight=Math.min(540,room);panel.style.maxHeight=`${maxHeight}px`;const height=Math.min(panel.scrollHeight,maxHeight);panel.style.top=`${Math.max(10,Math.min(window.innerHeight-height-10,preferAbove?r.top-height-12:r.bottom+12))}px`;}

function applyAppearance(){const s=data.settings||{};document.documentElement.dataset.theme=s.theme==='light'?'light':'dark';document.documentElement.dataset.accent=ACCENT_IDS.includes(s.accentColor)?s.accentColor:'default';}
function renderSidebar(){
 const recents=sortedChats().slice(0,14);
 const lines=ui.recentCollapsed?'':(recents.length?recents.map(c=>`<div class="recent-row"><button class="nav-item chat-line ${ui.view==='chat'&&ui.chatId===c.id?'active':''}" data-action="open-chat" data-id="${esc(c.id)}">${icon('chat',15)}<span class="nav-text">${esc(c.title)}</span>${activeJob(c.id)?'<span class="job-dot" title="Generazione in corso"></span>':''}</button><button class="recent-options" data-action="chat-menu" data-id="${esc(c.id)}" title="Opzioni chat">${icon('more',15)}</button></div>`).join(''):'<div class="empty-side">Nessuna conversazione recente.</div>');
 // The project title expands a permanent, inline chat list instead of a floating popover.
 const projects=data.projects.map(p=>{
  const expanded=ui.projectFlyoutId===p.id;
  const projectChats=expanded?projectHistory(p.id):[];
  const threads=expanded?`<div class="sidebar-project-threads" id="project-threads-${esc(p.id)}">${projectChats.length?projectChats.map(c=>`<button type="button" class="project-thread ${ui.view==='chat'&&ui.chatId===c.id?'active':''}" data-action="open-chat" data-id="${esc(c.id)}" title="${esc(c.title)}"><span>${esc(c.title)}</span></button>`).join(''):'<p class="project-thread-empty">Nessuna chat in questo progetto.</p>'}</div>`:'';
  return `<div class="sidebar-project-group" draggable="true" data-project-drag="${esc(p.id)}"><div class="sidebar-project ${expanded?'expanded':''}"><button type="button" class="nav-item project-toggle ${expanded?'active':''}" data-action="project-flyout" data-id="${esc(p.id)}" aria-expanded="${expanded}" aria-controls="project-threads-${esc(p.id)}" title="${expanded?'Comprimi':'Espandi'} le chat del progetto">${projectIcon(p)}<span class="nav-text">${esc(p.name)}</span></button><button class="project-side-action" data-action="edit-project" data-id="${esc(p.id)}" title="Modifica progetto">${icon('edit',14)}</button><button class="project-side-action" data-action="open-project" data-id="${esc(p.id)}" title="Apri le chat del progetto" aria-label="Apri la pagina delle chat di ${esc(p.name)}">${icon('chat',15)}</button></div>${threads}</div>`;
 }).join('');
 return `<aside class="sidebar ${ui.sidebar?'show':''}" id="sidebar"><div class="sidebar-top"><div class="brand"><div class="brand-word">nexa<span>.</span></div></div><button class="new-chat" data-action="new-chat"><span class="new-chat-left">${icon('plus',17)} Nuova chat</span><span class="key-tip">Ctrl K</span></button></div><div class="sidebar-scroll"><div class="section-label">Workspace</div><button class="nav-item ${ui.view==='home'?'active':''}" data-action="home">${icon('home',17)}<span class="nav-text">Panoramica</span></button><button class="nav-item ${ui.view==='all'?'active':''}" data-action="all">${icon('chat',17)}<span class="nav-text">Tutte le chat</span></button><button class="nav-item ${ui.view==='search'?'active':''}" data-action="search">${icon('search',17)}<span class="nav-text">Cerca</span></button><button class="nav-item ${ui.view==='plugins'?'active':''}" data-action="plugins">${icon('wrench',17)}<span class="nav-text">Plugin</span></button><div class="section-label"><span>Progetti</span><button title="Crea progetto" data-action="new-project">${icon('plus',16)}</button></div>${projects||'<div class="empty-side">Crea il tuo primo progetto.</div>'}<div class="section-label recent-heading"><button type="button" class="recent-toggle" data-action="toggle-recents" aria-expanded="${!ui.recentCollapsed}">Recenti ${icon('chevron',14)}</button></div>${lines}</div><div class="sidebar-bottom"><button class="nav-item" data-action="settings">${icon('settings',17)}<span class="nav-text">Impostazioni</span></button><div class="server-mini"><span class="status-dot ${connection.online?'online':''}"></span><div><strong>LM Studio</strong><small>${connection.online?`${connection.models.length} modelli rilevati`:'Non connesso'}</small></div><button title="Aggiorna" data-action="refresh-models">${icon('refresh',15)}</button></div></div></aside>`;
}
function renderHeader(){const c=currentChat(),p=currentProject();const crumb=ui.view==='home'?'Panoramica':ui.view==='all'?'Tutte le conversazioni':ui.view==='search'?'Cerca nel workspace':ui.view==='plugins'?'Plugin':ui.view==='project'?(p?.name||'Progetto'):isEmptyProjectChat(c)?(data.projects.find(x=>x.id===c.projectId)?.name||'Progetto'):(c?.title||'Nuova conversazione');return `<header class="topbar"><div class="breadcrumbs"><button class="icon-button mobile-only" title="Menu" data-action="sidebar">${icon('menu',18)}</button><span class="hide-small">Workspace</span><span class="crumb-slash hide-small">/</span><span class="crumb-current">${esc(crumb)}</span></div><div class="top-right"><span class="status-pill"><span class="status-dot ${connection.online?'online':''}"></span>${connection.online?'Connesso':'Offline'}</span><button class="icon-button" data-action="refresh-models" title="Aggiorna modelli">${icon('refresh',17)}</button>${ui.view==='chat'?`<button class="icon-button" data-action="chat-menu" data-id="${esc(ui.chatId)}" title="Rinomina, sposta o elimina la chat">${icon('more',18)}</button>`:`<button class="icon-button" data-action="settings" title="Impostazioni">${icon('settings',17)}</button>`}</div></header>`;}
function composer(home=false){return `<div class="composer ${home?'compact-composer':''}"><textarea id="prompt" aria-label="Scrivi un messaggio" placeholder="Chiedi qualsiasi cosa…" rows="1">${esc(ui.draft)}</textarea>${ui.files.length?`<div class="chips">${ui.files.map((f,i)=>`<div class="file-chip">${icon('file',13)}<span>${esc(f.name)}</span><button data-action="remove-file" data-index="${i}">${icon('x',12)}</button></div>`).join('')}</div>`:''}<div class="composer-foot"><button class="tool-button attach-compact" data-action="attach" title="Allega file">${icon('plus',19)}</button><div class="composer-right">${modelPicker()}${ui.streaming?`<button class="send-button stop" data-action="stop" title="Interrompi">${icon('stop',17)}</button>`:`<button class="send-button" data-action="send" ${(!ui.draft.trim()||!ui.modelId)?'disabled':''} title="Invia">${icon('arrow',18)}</button>`}</div></div></div><input id="file-input" type="file" multiple hidden accept=".txt,.md,.csv,.json,.js,.jsx,.ts,.tsx,.py,.html,.css,.xml,.log,.yml,.yaml,.sql,.sh,.bat,.java,.c,.cpp,.h,.cs,.go,.rs,.php,.rb,.toml,.ini"/>`;}

function projectCard(p){return `<button class="project-card" data-action="open-project" data-id="${esc(p.id)}"><div class="project-mark ${esc(p.color)}" style="--project-color:${projectColor(p.color)}">${p.emoji?esc(p.emoji):icon('folder',19)}</div><span class="arrow">${icon('arrowRight',15)}</span><b>${esc(p.name)}</b><small>${countChats(p.id)} conversazioni · ${p.description?esc(p.description.slice(0,42)):'Progetto personale'}</small></button>`;}
function chatCard(c,withMenu=false){const p=data.projects.find(p=>p.id===c.projectId);return `<div class="chat-row"><button class="history-card" data-action="open-chat" data-id="${esc(c.id)}"><span class="history-icon">${icon('chat',17)}</span><span class="history-info"><strong>${esc(c.title)}</strong><small>${p?esc(p.name)+' · ':''}${when(c.updatedAt)} · ${c.messages.length} messaggi</small></span><span class="trailing">${icon('right',15)}</span></button>${withMenu?`<button class="icon-button" data-action="chat-menu" data-id="${esc(c.id)}" title="Opzioni">${icon('more',17)}</button>`:''}</div>`;}
function renderHome(){return `<div class="content-scroll home-scroll"><section class="home-minimal"><h1>Tutte le tue idee, <span class="grad-text">in un unico posto.</span></h1><div class="home-composer">${composer(true)}</div></section></div>`;}
function projectChatRow(c){return `<button class="project-chat-row" data-action="open-chat" data-id="${esc(c.id)}"><span>${esc(c.title)}</span><time datetime="${esc(c.updatedAt)}">${when(c.updatedAt)}</time></button>`;}
function renderProject(projectId=ui.projectId){const p=data.projects.find(x=>x.id===projectId);if(!p)return renderHome();const chats=projectHistory(p.id);return `<div class="content-scroll"><div class="project-page"><div class="project-headline"><div class="project-identity">${projectIcon(p)}<h1>${esc(p.name)}</h1></div><div class="project-actions"><button class="icon-button" data-action="edit-project" data-id="${esc(p.id)}" title="Impostazioni progetto">${icon('edit',16)}</button><button class="icon-button" data-action="new-chat" data-project="${esc(p.id)}" title="Nuova chat">${icon('chat',17)}</button></div></div><div class="project-entry">${composer(true)}</div><div class="project-tabs"><span class="selected">Chat</span><button data-action="edit-project" data-id="${esc(p.id)}">Impostazioni</button></div><div class="project-conversations">${chats.length?chats.map(projectChatRow).join(''):`<div class="empty-project">${icon('chat',24)}<h3>Ancora nessuna conversazione</h3><p>Scrivi un messaggio per iniziare.</p></div>`}</div></div></div>`;}

function renderAll(){
 const chats=sortedChats();
 if(!chats.length)return `<div class="content-scroll empty-chat-view"><div class="empty-panel empty-chat-centered" role="status">${icon('chat',32)}<b>Non ci sono ancora conversazioni.</b><p>Scrivi il primo messaggio e la chat verrà salvata automaticamente.</p><button type="button" class="primary-button empty-chat-start" data-action="new-chat">${icon('plus',16)}<span>Inizia una chat</span></button></div></div>`;
 return `<div class="content-scroll"><div class="content-wrap"><div class="page-heading"><div><div class="overline">LA TUA LIBRERIA</div><h1 class="page-title">Tutte le conversazioni</h1><p class="page-description">Ritrova le idee, gestisci la cronologia e sposta le chat tra i tuoi progetti.</p></div><button class="primary-button" data-action="new-chat">${icon('plus',16)} Nuova chat</button></div><div class="chat-list-cards">${chats.map(c=>chatCard(c,true)).join('')}</div></div></div>`;
}
function renderSearch(){const q=ui.query.trim().toLowerCase();const chats=sortedChats().filter(c=>!q||c.title.toLowerCase().includes(q)||c.messages.some(m=>m.content?.toLowerCase().includes(q))),projects=data.projects.filter(p=>!q||p.name.toLowerCase().includes(q)||p.description.toLowerCase().includes(q));return `<div class="content-scroll"><div class="content-wrap"><div class="overline">TROVA QUELLO CHE CERCHI</div><h1 class="page-title">Cerca nel workspace</h1><p class="page-description">Ricerca istantanea fra progetti, titoli e messaggi salvati.</p><div class="searchbar">${icon('search',18)}<input id="search-input" autocomplete="off" placeholder="Cerca chat, contenuti o progetti..." value="${esc(ui.query)}"><span class="key-tip">Esc</span></div>${projects.length?`<div class="searchgroup-label">PROGETTI (${projects.length})</div><div class="project-grid">${projects.map(projectCard).join('')}</div>`:''}${chats.length?`<div class="searchgroup-label">CONVERSAZIONI (${chats.length})</div><div class="chat-list-cards">${chats.map(c=>chatCard(c,true)).join('')}</div>`:''}${!projects.length&&!chats.length?`<div class="empty-panel">${icon('search',30)}<b>Nessun risultato</b><p>Prova con una parola chiave diversa.</p></div>`:''}</div></div>`;}
function sourceCards(sources){return sources?.length?`<details class="source-wrap"><summary class="source-toggle">Fonti web · ${sources.length} ${sources.length===1?'risultato consultato':'risultati consultati'} ${icon('chevron',14)}</summary><div class="source-grid">${sources.map((s,i)=>`<a class="source-card" href="${esc(urlSafe(s.url))}" title="${esc(s.snippet)}" target="_blank" rel="noopener noreferrer"><span class="source-index">${i+1}</span><span class="source-detail"><b>${esc(s.title)}</b><small>${esc((()=>{try{return new URL(s.url).hostname}catch{return ''}})())}</small></span>${icon('external',12)}</a>`).join('')}</div></details>`:'';}
function webIndicator(info){
 if(!info)return '';
 if(info.ok===false)return `<div class="web-progress web-progress-error">${icon('info',13)} <details><summary>Ricerca web non riuscita · nessuna fonte recuperata</summary><span class="web-error-message">${esc(info.error||'Controlla il motore in Impostazioni → Verifica ricerca Web.')}</span></details></div>`;
 // Only describe a search actually completed by the server, never imply the model used every result.
 if(info.ok===true&&Number(info.count)>0)return `<div class="web-progress">${icon('globe',13)} Ricerca web completata · ${Number(info.count)} risultati recuperati · apri "Fonti web" per i link consultati</div>`;
 return '';
}
// Cards are rendered from validated metadata persisted alongside assistant messages.
// Values are read from saved chat data, never from HTML attributes.
function batchSelectionReady(id,questions){
 return questions.every((_,i)=>(ui.choiceSelections[id]?.[i]?.length||0)>0||Boolean(ui.choiceCustoms[id]?.[i]?.trim()));
}
function renderBatchChoices(m,answered){
 const questions=m.choices.questions;
 const selections=ui.choiceSelections[m.id]||{};
 const customs=ui.choiceCustoms[m.id]||{};
 return `<section class="choice-card choice-batch ${answered?'choice-answered':''}" aria-label="Domande a risposta multipla">
 <div class="choice-eyebrow">${icon('list-checks',15)} <span>${questions.length} domande · scegli le risposte</span></div>
 ${questions.map((q,qi)=>`<div class="choice-question-group"><div class="choice-question"><span class="choice-number">${qi+1}</span>${esc(q.question)}</div>
 ${q.multiple?'<p class="choice-tip">Puoi selezionare più opzioni.</p>':''}
 <div class="choice-options">${q.options.map((option,i)=>`<button type="button" class="choice-option ${selections[qi]?.includes(i)?'selected':''}" data-action="toggle-batch-choice" data-id="${esc(m.id)}" data-question-index="${qi}" data-index="${i}" ${answered?'disabled':''} aria-pressed="${Boolean(selections[qi]?.includes(i))}"><span class="choice-marker">${q.multiple?(selections[qi]?.includes(i)?icon('check',13):''):String.fromCharCode(65+i)}</span><span>${esc(option)}</span>${icon('arrowRight',14)}</button>`).join('')}</div>
 ${answered?'':`<input type="text" maxlength="180" class="choice-custom-input" data-choice-custom="${esc(m.id)}" data-question-index="${qi}" placeholder="Altro: scrivi una risposta personalizzata…" value="${esc(customs[qi]||'')}" aria-label="Altra risposta per la domanda ${qi+1}">`}
 </div>`).join('')}
 ${answered?'<p class="choice-completed">Hai già risposto a queste domande.</p>':`<div class="choice-actions"><button type="button" class="choice-submit" data-action="submit-batch-choices" data-id="${esc(m.id)}" ${!batchSelectionReady(m.id,questions)?'disabled':''}>Invia le risposte ${icon('arrowRight',14)}</button></div>`}
 </section>`;
}
function renderChoices(m, answered=false) {
 const card=m.choices;
 if(Array.isArray(card?.questions)&&card.questions.length)return renderBatchChoices(m,answered);
 if(!card || !Array.isArray(card.options) || card.options.length<2 || !card.question)return '';
 const selected=ui.choiceSelections[m.id]||[];
 const custom=ui.choiceCustoms[m.id]?.[0]||'';
 const ready=selected.length>0||Boolean(custom.trim());
 return `<section class="choice-card ${answered?'choice-answered':''}" aria-label="Domanda a risposta multipla">
   <div class="choice-eyebrow">${icon('list-checks',15)} <span>${card.multiple?'Puoi scegliere più risposte':'Scegli una risposta'}</span></div>
   <div class="choice-question">${esc(card.question)}</div>
   <div class="choice-options">${card.options.map((option,i)=>`<button type="button" class="choice-option ${selected.includes(i)?'selected':''}" data-action="toggle-choice" data-id="${esc(m.id)}" data-index="${i}" ${answered?'disabled':''} aria-pressed="${selected.includes(i)}"><span class="choice-marker">${card.multiple?(selected.includes(i)?icon('check',13):''):String.fromCharCode(65+i)}</span><span>${esc(option)}</span>${icon('arrowRight',14)}</button>`).join('')}</div>
   ${answered?'<p class="choice-completed">Risposta inviata.</p>':`<input type="text" maxlength="180" class="choice-custom-input" data-choice-custom="${esc(m.id)}" data-question-index="0" placeholder="Altro: scrivi una risposta personalizzata…" value="${esc(custom)}" aria-label="Altra risposta alla domanda"><div class="choice-actions"><button type="button" class="choice-submit" data-action="submit-choices" data-id="${esc(m.id)}" ${!ready?'disabled':''}>Conferma risposta ${icon('arrowRight',14)}</button></div>`}
 </section>`;
}
function renderMessage(m,index,chat){
 const reveal=messageReveal?.chatId===chat?.id&&messageReveal?.messageId===m.id;
 const renderedContent=reveal?stableMarkdownPrefix(m.content.slice(0,messageReveal.count)):m.content;
 if(m.role==='user')return `<div class="message user"><div class="user-bubble">${esc(m.content)}${m.attachments?.length?`<div class="message-files">${m.attachments.map(f=>`<span class="attached-file">${icon('file',12)}${esc(f.name)}</span>`).join('')}</div>`:''}</div><div class="user-actions"><button data-action="copy-msg" data-id="${esc(m.id)}" title="Copia messaggio">${icon('copy',14)} Copia</button><button data-action="remember-msg" data-id="${esc(m.id)}" title="Salva il messaggio nella memoria">${icon('book',14)} Ricorda</button></div></div>`;
 return `<div class="message assistant"><div class="message-avatar">${icon('sparkle',17)}</div><div class="message-body"><div class="message-title">Nexa AI</div><div class="markdown" ${reveal?`data-reveal-message="${esc(m.id)}"`:``}>${renderMarkdown(renderedContent,m.sources,{streaming:reveal})}</div>${renderChoices(m,Boolean(chat?.messages?.slice(index+1).some(next=>next.role==='user')))}${webIndicator(m.webInfo)}${sourceCards(m.sources)}${m.generatedFiles?.length?`<div class="generated-archive"><span>${icon('file',15)} ${m.generatedFiles.length} file pronti</span><button class="archive-download" data-action="download-archive" data-chat-id="${esc(chat.id)}" data-id="${esc(m.id)}">${icon('download',15)} Scarica ZIP</button></div>`:''}${m.interrupted?'<div class="notice">Risposta interrotta</div>':''}<div class="message-meta"><button data-action="copy-msg" data-id="${esc(m.id)}" title="Copia risposta">${icon('copy',14)} Copia</button></div></div></div>`;
}
function renderChat(){const c=currentChat();if(!c)return renderHome();
 // A fresh project chat starts on the project history page, not on an empty chat screen.
 // The composer is still connected to this chat and becomes the normal conversation after the first send.
 if(isEmptyProjectChat(c))return renderProject(c.projectId);
 const p=c.projectId?data.projects.find(p=>p.id===c.projectId):null;return `<div class="chat-layout"><div class="chat-scroll" id="chat-scroll">${c.messages.length?c.messages.map((m,i)=>renderMessage(m,i,c)).join(''):`<div class="chat-welcome"><div class="orbit">${logoSvg()}</div><h2>Inizia una conversazione.</h2><p>${p?'Stai lavorando nel progetto '+esc(p.name)+'. Le sue istruzioni sono già attive.':'Il tuo modello è pronto ad aiutarti. Scrivi qualcosa qui sotto per cominciare.'}</p></div>`}${ui.streaming?`<div class="message assistant" id="streaming-message"><div class="message-avatar">${icon('sparkle',17)}</div><div class="message-body"><div class="message-title">Nexa AI</div><div class="thinking" id="streaming-status"><span class="dots"><i></i><i></i><i></i></span><span class="status-label">${esc(streamingIndicator())}</span></div><div class="markdown" id="stream-output">${renderMarkdown(stableMarkdownPrefix(ui.streamText.slice(0,typingChars)),ui.streamSources,{streaming:true})}</div><div id="stream-web">${webIndicator(ui.streamWeb)}</div><div id="stream-sources">${sourceCards(ui.streamSources)}</div></div></div>`:''}${ui.error?`<div class="notice">${esc(ui.error)}</div>`:''}</div><button id="jump-bottom" type="button" class="jump-bottom ${ui.followOutput?'hidden':''}" data-action="jump-bottom" title="Torna all'ultimo messaggio">${icon('arrow',15)} <span>Ultimo messaggio</span></button><div class="chat-composer-area">${composer()}</div></div>`;}
function renderModal(){const m=ui.modal;if(!m)return '';const p=m.id?data.projects.find(x=>x.id===m.id):null,c=m.id?data.chats.find(x=>x.id===m.id):null;
 if(m.type==='new-project'||m.type==='edit-project'){
  const editing=m.type==='edit-project',fields=m.fields||{};const val=(key,fallback='')=>fields[key]??p?.[key]??fallback;const selectedIcon=m.icon||p?.icon||oldIcon(p);const color=m.color||p?.color||'blue';
  const picker=`<div class="icon-picker ${ui.iconPicker?'open':''}" style="--project-color:${projectColor(color)}"><div class="icon-picker-top"><input id="icon-search" type="search" autocomplete="off" aria-label="Cerca icone" placeholder="Cerca icone" value="${esc(ui.iconSearch)}"><button type="button" class="icon-clear" data-action="reset-icon" title="Ripristina l'icona predefinita">Deseleziona</button></div><div class="icon-swatch-row" role="group" aria-label="Colore delle icone">${PROJECT_COLORS.map(clr=>`<button type="button" data-action="color" data-color="${clr.id}" class="color-dot ${normalizedProjectColor(color)===clr.id?'selected':''}" style="--swatch:${clr.hex}" aria-label="${clr.label}" aria-pressed="${normalizedProjectColor(color)===clr.id}" title="${clr.label}"></button>`).join('')}</div><div class="line-icon-grid">${PROJECT_ICONS.filter(k=>projectIconMatches(k,ui.iconSearch)).map(k=>`<button type="button" data-action="choose-icon" data-icon="${k}" data-label="${esc(PROJECT_ICON_LABELS[k])}" aria-label="${esc(PROJECT_ICON_LABELS[k])}" aria-pressed="${selectedIcon===k}" title="${esc(PROJECT_ICON_LABELS[k])}" class="${selectedIcon===k?'selected':''}">${icon(k,19)}</button>`).join('')}</div></div>`;
  return `<div class="modal-overlay" data-overlay="modal"><div class="modal project-settings-modal" role="dialog" aria-modal="true"><div class="modal-head"><h2>${editing?'Impostazioni del progetto':'Crea un progetto'}</h2><button class="icon-button" data-action="close-modal">${icon('x',18)}</button></div><form id="modal-form"><div class="field"><label>Nome del progetto</label><div class="project-name-control"><button type="button" class="picker-trigger" data-action="toggle-icon-picker" title="Cambia icona" style="--project-color:${projectColor(color)}">${icon(selectedIcon,21)}</button><input name="name" required maxlength="70" value="${esc(val('name'))}" placeholder="Nome progetto"></div>${ui.iconPicker?picker:''}</div><div class="field"><label>Descrizione</label><input name="description" maxlength="500" value="${esc(val('description'))}" placeholder="Descrivi brevemente il progetto"></div><div class="field"><label>Istruzioni</label><textarea name="instructions" rows="5" placeholder="Contesto, obiettivi e comportamento del modello…">${esc(val('instructions'))}</textarea></div><div class="field"><label>Memoria</label>${roundedSelect('memoryMode',val('memoryMode','project'),[['project','Solo questo progetto'],['global','Memoria globale condivisa']])}</div><div class="field"><label>Accesso alla libreria</label><div class="readonly-select">Disabilitato <span>Funzione futura</span></div></div><div class="field"><label>Note della memoria</label><textarea name="memory" rows="3" maxlength="8000" placeholder="Preferenze e informazioni del progetto…">${esc(val('memory'))}</textarea></div>${editing?`<div class="project-danger"><button type="button" class="danger-text" data-action="delete-project" data-id="${esc(p.id)}">Elimina progetto</button></div>`:''}<div class="modal-actions">${editing?`<span class="save-status" id="project-save-status">Le modifiche vengono salvate automaticamente</span><button class="secondary-button" type="button" data-action="close-modal">Chiudi</button>`:`<button class="secondary-button" type="button" data-action="close-modal">Annulla</button><button class="primary-button" type="submit">Crea progetto</button>`}</div></form></div></div>`;
 }
 let title='',subtitle='',form='';
 if(m.type==='rename-chat'){title='Rinomina conversazione';form=`<div class="field"><label>Nome</label><input name="title" maxlength="100" required value="${esc(c?.title||'')}"></div>`;}
 if(m.type==='move-chat'){title='Sposta conversazione';form=`<div class="field"><label>Destinazione</label><select name="projectId"><option value="">Nessun progetto</option>${data.projects.map(p=>`<option value="${esc(p.id)}" ${c?.projectId===p.id?'selected':''}>${esc(p.name)}</option>`).join('')}</select></div>`;}
 if(m.type==='delete-project'){title='Eliminare il progetto?';subtitle='Le chat resteranno disponibili nelle conversazioni generali.';}
 if(m.type==='delete-chat'){title='Eliminare la chat?';subtitle='Questa operazione cancella definitivamente tutti i messaggi.';}
 const destructive=m.type.startsWith('delete-');return `<div class="modal-overlay" data-overlay="modal"><div class="modal" role="dialog" aria-modal="true"><div class="modal-head"><h2>${title}</h2><button class="icon-button" data-action="close-modal">${icon('x',17)}</button></div><p class="modal-sub">${subtitle}</p><form id="modal-form">${form}<div class="modal-actions"><button type="button" class="secondary-button" data-action="close-modal">Annulla</button><button type="submit" class="${destructive?'danger-button':'primary-button'}">${destructive?'Elimina definitivamente':'Conferma'}</button></div></form></div></div>`;
}
function renderDrawer(){if(!ui.drawer)return'';const s=ui.settingsDraft||data.settings;return `<div class="drawer-overlay" data-overlay="drawer"><section class="settings-drawer" role="dialog" aria-modal="true"><div class="drawer-head"><div><div class="overline" style="margin-bottom:10px">CONFIGURAZIONE</div><h2>Impostazioni</h2><div class="modal-sub" style="margin-bottom:0">Personalizza il tuo workspace AI.</div></div><button class="icon-button" data-action="close-settings">${icon('x',18)}</button></div><form id="settings-form"><div class="drawer-section"><h3>Connessione LM Studio</h3><div class="field"><label>Indirizzo server API</label><input name="lmstudioUrl" placeholder="http://127.0.0.1:1235" value="${esc(s.lmstudioUrl||'')}"><div class="field-hint">In LM Studio: Developer → Start Server. In questa installazione usa la porta 1235.</div></div><div class="settings-info">${icon('cpu',20)}<div>${connection.online?`<b style="color:#75d8b1">Server connesso</b><div>${connection.models.length} modello/i disponibili</div>`:'<b style="color:#f3c9a4">Server non raggiungibile</b><div>Apri LM Studio e avvia il server locale.</div>'}</div></div></div><div class="drawer-section"><h3>Ricerca su Internet</h3><div class="field"><label>Motore di ricerca</label>${roundedSelect('searchProvider',s.searchProvider||'duckduckgo',[['duckduckgo','DuckDuckGo (gratuito)'],['brave','Brave Search API'],['searxng','SearXNG (server personale)']])}</div>${s.searchProvider==='brave'?`<div class="field"><label>Chiave API Brave Search</label><input name="braveKey" type="password" value="${esc(s.braveKey||'')}" autocomplete="off" placeholder="Inserisci la tua API key"></div>`:''}${s.searchProvider==='searxng'?`<div class="field"><label>Indirizzo del server SearXNG</label><input name="searxngUrl" placeholder="http://127.0.0.1:8080" value="${esc(s.searxngUrl||'')}"></div>`:''}<button type="button" class="secondary-button web-test-button" data-action="test-web" ${ui.webTest?.pending?'disabled':''}>${icon('globe',15)} ${ui.webTest?.pending?'Verifica in corso…':'Verifica ricerca Web'}</button>${ui.webTest&&!ui.webTest.pending?`<div class="web-test-result ${ui.webTest.ok?'success':'failure'}"><b>${ui.webTest.ok?'Ricerca funzionante':'Ricerca non disponibile'}</b><p>${ui.webTest.ok?`${ui.webTest.count} fonti tramite ${esc(ui.webTest.provider)} (${ui.webTest.elapsedMs} ms)`:`${esc(ui.webTest.error||'Errore sconosciuto')}`}</p>${ui.webTest.ok?`<small>Query: ${esc(ui.webTest.query)}</small><div>${ui.webTest.sources?.slice(0,3).map(s=>`<a href="${esc(urlSafe(s.url))}" target="_blank" rel="noopener noreferrer">${esc(s.title)}</a>`).join('')||''}</div>`:''}</div>`:''}<div class="settings-info">${icon('info',19)}<div>La ricerca Web si attiva o disattiva dal <b>pannello del modello</b>. Quando è ON, il testo della domanda viene inviato al motore di ricerca esterno. Se la connessione fallisce, il modello risponde localmente segnalando che non ha fonti verificate. Le chat rimangono archiviate localmente.</div></div></div><div class="drawer-section"><h3>Ricerca avanzata</h3><div class="field"><label>Profondità ricerca</label>${roundedSelect('searchMode',s.searchMode||'standard',[['rapid','Rapida · minimo approfondimento'],['standard','Standard · ricerca adattiva'],['deep','Approfondita · verifica incrociata'],['research','Deep Research · ricerca estesa']])}<div class="field-hint">Le modalità avanzate provano anche a leggere alcune pagine pubbliche HTTPS. I risultati dipendono dal motore scelto.</div></div></div><div class="drawer-section"><h3>Aspetto</h3><div class="field"><label>Tema</label>${roundedSelect('theme',s.theme||'dark',[['dark','Scuro'],['light','Chiaro']])}</div><div class="field"><label>Colore principale</label>${roundedSelect('accentColor',s.accentColor||'default',ACCENT_OPTIONS)}</div></div><div class="drawer-section"><h3>Memoria globale</h3><div class="field"><label>Note condivise tra chat e progetti autorizzati</label><textarea name="globalMemory" rows="5" maxlength="8000" placeholder="Preferenze, informazioni da ricordare, convenzioni…">${esc(s.globalMemory||'')}</textarea><div class="field-hint">Le note sono locali e vengono inviate a LM Studio come contesto delle chat non associate a un progetto e dei progetti con memoria globale.</div></div></div><div class="settings-bottom"><span class="save-status" id="settings-save-status">Salvataggio automatico</span><button type="button" class="secondary-button" data-action="close-settings">Chiudi</button></div></form></section></div>`;}
function renderMenu(){if(!ui.menu)return'';const m=ui.menu;return `<div class="menu-backdrop" data-action="close-menu"></div><div class="context-menu" style="left:${m.x}px;top:${m.y}px"><button data-action="rename-chat" data-id="${esc(m.id)}">${icon('edit',16)} Rinomina</button><button data-action="move-chat" data-id="${esc(m.id)}">${icon('folder',16)} Sposta nel progetto</button><button data-action="export-chat" data-id="${esc(m.id)}">${icon('download',16)} Esporta Markdown</button><button class="destructive" data-action="delete-chat" data-id="${esc(m.id)}">${icon('trash',16)} Elimina chat</button></div>`;}
function queueSettingsSave(){clearTimeout(settingsTimer);settingsTimer=setTimeout(()=>{flushSettings().catch(e=>toast(e.message,true));},650);applyAppearance();const st=document.getElementById('settings-save-status');if(st)st.textContent='Salvataggio…';}
async function flushSettings(){clearTimeout(settingsTimer);settingsTimer=null;const payload={...(ui.settingsDraft||data.settings)};settingsSaves=settingsSaves.catch(()=>{}).then(async()=>{const saved=await write('/api/settings','PUT',payload);data.settings={...data.settings,...saved};applyAppearance();});await settingsSaves;const st=document.getElementById('settings-save-status');if(st)st.textContent='Salvato';}
function queueProjectSave(){if(ui.modal?.type!=='edit-project')return;clearTimeout(projectTimer);projectTimer=setTimeout(()=>flushProjectSave().catch(e=>toast(e.message,true)),650);const st=document.getElementById('project-save-status');if(st)st.textContent='Salvataggio…';}
async function flushProjectSave(){clearTimeout(projectTimer);projectTimer=null;if(ui.modal?.type!=='edit-project')return;const m=ui.modal;const form=document.getElementById('modal-form');const fields=form?Object.fromEntries(new FormData(form)):(m.fields||{});const payload={...fields,color:m.color||data.projects.find(p=>p.id===m.id)?.color||'blue',icon:m.icon||data.projects.find(p=>p.id===m.id)?.icon||'folder'};const id=m.id;projectSaves=projectSaves.catch(()=>{}).then(async()=>{const saved=await write('/api/projects/'+id,'PATCH',payload);const index=data.projects.findIndex(p=>p.id===id);if(index>=0)data.projects[index]=saved;});await projectSaves;const st=document.getElementById('project-save-status');if(st)st.textContent='Salvato';}
const PLUGIN_PRESETS=[
 {name:'Gmail',slug:'gmail',description:'Posta elettronica Google',docs:'https://developers.google.com/workspace/gmail/api'},
 {name:'Google Drive',slug:'google-drive',description:'Documenti e file cloud',docs:'https://developers.google.com/workspace/drive'},
 {name:'Google Calendar',slug:'google-calendar',description:'Calendario e appuntamenti',docs:'https://developers.google.com/workspace/calendar'},
 {name:'GitHub',slug:'github',description:'Repository, issue e pull request',docs:'https://github.com/github/github-mcp-server'},
 {name:'Outlook',slug:'outlook',description:'Posta e calendario Microsoft',docs:'https://learn.microsoft.com/en-us/graph/overview'},
 {name:'Notion',slug:'notion',description:'Note e documentazione',docs:'https://developers.notion.com/'},
 {name:'Slack',slug:'slack',description:'Comunicazioni di gruppo',docs:'https://api.slack.com/'},
 {name:'Canva',slug:'canva',description:'Design e presentazioni',docs:'https://www.canva.dev/'},
 {name:'Figma',slug:'figma',description:'Progettazione interfacce',docs:'https://www.figma.com/developers/'},
 {name:'Dropbox',slug:'dropbox',description:'File e sincronizzazione',docs:'https://www.dropbox.com/developers'}
];
function renderPlugins(){
 const items=data.plugins||[];
 const presets=PLUGIN_PRESETS.map((preset,i)=>`<article class="plugin-preset"><div class="plugin-preset-main"><img class="plugin-brand" src="./logos/${esc(preset.slug)}.svg" alt="" width="38" height="38" loading="lazy"><div><b>${esc(preset.name)}</b><small>${esc(preset.description)}</small></div></div><div class="plugin-preset-actions"><a href="${esc(preset.docs)}" target="_blank" rel="noopener noreferrer">Documentazione</a><button type="button" data-action="use-plugin-preset" data-index="${i}">Configura</button></div></article>`).join('');
 const custom=`<button type="button" class="plugin-preset plugin-custom-card" data-action="open-plugin-dialog" aria-label="Aggiungi il tuo plugin"> <span class="plugin-custom-icon">${icon('plus',24)}</span><span class="plugin-custom-details"><b>Aggiungi il tuo plugin</b><small>Configura un plugin personalizzato tramite server MCP</small></span><span class="plugin-custom-chevron">${icon('arrowRight',17)}</span></button>`;
 return `<div class="content-scroll"><div class="content-wrap"><div class="page-heading"><div><div class="overline">INTEGRAZIONI</div><h1 class="page-title">Plugin</h1><p class="page-description">Preset per preparare integrazioni comuni. Ogni servizio richiede un endpoint MCP compatibile e un’autorizzazione propria. Questa versione salva soltanto configurazioni: non esegue plugin e non accede agli account.</p></div></div><div class="plugin-preset-grid">${presets}${custom}</div><div class="nexa-items">${items.map(t=>`<div class="nexa-item"><div><b>${esc(t.name)}</b><small>${esc(t.url)}</small><small>${t.enabled?'Abilitato nel registro (non connesso)':'Disabilitato'}</small></div><div><button data-action="toggle-plugin" data-id="${esc(t.id)}">${t.enabled?'Disabilita':'Abilita'}</button><button data-action="remove-plugin" data-id="${esc(t.id)}">Elimina</button></div></div>`).join('')||'<p class="page-description">Nessuna configurazione salvata.</p>'}</div></div></div>`;
}
function renderPluginDialog(){
 if(!ui.pluginDialog)return '';
 return `<div class="modal-overlay" data-overlay="plugin"><div class="modal plugin-dialog" role="dialog" aria-modal="true" aria-labelledby="plugin-dialog-title"><div class="modal-head"><h2 id="plugin-dialog-title">${ui.pluginDialog.preset?'Configura '+esc(ui.pluginDialog.name):'Aggiungi il tuo plugin'}</h2><button class="icon-button" type="button" data-action="close-plugin-dialog" aria-label="Chiudi">${icon('x',18)}</button></div><p class="modal-sub">${ui.pluginDialog.preset?'Inserisci l’endpoint MCP reale del servizio. Non si tratta di una connessione preattivata.':'Salva l’indirizzo del tuo server MCP personale. Nessuna connessione viene avviata automaticamente.'}</p><form id="plugin-form"><div class="field"><label for="plugin-name">Nome plugin</label><input id="plugin-name" name="name" required maxlength="80" autocomplete="off" placeholder="Il mio server MCP" value="${esc(ui.pluginDialog.name||'')}"></div><div class="field"><label for="plugin-url">URL endpoint</label><input id="plugin-url" name="url" type="url" required maxlength="500" placeholder="http://127.0.0.1:3000/mcp" autocomplete="off"></div><div class="modal-actions"><button class="secondary-button" type="button" data-action="close-plugin-dialog">Annulla</button><button class="primary-button" type="submit">${icon('plus',16)} Salva configurazione</button></div></form></div></div>`;
}
function render(){
  applyAppearance();setModelFavicon();
  const active=document.activeElement;
  const focusId=active?.id;
  const start=active?.selectionStart;
  const priorScroll=document.getElementById('chat-scroll');
  const oldTop=priorScroll?.scrollTop??0;
  document.title=(ui.view==='chat'&&currentChat()?currentChat().title+' — ':'')+'Nexa.';
  app.innerHTML=`<div class="app-shell">${renderSidebar()}<div class="mobile-overlay ${ui.sidebar?'show':''}" data-action="close-sidebar"></div><main class="main view-${ui.view}">${renderHeader()}${ui.view==='home'?renderHome():ui.view==='project'?renderProject():ui.view==='chat'?renderChat():ui.view==='all'?renderAll():ui.view==='plugins'?renderPlugins():renderSearch()}</main></div>${renderModelPanel()}${renderMenu()}${renderModal()}${renderPluginDialog()}${renderDrawer()}<div class="toast-stack" id="toast-stack" aria-live="polite"></div>`;
  positionModelPanel();
  if(focusId==='prompt'||focusId==='search-input'){
    const el=document.getElementById(focusId);
    if(el){el.focus();try{el.setSelectionRange(start,start);}catch{}}
  }
  if(ui.view==='chat'){
    const el=document.getElementById('chat-scroll');
    if(el){el.scrollTop=ui.followOutput?el.scrollHeight:oldTop;el.dataset.previousTop=String(el.scrollTop);syncFollowButton();}
  }
}
function isNearBottom(el){return !el || el.scrollHeight-el.scrollTop-el.clientHeight < 85;}
function syncFollowButton(){document.getElementById('jump-bottom')?.classList.toggle('hidden',ui.followOutput);}
function go(view,opts={}){if(ui.chatId)chatDrafts.set(ui.chatId,{text:ui.draft,files:[...ui.files]});ui.followOutput=true;ui.view=view;ui.menu=null;ui.modelPanel=false;ui.sidebar=false;ui.error='';ui.streamText='';ui.streamSources=[];ui.streamStatus='';ui.streamWeb=null;ui.chatId=opts.chatId||null;ui.projectId=opts.projectId||null;const stored=chatDrafts.get(ui.chatId);ui.files=stored?.files?[...stored.files]:[];ui.draft=stored?.text||'';if(view==='chat'){const c=currentChat();if(c?.modelId&&connection.models.some(m=>m.id===c.modelId))ui.modelId=c.modelId;}hydrateJob();render();}
// One reusable empty conversation per project (and one outside projects).
// Rapid clicks are coalesced while the POST is still pending.
const pendingNewChats=new Map(),chatDrafts=new Map();
function focusChat(id,projectId){
 if(ui.view==='chat'&&ui.chatId===id){document.getElementById('prompt')?.focus();return;}
 go('chat',{chatId:id,projectId});document.getElementById('prompt')?.focus();
}
function newChat(projectId=null){
 const scope=projectId||null;
 const key=scope||'__global__';
 if(pendingNewChats.has(key))return pendingNewChats.get(key);
 const task=(async()=>{
  const c=await write('/api/chats','POST',{projectId:scope,modelId:ui.modelId,webEnabled:data.settings.webEnabled!==false});
  const existing=data.chats.find(x=>x.id===c.id);
  if(!existing)data.chats.unshift(c);
  focusChat(c.id,scope);
  return c;
 })();
 pendingNewChats.set(key,task);
 void task.finally(()=>{if(pendingNewChats.get(key)===task)pendingNewChats.delete(key);}).catch(()=>{});
 return task;
}
function scrollChat(force=false){
  const el=document.getElementById('chat-scroll');
  if(!el)return;
  if(force)ui.followOutput=true;
  if(ui.followOutput){el.scrollTop=el.scrollHeight;el.dataset.previousTop=String(el.scrollTop);}
  syncFollowButton();
}
function animateFinalResponse(){
  if(!messageReveal||revealTimer)return;
  const current=messageReveal;
  const output=document.querySelector('[data-reveal-message]');
  if(!output||output.dataset.revealMessage!==current.messageId)return;
  const total=current.full.length;
  const step=Math.max(2,Math.ceil(total/90));
  current.count=Math.min(total,current.count+step);
  const visible=current.count===total?current.full:stableMarkdownPrefix(current.full.slice(0,current.count));
  output.innerHTML=renderMarkdown(visible,current.sources);
  scrollChat();
  if(current.count<total){revealTimer=setTimeout(()=>{revealTimer=null;animateFinalResponse();},35);}
  else {messageReveal=null;revealTimer=null;}
}
function streamingIndicator(){
  if(ui.streamWeb?.ok&&ui.streamSources.length){return `Consultate ${ui.streamSources.length} fonti · Elaborazione della risposta…`;}
  if(ui.streamWeb?.ok===false)return 'Ricerca non disponibile · Elaborazione della risposta…';
  return ui.streamStatus||'Preparazione della risposta…';
}
function streamPaint(){
  const output=document.getElementById('stream-output');
  const target=ui.streamText.length;
  const now=performance.now();
  if(typingChars>target)typingChars=target;
  if(typingChars<target){
    // Display the response in readable increments, independently of the LM Studio network chunks.
    const delta=Math.min(target-typingChars,Math.max(1,Math.floor((now-(typingLastTick||now-40))/22)*3));
    typingChars+=delta;typingLastTick=now;
  }
  const visible=ui.streamText.slice(0,typingChars);
  if(output){const stable=stableMarkdownPrefix(visible);const previous=output.dataset.lastStable||'';
    if(previous!==stable){output.dataset.lastStable=stable;output.innerHTML=renderMarkdown(stable,ui.streamSources,{streaming:typingChars<target});}}
  const status=document.getElementById('streaming-status');
  if(status){status.style.display=stableMarkdownPrefix(visible)?'none':'flex';
    const label=status.querySelector('.status-label');if(label)label.textContent=streamingIndicator();}
  scrollChat();
  if(typingChars<ui.streamText.length){typingTimer=setTimeout(streamPaint,35);}
  else typingTimer=null;
}
function updateStream(){if(typingTimer)return;typingTimer=setTimeout(()=>{typingTimer=null;streamPaint();},35);}

async function send(){
  if(activeJob(ui.chatId))return;
  const message=ui.draft.trim();if(!message)return;
  if(!ui.modelId){toast('Carica un modello in LM Studio e aggiorna la connessione.',true);return;}
  const attached=[...ui.files],web=data.settings.webEnabled!==false;
  const targetId=ui.chatId,scope=ui.view==='project'?ui.projectId:null,selectedModel=ui.modelId;
  const previousDraft=ui.draft;ui.draft='';ui.files=[];if(targetId)chatDrafts.delete(targetId);render();
  try{
    if(settingsTimer)await flushSettings();else await settingsSaves;
    let c=data.chats.find(x=>x.id===targetId);
    if(!c){c=await write('/api/chats','POST',{projectId:scope,modelId:selectedModel,webEnabled:web});data.chats.unshift(c);if(ui.chatId===targetId){ui.chatId=c.id;ui.view='chat';}}
    const j=await write(`/api/chats/${encodeURIComponent(c.id)}/jobs`,'POST',{content:message,modelId:selectedModel,web,attachments:attached});
    jobs.push(j);hydrateJob();await refresh(false);render();scrollChat();
  }catch(e){if(targetId)chatDrafts.set(targetId,{text:previousDraft,files:attached});if(ui.chatId===targetId||ui.chatId===null){ui.draft=previousDraft;ui.files=attached;}hydrateJob();toast(e.message,true);render();}
}
// Polling leggero: le generazioni rimangono sul server anche quando si cambia pagina.
let polling=false;
function jobsSnapshotDoneCandidate(j,old){return old.some(x=>x.id===j.id&&x.state!=='done');}
async function pollJobs(){if(polling)return;polling=true;try{
  const response=await fetchJSON('/api/jobs');const latest=response.jobs||[];
  const previousJobs=jobs;const previousStates=jobs.map(j=>`${j.id}:${j.state}`).join('|'),nextStates=latest.map(j=>`${j.id}:${j.state}`).join('|');
  const oldCurrent=activeJob(ui.chatId);const oldContent=oldCurrent?.text||'';
  jobs=latest;hydrateJob();
  if(previousStates!==nextStates){
    const justCompleted=latest.find(j=>j.state==='done'&&jobsSnapshotDoneCandidate(j, previousJobs));
    await refresh(false);
    if(justCompleted?.chatId===ui.chatId){
      const last=data.chats.find(c=>c.id===justCompleted.chatId)?.messages?.at(-1);
      if(last?.role==='assistant'&&last.content&&!(last.choices)){
        messageReveal={chatId:justCompleted.chatId,messageId:last.id,full:last.content,sources:last.sources||[],count:Math.min(typingChars,last.content.length)};
      }
    }
    render();if(messageReveal)animateFinalResponse();
  }
  else if(ui.view==='chat'&&activeJob(ui.chatId)){
    if(ui.streamText!==oldContent){updateStream();}
    const el=document.getElementById('streaming-status');if(el&&ui.streamStatus&&!ui.streamText)el.innerHTML=`<span class="dots"><i></i><i></i><i></i></span><span class="status-label">${esc(streamingIndicator())}</span>`;
    const node=document.getElementById('stream-sources');if(node&&!node.firstElementChild&&ui.streamSources.length)node.innerHTML=sourceCards(ui.streamSources);
    const webNode=document.getElementById('stream-web');if(webNode)webNode.innerHTML=webIndicator(ui.streamWeb);
  }
}catch(e){console.warn('Polling NEXA:',e.message);}finally{polling=false;}}
function exportChat(id){const c=data.chats.find(x=>x.id===id);if(!c)return;const lines=['# '+c.title,'','Esportata da Nexa · '+new Date().toLocaleDateString('it-IT'),''];for(const m of c.messages){lines.push('## '+(m.role==='user'?'Utente':'Assistente'),' ',m.role==='assistant'?expandSourceCitations(m.content,m.sources):m.content,'');if(m.attachments?.length)lines.push('Allegati: '+m.attachments.map(x=>x.name).join(', '),'');if(m.sources?.length)lines.push('Fonti:',...m.sources.map((s,i)=>`- [${i+1}] ${s.title}: ${s.url}`),'');}const blob=new Blob([lines.join('\n')],{type:'text/markdown;charset=utf-8'}),u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=(c.title.replace(/[^a-z0-9àèéìòù_-]/gi,'_').slice(0,52)||'chat')+'.md';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),500);toast('Conversazione esportata.');}
async function copy(text){try{await navigator.clipboard.writeText(text);toast('Copiato negli appunti.');}catch{toast('Impossibile copiare automaticamente.',true);}}
async function readFiles(files){for(const f of [...files].slice(0,4-ui.files.length)){if(f.size>10*1024*1024){toast('File troppo grande: massimo 10 MB.',true);continue;}if(!/\.(txt|md|csv|json|jsx?|tsx?|py|html|css|xml|log|ya?ml|sql|sh|bat|java|c|cpp|h|cs|go|rs|php|rb|toml|ini)$/i.test(f.name)){toast(`Formato non supportato: ${f.name}. Per ora usa file di testo.`,true);continue;}try{const content=(await f.text()).slice(0,35000);if(!content.trim()){toast('File vuoto: '+f.name,true);continue;}ui.files.push({name:f.name,text:content});}catch{toast('Impossibile leggere '+f.name,true);}}render();document.getElementById('prompt')?.focus();}
function setPrompt(text){ui.draft=text;render();const area=document.getElementById('prompt');area?.focus();area?.setSelectionRange(text.length,text.length);}
async function runAction(action,el){const id=el.dataset.id;
  try{
    switch(action){
      case 'home':go('home');break;case 'plugins':go('plugins');break;case 'all':go('all');break;case 'search':go('search');setTimeout(()=>document.getElementById('search-input')?.focus(),10);break;
      case 'open-project':ui.projectFlyoutId=id;go('project',{projectId:id});break;case 'project-flyout':{ui.projectFlyoutId=ui.projectFlyoutId===id?null:id;render();break;}case 'open-chat':go('chat',{chatId:id});break;
      case 'new-chat':await newChat(el.dataset.project||null);break;
      case 'new-project':ui.projectFlyoutId=null;ui.iconPicker=false;ui.iconSearch='';ui.modal={type:'new-project',color:'blue',icon:'folder'};render();document.querySelector('[name=name]')?.focus();break;
      case 'edit-project':ui.projectFlyoutId=null;ui.iconPicker=false;ui.iconSearch='';ui.modal={type:'edit-project',id};render();break;
      case 'delete-project':ui.modal={type:'delete-project',id};render();break;
      case 'rename-chat':ui.menu=null;ui.modal={type:'rename-chat',id};render();document.querySelector('[name=title]')?.focus();break;
      case 'move-chat':ui.menu=null;ui.modal={type:'move-chat',id};render();break;
      case 'delete-chat':ui.menu=null;ui.modal={type:'delete-chat',id};render();break;
      case 'export-chat':ui.menu=null;exportChat(id);render();break;
      case 'download-archive':{
        const cId=el.dataset.chatId;
        const url=`/api/chats/${encodeURIComponent(cId)}/artifacts/${encodeURIComponent(id)}.zip`;
        const response=await fetch(localApiUrl(url),{headers:localApiHeaders()});
        if(!response.ok)throw Error('Impossibile scaricare l’archivio: '+response.status);
        const blob=await response.blob(),href=URL.createObjectURL(blob),a=document.createElement('a');
        a.href=href;a.download='nexa-files.zip';document.body.appendChild(a);a.click();a.remove();
        setTimeout(()=>URL.revokeObjectURL(href),2000);break;
      }
      case 'close-modal':await flushProjectSave();ui.modal=null;ui.iconPicker=false;render();break;
      case 'settings':ui.projectFlyoutId=null;ui.modelPanel=false;ui.drawer=true;ui.settingsDraft={...data.settings};ui.webTest=null;render();break;
      case 'close-settings':await flushSettings();ui.drawer=false;ui.settingsDraft=null;render();break;
      case 'refresh-models':await refreshModels(true);break;
      case 'open-plugin-dialog':ui.pluginDialog={name:'',preset:false};render();document.getElementById('plugin-name')?.focus();break;
      case 'use-plugin-preset':{const preset=PLUGIN_PRESETS[Number(el.dataset.index)];if(preset){ui.pluginDialog={name:preset.name,preset:true};render();document.getElementById('plugin-url')?.focus();}break;}
      case 'close-plugin-dialog':ui.pluginDialog=null;render();break;
      case 'toggle-plugin':{const t=data.plugins?.find(t=>t.id===id);if(t){await write(`/api/plugins/${id}`,'PATCH',{enabled:!t.enabled});await refresh();}break;}
      case 'remove-plugin':await fetchJSON(`/api/plugins/${id}`,{method:'DELETE'});await refresh();break;
      case 'sidebar':ui.sidebar=true;render();break;case 'close-sidebar':ui.sidebar=false;render();break;
      case 'chat-menu':{const r=el.getBoundingClientRect();ui.menu={id,x:Math.max(10,Math.min(window.innerWidth-205,r.right-185)),y:Math.min(window.innerHeight-185,r.bottom+6)};render();break;}
      case 'close-menu':ui.menu=null;render();break;
      case 'toggle-select':{const box=el.closest('.rounded-select');const panel=box?.querySelector('.rounded-select-popover');if(panel){const opened=!panel.hidden;document.querySelectorAll('.rounded-select-popover').forEach(x=>x.hidden=true);panel.hidden=opened;el.setAttribute('aria-expanded',String(!opened));}break;}
      case 'choose-select':{const box=el.closest('.rounded-select'),field=el.dataset.field,value=el.dataset.value;const input=box?.querySelector('input[type="hidden"]');if(input)input.value=value;const label=box?.querySelector('.rounded-select-label');if(label)label.textContent=el.textContent.trim();box.querySelector('.rounded-select-popover').hidden=true;box.querySelectorAll('.rounded-option').forEach(b=>b.classList.toggle('chosen',b.dataset.value===value));if(ui.modal?.type==='edit-project'&&box.closest('#modal-form'))queueProjectSave();else if(box.closest('#settings-form')||box.closest('.model-panel')){if(!ui.settingsDraft)ui.settingsDraft={...data.settings};ui.settingsDraft[field]=value;data.settings[field]=value;queueSettingsSave();if(field==='accentColor'||field==='theme'){applyAppearance();setModelFavicon();}if(field==='searchProvider')render();}break;}
      case 'set-web-mode':{const enabled=el.dataset.value==='on';if(!ui.settingsDraft)ui.settingsDraft={...data.settings};ui.settingsDraft.webEnabled=enabled;data.settings.webEnabled=enabled;queueSettingsSave();render();break;}
      case 'toggle-model-panel':ui.modelPanel=!ui.modelPanel;ui.projectFlyoutId=null;render();break;case 'choose-model':ui.modelId=id;localStorage.setItem('nexa-model',ui.modelId);ui.modelPanel=false;if(ui.view==='chat'&&currentChat())write(`/api/chats/${ui.chatId}`,'PATCH',{modelId:ui.modelId}).catch(e=>toast(e.message,true));render();break;case 'toggle-recents':ui.recentCollapsed=!ui.recentCollapsed;localStorage.setItem('nexa-recents-hidden',ui.recentCollapsed?'1':'0');render();break;
      case 'remember-msg':{const c=currentChat(),m=c?.messages.find(x=>x.id===id);if(m){await write('/api/memory','POST',{projectId:c.projectId||null,note:m.content.slice(0,1000)});await refresh(false);toast('Messaggio salvato nella memoria.');}break;}
      case 'reset-icon':ui.modal.fields=Object.fromEntries(new FormData(document.getElementById('modal-form')));ui.modal.icon='folder';queueProjectSave();render();break;
      case 'choose-icon':ui.modal.fields=Object.fromEntries(new FormData(document.getElementById('modal-form')));ui.modal.icon=el.dataset.icon;ui.iconPicker=false;queueProjectSave();render();break;case 'toggle-icon-picker':ui.modal.fields=Object.fromEntries(new FormData(document.getElementById('modal-form')));ui.iconPicker=!ui.iconPicker;render();break;
      case 'toggle-batch-choice':{
        const m=currentChat()?.messages.find(x=>x.id===id),qi=Number(el.dataset.questionIndex),idx=Number(el.dataset.index);
        const questions=m?.choices?.questions;
        if(ui.streaming||!Array.isArray(questions)||!Number.isInteger(qi)||qi<0||qi>=questions.length)break;
        const question=questions[qi];
        if(!Number.isInteger(idx)||idx<0||idx>=question.options.length)break;
        const c=currentChat();if(c.messages.slice(c.messages.indexOf(m)+1).some(x=>x.role==='user'))break;
        const selections=ui.choiceSelections[id]||{};
        const old=selections[qi]||[];
        selections[qi]=question.multiple?(old.includes(idx)?old.filter(n=>n!==idx):[...old,idx].sort((a,b)=>a-b)):[idx];
        ui.choiceSelections[id]=selections;
        render();break;
      }
      case 'submit-batch-choices':{
        const m=currentChat()?.messages.find(x=>x.id===id),qs=m?.choices?.questions;
        if(ui.streaming||!Array.isArray(qs)||!batchSelectionReady(id,qs))break;
        const c=currentChat();if(c.messages.slice(c.messages.indexOf(m)+1).some(x=>x.role==='user'))break;
        const choices=ui.choiceSelections[id]||{},customs=ui.choiceCustoms[id]||{};
        const lines=qs.map((q,i)=>{
          const picked=(choices[i]||[]).map(index=>q.options[index]).filter(Boolean);
          const custom=customs[i]?.trim();
          return `${i+1}. ${q.question}\nRisposta: ${[...picked,...(custom?[custom]:[])].join('; ')}`;
        });
        ui.draft=`Risposte alle tue domande:\n${lines.join('\n\n')}`;
        delete ui.choiceSelections[id];delete ui.choiceCustoms[id];await send();break;
      }
      case 'toggle-choice':{
        const c=currentChat(),m=c?.messages.find(x=>x.id===id),idx=Number(el.dataset.index);
        if(!m?.choices||Array.isArray(m.choices.questions)||!Number.isInteger(idx)||idx<0||idx>=m.choices.options.length||ui.streaming)break;
        if(c.messages.slice(c.messages.indexOf(m)+1).some(x=>x.role==='user'))break;
        const selected=ui.choiceSelections[id]||[];
        ui.choiceSelections[id]=m.choices.multiple?(selected.includes(idx)?selected.filter(i=>i!==idx):[...selected,idx].sort((a,b)=>a-b)):[idx];
        render();break;
      }
      case 'submit-choices':{
        const c=currentChat(),m=c?.messages.find(x=>x.id===id),selected=ui.choiceSelections[id]||[],custom=ui.choiceCustoms[id]?.[0]?.trim()||'';
        if(ui.streaming||!m?.choices||Array.isArray(m.choices.questions))break;
        if(c.messages.slice(c.messages.indexOf(m)+1).some(x=>x.role==='user'))break;
        const picked=selected.map(i=>m.choices.options[i]).filter(Boolean);
        if(!picked.length&&!custom)break;
        ui.draft=`Risposta alla tua domanda «${m.choices.question}»: ${[...picked,...(custom?[custom]:[])].join('; ')}`;
        delete ui.choiceSelections[id];delete ui.choiceCustoms[id];await send();break;
      }
      case 'suggest':setPrompt(el.dataset.prompt||'');break;
      
      case 'test-web':{
        if(ui.webTest?.pending)break;
        ui.webTest={pending:true};render();
        try{ui.webTest=await write('/api/web/test','POST',ui.settingsDraft||{});}
        catch(err){ui.webTest={ok:false,error:err.message};}
        render();break;
      }
      case 'attach':document.getElementById('file-input')?.click();break;
      case 'remove-file':ui.files.splice(Number(el.dataset.index),1);render();break;
      case 'send':await send();break;
      case 'stop':{const j=activeJob(ui.chatId);if(j)await fetchJSON(`/api/jobs/${j.id}`,{method:'POST'});await pollJobs();break;}
      case 'jump-bottom':scrollChat(true);break;
      case 'copy-msg':{const c=currentChat();const m=c?.messages.find(x=>x.id===id);if(m)await copy(m.role==='assistant'?expandSourceCitations(m.content,m.sources):m.content);break;}
      case 'copy-code':await copy(decodeURIComponent(el.dataset.value));break;
      case 'color':ui.modal.fields=Object.fromEntries(new FormData(document.getElementById('modal-form')));ui.modal.color=el.dataset.color;queueProjectSave();render();break;
      default:break;
    }
  }catch(e){toast(e.message,true);console.error(e);}
}
document.addEventListener('wheel',e=>{
  if(e.target.closest('#chat-scroll') && e.deltaY<0){ui.followOutput=false;syncFollowButton();}
},{passive:true,capture:true});
document.addEventListener('scroll',e=>{
  const el=e.target;
  if(el?.id!=='chat-scroll')return;
  if(isNearBottom(el))ui.followOutput=true;
  else if(el.scrollTop < (Number(el.dataset.previousTop)||0)-1)ui.followOutput=false;
  el.dataset.previousTop=String(el.scrollTop);
  syncFollowButton();
},true);
document.addEventListener('click',event=>{const el=event.target.closest('[data-action]');if(el){event.preventDefault();runAction(el.dataset.action,el);return;}if(event.target.matches('[data-overlay="plugin"]')){ui.pluginDialog=null;render();return;}if(event.target.matches('[data-overlay="modal"]')){flushProjectSave().catch(e=>toast(e.message,true));ui.modal=null;render();}if(event.target.matches('[data-overlay="drawer"]')){flushSettings().catch(e=>toast(e.message,true));ui.drawer=false;render();}if(ui.modelPanel){if(ui.modelPanel&&event.target.closest('.model-panel'))return;ui.modelPanel=false;render();}});
document.addEventListener('input',e=>{
  if(e.target.matches('[data-choice-custom]')){
    const id=e.target.dataset.choiceCustom, qi=Number(e.target.dataset.questionIndex);
    if(!ui.choiceCustoms[id])ui.choiceCustoms[id]={};
    ui.choiceCustoms[id][qi]=e.target.value;
    const message=currentChat()?.messages.find(x=>x.id===id);
    const batchButton=e.target.closest('.choice-batch')?.querySelector('[data-action="submit-batch-choices"]');
    if(batchButton&&message?.choices?.questions)batchButton.disabled=!batchSelectionReady(id,message.choices.questions);
    const singleButton=e.target.closest('.choice-card:not(.choice-batch)')?.querySelector('[data-action="submit-choices"]');
    if(singleButton&&message?.choices&&!message.choices.questions)singleButton.disabled=!(ui.choiceSelections[id]?.length||e.target.value.trim());
  }
  else if(e.target.id==='prompt'){ui.draft=e.target.value;e.target.style.height='auto';e.target.style.height=Math.min(e.target.scrollHeight,210)+'px';const sendButton=document.querySelector('.send-button:not(.stop)');if(sendButton)sendButton.disabled=!ui.draft.trim()||!ui.modelId;}
  else if(e.target.id==='search-input'){ui.query=e.target.value;const caret=e.target.selectionStart;render();const input=document.getElementById('search-input');if(input){input.focus();input.setSelectionRange(caret,caret);}}
  else if(e.target.closest('#settings-form')||e.target.classList.contains('model-config')){const t=e.target;if(!ui.settingsDraft)ui.settingsDraft={...data.settings};if(t.name){ui.settingsDraft[t.name]=t.type==='range'?Number(t.value):t.value;data.settings[t.name]=ui.settingsDraft[t.name];queueSettingsSave();}if(t.name==='temperature'){const n=document.getElementById('temp-value');if(n)n.textContent=Number(t.value).toFixed(1);}}else if(e.target.id==='icon-search'){ui.iconSearch=e.target.value;const buttons=document.querySelectorAll('.line-icon-grid button');buttons.forEach(b=>b.hidden=!projectIconMatches(b.dataset.icon,ui.iconSearch));}else if(e.target.closest('#modal-form')&&ui.modal?.type==='edit-project'){queueProjectSave();}
});
document.addEventListener('change',e=>{if(e.target.id==='model-select'){ui.modelId=e.target.value;localStorage.setItem('nexa-model',ui.modelId);if(ui.view==='chat'&&currentChat())write(`/api/chats/${ui.chatId}`,'PATCH',{modelId:ui.modelId}).catch(err=>toast(err.message,true));render();}if(e.target.id==='file-input')readFiles(e.target.files);if(e.target.id==='search-provider'){ui.settingsDraft.searchProvider=e.target.value;queueSettingsSave();render();}if(e.target.closest('#settings-form')&&e.target.name&&e.target.name!=='searchProvider'){queueSettingsSave();if(['theme','accentColor'].includes(e.target.name)){applyAppearance();}}if(e.target.closest('#modal-form')&&ui.modal?.type==='edit-project'){queueProjectSave();}});
document.addEventListener('submit',async e=>{
  if(e.target.id==='modal-form'){
    e.preventDefault();const m=ui.modal;if(!m)return;const fields=Object.fromEntries(new FormData(e.target));
    try{
      if(m.type==='new-project'){fields.color=m.color;fields.icon=m.icon||'folder';const p=await write('/api/projects','POST',fields);await refresh(false);ui.modal=null;go('project',{projectId:p.id});toast('Progetto creato.');}
      else if(m.type==='edit-project'){await flushProjectSave();ui.modal=null;render();}
      else if(m.type==='rename-chat'){await write('/api/chats/'+m.id,'PATCH',{title:fields.title});await refresh(false);ui.modal=null;render();toast('Chat rinominata.');}
      else if(m.type==='move-chat'){await write('/api/chats/'+m.id,'PATCH',{projectId:fields.projectId||null});await refresh(false);ui.modal=null;render();toast('Conversazione spostata.');}
      else if(m.type==='delete-chat'){await fetchJSON('/api/chats/'+m.id,{method:'DELETE'});await refresh(false);ui.modal=null;if(ui.chatId===m.id)go('all');else render();toast('Conversazione eliminata.');}
      else if(m.type==='delete-project'){await fetchJSON('/api/projects/'+m.id,{method:'DELETE'});await refresh(false);ui.modal=null;if(ui.projectId===m.id)go('home');else render();toast('Progetto eliminato. Le chat sono conservate.');}
    }catch(err){toast(err.message,true);}return;
  }
  if(e.target.id==='plugin-form'){e.preventDefault();try{const fields=Object.fromEntries(new FormData(e.target));await write('/api/plugins','POST',fields);ui.pluginDialog=null;await refresh();toast('Configurazione salvata.');}catch(err){toast(err.message,true);}return;}
  if(e.target.id==='settings-form'){e.preventDefault();try{await flushSettings();ui.drawer=false;ui.settingsDraft=null;render();}catch(err){toast(err.message,true);}}
});
document.addEventListener('keydown',e=>{
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();newChat(ui.view==='project'?ui.projectId:null).catch(err=>toast(err.message,true));}
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='f'&&!e.target.matches('input,textarea')){e.preventDefault();go('search');document.getElementById('search-input')?.focus();}
  if(e.key==='Enter'&&!e.shiftKey&&e.target.id==='prompt'&&!e.isComposing){e.preventDefault();send().catch(err=>toast(err.message,true));}
  if(e.key==='Escape'){if(ui.pluginDialog){ui.pluginDialog=null;}else if(ui.modal){flushProjectSave().catch(e=>toast(e.message,true));ui.modal=null;}else if(ui.drawer){flushSettings().catch(e=>toast(e.message,true));ui.drawer=false;}else if(ui.modelPanel)ui.modelPanel=false;else if(ui.projectFlyoutId)ui.projectFlyoutId=null;else if(ui.menu)ui.menu=null;else if(ui.sidebar)ui.sidebar=false;else return;render();}
});
// Drag-and-drop of readable text files directly onto the composer.
document.addEventListener('dragover',e=>{if(e.dataTransfer?.types?.includes('Files'))e.preventDefault();});
document.addEventListener('drop',e=>{if(e.dataTransfer?.files?.length){e.preventDefault();readFiles(e.dataTransfer.files);}});
// Reorder projects with a clear white insertion indicator and persistent server order.
let draggedProject=null;
function clearProjectDrop(){document.querySelectorAll('.project-drop-before,.project-drop-after').forEach(el=>el.classList.remove('project-drop-before','project-drop-after'));}
document.addEventListener('dragstart',e=>{
 const group=e.target.closest('[data-project-drag]');if(!group)return;
 draggedProject=group.dataset.projectDrag;
 e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',draggedProject);
 group.classList.add('project-dragging');
});
document.addEventListener('dragover',e=>{
 if(!draggedProject)return;
 const group=e.target.closest('[data-project-drag]');if(!group||group.dataset.projectDrag===draggedProject)return;
 e.preventDefault();clearProjectDrop();const upper=e.clientY<group.getBoundingClientRect().top+group.getBoundingClientRect().height/2;
 group.classList.add(upper?'project-drop-before':'project-drop-after');e.dataTransfer.dropEffect='move';
});
document.addEventListener('drop',async e=>{
 if(!draggedProject)return;
 e.preventDefault();const target=e.target.closest('[data-project-drag]');const source=draggedProject;draggedProject=null;clearProjectDrop();
 document.querySelectorAll('.project-dragging').forEach(el=>el.classList.remove('project-dragging'));
 if(!target||target.dataset.projectDrag===source)return;
 const ids=data.projects.map(p=>p.id),from=ids.indexOf(source),to=ids.indexOf(target.dataset.projectDrag);
 if(from<0||to<0)return;
 const before=e.clientY<target.getBoundingClientRect().top+target.getBoundingClientRect().height/2;
 ids.splice(from,1);const targetIndex=ids.indexOf(target.dataset.projectDrag);ids.splice(targetIndex+(before?0:1),0,source);
 try{await write('/api/projects/order','PUT',{ids});await refresh(false);render();}catch(err){toast(err.message,true);await refresh();}
});
document.addEventListener('dragend',()=>{draggedProject=null;clearProjectDrop();document.querySelectorAll('.project-dragging').forEach(el=>el.classList.remove('project-dragging'));});
function showPagesConnect(message=''){
  const stored=localStorage.getItem('nexa-pages-local-token')||'';
  app.innerHTML=`<div style="min-height:100vh;display:grid;place-items:center;background:#0c0e14;padding:24px;color:#eaeaf4;font:15px system-ui">
    <form id="nexa-pages-connect" style="width:min(440px,100%);border:1px solid #303042;border-radius:18px;background:#171822;padding:28px">
      <h1 style="color:#a69aff;margin-top:0">Nexa.</h1><h2>Collega il backend locale</h2>
      <p style="color:#b2b3c3;line-height:1.6">Avvia <b>AVVIA_NEXA_SENZA_TERMINALE.vbs</b> sul PC e inserisci la chiave generata da <b>CONFIGURA_PAGES.bat</b>. La chiave non viene inviata a GitHub.</p>
      ${message?`<p role="alert" style="color:#ff9696">${esc(message)}</p>`:''}
      <label for="nexa-pages-token">Chiave privata di collegamento</label>
      <input id="nexa-pages-token" type="password" autocomplete="off" required value="${esc(stored)}" placeholder="Incolla la tua chiave" style="display:block;margin:12px 0;width:100%;box-sizing:border-box;background:#0d0e14;border:1px solid #55556e;border-radius:9px;color:white;padding:12px">
      <button type="submit" style="width:100%;border:0;border-radius:9px;background:#9686ff;color:#101018;padding:13px;font-weight:700;cursor:pointer">Connetti Nexa</button>
      <p style="font-size:12px;color:#9292a7;margin-bottom:0">Il sito pubblico non contiene i tuoi dati né il modello AI. La connessione funziona soltanto da questo PC, con backend locale acceso e permesso del browser.</p>
    </form></div>`;
  document.getElementById('nexa-pages-connect').addEventListener('submit',async event=>{
    event.preventDefault();
    const secret=document.getElementById('nexa-pages-token').value.trim();
    if(!secret)return;
    nexaPrivateToken=secret;
    await bootstrap();
  });
}
async function bootstrap(){try{await refresh(false);jobs=(await fetchJSON('/api/jobs').catch(()=>({jobs:[]}))).jobs||[];hydrateJob();render();await refreshModels(false);localStorage.setItem('nexa-pages-local-token',nexaPrivateToken);const pollTimer=setInterval(pollJobs,1100);pollTimer.unref?.();}catch(e){showPagesConnect('Collegamento non riuscito: '+e.message+'. Verifica chiave, backend e autorizzazione della rete locale.');}}
showPagesConnect();

if(typeof window!=='undefined'){
 window.addEventListener('resize',()=>{if(ui.modelPanel)positionModelPanel();});
 window.addEventListener('scroll',()=>{if(ui.modelPanel)positionModelPanel();},true);
}
