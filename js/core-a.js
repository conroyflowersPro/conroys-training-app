/* Conroy's Training App - core part A v3.0.0 */
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

    function updateLangSelectVisibility() {
      const langSel = document.getElementById('lang-select');
      if (!langSel) return;
      if (currentUser === 'Admin') {
        langSel.style.display = '';
      } else {
        langSel.style.display = 'none';
      }
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
      applyI18n();
      showWelcomeModal();
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

    function showWelcomeModal() {
      const dayKey = 'cf_greeted_' + (currentUser || 'user') + '_' + (typeof todayKey === 'function' ? todayKey() : new Date().toISOString().slice(0, 10));
      const alreadyGreeted = localStorage.getItem(dayKey) === '1';
      const statusMsg = getRoutineStatusMessage();
      const L = currentLang || 'en';
      let title, msg;
      if (!alreadyGreeted) {
        localStorage.setItem(dayKey, '1');
        title = ({ ko: '안녕하세요', en: 'Hello', ja: 'こんにちは', es: 'Hola' })[L] || 'Hello';
        msg = ({
          ko: currentUser + '님 안녕하세요. 출근하셨으면 도와드리겠습니다.\n먼저 Funeral / 긴급 주문을 확인해 주세요.',
          en: 'Hi ' + currentUser + ". If you're in for your shift, I'm here to help.\nPlease check Funeral / urgent orders first.",
          ja: currentUser + 'さん、こんにちは。出勤されたらお手伝いします。\nまずFuneral / 緊急注文を確認してください。',
          es: 'Hola ' + currentUser + '. Si ya entró a su turno, estoy aquí para ayudar.\nRevise primero los pedidos Funeral / urgentes.'
        })[L];
        if (statusMsg) msg += '\n\n' + statusMsg;
      } else {
        title = ({ ko: '무엇을 도와드릴까요?', en: 'How can I help?', ja: '何かお手伝いしましょうか？', es: '¿En qué puedo ayudar?' })[L] || 'How can I help?';
        msg = statusMsg || ({
          ko: '필요한 가이드나 루틴을 선택해 주세요.',
          en: 'Choose a guide or routine task when you need it.',
          ja: '必要なガイドやルーチンを選んでください。',
          es: 'Elija una guía o tarea de rutina cuando la necesite.'
        })[L];
      }
      const okLabel = { ko: '확인', en: 'OK', ja: '確認', es: 'OK' }[L] || 'OK';
      const speakLabel = { ko: '읽어주기', en: 'Read aloud', ja: '読み上げ', es: 'Leer' }[L] || 'Read aloud';
      const modal = document.getElementById('modal-content');
      modal.innerHTML = `
        <button class="close-modal" onclick="closeWelcomeModal()">×</button>
        <h3 style="text-align:center;margin-bottom:12px">${title}</h3>
        <img src="images/ui/welcome.webp" class="img-guide" style="max-height:200px;object-fit:cover;border-radius:12px;margin-bottom:12px" alt="Welcome" onerror="this.style.display='none'">
        <p id="welcome-msg-text" style="text-align:center;white-space:pre-wrap;margin-bottom:16px;line-height:1.5">${msg}</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn" style="flex:1;min-width:120px" onclick="closeWelcomeModal()">${okLabel}</button>
          <button class="btn btn-outline" style="flex:1;min-width:120px" onclick="if(typeof speakText==='function')speakText(document.getElementById('welcome-msg-text').innerText,this)">🔊 ${speakLabel}</button>
        </div>
      `;
      document.getElementById('modal-overlay').classList.remove('hidden');
      playBell();
    }

    function closeWelcomeModal() {
      document.getElementById('modal-overlay').classList.add('hidden');
      setTimeout(() => {
        showFuneralPriority();
      }, 250);
    }

    let funeralGuideShownThisSession = false;

    function showFuneralPriority() {
      if (funeralGuideShownThisSession) return;
      if (stamps['funeral_check']?.done) return;
      funeralGuideShownThisSession = true;

      if (typeof showPage === 'function') showPage('home');

      const titles = {
        ko: '우선 확인: Funeral / 긴급 주문',
        en: 'Priority: Funeral / Urgent orders',
        ja: '優先確認: Funeral / 緊急注文',
        es: 'Prioridad: Funeral / pedidos urgentes'
      };
      const msgs = {
        ko: 'Funeral 주문은 Uber ASAP 개별 배달이라 가장 먼저 확인해야 합니다.\nMessages / In Wire를 열고 Funeral 또는 긴급 주문이 있는지 바로 확인하세요.',
        en: 'Funeral orders are individual Uber ASAP deliveries — check them first.\nOpen Messages / In Wire and look for Funeral or urgent orders right away.',
        ja: 'Funeral注文はUber ASAPの個別配達のため最優先です。\nMessages / In Wireを開き、Funeralや緊急注文がないかすぐに確認してください。',
        es: 'Los pedidos Funeral son entregas individuales Uber ASAP — revíselos primero.\nAbra Messages / In Wire y busque pedidos Funeral o urgentes de inmediato.'
      };
      const btnLabels = {
        ko: 'Funeral 항목으로 이동',
        en: 'Go to Funeral task',
        ja: 'Funeral項目へ',
        es: 'Ir a tarea Funeral'
      };
      const laterLabels = {
        ko: '나중에',
        en: 'Later',
        ja: '後で',
        es: 'Después'
      };

      const modal = document.getElementById('modal-content');
      modal.innerHTML = `
        <button class="close-modal" onclick="closeModal(); highlightFuneralTask()">×</button>
        <h3 style="margin-bottom:12px">⚠️ ${titles[currentLang] || titles.en}</h3>
        <div class="alert alert-warn" style="margin-bottom:14px;white-space:pre-wrap;line-height:1.5">${msgs[currentLang] || msgs.en}</div>
        <button class="btn" style="width:100%;margin-bottom:8px" onclick="closeModal(); highlightFuneralTask()">${btnLabels[currentLang] || btnLabels.en}</button>
        <button class="btn btn-outline" style="width:100%" onclick="closeModal()">${laterLabels[currentLang] || laterLabels.en}</button>
      `;
      document.getElementById('modal-overlay').classList.remove('hidden');
      playBell();
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
        }[currentLang] || "Reset today's checked tasks?\n\nOK = Clear and logout\nCancel = Keep and logout";

        if (confirm(msg)) {
          try {
            localStorage.removeItem(stampKey());
          } catch (e) {}
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
