/* ============================
   LOADER
============================ */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 1600);
});

/* ============================
   MUSIC
============================ */
const bgMusic   = document.getElementById('bgMusic');
const musicBtn  = document.getElementById('musicBtn');
const musicIcon = document.getElementById('musicIcon');
let musicPlaying = false;

function tryPlay() {
  bgMusic.play().then(() => {
    musicIcon.textContent = '🔊';
    musicPlaying = true;
  }).catch(() => {});
}

document.body.addEventListener('click', () => { if (!musicPlaying) tryPlay(); }, { once: true });

musicBtn.addEventListener('click', e => {
  e.stopPropagation();
  if (musicPlaying) {
    bgMusic.pause();
    musicIcon.textContent = '🎵';
    musicPlaying = false;
  } else {
    tryPlay();
  }
});

/* ============================
   CUSTOM CURSOR (desktop)
============================ */
const cursor    = document.createElement('div');
const cursorDot = document.createElement('div');
cursor.className    = 'cursor';
cursorDot.className = 'cursor-dot';
document.body.appendChild(cursor);
document.body.appendChild(cursorDot);

let cx = 0, cy = 0, tx = 0, ty = 0;

document.addEventListener('mousemove', e => {
  tx = e.clientX; ty = e.clientY;
  cursorDot.style.left = tx + 'px';
  cursorDot.style.top  = ty + 'px';
});

(function animCursor() {
  cx += (tx - cx) * 0.11;
  cy += (ty - cy) * 0.11;
  cursor.style.left = cx + 'px';
  cursor.style.top  = cy + 'px';
  requestAnimationFrame(animCursor);
})();

// Enlarge cursor over interactive elements
document.querySelectorAll('button,.gallery-card,.tl-card,.envelope,.book-3d').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1.9)';
    cursor.style.borderColor = 'var(--gold)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    cursor.style.borderColor = '';
  });
});

/* ============================
   SCROLL FADE
============================ */
const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('show'); });
}, { threshold: 0.12 });

document.querySelectorAll('.fade').forEach(el => fadeObserver.observe(el));

/* ============================
   BOOK — SWIPE + BUTTONS
============================ */
const book      = document.getElementById('book');
const pages     = document.querySelectorAll('.paper');
const bookPrev  = document.getElementById('bookPrev');
const bookNext  = document.getElementById('bookNext');
const bookCurEl = document.getElementById('bookCurrent');
const bookTotEl = document.getElementById('bookTotal');
let pageIdx  = 0;
let flipping = false;
const FLIP_DUR = 1250;

bookTotEl.textContent = pages.length;

function updateBook() {
  bookCurEl.textContent = pageIdx < pages.length ? pageIdx + 1 : pages.length;
  bookPrev.disabled = pageIdx === 0;
  bookNext.disabled = pageIdx >= pages.length;
}

function flipNext() {
  if (flipping || pageIdx >= pages.length) return;
  flipping = true;
  const p = pages[pageIdx];
  p.classList.add('flipping');  // z-index:10 — animation stays visible on top
  p.classList.add('flipped');   // starts the rotateY transition
  pageIdx++;
  updateBook();
  setTimeout(() => { p.classList.remove('flipping'); flipping = false; }, FLIP_DUR);
}

function flipPrev() {
  if (flipping || pageIdx <= 0) return;
  flipping = true;
  pageIdx--;
  const p = pages[pageIdx];
  p.classList.add('flipping');   // z-index:10 — reverse animation also stays on top
  p.classList.remove('flipped'); // starts the reverse rotateY transition
  updateBook();
  setTimeout(() => { p.classList.remove('flipping'); flipping = false; }, FLIP_DUR);
}

bookNext.addEventListener('click', flipNext);
bookPrev.addEventListener('click', flipPrev);

// Touch swipe (mobile)
let swipeStartX = 0;
book.addEventListener('touchstart', e => { swipeStartX = e.touches[0].clientX; }, { passive: true });
book.addEventListener('touchend', e => {
  const diff = swipeStartX - e.changedTouches[0].clientX;
  if (diff > 50)  flipNext();
  if (diff < -50) flipPrev();
});

updateBook();

