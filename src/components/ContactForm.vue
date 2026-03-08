<template>
  <form @submit.prevent="submitForm" class="contact-form">
    <div class="form-group">
      <label for="name">Name</label>
      <input
        id="name"
        v-model="form.name"
        type="text"
        required
        :class="{ error: errors.name }"
      />
      <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
    </div>

    <div class="form-group">
      <label for="email">Email</label>
      <input
        id="email"
        v-model="form.email"
        type="email"
        required
        :class="{ error: errors.email }"
      />
      <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
    </div>

    <div class="form-group">
      <label for="subject">Subject</label>
      <input
        id="subject"
        v-model="form.subject"
        type="text"
        required
        :class="{ error: errors.subject }"
      />
      <span v-if="errors.subject" class="error-message">{{ errors.subject }}</span>
    </div>

    <div class="form-group">
      <label for="message">Message</label>
      <textarea
        id="message"
        v-model="form.message"
        required
        rows="5"
        :class="{ error: errors.message }"
      ></textarea>
      <span v-if="errors.message" class="error-message">{{ errors.message }}</span>
    </div>

    <button type="submit" :disabled="isSubmitting" class="submit-btn">
      {{ isSubmitting ? 'Sending...' : 'Send Message' }}
    </button>

    <div v-if="submitMessage" :class="['submit-message', submitMessage.type]">
      {{ submitMessage.text }}
    </div>
  </form>
</template>

<script>
const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_API_URL || '/api/contact'

export default {
  name: 'ContactForm',
  data() {
    return {
      form: {
        name: '',
        email: '',
        subject: '',
        message: ''
      },
      errors: {},
      isSubmitting: false,
      submitMessage: null
    }
  },
  methods: {
    validateForm() {
      this.errors = {}

      if (!this.form.name.trim()) {
        this.errors.name = 'Name is required'
      }

      if (!this.form.email.trim()) {
        this.errors.email = 'Email is required'
      } else if (!this.isValidEmail(this.form.email)) {
        this.errors.email = 'Please enter a valid email'
      }

      if (!this.form.subject.trim()) {
        this.errors.subject = 'Subject is required'
      }

      if (!this.form.message.trim()) {
        this.errors.message = 'Message is required'
      }

      return Object.keys(this.errors).length === 0
    },

    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },

    async sendContactRequest(payload) {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      let body = null

      try {
        body = await response.json()
      } catch {
        body = null
      }

      if (!response.ok) {
        const validationMessage = Array.isArray(body?.detail)
          ? body.detail.map((issue) => issue.msg).join(' ')
          : null
        const errorMessage = validationMessage || body?.detail || body?.message || 'Failed to send message. Please try again.'
        throw new Error(errorMessage)
      }

      return body
    },

    async submitForm() {
      if (!this.validateForm()) {
        return
      }

      this.isSubmitting = true
      this.submitMessage = null

      try {
        await this.sendContactRequest(this.form)

        this.submitMessage = {
          type: 'success',
          text: 'Message sent successfully! I\'ll get back to you soon.'
        }

        // Reset form
        this.form = {
          name: '',
          email: '',
          subject: '',
          message: ''
        }
      } catch (error) {
        this.submitMessage = {
          type: 'error',
          text: error instanceof Error ? error.message : 'Failed to send message. Please try again.'
        }
      } finally {
        this.isSubmitting = false
      }
    }
  }
}
</script>

<style scoped>
.contact-form {
  max-width: 500px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--tardis-bright);
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid rgba(0, 168, 255, 0.3);
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.3);
  color: var(--text-primary);
  font-family: 'Inter', sans-serif;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--tardis-bright);
  box-shadow: 0 0 10px rgba(0, 168, 255, 0.3);
}

.form-group input.error,
.form-group textarea.error {
  border-color: var(--danger-red);
}

.error-message {
  display: block;
  margin-top: 0.25rem;
  color: var(--danger-red);
  font-size: 0.875rem;
}

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  background: var(--tardis-bright);
  color: var(--quantum-dark);
  border: none;
  border-radius: 5px;
  font-family: 'Orbitron', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  background: var(--gallifrey-gold);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 168, 255, 0.4);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.submit-message {
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 5px;
  text-align: center;
}

.submit-message.success {
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid rgba(0, 255, 0, 0.3);
  color: #00ff00;
}

.submit-message.error {
  background: rgba(255, 0, 0, 0.1);
  border: 1px solid rgba(255, 0, 0, 0.3);
  color: var(--danger-red);
}
</style>