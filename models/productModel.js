const db = require('../config/database');

const ProductModel = {
  async getFeatured(limit = 8) {
    const [rows] = await db.query(
      `SELECT p.*, c.category_name, c.slug AS category_slug 
       FROM products p 
       JOIN categories c ON p.category_id = c.category_id 
       WHERE p.status = 'active' AND p.is_featured = 1 
       ORDER BY p.product_id DESC LIMIT ?`,
      [limit]
    );
    return rows;
  },

  async getTrending(limit = 8) {
    const [rows] = await db.query(
      `SELECT p.*, c.category_name, c.slug AS category_slug 
       FROM products p 
       JOIN categories c ON p.category_id = c.category_id 
       WHERE p.status = 'active' AND p.is_trending = 1 
       ORDER BY p.product_id DESC LIMIT ?`,
      [limit]
    );
    return rows;
  },

  async getLatest(limit = 8) {
    const [rows] = await db.query(
      `SELECT p.*, c.category_name, c.slug AS category_slug 
       FROM products p 
       JOIN categories c ON p.category_id = c.category_id 
       WHERE p.status = 'active' 
       ORDER BY p.created_at DESC LIMIT ?`,
      [limit]
    );
    return rows;
  },

  async findById(productId) {
    const [rows] = await db.query(
      `SELECT p.*, c.category_name, c.slug AS category_slug 
       FROM products p 
       JOIN categories c ON p.category_id = c.category_id 
       WHERE p.product_id = ?`,
      [productId]
    );
    return rows[0] || null;
  },

  async findBySlug(slug) {
    const [rows] = await db.query(
      `SELECT p.*, c.category_name, c.slug AS category_slug 
       FROM products p 
       JOIN categories c ON p.category_id = c.category_id 
       WHERE p.slug = ?`,
      [slug]
    );
    return rows[0] || null;
  },

  async getRelated(categoryId, currentProductId, limit = 4) {
    const [rows] = await db.query(
      `SELECT p.*, c.category_name, c.slug AS category_slug 
       FROM products p 
       JOIN categories c ON p.category_id = c.category_id 
       WHERE p.category_id = ? AND p.product_id != ? AND p.status = 'active' 
       ORDER BY RAND() LIMIT ?`,
      [categoryId, currentProductId, limit]
    );
    return rows;
  },

  async getFiltered({ categoryId, search, minPrice, maxPrice, sort, page = 1, limit = 9, admin = false }) {
    let sql = `
      SELECT p.*, c.category_name, c.slug AS category_slug 
      FROM products p 
      JOIN categories c ON p.category_id = c.category_id 
      WHERE 1=1 
    `;
    const params = [];

    if (!admin) {
      sql += " AND p.status = 'active'";
    }

    if (categoryId) {
      sql += ' AND p.category_id = ?';
      params.push(categoryId);
    }

    if (search && search.trim() !== '') {
      sql += ' AND (p.product_name LIKE ? OR p.description LIKE ?)';
      const searchTerm = `%${search.trim()}%`;
      params.push(searchTerm, searchTerm);
    }

    if (minPrice !== undefined && minPrice !== null && minPrice !== '') {
      sql += ' AND COALESCE(p.discount_price, p.price) >= ?';
      params.push(parseFloat(minPrice));
    }

    if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') {
      sql += ' AND COALESCE(p.discount_price, p.price) <= ?';
      params.push(parseFloat(maxPrice));
    }

    // Sorting
    if (sort === 'price_asc') {
      sql += ' ORDER BY COALESCE(p.discount_price, p.price) ASC';
    } else if (sort === 'price_desc') {
      sql += ' ORDER BY COALESCE(p.discount_price, p.price) DESC';
    } else if (sort === 'oldest') {
      sql += ' ORDER BY p.product_id ASC';
    } else {
      sql += ' ORDER BY p.product_id DESC';
    }

    // Pagination
    const offset = (page - 1) * limit;
    sql += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const [rows] = await db.query(sql, params);
    return rows;
  },

  async countFiltered({ categoryId, search, minPrice, maxPrice, admin = false }) {
    let sql = `SELECT COUNT(p.product_id) AS total FROM products p WHERE 1=1`;
    const params = [];

    if (!admin) {
      sql += " AND p.status = 'active'";
    }

    if (categoryId) {
      sql += ' AND p.category_id = ?';
      params.push(categoryId);
    }

    if (search && search.trim() !== '') {
      sql += ' AND (p.product_name LIKE ? OR p.description LIKE ?)';
      const searchTerm = `%${search.trim()}%`;
      params.push(searchTerm, searchTerm);
    }

    if (minPrice !== undefined && minPrice !== null && minPrice !== '') {
      sql += ' AND COALESCE(p.discount_price, p.price) >= ?';
      params.push(parseFloat(minPrice));
    }

    if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') {
      sql += ' AND COALESCE(p.discount_price, p.price) <= ?';
      params.push(parseFloat(maxPrice));
    }

    const [rows] = await db.query(sql, params);
    return rows[0]?.total || 0;
  },

  async create(data) {
    const [result] = await db.query(
      `INSERT INTO products 
       (category_id, product_name, slug, description, price, discount_price, stock, image, status, is_featured, is_trending) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.category_id,
        data.product_name,
        data.slug,
        data.description || '',
        data.price,
        data.discount_price || null,
        data.stock || 0,
        data.image || '',
        data.status || 'active',
        data.is_featured ? 1 : 0,
        data.is_trending ? 1 : 0
      ]
    );
    return result.insertId;
  },

  async update(productId, data) {
    let sql = `
      UPDATE products SET 
        category_id = ?, 
        product_name = ?, 
        slug = ?, 
        description = ?, 
        price = ?, 
        discount_price = ?, 
        stock = ?, 
        status = ?, 
        is_featured = ?, 
        is_trending = ?
    `;
    const params = [
      data.category_id,
      data.product_name,
      data.slug,
      data.description || '',
      data.price,
      data.discount_price || null,
      data.stock || 0,
      data.status || 'active',
      data.is_featured ? 1 : 0,
      data.is_trending ? 1 : 0
    ];

    if (data.image) {
      sql += ', image = ?';
      params.push(data.image);
    }

    sql += ' WHERE product_id = ?';
    params.push(productId);

    const [result] = await db.query(sql, params);
    return result.affectedRows > 0;
  },

  async delete(productId) {
    const [result] = await db.query('DELETE FROM products WHERE product_id = ?', [productId]);
    return result.affectedRows > 0;
  },

  async updateStock(productId, stock) {
    const [result] = await db.query('UPDATE products SET stock = ? WHERE product_id = ?', [stock, productId]);
    return result.affectedRows > 0;
  },

  async decreaseStock(productId, qty, connection = null) {
    const executor = connection || db;
    const [result] = await executor.query(
      'UPDATE products SET stock = stock - ? WHERE product_id = ? AND stock >= ?',
      [qty, productId, qty]
    );
    return result.affectedRows > 0;
  },

  async getLowStock(threshold = 5) {
    const [rows] = await db.query(
      `SELECT p.*, c.category_name 
       FROM products p 
       JOIN categories c ON p.category_id = c.category_id 
       WHERE p.stock <= ? 
       ORDER BY p.stock ASC`,
      [threshold]
    );
    return rows;
  },

  async countTotal() {
    const [rows] = await db.query('SELECT COUNT(product_id) AS total FROM products');
    return rows[0]?.total || 0;
  }
};

module.exports = ProductModel;
