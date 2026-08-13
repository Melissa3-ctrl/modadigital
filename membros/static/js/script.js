// Configurações
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length; // Agora são 3
const dots = document.querySelectorAll('.dot');
let autoSlideInterval;

// Função para mostrar um slide específico
function showSlide(index) {
    // Verifica limites
    if (index < 0) {
        currentSlide = totalSlides - 1; // Volta para o último (2)
    } else if (index >= totalSlides) {
        currentSlide = 0; // Volta para o primeiro (0)
    } else {
        currentSlide = index;
    }
    
    // Move o carrossel
    const slidesContainer = document.querySelector('.slides');
    slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Atualiza dots
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

// Próximo slide
function nextSlide() {
    showSlide(currentSlide + 1);
    resetAutoSlide();
}

// Slide anterior
function prevSlide() {
    showSlide(currentSlide - 1);
    resetAutoSlide();
}

// Ir para um slide específico
function currentSlide(index) {
    showSlide(index);
    resetAutoSlide();
}

// Auto-play (muda a cada 3 segundos)
function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        nextSlide();
    }, 3000);
}

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}

// Pausar no hover
const carousel = document.querySelector('.carousel');
carousel.addEventListener('mouseenter', () => {
    clearInterval(autoSlideInterval);
});

carousel.addEventListener('mouseleave', () => {
    startAutoSlide();
});

// Navegação por teclado
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        nextSlide();
    } else if (e.key === 'ArrowLeft') {
        prevSlide();
    }
});

// Inicialização
showSlide(0);
startAutoSlide();

// Expor funções globalmente
window.nextSlide = nextSlide;
window.prevSlide = prevSlide;
window.currentSlide = currentSlide;