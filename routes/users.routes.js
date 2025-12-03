const express = require("express");
const router = express.Router();
const userController = require("../controllers/users.controller");

router.post("/add-users", userController.addUser);
router.get("/users", userController.getUsers);

module.exports = router;
