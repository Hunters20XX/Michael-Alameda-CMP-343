const Pool = require('pg').Pool

const pool = new Pool({
    user: 'me',
    host: 'localhost',
    database: 'favlinks',
    password: '120202',
    port: 5432
})

// Add the two links back
// TODO: Replace these with the actual links from your professor's videos
const linksToAdd = [
    { name: 'Link 1 Name', URL: 'https://example.com/link1' },
    { name: 'Link 2 Name', URL: 'https://example.com/link2' }
]

let addedCount = 0

linksToAdd.forEach((link, index) => {
    pool.query(
        'INSERT INTO links (name, URL) VALUES ($1, $2) RETURNING id',
        [link.name, link.URL],
        (error, results) => {
            if (error) {
                console.error(`Error inserting link ${index + 1}:`, error)
                return
            }
            addedCount++
            console.log(`Added link ${index + 1}: ${link.name} (ID: ${results.rows[0].id})`)
            
            if (addedCount === linksToAdd.length) {
                console.log(`\nSuccessfully restored ${addedCount} link(s).`)
                pool.end()
            }
        }
    )
})

