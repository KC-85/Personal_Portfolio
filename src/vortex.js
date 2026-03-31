// Time Vortex Transition Effect

class TimeVortex {
  constructor() {
    this.isAnimating = false;
    this.animationDuration = 2500;
    this.resetDelay = 300;
    this.cleanupTimeout = null;
    this.init();
  }

  init() {
    this.createVortexContainer();
    this.attachProjectLinkListeners();
    // Use event delegation for dynamic links
    this.attachEventDelegation();
  }

  attachEventDelegation() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href*="project"]');
      if (link && link.getAttribute('href').includes('project')) {
        e.preventDefault();
        const url = link.getAttribute('href');
        this.triggerVortex(url);
      }
    });
  }

  createVortexContainer() {
    const container = document.createElement('div');
    container.className = 'vortex-container';
    container.id = 'vortex-container';
    container.innerHTML = `
      <div class="vortex-scanner"></div>
      <div class="vortex-particles" id="vortex-particles"></div>
      <div class="vortex-energy-waves" id="vortex-energy-waves"></div>
      <div class="vortex-center">
        <div class="vortex-center-glow"></div>
      </div>
      <div class="vortex-text">
        <h2>Entering Time Vortex...</h2>
      </div>
    `;
    document.body.appendChild(container);

    // Create flash element
    const flash = document.createElement('div');
    flash.className = 'vortex-flash';
    flash.id = 'vortex-flash';
    document.body.appendChild(flash);
  }

  attachProjectLinkListeners() {
    // Get all project links - more flexible selector
    const projectLinks = document.querySelectorAll(
      'a[href*="project"]'
    );

    projectLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        // Only prevent default if it's actually a project page link
        const href = link.getAttribute('href');
        if (href && href.includes('project')) {
          e.preventDefault();
          this.triggerVortex(href);
        }
      });
    });
  }

  triggerVortex(url, callback) {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const container = document.getElementById('vortex-container');
    const flash = document.getElementById('vortex-flash');
    const particlesContainer = document.getElementById('vortex-particles');

    if (!container || !flash || !particlesContainer) {
      this.isAnimating = false;
      if (typeof callback === 'function') {
        callback();
      } else if (url) {
        window.location.href = url;
      }
      return;
    }

    clearTimeout(this.cleanupTimeout);

    // Clear previous particles
    particlesContainer.innerHTML = '';
    this.clearVortexRings(container);
    this.resetFlashAnimation(flash);

    // Activate vortex
    container.classList.add('active');
    flash.classList.add('active');

    // Generate particles
    this.generateParticles(particlesContainer);

    // Generate energy waves
    this.generateEnergyWaves(container);

    // Create SVG rings for visual effect
    this.createVortexRings(container);

    // Navigate after animation (either callback or url)
    setTimeout(() => {
      if (typeof callback === 'function') {
        callback();
      } else if (url) {
        window.location.href = url;
      }

      this.cleanupTimeout = setTimeout(() => {
        this.resetVortex();
      }, this.resetDelay);
    }, this.animationDuration);
  }

  clearVortexRings(container) {
    container.querySelectorAll('.vortex-svg').forEach((ringSet) => {
      ringSet.remove();
    });
  }

  resetFlashAnimation(flash) {
    flash.classList.remove('active');
    void flash.offsetWidth;
  }

  resetVortex() {
    const container = document.getElementById('vortex-container');
    const flash = document.getElementById('vortex-flash');
    const particlesContainer = document.getElementById('vortex-particles');
    const wavesContainer = document.getElementById('vortex-energy-waves');

    if (container) {
      container.classList.remove('active');
      this.clearVortexRings(container);
    }

    if (flash) {
      flash.classList.remove('active');
    }

    if (particlesContainer) {
      particlesContainer.innerHTML = '';
    }

    if (wavesContainer) {
      wavesContainer.innerHTML = '';
    }

    this.isAnimating = false;
    this.cleanupTimeout = null;
  }

  generateParticles(container) {
    const particleCount = 100;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';

      // Random size
      const size = Math.random() * 6 + 2;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';

      // Start from center and spiral outward
      const angle = Math.random() * Math.PI * 2;
      const startRadius = 10 + Math.random() * 50;
      particle.style.left = centerX + Math.cos(angle) * startRadius + 'px';
      particle.style.top = centerY + Math.sin(angle) * startRadius + 'px';

      // Spiral trajectory outward
      const endRadius = 800 + Math.random() * 400;
      const endAngle = angle + (Math.random() - 0.5) * 2; // Slight curve
      const tx = Math.cos(endAngle) * endRadius;
      const ty = Math.sin(endAngle) * endRadius;

      particle.style.setProperty('--tx', tx + 'px');
      particle.style.setProperty('--ty', ty + 'px');

      // Random color (TARDIS blue, cyan, gold)
      const colors = ['rgba(0, 168, 255, 0.9)', 'rgba(0, 255, 255, 0.7)', 'rgba(212, 175, 55, 0.6)', 'rgba(255, 255, 255, 0.8)'];
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];

      // Random animation delay and duration
      particle.style.animationDelay = (Math.random() * 0.8) + 's';
      particle.style.animationDuration = (1.2 + Math.random() * 0.8) + 's';

      container.appendChild(particle);
    }
  }

  createVortexRings(container) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 ' + window.innerWidth + ' ' + window.innerHeight);
    svg.setAttribute('width', window.innerWidth);
    svg.setAttribute('height', window.innerHeight);
    svg.setAttribute('class', 'vortex-svg');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Create concentric circles with varying opacity and speed
    for (let i = 1; i <= 8; i++) {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', centerX);
      circle.setAttribute('cy', centerY);
      circle.setAttribute('r', 50 * i);
      circle.setAttribute('fill', 'none');
      circle.setAttribute('stroke', 'rgba(0, 168, 255, ' + (0.6 - i * 0.06) + ')');
      circle.setAttribute('stroke-width', '3');
      circle.setAttribute('class', 'vortex-ring');
      circle.style.animationDelay = (i * 0.08) + 's';
      circle.style.animationDuration = (1.5 + i * 0.1) + 's';

      svg.appendChild(circle);
    }

    // Add spiral paths for more vortex effect
    for (let i = 0; i < 3; i++) {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const radius = 100 + i * 150;
      const spiralPath = `M ${centerX + radius} ${centerY} A ${radius} ${radius} 0 1 1 ${centerX - radius} ${centerY} A ${radius - 50} ${radius - 50} 0 1 0 ${centerX + radius - 50} ${centerY}`;
      path.setAttribute('d', spiralPath);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', 'rgba(0, 255, 255, ' + (0.4 - i * 0.1) + ')');
      path.setAttribute('stroke-width', '2');
      path.setAttribute('class', 'vortex-spiral-path');
      path.style.animationDelay = (i * 0.2) + 's';

      svg.appendChild(path);
    }

    container.appendChild(svg);
  }

  generateEnergyWaves(container) {
    const wavesContainer = document.getElementById('vortex-energy-waves');

    if (!wavesContainer) {
      return;
    }

    wavesContainer.innerHTML = '';
  }
}

// Initialize on page load
  if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
      // expose instance so other scripts can trigger the vortex
      window._timeVortex = new TimeVortex();
    });
  }

// export for module use
export { TimeVortex };
