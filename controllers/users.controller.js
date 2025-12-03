const User = require("../models/users");

// Add user
exports.addUser = async (req, res) => {
  try {
    const result = await User.create(req.body);
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const result = await User.find();
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};
