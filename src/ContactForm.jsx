import { useState } from 'react'
const API_URL = import.meta.env.VITE_API_URL
function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('') // '', 'sending', 'success', 'error'

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')

    fetch(`${API_URL}/api/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to submit')
        return res.json()
      })
      .then(() => {
        setStatus('success')
        setFormData({ name: '', email: '', message: '' })
      })
      .catch(() => {
        setStatus('error')
      })
  }

  return (
    <section className="contact">
      <h2>Interested in a demo?</h2>
      <p>Send us a message and we'll get back to you.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Your message"
          rows="4"
          value={formData.message}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending...' : 'Send Message'}
        </button>

        {status === 'success' && <p className="form-success">Message sent successfully!</p>}
        {status === 'error' && <p className="form-error">Something went wrong. Please try again.</p>}
      </form>
    </section>
  )
}

export default ContactForm