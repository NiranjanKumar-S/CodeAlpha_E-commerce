const express = require('express');
const router = express.Router();
const HomeController = require('../controllers/homeController');

router.get('/', HomeController.getIndex);
router.get('/about', HomeController.getAbout);
router.get('/contact', HomeController.getContact);
router.post('/contact', HomeController.postContact);
router.get('/privacy', HomeController.getPrivacy);
router.get('/terms', HomeController.getTerms);
router.post('/newsletter', HomeController.postNewsletter);

module.exports = router;
