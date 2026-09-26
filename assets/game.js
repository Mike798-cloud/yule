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
 p2:['这一项不是认颜色。先比较四次记录里哪些关系不受拍摄角度和曝光影响。','把“柜台相对固定开口的位置”和随柜台一起保留的物理标记分开看，再判断能否连续对应。','如果一种判断只靠反光、颜色或照片风格，它就不适合作为跨年份定位基准。'],
 p3:['先找图纸里不会随货架搬动而改变的东西，例如固定开口、窗和墙体。','把旧照中的视线方向和图纸的固定结构对上，再放可移动的柜台和长架。','如果仍然混乱，先确定侧门对应哪个固定开口；剩下两件再用窗线和过道宽度区分。'],
 p4:['论坛上传于2013，只能证明文件在2013出现，不能证明照片在2013拍。','把照片里的店内状态分别与促销单、柜台更换记录和租价变更记录对照。','三份来源应该把年份夹在同一小段时间里；不要用服装“看起来像哪年”这种主观判断。'],
 p5:['不要判断谁“说得像真的”，只记录每句话依赖的来源。','工作台只给发言编号。打开对应楼层，看它是本人在场、看过照片，还是听别人转述。','如果一条说法引用的是同一张照片，它不应被算成一次新的独立目击。'],
 p6:['这一步不要靠脸部相似。把四份来源当成四张独立小票据。','先确认2011年“许家小孩”是谁，再看蓝雨衣和相机电池是否都能落到同一个人身上。','如果某个姓名只能解释照片外貌，却解释不了会员补录、买电池和来店目的，就先排除。'],
 p7:['文件名只是导出编号。先把“家里”“出门后”“桥头以后”三个空间阶段分开。','家中三张的内部先后在现有资料里无法精确确定；只需要让它们都出现在离家之前。','白鸽门口之后的几张可以靠公交站、桥和雨后街面形成连续路线。'],
 p8:['这里不是再把上面的公告抄一遍，而是判断哪条路线仍符合三份公开资料。','先排除穿过施工封闭段的走法，再看官方临时便道与照片顺序是否一致。','路线确定后，暴雨和照明故障只作为风险条件记录，不需要再补一个“神秘原因”。']
};
function isActuallyVisible(el){if(!el)return false;if(el.hidden)return false;let cur=el.parentElement;while(cur){if(cur.hidden)return false;cur=cur.parentElement}return true}
function activePuzzle(){const h=(location.hash||'').replace('#','');if(hints[h])return h;const ids=(document.body.dataset.puzzles||document.body.dataset.puzzle||'').split(',').map(s=>s.trim()).filter(Boolean);for(const id of ids){if(state[id])continue;const section=document.querySelector(`[data-puzzle-section="${id}"]`);if(section&&!isActuallyVisible(section))continue;return id}return ''}
function setupHints(){const btn=document.createElement('button');btn.className='hint-button';btn.type='button';btn.textContent='?';btn.setAttribute('aria-label','提示');document.body.appendChild(btn);const panel=document.createElement('aside');panel.className='hint-panel';panel.innerHTML='<div class="panel-head"><h3>整理提示</h3><button type="button" class="plain-button" data-close-hint>关闭</button></div><div data-hint-content></div><p class="smallprint">提示只说明观察方向与操作方法，不直接替你完成判断。</p>';document.body.appendChild(panel);const render=()=>{const id=activePuzzle(),area=panel.querySelector('[data-hint-content]');if(!id||!hints[id]){area.innerHTML='<p>这页没有当前必须处理的整理项，可以按页面本来的用途浏览。</p>';return}const used=state.hints[id]||0;area.innerHTML=hints[id].map((h,i)=>`<div class="hint-step"><b>提示 ${i+1}</b>${i<used?`<p>${h}</p>`:`<button class="plain-button" data-reveal-hint="${i+1}" ${i>used?'disabled':''}>查看这一层</button>`}</div>`).join('');area.querySelectorAll('[data-reveal-hint]').forEach(b=>b.onclick=()=>{state.hints[id]=Number(b.dataset.revealHint);save();render()})};btn.onclick=()=>{render();panel.classList.toggle('open')};panel.querySelector('[data-close-hint]').onclick=()=>panel.classList.remove('open')}
function setupTop(){const b=document.createElement('button');b.className='to-top';b.type='button';b.textContent='↑';b.setAttribute('aria-label','回到顶部');document.body.appendChild(b);addEventListener('scroll',()=>b.style.display=scrollY>700?'block':'none');b.onclick=()=>scrollTo({top:0,behavior:'smooth'})}
function setupImages(){document.querySelectorAll('img').forEach(img=>{if(!img.hasAttribute('loading'))img.loading='lazy';img.addEventListener('error',()=>{if(img.dataset.failed)return;img.dataset.failed='1';const p=document.createElement('p');p.className='feedback show bad';p.innerHTML='图片暂时没有加载出来。 <button type="button" class="plain-button">重试</button>';img.after(p);p.querySelector('button').onclick=()=>{img.dataset.failed='';p.remove();const s=img.src;img.src='';setTimeout(()=>img.src=s,30)}})})}
function setupScroll(){requestAnimationFrame(()=>{const y=state.scroll[page];if(Number.isFinite(y)&&!location.hash)scrollTo(0,y)});addEventListener('pagehide',()=>{state.scroll[page]=Math.round(scrollY);save()})}
function reset(){localStorage.removeItem(KEY);for(const k of LEGACY)localStorage.removeItem(k);location.href='index.html'}
window.Game={get,save,complete,setDiscovery,setIntro,setDraft,getDraft,refresh,reset,toast,countPuzzle,introCount};
addEventListener('storage',e=>{if(e.key===KEY){state=load();refresh();document.dispatchEvent(new CustomEvent('game-state-sync'))}});
document.addEventListener('DOMContentLoaded',()=>{const main=document.querySelector('main');if(main){if(!main.id)main.id='main-content';const skip=document.createElement('a');skip.className='skip-link';skip.href='#'+main.id;skip.textContent='跳到主要内容';document.body.prepend(skip)}document.querySelectorAll('.feedback').forEach(el=>{if(!el.hasAttribute('role'))el.setAttribute('role','status');if(!el.hasAttribute('aria-live'))el.setAttribute('aria-live','polite')});setupHints();setupTop();setupImages();setupScroll();refresh();if(location.hash){requestAnimationFrame(()=>{const target=document.getElementById(location.hash.slice(1));if(target&&isActuallyVisible(target))target.scrollIntoView({block:'start'})})}document.querySelectorAll('[data-discover]').forEach(a=>a.addEventListener('click',()=>setDiscovery(a.dataset.discover)));document.querySelectorAll('[data-intro]').forEach(b=>b.addEventListener('click',()=>{setIntro(b.dataset.intro);toast('已记入今日整理')}));const auto=document.body.dataset.discoverOnLoad;if(auto)setDiscovery(auto)})
})();
