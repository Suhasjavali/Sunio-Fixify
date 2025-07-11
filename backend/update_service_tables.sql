-- Add provider_id and timestamps to carpentry_requests
ALTER TABLE carpentry_requests 
ADD COLUMN IF NOT EXISTS provider_id INTEGER,
ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP;

-- Add provider_id and timestamps to electrical_requests
ALTER TABLE electrical_requests 
ADD COLUMN IF NOT EXISTS provider_id INTEGER,
ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP;

-- Add provider_id and timestamps to plumbing_requests
ALTER TABLE plumbing_requests 
ADD COLUMN IF NOT EXISTS provider_id INTEGER,
ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP;
