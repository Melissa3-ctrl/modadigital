const carrossel =
document.querySelector('.carrossel');
console.log(carrossel);
let movimento = 0;

setInterval(() => {
    movimento -= 280;

     if (Math.abs(movimento) >=
carrossel.scrollWidth - 
window.innerWidth) {
    movimento = 0; 
   }

    carrossel.style.transform = 
    `translateX(${movimento}px)`;

}, 3000);
