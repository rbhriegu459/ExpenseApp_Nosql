const path = require("path");
const Expense = require('../models/expense-model');
const User = require('../models/user-model');
const sequelize = require('../util/database');
const FileUrlModel = require('../models/downloadFileUrl');
const AWS = require('aws-sdk');
const FileUrl = require("../models/downloadFileUrl");
AWS.config.update({ region: 'ap-south-1' });

const getExpense = async (req,res) =>{
    res.sendFile(path.join(__dirname, "..", "views", "expense.html"));
}

const loadExpense = async (req,res) => {

    try{
        const expenses = await Expense.findAll({where:{userId: req.user.id}})
        res.status(200).json({expenses, success:true});
    }
    catch(err){
        res.status(402).json({error:err, success:false});
    }
}

const addExpense = async (req,res) =>{
    const t = await sequelize.transaction();
    const {expenseamount, description, category} = req.body;
    const userId = req.user.id;
    console.log(req);
    try{
        const expenses = await Expense.create({expenseamount, description, category, userId}, {transaction: t});
        const total_expenses = Number(req.user.total_expenses) + Number(expenseamount);
        await User.update({total_expenses : total_expenses}, {where:{id:req.user.id}, transaction:t});
        await t.commit();
        res.status(201).json({expenses:expenses});

    } catch(err){
        await t.rollback();
        res.status(400).json("Expense Not Added");
    }
}

const deleteExpense = async (req,res) =>{
    const id = req.params.id;
    const t = await sequelize.transaction();
    try{
        const expense = await Expense.findOne({where: {id:id}});
        // console.log(expense.userId);
        await Expense.destroy({where: {id:id}});
        const te = await User.findOne({where : {id:expense.userId}});
        const updateAmount = te.total_expenses - expense.expenseamount;
        await User.update({total_expenses : updateAmount}, {where:{id:expense.userId}, transaction:t});
        await t.commit();
        return res.status(201).json("Deleted");
    } catch(err){
        await t.rollback();
        return res.status(400).json("Can't Delete the item");
    }
}

// ---UPLOADING FILE TO AWS S3------

function uploadToS3(data, filename){
    const BUCKET_NAME = 'expensetracking459' ;
    const IAM_USER_KEY = 'AKIATYN4LYAAKZOGUJGS' ;
    const IAM_USER_SECRET = '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';

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
        const expenses = await req.user.getExpenses();
        // console.log(expenses);
        const stringyfiedExpenses = JSON.stringify(expenses);
        const filename = `expense${req.user.id}_${new Date()}.txt`;;
        const fileUrl = await uploadToS3(stringyfiedExpenses, filename);

        const fileDetails = {fileURL: fileUrl, userId: req.user.dataValues.id, date: new Date()};
        await FileUrlModel.create(fileDetails);
        res.status(200).json({fileUrl, success:true});
    }
    catch(err){
        console.log(err);
        res.status(500).json({fileUrl: '' , success:false});
    }

}

module.exports = {getExpense, addExpense, loadExpense, deleteExpense, downloadExpense};