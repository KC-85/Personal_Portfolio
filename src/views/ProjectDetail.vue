<template>
  <div class="project-detail">
    <!-- Project Header -->
    <section class="project-header">
      <div class="back-link">
        <router-link to="/projects">← Back to Projects</router-link>
      </div>
      <div class="project-hero">
        <h1 class="project-title">{{ project.title }}</h1>
        <p class="project-subtitle">{{ project.description }}</p>
      </div>
    </section>

    <!-- Project Content -->
    <section v-if="project" class="project-content">
      <div class="project-container">
        <!-- Project Visual -->
        <div class="project-visual">
          <div class="project-image-large">
            <div class="project-placeholder-large">
              <span>{{ project.title }}</span>
            </div>
          </div>
        </div>

        <!-- Project Overview -->
        <div class="project-overview">
          <h2>Overview</h2>
          <p>{{ project.longDescription }}</p>

          <!-- Technologies -->
          <div class="project-section">
            <h3>Technologies Used</h3>
            <div class="tech-tags">
              <span v-for="tech in project.technologies" :key="tech" class="tech-tag">{{ tech }}</span>
            </div>
          </div>

          <!-- Features -->
          <div class="project-section">
            <h3>Key Features</h3>
            <ul class="features-list">
              <li v-for="feature in project.features" :key="feature">{{ feature }}</li>
            </ul>
          </div>

          <!-- Links -->
          <div class="project-links">
            <a :href="project.githubUrl" target="_blank" class="btn btn-primary">
              <span>View on GitHub</span>
            </a>
            <a :href="project.liveUrl" target="_blank" class="btn btn-secondary">
              <span>Live Demo</span>
            </a>
          </div>
        </div>
      </div>
    </section>

    <section v-else class="project-content">
      <div class="project-container">
        <div class="project-overview project-missing">
          <h2>Project Not Found</h2>
          <p>The project you requested does not exist.</p>
          <router-link to="/projects" class="btn btn-primary">Back to Projects</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'ProjectDetail',
  props: ['id'],
  data() {
    return {
      projects: [
        {
          id: 1,
          title: 'Interactive 3D Portfolio',
          description: 'A stunning 3D portfolio built with Three.js and Vue.js featuring interactive elements and smooth animations.',
          category: 'Three.js',
          tags: ['Three.js', 'Vue.js', 'WebGL', '3D Graphics'],
          longDescription: 'This project showcases advanced 3D web development techniques using Three.js and Vue.js. Features include interactive camera controls, particle systems, and optimized rendering for smooth performance across devices. The application demonstrates modern web graphics capabilities with real-time 3D rendering and user interaction.',
          technologies: ['Three.js', 'Vue.js', 'WebGL', 'JavaScript', 'GLSL Shaders'],
          features: ['Interactive 3D scenes', 'Particle animations', 'Responsive design', 'Performance optimization', 'Camera controls', 'Lighting effects'],
          githubUrl: 'https://github.com',
          liveUrl: 'https://example.com'
        },
        {
          id: 2,
          title: 'Vue.js Dashboard',
          description: 'Modern admin dashboard with real-time data visualization and interactive charts.',
          category: 'Vue.js',
          tags: ['Vue.js', 'Chart.js', 'API', 'Dashboard'],
          longDescription: 'A comprehensive admin dashboard built with Vue.js featuring real-time data updates, interactive charts, and a responsive design. Includes user authentication, data management, and analytics features. The dashboard provides insights through various chart types and data visualizations.',
          technologies: ['Vue.js', 'Chart.js', 'Axios', 'Vue Router', 'Pinia'],
          features: ['Real-time data updates', 'Interactive charts', 'User authentication', 'Responsive layout', 'Data filtering', 'Export functionality'],
          githubUrl: 'https://github.com',
          liveUrl: 'https://example.com'
        },
        {
          id: 3,
          title: 'GSAP Animation Library',
          description: 'Custom animation library for smooth web interactions and micro-animations.',
          category: 'Animation',
          tags: ['GSAP', 'JavaScript', 'Animation', 'Performance'],
          longDescription: 'A custom animation library built on top of GSAP (GreenSock Animation Platform) providing reusable animation components and smooth transitions for web applications. This library includes various animation presets and utilities for creating engaging user experiences.',
          technologies: ['GSAP', 'JavaScript', 'CSS', 'SVG', 'Canvas'],
          features: ['Smooth animations', 'Reusable components', 'Performance optimized', 'Cross-browser support', 'Animation presets', 'Timeline controls'],
          githubUrl: 'https://github.com',
          liveUrl: 'https://example.com'
        },
        {
          id: 4,
          title: 'WebGL Particle System',
          description: 'GPU-accelerated particle effects for modern web applications.',
          category: 'WebGL',
          tags: ['WebGL', 'Shaders', 'Performance', '3D'],
          longDescription: 'High-performance particle system built with WebGL and custom shaders. Features include dynamic particle generation, physics simulation, and optimized rendering techniques. This system demonstrates advanced GPU programming and real-time graphics processing.',
          technologies: ['WebGL', 'GLSL', 'JavaScript', 'Shaders', 'WebGL2'],
          features: ['GPU acceleration', 'Custom shaders', 'Physics simulation', 'Performance monitoring', 'Particle effects', 'Real-time rendering'],
          githubUrl: 'https://github.com',
          liveUrl: 'https://example.com'
        },
        {
          id: 5,
          title: 'Vue Component Library',
          description: 'Reusable Vue components for rapid development and consistent UI.',
          category: 'Vue.js',
          tags: ['Vue.js', 'Components', 'Design System', 'UI'],
          longDescription: 'A comprehensive component library built with Vue.js featuring reusable UI components, consistent design system, and accessibility features for rapid application development. Includes form components, navigation elements, and data display components.',
          technologies: ['Vue.js', 'SCSS', 'Storybook', 'Jest', 'TypeScript'],
          features: ['Reusable components', 'Design system', 'Accessibility compliance', 'Testing suite', 'Documentation', 'Theme support'],
          githubUrl: 'https://github.com',
          liveUrl: 'https://example.com'
        }
      ]
    }
  },
  computed: {
    project() {
      return this.projects.find(p => p.id === parseInt(this.id, 10)) || null
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
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
}

.project-content {
  padding: 4rem 2rem;
  background: var(--quantum-dark);
}

.project-container {
  max-width: 1000px;
  margin: 0 auto;
}

.project-visual {
  margin-bottom: 3rem;
}

.project-image-large {
  width: 100%;
  height: 400px;
  border-radius: 10px;
  overflow: hidden;
}

.project-placeholder-large {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(0, 168, 255, 0.1), rgba(212, 175, 55, 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 600;
  color: var(--tardis-bright);
  font-family: 'Orbitron', sans-serif;
}

.project-overview {
  color: var(--text-primary);
}

.project-overview h2 {
  color: var(--tardis-bright);
  font-size: 2rem;
  margin-bottom: 1.5rem;
  font-family: 'Orbitron', sans-serif;
}

.project-overview p {
  font-size: 1.1rem;
  line-height: 1.7;
  margin-bottom: 2rem;
  color: var(--text-secondary);
}

.project-missing {
  text-align: center;
  padding: 4rem 0;
}

.project-section {
  margin-bottom: 2.5rem;
}

.project-section h3 {
  color: var(--gallifrey-gold);
  font-size: 1.3rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.tech-tag {
  background: rgba(0, 168, 255, 0.2);
  color: var(--tardis-bright);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  border: 1px solid rgba(0, 168, 255, 0.3);
}

.features-list {
  list-style: none;
  padding: 0;
}

.features-list li {
  padding: 0.5rem 0;
  padding-left: 1.5rem;
  position: relative;
  color: var(--text-secondary);
  line-height: 1.6;
}

.features-list li:before {
  content: '▶';
  color: var(--gallifrey-gold);
  position: absolute;
  left: 0;
  font-size: 0.8rem;
}

.project-links {
  display: flex;
  gap: 1rem;
  margin-top: 3rem;
  flex-wrap: wrap;
}

.project-links .btn {
  flex: 1;
  min-width: 150px;
  text-align: center;
}

@media (max-width: 768px) {
  .project-hero h1 {
    font-size: 2rem;
  }

  .project-image-large {
    height: 250px;
  }

  .project-placeholder-large {
    font-size: 1.5rem;
  }

  .project-links {
    flex-direction: column;
  }

  .project-links .btn {
    width: 100%;
  }
}
</style>