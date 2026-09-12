(function(){
  function injectStyle(){if(document.getElementById('lyncaMediaCompactStyle'))return;const s=document.createElement('style');s.id='lyncaMediaCompactStyle';s.textContent=`
    #mediaModal{max-width:620px}
    #mediaForm{gap:10px}
    #mediaForm>label{gap:5px}
    .media-layout-fieldset{padding:10px 12px}
    .media-dim-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px 10px}
    .media-compact-label{gap:4px!important;margin:0!important}
    .media-compact-label span{font-size:11px;color:var(--muted)}
    .media-compact-label input,.media-compact-label select{padding:9px 10px}
    .media-size-meta{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:10px;margin-top:9px}
    .media-unit-toggle{flex-direction:row;align-items:center;gap:7px;margin:0;white-space:nowrap}
    .media-unit-toggle input{width:auto}
    .media-size-meta #mediaSizeHelp{margin:0;font-size:11px;color:var(--muted)}
    .media-bg-label{display:grid!important;grid-template-columns:auto 46px;align-items:center;gap:8px!important;margin:0!important;color:var(--muted);font-size:11px}
    .media-bg-label input{width:46px!important;height:32px!important;padding:2px!important;border-radius:8px}
    #standardDuration{margin-top:0}
    .media-duration-label{max-width:180px}
    #mediaForm .btn-primary{margin-top:2px}
    @media(max-width:560px){.media-dim-grid{grid-template-columns:1fr}.media-size-meta{grid-template-columns:1fr}.media-bg-label{grid-template-columns:1fr 46px}}
  `;document.head.appendChild(s)}
  function ensureBackgroundField(){if($('mediaBackground'))return;const fs=$('mediaWidth')?.closest('fieldset');if(!fs)return;const label=document.createElement('label');label.innerHTML='Sfondo media <input name="mediaBackground" id="mediaBackground" type="color" value="#000000">';fs.appendChild(label)}
  function enhanceMediaForm(){
    injectStyle();ensureBackgroundField();
    const fs=$('mediaWidth')?.closest('fieldset');if(!fs||fs.dataset.compactMedia==='1')return;fs.dataset.compactMedia='1';fs.classList.add('media-layout-fieldset');
    const w=$('mediaWidth'),h=$('mediaHeight'),px=$('mediaSizePx'),help=$('mediaSizeHelp'),ah=$('mediaAlignH'),av=$('mediaAlignV'),bg=$('mediaBackground');
    const grid=document.createElement('div');grid.className='media-dim-grid';
    const make=(text,el)=>{const l=document.createElement('label');l.className='media-compact-label';const sp=document.createElement('span');sp.textContent=text;l.appendChild(sp);l.appendChild(el);return l};
    grid.appendChild(make('Larghezza',w));grid.appendChild(make('Altezza',h));grid.appendChild(make('Allineamento orizzontale',ah));grid.appendChild(make('Allineamento verticale',av));
    fs.insertBefore(grid,fs.firstChild);
    const meta=document.createElement('div');meta.className='media-size-meta';
    const pxLabel=document.createElement('label');pxLabel.className='media-unit-toggle';pxLabel.appendChild(px);pxLabel.appendChild(document.createTextNode('Pixel'));
    meta.appendChild(pxLabel);meta.appendChild(help);
    const bgParent=bg?.parentElement;if(bgParent){bgParent.classList.add('media-bg-label');if(!/Sfondo media/.test(bgParent.textContent||''))bgParent.insertBefore(document.createTextNode('Sfondo media'),bg);meta.appendChild(bgParent)}
    fs.appendChild(meta);
    const standard=$('standardDuration'),dur=$('mediaDuration');if(standard&&dur&&!dur.closest('label')){const l=make('Durata (secondi)',dur);l.classList.add('media-duration-label');standard.appendChild(l)}
  }
  function syncSizeHelp(){const w=Number($('mediaWidth').value)||100,h=Number($('mediaHeight').value)||100,u=$('mediaSizePx').checked?'px':'%';$('mediaSizeHelp').textContent=w+u+' × '+h+u+' · l’allineamento è visibile se il media è più piccolo dell’area'}
  function resetSizeFields(){enhanceMediaForm();if(!$('mediaWidth'))return;$('mediaWidth').value=100;$('mediaHeight').value=100;$('mediaSizePx').checked=false;$('mediaAlignH').value='center';$('mediaAlignV').value='center';$('mediaBackground').value='#000000';syncSizeHelp()}
  function fillSizeFields(m){enhanceMediaForm();if(!$('mediaWidth'))return;$('mediaWidth').value=Number(m&&m.width)||100;$('mediaHeight').value=Number(m&&m.height)||100;$('mediaSizePx').checked=(m&&m.sizeUnit)==='px';$('mediaAlignH').value=m&&m.alignH||'center';$('mediaAlignV').value=m&&m.alignV||'center';$('mediaBackground').value=m&&m.backgroundColor||'#000000';syncSizeHelp()}
  enhanceMediaForm();
  const originalEditMedia=window.editMedia;
  window.editMedia=function(id){originalEditMedia(id);const m=state.config.media.find(x=>x.id===id);fillSizeFields(m)};
  $('newMediaBtn')?.addEventListener('click',()=>setTimeout(resetSizeFields,0));
  $('mediaWidth')?.addEventListener('input',syncSizeHelp);$('mediaHeight')?.addEventListener('input',syncSizeHelp);$('mediaSizePx')?.addEventListener('change',syncSizeHelp);
  $('mediaForm')?.addEventListener('submit',function(e){e.stopImmediatePropagation();e.preventDefault();(async()=>{const f=new FormData(e.currentTarget),editId=f.get('editId'),name=f.get('name'),type=f.get('type');const width=Number(f.get('mediaWidth'))||100,height=Number(f.get('mediaHeight'))||100,sizeUnit=$('mediaSizePx').checked?'px':'%',alignH=f.get('mediaAlignH')||'center',alignV=f.get('mediaAlignV')||'center',backgroundColor=f.get('mediaBackground')||'#000000';if(width<1||height<1){notice('Width e Height devono essere maggiori di zero.','warn');return}const item={id:editId||slug(name),name,type,width,height,sizeUnit,alignH,alignV,backgroundColor};if(type==='video'){item.customDuration=$('customVideoDuration').checked;if(item.customDuration){const d=Number($('videoDuration').value);if(!d||d<1){notice('Inserisci una durata video valida.','warn');return}item.duration=d}}else item.duration=Number(f.get('duration'))||15;if(type==='html'){item.headline=f.get('headline')||name;item.subheadline=f.get('subheadline')||'';item.background=f.get('background')||backgroundColor}else if(type==='rawhtml'){item.htmlCode=f.get('htmlCode')||''}else item.url=f.get('url')||'';if(editId){const i=state.config.media.findIndex(x=>x.id===editId);if(i<0){notice('Media non trovato.','warn');return}state.config.media[i]={...state.config.media[i],...item}}else state.config.media.push(item);await saveConfig(editId?'Media aggiornato':'Media aggiunto');e.currentTarget.reset();$('mediaModal').close()})()},true);
})();