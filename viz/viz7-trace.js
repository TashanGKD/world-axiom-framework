/**
 * 方案七：G 层依赖矩阵 + 追溯链浏览器
 * 上半区：G0-G8 依赖矩阵（颜色区分 ● ○ ↑）
 * 下半区：追溯链浏览器（选择追溯链示例，展示 T→PA→G→具体要求 完整推导路径）
 */
function initViz7() {
  const container = document.getElementById('panel7-content');
  if (!container || container.dataset.inited === '1') return;
  container.dataset.inited = '1';
  container.innerHTML = '';

  const gIds = ['G0', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8'];
  const gNodes = TPAG_DATA.nodes.G || [];
  const gMap = {};
  gNodes.forEach(n => { gMap[n.id] = n; });

  /* ────── 第一区：G 层依赖矩阵 ────── */
  const matSection = document.createElement('div');
  matSection.className = 'v6-section';

  const matTitle = document.createElement('div');
  matTitle.className = 'v6-section-title';
  matTitle.innerHTML = '<span class="v6-icon">⬡</span> G 层内在依赖矩阵';
  matSection.appendChild(matTitle);

  const matDesc = document.createElement('div');
  matDesc.className = 'v6-section-desc';
  matDesc.innerHTML =
    '行依赖列（即"行"需要"列"作为前置条件）。&nbsp;&nbsp;' +
    '<span class="v6-legend-dot v6-dot-primary"></span>● 强前置依赖&nbsp;&nbsp;' +
    '<span class="v6-legend-dot v6-dot-secondary"></span>○ 弱依赖&nbsp;&nbsp;' +
    '<span class="v6-legend-dot v6-dot-eng"></span>↑ 工程增强（G8 对 G0–G7）&nbsp;&nbsp;' +
    '—&nbsp;自身&nbsp;&nbsp;点击单元格或列标题查看说明。';
  matSection.appendChild(matDesc);

  const table = document.createElement('table');
  table.className = 'v6-matrix-table v7-dep-table';

  // 表头
  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');
  headRow.innerHTML = '<th class="v6-th-corner">依赖 ↓ &nbsp;/&nbsp; 列 →</th>';
  gIds.forEach(gid => {
    const th = document.createElement('th');
    th.className = 'v6-th-t v7-th-g';
    const gNode = gMap[gid];
    th.innerHTML = `<span class="v6-t-badge" style="background:#7ba67b">${gid}</span><br><span class="v6-t-name" style="color:#7ba67b">${gNode ? gNode.short.slice(0, 8) + '…' : ''}</span>`;
    th.style.cursor = 'pointer';
    th.title = gNode ? gNode.short : gid;
    th.addEventListener('click', () => {
      if (gNode) showRichDetail({ ...gNode, layer: 'G', badge: gid, badgeColor: '#7ba67b' });
    });
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);
  table.appendChild(thead);

  // 数据行
  const tbody = document.createElement('tbody');
  const depMatrix = TPAG_DATA.gDepMatrix || {};
  gIds.forEach(rowId => {
    const tr = document.createElement('tr');
    // 行标签
    const tdG = document.createElement('td');
    tdG.className = 'v6-td-pa v7-td-g';
    const gNode = gMap[rowId];
    tdG.innerHTML = `<span class="v6-pa-badge" style="background:#7ba67b">${rowId}</span><span class="v6-pa-short" style="color:#7ba67b">${gNode ? gNode.short.slice(0, 14) : ''}</span>`;
    tdG.style.cursor = 'pointer';
    tdG.addEventListener('click', () => {
      if (gNode) showRichDetail({ ...gNode, layer: 'G', badge: rowId, badgeColor: '#7ba67b' });
    });
    tr.appendChild(tdG);

    // 依赖列
    const rowData = depMatrix[rowId] || {};
    gIds.forEach(colId => {
      const val = rowData[colId] || '';
      const td = document.createElement('td');
      const isGreater = gIds.indexOf(colId) > gIds.indexOf(rowId);
      if (isGreater && !val) {
        td.className = 'v6-td-cell v7-cell-na';
        td.textContent = '·';
      } else if (val === '—') {
        td.className = 'v6-td-cell v7-cell-self';
        td.textContent = '—';
      } else if (val === '●') {
        td.className = 'v6-td-cell v6-cell-primary';
        td.textContent = '●';
        td.style.cursor = 'pointer';
        td.title = rowId + ' 强前置依赖 ' + colId;
        td.addEventListener('click', () => {
          showRichDetail({
            id: rowId + '_dep_' + colId,
            label: rowId + ' 强前置依赖 ' + colId,
            badge: '强前置依赖 ●',
            badgeColor: '#e8a04a',
            desc: `${rowId}（${gMap[rowId] ? gMap[rowId].short : ''}）\n强前置依赖 ${colId}（${gMap[colId] ? gMap[colId].short : ''}）\n\n缺少 ${colId} 则 ${rowId} 失去意义。`,
            detail: v7_getDepDetail(rowId, colId)
          });
        });
      } else if (val === '○') {
        td.className = 'v6-td-cell v6-cell-secondary';
        td.textContent = '○';
        td.style.cursor = 'pointer';
        td.title = rowId + ' 弱依赖 ' + colId;
        td.addEventListener('click', () => {
          showRichDetail({
            id: rowId + '_dep_' + colId,
            label: rowId + ' 弱依赖 ' + colId,
            badge: '弱依赖 ○',
            badgeColor: '#7ba67b',
            desc: `${rowId}（${gMap[rowId] ? gMap[rowId].short : ''}）\n弱依赖 ${colId}（${gMap[colId] ? gMap[colId].short : ''}）`,
            detail: v7_getDepDetail(rowId, colId)
          });
        });
      } else if (val === '↑') {
        td.className = 'v6-td-cell v7-cell-eng';
        td.textContent = '↑';
        td.style.cursor = 'pointer';
        td.title = rowId + '（G8）工程增强 ' + colId;
        td.addEventListener('click', () => {
          showRichDetail({
            id: 'G8_eng_' + colId,
            label: 'G8 工程增强 ' + colId,
            badge: '工程增强 ↑',
            badgeColor: '#6b8bab',
            desc: `G8（工程鲁棒性）增强 ${colId} 在现实计算机环境中的鲁棒性。删掉 G8 后，${colId} 的逻辑结构不坍塌，但实现层更容易出现抖动、漂移、double-write 或崩溃。`,
            detail: ''
          });
        });
      } else {
        td.className = 'v6-td-cell v6-cell-empty';
        td.textContent = '·';
      }
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  matSection.appendChild(table);

  // 依赖关系文字说明
  const depNote = document.createElement('div');
  depNote.className = 'v7-dep-note';
  depNote.innerHTML = `
    <div class="v7-dep-note-row"><strong>核心串行链：</strong>G0 → G1 → G2 → G3 → G4（前者是后者的强前置依赖）</div>
    <div class="v7-dep-note-row"><strong>并行关系：</strong>G5 与 G6 概念上互不依赖：G5 保证功能正确，G6 保证可追溯</div>
    <div class="v7-dep-note-row"><strong>特化目标：</strong>G7 依赖 G3 + G6，是 LLM-based agent 的专属特化</div>
    <div class="v7-dep-note-row"><strong>工程增强：</strong>G8 增强 G0–G7 在现实中的鲁棒性，删掉 G8 后 G0–G7 逻辑结构不坍塌</div>
  `;
  matSection.appendChild(depNote);
  container.appendChild(matSection);

  /* ────── 第二区：追溯链浏览器 ────── */
  const traceSection = document.createElement('div');
  traceSection.className = 'v6-section';

  const traceTitle = document.createElement('div');
  traceTitle.className = 'v6-section-title';
  traceTitle.innerHTML = '<span class="v6-icon">⬆</span> 完整追溯链浏览器（T → PA → G → 具体要求）';
  traceSection.appendChild(traceTitle);

  const traceDesc = document.createElement('div');
  traceDesc.className = 'v6-section-desc';
  traceDesc.textContent = '选择一个追溯链示例，查看从本质目标 T 到具体 G 要求的完整推导路径，以及违反后的连锁失效分析。';
  traceSection.appendChild(traceDesc);

  // 追溯链选择器
  const selectorRow = document.createElement('div');
  selectorRow.className = 'v7-selector-row';
  const traces = TPAG_DATA.traces || [];

  const traceDisplay = document.createElement('div');
  traceDisplay.className = 'v7-trace-display';
  traceDisplay.innerHTML = '<div class="v7-trace-placeholder">← 从左侧选择一个追溯链示例</div>';

  traces.forEach((trace, idx) => {
    const btn = document.createElement('button');
    btn.className = 'v7-trace-btn';
    btn.textContent = trace.label;
    btn.addEventListener('click', () => {
      document.querySelectorAll('.v7-trace-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTrace(trace, traceDisplay);
    });
    selectorRow.appendChild(btn);
  });

  const traceBody = document.createElement('div');
  traceBody.className = 'v7-trace-body';
  traceBody.appendChild(selectorRow);
  traceBody.appendChild(traceDisplay);
  traceSection.appendChild(traceBody);
  container.appendChild(traceSection);
}

function v7_getDepDetail(rowId, colId) {
  const depDetails = {
    'G1_G0': 'G0 定义了系统的存在性与本体结构；G1 的合法状态域（写隔离、能量有界等不变量）必须在 G0 存在性成立的基础上才能定义。没有 G0，无法定义"什么是合法状态"。',
    'G2_G0': 'G2 的四阶段演化（assemble→evolve→emit→apply）依赖 G0 定义的粒子三元组结构（V_P, View_P, R_P）和存储归属拓扑。',
    'G2_G1': 'G2 的演化完备性依赖 G1 的合法状态域；没有合法状态的边界，无法定义演化是否"完备"。',
    'G3_G0': 'G3 的持续稳定性依赖 G0 的存在性，包括粒子三元组和调度器的本体定义。',
    'G3_G1': 'G3 的稳定性条件（不能积压、不能无界增长等）依赖 G1 的不变量保证——不变量被污染则稳定性条件无法成立。',
    'G3_G2': '不能完成一次演化（G2），不可能谈无限演化（G3）。G2 是 G3 的单步基础。',
    'G4_G3': 'G4（开放演化性）依赖 G3（系统先活着，才能谈是否空转）。G3 保证系统"还活着"；G4 保证"活着的方式有语义意义"。',
    'G5_G0': 'G5 的语义有效耦合（Field/Activity 建模、FieldProfile 存储位置等）依赖 G0 对存储归属拓扑的定义。',
    'G5_G2': 'G5 的 emit 路由（动作如何影响世界）依赖 G2 的四阶段演化结构。',
    'G6_G0': 'G6 的审计真源（Global Event Log 归属在 meta/）依赖 G0 对存储归属的定义。',
    'G6_G1': 'G6 的审计可信性依赖 G1 的写权明确——只有写权唯一时，审计日志才是可信的。',
    'G7_G3': 'G7 的认知连续性依赖 G3 提供的 memory 有界保证（G3-R006）和系统持续运行保证。',
    'G7_G6': 'G7 的中断恢复依赖 G6 的可追溯性——resume_token 和崩溃恢复需要 Event Log 作为规范重建源。'
  };
  return depDetails[rowId + '_' + colId] || '';
}

function renderTrace(trace, container) {
  const layerColors = { T: '#6b9bd1', PA: '#9b7bb8', G: '#7ba67b' };
  const layerNames = { T: 'T层 本质目标', PA: 'PA层 抽象公理', G: 'G层 系统目标' };
  const roleColors = { '本质目标': '#6b9bd1', '公理化': '#9b7bb8', '具体化': '#7ba67b', '具体化（特化）': '#9ba67b', '理论层具体化': '#7ba67b', '工程层实现': '#6b8bab', '精化要求': '#c0894a' };

  let html = `<div class="v7-trace-card">`;
  html += `<div class="v7-trace-label">${trace.label}</div>`;

  // 链条步骤
  html += `<div class="v7-chain-steps">`;
  (trace.chain || []).forEach((step, i) => {
    const isLast = i === trace.chain.length - 1;
    const isReq = step.id && !['T1','T2','T3','T4','T5','PA1','PA2','PA3','PA4','PA5','PA6','PA7','PA8','PA9','G0','G1','G2','G3','G4','G5','G6','G7','G8'].includes(step.id);
    const color = isReq ? '#c0894a' : (layerColors[step.id ? step.id[0] : 'G'] || '#888');
    const roleColor = roleColors[step.role] || '#888';

    html += `
      <div class="v7-chain-step ${isLast ? 'v7-step-last' : ''}">
        <div class="v7-step-left">
          <div class="v7-step-dot" style="background:${color}"></div>
          ${!isLast ? '<div class="v7-step-line"></div>' : ''}
        </div>
        <div class="v7-step-right">
          <div class="v7-step-header">
            <span class="v7-step-id" style="background:${color}22;color:${color};border-color:${color}">${step.id}</span>
            <span class="v7-step-role" style="color:${roleColor}">${step.role}</span>
          </div>
          <div class="v7-step-text">${step.text}</div>
        </div>
      </div>
    `;
    if (!isLast) {
      html += `<div class="v7-chain-arrow">↓ ${i === 0 ? '公理化（从 T 推导 PA 的结构性必要条件）' : i === trace.chain.length - 2 ? '精化（在当前架构中具体落地）' : '具体化（在粒子体系中实例化）'}</div>`;
    }
  });
  html += `</div>`;

  // 具体要求 box
  if (trace.reqDesc) {
    html += `
      <div class="v7-req-box">
        <div class="v7-req-label">📌 具体要求 ${trace.req}</div>
        <div class="v7-req-desc">${trace.reqDesc}</div>
      </div>
    `;
  }

  // 违反分析
  if (trace.violation) {
    html += `
      <div class="v7-violation-box">
        <div class="v7-violation-label">⚠ 违反后果（连锁失效分析）</div>
        <div class="v7-violation-text">${trace.violation.replace(/\n/g, '<br>')}</div>
      </div>
    `;
  }

  html += `</div>`;
  container.innerHTML = html;
}
