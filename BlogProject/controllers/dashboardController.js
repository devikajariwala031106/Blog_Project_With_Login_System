const User = require('../models/User');
const Blog = require('../models/Blog');

exports.getDashboard = async (req, res) => {
  try {
    const totalBlogs = await Blog.countDocuments();
    const totalUsers = await User.countDocuments();
    const recentBlogs = await Blog.find().sort({ createdAt: -1 }).limit(5);

    res.render('dashboard/dashboard', {
      title: 'Dashboard',
      totalBlogs,
      totalUsers,
      recentBlogs
    });
  } catch (error) {
    req.session.messages = [{ type: 'danger', text: 'Unable to load dashboard' }];
    res.redirect('/signin');
  }
};
