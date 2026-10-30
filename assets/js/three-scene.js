/* ==========================================================================
   Omkar-Ai — hero neural field
   Lightweight Three.js scene. Degrades to the CSS gradient if the CDN is
   unavailable, if WebGL is unsupported, or if the visitor prefers reduced
   motion.
   ========================================================================== */

(function () {
  "use strict";

  var canvas = document.getElementById("hero-canvas");
  if (!canvas || !window.THREE) return;

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isSmall = window.matchMedia("(max-width: 760px)").matches;

  var scene, camera, renderer, field, lines, poly, group;
  var pointer = { x: 0, y: 0 };
  var target = { x: 0, y: 0 };
  var running = true;
  var visible = true;

  function canUseWebGL() {
    try {
      var test = document.createElement("canvas");
      return !!(window.WebGLRenderingContext && (test.getContext("webgl") || test.getContext("experimental-webgl")));
    } catch (error) {
      return false;
    }
  }

  if (!canUseWebGL()) {
    canvas.hidden = true;
    return;
  }

  function init() {
    var width = canvas.clientWidth || window.innerWidth;
    var height = canvas.clientHeight || window.innerHeight;

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x04070d, 0.018);

    camera = new THREE.PerspectiveCamera(58, width / height, 0.1, 140);
    camera.position.set(0, 0, 34);

    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: "low-power"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(width, height, false);
    renderer.setClearColor(0x000000, 0);

    group = new THREE.Group();
    scene.add(group);

    var nodeCount = isSmall ? 90 : 210;
    var rangeX = isSmall ? 34 : 52;
    var rangeY = isSmall ? 24 : 35;
    var rangeZ = 18;

    var positions = new Float32Array(nodeCount * 3);
    var colors = new Float32Array(nodeCount * 3);
    var points = [];

    var palette = [
      new THREE.Color(0x5ce1ff),
      new THREE.Color(0x4f8cff),
      new THREE.Color(0xa78bfa),
      new THREE.Color(0x9beeff)
    ];

    for (var i = 0; i < nodeCount; i++) {
      var x = (Math.random() - 0.5) * rangeX;
      var y = (Math.random() - 0.5) * rangeY;
      var z = (Math.random() - 0.5) * rangeZ;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      points.push({ x: x, y: y, z: z });

      var color = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    var pointGeometry = new THREE.BufferGeometry();
    pointGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pointGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    var pointMaterial = new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 0.78,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    field = new THREE.Points(pointGeometry, pointMaterial);
    group.add(field);

    // Connect nearby nodes, but cap the total so this stays cheap on laptops.
    var linePositions = [];
    var maxDistance = isSmall ? 6.2 : 5.4;
    var maxLines = isSmall ? 90 : 260;
    var lineCount = 0;

    for (var a = 0; a < points.length && lineCount < maxLines; a++) {
      for (var b = a + 1; b < points.length && lineCount < maxLines; b++) {
        var dx = points[a].x - points[b].x;
        var dy = points[a].y - points[b].y;
        var dz = points[a].z - points[b].z;
        var distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (distance < maxDistance && Math.random() > 0.55) {
          linePositions.push(
            points[a].x, points[a].y, points[a].z,
            points[b].x, points[b].y, points[b].z
          );
          lineCount++;
        }
      }
    }

    if (linePositions.length) {
      var lineGeometry = new THREE.BufferGeometry();
      lineGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(linePositions, 3)
      );
      var lineMaterial = new THREE.LineBasicMaterial({
        color: 0x3ba8d8,
        transparent: true,
        opacity: 0.16,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      lines = new THREE.LineSegments(lineGeometry, lineMaterial);
      group.add(lines);
    }

    // A quiet wireframe monolith behind the HUD.
    var polyGeometry = new THREE.IcosahedronGeometry(isSmall ? 7.5 : 10.5, 1);
    var polyMaterial = new THREE.MeshBasicMaterial({
      color: 0x3d9ed8,
      wireframe: true,
      transparent: true,
      opacity: 0.09,
      depthWrite: false
    });
    poly = new THREE.Mesh(polyGeometry, polyMaterial);
    poly.position.set(isSmall ? 0 : 15, 1, -9);
    poly.rotation.set(0.2, 0.4, 0.1);
    scene.add(poly);

    group.rotation.x = -0.07;
    group.rotation.y = -0.12;

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    observeHero();

    if (prefersReduced) {
      renderer.render(scene, camera);
    } else {
      requestAnimationFrame(tick);
    }
  }

  function onPointerMove(event) {
    if (prefersReduced) return;
    target.x = (event.clientX / window.innerWidth - 0.5) * 2;
    target.y = (event.clientY / window.innerHeight - 0.5) * 2;
  }

  function onResize() {
    if (!renderer || !camera) return;
    var width = canvas.clientWidth || window.innerWidth;
    var height = canvas.clientHeight || window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    if (prefersReduced) renderer.render(scene, camera);
  }

  function onVisibility() {
    running = !document.hidden;
    if (running && !prefersReduced) requestAnimationFrame(tick);
  }

  function observeHero() {
    if (!("IntersectionObserver" in window)) return;
    var observer = new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
    }, { rootMargin: "120px" });
    observer.observe(canvas);
  }

  var clock = new THREE.Clock();

  function tick() {
    if (!running) return;
    if (!visible) {
      requestAnimationFrame(tick);
      return;
    }

    var elapsed = clock.getElapsedTime();

    pointer.x += (target.x - pointer.x) * 0.035;
    pointer.y += (target.y - pointer.y) * 0.035;

    group.rotation.y = -0.12 + pointer.x * 0.16 + Math.sin(elapsed * 0.045) * 0.04;
    group.rotation.x = -0.07 + pointer.y * 0.08;
    group.position.y = Math.sin(elapsed * 0.18) * 0.35;
    group.position.x = pointer.x * 0.6;

    if (lines) lines.material.opacity = 0.1 + Math.sin(elapsed * 0.5) * 0.035;

    if (poly) {
      poly.rotation.y += 0.0009;
      poly.rotation.x += 0.0004;
      poly.position.y = 1 + Math.sin(elapsed * 0.28) * 0.7;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }

  init();
})();
