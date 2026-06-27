const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const blogController = require('../controllers/blogController');
const { protectRoute } = require('../middleware/setAuthenticated');

const blogValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('description').trim().notEmpty().withMessage('Description is required')
];

router.get('/blogs', protectRoute, blogController.getAllBlogs);
router.get('/blog/create', protectRoute, blogController.getCreateBlog);
router.post('/blog/create', protectRoute, blogValidation, blogController.postCreateBlog);
router.get('/blog/edit/:id', protectRoute, blogController.getEditBlog);
router.put('/blog/edit/:id', protectRoute, blogValidation, blogController.updateBlog);
router.delete('/blog/delete/:id', protectRoute, blogController.deleteBlog);

module.exports = router;
