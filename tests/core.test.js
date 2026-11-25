import test from 'node:test';
import assert from 'node:assert/strict';
import { themeAt, loadReviews, saveSystemInfo, storageEntries, submitContact, FORM_DELAY } from '../shared/core.js';
test('day and night boundaries', () => {
  for (const [h, m, expected] of [[6,59,'dark'],[7,0,'light'],[20,59,'light'],[21,0,'dark'],[0,0,'dark']]) {
    assert.equal(themeAt(new Date(2026, 10, 2, h, m)), expected);
  }
  assert.equal(FORM_DELAY, 60000);
});
test('variant 13 request preserves server order', async () => {
  const records = [{id:65},{id:61}]; let requested;
  assert.deepEqual(await loadReviews(undefined, async url => { requested=url; return {ok:true,json:async()=>records}; }), records);
  assert.equal(requested, 'https://jsonplaceholder.typicode.com/posts/13/comments');
});
test('HTTP errors are not mistaken for reviews', async () => {
  await assert.rejects(loadReviews(undefined, async()=>({ok:false,status:503})), /503/);
});
test('system information stored and every existing key read back', () => {
  const map = new Map([['existing','value']]);
  const store={setItem:(k,v)=>map.set(k,v),getItem:k=>map.get(k),key:i=>[...map.keys()][i],get length(){return map.size;}};
  saveSystemInfo({userAgent:'Browser',platform:'OS',languages:['uk'],language:'uk',onLine:true}, {width:100,height:200,colorDepth:24}, store);
  assert.equal(JSON.parse(store.getItem('lab4.system')).platform,'OS');
  assert.equal(storageEntries(store).length,2);
});
test('missing endpoint sends no data; valid endpoint posts and checks HTTP', async () => {
  let called=false;
  await assert.rejects(submitContact('', {}, async()=>{called=true;}), /Formspree/);
  assert.equal(called,false);
  const result=await submitContact('https://formspree.io/f/abcdefgh', {}, async(url, opts)=>{assert.equal(opts.method,'POST'); return {ok:true};});
  assert.equal(result,true);
  await assert.rejects(submitContact('https://formspree.io/f/abcdefgh', {},async()=>({ok:false,status:422})),/422/);
});
