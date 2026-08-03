/* mic-fix.js v5.0.9 — immediate mic UI + rebind + errors */
(function () {
  function showMicStatus(msg) {
    try { if (typeof setFloatStatus === 'function') setFloatStatus(msg || ''); } catch (e) {}
    try {
      var el = document.getElementById('float-status');
      if (el) { el.style.display = msg ? 'block' : 'none'; el.textContent = msg || ''; }
    } catch (e) {}
  }
  function setMicListening(on) {
    var mic = document.getElementById('float-mic');
    if (!mic) return;
    if (on) { mic.classList.remove('speaking'); mic.classList.add('listening'); }
    else mic.classList.remove('listening');
  }
  function stopMicSafe() {
    try { if (window.__cfMicTimer) { clearTimeout(window.__cfMicTimer); window.__cfMicTimer = null; } } catch (e) {}
    try {
      if (window.__cfMediaRecorder && window.__cfMediaRecorder.state === 'recording') window.__cfMediaRecorder.stop();
    } catch (e) {}
    window.__cfMediaRecorder = null;
    try {
      if (window.__cfMicStream) window.__cfMicStream.getTracks().forEach(function (t) { t.stop(); });
    } catch (e) {}
    window.__cfMicStream = null;
    window.__cfMicRecording = false;
    setMicListening(false);
  }
  async function startMicSafe() {
    stopMicSafe();
    setMicListening(true);
    window.__cfMicRecording = true;
    showMicStatus('Listening... (requesting mic)');
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Microphone API not available');
      }
      var stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      window.__cfMicStream = stream;
      setMicListening(true);
      showMicStatus('Listening...');
      try { if (typeof playMicBeep === 'function') playMicBeep(); } catch (e) {}
      if (typeof MediaRecorder === 'undefined') throw new Error('MediaRecorder not supported');
      var mime = '';
      try {
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) mime = 'audio/webm;codecs=opus';
        else if (MediaRecorder.isTypeSupported('audio/webm')) mime = 'audio/webm';
        else if (MediaRecorder.isTypeSupported('audio/mp4')) mime = 'audio/mp4';
      } catch (e) {}
      var chunks = [];
      var mr = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      window.__cfMediaRecorder = mr;
      mr.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
      mr.onstop = async function () {
        window.__cfMicRecording = false;
        setMicListening(false);
        try { if (window.__cfMicStream) window.__cfMicStream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {}
        window.__cfMicStream = null;
        if (!chunks.length) { showMicStatus('No audio captured'); return; }
        var blob = new Blob(chunks, { type: chunks[0].type || mime || 'audio/webm' });
        showMicStatus('Transcribing...');
        try {
          if (typeof transcribeWithXAI === 'function') {
            var result = await transcribeWithXAI(blob);
            var text = (result && result.text) ? result.text : '';
            if (typeof handleTranscript === 'function') handleTranscript(text, result && result.sttLang);
            else if (text) {
              var input = document.getElementById('float-chat-input');
              if (input) input.value = text;
              if (typeof submitFloatChat === 'function') submitFloatChat();
            } else showMicStatus('Could not recognize speech');
          } else showMicStatus('STT not loaded');
        } catch (e) {
          showMicStatus('STT error: ' + (e.message || e));
          try { if (typeof appendGrokMessage === 'function') appendGrokMessage('🎤 STT error: ' + (e.message || e), 'warn'); } catch (e2) {}
        }
      };
      mr.start();
      window.__cfMicTimer = setTimeout(function () {
        try { if (mr && mr.state === 'recording') mr.stop(); } catch (e) {}
      }, 12000);
    } catch (e) {
      window.__cfMicRecording = false;
      setMicListening(false);
      var msg = 'Mic error: ' + (e.message || e);
      showMicStatus(msg);
      try { if (typeof appendGrokMessage === 'function') appendGrokMessage('🎤 ' + msg, 'warn'); } catch (e2) {}
    }
  }
  function toggleFloatMicSafe(ev) {
    try { if (ev && ev.preventDefault) ev.preventDefault(); } catch (e) {}
    try { if (typeof unlockAudio === 'function') unlockAudio(); } catch (e) {}
    if (window.__cfMicRecording) {
      showMicStatus('Recognizing speech...');
      try {
        if (window.__cfMediaRecorder && window.__cfMediaRecorder.state === 'recording') window.__cfMediaRecorder.stop();
        else stopMicSafe();
      } catch (e) { stopMicSafe(); }
      return;
    }
    startMicSafe();
  }
  function bindMic() {
    var mic = document.getElementById('float-mic');
    if (!mic) return;
    window.toggleFloatMic = toggleFloatMicSafe;
    window.toggleVoice = toggleFloatMicSafe;
    try { toggleFloatMic = toggleFloatMicSafe; } catch (e) {}
    try { toggleVoice = toggleFloatMicSafe; } catch (e) {}
    if (mic.__cfMicBound) return;
    mic.__cfMicBound = true;
    mic.onclick = null;
    mic.addEventListener('click', function (ev) { toggleFloatMicSafe(ev); }, false);
  }
  function boot() {
    bindMic();
    setTimeout(bindMic, 400);
    setTimeout(bindMic, 1200);
    setTimeout(bindMic, 2500);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
