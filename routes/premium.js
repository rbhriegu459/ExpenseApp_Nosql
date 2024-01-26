const express  = require('express');

const premiumController = require('../controllers/premium');

const authentication = require('../middlewares/auth');

const router = express.Router();

router.get('/showLeaderboard', authentication.authenticate, premiumController.showLeaderboard);

module.exports = router;