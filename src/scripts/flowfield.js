/**
 * CANVAS PARTICLE FLOW FIELD (About Section)
 * Lightweight, delicate curved white streaks reacting to the cursor.
 * Pauses when offscreen for high Lighthouse/GPU performance.
 */
export function initFlowField() {
  const canvas = document.getElementById('about-flowfield-canvas');
  if (!canvas) return;

  // Disable on reduced motion or coarse pointer if desired
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.offsetWidth);
  let height = (canvas.height = canvas.offsetHeight);

  let mouse = { x: -1000, y: -1000, radius: 140 };
  let isSectionVisible = true;
  let animationFrameId = null;

  // Observe visibility to pause when out of viewport
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isSectionVisible = entry.isIntersecting;
        if (isSectionVisible && !animationFrameId) {
          loop();
        } else if (!isSectionVisible && animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      });
    },
    { threshold: 0.05 }
  );

  const aboutSection = document.getElementById('about');
  if (aboutSection) observer.observe(aboutSection);

  window.addEventListener('resize', () => {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  });

  aboutSection?.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  aboutSection?.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  // Particle Stream Definition
  const particleCount = Math.min(Math.floor((width * height) / 9500), 100);
  const particles = [];

  class StreamParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -20;
      this.length = Math.random() * 26 + 18;
      this.speedY = Math.random() * 1.2 + 0.6;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.25 + 0.08;
      this.curve = Math.random() * 1.5 - 0.75;
      this.angle = Math.PI / 2;
    }

    update() {
      // Mouse interaction (gentle deflection)
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        const angle = Math.atan2(dy, dx);
        this.x -= Math.cos(angle) * force * 3;
        this.y -= Math.sin(angle) * force * 3;
      }

      this.y += this.speedY;
      this.x += Math.sin(this.y * 0.01) * this.curve + this.speedX;

      if (this.y > height + 40 || this.x < -40 || this.x > width + 40) {
        this.reset(false);
      }
    }

    draw() {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
      ctx.lineWidth = 1;
      ctx.lineCap = 'round';

      ctx.moveTo(this.x, this.y);
      const tailX = this.x - Math.sin(this.y * 0.01) * this.curve * 2 - this.speedX * 4;
      const tailY = this.y - this.length;
      ctx.lineTo(tailX, tailY);
      ctx.stroke();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new StreamParticle());
  }

  function loop() {
    if (!isSectionVisible) {
      animationFrameId = null;
      return;
    }

    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    animationFrameId = requestAnimationFrame(loop);
  }

  loop();
}
