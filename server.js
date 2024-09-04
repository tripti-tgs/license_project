

const http = require('http');
const app = require('./app');

// Load environment variables
const PORT = process.env.PORT || 3000; // Use the PORT from environment variables or default to 3000

// Create HTTP server
const server = http.createServer(app);

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
