import { mount, RouterLinkStub } from '@vue/test-utils'
import Projects from '../Projects.vue'
import { projects } from '../../data/projects'

describe('Projects view', () => {
  it('filters projects by category', async () => {
    const wrapper = mount(Projects, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    })

    expect(wrapper.findAll('.project-card-link')).toHaveLength(projects.length)

    const fullStackButton = wrapper.findAll('button').find((button) => button.text() === 'Full Stack')
    await fullStackButton.trigger('click')

    expect(wrapper.vm.activeCategory).toBe('Full Stack')
    expect(wrapper.findAll('.project-card-link')).toHaveLength(4)
    expect(wrapper.text()).toContain('Joystick Journalist')
    expect(wrapper.text()).toContain('Modern Classics')
    expect(wrapper.text()).toContain('UK Weather Forecast')
    expect(wrapper.text()).toContain('Joystick Journalist Rebuild')

    const frontendButton = wrapper.findAll('button').find((button) => button.text() === 'Frontend')
    await frontendButton.trigger('click')

    expect(wrapper.vm.activeCategory).toBe('Frontend')
    expect(wrapper.findAll('.project-card-link')).toHaveLength(
      projects.filter((project) => project.disciplines.includes('Frontend')).length
    )
    expect(wrapper.text()).toContain('Checkout Girl')
    expect(wrapper.text()).toContain('MH-Support')
  })
})
