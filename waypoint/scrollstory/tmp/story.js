document.documentElement.classList.add('js');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// the card nearest the middle of the screen is "active"
// NGL molecular stages are created when their scene nears the screen; each step's data-view steers the camera
function nglFor(el) { return el._ngl || (el._ngl = new NglScene(el, JSON.parse(el.dataset.ngl))); }
const stepObserver = new IntersectionObserver(entries => entries.forEach(e => {
  e.target.classList.toggle('is-active', e.isIntersecting);
  const stageEl = e.target.closest('.scene')?.querySelector('.ngl-stage');
  if (e.isIntersecting && e.target.dataset.view && stageEl && typeof NglScene !== 'undefined') {
    nglFor(stageEl).apply(JSON.parse(e.target.dataset.view), reduce);
  }
}), {rootMargin: '-35% 0px -35% 0px'});
document.querySelectorAll('.step').forEach(el => stepObserver.observe(el));
const stageObserver = new IntersectionObserver((entries, obs) => entries.forEach(e => {
  if (e.isIntersecting) { nglFor(e.target); obs.unobserve(e.target); }
}), {rootMargin: '100% 0px'});
if (typeof NglScene !== 'undefined') document.querySelectorAll('.ngl-stage').forEach(el => stageObserver.observe(el));

// background videos play only while their scene is on screen, and not at all if motion is reduced
const videoObserver = new IntersectionObserver(entries => entries.forEach(e => {
  const v = e.target;
  if (e.isIntersecting && !reduce) v.play().catch(() => {}); else v.pause();
}), {threshold: 0.25});
document.querySelectorAll('video:not([controls])').forEach(v => videoObserver.observe(v));

// videos with their own controls belong to the reader: never start them, but pause them when scrolled away
const controlledObserver = new IntersectionObserver(entries => entries.forEach(e => {
  if (!e.isIntersecting) e.target.pause();
}), {threshold: 0});
document.querySelectorAll('video[controls]').forEach(v => controlledObserver.observe(v));
