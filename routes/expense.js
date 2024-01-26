const expenseController = require('../controllers/expense');
const authenticate = require('../middlewares/auth');
const express = require('express');

const router = express.Router();

router.get('/getExpense' , expenseController.getExpense);
router.post('/addExpense', authenticate.authenticate, expenseController.addExpense);
router.get('/loadExpense', authenticate.authenticate, expenseController.loadExpense);
router.delete('/deleteExpense/:id',expenseController.deleteExpense);
router.get('/download', authenticate.authenticate, expenseController.downloadExpense);

module.exports = router;