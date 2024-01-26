const mongoose= require('mongoose');

const resetpasswordSchema = new mongoose.Schema({
    uiid: String,
    userId: String,    
    active: Boolean,
    expireby: Date
})

const Resetpassword = mongoose.model('Resetpassword', resetpasswordSchema);

module.exports = Resetpassword;