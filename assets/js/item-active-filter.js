(function(){
  function active(o){if(!o)return false;const d=new Date(),today=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');if(o.activeFrom&&today<o.activeFrom)return false;if(o.activeTo&&today>o.activeTo)return false;return true}
  window.lyncaItemIsActive=active;
  if(typeof resolve==='function'){
    const old=resolve;
    resolve=function(c){
      const runtime={...c,media:(c.media||[]).filter(active),widgets:(c.widgets||[]).filter(active)};
      return old(runtime);
    };
  }
})();