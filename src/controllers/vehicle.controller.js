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
