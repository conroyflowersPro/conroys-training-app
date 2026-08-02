/* dock-fix.js v5.0.5 — language policy + chat/greeting hard recovery */
(function () {
  function getSavedLang() {
    try {
      var s = localStorage.getItem('cf_lang');
      if (s && ['en', 'ko', 'ja', 'es'].indexOf(s) >= 0) return s;
    } catch (e) {}
    return 'en';
  }

  function bumpVersionLabel() {
    try {
      var nodes = document.querySelectorAll('p, span, div');
      for (var i = 0; i < nodes.length; i++) {
        var t = nodes[i].textContent || '';
        if (t === 'v5.0.4' || t.trim() === 'v5.0.4') nodes[i].textContent = 'v5.0.5';
        else if (t.indexOf('v5.0.4') >= 0 && t.length < 40) nodes[i].textContent = t.replace('v5.0.4', 'v5.0.5');
      }
    } catch (e) {}
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

  function safeAppend(text, type) {
    try {
      if (typeof appendGrokMessage === 'function') appendGrokMessage(text, type || 'bot');
      else {
        var box = document.getElementById('grok-messages');
        if (!box) return;
        var div = document.createElement('div');
        div.className = 'grok-msg ' + (type || 'bot');
        div.style.whiteSpace = 'pre-wrap';
        div.textContent = text;
        box.appendChild(div);
      }
    } catch (e) { console.warn('safeAppend', e); }
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
      var L = getSavedLang();
      try { currentLang = L; } catch (e) {}
      if (typeof showWelcomeInDock === 'function') {
        try { showWelcomeInDock(); return; } catch (e) { console.warn(e); }
      }
      var hello = {
        ko: name + '님 안녕하세요. 출근하셨으면 도와드리겠습니다.',
        en: 'Hello ' + name + ". If you're in for your shift, I'm here to help.",
        ja: name + 'さん、こんにちは。出勤されたらお手伝いします。',
        es: 'Hola ' + name + '. Si ya entró a su turno, estoy aquí para ayudar.'
      }[L] || ('Hello ' + name);
      safeAppend(hello, 'bot');
    } catch (e) { console.warn('ensureGreeting', e); }
  }

  function patchStartApp() {
    if (typeof window.startApp !== 'function' && typeof startApp !== 'function') return;
    var orig = window.startApp || startApp;
    if (orig._cf505) return;
    function wrapped() {
      hideLangSelect();
      var saved = 'en';
      try {
        saved = getSavedLang();
        currentLang = saved;
        localStorage.setItem('cf_lang', saved);
      } catch (e) {}
      var result;
      try { result = orig.apply(this, arguments); } catch (e) { console.warn('startApp', e); }
      try {
        currentLang = saved;
        localStorage.setItem('cf_lang', saved);
        hideLangSelect();
        if (typeof applyI18n === 'function') applyI18n();
        if (typeof renderStamps === 'function') renderStamps();
      } catch (e) {}
      try { ensureDockVisible(); } catch (e) {}
      bumpVersionLabel();
      setTimeout(ensureGreeting, 50);
      setTimeout(ensureGreeting, 400);
      return result;
    }
    wrapped._cf505 = true;
    startApp = wrapped;
    window.startApp = wrapped;
  }

  function patchSubmit() {
    async function safeSubmit() {
      var input = document.getElementById('float-chat-input');
      if (!input) return;
      var q = (input.value || '').trim();
      if (!q) return;
      input.value = '';
      var spokenLang = (typeof detectLang === 'function') ? detectLang(q) : 'en';
      var newLang = spokenLang === 'es-ES' ? 'es' : (spokenLang || 'en');
      try {
        if (typeof setAppLanguage === 'function') setAppLanguage(newLang);
        else {
          currentLang = newLang;
          localStorage.setItem('cf_lang', newLang);
          if (typeof applyI18n === 'function') applyI18n();
        }
      } catch (e) {}
      hideLangSelect();
      safeAppend(q, 'user');
      try {
        if (typeof setFloatStatus === 'function') setFloatStatus('Q: ' + q);
      } catch (e) {}
      var ansEl = document.getElementById('float-answer');
      if (ansEl) ansEl.textContent = 'Loading answer...';
      var speakBtn = document.getElementById('float-speak-btn');
      if (speakBtn) speakBtn.style.display = 'none';
      var tasksBtn = document.getElementById('float-tasks-btn');
      if (tasksBtn) tasksBtn.style.display = 'none';
      try {
        if (typeof removeCoachBox === 'function') removeCoachBox();
      } catch (e) {}
      var answer = null;
      try {
        if (typeof askGrok === 'function') answer = await askGrok(q);
      } catch (e) {
        console.warn('askGrok', e);
        answer = null;
      }
      if (answer) {
        try {
          if (typeof showAnswerInPanel === 'function') showAnswerInPanel(q, answer);
        } catch (e) {}
        safeAppend(answer, 'bot');
        if (typeof speakText === 'function') {
          setTimeout(function () {
            try { speakText(answer, null); } catch (e) { console.warn('auto-speak', e); }
          }, 300);
        }
      } else {
        var fail = (currentLang === 'ko')
          ? '답변을 받지 못했습니다. 다시 시도해 주세요.'
          : 'No answer received. Please try again.';
        if (ansEl) ansEl.textContent = fail;
        try { if (typeof setFloatStatus === 'function') setFloatStatus(fail); } catch (e) {}
        safeAppend(fail, 'bot');
      }
    }
    submitFloatChat = safeSubmit;
    window.submitFloatChat = safeSubmit;
  }

  function patchLangVisibility() {
    if (typeof updateLangSelectVisibility === 'function') {
      updateLangSelectVisibility = function () { hideLangSelect(); };
      window.updateLangSelectVisibility = updateLangSelectVisibility;
    }
  }

  function boot() {
    hideLangSelect();
    bumpVersionLabel();
    patchLangVisibility();
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
