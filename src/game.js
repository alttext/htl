export const families = [
  {id:'hearts',symbol:'♥',head:'Heart the Lover'},
  {id:'diamonds',symbol:'♦',head:'Sir Hincomb Funnibuster'},
  {id:'spades',symbol:'♠',head:'Spade the Gardener'},
  {id:'clubs',symbol:'♣',head:'Club the Policeman'},
];
const members = ['','Wife','Eldest son','Ten Children','Nine Servants','Donkey','Parrot','Twins','Baby'];
export const deck = families.flatMap(f=>['K','Q','J','10','9','4','3','2','A'].map((rank,i)=>({id:`${f.id}-${rank}`,suit:f.id,rank,symbol:f.symbol,member:members[i]||f.head,name:i?`${f.head}'s ${members[i]}`:f.head})));
export const cardById = Object.fromEntries(deck.map(c=>[c.id,c]));
export function random(seed) {let n=seed>>>0;return ()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;};}
export function createGame(seed=Date.now()) {
  const rng=random(seed), cards=deck.map(c=>c.id);
  for(let i=cards.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[cards[i],cards[j]]=[cards[j],cards[i]];}
  const s={players:['You','Jos','Electa'],hands:[[],[],[]],turn:0,phase:'ask',offer:null,resume:[],winner:null,history:[],log:['All 36 cards dealt. You go first.'],seed};
  cards.forEach((c,i)=>s.hands[i%3].push(c)); return checkWinner(s);
}
function note(s,msg){s.log.push(msg);s.log=s.log.slice(-12);}
function checkWinner(s){for(let p=0;p<3;p++)for(const f of families)if(s.hands[p].filter(id=>cardById[id].suit===f.id).length===9){s.winner={player:p,suit:f.id};s.phase='won';note(s,`${s.players[p]} collected the entire ${f.head} family!`);return s;}return s;}
function nextNonempty(s,p){for(let i=1;i<=3;i++)if(s.hands[(p+i)%3].length)return (p+i)%3;throw Error('No cards remaining');}
function endTurn(s){let next=s.resume.length?s.resume.pop():nextNonempty(s,s.turn);if(!s.hands[next].length)next=nextNonempty(s,next);s.turn=next;s.phase='ask';s.offer=null;}
export function legalCards(s,p=s.turn){return deck.filter(c=>s.hands[p].some(id=>cardById[id].suit===c.suit));}
export function transition(state,event){
  const s=structuredClone(state);
  if(s.winner)throw Error('Game is over');
  if(event.type==='ask'){
    if(s.phase!=='ask')throw Error('Finish the current dialogue first');
    const c=cardById[event.card];
    if(!c||!legalCards(s).some(x=>x.id===c.id))throw Error('You must hold a card of that family');
    if(!Number.isInteger(event.target)||event.target<0||event.target>2||event.target===s.turn)throw Error('Choose another player');
    s.offer={card:c.id,target:event.target};
    note(s,`${s.players[s.turn]} → ${s.players[event.target]}: ${event.polite===false?'Can I have':'May I please have'} ${c.name}?`);
    if(event.polite===false){s.phase='violation';note(s,'A mistake in the ask! Someone may call Sir Hincomb Funnibuster.');}
    else resolveAsk(s);
  }else if(event.type==='thanks'){
    if(s.phase!=='offered')throw Error('No card has been offered');
    if(event.polite===false){s.phase='violation';note(s,`${s.players[s.turn]} said “Thanks” instead of “Thank you.”`);}
    else {s.phase='thanked';note(s,`${s.players[s.turn]}: Thank you.`);}
  }else if(event.type==='take'){
    if(s.phase==='offered'){s.phase='violation';note(s,`${s.players[s.turn]} touched the card before saying “Thank you”!`);}
    else if(s.phase==='thanked'){
      const {target,card}=s.offer; if(!s.hands[target].includes(card))throw Error('Offered card is missing');
      s.hands[target]=s.hands[target].filter(id=>id!==card);s.hands[s.turn].push(card);
      s.history.push({kind:'transfer',from:target,to:s.turn,card});note(s,`${s.players[s.turn]} received ${cardById[card].name}. Ask again.`);
      s.phase='ask';s.offer=null;checkWinner(s);
    }else throw Error('No card to take');
  }else if(event.type==='challenge'){
    if(s.phase!=='violation')throw Error('There is no manners mistake to challenge');
    if(!Number.isInteger(event.player)||event.player<0||event.player>2||event.player===s.turn)throw Error('Another player must call');
    const resume=s.resume.length?s.resume.pop():nextNonempty(s,s.turn);
    s.resume.push(resume);s.turn=event.player;s.phase='ask';s.offer=null;
    // An empty-handed caller cannot legally ask, so their bonus turn ends immediately.
    note(s,`${s.players[event.player]}: Sir Hincomb Funnibuster! A bonus turn.`);
    if(!s.hands[s.turn].length)endTurn(s);
  }else if(event.type==='forgive'){
    if(s.phase!=='violation')throw Error('No mistake to forgive');
    note(s,'Nobody called. The turn continues.');resolveAsk(s);
  }else throw Error('Unknown action');
  return s;
}
function resolveAsk(s){const {target,card}=s.offer;const has=s.hands[target].includes(card);s.history.push({kind:'answer',asker:s.turn,target,card,has});if(has){s.phase='offered';note(s,`${s.players[target]}: Yes, you may.`);}else{note(s,`${s.players[target]}: No, you may not.`);endTurn(s);}}
// Only a public view is passed to the bot: its own hand and public events.
export function botView(s,p=s.turn){return {player:p,hand:[...s.hands[p]],history:[...s.history],targets:[0,1,2].filter(x=>x!==p)};}
export function chooseAsk(view,rng=Math.random){
  const suits=new Set(view.hand.map(id=>cardById[id].suit));
  let choices=deck.filter(c=>suits.has(c.suit)&&!view.hand.includes(c.id));
  const known=new Map();
  for(const h of view.history){if(h.kind==='transfer')known.set(h.card,h.to);else if(h.has)known.set(h.card,h.target);else if(known.get(h.card)===h.target)known.delete(h.card);}
  const sure=choices.filter(c=>view.targets.includes(known.get(c.id)));
  if(sure.length){const c=sure[Math.floor(rng()*sure.length)];return {type:'ask',card:c.id,target:known.get(c.id),polite:true};}
  if(!choices.length)choices=deck.filter(c=>suits.has(c.suit));
  const c=choices[Math.floor(rng()*choices.length)];
  const failures=new Set(view.history.filter(h=>h.kind==='answer'&&!h.has&&h.card===c.id).map(h=>h.target));
  const targets=view.targets.filter(p=>!failures.has(p));
  return {type:'ask',card:c.id,target:(targets.length?targets:view.targets)[Math.floor(rng()*(targets.length||view.targets.length))],polite:true};
}
