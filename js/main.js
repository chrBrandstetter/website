(function () {
  "use strict";

  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.textContent = open ? "✕" : "☰";
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.textContent = "☰";
      });
    });
  }

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

  var year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }
})();
