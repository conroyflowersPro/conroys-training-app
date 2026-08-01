/* voice-override.js v5.0.1 — Tasks next-only + gold mic currentAudio */
(function () {
  window.currentAudio = window.currentAudio || null;

  window.buildRemainingTasksText = function () {
    var lang = (typeof currentLang !== 'undefined' ? currentLang : null) || 'en';
    var next = null;
    if (typeof getNextTask === 'function') {
      try { next = getNextTask(); } catch (e) { next = null; }
    }
    if (!next && typeof routineTasks !== 'undefined') {
      var pending = routineTasks.filter(function (t) {
        return !(stamps[t.id] && stamps[t.id].done);
      });
      next = pending.length ? pending[0] : null;
    }
    if (!next) {
      return ({
        ko: '오늘 남은 할 일이 없습니다. 모든 루틴을 완료했습니다.',
        en: 'No remaining tasks today. All routines are done.',
        ja: '今日の残りのタスクはありません。すべて完了です。',
        es: 'No quedan tareas hoy. Todas las rutinas están hechas.'
      })[lang] || 'No remaining tasks today.';
    }
    var title = (next.title && (next.title[lang] || next.title.en)) || next.id;
    return ({
      ko: '다음 할 일은 ' + title + '입니다.',
      en: 'Next: ' + title + '.',
      ja: '次は' + title + 'です。',
      es: 'Siguiente: ' + title + '.'
    })[lang] || ('Next: ' + title + '.');
  };

  // Keep gold mic state in sync when speakText sets currentAudio
  var origSpeak = window.speakText;
  if (typeof origSpeak === 'function') {
    window.speakText = async function (text, btn) {
      try {
        if (typeof window.setMicSpeaking === 'function') window.setMicSpeaking(true);
        return await origSpeak(text, btn);
      } finally {
        // voice-ui-fix handles gold clear timing
      }
    };
  }
})();
