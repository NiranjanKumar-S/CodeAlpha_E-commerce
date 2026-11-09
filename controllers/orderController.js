const OrderModel = require('../models/orderModel');

const OrderController = {
  async getOrderSuccess(req, res, next) {
    try {
      const { orderNumber } = req.params;
      const order = await OrderModel.findByOrderNumber(orderNumber);

      if (!order) {
        req.flash('error_msg', 'Order not found.');
        return res.redirect('/');
      }

      const items = await OrderModel.getOrderItems(order.order_id);

      res.render('orders/success', {
        pageTitle: `Order Confirmed #${order.order_number} — LUXE`,
        order,
        items
      });
    } catch (err) {
      next(err);
    }
  },

  async getMyOrders(req, res, next) {
    try {
      const userId = req.session.user.user_id;
      const orders = await OrderModel.getOrdersByUser(userId);

      res.render('orders/index', {
        pageTitle: 'My Order History — LUXE',
        orders
      });
    } catch (err) {
      next(err);
    }
  },

  async getOrderDetails(req, res, next) {
    try {
      const { id } = req.params;
      let order = await OrderModel.findById(Number(id));
      if (!order) {
        order = await OrderModel.findByOrderNumber(id);
      }

      if (!order) {
        req.flash('error_msg', 'Order not found.');
        return res.redirect('/orders/my-orders');
      }

      // Security check: non-admin users can only view their own orders
      if (req.session.user.role !== 'admin' && order.user_id !== req.session.user.user_id) {
        req.flash('error_msg', 'Unauthorized access to this order.');
        return res.redirect('/orders/my-orders');
      }

      const items = await OrderModel.getOrderItems(order.order_id);

      res.render('orders/details', {
        pageTitle: `Order #${order.order_number} — LUXE`,
        order,
        items
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = OrderController;
