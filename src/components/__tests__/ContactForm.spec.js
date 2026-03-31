import { mount } from '@vue/test-utils'
import ContactForm from '../ContactForm.vue'

async function flushSubmitCycle(wrapper) {
  await Promise.resolve()
  await wrapper.vm.$nextTick()
  await Promise.resolve()
}

describe('ContactForm', () => {
  it('shows validation errors for empty fields', async () => {
    const wrapper = mount(ContactForm)

    await wrapper.get('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Name is required')
    expect(wrapper.text()).toContain('Email is required')
    expect(wrapper.text()).toContain('Subject is required')
    expect(wrapper.text()).toContain('Message is required')
  })

  it('submits to the backend and resets the form on success', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        message: 'Message received successfully.'
      })
    })

    const wrapper = mount(ContactForm)

    await wrapper.get('#name').setValue('Kristian Cross')
    await wrapper.get('#email').setValue('kristian@example.com')
    await wrapper.get('#subject').setValue('Portfolio enquiry')
    await wrapper.get('#message').setValue('I would like to talk about a project.')
    await wrapper.get('form').trigger('submit.prevent')
    await flushSubmitCycle(wrapper)

    expect(fetchSpy).toHaveBeenCalledWith('/api/contact', expect.objectContaining({
      method: 'POST'
    }))
    expect(wrapper.text()).toContain("Message sent successfully! I'll get back to you soon.")
    expect(wrapper.vm.form).toEqual({
      name: '',
      email: '',
      subject: '',
      message: ''
    })

    fetchSpy.mockRestore()
  })

  it('shows the backend error message when submission fails', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({
        detail: 'Unable to store your message right now.'
      })
    })

    const wrapper = mount(ContactForm)

    await wrapper.get('#name').setValue('Kristian Cross')
    await wrapper.get('#email').setValue('kristian@example.com')
    await wrapper.get('#subject').setValue('Portfolio enquiry')
    await wrapper.get('#message').setValue('I would like to talk about a project.')
    await wrapper.get('form').trigger('submit.prevent')
    await flushSubmitCycle(wrapper)

    expect(wrapper.text()).toContain('Unable to store your message right now.')

    fetchSpy.mockRestore()
  })
})