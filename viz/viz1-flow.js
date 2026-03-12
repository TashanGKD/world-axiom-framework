/**
 * 方案一：三列流式图（Sankey 风格）
 * 展示：三层分别是什么、层间逻辑、每层节点、层内逻辑（含图内列标题与图下说明）
 */
function initViz1() {
  const svg = document.getElementById('viz1-svg');
  if (!svg) return;

  const legendEl = document.getElementById('viz1-legend');
  const intraEl = document.getElementById('viz1-intra');
  if (legendEl && TPAG_DATA.layers) {
    const T = TPAG_DATA.layers.T, PA = TPAG_DATA.layers.PA, G = TPAG_DATA.layers.G;
    legendEl.innerHTML =
      '<div class="layer-row"><span class="layer-name T">' + T.name + '（' + T.fullName + '）</span> ' + T.desc + '</div>' +
      '<div class="layer-row"><span class="layer-name PA">' + PA.name + '（' + PA.fullName + '）</span> ' + PA.desc + '</div>' +
      '<div class="layer-row"><span class="layer-name G">' + G.name + '（' + G.fullName + '）</span> ' + G.desc + '</div>' +
      '<div class="inter-logic"><strong>层间逻辑：</strong> T → PA：' + T.interLogicToNext + ' PA → G：' + PA.interLogicToNext + ' 每条 G 要求须能追溯到 PA，每条 PA 须能追溯到 T。</div>';
  }
  if (intraEl && TPAG_DATA.layers) {
    const T = TPAG_DATA.layers.T, PA = TPAG_DATA.layers.PA, G = TPAG_DATA.layers.G;
    function ul(items) { return '<ul>' + items.map(l => '<li>' + l + '</li>').join('') + '</ul>'; }
    intraEl.innerHTML =
      '<div class="col"><h3 class="T">T 层内在逻辑</h3>' + ul(T.intraLogic) + '</div>' +
      '<div class="col"><h3 class="PA">PA 层内在逻辑</h3>' + ul(PA.intraLogic) + '</div>' +
      '<div class="col"><h3 class="G">G 层内在逻辑</h3>' + ul(G.intraLogic) + '</div>';
  }

  if (svg.dataset.inited === '1') return;
  const container = svg.parentElement;
  const w = container.clientWidth || 800;
  const h = container.clientHeight || 600;
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  svg.innerHTML = '';

  const HEADER_H = 44;
  const colX = [w * 0.12, w * 0.5, w * 0.88];
  const T = TPAG_DATA.nodes.T;
  const PA = TPAG_DATA.nodes.PA;
  const G = TPAG_DATA.nodes.G;
  const nodeH = 26;
  const nodeW = 108;
  const gap = 6;

  function layoutColumn(items, x, width) {
    const totalH = items.length * nodeH + (items.length - 1) * gap;
    let y0 = HEADER_H + (h - HEADER_H - totalH) / 2;
    const pos = [];
    items.forEach((item, i) => {
      pos.push({ ...item, x: x - width / 2, y: y0 + i * (nodeH + gap) + nodeH / 2, w: width, h: nodeH });
    });
    return pos;
  }

  const tPos = layoutColumn(T, colX[0], nodeW);
  const paPos = layoutColumn(PA, colX[1], nodeW);
  const gPos = layoutColumn(G, colX[2], nodeW);
  const posById = {};
  tPos.forEach(p => { posById[p.id] = { ...p, layer: 'T' }; });
  paPos.forEach(p => { posById[p.id] = { ...p, layer: 'PA' }; });
  gPos.forEach(p => { posById[p.id] = { ...p, layer: 'G' }; });

  // 层标题（每列顶部）
  if (TPAG_DATA.layers) {
    const ns = 'http://www.w3.org/2000/svg';
    ['T', 'PA', 'G'].forEach((layer, i) => {
      const L = TPAG_DATA.layers[layer];
      const g = document.createElementNS(ns, 'g');
      const x = colX[i];
      const t1 = document.createElementNS(ns, 'text');
      t1.setAttribute('x', x);
      t1.setAttribute('y', 18);
      t1.setAttribute('text-anchor', 'middle');
      t1.setAttribute('fill', layer === 'T' ? '#6b9bd1' : layer === 'PA' ? '#9b7bb8' : '#7ba67b');
      t1.setAttribute('font-weight', '700');
      t1.setAttribute('font-size', '13');
      t1.textContent = L.name + ' · ' + L.fullName;
      const t2 = document.createElementNS(ns, 'text');
      t2.setAttribute('x', x);
      t2.setAttribute('y', 34);
      t2.setAttribute('text-anchor', 'middle');
      t2.setAttribute('fill', '#888');
      t2.setAttribute('font-size', '10');
      t2.textContent = (L.desc || '').slice(0, 28) + (L.desc && L.desc.length > 28 ? '…' : '');
      g.appendChild(t1);
      g.appendChild(t2);
      svg.appendChild(g);
    });
    // 层间箭头与说明（T→PA、PA→G）
    const arrow = (x1, x2, y) => {
      const path = document.createElementNS(ns, 'path');
      const mx = (x1 + x2) / 2;
      path.setAttribute('d', `M ${x1} ${y} L ${mx - 6} ${y} L ${mx} ${y - 4} L ${mx + 6} ${y} L ${x2} ${y}`);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', '#888');
      path.setAttribute('stroke-width', '1');
      return path;
    };
    const yArr = 22;
    const x1 = colX[0] + nodeW / 2 + 4, x2 = colX[1] - nodeW / 2 - 4;
    svg.appendChild(arrow(x1, x2, yArr));
    const tMid1 = document.createElementNS(ns, 'text');
    tMid1.setAttribute('x', (x1 + x2) / 2);
    tMid1.setAttribute('y', yArr - 10);
    tMid1.setAttribute('text-anchor', 'middle');
    tMid1.setAttribute('fill', '#888');
    tMid1.setAttribute('font-size', '9');
    tMid1.textContent = '须满足';
    svg.appendChild(tMid1);
    const x3 = colX[1] + nodeW / 2 + 4, x4 = colX[2] - nodeW / 2 - 4;
    svg.appendChild(arrow(x3, x4, yArr));
    const tMid2 = document.createElementNS(ns, 'text');
    tMid2.setAttribute('x', (x3 + x4) / 2);
    tMid2.setAttribute('y', yArr - 10);
    tMid2.setAttribute('text-anchor', 'middle');
    tMid2.setAttribute('fill', '#888');
    tMid2.setAttribute('font-size', '9');
    tMid2.textContent = '落地为';
    svg.appendChild(tMid2);
  }

  // 边：T→PA, PA→G
  const gLinks = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  gLinks.setAttribute('class', 'links');
  TPAG_DATA.edgesT2PA.forEach(e => {
    const from = posById[e.from];
    const to = posById[e.to];
    if (!from || !to) return;
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const x1 = from.x + from.w / 2, y1 = from.y;
    const x2 = to.x - to.w / 2, y2 = to.y;
    path.setAttribute('d', `M ${x1} ${y1} C ${(x1+x2)/2} ${y1}, ${(x1+x2)/2} ${y2}, ${x2} ${y2}`);
    path.setAttribute('class', 'link link-t2pa');
    gLinks.appendChild(path);
  });
  TPAG_DATA.edgesPA2G.forEach(e => {
    const from = posById[e.from];
    const to = posById[e.to];
    if (!from || !to) return;
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const x1 = from.x + from.w / 2, y1 = from.y;
    const x2 = to.x - to.w / 2, y2 = to.y;
    path.setAttribute('d', `M ${x1} ${y1} C ${(x1+x2)/2} ${y1}, ${(x1+x2)/2} ${y2}, ${x2} ${y2}`);
    path.setAttribute('class', 'link link-pa2g');
    gLinks.appendChild(path);
  });
  svg.appendChild(gLinks);

  function addNodeGroup(arr, layer, cssClass) {
    const gr = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    arr.forEach(p => {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', p.x - p.w / 2);
      rect.setAttribute('y', p.y - p.h / 2);
      rect.setAttribute('width', p.w);
      rect.setAttribute('height', p.h);
      rect.setAttribute('rx', 4);
      rect.setAttribute('class', 'node ' + cssClass);
      rect.dataset.id = p.id;
      rect.dataset.layer = layer;
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', p.x);
      text.setAttribute('y', p.y);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dominant-baseline', 'middle');
      text.setAttribute('class', 'node-label');
      text.setAttribute('fill', '#fff');
      const label = (p.label || p.id).length > 12 ? (p.id + ' ' + (p.short || '').slice(0, 6)) : (p.label || p.id);
      text.setAttribute('font-size', label.length > 10 ? 9 : 11);
      text.textContent = label;
      gr.appendChild(rect);
      gr.appendChild(text);
    });
    svg.appendChild(gr);
  }
  addNodeGroup(tPos, 'T', 'node-t');
  addNodeGroup(paPos, 'PA', 'node-pa');
  addNodeGroup(gPos, 'G', 'node-g');

  svg.addEventListener('click', (e) => {
    const t = e.target;
    if (t.classList && t.classList.contains('node')) {
      const node = findNode(t.dataset.id);
      if (node) showNodeDetail(node);
    }
  });
  svg.dataset.inited = '1';
}
