const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');
const { ensureAuthenticated } = require('../config/auth');

// This is the route to manage the main index page in the website
router.get('/', mainController.index);

// This is the route to manage the about page in the website
router.get('/about-us', mainController.aboutUs);

// This is the route to manage the register page in the website
router.get('/register', mainController.showRegister);
router.post('/register', mainController.register);

// This is the route to manage the Login page in the website
router.get('/login', mainController.showLogin);
router.post('/login', mainController.login);


// This is the route to manage the Logout page in the website
router.get('/logout', mainController.logout);

// This is the route to manage the Dashboard page in the website
router.get('/dashboard', ensureAuthenticated, mainController.dashboard);

// This is the route to manage the Manage goals page in the website
router.get('/goals', ensureAuthenticated, mainController.showGoals);
router.post('/goals', ensureAuthenticated, mainController.addGoal);
router.post('/goals/delete/:id', ensureAuthenticated, mainController.deleteGoal);


// This is the route to manage the Manage achievements page in the website
router.get('/achievements', ensureAuthenticated, mainController.showAchievements);
router.post('/achievements', ensureAuthenticated, mainController.addAchievement);
//router.post('/achievements/delete/:id', ensureAuthenticated, mainController.deleteAchievement);

// This is the route to manage the Learn page in the website
router.get('/learn', ensureAuthenticated, mainController.showLearn);


router.get('/goals/:id/edit', ensureAuthenticated, mainController.showEditGoal);
router.post('/goals/:id/edit', ensureAuthenticated, mainController.updateGoal);

module.exports = router;

