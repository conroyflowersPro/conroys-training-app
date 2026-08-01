/* voice.js v5.0.2 */
/* Conroy's Training App - voice module 5.0.2
   coach box in dock, sales-priority titles, short speech + detail box
*/
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
      if (/customer|손님|greeting|인사|color|색상|size|사이즈|romance|sympathy|needs|니즈|가이드|guide|스크립트|script|walk-?in|응대|sales|세일즈|medium|large|suggest|제안|occasion|카드\s*메시지|card\s*message/.test(text)) {
        return {
          type: 'page', id: 'customer',
          label: { ko: '세일즈 가이드', en: 'Sales Guide', ja: 'セールスガイド', es: 'Guía de ventas' },
          summary: { ko: 'Medium부터 제안하고, 카드 메시지로 니즈를 읽으세요.', en: 'Lead with Medium. Read needs from the card message.', ja: 'Mediumから提案。カード文からニーズを読む。', es: 'Empiece con Medium. Lea necesidades del mensaje de la tarjeta.' }
        };
      }
      if (/attach|첨부|cardisle|balloon|풍선|chocolate|초콜릿|plush|인형|white\s*sheet|product\s*detail|awaiting\s*delivery/.test(text)) {
        return { type: 'content', id: 'attachments', label: { ko: '첨부물 가이드', en: 'Attachments guide', ja: '添付物ガイド', es: 'Guía de adjuntos' }, summary: { ko: 'White Sheet가 끝날 때까지 첨부물을 완료하세요.', en: 'Finish attachments until White Sheet is clear.', ja: 'White Sheetが終わるまで添付物を完了。', es: 'Complete adjuntos hasta que White Sheet esté listo.' } };
      }
      if (/deliver|배달|配達|entrega|uber|golocal|walmart|3hr|asap\s*trip|out\s*for\s*delivery/.test(text)) {
        return { type: 'content', id: 'delivery', label: { ko: '배달 가이드', en: 'Delivery guide', ja: '配達ガイド', es: 'Guía de entrega' }, summary: { ko: '표준은 Walmart GoLocal 3Hr, 장례는 Uber ASAP.', en: 'Standard: Walmart GoLocal 3Hr. Funeral: Uber ASAP.', ja: '標準はWalmart GoLocal 3Hr、葬儀はUber ASAP。', es: 'Estándar: Walmart GoLocal 3Hr. Funeral: Uber ASAP.' } };
      }
      if (/bms|workflow|super\s*ticket|superticket|accept|reject|in\s*wire|mark\s*read|design\s*ticket/.test(text)) {
        return { type: 'content', id: 'bmsflow', label: { ko: 'BMS 흐름', en: 'BMS workflow', ja: 'BMSフロー', es: 'Flujo BMS' }, summary: { ko: 'Mark Read → In Wire → Accept → SuperTicket.', en: 'Mark Read → In Wire → Accept → SuperTicket.', ja: 'Mark Read → In Wire → Accept → SuperTicket。', es: 'Mark Read → In Wire → Accept → SuperTicket.' } };
      }
      if (/message|messages|wire\s*in|funeral|긴급|funeral\s*order/.test(text)) {
        return { type: 'page', id: 'messages', label: { ko: 'Messages', en: 'Messages', ja: 'Messages', es: 'Messages' }, summary: { ko: 'Messages에서 Mark Read 후 In Wire 처리하세요.', en: 'Mark Read in Messages, then process In Wire.', ja: 'MessagesでMark Read後、In Wire処理。', es: 'Mark Read en Messages, luego procese In Wire.' } };
      }
      if (/golden|rule|due\s*time|매니저|manager\s*first|확신/.test(text)) {
        return { type: 'content', id: 'golden', label: { ko: 'Golden Rules', en: 'Golden Rules', ja: 'Golden Rules', es: 'Golden Rules' }, summary: { ko: 'Due Time 우선. 확신이 없으면 매니저에게 먼저 물어보세요.', en: 'Prioritize by Due Time. If unsure, ask a manager first.', ja: 'Due Time優先。確信がなければマネージャーに先に聞く。', es: 'Priorice por Due Time. Si no está seguro, pregunte al gerente primero.' } };
      }
      if (/phone|전화|電話|teléfono|hold|홀드|on\s*hold/.test(text)) {
        return { type: 'page', id: 'phone', label: { ko: 'Phone Script', en: 'Phone Script', ja: 'Phone Script', es: 'Phone Script' }, summary: { ko: '카드 메시지를 먼저 받고, Medium부터 제안하세요.', en: 'Take the card message first, then lead with Medium.', ja: 'カード文を先に受け取り、Mediumから提案。', es: 'Tome el mensaje de la tarjeta primero, luego ofrezca Medium.' } };
      }
      if (/unsure|모르겠|decision|어떻게\s*하|what\s*should|매니저한테|ask\s*manager/.test(text)) {
        return { type: 'content', id: 'decision', label: { ko: '모르겠을 때', en: 'If unsure', ja: '迷ったとき', es: 'Si no está seguro' }, summary: { ko: 'Golden Rule #5: 확신이 없으면 매니저에게 먼저 물어보세요.', en: 'Golden Rule #5: If unsure, ask a manager first.', ja: 'Golden Rule #5: 確信がなければマネージャーに先に聞く。', es: 'Golden Rule #5: Si no está seguro, pregunte al gerente primero.' } };
      }
      if (/start\s*day|end\s*day|cash|현금|드로어|drawer|\$200|200\.00|루틴|routine/.test(text)) {
        return { type: 'page', id: 'home', label: { ko: '오늘 루틴', en: 'Today routine', ja: '今日のルーティン', es: 'Rutina de hoy' }, summary: { ko: '다음 미완료 루틴을 확인하고 순서대로 진행하세요.', en: 'Check the next incomplete routine and proceed in order.', ja: '次の未完了ルーティンを確認して順番に進める。', es: 'Revise la siguiente rutina incompleta y avance en orden.' } };
      }
      return null;
    }

    function goToRelatedSection(section) {
      if (!section) return;
      if (section.type === 'content' && typeof showContent === 'function') {
        showContent(section.id);
      } else if (section.type === 'page' && typeof showPage === 'function') {
        try { closeFloatPanel(); } catch (e) {}
        showPage(section.id);
      } else if (section.type === 'task' && typeof showTaskDetail === 'function') {
        showTaskDetail(section.id);
      }
    }

    function buildRemainingTasksText() {
      const lang = currentLang || 'en';
      let next = null;
      if (typeof getNextTask === 'function') {
        try { next = getNextTask(); } catch (e) { next = null; }
      }
      if (!next && typeof routineTasks !== 'undefined') {
        const pending = routineTasks.filter(t => !stamps[t.id]?.done);
        next = pending.length ? pending[0] : null;
      }
      if (!next) {
        return {
          ko: '오늘 남은 할 일이 없습니다. 모든 루틴을 완료했습니다.',
          en: 'No remaining tasks today. All routines are done.',
          ja: '今日の残りのタスクはありません。すべて完了です。',
          es: 'No quedan tareas hoy. Todas las rutinas están hechas.'
        }[lang] || 'No remaining tasks today.';
      }
      const title = (next.title && (next.title[lang] || next.title.en)) || next.id;
      return {
        ko: '다음 할 일은 ' + title + '입니다.',
        en: 'Next: ' + title + '.',
        ja: '次は' + title + 'です。',
        es: 'Siguiente: ' + title + '.'
      }[lang] || ('Next: ' + title + '.');
    }

    function speakRemainingTasks(btn) {
      const text = buildRemainingTasksText();
      window._lastGrokAnswer = text;
      speakText(text, btn);
    }

    function removeCoachBox() {
      const old = document.getElementById('float-coach-box');
      if (old) old.remove();
      const oldJump = document.getElementById('float-jump-btn');
      if (oldJump) oldJump.remove();
    }

    function showCoachBox(section) {
      removeCoachBox();
      if (!section) return;
      const L = currentLang || 'en';
      const title = (section.label && (section.label[L] || section.label.en)) || 'Guide';
      const summary = (section.summary && (section.summary[L] || section.summary.en)) || '';
      const detailLbl = ({ ko: '자세히 보기', en: 'See details', ja: '詳細を見る', es: 'Ver detalles' })[L] || 'See details';
      const box = document.createElement('div');
      box.id = 'float-coach-box';
      box.className = 'coach-box';
      box.innerHTML =
        '<div class="coach-box-title">🏷️ ' + title + '</div>' +
        (summary ? '<div class="coach-box-summary">' + summary + '</div>' : '') +
        '<button type="button" class="btn btn-sm" id="float-coach-detail-btn">' + detailLbl + '</button>';
      const messages = document.getElementById('grok-messages');
      if (messages) {
        messages.appendChild(box);
        messages.scrollTop = messages.scrollHeight;
      }
      const detailBtn = document.getElementById('float-coach-detail-btn');
      if (detailBtn) {
        detailBtn.onclick = function () {
          goToRelatedSection(window._lastRelatedSection);
        };
      }
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
      removeCoachBox();
      const section = detectRelatedSection(question, clean);
      window._lastRelatedSection = section;
      if (section) {
        const lbl = (section.label && (section.label[currentLang] || section.label.en)) || 'Guide';
        setFloatStatus((question ? 'Q: ' + question + ' · ' : '') + '🏷️ ' + lbl);
        showCoachBox(section);
      } else {
        setFloatStatus((question ? 'Q: ' + question + ' · ' : '') + '🔊 Read · 📋 Tasks');
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
      if (typeof setAppLanguage === 'function') setAppLanguage(newLang);
      else if (newLang !== currentLang) {
        currentLang = newLang;
        localStorage.setItem('cf_lang', currentLang);
        applyI18n();
        if (typeof renderStamps === 'function') renderStamps();
      }
      setFloatStatus('Q: ' + q);
      document.getElementById('float-answer').textContent = 'Loading answer...';
      document.getElementById('float-speak-btn').style.display = 'none';
      const tasksBtn = document.getElementById('float-tasks-btn');
      if (tasksBtn) tasksBtn.style.display = 'none';
      if (typeof removeCoachBox === 'function') removeCoachBox();
      else {
        const oldJump = document.getElementById('float-jump-btn');
        if (oldJump) oldJump.remove();
        const oldBox = document.getElementById('float-coach-box');
        if (oldBox) oldBox.remove();
      }
      const answer = await askGrok(q);
      if (answer) {
        showAnswerInPanel(q, answer);
        if (typeof appendGrokMessage === 'function') {
          appendGrokMessage(q, 'user');
          appendGrokMessage(answer, 'bot');
        }
        if (typeof speakText === 'function') {
          setTimeout(function () {
            try { speakText(answer, null); } catch (e) { console.warn('auto-speak', e); }
          }, 300);
        }
      }
      else {
        document.getElementById('float-answer').textContent = 'No answer received.';
        setFloatStatus('Please try again.');
      }
    }

    async function doSearch() {
      const q = document.getElementById('search-input').value.trim();
      if (!q) return;
      const box = document.getElementById('search-results');
      box.innerHTML = '<div class="alert alert-info">Searching...</div>';
      const detected = detectLang(q);
      const newLang = detected === 'es-ES' ? 'es' : detected;
      if (typeof setAppLanguage === 'function') setAppLanguage(newLang);
      const grokAnswer = await askGrok(q);
      if (grokAnswer) {
        const cleanAnswer = grokAnswer.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1').replace(/^#+\s*/gm, '').replace(/^\s*[-•]\s*/gm, '');
        window._lastGrokAnswer = cleanAnswer;
        const section = detectRelatedSection(q, cleanAnswer);
        window._lastRelatedSection = section;
        let jumpBtn = '';
        if (section) {
          const lbl = (section.label && (section.label[currentLang] || section.label.en)) || 'Guide';
          jumpBtn = '<button class="btn btn-sm" style="margin-top:10px;width:100%" onclick="goToRelatedSection(window._lastRelatedSection)">📖 ' + lbl + '</button>';
        }
        box.innerHTML = '<div class="result-item" style="background:#f0f7f2;border-radius:12px;padding:14px;margin-bottom:12px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:6px"><strong>🤖 Grok</strong><div style="display:flex;gap:6px;flex-wrap:wrap"><button class="btn btn-sm" id="speak-btn" onclick="speakText(window._lastGrokAnswer, this)">🔊 Read</button><button class="btn btn-sm btn-outline" onclick="speakRemainingTasks(this)">📋 Tasks</button></div></div><p style="font-size:0.95rem;margin-top:4px;white-space:pre-wrap">' + cleanAnswer + '</p>' + jumpBtn + '</div>';
        logQuestion(q);
        return;
      }
      const ql = q.toLowerCase();
      const results = knowledge.filter(k => k.keys.some(key => key.includes(ql) || ql.includes(key)));
      if (results.length === 0) {
        box.innerHTML = '<div class="alert alert-info">No results.</div>';
        return;
      }
      box.innerHTML = results.map(r => '<div class="result-item"><strong>' + (r.title[currentLang] || r.title.en) + '</strong><p style="font-size:0.9rem;margin-top:4px;color:var(--muted)">' + (r.body[currentLang] || r.body.en) + '</p></div>').join('');
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
      return 'Current time: ' + timeStr + '. Next incomplete task: ' + nextTitle + '. Already completed today: ' + doneList + '.\nDetected question language: ' + qLang + '.\nCRITICAL: You MUST answer 100% in ' + langName + '. Do not answer in English unless the question is English.\nPrefer short guide-first answers when an in-app guide applies. Do NOT invent UI button names or colors.\nExplanations in the question language; any customer-facing script lines must be English only.\nQuestion: ' + question;
    }

    let currentAudio = null;
    window.currentAudio = null;
    const ttsMemoryCache = new Map();

    function hashText(s) {
      let h = 5381;
      const str = String(s || '');
      for (let i = 0; i < str.length; i++) h = ((h << 5) + h) ^ str.charCodeAt(i);
      return (h >>> 0).toString(36);
    }

    function ttsCacheKey(text, lang) {
      return lang + ':' + hashText(text);
    }

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

    function setMicSpeaking(on) {
      const mic = document.getElementById('float-mic');
      if (!mic) return;
      if (on) {
        mic.classList.add('speaking');
        mic.classList.remove('listening');
      } else {
        mic.classList.remove('speaking');
      }
    }

    function stopSpeaking() {
      setMicSpeaking(false);
      if (currentAudio) { currentAudio.pause(); currentAudio = null; window.currentAudio = null; }
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      const stopBtn = document.getElementById('float-stop-btn');
      if (stopBtn) stopBtn.style.display = 'none';
      const speakBtn = document.getElementById('float-speak-btn');
      if (speakBtn) speakBtn.style.display = 'inline-block';
      const searchSpeak = document.getElementById('speak-btn');
      if (searchSpeak) { searchSpeak.disabled = false; searchSpeak.textContent = '🔊 Read'; }
      const guideSpeak = document.getElementById('guide-speak-btn');
      if (guideSpeak) { guideSpeak.disabled = false; guideSpeak.textContent = '🔊 Read'; }
    }

    // continued in voice-b.js
