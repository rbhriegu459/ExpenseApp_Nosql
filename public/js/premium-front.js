// async function rzpAction(e){
    const token = localStorage.getItem('token');
    document.getElementById('premiumbutton').onclick = async function(e) {
        e.preventDefault();
        const response = await axios.get("http://localhost:3000/purchase/permiummembership", {headers: {"Authorization":token}});
        var options = {
            "key": 'rzp_test_ZomU12iYFtqFZq',
            "order_id": response.data.order.id,
            "handler": async function (response){

                try{
                    const res = await axios.post("http://localhost:3000/purchase/updatetransactionstatus",{
                        orderid:response.razorpay_order_id,
                        payment_id: response.razorpay_payment_id
                    }, {headers: {"Authorization":token}});
                
                    alert("You are a Premium User Now!!");
                    showPremium();
                    leaderBoardShow();
                    localStorage.setItem('token', res.data.token);
                } catch(err) {
                    console.log(err);
                }   

            },
        };
        const rzp1 = new Razorpay(options);
        rzp1.open();
        rzp1.on('payment failed', function (response){
            console.log(response);
            alert("Something went wrong!")
        })
    }

    async function showPremium(){
        document.getElementById('premiumbutton').style.visibility = "hidden";
        document.getElementById('premiumuser').innerHTML = "You are premium user now!";
        document.getElementById('expenses').style.visibility = "visible";

        // const x= document.getElementById('downloadedFiles');
        // const responseArray = await axios.get('http://localhost:3000/expense/download', { headers: {"Authorization" : token} })
        // responseArray.data.forEach((fileDetails) => {
        //     x.innerHTML += `<li>Name - ${fileDetails.fileUrl}, Total Expense - ${fileDetails.date}`;
        // })
    }


    function leaderBoardShow(){
        // const inputElement = document.createElement("input");
        // inputElement.type = "button";
        // inputElement.value= "Show LeaderBoard";
        // inputElement.id = "leaderBoardBtn"

        const inputElement = document.getElementById('leaderBoardBtn');
        document.getElementById("downloadExpense").style.visibility = "visible";
        inputElement.style.visibility = "visible";
        
        inputElement.onclick = async() =>{
            
            const token = localStorage.getItem('token');
            document.getElementById('leaderboard').style.visibility = "visible";
            document.getElementById("leaderBoardBtn").style.visibility = "hidden";
            
            const userLeaderBoardArray = await axios.get("http://localhost:3000/premium/showLeaderboard", {headers: {"Authorization": token} });

            var leaderboardElem = document.getElementById('leaderboard');
            leaderboardElem.innerHTML += '<h1>Leader Board </h1>'
            userLeaderBoardArray.data.forEach((userDetails) => {
                leaderboardElem.innerHTML += `<li>Name - ${userDetails.name}, Total Expense - ${userDetails.total_expenses}`;
            })
        }
    }

    async function download(){
        try{
            const response = await axios.get('http://localhost:3000/expense/download', { headers: {"Authorization" : token} })
            var a = document.createElement("a");
            a.href = response.data.fileUrl;
            a.download = 'myexpense.csv';
            a.click();
            console.log(response);
        } 
        catch(err) {
            throw new Error(err);
        };   
    }