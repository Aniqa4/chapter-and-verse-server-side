const express = require("express");
const router = express.Router();
const controller = require("../controllers/authors.controller");
const { auth, adminOnly } = require("../middleware/auth");

router.get("/authors", controller.getAuthors);
router.get("/authors/:id", controller.getAuthor);

router.post("/add-authors", auth, adminOnly, controller.addAuthor);
router.put("/update-author/:id", auth, adminOnly, controller.updateAuthor);
router.delete("/delete-author/:id", auth, adminOnly, controller.deleteAuthor);

module.exports = router;
