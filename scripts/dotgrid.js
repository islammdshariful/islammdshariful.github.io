(function () {
  var canvas = document.createElement('canvas');
  canvas.id = 'dot-grid';
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;';
  document.body.prepend(canvas);

  var ctx = canvas.getContext('2d');
  var spacing = 24;
  var dotRadius = 0.8;
  var magnetRadius = 120;
  var magnetStrength = 14;
  var mouseX = -9999;
  var mouseY = -9999;
  var raf;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  document.addEventListener('mouseleave', function () {
    mouseX = -9999;
    mouseY = -9999;
  });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var cols = Math.ceil(canvas.width / spacing) + 1;
    var rows = Math.ceil(canvas.height / spacing) + 1;

    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var origX = c * spacing;
        var origY = r * spacing;

        var dx = origX - mouseX;
        var dy = origY - mouseY;
        var dist = Math.sqrt(dx * dx + dy * dy);

        var drawX = origX;
        var drawY = origY;

        if (dist < magnetRadius && dist > 0) {
          var force = (1 - dist / magnetRadius) * magnetStrength;
          drawX = origX + (dx / dist) * force;
          drawY = origY + (dy / dist) * force;
        }

        var isDark = document.body.classList.contains('dark-mode');
        var baseAlpha = isDark ? 0.2 : 0.25;
        var alpha = baseAlpha;
        if (dist < magnetRadius && dist > 0) {
          alpha = baseAlpha + 0.35 * (1 - dist / magnetRadius);
        }

        ctx.beginPath();
        ctx.arc(drawX, drawY, dotRadius, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? 'rgba(255,255,255,' + alpha + ')' : 'rgba(0,0,0,' + alpha + ')';
        ctx.fill();
      }
    }

    raf = requestAnimationFrame(draw);
  }

  draw();
})();
