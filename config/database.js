require('dotenv').config();
const localDb = require('./localDb');

const db = {
  isMySQL() {
    return false;
  },

  async query(sql, params = []) {
    return await localDb.query(sql, params);
  },

  async execute(sql, params = []) {
    return await localDb.execute(sql, params);
  },

  async getConnection() {
    return await localDb.getConnection();
  },

  async testConnection() {
    console.log('✅ Local Persistent Database Engine Active [database/data.json]');
    return true;
  },

  getRawPool() {
    return null;
  }
};

module.exports = db;
