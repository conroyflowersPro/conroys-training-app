/* Conroy's Training App - core part B */

    function renderStamps() {
      const container = document.getElementById('stamp-list');
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
      document.getElementById('progress-fill').style.width = pct + '%';
      document.getElementById('progress-text').textContent = `${doneCount} / ${routineTasks.length} ${currentLang==='ko'?'완료':'completed'} (${pct}%)`;

      const nextBanner = document.getElementById('next-banner');
      const nextText = document.getElementById('next-task-text');
      if (nextTask) {
        nextBanner.classList.remove('hidden');
        nextText.textContent = nextTask.title[currentLang] || nextTask.title.en;
      } else {
        nextBanner.classList.remove('hidden');
        nextText.textContent = currentLang === 'ko' ? '오늘 루틴을 모두 완료했습니다! 🎉' : 'All routines completed! 🎉';
      }

      checkEndOfDayReminder();
    }

    function toggleStamp(id) {
      const task = routineTasks.find(t => t.id === id);
      if (task && task.special && !stamps[id]?.done) {
        openSpecial(task.special);
        return;
      }
      if (stamps[id]?.done) {
        if (!confirm(currentLang==='ko'?'완료를 취소할까요?':'Unmark this task?')) return;
        delete stamps[id];
      } else {
        stamps[id] = { done: true, time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) };
        if (typeof playBell === 'function') playBell();
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
      if (hour >= 17 && !endDone) {
        banner.classList.add('show');
      } else {
        banner.classList.remove('show');
      }
    }

    function openSpecial(type) {
      const isStart = type === 'startday';
      const title = isStart ? 'Start Day' : 'End Day';
      const modal = document.getElementById('modal-content');
      modal.innerHTML = `
        <button class="close-modal" onclick="closeModal()">×</button>
        <h3>${title}</h3>
        <img src="cash.jpg" class="img-guide" style="max-height:160px;object-fit:cover">
        <div class="form-group">
          <label>${currentLang==='ko'?'총액 ($)':'Total Amount ($)'}</label>
          <input type="number" id="cash-amount" step="0.01" placeholder="200.00" value="${stamps[isStart?'start_day':'end_day']?.amount || ''}">
        </div>
        <div class="form-group">
          <label>${currentLang==='ko'?'현금 사진 업로드 / 촬영':'Upload / Take cash photo'}</label>
          <input type="file" id="cash-photo" accept="image/*" capture="environment">
          <img id="photo-preview" class="photo-preview hidden">
        </div>
        <div id="cash-alert" class="alert alert-warn hidden"></div>
        <button class="btn" style="width:100%" onclick="saveSpecial('${type}')">${currentLang==='ko'?'저장 & 스탬프':'Save & Stamp'}</button>
      `;
      document.getElementById('modal-overlay').classList.remove('hidden');
      document.getElementById('cash-photo').onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(ev) {
          const img = document.getElementById('photo-preview');
          img.src = ev.target.result;
          img.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
      };
      document.getElementById('cash-amount').oninput = function() {
        const val = parseFloat(this.value);
        const alertEl = document.getElementById('cash-alert');
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

    // ========== PAGES ==========
    function showPage(page) {
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      document.getElementById('page-' + page).classList.add('active');
      document.querySelectorAll('.nav-item').forEach(n => {
        n.classList.toggle('active', n.dataset.page === page);
      });
    }

    // ========== SEARCH & VOICE ==========
    function doSearch() {
      const q = document.getElementById('search-input').value.trim().toLowerCase();
      if (!q) return;
      const results = knowledge.filter(k => k.keys.some(key => key.includes(q) || q.includes(key)));
      const box = document.getElementById('search-results');
      if (results.length === 0) {
        box.innerHTML = `<div class="alert alert-info">${currentLang==='ko'?'결과가 없습니다. 다른 키워드로 시도해보세요.':'No results. Try another keyword.'}</div>`;
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
    function quickSearch(key) {
      document.getElementById('search-input').value = key;
      doSearch();
      showPage('search');
    }
    function logQuestion(q) {
      let logs = JSON.parse(localStorage.getItem('cf_questions') || '[]');
      logs.push({ q, user: currentUser, time: new Date().toISOString(), lang: currentLang });
      if (logs.length > 100) logs = logs.slice(-100);
      localStorage.setItem('cf_questions', JSON.stringify(logs));
    }

    function toggleVoice() {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert(currentLang==='ko'?'이 브라우저는 음성 인식을 지원하지 않습니다. Chrome을 권장합니다.':'Speech recognition not supported. Please use Chrome.');
        return;
      }
      if (isListening) {
        recognition.stop();
        isListening = false;
        document.getElementById('voice-btn').classList.remove('listening');
        return;
      }
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SR();
      recognition.lang = { ko:'ko-KR', en:'en-US', ja:'ja-JP', es:'es-ES' }[currentLang] || 'en-US';
      recognition.interimResults = false;
      recognition.onresult = function(e) {
        const text = e.results[0][0].transcript;
        document.getElementById('search-input').value = text;
        doSearch();
      };
      recognition.onend = function() {
        isListening = false;
        document.getElementById('voice-btn').classList.remove('listening');
      };
      recognition.start();
      isListening = true;
      document.getElementById('voice-btn').classList.add('listening');
    }

    function saveFeedback() {
      const text = document.getElementById('feedback-text').value.trim();
      if (!text) return;
      let fbs = JSON.parse(localStorage.getItem('cf_feedback') || '[]');
      fbs.push({ text, user: currentUser, time: new Date().toISOString() });
      localStorage.setItem('cf_feedback', JSON.stringify(fbs));
      document.getElementById('feedback-text').value = '';
      alert(currentLang==='ko'?'저장되었습니다. 감사합니다!':'Saved. Thank you!');
    }
