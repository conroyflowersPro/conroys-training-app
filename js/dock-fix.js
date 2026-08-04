/* dock-fix.js v5.3.5 — coaching boot + loaders + safeSubmit loading/coach-box */
(function () {
  function loadScript(src, id) {
    try {
      if (id && document.getElementById(id)) return;
      var s = document.createElement('script');
      if (id) s.id = id;
      s.src = src;
      s.async = false;
      document.head.appendChild(s);
    } catch (e) {}
  }
  loadScript('js/tts-fix.js?v=5.3.5', 'cf-tts-fix');
  loadScript('js/mic-fix.js?v=5.3.5', 'cf-mic-fix');
  loadScript('js/guide-speak.js?v=5.3.5', 'cf-guide-speak');

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

  function hideLangIfNeeded() {
    try {
      var sel = document.getElementById('lang-select');
      if (sel) sel.style.display = 'none';
    } catch (e) {}
  }

  window.unlockAudio = function unlockAudio() {
    try {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) {
        if (!window._cfAudioCtx) window._cfAudioCtx = new Ctx();
        if (window._cfAudioCtx.state === 'suspended') window._cfAudioCtx.resume();
      }
    } catch (e) {}
  };

  function appendGrokMessage(text, role) {
    try {
      var box = document.getElementById('grok-messages');
      if (!box) return;
      var div = document.createElement('div');
      div.className = 'grok-msg ' + (role === 'user' ? 'user' : 'bot');
      div.textContent = text;
      box.appendChild(div);
      box.scrollTop = box.scrollHeight;
    } catch (e) {}
  }

  function isBadAnswer(answer) {
    var a = String(answer || '');
    if (!a) return true;
    if (/서버 오류|API 오류|네트워크\/Functions|504|Inactivity Timeout|<!DOCTYPE|is not valid JSON/i.test(a)) return true;
    return false;
  }

  function safeSubmit() {
    var input = document.getElementById('float-chat-input');
    var q = input ? String(input.value || '').trim() : '';
    if (!q) return;
    if (input) input.value = '';
    try { if (typeof appendGrokMessage === 'function') appendGrokMessage(q, 'user'); } catch (e) {}
    try {
      if (typeof playLoadingSound === 'function') playLoadingSound();
      else if (typeof playLoadingSoundOnce === 'function') playLoadingSoundOnce();
      else if (typeof playBell === 'function') playBell();
    } catch (e) {}
    try {
      if (typeof showLoadingStatus === 'function') showLoadingStatus();
    } catch (e) {
      try {
        var box = document.getElementById('grok-messages');
        if (box && !document.getElementById('cf-loading-msg')) {
          var el = document.createElement('div');
          el.className = 'grok-msg bot';
          el.id = 'cf-loading-msg';
          el.style.opacity = '0.75';
          el.textContent = 'Looking up…';
          box.appendChild(el);
        }
      } catch (e2) {}
    }
    var ansEl = document.getElementById('float-answer');
    if (ansEl) ansEl.textContent = 'Loading answer...';
    (async function () {
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
        if (isBadAnswer(answer)) {
          var fail = '잠시 후 다시 시도해 주세요. (서버 응답 오류)';
          if (typeof appendGrokMessage === 'function') appendGrokMessage(fail, 'bot');
          if (ansEl) ansEl.textContent = fail;
          return;
        }
        if (typeof showAnswerInPanel === 'function') showAnswerInPanel(q, answer);
        else if (typeof appendGrokMessage === 'function') appendGrokMessage(answer, 'bot');
      } catch (e) {
        try { if (typeof appendGrokMessage === 'function') appendGrokMessage(String(answer || e), 'bot'); } catch (e2) {}
      }
    })();
  }

  function patchSubmit() {
    try {
      submitFloatChat = safeSubmit;
      window.submitFloatChat = safeSubmit;
    } catch (e) {}
  }

  function boot() {
    bumpVersionLabel();
    hideLangIfNeeded();
    patchSubmit();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 50); });
  else setTimeout(boot, 50);
  setTimeout(boot, 400);
  setTimeout(boot, 1200);
})();
