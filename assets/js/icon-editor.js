(function(){
  function init(){
    const type=document.getElementById('widgetType');if(!type)return;
    const icons=window.digsigIcons;type.add(new Option('Icona','icon'));
    const fields=document.createElement('div');fields.id='iconWidgetFields';fields.className='hidden';
    fields.innerHTML='<label>Cerca un’icona<input id="iconSearch" type="search" placeholder="Es. palestra, doccia, freccia, acqua…" autocomplete="off"></label><p id="iconResultCount" class="muted" role="status"></p><div id="iconGallery" class="icon-gallery" role="group" aria-label="Scegli un’icona"></div><div id="iconSelected" class="icon-selected" aria-live="polite"></div><div class="grid-2 compact"><label>Colore icona<input id="iconColor" type="color" value="#ffffff"></label><label>Dimensione (% del box)<input id="iconScale" type="number" min="10" max="100" value="70" required></label></div><p class="muted">L’icona mantiene le proporzioni e rimane nitida a qualsiasi dimensione. Sfondo e allineamento si impostano qui sotto.</p>';
    document.getElementById('messageWidgetFields').insertAdjacentElement('afterend',fields);
    const search=document.getElementById('iconSearch'),gallery=document.getElementById('iconGallery'),color=document.getElementById('iconColor'),scale=document.getElementById('iconScale'),selected=document.getElementById('iconSelected');let id='info';
    function preview(){selected.innerHTML=icons.svg(id);const label=document.createElement('span');label.textContent='Selezionata: '+icons.get(id).label;selected.append(label);selected.querySelector('svg').style.color=color.value;}
    function draw(){const results=icons.search(search.value);gallery.replaceChildren();document.getElementById('iconResultCount').textContent=results.length?results.length+' icone disponibili':'Nessuna icona trovata. Prova un altro nome.';results.forEach(icon=>{const button=document.createElement('button');button.type='button';button.className='icon-choice';button.dataset.iconId=icon.id;button.setAttribute('aria-pressed',String(icon.id===id));button.innerHTML=icons.svg(icon.id);button.querySelector('svg').setAttribute('aria-hidden','true');const label=document.createElement('span');label.textContent=icon.label;button.append(label);button.addEventListener('click',()=>{id=icon.id;gallery.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.iconId===id)));preview();});gallery.append(button);});}
    search.addEventListener('input',draw);search.addEventListener('keydown',e=>{if(e.key==='Enter')e.preventDefault();});color.addEventListener('input',preview);
    window.digsigIconEditor={
      sync(){const on=type.value==='icon';fields.classList.toggle('hidden',!on);fields.querySelectorAll('input,button').forEach(el=>el.disabled=!on);},
      set(w={}){id=icons.get(w.iconId).id;search.value='';color.value=icons.color(w.iconColor,'#ffffff');scale.value=icons.scale(w.iconScale);draw();preview();this.sync();},
      get(){return {iconId:id,iconColor:color.value,iconScale:icons.scale(scale.value)};}
    };window.digsigIconEditor.set();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
