const amqp = require('amqplib');

const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
        console.log('Connected to RabbitMQ');
        return connection;
    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error.message);
        process.exit(1);
    }
};

module.exports = connectRabbitMQ;
