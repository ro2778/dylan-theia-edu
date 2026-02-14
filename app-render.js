// ============ SHOW TASK ============
function showTask(){
  clearAuto();
  if(currentTaskIndex>=tasks.length){showComplete();return}
  const task=tasks[currentTaskIndex];
  const container=document.getElementById('task-content');
  const badge=document.getElementById('task-badge');
  const progress=document.getElementById('task-progress');

  const catMeta={
    maths:{color:'#7c3aed',label:'🔢 Maths'},phonics:{color:'#059669',label:'📖 Phonics'},
    writing:{color:'#d97706',label:'✏️ Writing'},fun:{color:'#dc2626',label:'🎨 Drawing'},
    ocean:{color:'#0369a1',label:'🐠 Ocean'},
    reading:{color:'#7e22ce',label:'📚 Reading'},
    'joint-draw':{color:'#dc2626',label:'🎨 Together'},'joint-ocean':{color:'#0369a1',label:'🐠 Together'},
    'joint-maths':{color:'#7c3aed',label:'🔢 Race!'},'joint-write':{color:'#d97706',label:'✏️ Together'}};
  const meta=catMeta[currentCategory]||{color:'#666',label:'✨'};
  badge.style.background=meta.color; badge.textContent=meta.label;
  progress.textContent=`${currentTaskIndex+1} / ${tasks.length}`;

  showScreen('task-screen');
  container.innerHTML='';

  switch(task.type){
    case 'mc': renderMC(container,task); break;
    case 'trace': renderTrace(container,task); break;
    case 'draw': renderDraw(container,task); break;
    case 'word-build': renderWordBuild(container,task); break;
    case 'joint-draw': renderJointDraw(container,task); break;
    case 'joint-race-mc': renderJointRaceMC(container,task); break;
    case 'story': renderStory(container,task); break;
  }
}

// ============ RENDER: MULTIPLE CHOICE ============
function renderMC(container,task){
  let h='';
  if(task.fishCard){
    h+=`<div class="fish-card"><div class="fish-card-emoji">${task.fishCard.emoji}</div>
      <div class="fish-card-name">${task.fishCard.name}</div>
      <div class="fish-card-fact">${task.fishCard.fact}</div></div>`}
  if(task.emoji&&!task.display) h+=`<div class="task-emoji-hint">${task.emoji}</div>`;
  h+=`<div class="task-question">${task.question.replace(/\n/g,'<br>')}</div>`;
  if(task.display&&task.displayType==='counting') h+=`<div class="counting-objects">${task.display}</div>`;
  const rc=task.displayType==='single-row'||task.options.length<=2?'answer-single-row':'answer-options';
  h+=`<div class="${rc}" id="mc-answers">`;
  task.options.forEach((opt,i)=>{
    h+=`<button class="answer-btn" data-idx="${i}">${opt}</button>`});
  h+='</div>';
  container.innerHTML=h;
  // Attach click handlers via JS (avoids emoji breaking inline onclick)
  const answerContainer=document.getElementById('mc-answers');
  answerContainer.querySelectorAll('.answer-btn').forEach(btn=>{
    btn.addEventListener('click',function(){
      checkMC(this,task.options,task.answer,answerContainer);
    });
  });
}

function checkMC(btn,options,correct,wrap){
  if(wrap.dataset.answered)return;
  const idx=parseInt(btn.dataset.idx);
  const selected=options[idx];
  if(String(selected)===String(correct)){
    wrap.dataset.answered='1';
    btn.classList.add('correct'); celebrate();
    setTimeout(()=>taskComplete('Great job! ⭐'),900);
  } else {
    btn.classList.add('wrong');
    setTimeout(()=>btn.classList.remove('wrong'),500);
  }
}

// Keep old checkAnswer for race mode compatibility
function checkAnswer(btn,selected,correct){
  if(btn.closest('.answer-options,.answer-single-row').dataset.answered)return;
  if(String(selected)===String(correct)){
    btn.closest('.answer-options,.answer-single-row').dataset.answered='1';
    btn.classList.add('correct'); celebrate();
    setTimeout(()=>taskComplete('Great job! ⭐'),900);
  } else {
    btn.classList.add('wrong');
    setTimeout(()=>btn.classList.remove('wrong'),500);
  }
}

