# Vehicle Management System - Backend API

A RESTful API for managing vehicle data built with Node.js, Express, and PostgreSQL.

## Features

- Create new vehicles
- List vehicles with optional filtering by type and status
- PostgreSQL database with ENUM types
- Error handling middleware
- Standardized API responses

## Setup Instructions

### Prerequisites

- Node.js (v14 or newer)
- PostgreSQL database

### Installation Steps

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` and configure your database settings
4. Set up the database by running the SQL script:
   ```bash
   psql -U your_username -d your_database -f init.sql
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Create a New Vehicle

**Endpoint:** `POST /vehicles`

**Description:** Creates a new vehicle entry in the database.

**Request Body (JSON):**

```json
{
  "type": "<VehicleType>",
  "is_locked": <boolean>,
  "speed": <integer>,
  "battery": <integer>,
  "status": "<VehicleStatus>",
  "latitude": <decimal>,
  "longitude": <decimal>
}
```

**Response (201 Created):**

```json
{
  "id": <integer>,
  "type": "<VehicleType>",
  "is_locked": <boolean>,
  "speed": <integer>,
  "battery": <integer>,
  "status": "<VehicleStatus>",
  "latitude": <decimal>,
  "longitude": <decimal>,
  "updated_on": "<timestamp>"
}
```

### Get Vehicles List

**Endpoint:** `GET /vehicles`

**Description:** Retrieves a list of vehicles with optional filters.

**Query Parameters (Optional):**

- `type` (String): Filter by vehicle type (e.g., CAR, SCOOTER)
- `status` (String): Filter by status (e.g., MOVING, PARKING)

**Response (200 OK):**

```json
[
  {
    "id": <integer>,
    "type": "<VehicleType>",
    "is_locked": <boolean>,
    "speed": <integer>,
    "battery": <integer>,
    "status": "<VehicleStatus>",
    "latitude": <decimal>,
    "longitude": <decimal>,
    "updated_on": "<timestamp>"
  }
]
```

## Testing with Postman

### Setup a Postman Collection

1. Create a new Postman collection named "Vehicle Management API"
2. Set up an environment with a variable for your base URL (e.g., `{{baseUrl}}` = `http://localhost:3000`)

### Testing Create Vehicle

1. Create a new POST request to `{{baseUrl}}/vehicles`
2. Set the Content-Type header to `application/json`
3. Add the following JSON body:

```json
{
  "type": "SCOOTER",
  "is_locked": false,
  "speed": 0,
  "battery": 100,
  "status": "PARKING",
  "latitude": 3.142012,
  "longitude": 101.123456
}
```

### Testing Get Vehicles

1. Create a new GET request to `{{baseUrl}}/vehicles`
2. To test filtering, add query parameters:
   - For filtering by type: `{{baseUrl}}/vehicles?type=SCOOTER`
   - For filtering by status: `{{baseUrl}}/vehicles?status=PARKING`
   - For filtering by both: `{{baseUrl}}/vehicles?type=SCOOTER&status=PARKING`
