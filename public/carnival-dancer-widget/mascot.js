/*
 * <carnival-mascot> v3
 * Fixed-corner mascot controller built on <carnival-dancer>.
 *
 * v3: costume toggle in the menu (remembered), walk-in entrance with a wave,
 * looping idle, occasional look-around, yawn and snooze after long inactivity
 * with a startled wake-up, pointing at hovered CTAs, a bow at the end of the page.
 *
 * Changes from v1:
 * - Footer avoidance recalculates on scroll (rAF-throttled) and animates.
 * - Section detection uses viewport coverage, so long sections work.
 * - A settle delay stops fast scrolling from stuttering through dances.
 * - Triggers have priorities. Lower priority waits or is dropped.
 * - Rest pose is shared; she does not freeze on frame 0 of each dance.
 * - Scroll tilt and scroll-direction flip (both can be turned off).
 * - Landing squash after the entrance.
 * - Close button with remembered dismissal.
 * - Ducks out of the way of open dialogs and aria-modal elements.
 * - position="bottom-left" option, z-index attribute.
 * - Menu: Escape closes, click-outside closes, focus is managed.
 * - Menu and API dances still work under prefers-reduced-motion.
 * - Bubble duration scales with text length. say() API.
 * - Reading timers pause when the tab is hidden.
 * - Entrance sheet loads first; the rest load in idle time.
 */
