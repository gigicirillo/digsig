(function(){
  function getScreenFromPreview(){
    var title=document.getElementById('previewTitle');
    if(typeof state==='undefined'||!state.config||!Array.isArray(state.config.screens))return null;
    var href=(document.getElementById('previewOpenNew')||{}).getAttribute?document.getElementById('previewOpenNew').getAttribute('href')||'':'';
    var m=href.match(/[?&](?:screen|scid)=([^&]+)/i);
    if(m){var v=decodeURIComponent(m[1]);for(var i=0;i<state.config.screens.length;i++){var s=state.config.screens[i];if(s.id===v||String(s.scid||'').toUpperCase()===String(v).toUpperCase())return s}}
    if(title){for(var j=0;j<state.config.screens.length;j++)if(state.config.screens[j].name===title.textContent)return state.config.screens[j]}
    return null;
  }
  function compactHref(screen){
    if(!screen)return'';
    if(typeof window.digsigPlayerHref==='function')return window.digsigPlayerHref(screen);
    return 'player.html?screen='+encodeURIComponent(screen.id);
  }
  function sync(){
    var a=document.getElementById('previewOpenNew');if(!a)return;
    var s=getScreenFromPreview(),href=compactHref(s);
    if(href)a.setAttribute('href',href);
    a.setAttribute('target','_blank');
    a.setAttribute('rel','noopener noreferrer');
  }
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('#previewOpenNew');if(!a)return;
    sync();
    var href=a.getAttribute('href');if(!href)return;
    e.preventDefault();e.stopPropagation();
    var absolute=new URL(href,window.location.href).href;
    var w=window.open(absolute,'_blank','noopener,noreferrer');
    if(!w){var fallback=document.createElement('a');fallback.href=absolute;fallback.target='_blank';fallback.rel='noopener noreferrer';fallback.style.display='none';document.body.appendChild(fallback);fallback.click();fallback.remove()}
  },true);
  document.addEventListener('DOMContentLoaded',function(){var modal=document.getElementById('previewModal');if(modal)new MutationObserver(sync).observe(modal,{childList:true,subtree:true,attributes:true});sync()});
})();