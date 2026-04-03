function initBugCursor() {
  var existing = document.getElementById('bug-cursor-el');
  if (existing) existing.remove();

  // Hide the real cursor via stylesheet
  var styleId = 'bug-cursor-style';
  if (!document.getElementById(styleId)) {
    var style = document.createElement('style');
    style.id = styleId;
    style.textContent = '* { cursor: none !important; }';
    document.head.appendChild(style);
  }

  var cursor = document.createElement('div');
  cursor.id = 'bug-cursor-el';
  cursor.style.cssText = 'position:fixed;top:0;left:0;width:32px;height:28px;pointer-events:none;z-index:99999;will-change:transform;transform:translate(-100px,-100px);';
  document.body.appendChild(cursor);

  var frame = 0;
  var isMoving = false;
  var moveTimer = null;
  var animInterval = null;

  function getColor() {
    return document.body.classList.contains('dark-mode') ? '#ddd' : '#222';
  }

  function getEyeColor() {
    return document.body.classList.contains('dark-mode') ? '#333' : 'white';
  }

  // Two frames of leg positions for walking animation
  var legFrames = [
    { ll: [[18,22,10,18],[18,30,10,30],[18,38,10,42]],
      rl: [[46,22,54,18],[46,30,54,30],[46,38,54,42]] },
    { ll: [[18,22,8,24],[18,30,8,27],[18,38,8,38]],
      rl: [[46,22,56,24],[46,30,56,27],[46,38,56,38]] }
  ];

  function buildSvg(f) {
    var c = getColor();
    var ec = getEyeColor();
    var legs = legFrames[f];

    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('xmlns', ns);
    svg.setAttribute('width', '32');
    svg.setAttribute('height', '28');
    svg.setAttribute('viewBox', '0 0 64 56');

    var g = document.createElementNS(ns, 'g');
    g.setAttribute('fill', 'none');
    g.setAttribute('stroke', c);
    g.setAttribute('stroke-linecap', 'round');
    g.setAttribute('stroke-linejoin', 'round');

    function addLine(x1, y1, x2, y2, sw) {
      var el = document.createElementNS(ns, 'line');
      el.setAttribute('x1', x1); el.setAttribute('y1', y1);
      el.setAttribute('x2', x2); el.setAttribute('y2', y2);
      el.setAttribute('stroke-width', sw || '2.5');
      g.appendChild(el);
    }

    function addCircle(cx, cy, r, fill, stroke, sw) {
      var el = document.createElementNS(ns, 'circle');
      el.setAttribute('cx', cx); el.setAttribute('cy', cy); el.setAttribute('r', r);
      if (fill) { el.setAttribute('fill', fill); el.setAttribute('stroke', 'none'); }
      if (stroke) { el.setAttribute('stroke', stroke); el.setAttribute('stroke-width', sw || '1.8'); }
      g.appendChild(el);
    }

    function addPath(d, fill, stroke, sw) {
      var el = document.createElementNS(ns, 'path');
      el.setAttribute('d', d);
      if (fill) el.setAttribute('fill', fill);
      if (stroke) el.setAttribute('stroke', stroke);
      el.setAttribute('stroke-width', sw || '2.5');
      g.appendChild(el);
    }

    // Antennae
    addLine(24, 10, 19, 2);
    addLine(40, 10, 45, 2);

    // Head
    addPath('M22 14 Q22 8 32 8 Q42 8 42 14 Z', c, c, '0');

    // Eyes
    addCircle(27, 12, 3, null, ec, '1.5');
    addCircle(27, 12, 1, ec);
    addCircle(37, 12, 3, null, ec, '1.5');
    addCircle(37, 12, 1, ec);

    // Body
    addPath('M18 16 Q18 14 22 14 L42 14 Q46 14 46 16 L46 38 Q46 48 32 48 Q18 48 18 38 Z');

    // Legs
    legs.ll.forEach(function(l) { addLine(l[0], l[1], l[2], l[3]); });
    legs.rl.forEach(function(l) { addLine(l[0], l[1], l[2], l[3]); });

    // Circuit traces
    addCircle(26, 26, 3, null, c, '1.8');
    addCircle(26, 26, 1, c);
    addLine(26, 29, 26, 36, '1.8');
    addCircle(26, 38, 2.5, null, c, '1.8');
    addCircle(26, 38, 0.8, c);
    addCircle(38, 22, 3, null, c, '1.8');
    addCircle(38, 22, 1, c);
    addPath('M38 25 L38 30 Q38 34 34 36', null, c, '1.8');
    addCircle(38, 34, 2.5, null, c, '1.8');
    addCircle(38, 34, 0.8, c);
    addLine(38, 36.5, 38, 43, '1.8');
    addLine(29, 26, 35, 22, '1.8');

    svg.appendChild(g);
    return svg;
  }

  function render() {
    while (cursor.firstChild) cursor.removeChild(cursor.firstChild);
    cursor.appendChild(buildSvg(frame));
  }

  render();

  document.addEventListener('mousemove', function(e) {
    cursor.style.transform = 'translate(' + (e.clientX - 16) + 'px,' + (e.clientY - 14) + 'px)';

    if (!isMoving) {
      isMoving = true;
      animInterval = setInterval(function() {
        frame = frame === 0 ? 1 : 0;
        render();
      }, 120);
    }

    clearTimeout(moveTimer);
    moveTimer = setTimeout(function() {
      isMoving = false;
      clearInterval(animInterval);
      frame = 0;
      render();
    }, 150);
  });

  document.addEventListener('mouseleave', function() {
    cursor.style.transform = 'translate(-100px, -100px)';
    isMoving = false;
    clearInterval(animInterval);
    frame = 0;
  });

  document.addEventListener('mouseenter', function(e) {
    cursor.style.transform = 'translate(' + (e.clientX - 16) + 'px,' + (e.clientY - 14) + 'px)';
  });
}

initBugCursor();
document.addEventListener('astro:after-swap', initBugCursor);
