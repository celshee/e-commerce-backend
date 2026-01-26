const AWS = require("aws-sdk");

AWS.config.update({ region: "ap-south-1" });

const sns = new AWS.SNS();

exports.publishOrderCreated = async (order) => {
    const params = {
        Message: JSON.stringify(order),
        TopicArn: process.env.SNS_TOPIC_ARN
    };

    await sns.publish(params).promise();
};
