const express = require("express");
const router = express.Router();
const controller = require("../controllers/books.controller");
const { auth, adminOnly } = require("../middleware/auth");

router.get("/books", controller.getBooks);
router.get("/books/:bookName", controller.getBook);
router.get("/search-books/:bookName", controller.searchBooks);
router.get("/featured-books", controller.featuredBooks);
router.get("/best-selling", controller.bestSelling);
router.get("/new-arrivals", controller.newArrivals);
router.get("/books-by-author/:authorName", controller.booksByAuthor);
router.get("/books-by-publisher/:publisherName", controller.booksByPublisher);
router.get("/books-by-category/:category", controller.booksByCategory);

router.post("/add-books", auth, adminOnly, controller.addBook);
router.put("/update-book/:id", auth, adminOnly, controller.updateBook);
router.delete("/delete-book/:id", auth, adminOnly, controller.deleteBook);

module.exports = router;
