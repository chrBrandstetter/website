(function () {
  "use strict";

  var container = document.getElementById("trisuit3d");
  if (!container) return;
  if (typeof THREE === "undefined") return;

  var zones = window.TRISUIT_ZONES || [];

  var scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0f172a);

  var camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 1.2, 7.5);

  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  /* Licht */
  scene.add(new THREE.AmbientLight(0xffffff, 0.75));
  var key = new THREE.DirectionalLight(0xffffff, 0.9);
  key.position.set(3, 5, 4);
  scene.add(key);
  var fill = new THREE.DirectionalLight(0x38bdf8, 0.3);
  fill.position.set(-4, 2, -3);
  scene.add(fill);

  var suit = new THREE.Group();
  scene.add(suit);

  var bodyMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });
  var zoneMats = {};

  function addZone(target, zone, w, h, position, rotation) {
    var mat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.4 });
    zoneMats[zone.id] = mat;

    var geo = new THREE.PlaneGeometry(w, h);
    var plane = new THREE.Mesh(geo, mat);
    plane.position.set(position[0], position[1], position[2]);
    if (rotation) plane.rotation.set(rotation[0], rotation[1], rotation[2]);

    plane.userData.zoneId = zone.id;
    plane.userData.baseColor = 0xf97316;
    target.add(plane);
    return plane;
  }

  /* ---------- Torso (leicht konisch) ---------- */
  var torsoShape = new THREE.Shape();
  torsoShape.moveTo(-0.55, 0);
  torsoShape.lineTo(0.55, 0);
  torsoShape.lineTo(0.42, 1.35);
  torsoShape.lineTo(-0.42, 1.35);
  torsoShape.closePath();
  var torso = new THREE.Mesh(
    new THREE.ExtrudeGeometry(torsoShape, { depth: 0.32, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 2 }),
    bodyMat
  );
  torso.position.set(0, 0.55, -0.16);
  suit.add(torso);

  /* ---------- Hals ---------- */
  var neck = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.18, 16), bodyMat);
  neck.position.set(0, 2.0, 0);
  suit.add(neck);

  /* ---------- Kopf (rein visuell) ---------- */
  var head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 24, 24), new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.8 }));
  head.position.set(0, 2.2, 0);
  suit.add(head);

  /* ---------- Arme (Ärmel- und Schulter-Zonen) ---------- */
  function addArm(sideSign) {
    var shoulderPivot = new THREE.Group();
    shoulderPivot.position.set(0.5 * sideSign, 1.78, 0);
    suit.add(shoulderPivot);

    var upper = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.55, 12), bodyMat);
    upper.position.y = -0.27;
    shoulderPivot.add(upper);

    var forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.5, 12), bodyMat);
    forearm.position.set(0, -0.75, 0.08);
    forearm.rotation.x = -0.5;
    shoulderPivot.add(forearm);

    return shoulderPivot;
  }
  addArm(-1);
  addArm(1);

  /* ---------- Beine (Schenkel- und Hüft-Zonen) ---------- */
  function addLeg(sideSign) {
    var hipPivot = new THREE.Group();
    hipPivot.position.set(0.22 * sideSign, 0.55, 0);
    suit.add(hipPivot);

    var thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.09, 0.7, 14), bodyMat);
    thigh.position.y = -0.35;
    hipPivot.add(thigh);

    var shin = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.055, 0.65, 12), bodyMat);
    shin.position.set(0, -0.95, 0.05);
    shin.rotation.x = 0.15;
    hipPivot.add(shin);

    return hipPivot;
  }
  addLeg(-1);
  addLeg(1);

  /* ---------- Logo-Zonen platzieren ---------- */
  function zoneById(id) {
    for (var i = 0; i < zones.length; i++) if (zones[i].id === id) return zones[i];
    return null;
  }

  /* Brust vorn */
  var z;
  z = zoneById("brust"); if (z) addZone(suit, z, 0.5, 0.22, [0, 1.45, 0.19]);
  /* Rücken */
  z = zoneById("ruecken"); if (z) addZone(suit, z, 0.55, 0.25, [0, 1.45, -0.19], [0, Math.PI, 0]);
  /* Schultern */
  z = zoneById("schulter-l"); if (z) addZone(suit, z, 0.16, 0.16, [-0.52, 1.78, 0.02], [0, 0, -0.25]);
  z = zoneById("schulter-r"); if (z) addZone(suit, z, 0.16, 0.16, [0.52, 1.78, 0.02], [0, 0, -0.25]);
  /* Ärmel */
  z = zoneById("aermel-l"); if (z) addZone(suit, z, 0.12, 0.2, [-0.5, 1.55, 0], [0, 0, Math.PI / 2]);
  z = zoneById("aermel-r"); if (z) addZone(suit, z, 0.12, 0.2, [0.5, 1.55, 0], [0, 0, Math.PI / 2]);
  /* Oberschenkel */
  z = zoneById("schenkel-l"); if (z) addZone(suit, z, 0.16, 0.3, [-0.22, 0.25, 0.09]);
  z = zoneById("schenkel-r"); if (z) addZone(suit, z, 0.16, 0.3, [0.22, 0.25, 0.09]);
  /* Hüfte */
  z = zoneById("huefte-l"); if (z) addZone(suit, z, 0.15, 0.1, [-0.42, 0.55, 0.05], [0, Math.PI / 2, 0]);
  z = zoneById("huefte-r"); if (z) addZone(suit, z, 0.15, 0.1, [0.42, 0.55, 0.05], [0, Math.PI / 2, 0]);

  /* ---------- Interaktion ---------- */
  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector2();
  var hovered = null;

  function pick(event) {
    var rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    var targets = [];
    suit.traverse(function (obj) {
      if (obj.isMesh && obj.userData.zoneId) targets.push(obj);
    });

    var hits = raycaster.intersectObjects(targets, false);
    return hits.length ? hits[0].object : null;
  }

  function setHover(mesh) {
    if (hovered === mesh) return;
    if (hovered) hovered.material.color.setHex(hovered.userData.baseColor);
    hovered = mesh;
    if (hovered) hovered.material.color.setHex(0xfacc15);
    container.style.cursor = hovered ? "pointer" : "grab";
  }

  container.addEventListener("mousemove", function (event) {
    if (dragging) return;
    setHover(pick(event));
  });

  container.addEventListener("click", function (event) {
    var mesh = pick(event);
    if (mesh && window.openZoneModal) {
      window.openZoneModal(mesh.userData.zoneId);
    }
  });

  /* ---------- Rotation: Drag + Auto ---------- */
  var dragging = false;
  var dragMoved = false;
  var lastX = 0;
  var targetRotY = 0.6;
  var autoRotate = true;

  container.addEventListener("pointerdown", function (event) {
    dragging = true;
    dragMoved = false;
    lastX = event.clientX;
    container.setPointerCapture(event.pointerId);
  });

  container.addEventListener("pointermove", function (event) {
    if (!dragging) return;
    var dx = event.clientX - lastX;
    if (Math.abs(dx) > 2) {
      dragMoved = true;
      autoRotate = false;
      targetRotY += dx * 0.01;
    }
    lastX = event.clientX;
  });

  container.addEventListener("pointerup", function (event) {
    dragging = false;
    if (!dragMoved) {
      var mesh = pick(event);
      if (mesh && window.openZoneModal) {
        window.openZoneModal(mesh.userData.zoneId);
      }
    }
  });

  /* ---------- Resize ---------- */
  function resize() {
    var w = container.clientWidth;
    var h = container.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);

  /* ---------- Render-Loop ---------- */
  var clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    var t = clock.getElapsedTime();

    if (autoRotate) targetRotY += 0.0035;
    suit.rotation.y = targetRotY;

    var pulse = 0.85 + Math.sin(t * 2.2) * 0.15;
    Object.keys(zoneMats).forEach(function (id) {
      zoneMats[id].emissive.setHex(0xf97316);
      zoneMats[id].emissiveIntensity = 0.35 * pulse;
    });

    renderer.render(scene, camera);
  }

  resize();
  animate();
})();
