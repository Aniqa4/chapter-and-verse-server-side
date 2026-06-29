const express = require("express");
const router = express.Router();
const controller = require("../controllers/categories.controller");
const { auth, adminOnly } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.get("/categories", controller.getCategories);
router.get("/names-of-categories", controller.getCategoryNames);
router.post("/add-categories", auth, adminOnly, upload.single('image'), controller.addCategory);
router.put("/update-category/:id", auth, adminOnly, upload.single('image'), controller.updateCategory);
router.delete("/delete-category/:id", auth, adminOnly, controller.deleteCategory);

module.exports = router;
