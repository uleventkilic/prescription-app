const connectRabbitMQ = require('../config/rabbitMQ');
const sendEmail = require('../utils/email');
const { Prescription } = require('../models');

const connectRabbitMQ = require("../config/rabbitmq");

const processNotifications = async () => {
    try {
        const { connection, channel } = await connectRabbitMQ();
        console.log("🔔 Notification service connected to RabbitMQ.");
        // Burada mesaj kuyruğunu işleyecek kodlarını yaz
    } catch (error) {
        console.error("❌ Notification Service Error:", error);
    }
};

module.exports = processNotifications;

