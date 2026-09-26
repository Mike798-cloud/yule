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
 p1:['先确认袋上的K编号属于哪类旧业务，不要先猜为什么十几年没人取。','把2009旧站的刻盘登记格式和U-04编号放在一起看，再决定来源类型。','处理意见只需要与当前证据强度一致：来源虽能确认，但家属和用途还没有核完。'],
 p2:['先别看选项，先比较四次照片里哪些东西会因为换拍摄角度、换海报而消失，哪些不会。','需要一项来自固定建筑关系，另一项来自同一只抽屉本身留下的痕迹；两者应互相独立。','如果一个依据只靠人物、反光、颜色或上传时间，它不能证明四次记录对应的是同一组抽屉。'],
 p3:['先把人物身份完全放到一边，只看正门、主通道和后墙固定开口。','参考A能直接看出柜台在进门左前方、长架沿通道延伸；参考B只补充柜台前沿方向。','侧门只能落在后墙固定开口；剩下两件再用主通道是否被截断来排除。'],
 p4:['2013只是上传时间。先在原图里找蓝底服务牌、弧形木纹前台和2元/1元旧价签。','三个局部各自对应一份纸档；不要只看其中一份记录就下结论。','把服务牌、前台和价签各自的有效区间取交集，最后只会剩下一个年份。'],
 p5:['不要判断谁“说得像真的”，只记录每句话依赖的来源。','工作台只给发言编号。打开对应楼层，看它是本人在场、看过照片，还是听别人转述。','如果一条说法引用的是同一张照片，它不应被算成一次新的独立目击。'],
 p6:['这一步不要靠脸部相似。把四份来源当成彼此独立的记录。','把柜台称呼、家庭关系、旧雨衣和电池小票分别对应；完整姓名不会直接写在同一张纸上。','如果某个姓名只能解释其中一份资料，却不能同时解释称呼、家庭关系和来店目的，就先排除。'],
 p7:['文件名只是导出编号。先把“家里”“出门后”“桥头以后”三个空间阶段分开。','家中三张的内部先后在现有资料里无法精确确定；只需要让它们都出现在离家之前。','白鸽门口之后的几张可以靠公交站、桥和雨后街面形成连续路线。'],
 p8:['把照片顺序当成路标，但不要先假定道路名称；先确认离店后的几个空间节点。','施工公告只告诉你哪些路不能走、绕行口位于哪一侧；具体经过哪条便道还要和地图及照片节点相互吻合。','路线成立后，天气和照明只作为风险条件记录，不要把它们改写成新的路线节点。']
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
 const bar=document.createElement('div');bar.className='archive-viewbar';bar.innerHTML='<span>旧网页存档查看</span><div><button type="button" data-fit>适应屏幕</button><button type="button" data-original>原始大小</button></div>';frame.parentNode.insertBefore(bar,frame);
 let mode='fit';
 function apply(){const mobile=innerWidth<w+32;bar.hidden=!mobile;if(!mobile){root.style.transform='';root.style.transformOrigin='';root.style.width='';frame.style.height='';frame.style.width='';frame.style.overflow='';document.body.style.overflowX='';return}root.style.width=w+'px';if(mode==='fit'){const scale=Math.min(1,(innerWidth-8)/w);root.style.transform=`scale(${scale})`;root.style.transformOrigin='top left';frame.style.width='100%';frame.style.overflow='hidden';requestAnimationFrame(()=>frame.style.height=Math.ceil(root.scrollHeight*scale)+'px');document.body.style.overflowX='hidden'}else{root.style.transform='';root.style.transformOrigin='';frame.style.width=w+'px';frame.style.height='auto';frame.style.overflow='visible';document.body.style.overflowX='auto'}bar.querySelector('[data-fit]').classList.toggle('active',mode==='fit');bar.querySelector('[data-original]').classList.toggle('active',mode==='original')}
 bar.querySelector('[data-fit]').onclick=()=>{mode='fit';apply()};bar.querySelector('[data-original]').onclick=()=>{mode='original';apply()};addEventListener('resize',apply);if('ResizeObserver'in window){const ro=new ResizeObserver(()=>{if(mode==='fit'&&innerWidth<w+32){const scale=Math.min(1,(innerWidth-8)/w);frame.style.height=Math.ceil(root.scrollHeight*scale)+'px'}});ro.observe(root)}document.fonts?.ready?.then(apply).catch(()=>{});apply();
}

function setupScroll(){requestAnimationFrame(()=>{const y=state.scroll[page];if(Number.isFinite(y)&&!location.hash)scrollTo(0,y)});addEventListener('pagehide',()=>{state.scroll[page]=Math.round(scrollY);save()})}
function reset(){localStorage.removeItem(KEY);for(const k of LEGACY)localStorage.removeItem(k);location.href='index.html'}
window.Game={get,save,complete,setDiscovery,setIntro,setDraft,getDraft,refresh,reset,toast,countPuzzle,introCount};
addEventListener('storage',e=>{if(e.key===KEY){state=load();refresh();document.dispatchEvent(new CustomEvent('game-state-sync'))}});
document.addEventListener('DOMContentLoaded',()=>{setupArchiveViewport();const main=document.querySelector('main');if(main){if(!main.id)main.id='main-content';const skip=document.createElement('a');skip.className='skip-link';skip.href='#'+main.id;skip.textContent='跳到主要内容';document.body.prepend(skip)}document.querySelectorAll('.feedback').forEach(el=>{if(!el.hasAttribute('role'))el.setAttribute('role','status');if(!el.hasAttribute('aria-live'))el.setAttribute('aria-live','polite')});setupHints();setupImages();setupScroll();refresh();if(location.hash){requestAnimationFrame(()=>{const target=document.getElementById(location.hash.slice(1));if(target&&isActuallyVisible(target))target.scrollIntoView({block:'start'})})}document.querySelectorAll('[data-discover]').forEach(a=>a.addEventListener('click',()=>setDiscovery(a.dataset.discover)));document.querySelectorAll('[data-intro]').forEach(b=>b.addEventListener('click',()=>{setIntro(b.dataset.intro);toast('已记入今日整理')}));const auto=document.body.dataset.discoverOnLoad;if(auto)setDiscovery(auto)})
})();
