/* v5.3.5 — log Q&A to Google Sheets (Apps Script web app) */
(function () {
  var SHEET_LOG_URL = 'https://script.google.com/macros/s/AKfycbyCPSI0le4WHB3VfnDNDB_y8whjdktM4QEfo6AQ69abTFt5_L_torRAEoe0hRWOP7Z5LA/exec';

  function getStaffName() {
    try {
      if (window.currentUser && (window.currentUser.name || window.currentUser.username)) {
        return window.currentUser.name || window.currentUser.username;
      }
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

  function isBadAnswer(answer) {
    var a = String(answer || '');
    if (!a || a.length < 2) return true;
    if (/서버 오류|API 오류|네트워크\/Functions|504|Inactivity Timeout|<!DOCTYPE|is not valid JSON/i.test(a)) return true;
    return false;
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

  function wrapAskGrokForLog() {
    if (typeof window.askGrok !== 'function') return;
    if (window.askGrok._cf535log) return;
    var orig = window.askGrok;
    async function wrapped(question) {
      var answer = await orig(question);
      try { logQaToSheet(question, answer); } catch (e) {}
      return answer;
    }
    wrapped._cf535log = true;
    wrapped._cf534 = orig._cf534;
    window.askGrok = wrapped;
    try { askGrok = wrapped; } catch (e) {}
  }

  function boot() {
    wrapAskGrokForLog();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 120); });
  } else {
    setTimeout(boot, 120);
  }
  setTimeout(boot, 800);
  setTimeout(boot, 2000);
})();
