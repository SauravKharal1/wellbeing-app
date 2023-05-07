const User = require('../models/User.js');
const Goal = require('../models/Goal');
const Achievement = require('../models/Achievement');
const passport = require('passport');
const bcrypt = require('bcrypt');


module.exports = {
  aboutUs: (req, res) => {
    const isAuthenticated = req.isAuthenticated();
    res.render('about-us', { isAuthenticated });
  },

  index: (req, res) => {
    const isAuthenticated = req.isAuthenticated();
    res.render('index', { isAuthenticated });
  },
  

  showRegister: (req, res) => {
    const isAuthenticated = req.isAuthenticated();
    res.render('register', { isAuthenticated });
    console.log("Random log test123")
  },

  register: async (req, res) => {
    try {
      const { username, password } = req.body;
      const existingUser = await User.findByUsername(username);
  
      if (existingUser) {
        req.flash('error_msg', 'Username already exists');
        return res.redirect('/register');
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, password: hashedPassword });
      await newUser.save();
  
      req.flash('success_msg', 'You are now registered and can log in');
      res.redirect('/login');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  },

  showLogin: (req, res) => {
    const isAuthenticated = req.isAuthenticated();
    res.render('login', { isAuthenticated });
  },

  login: passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  }),

  dashboard: async (req, res) => {
    try {
      const goals = await Goal.findByUserId(req.user._id);
      const achievements = await Achievement.findByUserId(req.user._id);
      const isAuthenticated = req.isAuthenticated();
      res.render('dashboard', { isAuthenticated, user: req.user, goals, achievements });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  },
  

  logout: (req, res) => {
    req.logout(err => {
      if (err) {
        console.error(err);
        return res.status(500).send('Server error');
      }
      req.flash('success_msg', 'You are logged out');
      res.redirect('/login');
    });
  },

  // Show the learn page


  showLearn: (req, res) => {
    const isAuthenticated = req.isAuthenticated();
    res.render('learn', { isAuthenticated });
  },


  // Handling goals
  showGoals: async (req, res) => {
    try {
      const goals = await Goal.findByUserId(req.user._id);
      const isAuthenticated = req.isAuthenticated();
      res.render('goals', { isAuthenticated, goals });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  },


  addGoal: async (req, res) => {
    try {
      const goal = new Goal({
        userId: req.user._id,
        category: req.body.category,
        description: req.body.description,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        completed: false,
      });
      await goal.save();
      res.redirect('/goals');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  },

  updateGoal: async (req, res) => {
    try {
      await Goal.updateById(req.params.id, req.body);
      res.redirect('/goals');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  },

  deleteGoal: async (req, res) => {
    try {
      await Goal.deleteById(req.params.id);
      res.redirect('/goals');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }

  },

  // Handling achievements
  showAchievements: async (req, res) => {
    try {
      const achievements = await Achievement.findByUserId(req.user._id);
      const goals = await Goal.findByUserId(req.user._id); // Fetch the user's goals
      const isAuthenticated = req.isAuthenticated();
      res.render('achievements', { isAuthenticated, achievements, goals }); // Pass the goals data to the template
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  },

  addAchievement: async (req, res) => {
    try {
      const achievement = new Achievement({
        userId: req.user._id,
        goalId: req.body.goalId,
        description: req.body.description,
        date: req.body.date
      });
      await achievement.save();

      // Update the goal's completed field to true
      await Goal.updateById(req.body.goalId, { completed: true });

      res.redirect('/achievements');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  },

  updateAchievement: async (req, res) => {
    try {
      await Achievement.updateById(req.params.id, req.body);
      res.redirect('/achievements');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  },

  deleteAchievement: async (req, res) => {
    try {
      await Achievement.deleteById(req.params.id);
      res.redirect('/achievements');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  },

  showEditGoal: async (req, res) => {
    try {
      const goal = await Goal.findById(req.params.id);
      const isAuthenticated = req.isAuthenticated();
      res.render('edit_goal', { isAuthenticated, goal });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  },

  editGoal: async (req, res) => {
    const { category, description, startDate, endDate } = req.body;
  
    try {
      const goal = await Goal.findById(req.params.id);
      goal.category = category;
      goal.description = description;
      goal.startDate = startDate;
      goal.endDate = endDate;
  
      await goal.save();
      res.redirect('/goals');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  },
  
};