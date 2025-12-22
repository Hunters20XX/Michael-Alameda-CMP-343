import express from 'express'
import { createContactMessage } from '../data/contactStore.js'

const router = express.Router()

// POST /api/contact - Create a new contact message
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        error: 'Missing required fields: name, email, subject, and message are required'
      })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format'
      })
    }

    const newMessage = await createContactMessage({ name, email, subject, message })
    res.status(201).json({
      message: 'Contact message sent successfully',
      data: newMessage
    })
  } catch (error) {
    console.error('Error creating contact message:', error)
    res.status(500).json({ error: 'Failed to send contact message' })
  }
})

export default router
