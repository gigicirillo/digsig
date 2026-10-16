(function(){
  function id(raw){try{const u=new URL(raw),host=u.hostname.replace(/^www\./,'');let value='';if(host==='youtu.be')value=u.pathname.slice(1).split('/')[0];else if(['youtube.com','m.youtube.com','youtube-nocookie.com'].includes(host))value=u.searchParams.get('v')||(/^\/(?:embed|shorts|live)\/([^/]+)/.exec(u.pathname)||[])[1];return /^[\w-]{11}$/.test(value||'')?value:''}catch(e){return ''}}
  let loading;
  function api(){if(window.YT&&window.YT.Player)return Promise.resolve(window.YT);if(loading)return loading;loading=new Promise((resolve,reject)=>{let timeout;const previous=window.onYouTubeIframeAPIReady;window.onYouTubeIframeAPIReady=()=>{clearTimeout(timeout);resolve(window.YT);if(previous)previous()};const script=document.createElement('script');script.src='https://www.youtube.com/iframe_api';script.onerror=()=>{clearTimeout(timeout);loading=null;reject(new Error('YouTube non disponibile'))};timeout=setTimeout(()=>{loading=null;reject(new Error('YouTube non disponibile'))},30000);document.head.appendChild(script)});return loading}
  const active=new Set();new MutationObserver(()=>active.forEach(x=>{if(!x.box.isConnected){x.dispose();active.delete(x)}})).observe(document.documentElement,{childList:true,subtree:true});
  function render(box,item,done){
    let player=null,disposed=false,finished=false,timer=null,started=false;const slot=document.createElement('div');box.replaceChildren(slot);
    const finish=()=>{if(disposed||finished)return;finished=true;clearTimeout(timer);done()};
    function error(){if(disposed)return;box.textContent='Video YouTube non disponibile o non incorporabile.';timer=setTimeout(finish,5000)}
    active.add({box,dispose(){disposed=true;clearTimeout(timer);if(player)try{player.destroy()}catch(e){}}});
    api().then(YT=>{if(disposed)return;player=new YT.Player(slot,{host:'https://www.youtube-nocookie.com',videoId:id(item.url),width:'100%',height:'100%',playerVars:{autoplay:1,mute:1,playsinline:1,controls:1,rel:0,origin:location.origin},events:{
      onReady:e=>{if(disposed)return;e.target.mute();e.target.playVideo()},
      onStateChange:e=>{if(disposed||finished)return;if(e.data===1&&!started){started=true;if(item.customDuration)timer=setTimeout(finish,Math.max(1,Number(item.duration)||15)*1000)}if(e.data===0){if(item.customDuration){e.target.seekTo(0,true);e.target.playVideo()}else finish()}},
      onError:error
    }});}).catch(error);
  }
  window.digsigYouTube={id,render};
})();
