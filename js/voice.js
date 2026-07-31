/* Conroy's Training App - voice module v1.17.0 */
    function saveApiKey() {
      const key = document.getElementById('api-key-input').value.trim();
      if (!key) {
        localStorage.removeItem('cf_xai_key');
        document.getElementById('api-key-status').textContent = 'API Key가 삭제되었습니다.';
        return;
      }
      localStorage.setItem('cf_xai_key', key);
      document.getElementById('api-key-status').textContent = '✅ API Key가 이 기기에 저장되었습니다.';
      document.getElementById('api-key-input').value = '';
    }

    function getApiKey() {
      return localStorage.getItem('cf_xai_key') || '';
    }

    async function askGrok(question) {
      const systemPrompt = window.CF_SYSTEM_PROMPT || '';
      try {
        const res = await fetch('/.netlify/functions/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: buildUserMessage(question) }
            ],
            temperature: 0.3,
            max_tokens: 1000
          })
        });
        if (!res.ok) {
          const err = await res.text();
          let detail = err;
          try { detail = JSON.parse(err).error || err; } catch (_) {}
          return '서버 오류 (' + res.status + '): ' + (detail || 'Functions 응답 실패');
        }
        const data = await res.json();
        if (data.error) {
          return 'API 오류: ' + (typeof data.error === 'string' ? data.error : JSON.stringify(data.error));
        }
        return data.choices?.[0]?.message?.content || '답변을 받지 못했습니다.';
      } catch (e) {
        return '네트워크/Functions 오류: ' + (e.message || e);
      }
    }

    function detectRelatedSection(question, answer) {
      const text = ((question || '') + ' ' + (answer || '')).toLowerCase();
      if (/attach|첨부|cardisle|balloon|풍선|chocolate|초콜릿|plush|인형|white\s*sheet|product\s*detail|awaiting\s*delivery/.test(text)) {
        return { type: 'content', id: 'attachments', label: { ko: '첨부물 가이드', en: 'Attachments guide', ja: '添付物ガイド', es: 'Guía de adjuntos' } };
      }
      if (/deliver|배달|配達|entrega|uber|golocal|walmart|3hr|asap\s*trip|out\s*for\s*delivery/.test(text)) {
        return { type: 'content', id: 'delivery', label: { ko: '배달 가이드', en: 'Delivery guide', ja: '配達ガイド', es: 'Guía de entrega' } };
      }
      if (/bms|workflow|super\s*ticket|superticket|accept|reject|in\s*wire|mark\s*read|design\s*ticket/.test(text)) {
        return { type: 'content', id: 'bmsflow', label: { ko: 'BMS 흐름', en: 'BMS workflow', ja: 'BMSフロー', es: 'Flujo BMS' } };
      }
      if (/message|messages|wire\s*in|funeral|긴급|funeral\s*order/.test(text)) {
        return { type: 'page', id: 'messages', label: { ko: 'Messages 화면', en: 'Messages page', ja: 'Messages画面', es: 'Página Messages' } };
      }
      if (/golden|rule|due\s*time|매니저|manager\s*first|확신/.test(text)) {
        return { type: 'content', id: 'golden', label: { ko: 'Golden Rules', en: 'Golden Rules', ja: 'Golden Rules', es: 'Golden Rules' } };
      }
      if (/customer|손님|greeting|인사|color|색상|size|사이즈|romance|sympathy|needs|니즈/.test(text)) {
        return { type: 'page', id: 'customer', label: { ko: '손님 응대', en: 'Customer guide', ja: '接客ガイド', es: 'Guía de cliente' } };
      }
      if (/phone|전화|電話|teléfono|hold|홀드|on\s*hold/.test(text)) {
        return { type: 'page', id: 'phone', label: { ko: '전화 응대', en: 'Phone guide', ja: '電話対応', es: 'Guía telefónica' } };
      }
      if (/unsure|모르겠|decision|어떻게\s*하|what\s*should|매니저한테|ask\s*manager/.test(text)) {
        return { type: 'content', id: 'decision', label: { ko: '모르겠을 때', en: 'If unsure', ja: '迷ったとき', es: 'Si no está seguro' } };
      }
      if (/start\s*day|end\s*day|cash|현금|드로어|drawer|\$200|200\.00/.test(text)) {
        return { type: 'page', id: 'home', label: { ko: '오늘 루틴', en: 'Today routine', ja: '今日のルーティン', es: 'Rutina de hoy' } };
      }
      return null;
    }

    function goToRelatedSection(section) {
      if (!section) return;
      try { closeFloatPanel(); } catch (e) {}
      if (section.type === 'page' && typeof showPage === 'function') {
        showPage(section.id);
      } else if (section.type === 'content' && typeof showContent === 'function') {
        showContent(section.id);
      } else if (section.type === 'task' && typeof showTaskDetail === 'function') {
        showTaskDetail(section.id);
      }
    }

    function buildRemainingTasksText() {
      const lang = currentLang || 'en';
      const pending = (typeof routineTasks !== 'undefined' ? routineTasks : []).filter(t => !stamps[t.id]?.done);
      if (!pending.length) {
        return {
          ko: '오늘 남은 할 일이 없습니다. 모든 루틴을 완료했습니다.',
          en: 'No remaining tasks today. All routines are done.',
          ja: '今日の残りのタスクはありません。すべて完了です。',
          es: 'No quedan tareas hoy. Todas las rutinas están hechas.'
        }[lang] || 'No remaining tasks today.';
      }
      const titles = pending.map((t, i) => (i + 1) + '. ' + (t.title[lang] || t.title.en || t.id));
      const head = {
        ko: '오늘 남은 할 일입니다. ',
        en: 'Remaining tasks for today. ',
        ja: '今日の残りのタスクです。',
        es: 'Tareas restantes de hoy. '
      }[lang] || 'Remaining tasks. ';
      return head + titles.join(' ');
    }

    function speakRemainingTasks(btn) {
      const text = buildRemainingTasksText();
      window._lastGrokAnswer = text;
      speakText(text, btn);
    }

    function showAnswerInPanel(question, answer) {
      const clean = (answer || '').replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1').replace(/^#+\s*/gm, '');
      window._lastGrokAnswer = clean;
      const ansEl = document.getElementById('float-answer');
      if (ansEl) ansEl.textContent = clean;
      const speakBtn = document.getElementById('float-speak-btn');
      if (speakBtn) speakBtn.style.display = 'inline-block';
      const tasksBtn = document.getElementById('float-tasks-btn');
      if (tasksBtn) tasksBtn.style.display = 'inline-block';

      const oldJump = document.getElementById('float-jump-btn');
      if (oldJump) oldJump.remove();

      const section = detectRelatedSection(question, clean);
      window._lastRelatedSection = section;
      if (section) {
        const lbl = (section.label && (section.label[currentLang] || section.label.en)) || 'Guide';
        setFloatStatus((question ? 'Q: ' + question + ' · ' : '') + '📖 아래 가이드를 확인하세요');
        const controls = document.querySelector('.speak-controls');
        if (controls && !document.getElementById('float-jump-btn')) {
          const btn = document.createElement('button');
          btn.id = 'float-jump-btn';
          btn.className = 'btn btn-sm';
          btn.textContent = '📖 ' + lbl;
          btn.onclick = () => goToRelatedSection(window._lastRelatedSection);
          controls.insertBefore(btn, controls.firstChild);
        }
      } else {
        setFloatStatus((question ? 'Q: ' + question + ' · ' : '') + '🔊 읽어주기 또는 📋 오늘 할 일');
      }
    }

    async function submitFloatChat() {
      const input = document.getElementById('float-chat-input');
      if (!input) return;
      const q = (input.value || '').trim();
      if (!q) return;
      input.value = '';
      let spokenLang = detectLang(q);
      const newLang = spokenLang === 'es-ES' ? 'es' : (spokenLang || 'en');
      if (newLang !== currentLang) {
        currentLang = newLang;
        localStorage.setItem('cf_lang', currentLang);
        const langSel = document.getElementById('lang-select');
        if (langSel) langSel.value = currentLang;
        applyI18n();
        if (typeof renderStamps === 'function') renderStamps();
      }
      setFloatStatus('Q: ' + q);
      document.getElementById('float-answer').textContent = '로딩 중... 답변 생성 중';
      document.getElementById('float-speak-btn').style.display = 'none';
      const tasksBtn = document.getElementById('float-tasks-btn');
      if (tasksBtn) tasksBtn.style.display = 'none';
      const oldJump = document.getElementById('float-jump-btn');
      if (oldJump) oldJump.remove();
      const answer = await askGrok(q);
      if (answer) showAnswerInPanel(q, answer);
      else {
        document.getElementById('float-answer').textContent = '답변을 받지 못했습니다.';
        setFloatStatus('다시 질문해 주세요.');
      }
    }

    async function doSearch() {
      const q = document.getElementById('search-input').value.trim();
      if (!q) return;
      const box = document.getElementById('search-results');
      box.innerHTML = `<div class="alert alert-info">검색 중...</div>`;
      const grokAnswer = await askGrok(q);
      if (grokAnswer) {
        const cleanAnswer = grokAnswer.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1').replace(/^#+\s*/gm, '').replace(/^\s*[-•]\s*/gm, '');
        window._lastGrokAnswer = cleanAnswer;
        const section = detectRelatedSection(q, cleanAnswer);
        window._lastRelatedSection = section;
        let jumpBtn = '';
        if (section) {
          const lbl = (section.label && (section.label[currentLang] || section.label.en)) || 'Guide';
          jumpBtn = `<button class="btn btn-sm" style="margin-top:10px;width:100%" onclick="goToRelatedSection(window._lastRelatedSection)">📖 ${lbl}</button>`;
        }
        box.innerHTML = `
          <div class="result-item" style="background:#f0f7f2;border-radius:12px;padding:14px;margin-bottom:12px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:6px">
              <strong>🤖 Grok 답변</strong>
              <div style="display:flex;gap:6px;flex-wrap:wrap">
                <button class="btn btn-sm" id="speak-btn" onclick="speakText(window._lastGrokAnswer, this)">🔊 읽어주기</button>
                <button class="btn btn-sm btn-outline" onclick="speakRemainingTasks(this)">📋 오늘 할 일</button>
              </div>
            </div>
            <p style="font-size:0.95rem;margin-top:4px;white-space:pre-wrap">${cleanAnswer}</p>
            ${jumpBtn}
          </div>`;
        logQuestion(q);
        return;
      }
      const ql = q.toLowerCase();
      const results = knowledge.filter(k => k.keys.some(key => key.includes(ql) || ql.includes(key)));
      if (results.length === 0) {
        box.innerHTML = `<div class="alert alert-info">${currentLang==='ko'?'결과가 없습니다.':'No results.'}</div>`;
        return;
      }
      box.innerHTML = results.map(r => `
        <div class="result-item">
          <strong>${r.title[currentLang] || r.title.en}</strong>
          <p style="font-size:0.9rem;margin-top:4px;color:var(--muted)">${r.body[currentLang] || r.body.en}</p>
        </div>
      `).join('');
      logQuestion(q);
    }

    function buildUserMessage(question) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
      const next = getNextTask();
      const nextTitle = next ? (next.title.ko + ' / ' + next.title.en) : '모든 루틴 완료';
      let doneList = routineTasks.filter(t => stamps[t.id]?.done).map(t => t.title.ko).join(', ') || '없음';
      let qLang = detectLang(question);
      if (/\[User spoke Korean/i.test(question)) qLang = 'ko';
      if (/\[User spoke Japanese/i.test(question)) qLang = 'ja';
      const langName = qLang === 'ko' ? 'Korean' : qLang === 'ja' ? 'Japanese' : qLang === 'es-ES' ? 'Spanish' : 'English';
      return `Current time: ${timeStr}. Next incomplete task: ${nextTitle}. Already completed today: ${doneList}.
Detected question language: ${qLang}.
CRITICAL: You MUST answer 100% in ${langName}. Do not answer in English unless the question is English.
If the question is Korean (including romanized Korean like "annyong"), write every sentence in Korean Hangul.
If Japanese (including romaji), answer in Japanese. If Spanish, answer in Spanish.
Prefer short guide-first answers when an in-app guide applies.
Question: ${question}`;
    }

    let currentAudio = null;

    function detectLang(text) {
      if (!text) return 'en';
      const s = String(text);
      const hangul = (s.match(/[가-힣]/g) || []).length;
      const kana = (s.match(/[ぁ-んァ-ン]/g) || []).length;
      if (hangul >= 1) return 'ko';
      if (kana >= 1) return 'ja';
      if (/\b(annyong|annyeong|annyeonghaseyo|gamsahamnida|gomawoyo|jamkkanman|eotteoke|eotteohge|mwoya|nugu|eodi|baedal|jumun|kkot)\b/i.test(s)) return 'ko';
      if (/\b(konnichiwa|arigatou|arigato|sumimasen|onegaishimasu|hai|iie|ohayo|oyasumi|kudasai|desu|masu)\b/i.test(s)) return 'ja';
      if (/[áéíóúñü¿¡]/i.test(s) || /\b(el|la|de|que|y|en|un|una|es|por|para|gracias|hola|buenos|días|como|está|necesito|flores)\b/i.test(s)) return 'es-ES';
      return 'en';
    }

    function stopSpeaking() {
      if (currentAudio) { currentAudio.pause(); currentAudio = null; }
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      const stopBtn = document.getElementById('float-stop-btn');
      if (stopBtn) stopBtn.style.display = 'none';
      const speakBtn = document.getElementById('float-speak-btn');
      if (speakBtn) speakBtn.style.display = 'inline-block';
      const searchSpeak = document.getElementById('speak-btn');
      if (searchSpeak) { searchSpeak.disabled = false; searchSpeak.textContent = '🔊 읽어주기'; }
    }

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
        utter.rate = 0.95;
        const preferred = voices.find(v => v.lang && v.lang.toLowerCase().startsWith(browserLang.slice(0, 2)));
        if (preferred) utter.voice = preferred;
        utter.onend = () => { if (stopBtn) stopBtn.style.display = 'none'; if (statusEl) statusEl.textContent = '재생 완료'; };
        window.speechSynthesis.speak(utter);
        if (statusEl) statusEl.textContent = '브라우저 음성으로 재생 중...';
        return true;
      } catch (e) {
        return false;
      }
    }

    async function speakText(text, btn) {
      if (!text) return;
      stopSpeaking();
      let detected = detectLang(text);
      if (detected === 'es') detected = 'es-ES';
      const ttsLang = (detected === 'es-ES') ? 'es-ES' : (detected === 'ko' ? 'ko' : (detected === 'ja' ? 'ja' : 'en'));
      const originalBtnText = btn ? btn.textContent : '🔊 읽어주기';
      if (btn) { btn.disabled = true; btn.textContent = '로딩 중...'; }
      const stopBtn = document.getElementById('float-stop-btn');
      if (stopBtn) stopBtn.style.display = 'inline-block';
      const statusEl = document.getElementById('float-status');
      if (statusEl) statusEl.textContent = '음성 준비 중...';

      let played = false;
      let lastErr = '';

      // Cost saving: browser TTS first (no API)
      played = await speakBrowserOnly(text, ttsLang, statusEl, stopBtn);

      if (!played) {
        const audioEl = new Audio();
        audioEl.setAttribute('playsinline', 'true');
        audioEl.preload = 'auto';
        audioEl.volume = 1.0;
        currentAudio = audioEl;
        try {
          const res = await fetch('/.netlify/functions/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: text.slice(0, 14000), voice_id: 'eve', language: ttsLang })
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
              const blob = new Blob([buf], { type: ct.includes('audio') ? ct : 'audio/mpeg' });
              const url = URL.createObjectURL(blob);
              audioEl.src = url;
              audioEl.onended = () => {
                URL.revokeObjectURL(url);
                currentAudio = null;
                if (stopBtn) stopBtn.style.display = 'none';
                if (statusEl) statusEl.textContent = '재생 완료';
              };
              try {
                await audioEl.play();
                played = true;
                if (statusEl) statusEl.textContent = '재생 중...';
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

      if (btn) { btn.disabled = false; btn.textContent = originalBtnText; }
      if (!played) {
        if (statusEl) statusEl.textContent = '음성 재생 실패. ' + lastErr;
        if (stopBtn) stopBtn.style.display = 'none';
      }
    }

    let mediaRecorder = null;
    let mediaStream = null;
    let audioChunks = [];
    let maxRecordTimer = null;
    let audioContext = null;
    let analyserNode = null;
    let silenceRaf = null;
    let hasHeardSpeech = false;

    function setFloatStatus(msg) {
      const el = document.getElementById('float-status');
      if (el) el.textContent = msg;
    }

    function closeFloatPanel() {
      document.getElementById('float-mic-panel').classList.remove('show');
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
        if (res.status === 404) throw new Error('STT function not found (404). Redeploy site.');
        throw new Error(data.error || ('STT ' + res.status));
      }
      return { text: (data.text || '').trim(), sttLang: data.language || null };
    }

    async function handleTranscript(text, sttLang) {
      if (!text) {
        setFloatStatus('음성을 인식하지 못했습니다. 다시 눌러 말하세요.');
        return;
      }
      let spokenLang = detectLang(text);
      if (spokenLang === 'en' && sttLang) {
        const sl = String(sttLang).toLowerCase();
        if (sl.startsWith('ko')) spokenLang = 'ko';
        else if (sl.startsWith('ja')) spokenLang = 'ja';
        else if (sl.startsWith('es')) spokenLang = 'es-ES';
      }
      const newLang = spokenLang === 'es-ES' ? 'es' : (spokenLang || 'en');
      if (newLang !== currentLang) {
        currentLang = newLang;
        localStorage.setItem('cf_lang', currentLang);
        const langSel = document.getElementById('lang-select');
        if (langSel) langSel.value = currentLang;
        applyI18n();
        if (typeof renderStamps === 'function') renderStamps();
      }
      let questionForGrok = text;
      if (spokenLang === 'ko' && !/[가-힣]/.test(text)) {
        questionForGrok = '[User spoke Korean; STT may be romanized] ' + text;
      } else if (spokenLang === 'ja' && !/[ぁ-んァ-ン]/.test(text)) {
        questionForGrok = '[User spoke Japanese; STT may be romanized] ' + text;
      }
      setFloatStatus('Q: ' + text);
      document.getElementById('float-answer').textContent = '로딩 중... 답변 생성 중';
      document.getElementById('float-speak-btn').style.display = 'none';
      const tasksBtn = document.getElementById('float-tasks-btn');
      if (tasksBtn) tasksBtn.style.display = 'none';
      const oldJump = document.getElementById('float-jump-btn');
      if (oldJump) oldJump.remove();

      const answer = await askGrok(questionForGrok);
      if (answer) showAnswerInPanel(text, answer);
      else {
        document.getElementById('float-answer').textContent = '답변을 받지 못했습니다.';
        setFloatStatus('다시 질문해 주세요.');
      }
    }

    function watchSilence(stream) {
      hasHeardSpeech = false;
      try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        analyserNode = audioContext.createAnalyser();
        analyserNode.fftSize = 512;
        source.connect(analyserNode);
        const data = new Uint8Array(analyserNode.frequencyBinCount);
        const SPEECH_THRESHOLD = 18;
        const SILENCE_MS = 1600;
        let silenceStarted = 0;
        const tick = () => {
          if (!isListening || !analyserNode) return;
          analyserNode.getByteFrequencyData(data);
          let sum = 0;
          for (let i = 0; i < data.length; i++) sum += data[i];
          const avg = sum / data.length;
          if (avg > SPEECH_THRESHOLD) {
            hasHeardSpeech = true;
            silenceStarted = 0;
            setFloatStatus('듣는 중... 말씀하세요');
          } else if (hasHeardSpeech) {
            if (!silenceStarted) silenceStarted = Date.now();
            else if (Date.now() - silenceStarted > SILENCE_MS) {
              setFloatStatus('로딩 중... 음성 인식');
              try { if (mediaRecorder && mediaRecorder.state === 'recording') mediaRecorder.stop(); } catch (e) {}
              return;
            }
          }
          silenceRaf = requestAnimationFrame(tick);
        };
        silenceRaf = requestAnimationFrame(tick);
      } catch (e) {}
    }

    async function startRecording() {
      const micBtn = document.getElementById('float-mic');
      document.getElementById('float-answer').textContent = '';
      document.getElementById('float-speak-btn').style.display = 'none';
      const tasksBtn = document.getElementById('float-tasks-btn');
      if (tasksBtn) tasksBtn.style.display = 'none';
      const oldJump = document.getElementById('float-jump-btn');
      if (oldJump) oldJump.remove();
      setFloatStatus('마이크 준비 중...');
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioChunks = [];
        const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : (MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : '');
        mediaRecorder = mime ? new MediaRecorder(mediaStream, { mimeType: mime }) : new MediaRecorder(mediaStream);
        mediaRecorder.ondataavailable = (e) => { if (e.data && e.data.size > 0) audioChunks.push(e.data); };
        mediaRecorder.onstop = async () => {
          isListening = false;
          const mic = document.getElementById('float-mic');
          if (mic) mic.classList.remove('listening');
          if (silenceRaf) { cancelAnimationFrame(silenceRaf); silenceRaf = null; }
          if (maxRecordTimer) { clearTimeout(maxRecordTimer); maxRecordTimer = null; }
          if (mediaStream) { mediaStream.getTracks().forEach(t => t.stop()); mediaStream = null; }
          try { if (audioContext) audioContext.close(); } catch (e) {}
          audioContext = null;
          if (!audioChunks.length) {
            setFloatStatus('녹음이 비었습니다. 다시 눌러 말하세요.');
            return;
          }
          const blob = new Blob(audioChunks, { type: (mediaRecorder && mediaRecorder.mimeType) || 'audio/webm' });
          mediaRecorder = null;
          setFloatStatus('로딩 중... 언어 자동 인식');
          try {
            const result = await transcribeWithXAI(blob);
            const text = (result && result.text) ? result.text : (typeof result === 'string' ? result : '');
            const sttLang = (result && result.sttLang) ? result.sttLang : null;
            await handleTranscript(text, sttLang);
          } catch (err) {
            console.error(err);
            setFloatStatus('음성 인식 실패: ' + (err.message || err));
          }
        };
        mediaRecorder.start(200);
        isListening = true;
        if (micBtn) micBtn.classList.add('listening');
        setFloatStatus('듣는 중... 말씀하세요 (끝나면 자동 인식)');
        watchSilence(mediaStream);
        maxRecordTimer = setTimeout(() => {
          if (mediaRecorder && mediaRecorder.state === 'recording') {
            setFloatStatus('로딩 중... 음성 인식');
            mediaRecorder.stop();
          }
        }, 20000);
      } catch (e) {
        isListening = false;
        setFloatStatus(e.name === 'NotAllowedError' ? '마이크 권한이 필요합니다.' : ('마이크 오류: ' + (e.message || e)));
      }
    }

    function toggleFloatMic() {
      const panel = document.getElementById('float-mic-panel');
      panel.classList.add('show');
      if (isListening) {
        setFloatStatus('로딩 중... 음성 인식');
        try {
          if (mediaRecorder && mediaRecorder.state === 'recording') mediaRecorder.stop();
        } catch (e) { stopFloatMic(true); }
        return;
      }
      stopFloatMic(true);
      startRecording();
    }

    function openFloatPanelOnly() {
      document.getElementById('float-mic-panel').classList.add('show');
      setFloatStatus('말하거나 아래에 입력하세요 (언어 자동 인식)');
    }
