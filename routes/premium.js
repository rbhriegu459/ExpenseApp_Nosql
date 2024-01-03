const express  = require('express');

const premiumController = require('../controllers/premium-controller');

const authentication = require('../middleware/auth');

const router = express.Router();

router.get('/showLeaderboard', authentication.authenticate, premiumController.showLeaderboard);

module.exports = router;