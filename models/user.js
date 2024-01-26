const mongoose= require('mongoose');

const userSchema = new mongoose.Schema( {
    name: String,
    email:{
        type:String,
        unique:true,
    },
    password: String,
    ispremiumuser:Boolean,
    total_expenses : {
        type : Number,
        default : 0
    }
    }, 
    { timestamps: false} //disables createdat and updatedat
)

const User =  mongoose.model('User', userSchema);

module.exports = User;