/* Conroy's Training App - core part A */
// ========== AUTH / USERS ==========
    const DEFAULT_USERS = [
      { username: 'admin',     password: 'AdminConroy26', name: 'Admin' },
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
          return;
        }
      } catch (e) {}
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

    // Simple unified bell / ding sound (Web Audio, no extra file)
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
      const username = document.getElementById('login-username').value.trim();
      const password = document.getElementById('login-password').value;
      const errEl = document.getElementById('login-error');
      await loadUsers();
      const user = users.find(u => u.username === username && u.password === password);
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
      // Restore preferred language after login
      currentLang = localStorage.getItem('cf_lang') || 'en';
      document.getElementById('login-screen').classList.add('hidden');
      document.getElementById('app').classList.remove('hidden');
      document.getElementById('header-user').textContent = currentUser + ' · ' + new Date().toLocaleDateString();
      const adminCard = document.getElementById('admin-card');
      if (adminCard) {
        if (currentUser === 'Admin') adminCard.classList.remove('hidden');
        else adminCard.classList.add('hidden');
      }
      const langSel = document.getElementById('lang-select');
      if (langSel) langSel.value = currentLang;
      loadStamps();
      renderStamps();
      applyI18n();
      // Show welcome greeting (once per day per user)
      showWelcomeModal();
    }

    function showWelcomeModal() {
      const key = 'cf_welcome_' + currentUser + '_' + todayKey();
      if (localStorage.getItem(key)) return;
      const greetings = {
        ko: { title: '환영합니다!', msg: currentUser + '님, 오늘도 좋은 하루 되세요.\n먼저 Funeral / 긴급 주문을 확인해 주세요.' },
        en: { title: 'Welcome!', msg: 'Hi ' + currentUser + ', have a great day.\nPlease check Funeral / urgent orders first.' },
        ja: { title: 'ようこそ！', msg: currentUser + 'さん、今日も良い一日を。\nまずFuneral / 緊急注文を確認してください。' },
        es: { title: '¡Bienvenido!', msg: 'Hola ' + currentUser + ', que tengas un buen día.\nPor favor revisa primero los pedidos Funeral / urgentes.' }
      };
      const g = greetings[currentLang] || greetings.en;
      const modal = document.getElementById('modal-content');
      modal.innerHTML = `
        <button class="close-modal" onclick="closeWelcomeModal()">×</button>
        <h3 style="text-align:center;margin-bottom:12px">${g.title}</h3>
        <img src="welcome.jpg" class="img-guide" style="max-height:200px;object-fit:cover;border-radius:12px;margin-bottom:12px" alt="Welcome">
        <p style="text-align:center;white-space:pre-wrap;margin-bottom:16px;line-height:1.5">${g.msg}</p>
        <button class="btn" style="width:100%" onclick="closeWelcomeModal()">${{ko:'확인',en:'OK',ja:'確認',es:'OK'}[currentLang]||'OK'}</button>
      `;
      document.getElementById('modal-overlay').classList.remove('hidden');
      localStorage.setItem(key, '1');
      playBell(); // 1. welcome modal
    }

    function closeWelcomeModal() {
      document.getElementById('modal-overlay').classList.add('hidden');
      // After welcome, if funeral not done, gently scroll to it + play bell
      setTimeout(() => {
        const el = document.getElementById('stamp-funeral_check');
        if (el && !stamps['funeral_check']?.done) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          playBell(); // 2. funeral emphasis
        }
      }, 300);
    }

    // Called by the Logout button in the More tab
    function doLogout() {
      const hasTasks = Object.keys(stamps).length > 0 && Object.values(stamps).some(s => s && s.done);

      if (hasTasks) {
        const msg = {
          ko: '오늘 체크한 루틴(태스크)을 초기화할까요?\n\n확인 = 지우고 로그아웃\n취소 = 그대로 두고 로그아웃',
          en: 'Reset today\'s checked tasks?\n\nOK = Clear and logout\nCancel = Keep and logout',
          ja: '今日チェックしたルーティンをリセットしますか？\n\nOK = 消してログアウト\nキャンセル = そのままログアウト',
          es: '¿Restablecer las tareas marcadas de hoy?\n\nOK = Borrar y cerrar sesión\nCancelar = Mantener y cerrar sesión'
        }[currentLang] || 'Reset today\'s checked tasks?\n\nOK = Clear and logout\nCancel = Keep and logout';

        if (confirm(msg)) {
          // User chose to clear
          try {
            localStorage.removeItem(stampKey());
          } catch (e) {}
          stamps = {};
        }
        // If cancelled, just logout without clearing
      }

      logout();
    }

    function logout() {
      localStorage.removeItem('cf_currentUser');
      currentUser = null;
      // Login screen always English
      currentLang = 'en';
      applyI18n();
      const langSel = document.getElementById('lang-select');
      if (langSel) langSel.value = 'en';
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
