(function(){
  function escAttr(s){return String(s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
  function ensureHtmlOption(){
    var type=document.getElementById('mediaType');if(!type)return;
    if(!type.querySelector('option[value="rawhtml"]')){var o=document.createElement('option');o.value='rawhtml';o.textContent='HTML';type.appendChild(o)}
  }
  function ensureEditor(){
    var form=document.getElementById('mediaForm');if(!form||document.getElementById('rawHtmlFields'))return;
    var htmlFields=document.getElementById('htmlFields');
    var box=document.createElement('div');box.id='rawHtmlFields';box.className='hidden';
    box.innerHTML='<label>Codice HTML<textarea name="htmlCode" id="htmlCode" class="html-code-editor" spellcheck="false" placeholder="<!doctype html>\n<html>...\n</html>"></textarea></label><div class="card-actions"><button type="button" class="mini-btn" id="previewHtmlCodeBtn">Preview HTML</button></div>';
    (htmlFields||form.querySelector('#standardDuration')).insertAdjacentElement('afterend',box);
    document.getElementById('previewHtmlCodeBtn').addEventListener('click',function(){openHtmlPreview(document.getElementById('htmlCode').value||'',document.querySelector('#mediaForm [name="name"]').value||'Preview HTML')});
  }
  function syncFields(){
    var type=document.getElementById('mediaType');if(!type)return;var v=type.value;
    var raw=v==='rawhtml',slide=v==='html';
    var rawBox=document.getElementById('rawHtmlFields'),htmlFields=document.getElementById('htmlFields'),urlFields=document.getElementById('urlFields');
    if(rawBox)rawBox.classList.toggle('hidden',!raw);
    if(htmlFields)htmlFields.classList.toggle('hidden',!slide);
    if(urlFields)urlFields.classList.toggle('hidden',raw||slide);
  }
  function ensurePreviewDialog(){
    if(document.getElementById('mediaPreviewModal'))return;
    var d=document.createElement('dialog');d.id='mediaPreviewModal';d.className='preview-modal';
    d.innerHTML='<div class="preview-card"><div class="modal-head"><div><p class="eyebrow">MEDIA PREVIEW</p><h2 id="mediaPreviewTitle">Media</h2></div><button type="button" class="icon-btn" id="closeMediaPreview">×</button></div><div class="preview-frame-wrap"><iframe id="mediaPreviewFrame" title="Anteprima media" sandbox="allow-scripts allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin"></iframe></div><div class="preview-foot"><span id="mediaPreviewMeta" class="muted"></span></div></div>';
    document.body.appendChild(d);
    document.getElementById('closeMediaPreview').addEventListener('click',closeMediaPreview);
    d.addEventListener('click',function(e){if(e.target===d)closeMediaPreview()});
  }
  function closeMediaPreview(){var d=document.getElementById('mediaPreviewModal');if(!d)return;document.getElementById('mediaPreviewFrame').src='about:blank';d.close()}
  function openHtmlPreview(code,title){ensurePreviewDialog();document.getElementById('mediaPreviewTitle').textContent=title||'HTML';document.getElementById('mediaPreviewMeta').textContent='HTML · preview';document.getElementById('mediaPreviewFrame').srcdoc=code||'<body style="background:#111;color:#fff;font-family:Arial;display:grid;place-items:center;height:100vh;margin:0">HTML vuoto</body>';document.getElementById('mediaPreviewModal').showModal()}
  function mediaPreview(id){
    if(!window.state||!state.config)return;var m=state.config.media.find(function(x){return x.id===id});if(!m)return;ensurePreviewDialog();
    var f=document.getElementById('mediaPreviewFrame'),title=document.getElementById('mediaPreviewTitle'),meta=document.getElementById('mediaPreviewMeta');title.textContent=m.name||'Media';meta.textContent=(m.type||'media')+' · '+(m.type==='video'&&!m.customDuration?'durata naturale':((Number(m.duration)||15)+'s'));
    if(m.type==='rawhtml'){f.srcdoc=m.htmlCode||''}
    else if(m.type==='html'){f.srcdoc='<!doctype html><html><body style="margin:0;background:'+(m.background||'#111')+';color:#fff;font-family:Inter,Arial,sans-serif;display:grid;place-items:center;height:100vh;text-align:center"><div><h1 style="font-size:7vw;margin:0">'+(m.headline||'')+'</h1><p style="font-size:2vw;opacity:.8">'+(m.subheadline||'')+'</p></div></body></html>'}
    else if(m.type==='image'){f.srcdoc='<!doctype html><html><body style="margin:0;background:#000;height:100vh"><img src="'+escAttr(m.url)+'" style="width:100%;height:100%;object-fit:contain"></body></html>'}
    else if(m.type==='video'){var yt=String(m.url||'').match(/(?:youtube\.com\/watch\?[^#]*v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/|youtube\.com\/live\/)([A-Za-z0-9_-]{6,})/i);if(yt)f.src='https://www.youtube-nocookie.com/embed/'+encodeURIComponent(yt[1])+'?autoplay=1&mute=1&controls=0&rel=0&playsinline=1';else f.srcdoc='<!doctype html><html><body style="margin:0;background:#000;height:100vh"><video src="'+escAttr(m.url)+'" autoplay muted controls style="width:100%;height:100%;object-fit:contain"></video></body></html>'}
    else if(m.type==='web')f.src=m.url;else f.srcdoc='';
    document.getElementById('mediaPreviewModal').showModal()
  }
  window.mediaPreview=mediaPreview;
  function enhanceCards(){
    var box=document.getElementById('mediaCards');if(!box||!window.state||!state.config)return;var cards=box.querySelectorAll('.card');
    cards.forEach(function(card,i){if(card.querySelector('.media-preview-btn'))return;var m=state.config.media[i];if(!m)return;var actions=card.querySelector('.card-actions');if(!actions)return;var b=document.createElement('button');b.type='button';b.className='mini-btn media-preview-btn';b.textContent='Preview';b.addEventListener('click',function(){mediaPreview(m.id)});actions.insertBefore(b,actions.firstChild)})
  }
  function patchMediaFunctions(){
    if(typeof window.editMedia==='function'&&!window.__htmlEditPatched){var original=window.editMedia;window.editMedia=function(id){original(id);var m=state.config.media.find(function(x){return x.id===id});if(!m)return;ensureHtmlOption();ensureEditor();if(m.type==='rawhtml'){document.getElementById('mediaType').value='rawhtml';document.getElementById('htmlCode').value=m.htmlCode||'';syncFields()}else document.getElementById('htmlCode').value=''};window.__htmlEditPatched=true}
    var form=document.getElementById('mediaForm');if(form&&!form.dataset.rawhtmlCapture){form.dataset.rawhtmlCapture='1';form.addEventListener('submit',function(e){var type=document.getElementById('mediaType').value;if(type!=='rawhtml')return;e.preventDefault();e.stopImmediatePropagation();(async function(){var fd=new FormData(form),editId=fd.get('editId'),name=fd.get('name'),item={id:editId||slug(name),name:name,type:'rawhtml',htmlCode:document.getElementById('htmlCode').value||'',duration:Number(fd.get('duration'))||15};if(editId){var i=state.config.media.findIndex(function(x){return x.id===editId});state.config.media[i]=item}else state.config.media.push(item);await saveConfig(editId?'Media HTML aggiornato':'Media HTML aggiunto');form.reset();document.getElementById('mediaModal').close()})()},true)}
  }
  function init(){ensureHtmlOption();ensureEditor();ensurePreviewDialog();patchMediaFunctions();var type=document.getElementById('mediaType');if(type)type.addEventListener('change',syncFields);var cards=document.getElementById('mediaCards');if(cards)new MutationObserver(enhanceCards).observe(cards,{childList:true,subtree:true});enhanceCards();setInterval(function(){patchMediaFunctions();enhanceCards()},1000)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();