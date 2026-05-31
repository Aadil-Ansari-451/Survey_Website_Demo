/* ===================================================================
   NB Onoya Geomatics — shared site behavior
   Loaded on every page. Reads theme written by the home Tweaks panel.
   =================================================================== */
(function () {
  "use strict";

  /* ---- Apply persisted theme (color / accent / font) ASAP ---- */
  function applyTheme() {
    var t;
    try { t = JSON.parse(localStorage.getItem("onoya-theme") || "{}"); }
    catch (e) { t = {}; }
    var root = document.documentElement;
    root.setAttribute("data-color", t.color || "warm");
    root.setAttribute("data-accent", t.accent || "none");
    root.setAttribute("data-font", t.font || "neue");
  }
  applyTheme();
  window.addEventListener("storage", function (e) { if (e.key === "onoya-theme") applyTheme(); });

  document.addEventListener("DOMContentLoaded", function () {
    /* ---- Mark active nav link ---- */
    var here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    document.querySelectorAll(".nav__links a:not(.btn)").forEach(function (a) {
      var href = (a.getAttribute("href") || "").toLowerCase();
      if (href === here) a.classList.add("active");
    });

    /* ---- Mobile menu ---- */
    var toggle = document.querySelector(".nav__toggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        document.body.classList.toggle("menu-open");
        var open = document.body.classList.contains("menu-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
      document.querySelectorAll(".nav__links a").forEach(function (a) {
        a.addEventListener("click", function () { document.body.classList.remove("menu-open"); });
      });
    }

    /* ---- Sticky nav border on scroll ---- */
    var nav = document.querySelector(".nav");
    if (nav) {
      var onScroll = function () { nav.classList.toggle("is-stuck", window.scrollY > 8); };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    /* ---- Promo banner dismiss ---- */
    var promo = document.querySelector(".promo");
    if (promo) {
      if (sessionStorage.getItem("onoya-promo-closed") === "1") promo.hidden = true;
      var pc = promo.querySelector(".promo__close");
      if (pc) pc.addEventListener("click", function () {
        promo.hidden = true;
        sessionStorage.setItem("onoya-promo-closed", "1");
      });
    }

    /* ---- Scroll reveal ---- */
    var reveals = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && reveals.length) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
      reveals.forEach(function (el) { io.observe(el); });
    } else {
      reveals.forEach(function (el) { el.classList.add("in"); });
    }

    /* ---- Form validation + fake submit ---- */
    document.querySelectorAll("form[data-validate]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var ok = true;
        form.querySelectorAll("[required]").forEach(function (input) {
          var field = input.closest(".field");
          var val = (input.value || "").trim();
          var bad = !val || (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val));
          if (field) {
            field.classList.toggle("field--invalid", bad);
            var err = field.querySelector(".field__error");
            if (err) err.textContent = bad ? (val && input.type === "email" ? "Enter a valid email address." : "This field is required.") : "";
          }
          if (bad) ok = false;
        });
        if (!ok) return;
        var success = form.querySelector(".form-success") || document.querySelector(form.dataset.success || "");
        form.querySelectorAll(".field, .form__row, button[type=submit], .form__note").forEach(function (el) { el.style.display = "none"; });
        if (success) { success.hidden = false; success.style.display = "flex"; }
      });
      form.querySelectorAll("input, textarea, select").forEach(function (input) {
        input.addEventListener("input", function () {
          var field = input.closest(".field");
          if (field && field.classList.contains("field--invalid")) {
            field.classList.remove("field--invalid");
            var err = field.querySelector(".field__error");
            if (err) err.textContent = "";
          }
        });
      });
    });

    /* ---- Footer year ---- */
    var yr = document.getElementById("year");
    if (yr) yr.textContent = new Date().getFullYear();
  });
})();
