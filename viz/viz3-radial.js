/**
 * 方案三：径向同心圆
 * T 内圈、PA 中圈、G 外圈，极坐标排布
 */
function initViz3() {
  const svg = document.getElementById('viz3-svg');
  if (!svg || svg.dataset.inited === '1') return;
  const container = svg.parentElement;
  const w = container.clientWidth || 800;
  const h = container.clientHeight || 600;
  const cx = w / 2, cy = h / 2;
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  svg.innerHTML = '';

  const T = TPAG_DATA.nodes.T;
  const PA = TPAG_DATA.nodes.PA;
  const G = TPAG_DATA.nodes.G;
  const R = Math.min(w, h) / 2 - 40;
  const r0 = R * 0.25;
  const r1 = R * 0.55;
  const r2 = R * 0.88;
  const nodeR = 18;

  function polarLayout(items, radius) {
    const n = items.length;
    const step = (2 * Math.PI) / n;
    return items.map((item, i) => {
      const a = -Math.PI / 2 + i * step;
      return {
        ...item,
        x: cx + radius * Math.cos(a),
        y: cy + radius * Math.sin(a),
        r: nodeR
      };
    });
  }
  const tPos = polarLayout(T, r0);
  const paPos = polarLayout(PA, r1);
  const gPos = polarLayout(G, r2);
  const posById = {};
  tPos.forEach(p => { posById[p.id] = { ...p, layer: 'T' }; });
  paPos.forEach(p => { posById[p.id] = { ...p, layer: 'PA' }; });
  gPos.forEach(p => { posById[p.id] = { ...p, layer: 'G' }; });

  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  TPAG_DATA.edgesT2PA.forEach(e => {
    const from = posById[e.from], to = posById[e.to];
    if (!from || !to) return;
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`);
    path.setAttribute('class', 'link link-t2pa');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-width', 1);
    g.appendChild(path);
  });
  TPAG_DATA.edgesPA2G.forEach(e => {
    const from = posById[e.from], to = posById[e.to];
    if (!from || !to) return;
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`);
    path.setAttribute('class', 'link link-pa2g');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-width', 1);
    g.appendChild(path);
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
