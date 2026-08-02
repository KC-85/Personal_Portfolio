<template>
  <main class="work-page">
    <header class="work-hero">
      <div class="work-shell">
        <router-link to="/" class="back-link">← Back to Home</router-link>
        <p class="work-eyebrow">Selected work · {{ projects.length }} projects</p>
        <h1>Projects built with purpose.</h1>
        <p class="work-intro">
          A collection of full-stack products, creative experiments, and practical tools—each
          shaped by curiosity and a focus on useful digital experiences.
        </p>
      </div>
    </header>

    <section v-if="activeCategory === 'All Work' && featuredProject" class="featured-section">
      <div class="work-shell">
        <div class="section-heading">
          <p>Featured case study</p>
          <span>Most recent build</span>
        </div>

        <router-link
          :to="`/projects/${featuredProject.id}`"
          class="featured-project project-card-link"
          :style="projectStyle(featuredProject)"
          @click.prevent="openProject(featuredProject.id)"
        >
          <div class="featured-visual" aria-hidden="true">
            <img
              v-if="featuredProject.image"
              :src="featuredProject.image"
              :alt="featuredProject.title"
            />
            <template v-else>
              <span class="visual-coordinate">{{ formatProjectNumber(featuredProject.id) }}</span>
              <div class="weather-orbit weather-orbit--outer"></div>
              <div class="weather-orbit weather-orbit--inner"></div>
              <div class="weather-core"></div>
              <span class="visual-label">United Kingdom · Live forecast data</span>
            </template>
          </div>

          <article class="featured-copy">
            <p class="project-type">{{ featuredProject.type }}</p>
            <h2>{{ featuredProject.title }}</h2>
            <p class="featured-description">{{ featuredProject.longDescription }}</p>
            <ul class="featured-stack" aria-label="Featured technologies">
              <li v-for="tech in featuredProject.technologies.slice(0, 5)" :key="tech">
                {{ tech }}
              </li>
            </ul>
            <span class="project-cta">Explore case study <span aria-hidden="true">↗</span></span>
          </article>
        </router-link>
      </div>
    </section>

    <section class="archive-section">
      <div class="work-shell">
        <div class="archive-heading">
          <div>
            <p class="section-kicker">Project archive</p>
            <h2>Browse the work</h2>
          </div>
          <p>{{ visibleProjectCount }} {{ visibleProjectCount === 1 ? 'project' : 'projects' }}</p>
        </div>

        <nav class="work-filters" aria-label="Filter projects">
          <button
            v-for="category in categories"
            :key="category"
            type="button"
            :class="{ active: activeCategory === category }"
            :aria-pressed="activeCategory === category"
            @click="activeCategory = category"
          >
            {{ category }}
          </button>
        </nav>

        <div class="project-list">
          <router-link
            v-for="project in filteredProjects"
            :key="project.id"
            :to="`/projects/${project.id}`"
            class="project-row project-card-link"
            :style="projectStyle(project)"
            @click.prevent="openProject(project.id)"
          >
            <span class="project-number">{{ formatProjectNumber(project.id) }}</span>

            <article class="project-summary">
              <p class="project-type">{{ project.type }}</p>
              <h3>{{ project.title }}</h3>
              <p>{{ project.description }}</p>
            </article>

            <ul class="project-stack" aria-label="Primary technologies">
              <li v-for="tag in project.tags.slice(0, 3)" :key="tag">{{ tag }}</li>
            </ul>

            <span class="project-arrow" aria-hidden="true">↗</span>
          </router-link>
        </div>

        <p v-if="filteredProjects.length === 0" class="empty-state">
          No projects are available in this collection yet.
        </p>
      </div>
    </section>
  </main>
</template>

<script>
import { projects } from '../data/projects'

const projectPalettes = [
  ['#00a8ff', '#0055cc'],
  ['#00d9c0', '#087f8c'],
  ['#d4af37', '#8a5a00'],
  ['#d65db1', '#6b2d5c'],
  ['#ff7a59', '#9c2f21'],
  ['#4cc9f0', '#4361ee'],
  ['#b8f2e6', '#5e60ce'],
  ['#72efdd', '#0077b6']
]

