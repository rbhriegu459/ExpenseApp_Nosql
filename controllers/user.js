const path = require("path");
const User = require('../models/user');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const getSignUp= (req,res) => {
    res.sendFile(path.join(__dirname,"..", "views", "signup.html"));
};

const postSignUp = async (req,res) =>{
    try{
        const { name, email, password } = req.body;
        const saltrounds = 10;
        bcrypt.hash(password, saltrounds, async (err, hash) => {
          if (err) throw new Error("Something wrong while hashing password");
          else {
            const existingUser = await User.findOne( { email: email });
            if (existingUser) {
              res.status(400).send("Email already registered");
            } else {
              const newUser = await User.create({ name, email, password: hash });
              //res.redirect("/");
              res.status(201).json({message: 'Signup succesful'});
            }
          }
        });
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
    try {
      const { email, password } = req.body;
      const existingUser = await User.findOne( { email : email }); //if i  do findall it return array and i will have to use user[0]
      if (existingUser) {
        //convert password to hash and compare
        bcrypt.compare(password, existingUser.password, async (err, result) => {
          if (err)
            throw new Error("Trouble matching input password and stored hash");
          else {
            if (result === true){
              console.log("User Login Successful!");
              return res.status(200).json({success: true, message: "User logged in successfully", token: generateAccessToken(existingUser.id, existingUser.name, existingUser.ispremiumuser)});
            }
            else res.status(400).send("Incorrect Password");
          }
        });
      } else res.status(404).send("User not found");
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