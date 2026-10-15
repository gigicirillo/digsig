(function(){
  function init(){
    const type=document.getElementById('widgetType');if(!type)return;
    type.add(new Option('Notizie RSS · Corriere della Sera','rss'));
    const fields=document.createElement('div');fields.id='rssWidgetFields';fields.className='hidden';
    fields.innerHTML=`<label>Feed RSS<select id="rssFeed"></select></label><label>Notizie da mostrare<select id="rssPeriod"><option value="today">Oggi (ora italiana)</option><option value="24h">Ultime 24 ore</option><option value="latest">Ultime disponibili, con data</option></select></label><div class="grid-2 compact"><label>Secondi per notizia<input id="rssSeconds" type="number" min="5" max="120" value="12"></label><label>Dimensione massima testo (px)<input id="rssFontSize" type="number" min="12" max="120" value="32"></label></div><label>Colore testo<input id="rssTextColor" type="color" value="#ffffff"></label><p class="muted">Titoli dal feed ufficiale del Corriere della Sera, adattati allo spazio disponibile. Aggiornamento ogni 5 minuti; le notizie di ieri vengono escluse automaticamente scegliendo “Oggi”.</p>`;
    document.getElementById('messageWidgetFields').insertAdjacentElement('afterend',fields);
    Object.entries(window.digsigRSS.feeds).forEach(([key,feed])=>document.getElementById('rssFeed').add(new Option(feed.label,key)));
    window.digsigRSSEditor={
      sync(){const on=type.value==='rss';fields.classList.toggle('hidden',!on);fields.querySelectorAll('input,select').forEach(el=>el.disabled=!on);},
      set(w={}){document.getElementById('rssFeed').value=w.rssFeed||'cronache';document.getElementById('rssPeriod').value=w.rssPeriod||'today';document.getElementById('rssSeconds').value=w.rssSeconds||12;document.getElementById('rssFontSize').value=w.rssFontSize||32;document.getElementById('rssTextColor').value=w.rssTextColor||'#ffffff';this.sync();},
      get(){return {rssFeed:document.getElementById('rssFeed').value,rssPeriod:document.getElementById('rssPeriod').value,rssSeconds:Math.max(5,Math.min(120,Number(document.getElementById('rssSeconds').value)||12)),rssFontSize:Math.max(12,Math.min(120,Number(document.getElementById('rssFontSize').value)||32)),rssTextColor:document.getElementById('rssTextColor').value};}
    };window.digsigRSSEditor.set();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
