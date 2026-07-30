/* Conroy's Training App - core part A */
// ========== AUTH / USERS ==========
    const DEFAULT_USERS = [
      { username: 'admin',     password: 'admin7890', name: 'Admin' },
      { username: 'employee1', password: 'conroy1',   name: 'Employee 1' },
      { username: 'employee2', password: 'conroy2',   name: 'Employee 2' },
      { username: 'employee3', password: 'conroy3',   name: 'Employee 3' },
      { username: 'employee4', password: 'conroy4',   name: 'Employee 4' },
      { username: 'employee5', password: 'conroy5',   name: 'Employee 5' }
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
      loadUsersLocal();
      if (!usersApiUrl()) {
        serverAvailable = false;
        return;
      }
      try {
        const data = await callUsersApi({ action: 'list', adminPin: '7890' });
        if (data.ok && Array.isArray(data.users)) {
          users = data.users;
          saveUsersLocal();
          serverAvailable = true;
        }
      } catch (e) {
        console.warn('Server users unavailable, using local:', e.message);
        serverAvailable = false;
      }
    }

    let currentUser = null;
    let currentLang = 'en';
    let stamps = {};
    let recognition = null;
    let isListening = false;

    function detectBrowserLang() {
      return 'en';
    }
    async function init() {
      await loadUsers();
      // Login screen ALWAYS English
      currentLang = 'en';
      applyI18n();
      const langSel = document.getElementById('lang-select');
      if (langSel) langSel.value = 'en';
      const pwInput = document.getElementById('login-password');
      if (pwInput) {
        pwInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') doLogin();
        });
      }
      const userInput = document.getElementById('login-username');
      if (userInput) {
        userInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') document.getElementById('login-password').focus();
        });
        setTimeout(() => userInput.focus(), 300);
      }
    }

    async function doLogin() {
      const username = (document.getElementById('login-username').value || '').trim().toLowerCase();
      const password = document.getElementById('login-password').value || '';
      const errEl = document.getElementById('login-error');
      const dict = i18n[currentLang] || i18n.en;
      const btn = document.querySelector('#login-screen .btn');
      if (btn) { btn.disabled = true; btn.textContent = '...'; }

      try {
        if (usersApiUrl()) {
          try {
            const data = await callUsersApi({ action: 'login', username, password });
            if (data.ok) {
              currentUser = data.name;
              localStorage.setItem('cf_currentUser', currentUser);
              document.getElementById('login-password').value = '';
              errEl.classList.add('hidden');
              startApp();
              return;
            }
          } catch (e) {
            console.warn('Server login failed, trying local', e.message);
          }
        }

        const user = users.find(u => u.username.toLowerCase() === username && u.password === password);
        if (!user) {
          errEl.textContent = dict.login_error || 'Invalid username or password.';
          errEl.classList.remove('hidden');
          document.getElementById('login-password').value = '';
          document.getElementById('login-password').focus();
          return;
        }
        errEl.classList.add('hidden');
        errEl.textContent = '';
        currentUser = user.name;
        localStorage.setItem('cf_currentUser', currentUser);
        document.getElementById('login-password').value = '';
        startApp();
      } finally {
        if (btn) {
          btn.disabled = false;
          const d = i18n[currentLang] || i18n.en;
          btn.textContent = d.login_btn || 'Log in';
        }
      }
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
