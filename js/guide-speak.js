/* Guide modal Read aloud — server TTS + shared cache via speakText (v1.19.0) */
(function () {
  function attachGuideSpeakButton() {
    const modal = document.getElementById('modal-content');
    if (!modal || document.getElementById('guide-speak-btn')) return;
    const wrap = document.createElement('div');
    wrap.style.cssText = 'margin-top:14px;display:flex;gap:8px;flex-wrap:wrap';
    wrap.innerHTML =
      '<button class="btn" id="guide-speak-btn" style="flex:1;min-width:140px" onclick="speakGuideModal(this)">🔊 Read aloud</button>';
    modal.appendChild(wrap);
  }

  window.speakGuideModal = function (btn) {
    const modal = document.getElementById('modal-content');
    if (!modal || typeof speakText !== 'function') return;
    const clone = modal.cloneNode(true);
    clone.querySelectorAll('button, input, .close-modal').forEach(function (el) {
      el.remove();
    });
    const text = (clone.innerText || clone.textContent || '')
      .replace(/\u00d7/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (!text) return;
    speakText(text, btn);
  };

  function wrap(fnName) {
    const orig = window[fnName];
    if (typeof orig !== 'function') return;
    window[fnName] = function () {
      const result = orig.apply(this, arguments);
      setTimeout(attachGuideSpeakButton, 0);
      return result;
    };
  }

  // After other scripts load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      wrap('showContent');
      wrap('showTaskDetail');
    });
  } else {
    wrap('showContent');
    wrap('showTaskDetail');
  }
})();
