(function(){
  if(typeof showItem!=='function')return;
  var originalShowItem=showItem;
  showItem=function(item){
    if(item&&item.type==='rawhtml'){
      clearStage();
      var duration=Number(item.duration)||15;
      var f=document.createElement('iframe');
      f.className='web rawhtml-frame';
      f.setAttribute('sandbox','allow-scripts allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin');
      f.srcdoc=item.htmlCode||'';
      stage.appendChild(f);
      addProgress(duration);
      timer=setTimeout(next,duration*1000);
      return;
    }
    return originalShowItem(item);
  };
})();