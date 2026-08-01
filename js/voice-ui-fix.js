/* voice-ui-fix.js v4.0.1 — gold mic clear + Read label */
(function () {
  function fixLabels() {
    var ids = ['float-speak-btn', 'speak-btn', 'guide-speak-btn'];
    ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && /Read aloud/i.test(el.textContent || '')) {
        el.textContent = (el.textContent || '').replace(/Read aloud/i, 'Read');
      }
    });
  }

  var origSet = window.setMicSpeaking;
  window.setMicSpeaking = function (on) {
    if (typeof origSet === 'function') origSet(on);
    else {
      var mic = document.getElementById('float-mic');
      if (!mic) return;
      if (on) {
        mic.classList.add('speaking');
        mic.classList.remove('listening');
      } else {
        mic.classList.remove('speaking');
      }
    }
    if (!on && window._speakSafetyTimer) {
      clearTimeout(window._speakSafetyTimer);
      window._speakSafetyTimer = null;
    }
  };

  var origSpeak = window.speakText;
  if (typeof origSpeak === 'function') {
    window.speakText = async function (text, btn) {
      if (window._speakSafetyTimer) {
        clearTimeout(window._speakSafetyTimer);
        window._speakSafetyTimer = null;
      }
      window._speakSafetyTimer = setTimeout(function () {
        if (typeof window.setMicSpeaking === 'function') window.setMicSpeaking(false);
        window._speakSafetyTimer = null;
      }, 90000);
      try {
        await origSpeak(text, btn);
      } catch (e) {
        if (typeof window.setMicSpeaking === 'function') window.setMicSpeaking(false);
        throw e;
      } finally {
        setTimeout(function () {
          var mic = document.getElementById('float-mic');
          var audio = window.currentAudio;
          var synth = window.speechSynthesis;
          var speaking = mic && mic.classList.contains('speaking');
          var audioActive = audio && !audio.paused && !audio.ended;
          var synthActive = synth && synth.speaking;
          if (speaking && !audioActive && !synthActive) {
            if (typeof window.setMicSpeaking === 'function') window.setMicSpeaking(false);
          }
        }, 2000);
        fixLabels();
      }
    };
  }

  document.addEventListener('DOMContentLoaded', fixLabels);
  setTimeout(fixLabels, 500);
  setTimeout(fixLabels, 2000);
})();
