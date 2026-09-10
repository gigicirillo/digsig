(function(){
  const KEY='digsig-dashboard-theme',AUTH='carosello-dashboard-auth';
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
    document.title='Carosello — Digital Signage';
    const brand=document.querySelector('.brand strong');if(brand)brand.textContent='Carosello';
    const mark=document.querySelector('.brand-mark');if(mark)mark.textContent='C';
    document.querySelectorAll('.help li').forEach(li=>{li.innerHTML=li.innerHTML.replace(/DigSig Player|Schermo Player/g,'Carosello Player').replace(/DigSig|Schermo/g,'Carosello')});
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