import { mount, RouterLinkStub } from '@vue/test-utils'
import ProjectDetail from '../ProjectDetail.vue'

describe('ProjectDetail view', () => {
  it('renders the selected project content', () => {
    const wrapper = mount(ProjectDetail, {
      props: {
        id: '1'
      },
      global: {
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    })

    expect(wrapper.text()).toContain('Checkout Girl')
    expect(wrapper.text()).toContain('Technologies Used')
    expect(wrapper.text()).toContain('Music player integration')

    const projectLinks = wrapper.findAll('.project-links a')
    expect(projectLinks).toHaveLength(2)
    expect(projectLinks[0].attributes('href')).toBe('https://github.com/KC-85/Checkout-Girl')
    expect(projectLinks[1].attributes('href')).toBe('https://checkout-girl.vercel.app/')
    expect(projectLinks[1].text()).toContain('Live Demo')
  })

  it('shows a fallback when the project id is unknown', () => {
    const wrapper = mount(ProjectDetail, {
      props: {
        id: '999'
      },
      global: {
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    })

    expect(wrapper.text()).toContain('Project Not Found')
    expect(wrapper.text()).toContain('Back to Projects')
  })

  it('renders available project links without publishing a missing live demo', () => {
    const wrapper = mount(ProjectDetail, {
      props: {
        id: '3'
      },
      global: {
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    })

    expect(wrapper.text()).toContain('UK Weather Forecast')
    expect(wrapper.text()).toContain('Ordnance Survey')
    expect(wrapper.find('.project-links').exists()).toBe(true)
    expect(wrapper.findAll('.project-links a')).toHaveLength(1)
    expect(wrapper.get('.project-links a').attributes('href')).toBe('https://github.com/KC-85/UK-Weather')
    expect(wrapper.text()).not.toContain('Live Demo')
  })
})
