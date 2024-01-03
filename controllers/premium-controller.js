const User = require('../models/user-model');
const Expense = require('../models/expense-model');
const sequelize = require('../util/database');

const showLeaderboard = async (req,res) =>{
    try{

        // GROUPING THE TABLE AND JOINING THE TABLE TO GET SPECIFIC DATAS
        const userAggregatedExpenses = await User.findAll({
            order:[['total_expenses', "DESC"]]
        });
        
        // ---Brute Force--
        // expenses.forEach((expense) => {

        //     if(userAggregatedExpenses[expense.userId]){
        //         userAggregatedExpenses[expense.userId] = userAggregatedExpenses[expense.userId] + expense.expenseamount;    
        //     }else{
        //         userAggregatedExpenses[expense.userId] = expense.expenseamount;
        //     }
        // })
        // var userLeaderboardDetails = [];
        // users.forEach((user) => {
        //     userLeaderboardDetails.push({name: user.name, total_cost : userAggregatedExpenses[user.id] || 0})
        // })

        // console.log(userLeaderboardDetails);
        
        // userLeaderboardDetails.sort((a,b) => b.total_cost - a.total_cost);
        res.status(200).json(userAggregatedExpenses);
    } 
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
}

module.exports = {showLeaderboard};