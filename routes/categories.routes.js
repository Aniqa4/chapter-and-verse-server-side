const express = require("express");
const router = express.Router();
const controller = require("../controllers/categories.controller");
const { auth, adminOnly } = require("../middleware/auth");

router.get("/categories", controller.getCategories);
router.get("/names-of-categories", controller.getCategoryNames);
router.post("/add-categories", auth, adminOnly, controller.addCategory);

module.exports = router;
