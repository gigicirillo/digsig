(function(){
  let scheduled=false;
  const clone=o=>JSON.parse(JSON.stringify(o));
  const copyName=n=>(String(n||'Elemento').trim()||'Elemento')+' · copia';
  const uid=(prefix,name)=>{const base=String(name||prefix||'item').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||prefix||'item';return base+'-'+Math.random().toString(36).slice(2,7)};
  async function persist(message){await saveConfig(message);if(typeof renderWidgets==='function')try{renderWidgets()}catch(e){} }
  async function duplicateScreen(id){const src=state.config.screens.find(x=>x.id===id);if(!src)return;const x=clone(src);x.id=uid('schermo',copyName(src.name));x.name=copyName(src.name);x.status='offline';x.scid=typeof window.digsigScidFromId==='function'?window.digsigScidFromId(x.id):undefined;state.config.screens.push(x);await persist('Schermo duplicato')}
  async function duplicatePlaylist(id){const src=state.config.playlists.find(x=>x.id===id);if(!src)return;const x=clone(src);x.id=uid('playlist',copyName(src.name));x.name=copyName(src.name);x.items=Array.isArray(src.items)?[...src.items]:[];state.config.playlists.push(x);await persist('Playlist duplicata')}
  async function duplicateMedia(id){const src=state.config.media.find(x=>x.id===id);if(!src)return;const x=clone(src);x.id=uid('media',copyName(src.name));x.name=copyName(src.name);state.config.media.push(x);await persist('Media duplicato')}
  async function duplicateWidget(id){const src=(state.config.widgets||[]).find(x=>x.id===id);if(!src)return;const x=clone(src);x.id=uid('widget',copyName(src.name));x.name=copyName(src.name);state.config.widgets.push(x);await persist('Widget duplicato')}
  async function duplicateDesign(id){const src=(state.config.designs||[]).find(x=>x.id===id);if(!src)return;const x=clone(src);x.id=uid('design',copyName(src.name));x.name=copyName(src.name);x.zones=(x.zones||[]).map(z=>({...z,id:uid('zone',z.name||'area')}));state.config.designs.push(x);await persist('Design duplicato')}
  function addButton(actions,label,fn){if(!actions||actions.querySelector('[data-duplicate-btn="1"]'))return;const b=document.createElement('button');b.type='button';b.className='mini-btn';b.dataset.duplicateBtn='1';b.textContent='Duplica';b.addEventListener('click',fn);const danger=actions.querySelector('.danger');danger?actions.insertBefore(b,danger):actions.appendChild(b)}
  function enhance(){scheduled=false;if(typeof state==='undefined'||!state.config)return;
    document.querySelectorAll('#screensTable .screen-row').forEach((row,i)=>{const s=state.config.screens[i];if(s)addButton(row.querySelector('.card-actions'),'Duplica',()=>duplicateScreen(s.id))});
    document.querySelectorAll('#playlistCards .card').forEach((card,i)=>{const p=state.config.playlists[i];if(p)addButton(card.querySelector('.card-actions'),'Duplica',()=>duplicatePlaylist(p.id))});
    document.querySelectorAll('#mediaCards .card').forEach((card,i)=>{const m=state.config.media[i];if(m)addButton(card.querySelector('.card-actions'),'Duplica',()=>duplicateMedia(m.id))});
    document.querySelectorAll('#widgetCards .widget-card').forEach((card,i)=>{const w=(state.config.widgets||[])[i];if(w)addButton(card.querySelector('.card-actions'),'Duplica',()=>duplicateWidget(w.id))});
    document.querySelectorAll('#designTemplateList .design-template-row').forEach((row,i)=>{const d=(state.config.designs||[])[i];if(d)addButton(row.querySelector('.card-actions'),'Duplica',()=>duplicateDesign(d.id))});
  }
  function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(enhance)}
  function init(){enhance();new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});window.duplicateScreen=duplicateScreen;window.duplicatePlaylist=duplicatePlaylist;window.duplicateMedia=duplicateMedia;window.duplicateWidget=duplicateWidget;window.duplicateDesign=duplicateDesign}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();