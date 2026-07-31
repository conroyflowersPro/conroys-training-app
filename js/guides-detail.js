/* Official training guides — detailed for brand-new staff (v1.20.0)
   Principle: new employee can follow the guide alone without asking others.
   Used by showContent / page modals when available.
*/
window.CF_GUIDE_DETAIL = {
  attachments: {
    title: {
      ko: '첨부물 확인 · 부착 절차',
      en: 'Attachment verification & attach process',
      ja: '添付物の確認・取り付け',
      es: 'Verificación y colocación de adjuntos'
    },
    goal: {
      ko: 'White Sheet의 Product Detail을 보고 필요한 첨부물을 모두 부착한 뒤, 확인이 끝난 후에만 White Sheet를 제거하고 Awaiting Delivery로 바꾼다.',
      en: 'Read Product Detail on the White Sheet, attach every required item, remove the White Sheet only after verification, then set Awaiting Delivery.',
      ja: 'White SheetのProduct Detailを見て必要な添付物をすべて取り付け、確認後にのみWhite Sheetを外し、Awaiting Deliveryにする。',
      es: 'Lea Product Detail en la White Sheet, coloque todos los adjuntos, quite la White Sheet solo tras verificar, luego Awaiting Delivery.'
    },
    before: {
      ko: ['SuperTicket이 출력되어 어레인지먼트에 White Sheet가 붙어 있다.', 'BMS에 로그인되어 있다.', '풍선·초콜릿·인형·CardIsle 등 재고 위치를 안다.'],
      en: ['SuperTicket is printed and the White Sheet is on the arrangement.', 'You are logged into BMS.', 'You know where balloons, chocolates, plush, CardIsle supplies are.'],
      ja: ['SuperTicketが印刷されWhite Sheetが付いている。', 'BMSにログインしている。', 'バルーン・チョコ等の場所を知っている。'],
      es: ['SuperTicket impreso y White Sheet en el arreglo.', 'Sesión iniciada en BMS.', 'Sabe dónde están globos, chocolates, etc.']
    },
    steps: {
      ko: [
        '어레인지먼트에 붙어 있는 White Sheet를 찾는다. (아직 떼지 않는다.)',
        'White Sheet에서 Product Detail 칸을 읽는다.',
        '필요한 첨부물 종류를 적거나 기억한다. 예: 풍선, 초콜릿, 인형, CardIsle 카드.',
        '각 첨부물을 매장 재고에서 가져온다.',
        'CardIsle 카드가 있으면: White Sheet 하단 또는 BMS Special Instructions에서 PickupCodeID를 찾는다 → 브라우저에서 cardisle.com 접속 → 코드 입력 → Preview → Print → 인쇄된 카드 뒷면 코드와 PickupCodeID가 같은지 확인한 뒤 부착한다.',
        '풍선·초콜릿·인형 등 나머지 첨부물을 상품에 올바르게 부착한다.',
        'Product Detail에 적힌 첨부물이 모두 달려 있는지 눈으로 다시 확인한다.',
        '확인이 끝난 후에만 White Sheet를 어레인지먼트에서 제거한다.',
        'BMS에서 해당 주문을 열고 상태를 Set As Awaiting Delivery로 변경한다.'
      ],
      en: [
        'Find the White Sheet on the arrangement. (Do not remove it yet.)',
        'Read the Product Detail section on the White Sheet.',
        'Note every required attachment (balloons, chocolates, plush, CardIsle card, etc.).',
        'Get each item from shop stock.',
        'If CardIsle: find PickupCodeID on White Sheet bottom or BMS Special Instructions → go to cardisle.com → enter code → Preview → Print → match the code on the back of the card to PickupCodeID, then attach.',
        'Attach all other items correctly to the product.',
        'Visually confirm every Product Detail item is attached.',
        'Only after that confirmation, remove the White Sheet.',
        'In BMS open the order and change status to Set As Awaiting Delivery.'
      ],
      ja: [
        'アレンジのWhite Sheetを探す（まだ外さない）。',
        'Product Detailを読む。',
        '必要な添付物を把握する。',
        '在庫から用意する。',
        'CardIsleがある場合：PickupCodeIDを確認 → cardisle.com → 入力 → Preview → Print → 裏面コード一致を確認して取り付ける。',
        'その他の添付物を正しく取り付ける。',
        'すべて付いているか再確認する。',
        '確認後にのみWhite Sheetを外す。',
        'BMSでSet As Awaiting Deliveryにする。'
      ],
      es: [
        'Localice la White Sheet (aún no la quite).',
        'Lea Product Detail.',
        'Anote todos los adjuntos necesarios.',
        'Traiga cada artículo del stock.',
        'Si hay CardIsle: PickupCodeID → cardisle.com → Preview → Print → verifique el código y coloque.',
        'Coloque el resto correctamente.',
        'Verifique visualmente que todo esté colocado.',
        'Solo entonces quite la White Sheet.',
        'En BMS cambie a Set As Awaiting Delivery.'
      ]
    },
    never: {
      ko: ['첨부물 확인·부착이 끝나기 전에 White Sheet를 떼지 않는다.', 'CardIsle 뒷면 코드 확인 없이 부착하지 않는다.'],
      en: ['Never remove the White Sheet before all attachments are verified and attached.', 'Never attach a CardIsle card without matching the back code to PickupCodeID.'],
      ja: ['確認前にWhite Sheetを外さない。', 'CardIsleのコード確認なしで取り付けない。'],
      es: ['Nunca quite la White Sheet antes de verificar todos los adjuntos.', 'No coloque CardIsle sin verificar el código.']
    },
    done: {
      ko: ['Product Detail의 첨부물이 모두 부착됨', 'White Sheet 제거 완료', 'BMS 상태가 Awaiting Delivery'],
      en: ['All Product Detail attachments on the product', 'White Sheet removed', 'BMS status is Awaiting Delivery'],
      ja: ['添付物すべて装着', 'White Sheet除去', 'Awaiting Delivery'],
      es: ['Todos los adjuntos colocados', 'White Sheet quitada', 'Estado Awaiting Delivery']
    }
  },

  bmsflow: {
    title: {
      ko: 'BMS 주문 처리 흐름',
      en: 'BMS order workflow',
      ja: 'BMS注文フロー',
      es: 'Flujo de pedidos BMS'
    },
    goal: {
      ko: 'Wire-In 주문을 Messages부터 Accept·SuperTicket·디자인·첨부물·배달 준비까지 순서대로 처리한다.',
      en: 'Process a Wire-In order from Messages through Accept, SuperTicket, design, attachments, and delivery prep.',
      ja: 'Wire-In注文をMessagesからAccept・SuperTicket・デザイン・添付・配達準備まで進める。',
      es: 'Procesar un pedido Wire-In desde Messages hasta entrega.'
    },
    before: {
      ko: ['BMS 로그인 완료 (Shop Code S0940000).', 'Register 1인 PC에서만 SuperTicket 자동 인쇄가 된다.'],
      en: ['Logged into BMS (Shop Code S0940000).', 'SuperTicket auto-print only on the Register 1 computer.'],
      ja: ['BMSログイン済み。', 'Register 1のPCのみ自動印刷。'],
      es: ['Sesión en BMS.', 'Solo Register 1 imprime SuperTicket automáticamente.']
    },
    steps: {
      ko: [
        'BMS 화면 위쪽 카운터를 본다. Messages 숫자가 올라갔는지 확인한다.',
        '왼쪽 메뉴에서 Messages를 누른다.',
        '새 메시지를 열어 주문 내용(받는 분, 상품, 날짜, 특별 요청)을 읽는다.',
        'Mark Read를 누른다.',
        '왼쪽 메뉴에서 In Wire를 누른다.',
        '같은 주문을 찾아 내용을 다시 확인한 뒤 Accept를 누른다. (Reject는 매니저 승인 없이 누르지 않는다.)',
        'Accept 후: 주문이 To Be Designed로 이동하고, Register 1이면 SuperTicket이 인쇄된다.',
        '인쇄된 SuperTicket을 Delivery Date 기준으로 정리해 지정 캐비닛에 넣는다.',
        '디자인 담당이 당일 SuperTicket을 가져와 디자인을 시작한다. (인쇄된 SuperTicket 없이 디자인 시작 금지)',
        '디자인·첨부물이 끝나면 Set As Awaiting Delivery 후 배달 트립을 만든다.'
      ],
      en: [
        'Look at the top BMS counters. Check if Messages increased.',
        'Click Messages on the left menu.',
        'Open the new message and read recipient, product, date, special requests.',
        'Click Mark Read.',
        'Click In Wire on the left menu.',
        'Find the same order, review, then click Accept. (Never Reject without manager approval.)',
        'After Accept: order moves to To Be Designed; SuperTicket prints on Register 1.',
        'Sort the printed SuperTicket by Delivery Date into the designated cabinet.',
        'Design retrieves current-day tickets and designs. (Never design without a printed SuperTicket.)',
        'When design + attachments are done: Set As Awaiting Delivery, then create the delivery trip.'
      ],
      ja: [
        '上部カウンターでMessages増加を確認。',
        '左メニューMessages。',
        '新規メッセージを開き内容を読む。',
        'Mark Read。',
        'In Wire。',
        'Accept（Rejectは承認なし禁止）。',
        'To Be Designedへ。Register 1でSuperTicket印刷。',
        'Delivery Dateでキャビネットへ。',
        'デザインは印刷票なしで始めない。',
        '完了後Awaiting Delivery→配達トリップ。'
      ],
      es: [
        'Revise contadores superiores de Messages.',
        'Clic en Messages (menú izquierdo).',
        'Lea el mensaje nuevo.',
        'Mark Read.',
        'In Wire.',
        'Accept (nunca Reject sin gerente).',
        'Pasa a To Be Designed; SuperTicket en Register 1.',
        'Ordene por Delivery Date en el gabinete.',
        'No diseñe sin SuperTicket impreso.',
        'Luego Awaiting Delivery y viaje de entrega.'
      ]
    },
    never: {
      ko: ['매니저 승인 없이 Reject', '인쇄된 SuperTicket 없이 디자인 시작'],
      en: ['Reject without manager approval', 'Start designing without a printed SuperTicket'],
      ja: ['承認なしReject', '印刷票なしデザイン'],
      es: ['Reject sin gerente', 'Diseñar sin SuperTicket']
    },
    done: {
      ko: ['Mark Read 완료', 'Accept 완료', 'SuperTicket 정리', '필요 시 Awaiting Delivery'],
      en: ['Mark Read done', 'Accept done', 'SuperTicket filed', 'Awaiting Delivery when ready'],
      ja: ['Mark Read', 'Accept', 'SuperTicket整理', 'Awaiting Delivery'],
      es: ['Mark Read', 'Accept', 'SuperTicket archivado', 'Awaiting Delivery']
    }
  },

  delivery: {
    title: {
      ko: '배달 가이드',
      en: 'Delivery guide',
      ja: '配達ガイド',
      es: 'Guía de entrega'
    },
    goal: {
      ko: '일반 배달과 장례(Funeral) 배달을 올바른 Provider·시간으로 설정하고 출고 처리한다.',
      en: 'Set the correct provider and timing for standard vs funeral delivery and mark out for delivery.',
      ja: '通常とFuneralで正しいProvider・時間を設定し出庫する。',
      es: 'Configurar proveedor y tiempo correctos (estándar vs funeral) y marcar salida.'
    },
    before: {
      ko: ['주문이 Awaiting Delivery 상태이다.', '어레인지먼트와 첨부물이 완료되었다.'],
      en: ['Order is Awaiting Delivery.', 'Arrangement and attachments are complete.'],
      ja: ['Awaiting Delivery。', 'アレンジと添付完了。'],
      es: ['Estado Awaiting Delivery.', 'Arreglo y adjuntos listos.']
    },
    steps: {
      ko: [
        '주문이 일반 배달인지 Funeral(장례)인지 확인한다.',
        '【일반 배달】 Provider를 Walmart GoLocal로 선택한다.',
        '【일반 배달】 시간창은 3Hr Window로 두고, 가능한 가장 빠른 창을 고른다.',
        '【일반 배달】 Set Trip as Out for Delivery를 누른다.',
        '【Funeral】 Provider를 Uber로 선택한다.',
        '【Funeral】 시간은 ASAP로 둔다.',
        '【Funeral】 드라이버가 도착하면 운반 방법을 설명하고, 배치 후 확인 사진을 요청한다.',
        '출고 후 필요 시 주문 상태와 트립이 맞는지 BMS에서 다시 확인한다.'
      ],
      en: [
        'Check whether the order is standard delivery or Funeral.',
        '[Standard] Set Provider to Walmart GoLocal.',
        '[Standard] Use 3Hr Window; pick the earliest available window.',
        '[Standard] Click Set Trip as Out for Delivery.',
        '[Funeral] Set Provider to Uber.',
        '[Funeral] Set timing to ASAP.',
        '[Funeral] When the driver arrives, explain transport and request a confirmation photo after setup.',
        'After dispatch, confirm trip/status in BMS if needed.'
      ],
      ja: [
        '通常かFuneralか確認。',
        '通常: Walmart GoLocal。',
        '通常: 3Hr Windowで最速枠。',
        '通常: Set Trip as Out for Delivery。',
        'Funeral: Uber。',
        'Funeral: ASAP。',
        'Funeral: 運搬説明と確認写真。',
        '必要ならBMSで再確認。'
      ],
      es: [
        '¿Estándar o Funeral?',
        'Estándar: Walmart GoLocal.',
        'Estándar: ventana 3Hr, la más temprana.',
        'Estándar: Set Trip as Out for Delivery.',
        'Funeral: Uber.',
        'Funeral: ASAP.',
        'Funeral: explique transporte y pida foto.',
        'Confirme en BMS si es necesario.'
      ]
    },
    never: {
      ko: ['Funeral에 Walmart GoLocal을 쓰지 않는다.', '일반 배달에 Uber ASAP를 기본으로 쓰지 않는다.'],
      en: ['Do not use Walmart GoLocal for Funeral.', 'Do not use Uber ASAP as the default for standard delivery.'],
      ja: ['FuneralにGoLocalを使わない。', '通常にUber ASAPを既定にしない。'],
      es: ['No use GoLocal para Funeral.', 'No use Uber ASAP por defecto en estándar.']
    },
    done: {
      ko: ['올바른 Provider·시간 설정', 'Out for Delivery 처리'],
      en: ['Correct provider and timing', 'Marked Out for Delivery'],
      ja: ['Provider・時間正しい', 'Out for Delivery'],
      es: ['Proveedor y tiempo correctos', 'Out for Delivery']
    }
  },

  golden: {
    title: {
      ko: 'Golden Rules',
      en: 'Golden Rules',
      ja: 'Golden Rules',
      es: 'Golden Rules'
    },
    goal: {
      ko: '매장에서 매일 지키는 다섯 가지 규칙이다.',
      en: 'Five rules every team member follows every day.',
      ja: '毎日守る5つのルール。',
      es: 'Cinco reglas diarias del equipo.'
    },
    before: {
      ko: ['업무 시작 전 한 번 읽는다.'],
      en: ['Read once at the start of your shift.'],
      ja: ['勤務開始時に読む。'],
      es: ['Léalas al empezar el turno.']
    },
    steps: {
      ko: [
        'Due Time 기준으로 주문 우선순위를 정한다. 마감이 가까운 것부터 처리한다.',
        '인쇄된 Design Ticket(SuperTicket) 없이 디자인을 시작하지 않는다.',
        '디자인과 첨부물 등 필요한 작업이 모두 끝날 때까지 Complete 하지 않는다.',
        '배송일을 바꾸기 전에 반드시 Delivery Attempted 메시지를 보낸다.',
        '확신이 없으면 행동하기 전에 매니저에게 문의한다.'
      ],
      en: [
        'Prioritize orders by Due Time — closest deadline first.',
        'Never begin designing without a printed design ticket (SuperTicket).',
        'Do not complete an order until all required work (design + attachments) is finished.',
        'Always send a Delivery Attempted message before changing the delivery date.',
        'If unsure, contact a manager before taking action.'
      ],
      ja: [
        'Due Timeで優先順位。',
        '印刷票なしでデザインしない。',
        '必要作業完了までCompleteしない。',
        '配達日変更前にDelivery Attempted。',
        '不明ならマネージャーに先に相談。'
      ],
      es: [
        'Priorice por Due Time.',
        'No diseñe sin ticket impreso.',
        'No complete hasta terminar todo.',
        'Delivery Attempted antes de cambiar fecha.',
        'Si duda, pregunte al gerente.'
      ]
    },
    never: {
      ko: ['규칙 5번을 어기고 추측으로 진행하지 않는다.'],
      en: ['Do not guess when unsure — ask a manager (Rule 5).'],
      ja: ['推測で進めない。'],
      es: ['No adivine — pregunte al gerente.']
    },
    done: {
      ko: ['오늘 처리할 주문의 Due Time을 확인했다', '불확실한 일은 매니저에게 물었다'],
      en: ['Checked Due Times for today’s orders', 'Asked manager when unsure'],
      ja: ['Due Time確認', '不明点は相談'],
      es: ['Revisó Due Times', 'Consultó al gerente si dudaba']
    }
  },

  decision: {
    title: {
      ko: '모르겠을 때',
      en: 'If you are unsure',
      ja: '迷ったとき',
      es: 'Si no está seguro'
    },
    goal: {
      ko: '확신이 없을 때 잘못된 클릭·처리를 막는다.',
      en: 'Prevent wrong clicks or process mistakes when you are not sure.',
      ja: '確信がないとき誤操作を防ぐ。',
      es: 'Evitar errores cuando no está seguro.'
    },
    before: {
      ko: ['지금 하려는 행동이 메뉴얼에 있는지 떠올려 본다.'],
      en: ['Ask yourself if this action is written in the manuals.'],
      ja: ['マニュアルにあるか考える。'],
      es: ['¿Está en el manual?']
    },
    steps: {
      ko: [
        '하던 클릭을 멈춘다. (특히 Reject, Complete, 날짜 변경, White Sheet 제거)',
        '앱의 관련 가이드(첨부물, BMS, 배달, Messages 등)를 연다.',
        '가이드에 같은 상황이 있으면 그 단계만 따른다.',
        '가이드에 없으면 매니저에게 먼저 말한다. (Golden Rule #5)',
        '매니저 지시를 받은 뒤에만 진행한다.'
      ],
      en: [
        'Stop the click you were about to make (especially Reject, Complete, date change, removing White Sheet).',
        'Open the related in-app guide (Attachments, BMS, Delivery, Messages, etc.).',
        'If the guide covers it, follow only those steps.',
        'If not in the guide, tell a manager first (Golden Rule #5).',
        'Continue only after the manager instructs you.'
      ],
      ja: [
        'クリックを止める。',
        '関連ガイドを開く。',
        'ガイド通りに進む。',
        'なければマネージャーに相談。',
        '指示後にのみ続行。'
      ],
      es: [
        'No haga clic todavía.',
        'Abra la guía relacionada.',
        'Siga solo esos pasos.',
        'Si no está, hable con el gerente.',
        'Continúe solo con instrucción.'
      ]
    },
    never: {
      ko: ['추측으로 Reject / Complete / 배송일 변경을 하지 않는다.'],
      en: ['Do not Reject, Complete, or change delivery date by guessing.'],
      ja: ['推測でReject/Complete/日付変更しない。'],
      es: ['No adivine Reject, Complete ni cambio de fecha.']
    },
    done: {
      ko: ['가이드 또는 매니저 확인 후에만 처리했다'],
      en: ['Only acted after guide or manager confirmation'],
      ja: ['ガイドまたはマネージャー確認後に実行'],
      es: ['Actuó solo tras guía o gerente']
    }
  },

  customer: {
    title: {
      ko: '손님 응대',
      en: 'Customer service',
      ja: '接客',
      es: 'Atención al cliente'
    },
    goal: {
      ko: '매장 손님을 최우선으로 맞이하고, 인사·니즈·색·사이즈까지 안내한다.',
      en: 'Put walk-in customers first; greet, learn needs, guide color and size.',
      ja: '来店客を最優先し、挨拶・ニーズ・色・サイズを案内する。',
      es: 'Priorice al cliente en tienda; saludo, necesidades, color y tamaño.'
    },
    before: {
      ko: ['손님이 문에 들어오면 다른 일(전화·BMS)보다 손님이 1순위다.'],
      en: ['When a customer enters, they are priority #1 over phone and BMS work.'],
      ja: ['来店客が最優先。'],
      es: ['Cliente en tienda es prioridad 1.']
    },
    steps: {
      ko: [
        '하던 일을 즉시 멈춘다.',
        '손님 쪽으로 몸을 향한다.',
        '정확히 이렇게 인사한다: "Welcome! How can I help you today?"',
        '이어서 묻는다: "Who\'s going to receive the flowers?"',
        '받는 분 관계에 맞춰 색을 안내한다: Romance → Red/Hot Pink · Family → Light Pink · Friends/Get Well → Bright Colors · Sympathy → White/Soft Pastels',
        '사이즈를 안내한다: Small $40–60 · Medium $60–80(가장 먼저 추천) · Large $100부터',
        '손님이 결정을 돕도록 질문에 답하고, 필요하면 매니저를 부른다.'
      ],
      en: [
        'Stop what you are doing immediately.',
        'Turn toward the customer.',
        'Say exactly: "Welcome! How can I help you today?"',
        'Then ask: "Who\'s going to receive the flowers?"',
        'Guide color by relationship: Romance → Red/Hot Pink; Family → Light Pink; Friends/Get Well → Bright Colors; Sympathy → White/Soft Pastels.',
        'Guide size: Small $40–60; Medium $60–80 (recommend first); Large from $100.',
        'Answer questions; call a manager if needed.'
      ],
      ja: [
        '作業を止める。',
        'お客様の方を向く。',
        '"Welcome! How can I help you today?"',
        '"Who\'s going to receive the flowers?"',
        '色の案内（Romance/Family/Friends/Sympathy）。',
        'サイズ: Small / Medium推奨 / Large。',
        '必要ならマネージャーを呼ぶ。'
      ],
      es: [
        'Deje lo que está haciendo.',
        'Mire al cliente.',
        '"Welcome! How can I help you today?"',
        '"Who\'s going to receive the flowers?"',
        'Guíe colores según relación.',
        'Tamaños: Small, Medium (recomiende primero), Large.',
        'Llame al gerente si hace falta.'
      ]
    },
    never: {
      ko: ['"What is the occasion?"이라고 묻지 않는다.', '손님이 있는데 전화를 먼저 받지 않는다.'],
      en: ['Do not ask "What is the occasion?"', 'Do not take a phone call before helping a customer in the shop.'],
      ja: ['occasionと聞かない。', '来店客より電話を優先しない。'],
      es: ['No pregunte "What is the occasion?"', 'No atienda el teléfono antes que al cliente en tienda.']
    },
    done: {
      ko: ['인사와 니즈 질문 완료', '색·사이즈 안내 완료'],
      en: ['Greeting and needs question done', 'Color and size guidance given'],
      ja: ['挨拶・ニーズ', '色・サイズ案内'],
      es: ['Saludo y necesidades', 'Color y tamaño']
    }
  },

  phone: {
    title: {
      ko: '전화 응대',
      en: 'Phone',
      ja: '電話対応',
      es: 'Teléfono'
    },
    goal: {
      ko: '전화를 올바른 인사말로 받고, 필요 시 홀드한다. 매장 손님이 있으면 손님이 우선이다.',
      en: 'Answer with the correct greeting, hold when needed; walk-in customers still come first.',
      ja: '正しい挨拶で電話に出る。来店客がいればそちら優先。',
      es: 'Conteste con el saludo correcto; cliente en tienda primero.'
    },
    before: {
      ko: ['매장에 손님이 있으면 손님을 먼저 도운 뒤 전화를 받는다.'],
      en: ['If a customer is in the shop, help them before the phone.'],
      ja: ['来店客がいれば先に接客。'],
      es: ['Si hay cliente en tienda, atiéndalo primero.']
    },
    steps: {
      ko: [
        '매장 손님 여부를 확인한다. 손님이 있으면 손님 응대 가이드를 먼저 따른다.',
        '전화를 받는다.',
        '정확히 이렇게 말한다: "Thank you for calling Conroy\'s Flowers. How may I help you?"',
        '확인·이전이 필요하면 홀드 전에 말한다: "Thank you for calling Conroy\'s. May I place you on a brief hold?"',
        '홀드 후 돌아와 이어서 응대한다.',
        '주문·배달 등 BMS 작업이 필요하면 해당 가이드(Messages, 배달 등)를 따른다.'
      ],
      en: [
        'Check for walk-in customers first; if any, follow Customer guide first.',
        'Answer the phone.',
        'Say exactly: "Thank you for calling Conroy\'s Flowers. How may I help you?"',
        'If you need a moment: "Thank you for calling Conroy\'s. May I place you on a brief hold?"',
        'Return from hold and continue.',
        'For order/delivery work in BMS, follow the matching guide (Messages, Delivery, etc.).'
      ],
      ja: [
        '来店客を優先。',
        '電話に出る。',
        '指定の英語挨拶。',
        '必要ならホールド許諾の英語。',
        '戻って対応。',
        'BMS作業は該当ガイドへ。'
      ],
      es: [
        'Priorice cliente en tienda.',
        'Conteste.',
        'Saludo en inglés exacto.',
        'Pida permiso para hold.',
        'Regrese y continúe.',
        'Trabajo BMS según guía.']
    },
    never: {
      ko: ['매장 손님을 둔 채 긴 통화만 하지 않는다.', '홀드 허락 없이 길게 기다리게 하지 않는다.'],
      en: ['Do not ignore a walk-in for a long call.', 'Do not leave the caller on hold without asking.'],
      ja: ['来店客を無視した長電話をしない。', '断りなく長時間ホールドしない。'],
      es: ['No ignore al cliente en tienda.', 'No deje en espera sin pedir permiso.']
    },
    done: {
      ko: ['올바른 인사말 사용', '필요 시 홀드 허락'],
      en: ['Used correct greeting', 'Asked before hold if needed'],
      ja: ['正しい挨拶', 'ホールド許諾'],
      es: ['Saludo correcto', 'Permiso de hold']
    }
  },

  messages: {
    title: {
      ko: 'Messages / In Wire 확인',
      en: 'Messages / In Wire',
      ja: 'Messages / In Wire',
      es: 'Messages / In Wire'
    },
    goal: {
      ko: 'Wire-In 주문을 읽고 Mark Read 한 뒤 In Wire에서 Accept하고 SuperTicket을 준비한다.',
      en: 'Read Wire-In orders, Mark Read, Accept in In Wire, and prepare SuperTicket.',
      ja: 'Wire-Inを読みMark Read→In WireでAccept→SuperTicket。',
      es: 'Leer Wire-In, Mark Read, Accept y SuperTicket.'
    },
    before: {
      ko: ['BMS 로그인.', '위쪽 Messages/In Wire 카운터를 수시로 본다.'],
      en: ['Logged into BMS.', 'Watch Messages/In Wire counters often.'],
      ja: ['BMSログイン。', 'カウンターを頻繁に見る。'],
      es: ['En BMS.', 'Mire los contadores a menudo.']
    },
    steps: {
      ko: [
        '화면 위 Messages 카운터가 올라갔는지 확인한다.',
        '왼쪽 메뉴 Messages를 연다.',
        '새 메시지를 열어 주문 내용을 읽는다. Funeral/긴급이면 최우선으로 처리한다.',
        'Mark Read를 누른다.',
        '왼쪽 메뉴 In Wire로 이동한다.',
        '주문을 검토한 뒤 Accept를 누른다.',
        'Accept 후 SuperTicket 출력을 확인하고 Delivery Date별로 캐비닛에 정리한다.',
        'Reject가 필요해 보이면 누르지 말고 매니저에게 문의한다.'
      ],
      en: [
        'Check if the Messages counter went up.',
        'Open Messages on the left menu.',
        'Open the new message and read it. Funeral/urgent orders are highest priority.',
        'Click Mark Read.',
        'Go to In Wire on the left menu.',
        'Review the order, then click Accept.',
        'Confirm SuperTicket print and file by Delivery Date in the cabinet.',
        'If you think Reject is needed, do not click it — ask a manager.'
      ],
      ja: [
        'Messagesカウンター確認。',
        'Messagesを開く。',
        '内容を読む。Funeralは最優先。',
        'Mark Read。',
        'In Wire。',
        'Accept。',
        'SuperTicket整理。',
        'Rejectはマネージャーに確認。'
      ],
      es: [
        'Revise contador Messages.',
        'Abra Messages.',
        'Lea; Funeral es prioridad.',
        'Mark Read.',
        'In Wire.',
        'Accept.',
        'Archive SuperTicket.',
        'Reject solo con gerente.']
    },
    never: {
      ko: ['매니저 승인 없이 Reject'],
      en: ['Never Reject without manager approval'],
      ja: ['承認なしReject禁止'],
      es: ['Nunca Reject sin gerente']
    },
    done: {
      ko: ['Mark Read', 'Accept', 'SuperTicket 정리'],
      en: ['Mark Read', 'Accept', 'SuperTicket filed'],
      ja: ['Mark Read', 'Accept', 'SuperTicket'],
      es: ['Mark Read', 'Accept', 'SuperTicket']
    }
  }
};

