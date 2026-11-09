const ProductModel = require('../models/productModel');
const CategoryModel = require('../models/categoryModel');
const NewsletterModel = require('../models/newsletterModel');

const HomeController = {
  async getIndex(req, res, next) {
    try {
      const featuredProducts = await ProductModel.getFeatured(8);
      const trendingProducts = await ProductModel.getTrending(8);
      const latestProducts = await ProductModel.getLatest(8);
      const categories = await CategoryModel.getAll();

      res.render('home/index', {
        pageTitle: 'LUXE — Modern Elegance, Everyday Essentials',
        featuredProducts,
        trendingProducts,
        latestProducts,
        categories
      });
    } catch (err) {
      next(err);
    }
  },

  getAbout(req, res) {
    res.render('home/about', {
      pageTitle: 'About Us — The LUXE Story'
    });
  },

  getContact(req, res) {
    res.render('home/contact', {
      pageTitle: 'Contact Customer Concierge'
    });
  },

  postContact(req, res) {
    const { name, email, subject, message } = req.body;
    req.flash('success_msg', 'Thank you! Your message has been received. Our team will contact you shortly.');
    res.redirect('/contact');
  },

  getPrivacy(req, res) {
    res.render('home/privacy', {
      pageTitle: 'Privacy Policy'
    });
  },

  getTerms(req, res) {
    res.render('home/terms', {
      pageTitle: 'Terms & Conditions'
    });
  },

  async postNewsletter(req, res) {
    try {
      const { email } = req.body;
      if (!email || !email.includes('@')) {
        req.flash('error_msg', 'Please provide a valid email address.');
        return res.redirect('back');
      }
      await NewsletterModel.subscribe(email);
      req.flash('success_msg', 'Welcome to the LUXE VIP circle! You are now subscribed.');
      res.redirect('back');
    } catch (err) {
      req.flash('info_msg', 'You are already registered for our newsletter.');
      res.redirect('back');
    }
  }
};

module.exports = HomeController;
