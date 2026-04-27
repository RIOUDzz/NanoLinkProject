require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const { initDb, Url } = require('./db');

const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

// Initialize DB
initDb().catch(err => {
    process.exit(1);
});

function generateShortCode(length = 6) {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

// 📜 API implementation with ORM

// 1. Shorten URL
app.post('/api/shorten', async (req, res) => {
    const { url } = req.body;
    
    if (!url) {
        return res.status(400).json({ error: 'URL is required {"url": "https://..."}' });
    }

    try {
        const shortCode = generateShortCode();
        
        // ORM: Create entry
        const newUrl = await Url.create({
            original_url: url,
            short_code: shortCode
        });

        // Fire & Forget Data Replication to Go Service
        const http = require('http');
        const postData = JSON.stringify({ shortCode, originalUrl: url });
        const reqGo = http.request({
            hostname: 'localhost',
            port: 4002,
            path: '/internal/sync',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        });
        reqGo.on('error', (e) => console.error('Sync error:', e.message));
        reqGo.write(postData);
        reqGo.end();

        res.status(201).json({
            shortCode: newUrl.short_code,
            originalUrl: newUrl.original_url
        });
    } catch (err) {
        console.error('API Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 2. Get all URLs
app.get('/api/urls', async (req, res) => {
    try {
        // ORM: Find all
        const urls = await Url.findAll({ order: [['createdAt', 'DESC']] });
        res.status(200).json(urls);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Internal Endpoint
app.get('/api/resolve/:code', async (req, res) => {
    const { code } = req.params;
    try {
        const urlRow = await Url.findOne({ where: { short_code: code } });
        if (!urlRow) {
            return res.status(404).json({ error: 'Not found' });
        }
        res.status(200).json({ originalUrl: urlRow.original_url });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`✅ URL Service (Sequelize) running on http://localhost:${PORT}`);
});
