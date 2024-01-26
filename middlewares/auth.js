const jwt = require("jsonwebtoken");
const User = require('../models/user');

exports.authenticate = async(req,res, next) =>{
    try{
        const token = req.header('authorization');
        // if(!token) return res.status(401).json({success:false, message:'Token Missing & not authenticated'});

        const user = jwt.verify(token, 'secretkey');
        console.log("user" , user);
        const userid = user.userId;
        await User.findOne({_id: userid}).select('-password')
        .then(users => {
            req.user = users;
            next();
        }) 
        .catch(err => {throw new Error(err)});
    }
    catch(err){
        console.log(err);
        return res.status(401).json({success:false});        
    }
}