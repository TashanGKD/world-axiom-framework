/**
 * 方案二：神经网络式三层矩阵
 * 三层水平排列，节点为圆，连线为直线
 */
function initViz2() {
  const svg = document.getElementById('viz2-svg');
  if (!svg || svg.dataset.inited === '1') return;
  const container = svg.parentElement;
  const w = container.clientWidth || 800;
  const h = container.clientHeight || 600;
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  svg.innerHTML = '';

  const T = TPAG_DATA.nodes.T;
  const PA = TPAG_DATA.nodes.PA;
  const G = TPAG_DATA.nodes.G;
  const layerY = [h * 0.2, h * 0.5, h * 0.8];
  const r = 22;

  function placeNodes(items, y) {
    const n = items.length;
    const totalW = Math.min(w * 0.7, n * (r * 2 + 12));
    const x0 = (w - totalW) / 2 + totalW / n / 2;
    return items.map((item, i) => ({
      ...item,
      x: x0 + i * (totalW / n),
      y: y,
      r: r
    }));
  }
  const tPos = placeNodes(T, layerY[0]);
  const paPos = placeNodes(PA, layerY[1]);
  const gPos = placeNodes(G, layerY[2]);
  const posById = {};
  tPos.forEach(p => { posById[p.id] = { ...p, layer: 'T' }; });
  paPos.forEach(p => { posById[p.id] = { ...p, layer: 'PA' }; });
  gPos.forEach(p => { posById[p.id] = { ...p, layer: 'G' }; });

  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  TPAG_DATA.edgesT2PA.forEach(e => {
    const from = posById[e.from], to = posById[e.to];
    if (!from || !to) return;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', from.x); line.setAttribute('y1', from.y);
    line.setAttribute('x2', to.x); line.setAttribute('y2', to.y);
    line.setAttribute('class', 'link link-t2pa');
    line.setAttribute('stroke-width', 1);
    g.appendChild(line);
  });
  TPAG_DATA.edgesPA2G.forEach(e => {
    const from = posById[e.from], to = posById[e.to];
    if (!from || !to) return;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', from.x); line.setAttribute('y1', from.y);
    line.setAttribute('x2', to.x); line.setAttribute('y2', to.y);
    line.setAttribute('class', 'link link-pa2g');
    line.setAttribute('stroke-width', 1);
    g.appendChild(line);
  });
  svg.appendChild(g);

  function addCircles(arr, layer, cssClass) {
    const gr = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    arr.forEach(p => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', p.x); circle.setAttribute('cy', p.y); circle.setAttribute('r', p.r);
      circle.setAttribute('class', 'node ' + cssClass);
      circle.dataset.id = p.id;
      circle.dataset.layer = layer;
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', p.x); text.setAttribute('y', p.y);
      text.textContent = p.id;
      text.setAttribute('class', 'node-label');
      gr.appendChild(circle);
      gr.appendChild(text);
    });
    svg.appendChild(gr);
  }
  addCircles(tPos, 'T', 'node-t');
  addCircles(paPos, 'PA', 'node-pa');
  addCircles(gPos, 'G', 'node-g');

  svg.addEventListener('click', (e) => {
    const t = e.target;
    if (t.classList && t.classList.contains('node')) {
      const node = findNode(t.dataset.id);
      if (node) showNodeDetail(node);
    }
  });
  svg.dataset.inited = '1';
}
