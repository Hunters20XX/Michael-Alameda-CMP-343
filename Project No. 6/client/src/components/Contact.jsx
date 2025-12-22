import { useState } from 'react'
import './Contact.css'
import Card from './Card'
import Button from './Button'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send message')
      }

      const result = await response.json()
      console.log('Message sent successfully:', result)

      setSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '' })

      setTimeout(() => {
        setSubmitted(false)
      }, 3000)
    } catch (error) {
      console.error('Error sending message:', error)
      alert(`Failed to send message: ${error.message}`)
    }
  }

  return (
    <div className="contact">
      <div className="contact-hero">
        <h1 className="contact-title">Get In Touch</h1>
        <p className="contact-subtitle">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
      </div>

      <div className="contact-content">
        <div className="contact-form-section">
          <Card title="Send us a Message">
            {submitted ? (
              <div className="success-message">
                <p>✓ Thank you! Your message has been sent successfully.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="form-textarea"
                  />
                </div>

                <Button type="submit" variant="primary" style={{ width: '100%' }}>
                  Send Message
                </Button>
              </form>
            )}
          </Card>
        </div>

        <div className="contact-info-section">
          <Card title="Contact Information">
            <div className="contact-info">
              <div className="info-item">
                <div className="info-icon">📧</div>
                <div>
                  <h3>Email</h3>
                  <p>contact@myapp.com</p>
                  <p>support@myapp.com</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">📞</div>
                <div>
                  <h3>Phone</h3>
                  <p>+1 (555) 123-4567</p>
                  <p>Mon-Fri 9am-5pm EST</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">📍</div>
                <div>
                  <h3>Address</h3>
                  <p>123 Main Street</p>
                  <p>New York, NY 10001</p>
                  <p>United States</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">💬</div>
                <div>
                  <h3>Social Media</h3>
                  <div className="social-links">
                    <a href="#twitter">Twitter</a>
                    <a href="#linkedin">LinkedIn</a>
                    <a href="#github">GitHub</a>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Contact

