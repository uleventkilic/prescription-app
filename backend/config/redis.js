const Redis = require('ioredis');

const redisClient = new Redis({
    host: '127.0.0.1', // Redis sunucusunun host adresi
    port: 6379, // Redis'in portu
});

redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
});

module.exports = redisClient;
