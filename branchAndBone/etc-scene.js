/* etc-scene.js -- the electron transport chain as a scroll-driven NGL scene.
 * Same interface as NglScene (ngl-scene.js): story.js calls scene.apply(view, reducedMotion) as each text card
 * becomes the active one. Here a view is just {step: N}:
 *   0  the chain at rest: photon, chlorophyll, pheophytin, plastoquinone, cytochrome b6f, plastocyanin
 *   1  the photon flies to chlorophyll, which lights up
 *   2  the charge moves to pheophytin
 *   3  ... to plastoquinone
 *   4  ... to cytochrome b6f
 *   5  ... to plastocyanin
 *   6  plastocyanin travels to Photosystem I
 * Every step describes the whole picture, so scrolling quickly, or back up, always lands on the right state.
 * The molecule classes are the ones in stage/ (stage/electronTransportChain.html is the button-driven original). */
class EtcScene {
  // --- tuning ---------------------------------------------------------------------------------
  static PHOTON_MS = 2000;           // photon flight to chlorophyll
  static PLASTOCYANIN_MS = 4000;     // plastocyanin's trip to Photosystem I
  static CAMERA_MS = 1500;           // camera moves between steps
  static PHOTON_START = [100, 0, 0];
  static PHOTON_END = [40.5, -11.7, 0];
  static PC_START = [40, -80, 8];
  static PC_END = [-175.6, -72.16, 0];   // where the stage page's animation leaves it
  // ----------------------------------------------------------------------------------------------

  constructor(el, {background = '#f6f3ea'} = {}) {
    this.el = el;
    this.step = -1;            // the step currently on screen
    this.want = null;          // the step most recently asked for
    this.reduce = false;
    this.token = 0;            // bumped on every change; a running animation stops when it no longer matches
    this.stage = new NGL.Stage(el, {backgroundColor: background});
    this.stage.mouseControls.remove('clickPick-left');
    // the mouse wheel belongs to the page, not to the molecules
    el.addEventListener('wheel', e => e.stopPropagation(), {capture: true, passive: true});
    new ResizeObserver(() => this.stage.handleResize()).observe(el);
    this.ready = this.load().catch(err => {
      console.error('EtcScene: could not load', err);
      el.insertAdjacentHTML('beforeend', '<p style="padding:1rem;color:#c33">Could not load the molecules.</p>');
      throw err;
    });
  }

  async load() {
    const names = ['photon', 'chlorophyll', 'pheophytin', 'plastoquinone', 'cytochromeBF6', 'plastocyanin', 'ps1'];
    const mods = await Promise.all(names.map(n => import(`./stage/${n}.js`)));
    const [{Photon}, {Chlorophyll}, {Pheophytin}, {Plastoquinone}, {Cytochrome}, {Plastocyanin}, {Photosystem1}] = mods;
    const s = this.stage;
    // [instance, location]: the same layout as stage/electronTransportChain.html
    const parts = {
      photon: [new Photon(s), EtcScene.PHOTON_START],
      cla: [new Chlorophyll(s), [20, -43, -53.8]],
      pheo: [new Pheophytin(s), [0, 0, 2.12]],
      plasto: [new Plastoquinone(s), [16, -20, 15]],
      cyt: [new Cytochrome(s), [-147, -205, -178]],
      pc: [new Plastocyanin(s), EtcScene.PC_START],
    };
    this.m = {};
    await Promise.all(Object.values(parts).map(([mol]) => mol.load()));
    for (const [key, [mol, loc]] of Object.entries(parts)) {
      mol.buildRepresentations();
      mol.setLocation(...loc);
      mol.afterLoad();
      this.m[key] = mol;
    }
    s.autoView();
    // Photosystem I is big and far away, and autoView counts even hidden components, so it is only on the stage
    // during step 6. Fetching the file now just warms the browser cache for that moment.
    const ps1 = new Photosystem1(s);
    ps1.setLocation(-360, -220, -60);
    fetch(ps1.url).catch(() => {});
    this.m.ps1 = ps1;
  }

  apply(view, reduce = false) {
    if (view.step == null) return;
    this.want = view.step;
    this.reduce = reduce;
    this.ready.then(() => { if (this.want === view.step && this.step !== view.step) this.go(view.step); }).catch(() => {});
  }

  go(n) {
    const prev = this.step, token = ++this.token, {m, stage} = this;
    this.step = n;
    const fly = !this.reduce && prev >= 0 && n === prev + 1;      // animate only the one-step-forward moves
    const camMs = this.reduce ? 0 : EtcScene.CAMERA_MS;
    const chain = [m.cla, m.pheo, m.plasto, m.cyt, m.pc];          // steps 1..5 each light up one member
    const settle = () => {
      chain.forEach((mol, i) => (n === i + 1 ? mol.excite() : mol.relax()));
      stage.viewer.requestRender();
    };

    // photon: waiting at the sun until step 1, then gone
    if (n === 0) { m.photon.component.setPosition(EtcScene.PHOTON_START); m.photon.show(); }
    else if (n === 1 && fly) {
      chain.forEach(mol => mol.relax());
      this.tween(m.photon.component, EtcScene.PHOTON_START, EtcScene.PHOTON_END, EtcScene.PHOTON_MS, token).then(done => {
        if (!done) return;
        m.photon.hide(); settle(); stage.autoView(camMs);
      });
    } else m.photon.hide();

    // plastocyanin: home until step 6, then off to Photosystem I
    if (n < 6) {
      m.pc.component.setPosition(EtcScene.PC_START);
      m.ps1.remove();
    } else {
      m.ps1.restore().then(() => { if (token !== this.token) m.ps1.remove(); else stage.viewer.requestRender(); });
      stage.animationControls.zoomMove({x: -89, y: -67, z: 50}, -600, camMs);
      const after = () => stage.animationControls.zoomMove({x: -120, y: -67, z: 29}, -400, camMs);
      if (fly) this.tween(m.pc.component, EtcScene.PC_START, EtcScene.PC_END, EtcScene.PLASTOCYANIN_MS, token).then(done => done && after());
      else { m.pc.component.setPosition(EtcScene.PC_END); after(); }
    }

    if (!(n === 1 && fly)) settle();
    if (n < 6 && !(n === 1 && fly)) stage.autoView(camMs);
  }

  // move a component between two points; resolves true at the end, false if something else took over
  tween(comp, from, to, ms, token) {
    const t0 = performance.now();
    return new Promise(resolve => {
      const tick = now => {
        if (token !== this.token) return resolve(false);
        const t = Math.min(1, (now - t0) / ms);
        comp.setPosition(from.map((a, i) => a + (to[i] - a) * t));
        this.stage.viewer.requestRender();
        t < 1 ? requestAnimationFrame(tick) : resolve(true);
      };
      requestAnimationFrame(tick);
    });
  }
}
