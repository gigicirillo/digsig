// Run with Node 20+ and Playwright installed: node tests/rss-widget.test.cjs
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
(async()=>{
  const browser=await chromium.launch({channel:'chrome',headless:true});
  try{
    const page=await browser.newPage();
    await page.clock.install({time:new Date('2026-10-15T23:59:40+02:00')});
    let requests=0,unavailable=false;
    await page.route('https://www.corriere.it/**',route=>{
      requests++;
      return route.fulfill({status:unavailable?503:200,contentType:'application/xml',headers:{'Access-Control-Allow-Origin':'*'},body:`<rss><channel>
        <item><title>Primo titolo</title><link>https://www.corriere.it/a</link><pubDate>Thu, 15 Oct 2026 22:00:00 +0200</pubDate></item>
        <item><title>Secondo titolo</title><link>https://www.corriere.it/b</link><pubDate>Thu, 15 Oct 2026 21:00:00 +0200</pubDate></item>
        <item><title>Primo titolo duplicato</title><link>https://www.corriere.it/a</link><pubDate>Thu, 15 Oct 2026 22:00:00 +0200</pubDate></item>
      </channel></rss>`});
    });
    await page.setContent('<div id="first"></div><div id="second"></div>');
    await page.addScriptTag({path:path.resolve(__dirname,'../assets/js/rss-widget.js')});
    await page.evaluate(()=>{digsigRSS.render(document.getElementById('first'),{rssFeed:'cronache',rssSeconds:5,rssBackfill:false});digsigRSS.render(document.getElementById('second'),{rssFeed:'cronache',rssSeconds:5,rssBackfill:false});});
    await page.waitForFunction(()=>document.querySelector('.rss-widget-title').textContent==='Primo titolo');
    assert.equal(requests,1,'Concurrent widgets share one request');
    await page.clock.fastForward(5000);
    assert.equal(await page.locator('#first .rss-widget-title').textContent(),'Secondo titolo');
    await page.clock.fastForward(20000);
    assert.equal(await page.locator('#first .rss-widget-title').textContent(),'Nessuna notizia nel periodo selezionato','Yesterday is excluded at Rome midnight');
    unavailable=true;await page.clock.fastForward(300000);
    await page.waitForFunction(()=>document.querySelector('.rss-widget-title').textContent==='Notizie temporaneamente non disponibili');
    assert.equal(requests,2,'The feed refreshes after five minutes');
    await page.evaluate(()=>document.body.replaceChildren());await page.waitForTimeout(30);
    await page.clock.fastForward(600000);assert.equal(requests,2,'Removed widgets stop refreshing');
    const parsed=await page.evaluate(()=>digsigRSS.parse('<rss><channel><item><title>&lt;img src=x onerror=alert(1)&gt;Test</title><link>javascript:alert(1)</link><pubDate>Thu, 15 Oct 2026 00:00:00 +0200</pubDate></item></channel></rss>'));
    assert.equal(parsed[0].title,'Test');assert.equal(parsed[0].link,'');
    const sequenceCheck=await page.evaluate(()=>{
      const now=Date.parse('2026-10-15T12:00:00+02:00');
      const items=Array.from({length:20},(_,i)=>({title:'News '+i,published:now-i*86400000}));
      return {count:digsigRSS.sequence(items,{},now).length,strict:digsigRSS.sequence(items,{rssBackfill:false},now).length,ten:digsigRSS.sequence(items,{rssCount:10},now).length,duration:digsigRSS.duration({}),custom:digsigRSS.duration({customDuration:true,duration:20})};
    });
    assert.deepEqual(sequenceCheck,{count:12,strict:1,ten:10,duration:144,custom:20});
    await page.route('https://www.corriere.it/**',route=>route.fulfill({status:200,contentType:'application/xml',headers:{'Access-Control-Allow-Origin':'*'},body:'<rss><channel>'+Array.from({length:15},(_,i)=>`<item><title>Notizia ${i+1}</title><link>https://www.corriere.it/test-${i}</link><pubDate>${new Date(Date.parse('2026-10-15T12:00:00+02:00')-i*3600000).toUTCString()}</pubDate></item>`).join('')+'</channel></rss>'}));
    await page.evaluate(()=>{document.body.innerHTML='<div id="news"></div>';digsigRSS.render(document.getElementById('news'),{id:'rotation-test',rssFeed:'politica',rssSeconds:5});});
    await page.waitForFunction(()=>document.querySelector('.rss-widget-title').textContent==='Notizia 1');
    const titles=[];
    for(let i=0;i<12;i++){titles.push(await page.locator('.rss-widget-title').textContent());await page.clock.fastForward(5000);}
    assert.equal(new Set(titles).size,12,'Twelve different headlines appear in succession');
    assert.equal(await page.locator('.rss-widget-title').textContent(),'Notizia 1','Sequence loops after the twelfth headline');
    console.log('PASS twelve headlines, strict filtering, configurable count and playlist duration');
    console.log('PASS RSS rotation, deduplication, shared fetch, Rome midnight, refresh, failure state, cleanup and safe text/links');
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
