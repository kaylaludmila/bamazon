var mysql = require('mysql');
var inquirer = require('inquirer');
var prompt = require('prompt');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon",
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
})


var productTable = function (){
        connection.query('SELECT * FROM products', function(err,rows){
    	if (err) throw err;
    	for (var i = 0; i < rows.length; i++){
    			console.log("--------------------------------------------------------");
    			console.log("ID: " + rows[i].ItemID + " Item: " + rows[i].ProductName +  " Dept: " + rows[i].DepartmentName + " Price: $" + rows[i].Price + " Stock Amount: " + rows[i].StockQuantity);
    	};
        console.log("--------------------------------------------------------");
        goingShopping();
    });
};

productTable();


function goingShopping() {
    inquirer.prompt([
    {    
        type: "number",
        message: "Please state the ID of the product would you like to buy?",
        name: "productNumber",
    },
    {
    	type: "number",
    	message: "How many do you want?",
    	name: "purchaseAmount",
    }
    ]).then(function(user) {
        statedID = user.productNumber;
        purchaseNumber = user.purchaseAmount;

        connection.query('SELECT Price, StockQuantity FROM products WHERE ItemID= ' + statedID, 
            function(err,rows){
            var updatedQuantity = rows[0].StockQuantity - purchaseNumber;
                if (updatedQuantity < 0) {
                console.log("Sorry, insufficient quantity. Try again after we stock up!");
                productTable();
        } else {
            connection.query('UPDATE products set ? WHERE ?',
            [{StockQuantity: rows[0].StockQuantity - purchaseNumber}, {ItemID: statedID}], function(err, res){
                var pricePaid = rows[0].Price * purchaseNumber;
                console.log("Your total was $" + pricePaid);
                console.log("Thanks for shopping!");
                productTable();
                });

            }
        })
    })
};

