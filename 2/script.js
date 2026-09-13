/* Centralized portfolio configuration-replace these values and image URLs first. */
const MODEL = {
  name: 'Dipika Daimary',
  location: 'Northeast India',
  profession: 'Fashion & Editorial Model',
  email: 'ddaimary992@gmail.com',
  instagram: 'https://www.instagram.com/dipiee_.1',
  images: {
    hero: 'assets/hero.jpg',
    portrait1: 'assets/portrait-01.jpg',
    portrait2: 'assets/portrait-02.jpg',
    editorial1: 'assets/editorial-01.jpg',
    editorial2: 'assets/editorial-02.jpg',
    fashion1: 'assets/fashion-01.jpg'
  }
};

const gallery = [
  ['portrait1', '01 / 06  EDITORIAL'], ['portrait2', '02 / 06  PORTRAIT'],
  ['editorial1', '03 / 06  LOCATION'], ['editorial2', '04 / 06  FASHION'], ['fashion1', '05 / 06  BEAUTY']
];

document.querySelectorAll('[data-image]').forEach((image) => { image.src = MODEL.images[image.dataset.image]; });
document.querySelectorAll('[data-email]').forEach((link) => { link.href = `mailto:${MODEL.email}`; });
document.querySelectorAll('[data-instagram]').forEach((link) => { link.href = MODEL.instagram; });

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
menuButton.addEventListener('click', () => { const opened = nav.classList.toggle('open'); menuButton.setAttribute('aria-expanded', opened); menuButton.setAttribute('aria-label', opened ? 'Close navigation' : 'Open navigation'); });
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => nav.classList.remove('open')));

const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.remove('is-hidden'); entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: .16 });
document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));

const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox.querySelector('img');
const lightboxCaption = lightbox.querySelector('figcaption');
let active = 0;
function showImage(index) { active = (index + gallery.length) % gallery.length; const [key, caption] = gallery[active]; lightboxImage.src = MODEL.images[key]; lightboxImage.alt = caption; lightboxCaption.textContent = caption; if (!lightbox.open) lightbox.showModal(); }
document.querySelectorAll('[data-gallery]').forEach((button) => button.addEventListener('click', () => showImage(Number(button.dataset.gallery))));
lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
lightbox.querySelector('.lightbox-prev').addEventListener('click', () => showImage(active - 1));
lightbox.querySelector('.lightbox-next').addEventListener('click', () => showImage(active + 1));
lightbox.addEventListener('click', (event) => { if (event.target === lightbox) lightbox.close(); });
document.addEventListener('keydown', (event) => { if (!lightbox.open) return; if (event.key === 'Escape') lightbox.close(); if (event.key === 'ArrowRight') showImage(active + 1); if (event.key === 'ArrowLeft') showImage(active - 1); });

const featuredImage = document.querySelector('.featured img');
window.addEventListener('scroll', () => { const rect = featuredImage.getBoundingClientRect(); if (rect.top < innerHeight && rect.bottom > 0) { featuredImage.style.transform = `scale(1.1) translateY(${(rect.top - innerHeight / 2) * -.035}px)`; } }, { passive: true });
