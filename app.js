// app.js

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const licenseRoutes = require('./routes/licenseRoutes'); // Assuming you have a separate routes file

require('dotenv').config();
const app = express();

// Middleware
app.use(morgan('dev')); // Logging middleware
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cors()); // Enable CORS


// Routes
app.use('/api', licenseRoutes); // Use the routes defined in the routes file

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;
