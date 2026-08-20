// Registrando os Plugins GSAP
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

// 1. Inicializa o ScrollSmoother
ScrollSmoother.create({
  wrapper: '#smooth-wrapper',
  content: '#smooth-content',
  smooth: 1.5,
  effects: true
});

// 2. Configuração do Canvas (Sequência de Imagens)
const canvas = document.getElementById("stage-canvas");
const context = canvas.getContext("2d");

// Defina a resolução base das imagens originais (ex: 1920x1080)
canvas.width = 1920; 
canvas.height = 1080;

const frameCount = 74;

// Função ajustada conforme a foto: img-01.webp, img-02.webp, etc.
const currentFrame = index => {
  let num = (index + 1).toString().padStart(2, '0');
  return `assets/frames/img-${num}.webp`;
};

const images = [];
const airpods = { frame: 0 }; // Objeto para animarmos

for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  images.push(img);
}

// Quando a primeira imagem carregar, renderiza no canvas
images[0].onload = render;

function render() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  if(images[airpods.frame]) {
    context.drawImage(images[airpods.frame], 0, 0, canvas.width, canvas.height);
  }
}

// 3. Preparação dos Textos com SplitText
const split1 = new SplitText(".text-1", { type: "chars" });
const split2 = new SplitText(".text-2", { type: "chars" });
const split3 = new SplitText(".text-3", { type: "chars" });

// Ocultamos inicialmente as letras dos textos 2 e 3
gsap.set(split2.chars, { opacity: 0 });
gsap.set(split3.chars, { opacity: 0 });

// 4. Criação da Timeline com ScrollTrigger (Pin & Scrub)
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "+=8000", // Controla a duração geral do scroll (quanto maior, mais lento para rolar)
    scrub: 1,      // Suaviza o vínculo da animação com o scroll
    pin: true,     // Fixa a seção enquanto a timeline roda
  }
});

// A) Animação da sequência de imagens do canvas 
tl.to(airpods, {
  frame: frameCount - 1,
  snap: "frame",
  ease: "none",
  onUpdate: render,
  duration: 10
}, 0); // Inicia na posição 0 da timeline

// B) Animação dos Textos
// Texto 1 desaparece (letras aleatórias)
tl.to(split1.chars, {
  opacity: 0,
  stagger: { amount: 1.2, from: "random" },
  duration: 1.2,
  ease: "power1.inOut"
}, 1); // Inicia aos 10% do scroll (posição 1 de 10)

// Texto 2 aparece
tl.to(split2.chars, {
  opacity: 1,
  stagger: { amount: 1.2, from: "random" },
  duration: 1.2,
  ease: "power1.inOut"
}, 2); // Inicia na posição 2

// Texto 2 desaparece
tl.to(split2.chars, {
  opacity: 0,
  stagger: { amount: 1.2, from: "random" },
  duration: 1.2,
  ease: "power1.inOut"
}, 5); // Inicia na metade do scroll (posição 5 de 10)

// Texto 3 aparece
tl.to(split3.chars, {
  opacity: 1,
  stagger: { amount: 1.2, from: "random" },
  duration: 1.2,
  ease: "power1.inOut"
}, 6.5); // Inicia na posição 6.5