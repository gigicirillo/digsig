(function(){
  function apply(){
    document.querySelectorAll('.sidebar .nav-item').forEach(function(el){
      var label=(el.dataset&&el.dataset.lyncaIconLabel)||el.getAttribute('aria-label')||el.title||'';
      if(!label)return;
      el.style.width='100%';
      el.style.minWidth='0';
      el.style.height='auto';
      el.style.display='flex';
      el.style.alignItems='center';
      el.style.justifyContent='flex-start';
      el.style.gap='10px';
      el.style.padding='10px 12px';
      el.setAttribute('data-sidebar-label',label);
      if(!el.querySelector('.lynca-sidebar-label')){
        var span=document.createElement('span');
        span.className='lynca-sidebar-label';
        span.textContent=label;
        el.appendChild(span);
      }
    });
  }
  function style(){
    if(document.getElementById('lyncaSidebarLabelStyle'))return;
    var s=document.createElement('style');
    s.id='lyncaSidebarLabelStyle';
    s.textContent='.sidebar .nav-item.lynca-icon-only{width:100%!important;min-width:0!important;height:auto!important;display:flex!important;align-items:center!important;justify-content:flex-start!important;gap:10px!important;padding:10px 12px!important}.sidebar .nav-item.lynca-icon-only svg{flex:0 0 18px}.lynca-sidebar-label{display:inline!important;white-space:nowrap;font-size:inherit;font-weight:inherit;color:inherit}';
    document.head.appendChild(s);
  }
  function init(){style();apply();new MutationObserver(function(){requestAnimationFrame(apply)}).observe(document.body,{childList:true,subtree:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();