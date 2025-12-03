const Book = require("../models/books");

// Get all books
exports.getBooks = async (req, res) => {
  try {
    const result = await Book.find();
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get book by name
exports.getBook = async (req, res) => {
  try {
    const result = await Book.findOne({ bookName: req.params.bookName });
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Search books by name
exports.searchBooks = async (req, res) => {
  try {
    const regex = new RegExp(req.params.bookName, "i");
    const result = await Book.find(
      { bookName: regex },
      { bookName: 1 }
    ).sort({ bookName: 1 });

    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Featured books
exports.featuredBooks = async (req, res) => {
  try {
    const projection = {
      bookName: 1, bookImage: 1, price: 1,
      availableCopies: 1, soldCopies: 1, category: 1
    };

    const result = await Book.find({}, projection)
      .sort({ bookName: 1 })
      .limit(5);

    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Best selling
exports.bestSelling = async (req, res) => {
  try {
    const result = await Book.find(
      {},
      { bookName: 1, bookImage: 1, price: 1, soldCopies: 1, availableCopies: 1, category: 1 }
    )
      .sort({ soldCopies: -1 })
      .limit(5);

    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

// New arrivals
exports.newArrivals = async (req, res) => {
  try {
    const result = await Book.find(
      {},
      { bookName: 1, bookImage: 1, price: 1, soldCopies: 1, availableCopies: 1, category: 1 }
    )
      .sort({ dateOfArrival: -1 })
      .limit(5);

    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Books by author
exports.booksByAuthor = async (req, res) => {
  try {
    const result = await Book.find(
      { authorName: req.params.authorName },
      { bookName: 1, bookImage: 1, price: 1, soldCopies: 1, availableCopies: 1, category: 1 }
    );

    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Books by publisher
exports.booksByPublisher = async (req, res) => {
  try {
    const result = await Book.find(
      { publisherName: req.params.publisherName },
      { bookName: 1, bookImage: 1, price: 1, soldCopies: 1, availableCopies: 1, category: 1 }
    );

    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Books by category
exports.booksByCategory = async (req, res) => {
  try {
    const result = await Book.find(
      { category: req.params.category },
      { bookName: 1, bookImage: 1, price: 1, soldCopies: 1, availableCopies: 1, category: 1 }
    );

    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Add book
exports.addBook = async (req, res) => {
  try {
    const result = await Book.create(req.body);
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update book
exports.updateBook = async (req, res) => {
  try {
    const result = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, upsert: true }
    );

    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Delete book
exports.deleteBook = async (req, res) => {
  try {
    const result = await Book.findByIdAndDelete(req.params.id);
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};
