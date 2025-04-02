const express = require("express");
const vehicleController = require("../controllers/vehicle.controller");

const router = express.Router();

/**
 * @route POST /vehicles
 * @description Create a new vehicle
 * @access Public
 */
router.post("/", vehicleController.createVehicle);

/**
 * @route GET /vehicles
 * @description Get all vehicles with optional filtering
 * @access Public
 */
router.get("/", vehicleController.getVehicles);

module.exports = router;
