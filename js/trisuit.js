(function () {
  "use strict";

  var container = document.getElementById("trisuit3d");
  if (!container) return;
  if (typeof THREE === "undefined") return;

  var zones = window.TRISUIT_ZONES || [];

  var scene = new THREE.Scene();

  var camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 1.35, 4.7);
  camera.lookAt(0, 1.2, 0);

  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  /* ---------- Licht ---------- */
  scene.add(new THREE.HemisphereLight(0xffffff, 0x334155, 0.9));
  var key = new THREE.DirectionalLight(0xffffff, 1.1);
  key.position.set(3, 5, 4);
  scene.add(key);
  var fill = new THREE.DirectionalLight(0x93c5fd, 0.5);
  fill.position.set(-4, 2, 2);
  scene.add(fill);
  var rim = new THREE.DirectionalLight(0x38bdf8, 0.6);
  rim.position.set(0, 3, -6);
  scene.add(rim);

  var suit = new THREE.Group();
  scene.add(suit);

  var fabric = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.55, metalness: 0.05 });
  var fabricDark = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6, metalness: 0.05 });
  var accent = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.5 });

  var pickables = [];
  var zoneMats = {};

  function markPickable(mesh, zone) {
    var mat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      roughness: 0.35,
      emissive: 0xf97316,
      emissiveIntensity: 0.4,
      polygonOffset: true,
      polygonOffsetFactor: -2
    });
    mesh.material = mat;
    mesh.userData.zoneId = zone.id;
    mesh.userData.baseColor = 0xf97316;
    zoneMats[zone.id] = mat;
    pickables.push(mesh);
    return mesh;
  }

  function zoneById(id) {
    for (var i = 0; i < zones.length; i++) if (zones[i].id === id) return zones[i];
    return null;
  }

  function zonePlane(zone, w, h, pos, rot) {
    var z = zoneById(zone);
    if (!z) return null;
    var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h));
    m.position.set(pos[0], pos[1], pos[2]);
    if (rot) m.rotation.set(rot[0], rot[1], rot[2], rot[3] || "YXZ");
    markPickable(m, z);
    return m;
  }

  /* ---------- Boden-Schatten ---------- */
  var shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.85, 40),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35 })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.005;
  suit.add(shadow);

  /* ---------- Beine ---------- */
  function addLeg(sideSign) {
    var hip = new THREE.Group();
    hip.position.set(0.18 * sideSign, 0.95, 0);
    suit.add(hip);

    var thigh = new THREE.Mesh(new THREE.CapsuleGeometry(0.115, 0.34, 8, 20), fabric);
    thigh.position.y = -0.29;
    hip.add(thigh);

    var knee = new THREE.Group();
    knee.position.y = -0.58;
    hip.add(knee);

    var shin = new THREE.Mesh(new THREE.CapsuleGeometry(0.085, 0.32, 8, 20), fabric);
    shin.position.set(0, -0.19, 0.02);
    shin.rotation.x = 0.12;
    knee.add(shin);

    return hip;
  }
  var legL = addLeg(-1);
  var legR = addLeg(1);

  /* Schenkel-Zonen (vorne, am Oberschenkel) */
  var tmp;
  tmp = zonePlane("schenkel-l", 0.14, 0.22, [0, -0.3, 0.118]);
  if (tmp) legL.add(tmp);
  tmp = zonePlane("schenkel-r", 0.14, 0.22, [0, -0.3, 0.118]);
  if (tmp) legR.add(tmp);

  /* ---------- Becken ---------- */
  var pelvis = new THREE.Mesh(new THREE.SphereGeometry(0.27, 28, 20), fabric);
  pelvis.scale.set(1, 0.75, 0.9);
  pelvis.position.y = 0.98;
  suit.add(pelvis);

  /* Hüft-Zonen (seitlich) */
  tmp = zonePlane("huefte-l", 0.13, 0.1, [-0.268, 0.98, 0], [0, -Math.PI / 2, 0]);
  if (tmp) suit.add(tmp);
  tmp = zonePlane("huefte-r", 0.13, 0.1, [0.268, 0.98, 0], [0, Math.PI / 2, 0]);
  if (tmp) suit.add(tmp);

  /* ---------- Torso (Lathe-Profil: Taille → Brust → Schultern) ---------- */
  var profile = [
    new THREE.Vector2(0.27, 1.02),
    new THREE.Vector2(0.255, 1.15),
    new THREE.Vector2(0.28, 1.32),
    new THREE.Vector2(0.325, 1.5),
    new THREE.Vector2(0.345, 1.62),
    new THREE.Vector2(0.335, 1.72),
    new THREE.Vector2(0.29, 1.8),
    new THREE.Vector2(0.19, 1.86),
    new THREE.Vector2(0.12, 1.87)
  ];
  var torso = new THREE.Mesh(new THREE.LatheGeometry(profile, 36), fabric);
  suit.add(torso);

  /* Brust- und Rücken-Zonen */
  tmp = zonePlane("brust", 0.34, 0.18, [0, 1.52, 0.34]);
  if (tmp) suit.add(tmp);
  tmp = zonePlane("ruecken", 0.36, 0.22, [0, 1.45, -0.325], [0, Math.PI, 0]);
  if (tmp) suit.add(tmp);

  /* Reißverschluss-Detail */
  var zipper = new THREE.Mesh(new THREE.PlaneGeometry(0.016, 0.55), accent);
  zipper.position.set(0, 1.52, 0.351);
  suit.add(zipper);

  /* ---------- Schultern + Arme ---------- */
  function addArm(sideSign) {
    var shoulderBall = new THREE.Mesh(new THREE.SphereGeometry(0.115, 22, 18), fabric);
    shoulderBall.position.set(0.35 * sideSign, 1.76, 0);
    suit.add(shoulderBall);

    var pivot = new THREE.Group();
    pivot.position.set(0.38 * sideSign, 1.76, 0);
    pivot.rotation.z = 0.16 * sideSign * -1;
    suit.add(pivot);

    var upper = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.3, 8, 16), fabric);
    upper.position.y = -0.2;
    pivot.add(upper);

    var elbow = new THREE.Group();
    elbow.position.y = -0.42;
    pivot.add(elbow);

    var fore = new THREE.Mesh(new THREE.CapsuleGeometry(0.048, 0.26, 8, 16), fabricDark);
    fore.position.set(0, -0.16, 0.03);
    fore.rotation.x = -0.4;
    elbow.add(fore);

    var hand = new THREE.Mesh(new THREE.SphereGeometry(0.055, 14, 12), fabricDark);
    hand.position.set(0, -0.3, 0.14);
    elbow.add(hand);

    return pivot;
  }
  var armL = addArm(-1);
  var armR = addArm(1);

  /* Schulter-Zonen (oben vorne auf der Schulter) */
  tmp = zonePlane("schulter-l", 0.13, 0.13, [-0.35, 1.85, 0.05], [-1.0, 0, 0]);
  if (tmp) suit.add(tmp);
  tmp = zonePlane("schulter-r", 0.13, 0.13, [0.35, 1.85, 0.05], [-1.0, 0, 0]);
  if (tmp) suit.add(tmp);

  /* Ärmel-Zonen (vorne am Oberarm, im Arm-Pivot damit sie mitschwingen) */
  tmp = zonePlane("aermel-l", 0.1, 0.16, [0, -0.2, 0.062]);
  if (tmp) armL.add(tmp);
  tmp = zonePlane("aermel-r", 0.1, 0.16, [0, -0.2, 0.062]);
  if (tmp) armR.add(tmp);

  /* ---------- Hals + Kopf ---------- */
  var neck = new THREE.Mesh(new THREE.CapsuleGeometry(0.062, 0.1, 6, 14), fabricDark);
  neck.position.y = 1.92;
  suit.add(neck);

  var head = new THREE.Mesh(new THREE.SphereGeometry(0.125, 24, 20), fabricDark);
  head.position.y = 2.08;
  suit.add(head);

  /* ---------- Interaktion ---------- */
  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector2();
  var hovered = null;

  function pick(event) {
    var rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    var hits = raycaster.intersectObjects(pickables, false);
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

  /* ---------- Drag-Rotation (horizontal + leicht vertikal) ---------- */
  var dragging = false;
  var dragMoved = false;
  var lastX = 0;
  var lastY = 0;
  var rotY = 0.55;
  var rotX = 0;
  var autoRotate = true;

  container.addEventListener("pointerdown", function (event) {
    dragging = true;
    dragMoved = false;
    lastX = event.clientX;
    lastY = event.clientY;
    container.setPointerCapture(event.pointerId);
  });

  container.addEventListener("pointermove", function (event) {
    if (!dragging) return;
    var dx = event.clientX - lastX;
    var dy = event.clientY - lastY;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
      dragMoved = true;
      autoRotate = false;
      rotY += dx * 0.008;
      rotX = Math.max(-0.35, Math.min(0.35, rotX + dy * 0.004));
    }
    lastX = event.clientX;
    lastY = event.clientY;
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

    if (autoRotate) rotY += 0.0032;
    suit.rotation.y = rotY;
    suit.rotation.x = rotX;

    var pulse = 0.5 + Math.sin(t * 2.4) * 0.2;
    Object.keys(zoneMats).forEach(function (id) {
      zoneMats[id].emissiveIntensity = pulse;
    });

    renderer.render(scene, camera);
  }

  resize();
  animate();
})();
