/* v5.3.3 patch — friendly errors + order-check routing override */
(function () {
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

  // Wrap detectRelatedSection for order-check priority
  function patchDetect() {
    if (typeof window.detectRelatedSection !== 'function') return;
    var orig = window.detectRelatedSection;
    if (orig._cf533) return;
    function wrapped(question, answer) {
      var text = ((answer || '') + ' ' + (question || '')).toLowerCase();
      if (/오더\s*확인|주문\s*확인|order\s*(status|check|lookup)|look\s*up\s*order|주문\s*조회|오더\s*조회|tracking|트래킹|where\s*is\s*(my\s*)?order|배송\s*상태|주문\s*상태/.test(text)) {
        if (typeof sectionById === 'function') return sectionById('bmsflow');
      }
      return orig(question, answer);
    }
    wrapped._cf533 = true;
    window.detectRelatedSection = wrapped;
    try { detectRelatedSection = wrapped; } catch (e) {}
  }

  // Re-wrap submitFloatChat if already patched by dock-fix
  function patchSubmitErrors() {
    if (typeof window.submitFloatChat !== 'function') return;
    var orig = window.submitFloatChat;
    if (orig._cf533err) return;
    async function wrapped() {
      var input = document.getElementById('float-chat-input');
      // Let orig run, but we can't intercept mid-flight easily.
      // Instead monkey-patch showAnswerInPanel path is enough via answer-ui.
      return orig.apply(this, arguments);
    }
    // Patch safeAppend path: override after boot by wrapping askGrok return handling is in dock-fix.
    // Add post-filter on appendGrokMessage for bad HTML
    if (typeof window.appendGrokMessage === 'function' && !window.appendGrokMessage._cf533) {
      var ao = window.appendGrokMessage;
      window.appendGrokMessage = function (text, type) {
        if (type === 'bot' && isBadAnswer(text)) {
          text = friendlyError();
          try { if (typeof removeCoachBox === 'function') removeCoachBox(); } catch (e) {}
          window._lastRelatedSection = null;
        }
        return ao.call(this, text, type);
      };
      window.appendGrokMessage._cf533 = true;
    }
  }

  function boot() {
    patchDetect();
    patchSubmitErrors();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 50); });
  else setTimeout(boot, 50);
  setTimeout(boot, 500);
  setTimeout(boot, 1500);
})();
