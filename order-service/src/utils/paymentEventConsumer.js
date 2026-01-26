const AWS = require("aws-sdk");
AWS.config.update({ region: "ap-south-1" });

const sqs = new AWS.SQS();
const queueUrl = process.env.ORDER_PAYMENT_QUEUE_URL;

const orderRepo = require("../repositories/orderRepository"); // for updating order status

exports.consumePaymentEvents = () => {
    setInterval(async () => {
        const params = {
            QueueUrl: queueUrl,
            MaxNumberOfMessages: 10,
            WaitTimeSeconds: 10
        };

        const data = await sqs.receiveMessage(params).promise();
        if (!data.Messages) return;

        for (const message of data.Messages) {
            const paymentEvent = JSON.parse(message.Body);

            const { orderId, status } = paymentEvent;
            const orderStatus = status === "SUCCESS" ? "PAID" : "CANCELLED";

            try {
                await orderRepo.updateOrderStatus(orderId, orderStatus);
                console.log(`Order ${orderId} updated to ${orderStatus}`);
            } catch (err) {
                console.error(`Failed to update order ${orderId}:`, err);
            }

            // Delete message from SQS after processing
            await sqs.deleteMessage({
                QueueUrl: queueUrl,
                ReceiptHandle: message.ReceiptHandle
            }).promise();
        }
    }, 5000);
};
