(function(){
  var CHARS='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  function scidFromId(id){var h=2166136261,s=String(id||'');for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h+=(h<<1)+(h<<4)+(h<<7)+(h<<8)+(h<<24)}h=h>>>0;var out='';for(var j=0;j<5;j++){out+=CHARS.charAt(h%CHARS.length);h=Math.floor(h/CHARS.length)}return out}
  var match=location.search.match(/[?&]scid=([^&]+)/i);if(!match)return;
  var scid=decodeURIComponent(match[1]).toUpperCase(),found='';
  function read(url){try{var x=new XMLHttpRequest();x.open('GET',url+(url.indexOf('?')>=0?'&':'?')+'ts='+Date.now(),false);x.send(null);if(x.status>=200&&x.status<300){var c=JSON.parse(x.responseText),screens=c.screens||[];for(var i=0;i<screens.length;i++){var candidate=String(screens[i].scid||scidFromId(screens[i].id)).toUpperCase();if(candidate===scid){found=screens[i].id;break}}}}catch(e){}}
  read('api/config.php');if(!found)read('data/config.json');
  if(found)localStorage.setItem('digsig-screen',found);else localStorage.removeItem('digsig-screen');
})();