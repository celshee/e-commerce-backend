const { v4: uuidv4 } = require("uuid");
const orderRepo = require("../repositories/orderRepository");
const eventBus = require("../utils/eventBus");

exports.createOrder = async (userId, items) => {
    const orderId = uuidv4();
    const totalAmount = items.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
    );

    await orderRepo.createOrder({
        id: orderId,
        user_id: userId,
        total_amount: totalAmount,
        status: "CREATED"
    });

    for (const item of items) {
        await orderRepo.addOrderItem({
            id: uuidv4(),
            order_id: orderId,
            ...item
        });
    }

    await eventBus.publishOrderCreated({
        orderId,
        userId,
        items,
        totalAmount,
        status: "CREATED",
        createdAt: new Date().toISOString()
    });

    return { orderId, totalAmount };
};

// exports.getOrders = async (userId) => {
//     return orderRepo.findOrdersByUserId(userId);
// };
//
// exports.getOrderDetails = async (orderId) => {
//     return orderRepo.findOrderById(orderId);
// };

exports.getOrders = async (userId) => {
    return orderRepo.getOrdersByUser(userId);
};

exports.getOrderDetails = async (orderId) => {
    return orderRepo.getOrderById(orderId);
};

