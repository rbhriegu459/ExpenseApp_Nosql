const Razorpay= require('razorpay');
const Order = require('../models/order-model');
const userController = require('./user-controller');

const purchasePremium = (req,res) => {
    try{
        var rzp = new Razorpay({
            key_id: 'rzp_test_cdBK53MEGt8dAR',
            key_secret: 'XkXlOsayexPo5TnDjOknVlcl'
        })

        var options = {
            amount:2500,
            currency:'INR',
            receipt:'rcp1'
          };

        rzp.orders.create(options, async function(err, order) {
            console.log(order.id);
            if(err){
                console.log(err);
            } 
            await req.user.createOrder({orderid:order.id, status:"PENDING"})
            return res.status(201).json({order, key_id:rzp.key_id});
          })
    } catch(err){
        console.log(err);
        res.status(403).json({message:"Something went wrong", error:err});
    }
}

const updateTransactionStatus = async (req,res) => {
    try{
        // console.log(req)
        const {payment_id, orderid} = req.body;
        const order = await Order.findOne({where: {orderid:orderid}})
        const promise1 = order.update({payment_id:payment_id, status:"SUCCESSFUl"});
        const promise2 =  req.user.update({ispremiumuser:true});

        console.log(req.user.id);
        Promise.all([promise1, promise2]).then(() => {
            return res.status(202).json({success:true, message:"Transaction Successful" ,token: userController.generateAccessToken(req.user.id, undefined, true)})
        })
        .catch(err => {
            throw new Error(err);
        });
    }
    catch(err){
        console.log(err);
        res.status(403).json({error:err, message:"Something went wrong"});
    }
                
}

module.exports = {purchasePremium, updateTransactionStatus};