// ============ RENDER: TRACE ============
function renderTrace(container,task){
  container.innerHTML=`
    <div class="task-question">${task.question}</div>
    <div class="task-instruction">${task.instruction}</div>
    <div class="canvas-container sq" id="canvas-wrap-main">
      <div class="trace-letter-bg">${task.traceLetter}</div>
      <canvas id="draw-canvas-main"></canvas>
    </div>
    ${canvasToolsHTML('main',false)}
    <button class="next-btn" onclick="submitDrawing('main')" style="margin-top:6px">Done! ✅</button>`;
  initCanvasById('main');
}

// ============ RENDER: DRAW ============
function renderDraw(container,task){
  container.innerHTML=`
    <div class="task-question">${task.question}</div>
    <div class="task-instruction">${task.instruction}</div>
    <div class="canvas-container sq" id="canvas-wrap-main">
      <canvas id="draw-canvas-main"></canvas>
    </div>
    ${canvasToolsHTML('main',true)}
    <button class="next-btn" onclick="submitDrawing('main')" style="margin-top:6px">Done! ✅</button>`;
  initCanvasById('main');
}

// ============ RENDER: WORD BUILD ============
function renderWordBuild(container,task){
  const target=task.targetWord;
  container.innerHTML=`
    <div class="task-question">${task.question}</div>
    <div class="task-instruction">Tap the letters in order!</div>
    <div class="task-emoji-hint">${getEmojiForWord(target)}</div>
    <div class="word-letters" id="word-slots">
      ${target.split('').map((_,i)=>`<div class="letter-slot" id="slot-${i}"></div>`).join('')}
    </div>
    <div class="letter-choices" id="letter-choices">
      ${task.letters.map((l,i)=>`<button class="letter-choice-btn" id="lc-${i}" onclick="pickLetter('${l}',${i})">${l}</button>`).join('')}
    </div>`;
  window._wordBuild={target,slotIndex:0};
}

function getEmojiForWord(word){
  const map={cat:'🐱',dog:'🐕',sun:'☀️',hat:'🎩',pen:'🖊️',bus:'🚌',pig:'🐷',bed:'🛏️',cup:'☕',
    clownfish:'🐠',starfish:'⭐',seahorse:'🐴',octopus:'🐙',pufferfish:'🐡',jellyfish:'🪼',
    'blue tang':'🐟','sea turtle':'🐢','moray eel':'🐍',butterflyfish:'🦋',parrotfish:'🦜',lionfish:'🦁'};
  return map[word]||'✨';
}

function pickLetter(letter,btnIndex){
  const wb=window._wordBuild;
  if(!wb||wb.slotIndex>=wb.target.length)return;
  const btn=document.getElementById(`lc-${btnIndex}`);
  if(letter===wb.target[wb.slotIndex]){
    const slot=document.getElementById(`slot-${wb.slotIndex}`);
    slot.textContent=letter; slot.classList.add('filled'); btn.classList.add('used');
    wb.slotIndex++;
    if(wb.slotIndex>=wb.target.length){celebrate();setTimeout(()=>taskComplete(`You spelled "${wb.target}"! 🎉`),700)}
  } else {
    btn.style.background='rgba(239,68,68,0.3)';
    setTimeout(()=>btn.style.background='',400);
  }
}

