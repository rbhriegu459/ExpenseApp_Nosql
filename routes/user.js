const express = require("express");
const userController= require('../controllers/user-controller');
const authentication  =require('../middleware/auth');
const router = express.Router();
const forgotController = require('../controllers/forgot-controller');

router.get('/forgotpassword', forgotController.forgotPassword);

router.get('/signup', userController.getSignUp);
router.post('/signup', userController.postSignUp);

router.get('/login', userController.getLogin);
router.post('/login', userController.postLogin);

module.exports = router;