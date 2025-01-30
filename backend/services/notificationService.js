const connectRabbitMQ = require('../config/rabbitMQ');
const sendEmail = require('../utils/email');
const { Prescription } = require('../models');

const processNotifications = async () => {
    const connection = await connectRabbitMQ();
    const channel = await connection.createChannel();
    const queue = 'incomplete_prescriptions';

    await channel.assertQueue(queue, { durable: true });

    console.log(`Waiting for messages in queue: ${queue}`);

    channel.consume(queue, async (msg) => {
        if (msg !== null) {
            const { pharmacyEmail, prescriptions } = JSON.parse(msg.content.toString());

            const subject = 'Daily Incomplete Prescription Report';
            const text = `You have ${prescriptions.length} incomplete prescriptions:\n\n${prescriptions.map((p) => `ID: ${p.id}, Missing: ${p.missing}`).join('\n')}`;
            await sendEmail(pharmacyEmail, subject, text);

            channel.ack(msg);
            console.log(`Processed notification for ${pharmacyEmail}`);
        }
    });
};

module.exports = processNotifications;
