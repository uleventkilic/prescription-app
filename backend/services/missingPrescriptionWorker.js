const amqp = require('amqplib');
const { Prescription } = require('../models'); // Reçete modelini import edin

const processMissingPrescriptions = async () => {
    try {
        console.log('Connecting to RabbitMQ...');
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const queue = 'missing_prescriptions';

        await channel.assertQueue(queue, { durable: true });

        console.log('Fetching incomplete prescriptions...');
        const incompletePrescriptions = await Prescription.find({ status: 'Incomplete' });

        if (incompletePrescriptions.length === 0) {
            console.log('No incomplete prescriptions found.');
            return;
        }

        for (const prescription of incompletePrescriptions) {
            const message = {
                prescriptionId: prescription._id,
                patient: prescription.patient,
                doctor: prescription.doctor,
                medicines: prescription.medicines,
            };
            channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
            console.log(`Added to queue: Prescription ID ${prescription._id}`);
        }

        console.log(`${incompletePrescriptions.length} incomplete prescriptions added to queue.`);
    } catch (error) {
        console.error('Error processing missing prescriptions:', error.message);
    }
};

module.exports = processMissingPrescriptions;
