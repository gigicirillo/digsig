(function(){
  function refresh(select){
    if(!select)return;
    let host=select.parentElement;
    if(host.tagName==='LABEL'){
      const replacement=document.createElement('div');
      Array.from(host.attributes).forEach(a=>replacement.setAttribute(a.name,a.value));
      while(host.firstChild)replacement.appendChild(host.firstChild);
      host.replaceWith(replacement);host=replacement;
    }
    host.classList.add('selection-field');select.multiple=true;select.style.display='none';
    let box=host.querySelector('.multi-choice');
    if(!box){box=document.createElement('div');box.className='multi-choice';box.id=select.id+'Choices';box.setAttribute('role','group');box.setAttribute('aria-label',select.id==='screenPlaylist'?'Playlist dello schermo':'Contenuti del box');select.after(box);const note=document.createElement('small');note.className='muted';note.textContent='Spunta gli elementi desiderati, anche non consecutivi. Riproduzione nell’ordine dell’elenco.';box.after(note)}
    const options=Array.from(select.options).filter(o=>o.value),signature=JSON.stringify(options.map(o=>[o.value,o.textContent]));
    if(box.dataset.signature!==signature){
      box.dataset.signature=signature;box.replaceChildren();
      options.forEach(option=>{
        const label=document.createElement('label'),input=document.createElement('input'),text=document.createElement('span');label.className='multi-choice-row';input.type='checkbox';input.value=option.value;text.textContent=option.textContent;
        input.addEventListener('change',()=>{const current=Array.from(select.options).find(o=>o.value===input.value);if(current)current.selected=input.checked;select.dispatchEvent(new Event('change',{bubbles:true}));refresh(select)});
        label.append(input,text);box.appendChild(label);
      });
      if(!options.length)box.textContent='Nessun elemento disponibile.';
    }
    box.querySelectorAll('input').forEach(input=>{input.checked=options.some(o=>o.value===input.value&&o.selected);input.disabled=select.disabled;input.parentElement.classList.toggle('selected',input.checked)});
  }
  window.digsigMultiChoice={refresh};
})();
