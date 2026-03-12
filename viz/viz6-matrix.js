/**
 * 方案六：PA 互补对 + PA→T 服务矩阵
 * 上半区：4 对互补对（可视化配对卡片）
 * 下半区：PA→T 服务矩阵（交互热力格，点击单元格查看说明）
 */
function initViz6() {
  const container = document.getElementById('panel6-content');
  if (!container || container.dataset.inited === '1') return;
  container.dataset.inited = '1';
  container.innerHTML = '';

  /* ────── 第一区：PA 互补对 ────── */
  const pairSection = document.createElement('div');
  pairSection.className = 'v6-section';

  const pairTitle = document.createElement('div');
  pairTitle.className = 'v6-section-title';
  pairTitle.innerHTML = '<span class="v6-icon">⇄</span> PA 层四对互补对（Complementary Pairs）';
  pairSection.appendChild(pairTitle);

  const pairDesc = document.createElement('div');
  pairDesc.className = 'v6-section-desc';
  pairDesc.textContent = 'PA 层的 9 条公理不是简单并列，而是形成四对互补关系。点击配对查看详细说明。';
  pairSection.appendChild(pairDesc);

  const pairGrid = document.createElement('div');
  pairGrid.className = 'v6-pair-grid';

  const colorMap = {
    PA1: '#6b9bd1', PA2: '#c07a6a', PA3: '#c09a5a',
    PA4: '#7b9b6b', PA5: '#9b7bb8', PA6: '#7b9b9b',
    PA7: '#9b8b5b', PA8: '#8b6bab', PA9: '#6b8bab'
  };

  (TPAG_DATA.pairings || []).forEach(pair => {
    const card = document.createElement('div');
    card.className = 'v6-pair-card';
    card.innerHTML = `
      <div class="v6-pair-name">${pair.name}</div>
      <div class="v6-pair-body">
        <div class="v6-pair-node" style="background:${colorMap[pair.pa1] || '#777'}22;border-color:${colorMap[pair.pa1] || '#777'}">
          <span class="v6-pair-badge" style="background:${colorMap[pair.pa1] || '#777'}">${pair.pa1}</span>
        </div>
        <div class="v6-pair-arrow">↔</div>
        <div class="v6-pair-node" style="background:${colorMap[pair.pa2] || '#777'}22;border-color:${colorMap[pair.pa2] || '#777'}">
          <span class="v6-pair-badge" style="background:${colorMap[pair.pa2] || '#777'}">${pair.pa2}</span>
        </div>
      </div>
      <div class="v6-pair-tagline">${pair.tagline}</div>
      <div class="v6-pair-serves">服务：${pair.serves}</div>
    `;
    card.title = '点击查看详情';
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      showRichDetail({
        id: pair.id,
        label: pair.name,
        badge: pair.pa1 + ' ↔ ' + pair.pa2,
        badgeColor: '#9b7bb8',
        desc: pair.tagline + '\n\n服务的 T 目标：' + pair.serves,
        detail: pair.detail
      });
    });
    pairGrid.appendChild(card);
  });

  pairSection.appendChild(pairGrid);
  container.appendChild(pairSection);

  /* ────── 第二区：PA→T 服务矩阵 ────── */
  const matSection = document.createElement('div');
  matSection.className = 'v6-section';

  const matTitle = document.createElement('div');
  matTitle.className = 'v6-section-title';
  matTitle.innerHTML = '<span class="v6-icon">◉</span> PA→T 服务矩阵';
  matSection.appendChild(matTitle);

  const matDesc = document.createElement('div');
  matDesc.className = 'v6-section-desc';
  matDesc.innerHTML =
    '<span class="v6-legend-dot v6-dot-primary"></span>● 主要服务（缺失则该 T 直接失效）&nbsp;&nbsp;' +
    '<span class="v6-legend-dot v6-dot-secondary"></span>○ 次要服务（缺失对该 T 有影响但非直接）&nbsp;&nbsp;' +
    '<span class="v6-legend-dot v6-dot-empty"></span>空格 无直接关系&nbsp;&nbsp;&nbsp;' +
    '点击单元格查看交叉说明。';
  matSection.appendChild(matDesc);

  const tHeaders = ['T1 可定义性', 'T2 合法性', 'T3 持续演化', 'T4 开放演化', 'T5 有效耦合'];
  const tIds = ['T1', 'T2', 'T3', 'T4', 'T5'];

  const table = document.createElement('table');
  table.className = 'v6-matrix-table';

  // 表头行
  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');
  headRow.innerHTML = '<th class="v6-th-corner">PA \\ T</th>';
  tHeaders.forEach((h, i) => {
    const th = document.createElement('th');
    th.className = 'v6-th-t';
    th.style.color = '#6b9bd1';
    th.innerHTML = `<span class="v6-t-badge">${tIds[i]}</span><br><span class="v6-t-name">${h.replace(/^T\d+ /, '')}</span>`;
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);
  table.appendChild(thead);

  // 数据行
  const tbody = document.createElement('tbody');
  (TPAG_DATA.serviceMatrix || []).forEach((row, ri) => {
    const tr = document.createElement('tr');
    // PA 标签列
    const tdPA = document.createElement('td');
    tdPA.className = 'v6-td-pa';
    const paNode = (TPAG_DATA.nodes.PA || []).find(n => n.id === row.pa);
    tdPA.innerHTML = `<span class="v6-pa-badge" style="background:${colorMap[row.pa] || '#777'}">${row.pa}</span><span class="v6-pa-short">${paNode ? paNode.short.slice(0, 20) : ''}</span>`;
    tdPA.style.cursor = 'pointer';
    tdPA.title = '点击查看 ' + row.pa + ' 详情';
    tdPA.addEventListener('click', () => {
      const node = (TPAG_DATA.nodes.PA || []).find(n => n.id === row.pa);
      if (node) showRichDetail({ ...node, layer: 'PA', badge: row.pa, badgeColor: colorMap[row.pa] || '#777' });
    });
    tr.appendChild(tdPA);

    // T 列
    tIds.forEach((tid, ci) => {
      const val = row[tid] || '';
      const td = document.createElement('td');
      td.className = 'v6-td-cell' + (val === '●' ? ' v6-cell-primary' : val === '○' ? ' v6-cell-secondary' : ' v6-cell-empty');
      td.textContent = val || '·';
      td.title = row.pa + ' → ' + tid + ': ' + (val === '●' ? '主要服务' : val === '○' ? '次要服务' : '无直接关系');
      td.style.cursor = val ? 'pointer' : 'default';
      if (val) {
        td.addEventListener('click', () => {
          const paNode2 = (TPAG_DATA.nodes.PA || []).find(n => n.id === row.pa);
          const tNode = (TPAG_DATA.nodes.T || []).find(n => n.id === tid);
          showRichDetail({
            id: row.pa + '_' + tid,
            label: `${row.pa} → ${tid}`,
            badge: val === '●' ? '主要服务' : '次要服务',
            badgeColor: val === '●' ? '#e8a04a' : '#7ba67b',
            desc: `${row.pa}（${paNode2 ? paNode2.short : ''}）\n${val === '●' ? '主要' : '次要'}服务 ${tid}（${tNode ? tNode.short : ''}）`,
            detail: paNode2 ? (paNode2.desc || '') : ''
          });
        });
      }
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  matSection.appendChild(table);

  // 矩阵下方：每列（T目标）的必要PA说明
  const tSummary = document.createElement('div');
  tSummary.className = 'v6-t-summary';
  const tSummaryData = [
    { t: 'T1', pas: 'PA1（主）+ PA5（主）', note: '缺 PA1 则连系统结构都无法表达；缺 PA5 则状态所有权不明。' },
    { t: 'T2', pas: 'PA2（主）+ PA5（主）+ PA6（主）', note: 'PA1/PA7/PA9 共同补足"接口完备"语义。' },
    { t: 'T3', pas: 'PA2 + PA3 + PA4 + PA6（四者缺一不可）', note: '分别防止：无界爆炸 / 单调耗尽 / 调度断裂 / 效应积压。' },
    { t: 'T4', pas: 'PA8（独立对应）', note: 'PA8 是非病态轨道的直接条件，无其他公理可替代。' },
    { t: 'T5', pas: 'PA7（主）+ PA9（主）+ PA1（次）', note: 'PA7 保证信息到达（观察侧）；PA9 保证行动有效（行动侧）。' }
  ];
  const summaryGrid = document.createElement('div');
  summaryGrid.className = 'v6-summary-grid';
  tSummaryData.forEach(item => {
    const card = document.createElement('div');
    card.className = 'v6-summary-card';
    card.innerHTML = `<div class="v6-summary-t" style="color:#6b9bd1">${item.t}</div><div class="v6-summary-pas">${item.pas}</div><div class="v6-summary-note">${item.note}</div>`;
    summaryGrid.appendChild(card);
  });
  tSummary.appendChild(summaryGrid);
  matSection.appendChild(tSummary);

  container.appendChild(matSection);
}
