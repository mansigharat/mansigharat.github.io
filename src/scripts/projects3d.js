/**
 * 3D CARD PERSPECTIVE QUEUE (Selected Projects)
 * Cards fan out in 3D perspective and advance with scroll or numbered pill clicks
 */
export const PROJECTS_DATA = [
  {
    id: 1,
    tag: "AI & Agentic Engineering",
    title: "Competitor Radar",
    subtitle: "AI Competitive Intelligence System",
    badge: "4th Rank // Lyzr Weekly Challenge #1",
    tech: ["Lyzr Agent Studio", "Multi-Agent System", "LLM APIs", "Prompt Engineering"],
    description: "An automated intelligence system engineered for fintech businesses that orchestrates three specialized agents to uncover market competitors, analyze positioning, and generate live sales battlecards.",
    backendRole: "Multi-agent task orchestration, prompt chaining pipelines, and schema-enforced market research synthesis.",
    repoUrl: "https://github.com/mansigharat/",
    cardNum: "01",
    accentShape: "cobalt"
  },
  {
    id: 2,
    tag: "Full-Stack & Frontend Lead",
    title: "RuralCare",
    subtitle: "Healthcare Access Platform",
    badge: "Team Lead // Smart India Hackathon",
    tech: ["React.js", "JavaScript", "REST APIs", "HTML5/CSS3"],
    description: "Led the development team to build a rural healthcare platform addressing medical access inequality. My primary focus was architecting the frontend and integrating real-time healthcare APIs.",
    backendRole: "Clean RESTful API data integration, dynamic clinic status synchronization, and responsive appointment dispatching.",
    repoUrl: "https://github.com/mansigharat/",
    cardNum: "02",
    accentShape: "yellow"
  },
  {
    id: 3,
    tag: "Backend & Agentic AI",
    title: "Patient Health Assistant",
    subtitle: "FastAPI Health Agent",
    badge: "Backend & AI Architecture",
    tech: ["Python", "FastAPI", "PostgreSQL / SQLite", "Gemini API", "Pydantic"],
    description: "An AI-powered healthcare assistant layered onto a FastAPI patient management system to query medical records and assess patient symptoms with conversational intelligence.",
    backendRole: "Asynchronous FastAPI endpoints, Pydantic schema validation, relational database queries, and structured LLM tool calling.",
    repoUrl: "https://github.com/mansigharat/",
    cardNum: "03",
    accentShape: "vermilion"
  },
  {
    id: 4,
    tag: "Backend & Automation",
    title: "AI Resume Screener",
    subtitle: "Candidate Scoring Service",
    badge: "API & LLM Pipeline",
    tech: ["Python", "FastAPI", "LLM APIs", "Pydantic", "REST APIs"],
    description: "An automated backend evaluation service that parses developer resumes, matches qualifications against job criteria, and outputs standardized scores (0–100) with detailed feedback.",
    backendRole: "Schema-enforced JSON validation, structured scoring heuristics, and resilient error-handling API architecture.",
    repoUrl: "https://github.com/mansigharat/",
    cardNum: "04",
    accentShape: "cobalt"
  }
];

