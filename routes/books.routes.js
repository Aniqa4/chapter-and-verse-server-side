const express = require("express");
const router = express.Router();
const controller = require("../controllers/books.controller");
const { auth, adminOnly } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.get("/books", controller.getBooks);
router.get("/books/:id", controller.getBook);
router.get("/search-books/:bookName", controller.searchBooks);
router.get("/featured-books", controller.featuredBooks);
router.get("/best-selling", controller.bestSelling);
router.get("/new-arrivals", controller.newArrivals);
router.get("/books-by-author/:id", controller.booksByAuthor);
router.get("/books-by-publisher/:id", controller.booksByPublisher);
router.get("/books-by-category/:id", controller.booksByCategory);

router.post("/add-books", auth, adminOnly, upload.single('bookImage'), controller.addBook);
router.put("/update-book/:id", auth, adminOnly, upload.single('bookImage'), controller.updateBook);
router.delete("/delete-book/:id", auth, adminOnly, controller.deleteBook);

module.exports = router;
