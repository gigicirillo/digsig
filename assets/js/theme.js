(function(){
  const KEY='digsig-dashboard-theme';
  function apply(theme){
    const value=theme==='light'?'light':'dark';
    document.body.setAttribute('data-theme',value);
    try{localStorage.setItem(KEY,value)}catch(e){}
    document.querySelectorAll('[data-theme-choice]').forEach(btn=>btn.classList.toggle('active',btn.dataset.themeChoice===value));
  }
  function init(){
    let saved='dark';
    try{saved=localStorage.getItem(KEY)||'dark'}catch(e){}
    apply(saved);
    document.addEventListener('click',e=>{const btn=e.target.closest('[data-theme-choice]');if(btn)apply(btn.dataset.themeChoice)});
    window.digsigSetDashboardTheme=apply;
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();