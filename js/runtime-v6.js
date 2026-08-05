/* runtime-v6.js — v6.0.0 consolidated runtime
   Absorbs: v532~v535 patches + dock-fix core
   Titles: language-aware (default English)
*/
(function () {
  'use strict';
  var CF_VERSION = '6.0.0';
  window.CF_VERSION = CF_VERSION;

  function loadScriptOnce(src, flag) {
    if (window[flag]) return;
    window[flag] = true;
    var s = document.createElement('script');
    s.src = src + '?v=' + CF_VERSION;
    s.async = false;
    (document.head || document.documentElement).appendChild(s);
  }
  loadScriptOnce('js/tts-fix.js', '__cfTtsFixLoading');
  loadScriptOnce('js/mic-fix.js', '__cfMicFixLoading');
  loadScriptOnce('js/guide-speak.js', '__cfGuideSpeakReload');

  function bumpVersionLabel() {
    try {
      var nodes = document.querySelectorAll('p, span, div');
      for (var i = 0; i < nodes.length; i++) {
        var t = nodes[i].textContent || '';
        if (/^v\d+\.\d+\.\d+$/.test(t.trim())) nodes[i].textContent = 'v' + CF_VERSION;
        else if (/v\d+\.\d+\.\d+/.test(t) && t.length < 48) {
          nodes[i].textContent = t.replace(/v\d+\.\d+\.\d+/g, 'v' + CF_VERSION);
        }
      }
    } catch (e) {}
  }

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

  function playLoadingSoundOnce() {
    try {
      if (typeof unlockAudio === 'function') unlockAudio();
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      if (!window._cfAudioCtx) window._cfAudioCtx = new Ctx();
      var ctx = window._cfAudioCtx;
      if (ctx.state === 'suspended') { try { ctx.resume(); } catch (e) {} }
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      var t0 = ctx.currentTime;
      osc.frequency.setValueAtTime(720, t0);
      osc.frequency.exponentialRampToValueAtTime(540, t0 + 0.18);
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(0.22, t0 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.22);
      osc.start(t0);
      osc.stop(t0 + 0.25);
    } catch (e) {}
  }
  window.playLoadingSoundOnce = playLoadingSoundOnce;

  (function ensureContinuousLoading() {
    var timerKey = '_cfLoadingSoundTimer';
    function beep() {
      try {
        if (typeof unlockAudio === 'function') unlockAudio();
        var Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        if (!window._cfAudioCtx) window._cfAudioCtx = new Ctx();
        var ctx = window._cfAudioCtx;
        if (ctx.state === 'suspended') { try { ctx.resume(); } catch (e) {} }
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        var t0 = ctx.currentTime;
        osc.frequency.setValueAtTime(660, t0);
        osc.frequency.setValueAtTime(880, t0 + 0.08);
        gain.gain.setValueAtTime(0.0001, t0);
        gain.gain.exponentialRampToValueAtTime(0.18, t0 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.2);
        osc.start(t0);
        osc.stop(t0 + 0.22);
      } catch (e) {}
    }
    window.playLoadingSound = function () {
      try { if (window[timerKey]) clearInterval(window[timerKey]); } catch (e) {}
      beep();
      window[timerKey] = setInterval(beep, 900);
    };
    window.stopLoadingSound = function () {
      try { if (window[timerKey]) clearInterval(window[timerKey]); } catch (e) {}
      window[timerKey] = null;
    };
  })();

  function isBadAnswer(answer) {
    if (!answer) return true;
    var s = String(answer);
    if (/서버 오류|API 오류|Inactivity Timeout|Too much time has passed|네트워크\/Functions|504|is not valid JSON/i.test(s)) return true;
    if (/<html[\s>]|<HTML[\s>]|<head>|<HEAD>|<body[\s>]|<!DOCTYPE/i.test(s)) return true;
    if (s.length < 2) return true;
    return false;
  }
  window.isBadAnswer = isBadAnswer;

  function friendlyError() {
    var L = (typeof currentLang !== 'undefined' && currentLang) ? currentLang : 'en';
    return ({
      ko: '연결이 지연되었거나 서버 오류가 났습니다. 잠시 후 다시 시도해 주세요.',
      en: 'Connection timed out or server error. Please try again in a moment.',
      ja: '接続が遅延したか、サーバーエラーです。しばらくしてから再試行してください。',
      es: 'Tiempo de espera agotado o error del servidor. Intente de nuevo en un momento.'
    })[L] || 'Connection timed out or server error. Please try again.';
  }
  window.friendlyError = friendlyError;

  try {
    if (!document.getElementById('cf-checklist-css')) {
      var st = document.createElement('style');
      st.id = 'cf-checklist-css';
      st.textContent = '.checklist{margin:4px 0 12px}.checklist label{display:flex;align-items:flex-start;gap:10px;padding:8px 0;line-height:1.45;font-size:0.92rem;cursor:pointer;border-bottom:1px solid #f3f4f6}.checklist label:last-child{border-bottom:none}.checklist input[type=checkbox]{margin-top:3px;width:18px;height:18px;flex-shrink:0}';
      (document.head || document.documentElement).appendChild(st);
    }
  } catch (e) {}

  if (!window._cfChatHistory) window._cfChatHistory = [];

  var SHEET_LOG_URL = 'https://script.google.com/macros/s/AKfycbyCPSI0le4WHB3VfnDNDB_y8whjdktM4QEfo6AQ69abTFt5_L_torRAEoe0hRWOP7Z5LA/exec';

  function getStaffName() {
    try {
      if (window.currentUser && (window.currentUser.name || window.currentUser.username)) {
        return window.currentUser.name || window.currentUser.username;
      }
      if (typeof window.currentUser === 'string' && window.currentUser) return window.currentUser;
      var el = document.getElementById('header-user');
      if (el && el.textContent) return el.textContent.trim();
    } catch (e) {}
    return '';
  }

  function extractSection(answer) {
    try {
      var m = String(answer || '').match(/\[SECTION:\s*([a-z0-9_-]+)\s*\]/i);
      return m ? m[1] : '';
    } catch (e) { return ''; }
  }

  function logQaToSheet(question, answer) {
    try {
      if (!SHEET_LOG_URL || isBadAnswer(answer)) return;
      var payload = {
        time: new Date().toISOString(),
        user: getStaffName(),
        question: String(question || '').slice(0, 2000),
        answer: String(answer || '').slice(0, 4000),
        section: extractSection(answer)
      };
      fetch(SHEET_LOG_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      }).catch(function () {});
    } catch (e) {}
  }
  window.logQaToSheet = logQaToSheet;

  function wrapAskGrok() {
    if (typeof window.askGrok !== 'function' || window.askGrok._cfV6) return;
    async function multiTurnAsk(question) {
      var systemPrompt = window.CF_SYSTEM_PROMPT || '';
      try {
        var history = (window._cfChatHistory || []).slice(-6);
        var msgs = [{ role: 'system', content: systemPrompt }];
        history.forEach(function (h) {
          if (h && h.role && h.content) msgs.push({ role: h.role, content: String(h.content) });
        });
        var userContent = (typeof buildUserMessage === 'function') ? buildUserMessage(question) : question;
        msgs.push({ role: 'user', content: userContent });
        var res = await fetch('/.netlify/functions/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: msgs, temperature: 0.2, max_tokens: 1000 })
        });
        if (!res.ok) {
          var err = await res.text();
          var detail = err;
          try { detail = JSON.parse(err).error || err; } catch (_) {}
          window._lastManualSnippets = [];
          return '서버 오류 (' + res.status + '): ' + (detail || 'Functions 응답 실패');
        }
        var data = await res.json();
        if (data.error) {
          window._lastManualSnippets = [];
          return 'API 오류: ' + (typeof data.error === 'string' ? data.error : JSON.stringify(data.error));
        }
        window._lastManualSnippets = Array.isArray(data.manual_snippets) ? data.manual_snippets : [];
        var content = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '답변을 받지 못했습니다.';
        try {
          window._cfChatHistory.push({ role: 'user', content: question });
          window._cfChatHistory.push({ role: 'assistant', content: content });
          if (window._cfChatHistory.length > 12) window._cfChatHistory = window._cfChatHistory.slice(-12);
        } catch (e) {}
        return content;
      } catch (e) {
        window._lastManualSnippets = [];
        return '네트워크/Functions 오류: ' + (e.message || e);
      }
    }
    async function wrapped(question) {
      var answer = await multiTurnAsk(question);
      try { logQaToSheet(question, answer); } catch (e) {}
      return answer;
    }
    wrapped._cfV6 = true;
    window.askGrok = wrapped;
    try { askGrok = wrapped; } catch (e) {}
  }

  function patchDetect() {
    if (typeof window.detectRelatedSection !== 'function') return;
    var orig = window.detectRelatedSection;
    if (orig._cfV6) return;
    function wrapped(question, answer) {
      var text = ((answer || '') + ' ' + (question || '')).toLowerCase();
      if (/오더\s*확인|주문\s*확인|order\s*(status|check|lookup)|look\s*up\s*order|주문\s*조회|오더\s*조회|tracking|트래킹|where\s*is\s*(my\s*)?order|배송\s*상태|주문\s*상태/.test(text)) {
        if (typeof sectionById === 'function') return sectionById('bmsflow');
      }
      if (isBadAnswer(answer)) return null;
      return orig(question, answer);
    }
    wrapped._cfV6 = true;
    window.detectRelatedSection = wrapped;
    try { detectRelatedSection = wrapped; } catch (e) {}
  }

  function filterBotText(text) {
    if (isBadAnswer(text)) {
      try { if (typeof removeCoachBox === 'function') removeCoachBox(); } catch (e) {}
      window._lastRelatedSection = null;
      return friendlyError();
    }
    return text;
  }

  function patchAppend() {
    if (typeof window.appendGrokMessage === 'function' && !window.appendGrokMessage._cfV6) {
      var ao = window.appendGrokMessage;
      window.appendGrokMessage = function (text, type) {
        if (type === 'bot') text = filterBotText(text);
        return ao.call(this, text, type);
      };
      window.appendGrokMessage._cfV6 = true;
    }
  }

  function watchMessages() {
    var box = document.getElementById('grok-messages');
    if (!box || box._cfV6obs) return;
    box._cfV6obs = true;
    var obs = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        m.addedNodes.forEach(function (node) {
          if (!node || node.nodeType !== 1) return;
          if (!node.classList || !node.classList.contains('grok-msg')) return;
          if (!node.classList.contains('bot')) return;
          var t = node.textContent || '';
          if (isBadAnswer(t)) {
            node.textContent = friendlyError();
            try { if (typeof removeCoachBox === 'function') removeCoachBox(); } catch (e) {}
            window._lastRelatedSection = null;
          }
        });
      });
    });
    obs.observe(box, { childList: true });
  }

  function safeAppend(text, type) {
    try {
      var box = document.getElementById('grok-messages');
      if (!box) return;
      var div = document.createElement('div');
      div.className = 'grok-msg ' + (type || 'bot');
      div.textContent = text;
      box.appendChild(div);
      box.scrollTop = box.scrollHeight;
    } catch (e) { console.warn('safeAppend', e); }
  }

  function ensureDockVisible() {
    var dock = document.getElementById('grok-dock');
    if (dock) dock.classList.remove('hidden');
  }

  function getCoachTitle(section, L) {
    var id = ((section && (section.id || section.type)) || '').toLowerCase();
    var map = {
      sales:        { en: 'Sales Guide',       ko: '세일즈 가이드',   ja: 'セールスガイド',     es: 'Guía de ventas' },
      phone:        { en: 'Phone Script',      ko: '전화 스크립트',   ja: '電話スクリプト',     es: 'Guion telefónico' },
      delivery:     { en: 'Delivery Guide',    ko: '배달 가이드',     ja: '配達ガイド',         es: 'Guía de entrega' },
      attachments:  { en: 'Attachments Guide', ko: '첨부물 가이드',   ja: '添付物ガイド',       es: 'Guía de adjuntos' },
      bmsflow:      { en: 'BMS Flow',          ko: 'BMS 흐름',        ja: 'BMSフロー',          es: 'Flujo BMS' },
      messages:     { en: 'Messages',          ko: '메시지',          ja: 'メッセージ',         es: 'Mensajes' },
      golden:       { en: 'Golden Rules',      ko: '골든 룰',         ja: 'ゴールデンルール',   es: 'Reglas de oro' },
      home:         { en: 'Today Routine',     ko: '오늘 루틴',       ja: '本日のルーチン',     es: 'Rutina de hoy' }
    };
    if (map[id]) return map[id][L] || map[id].en;
    if (section && section.label) return section.label[L] || section.label.en || section.label.ko || 'Guide';
    return 'Guide';
  }

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

  window.showWelcomeInDock = function () {
    var name = (typeof currentUser !== 'undefined' && currentUser) ? currentUser : '';
    if (!name) return;
    var dayKey = 'cf_greeted_' + name + '_' + (typeof todayKey === 'function' ? todayKey() : new Date().toISOString().slice(0, 10));
    var firstToday = localStorage.getItem(dayKey) !== '1';
    if (firstToday) localStorage.setItem(dayKey, '1');
    var L = (typeof currentLang !== 'undefined' && currentLang) ? currentLang : getSavedLang();
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
    if (typeof getNextRoutineTask === 'function') { try { next = getNextRoutineTask(); } catch (e) {} }
    if (next && typeof showCoachBox === 'function') {
      var title = (next.title && (next.title[L] || next.title.en || next.title.ko)) || next.id;
      var desc = (next.desc && (next.desc[L] || next.desc.en || next.desc.ko)) || '';
      window._lastRelatedSection = {
        type: 'task', id: next.id,
        label: { ko: title, en: title, ja: title, es: title },
        summary: {
          ko: desc || ('다음 할 일: ' + title),
          en: desc || ('Next: ' + title),
          ja: desc || ('次: ' + title),
          es: desc || ('Siguiente: ' + title)
        },
        speakText: msg
      };
      try { showCoachBox(window._lastRelatedSection); } catch (e) {}
    }
    (function speakWelcome(text, n) {
      n = n || 0;
      try { if (typeof unlockAudio === 'function') unlockAudio(); } catch (e) {}
      if (typeof speakText === 'function') {
        try { speakText(text, null); return; } catch (e) {}
      }
      if (n < 8) setTimeout(function () { speakWelcome(text, n + 1); }, 400);
    })(msg, 0);
    if (next) {
      setTimeout(function () {
        try {
          var el = document.getElementById('stamp-' + next.id);
          if (el) el.classList.add('next-task');
        } catch (e) {}
      }, 300);
    }
  };

  function installCoachBoxSpeak() {
    function renderBox(section) {
      if (!section) return;
      var L = (typeof currentLang !== 'undefined' && currentLang) ? currentLang : 'en';
      var title = getCoachTitle(section, L);
      var summary = (section.summary && (section.summary[L] || section.summary.en || section.summary.ko)) || '';
      var speakLbl = ({ ko: '🔊 읽기', en: '🔊 Read', ja: '🔊 読む', es: '🔊 Leer' })[L] || '🔊 Read';
      var detailLbl = ({ ko: '자세히 보기', en: 'See details', ja: '詳細を見る', es: 'Ver detalles' })[L] || 'See details';
      var toSpeak = (section.speakText || (title + (summary ? '. ' + summary : ''))).trim();
      window._lastCoachSpeak = toSpeak;
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
        '<button type="button" class="btn btn-sm" id="float-coach-detail-btn" style="width:100%;margin-top:4px">' + detailLbl + '</button>' +
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
      if (window._cfGreetedSession) return;
      ensureDockVisible();
      hideLangSelect();
      var box = document.getElementById('grok-messages');
      if (!box) return;
      if (box.querySelector('.grok-msg')) {
        window._cfGreetedSession = true;
        return;
      }
      var name = (typeof currentUser !== 'undefined' && currentUser) ? currentUser : '';
      if (!name) return;
      try { currentLang = getSavedLang(); } catch (e) {}
      installCoachBoxSpeak();
      if (typeof showWelcomeInDock === 'function') {
        try {
          window._cfGreetedSession = true;
          showWelcomeInDock();
          return;
        } catch (e) { window._cfGreetedSession = false; }
      }
    } catch (e) {}
  }

  function patchStartApp() {
    if (typeof window.startApp !== 'function' && typeof startApp !== 'function') return;
    var orig = window.startApp || startApp;
    if (orig._cfV6) return;
    function wrapped() {
      hideLangSelect();
      bindAudioUnlock();
      installCoachBoxSpeak();
      var saved = getSavedLang();
      try {
        currentLang = saved;
        localStorage.setItem('cf_lang', saved);
      } catch (e) {}
      var r = orig.apply(this, arguments);
      try {
        localStorage.setItem('cf_lang', saved);
        if (typeof setAppLanguage === 'function') setAppLanguage(saved);
      } catch (e) {}
      ensureDockVisible();
      setTimeout(ensureGreeting, 300);
      setTimeout(ensureGreeting, 900);
      setTimeout(ensureGreeting, 1800);
      return r;
    }
    wrapped._cfV6 = true;
    window.startApp = wrapped;
    try { startApp = wrapped; } catch (e) {}
  }

  function patchSubmit() {
    async function safeSubmit() {
      try { if (typeof unlockAudio === 'function') unlockAudio(); } catch (e) {}
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
      try { if (typeof removeCoachBox === 'function') removeCoachBox(); } catch (e) {}

      try {
        if (typeof playLoadingSound === 'function') playLoadingSound();
        else if (typeof playLoadingSoundOnce === 'function') playLoadingSoundOnce();
        else if (typeof playBell === 'function') playBell();
      } catch (e) {}
      try {
        var L = (typeof currentLang !== 'undefined' && currentLang) ? currentLang : 'en';
        var loadingTxt = ({ ko: '찾는 중…', en: 'Looking up…', ja: '検索中…', es: 'Buscando…' })[L] || 'Looking up…';
        safeAppend(loadingTxt, 'bot');
        var msgs = document.getElementById('grok-messages');
        if (msgs) {
          var last = msgs.querySelector('.grok-msg.bot:last-child');
          if (last) last.id = 'cf-loading-msg';
        }
      } catch (e) {}

      var answer = null;
      try {
        if (typeof askGrok === 'function') answer = await askGrok(q);
      } catch (e) {
        answer = null;
      } finally {
        try { if (typeof stopLoadingSound === 'function') stopLoadingSound(); } catch (e) {}
        try {
          var loadEl = document.getElementById('cf-loading-msg');
          if (loadEl && loadEl.parentNode) loadEl.parentNode.removeChild(loadEl);
        } catch (e) {}
      }

      if (answer) {
        var displayAnswer = String(answer).replace(/\[SECTION:[^\]]+\]/gi, '').replace(/\s{2,}/g, ' ').trim();
        if (isBadAnswer(displayAnswer)) {
          var failShort = (currentLang === 'ko') ? '잠시 후 다시 시도해 주세요. (서버 응답 오류)' : 'Please try again shortly. (server error)';
          safeAppend(failShort, 'bot');
          return;
        }
        safeAppend(displayAnswer, 'bot');
        try {
          if (typeof showAnswerInPanel === 'function') showAnswerInPanel(q, answer);
        } catch (e) {}
        try {
          var section = (typeof detectRelatedSection === 'function') ? detectRelatedSection(q, answer) : null;
          window._lastRelatedSection = section;
          if (section && typeof showCoachBox === 'function') {
            showCoachBox(section);
          } else if (!section && window._lastManualSnippets && window._lastManualSnippets.length && typeof showManualEvidenceBox === 'function') {
            showManualEvidenceBox(window._lastManualSnippets);
          }
        } catch (e) {}
        (function speakRetry(text, n) {
          n = n || 0;
          try { if (typeof unlockAudio === 'function') unlockAudio(); } catch (e) {}
          if (typeof speakText === 'function') {
            try { speakText(text, null); return; } catch (e) {}
          }
          if (n < 8) setTimeout(function () { speakRetry(text, n + 1); }, 400);
        })(displayAnswer, 0);
      } else {
        var fail = (currentLang === 'ko') ? '답변을 받지 못했습니다. 다시 시도해 주세요.' : 'No answer received. Please try again.';
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
    installCoachBoxSpeak();
    patchStartApp();
    patchSubmit();
    wrapAskGrok();
    patchDetect();
    patchAppend();
    watchMessages();
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
  setTimeout(function () {
    installCoachBoxSpeak();
    wrapAskGrok();
  }, 1200);
})();
