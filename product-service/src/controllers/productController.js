const productService = require("../services/productService");

exports.createProduct = async (req, res) => {
    try {
        const id = await productService.createProduct(req.body);

        res.status(201).json({ productId: id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllProducts = async (req, res) => {
    const products = await productService.getAllProducts();
    res.json(products);
};

exports.getProductById = async (req, res) => {
    const product = await productService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
};

exports.updateProduct = async (req, res) => {
    try {
        await productService.updateProduct(req.params.id, req.body);
        res.json({ message: "Product updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        await productService.deleteProduct(req.params.id);
        res.json({ message: "Product deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
