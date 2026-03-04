/**
 * OculoMetrix Landing Page — Client-side behavior
 */
(function () {
  "use strict";

  /* ---- Mobile nav toggle ---- */
  const toggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      navLinks.classList.toggle("active");
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---- Header shrink on scroll ---- */
  const header = document.querySelector(".site-header");
  if (header) {
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          header.classList.toggle("scrolled", window.scrollY > 60);
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /* ---- Smooth scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (targetId === "#" || targetId === "#top") return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: elementPosition - headerOffset,
          behavior: "smooth",
        });
      }
    });
  });

  /* ---- Intersection Observer for fade-in animations ---- */
  const observerOptions = {
    root: null,
    rootMargin: "0px 0px -60px 0px",
    threshold: 0.1,
  };

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        fadeObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document
    .querySelectorAll(
      ".step, .feature-card, .testimonial-card, .metric-card, .evidence-list li"
    )
    .forEach((el) => {
      el.classList.add("fade-in");
      fadeObserver.observe(el);
    });

  /* Inject fade-in styles dynamically to keep CSS clean */
  const style = document.createElement("style");
  style.textContent = `
    .fade-in {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.5s ease, transform 0.5s ease;
    }
    .fade-in.visible {
      opacity: 1;
      transform: translateY(0);
    }
    .site-header.scrolled {
      background: rgba(10, 22, 40, 0.98);
      box-shadow: 0 2px 20px rgba(0,0,0,0.3);
    }
  `;
  document.head.appendChild(style);

  /* ---- Stagger animation delays ---- */
  document.querySelectorAll(".steps-grid .step").forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.1}s`;
  });
  document.querySelectorAll(".features-grid .feature-card").forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.08}s`;
  });
  document.querySelectorAll(".testimonials-grid .testimonial-card").forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.08}s`;
  });
  document.querySelectorAll(".evidence-metrics .metric-card").forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.1}s`;
  });

  /* ---- Demo form handling ---- */
  const form = document.querySelector(".cta-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = form.querySelector("#name");
      const email = form.querySelector("#email");
      const department = form.querySelector("#department");
      const role = form.querySelector("#role");
      let valid = true;

      [name, email, department, role].forEach((field) => {
        if (!field.value.trim()) {
          field.style.borderColor = "#ef4444";
          valid = false;
        } else {
          field.style.borderColor = "";
        }
      });

      if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.style.borderColor = "#ef4444";
        valid = false;
      }

      if (!valid) return;

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Sending…";
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.textContent = "Demo Requested!";
        submitBtn.style.background = "#22c55e";

        setTimeout(() => {
          form.reset();
          submitBtn.textContent = originalText;
          submitBtn.style.background = "";
          submitBtn.disabled = false;
        }, 3000);
      }, 1200);
    });
  }

  /* ---- Animated stat counters ---- */
  const statValues = document.querySelectorAll(".stat-value");
  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateValue(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statValues.forEach((el) => statObserver.observe(el));

  function animateValue(el) {
    const text = el.textContent.trim();
    const match = text.match(/^(\d+)/);
    if (!match) return;

    const target = parseInt(match[1], 10);
    const suffix = text.replace(match[1], "");
    const duration = 1200;
    const start = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }
})();
