const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 5001;

app.use('/doctor', createProxyMiddleware({ target: 'http://localhost:5001', changeOrigin: true }));
app.use('/pharmacy', createProxyMiddleware({ target: 'http://localhost:5002', changeOrigin: true }));
app.use('/prescription', createProxyMiddleware({ target: 'http://localhost:5003', changeOrigin: true }));

app.listen(PORT, () => {
    console.log(`🚀 API Gateway running on port ${PORT}`);
});
