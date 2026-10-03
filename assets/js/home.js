/* Homepage interactions: theme toggle, reading progress, section highlighting,
   news expander, publication filters, author lists, and copy-email. */
(function () {
  'use strict';
  var root = document.documentElement;

  function store(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (e) { return null; }
  }

  /* ---- theme ---- */
  var toggle = document.getElementById('theme-toggle');
  function currentTheme() {
    var t = root.getAttribute('data-theme');
    if (t) return t;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      store('xj-theme', next);
    });
  }

  /* ---- reading progress ---- */
  var bar = document.getElementById('progress-bar');
  var ticking = false;
  function updateProgress() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var pct = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
    if (bar) bar.style.width = pct + '%';
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(updateProgress); ticking = true; }
  }, { passive: true });
  updateProgress();

  /* ---- section highlighting in the nav ---- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.navlinks a'));
  var targets = navLinks.map(function (a) {
    var id = a.getAttribute('href').slice(1);
    return { link: a, el: document.getElementById(id) };
  }).filter(function (t) { return t.el; });
  function setActive() {
    var y = window.scrollY + window.innerHeight * 0.3;
    var active = targets[0];
    targets.forEach(function (t) { if (t.el.offsetTop <= y) active = t; });
    navLinks.forEach(function (a) { a.removeAttribute('aria-current'); });
    if (active) active.link.setAttribute('aria-current', 'true');
  }
  window.addEventListener('scroll', setActive, { passive: true });
  setActive();

  /* ---- news expander ---- */
  var newsList = document.getElementById('news-list');
  var newsToggle = document.getElementById('news-toggle');
  if (newsList && newsToggle) {
    newsList.classList.add('is-collapsed');
    newsToggle.addEventListener('click', function () {
      var collapsed = newsList.classList.toggle('is-collapsed');
      newsToggle.setAttribute('aria-expanded', String(!collapsed));
      newsToggle.textContent = collapsed ? newsToggle.dataset.more : newsToggle.dataset.less;
      if (collapsed) document.getElementById('news').scrollIntoView({ block: 'start' });
    });
  }

  /* ---- publication filters ---- */
  var pubs = Array.prototype.slice.call(document.querySelectorAll('.pub'));
  var modeBtns = Array.prototype.slice.call(document.querySelectorAll('.seg__btn'));
  var topicBtns = Array.prototype.slice.call(document.querySelectorAll('.topic'));
  var countEl = document.getElementById('pub-count');
  var emptyEl = document.getElementById('pub-empty');
  var state = { mode: store('xj-pub-mode') === 'all' ? 'all' : 'selected', topic: 'all' };

  function applyFilters() {
    var shown = 0;
    pubs.forEach(function (li) {
      var okMode = state.mode === 'all' || li.dataset.selected === '1';
      var okTopic = state.topic === 'all' || (' ' + li.dataset.topics + ' ').indexOf(' ' + state.topic + ' ') !== -1;
      var visible = okMode && okTopic;
      li.classList.toggle('is-hidden', !visible);
      if (visible) shown++;
    });
    modeBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.mode === state.mode)); });
    topicBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.topic === state.topic)); });
    if (countEl) countEl.textContent = shown + ' of ' + pubs.length + ' papers';
    if (emptyEl) emptyEl.hidden = shown !== 0;
  }
  modeBtns.forEach(function (b) {
    b.addEventListener('click', function () { state.mode = b.dataset.mode; store('xj-pub-mode', state.mode); applyFilters(); });
  });
  topicBtns.forEach(function (b) {
    b.addEventListener('click', function () { state.topic = b.dataset.topic; applyFilters(); });
  });
  if (pubs.length) applyFilters();

  /* ---- "+N more" authors ---- */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('.more-toggle');
    if (!btn) return;
    var more = btn.previousElementSibling;
    if (!more) return;
    more.hidden = false;
    btn.remove();
  });

  /* ---- copy email ---- */
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var done = btn.querySelector('.copy__done');
      function flash(msg) {
        if (!done) return;
        done.textContent = msg;
        setTimeout(function () { done.textContent = ''; }, 1600);
      }
      function fallback() {
        var span = btn.parentNode.querySelector('.email-text');
        if (span && window.getSelection) {
          var range = document.createRange();
          range.selectNodeContents(span);
          var sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
          flash('Selected');
        }
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { flash('Copied'); }, fallback);
      } else {
        fallback();
      }
    });
  });
})();
