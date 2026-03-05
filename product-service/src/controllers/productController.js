const productService = require("../services/productService");
const { validate: isUUID } = require("uuid");
const { logEvent } = require("../utils/logger");


exports.getAllProducts = async (req, res) => {

    try {

        const products = await productService.getAllProducts();

        logEvent({
            event_type: "products_listed",
            event_category: "product",

            request_id: req.requestId,
            method: req.method,
            endpoint: req.originalUrl,
            status_code: 200,
            response_time_ms: req.responseTimeMs || 0,

            source_ip: req.ip,

            message: "Products fetched"
        });

        res.json(products);

    } catch (err) {

        logEvent({
            event_type: "products_list_failed",
            event_category: "product",
            severity: "high",

            request_id: req.requestId,
            method: req.method,
            endpoint: req.originalUrl,
            status_code: 500,
            response_time_ms: req.responseTimeMs || 0,

            source_ip: req.ip,

            message: err.message
        });

        res.status(500).json({ error: err.message });
    }
};



exports.getProductById = async (req, res) => {

    try {

        const { id } = req.params;

        if (!id || !isUUID(id)) {

            logEvent({
                event_type: "product_invalid_id",
                event_category: "product",
                severity: "medium",

                request_id: req.requestId,
                method: req.method,
                endpoint: req.originalUrl,
                status_code: 400,
                response_time_ms: req.responseTimeMs || 0,

                source_ip: req.ip,

                message: "Invalid product ID"
            });

            return res.status(400).json({ error: "Invalid product ID" });
        }

        const product = await productService.getProductById(id);

        if (!product) {

            logEvent({
                event_type: "product_not_found",
                event_category: "product",
                severity: "medium",

                request_id: req.requestId,
                method: req.method,
                endpoint: req.originalUrl,
                status_code: 404,
                response_time_ms: req.responseTimeMs || 0,

                source_ip: req.ip,
                product_id: id,

                message: "Product not found"
            });

            return res.status(404).json({ error: "Product not found" });
        }

        logEvent({
            event_type: "product_viewed",
            event_category: "product",

            request_id: req.requestId,
            method: req.method,
            endpoint: req.originalUrl,
            status_code: 200,
            response_time_ms: req.responseTimeMs || 0,

            source_ip: req.ip,
            product_id: id,

            message: "Product fetched"
        });

        res.json(product);

    } catch (err) {

        logEvent({
            event_type: "product_fetch_failed",
            event_category: "product",
            severity: "high",

            request_id: req.requestId,
            method: req.method,
            endpoint: req.originalUrl,
            status_code: 500,
            response_time_ms: req.responseTimeMs || 0,

            source_ip: req.ip,

            message: err.message
        });

        res.status(500).json({ error: err.message });
    }
};
