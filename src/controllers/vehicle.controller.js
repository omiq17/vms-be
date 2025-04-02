const pool = require("../config/db.config");

/**
 * Create a new vehicle
 * @route POST /vehicles
 */
const createVehicle = async (req, res, next) => {
  try {
    const { type, is_locked, speed, battery, status, latitude, longitude } =
      req.body;

    // Validate ENUM values
    if (!["SCOOTER", "CAR"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle type. Must be SCOOTER or CAR",
      });
    }

    if (!["PARKING", "MOVING", "IDLING", "TOWING"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be PARKING, MOVING, IDLING, or TOWING",
      });
    }

    // Validate boolean
    if (typeof is_locked !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Invalid is_locked. Must be a boolean (true or false)",
      });
    }

    // Validate speed (should be between 0 and 200 km/h)
    if (!Number.isInteger(speed) || speed < 0 || speed > 200) {
      return res.status(400).json({
        success: false,
        message: "Invalid speed. Must be an integer between 0 and 200 km/h",
      });
    }

    // Validate battery percentage (should be between 0 and 100)
    if (!Number.isInteger(battery) || battery < 0 || battery > 100) {
      return res.status(400).json({
        success: false,
        message: "Invalid battery. Must be an integer between 0 and 100",
      });
    }

    // Validate latitude (-90 to 90) and longitude (-180 to 180)
    if (
      typeof latitude !== "number" ||
      latitude < -90 ||
      latitude > 90 ||
      typeof longitude !== "number" ||
      longitude < -180 ||
      longitude > 180
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid location. Latitude must be -90 to 90, Longitude -180 to 180",
      });
    }

    const query = `
      INSERT INTO vms.vehicle 
        (type, is_locked, speed, battery, status, latitude, longitude) 
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *
    `;

    const values = [
      type,
      is_locked,
      speed,
      battery,
      status,
      latitude,
      longitude,
    ];
    const result = await pool.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all vehicles with optional filtering
 * @route GET /vehicles
 */
const getVehicles = async (req, res, next) => {
  try {
    const { type, status } = req.query;
    let query = "SELECT * FROM vms.vehicle";
    const values = [];

    // Add filters if provided
    if (type || status) {
      query += " WHERE";

      if (type) {
        query += " type = $1";
        values.push(type);
      }

      if (type && status) {
        query += " AND";
      }

      if (status) {
        query += ` status = $${values.length + 1}`;
        values.push(status);
      }
    }

    // Add ordering
    query += " ORDER BY id ASC";

    const result = await pool.query(query, values);
    res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createVehicle,
  getVehicles,
};
