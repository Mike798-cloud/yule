(()=>{
  const insp=document.getElementById('photoInspector');
  if(!insp)return;
  const img=document.getElementById('inspectorImage');
  const file=document.getElementById('inspectorFile');
  const group=document.getElementById('inspectorGroup');
  const note=document.getElementById('inspectorNote');
  const empty=document.getElementById('inspectorEmpty');
  const preview=document.getElementById('inspectorPreview');
  const fields=document.getElementById('inspectorFields');

  function ensureMetaRows(){
    if(!fields||document.getElementById('inspectorDimensions'))return;
    const rows=[['像素','inspectorDimensions'],['格式','inspectorFormat'],['归档状态','inspectorState']];
    rows.forEach(([label,id])=>{
      const dt=document.createElement('dt');dt.textContent=label;
      const dd=document.createElement('dd');dd.id=id;dd.textContent='—';
      fields.append(dt,dd);
    });
  }
  ensureMetaRows();

  function setDimensions(im){
    const dim=document.getElementById('inspectorDimensions');
    if(!dim)return;
    const apply=()=>{dim.textContent=(im.naturalWidth&&im.naturalHeight)?`${im.naturalWidth} × ${im.naturalHeight}`:'—'};
    if(im.complete)apply();else im.addEventListener('load',apply,{once:true});
  }

  function inspect(fig){
    document.querySelectorAll('.inspectable.selected').forEach(x=>x.classList.remove('selected'));
    fig.classList.add('selected');
    const im=fig.querySelector('img'),cap=fig.querySelector('figcaption');
    if(!im)return;
    empty.hidden=true;preview.hidden=false;fields.hidden=false;
    img.src=im.src;img.alt=im.alt||'选中照片预览';
    const src=im.getAttribute('src')||'';
    file.textContent=src.split('/').pop()||'—';
    group.textContent=document.querySelector('.browser-status span')?.textContent||'当前目录';
    note.textContent=cap?.textContent.trim()||im.alt||'—';
    document.getElementById('inspectorFormat').textContent=/\.png$/i.test(src)?'PNG':'JPEG';
    document.getElementById('inspectorState').textContent=fig.closest('.browser')?'本批可核':'已导入';
    setDimensions(im);
    if(innerWidth<=900)insp.classList.add('mobile-open');
  }

  document.getElementById('inspectorClose')?.addEventListener('click',()=>insp.classList.remove('mobile-open'));
  document.querySelectorAll('.filegrid figure,.photo-strip figure').forEach(fig=>{
    fig.classList.add('inspectable');fig.tabIndex=0;fig.setAttribute('role','button');fig.setAttribute('aria-label','查看照片属性');
    fig.addEventListener('click',()=>inspect(fig));
    fig.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();inspect(fig)}});
  });
  const first=document.querySelector('.filegrid figure,.photo-strip figure');
  if(first&&innerWidth>900)inspect(first);
})();
