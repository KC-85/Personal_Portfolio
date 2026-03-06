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
        <div class="logo">KC</div>
        <ul class="nav-links">
          <li><a href="#home" @click="scrollToSection('home')">Home</a></li>
          <li><a href="#about" @click="scrollToSection('about')">About</a></li>
          <li><a href="#contact" @click="scrollToSection('contact')">Contact</a></li>
        </ul>
        <div class="social-links">
          <a href="https://github.com" target="_blank">GitHub</a>
          <a href="https://linkedin.com" target="_blank">LinkedIn</a>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="hero">
      <div class="hero-content">
        <h1 class="hero-title">Kristian Cross</h1>
        <p class="hero-subtitle">Web Developer | Creative Coder</p>
        <p class="hero-description">
          Building immersive digital experiences with HTML, Vue, GSAP, and Three.js
        </p>
        <div class="hero-buttons">
          <button @click="scrollToSection('projects')" class="btn btn-primary">View My Work</button>
          <button @click="scrollToSection('contact')" class="btn btn-secondary">Get In Touch</button>
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
              Passionate web developer with expertise in creating immersive digital experiences.
              I specialize in modern web technologies and love bringing creative ideas to life.
            </p>
            <div class="skills-grid">
              <div class="skill-card">
                <h3>Frontend</h3>
                <p>Vue.js, React, HTML5, CSS3, JavaScript (ES6+)</p>
              </div>
              <div class="skill-card">
                <h3>Backend</h3>
                <p>Node.js, Express, Python, REST APIs</p>
              </div>
              <div class="skill-card">
                <h3>Tools & Animation</h3>
                <p>GSAP, Three.js, WebGL, Vite, Webpack</p>
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

    <!-- Projects Section -->
    <section id="projects" class="projects">
      <div class="projects-container">
        <h2>My Projects</h2>
        <div class="projects-filter">
          <button
            v-for="category in categories"
            :key="category"
            @click="activeCategory = category"
            :class="['filter-btn', { active: activeCategory === category }]"
          >
            {{ category }}
          </button>
        </div>
        <div class="projects-grid">
          <div
            v-for="project in filteredProjects"
            :key="project.id"
            class="project-card"
            @click="openProject(project)"
          >
            <div class="project-image">
              <div class="project-placeholder">
                <span>{{ project.icon }}</span>
              </div>
            </div>
            <div class="project-info">
              <h3>{{ project.title }}</h3>
              <p>{{ project.description }}</p>
              <div class="project-tags">
                <span v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</span>
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

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2026 Kristian Cross. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import ContactForm from './components/ContactForm.vue'

export default {
  name: 'App',
  components: {
    ContactForm
  },
  data() {
    return {
      showLoader: true,
      activeCategory: 'All',
      categories: ['All', 'Vue.js', 'Three.js', 'WebGL', 'Animation'],
      projects: [
        {
          id: 1,
          title: 'Interactive 3D Portfolio',
          description: 'A stunning 3D portfolio built with Three.js and Vue.js',
          icon: '🚀',
          category: 'Three.js',
          tags: ['Three.js', 'Vue.js', 'WebGL']
        },
        {
          id: 2,
          title: 'Vue.js Dashboard',
          description: 'Modern admin dashboard with real-time data visualization',
          icon: '📊',
          category: 'Vue.js',
          tags: ['Vue.js', 'Chart.js', 'API']
        },
        {
          id: 3,
          title: 'GSAP Animation Library',
          description: 'Custom animation library for smooth web interactions',
          icon: '✨',
          category: 'Animation',
          tags: ['GSAP', 'JavaScript', 'Animation']
        },
        {
          id: 4,
          title: 'WebGL Particle System',
          description: 'GPU-accelerated particle effects for modern web apps',
          icon: '🌟',
          category: 'WebGL',
          tags: ['WebGL', 'Shaders', 'Performance']
        },
        {
          id: 5,
          title: 'Vue Component Library',
          description: 'Reusable Vue components for rapid development',
          icon: '🧩',
          category: 'Vue.js',
          tags: ['Vue.js', 'Components', 'Design System']
        }
      ]
    }
  },
  computed: {
    filteredProjects() {
      if (this.activeCategory === 'All') {
        return this.projects
      }
      return this.projects.filter(project => project.category === this.activeCategory)
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
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    },
    openProject(project) {
      // For now, just log the project. In a real app, this would navigate to project detail
      console.log('Opening project:', project.title)
      // You could implement a modal or route to project detail page
    }
  }
}
</script>

<style scoped>
/* Component-specific styles can go here */
.projects-filter {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border: 2px solid var(--tardis-bright);
  background: transparent;
  color: var(--tardis-bright);
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
}

.filter-btn:hover,
.filter-btn.active {
  background: var(--tardis-bright);
  color: var(--quantum-dark);
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.project-card {
  background: rgba(0, 168, 255, 0.1);
  border: 1px solid rgba(0, 168, 255, 0.3);
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 168, 255, 0.3);
}

.project-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.project-placeholder {
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, rgba(0, 168, 255, 0.1), rgba(212, 175, 55, 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  border-radius: 5px 5px 0 0;
}

.project-info {
  padding: 1.5rem;
}

.project-info h3 {
  color: var(--tardis-bright);
  margin-bottom: 0.5rem;
}

.project-info p {
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: rgba(212, 175, 55, 0.2);
  color: var(--gallifrey-gold);
  padding: 0.25rem 0.5rem;
  border-radius: 15px;
  font-size: 0.8rem;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;
}

.contact-info p {
  margin-bottom: 2rem;
  color: var(--text-secondary);
}

.contact-links {
  display: flex;
  gap: 2rem;
}

.contact-links a {
  color: var(--tardis-bright);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.contact-links a:hover {
  color: var(--gallifrey-gold);
}

@media (max-width: 768px) {
  .contact-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style>