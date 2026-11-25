/**
 * FLOATING PILL NAVBAR
 * Active section detection, theme inversion (light/dark sections), and smooth navigation
 */
export function initNav(lenis) {
  const navWrap = document.querySelector('.header-nav-wrap');
  const navLinks = document.querySelectorAll('.nav-pill-link, .mobile-drawer a');
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const sections = document.querySelectorAll('section[id]');

  if (!sections.length) return;

  // Mobile drawer toggle
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
      const isOpen = mobileDrawer.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close on link click
    mobileDrawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Smooth scroll using Lenis if available
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        if (lenis) {
          lenis.scrollTo(targetElement, { offset: -30, duration: 1.2 });
        } else {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // Active section & theme detection on scroll
  function updateNav() {
    const scrollPosition = window.scrollY + window.innerHeight * 0.35;
    let currentSection = sections[0];

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSection = section;
      }
    });

    if (currentSection) {
      const id = currentSection.getAttribute('id');
      navLinks.forEach((link) => {
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      // Invert nav pill theme when in light section
      if (navWrap) {
        if (currentSection.classList.contains('theme-light')) {
          navWrap.classList.add('nav-theme-light');
        } else {
          navWrap.classList.remove('nav-theme-light');
        }
      }
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
}
