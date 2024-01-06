const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const FileUrl =sequelize.define('downloadFileUrl', {
    fileURL : {
        type: Sequelize.STRING
    },
    userId: {
        type: Sequelize.INTEGER
    },
    date:{
        type: Sequelize.DATE
    }
    }, 
    { timestamps: false} //disables createdat and updatedat
)

module.exports = FileUrl;