/** Render a detailed guide object into HTML for modals */
window.renderGuideDetailHtml = function (key) {
  const g = window.CF_GUIDE_DETAIL && window.CF_GUIDE_DETAIL[key];
  if (!g) return null;
  const L = typeof currentLang !== 'undefined' ? currentLang : 'en';
  const t = function (obj) {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[L] || obj.en || obj.ko || '';
  };
  const list = function (arrObj) {
    const arr = arrObj[L] || arrObj.en || [];
    return arr;
  };
  const labels = {
    goal: { ko: '이 가이드로 할 수 있는 일', en: 'What this guide covers', ja: 'このガイドでできること', es: 'Qué cubre esta guía' },
    before: { ko: '시작 전에', en: 'Before you start', ja: '始める前に', es: 'Antes de empezar' },
    steps: { ko: '단계', en: 'Steps', ja: '手順', es: 'Pasos' },
    never: { ko: '절대 하지 말 것', en: 'Never do this', ja: '絶対にしないこと', es: 'Nunca haga esto' },
    done: { ko: '끝났는지 확인', en: 'Done checklist', ja: '完了確認', es: 'Lista de terminado' },
    stuck: { ko: '막히면', en: 'If stuck', ja: '詰まったら', es: 'Si se traba' }
  };
  let html = '<h3>' + t(g.title) + '</h3>';
  html += '<div class="script-box" style="margin-bottom:12px"><strong>' + t(labels.goal) + '</strong><br>' + t(g.goal) + '</div>';
  html += '<p style="font-weight:600;margin-bottom:6px">' + t(labels.before) + '</p><ul style="padding-left:20px;margin-bottom:12px;line-height:1.6">';
  list(g.before).forEach(function (x) {
    html += '<li>' + x + '</li>';
  });
  html += '</ul>';
  html += '<p style="font-weight:600;margin-bottom:6px">' + t(labels.steps) + '</p><ol style="padding-left:20px;margin-bottom:12px;line-height:1.75">';
  list(g.steps).forEach(function (x) {
    html += '<li style="margin-bottom:8px">' + x + '</li>';
  });
  html += '</ol>';
  html += '<div class="alert alert-warn" style="margin-bottom:12px"><strong>' + t(labels.never) + '</strong><ul style="margin:8px 0 0;padding-left:18px">';
  list(g.never).forEach(function (x) {
    html += '<li>' + x + '</li>';
  });
  html += '</ul></div>';
  html += '<p style="font-weight:600;margin-bottom:6px">' + t(labels.done) + '</p><div class="checklist">';
  list(g.done).forEach(function (x) {
    html += '<label><input type="checkbox"> ' + x + '</label>';
  });
  html += '</div>';
  html +=
    '<div class="alert alert-info" style="margin-top:12px">' +
    t(labels.stuck) +
    ': ' +
    ({
      ko: '확신이 없으면 매니저에게 먼저 문의하세요 (Golden Rule #5).',
      en: 'If unsure, ask a manager first (Golden Rule #5).',
      ja: '確信がなければマネージャーに相談 (Golden Rule #5)。',
      es: 'Si no está seguro, consulte al gerente (Golden Rule #5).'
    }[L] || 'If unsure, ask a manager first (Golden Rule #5).') +
    '</div>';
  return html;
};
