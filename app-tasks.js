// ============ TASK GENERATION ROUTER ============
function startCat(cat){
  currentCategory=cat; currentTaskIndex=0;
  setTheme((cat==='ocean'||cat==='joint-ocean')?'ocean':'desert');
  tasks=genTasks(currentChild,cat); showTask();
}

function genTasks(child,cat){
  const dy=child==='dylan';
  const m={maths:dy?dyMaths:thMaths, phonics:dy?dyPhonics:thPhonics, writing:dy?dyWriting:thWriting,
    fun:dy?dyFun:thFun, ocean:dy?dyOcean:thOcean,
    'joint-draw':jointDraw,'joint-ocean':jointOcean,'joint-maths':jointMaths,'joint-write':jointWrite};
  return (m[cat]||(()=>[]))();
}

// ============ DYLAN MATHS (age 4) ============
function dyMaths(){
  const t=[],ems=['🐪','🌟','🏺','🐠','🐡','💎','🐙'];
  for(let i=0;i<3;i++){const n=rint(1,6),e=pick(ems);
    t.push({type:'mc',question:`How many ${e}?`,display:(e+' ').repeat(n).trim(),displayType:'counting',options:uOpts(n,1,9,4),answer:n})}
  for(let i=0;i<2;i++){let a=rint(1,5),b=rint(1,9);while(b===a)b=rint(1,9);
    t.push({type:'mc',question:'Which is bigger? 🔍',options:[a,b],answer:Math.max(a,b),displayType:'single-row'})}
  const nw=['one','two','three','four','five'],n=rint(1,5);
  t.push({type:'mc',question:`Find "${nw[n-1]}"`,emoji:'🔢',options:uOpts(n,1,9,4),answer:n});
  return shuffle(t);
}

// ============ THEIA MATHS (age 5) ============
function thMaths(){
  const t=[];
  for(let i=0;i<3;i++){const a=rint(1,5),b=rint(1,5),ans=a+b;
    t.push({type:'mc',question:`${a} + ${b} = ? ➕`,options:uOpts(ans,2,12,4),answer:ans})}
  for(let i=0;i<2;i++){const a=rint(4,10),b=rint(1,a-1),ans=a-b;
    t.push({type:'mc',question:`${a} − ${b} = ? ➖`,options:uOpts(ans,0,10,4),answer:ans})}
  const n=rint(5,10),e=pick(['🐠','🐙','🐢','⭐','💎']);
  t.push({type:'mc',question:`Count the ${e}s!`,display:(e+' ').repeat(n).trim(),displayType:'counting',options:uOpts(n,3,12,4),answer:n});
  return shuffle(t);
}

// ============ DYLAN PHONICS ============
function dyPhonics(){
  const t=[],ws=[
    {w:'Cat',e:'🐱',l:'C'},{w:'Dog',e:'🐕',l:'D'},{w:'Sun',e:'☀️',l:'S'},{w:'Fish',e:'🐟',l:'F'},
    {w:'Moon',e:'🌙',l:'M'},{w:'Hat',e:'🎩',l:'H'},{w:'Tree',e:'🌳',l:'T'},{w:'Ball',e:'⚽',l:'B'}];
  shuffle(ws).slice(0,4).forEach(w=>{
    const wrongs=shuffle('ABCDEFGHJKLNOPQRUVWXYZ'.split('').filter(l=>l!==w.l)).slice(0,3);
    t.push({type:'mc',question:`${w.e} "${w.w}" starts with...?`,options:shuffle([w.l,...wrongs]),answer:w.l})});
  shuffle(ws).slice(0,2).forEach(w=>{
    const oth=ws.filter(x=>x.l!==w.l).slice(0,3);
    t.push({type:'mc',question:`Which starts with "${w.l}"?`,options:shuffle([w.e,...oth.map(o=>o.e)]),answer:w.e})});
  return shuffle(t);
}

