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
   BOOK
   Two-phase flip on a single card element.
   Phase 1: card rotates to 90° (edge-on, invisible). ~260ms
   Phase 2: content swaps, card rotates in from -90°.  ~300ms
   No stacked elements. No z-index. No backface tricks.
============================ */
const BOOK_PAGES = [
  { img: 'img/book1.jpg', text: 'I loved you in ways I never knew how to explain.' },
  { img: 'img/book2.jpg', text: 'In your presence, my chaos learned peace.' },
  { img: 'img/book3.jpg', text: 'You are my favorite reason to smile every single day.' },
  { img: 'img/card7.jpeg', text: 'Loving you is the best decision my heart ever made.', dummy: 'db1' },
  { img: 'img/book5.jpg', text: 'I choose you, in this life and in every version of me.' },
  { img: 'img/book6.jpg', text: 'Always you, always us.' },
];

const OUT_MS    = 260;
const IN_MS     = 300;
const MID_SCALE = 0.88;

let bookIdx  = 0;
let bookBusy = false;

const bookCard  = document.getElementById('bookCard');
const bookMedia = document.getElementById('bookMedia');
const bookTxt   = document.getElementById('bookText');
const dotsWrap  = document.getElementById('bookDots');
const btnPrev   = document.getElementById('bookPrev');
const btnNext   = document.getElementById('bookNext');
const bookStage = document.querySelector('.book-stage');

// Build dot indicators
BOOK_PAGES.forEach((_, i) => {
  const d = document.createElement('button');
  d.className = 'book-dot';
  d.setAttribute('aria-label', `Page ${i + 1}`);
  d.addEventListener('click', () => goTo(i));
  dotsWrap.appendChild(d);
});

function renderCard(idx) {
  const p = BOOK_PAGES[idx];
  bookMedia.innerHTML = p.img
    ? `<img src="${p.img}" alt="">`
    : `<div class="dummy-book ${p.dummy}" style="width:100%;height:100%;"></div>`;
  bookTxt.textContent = p.text;
}

function syncUI() {
  dotsWrap.querySelectorAll('.book-dot').forEach((d, i) =>
    d.classList.toggle('active', i === bookIdx)
  );
  btnPrev.disabled = bookIdx === 0;
  btnNext.disabled = bookIdx === BOOK_PAGES.length - 1;
}

function goTo(target) {
  if (bookBusy || target === bookIdx) return;
  if (target < 0 || target >= BOOK_PAGES.length) return;
  bookBusy = true;

  // dir: which side the card exits toward
  const exitDeg  = target > bookIdx ? -90 : 90;
  const enterDeg = target > bookIdx ?  90 : -90;

  // Phase 1 — rotate out to edge (invisible at 90°)
  bookCard.style.transition = `transform ${OUT_MS}ms ease-in, opacity ${OUT_MS}ms ease-in`;
  bookCard.style.transform  = `rotateY(${exitDeg}deg) scale(${MID_SCALE})`;
  bookCard.style.opacity    = '0';

  setTimeout(() => {
    // Snap to opposite edge instantly (no transition, card is hidden)
    bookCard.style.transition = 'none';
    bookCard.style.transform  = `rotateY(${enterDeg}deg) scale(${MID_SCALE})`;

    // Swap content while invisible
    bookIdx = target;
    renderCard(bookIdx);
    syncUI();

    // Force browser to register the snap before animating in
    void bookCard.offsetHeight;

    // Phase 2 — rotate into view
    bookCard.style.transition = `transform ${IN_MS}ms ease-out, opacity ${IN_MS}ms ease-out`;
    bookCard.style.transform  = 'rotateY(0deg) scale(1)';
    bookCard.style.opacity    = '1';

    setTimeout(() => { bookBusy = false; }, IN_MS);
  }, OUT_MS);
}

// Initial render
renderCard(0);
syncUI();
bookCard.style.transform = 'rotateY(0deg) scale(1)';
bookCard.style.opacity   = '1';

// Buttons
btnNext.addEventListener('click', () => goTo(bookIdx + 1));
btnPrev.addEventListener('click', () => goTo(bookIdx - 1));

// Swipe (mobile)
let bkTouchX = 0;
bookStage.addEventListener('touchstart', e => { bkTouchX = e.touches[0].clientX; }, { passive: true });
bookStage.addEventListener('touchend', e => {
  const diff = bkTouchX - e.changedTouches[0].clientX;
  if (diff > 50)  goTo(bookIdx + 1);
  if (diff < -50) goTo(bookIdx - 1);
});

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
