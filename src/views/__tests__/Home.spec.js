import { mount } from '@vue/test-utils'
import Home from '../Home.vue'

describe('Home view', () => {
  it('renders the main hero content', () => {
    const wrapper = mount(Home)

    expect(wrapper.text()).toContain('Kristian Cross')
    expect(wrapper.text()).toContain('View My Work')
    expect(wrapper.find('#contact').exists()).toBe(true)
    expect(wrapper.get('a[href^="mailto:"]').attributes('href')).toBe(
      'mailto:kristian.d.cross@gmail.com?subject=Portfolio%20enquiry'
    )
  })
})
