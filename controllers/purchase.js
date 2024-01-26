const Razorpay= require('razorpay');
const Order = require('../models/order');

require('dotenv').config();

const purchasePremium = (req,res) => {
    try{
        var rzp = new Razorpay({
            key_id: process.env.RZP_API_KEY ,
            key_secret: process.env.RZP_SECRET_KEY
        })

        var options = {
            amount:2500,
            currency:'INR',
            receipt:'rcp1'
          };

        rzp.orders.create(options, async function(err, order) {
            if(err){
                console.log(err);
            } 
            const createdOrder =new Order({orderid:order.id, status:'PENDING'})
            createdOrder.save();
            await req.user.save();
            return res.status(201).json({order, key_id:rzp.key_id});
          })
    } catch(err){
        console.log(err);
        res.status(403).json({message:"Something went wrong", error:err});
    }
}

const updateTransactionStatus = async (req,res) => {
    const { orderid, payment_id} = req.body;
    try{
        const order = await Order.findOne({orderid})
        if(order){
            order.paymentid = payment_id;
            order.status = 'successful';
            await order.save();
            req.user.ispremiumuser = true;
            await req.user.save();
            return res.status(202).json({success: true, message: 'Transaction successful'});
        }else{
            throw new Error("Failed updating transaction");
        }
    }catch(err){
        console.log(err);
        res.status(403).json({error: err, message:'Something went wrong in updating transaction'})
    }               
}

module.exports = {purchasePremium, updateTransactionStatus};