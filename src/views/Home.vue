<template>
  <div class="home">
    <!-- Hero Section -->
    <section id="home" class="hero">
      <div class="hero-content">
        <h1 class="hero-title">Kristian Cross</h1>
        <p class="hero-subtitle">Web Developer | Creative Coder</p>
        <p class="hero-description">
          Building immersive digital experiences with HTML, CSS, JavaScript (ES6+/jQuery/Vue), Python, Django, FastAPI
        </p>
        <div class="hero-buttons">
          <button @click="goToProjects" class="btn btn-primary">View My Work</button>
          <button type="button" @click="scrollToSection('contact')" class="btn btn-secondary">Get In Touch</button>
        </div>
      </div>
      <div class="hero-background"></div>
    </section>

    <!-- About Section -->
    <section id="about" class="about">
      <div class="about-container">
        <h2>About Me</h2>
        <div class="about-content">
          <div class="about-text">
            <p class="about-intro">
              Passionate web developer with expertise in creating dynamic digital experiences.
              I specialize in modern web technologies and love bringing creative ideas to life.
            </p>
            <div class="skills-grid">
              <div class="skill-card">
                <h3>Frontend</h3>
                <p>Vue.js, jQuery, HTML5, CSS3, JavaScript (ES6+)</p>
              </div>
              <div class="skill-card">
                <h3>Backend</h3>
                <p>Python, FastAPI</p>
              </div>
              <div class="skill-card">
                <h3>Future Learning</h3>
                <p>PHP, Laravel, Nix</p>
              </div>
              <div class="skill-card">
                <h3>Testing</h3>
                <p>Django Unittest, Pytest, Vitest</p>
              </div>
              <div class="skill-card">
                <h3>Other</h3>
                <p>UI/UX Design, Performance Optimization, Responsive Design</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="contact">
      <div class="contact-container">
        <h2>Get In Touch</h2>
        <div class="contact-content">
          <div class="contact-info">
            <p>I'm always interested in new opportunities and exciting projects.</p>
            <div class="contact-links">
              <a href="https://github.com" target="_blank">GitHub</a>
              <a href="https://linkedin.com" target="_blank">LinkedIn</a>
              <a href="mailto:contact@example.com">Email</a>
            </div>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>

    <!-- Footer is handled by App.vue -->
  </div>
</template>

<script>
import ContactForm from '../components/ContactForm.vue'

export default {
  name: 'Home',
  components: {
    ContactForm
  },
  methods: {
    scrollToSection(sectionId) {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    },
    goToProjects() {
      // trigger vortex animation then navigate
      if (window._timeVortex) {
        window._timeVortex.triggerVortex(null, () => {
          this.$router.push('/projects');
        });
      } else {
        // fallback
        this.$router.push('/projects');
      }
    }
  }
}
</script>

<style scoped>
/* Home-specific styles */
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 8rem 2rem 4rem;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  z-index: 2;
}

.hero-title {
  font-size: 4rem;
  font-weight: 900;
  color: var(--tardis-bright);
  margin-bottom: 1rem;
  font-family: 'Orbitron', sans-serif;
  text-shadow: 0 0 30px rgba(0, 168, 255, 0.5);
}

.hero-subtitle {
  font-size: 1.5rem;
  color: var(--gallifrey-gold);
  margin-bottom: 2rem;
  font-weight: 500;
}

.hero-description {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: 3rem;
  line-height: 1.7;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-buttons {
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 40%, rgba(0, 168, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 70% 60%, rgba(212, 175, 55, 0.1) 0%, transparent 50%);
  z-index: 1;
}

.about {
  padding: 8rem 2rem;
  background: var(--quantum-dark);
}

.about-container {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.about h2 {
  font-size: 3rem;
  color: var(--tardis-bright);
  margin-bottom: 3rem;
  font-family: 'Orbitron', sans-serif;
}

.about-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  align-items: start;
}

.about-text {
  max-width: 800px;
  margin: 0 auto;
}

.about-intro {
  font-size: 1.2rem;
  line-height: 1.8;
  color: var(--text-secondary);
  margin-bottom: 3rem;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.skill-card {
  background: rgba(0, 168, 255, 0.1);
  border: 1px solid rgba(0, 168, 255, 0.3);
  border-radius: 10px;
  padding: 2rem;
  transition: all 0.3s ease;
}

.skill-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 168, 255, 0.3);
  border-color: var(--tardis-bright);
}

.skill-card h3 {
  color: var(--gallifrey-gold);
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.skill-card p {
  color: var(--text-secondary);
  line-height: 1.6;
}

.contact {
  padding: 8rem 2rem;
  background: linear-gradient(135deg, var(--gallifrey-dark) 0%, var(--quantum-dark) 100%);
}

.contact-container {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.contact h2 {
  font-size: 3rem;
  color: var(--tardis-bright);
  margin-bottom: 3rem;
  font-family: 'Orbitron', sans-serif;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;
  max-width: 1000px;
  margin: 0 auto;
}

.contact-info p {
  margin-bottom: 2rem;
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.contact-links {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.contact-links a {
  color: var(--tardis-bright);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  padding: 0.5rem 1rem;
  border: 1px solid var(--tardis-bright);
  border-radius: 5px;
}

.contact-links a:hover {
  color: var(--gallifrey-gold);
  border-color: var(--gallifrey-gold);
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.2rem;
  }

  .hero-description {
    font-size: 1rem;
  }

  .hero-buttons {
    gap: 1rem;
  }

  .about h2,
  .contact h2 {
    font-size: 2rem;
  }

  .skills-grid {
    grid-template-columns: 1fr;
  }

  .contact-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .contact-links {
    justify-content: center;
  }
}
</style>