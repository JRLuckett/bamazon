// jshint esversion: 6

const mysql = require('mysql');
const inquirer = require('inquirer');
const cliTable = require('cli-table');
var total = 0;
var newTotal = 0;
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon_db"
});

function itemsToBuy(itemNumber, quantity) {
    connection.query('SELECT * FROM products', function(err, res) {
        if (err) throw err;
        var table = new cliTable({
            head: ['ID', 'Product Name', 'Department', 'Price', 'Stock'],
            colWidths: [5, 30, 15, 10, 10]
        });
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
            );
        }
        console.log(table.toString());
        inquirer.prompt([{
                type: 'name',
                message: 'What is the ID of the product you want to buy?',
                name: 'itemNumber'
            },
            {
                type: 'name',
                message: 'How many units would you like to buy?',
                name: 'quantity'
            }
        ]).then(function(itemNumber) {
            connection.query('SELECT * FROM products WHERE id=?', [itemNumber.itemNumber], function(err, res) {
                if (err) throw err;
                // console.log(itemNumber.quantity);
                var stock = res[0].stock_quantity;
                var amount = itemNumber.quantity;
                if (stock + 1 > amount) {
                    stock -= amount;
                    connection.query('UPDATE products SET stock_quantity =? WHERE id=?',[stock,itemNumber.itemNumber], function(err, res){
                      if (err) throw err;
                    });
                    total = (res[0].price * amount);
                    console.log("Purchased", amount, res[0].product_name + "(s)");
                    console.log("Subtotal = $" + total);
                    inquirer.prompt([{
                        type: 'list',
                        message: 'Would you like to make another purchase?',
                        choices: ["YES", "NO"],
                        name: 'operation'
                    }]).then(function(operation) {
                        if (operation.operation === "YES") {
                            newTotal += total;
                            console.log(newTotal);
                            itemsToBuy();
                        } else {
                          newTotal += total;
                            console.log('Total = $' + newTotal);
                            console.log('Thank you!');
                            process.exit();
                        }
                    });

                } else {
                    console.log("Insufficient quantity!");
                    inquirer.prompt([{
                        type: 'list',
                        message: 'Would you like to make a different purchase?',
                        choices: ["YES", "NO"],
                        name: 'operation'
                    }]).then(function(operation) {
                        if (operation.operation === "YES") {
                            newTotal += total;
                            itemsToBuy();
                        } else {
                            console.log('Thank you!');
                        }
                    });
                }
            });

        });
    });

}
itemsToBuy();
