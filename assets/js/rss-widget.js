/* Corriere RSS: shared by dashboard previews and both TV players. */
(function () {
  const feeds = {
    cronache: {label:'Cronaca italiana',url:'https://www.corriere.it/dynamic-feed/rss/section/Cronache.xml'},
    homepage: {label:'Prima pagina',url:'https://xml2.corriereobjects.it/feed-hp/homepage-restyle-2025.xml'},
    politica: {label:'Politica',url:'https://www.corriere.it/dynamic-feed/rss/section/Politica.xml'},
    economia: {label:'Economia',url:'https://www.corriere.it/dynamic-feed/rss/section/Economia.xml'},
    sport: {label:'Sport',url:'https://www.corriere.it/dynamic-feed/rss/section/Sport.xml'},
    esteri: {label:'Esteri',url:'https://www.corriere.it/dynamic-feed/rss/section/Esteri.xml'}
  };
  const cache = new Map(), active = new Set();
  const day = value => new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Rome',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(value));
  function parse(xml) {
    const doc = new DOMParser().parseFromString(xml,'application/xml');
    if(doc.querySelector('parsererror') || !doc.querySelector('rss,feed')) throw new Error('Feed non valido');
    const seen = new Set();
    return Array.from(doc.querySelectorAll('item,entry')).map(item => {
      const text = selector => item.querySelector(selector)?.textContent.trim() || '';
      const titleDoc = new DOMParser().parseFromString(text('title'),'text/html');
      const title = titleDoc.body.textContent.trim();
      let link = text('link') || item.querySelector('link')?.getAttribute('href') || '';
      try { const u = new URL(link); if(u.protocol!=='https:' || !(u.hostname==='corriere.it'||u.hostname.endsWith('.corriere.it'))) link=''; } catch { link=''; }
      const published = Date.parse(text('pubDate') || text('published') || text('updated'));
      return {title,link,published};
    }).filter(item => {
      const key=item.link||item.title;
      if(!item.title||!Number.isFinite(item.published)||seen.has(key)) return false;
      seen.add(key);return true;
    }).sort((a,b)=>b.published-a.published);
  }
  function select(items,period='today',now=Date.now()) {
    return items.filter(item=>item.published<=now && (period==='latest' || (period==='24h'?now-item.published<=86400000:day(item.published)===day(now))));
  }
  async function load(key) {
    const previous=cache.get(key);
    if(previous?.pending)return previous.pending;
    if(previous && Date.now()-previous.at<300000)return previous;
    const entry=previous||{at:0,items:[]};
    entry.pending=(async()=>{
      const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),15000);
      try {
        const response=await fetch(feeds[key].url,{signal:controller.signal,cache:'no-cache',credentials:'omit'});
        if(!response.ok)throw new Error('Feed non disponibile');
        const items=parse(await response.text());entry.items=items;entry.at=Date.now();return entry;
      } finally {clearTimeout(timeout);entry.pending=null;}
    })();cache.set(key,entry);return entry.pending;
  }
  function render(target,w) {
    if(!target)return;
    const key=feeds[w.rssFeed]?w.rssFeed:'cronache';
    const box=document.createElement('div');box.className='rss-widget';
    box.innerHTML='<div class="rss-widget-source"></div><a class="rss-widget-title" target="_blank" rel="noopener noreferrer"></a><div class="rss-widget-meta"></div>';
    const source=box.children[0],title=box.children[1],meta=box.children[2];
    source.textContent='Corriere della Sera · '+feeds[key].label;
    title.textContent='Caricamento notizie…';
    const mode=w.backgroundMode||(w.backgroundTransparent?'transparent':'solid');
    if(mode==='transparent')box.style.background='transparent';
    else if(mode==='gradient')box.style.background=`linear-gradient(${Number(w.backgroundAngle)||135}deg,${w.backgroundColor||'#101820'},${w.backgroundColor2||'#42d9ff'})`;
    else box.style.background=w.backgroundColor||'#101820';
    box.style.color=w.rssTextColor||'#ffffff';
    box.style.textAlign=['left','center','right'].includes(w.alignH)?w.alignH:'left';
    box.style.justifyContent=w.alignV==='top'?'flex-start':w.alignV==='bottom'?'flex-end':'center';
    const maxFontSize=Math.max(12,Math.min(120,Number(w.rssFontSize)||32));
    title.style.fontSize=maxFontSize+'px';
    target.replaceChildren(box);
    let items=[],index=0,failed=false,disposed=false;
    function fit() {
      if(disposed||!box.isConnected||!box.clientHeight)return;
      const style=getComputedStyle(box),gap=parseFloat(style.rowGap)||0;
      const available=box.clientHeight-parseFloat(style.paddingTop)-parseFloat(style.paddingBottom)-source.offsetHeight-meta.offsetHeight-2*gap;
      title.style.maxHeight='none';
      let size=maxFontSize;title.style.fontSize=size+'px';
      while(size>12&&title.offsetHeight>available){size--;title.style.fontSize=size+'px';}
      title.style.maxHeight=Math.max(14,available)+'px';
    }
    const resize=new ResizeObserver(fit);resize.observe(box);
    function paint() {
      if(disposed)return;
      requestAnimationFrame(fit);
      const current=select(items,w.rssPeriod||'today');
      if(!current.length){title.textContent=failed?'Notizie temporaneamente non disponibili':'Nessuna notizia nel periodo selezionato';title.removeAttribute('href');meta.textContent='Aggiornamento automatico · '+new Date().toLocaleDateString('it-IT',{timeZone:'Europe/Rome'});return;}
      index%=current.length;const item=current[index];title.textContent=item.title;
      if(item.link)title.href=item.link;else title.removeAttribute('href');
      meta.textContent=new Date(item.published).toLocaleString('it-IT',{timeZone:'Europe/Rome',day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})+' · '+(index+1)+'/'+current.length+(failed?' · Aggiornamento non disponibile':'');
    }
    async function refresh(){try{const result=await load(key);if(disposed)return;items=result.items;failed=false;}catch{if(disposed)return;failed=true;}paint();}
    const rotate=setInterval(()=>{index++;paint();},Math.max(5,Math.min(120,Number(w.rssSeconds)||12))*1000);
    const update=setInterval(refresh,300000);
    const instance={box,dispose(){disposed=true;resize.disconnect();clearInterval(rotate);clearInterval(update);active.delete(instance);}};
    active.add(instance);refresh();
    return instance.dispose;
  }
  // Disconnect timers when a playlist advances, a preview closes or a design is rebuilt.
  new MutationObserver(()=>{active.forEach(instance=>{if(!instance.box.isConnected)instance.dispose();});}).observe(document.documentElement,{childList:true,subtree:true});
  window.digsigRSS={feeds,parse,select,render};
})();
