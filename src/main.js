import './style.css';
import {families,deck,cardById,createGame,transition,legalCards,botView,chooseAsk} from './game.js';
import {difficulties,rememberedView} from './difficulty.js';
const app=document.querySelector('#app');
let difficulty='standard',deadline=null,remaining=null,countdown=null;
try{const saved=localStorage.getItem('htl-difficulty');if(difficulties[saved])difficulty=saved;}catch{}
let state=createGame(),selectedSuit='hearts',target=1,selectedCard='',timer=null,help=false,error='';
try {const saved=JSON.parse(localStorage.getItem('htl-v1'));if(saved&&saved.version===1&&saved.state.hands.flat().length===36&&new Set(saved.state.hands.flat()).size===36&&saved.state.hands.flat().every(id=>cardById[id]))state=saved.state;}catch{}
function save(){try{localStorage.setItem('htl-v1',JSON.stringify({version:1,state}));}catch{}}
function act(event){try{state=transition(state,event);deadline=null;remaining=null;error='';save();render();}catch(e){error=e.message;render();}}
function cardHTML(c,small=false){return `<div class="playing-card ${c.suit} ${small?'small':''}" aria-label="${c.name}"><span class="corner">${c.rank} ${c.symbol}</span><span class="emblem" aria-hidden="true">${c.symbol}</span><span class="card-name">${c.member}</span><span class="card-family">${families.find(f=>f.id===c.suit).head}</span></div>`;}
function render(){
 clearTimeout(timer);clearInterval(countdown);
 const human=state.turn===0,phase=state.phase;
 const allowed=legalCards(state,0);if(!allowed.some(c=>c.suit===selectedSuit))selectedSuit=allowed[0]?.suit||'hearts';
 const options=allowed.filter(c=>c.suit===selectedSuit);if(!options.some(c=>c.id===selectedCard))selectedCard=options[0]?.id||'';
 app.innerHTML=`<main><header><div><p class="eyebrow">A GAME OF IMPECCABLE MANNERS</p><h1>Heart the Lover<span>♥</span></h1></div><button class="icon-button" id="help" aria-label="How to play">?</button></header>
 <label class="difficulty-label">Table difficulty<select id="difficulty">${Object.entries(difficulties).map(([key,value])=>`<option value="${key}" ${difficulty===key?'selected':''}>${value.name}</option>`).join('')}</select></label><div class="topline"><span>THE FAMILY TABLE</span><button class="text-button" id="new">New deal ↗</button></div>
 <section class="table" aria-label="Game table"><div class="opponents">${[1,2].map(p=>`<div class="opponent ${state.turn===p?'active':''}"><span class="avatar">${state.players[p][0]}</span><strong>${state.players[p]}</strong><span>${state.hands[p].length} cards · ${state.turn===p?'playing':'waiting'}</span><div class="backs" aria-hidden="true">▧ ▧ ▧</div></div>`).join('')}</div>
 <div class="table-center"><span class="table-symbol" aria-hidden="true">♥</span><p>${state.winner?'A family, reunited.':human?'Your turn. Mind your manners.':`${state.players[state.turn]}'s turn`}</p><small>Collect all 9 cards in a family to win.</small></div></section>
 <section class="action-panel" aria-label="Turn actions"><div class="section-label">${state.winner?'THE WINNER':human?'YOUR NEXT MOVE':'AT THE TABLE'}</div>${controls(human,phase,options)}${error?`<p role="alert">${error}</p>`:''}</section>
 <section class="hand-section"><div class="hand-heading"><h2>Your hand <span>${state.hands[0].length} cards</span></h2><span>Swipe to explore →</span></div><div class="family-tabs" aria-label="Browse your families">${families.map(f=>`<button data-suit="${f.id}" aria-pressed="${selectedSuit===f.id}" class="${selectedSuit===f.id?'selected':''}">${f.symbol} ${f.id}<span>${state.hands[0].filter(id=>cardById[id].suit===f.id).length}/9</span></button>`).join('')}</div><div class="hand">${state.hands[0].filter(id=>cardById[id].suit===selectedSuit).sort((a,b)=>deck.findIndex(c=>c.id===a)-deck.findIndex(c=>c.id===b)).map(id=>cardHTML(cardById[id])).join('')||'<p class="empty">No cards in this family yet.</p>'}</div></section>
 <details class="history"><summary>Table conversation</summary><ol aria-live="polite">${state.log.map(msg=>`<li>${msg}</li>`).join('')}</ol></details><footer>36 cards. Four families. A little good fortune.<br>Placeholder card designs · Progress saves on this device</footer>
 ${help?`<dialog aria-labelledby="help-title"><h2 id="help-title">A game of manners</h2><p>Collect all nine cards in one family. Ask Jos or Electa for a specific card, but only from a family already in your hand.</p><p>Address them by name, then say <strong>“May I please have…”</strong>. If they have it, say <strong>“Thank you”</strong> before taking the card. A successful ask lets you ask again. A “No” passes your turn to the left.</p><p>A wrong phrase or taking too soon invites <strong>“Sir Hincomb Funnibuster!”</strong>. The first caller gets a bonus turn. Watch for bot mistakes and tap the challenge button before someone else calls.</p><p>Choose <strong>Relaxed</strong> for slower bots, more mistakes, and seven seconds to challenge. <strong>Sharp</strong> bots remember more, make fewer mistakes, and leave 2.4 seconds. Opening this guide pauses the table.</p><p>You may ask for a card you already hold as a bluff. Jos and Electa remember public requests, but cannot see your hand.</p><button id="close-help" class="primary">Back to the table</button></dialog>`:''}
 </main>`;
 if(help){const dialog=document.querySelector('dialog');dialog.showModal();dialog.addEventListener('cancel',e=>{e.preventDefault();help=false;render();});}
 document.querySelector('#help').onclick=()=>{if(deadline){remaining=Math.max(0,deadline-Date.now());deadline=null;}help=true;render();document.querySelector('#close-help').focus();};
 document.querySelector('#close-help')?.addEventListener('click',()=>{help=false;render();document.querySelector('#help').focus();});
 document.querySelector('#new').onclick=()=>{if(confirm('Start a new deal? Your current game will be replaced.')){state=createGame();deadline=null;remaining=null;selectedCard='';save();render();}};
 document.querySelector('#difficulty').onchange=e=>{difficulty=e.target.value;try{localStorage.setItem('htl-difficulty',difficulty);}catch{}render();};
 document.querySelectorAll('[data-suit]').forEach(b=>b.onclick=()=>{selectedSuit=b.dataset.suit;selectedCard='';render();});
 document.querySelector('#target')?.addEventListener('change',e=>{target=Number(e.target.value);});
 document.querySelector('#card')?.addEventListener('change',e=>{selectedCard=e.target.value;document.querySelector('.request-preview').textContent=`“May I please have ${cardById[selectedCard].name}?”`;});
 document.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>{const a=b.dataset.action;if(a==='ask'||a==='bad-ask')act({type:'ask',target,card:selectedCard,polite:a==='ask'});else if(a==='challenge')act({type:'challenge',player:0});else act({type:a});});
 if(help||state.winner)return;
 if(phase==='violation'){
   if(deadline===null)deadline=Date.now()+(remaining??(human?1800:difficulties[difficulty].reactionMs));
   const update=()=>{const seconds=Math.max(0,(deadline-Date.now())/1000);const label=document.querySelector('#challenge-countdown');if(label)label.textContent=`${seconds.toFixed(1)} seconds before another player calls`;};
   update();countdown=setInterval(update,100);
   timer=setTimeout(()=>act({type:'challenge',player:state.turn===0?1:state.turn===1?2:1}),Math.max(0,deadline-Date.now()));
 }
 else if(!human)timer=setTimeout(botStep,phase==='ask'?difficulties[difficulty].turnMs:1200);
}
function controls(human,phase,options){
 if(state.winner)return `<h2>${state.players[state.winner.player]} won!</h2><p>The ${families.find(f=>f.id===state.winner.suit).head} family is complete. Start a new deal to play again.</p>`;
 if(phase==='violation')return `<h2>A slip of the tongue!</h2><p id="challenge-countdown" class="countdown" aria-label="Time left to challenge"></p><p>${state.log.at(-1)}</p>${!human?'<button class="primary challenge" data-action="challenge">Sir Hincomb Funnibuster!</button><p class="hint">Call now to claim the bonus turn.</p>':'<p class="hint" role="status">The others have a chance to challenge…</p>'}`;
 if(!human)return `<h2>${state.players[state.turn]} is ${phase==='ask'?'choosing a card…':phase==='offered'?'saying thank you…':'taking the card…'}</h2><p class="latest" role="status">${state.log.at(-1)}</p><span class="thinking" aria-hidden="true">● ● ●</span>`;
 if(phase==='offered'||phase==='thanked')return `<div class="offer">${cardHTML(cardById[state.offer.card],true)}<div><h2>${phase==='offered'?'Yes, you may.':'Perfect manners.'}</h2><p>${phase==='offered'?'Say thank you before you touch the card.':'Now you may take the card and ask again.'}</p>${phase==='offered'?'<button class="primary" data-action="thanks">Thank you</button><button class="text-button risky" data-action="take">Take it without thanking ↗</button>':'<button class="primary" data-action="take">Take the card</button>'}</div></div>`;
 return `<h2>Who will you ask?</h2><div class="form-grid"><label>Address your opponent<select id="target"><option value="1" ${target===1?'selected':''}>Jos? → “Yes!”</option><option value="2" ${target===2?'selected':''}>Electa? → “Yes!”</option></select></label><label>Choose a ${selectedSuit} card<select id="card">${options.map(c=>`<option value="${c.id}" ${c.id===selectedCard?'selected':''}>${c.rank} · ${c.member}${state.hands[0].includes(c.id)?' (in your hand)':''}</option>`).join('')}</select></label></div><p class="request-preview">“May I please have ${cardById[selectedCard]?.name||'a card'}?”</p><button class="primary" data-action="ask" ${options.length?'':'disabled'}>May I please have…</button><details class="risky-options"><summary>Try a different phrase</summary><button class="secondary" data-action="bad-ask">Can I have…</button><p class="hint">Careful: the wrong words can cost you a turn.</p></details>`;
}
function botStep(){if(state.winner||state.turn===0)return;let e;if(state.phase==='ask'){e=chooseAsk(rememberedView(botView(state),difficulty));if(Math.random()<difficulties[difficulty].mistakeRate)e.polite=false;}else if(state.phase==='offered')e=Math.random()<difficulties[difficulty].mistakeRate?{type:'take'}:{type:'thanks'};else if(state.phase==='thanked')e={type:'take'};if(e)act(e);}
render();
