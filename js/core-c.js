/* Conroy's Training App - content modals v1.14.5 */
    // Checklist items are language maps so guides follow currentLang (or voice-detected lang)
    const taskDetails = {
      funeral_check: {
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
        image: 'funeral.jpg'
      },
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
          ja: 'クーラー内の花瓶アレンジを点検。水が濁ったり不足したら交換、傷んだ花を除去。',
          es: 'Revise todos los arreglos en jarrón del cooler. Reemplace agua turbia/baja, quite flores dañadas.'
        },
        checklist: {
          ko: ['물 상태 확인', '손상 꽃 제거', '줄기 재절단', '위치 정리'],
          en: ['Check water', 'Remove damaged', 'Re-cut stems', 'Organize'],
          ja: ['水確認', '傷んだ花除去', '茎再カット', '整理'],
          es: ['Revisar agua', 'Quitar dañadas', 'Recortar tallos', 'Organizar']
        }
      },
      cooler_loose: {
        content: {
          ko: '루스 플라워 버킷을 점검합니다. 물 보충, 손상 꽃/잎 제거, 색상·종류별 정리.',
          en: 'Check loose flower buckets. Refill water, remove damaged flowers/leaves, organize by color and type.',
          ja: '切り花バケツを確認。水補充、傷んだ花・葉除去、色・種類で整理。',
          es: 'Revise cubos de flores sueltas. Rellene agua, quite dañadas, organice por color y tipo.'
        },
        checklist: {
          ko: ['물 보충', '손상 꽃/잎 제거', '색상별 정리', '디스플레이 깔끔하게'],
          en: ['Refill water', 'Remove damaged', 'Organize by color', 'Keep display clean'],
          ja: ['水補充', '傷んだ除去', '色で整理', 'ディスプレイ綺麗に'],
          es: ['Rellenar agua', 'Quitar dañadas', 'Organizar por color', 'Mantener limpio']
        }
      },
      messages_check: {
        content: {
          ko: 'Messages와 In Wire를 수시로 확인하세요. Wire-In 주문이 들어오면 카운터가 올라갑니다.',
          en: 'Check Messages and In Wire frequently. Counters increase when Wire-In orders arrive.',
          ja: 'MessagesとIn Wireを頻繁に確認。Wire-In注文が入るとカウンターが増えます。',
          es: 'Revise Messages e In Wire con frecuencia. Los contadores aumentan con pedidos Wire-In.'
        },
        checklist: {
          ko: ['Messages 열기', '내용 확인', 'Mark Read', 'In Wire에서 Accept'],
          en: ['Open Messages', 'Review content', 'Mark Read', 'Accept in In Wire'],
          ja: ['Messages開く', '内容確認', 'Mark Read', 'In WireでAccept'],
          es: ['Abrir Messages', 'Revisar contenido', 'Mark Read', 'Accept en In Wire']
        }
      },
      monitor_orders: {
        content: {
          ko: 'Due Time을 기준으로 우선순위를 정해 처리하세요.',
          en: 'Prioritize orders by Due Time.',
          ja: 'Due Timeを基準に優先順位を決めて処理。',
          es: 'Priorice pedidos por Due Time.'
        },
        checklist: {
          ko: ['Due Time 확인', '우선순위 정렬', '처리'],
          en: ['Check Due Time', 'Sort priority', 'Process'],
          ja: ['Due Time確認', '優先順位', '処理'],
          es: ['Revisar Due Time', 'Ordenar prioridad', 'Procesar']
        }
      },
      attachments: {
        content: {
          ko: 'White Sheet의 Product Detail을 보고 첨부물(풍선, 초콜릿, 인형, CardIsle)이 있는지 확인하세요. 모두 확인·부착 후 White Sheet를 떼세요.',
          en: 'Check Product Detail on White Sheet for balloons, chocolates, plush, CardIsle. Verify and attach all before removing White Sheet.',
          ja: 'White SheetのProduct Detailで添付物を確認。すべて取り付けてからWhite Sheetを外す。',
          es: 'Revise Product Detail. Verifique y adjunte todo antes de quitar la White Sheet.'
        },
        checklist: {
          ko: ['Product Detail 확인', '첨부물 준비', '부착', 'White Sheet 제거'],
          en: ['Check Product Detail', 'Prepare attachments', 'Attach', 'Remove White Sheet'],
          ja: ['Product Detail確認', '添付物準備', '取り付け', 'White Sheet外す'],
          es: ['Revisar Product Detail', 'Preparar adjuntos', 'Adjuntar', 'Quitar White Sheet']
        }
      },
      end_day: {
        content: {
          ko: '정확히 $200.00을 드로어에 남기고, 초과 현금을 봉투에 넣어 금고에 보관하세요.',
          en: 'Leave exactly $200.00 in drawer. Put excess cash in deposit envelope and place in safe.',
          ja: '正確に$200.00を残し、超過分を封筒に入れて金庫へ。',
          es: 'Deje exactamente $200.00. Ponga el excedente en el sobre de depósito y al seguro.'
        },
        checklist: {
          ko: ['$200 남기기', '초과 현금 봉투', '날짜·이름 적기', '금고 보관', 'End Register Session'],
          en: ['Leave $200', 'Deposit envelope', 'Write date/name', 'Safe', 'End Register Session'],
          ja: ['$200残す', '超過封筒', '日付・名前', '金庫', 'End Register Session'],
          es: ['Dejar $200', 'Sobre de depósito', 'Fecha/nombre', 'Seguro', 'End Register Session']
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
        <h3>${title}</h3>`;
      if (detail.image) {
        html += `<img src="${detail.image}" class="img-guide" style="max-height:180px;object-fit:cover;margin-bottom:10px" alt="">`;
      }
      html += `<div class="script-box" style="margin-bottom:14px">${content}</div>
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
      if (type === 'attachments') {
        html += `<h3>${currentLang==='ko'?'첨부물 체크리스트':'Attachment Checklist'}</h3>
          <img src="attachments.jpg" class="img-guide">
          <div class="checklist">
            <label><input type="checkbox"> Balloons / 풍선</label>
            <label><input type="checkbox"> Chocolates / 초콜릿</label>
            <label><input type="checkbox"> Plush / Teddy / 인형</label>
            <label><input type="checkbox"> CardIsle Greeting Card</label>
            <label><input type="checkbox"> Other gift items</label>
          </div>
          <div class="alert alert-warn" style="margin-top:12px">${currentLang==='ko'?'White Sheet는 모든 첨부물 확인·부착이 끝나기 전까지 떼지 마세요!':'Do not remove the White Sheet until ALL attachments are verified and attached!'}</div>`;
      } else if (type === 'bmsflow') {
        html += `<h3>BMS Workflow</h3>
          <ol style="padding-left:20px;line-height:1.8">
            <li>New Order Received (Messages / In Wire)</li>
            <li>Review Order Details → Mark Read</li>
            <li>Accept Order (In Wire)</li>
            <li>Print Design Ticket (SuperTicket)</li>
            <li>Design Arrangement</li>
            <li>Quality Check + Attachments</li>
            <li>Set As Awaiting Delivery / Pick-up</li>
            <li>Create Delivery Trip</li>
          </ol>
          <img src="superticket.jpg" class="img-guide">`;
      } else if (type === 'golden') {
        html += `<h3>Golden Rules</h3>
          <ol style="padding-left:20px;line-height:1.7">
            <li>Always prioritize orders based on Due Time.</li>
            <li>Never begin designing without a printed design ticket.</li>
            <li>Do not complete an order until all required work is finished.</li>
            <li>Always send a Delivery Attempted message before changing the delivery date.</li>
            <li>If you are unsure how to proceed, contact a manager before taking action.</li>
          </ol>`;
      }
      modal.innerHTML = html;
      document.getElementById('modal-overlay').classList.remove('hidden');
    }

    function showSummary() {
      const modal = document.getElementById('modal-content');
      let html = `<button class="close-modal" onclick="closeModal()">×</button>
        <h3>${currentLang==='ko'?'오늘 요약':'Today\'s Summary'} – ${currentUser}</h3>`;
      let done = 0;
      routineTasks.forEach(t => {
        const s = stamps[t.id];
        const title = t.title[currentLang] || t.title.en;
        if (s?.done) {
          done++;
          html += `<div class="summary-item"><span>✓ ${title}</span><span>${s.time}${s.amount!=null?' · $'+s.amount:''}</span></div>`;
        } else {
          html += `<div class="summary-item" style="color:var(--muted)"><span>○ ${title}</span><span>—</span></div>`;
        }
      });
      html += `<div class="alert alert-success" style="margin-top:14px">${done} / ${routineTasks.length} completed</div>`;
      modal.innerHTML = html;
      document.getElementById('modal-overlay').classList.remove('hidden');
    }
