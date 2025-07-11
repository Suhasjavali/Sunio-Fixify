const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// import { useNavigate } from "react-router-dom";
// const pool = require("../db");
require("dotenv").config();

const router = express.Router();
const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "sunio fixify",
    password: "suhasjavali",
    port: 5432,
});

pool.connect(() => {
    console.log("data base is connected");
});

// Register Route

router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role, service_type, phone, business_name, license_number, city } = req.body;
        console.log("Registration request:", { name, email, role, service_type, phone, business_name, license_number, city });

        // Check if user already exists
        const userExists = await pool.query(
            "SELECT * FROM service_providers WHERE email = $1",
            [email]
        );
        console.log("Existing user check:", userExists.rows);

        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log("Password hashed successfully");

        if (role === "serviceprovider") {
            // Validate required fields for service provider
            if (!service_type || !phone || !business_name || !license_number || !city) {
                console.log("Missing fields:", { service_type, phone, business_name, license_number, city });
                return res.status(400).json({ message: "All fields are required for service providers" });
            }

            // Insert service provider with all required fields
            const query = `
                INSERT INTO service_providers 
                (name, email, password, role, service_type, phone, business_name, license_number, city) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING id, name, email, role, service_type, city`;
            const values = [name, email, hashedPassword, role, service_type, phone, business_name, license_number, city];
            
            console.log("Executing query:", query);
            console.log("With values:", values);
            
            const result = await pool.query(query, values);
            console.log("Registration successful:", result.rows[0]);
            res.status(201).json({ message: "User registered successfully", ...result.rows[0] });
        } else {
            // Insert customer
            const query = `
                INSERT INTO users 
                (name, email, password, role) 
                VALUES ($1, $2, $3, $4)
                RETURNING id, name, email, role`;
            const values = [name, email, hashedPassword, role];
            
            console.log("Executing query:", query);
            console.log("With values:", values);
            
            const result = await pool.query(query, values);
            console.log("Registration successful:", result.rows[0]);
            res.status(201).json({ message: "User registered successfully", ...result.rows[0] });
        }
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Login Route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Login attempt for:", email);

        // Check service_providers table first
        const providerResult = await pool.query(
            "SELECT * FROM service_providers WHERE email = $1",
            [email]
        );
        console.log("Provider query result:", providerResult.rows);

        if (providerResult.rows.length > 0) {
            const provider = providerResult.rows[0];
            console.log("Found provider:", provider);

            const isMatch = await bcrypt.compare(password, provider.password);
            console.log("Password match:", isMatch);

            if (isMatch) {
                return res.json({
                    id: provider.id,
                    name: provider.name,
                    role: "serviceprovider",
                    service_type: provider.service_type,
                    city: provider.city
                });
            }
        }

        // Check users table if not found in service_providers
        const userResult = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );
        console.log("User query result:", userResult.rows);

        if (userResult.rows.length > 0) {
            const user = userResult.rows[0];
            console.log("Found user:", user);

            const isMatch = await bcrypt.compare(password, user.password);
            console.log("Password match:", isMatch);

            if (isMatch) {
                return res.json({
                    id: user.id,
                    name: user.name,
                    role: "customer"
                });
            }
        }

        console.log("Login failed: Invalid credentials");
        res.status(401).json({ message: "Invalid credentials" });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Ensure `module.exports = router;` is at the end
module.exports = router;
