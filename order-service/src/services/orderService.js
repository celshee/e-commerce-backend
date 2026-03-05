const { v4: uuidv4 } = require("uuid");
const orderRepo = require("../repositories/orderRepository");
const cartRepo = require("../repositories/cartRepository");

exports.createOrderFromCartItems = async (userId, cartItemIds) => {
  if (!Array.isArray(cartItemIds) || cartItemIds.length === 0) {
    const e = new Error("INVALID_CART_ITEMS");
    e.statusCode = 400;
    throw e;
  }

  const cartItems = await cartRepo.getCartItemsByIdsForUser(userId, cartItemIds);

  if (cartItems.length !== cartItemIds.length) {
    const e = new Error("CART_ITEMS_NOT_FOUND_OR_NOT_OWNED");
    e.statusCode = 404;
    throw e;
  }

  const totalAmount = cartItems.reduce(
    (sum, it) => sum + Number(it.price) * it.quantity,
    0
  );

  const orderId = uuidv4();

  await orderRepo.createOrder({
    id: orderId,
    user_id: userId,
    total_amount: totalAmount,
    status: "CREATED"
  });

  for (const it of cartItems) {
    await orderRepo.addOrderItem({
      id: uuidv4(),
      order_id: orderId,
      product_name: it.product_name,
      price: Number(it.price),
      quantity: it.quantity
    });
  }

  await cartRepo.deleteCartItemsByIdsForUser(userId, cartItemIds);

  return { orderId, totalAmount, status: "CREATED" };
};

function validateItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    const err = new Error("INVALID_ITEMS");
    err.statusCode = 400;
    throw err;
  }

  for (const it of items) {
    if (!it.product_name || typeof it.product_name !== "string") {
      const err = new Error("INVALID_PRODUCT_NAME");
      err.statusCode = 400;
      throw err;
    }
    if (typeof it.price !== "number" || it.price < 0) {
      const err = new Error("INVALID_PRICE");
      err.statusCode = 400;
      throw err;
    }
    if (!Number.isInteger(it.quantity) || it.quantity <= 0) {
      const err = new Error("INVALID_QUANTITY");
      err.statusCode = 400;
      throw err;
    }
  }
}

exports.createOrder = async (userId, items) => {
  validateItems(items);

  const orderId = uuidv4();
  const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

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
      product_name: item.product_name,
      price: item.price,
      quantity: item.quantity
    });
  }

  return { orderId, totalAmount, status: "CREATED" };
};

exports.getOrders = async (userId) => {
  return orderRepo.getOrdersByUser(userId);
};

exports.getOrderDetails = async (orderId) => {
  return orderRepo.getOrderById(orderId);
};