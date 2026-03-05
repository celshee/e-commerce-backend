const { validate: isUUID } = require("uuid");
const cartRepo = require("../repositories/cartRepository");
const productRepo = require("../repositories/productRepository");

function badRequest(msg) {
  const e = new Error(msg);
  e.statusCode = 400;
  return e;
}

exports.add = async (userId, productId, quantity) => {
  if (!productId || !isUUID(productId)) throw badRequest("INVALID_PRODUCT_ID");
  if (!Number.isInteger(quantity) || quantity <= 0) throw badRequest("INVALID_QUANTITY");

  const product = await productRepo.getProductById(productId);
  if (!product) {
    const e = new Error("PRODUCT_NOT_FOUND");
    e.statusCode = 404;
    throw e;
  }

  // simple stock check (optional, but useful)
  if (product.stock != null && product.stock < quantity) {
    const e = new Error("INSUFFICIENT_STOCK");
    e.statusCode = 409;
    throw e;
  }

  return await cartRepo.addToCart({ userId, productId, quantity });
};

exports.remove = async (userId, productId, quantity) => {
  if (!productId || !isUUID(productId)) throw badRequest("INVALID_PRODUCT_ID");
  if (quantity != null && (!Number.isInteger(quantity) || quantity <= 0)) throw badRequest("INVALID_QUANTITY");

  return await cartRepo.removeFromCart({ userId, productId, quantity });
};

exports.get = async (userId) => {
  const items = await cartRepo.getCart(userId);

  const totalAmount = items.reduce((sum, it) => sum + Number(it.price) * it.quantity, 0);

  return {
    items: items.map(it => ({
      cart_item_id: it.cart_item_id,    
      product_id: it.product_id,
      name: it.name,
      price: Number(it.price),
      quantity: it.quantity,
      line_total: Number(it.price) * it.quantity,
      stock: it.stock
    })),
    totalAmount
  };
};