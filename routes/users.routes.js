const express = require("express");
const router = express.Router();
const controller = require("../controllers/users.controller");
const { auth, adminOnly } = require("../middleware/auth");

router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/verify-email/:token", controller.verifyEmail);

router.get("/users", auth, adminOnly, controller.getUsers);

module.exports = router;
