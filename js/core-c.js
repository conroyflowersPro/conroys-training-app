/* Conroy's Training App - content modals v1.14.4 */
    // Checklist items are language maps so guides follow currentLang (or voice-detected lang)
    const taskDetails = {
      open_shop: {
        content: {
          ko: '가게를 열 때 가장 먼저 하는 일입니다. 외부 게이트/펜스가 있다면 열고, 필요시 조명을 켭니다.',
          en: 'First actions when opening the shop. Open outside gate/fence if needed and turn on lights.',
          ja: '開店時に最初に行う作業です。外のゲートやフェンスを開け、必要に応じて照明をつけます。',
          es: 'Primeras acciones al abrir la tienda. Abra el portón/cerca exterior si es necesario y encienda las luces.'
        },
        checklist: {
          ko: ['게이트/펜스 열기', '조명 켜기', 'POS 시스템으로 이동'],
          en: ['Open gate/fence', 'Turn on lights', 'Go to POS system'],
          ja: ['ゲート/フェンスを開ける', '照明をつける', 'POSシステムへ'],
          es: ['Abrir portón/cerca', 'Encender luces', 'Ir al sistema POS']
        }
      },
      start_day: {
        content: {
          ko: 'Home → Start Day / End Day. Open Cash Drawer (비밀번호 123456). 권종별 수량을 입력하세요. Start Day Amount는 항상 $200.00.',
          en: 'Home → Start Day / End Day. Open Cash Drawer (password 123456). Enter quantity of each denomination. Must equal $200.00.',
          ja: 'Home → Start Day / End Day。Open Cash Drawer（パスワード123456）。各金種の数量を入力。必ず$200.00。',
          es: 'Home → Start Day / End Day. Open Cash Drawer (contraseña 123456). Ingrese cantidad de cada denominación. Debe ser $200.00.'
        },
        checklist: {
          ko: ['캐시 드로어 열기', '권종별 수량 입력', '$200.00 확인', '금액 + 사진 앱에 저장'],
          en: ['Open cash drawer', 'Enter qty per denomination', 'Confirm $200.00', 'Save amount + photo in app'],
          ja: ['キャッシュドロワーを開く', '金種別数量入力', '$200.00確認', '金額+写真をアプリに保存'],
          es: ['Abrir cajón de efectivo', 'Ingresar cantidad por denominación', 'Confirmar $200.00', 'Guardar monto + foto en la app']
        }
      },
      cooler_vase: {
        content: {
          ko: '쿨러 안 화병 어레인지먼트를 모두 점검합니다. 물이 흐리거나 부족하면 즉시 교체하고, 손상된 꽃은 제거합니다.',
          en: 'Inspect all vase arrangements in the cooler. Replace cloudy/low water, remove damaged flowers.',
          ja: 'クーラー内の花瓶アレンジメントをすべて点検。濁った水や少ない水は交換し、傷んだ花を取り除きます。',
          es: 'Revise todos los arreglos en jarrón del cooler. Cambie agua turbia/baja y quite flores dañadas.'
        },
        checklist: {
          ko: ['물 상태 확인', '손상된 꽃 제거', '필요시 물 교체'],
          en: ['Check water condition', 'Remove damaged flowers', 'Replace water if needed'],
          ja: ['水の状態確認', '傷んだ花を除去', '必要なら水を交換'],
          es: ['Revisar estado del agua', 'Quitar flores dañadas', 'Cambiar agua si es necesario']
        }
      },
      cooler_loose: {
        content: {
          ko: '루스 플라워 버킷을 점검합니다. 물을 보충하고, 손상된 꽃/잎을 제거한 뒤 색상과 종류별로 정리합니다.',
          en: 'Check loose flower buckets. Refill water, remove damaged flowers/leaves, organize by color.',
          ja: '切り花のバケツを点検。水を補充し、傷んだ花/葉を取り除き、色・種類別に整理します。',
          es: 'Revise los cubos de flores sueltas. Rellene agua, quite flores/hojas dañadas y organice por color.'
        },
        checklist: {
          ko: ['물 보충', '손상 꽃/잎 제거', '색상·종류별 정리'],
          en: ['Refill water', 'Remove damaged flowers/leaves', 'Organize by color/type'],
          ja: ['水を補充', '傷んだ花/葉を除去', '色・種類別に整理'],
          es: ['Rellenar agua', 'Quitar flores/hojas dañadas', 'Organizar por color/tipo']
        }
      },
      messages_check: {
        content: {
          ko: 'Messages를 열어 내용을 확인한 뒤 Mark Read를 누르고, In Wire에서 Accept 합니다. Reject는 매니저 승인 없이 절대 누르지 마세요.',
          en: 'Review Messages → Mark Read → Accept in In Wire. Never Reject without manager approval.',
          ja: 'Messagesを開いて内容を確認し、Mark Readを押し、In WireでAcceptします。マネージャー承認なしにRejectしないでください。',
          es: 'Revise Messages → Mark Read → Accept en In Wire. Nunca haga Reject sin aprobación del gerente.'
        },
        checklist: {
          ko: ['Messages 열기', '주문 내용 확인', 'Mark Read', 'In Wire에서 Accept'],
          en: ['Open Messages', 'Review order details', 'Mark Read', 'Accept in In Wire'],
          ja: ['Messagesを開く', '注文内容を確認', 'Mark Read', 'In WireでAccept'],
          es: ['Abrir Messages', 'Revisar detalles del pedido', 'Mark Read', 'Accept en In Wire']
        }
      },
      monitor_orders: {
        content: {
          ko: '하루 종일 들어오는 주문을 Due Time 기준으로 우선순위를 정해 처리합니다.',
          en: 'Monitor incoming orders and prioritize by Due Time.',
          ja: '一日中入ってくる注文をDue Time基準で優先順位をつけて処理します。',
          es: 'Supervise los pedidos entrantes y priorice según Due Time.'
        },
        checklist: {
          ko: ['Due Time 확인', '급한 주문 우선 처리'],
          en: ['Check Due Time', 'Prioritize urgent orders'],
          ja: ['Due Timeを確認', '急ぎの注文を優先'],
          es: ['Revisar Due Time', 'Priorizar pedidos urgentes']
        }
      },
      attachments: {
        content: {
          ko: 'White Sheet의 Product Detail을 보고 첨부물이 있는지 확인합니다. 첨부물이 있으면 White Sheet를 떼지 말고 모두 확인·부착한 뒤에만 Set As Awaiting Delivery를 합니다.',
          en: 'Check Product Detail on White Sheet for attachments. Do not remove White Sheet until all are verified and attached.',
          ja: 'White SheetのProduct Detailで添付物を確認。すべて確認・取り付けが終わるまでWhite Sheetを外さないでください。',
          es: 'Revise Product Detail en la White Sheet. No quite la White Sheet hasta verificar y colocar todos los adjuntos.'
        },
        checklist: {
          ko: ['White Sheet Product Detail 확인', '풍선/초콜릿/인형/카드 준비', '모두 부착 확인'],
          en: ['Check White Sheet Product Detail', 'Prepare balloons/chocolates/plush/card', 'Confirm all attached'],
          ja: ['White Sheet Product Detail確認', 'バルーン/チョコ/ぬいぐるみ/カード準備', 'すべて取り付け確認'],
          es: ['Revisar Product Detail de White Sheet', 'Preparar globos/chocolates/peluche/tarjeta', 'Confirmar todos colocados']
        }
      },
      end_day: {
        content: {
          ko: '정확히 $200.00을 캐시 드로어에 남깁니다. Summary Receipt를 출력하고, 초과 현금을 봉투에 넣어 금고에 보관합니다.',
          en: 'Leave exactly $200.00 in the drawer. Print Summary Receipt, put excess cash in deposit envelope → safe.',
          ja: 'ドロワーに正確に$200.00を残します。Summary Receiptを印刷し、超過分を封筒に入れて金庫へ。',
          es: 'Deje exactamente $200.00 en el cajón. Imprima Summary Receipt, ponga el exceso en sobre de depósito → caja fuerte.'
        },
        checklist: {
          ko: ['$200 남기기', 'Summary Receipt 출력', '초과 현금 봉투에 넣기', 'End Register Session'],
          en: ['Leave $200', 'Print Summary Receipt', 'Put excess cash in envelope', 'End Register Session'],
          ja: ['$200を残す', 'Summary Receipt印刷', '超過現金を封筒へ', 'End Register Session'],
          es: ['Dejar $200', 'Imprimir Summary Receipt', 'Poner exceso en sobre', 'End Register Session']
        }
      }
    };

    function showTaskDetail(taskId) {
      const task = routineTasks.find(t => t.id === taskId);
      const detail = taskDetails[taskId];
      if (!task || !detail) return;
      const title = task.title[currentLang] || task.title.en;
      const content = detail.content[currentLang] || detail.content.en;
      const checks = (detail.checklist && (detail.checklist[currentLang] || detail.checklist.en)) || [];
      const modal = document.getElementById('modal-content');
      let html = `<button class="close-modal" onclick="closeModal()">×</button>
        <h3>${title}</h3>
        <div class="script-box" style="margin-bottom:14px">${content}</div>
        <p style="font-weight:600;margin-bottom:8px">${{ko:'체크리스트',en:'Checklist',ja:'チェックリスト',es:'Lista'}[currentLang]||'Checklist'}</p>
        <div class="checklist">`;
      checks.forEach(item => {
        html += `<label><input type="checkbox"> ${item}</label>`;
      });
      html += `</div>`;
      if (!stamps[taskId]?.done) {
        html += `<button class="btn" style="width:100%;margin-top:16px" onclick="closeModal(); toggleStamp('${taskId}')">${{ko:'이 항목 완료 처리',en:'Mark as Done',ja:'完了にする',es:'Marcar como hecho'}[currentLang]||'Mark as Done'}</button>`;
      }
      modal.innerHTML = html;
      document.getElementById('modal-overlay').classList.remove('hidden');
    }

    function showContent(type) {
      const modal = document.getElementById('modal-content');
      let html = `<button class="close-modal" onclick="closeModal()">×</button>`;
      const L = currentLang;

      if (type === 'attachments') {
        const titles = {ko:'첨부물 체크리스트', en:'Attachment Checklist', ja:'添付物チェックリスト', es:'Lista de adjuntos'};
        const warn = {
          ko: 'White Sheet는 모든 첨부물 확인·부착이 끝나기 전까지 떼지 마세요!',
          en: 'Do not remove the White Sheet until ALL attachments are verified!',
          ja: 'すべての添付物の確認・取り付けが終わるまでWhite Sheetを外さないでください！',
          es: '¡No quite la White Sheet hasta verificar TODOS los adjuntos!'
        };
        html += `<h3>${titles[L]||titles.en}</h3>
          <div class="checklist">
            <label><input type="checkbox"> Balloons / 풍선 / バルーン / Globos</label>
            <label><input type="checkbox"> Chocolates / 초콜릿 / チョコレート</label>
            <label><input type="checkbox"> Plush / Teddy / 인형 / ぬいぐるみ / Peluche</label>
            <label><input type="checkbox"> CardIsle Greeting Card</label>
          </div>
          <div class="alert alert-warn" style="margin-top:12px">${warn[L]||warn.en}</div>`;
      } else if (type === 'bmsflow') {
        const titles = {ko:'BMS 주문 처리 흐름', en:'BMS Workflow', ja:'BMS注文処理フロー', es:'Flujo de pedidos BMS'};
        const steps = {
          ko: [
            '새 주문 수신 (Messages / In Wire)',
            '내용 검토 → Mark Read',
            'In Wire에서 Accept',
            'SuperTicket 출력',
            '디자인 + 첨부물 작업',
            'Set As Awaiting Delivery',
            '배달 트립 생성'
          ],
          en: [
            'New Order Received (Messages / In Wire)',
            'Review → Mark Read',
            'Accept Order (In Wire)',
            'Print SuperTicket',
            'Design + Attachments',
            'Set As Awaiting Delivery',
            'Create Delivery Trip'
          ],
          ja: [
            '新規注文受信 (Messages / In Wire)',
            '内容確認 → Mark Read',
            'In WireでAccept',
            'SuperTicket印刷',
            'デザイン + 添付物',
            'Set As Awaiting Delivery',
            '配達トリップ作成'
          ],
          es: [
            'Nuevo pedido recibido (Messages / In Wire)',
            'Revisar → Mark Read',
            'Accept en In Wire',
            'Imprimir SuperTicket',
            'Diseño + Adjuntos',
            'Set As Awaiting Delivery',
            'Crear viaje de entrega'
          ]
        };
        const list = steps[L] || steps.en;
        html += `<h3>${titles[L]||titles.en}</h3>
          <ol style="padding-left:20px;line-height:1.8">
            ${list.map(s => `<li>${s}</li>`).join('')}
          </ol>`;
      } else if (type === 'delivery') {
        const titles = {ko:'배달 가이드', en:'Delivery Guide', ja:'配達ガイド', es:'Guía de entrega'};
        html += `<h3>${titles[L]||titles.en}</h3>
          <div class="script-box"><strong>Standard</strong><br>Provider: Walmart GoLocal · 3Hr Window</div>
          <div class="script-box"><strong>Funeral</strong><br>Provider: Uber · ASAP</div>`;
      } else if (type === 'golden') {
        const titles = {ko:'Golden Rules', en:'Golden Rules', ja:'Golden Rules', es:'Golden Rules'};
        const rules = {
          ko: [
            'Due Time 기준으로 주문 우선순위를 정한다.',
            '인쇄된 Design Ticket 없이 디자인을 시작하지 않는다.',
            '필요한 작업이 모두 끝날 때까지 Complete 하지 않는다.',
            '배송일 변경 전에 반드시 Delivery Attempted 메시지를 보낸다.',
            '확신이 없으면 먼저 매니저에게 문의한다.'
          ],
          en: [
            'Always prioritize orders based on Due Time.',
            'Never begin designing without a printed design ticket.',
            'Do not complete an order until all required work is finished.',
            'Always send a Delivery Attempted message before changing the delivery date.',
            'If unsure, contact a manager before taking action.'
          ],
          ja: [
            'Due Timeを基準に注文の優先順位を決める。',
            '印刷されたDesign Ticketなしにデザインを始めない。',
            '必要な作業がすべて終わるまでCompleteしない。',
            '配達日変更前に必ずDelivery Attemptedメッセージを送る。',
            '確信がなければ先にマネージャーに相談する。'
          ],
          es: [
            'Priorice siempre los pedidos según Due Time.',
            'Nunca comience a diseñar sin un ticket de diseño impreso.',
            'No complete un pedido hasta terminar todo el trabajo requerido.',
            'Siempre envíe un mensaje Delivery Attempted antes de cambiar la fecha de entrega.',
            'Si no está seguro, consulte a un gerente antes de actuar.'
          ]
        };
        const list = rules[L] || rules.en;
        html += `<h3>${titles[L]||titles.en}</h3>
          <ol style="padding-left:20px;line-height:1.7">
            ${list.map(r => `<li>${r}</li>`).join('')}
          </ol>`;
      } else if (type === 'decision') {
        const titles = {ko:'모르겠을 때', en:'If Unsure', ja:'迷ったとき', es:'Si no está seguro'};
        const msgs = {
          ko: 'Golden Rule #5: 확신이 없으면 먼저 매니저에게 문의하세요.',
          en: 'Golden Rule #5: If unsure, contact a manager first.',
          ja: 'Golden Rule #5: 確信がなければ先にマネージャーに相談してください。',
          es: 'Golden Rule #5: Si no está seguro, consulte primero a un gerente.'
        };
        html += `<h3>${titles[L]||titles.en}</h3>
          <div class="alert alert-info">${msgs[L]||msgs.en}</div>`;
      }
      modal.innerHTML = html;
      document.getElementById('modal-overlay').classList.remove('hidden');
    }

    function showSummary() {
      const modal = document.getElementById('modal-content');
      const titles = {ko:'오늘 요약', en:"Today's Summary", ja:'今日のまとめ', es:'Resumen de hoy'};
      let html = `<button class="close-modal" onclick="closeModal()">×</button>
        <h3>${titles[currentLang]||titles.en} – ${currentUser}</h3>`;
      let done = 0;
      routineTasks.forEach(t => {
        const s = stamps[t.id];
        const title = t.title[currentLang] || t.title.en;
        if (s?.done) {
          done++;
          html += `<div class="summary-item"><span>✓ ${title}</span><span>${s.time||''}${s.amount!=null?' · $'+s.amount:''}</span></div>`;
        } else {
          html += `<div class="summary-item" style="color:var(--muted)"><span>○ ${title}</span><span>—</span></div>`;
        }
      });
      const doneLabel = {ko:`${done} / ${routineTasks.length} 완료`, en:`${done} / ${routineTasks.length} completed`, ja:`${done} / ${routineTasks.length} 完了`, es:`${done} / ${routineTasks.length} completados`};
      html += `<div class="alert alert-success" style="margin-top:14px">${doneLabel[currentLang]||doneLabel.en}</div>`;
      modal.innerHTML = html;
      document.getElementById('modal-overlay').classList.remove('hidden');
    }
