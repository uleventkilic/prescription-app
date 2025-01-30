const amqp = require("amqplib");

const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL || "amqp://localhost");
        const channel = await connection.createChannel();
        console.log("✅ RabbitMQ connected successfully!");
        return { connection, channel };
    } catch (error) {
        console.error("❌ Failed to connect to RabbitMQ:", error);
        process.exit(1);
    }
};

module.exports = connectRabbitMQ;
