const { validationResult } = require('express-validator');
const Blog = require('../models/Blog');

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.render('blog/table', {
      title: 'Blogs',
      blogs
    });
  } catch (error) {
    req.session.messages = [{ type: 'danger', text: 'Unable to load blogs' }];
    res.redirect('/dashboard');
  }
};

exports.getCreateBlog = (req, res) => {
  res.render('blog/create', {
    title: 'Create Blog',
    errors: [],
    formData: {}
  });
};

exports.postCreateBlog = async (req, res) => {
  const errors = validationResult(req);
  const { title, category, description, imageUrl } = req.body;

  if (!errors.isEmpty()) {
    return res.render('blog/create', {
      title: 'Create Blog',
      errors: errors.array(),
      formData: { title, category, description, imageUrl }
    });
  }

  try {
    await Blog.create({
      title,
      category,
      description,
      imageUrl: imageUrl || undefined,
      author: req.user.name
    });

    req.session.messages = [{ type: 'success', text: 'Blog created successfully' }];
    res.redirect('/blogs');
  } catch (error) {
    req.session.messages = [{ type: 'danger', text: 'Unable to create blog' }];
    res.redirect('/blog/create');
  }
};

exports.getEditBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      req.session.messages = [{ type: 'danger', text: 'Blog not found' }];
      return res.redirect('/blogs');
    }

    res.render('blog/edit', {
      title: 'Edit Blog',
      errors: [],
      blog
    });
  } catch (error) {
    req.session.messages = [{ type: 'danger', text: 'Unable to load blog' }];
    res.redirect('/blogs');
  }
};

exports.updateBlog = async (req, res) => {
  const errors = validationResult(req);
  const { title, category, description, imageUrl } = req.body;

  if (!errors.isEmpty()) {
    return res.render('blog/edit', {
      title: 'Edit Blog',
      errors: errors.array(),
      blog: { _id: req.params.id, title, category, description, imageUrl }
    });
  }

  try {
    await Blog.findByIdAndUpdate(req.params.id, {
      title,
      category,
      description,
      imageUrl
    });

    req.session.messages = [{ type: 'success', text: 'Blog updated successfully' }];
    res.redirect('/blogs');
  } catch (error) {
    req.session.messages = [{ type: 'danger', text: 'Unable to update blog' }];
    res.redirect('/blogs');
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    req.session.messages = [{ type: 'success', text: 'Blog deleted successfully' }];
    res.redirect('/blogs');
  } catch (error) {
    req.session.messages = [{ type: 'danger', text: 'Unable to delete blog' }];
    res.redirect('/blogs');
  }
};
