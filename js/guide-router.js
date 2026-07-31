/* Route showContent and page guides to detailed manuals (v1.20.0) */
(function () {
  var DETAIL_KEYS = {
    attachments: 'attachments',
    bmsflow: 'bmsflow',
    delivery: 'delivery',
    golden: 'golden',
    decision: 'decision',
    customer: 'customer',
    phone: 'phone',
    messages: 'messages'
  };

  function openDetailModal(key) {
    var htmlBody =
      typeof renderGuideDetailHtml === 'function' ? renderGuideDetailHtml(key) : null;
    if (!htmlBody) return false;
    var modal = document.getElementById('modal-content');
    if (!modal) return false;
    modal.innerHTML =
      '<button class="close-modal" onclick="closeModal()">×</button>' +
      htmlBody +
      '<div style="margin-top:14px"><button class="btn" id="guide-speak-btn" style="width:100%" onclick="speakGuideModal(this)">🔊 Read aloud</button></div>';
    document.getElementById('modal-overlay').classList.remove('hidden');
    return true;
  }

  var origShowContent = window.showContent;
  window.showContent = function (type) {
    if (DETAIL_KEYS[type] && openDetailModal(DETAIL_KEYS[type])) return;
    if (typeof origShowContent === 'function') return origShowContent.apply(this, arguments);
  };

  var origShowPage = window.showPage;
  window.showPage = function (id) {
    if (DETAIL_KEYS[id] && openDetailModal(DETAIL_KEYS[id])) return;
    if (typeof origShowPage === 'function') return origShowPage.apply(this, arguments);
  };

  window.goToRelatedSection = function (section) {
    if (!section) return;
    if (section.type === 'content' && section.id && openDetailModal(section.id)) return;
    if (section.type === 'page' && section.id && DETAIL_KEYS[section.id]) {
      if (openDetailModal(DETAIL_KEYS[section.id])) return;
    }
    if (section.type === 'page' && section.id === 'home') {
      try {
        closeFloatPanel();
      } catch (e) {}
      if (typeof origShowPage === 'function') origShowPage('home');
      return;
    }
    if (section.type === 'task' && typeof showTaskDetail === 'function') {
      showTaskDetail(section.id);
    }
  };
})();
