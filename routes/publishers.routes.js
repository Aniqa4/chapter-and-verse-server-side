const express = require("express");
const router = express.Router();
const controller = require("../controllers/publishers.controller");
const { auth, adminOnly } = require("../middleware/auth");

router.get("/publishers", controller.getPublishers);
router.get("/publishers/:id", controller.getPublisher);

router.post("/add-publishers", auth, adminOnly, controller.addPublisher);
router.put("/update-publisher/:id", auth, adminOnly, controller.updatePublisher);
router.delete("/delete-publisher/:id", auth, adminOnly, controller.deletePublisher);

module.exports = router;
