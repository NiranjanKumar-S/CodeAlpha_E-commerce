const db = require('../config/database');
const CartService = require('./cartService');
const InventoryService = require('./inventoryService');
const OrderModel = require('../models/orderModel');
const CartModel = require('../models/cartModel');
const ProductModel = require('../models/productModel');

const OrderService = {
  async processOrder({
    userId,
    sessionId,
    customerDetails,
    paymentMethod = 'cod',
    couponCode = null
  }) {
    // 1. Get cart summary and recalculate totals on server
    const cartSummary = await CartService.getCartSummary({ userId, sessionId, couponCode });

    if (!cartSummary.items || cartSummary.items.length === 0) {
      throw new Error('Your cart is empty.');
    }

    // 2. Validate stock for all items
    const stockCheck = await InventoryService.verifyCartStock(cartSummary.items);
    if (!stockCheck.available) {
      throw new Error(stockCheck.message);
    }

    // 3. Generate Unique Order Number
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ORD-${dateStr}-${randSuffix}`;

    // 4. Begin Database Transaction
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Create delivery address
      const addressId = await OrderModel.createAddress({
        userId,
        fullName: customerDetails.fullName,
        phone: customerDetails.phone,
        addressLine: customerDetails.addressLine,
        city: customerDetails.city,
        state: customerDetails.state,
        postalCode: customerDetails.postalCode
      }, connection);

      // Create Order
      const paymentStatus = paymentMethod === 'online' ? 'pending' : 'pending';
      const orderId = await OrderModel.createOrder({
        orderNumber,
        userId,
        addressId,
        subtotal: cartSummary.subtotal,
        shippingFee: cartSummary.shippingFee,
        discountAmount: cartSummary.discountAmount,
        totalAmount: cartSummary.totalAmount,
        couponCode: cartSummary.appliedCoupon ? cartSummary.appliedCoupon.coupon_code : null,
        paymentMethod,
        paymentStatus,
        orderStatus: 'Pending'
      }, connection);

      // Create Order Items and decrease stock
      for (const item of cartSummary.items) {
        await OrderModel.addOrderItem({
          orderId,
          productId: item.product_id,
          productName: item.product_name,
          productImage: item.image,
          quantity: item.quantity,
          price: item.unitPrice,
          subtotal: item.itemSubtotal
        }, connection);

        const decreased = await ProductModel.decreaseStock(item.product_id, item.quantity, connection);
        if (!decreased) {
          throw new Error(`Insufficient inventory while finalizing item: ${item.product_name}`);
        }
      }

      // Clear customer's cart
      await CartModel.clearCart(cartSummary.cartId, connection);

      // Commit transaction
      await connection.commit();

      return {
        success: true,
        orderId,
        orderNumber,
        totalAmount: cartSummary.totalAmount
      };
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }
};

module.exports = OrderService;
