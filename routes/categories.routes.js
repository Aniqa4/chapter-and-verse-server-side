const express = require("express");
const router = express.Router();
const controller = require("../controllers/categories.controller");

router.get("/categories", controller.getCategories);
router.get("/names-of-categories", controller.getCategoryNames);

module.exports = router;