// ============ RENDER: JOINT DRAW (split screen) ============
function renderJointDraw(container,task){
  container.innerHTML=`
    <div class="task-question">${task.question}</div>
    <div class="task-instruction">${task.instruction}</div>
    <div class="split-container">
      <div class="split-panel dylan">
        <div class="split-header">🦁 Dylan</div>
        <div class="split-canvas-wrap" id="canvas-wrap-dylan"><canvas id="draw-canvas-dylan"></canvas></div>
        <div class="canvas-tools">
          <button class="color-btn active" style="background:#333" onclick="setColorFor('dylan',this,'#333')"></button>
          <button class="color-btn" style="background:#2563eb" onclick="setColorFor('dylan',this,'#2563eb')"></button>
          <button class="color-btn" style="background:#dc2626" onclick="setColorFor('dylan',this,'#dc2626')"></button>
          <button class="color-btn" style="background:#16a34a" onclick="setColorFor('dylan',this,'#16a34a')"></button>
          <button class="color-btn" style="background:#ea580c" onclick="setColorFor('dylan',this,'#ea580c')"></button>
          <button class="clear-btn" onclick="clearCanvasById('dylan')">Clear</button>
        </div>
        <button class="done-btn dylan" id="done-dylan" onclick="jointDone('dylan')">Dylan Done! ✅</button>
      </div>
      <div class="split-panel theia">
        <div class="split-header">🦋 Theia</div>
        <div class="split-canvas-wrap" id="canvas-wrap-theia"><canvas id="draw-canvas-theia"></canvas></div>
        <div class="canvas-tools">
          <button class="color-btn active" style="background:#333" onclick="setColorFor('theia',this,'#333')"></button>
          <button class="color-btn" style="background:#be185d" onclick="setColorFor('theia',this,'#be185d')"></button>
          <button class="color-btn" style="background:#7c3aed" onclick="setColorFor('theia',this,'#7c3aed')"></button>
          <button class="color-btn" style="background:#16a34a" onclick="setColorFor('theia',this,'#16a34a')"></button>
          <button class="color-btn" style="background:#ea580c" onclick="setColorFor('theia',this,'#ea580c')"></button>
          <button class="clear-btn" onclick="clearCanvasById('theia')">Clear</button>
        </div>
        <button class="done-btn theia" id="done-theia" onclick="jointDone('theia')">Theia Done! ✅</button>
      </div>
    </div>`;
  initCanvasById('dylan'); initCanvasById('theia');
  window._jointDone={dylan:false,theia:false};
}

function jointDone(who){
  window._jointDone[who]=true;
  const btn=document.getElementById(`done-${who}`);
  btn.disabled=true; btn.textContent='✅ Done!';
  if(window._jointDone.dylan&&window._jointDone.theia){
    celebrate(); setTimeout(()=>taskComplete('Both done — amazing teamwork! 🌟'),800);
  }
}

// ============ RENDER: JOINT MATHS RACE ============
function renderJointRaceMC(container,task){
  container.innerHTML=`
    <div class="task-question">${task.question}</div>
    <div class="task-instruction">First to tap the right answer wins! ⚡</div>
    <div class="split-container">
      <div class="split-panel dylan">
        <div class="split-header">🦁 Dylan</div>
        <div class="answer-options" style="max-width:170px" id="race-dylan">
          ${task.options.map((o,i)=>`<button class="answer-btn" data-idx="${i}">${o}</button>`).join('')}
        </div>
      </div>
      <div class="split-panel theia">
        <div class="split-header">🦋 Theia</div>
        <div class="answer-options" style="max-width:170px" id="race-theia">
          ${task.options.map((o,i)=>`<button class="answer-btn" data-idx="${i}">${o}</button>`).join('')}
        </div>
      </div>
    </div>`;
  window._raceWon=false;
  ['dylan','theia'].forEach(who=>{
    document.getElementById(`race-${who}`).querySelectorAll('.answer-btn').forEach(btn=>{
      btn.addEventListener('click',function(){
        if(window._raceWon)return;
        const idx=parseInt(this.dataset.idx);
        const selected=task.options[idx];
        if(String(selected)===String(task.answer)){
          window._raceWon=true; this.classList.add('correct'); celebrate();
          const name=who==='dylan'?'Dylan 🦁':'Theia 🦋';
          setTimeout(()=>taskComplete(`${name} got it first! ⚡`),900);
        } else {
          this.classList.add('wrong');
          setTimeout(()=>this.classList.remove('wrong'),500);
        }
      });
    });
  });
}

// ============ RENDER: STORY ============
function renderStory(container,task){
  const story=task.story;
  // Set theme based on story
  setTheme(story.theme==='ocean'?'ocean':'desert');

  window._storyState={story,pageIndex:0};
  renderStoryPage();
}

