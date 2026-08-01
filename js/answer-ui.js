/* answer-ui.js v5.0.1 — coach-box in dock (세일즈 가이드 priority), keep goToRelatedSection */
(function () {
  function openPageGuideModal(pageId) {
    const page = document.getElementById('page-' + pageId);
    const modal = document.getElementById('modal-content');
    if (!modal) return;
    let body = '';
    if (page) {
      const clone = page.cloneNode(true);
      clone.querySelectorAll('button').forEach(function (b) {
        const oc = b.getAttribute('onclick') || '';
        if (/showPage|closeModal|toggleStamp/.test(oc)) b.remove();
      });
      body = clone.innerHTML;
    } else {
      body = '<p>Guide not found.</p>';
    }
    modal.innerHTML =
      '<button class="close-modal" onclick="closeModal()">×</button>' +
      body +
      '<div style="margin-top:14px"><button class="btn" id="guide-speak-btn" style="width:100%" onclick="speakGuideModal(this)">🔊 Read</button></div>';
    document.getElementById('modal-overlay').classList.remove('hidden');
  }

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
    const clean = (answer || '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/^#+\s*/gm, '');
    window._lastGrokAnswer = clean;

    const ansEl = document.getElementById('float-answer');
    if (ansEl) {
      ansEl.style.display = 'none';
      ansEl.textContent = clean;
    }
    const speakBtn = document.getElementById('float-speak-btn');
    if (speakBtn) speakBtn.style.display = 'inline-block';
    const tasksBtn = document.getElementById('float-tasks-btn');
    if (tasksBtn) tasksBtn.style.display = 'inline-block';

    const oldJump = document.getElementById('float-jump-btn');
    if (oldJump) oldJump.remove();

    const section =
      typeof detectRelatedSection === 'function'
        ? detectRelatedSection(question, clean)
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
