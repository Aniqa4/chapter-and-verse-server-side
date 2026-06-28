const express = require("express");
const router = express.Router();
const controller = require("../controllers/users.controller");
const { auth, adminOnly } = require("../middleware/auth");

router.post("/register", controller.register);
router.post("/resend-verification", controller.resendVerification);
router.post("/login", controller.login);
router.post("/forgot-password", controller.forgotPassword);
router.post("/reset-password/:token", controller.resetPassword);
router.post("/auth/google", controller.googleAuth);
router.get("/auth/google/redirect", controller.googleAuthRedirect);
router.get("/auth/google/callback", controller.googleAuthCallback);
router.get("/verify-email/:token", controller.verifyEmail);

router.post("/logout", auth, controller.logout);
router.post("/refresh-token", auth, controller.refreshToken);
router.get("/me", auth, controller.getMe);
router.patch("/update-profile", auth, controller.updateProfile);
router.get("/users", auth, adminOnly, controller.getUsers);
router.patch("/make-admin/:id", auth, adminOnly, controller.makeAdmin);
router.patch("/remove-admin/:id", auth, adminOnly, controller.removeAdmin);

module.exports = router;
