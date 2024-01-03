const path = require("path");
const User = require('../models/user-model');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const getSignUp= (req,res) => {
    res.sendFile(path.join(__dirname,"..", "views", "signup.html"));
};

const postSignUp = async (req,res) =>{
    try{
        const {name, email, password} = req.body;
        const existingUser = await User.findOne({where:{email:email}});
        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        if(existingUser){
            res.status(201).json("User Exists");
        }
        else{
            const newUser = await User.create({name, email, password:hashedPassword});
            res.status(204).json("User Created");
        }
    }
    catch (err) {
        console.error("Signup failed", err);
        res.status(500).json({"Signup failed" : err});
    }
}

// ------------Login-------------

const getLogin= (req,res) => {
    res.sendFile(path.join(__dirname,"..", "views", "login.html"));
};

const postLogin = async (req,res) =>{
    const {email, password} = req.body;
    try{
        const user = await User.findOne({ where: { email } });

        const hashedPassword = user.dataValues.password;
        const passwordMatch = await bcrypt.compare(password, hashedPassword);

        if(user && passwordMatch) {
            console.log(user.dataValues);
            return res.status(201).json({message: 'Login succesful',token: generateAccessToken(user.dataValues.id, user.dataValues.name, user.dataValues.ispremiumuser)});
        }else{
            throw new Error("User doesn't exists, please Sign up first");
        }
    }
    catch(err){
        console.error("Login failed", err);
        res.status(500).json({"Login failed " : err});
    }

}

function generateAccessToken(id, name,ispremiumuser){
    const token= jwt.sign({userId:id, name:name, ispremiumuser} , 'secretkey');
    return token;
}

module.exports = {getSignUp, postSignUp, getLogin, postLogin, generateAccessToken};