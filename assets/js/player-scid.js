(function(){
  var match=location.search.match(/[?&]scid=([^&]+)/i);if(!match)return;
  var scid=decodeURIComponent(match[1]).toUpperCase(),found='';
  function read(url){try{var x=new XMLHttpRequest();x.open('GET',url+(url.indexOf('?')>=0?'&':'?')+'ts='+Date.now(),false);x.send(null);if(x.status>=200&&x.status<300){var c=JSON.parse(x.responseText),screens=c.screens||[];for(var i=0;i<screens.length;i++){if(String(screens[i].scid||'').toUpperCase()===scid){found=screens[i].id;break}}}}catch(e){}}
  read('api/config.php');if(!found)read('data/config.json');
  if(found)localStorage.setItem('digsig-screen',found);else localStorage.removeItem('digsig-screen');
})();