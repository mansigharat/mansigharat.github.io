/**
 * ==============================================================================
 * MANSI GHARAT — LUXURY PORTFOLIO SCRIPTS
 * Vanilla JavaScript (ES6+) — Zero external dependencies
 * Features:
 *  - Sticky Navbar & Active Section Highlighting
 *  - Accessible Mobile Navigation Drawer
 *  - IntersectionObserver Scroll-Reveal Animations
 *  - Hardware-Accelerated Ambient Cursor Glow (Desktop Only)
 *  - Project Category Filter (All / AI / Full-Stack)
 *  - Accessible Form Validation & Friendly Success Feedback
 *  - One-Click Clipboard Copy for Email
 *  - Smooth Back-to-Top Button
 *  - Dynamic Copyright Year
 *  - Prefers-Reduced-Motion Guard
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================================
     1. DYNAMIC COPYRIGHT YEAR
     ========================================================================== */
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear().toString();
  }

  /* ==========================================================================
     2. STICKY NAVBAR STYLING ON SCROLL
     ========================================================================== */
  const siteHeader = document.getElementById('siteHeader');
  const backToTopBtn = document.getElementById('backToTop');

  const handleScrollState = () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Header blur & border threshold
    if (siteHeader) {
      if (scrollY > 40) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    // Back-to-top button visibility
    if (backToTopBtn) {
      if (scrollY > 420) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', handleScrollState, { passive: true });
  handleScrollState(); // Initial check

  /* ==========================================================================
     3. SMOOTH SCROLLING & ACTIVE NAVIGATION LINK HIGHLIGHTING
     ========================================================================== */
  const sections = document.querySelectorAll('section[id], header[id]');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  // Smooth scroll offset adjustment
  const handleAnchorClick = (e, links) => {
    const targetLink = e.currentTarget;
    const targetId = targetLink.getAttribute('href');

    if (targetId && targetId.startsWith('#')) {
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = siteHeader ? siteHeader.offsetHeight : 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });

        // Set focus to target section for keyboard accessibility
        targetElement.setAttribute('tabindex', '-1');
        targetElement.focus({ preventScroll: true });
      }
    }
  };

  desktopNavLinks.forEach(link => {
    link.addEventListener('click', (e) => handleAnchorClick(e, desktopNavLinks));
  });

  // IntersectionObserver for active section highlighting
  if ('IntersectionObserver' in window) {
    const sectionObserverOptions = {
      root: null,
      rootMargin: '-30% 0px -60% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const activeId = `#${entry.target.getAttribute('id')}`;

          desktopNavLinks.forEach(link => {
            if (link.getAttribute('href') === activeId) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });

          mobileNavLinks.forEach(link => {
            if (link.getAttribute('href') === activeId) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, sectionObserverOptions);

    sections.forEach(section => sectionObserver.observe(section));
  }

  /* ==========================================================================
     4. ACCESSIBLE MOBILE NAVIGATION DRAWER
     ========================================================================== */
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileNav = document.getElementById('mobileNav');

  const openMobileMenu = () => {
    mobileToggle.setAttribute('aria-expanded', 'true');
    mobileNav.setAttribute('aria-hidden', 'false');
    mobileNav.classList.add('open');
    document.body.style.overflow = 'hidden'; // Lock background scroll
  };

  const closeMobileMenu = () => {
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close when any mobile navigation link is clicked
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        handleAnchorClick(e, mobileNavLinks);
        closeMobileMenu();
      });
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        closeMobileMenu();
        mobileToggle.focus();
      }
    });
  }

  /* ==========================================================================
     5. SCROLL-REVEAL ANIMATIONS (INTERSECTION OBSERVER)
     ========================================================================== */
  const revealElements = document.querySelectorAll('[data-reveal]');

  if (prefersReducedMotion) {
    // Reveal all immediately without animation for reduced-motion users
    revealElements.forEach(el => el.classList.add('is-visible'));
  } else if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // Reveal once
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  /* ==========================================================================
     6. SUBTLE CUSTOM CURSOR GLOW (DESKTOP ONLY)
     ========================================================================== */
  const cursorGlow = document.getElementById('cursorGlow');
  const hasFinePointer = window.matchMedia('(pointer: fine) and (hover: hover)').matches;

  if (cursorGlow && hasFinePointer && !prefersReducedMotion) {
    let mouseX = -500;
    let mouseY = -500;
    let currentX = -500;
    let currentY = -500;
    let isMoving = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isMoving) {
        isMoving = true;
        requestAnimationFrame(renderCursor);
      }
    }, { passive: true });

    function renderCursor() {
      // Smooth linear interpolation (lerp) for soft trailing effect
      const ease = 0.18;
      currentX += (mouseX - currentX) * ease;
      currentY += (mouseY - currentY) * ease;

      cursorGlow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;

      if (Math.abs(mouseX - currentX) > 0.1 || Math.abs(mouseY - currentY) > 0.1) {
        requestAnimationFrame(renderCursor);
      } else {
        isMoving = false;
      }
    }

    // Fade out cursor when mouse leaves the document window
    document.addEventListener('mouseleave', () => {
      cursorGlow.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursorGlow.style.opacity = '1';
    });
  }

  /* ==========================================================================
     7. PROJECTS CATEGORY FILTER CHIPS
     ========================================================================== */
  const filterButtons = document.querySelectorAll('.filter-chip');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const selectedFilter = button.getAttribute('data-filter');

      // Update button active state & ARIA attributes
      filterButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');

      // Filter project cards with smooth fade
      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        const matches = selectedFilter === 'all' || cardCategory === selectedFilter;

        if (matches) {
          card.classList.remove('is-hidden');
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px)';
          setTimeout(() => {
            card.classList.add('is-hidden');
          }, 300);
        }
      });
    });
  });

  /* ==========================================================================
     8. ACCESSIBLE CONTACT FORM VALIDATION & SUCCESS FEEDBACK
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const messageInput = document.getElementById('contactMessage');

  const groupName = document.getElementById('groupName');
  const groupEmail = document.getElementById('groupEmail');
  const groupMessage = document.getElementById('groupMessage');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');

  const formSuccess = document.getElementById('formSuccess');
  const resetFormBtn = document.getElementById('resetFormBtn');
  const submitBtn = document.getElementById('submitBtn');

  // RFC-compliant email regular expression
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  const setFieldError = (input, group, errorElement, message) => {
    group.classList.add('has-error');
    input.setAttribute('aria-invalid', 'true');
    errorElement.textContent = message;
  };

  const clearFieldError = (input, group, errorElement) => {
    group.classList.remove('has-error');
    input.setAttribute('aria-invalid', 'false');
    errorElement.textContent = '';
  };

  // Real-time error clearing as user types
  if (nameInput) {
    nameInput.addEventListener('input', () => {
      if (nameInput.value.trim().length > 0) {
        clearFieldError(nameInput, groupName, nameError);
      }
    });
  }

  if (emailInput) {
    emailInput.addEventListener('input', () => {
      if (emailRegex.test(emailInput.value.trim())) {
        clearFieldError(emailInput, groupEmail, emailError);
      }
    });
  }

  if (messageInput) {
    messageInput.addEventListener('input', () => {
      if (messageInput.value.trim().length >= 10) {
        clearFieldError(messageInput, groupMessage, messageError);
      }
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      let firstInvalidInput = null;

      // Validate Name
      const nameVal = nameInput.value.trim();
      if (!nameVal) {
        setFieldError(nameInput, groupName, nameError, 'Please enter your name.');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = nameInput;
      } else if (nameVal.length < 2) {
        setFieldError(nameInput, groupName, nameError, 'Name must be at least 2 characters.');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = nameInput;
      } else {
        clearFieldError(nameInput, groupName, nameError);
      }

      // Validate Email
      const emailVal = emailInput.value.trim();
      if (!emailVal) {
        setFieldError(emailInput, groupEmail, emailError, 'Please enter your email address.');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = emailInput;
      } else if (!emailRegex.test(emailVal)) {
        setFieldError(emailInput, groupEmail, emailError, 'Please enter a valid email address (e.g., name@example.com).');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = emailInput;
      } else {
        clearFieldError(emailInput, groupEmail, emailError);
      }

      // Validate Message
      const messageVal = messageInput.value.trim();
      if (!messageVal) {
        setFieldError(messageInput, groupMessage, messageError, 'Please enter your message.');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = messageInput;
      } else if (messageVal.length < 10) {
        setFieldError(messageInput, groupMessage, messageError, 'Message must be at least 10 characters.');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = messageInput;
      } else {
        clearFieldError(messageInput, groupMessage, messageError);
      }

      // Focus first invalid input
      if (!isValid && firstInvalidInput) {
        firstInvalidInput.focus();
        return;
      }

      // Simulation of submission feedback
      if (isValid) {
        submitBtn.disabled = true;
        const originalBtnText = submitBtn.querySelector('.btn-text').textContent;
        submitBtn.querySelector('.btn-text').textContent = 'Transmitting...';

        /* 
          ==========================================================
          FOR REAL BACKEND INTEGRATION:
          If you are using Formspree or Netlify Forms, you can either:
          1. Remove e.preventDefault() and allow standard POST submission, or
          2. Use fetch() to submit form data via POST:
             fetch("https://formspree.io/f/YOUR_FORM_ID", {
               method: "POST",
               body: new FormData(contactForm),
               headers: { 'Accept': 'application/json' }
             }).then(...)
          ==========================================================
        */

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.querySelector('.btn-text').textContent = originalBtnText;

          // Hide form inputs and reveal success message
          groupName.style.display = 'none';
          groupEmail.style.display = 'none';
          groupMessage.style.display = 'none';
          submitBtn.parentElement.style.display = 'none';

          formSuccess.removeAttribute('hidden');
          formSuccess.focus();
        }, 600);
      }
    });

    // Reset Form button action
    if (resetFormBtn) {
      resetFormBtn.addEventListener('click', () => {
        contactForm.reset();
        clearFieldError(nameInput, groupName, nameError);
        clearFieldError(emailInput, groupEmail, emailError);
        clearFieldError(messageInput, groupMessage, messageError);

        groupName.style.display = '';
        groupEmail.style.display = '';
        groupMessage.style.display = '';
        submitBtn.parentElement.style.display = '';

        formSuccess.setAttribute('hidden', '');
        nameInput.focus();
      });
    }
  }

  /* ==========================================================================
     9. QUICK ONE-CLICK COPY EMAIL TO CLIPBOARD
     ========================================================================== */
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const copyFeedback = document.getElementById('copyFeedback');

  if (copyEmailBtn && copyFeedback) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = 'mansigharat1909@gmail.com';

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
        } else {
          // Fallback for non-secure contexts
          const tempInput = document.createElement('input');
          tempInput.value = email;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }

        copyFeedback.textContent = 'Copied!';
        copyFeedback.classList.add('show');

        setTimeout(() => {
          copyFeedback.classList.remove('show');
        }, 2200);
      } catch (err) {
        copyFeedback.textContent = 'Failed';
        copyFeedback.classList.add('show');
        setTimeout(() => {
          copyFeedback.classList.remove('show');
        }, 2200);
      }
    });
  }

  /* ==========================================================================
     10. FLOATING BACK TO TOP ACTION
     ========================================================================== */
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });
  }
});
