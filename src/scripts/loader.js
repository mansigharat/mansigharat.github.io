/**
 * INTRO LOADER
 * Name in huge letters with a percentage counter (max 1.5 seconds)
 */
export function initLoader(onComplete) {
  const overlay = document.querySelector('.loader-overlay');
  const counter = document.querySelector('.loader-counter');
  if (!overlay || !counter) {
    if (onComplete) onComplete();
    return;
  }

  let count = 0;
  const startTime = performance.now();
  const maxDuration = 1300; // 1.3 seconds max

  function update() {
    const elapsed = performance.now() - startTime;
    const progress = Math.min(1, elapsed / maxDuration);
    
    // Ease-out progress curve
    count = Math.floor(progress * 100);
    counter.textContent = `${String(count).padStart(2, '0')}%`;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      counter.textContent = '100%';
      setTimeout(() => {
        overlay.classList.add('loaded');
        if (onComplete) onComplete();
      }, 150);
    }
  }

  requestAnimationFrame(update);
}