export default {
  name: 'Projects',
  data() {
    return {
      activeCategory: 'All Work',
      categories: ['All Work', 'Full Stack', 'Frontend', 'Python', 'Tools'],
      projects
    }
  },
  computed: {
    featuredProject() {
      return this.projects.find((project) => project.featured) || this.projects[0] || null
    },
    filteredProjects() {
      if (this.activeCategory === 'All Work') {
        return this.projects.filter((project) => !project.featured)
      }

      return this.projects.filter((project) => project.disciplines.includes(this.activeCategory))
    },
    visibleProjectCount() {
      return this.activeCategory === 'All Work' ? this.projects.length : this.filteredProjects.length
    }
  },
  methods: {
    openProject(id) {
      this.$router.push(`/projects/${id}`)
    },
    formatProjectNumber(id) {
      return String(id).padStart(2, '0')
    },
    projectStyle(project) {
      const [accent, accentDeep] = projectPalettes[(project.id - 1) % projectPalettes.length]
      return {
        '--project-accent': accent,
        '--project-accent-deep': accentDeep
      }
    }
  }
}
</script>

<style scoped>
.work-page {
  min-height: 100vh;
  background: var(--quantum-dark);
}

.work-shell {
  width: min(1180px, calc(100% - 4rem));
  margin: 0 auto;
}

.work-hero {
  position: relative;
  padding: 10rem 0 6rem;
  overflow: hidden;
  background:
    linear-gradient(180deg, rgba(0, 168, 255, 0.08), transparent 65%),
    var(--quantum-dark);
}

.work-hero::after {
  content: '';
  position: absolute;
  width: 34rem;
  height: 34rem;
  top: -17rem;
  right: -8rem;
  border: 1px solid rgba(0, 168, 255, 0.16);
  border-radius: 50%;
  box-shadow:
    0 0 0 5rem rgba(0, 168, 255, 0.025),
    0 0 0 10rem rgba(0, 168, 255, 0.018);
}

.back-link {
  position: relative;
  z-index: 1;
  display: inline-flex;
  margin-bottom: 5rem;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 180ms ease, transform 180ms ease;
}

.back-link:hover {
  color: var(--tardis-bright);
  transform: translateX(-0.3rem);
}

