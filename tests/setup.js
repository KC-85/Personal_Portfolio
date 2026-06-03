import { vi } from 'vitest'

if (typeof window !== 'undefined') {
  // Mock TimeVortex with state tracking to match actual behavior
  window._timeVortex = {
    isAnimating: false,
    animationDuration: 2500,
    resetDelay: 300,
    navigationTimeout: null,
    cleanupTimeout: null,

    triggerVortex(callback) {
      // Prevent multiple simultaneous animations
      if (this.isAnimating) {
        console.warn('Vortex animation already in progress, ignoring trigger');
        return;
      }

      if (callback && typeof callback !== 'function') {
        console.error('triggerVortex callback must be a function');
        return;
      }

      this.isAnimating = true;

      // Execute callback after animation duration
      this.navigationTimeout = setTimeout(() => {
        if (typeof callback === 'function') {
          callback();
        }

        // Schedule reset
        this.cleanupTimeout = setTimeout(() => {
          this.resetVortex();
        }, this.resetDelay);
      }, this.animationDuration);
    },

    resetVortex() {
      this.isAnimating = false;
      if (this.navigationTimeout) {
        clearTimeout(this.navigationTimeout);
        this.navigationTimeout = null;
      }
      if (this.cleanupTimeout) {
        clearTimeout(this.cleanupTimeout);
        this.cleanupTimeout = null;
      }
    },

    destroy() {
      this.resetVortex();
    }
  };
}

if (typeof Element !== 'undefined' && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = vi.fn()
}