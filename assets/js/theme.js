(function(){
  const KEY='digsig-dashboard-theme',AUTH='carosello-dashboard-auth';
  const CONFIG_API='https://futuraclubs.it/apitvlynca/config.php';
  const nativeFetch=window.fetch.bind(window);
  window.LYNCA_CONFIG_API=CONFIG_API;
  window.fetch=function(input,init){
    try{
      const raw=typeof input==='string'?input:(input&&input.url)||'';
      if(/^\.?\/?api\/config\.php(?:[?#]|$)/i.test(raw)){
        const suffix=raw.includes('?')?raw.slice(raw.indexOf('?')):'';
        return nativeFetch(CONFIG_API+suffix,init);
      }
    }catch(e){}
    return nativeFetch(input,init);
  };
  if(sessionStorage.getItem(AUTH)!=='1'){location.replace('login.html');return;}
  function notice(msg,type){const n=document.getElementById('notice');if(!n)return alert(msg);n.textContent=msg;n.className='notice '+(type||'good');setTimeout(()=>n.classList.add('hidden'),7000)}
  function apply(theme){const v=theme==='light'?'light':'dark';document.body.setAttribute('data-theme',v);try{localStorage.setItem(KEY,v)}catch(e){}document.querySelectorAll('[data-theme-choice]').forEach(b=>b.classList.toggle('active',b.dataset.themeChoice===v))}
  function scidFromId(id){if(typeof window.digsigScidFromId==='function')return window.digsigScidFromId(id);const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let h=2166136261,s=String(id||'');for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h+=(h<<1)+(h<<4)+(h<<7)+(h<<8)+(h<<24)}h=h>>>0;let out='';for(let j=0;j<5;j++){out+=chars.charAt(h%chars.length);h=Math.floor(h/chars.length)}return out}
  function baseSlug(s){return String(s||'schermo').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'schermo'}
  async function getConfig(){const r=await nativeFetch(CONFIG_API+'?ts='+Date.now(),{cache:'no-store',mode:'cors'});if(!r.ok)throw new Error('GET '+r.status);const c=await r.json();if(!c||!Array.isArray(c.screens)||!Array.isArray(c.playlists)||!Array.isArray(c.media))throw new Error('config invalid');if(!Array.isArray(c.widgets))c.widgets=[];if(!Array.isArray(c.designs))c.designs=[];return c}
  async function putConfig(c){const r=await nativeFetch(CONFIG_API+'?ts='+Date.now(),{method:'POST',mode:'cors',cache:'no-store',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(c)});let body='';try{body=await r.text()}catch(e){}if(!r.ok)throw new Error('POST '+r.status+(body?' · '+body:''));return body}
  async function handleScreen(e){
    const form=e.target&&e.target.id==='screenForm'?e.target:null;if(!form)return;
    e.preventDefault();e.stopImmediatePropagation();
    const submit=form.querySelector('button[type="submit"],button:not([type])');
    if(submit){submit.disabled=true;submit.textContent='Salvataggio…'}
    const f=new FormData(form),name=String(f.get('name')||'').trim();
    if(!name){notice('Inserisci il nome dello schermo.','warn');if(submit){submit.disabled=false;submit.textContent='Salva schermo'}return}
    const sel=document.getElementById('screenPlaylist');
    const ids=sel?Array.from(sel.selectedOptions).map(o=>o.value).filter(Boolean):[];
    try{
      const c=await getConfig();
      const editId=String(f.get('editId')||'').trim();
      if(editId){
        const i=c.screens.findIndex(s=>s.id===editId);if(i<0)throw new Error('screen not found');
        const old=c.screens[i];
        c.screens[i]={...old,id:editId,name,location:String(f.get('location')||''),orientation:String(f.get('orientation')||'landscape'),playlistIds:ids,playlistId:ids[0]||'',scid:old.scid||scidFromId(editId)};
      }else{
        let id=String(f.get('id')||'').trim();
        if(!id){const base=baseSlug(name);id=base;let n=2;while(c.screens.some(s=>s.id===id)){id=base+'-'+n;n++}}
        if(c.screens.some(s=>s.id===id)){notice('Esiste già uno schermo con questo ID. Cambia ID oppure lascialo vuoto.','warn');if(submit){submit.disabled=false;submit.textContent='Salva schermo'}return}
        c.screens.push({id,name,location:String(f.get('location')||''),orientation:String(f.get('orientation')||'landscape'),playlistIds:ids,playlistId:ids[0]||'',status:'offline',scid:scidFromId(id)});
      }
      await putConfig(c);
      try{localStorage.removeItem('digsig-config')}catch(err){}
      notice(editId?'Schermo aggiornato sul server.':'Schermo creato sul server.','good');
      const dlg=document.getElementById('screenModal');if(dlg&&dlg.open)dlg.close();
      setTimeout(()=>location.reload(),500);
    }catch(err){
      console.error('Lynca.Tv screen save',err);
      notice('Errore salvataggio schermo: '+String(err&&err.message||err),'warn');
      if(submit){submit.disabled=false;submit.textContent='Salva schermo'}
    }
  }
  async function verify(){const l=document.getElementById('storageMode');try{await getConfig();if(l)l.textContent='storage server · attivo'}catch(e){if(l)l.textContent='storage server · non raggiungibile'}}
  function hidePairing(){document.querySelectorAll('.nav-item[data-view="pairing"],#pairing').forEach(el=>el.style.display='none');document.querySelectorAll('.top-actions a[href="player.html"]').forEach(el=>el.style.display='none')}
  function enhance(){document.title='Lynca.Tv — Digital Signage';hidePairing();document.querySelectorAll('#screensTable .mini-btn').forEach(b=>{if(b.textContent.trim()==='Copia link')b.textContent='Copia link TV'});const panel=document.querySelector('#screens .panel');if(panel&&!document.getElementById('screenDirectHelp')){const p=document.createElement('div');p.id='screenDirectHelp';p.className='muted';p.style.cssText='margin:0 0 18px;padding:12px 14px;border:1px solid var(--line);border-radius:12px';p.innerHTML='<strong>Collegamento TV:</strong> crea lo schermo e poi usa <strong>Copia link TV</strong>. La playlist può essere assegnata anche in un secondo momento.';panel.querySelector('.panel-head')?.insertAdjacentElement('afterend',p)}}
  function addLogout(){const a=document.querySelector('.top-actions');if(!a||document.getElementById('logoutBtn'))return;const b=document.createElement('button');b.type='button';b.id='logoutBtn';b.className='btn';b.textContent='Logout';b.onclick=()=>{sessionStorage.removeItem(AUTH);location.replace('login.html')};a.appendChild(b)}
  function init(){let saved='dark';try{saved=localStorage.getItem(KEY)||'dark'}catch(e){}apply(saved);enhance();addLogout();verify();document.addEventListener('submit',handleScreen,true);document.addEventListener('click',e=>{const b=e.target.closest('[data-theme-choice]');if(b)apply(b.dataset.themeChoice)});new MutationObserver(enhance).observe(document.body,{childList:true,subtree:true});window.digsigSetDashboardTheme=apply}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();