// ============ THEIA PHONICS ============
function thPhonics(){
  const t=[],cvcs=[
    {w:'cat',e:'🐱',wr:['bat','hat','car']},{w:'dog',e:'🐕',wr:['dig','fog','log']},
    {w:'sun',e:'☀️',wr:['run','bun','sit']},{w:'bus',e:'🚌',wr:['bug','but','cup']},
    {w:'pen',e:'🖊️',wr:['pin','pan','hen']},{w:'pig',e:'🐷',wr:['pin','big','pit']},
    {w:'cup',e:'☕',wr:['cap','pup','cut']}];
  shuffle(cvcs).slice(0,3).forEach(w=>{
    t.push({type:'mc',question:`Which word matches ${w.e}?`,emoji:w.e,
      options:shuffle([w.w,...shuffle(w.wr).slice(0,3)]),answer:w.w})});
  shuffle(['cat','dog','sun','hat','pen']).slice(0,2).forEach(word=>{
    const extras=shuffle('abcdefghijklmnopqrstuvwxyz'.split('').filter(l=>!word.includes(l))).slice(0,2);
    t.push({type:'word-build',question:'Build the word! 🔨',targetWord:word,
      letters:shuffle([...word.split(''),...extras])})});
  const pairs=[{w:'the',s:'___ cat sat.'},{w:'is',s:'He ___ big.'},{w:'and',s:'Mum ___ Dad.'}];
  const sp=pick(pairs);
  t.push({type:'mc',question:`Which word fits?\n"${sp.s}"`,
    options:shuffle([sp.w,...['a','it','on','at'].filter(w=>w!==sp.w).slice(0,3)]),answer:sp.w});
  return shuffle(t);
}

// ============ DYLAN WRITING ============
function dyWriting(){
  const t=[];
  shuffle('ABCDHMS'.split('')).slice(0,3).forEach(l=>{
    t.push({type:'trace',question:`Trace the letter "${l}"!`,traceLetter:l,instruction:'Use your finger to trace'})});
  [{name:'circle',emoji:'⭕'},{name:'triangle',emoji:'🔺'}].forEach(s=>{
    t.push({type:'draw',question:`Draw a ${s.name}! ${s.emoji}`,instruction:'Use your finger to draw'})});
  t.push({type:'draw',question:'Write your name! ✨',instruction:'Try writing DYLAN'});
  return shuffle(t);
}

// ============ THEIA WRITING ============
function thWriting(){
  const t=[];
  shuffle('abcdefghrs'.split('')).slice(0,2).forEach(l=>{
    t.push({type:'trace',question:`Trace the letter "${l}"`,traceLetter:l,instruction:'Trace over the grey letter'})});
  shuffle(['cat','sun','dog','hat']).slice(0,2).forEach(w=>{
    t.push({type:'draw',question:`Write the word "${w}" ✏️`,instruction:`Try writing: ${w}`})});
  t.push({type:'draw',question:'Write your name beautifully! ✨',instruction:'Try writing THEIA'});
  const n=rint(1,10);
  t.push({type:'draw',question:`Write the number ${n}`,instruction:`Draw the number ${n} neatly`});
  return shuffle(t);
}

// ============ DYLAN FUN DRAWING ============
function dyFun(){
  return shuffle([
    'Draw a camel! 🐪','Draw a pyramid! 🏛️','Draw the sun! ☀️',
    'Draw your favourite animal! 🐾','Draw a smiley face! 😊',
    'Draw a big star! ⭐','Draw a mummy (Egyptian!) 🧟','Draw Mummy or Daddy! 👨‍👩‍👦',
  ]).slice(0,5).map(p=>({type:'draw',question:p,instruction:'Draw whatever you like!'}));
}

// ============ THEIA FUN DRAWING ============
function thFun(){
  return shuffle([
    'Draw an Egyptian pharaoh! 👑','Draw pyramids at sunset! 🌅',
    'Draw a scarab beetle! 🪲','Draw yourself on holiday! ✈️',
    'Draw the River Nile! 🌊','Draw a treasure chest! 💰',
    'Draw your family! 👨‍👩‍👧‍👦','Draw a sphinx! 🦁',
  ]).slice(0,5).map(p=>({type:'draw',question:p,instruction:'Be as creative as you like!'}));
}

