/* Conroy's Training App - core part A 4.0.0 */
// ========== AUTH / USERS ==========
    const DEFAULT_USERS = [
      { username: 'admin',     password: 'ADMIN7890', name: 'Admin' },
      { username: 'employee1', password: 'Trainee01',   name: 'Employee 1' },
      { username: 'employee2', password: 'Trainee02',   name: 'Employee 2' },
      { username: 'employee3', password: 'Trainee03',   name: 'Employee 3' },
      { username: 'employee4', password: 'Trainee04',   name: 'Employee 4' },
      { username: 'employee5', password: 'Trainee05',   name: 'Employee 5' }
    ];

    let users = [];
    let serverAvailable = null;

    function isNetlifyHost() {
      const h = location.hostname || '';
      return h.includes('netlify.app') || h.includes('netlify.com') || !!window.NETLIFY;
    }

    function usersApiUrl() {
      if (isNetlifyHost()) return '/.netlify/functions/users';
      return null;
    }

    async function callUsersApi(payload) {
      const url = usersApiUrl();
      if (!url) throw new Error('Not on Netlify');
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || ('HTTP ' + res.status));
      return data;
    }

    function loadUsersLocal() {
      try {
        const saved = localStorage.getItem('cf_users');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            users = parsed;
            return;
          }
        }
      } catch (e) {}
      users = JSON.parse(JSON.stringify(DEFAULT_USERS));
      saveUsersLocal();
    }

    function saveUsersLocal() {
      localStorage.setItem('cf_users', JSON.stringify(users));
    }

    async function loadUsers() {
      if (!isNetlifyHost()) {
        loadUsersLocal();
        serverAvailable = false;
        return;
      }
      try {
        const data = await callUsersApi({ action: 'list' });
        if (data.users && Array.isArray(data.users)) {
          users = data.users;
          serverAvailable = true;
          saveUsersLocal();
          return;
        }
      } catch (e) {
        console.warn('loadUsers server failed', e);
      }
      loadUsersLocal();
      serverAvailable = false;
    }

    async function saveUsers() {
      saveUsersLocal();
      if (!serverAvailable) return;
      try {
        await callUsersApi({ action: 'save', users });
      } catch (e) {}
    }

    let currentUser = null;
    let currentLang = 'en';
    let stamps = {};
    let isListening = false;
    let recognition = null;
    let funeralGuideShownThisSession = false;

    function updateLangSelectVisibility() {
      const langSel = document.getElementById('lang-select');
      if (!langSel) return;
      if (currentUser === 'Admin') langSel.style.display = '';
      else langSel.style.display = 'none';
    }

    function setAppLanguage(lang) {
      const next = (lang === 'es-ES') ? 'es' : (lang || 'en');
      if (next !== 'ko' && next !== 'en' && next !== 'ja' && next !== 'es') return;
      currentLang = next;
      localStorage.setItem('cf_lang', currentLang);
      const langSel = document.getElementById('lang-select');
      if (langSel) langSel.value = currentLang;
      if (typeof applyI18n === 'function') applyI18n();
      if (typeof renderStamps === 'function') renderStamps();
      if (typeof checkEndOfDayReminder === 'function') checkEndOfDayReminder();
    }

    function playBell() {
      try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        const ctx = new Ctx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.28, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.28);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
        setTimeout(() => { try { ctx.close(); } catch (e) {} }, 400);
      } catch (e) {}
    }

    async function doLogin() {
      const username = document.getElementById('login-username').value.trim().toLowerCase();
      const password = document.getElementById('login-password').value;
      const errEl = document.getElementById('login-error');

      if (isNetlifyHost()) {
        try {
          const data = await callUsersApi({ action: 'login', username, password });
          if (data.ok) {
            currentUser = data.name || data.username || username;
            localStorage.setItem('cf_currentUser', currentUser);
            serverAvailable = true;
            loadUsers().catch(() => {});
            startApp();
            return;
          }
        } catch (e) {
          console.warn('server login failed, trying local', e);
        }
      }

      await loadUsers();
      const user = users.find(u => (u.username || '').toLowerCase() === username && u.password === password);
      if (!user) {
        errEl.textContent = (i18n[currentLang] || i18n.en).login_error || 'Invalid username or password.';
        errEl.classList.remove('hidden');
        return;
      }
      currentUser = user.name || user.username;
      localStorage.setItem('cf_currentUser', currentUser);
      startApp();
    }

    function showGrokDock() {
      const dock = document.getElementById('grok-dock');
      if (dock) dock.classList.remove('hidden');
    }
    function hideGrokDock() {
      const dock = document.getElementById('grok-dock');
      if (dock) dock.classList.add('hidden');
      const mic = document.getElementById('float-mic');
      if (mic) mic.classList.remove('listening');
    }
    function appendGrokMessage(text, type) {
      const box = document.getElementById('grok-messages');
      if (!box) return;
      const div = document.createElement('div');
      div.className = 'grok-msg ' + (type || 'bot');
      div.style.whiteSpace = 'pre-wrap';
      div.textContent = text;
      box.appendChild(div);
      box.scrollTop = box.scrollHeight;
      const fa = document.getElementById('float-answer');
      if (fa) fa.textContent = text;
    }
    function appendGrokAction(label, onClickFn) {
      const box = document.getElementById('grok-messages');
      if (!box) return;
      const row = document.createElement('div');
      row.style.cssText = 'margin:0 0 10px 4px';
      const btn = document.createElement('button');
      btn.className = 'btn btn-sm btn-outline';
      btn.textContent = label;
      btn.onclick = onClickFn;
      row.appendChild(btn);
      box.appendChild(row);
      box.scrollTop = box.scrollHeight;
    }
    function clearGrokMessages() {
      const box = document.getElementById('grok-messages');
      if (!box) return;
      Array.from(box.querySelectorAll('.grok-msg')).forEach(function (el) { el.remove(); });
      Array.from(box.querySelectorAll('button.btn-sm')).forEach(function (el) {
        if (el.parentElement && el.parentElement !== box) el.parentElement.remove();
        else el.remove();
      });
    }

    function startApp() {
      currentLang = 'en';
      localStorage.setItem('cf_lang', 'en');
      document.getElementById('login-screen').classList.add('hidden');
      document.getElementById('app').classList.remove('hidden');
      document.getElementById('header-user').textContent = currentUser + ' · ' + new Date().toLocaleDateString();
      const adminCard = document.getElementById('admin-card');
      if (adminCard) {
        if (currentUser === 'Admin') adminCard.classList.remove('hidden');
        else adminCard.classList.add('hidden');
      }
      updateLangSelectVisibility();
      const langSel = document.getElementById('lang-select');
      if (langSel) langSel.value = currentLang;
      loadStamps();
      renderStamps();
      try { applyI18n(); } catch (e) { console.warn(e); }
      showGrokDock();
      clearGrokMessages();
      showWelcomeInDock();
    }

    function getRoutineStatusMessage() {
      if (typeof routineTasks === 'undefined' || !routineTasks) return '';
      const L = currentLang || 'en';
      const remaining = [];
      const skipped = [];
      routineTasks.forEach(function (task) {
        const s = stamps[task.id] || {};
        const title = (task.title && (task.title[L] || task.title.en || task.title.ko)) || task.id;
        if (s.skipped) skipped.push(title);
        else if (!s.done) remaining.push(title);
      });
      if (!remaining.length && !skipped.length) {
        return ({ ko: '오늘의 데일리 루틴을 모두 완료하셨습니다.', en: "You have completed all of today's daily routine.", ja: '本日のデイリールーチンはすべて完了です。', es: 'Ha completado toda la rutina diaria de hoy.' })[L] || "You have completed all of today's daily routine.";
      }
      let msg = '';
      if (remaining.length) {
        msg += ({ ko: '남은 루틴: ', en: 'Remaining: ', ja: '残り: ', es: 'Pendiente: ' })[L] || 'Remaining: ';
        msg += remaining.slice(0, 5).join(', ');
        if (remaining.length > 5) msg += ' +' + (remaining.length - 5);
      }
      if (skipped.length) {
        if (msg) msg += '\n';
        msg += ({ ko: '스킵한 항목: ', en: 'Skipped: ', ja: 'スキップ: ', es: 'Omitidos: ' })[L] || 'Skipped: ';
        msg += skipped.slice(0, 5).join(', ');
      }
      return msg;
    }

    function getNextRoutineTask() {
      if (typeof routineTasks === 'undefined' || !routineTasks) return null;
      for (var i = 0; i < routineTasks.length; i++) {
        var task = routineTasks[i];
        var s = stamps[task.id] || {};
        if (!s.done && !s.skipped) return task;
      }
      return null;
    }

    function buildDailyRoutineSpeech() {
      const L = currentLang || 'en';
      const next = getNextRoutineTask();
      if (!next) {
        return ({
          ko: '오늘의 데일리 루틴은 모두 완료되었습니다.',
          en: "Today's daily routine is all complete.",
          ja: '本日のデイリールーチンはすべて完了です。',
          es: 'La rutina diaria de hoy está completa.'
        })[L];
      }
      const title = (next.title && (next.title[L] || next.title.en || next.title.ko)) || next.id;
      const desc = (next.desc && (next.desc[L] || next.desc.en || next.desc.ko)) || '';
      return ({
        ko: '다음 루틴은 「' + title + '」입니다.' + (desc ? ' ' + desc : ''),
        en: 'Your next routine is: ' + title + '.' + (desc ? ' ' + desc : ''),
        ja: '次のルーチンは「' + title + '」です。' + (desc ? ' ' + desc : ''),
        es: 'Su siguiente rutina es: ' + title + '.' + (desc ? ' ' + desc : '')
      })[L];
    }

    function showWelcomeInDock() {
      const dayKey = 'cf_greeted_' + (currentUser || 'user') + '_' + (typeof todayKey === 'function' ? todayKey() : new Date().toISOString().slice(0, 10));
      const alreadyGreeted = localStorage.getItem(dayKey) === '1';
      const L = currentLang || 'en';
      const nextLine = buildDailyRoutineSpeech();
      let msg;
      if (!alreadyGreeted) {
        localStorage.setItem(dayKey, '1');
        const hello = ({
          ko: (currentUser || '') + '님 안녕하세요. 출근하셨으면 도와드리겠습니다.',
          en: 'Hello ' + (currentUser || '') + ". If you're in for your shift, I'm here to help.",
          ja: (currentUser || '') + 'さん、こんにちは。出勤されたらお手伝いします。',
          es: 'Hola ' + (currentUser || '') + '. Si ya entró a su turno, estoy aquí para ayudar.'
        })[L];
        msg = hello + '\n' + nextLine;
      } else {
        const help = ({
          ko: '무엇을 도와드릴까요?',
          en: 'How can I help?',
          ja: '何かお手伝いしましょうか？',
          es: '¿En qué puedo ayudar?'
        })[L];
        msg = help + '\n' + nextLine;
      }
      appendGrokMessage(msg, 'bot');
      playBell();
      const next = getNextRoutineTask();
      if (next) {
        const detailLabel = ({
          ko: '자세히 보기',
          en: 'See details',
          ja: '詳細を見る',
          es: 'Ver detalles'
        })[L] || 'See details';
        appendGrokAction(detailLabel, function () {
          if (typeof showTaskDetail === 'function') showTaskDetail(next.id);
          else if (typeof showPage === 'function') {
            showPage('home');
            const el = document.getElementById('stamp-' + next.id);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        });
      }
      if (typeof speakText === 'function') {
        setTimeout(function () {
          try { speakText(msg, null); } catch (e) { console.warn('welcome TTS', e); }
        }, 400);
      }
      if (next && typeof showPage === 'function') {
        setTimeout(function () {
          try {
            const el = document.getElementById('stamp-' + next.id);
            if (el) el.classList.add('next-task');
          } catch (e) {}
        }, 350);
      }
      setTimeout(function () { showFuneralInDock(); }, 500);
    }

    function showFuneralInDock() {
      if (funeralGuideShownThisSession) return;
      if (stamps['funeral_check'] && stamps['funeral_check'].done) return;
      funeralGuideShownThisSession = true;
      const L = currentLang || 'en';
      const msg = ({
        ko: '⚠️ 우선 확인: Funeral / 긴급 주문은 Uber ASAP 개별 배달입니다. Messages / In Wire에서 먼저 확인해 주세요.',
        en: '⚠️ Priority: Funeral / urgent orders are Uber ASAP individual deliveries. Check Messages / In Wire first.',
        ja: '⚠️ 優先: Funeral / 緊急注文はUber ASAPです。Messages / In Wireを先に確認してください。',
        es: '⚠️ Prioridad: Funeral / urgentes son Uber ASAP. Revise Messages / In Wire primero.'
      })[L];
      appendGrokMessage(msg, 'warn');
      if (typeof highlightFuneralTask === 'function') highlightFuneralTask();
    }

    function closeWelcomeModal() {
      document.getElementById('modal-overlay').classList.add('hidden');
      setTimeout(() => { showFuneralPriority(); }, 250);
    }

    function showFuneralPriority() {
      if (funeralGuideShownThisSession) return;
      if (stamps['funeral_check']?.done) return;
      funeralGuideShownThisSession = true;
      if (typeof showPage === 'function') showPage('home');
      highlightFuneralTask();
    }

    function highlightFuneralTask() {
      if (typeof showPage === 'function') showPage('home');
      setTimeout(() => {
        const el = document.getElementById('stamp-funeral_check');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('next-task');
          playBell();
        }
      }, 200);
    }

    function doLogout() {
      const hasTasks = Object.keys(stamps).length > 0 && Object.values(stamps).some(s => s && s.done);
      if (hasTasks) {
        const msg = {
          ko: '오늘 체크한 루틴(태스크)을 초기화할까요?\n\n확인 = 지우고 로그아웃\n취소 = 그대로 두고 로그아웃',
          en: "Reset today's checked tasks?\n\nOK = Clear and logout\nCancel = Keep and logout",
          ja: '今日チェックしたルーティンをリセットしますか？\n\nOK = 消してログアウト\nキャンセル = そのままログアウト',
          es: '¿Restablecer las tareas marcadas de hoy?\n\nOK = Borrar y cerrar sesión\nCancelar = Mantener y cerrar sesión'
        }[currentLang] || "Reset today's checked tasks?";
        if (confirm(msg)) {
          try { localStorage.removeItem(stampKey()); } catch (e) {}
          stamps = {};
        }
      }
      funeralGuideShownThisSession = false;
      logout();
    }

    function logout() {
      localStorage.removeItem('cf_currentUser');
      currentUser = null;
      currentLang = 'en';
      applyI18n();
      const langSel = document.getElementById('lang-select');
      if (langSel) {
        langSel.value = 'en';
        langSel.style.display = '';
      }
      document.getElementById('app').classList.add('hidden');
      document.getElementById('login-screen').classList.remove('hidden');
      hideGrokDock();
      clearGrokMessages();
      const adminCard = document.getElementById('admin-card');
      if (adminCard) adminCard.classList.add('hidden');
      const u = document.getElementById('login-username');
      const p = document.getElementById('login-password');
      if (u) u.value = '';
      if (p) p.value = '';
      const errEl = document.getElementById('login-error');
      if (errEl) { errEl.classList.add('hidden'); errEl.textContent = ''; }
      setTimeout(() => { if (u) u.focus(); }, 200);
    }

    function todayKey() {
      return new Date().toISOString().slice(0,10);
    }
    function stampKey() {
      return `cf_stamps_${currentUser}_${todayKey()}`;
    }
    function loadStamps() {
      stamps = JSON.parse(localStorage.getItem(stampKey()) || '{}');
    }
    function saveStamps() {
      localStorage.setItem(stampKey(), JSON.stringify(stamps));
    }
    function getNextTask() {
      return routineTasks.find(t => !stamps[t.id]?.done) || null;
    }
