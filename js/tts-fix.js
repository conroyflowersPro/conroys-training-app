/* tts-fix.js v5.0.7 — Web Audio TTS + browser-first + visible errors */
(function () {
  function ttsApiLang(code) {
    if (code === 'ko') return 'ko';
    if (code === 'ja') return 'ja';
    if (code === 'es' || code === 'es-ES') return 'es';
    if (code === 'en') return 'en';
    return 'auto';
  }

  function ensureTtsCtx() {
    try {
      if (typeof unlockAudio === 'function') unlockAudio();
    } catch (e) {}
    var Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    if (!window._cfTtsCtx) window._cfTtsCtx = new Ctx();
    return window._cfTtsCtx;
  }

  async function playBufFixed(buf, mime) {
    try {
      var ctx = ensureTtsCtx();
      if (ctx) {
        if (ctx.state === 'suspended') await ctx.resume();
        var copy = buf.slice(0);
        var audioBuf = await ctx.decodeAudioData(copy);
        await new Promise(function (resolve, reject) {
          try {
            if (window._ttsSource) {
              try { window._ttsSource.stop(); } catch (e) {}
              window._ttsSource = null;
            }
            var src = ctx.createBufferSource();
            src.buffer = audioBuf;
            src.connect(ctx.destination);
            window._ttsSource = src;
            if (typeof currentAudio !== 'undefined') {
              currentAudio = { pause: function () { try { src.stop(); } catch (e) {} } };
              window.currentAudio = currentAudio;
            } else {
              window.currentAudio = { pause: function () { try { src.stop(); } catch (e) {} } };
            }
            src.onended = function () {
              window._ttsSource = null;
              window.currentAudio = null;
              try { currentAudio = null; } catch (e) {}
              if (typeof setMicSpeaking === 'function') setMicSpeaking(false);
              var stopBtn = document.getElementById('float-stop-btn');
              if (stopBtn) stopBtn.style.display = 'none';
              resolve();
            };
            if (typeof setMicSpeaking === 'function') setMicSpeaking(true);
            src.start(0);
          } catch (e) { reject(e); }
        });
        return;
      }
    } catch (e) {}
    await new Promise(function (resolve, reject) {
      var blob = new Blob([buf], { type: mime || 'audio/mpeg' });
      var url = URL.createObjectURL(blob);
      var audioEl = new Audio(url);
      window.currentAudio = audioEl;
      try { currentAudio = audioEl; } catch (e) {}
      audioEl.onended = function () {
        window.currentAudio = null;
        try { currentAudio = null; } catch (e) {}
        if (typeof setMicSpeaking === 'function') setMicSpeaking(false);
        var stopBtn = document.getElementById('float-stop-btn');
        if (stopBtn) stopBtn.style.display = 'none';
        URL.revokeObjectURL(url);
        resolve();
      };
      audioEl.onerror = function () {
        window.currentAudio = null;
        URL.revokeObjectURL(url);
        reject(new Error('audio play error'));
      };
      if (typeof setMicSpeaking === 'function') setMicSpeaking(true);
      audioEl.play().catch(reject);
    });
  }

  function speakBrowserImmediate(text, ttsLang, statusEl, stopBtn) {
    if (!window.speechSynthesis) return false;
    try {
      try { window.speechSynthesis.resume(); } catch (e) {}
      window.speechSynthesis.cancel();
      var browserLang = ttsLang === 'ko' ? 'ko-KR' : ttsLang === 'ja' ? 'ja-JP' : (ttsLang === 'es-ES' || ttsLang === 'es') ? 'es-ES' : 'en-US';
      var utter = new SpeechSynthesisUtterance(text);
      utter.lang = browserLang;
      try {
        var voices = window.speechSynthesis.getVoices() || [];
        var preferred = voices.find(function (v) { return v.lang && v.lang.toLowerCase().indexOf(browserLang.slice(0, 2).toLowerCase()) === 0; });
        if (preferred) utter.voice = preferred;
      } catch (e) {}
      utter.onend = function () {
        if (typeof setMicSpeaking === 'function') setMicSpeaking(false);
        if (stopBtn) stopBtn.style.display = 'none';
        if (statusEl) statusEl.textContent = 'Done';
      };
      utter.onerror = function () {
        if (typeof setMicSpeaking === 'function') setMicSpeaking(false);
      };
      if (typeof setMicSpeaking === 'function') setMicSpeaking(true);
      window.speechSynthesis.speak(utter);
      return true;
    } catch (e) {
      return false;
    }
  }

  async function speakTextFixed(text, btn) {
    if (!text) return;
    var plain = String(text).replace(/\s+/g, ' ').trim();
    if (!plain) return;
    if (typeof stopSpeaking === 'function') stopSpeaking();
    try {
      if (window._ttsSource) { try { window._ttsSource.stop(); } catch (e) {} window._ttsSource = null; }
    } catch (e) {}
    ensureTtsCtx();
    var ttsLang = (typeof detectLang === 'function') ? detectLang(plain) : 'en';
    var apiLang = ttsApiLang(ttsLang);
    var statusEl = document.getElementById('float-status');
    var stopBtn = document.getElementById('float-stop-btn');
    if (statusEl) { statusEl.style.display = 'block'; statusEl.textContent = 'Speaking...'; }
    if (btn) { btn.disabled = true; btn.textContent = 'Loading...'; }
    if (stopBtn) stopBtn.style.display = 'inline-block';
    if (typeof setMicSpeaking === 'function') setMicSpeaking(true);
    var played = false;
    var lastErr = '';

    try {
      if (speakBrowserImmediate(plain, ttsLang, statusEl, stopBtn)) played = true;
    } catch (e) {
      lastErr = 'browser: ' + (e.message || e);
    }

    try {
      var cacheKey = (typeof ttsCacheKey === 'function') ? ttsCacheKey(plain, ttsLang) : (apiLang + ':' + plain.slice(0, 40));
      var buf = null;
      var mime = 'audio/mpeg';
      if (typeof ttsMemoryCache !== 'undefined' && ttsMemoryCache && ttsMemoryCache.has && ttsMemoryCache.has(cacheKey)) {
        var cached = ttsMemoryCache.get(cacheKey);
        buf = cached.buf;
        mime = cached.mime || mime;
      } else {
        var res = await fetch('/.netlify/functions/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: plain.slice(0, 14000), voice_id: 'eve', language: apiLang })
        });
        if (res.ok) {
          var ct = (res.headers.get('content-type') || '').toLowerCase();
          buf = await res.arrayBuffer();
          if (buf && buf.byteLength > 100) {
            mime = ct.indexOf('audio') >= 0 ? ct : 'audio/mpeg';
            try {
              if (typeof ttsMemoryCache !== 'undefined' && ttsMemoryCache && ttsMemoryCache.set) {
                ttsMemoryCache.set(cacheKey, { buf: buf.slice(0), mime: mime });
              }
            } catch (e) {}
          } else {
            buf = null;
            lastErr = 'empty audio body';
          }
        } else {
          var detail = '';
          try { detail = await res.text(); } catch (e) {}
          lastErr = 'TTS ' + res.status + (detail ? (': ' + String(detail).slice(0, 100)) : '');
        }
      }
      if (buf && buf.byteLength > 100) {
        try {
          if (window.speechSynthesis) window.speechSynthesis.cancel();
          await playBufFixed(buf, mime);
          played = true;
          if (statusEl) statusEl.textContent = 'Done';
        } catch (playErr) {
          lastErr = (lastErr ? lastErr + ' | ' : '') + 'play: ' + (playErr.message || playErr);
        }
      }
    } catch (e) {
      lastErr = (lastErr ? lastErr + ' | ' : '') + 'TTS fetch: ' + (e.message || e);
    }

    if (btn) {
      btn.disabled = false;
      btn.textContent = (btn.id === 'float-coach-speak-btn' && typeof currentLang !== 'undefined' && currentLang === 'ko')
        ? '🔊 읽기' : '🔊 Read';
    }
    if (!played) {
      if (typeof setMicSpeaking === 'function') setMicSpeaking(false);
      var msg = lastErr || 'Speak failed';
      if (statusEl) { statusEl.style.display = 'block'; statusEl.textContent = msg; }
      try {
        if (typeof appendGrokMessage === 'function') appendGrokMessage('🔊 ' + msg, 'warn');
      } catch (e) {}
    }
  }

  function install() {
    window.speakText = speakTextFixed;
    try { speakText = speakTextFixed; } catch (e) {}
    window.playBuf = playBufFixed;
    try { playBuf = playBufFixed; } catch (e) {}
  }

  install();
  setTimeout(install, 300);
  setTimeout(install, 1000);
  setTimeout(install, 2000);
})();
