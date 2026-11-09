require('dotenv').config();
const mysql = require('mysql2/promise');
const fallbackDb = require('./fallbackDb');

let pool = null;
let isConnectedToMySQL = false;

const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ecommerce_db',
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10),
  queueLimit: 0,
  decimalNumbers: true
};

try {
  pool = mysql.createPool(dbConfig);
} catch (err) {
  console.warn('[Database] Initial pool creation error:', err.message);
}

// Wrapper that attempts MySQL first, falls back to in-memory store if MySQL is offline
const db = {
  isMySQL() {
    return isConnectedToMySQL;
  },

  async query(sql, params = []) {
    if (isConnectedToMySQL && pool) {
      try {
        return await pool.query(sql, params);
      } catch (err) {
        console.error('[MySQL Query Error]:', err.message);
        throw err;
      }
    } else {
      return await fallbackDb.query(sql, params);
    }
  },

  async execute(sql, params = []) {
    if (isConnectedToMySQL && pool) {
      try {
        return await pool.execute(sql, params);
      } catch (err) {
        console.error('[MySQL Execute Error]:', err.message);
        throw err;
      }
    } else {
      return await fallbackDb.execute(sql, params);
    }
  },

  async getConnection() {
    if (isConnectedToMySQL && pool) {
      return await pool.getConnection();
    } else {
      return await fallbackDb.getConnection();
    }
  },

  async testConnection() {
    if (!pool) return false;
    try {
      const conn = await pool.getConnection();
      await conn.ping();
      conn.release();
      isConnectedToMySQL = true;
      console.log('✅ Connected successfully to MySQL database [' + dbConfig.database + ']');
      return true;
    } catch (err) {
      isConnectedToMySQL = false;
      console.warn('⚠️  Could not connect to MySQL (' + err.message + ').');
      console.warn('ℹ️  Running with integrated in-memory fallback store so all features work seamlessly.');
      console.warn('👉 Start MySQL and run `npm run db:init` anytime to switch to your live MySQL instance.');
      return false;
    }
  },

  getRawPool() {
    return pool;
  }
};

module.exports = db;
