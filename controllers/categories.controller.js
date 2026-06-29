const Category = require("../models/categories");

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const result = await Category.find();
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get only id + name
exports.getCategoryNames = async (req, res) => {
  try {
    const result = await Category.find({}, { name: 1 });
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Add category
exports.addCategory = async (req, res) => {
  try {
    const { name, image, description } = req.body;
    const existing = await Category.findOne({ name });
    if (existing) return res.status(409).send({ success: false, message: 'Category already exists.' });
    const result = await Category.create({ name, image, description });
    res.status(201).send({ success: true, message: 'Category added successfully.', data: result });
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const { name, image, description } = req.body;
    const result = await Category.findByIdAndUpdate(
      req.params.id,
      { name, image, description },
      { new: true }
    );
    if (!result) return res.status(404).send({ success: false, message: 'Category not found.' });
    res.send({ success: true, message: 'Category updated successfully.', data: result });
  } catch (error) {
    res.status(500).send(error);
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const result = await Category.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).send({ success: false, message: 'Category not found.' });
    res.send({ success: true, message: 'Category deleted successfully.' });
  } catch (error) {
    res.status(500).send(error);
  }
};
