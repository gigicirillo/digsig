(function(){
  const KEY='digsig-dashboard-theme';
  function apply(theme){
    const value=theme==='light'?'light':'dark';
    document.body.setAttribute('data-theme',value);
    try{localStorage.setItem(KEY,value)}catch(e){}
    document.querySelectorAll('[data-theme-choice]').forEach(btn=>btn.classList.toggle('active',btn.dataset.themeChoice===value));
  }
  function applyBrand(){
    document.title='Schermo — Digital Signage';
    const brand=document.querySelector('.brand strong');if(brand)brand.textContent='Schermo';
    const mark=document.querySelector('.brand-mark');if(mark)mark.textContent='S';
    document.querySelectorAll('.help li').forEach(li=>{li.innerHTML=li.innerHTML.replace(/DigSig Player/g,'Schermo Player').replace(/DigSig/g,'Schermo')});
  }
  function init(){
    let saved='dark';
    try{saved=localStorage.getItem(KEY)||'dark'}catch(e){}
    apply(saved);applyBrand();
    document.addEventListener('click',e=>{const btn=e.target.closest('[data-theme-choice]');if(btn)apply(btn.dataset.themeChoice)});
    window.digsigSetDashboardTheme=apply;
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();