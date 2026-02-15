/* MUSIC */
const bgMusic = document.getElementById("bgMusic");
document.body.addEventListener("click", () => bgMusic.play(), { once:true });

/* FADE */
const observer = new IntersectionObserver(e=>{
  e.forEach(x=>x.isIntersecting && x.target.classList.add("show"));
},{threshold:.15});
document.querySelectorAll(".fade").forEach(el=>observer.observe(el));

/* BOOK SWIPE */
const book = document.getElementById("book");
const papers = document.querySelectorAll(".paper");

let pageIndex = 0;
let startX = 0;

book.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
});

book.addEventListener("touchend", e => {
  const endX = e.changedTouches[0].clientX;
  const diff = startX - endX;

  // OPEN
  if (diff > 50 && pageIndex < papers.length) {
    papers[pageIndex].classList.add("flipped");
    pageIndex++;

    // geser buku ke tengah pas kebuka
    book.style.transform = "translateX(140px)";
  }

  // CLOSE
  if (diff < -50 && pageIndex > 0) {
    pageIndex--;
    papers[pageIndex].classList.remove("flipped");

    // balik ke tengah
    book.style.transform = "translateX(0)";
  }
});


// TOUCH (mobile)
book.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
});

book.addEventListener("touchend", e => {
  const diff = startX - e.changedTouches[0].clientX;

  if (diff > 50 && index < papers.length) {
    papers[index].classList.add("flipped");
    index++;
  }

  if (diff < -50 && index > 0) {
    index--;
    papers[index].classList.remove("flipped");
  }
});

// CLICK (desktop)
book.addEventListener("click", () => {
  if (index < papers.length) {
    papers[index].classList.add("flipped");
    index++;
  } else {
    index = papers.length;
  }
});


/* ENVELOPE PLAYFUL */
const env=document.getElementById("openEnv");
const letter=document.querySelector(".letter");
const hint=document.getElementById("envHint");

env.addEventListener("click",()=>{
  hint.classList.add("hide");
  env.style.animation="wiggle .6s";
  letter.style.display="block";
});

document.styleSheets[0].insertRule(`
@keyframes wiggle {
  0%,100%{transform:rotate(0)}
  25%{transform:rotate(6deg)}
  75%{transform:rotate(-6deg)}
}
`,0);

/* PARTICLES */
const layer=document.createElement("div");
layer.className="particles";
document.body.appendChild(layer);

function spawn(sym,cls,s=[14,30],d=[4,8]){
  let e=document.createElement("div");
  e.className=cls;
  e.innerText=sym[Math.random()*sym.length|0];
  e.style.left=Math.random()*100+"vw";
  e.style.fontSize=s[0]+Math.random()*(s[1]-s[0])+"px";
  e.style.animationDuration=d[0]+Math.random()*(d[1]-d[0])+"s";
  layer.appendChild(e);
  setTimeout(()=>e.remove(),9000);
}

setInterval(()=>spawn(["💖","💕","❤️"],"love"),900);
setInterval(()=>spawn(["🌸","🌼"],"sakura",[14,26],[5,9]),700);

function launchConfetti(){
  for(let i=0;i<90;i++)
    spawn(["🎊","✨","💖"],"confetti",[14,22],[3,5]);
}

/* FINAL */
const yes = document.getElementById("yes");
const no = document.getElementById("no");
const popup = document.getElementById("popup");
let scale = 1;

no.onclick = () => {
  yes.style.transform = `scale(${scale += .14})`;
};

yes.onclick = () => {
  launchConfetti();
  popup.style.display = "flex";
  no.disabled = true;
};


function closePopup() {
  popup.style.display = "none";
}
