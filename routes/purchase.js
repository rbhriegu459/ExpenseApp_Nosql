const express = require("express");

const purchaseController = require('../controllers/purchase');
const authentication = require('../middleware/auth');

const router = express.Router();

router.get('/permiummembership', authentication.authenticate, purchaseController.purchasePremium);

router.post('/updatetransactionstatus', authentication.authenticate, purchaseController.updateTransactionStatus);

module.exports = router;