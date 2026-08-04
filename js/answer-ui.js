/* answer-ui.js v5.2.0 — coach-box in dock, no jump button inside answer */
(function () {
  window.openPageGuideModal = function (pageId) {
    var titles = {
      customer: { ko: '세일즈 가이드', en: 'Sales Guide', ja: 'セールスガイド', es: 'Guía de ventas' },
      phone: { ko: 'Phone Script', en: 'Phone Script', ja: 'Phone Script', es: 'Phone Script' },
      messages: { ko: 'Messages', en: 'Messages', ja: 'Messages', es: 'Messages' },
      home: { ko: '오늘 루틴', en: 'Today routine', ja: '今日のルーティン', es: 'Rutina de hoy' }
    };
    var title = (titles[pageId] && (titles[pageId][currentLang] || titles[pageId].en)) || pageId;
    var body = document.getElementById('modal-content');
    if (!body) return;
    body.innerHTML = '<button class="close-modal" onclick="closeModal()">×</button><h2>' + title + '</h2><p style="color:var(--muted);font-size:0.9rem;margin:8px 0 14px">Guide detail for this section.</p><div style="margin-top:14px"><button class="btn" id="guide-speak-btn" style="width:100%" onclick="speakGuideModal(this)">🔊 Read</button></div>';
    document.getElementById('modal-overlay').classList.remove('hidden');
  };

  window.goToRelatedSection = function (section) {
    if (!section) return;
    if (section.type === 'content' && typeof showContent === 'function') {
      showContent(section.id);
      return;
    }
    if (section.type === 'task' && typeof showTaskDetail === 'function') {
      showTaskDetail(section.id);
      return;
    }
    if (section.type === 'page') {
      if (section.id === 'home') {
        try { closeFloatPanel(); } catch (e) {}
        if (typeof showPage === 'function') showPage('home');
        return;
      }
      openPageGuideModal(section.id);
    }
  };

  /** v5 coach UI: short answer text + titled coach-box in dock (not jump button inside answer) */
  window.showAnswerInPanel = function (question, answer) {
    const forDetect = (answer || '');
    const clean = (answer || '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/^#+\s*/gm, '')
      .replace(/\[SECTION:[^\]]+\]/gi, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
    window._lastGrokAnswer = clean;

    const ansEl = document.getElementById('float-answer');
    if (ansEl) {
      ansEl.style.display = 'none';
      ansEl.textContent = clean;
    }
    var st = document.getElementById('float-status');
    if (st) st.style.display = 'block';
    const speakBtn = document.getElementById('float-speak-btn');
    if (speakBtn) speakBtn.style.display = 'inline-block';
    const tasksBtn = document.getElementById('float-tasks-btn');
    if (tasksBtn) tasksBtn.style.display = 'inline-block';

    const oldJump = document.getElementById('float-jump-btn');
    if (oldJump) oldJump.remove();

    const section =
      typeof detectRelatedSection === 'function'
        ? detectRelatedSection(question, forDetect)
        : null;
    window._lastRelatedSection = section;

    if (typeof removeCoachBox === 'function') removeCoachBox();
    else {
      const oldBox = document.getElementById('float-coach-box');
      if (oldBox) oldBox.remove();
    }

    if (section) {
      const lbl =
        (section.label && (section.label[currentLang] || section.label.en)) ||
        'Guide';
      if (typeof setFloatStatus === 'function') {
        setFloatStatus((question ? 'Q: ' + question + ' · ' : '') + '🏷️ ' + lbl);
      }
      if (typeof showCoachBox === 'function') {
        showCoachBox(section);
      }
    } else if (typeof setFloatStatus === 'function') {
      setFloatStatus((question ? 'Q: ' + question + ' · ' : '') + '🔊 Read · 📋 Tasks');
    }
  };
})();
