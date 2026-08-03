/* load tts-fix after voice modules */
(function(){
  if (window.__cfTtsFixLoading) return;
  window.__cfTtsFixLoading = true;
  var s = document.createElement('script');
  s.src = 'js/tts-fix.js?v=5.0.7';
  s.async = false;
  (document.head || document.documentElement).appendChild(s);
})();

/* dock-fix.js v5.0.7 — coaching boot self-contained */
(function () {
  function getSavedLang() {
    try {
      var s = localStorage.getItem('cf_lang');
      if (s && ['en', 'ko', 'ja', 'es'].indexOf(s) >= 0) return s;
    } catch (e) {}
    return 'en';
  }

  function hideLangSelect() {
    try {
      var sel = document.getElementById('lang-select');
      if (sel) sel.style.display = 'none';
    } catch (e) {}
  }

  function bumpVersionLabel() {
    try {
      var nodes = document.querySelectorAll('p, span, div');
      for (var i = 0; i < nodes.length; i++) {
        var t = nodes[i].textContent || '';
        if (/^v5\.0\.[0-6]$/.test(t.trim())) nodes[i].textContent = 'v5.0.7';
        else if (/v5\.0\.[0-6]/.test(t) && t.length < 48) nodes[i].textContent = t.replace(/v5\.0\.[0-6]/g, 'v5.0.7');
      }
    } catch (e) {}
  }

  window.unlockAudio = function unlockAudio() {
    try {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) {
        if (!window._cfAudioCtx) window._cfAudioCtx = new Ctx();
        if (window._cfAudioCtx.state === 'suspended') window._cfAudioCtx.resume();
      }
    } catch (e) {}
    try { if (window.speechSynthesis) window.speechSynthesis.resume(); } catch (e) {}
    try {
      var a = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=');
      a.volume = 0.01;
      var p = a.play();
      if (p && p.catch) p.catch(function () {});
    } catch (e) {}
  };

  function bindAudioUnlock() {
    if (window._cfAudioUnlockBound) return;
    window._cfAudioUnlockBound = true;
    var once = function () { window.unlockAudio(); };
    document.addEventListener('touchstart', once, { passive: true });
    document.addEventListener('click', once, { passive: true });
  }

  function ensureDockVisible() {
    var dock = document.getElementById('grok-dock');
    if (dock) dock.classList.remove('hidden');
  }

  function safeAppend(text, type) {
    try {
      if (typeof appendGrokMessage === 'function') appendGrokMessage(text, type || 'bot');
      else {
        var box = document.getElementById('grok-messages');
        if (!box) return;
        var div = document.createElement('div');
        div.className = 'grok-msg ' + (type || 'bot');
        div.style.whiteSpace = 'pre-wrap';
        div.textContent = text;
        box.appendChild(div);
      }
    } catch (e) { console.warn('safeAppend', e); }
  }

  function installCoachWelcome() {
    window.buildDailyRoutineSpeech = function () {
      var L = (typeof currentLang !== 'undefined' && currentLang) ? currentLang : 'en';
      var next = null;
      if (typeof getNextRoutineTask === 'function') {
        try { next = getNextRoutineTask(); } catch (e) { next = null; }
      }
      if (!next) {
        return ({
          ko: '오늘 데일리 루틴은 모두 끝났습니다.',
          en: "Today's daily routine is all done.",
          ja: '本日のデイリールーチンはすべて完了です。',
          es: 'La rutina diaria de hoy ya está completa.'
        })[L] || "Today's daily routine is all done.";
      }
      var title = (next.title && (next.title[L] || next.title.en || next.title.ko)) || next.id;
      return ({
        ko: '다음 태스크는 「' + title + '」입니다.',
        en: 'Next task is 「' + title + '」.',
        ja: '次のタスクは「' + title + '」です。',
        es: 'La siguiente tarea es 「' + title + '」.'
      })[L] || ('Next task is 「' + title + '」.');
    };
    try { buildDailyRoutineSpeech = window.buildDailyRoutineSpeech; } catch (e) {}

    window.showWelcomeInDock = function () {
      var dayKey = 'cf_greeted_' + (currentUser || 'user') + '_' + (typeof todayKey === 'function' ? todayKey() : new Date().toISOString().slice(0, 10));
      var firstToday = localStorage.getItem(dayKey) !== '1';
      if (firstToday) localStorage.setItem(dayKey, '1');
      var L = (typeof currentLang !== 'undefined' && currentLang) ? currentLang : getSavedLang();
      var name = currentUser || '';
      var nextLine = window.buildDailyRoutineSpeech();
      var msg;
      if (firstToday) {
        var hello = ({
          ko: name + '님 안녕하세요.',
          en: 'Hello ' + name + '.',
          ja: name + 'さん、こんにちは。',
          es: 'Hola ' + name + '.'
        })[L] || ('Hello ' + name + '.');
        msg = hello + ' ' + nextLine;
      } else {
        msg = nextLine;
      }
      if (typeof appendGrokMessage === 'function') appendGrokMessage(msg, 'bot');
      else safeAppend(msg, 'bot');
      try { if (typeof playBell === 'function') playBell(); } catch (e) {}
      var next = null;
      if (typeof getNextRoutineTask === 'function') {
        try { next = getNextRoutineTask(); } catch (e) {}
      }
      if (next && typeof showCoachBox === 'function') {
        var title = (next.title && (next.title[L] || next.title.en || next.title.ko)) || next.id;
        var desc = (next.desc && (next.desc[L] || next.desc.en || next.desc.ko)) || '';
        window._lastRelatedSection = {
          type: 'task',
          id: next.id,
          label: { ko: title, en: title, ja: title, es: title },
          summary: {
            ko: desc || ('다음 할 일: ' + title),
            en: desc || ('Next: ' + title),
            ja: desc || ('次: ' + title),
            es: desc || ('Siguiente: ' + title)
          },
          speakText: msg
        };
        try { showCoachBox(window._lastRelatedSection); } catch (e) { console.warn(e); }
      }
      if (typeof speakText === 'function') {
        setTimeout(function () {
          try { speakText(msg, null); } catch (e) { console.warn('welcome TTS', e); }
        }, 500);
      }
      if (next) {
        setTimeout(function () {
          try {
            var el = document.getElementById('stamp-' + next.id);
            if (el) el.classList.add('next-task');
          } catch (e) {}
        }, 350);
      }
      setTimeout(function () {
        try { if (typeof showFuneralInDock === 'function') showFuneralInDock(); } catch (e) {}
      }, 500);
    };
    try { showWelcomeInDock = window.showWelcomeInDock; } catch (e) {}
  }

  function installCoachBoxSpeak() {
    function renderBox(section) {
      if (!section) return;
      var L = (typeof currentLang !== 'undefined' && currentLang) ? currentLang : 'en';
      var title = (section.label && (section.label[L] || section.label.en)) || 'Guide';
      var summary = (section.summary && (section.summary[L] || section.summary.en)) || '';
      var speakLbl = ({ ko: '🔊 읽기', en: '🔊 Read', ja: '🔊 読む', es: '🔊 Leer' })[L] || '🔊 Read';
      var detailLbl = ({ ko: '자세히 보기', en: 'See details', ja: '詳細を見る', es: 'Ver detalles' })[L] || 'See details';
      var toSpeak = (section.speakText || (title + (summary ? '. ' + summary : ''))).trim();
      window._lastCoachSpeak = toSpeak;
      window._lastRelatedSection = section;
      if (typeof removeCoachBox === 'function') removeCoachBox();
      else {
        var old = document.getElementById('float-coach-box');
        if (old) old.remove();
      }
      var box = document.createElement('div');
      box.id = 'float-coach-box';
      box.className = 'coach-box';
      box.innerHTML =
        '<div class="coach-box-title">🏷️ ' + title + '</div>' +
        (summary ? '<div class="coach-box-summary">' + summary + '</div>' : '') +
        '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px">' +
        '<button type="button" class="btn btn-sm" id="float-coach-speak-btn">' + speakLbl + '</button>' +
        '<button type="button" class="btn btn-sm btn-outline" id="float-coach-detail-btn">' + detailLbl + '</button>' +
        '</div>';
      var messages = document.getElementById('grok-messages');
      if (messages) {
        messages.appendChild(box);
        messages.scrollTop = messages.scrollHeight;
      }
      var speakBtn = document.getElementById('float-coach-speak-btn');
      if (speakBtn) {
        speakBtn.onclick = function () {
          if (typeof unlockAudio === 'function') try { unlockAudio(); } catch (e) {}
          var t = window._lastCoachSpeak || toSpeak;
          if (typeof speakText === 'function') speakText(t, speakBtn);
        };
      }
      var detailBtn = document.getElementById('float-coach-detail-btn');
      if (detailBtn) {
        detailBtn.onclick = function () {
          var sec = window._lastRelatedSection || section;
          if (sec && sec.type === 'task' && typeof showTaskDetail === 'function') {
            showTaskDetail(sec.id);
            return;
          }
          if (typeof goToRelatedSection === 'function') goToRelatedSection(sec);
        };
      }
    }
    window.showCoachBox = renderBox;
    try { showCoachBox = renderBox; } catch (e) {}
  }

  function ensureGreeting() {
    try {
      ensureDockVisible();
      hideLangSelect();
      var box = document.getElementById('grok-messages');
      if (!box) return;
      if (box.querySelector('.grok-msg')) return;
      var name = (typeof currentUser !== 'undefined' && currentUser) ? currentUser : '';
      if (!name) return;
      try { currentLang = getSavedLang(); } catch (e) {}
      installCoachWelcome();
      installCoachBoxSpeak();
      if (typeof showWelcomeInDock === 'function') {
        try { showWelcomeInDock(); return; } catch (e) { console.warn(e); }
      }
    } catch (e) { console.warn('ensureGreeting', e); }
  }

  function patchStartApp() {
    if (typeof window.startApp !== 'function' && typeof startApp !== 'function') return;
    var orig = window.startApp || startApp;
    if (orig._cf507) return;
    function wrapped() {
      hideLangSelect();
      bindAudioUnlock();
      installCoachWelcome();
      installCoachBoxSpeak();
      var saved = getSavedLang();
      try {
        currentLang = saved;
        localStorage.setItem('cf_lang', saved);
      } catch (e) {}
      var result;
      try { result = orig.apply(this, arguments); } catch (e) { console.warn('startApp', e); }
      try {
        currentLang = saved;
        localStorage.setItem('cf_lang', saved);
        hideLangSelect();
        if (typeof applyI18n === 'function') applyI18n();
        if (typeof renderStamps === 'function') renderStamps();
      } catch (e) {}
      try { ensureDockVisible(); } catch (e) {}
      bumpVersionLabel();
      setTimeout(ensureGreeting, 80);
      setTimeout(ensureGreeting, 500);
      return result;
    }
    wrapped._cf507 = true;
    startApp = wrapped;
    window.startApp = wrapped;
  }

  function patchSubmit() {
    async function safeSubmit() {
      window.unlockAudio();
      var input = document.getElementById('float-chat-input');
      if (!input) return;
      var q = (input.value || '').trim();
      if (!q) return;
      input.value = '';
      var spokenLang = (typeof detectLang === 'function') ? detectLang(q) : 'en';
      var newLang = spokenLang === 'es-ES' ? 'es' : (spokenLang || 'en');
      try {
        if (typeof setAppLanguage === 'function') setAppLanguage(newLang);
        else {
          currentLang = newLang;
          localStorage.setItem('cf_lang', newLang);
          if (typeof applyI18n === 'function') applyI18n();
        }
      } catch (e) {}
      hideLangSelect();
      safeAppend(q, 'user');
      try { if (typeof setFloatStatus === 'function') setFloatStatus('Q: ' + q); } catch (e) {}
      var ansEl = document.getElementById('float-answer');
      if (ansEl) ansEl.textContent = 'Loading answer...';
      var speakBtn = document.getElementById('float-speak-btn');
      if (speakBtn) speakBtn.style.display = 'none';
      var tasksBtn = document.getElementById('float-tasks-btn');
      if (tasksBtn) tasksBtn.style.display = 'none';
      try { if (typeof removeCoachBox === 'function') removeCoachBox(); } catch (e) {}
      var answer = null;
      try {
        if (typeof askGrok === 'function') answer = await askGrok(q);
      } catch (e) { console.warn('askGrok', e); }
      if (answer) {
        try { if (typeof showAnswerInPanel === 'function') showAnswerInPanel(q, answer); } catch (e) {}
        safeAppend(answer, 'bot');
        if (typeof speakText === 'function') {
          setTimeout(function () {
            try { speakText(answer, null); } catch (e) { console.warn('auto-speak', e); }
          }, 300);
        }
      } else {
        var fail = (currentLang === 'ko')
          ? '답변을 받지 못했습니다. 다시 시도해 주세요.'
          : 'No answer received. Please try again.';
        if (ansEl) ansEl.textContent = fail;
        try { if (typeof setFloatStatus === 'function') setFloatStatus(fail); } catch (e) {}
        safeAppend(fail, 'bot');
      }
    }
    submitFloatChat = safeSubmit;
    window.submitFloatChat = safeSubmit;
  }

  function patchLangVisibility() {
    if (typeof updateLangSelectVisibility === 'function') {
      updateLangSelectVisibility = function () { hideLangSelect(); };
      window.updateLangSelectVisibility = updateLangSelectVisibility;
    }
  }

  function boot() {
    hideLangSelect();
    bumpVersionLabel();
    bindAudioUnlock();
    patchLangVisibility();
    installCoachWelcome();
    installCoachBoxSpeak();
    patchStartApp();
    patchSubmit();
    try {
      var app = document.getElementById('app');
      if (app && !app.classList.contains('hidden')) {
        ensureDockVisible();
        setTimeout(ensureGreeting, 200);
      }
    } catch (e) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 0); });
  } else {
    setTimeout(boot, 0);
  }
  setTimeout(boot, 300);
  setTimeout(boot, 1000);
  setTimeout(function () { installCoachWelcome(); installCoachBoxSpeak(); }, 1200);
})();
