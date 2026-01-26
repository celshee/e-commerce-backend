const AWS = require("aws-sdk");
AWS.config.update({ region: "ap-south-1" });

const sqs = new AWS.SQS();
const queueUrl = process.env.SQS_QUEUE_URL;

const paymentService = require("../services/paymentService");

exports.consumeOrderEvents = () => {
    setInterval(async () => {
        const params = {
            QueueUrl: queueUrl,
            MaxNumberOfMessages: 10,
            WaitTimeSeconds: 10
        };

        const data = await sqs.receiveMessage(params).promise();
        if (!data.Messages) return;

        for (const message of data.Messages) {
            const order = JSON.parse(message.Body);
            console.log("Processing payment for order:", order.orderId);

            try {
                const payment = await paymentService.processPayment(order);
                console.log(`Payment ${payment.status} for order ${order.orderId}`);
            } catch (err) {
                console.error("Payment processing failed:", err);
            }

            // Delete message from SQS
            await sqs.deleteMessage({
                QueueUrl: queueUrl,
                ReceiptHandle: message.ReceiptHandle
            }).promise();
        }
    }, 5000);
};