function renderStoryPage(){
  const st=window._storyState;
  if(!st)return;
  const story=st.story;
  const page=story.pages[st.pageIndex];
  const isFirst=st.pageIndex===0;
  const isLast=st.pageIndex===story.pages.length-1;
  const pageNum=st.pageIndex+1;
  const totalPages=story.pages.length;

  // Build the highlighted text — hard words get a dotted underline
  const hardSet=new Set((page.hard||[]).map(w=>w.toLowerCase()));
  const textHTML=page.text.replace(/([a-zA-Z'']+)/g,(match)=>{
    const lower=match.toLowerCase().replace(/['']/g,"'");
    if(hardSet.has(lower)){
      return `<span class="story-hard-word" title="Help me read this!">${match}</span>`;
    }
    return match;
  });

  let h=``;
  if(isFirst){
    h+=`<div class="story-cover-title">${story.emoji} ${story.title}</div>`;
  }
  h+=`<div class="story-page-num">Page ${pageNum} of ${totalPages}</div>`;
  h+=`<div class="story-illustration">${page.illustration}</div>`;
  h+=`<div class="story-text">${textHTML}</div>`;
  h+=`<div class="story-hint">
    <span class="story-hint-dot"></span> Dotted words = ask a grown-up for help!
  </div>`;
  h+=`<div class="story-nav">`;
  if(!isFirst){
    h+=`<button class="back-btn" onclick="storyPrev()">← Back</button>`;
  }
  if(isLast){
    h+=`<button class="next-btn" onclick="storyFinish()">Finish Story ⭐</button>`;
  } else {
    h+=`<button class="next-btn" onclick="storyNext()">Next Page ➜</button>`;
  }
  h+=`</div>`;

  // Use container reference from task-content
  const cont=document.getElementById('task-content');
  cont.innerHTML=h;

  // Scroll to top of task screen
  document.getElementById('task-screen').scrollTop=0;
}

function storyNext(){
  const st=window._storyState;
  if(!st)return;
  if(st.pageIndex<st.story.pages.length-1){
    st.pageIndex++;
    renderStoryPage();
  }
}

function storyPrev(){
  const st=window._storyState;
  if(!st)return;
  if(st.pageIndex>0){
    st.pageIndex--;
    renderStoryPage();
  }
}

function storyFinish(){
  celebrate();
  const title=window._storyState?window._storyState.story.title:'the story';
  setTimeout(()=>taskComplete(`You read "${title}"! Amazing! 📖⭐`),600);
}

// ============ CANVAS SYSTEM ============
function canvasToolsHTML(id,extra){
  const colors=extra
    ?[['#333'],['#2563eb'],['#dc2626'],['#16a34a'],['#ea580c'],['#7c3aed'],['#ec4899']]
    :[['#333'],['#2563eb'],['#dc2626'],['#16a34a']];
  return `<div class="canvas-tools">
    ${colors.map((c,i)=>`<button class="color-btn${i===0?' active':''}" style="background:${c[0]}" onclick="setColorFor('${id}',this,'${c[0]}')"></button>`).join('')}
    <button class="clear-btn" onclick="clearCanvasById('${id}')">Clear 🗑️</button>
  </div>`;
}

function initCanvasById(id){
  const wrap=document.getElementById(`canvas-wrap-${id}`);
  const canvas=document.getElementById(`draw-canvas-${id}`);
  if(!canvas||!wrap)return;
  requestAnimationFrame(()=>{
    const rect=wrap.getBoundingClientRect();
    const dpr=window.devicePixelRatio||1;
    canvas.width=rect.width*dpr; canvas.height=rect.height*dpr;
    canvas.style.width=rect.width+'px'; canvas.style.height=rect.height+'px';
    const ctx=canvas.getContext('2d');
    ctx.scale(dpr,dpr); ctx.lineCap='round'; ctx.lineJoin='round'; ctx.lineWidth=4; ctx.strokeStyle='#333';
    canvases[id]={canvas,ctx,drawing:false,lastPt:null,color:'#333'};
    canvas.addEventListener('touchstart',e=>{e.preventDefault();cStart(id,e)},{passive:false});
    canvas.addEventListener('touchmove',e=>{e.preventDefault();cMove(id,e)},{passive:false});
    canvas.addEventListener('touchend',()=>cEnd(id));
    canvas.addEventListener('mousedown',e=>cStart(id,e));
    canvas.addEventListener('mousemove',e=>{if(canvases[id]?.drawing)cMove(id,e)});
    canvas.addEventListener('mouseup',()=>cEnd(id));
    canvas.addEventListener('mouseleave',()=>cEnd(id));
  });
}

