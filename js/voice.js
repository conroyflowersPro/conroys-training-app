/* Conroy's Training App - auto-split for reliable GitHub deploy */
// ========== API KEY & GROK ==========
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
      const systemPrompt = `You are the official training assistant for Conroy's Flowers (Shop Code S0940000) Floral Sales Representatives. 
Answer ONLY using the information from the official Conroy's manuals below. Do not use general floral knowledge. 
If the information is not in the manuals, clearly say "매뉴얼에 없는 내용입니다. 매니저에게 확인하세요." 
Be concise, step-by-step, practical.
CRITICAL LANGUAGE RULE: Detect the language of the user's question by looking at the script.
If the question contains Korean Hangul (한글), you MUST answer 100% in Korean. Never answer in English when the question is Korean.
If Japanese kana/kanji → answer in Japanese. If Spanish → Spanish. If English → English.
If the user says "일본어로 말해줘" / "in Japanese" / "en español", switch to that language.
Do not mix languages. Do not translate Korean questions into English answers.
CONTEXT AWARE: You may receive current time and the employee's next incomplete task. Use this to give practical "what should I do now" advice (e.g. after arriving at work → Start Day cash count, cooler check, then monitor Messages).
IMPORTANT: Use plain text only. Never use markdown formatting such as **bold**, *italic*, # headings, or bullet symbols like - or *. Write in simple sentences or numbered steps (1. 2. 3.).
SCRIPTS RULE: When quoting sales or phone scripts from the manuals, always show the exact English wording from the manual. Do not shorten, paraphrase, or translate the official scripts.

=== GOLDEN RULES ===
1. Always prioritize orders based on Due Time.
2. Never begin designing an arrangement without a printed design ticket (SuperTicket).
3. Do not complete an order until all required work has been finished.
4. Always send a Delivery Attempted message before changing the delivery date of an order.
5. If you are unsure how to proceed, contact a manager before taking action.

=== BMS LOGIN ===
Shop Code: S0940000
Username & Password: Assigned by Management
Register 1 must be used for Auto-Print of SuperTicket. Only one workstation should use Register 1.

=== START DAY ===
Home → Start Day / End Day → Open Cash Drawer (password 123456).
Enter the QUANTITY of each denomination (not the dollar amount).
Start Day Amount must always equal $200.00.
If cash does not equal $200.00: take a photo, send to (213) 610-1004, and continue WITHOUT adjustment.
Never adjust the cash count to match the expected amount.

=== END DAY ===
Leave exactly $200.00 in the cash drawer.
Print the Summary Receipt.
Place all cash over $200.00 in the deposit envelope.
Write Date, Employee Name, Cash Sales, and Drop on the envelope, seal it, put in the safe.
Then click End Register Session and exit BMS.

=== ORDER FLOW (Wire-In) ===
Messages counter increases when Wire-In arrives.
1. Open Messages → review details → click Mark Read
2. Go to In Wire → review → click Accept (Never click Reject without manager approval)
3. Order moves to To Be Designed + SuperTicket auto-prints (if Register 1)
4. After design + attachments verified → Set As Awaiting Delivery/Pick-up
5. Create Delivery Trip

=== SUPERTICKET ===
Primary production document. Contains Recipient Information, White Sheet (full production info + Special Instructions), and Small Ticket.
Never design without the printed SuperTicket.
White Sheet stays attached until ALL attachments are verified and attached.

=== ATTACHMENTS ===
Check Product Detail on White Sheet for: Balloons, Chocolates, Plush, CardIsle Greeting Cards, other gifts.
If attachments required: do NOT remove White Sheet until everything is verified and attached.
CardIsle: Find PickupCodeID in Special Instructions or BMS → go to cardisle.com → enter code → Preview → Print.
After printing, match the code on the back of the card with PickupCodeID before attaching.
1800Flowers CardIsle: $5.99 / In-Store: $6.99

=== DELIVERY ===
Standard (non-funeral): Provider = Walmart GoLocal, 3Hr Delivery Window, choose earliest available, Set Trip as Out for Delivery.
Funeral: Provider = Uber, ASAP. When driver arrives, explain transport and instruct to take confirmation photo after setup.

=== SALES & CUSTOMER SERVICE ===
Greeting: "Welcome! How can I help you today?"
Ask only: "Who's going to receive the flowers?" to understand relationship and recommend color scheme.
Color schemes:
- Romance → Red / Hot Pink
- Family → Light Pink
- Friends / Get Well → Bright Colors
- Sympathy → White / Soft Pastels
Size recommendation (present price last):
- Small ($40–60): desk or side table
- Medium ($60–80): standard recommendation
- Large (from $100): milestone events, centerpiece
Never ask "What is the occasion?" – the card message usually tells the occasion.
Enter card message exactly as provided. Do not change spelling or grammar.
Order types: Delivery, Carry-Out, QuickSale, Wire-Out.
Wire-Out: Customer selects from 1800Flowers product guide. No discounts. Always call the receiving florist first to confirm product, date, and fee before sending via BloomLink.

=== DAILY ROUTINE PRIORITY ===
1. Walk-in customer
2. Phone call
3. Shop operations / prep work
Always pause other tasks immediately when a customer walks in or the phone rings.

=== COOLER ===
Check water level, replace cloudy water, remove damaged flowers, re-cut stems ~0.5 inch when changing water.
Keep cooler clean, organized, and visually attractive.`;

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
            max_tokens: 800
          })
        });
        if (!res.ok) {
          const err = await res.text();
          console.error('ask function error', err);
          let detail = err;
          try { detail = JSON.parse(err).error || err; } catch (_) {}
          return '서버 오류 (' + res.status + '): ' + (detail || 'Functions 응답 실패. Netlify에 XAI_API_KEY 환경변수가 있는지, 재배포했는지 확인하세요.');
        }
        const data = await res.json();
        if (data.error) {
          return 'API 오류: ' + (typeof data.error === 'string' ? data.error : JSON.stringify(data.error));
        }
        return data.choices?.[0]?.message?.content || '답변을 받지 못했습니다.';
      } catch (e) {
        console.error(e);
        return '네트워크/Functions 오류: ' + (e.message || e) + ' — /.netlify/functions/ask 가 배포됐는지 확인하세요.';
      }
    }

    const originalDoSearch = typeof doSearch === 'function' ? doSearch : null;
    async function doSearch() {
      const q = document.getElementById('search-input').value.trim();
      if (!q) return;
      const box = document.getElementById('search-results');
      box.innerHTML = `<div class="alert alert-info">검색 중...</div>`;

      const grokAnswer = await askGrok(q);
      if (grokAnswer) {
        const cleanAnswer = grokAnswer
          .replace(/\*\*(.*?)\*\*/g, '$1')
          .replace(/\*(.*?)\*/g, '$1')
          .replace(/^#+\s*/gm, '')
          .replace(/^\s*[-•]\s*/gm, '');
        window._lastGrokAnswer = cleanAnswer;
        box.innerHTML = `
          <div class="result-item" style="background:#f0f7f2;border-radius:12px;padding:14px;margin-bottom:12px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
              <strong>🤖 Grok 답변</strong>
              <button class="btn btn-sm" id="speak-btn" onclick="speakText(window._lastGrokAnswer, this)">🔊 읽어주기</button>
            </div>
            <p style="font-size:0.95rem;margin-top:4px;white-space:pre-wrap">${cleanAnswer}</p>
          </div>`;
        logQuestion(q);
        return;
      }

      const ql = q.toLowerCase();
      const results = knowledge.filter(k => k.keys.some(key => key.includes(ql) || ql.includes(key)));
      if (results.length === 0) {
        box.innerHTML = `<div class="alert alert-info">${currentLang==='ko'?'결과가 없습니다. API Key를 등록하면 Grok이 답변합니다.':'No local results. Add API Key for Grok answers.'}</div>`;
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

    // ========== CONTEXT + LANGUAGE ==========
    function buildUserMessage(question) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
      const next = getNextTask();
      const nextTitle = next ? (next.title.ko + ' / ' + next.title.en) : '모든 루틴 완료';
      let doneList = routineTasks.filter(t => stamps[t.id]?.done).map(t => t.title.ko).join(', ') || '없음';
      const qLang = detectLang(question);
      return `Current time: ${timeStr}. Next incomplete task: ${nextTitle}. Already completed today: ${doneList}.
Detected question language: ${qLang}. You MUST answer entirely in this language (${qLang === 'ko' ? 'Korean' : qLang === 'ja' ? 'Japanese' : qLang === 'es-ES' ? 'Spanish' : 'English'}).
If detected language is ko, write every sentence in Korean Hangul. Do not answer in English.
Question: ${question}`;
    }

    // ========== TEXT TO SPEECH (xAI natural voice first) ==========
    let currentAudio = null;

    function detectLang(text) {
      if (!text) return 'en';
      const s = String(text);
      const hangul = (s.match(/[가-힣]/g) || []).length;
      const kana = (s.match(/[ぁ-んァ-ン]/g) || []).length;
      if (hangul >= 1) return 'ko';
      if (kana >= 1) return 'ja';
      if (/[áéíóúñü¿¡]/i.test(s) || /\b(el|la|de|que|y|en|un|una|es|por|para|gracias)\b/i.test(s)) return 'es-ES';
      return 'en';
    }

    function stopSpeaking() {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
      }
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      const stopBtn = document.getElementById('float-stop-btn');
      if (stopBtn) stopBtn.style.display = 'none';
      const speakBtn = document.getElementById('float-speak-btn');
      if (speakBtn) speakBtn.style.display = 'inline-block';
      const searchSpeak = document.getElementById('speak-btn');
      if (searchSpeak) {
        searchSpeak.disabled = false;
        searchSpeak.textContent = '🔊 읽어주기';
      }
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

    async function speakText(text, btn) {
      if (!text) return;
      stopSpeaking();
      let detected = detectLang(text);
      if (detected === 'es') detected = 'es-ES';
      const ttsLang = (detected === 'es-ES') ? 'es-ES' : (detected === 'ko' ? 'ko' : (detected === 'ja' ? 'ja' : 'en'));
      const originalBtnText = btn ? btn.textContent : '🔊 읽어주기';
      if (btn) {
        btn.disabled = true;
        btn.textContent = '로딩 중...';
      }
      const stopBtn = document.getElementById('float-stop-btn');
      if (stopBtn) stopBtn.style.display = 'inline-block';
      const statusEl = document.getElementById('float-status');
      if (statusEl) statusEl.textContent = '로딩 중... 음성 파일 준비';

      let played = false;
      let lastErr = '';

      const audioEl = new Audio();
      audioEl.setAttribute('playsinline', 'true');
      audioEl.preload = 'auto';
      currentAudio = audioEl;

      try {
        const res = await fetch('/.netlify/functions/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: text.slice(0, 14000),
            voice_id: 'eve',
            language: ttsLang
          })
        });
        if (res.ok) {
          const buf = await res.arrayBuffer();
          if (buf && buf.byteLength > 100) {
            const blob = new Blob([buf], { type: res.headers.get('content-type') || 'audio/mpeg' });
            const url = URL.createObjectURL(blob);
            audioEl.src = url;
            audioEl.onended = () => {
              URL.revokeObjectURL(url);
              currentAudio = null;
              if (stopBtn) stopBtn.style.display = 'none';
              if (statusEl) statusEl.textContent = '재생 완료';
            };
            audioEl.onerror = () => {
              lastErr = 'audio element error';
            };
            try {
              await audioEl.play();
              played = true;
              if (statusEl) statusEl.textContent = '재생 중...';
            } catch (playErr) {
              lastErr = 'play blocked: ' + (playErr.message || playErr);
              console.warn(lastErr);
            }
          } else {
            lastErr = 'empty audio body';
          }
        } else {
          const errText = await res.text().catch(() => '');
          lastErr = 'TTS ' + res.status + ' ' + errText.slice(0, 120);
          console.warn(lastErr);
        }
      } catch (e) {
        lastErr = 'TTS fetch: ' + (e.message || e);
        console.warn(lastErr);
      }

      if (!played && window.speechSynthesis) {
        try {
          window.speechSynthesis.cancel();
          const voices = await waitForVoices();
          const utter = new SpeechSynthesisUtterance(text);
          const browserLang = ttsLang === 'ko' ? 'ko-KR' : ttsLang === 'ja' ? 'ja-JP' : ttsLang === 'es-ES' ? 'es-ES' : 'en-US';
          utter.lang = browserLang;
          utter.rate = 0.95;
          const prefix = browserLang.slice(0, 2);
          const preferred = voices.find(v => v.lang && v.lang.toLowerCase().startsWith(prefix));
          if (preferred) utter.voice = preferred;
          utter.onend = () => { if (stopBtn) stopBtn.style.display = 'none'; };
          utter.onerror = (ev) => { console.warn('utter error', ev); };
          window.speechSynthesis.speak(utter);
          played = true;
          if (statusEl) statusEl.textContent = '브라우저 음성으로 재생 중...';
        } catch (e2) {
          lastErr = (lastErr ? lastErr + ' | ' : '') + 'browser TTS: ' + (e2.message || e2);
        }
      }

      if (btn) {
        btn.disabled = false;
        btn.textContent = originalBtnText;
      }
      if (!played) {
        if (statusEl) statusEl.textContent = '음성 재생 실패. 볼륨/무음 모드 확인. ' + lastErr;
        if (stopBtn) stopBtn.style.display = 'none';
      }
    }

    // ========== FLOATING MIC ==========
    let mediaRecorder = null;
    let mediaStream = null;
    let audioChunks = [];
    let silenceTimer = null;
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
      if (silenceTimer) { clearTimeout(silenceTimer); silenceTimer = null; }
      if (maxRecordTimer) { clearTimeout(maxRecordTimer); maxRecordTimer = null; }
      if (silenceRaf) { cancelAnimationFrame(silenceRaf); silenceRaf = null; }
      try {
        if (!cancelOnly && mediaRecorder && mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        } else if (mediaRecorder && mediaRecorder.state === 'recording') {
          mediaRecorder.onstop = null;
          mediaRecorder.stop();
        }
      } catch (e) {}
      mediaRecorder = null;
      if (mediaStream) {
        mediaStream.getTracks().forEach(t => t.stop());
        mediaStream = null;
      }
      try { if (audioContext) audioContext.close(); } catch (e) {}
      audioContext = null;
      analyserNode = null;
      try {
        if (recognition) {
          recognition.onresult = null;
          recognition.onend = null;
          recognition.onerror = null;
          recognition.abort();
        }
      } catch (e) {}
      recognition = null;
    }

    function blobToBase64(blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = reader.result || '';
          resolve(String(dataUrl).split(',')[1] || '');
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }

    async function transcribeWithXAI(blob) {
      const base64 = await blobToBase64(blob);
      const res = await fetch('/.netlify/functions/stt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audio: base64, contentType: blob.type || 'audio/webm' })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('Voice STT function not found (404). Redeploy the site so /.netlify/functions/stt is live.');
        }
        throw new Error(data.error || ('STT ' + res.status));
      }
      return (data.text || '').trim();
    }

    async function handleTranscript(text) {
      if (!text) {
        setFloatStatus('음성을 인식하지 못했습니다. 다시 눌러 말하세요.');
        return;
      }
      const spokenLang = detectLang(text);
      if (spokenLang === 'ko' || spokenLang === 'ja' || spokenLang === 'es-ES') {
        currentLang = spokenLang === 'es-ES' ? 'es' : spokenLang;
        applyI18n();
        renderStamps();
      }
      setFloatStatus('Q: ' + text);
      document.getElementById('float-answer').textContent = '로딩 중... 답변 생성 중';
      document.getElementById('float-speak-btn').style.display = 'none';

      const answer = await askGrok(text);
      if (answer) {
        const clean = answer.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1').replace(/^#+\s*/gm, '');
        window._lastGrokAnswer = clean;
        if (detectLang(clean) === 'ko') currentLang = 'ko';
        document.getElementById('float-answer').textContent = clean;
        document.getElementById('float-speak-btn').style.display = 'inline-block';
        // TTS only when user taps "읽어주기" (no auto-play)
        setFloatStatus('Q: ' + text + ' · 🔊 읽어주기 버튼을 누르세요');
      } else {
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
              try {
                if (mediaRecorder && mediaRecorder.state === 'recording') mediaRecorder.stop();
              } catch (e) {}
              return;
            }
          }
          silenceRaf = requestAnimationFrame(tick);
        };
        silenceRaf = requestAnimationFrame(tick);
      } catch (e) {
        console.warn('Silence detect unavailable', e);
      }
    }

    async function startRecording() {
      const micBtn = document.getElementById('float-mic');
      document.getElementById('float-answer').textContent = '';
      document.getElementById('float-speak-btn').style.display = 'none';
      setFloatStatus('마이크 준비 중...');
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioChunks = [];
        const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : (MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : '');
        mediaRecorder = mime ? new MediaRecorder(mediaStream, { mimeType: mime }) : new MediaRecorder(mediaStream);
        mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) audioChunks.push(e.data);
        };
        mediaRecorder.onstop = async () => {
          isListening = false;
          const mic = document.getElementById('float-mic');
          if (mic) mic.classList.remove('listening');
          if (silenceRaf) { cancelAnimationFrame(silenceRaf); silenceRaf = null; }
          if (maxRecordTimer) { clearTimeout(maxRecordTimer); maxRecordTimer = null; }
          if (mediaStream) {
            mediaStream.getTracks().forEach(t => t.stop());
            mediaStream = null;
          }
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
            const text = await transcribeWithXAI(blob);
            await handleTranscript(text);
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
        } catch (e) {
          stopFloatMic(true);
        }
        return;
      }

      stopFloatMic(true);
      startRecording();
    }
