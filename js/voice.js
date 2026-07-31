/* Conroy's Training App - voice module v1.14.6 */
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

Your job is to teach BRAND-NEW employees so they can follow the app and BMS without asking anyone else.

You are also a BMS expert who stands next to the new employee and diagnoses problems in the shop.

CRITICAL ANSWER STYLE (MUST FOLLOW):
- Always assume the employee has NEVER used BMS before.
- Always use numbered steps only (1. 2. 3.). Never give short summaries.
- Always say exactly WHERE to click (left menu name, top counter, button name).
- Never say just "Check Messages". Always give the full location and action.

WHEN THE EMPLOYEE IS STUCK (order missing, wrong status, cannot find something):
Do NOT only recite the normal happy-path manual steps.
Instead think like a BMS expert and give a diagnostic sequence:
1. Start from the physical shop first (finished product area, design table, look for the White Sheet, look at the Small Ticket).
2. Then check BMS screens in this order: Messages → In Wire → search by order number from the Small Ticket → check Order Status.
3. Explain what each status means and what the employee should do next.
4. Speak as if you are standing next to them and guiding their hands.

Other rules:
- After each main step, briefly say what the screen will look like or what counter changes.
- When relevant, tell the employee which training image to look at (superticket.jpg, attachments.jpg, cash.jpg, cooler_vase.jpg, funeral.jpg, shop_gate.jpg).
- End with the next concrete action they should take.
- Use plain text only. No markdown, no bold, no dashes. Only numbered steps.

LANGUAGE RULE:
- Detect the language of the question. Answer 100% in that language (Korean Hangul, Japanese, Spanish, or English). Never mix.
- Official sales/phone scripts must stay in exact English wording from the manuals.

If information is not in the manuals below, still try to give practical diagnostic help first. Only if truly unknown say: "매뉴얼에 없는 내용입니다. 매니저에게 확인하세요."

=== GOLDEN RULES ===
1. Always prioritize orders by Due Time.
2. Never design without a printed SuperTicket.
3. Do not complete an order until all work (design + attachments) is finished.
4. Always send Delivery Attempted before changing a delivery date.
5. If unsure, ask a manager first.

=== BMS BASIC NAVIGATION ===
Shop Code: S0940000
After login you see the Home screen.
Left side menu has: Messages, In Wire, To Be Designed, Awaiting Delivery, Start Day / End Day, and other sections.
Top area shows counters (Messages, In Wire, etc.). When a number goes up, that section needs attention.
Register 1 is used for Auto-Print of SuperTicket. Only one computer should use Register 1.

=== HOW TO MONITOR ORDERS ===
1. Look at the top of BMS. If the Messages counter number increases, a new Wire-In order arrived.
2. Click Messages on the left menu.
3. Open the new message and read the order details.
4. Click Mark Read.
5. Click In Wire on the left menu.
6. Review the order and click Accept. (Never click Reject without manager approval.)
7. When you click Accept, two things happen automatically: the order moves to To Be Designed, and the SuperTicket prints (if on Register 1).
8. Take the printed SuperTicket to the design table.

=== START DAY (cash) ===
1. On BMS Home click Start Day / End Day.
2. Click Open Cash Drawer. Password is 123456.
3. Enter the QUANTITY of each bill and coin (not the dollar total).
4. Total must equal exactly $200.00.
5. If it is not $200.00: take a photo of the cash, send to (213) 610-1004, then continue WITHOUT changing the numbers.
Look at cash.jpg for the cash drawer example.

=== END DAY ===
1. Leave exactly $200.00 in the drawer.
2. Print the Summary Receipt.
3. Put all cash over $200.00 into the deposit envelope.
4. Write Date, Employee Name, Cash Sales, Drop amount. Seal and put in the safe.
5. Click End Register Session and exit BMS.

=== SUPERTICKET ===
This is the main production paper. It has Recipient info, White Sheet (full details + Special Instructions), and Small Ticket.
Never start designing without the printed SuperTicket.
Keep the White Sheet attached until every attachment is checked and attached.
Look at superticket.jpg for the example.

=== ATTACHMENTS ===
1. Look at the White Sheet Product Detail section.
2. Check for Balloons, Chocolates, Plush, CardIsle cards, or other gifts.
3. Do not remove the White Sheet until everything is verified and physically attached.
4. For CardIsle: find PickupCodeID in Special Instructions → go to cardisle.com → enter code → Preview → Print.
5. Match the code on the back of the printed card with the PickupCodeID before attaching.
Look at attachments.jpg for visual reference.

=== DELIVERY ===
Standard (not funeral): Provider = Walmart GoLocal, 3 Hour window, choose earliest available time, then Set Trip as Out for Delivery.
Funeral: Provider = Uber, ASAP. When the driver arrives, explain how to transport and ask them to take a confirmation photo after setup.
Look at funeral.jpg when explaining funeral flow.

=== SALES SCRIPTS (exact English) ===
Greeting: "Welcome! How can I help you today?"
Needs question: "Who's going to receive the flowers?"
Colors: Romance = Red/Hot Pink, Family = Light Pink, Friends/Get Well = Bright Colors, Sympathy = White/Soft Pastels.
Sizes: Small $40-60, Medium $60-80 (recommend this first), Large from $100.
Never ask "What is the occasion?"

=== DAILY PRIORITY ===
1. Walk-in customer (stop everything and greet)
2. Phone call
3. Shop work / Messages / design

=== COOLER ===
Check water, change cloudy water, remove damaged flowers, re-cut stems about 0.5 inch.
Keep the cooler clean and full looking. Look at cooler_vase.jpg and cooler_loose.jpg.`;

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

    async function doSearch() {
      const q = document.getElementById('search-input').value.trim();
      if (!q) return;
      const box = document.getElementById('search-results');
      box.innerHTML = `<div class="alert alert-info">검색 중...</div>`;
      const grokAnswer = await askGrok(q);
      if (grokAnswer) {
        const cleanAnswer = grokAnswer.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1').replace(/^#+\s*/gm, '').replace(/^\s*[-•]\s*/gm, '');
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
      if (statusEl) statusEl.textContent = '로딩 중... 음성 파일 준비';

      let played = false;
      let lastErr = '';
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

      if (!played && window.speechSynthesis) {
        try {
          window.speechSynthesis.cancel();
          const voices = await waitForVoices();
          const utter = new SpeechSynthesisUtterance(text);
          const browserLang = ttsLang === 'ko' ? 'ko-KR' : ttsLang === 'ja' ? 'ja-JP' : ttsLang === 'es-ES' ? 'es-ES' : 'en-US';
          utter.lang = browserLang;
          utter.rate = 0.95;
          const preferred = voices.find(v => v.lang && v.lang.toLowerCase().startsWith(browserLang.slice(0, 2)));
          if (preferred) utter.voice = preferred;
          utter.onend = () => { if (stopBtn) stopBtn.style.display = 'none'; };
          window.speechSynthesis.speak(utter);
          played = true;
          if (statusEl) statusEl.textContent = '브라우저 음성으로 재생 중...';
        } catch (e2) {
          lastErr = (lastErr ? lastErr + ' | ' : '') + 'browser TTS';
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
        renderStamps();
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

      const answer = await askGrok(questionForGrok);
      if (answer) {
        const clean = answer.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1').replace(/^#+\s*/gm, '');
        window._lastGrokAnswer = clean;
        document.getElementById('float-answer').textContent = clean;
        document.getElementById('float-speak-btn').style.display = 'inline-block';
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
