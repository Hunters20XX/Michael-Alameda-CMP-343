const express = require('express')
const cors = require('cors')
const path = require('path')

const db = require('./queries')

const app = express()

// Enable CORS for all routes
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const PORT = process.env.PORT || 9001

// API routes
app.get('/links', db.getLinks)
app.post('/new', db.createLink)
app.put('/links/:id', db.updateLink)
app.delete('/links/:id', db.deleteLink)

// Serve static files from React app
app.use(express.static(path.resolve(__dirname, './client/build')))

// Catch all handler: send back React's index.html file for client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/build', 'index.html'))
})

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}.`)
})