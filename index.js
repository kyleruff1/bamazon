var mysql = require('mysql');
var inquirer = require('inquirer');


// mySQL info
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Passw00rd",
    database: "Bamazon"
});

// connect to mySQL database
connection.connect(function(err) {
    if (err) throw err;
    // get all products
    getAllProducts().then(function(result) {
        // then list them
        result.forEach(function(item) {
            console.log('Item ID: ' + item.item_id + ' | Product Name: ' + item.product_name + ' | Price: ' + item.price);
        });
    // then ask what the user would like to do
    }).then(function() {
        return whatWouldYouLike();
    });
});

function getAllProducts() {
    return new Promise(function(resolve, reject) {
        // query for all items in products table
        connection.query("SELECT * FROM products", function(err, res) {
            if (err) reject(err);
            resolve(res);
        });
    });
}

function whatWouldYouLike() {
    return inquirer.prompt([{
        name: 'product_id',
        message: 'What is the ID of the product you would like to buy?',
        type: 'input',
        validate: function(value) {
            if (isNaN(value) === false) {
                return true;
            } else {
                console.log('\nPlease enter a valid ID.');
                return false;
            }
        }
    }, {
        name: 'number_of_units',
        message: 'How many units would you like to buy?',
        type: 'input',
        validate: function(value) {
            if (isNaN(value) === false) {
                return true;
            } else {
                console.log('\nPlease enter a valid quantity.');
                return false;
            }
        }
    }]).then(function(answer) {
        return new Promise(function(resolve, reject) {
            // query for all items 
            connection.query("SELECT * FROM products WHERE item_id=?", answer.product_id, function(err, res) {
                if (err) reject(err);
                resolve(res);
            });
        }).then(function(result) {
            // if there aren't enough of the item
            if (answer.number_of_units > result[0].stock_quantity) {
                return "Insufficient quantity!";
            } else {
                var object = {};
                // answer is the users responses to the prompts
                object.answer = answer;
                // result is the results of the query
                object.result = result;
                return object;
            }
        }).catch(function(err) {
            console.log(err);
            connection.destroy();
        }).then(function(object) {
            // if there was sufficient quantity
            if (object.answer) {
                var newQuantity = object.result[0].stock_quantity - object.answer.number_of_units;
                var product = object.answer.product_id;
                var totalCost = (object.result[0].price * object.answer.number_of_units).toFixed(2);
                // query that updates the quantity of the item
                connection.query("UPDATE products SET stock_quantity=? WHERE item_id=?", [newQuantity, product], function(err, res) {
                    if (err) reject(err);
                    console.log('Your total cost is $' + totalCost);
                    // destroy connection
                    connection.destroy();
                });
            } else {
                console.log(object);
                // destroy connection
                connection.destroy();
            }
        });
    });
}