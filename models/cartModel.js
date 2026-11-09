const db = require('../config/database');

const CartModel = {
  async findOrCreateCart({ userId = null, sessionId = null }) {
    let cart = null;

    if (userId) {
      const [rows] = await db.query('SELECT * FROM `carts` WHERE `user_id` = ? LIMIT 1', [userId]);
      if (rows.length > 0) cart = rows[0];
    } else if (sessionId) {
      const [rows] = await db.query('SELECT * FROM `carts` WHERE `session_id` = ? LIMIT 1', [sessionId]);
      if (rows.length > 0) cart = rows[0];
    }

    if (!cart) {
      const [result] = await db.query(
        'INSERT INTO `carts` (`user_id`, `session_id`) VALUES (?, ?)',
        [userId, sessionId]
      );
      cart = {
        cart_id: result.insertId,
        user_id: userId,
        session_id: sessionId
      };
    }

    return cart;
  },

  async getCartItems(cartId) {
    const [rows] = await db.query(
      `SELECT ci.cart_item_id, ci.cart_id, ci.product_id, ci.quantity, 
              p.product_name, p.slug, p.price, p.discount_price, p.stock, p.image, p.status 
       FROM cart_items ci 
       JOIN products p ON ci.product_id = p.product_id 
       WHERE ci.cart_id = ? 
       ORDER BY ci.cart_item_id DESC`,
      [cartId]
    );
    return rows;
  },

  async findCartItem(cartId, productId) {
    const [rows] = await db.query(
      'SELECT * FROM `cart_items` WHERE `cart_id` = ? AND `product_id` = ?',
      [cartId, productId]
    );
    return rows[0] || null;
  },

  async addItem(cartId, productId, quantity = 1) {
    const existing = await this.findCartItem(cartId, productId);
    if (existing) {
      const newQty = existing.quantity + quantity;
      const [result] = await db.query(
        'UPDATE `cart_items` SET `quantity` = ? WHERE `cart_item_id` = ?',
        [newQty, existing.cart_item_id]
      );
      return { cart_item_id: existing.cart_item_id, quantity: newQty };
    } else {
      const [result] = await db.query(
        'INSERT INTO `cart_items` (`cart_id`, `product_id`, `quantity`) VALUES (?, ?, ?)',
        [cartId, productId, quantity]
      );
      return { cart_item_id: result.insertId, quantity };
    }
  },

  async updateItemQuantity(cartItemId, quantity) {
    const [result] = await db.query(
      'UPDATE `cart_items` SET `quantity` = ? WHERE `cart_item_id` = ?',
      [quantity, cartItemId]
    );
    return result.affectedRows > 0;
  },

  async removeItem(cartItemId) {
    const [result] = await db.query(
      'DELETE FROM `cart_items` WHERE `cart_item_id` = ?',
      [cartItemId]
    );
    return result.affectedRows > 0;
  },

  async clearCart(cartId, connection = null) {
    const executor = connection || db;
    const [result] = await executor.query(
      'DELETE FROM `cart_items` WHERE `cart_id` = ?',
      [cartId]
    );
    return result.affectedRows > 0;
  },

  async mergeSessionCartToUser(sessionId, userId) {
    if (!sessionId || !userId) return;

    // Find session cart
    const [sessionCarts] = await db.query('SELECT * FROM `carts` WHERE `session_id` = ?', [sessionId]);
    if (sessionCarts.length === 0) return;
    const sessionCart = sessionCarts[0];

    // Find or create user cart
    const userCart = await this.findOrCreateCart({ userId });

    // Transfer all items
    const [items] = await db.query('SELECT * FROM `cart_items` WHERE `cart_id` = ?', [sessionCart.cart_id]);
    for (const item of items) {
      const existing = await this.findCartItem(userCart.cart_id, item.product_id);
      if (existing) {
        await this.updateItemQuantity(existing.cart_item_id, existing.quantity + item.quantity);
      } else {
        await db.query(
          'INSERT INTO `cart_items` (`cart_id`, `product_id`, `quantity`) VALUES (?, ?, ?)',
          [userCart.cart_id, item.product_id, item.quantity]
        );
      }
    }

    // Clean up old guest cart
    await db.query('DELETE FROM `cart_items` WHERE `cart_id` = ?', [sessionCart.cart_id]);
    await db.query('DELETE FROM `carts` WHERE `cart_id` = ?', [sessionCart.cart_id]);
  }
};

module.exports = CartModel;
