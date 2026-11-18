/* tableau-scene.js -- pictures arranged on a stage, with a bit of light that is thrown from one to the next.
 * Same interface as NglScene and EtcScene: story.js calls scene.apply(view, reducedMotion) as each card becomes
 * the active one. Everything is described in story.yaml (scene media: {tableau: {...}}), nothing here is
 * specific to one story:
 *
 *   media:
 *     tableau:
 *       aspect: 1.77                 # width / height of the stage; it is fitted inside the pinned area
 *       background: "#ffffff"
 *       light: {size: 1.4}           # the little ball of light; size is a % of the stage width
 *       items:                       # x, y = top-left corner and w = width, all in % of the stage
 *         - {id: sun, img: media/sun.png, x: 58, y: 0, w: 11, alt: "The sun"}
 *         - {id: arrow, shape: arrow, x: 51, y: 80, w: 17}          # a built-in yellow arrow
 *         - {id: raven, img: media/raven.jpg, x: 18, y: 37, w: 18, hold: [0.5, 0.3]}   # hold: where the light rests
 *
 * and each card's view says where everything is at that moment (every view is a whole picture, so scrolling
 * quickly, or back up, always lands in the right state):
 *   view: {light: raven}             # an item id, or [x, y] in % of the stage
 *   view: {light: canoe, place: {canoe: [60.8, 76.7]}}      # place: items that have moved from their home x, y
 *   view: {focus: [raven, mink]}     # everything else fades back (leave out for no fading)
 * The item holding the light glows. Moves and throws take MOVE_MS; with reduced motion they are instant. */
class TableauScene {
  static MOVE_MS = 1200;

  constructor(el, cfg = {}) {
    this.el = el;
    this.ar = cfg.aspect || 16 / 9;
    this.step = -1;
    this.items = {};
    el.classList.add('tableau');
    if (cfg.background) el.style.background = cfg.background;
    this.canvas = document.createElement('div');
    this.canvas.className = 'tab-canvas';
    el.append(this.canvas);
    for (const it of cfg.items || []) this.addItem(it);
    this.light = document.createElement('div');
    this.light.className = 'tab-light';
    this.light.style.width = `${(cfg.light && cfg.light.size) || 1.4}%`;
    this.dot = document.createElement('div');
    this.dot.className = 'tab-dot';
    this.light.append(this.dot);
    this.canvas.append(this.light);
    new ResizeObserver(() => this.fit()).observe(el);
    this.fit();
  }

  addItem(it) {
    const box = document.createElement('div');
    box.className = 'tab-item';
    box.style.width = `${it.w}%`;
    if (it.shape === 'arrow') {
      box.innerHTML = '<svg viewBox="0 0 204 32" aria-hidden="true"><polygon points="1,9 150,9 150,1 203,16 150,31 150,23 1,23" fill="#f5e83a" stroke="#e8302a" stroke-width="2" stroke-linejoin="round"/></svg>';
    } else {
      const img = new Image();
      img.alt = it.alt || '';
      img.addEventListener('load', () => this.refresh());
      img.addEventListener('error', () => {      // a missing picture still shows where it will go
        box.classList.add('missing');
        box.replaceChildren(it.label || it.id);
        this.refresh();
      });
      img.src = it.img;
      box.append(img);
    }
    this.canvas.append(box);
    this.items[it.id] = {el: box, home: [it.x, it.y], pos: [it.x, it.y], hold: it.hold || [0.5, 0.5]};
    box.style.left = `${it.x}%`;
    box.style.top = `${it.y}%`;
  }

  fit() {                                   // the stage keeps its shape, as large as the pinned area allows
    const w = Math.min(this.el.clientWidth, this.el.clientHeight * this.ar);
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${w / this.ar}px`;
  }

  refresh() { if (this.view) this.go(this.view, true); }   // an image arrived, so heights (and hold points) changed

  apply(view, reduce = false) {
    if (view.light == null && !view.place && !view.focus) return;
    this.reduce = reduce;
    this.go(view, this.step < 0);
    this.view = view;
  }

  // where the light is, in % of the stage
  lightPoint(where) {
    if (Array.isArray(where)) return where;
    const it = this.items[where];
    if (!it) return null;
    const [x, y] = it.pos, W = this.canvas.clientWidth || 1, H = this.canvas.clientHeight || 1;
    const w = it.el.offsetWidth / W * 100, h = it.el.offsetHeight / H * 100;
    return [x + it.hold[0] * w, y + it.hold[1] * h];
  }

  go(view, instant) {
    const ms = instant || this.reduce ? 0 : TableauScene.MOVE_MS;
    this.canvas.style.setProperty('--move', `${ms}ms`);
    this.step++;
    for (const [id, it] of Object.entries(this.items)) {
      it.pos = (view.place && view.place[id]) || it.home;
      it.el.style.left = `${it.pos[0]}%`;
      it.el.style.top = `${it.pos[1]}%`;
      it.el.classList.toggle('dim', !!view.focus && !view.focus.includes(id));
    }
    clearTimeout(this.glowTimer);               // the holder glows when the light arrives, not while it is still flying
    const glow = () => { for (const [id, it] of Object.entries(this.items)) it.el.classList.toggle('has-light', view.light === id); };
    if (ms) { for (const it of Object.values(this.items)) it.el.classList.remove('has-light'); this.glowTimer = setTimeout(glow, ms); }
    else glow();
    const to = this.lightPoint(view.light);
    if (!to) return;
    const from = this.lightAt;
    this.lightAt = to;
    this.light.style.left = `${to[0]}%`;
    this.light.style.top = `${to[1]}%`;
    if (ms && from && (from[0] !== to[0] || from[1] !== to[1])) {   // a throw: straight across, with a hump in the middle
      const W = this.canvas.clientWidth, H = this.canvas.clientHeight;
      const dist = Math.hypot((to[0] - from[0]) / 100 * W, (to[1] - from[1]) / 100 * H);
      const apex = Math.min(H * 0.25, dist * 0.3);
      this.arc?.cancel();
      this.arc = this.dot.animate(
        [{transform: 'translateY(0)'}, {transform: `translateY(${-apex}px)`, offset: 0.5}, {transform: 'translateY(0)'}],
        {duration: ms, easing: 'ease-in-out'});
    }
  }
}
