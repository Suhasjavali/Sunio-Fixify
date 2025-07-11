-- Modify columns to allow NULL values
ALTER TABLE service_providers ALTER COLUMN phone DROP NOT NULL;
ALTER TABLE service_providers ALTER COLUMN business_name DROP NOT NULL;
ALTER TABLE service_providers ALTER COLUMN license_number DROP NOT NULL;
ALTER TABLE service_providers ALTER COLUMN city DROP NOT NULL;