function cPt(id,e){
  const r=canvases[id].canvas.getBoundingClientRect();
  const cx=e.touches?e.touches[0].clientX:e.clientX;
  const cy=e.touches?e.touches[0].clientY:e.clientY;
  return{x:cx-r.left,y:cy-r.top};
}
function cStart(id,e){const c=canvases[id];if(!c)return;c.drawing=true;c.lastPt=cPt(id,e);c.ctx.strokeStyle=c.color;c.ctx.beginPath();c.ctx.moveTo(c.lastPt.x,c.lastPt.y)}
function cMove(id,e){const c=canvases[id];if(!c||!c.drawing)return;const pt=cPt(id,e);c.ctx.lineTo(pt.x,pt.y);c.ctx.stroke();c.ctx.beginPath();c.ctx.moveTo(pt.x,pt.y);c.lastPt=pt}
function cEnd(id){const c=canvases[id];if(c){c.drawing=false;c.lastPt=null}}

function setColorFor(id,btn,color){
  if(canvases[id])canvases[id].color=color;
  btn.parentElement.querySelectorAll('.color-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
}
function clearCanvasById(id){
  const c=canvases[id];if(!c)return;
  const dpr=window.devicePixelRatio||1;
  c.ctx.clearRect(0,0,c.canvas.width/dpr,c.canvas.height/dpr);
}

function submitDrawing(id){
  let dataUrl=null;
  if(canvases[id])dataUrl=canvases[id].canvas.toDataURL('image/png');
  taskComplete('Look what I made! ✨',dataUrl);
}

// ============ TASK COMPLETION ============
function taskComplete(message,canvasDataUrl){
  if(parentMode){
    document.getElementById('parent-message').textContent=message;
    const preview=document.getElementById('parent-canvas-preview');
    if(canvasDataUrl){preview.src=canvasDataUrl;preview.style.display='block'}
    else{preview.style.display='none'}
    showScreen('parent-screen');
  } else {
    showAutoAdvance();
    autoTimer=setTimeout(()=>{clearAuto();currentTaskIndex++;showTask()},2500);
  }
}

function parentApprove(){currentTaskIndex++;showTask()}

function showAutoAdvance(){
  clearAuto();
  const o=document.createElement('div');o.className='auto-advance';o.id='auto-overlay';
  o.innerHTML='<div class="auto-bar"><div class="auto-fill"></div></div><div class="auto-text">Next task coming up...</div>';
  document.body.appendChild(o);
}
function clearAuto(){
  clearTimeout(autoTimer);
  const el=document.getElementById('auto-overlay');if(el)el.remove();
}

// ============ CELEBRATION ============
function celebrate(){
  const emojis=['⭐','🌟','✨','🎉','🎊','💫','🏆','👏','🐠','🐪'];
  const container=document.createElement('div');container.className='celebration';
  for(let i=0;i<6;i++){
    const span=document.createElement('span');span.className='celeb-emoji';
    span.textContent=pick(emojis);
    span.style.left=(15+Math.random()*70)+'%';
    span.style.top=(20+Math.random()*50)+'%';
    span.style.animationDelay=(i*0.1)+'s';
    container.appendChild(span);
  }
  document.body.appendChild(container);
  setTimeout(()=>container.remove(),1500);
}

// ============ COMPLETE SCREEN ============
function showComplete(){
  const names={dylan:'Dylan',theia:'Theia',together:'Dylan & Theia'};
  const name=names[currentChild]||'Explorer';
  const msgs=[`${name}, you're a superstar! 🌟`,`Amazing work, ${name}! 🎉`,
    `${name} — Egypt explorer champion! 🏆`,`Brilliant effort, ${name}! ✨`];
  document.getElementById('complete-message').textContent=pick(msgs);
  showScreen('complete-screen');
}

// ============ SERVICE WORKER ============
if('serviceWorker' in navigator){
  window.addEventListener('load',()=>{navigator.serviceWorker.register('sw.js').catch(()=>{})});
}
