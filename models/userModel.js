const db = require('../config/database');

const UserModel = {
  async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM `users` WHERE `email` = ?', [email]);
    return rows[0] || null;
  },

  async findById(userId) {
    const [rows] = await db.query('SELECT * FROM `users` WHERE `user_id` = ?', [userId]);
    return rows[0] || null;
  },

  async create({ name, email, phone, password, role = 'customer' }) {
    const [result] = await db.query(
      'INSERT INTO `users` (`name`, `email`, `phone`, `password`, `role`) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, password, role]
    );
    return result.insertId;
  },

  async updateProfile(userId, { name, phone }) {
    const [result] = await db.query(
      'UPDATE `users` SET `name` = ?, `phone` = ? WHERE `user_id` = ?',
      [name, phone, userId]
    );
    return result.affectedRows > 0;
  },

  async updatePassword(userId, hashedPassword) {
    const [result] = await db.query(
      'UPDATE `users` SET `password` = ? WHERE `user_id` = ?',
      [hashedPassword, userId]
    );
    return result.affectedRows > 0;
  },

  async setResetToken(email, token, expiry) {
    const [result] = await db.query(
      'UPDATE `users` SET `reset_token` = ?, `reset_token_expiry` = ? WHERE `email` = ?',
      [token, expiry, email]
    );
    return result.affectedRows > 0;
  },

  async findByResetToken(token) {
    const [rows] = await db.query(
      'SELECT * FROM `users` WHERE `reset_token` = ?',
      [token]
    );
    return rows[0] || null;
  },

  async clearResetToken(userId) {
    const [result] = await db.query(
      'UPDATE `users` SET `reset_token` = NULL, `reset_token_expiry` = NULL WHERE `user_id` = ?',
      [userId]
    );
    return result.affectedRows > 0;
  },

  async getAllCustomers() {
    const [rows] = await db.query(
      'SELECT `user_id`, `name`, `email`, `phone`, `role`, `created_at` FROM `users` WHERE `role` = \'customer\' ORDER BY `user_id` DESC'
    );
    return rows;
  },

  async countCustomers() {
    const [rows] = await db.query(
      'SELECT COUNT(`user_id`) AS `total` FROM `users` WHERE `role` = \'customer\''
    );
    return rows[0]?.total || 0;
  }
};

module.exports = UserModel;
