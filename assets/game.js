(()=>{'use strict';
const KEY='baige_rewind_v6_state';
const LEGACY=['baige_rewind_v5_state','baige_rewind_v4_state','baige_rewind_v3_state','baige_rewind_v2_state'];
const DEF={version:6,startedAt:null,lastPage:'index.html',p1:false,p2:false,p3:false,p4:false,p5:false,p6:false,p7:false,p8:false,discoveries:{xuqin:false,xuqinRead:false,culture:false,oldsite:false,forum:false,memorial:false,accident:false,sdindex:false},photoNotes:{counter:false,group:false,route:false},endingReady:false,endingSeen:false,hints:{},scroll:{},notes:[],drafts:{}};
const clone=o=>JSON.parse(JSON.stringify(o));
function load(){try{let raw=localStorage.getItem(KEY),fromLegacy=false;if(!raw){for(const k of LEGACY){const v=localStorage.getItem(k);if(v){raw=v;fromLegacy=true;break}}}const s=raw?JSON.parse(raw):{};const merged={...clone(DEF),...s,version:6,discoveries:{...DEF.discoveries,...(s.discoveries||{})},photoNotes:{...DEF.photoNotes,...(s.photoNotes||{})},hints:{...(s.hints||{})},scroll:{...(s.scroll||{})},drafts:{...(s.drafts||{})}};if(fromLegacy){merged.p7=false;merged.p8=false;merged.endingReady=false;merged.endingSeen=false;delete merged.drafts.p7order;delete merged.drafts.p8path}return merged}catch(e){return clone(DEF)}}
let state=load();if(!state.startedAt)state.startedAt=Date.now();if(state.p1)state.discoveries.xuqin=true;if(state.p2)state.discoveries.xuqinRead=true;if(state.p3)state.discoveries.forum=true;if(state.p3||state.p4||state.p5)state.discoveries.memorial=true;if(state.p6)state.discoveries.sdindex=true;
const _parts=location.pathname.split('/').filter(Boolean);const _subdirs=new Set(['oldsite','album','route']);const page=_subdirs.has(_parts[_parts.length-2])?_parts.slice(-2).join('/'):(_parts[_parts.length-1]||'index.html');const ROOT_PREFIX=_subdirs.has(_parts[_parts.length-2])?'../':'';state.lastPage=page;save();
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));return true}catch(e){return false}}
function toast(msg){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';t.setAttribute('role','status');t.setAttribute('aria-live','polite');document.body.appendChild(t)}t.textContent=msg;t.classList.add('show');clearTimeout(t._tm);t._tm=setTimeout(()=>t.classList.remove('show'),1800)}
function complete(id,note){if(!state[id]){state[id]=true;if(note&&!state.notes.includes(note))state.notes.push(note);if(id==='p2')state.photoNotes.counter=true;if(id==='p4')state.photoNotes.group=true;if(id==='p6')state.discoveries.sdindex=true;if(id==='p7')state.photoNotes.route=true;save();refresh();toast('本机记录已保存')}}
function setDiscovery(k,v=true){state.discoveries[k]=v;save();refresh()}
function setDraft(k,v){state.drafts[k]=v;save()}
function getDraft(k,fallback=null){return Object.prototype.hasOwnProperty.call(state.drafts,k)?state.drafts[k]:fallback}
function get(){return state}
function countPuzzle(){return ['p1','p2','p3','p4','p5','p6','p7','p8'].filter(k=>state[k]).length}
function refresh(){
 document.querySelectorAll('[data-state],[data-all-state],[data-not-state],[data-disc],[data-not-disc]').forEach(el=>{let visible=true;if(el.dataset.state)visible=visible&&!!state[el.dataset.state];if(el.dataset.allState){const ks=el.dataset.allState.split(',').map(x=>x.trim()).filter(Boolean);visible=visible&&ks.every(k=>state[k])}if(el.dataset.notState)visible=visible&&!state[el.dataset.notState];if(el.dataset.disc)visible=visible&&!!state.discoveries[el.dataset.disc];if(el.dataset.notDisc)visible=visible&&!state.discoveries[el.dataset.notDisc];el.hidden=!visible});
 document.querySelectorAll('[data-progress-unclaimed]').forEach(el=>el.textContent=state.endingSeen?'0':'1');
 document.querySelectorAll('[data-puzzle-done]').forEach(el=>el.hidden=!state[el.dataset.puzzleDone]);
 document.querySelectorAll('[data-puzzle-count]').forEach(el=>el.textContent=String(countPuzzle()));
 document.querySelectorAll('[data-puzzle-total]').forEach(el=>el.textContent='8');
 if(state.endingSeen)document.documentElement.classList.add('ending-done');
}
function isActuallyVisible(el){if(!el)return false;if(el.hidden)return false;let cur=el.parentElement;while(cur){if(cur.hidden)return false;cur=cur.parentElement}return true}
function setupTop(){const b=document.createElement('button');b.className='to-top';b.type='button';b.textContent='↑';b.setAttribute('aria-label','回到顶部');document.body.appendChild(b);addEventListener('scroll',()=>b.style.display=scrollY>700?'block':'none');b.onclick=()=>scrollTo({top:0,behavior:'smooth'})}
function setupImages(){document.querySelectorAll('img').forEach(img=>{if(!img.hasAttribute('loading'))img.loading='lazy';img.addEventListener('error',()=>{if(img.dataset.failed)return;img.dataset.failed='1';const p=document.createElement('p');p.className='feedback show bad';p.innerHTML='图片暂时没有加载出来。 <button type="button" class="plain-button">重试</button>';img.after(p);p.querySelector('button').onclick=()=>{img.dataset.failed='';p.remove();const s=img.src;img.src='';setTimeout(()=>img.src=s,30)}})})}

function setupArchiveViewport(){
 const w=Number(document.body.dataset.archiveWidth||0);if(!w)return;
 const root=document.querySelector('[data-archive-root]')||document.body.firstElementChild;if(!root)return;
 const frame=document.createElement('div');frame.className='archive-fit-frame';root.parentNode.insertBefore(frame,root);frame.appendChild(root);
 const bar=document.createElement('div');bar.className='archive-viewbar';bar.innerHTML='<span>显示比例</span><div><button type="button" data-fit>适应屏幕</button><button type="button" data-original>原始大小</button></div>';frame.parentNode.insertBefore(bar,frame);
 let mode='fit';
 function apply(){const mobile=innerWidth<w+32;bar.hidden=!mobile;document.body.classList.toggle('archive-readable',mobile&&mode==='fit');if(!mobile){root.style.transform='';root.style.transformOrigin='';root.style.width='';frame.style.height='';frame.style.width='';frame.style.overflow='';document.body.style.overflowX='';return}if(mode==='fit'){root.style.width='';root.style.transform='';root.style.transformOrigin='';frame.style.width='100%';frame.style.height='auto';frame.style.overflow='hidden';document.body.style.overflowX='hidden'}else{root.style.width=w+'px';root.style.transform='';root.style.transformOrigin='';frame.style.width=w+'px';frame.style.height='auto';frame.style.overflow='visible';document.body.style.overflowX='auto'}bar.querySelector('[data-fit]').classList.toggle('active',mode==='fit');bar.querySelector('[data-original]').classList.toggle('active',mode==='original')}
 bar.querySelector('[data-fit]').onclick=()=>{mode='fit';apply()};bar.querySelector('[data-original]').onclick=()=>{mode='original';apply()};addEventListener('resize',apply);document.fonts?.ready?.then(apply).catch(()=>{});apply();
}

function setupWindowLinks(){
 const systemTarget=a=>{const href=a.getAttribute('href')||'';let path='';try{path=new URL(href,location.href).pathname.toLowerCase()}catch(_){path=href.toLowerCase()}const file=(path.split('/').pop()||'').split('#')[0];if(path.includes('/album/')||path.startsWith('album/')||file==='album.html')return'baige_album';if(path.includes('/oldsite/')||path.startsWith('oldsite/')||file==='oldsite.html')return'baige_oldsite';if(file==='forum.html'||file==='thread-baige.html')return'baige_forum';if(file.startsWith('culture'))return'baige_culture';if(path.includes('/route/')||path.startsWith('route/')||file==='route.html')return'baige_route';if(file==='workbench.html'||file==='paper-records.html'||file==='settings.html')return'baige_records';if(file==='hexi-evening-20090817.html')return'baige_news';if(file==='guestbook.html'||file==='guestbook-older.html')return'baige_guestbook';if(file==='ending.html'||file==='thanks.html')return'baige_case';return'baige_reference'};
 document.querySelectorAll('[data-system-window]').forEach(a=>{a.target=systemTarget(a);a.rel='opener'});
 document.querySelectorAll('[data-return-home]').forEach(a=>a.addEventListener('click',e=>{try{if(window.opener&&!window.opener.closed){e.preventDefault();window.opener.focus();window.close();setTimeout(()=>{if(!window.closed)location.href=ROOT_PREFIX+'index.html'},120)}}catch(_){}}));
}
function setupScroll(){requestAnimationFrame(()=>{const y=state.scroll[page];if(Number.isFinite(y)&&!location.hash)scrollTo(0,y)});addEventListener('pagehide',()=>{state.scroll[page]=Math.round(scrollY);save()})}
function reset(){try{localStorage.removeItem(KEY);for(const k of LEGACY)localStorage.removeItem(k)}catch(e){}location.href=ROOT_PREFIX+'index.html'}
window.Game={get,save,complete,setDiscovery,setDraft,getDraft,refresh,reset,toast,countPuzzle};
addEventListener('storage',e=>{if(e.key===KEY){state=load();refresh();document.dispatchEvent(new CustomEvent('game-state-sync'))}});
document.addEventListener('DOMContentLoaded',()=>{setupWindowLinks();setupArchiveViewport();const main=document.querySelector('main');if(main){if(!main.id)main.id='main-content';const skip=document.createElement('a');skip.className='skip-link';skip.href='#'+main.id;skip.textContent='跳到主要内容';document.body.prepend(skip)}document.querySelectorAll('.feedback').forEach(el=>{if(!el.hasAttribute('role'))el.setAttribute('role','status');if(!el.hasAttribute('aria-live'))el.setAttribute('aria-live','polite')});setupImages();setupScroll();refresh();if(location.hash){requestAnimationFrame(()=>{const target=document.getElementById(location.hash.slice(1));if(target&&isActuallyVisible(target))target.scrollIntoView({block:'start'})})}document.querySelectorAll('[data-discover]').forEach(a=>a.addEventListener('click',()=>setDiscovery(a.dataset.discover)));const auto=document.body.dataset.discoverOnLoad;if(auto)setDiscovery(auto)})
})();
