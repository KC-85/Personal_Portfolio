import { mount, RouterLinkStub } from '@vue/test-utils'
import ProjectDetail from '../ProjectDetail.vue'

describe('ProjectDetail view', () => {
  it('renders the selected project content', () => {
    const wrapper = mount(ProjectDetail, {
      props: {
        id: '2'
      },
      global: {
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    })

    expect(wrapper.text()).toContain('World Wide Weather')
    expect(wrapper.text()).toContain('Technologies Used')
    expect(wrapper.text()).toContain('Location search')
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
})