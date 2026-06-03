import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './views/Home.vue'
import Projects from './views/Projects.vue'
import ProjectDetail from './views/ProjectDetail.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/projects',
    name: 'Projects',
    component: Projects
  },
  {
    path: '/projects/:id',
    name: 'ProjectDetail',
    component: ProjectDetail,
    props: true
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Reset vortex animation on every route change
router.beforeEach((to, from, next) => {
  // Skip if this is the initial navigation
  if (from.name === null && to.name === 'Home') {
    next()
    return
  }

  // Reset vortex if animation is in progress or has artifacts
  if (typeof window !== 'undefined' && window._timeVortex) {
    window._timeVortex.resetVortex()
  }

  next()
})

export default router