const { v4: uuidv4 } = require("uuid");
const productRepo = require("../repositories/productRepository");

exports.createProduct = async (data) => {
    const productId = uuidv4();
    await productRepo.createProduct({ id: productId, ...data });
    return productId;
};

exports.getProductById = async (id) => {
    return await productRepo.getProductById(id);
};

exports.getAllProducts = async () => {
    return await productRepo.getAllProducts();
};

exports.updateProduct = async (id, updates) => {
    await productRepo.updateProduct(id, updates);
};

exports.deleteProduct = async (id) => {
    await productRepo.deleteProduct(id);
};

exports.reduceStock = async (id, quantity) => {
    return await productRepo.reduceStock(id, quantity);
};
