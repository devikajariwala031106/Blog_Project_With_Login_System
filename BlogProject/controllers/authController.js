const bcrypt = require('bcryptjs');
const passport = require('passport');
const { validationResult } = require('express-validator');
const User = require('../models/User');

exports.getSignup = (req, res) => {
  res.render('auth/signup', {
    title: 'Sign Up',
    errors: [],
    formData: {}
  });
};

exports.postSignup = async (req, res) => {
  const errors = validationResult(req);
  const { name, email, password, confirmPassword } = req.body;

  if (!errors.isEmpty()) {
    return res.render('auth/signup', {
      title: 'Sign Up',
      errors: errors.array(),
      formData: { name, email }
    });
  }

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.render('auth/signup', {
        title: 'Sign Up',
        errors: [{ msg: 'Email is already registered' }],
        formData: { name, email }
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    req.session.messages = [{ type: 'success', text: 'Account created successfully. Please sign in.' }];
    res.redirect('/signin');
  } catch (error) {
    req.session.messages = [{ type: 'danger', text: 'Something went wrong. Please try again.' }];
    res.redirect('/signup');
  }
};

exports.getSignin = (req, res) => {
  const rememberedEmail = req.cookies.rememberEmail || '';
  res.render('auth/signin', {
    title: 'Sign In',
    errors: [],
    rememberedEmail
  });
};

exports.postSignin = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render('auth/signin', {
      title: 'Sign In',
      errors: errors.array(),
      rememberedEmail: req.body.email || ''
    });
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      req.session.messages = [{ type: 'danger', text: 'Something went wrong. Please try again.' }];
      return res.redirect('/signin');
    }

    if (!user) {
      return res.render('auth/signin', {
        title: 'Sign In',
        errors: [{ msg: info && info.message ? info.message : 'Invalid credentials' }],
        rememberedEmail: req.body.email || ''
      });
    }

    req.logIn(user, (loginErr) => {
      if (loginErr) {
        req.session.messages = [{ type: 'danger', text: 'Something went wrong. Please try again.' }];
        return res.redirect('/signin');
      }

      if (req.body.rememberMe) {
        res.cookie('rememberEmail', user.email, {
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          sameSite: 'lax'
        });
      } else {
        res.clearCookie('rememberEmail');
      }

      req.session.userId = user.id;
      req.session.userName = user.name;
      req.session.messages = [{ type: 'success', text: `Welcome back, ${user.name}` }];
      res.redirect('/dashboard');
    });
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout(() => {
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.redirect('/signin');
    });
  });
};
