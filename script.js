/* ======================
   🎵 MUSIC
====================== */
const bgMusic = document.getElementById("bgMusic");
document.body.addEventListener("click", () => bgMusic.play(), { once: true });

/* ======================
   🌸 FADE ON SCROLL
====================== */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => e.isIntersecting && e.target.classList.add("show"));
}, { threshold: 0.15 });

document.querySelectorAll(".fade").forEach(el => observer.observe(el));

//* ======================
// 💳 CARD FLIP (TAP + SWIPE)
// ====================== */
const flipCard = document.getElementById("flipCard");

let startX = 0;

// TAP / CLICK
flipCard.addEventListener("click", () => {
  flipCard.classList.toggle("flipped");
});

// TOUCH START
flipCard.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
}, { passive: true });

// TOUCH END
flipCard.addEventListener("touchend", e => {
  const endX = e.changedTouches[0].clientX;
  const diff = startX - endX;

  if (Math.abs(diff) > 40) {
    flipCard.classList.toggle("flipped");
  }
});


// DESKTOP CLICK
book.addEventListener("click", () => {
  if (page < pages.length) {
    pages[page].classList.add("flipped");
    page++;
    book.style.transform = "translateX(140px)";
  }
});

/* ======================
   💌 ENVELOPE
====================== */
const env = document.getElementById("openEnv");
const letter = document.querySelector(".letter");
const hint = document.getElementById("envHint");

env.addEventListener("click", () => {
  hint.classList.add("hide");
  env.style.animation = "wiggle .6s";
  letter.style.display = "block";
});

document.styleSheets[0].insertRule(`
@keyframes wiggle {
  0%,100%{transform:rotate(0)}
  25%{transform:rotate(6deg)}
  75%{transform:rotate(-6deg)}
}
`, 0);

/* ======================
   🌸 PARTICLES
====================== */
const layer = document.createElement("div");
layer.className = "particles";
document.body.appendChild(layer);

function spawn(sym, cls, s = [14, 30], d = [4, 8]) {
  const e = document.createElement("div");
  e.className = cls;
  e.innerText = sym[Math.random() * sym.length | 0];
  e.style.left = Math.random() * 100 + "vw";
  e.style.fontSize = s[0] + Math.random() * (s[1] - s[0]) + "px";
  e.style.animationDuration = d[0] + Math.random() * (d[1] - d[0]) + "s";
  layer.appendChild(e);
  setTimeout(() => e.remove(), 9000);
}

setInterval(() => spawn(["💖", "💕", "❤️"], "love"), 900);
setInterval(() => spawn(["🌸", "🌼"], "sakura", [14, 26], [5, 9]), 700);

function launchConfetti() {
  for (let i = 0; i < 90; i++) {
    spawn(["🎊", "✨", "💖"], "confetti", [14, 22], [3, 5]);
  }
}

/* ======================
   💍 FINAL QUESTION
====================== */
const yes = document.getElementById("yes");
const no = document.getElementById("no");
const popup = document.getElementById("popup");

let scale = 1;

no.onclick = () => {
  scale += 0.14;
  yes.style.transform = `scale(${scale})`;
};

yes.onclick = () => {
  launchConfetti();
  popup.style.display = "flex";
  no.disabled = true;
};

function closePopup() {
  popup.style.display = "none";
}
