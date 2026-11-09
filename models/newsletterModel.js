const db = require('../config/database');

const NewsletterModel = {
  async subscribe(email) {
    const [result] = await db.query(
      'INSERT INTO newsletter_subscribers (email) VALUES (?)',
      [email.toLowerCase()]
    );
    return result.affectedRows > 0;
  },

  async getAll() {
    const [rows] = await db.query('SELECT * FROM newsletter_subscribers ORDER BY subscriber_id DESC');
    return rows;
  }
};

module.exports = NewsletterModel;
