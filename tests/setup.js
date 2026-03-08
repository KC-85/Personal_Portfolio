import { vi } from 'vitest'

if (typeof window !== 'undefined') {
  window._timeVortex = {
    triggerVortex(_url, callback) {
      if (typeof callback === 'function') {
        callback()
      }
    }
  }
}

if (typeof Element !== 'undefined' && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = vi.fn()
}