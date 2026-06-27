require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const passport = require('./config/passport');
const connectDB = require('./config/database');
const { setAuthenticated } = require('./middleware/setAuthenticated');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const blogRoutes = require('./routes/blogRoutes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(setAuthenticated);

app.use((req, res, next) => {
  res.locals.messages = req.session.messages || [];
  req.session.messages = [];
  next();
});

app.get('/', (req, res) => {
  res.redirect(req.isAuthenticated() ? '/dashboard' : '/signin');
});

app.use(authRoutes);
app.use(dashboardRoutes);
app.use(blogRoutes);

app.use((req, res) => {
  res.status(404).send('Page not found');
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
