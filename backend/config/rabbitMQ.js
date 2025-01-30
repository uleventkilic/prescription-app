const useRabbitMQ = process.env.USE_RABBITMQ || "false";

if (useRabbitMQ === "false") {
    console.log("🚀 RabbitMQ devre dışı bırakıldı.");
    module.exports = null;
} else {
    const amqp = require("amqplib");

    const connectRabbitMQ = async () => {
        try {
            const connection = await amqp.connect(process.env.RABBITMQ_URL);
            const channel = await connection.createChannel();
            console.log("✅ RabbitMQ connected successfully!");
            return channel;
        } catch (error) {
            console.error("❌ Failed to connect to RabbitMQ:", error);
            process.exit(1);
        }
    };

    module.exports = connectRabbitMQ;
}
