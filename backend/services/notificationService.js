const connectRabbitMQ = require("../config/rabbitmq");

const processNotifications = async () => {
    try {
        const { connection, channel } = await connectRabbitMQ();
        console.log("🔔 Notification service connected to RabbitMQ.");
    } catch (error) {
        console.error("❌ Notification Service Error:", error);
    }
};

module.exports = processNotifications;
