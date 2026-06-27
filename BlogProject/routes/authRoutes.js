const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { redirectIfAuthenticated } = require('../middleware/setAuthenticated');

router.get('/signup', redirectIfAuthenticated, authController.getSignup);

router.post(
  '/signup',
  redirectIfAuthenticated,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().isEmail().withMessage('Enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('confirmPassword').custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match')
  ],
  authController.postSignup
);

router.get('/signin', redirectIfAuthenticated, authController.getSignin);

router.post(
  '/signin',
  redirectIfAuthenticated,
  [
    body('email').trim().isEmail().withMessage('Enter a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  authController.postSignin
);

router.get('/logout', authController.logout);

module.exports = router;
