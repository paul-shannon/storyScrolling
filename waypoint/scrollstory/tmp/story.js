document.documentElement.classList.add('js');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// the card nearest the middle of the screen is "active"
const stepObserver = new IntersectionObserver(entries => entries.forEach(e =>
  e.target.classList.toggle('is-active', e.isIntersecting)), {rootMargin: '-35% 0px -35% 0px'});
document.querySelectorAll('.card').forEach(el => stepObserver.observe(el));

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
