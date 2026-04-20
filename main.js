
/* =============================================
   CASA MEREUTA – Main JavaScript
   ============================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* ============================================
     1. MOBILE HAMBURGER MENU TOGGLE
     ============================================ */
  const burger = document.getElementById("burger");
  const mobileMenu = document.getElementById("mobile-menu");

  if (burger && mobileMenu) {
    burger.addEventListener("click", function () {
      const isOpen = mobileMenu.classList.contains("menu-open");
      if (isOpen) {
        mobileMenu.classList.remove("menu-open");
        mobileMenu.classList.add("hidden");
        burger.setAttribute("aria-expanded", "false");
      } else {
        mobileMenu.classList.remove("hidden");
        mobileMenu.classList.add("menu-open");
        burger.setAttribute("aria-expanded", "true");
      }
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (e) {
      if (!burger.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove("menu-open");
        mobileMenu.classList.add("hidden");
        burger.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ============================================
     2. FAQ ACCORDION
     ============================================ */
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(function (item) {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    if (question && answer) {
      question.addEventListener("click", function () {
        const isOpen = item.classList.contains("open");

        // Close all others
        faqItems.forEach(function (otherItem) {
          if (otherItem !== item) {
            otherItem.classList.remove("open");
            const otherAnswer = otherItem.querySelector(".faq-answer");
            if (otherAnswer) {
              otherAnswer.classList.add("hidden");
            }
          }
        });

        // Toggle current
        if (isOpen) {
          item.classList.remove("open");
          answer.classList.add("hidden");
        } else {
          item.classList.add("open");
          answer.classList.remove("hidden");
        }
      });
    }
  });

  /* ============================================
     3. SCROLL FADE-IN ANIMATIONS
     ============================================ */
  const fadeEls = document.querySelectorAll(".fade-in");

  if ("IntersectionObserver" in window) {
    const fadeObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    fadeEls.forEach(function (el) {
      fadeObserver.observe(el);
    });
  } else {
    // Fallback: show all elements if IntersectionObserver not supported
    fadeEls.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  /* ============================================
     4. ANIMATED NUMBER COUNTERS
     ============================================ */
  const counters = document.querySelectorAll(".counter");

  if (counters.length > 0 && "IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute("data-target"), 10);
            const duration = 2000; // ms
            const start = performance.now();
            const startValue = 0;

            function updateCounter(currentTime) {
              const elapsed = currentTime - start;
              const progress = Math.min(elapsed / duration, 1);
              // Ease out cubic
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = Math.round(startValue + (target - startValue) * eased);
              el.textContent = current.toLocaleString("ro-RO");

              if (progress < 1) {
                requestAnimationFrame(updateCounter);
              } else {
                el.textContent = target.toLocaleString("ro-RO");
              }
            }

            requestAnimationFrame(updateCounter);
            counterObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function (counter) {
      counterObserver.observe(counter);
    });
  }

  /* ============================================
     5. BACK TO TOP BUTTON
     ============================================ */
  const backToTop = document.getElementById("back-to-top");

  if (backToTop) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 300) {
        backToTop.classList.add("show");
        backToTop.style.opacity = "1";
      } else {
        backToTop.classList.remove("show");
        backToTop.style.opacity = "0";
      }
    });

    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ============================================
     6. CONTACT FORM SUCCESS MESSAGE
     ============================================ */
  const contactForm = document.getElementById("contact-form");
  const formSuccess = document.getElementById("form-success");

  if (contactForm && formSuccess) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Simulate short processing delay
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.textContent = "Se trimite...";
        submitBtn.disabled = true;
      }

      setTimeout(function () {
        contactForm.style.display = "none";
        formSuccess.classList.remove("hidden");
        formSuccess.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 800);
    });
  }

  /* ============================================
     7. GALLERY FILTER BUTTONS
     ============================================ */
  const filterButtons = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");

  if (filterButtons.length > 0 && galleryItems.length > 0) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        const filter = btn.getAttribute("data-filter");

        // Update active button styles
        filterButtons.forEach(function (b) {
          b.classList.remove("active-filter", "bg-primary", "text-white");
          b.classList.add("bg-white/10", "text-white/70");
        });
        btn.classList.add("active-filter");
        btn.classList.remove("bg-white/10", "text-white/70");
        btn.classList.add("bg-primary", "text-white");

        // Filter items
        galleryItems.forEach(function (item) {
          const category = item.getAttribute("data-category");
          if (filter === "all" || category === filter) {
            item.classList.remove("hidden-item");
            item.style.display = "";
            // Re-trigger fade animation
            item.classList.remove("visible");
            setTimeout(function () {
              item.classList.add("visible");
            }, 50);
          } else {
            item.classList.add("hidden-item");
            item.style.display = "none";
          }
        });
      });
    });
  }

  /* ============================================
     8. GALLERY LIGHTBOX
     ============================================ */
  const galleryImages = document.querySelectorAll(".gallery-item img");

  if (galleryImages.length > 0) {
    // Create lightbox elements dynamically
    const overlay = document.createElement("div");
    overlay.id = "lightbox-overlay";

    const closeBtn = document.createElement("button");
    closeBtn.id = "lightbox-close";
    closeBtn.innerHTML = "✕";
    closeBtn.setAttribute("aria-label", "Închide");

    const lightboxImg = document.createElement("img");
    lightboxImg.alt = "Imagine mărită";

    overlay.appendChild(closeBtn);
    overlay.appendChild(lightboxImg);
    document.body.appendChild(overlay);

    galleryImages.forEach(function (img) {
      img.style.cursor = "pointer";
      img.addEventListener("click", function () {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        overlay.classList.add("active");
        document.body.style.overflow = "hidden";
      });
    });

    function closeLightbox() {
      overlay.classList.remove("active");
      document.body.style.overflow = "";
      setTimeout(function () {
        lightboxImg.src = "";
      }, 300);
    }

    closeBtn.addEventListener("click", closeLightbox);

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeLightbox();
      }
    });
  }

  /* ============================================
     9. NAVBAR STICKY SHADOW ON SCROLL
     ============================================ */
  const navbar = document.getElementById("navbar");

  if (navbar) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 10) {
        navbar.style.boxShadow = "0 4px 24px rgba(142, 68, 173, 0.25)";
      } else {
        navbar.style.boxShadow = "";
      }
    });
  }

  /* ============================================
     10. PARTNERS CAROUSEL PAUSE ON TOUCH
     ============================================ */
  const partnersTrack = document.querySelector(".partners-track");

  if (partnersTrack) {
    partnersTrack.addEventListener("touchstart", function () {
      partnersTrack.style.animationPlayState = "paused";
    });
    partnersTrack.addEventListener("touchend", function () {
      partnersTrack.style.animationPlayState = "running";
    });
  }

  /* ============================================
     11. STAGGER FADE-IN FOR GRID ITEMS
     ============================================ */
  const gridCards = document.querySelectorAll(
    ".grid .fade-in, .space-y-4 .fade-in, .space-y-8 .fade-in"
  );

  gridCards.forEach(function (card, index) {
    card.style.transitionDelay = (index % 6) * 80 + "ms";
  });

  /* ============================================
     12. SMOOTH ANCHOR LINKS
     ============================================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  /* ============================================
     13. TOOLTIP POSITIONING FIX FOR MOBILE
     ============================================ */
  const floatingBtns = document.querySelectorAll(".fixed.left-5 .tooltip-label");

  if (window.innerWidth < 640) {
    floatingBtns.forEach(function (tip) {
      tip.style.display = "none";
    });
  }

}); // END DOMContentLoaded