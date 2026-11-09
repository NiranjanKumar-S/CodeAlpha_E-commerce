const ProductModel = require('../models/productModel');

const InventoryService = {
  async verifyStock(productId, requestedQuantity) {
    const product = await ProductModel.findById(productId);
    if (!product) {
      return { available: false, message: 'Product not found.' };
    }
    if (product.status !== 'active') {
      return { available: false, message: 'Product is currently inactive.' };
    }
    if (product.stock < requestedQuantity) {
      return { 
        available: false, 
        message: `Only ${product.stock} units available in stock for ${product.product_name}.`,
        currentStock: product.stock
      };
    }
    return { available: true, product };
  },

  async verifyCartStock(items) {
    for (const item of items) {
      const check = await this.verifyStock(item.product_id, item.quantity);
      if (!check.available) {
        return check;
      }
    }
    return { available: true };
  }
};

module.exports = InventoryService;
