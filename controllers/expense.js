const path = require("path");
const Expense = require('../models/expense');
const User = require('../models/user');
const FileUrlModel = require('../models/downloadFileUrl');
const AWS = require('aws-sdk');
const FileUrl = require("../models/downloadFileUrl");
AWS.config.update({ region: 'ap-south-1' });

const getExpense = async (req,res) =>{
    res.sendFile(path.join(__dirname, "..", "views", "expense.html"));
}

const loadExpense = async (req,res) => {

    try{
      // console.log(req.user.id);
        const expenses = await Expense.find({userId: req.user.id})
        res.status(200).json({expenses, success:true});
    }
    catch(err){
      console.error('Error fetching expenses from database', err);
      res.status(402).json({error:err, success:false});
    }
}

const addExpense = async (req,res) =>{
  try{
      const {amount, description, category} = req.body;
      const userId = req.user.id;

      console.log(userId);
      
      const newExpense = new Expense({amount, description, category, userId});
      await newExpense.save();

      const user = await User.findOne({_id: userId});
      user.total = user.total_expenses + newExpense.amount;
      await user.save();

      res.status(201).json({expenses: newExpense});

    } catch(err){
        res.status(400).json("Expense Not Added");
    }
}

const deleteExpense = async (req,res) =>{
  try{
    const uid = req.params.id;
    console.log("Expense Controller delete id",uid);
    const deleteExpense = await Expense.findById(uid);

    if(deleteExpense) {
        const user = await User.findOne({_id: deleteExpense.userId});
        user.total_expenses = user.total_expenses - deleteExpense.amount;
        await user.save();
        await deleteExpense.remove();
        res.status(204).json({ success: true,message:"deleted successfully"})
    }else{
      throw new Error('ERROR TO DELETE');
    } 
  } catch(err){
    console.error("Unable to delete expense to database", err);
    return res.status(400).json("Can't Delete the item");
  }
}

// ---UPLOADING FILE TO AWS S3------

function uploadToS3(data, filename){
    const BUCKET_NAME = process.env.BUCKET_NAME ;
    const IAM_USER_KEY =  process.env.IAM_USER_KEY;
    const IAM_USER_SECRET =  process.env.IAM_USER_SECRET;

    const s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
      })
  
    //    params Bucket, Key, Body as required by AWS S3
      const params = {                               
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read'
      }

      // return promise instead direct return as uploading is an asynchronous task
    return new Promise((resolve, reject)=>{
        s3bucket.upload(params, async (err, s3response)=>{
          try{
            if(err) {
              console.log("Error uploading file", err);
              reject(err);
            }else{
              console.log('File uploaded successfully', s3response)
              resolve(s3response.Location);
            }
          }catch(err){
            console.log("Waiting to login in AWS for upload", err)
          }
       
        })
      })
}

const downloadExpense = async (req,res) => {
    try{
      const expenses = await Expense.find({_id:req.user._id})
      const stringifiedExpenses = JSON.stringify(expenses);
      const filename = `expense${req.user.id}_${new Date()}.txt`;
      const fileUrl = await uploadToS3(stringifiedExpenses, filename);

      res.status(200).json({fileUrl: fileUrl, success:true, filename: filename});
    }
    catch(err){
        console.log(err);
        res.status(500).json({fileUrl: '' , success:false});
    }

}

module.exports = {getExpense, addExpense, loadExpense, deleteExpense, downloadExpense};