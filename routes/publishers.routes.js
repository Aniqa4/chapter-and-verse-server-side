const express = require("express");
const router = express.Router();
const controller = require("../controllers/publishers.controller");

router.get("/publishers", controller.getPublishers);
router.get("/publishers/:id", controller.getPublisher);
router.post("/add-publishers", controller.addPublisher);
router.put("/update-publisher/:id", controller.updatePublisher);
router.delete("/delete-publisher/:id", controller.deletePublisher);

module.exports = router;
