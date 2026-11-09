const ProductModel = require('../models/productModel');
const CategoryModel = require('../models/categoryModel');
const OrderModel = require('../models/orderModel');
const UserModel = require('../models/userModel');
const CouponModel = require('../models/couponModel');

const AdminController = {
  async getDashboard(req, res, next) {
    try {
      const stats = await OrderModel.getDashboardStats();
      const totalProducts = await ProductModel.countTotal();
      const totalCustomers = await UserModel.countCustomers();
      const lowStockProducts = await ProductModel.getLowStock(5);
      const recentOrders = (await OrderModel.getAllOrders()).slice(0, 5);

      res.render('admin/dashboard', {
        pageTitle: 'Admin Dashboard — LUXE',
        activeNav: 'dashboard',
        stats: {
          ...stats,
          total_products: totalProducts,
          total_customers: totalCustomers,
          low_stock_count: lowStockProducts.length
        },
        lowStockProducts,
        recentOrders
      });
    } catch (err) {
      next(err);
    }
  },

  // PRODUCTS
  async getProducts(req, res, next) {
    try {
      const products = await ProductModel.getFiltered({ admin: true, limit: 100 });
      res.render('admin/products', {
        pageTitle: 'Manage Products — Admin LUXE',
        activeNav: 'products',
        products
      });
    } catch (err) {
      next(err);
    }
  },

  async getAddProduct(req, res, next) {
    try {
      const categories = await CategoryModel.getAll();
      res.render('admin/product-form', {
        pageTitle: 'Add New Product — Admin LUXE',
        activeNav: 'products',
        categories,
        product: null
      });
    } catch (err) {
      next(err);
    }
  },

  async postAddProduct(req, res, next) {
    try {
      const { product_name, category_id, price, discount_price, stock, description, status, is_featured, is_trending } = req.body;
      const slug = product_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

      let image = req.body.image_url || '';
      if (req.file) {
        image = '/uploads/' + req.file.filename;
      }

      await ProductModel.create({
        category_id: Number(category_id),
        product_name,
        slug: slug + '-' + Math.floor(100 + Math.random() * 900),
        description,
        price: parseFloat(price),
        discount_price: discount_price ? parseFloat(discount_price) : null,
        stock: parseInt(stock, 10),
        image,
        status: status || 'active',
        is_featured: !!is_featured,
        is_trending: !!is_trending
      });

      req.flash('success_msg', 'Product created successfully!');
      res.redirect('/admin/products');
    } catch (err) {
      next(err);
    }
  },

  async getEditProduct(req, res, next) {
    try {
      const { id } = req.params;
      const product = await ProductModel.findById(Number(id));
      if (!product) {
        req.flash('error_msg', 'Product not found.');
        return res.redirect('/admin/products');
      }

      const categories = await CategoryModel.getAll();
      res.render('admin/product-form', {
        pageTitle: `Edit: ${product.product_name} — Admin LUXE`,
        activeNav: 'products',
        categories,
        product
      });
    } catch (err) {
      next(err);
    }
  },

  async postEditProduct(req, res, next) {
    try {
      const { id } = req.params;
      const { product_name, category_id, price, discount_price, stock, description, status, is_featured, is_trending } = req.body;
      const slug = product_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

      const updateData = {
        category_id: Number(category_id),
        product_name,
        slug: slug + '-' + id,
        description,
        price: parseFloat(price),
        discount_price: discount_price ? parseFloat(discount_price) : null,
        stock: Math.max(0, parseInt(stock, 10)),
        status: status || 'active',
        is_featured: !!is_featured,
        is_trending: !!is_trending
      };

      if (req.file) {
        updateData.image = '/uploads/' + req.file.filename;
      } else if (req.body.image_url) {
        updateData.image = req.body.image_url;
      }

      await ProductModel.update(Number(id), updateData);
      req.flash('success_msg', 'Product updated successfully!');
      res.redirect('/admin/products');
    } catch (err) {
      next(err);
    }
  },

  async postDeleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      await ProductModel.delete(Number(id));
      req.flash('success_msg', 'Product deleted successfully.');
      res.redirect('/admin/products');
    } catch (err) {
      next(err);
    }
  },

  // CATEGORIES
  async getCategories(req, res, next) {
    try {
      const categories = await CategoryModel.getAll();
      res.render('admin/categories', {
        pageTitle: 'Manage Categories — Admin LUXE',
        activeNav: 'categories',
        categories
      });
    } catch (err) {
      next(err);
    }
  },

  async postAddCategory(req, res, next) {
    try {
      const { category_name, description, image_url } = req.body;
      const slug = category_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

      let image = image_url || '';
      if (req.file) {
        image = '/uploads/' + req.file.filename;
      }

      await CategoryModel.create({
        category_name,
        slug,
        description,
        image
      });

      req.flash('success_msg', 'Category added successfully!');
      res.redirect('/admin/categories');
    } catch (err) {
      next(err);
    }
  },

  async postDeleteCategory(req, res, next) {
    try {
      const { id } = req.params;
      await CategoryModel.delete(Number(id));
      req.flash('success_msg', 'Category deleted successfully.');
      res.redirect('/admin/categories');
    } catch (err) {
      req.flash('error_msg', 'Cannot delete category containing active products.');
      res.redirect('/admin/categories');
    }
  },

  // ORDERS
  async getOrders(req, res, next) {
    try {
      const orders = await OrderModel.getAllOrders();
      res.render('admin/orders', {
        pageTitle: 'Manage Orders — Admin LUXE',
        activeNav: 'orders',
        orders
      });
    } catch (err) {
      next(err);
    }
  },

  async getOrderDetails(req, res, next) {
    try {
      const { id } = req.params;
      const order = await OrderModel.findById(Number(id));
      if (!order) {
        req.flash('error_msg', 'Order not found.');
        return res.redirect('/admin/orders');
      }

      const items = await OrderModel.getOrderItems(order.order_id);
      res.render('admin/order-details', {
        pageTitle: `Order #${order.order_number} Details — Admin LUXE`,
        activeNav: 'orders',
        order,
        items
      });
    } catch (err) {
      next(err);
    }
  },

  async postUpdateOrderStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { order_status, payment_status } = req.body;
      await OrderModel.updateOrderStatus(Number(id), order_status, payment_status);
      req.flash('success_msg', `Order status updated to ${order_status}.`);
      res.redirect(`/admin/orders/${id}`);
    } catch (err) {
      next(err);
    }
  },

  // CUSTOMERS
  async getCustomers(req, res, next) {
    try {
      const customers = await UserModel.getAllCustomers();
      res.render('admin/customers', {
        pageTitle: 'Registered Customers — Admin LUXE',
        activeNav: 'customers',
        customers
      });
    } catch (err) {
      next(err);
    }
  },

  // INVENTORY
  async getInventory(req, res, next) {
    try {
      const products = await ProductModel.getFiltered({ admin: true, limit: 200 });
      const lowStockProducts = await ProductModel.getLowStock(5);
      res.render('admin/inventory', {
        pageTitle: 'Inventory Tracking & Stock Management — Admin LUXE',
        activeNav: 'inventory',
        products,
        lowStockProducts
      });
    } catch (err) {
      next(err);
    }
  },

  async postUpdateStock(req, res, next) {
    try {
      const { productId, stock } = req.body;
      const newStock = Math.max(0, parseInt(stock, 10));
      await ProductModel.updateStock(Number(productId), newStock);
      req.flash('success_msg', 'Inventory stock level updated.');
      res.redirect('/admin/inventory');
    } catch (err) {
      next(err);
    }
  }
};

module.exports = AdminController;
