import {test,expect} from '@playwright/test';
import {createGame,legalCards} from '../../src/game.js';
async function seed(page,state){await page.addInitScript(s=>{if(!sessionStorage.getItem('test-seeded')){localStorage.setItem('htl-v1',JSON.stringify({version:1,state:s}));sessionStorage.setItem('test-seeded','1');}},state);await page.goto('/');}
test('iPhone layout, successful request, thanks, transfer, and restored progress',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));const s=createGame(8);const card=legalCards(s).find(c=>s.hands[1].includes(c.id));await seed(page,s);
 await expect(page.getByRole('heading',{name:'Heart the Lover'})).toBeVisible();
 await page.locator(`[data-suit="${card.suit}"]`).click();await page.locator('#card').selectOption(card.id);
 await page.getByRole('button',{name:'May I please have…',exact:true}).click();await expect(page.getByRole('button',{name:'Thank you',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Thank you',exact:true}).click();await page.getByRole('button',{name:'Take the card',exact:true}).click();
 await expect(page.locator('.hand-heading')).toContainText('13 cards');
 await page.reload();await expect(page.locator('.hand-heading')).toContainText('13 cards');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(errors).toEqual([]);
 await page.screenshot({path:'/tmp/htl-iphone.png',fullPage:true});
});
test('bot manners violation can be challenged by the human',async({page})=>{const s=createGame(8);s.turn=1;s.phase='violation';s.offer={target:0,card:s.hands[0][0]};s.log.push('Jos made a mistake in the ask.');await seed(page,s);await page.getByRole('button',{name:'Sir Hincomb Funnibuster!',exact:true}).click();await expect(page.getByRole('heading',{name:'Who will you ask?'})).toBeVisible();});
test('tutorial opens and closes; all hand families remain accessible at 320px',async({page})=>{await page.setViewportSize({width:320,height:680});await seed(page,createGame(8));await page.getByRole('button',{name:'How to play'}).click();await expect(page.getByRole('dialog')).toBeVisible();await page.getByRole('button',{name:'Back to the table'}).click();await expect(page.getByRole('dialog')).toHaveCount(0);for(const suit of ['hearts','diamonds','spades','clubs']){await page.locator(`[data-suit="${suit}"]`).click();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}});
