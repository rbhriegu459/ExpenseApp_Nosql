const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const User =sequelize.define('users', {
    name: {type: Sequelize.STRING},
    email:{type: Sequelize.STRING},
    password: {type: Sequelize.STRING},
    ispremiumuser: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    total_expenses : {
        type : Sequelize.INTEGER,
        defaultValue : 0
    }
    }, 
    { timestamps: false} //disables createdat and updatedat
)

module.exports = User;