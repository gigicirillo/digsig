(function(){
  const KEY='digsig-dashboard-theme',AUTH='carosello-dashboard-auth';
  const BACKEND_BASE='https://www.futuraclubs.it/apitvlynca/';
  const nativeFetch=window.fetch.bind(window);
  window.LYNCA_BACKEND_BASE=BACKEND_BASE;
  window.LYNCA_CONFIG_API=BACKEND_BASE+'config.php';
  window.LYNCA_PAIR_API=BACKEND_BASE+'pair.php';
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
  function init(){
    let saved='dark';
    try{saved=localStorage.getItem(KEY)||'dark'}catch(e){}
    apply(saved);applyBrand();addLogout();
    document.addEventListener('click',e=>{const btn=e.target.closest('[data-theme-choice]');if(btn)apply(btn.dataset.themeChoice)});
    window.digsigSetDashboardTheme=apply;
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();