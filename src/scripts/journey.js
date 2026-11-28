import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * JOURNEY SECTION: PINNED HORIZONTAL SCROLL
 * Advances chapters 01 to 05 with a progress bar and background drifting typography
 */
export function initJourney() {
  const section = document.querySelector('.journey-section');
  const scrollContainer = document.querySelector('.journey-scroll-container');
  const counterEl = document.querySelector('.journey-counter');
  const progressBar = document.querySelector('.journey-progress-bar');
  const bgNumbers = document.querySelectorAll('.journey-bg-num');

  if (!section || !scrollContainer) return;

  // Reduced motion or small/tablet screens fallback (matches 960px CSS breakpoint)
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth <= 960) {
    scrollContainer.style.overflowX = 'auto';
    scrollContainer.style.scrollSnapType = 'x mandatory';
    return;
  }

  const cards = gsap.utils.toArray('.journey-card');
  const totalCards = cards.length;

  // Calculate total scroll distance
  function getScrollAmount() {
    return -(scrollContainer.scrollWidth - window.innerWidth + 80);
  }

  const tween = gsap.to(scrollContainer, {
    x: getScrollAmount,
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      pin: true,
      scrub: 0.8,
      start: 'top top',
      end: () => `+=${scrollContainer.scrollWidth - window.innerWidth + 400}`,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        // Update progress bar
        if (progressBar) {
          const progressPercent = Math.max(10, self.progress * 100);
          progressBar.style.width = `${progressPercent}%`;
        }

        // Update active chapter counter
        if (counterEl) {
          const activeIndex = Math.min(totalCards, Math.floor(self.progress * totalCards) + 1);
          counterEl.textContent = `CHAPTER // 0${activeIndex} / 0${totalCards}`;
        }
      }
    }
  });

  // Parallax on drifting background numerals
  bgNumbers.forEach((num) => {
    gsap.to(num, {
      x: -60,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        scrub: 1.2,
        start: 'top top',
        end: () => `+=${scrollContainer.scrollWidth}`
      }
    });
  });
}
