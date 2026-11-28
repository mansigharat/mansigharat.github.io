/**
 * INTRO LOADER
 * Name in huge letters with a percentage counter (max 1.3 seconds).
 * Safety net: forces completion within 3 seconds no matter what.
 */
export function initLoader(onComplete) {
  const overlay = document.querySelector('.loader-overlay');
  const counter = document.querySelector('.loader-counter');

  // If DOM elements are missing, skip straight to content
  if (!overlay || !counter) {
    try { if (onComplete) onComplete(); } catch (e) { console.error('[loader] onComplete error:', e); }
    return;
  }

  let completed = false;

  function finish() {
    if (completed) return; // guard against double-fire
    completed = true;
    clearTimeout(safetyTimer);
    counter.textContent = '100%';
    setTimeout(() => {
      overlay.classList.add('loaded');
      try { if (onComplete) onComplete(); } catch (e) { console.error('[loader] onComplete error:', e); }
    }, 150);
  }

  // ── Hard safety net: always finishes within 3 s ──────────────────────────
  const safetyTimer = setTimeout(() => {
    console.warn('[loader] Safety net triggered — forcing loader to close.');
    finish();
  }, 3000);

  // ── Normal rAF counter: 0 → 100 % over ~1.3 s ───────────────────────────
  const startTime = performance.now();
  const maxDuration = 1300; // ms

  function update() {
    try {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(1, elapsed / maxDuration);

      counter.textContent = `${String(Math.floor(progress * 100)).padStart(2, '0')}%`;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        finish();
      }
    } catch (e) {
      console.error('[loader] rAF error:', e);
      finish(); // even if something breaks, still open the site
    }
  }

  requestAnimationFrame(update);
}
