/* Load order: tts-fix, mic-fix, guide-speak before dock boot */
(function () {
  var s = document.createElement('script');
  s.src = 'js/tts-fix.js?v=5.3.5';
  s.async = false;
  document.head.appendChild(s);
})();
(function () {
  var s = document.createElement('script');
  s.src = 'js/mic-fix.js?v=5.3.5';
  s.async = false;
  document.head.appendChild(s);
})();
(function () {
  var s = document.createElement('script');
  s.src = 'js/guide-speak.js?v=5.3.5';
  s.async = false;
  document.head.appendChild(s);
})();
/* dock-fix.js v5.3.5 — coaching boot + loaders + safeSubmit loading/coach-box */
(function () {
  function getSavedLang() {
    try {
      return localStorage.getItem('cf_lang') || (typeof currentLang !== 'undefined' ? currentLang : 'en');
    } catch (e) {
      return 'en';
    }
  }
  function hideLangSelect() {
    try {
      var sel = document.getElementById('lang-select');
      if (sel) sel.style.display = 'none';
    } catch (e) {}
  }
  function bumpVersionLabel() {
    try {
      var nodes = document.querySelectorAll('p, span, div');
      for (var i = 0; i < nodes.length; i++) {
        var t = nodes[i].textContent || '';
        if (/^v5\.\d+\.\d+$/.test(t.trim())) nodes[i].textContent = 'v5.3.5';
        else if (/v5\.\d+\.\d+/.test(t) && t.length < 48) nodes[i].textContent = t.replace(/v5\.\d+\.\d+/g, 'v5.3.5');
      }
    } catch (e) {}
  }
  window.unlockAudio = function unlockAudio() {
    try {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      if (!window._cfAudioCtx) window._cfAudioCtx = new Ctx();
      var p = window._cfAudioCtx.resume && window._cfAudioCtx.resume();
      if (p && p.catch) p.catch(function () {});
    } catch (e) {}
  };
  function bindAudioUnlock() {
    var once = function () { window.unlockAudio(); };
    document.addEventListener('click', once, { once: true, capture: true });
    document.addEventListener('touchstart', once, { once: true, capture: true });
  }
  function ensureDockVisible() {
    try {
      var dock = document.getElementById('grok-dock');
      if (dock) dock.classList.remove('hidden');
    } catch (e) {}
  }
  function safeAppend(text, type) {
    try {
      if (typeof appendGrokMessage === 'function') appendGrokMessage(text, type || 'bot');
      else {
        var box = document.getElementById('grok-messages');
        if (!box) return;
        var div = document.createElement('div');
        div.className = 'grok-msg ' + (type === 'user' ? 'user' : 'bot');
        div.textContent = text;
        box.appendChild(div);
        box.scrollTop = box.scrollHeight;
      }
    } catch (e) {}
  }
  function installCoachWelcome() {
    window.buildDailyRoutineSpeech = function () {
      try {
        if (typeof getNextIncompleteTask === 'function') {
          var t = getNextIncompleteTask();
          if (t && t.title) return t.title;
        }
      } catch (e) {}
      return '';
    };
    window.showWelcomeInDock = function () {
      try {
        var L = getSavedLang();
        var next = '';
        try { next = window.buildDailyRoutineSpeech() || ''; } catch (e) {}
        var msg = '';
        if (L === 'ko') msg = next ? ('안녕하세요. 다음 할 일은 ' + next + '입니다.') : '안녕하세요.';
        else if (L === 'ja') msg = next ? ('こんにちは。次のタスクは「' + next + '」です。') : 'こんにちは。';
        else if (L === 'es') msg = next ? ('Hola. La siguiente tarea es: ' + next) : 'Hola.';
        else msg = next ? ('Hello. Next task: ' + next) : 'Hello.';
        ensureDockVisible();
        safeAppend(msg, 'bot');
        setTimeout(function () { try { speakText(msg, null); } catch (e) {} }, 500);
      } catch (e) {}
    };
    setTimeout(function () {
      try {
        if (typeof window._cfWelcomed === 'undefined') {
          /* greeting handled by startApp patch */
        }
      } catch (e) {}
    }, 300);
  }
  function installCoachBoxSpeak() {
    function renderBox(section) {
      try {
        if (typeof showCoachBox === 'function') showCoachBox(section);
      } catch (e) {}
    }
    var _origShow = window.showCoachBox;
    if (typeof _origShow === 'function' && !_origShow._cfDock) {
      window.showCoachBox = function (section) {
        var r = _origShow.apply(this, arguments);
        try {
          var speakBtn = document.getElementById('float-coach-speak-btn');
          var detailBtn = document.getElementById('float-coach-detail-btn');
          if (speakBtn) speakBtn.onclick = function () {
            try {
              var sum = document.querySelector('.coach-box-summary');
              if (sum) speakText(sum.textContent, speakBtn);
            } catch (e) {}
          };
          if (detailBtn) detailBtn.onclick = function () {
            try {
              if (typeof goToRelatedSection === 'function') goToRelatedSection(window._lastRelatedSection || section);
            } catch (e) {}
          };
        } catch (e) {}
        return r;
      };
      window.showCoachBox._cfDock = true;
    }
  }
  function ensureGreeting() {
    try {
      if (sessionStorage.getItem('cf_greeted') === '1') return;
      sessionStorage.setItem('cf_greeted', '1');
      if (typeof showWelcomeInDock === 'function') showWelcomeInDock();
    } catch (e) {
      try { if (typeof showWelcomeInDock === 'function') showWelcomeInDock(); } catch (e2) {}
    }
  }
  function patchStartApp() {
    if (typeof window.startApp !== 'function' || window.startApp._cfDock) return;
    var orig = window.startApp;
    function wrapped() {
      var r = orig.apply(this, arguments);
      try {
        hideLangSelect();
        bumpVersionLabel();
        ensureDockVisible();
        ensureGreeting();
      } catch (e) {}
      return r;
    }
    wrapped._cfDock = true;
    window.startApp = wrapped;
    try { startApp = wrapped; } catch (e) {}
  }
  function patchSubmit() {
    async function safeSubmit() {
      var input = document.getElementById('float-chat-input');
      var q = input ? String(input.value || '').trim() : '';
      if (!q) return;
      if (input) input.value = '';
      try { safeAppend(q, 'user'); } catch (e) {}
      try {
        if (typeof playLoadingSound === 'function') playLoadingSound();
        else if (typeof playLoadingSoundOnce === 'function') playLoadingSoundOnce();
      } catch (e) {}
      try {
        if (typeof showLoadingStatus === 'function') showLoadingStatus();
      } catch (e) {}
      var answer = '';
      try {
        if (typeof askGrok === 'function') answer = await askGrok(q);
        else answer = 'askGrok missing';
      } catch (e) {
        answer = '네트워크/Functions 오류: ' + (e && e.message ? e.message : e);
      } finally {
        try { if (typeof stopLoadingSound === 'function') stopLoadingSound(); } catch (e) {}
        try {
          var loadEl = document.getElementById('cf-loading-msg');
          if (loadEl && loadEl.parentNode) loadEl.parentNode.removeChild(loadEl);
        } catch (e) {}
      }
      try {
        var bad = !answer || /서버 오류|API 오류|네트워크\/Functions|504|Inactivity Timeout|<!DOCTYPE|is not valid JSON/i.test(String(answer));
        if (bad) {
          var fail = '잠시 후 다시 시도해 주세요. (서버 응답 오류)';
          safeAppend(fail, 'bot');
          return;
        }
        if (typeof showAnswerInPanel === 'function') showAnswerInPanel(q, answer);
        else safeAppend(answer, 'bot');
        setTimeout(function () {
          try {
            if (typeof detectRelatedSection === 'function') {
              var sec = detectRelatedSection(q, answer);
              if (sec && typeof showCoachBox === 'function') showCoachBox(sec);
            }
          } catch (e) {}
        }, 50);
      } catch (e) {
        safeAppend(String(answer || e), 'bot');
      }
    }
    submitFloatChat = safeSubmit;
    window.submitFloatChat = safeSubmit;
  }
  function patchLangVisibility() {
    try {
      updateLangSelectVisibility = function () { hideLangSelect(); };
    } catch (e) {}
  }
  function boot() {
    bindAudioUnlock();
    bumpVersionLabel();
    hideLangSelect();
    ensureDockVisible();
    installCoachWelcome();
    installCoachBoxSpeak();
    patchStartApp();
    patchSubmit();
    patchLangVisibility();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 0); });
  } else {
    setTimeout(boot, 0);
  }
  setTimeout(boot, 400);
  setTimeout(boot, 1200);
  setTimeout(function () { installCoachWelcome(); installCoachBoxSpeak(); }, 1200);
})();
