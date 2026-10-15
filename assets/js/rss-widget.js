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
  const cache = new Map(), active = new Set(), positions = new Map();
  const day = value => new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Rome',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(value));
  function plainText(html) {
    const doc=new DOMParser().parseFromString(String(html||''),'text/html');
    doc.querySelectorAll('script,style,iframe,object').forEach(el=>el.remove());
    return doc.body.textContent.replace(/\s+/g,' ').trim();
  }
  function imageUrl(raw) {
    try {const u=new URL(raw);return u.protocol==='https:'&&['corriere.it','corriereobjects.it','rcsobjects.it'].some(host=>u.hostname===host||u.hostname.endsWith('.'+host))?u.href:'';}catch{return '';}
  }
  function parse(xml) {
    const doc = new DOMParser().parseFromString(xml,'application/xml');
    if(doc.querySelector('parsererror') || !doc.querySelector('rss,feed')) throw new Error('Feed non valido');
    const seen = new Set();
    return Array.from(doc.querySelectorAll('item,entry')).map(item => {
      const text = selector => item.querySelector(selector)?.textContent.trim() || '';
      const title = plainText(text('title'));
      const description=text('description')||text('summary');
      const subtitle=plainText(description);
      const media=Array.from(item.getElementsByTagName('*')).filter(el=>['thumbnail','content','enclosure'].includes(el.localName));
      const descriptionDoc=new DOMParser().parseFromString(description,'text/html');
      const image=[...media.map(el=>el.getAttribute('url')||''),descriptionDoc.querySelector('img')?.getAttribute('src')||''].map(imageUrl).find(Boolean)||'';
      let link = text('link') || item.querySelector('link')?.getAttribute('href') || '';
      try { const u = new URL(link); if(u.protocol!=='https:' || !(u.hostname==='corriere.it'||u.hostname.endsWith('.corriere.it'))) link=''; } catch { link=''; }
      const published = Date.parse(text('pubDate') || text('published') || text('updated'));
      return {title,subtitle:subtitle===title?'':subtitle,image,link,published};
    }).filter(item => {
      const key=item.link||item.title;
      if(!item.title||!Number.isFinite(item.published)||seen.has(key)) return false;
      seen.add(key);return true;
    }).sort((a,b)=>b.published-a.published);
  }
  function select(items,period='today',now=Date.now()) {
    return items.filter(item=>item.published<=now && (period==='latest' || (period==='24h'?now-item.published<=86400000:day(item.published)===day(now))));
  }
  function sequence(items,w={},now=Date.now()) {
    const count=Math.max(1,Math.min(30,Math.floor(Number(w.rssCount)||12)));
    const recent=items.filter(item=>item.published<=now).slice().sort((a,b)=>b.published-a.published);
    const matching=select(recent,w.rssPeriod||'today',now);
    return (w.rssBackfill===false?matching:[...matching,...recent.filter(item=>!matching.includes(item))]).slice(0,count);
  }
  function duration(w) {
    if(w.customDuration)return Math.max(1,Number(w.duration)||15);
    return Math.max(1,Math.min(30,Math.floor(Number(w.rssCount)||12)))*Math.max(5,Math.min(120,Number(w.rssSeconds)||12));
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
    box.innerHTML='<img class="rss-widget-cover" alt="" hidden><div class="rss-widget-copy"><div class="rss-widget-source"></div><a class="rss-widget-title" target="_blank" rel="noopener noreferrer"></a><div class="rss-widget-subtitle" hidden></div><div class="rss-widget-meta"></div></div>';
    const cover=box.querySelector('.rss-widget-cover'),copy=box.querySelector('.rss-widget-copy'),source=box.querySelector('.rss-widget-source'),title=box.querySelector('.rss-widget-title'),subtitle=box.querySelector('.rss-widget-subtitle'),meta=box.querySelector('.rss-widget-meta');
    let coverUrl='';
    cover.decoding='async';cover.referrerPolicy='no-referrer';
    cover.onerror=()=>{cover.hidden=true;requestAnimationFrame(fit);};
    cover.onload=()=>requestAnimationFrame(fit);
    source.textContent='Corriere della Sera · '+feeds[key].label;
    title.textContent='Caricamento notizie…';
    const mode=w.backgroundMode||(w.backgroundTransparent?'transparent':'solid');
    if(mode==='transparent')box.style.background='transparent';
    else if(mode==='gradient')box.style.background=`linear-gradient(${Number(w.backgroundAngle)||135}deg,${w.backgroundColor||'#101820'},${w.backgroundColor2||'#42d9ff'})`;
    else box.style.background=w.backgroundColor||'#101820';
    box.style.color=w.rssTextColor||'#ffffff';
    box.style.textAlign=['left','center','right'].includes(w.alignH)?w.alignH:'left';
    copy.style.justifyContent=w.alignV==='top'?'flex-start':w.alignV==='bottom'?'flex-end':'center';
    const maxFontSize=Math.max(12,Math.min(120,Number(w.rssFontSize)||32));
    title.style.fontSize=maxFontSize+'px';
    target.replaceChildren(box);
    const positionKey=w.id?`${w.id}:${key}`:null;
    let items=[],index=positions.get(positionKey)||0,failed=false,disposed=false;
    function fit() {
      if(disposed||!box.isConnected||!box.clientHeight)return;
      const style=getComputedStyle(copy),gap=parseFloat(style.rowGap)||0;
      const available=copy.clientHeight-parseFloat(style.paddingTop)-parseFloat(style.paddingBottom)-source.offsetHeight-meta.offsetHeight-(subtitle.hidden?2:3)*gap;
      title.style.maxHeight='none';subtitle.style.maxHeight='none';
      let size=maxFontSize;
      function apply(){title.style.fontSize=size+'px';subtitle.style.fontSize=Math.max(10,Math.round(size*.62))+'px';}
      apply();
      while(size>12&&title.offsetHeight+subtitle.offsetHeight>available){size--;apply();}
      const subtitleRoom=subtitle.hidden?0:Math.min(subtitle.offsetHeight,Math.max(0,available*.4));
      title.style.maxHeight=Math.max(14,available-subtitleRoom)+'px';
      subtitle.style.maxHeight=subtitleRoom+'px';
    }
    const resize=new ResizeObserver(fit);resize.observe(box);
    function paint() {
      if(disposed)return;
      requestAnimationFrame(fit);
      const current=sequence(items,w);
      if(!current.length){cover.hidden=true;cover.removeAttribute('src');coverUrl='';subtitle.hidden=true;subtitle.textContent='';title.textContent=failed?'Notizie temporaneamente non disponibili':'Nessuna notizia nel periodo selezionato';title.removeAttribute('href');meta.textContent='Aggiornamento automatico · '+new Date().toLocaleDateString('it-IT',{timeZone:'Europe/Rome'});return;}
      index%=current.length;const item=current[index];title.textContent=item.title;
      subtitle.textContent=item.subtitle||'';subtitle.hidden=!item.subtitle;
      if((item.image||'')!==coverUrl){coverUrl=item.image||'';cover.hidden=!coverUrl;if(coverUrl){cover.src=coverUrl;cover.alt='';}else cover.removeAttribute('src');}
      else if(!coverUrl)cover.hidden=true;
      if(item.link)title.href=item.link;else title.removeAttribute('href');
      meta.textContent=new Date(item.published).toLocaleString('it-IT',{timeZone:'Europe/Rome',day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})+' · '+(index+1)+'/'+current.length+(failed?' · Aggiornamento non disponibile':'');
    }
    async function refresh(){try{const result=await load(key);if(disposed)return;items=result.items;failed=false;}catch{if(disposed)return;failed=true;}paint();}
    const rotate=setInterval(()=>{index++;paint();},Math.max(5,Math.min(120,Number(w.rssSeconds)||12))*1000);
    const update=setInterval(refresh,300000);
    const instance={box,dispose(){disposed=true;if(positionKey&&items.length)positions.set(positionKey,index+1);resize.disconnect();clearInterval(rotate);clearInterval(update);active.delete(instance);}};
    active.add(instance);refresh();
    return instance.dispose;
  }
  // Disconnect timers when a playlist advances, a preview closes or a design is rebuilt.
  new MutationObserver(()=>{active.forEach(instance=>{if(!instance.box.isConnected)instance.dispose();});}).observe(document.documentElement,{childList:true,subtree:true});
  window.digsigRSS={feeds,parse,select,sequence,duration,render};
})();
