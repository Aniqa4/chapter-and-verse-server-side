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
