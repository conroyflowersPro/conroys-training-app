/* dock-fix.js v5.0.4 — greeting + chat dock hard recovery */
(function () {
  function lang() {
    try {
      var s = localStorage.getItem('cf_lang');
      if (s && ['en','ko','ja','es'].indexOf(s) >= 0) return s;
    } catch (e) {}
    try {
      var n = (navigator.language || 'en').toLowerCase();
      if (n.indexOf('ko') === 0) return 'ko';
      if (n.indexOf('ja') === 0) return 'ja';
      if (n.indexOf('es') === 0) return 'es';
    } catch (e) {}
    return (typeof currentLang !== 'undefined' && currentLang) ? currentLang : 'en';
  }

  function ensureDockVisible() {
    var dock = document.getElementById('grok-dock');
    if (dock) dock.classList.remove('hidden');
  }

  function ensureGreeting() {
    try {
      ensureDockVisible();
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
    if (startApp._dockFixed) return;
    var orig = startApp;
    function wrapped() {
      try {
        var L = lang();
        currentLang = L;
        localStorage.setItem('cf_lang', L);
      } catch (e) {}
      var result = orig.apply(this, arguments);
      try {
        var L2 = lang();
        if (currentLang === 'en' && L2 !== 'en') {
          currentLang = L2;
          localStorage.setItem('cf_lang', L2);
          var sel = document.getElementById('lang-select');
          if (sel) sel.value = L2;
          if (typeof applyI18n === 'function') applyI18n();
        }
      } catch (e) {}
      setTimeout(ensureGreeting, 50);
      setTimeout(ensureGreeting, 400);
      return result;
    }
    wrapped._dockFixed = true;
    startApp = wrapped;
    window.startApp = wrapped;
  }

  function patchSubmit() {
    if (typeof submitFloatChat !== 'function') return;
    if (submitFloatChat._dockFixed) return;
    var orig = submitFloatChat;
    function wrapped() {
      return orig.apply(this, arguments);
    }
    wrapped._dockFixed = true;
    submitFloatChat = wrapped;
    window.submitFloatChat = wrapped;
  }

  function boot() {
    patchStartApp();
    patchSubmit();
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
