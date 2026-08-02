/* dock-fix.js v5.0.5 — greeting + dock recovery (first login EN, auto-detect after) */
(function () {
  function lang() {
    try {
      var s = localStorage.getItem('cf_lang');
      if (s && ['en', 'ko', 'ja', 'es'].indexOf(s) >= 0) return s;
    } catch (e) {}
    return 'en';
  }

  function hideLangSelect() {
    try {
      var sel = document.getElementById('lang-select');
      if (sel) sel.style.display = 'none';
    } catch (e) {}
  }

  function ensureDockVisible() {
    var dock = document.getElementById('grok-dock');
    if (dock) dock.classList.remove('hidden');
  }

  function ensureGreeting() {
    try {
      ensureDockVisible();
      hideLangSelect();
      var box = document.getElementById('grok-messages');
      if (!box) return;
      if (box.querySelector('.grok-msg')) return;
      var name = (typeof currentUser !== 'undefined' && currentUser) ? currentUser : '';
      if (!name) return;
      var L = lang();
      try { if (typeof currentLang !== 'undefined') currentLang = L; } catch (e) {}
      if (typeof showWelcomeInDock === 'function') {
        try { showWelcomeInDock(); return; } catch (e) { console.warn(e); }
      }
      var hello = {
        ko: name + '님 안녕하세요. 출근하셨으면 도와드리겠습니다.',
        en: 'Hello ' + name + ". If you're in for your shift, I'm here to help.",
        ja: name + 'さん、こんにちは。出勤されたらお手伝いします。',
        es: 'Hola ' + name + '. Si ya entró a su turno, estoy aquí para ayudar.'
      }[L] || ('Hello ' + name);
      if (typeof appendGrokMessage === 'function') appendGrokMessage(hello, 'bot');
      else {
        var div = document.createElement('div');
        div.className = 'grok-msg bot';
        div.style.whiteSpace = 'pre-wrap';
        div.textContent = hello;
        box.appendChild(div);
      }
    } catch (e) { console.warn('ensureGreeting', e); }
  }

  function patchStartApp() {
    if (typeof startApp !== 'function') return;
    if (startApp._dockFixed505) return;
    var orig = startApp;
    function wrapped() {
      hideLangSelect();
      var result = orig.apply(this, arguments);
      setTimeout(ensureGreeting, 50);
      setTimeout(ensureGreeting, 400);
      return result;
    }
    wrapped._dockFixed505 = true;
    startApp = wrapped;
    window.startApp = wrapped;
  }

  function boot() {
    hideLangSelect();
    patchStartApp();
    try {
      var app = document.getElementById('app');
      if (app && !app.classList.contains('hidden')) {
        ensureDockVisible();
        setTimeout(ensureGreeting, 200);
      }
    } catch (e) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 0); });
  } else {
    setTimeout(boot, 0);
  }
  setTimeout(boot, 300);
  setTimeout(boot, 1000);
})();
