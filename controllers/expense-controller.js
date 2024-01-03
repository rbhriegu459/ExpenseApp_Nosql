const path = require("path");
const Expense = require('../models/expense-model');

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
    const {expenseamount, description, category} = req.body;
    const userId = req.user.id;
    try{
        const expenses = await Expense.create({expenseamount, description, category, userId});
        res.status(201).json({expenses:expenses});

    } catch(err){
        res.status(400).json("Expense Not Added");
    }
}

const deleteExpense = async (req,res) =>{
    const id = req.params.id;
    try{
        await Expense.destroy({where: {id:id}});
        return res.status(201).json("Deleted");
    } catch(err){
        return res.status(400).json("Can't Delete the item");
    }
}

module.exports = {getExpense, addExpense, loadExpense, deleteExpense};