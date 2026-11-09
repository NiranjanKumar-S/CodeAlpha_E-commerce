const CartModel = require('../models/cartModel');
const CouponModel = require('../models/couponModel');

const CartService = {
  async getCartSummary({ userId, sessionId, couponCode = null }) {
    const cart = await CartModel.findOrCreateCart({ userId, sessionId });
    const rawItems = await CartModel.getCartItems(cart.cart_id);

    let subtotal = 0;
    let itemCount = 0;
    const items = [];

    for (const item of rawItems) {
      const unitPrice = item.discount_price !== null && item.discount_price !== undefined 
        ? parseFloat(item.discount_price) 
        : parseFloat(item.price);
      const itemSubtotal = unitPrice * item.quantity;
      subtotal += itemSubtotal;
      itemCount += item.quantity;

      items.push({
        ...item,
        unitPrice,
        itemSubtotal,
        isOutOfStock: item.stock <= 0,
        isExcessQuantity: item.quantity > item.stock
      });
    }

    // Free shipping over $100, otherwise $15 flat
    const shippingFee = subtotal >= 100 || subtotal === 0 ? 0.00 : 15.00;

    // Apply Coupon if valid
    let discountAmount = 0.00;
    let appliedCoupon = null;

    if (couponCode) {
      const coupon = await CouponModel.findByCode(couponCode);
      if (coupon) {
        if (subtotal >= parseFloat(coupon.min_spend || 0)) {
          if (coupon.discount_type === 'percentage') {
            discountAmount = (subtotal * parseFloat(coupon.discount_value)) / 100;
          } else {
            discountAmount = Math.min(subtotal, parseFloat(coupon.discount_value));
          }
          appliedCoupon = coupon;
        }
      }
    }

    const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);

    return {
      cartId: cart.cart_id,
      items,
      itemCount,
      subtotal: parseFloat(subtotal.toFixed(2)),
      shippingFee: parseFloat(shippingFee.toFixed(2)),
      discountAmount: parseFloat(discountAmount.toFixed(2)),
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      appliedCoupon
    };
  }
};

module.exports = CartService;
