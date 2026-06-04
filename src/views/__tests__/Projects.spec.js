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

    expect(wrapper.findAll('.project-card-link')).toHaveLength(5)

    const djangoButton = wrapper.findAll('button').find((button) => button.text() === 'Django')
    await djangoButton.trigger('click')

    expect(wrapper.vm.activeCategory).toBe('Django')
    expect(wrapper.findAll('.project-card-link')).toHaveLength(2)
    expect(wrapper.text()).toContain('Joystick Journalist')
    expect(wrapper.text()).toContain('Modern Classics')
  })
})