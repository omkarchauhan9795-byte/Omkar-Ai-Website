/* ==========================================================================
   Omkar-Ai — site interactions
   No dependencies, no tracking, no network requests.
   ========================================================================== */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var doc = document;
  var root = doc.documentElement;

  root.classList.remove("no-js");
  root.classList.add("js");

  /* Year ------------------------------------------------------------------ */
  var years = doc.querySelectorAll("[data-year]");
  years.forEach(function (node) {
    node.textContent = new Date().getFullYear();
  });

  /* Header ---------------------------------------------------------------- */
  var header = doc.querySelector(".site-header");
  var navToggle = doc.querySelector(".nav-toggle");
  var nav = doc.querySelector(".nav");

  function syncHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  function openNav() {
    if (!nav || !navToggle) return;
    nav.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
  }

  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      if (navToggle.getAttribute("aria-expanded") === "true") {
        closeNav();
      } else {
        openNav();
      }
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });

    doc.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeNav();
    });

    doc.addEventListener("click", function (event) {
      if (navToggle.getAttribute("aria-expanded") !== "true") return;
      if (nav.contains(event.target) || navToggle.contains(event.target)) return;
      closeNav();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 960) closeNav();
    });
  }

  /* Active page ----------------------------------------------------------- */
  var current = window.location.pathname.split("/").pop() || "index.html";
  doc.querySelectorAll(".nav a[href]").forEach(function (link) {
    var href = link.getAttribute("href").split("#")[0];
    if (href && href === current) link.classList.add("is-active");
  });

  /* Reveal ---------------------------------------------------------------- */
  var revealNodes = doc.querySelectorAll("[data-reveal]");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealNodes.forEach(function (node) {
      node.classList.add("is-visible");
    });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -42px 0px" });

    revealNodes.forEach(function (node) {
      revealObserver.observe(node);
    });
  }

  /* Counters -------------------------------------------------------------- */
  var counters = doc.querySelectorAll("[data-count]");

  function runCounter(node) {
    var end = parseInt(node.getAttribute("data-count"), 10);
    if (isNaN(end)) return;
    if (reduceMotion) {
      node.textContent = String(end);
      return;
    }
    var start = 0;
    var duration = 1250;
    var started = null;

    function step(timestamp) {
      if (!started) started = timestamp;
      var progress = Math.min((timestamp - started) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      node.textContent = String(Math.round(start + (end - start) * eased));
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  if (counters.length) {
    if (!("IntersectionObserver" in window) || reduceMotion) {
      counters.forEach(runCounter);
    } else {
      var counterObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          runCounter(entry.target);
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.6 });
      counters.forEach(function (node) {
        observerSafeObserve(counterObserver, node);
      });
    }
  }

  function observerSafeObserve(observer, node) {
    observer.observe(node);
  }

  /* Feature tabs ---------------------------------------------------------- */
  var tabButtons = Array.prototype.slice.call(doc.querySelectorAll("[data-tab]"));
  var tabPanels = Array.prototype.slice.call(doc.querySelectorAll("[data-panel]"));

  if (tabButtons.length && tabPanels.length) {
    function selectTab(id, focus) {
      tabButtons.forEach(function (button) {
        var active = button.getAttribute("data-tab") === id;
        button.setAttribute("aria-selected", active ? "true" : "false");
        button.setAttribute("tabindex", active ? "0" : "-1");
        if (active && focus) button.focus();
      });

      tabPanels.forEach(function (panel) {
        var active = panel.getAttribute("data-panel") === id;
        panel.classList.toggle("is-active", active);
        if (active) {
          panel.removeAttribute("hidden");
        } else {
          panel.setAttribute("hidden", "");
        }
      });
    }

    var initial = tabButtons.filter(function (button) {
      return button.getAttribute("aria-selected") === "true";
    })[0] || tabButtons[0];

    selectTab(initial.getAttribute("data-tab"), false);

    tabButtons.forEach(function (button, index) {
      button.addEventListener("click", function () {
        selectTab(button.getAttribute("data-tab"), false);
      });

      button.addEventListener("keydown", function (event) {
        var next = null;
        if (event.key === "ArrowDown" || event.key === "ArrowRight") {
          next = tabButtons[(index + 1) % tabButtons.length];
        } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
          next = tabButtons[(index - 1 + tabButtons.length) % tabButtons.length];
        } else if (event.key === "Home") {
          next = tabButtons[0];
        } else if (event.key === "End") {
          next = tabButtons[tabButtons.length - 1];
        }
        if (next) {
          event.preventDefault();
          selectTab(next.getAttribute("data-tab"), true);
        }
      });
    });
  }

  /* Safety demo ----------------------------------------------------------- */
  var demos = doc.querySelectorAll("[data-safety-demo]");
  demos.forEach(function (demo) {
    var trigger = demo.querySelector("[data-demo-trigger]");
    var confirm = demo.querySelector("[data-demo-confirm]");
    var yes = demo.querySelector("[data-demo-yes]");
    var cancel = demo.querySelector("[data-demo-cancel]");
    var log = demo.querySelector("[data-demo-log]");

    if (!trigger || !confirm || !log) return;

    function setLog(message, tone) {
      log.textContent = message;
      log.classList.remove("is-ok", "is-warn", "is-cancel");
      if (tone) log.classList.add("is-" + tone);
    }

    trigger.addEventListener("click", function () {
      confirm.removeAttribute("hidden");
      trigger.setAttribute("aria-expanded", "true");
      setLog("SAFETY GUARD · confirmation required. The model cannot approve this itself.", "warn");
    });

    if (yes) {
      yes.addEventListener("click", function () {
        confirm.setAttribute("hidden", "");
        trigger.setAttribute("aria-expanded", "false");
        setLog("DEMO ONLY · human approval received. A checkpoint would be created before any change.", "ok");
      });
    }

    if (cancel) {
      cancel.addEventListener("click", function () {
        confirm.setAttribute("hidden", "");
        trigger.setAttribute("aria-expanded", "false");
        setLog("CANCELLED · 0 files touched. The request ends here.", "cancel");
      });
    }
  });

  /* FAQ accordion --------------------------------------------------------- */
  var faqItems = doc.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (!item.open) return;
      faqItems.forEach(function (other) {
        if (other !== item) other.removeAttribute("open");
      });
    });
  });

  /* Copy buttons ---------------------------------------------------------- */
  var copyButtons = doc.querySelectorAll("[data-copy]");

  function fallbackCopy(text) {
    var area = doc.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    doc.body.appendChild(area);
    area.select();
    try {
      doc.execCommand("copy");
    } catch (error) {
      // Nothing else to do; the checksum remains selectable by hand.
    }
    doc.body.removeChild(area);
  }

  copyButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var selector = button.getAttribute("data-copy");
      var text = "";

      if (selector && selector.charAt(0) === "#") {
        var source = doc.querySelector(selector);
        text = source ? source.textContent : "";
      } else {
        text = button.getAttribute("data-copy") || "";
      }

      text = text.trim();

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).catch(function () {
          fallbackCopy(text);
        });
      } else {
        fallbackCopy(text);
      }

      var previous = button.getAttribute("aria-label") || "Copy";
      button.classList.add("is-copied");
      button.setAttribute("aria-label", "Copied");
      button.setAttribute("title", "Copied");
      window.setTimeout(function () {
        button.classList.remove("is-copied");
        button.setAttribute("aria-label", previous);
        button.setAttribute("title", previous);
      }, 1800);
    });
  });

  /* Hero prompt typing ---------------------------------------------------- */
  var prompt = doc.querySelector("[data-typing]");
  if (prompt && !reduceMotion) {
    var phrases = [
      "Open my notes and summarize today.",
      "Send the report to Aadesh.",
      "What did we decide yesterday?",
      "Play my focus playlist.",
      "Clean up my Downloads folder."
    ];
    var phraseIndex = 0;
    var charIndex = 0;
    var deleting = false;

    function typeLoop() {
      var phrase = phrases[phraseIndex];
      if (!deleting) {
        charIndex++;
        prompt.textContent = phrase.slice(0, charIndex);
        if (charIndex === phrase.length) {
          deleting = true;
          window.setTimeout(typeLoop, 2400);
          return;
        }
        window.setTimeout(typeLoop, 48);
      } else {
        charIndex--;
        prompt.textContent = phrase.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          window.setTimeout(typeLoop, 420);
          return;
        }
        window.setTimeout(typeLoop, 22);
      }
    }

    window.setTimeout(typeLoop, 1600);
  }

  /* Docs / legal scrollspy ------------------------------------------------ */
  var spyLinks = Array.prototype.slice.call(
    doc.querySelectorAll(".docs-nav a[href^='#'], .legal-nav a[href^='#']")
  );
  var spySections = spyLinks
    .map(function (link) {
      var id = link.getAttribute("href").slice(1);
      var section = doc.getElementById(id);
      return section ? { link: link, section: section } : null;
    })
    .filter(Boolean);

  if (spySections.length && "IntersectionObserver" in window) {
    var spyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        spyLinks.forEach(function (link) {
          link.classList.remove("is-active");
        });
        var match = spySections.filter(function (item) {
          return item.section === entry.target;
        })[0];
        if (match) match.link.classList.add("is-active");
      });
    }, { rootMargin: "-18% 0px -68% 0px", threshold: 0 });

    spySections.forEach(function (item) {
      spyObserver.observe(item.section);
    });
  }
})();
