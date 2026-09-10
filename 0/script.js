/* global THREE, gsap, ScrollTrigger */
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];
// Put your images/videos in the `assets` folder, then edit these file paths.
const media = {
  hero: 'assets/hero.png', about: 'assets/about.jpg',
  portfolio: ['assets/portfolio-01.jpg','assets/portfolio-02.JPG','assets/portfolio-03.jpg','assets/portfolio-04.JPG','assets/portfolio-05.JPG','assets/portfolio-06.JPG','assets/portfolio-07.JPG'],
  showreel: 'assets/showreel.mp4'
};
function setMedia(el, src, type = 'image') { const node = $(`[data-${type}]`, el); if (!node) return; node.src = src; node.addEventListener(type === 'video' ? 'loadeddata' : 'load', () => { el.classList.add('has-media'); if(type === 'video') node.play().catch(()=>{}); }, {once:true}); }

function preload() {
  const el = $('.preloader'), count = $('span', el), bar = $('.preloader-bar', el);
  let n = 0; const timer = setInterval(() => { n += Math.ceil(Math.random() * 12); n = Math.min(n, 100); count.textContent = n; bar.style.setProperty('--progress', n + '%'); bar.querySelector(':after'); bar.style.setProperty('background', `linear-gradient(90deg,#fff ${n}%,#333 ${n}%)`); if(n === 100){clearInterval(timer); gsap.to(el,{yPercent:-100,duration:.85,delay:.22,ease:'power4.inOut'});} }, 55);
}
function splitName() { $$('.kinetic-name span').forEach(line => { const text=line.textContent; line.innerHTML=[...text].map(ch=>`<b>${ch}</b>`).join(''); }); }
function loadMedia() { setMedia($('.hero-portrait'), media.hero); setMedia($('.tilt-card'), media.about); }
function initIco(){
  const host=$('#ico-scene'); if(!window.THREE){return} const scene=new THREE.Scene(), camera=new THREE.PerspectiveCamera(45,host.clientWidth/host.clientHeight,.1,100); camera.position.z=8;
  const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(host.clientWidth,host.clientHeight);host.appendChild(renderer.domElement);
  const geo=new THREE.IcosahedronGeometry(3.1,2), mat=new THREE.MeshBasicMaterial({color:0x111111,wireframe:true,transparent:true,opacity:.34});const mesh=new THREE.Mesh(geo,mat);scene.add(mesh);
  const resize=()=>{camera.aspect=host.clientWidth/host.clientHeight;camera.updateProjectionMatrix();renderer.setSize(host.clientWidth,host.clientHeight)};addEventListener('resize',resize);
  function draw(){if(!reduced){mesh.rotation.y+=.003;mesh.rotation.x+=.0015}renderer.render(scene,camera);requestAnimationFrame(draw)}draw();
}
function initCoverflow(){
  const host=$('#coverflow'), grid=$('#portfolio-grid'); const canWebGL=!!window.WebGLRenderingContext && !!document.createElement('canvas').getContext('webgl'); const cards=Array.from({length:7},(_,i)=>({index:i,angle:i*.9}));
  const make=(i,cls='flow-card')=>{const el=document.createElement('div');el.className=cls;el.innerHTML=`<img data-image alt="Portfolio ${i+1}"><span class="figure-placeholder"><i></i><b></b></span><span class="flow-label">${String(i+1).padStart(2,'0')}</span>`;setMedia(el,media.portfolio[i]);return el};
  if(!canWebGL || matchMedia('(max-width: 700px)').matches){host.hidden=true;grid.hidden=false;for(let i=0;i<7;i++)grid.append(make(i,'grid-card'));return;}
  const els=cards.map((_,i)=>{const el=make(i);host.append(el);return el}); let offset=0,down=false,last=0,velocity=0;
  const update=()=>{const mobile=matchMedia('(max-width: 700px)').matches,step=mobile?host.clientWidth*.54:175;els.forEach((el,i)=>{let x=i-offset;while(x>3.5)x-=7;while(x<-3.5)x+=7;const z=-Math.abs(x)*(mobile?135:150),rot=x*(mobile?-24:-28),scale=1-Math.abs(x)*(mobile?.11:.13);el.style.transform=`translate3d(calc(-50% + ${x*step}px),0,${z}px) rotateY(${rot}deg) scale(${scale})`;el.style.zIndex=String(20-Math.round(Math.abs(x)*10));el.style.filter=`brightness(${1-Math.abs(x)*.19})`})};
  host.addEventListener('pointerdown',e=>{down=true;last=e.clientX;velocity=0;host.setPointerCapture(e.pointerId)});host.addEventListener('pointermove',e=>{if(!down)return;velocity=(e.clientX-last)/70;offset-=velocity;last=e.clientX;update()});host.addEventListener('pointerup',()=>down=false);
  (function inertia(){if(!down&&Math.abs(velocity)>.01){offset-=velocity;velocity*=.92;update()}requestAnimationFrame(inertia)})();update();
}
function animations(){
  if(!window.gsap)return;gsap.registerPlugin(ScrollTrigger); const letters=$$('.kinetic-name b');gsap.from(letters,{yPercent:110,stagger:.035,duration:1.2,delay:.3,ease:'power4.out'});
  gsap.to('.hero-portrait',{yPercent:-12,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
  gsap.from('.about-copy h2',{xPercent:-15,opacity:0,scrollTrigger:{trigger:'.about',start:'top 70%',end:'top 35%',scrub:true}});
  const tilt=$('.tilt-card');tilt.addEventListener('pointermove',e=>{if(reduced)return;const r=tilt.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;gsap.to(tilt,{rotateY:x*13,rotateX:y*-13,duration:.35});});tilt.addEventListener('pointerleave',()=>gsap.to(tilt,{rotateX:0,rotateY:0,duration:.5}));
  const btn=$('.magnetic-button');btn.addEventListener('pointermove',e=>{if(reduced)return;const r=btn.getBoundingClientRect();gsap.to(btn,{x:(e.clientX-r.left-r.width/2)*.25,y:(e.clientY-r.top-r.height/2)*.25,duration:.3})});btn.addEventListener('pointerleave',()=>gsap.to(btn,{x:0,y:0,duration:.6,ease:'elastic.out(1,.4)'}));
}
function cursor(){if(!reduced){const d=$('.cursor-dot'),r=$('.cursor-ring');let x=innerWidth/2,y=innerHeight/2,rx=x,ry=y;document.body.classList.add('has-custom-cursor');const place=e=>{x=e.clientX;y=e.clientY;d.style.transform=`translate(${x}px,${y}px)`};addEventListener('pointermove',place,{passive:true});addEventListener('pointerdown',e=>{place(e);if(e.pointerType==='touch'){document.body.classList.add('has-touch-effect');setTimeout(()=>document.body.classList.remove('has-touch-effect'),260)}r.classList.add('is-pressed');setTimeout(()=>r.classList.remove('is-pressed'),220)},{passive:true});addEventListener('pointerover',e=>{if(e.target.closest('a,.flow-card,.tilt-card')){d.classList.add('is-active');r.classList.add('is-active')}});addEventListener('pointerout',e=>{if(e.target.closest('a,.flow-card,.tilt-card')){d.classList.remove('is-active');r.classList.remove('is-active')}});(function loop(){rx+=(x-rx)*.15;ry+=(y-ry)*.15;r.style.transform=`translate(${rx}px,${ry}px)`;requestAnimationFrame(loop)})();}}
splitName();preload();loadMedia();initIco();initCoverflow();animations();cursor();
