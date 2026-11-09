require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function initializeDatabase() {
  console.log('--- Initializing MySQL Database ---');
  const dbConfig = {
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  };

  let connection;
  try {
    console.log(`Connecting to MySQL server at ${dbConfig.host}:${dbConfig.port} as ${dbConfig.user}...`);
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected successfully to MySQL server.');

    const schemaPath = path.join(__dirname, 'schema.sql');
    console.log(`Reading schema from ${schemaPath}...`);
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    console.log('Executing schema.sql...');
    await connection.query(schemaSql);
    console.log('Schema tables created successfully.');

    const seedPath = path.join(__dirname, 'seed.sql');
    if (fs.existsSync(seedPath)) {
      console.log(`Reading seed data from ${seedPath}...`);
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      console.log('Executing seed.sql...');
      await connection.query(seedSql);
      console.log('Seed data imported successfully.');
    }

    console.log('Database initialization completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Database initialization failed:', err.message);
    if (err.code === 'ECONNREFUSED') {
      console.error('\nNOTE: MySQL server is not running on ' + dbConfig.host + ':' + dbConfig.port);
      console.error('Please ensure MySQL service or XAMPP/WAMP is running and credentials in .env are correct.');
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase };
