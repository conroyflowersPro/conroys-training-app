/* Conroy's Training App - core part B */

    function renderStamps() {
      const container = document.getElementById('stamp-list') || document.getElementById('routine-list');
      if (!container) {
        console.warn('renderStamps: no stamp-list or routine-list found');
        return;
      }
      let html = '';
      let doneCount = 0;
      const nextTask = getNextTask();

      routineTasks.forEach(task => {
        const s = stamps[task.id] || {};
        if (s.done) doneCount++;
        const title = task.title[currentLang] || task.title.en;
        const desc = task.desc[currentLang] || task.desc.en;
        const isNext = nextTask && nextTask.id === task.id;
        html += `
          <div class="stamp-item ${isNext ? 'next-task' : ''}" id="stamp-${task.id}">
            <button class="stamp-btn ${s.done ? 'done' : ''}" onclick="toggleStamp('${task.id}')">
              ${s.done ? '✓' : ''}
            </button>
            <div class="stamp-content">
              <div class="stamp-title">${title}</div>
              <div class="stamp-desc">${desc}</div>
              ${s.done && s.time ? `<div class="stamp-time">✓ ${s.time}${s.amount != null ? ' · $' + s.amount : ''}</div>` : ''}
              <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap">
                <button class="btn btn-sm btn-outline" onclick="showTaskDetail('${task.id}')">${{ko:'자세히 보기',en:'Details',ja:'詳細を見る',es:'Ver detalles'}[currentLang]||'Details'}</button>
                ${task.special && !s.done ? `<button class="btn btn-sm" onclick="openSpecial('${task.special}')">${{ko:'금액+사진 입력',en:'Enter amount + photo',ja:'金額+写真入力',es:'Monto + foto'}[currentLang]||'Enter amount + photo'}</button>` : ''}
              </div>
              ${task.special && s.done && s.photo ? `<img src="${s.photo}" class="photo-preview" style="max-height:100px;margin-top:6px">` : ''}
            </div>
          </div>`;
      });
      container.innerHTML = html;

      const pct = Math.round((doneCount / routineTasks.length) * 100);
      const pf = document.getElementById('progress-fill'); if (pf) pf.style.width = pct + '%';
      const pt = document.getElementById('progress-text'); if (pt) pt.textContent = `${doneCount} / ${routineTasks.length} ${currentLang==='ko'?'완료':'completed'} (${pct}%)`;

      const nextBanner = document.getElementById('next-banner');
      const nextText = document.getElementById('next-task-text');
      if (nextBanner && nextText) {
        if (nextTask) {
          nextBanner.classList.remove('hidden');
          nextText.textContent = nextTask.title[currentLang] || nextTask.title.en;
        } else {
          nextBanner.classList.remove('hidden');
          nextText.textContent = currentLang === 'ko' ? '오늘 루틴을 모두 완료했습니다! 🎉' : 'All routines completed! 🎉';
        }
      }

      checkEndOfDayReminder();
    }

    function toggleStamp(id) {
      const task = routineTasks.find(t => t.id === id);
      if (task && task.special && !stamps[id]?.done) {
        openSpecial(task.special);
        return;
      }
      var justCompleted = false;
      if (stamps[id]?.done) {
        if (!confirm(currentLang==='ko'?'완료를 취소할까요?':'Unmark this task?')) return;
        delete stamps[id];
      } else {
        stamps[id] = { done: true, time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) };
        if (typeof playBell === 'function') playBell();
        justCompleted = true;
      }
      saveStamps();
      renderStamps();
      setTimeout(() => {
        const next = getNextTask();
        if (next) {
          const el = document.getElementById('stamp-' + next.id);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
      if (justCompleted) {
        try {
          if (typeof window.onRoutineTaskCompleted === 'function') window.onRoutineTaskCompleted(id);
        } catch (e) {}
      }
    }

    function checkEndOfDayReminder() {
      const banner = document.getElementById('eod-banner');
      if (!banner) return;
      const now = new Date();
      const hour = now.getHours();
      const endDone = stamps['end_day']?.done;
      const t = {
        ko: { title: '⏰ 퇴근 시간이 가까워요', desc: '오늘 요약을 확인하고 End Day를 완료해주세요.', btn: '오늘 요약 보기' },
        en: { title: '⏰ End of day is near', desc: 'Please check today\'s summary and complete End Day.', btn: 'View summary' },
        ja: { title: '⏰ 退勤時間が近づいています', desc: '今日のまとめを確認し、End Dayを完了してください。', btn: '今日のまとめを見る' },
        es: { title: '⏰ Se acerca el fin del día', desc: 'Revise el resumen de hoy y complete End Day.', btn: 'Ver resumen' }
      }[currentLang] || { title: '⏰ End of day is near', desc: 'Complete End Day.', btn: 'View summary' };
      const titleEl = document.getElementById('eod-title');
      const descEl = document.getElementById('eod-desc');
      const btnEl = document.getElementById('eod-btn');
      if (titleEl) titleEl.textContent = t.title;
      if (descEl) descEl.textContent = t.desc;
      if (btnEl) btnEl.textContent = t.btn;
      if (!endDone && hour >= 16) banner.classList.add('show');
      else banner.classList.remove('show');
    }

    function getNextTask() {
      return routineTasks.find(t => !stamps[t.id]?.done) || null;
    }

    function openSpecial(type) {
      const isStart = type === 'startday';
      const title = isStart
        ? ({ko:'시재 확인 (Start Day)',en:'Cash check (Start Day)',ja:'現金確認 (Start Day)',es:'Caja (Start Day)'}[currentLang]||'Cash check')
        : ({ko:'시재 확인 (End Day)',en:'Cash check (End Day)',ja:'現金確認 (End Day)',es:'Caja (End Day)'}[currentLang]||'Cash check');
      const body = document.getElementById('modal-content');
      if (!body) return;
      body.innerHTML = `
        <button class="close-modal" onclick="closeModal()">×</button>
        <h2>${title}</h2>
        <div class="card" style="margin-top:12px">
          <label>${currentLang==='ko'?'총액 ($)':'Total Amount ($)'}</label>
          <input type="number" id="cash-amount" step="0.01" placeholder="200.00" value="${stamps[isStart?'start_day':'end_day']?.amount || ''}">
          <label style="margin-top:12px;display:block">${currentLang==='ko'?'현금 사진 업로드 / 촬영':'Upload / Take cash photo'}</label>
          <input type="file" id="cash-photo" accept="image/*" capture="environment" style="margin-top:6px">
          <img id="photo-preview" class="hidden" style="max-width:100%;margin-top:8px;border-radius:8px">
          <div id="cash-alert" class="alert alert-info hidden" style="margin-top:10px"></div>
          <button class="btn" style="width:100%;margin-top:14px" onclick="saveSpecial('${type}')">${currentLang==='ko'?'저장':'Save'}</button>
        </div>`;
      document.getElementById('modal-overlay').classList.remove('hidden');
      const fileInput = document.getElementById('cash-photo');
      const preview = document.getElementById('photo-preview');
      if (fileInput) fileInput.onchange = function () {
        const f = fileInput.files && fileInput.files[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = function (e) {
          preview.src = e.target.result;
          preview.classList.remove('hidden');
        };
        reader.readAsDataURL(f);
      };
      const amountInput = document.getElementById('cash-amount');
      const alertEl = document.getElementById('cash-alert');
      if (amountInput) amountInput.oninput = function () {
        const val = parseFloat(amountInput.value);
        if (!isNaN(val) && Math.abs(val - 200) > 0.01) {
          alertEl.classList.remove('hidden');
          alertEl.textContent = currentLang==='ko'
            ? '⚠️ $200.00이 아닙니다. 사진을 찍어서 (213) 610-1004로 보내고 조정 없이 진행하세요.'
            : '⚠️ Not $200.00. Take photo, send to (213) 610-1004, continue without adjustment.';
        } else {
          alertEl.classList.add('hidden');
        }
      };
    }

    function saveSpecial(type) {
      const amount = parseFloat(document.getElementById('cash-amount').value);
      const preview = document.getElementById('photo-preview');
      const photo = preview && !preview.classList.contains('hidden') ? preview.src : null;
      if (isNaN(amount)) {
        alert(currentLang==='ko'?'금액을 입력해주세요.':'Please enter the amount.');
        return;
      }
      const id = type === 'startday' ? 'start_day' : 'end_day';
      stamps[id] = {
        done: true,
        time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}),
        amount: amount,
        photo: photo
      };
      saveStamps();
      closeModal();
      if (typeof playBell === 'function') playBell();
      renderStamps();
      setTimeout(() => {
        const next = getNextTask();
        if (next) {
          const el = document.getElementById('stamp-' + next.id);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
      try {
        if (typeof window.onRoutineTaskCompleted === 'function') window.onRoutineTaskCompleted(id);
      } catch (e) {}
    }

    function closeModal() {
      document.getElementById('modal-overlay').classList.add('hidden');
    }

    function markMessagesChecked() {
      if (!stamps['messages_check']?.done) {
        stamps['messages_check'] = { done: true, time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) };
        saveStamps();
        if (typeof playBell === 'function') playBell();
        renderStamps();
      }
    }

    function toggleRoutineList() {
      const list = document.getElementById('stamp-list');
      const btn = document.getElementById('routine-accordion-btn');
      if (!list || !btn) return;
      list.classList.toggle('open');
      btn.classList.toggle('open');
    }

    function showTaskDetail(id) {
      const task = routineTasks.find(t => t.id === id);
      if (!task) return;
      const L = currentLang || 'en';
      const title = task.title[L] || task.title.en;
      const desc = task.desc[L] || task.desc.en;
      const body = document.getElementById('modal-content');
      if (!body) return;
      body.innerHTML = `<button class="close-modal" onclick="closeModal()">×</button><h2>${title}</h2><p style="margin-top:10px;line-height:1.5">${desc}</p>`;
      document.getElementById('modal-overlay').classList.remove('hidden');
    }

    function showSummary() {
      const L = currentLang || 'en';
      let lines = [];
      routineTasks.forEach(task => {
        const s = stamps[task.id];
        const title = task.title[L] || task.title.en;
        if (s && s.done) lines.push('✓ ' + title + (s.time ? ' (' + s.time + ')' : ''));
        else lines.push('○ ' + title);
      });
      const body = document.getElementById('modal-content');
      if (!body) return;
      body.innerHTML = `<button class="close-modal" onclick="closeModal()">×</button><h2>${{ko:'오늘 요약',en:"Today's summary",ja:'今日のまとめ',es:'Resumen de hoy'}[L]||"Today's summary"}</h2><pre style="white-space:pre-wrap;margin-top:12px;line-height:1.6">${lines.join('\n')}</pre>`;
      document.getElementById('modal-overlay').classList.remove('hidden');
    }

    function showPage(page) {
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      const el = document.getElementById('page-' + page);
      if (el) el.classList.add('active');
      document.querySelectorAll('.nav-item').forEach(n => {
        n.classList.toggle('active', n.dataset.page === page);
      });
    }

    function doSearch() {
      const q = (document.getElementById('search-input')?.value || '').trim();
      if (!q) return;
      if (typeof askGrok === 'function') {
        showPage('home');
        const input = document.getElementById('float-chat-input');
        if (input) { input.value = q; }
        if (typeof submitFloatChat === 'function') submitFloatChat();
      }
    }

    function toggleVoice() {
      if (typeof toggleFloatMic === 'function') toggleFloatMic();
    }

    function quickGuideAsk(kind) {
      const map = {
        customer: { ko: '손님 응대 어떻게 해요?', en: 'How do I handle a walk-in customer?', ja: '来客対応はどうしますか？', es: '¿Cómo atiendo a un cliente?' },
        phone: { ko: '전화 받을 때 뭐라고 해요?', en: 'What do I say when answering the phone?', ja: '電話応対のセリフは？', es: '¿Qué digo al contestar el teléfono?' },
        messages: { ko: 'Messages 확인 순서 알려줘', en: 'How do I check Messages in BMS?', ja: 'Messagesの確認手順は？', es: '¿Cómo reviso Messages en BMS?' },
        delivery: { ko: '배달 세팅 어떻게 해요?', en: 'How do I set up delivery?', ja: '配達設定の方法は？', es: '¿Cómo configuro la entrega?' }
      };
      const L = currentLang || 'en';
      const q = (map[kind] && (map[kind][L] || map[kind].en)) || kind;
      showPage('home');
      const input = document.getElementById('float-chat-input');
      if (input) input.value = q;
      if (typeof submitFloatChat === 'function') submitFloatChat();
    }

    function showContent(id) {
      if (typeof goToRelatedSection === 'function') {
        goToRelatedSection({ type: 'content', id: id });
      } else if (typeof openPageGuideModal === 'function') {
        openPageGuideModal(id);
      }
    }

    function openAdminPanel() {
      alert(currentLang==='ko'?'관리자 패널':'Admin panel');
    }

    function onVersionTap() {
      console.log('version tap');
    }

    function speakGuideModal(btn) {
      const text = document.getElementById('modal-content')?.innerText || '';
      if (typeof speakText === 'function') speakText(text, btn);
    }

    function speakRemainingTasks(btn) {
      if (typeof buildDailyRoutineSpeech === 'function') {
        const t = buildDailyRoutineSpeech();
        if (typeof speakText === 'function') speakText(t, btn);
      }
    }

    function stopSpeaking() {
      try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) {}
    }

    function setAppLanguage(lang) {
      currentLang = lang;
      try { localStorage.setItem('cf_lang', lang); } catch (e) {}
      if (typeof applyI18n === 'function') applyI18n();
      if (typeof renderStamps === 'function') renderStamps();
    }

    function changeLang(lang) {
      setAppLanguage(lang);
    }

    function applyI18n() {
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (typeof t === 'function') {
          const val = t(key);
          if (val) el.textContent = val;
        }
      });
    }

    function t(key) {
      if (typeof i18n !== 'undefined' && i18n[currentLang] && i18n[currentLang][key]) return i18n[currentLang][key];
      if (typeof i18n !== 'undefined' && i18n.en && i18n.en[key]) return i18n.en[key];
      return key;
    }

    function hideGrokDock() {
      const dock = document.getElementById('grok-dock');
      if (dock) dock.classList.add('hidden');
    }
    function clearGrokMessages() {
      const box = document.getElementById('grok-messages');
      if (box) box.innerHTML = '<div id="float-answer" style="display:none"></div><div id="float-status" style="display:none"></div>';
    }

    function setFloatStatus(msg) {
      const st = document.getElementById('float-status');
      if (st) { st.style.display = 'block'; st.textContent = msg; }
    }

    function removeCoachBox() {
      const old = document.getElementById('float-coach-box');
      if (old) old.remove();
    }

    function appendGrokMessage(text, type) {
      const box = document.getElementById('grok-messages');
      if (!box) return;
      const div = document.createElement('div');
      div.className = 'grok-msg ' + (type === 'user' ? 'user' : type === 'warn' ? 'bot' : 'bot');
      div.textContent = text;
      box.appendChild(div);
      box.scrollTop = box.scrollHeight;
    }

    window.renderStamps = renderStamps;
    window.toggleStamp = toggleStamp;
    window.getNextTask = getNextTask;
    window.showPage = showPage;
    window.showContent = showContent;
    window.showSummary = showSummary;
    window.showTaskDetail = showTaskDetail;
    window.openSpecial = openSpecial;
    window.saveSpecial = saveSpecial;
    window.closeModal = closeModal;
    window.quickGuideAsk = quickGuideAsk;
    window.doSearch = doSearch;
    window.toggleVoice = toggleVoice;
    window.toggleRoutineList = toggleRoutineList;
    window.changeLang = changeLang;
    window.setAppLanguage = setAppLanguage;
    window.appendGrokMessage = appendGrokMessage;
    window.removeCoachBox = removeCoachBox;
    window.setFloatStatus = setFloatStatus;
    window.markMessagesChecked = markMessagesChecked;
    window.speakRemainingTasks = speakRemainingTasks;
    window.stopSpeaking = stopSpeaking;
    window.onVersionTap = onVersionTap;
    window.openAdminPanel = openAdminPanel;
    window.speakGuideModal = speakGuideModal;
