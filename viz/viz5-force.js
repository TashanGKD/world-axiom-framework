/**
 * 方案五：力导向图
 * 节点可拖拽，T/PA/G 用颜色区分，边拉近、节点互斥
 */
function initViz5() {
  const svg = document.getElementById('viz5-svg');
  if (!svg || svg.dataset.inited === '1') return;
  const container = svg.parentElement;
  const w = container.clientWidth || 800;
  const h = container.clientHeight || 600;
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  svg.innerHTML = '';

  const T = TPAG_DATA.nodes.T;
  const PA = TPAG_DATA.nodes.PA;
  const G = TPAG_DATA.nodes.G;
  const nodes = [];
  const nodeMap = {};
  const layerX = { T: w * 0.15, PA: w * 0.5, G: w * 0.85 };
  T.forEach((n, i) => {
    const o = { id: n.id, label: n.label, layer: 'T', x: layerX.T + (i - 2) * 30, y: h / 2 + (i - 2) * 35, vx: 0, vy: 0 };
    nodes.push(o);
    nodeMap[n.id] = o;
  });
  PA.forEach((n, i) => {
    const o = { id: n.id, label: n.label, layer: 'PA', x: layerX.PA + ((i % 3) - 1) * 50, y: h / 2 + (Math.floor(i / 3) - 1) * 45, vx: 0, vy: 0 };
    nodes.push(o);
    nodeMap[n.id] = o;
  });
  G.forEach((n, i) => {
    const o = { id: n.id, label: n.label, layer: 'G', x: layerX.G + (i - 4) * 28, y: h / 2 + (i - 4) * 32, vx: 0, vy: 0 };
    nodes.push(o);
    nodeMap[n.id] = o;
  });

  const edges = [...TPAG_DATA.edgesT2PA.map(e => ({ from: e.from, to: e.to })), ...TPAG_DATA.edgesPA2G.map(e => ({ from: e.from, to: e.to }))];
  const r = 20;
  const repel = 80;
  const attract = 0.02;
  const damp = 0.85;
  let animId;
  let dragged = null;

  function step() {
    nodes.forEach(n => { n.vx *= damp; n.vy *= damp; });
    nodes.forEach((a, i) => {
      nodes.forEach((b, j) => {
        if (i >= j) return;
        const dx = b.x - a.x, dy = b.y - a.y;
        const dist = Math.hypot(dx, dy) || 0.01;
        const force = (repel * repel) / (dist * dist);
        const fx = (force / dist) * dx;
        const fy = (force / dist) * dy;
        a.vx -= fx; a.vy -= fy;
        b.vx += fx; b.vy += fy;
      });
    });
    edges.forEach(e => {
      const a = nodeMap[e.from], b = nodeMap[e.to];
      if (!a || !b) return;
      const dx = b.x - a.x, dy = b.y - a.y;
      const dist = Math.hypot(dx, dy) || 0.01;
      const force = dist * attract;
      const fx = (force / dist) * dx;
      const fy = (force / dist) * dy;
      a.vx += fx; a.vy += fy;
      b.vx -= fx; b.vy -= fy;
    });
    nodes.forEach(n => {
      if (n === dragged) return;
      n.x = Math.max(r, Math.min(w - r, n.x + n.vx));
      n.y = Math.max(r, Math.min(h - r, n.y + n.vy));
    });
    render();
    animId = requestAnimationFrame(step);
  }

  function render() {
    const gLinks = svg.querySelector('g.links') || (() => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'links');
      svg.insertBefore(g, svg.firstChild);
      return g;
    })();
    const gNodes = svg.querySelector('g.nodes') || (() => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'nodes');
      svg.appendChild(g);
      return g;
    })();

    gLinks.innerHTML = '';
    edges.forEach(e => {
      const a = nodeMap[e.from], b = nodeMap[e.to];
      if (!a || !b) return;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', a.x); line.setAttribute('y1', a.y);
      line.setAttribute('x2', b.x); line.setAttribute('y2', b.y);
      line.setAttribute('class', 'link link-t2pa');
      line.setAttribute('stroke-width', 1);
      gLinks.appendChild(line);
    });

    gNodes.innerHTML = '';
    nodes.forEach(n => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', n.x); circle.setAttribute('cy', n.y); circle.setAttribute('r', r);
      circle.setAttribute('class', 'node node-' + (n.layer === 'T' ? 't' : n.layer === 'PA' ? 'pa' : 'g'));
      circle.dataset.id = n.id;
      circle.dataset.layer = n.layer;
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', n.x); text.setAttribute('y', n.y);
      text.textContent = n.id;
      text.setAttribute('class', 'node-label');
      gNodes.appendChild(circle);
      gNodes.appendChild(text);
    });
  }

  svg.addEventListener('mousedown', (e) => {
    const t = e.target;
    if (t.tagName === 'circle' && t.classList.contains('node')) {
      dragged = nodeMap[t.dataset.id];
    }
  });
  svg.addEventListener('mousemove', (e) => {
    if (!dragged) return;
    const rect = svg.getBoundingClientRect();
    const scale = Math.min(rect.width / w, rect.height / h);
    dragged.x = (e.clientX - rect.left) / scale;
    dragged.y = (e.clientY - rect.top) / scale;
  });
  svg.addEventListener('mouseup', () => { dragged = null; });
  svg.addEventListener('mouseleave', () => { dragged = null; });
  svg.addEventListener('click', (e) => {
    if (e.target.tagName === 'circle' && e.target.classList.contains('node')) {
      const node = findNode(e.target.dataset.id);
      if (node) showNodeDetail(node);
    }
  });

  render();
  step();
  svg.dataset.inited = '1';
}
