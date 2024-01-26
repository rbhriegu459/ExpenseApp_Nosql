const mongoose = require('mongoose');

const expenseSchema =new mongoose.Schema({
    amount: {
        type: String,
        required:true,
    },
    description:{
        type: String,
        required:true
    },
    category: {
        type: String,
        required:true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    }, 
    { timestamps: false} //disables createdat and updatedat
)

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;