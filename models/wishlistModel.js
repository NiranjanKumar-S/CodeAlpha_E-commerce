const db = require('../config/database');

const WishlistModel = {
  async getByUserId(userId) {
    const [rows] = await db.query(
      `SELECT w.wishlist_id, w.created_at, p.*, c.category_name 
       FROM wishlists w 
       JOIN products p ON w.product_id = p.product_id 
       JOIN categories c ON p.category_id = c.category_id 
       WHERE w.user_id = ? 
       ORDER BY w.wishlist_id DESC`,
      [userId]
    );
    return rows;
  },

  async add(userId, productId) {
    const [result] = await db.query(
      'INSERT INTO wishlists (user_id, product_id) VALUES (?, ?)',
      [userId, productId]
    );
    return result.insertId;
  },

  async remove(userId, productId) {
    const [result] = await db.query(
      'DELETE FROM wishlists WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );
    return result.affectedRows > 0;
  },

  async isWishlisted(userId, productId) {
    if (!userId) return false;
    const [rows] = await db.query(
      'SELECT wishlist_id FROM wishlists WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );
    return rows.length > 0;
  }
};

module.exports = WishlistModel;
