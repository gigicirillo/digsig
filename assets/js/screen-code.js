(function(){
  var CHARS='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  function scidFromId(id){var h=2166136261,s=String(id||'');for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h+=(h<<1)+(h<<4)+(h<<7)+(h<<8)+(h<<24)}h=h>>>0;var out='';for(var j=0;j<5;j++){out+=CHARS.charAt(h%CHARS.length);h=Math.floor(h/CHARS.length)}return out}
  function ensureCodes(){if(typeof state==='undefined'||!state.config||!Array.isArray(state.config.screens))return false;state.config.screens.forEach(function(s){s.scid=scidFromId(s.id)});return true}
  function enhance(){if(!ensureCodes())return;var rows=document.querySelectorAll('#screensTable .screen-row');rows.forEach(function(row,i){var s=state.config.screens[i];if(!s)return;var idLine=row.querySelector('.muted'),txt='SCID: '+s.scid;if(idLine&&idLine.textContent!==txt)idLine.textContent=txt;var player=row.querySelector('a[href*="player.html?"]'),href='player.html?scid='+encodeURIComponent(s.scid);if(player&&player.getAttribute('href')!==href)player.setAttribute('href',href)})}
  window.digsigScidFromId=scidFromId;
  window.digsigScreenCode=function(screen){return screen?scidFromId(screen.id):''};
  window.digsigPlayerHref=function(screen){return 'player.html?scid='+encodeURIComponent(window.digsigScreenCode(screen))};
  document.addEventListener('DOMContentLoaded',function(){var box=document.getElementById('screensTable');if(box){var pending=false;new MutationObserver(function(){if(pending)return;pending=true;setTimeout(function(){pending=false;enhance()},0)}).observe(box,{childList:true,subtree:true})}setTimeout(enhance,250)});
})();