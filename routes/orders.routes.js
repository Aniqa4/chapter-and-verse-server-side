const express = require("express");
const router = express.Router();
const controller = require("../controllers/orders.controller");
const { auth, adminOnly, optionalAuth } = require("../middleware/auth");

router.post("/place-order", optionalAuth, controller.placeOrder);
router.get("/my-orders", auth, controller.getUserOrders);

router.get("/orders", auth, adminOnly, controller.getAllOrders);
router.patch("/order-status/:id", auth, adminOnly, controller.updateOrderStatus);
router.patch("/payment-status/:id", auth, adminOnly, controller.updatePaymentStatus);

module.exports = router;
