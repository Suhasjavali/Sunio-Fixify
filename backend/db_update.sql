-- Add role column to service_providers table
ALTER TABLE service_providers ADD COLUMN IF NOT EXISTS role VARCHAR(20);

-- Add any missing columns that might be needed
ALTER TABLE service_providers ADD COLUMN IF NOT EXISTS name VARCHAR(100);
ALTER TABLE service_providers ADD COLUMN IF NOT EXISTS email VARCHAR(100);
ALTER TABLE service_providers ADD COLUMN IF NOT EXISTS password VARCHAR(255);
ALTER TABLE service_providers ADD COLUMN IF NOT EXISTS service_type VARCHAR(50);
