import { query } from '../config/db.js'

// Create contact_messages table if it doesn't exist
export const createContactTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS contact_messages (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      subject VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `

  try {
    await query(createTableQuery)
    console.log('Contact messages table created or already exists')
  } catch (error) {
    console.error('Error creating contact_messages table:', error)
    throw error
  }
}

// Create a new contact message
export const createContactMessage = async ({ name, email, subject, message }) => {
  const insertQuery = `
    INSERT INTO contact_messages (name, email, subject, message)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email, subject, message, created_at
  `

  try {
    const result = await query(insertQuery, [name, email, subject, message])
    return result.rows[0]
  } catch (error) {
    console.error('Error creating contact message:', error)
    throw error
  }
}

// Get all contact messages (for admin purposes)
export const getContactMessages = async () => {
  const selectQuery = `
    SELECT id, name, email, subject, message, created_at
    FROM contact_messages
    ORDER BY created_at DESC
  `

  try {
    const result = await query(selectQuery)
    return result.rows
  } catch (error) {
    console.error('Error fetching contact messages:', error)
    throw error
  }
}

// Get contact message by ID
export const getContactMessageById = async (id) => {
  const selectQuery = `
    SELECT id, name, email, subject, message, created_at
    FROM contact_messages
    WHERE id = $1
  `

  try {
    const result = await query(selectQuery, [id])
    return result.rows[0] || null
  } catch (error) {
    console.error('Error fetching contact message:', error)
    throw error
  }
}
