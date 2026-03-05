const express = require("express");
const { register, login, logout } = require("../controllers/authController");
const { validateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.post("/logout", validateToken, logout);

router.get("/validate-token", validateToken, (req, res) => {
    res.json({ valid: true, userId: req.user.userId });
});

module.exports = router;