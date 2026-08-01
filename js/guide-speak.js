/* Guide modal Read aloud — goal only (v3.0.0) cost control */
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
    if (typeof speakText !== 'function') return;
    let text = '';
    const goalEl = document.getElementById('guide-goal-text');
    if (goalEl && goalEl.textContent) {
      text = goalEl.textContent.trim();
    }
    if (!text) {
      const modal = document.getElementById('modal-content');
      if (!modal) return;
      const box = modal.querySelector('.script-box');
      if (box) text = (box.innerText || '').trim();
    }
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
