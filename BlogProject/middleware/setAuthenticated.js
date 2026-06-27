exports.setAuthenticated = (req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.currentUser = req.user || null;
  next();
};

exports.protectRoute = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.messages = [{ type: 'danger', text: 'Please sign in to continue' }];
  res.redirect('/signin');
};

exports.redirectIfAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/dashboard');
  }
  next();
};
