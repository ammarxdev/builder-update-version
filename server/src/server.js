// Server entry point
// - Loads environment variables
// - Connects to MongoDB
// - Starts the Express HTTP server and handles startup errors
import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';

dotenv.config();

// Port for the HTTP server (default 5000)
const PORT = process.env.PORT || 5000;

async function start() {
  // Boot sequence: connect to DB, then listen for HTTP requests
  try {
    // Connect to MongoDB using the URI from environment variables
    await connectDB(process.env.MONGODB_URI);

    // Start the Express HTTP server and listen on the specified port
    const server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} in use. Free it or set PORT in .env.`);
      } else {
        console.error('Server error:', err);
      }
      process.exit(1);
    });
  } catch (err) {
    console.error('Fatal startup error:', err);
    process.exit(1);
  }
}

start();