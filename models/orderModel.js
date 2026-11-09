const db = require('../config/database');

const OrderModel = {
  async createAddress({ userId, fullName, phone, addressLine, city, state, postalCode }, connection = null) {
    const executor = connection || db;
    const [result] = await executor.query(
      `INSERT INTO addresses (user_id, full_name, phone, address_line, city, state, postal_code) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId || null, fullName, phone, addressLine, city, state, postalCode]
    );
    return result.insertId;
  },

  async createOrder({
    orderNumber,
    userId,
    addressId,
    subtotal,
    shippingFee,
    discountAmount,
    totalAmount,
    couponCode,
    paymentMethod,
    paymentStatus = 'pending',
    orderStatus = 'Pending'
  }, connection = null) {
    const executor = connection || db;
    const [result] = await executor.query(
      `INSERT INTO orders 
       (order_number, user_id, address_id, subtotal, shipping_fee, discount_amount, total_amount, coupon_code, payment_method, payment_status, order_status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderNumber,
        userId || null,
        addressId,
        subtotal,
        shippingFee,
        discountAmount,
        totalAmount,
        couponCode || null,
        paymentMethod,
        paymentStatus,
        orderStatus
      ]
    );
    return result.insertId;
  },

  async addOrderItem({
    orderId,
    productId,
    productName,
    productImage,
    quantity,
    price,
    subtotal
  }, connection = null) {
    const executor = connection || db;
    const [result] = await executor.query(
      `INSERT INTO order_items 
       (order_id, product_id, product_name, product_image, quantity, price, subtotal) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [orderId, productId || null, productName, productImage || null, quantity, price, subtotal]
    );
    return result.insertId;
  },

  async findByOrderNumber(orderNumber) {
    const [rows] = await db.query(
      `SELECT o.*, u.name AS customer_name, u.email AS customer_email, 
              a.full_name, a.phone, a.address_line, a.city, a.state, a.postal_code 
       FROM orders o 
       LEFT JOIN users u ON o.user_id = u.user_id 
       LEFT JOIN addresses a ON o.address_id = a.address_id 
       WHERE o.order_number = ?`,
      [orderNumber]
    );
    return rows[0] || null;
  },

  async findById(orderId) {
    const [rows] = await db.query(
      `SELECT o.*, u.name AS customer_name, u.email AS customer_email, 
              a.full_name, a.phone, a.address_line, a.city, a.state, a.postal_code 
       FROM orders o 
       LEFT JOIN users u ON o.user_id = u.user_id 
       LEFT JOIN addresses a ON o.address_id = a.address_id 
       WHERE o.order_id = ?`,
      [orderId]
    );
    return rows[0] || null;
  },

  async getOrderItems(orderId) {
    const [rows] = await db.query(
      'SELECT * FROM order_items WHERE order_id = ? ORDER BY order_item_id ASC',
      [orderId]
    );
    return rows;
  },

  async getOrdersByUser(userId) {
    const [rows] = await db.query(
      `SELECT o.*, 
              (SELECT COUNT(*) FROM order_items WHERE order_id = o.order_id) AS item_count 
       FROM orders o 
       WHERE o.user_id = ? 
       ORDER BY o.order_id DESC`,
      [userId]
    );
    return rows;
  },

  async getAllOrders() {
    const [rows] = await db.query(
      `SELECT o.*, u.name AS customer_name, u.email AS customer_email,
              (SELECT COUNT(*) FROM order_items WHERE order_id = o.order_id) AS item_count 
       FROM orders o 
       LEFT JOIN users u ON o.user_id = u.user_id 
       ORDER BY o.order_id DESC`
    );
    return rows;
  },

  async updateOrderStatus(orderId, orderStatus, paymentStatus = null) {
    if (paymentStatus) {
      const [result] = await db.query(
        'UPDATE orders SET order_status = ?, payment_status = ? WHERE order_id = ?',
        [orderStatus, paymentStatus, orderId]
      );
      return result.affectedRows > 0;
    } else {
      const [result] = await db.query(
        'UPDATE orders SET order_status = ? WHERE order_id = ?',
        [orderStatus, orderId]
      );
      return result.affectedRows > 0;
    }
  },

  async getDashboardStats() {
    const [salesRows] = await db.query(
      "SELECT COALESCE(SUM(total_amount), 0) AS total_sales, COUNT(order_id) AS total_orders FROM orders WHERE order_status != 'Cancelled'"
    );
    const [pendingRows] = await db.query(
      "SELECT COUNT(order_id) AS pending_orders FROM orders WHERE order_status = 'Pending'"
    );

    return {
      total_sales: parseFloat(salesRows[0]?.total_sales || 0),
      total_orders: parseInt(salesRows[0]?.total_orders || 0, 10),
      pending_orders: parseInt(pendingRows[0]?.pending_orders || 0, 10)
    };
  }
};

module.exports = OrderModel;
