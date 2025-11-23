const Pool = require('pg').Pool

// Use DATABASE_URL if provided (Heroku), otherwise use individual env vars or defaults
let poolConfig

if (process.env.DATABASE_URL) {
    // Heroku provides DATABASE_URL in format: postgres://user:password@host:port/database
    poolConfig = {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    }
} else {
    // Local development
    poolConfig = {
        user: process.env.DB_USER || 'me',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'favlinks',
        password: process.env.DB_PASSWORD || '120202',
        port: process.env.DB_PORT || 5432
    }
}

const pool = new Pool(poolConfig)

const createLink = (request, res) => {
    const name = request.body.name
    const URL = request.body.URL

    pool.query(
        'INSERT INTO links (name, URL) VALUES ($1, $2) RETURNING id',
        [name, URL],
        (error, results) => {
            if (error) {
                console.error('Error inserting link:', error)
                res.status(500).json({ error: error.message })
                return
            }
            res.status(201).send(`Link added with ID: ${results.rows[0].id}`)
        },
    )
}

const getLinks = (request, res) => {
    pool.query('SELECT * FROM links ORDER BY id ASC', (error, result) => {
        if (error) {
            console.error('Error fetching links:', error)
            res.status(500).json({ error: error.message })
            return
        }
        res.status(200).json(result.rows)
    })
}

const updateLink = (request, res) => {
    const id = parseInt(request.params.id)
    const { name, URL } = request.body

    pool.query(
        'UPDATE links SET name = $1, URL = $2 WHERE id = $3 RETURNING *',
        [name, URL, id],
        (error, results) => {
            if (error) {
                console.error('Error updating link:', error)
                res.status(500).json({ error: error.message })
                return
            }
            if (results.rows.length === 0) {
                res.status(404).json({ error: 'Link not found' })
                return
            }
            res.status(200).json(results.rows[0])
        }
    )
}

const deleteLink = (request, res) => {
    const id = parseInt(request.params.id)

    pool.query(
        'DELETE FROM links WHERE id = $1 RETURNING *',
        [id],
        (error, results) => {
            if (error) {
                console.error('Error deleting link:', error)
                res.status(500).json({ error: error.message })
                return
            }
            if (results.rows.length === 0) {
                res.status(404).json({ error: 'Link not found' })
                return
            }
            res.status(200).json({ message: `Link deleted with ID: ${id}` })
        }
    )
}

module.exports = {
    getLinks,
    createLink,
    updateLink,
    deleteLink
}