.work-eyebrow,
.section-kicker,
.section-heading p,
.project-type {
  margin: 0;
  color: var(--project-accent, var(--tardis-bright));
  font-family: 'Orbitron', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.work-hero h1 {
  position: relative;
  z-index: 1;
  max-width: 850px;
  margin: 1.2rem 0 1.5rem;
  font-size: clamp(3rem, 8vw, 6.8rem);
  line-height: 0.95;
  letter-spacing: -0.045em;
  text-transform: none;
}

.work-intro {
  position: relative;
  z-index: 1;
  max-width: 690px;
  margin: 0;
  color: var(--text-secondary);
  font-size: clamp(1.05rem, 2vw, 1.3rem);
  line-height: 1.75;
}

.featured-section {
  padding: 2rem 0 7rem;
}

.section-heading,
.archive-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.section-heading span,
.archive-heading > p {
  color: var(--text-muted);
  font-size: 0.86rem;
}

.featured-project {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(340px, 0.85fr);
  min-height: 570px;
  color: inherit;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: #080d1c;
  overflow: hidden;
  transition: border-color 250ms ease, transform 250ms ease, box-shadow 250ms ease;
}

.featured-project:hover {
  transform: translateY(-0.45rem);
  border-color: color-mix(in srgb, var(--project-accent) 70%, transparent);
  box-shadow: 0 2rem 5rem rgba(0, 0, 0, 0.32);
}

.featured-visual {
  position: relative;
  display: grid;
  place-items: center;
  min-height: 450px;
  overflow: hidden;
  isolation: isolate;
  background:
    linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    radial-gradient(circle at 50% 48%, color-mix(in srgb, var(--project-accent) 35%, transparent), transparent 38%),
    linear-gradient(145deg, var(--project-accent-deep), #050812 72%);
  background-size: 44px 44px, 44px 44px, auto, auto;
}

.featured-visual::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(130deg, transparent 35%, rgba(255, 255, 255, 0.12) 50%, transparent 65%);
  transform: translateX(-120%);
  transition: transform 800ms ease;
}

.featured-project:hover .featured-visual::after {
  transform: translateX(120%);
}

.featured-visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.visual-coordinate {
  position: absolute;
  top: 2rem;
  left: 2rem;
  color: rgba(255, 255, 255, 0.56);
  font-family: 'Orbitron', sans-serif;
  font-size: 0.75rem;
  letter-spacing: 0.14em;
}

.visual-label {
  position: absolute;
  right: 2rem;
  bottom: 2rem;
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.weather-orbit,
.weather-core {
  position: absolute;
  border-radius: 50%;
}

.weather-orbit {
  border: 1px solid color-mix(in srgb, var(--project-accent) 68%, white);
  animation: archive-orbit 12s linear infinite;
}

.weather-orbit::before {
  content: '';
  position: absolute;
  width: 0.7rem;
  height: 0.7rem;
  top: 50%;
  left: -0.35rem;
  border-radius: 50%;
  background: white;
  box-shadow: 0 0 1.2rem var(--project-accent);
}

.weather-orbit--outer {
  width: min(29vw, 390px);
  aspect-ratio: 1;
}

.weather-orbit--inner {
  width: min(19vw, 250px);
  aspect-ratio: 1;
  animation-direction: reverse;
  animation-duration: 8s;
}

.weather-core {
  width: min(9vw, 115px);
  aspect-ratio: 1;
  background: radial-gradient(circle at 35% 30%, white, var(--project-accent) 28%, var(--project-accent-deep) 72%);
  box-shadow: 0 0 4rem color-mix(in srgb, var(--project-accent) 65%, transparent);
}

.featured-copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: clamp(2.5rem, 5vw, 5rem);
}

.featured-copy h2 {
  margin: 0.9rem 0 1.5rem;
  color: var(--text-primary);
  font-size: clamp(2rem, 4vw, 3.5rem);
  line-height: 1.05;
  letter-spacing: -0.035em;
}

.featured-copy h2::after,
.archive-heading h2::after {
  content: none;
}

.featured-description {
  margin: 0;
  line-height: 1.75;
}

.featured-stack,
.project-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem 1rem;
  padding: 0;
  margin: 2rem 0 0;
  list-style: none;
}

.featured-stack li,
.project-stack li {
  color: var(--text-muted);
  font-size: 0.8rem;
}

.featured-stack li:not(:last-child)::after,
.project-stack li:not(:last-child)::after {
  content: '·';
  margin-left: 1rem;
  color: var(--project-accent);
}

.project-cta {
  display: inline-flex;
  gap: 0.7rem;
  margin-top: 3rem;
  color: var(--text-primary);
  font-weight: 600;
}

.project-cta span,
.project-arrow {
  color: var(--project-accent);
  transition: transform 200ms ease;
}

.featured-project:hover .project-cta span,
.project-row:hover .project-arrow {
  transform: translate(0.25rem, -0.25rem);
}

.archive-section {
  padding: 7rem 0 9rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.archive-heading {
  margin-bottom: 2.5rem;
}

.archive-heading h2 {
  display: block;
  margin: 0.6rem 0 0;
  color: var(--text-primary);
  font-size: clamp(2rem, 5vw, 3.75rem);
  letter-spacing: -0.035em;
}

.work-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem 2rem;
  margin-bottom: 3rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.work-filters button {
  position: relative;
  padding: 0 0 1rem;
  border: 0;
  color: var(--text-muted);
  background: none;
  font: inherit;
  cursor: pointer;
  transition: color 180ms ease;
}

.work-filters button::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: -1px;
  left: 0;
  height: 2px;
  background: var(--tardis-bright);
  transform: scaleX(0);
  transition: transform 180ms ease;
}

