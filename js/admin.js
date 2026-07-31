/* Conroy's Training App - admin + i18n v1.21.0 */
    let versionTapCount = 0;
    let versionTapTimer = null;
    function onVersionTap() {
      versionTapCount++;
      clearTimeout(versionTapTimer);
      versionTapTimer = setTimeout(() => { versionTapCount = 0; }, 1200);
      if (versionTapCount >= 3) {
        versionTapCount = 0;
        if (currentUser !== 'Admin') {
          alert(currentLang === 'ko' ? 'Admin 계정으로 로그인한 경우에만 사용할 수 있습니다.' : 'Admin access only. Please log in as Admin.');
          return;
        }
        openAdminPanel();
      }
    }

    function adminStatusMsg(text, isError) {
      let el = document.getElementById('admin-status-msg');
      if (!el) return;
      el.textContent = text || '';
      el.style.color = isError ? 'var(--danger)' : 'var(--success)';
    }

    function renderAdminUserList() {
      const listEl = document.getElementById('admin-user-list');
      if (!listEl) return;
      let html = '';
      users.forEach((u, idx) => {
        const canDelete = u.username !== 'admin';
        html += `
          <div style="background:var(--card);border:1px solid #e5e7eb;border-radius:10px;padding:10px 12px;margin-bottom:8px;" data-username="${u.username}">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">
              <div>
                <div style="font-weight:600">${u.name}</div>
                <div style="font-size:0.85rem;color:var(--muted)">ID: <code>${u.username}</code></div>
              </div>
              <div style="display:flex;gap:6px">
                <button class="btn btn-sm btn-outline" onclick="adminChangePassword(${idx})">Change PW</button>
                ${canDelete ? `<button class="btn btn-sm" style="background:var(--danger)" onclick="adminDeleteUser(${idx})">Delete</button>` : '<span style="font-size:0.8rem;color:var(--muted)">protected</span>'}
              </div>
            </div>
          </div>`;
      });
      listEl.innerHTML = html;
    }

    function clearAdminAddForm() {
      const a = document.getElementById('admin-new-username');
      const b = document.getElementById('admin-new-name');
      const c = document.getElementById('admin-new-password');
      if (a) a.value = '';
      if (b) b.value = '';
      if (c) c.value = '';
    }

    async function openAdminPanel() {
      if (currentUser !== 'Admin') {
        alert(currentLang === 'ko' ? 'Admin 계정으로 로그인한 경우에만 사용할 수 있습니다.' : 'Admin access only. Please log in as Admin.');
        return;
      }
      await loadUsers();
      const modal = document.getElementById('modal-content');
      const modeText = serverAvailable
        ? '✅ Server connected · Same accounts on every device'
        : '⚠️ Local mode · Saved on this device only';

      let html = `<button class="close-modal" onclick="closeModal()">×</button>
        <h3>👔 Admin – v1.21.0</h3>
        <p style="font-size:0.85rem;color:var(--muted);margin-bottom:10px">${modeText}</p>
        <p id="admin-status-msg" style="font-size:0.9rem;margin-bottom:10px;min-height:1.2em"></p>

        <div class="card" style="margin-bottom:14px">
          <strong>${currentUser || '-'} (current login)</strong><br>`;
      let done = 0;
      routineTasks.forEach(t => {
        const s = stamps[t.id];
        const title = (t.title && (t.title[currentLang] || t.title.en || t.title.ko)) || t.id;
        if (s?.done) {
          done++;
          html += `<div style="font-size:0.9rem">✓ ${title} <span style="color:var(--muted)">${s.time || ''}</span></div>`;
        } else {
          html += `<div style="font-size:0.9rem;color:var(--muted)">○ ${title}</div>`;
        }
      });
      html += `<div style="margin-top:6px;font-weight:600">${done}/${routineTasks.length} done</div></div>`;

      html += `<h4 style="margin:16px 0 8px;font-size:1rem">👤 Account management</h4>`;
      html += `<div id="admin-user-list" style="margin-bottom:14px"></div>`;

      html += `
        <div class="card" style="margin-bottom:12px">
          <div style="font-weight:600;margin-bottom:8px">➕ Add new account</div>
          <input type="text" id="admin-new-username" placeholder="Username (letters/numbers)" style="width:100%;padding:10px;margin-bottom:6px;border:2px solid #e5e7eb;border-radius:8px;font-size:0.95rem">
          <input type="text" id="admin-new-name" placeholder="Display name (e.g. Kim)" style="width:100%;padding:10px;margin-bottom:6px;border:2px solid #e5e7eb;border-radius:8px;font-size:0.95rem">
          <input type="text" id="admin-new-password" placeholder="Password" style="width:100%;padding:10px;margin-bottom:8px;border:2px solid #e5e7eb;border-radius:8px;font-size:0.95rem">
          <button class="btn" style="width:100%" onclick="adminAddUser()">Add account</button>
        </div>`;

      html += `<div class="alert alert-info" style="font-size:0.85rem">On Netlify, account changes sync to every device. Local mode saves on this device only.</div>`;
      html += `<button class="btn btn-outline" style="width:100%;margin-top:8px" onclick="adminResetUsers()">Reset to default accounts</button>`;
      html += `<button class="btn btn-outline" style="width:100%;margin-top:8px" onclick="exportProgress()">Export progress JSON</button>`;

      modal.innerHTML = html;
      renderAdminUserList();
      document.getElementById('modal-overlay').classList.remove('hidden');
    }

    async function adminAddUser() {
      const username = (document.getElementById('admin-new-username').value || '').trim().toLowerCase();
      const name = (document.getElementById('admin-new-name').value || '').trim();
      const password = (document.getElementById('admin-new-password').value || '').trim();
      if (!username || !name || !password) {
        adminStatusMsg('Enter username, display name, and password.', true);
        return;
      }

      if (usersApiUrl()) {
        try {
          const data = await callUsersApi({ action: 'add', adminPin: '7890', username, password, name });
          if (data.ok && data.users) {
            users = data.users;
            saveUsersLocal();
            renderAdminUserList();
            clearAdminAddForm();
            adminStatusMsg('Account added (saved on server).');
            return;
          }
        } catch (e) {
          adminStatusMsg('Server save failed: ' + e.message + ' — saving locally.', true);
        }
      }

      if (users.some(u => (u.username || '').toLowerCase() === username)) {
        adminStatusMsg('Username already exists.', true);
        return;
      }
      users.push({ username, password, name });
      saveUsersLocal();
      renderAdminUserList();
      clearAdminAddForm();
      adminStatusMsg('Account added (this device only).');
    }

    async function adminChangePassword(idx) {
      const u = users[idx];
      if (!u) return;
      const newPw = prompt('New password for "' + u.name + '" (' + u.username + '):');
      if (newPw === null) return;
      if (!newPw.trim()) {
        adminStatusMsg('Password required.', true);
        return;
      }

      if (usersApiUrl()) {
        try {
          const data = await callUsersApi({
            action: 'updatePassword',
            adminPin: '7890',
            username: u.username,
            password: newPw.trim()
          });
          if (data.ok && data.users) {
            users = data.users;
            saveUsersLocal();
            renderAdminUserList();
            adminStatusMsg('Password updated (server).');
            return;
          }
        } catch (e) {
          adminStatusMsg('Server update failed: ' + e.message, true);
        }
      }

      users[idx].password = newPw.trim();
      saveUsersLocal();
      renderAdminUserList();
      adminStatusMsg('Password updated (this device only).');
    }

    async function adminDeleteUser(idx) {
      const u = users[idx];
      if (!u) return;
      if (u.username === 'admin') {
        adminStatusMsg('Cannot delete admin account.', true);
        return;
      }
      if (!confirm('Delete "' + u.name + '" (' + u.username + ')?')) return;

      if (usersApiUrl()) {
        try {
          const data = await callUsersApi({ action: 'delete', adminPin: '7890', username: u.username });
          if (data.ok && data.users) {
            users = data.users;
            saveUsersLocal();
            renderAdminUserList();
            adminStatusMsg('Account deleted (server).');
            return;
          }
        } catch (e) {
          adminStatusMsg('Server delete failed: ' + e.message, true);
        }
      }

      users.splice(idx, 1);
      saveUsersLocal();
      renderAdminUserList();
      adminStatusMsg('Account deleted (this device only).');
    }

    async function adminResetUsers() {
      if (!confirm('Reset all accounts to defaults?')) return;

      if (usersApiUrl()) {
        try {
          const data = await callUsersApi({ action: 'reset', adminPin: '7890' });
          if (data.ok && data.users) {
            users = data.users;
            saveUsersLocal();
            renderAdminUserList();
            adminStatusMsg('Reset to defaults (server).');
            return;
          }
        } catch (e) {
          adminStatusMsg('Server reset failed: ' + e.message, true);
        }
      }

      users = JSON.parse(JSON.stringify(DEFAULT_USERS));
      saveUsersLocal();
      renderAdminUserList();
      adminStatusMsg('Reset to defaults (this device).');
    }

    function exportProgress() {
      const data = {
        user: currentUser,
        date: todayKey(),
        stamps: stamps,
        exportedAt: new Date().toISOString()
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `progress_${currentUser}_${todayKey()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      adminStatusMsg(currentLang === 'ko' ? '진행 상황이 파일로 저장되었습니다.' : 'Progress exported.');
    }

    function changeLang(lang) {
      if (typeof setAppLanguage === 'function') setAppLanguage(lang);
      else {
        currentLang = lang || 'en';
        localStorage.setItem('cf_lang', currentLang);
        const langSel = document.getElementById('lang-select');
        if (langSel) langSel.value = currentLang;
        applyI18n();
        renderStamps();
        checkEndOfDayReminder();
      }
    }
    function applyI18n() {
      const dict = i18n[currentLang] || i18n.en;
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) el.textContent = dict[key];
      });
      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (dict[key]) el.placeholder = dict[key];
      });
      const langSel = document.getElementById('lang-select');
      if (langSel && langSel.value !== currentLang) langSel.value = currentLang;
      const nextLabel = document.getElementById('next-label');
      if (nextLabel) nextLabel.textContent = {ko:'다음',en:'Next',ja:'次',es:'Siguiente'}[currentLang]||'Next';
      const titles = {ko:'질문하기 (음성 / 채팅)',en:'Ask (voice / chat)',ja:'質問 (音声 / チャット)',es:'Preguntar (voz / chat)'};
      const titleDiv = document.querySelector('#float-mic-panel > div:first-child');
      if (titleDiv) titleDiv.textContent = titles[currentLang] || titles.en;
    }

    init();
