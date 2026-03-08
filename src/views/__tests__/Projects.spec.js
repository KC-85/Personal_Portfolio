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

    const vueButton = wrapper.findAll('button').find((button) => button.text() === 'Vue.js')
    await vueButton.trigger('click')

    expect(wrapper.vm.activeCategory).toBe('Vue.js')
    expect(wrapper.findAll('.project-card-link')).toHaveLength(2)
    expect(wrapper.text()).toContain('Vue.js Dashboard')
    expect(wrapper.text()).toContain('Vue Component Library')
  })
})