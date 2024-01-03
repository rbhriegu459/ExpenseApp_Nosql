const expressController = require('../controllers/expense-controller');
const authenticate = require('../middleware/auth');
const express = require('express');

const router = express.Router();

router.get('/getExpense' , expressController.getExpense);
router.post('/addExpense', authenticate.authenticate, expressController.addExpense);
router.get('/loadExpense', authenticate.authenticate, expressController.loadExpense);
router.delete('/deleteExpense/:id',expressController.deleteExpense);


module.exports = router;