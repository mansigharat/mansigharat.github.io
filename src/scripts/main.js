import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { initCursor } from './cursor.js';
import { initLoader } from './loader.js';
import { initNav } from './nav.js';
import { initFlowField } from './flowfield.js';
import { initJourney } from './journey.js';
import { initProjects3D } from './projects3d.js';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lenis Smooth Scrolling
  let lenis = null;
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!isReducedMotion) {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.05
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }

  // 2. Initialize Subsystems
  initCursor();
  initNav(lenis);
  initFlowField();
  initJourney();
  initProjects3D();

  // 3. Hero Parallax Interactivity
  initHeroParallax();

  // 4. Back To Top
  document.querySelector('.btn-back-to-top')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.5 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  // 5. Run Intro Loader
  initLoader(() => {
    // Entrance animations after loader disappears
    gsap.from('.hero-badge', {
      y: 30,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out'
    });
    gsap.from('.hero-giant-text', {
      y: 60,
      opacity: 0,
      duration: 1.1,
      delay: 0.1,
      ease: 'power3.out'
    });
    gsap.from('.hero-supporting-text', {
      y: 40,
      opacity: 0,
      duration: 1.0,
      delay: 0.25,
      ease: 'power3.out'
    });
    gsap.from('.hero-cta-group', {
      y: 30,
      opacity: 0,
      duration: 1.0,
      delay: 0.35,
      ease: 'power3.out'
    });
  });
});

/**
 * Hero mouse-movement & scroll parallax
 */
function initHeroParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const heroSection = document.querySelector('.hero-section');
  const heroText = document.querySelector('.hero-giant-text');
  const heroSub = document.querySelector('.hero-supporting-text');

  if (!heroSection || !heroText) return;

  let currentMouseX = 0;
  let currentMouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  heroSection.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    targetMouseX = (clientX / innerWidth - 0.5) * 2; // -1 to 1
    targetMouseY = (clientY / innerHeight - 0.5) * 2;
  });

  function updateHeroParallax() {
    currentMouseX += (targetMouseX - currentMouseX) * 0.06;
    currentMouseY += (targetMouseY - currentMouseY) * 0.06;

    heroText.style.transform = `translate3d(${currentMouseX * -12}px, ${currentMouseY * -8}px, 0)`;
    if (heroSub) {
      heroSub.style.transform = `translate3d(${currentMouseX * 6}px, ${currentMouseY * 4}px, 0)`;
    }

    requestAnimationFrame(updateHeroParallax);
  }
  requestAnimationFrame(updateHeroParallax);

  // Subtle scroll parallax with GSAP
  gsap.to(heroText, {
    y: 80,
    ease: 'none',
    scrollTrigger: {
      trigger: heroSection,
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });
}
