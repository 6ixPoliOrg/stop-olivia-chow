/*
 * <carnival-dancer> v3
 * Sprite-sheet player web component.
 *
 * v3: costumes (assets/<costume>/), a looping idle move while resting,
 * per-move menu flag, move fallbacks per costume, 16 built-in moves.
 *
 * Changes from v1:
 * - Smooth scaling. The art is painted, not pixel art.
 * - Frame timing uses an accumulator, so 150 ms means 150 ms.
 * - Sheets load on demand. WebP is tried first, PNG is the fallback.
 * - One shared rest pose (rest-move / rest-frame) for every dance.
 * - Gentle idle bob while resting (idle-bob="false" to turn off).
 * - flip property mirrors the sprite.
 * - Moves are a manifest. CarnivalDancer.registerMove() adds new sheets.
 * - Per-frame durations are supported in the manifest.
 * - The status line only renders when controls are shown.
 * - play() and playOnce() always run. They are user or site initiated.
 *   Only auto-start is suppressed under prefers-reduced-motion.
 */
(() => {
  const SCRIPT = document.currentScript;
  const SCRIPT_BASE = SCRIPT?.src ? new URL('./assets/', SCRIPT.src).href : null;
  const DEFAULT_BASE = SCRIPT_BASE || './assets/';
  const DEFAULT_FRAME_SIZE = 362;
  const DEFAULT_FRAMES = 6;
  const FORMATS = { auto: ['webp', 'png'], webp: ['webp'], png: ['png'] };
  const MODES = ['auto', 'random', 'manual'];

  const MOVES = {};
  const COSTUMES = {};
  const sheetCache = new Map();
  let warnedBase = false;

  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

  function defineMove(name, def) {
    if (!name || !def) return false;
    const move = { ...def };
    move.label = move.label || name;
    move.menu = move.menu !== false;
    if (move.src && !move.sheet) move.sheet = String(move.src).replace(/\.(png|webp)$/i, '');
    if (!move.sheet) return false;
    move.row = Math.max(0, Math.floor(Number(move.row) || 0));
    move.frames = Math.max(1, Math.floor(Number(move.frames) || DEFAULT_FRAMES));
    move.frameSize = Math.max(1, Math.floor(Number(move.frameSize) || DEFAULT_FRAME_SIZE));
    if (Array.isArray(move.durations) && move.durations.length) {
      move.durations = Array.from({ length: move.frames }, (_, i) => Math.max(0, Number(move.durations[i % move.durations.length]) || 0));
    } else {
      move.durations = null;
    }
    MOVES[name] = move;
    return true;
  }

  [
    ['shoppingCart', { label: 'Shopping Cart', sheet: 'dance-1-2', row: 0 }],
    ['sprinkler',    { label: 'Sprinkler',     sheet: 'dance-1-2', row: 1 }],
    ['lawnmower',    { label: 'Lawnmower',     sheet: 'dance-3-4', row: 0 }],
    ['awkward',      { label: 'Awkward Dance', sheet: 'dance-3-4', row: 1 }],
    ['robot',        { label: 'Failed Robot',  sheet: 'dance-5-6', row: 0 }],
    ['disco',        { label: 'Disco Finale',  sheet: 'dance-5-6', row: 1 }],
    ['wave',         { label: 'Wave',          sheet: 'walk-1-2',      row: 1, durations: [150, 120, 160, 160, 160, 200] }],
    ['point',        { label: 'Point',         sheet: 'point-1-2',     row: 0, durations: [120, 120, 450, 450, 120, 150] }],
    ['jump',         { label: 'Surprise',      sheet: 'point-1-2',     row: 1, durations: [150, 90, 110, 110, 120, 250] }],
    ['cheer',        { label: 'Cheer',         sheet: 'celebrate-1-2', row: 0, durations: [150, 120, 160, 220, 180, 250] }],
    ['bow',          { label: 'Bow',           sheet: 'celebrate-1-2', row: 1, durations: [150, 150, 180, 500, 180, 200] }],
    ['idle',         { label: 'Idle',          sheet: 'idle-1-2',      row: 0, durations: [260], menu: false }],
    ['lookAround',   { label: 'Look Around',   sheet: 'idle-1-2',      row: 1, durations: [300, 120, 500, 700, 300, 400], menu: false }],
    ['walk',         { label: 'Walk',          sheet: 'walk-1-2',      row: 0, durations: [120], menu: false }],
    ['yawn',         { label: 'Yawn',          sheet: 'sleep-1-2',     row: 0, durations: [300, 200, 600, 250, 300, 400], menu: false }],
    ['snooze',       { label: 'Snooze',        sheet: 'sleep-1-2',     row: 1, durations: [380], menu: false }]
  ].forEach(([name, def]) => defineMove(name, def));

  function defineCostume(name, def = {}) {
    if (!name) return false;
    COSTUMES[name] = {
      label: def.label || name,
      path: def.path === undefined ? `${name}/` : def.path,
      moves: Array.isArray(def.moves) ? new Set(def.moves) : null, // null = every registered move
      fallbacks: { ...(def.fallbacks || {}) },
      restMove: def.restMove || 'idle',
      restFrame: Number(def.restFrame) || 0,
      idleMove: def.idleMove === undefined ? 'idle' : def.idleMove
    };
    return true;
  }
  defineCostume('purple', { label: 'Purple' });
  defineCostume('orange', { label: 'Orange' });

  const order = () => Object.keys(MOVES);
  const costumeOrder = () => Object.keys(COSTUMES);

  function costumeHas(costume, name) {
    const c = COSTUMES[costume];
    if (!MOVES[name]) return false;
    if (!c || !c.moves) return true;
    return c.moves.has(name);
  }

  function resolveIn(costume, name) {
    if (!MOVES[name]) return null;
    if (costumeHas(costume, name)) return name;
    const c = COSTUMES[costume];
    const fb = c?.fallbacks?.[name];
    if (fb && costumeHas(costume, fb)) return fb;
    if (c?.restMove && costumeHas(costume, c.restMove)) return c.restMove;
    return order().find(m => costumeHas(costume, m)) || null;
  }

  function loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Could not load ${url}`));
      img.src = url;
    });
  }

  function loadSheet(base, sheet, formats) {
    const key = `${base}|${sheet}|${formats.join(',')}`;
    if (!sheetCache.has(key)) {
      const promise = (async () => {
        let lastError = null;
        for (const ext of formats) {
          try { return await loadImage(`${base}${sheet}.${ext}`); }
          catch (err) { lastError = err; }
        }
        throw lastError || new Error(`Could not load ${base}${sheet}`);
      })();
      promise.catch(() => sheetCache.delete(key));
      sheetCache.set(key, promise);
    }
    return sheetCache.get(key);
  }

  class CarnivalDancer extends HTMLElement {
    static get observedAttributes() { return ['move', 'mode', 'flip', 'costume']; }
    static get moves() { return order(); }
    static get menuMoves() { return order().filter(m => MOVES[m].menu); }
    static moveLabel(name) { return MOVES[name]?.label || name; }
    static hasMove(name) { return Boolean(MOVES[name]); }
    static registerMove(name, def) { return defineMove(name, def); }
    static get manifest() { return MOVES; }
    static get costumes() { return costumeOrder(); }
    static costumeLabel(name) { return COSTUMES[name]?.label || name; }
    static registerCostume(name, def) { return defineCostume(name, def); }
    static isAvailable(name, costume) { return costumeHas(costume, name); }
    static resolveMove(name, costume) { return resolveIn(costume, name); }

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._frame = 0;
      this._move = 'shoppingCart';
      this._moveIndex = 0;
      this._mode = 'auto';
      this._paused = false;
      this._loops = 0;
      this._frameTime = 150;
      this._loopsPerMove = 2;
      this._speed = 1;
      this._acc = 0;
      this._last = 0;
      this._raf = 0;
      this._visible = true;
      this._flip = false;
      this._images = new Map();
      this._loading = new Map();
      this._oneShotTarget = null;
      this._oneShotDone = 0;
      this._playToken = 0;
      this._costume = costumeOrder()[0] || 'purple';
      this._idling = false;
    }

    connectedCallback() {
      const moveAttr = this.getAttribute('move');
      this._move = MOVES[moveAttr] ? moveAttr : (order()[0] || 'shoppingCart');
      const modeAttr = this.getAttribute('mode');
      this._mode = MODES.includes(modeAttr) ? modeAttr : 'auto';
      this._frameTime = clamp(Number(this.getAttribute('frame-time')) || 150, 30, 2000);
      this._loopsPerMove = Math.max(1, Math.floor(Number(this.getAttribute('loops-per-move')) || 2));
      this._flip = this.hasAttribute('flip') && this.getAttribute('flip') !== 'false';
      const costumeAttr = this.getAttribute('costume');
      if (COSTUMES[costumeAttr]) this._costume = costumeAttr;
      this._moveIndex = Math.max(0, order().indexOf(this._move));

      if (!SCRIPT_BASE && !this.getAttribute('asset-base') && !warnedBase) {
        warnedBase = true;
        console.warn('carnival-dancer: the script URL could not be detected (tag manager or module load). Set asset-base="/path/to/assets/" so the sprite sheets can be found.');
      }

      this._renderShell();
      this._ctx = this._canvas.getContext('2d');
      this._setSmoothing();
      this._bindControls();
      this._observeVisibility();
      this._setupResize();
      this._updateUI();

      if (this.hasAttribute('paused')) {
        this.rest();
        return;
      }

      const token = ++this._playToken;
      this._ensureSheet(this._move).then(() => {
        if (token !== this._playToken || !this.isConnected) return;
        this._draw();
        if (this._paused) return;
        if (this._prefersReducedMotion()) {
          this._paused = true;
          this._setResting(true);
          this._updateUI();
          return;
        }
        this._start();
      }).catch(() => {});
    }

    disconnectedCallback() {
      cancelAnimationFrame(this._raf);
      this._raf = 0;
      this._observer?.disconnect();
      this._resizeObserver?.disconnect();
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue === newValue || !this._ctx) return;
      if (name === 'move' && MOVES[newValue]) this.play(newValue, { manual: false });
      if (name === 'mode' && MODES.includes(newValue)) { this._mode = newValue; this._updateUI(); }
      if (name === 'flip') this.flip = newValue !== null && newValue !== 'false';
      if (name === 'costume' && COSTUMES[newValue]) this.costume = newValue;
    }

    // Public state
    get moves() { return order(); }
    get currentMove() { return this._move; }
    get currentFrame() { return this._frame; }
    get mode() { return this._mode; }
    get isPaused() { return this._paused; }
    get flip() { return this._flip; }
    set flip(value) {
      const next = Boolean(value);
      if (next === this._flip) return;
      this._flip = next;
      this._draw();
    }
    get speed() { return this._speed; }
    set speed(value) {
      const n = Number(value);
      this._speed = Number.isFinite(n) && n > 0 ? clamp(n, 0.25, 4) : 1;
    }
    hasMove(name) { return Boolean(MOVES[name]); }
    label(name) { return CarnivalDancer.moveLabel(name); }
    isAvailable(name) { return costumeHas(this._costume, name); }
    resolveMove(name) { return resolveIn(this._costume, name); }
    get isIdling() { return this._idling; }
    get costume() { return this._costume; }
    get costumes() { return costumeOrder(); }
    set costume(name) {
      if (!COSTUMES[name] || name === this._costume) return;
      this._costume = name;
      if (this.getAttribute('costume') !== name) this.setAttribute('costume', name);
      this._loading.clear();
      // the current move may not exist in the new costume
      const actual = resolveIn(name, this._move) || this._move;
      if (actual !== this._move) {
        this._move = actual;
        this._frame = Math.min(this._frame, (MOVES[actual]?.frames || 1) - 1);
      }
      const token = ++this._playToken;
      this._ensureSheet(this._move).then(() => { if (token === this._playToken) this._draw(); }).catch(() => {});
      this.dispatchEvent(new CustomEvent('costumechange', { detail: { costume: name } }));
    }

    // Public actions
    preload(names = null) {
      const list = Array.isArray(names) ? names : (names ? [names] : order());
      return Promise.allSettled(list.map(name => this._ensureSheet(name)));
    }

    play(name, { manual = true, loops = null } = {}) {
      name = resolveIn(this._costume, name);
      if (!name) return false;
      this._cancelOneShot();
      this._idling = false;
      this._move = name;
      this._moveIndex = order().indexOf(name);
      this._frame = 0;
      this._loops = 0;
      this._acc = 0;
      const n = Number(loops);
      this._oneShotTarget = Number.isFinite(n) && n > 0 ? Math.max(1, Math.floor(n)) : null;
      this._oneShotDone = 0;
      if (manual) this._mode = 'manual';
      this._paused = false;
      this._setResting(false);
      this._updateUI();
      this.dispatchEvent(new CustomEvent('dancechange', { detail: { move: name, mode: this._mode } }));

      const token = ++this._playToken;
      this._ensureSheet(name).then(() => {
        if (token !== this._playToken || !this.isConnected) return;
        this._draw();
      }).catch(err => {
        if (token !== this._playToken) return;
        console.error('carnival-dancer:', err.message);
        this._cancelOneShot();
        this._paused = true;
        this._updateUI();
      });
      this._draw();
      this._start();
      return true;
    }

    playOnce(name, { loops = 1 } = {}) {
      name = resolveIn(this._costume, name);
      if (!name) return Promise.resolve(false);
      this._cancelOneShot();
      return new Promise(resolve => {
        const cleanup = () => {
          this.removeEventListener('dancecomplete', onComplete);
          this.removeEventListener('dancecancel', onCancel);
        };
        const onComplete = event => {
          if (event.detail?.move !== name) return;
          cleanup();
          resolve(true);
        };
        const onCancel = event => {
          if (event.detail?.move !== name) return;
          cleanup();
          resolve(false);
        };
        this.addEventListener('dancecomplete', onComplete);
        this.addEventListener('dancecancel', onCancel);
        this.play(name, { manual: true, loops });
      });
    }

    /**
     * rest()            -> shared rest pose (rest-move, rest-frame)
     * rest(frame)       -> hold the current move on that frame
     * rest(frame,{move})-> hold a given move on that frame
     */
    /**
     * rest()             -> resting state: loops the idle move if one is available,
     *                       otherwise holds the rest pose (rest-move, rest-frame)
     * rest(frame)        -> hold the current move on that frame
     * rest(frame,{move}) -> hold a given move on that frame
     */
    rest(frame = null, { move = null } = {}) {
      this._cancelOneShot();
      if (frame === null || frame === undefined) {
        this._enterRest();
        return;
      }
      this._idling = false;
      this._paused = true;
      this._acc = 0;
      this._applyPose(move && MOVES[move] ? move : this._move, Number(frame) || 0);
      this._setResting(true, false);
      this._updateUI();
    }

    /** Loop a move as the resting state, e.g. idle('snooze'). */
    idle(moveName = null) {
      this._cancelOneShot();
      this._enterRest(moveName);
    }

    _enterRest(customIdle = null) {
      const idleMove = customIdle ? resolveIn(this._costume, customIdle) : this._idleMove();
      const canLoop = idleMove && this.getAttribute('idle-loop') !== 'false' && !this._prefersReducedMotion();
      this._acc = 0;
      this._oneShotTarget = null;
      this._oneShotDone = 0;
      if (canLoop) {
        this._idling = true;
        this._mode = 'manual';
        this._move = idleMove;
        this._moveIndex = order().indexOf(idleMove);
        this._frame = 0;
        this._loops = 0;
        this._paused = false;
        const token = ++this._playToken;
        this._ensureSheet(idleMove).then(() => { if (token === this._playToken) this._draw(); }).catch(() => {});
        this._draw();
        this._setResting(true, true);
        this._updateUI();
        this._start();
        return;
      }
      this._idling = false;
      this._paused = true;
      const restMove = this._restMove();
      this._applyPose(restMove, idleMove === restMove ? 0 : this._restFrame());
      this._setResting(true, false);
      this._updateUI();
    }

    auto() { this._resumeMode('auto'); }
    random() { this._resumeMode('random'); }

    pause() {
      this._paused = true;
      this._updateUI();
    }

    resume() {
      this._idling = false;
      this._paused = false;
      this._setResting(false);
      this._updateUI();
      this._start();
    }

    // Internals
    _resumeMode(mode) {
      this._cancelOneShot();
      this._idling = false;
      this._mode = mode;
      this._paused = false;
      this._setResting(false);
      this._updateUI();
      this._start();
    }

    _cancelOneShot() {
      if (this._oneShotTarget === null) return;
      const cancelledMove = this._move;
      this._oneShotTarget = null;
      this._oneShotDone = 0;
      this.dispatchEvent(new CustomEvent('dancecancel', { detail: { move: cancelledMove } }));
    }

    _restMove() {
      const attr = this.getAttribute('rest-move');
      if (costumeHas(this._costume, attr)) return attr;
      const c = COSTUMES[this._costume];
      if (c?.restMove && costumeHas(this._costume, c.restMove)) return c.restMove;
      if (costumeHas(this._costume, 'shoppingCart')) return 'shoppingCart';
      return order().find(m => costumeHas(this._costume, m)) || order()[0];
    }

    _restFrame() {
      const attr = this.getAttribute('rest-frame');
      if (attr !== null && attr !== '') return Math.max(0, Math.floor(Number(attr) || 0));
      return Math.max(0, COSTUMES[this._costume]?.restFrame || 0);
    }

    _idleMove() {
      const attr = this.getAttribute('idle-move');
      if (attr === 'none') return null;
      if (costumeHas(this._costume, attr)) return attr;
      const c = COSTUMES[this._costume];
      return c?.idleMove && costumeHas(this._costume, c.idleMove) ? c.idleMove : null;
    }

    _applyPose(moveName, frame) {
      if (!MOVES[moveName]) return;
      this._move = moveName;
      this._moveIndex = order().indexOf(moveName);
      this._frame = clamp(Math.floor(frame) || 0, 0, MOVES[moveName].frames - 1);
      const token = ++this._playToken;
      this._ensureSheet(moveName).then(() => {
        if (token === this._playToken) this._draw();
      }).catch(() => {});
      this._draw();
    }

    _setResting(on, looping = false) {
      this._stage?.classList.toggle('resting', Boolean(on));
      this._stage?.classList.toggle('looping', Boolean(on && looping));
    }

    _assetBase() {
      const attr = this.getAttribute('asset-base');
      if (!attr) return DEFAULT_BASE;
      try { return new URL(attr, document.baseURI).href; } catch { return attr; }
    }

    _formats() {
      return FORMATS[this.getAttribute('asset-format')] || FORMATS.auto;
    }

    _prefersReducedMotion() {
      return Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
    }

    _sheetKey(move) { return `${this._costume}|${move.sheet}`; }

    _costumeBase() {
      const path = COSTUMES[this._costume]?.path ?? `${this._costume}/`;
      return this._assetBase() + path;
    }

    _ensureSheet(name) {
      const move = MOVES[name];
      if (!move) return Promise.reject(new Error(`Unknown move "${name}"`));
      const key = this._sheetKey(move);
      if (this._images.has(key)) return Promise.resolve(this._images.get(key));
      if (this._loading.has(key)) return this._loading.get(key);
      const promise = loadSheet(this._costumeBase(), move.sheet, this._formats()).then(img => {
        this._images.set(key, img);
        this._loading.delete(key);
        return img;
      }, err => {
        this._loading.delete(key);
        if (this._status) this._status.textContent = err.message;
        throw err;
      });
      this._loading.set(key, promise);
      return promise;
    }

    _renderShell() {
      const showControls = this.getAttribute('controls') !== 'false';
      const bob = this.getAttribute('idle-bob') !== 'false';
      const size = MOVES[this._move]?.frameSize || DEFAULT_FRAME_SIZE;
      this.shadowRoot.innerHTML = `
        <style>
          :host { display:inline-block; max-width:100%; font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; color:inherit; }
          .wrap { width:min(100%, var(--dancer-width, 320px)); }
          .stage { position:relative; width:100%; aspect-ratio:1; display:grid; place-items:center; }
          canvas { width:100%; height:100%; display:block; }
          ${bob ? '.stage.resting:not(.looping) canvas { animation:dancer-bob 3.2s ease-in-out infinite; will-change:transform; }' : ''}
          @keyframes dancer-bob { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-3px); } }
          @media (prefers-reduced-motion:reduce) { .stage.resting canvas { animation:none; } }
          .controls { margin-top:12px; display:flex; flex-wrap:wrap; justify-content:center; gap:8px; }
          button, select { min-height:42px; border:1px solid rgba(127,127,127,.35); background:rgba(127,127,127,.10); color:inherit; border-radius:999px; padding:8px 12px; font:inherit; cursor:pointer; }
          button:hover, select:hover { background:rgba(127,127,127,.18); }
          button:focus-visible, select:focus-visible { outline:3px solid currentColor; outline-offset:2px; }
          button[aria-pressed="true"] { background:rgba(127,127,127,.28); font-weight:700; }
          .status { margin-top:8px; text-align:center; font-size:12px; opacity:.7; min-height:1.4em; }
          @media (max-width:520px) { .wrap { width:min(100%, var(--dancer-width-mobile, 240px)); } .controls { gap:6px; } button, select { min-height:40px; padding:7px 10px; font-size:14px; } }
        </style>
        <div class="wrap">
          <div class="stage">
            <canvas width="${size}" height="${size}" ${showControls ? 'role="img" aria-label="Animated carnival dancer"' : 'aria-hidden="true"'}></canvas>
          </div>
          ${showControls ? `
          <div class="controls" aria-label="Dance controls">
            <select class="move" aria-label="Choose dance">
              ${order().map(k => `<option value="${k}">${MOVES[k].label}</option>`).join('')}
            </select>
            <button type="button" class="auto">Auto</button>
            <button type="button" class="random">Random</button>
            <button type="button" class="pause">Pause</button>
          </div>
          <div class="status" aria-live="polite"></div>` : ''}
        </div>`;
      this._stage = this.shadowRoot.querySelector('.stage');
      this._canvas = this.shadowRoot.querySelector('canvas');
      this._status = this.shadowRoot.querySelector('.status');
      this._moveSelect = this.shadowRoot.querySelector('.move');
      this._autoBtn = this.shadowRoot.querySelector('.auto');
      this._randomBtn = this.shadowRoot.querySelector('.random');
      this._pauseBtn = this.shadowRoot.querySelector('.pause');
    }

    _setSmoothing() {
      if (!this._ctx) return;
      this._ctx.imageSmoothingEnabled = true;
      if ('imageSmoothingQuality' in this._ctx) this._ctx.imageSmoothingQuality = 'high';
    }

    _bindControls() {
      if (!this._moveSelect) return;
      this._moveSelect.addEventListener('change', e => this.play(e.target.value));
      this._autoBtn.addEventListener('click', () => this.auto());
      this._randomBtn.addEventListener('click', () => this.random());
      this._pauseBtn.addEventListener('click', () => this._paused ? this.resume() : this.pause());
    }

    _observeVisibility() {
      if (!('IntersectionObserver' in window)) return;
      this._observer = new IntersectionObserver(entries => {
        this._visible = entries[0]?.isIntersecting ?? true;
        if (this._visible) this._last = 0;
      }, { threshold: 0.01 });
      this._observer.observe(this);
    }

    _setupResize() {
      if (!('ResizeObserver' in window)) return;
      this._resizeObserver = new ResizeObserver(() => this._draw());
      this._resizeObserver.observe(this);
    }

    _start() {
      if (this._raf || !this.isConnected) return;
      this._last = 0;
      this._raf = requestAnimationFrame(t => this._tick(t));
    }

    _frameDuration() {
      const move = MOVES[this._move];
      const custom = move?.durations?.[this._frame];
      return Math.max(16, (custom || this._frameTime) / this._speed);
    }

    _tick(time) {
      this._raf = 0;
      if (!this.isConnected) return;
      if (this._paused) return;

      const move = MOVES[this._move];
      const loaded = move && this._images.has(this._sheetKey(move));
      if (this._visible && loaded) {
        if (!this._last) this._last = time;
        let elapsed = time - this._last;
        this._last = time;
        if (elapsed > 500) elapsed = 0; // tab was hidden; do not fast-forward
        this._acc += elapsed;
        let guard = 0;
        while (!this._paused && guard < 12) {
          const duration = this._frameDuration();
          if (this._acc < duration) break;
          this._acc -= duration;
          this._advance();
          guard++;
        }
        if (this._paused) this._acc = 0;
      } else {
        this._last = time;
      }

      if (this._paused) return;
      this._raf = requestAnimationFrame(t => this._tick(t));
    }

    _advance() {
      const move = MOVES[this._move];
      if (!move) return;
      this._frame++;
      if (this._frame >= move.frames) {
        this._frame = 0;
        this._loops++;

        if (this._oneShotTarget !== null) {
          this._oneShotDone++;
          if (this._oneShotDone >= this._oneShotTarget) {
            const completedMove = this._move;
            this._oneShotTarget = null;
            this._oneShotDone = 0;
            this._enterRest();
            this.dispatchEvent(new CustomEvent('dancecomplete', { detail: { move: completedMove } }));
            return;
          }
        }

        if (this._mode !== 'manual' && this._loops >= this._loopsPerMove) {
          this._loops = 0;
          const list = order();
          if (this._mode === 'random') {
            const choices = list.filter(x => x !== this._move);
            this._move = choices[Math.floor(Math.random() * choices.length)] || this._move;
          } else {
            this._moveIndex = (this._moveIndex + 1) % list.length;
            this._move = list[this._moveIndex];
          }
          this._moveIndex = list.indexOf(this._move);
          const token = ++this._playToken;
          this._ensureSheet(this._move).then(() => { if (token === this._playToken) this._draw(); }).catch(() => {});
          this.dispatchEvent(new CustomEvent('dancechange', { detail: { move: this._move, mode: this._mode } }));
          this._updateUI();
        }
      }
      this._draw();
    }

    _draw() {
      if (!this._ctx) return;
      const move = MOVES[this._move];
      if (!move) return;
      const img = this._images.get(this._sheetKey(move));
      if (!img) return; // keep the last frame on screen while a sheet loads
      const size = move.frameSize;
      if (this._canvas.width !== size || this._canvas.height !== size) {
        this._canvas.width = size;
        this._canvas.height = size;
        this._setSmoothing();
      }
      const ctx = this._ctx;
      const frame = clamp(this._frame, 0, move.frames - 1);
      ctx.clearRect(0, 0, size, size);
      ctx.save();
      if (this._flip) {
        ctx.translate(size, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(img, frame * size, move.row * size, size, size, 0, 0, size, size);
      ctx.restore();
    }

    _updateUI() {
      if (this._moveSelect) this._moveSelect.value = this._move;
      if (this._autoBtn) this._autoBtn.setAttribute('aria-pressed', this._mode === 'auto' ? 'true' : 'false');
      if (this._randomBtn) this._randomBtn.setAttribute('aria-pressed', this._mode === 'random' ? 'true' : 'false');
      if (this._pauseBtn) {
        this._pauseBtn.textContent = this._paused ? 'Resume' : 'Pause';
        this._pauseBtn.setAttribute('aria-pressed', this._paused ? 'true' : 'false');
      }
      if (this._status) {
        const suffix = this._paused ? ' (paused)' : this._idling ? ' (resting)' : ` (${this._mode})`;
        this._status.textContent = `${MOVES[this._move]?.label || ''}${suffix}`;
      }
    }
  }

  if (!customElements.get('carnival-dancer')) customElements.define('carnival-dancer', CarnivalDancer);
  window.CarnivalDancer = CarnivalDancer;
  window.CarnivalDancerMoves = MOVES;
  window.CarnivalDancerCostumes = COSTUMES;
})();