export function initProjects3D() {
  const stage = document.querySelector('.projects-3d-stage');
  const navContainer = document.querySelector('.project-queue-nav');
  const queueIndicator = document.querySelector('.projects-queue-indicator');
  const titleEl = document.querySelector('.project-detail-title');
  const techEl = document.querySelector('.project-detail-tech');
  const descEl = document.querySelector('.project-detail-desc');
  const backendBoxEl = document.querySelector('.project-backend-role-box span');
  const repoLinkEl = document.querySelector('.project-repo-link');

  if (!stage) return;

  let activeIndex = 0;
  const cards = [];

  // Render cards in stage
  stage.innerHTML = '';
  PROJECTS_DATA.forEach((proj, idx) => {
    const card = document.createElement('div');
    card.className = 'project-queue-card';
    card.setAttribute('data-index', idx);

    card.innerHTML = `
      <div class="project-card-art">
        <div class="art-shape art-shape-${proj.accentShape}"></div>
        <div class="art-shape art-shape-yellow" style="opacity: 0.6"></div>
      </div>
      <div>
        <span class="project-card-tag">${proj.tag}</span>
        <h4 style="font-family: var(--font-display); font-size: 1.5rem; margin-top: 0.3rem;">${proj.title}</h4>
      </div>
      <div class="project-card-footer">
        <span class="project-card-num">${proj.cardNum}</span>
        <span class="mono-label" style="color: var(--text-on-dark-muted);">${proj.badge}</span>
      </div>
    `;

    card.addEventListener('click', () => {
      setActiveProject(idx);
    });

    stage.appendChild(card);
    cards.push(card);
  });

  // Render numbered nav pills
  if (navContainer) {
    navContainer.innerHTML = '';
    PROJECTS_DATA.forEach((_, idx) => {
      const btn = document.createElement('button');
      btn.className = `queue-nav-btn ${idx === 0 ? 'active' : ''}`;
      btn.textContent = `0${idx + 1}`;
      btn.setAttribute('aria-label', `View project ${idx + 1}`);
      btn.addEventListener('click', () => setActiveProject(idx));
      navContainer.appendChild(btn);
    });
  }

  function updateCardTransforms() {
    cards.forEach((card, i) => {
      const diff = i - activeIndex;

      if (diff === 0) {
        // Active card: centered, front
        card.style.transform = 'translate3d(0, 0, 0) scale(1) rotate(0deg)';
        card.style.opacity = '1';
        card.style.zIndex = '10';
        card.style.pointerEvents = 'auto';
        card.style.filter = 'none';
      } else if (diff > 0 && diff <= 3) {
        // Cards queued behind
        const translateY = diff * 22;
        const translateZ = -diff * 60;
        const scale = 1 - diff * 0.07;
        const rotate = diff * 2.5;
        card.style.transform = `translate3d(${diff * 18}px, ${translateY}px, ${translateZ}px) scale(${scale}) rotate(${rotate}deg)`;
        card.style.opacity = `${1 - diff * 0.25}`;
        card.style.zIndex = `${10 - diff}`;
        card.style.pointerEvents = 'auto';
        card.style.filter = 'brightness(0.7)';
      } else {
        // Cards already revealed / hidden behind or far in queue
        card.style.transform = 'translate3d(-40px, -30px, -150px) scale(0.85) rotate(-6deg)';
        card.style.opacity = '0';
        card.style.zIndex = '0';
        card.style.pointerEvents = 'none';
      }
    });

    // Update indicator
    if (queueIndicator) {
      queueIndicator.textContent = `QUEUE [0${activeIndex + 1} / 0${PROJECTS_DATA.length}] — REVEALED`;
    }

    // Update nav pills
    const navBtns = navContainer?.querySelectorAll('.queue-nav-btn');
    navBtns?.forEach((btn, idx) => {
      if (idx === activeIndex) btn.classList.add('active');
      else btn.classList.remove('active');
    });
  }

  function setActiveProject(index) {
    activeIndex = (index + PROJECTS_DATA.length) % PROJECTS_DATA.length;
    const proj = PROJECTS_DATA[activeIndex];

    updateCardTransforms();

    if (titleEl) titleEl.textContent = proj.title;
    if (descEl) descEl.textContent = proj.description;
    if (backendBoxEl) backendBoxEl.textContent = proj.backendRole;
    if (repoLinkEl) repoLinkEl.href = proj.repoUrl;

    if (techEl) {
      techEl.innerHTML = proj.tech.map((t) => `<span class="tag-pill">${t}</span>`).join('');
    }
  }

  // Mouse wheel or drag advancement inside 3D stage
  let touchStartX = 0;
  stage.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  stage.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) setActiveProject(activeIndex + 1);
      else setActiveProject(activeIndex - 1);
    }
  }, { passive: true });

  // Initialize first project
  setActiveProject(0);
}
