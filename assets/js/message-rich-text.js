/* Shared formatting rules for the editor, previews and TV players. */
(function () {
  const tags = new Set(['DIV','P','BR','SPAN','B','STRONG','I','EM','U','S','STRIKE','UL','OL','LI','FONT']);
  const properties = ['font-family','font-size','font-weight','font-style','text-decoration','text-align','color','background-color'];
  function sanitize(html) {
    const source = document.createElement('template');
    source.innerHTML = String(html || '');
    const output = document.createElement('div');
    function copy(node, parent) {
      if (node.nodeType === 3) { parent.appendChild(document.createTextNode(node.textContent)); return; }
      if (node.nodeType !== 1 || ['SCRIPT','STYLE','IFRAME','OBJECT','SVG','MATH'].includes(node.tagName)) return;
      if (!tags.has(node.tagName)) { node.childNodes.forEach(child => copy(child, parent)); return; }
      const clean = document.createElement(node.tagName === 'FONT' ? 'span' : node.tagName.toLowerCase());
      properties.forEach(key => { const value = node.style.getPropertyValue(key); if (value && !/url\s*\(|var\s*\(/i.test(value)) clean.style.setProperty(key, value); });
      if (node.tagName === 'FONT') {
        if (node.getAttribute('face')) clean.style.fontFamily = node.getAttribute('face');
        if (node.getAttribute('color')) clean.style.color = node.getAttribute('color');
      }
      node.childNodes.forEach(child => copy(child, clean));
      parent.appendChild(clean);
    }
    source.content.childNodes.forEach(node => copy(node, output));
    return output.innerHTML;
  }
  function render(w) {
    if (typeof w.messageHtml === 'string' && w.messageHtml.trim()) return sanitize(w.messageHtml);
    const box = document.createElement('div'); box.textContent = w.messageText || '';
    return box.innerHTML.replace(/\n/g, '<br>');
  }
  window.digsigMessageHTML = { sanitize, render };
})();
