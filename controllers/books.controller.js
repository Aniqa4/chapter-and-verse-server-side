const Book = require("../models/books");
const Author = require("../models/authors");
const Publisher = require("../models/publishers");
const Category = require("../models/categories");
const { uploadImage } = require("../utils/cloudinary");

// Get all books
exports.getBooks = async (req, res) => {
  try {
    const result = await Book.find();
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get book by ID
exports.getBook = async (req, res) => {
  try {
    const result = await Book.findById(req.params.id);
    if (!result) return res.status(404).send({ message: 'Book not found.' });
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

// Books by author ID
exports.booksByAuthor = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) return res.status(404).send({ message: 'Author not found.' });

    const result = await Book.find(
      { authorName: author.name },
      { bookName: 1, bookImage: 1, price: 1, soldCopies: 1, availableCopies: 1, category: 1 }
    );

    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Books by publisher ID
exports.booksByPublisher = async (req, res) => {
  try {
    const publisher = await Publisher.findById(req.params.id);
    if (!publisher) return res.status(404).send({ message: 'Publisher not found.' });

    const result = await Book.find(
      { publisherName: publisher.name },
      { bookName: 1, bookImage: 1, price: 1, soldCopies: 1, availableCopies: 1, category: 1 }
    );

    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Books by category ID
exports.booksByCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).send({ message: 'Category not found.' });

    const result = await Book.find(
      { category: category.name },
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
    let bookImage;
    if (req.file) {
      bookImage = await uploadImage(req.file.buffer, req.file.mimetype);
    } else if (req.body.bookImage) {
      bookImage = req.body.bookImage;
    } else {
      return res.status(400).send({ message: 'Book image is required.' });
    }

    const result = await Book.create({ ...req.body, bookImage });
    res.status(201).send({ success: true, message: 'Book added successfully.', data: result });
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update book
exports.updateBook = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.bookImage = await uploadImage(req.file.buffer, req.file.mimetype);
    }

    const result = await Book.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, upsert: true }
    );

    res.send({ success: true, message: 'Book updated successfully.', data: result });
  } catch (error) {
    res.status(500).send(error);
  }
};

// Delete book
exports.deleteBook = async (req, res) => {
  try {
    const result = await Book.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).send({ success: false, message: 'Book not found.' });
    res.send({ success: true, message: 'Book deleted successfully.' });
  } catch (error) {
    res.status(500).send(error);
  }
};
