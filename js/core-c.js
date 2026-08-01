/* Conroy's Training App - content modals 4.0.0 */
    // Checklist items are language maps so guides follow currentLang (or voice-detected lang)
    const taskDetails = {
      funeral_check: {
        guideKey: 'messages',
        content: {
          ko: 'Funeral 주문은 개별 배송(Uber ASAP)이라 가장 먼저 확인해야 합니다. Messages / In Wire를 열고 Funeral 또는 긴급 주문이 있는지 바로 확인하세요. 있으면 즉시 Accept 후 SuperTicket을 출력하고 디자인 준비를 시작하세요.',
          en: 'Funeral orders are individual deliveries (Uber ASAP) and must be checked first. Open Messages / In Wire and look for any Funeral or urgent orders. If found, Accept immediately, print SuperTicket, and start design prep.',
          ja: 'Funeral注文は個別配達（Uber ASAP）のため最優先で確認してください。Messages / In Wireを開き、Funeralや緊急注文がないかすぐに確認。あればすぐにAcceptしてSuperTicketを印刷し、デザイン準備を始めてください。',
          es: 'Los pedidos Funeral son entregas individuales (Uber ASAP) y deben revisarse primero. Abra Messages / In Wire y busque pedidos Funeral o urgentes. Si hay, haga Accept de inmediato, imprima SuperTicket y prepare el diseño.'
        },
        checklist: {
          ko: ['Messages / In Wire 열기', 'Funeral / 긴급 주문 있는지 확인', '있으면 즉시 Accept', 'SuperTicket 출력 후 디자인 준비'],
          en: ['Open Messages / In Wire', 'Check for Funeral / urgent orders', 'If any, Accept immediately', 'Print SuperTicket and prep design'],
          ja: ['Messages / In Wireを開く', 'Funeral / 緊急注文を確認', 'あればすぐにAccept', 'SuperTicket印刷後デザイン準備'],
          es: ['Abrir Messages / In Wire', 'Revisar si hay Funeral / urgentes', 'Si hay, Accept de inmediato', 'Imprimir SuperTicket y preparar diseño']
        },
        image: 'images/guides/funeral.webp',
        images: ['images/guides/funeral.webp', 'images/guides/bms-messages-with-orders.webp']
      },
      open_shop: {
        image: 'images/guides/shop-gate.webp',
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
        image: 'images/guides/cash.webp',
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
        image: 'images/guides/cooler-vase.webp',
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
        image: 'images/guides/cooler-loose.webp',
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
        image: 'images/guides/bms-messages-with-orders.webp',
        images: ['images/guides/bms-messages-list.webp', 'images/guides/bms-messages-with-orders.webp', 'images/guides/bms-in-wire-list.webp'],
        guideKey: 'messages',
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
        image: 'images/guides/bms-in-wire-list.webp',
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
        image: 'images/guides/attachments.webp',
        guideKey: 'attachments',
        content: {
          ko: '첨부물은 주문마다 다를 수 있습니다. White Sheet의 Product Detail을 반드시 확인한 뒤, 필요한 첨부물(풍선·초콜릿·인형·CardIsle 카드 등)을 모두 부착하고 최종 확인이 끝난 후에만 White Sheet를 제거하세요.',
          en: 'Attachments vary by order. Always check Product Detail on the White Sheet first. Prepare and attach every required item (balloons, chocolates, plush, CardIsle card, etc.), then remove the White Sheet only after final verification.',
          ja: '添付物は注文ごとに異なります。必ずWhite SheetのProduct Detailを確認し、必要な添付物（バルーン・チョコ・ぬいぐるみ・CardIsleカードなど）をすべて取り付け、最終確認が終わってからWhite Sheetを外してください。',
          es: 'Los adjuntos varían según el pedido. Revise siempre el Product Detail de la White Sheet. Prepare y coloque todos los artículos necesarios (globos, chocolates, peluche, tarjeta CardIsle, etc.) y solo entonces quite la White Sheet.'
        },
        checklist: {
          ko: [
            'White Sheet Product Detail 확인',
            '필요한 첨부물 종류 파악 (풍선/초콜릿/인형/CardIsle)',
            '첨부물 준비',
            '상품에 올바르게 부착',
            '모두 달려 있는지 최종 확인',
            '확인 후 White Sheet 제거',
            'Set As Awaiting Delivery'
          ],
          en: [
            'Check White Sheet Product Detail',
            'Identify required attachments (balloon/chocolate/plush/CardIsle)',
            'Prepare the attachments',
            'Attach them correctly to the product',
            'Final check that everything is attached',
            'Remove White Sheet only after confirmation',
            'Set As Awaiting Delivery'
          ],
          ja: [
            'White Sheet Product Detailを確認',
            '必要な添付物を把握（バルーン/チョコ/ぬいぐるみ/CardIsle）',
            '添付物を準備',
            '商品に正しく取り付ける',
            'すべて付いているか最終確認',
            '確認後にWhite Sheetを外す',
            'Set As Awaiting Delivery'
          ],
          es: [
            'Revisar Product Detail de White Sheet',
            'Identificar adjuntos necesarios (globo/chocolate/peluche/CardIsle)',
            'Preparar los adjuntos',
            'Colocarlos correctamente en el producto',
            'Verificación final de que todo esté colocado',
            'Quitar White Sheet solo después de confirmar',
            'Set As Awaiting Delivery'
          ]
        }
      },
      end_day: {
        image: 'images/guides/cash.webp',
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
      const L = currentLang || 'en';
      const title = task.title[L] || task.title.en;
      const content = detail.content[L] || detail.content.en;
      const checks = (detail.checklist && (detail.checklist[L] || detail.checklist.en)) || [];
      const modal = document.getElementById('modal-content');
      let html = '<button class="close-modal" onclick="closeModal()">×</button><h3 style="padding-right:28px">' + title + '</h3>';
      // Screenshots (single or multiple)
      const imgs = detail.images || (detail.image ? [detail.image] : []);
      imgs.forEach(function (src) {
        html += '<img src="' + src + '" class="img-guide" style="max-height:220px;width:100%;object-fit:contain;margin:8px 0;border:1px solid #e5e7eb;border-radius:10px;background:#fafafa" alt="guide" loading="lazy" onerror="this.style.display=\'none\'">';
      });
      html += '<div class="script-box" style="margin-bottom:14px;white-space:pre-wrap;line-height:1.55">' + content + '</div>';
      if (checks.length) {
        html += '<p style="font-weight:600;margin-bottom:8px">' + ({ko:'체크리스트',en:'Checklist',ja:'チェックリスト',es:'Lista'}[L]||'Checklist') + '</p><div class="checklist">';
        checks.forEach(function (item) {
          html += '<label><input type="checkbox"> ' + item + '</label>';
        });
        html += '</div>';
      }
      // Optional link to full training guide
      if (detail.guideKey && typeof showContent === 'function') {
        const guideLabel = {ko:'전체 가이드 열기',en:'Open full guide',ja:'ガイドを開く',es:'Abrir guía completa'}[L]||'Open full guide';
        html += '<button class="btn btn-outline" style="width:100%;margin-top:12px" onclick="closeModal();showContent(\'' + detail.guideKey + '\')">' + guideLabel + '</button>';
      }
      if (!(stamps[taskId] && stamps[taskId].done)) {
        const doneLabel = {ko:'이 항목 완료 처리',en:'Mark as Done',ja:'完了にする',es:'Marcar como hecho'}[L]||'Mark as Done';
        html += '<button class="btn" style="width:100%;margin-top:12px" onclick="closeModal();toggleStamp(\'' + taskId + '\')">' + doneLabel + '</button>';
      }
      // TTS for this detail (optional)
      const readLabel = {ko:'읽어주기',en:'Read aloud',ja:'読み上げ',es:'Leer'}[L]||'Read aloud';
      html += '<button class="btn btn-outline" style="width:100%;margin-top:8px" onclick="if(typeof speakText===\'function\')speakText(' + JSON.stringify(content).replace(/</g,'\\u003c') + ',this)">🔊 ' + readLabel + '</button>';
      modal.innerHTML = html;
      document.getElementById('modal-overlay').classList.remove('hidden');
    }

    function showContent(type) {
      const modal = document.getElementById('modal-content');
      let html = `<button class="close-modal" onclick="closeModal()">×</button>`;
      const L = currentLang;

      if (type === 'attachments') {
        const titles = {
          ko: '첨부물 확인 · 부착 절차',
          en: 'Attachment Verification Process',
          ja: '添付物確認・取り付け手順',
          es: 'Proceso de verificación de adjuntos'
        };
        const intro = {
          ko: '처음 온 직원도 이 순서대로만 따라하면 됩니다. 주문마다 첨부물이 다를 수 있으니 반드시 White Sheet를 먼저 확인하세요.',
          en: 'New team members: just follow these steps in order. Attachments can differ by order — always start with the White Sheet.',
          ja: '初めての方もこの順番通りに進めれば大丈夫です。注文ごとに添付物が違うので、必ずWhite Sheetから確認してください。',
          es: 'Si es su primer día, siga estos pasos en orden. Los adjuntos pueden variar — siempre comience con la White Sheet.'
        };
        const steps = {
          ko: [
            'White Sheet의 <strong>Product Detail</strong>을 확인한다.',
            '필요한 첨부물 종류를 파악한다 (풍선, 초콜릿, 인형, CardIsle 카드 등).',
            '해당 첨부물을 준비한다.',
            '상품에 첨부물을 올바르게 부착한다.',
            '모든 첨부물이 제대로 달려 있는지 최종 확인한다.',
            '확인이 끝난 후에만 <strong>White Sheet를 제거</strong>한다.',
            'BMS에서 <strong>Set As Awaiting Delivery</strong>로 상태를 변경한다.'
          ],
          en: [
            'Check <strong>Product Detail</strong> on the White Sheet.',
            'Identify required attachments (balloons, chocolates, plush, CardIsle card, etc.).',
            'Prepare the needed attachments.',
            'Attach them correctly to the product.',
            'Do a final check that everything is properly attached.',
            'Only after confirmation, <strong>remove the White Sheet</strong>.',
            'In BMS, change status to <strong>Set As Awaiting Delivery</strong>.'
          ],
          ja: [
            'White Sheetの<strong>Product Detail</strong>を確認する。',
            '必要な添付物を把握する（バルーン、チョコ、ぬいぐるみ、CardIsleカードなど）。',
            '該当する添付物を準備する。',
            '商品に正しく取り付ける。',
            'すべてきちんと付いているか最終確認する。',
            '確認が終わってから<strong>White Sheetを外す</strong>。',
            'BMSで<strong>Set As Awaiting Delivery</strong>に変更する。'
          ],
          es: [
            'Revise el <strong>Product Detail</strong> de la White Sheet.',
            'Identifique los adjuntos necesarios (globos, chocolates, peluche, tarjeta CardIsle, etc.).',
            'Prepare los adjuntos correspondientes.',
            'Colóquelos correctamente en el producto.',
            'Haga una verificación final de que todo esté bien colocado.',
            'Solo después de confirmar, <strong>quite la White Sheet</strong>.',
            'En BMS, cambie el estado a <strong>Set As Awaiting Delivery</strong>.'
          ]
        };
        const cardisleNote = {
          ko: 'CardIsle 카드가 있는 경우: White Sheet 하단 또는 BMS Special Instructions에서 PickupCodeID를 찾아 cardisle.com에 입력 → Preview → Print 후 뒷면 코드 일치 여부 확인하고 부착하세요.',
          en: 'If CardIsle card is required: Find PickupCodeID on the White Sheet (bottom) or in BMS Special Instructions → go to cardisle.com → enter code → Preview → Print → match the code on the back of the card before attaching.',
          ja: 'CardIsleカードがある場合：White Sheet下部またはBMSのSpecial InstructionsでPickupCodeIDを確認 → cardisle.comでコード入力 → Preview → Print → カード裏面のコード一致を確認してから取り付け。',
          es: 'Si hay tarjeta CardIsle: Busque PickupCodeID en la parte inferior de la White Sheet o en Special Instructions de BMS → vaya a cardisle.com → ingrese el código → Preview → Print → verifique el código en el reverso antes de colocarla.'
        };
        const warn = {
          ko: '중요: 모든 첨부물 확인·부착이 끝나기 전에는 White Sheet를 절대 떼지 마세요!',
          en: 'Important: Never remove the White Sheet until ALL attachments are verified and attached!',
          ja: '重要：すべての添付物の確認・取り付けが終わるまで、White Sheetを絶対に外さないでください！',
          es: '¡Importante: Nunca quite la White Sheet hasta verificar y colocar TODOS los adjuntos!'
        };
        const list = steps[L] || steps.en;
        html += `<h3>${titles[L]||titles.en}</h3>
          <div class="script-box" style="margin-bottom:14px">${intro[L]||intro.en}</div>
          <ol style="padding-left:20px;line-height:1.85;margin-bottom:14px">
            ${list.map(s => `<li style="margin-bottom:6px">${s}</li>`).join('')}
          </ol>
          <div class="script-box" style="margin-bottom:12px;font-size:0.92rem">${cardisleNote[L]||cardisleNote.en}</div>
          <div class="alert alert-warn">${warn[L]||warn.en}</div>`;
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
        const standardTitle = {ko:'일반 배달 (Standard)', en:'Standard Delivery', ja:'通常配達 (Standard)', es:'Entrega estándar'};
        const funeralTitle = {ko:'장례 배달 (Funeral)', en:'Funeral Delivery', ja:'葬儀配達 (Funeral)', es:'Entrega de funeral'};
        const standardBody = {
          ko: 'Provider: <strong>Walmart GoLocal</strong><br>시간창: <strong>3Hr Window</strong><br>가장 빠른 가능한 창을 선택한 뒤 Set Trip as Out for Delivery 합니다.',
          en: 'Provider: <strong>Walmart GoLocal</strong><br>Window: <strong>3Hr Window</strong><br>Select the earliest available window, then Set Trip as Out for Delivery.',
          ja: 'Provider: <strong>Walmart GoLocal</strong><br>時間枠: <strong>3Hr Window</strong><br>最も早い可能な枠を選び、Set Trip as Out for Delivery します。',
          es: 'Proveedor: <strong>Walmart GoLocal</strong><br>Ventana: <strong>3Hr Window</strong><br>Seleccione la ventana más temprana disponible y luego Set Trip as Out for Delivery.'
        };
        const funeralBody = {
          ko: 'Provider: <strong>Uber</strong><br>시간: <strong>ASAP</strong><br>드라이버 도착 시 운반 방법을 설명하고, 배치 후 확인 사진을 요청하세요.',
          en: 'Provider: <strong>Uber</strong><br>Timing: <strong>ASAP</strong><br>When the driver arrives, explain how to transport and request a confirmation photo after setup.',
          ja: 'Provider: <strong>Uber</strong><br>時間: <strong>ASAP</strong><br>ドライバー到着時に運搬方法を説明し、設置後の確認写真を依頼してください。',
          es: 'Proveedor: <strong>Uber</strong><br>Tiempo: <strong>ASAP</strong><br>Cuando llegue el conductor, explique cómo transportar y pida una foto de confirmación después de la colocación.'
        };
        html += `<h3>${titles[L]||titles.en}</h3>
          <div class="script-box" style="margin-bottom:10px"><strong>${standardTitle[L]||standardTitle.en}</strong><br>${standardBody[L]||standardBody.en}</div>
          <div class="script-box"><strong>${funeralTitle[L]||funeralTitle.en}</strong><br>${funeralBody[L]||funeralBody.en}</div>`;
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