// ============ DYLAN OCEAN & FISH ============
function dyOcean(){
  const t=[],fish=shuffle(FISH).slice(0,3);
  fish.forEach(f=>{
    const others=shuffle(FISH.filter(x=>x.name!==f.name)).slice(0,3);
    t.push({type:'mc',question:`Which sea creature is ${f.color}?`,
      options:shuffle([f.name,...others.map(o=>o.name)]),answer:f.name,fishCard:f})});
  t.push({type:'draw',question:`Draw a ${pick(FISH).name}! ${pick(FISH).emoji}`,instruction:'Draw the fish you want to see snorkelling!'});
  const num=rint(2,5),em=pick(['🐠','🐟','🐡','🐙','🐢']);
  t.push({type:'mc',question:'How many fish?',display:(em+' ').repeat(num).trim(),displayType:'counting',
    options:uOpts(num,1,8,4),answer:num});
  t.push({type:'draw',question:'Draw what you think is under the sea! 🌊',instruction:'Fish, coral, treasure — anything!'});
  return shuffle(t);
}

// ============ THEIA OCEAN & FISH ============
function thOcean(){
  const t=[],fish=shuffle(FISH).slice(0,3);
  fish.forEach(f=>{
    const others=shuffle(FISH.filter(x=>x.name!==f.name)).slice(0,3);
    t.push({type:'mc',question:`Which creature is ${f.color}?`,
      options:shuffle([f.name,...others.map(o=>o.name)]),answer:f.name,fishCard:f})});
  // Spell a fish
  const spFish=pick(FISH.filter(f=>f.name.length<=8));
  const word=spFish.name.toLowerCase();
  const extras=shuffle('abcdefghijklmnopqrstuvwxyz'.split('').filter(l=>!word.includes(l))).slice(0,3);
  t.push({type:'word-build',question:`Spell the fish! ${spFish.emoji}`,targetWord:word,
    letters:shuffle([...word.split(''),...extras])});
  t.push({type:'mc',question:'How many arms does an octopus have? 🐙',emoji:'🐙',
    options:shuffle([6,8,10,4]),answer:8});
  t.push({type:'draw',question:'Draw your favourite fish for snorkelling! 🤿',instruction:'Which fish do you want to see most?'});
  t.push({type:'draw',question:'Draw a coral reef! 🪸',instruction:'Add fish, coral, and sea creatures!'});
  return shuffle(t);
}

// ============ JOINT — DRAWING ============
function jointDraw(){
  return shuffle([
    'Draw a camel! 🐪','Draw a pyramid! 🏛️','Draw a pharaoh! 👑',
    'Draw the sun! ☀️','Draw a palm tree! 🌴','Draw a snake! 🐍',
    'Draw a cat! 🐱','Draw a treasure map! 🗺️',
  ]).slice(0,4).map(p=>({type:'joint-draw',question:p,instruction:'Both draw at the same time — ready, set, go!'}));
}

function jointOcean(){
  return shuffle([
    `Draw a ${pick(FISH).name}! ${pick(FISH).emoji}`,
    'Draw a coral reef! 🪸','Draw an underwater scene! 🌊',
    `Draw a ${pick(FISH).name}! ${pick(FISH).emoji}`,
    'Draw a submarine! 🚢','Draw a shark! 🦈','Draw a whale! 🐋',
  ]).slice(0,4).map(p=>({type:'joint-draw',question:p,instruction:'Who can draw it best?'}));
}

function jointMaths(){
  const t=[];
  for(let i=0;i<5;i++){const a=rint(1,6),b=rint(1,6),ans=a+b;
    t.push({type:'joint-race-mc',question:`Quick! ${a} + ${b} = ?`,options:uOpts(ans,2,14,4),answer:ans})}
  return t;
}

function jointWrite(){
  return shuffle([
    'Write your name!','Write the word CAT 🐱','Write the number 7',
    'Draw the letter A','Write the word SUN ☀️','Write the word FISH 🐟',
  ]).slice(0,4).map(p=>({type:'joint-draw',question:p,instruction:'Who can write it best?'}));
}
