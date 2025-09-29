const express = require('express')
const path = require('path')
const fs = require('fs')
const app = express()

// Enable CORS for frontend requests
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
})

// Serve static files from the img directory
app.use('/images', express.static(path.join(__dirname, 'img')))

app.listen(8080, () => {
    console.log('http://localhost:8080 에서 서버 실행중')
})

// Get all image URLs
app.get('/api/getImgData', (req, res) => {
    try {
        const imgDataPath = path.join(__dirname, 'imgData.json')
        const imgData = JSON.parse(fs.readFileSync(imgDataPath, 'utf8'))
        res.json(imgData)
    } catch (error) {
        res.status(500).json({ error: 'Failed to read image data' })
    }
})