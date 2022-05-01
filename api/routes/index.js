const express = require("express");
const carController = require("../controllers/carController");
const modelController = require("../controllers/modelController");

const router = express.Router();

router.route("/cars")
    .get(carController.getAll)
    .post(carController.addOne);

router.route("/cars/:carId")
    .get(carController.getOne)
    .delete(carController.deleteOne)
    .put(carController.fullUpdate);

router.route("/cars/:carId/models")
    .get(modelController.getAll)
    .post(modelController.addOne); 

router.route("/cars/:carId/models/:modelId")
    .get(modelController.getOne)
    .delete(modelController.deleteOne)
    .put(modelController.fullUpdate);

module.exports = router;