const sequelize = require("./util/database");
const express = require('express');
const path = require("path");
const bodyParser = require("body-parser");
const app = express();

// Models import
const Expense = require("./models/expense-model");
const User = require("./models/user-model");
const Order = require('./models/order-model');

// Routes import
const expenseRoute = require('./routes/expense');
const userRoute = require('./routes/user');
const purchaseRoute = require('./routes/purchase');
const premiumRoute = require('./routes/premium');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname, "views","index.html"));
});

app.use('/user', userRoute);
app.use('/expense', expenseRoute);
app.use('/purchase', purchaseRoute);
app.use('/premium', premiumRoute);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

sequelize.sync()
.then(result=>{
    app.listen(3000, ()=>{
      console.log("Server running on port 3000");
    })
}) 
.catch((err)=>{
    console.log("Database Error setting Sequelize",err);
});