const path = require("path");
const Expense = require('../models/expense-model');
const User = require('../models/user-model');
const sequelize = require('../util/database');

const getExpense = async (req,res) =>{
    res.sendFile(path.join(__dirname, "..", "views", "expense.html"));
}

const loadExpense = async (req,res) => {

    Expense.findAll({where:{userId: req.user.id}}).then(expenses => {
        res.status(200).json({expenses, success:true});
    }) 
    .catch(err=> {
        res.status(402).json({error:err, success:false});
    })
}

const addExpense = async (req,res) =>{
    const t = await sequelize.transaction();
    const {expenseamount, description, category} = req.body;
    const userId = req.user.id;
    console.log(req);
    try{
        const expenses = await Expense.create({expenseamount, description, category, userId}, {transaction: t});
        const total_expenses = Number(req.user.total_expenses) + Number(expenseamount);
        await User.update({total_expenses : total_expenses}, {where:{id:req.user.id}, transaction:t});
        await t.commit();
        res.status(201).json({expenses:expenses});

    } catch(err){
        await t.rollback();
        res.status(400).json("Expense Not Added");
    }
}

const deleteExpense = async (req,res) =>{
    const id = req.params.id;
    const t = await sequelize.transaction();
    try{
        const expense = await Expense.findOne({where: {id:id}});
        // console.log(expense.userId);
        await Expense.destroy({where: {id:id}});
        const te = await User.findOne({where : {id:expense.userId}});
        const updateAmount = te.total_expenses - expense.expenseamount;
        await User.update({total_expenses : updateAmount}, {where:{id:expense.userId}, transaction:t});
        await t.commit();
        return res.status(201).json("Deleted");
    } catch(err){
        await t.rollback();
        return res.status(400).json("Can't Delete the item");
    }
}

module.exports = {getExpense, addExpense, loadExpense, deleteExpense};