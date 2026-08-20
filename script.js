gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

ScrollSmoother.create({
  wrapper: '#smooth-wrapper',
  content: '#smooth-content',
  smooth: 1.5,
  effects: true
});

const canvas = document.getElementById("stage-canvas");
const context = canvas.getContext("2d");

canvas.width = 1920; 
canvas.height = 1080;

const frameCount = 74;

const currentFrame = index => {
  let num = (index + 1).toString().padStart(2, '0');
  return `assets/frames/img-${num}.webp`;
};

const images = [];
const airpods = { frame: 0 };

for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  images.push(img);
}

images[0].onload = render;

function render() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  if(images[airpods.frame]) {
    context.drawImage(images[airpods.frame], 0, 0, canvas.width, canvas.height);
  }
}

const split1 = new SplitText(".text-1", { type: "chars" });
const split2 = new SplitText(".text-2", { type: "chars" });
const split3 = new SplitText(".text-3", { type: "chars" });

gsap.set(split2.chars, { opacity: 0 });
gsap.set(split3.chars, { opacity: 0 });



// TIMELINE PRINCIPAL 

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "+=8000", // Mais longo para caber a animação do vídeo
    scrub: 1,      
    pin: true,     
  }
});

//Sequência do Canvas (Duração estendida para 12 para casar com o novo scroll)
tl.to(airpods, {
  frame: frameCount - 1,
  snap: "frame",
  ease: "none",
  onUpdate: render,
  duration: 12
}, 0); 

// B) Troca de Textos
tl.to(split1.chars, {
  opacity: 0,
  stagger: { amount: 1.2, from: "random" },
  duration: 1.2,
  ease: "power1.inOut"
}, 1); 

tl.to(split2.chars, {
  opacity: 1,
  stagger: { amount: 1.2, from: "random" },
  duration: 1.2,
  ease: "power1.inOut"
}, 2); 

tl.to(split2.chars, {
  opacity: 0,
  stagger: { amount: 1.2, from: "random" },
  duration: 1.2,
  ease: "power1.inOut"
}, 5); 

tl.to(split3.chars, {
  opacity: 1,
  stagger: { amount: 1.2, from: "random" },
  duration: 1.2,
  ease: "power1.inOut"
}, 6.5);



// ANIMAÇÃO DA MÁSCARA E VÍDEO (NOVO)

// Essa animação começa no tempo '9' (depois que o texto 3 já está na tela)

// Revela a div do vídeo do centro para as bordas
tl.to(".trailer-wrapper", {
  clipPath: "inset(0%)", // Vai para 100% (corte zero)
  duration: 3,
  ease: "power2.inOut"
}, 9);

// Empurra a Logo (Esquerda) para fora da tela
tl.to(".movie__title", {
  x: -800, // Move 800px para esquerda
  opacity: 0,
  duration: 3,
  ease: "power2.inOut"
}, 9);

// Empurra os textos (Direita) para fora da tela
tl.to(".movie__desc-container", {
  x: 800, // Move 800px para direita
  opacity: 0,
  duration: 3,
  ease: "power2.inOut"
}, 9);

// Ao chegar no final do mask reveal, exibe o botão de Play
tl.to(".trailer-play-btn", {
  opacity: 1,
  pointerEvents: "auto", // Torna clicável
  duration: 0.5
}, 11.5); // Quase no fim da abertura do vídeo




// INTERAÇÃO DO PLAYER DE VÍDEO 

const trailerVideo = document.querySelector('.trailer-video');
const trailerPlayBtn = document.querySelector('.trailer-play-btn');
const trailerWrapper = document.querySelector('.trailer-wrapper');

// Função centralizada para alternar entre Play e Pause
function toggleVideoState() {
  if (trailerVideo.paused || trailerVideo.muted) {
    // Se for a primeira vez (está mudo), tira o mudo e volta do início
    if (trailerVideo.muted) {
      trailerVideo.currentTime = 0;
      trailerVideo.muted = false;
    }
    trailerVideo.play();
    trailerWrapper.classList.add('is-playing'); 
    
    // Esconde o botão Play
    gsap.to(trailerPlayBtn, { opacity: 0, pointerEvents: "none", duration: 0.3 });
  } else {
    // Pausa o vídeo
    trailerVideo.pause();
    trailerWrapper.classList.remove('is-playing'); // Volta o overlay escuro
    
    // Mostra o botão Play novamente no centro da tela
    gsap.to(trailerPlayBtn, { opacity: 1, pointerEvents: "auto", duration: 0.3 });
  }
}

// Evento de clique no botão Play
trailerPlayBtn.addEventListener('click', (e) => {
  e.stopPropagation(); // Impede que o clique "vaze" para o wrapper atrás dele
  toggleVideoState();
});

// Evento de clique na tela (wrapper) para pausar/despausar
trailerWrapper.addEventListener('click', () => {
  // Só permite pausar clicando na tela se o vídeo principal já foi iniciado (não está mudo)
  if (!trailerVideo.muted) {
    toggleVideoState();
  }
});