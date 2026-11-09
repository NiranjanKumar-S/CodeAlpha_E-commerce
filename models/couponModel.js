const db = require('../config/database');

const CouponModel = {
  async findByCode(code) {
    const [rows] = await db.query(
      `SELECT * FROM coupons 
       WHERE coupon_code = ? AND status = 'active' AND expiry_date >= CURDATE()`,
      [code.toUpperCase()]
    );
    return rows[0] || null;
  },

  async getAll() {
    const [rows] = await db.query('SELECT * FROM coupons ORDER BY coupon_id DESC');
    return rows;
  },

  async create({ coupon_code, discount_type, discount_value, min_spend, expiry_date, status = 'active' }) {
    const [result] = await db.query(
      `INSERT INTO coupons (coupon_code, discount_type, discount_value, min_spend, expiry_date, status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [coupon_code.toUpperCase(), discount_type, discount_value, min_spend || 0, expiry_date, status]
    );
    return result.insertId;
  }
};

module.exports = CouponModel;
