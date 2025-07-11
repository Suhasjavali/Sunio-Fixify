-- Check service provider details
SELECT id, name, city, service_type FROM service_providers;

-- Check all requests
SELECT 'carpentry' as type, * FROM carpentry_requests
UNION ALL
SELECT 'plumbing' as type, * FROM plumbing_requests
UNION ALL
SELECT 'electrical' as type, * FROM electrical_requests;
