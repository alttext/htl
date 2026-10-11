import {test,expect} from '@playwright/test';
import {resolve} from 'node:path';
import {readFile} from 'node:fs/promises';
test('standalone HTML plays with external network requests blocked',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route(/^https?:/,route=>route.abort());
 await page.setContent(await readFile(resolve('dist/heart-the-lover-playtest.html'),'utf8'));
 await expect(page.getByRole('heading',{name:'Who will you ask?'})).toBeVisible();
 await page.getByRole('button',{name:'How to play'}).click();await page.getByRole('button',{name:'Back to the table'}).click();
 await page.getByText('Try a different phrase',{exact:true}).click();await page.getByRole('button',{name:'Can I have…',exact:true}).click();
 await expect(page.getByRole('heading',{name:'A slip of the tongue!'})).toBeVisible();
 expect(errors).toEqual([]);
});
