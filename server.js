// Import required modules
const express = require('express');
const mustacheExpress = require('mustache-express');
const path = require('path');
const session = require('express-session');
const routes = require('./routes/index');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('./models/User.js');




// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Set up view engine
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Set up middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

const FileStore = require('session-file-store')(session);


const flash = require('connect-flash');
app.use(flash());


// Set up session
app.use(session({
  secret: "passcode",
  resave: false,
  saveUninitialized: false,
  store: new FileStore({ path: './sessions' }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day in milliseconds
}));

// Set up Passport.js
app.use(passport.initialize());
app.use(passport.session());


app.use(flash());
// Passport.js local strategy
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findByUsername(username);
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return done(null, false, { message: 'Incorrect password.' });
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Set up routes
app.use('/', routes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
