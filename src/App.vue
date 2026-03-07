<template>
  <div id="app">
    <!-- Spaceship Loader -->
    <div id="spaceship-loader" v-if="showLoader">
      <div class="loading-text">LOADING</div>
      <div class="spaceship-cube">
        <div class="face front"></div>
        <div class="face back"></div>
        <div class="face right"></div>
        <div class="face left"></div>
        <div class="face top"></div>
        <div class="face bottom"></div>
      </div>
    </div>

    <!-- Navigation Bar -->
    <nav class="navbar">
      <div class="nav-container">
        <router-link to="/" class="logo">KC</router-link>
        <ul class="nav-links">
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/projects">Projects</router-link></li>
          <li><a href="#contact" @click="scrollToSection('contact')">Contact</a></li>
        </ul>
        <div class="social-links">
          <a href="https://github.com" target="_blank">GitHub</a>
          <a href="https://linkedin.com" target="_blank">LinkedIn</a>
        </div>
      </div>
    </nav>

    <!-- Router View -->
    <router-view />

    <!-- Footer (only show on home page) -->
    <footer v-if="$route.name === 'Home'" class="footer">
      <div class="footer-content">
        <p>&copy; 2026 Kristian Cross. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      showLoader: true
    }
  },
  mounted() {
    // Hide loader after 5 seconds
    setTimeout(() => {
      this.showLoader = false
    }, 5000)
  },
  methods: {
    scrollToSection(sectionId) {
      // Only scroll if we're on the home page
      if (this.$route.name === 'Home') {
        const element = document.getElementById(sectionId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
  }
}
</script>

<style>
/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

/* Color Variables */
:root {
  --tardis-blue: #003B6F;
  --tardis-light: #0055CC;
  --tardis-bright: #00A8FF;
  --gallifrey-gold: #D4AF37;
  --gallifrey-dark: #0a0e27;
  --quantum-dark: #050812;
  --temporal-purple: #6B2D5C;
  --energy-cyan: #00FFFF;
  --danger-red: #FF0040;

  --text-primary: #FFFFFF;
  --text-secondary: #B0B0B0;
  --text-muted: #808080;

  --border-color: rgba(0, 168, 255, 0.3);
  --glow-color: rgba(0, 168, 255, 0.6);
}

body {
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, var(--quantum-dark) 0%, var(--gallifrey-dark) 50%, var(--quantum-dark) 100%);
  color: var(--text-primary);
  line-height: 1.6;
  overflow-x: hidden;
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  background: var(--quantum-dark);
}

::-webkit-scrollbar-thumb {
  background: var(--tardis-bright);
  border-radius: 6px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--gallifrey-gold);
}

/* Navigation */
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  background: rgba(5, 8, 18, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
  z-index: 1000;
  padding: 1rem 0;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
}

.logo {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--tardis-bright);
  text-decoration: none;
  transition: color 0.3s ease;
}

.logo:hover {
  color: var(--gallifrey-gold);
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-links a {
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  position: relative;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: var(--tardis-bright);
}

.nav-links a.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--tardis-bright);
  border-radius: 1px;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-links a {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.3s ease;
}

.social-links a:hover {
  color: var(--tardis-bright);
}

/* Button Styles */
.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
  font-family: 'Inter', sans-serif;
}

.btn-primary {
  background: var(--tardis-bright);
  color: var(--quantum-dark);
}

.btn-primary:hover {
  background: var(--gallifrey-gold);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 168, 255, 0.4);
}

.btn-secondary {
  background: transparent;
  color: var(--tardis-bright);
  border: 2px solid var(--tardis-bright);
}

.btn-secondary:hover {
  background: var(--tardis-bright);
  color: var(--quantum-dark);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 168, 255, 0.4);
}

/* Footer */
.footer {
  background: rgba(5, 8, 18, 0.9);
  padding: 2rem 0;
  text-align: center;
  border-top: 1px solid var(--border-color);
}

.footer-content p {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 768px) {
  .nav-container {
    padding: 0 1rem;
  }

  .nav-links {
    gap: 1rem;
  }

  .nav-links a {
    font-size: 0.9rem;
  }

  .logo {
    font-size: 1.2rem;
  }
}
</style>