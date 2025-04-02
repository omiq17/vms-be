-- Step 1: Create schema
CREATE SCHEMA IF NOT EXISTS vms;

-- Step 2: Create ENUM types
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vehicle_status') THEN
        CREATE TYPE vms.vehicle_status AS ENUM ('PARKING', 'MOVING', 'IDLING', 'TOWING');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vehicle_type') THEN
        CREATE TYPE vms.vehicle_type AS ENUM ('SCOOTER', 'CAR');
    END IF;
END$$;

-- Step 3: Create table with ENUM references
CREATE TABLE IF NOT EXISTS vms.vehicle (
    id SERIAL PRIMARY KEY,
    type vms.vehicle_type NOT NULL,  -- Using ENUM for type
    is_locked BOOLEAN DEFAULT false,
    speed INTEGER NOT NULL DEFAULT 0,
    battery INTEGER NOT NULL,
    status vms.vehicle_status NOT NULL,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO vms.vehicle (type, is_locked, speed, battery, status, latitude, longitude, updated_on)
VALUES
    ('SCOOTER', true, 0, 100, 'PARKING', 3.142012, 101.123456, '2019-07-02 09:00:00'),
    ('SCOOTER', false, 5, 75, 'MOVING', 2.125114, 101.654321, '2019-07-02 10:00:00'),
    ('SCOOTER', false, 0, 50, 'IDLING', 4.125114, 102.987654, '2019-07-02 10:00:00'),
    ('SCOOTER', true, 0, 15, 'TOWING', 5.125114, 103.456789, '2019-07-02 10:00:00'),
    ('CAR', true, 0, 0, 'TOWING', 5.125114, 103.456789, '2019-07-02 10:00:00');