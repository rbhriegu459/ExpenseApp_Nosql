const mongoose= require('mongoose');

const fileUrlSchema = new mongoose.Schema({
    fileURL : String,
    userId: String,
    date: Date
    }, 
    { timestamps: false} //disables createdat and updatedat
)

const FileUrl = mongoose.model('FileUrl', fileUrlSchema);

module.exports = FileUrl;