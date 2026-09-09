(function(){
  function absolutePlayerUrl(href){
    return new URL(href, window.location.href).href;
  }
  async function copyText(text){
    if(navigator.clipboard&&navigator.clipboard.writeText){
      await navigator.clipboard.writeText(text);
      return;
    }
    var ta=document.createElement('textarea');
    ta.value=text;
    ta.setAttribute('readonly','');
    ta.style.position='fixed';
    ta.style.opacity='0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
  function enhance(){
    var table=document.getElementById('screensTable');
    if(!table)return;
    table.querySelectorAll('.screen-row .card-actions').forEach(function(actions){
      if(actions.querySelector('.copy-player-link'))return;
      var player=actions.querySelector('a[href*="player.html?screen="]');
      if(!player)return;
      var btn=document.createElement('button');
      btn.type='button';
      btn.className='mini-btn copy-player-link';
      btn.textContent='Copia link';
      btn.title='Copia il link del player negli appunti';
      btn.addEventListener('click',async function(){
        var original=btn.textContent;
        try{
          await copyText(absolutePlayerUrl(player.getAttribute('href')));
          btn.textContent='Copiato ✓';
          if(typeof notice==='function')notice('Link player copiato negli appunti');
        }catch(e){
          btn.textContent='Errore';
          if(typeof notice==='function')notice('Impossibile copiare il link.','warn');
        }
        setTimeout(function(){btn.textContent=original;},1600);
      });
      actions.appendChild(btn);
    });
  }
  document.addEventListener('DOMContentLoaded',function(){
    enhance();
    var table=document.getElementById('screensTable');
    if(table)new MutationObserver(enhance).observe(table,{childList:true,subtree:true});
  });
})();