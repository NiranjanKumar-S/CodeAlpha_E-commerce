const db = require('../config/database');

const CategoryModel = {
  async getAll() {
    const [rows] = await db.query('SELECT * FROM `categories` ORDER BY `category_name` ASC');
    return rows;
  },

  async findById(categoryId) {
    const [rows] = await db.query('SELECT * FROM `categories` WHERE `category_id` = ?', [categoryId]);
    return rows[0] || null;
  },

  async findBySlug(slug) {
    const [rows] = await db.query('SELECT * FROM `categories` WHERE `slug` = ?', [slug]);
    return rows[0] || null;
  },

  async create({ category_name, slug, description, image }) {
    const [result] = await db.query(
      'INSERT INTO `categories` (`category_name`, `slug`, `description`, `image`) VALUES (?, ?, ?, ?)',
      [category_name, slug, description || '', image || '']
    );
    return result.insertId;
  },

  async update(categoryId, { category_name, slug, description, image }) {
    if (image) {
      const [result] = await db.query(
        'UPDATE `categories` SET `category_name` = ?, `slug` = ?, `description` = ?, `image` = ? WHERE `category_id` = ?',
        [category_name, slug, description, image, categoryId]
      );
      return result.affectedRows > 0;
    } else {
      const [result] = await db.query(
        'UPDATE `categories` SET `category_name` = ?, `slug` = ?, `description` = ? WHERE `category_id` = ?',
        [category_name, slug, description, categoryId]
      );
      return result.affectedRows > 0;
    }
  },

  async delete(categoryId) {
    const [result] = await db.query('DELETE FROM `categories` WHERE `category_id` = ?', [categoryId]);
    return result.affectedRows > 0;
  }
};

module.exports = CategoryModel;
