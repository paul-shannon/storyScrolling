/* ngl-scene.js -- pure-JavaScript replacement for nglShiny: one structure, named representations
 * that can be shown, hidden and zoomed to. Needs the NGL library loaded first (global NGL).
 *   const scene = new NglScene(element, {structure: 'rcsb://1S5L', background: '#14201b', components: [...]});
 *   scene.apply({only: ['A.cartoon'], center: 'OEC AND :A', spin: true});
 * A component is {name, representation, selection, colorScheme, visible}, as in the R app's namedComponents. */
class NglScene {
  constructor(el, {structure = 'rcsb://1S5L', background = 'white', components = [], ext} = {}) {
    this.el = el;
    this.components = components;
    this.reps = {};
    this.stage = new NGL.Stage(el, {backgroundColor: background});
    // the mouse wheel belongs to the page, not to the molecule: keep NGL from zooming and hijacking scroll
    el.addEventListener('wheel', e => e.stopPropagation(), {capture: true, passive: true});
    new ResizeObserver(() => this.stage.handleResize()).observe(el);
    // Pass `ext` only when given: an explicit `ext: undefined` overrides the file type NGL works out for itself.
    const loadParams = {defaultRepresentation: false};
    if (ext) loadParams.ext = ext;
    this.ready = this.stage.loadFile(structure, loadParams).then(comp => {
      this.comp = comp;
      comp.autoView();
      for (const c of components) {
        this.reps[c.name] = comp.addRepresentation(c.representation, {
          sele: c.selection, name: c.name, colorScheme: c.colorScheme, visible: c.visible !== false});
      }
      return this;
    }).catch(err => {
      console.error('NglScene: could not load', structure, err);
      el.insertAdjacentHTML('beforeend', '<p style="padding:1rem;color:#c33">Could not load the molecular structure.</p>');
      throw err;
    });
  }

  setVisible(names, on) { for (const n of names) this.reps[n]?.setVisibility(on); }
  toggle(name) { const r = this.reps[name]; if (r) r.setVisibility(!r.visible); }
  isVisible(name) { return !!this.reps[name]?.visible; }
  center(selection, ms = 1500) { this.comp.autoView(selection, ms); }
  fit(ms = 1500) { this.comp.autoView(ms); }
  spin(on) { this.stage.setSpin(on); }
  hideAll() { this.setVisible(Object.keys(this.reps), false); }

  // view: {only: [names] | show: [names], hide: [names], center: 'selection', fit: true, spin: bool}
  apply(view = {}, instant = false) {
    return this.ready.then(() => {
      const ms = instant ? 0 : 1500;
      if (view.only) { this.hideAll(); this.setVisible(view.only, true); }
      if (view.hide) this.setVisible(view.hide, false);
      if (view.show) this.setVisible(view.show, true);
      if (view.center) this.center(view.center, ms);
      else if (view.fit) this.fit(ms);
      if ('spin' in view) this.spin(instant ? false : !!view.spin);
    });
  }
}
window.NglScene = NglScene;   // a class declaration is not a window property by itself
