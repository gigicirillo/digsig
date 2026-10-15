(function () {
  function init() {
    const textarea = document.getElementById('messageText');
    if (!textarea) return;
    const label = textarea.parentElement;
    const wrapper = document.createElement('div');
    wrapper.className = 'message-editor';
    wrapper.innerHTML = `<div class="message-editor-toolbar" role="group" aria-label="Formattazione messaggio">
      <label>Font<select data-command="fontName"><option>Arial</option><option>Verdana</option><option>Georgia</option><option>Times New Roman</option><option>Courier New</option><option>Trebuchet MS</option></select></label>
      <label>Dimensione (px)<input data-size type="number" min="8" max="300" value="48"></label>
      <button type="button" data-command="bold" aria-label="Grassetto"><b>B</b></button>
      <button type="button" data-command="italic" aria-label="Corsivo"><i>I</i></button>
      <button type="button" data-command="underline" aria-label="Sottolineato"><u>U</u></button>
      <button type="button" data-command="strikeThrough">Barrato</button>
      <label>Colore<input type="color" data-command="foreColor" value="#ffffff"></label>
      <button type="button" data-command="justifyLeft">Sinistra</button>
      <button type="button" data-command="justifyCenter">Centro</button>
      <button type="button" data-command="justifyRight">Destra</button>
      <button type="button" data-command="insertUnorderedList">Elenco</button>
      <button type="button" data-command="removeFormat">Rimuovi formato</button>
    </div><div class="message-editor-content" contenteditable="true" role="textbox" aria-label="Testo del messaggio" aria-multiline="true"></div><p class="muted">Seleziona il testo per formattarlo. Le dimensioni sono espresse in pixel sullo schermo TV.</p>`;
    label.insertAdjacentElement('afterend', wrapper);
    label.hidden = true;
    textarea.required = false;
    const editor = wrapper.querySelector('[contenteditable]');
    let range = null;
    document.addEventListener('selectionchange', () => {
      const selection = window.getSelection();
      if (selection.rangeCount && editor.contains(selection.anchorNode) && editor.contains(selection.focusNode)) range = selection.getRangeAt(0).cloneRange();
    });
    function sync() { textarea.value = editor.innerText; }
    function restore() {
      editor.focus(); const selection = window.getSelection();
      selection.removeAllRanges();
      if (range && editor.contains(range.commonAncestorContainer)) selection.addRange(range);
      else { const all = document.createRange(); all.selectNodeContents(editor); selection.addRange(all); }
    }
    wrapper.querySelectorAll('button').forEach(button => button.addEventListener('mousedown', e => e.preventDefault()));
    wrapper.querySelectorAll('[data-command]').forEach(control => control.addEventListener(control.tagName === 'BUTTON' ? 'click' : 'change', () => {
      restore(); document.execCommand('styleWithCSS', false, true);
      document.execCommand(control.dataset.command, false, control.value || null); sync();
    }));
    wrapper.querySelector('[data-size]').addEventListener('change', e => {
      const size = Math.max(8, Math.min(300, Number(e.target.value) || 48)); e.target.value = size;
      restore(); document.execCommand('styleWithCSS', false, false); document.execCommand('fontSize', false, '7');
      editor.querySelectorAll('font[size="7"]').forEach(font => { font.removeAttribute('size'); font.style.fontSize = size + 'px'; }); sync();
    });
    editor.addEventListener('input', sync);
    editor.addEventListener('paste', e => {
      e.preventDefault();
      const html = e.clipboardData.getData('text/html');
      if (html) document.execCommand('insertHTML', false, window.digsigMessageHTML.sanitize(html));
      else document.execCommand('insertText', false, e.clipboardData.getData('text/plain'));
      sync();
    });
    editor.addEventListener('drop', e => e.preventDefault());
    window.digsigMessageEditor = {
      set(widget) { editor.innerHTML = window.digsigMessageHTML.render(widget || {}); range = null; sync(); },
      get() { sync(); return window.digsigMessageHTML.sanitize(editor.innerHTML); }
    };
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
