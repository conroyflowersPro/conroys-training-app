/* voice-b.js v5.0.1 — TTS + mic (continuation of voice-a) */
/* voice-b restored */

    function waitForVoices() {
      return new Promise((resolve) => {
        const existing = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
        if (existing && existing.length) return resolve(existing);
        if (!window.speechSynthesis) return resolve([]);
        const done = () => resolve(window.speechSynthesis.getVoices() || []);
        window.speechSynthesis.onvoiceschanged = done;
        setTimeout(done, 800);
      });
    }

    async function speakBrowserOnly(text, ttsLang, statusEl, stopBtn) {
      if (!window.speechSynthesis) return false;
      try {
        window.speechSynthesis.cancel();
        const voices = await waitForVoices();
        const utter = new SpeechSynthesisUtterance(text);
        const browserLang = ttsLang === 'ko' ? 'ko-KR' : ttsLang === 'ja' ? 'ja-JP' : ttsLang === 'es-ES' ? 'es-ES' : 'en-US';
        utter.lang = browserLang;
        const preferred = voices.find(v => v.lang && v.lang.startsWith(browserLang.slice(0, 2)));
        if (preferred) utter.voice = preferred;
        utter.onend = () => { setMicSpeaking(false); if (stopBtn) stopBtn.style.display = 'none'; if (statusEl) statusEl.textContent = 'Done'; };
        utter.onerror = () => { setMicSpeaking(false); };
        setMicSpeaking(true);
        if (stopBtn) stopBtn.style.display = 'inline-block';
        window.speechSynthesis.speak(utter);
        return true;
      } catch (e) {
        return false;
      }
    }

    async function speakText(text, btn) {
      if (!text) return;
      const plain = String(text).replace(/\s+/g, ' ').trim();
      if (!plain) return;
      stopSpeaking();
      const ttsLang = detectLang(plain);
      const statusEl = document.getElementById('float-status');
      const stopBtn = document.getElementById('float-stop-btn');
      if (btn) { btn.disabled = true; btn.textContent = '...'; }
      if (stopBtn) stopBtn.style.display = 'inline-block';
      let played = false;
      let lastErr = '';
      const cacheKey = ttsCacheKey(plain, ttsLang);
      try {
        if (ttsMemoryCache.has(cacheKey)) {
          const cached = ttsMemoryCache.get(cacheKey);
          await playBuf(cached.buf, cached.mime);
          played = true;
        }
      } catch (e) { lastErr = 'cache play: ' + e.message; }
      if (!played) {
        try {
          const res = await fetch('/.netlify/functions/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: plain.slice(0, 14000), voice_id: 'eve', language: ttsLang })
          });
          if (res.ok) {
            const ct = (res.headers.get('content-type') || '').toLowerCase();
            let buf = await res.arrayBuffer();
            if (buf && buf.byteLength > 100 && !ct.includes('audio') && !ct.includes('mpeg')) {
              try {
                const textBody = new TextDecoder().decode(buf);
                if (/^[A-Za-z0-9+/=\s]+$/.test(textBody.slice(0, 200))) {
                  const bin = atob(textBody.replace(/\s/g, ''));
                  const arr = new Uint8Array(bin.length);
                  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
                  buf = arr.buffer;
                }
              } catch (_) {}
            }
            if (buf && buf.byteLength > 100) {
              const mime = ct.includes('audio') ? ct : 'audio/mpeg';
              ttsMemoryCache.set(cacheKey, { buf: buf.slice(0), mime });
              try {
                await playBuf(buf, mime);
                played = true;
              } catch (playErr) {
                lastErr = 'play blocked: ' + (playErr.message || playErr);
              }
            } else lastErr = 'empty audio body';
          } else {
            lastErr = 'TTS ' + res.status;
          }
        } catch (e) {
          lastErr = 'TTS fetch: ' + (e.message || e);
        }
      }
      if (!played) {
        played = await speakBrowserOnly(plain, ttsLang, statusEl, stopBtn);
        if (!played) lastErr = (lastErr ? lastErr + ' | ' : '') + 'browser TTS failed';
      }
      if (btn) { btn.disabled = false; btn.textContent = '🔊 Read'; }
      if (!played && statusEl) statusEl.textContent = lastErr || 'Speak failed';
    }

    async function playBuf(buf, mime) {
      return new Promise((resolve, reject) => {
        const blob = new Blob([buf], { type: mime || 'audio/mpeg' });
        const url = URL.createObjectURL(blob);
        const audioEl = new Audio(url);
        currentAudio = audioEl;
        window.currentAudio = audioEl;
        audioEl.onended = () => {
          URL.revokeObjectURL(url);
          currentAudio = null;
          window.currentAudio = null;
          setMicSpeaking(false);
          const stopBtn = document.getElementById('float-stop-btn');
          if (stopBtn) stopBtn.style.display = 'none';
          resolve();
        };
        audioEl.onerror = (e) => {
          URL.revokeObjectURL(url);
          currentAudio = null;
          window.currentAudio = null;
          setMicSpeaking(false);
          reject(e);
        };
        setMicSpeaking(true);
        audioEl.play().catch(reject);
      });
    }

    // Mic / recording stubs continued from original
    let mediaRecorder = null;
    let mediaStream = null;
    let audioContext = null;
    let analyserNode = null;
    let isListening = false;
    let maxRecordTimer = null;
    let silenceRaf = null;

    function setFloatStatus(msg) {
      const el = document.getElementById('float-status');
      if (el) el.textContent = msg;
    }

    function closeFloatPanel() {
      const panel = document.getElementById('float-mic-panel');
      if (panel) panel.classList.remove('show');
      stopFloatMic(true);
      stopSpeaking();
    }

    function stopFloatMic(cancelOnly) {
      isListening = false;
      const micBtn = document.getElementById('float-mic');
      if (micBtn) micBtn.classList.remove('listening');
      if (maxRecordTimer) { clearTimeout(maxRecordTimer); maxRecordTimer = null; }
      if (silenceRaf) { cancelAnimationFrame(silenceRaf); silenceRaf = null; }
      try {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
          if (cancelOnly) mediaRecorder.onstop = null;
          mediaRecorder.stop();
        }
      } catch (e) {}
      mediaRecorder = null;
      if (mediaStream) { mediaStream.getTracks().forEach(t => t.stop()); mediaStream = null; }
      try { if (audioContext) audioContext.close(); } catch (e) {}
      audioContext = null;
      analyserNode = null;
    }

    function blobToBase64(blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(String(reader.result || '').split(',')[1] || '');
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }

    async function transcribeWithXAI(blob) {
      const base64 = await blobToBase64(blob);
      const langHint = currentLang === 'ko' ? 'ko' : currentLang === 'ja' ? 'ja' : currentLang === 'es' ? 'es' : 'auto';
      const res = await fetch('/.netlify/functions/stt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audio: base64, contentType: blob.type || 'audio/webm', language: langHint })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 404) throw new Error('STT function not found');
        throw new Error(data.error || ('STT ' + res.status));
      }
      return data.text || data.transcript || '';
    }

    function toggleFloatMic() {
      const panel = document.getElementById('float-mic-panel');
      if (panel) panel.classList.add('show');
      if (isListening) {
        setFloatStatus('Recognizing speech...');
        try {
          if (mediaRecorder && mediaRecorder.state === 'recording') mediaRecorder.stop();
        } catch (e) { stopFloatMic(true); }
        return;
      }
      stopFloatMic(true);
      startRecording();
    }

    async function startRecording() {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        isListening = true;
        const micBtn = document.getElementById('float-mic');
        if (micBtn) micBtn.classList.add('listening');
        setFloatStatus('Listening...');
        const chunks = [];
        mediaRecorder = new MediaRecorder(mediaStream);
        mediaRecorder.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
        mediaRecorder.onstop = async () => {
          stopFloatMic(false);
          if (!chunks.length) { setFloatStatus('No audio'); return; }
          const blob = new Blob(chunks, { type: chunks[0].type || 'audio/webm' });
          try {
            setFloatStatus('Transcribing...');
            const text = await transcribeWithXAI(blob);
            if (text) {
              const input = document.getElementById('float-chat-input');
              if (input) input.value = text;
              setFloatStatus('Q: ' + text);
              if (typeof submitFloatChat === 'function') submitFloatChat();
            } else setFloatStatus('Could not recognize speech');
          } catch (e) {
            setFloatStatus('STT error: ' + (e.message || e));
          }
        };
        mediaRecorder.start();
        maxRecordTimer = setTimeout(() => {
          try { if (mediaRecorder && mediaRecorder.state === 'recording') mediaRecorder.stop(); } catch (e) {}
        }, 15000);
      } catch (e) {
        isListening = false;
        setFloatStatus('Mic error: ' + (e.message || e));
      }
    }

    function toggleVoice() {
      toggleFloatMic();
    }
