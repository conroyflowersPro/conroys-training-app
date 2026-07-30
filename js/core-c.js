/* Conroy's Training App - content modals */
    const taskDetails = {
      open_shop: {
        content: {
          ko: '가게를 열 때 가장 먼저 하는 일입니다. 외부 게이트/펜스가 있다면 열고, 필요시 조명을 켭니다.',
          en: 'First actions when opening the shop. Open outside gate/fence if needed and turn on lights.'
        },
        checklist: ['게이트/펜스 열기', '조명 켜기', 'POS 시스템으로 이동']
      },
      start_day: {
        content: {
          ko: 'Home → Start Day / End Day. Open Cash Drawer (비밀번호 123456). 권종별 수량을 입력하세요. Start Day Amount는 항상 $200.00.',
          en: 'Home → Start Day / End Day. Open Cash Drawer (password 123456). Enter quantity of each denomination. Must equal $200.00.'
        },
        checklist: ['캐시 드로어 열기', '권종별 수량 입력', '$200.00 확인', '금액 + 사진 앱에 저장']
      },
      cooler_vase: {
        content: {
          ko: '쿨러 안 화병 어레인지먼트를 모두 점검합니다. 물이 흐리거나 부족하면 즉시 교체하고, 손상된 꽃은 제거합니다.',
          en: 'Inspect all vase arrangements in the cooler. Replace cloudy/low water, remove damaged flowers.'
        },
        checklist: ['물 상태 확인', '손상된 꽃 제거', '필요시 물 교체']
      },
      cooler_loose: {
        content: {
          ko: '루스 플라워 버킷을 점검합니다. 물을 보충하고, 손상된 꽃/잎을 제거한 뒤 색상과 종류별로 정리합니다.',
          en: 'Check loose flower buckets. Refill water, remove damaged flowers/leaves, organize by color.'
        },
        checklist: ['물 보충', '손상 꽃/잎 제거', '색상·종류별 정리']
      },
      messages_check: {
        content: {
          ko: 'Messages를 열어 내용을 확인한 뒤 Mark Read를 누르고, In Wire에서 Accept 합니다. Reject는 매니저 승인 없이 절대 누르지 마세요.',
          en: 'Review Messages → Mark Read → Accept in In Wire. Never Reject without manager approval.'
        },
        checklist: ['Messages 열기', '주문 내용 확인', 'Mark Read', 'In Wire에서 Accept']
      },
      monitor_orders: {
        content: {
          ko: '하루 종일 들어오는 주문을 Due Time 기준으로 우선순위를 정해 처리합니다.',
          en: 'Monitor incoming orders and prioritize by Due Time.'
        },
        checklist: ['Due Time 확인', '급한 주문 우선 처리']
      },
      attachments: {
        content: {
          ko: 'White Sheet의 Product Detail을 보고 첨부물이 있는지 확인합니다. 첨부물이 있으면 White Sheet를 떼지 말고 모두 확인·부착한 뒤에만 Set As Awaiting Delivery를 합니다.',
          en: 'Check Product Detail on White Sheet for attachments. Do not remove White Sheet until all are verified and attached.'
        },
        checklist: ['White Sheet Product Detail 확인', '풍선/초콜릿/인형/카드 준비', '모두 부착 확인']
      },
      end_day: {
        content: {
          ko: '정확히 $200.00을 캐시 드로어에 남깁니다. Summary Receipt를 출력하고, 초과 현금을 봉투에 넣어 금고에 보관합니다.',
          en: 'Leave exactly $200.00 in the drawer. Print Summary Receipt, put excess cash in deposit envelope → safe.'
        },
        checklist: ['$200 남기기', 'Summary Receipt 출력', '초과 현금 봉투에 넣기', 'End Register Session']
      }
    };

    function showTaskDetail(taskId) {
      const task = routineTasks.find(t => t.id === taskId);
      const detail = taskDetails[taskId];
      if (!task || !detail) return;
      const title = task.title[currentLang] || task.title.en;
      const content = detail.content[currentLang] || detail.content.en;
      const modal = document.getElementById('modal-content');
      let html = `<button class="close-modal" onclick="closeModal()">×</button>
        <h3>${title}</h3>
        <div class="script-box" style="margin-bottom:14px">${content}</div>
        <p style="font-weight:600;margin-bottom:8px">${{ko:'체크리스트',en:'Checklist',ja:'チェックリスト',es:'Lista'}[currentLang]||'Checklist'}</p>
        <div class="checklist">`;
      detail.checklist.forEach(item => {
        html += `<label><input type="checkbox"> ${item}</label>`;
      });
      html += `</div>`;
      if (!stamps[taskId]?.done) {
        html += `<button class="btn" style="width:100%;margin-top:16px" onclick="closeModal(); toggleStamp('${taskId}')">${{ko:'이 항목 완료 처리',en:'Mark as Done',ja:'完了',es:'Marcar'}[currentLang]||'Mark as Done'}</button>`;
      }
      modal.innerHTML = html;
      document.getElementById('modal-overlay').classList.remove('hidden');
    }

    function showContent(type) {
      const modal = document.getElementById('modal-content');
      let html = `<button class="close-modal" onclick="closeModal()">×</button>`;
      if (type === 'attachments') {
        html += `<h3>${currentLang==='ko'?'첨부물 체크리스트':'Attachment Checklist'}</h3>
          <div class="checklist">
            <label><input type="checkbox"> Balloons / 풍선</label>
            <label><input type="checkbox"> Chocolates / 초콜릿</label>
            <label><input type="checkbox"> Plush / Teddy / 인형</label>
            <label><input type="checkbox"> CardIsle Greeting Card</label>
          </div>
          <div class="alert alert-warn" style="margin-top:12px">${currentLang==='ko'?'White Sheet는 모든 첨부물 확인·부착이 끝나기 전까지 떼지 마세요!':'Do not remove the White Sheet until ALL attachments are verified!'}</div>`;
      } else if (type === 'bmsflow') {
        html += `<h3>BMS Workflow</h3>
          <ol style="padding-left:20px;line-height:1.8">
            <li>New Order Received (Messages / In Wire)</li>
            <li>Review → Mark Read</li>
            <li>Accept Order (In Wire)</li>
            <li>Print SuperTicket</li>
            <li>Design + Attachments</li>
            <li>Set As Awaiting Delivery</li>
            <li>Create Delivery Trip</li>
          </ol>`;
      } else if (type === 'delivery') {
        html += `<h3>${currentLang==='ko'?'배달 가이드':'Delivery Guide'}</h3>
          <div class="script-box"><strong>Standard</strong><br>Provider: Walmart GoLocal · 3Hr Window</div>
          <div class="script-box"><strong>Funeral</strong><br>Provider: Uber · ASAP</div>`;
      } else if (type === 'golden') {
        html += `<h3>Golden Rules</h3>
          <ol style="padding-left:20px;line-height:1.7">
            <li>Always prioritize orders based on Due Time.</li>
            <li>Never begin designing without a printed design ticket.</li>
            <li>Do not complete an order until all required work is finished.</li>
            <li>Always send a Delivery Attempted message before changing the delivery date.</li>
            <li>If unsure, contact a manager before taking action.</li>
          </ol>`;
      } else if (type === 'decision') {
        html += `<h3>${currentLang==='ko'?'모르겠을 때':'If Unsure'}</h3>
          <div class="alert alert-info">${currentLang==='ko'?'Golden Rule #5: 확신이 없으면 먼저 매니저에게 문의하세요.':'Golden Rule #5: If unsure, contact a manager first.'}</div>`;
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
          html += `<div class="summary-item"><span>✓ ${title}</span><span>${s.time||''}${s.amount!=null?' · $'+s.amount:''}</span></div>`;
        } else {
          html += `<div class="summary-item" style="color:var(--muted)"><span>○ ${title}</span><span>—</span></div>`;
        }
      });
      html += `<div class="alert alert-success" style="margin-top:14px">${done} / ${routineTasks.length} completed</div>`;
      modal.innerHTML = html;
      document.getElementById('modal-overlay').classList.remove('hidden');
    }
