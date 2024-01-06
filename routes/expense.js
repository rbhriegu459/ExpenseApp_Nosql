const expenseController = require('../controllers/expense-controller');
const authenticate = require('../middleware/auth');
const express = require('express');

const router = express.Router();

router.get('/getExpense' , expenseController.getExpense);
router.post('/addExpense', authenticate.authenticate, expenseController.addExpense);
router.get('/loadExpense', authenticate.authenticate, expenseController.loadExpense);
router.delete('/deleteExpense/:id',expenseController.deleteExpense);
router.get('/download', authenticate.authenticate, expenseController.downloadExpense);

module.exports = router;