<template>
  <div class="projects-page">
    <!-- Projects Header -->
    <section class="project-header">
      <div class="back-link">
        <router-link to="/">← Back to Home</router-link>
      </div>
      <div class="project-hero">
        <h1 class="project-title">My Projects</h1>
        <p class="project-subtitle">A showcase of web development work</p>
      </div>
    </section>

    <!-- Projects Grid -->
    <section class="project-content">
      <div class="project-container">
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
          <router-link
            v-for="project in filteredProjects"
            :key="project.id"
            :to="`/projects/${project.id}`"
            class="project-card-link"
            @click.prevent="openProject(project.id)"
          >
            <div class="project-card">
              <div class="project-image">
                <div class="project-placeholder">
                  <span>{{ project.title }}</span>
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
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Projects',
  data() {
    return {
      activeCategory: 'All',
      categories: ['All', 'Vue.js', 'Three.js', 'WebGL', 'Animation'],
      projects: [
        {
          id: 1,
          title: 'Interactive 3D Portfolio',
          description: 'A stunning 3D portfolio built with Three.js and Vue.js featuring interactive elements and smooth animations.',
          category: 'Three.js',
          tags: ['Three.js', 'Vue.js', 'WebGL', '3D Graphics'],
          longDescription: 'This project showcases advanced 3D web development techniques using Three.js and Vue.js. Features include interactive camera controls, particle systems, and optimized rendering for smooth performance across devices.',
          technologies: ['Three.js', 'Vue.js', 'WebGL', 'JavaScript', 'GLSL Shaders'],
          features: ['Interactive 3D scenes', 'Particle animations', 'Responsive design', 'Performance optimization'],
          githubUrl: 'https://github.com',
          liveUrl: 'https://example.com'
        },
        {
          id: 2,
          title: 'Vue.js Dashboard',
          description: 'Modern admin dashboard with real-time data visualization and interactive charts.',
          category: 'Vue.js',
          tags: ['Vue.js', 'Chart.js', 'API', 'Dashboard'],
          longDescription: 'A comprehensive admin dashboard built with Vue.js featuring real-time data updates, interactive charts, and a responsive design. Includes user authentication, data management, and analytics features.',
          technologies: ['Vue.js', 'Chart.js', 'Axios', 'Vue Router', 'Pinia'],
          features: ['Real-time data', 'Interactive charts', 'User authentication', 'Responsive layout'],
          githubUrl: 'https://github.com',
          liveUrl: 'https://example.com'
        },
        {
          id: 3,
          title: 'GSAP Animation Library',
          description: 'Custom animation library for smooth web interactions and micro-animations.',
          category: 'Animation',
          tags: ['GSAP', 'JavaScript', 'Animation', 'Performance'],
          longDescription: 'A custom animation library built on top of GSAP (GreenSock Animation Platform) providing reusable animation components and smooth transitions for web applications.',
          technologies: ['GSAP', 'JavaScript', 'CSS', 'SVG', 'Canvas'],
          features: ['Smooth animations', 'Reusable components', 'Performance optimized', 'Cross-browser support'],
          githubUrl: 'https://github.com',
          liveUrl: 'https://example.com'
        },
        {
          id: 4,
          title: 'WebGL Particle System',
          description: 'GPU-accelerated particle effects for modern web applications.',
          category: 'WebGL',
          tags: ['WebGL', 'Shaders', 'Performance', '3D'],
          longDescription: 'High-performance particle system built with WebGL and custom shaders. Features include dynamic particle generation, physics simulation, and optimized rendering techniques.',
          technologies: ['WebGL', 'GLSL', 'JavaScript', 'Shaders', 'WebGL2'],
          features: ['GPU acceleration', 'Custom shaders', 'Physics simulation', 'Performance monitoring'],
          githubUrl: 'https://github.com',
          liveUrl: 'https://example.com'
        },
        {
          id: 5,
          title: 'Vue Component Library',
          description: 'Reusable Vue components for rapid development and consistent UI.',
          category: 'Vue.js',
          tags: ['Vue.js', 'Components', 'Design System', 'UI'],
          longDescription: 'A comprehensive component library built with Vue.js featuring reusable UI components, consistent design system, and accessibility features for rapid application development.',
          technologies: ['Vue.js', 'SCSS', 'Storybook', 'Jest', 'TypeScript'],
          features: ['Reusable components', 'Design system', 'Accessibility', 'Testing suite'],
          githubUrl: 'https://github.com',
          liveUrl: 'https://example.com'
        }
      ]
    }
  },
  methods: {
    openProject(id) {
      if (window._timeVortex) {
        window._timeVortex.triggerVortex(null, () => {
          this.$router.push(`/projects/${id}`)
        })
      } else {
        this.$router.push(`/projects/${id}`)
      }
    }
  },
  computed: {
    filteredProjects() {
      if (this.activeCategory === 'All') {
        return this.projects
      }
      return this.projects.filter(project => project.category === this.activeCategory)
    }
  }
}
</script>

<style scoped>
.project-header {
  padding: 4rem 2rem 2rem;
  text-align: center;
  background: linear-gradient(135deg, var(--quantum-dark), var(--gallifrey-dark));
}

.back-link {
  text-align: left;
  margin-bottom: 2rem;
}

.back-link a {
  color: var(--tardis-bright);
  text-decoration: none;
  font-weight: 500;
}

.back-link a:hover {
  color: var(--gallifrey-gold);
}

.project-hero h1 {
  font-size: 3rem;
  color: var(--tardis-bright);
  margin-bottom: 1rem;
  font-family: 'Orbitron', sans-serif;
}

.project-hero p {
  font-size: 1.2rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
}

.project-content {
  padding: 4rem 2rem;
  background: var(--quantum-dark);
}

.project-container {
  max-width: 1200px;
  margin: 0 auto;
}

.projects-filter {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid var(--tardis-bright);
  background: transparent;
  color: var(--tardis-bright);
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
}

.filter-btn:hover,
.filter-btn.active {
  background: var(--tardis-bright);
  color: var(--quantum-dark);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 168, 255, 0.3);
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.project-card-link {
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s ease;
}

.project-card-link:hover {
  transform: translateY(-5px);
}

.project-card {
  background: rgba(0, 168, 255, 0.1);
  border: 1px solid rgba(0, 168, 255, 0.3);
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
}

.project-card:hover {
  box-shadow: 0 10px 30px rgba(0, 168, 255, 0.3);
  border-color: var(--tardis-bright);
}

.project-image {
  height: 200px;
  overflow: hidden;
}

.project-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(0, 168, 255, 0.1), rgba(212, 175, 55, 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--tardis-bright);
  font-family: 'Orbitron', sans-serif;
}

.project-info {
  padding: 1.5rem;
}

.project-info h3 {
  color: var(--tardis-bright);
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
}

.project-info p {
  color: var(--text-secondary);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: rgba(212, 175, 55, 0.2);
  color: var(--gallifrey-gold);
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }

  .project-hero h1 {
    font-size: 2rem;
  }

  .projects-filter {
    gap: 0.5rem;
  }

  .filter-btn {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
}
</style>