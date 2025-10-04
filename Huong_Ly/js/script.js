/* Minimal JS for balloons, fireworks/confetti and letter open */
(() => {
  // balloons (reduced)
  function createBalloon() {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    const colors = ['#ff8a80','#ff80ab','#ea80fc','#8c9eff','#80d8ff','#a7ffeb'];
    balloon.style.background = colors[Math.floor(Math.random()*colors.length)];
    balloon.style.left = Math.random() * (window.innerWidth - 80) + 'px';
    const size = 30 + Math.random()*50;
    balloon.style.width = size + 'px';
    balloon.style.height = size*1.25 + 'px';
    balloon.style.setProperty('--float-duration', (8 + Math.random()*6) + 's');
    balloon.style.setProperty('--swing-duration', (2 + Math.random()*2) + 's');
    document.body.appendChild(balloon);
    setTimeout(()=> balloon.remove(), 12000);
  }
  setInterval(()=> { if (Math.random() > 0.5) createBalloon(); }, 2200);

  // fireworks canvas
  const canvas = document.getElementById('fireworks');
  const ctx = canvas.getContext && canvas.getContext('2d');
  function resize() { if (canvas) { canvas.width = window.innerWidth; canvas.height = window.innerHeight; } }
  window.addEventListener('resize', resize); resize();

  class Particle {
    constructor(x,y,color,spd,ang){ this.x=x;this.y=y;this.c=color;this.s=spd;this.a=ang;this.l=80; }
    update(){ this.x += Math.cos(this.a)*this.s; this.y += Math.sin(this.a)*this.s; this.s *= 0.98; this.l--; }
    draw(){ if(!ctx) return; ctx.beginPath(); ctx.fillStyle=this.c; ctx.arc(this.x,this.y,2,0,Math.PI*2); ctx.fill(); }
  }
  let particles = [];
  function createFirework(x,y){ const bursts=[20,40,12]; bursts.forEach((count,bi)=>{ for(let i=0;i<count;i++){ const ang=(Math.PI*2*i)/count + (Math.random()-0.5)*0.2; const sp= Math.random()*(3+bi*1.2)+1+bi; const hue = Math.floor(Math.random()*360); const col = 'hsl('+hue+',90%,'+(60 - bi*6)+'%)'; particles.push(new Particle(x,y,col,sp,ang)); } }); }
  function animate(){ if(!ctx) return; ctx.clearRect(0,0,canvas.width,canvas.height); particles.forEach((p,i)=>{ p.update(); p.draw(); if(p.l<=0) particles.splice(i,1); }); requestAnimationFrame(animate); }
  animate();
  setInterval(()=> createFirework(Math.random()*canvas.width, Math.random()*canvas.height/2), 900);

  // confetti
  function spawnConfetti(x,y){ const colors=['#ff8a80','#ff80ab','#ea80fc','#8c9eff','#80d8ff','#a7ffeb']; for(let i=0;i<24;i++){ const el=document.createElement('div'); el.className='confetti'; el.style.background=colors[Math.floor(Math.random()*colors.length)]; el.style.left = (x + (Math.random()-0.5)*200)+'px'; el.style.top = (y + (Math.random()-0.5)*60)+'px'; el.style.transform = 'rotate('+Math.random()*360+'deg)'; document.body.appendChild(el); const dur = 900 + Math.random()*700; el.animate([{ transform:el.style.transform+' translateY(0)', opacity:1 },{ transform:el.style.transform+' translateY(200px) rotate('+ (Math.random()*720-360)+'deg)', opacity:0 }], { duration: dur, easing: 'cubic-bezier(.2,.8,.2,1)' }); setTimeout(()=> el.remove(), dur+50); } }

  // initial 3s show
  const start = Date.now(); const initInt = setInterval(()=>{ if(Date.now()-start>3000){ clearInterval(initInt); return; } createFirework(Math.random()*canvas.width, 80 + Math.random()*120); spawnConfetti(Math.random()*canvas.width, 80+Math.random()*80); }, 240);

  // letter open -> show message after flap animation
  const letterBtn = document.getElementById('letter');
  if(letterBtn){ let opening=false; letterBtn.addEventListener('click', ()=>{ if(opening) return; opening=true; letterBtn.classList.add('open'); setTimeout(()=>{ const msg=document.getElementById('message'); if(msg) msg.classList.remove('hidden'); opening=false; }, 500); }); }
  const closeBtn = document.getElementById('closeMessage'); if(closeBtn) closeBtn.addEventListener('click', ()=>{ const msg=document.getElementById('message'); if(msg) msg.classList.add('hidden'); });

  // add click-to-burst fireworks for interactivity (inside IIFE)
  if (canvas) {
    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      createFirework(x, y);
    });
  }

  // AUDIO toggle (muteBtn inside the seal)
  const audioEl = document.querySelector('audio');
  const muteBtn = document.getElementById('muteBtn');
  if (muteBtn && audioEl) {
    // initial state: playing -> show sound icon
    muteBtn.textContent = '🔊';
    muteBtn.addEventListener('click', (ev) => {
      ev.stopPropagation(); // don't open the envelope when clicking speaker
      if (audioEl.paused) {
        audioEl.play().catch(()=>{});
        muteBtn.textContent = '🔊';
        muteBtn.classList.remove('off');
      } else {
        audioEl.pause();
        muteBtn.textContent = '🔇';
        muteBtn.classList.add('off');
      }
    });
  }

  // ensure OK button closes message and resets letter to closed state
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      const msg = document.getElementById('message');
      if (msg) msg.classList.add('hidden');
      // reset letter to not open
      if (letterBtn) letterBtn.classList.remove('open');
      // update mute button visual according to audio state
      if (muteBtn && audioEl) {
        if (audioEl.paused) {
          muteBtn.textContent = '🔇';
          muteBtn.classList.add('off');
        } else {
          muteBtn.textContent = '🔊';
          muteBtn.classList.remove('off');
        }
      }
    });
  }

})();
