const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');

if (window.matchMedia('(pointer: fine)').matches && dot && ring) {
  let mouseX = -100, mouseY = -100, ringX = -100, ringY = -100;
  const move = (event) => { mouseX = event.clientX; mouseY = event.clientY; dot.style.left = `${mouseX}px`; dot.style.top = `${mouseY}px`; dot.style.opacity = '1'; ring.style.opacity = '1'; };
  const render = () => { ringX += (mouseX - ringX) * .16; ringY += (mouseY - ringY) * .16; ring.style.left = `${ringX}px`; ring.style.top = `${ringY}px`; requestAnimationFrame(render); };
  window.addEventListener('mousemove', move);
  document.querySelectorAll('a, .interactive, button').forEach((item) => {
    item.addEventListener('mouseenter', () => ring.classList.add('active'));
    item.addEventListener('mouseleave', () => ring.classList.remove('active'));
  });
  render();
}
