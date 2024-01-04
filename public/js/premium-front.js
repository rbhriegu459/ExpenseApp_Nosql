// async function rzpAction(e){
    document.getElementById('premiumbutton').onclick = async function(e) {
        e.preventDefault();
        const token = localStorage.getItem('token');
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

    function leaderBoardShow(){
        const inputElement = document.createElement("input");
        inputElement.type = "button";
        inputElement.value= "Show LeaderBoard";
        inputElement.id = "leaderBoardBtn"

        const inputElement2 = document.createElement("input");
        inputElement2.type = "button";
        inputElement2.value= "Download";
        inputElement2.id = "downloadBtn";

        inputElement2.onclick = async() =>{
            document.getElementById('expenses').style.visibility = "visible";
            document.getElementById('downloadBtn').style.visibility="hidden";
        }
        
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
        document.getElementById("message").appendChild(inputElement);
        document.getElementById("message").appendChild(inputElement2);
    }
