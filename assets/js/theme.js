(function(){
  const KEY='digsig-dashboard-theme',AUTH='carosello-dashboard-auth';
  const BACKEND_BASE='https://www.futuraclubs.it/apitvlynca/';
  const CONFIG_API=BACKEND_BASE+'config.php';
  const PAIR_API=BACKEND_BASE+'pair.php';
  const nativeFetch=window.fetch.bind(window);
  window.LYNCA_BACKEND_BASE=BACKEND_BASE;
  window.LYNCA_CONFIG_API=CONFIG_API;
  window.LYNCA_PAIR_API=PAIR_API;
  window.fetch=function(input,init){
    try{
      const raw=typeof input==='string'?input:(input&&input.url)||'';
      if(/^\.?\/?api\/(config|pair)\.php(?:[?#]|$)/i.test(raw)){
        const file=raw.replace(/^\.?\/?api\//i,'');
        return nativeFetch(BACKEND_BASE+file,init);
      }
    }catch(e){}
    return nativeFetch(input,init);
  };
  if(sessionStorage.getItem(AUTH)!=='1'){
    location.replace('login.html');
    return;
  }
  function apply(theme){
    const value=theme==='light'?'light':'dark';
    document.body.setAttribute('data-theme',value);
    try{localStorage.setItem(KEY,value)}catch(e){}
    document.querySelectorAll('[data-theme-choice]').forEach(btn=>btn.classList.toggle('active',btn.dataset.themeChoice===value));
  }
  function applyBrand(){
    document.title='Lynca.Tv — Digital Signage';
    document.querySelectorAll('.help li').forEach(li=>{li.innerHTML=li.innerHTML.replace(/DigSig Player|Schermo Player|Carosello Player/g,'Lynca.Tv Player').replace(/DigSig|Schermo|Carosello/g,'Lynca.Tv')});
  }
  function addLogout(){
    const actions=document.querySelector('.top-actions');if(!actions||document.getElementById('logoutBtn'))return;
    const btn=document.createElement('button');btn.type='button';btn.id='logoutBtn';btn.className='btn';btn.textContent='Logout';btn.title='Esci dalla dashboard';
    btn.addEventListener('click',()=>{sessionStorage.removeItem(AUTH);location.replace('login.html')});
    actions.appendChild(btn);
  }
  function showNotice(msg,type){
    const n=document.getElementById('notice');
    if(!n)return alert(msg);
    n.textContent=msg;n.className='notice '+(type||'good');
    setTimeout(()=>n.classList.add('hidden'),5000);
  }
  function slug(s){return String(s||'tv').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')+'-'+Math.random().toString(36).slice(2,6)}
  function scidFromId(id){
    if(typeof window.digsigScidFromId==='function')return window.digsigScidFromId(id);
    const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let h=2166136261,s=String(id||'');
    for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h+=(h<<1)+(h<<4)+(h<<7)+(h<<8)+(h<<24)}h=h>>>0;
    let out='';for(let j=0;j<5;j++){out+=chars.charAt(h%chars.length);h=Math.floor(h/chars.length)}return out;
  }
  async function handleRemotePairing(e){
    const form=e.target&&e.target.id==='pairForm'?e.target:null;
    if(!form)return;
    e.preventDefault();e.stopImmediatePropagation();
    const f=new FormData(form),code=String(f.get('code')||'').replace(/\D/g,'');
    if(code.length!==6){showNotice('Inserisci il codice a 6 cifre mostrato sulla TV.','warn');return}
    const name=String(f.get('name')||'').trim();
    if(!name){showNotice('Inserisci il nome dello schermo.','warn');return}
    try{
      const cfgRes=await nativeFetch(CONFIG_API+'?ts='+Date.now(),{cache:'no-store'});
      if(!cfgRes.ok)throw new Error('config_http_'+cfgRes.status);
      const config=await cfgRes.json();
      if(!config||!Array.isArray(config.screens)||!Array.isArray(config.playlists)||!Array.isArray(config.media))throw new Error('config_invalid');
      if(!Array.isArray(config.widgets))config.widgets=[];
      if(!Array.isArray(config.designs))config.designs=[];
      const id=slug(name),first=String(f.get('playlistId')||'');
      const screen={id,name,location:String(f.get('location')||''),orientation:'landscape',playlistIds:first?[first]:[],playlistId:first,status:'online',scid:scidFromId(id)};
      const pairRes=await nativeFetch(PAIR_API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'claim',code,screen})});
      if(!pairRes.ok){showNotice('Codice pairing non valido, scaduto o backend pairing non raggiungibile.','warn');return}
      config.screens.push(screen);
      const saveRes=await nativeFetch(CONFIG_API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(config)});
      if(!saveRes.ok)throw new Error('save_http_'+saveRes.status);
      try{localStorage.removeItem('digsig-config')}catch(err){}
      form.reset();
      showNotice('TV associata con successo. Ricarico i dati dal server…','good');
      setTimeout(()=>location.reload(),800);
    }catch(err){
      console.error('Lynca.Tv remote pairing:',err);
      showNotice('Backend PHP non raggiungibile. Verifica https://www.futuraclubs.it/apitvlynca/config.php','warn');
    }
  }
  function init(){
    let saved='dark';
    try{saved=localStorage.getItem(KEY)||'dark'}catch(e){}
    apply(saved);applyBrand();addLogout();
    document.addEventListener('click',e=>{const btn=e.target.closest('[data-theme-choice]');if(btn)apply(btn.dataset.themeChoice)});
    document.addEventListener('submit',handleRemotePairing,true);
    window.digsigSetDashboardTheme=apply;
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();