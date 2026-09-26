(()=>{'use strict';
const KEY='baige_rewind_v5_state';
const LEGACY=['baige_rewind_v4_state','baige_rewind_v3_state','baige_rewind_v2_state'];
const DEF={version:5,startedAt:null,lastPage:'index.html',p1:false,p2:false,p3:false,p4:false,p5:false,p6:false,p7:false,p8:false,introTasks:{poster:false,cards:false,games:false},discoveries:{xuqin:false,xuqinRead:false,culture:false,oldsite:false,forum:false,memorial:false,sdindex:false},photoNotes:{counter:false,group:false,route:false},endingReady:false,endingSeen:false,hints:{},scroll:{},notes:[],drafts:{}};
const clone=o=>JSON.parse(JSON.stringify(o));
function load(){try{let raw=localStorage.getItem(KEY);if(!raw){for(const k of LEGACY){const v=localStorage.getItem(k);if(v){raw=v;break}}}const s=raw?JSON.parse(raw):{};return {...clone(DEF),...s,version:5,introTasks:{...DEF.introTasks,...(s.introTasks||{})},discoveries:{...DEF.discoveries,...(s.discoveries||{})},photoNotes:{...DEF.photoNotes,...(s.photoNotes||{})},hints:{...(s.hints||{})},scroll:{...(s.scroll||{})},drafts:{...(s.drafts||{})}}}catch(e){return clone(DEF)}}
let state=load();if(!state.startedAt)state.startedAt=Date.now();if(state.p1)state.discoveries.xuqin=true;if(state.p2){state.discoveries.xuqinRead=true;state.discoveries.forum=true}if(state.p3||state.p4||state.p5)state.discoveries.memorial=true;if(state.p6)state.discoveries.sdindex=true;
const page=location.pathname.split('/').pop()||'index.html';state.lastPage=page;save();
function save(){localStorage.setItem(KEY,JSON.stringify(state))}
function toast(msg){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';t.setAttribute('role','status');t.setAttribute('aria-live','polite');document.body.appendChild(t)}t.textContent=msg;t.classList.add('show');clearTimeout(t._tm);t._tm=setTimeout(()=>t.classList.remove('show'),1800)}
function complete(id,note){if(!state[id]){state[id]=true;if(note&&!state.notes.includes(note))state.notes.push(note);if(id==='p2')state.photoNotes.counter=true;if(id==='p4')state.photoNotes.group=true;if(id==='p6')state.discoveries.sdindex=true;if(id==='p7')state.photoNotes.route=true;save();refresh();toast('整理记录已保存')}}
function setDiscovery(k,v=true){state.discoveries[k]=v;save();refresh()}
function setIntro(k){state.introTasks[k]=true;save();refresh()}
function setDraft(k,v){state.drafts[k]=v;save()}
function getDraft(k,fallback=null){return Object.prototype.hasOwnProperty.call(state.drafts,k)?state.drafts[k]:fallback}
function get(){return state}
function introCount(){return Object.values(state.introTasks).filter(Boolean).length}
function countPuzzle(){return ['p1','p2','p3','p4','p5','p6','p7','p8'].filter(k=>state[k]).length}
function refresh(){
 document.querySelectorAll('[data-state],[data-all-state],[data-not-state],[data-disc]').forEach(el=>{let visible=true;if(el.dataset.state)visible=visible&&!!state[el.dataset.state];if(el.dataset.allState){const ks=el.dataset.allState.split(',').map(x=>x.trim()).filter(Boolean);visible=visible&&ks.every(k=>state[k])}if(el.dataset.notState)visible=visible&&!state[el.dataset.notState];if(el.dataset.disc)visible=visible&&!!state.discoveries[el.dataset.disc];el.hidden=!visible});
 document.querySelectorAll('[data-intro]').forEach(el=>{const done=!!state.introTasks[el.dataset.intro];el.classList.toggle('success',done);el.setAttribute('aria-pressed',String(done));if(done)el.textContent=el.dataset.doneText||'已登记'});
 document.querySelectorAll('[data-intro-count]').forEach(el=>el.textContent=`${introCount()}/3`);
 document.querySelectorAll('[data-intro-complete]').forEach(el=>el.hidden=introCount()<3);
 document.querySelectorAll('[data-intro-incomplete]').forEach(el=>el.hidden=introCount()>=3);
 document.querySelectorAll('[data-progress-unclaimed]').forEach(el=>el.textContent=state.endingSeen?'0':'1');
 document.querySelectorAll('[data-puzzle-done]').forEach(el=>el.hidden=!state[el.dataset.puzzleDone]);
 document.querySelectorAll('[data-evidence-done]').forEach(el=>el.textContent=state[el.dataset.evidenceDone]?'已核':'待核');
 document.querySelectorAll('[data-all-done]').forEach(el=>{const ks=el.dataset.allDone.split(',').map(x=>x.trim()).filter(Boolean);el.textContent=ks.every(k=>state[k])?'已核':'待核'});
 document.querySelectorAll('[data-puzzle-count]').forEach(el=>el.textContent=String(countPuzzle()));
 document.querySelectorAll('[data-puzzle-total]').forEach(el=>el.textContent='8');
 if(state.endingSeen)document.documentElement.classList.add('ending-done');
}
const hints={
 p1:['K编号出现在旧业务登记规则中。','2009业务页保留了刻盘登记格式。','来源确认后，再看当前是否具备清仓条件。'],
 p2:['先看三条记录各自只确认了什么。','2017年的无主物箱登记和抽屉清点不是同一件事。','判断位置链是否真的在某一年断过。'],
 p3:['底图只画了不能移动的建筑部分。','参考影像没有写拍摄方向。','必要时可先从固定开口与通道宽度排除不合理位置。'],
 p4:['论坛附件页只确认上传时间。','三个局部各能在纸档里找到对应变化记录。','拍摄年份必须同时满足这些记录。'],
 p5:['旧帖里每句话的来源层级不同。','区分本人在场、看过照片和转述。','引用同一张照片的说法仍属于同一来源链。'],
 p6:['人物栏没有姓名。','四份材料来自不同来源。','称呼、家庭关系和来店记录可以交叉核对。'],
 p7:['文件名只是导出编号。','部分照片能从地点关系判断前后。','无法确定的内部先后不需要补写。'],
 p8:['联系表提供照片中的地点顺序。','施工公告和道路图提供可通行范围。','天气与照明记录属于风险条件，不是路线节点。']
};
function isActuallyVisible(el){if(!el)return false;if(el.hidden)return false;let cur=el.parentElement;while(cur){if(cur.hidden)return false;cur=cur.parentElement}return true}
function activePuzzle(){const h=(location.hash||'').replace('#','');if(hints[h])return h;const ids=(document.body.dataset.puzzles||document.body.dataset.puzzle||'').split(',').map(s=>s.trim()).filter(Boolean);for(const id of ids){if(state[id])continue;const section=document.querySelector(`[data-puzzle-section="${id}"]`);if(section&&!isActuallyVisible(section))continue;return id}return ''}
function setupHints(){
 const puzzleSpec=document.body.dataset.puzzles||document.body.dataset.puzzle||'';if(!puzzleSpec.trim())return;
 const host=document.querySelector('.menubar,.toolbar,.tools,.desk-menu,.album-nav,.route-nav')||document.querySelector('header')||document.body;
 const btn=document.createElement('button');btn.className='context-help';btn.type='button';btn.textContent='整理帮助';btn.setAttribute('aria-expanded','false');
 host.appendChild(btn);
 const panel=document.createElement('aside');panel.className='context-hint-panel';panel.hidden=true;panel.innerHTML='<div class="panel-head"><h3>整理备注</h3><button type="button" class="plain-button" data-close-hint>收起</button></div><div data-hint-content></div><p class="smallprint">只记录观察方向和操作方法，不代替资料判断。</p>';
 host.insertAdjacentElement('afterend',panel);
 const render=()=>{const id=activePuzzle(),area=panel.querySelector('[data-hint-content]');if(!id||!hints[id]){area.innerHTML='<p>当前页没有必须处理的整理项，可以按页面本来的用途浏览。</p>';return}const used=state.hints[id]||0;area.innerHTML=hints[id].map((h,i)=>`<div class="hint-step"><b>备注 ${i+1}</b>${i<used?`<p>${h}</p>`:`<button class="plain-button" data-reveal-hint="${i+1}" ${i>used?'disabled':''}>展开这一条</button>`}</div>`).join('');area.querySelectorAll('[data-reveal-hint]').forEach(b=>b.onclick=()=>{state.hints[id]=Number(b.dataset.revealHint);save();render()})};
 const close=()=>{panel.hidden=true;btn.setAttribute('aria-expanded','false')};btn.onclick=()=>{render();panel.hidden=!panel.hidden;btn.setAttribute('aria-expanded',String(!panel.hidden))};panel.querySelector('[data-close-hint]').onclick=close;
}
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

function setupScroll(){requestAnimationFrame(()=>{const y=state.scroll[page];if(Number.isFinite(y)&&!location.hash)scrollTo(0,y)});addEventListener('pagehide',()=>{state.scroll[page]=Math.round(scrollY);save()})}
function reset(){localStorage.removeItem(KEY);for(const k of LEGACY)localStorage.removeItem(k);location.href='index.html'}
window.Game={get,save,complete,setDiscovery,setIntro,setDraft,getDraft,refresh,reset,toast,countPuzzle,introCount};
addEventListener('storage',e=>{if(e.key===KEY){state=load();refresh();document.dispatchEvent(new CustomEvent('game-state-sync'))}});
document.addEventListener('DOMContentLoaded',()=>{setupArchiveViewport();const main=document.querySelector('main');if(main){if(!main.id)main.id='main-content';const skip=document.createElement('a');skip.className='skip-link';skip.href='#'+main.id;skip.textContent='跳到主要内容';document.body.prepend(skip)}document.querySelectorAll('.feedback').forEach(el=>{if(!el.hasAttribute('role'))el.setAttribute('role','status');if(!el.hasAttribute('aria-live'))el.setAttribute('aria-live','polite')});setupHints();setupImages();setupScroll();refresh();if(location.hash){requestAnimationFrame(()=>{const target=document.getElementById(location.hash.slice(1));if(target&&isActuallyVisible(target))target.scrollIntoView({block:'start'})})}document.querySelectorAll('[data-discover]').forEach(a=>a.addEventListener('click',()=>setDiscovery(a.dataset.discover)));document.querySelectorAll('[data-intro]').forEach(b=>b.addEventListener('click',()=>{setIntro(b.dataset.intro);toast('已记入今日整理')}));const auto=document.body.dataset.discoverOnLoad;if(auto)setDiscovery(auto)})
})();
