const express = require("express");
const router = express.Router();
const pool = require("../db");

// Endpoint to handle carpentry service request
router.post("/carpentry", async (req, res) => {
  const { name, phone, city, details } = req.body;

  if (!name || !phone || !city || !details) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO carpentry_requests (name, phone, city, details) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, phone, city, details]
    );
    res.status(201).json({ message: "Request submitted successfully", data: result.rows[0] });
  } catch (error) {
    if (error.code === "23505") { // Unique constraint violation
        res.status(400).json({ message: "Booking already exists for this phone number" });
    } else {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
  }
});

router.post("/plumbing", async (req, res) => {
  const { name, phone, city, details } = req.body;

  if (!name || !phone || !city || !details) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO plumbing_requests (name, phone, city, details) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, phone, city, details]
    );
    res.status(201).json({ message: "Request submitted successfully", data: result.rows[0] });
  } catch (error) {
    if (error.code === "23505") { // Unique constraint violation
        res.status(400).json({ message: "Booking already exists for this phone number" });
    } else {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
  }
});

router.post("/electrical", async (req, res) => {
  const { name, phone, city, details } = req.body;

  if (!name || !phone || !city || !details) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO electrical_requests (name, phone, city, details) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, phone, city, details]
    );
    res.status(201).json({ message: "Request submitted successfully", data: result.rows[0] });
  } catch (error) {
    if (error.code === "23505") { // Unique constraint violation
        res.status(400).json({ message: "Booking already exists for this phone number" });
    } else {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
  }
});


  router.post("/registerservice", async (req, res) => {
    try {
      const { name, email, phone, businessName, licenseNumber, city, serviceType } = req.body;

      const newProvider = await pool.query(
        "INSERT INTO service_providers (name, email, phone, business_name, license_number, city, service_type) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        [name, email, phone, businessName, licenseNumber, city, serviceType] // 
      );

      res.status(201).json(newProvider.rows[0]);
    } catch (err) {
      console.error("Error in /registerservice:", err.message);
      res.status(500).json({ error: "Server error" });
    }
  });


  router.get('/dashboard/:id', async (req, res) => {
    const providerId = req.params.id;
    console.log('Dashboard requested for provider:', providerId);
    
    try {
        // Fetch service provider details
        const provider = await pool.query(
            "SELECT id, city, service_type FROM service_providers WHERE id = $1",
            [providerId]
        );
        console.log('Provider details:', provider.rows[0]);

        if (provider.rows.length === 0) {
            return res.status(404).json({ message: "Service provider not found" });
        }

        const { city, service_type } = provider.rows[0];
        console.log('Provider city:', city, 'service_type:', service_type);

        let tableName = "";
        if (service_type.toLowerCase() === "carpentry") tableName = "carpentry_requests";
        if (service_type.toLowerCase() === "electrical") tableName = "electrical_requests";
        if (service_type.toLowerCase() === "plumbing") tableName = "plumbing_requests";
        console.log('Using table:', tableName);

        if (!tableName) {
            return res.status(400).json({ message: "Invalid service type" });
        }

        // Get pending requests for the provider's city
        const pendingQuery = `
            SELECT 
                id,
                name,
                phone,
                city,
                details,
                isaccepted,
                iscompleted,
                created_at
            FROM ${tableName} 
            WHERE city = $1 
            AND isaccepted = false 
            AND iscompleted = false
            ORDER BY created_at DESC`;

        // Get accepted requests for this specific provider
        const acceptedQuery = `
            SELECT 
                id,
                name,
                phone,
                city,
                details,
                isaccepted,
                iscompleted,
                created_at
            FROM ${tableName} 
            WHERE provider_id = $1 
            AND isaccepted = true 
            AND iscompleted = false
            ORDER BY created_at DESC`;

        const pendingRequests = await pool.query(pendingQuery, [city]);
        const acceptedRequests = await pool.query(acceptedQuery, [providerId]);

        console.log('Pending requests:', pendingRequests.rows.length, 'Accepted requests:', acceptedRequests.rows.length);

        res.json({
            pendingRequests: pendingRequests.rows,
            acceptedRequests: acceptedRequests.rows,
            providerCity: city,
            serviceType: service_type
        });
    } catch (error) {
        console.error("Error fetching requests:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Accept a service request
router.post('/acceptRequest', async (req, res) => {
    try {
        const { providerId, requestId, serviceType } = req.body;
        console.log('Accept request:', { providerId, requestId, serviceType });

        let tableName = "";
        if (serviceType.toLowerCase() === "carpentry") tableName = "carpentry_requests";
        if (serviceType.toLowerCase() === "electrical") tableName = "electrical_requests";
        if (serviceType.toLowerCase() === "plumbing") tableName = "plumbing_requests";
        console.log('Using table:', tableName);

        if (!tableName) {
            return res.status(400).json({ message: "Invalid service type" });
        }

        // First check if the request is still available
        const checkQuery = `
            SELECT isaccepted 
            FROM ${tableName} 
            WHERE id = $1`;
        const checkResult = await pool.query(checkQuery, [requestId]);
        console.log('Check result:', checkResult.rows[0]);

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ message: "Request not found" });
        }

        if (checkResult.rows[0].isaccepted) {
            return res.status(400).json({ message: "Request already accepted" });
        }

        // Update the request
        const updateQuery = `
            UPDATE ${tableName}
            SET isaccepted = true,
                provider_id = $1,
                accepted_at = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING *`;
        const result = await pool.query(updateQuery, [providerId, requestId]);
        console.log('Update result:', result.rows[0]);

        // Return the updated request data
        res.json({
            message: "Request accepted successfully",
            request: result.rows[0]
        });
    } catch (error) {
        console.error("Error accepting request:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Complete a service request
router.post('/completeRequest', async (req, res) => {
    try {
        const { providerId, requestId, serviceType } = req.body;
        console.log('Complete request:', { providerId, requestId, serviceType });

        let tableName = "";
        if (serviceType.toLowerCase() === "carpentry") tableName = "carpentry_requests";
        if (serviceType.toLowerCase() === "electrical") tableName = "electrical_requests";
        if (serviceType.toLowerCase() === "plumbing") tableName = "plumbing_requests";

        if (!tableName) {
            return res.status(400).json({ message: "Invalid service type" });
        }

        // First check if the request belongs to this provider
        const checkQuery = `
            SELECT provider_id, iscompleted 
            FROM ${tableName} 
            WHERE id = $1`;
        const checkResult = await pool.query(checkQuery, [requestId]);

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ message: "Request not found" });
        }

        if (checkResult.rows[0].provider_id !== providerId) {
            return res.status(403).json({ message: "Not authorized to complete this request" });
        }

        if (checkResult.rows[0].iscompleted) {
            return res.status(400).json({ message: "Request already completed" });
        }

        // Delete the completed request
        const deleteQuery = `
            DELETE FROM ${tableName}
            WHERE id = $1
            AND provider_id = $2
            RETURNING *`;

        const result = await pool.query(deleteQuery, [requestId, providerId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Request not found or already deleted" });
        }

        res.json({ message: "Request completed and removed successfully", data: result.rows[0] });
    } catch (error) {
        console.error("Error completing request:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