(() => {
  const PRIORITY = { reading: 1, section: 2, api: 3, menu: 4, entrance: 5 };
  const DEFAULT_STORAGE_KEY = 'carnival-mascot:dismissed';
  const COSTUME_STORAGE_KEY = 'carnival-mascot:costume';

  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
  const clampNumber = (value, fallback, min, max) => {
    if (value === null || value === undefined || String(value).trim() === '') return fallback;
    const n = Number(value);
    return Number.isFinite(n) ? clamp(n, min, max) : fallback;
  };
  const escAttr = value => String(value ?? '')
    .replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const escText = value => String(value ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  class CarnivalMascot extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._entered = false;
      this._hidden = false;
      this._ducked = false;
      this._destroyed = false;
      this._menuOpen = false;

      this._sections = [];
      this._near = new Set();
      this._currentSection = null;
      this._candidate = null;
      this._sectionObserver = null;
      this._duckObserver = null;

      this._active = null;
      this._pending = null;
      this._sequence = 0;

      this._lastY = 0;
      this._lastScrollAt = 0;
      this._velocity = 0;
      this._framePending = false;
      this._duckPending = false;
      this._lastBottom = null;
      this._costume = null;
      this._asleep = false;
      this._bowed = false;
      this._pointUntil = 0;

      this._sleepTimer = 0;
      this._fidgetTimer = 0;
      this._scrollTimer = 0;
      this._idleRepeatTimer = 0;
      this._settleTimer = 0;
      this._motionTimer = 0;
      this._flipTimer = 0;
      this._bubbleTimer = 0;

      this._onScrollBound = () => this._onScroll();
      this._onResizeBound = () => this._requestFrame();
      this._onVisibilityBound = () => this._onVisibility();
      this._onInteractionBound = () => this._onInteraction();
      this._onPointerOverBound = event => this._onPointTarget(event);
      this._docKey = null;
      this._docDown = null;
    }

    connectedCallback() {
      const Dancer = customElements.get('carnival-dancer');
      if (!Dancer) {
        console.error('CarnivalMascot requires dancer.js to be loaded before mascot.js.');
        return;
      }
      this._Dancer = Dancer;
      this._lastY = window.scrollY || 0;
      this._lastScrollAt = performance.now();
      this._costume = this._initialCostume();

      this._render();
      this._cacheNodes();
      this._bind();
      this._syncSafeArea();
      this._setupSections();
      this._setupDucking();
      this._setupPointing();
      this._preloadStart();

      if (this._isDismissed()) {
        this._hidden = true;
        this._shell.classList.add('dismissed');
        return;
      }
      this._scheduleEntrance();
    }

    disconnectedCallback() {
      this._destroyed = true;
      this._sectionObserver?.disconnect();
      this._duckObserver?.disconnect();
      window.removeEventListener('scroll', this._onScrollBound);
      window.removeEventListener('resize', this._onResizeBound);
      document.removeEventListener('visibilitychange', this._onVisibilityBound);
      document.removeEventListener('pointerdown', this._onInteractionBound, { capture: true });
      document.removeEventListener('keydown', this._onInteractionBound, { capture: true });
      document.removeEventListener('pointerover', this._onPointerOverBound, true);
      document.removeEventListener('focusin', this._onPointerOverBound, true);
      this._removeMenuListeners();
      clearTimeout(this._sleepTimer);
      clearTimeout(this._fidgetTimer);
      clearTimeout(this._scrollTimer);
      clearTimeout(this._idleRepeatTimer);
      clearTimeout(this._settleTimer);
      clearTimeout(this._motionTimer);
      clearTimeout(this._flipTimer);
      clearTimeout(this._bubbleTimer);
    }

    // Public API
    get dancer() { return this._dancer; }
    get currentSection() { return this._currentSection; }
    get isDismissed() { return this._hidden; }

    get dismissed() { return this._hidden; }
    get isDucked() { return this._ducked; }
    get isMenuOpen() { return this._menuOpen; }
    get isAsleep() { return this._asleep; }
    get costume() { return this._costume; }
    get costumes() { return this._Dancer ? this._Dancer.costumes : []; }
    set costume(name) { this.setCostume(name); }

    setCostume(name, { animate = true, remember = true } = {}) {
      if (!this._Dancer || !this._Dancer.costumes.includes(name) || name === this._costume || this._destroyed) return false;
      const apply = () => {
        this._costume = name;
        this._dancer.costume = name;
        this.setAttribute('costume', name);
        this.refreshMenu();
        this._dancer.preload();
        this.dispatchEvent(new CustomEvent('mascotcostumechange', { detail: { costume: name } }));
      };
      if (remember && this._flag('remember-costume', true)) this._storeCostume(name);
      if (!animate || this._prefersReducedMotion() || !this._entered || this._hidden) {
        apply();
        return true;
      }
      this._body.classList.remove('swap');
      void this._body.offsetWidth;
      this._body.classList.add('swap');
      setTimeout(apply, 130);
      return true;
    }

    sleep() { return this._fallAsleep(true); }
    wake() { return this._wake(); }

    enter() {
      if (this._entered || this._hidden || this._destroyed) return;
      this._entered = true;
      this._shell.classList.add('entered');
      const reduced = this._prefersReducedMotion();
      const afterEntrance = () => {
        if (this._destroyed || !this._entered) return;
        const section = this._currentSection;
        if (section && !reduced) {
          const message = section.getAttribute('data-dancer-message');
          if (message) this._showBubble(message);
        }
        this._scheduleReadingReaction();
        this._armSleep();
        this._scheduleFidget();
        this._preloadRest();
      };
      if (reduced) {
        this._dancer.rest();
        afterEntrance();
        return;
      }
      const move = this._entranceMove();
      const wave = this._flag('entrance-wave', true) && this._dancer.isAvailable('wave');
      this._triggerMove(move, { loops: 1, source: 'entrance' }).then(() => {
        if (this._destroyed || !this._entered || !wave) return afterEntrance();
        return this._triggerMove('wave', { loops: 1, source: 'entrance' }).then(afterEntrance);
      });
    }

    _entranceMove() {
      const attr = this.getAttribute('entrance-move');
      if (attr && this._Dancer.hasMove(attr)) return attr;
      return this._dancer?.isAvailable('walk') ? 'walk' : 'shoppingCart';
    }

    play(move, options = {}) {
      return this._triggerMove(move, { loops: 1, source: 'api', ...options });
    }

    say(text, { duration = null } = {}) {
      this._showBubble(text, duration);
    }

    hush() {
      this._hideBubble();
    }

    toggleMenu() {
      this._menuOpen ? this.closeMenu() : this.openMenu();
    }

    openMenu() {
      if (this._menuOpen || this._hidden || this._destroyed) return;
      this._menuOpen = true;
      this._menu.hidden = false;
      this._setExpanded(true);
      this._menu.querySelector('button')?.focus({ preventScroll: true });
      this._docKey = event => {
        if (event.key === 'Escape') {
          event.preventDefault();
          this.closeMenu();
        }
      };
      this._docDown = event => {
        if (!event.composedPath().includes(this)) this.closeMenu({ returnFocus: false });
      };
      document.addEventListener('keydown', this._docKey);
      document.addEventListener('pointerdown', this._docDown, { capture: true });
      this.dispatchEvent(new CustomEvent('mascotmenuopen'));
    }

    closeMenu({ returnFocus = true } = {}) {
      if (!this._menuOpen) return;
      this._menuOpen = false;
      this._menu.hidden = true;
      this._setExpanded(false);
      this._removeMenuListeners();
      if (returnFocus) this._menuButton?.focus({ preventScroll: true });
      this.dispatchEvent(new CustomEvent('mascotmenuclose'));
    }

    dismiss({ persist = true } = {}) {
      if (this._hidden) return;
      this._hidden = true;
      this._entered = false;
      this._active = null;
      this._pending = null;
      this.closeMenu({ returnFocus: false });
      this._hideBubble();
      clearTimeout(this._scrollTimer);
      clearTimeout(this._idleRepeatTimer);
      clearTimeout(this._sleepTimer);
      clearTimeout(this._fidgetTimer);
      this._asleep = false;
      this._dancer.rest();
      this._shell.classList.remove('entered', 'ducked');
      this._shell.classList.add('dismissed');
      if (persist) this._storeDismissal();
      this.dispatchEvent(new CustomEvent('mascotdismiss'));
    }

    show() {
      this._clearDismissal();
      if (!this._hidden) return;
      this._hidden = false;
      this._shell.classList.remove('dismissed');
      void this._shell.offsetWidth; // let the transition start from offstage
      this.enter();
      this.dispatchEvent(new CustomEvent('mascotshow'));
    }

    refreshSections() {
      this._setupSections();
    }

    refreshMenu() {
      const grid = this._menu?.querySelector('.menu-grid');
      if (!grid) return;
      grid.innerHTML = this._menuButtonsHTML();
      const costumes = this._menu.querySelector('.costumes');
      if (costumes) {
        const label = costumes.querySelector('.costumes-label');
        costumes.innerHTML = '';
        if (label) costumes.appendChild(label);
        costumes.insertAdjacentHTML('beforeend', this._costumeButtonsHTML());
      }
      this._bindMenuButtons();
    }

    preload(names = null) {
      return this._dancer?.preload(names);
    }

    // Rendering
    _render() {
      const size = clampNumber(this.getAttribute('size'), 230, 120, 420);
      const mobileSize = clampNumber(this.getAttribute('mobile-size'), 170, 100, 300);
      const zIndex = clampNumber(this.getAttribute('z-index'), 2147482000, 1, 2147483647);
      const frameTime = clampNumber(this.getAttribute('frame-time'), 150, 70, 600);
      const restMove = this.getAttribute('rest-move') || '';
      const restFrame = this.getAttribute('rest-frame') || '';
      const assetFormat = this.getAttribute('asset-format') || 'auto';
      const idleBob = this._flag('idle-bob', true) ? 'true' : 'false';
      const idleLoop = this._flag('idle-loop', true) ? 'true' : 'false';
      const idleMove = this.getAttribute('idle-move');
      const dismissible = this._flag('dismissible', true);
      const costumeToggle = this._flag('costume-toggle', true) && this._Dancer.costumes.length > 1;
      const menuTitle = this.getAttribute('menu-title') || 'Make her dance';
      const label = this.getAttribute('label') || 'Carnival dancer mascot';

      this.shadowRoot.innerHTML = `
        <style>
          :host {
            --mascot-size:${size}px;
            --mascot-mobile-size:${mobileSize}px;
            --mascot-bottom:16px;
            --mascot-side:16px;
            --tilt:0deg;
            --lift:0px;
            --offstage:calc(110% + 48px);
            position:fixed;
            right:calc(var(--mascot-side) + env(safe-area-inset-right, 0px));
            bottom:calc(var(--mascot-bottom) + env(safe-area-inset-bottom, 0px));
            z-index:${zIndex};
            display:block;
            width:var(--mascot-size);
            height:var(--mascot-size);
            pointer-events:none;
            transition:bottom 240ms ease;
            font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
          }
          :host([position="bottom-left"]) {
            --offstage:calc(-110% - 48px);
            right:auto;
            left:calc(var(--mascot-side) + env(safe-area-inset-left, 0px));
          }
          :host([hidden]) { display:none; }
          *, *::before, *::after { box-sizing:border-box; }

          .shell {
            position:relative;
            width:100%;
            height:100%;
            transform:translateX(var(--offstage)) rotate(4deg);
            opacity:0;
            transition:transform 900ms cubic-bezier(.16,.8,.2,1), opacity 350ms ease, visibility 0s linear 0s;
            pointer-events:none;
          }
          :host([position="bottom-left"]) .shell { transform:translateX(var(--offstage)) rotate(-4deg); }
          .shell.entered { transform:translateX(0) rotate(0); opacity:1; }
          .shell.entered.ducked,
          .shell.dismissed {
            transform:translateX(var(--offstage)) rotate(0);
            opacity:0;
            transition:transform 380ms ease, opacity 300ms ease, visibility 0s linear 400ms;
          }
          .shell.dismissed { visibility:hidden; }

          .body {
            position:absolute;
            inset:0;
            transform:rotate(var(--tilt)) translateY(var(--lift));
            transform-origin:50% 92%;
            transition:transform 220ms ease-out;
          }
          .body.land { animation:mascot-land 560ms cubic-bezier(.34,1.4,.64,1); }
          .body.swap { animation:mascot-swap 280ms ease-in-out; }
          @keyframes mascot-swap {
            0% { transform:scaleX(1); }
            45% { transform:scaleX(.04) scaleY(1.04); }
            55% { transform:scaleX(-.04) scaleY(1.04); }
            100% { transform:scaleX(1); }
          }
          @keyframes mascot-land {
            0% { transform:scale(1.06,.9); }
            45% { transform:scale(.97,1.04); }
            100% { transform:scale(1,1); }
          }

          .character {
            position:absolute;
            inset:0;
            width:100%;
            height:100%;
            border:0;
            padding:0;
            background:transparent;
            cursor:pointer;
            pointer-events:auto;
            border-radius:50%;
            -webkit-tap-highlight-color:transparent;
          }
          .character:focus-visible { outline:3px solid #fff; outline-offset:-10px; }
          carnival-dancer { display:block; width:100%; height:100%; pointer-events:none; --dancer-width:100%; --dancer-width-mobile:100%; }

          .menu-toggle, .close {
            position:absolute;
            display:grid;
            place-items:center;
            border-radius:999px;
            border:1px solid rgba(255,255,255,.46);
            background:rgba(24,16,43,.94);
            color:#fff;
            line-height:1;
            cursor:pointer;
            pointer-events:auto;
            box-shadow:0 8px 30px rgba(0,0,0,.25);
            font-family:inherit;
          }
          .menu-toggle { right:0; bottom:2px; width:44px; height:44px; font-size:20px; }
          :host([position="bottom-left"]) .menu-toggle { right:auto; left:0; }
          .close {
            right:6px;
            top:6px;
            width:30px;
            height:30px;
            font-size:18px;
            opacity:0;
            transition:opacity 160ms ease;
          }
          :host([position="bottom-left"]) .close { right:auto; left:6px; }
          .shell:hover .close, .shell:focus-within .close, .close:focus-visible { opacity:1; }
          @media (hover:none) { .close { opacity:.85; } }
          .menu-toggle:focus-visible, .close:focus-visible, .menu button:focus-visible { outline:3px solid #fff; outline-offset:2px; }

          .menu {
            position:absolute;
            right:4px;
            bottom:52px;
            width:min(260px, calc(100vw - 24px));
            padding:10px;
            border-radius:16px;
            background:rgba(24,16,43,.96);
            border:1px solid rgba(255,255,255,.18);
            box-shadow:0 18px 50px rgba(0,0,0,.3);
            color:#fff;
            pointer-events:auto;
          }
          :host([position="bottom-left"]) .menu { right:auto; left:4px; }
          .menu[hidden] { display:none; }
          .menu-title { margin:0 0 8px; padding:0 4px; font-size:13px; font-weight:700; opacity:.8; }
          .menu-grid { display:grid; grid-template-columns:1fr 1fr; gap:7px; }
          .menu button {
            min-height:40px;
            border:1px solid rgba(255,255,255,.18);
            border-radius:11px;
            background:rgba(255,255,255,.08);
            color:#fff;
            font:inherit;
            font-size:12px;
            font-weight:700;
            padding:8px;
            cursor:pointer;
          }
          .menu button:hover { background:rgba(255,255,255,.15); }
          .costumes { display:flex; align-items:center; gap:6px; margin-top:10px; padding-top:10px; border-top:1px solid rgba(255,255,255,.14); }
          .costumes-label { flex:0 0 auto; font-size:12px; font-weight:700; opacity:.8; padding:0 4px; }
          .costumes button { flex:1 1 0; min-height:34px; padding:6px 8px; border-radius:9px; }
          .costumes button[aria-pressed="true"] { background:rgba(255,255,255,.28); border-color:rgba(255,255,255,.5); }

          .bubble {
            position:absolute;
            right:44%;
            bottom:76%;
            max-width:220px;
            min-width:110px;
            padding:9px 12px;
            border-radius:14px 14px 4px 14px;
            background:#fff;
            color:#191222;
            box-shadow:0 10px 30px rgba(0,0,0,.22);
            font-size:13px;
            font-weight:700;
            line-height:1.25;
            pointer-events:none;
            opacity:0;
            transform:translateY(6px) scale(.96);
            transition:opacity 160ms ease, transform 160ms ease;
          }
          :host([position="bottom-left"]) .bubble { right:auto; left:44%; border-radius:14px 14px 14px 4px; }
          .bubble.show { opacity:1; transform:translateY(0) scale(1); }

          @media (max-width:640px) {
            :host { width:var(--mascot-mobile-size); height:var(--mascot-mobile-size); --mascot-side:8px; }
            :host { --mascot-bottom:8px; }
            .menu { right:0; bottom:48px; width:min(240px, calc(100vw - 16px)); }
            :host([position="bottom-left"]) .menu { right:auto; left:0; }
            .bubble { right:42%; bottom:78%; max-width:180px; font-size:12px; }
            :host([position="bottom-left"]) .bubble { right:auto; left:42%; }
          }

          @media (prefers-reduced-motion:reduce) {
            :host { transition:none; }
            .shell { transition:none; transform:none; opacity:1; }
            .shell.entered.ducked, .shell.dismissed { transform:none; opacity:0; visibility:hidden; }
            .body { transition:none; transform:none; }
            .body.land { animation:none; }
            .body.swap { animation:none; }
            .bubble { transition:none; }
          }
        </style>
        <div class="shell">
          <div class="body">
            <button class="character" type="button" aria-label="${escAttr(label)}. Open dance menu." aria-haspopup="true" aria-expanded="false">
              <carnival-dancer
                controls="false"
                mode="manual"
                paused
                asset-base="${escAttr(this._assetBase())}"
                asset-format="${escAttr(assetFormat)}"
                frame-time="${frameTime}"
                ${restMove ? `rest-move="${escAttr(restMove)}"` : ''}
                ${restFrame !== '' ? `rest-frame="${escAttr(restFrame)}"` : ''}
                idle-bob="${idleBob}"
                idle-loop="${idleLoop}"
                ${idleMove ? `idle-move="${escAttr(idleMove)}"` : ''}
                costume="${escAttr(this._costume)}"></carnival-dancer>
            </button>
          </div>
          <div class="bubble" role="status"></div>
          ${dismissible ? '<button class="close" type="button" aria-label="Hide the mascot">&times;</button>' : ''}
          <button class="menu-toggle" type="button" aria-label="Open dance menu" aria-haspopup="true" aria-expanded="false">&#9835;</button>
          <div class="menu" hidden role="group" aria-label="Dance menu">
            <p class="menu-title">${escText(menuTitle)}</p>
            <div class="menu-grid">${this._menuButtonsHTML()}</div>
            ${costumeToggle ? `<div class="costumes" role="group" aria-label="Costume"><span class="costumes-label">Costume</span>${this._costumeButtonsHTML()}</div>` : ''}
          </div>
        </div>`;
    }

    _menuButtonsHTML() {
      return this._Dancer.menuMoves
        .filter(move => this._Dancer.isAvailable(move, this._costume))
        .map(move => `<button type="button" data-move="${escAttr(move)}">${escText(this._Dancer.moveLabel(move))}</button>`)
        .join('');
    }

    _costumeButtonsHTML() {
      return this._Dancer.costumes
        .map(c => `<button type="button" data-costume="${escAttr(c)}" aria-pressed="${c === this._costume ? 'true' : 'false'}">${escText(this._Dancer.costumeLabel(c))}</button>`)
        .join('');
    }

    _cacheNodes() {
      this._shell = this.shadowRoot.querySelector('.shell');
      this._body = this.shadowRoot.querySelector('.body');
      this._characterButton = this.shadowRoot.querySelector('.character');
      this._dancer = this.shadowRoot.querySelector('carnival-dancer');
      this._menuButton = this.shadowRoot.querySelector('.menu-toggle');
      this._closeButton = this.shadowRoot.querySelector('.close');
      this._menu = this.shadowRoot.querySelector('.menu');
      this._bubble = this.shadowRoot.querySelector('.bubble');
    }

    _bind() {
      this._characterButton.addEventListener('click', () => this.toggleMenu());
      this._menuButton.addEventListener('click', () => this.toggleMenu());
      this._closeButton?.addEventListener('click', () => {
        if (this.dispatchEvent(new CustomEvent('mascotdismissrequest', { cancelable: true, bubbles: true }))) {
          this.dismiss();
        }
      });
      this._bindMenuButtons();

      this._shell.addEventListener('transitionend', event => {
        if (event.target !== this._shell || event.propertyName !== 'transform') return;
        if (!this._entered || this._hidden || this._ducked || this._prefersReducedMotion()) return;
        this._body.classList.add('land');
      });
      this._body.addEventListener('animationend', () => this._body.classList.remove('land'));

      window.addEventListener('scroll', this._onScrollBound, { passive: true });
      window.addEventListener('resize', this._onResizeBound, { passive: true });
      document.addEventListener('visibilitychange', this._onVisibilityBound);
      document.addEventListener('pointerdown', this._onInteractionBound, { capture: true, passive: true });
      document.addEventListener('keydown', this._onInteractionBound, { capture: true, passive: true });
    }

    _bindMenuButtons() {
      this._menu.querySelectorAll('[data-move]').forEach(button => {
        button.addEventListener('click', () => {
          this.play(button.dataset.move, { source: 'menu' });
          this.closeMenu({ returnFocus: false });
          this._characterButton.focus({ preventScroll: true });
        });
      });
      this._menu.querySelectorAll('[data-costume]').forEach(button => {
        button.addEventListener('click', () => {
          this.setCostume(button.dataset.costume);
          this.closeMenu({ returnFocus: false });
          this._characterButton.focus({ preventScroll: true });
        });
      });
    }

    _setExpanded(open) {
      const value = open ? 'true' : 'false';
      this._menuButton.setAttribute('aria-expanded', value);
      this._menuButton.setAttribute('aria-label', open ? 'Close dance menu' : 'Open dance menu');
      this._characterButton.setAttribute('aria-expanded', value);
    }

    _removeMenuListeners() {
      if (this._docKey) document.removeEventListener('keydown', this._docKey);
      if (this._docDown) document.removeEventListener('pointerdown', this._docDown, { capture: true });
      this._docKey = null;
      this._docDown = null;
    }

    // Attribute helpers
    _flag(name, fallback) {
      const value = this.getAttribute(name);
      if (value === null) return fallback;
      return !['false', '0', 'off', 'no'].includes(value.trim().toLowerCase());
    }

    _assetBase() {
      const attr = this.getAttribute('asset-base');
      if (!attr) return null;
      try { return new URL(attr, document.baseURI).href; } catch { return attr; }
    }

    _prefersReducedMotion() {
      return Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
    }

    _sectionSelector() { return this.getAttribute('section-selector') || 'main section, section'; }
    _readingDelay() { return clampNumber(this.getAttribute('reading-delay'), 1600, 500, 15000); }
    _readingRepeat() { return clampNumber(this.getAttribute('reading-repeat'), 14000, 5000, 120000); }
    _settleDelay() { return clampNumber(this.getAttribute('section-settle'), 350, 0, 3000); }
    _minCoverage() { return clampNumber(this.getAttribute('min-coverage'), 0.25, 0.05, 1); }

    // Entrance and preloading
    _scheduleEntrance() {
      const delay = clampNumber(this.getAttribute('entrance-delay'), 500, 0, 10000);
      if (this._prefersReducedMotion()) {
        this.enter();
        return;
      }
      setTimeout(() => { if (!this._destroyed) this.enter(); }, delay);
    }

    _preloadStart() {
      const list = [this._entranceMove(), 'idle', 'wave'];
      const restMove = this.getAttribute('rest-move');
      if (restMove) list.push(restMove);
      this._dancer.preload(list.filter(m => this._dancer.isAvailable(m)));
      if ((this.getAttribute('preload') || 'entrance') === 'all') this._dancer.preload();
    }

    _preloadRest() {
      const idle = window.requestIdleCallback || (cb => setTimeout(cb, 1200));
      idle(() => { if (!this._destroyed && this._dancer) this._dancer.preload(); });
    }

    // Sections
    _setupSections() {
      this._sectionObserver?.disconnect();
      this._near = new Set();
      this._candidate = null;
      clearTimeout(this._settleTimer);
      let list;
      try { list = [...document.querySelectorAll(this._sectionSelector())]; }
      catch { list = []; }
      this._sections = list.filter(el => el !== this && !this.contains(el));
      if (!this._sections.length) return;

      if ('IntersectionObserver' in window) {
        this._sectionObserver = new IntersectionObserver(entries => {
          for (const entry of entries) {
            if (entry.isIntersecting) this._near.add(entry.target);
            else this._near.delete(entry.target);
          }
          this._requestFrame();
        }, { root: null, threshold: 0 });
        this._sections.forEach(section => this._sectionObserver.observe(section));
      } else {
        this._sections.forEach(section => this._near.add(section));
        this._requestFrame();
      }
    }

    _measureSections() {
      if (!this._near.size) return;
      const vh = window.innerHeight || document.documentElement.clientHeight || 0;
      if (!vh) return;
      // The reading band: the part of the screen a visitor is actually looking at.
      const bandTop = vh * 0.15;
      const bandBottom = vh * 0.72;
      const bandHeight = bandBottom - bandTop;

      let best = null;
      let bestCoverage = 0;
      let currentCoverage = 0;
      for (const section of this._near) {
        const rect = section.getBoundingClientRect();
        if (rect.height <= 0) continue;
        const overlap = Math.min(rect.bottom, bandBottom) - Math.max(rect.top, bandTop);
        if (overlap <= 0) continue;
        const coverage = overlap / bandHeight;
        if (section === this._currentSection) currentCoverage = coverage;
        if (coverage > bestCoverage) {
          best = section;
          bestCoverage = coverage;
        }
      }
      // Hysteresis: keep the current section unless a neighbour clearly wins.
      if (this._currentSection && best !== this._currentSection && currentCoverage >= bestCoverage - 0.08) {
        best = this._currentSection;
        bestCoverage = currentCoverage;
      }
      if (!best || bestCoverage < this._minCoverage()) return;

      if (best === this._currentSection) {
        this._candidate = null;
        clearTimeout(this._settleTimer);
        return;
      }
      if (best === this._candidate) return;

      this._candidate = best;
      clearTimeout(this._settleTimer);
      const commit = () => {
        if (this._destroyed || this._candidate !== best) return;
        this._candidate = null;
        this._currentSection = best;
        this._onSectionChange(best);
      };
      const settle = this._settleDelay();
      if (!this._currentSection || settle === 0) commit();
      else this._settleTimer = setTimeout(commit, settle);
    }

    _mappedMove(section) {
      const explicit = section?.getAttribute('data-dancer-move');
      if (this._Dancer.hasMove(explicit)) return explicit;
      const moves = this._Dancer.moves;
      const index = Math.max(0, this._sections.indexOf(section));
      return moves[index % moves.length];
    }

    _mappedIdleMove(section) {
      const explicit = section?.getAttribute('data-dancer-idle');
      if (this._Dancer.hasMove(explicit)) return explicit;
      const active = this._mappedMove(section || this._sections[0]);
      const choices = this._Dancer.moves.filter(move => move !== active);
      if (!choices.length) return active;
      const index = Math.max(0, this._sections.indexOf(section));
      return choices[(index + 1) % choices.length];
    }

    _onSectionChange(section) {
      const move = this._mappedMove(section);
      this.dispatchEvent(new CustomEvent('mascotsectionchange', { detail: { section, move } }));
      if (!this._entered || this._hidden || this._prefersReducedMotion()) return;
      if (this._asleep) this._wake();
      const message = section.getAttribute('data-dancer-message');
      if (message) this._showBubble(message);
      this._triggerMove(move, { loops: 1, source: 'section', section });
      this._scheduleReadingReaction();
    }

    // Scrolling
    _onScroll() {
      const now = performance.now();
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      const dt = Math.max(8, now - this._lastScrollAt);
      const dy = y - this._lastY;
      this._lastY = y;
      this._lastScrollAt = now;
      const instant = dy / dt; // px per ms
      this._velocity = this._velocity * 0.55 + instant * 0.45;

      if (this._asleep) this._wake();
      this._armSleep();
      this._requestFrame();

      clearTimeout(this._motionTimer);
      clearTimeout(this._scrollTimer);
      clearTimeout(this._idleRepeatTimer);
      this._motionTimer = setTimeout(() => this._settleMotion(), 160);
      this._scrollTimer = setTimeout(() => this._onReadingPause(), this._readingDelay());
    }

    _requestFrame() {
      if (this._framePending) return;
      this._framePending = true;
      requestAnimationFrame(() => {
        this._framePending = false;
        if (this._destroyed) return;
        this._syncSafeArea();
        this._measureSections();
        this._applyScrollMotion();
        this._checkPageEnd();
      });
    }

    _applyScrollMotion() {
      if (!this._entered || this._hidden || this._prefersReducedMotion()) return;
      const v = this._velocity;
      if (this._flag('scroll-tilt', true)) {
        const tilt = clamp(-v * 3, -6, 6);
        const lift = clamp(-Math.abs(v) * 1.6, -5, 0);
        this._body.style.setProperty('--tilt', `${tilt.toFixed(2)}deg`);
        this._body.style.setProperty('--lift', `${lift.toFixed(2)}px`);
      }
      if (this._flag('scroll-flip', true)) {
        if (v < -0.15) this._dancer.flip = true;
        else if (v > 0.15) this._dancer.flip = false;
      }
    }

    _settleMotion() {
      this._velocity = 0;
      this._body.style.setProperty('--tilt', '0deg');
      this._body.style.setProperty('--lift', '0px');
      clearTimeout(this._flipTimer);
      this._flipTimer = setTimeout(() => { if (this._dancer) this._dancer.flip = false; }, 600);
    }

    _onVisibility() {
      if (document.hidden) {
        clearTimeout(this._scrollTimer);
        clearTimeout(this._idleRepeatTimer);
        clearTimeout(this._sleepTimer);
        clearTimeout(this._fidgetTimer);
        return;
      }
      this._lastScrollAt = performance.now();
      this._scheduleReadingReaction();
      this._armSleep();
      this._scheduleFidget();
    }

    // Reading pause
    _scheduleReadingReaction() {
      clearTimeout(this._scrollTimer);
      clearTimeout(this._idleRepeatTimer);
      this._scrollTimer = setTimeout(() => this._onReadingPause(), this._readingDelay());
    }

    _onReadingPause() {
      if (!this._entered || this._hidden || this._ducked || this._destroyed || this._asleep) return;
      if (this._prefersReducedMotion() || this._menuOpen || document.hidden) return;
      const quietFor = performance.now() - this._lastScrollAt;
      if (quietFor < this._readingDelay() - 50 || this._active) {
        this._scheduleReadingReaction();
        return;
      }
      const section = this._currentSection; // may be null above the first section
      const idleMove = this._mappedIdleMove(section);
      const idleMessage = section?.getAttribute('data-dancer-idle-message');
      if (idleMessage) this._showBubble(idleMessage);
      this._triggerMove(idleMove, { loops: 1, source: 'reading', section });
      this.dispatchEvent(new CustomEvent('mascotreadingpause', { detail: { section, move: idleMove } }));
      clearTimeout(this._idleRepeatTimer);
      this._idleRepeatTimer = setTimeout(() => {
        if (performance.now() - this._lastScrollAt >= this._readingRepeat() - 100) this._onReadingPause();
      }, this._readingRepeat());
    }

    // Dance scheduling with priorities
    async _triggerMove(move, { loops = 1, source = 'api', section = null, priority = null, restWith = null, flip = null } = {}) {
      if (!this._dancer || !this._Dancer.hasMove(move) || this._hidden) return false;
      const explicit = priority === null || priority === undefined ? NaN : Number(priority);
      const prio = Number.isFinite(explicit) ? explicit : (PRIORITY[source] ?? PRIORITY.api);

      if (this._active && prio < this._active.priority) {
        if (source === 'reading') return false;
        this._pending = { move, loops, source, section, priority: prio };
        return false;
      }

      const token = { move, source, section, priority: prio, seq: ++this._sequence };
      this._active = token;
      this._pending = null;
      clearTimeout(this._fidgetTimer);
      if (flip !== null) this._dancer.flip = flip;
      this.dispatchEvent(new CustomEvent('mascotdance', { detail: { move, source, section } }));

      const finished = await this._dancer.playOnce(move, { loops });
      if (flip !== null && this._dancer.flip === flip) this._dancer.flip = false;
      if (this._active !== token || this._destroyed) return finished;
      this._active = null;

      const next = this._pending;
      this._pending = null;
      if (next && !this._hidden) {
        this._triggerMove(next.move, next);
        return finished;
      }
      if (restWith && this._dancer.isAvailable(restWith)) this._dancer.idle(restWith);
      else this._dancer.rest();
      this._scheduleFidget();
      return finished;
    }

    // Idle behaviours: look around, fall asleep, wake up
    _idleAllowed() {
      return this._entered && !this._hidden && !this._ducked && !this._destroyed && !this._menuOpen
        && !this._active && !document.hidden && !this._prefersReducedMotion();
    }

    _fidgetInterval() { return clampNumber(this.getAttribute('fidget-interval'), 25000, 5000, 300000); }
    _sleepAfter() { return clampNumber(this.getAttribute('sleep-after'), 45000, 0, 3600000); }

    _scheduleFidget() {
      clearTimeout(this._fidgetTimer);
      if (!this._flag('fidget', true) || this._asleep) return;
      const wait = this._fidgetInterval() * (0.7 + Math.random() * 0.6);
      this._fidgetTimer = setTimeout(() => this._fidget(), wait);
    }

    _fidget() {
      if (!this._idleAllowed() || this._asleep || !this._dancer.isAvailable('lookAround')) {
        this._scheduleFidget();
        return;
      }
      this._triggerMove('lookAround', { loops: 1, source: 'reading' });
    }

    _armSleep() {
      clearTimeout(this._sleepTimer);
      const after = this._sleepAfter();
      if (!after || this._asleep) return;
      this._sleepTimer = setTimeout(() => this._fallAsleep(), after);
    }

    async _fallAsleep(force = false) {
      if (this._asleep) return false;
      if (!force && !this._idleAllowed()) { this._armSleep(); return false; }
      if (!this._dancer.isAvailable('snooze')) return false;
      clearTimeout(this._fidgetTimer);
      clearTimeout(this._scrollTimer);
      clearTimeout(this._idleRepeatTimer);
      this._asleep = true;
      this.dispatchEvent(new CustomEvent('mascotsleep'));
      if (this._dancer.isAvailable('yawn')) {
        const played = await this._triggerMove('yawn', { loops: 1, source: force ? 'api' : 'reading', restWith: 'snooze' });
        if (!played && this._asleep) this._dancer.idle('snooze');
      } else {
        this._dancer.idle('snooze');
      }
      return true;
    }

    _wake() {
      if (!this._asleep) return false;
      this._asleep = false;
      this.dispatchEvent(new CustomEvent('mascotwake'));
      if (this._hidden || this._prefersReducedMotion()) { this._dancer.rest(); return true; }
      if (this._dancer.isAvailable('jump')) this._triggerMove('jump', { loops: 1, source: 'api' });
      else this._dancer.rest();
      this._armSleep();
      return true;
    }

    _onInteraction() {
      if (this._asleep) this._wake();
      this._armSleep();
    }

    // Pointing at hovered or focused targets
    _setupPointing() {
      if (!this.getAttribute('point-selector')) return;
      document.addEventListener('pointerover', this._onPointerOverBound, true);
      document.addEventListener('focusin', this._onPointerOverBound, true);
    }

    _onPointTarget(event) {
      const selector = this.getAttribute('point-selector');
      if (!selector || !this._idleAllowed() || this._asleep) return;
      let target = null;
      try { target = event.target?.closest?.(selector); } catch { return; }
      if (!target || performance.now() < this._pointUntil) return;
      if (!this._dancer.isAvailable('point')) return;
      this._pointUntil = performance.now() + clampNumber(this.getAttribute('point-cooldown'), 4000, 500, 60000);
      const rect = target.getBoundingClientRect();
      const mine = this.getBoundingClientRect();
      const targetX = rect.left + rect.width / 2;
      const mineX = mine.left + mine.width / 2;
      // the art points to the viewer's left; flip when the target is on her right
      const flip = targetX > mineX;
      this._triggerMove('point', { loops: 1, source: 'section', flip });
    }

    // Bow when the visitor reaches the end of the page
    _checkPageEnd() {
      if (this._bowed || !this._entered || this._hidden || this._asleep) return;
      const move = this.getAttribute('footer-move') === null ? 'bow' : this.getAttribute('footer-move');
      if (!move || move === 'none' || !this._dancer.isAvailable(move)) return;
      const doc = document.documentElement;
      const bottom = (window.scrollY || doc.scrollTop) + window.innerHeight;
      if (bottom < doc.scrollHeight - 40) return;
      this._bowed = true;
      if (this._prefersReducedMotion()) return;
      this._triggerMove(move, { loops: 1, source: 'section' });
    }

    // Speech bubble
    _showBubble(text, duration = null) {
      if (!text || this._hidden) return;
      const value = String(text);
      this._bubble.textContent = value;
      this._bubble.classList.add('show');
      clearTimeout(this._bubbleTimer);
      const ms = duration ? clampNumber(duration, 2600, 800, 20000) : clamp(2200 + value.length * 45, 2200, 8000);
      this._bubbleTimer = setTimeout(() => this._bubble.classList.remove('show'), ms);
    }

    _hideBubble() {
      clearTimeout(this._bubbleTimer);
      this._bubble.classList.remove('show');
    }

    // Footer avoidance
    _syncSafeArea() {
      const avoid = this.getAttribute('avoid-selector');
      if (!avoid) return;
      let el;
      try { el = document.querySelector(avoid); } catch { return; }
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const overlap = vh - rect.top;
      const bottom = overlap > 0 ? Math.round(clamp(overlap + 8, 16, vh * 0.45)) : 16;
      if (bottom === this._lastBottom) return;
      this._lastBottom = bottom;
      this.style.setProperty('--mascot-bottom', `${bottom}px`);
    }

    // Modal ducking
    _setupDucking() {
      if (!this._flag('duck-modals', true) && !this.getAttribute('duck-selector')) return;
      if (!('MutationObserver' in window)) return;
      this._duckObserver = new MutationObserver(() => this._requestDuckCheck());
      this._duckObserver.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['open', 'aria-modal', 'class', 'style', 'hidden', 'aria-hidden']
      });
      this._requestDuckCheck();
    }

    _duckSelectors() {
      const parts = [];
      if (this._flag('duck-modals', true)) parts.push('dialog[open]', '[aria-modal="true"]');
      const extra = this.getAttribute('duck-selector');
      if (extra) parts.push(extra);
      return parts.join(',');
    }

    _requestDuckCheck() {
      if (this._duckPending) return;
      this._duckPending = true;
      requestAnimationFrame(() => {
        this._duckPending = false;
        this._checkDuck();
      });
    }

    _checkDuck() {
      if (this._destroyed) return;
      const selector = this._duckSelectors();
      if (!selector) return;
      let nodes;
      try { nodes = document.querySelectorAll(selector); } catch { return; }
      let blocking = false;
      for (const el of nodes) {
        if (el === this || this.contains(el)) continue;
        if (this._isVisible(el)) { blocking = true; break; }
      }
      if (blocking === this._ducked) return;
      this._ducked = blocking;
      this._shell.classList.toggle('ducked', blocking);
      if (blocking) {
        this.closeMenu({ returnFocus: false });
        this._hideBubble();
        clearTimeout(this._sleepTimer);
        clearTimeout(this._fidgetTimer);
      } else {
        this._scheduleReadingReaction();
        this._armSleep();
        this._scheduleFidget();
      }
      this.dispatchEvent(new CustomEvent(blocking ? 'mascotduck' : 'mascotreturn'));
    }

    _isVisible(el) {
      if (el.hidden || el.getAttribute('aria-hidden') === 'true') return false;
      const style = getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return false;
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    }

    // Costume storage
    _costumeKey() {
      const custom = this.getAttribute('storage-key');
      return custom ? `${custom}:costume` : COSTUME_STORAGE_KEY;
    }

    _initialCostume() {
      const list = this._Dancer.costumes;
      let choice = this.getAttribute('costume');
      if (this._flag('remember-costume', true)) {
        try {
          const stored = window.localStorage?.getItem(this._costumeKey());
          if (stored && list.includes(stored)) choice = stored;
        } catch {}
      }
      return list.includes(choice) ? choice : (list[0] || 'purple');
    }

    _storeCostume(name) {
      try { window.localStorage?.setItem(this._costumeKey(), name); } catch {}
    }

    // Dismissal storage
    _storageKey() { return this.getAttribute('storage-key') || DEFAULT_STORAGE_KEY; }
    _dismissDays() { return clampNumber(this.getAttribute('dismiss-days'), 7, 0, 3650); }

    _storage() {
      try { return this._dismissDays() === 0 ? window.sessionStorage : window.localStorage; }
      catch { return null; }
    }

    _isDismissed() {
      const store = this._storage();
      if (!store) return false;
      try {
        const raw = store.getItem(this._storageKey());
        if (!raw) return false;
        const data = JSON.parse(raw);
        if (data && (!data.until || data.until > Date.now())) return true;
        store.removeItem(this._storageKey());
      } catch {}
      return false;
    }

    _storeDismissal() {
      const store = this._storage();
      if (!store) return;
      const days = this._dismissDays();
      const until = days === 0 ? null : Date.now() + days * 86400000;
      try { store.setItem(this._storageKey(), JSON.stringify({ until })); } catch {}
    }

    _clearDismissal() {
      try { window.localStorage?.removeItem(this._storageKey()); } catch {}
      try { window.sessionStorage?.removeItem(this._storageKey()); } catch {}
    }
  }

  if (!customElements.get('carnival-mascot')) customElements.define('carnival-mascot', CarnivalMascot);
  window.CarnivalMascot = CarnivalMascot;
})();
