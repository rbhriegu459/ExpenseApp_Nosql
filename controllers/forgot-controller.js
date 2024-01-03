const path = require("path");
require('dotenv').config;

const forgotPassword = (req,res) => {
    res.sendFile(path.join(__dirname, '..', 'views','forgotPassword.html'));
}

const postForgotPassword = async (req, res) =>{

}

module.exports = {forgotPassword};