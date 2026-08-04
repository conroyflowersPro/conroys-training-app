/* ui-layout.js v5.3.0 — chat-first home, routine accordion, quick chips */
(function () {
  var routineOpen = false;

  function t(map) {
    var L = (typeof currentLang !== 'undefined' && currentLang) ? currentLang : 'en';
    return map[L] || map.en || '';
  }

  window.toggleRoutineList = function () {
    var list = document.getElementById('stamp-list');
    var btn = document.getElementById('routine-accordion-btn');
    if (!list) return;
    routineOpen = !routineOpen;
    if (routineOpen) {
      list.classList.add('open');
      if (btn) btn.classList.add('open');
    } else {
      list.classList.remove('open');
      if (btn) btn.classList.remove('open');
    }
    updateAccordionLabel();
  };

  function updateAccordionLabel() {
    var label = document.getElementById('routine-accordion-label');
    if (!label) return;
    var done = 0, total = 0;
    try {
      if (typeof routineTasks !== 'undefined' && typeof stamps !== 'undefined') {
        total = routineTasks.length;
        done = routineTasks.filter(function (task) { return stamps[task.id] && stamps[task.id].done; }).length;
      }
    } catch (e) {}
    if (routineOpen) {
      label.textContent = t({
        ko: '루틴 접기 (' + done + '/' + total + ')',
        en: 'Hide checklist (' + done + '/' + total + ')',
        ja: 'チェックリストを閉じる (' + done + '/' + total + ')',
        es: 'Ocultar lista (' + done + '/' + total + ')'
      });
    } else {
      label.textContent = t({
        ko: '루틴 체크리스트 보기 (' + done + '/' + total + ')',
        en: 'View routine checklist (' + done + '/' + total + ')',
        ja: 'ルーチンを見る (' + done + '/' + total + ')',
        es: 'Ver lista de rutina (' + done + '/' + total + ')'
      });
    }
  }

  function updateNextRow() {
    var textEl = document.getElementById('next-task-text');
    var labelEl = document.getElementById('next-label');
    if (!textEl) return;
    var next = null;
    try {
      if (typeof getNextTask === 'function') next = getNextTask();
    } catch (e) {}
    if (labelEl) {
      labelEl.textContent = t({ ko: '다음', en: 'Next', ja: '次', es: 'Sig.' });
    }
    if (!next) {
      textEl.textContent = t({
        ko: '오늘 루틴 완료 ✓',
        en: 'Today\'s routine done ✓',
        ja: '本日のルーチン完了 ✓',
        es: 'Rutina de hoy completa ✓'
      });
      return;
    }
    var title = (next.title && (next.title[currentLang] || next.title.en || next.title.ko)) || next.id;
    textEl.textContent = title;
  }

  window.quickGuideAsk = function (kind) {
    var prompts = {
      customer: {
        ko: '손님이 들어왔을 때 응대 순서를 알려주세요.',
        en: 'Walk-in customer just arrived. What is the sales flow?',
        ja: '来店のお客様の対応の流れを教えてください。',
        es: 'Llegó un cliente. ¿Cuál es el flujo de ventas?'
      },
      phone: {
        ko: '전화가 왔을 때 응대 스크립트를 알려주세요.',
        en: 'Phone is ringing. What is the phone script?',
        ja: '電話がかかってきたときの対応スクリプトを教えてください。',
        es: 'Suena el teléfono. ¿Cuál es el script?'
      },
      messages: {
        ko: 'Messages에서 새 주문이 왔을 때 처리 순서를 알려주세요.',
        en: 'New order in Messages. What is the process?',
        ja: 'Messagesに新しい注文が来たときの処理順を教えてください。',
        es: 'Hay un pedido nuevo en Messages. ¿Cuál es el proceso?'
      },
      delivery: {
        ko: '배달 설정과 Out for Delivery 처리 방법을 알려주세요.',
        en: 'How do I handle delivery setup and Out for Delivery?',
        ja: '配達設定と Out for Delivery の処理を教えてください。',
        es: '¿Cómo configuro la entrega y Out for Delivery?'
      }
    };
    var L = (typeof currentLang !== 'undefined' && currentLang) ? currentLang : 'en';
    var q = (prompts[kind] && (prompts[kind][L] || prompts[kind].en)) || '';
    if (!q) return;
    if (typeof showPage === 'function') showPage('home');
    var input = document.getElementById('float-chat-input');
    if (input) input.value = q;
    if (typeof submitFloatChat === 'function') submitFloatChat();
  };

  function patchRenderStamps() {
    if (typeof window.renderStamps !== 'function' && typeof renderStamps !== 'function') return;
    var orig = window.renderStamps || renderStamps;
    if (orig._cf530) return;
    function wrapped() {
      orig.apply(this, arguments);
      try {
        updateAccordionLabel();
        updateNextRow();
        var list = document.getElementById('stamp-list');
        var btn = document.getElementById('routine-accordion-btn');
        if (list) {
          if (routineOpen) list.classList.add('open');
          else list.classList.remove('open');
        }
        if (btn) {
          if (routineOpen) btn.classList.add('open');
          else btn.classList.remove('open');
        }
      } catch (e) {}
    }
    wrapped._cf530 = true;
    window.renderStamps = wrapped;
    try { renderStamps = wrapped; } catch (e) {}
  }

  function ensureChatHome() {
    var dock = document.getElementById('grok-dock');
    if (dock) dock.classList.remove('hidden');
    updateAccordionLabel();
    updateNextRow();
  }

  function boot() {
    patchRenderStamps();
    ensureChatHome();
    setTimeout(function () {
      patchRenderStamps();
      ensureChatHome();
      if (typeof renderStamps === 'function') {
        try { renderStamps(); } catch (e) {}
      }
    }, 400);
    setTimeout(ensureChatHome, 1200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  window.addEventListener('load', function () { setTimeout(boot, 200); });
})();