.work-filters button:hover,
.work-filters button.active {
  color: var(--text-primary);
}

.work-filters button.active::after {
  transform: scaleX(1);
}

.project-list {
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.project-row {
  position: relative;
  display: grid;
  grid-template-columns: 70px minmax(0, 1fr) minmax(230px, 0.55fr) 32px;
  gap: 2rem;
  align-items: center;
  min-height: 190px;
  padding: 2.2rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  color: inherit;
  text-decoration: none;
  transition: padding 220ms ease, background 220ms ease;
}

.project-row::before {
  content: '';
  position: absolute;
  inset: 0 calc(50% - 50vw);
  z-index: 0;
  background: linear-gradient(90deg, color-mix(in srgb, var(--project-accent) 10%, transparent), transparent 72%);
  opacity: 0;
  transition: opacity 220ms ease;
  pointer-events: none;
}

.project-row:hover::before {
  opacity: 1;
}

.project-row > * {
  position: relative;
  z-index: 1;
}

.project-number {
  align-self: start;
  padding-top: 0.25rem;
  color: var(--project-accent);
  font-family: 'Orbitron', sans-serif;
  font-size: 0.75rem;
  letter-spacing: 0.12em;
}

.project-summary h3 {
  margin: 0.55rem 0 0.75rem;
  color: var(--text-primary);
  font-size: clamp(1.45rem, 3vw, 2.25rem);
  letter-spacing: -0.025em;
  transition: color 180ms ease;
}

.project-row:hover .project-summary h3 {
  color: var(--project-accent);
}

.project-summary > p:last-child {
  max-width: 660px;
  margin: 0;
}

.project-stack {
  justify-content: flex-start;
  margin: 0;
}

.project-arrow {
  justify-self: end;
  font-size: 1.45rem;
}

.empty-state {
  padding: 4rem 0;
  text-align: center;
}

@keyframes archive-orbit {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .weather-orbit {
    animation: none;
  }

  .featured-project,
  .featured-visual::after,
  .project-arrow,
  .project-cta span {
    transition: none;
  }
}

@media (max-width: 900px) {
  .featured-project {
    grid-template-columns: 1fr;
  }

  .featured-visual {
    min-height: 390px;
  }

  .weather-orbit--outer {
    width: 280px;
  }

  .weather-orbit--inner {
    width: 180px;
  }

  .weather-core {
    width: 86px;
  }

  .project-row {
    grid-template-columns: 52px minmax(0, 1fr) 28px;
  }

  .project-stack {
    display: none;
  }
}

@media (max-width: 640px) {
  .work-shell {
    width: min(100% - 2rem, 1180px);
  }

  .work-hero {
    padding: 8rem 0 4rem;
  }

  .back-link {
    margin-bottom: 3.5rem;
  }

  .featured-section {
    padding-bottom: 5rem;
  }

  .section-heading,
  .archive-heading {
    align-items: flex-start;
  }

  .section-heading span,
  .archive-heading > p {
    display: none;
  }

  .featured-visual {
    min-height: 320px;
  }

  .visual-label {
    right: 1.25rem;
    bottom: 1.25rem;
    left: 1.25rem;
  }

  .featured-copy {
    padding: 2.25rem 1.4rem 2.6rem;
  }

  .archive-section {
    padding: 5rem 0 6rem;
  }

  .work-filters {
    flex-wrap: nowrap;
    gap: 1.5rem;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .work-filters::-webkit-scrollbar {
    display: none;
  }

  .work-filters button {
    flex: 0 0 auto;
  }

  .project-row {
    grid-template-columns: 36px minmax(0, 1fr) 24px;
    gap: 0.75rem;
    min-height: 170px;
    padding: 1.8rem 0;
  }

  .project-summary > p:last-child {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
}
</style>
