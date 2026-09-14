(function(){
  function injectStyle(){
    if(document.getElementById('lyncaMediaCompactStyle'))return;
    const s=document.createElement('style');
    s.id='lyncaMediaCompactStyle';
    s.textContent=`
      #mediaModal{max-width:660px}
      #mediaForm{gap:10px}
      #mediaForm>label{gap:5px}
      .media-layout-fieldset{padding:11px 12px!important;display:block!important}
      .media-layout-fieldset legend{padding:0 6px}
      .media-dim-grid{display:grid!important;grid-template-columns:1fr 1fr;gap:8px 10px}
      .media-compact-label{display:flex!important;flex-direction:column!important;gap:4px!important;margin:0!important}
      .media-compact-label span{font-size:11px;color:var(--muted)}
      .media-compact-label input,.media-compact-label select{display:block!important;width:100%!important;padding:9px 10px!important}
      .media-size-meta{display:grid!important;grid-template-columns:auto minmax(120px,1fr) auto;align-items:center;gap:10px;margin-top:10px}
      .media-unit-toggle{display:flex!important;flex-direction:row!important;align-items:center!important;gap:7px!important;margin:0!important;white-space:nowrap}
      .media-unit-toggle input{width:auto!important;margin:0}
      .media-size-meta #mediaSizeHelp{display:block!important;margin:0;font-size:11px;color:var(--muted);line-height:1.25}
      .media-bg-label{display:grid!important;grid-template-columns:auto 42px;align-items:center;gap:7px!important;margin:0!important;color:var(--muted);font-size:11px;white-space:nowrap}
      .media-bg-label input[type="color"]{display:block!important;width:42px!important;height:32px!important;padding:2px!important;border-radius:8px}
      #standardDuration{margin-top:0}
      .media-duration-label{max-width:180px}
      #mediaForm .btn-primary{margin-top:2px}
      @media(max-width:560px){
        .media-dim-grid{grid-template-columns:1fr!important}
        .media-size-meta{grid-template-columns:1fr!important}
        .media-bg-label{grid-template-columns:1fr 42px!important}
      }
    `;
    document.head.appendChild(s);
  }

  function ensureBackgroundField(){
    const fs=$('mediaWidth')?.closest('fieldset');
    if(!fs)return null;
    let bg=$('mediaBackground');
    if(!bg){
      bg=document.createElement('input');
      bg.type='color';bg.name='mediaBackground';bg.id='mediaBackground';bg.value='#000000';
      fs.appendChild(bg);
    }
    return bg;
  }

  function makeCompactLabel(text,el){
    const l=document.createElement('label');
    l.className='media-compact-label';
    const sp=document.createElement('span');sp.textContent=text;
    l.appendChild(sp);l.appendChild(el);
    return l;
  }

  function enhanceMediaForm(){
    injectStyle();
    const fs=$('mediaWidth')?.closest('fieldset');
    if(!fs)return;
    const bg=ensureBackgroundField();
    if(fs.dataset.compactMedia==='1')return;
    fs.dataset.compactMedia='1';
    fs.classList.add('media-layout-fieldset');

    const w=$('mediaWidth'),h=$('mediaHeight'),px=$('mediaSizePx'),help=$('mediaSizeHelp'),ah=$('mediaAlignH'),av=$('mediaAlignV');
    const grid=document.createElement('div');grid.className='media-dim-grid';
    grid.appendChild(makeCompactLabel('Larghezza',w));
    grid.appendChild(makeCompactLabel('Altezza',h));
    grid.appendChild(makeCompactLabel('Allineamento orizzontale',ah));
    grid.appendChild(makeCompactLabel('Allineamento verticale',av));
    fs.insertBefore(grid,fs.firstChild);

    const meta=document.createElement('div');meta.className='media-size-meta';
    const pxLabel=document.createElement('label');pxLabel.className='media-unit-toggle';
    pxLabel.appendChild(px);pxLabel.appendChild(document.createTextNode(' Usa pixel'));
    meta.appendChild(pxLabel);
    meta.appendChild(help);

    const bgLabel=document.createElement('label');bgLabel.className='media-bg-label';
    const bgText=document.createElement('span');bgText.textContent='Sfondo';
    bgLabel.appendChild(bgText);bgLabel.appendChild(bg);
    meta.appendChild(bgLabel);
    fs.appendChild(meta);

    const standard=$('standardDuration'),dur=$('mediaDuration');
    if(standard&&dur&&!dur.closest('label')){
      const l=makeCompactLabel('Durata (secondi)',dur);l.classList.add('media-duration-label');standard.appendChild(l);
    }
  }

  function syncSizeHelp(){
    const w=Number($('mediaWidth')?.value)||100,h=Number($('mediaHeight')?.value)||100,u=$('mediaSizePx')?.checked?'px':'%';
    if($('mediaSizeHelp'))$('mediaSizeHelp').textContent=w+u+' × '+h+u+' · allineamento visibile sotto il 100%';
  }

  function resetSizeFields(){
    enhanceMediaForm();
    if(!$('mediaWidth'))return;
    $('mediaWidth').value=100;$('mediaHeight').value=100;$('mediaSizePx').checked=false;
    $('mediaAlignH').value='center';$('mediaAlignV').value='center';$('mediaBackground').value='#000000';syncSizeHelp();
  }

  function fillSizeFields(m){
    enhanceMediaForm();
    if(!$('mediaWidth'))return;
    $('mediaWidth').value=Number(m&&m.width)||100;$('mediaHeight').value=Number(m&&m.height)||100;
    $('mediaSizePx').checked=(m&&m.sizeUnit)==='px';$('mediaAlignH').value=m&&m.alignH||'center';
    $('mediaAlignV').value=m&&m.alignV||'center';$('mediaBackground').value=m&&m.backgroundColor||'#000000';syncSizeHelp();
  }

  enhanceMediaForm();
  const originalEditMedia=window.editMedia;
  window.editMedia=function(id){
    originalEditMedia(id);
    const m=state.config.media.find(x=>x.id===id);
    fillSizeFields(m);
  };

  $('newMediaBtn')?.addEventListener('click',()=>setTimeout(resetSizeFields,0));
  $('mediaWidth')?.addEventListener('input',syncSizeHelp);
  $('mediaHeight')?.addEventListener('input',syncSizeHelp);
  $('mediaSizePx')?.addEventListener('change',syncSizeHelp);

  $('mediaForm')?.addEventListener('submit',function(e){
    e.stopImmediatePropagation();e.preventDefault();
    (async()=>{
      const f=new FormData(e.currentTarget),editId=f.get('editId'),name=f.get('name'),type=f.get('type');
      const width=Number(f.get('mediaWidth'))||100,height=Number(f.get('mediaHeight'))||100,sizeUnit=$('mediaSizePx').checked?'px':'%',alignH=f.get('mediaAlignH')||'center',alignV=f.get('mediaAlignV')||'center',backgroundColor=f.get('mediaBackground')||'#000000';
      if(width<1||height<1){notice('Width e Height devono essere maggiori di zero.','warn');return}
      const item={id:editId||slug(name),name,type,width,height,sizeUnit,alignH,alignV,backgroundColor};
      if(type==='video'){
        item.customDuration=$('customVideoDuration').checked;
        if(item.customDuration){const d=Number($('videoDuration').value);if(!d||d<1){notice('Inserisci una durata video valida.','warn');return}item.duration=d}
      }else item.duration=Number(f.get('duration'))||15;
      if(type==='html'){item.headline=f.get('headline')||name;item.subheadline=f.get('subheadline')||'';item.background=f.get('background')||backgroundColor}
      else if(type==='rawhtml'){item.htmlCode=f.get('htmlCode')||''}
      else item.url=f.get('url')||'';
      if(editId){const i=state.config.media.findIndex(x=>x.id===editId);if(i<0){notice('Media non trovato.','warn');return}state.config.media[i]={...state.config.media[i],...item}}
      else state.config.media.push(item);
      await saveConfig(editId?'Media aggiornato':'Media aggiunto');
      e.currentTarget.reset();$('mediaModal').close();
    })();
  },true);
})();