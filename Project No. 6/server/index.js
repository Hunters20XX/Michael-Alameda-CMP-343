// This file is defining our express server and running it on port 3000

const express = require('express')
const app = express()
const port = 3000

// middleware
app.use(express.json()) // allows us to parse incoming JSON data from a client
app.use(express.urlencoded()) // allows us to parse incoming URL Encoded data 

// add middleware for static files
app.use(express.static('public'))





app.get('/test/api', (req, res)=>{
    res.send({
        message: "Success! Server is operational"
    })
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})