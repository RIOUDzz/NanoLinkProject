require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.static('../frontend'));

app.use((req, res, next) => {
    console.log(`[Gateway] ${req.method} ${req.url}`);
    next();
});

// Use '/' mount and filters to avoid path stripping issues!
app.use('/', createProxyMiddleware({
    target: process.env.URL_SERVICE_URL,
    changeOrigin: true,
    pathFilter: (path) => path === '/api/shorten' || path === '/api/urls'
}));

app.use('/', createProxyMiddleware({
    target: process.env.ANALYTICS_SERVICE_URL,
    changeOrigin: true,
    pathFilter: (path) => path === '/api/stats',
    pathRewrite: { '^/api/stats': '/stats' }
}));


app.use('/', createProxyMiddleware({
    target: process.env.REDIRECT_SERVICE_URL,
    changeOrigin: true,
    pathFilter: (path) => !path.startsWith('/api') && path !== '/favicon.ico'
}));

app.listen(PORT, () => {
    console.log(`🌐 API Gateway running on http://localhost:${PORT}`);
});
