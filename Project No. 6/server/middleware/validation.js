// Input validation middleware

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate required fields
const validateRequired = (fields, data) => {
  const missing = []
  fields.forEach(field => {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      missing.push(field)
    }
  })
  return missing
}

// Validate string length
const validateLength = (field, value, min = 1, max = 1000) => {
  if (typeof value !== 'string') return false
  const length = value.trim().length
  return length >= min && length <= max
}

// Post validation middleware
export const validatePostData = (req, res, next) => {
  const { title, content, author } = req.body
  const errors = []

  // Check required fields
  const missing = validateRequired(['title', 'content', 'author'], req.body)
  if (missing.length > 0) {
    return res.status(400).json({
      error: `Missing required fields: ${missing.join(', ')} are required`
    })
  }

  // Validate lengths
  if (!validateLength('title', title, 1, 255)) {
    errors.push('Title must be between 1 and 255 characters')
  }

  if (!validateLength('content', content, 1, 10000)) {
    errors.push('Content must be between 1 and 10000 characters')
  }

  if (!validateLength('author', author, 1, 100)) {
    errors.push('Author name must be between 1 and 100 characters')
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors
    })
  }

  next()
}

// Contact message validation middleware
export const validateContactData = (req, res, next) => {
  const { name, email, subject, message } = req.body
  const errors = []

  // Check required fields
  const missing = validateRequired(['name', 'email', 'subject', 'message'], req.body)
  if (missing.length > 0) {
    return res.status(400).json({
      error: `Missing required fields: ${missing.join(', ')} are required`
    })
  }

  // Validate email
  if (!isValidEmail(email)) {
    errors.push('Invalid email format')
  }

  // Validate lengths
  if (!validateLength('name', name, 1, 255)) {
    errors.push('Name must be between 1 and 255 characters')
  }

  if (!validateLength('subject', subject, 1, 255)) {
    errors.push('Subject must be between 1 and 255 characters')
  }

  if (!validateLength('message', message, 1, 5000)) {
    errors.push('Message must be between 1 and 5000 characters')
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors
    })
  }

  next()
}

// General ID validation middleware
export const validateId = (req, res, next) => {
  const id = parseInt(req.params.id)

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({
      error: 'Invalid ID. Must be a positive integer'
    })
  }

  req.params.id = id
  next()
}
