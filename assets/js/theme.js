(function(){
  const KEY='digsig-dashboard-theme',AUTH='carosello-dashboard-auth';
  const BACKEND_BASE='https://www.futuraclubs.it/apitvlynca/';
  const CONFIG_API=BACKEND_BASE+'config.php';
  const nativeFetch=window.fetch.bind(window);
  window.LYNCA_BACKEND_BASE=BACKEND_BASE;
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
  function removePairingUI(){
    document.querySelectorAll('.nav-item[data-view="pairing"]').forEach(el=>el.remove());
    const pairing=document.getElementById('pairing');if(pairing)pairing.remove();
    document.querySelectorAll('.top-actions a[href="player.html"]').forEach(el=>el.remove());
  }
  function improveScreenFlow(){
    const screensView=document.getElementById('screens');
    const panel=screensView&&screensView.querySelector('.panel');
    if(panel&&!panel.querySelector('.screen-flow-help')){
      const help=document.createElement('div');
      help.className='screen-flow-help muted';
      help.style.cssText='margin:0 0 18px;padding:12px 14px;border:1px solid var(--border);border-radius:12px;line-height:1.45';
      help.innerHTML='<strong>Come collegare una TV:</strong> crea lo schermo, assegna la playlist, poi usa <strong>Player ↗</strong> oppure <strong>Copia link</strong>. Apri quel link sul televisore: nessun pairing necessario.';
      const head=panel.querySelector('.panel-head');
      if(head)head.insertAdjacentElement('afterend',help);else panel.prepend(help);
    }
  }
  function addLogout(){
    const actions=document.querySelector('.top-actions');if(!actions||document.getElementById('logoutBtn'))return;
    const btn=document.createElement('button');btn.type='button';btn.id='logoutBtn';btn.className='btn';btn.textContent='Logout';btn.title='Esci dalla dashboard';
    btn.addEventListener('click',()=>{sessionStorage.removeItem(AUTH);location.replace('login.html')});
    actions.appendChild(btn);
  }
  function init(){
    let saved='dark';
    try{saved=localStorage.getItem(KEY)||'dark'}catch(e){}
    apply(saved);applyBrand();removePairingUI();improveScreenFlow();addLogout();
    document.addEventListener('click',e=>{const btn=e.target.closest('[data-theme-choice]');if(btn)apply(btn.dataset.themeChoice)});
    const observer=new MutationObserver(()=>{
      removePairingUI();
      document.querySelectorAll('#screensTable .mini-btn').forEach(btn=>{if(btn.textContent.trim()==='Copia link')btn.textContent='Copia link TV'});
    });
    observer.observe(document.body,{childList:true,subtree:true});
    window.digsigSetDashboardTheme=apply;
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();