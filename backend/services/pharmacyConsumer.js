const amqp = require('amqplib');
const { Prescription } = require('../models'); // Reçete modelini import edin

const consumeMissingPrescriptions = async () => {
    try {
        console.log('Connecting to RabbitMQ...');
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const queue = 'missing_prescriptions';

        await channel.assertQueue(queue, { durable: true });
        console.log(`Waiting for messages in queue: ${queue}`);

        channel.consume(queue, async (message) => {
            if (message !== null) {
                const prescriptionData = JSON.parse(message.content.toString());
                console.log('Processing prescription:', prescriptionData);

                const prescription = await Prescription.findById(prescriptionData.prescriptionId);
                if (prescription) {
                    prescription.status = 'In Progress'; // Reçete işleniyor
                    await prescription.save();
                    console.log(`Prescription ${prescription._id} status updated to In Progress`);
                }

                channel.ack(message);
            }
        });
    } catch (error) {
        console.error('Error consuming messages:', error.message);
    }
};

module.exports = consumeMissingPrescriptions;
