const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');
const { ensureAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', mainController.index);

// About Us Page
router.get('/about-us', mainController.aboutUs);

// Register Page
router.get('/register', mainController.showRegister);
router.post('/register', mainController.register);

// Login Page
router.get('/login', mainController.showLogin);
router.post('/login', mainController.login);


// Logout
router.get('/logout', mainController.logout);

// Dashboard
router.get('/dashboard', ensureAuthenticated, mainController.dashboard);

// Manage Goals
router.get('/goals', ensureAuthenticated, mainController.showGoals);
router.post('/goals', ensureAuthenticated, mainController.addGoal);
router.post('/goals/delete/:id', ensureAuthenticated, mainController.deleteGoal);


// Manage Achievements
router.get('/achievements', ensureAuthenticated, mainController.showAchievements);
router.post('/achievements', ensureAuthenticated, mainController.addAchievement);
//router.post('/achievements/delete/:id', ensureAuthenticated, mainController.deleteAchievement);

// Manage Learn Page
router.get('/learn', ensureAuthenticated, mainController.showLearn);
// router.get('/api/facts/:category', mainController.fetchFact);





// Update route handlers 

router.get('/goals/:id/edit', ensureAuthenticated, mainController.showEditGoal);
router.post('/goals/:id/edit', ensureAuthenticated, mainController.updateGoal);

module.exports = router;

