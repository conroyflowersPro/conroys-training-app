/* guide-speak.js v5.0.12 — single Read button, remove 읽어주기 */
(function () {
  function removeIreojugiButtons(root) {
    if (!root) return;
    var buttons = root.querySelectorAll('button');
    for (var i = 0; i < buttons.length; i++) {
      var b = buttons[i];
      var t = (b.textContent || '').replace(/\s+/g, ' ').trim();
      if (t.indexOf('읽어주기') >= 0 || t === 'Read aloud' || t.indexOf('読み上げ') >= 0) {
        if (b.id !== 'guide-speak-btn' && b.id !== 'float-coach-speak-btn') {
          b.remove();
        }
      }
    }
  }

  function attachGuideSpeakButton() {
    var modal = document.getElementById('modal-content');
    if (!modal) return;
    removeIreojugiButtons(modal);
    if (document.getElementById('guide-speak-btn')) {
      document.getElementById('guide-speak-btn').textContent = '🔊 Read';
      return;
    }
    var wrap = document.createElement('div');
    wrap.style.cssText = 'margin-top:14px;display:flex;gap:8px;flex-wrap:wrap';
    wrap.innerHTML =
      '<button class="btn" id="guide-speak-btn" style="flex:1;min-width:140px" onclick="speakGuideModal(this)">🔊 Read</button>';
    modal.appendChild(wrap);
  }

  window.speakGuideModal = function (btn) {
    if (typeof speakText !== 'function') return;
    var text = '';
    var goalEl = document.getElementById('guide-goal-text');
    if (goalEl && goalEl.textContent) text = goalEl.textContent.trim();
    if (!text) {
      var modal = document.getElementById('modal-content');
      if (modal) {
        var box = modal.querySelector('.script-box');
        if (box) text = (box.innerText || '').trim();
        if (!text) {
          var clone = modal.cloneNode(true);
          var btns = clone.querySelectorAll('button');
          for (var i = 0; i < btns.length; i++) btns[i].remove();
          text = (clone.innerText || '').replace(/\s+/g, ' ').trim();
        }
      }
    }
    if (!text) return;
    try { if (typeof unlockAudio === 'function') unlockAudio(); } catch (e) {}
    speakText(text, btn);
  };

  function wrap(fnName) {
    var orig = window[fnName];
    if (typeof orig !== 'function') return;
    window[fnName] = function () {
      var result = orig.apply(this, arguments);
      setTimeout(attachGuideSpeakButton, 0);
      setTimeout(attachGuideSpeakButton, 50);
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
