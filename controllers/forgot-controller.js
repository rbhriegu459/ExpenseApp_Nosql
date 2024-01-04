const path = require("path");
// const Brevo = require('@getbrevo/brevo');
const Brevo = require('sib-api-v3-sdk');
const {v4:uuidv4} = require('uuid');       
const User = require('../models/user-model');
const Resetpassword = require('../models/password');
const bcrypt = require('bcrypt');

require('dotenv').config();

const forgotPassword = (req,res) => {
    res.sendFile(path.join(__dirname, '..', 'views','forgotPassword.html'));
}

const postForgotPassword = async (req, res) =>{
    try{
            const brevoAPIKey = process.env.BREVO_API_KEY;
            
            const user = await User.findOne({where:{email:req.body.email}});
            if(!user) return res.status(400).json({status:"Fail", message:"Email not found"});
            
            const id = uuidv4();
            await Resetpassword.create({id, userId: user.id, active:true});
            
            //create a brevo instance
            const defaultClient = await Brevo.ApiClient.instance;
            
            var apiKey = defaultClient.authentications['api-key']; //isapi-key an argument?
            
            // console.log(brevoAPIKey);
            apiKey.apiKey = brevoAPIKey;
            
            const transEmailApi = new Brevo.TransactionalEmailsApi();
            await Promise.all([apiKey, transEmailApi]);
            
            const sender = {
                email: "rbhriegu459@gmail.com",
                name: "Rishita Bhriegu",
            };
            const receivers = [req.body];
            
            const path = `http://localhost:3000/user/createNewPassword/${id}`;

            // console.log(path);

            await transEmailApi.sendTransacEmail({
                sender,
                to: receivers,
                subject: "Reset Password",
                textContent: "Click here to reset your password",
                htmlContent: `<a href="${path}">Click Here</a> to reset your password!`,
            });

            res .status(200).json({ status: "Success", message: "Password reset email sent successfully!" });
    
    } catch (error) {
       console.error("Error sending password reset link", error)
      }
}


const createNewPassword = async(req,res) => {
    try{
        const createPassUUID = await Resetpassword.findOne({where:{id:req.params.id}});
        if(!createPassUUID) {
            return res.status(400).json({status:"failed", message:"Invalid Link"});
        }

        const passwordPath = path.join(__dirname, '..', 'views', 'password.html');

        return res.status(200).sendFile(passwordPath);
    } catch(err){
        console.log(err);
    }
}

const updatePassword = async (req,res) =>{
   try{
    // console.log(req.body.password, "<<<< param>>>>", req.params.id);
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 10);
    const resetDb= await Resetpassword.findOne({where : {id: req.params.id}});
    if(resetDb.active){
        const userId = resetDb.userId;
        await User.update({password:hashedPassword} , {where:{id: userId}});
        await Resetpassword.update({active: false}, {where:{id: req.params.id}});
        res.status(201).json("Password Updated successfully");
    } else{
        res.status(400).json({message:"Link Expired"});    
    }
   } catch(err){
        console.log(err);
        res.status(401).json("Reset Password Failed", err);
   }

}

module.exports = {forgotPassword, postForgotPassword, createNewPassword, updatePassword};