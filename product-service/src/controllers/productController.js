const productService = require("../services/productService");
const { validate: isUUID } = require("uuid");


exports.createProduct = async (req, res) => {
    try {
        const id = await productService.createProduct(req.body);
        res.status(201).json({ productId: id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



exports.getProductById = async (req, res) => {

    try {
        const { id } = req.params;

        if (!id || !isUUID(id)) {
            return res.status(400).json({
                error: "Invalid product ID"
            });
        }

        const product = await productService.getProductById(id);

        if (!product) {
            return res.status(404).json({
                error: "Product not found"
            });
        }

        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || !isUUID(id)) {
            return res.status(400).json({
                error: "Invalid product ID"
            });
        }

        await productService.updateProduct(id, req.body);
        res.json({ message: "Product updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || !isUUID(id)) {
            return res.status(400).json({
                error: "Invalid product ID"
            });
        }

        await productService.deleteProduct(id);
        res.json({ message: "Product deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
