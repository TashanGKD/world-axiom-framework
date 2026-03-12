/**
 * 方案四：可折叠树
 * 根为「体系」，一级 T，二级为 T 连接的 PA，三级为 PA 连接的 G；点击展开/收起，点击节点文字弹出说明
 */
function initViz4() {
  const container = document.getElementById('tree-container');
  if (!container || container.dataset.inited === '1') return;
  container.innerHTML = '';
  container.dataset.inited = '1';

  const T = TPAG_DATA.nodes.T;
  const PA = TPAG_DATA.nodes.PA;
  const G = TPAG_DATA.nodes.G;
  const idToNode = {};
  T.forEach(n => { idToNode[n.id] = { ...n, layer: 'T' }; });
  PA.forEach(n => { idToNode[n.id] = { ...n, layer: 'PA' }; });
  G.forEach(n => { idToNode[n.id] = { ...n, layer: 'G' }; });

  const t2pa = {};
  TPAG_DATA.edgesT2PA.forEach(e => {
    if (!t2pa[e.from]) t2pa[e.from] = [];
    t2pa[e.from].push(e.to);
  });
  const pa2g = {};
  TPAG_DATA.edgesPA2G.forEach(e => {
    if (!pa2g[e.from]) pa2g[e.from] = [];
    pa2g[e.from].push(e.to);
  });

  function addRow(level, id, label, layer, childrenIds) {
    const row = document.createElement('div');
    row.style.marginLeft = (level * 20) + 'px';
    row.style.marginTop = '4px';
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.gap = '8px';

    const hasKids = childrenIds && childrenIds.length > 0;
    const toggle = document.createElement('span');
    toggle.textContent = hasKids ? '▶' : '·';
    toggle.style.cursor = hasKids ? 'pointer' : 'default';
    toggle.style.width = '16px';
    toggle.style.userSelect = 'none';

    const labelSpan = document.createElement('span');
    labelSpan.textContent = label;
    labelSpan.style.cursor = 'pointer';
    labelSpan.style.padding = '4px 8px';
    labelSpan.style.borderRadius = '4px';
    if (layer === 'T') labelSpan.style.background = 'rgba(107,155,209,0.25)';
    else if (layer === 'PA') labelSpan.style.background = 'rgba(155,123,184,0.25)';
    else labelSpan.style.background = 'rgba(123,166,123,0.25)';
    labelSpan.onclick = () => showNodeDetail(idToNode[id]);

    row.appendChild(toggle);

    const childContainer = document.createElement('div');
    childContainer.style.flex = '1';
    row.appendChild(childContainer);
    const labelWrap = document.createElement('span');
    labelWrap.appendChild(labelSpan);
    childContainer.appendChild(labelWrap);

    const kidsDiv = document.createElement('div');
    kidsDiv.style.display = 'none';

    if (hasKids) {
      toggle.onclick = () => {
        const isExpanded = kidsDiv.style.display === 'block';
        kidsDiv.style.display = isExpanded ? 'none' : 'block';
        toggle.textContent = isExpanded ? '▶' : '▼';
      };
      childrenIds.forEach(cid => {
        const node = idToNode[cid];
        if (!node) return;
        const subIds = (layer === 'T' ? (pa2g[cid] || []) : []);
        const sub = addRow(level + 1, cid, node.label, node.layer, subIds);
        kidsDiv.appendChild(sub);
      });
    }
    childContainer.appendChild(kidsDiv);
    return row;
  }

  T.forEach(t => {
    const paIds = t2pa[t.id] || [];
    const row = addRow(0, t.id, t.label, 'T', paIds);
    container.appendChild(row);
  });
}
