const Author = require("../models/authors");

// Get all authors
exports.getAuthors = async (req, res) => {
  try {
    const result = await Author.find();
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get single author by ID
exports.getAuthor = async (req, res) => {
  try {
    const result = await Author.findById(req.params.id);
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Add author
exports.addAuthor = async (req, res) => {
  try {
    const result = await Author.create(req.body);
    res.status(201).send({ success: true, message: 'Author added successfully.', data: result });
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update author
exports.updateAuthor = async (req, res) => {
  try {
    const result = await Author.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, upsert: true }
    );
    res.send({ success: true, message: 'Author updated successfully.', data: result });
  } catch (error) {
    res.status(500).send(error);
  }
};

// Delete author
exports.deleteAuthor = async (req, res) => {
  try {
    const result = await Author.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).send({ success: false, message: 'Author not found.' });
    res.send({ success: true, message: 'Author deleted successfully.' });
  } catch (error) {
    res.status(500).send(error);
  }
};
