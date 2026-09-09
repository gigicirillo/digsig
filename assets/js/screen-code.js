(function(){
  var CHARS='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  var saving=false;
  function code5(){var s='';for(var i=0;i<5;i++)s+=CHARS.charAt(Math.floor(Math.random()*CHARS.length));return s}
  function ensureCodes(){
    if(typeof state==='undefined'||!state.config||!Array.isArray(state.config.screens))return false;
    var used={},changed=false;
    state.config.screens.forEach(function(s){
      if(s.scid&&/^[A-Za-z0-9]{5}$/.test(s.scid)){
        var normalized=String(s.scid).toUpperCase();
        if(s.scid!==normalized){s.scid=normalized;changed=true}
        used[s.scid]=1;
      }
    });
    state.config.screens.forEach(function(s){
      if(!s.scid||!/^[A-Z0-9]{5}$/.test(s.scid)){
        var c;do{c=code5()}while(used[c]);
        s.scid=c;used[c]=1;changed=true;
      }
    });
    if(changed&&!saving){
      saving=true;
      try{
        if(state.serverMode){
          fetch('api/config.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(state.config)}).finally(function(){saving=false});
        }else{
          localStorage.setItem('digsig-config',JSON.stringify(state.config));saving=false;
        }
      }catch(e){saving=false}
    }
    return true;
  }
  function enhance(){
    if(!ensureCodes())return;
    var rows=document.querySelectorAll('#screensTable .screen-row');
    rows.forEach(function(row,i){
      var s=state.config.screens[i];if(!s)return;
      var idLine=row.querySelector('.muted');
      var wantedText='SCID: '+s.scid;
      if(idLine&&idLine.textContent!==wantedText)idLine.textContent=wantedText;
      var player=row.querySelector('a[href*="player.html?"]');
      var wantedHref='player.html?scid='+encodeURIComponent(s.scid);
      if(player&&player.getAttribute('href')!==wantedHref)player.setAttribute('href',wantedHref);
    });
  }
  window.digsigScreenCode=function(screen){ensureCodes();return screen&&screen.scid?screen.scid:''};
  window.digsigPlayerHref=function(screen){var c=window.digsigScreenCode(screen);return 'player.html?scid='+encodeURIComponent(c)};
  document.addEventListener('DOMContentLoaded',function(){
    var box=document.getElementById('screensTable');
    if(box){
      var scheduled=false;
      new MutationObserver(function(){
        if(scheduled)return;
        scheduled=true;
        requestAnimationFrame(function(){scheduled=false;enhance()});
      }).observe(box,{childList:true,subtree:true});
    }
    setTimeout(enhance,300);
  });
})();