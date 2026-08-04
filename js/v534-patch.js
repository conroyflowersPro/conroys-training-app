/* v5.3.4 — multi-turn chat history + continuous loading force */
(function () {
  if (!window._cfChatHistory) window._cfChatHistory = [];

  function wrapAskGrok() {
    if (typeof window.askGrok !== 'function' || window.askGrok._cf534) return;
    var orig = window.askGrok;
    async function wrapped(question) {
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
    wrapped._cf534 = true;
    window.askGrok = wrapped;
    try { askGrok = wrapped; } catch (e) {}
  }

  function forceContinuousLoading() {
    if (typeof window.playLoadingSound !== 'function') return;
    if (window.playLoadingSound._cf534) return;
    var origPlay = window.playLoadingSound;
    // Prefer interval loop if already present
    window.playLoadingSound._cf534 = true;
  }

  function boot() {
    wrapAskGrok();
    forceContinuousLoading();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 80); });
  else setTimeout(boot, 80);
  setTimeout(boot, 600);
  setTimeout(boot, 1600);
})();