/* ============================
   GALLERY — DRAG SCROLL
============================ */
const gallery = document.querySelector('.gallery-track');
if (gallery) {
  let isDragging = false, dragStartX = 0, scrollStart = 0;

  gallery.addEventListener('mousedown', e => {
    isDragging = true;
    dragStartX  = e.pageX - gallery.offsetLeft;
    scrollStart = gallery.scrollLeft;
    gallery.style.cursor = 'grabbing';
  });
  ['mouseleave','mouseup'].forEach(ev =>
    gallery.addEventListener(ev, () => { isDragging = false; gallery.style.cursor = 'grab'; })
  );
  gallery.addEventListener('mousemove', e => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - gallery.offsetLeft;
    gallery.scrollLeft = scrollStart - (x - dragStartX) * 1.4;
  });
}

/* ============================
   ENVELOPE
============================ */
const envelopeEl      = document.getElementById('envelope');
const envHint         = document.getElementById('envHint');
const letterContainer = document.getElementById('letterContainer');

envelopeEl.addEventListener('click', () => {
  if (envelopeEl.classList.contains('open')) return;
  envelopeEl.classList.add('open');
  envHint.classList.add('hidden');

  setTimeout(() => {
    letterContainer.style.display = 'block';
    envelopeEl.style.opacity      = '0';
    envelopeEl.style.transform    = 'scale(.85) translateY(-10px)';
    envelopeEl.style.pointerEvents = 'none';
    envelopeEl.style.transition   = 'opacity .5s ease, transform .5s ease';
  }, 950);
});

/* ============================
   PARTICLES
============================ */
const pLayer = document.getElementById('particles');

function spawn(syms, cls, sRange = [14, 30], dRange = [4, 8]) {
  const el = document.createElement('div');
  el.className  = cls;
  el.textContent = syms[Math.floor(Math.random() * syms.length)];
  el.style.left  = (Math.random() * 100) + 'vw';
  el.style.fontSize = (sRange[0] + Math.random() * (sRange[1] - sRange[0])) + 'px';
  el.style.animationDuration = (dRange[0] + Math.random() * (dRange[1] - dRange[0])) + 's';
  pLayer.appendChild(el);
  setTimeout(() => el.remove(), 10000);
}

setInterval(() => spawn(['💖','💕','❤️','🩷','💗'], 'love',   [11, 28], [5, 9]),  950);
setInterval(() => spawn(['🌸','✿','🌼'],              'sakura', [10, 24], [6, 11]), 820);

function launchConfetti() {
  const mix = ['🎊','✨','💖','🎉','💫','⭐','💝','🌟'];
  for (let i = 0; i < 140; i++) {
    setTimeout(() => spawn(mix, 'confetti', [12, 26], [3, 6]), i * 28);
  }
}

/* ============================
   FINAL QUESTION
============================ */
const yesBtn   = document.getElementById('yes');
const noBtn    = document.getElementById('no');
const popup    = document.getElementById('popup');

let yesScale   = 1;
let noScale    = 1;
let noClickN   = 0;

const noTexts  = [
  'No 🙈',
  'Are you sure? 🥺',
  'Think again! 💕',
  'Pleasee 🙏',
  'Last chance! 💖',
  'You know you want to 😏',
];

yesBtn.addEventListener('click', e => {
  e.stopPropagation();
  launchConfetti();
  popup.style.display = 'flex';
});

noBtn.addEventListener('click', e => {
  e.stopPropagation();

  // Yes grows
  yesScale += 0.18;
  yesBtn.style.transform = `scale(${yesScale})`;

  // No shrinks
  noScale -= 0.1;
  if (noScale < 0.35) noScale = 0.35;
  noBtn.style.transform = `scale(${noScale})`;

  // Cycle text
  noClickN++;
  if (noClickN < noTexts.length) {
    noBtn.textContent = noTexts[noClickN];
  }

  // After 3 clicks, start running away
  if (noClickN >= 3) {
    const bx = window.innerWidth  * 0.32;
    const by = window.innerHeight * 0.22;
    noBtn.style.position = 'relative';
    noBtn.style.left     = ((Math.random() - 0.5) * bx) + 'px';
    noBtn.style.top      = ((Math.random() - 0.5) * by) + 'px';
    noBtn.style.transition = 'left .3s ease, top .3s ease, transform .3s ease';
  }
});

function closePopup() {
  popup.style.display = 'none';
}
