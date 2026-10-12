(function () {
  "use strict";

  /* ---------- Sponsoring-Zonen (Tri-Suit) ---------- */

  var ZONE_INCLUDES = {
    brust: [
      "Großes Logo ca. 20 × 8 cm auf der Brustfront",
      "Höchste Sichtbarkeit – auf Finisher-, Podiums- und Pressefotos",
      "Placement bei allen Rennen der Saison",
      "Nennung in Social-Media-Beiträgen"
    ],
    ruecken: [
      "Logo ca. 25 × 10 cm auf der Rückenfläche",
      "Im Fokus bei Rad- und Laufpassagen (Verfolger-Perspektive)",
      "Placement bei allen Rennen der Saison",
      "Nennung in Social-Media-Beiträgen"
    ],
    schulter: [
      "Kompaktlogo ca. 6 × 6 cm auf der Oberschulter",
      "Stark sichtbar in Seitenansichten und Überhol-Szenen",
      "Placement bei allen Rennen der Saison",
      "Nennung in Social-Media-Beiträgen"
    ],
    aermel: [
      "Logo ca. 8 × 5 cm am Oberarm",
      "Dynamische Zone – besonders beim Laufen im Bild",
      "Placement bei allen Rennen der Saison",
      "Nennung in Social-Media-Beiträgen"
    ],
    schenkel: [
      "Logo ca. 12 × 6 cm auf der Oberschenkel-Vorderseite",
      "Prominent auf Lauf- und Radfotos",
      "Placement bei allen Rennen der Saison",
      "Nennung in Social-Media-Beiträgen"
    ],
    huefte: [
      "Logo ca. 8 × 5 cm an der Hüftseite",
      "Dezente, aber konstant sichtbare Platzierung",
      "Placement bei allen Rennen der Saison",
      "Nennung in Social-Media-Beiträgen"
    ]
  };

  var TRISUIT_ZONES = [
    { id: "brust", type: "brust", label: "Brust (vorn)", short: "Brust", price: 300, no: 1 },
    { id: "schulter-l", type: "schulter", label: "Schulter links", short: "Schulter L", price: 100, no: 2 },
    { id: "schulter-r", type: "schulter", label: "Schulter rechts", short: "Schulter R", price: 100, no: 3 },
    { id: "aermel-l", type: "aermel", label: "Ärmel links", short: "Ärmel L", price: 150, no: 4 },
    { id: "aermel-r", type: "aermel", label: "Ärmel rechts", short: "Ärmel R", price: 150, no: 5 },
    { id: "huefte-l", type: "huefte", label: "Hüfte links", short: "Hüfte L", price: 120, no: 6 },
    { id: "huefte-r", type: "huefte", label: "Hüfte rechts", short: "Hüfte R", price: 120, no: 7 },
    { id: "schenkel-l", type: "schenkel", label: "Oberschenkel links", short: "Schenkel L", price: 200, no: 8 },
    { id: "schenkel-r", type: "schenkel", label: "Oberschenkel rechts", short: "Schenkel R", price: 200, no: 9 },
    { id: "ruecken", type: "ruecken", label: "Rücken", short: "Rücken", price: 250, no: 10 }
  ];

  window.TRISUIT_ZONES = TRISUIT_ZONES;

  function findZone(id) {
    for (var i = 0; i < TRISUIT_ZONES.length; i++) {
      if (TRISUIT_ZONES[i].id === id) return TRISUIT_ZONES[i];
    }
    return null;
  }

  /* ---------- Zone-Liste (Übersicht & Fallback) ---------- */

  var zoneList = document.getElementById("zoneList");

  if (zoneList) {
    TRISUIT_ZONES.forEach(function (zone) {
      var item = document.createElement("article");
      item.className = "zone-item";
      item.dataset.zone = zone.id;

      var no = document.createElement("span");
      no.className = "zone-no";
      no.textContent = zone.no;

      var name = document.createElement("h4");
      name.textContent = zone.label;

      var price = document.createElement("p");
      price.className = "zone-price";
      price.textContent = "€ " + zone.price;

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "zone-detail-btn";
      btn.textContent = "Details ansehen";
      btn.addEventListener("click", function () {
        openZoneModal(zone.id);
      });

      item.appendChild(no);
      item.appendChild(name);
      item.appendChild(price);
      item.appendChild(btn);
      zoneList.appendChild(item);
    });

    /* SVG-Zonen klickbar machen (inline geladene SVGs) */
    document.querySelectorAll(".suit-view img").forEach(function (img) {
      fetch(img.getAttribute("src"))
        .then(function (r) { return r.text(); })
        .then(function (svgText) {
          var doc = new DOMParser().parseFromString(svgText, "image/svg+xml");
          var svg = doc.documentElement;
          svg.removeAttribute("width");
          svg.removeAttribute("height");
          img.replaceWith(svg);

          svg.querySelectorAll(".zone-marker").forEach(function (marker) {
            marker.addEventListener("click", function () {
              openZoneModal(marker.dataset.zone);
            });
          });
        })
        .catch(function () {});
    });
  }

  /* ---------- Modal ---------- */

  var modal = document.getElementById("zoneModal");
  var modalTitle = document.getElementById("zoneModalTitle");
  var modalPrice = document.getElementById("zoneModalPrice");
  var modalIncludes = document.getElementById("zoneModalIncludes");
  var modalCta = document.getElementById("zoneModalCta");
  var currentZone = null;

  function openZoneModal(id) {
    var zone = findZone(id);
    if (!zone || !modal) return;

    currentZone = zone;
    modalTitle.textContent = "Logo-Position: " + zone.label;
    modalPrice.innerHTML = "€ " + zone.price + ' <span>pro Saison</span>';

    modalIncludes.innerHTML = "";
    (ZONE_INCLUDES[zone.type] || []).forEach(function (text) {
      var li = document.createElement("li");
      li.textContent = text;
      modalIncludes.appendChild(li);
    });

    modal.hidden = false;
    modal.querySelector(".modal").focus();
  }

  function closeZoneModal() {
    if (modal) modal.hidden = true;
    currentZone = null;
  }

  window.openZoneModal = openZoneModal;

  if (modal) {
    modal.addEventListener("click", function (event) {
      if (event.target === modal) closeZoneModal();
    });

    var closeBtn = document.getElementById("zoneModalClose");
    if (closeBtn) closeBtn.addEventListener("click", closeZoneModal);

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeZoneModal();
    });
  }

  if (modalCta) {
    modalCta.addEventListener("click", function () {
      if (!currentZone) return;
      var zone = currentZone;

      var select = document.getElementById("interest");
      if (select) select.value = zone.id;

      var form = document.getElementById("contactForm");
      if (form && !form.elements.message.value.trim()) {
        form.elements.message.value =
          "Hallo Christoph,\n\nich interessiere mich für die Logo-Position \u201e" +
          zone.label + "\u201c (\u20ac " + zone.price + "). " +
          "Bitte sende mir mehr Details zu einer Partnerschaft.";
      }

      closeZoneModal();
      document.getElementById("kontakt").scrollIntoView({ behavior: "smooth" });
      var nameInput = document.getElementById("name");
      if (nameInput) setTimeout(function () { nameInput.focus(); }, 600);
    });
  }

  /* ---------- Kontaktformular: Zonen-Auswahl ---------- */

  var interestSelect = document.getElementById("interest");

  if (interestSelect) {
    TRISUIT_ZONES.forEach(function (zone) {
      var opt = document.createElement("option");
      opt.value = zone.id;
      opt.textContent = zone.label + " \u2013 \u20ac " + zone.price;
      interestSelect.appendChild(opt);
    });
  }

  /* ---------- Navigation ---------- */

  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.textContent = open ? "\u2715" : "\u2630";
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.textContent = "\u2630";
      });
    });
  }

  /* ---------- Kontaktformular ---------- */

  var form = document.getElementById("contactForm");
  var formStatus = document.getElementById("formStatus");

  if (form && formStatus) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var name = form.elements.name.value.trim();
      var email = form.elements.email.value.trim();
      var message = form.elements.message.value.trim();

      if (!name || !email || !message) {
        formStatus.textContent = "Bitte alle Felder ausfüllen.";
        formStatus.className = "form-status err";
        return;
      }

      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailOk) {
        formStatus.textContent = "Bitte eine gültige E-Mail-Adresse angeben.";
        formStatus.className = "form-status err";
        return;
      }

      form.reset();
      formStatus.textContent = "Danke, " + name + "! Deine Nachricht wurde erfasst.";
      formStatus.className = "form-status ok";
    });
  }

  /* ---------- Jahr im Footer ---------- */

  var year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }
})();
