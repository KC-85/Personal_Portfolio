// Time Vortex Transition Effect
// Vanilla CSS animations + SVG rings (no Three.js or GSAP required)

class TimeVortex {
  constructor() {
    this.isAnimating = false;
    this.animationDuration = 2500;
    this.resetDelay = 300;
    this.navigationTimeout = null;
    this.cleanupTimeout = null;
    
    // Track event listeners for proper cleanup
    this.eventListeners = [];
    
    this.init();
  }

  init() {
    // Only initialize if DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.createVortexContainer();
        this.attachProjectLinkListeners();
      });
    } else {
      this.createVortexContainer();
      this.attachProjectLinkListeners();
    }
  }

  attachEventDelegation() {
    const handler = (e) => {
      const link = e.target.closest('a[href*="project"]');
      if (link && link.getAttribute('href').includes('project')) {
        e.preventDefault();
        // Don't navigate via location.href - emit event instead
        const event = new CustomEvent('vortex:project-click', {
          detail: { href: link.getAttribute('href') }
        });
        document.dispatchEvent(event);
      }
    };
    
    document.addEventListener('click', handler);
    this.eventListeners.push({ type: 'click', handler, target: document });
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
    const handler = (e) => {
      const href = e.currentTarget.getAttribute('href');
      if (href && href.includes('project')) {
        e.preventDefault();
        // Emit event instead of triggering vortex directly
        const event = new CustomEvent('vortex:project-click', {
          detail: { href }
        });
        document.dispatchEvent(event);
      }
    };
    
    const projectLinks = document.querySelectorAll('a[href*="project"]');
    projectLinks.forEach(link => {
      link.addEventListener('click', handler);
      this.eventListeners.push({ type: 'click', handler, target: link });
    });
  }

  triggerVortex(callback) {
    // Prevent multiple simultaneous animations
    if (this.isAnimating) {
      console.warn('Vortex animation already in progress, ignoring trigger');
      return;
    }

    // Validate callback is provided or a function
    if (callback && typeof callback !== 'function') {
      console.error('triggerVortex callback must be a function');
      return;
    }

    const container = document.getElementById('vortex-container');
    const flash = document.getElementById('vortex-flash');
    const particlesContainer = document.getElementById('vortex-particles');

    // Graceful fallback if elements don't exist
    if (!container || !flash || !particlesContainer) {
      console.warn('Vortex DOM elements not found');
      if (typeof callback === 'function') {
        callback();
      }
      return;
    }

    this.isAnimating = true;

    // Clear any pending timeouts to ensure fresh state
    this.clearPendingTimeouts();

    // Clear previous animation state
    particlesContainer.innerHTML = '';
    this.clearVortexRings(container);
    this.resetFlashAnimation(flash);

    // Activate vortex animation
    container.classList.add('active');
    flash.classList.add('active');

    // Generate visual effects
    this.generateParticles(particlesContainer);
    this.generateEnergyWaves(container);
    this.createVortexRings(container);

    // Execute callback and reset after animation completes
    this.navigationTimeout = setTimeout(() => {
      if (typeof callback === 'function') {
        callback();
      }

      // Schedule cleanup with delay
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
    void flash.offsetWidth; // Trigger reflow
  }

  clearPendingTimeouts() {
    if (this.navigationTimeout) {
      clearTimeout(this.navigationTimeout);
      this.navigationTimeout = null;
    }
    if (this.cleanupTimeout) {
      clearTimeout(this.cleanupTimeout);
      this.cleanupTimeout = null;
    }
  }

  resetVortex() {
    const container = document.getElementById('vortex-container');
    const flash = document.getElementById('vortex-flash');
    const particlesContainer = document.getElementById('vortex-particles');
    const wavesContainer = document.getElementById('vortex-energy-waves');

    // Remove active states
    if (container) {
      container.classList.remove('active');
      this.clearVortexRings(container);
    }

    if (flash) {
      flash.classList.remove('active');
    }

    // Clear particle elements
    if (particlesContainer) {
      particlesContainer.innerHTML = '';
    }

    // Clear wave elements
    if (wavesContainer) {
      wavesContainer.innerHTML = '';
    }

    // Reset state
    this.isAnimating = false;
    this.clearPendingTimeouts();
  }

  /**
   * Destroy the vortex instance and clean up all event listeners
   * Call this when unmounting from the app or before recreation
   */
  destroy() {
    // Clear any pending animations
    this.resetVortex();
    this.clearPendingTimeouts();

    // Remove all tracked event listeners
    this.eventListeners.forEach(({ type, handler, target }) => {
      target.removeEventListener(type, handler);
    });
    this.eventListeners = [];

    // Remove DOM elements if they exist
    const container = document.getElementById('vortex-container');
    const flash = document.getElementById('vortex-flash');
    if (container) container.remove();
    if (flash) flash.remove();

    console.log('TimeVortex instance destroyed and cleaned up');
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
    // Expose instance so Vue components can trigger the vortex via callbacks
    window._timeVortex = new TimeVortex();
  });
}

// export for module use
export { TimeVortex };
