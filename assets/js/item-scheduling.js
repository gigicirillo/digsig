(function(){
  function ensure(prefix){const form=document.getElementById(prefix+'Form');if(!form||document.getElementById(prefix+'ActiveFrom'))return;const field=document.createElement('fieldset');field.innerHTML='<legend>Periodo di visualizzazione</legend><div class="grid-2"><label>Data DA<input type="date" id="'+prefix+'ActiveFrom"></label><label>Data A<input type="date" id="'+prefix+'ActiveTo"></label></div><p class="muted">Lascia vuoto per mostrare sempre il contenuto.</p>';form.appendChild(field)}
  window.digsigItemDates={set(prefix,obj={}){ensure(prefix);document.getElementById(prefix+'ActiveFrom').value=obj.activeFrom||'';document.getElementById(prefix+'ActiveTo').value=obj.activeTo||''},get(prefix){ensure(prefix);return {activeFrom:document.getElementById(prefix+'ActiveFrom').value,activeTo:document.getElementById(prefix+'ActiveTo').value}}};
  ensure('media');ensure('widget');
})();
