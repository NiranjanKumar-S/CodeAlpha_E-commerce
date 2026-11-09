require('dotenv').config();
const localDb = require('../config/localDb');

function initializeDatabase() {
  console.log('--- Initializing Local Embedded Database ---');
  try {
    localDb.resetDatabase();
    console.log('✅ Local Database reset and seeded with default categories, products, and accounts successfully!');
    console.log('File saved to: database/data.json');
    if (require.main === module) {
      process.exit(0);
    }
  } catch (err) {
    console.error('Database initialization failed:', err.message);
    if (require.main === module) {
      process.exit(1);
    }
  }
}

if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase };
