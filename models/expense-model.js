const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Expense =sequelize.define('expenses', {
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    expenseamount: {type: Sequelize.INTEGER},
    description:{type: Sequelize.STRING},
    category: {type: Sequelize.STRING},
    }, 
    { timestamps: false} //disables createdat and updatedat
)

module.exports = Expense;