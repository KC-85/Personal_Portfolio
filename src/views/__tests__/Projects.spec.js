import { mount, RouterLinkStub } from '@vue/test-utils'
import Projects from '../Projects.vue'

describe('Projects view', () => {
  it('filters projects by category', async () => {
    const wrapper = mount(Projects, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    })

    expect(wrapper.findAll('.project-card-link')).toHaveLength(8)

    const fullStackButton = wrapper.findAll('button').find((button) => button.text() === 'Full Stack')
    await fullStackButton.trigger('click')

    expect(wrapper.vm.activeCategory).toBe('Full Stack')
    expect(wrapper.findAll('.project-card-link')).toHaveLength(4)
    expect(wrapper.text()).toContain('Joystick Journalist')
    expect(wrapper.text()).toContain('Modern Classics')
    expect(wrapper.text()).toContain('UK Weather Forecast')
    expect(wrapper.text()).toContain('Joystick Journalist Rebuild')
  })
})
