// ============ STATE ============
let currentChild = null;
let currentCategory = null;
let currentTaskIndex = 0;
let tasks = [];
let parentMode = true;
let parentLPTimer = null;
let autoTimer = null;
let canvases = {};

// ============ RED SEA FISH ============
const FISH = [
  { name:'Clownfish', emoji:'🐠', color:'orange and white', fact:'Clownfish live inside sea anemones! The stinging tentacles keep them safe from predators.' },
  { name:'Blue Tang', emoji:'🐟', color:'bright blue', fact:'Blue tangs have a sharp spine near their tail like a tiny sword — that\'s why they\'re called surgeonfish!' },
  { name:'Lionfish', emoji:'🦁', color:'stripy red and white', fact:'Lionfish have beautiful fan-like fins, but their spines are venomous — look but don\'t touch!' },
  { name:'Butterflyfish', emoji:'🦋', color:'yellow and black', fact:'Butterflyfish have a dark spot near their tail that looks like an eye to confuse predators!' },
  { name:'Parrotfish', emoji:'🦜', color:'green and blue', fact:'Parrotfish crunch coral with beak-like teeth and poop out sand — they actually make beaches!' },
  { name:'Sea Turtle', emoji:'🐢', color:'brown and green', fact:'Green sea turtles can hold their breath for up to 5 hours while sleeping underwater!' },
  { name:'Moray Eel', emoji:'🐍', color:'spotted brown', fact:'Moray eels open and close their mouths to breathe — they look scary but they\'re usually shy!' },
  { name:'Seahorse', emoji:'🐴', color:'yellow or orange', fact:'Seahorse daddies carry the babies in a special pouch — not the mummies!' },
  { name:'Pufferfish', emoji:'🐡', color:'yellow with spots', fact:'When scared, pufferfish gulp water and blow up like a balloon so they\'re too big to eat!' },
  { name:'Starfish', emoji:'⭐', color:'red or orange', fact:'If a starfish loses an arm, it can grow a brand new one!' },
  { name:'Octopus', emoji:'🐙', color:'can change colour!', fact:'Octopuses have three hearts and blue blood! They can squeeze through the tiniest gaps.' },
  { name:'Jellyfish', emoji:'🪼', color:'see-through', fact:'Jellyfish have no brain, no heart, and no bones — they\'re mostly made of water!' },
];

// ============ HELPERS ============
function rint(a,b){return Math.floor(Math.random()*(b-a+1))+a}
function pick(a){return a[Math.floor(Math.random()*a.length)]}
function clamp(n,lo,hi){return Math.max(lo,Math.min(hi,n))}
function shuffle(a){const r=[...a];for(let i=r.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[r[i],r[j]]=[r[j],r[i]]}return r}
function uOpts(correct,lo,hi,count){
  const s=new Set([correct]);
  // Try nearby values first
  for(let d=1;s.size<count&&d<=hi-lo;d++){
    if(correct+d<=hi)s.add(correct+d);
    if(s.size<count&&correct-d>=lo)s.add(correct-d);
  }
  return shuffle([...s]).slice(0,count);
}

// ============ PARENT MODE TOGGLE ============
const badgeEl = document.getElementById('parent-badge');
function lpStart(){parentLPTimer=setTimeout(()=>{parentMode=!parentMode;updateBadge();if(navigator.vibrate)navigator.vibrate(50)},800)}
function lpEnd(){clearTimeout(parentLPTimer)}
badgeEl.addEventListener('touchstart',e=>{e.preventDefault();lpStart()},{passive:false});
badgeEl.addEventListener('mousedown',lpStart);
['touchend','touchcancel','mouseup','mouseleave'].forEach(ev=>badgeEl.addEventListener(ev,lpEnd));

function updateBadge(){
  badgeEl.textContent=parentMode?'👁️ Parent: ON':'▶️ Play Mode';
  badgeEl.classList.toggle('on',parentMode);
}
setTimeout(()=>{const h=document.getElementById('parent-hint');h.style.opacity='0';setTimeout(()=>h.style.display='none',1000)},5000);

// ============ THEMES ============
function setTheme(t){
  const d=document.getElementById('bg-desert'),o=document.getElementById('bg-ocean'),
        p=document.getElementById('pyramid-deco'),b=document.getElementById('bubbles-box');
  if(t==='ocean'){d.classList.remove('active');o.classList.add('active');p.style.opacity='0';spawnBubbles(b)}
  else{o.classList.remove('active');d.classList.add('active');p.style.opacity='1';b.innerHTML=''}
}
function spawnBubbles(c){
  c.innerHTML='';
  for(let i=0;i<10;i++){const b=document.createElement('div');b.className='bubble';const s=5+Math.random()*16;
    b.style.cssText=`width:${s}px;height:${s}px;left:${Math.random()*100}%;bottom:-20px;animation-duration:${6+Math.random()*10}s;animation-delay:${Math.random()*8}s`;
    c.appendChild(b)}
}

// ============ NAVIGATION ============
function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  clearAuto();
}
function goToWelcome(){setTheme('desert');showScreen('welcome-screen')}
function goToMenu(){showScreen('menu-screen')}

function selectChild(child){
  currentChild=child;
  const nameEl=document.getElementById('menu-child-name');
  const grid=document.getElementById('menu-grid');
  if(child==='together'){
    nameEl.textContent='🦁 Dylan & Theia 🦋';nameEl.style.color='var(--gold)';
    grid.innerHTML=`
      <button class="menu-card fun" onclick="startCat('joint-draw')"><div class="menu-card-emoji">🎨</div><div>Draw Race!</div></button>
      <button class="menu-card ocean" onclick="startCat('joint-ocean')"><div class="menu-card-emoji">🐠</div><div>Ocean Draw!</div></button>
      <button class="menu-card maths" onclick="startCat('joint-maths')"><div class="menu-card-emoji">🔢</div><div>Maths Race!</div></button>
      <button class="menu-card writing" onclick="startCat('joint-write')"><div class="menu-card-emoji">✏️</div><div>Writing Race!</div></button>`;
  } else {
    const dy=child==='dylan';
    nameEl.textContent=dy?'🦁 Dylan':'🦋 Theia';
    nameEl.style.color=dy?'var(--dylan-color)':'var(--theia-color)';
    grid.innerHTML=`
      <button class="menu-card maths" onclick="startCat('maths')"><div class="menu-card-emoji">🔢</div><div>Maths</div></button>
      <button class="menu-card phonics" onclick="startCat('phonics')"><div class="menu-card-emoji">📖</div><div>Phonics</div></button>
      <button class="menu-card writing" onclick="startCat('writing')"><div class="menu-card-emoji">✏️</div><div>Writing</div></button>
      <button class="menu-card fun" onclick="startCat('fun')"><div class="menu-card-emoji">🎨</div><div>Drawing</div></button>
      <button class="menu-card ocean" onclick="startCat('ocean')"><div class="menu-card-emoji">🐠</div><div>Ocean & Fish</div></button>`;
  }
  showScreen('menu-screen');
}
