import express from 'express'
import { createContactMessage } from '../data/contactStore.js'
import { validateContactData } from '../middleware/validation.js'
import { strictRateLimit } from '../middleware/rateLimit.js'

const router = express.Router()

// POST /api/contact - Create a new contact message
router.post('/', strictRateLimit, validateContactData, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    const newMessage = await createContactMessage({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim()
    })

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
