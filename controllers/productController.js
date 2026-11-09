const ProductModel = require('../models/productModel');
const CategoryModel = require('../models/categoryModel');
const ReviewModel = require('../models/reviewModel');
const WishlistModel = require('../models/wishlistModel');

const ProductController = {
  async getAllProducts(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = 9;
      const { category, search, min_price, max_price, sort } = req.query;

      let categoryId = null;
      let activeCategory = null;

      if (category) {
        activeCategory = await CategoryModel.findBySlug(category);
        if (activeCategory) {
          categoryId = activeCategory.category_id;
        }
      }

      const filterArgs = {
        categoryId,
        search,
        minPrice: min_price,
        maxPrice: max_price,
        sort,
        page,
        limit
      };

      const products = await ProductModel.getFiltered(filterArgs);
      const totalCount = await ProductModel.countFiltered(filterArgs);
      const totalPages = Math.ceil(totalCount / limit);
      const categories = await CategoryModel.getAll();

      res.render('products/index', {
        pageTitle: activeCategory ? `${activeCategory.category_name} — LUXE` : 'Explore All Collections — LUXE',
        products,
        categories,
        activeCategory,
        currentPage: page,
        totalPages,
        totalCount,
        query: req.query
      });
    } catch (err) {
      next(err);
    }
  },

  async getByCategory(req, res, next) {
    try {
      const { slug } = req.params;
      const category = await CategoryModel.findBySlug(slug);

      if (!category) {
        req.flash('error_msg', 'Category not found.');
        return res.redirect('/products');
      }

      // Reuse getAllProducts logic by setting query param
      req.query.category = slug;
      return ProductController.getAllProducts(req, res, next);
    } catch (err) {
      next(err);
    }
  },

  async getProductDetails(req, res, next) {
    try {
      const { slug } = req.params;
      let product = await ProductModel.findBySlug(slug);

      // Fallback search by ID if numeric slug
      if (!product && !isNaN(Number(slug))) {
        product = await ProductModel.findById(Number(slug));
      }

      if (!product || product.status !== 'active') {
        req.flash('error_msg', 'The requested product is currently unavailable.');
        return res.redirect('/products');
      }

      const relatedProducts = await ProductModel.getRelated(product.category_id, product.product_id, 4);
      const reviews = await ReviewModel.getByProductId(product.product_id);
      const ratingStats = await ReviewModel.getAverageRating(product.product_id);

      let isWishlisted = false;
      if (req.session.user) {
        isWishlisted = await WishlistModel.isWishlisted(req.session.user.user_id, product.product_id);
      }

      res.render('products/details', {
        pageTitle: `${product.product_name} — LUXE`,
        product,
        relatedProducts,
        reviews,
        ratingStats,
        isWishlisted
      });
    } catch (err) {
      next(err);
    }
  },

  async postReview(req, res, next) {
    try {
      if (!req.session.user) {
        req.flash('error_msg', 'Please sign in to leave a verified product review.');
        return res.redirect('/auth/login');
      }

      const { productId } = req.params;
      const { rating, comment } = req.body;

      if (!rating || rating < 1 || rating > 5) {
        req.flash('error_msg', 'Please select a star rating between 1 and 5.');
        return res.redirect('back');
      }

      await ReviewModel.create({
        userId: req.session.user.user_id,
        productId: Number(productId),
        rating: parseInt(rating, 10),
        comment: comment ? comment.trim() : ''
      });

      req.flash('success_msg', 'Thank you! Your verified review has been published.');
      res.redirect('back');
    } catch (err) {
      next(err);
    }
  }
};

module.exports = ProductController;
