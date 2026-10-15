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
    await page.evaluate(()=>{digsigRSS.render(document.getElementById('first'),{rssFeed:'cronache',rssSeconds:5});digsigRSS.render(document.getElementById('second'),{rssFeed:'cronache',rssSeconds:5});});
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
    console.log('PASS RSS rotation, deduplication, shared fetch, Rome midnight, refresh, failure state, cleanup and safe text/links');
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
