/**
 * SCROLL REVEAL — IntersectionObserver-based entrance animations
 * Adds .is-visible to .reveal / .reveal-left / .reveal-scale elements on scroll
 * Also handles the page-level scroll progress bar
 */
export function initReveal() {
  // ── 1. Scroll progress bar ──────────────────────────────────────────────
  const bar = document.createElement('div');
  bar.className = 'scroll-progress-bar';
  document.body.prepend(bar);

  window.addEventListener('scroll', () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    bar.style.width = `${pct.toFixed(1)}%`;
  }, { passive: true });

  // ── 2. Entrance reveals ─────────────────────────────────────────────────
  const selector = '.reveal, .reveal-left, .reveal-scale';
  const elements = document.querySelectorAll(selector);
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // fire once
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -48px 0px'
  });

  elements.forEach(el => observer.observe(el));
}
