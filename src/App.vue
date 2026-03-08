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
          <li>
            <button type="button" class="nav-link-button" @click="scrollToSection('contact')">Contact</button>
          </li>
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
import { nextTick } from 'vue'

export default {
  name: 'App',
  data() {
    return {
      showLoader: true
    }
  },
  mounted() {
    const loaderDelay = typeof navigator !== 'undefined' && navigator.webdriver ? 0 : 5000

    // Hide loader after the intro finishes, or immediately under browser automation.
    setTimeout(() => {
      this.showLoader = false
    }, loaderDelay)
  },
  methods: {
    async scrollToSection(sectionId) {
      if (this.$route.name !== 'Home') {
        await this.$router.push('/')
        await nextTick()
      }

      requestAnimationFrame(() => {
        const element = document.getElementById(sectionId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      })
    }
  }
}
</script>