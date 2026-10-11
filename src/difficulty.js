export const difficulties = {
  relaxed: {name:'Relaxed',reactionMs:7000,turnMs:2200,mistakeRate:0.24,memory:8},
  standard: {name:'Standard',reactionMs:4200,turnMs:1800,mistakeRate:0.16,memory:40},
  sharp: {name:'Sharp',reactionMs:2400,turnMs:1200,mistakeRate:0.06,memory:Infinity},
};
export function rememberedView(view,level){return {...view,history:view.history.slice(-difficulties[level].memory)};}
