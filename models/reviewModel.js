const db = require('../config/database');

const ReviewModel = {
  async getByProductId(productId) {
    const [rows] = await db.query(
      `SELECT r.*, u.name AS user_name 
       FROM reviews r 
       JOIN users u ON r.user_id = u.user_id 
       WHERE r.product_id = ? 
       ORDER BY r.review_id DESC`,
      [productId]
    );
    return rows;
  },

  async create({ userId, productId, rating, comment }) {
    const [result] = await db.query(
      'INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)',
      [userId, productId, rating, comment]
    );
    return result.insertId;
  },

  async getAverageRating(productId) {
    const [rows] = await db.query(
      'SELECT AVG(rating) as avg_rating, COUNT(review_id) as review_count FROM reviews WHERE product_id = ?',
      [productId]
    );
    return {
      avg_rating: rows[0]?.avg_rating ? parseFloat(rows[0].avg_rating).toFixed(1) : '5.0',
      review_count: rows[0]?.review_count || 0
    };
  }
};

module.exports = ReviewModel;
