const Publisher = require("../models/publishers");

// Get all publishers
exports.getPublishers = async (req, res) => {
  try {
    const result = await Publisher.find();
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get publisher by ID
exports.getPublisher = async (req, res) => {
  try {
    const result = await Publisher.findById(req.params.id);
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Add publisher
exports.addPublisher = async (req, res) => {
  try {
    const result = await Publisher.create(req.body);
    res.status(201).send({ success: true, message: 'Publisher added successfully.', data: result });
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update publisher
exports.updatePublisher = async (req, res) => {
  try {
    const result = await Publisher.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, upsert: true }
    );
    res.send({ success: true, message: 'Publisher updated successfully.', data: result });
  } catch (error) {
    res.status(500).send(error);
  }
};

// Delete publisher
exports.deletePublisher = async (req, res) => {
  try {
    const result = await Publisher.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).send({ success: false, message: 'Publisher not found.' });
    res.send({ success: true, message: 'Publisher deleted successfully.' });
  } catch (error) {
    res.status(500).send(error);
  }
};
