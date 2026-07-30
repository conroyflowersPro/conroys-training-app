/* Conroy's Training App - auto-split for reliable GitHub deploy */
    // ========== ADMIN (Admin login only) ==========
    // Admin card in More tab is visible only when logged in as Admin.
    // Triple-tap version number is also restricted to Admin user.
    // Admin PIN = 7890 (backup)
    // When deployed on Netlify → accounts are shared via Blobs (all devices see the same list)
    // When opened as local files → falls back to this device only
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

    async function openAdminPanel() {
      if (currentUser !== 'Admin') {
        alert(currentLang === 'ko' ? 'Admin 계정으로 로그인한 경우에만 사용할 수 있습니다.' : 'Admin access only. Please log in as Admin.');
        return;
      }
      await loadUsers();
      const modal = document.getElementById('modal-content');
      const modeText = serverAvailable
        ? '✅ Server connected · Same accounts on every device'
        : '⚠️ Local mode · Saved on this device only (syncs after Netlify deploy)';

      let html = `<button class="close-modal" onclick="closeModal()">×</button>
        <h3>👔 Admin – v1.14.1</h3>
        <p style="font-size:0.85rem;color:var(--muted);margin-bottom:10px">${modeText}</p>

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
      html += `<div id="admin-user-list" style="margin-bottom:14px">`;
      users.forEach((u, idx) => {
        const canDelete = u.username !== 'admin';
        html += `
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:10px 12px;margin-bottom:8px;" data-username="${u.username}">
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
      html += `</div>`;

      html += `
        <div class="card" style="margin-bottom:12px">
          <div style="font-weight:600;margin-bottom:8px">➕ Add new account</div>
          <input type="text" id="admin-new-username" placeholder="Username (letters/numbers)" style="width:100%;padding:10px;margin-bottom:6px;border:2px solid var(--border);border-radius:8px;font-size:0.95rem">
          <input type="text" id="admin-new-name" placeholder="Display name (e.g. Kim)" style="width:100%;padding:10px;margin-bottom:6px;border:2px solid var(--border);border-radius:8px;font-size:0.95rem">
          <input type="text" id="admin-new-password" placeholder="Password" style="width:100%;padding:10px;margin-bottom:8px;border:2px solid var(--border);border-radius:8px;font-size:0.95rem">
          <button class="btn" style="width:100%" onclick="adminAddUser()">Add account</button>
        </div>`;

      html += `<div class="alert alert-info" style="font-size:0.85rem">When deployed on Netlify, account changes appear on every device immediately. Local file mode saves only on this device.</div>`;
      html += `<button class="btn btn-outline" style="width:100%;margin-top:8px" onclick="adminResetUsers()">Reset to default accounts</button>`;
      html += `<button class="btn btn-outline" style="width:100%;margin-top:8px" onclick="exportProgress()">Export progress JSON</button>`;

      modal.innerHTML = html;
      document.getElementById('modal-overlay').classList.remove('hidden');
    }

    async function adminAddUser() {
      const username = (document.getElementById('admin-new-username').value || '').trim().toLowerCase();
      const name = (document.getElementById('admin-new-name').value || '').trim();
      const password = (document.getElementById('admin-new-password').value || '').trim();
      if (!username || !name || !password) {
        alert('아이디, 이름, 비밀번호를 모두 입력하세요.');
        return;
      }

      if (usersApiUrl()) {
        try {
          const data = await callUsersApi({ action: 'add', adminPin: '7890', username, password, name });
          if (data.ok && data.users) {
            users = data.users;
            saveUsersLocal();
            await openAdminPanel();
            alert('계정이 추가되었습니다. (서버에 저장됨)');
            return;
          }
        } catch (e) {
          alert('서버 저장 실패: ' + e.message + '\n로컬에만 저장합니다.');
        }
      }

      if (users.some(u => u.username.toLowerCase() === username)) {
        alert('이미 존재하는 아이디입니다.');
        return;
      }
      users.push({ username, password, name });
      saveUsersLocal();
      await openAdminPanel();
      alert('계정이 추가되었습니다. (이 기기에만 저장)');
    }

    async function adminChangePassword(idx) {
      const u = users[idx];
      if (!u) return;
      const newPw = prompt(`"${u.name}" (${u.username}) 의 새 비밀번호를 입력하세요:`);
      if (newPw === null) return;
      if (!newPw.trim()) {
        alert('비밀번호를 입력하세요.');
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
            await openAdminPanel();
            alert('비밀번호가 변경되었습니다. (서버에 저장됨)');
            return;
          }
        } catch (e) {
          alert('서버 저장 실패: ' + e.message);
        }
      }

      users[idx].password = newPw.trim();
      saveUsersLocal();
      await openAdminPanel();
      alert('비밀번호가 변경되었습니다. (이 기기에만 저장)');
    }

    async function adminDeleteUser(idx) {
      const u = users[idx];
      if (!u) return;
      if (u.username === 'admin') {
        alert('admin 계정은 삭제할 수 없습니다.');
        return;
      }
      if (!confirm(`"${u.name}" (${u.username}) 계정을 삭제할까요?`)) return;

      if (usersApiUrl()) {
        try {
          const data = await callUsersApi({ action: 'delete', adminPin: '7890', username: u.username });
          if (data.ok && data.users) {
            users = data.users;
            saveUsersLocal();
            await openAdminPanel();
            return;
          }
        } catch (e) {
          alert('서버 삭제 실패: ' + e.message);
        }
      }

      users.splice(idx, 1);
      saveUsersLocal();
      await openAdminPanel();
    }

    async function adminResetUsers() {
      if (!confirm('모든 계정을 기본값으로 초기화할까요?')) return;

      if (usersApiUrl()) {
        try {
          const data = await callUsersApi({ action: 'reset', adminPin: '7890' });
          if (data.ok && data.users) {
            users = data.users;
            saveUsersLocal();
            await openAdminPanel();
            alert('기본 계정으로 초기화되었습니다. (서버)');
            return;
          }
        } catch (e) {
          alert('서버 초기화 실패: ' + e.message);
        }
      }

      users = JSON.parse(JSON.stringify(DEFAULT_USERS));
      saveUsersLocal();
      await openAdminPanel();
      alert('기본 계정으로 초기화되었습니다. (이 기기)');
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
      alert(currentLang==='ko'?'진행 상황이 파일로 저장되었습니다.':'Progress exported as JSON file.');
    }

    // ========== I18N ==========
    function changeLang(lang) {
      currentLang = lang || 'en';
      localStorage.setItem('cf_lang', currentLang);
      const langSel = document.getElementById('lang-select');
      if (langSel) langSel.value = currentLang;
      applyI18n();
      renderStamps();
      checkEndOfDayReminder();
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
      const titles = {ko:'음성으로 질문하기',en:'Ask by voice',ja:'音声で質問',es:'Preguntar por voz'};
      const titleDiv = document.querySelector('#float-mic-panel > div:first-child');
      if (titleDiv) titleDiv.textContent = titles[currentLang] || titles.en;
    }

    // Start
    init();
