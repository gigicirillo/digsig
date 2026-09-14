(function(){
  let patched=false;
  function q(id){return document.getElementById(id)}
  function esc(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function ensureUI(){
    const form=q('screenForm');if(!form)return;
    const playlist=q('screenPlaylist');const playlistLabel=playlist&&playlist.closest('label');
    if(playlistLabel&&!q('screenUsePlaylists')){
      const flag=document.createElement('label');flag.className='screen-source-flag';flag.innerHTML='<input type="checkbox" id="screenUsePlaylists"> Usa playlist';playlistLabel.insertAdjacentElement('beforebegin',flag);
      playlistLabel.id='screenPlaylistBlock';
      q('screenUsePlaylists').addEventListener('change',syncVisibility);
    }
    let design=q('screenDesign');
    if(!design){
      const actions=form.querySelector('.modal-actions');
      const label=document.createElement('label');label.id='screenDesignBlock';label.innerHTML='Design<select id="screenDesign" name="designId"><option value="">Seleziona design</option></select>';
      actions?.insertAdjacentElement('beforebegin',label);design=q('screenDesign');
    }else if(design.closest('label'))design.closest('label').id='screenDesignBlock';
    if(q('screenDesignBlock')&&!q('screenUseDesign')){
      const flag=document.createElement('label');flag.className='screen-source-flag';flag.innerHTML='<input type="checkbox" id="screenUseDesign"> Applica design';q('screenDesignBlock').insertAdjacentElement('beforebegin',flag);
      q('screenUseDesign').addEventListener('change',syncVisibility);
    }
    populateDesigns();syncVisibility();patchFunctions();
  }
  function populateDesigns(){const sel=q('screenDesign');if(!sel||typeof state==='undefined'||!state.config)return;const val=sel.value;const designs=Array.isArray(state.config.designs)?state.config.designs:[];sel.innerHTML='<option value="">Seleziona design</option>'+designs.map(d=>'<option value="'+esc(d.id)+'">'+esc(d.name)+'</option>').join('');if([...sel.options].some(o=>o.value===val))sel.value=val}
  function syncVisibility(){const p=q('screenPlaylistBlock'),d=q('screenDesignBlock');if(p)p.style.display=q('screenUsePlaylists')?.checked?'flex':'none';if(d)d.style.display=q('screenUseDesign')?.checked?'flex':'none'}
  function setForScreen(s){ensureUI();const pids=Array.isArray(s?.playlistIds)&&s.playlistIds.length?s.playlistIds:(s?.playlistId?[s.playlistId]:[]);const useP=s?((s.usePlaylists!==false)&&pids.length>0):false;const useD=s?((s.useDesign!==false)&&!!s.designId):false;if(q('screenUsePlaylists'))q('screenUsePlaylists').checked=useP;if(q('screenUseDesign'))q('screenUseDesign').checked=useD;if(q('screenPlaylist'))Array.from(q('screenPlaylist').options).forEach(o=>o.selected=pids.includes(o.value));populateDesigns();if(q('screenDesign'))q('screenDesign').value=s?.designId||'';syncVisibility()}
  function patchFunctions(){if(patched||typeof window.newScreen!=='function'||typeof window.editScreen!=='function')return;patched=true;const ns=window.newScreen,es=window.editScreen;window.newScreen=function(){ns();setTimeout(()=>setForScreen(null),0)};window.editScreen=function(id){es(id);setTimeout(()=>{const s=typeof state!=='undefined'&&state.config?state.config.screens.find(x=>x.id===id):null;setForScreen(s)},0)}}
  function init(){ensureUI();new MutationObserver(()=>{ensureUI();populateDesigns()}).observe(document.body,{childList:true,subtree:true});setInterval(()=>{ensureUI();populateDesigns()},1200)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();