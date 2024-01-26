const User = require('../models/user');

const showLeaderboard = async (req,res) =>{
    try{

        // GROUPING THE TABLE AND JOINING THE TABLE TO GET SPECIFIC DATAS
        const userAggregatedExpenses = await User.find().sort([['total', 'desc']]);

        res.status(200).json(userAggregatedExpenses);
    } 
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
}

module.exports = {showLeaderboard};