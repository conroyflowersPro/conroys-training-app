/* Answer UI: related guide button inside chat answer area (v1.19.1) */
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
      '<div style="margin-top:14px"><button class="btn" id="guide-speak-btn" style="width:100%" onclick="speakGuideModal(this)">🔊 Read aloud</button></div>';
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
        try {
          closeFloatPanel();
        } catch (e) {}
        if (typeof showPage === 'function') showPage('home');
        return;
      }
      openPageGuideModal(section.id);
    }
  };

  window.showAnswerInPanel = function (question, answer) {
    const clean = (answer || '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/^#+\s*/gm, '');
    window._lastGrokAnswer = clean;

    const ansEl = document.getElementById('float-answer');
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

    if (!ansEl) return;

    // Build answer chat HTML: text + guide button INSIDE answer area
    let html =
      '<div class="float-answer-text" style="white-space:pre-wrap">' +
      escapeHtml(clean) +
      '</div>';

    if (section) {
      const lbl =
        (section.label && (section.label[currentLang] || section.label.en)) ||
        'Guide';
      html +=
        '<button type="button" id="float-jump-btn" class="btn btn-sm" ' +
        'style="margin-top:12px;width:100%" ' +
        'onclick="goToRelatedSection(window._lastRelatedSection)">' +
        '📖 ' +
        escapeHtml(lbl) +
        '</button>';
      if (typeof setFloatStatus === 'function') {
        setFloatStatus(
          (question ? 'Q: ' + question + ' · ' : '') + 'Tap guide button in answer'
        );
      }
    } else if (typeof setFloatStatus === 'function') {
      setFloatStatus(
        (question ? 'Q: ' + question + ' · ' : '') + 'Read aloud or Tasks'
      );
    }

    ansEl.innerHTML = html;
  };

  function escapeHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
})();
