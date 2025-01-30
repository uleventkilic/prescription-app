const redis = require("redis");

const redisClient = redis.createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.connect()
    .then(() => console.log("✅ Redis is connected and ready to use"))
    .catch(err => console.error("❌ Redis connection error:", err));

module.exports = redisClient;
