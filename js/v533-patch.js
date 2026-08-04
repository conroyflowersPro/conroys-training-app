/* v5.3.3 patch — checklist CSS, friendly errors, order-check routing */
(function () {
  // Checklist layout fix
  try {
    if (!document.getElementById('cf-checklist-css')) {
      var st = document.createElement('style');
      st.id = 'cf-checklist-css';
      st.textContent = '.checklist{margin:4px 0 12px}.checklist label{display:flex;align-items:flex-start;gap:10px;padding:8px 0;line-height:1.45;font-size:0.92rem;cursor:pointer;border-bottom:1px solid #f3f4f6}.checklist label:last-child{border-bottom:none}.checklist input[type=checkbox]{margin-top:3px;width:18px;height:18px;flex-shrink:0}';
      (document.head || document.documentElement).appendChild(st);
    }
  } catch (e) {}

  function isBadAnswer(answer) {
    if (!answer) return true;
    var s = String(answer);
    if (/서버 오류|API 오류|Inactivity Timeout|Too much time has passed/i.test(s)) return true;
    if (/<html[\s>]|<HTML[\s>]|<head>|<HEAD>|<body[\s>]|<!DOCTYPE/i.test(s)) return true;
    return false;
  }
  function friendlyError() {
    var L = (typeof currentLang !== 'undefined' && currentLang) ? currentLang : 'en';
    return ({
      ko: '연결이 지연되었거나 서버 오류가 났습니다. 잠시 후 다시 시도해 주세요.',
      en: 'Connection timed out or server error. Please try again in a moment.',
      ja: '接続が遅延したか、サーバーエラーです。しばらくしてから再試行してください。',
      es: 'Tiempo de espera agotado o error del servidor. Intente de nuevo en un momento.'
    })[L] || 'Connection timed out or server error. Please try again.';
  }
  window.isBadAnswer = isBadAnswer;
  window.friendlyError = friendlyError;

  function patchDetect() {
    if (typeof window.detectRelatedSection !== 'function') return;
    var orig = window.detectRelatedSection;
    if (orig._cf533) return;
    function wrapped(question, answer) {
      var text = ((answer || '') + ' ' + (question || '')).toLowerCase();
      if (/오더\s*확인|주문\s*확인|order\s*(status|check|lookup)|look\s*up\s*order|주문\s*조회|오더\s*조회|tracking|트래킹|where\s*is\s*(my\s*)?order|배송\s*상태|주문\s*상태/.test(text)) {
        if (typeof sectionById === 'function') return sectionById('bmsflow');
      }
      if (isBadAnswer(answer)) return null;
      return orig(question, answer);
    }
    wrapped._cf533 = true;
    window.detectRelatedSection = wrapped;
    try { detectRelatedSection = wrapped; } catch (e) {}
  }

  function filterBotText(text) {
    if (isBadAnswer(text)) {
      try { if (typeof removeCoachBox === 'function') removeCoachBox(); } catch (e) {}
      window._lastRelatedSection = null;
      return friendlyError();
    }
    return text;
  }

  function patchAppend() {
    if (typeof window.appendGrokMessage === 'function' && !window.appendGrokMessage._cf533) {
      var ao = window.appendGrokMessage;
      window.appendGrokMessage = function (text, type) {
        if (type === 'bot') text = filterBotText(text);
        return ao.call(this, text, type);
      };
      window.appendGrokMessage._cf533 = true;
    }
  }

  function watchMessages() {
    var box = document.getElementById('grok-messages');
    if (!box || box._cf533obs) return;
    box._cf533obs = true;
    var obs = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        m.addedNodes.forEach(function (node) {
          if (!node || node.nodeType !== 1) return;
          if (!node.classList || !node.classList.contains('grok-msg')) return;
          if (!node.classList.contains('bot')) return;
          var t = node.textContent || '';
          if (isBadAnswer(t)) {
            node.textContent = friendlyError();
            try { if (typeof removeCoachBox === 'function') removeCoachBox(); } catch (e) {}
            window._lastRelatedSection = null;
          }
        });
      });
    });
    obs.observe(box, { childList: true });
  }

  function boot() {
    patchDetect();
    patchAppend();
    watchMessages();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 50); });
  else setTimeout(boot, 50);
  setTimeout(boot, 500);
  setTimeout(boot, 1500);
})();
