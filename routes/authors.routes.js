const express = require("express");
const router = express.Router();
const controller = require("../controllers/authors.controller");

router.get("/authors", controller.getAuthors);
router.get("/authors/:id", controller.getAuthor);
router.post("/add-authors", controller.addAuthor);
router.put("/update-author/:id", controller.updateAuthor);
router.delete("/delete-author/:id", controller.deleteAuthor);

module.exports = router;
